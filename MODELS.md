# 🌷 Adding realistic flower models (free, from Sketchfab)

The bouquet renderer loads real **glTF/GLB** flower-head models and GPU-instances
them. Until a model is added, that flower falls back to the built-in procedural
shape, so the app always works.

You download a handful of free models; I optimize and wire them in.

## What you need

Seven single-bloom flower models, one per flower type:

| File name (rename to this) | Flower |
| -------------------------- | ------ |
| `rose.glb` | Rose |
| `tulip.glb` | Tulip |
| `lily.glb` | Lily |
| `sunflower.glb` | Sunflower |
| `carnation.glb` | Carnation |
| `gerbera.glb` | Gerbera |
| `orchid.glb` | Orchid |

You don't need all seven to start — even 2–3 makes a big difference. Missing ones
keep the fallback shape.

## How to download from Sketchfab (free)

1. Make a free account at **sketchfab.com**.
2. Open a model page (links below), click **Download 3D model**, choose the
   **glTF / GLB** format (Sketchfab auto-converts every model to glTF).
3. Rename the file to match the table above (e.g. `rose.glb`).
4. Drop all the files into:
   ```
   public/models/flowers/raw/
   ```
5. Tell me they're in — I'll run optimization, tune orientation/scale, and switch
   them on. (Or run it yourself: `pnpm models:optimize`.)

## Picking good ones (matters a lot)

- **A single bloom**, not a whole plant, bush, or flower-in-a-vase.
- **White / light / pale** colored if possible — the studio tints each flower to
  the shade the customer picks, and tinting works cleanly over a light model.
- **License: CC-BY or CC0.** CC-BY is fine (free, just needs a credit — I'll add
  an artist-credits page). Avoid anything marked "No download" or non-commercial.
- Lower poly is better, but don't worry about file size — I compress them.

## Verified starting points (CC-BY, free download)

- **Rose** — [Rose Flower, realistic](https://sketchfab.com/3d-models/rose-flower-realistic-high-poly-98edd35f37fc4010a469425699110ceb)
- **Lily** — [White Lilly](https://sketchfab.com/3d-models/white-lilly-3d-flow-zephyr-c6f5b6f0a9bb4d81b38dd43804baf4a1) · [Lily flower](https://sketchfab.com/3d-models/lily-flower-b58f68ed6cbe4e4d8070185a888a8dc6)

## Browse the rest (pre-filtered to free, downloadable)

Each link is Sketchfab search limited to downloadable models — pick a light,
single bloom with a CC-BY/CC0 license:

- Rose — https://sketchfab.com/search?features=downloadable&type=models&q=rose+flower&sort_by=-likeCount
- Tulip — https://sketchfab.com/search?features=downloadable&type=models&q=tulip+flower&sort_by=-likeCount
- Lily — https://sketchfab.com/search?features=downloadable&type=models&q=lily+flower&sort_by=-likeCount
- Sunflower — https://sketchfab.com/search?features=downloadable&type=models&q=sunflower&sort_by=-likeCount
- Carnation — https://sketchfab.com/search?features=downloadable&type=models&q=carnation+flower&sort_by=-likeCount
- Gerbera — https://sketchfab.com/search?features=downloadable&type=models&q=gerbera+daisy&sort_by=-likeCount
- Orchid — https://sketchfab.com/search?features=downloadable&type=models&q=orchid+flower&sort_by=-likeCount

## What happens after

For each model I:
1. Run `pnpm models:optimize` (Draco compression, 1K textures, geometry simplify → < 1 MB).
2. Flip `present: true` and tune orientation/scale in
   `src/components/three/geometry/flowerModels.ts`.
3. Verify it instances and tints correctly in the studio.
