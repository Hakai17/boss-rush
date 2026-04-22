// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Loads PARAMDEF XML files that are embedded as resources in this assembly
/// (see <c>IgniteBossRush.Core.csproj</c>, which marks
/// <c>Patching/Paramdefs/*.xml</c> as <c>&lt;EmbeddedResource/&gt;</c>).
///
/// <para>
/// We bundle the XMLs rather than reading them from disk so a packaged
/// release (single <c>.exe</c> drop, NuGet install, etc.) still has the
/// paramdefs on hand. The XMLs come from
/// <c>soulsmods/Paramdex@master/ER/Defs/</c> — the community-maintained
/// canonical set. They are licensed under the project's LICENSE file and
/// carried here verbatim; do not edit them in place.
/// </para>
///
/// <para>
/// <b>Resource lookup.</b> .NET prefixes embedded resource names with the
/// assembly's default namespace (<c>IgniteBossRush.Core</c>) plus the
/// relative path, dot-separated, so
/// <c>Patching/Paramdefs/EquipParamGoods.xml</c> becomes
/// <c>IgniteBossRush.Core.Patching.Paramdefs.EquipParamGoods.xml</c>. Rather
/// than hardcoding that prefix — which is brittle against namespace
/// renames — we suffix-match on the basename.
/// </para>
///
/// <para>
/// <b>Caching.</b> PARAMDEF objects are immutable after
/// <see cref="PARAMDEF.XmlDeserialize(Stream, bool, bool)"/> returns, and
/// multiple PARAM rows can share the same <c>PARAMDEF.Field</c> references
/// safely (see <see cref="PARAM.Row"/>'s copy constructor). We cache one
/// deserialized instance per XML filename so back-to-back mutation calls
/// (three PARAM tables per patch) don't re-parse the same XML document.
/// </para>
/// </summary>
public static class ParamdefLoader
{
    private static readonly object s_gate = new();
    private static readonly System.Collections.Generic.Dictionary<string, PARAMDEF> s_cache =
        new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Returns the PARAMDEF parsed from the embedded XML resource whose
    /// filename (basename only) matches <paramref name="xmlFileName"/>.
    /// Throws with a diagnostic listing if the resource isn't present —
    /// which usually means the csproj lost its <c>EmbeddedResource</c>
    /// entry, not a real caller bug.
    /// </summary>
    public static PARAMDEF Load(string xmlFileName)
    {
        if (string.IsNullOrWhiteSpace(xmlFileName))
            throw new ArgumentException("xmlFileName must be non-empty", nameof(xmlFileName));

        lock (s_gate)
        {
            if (s_cache.TryGetValue(xmlFileName, out var cached))
                return cached;

            Assembly asm = typeof(ParamdefLoader).Assembly;
            string[] all = asm.GetManifestResourceNames();
            string? match = all.FirstOrDefault(n =>
                n.EndsWith("." + xmlFileName, StringComparison.OrdinalIgnoreCase));

            if (match is null)
                throw new InvalidOperationException(
                    $"Embedded paramdef resource '{xmlFileName}' not found. "
                    + $"Known resources: [{string.Join(", ", all)}]. "
                    + "Check that the csproj still marks "
                    + "Patching/Paramdefs/*.xml as <EmbeddedResource/>.");

            using Stream? s = asm.GetManifestResourceStream(match)
                ?? throw new InvalidOperationException(
                    $"GetManifestResourceStream returned null for '{match}'.");

            // validateFields:true would reject Paramdex's field names that
            // contain non-word characters (e.g. bitfield decorators). The
            // Paramdex files we ship are known-clean from the upstream repo,
            // so we keep strict validation on to catch any accidental edit.
            PARAMDEF def = PARAMDEF.XmlDeserialize(s, versionAware: false, validateFields: true);
            s_cache[xmlFileName] = def;
            return def;
        }
    }

    /// <summary>
    /// Clear the PARAMDEF cache. Intended for tests — production code should
    /// load once and reuse the cached defs for the lifetime of the process.
    /// </summary>
    internal static void ClearCacheForTests()
    {
        lock (s_gate) s_cache.Clear();
    }
}
