// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Security.Cryptography;
using System.Text;

namespace BossRush.Core.Prng;

/// <summary>
/// Port of the seeded drop generator's <c>DeterministicRNG</c>. The refill
/// layout matches that generator, but the domain tag is <c>BossRush-v1</c>.
/// Seeds produced under the previous tag will not match.
///
/// Construction of each 256-byte refill block:
///
///     SHAKE-256 (
///         DOMAIN_TAG ("BossRush-v1\0", 12 bytes)
///      ++ u32 little-endian: len(seed_bytes)
///      ++ seed bytes (UTF-8)
///      ++ u32 little-endian: len(domain_bytes)
///      ++ domain bytes (UTF-8)
///      ++ u64 little-endian: counter
///     ) -&gt; 256 byte output; counter++ per refill.
///
/// <see cref="NextUInt64"/> consumes 8 bytes at a time, little-endian.
///
/// <see cref="RandBelow"/> uses Python's mask-and-reject algorithm so the
/// sequence of rejected/accepted samples matches exactly. DO NOT change to
/// a different uniform-sampling algorithm — drops.canonical fingerprints
/// depend on the exact sequence of rolls.
///
/// SHAKE-256 is provided by <see cref="System.Security.Cryptography.Shake256"/>
/// which ships natively in .NET 8. It wraps the OS's Keccak implementation
/// (CNG on Windows 10+ via the OS-level SHAKE provider, OpenSSL 3 on Linux,
/// CommonCrypto/BCrypt on macOS) and produces byte-identical output to
/// Python's <c>hashlib.shake_256</c> — both are spec-compliant FIPS 202
/// SHAKE-256. An <see cref="Shake256.IsSupported"/> probe in the constructor
/// surfaces a clear error if the host OS is too old (e.g. pre-1903 Win10).
/// </summary>
public sealed class ShakeDeterministicRng
{
    // "BossRush-v1\0" — 12 bytes: 11 ASCII + NUL.
    private static readonly byte[] DomainTag =
        new byte[] { (byte)'B', (byte)'o', (byte)'s', (byte)'s',
                     (byte)'R', (byte)'u', (byte)'s', (byte)'h',
                     (byte)'-', (byte)'v', (byte)'1', 0x00 };

    private const int RefillSize = 256; // must match Python: h.digest(256)

    private readonly byte[] _seedBytes;
    private readonly byte[] _domainBytes;
    private ulong _counter;
    private byte[] _buf;
    private int _pos;

    public ShakeDeterministicRng(string seed, string domain = "")
    {
        if (!Shake256.IsSupported)
        {
            throw new PlatformNotSupportedException(
                "SHAKE-256 is not supported on this OS/runtime. Requires .NET 8 " +
                "on Windows 10 1903+ (CNG), Linux with OpenSSL 3+, or macOS 11+.");
        }
        _seedBytes = Encoding.UTF8.GetBytes(seed);
        _domainBytes = Encoding.UTF8.GetBytes(domain);
        _counter = 0;
        _buf = Array.Empty<byte>();
        _pos = 0;
    }

    private void Refill()
    {
        // Re-create a fresh sponge state per refill. Shake256 is a
        // HashAlgorithm-style streaming API: AppendData feeds the absorb
        // phase, GetHashAndReset runs the squeeze phase for N bytes.
        using var shake = new Shake256();

        shake.AppendData(DomainTag);

        Span<byte> lenBuf = stackalloc byte[8];
        WriteU32LE(lenBuf, (uint)_seedBytes.Length);
        shake.AppendData(lenBuf[..4]);
        shake.AppendData(_seedBytes);

        WriteU32LE(lenBuf, (uint)_domainBytes.Length);
        shake.AppendData(lenBuf[..4]);
        shake.AppendData(_domainBytes);

        WriteU64LE(lenBuf, _counter);
        shake.AppendData(lenBuf);
        _counter++;

        // GetHashAndReset(outputLength) finalizes and squeezes exactly
        // `outputLength` bytes — byte-identical to Python's
        // `hashlib.shake_256(absorbed).digest(256)`.
        _buf = shake.GetHashAndReset(RefillSize);
        _pos = 0;
    }

    public ulong NextUInt64()
    {
        if (_pos + 8 > _buf.Length)
            Refill();
        ulong v = BitConverter.ToUInt64(_buf, _pos);
        if (!BitConverter.IsLittleEndian)
            v = ReverseU64(v);
        _pos += 8;
        return v;
    }

    /// <summary>
    /// Uniform random integer in <c>[0, n)</c>. Mirrors Python's mask-and-reject:
    /// smallest power-of-two mask &gt;= n-1, draw u64, mask, accept if &lt; n.
    /// </summary>
    public int RandBelow(int n)
    {
        if (n <= 0) throw new ArgumentOutOfRangeException(nameof(n), "n must be > 0");
        if (n == 1) return 0;

        ulong mask = (ulong)(n - 1);
        mask |= mask >> 1;
        mask |= mask >> 2;
        mask |= mask >> 4;
        mask |= mask >> 8;
        mask |= mask >> 16;
        mask |= mask >> 32;

        while (true)
        {
            ulong r = NextUInt64() & mask;
            if (r < (ulong)n)
                return (int)r;
        }
    }

    public T Choice<T>(System.Collections.Generic.IReadOnlyList<T> list)
    {
        if (list.Count == 0) throw new InvalidOperationException("Choice on empty list");
        return list[RandBelow(list.Count)];
    }

    // --- low-level helpers ---
    private static void WriteU32LE(Span<byte> buf, uint v)
    {
        buf[0] = (byte)(v & 0xFF);
        buf[1] = (byte)((v >> 8) & 0xFF);
        buf[2] = (byte)((v >> 16) & 0xFF);
        buf[3] = (byte)((v >> 24) & 0xFF);
    }
    private static void WriteU64LE(Span<byte> buf, ulong v)
    {
        buf[0] = (byte)(v & 0xFF);
        buf[1] = (byte)((v >> 8) & 0xFF);
        buf[2] = (byte)((v >> 16) & 0xFF);
        buf[3] = (byte)((v >> 24) & 0xFF);
        buf[4] = (byte)((v >> 32) & 0xFF);
        buf[5] = (byte)((v >> 40) & 0xFF);
        buf[6] = (byte)((v >> 48) & 0xFF);
        buf[7] = (byte)((v >> 56) & 0xFF);
    }
    private static ulong ReverseU64(ulong v)
    {
        v = ((v & 0x00FF00FF00FF00FFUL) << 8)  | ((v & 0xFF00FF00FF00FF00UL) >> 8);
        v = ((v & 0x0000FFFF0000FFFFUL) << 16) | ((v & 0xFFFF0000FFFF0000UL) >> 16);
        v = (v << 32) | (v >> 32);
        return v;
    }
}
