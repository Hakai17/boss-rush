// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows;

namespace BossRush.Gui;

/// <summary>
/// WPF application bootstrap. The bulk of the work here is wiring native DLL
/// resolution for the two SoulsFormats compression backends that the pipeline
/// needs:
/// <list type="bullet">
///   <item><b>Oodle</b> (<c>oo2core_6_win64.dll</c>) — DCX_KRAK, required by
///         every <c>.emevd.dcx</c> / <c>.msgbnd.dcx</c> / <c>regulation.bin</c>
///         round-trip.</item>
///   <item><b>ZStandard</b> (<c>libzstd.dll</c> inside an <c>x64\</c>
///         subfolder) — DCX_ZSTD, required by <c>.talkesdbnd.dcx</c> and a
///         handful of EMEVDs. Comes from the ZstdNet NuGet package.</item>
/// </list>
/// Both break under <c>PublishSingleFile=true</c> without intervention:
/// <list type="bullet">
///   <item>SoulsFormats calls <c>[DllImport("oo2core_6_win64")]</c> with no
///         path. In single-file mode the .NET "application directory" is the
///         <c>%TEMP%\.net\...\</c> extract dir, not where the launcher exe
///         and shipped DLL sit.</item>
///   <item>ZstdNet's own static constructor computes the DLL path from
///         <c>typeof(ExternMethods).Assembly.Location</c>, which returns
///         <c>""</c> for embedded assemblies in single-file mode, so its
///         <c>SetDllDirectory</c> call gets garbage input.</item>
/// </list>
/// Fix uses three layered mitigations, run once at startup before MainWindow
/// instantiation so they're in place before any pipeline code touches DCX:
/// <list type="number">
///   <item>Eagerly <see cref="NativeLibrary.TryLoad(string, out IntPtr)"/>
///         each DLL by absolute path under <see cref="AppContext.BaseDirectory"/>
///         (which IS the launcher dir even in single-file mode), so the
///         module is in the process's loaded-module table for any subsequent
///         LoadLibrary-by-name call to find.</item>
///   <item>Register <see cref="NativeLibrary.SetDllImportResolver"/> on each
///         upstream assembly so our absolute-path lookup beats the .NET
///         runtime's default native search path. ZstdNet loads lazily, so we
///         hook <see cref="AppDomain.AssemblyLoad"/> and attach the resolver
///         the moment it arrives.</item>
///   <item>Call Win32 <c>SetDllDirectory</c> with the launcher dir, adding
///         it to the process-wide DLL search path as a belt-and-suspenders.</item>
/// </list>
/// The <c>x64\libzstd.dll</c> subfolder layout matches what
/// <c>ZstdNet.targets</c> produces; keeping that shape means the same build
/// output works for both multi-file and single-file publishes without a
/// second set of rules.
/// </summary>
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        string baseDir = AppContext.BaseDirectory;

        // Oodle — any of 9 / 8 / 6 will do. SoulsFormats tries each in turn
        // via its own GetOodleCompressor; pre-loading whichever exists wins.
        foreach (string name in new[] { "oo2core_9_win64.dll", "oo2core_8_win64.dll", "oo2core_6_win64.dll" })
        {
            string path = Path.Combine(baseDir, name);
            if (File.Exists(path))
                NativeLibrary.TryLoad(path, out _);
        }

        // libzstd lives in an arch subfolder (x64\ or x86\) per ZstdNet.targets.
        // Also probe the root in case someone flattened it during distribution.
        string archDir = Environment.Is64BitProcess ? "x64" : "x86";
        string libzstdArch = Path.Combine(baseDir, archDir, "libzstd.dll");
        string libzstdRoot = Path.Combine(baseDir, "libzstd.dll");
        if (File.Exists(libzstdArch))
            NativeLibrary.TryLoad(libzstdArch, out _);
        else if (File.Exists(libzstdRoot))
            NativeLibrary.TryLoad(libzstdRoot, out _);

        // DllImport resolver on SoulsFormats for oo2core_* calls.
        NativeLibrary.SetDllImportResolver(typeof(SoulsFormats.DCX).Assembly, ResolveOodle);

        // DllImport resolver on ZstdNet for libzstd calls. ZstdNet loads lazily
        // (on first ZSTD decompress), so walk currently-loaded assemblies and
        // fall back to an AssemblyLoad hook if it's not there yet. We avoid
        // typeof(ZstdNet.X).Assembly on purpose — that would force an early
        // static-constructor run on ZstdNet, which is exactly what breaks
        // under single-file.
        Assembly? zstdNetAsm = Array.Find(
            AppDomain.CurrentDomain.GetAssemblies(),
            a => string.Equals(a.GetName().Name, "ZstdNet", StringComparison.OrdinalIgnoreCase));

        if (zstdNetAsm is not null)
        {
            NativeLibrary.SetDllImportResolver(zstdNetAsm, ResolveLibZstd);
        }
        else
        {
            AppDomain.CurrentDomain.AssemblyLoad += (_, ev) =>
            {
                if (string.Equals(ev.LoadedAssembly.GetName().Name, "ZstdNet", StringComparison.OrdinalIgnoreCase))
                {
                    try { NativeLibrary.SetDllImportResolver(ev.LoadedAssembly, ResolveLibZstd); }
                    catch (InvalidOperationException) { /* already set — benign */ }
                }
            };
        }

        // Belt-and-suspenders: add the launcher dir to the process-wide DLL
        // search path for any native binding the runtime falls back to.
        SetDllDirectory(baseDir);

        base.OnStartup(e);
    }

    private static IntPtr ResolveOodle(
        string libraryName,
        Assembly assembly,
        DllImportSearchPath? searchPath)
    {
        if (!libraryName.StartsWith("oo2core_", StringComparison.OrdinalIgnoreCase))
            return IntPtr.Zero;

        string baseDir = AppContext.BaseDirectory;
        string[] candidates =
        {
            libraryName + ".dll",        // exactly what SoulsFormats asked for
            "oo2core_9_win64.dll",       // fallback: any known variant counts
            "oo2core_8_win64.dll",
            "oo2core_6_win64.dll",
        };

        foreach (string fileName in candidates)
        {
            string fullPath = Path.Combine(baseDir, fileName);
            if (File.Exists(fullPath) && NativeLibrary.TryLoad(fullPath, out IntPtr handle))
                return handle;
        }

        return IntPtr.Zero;
    }

    private static IntPtr ResolveLibZstd(
        string libraryName,
        Assembly assembly,
        DllImportSearchPath? searchPath)
    {
        if (!libraryName.Equals("libzstd", StringComparison.OrdinalIgnoreCase) &&
            !libraryName.Equals("libzstd.dll", StringComparison.OrdinalIgnoreCase))
            return IntPtr.Zero;

        string baseDir = AppContext.BaseDirectory;
        string archDir = Environment.Is64BitProcess ? "x64" : "x86";
        string[] paths =
        {
            Path.Combine(baseDir, archDir, "libzstd.dll"),
            Path.Combine(baseDir, "libzstd.dll"),
        };

        foreach (string fullPath in paths)
        {
            if (File.Exists(fullPath) && NativeLibrary.TryLoad(fullPath, out IntPtr handle))
                return handle;
        }

        return IntPtr.Zero;
    }

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool SetDllDirectory(string lpPathName);
}
