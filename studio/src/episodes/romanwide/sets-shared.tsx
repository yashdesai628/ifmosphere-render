import React from 'react';
import { GroundPlane, PALETTE } from '../../brand';
import { rnd } from '../../engine/anim';
import { Glow, Dust, LightVeil } from '../../engine/light';
import { Stars, Rays, Bokeh } from '../../engine/kit';
import type { Layer } from './render';

export const DARK_LINE = '#12101E';
export const SPACE_RIM = '#7E94CC';

export const num = (r: Record<string, unknown>, k: string, def = 0): number => {
  const v = r[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : def;
};

export const str = (r: Record<string, unknown>, k: string, def = ''): string => {
  const v = r[k];
  return typeof v === 'string' ? v : def;
};

export const bool = (r: Record<string, unknown>, k: string, def = false): boolean => {
  const v = r[k];
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v > 0;
  return def;
};

export type StageLayout = {
  vert: boolean;
  cx: number;
  cy: number;
  s: number;
  unit: number;
  ground: number;
  W: number;
  H: number;
};

/** Responsive focal anchor & scale keeping 16:9 text bands (y<230, y>930) and 9:16 top/UI bands clear. */
export const stageLayout = (W: number, H: number, ground: number): StageLayout => {
  const vert = H > W;
  return {
    vert,
    cx: W * 0.5,
    cy: vert ? H * 0.48 : H * 0.47,
    s: vert ? 0.78 : 1.0,
    unit: Math.min(W, H),
    ground,
    W,
    H,
  };
};

/** Deep-navy cosmic sky covering wide pan/zoom ranges for both 16:9 and 9:16. */
export const DeepSpaceFar: React.FC<{
  id: string;
  W: number;
  H: number;
  t: number;
  seed?: number;
  stars?: number;
  glow?: 'warm' | 'cool' | 'red';
  rayColor?: string;
  rayO?: number;
  glowX?: number;
  glowY?: number;
  nebula?: boolean;
}> = ({
  id,
  W,
  H,
  t,
  seed = 107,
  stars = 120,
  glow = 'cool',
  rayColor = '#9EC4FF',
  rayO = 0.08,
  glowX = W * 0.5,
  glowY = H * 0.42,
  nebula = true,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}bg`} x1="0" y1={-400} x2="0" y2={H + 400} gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#050612" />
        <stop offset="55%" stopColor={PALETTE.space} />
        <stop offset="100%" stopColor="#101836" />
      </linearGradient>
    </defs>
    <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}bg)`} />
    {nebula ? (
      <g opacity={0.22}>
        <ellipse cx={W * 0.35} cy={H * 0.36} rx={580} ry={210} transform={`rotate(-18 ${W * 0.35} ${H * 0.36})`} fill="#1D2B5C" />
        <ellipse cx={W * 0.68} cy={H * 0.54} rx={440} ry={170} transform={`rotate(14 ${W * 0.68} ${H * 0.54})`} fill="#271D52" />
      </g>
    ) : null}
    <Stars seed={seed} x0={-900} y0={-900} w={W + 1800} h={H + 1400} t={t} n={stars} o={0.9} />
    <Glow x={glowX} y={glowY} r={Math.max(W, H) * 0.45} kind={glow} o={0.34} />
    <Rays x={glowX} y={glowY} t={t} len={Math.max(W, H) * 1.15} n={14} o={rayO} color={rayColor} />
  </g>
);

/** Ground deck with pale rim line + subtle pool highlight + light veil + drifting dust. */
export const MidAtmosphere: React.FC<{
  id: string;
  W: number;
  H: number;
  ground: number;
  t: number;
  seed?: number;
  floorFill?: string;
  rim?: string;
  lights: [number, number, number][];
  veilO?: number;
  dustN?: number;
}> = ({
  id,
  W,
  H,
  ground,
  t,
  seed = 41,
  floorFill = '#0B0F22',
  rim = SPACE_RIM,
  lights,
  veilO = 0.38,
  dustN = 36,
}) => (
  <g>
    <GroundPlane y={ground} fill={floorFill} rim={rim} />
    <ellipse cx={W * 0.5} cy={ground + 6} rx={W * 0.36} ry={18} fill={rim} opacity={0.08} />
    <LightVeil id={`${id}veil`} lights={lights} o={veilO} />
    <Dust t={t} seed={seed} x0={-120} y0={80} w={W + 240} h={ground - 60} n={dustN} o={0.5} />
  </g>
);

/** Out-of-focus foreground framing silhouettes & bokeh strictly at outer margins (never over Pip or text slots). */
export const NearEdges: React.FC<{
  W: number;
  H: number;
  t: number;
  seed?: number;
  kind?: 'truss' | 'soft';
}> = ({ W, H, t, seed = 73, kind = 'soft' }) => {
  const drift = Math.sin(t / 35) * 6;
  return (
    <g>
      {kind === 'truss' ? (
        <g fill="#050610" stroke={DARK_LINE} strokeWidth={4} opacity={0.85}>
          <path d={`M -420 ${H + 220} L 110 ${H - 95 + drift} L 175 ${H + 220} Z`} />
          <path d={`M ${W + 420} ${H + 220} L ${W - 110} ${H - 85 - drift} L ${W - 175} ${H + 220} Z`} />
        </g>
      ) : (
        <g fill="#050610" opacity={0.7}>
          <ellipse cx={-60} cy={H - 30 + drift} rx={170} ry={110} />
          <ellipse cx={W + 60} cy={H - 25 - drift} rx={170} ry={110} />
        </g>
      )}
      <Bokeh seed={seed} n={5} x0={-120} y0={H * 0.25} w={190} h={H * 0.6} t={t} o={0.14} />
      <Bokeh seed={seed + 19} n={5} x0={W - 70} y0={H * 0.18} w={180} h={H * 0.45} t={t} o={0.12} />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle
          key={i}
          cx={(i % 2 === 0 ? 48 : W - 48) + Math.sin(t / 28 + i) * 14}
          cy={H * (0.2 + 0.12 * i) + Math.cos(t / 32 + i) * 12}
          r={2 + rnd(seed, i) * 2.5}
          fill="#CFE2FF"
          opacity={0.35 + 0.25 * Math.sin(t / 12 + i)}
        />
      ))}
    </g>
  );
};

export const isLayer = (layer: Layer, target: Layer) => layer === target;
