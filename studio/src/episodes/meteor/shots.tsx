import React from 'react';
import {
  Hero,
  Pose,
  basePose,
  poseAt,
  faceAt,
  kf,
  clamp,
  lerp,
  easeOut,
  backOut,
  settle,
  camTV,
  LOOKS,
  LEG_LEN,
  HEAD,
  joints,
  toWorld,
  Park,
  ParkBench,
  ShootingStar,
  StarJar,
  PARK_PATH_Y,
  Schematic,
  SCH,
  DrawOn,
  Arrow,
  SchLabel,
  CountUp,
  Tabletop,
  Phone,
  Foreground,
  Sparkle,
  FocusRings,
  Toast,
  TitleCard,
  HudChip,
  Glow,
  Rays,
  UI,
  FONT,
  S3 as PAL,
  ShotProps,
} from '../../engine';

// "What if you could catch a shooting star?" (Ifmosphere · 1080x1920 Vertical 9:16)
// Every shot composed natively for 1080x1920 with all key action and text inside y = 200..1540 (safe area).

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const STAR_GOLD = '#FFE27A';
const STAR_CYAN = '#7FD4FF';

// ---------- S1: wide, night park: a bright Taurid meteor streaks across the sky as Pip looks up ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.18;
  const footY = PARK_PATH_Y + 40;
  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 520,
        y: footY - LEG_LEN * sc,
        scale: sc,
        yaw: 0.25,
        look: -0.2,
        headTilt: -4,
        armL: { a: 14, b: -8 },
        armR: { a: 16, b: -10 },
      },
    },
    {
      f: 14,
      p: {
        yaw: 0.35,
        look: 0.5,
        headTilt: -18,
        armL: { a: 22, b: -12 },
        armR: { a: 34, b: 14 },
      },
      ease: easeOut,
    },
    {
      f: 32,
      p: {
        yaw: 0.42,
        look: 0.8,
        headTilt: -22,
        armR: { a: 48, b: 22 },
      },
    },
  ]);
  const face = faceAt(t, [
    [0, 'neutral'],
    [12, 'shock'],
    [26, 'happy'],
  ]);

  // Hero Taurid shooting star streaking across the upper sky (at key=28 it is at x=650, y=455)
  const streakP = clamp((t - 2) / 40);
  const sx = lerp(140, 910, streakP);
  const sy = lerp(290, 540, streakP);

  return (
    <g transform={camTV(540, kf(t, [[0, 950], [len, 920]]), kf(t, [[0, 0.98], [len, 1.04]]))}>
      <Park t={t} id="s1p" meteors={1} />

      {/* Dashed trajectory wake behind the hero meteor */}
      <path
        d={`M 140 290 L ${sx} ${sy}`}
        stroke={STAR_CYAN}
        strokeWidth={4}
        strokeDasharray="16 12"
        strokeLinecap="round"
        opacity={0.55}
      />
      <ShootingStar x={sx} y={sy} r={22} tailLen={340} angle={-162} t={t} id="s1hero" />

      <Hero
        look={PIP}
        pose={{ ...pip, ...face, glint: t >= 14 ? 0.85 : 0, glintColor: STAR_GOLD }}
        rimId="rimR"
        shadow={0.65}
      />

      {/* Blurred dark foreground foliage at bottom edges for depth */}
      <Foreground blur={10}>
        <circle cx={60} cy={1760} r={190} fill="#070D14" />
        <circle cx={1020} cy={1780} r={210} fill="#070D14" />
      </Foreground>
    </g>
  );
};

// ---------- S2: low angle, medium: Pip reaches his right hand straight up toward the falling streak ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.45;
  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 520,
        y: 1210,
        scale: sc,
        yaw: 0.32,
        tilt: -4,
        headTilt: -14,
        look: 0.5,
        squash: 0.06, // anticipation crouch
        armL: { a: 22, b: -12 },
        armR: { a: 45, b: 35 },
      },
    },
    {
      f: 10,
      p: {
        y: 1185,
        tilt: -8,
        headTilt: -22,
        look: 0.75,
        squash: -0.05, // stretch into reach
        armL: { a: 32, b: -14 },
        armR: { a: 166, b: 8 },
      },
      ease: easeOut,
    },
    {
      f: 18,
      p: {
        y: 1192,
        squash: 0,
        armR: { a: 160, b: 12 },
      },
    },
  ]);
  const rHand = toWorld(pip, joints(pip).armR.end);

  // Descending streak aiming toward Pip's raised hand (at key=16 it's at (640, 565))
  const sp = easeOut(clamp(t / 24));
  const sx = lerp(280, rHand.x + 25, sp);
  const sy = lerp(310, rHand.y - 110, sp);

  return (
    <g transform={camTV(540, kf(t, [[0, 965], [len, 925]]), kf(t, [[0, 1.32], [len, 1.44]]))}>
      <Park t={t + 55} id="s2p" low={210} bench={false} meteors={2} />
      <Glow x={sx} y={sy} r={280} o={0.5} />
      <ShootingStar x={sx} y={sy} r={22} tailLen={280} angle={-138} t={t} id="s2st" />

      <Hero
        look={PIP}
        pose={{
          ...pip,
          ...faceAt(t, [
            [0, 'neutral'],
            [8, 'happy'],
          ]),
          glint: 1,
          glintColor: STAR_GOLD,
        }}
        rimId="rimR"
        shadow={0}
      />
      <FocusRings x={rHand.x} y={rHand.y - 20} t={t - 8} r0={35} color={STAR_GOLD} />
    </g>
  );
};

// ---------- S3: macro insert, slow motion (look: catch): streak freezes in Pip's open palm ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const freezeP = easeOut(clamp(t / 8)); // streaks in 0..8, freezes at (555, 895) from t=8 onwards (key=11)
  const closeP = clamp((t - 9) / 5);
  const sx = lerp(220, 555, freezeP);
  const sy = lerp(470, 895, freezeP);
  const hx = lerp(420, 535, freezeP) + settle(t - 8, 8, 1.8, 5);
  const hy = lerp(1120, 955, freezeP);
  const tailLen = lerp(460, 290, clamp((t - 6) / 10));

  return (
    <g transform={camTV(540, 940, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -480) scale(1.75)">
          <Park t={80 + t * 0.12} id="s3p" bench={false} meteors={0} />
        </g>
      </g>
      <rect x={-200} y={-200} width={1480} height={2320} fill="#060814" opacity={0.32} />
      <Glow x={sx} y={sy} r={460} kind="cool" o={0.45} />
      <Glow x={sx} y={sy} r={340} kind="warm" o={0.65} />

      {/* Concentric slow-motion starlight rings around the frozen star */}
      {[95, 165, 240].map((r, i) => (
        <circle
          key={i}
          cx={sx}
          cy={sy}
          r={r + t * 1.4}
          fill="none"
          stroke={i === 0 ? STAR_GOLD : STAR_CYAN}
          strokeWidth={3.5 - i * 0.7}
          strokeDasharray="18 12"
          opacity={0.55 - i * 0.12}
        />
      ))}

      {/* Pip's hooded forearm and open mitten palm reaching up from bottom-left */}
      <g filter="url(#rimR)">
        <path
          d={`M 160 1720 Q 340 1320 ${hx - 20} ${hy + 40}`}
          stroke={PIP.line}
          strokeWidth={162}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 160 1720 Q 340 1320 ${hx - 20} ${hy + 40}`}
          stroke={PIP.limb}
          strokeWidth={138}
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`translate(${hx} ${hy}) rotate(${lerp(-18, -6, freezeP)}) scale(5.6)`}>
          {/* Open mitten palm */}
          <ellipse cx={4} cy={-4} rx={15} ry={18} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.5} />
          {/* Thumb on left */}
          <ellipse
            cx={-11 + closeP * 2}
            cy={-2}
            rx={6.5}
            ry={10}
            transform={`rotate(${-26 + closeP * 18} -11 -2)`}
            fill={PIP.hand}
            stroke={PIP.line}
            strokeWidth={2.5}
          />
        </g>
      </g>

      {/* The frozen slow-motion shooting star hovering right in Pip's palm */}
      <ShootingStar x={sx} y={sy} r={36} tailLen={tailLen} angle={-128} t={t} id="s3star" />

      {/* Fingers curling gently around the lower rim of the star */}
      <g filter="url(#rimR)" transform={`translate(${hx} ${hy}) rotate(${lerp(-18, -6, freezeP)}) scale(5.6)`}>
        <ellipse
          cx={12 - closeP * 3}
          cy={-14 + closeP * 4}
          rx={10}
          ry={6}
          transform={`rotate(${18 - closeP * 24} 12 -14)`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={2.4}
        />
      </g>

      <FocusRings x={sx} y={sy} t={t - 6} r0={55} color={STAR_GOLD} />
      <Sparkle x={sx + 95} y={sy - 85} t={t - 5} s={2.1} />
      <Sparkle x={sx - 105} y={sy + 35} t={t - 8} s={1.6} />
    </g>
  );
};

// ---------- S4: close-up: "It's warm." Pip's face lit warm gold from below by the star cupped in his mittens ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.1 * (1 + 0.03 * clamp(t / len));
  const head = { x: 515, y: 820 };
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y - HEAD.y * sc,
    scale: sc,
    yaw: 0.24,
    look: 0.15,
    headTilt: kf(t, [
      [0, 6],
      [12, 10],
      [len, 8],
    ]),
    armL: { a: 18, b: -10 },
    armR: { a: 18, b: -10 },
    ...faceAt(t, [
      [0, 'happy'],
      [11, 'smug'],
    ]),
    glint: 0.9,
    glintColor: STAR_GOLD,
  };

  const starX = 545;
  const starY = 1165 + Math.sin(t * 0.25) * 5;

  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-360 -420) scale(1.7)">
          <Park t={t + 100} id="s4p" bench={false} meteors={1} />
        </g>
      </g>
      <rect x={0} y={0} width={1080} height={1920} fill="#070510" opacity={0.28} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />

      {/* Warm golden glow from the cupped star lighting Pip's face from below */}
      <Glow x={starX} y={starY - 60} r={480} kind="warm" o={0.75} />

      {/* Cupped mittens Drawn in front of chest holding the warm star */}
      <g filter="url(#rimR)">
        <ellipse
          cx={starX - 62}
          cy={starY + 26}
          rx={68}
          ry={44}
          transform={`rotate(24 ${starX - 62} ${starY + 26})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={10}
        />
        <ellipse
          cx={starX + 62}
          cy={starY + 26}
          rx={68}
          ry={44}
          transform={`rotate(-24 ${starX + 62} ${starY + 26})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={10}
        />
      </g>

      <ShootingStar x={starX} y={starY} r={34} tailLen={0} t={t} id="s4st" />

      {/* Rising warm heat / steam wisps */}
      {[0, 1, 2].map((i) => {
        const wx = starX + (i - 1) * 38;
        const wy = starY - 55;
        const sway = Math.sin(t / 5 + i * 1.8) * 12;
        return (
          <path
            key={i}
            d={`M ${wx} ${wy} Q ${wx - 14 + sway} ${wy - 45} ${wx + sway * 0.5} ${wy - 90} Q ${wx + 14 + sway} ${wy - 135} ${wx - sway * 0.4} ${wy - 175}`}
            stroke="#FFE7B3"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.55 + 0.2 * Math.sin(t / 4 + i)}
          />
        );
      })}
      <Sparkle x={starX + 85} y={starY - 65} t={t - 4} s={1.5} />
    </g>
  );
};

// ---------- S5: over the shoulder, medium: Mo by the park bench with eyes squeezed shut making a wish ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.42;
  const mo = poseAt(t, [
    {
      f: 0,
      p: {
        x: 645,
        y: 1185,
        scale: sc,
        yaw: -0.35,
        facing: -1,
        tilt: -3,
        headTilt: -8,
        blink: 1,
        expr: 'happy',
        armL: { a: 52, b: 82 },
        armR: { a: 48, b: 86 },
      },
    },
    {
      f: 14,
      p: {
        tilt: -5,
        headTilt: -12,
        squash: 0.03,
         blink: 1,
        expr: 'happy',
        armL: { a: 58, b: 88 },
        armR: { a: 54, b: 92 },
      },
      ease: easeOut,
    },
  ]);
  const moHands = toWorld(mo, joints(mo).armL.end);

  return (
    <g transform={camTV(540, kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 1.26], [len, 1.34]]))}>
      <Park t={t + 130} id="s5p" meteors={2} />

      <Hero look={MO} pose={{ ...mo, blink: 1, expr: 'happy' }} rimId="rimL" shadow={0.55} />
      {/* Clasped wishing hands highlight */}
      <Sparkle x={moHands.x - 18} y={moHands.y - 24} t={t - 8} s={1.2} />

      {/* Over Pip's blurred dark shoulder & hood in left foreground, holding the glowing star */}
      <Foreground blur={10}>
        <path d="M -120 1650 Q 20 1160 220 1080 Q 340 1120 350 1650 Z" fill="#12101C" />
        <circle cx={155} cy={935} r={135} fill="#161422" />
      </Foreground>
      <Glow x={295} y={1145} r={220} kind="warm" o={0.75} />
      <ShootingStar x={295} y={1145} r={22} tailLen={0} t={t} id="s5st" />
    </g>
  );
};

// ---------- S6: medium two-shot: "You hand it to him." Pip drops the glowing star into Mo's cupped hands ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.24;
  const passP = easeOut(clamp((t - 2) / 10)); // Pip hands star across 2..12; at key=18 Mo holds it in shock!
  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 325,
        y: 1185,
        scale: sc,
        yaw: 0.45,
        look: 0.6,
        armL: { a: 16, b: -8 },
        armR: { a: 58, b: 36 },
      },
    },
    {
      f: 10,
      p: {
        tilt: 6,
        armR: { a: 86, b: 12 },
      },
      ease: easeOut,
    },
    {
      f: 20,
      p: {
        tilt: 2,
        armR: { a: 48, b: 28 },
      },
    },
  ]);

  const mo = poseAt(t, [
    {
      f: 0,
      p: {
        x: 755,
        y: 1185,
        scale: sc,
        yaw: -0.45,
        facing: -1,
        blink: 1,
        look: -0.6,
        armR: { a: 18, b: -10 },
        armL: { a: 62, b: 48 },
      },
    },
    {
      f: 11,
      p: {
        blink: 0,
        tilt: -6,
        headTilt: 5,
        squash: -0.04,
        armL: { a: 76, b: 22 },
      },
      ease: easeOut,
    },
    {
      f: 18,
      p: {
        blink: 0,
        tilt: -4,
        squash: 0,
        armL: { a: 72, b: 26 },
      },
    },
  ]);
  const pipHand = toWorld(pip, joints(pip).armR.end);
  const moHand = toWorld(mo, joints(mo).armL.end);
  const starX = lerp(pipHand.x + 12, moHand.x - 14, passP);
  const starY = lerp(pipHand.y - 10, moHand.y - 12, passP) - Math.sin(passP * Math.PI) * 35;

  return (
    <g transform={camTV(540, kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 1.2], [len, 1.28]]))}>
      <Park t={t + 170} id="s6p" bench={false} meteors={1} />

      <Hero
        look={PIP}
        pose={{
          ...pip,
          ...faceAt(t, [
            [0, 'happy'],
            [12, 'smug'],
          ]),
        }}
        rimId="rimR"
        shadow={0.55}
      />
      <Hero
        look={MO}
        pose={{
          ...mo,
          blink: t < 10 ? 1 : 0,
          expr: t < 10 ? 'happy' : 'shock',
          glint: t >= 10 ? 0.9 : 0,
          glintColor: STAR_GOLD,
        }}
        rimId="rimL"
        shadow={0.55}
      />

      <Glow x={starX} y={starY} r={320} kind="warm" o={0.8} />
      <ShootingStar x={starX} y={starY} r={24} tailLen={0} t={t} id="s6st" />
      <FocusRings x={starX} y={starY} t={t - 10} r0={35} color={STAR_GOLD} />
      <Sparkle x={starX} y={starY - 48} t={t - 10} s={1.4} />
    </g>
  );
};

// ---------- S7: high-angle insert: "By midnight," bench top with 00:00 phone & Pip dropping a star into the jar ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const dropP = easeOut(clamp((t - 2) / 12)); // hand brings star to jar mouth and drops it in (key=14)
  const jarX = 655;
  const jarY = 1185;
  const hx = lerp(380, 585, clamp(t / 9));
  const hy = lerp(480, 745, clamp(t / 9));
  const starX = lerp(hx + 45, jarX, dropP);
  const starY = lerp(hy + 55, jarY - 195, dropP);

  return (
    <g transform={camTV(540, 960, kf(t, [[0, 1.0], [len, 1.06]]))}>
      {/* High-angle park bench wooden slats filling the middle frame */}
      <Tabletop edge={1420} />
      {[420, 680, 940, 1200].map((sy, i) => (
        <path key={i} d={`M -200 ${sy} L 1280 ${sy}`} stroke="#1A1210" strokeWidth={8} opacity={0.65} />
      ))}
      <Glow x={jarX} y={jarY - 120} r={520} kind="warm" o={0.65} />

      {/* Pip's Phone on the left of the bench reading 00:00 MIDNIGHT */}
      <g transform="translate(275 1040) rotate(-10)">
        <Phone x={0} y={0} w={185} rot={0} on={1} caller="00:00" />
        <rect x={-72} y={-125} width={144} height={68} rx={10} fill="#141C30" />
        <text y={-76} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={STAR_CYAN} fontWeight={700}>
          00:00
        </text>
      </g>

      {/* Open glass mason jar on the bench */}
      <StarJar x={jarX} y={jarY} s={2.35} stars={t >= 13 ? 9 : 8} glow={1.25} lid={false} t={t} />
      {/* Jar lid resting beside the jar */}
      <g transform="translate(885 1215) rotate(14)">
        <ellipse cx={0} cy={8} rx={68} ry={22} fill="#000" opacity={0.35} />
        <ellipse cx={0} cy={0} rx={64} ry={22} fill="#8C96A6" stroke="#181520" strokeWidth={5} />
        <ellipse cx={0} cy={-4} rx={48} ry={14} fill="#6E7888" />
      </g>

      {/* Falling star entering the mouth of the jar */}
      {t < 17 ? <ShootingStar x={starX} y={starY} r={26} tailLen={85} angle={-110} t={t} id="s7st" /> : null}

      {/* Pip's arm & mitten coming in from top-left */}
      <g filter="url(#rimR)">
        <path
          d={`M 120 180 Q 340 480 ${hx - 15} ${hy - 10}`}
          stroke={PIP.line}
          strokeWidth={142}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 120 180 Q 340 480 ${hx - 15} ${hy - 10}`}
          stroke={PIP.limb}
          strokeWidth={120}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx={hx + 18}
          cy={hy + 22}
          rx={62}
          ry={46}
          transform={`rotate(28 ${hx + 18} ${hy + 22})`}
          fill={PIP.hand}
          stroke={PIP.line}
          strokeWidth={10}
        />
      </g>

      <FocusRings x={jarX} y={jarY - 210} t={t - 9} r0={45} color={STAR_GOLD} />
      <Sparkle x={jarX + 95} y={jarY - 250} t={t - 10} s={1.6} />
    </g>
  );
};

// ---------- S8: medium close-up: "your jar is glowing." Jar packed with 12 stars humming intensely; Pip & Mo uneasy ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.32;
  const humX = Math.sin(t * 1.9) * 3.5;
  const humY = Math.cos(t * 2.3) * 2.5;
  const jarX = 540 + humX;
  const jarY = 1095 + humY;

  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 315,
        y: 1210,
        scale: sc,
        yaw: 0.42,
        look: 0.65,
        armL: { a: 18, b: -10 },
        armR: { a: 72, b: 28 },
      },
    },
    {
      f: 14,
      p: {
        tilt: -6, // leans back slightly from the intense glow
        headTilt: -5,
        armR: { a: 68, b: 32 },
      },
      ease: easeOut,
    },
  ]);

  const mo = poseAt(t, [
    {
      f: 0,
      p: {
        x: 765,
        y: 1210,
        scale: sc,
        yaw: -0.42,
        facing: -1,
        look: -0.65,
        armR: { a: 18, b: -10 },
        armL: { a: 54, b: 42 },
      },
    },
    {
      f: 14,
      p: {
        tilt: 7, // leans back slightly
        headTilt: 6,
      },
      ease: easeOut,
    },
  ]);

  return (
    <g transform={camTV(540, kf(t, [[0, 965], [len, 945]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Park t={t + 210} id="s8p" veil={0.45} bench={false} meteors={2} />

      <Glow x={jarX} y={jarY - 110} r={490} kind="warm" o={0.85} />
      <Rays x={jarX} y={jarY - 110} t={t * 2} len={420} n={12} o={0.18} color="#FFE7B3" />

      <Hero
        look={PIP}
        pose={{
          ...pip,
          ...faceAt(t, [
            [0, 'smug'],
            [12, 'worried'],
          ]),
          glint: 1,
          glintColor: STAR_GOLD,
        }}
        rimId="rimR"
        shadow={0.5}
      />
      <Hero
        look={MO}
        pose={{
          ...mo,
          ...faceAt(t, [
            [0, 'shock'],
            [14, 'worried'],
          ]),
          glint: 1,
          glintColor: STAR_GOLD,
        }}
        rimId="rimL"
        shadow={0.5}
      />

      {/* Overstuffed glowing StarJar pulsing between them */}
      <StarJar x={jarX} y={jarY} s={1.72} stars={12} glow={1.5} lid={true} t={t * 2.2} />
      <FocusRings x={jarX} y={jarY - 110} t={t - 6} r0={65} color={STAR_GOLD} />
      <FocusRings x={jarX} y={jarY - 110} t={t - 20} r0={65} color={STAR_GOLD} />
    </g>
  );
};

// ---------- S9: title, wide: "What if you could catch shooting stars?" TitleCard + slow-mo streak in palm ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.08;
  const footY = PARK_PATH_Y + 35;
  const pip = poseAt(t, [
    {
      f: 0,
      p: {
        x: 430,
        y: footY - LEG_LEN * sc,
        scale: sc,
        yaw: 0.25,
        look: 0.4,
        headTilt: -10,
        armL: { a: 48, b: 58 },
        armR: { a: 142, b: 16 },
      },
    },
    {
      f: 22,
      p: {
        armR: { a: 158, b: 10 },
        headTilt: -14,
      },
      ease: easeOut,
    },
  ]);
  const mo: Pose = {
    ...basePose,
    x: 695,
    y: footY - LEG_LEN * 1.02,
    scale: 1.02,
    yaw: -0.35,
    facing: -1,
    look: -0.5,
    headTilt: -12,
    armL: { a: 38, b: 48 },
    armR: { a: 18, b: -10 },
    ...faceAt(t, [[0, 'happy']]),
  };
  const rHand = toWorld(pip, joints(pip).armR.end);
  const lHand = toWorld(pip, joints(pip).armL.end);

  return (
    <g transform={camTV(540, kf(t, [[0, 955], [len, 930]]), kf(t, [[0, 0.98], [len, 1.04]]))}>
      <Park t={t + 260} id="s9p" meteors={4} />

      <Hero
        look={PIP}
        pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [24, 'cool']]), glint: 1, glintColor: STAR_GOLD }}
        rimId="rimR"
        shadow={0.6}
      />
      <Hero look={MO} pose={mo} rimId="rimL" shadow={0.6} />

      {/* Glowing jar held in Pip's left hand */}
      <StarJar x={lHand.x + 10} y={lHand.y + 24} s={0.78} stars={12} glow={1.2} t={t} />

      {/* Slow-motion shooting star frozen in Pip's raised right palm */}
      <ShootingStar x={rHand.x + 8} y={rHand.y - 18} r={22} tailLen={240} angle={-135} t={t} id="s9st" />
      <FocusRings x={rHand.x + 8} y={rHand.y - 18} t={t - 18} r0={35} color={STAR_GOLD} />

      {/* Title card inside upper safe area (y=360..460, well below 200px top safe margin) */}
      <TitleCard
        t={t}
        x={540}
        y={355}
        size={72}
        lines={['WHAT IF YOU', 'COULD CATCH A STAR?']}
        accent="STAR"
        accentT={26}
      />
      <g transform="translate(355 555) scale(0.88)">
        <HudChip x={0} y={0} f={t} label="CATCH" icon="pause" />
      </g>
    </g>
  );
};

// ---------- S10: extreme close-up: "One catch." Glow turns crimson, jar cracks, Pip's face swaps to shock ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 540, y: 785 };
  const red = clamp((t - 2) / 10);
  const crack = easeOut(clamp((t - 5) / 8));
  const shakeX = t >= 5 && t < 16 ? Math.sin(t * 3.4) * 7 * (1 - (t - 5) / 11) : 0;

  const pose: Pose = {
    ...basePose,
    x: head.x + shakeX,
    y: head.y - HEAD.y * sc,
    scale: sc,
    yaw: 0.15,
    look: kf(t, [
      [0, 0.2],
      [8, 0],
    ]),
    headTilt: kf(t, [
      [0, 4],
      [8, -4],
    ]),
    armL: { a: 16, b: -8 },
    armR: { a: 16, b: -8 },
    ...faceAt(t, [
      [0, 'smug'],
      [6, 'shock'],
    ]),
    glint: 1,
    glintColor: red > 0.5 ? '#FF5A3A' : STAR_GOLD,
  };

  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -440) scale(1.75)">
          <Park t={t + 330} id="s10p" red={red} bench={false} />
        </g>
      </g>
      <rect x={0} y={0} width={1080} height={1920} fill="#090208" opacity={0.32} />
      <Glow x={540} y={1180} r={540} kind={red > 0.4 ? 'red' : 'warm'} o={0.85} />

      <Hero look={PIP} pose={pose} rimId={red > 0.4 ? 'rimRed' : 'rimR'} shadow={0} />

      {/* Overheating StarJar right below Pip's chin cracking open */}
      <StarJar x={540 + shakeX * 1.4} y={1360} s={2.35} stars={12} glow={1.6} red={red} crack={crack} t={t * 3} />
      <FocusRings x={540} y={1210} t={t - 5} r0={75} color="#FF5A4A" />
    </g>
  );
};

// ---------- S11: schematic, wide: "Taurid meteors hit the air at about" Earth upper atmosphere entry ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const entryP = easeOut(clamp((t - 2) / 22));
  const mx = lerp(210, 645, entryP);
  const my = lerp(475, 795, entryP);
  const hitP = clamp((t - 14) / 12);

  return (
    <g transform={camTV(540, 960, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Schematic t={t} id="sch11" vertical={true} />

      {/* Header inside safe area (y >= 260) */}
      <SchLabel x={540} y={285} t={t - 1} text="IMO METEOR OUTLOOK · NOV 2026" size={30} color={SCH.dim} />
      <SchLabel x={540} y={340} t={t - 3} text="SOUTHERN TAURIDS (STA)" size={42} color={SCH.line} />

      {/* Upper atmosphere boundary (100 km Karman line) and Earth curvature */}
      <DrawOn
        d="M 80 830 Q 540 730 1000 830"
        t={t - 2}
        dur={10}
        color={STAR_CYAN}
        width={4}
      />
      <SchLabel x={275} y={755} t={t - 6} text="100 KM · UPPER ATMOSPHERE" size={26} color={STAR_CYAN} />

      <DrawOn
        d="M 80 1120 Q 540 1010 1000 1120"
        t={t - 4}
        dur={10}
        color={SCH.line}
        width={6}
      />
      <path d="M 80 1120 Q 540 1010 1000 1120 L 1000 1200 L 80 1200 Z" fill="#1C2C44" opacity={0.45} />
      <SchLabel x={540} y={1155} t={t - 8} text="EARTH SURFACE" size={28} color={SCH.dim} />

      {/* Meteoroid entry trajectory & ram-pressure plasma cone */}
      <DrawOn d={`M 210 475 L ${mx} ${my}`} t={t - 2} dur={12} color={SCH.live} width={6} />
      {hitP > 0 ? (
        <g transform={`translate(${mx} ${my}) rotate(36)`}>
          <path
            d={`M -45 -75 Q 45 0 -45 75`}
            fill="none"
            stroke={UI.bad}
            strokeWidth={6}
            opacity={hitP}
          />
          <path
            d={`M -85 -115 Q 75 0 -85 115`}
            fill="none"
            stroke={SCH.live}
            strokeWidth={4}
            strokeDasharray="12 8"
            opacity={hitP * 0.8}
          />
        </g>
      ) : null}
      <ShootingStar x={mx} y={my} r={22} tailLen={190} angle={-144} t={t} red={hitP} id="s11m" />

      {hitP > 0 ? (
        <g>
          <SchLabel x={735} y={695} t={t - 15} text="RAM-PRESSURE SHOCK" size={28} color={UI.bad} />
          <SchLabel x={735} y={735} t={t - 17} text="AIR COMPRESSED TO PLASMA" size={24} color={SCH.live} />
        </g>
      ) : null}

      {/* Timely hook box in lower safe area (y = 1245..1435, well above 1540 bottom safe line) */}
      <g transform="translate(540 1340)">
        <rect x={-430} y={-85} width={860} height={170} rx={20} fill="#0B1220" stroke={SCH.grid} strokeWidth={4} />
        <SchLabel x={0} y={-32} t={t - 10} text="NASA SKY GUIDE · NOVEMBER 2026" size={26} color={SCH.dim} />
        <SchLabel x={0} y={14} t={t - 12} text="SOUTHERN TAURIDS PEAK: ~5 NOV 2026" size={31} color={SCH.line} />
        <SchLabel x={0} y={56} t={t - 14} text="NORTHERN TAURIDS PEAK: ~12 NOV 2026" size={31} color={SCH.live} />
      </g>
    </g>
  );
};

// ---------- S12: schematic, close: "27 kilometres per second." Giant CountUp + shockwave diagram ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const shockP = easeOut(clamp((t - 4) / 16));

  return (
    <g transform={camTV(540, 960, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Schematic t={t + 54} id="sch12" vertical={true} />

      <SchLabel x={540} y={295} t={t - 1} text="ATMOSPHERIC ENTRY SPEED" size={32} color={SCH.dim} />
      <SchLabel x={540} y={350} t={t - 3} text="TAURID METEOROID (STA)" size={42} color={SCH.line} />

      {/* Centre blueprint diagram of meteoroid & parabolic shockwave arcs (y = 430..840) */}
      <g transform="translate(540 645)">
        <Glow x={0} y={0} r={260} kind="red" o={0.45} />
        {/* Velocity vector arrows */}
        <Arrow x0={-360} y0={-80} x1={-90} y1={-30} t={t - 2} dur={8} color={SCH.live} bend={0} />
        <Arrow x0={-380} y0={0} x1={-75} y1={0} t={t - 4} dur={8} color={SCH.live} bend={0} />
        <Arrow x0={-360} y0={80} x1={-90} y1={30} t={t - 6} dur={8} color={SCH.live} bend={0} />

        {/* Parabolic bow shockwaves */}
        {[0, 1, 2].map((i) => {
          const off = i * 48;
          return (
            <path
              key={i}
              d={`M ${-20 + off} ${-150 - i * 28} Q ${135 + off} 0 ${-20 + off} ${150 + i * 28}`}
              fill="none"
              stroke={i === 0 ? UI.bad : SCH.live}
              strokeWidth={6 - i * 1.2}
              strokeDasharray={i === 2 ? '14 10' : undefined}
              opacity={shockP * (0.95 - i * 0.2)}
            />
          );
        })}

        {/* Technical rock silhouette & target crosshairs */}
        <polygon
          points="-55,-32 -12,-54 44,-36 62,8 34,48 -24,52 -62,18"
          fill="#261820"
          stroke={SCH.line}
          strokeWidth={5}
        />
        <circle r={92} fill="none" stroke={SCH.dim} strokeWidth={2.5} strokeDasharray="10 8" />
        <path d="M -115 0 L 115 0 M 0 -115 L 0 115" stroke={SCH.dim} strokeWidth={2} opacity={0.6} />
      </g>

      {/* Giant 27 KM/S readout in middle-lower safe area */}
      <rect x={110} y={885} width={860} height={240} rx={28} fill="#0B1220" stroke={SCH.live} strokeWidth={5} />
      <CountUp x={540} y={1045} t={t - 2} to={27} dur={18} size={136} color={SCH.live} suffix=" KM/S" />
      <SchLabel x={540} y={1100} t={t - 12} text="= 97,200 KM/H · 16.8 MILES PER SECOND" size={28} color={SCH.line} />

      {/* IMO source pill at y = 1265 */}
      <g transform="translate(540 1265)">
        <rect x={-390} y={-48} width={780} height={96} rx={20} fill={UI.pill} stroke={SCH.grid} strokeWidth={3} />
        <SchLabel x={0} y={-8} t={t - 16} text="SOUTHERN TAURIDS: 27 KM/S · NORTHERN: 29 KM/S" size={27} color={SCH.dim} />
        <SchLabel x={0} y={28} t={t - 18} text="SOURCE: INTERNATIONAL METEOR ORGANIZATION (IMO)" size={24} color={STAR_CYAN} />
      </g>
    </g>
  );
};

// ---------- S13: schematic, comparison: "That's over 25 times faster than" Rifle bullet vs Taurid meteor ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const trackW = 820; // x = 130..950
  const bulletP = easeOut(clamp((t - 4) / 18));
  const meteorP = easeOut(clamp((t - 6) / 14));
  const badgeScale = backOut(clamp((t - 18) / 8));

  const bulletW = Math.max(30, (trackW / 27) * bulletP); // 1/27th of the bar!
  const meteorW = trackW * meteorP;

  return (
    <g transform={camTV(540, 960, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Schematic t={t + 113} id="sch13" vertical={true} />

      <SchLabel x={540} y={290} t={t - 1} text="SPEED COMPARISON · TRUE SCALE" size={32} color={SCH.dim} />
      <SchLabel x={540} y={345} t={t - 3} text="METEOROID VS RIFLE BULLET" size={42} color={SCH.line} />

      {/* Track 1: RIFLE BULLET (~1.0 km/s) */}
      <g transform="translate(0 450)">
        <rect x={95} y={0} width={890} height={225} rx={22} fill="#0B1220" stroke={SCH.grid} strokeWidth={4} />
        <SchLabel x={135} y={62} t={t - 3} text="RIFLE BULLET" size={36} color={SCH.line} anchor="start" />
        <SchLabel x={945} y={62} t={t - 5} text="~1.0 KM/S" size={36} color={UI.good} anchor="end" />

        {/* Track background & 1/27th fill */}
        <rect x={130} y={105} width={trackW} height={44} rx={22} fill="#162234" />
        <rect x={130} y={105} width={bulletW} height={44} rx={22} fill={UI.good} />
        {/* Bullet icon */}
        <path
          d={`M ${130 + bulletW + 12} 113 L ${130 + bulletW + 42} 113 Q ${130 + bulletW + 66} 127 ${130 + bulletW + 42} 141 L ${130 + bulletW + 12} 141 Z`}
          fill="#F0C27B"
        />
        <SchLabel x={135} y={192} t={t - 8} text="MUZZLE VELOCITY: ~800–1,000 M/S" size={25} color={SCH.dim} anchor="start" />
      </g>

      {/* Track 2: TAURID METEOR (27.0 km/s) */}
      <g transform="translate(0 735)">
        <rect x={95} y={0} width={890} height={245} rx={22} fill="#1C0C14" stroke={UI.bad} strokeWidth={4} />
        <SchLabel x={135} y={64} t={t - 6} text="TAURID METEOR" size={38} color={SCH.live} anchor="start" />
        <SchLabel x={945} y={64} t={t - 8} text="27.0 KM/S" size={38} color={UI.bad} anchor="end" />

        <rect x={130} y={108} width={trackW} height={48} rx={24} fill="#2A121C" />
        <rect x={130} y={108} width={meteorW} height={48} rx={24} fill={UI.bad} />
        <ShootingStar x={130 + meteorW} y={132} r={22} tailLen={140} angle={180} t={t} red={1} id="s13m" />
        <SchLabel x={135} y={205} t={t - 12} text="27 KM/S ÷ 1 KM/S = 27× RIFLE SPEED" size={26} color="#FFF4DC" anchor="start" />
      </g>

      {/* Giant OVER 25X FASTER stamp in lower safe area (y = 1200) */}
      {badgeScale > 0 ? (
        <g transform={`translate(540 1205) scale(${badgeScale})`}>
          <rect
            x={-410}
            y={-110}
            width={820}
            height={220}
            rx={32}
            fill="#240810"
            stroke={UI.bad}
            strokeWidth={8}
            style={{ filter: `drop-shadow(0 0 28px ${UI.bad})` }}
          />
          <text
            y={-8}
            textAnchor="middle"
            fontFamily={FONT.title}
            fontWeight={800}
            fontSize={76}
            fill="#FFF4DC"
            letterSpacing={3}
          >
            OVER 25× FASTER
          </text>
          <text y={62} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live} letterSpacing={2}>
            THAN A HIGH-POWERED RIFLE BULLET
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S14: macro insert: "a rifle bullet." Hyper-velocity meteoroid & red shockwave tearing toward Pip's hand ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / 22)); // at key=14 p ~ 0.85, rock is at (535, 885) right in front of recoiling hand
  const rx = lerp(190, 610, p);
  const ry = lerp(490, 960, p);
  const recoil = clamp((t - 8) / 10);
  const hx = lerp(680, 775, recoil);
  const hy = lerp(1060, 1175, recoil);

  return (
    <g transform={camTV(540, 940, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-380 -460) scale(1.75)">
          <Park t={t + 360} id="s14p" red={0.85} bench={false} />
        </g>
      </g>
      <rect x={-200} y={-200} width={1480} height={2320} fill="#140308" opacity={0.38} />
      <Glow x={rx} y={ry} r={540} kind="red" o={0.85} />
      <Glow x={rx} y={ry} r={320} kind="warm" o={0.85} />

      {/* Supersonic shockwave cone & speed lines */}
      <g transform={`translate(${rx} ${ry}) rotate(44)`}>
        <path
          d="M -60 -190 Q 150 0 -60 190"
          fill="none"
          stroke="#FF4A3A"
          strokeWidth={10}
          opacity={0.9}
        />
        <path
          d="M -140 -270 Q 210 0 -140 270"
          fill="none"
          stroke="#FF8A3D"
          strokeWidth={6}
          strokeDasharray="20 14"
          opacity={0.75}
        />
      </g>

      <ShootingStar x={rx} y={ry} r={52} tailLen={520} angle={-136} t={t} red={1} id="s14st" />

      {/* Pip's mitten recoiling in bottom-right */}
      <g filter="url(#rimRed)">
        <path
          d={`M 980 1740 Q 860 1420 ${hx + 20} ${hy + 30}`}
          stroke={PIP.line}
          strokeWidth={158}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 980 1740 Q 860 1420 ${hx + 20} ${hy + 30}`}
          stroke={PIP.limb}
          strokeWidth={134}
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`translate(${hx} ${hy}) rotate(22) scale(5.4)`}>
          <ellipse cx={0} cy={0} rx={15} ry={18} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.5} />
          <ellipse cx={-12} cy={2} rx={6.5} ry={10} transform="rotate(-28 -12 2)" fill={PIP.hand} stroke={PIP.line} strokeWidth={2.5} />
        </g>
      </g>

      <Toast x={540} y={410} t={t - 2} text="27 KM/S · SHOCKWAVE" hold={30} color={UI.bad} />
    </g>
  );
};

// ---------- S15: close-up, low angle: "That's real." Pip and Mo look up in dread under crimson fireball light ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.68;
  const red = clamp(0.45 + (t / len) * 0.55);
  const pip: Pose = {
    ...basePose,
    x: 345,
    y: 1255,
    scale: sc,
    yaw: 0.22,
    tilt: -5,
    headTilt: kf(t, [
      [0, -10],
      [14, -20],
    ]),
    look: 0.2,
    armL: { a: 22, b: -12 },
    armR: { a: 38, b: 48 },
    ...faceAt(t, [[0, 'shock']]),
    glint: 1,
    glintColor: '#FF5A3A',
  };
  const mo: Pose = {
    ...basePose,
    x: 745,
    y: 1255,
    scale: sc,
    yaw: -0.22,
    facing: -1,
    tilt: 5,
    headTilt: kf(t, [
      [0, -10],
      [14, -20],
    ]),
    look: -0.2,
    armL: { a: 42, b: 52 },
    armR: { a: 22, b: -12 },
    ...faceAt(t, [[0, 'worried']]),
    glint: 1,
    glintColor: '#FF5A3A',
  };

  return (
    <g transform={camTV(540, kf(t, [[0, 965], [len, 940]]), kf(t, [[0, 1.32], [len, 1.42]]))}>
      <g filter="url(#blur10)">
        <Park t={t + 390} id="s15p" low={220} red={red} bench={false} />
      </g>
      <Glow x={540} y={480} r={680} kind="red" o={0.75 * red} />

      <Hero look={PIP} pose={pip} rimId="rimRed" shadow={0} />
      <Hero look={MO} pose={mo} rimId="rimRed" shadow={0} />
    </g>
  );
};

// ---------- S16: wide, low angle: "And tonight, something much" Colossal Taurid fireball bolide splits the clouds ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.05;
  const footY = PARK_PATH_Y + 180;
  const fbP = easeOut(clamp(t / 32));
  const fbx = lerp(420, 540, fbP);
  const fby = lerp(310, 485, fbP);

  const pip: Pose = {
    ...basePose,
    x: 415,
    y: footY - LEG_LEN * sc,
    scale: sc,
    yaw: 0.28,
    tilt: -8,
    headTilt: -22,
    look: 0.3,
    armL: { a: 28, b: -14 },
    armR: { a: 52, b: 36 },
    ...faceAt(t, [[0, 'shock']]),
    glint: 1,
    glintColor: '#FF5A3A',
  };
  const mo: Pose = {
    ...basePose,
    x: 685,
    y: footY - LEG_LEN * sc,
    scale: sc,
    yaw: -0.28,
    facing: -1,
    tilt: 8,
    headTilt: -22,
    look: -0.3,
    armL: { a: 48, b: 42 },
    armR: { a: 28, b: -14 },
    ...faceAt(t, [[0, 'shock']]),
    glint: 1,
    glintColor: '#FF5A3A',
  };

  return (
    <g transform={camTV(540, kf(t, [[0, 960], [len, 930]]), kf(t, [[0, 0.98], [len, 1.05]]))}>
      <Park t={t + 430} id="s16p" low={160} red={0.8} meteors={4} fireball={0} />

      {/* Colossal Taurid Fireball Bolide breaking through the upper sky */}
      <Glow x={fbx} y={fby} r={620} kind="red" o={0.9} />
      <Glow x={fbx} y={fby} r={380} kind="warm" o={0.95} />
      <Rays x={fbx} y={fby} t={t * 1.5} len={900} n={16} o={0.22} color="#FF7A5A" />
      <ShootingStar x={fbx} y={fby} r={68} tailLen={520} angle={-112} t={t} red={0.9} id="s16fb" />
      <FocusRings x={fbx} y={fby} t={t - 4} r0={85} color="#FF5A4A" />

      <Hero look={PIP} pose={pip} rimId="rimRed" shadow={0.65} />
      <Hero look={MO} pose={mo} rimId="rimRed" shadow={0.65} />
      <StarJar x={535} y={footY + 12} s={0.85} stars={12} glow={1.4} red={1} crack={1} t={t} />
    </g>
  );
};

// ---------- S17: over the shoulder, end card: "bigger is heading your way." + IFMOSPHERE / Comment your what-if ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const grow = easeOut(clamp(t / len));
  const fbx = 540;
  const fby = lerp(430, 515, grow);
  const fbr = lerp(76, 108, grow);
  const cardPop = backOut(clamp((t - 8) / 9));
  const ctaPop = backOut(clamp((t - 15) / 9));

  const pip: Pose = {
    ...basePose,
    x: 335,
    y: 1365,
    scale: 1.28,
    yaw: 0.35,
    tilt: -8,
    headTilt: -22,
    armL: { a: 24, b: -12 },
    armR: { a: 64, b: 28 },
    ...faceAt(t, [[0, 'shock']]),
    glint: 1,
    glintColor: '#FF5A3A',
  };
  const mo: Pose = {
    ...basePose,
    x: 745,
    y: 1365,
    scale: 1.28,
    yaw: -0.35,
    facing: -1,
    tilt: 8,
    headTilt: -22,
    armL: { a: 58, b: 34 },
    armR: { a: 24, b: -12 },
    ...faceAt(t, [[0, 'shock']]),
    glint: 1,
    glintColor: '#FF5A3A',
  };

  return (
    <g transform={camTV(540, 960, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Park t={t + 480} id="s17p" low={210} red={0.92} bench={false} meteors={5} fireball={0} />

      {/* Giant approaching Taurid Fireball in upper safe area */}
      <Glow x={fbx} y={fby} r={680} kind="red" o={0.95} />
      <Glow x={fbx} y={fby} r={420} kind="warm" o={0.95} />
      <Rays x={fbx} y={fby} t={t * 1.8} len={1100} n={18} o={0.26} color="#FF8A5A" />
      <ShootingStar x={fbx} y={fby} r={fbr} tailLen={560} angle={-105} t={t} red={0.95} id="s17fb" />

      {/* Concentric shockwave rings expanding from the fireball */}
      {[150, 240, 340].map((r, i) => (
        <circle
          key={i}
          cx={fbx}
          cy={fby}
          r={r + (t % 30) * 3.5}
          fill="none"
          stroke="#FF6A4A"
          strokeWidth={4 - i}
          strokeDasharray="22 14"
          opacity={0.55 - i * 0.14}
        />
      ))}

      <Hero look={PIP} pose={pip} rimId="rimRed" shadow={0} />
      <Hero look={MO} pose={mo} rimId="rimRed" shadow={0} />

      {/* IFMOSPHERE Channel End Card inside middle safe area (y = 780..1085, well above y = 1540) */}
      {cardPop > 0 ? (
        <g transform={`translate(540 875) scale(${cardPop})`}>
          <rect
            x={-410}
            y={-95}
            width={820}
            height={185}
            rx={32}
            fill="#0B0816"
            opacity={0.9}
            stroke={STAR_GOLD}
            strokeWidth={4}
          />
          <text
            y={-12}
            textAnchor="middle"
            fontFamily={FONT.title}
            fontWeight={800}
            fontSize={72}
            fill={STAR_GOLD}
            letterSpacing={8}
          >
            IFMOSPHERE
          </text>
          <text
            y={50}
            textAnchor="middle"
            fontFamily={FONT.ui}
            fontSize={30}
            fill="#F6EFE3"
            letterSpacing={4}
            opacity={0.9}
          >
            STEP INTO THE WHAT IF.
          </text>
        </g>
      ) : null}

      {ctaPop > 0 ? (
        <g transform={`translate(540 1045) scale(${ctaPop})`}>
          <rect
            x={-330}
            y={-46}
            width={660}
            height={92}
            rx={46}
            fill="#1E1024"
            stroke="#FF8A3D"
            strokeWidth={4}
            style={{ filter: 'drop-shadow(0 0 18px rgba(255,138,61,0.55))' }}
          />
          <circle cx={-270} cy={0} r={12} fill="#FF8A3D" />
          <text x={16} y={13} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FFF4DC" letterSpacing={3}>
            Comment your what-if
          </text>
        </g>
      ) : null}
    </g>
  );
};
