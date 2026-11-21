import React from 'react';
import { clamp, lerp } from '../../engine/anim';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Stars, Rays } from '../../engine/kit';
import { GroundPlane, PALETTE } from '../../brand';

export const INK = '#121019';
export const SPACE_DEEP = '#080818';
export const SPACE_MID = '#0F132C';

export const GLOW_HEX: Record<string, string> = {
  gold: PALETTE.gold,
  cyan: PALETTE.cyan,
  red: PALETTE.red,
  violet: '#9D6BFF',
};

export const GLOW_KIND: Record<string, 'warm' | 'cool' | 'red'> = {
  gold: 'warm',
  cyan: 'cool',
  red: 'red',
  violet: 'cool',
};

/** Continuous shot-aware progress anchored near sp.t so adjacent shots step forward cleanly. */
export const shotProg = (spVal: unknown, p: number, span = 0.16) => {
  const base = Number(spVal ?? 0.5);
  return clamp(lerp(Math.max(0, base - span * 0.65), Math.min(1, base + span * 0.35), p));
};

/** Full-frame cosmic backdrop extending beyond camera pan/zoom bounds for both 16:9 and 9:16. */
export const DeepCosmos: React.FC<{
  id: string;
  t: number;
  W: number;
  H: number;
  seed?: number;
  starCount?: number;
  topColor?: string;
  bottomColor?: string;
  rayX?: number;
  rayY?: number;
  rayColor?: string;
  rayOpacity?: number;
  glowKind?: 'warm' | 'cool' | 'red';
  glowOpacity?: number;
}> = ({
  id,
  t,
  W,
  H,
  seed = 103,
  starCount = 110,
  topColor = '#070715',
  bottomColor = '#121736',
  rayX = W * 0.78,
  rayY = H * 0.22,
  rayColor = '#DCE6FF',
  rayOpacity = 0.1,
  glowKind = 'cool',
  glowOpacity = 0.35,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}bg`} x1="0" y1={-H * 0.4} x2="0" y2={H * 1.1} gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={topColor} />
        <stop offset="65%" stopColor={bottomColor} />
        <stop offset="100%" stopColor="#090B1A" />
      </linearGradient>
    </defs>
    <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}bg)`} />
    <Stars seed={seed} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={starCount} o={0.86} />
    {glowOpacity > 0 ? <Glow x={rayX} y={rayY} r={Math.min(W, H) * 0.52} kind={glowKind} o={glowOpacity} /> : null}
    {rayOpacity > 0 ? <Rays x={rayX} y={rayY} t={t} len={Math.max(W, H) * 1.4} n={12} o={rayOpacity} color={rayColor} /> : null}
  </g>
);

/** Subtle space deck or solid floor at groundY with pale rim line so Pip never floats ungrounded. */
export const StageDeck: React.FC<{
  id: string;
  ground: number;
  W: number;
  H: number;
  fill?: string;
  rim?: string;
  translucent?: boolean;
}> = ({ id, ground, W, H, fill = '#13162B', rim = '#9FB4E8', translucent = false }) => {
  if (!translucent) {
    return (
      <g>
        <GroundPlane y={ground} fill={fill} rim={rim} />
        <line x1={-W} y1={ground + 6} x2={W * 2} y2={ground + 6} stroke={INK} strokeWidth={2.5} opacity={0.45} />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}deck`} x1="0" y1={ground} x2="0" y2={ground + H * 0.35} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={fill} stopOpacity={0.78} />
          <stop offset="100%" stopColor="#070814" stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <rect x={-W} y={ground} width={W * 3} height={H * 2} fill={`url(#${id}deck)`} />
      <line x1={-W} y1={ground} x2={W * 2} y2={ground} stroke={rim} strokeWidth={3} opacity={0.48} />
    </g>
  );
};

/** Atmospheric finishing pass for mid layer: floating dust motes + soft dark corner LightVeil. */
export const MidAtmosphere: React.FC<{
  id: string;
  t: number;
  W: number;
  H: number;
  seed: number;
  lights: [number, number, number][];
  veilOpacity?: number;
  dustOpacity?: number;
}> = ({ id, t, W, H, seed, lights, veilOpacity = 0.38, dustOpacity = 0.45 }) => (
  <g>
    <LightVeil id={`${id}lv`} lights={lights} o={veilOpacity} />
    <Dust t={t} seed={seed} x0={-120} y0={-80} w={W + 240} h={H + 160} n={34} o={dustOpacity} />
  </g>
);

/** Edge-hugging foreground silhouettes in the near layer that never obscure Pip or text slots. */
export const EdgeSilhouettes: React.FC<{
  W: number;
  H: number;
  ground: number;
  kind?: 'rock' | 'tech' | 'console';
}> = ({ W, H, ground, kind = 'tech' }) => {
  const u = Math.min(W, H) / 1080;
  if (kind === 'rock') {
    return (
      <g opacity={0.86}>
        <path
          d={`M ${-220} ${H + 220} L ${-220} ${ground + 36} L ${45 * u} ${ground + 48} L ${115 * u} ${ground + 135 * u} L ${160 * u} ${H + 220} Z`}
          fill="#090A14"
          stroke={INK}
          strokeWidth={4}
        />
        <path
          d={`M ${W + 220} ${H + 220} L ${W + 220} ${ground + 24} L ${W - 55 * u} ${ground + 52} L ${W - 135 * u} ${ground + 145 * u} L ${W - 180 * u} ${H + 220} Z`}
          fill="#090A14"
          stroke={INK}
          strokeWidth={4}
        />
      </g>
    );
  }
  if (kind === 'console') {
    return (
      <g opacity={0.88}>
        <path
          d={`M ${-200} ${H + 200} L ${-200} ${ground + 20} L ${100 * u} ${ground + 70} L ${150 * u} ${H + 200} Z`}
          fill="#0B0C18"
          stroke={INK}
          strokeWidth={4}
        />
        <path
          d={`M ${W + 200} ${H + 200} L ${W + 200} ${ground + 20} L ${W - 100 * u} ${ground + 70} L ${W - 150 * u} ${H + 200} Z`}
          fill="#0B0C18"
          stroke={INK}
          strokeWidth={4}
        />
      </g>
    );
  }
  return (
    <g opacity={0.82}>
      <polygon
        points={`${-180},${H + 200} ${-180},${ground + 60} ${75 * u},${ground + 120} ${110 * u},${H + 200}`}
        fill="#080915"
        stroke={INK}
        strokeWidth={3.5}
      />
      <polygon
        points={`${W + 180},${H + 200} ${W + 180},${ground + 60} ${W - 75 * u},${ground + 120} ${W - 110 * u},${H + 200}`}
        fill="#080915"
        stroke={INK}
        strokeWidth={3.5}
      />
    </g>
  );
};

/** Flickering thruster flame jet with warm bloom. */
export const FlameJet: React.FC<{ x: number; y: number; t: number; scale?: number; dir?: 1 | -1; o?: number }> = ({
  x,
  y,
  t,
  scale = 1,
  dir = 1,
  o = 1,
}) => {
  const fl = 0.85 + 0.25 * Math.sin(t * 1.9 + x * 0.1) + 0.12 * Math.cos(t * 3.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale} ${scale * dir})`} opacity={o}>
      <Glow x={0} y={24} r={42} kind="warm" o={0.55} />
      <path
        d={`M -11 0 Q -14 ${26 * fl} 0 ${58 * fl} Q 14 ${26 * fl} 11 0 Z`}
        fill="#FF6B2D"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d={`M -6 0 Q -7 ${18 * fl} 0 ${38 * fl} Q 7 ${18 * fl} 6 0 Z`} fill="#FFE488" />
    </g>
  );
};

/**
 * Reusable detailed BepiColombo stack (MTM + MPO + MOSIF sunshield + Mio cutaway).
 * Origin (0,0) is centered near the MPO core.
 */
export const BepiStackArt: React.FC<{
  id: string;
  t: number;
  scale?: number;
  fire?: number;
  cutaway?: boolean;
  separateMTM?: number;
  separateShield?: number;
  wingSpan?: number;
}> = ({
  id,
  t,
  scale = 1,
  fire = 0,
  cutaway = false,
  separateMTM = 0,
  separateShield = 0,
  wingSpan = 165,
}) => {
  const dishSweep = Math.sin(t / 28) * 5;
  const mtmY = 66 + separateMTM * 55;
  const shieldY = -72 - separateShield * 60;
  return (
    <g transform={`scale(${scale})`}>
      {/* Solar Wings */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * 44} -10) scale(${side} 1)`}>
          <rect x={0} y={-6} width={16} height={12} fill="#8F9BB5" stroke={INK} strokeWidth={3.5} />
          <rect x={14} y={-24} width={wingSpan} height={48} rx={4} fill="#1B2547" stroke={INK} strokeWidth={4} />
          {[0.25, 0.5, 0.75].map((f, idx) => (
            <line key={idx} x1={14 + wingSpan * f} y1={-22} x2={14 + wingSpan * f} y2={22} stroke="#4768B2" strokeWidth={2.5} />
          ))}
          <line x1={16} y1={0} x2={12 + wingSpan} y2={0} stroke="#4768B2" strokeWidth={2.5} />
          <line x1={18} y1={-18} x2={wingSpan} y2={-18} stroke="#8FB4FF" strokeWidth={2} opacity={0.45} />
        </g>
      ))}

      {/* MTM Transfer Module at bottom */}
      <g transform={`translate(0 ${mtmY})`}>
        {fire > 0.05 ? (
          <g>
            {[-26, -9, 9, 26].map((nx, idx) => (
              <FlameJet key={idx} x={nx} y={32} t={t + idx * 3} scale={0.62} o={fire} />
            ))}
          </g>
        ) : null}
        <rect x={-38} y={-24} width={76} height={50} rx={5} fill="#C98827" stroke={INK} strokeWidth={4} />
        <rect x={-26} y={-14} width={52} height={30} rx={3} fill="#E6AA42" stroke={INK} strokeWidth={2.5} />
        {[-26, -9, 9, 26].map((nx, idx) => (
          <polygon
            key={idx}
            points={`${nx - 6},26 ${nx + 6},26 ${nx + 8},35 ${nx - 8},35`}
            fill="#4B556B"
            stroke={INK}
            strokeWidth={3}
          />
        ))}
      </g>

      {/* MPO Gold-Foil Orbiter Body */}
      <rect x={-46} y={-52} width={92} height={90} rx={8} fill="#E5A235" stroke={INK} strokeWidth={4} />
      <rect x={-34} y={-38} width={68} height={62} rx={4} fill="#F4C35C" stroke={INK} strokeWidth={2.5} />
      <rect x={-24} y={-28} width={48} height={20} rx={2} fill="#B8761A" stroke={INK} strokeWidth={2} />
      {/* Radiator louver lines */}
      {[-12, -4, 4, 12].map((lx) => (
        <line key={lx} x1={lx} y1={4} x2={lx} y2={20} stroke="#FFF0C2" strokeWidth={2} opacity={0.75} />
      ))}

      {/* High-Gain Grey Antenna Dish */}
      <g transform={`translate(48 -32) rotate(${-18 + dishSweep})`}>
        <line x1={-10} y1={6} x2={6} y2={-4} stroke="#8D99B3" strokeWidth={5} strokeLinecap="round" />
        <path d="M 0 -22 A 22 22 0 0 1 0 22 Z" fill="#A9B4CA" stroke={INK} strokeWidth={3.5} />
        <line x1={0} y1={0} x2={14} y2={0} stroke={INK} strokeWidth={3} />
        <circle cx={15} cy={0} r={3.5} fill="#EAF0FF" stroke={INK} strokeWidth={2} />
      </g>

      {/* Silver Conical Sunshield + Mio tucked inside */}
      <g transform={`translate(0 ${shieldY})`}>
        <polygon points="-44,22 44,22 30,-42 -30,-42" fill="#C7D1E4" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <polygon points="-44,22 -14,22 -10,-42 -30,-42" fill="#95A2BA" opacity={0.55} />
        {cutaway ? (
          <g>
            {/* Cutaway window revealing Mio inside */}
            <path d="M -28 16 L -20 -32 L 20 -32 L 28 16 Z" fill="#171A2D" stroke={INK} strokeWidth={3} />
            {/* Octagonal Mio orbiter */}
            <polygon points="-14,-22 14,-22 20,-10 20,6 14,14 -14,14 -20,6 -20,-10" fill="#EAEFF8" stroke={INK} strokeWidth={3} />
            <rect x={-16} y={-8} width={32} height={10} fill="#293B6B" stroke={INK} strokeWidth={2} />
            <rect x={-10} y={-20} width={20} height={8} fill="#F2B33D" stroke={INK} strokeWidth={2} />
            {/* Tiny magnetometer tip */}
            <line x1={0} y1={-22} x2={0} y2={-36} stroke="#9FB0D0" strokeWidth={2.5} />
            <circle cx={0} cy={-37} r={3} fill={PALETTE.cyan} />
          </g>
        ) : (
          <g>
            <line x1={-28} y1={-10} x2={28} y2={-10} stroke="#8D99B3" strokeWidth={3} />
            <line x1={-34} y1={6} x2={34} y2={6} stroke="#EAF0FF" strokeWidth={2.5} opacity={0.65} />
          </g>
        )}
      </g>
      <defs>
        <filter id={`${id}noop`} />
      </defs>
    </g>
  );
};

/** Cratered Mercury globe with optional scrolling craters, terminator shadow, and rim glow. */
export const MercurySphere: React.FC<{
  id: string;
  cx: number;
  cy: number;
  r: number;
  spinOffset?: number;
  terminatorShift?: number;
  baseColor?: string;
  shadowColor?: string;
  rimColor?: string;
  rimOpacity?: number;
  sunOnLeft?: boolean;
}> = ({
  id,
  cx,
  cy,
  r,
  spinOffset = 0,
  terminatorShift = 0.05,
  baseColor = '#7C8294',
  shadowColor = '#171928',
  rimColor = '#FFD480',
  rimOpacity = 0.75,
  sunOnLeft = false,
}) => {
  const craters: [number, number, number][] = [
    [-0.45, -0.35, 0.16],
    [0.2, -0.48, 0.12],
    [-0.12, 0.1, 0.22],
    [0.42, 0.18, 0.15],
    [-0.52, 0.36, 0.14],
    [0.12, 0.55, 0.11],
    [0.62, -0.25, 0.1],
    [-0.78, -0.05, 0.13],
  ];
  const shift = ((spinOffset % 1) + 1) % 1;
  const termRx = Math.max(0.05, Math.abs(terminatorShift)) * r;
  const darkLeft = !sunOnLeft;
  const termPath = darkLeft
    ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${termRx} ${r} 0 1 ${terminatorShift >= 0 ? 1 : 0} ${cx} ${cy - r} Z`
    : `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${termRx} ${r} 0 1 ${terminatorShift >= 0 ? 0 : 1} ${cx} ${cy - r} Z`;

  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={baseColor} />
      <g clipPath={`url(#${id}clip)`}>
        {/* Craters scrolling gently across the disc */}
        {craters.map(([fx, fy, fr], i) => {
          const xNorm = ((fx + shift * 1.4 + 1.2) % 2.4) - 1.2;
          const xPos = cx + xNorm * r;
          const yPos = cy + fy * r;
          const cr = fr * r;
          return (
            <g key={i}>
              <circle cx={xPos} cy={yPos} r={cr} fill="#5C6273" stroke="#424756" strokeWidth={2.5} />
              <path
                d={`M ${xPos - cr * 0.7} ${yPos - cr * 0.4} A ${cr * 0.85} ${cr * 0.85} 0 0 1 ${xPos + cr * 0.6} ${yPos - cr * 0.5}`}
                fill="none"
                stroke="#AEB6CC"
                strokeWidth={2}
                opacity={0.65}
              />
            </g>
          );
        })}
        {/* Hard shadow terminator */}
        <path d={termPath} fill={shadowColor} opacity={0.88} />
      </g>
      {/* Sunlit rim arc */}
      {rimOpacity > 0 ? (
        <path
          d={sunOnLeft ? `M ${cx} ${cy - r + 2} A ${r - 2} ${r - 2} 0 0 0 ${cx} ${cy + r - 2}` : `M ${cx} ${cy - r + 2} A ${r - 2} ${r - 2} 0 0 1 ${cx} ${cy + r - 2}`}
          fill="none"
          stroke={rimColor}
          strokeWidth={5}
          opacity={rimOpacity}
        />
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
};

/** Small crisp planet disc helper for compare / delay / diagrams. */
export const SimplePlanet: React.FC<{
  x: number;
  y: number;
  r: number;
  fill: string;
  shade?: string;
  rim?: string;
  children?: React.ReactNode;
}> = ({ x, y, r, fill, shade = '#0F1324', rim, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={fill} stroke={INK} strokeWidth={4} />
    {children}
    <path d={`M 0 ${-r + 2} A ${r - 2} ${r - 2} 0 0 1 0 ${r - 2} A ${r * 0.45} ${r - 2} 0 0 0 0 ${-r + 2} Z`} fill={shade} opacity={0.42} />
    {rim ? <path d={`M ${-r * 0.68} ${-r * 0.58} A ${r * 0.85} ${r * 0.85} 0 0 1 ${r * 0.25} ${-r * 0.85}`} fill="none" stroke={rim} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} /> : null}
    <circle r={r} fill="none" stroke={INK} strokeWidth={4} />
  </g>
);
