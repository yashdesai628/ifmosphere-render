import React from 'react';
import { PALETTE, FONTS, GroundPlane, SpaceBackdrop } from '../../brand';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { DuskSky, NightSky, Stars, Rays } from '../../engine/kit';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import type { SetProps } from './render';
import { glowKind, glowHex, glowSoft, num, phaseOf } from './sets-a';

const DARK_OUTLINE = '#121019';

/**
 * 6. FIELD SET: Deep sky survey crowded with galaxies & spiked stars, zooming into one tiny red dot.
 */
export const FieldSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const zoom = clamp(num(sp, 'zoom', 0));
  const mark = clamp(num(sp, 'mark', 0));
  const count = clamp(num(sp, 'count', 0.3));
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const fx = 0.5 * W + Math.sin(ph * 0.015) * 6;
  const fy = (vert ? 0.45 : 0.46) * H + Math.cos(ph * 0.012) * 5;
  const fieldScale = lerp(1.0, 2.7, easeInOut(zoom)) * (1 + 0.03 * easeOut(p));

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#05040C" />
        <Stars seed={301} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={75} o={0.55} />
        <Glow x={fx} y={fy} r={340 * sc} kind={gk} o={0.22 + zoom * 0.2} />
      </g>
    );
  }

  if (layer === 'near') {
    const m = 48 * sc;
    return (
      <g opacity={0.28} stroke={PALETTE.cream} strokeWidth={2.5} fill="none">
        <path d={`M ${m} ${m + 34} L ${m} ${m} L ${m + 34} ${m}`} />
        <path d={`M ${W - m - 34} ${m} L ${W - m} ${m} L ${W - m} ${m + 34}`} />
        <path d={`M ${m} ${H - m - 34} L ${m} ${H - m} L ${m + 34} ${H - m}`} />
        <path d={`M ${W - m - 34} ${H - m} L ${W - m} ${H - m} L ${W - m} ${H - m - 34}`} />
      </g>
    );
  }

  // mid layer
  const totalObj = Math.round(lerp(80, 220, count));
  const galColors = ['#F6EFE3', '#C9A7EB', '#FF9D5C', '#D8C7F5'];
  const markDraw = mark > 0 ? easeOut(clamp((p + 0.15) / 0.65)) * mark : 0;

  return (
    <g>
      {/* Crowded field scaled smoothly toward the red dot */}
      <g transform={`translate(${fx} ${fy}) scale(${fieldScale})`}>
        {Array.from({ length: totalObj }).map((_, i) => {
          const ox = (rnd(311, i) - 0.5) * W * 1.45;
          const oy = (rnd(312, i) - 0.5) * H * 1.3;
          // Keep a clean pocket around the target red dot at (0,0)
          if (Math.hypot(ox, oy) < 46 * sc) return null;
          const batchFrac = i / 220;
          const fade = clamp((count + 0.38 - batchFrac) * 4, 0.2, 1);
          const tw = 0.8 + 0.2 * Math.sin(t * 0.08 + i);
          const kind = i % 7;

          if (kind === 0) {
            // Spiked bright star
            const sr = (4 + rnd(313, i) * 5) * sc;
            return (
              <g key={i} transform={`translate(${ox} ${oy})`} opacity={0.9 * fade * tw}>
                <line x1={-sr * 2.2} y1={0} x2={sr * 2.2} y2={0} stroke="#FFFFFF" strokeWidth={1.6 / Math.sqrt(fieldScale)} />
                <line x1={0} y1={-sr * 2.2} x2={0} y2={sr * 2.2} stroke="#FFFFFF" strokeWidth={1.6 / Math.sqrt(fieldScale)} />
                <circle cx={0} cy={0} r={sr * 0.55} fill="#FFFFFF" />
              </g>
            );
          }

          if (kind === 1) {
            // Mini spiral galaxy
            const gr = (9 + rnd(314, i) * 9) * sc;
            const col = galColors[i % galColors.length];
            const rot = rnd(315, i) * 360 + ph * 0.02;
            return (
              <g key={i} transform={`translate(${ox} ${oy}) rotate(${rot})`} opacity={0.82 * fade}>
                <path d={`M ${-gr} 0 Q ${-gr * 0.4} ${-gr * 0.65} 0 0 Q ${gr * 0.4} ${gr * 0.65} ${gr} 0`} fill="none" stroke={col} strokeWidth={2.4 / Math.sqrt(fieldScale)} strokeLinecap="round" />
                <circle cx={0} cy={0} r={gr * 0.28} fill="#FFF7DF" />
              </g>
            );
          }

          // Elliptical distant galaxy
          const rx = (5 + rnd(316, i) * 13) * sc;
          const ry = rx * (0.35 + rnd(317, i) * 0.35);
          const rot = rnd(318, i) * 180;
          const col = galColors[i % galColors.length];
          return (
            <ellipse
              key={i}
              cx={ox}
              cy={oy}
              rx={rx}
              ry={ry}
              transform={`rotate(${rot} ${ox} ${oy})`}
              fill={col}
              opacity={(0.52 + rnd(319, i) * 0.4) * fade}
            />
          );
        })}

        {/* The target tiny red dot at (0,0) */}
        <g>
          <Glow x={0} y={0} r={(26 / Math.sqrt(fieldScale)) * sc} kind="red" o={0.85} />
          <circle cx={0} cy={0} r={(7.5 / Math.sqrt(fieldScale)) * sc} fill="#FF3838" stroke={DARK_OUTLINE} strokeWidth={2.5 / Math.sqrt(fieldScale)} />
          <circle cx={0} cy={0} r={(3.2 / Math.sqrt(fieldScale)) * sc} fill="#FFB09E" />
        </g>
      </g>

      {/* Cream reticle circle + short leader line (screen-space crisp stroke) */}
      {markDraw > 0.04 ? (
        <g transform={`translate(${fx} ${fy}) scale(${sc})`}>
          <circle
            cx={0}
            cy={0}
            r={38}
            fill="none"
            stroke={PALETTE.cream}
            strokeWidth={3.5}
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={100 * (1 - markDraw)}
          />
          {markDraw > 0.45 ? (
            <g opacity={clamp((markDraw - 0.45) * 2.2)}>
              <polyline points="28,-28 64,-58 124,-58" fill="none" stroke={PALETTE.cream} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              <text x={132} y={-52} fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream} letterSpacing={1.5}>
                z = 8.13
              </text>
            </g>
          ) : null}
        </g>
      ) : null}

      {/* Subtle ground rim */}
      <GroundPlane y={ground} fill="#080612" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[fx, fy, 640 * sc]]} o={0.34} />
      <Dust t={t} seed={325} x0={0} y0={0} w={W} h={H} n={28} o={0.42} />
    </g>
  );
};

/**
 * 7. SPECTRUM SET: Redshift explained — wide rainbow strip into INFRARED + marker + wave + closing optical icon.
 */
export const SpectrumSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const z = clamp(num(sp, 'z', 0.3));
  const waveStretch = clamp(num(sp, 'wave', 0.3));
  const eyeVal = clamp(num(sp, 'eye', 0));
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const x0 = 0.1 * W;
  const x1 = 0.9 * W;
  const stripW = x1 - x0;
  const stripY = (vert ? 0.44 : 0.42) * H;
  const stripH = 82 * sc;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#080614" />
        <Stars seed={331} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={85} o={0.78} />
        <Glow x={lerp(x0 + stripW * 0.14, x1 - stripW * 0.08, z)} y={stripY + stripH / 2} r={340 * sc} kind={gk} o={0.38} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g opacity={0.65}>
        <polygon points={`-40,${H + 40} -40,${ground - 60} ${0.06 * W},${H + 40}`} fill="#0D0A1B" stroke={DARK_OUTLINE} strokeWidth={4} />
        <polygon points={`${W + 40},${H + 40} ${W + 40},${ground - 60} ${0.94 * W},${H + 40}`} fill="#0D0A1B" stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>
    );
  }

  // mid layer
  const irX = x0 + stripW * 0.74;
  const markerX = lerp(x0 + stripW * 0.15, x1 - stripW * 0.09, z);
  const markerBob = Math.sin(t * 0.14) * 3.5 * sc;

  // Wave trough below strip
  const troughY = stripY + stripH + 74 * sc;
  const waveLen = lerp(54, 240, easeInOut(waveStretch)) * sc;
  const waveAmp = 22 * sc;
  const waveX0 = x0 + 24 * sc;
  const waveX1 = x1 - 24 * sc;
  let waveD = '';
  for (let wx = waveX0; wx <= waveX1; wx += 10) {
    const wy = troughY + Math.sin(((wx - ph * 3.5) / waveLen) * Math.PI * 2) * waveAmp;
    waveD += `${wx === waveX0 ? 'M' : ' L'} ${wx.toFixed(1)} ${wy.toFixed(1)}`;
  }
  const waveStroke = waveStretch < 0.45 ? '#57C7FF' : waveStretch < 0.78 ? '#FF5A4A' : '#8A1C33';

  // Optical indicator above visible zone
  const eyeX = x0 + stripW * 0.36;
  const eyeY = stripY - 68 * sc;
  const closeAmt = clamp((eyeVal - 0.32) / 0.46, 0, 1);
  const lidY = lerp(-34, 30, easeInOut(closeAmt));

  return (
    <g>
      {/* Plane 1: Spectrum rainbow strip */}
      <defs>
        <linearGradient id={`${id}_rainbow`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C4DFF" />
          <stop offset="16%" stopColor="#3A86FF" />
          <stop offset="30%" stopColor="#2EC4B6" />
          <stop offset="44%" stopColor="#65D968" />
          <stop offset="56%" stopColor="#FFE066" />
          <stop offset="66%" stopColor="#FF8A3D" />
          <stop offset="75%" stopColor="#E83E3E" />
          <stop offset="81%" stopColor="#521020" />
          <stop offset="100%" stopColor="#240710" />
        </linearGradient>
      </defs>

      <rect x={x0} y={stripY} width={stripW} height={stripH} rx={14} fill={`url(#${id}_rainbow)`} stroke={DARK_OUTLINE} strokeWidth={4} />
      <line x1={irX} y1={stripY + 6} x2={irX} y2={stripY + stripH - 6} stroke={PALETTE.cream} strokeWidth={2.5} strokeDasharray="6 6" opacity={0.55} />
      <text
        x={(irX + x1) / 2}
        y={stripY + stripH / 2 + 8 * sc}
        textAnchor="middle"
        fontFamily={FONTS.ui}
        fontWeight={700}
        fontSize={22 * sc}
        fill={PALETTE.red}
        letterSpacing={2.5}
      >
        INFRARED
      </text>

      {/* Plane 2: Optical visibility indicator above visible band */}
      <g transform={`translate(${eyeX} ${eyeY}) scale(${sc})`}>
        <path d="M -52 0 Q 0 -36 52 0 Q 0 36 -52 0 Z" fill="#E3ECFF" stroke={DARK_OUTLINE} strokeWidth={4} />
        <clipPath id={`${id}_eyeclip`}>
          <path d="M -50 0 Q 0 -34 50 0 Q 0 34 -50 0 Z" />
        </clipPath>
        <g clipPath={`url(#${id}_eyeclip)`}>
          <circle cx={0} cy={0} r={19} fill={closeAmt > 0.6 ? '#6E4B63' : '#2FB7A6'} stroke={DARK_OUTLINE} strokeWidth={3.5} />
          <circle cx={0} cy={0} r={8.5} fill="#0D0B16" />
          <circle cx={-5} cy={-5} r={3.5} fill="#FFFFFF" />
          {/* Sweeping eyelid shutter */}
          <path d={`M -56 -40 L 56 -40 L 56 0 Q 0 ${lidY} -56 0 Z`} fill="#241F36" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        </g>
        <path d="M -52 0 Q 0 -36 52 0 Q 0 36 -52 0 Z" fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>

      {/* Sliding marker spark above strip */}
      <g transform={`translate(${markerX} ${stripY - 12 * sc + markerBob}) scale(${sc})`}>
        <Glow x={0} y={14} r={64} kind={gk} o={0.7} />
        <line x1={0} y1={14} x2={0} y2={stripH / sc + 16} stroke={PALETTE.cream} strokeWidth={3.5} opacity={0.85} />
        <polygon points="0,12 -16,-14 16,-14" fill={glowSoft(sp)} stroke={DARK_OUTLINE} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={0} cy={-26} r={9} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={3.5} />
      </g>

      {/* Stretched light-wave trough beneath the rainbow strip */}
      <g>
        <rect x={x0} y={troughY - 38 * sc} width={stripW} height={76 * sc} rx={14} fill="#120F21" stroke={DARK_OUTLINE} strokeWidth={4} />
        <path d={waveD} fill="none" stroke={DARK_OUTLINE} strokeWidth={11 * sc} strokeLinecap="round" />
        <path d={waveD} fill="none" stroke={waveStroke} strokeWidth={5.5 * sc} strokeLinecap="round" />
      </g>

      {/* Plane 3: Ground */}
      <GroundPlane y={ground} fill="#0D0A1B" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[markerX, stripY + stripH / 2, 650 * sc], [0.5 * W, ground - 90, 480 * sc]]} o={0.34} />
      <Dust t={t} seed={341} x0={0} y0={0} w={W} h={H} n={30} o={0.45} />
    </g>
  );
};

/**
 * 8. EARTHNIGHT SET: Starry night sky + Milky Way band + grassy hill + warm distant house lights + faint red dot.
 */
export const EarthNightSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const dot = clamp(num(sp, 'dot', 0));
  const milky = clamp(num(sp, 'milky', 0.3));
  const gHex = glowHex(sp);

  const dotX = 0.74 * W;
  const dotY = (vert ? 0.37 : 0.27) * H;
  const drift = Math.sin(ph * 0.012) * 8;

  if (layer === 'far') {
    return (
      <g>
        <NightSky id={`${id}_ns`} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.4} horizonY={ground} />
        <Stars seed={351} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={ground + H * 0.6} t={t} n={145} o={0.88} />

        {/* Milky Way diagonal band */}
        {milky > 0.02 ? (
          <g transform={`translate(${0.5 * W + drift} ${0.38 * H}) rotate(-26)`} opacity={milky * 0.75}>
            <ellipse cx={0} cy={0} rx={1100 * sc} ry={130 * sc} fill="#465A9E" opacity={0.28} />
            <ellipse cx={0} cy={0} rx={960 * sc} ry={74 * sc} fill="#7B82C4" opacity={0.25} />
            <ellipse cx={0} cy={0} rx={820 * sc} ry={34 * sc} fill="#FFE6C8" opacity={0.22} />
            <ellipse cx={0} cy={4} rx={880 * sc} ry={15 * sc} fill="#141830" opacity={0.55} />
            {Array.from({ length: 68 }).map((_, i) => (
              <circle
                key={i}
                cx={(rnd(361, i) - 0.5) * 1680 * sc}
                cy={(rnd(362, i) - 0.5) * 140 * sc}
                r={(0.8 + rnd(363, i) * 1.9) * sc}
                fill={i % 4 === 0 ? '#FFE8C8' : '#EBF2FF'}
                opacity={0.5 + 0.5 * Math.sin(t * 0.08 + i)}
              />
            ))}
          </g>
        ) : null}

        {/* Faint red quasar point high in the sky */}
        <g transform={`translate(${dotX} ${dotY}) scale(${sc})`}>
          <Glow x={0} y={0} r={22 + dot * 46} kind="red" o={0.2 + dot * 0.65} />
          <circle cx={0} cy={0} r={3.5 + dot * 4} fill="#FF4B4B" opacity={0.45 + dot * 0.55} />
          {dot > 0.25 ? (
            <circle
              cx={0}
              cy={0}
              r={24 + Math.sin(t * 0.14) * 3}
              fill="none"
              stroke={PALETTE.cream}
              strokeWidth={3}
              opacity={clamp((dot - 0.25) * 1.4)}
            />
          ) : null}
        </g>
      </g>
    );
  }

  if (layer === 'near') {
    const sway = Math.sin(ph * 0.03) * 6;
    return (
      <g opacity={0.9}>
        <path
          d={`M -80 ${H + 40} L -80 ${ground - 35} Q ${0.06 * W + sway} ${ground - 95} ${0.11 * W} ${ground + 30} L ${0.15 * W} ${H + 40} Z`}
          fill="#0B1118"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
        <path
          d={`M ${W + 80} ${H + 40} L ${W + 80} ${ground - 30} Q ${0.93 * W - sway} ${ground - 90} ${0.88 * W} ${ground + 35} L ${0.85 * W} ${H + 40} Z`}
          fill="#0B1118"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
      </g>
    );
  }

  // mid layer
  const hillTop = ground;
  return (
    <g>
      {/* Plane 1: Far dark hills silhouette */}
      <path
        d={`M -600 ${hillTop + 120} Q ${0.18 * W} ${hillTop - 95 * sc} ${0.46 * W} ${hillTop - 20 * sc} Q ${0.78 * W} ${hillTop - 110 * sc} ${W + 600} ${hillTop + 10} L ${W + 600} ${H + 600} L -600 ${H + 600} Z`}
        fill="#151D33"
        stroke={DARK_OUTLINE}
        strokeWidth={3.5}
      />

      {/* Distant tiny town cottages with warm glowing windows on the lower valley ridge */}
      {[
        { x: 0.17 * W, y: hillTop - 44 * sc, w: 32 },
        { x: 0.21 * W, y: hillTop - 40 * sc, w: 26 },
        { x: 0.82 * W, y: hillTop - 52 * sc, w: 34 },
        { x: 0.86 * W, y: hillTop - 46 * sc, w: 24 },
      ].map((h, i) => {
        const flick = 0.72 + 0.28 * Math.sin(t * 0.14 + i * 2.1);
        return (
          <g key={i} transform={`translate(${h.x} ${h.y}) scale(${sc})`}>
            <polygon points={`${-h.w / 2},0 ${-h.w / 2},-18 0,-28 ${h.w / 2},-18 ${h.w / 2},0`} fill="#0E1322" stroke={DARK_OUTLINE} strokeWidth={3} />
            <Glow x={0} y={-10} r={32} kind="warm" o={0.42 * flick} />
            <rect x={-7} y={-13} width={6} height={7} fill="#FFD67E" opacity={flick} />
            <rect x={3} y={-13} width={5} height={7} fill="#FFD67E" opacity={flick * 0.9} />
          </g>
        );
      })}

      {/* Plane 2: Soft foreground grassy hill crest aligned with ground */}
      <path
        d={`M -600 ${hillTop + 50} Q ${0.22 * W} ${hillTop - 8} ${0.5 * W} ${hillTop} Q ${0.78 * W} ${hillTop - 6} ${W + 600} ${hillTop + 55} L ${W + 600} ${H + 600} L -600 ${H + 600} Z`}
        fill="#1D333A"
        stroke={DARK_OUTLINE}
        strokeWidth={4}
      />
      <path
        d={`M -600 ${hillTop + 50} Q ${0.22 * W} ${hillTop - 8} ${0.5 * W} ${hillTop} Q ${0.78 * W} ${hillTop - 6} ${W + 600} ${hillTop + 55}`}
        fill="none"
        stroke="#5FA18C"
        strokeWidth={3.5}
        opacity={0.62}
      />

      {/* Plane 3: Grass tufts on the hill */}
      {[0.14, 0.34, 0.76, 0.9].map((gx, i) => (
        <path
          key={i}
          d={`M ${gx * W - 12} ${ground + 8} L ${gx * W - 6} ${ground - 12} L ${gx * W + 2} ${ground + 6} L ${gx * W + 9} ${ground - 10} L ${gx * W + 15} ${ground + 8}`}
          fill="none"
          stroke="#4A8574"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}

      <LightVeil id={`${id}_veil`} lights={[[0.5 * W, ground - 160 * sc, 650 * sc], [dotX, dotY, 360 * sc]]} o={0.28} />
      <Dust t={t} seed={367} x0={0} y0={0} w={W} h={H} n={26} o={0.4} />
    </g>
  );
};

/**
 * 9. GROWTH SET: Black hole growth chart from tiny seed to giant black hole across first 630 Myr.
 */
export const GrowthSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const grow = clamp(num(sp, 'grow', 0));
  const burst = clamp(num(sp, 'burst', 0));
  const gk = glowKind(sp);
  const gHex = glowHex(sp);

  const x0 = (vert ? 0.13 : 0.17) * W;
  const x1 = (vert ? 0.87 : 0.83) * W;
  const yBot = (vert ? 0.53 : 0.67) * H;
  const yTop = (vert ? 0.35 : 0.27) * H;
  const cw = x1 - x0;
  const ch = yBot - yTop;

  const rightX = x1 - 44 * sc;
  const rightY = yTop + 34 * sc;
  const growNow = grow > 0 ? lerp(grow * 0.72, grow, easeOut(clamp(p / 0.65))) : 0;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#080614" />
        <Stars seed={381} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={80} o={0.75} />
        <Glow x={rightX} y={rightY} r={(240 + growNow * 240) * sc} kind={gk} o={0.36} />
        <Rays x={rightX} y={rightY} t={ph * 0.5} len={900 * sc} n={10} o={0.09 + growNow * 0.08} color={glowSoft(sp)} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g opacity={0.4}>
        <rect x={0.04 * W} y={ground + 24} width={48 * sc} height={8} rx={4} fill={gHex} />
        <rect x={0.91 * W} y={ground + 24} width={48 * sc} height={8} rx={4} fill={gHex} />
      </g>
    );
  }

  // mid layer
  const seedX = x0 + 36 * sc;
  const seedY = yBot - 22 * sc;
  const curveD = `M ${seedX} ${seedY} C ${x0 + cw * 0.45} ${yBot - ch * 0.06}, ${x0 + cw * 0.68} ${yBot - ch * 0.52}, ${rightX} ${rightY}`;
  const bhScale = sc * lerp(0.32, 1.12, easeOut(growNow)) * (1 + 0.03 * Math.sin(t * 0.12));

  return (
    <g>
      {/* Plane 1: Chart grid & axes */}
      <g opacity={0.16}>
        {[0.25, 0.5, 0.75].map((u, i) => (
          <line key={i} x1={x0} y1={yBot - ch * u} x2={x1} y2={yBot - ch * u} stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="8 10" />
        ))}
      </g>

      <g>
        {/* Axes */}
        <polyline points={`${x0},${yTop} ${x0},${yBot} ${x1},${yBot}`} fill="none" stroke={DARK_OUTLINE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={`${x0},${yTop} ${x0},${yBot} ${x1},${yBot}`} fill="none" stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <text x={x0 - 18 * sc} y={(yTop + yBot) / 2} textAnchor="middle" transform={`rotate(-90 ${x0 - 18 * sc} ${(yTop + yBot) / 2})`} fontFamily={FONTS.ui} fontWeight={700} fontSize={20 * sc} fill={PALETTE.cream} letterSpacing={2}>
          MASS
        </text>
        <text x={(x0 + x1) / 2} y={yBot + 28 * sc} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20 * sc} fill={PALETTE.cream} letterSpacing={2}>
          TIME
        </text>

        {/* Cream bracket: FIRST 630 MILLION YEARS */}
        <path
          d={`M ${x0 + 14 * sc} ${yBot + 42 * sc} L ${x0 + 14 * sc} ${yBot + 54 * sc} L ${x1 - 14 * sc} ${yBot + 54 * sc} L ${x1 - 14 * sc} ${yBot + 42 * sc}`}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={3}
          opacity={0.78}
        />
        <text x={(x0 + x1) / 2} y={yBot + 80 * sc} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18 * sc} fill={PALETTE.gold} letterSpacing={1.5}>
          FIRST 630 MILLION YEARS
        </text>
      </g>

      {/* Plane 2: Curve + growth spurts + seed & giant black holes */}
      {growNow > 0.02 ? (
        <g>
          <path d={curveD} fill="none" stroke={DARK_OUTLINE} strokeWidth={11 * sc} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - growNow)} />
          <path d={curveD} fill="none" stroke={PALETTE.gold} strokeWidth={5.5 * sc} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - growNow)} />
        </g>
      ) : null}

      {/* Three jagged rapid growth-spurt steps */}
      {burst > 0.05 ? (
        <g>
          {[
            { bx: x0 + cw * 0.44, by: yBot - ch * 0.18, d: 0 },
            { bx: x0 + cw * 0.62, by: yBot - ch * 0.44, d: 4 },
            { bx: x0 + cw * 0.77, by: yBot - ch * 0.72, d: 8 },
          ].map((spurt, i) => {
            const pop = backOut(clamp((t - spurt.d) / 8)) * burst;
            return (
              <g key={i} transform={`translate(${spurt.bx} ${spurt.by}) scale(${sc * pop})`}>
                <Glow x={0} y={0} r={48} kind="red" o={0.65} />
                <polyline
                  points="-26,18 -6,18 -6,-4 10,-4 10,-26 28,-26"
                  fill="none"
                  stroke={DARK_OUTLINE}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="-26,18 -6,18 -6,-4 10,-4 10,-26 28,-26"
                  fill="none"
                  stroke="#FF5A4A"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={28} cy={-26} r={7} fill="#FFE2B0" stroke={DARK_OUTLINE} strokeWidth={3} />
              </g>
            );
          })}
        </g>
      ) : null}

      {/* Left: Tiny black-hole seed */}
      <g transform={`translate(${seedX} ${seedY}) scale(${sc})`}>
        <circle cx={0} cy={0} r={14} fill="none" stroke="#FFE2B0" strokeWidth={3} />
        <circle cx={0} cy={0} r={10} fill="#05040A" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      </g>

      {/* Right: Giant black hole with fiery orange accretion disc */}
      <g transform={`translate(${rightX} ${rightY}) scale(${bhScale}) rotate(-12)`}>
        <Glow x={0} y={0} r={115} kind="warm" o={0.65} />
        <ellipse cx={0} cy={0} rx={96} ry={28} fill="#FF6E38" stroke={DARK_OUTLINE} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={68} ry={19} fill="#F2B33D" />
        <circle cx={0} cy={0} r={30} fill="#05040A" stroke="#FFF4D6" strokeWidth={4} />
        <path d="M -96 0 A 96 28 0 0 0 96 0" fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>

      {/* Plane 3: Ground */}
      <GroundPlane y={ground} fill="#0D0A1C" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[0.5 * W, (yTop + yBot) / 2, 720 * sc]]} o={0.32} />
      <Dust t={t} seed={391} x0={0} y0={0} w={W} h={H} n={30} o={0.45} />
    </g>
  );
};

/**
 * 10. FORT SET: Dun Aonghasa cliff-edge stone fort on Inis Mor, Ireland, Atlantic Ocean & starry sky + red horizon star.
 */
export const FortSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const stars = clamp(num(sp, 'stars', 0.6));
  const gHex = glowHex(sp);

  const seaY = vert ? 0.56 * H : 0.62 * H;
  const redStarX = 0.78 * W;
  const redStarY = seaY - 96 * sc;

  if (layer === 'far') {
    return (
      <g>
        <DuskSky id={`${id}_dusk`} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.4} horizonY={seaY} />
        <rect x={-W * 0.7} y={-H * 0.7} width={W * 2.4} height={seaY + H * 0.7} fill="#0B1028" opacity={0.48 + stars * 0.28} />
        <Stars seed={401} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={seaY + H * 0.6} t={t} n={Math.round(45 + stars * 100)} o={0.4 + stars * 0.52} />

        {/* Atlantic Ocean below seaY */}
        <defs>
          <linearGradient id={`${id}_sea`} x1="0" y1={seaY} x2="0" y2={H * 1.4} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B3258" />
            <stop offset="45%" stopColor="#0E1D38" />
            <stop offset="100%" stopColor="#070E1F" />
          </linearGradient>
        </defs>
        <rect x={-W} y={seaY} width={W * 3} height={H * 2} fill={`url(#${id}_sea)`} />
        <line x1={-W} y1={seaY} x2={W * 2} y2={seaY} stroke="#E89D72" strokeWidth={2.5} opacity={0.45} />

        {/* Gentle Atlantic wave shimmer lines */}
        {Array.from({ length: 14 }).map((_, i) => {
          const wy = seaY + (24 + i * 32) * sc;
          const wx = (0.38 + rnd(405, i) * 0.52) * W + Math.sin(ph * 0.025 + i) * 18;
          return (
            <line
              key={i}
              x1={wx}
              y1={wy}
              x2={wx + (48 + rnd(406, i) * 65) * sc}
              y2={wy}
              stroke="#7EA6DB"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.28}
            />
          );
        })}

        {/* One small red star glowing over the horizon */}
        <g transform={`translate(${redStarX} ${redStarY}) scale(${sc})`}>
          <Glow x={0} y={0} r={75} kind="red" o={0.68} />
          <line x1={-14} y1={0} x2={14} y2={0} stroke="#FF8A7A" strokeWidth={2.5} opacity={0.85} />
          <line x1={0} y1={-14} x2={0} y2={14} stroke="#FF8A7A" strokeWidth={2.5} opacity={0.85} />
          <circle cx={0} cy={0} r={5.5} fill="#FF4444" stroke={DARK_OUTLINE} strokeWidth={2.5} />
        </g>
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g opacity={0.88}>
        <polygon
          points={`-80,${H + 40} -80,${ground + 5} ${0.06 * W},${ground - 42} ${0.13 * W},${H + 40}`}
          fill="#151924"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
      </g>
    );
  }

  // mid layer
  const cliffEdgeX = (vert ? 0.84 : 0.74) * W;
  return (
    <g>
      {/* Plane 1: Distant Aran coastal headland across the bay */}
      <path
        d={`M ${cliffEdgeX - 40} ${seaY + 2} L ${0.84 * W} ${seaY - 34 * sc} L ${W + 400} ${seaY - 12 * sc} L ${W + 400} ${seaY + 2} Z`}
        fill="#1D263E"
        stroke={DARK_OUTLINE}
        strokeWidth={3.5}
      />

      {/* Plane 2: Sheer limestone cliff + green turf plateau + Dun Aonghasa curved dry-stone walls */}
      {/* Sheer cliff drop */}
      <path
        d={`M -600 ${ground} L ${cliffEdgeX} ${ground} L ${cliffEdgeX + 24 * sc} ${ground + 95 * sc} L ${cliffEdgeX + 8 * sc} ${H + 400} L -600 ${H + 400} Z`}
        fill="#393D4D"
        stroke={DARK_OUTLINE}
        strokeWidth={4}
      />
      {/* Cliff vertical strata shadow facets */}
      <polygon
        points={`${cliffEdgeX - 85 * sc},${ground + 18 * sc} ${cliffEdgeX + 4 * sc},${ground + 24 * sc} ${cliffEdgeX + 18 * sc},${H + 100} ${cliffEdgeX - 110 * sc},${H + 100}`}
        fill="#272A36"
        opacity={0.75}
      />
      {/* White ocean surf foam at cliff base */}
      <path
        d={`M ${cliffEdgeX - 12 * sc} ${H - 28 * sc} Q ${cliffEdgeX + 45 * sc} ${H - 42 * sc} ${cliffEdgeX + 115 * sc} ${H - 22 * sc}`}
        fill="none"
        stroke="#DCE8FA"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.55 + 0.2 * Math.sin(ph * 0.04)}
      />

      {/* Curved concentric dry-stone walls of Dun Aonghasa behind Pip */}
      <g>
        {/* Outer stone rampart */}
        <path
          d={`M ${-220} ${ground + 4} Q ${0.22 * W} ${ground - 92 * sc} ${cliffEdgeX - 135 * sc} ${ground - 70 * sc} L ${cliffEdgeX - 110 * sc} ${ground + 4} Z`}
          fill="#62697A"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
        {/* Inner terraced dry-stone wall */}
        <path
          d={`M ${-160} ${ground + 4} Q ${0.24 * W} ${ground - 56 * sc} ${cliffEdgeX - 75 * sc} ${ground - 42 * sc} L ${cliffEdgeX - 55 * sc} ${ground + 4} Z`}
          fill="#7D8599"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
        {/* Individual dry-stone block seams */}
        {Array.from({ length: 16 }).map((_, i) => {
          const bx = (0.04 + i * 0.036) * W;
          const by = ground - (34 - Math.abs(i - 6) * 2.2) * sc;
          if (bx > cliffEdgeX - 90 * sc) return null;
          return <rect key={i} x={bx} y={by} width={22 * sc} height={11 * sc} rx={2} fill="#8E96AB" stroke={DARK_OUTLINE} strokeWidth={2.5} opacity={0.75} />;
        })}
      </g>

      {/* Lush green grass top along cliff plateau */}
      <path
        d={`M -600 ${ground} L ${cliffEdgeX} ${ground} L ${cliffEdgeX - 8} ${ground + 26 * sc} L -600 ${ground + 34 * sc} Z`}
        fill="#2C5E46"
        stroke={DARK_OUTLINE}
        strokeWidth={4}
      />
      <line x1={-600} y1={ground} x2={cliffEdgeX} y2={ground} stroke="#63B87E" strokeWidth={3.5} opacity={0.75} />

      {/* Plane 3: Grass tufts along ground */}
      {[0.18, 0.36, 0.62].map((gx, i) => (
        <path
          key={i}
          d={`M ${gx * W - 10} ${ground + 4} L ${gx * W - 4} ${ground - 12} L ${gx * W + 3} ${ground + 3} L ${gx * W + 10} ${ground - 9} L ${gx * W + 16} ${ground + 4}`}
          fill="none"
          stroke="#4F966A"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}

      <LightVeil id={`${id}_veil`} lights={[[0.5 * W, ground - 160 * sc, 720 * sc], [redStarX, redStarY, 320 * sc]]} o={0.28} />
      <Dust t={t} seed={413} x0={0} y0={0} w={W} h={H} n={24} o={0.38} />
    </g>
  );
};

/**
 * 11. VOID SET: Plain deep-navy SpaceBackdrop stage with slow tinted rays and minimal stars.
 */
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const sc = Math.min(W, H) / 1080;
  const ph = phaseOf(sp, t);
  const gk = glowKind(sp);
  const gHex = glowHex(sp);
  const gSoft = glowSoft(sp);

  if (layer === 'far') {
    return (
      <g>
        <SpaceBackdrop t={t} seed={421} />
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#080614" opacity={0.82} />
        <Stars seed={427} x0={-W * 0.6} y0={-H * 0.6} w={W * 2.2} h={H * 2.2} t={t} n={22} o={0.45} />
        <Rays x={0.5 * W} y={0.22 * H} t={ph * 0.55} len={1700 * sc} n={12} o={0.14} color={gSoft} />
        <Glow x={0.5 * W} y={0.42 * H} r={540 * sc} kind={gk} o={0.3} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g opacity={0.28}>
        <circle cx={0.08 * W} cy={0.88 * H} r={6} fill={gSoft} />
        <circle cx={0.92 * W} cy={0.86 * H} r={5} fill={gSoft} />
      </g>
    );
  }

  // mid layer: subtle concentric stage rings + grounded plane
  return (
    <g>
      <g transform={`translate(${0.5 * W} ${0.46 * H}) rotate(${ph * 0.08})`} opacity={0.09}>
        <circle cx={0} cy={0} r={340 * sc} fill="none" stroke={gHex} strokeWidth={2.5} strokeDasharray="18 22" />
        <circle cx={0} cy={0} r={490 * sc} fill="none" stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="10 28" />
      </g>
      <GroundPlane y={ground} fill="#0A0718" rim={gHex} />
      <LightVeil id={`${id}_veil`} lights={[[0.5 * W, 0.45 * H, 760 * sc]]} o={0.34} />
      <Dust t={t} seed={433} x0={0} y0={0} w={W} h={H} n={22} o={0.38} />
    </g>
  );
};
