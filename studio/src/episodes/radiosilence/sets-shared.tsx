import React from 'react';
import { PALETTE } from '../../brand';
import { clamp, rnd } from '../../engine/anim';
import { Stars, Rays } from '../../engine/kit';
import { Glow } from '../../engine/light';

export type GlowTone = 'gold' | 'cyan' | 'red';

export const OUT = '#12101E';

export const numParam = (v: unknown, fallback = 0): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

export const glowTone = (v: unknown, fallback: GlowTone = 'cyan'): GlowTone =>
  v === 'gold' || v === 'cyan' || v === 'red' ? v : fallback;

export const toneColor = (g: GlowTone): string =>
  g === 'red' ? PALETTE.red : g === 'gold' ? PALETTE.gold : PALETTE.cyan;

export const glowKind = (g: GlowTone): 'warm' | 'cool' | 'red' =>
  g === 'red' ? 'red' : g === 'gold' ? 'warm' : 'cool';

export const rayColor = (g: GlowTone): string =>
  g === 'red' ? '#FF7A7A' : g === 'gold' ? '#FFE2B0' : '#8CE8FF';

/** Interpolate between two #RRGGBB hex colours. */
export const mixHex = (a: string, b: string, u: number): string => {
  const k = clamp(u);
  const p = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  const ch = (i: number) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * k).toString(16).padStart(2, '0');
  return `#${ch(1)}${ch(3)}${ch(5)}`;
};

/** Deep-navy backdrop with optional faint schematic grid, sparse stars and tinted slow rays. */
export const SpaceGridBg: React.FC<{
  t: number;
  id: string;
  W: number;
  H: number;
  gTone: GlowTone;
  starsN?: number;
  raysO?: number;
  grid?: boolean;
}> = ({ t, id, W, H, gTone, starsN = 26, raysO = 0.14, grid = true }) => {
  const rx = W * 0.5;
  const ry = H * 0.36;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1={-400} x2="0" y2={H + 400} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#070614" />
          <stop offset="55%" stopColor="#0D1026" />
          <stop offset="100%" stopColor="#141836" />
        </linearGradient>
      </defs>
      <rect x={-1400} y={-1500} width={W + 2800} height={H + 3000} fill={`url(#${id}bg)`} />
      {grid ? (
        <g stroke="#29345E" strokeWidth={1.5} opacity={0.22}>
          {Array.from({ length: 14 }).map((_, i) => {
            const x = -200 + i * ((W + 400) / 13);
            return <line key={`gx${i}`} x1={x} y1={-400} x2={x} y2={H + 400} />;
          })}
          {Array.from({ length: 11 }).map((_, i) => {
            const y = -200 + i * ((H + 400) / 10);
            return <line key={`gy${i}`} x1={-400} y1={y} x2={W + 400} y2={y} />;
          })}
        </g>
      ) : null}
      <Stars seed={41} x0={-900} y0={-900} w={W + 1800} h={H + 1800} t={t} n={starsN} o={0.78} />
      <Glow x={rx} y={ry} r={Math.min(W, H) * 0.52} kind={glowKind(gTone)} o={0.28} />
      <Rays x={rx} y={ry} t={t} o={raysO} color={rayColor(gTone)} len={Math.max(W, H) * 1.4} />
    </g>
  );
};

/** Grounded dark stage floor plane with a glowing pale rim line along the top edge. */
export const StageFloor: React.FC<{ ground: number; W: number; fill?: string; rim?: string; rimOpacity?: number }> = ({
  ground,
  W,
  fill = '#101326',
  rim = '#7A90C4',
  rimOpacity = 0.6,
}) => (
  <g>
    <rect x={-1400} y={ground} width={W + 2800} height={2400} fill={fill} />
    <line x1={-1400} y1={ground} x2={W + 1400} y2={ground} stroke={rim} strokeWidth={3.5} opacity={rimOpacity} />
  </g>
);

/** Blurred dark outer-corner silhouettes for the near layer, kept outside center and text slots. */
export const EdgeSilhouettes: React.FC<{ W: number; H: number; ground: number; t: number; color?: string }> = ({
  W,
  H,
  ground,
  t,
  color = '#070610',
}) => {
  const drift = Math.sin(t * 0.03) * 8;
  return (
    <g>
      <g filter="url(#blur6)" opacity={0.82}>
        <path
          d={`M ${-220 + drift} ${H + 200} L ${-220 + drift} ${ground - 20} L ${W * 0.09 + drift} ${ground + 35} L ${W * 0.14 + drift} ${H + 200} Z`}
          fill={color}
        />
        <path
          d={`M ${W + 220 - drift} ${H + 200} L ${W + 220 - drift} ${ground - 30} L ${W * 0.91 - drift} ${ground + 30} L ${W * 0.86 - drift} ${H + 200} Z`}
          fill={color}
        />
      </g>
      <g opacity={0.35}>
        {Array.from({ length: 8 }).map((_, i) => {
          const left = i % 2 === 0;
          const x = (left ? 0.04 + rnd(81, i) * 0.08 : 0.88 + rnd(82, i) * 0.08) * W;
          const y = ((rnd(83, i) * H + t * (0.4 + rnd(84, i) * 0.5)) % (H + 100)) - 50;
          return <circle key={i} cx={x} cy={y} r={2 + rnd(85, i) * 3} fill={PALETTE.cream} />;
        })}
      </g>
    </g>
  );
};

/** 2001 Mars Odyssey style orbiter icon with gold Kapton bus, grey deck, solar wings and dish. */
export const OrbiterGraphic: React.FC<{
  x: number;
  y: number;
  scale?: number;
  angle?: number;
  t: number;
  gTone?: GlowTone;
  thruster?: number;
  beam?: boolean;
}> = ({ x, y, scale = 1, angle = 0, t, gTone = 'cyan', thruster = 0, beam = false }) => {
  const glint = 0.45 + 0.45 * Math.sin(t * 0.08);
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.22);
  const thrFlicker = 0.7 + 0.3 * Math.sin(t * 0.9);
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      {beam ? (
        <path
          d="M -6 36 L -74 220 L 74 220 L 6 36 Z"
          fill={toneColor(gTone)}
          opacity={0.12 + 0.06 * pulse}
          style={{ mixBlendMode: 'screen' }}
        />
      ) : null}
      {/* Magnetometer boom */}
      <line x1={38} y1={-4} x2={98} y2={-18} stroke="#8D96AD" strokeWidth={4} strokeLinecap="round" />
      <circle cx={100} cy={-19} r={6} fill="#D5DCF0" stroke={OUT} strokeWidth={3} />
      {/* Two large dark-blue solar panel wings */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * 58} 0)`}>
          <rect x={side > 0 ? -24 : -92} y={-22} width={116} height={44} rx={4} fill="#1E305C" stroke={OUT} strokeWidth={4} />
          <line x1={side > 0 ? -22 : -90} y1={0} x2={side > 0 ? 90 : 22} y2={0} stroke="#4C6FA8" strokeWidth={2} />
          {[-1, 0, 1].map((k) => {
            const gx = (side > 0 ? 34 : -34) + k * 28;
            return <line key={k} x1={gx} y1={-20} x2={gx} y2={20} stroke="#4C6FA8" strokeWidth={2} />;
          })}
          <line x1={side > 0 ? -16 : -84} y1={-16} x2={side > 0 ? 84 : 16} y2={-16} stroke="#9CC8FF" strokeWidth={2} opacity={glint * 0.55} />
        </g>
      ))}
      {/* Grey instrument deck + Gold Kapton foil body */}
      <rect x={-38} y={-30} width={76} height={24} rx={5} fill="#6F7890" stroke={OUT} strokeWidth={4} />
      <rect x={-42} y={-10} width={84} height={42} rx={6} fill="#E4A938" stroke={OUT} strokeWidth={4} />
      <line x1={-36} y1={8} x2={36} y2={8} stroke="#B57B1C" strokeWidth={3} />
      {/* High-gain dish on top */}
      <line x1={0} y1={-30} x2={0} y2={-44} stroke="#8D96AD" strokeWidth={5} />
      <path d="M -28 -44 Q 0 -28 28 -44 Q 0 -58 -28 -44 Z" fill="#EAEFF8" stroke={OUT} strokeWidth={3.5} />
      <line x1={0} y1={-44} x2={0} y2={-58} stroke={OUT} strokeWidth={3} />
      <circle cx={0} cy={-60} r={4} fill={toneColor(gTone)} />
      {/* Status beacon */}
      <circle cx={-20} cy={14} r={5} fill={toneColor(gTone)} opacity={0.4 + 0.6 * pulse} />
      {/* Thruster plume when stabilizing/tumbling */}
      {thruster > 0.05 ? (
        <g opacity={thruster * thrFlicker}>
          <path d="M -30 32 L -44 68 L -16 34 Z" fill={PALETTE.orange} stroke={OUT} strokeWidth={2.5} />
          <path d="M 30 32 L 44 68 L 16 34 Z" fill={PALETTE.orange} stroke={OUT} strokeWidth={2.5} />
        </g>
      ) : null}
    </g>
  );
};

/** Outlined reaction wheel around (0, 0). dead=0 spinning, 0<dead<1 faulting/stuttering, dead>=1 darkened with red cross. */
export const ReactionWheelGraphic: React.FC<{
  r?: number;
  spin?: boolean;
  dead?: number;
  t: number;
  label?: string;
}> = ({ r = 64, spin = true, dead = 0, t, label }) => {
  const isDead = dead >= 0.9;
  const isFault = dead > 0.05 && dead < 0.9;
  const angle = isDead ? 18 : isFault ? Math.sin(t * 0.45) * 6 + t * 0.6 : spin ? t * 4.8 : 0;
  const rimCol = isDead ? '#2D2A3D' : isFault ? '#63434E' : '#7E87A1';
  const spokeCol = isDead ? '#1F1D2C' : '#4C546B';
  const hubCol = isDead ? '#5A4A36' : isFault ? PALETTE.orange : PALETTE.gold;
  const pulse = 0.55 + 0.45 * Math.sin(t * 0.25);

  return (
    <g>
      <circle r={r} fill={rimCol} stroke={OUT} strokeWidth={4} />
      <circle r={r * 0.78} fill="#181A2C" stroke={OUT} strokeWidth={3.5} />
      <g transform={`rotate(${angle})`}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1={0}
            y1={0}
            x2={Math.cos((deg * Math.PI) / 180) * r * 0.76}
            y2={Math.sin((deg * Math.PI) / 180) * r * 0.76}
            stroke={spokeCol}
            strokeWidth={8}
            strokeLinecap="round"
          />
        ))}
        {/* Spin marker pip */}
        <circle cx={r * 0.88} cy={0} r={4.5} fill={isDead ? '#48455C' : PALETTE.cyan} />
      </g>
      <circle r={r * 0.24} fill={hubCol} stroke={OUT} strokeWidth={3.5} />
      {spin && !isDead && !isFault ? (
        <path
          d={`M ${-r * 1.12} -14 A ${r * 1.12} ${r * 1.12} 0 0 1 -14 ${-r * 1.12}`}
          fill="none"
          stroke={PALETTE.cyan}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.55 + 0.35 * pulse}
        />
      ) : null}
      {isDead || isFault ? (
        <g opacity={isDead ? 1 : 0.45 + 0.45 * pulse}>
          <line x1={-r * 0.48} y1={-r * 0.48} x2={r * 0.48} y2={r * 0.48} stroke={OUT} strokeWidth={12} strokeLinecap="round" />
          <line x1={r * 0.48} y1={-r * 0.48} x2={-r * 0.48} y2={r * 0.48} stroke={OUT} strokeWidth={12} strokeLinecap="round" />
          <line x1={-r * 0.48} y1={-r * 0.48} x2={r * 0.48} y2={r * 0.48} stroke={PALETTE.red} strokeWidth={6} strokeLinecap="round" />
          <line x1={r * 0.48} y1={-r * 0.48} x2={-r * 0.48} y2={r * 0.48} stroke={PALETTE.red} strokeWidth={6} strokeLinecap="round" />
        </g>
      ) : null}
      {label ? (
        <circle cx={-r * 0.78} cy={-r * 0.78} r={14} fill="#1E1B2E" stroke={OUT} strokeWidth={3} />
      ) : null}
    </g>
  );
};

/** Layered rust Mars globe with rotating albedo patches, craters and pale atmosphere rim. */
export const MarsDisc: React.FC<{ cx: number; cy: number; r: number; rot: number; id: string }> = ({
  cx,
  cy,
  r,
  rot,
  id,
}) => {
  const shift = ((rot % 1) - 0.5) * r * 1.2;
  return (
    <g>
      <defs>
        <clipPath id={`${id}marsClip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <Glow x={cx} y={cy} r={r * 1.7} kind="warm" o={0.28} />
      <circle cx={cx} cy={cy} r={r} fill="#C75838" />
      <g clipPath={`url(#${id}marsClip)`}>
        {/* Darker basalt plains */}
        <ellipse cx={cx - r * 0.22 + shift * 0.4} cy={cy + r * 0.08} rx={r * 0.55} ry={r * 0.34} fill="#933A25" opacity={0.75} />
        <ellipse cx={cx + r * 0.35 + shift * 0.4} cy={cy - r * 0.25} rx={r * 0.38} ry={r * 0.22} fill="#933A25" opacity={0.65} />
        {/* North polar frost cap */}
        <ellipse cx={cx} cy={cy - r * 0.92} rx={r * 0.42} ry={r * 0.16} fill="#F4EDE2" opacity={0.78} />
        {/* Craters */}
        <circle cx={cx - r * 0.3 + shift * 0.25} cy={cy - r * 0.22} r={r * 0.11} fill="#81301F" opacity={0.7} />
        <circle cx={cx + r * 0.15 + shift * 0.25} cy={cy + r * 0.36} r={r * 0.14} fill="#81301F" opacity={0.65} />
        {/* Terminator shadow */}
        <path
          d={`M ${cx + r * 0.15} ${cy - r} A ${r * 0.85} ${r} 0 0 1 ${cx + r * 0.15} ${cy + r} L ${cx + r * 1.2} ${cy + r} L ${cx + r * 1.2} ${cy - r} Z`}
          fill="#2B1016"
          opacity={0.42}
        />
        {/* Warm sunlit crescent rim */}
        <path
          d={`M ${cx - r * 0.2} ${cy - r * 0.96} A ${r} ${r} 0 0 0 ${cx - r * 0.3} ${cy + r * 0.93}`}
          fill="none"
          stroke="#F7B385"
          strokeWidth={5}
          opacity={0.55}
        />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={OUT} strokeWidth={4} />
    </g>
  );
};
