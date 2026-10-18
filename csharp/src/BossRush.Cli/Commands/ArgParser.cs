// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;

namespace BossRush.Cli.Commands;

internal sealed class CliUsageException : Exception
{
    public CliUsageException(string message) : base(message) { }
}

/// <summary>
/// Minimal long-option parser: <c>--name value</c> pairs plus bare
/// <c>--flag</c> toggles. Duplicates raise, unknowns raise, missing values
/// raise — we want loud failures for miswired CI/organizer runs. No short
/// options; the flag names are long enough to self-document in runbooks.
/// </summary>
internal sealed class ArgParser
{
    private readonly Dictionary<string, string> _values = new(StringComparer.Ordinal);
    private readonly HashSet<string> _flags = new(StringComparer.Ordinal);
    private readonly HashSet<string> _known;

    public ArgParser(IEnumerable<string> knownOptions, IEnumerable<string>? knownFlags = null)
    {
        _known = new HashSet<string>(knownOptions, StringComparer.Ordinal);
        if (knownFlags != null)
        {
            foreach (var f in knownFlags)
                _known.Add(f);
        }
        KnownFlagSet = new HashSet<string>(knownFlags ?? Array.Empty<string>(), StringComparer.Ordinal);
    }

    private HashSet<string> KnownFlagSet { get; }

    public void Parse(string[] args)
    {
        for (int i = 0; i < args.Length; i++)
        {
            string a = args[i];
            if (a == "--help" || a == "-h")
            {
                _flags.Add("--help");
                continue;
            }
            if (!a.StartsWith("--", StringComparison.Ordinal))
                throw new CliUsageException($"Unexpected positional argument: {a}");
            if (!_known.Contains(a))
                throw new CliUsageException($"Unknown option: {a}");

            if (KnownFlagSet.Contains(a))
            {
                if (!_flags.Add(a))
                    throw new CliUsageException($"Duplicate flag: {a}");
                continue;
            }

            if (i + 1 >= args.Length)
                throw new CliUsageException($"Option {a} requires a value");
            string val = args[++i];
            if (_values.ContainsKey(a))
                throw new CliUsageException($"Duplicate option: {a}");
            _values[a] = val;
        }
    }

    public bool HasFlag(string name) => _flags.Contains(name);

    public string Required(string name)
    {
        if (!_values.TryGetValue(name, out var v))
            throw new CliUsageException($"Missing required option: {name}");
        return v;
    }

    public string? Optional(string name) =>
        _values.TryGetValue(name, out var v) ? v : null;
}
