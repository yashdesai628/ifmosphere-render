import React from 'react';
import { GroundPlane, PALETTE } from '../../brand';
import { clamp, easeOut, lerp, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust, Cone } from '../../engine/light';
import { Stars, Rays } from '../../engine/kit';
import type { SetProps } from './render';

const OUTLINE = '#121019';

type TintMode = 'cold' | 'dawn' | 'red';

/** Continuous, non-repeating Leonid meteor shower radiating from (rx, ry). */
export const MeteorStream: React.FC<{
  t: number;
  W: number;
  H: number;
  rate: number;
  seed: number;
  rx?: number;
  ry?: number;
  bright?: number;
}> = ({ t, W, H, rate, seed, rx = 0.5 * W, ry = 0.12 * H, bright = 1 }) => {
  if (rate <= 0.001) return null;
  const count = rate <= 0.06 ? 1 : Math.round(clamp(rate) * 55);
  const k = Math.min(W, H) / 1080;
  const maxSpan = Math.max(W, H) * 0.72;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const dur = 24 + rnd(seed + 11, i) * 32;
        const phase = rnd(seed + 23, i) * 600;
        const total = t + phase;
        const cycle = Math.floor(total / dur);
        const age = total % dur;
        const u = age / dur;

        // Rare-rate mode keeps a brief pause between streaks so rate=0.05 feels sparse.
        const activeCap = rate <= 0.06 ? 0.55 : 0.92;
        if (u > activeCap) return null;
        const prog = u / activeCap;
        const sSeed = seed + i * 37 + cycle * 193;

        const angle = rnd(sSeed + 1, i) * Math.PI * 2;
        const rStart = (70 + rnd(sSeed + 2, i) * 210) * k;
        const travel = (190 + rnd(sSeed + 3, i) * 380) * k;
        const baseLen = (40 + rnd(sSeed + 4, i) * 100) * k;

        const move = easeOut(clamp(prog / 0.72));
        const fade = prog < 0.12 ? prog / 0.12 : prog > 0.68 ? 1 - (prog - 0.68) / 0.32 : 1;
        const alpha = clamp(fade) * bright * (0.65 + 0.35 * rnd(sSeed + 5, i));

        const headR = rStart + travel * move;
        const tailR = Math.max(rStart * 0.6, headR - baseLen * (0.45 + 0.55 * (1 - prog * 0.35)));
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const x1 = rx + dx * tailR;
        const y1 = ry + dy * tailR;
        const x2 = rx + dx * headR;
        const y2 = ry + dy * headR;
        if (Math.hypot(x2 - rx, y2 - ry) > maxSpan * 1.4) return null;

        const isGold = rnd(sSeed + 6, i) > 0.42;
        const isCyan = !isGold && rnd(sSeed + 7, i) > 0.72;
        const coreCol = isCyan ? '#B8F3FF' : isGold ? '#FFE08A' : PALETTE.cream;
        const glowCol = isCyan ? '#42C6FF' : '#FFB84D';

        return (
          <g key={`${i}-${cycle}`} opacity={alpha}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={glowCol} strokeWidth={6.5 * k} strokeLinecap="round" opacity={0.28} />
            <line x1={lerp(x1, x2, 0.25)} y1={lerp(y1, y2, 0.25)} x2={x2} y2={y2} stroke={coreCol} strokeWidth={2.6 * k} strokeLinecap="round" />
            <circle cx={x2} cy={y2} r={14 * k} fill="url(#g3warm)" opacity={0.48} style={{ mixBlendMode: 'screen' }} />
            <circle cx={x2} cy={y2} r={3.2 * k} fill="#FFFFFF" />
          </g>
        );
      })}
    </g>
  );
};

/** Backwards-question-mark Leo Sickle constellation near the radiant. */
export const LeoSickle: React.FC<{ t: number; W: number; H: number; x?: number; y?: number; scale?: number }> = ({
  t,
  W,
  H,
  x = 0.5 * W,
  y = 0.14 * H,
  scale = Math.min(W, H) / 1080,
}) => {
  // Backwards '?' shape: Regulus at bottom, curving up and left-then-right
  const pts: [number, number, number][] = [
    [-18, 92, 5.2], // Regulus (brightest)
    [-26, 46, 3.4], // Eta Leonis
    [-16, -2, 4.4], // Algieba
    [16, -34, 3.6], // Adhafera
    [44, -22, 3.3], // Ras Elased Borealis
    [36, 10, 3.1], // Algenubi
  ];
  const d = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px} ${py}`).join(' ');
  const pulse = 0.72 + 0.28 * Math.sin(t / 14);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={d} fill="none" stroke="#99B8FF" strokeWidth={2} strokeDasharray="5 7" opacity={0.34 * pulse} />
      {pts.map(([px, py, r], i) => {
        const tw = 0.78 + 0.22 * Math.sin(t / 9 + i * 1.3);
        return (
          <g key={i} transform={`translate(${px} ${py})`}>
            <circle r={r * 4.5} fill="url(#g3cool)" opacity={0.4 * tw} style={{ mixBlendMode: 'screen' }} />
            <circle r={r} fill={i === 0 ? '#DCEBFF' : PALETTE.cream} opacity={tw} />
          </g>
        );
      })}
    </g>
  );
};

/** Deep cosmos backdrop extending generously beyond frame for both 16:9 and 9:16 + pans/zooms. */
export const WideNightSky: React.FC<{
  id: string;
  t: number;
  W: number;
  H: number;
  ground: number;
  tint?: TintMode;
  seed?: number;
  starCount?: number;
  milkyWay?: boolean;
}> = ({ id, t, W, H, ground, tint = 'cold', seed = 103, starCount = 150, milkyWay = true }) => {
  const topCol = tint === 'red' ? '#170718' : tint === 'dawn' ? '#0C0A1E' : '#080614';
  const midCol = tint === 'red' ? '#360F24' : tint === 'dawn' ? '#23173A' : '#10142D';
  const botCol = tint === 'red' ? '#6B1C2E' : tint === 'dawn' ? '#A64B30' : '#192244';
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1={-H * 0.4} x2="0" y2={ground + 60} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={topCol} />
          <stop offset="68%" stopColor={midCol} />
          <stop offset="100%" stopColor={botCol} />
        </linearGradient>
      </defs>
      <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}sky)`} />
      {milkyWay ? (
        <g transform={`translate(${W * 0.5} ${H * 0.34}) rotate(-26)`} opacity={tint === 'dawn' ? 0.18 : 0.26}>
          <ellipse cx={0} cy={0} rx={W * 0.95} ry={Math.min(W, H) * 0.16} fill="#36447D" filter="url(#blur18)" />
          <ellipse cx={60} cy={12} rx={W * 0.72} ry={Math.min(W, H) * 0.08} fill="#6F86C8" opacity={0.45} filter="url(#blur10)" />
        </g>
      ) : null}
      <Stars seed={seed} x0={-1000} y0={-1000} w={W + 2000} h={ground + 1100} t={t} n={starCount} o={0.92} />
      {tint === 'dawn' ? (
        <g>
          <Rays x={W * 0.5} y={ground + 120} t={t} len={1700} n={12} o={0.09} color="#FF9E5E" />
          <Glow x={W * 0.5} y={ground + 40} r={Math.max(W, H) * 0.45} kind="warm" o={0.32} />
        </g>
      ) : null}
      {tint === 'red' ? <Glow x={W * 0.5} y={ground} r={Math.max(W, H) * 0.42} kind="red" o={0.28} /> : null}
    </g>
  );
};

/** Two layered hill ridge planes for hill/summit sets. */
const HillRidges: React.FC<{
  W: number;
  ground: number;
  farFill: string;
  nearFill: string;
  rimCol: string;
}> = ({ W, ground, farFill, nearFill, rimCol }) => {
  const s = W / 1920;
  const farD = `M -1400 ${ground + 20} L -1400 ${ground - 130} L ${-420 * s} ${ground - 185} L ${180 * s} ${ground - 125} L ${640 * s} ${ground - 165} L ${1180 * s} ${ground - 105} L ${1660 * s} ${ground - 190} L ${2380 * s} ${ground - 135} L ${W + 1400} ${ground - 140} L ${W + 1400} ${ground + 20} Z`;
  const farRim = `M -1400 ${ground - 130} L ${-420 * s} ${ground - 185} L ${180 * s} ${ground - 125} L ${640 * s} ${ground - 165} L ${1180 * s} ${ground - 105} L ${1660 * s} ${ground - 190} L ${2380 * s} ${ground - 135} L ${W + 1400} ${ground - 140}`;
  const nearD = `M -1400 ${ground + 20} L -1400 ${ground - 65} Q ${140 * s} ${ground - 105} ${520 * s} ${ground - 52} Q ${1040 * s} ${ground - 15} ${1480 * s} ${ground - 78} Q ${1920 * s} ${ground - 115} ${W + 1400} ${ground - 68} L ${W + 1400} ${ground + 20} Z`;
  const nearRim = `M -1400 ${ground - 65} Q ${140 * s} ${ground - 105} ${520 * s} ${ground - 52} Q ${1040 * s} ${ground - 15} ${1480 * s} ${ground - 78} Q ${1920 * s} ${ground - 115} ${W + 1400} ${ground - 68}`;
  return (
    <g>
      <path d={farD} fill={farFill} stroke={OUTLINE} strokeWidth={3.5} />
      <path d={farRim} fill="none" stroke={rimCol} strokeWidth={3} opacity={0.42} />
      <path d={nearD} fill={nearFill} stroke={OUTLINE} strokeWidth={4} />
      <path d={nearRim} fill="none" stroke={rimCol} strokeWidth={3.5} opacity={0.62} />
    </g>
  );
};

const OutlinedRock: React.FC<{ x: number; y: number; scale?: number; fill?: string; rim?: string }> = ({
  x,
  y,
  scale = 1,
  fill = '#2E2945',
  rim = '#9FB2DF',
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={3} cy={8} rx={44} ry={10} fill="#000" opacity={0.42} />
    <polygon points="-42,8 -28,-22 4,-28 34,-12 42,8" fill={fill} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -28 -22 L 4 -28 L 34 -12" fill="none" stroke={rim} strokeWidth={3} opacity={0.6} strokeLinecap="round" />
  </g>
);

const SwayingTufts: React.FC<{ t: number; xs: number[]; y: number; fill: string }> = ({ t, xs, y, fill }) => (
  <g>
    {xs.map((x, i) => {
      const sway = Math.sin(t / 13 + i * 1.4) * 5;
      return (
        <path
          key={i}
          d={`M ${x - 8} ${y + 2} Q ${x - 10 + sway * 0.6} ${y - 18} ${x - 14 + sway} ${y - 26} M ${x} ${y + 2} Q ${x + sway * 0.8} ${y - 22} ${x + 2 + sway} ${y - 34} M ${x + 8} ${y + 2} Q ${x + 12 + sway * 0.7} ${y - 16} ${x + 15 + sway} ${y - 24}`}
          fill="none"
          stroke={fill}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

export const HillSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const rate = Number(sp.rate ?? 0);
  const tint = (sp.tint as TintMode | undefined) ?? 'cold';
  const sickle = Number(sp.sickle ?? 0) > 0;
  const rimCol = tint === 'dawn' ? '#F5A872' : tint === 'red' ? '#E87386' : '#A9BCE8';
  const gFill = tint === 'dawn' ? '#2A1D2D' : tint === 'red' ? '#241425' : '#23203A';
  const k = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <WideNightSky id={id} t={t} W={W} H={H} ground={ground} tint={tint} seed={109} starCount={165} />
        {sickle ? <LeoSickle t={t} W={W} H={H} x={0.5 * W} y={0.14 * H} /> : null}
        <MeteorStream t={t} W={W} H={H} rate={rate} seed={311} />
      </g>
    );
  }

  if (layer === 'mid') {
    const tuftXs = [0.08, 0.18, 0.29, 0.72, 0.84, 0.93].map((f) => f * W);
    return (
      <g>
        <HillRidges
          W={W}
          ground={ground}
          farFill={tint === 'dawn' ? '#221528' : '#151326'}
          nearFill={tint === 'dawn' ? '#2B1B30' : '#1C1932'}
          rimCol={rimCol}
        />
        <GroundPlane y={ground} fill={gFill} rim={rimCol} />
        <SwayingTufts t={t} xs={tuftXs} y={ground} fill={tint === 'dawn' ? '#51374F' : '#3A355C'} />
        <OutlinedRock x={0.11 * W} y={ground + 22 * k} scale={1.05 * k} fill={gFill} rim={rimCol} />
        <OutlinedRock x={0.89 * W} y={ground + 16 * k} scale={0.9 * k} fill={gFill} rim={rimCol} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [0.5 * W, ground - 190 * k, 580 * k],
            [0.5 * W, 0.22 * H, 500 * k],
          ]}
          o={0.34}
        />
        <Dust t={t} seed={401} x0={-100} y0={ground - 460 * k} w={W + 200} h={520 * k} n={34} o={0.45} />
      </g>
    );
  }

  // near: foreground grass silhouettes tucked at bottom edges only
  return (
    <g>
      <path
        d={`M -400 ${H + 300} L -400 ${ground + 38} Q ${0.04 * W} ${ground + 18} ${0.11 * W} ${ground + 80} L ${0.16 * W} ${H + 300} Z`}
        fill="#0B0916"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      <path
        d={`M ${W + 400} ${H + 300} L ${W + 400} ${ground + 35} Q ${0.95 * W} ${ground + 15} ${0.88 * W} ${ground + 78} L ${0.84 * W} ${H + 300} Z`}
        fill="#0B0916"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      <SwayingTufts t={t + 15} xs={[0.04 * W, 0.09 * W, 0.91 * W, 0.96 * W]} y={ground + 45} fill="#0B0916" />
    </g>
  );
};

export const SummitSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const rate = Number(sp.rate ?? 0.5);
  const tint = (sp.tint as TintMode | undefined) ?? 'cold';
  const rimCol = tint === 'dawn' ? '#F5A872' : '#B2C3EB';
  const k = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <WideNightSky id={id} t={t} W={W} H={H} ground={ground} tint={tint} seed={207} starCount={165} />
        <MeteorStream t={t} W={W} H={H} rate={rate} seed={509} />
      </g>
    );
  }

  if (layer === 'mid') {
    const domeX = (H > W ? 0.18 : 0.17) * W;
    const domeY = ground - 16 * k;
    const beaconPulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t / 7));
    const roadStart = 0.64 * W;
    return (
      <g>
        <HillRidges
          W={W}
          ground={ground}
          farFill={tint === 'dawn' ? '#24172A' : '#161428'}
          nearFill={tint === 'dawn' ? '#301F34' : '#211E38'}
          rimCol={rimCol}
        />
        {/* Winding dirt access road across mid-right terrain */}
        <path
          d={`M ${W + 500} ${ground + 42} Q ${roadStart + 260 * k} ${ground + 18} ${roadStart + 60 * k} ${ground - 4} Q ${roadStart - 90 * k} ${ground - 22} ${roadStart + 35 * k} ${ground - 46}`}
          fill="none"
          stroke="#3E3654"
          strokeWidth={28 * k}
          strokeLinecap="round"
          opacity={0.7}
        />
        <GroundPlane y={ground} fill={tint === 'dawn' ? '#2D2133' : '#26233E'} rim={rimCol} />

        {/* Mountain observatory dome on the left terrace */}
        <g transform={`translate(${domeX} ${domeY}) scale(${k})`}>
          <ellipse cx={0} cy={14} rx={125} ry={16} fill="#000" opacity={0.45} />
          {/* Dome base drum */}
          <rect x={-102} y={-95} width={204} height={106} rx={8} fill="#2B2742" stroke={OUTLINE} strokeWidth={4} />
          <line x1={-102} y1={-95} x2={102} y2={-95} stroke={rimCol} strokeWidth={3} opacity={0.5} />
          {/* Hemisphere dome */}
          <path d="M -98 -95 A 98 96 0 0 1 98 -95 Z" fill="#353152" stroke={OUTLINE} strokeWidth={4} />
          <path d="M -88 -108 A 90 88 0 0 1 62 -174" fill="none" stroke={rimCol} strokeWidth={3.5} opacity={0.68} strokeLinecap="round" />
          {/* Open shutter slit on the dome + telescope tube peering out */}
          <path d="M -38 -95 L -16 -184 L 22 -184 L 4 -95 Z" fill="#100E1E" stroke={OUTLINE} strokeWidth={3.5} />
          <g transform="translate(-4 -146) rotate(-52)">
            <rect x={-12} y={-52} width={24} height={64} rx={4} fill="#4E486E" stroke={OUTLINE} strokeWidth={3.5} />
            <rect x={-15} y={-56} width={30} height={10} rx={3} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3} />
            <line x1={-8} y1={-56} x2={8} y2={-56} stroke="#B8F3FF" strokeWidth={3} opacity={0.8} />
          </g>
          {/* Small lit control-room window with warm Glow */}
          <Glow x={44} y={-44} r={115} kind="warm" o={0.62} />
          <rect x={24} y={-62} width={40} height={32} rx={4} fill="#FFE196" stroke={OUTLINE} strokeWidth={3.5} />
          <line x1={44} y1={-62} x2={44} y2={-30} stroke={OUTLINE} strokeWidth={2.5} />
          <Cone d="M 24 -30 L 64 -30 L 124 44 L -16 44 Z" o={0.18} />
          {/* Red aircraft warning beacon */}
          <Glow x={0} y={-196} r={42} kind="red" o={0.7 * beaconPulse} />
          <circle cx={0} cy={-196} r={5} fill="#FF5A4A" stroke={OUTLINE} strokeWidth={2.5} opacity={0.6 + 0.4 * beaconPulse} />
        </g>

        <OutlinedRock x={0.88 * W} y={ground + 20 * k} scale={1.1 * k} fill="#2B2742" rim={rimCol} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [domeX + 44 * k, domeY - 44 * k, 320 * k],
            [0.5 * W, ground - 160 * k, 560 * k],
          ]}
          o={0.34}
        />
        <Dust t={t} seed={521} x0={-100} y0={ground - 420 * k} w={W + 200} h={460 * k} n={38} o={0.48} />
      </g>
    );
  }

  // near: roadside reflector post & rocky edge silhouettes
  return (
    <g>
      <path
        d={`M -400 ${H + 300} L -400 ${ground + 34} Q ${0.06 * W} ${ground + 22} ${0.14 * W} ${ground + 90} L ${0.2 * W} ${H + 300} Z`}
        fill="#0B0916"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      <g transform={`translate(${0.92 * W} ${ground + 45}) scale(${k})`}>
        <rect x={-7} y={-55} width={14} height={260} fill="#0D0B18" stroke={OUTLINE} strokeWidth={3.5} />
        <rect x={-5} y={-44} width={10} height={14} rx={2} fill={PALETTE.orange} opacity={0.75} />
      </g>
    </g>
  );
};

export const Town1833Set: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const rate = Number(sp.rate ?? 0.6);
  const k = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <WideNightSky id={id} t={t} W={W} H={H} ground={ground} tint="cold" seed={331} starCount={170} />
        <MeteorStream t={t} W={W} H={H} rate={rate} seed={1833} bright={1.15} />
      </g>
    );
  }

  if (layer === 'mid') {
    const s = W / 1920;
    const flicker = (i: number) => 0.8 + 0.2 * Math.sin(t / 4.2 + i * 2.1);
    const smokeDrift = (i: number) => Math.sin(t / 15 + i * 1.7) * 9;
    const lampX = 0.86 * W;
    const lampFlick = 0.85 + 0.15 * Math.sin(t / 3.5);

    const houses = [
      { x: 0.08 * W, w: 150 * k, h: 118 * k, roof: 68 * k, win: true },
      { x: 0.21 * W, w: 132 * k, h: 98 * k, roof: 56 * k, win: true },
      { x: 0.34 * W, w: 120 * k, h: 88 * k, roof: 50 * k, win: false },
      { x: 0.66 * W, w: 126 * k, h: 92 * k, roof: 52 * k, win: false },
      { x: 0.78 * W, w: 145 * k, h: 112 * k, roof: 62 * k, win: true },
    ];

    return (
      <g>
        {/* Distant tree silhouette ridge */}
        <path
          d={`M -1400 ${ground + 10} L -1400 ${ground - 90} Q ${200 * s} ${ground - 135} ${650 * s} ${ground - 95} Q ${1200 * s} ${ground - 130} ${1750 * s} ${ground - 95} L ${W + 1400} ${ground - 105} L ${W + 1400} ${ground + 10} Z`}
          fill="#111022"
        />

        {/* 1833 Church steeple on left-back */}
        <g transform={`translate(${0.15 * W} ${ground}) scale(${k})`}>
          <rect x={-48} y={-145} width={96} height={145} fill="#1E1B32" stroke={OUTLINE} strokeWidth={4} />
          <polygon points="-56,-145 0,-212 56,-145" fill="#25223D" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          <rect x={-22} y={-255} width={44} height={58} fill="#25223D" stroke={OUTLINE} strokeWidth={3.5} />
          <polygon points="-26,-255 0,-360 26,-255" fill="#2F2B4C" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          <path d="M -26 -255 L 0 -360 L 26 -255" fill="none" stroke="#B7C6EA" strokeWidth={2.5} opacity={0.65} />
          <line x1={0} y1={-360} x2={0} y2={-382} stroke={PALETTE.gold} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={-8} y1={-372} x2={8} y2={-372} stroke={PALETTE.gold} strokeWidth={3} strokeLinecap="round" />
        </g>

        {/* Row of dark New England gable rooftops, chimneys, smoke & three lit candle windows */}
        {houses.map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${ground})`}>
            {/* Chimney + curling smoke */}
            <rect x={h.w * 0.2} y={-h.h - h.roof * 0.85} width={22 * k} height={38 * k} fill="#1D1A2F" stroke={OUTLINE} strokeWidth={3.5} />
            <path
              d={`M ${h.w * 0.2 + 11 * k} ${-h.h - h.roof * 0.85 - 4} Q ${h.w * 0.2 + 11 * k + smokeDrift(i)} ${-h.h - h.roof - 28 * k} ${h.w * 0.2 + 18 * k - smokeDrift(i) * 0.6} ${-h.h - h.roof - 56 * k}`}
              fill="none"
              stroke="#7A86A8"
              strokeWidth={6 * k}
              strokeLinecap="round"
              opacity={0.22}
            />
            <rect x={-h.w / 2} y={-h.h} width={h.w} height={h.h} fill="#1B182E" stroke={OUTLINE} strokeWidth={4} />
            <polygon
              points={`${-h.w / 2 - 10 * k},${-h.h} 0,${-h.h - h.roof} ${h.w / 2 + 10 * k},${-h.h}`}
              fill="#26223D"
              stroke={OUTLINE}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <path
              d={`M ${-h.w / 2 - 10 * k} ${-h.h} L 0 ${-h.h - h.roof} L ${h.w / 2 + 10 * k} ${-h.h}`}
              fill="none"
              stroke="#A9BCE8"
              strokeWidth={2.5}
              opacity={0.52}
            />
            {h.win ? (
              <g>
                <Glow x={0} y={-h.h * 0.52} r={85 * k} kind="warm" o={0.58 * flicker(i)} />
                <rect x={-16 * k} y={-h.h * 0.68} width={32 * k} height={36 * k} rx={3} fill="#FFE094" stroke={OUTLINE} strokeWidth={3.5} opacity={flicker(i)} />
                <line x1={0} y1={-h.h * 0.68} x2={0} y2={-h.h * 0.68 + 36 * k} stroke={OUTLINE} strokeWidth={2} />
                <line x1={-16 * k} y1={-h.h * 0.68 + 18 * k} x2={16 * k} y2={-h.h * 0.68 + 18 * k} stroke={OUTLINE} strokeWidth={2} />
              </g>
            ) : null}
          </g>
        ))}

        {/* Cobbled street ground */}
        <GroundPlane y={ground} fill="#231F36" rim="#9FB2DF" />
        <g opacity={0.55}>
          {Array.from({ length: 22 }).map((_, i) => {
            const cx = -300 + i * 115 * k + (i % 2) * 32 * k;
            const cy = ground + 24 * k + (i % 3) * 26 * k;
            return <rect key={i} x={cx} y={cy} width={48 * k} height={16 * k} rx={7 * k} fill="#312C4A" stroke={OUTLINE} strokeWidth={3} />;
          })}
        </g>

        {/* Wrought-iron lantern post with warm bloom */}
        <g transform={`translate(${lampX} ${ground}) scale(${k})`}>
          <ellipse cx={0} cy={6} rx={34} ry={8} fill="#000" opacity={0.45} />
          <path d="M -10 4 L -7 -240 L 7 -240 L 10 4 Z" fill="#1C192B" stroke={OUTLINE} strokeWidth={4} />
          <polygon points="-20,-240 20,-240 26,-282 -26,-282" fill="#FFE094" stroke={OUTLINE} strokeWidth={4} opacity={lampFlick} />
          <polygon points="-32,-282 0,-306 32,-282" fill="#1C192B" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          <Cone d="M -24 -240 L 24 -240 L 130 16 L -130 16 Z" o={0.22 * lampFlick} />
          <Glow x={0} y={-260} r={190} kind="warm" o={0.72 * lampFlick} />
        </g>

        <LightVeil
          id={`${id}veil`}
          lights={[
            [lampX, ground - 240 * k, 420 * k],
            [0.5 * W, ground - 160 * k, 520 * k],
          ]}
          o={0.4}
        />
        <Dust t={t} seed={601} x0={-100} y0={ground - 400 * k} w={W + 200} h={420 * k} n={34} o={0.5} />
      </g>
    );
  }

  // near: shadowy corner picket post & overhanging timber edge
  return (
    <g>
      <path
        d={`M -400 ${H + 300} L -400 ${ground + 24} L ${0.08 * W} ${ground + 24} L ${0.1 * W} ${H + 300} Z`}
        fill="#0A0814"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      <rect x={0.93 * W} y={ground + 20} width={160} height={600} fill="#0A0814" stroke={OUTLINE} strokeWidth={4} />
    </g>
  );
};

export const GardenSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const rate = Number(sp.rate ?? 0.05);
  const isDawn = (sp.tint as string | undefined) === 'dawn';
  const sickle = Number(sp.sickle ?? 0) > 0;
  const frost = Number(sp.frost ?? 0) > 0;
  const k = Math.min(W, H) / 1080;
  const rimCol = isDawn ? '#FFBA7A' : '#CFE2FF';

  if (layer === 'far') {
    const planetX = (H > W ? 0.25 : 0.34) * W;
    const planetY = (H > W ? 0.24 : 0.26) * H;
    const pulse = 0.85 + 0.15 * Math.sin(t / 10);
    return (
      <g>
        <WideNightSky id={id} t={t} W={W} H={H} ground={ground} tint={isDawn ? 'dawn' : 'cold'} seed={709} starCount={120} milkyWay={false} />
        {/* Thin pre-dawn orange horizon band even in default garden */}
        {!isDawn ? (
          <rect x={-1600} y={ground - 135 * k} width={W + 3200} height={150 * k} fill="#B85535" opacity={0.28} filter="url(#blur18)" />
        ) : null}
        {sickle ? <LeoSickle t={t} W={W} H={H} x={0.5 * W} y={0.14 * H} /> : null}
        {/* Mars (small red disc) and Jupiter (gold disc) side by side with bloom */}
        <g transform={`translate(${planetX} ${planetY}) scale(${k})`}>
          <Glow x={-32} y={8} r={42} kind="red" o={0.52 * pulse} />
          <circle cx={-32} cy={8} r={7.5} fill="#FF5F4D" stroke={OUTLINE} strokeWidth={2.5} />
          <Glow x={26} y={-4} r={62} kind="warm" o={0.62 * pulse} />
          <circle cx={26} cy={-4} r={11.5} fill="#FFE08C" stroke={OUTLINE} strokeWidth={2.5} />
        </g>
        <MeteorStream t={t} W={W} H={H} rate={rate} seed={2026} />
      </g>
    );
  }

  if (layer === 'mid') {
    const sway = Math.sin(t / 14) * 5;
    const houseW = 240 * k;
    return (
      <g>
        {/* Back suburban house roof edge & chimney on left */}
        <g transform={`translate(${0.07 * W} ${ground})`}>
          <rect x={-180 * k} y={-230 * k} width={houseW + 140 * k} height={240 * k} fill="#181629" stroke={OUTLINE} strokeWidth={4} />
          <polygon
            points={`${-200 * k},${-230 * k} ${-40 * k},${-325 * k} ${houseW * 0.72},${-230 * k}`}
            fill="#221F38"
            stroke={OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <line x1={-40 * k} y1={-325 * k} x2={houseW * 0.72} y2={-230 * k} stroke={rimCol} strokeWidth={3} opacity={0.55} />
          <rect x={22 * k} y={-165 * k} width={38 * k} height={44 * k} rx={4} fill="#FFCA76" stroke={OUTLINE} strokeWidth={3.5} opacity={0.78} />
          <Glow x={41 * k} y={-143 * k} r={80 * k} kind="warm" o={0.42} />
        </g>

        {/* Wooden back garden fence line */}
        <g>
          <rect x={-1400} y={ground - 96 * k} width={W + 2800} height={106 * k} fill="#231F36" stroke={OUTLINE} strokeWidth={4} />
          <line x1={-1400} y1={ground - 96 * k} x2={W + 1400} y2={ground - 96 * k} stroke={rimCol} strokeWidth={3} opacity={0.55} />
          {Array.from({ length: 28 }).map((_, i) => (
            <line key={i} x1={-200 + i * 92 * k} y1={ground - 94 * k} x2={-200 + i * 92 * k} y2={ground} stroke={OUTLINE} strokeWidth={3} opacity={0.65} />
          ))}
        </g>

        {/* Shrub silhouette on far right */}
        <path
          d={`M ${0.84 * W} ${ground + 4} Q ${0.86 * W + sway * 0.5} ${ground - 90 * k} ${0.91 * W} ${ground - 96 * k} Q ${0.95 * W + sway} ${ground - 135 * k} ${W + 250} ${ground - 80 * k} L ${W + 250} ${ground + 4} Z`}
          fill="#17162A"
          stroke={OUTLINE}
          strokeWidth={4}
        />

        <GroundPlane y={ground} fill="#262A42" rim={rimCol} />

        {/* Patio chair on the right side of the lawn */}
        <g transform={`translate(${0.8 * W} ${ground}) scale(${k})`}>
          <ellipse cx={0} cy={8} rx={52} ry={10} fill="#000" opacity={0.42} />
          <path d="M -32 4 L -20 -52 L 32 -52 L 42 4 M -20 -52 L -36 -118" fill="none" stroke="#1E1C2E" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="-34,-114 -16,-114 -10,-52 -24,-52" fill="#2FB7A6" stroke={OUTLINE} strokeWidth={3.5} />
          <polygon points="-22,-54 34,-54 36,-42 -20,-42" fill="#2FB7A6" stroke={OUTLINE} strokeWidth={3.5} />
          <line x1={-34} y1={-114} x2={-16} y2={-114} stroke={rimCol} strokeWidth={2.5} opacity={0.7} />
        </g>

        {/* Frost sparkles across ground & fence rail */}
        {frost ? (
          <g style={{ mixBlendMode: 'screen' }}>
            {Array.from({ length: 48 }).map((_, i) => {
              const fx = -100 + rnd(811, i) * (W + 200);
              const fy = i % 5 === 0 ? ground - 96 * k : ground + 8 + rnd(812, i) * 140 * k;
              const tw = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(t / 7 + i * 2.3), 2);
              return <circle key={i} cx={fx} cy={fy} r={2.2 * k} fill="#D8F2FF" opacity={0.85 * tw} />;
            })}
          </g>
        ) : null}

        <LightVeil
          id={`${id}veil`}
          lights={[
            [0.5 * W, ground - 160 * k, 580 * k],
            [0.5 * W, 0.24 * H, 460 * k],
          ]}
          o={0.32}
        />
        <Dust t={t} seed={821} x0={-100} y0={ground - 360 * k} w={W + 200} h={400 * k} n={28} o={0.4} />
      </g>
    );
  }

  // near: dark garden planter edge & bottom-corner grass blades
  return (
    <g>
      <rect x={-120} y={ground + 38} width={0.11 * W + 120} height={500} rx={8} fill="#0A0914" stroke={OUTLINE} strokeWidth={4} />
      <SwayingTufts t={t} xs={[0.06 * W, 0.92 * W, 0.96 * W]} y={ground + 45} fill="#0A0914" />
    </g>
  );
};
