import React from 'react';
import {
  LightVeil,
  DrawOn,
  Hero,
  Pose,
  basePose,
  poseAt,
  faceAt,
  kf,
  clamp,
  lerp,
  easeOut,
  easeIn,
  backOut,
  rnd,
  settle,
  camT,
  LOOKS,
  LEG_LEN,
  HEAD,
  joints,
  toWorld,
  reachAngle,
  walkPose,
  Kitchen,
  KitchenIsland,
  KITCHEN,
  islandTop,
  stand,
  Tabletop,
  Study,
  Desk,
  Rooftop,
  Schematic,
  SCH,
  Arrow,
  SchLabel,
  Stadium,
  StadiumGoal,
  SoccerBall,
  StartingBlocks,
  TrackBeacon,
  NightSky,
  Stars,
  Cone,
  Plate,
  Mug,
  Phone,
  Foreground,
  PasteIn,
  Sparkle,
  FocusRings,
  Toast,
  TitleCard,
  Dial,
  Glow,
  UI,
  FONT,
  S3 as PAL,
  ShotProps,
} from '../../engine';

// "What if your reaction time was ten times faster?"
// 19 shots across Kitchen, Study, Stadium (pitch & track), Rooftop, Schematic, and the Stadium Street / Black Car.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const SUIT = LOOKS.suit;
const CYAN = '#7FD4FF';

/** A crisp cartoon housefly: dark thorax/abdomen, red compound eyes, two translucent wings flapping at `wingPhase`. */
const Fly: React.FC<{ x: number; y: number; s?: number; rot?: number; wingPhase?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
  wingPhase = 0,
}) => {
  const flap = Math.sin(wingPhase) * 28;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* Wings */}
      <ellipse
        cx={-4}
        cy={-14}
        rx={18}
        ry={9}
        transform={`rotate(${-26 + flap} -4 -6)`}
        fill="#DDF2FF"
        stroke="#7FD4FF"
        strokeWidth={2}
        opacity={0.82}
      />
      <ellipse
        cx={6}
        cy={-12}
        rx={15}
        ry={7.5}
        transform={`rotate(${18 - flap * 0.8} 6 -6)`}
        fill="#EAF8FF"
        stroke="#7FD4FF"
        strokeWidth={1.8}
        opacity={0.75}
      />
      {/* Legs */}
      <path
        d="M -8 6 L -14 15 M 0 7 L -2 17 M 8 6 L 14 15"
        stroke="#121018"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx={-6} cy={2} rx={13} ry={9} fill="#1F2430" stroke="#0B0A10" strokeWidth={2.5} />
      <ellipse cx={8} cy={0} rx={9} ry={8} fill="#141720" stroke="#0B0A10" strokeWidth={2.5} />
      {/* Stripes on abdomen */}
      <path d="M -10 -5 Q -8 2 -10 9 M -4 -6 Q -2 2 -4 9" stroke="#4A566E" strokeWidth={2} fill="none" />
      {/* Compound eyes */}
      <circle cx={14} cy={-3} r={5} fill="#FF4A4A" />
      <circle cx={15.5} cy={-4.5} r={1.8} fill="#FFFFFF" />
    </g>
  );
};

// ---------- S1: close-up, profile: a fly zips past Pip's nose; his eyes snap after it and glint cyan ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.1 * (1 + 0.03 * clamp(t / len));
  const head = { x: 640, y: 585 };
  const glint = clamp((t - 14) / 5);
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y - HEAD.y * sc,
    scale: sc,
    yaw: 0.72,
    look: kf(t, [
      [0, -0.3],
      [10, 0.3],
      [18, 0.95],
      [len, 1.0],
    ]),
    headTilt: kf(t, [
      [0, -2],
      [14, 4],
      [24, 2],
    ]),
    armL: { a: 12, b: -6 },
    armR: { a: 14, b: -8 },
    ...faceAt(t, [
      [0, 'neutral'],
      [15, 'shock'],
      [28, 'smug'],
    ]),
    glint,
    glintColor: CYAN,
  };
  // Fly trajectory across frame past Pip's nose (at t=22 it is at x=1160, y=490)
  const flyPos = (f: number) => {
    const p = clamp(f / 34);
    const x = lerp(180, 1680, p);
    const y = 510 - Math.sin(p * Math.PI * 2.5) * 95 - Math.cos(p * Math.PI * 5) * 28;
    return { x, y };
  };
  const curFly = flyPos(t);
  const prevFly = flyPos(Math.max(0, t - 1));
  const flyAng = (Math.atan2(curFly.y - prevFly.y, curFly.x - prevFly.x) * 180) / Math.PI;
  const trailPts = Array.from({ length: 24 }).map((_, i) => {
    const f = Math.max(0, t - (23 - i) * 0.9);
    const p = flyPos(f);
    return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });

  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-520 -340) scale(1.85)">
          <Kitchen t={t + 15} id="s1k" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Glow x={1080} y={460} r={520} o={0.35} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <FocusRings x={head.x + 120} y={head.y - 16} t={t - 15} r0={45} color={CYAN} />
      {/* Looping motion trail of the fly */}
      <path
        d={trailPts.join(' ')}
        fill="none"
        stroke={CYAN}
        strokeWidth={4.5}
        strokeDasharray="14 12"
        strokeLinecap="round"
        opacity={0.75}
      />
      <Glow x={curFly.x} y={curFly.y} r={75} kind="cool" o={0.55} />
      <Fly x={curFly.x} y={curFly.y} s={2.3} rot={flyAng * 0.35} wingPhase={t * 2.6} />
      <Foreground blur={10}>
        <path d="M 1680 1080 Q 1580 780 1650 560 Q 1740 780 1840 1080 Z" fill="#0B110E" />
      </Foreground>
    </g>
  );
};

// ---------- S2: macro insert, slow motion: the fly hangs; Pip's mitten whips in and snaps shut round it ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const flyX = 960 + Math.sin(t * 0.25) * 8;
  const flyY = 510 + Math.cos(t * 0.2) * 6;
  const grabP = easeOut(clamp((t - 2) / 7)); // reaches fly at t=9 (key=9)
  const closeP = clamp((t - 9) / 3);
  const hx = lerp(340, 915, grabP) + settle(t - 9, 10, 1.8, 5);
  const hy = lerp(680, 535, grabP);

  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.02], [len, 1.1]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-540 -360) scale(1.9)">
          <Kitchen t={36 + t * 0.12} id="s2k" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#070812" opacity={0.34} />
      <Glow x={960} y={500} r={540} kind="cool" o={0.38} />
      <Glow x={960} y={480} r={420} o={0.28} />

      {/* Cyan time-slow concentric rings */}
      {[110, 190, 280].map((r, i) => (
        <circle
          key={i}
          cx={flyX}
          cy={flyY}
          r={r + t * 1.5}
          fill="none"
          stroke={CYAN}
          strokeWidth={3 - i * 0.7}
          strokeDasharray="18 14"
          opacity={0.45 - i * 0.1}
        />
      ))}

      {/* Speed lines behind Pip's whipping arm */}
      {t >= 2 && t <= 13 ? (
        <g stroke={CYAN} strokeWidth={5} strokeLinecap="round" opacity={0.7 * (1 - clamp((t - 9) / 5))}>
          <path d={`M ${hx - 480} ${hy + 70} L ${hx - 90} ${hy - 20}`} />
          <path d={`M ${hx - 420} ${hy + 150} L ${hx - 60} ${hy + 65}`} />
          <path d={`M ${hx - 520} ${hy + 115} L ${hx - 140} ${hy + 25}`} />
        </g>
      ) : null}

      {/* Pip's arm and mitten whipping in from left */}
      <g filter="url(#rimR)">
        <path
          d={`M -260 920 Q ${hx - 280} ${hy + 130} ${hx - 30} ${hy + 18}`}
          stroke={PIP.line}
          strokeWidth={154}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M -260 920 Q ${hx - 280} ${hy + 130} ${hx - 30} ${hy + 18}`}
          stroke={PIP.limb}
          strokeWidth={132}
          fill="none"
          strokeLinecap="round"
        />
        {/* Back of mitten palm */}
        <g transform={`translate(${hx} ${hy}) rotate(${lerp(24, 8, grabP)}) scale(5.4)`}>
          <ellipse cx={2} cy={-2} rx={15} ry={12} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.5} />
          {/* Thumb below */}
          <ellipse
            cx={4}
            cy={10 - closeP * 4}
            rx={9}
            ry={6}
            transform={`rotate(${-18 + closeP * 25} 4 10)`}
            fill={PIP.hand}
            stroke={PIP.line}
            strokeWidth={2.5}
          />
        </g>
      </g>

      {/* The fly: visible at key=9 right inside the closing mitten, hidden once fist fully closes at t>=12 */}
      {closeP < 0.95 ? (
        <Fly x={flyX} y={flyY} s={4.2 * (1 - closeP * 0.35)} rot={-12} wingPhase={t * 0.45} />
      ) : null}

      {/* Top fingers curling shut around the fly */}
      <g filter="url(#rimR)" transform={`translate(${hx} ${hy}) rotate(${lerp(24, 8, grabP)}) scale(5.4)`}>
        <ellipse
          cx={12 - closeP * 5}
          cy={-11 + closeP * 7}
          rx={11}
          ry={6.5}
          transform={`rotate(${20 + closeP * 38} 10 -8)`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={2.5}
        />
        <path d="M -2 -6 L 5 -6 M -1 1 L 6 1" stroke={PIP.line} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
      </g>

      <FocusRings x={flyX} y={flyY} t={t - 8} r0={50} color={CYAN} />
      <Sparkle x={flyX + 90} y={flyY - 80} t={t - 9} s={1.8} />
    </g>
  );
};

// ---------- S3: medium two-shot, kitchen: Pip at the island, fist held up, smug; Mo frozen mid-swing with a rolled magazine ----------
const S3_PIP = stand(KITCHEN, 0.36, 0.42);
const S3_MO = stand(KITCHEN, 0.63, 0.38);
const S3_PLATE = islandTop(0.5, 0.5);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: S3_PIP.x,
        y: S3_PIP.y,
        scale: S3_PIP.scale,
        yaw: 0.35,
        look: 0.5,
        armL: { a: 14, b: -8 },
        armR: { a: 125, b: 65 },
      },
    },
    { f: 6, p: { armR: { a: 112, b: 78 }, headTilt: -5 }, ease: easeOut },
    { f: 14, p: { armR: { a: 115, b: 74 }, headTilt: -4 } },
  ]);
  const mo = poseAt(t, [
    {
      f: 0,
      p: {
        x: S3_MO.x,
        y: S3_MO.y,
        scale: S3_MO.scale,
        yaw: -0.45,
        facing: -1,
        look: -0.9,
        tilt: -8,
        armR: { a: 18, b: -10 },
        armL: { a: 148, b: 28 },
      },
    },
    { f: 10, p: { tilt: -5, headTilt: 6 } },
  ]);
  const pipHand = toWorld(pip, joints(pip).armR.end);
  const moHand = toWorld(mo, joints(mo).armL.end);

  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 585, kf(t, [[0, 1.76], [len, 1.84]]))}>
      <Kitchen t={t + 60} id="s3k" />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'shock']]) }} rimId="rimL" shadow={0} />
      {/* Rolled magazine in Mo's raised hand */}
      <g transform={`translate(${moHand.x} ${moHand.y}) rotate(-38)`}>
        <rect x={-10} y={-88} width={22} height={92} rx={8} fill="#EFE6D2" stroke="#181520" strokeWidth={3.5} />
        <rect x={-10} y={-68} width={22} height={24} fill="#D9534F" />
        <path d="M -4 -80 L -4 -12" stroke="#B8AC94" strokeWidth={2} />
      </g>
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      {/* Tiny buzz marks around Pip's closed fist */}
      <g stroke={CYAN} strokeWidth={3} strokeLinecap="round" opacity={0.8}>
        <path d={`M ${pipHand.x - 26} ${pipHand.y - 18} l -8 -6 M ${pipHand.x + 24} ${pipHand.y - 20} l 8 -6`} />
      </g>
      <Sparkle x={pipHand.x + 28} y={pipHand.y - 28} t={t - 4} s={0.95} />
      <KitchenIsland />
      <Plate x={S3_PLATE.x} y={S3_PLATE.y} s={0.75} />
      <Mug x={S3_PLATE.x + 120} y={S3_PLATE.y + 6} rot={0} f={t} />
    </g>
  );
};

// ---------- S4: high-angle insert, study desk: Pip's elbow nudges the phone; it tips off the lit desk edge ----------
const S4_EDGE = 620;
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const elbowX = kf(t, [
    [0, 660],
    [7, 855],
    [14, 820],
  ]);
  const elbowY = kf(t, [
    [0, 260],
    [7, 465],
    [14, 420],
  ]);
  // Phone slides to edge at t=7..12, tips and falls off edge at t=12..32 (at key=20 it is tipping past the edge!)
  const ph = (() => {
    if (t < 6) return { x: 950, y: 520, rot: -8, s: 0.92 };
    if (t < 12) {
      const p = easeOut((t - 6) / 6);
      return { x: lerp(950, 985, p), y: lerp(520, S4_EDGE - 10, p), rot: lerp(-8, 14, p), s: 0.92 };
    }
    const p = clamp((t - 12) / 18);
    return {
      x: 985 + 55 * p,
      y: S4_EDGE - 10 + 135 * p + 180 * p * p,
      rot: 14 + 62 * p,
      s: lerp(0.92, 0.66, p),
    };
  })();

  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 555]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Tabletop edge={S4_EDGE} />
      <Glow x={1180} y={380} r={640} o={0.35} />
      {/* Laptop on left of desk */}
      <g transform="rotate(-6 480 220)">
        <rect x={240} y={60} width={450} height={280} rx={16} fill="#24222E" stroke="#14121C" strokeWidth={4} />
        <path d="M 255 64 L 675 64" stroke="#9FC0FF" strokeWidth={3} opacity={0.75} />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 10 }).map((__, c) => (
            <rect key={`k${r}-${c}`} x={268 + c * 40} y={96 + r * 34} width={32} height={26} rx={4} fill="#33313E" />
          )),
        )}
      </g>
      {/* Mug and notebook on right of desk */}
      <g transform="rotate(7 1420 340)">
        <rect x={1280} y={220} width={260} height={190} rx={6} fill="#EFE6D4" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M 1300 ${265 + k * 32} L 1520 ${265 + k * 32}`} stroke="#B9C4D6" strokeWidth={3} />
        ))}
      </g>
      <circle cx={1620} cy={120} r={54} fill="#1C1620" />
      {/* Pip's hooded elbow coming in from top-left */}
      <g filter="url(#rimR)">
        <path
          d={`M ${elbowX - 280} -120 L ${elbowX} ${elbowY} L ${elbowX - 180} ${elbowY - 260}`}
          stroke={PIP.line}
          strokeWidth={116}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${elbowX - 280} -120 L ${elbowX} ${elbowY} L ${elbowX - 180} ${elbowY - 260}`}
          stroke={PIP.limb}
          strokeWidth={98}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* Motion arcs behind slipping phone */}
      {t >= 10 ? (
        <g stroke={CYAN} strokeWidth={4} strokeDasharray="10 8" fill="none" opacity={0.75}>
          <path d={`M 965 ${S4_EDGE - 30} Q 1005 ${S4_EDGE + 10} ${ph.x + 10} ${ph.y - 40}`} />
          <path d={`M 925 ${S4_EDGE - 20} Q 960 ${S4_EDGE + 20} ${ph.x - 30} ${ph.y - 30}`} />
        </g>
      ) : null}
      {/* The slipping Phone (screen lit so it reads immediately) */}
      <g transform={`translate(${ph.x} ${ph.y}) scale(${ph.s}) translate(${-ph.x} ${-ph.y})`} filter="url(#rimR)">
        <Phone x={ph.x} y={ph.y} w={175} rot={ph.rot} on={1} caller="MO" buzz={t < 14 ? 1 : 0} f={t} />
      </g>
    </g>
  );
};

// ---------- S5: low angle at floor level, slow motion: the phone hangs above the floorboards; Pip's hand catches it ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const phX = 960;
  const phY = 635 + t * 0.45;
  const phRot = 68 + t * 0.35;
  const grabP = easeOut(clamp((t - 2) / 8)); // catches at t=10 (key=10)
  const hx = lerp(380, 815, grabP) + settle(t - 10, 8, 1.8, 5);
  const hy = lerp(220, 625, grabP);

  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.02], [len, 1.08]]))}>
      <g filter="url(#blur10)">
        <Study t={120 + t * 0.12} id="s5st" />
      </g>
      {/* Floorboards close to camera */}
      <rect x={-400} y={755} width={2720} height={600} fill="#36262A" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path
          key={i}
          d={`M ${960 + (i - 7) * 75} 755 L ${960 + (i - 7) * 440} 1300`}
          stroke="#22181D"
          strokeWidth={5}
        />
      ))}
      <rect x={-400} y={755} width={2720} height={6} fill={PAL.warm} opacity={0.55} />
      {/* Desk legs framing left and right */}
      <rect x={140} y={-200} width={95} height={980} fill="#261B1A" />
      <rect x={1680} y={-200} width={110} height={980} fill="#261B1A" />
      <Glow x={960} y={630} r={520} kind="cool" o={0.42} />

      {/* Contact shadow on floorboards right under the hovering phone */}
      <ellipse cx={phX} cy={795} rx={155} ry={22} fill="#000" opacity={0.5} />

      {/* Cyan time-slow rings */}
      {[130, 220].map((r, i) => (
        <circle
          key={i}
          cx={phX}
          cy={phY}
          r={r + t * 1.2}
          fill="none"
          stroke={CYAN}
          strokeWidth={3}
          strokeDasharray="16 12"
          opacity={0.4 - i * 0.12}
        />
      ))}

      {/* Speed lines along Pip's diving arm */}
      {t >= 2 && t <= 14 ? (
        <g stroke={CYAN} strokeWidth={5} strokeLinecap="round" opacity={0.7}>
          <path d={`M ${hx - 320} ${hy - 280} L ${hx - 60} ${hy - 50}`} />
          <path d={`M ${hx - 240} ${hy - 320} L ${hx + 10} ${hy - 90}`} />
        </g>
      ) : null}

      {/* Pip's arm diving down from top-left */}
      <g filter="url(#rimR)">
        <path
          d={`M 220 -140 Q ${hx - 180} ${hy - 180} ${hx - 10} ${hy - 5}`}
          stroke={PIP.line}
          strokeWidth={146}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 220 -140 Q ${hx - 180} ${hy - 180} ${hx - 10} ${hy - 5}`}
          stroke={PIP.limb}
          strokeWidth={124}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx={hx + 10}
          cy={hy + 12}
          rx={78}
          ry={52}
          transform={`rotate(22 ${hx + 10} ${hy + 12})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={12}
        />
      </g>

      {/* The Phone hanging inches above the floorboards */}
      <Phone x={phX} y={phY} w={175} rot={phRot} on={1} caller="MO" />

      {/* Pip's thumb and fingers gripping the top-left and bottom-left bezel of the phone */}
      <g filter="url(#rimR)">
        <ellipse
          cx={hx + 58}
          cy={hy - 48}
          rx={38}
          ry={24}
          transform={`rotate(-22 ${hx + 58} ${hy - 48})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={10}
        />
        <ellipse
          cx={hx + 72}
          cy={hy + 66}
          rx={36}
          ry={22}
          transform={`rotate(18 ${hx + 72} ${hy + 66})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={10}
        />
      </g>

      <FocusRings x={phX} y={phY} t={t - 9} r0={65} color={CYAN} />
      <Sparkle x={phX + 140} y={phY - 70} t={t - 10} s={1.7} />
    </g>
  );
};

// ---------- S6: medium, study: Pip back in his chair, already scrolling the phone, cool ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    {
      f: 0,
      p: {
        x: 910,
        y: 716,
        yaw: 0.32,
        tilt: 6,
        look: 0.5,
        armL: { a: 20, b: -10 },
        armR: { a: 62, b: 68 },
      },
    },
    {
      f: 8,
      p: {
        x: 895,
        tilt: -10,
        headTilt: -4,
        look: 0.65,
        armL: { a: 155, b: 115 },
        armR: { a: 54, b: 78 },
      },
      ease: easeOut,
    },
    { f: 18, p: { tilt: -8, armR: { a: 56 + Math.sin(t * 0.6) * 3, b: 76 } } },
  ]);
  const glasses = backOut(clamp((t - 5) / 6));
  const face = faceAt(t, [
    [0, 'smug'],
    [7, 'cool'],
  ]);
  const rHand = toWorld(pose, joints(pose).armR.end);

  return (
    <g transform={camT(kf(t, [[0, 975], [len, 955]]), 585, kf(t, [[0, 1.8], [len, 1.92]]))}>
      <Study t={t + 150} id="s6st" />
      {/* Desk chair back behind Pip */}
      <g transform={`translate(${pose.x - 18} ${pose.y - 95}) rotate(${pose.tilt * 0.7})`}>
        <rect x={-64} y={-95} width={116} height={145} rx={22} fill="#1E1A28" stroke="#120E1A" strokeWidth={4} />
        <path d="M -46 -93 L 34 -93" stroke={PAL.warm} strokeWidth={2.5} opacity={0.45} />
      </g>
      <Desk x0={560} x1={1360} y={700} />
      <Hero look={PIP} pose={{ ...pose, glasses, ...face }} rimId="rimR" shadow={0} />
      <Phone x={rHand.x + 22} y={rHand.y - 16} w={46} rot={-22} on={1} caller="FEED" />
      <Sparkle x={pose.x + 56} y={pose.y - 185} t={t - 10} s={1.1} />
      <Foreground blur={10}>
        <path d="M 1500 1000 Q 1380 800 1430 600 Q 1470 800 1580 980 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S7: over the shoulder, ball on the spot: Mo's boot swings in, ball flies at top corner ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const kickP = clamp((t - 6) / 20);
  // Ball sits on penalty spot (920, 835) until t=6, then curves fast toward top-right corner (1295, 425)
  const bx = t < 6 ? 920 : lerp(920, 1295, easeOut(kickP));
  const by = t < 6 ? 835 : lerp(835, 425, easeOut(kickP)) - Math.sin(kickP * Math.PI) * 85;
  const br = t < 6 ? 44 : lerp(44, 22, kickP);

  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 960,
        y: 660 - LEG_LEN * 0.78,
        scale: 0.78,
        yaw: 0,
        squash: 0.06,
        armL: { a: 48, b: 24 },
        armR: { a: 48, b: 24 },
      },
    },
    {
      f: 12,
      p: {
        yaw: 0.25,
        look: 0.8,
        squash: 0.1,
        armL: { a: 62, b: 30 },
        armR: { a: 68, b: 25 },
      },
      ease: easeOut,
    },
  ]);

  const bootSwing = kf(
    t,
    [
      [0, -35],
      [6, 12],
      [12, 48],
      [24, 36],
    ],
    easeOut,
  );

  return (
    <g transform={camT(960, kf(t, [[0, 585], [len, 560]]), kf(t, [[0, 1.06], [len, 1.15]]))}>
      <Stadium t={t} id="s7st" mode="pitch" veil={0.34} />
      <Hero
        look={PIP}
        pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [12, 'smug']]), glint: t >= 12 ? 1 : 0, glintColor: CYAN }}
        rimId="rimR"
        shadow={0.6}
      />

      {/* Target reticle in the top-right corner of the goal */}
      <g transform="translate(1295 425)" opacity={0.85}>
        <circle r={42} fill="none" stroke="#FF8A3D" strokeWidth={3.5} strokeDasharray="12 8" />
        <circle r={12} fill="#FF8A3D" opacity={0.4} />
      </g>

      {/* Curved trajectory trail behind the ball */}
      {t >= 6 ? (
        <path
          d={`M 920 835 Q 1080 570 ${bx} ${by}`}
          fill="none"
          stroke="#FFF4DC"
          strokeWidth={6}
          strokeDasharray="16 10"
          strokeLinecap="round"
          opacity={0.75}
        />
      ) : null}

      <SoccerBall x={bx} y={by} r={br} rot={t * 24} shadow={t < 8 ? 0.45 : 0} />

      {/* Over the shoulder: Mo's dark silhouette on the left and kicking leg swinging through */}
      <Foreground blur={10}>
        <path d="M -80 1120 Q 40 720 260 660 Q 420 640 460 880 L 420 1120 Z" fill="#100D18" />
        <circle cx={240} cy={550} r={115} fill="#14101E" />
        <g transform={`translate(560 980) rotate(${bootSwing})`}>
          <rect x={-55} y={-240} width={110} height={280} rx={40} fill="#14101E" />
          <ellipse cx={25} cy={-245} rx={78} ry={38} fill="#1E182A" />
        </g>
      </Foreground>
    </g>
  );
};

// ---------- S8: low angle, slow motion: Pip at full stretch in the air under the crossbar, mittens closing on the ball ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const flyP = easeOut(clamp(t / 12)); // reaches ball at t=12 (key=12)
  const bx = 1280;
  const by = 548;
  const pipPose: Pose = {
    ...basePose,
    x: lerp(900, 1005, flyP),
    y: lerp(720, 648, flyP),
    scale: 1.28,
    yaw: 0.65,
    spin: lerp(42, 62, flyP),
    look: 0.9,
    armR: { a: lerp(130, 162, flyP), b: 8 },
    armL: { a: lerp(120, 152, flyP), b: -8 },
    legL: { a: -28, b: -35 },
    legR: { a: 18, b: -25 },
    ...faceAt(t, [[0, 'cool']]),
    glint: 1,
    glintColor: CYAN,
  };

  return (
    <g transform={camT(kf(t, [[0, 1140], [len, 1185]]), 545, kf(t, [[0, 1.52], [len, 1.66]]))}>
      <Stadium t={45 + t * 0.15} id="s8st" mode="pitch" low={130} veil={0.32} />
      <Glow x={bx} y={by} r={340} kind="cool" o={0.45} />

      {/* Cyan time-slow rings around the top-corner ball */}
      {[75, 135, 195].map((r, i) => (
        <circle
          key={i}
          cx={bx}
          cy={by}
          r={r + t * 1.2}
          fill="none"
          stroke={CYAN}
          strokeWidth={2.8 - i * 0.6}
          strokeDasharray="14 10"
          opacity={0.45 - i * 0.1}
        />
      ))}

      {/* Speed trail behind diving Pip */}
      <g stroke={CYAN} strokeWidth={4} strokeLinecap="round" opacity={0.65}>
        <path d={`M ${pipPose.x - 220} ${pipPose.y + 85} L ${pipPose.x - 40} ${pipPose.y + 15}`} />
        <path d={`M ${pipPose.x - 190} ${pipPose.y + 130} L ${pipPose.x - 20} ${pipPose.y + 55}`} />
      </g>

      <SoccerBall x={bx} y={by} r={38} rot={120 + t * 2} shadow={0} />
      <Hero look={PIP} pose={pipPose} rimId="rimR" shadow={0} />
      <FocusRings x={bx} y={by} t={t - 8} r0={42} color={CYAN} />
      <Sparkle x={bx + 50} y={by - 45} t={t - 10} s={1.3} />
    </g>
  );
};

// ---------- S9: macro insert: the ball pressed into Pip's two mittens, the net billowing behind, floodlight flare ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const push = settle(t, 18, 1.7, 6);
  const bx = 960 + push * 0.4;
  const by = 520 - push * 0.3;

  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-620 -360) scale(1.9)">
          <Stadium t={t + 70} id="s9st" mode="pitch" goal={false} />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#080612" opacity={0.28} />
      {/* Floodlight flare behind the catch */}
      <Glow x={960} y={360} r={680} o={0.55} />
      <Glow x={960} y={520} r={480} kind="cool" o={0.35} />

      {/* Billowing goal net mesh */}
      <g stroke="#DCE6F2" strokeWidth={3.5} opacity={0.42} fill="none">
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 180 + i * 125;
          const pull = Math.exp(-Math.pow((x - bx) / 320, 2)) * (55 + push * 1.5);
          return <path key={`v${i}`} d={`M ${x} 140 Q ${x + (x < bx ? 25 : -25)} ${by} ${x} 980`} strokeWidth={3} />;
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 180 + i * 95;
          const pull = Math.exp(-Math.pow((y - by) / 260, 2)) * (65 + push * 1.8);
          return <path key={`h${i}`} d={`M 140 ${y} Q ${bx} ${y - pull} 1780 ${y}`} />;
        })}
      </g>

      {/* Macro crossbar and right goalpost */}
      <path
        d="M -100 150 L 1560 150 L 1560 1180"
        stroke="#181520"
        strokeWidth={68}
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M -100 150 L 1560 150 L 1560 1180"
        stroke="#F4F1EA"
        strokeWidth={52}
        fill="none"
        strokeLinejoin="round"
      />

      {/* The caught SoccerBall */}
      <SoccerBall x={bx} y={by} r={175} rot={-18 + push * 0.5} shadow={0} />

      {/* Pip's two mittens pressing the ball from left and right */}
      <g filter="url(#rimR)">
        {/* Left arm & mitten */}
        <path
          d={`M 180 1180 Q 520 820 ${bx - 155} ${by + 35}`}
          stroke={PIP.line}
          strokeWidth={172}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 180 1180 Q 520 820 ${bx - 155} ${by + 35}`}
          stroke={PIP.limb}
          strokeWidth={148}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx={bx - 145}
          cy={by + 10}
          rx={72}
          ry={105}
          transform={`rotate(18 ${bx - 145} ${by + 10})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={12}
        />
        <ellipse
          cx={bx - 88}
          cy={by + 68}
          rx={46}
          ry={32}
          transform={`rotate(-24 ${bx - 88} ${by + 68})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={11}
        />

        {/* Right arm & mitten */}
        <path
          d={`M 680 1240 Q 880 920 ${bx + 150} ${by + 55}`}
          stroke={PIP.line}
          strokeWidth={172}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 680 1240 Q 880 920 ${bx + 150} ${by + 55}`}
          stroke={PIP.limb}
          strokeWidth={148}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx={bx + 145}
          cy={by + 15}
          rx={72}
          ry={105}
          transform={`rotate(-18 ${bx + 145} ${by + 15})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={12}
        />
        <ellipse
          cx={bx + 88}
          cy={by + 72}
          rx={46}
          ry={32}
          transform={`rotate(24 ${bx + 88} ${by + 72})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={11}
        />
      </g>

      <FocusRings x={bx} y={by} t={t} r0={160} color="#FFE27A" />
      <Sparkle x={bx - 210} y={by - 150} t={t - 2} s={2.2} />
      <Sparkle x={bx + 220} y={by - 120} t={t - 5} s={1.8} />
      <Toast x={960} y={880} t={t - 1} text="SAVED" hold={30} color={UI.good} />
    </g>
  );
};

// ---------- S10: wide, stadium goal end: pile of balls at Pip's feet, Mo sinks to his knees; SAVED 47/47 ----------
const BALL_PILE = [
  [-180, 0],
  [-120, 4],
  [-60, 2],
  [60, 3],
  [120, 1],
  [180, 4],
  [235, 2],
  [-148, -42],
  [-90, -40],
  [90, -42],
  [148, -38],
  [202, -36],
  [-118, -80],
  [118, -82],
  [172, -78],
  [142, -118],
];
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 960,
        y: 660 - LEG_LEN * 0.92,
        scale: 0.92,
        yaw: -0.2,
        look: -0.6,
        glasses: 1,
        armL: { a: 45, b: 85 },
        armR: { a: 105, b: 15 },
      },
    },
    {
      f: 14,
      p: {
        armR: { a: 122, b: 10 },
        headTilt: -4,
      },
      ease: easeOut,
    },
    {
      f: 26,
      p: {
        armR: { a: 98, b: 25 },
        headTilt: 2,
      },
    },
  ]);
  const rHand = toWorld(pip, joints(pip).armR.end);

  // Mo on his knees near the penalty spot, exhausted
  const mo = poseAt(t, [
    {
      f: 0,
      p: {
        x: 520,
        y: 830,
        scale: 1.05,
        yaw: 0.35,
        tilt: 12,
        legL: { a: 86, b: -115 },
        legR: { a: 78, b: -110 },
        armL: { a: 135, b: 95 },
        armR: { a: 135, b: 95 },
      },
    },
    {
      f: 12,
      p: {
        y: 855,
        tilt: 28,
        headTilt: 18,
        squash: 0.08,
      },
      ease: easeOut,
    },
  ]);

  const savedCount = Math.min(47, 42 + Math.floor(t / 5));

  return (
    <g transform={camT(960, kf(t, [[0, 575], [len, 585]]), kf(t, [[0, 0.98], [len, 1.04]]))}>
      <Stadium t={t + 95} id="s10st" mode="pitch" veil={0.3} />

      {/* Pyramid of saved footballs around Pip's feet */}
      {BALL_PILE.map(([dx, dy], i) => (
        <PasteIn key={i} x={960 + dx} y={664 + dy} t={t + 12 - i} color={CYAN} ring={38}>
          <SoccerBall x={960 + dx} y={664 + dy} r={26} rot={i * 37} shadow={dy >= 0 ? 0.35 : 0.15} />
        </PasteIn>
      ))}

      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0.6} />
      {/* Ball caught effortlessly in Pip's right hand */}
      <SoccerBall x={rHand.x + 14} y={rHand.y - 6} r={26} rot={t * 8} shadow={0} />
      <Sparkle x={rHand.x + 36} y={rHand.y - 36} t={t - 14} s={1.1} />

      {/* Mo sinking to his knees on the turf */}
      <ellipse cx={mo.x + 24} cy={mo.y + 82} rx={94} ry={16} fill="#000" opacity={0.45} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'tired']]) }} rimId="rimL" shadow={0} />

      {/* Top-right counter readout: SAVED 47/47 */}
      <g transform="translate(1620 135)">
        <rect x={-210} y={-44} width={420} height={88} rx={44} fill={UI.pill} opacity={0.82} />
        <rect x={-210} y={-44} width={420} height={88} rx={44} fill="none" stroke={UI.text} strokeWidth={3} opacity={0.85} />
        <circle cx={-162} cy={0} r={11} fill={UI.good} />
        <text x={20} y={15} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={UI.text} letterSpacing={3}>
          {`SAVED ${savedCount}/47`}
        </text>
      </g>
    </g>
  );
};

// ---------- S11: title, wide, rooftop: premise over the city at dusk; Pip spinning a football; stopwatch reads 0.025 s ----------
const ROOF_FEET = 824;
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    {
      f: 0,
      p: {
        x: 960,
        y: ROOF_FEET - LEG_LEN * 0.68,
        scale: 0.68,
        yaw: 0.15,
        armL: { a: 18, b: 8 },
        armR: { a: 145, b: 18 },
        handR: 'point',
      },
    },
    {
      f: 24,
      p: {
        armR: { a: 156, b: 12 },
        headTilt: -4,
      },
      ease: easeOut,
    },
  ]);
  const finger = toWorld(pose, joints(pose).armR.end);

  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={t} sunX={960} sunY={685 - 40 * easeOut(clamp(t / 40))} />
      <Hero look={PIP} pose={{ ...pose, handR: 'point', ...faceAt(t, [[0, 'happy'], [28, 'cool']]) }} rimId="rimR" shadow={0.6} />
      {/* Football spinning on Pip's pointing finger */}
      <SoccerBall x={finger.x + 4} y={finger.y - 34} r={24} rot={t * 32} shadow={0} />
      <TitleCard t={t} lines={['WHAT IF YOU', 'REACTED 10X FASTER?']} accent="10X" accentT={30} size={102} y={170} />
      <Dial x={1710} y={865} r={88} p={0.9} readout="0.025s" size={36} />
    </g>
  );
};

// ---------- S12: close-up, stadium track: Pip at the start line, smug, then a flicker of doubt ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.9 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 600 };
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y - HEAD.y * sc,
    scale: sc,
    yaw: 0.25,
    look: kf(t, [
      [0, 0.3],
      [9, -0.55],
    ]),
    headTilt: kf(t, [
      [0, 4],
      [10, -5],
    ]),
    armL: { a: 14, b: -6 },
    armR: { a: 14, b: -6 },
    ...faceAt(t, [
      [0, 'smug'],
      [8, 'worried'],
    ]),
  };

  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-560 -380) scale(1.9)">
          <Stadium t={t + 165} id="s12st" mode="track" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S13: wide, side-on, over the starter's arm: Pip in lane 4 and Mo in lane 5 crouched in the blocks ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const setLift = easeOut(clamp((t - 6) / 10)); // "On your marks... Set!" hips rise slightly
  const moPose: Pose = {
    ...basePose,
    x: 745,
    y: 740 - setLift * 12,
    scale: 0.86,
    yaw: 0.85,
    tilt: 46 + setLift * 8,
    headTilt: -18,
    look: 0.8,
    armL: { a: -32, b: 8 },
    armR: { a: -22, b: 4 },
    legL: { a: 54, b: -96 },
    legR: { a: -8, b: -68 },
    ...faceAt(t, [[0, 'neutral']]),
  };
  const pipPose: Pose = {
    ...basePose,
    x: 455,
    y: 880 - setLift * 16,
    scale: 1.0,
    yaw: 0.9,
    tilt: 48 + setLift * 8,
    headTilt: -16,
    look: 0.9,
    armL: { a: -34, b: 8 },
    armR: { a: -24, b: 4 },
    legL: { a: 58, b: -98 },
    legR: { a: -12, b: -70 },
    ...faceAt(t, [[0, 'smug']]),
    glint: t >= 14 ? 1 : 0,
    glintColor: CYAN,
  };

  return (
    <g transform={camT(kf(t, [[0, 920], [len, 950]]), 585, kf(t, [[0, 1.04], [len, 1.1]]))}>
      <Stadium t={t + 195} id="s13st" mode="track" veil={0.32} />

      {/* Starting blocks & sensor beacons aligned right at Mo's and Pip's back feet */}
      <StartingBlocks x={675} y={815} s={0.82} />
      <StartingBlocks x={390} y={955} s={0.98} />
      <TrackBeacon x={525} y={995} s={0.95} red={false} />

      <Hero look={MO} pose={moPose} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={pipPose} rimId="rimR" shadow={0.6} />

      {/* Over the starter's arm in the dark left foreground: raised starter's pistol silhouetted against the floodlights */}
      <Foreground blur={6}>
        <g transform={`translate(210 ${420 - setLift * 25})`}>
          {/* Starter's shoulder and raised arm */}
          <path d="M -280 720 Q -180 420 -80 280 L 40 -120" stroke="#0E0B16" strokeWidth={96} fill="none" strokeLinecap="round" />
          {/* Starter's ear defenders & cap silhouette */}
          <circle cx={-150} cy={380} r={95} fill="#0E0B16" />
          <rect x={-190} y={340} width={85} height={55} rx={22} fill="#1C1626" />
          {/* Starter's hand and pistol held high against the bright sky */}
          <g transform="translate(45 -135) rotate(-18)">
            <circle cx={0} cy={0} r={34} fill="#14101E" />
            <rect x={-18} y={-78} width={34} height={68} rx={6} fill="#14101E" />
            <rect x={-14} y={-92} width={88} height={32} rx={5} fill="#14101E" />
            <path d="M -12 -92 L 72 -92" stroke={PAL.warm} strokeWidth={3} opacity={0.7} />
          </g>
        </g>
      </Foreground>
    </g>
  );
};

// ---------- S14: schematic: BANG at 0 s; red FALSE START zone (< 0.100 s); NORMAL 0.25 s; YOU 0.025 s in red ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  // Timeline axis: x=240 (0.000 s) to x=1680 (0.300 s) -> 4800 px per second
  // 0.025 s -> x = 360; 0.100 s -> x = 720; 0.250 s -> x = 1440
  const redZone = easeOut(clamp((t - 6) / 10));
  const normalPop = backOut(clamp((t - 18) / 7));
  const youPop = backOut(clamp((t - 26) / 7));
  const rulerPop = easeOut(clamp((t - 34) / 10));

  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.04]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sch14" />

      <SchLabel
        x={960}
        y={120}
        t={t - 1}
        text="WORLD ATHLETICS RULE TR16.6 · START BLOCK SENSORS"
        size={34}
        color={SCH.dim}
      />

      {/* Red FALSE START zone (0.000 s to 0.100 s: x=240..720) */}
      {redZone > 0 ? (
        <g>
          <rect
            x={240}
            y={310}
            width={480 * redZone}
            height={230}
            fill={UI.bad}
            opacity={0.26}
          />
          <rect
            x={240}
            y={310}
            width={480 * redZone}
            height={230}
            fill="none"
            stroke={UI.bad}
            strokeWidth={4}
            strokeDasharray="14 10"
          />
        </g>
      ) : null}
      <SchLabel x={545} y={405} t={t - 10} text="FALSE START" size={30} color={UI.bad} />
      <SchLabel x={545} y={448} t={t - 12} text="(< 0.100 s)" size={26} color={UI.bad} />

      {/* Legal reaction zone (0.100 s to 0.300 s: x=720..1680) */}
      {t >= 12 ? (
        <rect
          x={720}
          y={310}
          width={960 * easeOut(clamp((t - 12) / 10))}
          height={230}
          fill={UI.good}
          opacity={0.08}
        />
      ) : null}

      {/* Main horizontal axis */}
      <DrawOn d="M 240 540 L 1680 540" t={t - 2} dur={10} width={6} />
      {/* Tick marks at 0.000 s, 0.100 s, 0.200 s, 0.250 s, 0.300 s */}
      {[
        [240, '0.000 s', 'GUN BANG'],
        [720, '0.100 s', 'LEGAL LIMIT'],
        [1440, '0.250 s', 'NORMAL HUMAN'],
      ].map(([x, timeStr, sub], i) => (
        <g key={i}>
          <DrawOn d={`M ${x} 515 L ${x} 565`} t={t - 4 - i * 4} dur={5} width={5} />
          <SchLabel x={Number(x)} y={605} t={t - 5 - i * 4} text={String(timeStr)} size={34} />
          <SchLabel x={Number(x)} y={648} t={t - 7 - i * 4} text={String(sub)} size={26} color={SCH.dim} />
        </g>
      ))}

      {/* NORMAL 0.250 s marker on the right */}
      {normalPop > 0 ? (
        <g transform={`translate(1440 430) scale(${normalPop})`}>
          <rect x={-135} y={-42} width={270} height={76} rx={16} fill={UI.pill} stroke={UI.good} strokeWidth={4} />
          <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={UI.good}>
            NORMAL · 0.25s
          </text>
        </g>
      ) : null}

      {/* YOU 0.025 s marker dropping deep inside the red FALSE START zone at x=360 */}
      {youPop > 0 ? (
        <g>
          <Arrow x0={360} y0={265} x1={360} y1={528} t={t - 26} dur={6} color={SCH.live} bend={0} />
          <g transform={`translate(360 225) scale(${youPop})`}>
            <rect
              x={-165}
              y={-46}
              width={330}
              height={84}
              rx={18}
              fill={UI.bad}
              stroke="#FFF4DC"
              strokeWidth={4}
              style={{ filter: `drop-shadow(0 0 18px ${UI.bad})` }}
            />
            <text y={11} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FFF4DC" fontWeight={700}>
              YOU · 0.025 s
            </text>
          </g>
          <circle cx={360} cy={540} r={16 * youPop} fill={SCH.live} stroke="#FFF4DC" strokeWidth={4} />
        </g>
      ) : null}

      {/* Lower comparison bar: Ruler drop d = 1/2 g t^2 (30.7 cm vs 3.1 mm) */}
      {rulerPop > 0 ? (
        <g opacity={rulerPop}>
          <rect x={240} y={735} width={1440} height={175} rx={20} fill="#0B1220" stroke={SCH.grid} strokeWidth={3} />
          <SchLabel
            x={300}
            y={795}
            t={t - 34}
            text="RULER DROP (d = ½gt²):"
            size={30}
            color={SCH.dim}
            anchor="start"
          />
          <SchLabel
            x={300}
            y={855}
            t={t - 36}
            text="0.25 s → FALLS 30.7 cm"
            size={36}
            color={SCH.line}
            anchor="start"
          />
          <SchLabel
            x={1040}
            y={855}
            t={t - 38}
            text="0.025 s → FALLS 3.1 mm (DQ!)"
            size={36}
            color={SCH.live}
            anchor="start"
          />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S15: medium wide, side-on: Pip is three strides gone while the gun smoke is still a puff; Mo still crouched; red light flashes ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  // Mo is still frozen in the blocks at the start line!
  const moPose: Pose = {
    ...basePose,
    x: 490,
    y: 790,
    scale: 0.9,
    yaw: 0.85,
    tilt: 52,
    headTilt: -14,
    look: 1,
    armL: { a: -32, b: 8 },
    armR: { a: -22, b: 4 },
    legL: { a: 54, b: -96 },
    legR: { a: -8, b: -68 },
    ...faceAt(t, [[0, 'shock']]),
  };

  // Pip is already 3 strides down the track (at key=14 he is at x=1220), looking back in shock at the red beacon
  const pipX = kf(
    t,
    [
      [0, 780],
      [14, 1220],
      [len, 1420],
    ],
    easeOut,
  );
  const pipPose: Pose = {
    ...walkPose(pipX, t * 0.95, 875 + LEG_LEN * 1.0, 1.0, {
      tilt: 24,
      yaw: 0.65,
      look: -1,
      headTilt: 8,
    }),
    ...faceAt(t, [[0, 'shock']]),
  };

  return (
    <g transform={camT(kf(t, [[0, 920], [len, 990]]), 615, 1.18)}>
      <Stadium t={t + 250} id="s15st" mode="track" red={0.45} veil={0.32} />

      <StartingBlocks x={380} y={845} s={0.82} />
      <StartingBlocks x={335} y={915} s={0.92} />

      {/* Speed ghost / streak from Pip's blocks to Pip */}
      <g stroke={CYAN} strokeWidth={5} strokeDasharray="24 14" opacity={0.65}>
        <path d={`M 450 860 L ${pipX - 90} 860`} />
        <path d={`M 430 910 L ${pipX - 120} 910`} />
      </g>

      <Hero look={MO} pose={moPose} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={pipPose} rimId="rimRed" shadow={0.5} />

      {/* Red false-start beacon flashing brightly beside the start line */}
      <TrackBeacon x={555} y={985} s={1.22} red={true} t={t} />
      <Toast x={555} y={760} t={t} text="FALSE START · 0.025s" hold={30} color={UI.bad} />

      {/* Starter's pistol at top-left edge with gun smoke puff still hanging around the barrel */}
      <g transform="translate(220 450)">
        <rect x={-60} y={-20} width={85} height={30} rx={5} fill="#181520" />
        {[
          [48, -8, 34],
          [82, -22, 44],
          [74, 14, 28],
          [112, -6, 32],
        ].map(([sx, sy, sr], i) => (
          <circle
            key={i}
            cx={sx + t * 0.8}
            cy={sy - t * 0.4}
            r={sr + t * 0.5}
            fill="#E6E2DC"
            opacity={0.78 - i * 0.1}
          />
        ))}
      </g>
    </g>
  );
};

// ---------- S16: insert, stadium scoreboard: LANE 4 PIP R.T. 0.025, FALSE START blinking red, then DQ stamps on ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const blink = Math.floor(t / 4) % 2 === 0;
  const dqScale = t >= 26 ? backOut(clamp((t - 26) / 6)) : 0; // at key=40 DQ is fully stamped on!

  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur10)">
        <Stadium t={t + 280} id="s16st" mode="track" red={0.55} />
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#06040C" opacity={0.42} />

      {/* Steel support trusses holding the scoreboard */}
      <rect x={460} y={880} width={54} height={260} fill="#181522" />
      <rect x={1406} y={880} width={54} height={260} fill="#181522" />

      {/* Scoreboard outer housing */}
      <rect
        x={230}
        y={135}
        width={1460}
        height={780}
        rx={28}
        fill="#161420"
        stroke="#342E46"
        strokeWidth={10}
      />
      <rect x={265} y={170} width={1390} height={710} rx={16} fill="#0B0912" />
      <path d="M 245 140 L 1675 140" stroke={PAL.warm} strokeWidth={4} opacity={0.65} />
      <Glow x={960} y={520} r={620} kind="red" o={0.32} />

      {/* Header bar */}
      <rect x={295} y={200} width={1330} height={78} rx={10} fill="#181424" />
      <text x={335} y={252} fontFamily={FONT.ui} fontSize={36} fill={SCH.dim} letterSpacing={3}>
        100M SPRINT · START INFORMATION SYSTEM
      </text>
      <text x={1590} y={252} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill={UI.live}>
        RULE TR16.8
      </text>

      {/* Lane 3 row */}
      <g transform="translate(295 310)">
        <rect x={0} y={0} width={1330} height={105} rx={12} fill="#12101B" />
        <text x={45} y={66} fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>
          LANE 3
        </text>
        <text x={320} y={66} fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>
          K. ATO
        </text>
        <text x={980} y={66} fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>
          R.T. —
        </text>
      </g>

      {/* Lane 4 (PIP) highlighted row */}
      <g transform="translate(295 435)">
        <rect
          x={0}
          y={0}
          width={1330}
          height={138}
          rx={14}
          fill="#2C0D16"
          stroke={UI.bad}
          strokeWidth={5}
        />
        <text x={45} y={86} fontFamily={FONT.ui} fontSize={54} fill="#FFF4DC" fontWeight={700}>
          LANE 4
        </text>
        <text x={320} y={86} fontFamily={FONT.ui} fontSize={54} fill="#FFF4DC" fontWeight={700}>
          PIP
        </text>
        <text x={560} y={86} fontFamily={FONT.ui} fontSize={54} fill={UI.live} fontWeight={700}>
          R.T. 0.025 s
        </text>
      </g>

      {/* Lane 5 (MO) row */}
      <g transform="translate(295 595)">
        <rect x={0} y={0} width={1330} height={105} rx={12} fill="#12101B" />
        <text x={45} y={66} fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>
          LANE 5
        </text>
        <text x={320} y={66} fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>
          MO
        </text>
        <text x={980} y={66} fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>
          R.T. —
        </text>
      </g>

      {/* Blinking FALSE START banner at bottom of scoreboard */}
      <g transform="translate(960 790)" opacity={blink ? 1 : 0.45}>
        <rect x={-480} y={-44} width={960} height={82} rx={14} fill={UI.bad} />
        <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#FFF4DC" letterSpacing={6} fontWeight={700}>
          FALSE START · UNDER 0.100 s
        </text>
      </g>

      {/* Big DQ stamp slamming onto Lane 4 */}
      {dqScale > 0 ? (
        <g transform={`translate(1455 504) rotate(-10) scale(${dqScale})`}>
          <rect
            x={-165}
            y={-78}
            width={330}
            height={156}
            rx={22}
            fill="#1A050A"
            stroke={UI.bad}
            strokeWidth={10}
            style={{ filter: `drop-shadow(0 0 24px ${UI.bad})` }}
          />
          <text y={28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={108} fill={UI.bad} letterSpacing={4}>
            DQ
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S17: extreme close-up: "That's real." Pip, worried, the light turning red on him ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 5.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 690 };
  const red = clamp(0.35 + (t / len) * 0.65);
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y - HEAD.y * sc,
    scale: sc,
    yaw: -0.15,
    look: -0.2,
    headTilt: -4,
    armL: { a: 14, b: -6 },
    armR: { a: 14, b: -6 },
    ...faceAt(t, [[0, 'worried']]),
  };

  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-580 -440) scale(2.0)">
          <Stadium t={t + 330} id="s17st" mode="track" red={red} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#090208" opacity={0.28} />
      <Glow x={760} y={540} r={560} kind="red" o={0.45 * red} />
      <Hero look={PIP} pose={pose} rimId="rimRed" shadow={0} />
    </g>
  );
};

// ---------- S18: wide, outside: a black car at the kerb under a streetlight, the suit watching through the open rear window ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const suitPose: Pose = {
    ...basePose,
    x: 845,
    y: 830,
    scale: 0.7,
    yaw: -0.35,
    look: -0.6,
    armL: { a: 45, b: 65 },
    armR: { a: 35, b: 55 },
    ...faceAt(t, [[0, 'neutral']]),
  };

  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <NightSky id="s18sky" horizonY={700} />
      <Stars seed={81} x0={-200} y0={-100} w={2320} h={600} t={t} n={50} />

      {/* Distant stadium bowl and glowing floodlight towers beyond the fence */}
      <g opacity={0.85}>
        <path d="M 120 490 Q 740 430 1380 490 L 1380 680 L 120 680 Z" fill="#141224" />
        {[260, 640, 1080].map((fx, i) => (
          <g key={i}>
            <path d={`M ${fx - 10} 490 L ${fx - 4} 280 M ${fx + 10} 490 L ${fx + 4} 280`} stroke="#18162A" strokeWidth={5} />
            <rect x={fx - 42} y={250} width={84} height={36} rx={5} fill="#FFF4DC" />
            <Glow x={fx} y={268} r={220} o={0.55} />
          </g>
        ))}
      </g>

      {/* Trees and wrought-iron stadium perimeter fence */}
      {[120, 420, 1340, 1780].map((tx, i) => (
        <circle key={`tr${i}`} cx={tx} cy={610} r={95 + (i % 2) * 25} fill="#0E1320" />
      ))}
      <rect x={-300} y={665} width={2520} height={140} fill="#141622" />
      {Array.from({ length: 38 }).map((_, i) => {
        const px = -240 + i * 62;
        return <path key={`fn${i}`} d={`M ${px} 545 L ${px} 670`} stroke="#1F2233" strokeWidth={5} />;
      })}
      <path d="M -260 560 L 2200 560 M -260 655 L 2200 655" stroke="#1F2233" strokeWidth={7} />
      {/* Brick gate pillars */}
      {[520, 1220].map((gx, i) => (
        <rect key={`pil${i}`} x={gx - 28} y={525} width={56} height={150} fill="#25202E" stroke="#120E1A" strokeWidth={4} />
      ))}

      {/* Streetlamp on the right casting a warm pool over the kerb and black car */}
      <path d="M 1540 780 L 1540 210 Q 1540 160 1440 160" stroke="#1E202C" strokeWidth={14} fill="none" />
      <ellipse cx={1425} cy={164} rx={42} ry={12} fill="#FFE2B0" />
      <Cone d="M 1390 168 L 1460 168 L 1780 880 L 920 880 Z" o={0.38} />
      <Glow x={1425} y={168} r={340} o={0.75} />

      {/* Pavement kerb and dark wet asphalt street */}
      <rect x={-300} y={765} width={2520} height={24} fill="#2A2C3C" />
      <path d="M -300 765 L 2220 765" stroke={PAL.warm} strokeWidth={2.5} opacity={0.5} />
      <rect x={-300} y={789} width={2520} height={450} fill="#10121C" />
      <path d="M -300 940 L 2220 940" stroke="#E9C46A" strokeWidth={6} strokeDasharray="60 50" opacity={0.45} />

      {/* The sleek black executive car parked at the kerb */}
      <g transform="translate(960 805)">
        <ellipse cx={0} cy={58} rx={470} ry={28} fill="#000" opacity={0.65} />
        {/* Lower chassis */}
        <path
          d="M -440 20 L -410 -48 L -240 -58 L -110 -145 L 220 -145 L 350 -58 L 445 -38 L 455 24 Z"
          fill="#12141E"
          stroke="#07080E"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/*Rear passenger window opening (halfway down, showing the Suit inside) */}
        <clipPath id="s18carWin">
          <polygon points="-95,-132 65,-132 65,-58 -195,-58" />
        </clipPath>
        <g clipPath="url(#s18carWin)">
          <rect x={-210} y={-140} width={290} height={90} fill="#0A0D18" />
          {/* Cool blue tablet glow inside the cabin */}
          <Glow x={-45} y={-75} r={110} kind="cool" o={0.75} />
          <g transform="translate(-960 -805)">
            <Hero look={SUIT} pose={suitPose} rimId="rimBlue" shadow={0} />
          </g>
          {/* Half-raised tinted window glass */}
          <rect x={-210} y={-84} width={290} height={35} fill="#182030" opacity={0.82} />
          <path d="M -200 -84 L 70 -84" stroke="#9FC0FF" strokeWidth={2.5} opacity={0.7} />
        </g>

        {/* Front tinted window (closed) */}
        <polygon points="82,-132 208,-132 322,-58 82,-58" fill="#181C2B" stroke="#2C3248" strokeWidth={3} />
        {/* Warm rim line along roof and bonnet from streetlamp */}
        <path
          d="M -240 -58 L -110 -145 L 220 -145 L 350 -58 L 445 -38"
          stroke={PAL.warm}
          strokeWidth={3.5}
          fill="none"
          opacity={0.75}
        />
        {/* Door handles and B-pillar */}
        <rect x={65} y={-136} width={16} height={80} fill="#0B0C12" />
        <rect x={-40} y={-42} width={36} height={6} rx={3} fill="#5E6478" />
        <rect x={110} y={-42} width={36} height={6} rx={3} fill="#5E6478" />

        {/* Red tail light and warm headlight */}
        <rect x={-436} y={-36} width={24} height={18} rx={4} fill="#FF3A3A" />
        <Glow x={-430} y={-28} r={90} kind="red" o={0.65} />
        <polygon points="432,-32 452,-26 452,-8 428,-12" fill="#FFF4DC" />
        <Glow x={445} y={-20} r={110} o={0.6} />

        {/* Wheels and alloy rims */}
        {[-285, 295].map((wx, i) => (
          <g key={i} transform={`translate(${wx} 26)`}>
            <circle r={54} fill="#0A0B10" stroke="#222534" strokeWidth={6} />
            <circle r={32} fill="#2E3346" />
            <circle r={10} fill="#12141E" />
          </g>
        ))}
      </g>

      <LightVeil id="s18veil" lights={[[1425, 168, 460], [1150, 760, 560], [640, 280, 420]]} o={0.35} />
    </g>
  );
};

// ---------- S19: close-up through the car window: the suit's face lit by a tablet reading 0.025 s; window glides up; headlights snap on ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.2 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 475 };
  const suitPose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y - HEAD.y * sc,
    scale: sc,
    yaw: -0.12,
    look: kf(t, [
      [0, -0.45],
      [12, -0.45],
      [18, 0],
    ]),
    headTilt: kf(t, [
      [0, 5],
      [16, 0],
    ]),
    armL: { a: 36, b: 65 },
    armR: { a: 36, b: 65 },
    ...faceAt(t, [
      [0, 'neutral'],
      [18, 'smug'],
    ]),
  };

  // Window rises from y=875 (at t=22) to y=170 (at t=48).
  // At key=30, winY is ~805: clearly rising above the sill while the tablet (y=626..774) and the Suit's face remain 100% clear!
  const winP = easeIn(clamp((t - 22) / 26));
  const winY = lerp(875, 170, winP);
  const lightsOn = t >= 36 ? easeOut(clamp((t - 36) / 6)) : 0;

  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      {/* Dark leather car cabin interior */}
      <rect x={-200} y={-200} width={2320} height={1480} fill="#080A12" />
      {/* Rear headrest behind the Suit */}
      <rect x={750} y={295} width={420} height={240} rx={48} fill="#121522" stroke="#07080E" strokeWidth={6} />
      {/* Blurred stadium lights through far window */}
      <g filter="url(#blur16)" opacity={0.45}>
        <circle cx={420} cy={310} r={90} fill="#FFE2B0" />
        <circle cx={1480} cy={280} r={70} fill="#FF9A4A" />
      </g>

      {/* Cool blue light from the tablet illuminating the Suit from below */}
      <Glow x={960} y={700} r={580} kind="cool" o={0.68} />
      <Hero look={SUIT} pose={suitPose} rimId="rimBlue" shadow={0} />

      {/* Glowing dossier tablet held below his chest, reading SUBJECT: PIP / R.T. 0.025 s */}
      <g transform="translate(960 700)">
        <rect x={-250} y={-74} width={500} height={148} rx={18} fill="#121C2E" stroke="#7FD4FF" strokeWidth={5} />
        <circle cx={-180} cy={0} r={34} fill="#1E2F4D" stroke={CYAN} strokeWidth={3} />
        <circle cx={-180} cy={-6} r={14} fill="#F6EFE3" />
        <text x={-115} y={-14} fontFamily={FONT.ui} fontSize={30} fill={CYAN} letterSpacing={2}>
          SUBJECT: PIP
        </text>
        <text x={-115} y={34} fontFamily={FONT.ui} fontSize={44} fill={UI.live} fontWeight={700}>
          R.T. 0.025 s
        </text>
      </g>

      {/* Tinted car window glass gliding up */}
      <g>
        <rect x={160} y={winY} width={1600} height={1000} fill="#0D1320" opacity={0.82} />
        <path d={`M 160 ${winY} L 1760 ${winY}`} stroke="#A9C6FF" strokeWidth={5} opacity={0.85} />
        {/* Diagonal streetlamp reflection on the rising glass */}
        <path
          d={`M 420 ${winY + 40} L 680 ${winY + 40} L 520 ${winY + 520} L 260 ${winY + 520} Z`}
          fill="#FFF4DC"
          opacity={0.08}
        />
      </g>

      {/* Car door & window frame surrounding the shot */}
      <path
        d="M -200 -200 L 2120 -200 L 2120 1280 L -200 1280 Z M 240 160 L 1680 160 L 1760 880 L 160 880 Z"
        fill="#10121B"
        fillRule="evenodd"
      />
      <path
        d="M 240 160 L 1680 160 L 1760 880 L 160 880 Z"
        fill="none"
        stroke="#282E42"
        strokeWidth={10}
        strokeLinejoin="round"
      />
      <path d="M 220 148 L 1700 148" stroke={PAL.warm} strokeWidth={4} opacity={0.65} />

      {/* At t=36 ("just noticed."), headlights/beacon flare bright across the frame */}
      {lightsOn > 0 ? (
        <g opacity={lightsOn}>
          <Glow x={220} y={840} r={520} o={0.95} />
          <Glow x={1700} y={840} r={520} o={0.95} />
          <ellipse cx={960} cy={840} rx={860 * lightsOn} ry={18} fill="#FFF6E0" opacity={0.75} />
        </g>
      ) : null}
    </g>
  );
};
