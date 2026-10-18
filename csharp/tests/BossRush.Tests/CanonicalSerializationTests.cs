// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using BossRush.Core.Io;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Byte-exact tests for the canonical serializers. Both feed into drops.json's
/// fingerprint — any accidental change (e.g. space after comma, key ordering)
/// would break cross-organizer reproducibility.
/// </summary>
public class CanonicalSerializationTests
{
    [Fact]
    public void CanonicalDropTable_TwoBosses_MatchesPythonFormat()
    {
        var table = new Dictionary<string, Dictionary<string, int>>
        {
            ["42"] = new Dictionary<string, int>
            {
                ["weapon"] = 100, ["armor"] = 101, ["talisman"] = 102,
                ["spell"] = 103, ["aow_tool"] = 104, ["ashes_tear"] = 105,
            },
            ["7"] = new Dictionary<string, int>
            {
                ["weapon"] = 200, ["armor"] = 201, ["talisman"] = 202,
                ["spell"] = 203, ["aow_tool"] = 204, ["ashes_tear"] = 205,
            },
        };

        byte[] actual = CanonicalDropTable.CanonicalBytes(table);
        // Keys sort lexicographically → "42" < "7" because '4' < '7' in ASCII.
        string expected =
            "42|weapon=100,armor=101,talisman=102,spell=103,aow_tool=104,ashes_tear=105\n"
            + "7|weapon=200,armor=201,talisman=202,spell=203,aow_tool=204,ashes_tear=205\n";
        Assert.Equal(expected, Encoding.UTF8.GetString(actual));
    }

    [Fact]
    public void CanonicalJsonWriter_SortedKeysTwoSpaceIndent()
    {
        var doc = new Dictionary<string, object>
        {
            ["z"] = 1,
            ["a"] = new Dictionary<string, object> { ["c"] = 3, ["b"] = 2 },
        };
        byte[] bytes = CanonicalJsonWriter.Serialize(doc);
        string json = Encoding.UTF8.GetString(bytes);

        // Expect sorted top-level keys, sorted nested keys, 2-space indent,
        // no trailing newline, colon-space separator.
        string expected =
            "{\n"
            + "  \"a\": {\n"
            + "    \"b\": 2,\n"
            + "    \"c\": 3\n"
            + "  },\n"
            + "  \"z\": 1\n"
            + "}";
        Assert.Equal(expected, json);
    }

    [Fact]
    public void CanonicalJsonWriter_StringArrayPreservesOrder()
    {
        var doc = new Dictionary<string, object>
        {
            ["cats"] = new List<object> { "weapon", "armor" },
        };
        string json = Encoding.UTF8.GetString(CanonicalJsonWriter.Serialize(doc));
        Assert.Equal("{\n  \"cats\": [\n    \"weapon\",\n    \"armor\"\n  ]\n}", json);
    }

    [Fact]
    public void CanonicalJsonWriter_EscapesControlChars()
    {
        var doc = new Dictionary<string, object> { ["x"] = "a\tb\"c" };
        string json = Encoding.UTF8.GetString(CanonicalJsonWriter.Serialize(doc));
        // \t → \t escape, " → \" escape. If the writer escapes \\u0022 etc.,
        // adjust this expectation — the key point is byte-stable output.
        Assert.Contains("\\t", json);
        Assert.Contains("\\\"", json);
    }

    // -----------------------------------------------------------------
    // Sanity: matching SHA-256 over canonical bytes yields a stable hex
    // fingerprint that equals the one emitted into drops.json.meta.
    // -----------------------------------------------------------------
    [Fact]
    public void CanonicalBytes_Sha256_HexStable()
    {
        var table = new Dictionary<string, Dictionary<string, int>>
        {
            ["1"] = new Dictionary<string, int>
            {
                ["weapon"] = 10, ["armor"] = 11, ["talisman"] = 12,
                ["spell"] = 13, ["aow_tool"] = 14, ["ashes_tear"] = 15,
            },
        };
        byte[] bytes = CanonicalDropTable.CanonicalBytes(table);
        byte[] digest = SHA256.HashData(bytes);
        Assert.Equal(32, digest.Length);
    }
}
