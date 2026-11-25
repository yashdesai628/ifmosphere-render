import React from 'react';
import { PALETTE } from '../../brand';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Rays, Stars, Foreground } from '../../engine/kit';
import { rnd } from '../../engine/anim';

export type GlowKey = 'gold' | 'cyan' | 'red';

export const INK = '#121019';

export const GLOW_CFG: Record<
  GlowKey,
  { kind: 'warm' | 'cool' | 'red'; ray: string; accent: string; rim: string; sec: string }
> = {
  gold: { kind: 'warm', ray: '#FFE2B0', accent: PALETTE.gold, rim: '#F7C97E', sec: '#FF9B4A' },
  cyan: { kind: 'cool', ray: '#BCEBFF', accent: PALETTE.cyan, rim: '#8AD9F5', sec: '#5FA8FF' },
  red: { kind: 'red', ray: '#FF8A7A', accent: PALETTE.red, rim: '#FF7D75', sec: '#FF453A' },
};

export const glowOf = (v: unknown): GlowKey =>
  v === 'cyan' || v === 'red' || v === 'gold' ? v : 'gold';

export const propColor = (v: unknown): string => {
  if (v === 'red') return PALETTE.red;
  if (v === 'cyan') return PALETTE.cyan;
  if (v === 'green') return PALETTE.green;
  if (v === 'sky') return PALETTE.sky;
  if (v === 'orange') return PALETTE.orange;
  if (v === 'cream') return PALETTE.cream;
  return PALETTE.gold;
};

/** Far depth layer: extended deep-navy sky, twinkling stars, slow nebulae, light rays, and distant horizon ridge. */
export const FarSpaceBackdrop: React.FC<{
  id: string;
  t: number;
  W: number;
  H: number;
  ground: number;
  glow: GlowKey;
  seed?: number;
  stars?: number;
  starOpacity?: number;
  rayOpacity?: number;
  nebula?: boolean;
}> = ({
  id,
  t,
  W,
  H,
  ground,
  glow,
  seed = 107,
  stars = 120,
  starOpacity = 0.85,
  rayOpacity = 0.14,
  nebula = true,
}) => {
  const cfg = GLOW_CFG[glow];
  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.45 : H * 0.42;
  const driftX = Math.sin(t / 55) * 28;
  const driftY = Math.cos(t / 68) * 16;

  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1={-900} x2="0" y2={ground + 300} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#070512" />
          <stop offset="55%" stopColor="#0E122B" />
          <stop offset="100%" stopColor="#181E42" />
        </linearGradient>
      </defs>
      <rect x={-1400} y={-1400} width={W + 2800} height={H + 2800} fill={`url(#${id}sky)`} />
      {nebula ? (
        <g filter="url(#blur10)" opacity={0.22}>
          <ellipse
            cx={cx - W * 0.22 + driftX}
            cy={cy - 90 + driftY}
            rx={W * 0.38}
            ry={H * 0.16}
            fill={glow === 'red' ? '#4C1928' : glow === 'cyan' ? '#133754' : '#2E1F4F'}
          />
          <ellipse
            cx={cx + W * 0.24 - driftX * 0.7}
            cy={cy + 80 - driftY}
            rx={W * 0.34}
            ry={H * 0.14}
            fill={glow === 'cyan' ? '#174259' : '#3C244A'}
          />
        </g>
      ) : null}
      <Stars
        seed={seed}
        x0={-900}
        y0={-1100}
        w={W + 1800}
        h={H + 1900}
        t={t}
        n={stars}
        o={starOpacity}
      />
      <Rays
        x={cx}
        y={cy * 0.75}
        t={t}
        o={rayOpacity}
        color={cfg.ray}
        len={Math.max(W, H) * 1.15}
        n={14}
      />
      {/* Far cosmic ridge silhouette for 0.3x parallax */}
      <path
        d={`M -1400 ${ground + 300} L -1400 ${ground - 28} Q ${W * 0.2} ${ground - 78} ${W * 0.45} ${ground - 36} T ${W * 0.85} ${ground - 66} L ${W + 1400} ${ground - 24} L ${W + 1400} ${ground + 300} Z`}
        fill="#0D1024"
        opacity={0.85}
      />
    </g>
  );
};

/** Mid-layer floor & back horizon plane with pale rim line, floor glow reflection, and edge rocks. */
export const MidStageFloor: React.FC<{
  id: string;
  t: number;
  W: number;
  H: number;
  ground: number;
  glow: GlowKey;
  seed?: number;
  veilLights?: [number, number, number][];
  veilOpacity?: number;
  dustCount?: number;
  showRocks?: boolean;
}> = ({
  id,
  t,
  W,
  H,
  ground,
  glow,
  seed = 211,
  veilLights,
  veilOpacity = 0.34,
  dustCount = 34,
  showRocks = true,
}) => {
  const cfg = GLOW_CFG[glow];
  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.47;
  const lights = veilLights ?? [[cx, cy, Math.min(W, H) * 0.62]];
  const pulse = 0.22 + 0.06 * Math.sin(t / 18);

  return (
    <g>
      {/* Back horizon silhouette ridge (plane 1) */}
      <path
        d={`M -1400 ${ground} L -1400 ${ground - 46} Q ${W * 0.14} ${ground - 88} ${W * 0.34} ${ground - 48} Q ${W * 0.62} ${ground - 18} ${W * 0.84} ${ground - 72} L ${W + 1400} ${ground - 36} L ${W + 1400} ${ground} Z`}
        fill="#16142B"
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* Ground plane (plane 3) */}
      <rect x={-1400} y={ground} width={W + 2800} height={H + 1600} fill="#100D20" />
      {/* Floor reflection pool from centerpiece */}
      <ellipse
        cx={cx}
        cy={ground + 18}
        rx={Math.min(W, H) * 0.34}
        ry={22}
        fill={cfg.accent}
        opacity={pulse}
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Crisp pale rim line */}
      <line
        x1={-1400}
        y1={ground}
        x2={W + 1400}
        y2={ground}
        stroke={cfg.rim}
        strokeWidth={3.5}
        opacity={0.62}
      />
      {/* Subtle astronomical deck lines away from Pip & text slots */}
      <g stroke="#292547" strokeWidth={2.5} opacity={0.55}>
        <line x1={cx - W * 0.38} y1={ground + 1} x2={cx - W * 0.54} y2={ground + 240} />
        <line x1={cx + W * 0.38} y1={ground + 1} x2={cx + W * 0.54} y2={ground + 240} />
      </g>
      {showRocks ? (
        <g>
          {[0.06, 0.94].map((rxFrac, i) => {
            const rx = rxFrac * W;
            const ry = ground + 12;
            const dir = i === 0 ? 1 : -1;
            return (
              <g key={i} transform={`translate(${rx} ${ry})`}>
                <ellipse cx={0} cy={12} rx={36} ry={8} fill="#06040D" opacity={0.55} />
                <polygon
                  points={`${-32 * dir},10 ${-18 * dir},-20 ${10 * dir},-16 ${28 * dir},10`}
                  fill="#221E3A"
                  stroke={INK}
                  strokeWidth={3.5}
                />
                <polygon
                  points={`${-18 * dir},-20 ${10 * dir},-16 ${4 * dir},-4`}
                  fill="#332E54"
                />
              </g>
            );
          })}
        </g>
      ) : null}
      <LightVeil id={`${id}veil`} lights={lights} o={veilOpacity} />
      <Dust
        t={t}
        seed={seed}
        x0={-200}
        y0={80}
        w={W + 400}
        h={ground - 60}
        n={dustCount}
        o={0.5}
      />
    </g>
  );
};

/** Near depth layer (1.3x parallax): blurred edge silhouettes & subtle bokeh strictly at extreme outer margins. */
export const NearFrame: React.FC<{
  t: number;
  W: number;
  H: number;
  ground: number;
  glow: GlowKey;
  seed?: number;
}> = ({ t, W, H, ground, glow, seed = 313 }) => {
  const cfg = GLOW_CFG[glow];
  const vert = H > W;
  const sway = Math.sin(t / 38) * 10;
  const baseY = vert ? ground + 140 : ground + 10;

  return (
    <g>
      <Foreground blur={10}>
        <path
          d={`M -280 ${H + 300} L -280 ${baseY - 120 + sway} Q 35 ${baseY - 70} 58 ${baseY + 80} L 82 ${H + 300} Z`}
          fill="#07050E"
          opacity={0.78}
        />
        <path
          d={`M ${W + 280} ${H + 300} L ${W + 280} ${baseY - 135 - sway} Q ${W - 35} ${baseY - 75} ${W - 58} ${baseY + 85} L ${W - 82} ${H + 300} Z`}
          fill="#07050E"
          opacity={0.78}
        />
      </Foreground>
      {/* Subtle near bokeh specks strictly at outer side edges */}
      <g opacity={0.22} style={{ mixBlendMode: 'screen' }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const left = i % 2 === 0;
          const bx = left ? 20 + rnd(seed, i) * 55 : W - 75 + rnd(seed, i) * 55;
          const by = 220 + rnd(seed + 1, i) * (H - 440) + Math.sin(t / 28 + i) * 18;
          const br = 5 + rnd(seed + 2, i) * 10;
          return <circle key={i} cx={bx} cy={by} r={br} fill={cfg.accent} />;
        })}
      </g>
      <Glow x={W * 0.04} y={baseY - 40} r={120} kind={cfg.kind} o={0.14} />
      <Glow x={W * 0.96} y={baseY - 40} r={120} kind={cfg.kind} o={0.14} />
    </g>
  );
};
