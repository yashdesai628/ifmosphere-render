# Ifmosphere style bible (LOCKED, 13 Nov 2026)

Reference: **Film 2 "What If You Jumped on Every World?"** (`src/episodes/jump`, posted 9 Nov 2026).
Approved by Yash 13 Nov 2026 21:55 GMT: Pip and the art style are identical in every episode.

Everything in `src/brand/` is read-only on the VM and pinned by sha256 in `manifest.json` and in
`~/what-if/check_style.py`. The engine files Pip and the labels are drawn with (`engine/rig.tsx`, `engine/kit.tsx`,
`engine/fonts.ts`, `engine/ui.tsx`) and `Root.tsx` are pinned too. **An episode build never edits any of them.**

Reference sheet: `public/brand/pip-reference.png` (composition `BrandSheet`).
Neutral check still: `src/brand/pip-neutral.png` (composition `BrandPipCheck`).

## Pip (the one character)
- Pip = the engine rig (`Hero`) in the **pipHood** costume: cream round head (#F6EFE3) with a shade crescent (#E2D3BE),
  dark hoodie with the hood up (#2E2B3D / #24212F), mustard drawstrings and collar (#F2B33D), dark limbs with a
  #121019 outline, cream mitten hands, teal shoes (#2FB7A6), ink face (#1D2033): two dot eyes, a small curved mouth,
  a hair tuft under the hood.
- Lines: 4 px outlines; limbs 12 px (legs) / 11 px (arms) with a +7 px dark outline; face strokes 5 px.
- Always lit with a rim-light filter (`rimR`, `rimL`, `rimBlue`, `rimBlueL`, `rimRed`) and a soft ground shadow.
- Expressions: neutral, happy, smug, shock, worried, oops, cool (shades), dizzy, tired. Faces swap through a blink.

## How to use it
```tsx
import { Pip, pipPose, pipOnGround, poseAt, faceAt, walkPose, PipLocal, CastMember, BrandDefs,
         BrandPill, BrandLabel, BrandChip, BrandChapter, BrandTitle, SpaceBackdrop, NightBackdrop, DuskBackdrop,
         GroundPlane, PALETTE, STROKE, FONTS } from '../../brand';

<Pip pose={pipOnGround(960, 820, 0.9, 'wave', { expr: 'happy' })} rim="rimBlue" />
<Pip pose={poseAt(t, keys, pipPose('stand'))} />               // animate with keys: numbers only
<PipLocal pose={pose}><circle cx={0} cy={-176} r={70} fill="#FFB84D" opacity={0.22} stroke="#EAEFF8" strokeWidth={9} /></PipLocal>
```
Named poses: stand, front, threeQuarter(L), side(L), wave, point, pointUp, cheer, shrug, think, crouch, jump, float, hold.
Any pose number (x, y, scale, facing, yaw, tilt, spin, headTilt, arm/leg angles, squash, look, blink, glasses, glint)
may be animated.

## DO
- Draw Pip only with `<Pip>` from `src/brand`. Supporting cast only with `<CastMember name="mo|bo|sis|mom|suit">`.
- Give Pip a costume or prop as an **overlay** with `<PipLocal>` drawn after `<Pip>`: helmet ring (translucent),
  backpack, hat, a held object, a wrist device. Pip's head, face, hoodie colours and shoes must stay visible.
- Put every word on screen with `BrandTitle`, `BrandChapter`, `BrandPill`, `BrandChip`, `BrandLabel` (or the Jump
  card components), in `FONTS.title` (Bricolage Grotesque 700/800), `FONTS.ui` (Fragment Mono) or `FONTS.hand` (Kalam).
- Text colours only from `TEXT_COLORS` in `style.ts`: cream, orange, gold, sky, cyan, green, red, pill dark.
- Backgrounds in the Jump treatment: flat vector shapes, dark space/night skies with stars and slow light rays, a
  flat ground plane with a pale rim line on top, props outlined 3.5-4 px in a dark line, soft bloom on light sources.
  Use `SpaceBackdrop`, `NightBackdrop`, `DuskBackdrop`, `GroundPlane` or build scenery in that style.
- Composition background `#080614`.

## DON'T
- Don't create `pip.tsx`, `hero.tsx`, `character.tsx` or any figure/face/stick-figure component in an episode.
- Don't define a `Look`, pass `look={...}`, spread `...LOOKS.x`, or use `LOOKS.pip` / `LOOKS.pipInk`.
- Don't recolour Pip for a costume (no white suit body, no orange jumpsuit): that's what overlays are for.
- Don't draw eyes or a mouth yourself; don't change line weights, proportions or the head shape.
- Don't load fonts or write a literal `fontFamily`.
- Don't edit anything in `src/brand/` or the pinned engine files; don't add files to `src/brand/`.

## Gate
`~/what-if/.venv/bin/python ~/what-if/check_style.py ~/what-if/what-if-studio/src/episodes/<slug> --visual` must print `RESULT: PASS`
(exit 0) together with `check_no_loops.py` before any render.
