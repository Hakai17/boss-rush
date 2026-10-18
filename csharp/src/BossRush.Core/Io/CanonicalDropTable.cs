// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;
using System.Text;
using BossRush.Core.Models;

namespace BossRush.Core.Io;

/// <summary>
/// Mirror of Python generate.py's <c>canonical_drop_table_bytes()</c>.
/// The output of this method (its SHA-256) is the fingerprint committed
/// pre-competition; any change to the byte format breaks reproducibility.
///
/// Format per line:
///   &lt;boss_key&gt;|weapon=&lt;lot&gt;,armor=&lt;lot&gt;,talisman=&lt;lot&gt;,spell=&lt;lot&gt;,aow_tool=&lt;lot&gt;,ashes_tear=&lt;lot&gt;
/// Lines separated by <c>\n</c>. File ends with a trailing <c>\n</c>.
/// Sorted lexicographically by boss_key (string sort). UTF-8 encoding.
/// </summary>
public static class CanonicalDropTable
{
    public static byte[] CanonicalBytes(
        IReadOnlyDictionary<string, Dictionary<string, int>> dropTable)
    {
        var keys = new List<string>(dropTable.Keys);
        keys.Sort(System.StringComparer.Ordinal);

        var sb = new StringBuilder(dropTable.Count * 128);
        foreach (var bossKey in keys)
        {
            var row = dropTable[bossKey];
            sb.Append(bossKey);
            sb.Append('|');
            for (int i = 0; i < CategoryNames.Ordered.Count; i++)
            {
                if (i > 0) sb.Append(',');
                string cat = CategoryNames.Ordered[i];
                sb.Append(cat).Append('=').Append(row[cat]);
            }
            sb.Append('\n');
        }
        return Encoding.UTF8.GetBytes(sb.ToString());
    }
}
