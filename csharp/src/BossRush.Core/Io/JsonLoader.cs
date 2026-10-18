// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using System.Text.Json;

namespace BossRush.Core.Io;

/// <summary>
/// Thin wrapper around System.Text.Json for reading the pipeline's input
/// JSON files (flag_pool.json, exclusions.json, boss_catalog.json, drops.json).
/// Configured to mirror Python's json.load tolerance: case-insensitive
/// property names are OFF (we want mismatches to fail loudly), comments and
/// trailing commas are permitted (some hand-edited fixtures use them).
/// </summary>
public static class JsonLoader
{
    private static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = null,
        PropertyNameCaseInsensitive = false,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true,
    };

    public static T LoadFile<T>(string path)
    {
        using var fs = File.OpenRead(path);
        var result = JsonSerializer.Deserialize<T>(fs, Options)
            ?? throw new InvalidDataException($"Deserialize returned null for {path}");
        return result;
    }

    public static T LoadText<T>(string json)
    {
        var result = JsonSerializer.Deserialize<T>(json, Options)
            ?? throw new InvalidDataException("Deserialize returned null");
        return result;
    }
}
