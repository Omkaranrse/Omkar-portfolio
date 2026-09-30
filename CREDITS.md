# 3D Assets & Model Credits

This project includes interactive 3D assets for the `/ask-ai` workstation scene.

Models are placed in `/public/models/` and loaded dynamically.

## 3D Models Attribution

| Asset / Character | File | Model Name | Author | License | Source URL | Placement & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Flying Dragon** | `charizard.glb` | _[Model Name]_ | _[Author Name]_ | _[e.g. CC-BY 4.0]_ | _[Source Link]_ | Full-viewport 3D flight loop, banks into turns, reacts to chat state (mouth flame burst during streaming, victory swoop on finished) |
| **fire** | `fire.glb` | _[Model Name]_ | _[Author Name]_ | _[e.g. CC-BY 4.0]_ | _[Source Link]_ | Mousepad right desk companion |
| **electric** | `electric.glb` | _[Model Name]_ | _[Author Name]_ | _[e.g. CC-BY 4.0]_ | _[Source Link]_ | Mousepad left desk companion |
| **psychic** | `psychic.glb` | _[Model Name]_ | _[Author Name]_ | _[e.g. CC-BY 4.0]_ | _[Source Link]_ | Floating above monitor top edge |
| **ghost** | `ghost.glb` | _[Model Name]_ | _[Author Name]_ | _[e.g. CC-BY 4.0]_ | _[Source Link]_ | Peeking behind monitor right edge |

---

## Model Optimization Guidelines

Keep the GLB payload under **8 MB** for fast loading and smooth 60fps performance.

If `charizard.glb` exceeds 8 MB, run the following exact optimization command:

```bash
npx gltf-transform optimize charizard.glb charizard.opt.glb --compress meshopt --texture-compress webp --texture-size 2048
```
