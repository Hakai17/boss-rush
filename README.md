# Boss Rush

Boss Rush is an Elden Ring boss-arena mod, and a new project.

The gameplay base is the **Elden Ring Boss Arena Progression Mod** by **PositronCannon**. This repository continues the boss-rush work from Ignite Boss Rush, developed by **lazyhelios**, **Shura125**, and **Psiphicode**.

## Features

- Tiered boss progression, with excess bosses removed from tiers
- Kalé shop: OpenPuppetShop and Starlight Shards, head armor in the talisman slots, and Ash of War: Kick from the start
- Roundtable Hold one-shot care package
- Torrent in the arenas
- Seeded shop rolls and a patched mod folder for Mod Engine 2
- .NET 8 GUI and CLI, with saved session preferences
- Elden Ring 1.17.1 starting-class names when you merge the mod in the official item and enemy randomizer

## Item and enemy randomizer

Enemy placements and starting classes come from the official [Elden Ring Item and Enemy Randomizer](https://www.nexusmods.com/eldenring/mods/428) by thefifthmatt. Boss Rush does not include that program and does not start it.

After the tool writes `patched_mod`:

1. Open `EldenRingRandomizer.exe` from your own install.
2. Use **Merge other mod** and select that folder.
3. Optionally import [`csharp/data/boss-rush.randomizeopt`](csharp/data/boss-rush.randomizeopt). That file is an exported options preset (enemy randomizer, tarnished starting classes, stat changes; items are not randomized).

## Build

The generator is documented in [`csharp/README.md`](csharp/README.md). From `csharp/`:

```
dotnet build -c Release
dotnet test -c Release
```

## License

GPL-3.0-only. See [LICENSE.md](LICENSE.md).
