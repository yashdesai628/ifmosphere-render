import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, rnd } from '../../engine/anim';
import { Stars, Rays } from '../../engine/kit';
import { Glow, Dust, Cone, LightVeil, WallTexture, RoomCorners } from '../../engine/light';
import type { SetProps } from './render';
import {
  OUT,
  numParam,
  glowTone,
  toneColor,
  glowKind,
  rayColor,
  mixHex,
  SpaceGridBg,
  StageFloor,
  EdgeSilhouettes,
  OrbiterGraphic,
  MarsDisc,
} from './sets-shared';

/** Mars surface set: butterscotch-to-dusty-pink sky, pale Sun, rust plain, wheel tracks, rocks and dust. */
export const MarsfieldSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const dark = clamp(numParam(sp.dark, 0));
  const dustAmt = clamp(numParam(sp.dust, 0));
  const st = clamp(numParam(sp.t, 0.3));
  const gTone = glowTone(sp.glow, 'gold');
  const vert = H > W;
  const horizonY = ground - (vert ? 0.045 * H : 0.055 * H);

  if (layer === 'far') {
    const sunX = vert ? W * 0.80 : W * (0.17 + st * 0.08);
    const sunY = vert ? H * (0.21 + dark * 0.04) : H * (0.28 + dark * 0.09);
    const mesaShift = (st - 0.5) * -45;
    const skyTop = mixHex('#4D2C32', '#090818', dark);
    const skyMid = mixHex('#B66444', '#221534', dark);
    const skyHor = mixHex('#EB9E80', '#4A2741', dark);
    const mesaFill = mixHex('#7E3629', '#251526', dark);
    const mesaRim = mixHex('#F5A872', '#8B5972', dark);

    return (
      <g>
        <defs>
          <linearGradient id={`${id}sky`} x1="0" y1={-600} x2="0" y2={horizonY + 80} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="56%" stopColor={skyMid} />
            <stop offset="100%" stopColor={skyHor} />
          </linearGradient>
          <linearGradient id={`${id}haze`} x1="0" y1={horizonY - 120} x2="0" y2={horizonY + 80} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skyHor} stopOpacity={0} />
            <stop offset="60%" stopColor={skyHor} stopOpacity={0.38 - 0.16 * dark} />
            <stop offset="100%" stopColor={skyHor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={-1400} y={-1500} width={W + 2800} height={H + 3000} fill={`url(#${id}sky)`} />
        {dark > 0.03 ? (
          <Stars seed={73} x0={-900} y0={-900} w={W + 1800} h={horizonY + 900} t={t} n={110} o={easeInOut(dark) * 0.88} />
        ) : null}
        <Glow x={sunX} y={sunY} r={240} kind={glowKind(gTone)} o={0.48 - 0.2 * dark} />
        <Rays x={sunX} y={sunY} t={t} o={0.11 * (1 - 0.45 * dark)} color={rayColor(gTone)} len={Math.max(W, H) * 1.1} />
        <circle cx={sunX} cy={sunY} r={vert ? 32 : 38} fill="#F3F7FF" opacity={0.95 - 0.45 * dark} />

        {/* Distant layered mesas */}
        <g transform={`translate(${mesaShift} 0)`}>
          <path
            d={`M -1200 ${horizonY + 20} L -850 ${horizonY - 140} L -480 ${horizonY - 140} L -320 ${horizonY - 35} L 60 ${horizonY - 40} L 230 ${horizonY - 165} L 540 ${horizonY - 165} L 690 ${horizonY - 45} L 1060 ${horizonY - 60} L 1260 ${horizonY - 150} L 1600 ${horizonY - 150} L 1760 ${horizonY - 30} L ${W + 1200} ${horizonY + 20} Z`}
            fill={mesaFill}
          />
          <path
            d={`M -850 ${horizonY - 140} L -480 ${horizonY - 140} M 230 ${horizonY - 165} L 540 ${horizonY - 165} M 1260 ${horizonY - 150} L 1600 ${horizonY - 150}`}
            stroke={mesaRim}
            strokeWidth={3.5}
            opacity={0.58 - 0.22 * dark}
          />
        </g>
        <rect x={-1400} y={horizonY - 120} width={W + 2800} height={200} fill={`url(#${id}haze)`} />
      </g>
    );
  }

  if (layer === 'mid') {
    const ridgeFill = mixHex('#5F241D', '#24131E', dark);
    const ridgeRim = mixHex('#E89468', '#7C4B5C', dark);
    const plainFill = mixHex('#8A3927', '#331922', dark);
    const plainBand1 = mixHex('#772F20', '#29141C', dark);
    const plainBand2 = mixHex('#66261A', '#201017', dark);
    const plainRim = mixHex('#F5A872', '#945E6E', dark);
    const rockFill = mixHex('#5E231B', '#28131A', dark);
    const rockHi = mixHex('#B45A3D', '#522C38', dark);

    const trackStartX = W * 0.08;
    const trackEndX = W * 0.64;
    const trackEndY = horizonY + 14;
    const rocks = [
      { x: W * 0.11, y: ground + 22, s: 1.05 },
      { x: W * 0.19, y: horizonY + 34, s: 0.72 },
      { x: W * 0.83, y: horizonY + 38, s: 0.78 },
      { x: W * 0.90, y: ground + 28, s: 1.12 },
    ];

    return (
      <g>
        {/* Mid-plane canyon ridge */}
        <path
          d={`M -1200 ${horizonY + 18} L -620 ${horizonY - 46} L -260 ${horizonY - 18} L 140 ${horizonY - 52} L 490 ${horizonY - 20} L 940 ${horizonY - 48} L 1380 ${horizonY - 14} L ${W + 1200} ${horizonY + 18} Z`}
          fill={ridgeFill}
        />
        <path
          d={`M -1200 ${horizonY + 18} L -620 ${horizonY - 46} L -260 ${horizonY - 18} L 140 ${horizonY - 52} L 490 ${horizonY - 20} L 940 ${horizonY - 48} L 1380 ${horizonY - 14} L ${W + 1200} ${horizonY + 18}`}
          fill="none"
          stroke={ridgeRim}
          strokeWidth={3.5}
          opacity={0.48 - 0.18 * dark}
        />

        {/* Rust-orange plain with layered tonal strata */}
        <rect x={-1400} y={horizonY} width={W + 2800} height={H + 1600} fill={plainFill} />
        <path
          d={`M -1400 ${ground - 8} Q ${W * 0.35} ${ground - 24} ${W * 0.68} ${ground - 4} T ${W + 1400} ${ground - 12} L ${W + 1400} ${H + 1600} L -1400 ${H + 1600} Z`}
          fill={plainBand1}
        />
        <path
          d={`M -1400 ${ground + 58} Q ${W * 0.45} ${ground + 38} ${W + 1400} ${ground + 64} L ${W + 1400} ${H + 1600} L -1400 ${H + 1600} Z`}
          fill={plainBand2}
        />
        <line x1={-1400} y1={horizonY} x2={W + 1400} y2={horizonY} stroke={plainRim} strokeWidth={3.5} opacity={0.62 - 0.2 * dark} />

        {/* Faint curved rover wheel tracks */}
        <g stroke="#3F1814" strokeWidth={5} strokeDasharray="10 8" fill="none" opacity={0.42 + 0.1 * st}>
          <path d={`M ${trackStartX} ${ground + 95} Q ${W * 0.34} ${ground - 8} ${trackEndX - 18} ${trackEndY}`} />
          <path d={`M ${trackStartX + 46} ${ground + 108} Q ${W * 0.37} ${ground + 4} ${trackEndX + 18} ${trackEndY + 4}`} />
        </g>

        {/* Outlined rocks along outer flanks */}
        {rocks.map((rk, i) => (
          <g key={i} transform={`translate(${rk.x} ${rk.y}) scale(${rk.s})`}>
            <ellipse cx={4} cy={14} rx={36} ry={10} fill="#080408" opacity={0.42} />
            <polygon points="-34,12 -22,-18 10,-22 32,-4 36,12" fill={rockFill} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
            <polygon points="-22,-18 10,-22 18,-6 -8,-4" fill={rockHi} opacity={0.55} />
          </g>
        ))}

        {/* Ambient coloured rim glow around rover/horizon */}
        <Glow x={W * 0.64} y={H * 0.54} r={340} kind={glowKind(gTone)} o={0.22 + 0.08 * Math.sin(t * 0.1)} />

        {/* Swirling wind dust streaks when sp.dust > 0 */}
        {dustAmt > 0.05 ? (
          <g opacity={dustAmt * 0.45}>
            {Array.from({ length: 7 }).map((_, i) => {
              const wy = horizonY + 18 + i * ((ground - horizonY + 80) / 7);
              const wx = (((t * (5 + i * 1.1) + i * 320) % (W + 700)) - 350);
              return (
                <path
                  key={i}
                  d={`M ${wx} ${wy} Q ${wx + 120} ${wy - 14} ${wx + 240} ${wy}`}
                  fill="none"
                  stroke="#F4B684"
                  strokeWidth={4 + (i % 3) * 2}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ) : null}

        <Dust t={t} seed={109} x0={-100} y0={horizonY - 120} w={W + 200} h={ground - horizonY + 260} n={36 + Math.round(dustAmt * 38)} o={0.48 + 0.25 * dustAmt} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [W * 0.5, ground - 150, W * 0.44],
            [W * 0.64, H * 0.53, 340],
          ]}
          o={0.24 + dark * 0.36}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} color="#140B0E" />;
};

/** Mission Control Room: wall of big dark screens & world map, two rows of desks, chair silhouettes. */
export const MccSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.5));
  const alert = clamp(numParam(sp.alert, 0));
  const calm = clamp(numParam(sp.calm, 0));
  const vert = H > W;

  const amberMix = clamp(alert * (1 - calm * 0.85));
  const baseScr = mixHex('#3AB8FF', '#FFB84D', amberMix);
  const scrCol = mixHex(baseScr, '#3CD084', calm);
  const glowType = amberMix > 0.35 && calm < 0.5 ? 'warm' : 'cool';
  const pulse = 0.65 + 0.35 * Math.sin(t * (0.11 + 0.15 * alert));

  if (layer === 'far') {
    const sy = vert ? H * 0.38 : H * 0.26;
    const sh = vert ? H * 0.16 : H * 0.29;
    const sx0 = W * 0.08;
    const sw = W * 0.84;
    const sideW = sw * 0.25;
    const midW = sw * 0.44;
    const gap = sw * 0.03;
    const mapX = sx0 + sideW + gap;
    const rightX = mapX + midW + gap;
    const zoomPush = 1 + st * 0.04;

    return (
      <g>
        <rect x={-1400} y={-1500} width={W + 2800} height={H + 3000} fill="#0C1020" />
        <WallTexture rect={[-1400, -1500, W + 2800, H + 3000]} />
        <RoomCorners x0={-600} x1={W + 600} y0={-600} y1={ground} />

        {/* Overhead trusses & light cones */}
        <rect x={-800} y={-400} width={W + 1600} height={vert ? H * 0.22 : 110} fill="#090B17" stroke={OUT} strokeWidth={4} />
        <Cone d={`M ${W * 0.28} 80 L ${W * 0.34} 80 L ${W * 0.52} ${ground} L ${W * 0.14} ${ground} Z`} o={0.14} />
        <Cone d={`M ${W * 0.66} 80 L ${W * 0.72} 80 L ${W * 0.88} ${ground} L ${W * 0.50} ${ground} Z`} o={0.14} />

        {/* Screen bank with push-in factor from sp.t */}
        <g transform={`translate(${W * 0.5} ${sy + sh * 0.5}) scale(${zoomPush}) translate(${-W * 0.5} ${-(sy + sh * 0.5)})`}>
          <Glow x={W * 0.5} y={sy + sh * 0.5} r={sw * 0.55} kind={glowType} o={0.32 * pulse} />

          {/* Left screen: scrolling chart traces */}
          <rect x={sx0} y={sy} width={sideW} height={sh} rx={8} fill="#10182E" stroke={OUT} strokeWidth={4} />
          <g stroke={scrCol} strokeWidth={2.5} fill="none" opacity={0.85}>
            <polyline
              points={Array.from({ length: 12 })
                .map((_, i) => {
                  const px = sx0 + 18 + (i / 11) * (sideW - 36);
                  const py = sy + sh * 0.38 + Math.sin(i * 0.9 + t * 0.12) * (sh * 0.14);
                  return `${px},${py}`;
                })
                .join(' ')}
            />
          </g>
          {Array.from({ length: 6 }).map((_, i) => {
            const bw = (sideW - 56) / 6;
            const bh = (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.14 + i * 1.1))) * (sh * 0.26);
            return (
              <rect
                key={i}
                x={sx0 + 18 + i * (bw + 4)}
                y={sy + sh * 0.86 - bh}
                width={bw}
                height={bh}
                rx={2}
                fill={scrCol}
                opacity={0.72}
              />
            );
          })}

          {/* Center big world map screen */}
          <rect x={mapX} y={sy} width={midW} height={sh} rx={10} fill="#0F172D" stroke={OUT} strokeWidth={4} />
          <g fill="#21355E" opacity={0.85}>
            <path d={`M ${mapX + midW * 0.12} ${sy + sh * 0.24} L ${mapX + midW * 0.28} ${sy + sh * 0.22} L ${mapX + midW * 0.30} ${sy + sh * 0.45} L ${mapX + midW * 0.22} ${sy + sh * 0.72} L ${mapX + midW * 0.16} ${sy + sh * 0.44} Z`} />
            <path d={`M ${mapX + midW * 0.44} ${sy + sh * 0.20} L ${mapX + midW * 0.82} ${sy + sh * 0.22} L ${mapX + midW * 0.86} ${sy + sh * 0.46} L ${mapX + midW * 0.68} ${sy + sh * 0.54} L ${mapX + midW * 0.54} ${sy + sh * 0.72} L ${mapX + midW * 0.43} ${sy + sh * 0.44} Z`} />
            <path d={`M ${mapX + midW * 0.74} ${sy + sh * 0.62} L ${mapX + midW * 0.88} ${sy + sh * 0.62} L ${mapX + midW * 0.86} ${sy + sh * 0.78} L ${mapX + midW * 0.73} ${sy + sh * 0.76} Z`} />
          </g>
          {/* Orbit sine wave across world map */}
          <path
            d={Array.from({ length: 18 })
              .map((_, i) => {
                const px = mapX + 20 + (i / 17) * (midW - 40);
                const py = sy + sh * 0.5 + Math.sin((i / 17) * Math.PI * 2 + t * 0.04) * (sh * 0.24);
                return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
              })
              .join(' ')}
            fill="none"
            stroke={scrCol}
            strokeWidth={3}
            opacity={0.75}
          />
          {[0.21, 0.49, 0.79].map((fx, i) => (
            <g key={i} transform={`translate(${mapX + midW * fx} ${sy + sh * (i === 2 ? 0.68 : 0.34)})`}>
              <circle r={5 + 4 * ((t * 0.04 + i * 0.3) % 1)} fill="none" stroke={scrCol} strokeWidth={2} opacity={0.8} />
              <circle r={4} fill={scrCol} />
            </g>
          ))}

          {/* Right screen: status indicators */}
          <rect x={rightX} y={sy} width={sideW} height={sh} rx={8} fill="#10182E" stroke={OUT} strokeWidth={4} />
          {[0.24, 0.44, 0.64].map((ry, i) => {
            const fillF = 0.45 + 0.45 * Math.sin(t * 0.09 + i * 1.4);
            return (
              <g key={i}>
                <rect x={rightX + 20} y={sy + sh * ry} width={sideW - 40} height={sh * 0.1} rx={4} fill="#182342" />
                <rect x={rightX + 20} y={sy + sh * ry} width={(sideW - 40) * fillF} height={sh * 0.1} rx={4} fill={scrCol} opacity={0.85 * pulse} />
              </g>
            );
          })}
          <circle cx={rightX + sideW - 26} cy={sy + 22} r={7} fill={scrCol} opacity={pulse} />
        </g>
      </g>
    );
  }

  if (layer === 'mid') {
    const deskSides = [W * 0.02, W * 0.78];
    const deskW = W * 0.20;
    const steam = Math.sin(t * 0.12) * 4;

    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#14182B" rim="#5F72A6" />
        {/* Back row console wall behind Pip at waist height */}
        <rect x={W * 0.06} y={ground - (vert ? 110 : 120)} width={W * 0.88} height={vert ? 110 : 120} rx={6} fill="#19203A" stroke={OUT} strokeWidth={4} />
        <line x1={W * 0.06} y1={ground - (vert ? 110 : 120)} x2={W * 0.94} y2={ground - (vert ? 110 : 120)} stroke="#4C5F92" strokeWidth={3} opacity={0.55} />

        {/* Two flanking front desks with laptops, coffee mugs & sticky notes (keeping center open for Pip) */}
        {deskSides.map((dx, i) => (
          <g key={i}>
            <rect x={dx} y={ground - 68} width={deskW} height={68} rx={4} fill="#232B4A" stroke={OUT} strokeWidth={4} />
            {/* Laptop */}
            <polygon points={`${dx + 24},${ground - 68} ${dx + 40},${ground - 114} ${dx + 106},${ground - 114} ${dx + 96},${ground - 68}`} fill="#141A30" stroke={OUT} strokeWidth={3.5} />
            <polygon points={`${dx + 43},${ground - 110} ${dx + 101},${ground - 110} ${dx + 93},${ground - 73} ${dx + 31},${ground - 73}`} fill={scrCol} opacity={0.62 * pulse} />
            {/* Sticky note */}
            <rect x={dx + 114} y={ground - 92} width={22} height={22} rx={2} fill="#F5D265" stroke={OUT} strokeWidth={3} transform={`rotate(${i === 0 ? -7 : 8} ${dx + 125} ${ground - 81})`} />
            {/* Coffee mug with rising steam */}
            <rect x={dx + deskW - 52} y={ground - 96} width={22} height={26} rx={4} fill={PALETTE.cream} stroke={OUT} strokeWidth={3.5} />
            <path d={`M ${dx + deskW - 30} ${ground - 90} A 6 7 0 0 1 ${dx + deskW - 30} ${ground - 76}`} fill="none" stroke={OUT} strokeWidth={3.5} />
            <path d={`M ${dx + deskW - 43} ${ground - 102} Q ${dx + deskW - 47 + steam} ${ground - 116} ${dx + deskW - 41} ${ground - 128}`} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.45} strokeLinecap="round" />
          </g>
        ))}

        <Dust t={t} seed={211} x0={0} y0={H * 0.25} w={W} h={ground - H * 0.2} n={34} o={0.42} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [W * 0.5, ground - 180, W * 0.45],
            [W * 0.5, H * 0.4, W * 0.4],
          ]}
          o={0.34}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} color="#060710" />;
};

/** Heartbeat monitor: big outlined screen with sweeping cyan ECG trace & red missed-beat ticks. */
export const HeartbeatSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.5));
  const missed = clamp(numParam(sp.missed, 0), 0, 25);
  const gTone = glowTone(sp.glow, missed > 0 ? 'red' : 'cyan');
  const vert = H > W;

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={22} raysO={0.14} />;
  }

  if (layer === 'mid') {
    const mx = vert ? W * 0.09 : W * 0.14;
    const mw = vert ? W * 0.82 : W * 0.62;
    const my = vert ? H * 0.41 : H * 0.33;
    const mh = vert ? H * 0.21 : H * 0.35;
    const sx0 = mx + 26;
    const sx1 = mx + mw - 26;
    const sw = sx1 - sx0;
    const baseY = my + mh * 0.50;
    const shownMissed = Math.round(lerp(Math.max(0, missed - 2), missed, easeOut(clamp(p / 0.78))));
    const sweep = (st * 0.3 + t * 0.009) % 1;
    const dotX = sx0 + sweep * sw;
    const ledPulse = 0.55 + 0.45 * Math.sin(t * 0.24);

    // Build ECG waveform points
    const pts: [number, number][] = [];
    const steps = 90;
    const flatStart = missed > 0 ? 0.25 : 2;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = sx0 + u * sw;
      let dy = 0;
      if (u < flatStart) {
        const beatPos = ((u * 3.1) % 1);
        if (beatPos > 0.38 && beatPos < 0.44) dy = 14;
        else if (beatPos >= 0.44 && beatPos < 0.50) dy = -mh * 0.32;
        else if (beatPos >= 0.50 && beatPos < 0.56) dy = mh * 0.16;
        else if (beatPos >= 0.62 && beatPos < 0.72) dy = -12;
      }
      pts.push([x, baseY + dy]);
    }
    const tracePts = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const splitIdx = Math.floor(flatStart * steps);
    const livePts = pts.slice(0, Math.min(pts.length, splitIdx + 1)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const flatPts = missed > 0 ? pts.slice(splitIdx).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ') : '';
    const dotIdx = Math.min(steps, Math.round(sweep * steps));
    const dotY = pts[dotIdx][1];

    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#0F1224" rim={toneColor(gTone)} rimOpacity={0.55} />
        {/* Stand legs to ground */}
        <rect x={mx + mw * 0.22} y={my + mh - 6} width={22} height={ground - (my + mh) + 8} fill="#252C47" stroke={OUT} strokeWidth={4} />
        <rect x={mx + mw * 0.74} y={my + mh - 6} width={22} height={ground - (my + mh) + 8} fill="#252C47" stroke={OUT} strokeWidth={4} />

        {/* Monitor outer cabinet & inner glass */}
        <rect x={mx} y={my} width={mw} height={mh} rx={18} fill="#1C223B" stroke={OUT} strokeWidth={4} />
        <rect x={sx0 - 8} y={my + 20} width={sw + 16} height={mh - 48} rx={10} fill="#080D1C" stroke={OUT} strokeWidth={3.5} />

        {/* Subtle oscilloscope grid */}
        <g stroke="#1C2B4D" strokeWidth={1.5} opacity={0.55}>
          {[0.25, 0.5, 0.75].map((fy) => (
            <line key={fy} x1={sx0 - 6} y1={my + 20 + (mh - 48) * fy} x2={sx1 + 6} y2={my + 20 + (mh - 48) * fy} />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((fx) => (
            <line key={fx} x1={sx0 + sw * fx} y1={my + 22} x2={sx0 + sw * fx} y2={my + mh - 30} />
          ))}
        </g>

        {/* ECG waveform */}
        {missed === 0 ? (
          <polyline points={tracePts} fill="none" stroke={PALETTE.cyan} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
        ) : (
          <>
            <polyline points={livePts} fill="none" stroke={PALETTE.cyan} strokeWidth={4.5} strokeLinejoin="round" />
            <polyline points={flatPts} fill="none" stroke={PALETTE.red} strokeWidth={4.5} strokeLinejoin="round" opacity={0.9} />
          </>
        )}

        {/* Sweeping live trace dot */}
        <Glow x={dotX} y={dotY} r={44} kind={missed > 0 && sweep > flatStart ? 'red' : 'cool'} o={0.75} />
        <circle cx={dotX} cy={dotY} r={6} fill={PALETTE.cream} />

        {/* 25 missed-beat tick slots under the trace */}
        {missed > 0 ? (
          <g>
            {Array.from({ length: 25 }).map((_, i) => {
              const tx = sx0 + sw * 0.27 + (i / 24) * (sw * 0.70);
              const on = i < shownMissed;
              return (
                <rect
                  key={i}
                  x={tx - 2.5}
                  y={baseY + 26}
                  width={5}
                  height={on ? 18 : 10}
                  rx={2}
                  fill={on ? PALETTE.red : '#252E4A'}
                  opacity={on ? 0.95 : 0.4}
                />
              );
            })}
            <text x={sx1 - 6} y={my + mh - 36} textAnchor="end" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.red}>
              {`${shownMissed}/25 MISSED`}
            </text>
          </g>
        ) : null}

        {/* Status bezel LED */}
        <circle cx={mx + mw - 28} cy={my + mh - 14} r={6} fill={toneColor(gTone)} opacity={ledPulse} />

        <Dust t={t} seed={317} x0={mx} y0={my - 40} w={mw} h={mh + 100} n={28} o={0.42} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [mx + mw * 0.5, my + mh * 0.5, mw * 0.55],
            [W * 0.5, ground - 160, W * 0.38],
          ]}
          o={0.28}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};

/** Mars-to-Earth relay diagram: Mars + rover (lower-left), orbiter above, Earth + dish (far-right). */
export const RelaySet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.5));
  const relayAmt = clamp(numParam(sp.relay, 0));
  const directAmt = clamp(numParam(sp.direct, 0));
  const cutAmt = clamp(numParam(sp.cut, 0));
  const gTone = glowTone(sp.glow, 'cyan');
  const vert = H > W;

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={36} raysO={0.14} />;
  }

  if (layer === 'mid') {
    const mx = W * 0.17;
    const my = vert ? H * 0.61 : H * 0.60;
    const mr = vert ? 78 : 104;

    const rvX = mx + mr * 0.44;
    const rvY = my - mr * 0.90;

    const ox = W * 0.30;
    const oy = (vert ? H * 0.41 : H * 0.32) + Math.sin(t * 0.05) * 6;

    const ex = W * 0.84;
    const ey = vert ? H * 0.47 : H * 0.42;
    const er = vert ? 62 : 82;
    const dx = ex - er * 0.94;
    const dy = ey - er * 0.08;

    const relayActive = relayAmt * (1 - 0.8 * cutAmt);
    const sparkX = lerp(rvX, ox, 0.5);
    const sparkY = lerp(rvY, oy, 0.5);
    const sparkFlicker = 0.55 + 0.45 * Math.sin(t * 0.9);

    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#0D1022" rim={toneColor(gTone)} rimOpacity={0.42} />

        {/* Orbital curve around Mars */}
        <path
          d={`M ${mx - mr * 1.4} ${my - mr * 0.4} Q ${ox} ${oy - 35} ${mx + mr * 2.2} ${my + mr * 0.3}`}
          fill="none"
          stroke="#354670"
          strokeWidth={2.5}
          strokeDasharray="8 8"
          opacity={0.55}
        />

        {/* Base thin cyan links */}
        <path
          d={`M ${rvX} ${rvY} L ${ox} ${oy} L ${dx} ${dy}`}
          fill="none"
          stroke={PALETTE.cyan}
          strokeWidth={2.5}
          strokeDasharray="7 7"
          opacity={0.32 * (1 - 0.6 * cutAmt)}
        />
        <line
          x1={rvX}
          y1={rvY}
          x2={dx}
          y2={dy}
          stroke={directAmt > 0.1 ? PALETTE.gold : PALETTE.cyan}
          strokeWidth={directAmt > 0.1 ? 2 + 2.5 * directAmt : 2}
          strokeDasharray={directAmt > 0.1 ? undefined : '6 9'}
          opacity={directAmt > 0.1 ? 0.55 + 0.4 * directAmt : 0.22}
        />

        {/* Thick glowing relay beam (Rover -> Orbiter -> Earth) */}
        {relayActive > 0.08 ? (
          <g opacity={relayActive}>
            <path d={`M ${rvX} ${rvY} L ${ox} ${oy} L ${dx} ${dy}`} fill="none" stroke={PALETTE.cyan} strokeWidth={12} opacity={0.22} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M ${rvX} ${rvY} L ${ox} ${oy} L ${dx} ${dy}`} fill="none" stroke={PALETTE.cyan} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
            {Array.from({ length: 5 }).map((_, i) => {
              const u = (t * 0.016 + st + i / 5) % 1;
              const px = u < 0.25 ? lerp(rvX, ox, u / 0.25) : lerp(ox, dx, (u - 0.25) / 0.75);
              const py = u < 0.25 ? lerp(rvY, oy, u / 0.25) : lerp(oy, dy, (u - 0.25) / 0.75);
              return (
                <g key={i}>
                  <Glow x={px} y={py} r={22} kind="cool" o={0.65} />
                  <circle cx={px} cy={py} r={5.5} fill={PALETTE.cream} />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* Slow gold direct link pulses (Rover -> Earth) */}
        {directAmt > 0.08 ? (
          <g opacity={directAmt}>
            <line x1={rvX} y1={rvY} x2={dx} y2={dy} stroke={PALETTE.gold} strokeWidth={9} opacity={0.18} />
            {Array.from({ length: 2 }).map((_, i) => {
              const u = (t * 0.0045 + st + i * 0.5) % 1;
              const px = lerp(rvX, dx, u);
              const py = lerp(rvY, dy, u);
              return (
                <g key={i}>
                  <Glow x={px} y={py} r={24} kind="warm" o={0.7} />
                  <circle cx={px} cy={py} r={5} fill={PALETTE.gold} stroke={OUT} strokeWidth={2} />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* Broken relay spark when sp.cut > 0 */}
        {cutAmt > 0.05 ? (
          <g opacity={cutAmt * sparkFlicker}>
            <Glow x={sparkX} y={sparkY} r={44} kind="red" o={0.85} />
            <path
              d={`M ${sparkX - 18} ${sparkY - 12} L ${sparkX - 3} ${sparkY - 2} L ${sparkX + 16} ${sparkY - 14} M ${sparkX - 14} ${sparkY + 14} L ${sparkX + 2} ${sparkY + 3} L ${sparkX + 18} ${sparkY + 12}`}
              fill="none"
              stroke={PALETTE.red}
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        ) : null}

        {/* Mars + tiny Rover */}
        <MarsDisc cx={mx} cy={my} r={mr} rot={st * 0.5} id={id} />
        <g transform={`translate(${rvX} ${rvY}) rotate(18)`}>
          <rect x={-14} y={-10} width={28} height={12} rx={3} fill={PALETTE.cream} stroke={OUT} strokeWidth={3} />
          <line x1={-10} y1={-10} x2={-10} y2={-22} stroke={OUT} strokeWidth={3} />
          <circle cx={-10} cy={-24} r={4} fill={PALETTE.cream} stroke={OUT} strokeWidth={2.5} />
          <circle cx={-9} cy={4} r={4} fill="#252333" stroke={OUT} strokeWidth={2.5} />
          <circle cx={9} cy={4} r={4} fill="#252333" stroke={OUT} strokeWidth={2.5} />
        </g>

        {/* Tiny Orbiter */}
        <OrbiterGraphic x={ox} y={oy} scale={vert ? 0.50 : 0.60} angle={-10} t={t} gTone={cutAmt > 0.4 ? 'red' : gTone} />

        {/* Blue Earth + DSN dish */}
        <g>
          <defs>
            <clipPath id={`${id}earthClip`}>
              <circle cx={ex} cy={ey} r={er} />
            </clipPath>
          </defs>
          <Glow x={ex} y={ey} r={er * 1.75} kind="cool" o={0.35} />
          <circle cx={ex} cy={ey} r={er} fill="#2874C8" />
          <g clipPath={`url(#${id}earthClip)`}>
            <path d={`M ${ex - er * 0.5} ${ey - er * 0.5} Q ${ex - er * 0.1} ${ey - er * 0.6} ${ex} ${ey - er * 0.1} T ${ex - er * 0.3} ${ey + er * 0.5} Z`} fill="#39B886" />
            <path d={`M ${ex + er * 0.15} ${ey - er * 0.4} Q ${ex + er * 0.65} ${ey - er * 0.2} ${ex + er * 0.45} ${ey + er * 0.4} Z`} fill="#39B886" />
            <ellipse cx={ex - er * 0.2 + Math.sin(t * 0.02) * 8} cy={ey - er * 0.25} rx={er * 0.35} ry={er * 0.08} fill="#EAF2FF" opacity={0.55} />
            <path d={`M ${ex + er * 0.1} ${ey - er} A ${er * 0.8} ${er} 0 0 1 ${ex + er * 0.1} ${ey + er} L ${ex + er * 1.2} ${ey + er} L ${ex + er * 1.2} ${ey - er} Z`} fill="#0D1938" opacity={0.42} />
          </g>
          <circle cx={ex} cy={ey} r={er} fill="none" stroke={OUT} strokeWidth={4} />
          {/* Tiny DSN dish on Earth */}
          <g transform={`translate(${dx} ${dy}) rotate(-72)`}>
            <rect x={-5} y={0} width={10} height={12} fill="#6C758E" stroke={OUT} strokeWidth={2.5} />
            <path d="M -16 -6 Q 0 6 16 -6 Q 0 -16 -16 -6 Z" fill={PALETTE.cream} stroke={OUT} strokeWidth={3} />
          </g>
        </g>

        <Dust t={t} seed={403} x0={0} y0={H * 0.15} w={W} h={ground - H * 0.15} n={26} o={0.38} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [W * 0.5, H * 0.48, W * 0.48],
            [W * 0.5, ground - 150, W * 0.4],
          ]}
          o={0.24}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};

/** Odyssey in orbit: massive rust Mars curve below, gold-and-grey orbiter above, drifting stars & optional tumble. */
export const OrbiterSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.5));
  const tilt = clamp(numParam(sp.tilt, 0));
  const gTone = glowTone(sp.glow, 'cyan');
  const vert = H > W;

  if (layer === 'far') {
    const sunX = W * 0.14;
    const sunY = vert ? H * 0.22 : H * 0.24;
    const starDrift = -((t * 0.15 + st * 80) % 400);
    return (
      <g>
        <defs>
          <linearGradient id={`${id}space`} x1="0" y1={-400} x2="0" y2={H + 400} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#050612" />
            <stop offset="65%" stopColor="#0C1126" />
            <stop offset="100%" stopColor="#1B1324" />
          </linearGradient>
        </defs>
        <rect x={-1400} y={-1500} width={W + 2800} height={H + 3000} fill={`url(#${id}space)`} />
        <g transform={`translate(${starDrift} 0)`}>
          <Stars seed={91} x0={-1000} y0={-900} w={W + 2400} h={H + 1600} t={t} n={115} o={0.86} />
        </g>
        <Glow x={sunX} y={sunY} r={220} kind={glowKind(gTone)} o={0.42} />
        <Rays x={sunX} y={sunY} t={t} o={0.14} color={rayColor(gTone)} len={Math.max(W, H) * 1.2} />
        <circle cx={sunX} cy={sunY} r={vert ? 26 : 32} fill="#FFF3D6" />
      </g>
    );
  }

  if (layer === 'mid') {
    const marsR = Math.max(W, H) * 1.42;
    const marsY = ground + marsR - (vert ? 54 : 38);
    const ox = W * (0.34 + st * 0.22 + p * 0.08);
    const oy = (vert ? H * 0.45 : H * 0.36) + Math.sin(t * 0.05) * 8;
    const angle = tilt > 0.05 ? tilt * (24 + 16 * Math.sin(t * 0.05 + p * 2)) : -8 + Math.sin(t * 0.04) * 2.5;
    const thruster = tilt > 0.35 ? clamp((tilt - 0.3) * 1.35) : 0;

    return (
      <g>
        {/* Subtle orbital arc */}
        <path
          d={`M -300 ${oy + 65} Q ${W * 0.5} ${oy - 45} ${W + 300} ${oy + 55}`}
          fill="none"
          stroke="#46598C"
          strokeWidth={2.5}
          strokeDasharray="10 10"
          opacity={0.45}
        />

        {/* Curved limb of Mars filling the lower portion */}
        <Glow x={W * 0.5} y={ground + 40} r={W * 0.62} kind="warm" o={0.22} />
        <circle cx={W * 0.5} cy={marsY} r={marsR} fill="#9C3F2A" stroke="#F49A6E" strokeWidth={5} />
        <ellipse cx={W * 0.32} cy={marsY - marsR + 135} rx={120} ry={42} fill="#772C1E" opacity={0.65} />
        <ellipse cx={W * 0.72} cy={marsY - marsR + 165} rx={165} ry={52} fill="#772C1E" opacity={0.55} />
        <circle cx={W * 0.5} cy={marsY} r={marsR + 2} fill="none" stroke={OUT} strokeWidth={4} />

        {/* Mars Odyssey orbiter */}
        <Glow x={ox} y={oy} r={190} kind={glowKind(gTone)} o={0.34} />
        <OrbiterGraphic
          x={ox}
          y={oy}
          scale={vert ? 0.92 : 1.12}
          angle={angle}
          t={t}
          gTone={gTone}
          thruster={thruster}
          beam={gTone === 'cyan' && tilt < 0.25}
        />

        <Dust t={t} seed={509} x0={0} y0={H * 0.12} w={W} h={ground - H * 0.1} n={26} o={0.42} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [ox, oy, 360],
            [W * 0.5, ground - 150, W * 0.42],
          ]}
          o={0.26}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} color="#09070F" />;
};
