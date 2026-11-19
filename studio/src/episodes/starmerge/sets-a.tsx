import React from 'react';
import { PALETTE, FONTS, BrandLabel, SpaceBackdrop } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Rays, Stars } from '../../engine/kit';
import type { SetProps } from './render';

const OUTLINE = '#16111F';

/** Full-overscan deep space sky covering both 16:9 and 9:16 camera pans/zooms. */
export const DeepSpaceBg: React.FC<{ t: number; seed: number; stars?: number; starO?: number; rayX?: number; rayY?: number; rayColor?: string; rayO?: number }> = ({
  t, seed, stars = 90, starO = 0.85, rayX, rayY, rayColor = '#FFE2B0', rayO = 0.12,
}) => (
  <g>
    <rect x={-1600} y={-1600} width={5200} height={5200} fill={PALETTE.space} />
    <Stars seed={seed} x0={-1000} y0={-1200} w={3920} h={3400} t={t} n={stars} o={starO} />
    {rayX !== undefined && rayY !== undefined ? <Rays x={rayX} y={rayY} t={t} len={2200} o={rayO} color={rayColor} /> : null}
  </g>
);

/** Subtle Jump-style dark horizon plane at `y = ground` so Pip stands grounded with a shadow. */
export const StageRim: React.FC<{ ground: number; W: number; H: number; fill?: string; rim?: string; o?: number }> = ({
  ground, W, H, fill = '#100D1E', rim = '#D5DCF0', o = 0.42,
}) => (
  <g>
    <rect x={-1600} y={ground} width={W + 3200} height={H + 1800} fill={fill} />
    <line x1={-1600} y1={ground} x2={W + 1600} y2={ground} stroke={rim} strokeWidth={3.5} opacity={o} />
  </g>
);

/** Shared giant convective star disc with drifting darker blotches, 4 px outline and pale rim arc. */
export const GiantStarDisc: React.FC<{
  id: string; cx: number; cy: number; r: number; t: number; cellSpeed?: number;
  coreColor?: string; edgeColor?: string; cellColor?: string; rimColor?: string;
}> = ({
  id, cx, cy, r, t, cellSpeed = 1,
  coreColor = '#FF9C47', edgeColor = '#D63D22', cellColor = '#9E2316', rimColor = '#FFC894',
}) => (
  <g transform={`translate(${cx} ${cy})`}>
    <defs>
      <radialGradient id={`${id}grad`} cx="42%" cy="38%" r="65%">
        <stop offset="0%" stopColor={coreColor} />
        <stop offset="65%" stopColor={edgeColor} />
        <stop offset="100%" stopColor="#9A2416" />
      </radialGradient>
      <clipPath id={`${id}clip`}>
        <circle cx={0} cy={0} r={r} />
      </clipPath>
    </defs>
    <circle cx={0} cy={0} r={r} fill={`url(#${id}grad)`} />
    <g clipPath={`url(#${id}clip)`}>
      {Array.from({ length: 12 }).map((_, i) => {
        const bx = ((rnd(17, i) * 2.2 - 1.1 + t * 0.0022 * cellSpeed * (0.6 + rnd(19, i))) % 2.2 + 2.2) % 2.2 - 1.1;
        const by = (rnd(23, i) * 1.6 - 0.8) + Math.sin(t * 0.035 + i) * 0.08;
        const rx = r * (0.18 + rnd(29, i) * 0.16);
        const ry = rx * (0.55 + rnd(31, i) * 0.3);
        return (
          <g key={i} transform={`translate(${bx * r} ${by * r}) rotate(${rnd(37, i) * 40 - 20})`}>
            <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={cellColor} opacity={0.44} />
            <ellipse cx={-rx * 0.16} cy={-ry * 0.18} rx={rx * 0.45} ry={ry * 0.35} fill={coreColor} opacity={0.28} />
          </g>
        );
      })}
      {/* Limb shadow crescent for spherical volume */}
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0 A ${r * 1.15} ${r * 0.85} 0 0 1 ${-r} 0 Z`} fill="#4D0E12" opacity={0.24} />
    </g>
    <circle cx={0} cy={0} r={r} fill="none" stroke={OUTLINE} strokeWidth={4} />
    <path d={`M ${-r * 0.82} ${-r * 0.46} A ${r * 0.94} ${r * 0.94} 0 0 1 ${r * 0.64} ${-r * 0.70}`} fill="none" stroke={rimColor} strokeWidth={4} strokeLinecap="round" opacity={0.72} />
  </g>
);

/** Edge-framed foreground cosmic wisps for near parallax without cluttering center or text slots. */
export const NearSpaceEdges: React.FC<{ W: number; H: number; ground: number; t: number; tint?: string }> = ({
  W, H, ground, t, tint = '#1D1430',
}) => {
  const drift = Math.sin(t * 0.03) * 18;
  return (
    <g opacity={0.75}>
      <path d={`M -400 ${ground + 45} Q ${W * 0.04} ${ground + 35 + drift * 0.3} ${W * 0.13} ${H + 350} L -400 ${H + 350} Z`} fill={tint} stroke={OUTLINE} strokeWidth={3.5} />
      <path d={`M ${W + 400} ${ground + 50} Q ${W * 0.95} ${ground + 30 - drift * 0.3} ${W * 0.87} ${H + 350} L ${W + 400} ${H + 350} Z`} fill={tint} stroke={OUTLINE} strokeWidth={3.5} />
    </g>
  );
};

// ---------------------------------------------------------------- 1. bigstar
const BIGSTAR_THEMES = {
  red: { core: '#FF8442', edge: '#CF3822', cell: '#8E1E14', rim: '#FFB88C', halo: 'red' as const, haloHex: '#FF4B2B', ray: '#FF8C66' },
  gold: { core: '#FFCB57', edge: '#E36624', cell: '#9E3714', rim: '#FFE69E', halo: 'warm' as const, haloHex: '#FFB443', ray: '#FFD98E' },
  white: { core: '#FFF6E3', edge: '#FFA756', cell: '#C95424', rim: '#FFFFFF', halo: 'warm' as const, haloHex: '#FFF0C8', ray: '#FFF5DC' },
};

export const BigStarSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const minD = Math.min(W, H);
  const st = (sp.t as number | undefined) ?? 0.5;
  const glowKey = ((sp.glow as string | undefined) ?? 'red') as keyof typeof BIGSTAR_THEMES;
  const th = BIGSTAR_THEMES[glowKey] ?? BIGSTAR_THEMES.red;
  const dustAmt = clamp((sp.dust as number | undefined) ?? 0.3);
  const cx = vert ? W * 0.5 : W * 0.44;
  const cy = vert ? H * 0.44 : H * 0.46;
  const pulse = 1 + 0.025 * Math.sin(t * 0.06 + st * 4) + 0.015 * Math.sin(p * Math.PI * 2);
  const r = minD * (vert ? 0.36 : 0.42) * pulse;

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={101} stars={48} starO={0.75} rayX={cx} rayY={cy} rayColor={th.ray} rayO={0.14} />;
  }
  if (layer === 'near') {
    return (
      <g>
        <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#24131E" />
        {dustAmt > 0.2 ? (
          <g opacity={0.55 * dustAmt}>
            <ellipse cx={W * 0.05 + Math.sin(t * 0.02) * 14} cy={H * 0.85} rx={150} ry={44} fill="#3A211C" stroke={OUTLINE} strokeWidth={3.5} />
            <ellipse cx={W * 0.96 - Math.cos(t * 0.02) * 14} cy={H * 0.86} rx={170} ry={48} fill="#3A211C" stroke={OUTLINE} strokeWidth={3.5} />
          </g>
        ) : null}
      </g>
    );
  }
  return (
    <g>
      <Glow x={cx} y={cy} r={r * 2.1} kind={th.halo} o={0.72} />
      <circle cx={cx} cy={cy} r={r * 1.32} fill={th.haloHex} opacity={0.14 + 0.05 * Math.sin(t * 0.05)} />
      {/* Brown dust shells thickening with setp.dust */}
      {dustAmt > 0.05 ? [1.14, 1.28, 1.44].map((mult, i) => (
        <ellipse
          key={i} cx={cx} cy={cy} rx={r * mult} ry={r * mult * 0.82}
          transform={`rotate(${-14 + i * 11 + Math.sin(t * 0.02 + i) * 4} ${cx} ${cy})`}
          fill="none" stroke={i % 2 ? '#7C4B36' : '#573124'} strokeWidth={6 + dustAmt * 22}
          strokeDasharray={`${140 + i * 50} ${75 + i * 35}`} strokeDashoffset={-t * (0.4 + i * 0.2)}
          strokeLinecap="round" opacity={clamp(dustAmt * (0.78 - i * 0.14))}
        />
      )) : null}
      <GiantStarDisc id={id} cx={cx} cy={cy} r={r} t={t + st * 90} cellSpeed={0.8 + st} coreColor={th.core} edgeColor={th.edge} cellColor={th.cell} rimColor={th.rim} />
      {dustAmt > 0.35 ? (
        <g opacity={dustAmt * 0.72}>
          {[0, 1, 2, 3].map((k) => {
            const ang = (k * 1.4 + t * 0.008 + st * 2) % (Math.PI * 2);
            const dx = cx + Math.cos(ang) * r * 1.15;
            const dy = cy + Math.sin(ang) * r * 0.85;
            return <ellipse key={k} cx={dx} cy={dy} rx={48 + k * 14} ry={18 + k * 5} transform={`rotate(${ang * 30} ${dx} ${dy})`} fill="#5D3628" stroke={OUTLINE} strokeWidth={3.5} />;
          })}
        </g>
      ) : null}
      <StageRim ground={ground} W={W} H={H} fill="#140D1C" rim={th.rim} o={0.48} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, r * 2.2]]} o={0.34} />
      <Dust t={t} seed={115} x0={0} y0={80} w={W} h={ground - 60} n={34} o={0.55 + dustAmt * 0.25} />
    </g>
  );
};

// ---------------------------------------------------------------- 2. binary
export const BinarySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const minD = Math.min(W, H);
  const st = (sp.t as number | undefined) ?? 0.5;
  const closeAmt = clamp((sp.close as number | undefined) ?? 0);
  const hasTrail = ((sp.trail as number | undefined) ?? 0) > 0.5;
  const cx = W * 0.5;
  const cy = vert ? H * 0.44 : H * 0.44;
  const rGiant = vert ? W * 0.21 : H * 0.20;

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={202} stars={88} rayX={cx} rayY={cy} rayColor="#FFAA70" rayO={0.11} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#140F26" />;
  }

  const closeEff = clamp(lerp(Math.max(0, closeAmt - 0.12), closeAmt, easeInOut(p)));
  const rx = lerp(minD * (vert ? 0.43 : 0.52), rGiant * 1.18, closeEff);
  const ry = lerp(minD * 0.21, rGiant * 0.68, closeEff);
  const tEff = lerp(st - 0.14, st, easeInOut(p)) + t * 0.0025;
  const ang = tEff * Math.PI * 2;
  const sx = cx + Math.cos(ang) * rx;
  const sy = cy + Math.sin(ang) * ry;
  const trailPts = hasTrail
    ? Array.from({ length: 18 }).map((_, i) => {
        const a = ang - (i / 17) * 1.6;
        const shrink = 1 + (i / 17) * 0.08 * closeEff;
        return `${cx + Math.cos(a) * rx * shrink},${cy + Math.sin(a) * ry * shrink}`;
      }).join(' ')
    : '';
  const smallInFront = Math.sin(ang) >= 0;

  const smallStar = (
    <g>
      {hasTrail ? <polyline points={trailPts} fill="none" stroke={PALETTE.gold} strokeWidth={8} strokeLinecap="round" opacity={0.45} /> : null}
      {hasTrail ? <polyline points={trailPts} fill="none" stroke="#FFF4B8" strokeWidth={3} strokeLinecap="round" opacity={0.8} /> : null}
      <Glow x={sx} y={sy} r={90} kind="warm" o={0.75} />
      <circle cx={sx} cy={sy} r={minD * 0.024} fill="#FFE97D" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={sx - 5} cy={sy - 5} r={minD * 0.008} fill="#FFFFFF" opacity={0.85} />
    </g>
  );

  return (
    <g>
      {/* Orbit ellipse */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={PALETTE.cream} strokeWidth={3} strokeDasharray="12 10" strokeDashoffset={-t * 0.35} opacity={0.48} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={PALETTE.cream} strokeWidth={1.5} opacity={0.28} />
      <Glow x={cx} y={cy} r={rGiant * 2.2} kind="red" o={0.55} />
      {!smallInFront ? smallStar : null}
      <GiantStarDisc id={id} cx={cx} cy={cy} r={rGiant} t={t} />
      {smallInFront ? smallStar : null}
      <StageRim ground={ground} W={W} H={H} fill="#0F0C1E" rim="#D5DCF0" o={0.38} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, rGiant * 2.3], [sx, sy, 220]]} o={0.32} />
      <Dust t={t} seed={211} x0={0} y0={100} w={W} h={ground - 80} n={32} o={0.5} />
    </g>
  );
};

// ---------------------------------------------------------------- 3. inside
export const InsideSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const minD = Math.min(W, H);
  const st = (sp.t as number | undefined) ?? 0.4;
  const heat = clamp((sp.heat as number | undefined) ?? 0.4);
  const drag = clamp((sp.drag as number | undefined) ?? 0.4);
  const cx = W * 0.5;
  const cy = H * 0.44;
  const bgDeep = heat > 0.65 ? '#5E1A12' : '#350F16';
  const cloudMain = heat > 0.65 ? '#F58A32' : '#C7491E';
  const cloudBright = heat > 0.5 ? '#FFD46E' : '#F28B38';

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <radialGradient id={`${id}bg`} cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor={heat > 0.5 ? '#FFBF54' : '#DB6326'} />
            <stop offset="48%" stopColor={cloudMain} />
            <stop offset="100%" stopColor={bgDeep} />
          </radialGradient>
        </defs>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}bg)`} />
        <Rays x={cx} y={cy} t={t * (1 + drag)} len={2000} n={16} o={0.14 + heat * 0.14} color={heat > 0.6 ? '#FFF4C8' : '#FFB464'} />
      </g>
    );
  }
  if (layer === 'near') {
    const sw = Math.sin(t * 0.04) * 22;
    return (
      <g opacity={0.78}>
        <path d={`M -400 ${ground + 30} Q ${W * 0.08} ${ground - 20 + sw} ${W * 0.16} ${H + 350} L -400 ${H + 350} Z`} fill="#4D1712" stroke={OUTLINE} strokeWidth={4} />
        <path d={`M ${W + 400} ${ground + 30} Q ${W * 0.92} ${ground - 25 - sw} ${W * 0.84} ${H + 350} L ${W + 400} ${H + 350} Z`} fill="#4D1712" stroke={OUTLINE} strokeWidth={4} />
      </g>
    );
  }

  const tEff = clamp(lerp(Math.max(0.05, st - 0.16), st, easeInOut(p)));
  const turns = 1.4 + drag * 1.9;
  const maxR = minD * 0.42;
  const starR = lerp(maxR, minD * 0.045, tEff);
  const starAng = tEff * turns * Math.PI * 2 + t * 0.015;
  const sx = cx + Math.cos(starAng) * starR;
  const sy = cy + Math.sin(starAng) * starR * 0.72;
  const spiralPts = Array.from({ length: 44 }).map((_, i) => {
    const f = i / 43;
    const u = lerp(Math.max(0, tEff - 0.45), tEff, f);
    const rr = lerp(maxR, minD * 0.045, u);
    const aa = u * turns * Math.PI * 2 + t * 0.015;
    return `${cx + Math.cos(aa) * rr},${cy + Math.sin(aa) * rr * 0.72}`;
  }).join(' ');

  return (
    <g>
      <Glow x={cx} y={cy} r={minD * 0.48} kind="warm" o={0.55 + heat * 0.35} />
      {/* Swirling soupy gas bands */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const rr = minD * (0.14 + i * 0.075);
        const rot = t * (0.25 + (5 - i) * 0.08) * (1 + drag * 0.5) + i * 62;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            <ellipse cx={0} cy={0} rx={rr * 1.25} ry={rr * 0.88} fill="none" stroke={i % 2 ? cloudBright : '#A33116'} strokeWidth={24 - i * 2} strokeDasharray={`${90 + i * 38} ${65 + i * 24}`} strokeLinecap="round" opacity={0.42 + heat * 0.18} />
            <ellipse cx={0} cy={0} rx={rr * 1.1} ry={rr * 0.76} fill="none" stroke={OUTLINE} strokeWidth={3.5} strokeDasharray={`${70 + i * 28} ${120 + i * 30}`} opacity={0.28} />
          </g>
        );
      })}
      {/* Spiral trail & sinking star */}
      <polyline points={spiralPts} fill="none" stroke={PALETTE.gold} strokeWidth={7} strokeLinecap="round" opacity={0.75} />
      <polyline points={spiralPts} fill="none" stroke="#FFF8D4" strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
      <Glow x={sx} y={sy} r={85} kind="warm" o={0.85} />
      <circle cx={sx} cy={sy} r={minD * 0.022} fill="#FFF2A0" stroke={OUTLINE} strokeWidth={4} />
      {/* Soft luminous plasma cloud shelf at ground */}
      <rect x={-1600} y={ground} width={W + 3200} height={H + 1800} fill="#421412" opacity={0.8} />
      <line x1={-1600} y1={ground} x2={W + 1600} y2={ground} stroke="#FFC378" strokeWidth={3.5} opacity={0.6} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, minD * 0.65], [sx, sy, 200]]} o={0.22} />
      <Dust t={t * 1.5} seed={309} x0={0} y0={60} w={W} h={ground - 40} n={42} o={0.7} />
    </g>
  );
};

// ---------------------------------------------------------------- 4. scale
const PLANETS = [
  { name: 'MERCURY', r: 72, dot: 6, col: '#B2ACBF', ang0: 0.9 },
  { name: 'VENUS', r: 126, dot: 9, col: '#F2C179', ang0: 2.4 },
  { name: 'EARTH', r: 190, dot: 10, col: '#4EB2FF', ang0: 5.5 },
  { name: 'MARS', r: 266, dot: 8, col: '#E86343', ang0: 4.1 },
];

export const ScaleSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const st = (sp.t as number | undefined) ?? 0.8;
  const markEarth = ((sp.mark as number | undefined) ?? 0) > 0.5;
  const zoomAmt = clamp((sp.zoom as number | undefined) ?? 0.5);
  const cx = W * 0.5;
  const cy = vert ? H * 0.44 : H * 0.45;

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={404} stars={95} rayX={cx} rayY={cy} rayColor="#FFA56B" rayO={0.1} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#120F24" />;
  }

  const diagScale = (vert ? 0.92 : 1.05) * lerp(1.22, 0.76, zoomAmt);
  const grow = clamp(lerp(Math.max(0.05, st - 0.35), st, easeOut(p)));
  const rGiant = lerp(16, 330, grow);
  const pulse = (t % 30) / 30;

  return (
    <g>
      <g transform={`translate(${cx} ${cy}) scale(${diagScale})`}>
        {/* Giant translucent red-orange star disc expanding from Sun */}
        <Glow x={0} y={0} r={rGiant * 1.65} kind="red" o={0.55} />
        <circle cx={0} cy={0} r={rGiant} fill="#FF5A2E" opacity={0.38} stroke="#FF925E" strokeWidth={4} />
        <circle cx={0} cy={0} r={rGiant * 0.72} fill="#FF9642" opacity={0.22} />
        <circle cx={0} cy={0} r={rGiant} fill="none" stroke={OUTLINE} strokeWidth={4} opacity={0.7} />

        {/* Inner planet orbits & dots */}
        {PLANETS.map((pl, i) => {
          const ang = pl.ang0 + t * (0.008 - i * 0.0014);
          const px = Math.cos(ang) * pl.r;
          const py = Math.sin(ang) * pl.r;
          const inside = rGiant >= pl.r;
          return (
            <g key={pl.name}>
              <circle cx={0} cy={0} r={pl.r} fill="none" stroke={PALETTE.cream} strokeWidth={2.2} strokeDasharray={inside ? '6 8' : undefined} opacity={inside ? 0.3 : 0.52} />
              <circle cx={px} cy={py} r={pl.dot} fill={pl.col} stroke={OUTLINE} strokeWidth={3.5} />
              {pl.name === 'EARTH' && markEarth ? (
                <g transform={`translate(${px} ${py})`}>
                  <circle cx={0} cy={0} r={18 + pulse * 26} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} opacity={1 - pulse} />
                  <circle cx={0} cy={0} r={20} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} />
                  <BrandLabel x={0} y={-34} t={t} text="EARTH" size={20} color={PALETTE.cyan} />
                </g>
              ) : null}
              {pl.name === 'MARS' ? <BrandLabel x={px} y={py - 22} t={t} text="MARS" size={18} color={PALETTE.orange} /> : null}
            </g>
          );
        })}

        {/* Tiny yellow Sun at center */}
        <Glow x={0} y={0} r={42} kind="warm" o={0.9} />
        <circle cx={0} cy={0} r={11} fill="#FFF08A" stroke={OUTLINE} strokeWidth={3.5} />
      </g>
      <StageRim ground={ground} W={W} H={H} fill="#0F0C1D" rim="#D5DCF0" o={0.38} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, 480]]} o={0.3} />
      <Dust t={t} seed={419} x0={0} y0={90} w={W} h={ground - 70} n={28} o={0.45} />
    </g>
  );
};

// ---------------------------------------------------------------- 5. andromeda
export const AndromedaSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const st = (sp.t as number | undefined) ?? 0.8;
  const boxAmt = clamp((sp.box as number | undefined) ?? 1);
  const dotGlow = ((sp.glow as number | undefined) ?? 1) > 0.5;
  const cx = W * 0.48;
  const cy = vert ? H * 0.43 : H * 0.43;

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={505} stars={130} rayX={cx} rayY={cy} rayColor="#B8D4FF" rayO={0.09} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#0E0B1D" />;
  }

  const push = lerp(Math.max(0, st - 0.16), st, easeInOut(p));
  const zoom = (vert ? 0.72 : 1.0) * (1 + push * 0.28);
  const px = lerp(0, -110, push);
  const py = lerp(0, -45, push);
  // Target star at lower-right outskirts of galaxy
  const dotX = 240;
  const dotY = 92;
  const dotPulse = 1 + 0.35 * Math.sin(t * 0.16);
  const boxDraw = easeOut(clamp(p * 1.5)) * boxAmt;

  return (
    <g>
      <g transform={`translate(${cx + px} ${cy + py}) scale(${zoom})`}>
        {/* Companion fuzzy galaxy M32/M110 */}
        <g transform="translate(-260 -135)">
          <Glow x={0} y={0} r={95} kind="cool" o={0.55} />
          <ellipse cx={0} cy={0} rx={58} ry={34} fill="#8AAFFF" opacity={0.28} transform="rotate(-18)" />
          <ellipse cx={0} cy={0} rx={24} ry={14} fill="#F5F0E1" opacity={0.75} transform="rotate(-18)" />
        </g>

        {/* Tilted spiral galaxy */}
        <g transform={`rotate(-22) scale(1 0.44) rotate(${t * 0.025})`}>
          <ellipse cx={0} cy={0} rx={480} ry={340} fill="#314B8C" opacity={0.26} />
          <ellipse cx={0} cy={0} rx={360} ry={250} fill="#5C86DF" opacity={0.24} />
          {/* Blue-white spiral arms */}
          <path d="M 0 0 C 90 -95 230 -80 330 20 C 400 95 360 220 220 250" fill="none" stroke="#99C2FF" strokeWidth={34} strokeLinecap="round" opacity={0.45} />
          <path d="M 0 0 C -90 95 -230 80 -330 -20 C -400 -95 -360 -220 -220 -250" fill="none" stroke="#99C2FF" strokeWidth={34} strokeLinecap="round" opacity={0.45} />
          <path d="M 0 0 C 120 -60 250 -10 290 120" fill="none" stroke="#E5F1FF" strokeWidth={14} strokeLinecap="round" opacity={0.55} />
          <path d="M 0 0 C -120 60 -250 10 -290 -120" fill="none" stroke="#E5F1FF" strokeWidth={14} strokeLinecap="round" opacity={0.55} />
          {/* Dark brown dust lanes */}
          <path d="M 40 -22 C 155 -75 265 -20 315 80" fill="none" stroke="#361E22" strokeWidth={14} strokeLinecap="round" opacity={0.78} />
          <path d="M -40 22 C -155 75 -265 20 -315 -80" fill="none" stroke="#361E22" strokeWidth={14} strokeLinecap="round" opacity={0.78} />
          <ellipse cx={0} cy={0} rx={125} ry={95} fill="#FFE8BC" opacity={0.62} />
          <ellipse cx={0} cy={0} rx={62} ry={48} fill="#FFF9EB" opacity={0.95} />
        </g>
        <Glow x={0} y={0} r={210} kind="warm" o={0.55} />

        {/* Target star dot & square reticle at lower-right outskirts */}
        <g transform={`translate(${dotX} ${dotY})`}>
          {dotGlow ? <Glow x={0} y={0} r={54 * dotPulse} kind="warm" o={0.85} /> : null}
          <circle cx={0} cy={0} r={dotGlow ? 5 * dotPulse : 4} fill="#FFF8DC" stroke={OUTLINE} strokeWidth={2.5} />
          {boxDraw > 0.02 ? (
            <g>
              <rect
                x={-28} y={-28} width={56} height={56} rx={4} fill="none"
                stroke={PALETTE.cream} strokeWidth={3.5}
                strokeDasharray={224} strokeDashoffset={224 * (1 - boxDraw)}
              />
              <BrandLabel x={0} y={-42} t={t} text="M31 TARGET" size={18} color={PALETTE.cyan} />
            </g>
          ) : null}
        </g>
      </g>
      <StageRim ground={ground} W={W} H={H} fill="#0D0B1B" rim="#D5DCF0" o={0.35} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, 480], [cx + dotX * zoom, cy + dotY * zoom, 180]]} o={0.3} />
      <Dust t={t} seed={518} x0={0} y0={90} w={W} h={ground - 70} n={30} o={0.45} />
    </g>
  );
};

// ---------------------------------------------------------------- 6. curve
const CURVE_PTS: [number, number][] = [
  [0.0, 0.11], [0.08, 0.10], [0.16, 0.12], [0.24, 0.11], [0.30, 0.14],
  [0.40, 0.19], [0.50, 0.25], [0.58, 0.34], [0.62, 0.62], [0.65, 0.94],
  [0.69, 0.72], [0.76, 0.56], [0.85, 0.45], [0.94, 0.38], [1.0, 0.35],
];
const PHASE_META = {
  quiet: { x0: 0.0, x1: 0.28, label: 'QUIET', col: PALETTE.sky },
  rise: { x0: 0.28, x1: 0.58, label: 'SLOW RISE', col: PALETTE.gold },
  spike: { x0: 0.58, x1: 0.71, label: '100x SPIKE', col: PALETTE.red },
  fade: { x0: 0.71, x1: 1.0, label: 'SLOW FADE', col: PALETTE.cyan },
};

export const CurveSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const st = (sp.t as number | undefined) ?? 0.75;
  const phaseKey = ((sp.phase as string | undefined) ?? 'spike') as keyof typeof PHASE_META;
  const phase = PHASE_META[phaseKey] ?? PHASE_META.spike;
  const zoomAmt = clamp((sp.zoom as number | undefined) ?? 0);

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={606} stars={70} rayX={W * 0.5} rayY={H * 0.3} rayColor="#7AE2FF" rayO={0.08} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#120F22" />;
  }

  const pw = vert ? 860 : 1140;
  const ph = vert ? 400 : 470;
  const px = (W - pw) / 2;
  const py = vert ? 620 : 250;
  const drawFrac = clamp(lerp(Math.max(0.08, st - 0.22), st, easeInOut(p)));
  const z = 1 + zoomAmt * 0.55;
  const focusX = pw * 0.64;
  const focusY = ph * 0.35;
  const pts = CURVE_PTS.map(([ux, uy]) => `${ux * pw},${ph - uy * ph}`).join(' ');
  // Find active head point along polyline
  const idx = Math.min(CURVE_PTS.length - 2, Math.floor(drawFrac * (CURVE_PTS.length - 1)));
  const sub = drawFrac * (CURVE_PTS.length - 1) - idx;
  const hx = lerp(CURVE_PTS[idx][0], CURVE_PTS[idx + 1][0], sub) * pw;
  const hy = ph - lerp(CURVE_PTS[idx][1], CURVE_PTS[idx + 1][1], sub) * ph;

  return (
    <g>
      <g transform={`translate(${px} ${py})`}>
        <defs>
          <clipPath id={`${id}panel`}>
            <rect x={0} y={0} width={pw} height={ph} rx={20} />
          </clipPath>
          <clipPath id={`${id}draw`}>
            <rect x={0} y={-20} width={hx + 2} height={ph + 40} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={pw} height={ph} rx={20} fill="#141125" stroke={OUTLINE} strokeWidth={5} />
        <g clipPath={`url(#${id}panel)`}>
          <g transform={`translate(${pw * 0.5} ${ph * 0.5}) scale(${z}) translate(${-lerp(pw * 0.5, focusX, zoomAmt)} ${-lerp(ph * 0.5, focusY, zoomAmt)})`}>
            {/* Subtle grid */}
            {[0.2, 0.4, 0.6, 0.8].map((f) => (
              <g key={f} opacity={0.14}>
                <line x1={0} y1={ph * f} x2={pw} y2={ph * f} stroke={PALETTE.cream} strokeWidth={2} />
                <line x1={pw * f} y1={0} x2={pw * f} y2={ph} stroke={PALETTE.cream} strokeWidth={2} />
              </g>
            ))}
            {/* Highlighted phase band */}
            <rect
              x={phase.x0 * pw} y={0} width={(phase.x1 - phase.x0) * pw} height={ph}
              fill={phase.col} opacity={0.14 + 0.05 * Math.sin(t * 0.14)}
            />
            <line x1={phase.x0 * pw} y1={0} x2={phase.x0 * pw} y2={ph} stroke={phase.col} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.65} />
            <line x1={phase.x1 * pw} y1={0} x2={phase.x1 * pw} y2={ph} stroke={phase.col} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.65} />
            <BrandLabel x={((phase.x0 + phase.x1) / 2) * pw} y={44} t={t} text={phase.label} size={22} color={phase.col} />

            {/* Axes */}
            <polyline points={`44,24 44,${ph - 36} ${pw - 24},${ph - 36}`} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} opacity={0.75} />
            <text x={58} y={42} fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cream} opacity={0.65}>LIGHT</text>
            <text x={pw - 30} y={ph - 12} textAnchor="end" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cream} opacity={0.65}>TIME</text>

            {/* Light curve drawing on left to right */}
            <g clipPath={`url(#${id}draw)`}>
              <polyline points={pts} fill="none" stroke={PALETTE.gold} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" opacity={0.28} />
              <polyline points={pts} fill="none" stroke={PALETTE.gold} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <Glow x={hx} y={hy} r={44} kind="warm" o={0.9} />
            <circle cx={hx} cy={hy} r={8} fill="#FFF7D6" stroke={OUTLINE} strokeWidth={3.5} />
          </g>
        </g>
        <rect x={0} y={0} width={pw} height={ph} rx={20} fill="none" stroke={PALETTE.cream} strokeWidth={2} opacity={0.3} />
      </g>
      <StageRim ground={ground} W={W} H={H} fill="#100D1F" rim="#D5DCF0" o={0.4} />
      <LightVeil id={`${id}veil`} lights={[[px + pw * 0.55, py + ph * 0.45, 560]]} o={0.26} />
      <Dust t={t} seed={622} x0={px} y0={py} w={pw} h={ph} n={24} o={0.4} />
    </g>
  );
};

// ---------------------------------------------------------------- 7. scope
const HEX_OFFSETS: [number, number][] = [
  [0, -2], [1, -1.5], [1, -0.5], [0, 2], [-1, 1.5], [-1, 0.5],
  [0, -1], [1, -0.5], [1, 0.5], [0, 1], [-1, 0.5], [-1, -0.5],
  [2, -1], [2, 0], [2, 1], [-2, -1], [-2, 0], [-2, 1],
];

export const ScopeSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const minD = Math.min(W, H);
  const st = (sp.t as number | undefined) ?? 0.6;
  const lookAmt = clamp((sp.look as number | undefined) ?? 0.8);
  const hasBlink = ((sp.blink as number | undefined) ?? 0) > 0.5;

  if (layer === 'far') {
    return (
      <g>
        <SpaceBackdrop t={t} seed={707} />
        {vert ? <Stars seed={708} x0={-600} y0={850} w={2280} h={1000} t={t} n={75} o={0.85} /> : null}
      </g>
    );
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#0E0D1E" />;
  }

  const driftX = lerp((st - 0.5) * 20, (st - 0.5) * 60, easeInOut(p)) + Math.sin(t * 0.035) * 16;
  const driftY = Math.cos(t * 0.04) * 14;
  const wx = W * 0.48 + driftX;
  const wy = (vert ? H * 0.45 : H * 0.44) + driftY;
  const s = (minD / 1080) * (vert ? 0.92 : 1.04);
  const flashPulse = hasBlink ? Math.pow(Math.max(0, Math.sin(t * 0.24)), 8) : 0;
  const coneW = lerp(90, 380, lookAmt) * (0.94 + 0.06 * Math.sin(t * 0.08));

  return (
    <g>
      <g transform={`translate(${wx} ${wy}) scale(${s}) rotate(${Math.sin(t * 0.03) * 2.5})`}>
        {/* Cyan look cone widening toward upper-left sky */}
        {lookAmt > 0.05 ? (
          <g opacity={0.34 * lookAmt}>
            <defs>
              <linearGradient id={`${id}cone`} x1="0" y1="0" x2="-680" y2="-280" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4EE3FF" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#4EE3FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon points={`-40,-85 -680,${-280 - coneW * 0.5} -680,${-280 + coneW * 0.5}`} fill={`url(#${id}cone)`} />
          </g>
        ) : null}

        {/* 5-layer silver Kapton sunshield */}
        {[4, 3, 2, 1, 0].map((k) => {
          const dy = 72 + k * 15;
          const fill = ['#6F7B99', '#8A96B5', '#A6B4D4', '#C4D0EB', '#E4ECFC'][4 - k];
          return (
            <polygon
              key={k}
              points={`-240,${dy} 0,${dy - 36} 260,${dy + 10} 20,${dy + 54}`}
              fill={fill} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round"
            />
          );
        })}

        {/* Spacecraft bus & antenna */}
        <rect x={-45} y={115} width={90} height={46} rx={8} fill="#363D57" stroke={OUTLINE} strokeWidth={4} />
        <line x1={0} y1={65} x2={0} y2={-80} stroke="#282D42" strokeWidth={14} />

        {/* Gold 18-segment hex mirror */}
        <g transform="translate(-15 -88) rotate(-14)">
          <Glow x={0} y={0} r={190} kind="warm" o={0.55} />
          {HEX_OFFSETS.map(([gx, gy], i) => {
            const hx = gx * 33;
            const hy = gy * 38;
            const glint = 0.8 + 0.2 * Math.sin(t * 0.1 + i * 0.7);
            return (
              <polygon
                key={i}
                points={`${hx - 18},${hy} ${hx - 9},${hy - 16} ${hx + 9},${hy - 16} ${hx + 18},${hy} ${hx + 9},${hy + 16} ${hx - 9},${hy + 16}`}
                fill={i % 3 === 0 ? '#FFD45E' : '#F0AE2C'} opacity={glint} stroke={OUTLINE} strokeWidth={3.5}
              />
            );
          })}
          {/* Central baffle & tripod secondary mirror */}
          <polygon points="-18,0 -9,-16 9,-16 18,0 9,16 -9,16" fill="#1D1A2B" stroke={OUTLINE} strokeWidth={3.5} />
          <path d="M 0 -92 L -115 -14 M -75 72 L -115 -14 M 75 72 L -115 -14" fill="none" stroke="#363D57" strokeWidth={5} strokeLinecap="round" />
          <circle cx={-115} cy={-14} r={14} fill="#FFE082" stroke={OUTLINE} strokeWidth={4} />
          {flashPulse > 0.05 ? (
            <g transform="translate(-115 -14)" opacity={flashPulse}>
              <Glow x={0} y={0} r={140} kind="cool" o={0.95} />
              <path d="M 0 -56 L 9 -9 L 56 0 L 9 9 L 0 56 L -9 9 L -56 0 L -9 -9 Z" fill="#FFFFFF" />
            </g>
          ) : null}
        </g>
      </g>
      <StageRim ground={ground} W={W} H={H} fill="#0F0D1E" rim="#D5DCF0" o={0.38} />
      <LightVeil id={`${id}veil`} lights={[[wx, wy - 40, 480]]} o={0.3} />
      <Dust t={t} seed={727} x0={0} y0={70} w={W} h={ground - 60} n={34} o={0.5} />
    </g>
  );
};
