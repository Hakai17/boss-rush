// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using SoulsFormats;
using SoulsFormats.Cryptography;

namespace BossRush.Core.Patching;

/// <summary>
/// Thin wrapper around <see cref="RegulationDecryptor"/> that loads Elden Ring's
/// <c>regulation.bin</c> (an AES-256-CBC-encrypted BND4 blob) into a mutable
/// <see cref="BND4"/> and writes it back with the same encryption.
///
/// Why its own class and not a direct call? Three reasons:
///   * Gives <see cref="RegulationPatcher"/> an injectable seam — tests can
///     supply an in-memory BND4 without touching disk or hitting the real
///     AES key path.
///   * Centralises the "Elden Ring" key choice so a future port to ER
///     Nightreign or Armored Core 6 changes one line, not three.
///   * Normalises path semantics (absolute paths, existence checks, parent
///     directory creation) so the calling pipeline doesn't have to.
///
/// <b>Round-trip fidelity.</b> The load/save pair does not guarantee
/// ciphertext byte-equality on arbitrary input — the vendored decryptor
/// uses <c>PaddingMode.None</c> (keeps the original trailing bytes) while
/// the encryptor uses PKCS7, and <c>BND4.Write()</c> may renormalise
/// internal alignment. What it *does* guarantee (enforced by
/// <c>RegulationIoRoundTripTests</c>): every binder file's
/// <c>Name</c>/<c>Flags</c>/<c>ID</c>/<c>Bytes</c> survive the cycle, and
/// running the save path twice on the same BND4 produces identical bytes.
/// </summary>
public static class RegulationIo
{
    /// <summary>
    /// Decrypts <paramref name="path"/> (Elden Ring regulation.bin) and parses
    /// it into a mutable BND4. Throws <see cref="FileNotFoundException"/> if
    /// the path doesn't exist — fails loud rather than synthesising an empty
    /// container, because silently patching a non-existent source is never
    /// what the user wants.
    /// </summary>
    public static BND4 LoadEldenRing(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            throw new ArgumentException("path must be non-empty", nameof(path));
        if (!File.Exists(path))
            throw new FileNotFoundException($"regulation.bin not found: {path}", path);
        return RegulationDecryptor.DecryptBndWithKey(
            path, RegulationDecryptor.RegulationKey.EldenRing);
    }

    /// <summary>
    /// Writes <paramref name="bnd"/> back out to <paramref name="path"/>,
    /// re-encrypting with the Elden Ring AES-256 key. Creates the parent
    /// directory if missing.
    /// </summary>
    public static void SaveEldenRing(string path, BND4 bnd)
    {
        if (bnd is null) throw new ArgumentNullException(nameof(bnd));
        if (string.IsNullOrWhiteSpace(path))
            throw new ArgumentException("path must be non-empty", nameof(path));
        string? parent = Path.GetDirectoryName(Path.GetFullPath(path));
        if (!string.IsNullOrEmpty(parent))
            Directory.CreateDirectory(parent);
        RegulationDecryptor.EncryptRegulationWithKey(
            path, bnd, RegulationDecryptor.RegulationKey.EldenRing);
    }
}
