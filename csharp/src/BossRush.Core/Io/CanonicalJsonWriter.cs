// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace BossRush.Core.Io;

/// <summary>
/// Hand-rolled JSON writer that produces byte-identical output to
/// Python 3's <c>json.dump(obj, indent=2, sort_keys=True)</c>.
///
/// Why not System.Text.Json? Three reasons:
///
///   1. Key sorting: S.T.J does not sort object keys deterministically in
///      .NET 8 without a custom converter per type.
///   2. Indent separators: S.T.J emits <c>": "</c> between key and value
///      (matches Python) but emits <c>","</c> with no space and a newline
///      between entries (also matches Python). That part's fine. However S.T.J
///      outputs a trailing newline in some code paths; Python's json.dump
///      never does.
///   3. Escaping: S.T.J escapes non-ASCII by default in some configurations
///      and requires JavaScriptEncoder wiring to match Python behavior
///      (Python json.dump with ensure_ascii=True, its default, escapes
///      non-ASCII as \u sequences).
///
/// The implementation is ~200 lines, self-contained, no dependencies.
/// It targets exactly the subset we need:
///   string, int (long), double (used only if ever — DropPlan has no floats),
///   bool, null, list/array, dictionary. Dictionary keys are always strings
///   and are sorted lexicographically by UTF-16 ordinal (same as Python's
///   sorted() on str).
/// </summary>
public static class CanonicalJsonWriter
{
    /// <summary>
    /// Serialize <paramref name="value"/> to a UTF-8 byte buffer formatted
    /// identically to Python <c>json.dump(value, indent=2, sort_keys=True)</c>.
    /// Does NOT append a trailing newline (Python's json.dump doesn't either).
    /// </summary>
    public static byte[] Serialize(object? value)
    {
        var sb = new StringBuilder(capacity: 64 * 1024);
        WriteValue(sb, value, indentLevel: 0);
        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    public static string SerializeToString(object? value)
    {
        var sb = new StringBuilder(capacity: 64 * 1024);
        WriteValue(sb, value, indentLevel: 0);
        return sb.ToString();
    }

    private const string IndentUnit = "  "; // two spaces, matches Python indent=2

    private static void WriteValue(StringBuilder sb, object? value, int indentLevel)
    {
        switch (value)
        {
            case null:
                sb.Append("null");
                return;

            case bool b:
                sb.Append(b ? "true" : "false");
                return;

            case string s:
                WriteString(sb, s);
                return;

            case int i32:
                sb.Append(i32.ToString(CultureInfo.InvariantCulture));
                return;

            case long i64:
                sb.Append(i64.ToString(CultureInfo.InvariantCulture));
                return;

            case double d:
                // Python json writes floats via repr(). .NET R-format produces
                // the shortest round-trip form, which coincides with Python for
                // finite values. For NaN/Infinity Python raises ValueError;
                // mirror that.
                if (double.IsNaN(d) || double.IsInfinity(d))
                    throw new ArgumentException("Cannot serialize NaN/Infinity to canonical JSON");
                sb.Append(d.ToString("R", CultureInfo.InvariantCulture));
                return;

            case IDictionary dict:
                WriteDict(sb, dict, indentLevel);
                return;

            case IEnumerable enumerable:
                WriteList(sb, enumerable, indentLevel);
                return;

            default:
                throw new NotSupportedException(
                    $"CanonicalJsonWriter does not know how to serialize type {value.GetType()}");
        }
    }

    private static void WriteDict(StringBuilder sb, IDictionary dict, int indentLevel)
    {
        if (dict.Count == 0)
        {
            sb.Append("{}");
            return;
        }

        // Sort keys lexicographically by UTF-16 ordinal. Python's default
        // sorted(dict.keys()) on str uses Unicode code-point order, which
        // StringComparer.Ordinal matches for BMP strings we use here (boss
        // flag strings, category names — all ASCII).
        var keys = new List<string>(dict.Count);
        foreach (var k in dict.Keys)
        {
            if (k is not string ks)
                throw new NotSupportedException("CanonicalJsonWriter requires string dictionary keys");
            keys.Add(ks);
        }
        keys.Sort(StringComparer.Ordinal);

        sb.Append('{');
        string childIndent = new StringBuilder().Insert(0, IndentUnit, indentLevel + 1).ToString();
        string thisIndent = new StringBuilder().Insert(0, IndentUnit, indentLevel).ToString();

        for (int i = 0; i < keys.Count; i++)
        {
            sb.Append(i == 0 ? "\n" : ",\n");
            sb.Append(childIndent);
            WriteString(sb, keys[i]);
            sb.Append(": ");
            WriteValue(sb, dict[keys[i]], indentLevel + 1);
        }
        sb.Append('\n');
        sb.Append(thisIndent);
        sb.Append('}');
    }

    private static void WriteList(StringBuilder sb, IEnumerable enumerable, int indentLevel)
    {
        var items = enumerable.Cast<object?>().ToList();
        if (items.Count == 0)
        {
            sb.Append("[]");
            return;
        }

        sb.Append('[');
        string childIndent = new StringBuilder().Insert(0, IndentUnit, indentLevel + 1).ToString();
        string thisIndent = new StringBuilder().Insert(0, IndentUnit, indentLevel).ToString();

        for (int i = 0; i < items.Count; i++)
        {
            sb.Append(i == 0 ? "\n" : ",\n");
            sb.Append(childIndent);
            WriteValue(sb, items[i], indentLevel + 1);
        }
        sb.Append('\n');
        sb.Append(thisIndent);
        sb.Append(']');
    }

    private static void WriteString(StringBuilder sb, string s)
    {
        // Python json default (ensure_ascii=True) escapes:
        //   "   -> \"
        //   \   -> \\
        //   control chars 0x00..0x1F   -> \uXXXX (or the named short forms
        //                                  \b \f \n \r \t)
        //   non-ASCII (>= 0x80)         -> \uXXXX (UTF-16 code units;
        //                                  surrogate pairs are emitted as two
        //                                  separate \uXXXX escapes)
        sb.Append('"');
        for (int i = 0; i < s.Length; i++)
        {
            char c = s[i];
            switch (c)
            {
                case '\\': sb.Append("\\\\"); break;
                case '"':  sb.Append("\\\""); break;
                case '\b': sb.Append("\\b"); break;
                case '\f': sb.Append("\\f"); break;
                case '\n': sb.Append("\\n"); break;
                case '\r': sb.Append("\\r"); break;
                case '\t': sb.Append("\\t"); break;
                default:
                    if (c < 0x20 || c >= 0x7F)
                    {
                        sb.Append("\\u");
                        sb.Append(((int)c).ToString("x4", CultureInfo.InvariantCulture));
                    }
                    else
                    {
                        sb.Append(c);
                    }
                    break;
            }
        }
        sb.Append('"');
    }
}
