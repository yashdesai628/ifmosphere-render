import React from 'react';
import { PALETTE, BrandLabel, GroundPlane } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust, Cone, RoomCorners } from '../../engine/light';
import { Rays, Stars, NightSky } from '../../engine/kit';
import type { SetProps } from './render';
import { DeepSpaceBg, StageRim, NearSpaceEdges } from './sets-a';

const OUTLINE = '#16111F';

// ---------------------------------------------------------------- 8. lab
export const LabSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const alert = clamp((sp.alert as number | undefined) ?? 0);
  const ok = ((sp.ok as number | undefined) ?? 0) > 0.5;
  const flash = alert > 0.25 ? 0.5 + 0.5 * Math.sin(t * 0.34) : 0;
  const scrCol = ok ? PALETTE.green : alert > 0.25 ? PALETTE.gold : PALETTE.cream;
  const scrFill = ok ? '#122E24' : alert > 0.25 ? '#2E1F14' : '#141729';
  const wallTop = vert ? ground - 820 : 120;
  const deskY = ground - 120;
  const deskW = vert ? 760 : 1060;
  const deskX = (W - deskW) / 2;

  if (layer === 'far') {
    const mw = vert ? 860 : 1240;
    const mx = (W - mw) / 2;
    const my = vert ? ground - 640 : 210;
    const mh = vert ? 310 : 280;
    const scrW = (mw - 48) / 3;
    return (
      <g>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill="#1E1C32" />
        {/* Architectural wall panels */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={-400 + i * 420} y={-300} width={400} height={ground + 300} fill={i % 2 ? '#23203A' : '#1D1B30'} stroke="#131120" strokeWidth={3} />
        ))}
        <RoomCorners x0={-200} x1={W + 200} y0={wallTop} y1={ground} />
        {/* Wall of 3 dark screens */}
        <g transform={`translate(${mx} ${my})`}>
          {/* Left screen: World map */}
          <rect x={0} y={0} width={scrW} height={mh} rx={14} fill="#12172B" stroke={OUTLINE} strokeWidth={4} />
          <path d={`M ${scrW * 0.14} ${mh * 0.35} Q ${scrW * 0.25} ${mh * 0.2} ${scrW * 0.38} ${mh * 0.38} L ${scrW * 0.3} ${mh * 0.72} Z`} fill="#2C6B8E" opacity={0.8} />
          <path d={`M ${scrW * 0.48} ${mh * 0.26} Q ${scrW * 0.7} ${mh * 0.18} ${scrW * 0.86} ${mh * 0.4} L ${scrW * 0.74} ${mh * 0.68} L ${scrW * 0.52} ${mh * 0.55} Z`} fill="#2C6B8E" opacity={0.8} />
          <circle cx={scrW * 0.22} cy={mh * 0.42} r={6 + 2 * Math.sin(t * 0.15)} fill={PALETTE.cyan} />
          <circle cx={scrW * 0.66} cy={mh * 0.36} r={6 + 2 * Math.cos(t * 0.15)} fill={PALETTE.gold} />
          {/* Center screen: Cream / Green / Alert chart */}
          <g transform={`translate(${scrW + 24} 0)`}>
            <rect x={0} y={0} width={scrW} height={mh} rx={14} fill={scrFill} stroke={OUTLINE} strokeWidth={4} />
            <polyline
              points={`24,${mh * 0.78} ${scrW * 0.35},${mh * 0.72} ${scrW * 0.55},${mh * 0.56} ${scrW * 0.68},${mh * 0.22} ${scrW * 0.82},${mh * 0.45} ${scrW - 24},${mh * 0.54}`}
              fill="none" stroke={scrCol} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"
            />
            {alert > 0.25 ? (
              <g transform={`translate(${scrW * 0.5} ${mh * 0.48})`} opacity={0.5 + 0.5 * flash}>
                <Glow x={0} y={0} r={110} kind="warm" o={0.7} />
                <polygon points="0,-42 40,32 -40,32" fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
                <rect x={-4} y={-18} width={8} height={24} rx={3} fill={OUTLINE} />
                <circle cx={0} cy={17} r={5} fill={OUTLINE} />
              </g>
            ) : null}
            {ok ? <BrandLabel x={scrW * 0.5} y={42} t={t} text="MODEL OK" size={22} color={PALETTE.green} /> : null}
          </g>
          {/* Right screen: Telemetry bars */}
          <g transform={`translate(${(scrW + 24) * 2} 0)`}>
            <rect x={0} y={0} width={scrW} height={mh} rx={14} fill={ok ? '#122E24' : '#131628'} stroke={OUTLINE} strokeWidth={4} />
            {[0, 1, 2, 3].map((row) => {
              const barW = (scrW - 60) * (0.45 + 0.45 * Math.sin(t * 0.06 + row * 1.4) * 0.5 + 0.25);
              return (
                <g key={row} transform={`translate(28 ${48 + row * 48})`}>
                  <rect x={0} y={0} width={scrW - 56} height={18} rx={6} fill="#1E223B" />
                  <rect x={0} y={0} width={Math.max(24, barW)} height={18} rx={6} fill={ok ? PALETTE.green : row === 2 && alert > 0.25 ? PALETTE.orange : PALETTE.cyan} />
                </g>
              );
            })}
          </g>
        </g>
        {/* Overhead ceiling light */}
        <rect x={W * 0.5 - 240} y={wallTop + 12} width={480} height={16} rx={8} fill="#DCE8FF" stroke={OUTLINE} strokeWidth={3.5} />
        <Glow x={W * 0.5} y={wallTop + 30} r={260} kind="cool" o={0.45} />
      </g>
    );
  }
  if (layer === 'near') {
    return (
      <g>
        <rect x={-1600} y={ground + 45} width={W + 3200} height={H + 1400} fill="#18162B" />
        <line x1={-1600} y1={ground + 45} x2={W + 1600} y2={ground + 45} stroke="#9BA8CC" strokeWidth={3.5} opacity={0.4} />
        <path d={`M -400 ${ground + 30} Q ${W * 0.06} ${ground + 5} ${W * 0.14} ${H + 300} L -400 ${H + 300} Z`} fill="#121020" stroke={OUTLINE} strokeWidth={4} />
        <path d={`M ${W + 400} ${ground + 30} Q ${W * 0.94} ${ground + 5} ${W * 0.86} ${H + 300} L ${W + 400} ${H + 300} Z`} fill="#121020" stroke={OUTLINE} strokeWidth={4} />
      </g>
    );
  }

  return (
    <g>
      {/* Carpet GroundPlane */}
      <GroundPlane y={ground} fill="#25233D" rim="#C9D2EA" />
      {/* Astronomers' control desk */}
      <g transform={`translate(${deskX} ${deskY})`}>
        <rect x={36} y={16} width={28} height={106} rx={4} fill="#2B243D" stroke={OUTLINE} strokeWidth={4} />
        <rect x={deskW - 64} y={16} width={28} height={106} rx={4} fill="#2B243D" stroke={OUTLINE} strokeWidth={4} />
        <rect x={0} y={0} width={deskW} height={24} rx={8} fill="#46385C" stroke={OUTLINE} strokeWidth={4} />
        <line x1={12} y1={4} x2={deskW - 12} y2={4} stroke="#9F8FC2" strokeWidth={3} opacity={0.65} />

        {/* Left laptop */}
        <g transform={`translate(${deskW * 0.22} 0)`}>
          <polygon points="-70,0 -52,-86 68,-86 54,0" fill={ok ? '#1A3D30' : alert > 0.25 ? '#3A2315' : '#1E2542'} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          <line x1={-40} y1={-44} x2={46} y2={-44} stroke={scrCol} strokeWidth={4} strokeLinecap="round" />
          <rect x={-76} y={-6} width={136} height={10} rx={4} fill="#6E7896" stroke={OUTLINE} strokeWidth={3.5} />
          <Glow x={0} y={-44} r={95} kind={alert > 0.25 ? 'warm' : 'cool'} o={0.4} />
        </g>

        {/* Right laptop */}
        <g transform={`translate(${deskW * 0.68} 0)`}>
          <polygon points="-58,0 -70,-86 50,-86 66,0" fill={ok ? '#1A3D30' : '#1E2542'} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          <polyline points="-46,-26 -18,-36 12,-62 34,-42" fill="none" stroke={scrCol} strokeWidth={4} strokeLinecap="round" />
          <rect x={-64} y={-6} width={136} height={10} rx={4} fill="#6E7896" stroke={OUTLINE} strokeWidth={3.5} />
          <Glow x={0} y={-44} r={95} kind="cool" o={0.35} />
        </g>

        {/* Coffee mug with steam */}
        <g transform={`translate(${deskW * 0.46} 0)`}>
          <path d={`M -4 ${-52 + Math.sin(t * 0.08) * 3} Q 6 ${-68} -2 ${-86}`} fill="none" stroke={PALETTE.cream} strokeWidth={3} opacity={0.45} strokeLinecap="round" />
          <path d="M 14 -34 C 28 -34 28 -12 14 -12" fill="none" stroke={PALETTE.cream} strokeWidth={4} />
          <rect x={-16} y={-42} width={32} height={42} rx={6} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
        </g>

        {/* Bright sticky note */}
        <g transform={`translate(${deskW * 0.88} -8) rotate(8)`}>
          <rect x={-24} y={-24} width={48} height={48} rx={3} fill="#FFE066" stroke={OUTLINE} strokeWidth={3.5} />
          <line x1={-14} y1={-8} x2={14} y2={-8} stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
          <line x1={-14} y1={4} x2={10} y2={4} stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
        </g>
      </g>
      <LightVeil id={`${id}veil`} lights={[[W * 0.5, wallTop + 260, 740]]} o={0.28} />
      <Dust t={t} seed={808} x0={100} y0={wallTop + 60} w={W - 200} h={ground - wallTop - 80} n={26} o={0.38} />
    </g>
  );
};

// ---------------------------------------------------------------- 9. timeline
const TIMELINE_EVENTS = [
  { year: '2018', u: 0.08, sub: 'BRUSH' },
  { year: '2023', u: 0.38, sub: 'NEOWISE' },
  { year: '2024', u: 0.68, sub: 'DUST' },
  { year: '2025', u: 0.92, sub: 'ERUPT' },
];

export const TimelineSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const st = (sp.t as number | undefined) ?? 0.5;
  const pins = (sp.pins as number | undefined) ?? 2;
  const glowKey = ((sp.glow as string | undefined) ?? 'gold') === 'red' ? 'red' : 'gold';
  const glowHex = glowKey === 'red' ? PALETTE.red : PALETTE.gold;
  const glowKind = glowKey === 'red' ? 'red' : 'warm';

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={909} stars={84} rayX={W * 0.5} rayY={H * 0.35} rayColor={glowHex} rayO={0.1} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#120E24" />;
  }

  const x0 = vert ? 130 : 300;
  const x1 = vert ? W - 130 : W - 300;
  const yLine = vert ? 920 : 480;
  const tEff = clamp(lerp(Math.max(0, st - 0.18), st, easeInOut(p)));
  const mx = lerp(x0, x1, tEff);

  return (
    <g>
      {/* Cream baseline & glowing progress trail */}
      <line x1={x0} y1={yLine} x2={x1} y2={yLine} stroke={OUTLINE} strokeWidth={12} strokeLinecap="round" />
      <line x1={x0} y1={yLine} x2={x1} y2={yLine} stroke={PALETTE.cream} strokeWidth={4.5} strokeLinecap="round" opacity={0.55} />
      <line x1={x0} y1={yLine} x2={mx} y2={yLine} stroke={glowHex} strokeWidth={6} strokeLinecap="round" />

      {/* Year ticks & ordered popping pins */}
      {TIMELINE_EVENTS.map((ev, i) => {
        const ex = lerp(x0, x1, ev.u);
        const visible = i < pins;
        const pop = visible ? backOut(clamp((p * 1.8 - i * 0.1))) : 0;
        const newest = visible && i === Math.floor(pins) - 1;
        return (
          <g key={ev.year} transform={`translate(${ex} ${yLine})`}>
            <line x1={0} y1={-16} x2={0} y2={16} stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" />
            <BrandLabel x={0} y={54} t={t} text={ev.year} size={26} color={PALETTE.cream} />
            {visible ? (
              <g transform={`scale(${pop})`}>
                <line x1={0} y1={0} x2={0} y2={-78} stroke={OUTLINE} strokeWidth={8} />
                <line x1={0} y1={0} x2={0} y2={-78} stroke={glowHex} strokeWidth={4} />
                {newest ? <Glow x={0} y={-98} r={75 + 10 * Math.sin(t * 0.15)} kind={glowKind} o={0.75} /> : null}
                <circle cx={0} cy={-98} r={24} fill={glowHex} stroke={OUTLINE} strokeWidth={4} />
                <circle cx={-6} cy={-104} r={6} fill="#FFF8E2" opacity={0.85} />
                <BrandLabel x={0} y={-142} t={t} text={ev.sub} size={20} color={glowKey === 'red' ? PALETTE.red : PALETTE.gold} />
              </g>
            ) : null}
          </g>
        );
      })}

      {/* Sliding glowing marker */}
      <g transform={`translate(${mx} ${yLine})`}>
        <Glow x={0} y={0} r={70} kind={glowKind} o={0.85} />
        <polygon points="0,-20 18,0 0,20 -18,0" fill={glowHex} stroke={OUTLINE} strokeWidth={4} />
      </g>

      <StageRim ground={ground} W={W} H={H} fill="#110E22" rim="#D5DCF0" o={0.4} />
      <LightVeil id={`${id}veil`} lights={[[mx, yLine, 480]]} o={0.3} />
      <Dust t={t} seed={919} x0={x0 - 80} y0={yLine - 240} w={x1 - x0 + 160} h={340} n={26} o={0.45} />
    </g>
  );
};

// ---------------------------------------------------------------- 10. bowl
export const BowlSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const st = (sp.t as number | undefined) ?? 0.5;
  const steamAmt = clamp((sp.steam as number | undefined) ?? 0.7);
  const bx = vert ? W * 0.52 : W * 0.62;
  const tableTop = ground - 190;
  const by = vert ? ground - 310 : tableTop - 45;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill="#140F1E" />
        <RoomCorners x0={-200} x1={W + 200} y0={60} y1={ground} />
        {/* Dark kitchen night window */}
        <g transform={`translate(${vert ? 90 : 180} ${vert ? 320 : 190})`}>
          <defs>
            <clipPath id={`${id}win`}><rect x={0} y={0} width={260} height={300} rx={12} /></clipPath>
          </defs>
          <g clipPath={`url(#${id}win)`}>
            <NightSky id={`${id}ns`} x0={0} y0={0} w={260} h={300} horizonY={300} />
            <Stars seed={1001} x0={0} y0={0} w={260} h={280} t={t} n={32} o={0.85} />
          </g>
          <rect x={0} y={0} width={260} height={300} rx={12} fill="none" stroke={OUTLINE} strokeWidth={5} />
          <line x1={130} y1={0} x2={130} y2={300} stroke={OUTLINE} strokeWidth={5} />
          <line x1={0} y1={150} x2={260} y2={150} stroke={OUTLINE} strokeWidth={5} />
        </g>
        {/* Warm pendant lamp */}
        <line x1={bx} y1={-400} x2={bx} y2={by - 320} stroke={OUTLINE} strokeWidth={6} />
        <path d={`M ${bx - 90} ${by - 270} Q ${bx} ${by - 350} ${bx + 90} ${by - 270} Z`} fill="#2C253B" stroke={OUTLINE} strokeWidth={4} />
        <Cone d={`M ${bx - 75} ${by - 270} L ${bx + 75} ${by - 270} L ${bx + 360} ${ground} L ${bx - 360} ${ground} Z`} o={0.22} />
        <Glow x={bx} y={by - 265} r={220} kind="warm" o={0.65} />
      </g>
    );
  }
  if (layer === 'near') {
    return (
      <g>
        <rect x={-1600} y={ground + 45} width={W + 3200} height={H + 1400} fill="#3B2118" />
        <line x1={-1600} y1={ground + 45} x2={W + 1600} y2={ground + 45} stroke="#F0AF7D" strokeWidth={3.5} opacity={0.65} />
      </g>
    );
  }

  const swirlT = clamp(lerp(Math.max(0.05, st - 0.25), st, easeInOut(p)));
  const ang = swirlT * Math.PI * 3.2 + t * 0.04;
  const rad = lerp(22, 118, swirlT);
  const spx = bx + Math.cos(ang) * rad;
  const spy = by - 46 + Math.sin(ang) * rad * 0.38;
  const swirlPts = Array.from({ length: 34 }).map((_, i) => {
    const f = i / 33;
    const u = f * swirlT;
    const a = u * Math.PI * 3.2 + t * 0.04;
    const r = lerp(18, 118, u);
    return `${bx + Math.cos(a) * r},${by - 46 + Math.sin(a) * r * 0.38}`;
  }).join(' ');

  return (
    <g>
      <GroundPlane y={ground} fill="#231618" rim="#D5DCF0" />
      {/* Kitchen table supporting the big soup bowl */}
      <rect x={bx - 300} y={tableTop} width={600} height={190} rx={12} fill="#4D2C1E" stroke={OUTLINE} strokeWidth={4} />
      <line x1={bx - 280} y1={tableTop + 4} x2={bx + 280} y2={tableTop + 4} stroke="#F0AF7D" strokeWidth={3.5} opacity={0.6} />

      {/* Big white ceramic bowl of thick orange soup */}
      <ellipse cx={bx} cy={by + 68} rx={145} ry={26} fill="#000" opacity={0.38} />
      <path d={`M ${bx - 195} ${by - 48} C ${bx - 195} ${by + 74} ${bx + 195} ${by + 74} ${bx + 195} ${by - 48} Z`} fill="#EAE2D3" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={bx} cy={by - 48} rx={195} ry={66} fill="#F6EFE3" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={bx} cy={by - 44} rx={168} ry={52} fill="#E66420" stroke={OUTLINE} strokeWidth={3.5} />
      {/* Thick soup swirl */}
      <polyline points={swirlPts} fill="none" stroke="#FFA54F" strokeWidth={10} strokeLinecap="round" opacity={0.78} />
      <polyline points={swirlPts} fill="none" stroke="#FFE2A3" strokeWidth={3.5} strokeLinecap="round" opacity={0.85} />

      {/* Silver spoon dragging in the soup */}
      <g transform={`translate(${spx} ${spy})`}>
        <ellipse cx={0} cy={6} rx={24} ry={11} fill="#D5DFF0" stroke={OUTLINE} strokeWidth={3.5} />
        <path d="M 10 -2 L 108 -118 L 122 -106 L 18 6 Z" fill="#C2CEE3" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        <line x1={20} y1={-4} x2={112} y2={-110} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.7} />
      </g>

      {/* Rising steam ribbons */}
      {steamAmt > 0.05 ? [-90, -25, 40, 95].map((dx, i) => {
        const drift = Math.sin(t * 0.06 + i * 1.8) * 18;
        const h = (110 + i * 16) * steamAmt;
        return (
          <path
            key={i}
            d={`M ${bx + dx} ${by - 76} Q ${bx + dx + drift} ${by - 76 - h * 0.5} ${bx + dx - drift * 0.7} ${by - 76 - h}`}
            fill="none" stroke={PALETTE.cream} strokeWidth={7} strokeLinecap="round" opacity={0.32 * steamAmt}
          />
        );
      }) : null}
      <LightVeil id={`${id}veil`} lights={[[bx, by - 50, 480]]} o={0.36} />
      <Dust t={t} seed={1015} x0={bx - 280} y0={by - 280} w={560} h={340} n={24} o={0.5} />
    </g>
  );
};

// ---------------------------------------------------------------- 11. blast
export const BlastSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const minD = Math.min(W, H);
  const st = (sp.t as number | undefined) ?? 0.6;
  const flashAmt = clamp((sp.flash as number | undefined) ?? 0);
  const dustAmt = clamp((sp.dust as number | undefined) ?? 0.7);
  const cx = W * 0.5;
  const cy = vert ? H * 0.43 : H * 0.45;

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={1101} stars={88} rayX={cx} rayY={cy} rayColor="#FFC573" rayO={0.16} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#1E121C" />;
  }

  const exp = clamp(lerp(Math.max(0.18, st - 0.25), st, easeOut(p)));
  const lobeH = minD * lerp(0.16, 0.42, exp);
  const lobeW = minD * lerp(0.12, 0.28, exp);
  const beltW = minD * (0.28 + 0.14 * dustAmt);
  const beltH = 26 + dustAmt * 42;
  const flashAlpha = flashAmt * Math.exp(-p * 5.2);

  return (
    <g>
      <Glow x={cx} y={cy} r={lobeH * 1.4} kind="warm" o={0.7} />
      {/* Expanding shock ring */}
      <circle cx={cx} cy={cy} r={lobeH * (0.75 + 0.25 * ((t % 45) / 45))} fill="none" stroke="#FFD68A" strokeWidth={4} opacity={0.45 * (1 - ((t % 45) / 45))} />
      {/* Bipolar hourglass orange gas lobes (free at top & bottom, pinched at equator) */}
      <g transform={`translate(${cx} ${cy})`}>
        {[-1, 1].map((dir) => (
          <g key={dir} transform={`scale(1 ${dir})`}>
            <path
              d={`M -34 0 C ${-lobeW * 0.95} ${-lobeH * 0.35} ${-lobeW * 1.15} ${-lobeH} 0 ${-lobeH} C ${lobeW * 1.15} ${-lobeH} ${lobeW * 0.95} ${-lobeH * 0.35} 34 0 Z`}
              fill="#F26729" opacity={0.86} stroke={OUTLINE} strokeWidth={4}
            />
            <path
              d={`M -20 0 C ${-lobeW * 0.65} ${-lobeH * 0.3} ${-lobeW * 0.72} ${-lobeH * 0.8} 0 ${-lobeH * 0.8} C ${lobeW * 0.72} ${-lobeH * 0.8} ${lobeW * 0.65} ${-lobeH * 0.3} 20 0 Z`}
              fill="#FFBD52" opacity={0.85}
            />
          </g>
        ))}

        {/* Brown equatorial dust belt holding back the middle */}
        <ellipse cx={0} cy={0} rx={beltW} ry={beltH} fill="#633827" stroke={OUTLINE} strokeWidth={4} />
        <ellipse cx={0} cy={-4} rx={beltW * 0.84} ry={beltH * 0.62} fill="#46251A" stroke={OUTLINE} strokeWidth={3.5} />
        <path d={`M ${-beltW * 0.9} -2 Q 0 ${-beltH * 0.7} ${beltW * 0.9} -2`} fill="none" stroke="#B87E5C" strokeWidth={3.5} opacity={0.55} />

        {/* Bright white-gold core */}
        <Glow x={0} y={0} r={95} kind="warm" o={0.95} />
        <circle cx={0} cy={0} r={28 + Math.sin(t * 0.14) * 3} fill="#FFFBE8" stroke={OUTLINE} strokeWidth={4} />
      </g>

      {flashAlpha > 0.03 ? (
        <g opacity={flashAlpha}>
          <Glow x={cx} y={cy} r={minD * 0.9} kind="warm" o={1} />
          <circle cx={cx} cy={cy} r={minD * 0.28} fill="#FFFFFF" opacity={0.75} />
        </g>
      ) : null}

      <StageRim ground={ground} W={W} H={H} fill="#120C1C" rim="#F2B488" o={0.45} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, lobeH * 1.6]]} o={0.28} />
      <Dust t={t * 1.4} seed={1122} x0={cx - minD * 0.45} y0={80} w={minD * 0.9} h={ground - 60} n={40} o={0.68} />
    </g>
  );
};

// ---------------------------------------------------------------- 12. core
export const CoreSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const minD = Math.min(W, H);
  const st = (sp.t as number | undefined) ?? 0.6;
  const shockAmt = clamp((sp.shock as number | undefined) ?? 0.5);
  const cx = W * 0.5;
  const cy = H * 0.44;

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <radialGradient id={`${id}corebg`} cx="50%" cy="44%" r="68%">
            <stop offset="0%" stopColor="#FFFCE8" />
            <stop offset="28%" stopColor="#FFD266" />
            <stop offset="65%" stopColor="#EB6B24" />
            <stop offset="100%" stopColor="#7A1D12" />
          </radialGradient>
        </defs>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}corebg)`} />
        <Rays x={cx} y={cy} t={t * 0.8} len={2200} n={18} o={0.2} color="#FFF8D8" />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#52160E" />;
  }

  const tSink = clamp(lerp(Math.max(0.05, st - 0.25), st, easeInOut(p)));
  const starDist = lerp(minD * 0.34, 0, tSink);
  const starAng = tSink * Math.PI * 2.5 + 0.6;
  const sx = cx + Math.cos(starAng) * starDist;
  const sy = cy + Math.sin(starAng) * starDist * 0.7;
  const swallowPulse = Math.exp(-Math.pow((tSink - 0.88) * 9, 2));
  const starScale = clamp(1 - Math.max(0, (tSink - 0.85) / 0.15));

  return (
    <g>
      {/* Dense swirling plasma rings */}
      {[0, 1, 2, 3, 4].map((i) => {
        const rr = minD * (0.12 + i * 0.085);
        return (
          <ellipse
            key={i} cx={cx} cy={cy} rx={rr * 1.2} ry={rr * 0.85}
            transform={`rotate(${t * (0.4 + i * 0.12) + i * 48} ${cx} ${cy})`}
            fill="none" stroke={i < 2 ? '#FFF3BA' : '#FF9638'} strokeWidth={18 - i * 2}
            strokeDasharray={`${85 + i * 28} ${60 + i * 20}`} strokeLinecap="round" opacity={0.48}
          />
        );
      })}

      {/* Hot white-gold center */}
      <Glow x={cx} y={cy} r={minD * 0.42} kind="warm" o={0.95} />
      <circle cx={cx} cy={cy} r={minD * 0.08 + Math.sin(t * 0.12) * 4} fill="#FFFDF0" opacity={0.92} />

      {/* Radiating ring shock waves */}
      {shockAmt > 0.05 ? [0, 1].map((k) => {
        const cyc = ((p * 1.1 + k * 0.5) % 1);
        const sr = lerp(minD * 0.06, minD * (0.35 + 0.22 * shockAmt), cyc);
        return <circle key={k} cx={cx} cy={cy} r={sr} fill="none" stroke="#FFF7D6" strokeWidth={6 - cyc * 3} opacity={(1 - cyc) * shockAmt * 0.85} />;
      }) : null}

      {/* Tiny yellow star sinking & swallowed in bright pulse */}
      {starScale > 0.02 ? (
        <g transform={`translate(${sx} ${sy}) scale(${starScale})`}>
          <Glow x={0} y={0} r={65} kind="warm" o={0.9} />
          <circle cx={0} cy={0} r={minD * 0.02} fill="#FFEA78" stroke={OUTLINE} strokeWidth={4} />
        </g>
      ) : null}
      {swallowPulse > 0.05 ? <Glow x={cx} y={cy} r={minD * 0.45 * swallowPulse} kind="warm" o={swallowPulse} /> : null}

      {/* Glowing core plasma floor shelf */}
      <rect x={-1600} y={ground} width={W + 3200} height={H + 1800} fill="#611E10" opacity={0.82} />
      <line x1={-1600} y1={ground} x2={W + 1600} y2={ground} stroke="#FFE09E" strokeWidth={3.5} opacity={0.65} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, minD * 0.68]]} o={0.2} />
      <Dust t={t * 1.6} seed={1208} x0={0} y0={60} w={W} h={ground - 40} n={40} o={0.7} />
    </g>
  );
};

// ---------------------------------------------------------------- 13. void
const VOID_THEMES = {
  gold: { ray: '#FFE09A', rim: PALETTE.gold, glow: 'warm' as const },
  cyan: { ray: '#6EE8FF', rim: PALETTE.cyan, glow: 'cool' as const },
  red: { ray: '#FF6B5E', rim: PALETTE.red, glow: 'red' as const },
};

export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glowKey = ((sp.glow as string | undefined) ?? 'gold') as keyof typeof VOID_THEMES;
  const th = VOID_THEMES[glowKey] ?? VOID_THEMES.gold;
  const minD = Math.min(W, H);

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={1303} stars={26} starO={0.55} rayX={W * 0.5} rayY={H * 0.22} rayColor={th.ray} rayO={0.16} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#0D0B1A" />;
  }

  return (
    <g>
      <Glow x={W * 0.5} y={H * 0.32} r={minD * 0.55} kind={th.glow} o={0.35} />
      {/* Subtle rotating geometric stage rings */}
      <g transform={`translate(${W * 0.5} ${H * 0.44}) rotate(${t * 0.08})`} opacity={0.15}>
        <circle cx={0} cy={0} r={minD * 0.34} fill="none" stroke={th.rim} strokeWidth={2.5} strokeDasharray="16 20" />
        <circle cx={0} cy={0} r={minD * 0.22} fill="none" stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="8 16" />
      </g>
      <GroundPlane y={ground} fill="#100D20" rim={th.rim} />
      <LightVeil id={`${id}veil`} lights={[[W * 0.5, H * 0.42, minD * 0.72]]} o={0.32} />
      <Dust t={t} seed={1313} x0={80} y0={90} w={W - 160} h={ground - 90} n={24} o={0.42} />
    </g>
  );
};

// ---------------------------------------------------------------- 14. roman
export const RomanSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = (sp.t as number | undefined) ?? 0.5;
  const sparksAmt = clamp((sp.sparks as number | undefined) ?? 0.6);

  if (layer === 'far') {
    return <DeepSpaceBg t={t} seed={1404} stars={210} starO={0.72} rayX={W * 0.5} rayY={H * 0.25} rayColor="#6FE3FF" rayO={0.08} />;
  }
  if (layer === 'near') {
    return <NearSpaceEdges W={W} H={H} ground={ground} t={t} tint="#0C0D1E" />;
  }

  const skyTop = 180;
  const skyBot = ground - 20;
  const scanU = (lerp(Math.max(0.05, st - 0.32), st + 0.14, easeInOut(p))) % 1.0;
  const scanX = lerp(90, W - 90, scanU);
  const nSparks = Math.round(10 + 26 * sparksAmt);

  return (
    <g>
      {/* Huge dark sky survey grid */}
      <g opacity={0.35}>
        {Array.from({ length: 9 }).map((_, i) => {
          const gx = (i + 0.5) * (W / 9);
          return <line key={`vx${i}`} x1={gx} y1={-200} x2={gx} y2={ground} stroke="#36628E" strokeWidth={2} />;
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const gy = 140 + i * ((ground - 140) / 6);
          return <line key={`hz${i}`} x1={-200} y1={gy} x2={W + 200} y2={gy} stroke="#36628E" strokeWidth={2} />;
        })}
      </g>

      {/* Gold transient discovery sparks flashing up */}
      {Array.from({ length: nSparks }).map((_, i) => {
        const sx = lerp(120, W - 120, rnd(141, i));
        const sy = lerp(skyTop + 60, skyBot - 90, rnd(142, i));
        const flare = Math.max(0, Math.sin(t * 0.14 + i * 1.7));
        const r = 4 + flare * 8;
        return (
          <g key={i} transform={`translate(${sx} ${sy})`} opacity={0.4 + 0.6 * flare}>
            <Glow x={0} y={0} r={34} kind="warm" o={0.65 * flare} />
            <path d={`M 0 ${-r * 1.6} L ${r * 0.35} ${-r * 0.35} L ${r * 1.6} 0 L ${r * 0.35} ${r * 0.35} L 0 ${r * 1.6} L ${-r * 0.35} ${r * 0.35} L ${-r * 1.6} 0 L ${-r * 0.35} ${-r * 0.35} Z`} fill={PALETTE.gold} />
          </g>
        );
      })}

      {/* Sweeping cyan scan band */}
      <g>
        <defs>
          <linearGradient id={`${id}scan`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4EE3FF" stopOpacity={0} />
            <stop offset="50%" stopColor="#4EE3FF" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#4EE3FF" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <rect x={scanX - 110} y={-200} width={220} height={ground + 200} fill={`url(#${id}scan)`} />
        <line x1={scanX} y1={-200} x2={scanX} y2={ground} stroke={PALETTE.cyan} strokeWidth={4} opacity={0.85} />
        <Glow x={scanX} y={H * 0.44} r={140} kind="cool" o={0.55} />
      </g>

      <StageRim ground={ground} W={W} H={H} fill="#0E0D20" rim="#5FD8FF" o={0.45} />
      <LightVeil id={`${id}veil`} lights={[[scanX, H * 0.44, 520]]} o={0.28} />
      <Dust t={t} seed={1430} x0={60} y0={skyTop} w={W - 120} h={skyBot - skyTop} n={26} o={0.45} />
    </g>
  );
};
