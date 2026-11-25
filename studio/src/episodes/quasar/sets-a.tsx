import React from 'react';
import { PALETTE, FONTS, GroundPlane } from '../../brand';
import { Glow, LightVeil, Dust, Cone } from '../../engine/light';
import { Stars, Rays } from '../../engine/kit';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import type { SetProps } from './render';

export type GlowKind = 'warm' | 'cool' | 'red';

export const glowKind = (sp: Record<string, unknown>): GlowKind => {
  const g = String(sp.glow ?? 'gold');
  if (g === 'cyan') return 'cool';
  if (g === 'red') return 'red';
  return 'warm';
};

export const glowHex = (sp: Record<string, unknown>): string => {
  const g = String(sp.glow ?? 'gold');
  if (g === 'cyan') return PALETTE.cyan;
  if (g === 'red') return PALETTE.red;
  return PALETTE.gold;
};

export const glowSoft = (sp: Record<string, unknown>): string => {
  const g = String(sp.glow ?? 'gold');
  if (g === 'cyan') return '#9BE8FF';
  if (g === 'red') return '#FF8A7A';
  return '#FFE2B0';
};

export const num = (sp: Record<string, unknown>, k: string, def = 0): number => {
  const v = sp[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : def;
};

export const phaseOf = (sp: Record<string, unknown>, t: number): number => num(sp, 't', 0) * 180 + t;

const mixRgb = (a: [number, number, number], b: [number, number, number], u: number): string => {
  const k = clamp(u);
  const r = Math.round(lerp(a[0], b[0], k));
  const g = Math.round(lerp(a[1], b[1], k));
  const bl = Math.round(lerp(a[2], b[2], k));
  return `rgb(${r},${g},${bl})`;
};

export const spectrumRgb = (u: number): string => {
  const k = clamp(u);
  if (k < 0.5) return mixRgb([125, 226, 255], [255, 148, 66], k * 2);
  return mixRgb([255, 148, 66], [206, 46, 68], (k - 0.5) * 2);
};

const DARK_OUTLINE = '#121019';

/**
 * 1. QUASAR SET: Early-universe host galaxy + tilted accretion disc + polar jets + black hole core.
 */
export const QuasarSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const jets = num(sp, 'jets', 0);
  const feed = num(sp, 'feed', 0);
  const outshine = num(sp, 'outshine', 0);
  const close = num(sp, 'close', 0);
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const qx = 0.5 * W + Math.sin(ph * 0.015) * 8;
  const qy = (vert ? 0.45 : 0.41) * H + Math.cos(ph * 0.012) * 5;
  const qScale = sc * lerp(1.0, 2.25, easeInOut(close)) * (vert ? 0.86 : 1.0);
  const starFade = clamp(1 - outshine * 0.85, 0.12, 1);

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <radialGradient id={`${id}_bg`} cx="50%" cy="42%" r="72%">
            <stop offset="0%" stopColor={outshine > 0.4 ? '#2B1B3D' : '#19102C'} />
            <stop offset="55%" stopColor="#0D091D" />
            <stop offset="100%" stopColor="#06040F" />
          </radialGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}_bg)`} />
        <g opacity={starFade}>
          <Stars seed={41} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={110} o={0.85} />
          {/* Faint reddish young host galaxy stars */}
          <g transform={`translate(${qx} ${qy}) rotate(${ph * 0.05})`}>
            <ellipse cx={0} cy={0} rx={520 * sc} ry={210 * sc} fill="#5E202E" opacity={0.22} />
            {Array.from({ length: 42 }).map((_, i) => {
              const ang = rnd(11, i) * Math.PI * 2;
              const rad = (0.18 + rnd(12, i) * 0.82) * 460 * sc;
              const sx = Math.cos(ang) * rad;
              const sy = Math.sin(ang) * rad * 0.42;
              const tw = 0.55 + 0.45 * Math.sin(t * 0.08 + i);
              return <circle key={i} cx={sx} cy={sy} r={1.8 + rnd(13, i) * 3} fill={i % 3 ? '#FF8F7D' : '#FFE2B0'} opacity={0.7 * tw} />;
            })}
          </g>
        </g>
        <Glow x={qx} y={qy} r={(420 + outshine * 420) * sc} kind={gk} o={0.35 + outshine * 0.45} />
        <Rays x={qx} y={qy} t={ph * 0.7} len={1700 * sc} n={14} o={0.07 + outshine * 0.16} color={glowSoft(sp)} />
      </g>
    );
  }

  if (layer === 'near') {
    const drift = Math.sin(ph * 0.02) * 14;
    return (
      <g opacity={0.85}>
        <g transform={`translate(${0.05 * W + drift} ${ground + 30})`}>
          <polygon points="-90,40 -45,-55 30,-70 95,-10 70,80 -60,90" fill="#0B0816" stroke={DARK_OUTLINE} strokeWidth={4} />
        </g>
        <g transform={`translate(${0.95 * W - drift} ${ground + 20})`}>
          <polygon points="-85,35 -35,-65 55,-50 95,25 45,95 -55,80" fill="#0B0816" stroke={DARK_OUTLINE} strokeWidth={4} />
        </g>
      </g>
    );
  }

  // mid layer
  const jetProg = jets > 0 ? lerp(jets * 0.75, jets, easeOut(clamp(p / 0.5))) : 0;
  const feedProg = feed > 0 ? lerp(feed * 0.75, feed, easeOut(clamp(p / 0.5))) : 0;
  const glareR = (200 + outshine * 360) * sc;
  const bhR = 46;
  const discTilt = -11;

  return (
    <g>
      {/* Plane 1: Young reddish host galaxy arms behind the quasar */}
      <g transform={`translate(${qx} ${qy}) rotate(${discTilt + ph * 0.04}) scale(${sc})`} opacity={starFade}>
        <ellipse cx={0} cy={0} rx={420} ry={145} fill="#461A28" opacity={0.45} />
        <path
          d="M -380 -10 Q -210 -120 0 -48 Q 210 -110 380 12 Q 200 115 0 52 Q -200 105 -380 -10 Z"
          fill="#6E2836"
          stroke={DARK_OUTLINE}
          strokeWidth={3.5}
          opacity={0.55}
        />
        {Array.from({ length: 14 }).map((_, i) => {
          const ang = (i / 14) * Math.PI * 2 + ph * 0.004;
          const rx = 180 + rnd(31, i) * 195;
          return (
            <circle
              key={i}
              cx={Math.cos(ang) * rx}
              cy={Math.sin(ang) * rx * 0.32}
              r={5 + rnd(32, i) * 7}
              fill={i % 2 ? '#FF8B73' : '#FFBF9E'}
              stroke={DARK_OUTLINE}
              strokeWidth={3}
              opacity={0.75}
            />
          );
        })}
      </g>

      {/* Plane 2: Supermassive black hole, inflowing streams, accretion disc & jets */}
      <g transform={`translate(${qx} ${qy}) scale(${qScale}) rotate(${discTilt})`}>
        {/* Gas feeding streams spiraling into the disc */}
        {feedProg > 0.02 ? (
          <g opacity={clamp(feedProg * 1.1)}>
            {[0, 1, 2, 3].map((idx) => {
              const rot = idx * 90 + ph * 1.4;
              const reach = lerp(180, 320, feedProg);
              return (
                <g key={idx} transform={`rotate(${rot})`}>
                  <path
                    d={`M ${reach} -22 Q ${reach * 0.62} -66 140 -14`}
                    fill="none"
                    stroke={DARK_OUTLINE}
                    strokeWidth={12}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${reach} -22 Q ${reach * 0.62} -66 140 -14`}
                    fill="none"
                    stroke={idx % 2 ? '#FF8A47' : '#F2B33D'}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray="24 14"
                    strokeDashoffset={-ph * 3.2}
                  />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* Back half of polar jets (behind front accretion disc) */}
        {jetProg > 0.02 ? (
          <g opacity={clamp(jetProg)}>
            {[-1, 1].map((dir) => {
              const jLen = lerp(110, 520, jetProg);
              return (
                <g key={dir}>
                  <path
                    d={`M -16 ${dir * 26} L ${-48 * jetProg} ${dir * jLen} L ${48 * jetProg} ${dir * jLen} L 16 ${dir * 26} Z`}
                    fill="#64D2FF"
                    opacity={0.35}
                  />
                  <path
                    d={`M -7 ${dir * 28} L ${-18 * jetProg} ${dir * jLen} L ${18 * jetProg} ${dir * jLen} L 7 ${dir * 28} Z`}
                    fill="#EAFBFF"
                    stroke={DARK_OUTLINE}
                    strokeWidth={3.5}
                    opacity={0.92}
                  />
                  {[0, 1, 2, 3].map((k) => {
                    const pulse = ((ph * 0.04 + k * 0.25) % 1);
                    const py = dir * lerp(50, jLen * 0.9, pulse);
                    return <ellipse key={k} cx={0} cy={py} rx={11 * (1 - pulse * 0.5)} ry={6} fill="#FFFFFF" opacity={0.8 * (1 - pulse)} />;
                  })}
                </g>
              );
            })}
          </g>
        ) : null}

        {/* Back half of flat tilted accretion disc (y <= 0 clipped) */}
        <defs>
          <clipPath id={`${id}_back`}>
            <rect x={-360} y={-200} width={720} height={200} />
          </clipPath>
          <clipPath id={`${id}_front`}>
            <rect x={-360} y={0} width={720} height={200} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${id}_back)`}>
          <ellipse cx={0} cy={0} rx={276} ry={78} fill="#8E2233" stroke={DARK_OUTLINE} strokeWidth={4} />
          <ellipse cx={0} cy={0} rx={226} ry={63} fill="#D95032" />
          <ellipse cx={0} cy={0} rx={172} ry={47} fill="#FF9838" />
          <ellipse cx={0} cy={0} rx={118} ry={32} fill="#FFF2CA" />
          {/* Rotating hot arc streaks */}
          <ellipse
            cx={0}
            cy={0}
            rx={198}
            ry={54}
            fill="none"
            stroke="#FFE2B0"
            strokeWidth={4}
            strokeDasharray="55 85"
            strokeDashoffset={-ph * 2.6}
            opacity={0.75}
          />
        </g>

        {/* Event horizon + photon ring */}
        <circle cx={0} cy={0} r={bhR + 9} fill="none" stroke={DARK_OUTLINE} strokeWidth={8} />
        <circle cx={0} cy={0} r={bhR + 4} fill="none" stroke="#FFF4D6" strokeWidth={5} />
        <circle cx={0} cy={0} r={bhR} fill="#05040A" />
        {/* Gravitational lensing upper arch */}
        <path d={`M ${-bhR - 14} 0 A ${bhR + 14} ${bhR + 20} 0 0 1 ${bhR + 14} 0`} fill="none" stroke="#FFAA4D" strokeWidth={4} opacity={0.85} />

        {/* Front half of flat tilted accretion disc (passes in front of event horizon) */}
        <g clipPath={`url(#${id}_front)`}>
          <ellipse cx={0} cy={0} rx={276} ry={78} fill="#8E2233" stroke={DARK_OUTLINE} strokeWidth={4} />
          <ellipse cx={0} cy={0} rx={226} ry={63} fill="#D95032" />
          <ellipse cx={0} cy={0} rx={172} ry={47} fill="#FF9838" />
          <ellipse cx={0} cy={0} rx={118} ry={32} fill="#FFF2CA" />
          <ellipse
            cx={0}
            cy={0}
            rx={150}
            ry={41}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeDasharray="65 95"
            strokeDashoffset={ph * 2.8}
            opacity={0.8}
          />
          {/* Cut inner hole cleanly in the front ring while letting front edge overlap lower BH */}
          <ellipse cx={0} cy={0} rx={bhR + 18} ry={17} fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
        </g>
        <ellipse cx={0} cy={0} rx={276} ry={78} fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>

      {/* Outshine bloom */}
      <Glow x={qx} y={qy} r={glareR} kind={gk} o={0.35 + outshine * 0.55} />
      {outshine > 0.35 ? (
        <circle cx={qx} cy={qy} r={(40 + outshine * 110) * sc} fill="#FFF8E8" opacity={(outshine - 0.35) * 0.45} style={{ mixBlendMode: 'screen' }} />
      ) : null}

      {/* Plane 3: Dark cosmic ground rim for Pip */}
      <GroundPlane y={ground} fill="#0D091B" rim={gHex} />
      {[0.12, 0.88].map((rx, i) => (
        <polygon
          key={i}
          points={`${rx * W - 46},${ground + 2} ${rx * W - 20},${ground - 26} ${rx * W + 24},${ground - 18} ${rx * W + 48},${ground + 2}`}
          fill="#1D1633"
          stroke={DARK_OUTLINE}
          strokeWidth={3.5}
        />
      ))}

      <LightVeil id={`${id}_veil`} lights={[[qx, qy, 680 * sc], [0.5 * W, ground - 110, 460 * sc]]} o={0.36} />
      <Dust t={t} seed={201} x0={0} y0={0} w={W} h={H} n={36} o={0.55} />
    </g>
  );
};

/**
 * 2. BEAM SET: Riding a beam of light through stretching space (wavelength & color shift + grid).
 */
export const BeamSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const sc = Math.min(W, H) / 1080;
  const speed = 0.6 + num(sp, 't', 0.4) * 1.4;
  const stretch = clamp(num(sp, 'stretch', 0));
  const grid = clamp(num(sp, 'grid', 0));
  const gk = glowKind(sp);
  const gHex = glowHex(sp);
  const ribbonColor = spectrumRgb(stretch);
  const ribbonY = ground + 12 * sc;

  if (layer === 'far') {
    const streakLen = (24 + speed * 48) * sc;
    return (
      <g>
        <defs>
          <linearGradient id={`${id}_bg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060412" />
            <stop offset="60%" stopColor="#0E0B24" />
            <stop offset="100%" stopColor="#140E2E" />
          </linearGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}_bg)`} />
        <Stars seed={73} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={85} o={0.75} />
        {/* Parallax starlight streaks flying right-to-left */}
        <g>
          {Array.from({ length: 34 }).map((_, i) => {
            const span = W * 2.2;
            const sx = -W * 0.6 + (((rnd(81, i) * span - t * 14 * speed * (0.6 + rnd(82, i) * 0.8)) % span + span) % span);
            const sy = -H * 0.2 + rnd(83, i) * H * 1.4;
            const len = streakLen * (0.5 + rnd(84, i) * 0.9);
            return (
              <line
                key={i}
                x1={sx}
                y1={sy}
                x2={sx + len}
                y2={sy}
                stroke={i % 3 === 0 ? glowSoft(sp) : '#DCE6FF'}
                strokeWidth={2 + rnd(85, i) * 2}
                strokeLinecap="round"
                opacity={0.35 + rnd(86, i) * 0.45}
              />
            );
          })}
        </g>
        <Glow x={0.5 * W} y={ribbonY} r={540 * sc} kind={gk} o={0.3} />
      </g>
    );
  }

  if (layer === 'near') {
    const span = W * 2.4;
    return (
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const sx = -W * 0.6 + (((rnd(91, i) * span - t * 28 * speed) % span + span) % span);
          const sy = i % 2 === 0 ? 52 : H - 48;
          return (
            <line
              key={i}
              x1={sx}
              y1={sy}
              x2={sx + 130 * speed}
              y2={sy}
              stroke={ribbonColor}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.28}
            />
          );
        })}
      </g>
    );
  }

  // mid layer
  const cell = lerp(58, 198, easeInOut(grid)) * sc;
  const gridOffX = ((-t * 2.2 * speed) % cell + cell) % cell;
  const xStart = -W * 0.7;
  const xEnd = W * 1.7;
  const yStart = -H * 0.5;
  const yEnd = H * 1.5;
  const vCount = Math.ceil((xEnd - xStart) / cell) + 1;
  const hCount = Math.ceil((yEnd - yStart) / cell) + 1;

  // Wave along the light ribbon: wavelength expands with stretch
  const waveLen = lerp(82, 420, easeInOut(stretch)) * sc;
  const waveAmp = lerp(14, 21, stretch) * sc;
  let waveD = '';
  const step = 14;
  for (let x = xStart; x <= xEnd; x += step) {
    const wy = ribbonY + Math.sin(((x - t * 10 * speed) / waveLen) * Math.PI * 2) * waveAmp;
    waveD += `${x === xStart ? 'M' : ' L'} ${x.toFixed(1)} ${wy.toFixed(1)}`;
  }

  return (
    <g>
      {/* Plane 1: Expanding space coordinate grid */}
      <g opacity={0.14 + grid * 0.24}>
        {Array.from({ length: vCount }).map((_, i) => {
          const gx = xStart + i * cell + gridOffX - cell;
          return <line key={`v${i}`} x1={gx} y1={yStart} x2={gx} y2={yEnd} stroke={PALETTE.cream} strokeWidth={1.8} />;
        })}
        {Array.from({ length: hCount }).map((_, i) => {
          const gy = yStart + i * cell;
          return <line key={`h${i}`} x1={xStart} y1={gy} x2={xEnd} y2={gy} stroke={PALETTE.cream} strokeWidth={1.8} />;
        })}
      </g>

      {/* Plane 2: Glowing light ribbon road */}
      <g>
        {/* Outer soft ribbon aura */}
        <rect x={xStart} y={ribbonY - 38 * sc} width={xEnd - xStart} height={76 * sc} fill={ribbonColor} opacity={0.18} />
        {/* Dark outlined ribbon body */}
        <rect
          x={xStart}
          y={ribbonY - 22 * sc}
          width={xEnd - xStart}
          height={44 * sc}
          fill={ribbonColor}
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
        {/* Bright hot cream core */}
        <rect x={xStart} y={ribbonY - 7 * sc} width={xEnd - xStart} height={14 * sc} fill="#FFF7DF" opacity={0.78 - stretch * 0.35} />
        {/* Stretched light wave running along the ribbon */}
        <path d={waveD} fill="none" stroke={DARK_OUTLINE} strokeWidth={10 * sc} strokeLinecap="round" />
        <path d={waveD} fill="none" stroke="#FFF9EB" strokeWidth={4.5 * sc} strokeLinecap="round" />
      </g>

      {/* Plane 3: Fast wake particles & stretch markers */}
      <g>
        {Array.from({ length: 18 }).map((_, i) => {
          const span = W * 2;
          const px = -W * 0.5 + (((rnd(104, i) * span - t * 20 * speed) % span + span) % span);
          const py = ribbonY - (45 + rnd(105, i) * 280) * sc;
          return (
            <line
              key={i}
              x1={px}
              y1={py}
              x2={px + (28 + speed * 32) * sc}
              y2={py}
              stroke={i % 2 ? gHex : PALETTE.cream}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.45}
            />
          );
        })}
      </g>

      <Glow x={0.5 * W} y={ribbonY} r={340 * sc} kind={gk} o={0.45} />
      <LightVeil id={`${id}_veil`} lights={[[0.5 * W, ribbonY - 90 * sc, 720 * sc]]} o={0.32} />
      <Dust t={t} seed={207} x0={0} y0={0} w={W} h={H} n={34} o={0.5} />
    </g>
  );
};

/**
 * 3. DAWN SET: Primordial hydrogen fog cleared by growing ionization bubbles around first stars.
 */
export const DawnSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const starsFrac = clamp(num(sp, 'stars', 0.4));
  const clearFrac = clamp(num(sp, 'clear', 0.2) + 0.06 * easeOut(p));
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const firstStars = Array.from({ length: 12 }).map((_, i) => ({
    x: (0.12 + rnd(121, i) * 0.76) * W + Math.sin(ph * 0.012 + i) * 10,
    y: (0.18 + rnd(122, i) * 0.54) * H + Math.cos(ph * 0.014 + i) * 8,
    r: (8 + rnd(123, i) * 7) * sc,
    threshold: i / 12,
  }));

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#060511" />
        <g opacity={0.15 + starsFrac * 0.85}>
          <Stars seed={131} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={Math.round(20 + starsFrac * 95)} o={0.88} />
        </g>
        <Glow x={0.5 * W} y={0.45 * H} r={540 * sc} kind={gk} o={0.14 + clearFrac * 0.28} />
      </g>
    );
  }

  if (layer === 'near') {
    const fogO = clamp(0.82 * (1 - clearFrac * 0.9), 0.08, 0.85);
    const drift = Math.sin(ph * 0.018) * 18;
    return (
      <g opacity={fogO}>
        <ellipse cx={0.05 * W + drift} cy={ground - 40} rx={170 * sc} ry={95 * sc} fill="#171326" stroke={DARK_OUTLINE} strokeWidth={4} />
        <ellipse cx={0.95 * W - drift} cy={ground - 30} rx={180 * sc} ry={105 * sc} fill="#171326" stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>
    );
  }

  // mid layer
  const bubbleMaxR = (170 + clearFrac * 360) * sc;
  return (
    <g>
      {/* Plane 1: First stars & drifting messy red baby galaxies inside clear spaces */}
      <g>
        {Array.from({ length: 6 }).map((_, i) => {
          const gx = (0.16 + rnd(141, i) * 0.68) * W + Math.sin(ph * 0.01 + i) * 14;
          const gy = (0.28 + rnd(142, i) * 0.4) * H + Math.cos(ph * 0.012 + i) * 9;
          const vis = clamp((clearFrac - 0.15) * 1.4, 0, 1);
          return (
            <g key={`bgal${i}`} transform={`translate(${gx} ${gy}) rotate(${rnd(143, i) * 180 + ph * 0.08}) scale(${sc})`} opacity={vis}>
              <ellipse cx={0} cy={0} rx={26} ry={12} fill="#8C2836" stroke={DARK_OUTLINE} strokeWidth={3.5} />
              <circle cx={-8} cy={-2} r={5} fill="#FF8C7A" />
              <circle cx={7} cy={3} r={4} fill="#FFE2B0" />
              <circle cx={0} cy={0} r={6} fill="#FFF2DC" />
            </g>
          );
        })}

        {firstStars.map((st, i) => {
          const lit = clamp((starsFrac - st.threshold) * 5, 0, 1);
          if (lit <= 0.02) return null;
          const pulse = 1 + 0.12 * Math.sin(t * 0.12 + i);
          const sr = st.r * backOut(lit) * pulse;
          return (
            <g key={`fs${i}`} transform={`translate(${st.x} ${st.y})`}>
              <Glow x={0} y={0} r={sr * 7} kind="cool" o={0.55 * lit} />
              {/* 4-point star flare */}
              <path
                d={`M 0 ${-sr * 2.5} L ${sr * 0.45} ${-sr * 0.45} L ${sr * 2.5} 0 L ${sr * 0.45} ${sr * 0.45} L 0 ${sr * 2.5} L ${-sr * 0.45} ${sr * 0.45} L ${-sr * 2.5} 0 L ${-sr * 0.45} ${-sr * 0.45} Z`}
                fill="#DCEEFF"
                stroke={DARK_OUTLINE}
                strokeWidth={3}
              />
              <circle cx={0} cy={0} r={sr * 0.65} fill="#FFFFFF" />
            </g>
          );
        })}
      </g>

      {/* Plane 2: Thick dark grey-violet hydrogen fog carved open by ionization bubbles */}
      <defs>
        <mask id={`${id}_fogmask`} maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#fff" />
          {firstStars.map((st, i) => {
            const lit = clamp((starsFrac - st.threshold) * 4, 0, 1);
            const holeR = bubbleMaxR * clearFrac * lit * (0.7 + rnd(151, i) * 0.55);
            if (holeR <= 1) return null;
            return <circle key={i} cx={st.x} cy={st.y} r={holeR} fill="#000" />;
          })}
        </mask>
      </defs>

      {clearFrac < 0.97 ? (
        <g mask={`url(#${id}_fogmask)`} opacity={clamp(1 - clearFrac * 0.85, 0.08, 0.96)}>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#231D36" />
          {Array.from({ length: 16 }).map((_, i) => {
            const fx = (-0.2 + rnd(161, i) * 1.4) * W + Math.sin(ph * 0.015 + i) * 24;
            const fy = (-0.1 + rnd(162, i) * 1.1) * H + Math.cos(ph * 0.012 + i) * 16;
            const rx = (170 + rnd(163, i) * 210) * sc;
            const ry = (95 + rnd(164, i) * 120) * sc;
            return (
              <ellipse
                key={i}
                cx={fx}
                cy={fy}
                rx={rx}
                ry={ry}
                fill={i % 2 ? '#2F2746' : '#1A1529'}
                stroke="#120E1D"
                strokeWidth={3.5}
                opacity={0.78}
              />
            );
          })}
        </g>
      ) : null}

      {/* Glowing bubble rims around growing clear pockets */}
      {firstStars.map((st, i) => {
        const lit = clamp((starsFrac - st.threshold) * 4, 0, 1);
        const holeR = bubbleMaxR * clearFrac * lit * (0.7 + rnd(151, i) * 0.55);
        if (holeR < 12) return null;
        return (
          <circle
            key={`brim${i}`}
            cx={st.x}
            cy={st.y}
            r={holeR}
            fill="none"
            stroke={i % 2 ? PALETTE.cyan : '#9BE8FF'}
            strokeWidth={3}
            opacity={0.35 * (1 - clearFrac * 0.45)}
          />
        );
      })}

      {/* Plane 3: Subtle cosmic cloud floor at ground */}
      <GroundPlane y={ground} fill="#100D1E" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[0.5 * W, 0.48 * H, 780 * sc]]} o={0.32} />
      <Dust t={t} seed={213} x0={0} y0={0} w={W} h={H} n={38} o={0.5} />
    </g>
  );
};

/**
 * 4. TIMELINE SET: Cosmic timeline from BIG BANG burst to blue Earth NOW with milestone tags & photon spark.
 */
export const TimelineSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const nowPos = clamp(num(sp, 'now', 0.1) + 0.025 * easeOut(p));
  const mark = num(sp, 'mark', 1);
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const lineY = vert ? 0.49 * H : 0.45 * H;
  const x0 = 0.1 * W;
  const x1 = 0.9 * W;
  const span = x1 - x0;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#080614" />
        <Stars seed={171} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={95} o={0.82} />
        <Rays x={x0} y={lineY} t={ph * 0.5} len={1200 * sc} n={12} o={0.14} color="#FFE8B8" />
        <Glow x={x0} y={lineY} r={380 * sc} kind="warm" o={0.48} />
        <Glow x={lerp(x0, x1, nowPos)} y={lineY} r={280 * sc} kind={gk} o={0.42} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g opacity={0.45}>
        {[0.08, 0.92].map((nx, i) => (
          <rect key={i} x={nx * W - 6} y={ground + 16} width={12} height={70} rx={4} fill="#141126" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        ))}
      </g>
    );
  }

  // mid layer
  const milestones = [
    { f: 0.12, label: 'QUASAR 630 MYR', col: PALETTE.gold, above: true },
    { f: 0.4, label: 'MILKY WAY', col: PALETTE.cyan, above: false },
    { f: 0.7, label: 'SUN 4.6 BYR', col: PALETTE.orange, above: true },
    { f: 0.95, label: 'NOW', col: PALETTE.sky, above: false },
  ];
  const sparkX = lerp(x0, x1, nowPos);

  return (
    <g>
      {/* Plane 1: Subtle era grid lines */}
      <g opacity={0.14}>
        {[0.2, 0.4, 0.6, 0.8].map((u, i) => (
          <line key={i} x1={x0 + u * span} y1={lineY - 190 * sc} x2={x0 + u * span} y2={lineY + 190 * sc} stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="8 10" />
        ))}
      </g>

      {/* Plane 2: Gold timeline bar, Big Bang burst, Earth NOW, milestones & cyan spark */}
      <g>
        {/* Glowing gold spine */}
        <line x1={x0} y1={lineY} x2={x1} y2={lineY} stroke={DARK_OUTLINE} strokeWidth={13 * sc} strokeLinecap="round" />
        <line x1={x0} y1={lineY} x2={x1} y2={lineY} stroke={PALETTE.gold} strokeWidth={6 * sc} strokeLinecap="round" />
        <line x1={x0} y1={lineY} x2={x1} y2={lineY} stroke="#FFF6D8" strokeWidth={2.5 * sc} strokeLinecap="round" opacity={0.7} />

        {/* Left: BIG BANG starburst */}
        <g transform={`translate(${x0} ${lineY}) scale(${sc * (1 + 0.04 * Math.sin(t * 0.12))})`}>
          <path
            d="M 0 -52 L 13 -16 L 50 -28 L 22 2 L 48 34 L 10 20 L -4 52 L -16 18 L -52 26 L -24 -4 L -48 -36 L -12 -18 Z"
            fill="#FFF7DF"
            stroke={DARK_OUTLINE}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <text y={84} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream} letterSpacing={2}>
            BIG BANG
          </text>
        </g>

        {/* Right: Small blue Earth labelled NOW */}
        <g transform={`translate(${x1} ${lineY}) scale(${sc})`}>
          <circle cx={0} cy={0} r={32} fill="#2C7AD6" stroke={DARK_OUTLINE} strokeWidth={4} />
          <path d="M -16 -12 Q -2 -18 8 -6 Q 18 4 6 18 Q -10 14 -16 -12 Z" fill="#39B87A" />
          <path d="M 10 -20 Q 22 -14 20 2" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
          <text y={62} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.sky} letterSpacing={2}>
            NOW
          </text>
        </g>

        {/* Milestone dots & calendar-style tags */}
        {milestones.map((m, idx) => {
          const pop = idx + 1 <= mark ? backOut(clamp((t - idx * 4) / 8)) : 0;
          if (pop <= 0.02) return null;
          const mx = x0 + m.f * span;
          const dir = m.above ? -1 : 1;
          const tagY = dir * (vert ? 86 : 78) * sc;
          const tagW = Math.max(150, m.label.length * 14 + 34);
          return (
            <g key={idx} transform={`translate(${mx} ${lineY})`}>
              <line x1={0} y1={0} x2={0} y2={tagY - dir * 24 * sc} stroke={PALETTE.cream} strokeWidth={3} opacity={0.8} />
              <circle cx={0} cy={0} r={11 * sc * pop} fill={m.col} stroke={DARK_OUTLINE} strokeWidth={3.5} />
              <g transform={`translate(0 ${tagY}) scale(${sc * pop})`}>
                <rect x={-tagW / 2} y={-24} width={tagW} height={48} rx={9} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={3.5} />
                <rect x={-tagW / 2} y={-24} width={tagW} height={11} rx={4} fill={m.col} />
                <text y={12} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.pill} letterSpacing={1.2}>
                  {m.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Bright cyan light spark (the photon) gliding along the line */}
        <g transform={`translate(${sparkX} ${lineY}) scale(${sc})`}>
          <Glow x={0} y={0} r={85} kind="cool" o={0.75} />
          <line x1={-56} y1={0} x2={-10} y2={0} stroke="#64D2FF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          <circle cx={0} cy={0} r={22 + Math.sin(t * 0.25) * 4} fill="none" stroke="#9BE8FF" strokeWidth={3} opacity={0.65} />
          <circle cx={0} cy={0} r={12} fill="#EAFBFF" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        </g>
      </g>

      {/* Plane 3: Dark ground rim */}
      <GroundPlane y={ground} fill="#0D0A1C" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[sparkX, lineY, 540 * sc], [x0, lineY, 420 * sc]]} o={0.34} />
      <Dust t={t} seed={219} x0={0} y0={0} w={W} h={H} n={30} o={0.48} />
    </g>
  );
};

/**
 * 5. EUCLID SET: ESA Euclid space telescope scanning deep space + catching the red photon.
 */
export const EuclidSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const scan = clamp(num(sp, 'scan', 0));
  const catchVal = num(sp, 'catch', 0);
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const ex = (vert ? 0.59 : 0.63) * W + Math.sin(ph * 0.015) * 8;
  const ey = (vert ? 0.48 : 0.45) * H + Math.cos(ph * 0.018) * 6;
  const euScale = sc * (vert ? 0.86 : 1.05);

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#070513" />
        <Stars seed={181} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={110} o={0.85} />
        {/* Faint diagonal band of distant galaxies */}
        <g opacity={0.78}>
          {Array.from({ length: 38 }).map((_, i) => {
            const u = rnd(185, i);
            const gx = lerp(0.06 * W, 0.78 * W, u) + (rnd(186, i) - 0.5) * 180 * sc;
            const gy = lerp(0.24 * H, 0.62 * H, 1 - u * 0.6) + (rnd(187, i) - 0.5) * 150 * sc;
            return (
              <ellipse
                key={i}
                cx={gx}
                cy={gy}
                rx={(6 + rnd(188, i) * 14) * sc}
                ry={(3 + rnd(189, i) * 6) * sc}
                transform={`rotate(${rnd(190, i) * 180} ${gx} ${gy})`}
                fill={i % 3 === 0 ? '#FF9B7D' : i % 3 === 1 ? '#C9A7EB' : '#F6EFE3'}
                opacity={0.45 + rnd(191, i) * 0.4}
              />
            );
          })}
        </g>
        <Glow x={ex} y={ey} r={420 * sc} kind={gk} o={0.3} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g opacity={0.78}>
        <polygon
          points={`${W * 0.86},${H + 40} ${W * 0.94},${ground - 40} ${W + 80},${ground - 90} ${W + 80},${H + 40}`}
          fill="#0B0917"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
      </g>
    );
  }

  // mid layer
  const tileCount = Math.round(scan * 8);
  const sweepAngle = -14 + Math.sin(ph * 0.03) * (scan > 0 ? 11 : 4) + (scan - 0.5) * 14;
  const hitMoment = 0.48;
  const catchProgress =
    catchVal >= 0.99
      ? easeOut(clamp(p / hitMoment))
      : catchVal > 0
        ? lerp(catchVal * 0.75, catchVal * 0.92, easeOut(p))
        : 0;
  const flash = catchVal >= 0.99 && p > hitMoment ? Math.max(0, 1 - (p - hitMoment) * 2.4) : 0;

  return (
    <g>
      {/* Plane 1: Cream square survey tiles left by Euclid's scan */}
      {tileCount > 0 ? (
        <g>
          {Array.from({ length: tileCount }).map((_, i) => {
            const tx = (0.14 + (i % 4) * 0.11) * W;
            const ty = (vert ? 0.36 : 0.28) * H + Math.floor(i / 4) * 105 * sc;
            const tw = 88 * sc;
            const pop = backOut(clamp((t - i * 3) / 7));
            return (
              <g key={i} transform={`translate(${tx} ${ty}) scale(${pop})`}>
                <rect x={-tw / 2} y={-tw / 2} width={tw} height={tw} rx={6} fill={PALETTE.cream} fillOpacity={0.09} stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.68} />
                <circle cx={0} cy={0} r={4 * sc} fill={PALETTE.cyan} opacity={0.75} />
              </g>
            );
          })}
        </g>
      ) : null}

      {/* Plane 2: Euclid spacecraft + FOV cone + incoming red spark */}
      <g transform={`translate(${ex} ${ey}) scale(${euScale}) rotate(-14)`}>
        {/* Cyan field-of-view cone reaching out of the aperture (-95, -24) */}
        <g transform={`translate(-95 -24) rotate(${sweepAngle})`}>
          <Cone d="M 0 -18 L -520 -135 L -520 135 L 0 18 Z" o={0.28 + scan * 0.14} />
          <line x1={0} y1={-18} x2={-520} y2={-135} stroke="#64D2FF" strokeWidth={2.5} opacity={0.55} />
          <line x1={0} y1={18} x2={-520} y2={135} stroke="#64D2FF" strokeWidth={2.5} opacity={0.55} />
        </g>

        {/* Gold service module below */}
        <path
          d="M 10 42 L 105 42 L 116 96 L -4 96 Z"
          fill="#E6A532"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <line x1={38} y1={42} x2={34} y2={96} stroke="#AD7014" strokeWidth={3} />
        <line x1={74} y1={42} x2={78} y2={96} stroke="#AD7014" strokeWidth={3} />
        <rect x={28} y={96} width={22} height={14} rx={3} fill="#444C66" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        <rect x={64} y={96} width={22} height={14} rx={3} fill="#444C66" stroke={DARK_OUTLINE} strokeWidth={3.5} />

        {/* White-silver telescope tube body */}
        <rect x={-95} y={-68} width={215} height={112} rx={12} fill="#EAEFF8" stroke={DARK_OUTLINE} strokeWidth={4} />
        <rect x={-95} y={4} width={215} height={40} rx={8} fill="#BFC9DE" opacity={0.7} />
        <line x1={-32} y1={-68} x2={-32} y2={44} stroke="#8B96B0" strokeWidth={3.5} />
        <line x1={42} y1={-68} x2={42} y2={44} stroke="#8B96B0" strokeWidth={3.5} />
        {/* Dark open telescope aperture facing left */}
        <ellipse cx={-95} cy={-12} rx={18} ry={54} fill="#0B0914" stroke={DARK_OUTLINE} strokeWidth={4} />
        <ellipse cx={-95} cy={-12} rx={11} ry={40} fill="none" stroke="#64D2FF" strokeWidth={2.5} opacity={0.55} />

        {/* Large flat dark-blue solar-panel sunshield */}
        <polygon
          points="-68,-118 118,-132 134,112 -46,126"
          fill="#1B3568"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
          opacity={0.94}
        />
        <g stroke="#3966BA" strokeWidth={2.5} opacity={0.65}>
          <line x1={-12} y1={-122} x2={8} y2={120} />
          <line x1={52} y1={-127} x2={72} y2={116} />
          <line x1={-60} y1={-40} x2={124} y2={-52} />
          <line x1={-54} y1={42} x2={128} y2={30} />
        </g>

        {/* Incoming red photon spark */}
        {catchVal > 0 && catchProgress < 0.99 ? (
          <g transform={`translate(${lerp(-540, -95, catchProgress)} ${lerp(-95, -12, catchProgress)})`}>
            <Glow x={0} y={0} r={54} kind="red" o={0.75} />
            <line x1={-48} y1={-8} x2={0} y2={0} stroke="#FF6B6B" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
            <circle cx={0} cy={0} r={10} fill="#FF3B3B" stroke={DARK_OUTLINE} strokeWidth={3.5} />
          </g>
        ) : null}

        {/* Bright capture flash at aperture */}
        {flash > 0.02 ? (
          <g transform="translate(-95 -12)">
            <Glow x={0} y={0} r={160 * (1.2 - flash * 0.4)} kind="cool" o={flash * 0.9} />
            <circle cx={0} cy={0} r={lerp(18, 95, 1 - flash)} fill="none" stroke="#FFF4D6" strokeWidth={4.5} opacity={flash} />
            <circle cx={0} cy={0} r={22 * flash} fill="#FFFFFF" opacity={flash} />
          </g>
        ) : null}
      </g>

      {/* Plane 3: Subtle orbital dark rim ground */}
      <GroundPlane y={ground} fill="#0B0917" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[ex - 80 * sc, ey, 680 * sc]]} o={0.32} />
      <Dust t={t} seed={223} x0={0} y0={0} w={W} h={H} n={32} o={0.45} />
    </g>
  );
};
