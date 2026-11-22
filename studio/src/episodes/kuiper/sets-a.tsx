import React from 'react';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Rays, Stars, NightSky } from '../../engine/kit';
import { GroundPlane, PALETTE, FONTS } from '../../brand';
import type { SetProps } from './render';

export const num = (o: Record<string, unknown>, k: string, d = 0) => (typeof o[k] === 'number' ? (o[k] as number) : d);
export const str = (o: Record<string, unknown>, k: string, d = '') => (typeof o[k] === 'string' ? (o[k] as string) : d);
export const glowKind = (g: string): 'warm' | 'cool' | 'red' => (g === 'cyan' ? 'cool' : g === 'red' ? 'red' : 'warm');
export const glowCol = (g: string) => (g === 'cyan' ? PALETTE.cyan : g === 'red' ? PALETTE.red : PALETTE.gold);

/** Tiny in-world chip badge (never a character, pure vector signage). */
export const WorldTag: React.FC<{ x: number; y: number; text: string; color: string; s?: number; o?: number }> = ({
  x, y, text, color, s = 1, o = 1,
}) => {
  if (s <= 0.01 || o <= 0.01) return null;
  const w = Math.max(88, text.length * 13 + 30);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-w / 2} y={-16} width={w} height={32} rx={9} fill={PALETTE.pill} opacity={0.9} stroke={color} strokeWidth={2.5} />
      <text y={6} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fontWeight={700} fill={color} letterSpacing={1.4}>
        {text}
      </text>
    </g>
  );
};

/** Shared deep-space far layer with stars, radial glow and slow rays. */
export const SpaceFar: React.FC<{
  W: number; H: number; t: number; seed: number; n?: number; o?: number;
  gx: number; gy: number; gr: number; gMode: string; rayLen?: number; rayColor?: string; rayO?: number;
}> = ({ W, H, t, seed, n = 115, o = 0.85, gx, gy, gr, gMode, rayLen, rayColor, rayO = 0.07 }) => (
  <g>
    <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
    <Stars seed={seed} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.2} t={t} n={n} o={o} />
    <Glow x={gx} y={gy} r={gr} kind={glowKind(gMode)} o={0.35} />
    {rayLen ? <Rays x={gx} y={gy} t={t} len={rayLen} n={10} o={rayO} color={rayColor ?? glowCol(gMode)} /> : null}
  </g>
);

// ============================================================================ 1. SKYVIEW
export const SkyviewSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.3);
  const spSun = num(sp, 'sun', 0.2);
  const spLabels = num(sp, 'labels', 0);
  const gMode = str(sp, 'glow', 'gold');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = vert ? H * 0.44 : H * 0.38;
  const drift = lerp(spT - 0.12, spT, easeInOut(p)) * 42 + Math.sin(t / 48) * 8;
  const sunAmt = lerp(Math.max(0.08, spSun - 0.2), Math.max(0.15, spSun), easeOut(p));
  const sunX = cx + drift * 0.25;
  const sunY = cy - 12 * u;

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <linearGradient id={`${id}sky`} x1="0" y1={-H * 0.6} x2="0" y2={ground} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#050611" />
            <stop offset="55%" stopColor="#0A1026" />
            <stop offset="100%" stopColor="#121B3A" />
          </linearGradient>
          <linearGradient id={`${id}mw`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#465C9E" stopOpacity={0} />
            <stop offset="50%" stopColor="#8AA7E6" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#5C75B8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}sky)`} />
        <Stars seed={41} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.2} t={t} n={140} o={0.9} />
        {/* Diagonal Milky Way band across the Kuiper sky */}
        <g transform={`translate(${cx + drift * 0.15} ${cy}) rotate(${vert ? -36 : -22})`}>
          <ellipse cx={0} cy={0} rx={W * 1.1} ry={160 * u} fill={`url(#${id}mw)`} filter="url(#blur10)" />
          <ellipse cx={40 * u} cy={-14 * u} rx={W * 0.95} ry={70 * u} fill="#C6D9FF" opacity={0.11} filter="url(#blur6)" />
          {Array.from({ length: 75 }).map((_, i) => {
            const mx = (rnd(91, i) - 0.5) * W * 1.9;
            const my = (rnd(92, i) - 0.5) * 210 * u * (0.4 + 0.6 * rnd(93, i));
            const tw = 0.5 + 0.5 * Math.sin(t / (8 + i % 6) + i);
            return <circle key={i} cx={mx} cy={my} r={(0.8 + rnd(94, i) * 1.6) * u} fill="#EDF3FF" opacity={0.78 * tw} />;
          })}
        </g>
        <Rays x={sunX} y={sunY} t={t} len={720 * u} n={10} o={0.07 + 0.08 * sunAmt} color={gMode === 'cyan' ? '#BCEFFF' : '#FFF1CC'} />
      </g>
    );
  }

  if (layer === 'mid') {
    const giants = [
      { name: 'JUPITER', dx: -195, dy: 42, r: 5.5, col: PALETTE.cream },
      { name: 'SATURN', dx: -98, dy: 16, r: 4.4, col: PALETTE.gold },
      { name: 'URANUS', dx: 105, dy: 14, r: 3.6, col: PALETTE.cyan },
      { name: 'NEPTUNE', dx: 215, dy: 44, r: 3.8, col: PALETTE.sky },
    ];
    const lblPop = spLabels > 0.5 ? backOut(clamp((p - 0.08) / 0.28)) : 0;
    const sunRingPop = spSun > 0.3 ? backOut(clamp((p - 0.06) / 0.25)) : 0;
    const twSun = 0.88 + 0.12 * Math.sin(t / 5);

    return (
      <g>
        {/* Ecliptic arc & Sun-star */}
        <path
          d={`M ${sunX - 300 * u} ${sunY + 88 * u} Q ${sunX} ${sunY - 6 * u} ${sunX + 310 * u} ${sunY + 92 * u}`}
          fill="none"
          stroke="#7289C4"
          strokeWidth={2}
          strokeDasharray="6 10"
          opacity={0.4}
        />
        <Glow x={sunX} y={sunY} r={(80 + 130 * sunAmt) * u} kind={glowKind(gMode)} o={0.4 + 0.45 * sunAmt} />
        {/* Crisp 4-point diffraction spikes — Sun is a bright star, not a disc */}
        <g transform={`translate(${sunX} ${sunY}) scale(${(0.75 + 0.55 * sunAmt) * twSun})`}>
          <path d={`M ${-26 * u} 0 L ${-3 * u} ${-3 * u} L 0 ${-28 * u} L ${3 * u} ${-3 * u} L ${26 * u} 0 L ${3 * u} ${3 * u} L 0 ${28 * u} L ${-3 * u} ${3 * u} Z`} fill="#FFF9E6" />
          <circle cx={0} cy={0} r={4.5 * u} fill="#FFFFFF" />
        </g>
        {sunRingPop > 0.01 ? (
          <g transform={`translate(${sunX} ${sunY}) scale(${sunRingPop})`} opacity={0.85 * spSun}>
            <circle cx={0} cy={0} r={24 * u} fill="none" stroke={PALETTE.gold} strokeWidth={2.5} strokeDasharray="5 5" />
            <WorldTag x={0} y={-44 * u} text="SUN (1 STAR)" color={PALETTE.gold} s={0.85} />
          </g>
        ) : null}

        {/* Four giant planet dots on gentle arc */}
        {giants.map((g, i) => {
          const px = sunX + g.dx * u + Math.sin(t / 70 + i) * 3;
          const py = sunY + g.dy * u;
          const tw = 0.72 + 0.28 * Math.sin(t / 9 + i * 1.4);
          return (
            <g key={g.name}>
              <circle cx={px} cy={py} r={g.r * 3.4 * u} fill={g.col} opacity={0.18 * tw} />
              <circle cx={px} cy={py} r={g.r * u} fill={g.col} opacity={0.95 * tw} />
              {lblPop > 0.01 ? (
                <g opacity={lblPop}>
                  <line x1={px} y1={py + 9 * u} x2={px} y2={py + (i % 2 ? 42 : 76) * u} stroke={g.col} strokeWidth={2} opacity={0.75} />
                  <WorldTag x={px} y={py + (i % 2 ? 56 : 92) * u} text={g.name} color={g.col} s={0.85 * lblPop} />
                </g>
              ) : null}
            </g>
          );
        })}

        {/* Distant dark Kuiper terrain plane (plane 1) & foreground ice ridge (plane 2) & ground (plane 3) */}
        <path
          d={`M -900 ${ground} L -520 ${ground - 78 * u} L -180 ${ground - 46 * u} L 220 ${ground - 86 * u} L 680 ${ground - 36 * u} L 1160 ${ground - 82 * u} L 1660 ${ground - 48 * u} L 2300 ${ground - 90 * u} L 2900 ${ground} Z`}
          fill="#11182E"
          stroke="#0A0D1A"
          strokeWidth={4}
        />
        <path
          d={`M -900 ${ground} Q ${W * 0.25} ${ground - 44 * u} ${W * 0.55} ${ground - 22 * u} T ${W + 900} ${ground}`}
          fill="#192340"
          stroke="#0B0E1A"
          strokeWidth={4}
        />
        <GroundPlane y={ground} fill="#1E2846" rim="#8CAEE8" />
        <LightVeil id={`${id}veil`} lights={[[sunX, sunY, 440 * u], [W * 0.5, ground - 110 * u, 420 * u]]} o={0.4} />
        <Dust t={t} seed={211} x0={-200} y0={cy - 220 * u} w={W + 400} h={ground - cy + 200 * u} n={28} o={0.35} />
      </g>
    );
  }

  // near: dark icy rock corners below ground + drifting frost motes
  return (
    <g>
      <polygon points={`-160,${H + 100} -160,${ground - 18 * u} 150,${ground + 52 * u} 260,${H + 100}`} fill="#0A0D1A" stroke="#05070E" strokeWidth={4} />
      <polygon points={`${W + 160},${H + 100} ${W + 160},${ground - 24 * u} ${W - 140},${ground + 48 * u} ${W - 250},${H + 100}`} fill="#0A0D1A" stroke="#05070E" strokeWidth={4} />
      <Dust t={t * 1.4} seed={219} x0={0} y0={ground - 120 * u} w={W} h={220 * u} n={14} o={0.45} />
    </g>
  );
};

// ============================================================================ 2. SURFACE
export const SurfaceSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.4);
  const spFrost = num(sp, 'frost', 0.6);
  const gMode = str(sp, 'glow', 'cyan');
  const u = Math.min(W, H) / 1080;
  const sunX = W * 0.72 + Math.sin(t / 80) * 14;
  const sunY = ground - 195 * u;
  const frostAmt = lerp(Math.max(0.15, spFrost - 0.25), spFrost, easeOut(p));
  const rimCol = gMode === 'gold' ? PALETTE.gold : PALETTE.cyan;

  if (layer === 'far') {
    return (
      <g>
        <NightSky id={`${id}sky`} x0={-W} y0={-H} w={W * 3} h={H * 3} horizonY={ground} />
        <Stars seed={73} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={ground + H * 0.7} t={t} n={115} o={0.85} />
        <Glow x={sunX} y={sunY} r={190 * u} kind={glowKind(gMode)} o={0.45} />
        <Rays x={sunX} y={sunY} t={t} len={850 * u} n={12} o={0.1} color={gMode === 'gold' ? '#FFE4AD' : '#BAEFFF'} />
        <circle cx={sunX} cy={sunY} r={5.5 * u} fill="#FFFFFF" />
        {/* Far icy mountain silhouette */}
        <path
          d={`M -900 ${ground} L -480 ${ground - 120 * u} L -120 ${ground - 55 * u} L 260 ${ground - 140 * u} L 620 ${ground - 70 * u} L 1040 ${ground - 125 * u} L 1460 ${ground - 60 * u} L 1920 ${ground - 135 * u} L 2600 ${ground} Z`}
          fill="#101830"
          stroke="#080B16"
          strokeWidth={4}
        />
      </g>
    );
  }

  if (layer === 'mid') {
    const boulders = [
      { x: W * 0.13, y: ground + 8 * u, s: 1.05 },
      { x: W * 0.23, y: ground + 22 * u, s: 0.7 },
      { x: W * 0.82, y: ground + 12 * u, s: 1.15 },
      { x: W * 0.91, y: ground + 34 * u, s: 0.75 },
    ];
    return (
      <g>
        {/* Mid low icy ridges (plane 1) */}
        <path
          d={`M -900 ${ground} Q ${W * 0.18} ${ground - 68 * u} ${W * 0.48} ${ground - 14 * u} T ${W * 1.15} ${ground - 40 * u} L ${W + 900} ${ground} Z`}
          fill="#1B2542"
          stroke="#0C1020"
          strokeWidth={4}
        />
        <path
          d={`M -300 ${ground - 16 * u} Q ${W * 0.18} ${ground - 68 * u} ${W * 0.48} ${ground - 14 * u}`}
          fill="none"
          stroke={rimCol}
          strokeWidth={3}
          opacity={0.4}
        />
        {/* Rounded grey-blue icy plain (plane 2 & 3) */}
        <GroundPlane y={ground} fill="#253252" rim={gMode === 'gold' ? '#F7D28B' : '#A9DCFF'} />
        {/* Faint ice cracks on the ground */}
        <g stroke="#5A76A8" strokeWidth={2.5} fill="none" opacity={0.45}>
          <path d={`M ${W * 0.1} ${ground + 38 * u} L ${W * 0.28} ${ground + 56 * u} L ${W * 0.42} ${ground + 45 * u}`} />
          <path d={`M ${W * 0.62} ${ground + 48 * u} L ${W * 0.78} ${ground + 36 * u} L ${W * 0.92} ${ground + 64 * u}`} />
        </g>

        {/* Outlined crystalline ice outcrops on sides (centre & Pip kept clean) */}
        {boulders.map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s * u})`}>
            <ellipse cx={6} cy={10} rx={48} ry={10} fill="#000" opacity={0.35} />
            <polygon points="-42,8 -28,-38 8,-52 38,-22 44,8" fill="#2E3F66" stroke="#0E1222" strokeWidth={4} strokeLinejoin="round" />
            <polygon points="-28,-38 8,-52 14,-8 -14,6" fill="#466094" opacity={0.55} />
            <polyline points="-28,-38 8,-52 38,-22" fill="none" stroke={rimCol} strokeWidth={3} opacity={0.65} />
          </g>
        ))}

        {/* Animated frost sparkles */}
        {Array.from({ length: 34 }).map((_, i) => {
          const fx = -100 + rnd(51, i) * (W + 200);
          const fy = ground + 10 * u + rnd(52, i) * 140 * u;
          const tw = Math.pow(0.5 + 0.5 * Math.sin(t / (6 + (i % 5)) + i * 1.9 + spT * 4), 2);
          const sz = (3 + rnd(53, i) * 7) * frostAmt * tw * u;
          return (
            <g key={i} transform={`translate(${fx} ${fy})`} opacity={0.25 + 0.75 * frostAmt * tw}>
              <path d={`M ${-sz} 0 L 0 ${-sz * 0.25} L ${sz} 0 L 0 ${sz * 0.25} Z M 0 ${-sz} L ${sz * 0.25} 0 L 0 ${sz} L ${-sz * 0.25} 0 Z`} fill={i % 3 ? '#E6F5FF' : rimCol} />
            </g>
          );
        })}

        <LightVeil id={`${id}veil`} lights={[[W * 0.5, ground - 130 * u, 480 * u], [sunX, sunY, 340 * u]]} o={0.42} />
        <Dust t={t} seed={59} x0={-100} y0={ground - 260 * u} w={W + 200} h={340 * u} n={34} o={0.48} />
      </g>
    );
  }

  return (
    <g>
      <polygon points={`-180,${H + 100} -180,${ground - 12 * u} 130,${ground + 56 * u} 230,${H + 100}`} fill="#0A0D1C" stroke="#04060E" strokeWidth={4} />
      <polygon points={`${W + 180},${H + 100} ${W + 180},${ground - 15 * u} ${W - 120},${ground + 58 * u} ${W - 240},${H + 100}`} fill="#0A0D1C" stroke="#04060E" strokeWidth={4} />
      <Dust t={t * 1.3} seed={63} x0={0} y0={ground - 100 * u} w={W} h={240 * u} n={16} o={0.5} />
    </g>
  );
};

// ============================================================================ 3. JOURNEY
export const JourneySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.6);
  const spMark = num(sp, 'mark', 0);
  const gMode = str(sp, 'glow', 'cyan');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const sunX = W * 0.16;
  const cy = vert ? H * 0.49 : H * 0.41;
  const pathProg = lerp(Math.max(0.12, spT - 0.35), spT, easeInOut(p));
  const pathCol = gMode === 'gold' ? PALETTE.gold : PALETTE.cyan;

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={108} n={110} gx={sunX} gy={cy} gr={220 * u} gMode="gold" rayLen={900 * u} rayO={0.08} rayColor="#FFE5B0" />;
  }

  if (layer === 'mid') {
    const orbits = [
      { r: 95, col: '#4AA8FF', label: 'EARTH' },
      { r: 205, col: '#F29A4E', label: 'JUPITER' },
      { r: 305, col: '#F2CC6B', label: 'SATURN' },
      { r: 410, col: '#48D1CC', label: 'URANUS' },
      { r: 525, col: '#559EFF', label: 'NEPTUNE' },
    ];
    const rxScale = vert ? 0.86 * u : 1.15 * u;
    const ryScale = vert ? 0.56 * u : 0.62 * u;

    // Cubic bezier path from Earth out to Kuiper band
    const p0x = sunX + 95 * rxScale;
    const p0y = cy;
    const c1x = sunX + 260 * rxScale;
    const c1y = cy - 115 * u;
    const c2x = sunX + 490 * rxScale;
    const c2y = cy - 45 * u;
    const p1x = sunX + 665 * rxScale;
    const p1y = cy + 8 * u;

    const bez = (s: number): [number, number] => {
      const m = 1 - s;
      return [
        m * m * m * p0x + 3 * m * m * s * c1x + 3 * m * s * s * c2x + s * s * s * p1x,
        m * m * m * p0y + 3 * m * m * s * c1y + 3 * m * s * s * c2y + s * s * s * p1y,
      ];
    };
    const [prx, pry] = bez(pathProg);
    const markPop = spMark > 0.5 ? backOut(clamp((p - 0.15) / 0.25)) : 0;
    const pulse = 0.5 + 0.5 * Math.sin(t / 6);

    return (
      <g>
        <GroundPlane y={ground} fill="#10152B" rim="#6A85BC" />

        {/* Kuiper Belt dotted donut band beyond Neptune */}
        {Array.from({ length: 170 }).map((_, i) => {
          const ang = (rnd(115, i) - 0.5) * 1.15;
          const rr = (580 + rnd(116, i) * 155);
          const bx = sunX + Math.cos(ang) * rr * rxScale;
          const by = cy + Math.sin(ang) * rr * ryScale;
          const tw = 0.55 + 0.45 * Math.sin(t / 10 + i);
          return <circle key={i} cx={bx} cy={by} r={(1.4 + rnd(117, i) * 2.6) * u} fill={i % 4 === 0 ? PALETTE.cyan : '#D2E2FF'} opacity={0.72 * tw} />;
        })}

        {/* Sun at left + expanding planetary orbit arcs */}
        <Glow x={sunX} y={cy} r={84 * u} kind="warm" o={0.75} />
        <circle cx={sunX} cy={cy} r={26 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={4} />
        {orbits.map((o, i) => {
          const ang = -0.35 + i * 0.22 + Math.sin(t / 55 + i) * 0.08;
          const px = sunX + Math.cos(ang) * o.r * rxScale;
          const py = cy + Math.sin(ang) * o.r * ryScale;
          return (
            <g key={o.label}>
              <ellipse cx={sunX} cy={cy} rx={o.r * rxScale} ry={o.r * ryScale} fill="none" stroke={o.col} strokeWidth={2.2} opacity={0.45} />
              <circle cx={px} cy={py} r={(6 + (i === 1 ? 5 : 1)) * u} fill={o.col} stroke="#121019" strokeWidth={3} />
            </g>
          );
        })}

        {/* Glowing dotted trajectory */}
        <path
          d={`M ${p0x} ${p0y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1x} ${p1y}`}
          fill="none"
          stroke={pathCol}
          strokeWidth={5}
          strokeDasharray="10 12"
          strokeDashoffset={-t * 1.5}
          opacity={0.32}
        />
        <path
          d={`M ${p0x} ${p0y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1x} ${p1y}`}
          fill="none"
          stroke={pathCol}
          strokeWidth={5}
          strokeDasharray="900"
          strokeDashoffset={900 * (1 - pathProg)}
        />

        {/* Traveling probe dot */}
        <Glow x={prx} y={pry} r={46 * u} kind={glowKind(gMode)} o={0.75} />
        <circle cx={prx} cy={pry} r={(10 + 4 * pulse) * u} fill="none" stroke={pathCol} strokeWidth={2.5} opacity={0.7} />
        <circle cx={prx} cy={pry} r={7.5 * u} fill="#FFFFFF" stroke="#121019" strokeWidth={3.5} />

        {/* Destination cream ring + tag */}
        {markPop > 0.01 ? (
          <g transform={`translate(${p1x} ${p1y}) scale(${markPop})`}>
            <circle cx={0} cy={0} r={(26 + 5 * pulse) * u} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} opacity={0.9} />
            <WorldTag x={0} y={-48 * u} text="KUIPER BELT" color={PALETTE.cream} s={0.95} />
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[sunX + 260 * rxScale, cy, 520 * u], [prx, pry, 240 * u]]} o={0.38} />
        <Dust t={t} seed={121} x0={-100} y0={cy - 250 * u} w={W + 200} h={500 * u} n={26} o={0.35} />
      </g>
    );
  }

  return (
    <g>
      <circle cx={W * 0.04} cy={ground + 50 * u} r={46 * u} fill="#090C18" opacity={0.7} filter="url(#blur6)" />
      <Dust t={t * 1.4} seed={128} x0={0} y0={cy - 200 * u} w={W} h={420 * u} n={12} o={0.45} />
    </g>
  );
};

// ============================================================================ 4. DELAY
export const DelaySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.5);
  const spBack = num(sp, 'back', 0);
  const spClock = num(sp, 'clock', 0);
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cy = vert ? H * 0.49 : H * 0.42;
  const xL = W * 0.17;
  const xR = W * 0.83;
  const beamX0 = xL + 84 * u;
  const beamX1 = xR - 72 * u;

  const fwd = lerp(Math.max(0.08, spT - 0.35), spT, easeInOut(p));
  const ret = spBack > 0 ? lerp(Math.max(0, spBack - 0.35), spBack, easeInOut(p)) : 0;
  const pulseX = lerp(beamX0, beamX1, fwd);
  const retX = lerp(beamX1, beamX0, ret);
  const loopX = lerp(beamX0, beamX1, ((t * 0.015) % 1));

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <Stars seed={144} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.2} t={t} n={105} o={0.85} />
        <Glow x={xL} y={cy} r={190 * u} kind="cool" o={0.35} />
        <Glow x={xR} y={cy} r={160 * u} kind={spBack > 0 ? 'warm' : 'cool'} o={0.3} />
      </g>
    );
  }

  if (layer === 'mid') {
    const clkPop = spClock > 0.5 ? backOut(clamp((p - 0.05) / 0.25)) : 0;
    const handAngle = ((spBack > 0 ? lerp(6, 12, ret) : lerp(0, 6, fwd)) / 12) * 360;
    const waveR = 24 + (t % 24) * 1.5;

    return (
      <g>
        <GroundPlane y={ground} fill="#10162B" rim="#5D89C4" />

        {/* Signal beam track */}
        <line x1={beamX0} y1={cy} x2={beamX1} y2={cy} stroke="#23375E" strokeWidth={6} strokeLinecap="round" />
        <line x1={beamX0} y1={cy} x2={pulseX} y2={cy} stroke={PALETTE.cyan} strokeWidth={4.5} strokeDasharray="10 8" strokeDashoffset={-t * 1.4} />
        {spBack > 0 ? (
          <line x1={beamX1} y1={cy + 22 * u} x2={retX} y2={cy + 22 * u} stroke={PALETTE.gold} strokeWidth={4.5} strokeDasharray="10 8" strokeDashoffset={t * 1.4} />
        ) : null}

        {/* Ambient continuous ping on line */}
        <circle cx={loopX} cy={cy} r={4.5 * u} fill={PALETTE.cyan} opacity={0.55} />

        {/* Forward cyan pulse */}
        <Glow x={pulseX} y={cy} r={52 * u} kind="cool" o={0.8} />
        <circle cx={pulseX} cy={cy} r={11 * u} fill={PALETTE.cyan} stroke="#121019" strokeWidth={3.5} />
        <circle cx={pulseX} cy={cy} r={5 * u} fill="#FFFFFF" />

        {/* Return gold pulse */}
        {spBack > 0 ? (
          <g>
            <Glow x={retX} y={cy + 22 * u} r={52 * u} kind="warm" o={0.85} />
            <circle cx={retX} cy={cy + 22 * u} r={11 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={3.5} />
            <circle cx={retX} cy={cy + 22 * u} r={5 * u} fill="#FFFFFF" />
          </g>
        ) : null}

        {/* Left: Earth + Deep Space Network Dish */}
        <g transform={`translate(${xL} ${cy}) scale(${u})`}>
          <circle cx={0} cy={0} r={52} fill="#2A75C4" stroke="#121019" strokeWidth={4} />
          <path d="M -22 -24 Q -6 -10 -18 14 Q -4 26 14 10 Q 26 -8 8 -28 Z" fill="#46B37E" opacity={0.9} />
          <path d="M 38 -20 A 26 26 0 0 1 38 20" fill="none" stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" />
          <line x1={46} y1={0} x2={60} y2={0} stroke={PALETTE.cream} strokeWidth={3.5} />
          <circle cx={62} cy={0} r={4} fill={PALETTE.cyan} />
          <circle cx={62} cy={0} r={waveR} fill="none" stroke={PALETTE.cyan} strokeWidth={2} opacity={Math.max(0, 1 - (t % 24) / 24) * 0.6} />
          <WorldTag x={0} y={80} text="EARTH" color={PALETTE.cyan} s={0.85} />
        </g>

        {/* Right: Kuiper Belt Probe */}
        <g transform={`translate(${xR} ${cy}) scale(${u})`}>
          <rect x={-16} y={-52} width={32} height={24} rx={4} fill="#1E2845" stroke="#121019" strokeWidth={4} />
          <rect x={-16} y={28} width={32} height={24} rx={4} fill="#1E2845" stroke="#121019" strokeWidth={4} />
          <rect x={-20} y={-22} width={40} height={44} rx={6} fill={PALETTE.gold} stroke="#121019" strokeWidth={4} />
          <path d="M -26 -16 Q -38 0 -26 16" fill="none" stroke="#DCE4F5" strokeWidth={4} strokeLinecap="round" />
          <WorldTag x={0} y={80} text="4 BN MI" color={PALETTE.gold} s={0.85} />
        </g>

        {/* Optional stopwatch face between them */}
        {clkPop > 0.01 ? (
          <g transform={`translate(${W * 0.44} ${cy - 86 * u}) scale(${clkPop * u})`}>
            <rect x={-10} y={-58} width={20} height={12} rx={4} fill="#353952" stroke="#121019" strokeWidth={3.5} />
            <circle cx={0} cy={0} r={46} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * 34} y1={Math.sin(a) * 34} x2={Math.cos(a) * 40} y2={Math.sin(a) * 40} stroke="#121019" strokeWidth={2.5} />;
            })}
            <line x1={0} y1={0} x2={Math.sin((handAngle * Math.PI) / 180) * 30} y2={-Math.cos((handAngle * Math.PI) / 180) * 30} stroke={spBack > 0 ? PALETTE.orange : '#121019'} strokeWidth={4.5} strokeLinecap="round" />
            <circle cx={0} cy={0} r={5} fill="#121019" />
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[xL, cy, 300 * u], [xR, cy, 280 * u], [pulseX, cy, 260 * u]]} o={0.38} />
        <Dust t={t} seed={151} x0={-100} y0={cy - 220 * u} w={W + 200} h={440 * u} n={24} o={0.32} />
      </g>
    );
  }

  return (
    <g>
      <Dust t={t * 1.4} seed={159} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.4} />
    </g>
  );
};

// ============================================================================ 5. BELT
export const BeltSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.5);
  const spEdge = num(sp, 'edge', 0.4);
  const spScat = num(sp, 'scattered', 0);
  const gMode = str(sp, 'glow', 'cyan');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = vert ? H * 0.51 : H * 0.42;
  const tiltY = 0.44 + 0.04 * Math.sin(t / 42 + spT * 3);
  const edgePop = spEdge > 0.2 ? backOut(clamp((p - 0.1) / 0.25)) * spEdge : 0;

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={177} n={125} o={0.88} gx={cx} gy={cy} gr={260 * u} gMode={gMode} rayLen={780 * u} />;
  }

  if (layer === 'mid') {
    const rxIn = 185 * u;
    const rxOut = 355 * u;
    const neptAng = t * 0.018 + spT * 3;
    return (
      <g>
        <GroundPlane y={ground} fill="#0F1429" rim="#607EB5" />

        {/* Soft donut glow */}
        <ellipse cx={cx} cy={cy} rx={(rxIn + rxOut) * 0.5} ry={(rxIn + rxOut) * 0.5 * tiltY} fill="none" stroke={glowCol(gMode)} strokeWidth={135 * u} opacity={0.08} />

        {/* Scattered disk halo when sp.scattered > 0 */}
        {spScat > 0 ? (
          <g opacity={spScat * easeOut(clamp(p / 0.5))}>
            {Array.from({ length: 95 }).map((_, i) => {
              const ang = rnd(181, i) * Math.PI * 2 + t * 0.002 * (0.5 + rnd(182, i));
              const rr = (375 + rnd(183, i) * 190 * spScat) * u;
              const scy = cy + Math.sin(ang) * rr * (tiltY + 0.14 * (rnd(184, i) - 0.5));
              return <circle key={i} cx={cx + Math.cos(ang) * rr} cy={scy} r={(1.2 + rnd(185, i) * 2.2) * u} fill="#B8CEFF" opacity={0.55} />;
            })}
          </g>
        ) : null}

        {/* Back half & full fuzzy donut of thousands of icy dots (30-50 AU) */}
        {Array.from({ length: 240 }).map((_, i) => {
          const speed = 0.005 + rnd(191, i) * 0.006;
          const ang = rnd(192, i) * Math.PI * 2 + t * speed;
          const rr = lerp(rxIn, rxOut, rnd(193, i));
          const x = cx + Math.cos(ang) * rr;
          const y = cy + Math.sin(ang) * rr * tiltY + (rnd(194, i) - 0.5) * 14 * u;
          const tw = 0.6 + 0.4 * Math.sin(t / 11 + i);
          const col = i % 5 === 0 ? PALETTE.cyan : i % 7 === 0 ? PALETTE.gold : '#DCE6FF';
          return <circle key={i} cx={x} cy={y} r={(1.4 + rnd(195, i) * 2.8) * u} fill={col} opacity={0.82 * tw} />;
        })}

        {/* Sun & inner planet rings + Neptune's blue ring */}
        <Glow x={cx} y={cy} r={60 * u} kind="warm" o={0.75} />
        <circle cx={cx} cy={cy} r={14 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={3.5} />
        {[46, 82, 118].map((r, i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r * u} ry={r * u * tiltY} fill="none" stroke="#6E82B5" strokeWidth={1.8} opacity={0.45} />
        ))}
        <ellipse cx={cx} cy={cy} rx={165 * u} ry={165 * u * tiltY} fill="none" stroke="#4AA8FF" strokeWidth={3.5} opacity={0.9} />
        <circle cx={cx + Math.cos(neptAng) * 165 * u} cy={cy + Math.sin(neptAng) * 165 * u * tiltY} r={8.5 * u} fill="#4AA8FF" stroke="#121019" strokeWidth={3} />

        {/* Cream distance ticks 30 AU & 50 AU */}
        {edgePop > 0.01 ? (
          <g opacity={clamp(edgePop)}>
            <line x1={cx + rxIn} y1={cy} x2={cx + rxIn} y2={cy - 92 * u} stroke={PALETTE.cream} strokeWidth={2.5} strokeDasharray="4 4" />
            <WorldTag x={cx + rxIn} y={cy - 106 * u} text="30 AU" color={PALETTE.cream} s={0.82 * clamp(edgePop)} />
            <line x1={cx + rxOut} y1={cy} x2={cx + rxOut} y2={cy + 90 * u} stroke={PALETTE.gold} strokeWidth={2.5} strokeDasharray="4 4" />
            <WorldTag x={cx + rxOut} y={cy + 106 * u} text="50 AU" color={PALETTE.gold} s={0.82 * clamp(edgePop)} />
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[cx, cy, 480 * u]]} o={0.36} />
        <Dust t={t} seed={199} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={26} o={0.35} />
      </g>
    );
  }

  return (
    <g>
      <circle cx={W * 0.05} cy={ground + 24 * u} r={34 * u} fill="#090D1C" stroke="#04060D" strokeWidth={4} />
      <circle cx={W * 0.95} cy={ground + 30 * u} r={42 * u} fill="#090D1C" stroke="#04060D" strokeWidth={4} />
      <Dust t={t * 1.4} seed={203} x0={0} y0={cy - 200 * u} w={W} h={420 * u} n={14} o={0.45} />
    </g>
  );
};

// ============================================================================ 6. RESONANCE
export const ResonanceSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.7);
  const spCount = num(sp, 'count', 2);
  const gMode = str(sp, 'glow', 'cyan');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = vert ? H * 0.51 : H * 0.42;

  // 2:3 resonance: Pluto completes 2 laps while Neptune completes 3 laps
  const phase = lerp(Math.max(0, spT - 0.3), spT, easeInOut(p)) * Math.PI * 4 + t * 0.022;
  const nAng = phase * 1.5;
  const pAng = phase * 1.0;

  const urRx = 148 * u;
  const urRy = 86 * u;
  const nepRx = 228 * u;
  const nepRy = 134 * u;
  const plRx = 300 * u;
  const plRy = 130 * u;
  const plOffX = 62 * u;

  const nepX = cx + Math.cos(nAng) * nepRx;
  const nepY = cy + Math.sin(nAng) * nepRy;
  const rawPx = Math.cos(pAng) * plRx + plOffX;
  const rawPy = Math.sin(pAng) * plRy;
  const rot = -0.18;
  const plX = cx + rawPx * Math.cos(rot) - rawPy * Math.sin(rot);
  const plY = cy + rawPx * Math.sin(rot) + rawPy * Math.cos(rot);
  const urX = cx + Math.cos(nAng * 2.1 + 1.2) * urRx;
  const urY = cy + Math.sin(nAng * 2.1 + 1.2) * urRy;

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={233} n={115} gx={cx} gy={cy} gr={240 * u} gMode={gMode} rayLen={720 * u} />;
  }

  if (layer === 'mid') {
    const tickCount = Math.round(spCount);
    return (
      <g>
        <GroundPlane y={ground} fill="#10152B" rim="#6A89C4" />

        {/* Uranus inner teal ring */}
        <ellipse cx={cx} cy={cy} rx={urRx} ry={urRy} fill="none" stroke="#48D1CC" strokeWidth={2.5} opacity={0.45} />
        <circle cx={urX} cy={urY} r={8 * u} fill="#48D1CC" stroke="#121019" strokeWidth={3} />

        {/* Neptune round blue orbit */}
        <ellipse cx={cx} cy={cy} rx={nepRx} ry={nepRy} fill="none" stroke="#4AA8FF" strokeWidth={4} opacity={0.85} />

        {/* Pluto inclined oval orbit crossing Neptune's */}
        <g transform={`translate(${cx} ${cy}) rotate(${(rot * 180) / Math.PI})`}>
          <ellipse cx={plOffX} cy={0} rx={plRx} ry={plRy} fill="none" stroke="#C5CFE6" strokeWidth={3.5} strokeDasharray="10 7" opacity={0.85} />
        </g>

        {/* Sun */}
        <Glow x={cx} y={cy} r={62 * u} kind="warm" o={0.8} />
        <circle cx={cx} cy={cy} r={16 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={3.5} />

        {/* Neptune & Pluto beads with glow */}
        <Glow x={nepX} y={nepY} r={42 * u} kind="cool" o={0.75} />
        <circle cx={nepX} cy={nepY} r={13 * u} fill="#4AA8FF" stroke="#121019" strokeWidth={4} />
        <WorldTag x={nepX} y={nepY - 28 * u} text="NEPTUNE" color={PALETTE.cyan} s={0.75} />

        <Glow x={plX} y={plY} r={34 * u} kind="warm" o={0.55} />
        <circle cx={plX} cy={plY} r={10 * u} fill="#D8DFEF" stroke="#121019" strokeWidth={4} />
        <WorldTag x={plX} y={plY + 28 * u} text="PLUTO" color={PALETTE.cream} s={0.75} />

        {/* Lap counter ticks */}
        {tickCount > 0 ? (
          <g transform={`translate(${cx - 290 * u} ${cy - 145 * u})`}>
            {[1, 2, 3].map((k) => {
              const on = k <= tickCount;
              const s = on ? backOut(clamp((p - k * 0.08) / 0.2)) : 0.7;
              return (
                <g key={k} transform={`translate(${(k - 1) * 44 * u} 0) scale(${s})`}>
                  <circle cx={0} cy={0} r={14 * u} fill={on ? PALETTE.cyan : '#1A2038'} stroke="#121019" strokeWidth={3.5} />
                  <text y={6 * u} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16 * u} fontWeight={700} fill={on ? PALETTE.pill : PALETTE.cream}>
                    {k}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[cx, cy, 460 * u], [nepX, nepY, 180 * u], [plX, plY, 180 * u]]} o={0.36} />
        <Dust t={t} seed={241} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={24} o={0.35} />
      </g>
    );
  }

  return (
    <g>
      <Dust t={t * 1.3} seed={247} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.42} />
    </g>
  );
};

// ============================================================================ 7. MIGRATE
export const MigrateSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.5);
  const spFling = num(sp, 'fling', 0.3);
  const gMode = str(sp, 'glow', 'cyan');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cy = vert ? H * 0.5 : H * 0.41;

  const prog = lerp(Math.max(0.05, spT - 0.25), spT, easeInOut(p));
  const fling = lerp(Math.max(0, spFling - 0.25), spFling, easeInOut(p));

  const sunX = W * 0.11;
  const jupX = lerp(W * 0.25, W * 0.23, prog);
  const satX = lerp(W * 0.36, W * 0.35, prog);
  const uraX = lerp(W * 0.47, W * 0.57, prog);
  const nepX = lerp(W * 0.56, W * 0.72, prog);

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <Stars seed={271} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.2} t={t} n={115} o={0.85} />
        <Glow x={sunX} y={cy} r={220 * u} kind="warm" o={0.45} />
        <Glow x={nepX} y={cy} r={210 * u} kind={glowKind(gMode)} o={0.32} />
        <Rays x={sunX} y={cy} t={t} len={860 * u} n={10} o={0.07} color="#FFE4AD" />
      </g>
    );
  }

  if (layer === 'mid') {
    return (
      <g>
        <GroundPlane y={ground} fill="#111428" rim="#6A7BB0" />

        {/* Orbital lanes */}
        {[jupX, satX, uraX, nepX].map((px, i) => (
          <path key={i} d={`M ${px} ${cy - 170 * u} Q ${px + 30 * u} ${cy} ${px} ${cy + 170 * u}`} fill="none" stroke="#36436B" strokeWidth={2.5} strokeDasharray="6 8" opacity={0.5} />
        ))}

        {/* Countless icy specks: originally dense in 0.54W..0.85W, flung in curved trails as fling increases */}
        {Array.from({ length: 190 }).map((_, i) => {
          const baseX = lerp(W * 0.52, W * 0.87, rnd(281, i));
          const baseY = cy + (rnd(282, i) - 0.5) * 230 * u;
          const isFlung = rnd(283, i) < fling * 0.86;
          const dir = rnd(284, i) > 0.3 ? 1 : -1;
          const travel = ((t * 0.012 + rnd(285, i)) % 1);
          const sx = isFlung
            ? baseX + dir * (130 + rnd(286, i) * 260) * u * fling * (0.4 + 0.6 * travel)
            : baseX + Math.sin(t / 25 + i) * 6 * u;
          const sy = isFlung
            ? baseY + (rnd(287, i) - 0.5) * 340 * u * fling * (0.4 + 0.6 * travel)
            : baseY + Math.cos(t / 28 + i) * 5 * u;
          const op = isFlung ? Math.max(0.18, 0.85 * (1 - travel * 0.65)) : 0.88;
          return (
            <g key={i}>
              {isFlung && i % 4 === 0 ? (
                <path
                  d={`M ${baseX} ${baseY} Q ${(baseX + sx) * 0.5} ${baseY - 45 * dir * u} ${sx} ${sy}`}
                  fill="none"
                  stroke={dir > 0 ? PALETTE.cyan : PALETTE.orange}
                  strokeWidth={2}
                  opacity={0.35 * op}
                />
              ) : null}
              <circle cx={sx} cy={sy} r={(1.6 + rnd(288, i) * 2.6) * u} fill={isFlung ? '#98E2FF' : '#E2ECFF'} opacity={op} />
            </g>
          );
        })}

        {/* Gravitational barrier arc when giants act as wall or Neptune stirs */}
        {prog > 0.3 ? (
          <path
            d={`M ${nepX + 26 * u} ${cy - 150 * u} Q ${nepX + 70 * u} ${cy} ${nepX + 26 * u} ${cy + 150 * u}`}
            fill="none"
            stroke={gMode === 'gold' ? PALETTE.gold : PALETTE.cyan}
            strokeWidth={3.5}
            strokeDasharray="8 8"
            opacity={0.55 + 0.25 * Math.sin(t / 7)}
          />
        ) : null}

        {/* Young Sun + 4 Giant Planets */}
        <Glow x={sunX} y={cy} r={85 * u} kind="warm" o={0.8} />
        <circle cx={sunX} cy={cy} r={34 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={4} />

        {/* Jupiter: big orange */}
        <g transform={`translate(${jupX} ${cy}) scale(${u})`}>
          <circle cx={0} cy={0} r={46} fill="#E87D3E" stroke="#121019" strokeWidth={4} />
          <path d="M -42 -12 L 42 -12 M -44 6 L 44 6 M -36 22 L 36 22" stroke="#F8D2A2" strokeWidth={5} opacity={0.6} />
        </g>

        {/* Saturn: pale gold with tilted ring */}
        <g transform={`translate(${satX} ${cy - 14 * u}) scale(${u})`}>
          <ellipse cx={0} cy={0} rx={58} ry={16} transform="rotate(-14)" fill="none" stroke="#FCE09B" strokeWidth={8} opacity={0.85} />
          <circle cx={0} cy={0} r={34} fill="#F2CC74" stroke="#121019" strokeWidth={4} />
        </g>

        {/* Uranus: teal */}
        <g transform={`translate(${uraX} ${cy + 12 * u}) scale(${u})`}>
          <circle cx={0} cy={0} r={24} fill="#46C7C7" stroke="#121019" strokeWidth={4} />
        </g>

        {/* Neptune: blue */}
        <g transform={`translate(${nepX} ${cy - 8 * u}) scale(${u})`}>
          <Glow x={0} y={0} r={55} kind="cool" o={0.55} />
          <circle cx={0} cy={0} r={25} fill="#448BFF" stroke="#121019" strokeWidth={4} />
        </g>

        <LightVeil id={`${id}veil`} lights={[[sunX, cy, 340 * u], [nepX, cy, 420 * u]]} o={0.36} />
        <Dust t={t} seed={293} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={26} o={0.35} />
      </g>
    );
  }

  return (
    <g>
      <polygon points={`-160,${H + 100} -160,${ground - 10 * u} 110,${ground + 52 * u} 200,${H + 100}`} fill="#090B17" stroke="#04050B" strokeWidth={4} />
      <Dust t={t * 1.5} seed={297} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={14} o={0.48} />
    </g>
  );
};

export const SETS_A = {
  skyview: SkyviewSet,
  surface: SurfaceSet,
  journey: JourneySet,
  delay: DelaySet,
  belt: BeltSet,
  resonance: ResonanceSet,
  migrate: MigrateSet,
};
