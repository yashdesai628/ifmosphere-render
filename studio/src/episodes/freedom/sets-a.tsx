import React from 'react';
import { SetProps } from './render';
import { PALETTE, FONTS, BrandChip, GroundPlane, SpaceBackdrop } from '../../brand';
import { clamp, easeInOut, easeOut, lerp } from '../../engine/anim';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Rays, Bokeh } from '../../engine/kit';
import { DARK_LINE, FreedomShipVector, FullStars, getGlowTheme } from './sets-helpers';

// ---------------------------------------------------------------- SET 1: ship
export const ShipSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const bg = (sp.bg as string | undefined) ?? 'stars';
  const reactor = (sp.reactor as number | undefined) ?? 0;
  const thrust = (sp.thrust as number | undefined) ?? 0;
  const arrays = (sp.arrays as number | undefined) ?? 1;
  const spt = (sp.t as number | undefined) ?? 0.5;
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <FullStars t={t} W={W} H={H} seed={103} n={135} o={0.9} />
        {/* Subtle cosmic nebula band */}
        <path
          d={`M ${-W * 0.4} ${H * 0.85} Q ${W * 0.45} ${H * 0.35} ${W * 1.4} ${H * 0.15}`}
          stroke={g.color}
          strokeWidth={220}
          opacity={0.055}
          fill="none"
          strokeLinecap="round"
        />
        <Rays x={W * 0.12} y={H * 0.14} t={t} len={Math.max(W, H) * 1.3} o={0.11} color={g.ray} />
        {bg === 'earth' ? (
          <g transform={`translate(${W * 0.14} ${H * (vert ? 0.92 : 1.12)})`}>
            <Glow x={0} y={-minDim(W, H) * 0.4} r={minDim(W, H) * 0.9} kind="cool" o={0.48} />
            <circle cx={0} cy={0} r={minDim(W, H) * 0.78} fill="#1B4D8E" stroke="#64DEFF" strokeWidth={5} />
            <path d="M -280 -420 Q -90 -510 120 -360 Q 190 -240 -40 -190 Z" fill="#2F8A68" opacity={0.85} />
            <path
              d={`M ${-420 + Math.sin(t / 60) * 16} -360 Q -120 -440 240 -260`}
              stroke="#F0F5FF"
              strokeWidth={18}
              opacity={0.45}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : null}
        {bg === 'mars' ? (
          <g transform={`translate(${W * (vert ? 0.82 : 0.85)} ${H * (vert ? 0.44 : 0.48)})`}>
            <Glow x={-120} y={0} r={minDim(W, H) * 0.56} kind="red" o={0.42} />
            <circle cx={0} cy={0} r={minDim(W, H) * 0.38} fill="#AC432E" stroke="#FF9B82" strokeWidth={4} />
            <ellipse cx={-90} cy={-70} rx={68} ry={40} fill="#7B2B1E" opacity={0.65} />
            <ellipse cx={80} cy={90} rx={92} ry={48} fill="#873122" opacity={0.55} />
            <path d="M -140 20 Q -20 45 120 12" stroke="#5D1B12" strokeWidth={12} strokeLinecap="round" fill="none" />
            <ellipse cx={-20} cy={-minDim(W, H) * 0.34} rx={78} ry={18} fill="#F4EFE6" opacity={0.85} />
          </g>
        ) : null}
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Bokeh seed={17} n={6} x0={-120} y0={H * 0.68} w={W + 240} h={H * 0.35} t={t} o={0.14} />
      </g>
    );
  }

  const driftX = (spt - 0.5) * 46 + Math.sin(t / 42) * 14 + p * 16;
  const driftY = Math.cos(t / 34) * 8;
  const sx = W * (vert ? 0.54 : 0.54) + driftX;
  const sy = H * (vert ? 0.44 : 0.42) + driftY;
  const sc = vert ? 0.68 : 1.12;

  return (
    <g>
      {/* Subtle dark stage horizon under Pip's feet so standing shots feel grounded */}
      <GroundPlane y={ground} fill="#0A0918" rim={g.color} />
      <rect x={-1200} y={ground} width={4400} height={2400} fill="#080614" opacity={0.68} />
      <g transform={`translate(${sx} ${sy}) scale(${sc})`}>
        <FreedomShipVector
          t={t}
          p={p}
          reactor={reactor}
          thrust={thrust}
          arrays={arrays}
          glow={g}
          id={id}
        />
      </g>
      <Dust t={t} seed={211} x0={0} y0={80} w={W} h={H - 160} n={34} o={0.48} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [sx - 180 * sc, sy, 480],
          [sx + 200 * sc, sy, 460],
          [W * 0.35, ground - 150, 460],
        ]}
        o={0.34}
      />
    </g>
  );
};

// ---------------------------------------------------------------- SET 2: cutaway
const CUTAWAY_PARTS = [
  { label: 'REACTOR', x: -245, y: -15, tagY: -125 },
  { label: 'SHORT BOOM', x: -120, y: 0, tagY: -115 },
  { label: 'RADIATORS', x: -45, y: -110, tagY: -220 },
  { label: 'PPE BODY', x: 88, y: 0, tagY: -135 },
  { label: 'HALL THRUSTER', x: 235, y: 0, tagY: -120 },
  { label: 'SKYFALL CAPSULE', x: 36, y: 78, tagY: 165 },
];

export const CutawaySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const hl = Math.round((sp.hl as number | undefined) ?? 0);
  const baseBoom = (sp.boom as number | undefined) ?? 1;
  const boomVal = id.startsWith('S22') ? lerp(0.12, 1, easeInOut(clamp(p * 1.4))) : baseBoom;
  const vert = H > W;

  if (layer === 'far') {
    const step = 120;
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#090E20" />
        {/* Blueprint grid */}
        <g stroke="#182548" strokeWidth={1.5} opacity={0.7}>
          {Array.from({ length: 34 }).map((_, i) => (
            <line key={`v${i}`} x1={-600 + i * step} y1={-600} x2={-600 + i * step} y2={H + 600} />
          ))}
          {Array.from({ length: 28 }).map((_, i) => (
            <line key={`h${i}`} x1={-600} y1={-600 + i * step} x2={W + 600} y2={-600 + i * step} />
          ))}
        </g>
        <Rays x={W * 0.5} y={H * 0.28} t={t} len={Math.max(W, H) * 1.2} o={0.09} color={g.ray} />
      </g>
    );
  }

  if (layer === 'near') {
    const scanX = ((t * 6) % (W + 400)) - 200;
    return (
      <g>
        {/* Subtle left/right blueprint caliper ticks */}
        <g stroke="#2F467A" strokeWidth={3} opacity={0.5}>
          <path d={`M 36 ${H * 0.25} L 36 ${H * 0.75} M 26 ${H * 0.25} L 48 ${H * 0.25} M 26 ${H * 0.75} L 48 ${H * 0.75}`} />
          <path d={`M ${W - 36} ${H * 0.25} L ${W - 36} ${H * 0.75} M ${W - 48} ${H * 0.25} L ${W - 26} ${H * 0.25} M ${W - 48} ${H * 0.75} L ${W - 26} ${H * 0.75}`} />
        </g>
        <line x1={scanX} y1={-200} x2={scanX} y2={H + 200} stroke={g.color} strokeWidth={2} opacity={0.12} />
      </g>
    );
  }

  const cx = W * (vert ? 0.54 : 0.55);
  const cy = H * (vert ? 0.48 : 0.47);
  const sc = vert ? 0.62 : 1.02;
  const part = CUTAWAY_PARTS[clamp(hl, 0, 5)];
  const boomOffset = lerp(-150, 0, boomVal);
  const px = part.x + (hl === 0 ? boomOffset : hl === 1 ? boomOffset * 0.5 : 0);
  const leadProg = easeOut(clamp(p * 2.2));
  const hlPulse = 0.65 + 0.35 * Math.sin(t / 6);

  return (
    <g>
      <GroundPlane y={ground} fill="#0D142B" rim="#4B68A8" />
      <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
        {/* Dashed dimension reference for early long boom */}
        {boomVal < 0.85 ? (
          <g opacity={0.55}>
            <line x1={-360} y1={72} x2={-36} y2={72} stroke={PALETTE.cyan} strokeWidth={2.5} strokeDasharray="8 8" />
            <text x={-198} y={96} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cyan}>
              EARLY LONG BOOM
            </text>
          </g>
        ) : null}

        <FreedomShipVector
          t={t}
          p={p}
          reactor={hl === 0 ? 0.75 : 0.25}
          thrust={hl === 4 ? 0.85 : 0.15}
          arrays={0.92}
          boomFactor={boomVal}
          glow={g}
          id={id}
        />

        {/* Cutaway internal avionics & tank overlay inside PPE */}
        <g opacity={0.85}>
          <rect x={12} y={-28} width={40} height={38} rx={4} fill="#141C35" stroke={PALETTE.gold} strokeWidth={2} />
          <ellipse cx={124} cy={-8} rx={36} ry={22} fill="#1C2948" stroke={PALETTE.cyan} strokeWidth={2.5} />
          <circle cx={124} cy={-8} r={8} fill={PALETTE.cyan} opacity={0.45 + 0.3 * Math.sin(t / 8)} />
        </g>

        {/* Active part highlight ring + gold glow + cream leader line */}
        <Glow x={px} y={part.y} r={120} kind={g.kind} o={0.45 * hlPulse} />
        <circle
          cx={px}
          cy={part.y}
          r={48 + 4 * Math.sin(t / 7)}
          fill="none"
          stroke={PALETTE.gold}
          strokeWidth={5}
          strokeDasharray="14 8"
          opacity={hlPulse}
        />
        <polyline
          points={`${px},${part.y} ${px + (part.tagY > 0 ? 28 : 22)},${lerp(part.y, part.tagY, leadProg)} ${px + 75 * leadProg},${lerp(part.y, part.tagY, leadProg)}`}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <g transform={`translate(${px + 175} ${part.tagY}) scale(${1 / sc})`}>
          <BrandChip x={0} y={0} t={t - 4} text={part.label} color={PALETTE.gold} />
        </g>
      </g>
      <Dust t={t} seed={223} x0={0} y0={120} w={W} h={H - 220} n={22} o={0.32} />
      <LightVeil id={`${id}veil`} lights={[[cx + px * sc, cy + part.y * sc, 540]]} o={0.3} />
    </g>
  );
};

// ---------------------------------------------------------------- SET 3: orbit
export const OrbitSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const leave = clamp(((sp.leave as number | undefined) ?? 0.5) + p * 0.14);
  const vert = H > W;

  if (layer === 'far') {
    const earthR = lerp(minDim(W, H) * (vert ? 0.92 : 1.05), minDim(W, H) * 0.44, leave);
    const earthX = lerp(W * 0.25, W * 0.16, leave);
    const earthY = lerp(H * 1.12, H * (vert ? 0.88 : 0.96), leave);
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <FullStars t={t} W={W} H={H} seed={139} n={140} o={0.92} />
        <Rays x={W * 0.15} y={H * 0.12} t={t} len={Math.max(W, H) * 1.3} o={0.12} color={g.ray} />
        <g transform={`translate(${earthX} ${earthY})`}>
          <Glow x={0} y={-earthR * 0.45} r={earthR * 1.35} kind="cool" o={0.52} />
          <circle cx={0} cy={0} r={earthR} fill="#1C5096" stroke="#62E3FF" strokeWidth={5} />
          <path
            d={`M ${-earthR * 0.42} ${-earthR * 0.72} Q ${earthR * 0.1} ${-earthR * 0.88} ${earthR * 0.35} ${-earthR * 0.55} Q ${earthR * 0.1} ${-earthR * 0.36} ${-earthR * 0.25} ${-earthR * 0.45} Z`}
            fill="#2E8F6B"
            opacity={0.86}
          />
          <path
            d={`M ${-earthR * 0.65 + Math.sin(t / 45) * 18} ${-earthR * 0.62} Q 0 ${-earthR * 0.84} ${earthR * 0.62} ${-earthR * 0.48}`}
            stroke="#F4F8FF"
            strokeWidth={18}
            opacity={0.44}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Dust t={t} seed={241} x0={0} y0={0} w={W} h={H} n={24} o={0.4} />
      </g>
    );
  }

  const x0 = W * 0.16;
  const y0 = H * (vert ? 0.62 : 0.76);
  const xc = W * 0.48;
  const yc = H * (vert ? 0.48 : 0.44);
  const x1 = W * 0.88;
  const y1 = H * (vert ? 0.36 : 0.26);
  const u = clamp(leave);
  const shipX = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * xc + u * u * x1;
  const shipY = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * yc + u * u * y1;
  const dx = 2 * (1 - u) * (xc - x0) + 2 * u * (x1 - xc);
  const dy = 2 * (1 - u) * (yc - y0) + 2 * u * (y1 - yc);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 180;

  return (
    <g>
      <GroundPlane y={ground} fill="#090717" rim={PALETTE.cyan} />
      <rect x={-1200} y={ground} width={4400} height={2400} fill="#080614" opacity={0.72} />
      {/* Dotted gold escape trajectory */}
      <path
        d={`M ${x0} ${y0} Q ${xc} ${yc} ${x1} ${y1}`}
        fill="none"
        stroke={PALETTE.gold}
        strokeWidth={5}
        strokeDasharray="14 14"
        strokeDashoffset={-t * 1.4}
        opacity={0.85}
      />
      {/* SR-1 Freedom climbing along the curve */}
      <g transform={`translate(${shipX} ${shipY}) rotate(${ang}) scale(${vert ? 0.44 : 0.56})`}>
        <FreedomShipVector t={t} p={p} reactor={0.2} thrust={0.8} arrays={1} glow={g} id={id} />
      </g>
      <LightVeil id={`${id}veil`} lights={[[shipX, shipY, 440], [W * 0.25, H * 0.8, 520]]} o={0.32} />
    </g>
  );
};

// ---------------------------------------------------------------- SET 4: route
export const RouteSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const prog = clamp(((sp.prog as number | undefined) ?? 0.3) + easeInOut(p) * 0.08);
  const mode = (sp.mode as string | undefined) ?? 'nuclear';
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#080A19" />
        <FullStars t={t} W={W} H={H} seed={167} n={110} o={0.78} />
        <Rays x={W * 0.52} y={H * (vert ? 0.49 : 0.48)} t={t} len={Math.max(W, H) * 1.1} o={0.11} color={g.ray} />
      </g>
    );
  }

  if (layer === 'near') {
    return <Dust t={t} seed={171} x0={0} y0={60} w={W} h={H - 120} n={20} o={0.34} />;
  }

  const cx = W * (vert ? 0.52 : 0.52);
  const cy = H * (vert ? 0.49 : 0.47);
  const sc = vert ? 0.62 : 0.96;
  const earthR = 175;
  const marsR = 310;
  const earthPos = { x: -earthR * 0.85, y: earthR * 0.52 };
  const marsPos = { x: marsR * 0.88, y: -marsR * 0.46 };
  const ctrl = { x: -120, y: -280 };
  const shipX = (1 - prog) * (1 - prog) * earthPos.x + 2 * (1 - prog) * prog * ctrl.x + prog * prog * marsPos.x;
  const shipY = (1 - prog) * (1 - prog) * earthPos.y + 2 * (1 - prog) * prog * ctrl.y + prog * prog * marsPos.y;
  const trailColor = mode === 'nuclear' ? '#FF5E45' : '#FFD257';

  return (
    <g>
      <GroundPlane y={ground} fill="#0A0D1E" rim="#3B4772" />
      <rect x={-1200} y={ground} width={4400} height={2400} fill="#080614" opacity={0.68} />
      <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
        {/* Orbit rings */}
        <circle cx={0} cy={0} r={earthR} fill="none" stroke="#365A8A" strokeWidth={3} strokeDasharray="8 10" />
        <circle cx={0} cy={0} r={marsR} fill="none" stroke="#6B3A3D" strokeWidth={3} strokeDasharray="8 10" />

        {/* Dotted transfer arc */}
        <path
          d={`M ${earthPos.x} ${earthPos.y} Q ${ctrl.x} ${ctrl.y} ${marsPos.x} ${marsPos.y}`}
          fill="none"
          stroke={PALETTE.gold}
          strokeWidth={4}
          strokeDasharray="10 12"
          opacity={0.45}
        />

        {/* Active solid trail up to prog */}
        <path
          d={`M ${earthPos.x} ${earthPos.y} Q ${ctrl.x} ${ctrl.y} ${marsPos.x} ${marsPos.y}`}
          fill="none"
          stroke={trailColor}
          strokeWidth={7}
          strokeDasharray="900"
          strokeDashoffset={900 * (1 - prog)}
          strokeLinecap="round"
        />

        {/* Sun in centre */}
        <Glow x={0} y={0} r={140} kind="warm" o={0.75} />
        <circle cx={0} cy={0} r={44} fill="#FFD257" stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={-10} cy={-12} r={14} fill="#FFF2B8" opacity={0.7} />

        {/* Earth */}
        <g transform={`translate(${earthPos.x} ${earthPos.y})`}>
          <circle r={24} fill="#2A7CE0" stroke={DARK_LINE} strokeWidth={4} />
          <path d="M -10 -8 Q 4 -12 10 2 Q -2 10 -12 4 Z" fill="#35A872" />
          <text y={44} textAnchor="middle" fontFamily={FONTS.ui} fontSize={19} fill={PALETTE.sky}>
            EARTH
          </text>
        </g>

        {/* Mars */}
        <g transform={`translate(${marsPos.x} ${marsPos.y})`}>
          <circle r={21} fill="#D65238" stroke={DARK_LINE} strokeWidth={4} />
          <ellipse cx={-3} cy={-15} rx={8} ry={3.5} fill="#F4EFE6" />
          <text y={42} textAnchor="middle" fontFamily={FONTS.ui} fontSize={19} fill={PALETTE.orange}>
            MARS
          </text>
        </g>

        {/* Tiny ship icon + nuclear/solar badge */}
        <g transform={`translate(${shipX} ${shipY})`}>
          <Glow x={0} y={0} r={55} kind={mode === 'nuclear' ? 'red' : 'warm'} o={0.65} />
          <polygon points="-16,-8 18,0 -16,8 -10,0" fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={3.5} />
          {/* Mode icon above ship */}
          <g transform="translate(0 -38)">
            <circle r={18} fill="#141326" stroke={trailColor} strokeWidth={3} />
            {mode === 'nuclear' ? (
              <g>
                <circle r={4.5} fill="#FF6E4A" />
                <ellipse rx={11} ry={4.5} fill="none" stroke="#FF8B6A" strokeWidth={2} transform={`rotate(${t * 3})`} />
                <ellipse rx={11} ry={4.5} fill="none" stroke="#FF8B6A" strokeWidth={2} transform={`rotate(${t * 3 + 60})`} />
              </g>
            ) : (
              <g>
                <circle r={7} fill="#FFD257" />
                {[0, 45, 90, 135].map((a) => (
                  <line
                    key={a}
                    x1={-12}
                    y1={0}
                    x2={12}
                    y2={0}
                    stroke="#FFD257"
                    strokeWidth={2}
                    transform={`rotate(${a + t * 1.5})`}
                  />
                ))}
              </g>
            )}
          </g>
        </g>
      </g>
      <LightVeil id={`${id}veil`} lights={[[cx, cy, 620]]} o={0.3} />
    </g>
  );
};

// ---------------------------------------------------------------- SET 5: mars
export const MarsSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const drop = clamp(((sp.drop as number | undefined) ?? 0) + p * 0.14);
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <FullStars t={t} W={W} H={H} seed={191} n={140} o={0.9} />
        <Rays x={W * 0.18} y={H * 0.18} t={t} len={Math.max(W, H) * 1.2} o={0.1} color={g.ray} />
      </g>
    );
  }

  if (layer === 'near') {
    return <Dust t={t} seed={197} x0={0} y0={40} w={W} h={H - 80} n={28} o={0.44} />;
  }

  const marsR = minDim(W, H) * (vert ? 0.64 : 0.72);
  const marsX = W * (vert ? 0.84 : 0.82);
  const marsY = H * (vert ? 0.56 : 0.54);
  const shipX = W * (vert ? 0.28 : 0.25);
  const shipY = H * (vert ? 0.36 : 0.28);
  const capX = lerp(shipX + 18, marsX - marsR * 0.68, easeInOut(drop));
  const capY = lerp(shipY + 42, marsY - marsR * 0.18, drop * drop * 0.6 + drop * 0.4);
  const hot = drop >= 0.48;

  return (
    <g>
      <GroundPlane y={ground} fill="#090716" rim={PALETTE.red} />
      <rect x={-1200} y={ground} width={4400} height={2400} fill="#080614" opacity={0.72} />

      {/* Huge rusty-red Mars disc */}
      <g transform={`translate(${marsX} ${marsY})`}>
        <Glow x={-marsR * 0.35} y={0} r={marsR * 1.35} kind="red" o={0.48} />
        <circle cx={0} cy={0} r={marsR} fill="#AF422D" stroke="#FF979E" strokeWidth={5} />
        <ellipse cx={-marsR * 0.38} cy={-marsR * 0.24} rx={marsR * 0.28} ry={marsR * 0.18} fill="#7B291C" opacity={0.72} />
        <ellipse cx={-marsR * 0.15} cy={marsR * 0.35} rx={marsR * 0.34} ry={marsR * 0.2} fill="#883121" opacity={0.62} />
        {/* Valles Marineris */}
        <path
          d={`M ${-marsR * 0.58} ${marsR * 0.05} Q ${-marsR * 0.2} ${marsR * 0.16} ${marsR * 0.28} ${marsR * 0.02}`}
          stroke="#571A11"
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />
        {/* Craters */}
        {[
          [-0.45, -0.45, 0.09],
          [-0.55, 0.28, 0.07],
          [-0.18, -0.1, 0.06],
        ].map(([cx0, cy0, cr], i) => (
          <circle
            key={i}
            cx={marsR * cx0}
            cy={marsR * cy0}
            r={marsR * cr}
            fill="#8D3122"
            stroke="#DF6B4B"
            strokeWidth={3}
          />
        ))}
        {/* Polar cap */}
        <ellipse cx={0} cy={-marsR * 0.9} rx={marsR * 0.26} ry={marsR * 0.07} fill="#F4EFE6" opacity={0.88} />
      </g>

      {/* Freedom ship small in upper-left */}
      <g transform={`translate(${shipX} ${shipY}) scale(${vert ? 0.34 : 0.42}) rotate(8)`}>
        <FreedomShipVector t={t} p={p} reactor={0.15} thrust={0.35} arrays={1} glow={g} id={id} showCapsule={false} />
      </g>

      {/* SkyFall capsule drop path & plasma entry */}
      <path
        d={`M ${shipX + 18} ${shipY + 42} Q ${lerp(shipX, marsX - marsR * 0.68, 0.55)} ${shipY + 30} ${marsX - marsR * 0.68} ${marsY - marsR * 0.18}`}
        fill="none"
        stroke={hot ? PALETTE.orange : PALETTE.gold}
        strokeWidth={3}
        strokeDasharray="8 10"
        opacity={0.5}
      />
      <g transform={`translate(${capX} ${capY}) rotate(${lerp(10, 42, drop)})`}>
        {hot ? (
          <g>
            <Glow x={0} y={0} r={96} kind="red" o={0.78} />
            <path d="M -85 -42 Q -25 -14 26 0 Q -25 14 -85 42" fill="#FF733D" opacity={0.45 + 0.25 * Math.sin(t * 0.8)} />
            <path d="M -52 -24 Q -10 -6 22 0 Q -10 6 -52 24" fill="#FFF3C4" opacity={0.75} />
          </g>
        ) : null}
        <path d="M -22 -18 L 14 -28 L 14 28 L -22 18 Z" fill="#8C96AC" stroke={DARK_LINE} strokeWidth={4} />
        <path d="M 12 -32 Q 30 0 12 32" stroke={hot ? '#FFF0B8' : '#C9633B'} strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>

      <LightVeil id={`${id}veil`} lights={[[capX, capY, 440], [marsX - marsR * 0.4, marsY, 640]]} o={0.34} />
    </g>
  );
};

// ---------------------------------------------------------------- SET 6: void
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);

  if (layer === 'far') {
    return (
      <g>
        <SpaceBackdrop t={t} seed={109} />
        <FullStars t={t} W={W} H={H} seed={113} n={22} o={0.34} />
        <Rays x={W * 0.5} y={H * 0.34} t={t} len={Math.max(W, H) * 1.25} o={0.09} color={g.ray} />
        <Glow x={W * 0.5} y={H * 0.45} r={Math.min(W, H) * 0.5} kind={g.kind} o={0.22} />
      </g>
    );
  }

  if (layer === 'near') {
    return <LightVeil id={`${id}veil`} lights={[[W * 0.5, H * 0.5, Math.max(W, H) * 0.55]]} o={0.26} />;
  }

  return (
    <g>
      <GroundPlane y={ground} fill="#0F0C20" rim={g.color} />
      <rect x={-1200} y={ground} width={4400} height={2400} fill="#080614" opacity={0.45} />
      <Dust t={t} seed={257} x0={0} y0={120} w={W} h={H - 220} n={18} o={0.26} />
    </g>
  );
};

const minDim = (W: number, H: number) => Math.min(W, H);
