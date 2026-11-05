import React from 'react';
import {
  ShotProps,
  ShotMap,
  Hero,
  Actor,
  LOOKS,
  Pose,
  basePose,
  poseAt,
  walkPose,
  faceAt,
  joints,
  toWorld,
  LEG_LEN,
  C,
  FONT,
  UI,
  Glow,
  Rays,
  Sparkle,
  Tag,
  HudChip,
  Dial,
  Gauge,
  FloatLabel,
  FocusRings,
  Marquee,
  Toast,
  TitleCard,
  Bedroom,
  BEDROOM,
  WINDOW,
  Study,
  STUDY,
  Desk,
  Rooftop,
  Schematic,
  SCH,
  DrawOn,
  Arrow,
  SchLabel,
  CountUp,
  Mug,
  OpenBook,
  Phone,
  ShootingStar,
  StarJar,
  clamp,
  lerp,
  easeOut,
  easeInOut,
  backOut,
} from '../../engine';
import {
  ParkWide,
  PARK_WIDE_Y,
  ChapterCard,
  EndCard16x9,
  WishStallTable,
  StreetHouseSet,
  BriefingRoomSet,
  StarCraft,
} from './sets';

type ShotFn = React.FC<ShotProps>;

const Cam: React.FC<{ x: number; y: number; z: number; rot?: number; children: React.ReactNode }> = ({
  x,
  y,
  z,
  rot = 0,
  children,
}) => <g transform={`translate(960 540) rotate(${rot}) scale(${z}) translate(${-x} ${-y})`}>{children}</g>;

/** Cold breath mist puff rising from a character's mouth in outdoor night scenes. */
const BreathMist: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1 }> = ({ x, y, t, dir = 1 }) => {
  const c = (t % 42) / 42;
  const op = Math.sin(c * Math.PI) * 0.42;
  return (
    <g opacity={op} filter="url(#blur6)">
      <ellipse cx={x + dir * (22 + c * 42)} cy={y - 10 - c * 28} rx={16 + c * 24} ry={10 + c * 14} fill="#DCE8FF" />
    </g>
  );
};

/** Expanding shockwave ring for catches and impacts. */
const CatchShockwave: React.FC<{ x: number; y: number; t: number; maxR?: number; color?: string }> = ({
  x,
  y,
  t,
  maxR = 460,
  color = '#FFE27A',
}) => {
  if (t < 0 || t > 32) return null;
  const p = easeOut(clamp(t / 32));
  const op = 1 - p;
  return (
    <g opacity={op}>
      <circle cx={x} cy={y} r={40 + p * maxR} fill="none" stroke={color} strokeWidth={10 * (1 - p * 0.6)} />
      <circle cx={x} cy={y} r={20 + p * maxR * 0.68} fill="none" stroke="#FFFFFF" strokeWidth={5 * (1 - p * 0.6)} />
    </g>
  );
};

// ============================================================================
// CHAPTER 0: COLD OPEN (S1 - S6)
// ============================================================================

/** S1: Wide dark park at midnight, bright falling star streaking across sky above Pip. */
const S1: ShotFn = ({ t, f }) => {
  const sc = 0.88;
  const py = PARK_WIDE_Y - LEG_LEN * sc;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: py, scale: sc, facing: 1, headTilt: -14, look: 0.4, armL: { a: 16, b: -12 }, armR: { a: 22, b: -18 }, expr: 'neutral' } },
    { f: 35, p: { x: 960, y: py, scale: sc, facing: 1, headTilt: -24, look: 0.7, armR: { a: 115, b: -20 }, expr: 'shock' } },
  ]);
  const streakP = clamp((t % 65) / 52);
  const sx = lerp(320, 1280, streakP);
  const sy = lerp(95, 395, streakP);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0008}>
      <ParkWide t={f} id="s1" meteors={3} />
      <ShootingStar x={sx} y={sy} r={22} tailLen={340} angle={-162} t={f} id="s1main" />
      <Hero pose={pose} look={LOOKS.pipHood} />
      <BreathMist x={960} y={py - 155 * sc} t={f} />
    </Cam>
  );
};

/** S2: Low-angle medium on Pip in the dark park looking up, breath misting, reaching bare hand toward falling streak. */
const S2: ShotFn = ({ t, f }) => {
  const sc = 1.28;
  const py = PARK_WIDE_Y + 120 - LEG_LEN * sc;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: py, scale: sc, facing: 1, headTilt: -18, armL: { a: 18, b: -15 }, armR: { a: 45, b: -25 }, expr: 'neutral' } },
    { f: 28, p: { x: 960, y: py, scale: sc, facing: 1, headTilt: -28, armL: { a: 24, b: -18 }, armR: { a: 152, b: -10 }, handR: 'open', expr: 'shock' } },
  ]);
  const j = joints(pose);
  const rHand = toWorld(pose, j.armR.end);
  return (
    <Cam x={960} y={500 - t * 0.25} z={1.18 + t * 0.0012}>
      <ParkWide t={f} id="s2" low={90} meteors={2} />
      <ShootingStar x={lerp(680, rHand.x + 40, clamp(t / 55))} y={lerp(130, rHand.y - 60, clamp(t / 55))} r={24} tailLen={290} angle={-145} t={f} id="s2st" />
      <Hero pose={pose} look={LOOKS.pipHood} />
      <BreathMist x={960} y={py - 160 * sc} t={f} />
    </Cam>
  );
};

/** S3: Macro insert, slow motion — Pip's open palm catching the blazing streak of light, shockwave rings rippling outward. */
const S3: ShotFn = ({ t, f }) => {
  const hitP = easeOut(clamp(t / 14));
  const sx = lerp(420, 960, hitP);
  const sy = lerp(180, 520, hitP);
  const tail = lerp(480, 0, clamp((t - 10) / 18));
  return (
    <Cam x={960} y={540} z={1.08 + t * 0.0015}>
      <ParkWide t={f} id="s3" low={180} veil={0.5} meteors={1} />
      <Rays x={960} y={520} t={t} len={620} n={16} o={t >= 12 ? 0.55 : 0.15} />
      <CatchShockwave x={960} y={520} t={t - 12} maxR={540} />
      <FocusRings x={960} y={520} t={t - 12} r0={80} />
      {/* Macro mittened forearm and open palm */}
      <g transform={`translate(960 ${690 + Math.sin(t * 0.2) * 4})`}>
        <path d="M -52 450 L -38 20 L 38 20 L 52 450 Z" fill="#2E2B3D" stroke="#121019" strokeWidth={8} />
        <ellipse cx={0} cy={-25} rx={68} ry={58} fill={C.skin} stroke="#121019" strokeWidth={8} />
        <ellipse cx={-56} cy={-32} rx={28} ry={20} fill={C.skin} stroke="#121019" strokeWidth={7} transform="rotate(-28 -56 -32)" />
      </g>
      <ShootingStar x={sx} y={sy} r={38} tailLen={tail} angle={-142} t={f} id="s3star" />
      <Sparkle x={960} y={490} t={t - 13} s={2.2} />
    </Cam>
  );
};

/** S4: Close-up — Captured star frozen and hovering in Pip's palm, warm golden light on Pip's amazed face. */
const S4: ShotFn = ({ t, f }) => {
  const sc = 1.45;
  const py = PARK_WIDE_Y + 190 - LEG_LEN * sc;
  const pose: Pose = {
    ...poseAt(t, [
      { f: 0, p: { x: 920, y: py, scale: sc, facing: 1, headTilt: -10, armL: { a: 28, b: -35 }, armR: { a: 112, b: -52 }, expr: 'shock' } },
      { f: 36, p: { x: 920, y: py, scale: sc, facing: 1, headTilt: -6, armL: { a: 32, b: -40 }, armR: { a: 106, b: -58 }, expr: 'happy' } },
    ]),
    glint: 0.95,
    glintColor: '#FFE27A',
  };
  const j = joints(pose);
  const rHand = toWorld(pose, j.armR.end);
  const starY = rHand.y - 36 + Math.sin(t * 0.25) * 6;
  return (
    <Cam x={960} y={510} z={1.22 + t * 0.001}>
      <ParkWide t={f} id="s4" low={140} meteors={2} />
      <Glow x={rHand.x + 15} y={starY} r={380} kind="warm" o={0.95} />
      <Hero pose={pose} look={LOOKS.pipHood} />
      <ShootingStar x={rHand.x + 15} y={starY} r={28} tailLen={0} t={f} id="s4peb" />
    </Cam>
  );
};

/** S5: Rapid flash-forward montage triptych — glowing mason jars, crowd queue, and blood-red emergency sky. */
const S5: ShotFn = ({ t, f }) => {
  const p2 = clamp((t - 8) / 10);
  const p3 = clamp((t - 18) / 10);
  return (
    <Cam x={960} y={540} z={1 + t * 0.001}>
      <rect x={0} y={0} width={1920} height={1080} fill="#080612" />
      {/* Left panel: Glowing star jars */}
      <g clipPath="url(#s5c1)">
        <defs>
          <clipPath id="s5c1"><rect x={0} y={0} width={632} height={1080} /></clipPath>
          <clipPath id="s5c2"><rect x={644} y={0} width={632} height={1080} /></clipPath>
          <clipPath id="s5c3"><rect x={1288} y={0} width={632} height={1080} /></clipPath>
        </defs>
        <rect x={0} y={0} width={632} height={1080} fill="#161228" />
        <Glow x={316} y={580} r={340} kind="warm" o={0.9} />
        <StarJar x={210} y={720} s={1.35} stars={8} glow={1.1} t={f} />
        <StarJar x={420} y={740} s={1.5} stars={10} glow={1.2} t={f + 19} />
      </g>
      {/* Middle panel: Queue at Wish Stall */}
      <g clipPath="url(#s5c2)" opacity={p2}>
        <g transform="translate(-320 0)">
          <ParkWide t={f} id="s5p2" meteors={2} />
          <WishStallTable x={960} y={880} jars={4} cash={2} t={f} />
        </g>
      </g>
      {/* Right panel: Blood-red sky fireball */}
      <g clipPath="url(#s5c3)" opacity={p3}>
        <g transform="translate(640 0)">
          <ParkWide t={f} id="s5p3" red={0.95} fireball={1} searchlights lampsOn={false} blackout />
        </g>
      </g>
      <path d="M 638 0 L 638 1080 M 1282 0 L 1282 1080" stroke="#F6EFE3" strokeWidth={8} />
    </Cam>
  );
};

/** S6: Title card: ["WHAT IF YOU", "COULD CATCH A STAR?"], accent "STAR", over dark park with glowing palm. */
const S6: ShotFn = ({ t, f }) => {
  const sc = 0.92;
  const py = PARK_WIDE_Y + 40 - LEG_LEN * sc;
  const pose: Pose = {
    ...basePose,
    x: 960,
    y: py,
    scale: sc,
    facing: 1,
    headTilt: -14,
    armL: { a: 22, b: -20 },
    armR: { a: 118, b: -38 },
    expr: 'happy',
    glint: 0.9,
    glintColor: '#FFE27A',
  };
  const j = joints(pose);
  const rHand = toWorld(pose, j.armR.end);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0006}>
      <ParkWide t={f} id="s6" meteors={4} />
      <Glow x={rHand.x + 12} y={rHand.y - 28} r={340} kind="warm" o={0.95} />
      <Hero pose={pose} look={LOOKS.pipHood} />
      <ShootingStar x={rHand.x + 12} y={rHand.y - 28} r={24} tailLen={0} t={f} id="s6st" />
      <TitleCard t={t} lines={['WHAT IF YOU', 'COULD CATCH A STAR?']} accent="STAR" accentT={24} y={175} size={116} />
    </Cam>
  );
};

// ============================================================================
// CHAPTER 1: THE FIRST CATCH (S7 - S13)
// ============================================================================

/** S7: Chapter 1 card — THE FIRST CATCH over November night park. */
const S7: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1 + t * 0.0006}>
    <ParkWide t={f} id="s7" meteors={3} />
    <ChapterCard t={t} num="CHAPTER 01" title="THE FIRST CATCH" />
  </Cam>
);

/** S8: Medium — Pip walking along park path at night, Northern Taurid streaks overhead, pointing mitten up. */
const S8: ShotFn = ({ t, f }) => {
  const sc = 0.95;
  const walking = t < 38;
  const walkX = lerp(760, 940, clamp(t / 38));
  const pose = walking
    ? walkPose(walkX, t * 0.35, PARK_WIDE_Y, sc, { headTilt: -12, expr: 'neutral' }, 1)
    : poseAt(t - 38, [
        { f: 0, p: { x: 940, y: PARK_WIDE_Y - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -22, armR: { a: 148, b: -12 }, handR: 'point', expr: 'happy' } },
        { f: 22, p: { x: 940, y: PARK_WIDE_Y - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -16, armR: { a: 112, b: -42 }, handR: 'open', expr: 'shock' } },
      ]);
  return (
    <Cam x={940} y={540} z={1.06 + t * 0.0008}>
      <ParkWide t={f} id="s8" meteors={4} />
      <Hero pose={pose} look={LOOKS.pipHood} />
      <BreathMist x={pose.x} y={pose.y - 160 * sc} t={f} />
      <Toast x={1560} y={130} t={t - 6} text="12 NOV · NORTHERN TAURIDS" hold={55} color="#7FD4FF" />
    </Cam>
  );
};

/** S9: Macro insert — Glowing golden pebble dropping gently into Pip's mittened palm like a warm marshmallow. */
const S9: ShotFn = ({ t, f }) => {
  const dropP = backOut(clamp(t / 18));
  const py = lerp(220, 515, dropP);
  return (
    <Cam x={960} y={540} z={1.12 + t * 0.001}>
      <ParkWide t={f} id="s9" low={180} veil={0.48} meteors={2} />
      <Glow x={960} y={py} r={380} kind="warm" o={0.9} />
      <g transform={`translate(960 ${680 + Math.sin(t * 0.18) * 5})`}>
        <path d="M -50 420 L -36 10 L 36 10 L 50 420 Z" fill="#2E2B3D" stroke="#121019" strokeWidth={8} />
        <ellipse cx={0} cy={-30} rx={72} ry={56} fill={C.skin} stroke="#121019" strokeWidth={8} />
        <ellipse cx={-58} cy={-36} rx={26} ry={18} fill={C.skin} stroke="#121019" strokeWidth={7} transform="rotate(-24 -58 -36)" />
      </g>
      <ShootingStar x={960} y={py} r={30} tailLen={t < 14 ? (1 - dropP) * 220 : 0} angle={-90} t={f} id="s9peb" />
      <FocusRings x={960} y={515} t={t - 15} r0={55} />
      <Sparkle x={1010} y={475} t={t - 16} s={1.6} />
    </Cam>
  );
};

/** S10: Bedroom high angle — Pip plucking a shooting star through the open bedroom window into a jam jar on the nightstand. */
const S10: ShotFn = ({ t, f }) => {
  const p = BEDROOM.P(0.58, 1, 0.25);
  const sc = 0.86;
  const pose = poseAt(t, [
    { f: 0, p: { x: p.x + 70, y: p.y - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -14, armR: { a: 135, b: -20 }, armL: { a: 45, b: -40 }, expr: 'happy' } },
    { f: 28, p: { x: p.x + 70, y: p.y - LEG_LEN * sc, scale: sc, facing: -1, headTilt: 8, armL: { a: 88, b: -35 }, armR: { a: 25, b: -15 }, expr: 'happy' } },
  ]);
  const ns = BEDROOM.P(0.48, 0.78, 0.06);
  const arcP = easeInOut(clamp((t - 8) / 24));
  const sx = lerp(WINDOW.x0 + 120, ns.x, arcP);
  const sy = lerp(WINDOW.y0 + 80, ns.y - 45, arcP) - Math.sin(arcP * Math.PI) * 90;
  return (
    <Cam x={980} y={540} z={1.08 + t * 0.0008}>
      <Bedroom t={f} id="s10" lamp={0.25} clock="23:18" crossed={12} />
      <StarJar x={ns.x} y={ns.y} s={0.75} stars={t > 30 ? 5 : 2} glow={t > 30 ? 1.2 : 0.6} t={f} />
      {arcP < 1 ? <ShootingStar x={sx} y={sy} r={16} tailLen={90 * (1 - arcP)} angle={-35} t={f} id="s10st" /> : null}
      <Hero pose={pose} look={LOOKS.pip} />
    </Cam>
  );
};

/** S11: Top-down desk insert — Glowing star jar beside steaming mug of hot cocoa and open notebook. */
const S11: ShotFn = ({ t, f }) => (
  <Cam x={960} y={640} z={1.45 + t * 0.0012}>
    <Study t={f} id="s11" night veil={0.35} />
    <Desk x0={620} x1={1340} y={720} laptop lamp={false} />
    <Glow x={960} y={665} r={340} kind="warm" o={0.95} />
    <OpenBook x={850} y={712} w={180} turn={clamp((t - 15) / 25)} />
    <StarJar x={975} y={712} s={0.95} stars={7} glow={1.25} t={f} />
    <Mug x={1085} y={714} rot={-6} steam={1.4} f={f} />
    <Toast x={980} y={505} t={t - 8} text="COCOA TEMP · 68°C" hold={45} color="#FFE27A" />
  </Cam>
);

/** S12: Medium — Pip at study desk smiling with warm cocoa while Mo appears outside the window. */
const S12: ShotFn = ({ t, f }) => {
  const sc = 0.88;
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 820, y: 740, scale: sc, facing: 1, armL: { a: 25, b: -30 }, armR: { a: 68, b: -55 }, expr: 'happy' } },
    { f: 28, p: { x: 820, y: 740, scale: sc, facing: 1, headTilt: -8, look: 0.9, expr: 'shock' } },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1120, y: 690, scale: 0.78, facing: -1, armL: { a: 95, b: -40 }, armR: { a: 95, b: -40 }, expr: 'shock' } },
  ]);
  return (
    <Cam x={960} y={560} z={1.12 + t * 0.0008}>
      <Study t={f} id="s12" night veil={0.38} />
      {/* Mo visible through the study window */}
      <g clipPath="url(#s12win)">
        <defs><clipPath id="s12win"><rect x={850} y={375} width={410} height={265} /></clipPath></defs>
        <Actor pose={moPose} look={LOOKS.mo} shadow={0} />
      </g>
      <Hero pose={pipPose} look={LOOKS.pip} />
      <Desk x0={620} x1={1340} y={720} laptop lamp={false} />
      <StarJar x={975} y={712} s={0.85} stars={7} glow={1.2} t={f} />
      <Mug x={1065} y={714} rot={0} steam={1.2} f={f} />
    </Cam>
  );
};

/** S13: Over the shoulder, close-up — Mo pressed against window glass, wide-eyed, pointing at the glowing star jar. */
const S13: ShotFn = ({ t, f }) => {
  const moPose = poseAt(t, [
    { f: 0, p: { x: 1040, y: 760, scale: 1.28, facing: -1, headTilt: 6, armL: { a: 110, b: -20 }, handL: 'point', armR: { a: 65, b: -45 }, expr: 'shock' } },
    { f: 25, p: { x: 1040, y: 760, scale: 1.28, facing: -1, headTilt: -8, armL: { a: 122, b: -15 }, handL: 'point', armR: { a: 85, b: -30 }, expr: 'smug' } },
  ]);
  return (
    <Cam x={1020} y={520} z={1.26 + t * 0.001}>
      <Study t={f} id="s13" night veil={0.32} />
      <g clipPath="url(#s13win)">
        <defs><clipPath id="s13win"><rect x={850} y={375} width={410} height={265} /></clipPath></defs>
        <Actor pose={moPose} look={LOOKS.mo} shadow={0} />
      </g>
      {/* Foreground OTS silhouette of Pip, Desk and glowing StarJar */}
      <Desk x0={620} x1={1340} y={700} laptop={false} lamp={false} />
      <StarJar x={880} y={695} s={1.05} stars={8} glow={1.3} t={f} />
      <Hero
        pose={{ ...basePose, x: 720, y: 840, scale: 1.15, facing: 1, yaw: 0.7, expr: 'oops' }}
        look={LOOKS.pip}
      />
    </Cam>
  );
};

// ============================================================================
// CHAPTER 2: WISHES FOR SALE (S14 - S18)
// ============================================================================

/** S14: Chapter 2 card — WISHES FOR SALE over park stall setup. */
const S14: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1 + t * 0.0006}>
    <ParkWide t={f} id="s14" bench={false} meteors={4} />
    <WishStallTable x={960} y={865} jars={5} cash={1} t={f} />
    <ChapterCard t={t} num="CHAPTER 02" title="WISHES FOR SALE" />
  </Cam>
);

/** S15: Wide — Park at dusk: WISHES FOR SALE banner on folding table, queue of stick figures round the block. */
const S15: ShotFn = ({ t, f }) => {
  const sc = 0.82;
  const py = PARK_WIDE_Y - LEG_LEN * sc;
  const pip = poseAt(t, [
    { f: 0, p: { x: 830, y: py - 20, scale: sc, facing: 1, armR: { a: 145, b: -15 }, expr: 'happy' } },
    { f: 25, p: { x: 830, y: py - 20, scale: sc, facing: 1, armR: { a: 85, b: -35 }, expr: 'happy' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1080, y: py - 20, scale: sc, facing: 1, armL: { a: 75, b: -25 }, armR: { a: 115, b: -20 }, expr: 'smug' } },
  ]);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0007}>
      <ParkWide t={f} id="s15" bench={false} meteors={5} />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
      <WishStallTable x={960} y={865} jars={5} cash={2} t={f} />
      {/* Queue of customers on the right */}
      {[0, 1, 2, 3].map((i) => {
        const cx = 1360 + i * 135 - (t * 0.35) % 40;
        const look = [LOOKS.sis, LOOKS.mom, LOOKS.pipInk, LOOKS.suit][i];
        return (
          <Actor
            key={i}
            pose={{
              ...basePose,
              x: cx,
              y: PARK_WIDE_Y + 10 - LEG_LEN * 0.78,
              scale: 0.78,
              facing: -1,
              armL: { a: 35, b: -40 },
              expr: 'happy',
            }}
            look={look}
          />
        );
      })}
    </Cam>
  );
};

/** S16: Medium two-shot — Pip plucking streaks from sky while Mo screws lids onto glowing mason jars and counts cash. */
const S16: ShotFn = ({ t, f }) => {
  const sc = 1.04;
  const py = PARK_WIDE_Y + 60 - LEG_LEN * sc;
  const cycle = t % 36;
  const pip = poseAt(cycle, [
    { f: 0, p: { x: 780, y: py, scale: sc, facing: 1, headTilt: -20, armR: { a: 152, b: -10 }, handR: 'open', expr: 'happy' } },
    { f: 18, p: { x: 780, y: py, scale: sc, facing: 1, headTilt: 6, armR: { a: 68, b: -45 }, handR: 'open', expr: 'smug' } },
    { f: 35, p: { x: 780, y: py, scale: sc, facing: 1, headTilt: -20, armR: { a: 152, b: -10 }, handR: 'open', expr: 'happy' } },
  ]);
  const mo = poseAt(cycle, [
    { f: 0, p: { x: 1120, y: py, scale: sc, facing: 1, armL: { a: 80, b: -35 }, armR: { a: 120, b: -20 }, expr: 'happy' } },
    { f: 18, p: { x: 1120, y: py, scale: sc, facing: -1, armL: { a: 110, b: -25 }, armR: { a: 75, b: -40 }, expr: 'smug' } },
  ]);
  return (
    <Cam x={960} y={540} z={1.14 + t * 0.0008}>
      <ParkWide t={f} id="s16" bench={false} low={50} meteors={5} />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
      <WishStallTable x={960} y={910} jars={5} cash={3} t={f} />
      <ShootingStar x={lerp(620, 820, clamp(cycle / 18))} y={lerp(120, 560, clamp(cycle / 18))} r={18} tailLen={160} angle={-115} t={f} id="s16st" />
      <FloatLabel x={1160} y={480} t={cycle - 12} text="+£20" color="#5BE08A" size={64} />
    </Cam>
  );
};

/** S17: Medium — Customers holding glowing star jars like lanterns, taking selfies, kids and adults in the park. */
const S17: ShotFn = ({ t, f }) => {
  const sc = 0.94;
  const py = PARK_WIDE_Y + 30 - LEG_LEN * sc;
  const c1 = poseAt(t, [
    { f: 0, p: { x: 680, y: py, scale: sc, facing: 1, armR: { a: 88, b: -45 }, armL: { a: 115, b: -30 }, expr: 'happy' } },
  ]);
  const c2 = poseAt(t, [
    { f: 0, p: { x: 1180, y: py + 35, scale: sc * 0.78, facing: -1, armL: { a: 82, b: -40 }, armR: { a: 75, b: -35 }, expr: 'happy' } },
  ]);
  return (
    <Cam x={960} y={540} z={1.08 + t * 0.0008}>
      <ParkWide t={f} id="s17" meteors={3} />
      <Actor pose={c1} look={LOOKS.mom} />
      <StarJar x={770} y={670} s={0.78} stars={7} glow={1.2} t={f} />
      <Phone x={610} y={585} w={56} rot={14} on={1} caller="WISH" f={f} />
      <Actor pose={c2} look={LOOKS.sis} />
      <StarJar x={1095} y={715} s={0.75} stars={6} glow={1.15} t={f + 11} />
    </Cam>
  );
};

/** S18: Macro insert, Dutch angle — Crate of captured star jars vibrating, rattling against glass, pulsing in angry red-gold sync. */
const S18: ShotFn = ({ t, f }) => {
  const red = clamp(0.45 + t * 0.012);
  const shakeX = Math.sin(f * 2.8) * 5 * red;
  const shakeY = Math.cos(f * 3.4) * 3 * red;
  return (
    <Cam x={960 + shakeX} y={620 + shakeY} z={1.38 + t * 0.0015} rot={-3.5}>
      <ParkWide t={f} id="s18" bench={false} red={red * 0.6} meteors={2} />
      <WishStallTable x={960} y={880} jars={5} cash={3} red={red} t={f} />
      <FocusRings x={960} y={710} t={t % 18} r0={90} color="#FF6A4A" />
      <Gauge x={750} y={440} w={420} p={clamp(0.65 + t * 0.008)} label="RESONANCE · 142 HZ" danger={0.7} />
    </Cam>
  );
};

// ============================================================================
// CHAPTER 3: THE REAL SCIENCE (S19 - S26)
// ============================================================================

/** S19: Chapter 3 card — THE REAL SCIENCE over blueprint schematic grid. */
const S19: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1 + t * 0.0006}>
    <Schematic t={f} id="s19" />
    <ChapterCard t={t} num="CHAPTER 03" title="THE REAL SCIENCE" accentColor="#7FD4FF" />
  </Cam>
);

/** S20: Diagram 1 — Scale comparison: giant cartoon star crossed out vs 1 mm sand grain to 1 cm pebble meteoroid. */
const S20: ShotFn = ({ t, f }) => {
  const xMark = easeOut(clamp((t - 16) / 10));
  return (
    <Cam x={960} y={540} z={1 + t * 0.0005}>
      <Schematic t={f} id="s20" />
      <SchLabel x={960} y={135} t={t} text="FIG 1. WHAT IS A SHOOTING STAR?" size={42} color="#7FD4FF" />

      {/* Left side: Giant cartoon star with red X */}
      <g transform="translate(520 520)">
        <DrawOn
          d="M 0 -170 L 42 -52 L 168 -52 L 66 24 L 105 145 L 0 72 L -105 145 L -66 24 L -168 -52 L -42 -52 Z"
          t={t - 2}
          dur={14}
          color={SCH.line}
          width={6}
        />
        {xMark > 0 ? (
          <g stroke={UI.bad} strokeWidth={14} strokeLinecap="round">
            <path d={`M -160 -150 L ${-160 + 320 * xMark} ${-150 + 300 * xMark}`} />
            <path d={`M 160 -150 L ${160 - 320 * xMark} ${-150 + 300 * xMark}`} />
          </g>
        ) : null}
        <SchLabel x={0} y={235} t={t - 8} text="MYTH: GIANT STAR" size={32} color={UI.bad} />
      </g>

      {/* Right side: Magnifying glass zooming into sand grain (1 mm) to pebble (1 cm) */}
      <g transform="translate(1360 520)">
        <circle cx={0} cy={0} r={208} fill="#14243A" stroke="#7FD4FF" strokeWidth={6} />
        {/* Sand grain */}
        <circle cx={-75} cy={-15} r={8} fill="#FFE27A" />
        <SchLabel x={-75} y={45} t={t - 14} text="SAND (1 MM)" size={24} color={SCH.line} />
        {/* Pebble */}
        <polygon points="35,-35 78,-22 86,18 42,32 18,6" fill="#FF8A3D" stroke={SCH.line} strokeWidth={4} />
        <SchLabel x={46} y={75} t={t - 18} text="PEBBLE (1 CM)" size={24} color="#FFE27A" />
        <SchLabel x={0} y={255} t={t - 12} text="REALITY: METEOROID (SAND TO PEBBLE)" size={30} color={UI.good} />
      </g>
      <Arrow x0={740} y0={520} x1={1140} y1={520} t={t - 12} color="#FFE27A" />
    </Cam>
  );
};

/** S21: Diagram 2 — Earth atmosphere cross-section showing 80 to 120 km mesosphere/lower thermosphere burn-up zone. */
const S21: ShotFn = ({ t, f }) => {
  const mP = clamp((t % 48) / 38);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0005}>
      <Schematic t={f} id="s21" />
      <SchLabel x={960} y={115} t={t} text="FIG 2. METEOR BURN-UP ALTITUDE (80–120 KM)" size={40} color="#7FD4FF" />

      {/* Altitude scale bar on left */}
      <DrawOn d="M 280 180 L 280 920" t={t} dur={12} color={SCH.line} width={5} />
      {[
        [240, '120 KM · LOWER THERMOSPHERE'],
        [440, '80 KM · MESOSPHERE'],
        [740, '12 KM · CLOUDS & JETS'],
        [910, '0 KM · GROUND (PARK)'],
      ].map(([y, lbl], i) => (
        <g key={i}>
          <path d={`M 260 ${y} L 1640 ${y}`} stroke={i < 2 ? '#FF8A3D' : SCH.dim} strokeWidth={i < 2 ? 3 : 2} strokeDasharray="10 8" />
          <SchLabel x={310} y={(y as number) - 14} t={t - i * 4} text={lbl as string} size={26} color={i < 2 ? '#FFE27A' : SCH.line} anchor="start" />
        </g>
      ))}

      {/* Highlighted 80-120 km burn-up band */}
      <rect x={280} y={240} width={1360} height={200} fill="#FF8A3D" opacity={0.18} />
      <ShootingStar x={lerp(1420, 820, mP)} y={lerp(210, 420, mP)} r={20} tailLen={220} angle={-160} t={f} id="s21m" />

      {/* Tiny stick figure & trees on ground at 0 km */}
      <path d="M 260 910 L 1660 910" stroke={SCH.line} strokeWidth={5} />
      <Hero
        pose={{ ...basePose, x: 960, y: 910 - LEG_LEN * 0.35, scale: 0.35, headTilt: -25, armR: { a: 145, b: -10 } }}
        look={LOOKS.pipHood}
        shadow={0}
      />
    </Cam>
  );
};

/** S22: Diagram 3 — Taurid meteoroid vector entering at 27 km/s with speedometer gauge. */
const S22: ShotFn = ({ t, f }) => {
  const p = clamp(t / 28);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0006}>
      <Schematic t={f} id="s22" />
      <SchLabel x={960} y={130} t={t} text="FIG 3. TAURID ENTRY VELOCITY" size={42} color="#7FD4FF" />
      <Arrow x0={320} y0={380} x1={1380} y1={620} t={t - 2} dur={14} color="#FF8A3D" bend={0} />
      <ShootingStar x={lerp(420, 1340, (t % 36) / 36)} y={lerp(402, 610, (t % 36) / 36)} r={26} tailLen={320} angle={-167} t={f} id="s22m" />
      <CountUp x={960} y={320} t={t - 4} to={27} dur={22} size={112} color="#FFE27A" suffix=" KM/S" />
      <SchLabel x={960} y={385} t={t - 10} text="SOUTHERN TAURIDS · ~27 KILOMETRES PER SECOND" size={30} color={SCH.line} />
      <Gauge x={750} y={820} w={420} p={p * 0.95} label="KINETIC VELOCITY · 27 KM/S" danger={0.75} />
    </Cam>
  );
};

/** S23: Diagram 4 — Macro insert: Ram-pressure compression heating and glowing ionised plasma air shell around pebble. */
const S23: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1.06 + t * 0.0008}>
    <Schematic t={f} id="s23" />
    <SchLabel x={960} y={125} t={t} text="FIG 4. WHY IT GLOWS: SUPERHEATED IONISED AIR (PLASMA)" size={38} color="#7FD4FF" />

    {/* Ionised plasma bow shock and glowing envelope */}
    <g transform="translate(960 540)">
      <Glow x={0} y={0} r={360} kind="warm" o={0.85} />
      <path d="M 190 -240 Q 340 0 190 240 L -480 310 L -480 -310 Z" fill="#FF8A3D" opacity={0.25} />
      <path d="M 150 -180 Q 270 0 150 180" fill="none" stroke="#FFE27A" strokeWidth={8} strokeDasharray="16 10" />
      <ellipse cx={-40} cy={0} rx={210} ry={125} fill="#7FD4FF" opacity={0.28} stroke="#7FD4FF" strokeWidth={4} />
      {/* Solid cold rock core inside */}
      <polygon points="-45,-48 38,-62 74,-8 42,54 -38,60 -76,12" fill="#4A5268" stroke="#F6EFE3" strokeWidth={6} />
      <text x={0} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#F6EFE3">ROCK</text>
    </g>

    {/* Incoming air molecule compression arrows */}
    {[-120, 0, 120].map((dy, i) => (
      <Arrow key={i} x0={1580} y0={540 + dy} x1={1240} y1={540 + dy * 0.7} t={t - 6 - i * 3} color="#7FD4FF" bend={0} />
    ))}
    <SchLabel x={1440} y={340} t={t - 10} text="COMPRESSED AIR -> IONISED PLASMA" size={28} color="#FFE27A" />
    <SchLabel x={560} y={760} t={t - 14} text="NOT WOOD ON FIRE · GLOW IS SUPERHEATED AIR" size={28} color={UI.good} />
  </Cam>
);

/** S24: Diagram 5 — Stick figure attempting bare-hand catch at 27 km/s vs IMPOSSIBLE stamp. */
const S24: ShotFn = ({ t, f }) => {
  const sc = 0.92;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 840 - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -20, armR: { a: 145, b: -15 }, expr: 'oops' } },
    { f: 18, p: { x: 960, y: 840 - LEG_LEN * sc, scale: sc, facing: 1, tilt: -14, armL: { a: 130, b: -10 }, armR: { a: 150, b: -10 }, expr: 'dizzy' } },
  ]);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0006}>
      <Schematic t={f} id="s24" />
      <SchLabel x={960} y={130} t={t} text="FIG 5. NORMAL CATCH AT 27 KM/S" size={42} color="#7FD4FF" />
      <ShootingStar x={lerp(520, 980, clamp(t / 18))} y={lerp(200, 480, clamp(t / 18))} r={28} tailLen={280} angle={-140} t={f} id="s24m" />
      <CatchShockwave x={980} y={480} t={t - 16} maxR={420} color={UI.bad} />
      <Hero pose={pose} look={LOOKS.pip} shadow={0} />
      <Tag x={960} y={280} t={t - 14} text="27 KM/S" mark="x" markT={6} w={320} />
      <SchLabel x={960} y={915} t={t - 16} text="WITHOUT BRAKING FIELD: INSTANT VAPORISATION" size={32} color={UI.bad} />
    </Cam>
  );
};

/** S25: Diagram 6 — Deceleration field: 27 km/s -> 0 m/s braking curve and plasma dispersal above open palm. */
const S25: ShotFn = ({ t, f }) => {
  const p = easeOut(clamp(t / 28));
  const v = Math.round(27 * (1 - p));
  return (
    <Cam x={960} y={540} z={1 + t * 0.0006}>
      <Schematic t={f} id="s25" />
      <SchLabel x={960} y={125} t={t} text="FIG 6. YOUR POWER: KINETIC BRAKING FIELD" size={40} color="#7FD4FF" />

      {/* Deceleration rings cone from palm */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse
          key={i}
          cx={960}
          cy={680 - i * 105}
          rx={110 + i * 75}
          ry={26 + i * 10}
          fill="none"
          stroke="#7FD4FF"
          strokeWidth={4}
          strokeDasharray="14 8"
          opacity={0.75}
        />
      ))}
      <ShootingStar x={960} y={lerp(240, 560, p)} r={26} tailLen={(1 - p) * 260} angle={-90} t={f} id="s25m" />
      <Marquee x={860} y={480} w={200} h={160} t={t - 12} color="#5BE08A" label="LOCKED · 0 M/S" />
      <Dial x={1560} y={360} p={1 - p} readout={`${v} km/s`} r={110} size={38} />
      <SchLabel x={960} y={890} t={t - 10} text="27 KM/S -> 0 M/S · STOPPED ENERGY FLOWS INTO THE JAR" size={30} color="#FFE27A" />
    </Cam>
  );
};

/** S26: Diagram 7 — Trapped meteoroid in glass jar emitting acoustic standing waves into the glass. */
const S26: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1.08 + t * 0.0008}>
    <Schematic t={f} id="s26" />
    <SchLabel x={960} y={125} t={t} text="FIG 7. WHERE DOES THE STOPPED ENERGY GO?" size={40} color="#7FD4FF" />
    <StarJar x={960} y={760} s={1.85} stars={9} glow={1.35} red={0.35} t={f} />
    {[0, 1, 2].map((i) => {
      const r = 140 + ((t * 4 + i * 75) % 220);
      const op = 1 - (r - 140) / 220;
      return <circle key={i} cx={960} cy={590} r={r} fill="none" stroke="#FFE27A" strokeWidth={4} opacity={op * 0.8} />;
    })}
    <SchLabel x={960} y={895} t={t - 8} text="STORED KINETIC ENERGY -> HEAT + LIGHT + HUM" size={32} color="#FFE27A" />
  </Cam>
);

// ============================================================================
// CHAPTER 4: BIGGER FISH (S27 - S32)
// ============================================================================

/** S27: Chapter 4 card — BIGGER FISH over city rooftop at night. */
const S27: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1 + t * 0.0006}>
    <Rooftop t={f} sunY={920} red={0.2} cityLit={1.8} />
    <ChapterCard t={t} num="CHAPTER 04" title="BIGGER FISH" accentColor="#FF8A3D" />
  </Cam>
);

/** S28: Wide — Pip and Mo on rooftop at night as a brilliant green-gold bolide fireball blazes across the sky. */
const S28: ShotFn = ({ t, f }) => {
  const sc = 0.88;
  const floorY = 915;
  const pip = poseAt(t, [
    { f: 0, p: { x: 860, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -22, armR: { a: 135, b: -15 }, expr: 'happy' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1090, y: floorY - LEG_LEN * sc, scale: sc, facing: -1, headTilt: -18, armL: { a: 95, b: -25 }, expr: 'worried' } },
  ]);
  const fbP = clamp((t % 54) / 44);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0008}>
      <Rooftop t={f} sunY={940} red={0.35} cityLit={1.8} />
      {/* Glowing jars lined along rooftop parapet */}
      {[420, 540, 1380, 1500].map((jx, i) => (
        <StarJar key={i} x={jx} y={765} s={0.58} stars={6} glow={1.0} t={f + i * 9} />
      ))}
      <ShootingStar x={lerp(280, 1460, fbP)} y={lerp(120, 340, fbP)} r={42} tailLen={480} angle={-168} t={f} red={0.3} id="s28fb" />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
    </Cam>
  );
};

/** S29: Low angle, medium — Mo grabbing Pip's sleeve on the rooftop, warning him not to catch the angry fireball. */
const S29: ShotFn = ({ t, f }) => {
  const sc = 1.15;
  const floorY = 985;
  const pip = poseAt(t, [
    { f: 0, p: { x: 840, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -24, armL: { a: 138, b: -15 }, armR: { a: 148, b: -12 }, expr: 'smug' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1120, y: floorY - LEG_LEN * sc, scale: sc, facing: -1, headTilt: -12, armL: { a: 98, b: -20 }, armR: { a: 72, b: -35 }, expr: 'shock' } },
  ]);
  return (
    <Cam x={960} y={520} z={1.16 + t * 0.001}>
      <Rooftop t={f} sunY={960} red={0.5} low={70} cityLit={1.8} />
      <ShootingStar x={920} y={210} r={46} tailLen={520} angle={-155} t={f} red={0.6} id="s29fb" />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
    </Cam>
  );
};

/** S30: Rooftop fireball catch shockwave — Pip catches the grapefruit-sized fireball, popping rooftop bulbs. */
const S30: ShotFn = ({ t, f }) => {
  const sc = 1.18;
  const floorY = 985;
  const pip: Pose = {
    ...poseAt(t, [
      { f: 0, p: { x: 860, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -20, squash: 0.12, armL: { a: 145, b: -20 }, armR: { a: 145, b: -20 }, expr: 'shock' } },
    ]),
    glint: 1,
    glintColor: '#FFE27A',
  };
  const mo = poseAt(t, [
    { f: 0, p: { x: 1180, y: floorY - LEG_LEN * sc, scale: sc, facing: -1, tilt: 16, armL: { a: 135, b: -30 }, armR: { a: 125, b: -30 }, expr: 'oops' } },
  ]);
  return (
    <Cam x={960} y={510} z={1.18 + t * 0.0012}>
      <Rooftop t={f} sunY={960} red={0.65} low={70} lightsOut={clamp((t - 6) / 18)} cityLit={1.8} />
      <CatchShockwave x={860} y={390} t={t - 2} maxR={680} color="#FFE27A" />
      <Rays x={860} y={390} t={t} len={540} n={14} o={0.65} />
      <ShootingStar x={860} y={390} r={48} tailLen={0} t={f} red={0.5} id="s30core" />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
    </Cam>
  );
};

/** S31: Close-up insert — Weather radar & satellite monitor showing a 27 km/s track dropping straight to zero over the city. */
const S31: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1.05 + t * 0.0008}>
    <BriefingRoomSet t={f} id="s31" />
    <Toast x={960} y={205} t={t - 4} text="ANOMALY DETECTED · VELOCITY -> 0 KM/S" hold={70} color="#FF5A4A" />
    <Marquee x={860} y={420} w={200} h={160} t={t - 8} color="#FF5A4A" label="GRID 4B · ROOFTOP" />
  </Cam>
);

/** S32: Wide morning street outside Pip's house packed with news satellite vans, scientists, and government agents in dark suits. */
const S32: ShotFn = ({ t, f }) => {
  const sc = 0.82;
  const floorY = 820;
  const suit1 = poseAt(t, [
    { f: 0, p: { x: 1320, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, glasses: 1, armR: { a: 65, b: -45 }, expr: 'cool' } },
  ]);
  const suit2 = poseAt(t, [
    { f: 0, p: { x: 1180, y: floorY + 25 - LEG_LEN * sc, scale: sc, facing: 1, glasses: 1, expr: 'neutral' } },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: { x: 1475, y: floorY - 35 - LEG_LEN * sc, scale: sc, facing: -1, expr: 'oops' } },
  ]);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0007}>
      <StreetHouseSet t={f} id="s32" />
      <Actor pose={suit2} look={LOOKS.suit} />
      <Actor pose={suit1} look={LOOKS.suit} />
      <Hero pose={pip} look={LOOKS.pip} />
    </Cam>
  );
};

// ============================================================================
// CHAPTER 5: SOMETHING MUCH BIGGER (S33 - S39)
// ============================================================================

/** S33: Chapter 5 card — SOMETHING MUCH BIGGER over emergency command room. */
const S33: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1 + t * 0.0006}>
    <BriefingRoomSet t={f} id="s33" />
    <ChapterCard t={t} num="CHAPTER 05" title="SOMETHING MUCH BIGGER" accentColor="#FF5A4A" />
  </Cam>
);

/** S34: Wide — Underground briefing room: giant red trajectory screen showing house-sized Taurid object at 27 km/s aimed at city. */
const S34: ShotFn = ({ t, f }) => {
  const sc = 0.86;
  const floorY = 960;
  const pip = poseAt(t, [
    { f: 0, p: { x: 760, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -12, expr: 'shock' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 610, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -10, expr: 'worried' } },
  ]);
  const suit = poseAt(t, [
    { f: 0, p: { x: 1220, y: floorY - LEG_LEN * sc, scale: sc, facing: -1, glasses: 1, armL: { a: 115, b: -20 }, handL: 'point', expr: 'cool' } },
  ]);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0007}>
      <BriefingRoomSet t={f} id="s34" />
      <Actor pose={mo} look={LOOKS.mo} />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={suit} look={LOOKS.suit} />
    </Cam>
  );
};

/** S35: Close-up — Pip and Mo at briefing room looking up at the 27 km/s house-sized impact projection. */
const S35: ShotFn = ({ t, f }) => {
  const sc = 1.22;
  const floorY = 1040;
  const pip = poseAt(t, [
    { f: 0, p: { x: 840, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -14, expr: 'worried' } },
    { f: 28, p: { x: 840, y: floorY - LEG_LEN * sc, scale: sc, facing: 1, headTilt: -8, armR: { a: 72, b: -45 }, expr: 'shock' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1120, y: floorY - LEG_LEN * sc, scale: sc, facing: -1, headTilt: -10, expr: 'oops' } },
  ]);
  return (
    <Cam x={960} y={520} z={1.18 + t * 0.001}>
      <BriefingRoomSet t={f} id="s35" />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
      <Gauge x={750} y={180} w={420} p={0.96} label="IMPACT IN · 00:04:12 · 27 KM/S" danger={0.5} />
    </Cam>
  );
};

/** S36: Wide — Blacked-out city park at night, searchlights sweeping blood-red clouds, scientists behind blast shields. */
const S36: ShotFn = ({ t, f }) => {
  const sc = 0.86;
  const py = PARK_WIDE_Y - LEG_LEN * sc;
  const pip = poseAt(t, [
    { f: 0, p: { x: 920, y: py, scale: sc, facing: 1, headTilt: -22, expr: 'worried' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1080, y: py, scale: sc, facing: -1, headTilt: -16, expr: 'oops' } },
  ]);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0007}>
      <ParkWide t={f} id="s36" red={0.65} lampsOn={false} blackout searchlights meteors={3} />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
    </Cam>
  );
};

/** S37: Medium two-shot — Pip and Mo standing on park path in wind, Mo nervous, Pip raising both hands toward sky. */
const S37: ShotFn = ({ t, f }) => {
  const sc = 1.12;
  const py = PARK_WIDE_Y + 90 - LEG_LEN * sc;
  const pip = poseAt(t, [
    { f: 0, p: { x: 840, y: py, scale: sc, facing: 1, headTilt: -20, armL: { a: 45, b: -20 }, armR: { a: 45, b: -20 }, expr: 'worried' } },
    { f: 24, p: { x: 840, y: py, scale: sc, facing: 1, headTilt: -28, armL: { a: 148, b: -12 }, armR: { a: 148, b: -12 }, expr: 'shock' } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1120, y: py, scale: sc, facing: -1, headTilt: -14, armL: { a: 78, b: -40 }, armR: { a: 78, b: -40 }, expr: 'oops' } },
  ]);
  return (
    <Cam x={960} y={520} z={1.15 + t * 0.001}>
      <ParkWide t={f} id="s37" red={0.75} low={70} lampsOn={false} blackout searchlights meteors={2} />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <Actor pose={mo} look={LOOKS.mo} />
      <BreathMist x={840} y={py - 160 * sc} t={f} />
    </Cam>
  );
};

/** S38: Wide, low angle — Colossal fireball tearing through clouds 100 km up, dragging a massive plasma tail toward the park. */
const S38: ShotFn = ({ t, f }) => {
  const sc = 0.88;
  const py = PARK_WIDE_Y + 50 - LEG_LEN * sc;
  const pip: Pose = {
    ...basePose,
    x: 920,
    y: py,
    scale: sc,
    facing: 1,
    headTilt: -28,
    armL: { a: 152, b: -10 },
    armR: { a: 152, b: -10 },
    expr: 'shock',
    glint: 1,
    glintColor: '#FFE27A',
  };
  return (
    <Cam x={960 + Math.sin(f * 1.9) * 4} y={540 + Math.cos(f * 2.3) * 4} z={1.04 + t * 0.001}>
      <ParkWide t={f} id="s38" red={0.92} low={50} fireball={1.15} lampsOn={false} blackout searchlights meteors={2} />
      <Hero pose={pip} look={LOOKS.pipHood} />
      <HudChip x={96} y={112} f={f} label="ALT · 100 KM · 27 KM/S" icon="dot" />
    </Cam>
  );
};

/** S39: Low angle, slow motion — Pip planting feet with both hands raised as massive fireball halts just above his fingertips in a huge shockwave. */
const S39: ShotFn = ({ t, f }) => {
  const sc = 1.05;
  const py = PARK_WIDE_Y + 90 - LEG_LEN * sc;
  const haltP = easeOut(clamp(t / 24));
  const pip: Pose = {
    ...basePose,
    x: 960,
    y: py,
    scale: sc,
    facing: 1,
    headTilt: -28,
    squash: 0.14 * haltP,
    armL: { a: 156, b: -8 },
    armR: { a: 156, b: -8 },
    expr: 'shock',
    glint: 1,
    glintColor: '#7FD4FF',
  };
  return (
    <Cam x={960} y={520} z={1.14 + t * 0.0012}>
      <ParkWide t={f} id="s39" red={1 - haltP * 0.55} low={80} lampsOn={false} blackout searchlights />
      <Rays x={960} y={280} t={t} len={720} n={18} o={0.65} />
      <CatchShockwave x={960} y={320} t={t - 2} maxR={820} color="#7FD4FF" />
      <StarCraft x={960} y={lerp(180, 295, haltP)} s={1.15} plasma={1 - haltP * 0.45} hatch={0} t={f} />
      <Hero pose={pip} look={LOOKS.pipHood} />
    </Cam>
  );
};

// ============================================================================
// CHAPTER 6: TWIST ENDING + CLOSING QUESTION (S40 - S44)
// ============================================================================

/** S40: Chapter 6 card — WHAT YOU CAUGHT over clearing smoke in park. */
const S40: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1 + t * 0.0006}>
    <ParkWide t={f} id="s40" lampsOn={false} blackout />
    <StarCraft x={960} y={295} s={1.1} plasma={clamp(0.4 - t * 0.01)} hatch={0} t={f} />
    <ChapterCard t={t} num="CHAPTER 06" title="WHAT YOU CAUGHT" accentColor="#7FD4FF" />
  </Cam>
);

/** S41: Macro insert, low angle — Plasma clearing to reveal a smooth dark-metal geometric craft with glowing cyan symbols hovering above Pip's hands. */
const S41: ShotFn = ({ t, f }) => {
  const sc = 1.08;
  const py = PARK_WIDE_Y + 110 - LEG_LEN * sc;
  const pip: Pose = {
    ...basePose,
    x: 960,
    y: py,
    scale: sc,
    facing: 1,
    headTilt: -26,
    armL: { a: 148, b: -12 },
    armR: { a: 148, b: -12 },
    expr: 'shock',
    glint: 1,
    glintColor: '#7FD4FF',
  };
  return (
    <Cam x={960} y={480} z={1.22 + t * 0.001}>
      <ParkWide t={f} id="s41" low={110} lampsOn={false} blackout />
      <StarCraft x={960} y={285} s={1.32} plasma={clamp(0.25 - t * 0.01)} hatch={0} t={f} />
      <Hero pose={pip} look={LOOKS.pipHood} />
    </Cam>
  );
};

/** S42: Medium wide — Dozens of mason jars across the park flaring bright cyan-blue and pulsing in sync with the craft. */
const S42: ShotFn = ({ t, f }) => {
  const sc = 0.88;
  const py = PARK_WIDE_Y - LEG_LEN * sc;
  const pulse = 0.9 + 0.45 * Math.sin(f * 0.25);
  return (
    <Cam x={960} y={540} z={1 + t * 0.0007}>
      <ParkWide t={f} id="s42" lampsOn={false} blackout />
      <StarCraft x={960} y={250} s={1.05} plasma={0} hatch={0.2} t={f} />
      <Hero
        pose={{ ...basePose, x: 960, y: py, scale: sc, facing: 1, headTilt: -22, armL: { a: 140, b: -15 }, armR: { a: 140, b: -15 }, expr: 'shock', glint: 1, glintColor: '#7FD4FF' }}
        look={LOOKS.pipHood}
      />
      <Actor
        pose={{ ...basePose, x: 1140, y: py, scale: sc, facing: -1, headTilt: -18, expr: 'shock' }}
        look={LOOKS.mo}
      />
      {/* Mason jars across the park flaring bright cyan-blue in sync */}
      {[420, 560, 710, 1250, 1410, 1560].map((jx, i) => (
        <g key={i}>
          <Glow x={jx} y={810} r={160 * pulse} kind="cool" o={0.95} />
          <StarJar x={jx} y={855} s={0.78} stars={8} glow={pulse} t={f} />
          <rect x={jx - 32} y={765} width={64} height={82} rx={12} fill="#7FD4FF" opacity={0.55 * pulse} style={{ mixBlendMode: 'screen' }} />
          <circle cx={jx} cy={806} r={24 * pulse} fill="#EAF8FF" opacity={0.85} />
        </g>
      ))}
    </Cam>
  );
};

/** S43: Close-up, low angle — Underside hatch of the dark-metal craft clicking open with bright cyan light shining down onto Pip's face. */
const S43: ShotFn = ({ t, f }) => {
  const hatch = easeOut(clamp(t / 24));
  const sc = 1.25;
  const py = PARK_WIDE_Y + 150 - LEG_LEN * sc;
  const pip: Pose = {
    ...basePose,
    x: 960,
    y: py,
    scale: sc,
    facing: 1,
    headTilt: -24,
    armL: { a: 142, b: -16 },
    armR: { a: 142, b: -16 },
    expr: 'shock',
    glint: 1,
    glintColor: '#7FD4FF',
  };
  return (
    <Cam x={960} y={500} z={1.24 + t * 0.001}>
      <ParkWide t={f} id="s43" low={130} lampsOn={false} blackout />
      <StarCraft x={960} y={265} s={1.38} plasma={0} hatch={hatch} t={f} />
      <Hero pose={pip} look={LOOKS.pipHood} />
    </Cam>
  );
};

/** S44: Wide End Card — IFMOSPHERE, Comment your what-if, Subscribe for more what-ifs. */
const S44: ShotFn = ({ t, f }) => (
  <Cam x={960} y={540} z={1}>
    <ParkWide t={f} id="s44" lampsOn={false} blackout />
    <StarCraft x={960} y={265} s={1.1} plasma={0} hatch={1} t={f} />
    <EndCard16x9 t={t} />
  </Cam>
);

export const shots: Record<string, ShotFn> = {
  S1, S2, S3, S4, S5, S6,
  S7, S8, S9, S10, S11, S12, S13,
  S14, S15, S16, S17, S18,
  S19, S20, S21, S22, S23, S24, S25, S26,
  S27, S28, S29, S30, S31, S32,
  S33, S34, S35, S36, S37, S38, S39,
  S40, S41, S42, S43, S44,
};
