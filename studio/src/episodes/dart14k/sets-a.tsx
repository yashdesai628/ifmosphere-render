import React from 'react';
import type { SetProps } from './render';
import { GroundPlane, PALETTE } from '../../brand';
import { Cone, Dust, Glow, LightVeil } from '../../engine/light';
import { Foreground, Rays, Stars } from '../../engine/kit';
import { clamp, easeInOut, easeOut, lerp, rnd } from '../../engine/anim';

const DARK_OUTLINE = '#121019';

/** Helper: deterministic lumpy asteroid path centered at (0, 0). */
export const asteroidPath = (seed: number, rx: number, ry: number, pts = 20, amp = 0.13) => {
  let d = '';
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const j = 1 + (rnd(seed, i) - 0.5) * 2 * amp;
    const x = Math.cos(a) * rx * j;
    const y = Math.sin(a) * ry * j;
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} Z`;
};

/** 1. VANDENBERG LAUNCH PAD AT NIGHT */
export const LaunchSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const baseT = clamp(Number(sp.t ?? 0));
  // Smooth liftoff progression across shot when ignited; subtle rumble on pad
  const seqT =
    baseT >= 0.5
      ? clamp(lerp(Math.max(0.42, baseT - 0.35), Math.min(1, baseT + 0.18), easeInOut(p)))
      : baseT >= 0.15
        ? clamp(baseT + lerp(-0.03, 0.06, easeInOut(p)))
        : baseT;
  const liftFrac = clamp((seqT - 0.38) / 0.62);
  const padX = W * (vert ? 0.74 : 0.77);
  const scale = Math.min(W, H) / 1080;
  const rocketRise = liftFrac * H * (vert ? 0.65 : 0.92);
  const rumble = seqT > 0.18 ? Math.sin(t * 2.3) * (1.5 + 3.5 * clamp((seqT - 0.18) / 0.4)) : 0;
  const ignite = clamp((seqT - 0.12) / 0.32);

  if (layer === 'far') {
    const sweep = Math.sin(t / 32) * 140;
    return (
      <g>
        <defs>
          <linearGradient id={`${id}sky`} x1="0" y1={-0.6 * H} x2="0" y2={ground + 80} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#070718" />
            <stop offset="58%" stopColor="#0D112C" />
            <stop offset="100%" stopColor={ignite > 0.4 ? '#35223C' : '#182144'} />
          </linearGradient>
        </defs>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill={`url(#${id}sky)`} />
        <Stars seed={201} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={ground + 0.7 * H} t={t} n={140} o={0.85} />
        <Rays x={padX + sweep * 0.2} y={ground - 60} t={t} len={1800} n={12} o={0.09 + ignite * 0.14} color={ignite > 0.4 ? '#FFCA80' : '#B7CEFF'} />
        {/* Distant California coastal mountain range */}
        <path
          d={`M ${-0.8 * W} ${ground} L ${-0.3 * W} ${ground - 95 * scale} L ${0.08 * W} ${ground - 55 * scale} L ${0.32 * W} ${ground - 135 * scale} L ${0.58 * W} ${ground - 70 * scale} L ${0.88 * W} ${ground - 120 * scale} L ${1.6 * W} ${ground - 40 * scale} L ${1.8 * W} ${ground + 40} L ${-0.8 * W} ${ground + 40} Z`}
          fill="#11162F"
        />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <GroundPlane y={ground + 44 * scale} fill="#0D0F20" rim="#5A6C9C" />
        <Foreground blur={8}>
          {/* Dark foreground coastal fence & cable stanchions at outer frame edges */}
          <path
            d={`M ${-0.3 * W} ${ground + 160} L ${0.04 * W} ${ground - 85 * scale} L ${0.09 * W} ${ground + 160} Z`}
            fill="#0A0B18"
          />
          <path
            d={`M ${0.93 * W} ${ground + 160} L ${0.97 * W} ${ground - 75 * scale} L ${1.3 * W} ${ground + 160} Z`}
            fill="#0A0B18"
          />
        </Foreground>
      </g>
    );
  }

  // mid layer
  const gantryX = padX + 94 * scale;
  const gantryH = 490 * scale;
  const rocketH = 445 * scale;
  const rocketY = ground - 26 * scale - rocketRise;
  const armRetract = clamp(liftFrac * 2.5);
  const beaconOn = Math.sin(t / 9) > 0;
  const plumeLen = (90 + 390 * clamp((seqT - 0.18) / 0.65)) * scale * (0.94 + 0.06 * Math.sin(t * 1.9));

  return (
    <g>
      {/* Plane 1: Back lightning protection towers & coastal horizon structures */}
      {[-340, 290].map((dx, i) => {
        const tx = padX + dx * scale;
        const th = (i === 0 ? 390 : 420) * scale;
        return (
          <g key={i} transform={`translate(${tx} ${ground})`}>
            <path d={`M -16 0 L -5 ${-th} L 5 ${-th} L 16 0 Z`} fill="#1A1F38" stroke={DARK_OUTLINE} strokeWidth={3.5} />
            <circle cx={0} cy={-th - 6} r={5} fill={beaconOn ? '#FF5A4A' : '#5E1C1A'} />
            {beaconOn ? <Glow x={0} y={-th - 6} r={34} kind="red" o={0.7} /> : null}
          </g>
        );
      })}
      {/* Distant coastal trees/structures */}
      <path
        d={`M ${-0.5 * W} ${ground} Q ${0.1 * W} ${ground - 48 * scale} ${0.35 * W} ${ground} T ${1.4 * W} ${ground} Z`}
        fill="#161B33"
      />

      {/* Plane 2: Floodlights, gantry, rocket, exhaust */}
      {/* Pad floodlight towers */}
      {[-210, 215].map((dx, i) => {
        const fx = padX + dx * scale;
        const fh = 230 * scale;
        const aimDir = dx < 0 ? 1 : -1;
        return (
          <g key={i} transform={`translate(${fx} ${ground})`}>
            <line x1={0} y1={0} x2={0} y2={-fh} stroke="#232944" strokeWidth={8 * scale} />
            <rect x={-20 * scale} y={-fh - 14 * scale} width={40 * scale} height={18 * scale} rx={4} fill="#2A3150" stroke={DARK_OUTLINE} strokeWidth={3.5} />
            <circle cx={aimDir * 10 * scale} cy={-fh - 5 * scale} r={7 * scale} fill="#FFE9B5" />
            <Cone
              d={`M ${aimDir * 10 * scale} ${-fh} L ${aimDir * 24 * scale} ${-fh - 10 * scale} L ${aimDir * 290 * scale} 0 L ${aimDir * 60 * scale} 0 Z`}
              o={0.22 + 0.04 * Math.sin(t / 15 + i)}
            />
            <Glow x={aimDir * 10 * scale} y={-fh - 5 * scale} r={115 * scale} kind="warm" o={0.62} />
          </g>
        );
      })}

      {/* Dark steel launch gantry */}
      <g transform={`translate(${gantryX} ${ground})`}>
        <rect x={-32 * scale} y={-gantryH} width={64 * scale} height={gantryH} fill="#21263D" stroke={DARK_OUTLINE} strokeWidth={4} />
        {Array.from({ length: 8 }).map((_, k) => {
          const y0 = -k * (gantryH / 8);
          const y1 = -(k + 1) * (gantryH / 8);
          return (
            <path
              key={k}
              d={`M ${-30 * scale} ${y0} L ${30 * scale} ${y1} M ${30 * scale} ${y0} L ${-30 * scale} ${y1}`}
              stroke="#121019"
              strokeWidth={3}
              opacity={0.75}
            />
          );
        })}
        {/* Swing umbilical arm */}
        <g transform={`translate(${-30 * scale} ${-gantryH * 0.62}) rotate(${armRetract * 36})`}>
          <rect x={-72 * scale} y={-8 * scale} width={72 * scale} height={14 * scale} rx={4} fill="#363E60" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        </g>
        {/* Gantry beacon & status lamps */}
        <circle cx={0} cy={-gantryH - 12 * scale} r={6 * scale} fill={beaconOn ? '#FF6A3D' : '#63261B'} />
        {beaconOn ? <Glow x={0} y={-gantryH - 12 * scale} r={42 * scale} kind="red" o={0.75} /> : null}
      </g>

      {/* Pre-ignition cryo venting wisps */}
      {seqT < 0.45 ? (
        <g opacity={0.42}>
          {Array.from({ length: 5 }).map((_, i) => {
            const phase = ((t * 0.025 + i * 0.2) % 1);
            return (
              <circle
                key={i}
                cx={padX - (26 + phase * 65) * scale}
                cy={rocketY - 190 * scale - phase * 42 * scale}
                r={(10 + phase * 18) * scale}
                fill="#DCE8FF"
                opacity={(1 - phase) * 0.55}
              />
            );
          })}
        </g>
      ) : null}

      {/* Tall white-silver Falcon-style rocket */}
      <g transform={`translate(${padX + rumble} ${rocketY})`}>
        {/* Exhaust plume when ignited */}
        {ignite > 0.05 ? (
          <g>
            <Glow x={0} y={plumeLen * 0.35} r={190 * scale * (0.6 + 0.5 * ignite)} kind="warm" o={0.85} />
            <path
              d={`M ${-22 * scale} 0 Q ${-36 * scale} ${plumeLen * 0.45} 0 ${plumeLen} Q ${36 * scale} ${plumeLen * 0.45} ${22 * scale} 0 Z`}
              fill="#FF8A3D"
            />
            <path
              d={`M ${-13 * scale} 0 Q ${-22 * scale} ${plumeLen * 0.38} 0 ${plumeLen * 0.76} Q ${22 * scale} ${plumeLen * 0.38} ${13 * scale} 0 Z`}
              fill="#FFD26A"
            />
            <path
              d={`M ${-6 * scale} 0 Q ${-10 * scale} ${plumeLen * 0.22} 0 ${plumeLen * 0.46} Q ${10 * scale} ${plumeLen * 0.22} ${6 * scale} 0 Z`}
              fill="#FFFDF2"
            />
          </g>
        ) : null}

        {/* Booster legs & engine skirt */}
        <path d={`M ${-24 * scale} 0 L ${-18 * scale} ${-26 * scale} L ${18 * scale} ${-26 * scale} L ${24 * scale} 0 Z`} fill="#2C324B" stroke={DARK_OUTLINE} strokeWidth={4} />
        {/* Main white-silver fuselage */}
        <rect x={-18 * scale} y={-rocketH * 0.82} width={36 * scale} height={rocketH * 0.77} fill="#E4EAF5" stroke={DARK_OUTLINE} strokeWidth={4} />
        {/* Shaded right half */}
        <rect x={2 * scale} y={-rocketH * 0.82} width={15 * scale} height={rocketH * 0.77} fill="#B8C4DC" />
        {/* Dark interstage band */}
        <rect x={-18 * scale} y={-rocketH * 0.65} width={36 * scale} height={32 * scale} fill="#252A42" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        {/* Payload fairing */}
        <path
          d={`M ${-21 * scale} ${-rocketH * 0.82} L ${-21 * scale} ${-rocketH * 0.91} Q ${-21 * scale} ${-rocketH} 0 ${-rocketH - 18 * scale} Q ${21 * scale} ${-rocketH} ${21 * scale} ${-rocketH * 0.91} L ${21 * scale} ${-rocketH * 0.82} Z`}
          fill="#EDF1FA"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
        <path d={`M 0 ${-rocketH - 15 * scale} Q ${20 * scale} ${-rocketH} ${20 * scale} ${-rocketH * 0.91} L ${20 * scale} ${-rocketH * 0.82} L 2 ${-rocketH * 0.82} Z`} fill="#C2CCE0" opacity={0.65} />
        {/* Pale left rim highlight */}
        <line x1={-15 * scale} y1={-rocketH * 0.81} x2={-15 * scale} y2={-30 * scale} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.7} />
      </g>

      {/* Billowing launch smoke clouds at the pad */}
      {ignite > 0.15 ? (
        <g>
          {Array.from({ length: 10 }).map((_, i) => {
            const dir = i % 2 === 0 ? -1 : 1;
            const spread = (40 + i * 38) * scale * (0.4 + 0.75 * ignite) + Math.sin(t / 12 + i) * 14;
            const r = (24 + (i % 4) * 14) * scale * (0.6 + 0.6 * ignite);
            return (
              <circle
                key={i}
                cx={padX + dir * spread}
                cy={ground - (10 + (i % 3) * 18) * scale}
                r={r}
                fill={i % 3 === 0 ? '#E8D8C8' : '#A9B2C8'}
                stroke={DARK_OUTLINE}
                strokeWidth={3.5}
                opacity={0.78}
              />
            );
          })}
        </g>
      ) : null}

      {/* Plane 3: Concrete launch apron + rim */}
      <GroundPlane y={ground} fill="#1E233A" rim={ignite > 0.3 ? '#FFB870' : '#8EA4D8'} />
      {/* Pad clamp base */}
      <rect x={padX - 66 * scale} y={ground - 28 * scale} width={132 * scale} height={32 * scale} rx={5} fill="#2B314D" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={padX - 48 * scale} y={ground - 18 * scale} width={96 * scale} height={10 * scale} fill="#F2B33D" opacity={0.75} />

      <LightVeil
        id={`${id}veil`}
        lights={[
          [padX, ground - 160 * scale, 480 * scale],
          [padX, rocketY - 120 * scale, 340 * scale],
        ]}
        o={0.34}
      />
      <Dust t={t} seed={211} x0={0} y0={0.2 * H} w={W} h={ground - 0.2 * H} n={34} o={ignite > 0.3 ? 0.65 : 0.35} />
    </g>
  );
};

/** 2. DEEP SPACE IN MOTION (CRUISE) */
export const CruiseSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const glowName = String(sp.glow ?? 'gold');
  const rayColor = glowName === 'cyan' ? '#6CE5FF' : '#FFD26A';
  const glowKind = glowName === 'cyan' ? 'cool' : 'warm';
  const baseT = clamp(Number(sp.t ?? 0.5));
  const prog = clamp(baseT + lerp(-0.04, 0.06, easeInOut(p)));
  const targetX = W * (vert ? 0.73 : 0.78);
  const targetY = H * (vert ? 0.45 : 0.42);
  const scale = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <linearGradient id={`${id}neb`} x1="0" y1="0" x2={W} y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#080614" />
            <stop offset="55%" stopColor="#121432" />
            <stop offset="100%" stopColor="#0B0E24" />
          </linearGradient>
        </defs>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill={`url(#${id}neb)`} />
        <Stars seed={305} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={2.4 * H} t={t} n={150} o={0.85} />
        <Rays x={targetX} y={targetY} t={t} len={1700} n={14} o={0.13} color={rayColor} />
        {/* Flowing star streaks */}
        <g opacity={0.45}>
          {Array.from({ length: 26 }).map((_, i) => {
            const span = W * 1.8;
            const speed = 4.5 + rnd(307, i) * 7.5;
            const x = -0.4 * W + ((((rnd(308, i) * span - t * speed) % span) + span) % span);
            const y = -0.3 * H + rnd(309, i) * (H * 1.4);
            const len = (24 + rnd(310, i) * 75) * scale;
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x + len}
                y2={y + len * 0.08}
                stroke={i % 4 === 0 ? rayColor : '#DCE6FF'}
                strokeWidth={1.6 + rnd(311, i) * 1.6}
                strokeLinecap="round"
                opacity={0.35 + 0.4 * rnd(312, i)}
              />
            );
          })}
        </g>
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Foreground blur={6}>
          {Array.from({ length: 6 }).map((_, i) => {
            const span = W * 1.6;
            const speed = 11 + i * 2.5;
            const x = -0.3 * W + ((((rnd(321, i) * span - t * speed) % span) + span) % span);
            const y = i % 2 === 0 ? H * (0.04 + 0.06 * rnd(322, i)) : ground + (50 + 110 * rnd(323, i)) * scale;
            return <ellipse key={i} cx={x} cy={y} rx={26 * scale} ry={7 * scale} fill="#181C38" opacity={0.55} />;
          })}
        </Foreground>
      </g>
    );
  }

  // Target rock size: speck at prog=0.1 -> huge rock filling right third at prog=0.9
  const rockR = lerp(8, 225, Math.pow(prog, 1.85)) * scale;
  const rockRot = Math.sin(t / 50) * 6;
  const rockShape = asteroidPath(333, rockR, rockR * 0.84, 18, 0.14);

  return (
    <g>
      {/* Subtle space ground horizon strip for Pip's footing */}
      <GroundPlane y={ground} fill="#101228" rim={glowName === 'cyan' ? '#6DBFE8' : '#B7A27A'} />

      {/* Faint cream dotted trajectory line from left edge to target */}
      <path
        d={`M ${-0.3 * W} ${targetY + 85 * scale} Q ${W * 0.3} ${targetY + 45 * scale} ${targetX} ${targetY}`}
        fill="none"
        stroke={PALETTE.cream}
        strokeWidth={3.5}
        strokeDasharray="10 15"
        strokeDashoffset={-t * 1.8}
        opacity={0.44}
      />

      {/* Target glow & dot / asteroid */}
      <Glow x={targetX} y={targetY} r={Math.max(95 * scale, rockR * 2.1)} kind={glowKind} o={0.58} />
      {prog < 0.25 ? (
        <g transform={`translate(${targetX} ${targetY})`}>
          <circle r={Math.max(7, rockR * 0.9)} fill={PALETTE.cream} />
          <path d="M -26 0 L 26 0 M 0 -26 L 0 26" stroke={rayColor} strokeWidth={2.5} opacity={0.75} />
        </g>
      ) : (
        <g transform={`translate(${targetX} ${targetY}) rotate(${rockRot})`}>
          <path d={rockShape} fill="#7B8094" stroke={DARK_OUTLINE} strokeWidth={4} />
          {/* Shaded right half */}
          <path
            d={`M 0 ${-rockR * 0.8} A ${rockR * 0.95} ${rockR * 0.82} 0 0 1 0 ${rockR * 0.8} Q ${rockR * 0.25} 0 0 ${-rockR * 0.8} Z`}
            fill="#52566B"
            opacity={0.72}
          />
          {/* Pale rim light on left */}
          <path
            d={`M ${-rockR * 0.65} ${-rockR * 0.45} A ${rockR * 0.9} ${rockR * 0.8} 0 0 0 ${-rockR * 0.62} ${rockR * 0.48}`}
            fill="none"
            stroke="#C7D1E8"
            strokeWidth={3.5}
            opacity={0.75}
          />
          {/* Craters when rock grows */}
          {rockR > 28 * scale ? (
            <g>
              <ellipse cx={-rockR * 0.22} cy={-rockR * 0.18} rx={rockR * 0.16} ry={rockR * 0.12} fill="#5C6074" stroke={DARK_OUTLINE} strokeWidth={3} />
              <ellipse cx={rockR * 0.25} cy={rockR * 0.22} rx={rockR * 0.2} ry={rockR * 0.14} fill="#4A4E62" stroke={DARK_OUTLINE} strokeWidth={3} />
              <circle cx={-rockR * 0.12} cy={rockR * 0.34} r={rockR * 0.09} fill="#5C6074" stroke={DARK_OUTLINE} strokeWidth={2.5} />
            </g>
          ) : null}
        </g>
      )}

      <LightVeil id={`${id}veil`} lights={[[targetX, targetY, 520 * scale], [0.48 * W, ground - 110 * scale, 480 * scale]]} o={0.32} />
      <Dust t={t} seed={340} x0={0} y0={0.12 * H} w={W} h={0.72 * H} n={36} o={0.5} />
    </g>
  );
};

/** 3. THE DIDYMOS BINARY PAIR */
export const BinarySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const scale = Math.min(W, H) / 1080;
  const zoomVal = clamp(Number(sp.zoom ?? 0.4));
  const dartVal = clamp(Number(sp.dart ?? 0));
  const orbitT = clamp(Number(sp.t ?? 0.3)) + lerp(-0.03, 0.05, easeInOut(p));
  const zScale = lerp(0.58, 1.95, easeInOut(zoomVal));

  // Keep moonlet cleanly visible on front/right arc when t in 0.1..0.9
  const orbAngle = -0.35 + orbitT * Math.PI * 1.65;
  const sysX = W * (vert ? 0.56 : 0.6);
  const sysY = H * (vert ? 0.49 : 0.44);
  const orbRx = 265 * scale * zScale;
  const orbRy = 95 * scale * zScale;
  const dimX = sysX + Math.cos(orbAngle) * orbRx;
  const dimY = sysY + Math.sin(orbAngle) * orbRy;
  const dimFront = Math.sin(orbAngle) >= -0.15;

  // At high zoom (>0.7), focus more tightly on Dimorphos
  const focusShiftX = lerp(0, W * 0.54 - dimX, clamp((zoomVal - 0.55) / 0.45));
  const focusShiftY = lerp(0, H * (vert ? 0.48 : 0.42) - dimY, clamp((zoomVal - 0.55) / 0.45));
  const didyX = sysX + focusShiftX;
  const didyY = sysY + focusShiftY;
  const moonX = dimX + focusShiftX;
  const moonY = dimY + focusShiftY;

  const didyR = 128 * scale * zScale;
  const dimR = 36 * scale * zScale * (1 + 0.55 * clamp((zoomVal - 0.5) / 0.5));

  if (layer === 'far') {
    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill={PALETTE.space} />
        <Stars seed={401} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={2.4 * H} t={t} n={110} o={0.82} />
        <Glow x={0.08 * W} y={0.18 * H} r={340 * scale} kind="cool" o={0.35} />
        <Rays x={0.08 * W} y={0.18 * H} t={t} len={1900} n={10} o={0.09} color="#DCEBFF" />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Foreground blur={8}>
          <polygon
            points={`${-40},${ground + 110} ${0.06 * W},${ground - 40} ${0.11 * W},${ground + 130}`}
            fill="#14182B"
            opacity={0.75}
          />
          <polygon
            points={`${0.91 * W},${ground + 140} ${0.96 * W},${ground - 55} ${1.15 * W},${ground + 120}`}
            fill="#14182B"
            opacity={0.75}
          />
        </Foreground>
      </g>
    );
  }

  const ridgeDrift = Math.sin(t / 35) * didyR * 0.08;
  const renderDidymos = (
    <g transform={`translate(${didyX} ${didyY})`}>
      {/* Spinning-top shape with equatorial bulge */}
      <path
        d={`M 0 ${-didyR * 0.88} L ${didyR * 0.64} ${-didyR * 0.42} L ${didyR * 1.04} ${-didyR * 0.06} L ${didyR * 1.0} ${didyR * 0.14} L ${didyR * 0.58} ${didyR * 0.58} L 0 ${didyR * 0.88} L ${-didyR * 0.66} ${didyR * 0.52} L ${-didyR * 1.03} ${didyR * 0.08} L ${-didyR * 0.96} ${-didyR * 0.16} L ${-didyR * 0.58} ${-didyR * 0.54} Z`}
        fill="#767B90"
        stroke={DARK_OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* Shadow side */}
      <path
        d={`M ${didyR * 0.06} ${-didyR * 0.84} L ${didyR * 0.62} ${-didyR * 0.41} L ${didyR * 1.0} ${-didyR * 0.05} L ${didyR * 0.96} ${didyR * 0.13} L ${didyR * 0.56} ${didyR * 0.56} L 0 ${didyR * 0.84} Q ${didyR * 0.28} 0 ${didyR * 0.06} ${-didyR * 0.84} Z`}
        fill="#4E5368"
        opacity={0.82}
      />
      {/* Pale rim light on left */}
      <path
        d={`M ${-didyR * 0.55} ${-didyR * 0.51} L ${-didyR * 0.93} ${-didyR * 0.15} L ${-didyR * 0.99} ${didyR * 0.07} L ${-didyR * 0.62} ${didyR * 0.48}`}
        fill="none"
        stroke="#CED7EE"
        strokeWidth={4}
        opacity={0.78}
      />
      {/* Prominent equatorial ridge */}
      <path
        d={`M ${-didyR * 0.97} ${-didyR * 0.04} Q ${ridgeDrift} ${didyR * 0.18} ${didyR * 0.98} ${didyR * 0.04}`}
        fill="none"
        stroke="#B6C0DA"
        strokeWidth={Math.max(4, didyR * 0.05)}
        strokeLinecap="round"
        opacity={0.75}
      />
      {/* Craters & boulders */}
      <ellipse cx={-didyR * 0.34 + ridgeDrift * 0.5} cy={-didyR * 0.32} rx={didyR * 0.15} ry={didyR * 0.1} fill="#54596D" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      <ellipse cx={didyR * 0.32 + ridgeDrift * 0.5} cy={didyR * 0.3} rx={didyR * 0.18} ry={didyR * 0.11} fill="#3E4357" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      <polygon
        points={`${-didyR * 0.2},${didyR * 0.25} ${-didyR * 0.08},${didyR * 0.15} ${didyR * 0.02},${didyR * 0.28}`}
        fill="#8E94AB"
        stroke={DARK_OUTLINE}
        strokeWidth={3}
      />
    </g>
  );

  const dartProgress = clamp(dartVal + lerp(-0.03, 0.03, easeInOut(p)));
  const dartDist = lerp(420 * scale, dimR + 28 * scale, dartProgress);
  const dartX = moonX - dartDist;
  const dartY = moonY - dartDist * 0.16;

  const renderDimorphos = (
    <g>
      <g transform={`translate(${moonX} ${moonY}) rotate(${Math.sin(t / 30) * 4})`}>
        <path d={asteroidPath(412, dimR * 1.12, dimR * 0.88, 16, 0.12)} fill="#848A9F" stroke={DARK_OUTLINE} strokeWidth={4} />
        <path
          d={`M 0 ${-dimR * 0.84} A ${dimR * 1.05} ${dimR * 0.85} 0 0 1 0 ${dimR * 0.84} Q ${dimR * 0.28} 0 0 ${-dimR * 0.84} Z`}
          fill="#555A6E"
          opacity={0.82}
        />
        <path
          d={`M ${-dimR * 0.72} ${-dimR * 0.45} A ${dimR} ${dimR * 0.82} 0 0 0 ${-dimR * 0.7} ${dimR * 0.45}`}
          fill="none"
          stroke="#D2DAF0"
          strokeWidth={3.5}
          opacity={0.8}
        />
        {/* Boulders & craters */}
        <ellipse cx={-dimR * 0.28} cy={-dimR * 0.22} rx={dimR * 0.22} ry={dimR * 0.14} fill="#5C6175" stroke={DARK_OUTLINE} strokeWidth={3} />
        <ellipse cx={dimR * 0.24} cy={dimR * 0.22} rx={dimR * 0.2} ry={dimR * 0.13} fill="#44485B" stroke={DARK_OUTLINE} strokeWidth={3} />
        {zoomVal > 0.55 ? (
          <g>
            {[[-0.45, 0.18, 0.14], [0.05, -0.45, 0.13], [0.35, -0.15, 0.12], [-0.1, 0.42, 0.14]].map(([bx, by, br], k) => (
              <polygon
                key={k}
                points={`${(bx - br) * dimR},${(by + br * 0.6) * dimR} ${bx * dimR},${(by - br * 0.7) * dimR} ${(bx + br) * dimR},${(by + br * 0.5) * dimR}`}
                fill="#9CA3B8"
                stroke={DARK_OUTLINE}
                strokeWidth={3}
              />
            ))}
          </g>
        ) : null}
      </g>

      {/* Approach reticle + tiny DART spacecraft */}
      {dartVal > 0 ? (
        <g>
          <line
            x1={dartX + 16 * scale}
            y1={dartY + 3 * scale}
            x2={moonX - dimR * 0.8}
            y2={moonY}
            stroke="#56C2F0"
            strokeWidth={2.5}
            strokeDasharray="6 9"
            strokeDashoffset={-t * 1.6}
            opacity={0.65}
          />
          {/* Target brackets on Dimorphos */}
          <g stroke="#F2B33D" strokeWidth={3} fill="none" opacity={0.65 + 0.25 * Math.sin(t / 7)}>
            <path d={`M ${moonX - dimR - 14} ${moonY - dimR * 0.5} L ${moonX - dimR - 14} ${moonY - dimR - 10} L ${moonX - dimR * 0.5} ${moonY - dimR - 10}`} />
            <path d={`M ${moonX + dimR + 14} ${moonY + dimR * 0.5} L ${moonX + dimR + 14} ${moonY + dimR + 10} L ${moonX + dimR * 0.5} ${moonY + dimR + 10}`} />
          </g>
          {/* Tiny DART approaching from left */}
          <g transform={`translate(${dartX} ${dartY}) rotate(9)`}>
            <Glow x={-16 * scale} y={0} r={34 * scale} kind="cool" o={0.75} />
            <polygon points={`${-10 * scale},0 ${-36 * scale},${-5 * scale} ${-36 * scale},${5 * scale}`} fill="#4DE8FF" opacity={0.8} />
            <rect x={-10 * scale} y={-28 * scale} width={8 * scale} height={56 * scale} rx={2} fill="#F2B33D" stroke={DARK_OUTLINE} strokeWidth={3} />
            <rect x={-12 * scale} y={-10 * scale} width={22 * scale} height={20 * scale} rx={3} fill="#C6CFE3" stroke={DARK_OUTLINE} strokeWidth={3.5} />
            <circle cx={8 * scale} cy={0} r={4 * scale} fill="#4DE8FF" />
          </g>
        </g>
      ) : null}
    </g>
  );

  return (
    <g>
      <GroundPlane y={ground} fill="#0F1126" rim="#7284BB" />
      {/* Thin dashed cream orbital path */}
      <ellipse
        cx={didyX}
        cy={didyY}
        rx={orbRx}
        ry={orbRy}
        fill="none"
        stroke={PALETTE.cream}
        strokeWidth={2.5}
        strokeDasharray="9 14"
        opacity={0.34}
      />
      {dimFront ? renderDidymos : renderDimorphos}
      {dimFront ? renderDimorphos : renderDidymos}
      <LightVeil id={`${id}veil`} lights={[[didyX, didyY, 460 * scale], [moonX, moonY, 380 * scale]]} o={0.28} />
      <Dust t={t} seed={425} x0={0} y0={0.14 * H} w={W} h={0.68 * H} n={34} o={0.48} />
    </g>
  );
};

/** 4. IMPACT CLOSE-UP */
export const ImpactSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const scale = Math.min(W, H) / 1080;
  const baseT = clamp(Number(sp.t ?? 0.4));
  const debris = clamp(Number(sp.debris ?? 0.3));
  const seqT =
    baseT === 0.4
      ? clamp(0.36 + easeOut(p) * 0.14)
      : clamp(baseT + lerp(-0.06, 0.1, easeInOut(p)));

  const impX = W * (vert ? 0.38 : 0.42);
  const impY = H * (vert ? 0.56 : 0.62);
  const flash = Math.max(0, 1 - Math.abs(seqT - 0.41) / 0.16);
  const ejectaAmt = clamp(Math.max(debris, clamp((seqT - 0.4) / 0.5)));

  if (layer === 'far') {
    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill={PALETTE.space} />
        <Stars seed={501} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={H * 1.4} t={t} n={115} o={0.82} />
        <Rays x={impX} y={impY} t={t} len={1750} n={14} o={0.12 + flash * 0.32} color={flash > 0.2 ? '#FFE59E' : '#DCE6FF'} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Foreground blur={7}>
          <polygon
            points={`${-80},${ground + 150} ${0.06 * W},${ground - 45 * scale} ${0.14 * W},${ground + 150}`}
            fill="#141626"
          />
          <polygon
            points={`${0.88 * W},${ground + 150} ${0.95 * W},${ground - 55 * scale} ${1.2 * W},${ground + 150}`}
            fill="#141626"
          />
        </Foreground>
      </g>
    );
  }

  const dartFly = clamp(seqT / 0.4);
  const dartX = lerp(-0.1 * W, impX, easeInOut(dartFly));
  const dartY = lerp(impY - 260 * scale, impY, easeInOut(dartFly));

  return (
    <g>
      {/* Boulder-strewn asteroid slope filling lower half */}
      <path
        d={`M ${-0.6 * W} ${impY + 45 * scale} Q ${W * 0.12} ${impY - 40 * scale} ${impX} ${impY} T ${1.6 * W} ${impY + 35 * scale} L ${1.6 * W} ${1.5 * H} L ${-0.6 * W} ${1.5 * H} Z`}
        fill="#575B6F"
        stroke={DARK_OUTLINE}
        strokeWidth={4}
      />
      <path
        d={`M ${-0.6 * W} ${impY + 45 * scale} Q ${W * 0.12} ${impY - 40 * scale} ${impX} ${impY} T ${1.6 * W} ${impY + 35 * scale}`}
        fill="none"
        stroke="#BCC4DC"
        strokeWidth={3.5}
        opacity={0.7}
      />
      {/* Mid terrain boulders & craters */}
      {[0.14, 0.28, 0.58, 0.74, 0.87].map((bx, i) => (
        <g key={i} transform={`translate(${bx * W} ${impY + (28 + (i % 2) * 32) * scale})`}>
          <ellipse cx={0} cy={12 * scale} rx={36 * scale} ry={10 * scale} fill="#2A2D3D" opacity={0.45} />
          <polygon
            points={`${-28 * scale},${10 * scale} ${-16 * scale},${-20 * scale} ${12 * scale},${-14 * scale} ${28 * scale},${10 * scale}`}
            fill={i % 2 ? '#6E7389' : '#4D5164'}
            stroke={DARK_OUTLINE}
            strokeWidth={3.5}
          />
        </g>
      ))}

      {/* Long debris tail streaks streaming right at high ejecta */}
      {ejectaAmt > 0.35 ? (
        <g opacity={0.62 * ejectaAmt}>
          {Array.from({ length: 12 }).map((_, i) => {
            const ang = -14 - i * 4.5;
            const len = (240 + (i % 4) * 140) * scale * ejectaAmt;
            const drift = ((t * (1.2 + i * 0.15)) % 90) * scale;
            return (
              <line
                key={i}
                x1={impX + drift * 0.5}
                y1={impY - drift * 0.2}
                x2={impX + Math.cos((ang * Math.PI) / 180) * len + drift}
                y2={impY + Math.sin((ang * Math.PI) / 180) * len - drift * 0.35}
                stroke={i % 3 === 0 ? '#FFE2A6' : '#DCE2F2'}
                strokeWidth={(3 + (i % 3) * 2) * scale}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      ) : null}

      {/* Cone of ejecta dust & flying boulders spraying up and right */}
      {ejectaAmt > 0.04 ? (
        <g>
          <path
            d={`M ${impX} ${impY} L ${impX + 520 * scale * ejectaAmt} ${impY - 460 * scale * ejectaAmt} L ${impX + 660 * scale * ejectaAmt} ${impY - 110 * scale * ejectaAmt} Z`}
            fill="#E5DCC9"
            opacity={0.28 * ejectaAmt}
          />
          <path
            d={`M ${impX} ${impY} L ${impX + 340 * scale * ejectaAmt} ${impY - 370 * scale * ejectaAmt} L ${impX + 470 * scale * ejectaAmt} ${impY - 120 * scale * ejectaAmt} Z`}
            fill="#FFD48A"
            opacity={0.26 * ejectaAmt}
          />
          {Array.from({ length: Math.round(6 + ejectaAmt * 18) }).map((_, i) => {
            const prog = ((0.22 + rnd(521, i) * 0.78 + t * 0.008) % 1) * ejectaAmt;
            const ang = (-20 - rnd(522, i) * 52) * (Math.PI / 180);
            const dist = (70 + prog * 540) * scale;
            const rx = impX + Math.cos(ang) * dist;
            const ry = impY + Math.sin(ang) * dist + prog * prog * 85 * scale;
            const sz = (5 + rnd(523, i) * 14) * scale;
            return (
              <polygon
                key={i}
                points={`${rx - sz},${ry + sz * 0.5} ${rx},${ry - sz} ${rx + sz},${ry + sz * 0.3}`}
                fill={i % 3 === 0 ? '#A5ACBF' : '#73788E'}
                stroke={DARK_OUTLINE}
                strokeWidth={3}
                opacity={clamp(1.1 - prog * 0.4)}
              />
            );
          })}
        </g>
      ) : null}

      {/* Incoming DART streaking in from left before flash */}
      {seqT < 0.43 ? (
        <g transform={`translate(${dartX} ${dartY}) rotate(30)`}>
          <line x1={-220 * scale} y1={0} x2={-22 * scale} y2={0} stroke="#FFE2B0" strokeWidth={4} strokeDasharray="12 10" opacity={0.65} />
          <rect x={-12 * scale} y={-44 * scale} width={12 * scale} height={88 * scale} rx={3} fill="#F2B33D" stroke={DARK_OUTLINE} strokeWidth={3.5} />
          <rect x={-18 * scale} y={-15 * scale} width={36 * scale} height={30 * scale} rx={4} fill="#C5CEE2" stroke={DARK_OUTLINE} strokeWidth={4} />
          <circle cx={14 * scale} cy={0} r={5 * scale} fill="#4DE8FF" />
        </g>
      ) : null}

      {/* White-gold impact flash & shockwave */}
      {flash > 0.02 ? (
        <g transform={`translate(${impX} ${impY})`}>
          <Glow x={0} y={0} r={340 * scale * (0.4 + flash)} kind="warm" o={0.95 * flash} />
          <circle r={190 * scale * (1.25 - flash * 0.5)} fill="none" stroke="#FFD26A" strokeWidth={6} opacity={0.85 * flash} />
          <circle r={95 * scale * flash} fill="#FFD26A" opacity={0.9 * flash} />
          <circle r={48 * scale * flash} fill="#FFFDF2" opacity={flash} />
        </g>
      ) : null}

      {/* Foreground asteroid floor plane at ground */}
      <GroundPlane y={ground} fill="#72778D" rim="#D0D8EE" />
      <LightVeil id={`${id}veil`} lights={[[impX, impY, 540 * scale], [0.5 * W, ground - 90 * scale, 480 * scale]]} o={0.3} />
      <Dust t={t} seed={530} x0={0} y0={0.18 * H} w={W} h={0.64 * H} n={42} o={0.45 + 0.3 * ejectaAmt} />
    </g>
  );
};

/** 5. TOP-DOWN ORBIT DIAGRAM */
export const OrbitDiagSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const scale = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = H * (vert ? 0.49 : 0.44);
  const rOld = (vert ? 225 : 260) * scale;
  const shiftVal = clamp(Number(sp.shift ?? 0));
  const glowVal = Number(sp.glow ?? 0);
  const shiftAnim = shiftVal > 0 ? clamp(shiftVal * (0.65 + 0.35 * easeInOut(p))) : 0;
  const rNew = lerp(rOld, rOld * 0.77, shiftAnim);
  const orbitT = Number(sp.t ?? 0) + p * 0.18;
  const ang = orbitT * Math.PI * 2 - Math.PI * 0.35;
  const activeR = shiftAnim > 0.1 ? rNew : rOld;
  const mx = cx + Math.cos(ang) * activeR;
  const my = cy + Math.sin(ang) * activeR;
  const pulse = 0.5 + 0.5 * Math.sin(t / 9);

  if (layer === 'far') {
    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill="#080A1C" />
        <Stars seed={601} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={2.4 * H} t={t} n={75} o={0.6} />
        <Rays x={cx} y={cy} t={t} len={1600} n={12} o={glowVal > 0.5 ? 0.14 : 0.08} color={glowVal > 0.5 ? '#FFD26A' : '#B5C8FF'} />
        {/* Faint rotating schematic range circles */}
        {[1.35, 1.75].map((m, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={rOld * m}
            fill="none"
            stroke="#54659C"
            strokeWidth={2}
            strokeDasharray="6 18"
            opacity={0.22}
          />
        ))}
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Foreground blur={6}>
          <circle cx={0.04 * W} cy={0.12 * H} r={14 * scale} fill="#252C52" opacity={0.45} />
          <circle cx={0.96 * W} cy={ground + 65 * scale} r={18 * scale} fill="#252C52" opacity={0.45} />
        </Foreground>
      </g>
    );
  }

  return (
    <g>
      <GroundPlane y={ground} fill="#0F1228" rim="#6E82BD" />

      {/* Outer cream orbit ring */}
      <circle
        cx={cx}
        cy={cy}
        r={rOld}
        fill="none"
        stroke={PALETTE.cream}
        strokeWidth={shiftAnim > 0.1 ? 3 : 4}
        strokeDasharray={shiftAnim > 0.1 ? '10 12' : 'none'}
        opacity={shiftAnim > 0.1 ? 0.42 : 0.85}
      />

      {/* Second, slightly smaller gold orbit ring */}
      {shiftAnim > 0.04 ? (
        <g>
          {glowVal > 0.5 ? <Glow x={cx} y={cy} r={rNew * 1.45} kind="warm" o={0.34 + 0.14 * pulse} /> : null}
          <circle
            cx={cx}
            cy={cy}
            r={rNew}
            fill="none"
            stroke={PALETTE.gold}
            strokeWidth={glowVal > 0.5 ? 6 : 4.5}
            opacity={0.95}
          />
          {/* Inward shift arrows */}
          {[0.25, 1.85, 3.4, 5.0].map((a, i) => {
            const x0 = cx + Math.cos(a) * (rOld - 6 * scale);
            const y0 = cy + Math.sin(a) * (rOld - 6 * scale);
            const x1 = cx + Math.cos(a) * (rNew + 10 * scale);
            const y1 = cy + Math.sin(a) * (rNew + 10 * scale);
            const ax = Math.cos(a);
            const ay = Math.sin(a);
            return (
              <g key={i}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={PALETTE.gold} strokeWidth={4} />
                <polygon
                  points={`${x1},${y1} ${x1 + (ax * 12 - ay * 7) * scale},${y1 + (ay * 12 + ax * 7) * scale} ${x1 + (ax * 12 + ay * 7) * scale},${y1 + (ay * 12 - ax * 7) * scale}`}
                  fill={PALETTE.gold}
                />
              </g>
            );
          })}
        </g>
      ) : null}

      {/* Central Didymos disc */}
      <g transform={`translate(${cx} ${cy}) rotate(${t * 0.25})`}>
        <circle r={54 * scale} fill="#7B8094" stroke={DARK_OUTLINE} strokeWidth={4} />
        <path d={`M 0 ${-50 * scale} A ${50 * scale} ${50 * scale} 0 0 1 0 ${50 * scale} Q ${14 * scale} 0 0 ${-50 * scale} Z`} fill="#4E5368" opacity={0.75} />
        <path d={`M ${-36 * scale} ${-32 * scale} A ${48 * scale} ${48 * scale} 0 0 0 ${-36 * scale} ${32 * scale}`} fill="none" stroke="#CBD4EC" strokeWidth={3.5} opacity={0.75} />
        <ellipse cx={-16 * scale} cy={-12 * scale} rx={11 * scale} ry={8 * scale} fill="#595D70" stroke={DARK_OUTLINE} strokeWidth={2.5} />
        <ellipse cx={16 * scale} cy={14 * scale} rx={13 * scale} ry={9 * scale} fill="#3F4458" stroke={DARK_OUTLINE} strokeWidth={2.5} />
      </g>

      {/* Orbiting Dimorphos dot + wake */}
      <g>
        <path
          d={`M ${cx + Math.cos(ang - 0.35) * activeR} ${cy + Math.sin(ang - 0.35) * activeR} A ${activeR} ${activeR} 0 0 1 ${mx} ${my}`}
          fill="none"
          stroke={shiftAnim > 0.1 ? PALETTE.gold : PALETTE.cream}
          strokeWidth={4}
          opacity={0.45}
        />
        <circle cx={mx} cy={my} r={17 * scale} fill="#D9E0F0" stroke={DARK_OUTLINE} strokeWidth={4} />
        <circle cx={mx - 4 * scale} cy={my - 4 * scale} r={5 * scale} fill="#FFFFFF" opacity={0.7} />
      </g>

      <LightVeil id={`${id}veil`} lights={[[cx, cy, 480 * scale], [0.5 * W, ground - 100 * scale, 450 * scale]]} o={0.28} />
      <Dust t={t} seed={622} x0={0} y0={0.16 * H} w={W} h={0.68 * H} n={26} o={0.4} />
    </g>
  );
};
