// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using System.Linq;
using SoulsFormats;

namespace BossRush.Core.Io;

/// <summary>
/// Load / save a TalkESD file (e.g. Merchant Kalé's t600001110.esd) that lives
/// inside a <c>talkesdbnd.dcx</c> BND4 container. The BND4 handles its own DCX
/// wrapping transparently via <see cref="SoulsFile{T}.Read(string)"/>; the
/// individual ESD entries inside the BND are raw (uncompressed) ESD bytes.
///
/// <para>
/// We keep this a thin wrapper rather than hiding the BND4 from callers because
/// re-packing requires the exact BinderFile entry the caller originally read
/// from (to preserve header flags, IDs, and the other .esd files in the
/// container byte-for-byte). The splicer mutates the ESD in place and this
/// class only mediates read-from-bnd / write-back-to-bnd.
/// </para>
/// </summary>
public static class EsdIo
{
    /// <summary>
    /// Read the entire talkesdbnd.dcx and locate a single ESD entry by
    /// filename (case-insensitive, basename match on the BND entry's stored
    /// name — which is a Windows-style path like
    /// <c>N:\GR\data\Param\...t600001110.esd</c>).
    /// </summary>
    public static LoadedEsd LoadFromBnd(string bndPath, string esdFileName)
    {
        if (bndPath is null) throw new ArgumentNullException(nameof(bndPath));
        if (esdFileName is null) throw new ArgumentNullException(nameof(esdFileName));

        BND4 bnd = BND4.Read(bndPath);
        BinderFile? entry = null;
        foreach (var f in bnd.Files)
        {
            string name = Path.GetFileName((f.Name ?? string.Empty).Replace('\\', '/'));
            if (string.Equals(name, esdFileName, StringComparison.OrdinalIgnoreCase))
            {
                entry = f;
                break;
            }
        }
        if (entry is null)
        {
            string available = string.Join(", ",
                bnd.Files.Select(f => Path.GetFileName((f.Name ?? string.Empty).Replace('\\', '/'))));
            throw new FileNotFoundException(
                $"Entry '{esdFileName}' not found inside '{bndPath}'. "
                + $"Available entries: {available}");
        }

        ESD esd = ESD.Read(entry.Bytes);
        return new LoadedEsd(bnd, entry, esd);
    }

    /// <summary>
    /// Serialize the (possibly mutated) ESD back into its originating
    /// BinderFile entry and write the whole BND4 to <paramref name="outPath"/>.
    /// All other entries in the container are preserved byte-for-byte.
    /// </summary>
    public static void SaveToBnd(LoadedEsd loaded, string outPath)
    {
        if (loaded is null) throw new ArgumentNullException(nameof(loaded));
        if (outPath is null) throw new ArgumentNullException(nameof(outPath));

        loaded.Entry.Bytes = loaded.Esd.Write();
        string? dir = Path.GetDirectoryName(outPath);
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);
        loaded.Bnd.Write(outPath);
    }
}

/// <summary>
/// Handle returned by <see cref="EsdIo.LoadFromBnd"/>: the owning BND4, the
/// specific BinderFile entry the ESD was read from, and the decoded ESD.
/// Mutate <see cref="Esd"/> and pass back to <see cref="EsdIo.SaveToBnd"/>.
/// </summary>
public sealed record LoadedEsd(BND4 Bnd, BinderFile Entry, ESD Esd);
