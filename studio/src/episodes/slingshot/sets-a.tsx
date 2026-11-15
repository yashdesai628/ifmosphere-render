import React from 'react';
import { GroundPlane, PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeIn, easeOut, backOut, rnd } from '../../engine/anim';
import { Stars, Rays, DuskSky, NightSky } from '../../engine/kit';
import { Glow, LightVeil, Dust, Cone } from '../../engine/light';
import type { SetProps } from './render';

const OUT = '#121019';

/** Subtle dark stage deck for space/void sets so Pip's shadow sits on a rimmed plane without blocking stars. */
export const StageDeck: React.FC<{ ground: number; rim?: string; o?: number }> = ({
  ground,
  rim = '#9EB0D9',
  o = 0.52,
}) => (
  <g>
    <rect x={-1400} y={ground} width={4800} height={2400} fill="#0A0818" opacity={o} />
    <line x1={-1400} y1={ground} x2={3400} y2={ground} stroke={rim} strokeWidth={3.5} opacity={0.48} />
  </g>
);

/** Small twin-spacecraft icon used along orbital paths in sets. */
export const TwinCraftDot: React.FC<{
  x: number;
  y: number;
  angleDeg?: number;
  scale?: number;
  burn?: number;
  t: number;
}> = ({ x, y, angleDeg = 0, scale = 1, burn = 0, t }) => {
  const pulse = 0.9 + 0.12 * Math.sin(t * 0.7);
  return (
    <g transform={`translate(${x} ${y}) rotate(${angleDeg}) scale(${scale})`}>
      {burn > 0.05 ? (
        <g>
          <Glow x={-26} y={0} r={54 * burn * pulse} kind="warm" o={0.75 * burn} />
          <path
            d={`M -16 -9 Q ${-42 - 36 * burn * pulse} 0 -16 9 Z`}
            fill="#FF7A3D"
            stroke="#FFE5B4"
            strokeWidth={2}
            opacity={0.95}
          />
          <path d={`M -14 -4 Q ${-28 - 20 * burn * pulse} 0 -14 4 Z`} fill="#FFF4CC" />
        </g>
      ) : (
        <Glow x={0} y={0} r={34 * pulse} kind="cool" o={0.42} />
      )}
      {[-9, 9].map((dy, i) => (
        <g key={i} transform={`translate(${i === 0 ? 3 : -3} ${dy})`}>
          {/* Gold solar-panel wings */}
          <rect x={-4} y={-14} width={8} height={28} rx={2} fill={PALETTE.gold} stroke={OUT} strokeWidth={2.5} />
          {/* Boxy spacecraft bus */}
          <rect
            x={-11}
            y={-6}
            width={22}
            height={12}
            rx={3}
            fill={i === 0 ? PALETTE.cyan : PALETTE.cream}
            stroke={OUT}
            strokeWidth={3}
          />
          <circle cx={6} cy={0} r={2} fill={OUT} />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// 1. PAD: Cape Canaveral launch pad at night / dawn
// ---------------------------------------------------------------------------
export const PadSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const fire = clamp(Number(sp.fire ?? 0));
  const dawn = String(sp.tint ?? 'night') === 'dawn';
  const padX = vert ? 0.66 * W : 0.25 * W;
  const altTowerX = vert ? 0.22 * W : 0.84 * W;

  if (layer === 'far') {
    const moonX = vert ? 0.22 * W : 0.78 * W;
    const moonY = vert ? 0.34 * H : 0.26 * H;
    const skyTop = dawn ? '#191032' : '#080614';
    const skyMid = dawn ? '#4D2354' : '#0D122A';
    const skyBot = dawn ? '#CF664B' : '#182447';
    return (
      <g>
        <defs>
          <linearGradient id={`${id}padSky`} x1="0" y1={-900} x2="0" y2={ground + 80} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="58%" stopColor={skyMid} />
            <stop offset="100%" stopColor={skyBot} />
          </linearGradient>
        </defs>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={`url(#${id}padSky)`} />
        {dawn ? (
          <DuskSky id={`${id}dusk`} x0={-1400} y0={-1400} w={4800} h={ground + 1460} horizonY={ground} />
        ) : (
          <NightSky id={`${id}night`} x0={-1400} y0={-1400} w={4800} h={ground + 1460} horizonY={ground} />
        )}
        <Stars seed={31} x0={-900} y0={-1000} w={W + 1800} h={ground + 900} t={t} n={dawn ? 45 : 120} o={dawn ? 0.45 : 0.9} />
        {dawn ? (
          <g>
            <Glow x={padX + 120} y={ground - 30} r={420} kind="warm" o={0.5} />
            <Rays x={padX + 120} y={ground - 10} t={t} len={1700} n={12} o={0.1} color="#FFB980" />
          </g>
        ) : (
          <g>
            <Glow x={moonX} y={moonY} r={170} kind="cool" o={0.42} />
            <circle cx={moonX} cy={moonY} r={32} fill="#EAEFF8" opacity={0.92} />
            <circle cx={moonX + 11} cy={moonY - 8} r={28} fill="#0D122A" />
            <Rays x={padX} y={ground - 20} t={t} len={1600} n={10} o={0.08} color="#9FB8FF" />
          </g>
        )}
        {/* Distant coastal treeline & Cape horizon strip */}
        <path
          d={`M -1400 ${ground} L -400 ${ground - 24} L 200 ${ground - 18} L 700 ${ground - 32} L 1350 ${ground - 20} L 2200 ${ground - 28} L 3400 ${ground} Z`}
          fill={dawn ? '#2B1633' : '#10152B'}
        />
        {/* Slow drifting night clouds */}
        {[0, 1, 2].map((i) => {
          const cx = ((i * 580 + t * (0.4 + i * 0.15)) % (W + 800)) - 400;
          const cy = ground - 380 - i * 95;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={190 + i * 30}
              ry={26}
              fill={dawn ? '#8B4A62' : '#1E2A52'}
              opacity={0.28}
            />
          );
        })}
      </g>
    );
  }

  if (layer === 'mid') {
    const towerH = vert ? 500 : 540;
    const rocketLift = fire >= 0.95 ? easeIn(p) * (vert ? 470 : 410) : fire > 0.3 ? easeIn(p) * 75 * fire : 0;
    const rumble = fire > 0.15 ? Math.sin(t * 2.8) * 3.5 * fire : 0;
    const swingAngle = lerp(0, -44, easeOut(clamp(fire * 1.45)));
    const beaconPulse = 0.35 + 0.65 * Math.max(0, Math.sin(t * 0.35));
    const flameLen = fire > 0 ? (110 + 290 * fire) * (0.9 + 0.12 * Math.sin(t * 2.1)) : 0;
    const towerFill = dawn ? '#271E38' : '#191D33';
    const towerRim = dawn ? '#F4A67C' : '#96A9DB';

    return (
      <g>
        {/* Distant secondary launch pad silhouette (tonal plane 1) */}
        <g transform={`translate(${altTowerX} ${ground})`} opacity={0.62}>
          <rect x={-26} y={-240} width={52} height={240} fill={towerFill} stroke={OUT} strokeWidth={3} />
          <path d="M -26 -240 L 26 -180 L -26 -120 L 26 -60 L -26 0" stroke={towerRim} strokeWidth={2} fill="none" opacity={0.45} />
          <circle cx={0} cy={-248} r={5} fill="#FF5A4A" opacity={0.3 + 0.7 * Math.max(0, Math.sin(t * 0.35 + 1.5))} />
          <Glow x={0} y={-248} r={28} kind="red" o={0.45} />
        </g>

        {/* Concrete launch pad deck & flame trench (tonal plane 3) */}
        <GroundPlane y={ground} fill={dawn ? '#2C213A' : '#1E2136'} rim={dawn ? '#F7B787' : '#A9BCE8'} />
        <rect x={padX - 240} y={ground - 18} width={480} height={22} rx={4} fill="#2B2E48" stroke={OUT} strokeWidth={4} />
        <path
          d={`M ${padX - 180} ${ground + 4} L ${padX + 180} ${ground + 4} L ${padX + 230} ${ground + 52} L ${padX - 230} ${ground + 52} Z`}
          fill="#151728"
          stroke={OUT}
          strokeWidth={3.5}
        />

        {/* Pad floodlight poles flanking the tower */}
        {[-195, 195].map((dx, i) => {
          const fx = padX + dx;
          const dir = dx < 0 ? 1 : -1;
          return (
            <g key={i} transform={`translate(${fx} ${ground})`}>
              <line x1={0} y1={0} x2={0} y2={-270} stroke={OUT} strokeWidth={11} />
              <line x1={0} y1={0} x2={0} y2={-270} stroke="#4C567A" strokeWidth={5} />
              <rect x={-20} y={-286} width={40} height={20} rx={4} fill="#252840" stroke={OUT} strokeWidth={3.5} />
              <circle cx={dir * 12} cy={-276} r={7} fill="#FFEAB8" />
              <Glow x={dir * 12} y={-276} r={130} kind="warm" o={0.65} />
              <Cone d={`M ${dir * 6} -272 L ${dir * 20} -272 L ${dir * 180} 0 L ${dir * 45} 0 Z`} o={0.18} />
            </g>
          );
        })}

        {/* Main Launch Tower (tonal plane 2) */}
        <g transform={`translate(${padX - 78} ${ground - 18})`}>
          <rect x={-38} y={-towerH} width={76} height={towerH} fill={towerFill} stroke={OUT} strokeWidth={4} />
          {/* Diagonal truss lattice */}
          {Array.from({ length: 7 }).map((_, k) => {
            const y0 = -k * (towerH / 7);
            const y1 = -(k + 1) * (towerH / 7);
            return (
              <g key={k} stroke={towerRim} strokeWidth={2.5} opacity={0.55}>
                <line x1={-34} y1={y0} x2={34} y2={y1} />
                <line x1={34} y1={y0} x2={-34} y2={y1} />
                <line x1={-38} y1={y1} x2={38} y2={y1} />
              </g>
            );
          })}
          {/* Retracting umbilical arms */}
          {[-towerH * 0.68, -towerH * 0.45].map((ay, k) => (
            <g key={k} transform={`translate(36 ${ay}) rotate(${swingAngle})`}>
              <rect x={0} y={-6} width={76} height={12} rx={3} fill="#363B5C" stroke={OUT} strokeWidth={3.5} />
            </g>
          ))}
          {/* Lightning mast & blinking beacon */}
          <line x1={0} y1={-towerH} x2={0} y2={-towerH - 46} stroke={towerRim} strokeWidth={4} />
          <circle cx={0} cy={-towerH - 50} r={7} fill="#FF5A4A" opacity={beaconPulse} />
          <Glow x={0} y={-towerH - 50} r={55 * beaconPulse} kind="red" o={0.8} />
          {/* Gentle venting steam wisps */}
          {[0, 1, 2, 3].map((k) => {
            const age = ((t * 0.015 + k * 0.25) % 1);
            return (
              <circle
                key={k}
                cx={85 + age * 120}
                cy={-towerH * 0.55 - age * 48 + Math.sin(t * 0.1 + k) * 6}
                r={12 + age * 26}
                fill="#E8EEFF"
                opacity={(1 - age) * 0.28}
              />
            );
          })}
        </g>

        {/* Rocket & Plume */}
        <g transform={`translate(${padX + 42 + rumble} ${ground - 22 - rocketLift})`}>
          {/* Engine flame & exhaust */}
          {fire > 0 ? (
            <g>
              <Glow x={0} y={40} r={220 + 210 * fire} kind="warm" o={0.75 * fire} />
              <path
                d={`M -28 0 Q -48 ${flameLen * 0.45} 0 ${flameLen} Q 48 ${flameLen * 0.45} 28 0 Z`}
                fill="#FF6A3D"
                opacity={0.92}
              />
              <path
                d={`M -18 0 Q -30 ${flameLen * 0.35} 0 ${flameLen * 0.78} Q 30 ${flameLen * 0.35} 18 0 Z`}
                fill="#FFB84D"
              />
              <path
                d={`M -10 0 Q -14 ${flameLen * 0.25} 0 ${flameLen * 0.48} Q 14 ${flameLen * 0.25} 10 0 Z`}
                fill="#FFF6CC"
              />
              {/* Sparks flying out */}
              {Array.from({ length: Math.round(8 + fire * 18) }).map((_, i) => {
                const age = ((t * 0.04 + rnd(41, i)) % 1);
                const sx = (rnd(42, i) - 0.5) * 190 * age;
                const sy = 25 + age * (140 + 160 * fire);
                return (
                  <circle
                    key={i}
                    cx={sx}
                    cy={sy}
                    r={2 + rnd(43, i) * 3}
                    fill={i % 2 ? '#FFE39E' : '#FF8A3D'}
                    opacity={(1 - age) * fire}
                  />
                );
              })}
            </g>
          ) : (
            <Glow x={0} y={-10} r={120} kind="warm" o={0.42} />
          )}

          {/* Tall Rocket Body */}
          <path d="M -26 0 L -26 -320 Q -26 -385 0 -415 Q 26 -385 26 -320 L 26 0 Z" fill="#23263B" stroke={OUT} strokeWidth={4} />
          {/* Cream payload fairing */}
          <path d="M -26 -285 L -26 -320 Q -26 -385 0 -415 Q 26 -385 26 -320 L 26 -285 Z" fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
          {/* Mustard band & pale rim highlight */}
          <rect x={-26} y={-285} width={52} height={18} fill={PALETTE.gold} stroke={OUT} strokeWidth={3.5} />
          <line x1={-16} y1={-30} x2={-16} y2={-265} stroke="#637099" strokeWidth={4} opacity={0.5} />
          {/* Booster fins */}
          <polygon points="-26,-45 -44,0 -26,0" fill="#1C1E30" stroke={OUT} strokeWidth={4} />
          <polygon points="26,-45 44,0 26,0" fill="#1C1E30" stroke={OUT} strokeWidth={4} />
          {/* Engine bells */}
          <polygon points="-22,0 -28,16 -8,16 -12,0" fill="#171926" stroke={OUT} strokeWidth={3.5} />
          <polygon points="12,0 8,16 28,16 22,0" fill="#171926" stroke={OUT} strokeWidth={3.5} />
        </g>

        {/* Billowing pad exhaust smoke rolls when firing */}
        {fire > 0.1 ? (
          <g opacity={0.75 * fire}>
            {[-1, 1].map((dir) =>
              [0, 1, 2, 3].map((k) => {
                const age = ((t * 0.025 + k * 0.25) % 1);
                return (
                  <circle
                    key={`${dir}${k}`}
                    cx={padX + 42 + dir * (35 + age * 210)}
                    cy={ground + 8 - Math.sin(age * Math.PI) * 32}
                    r={22 + age * 36}
                    fill={k % 2 ? '#C5CBE0' : '#858EAD'}
                    opacity={(1 - age) * 0.7}
                  />
                );
              }),
            )}
          </g>
        ) : null}
      </g>
    );
  }

  // NEAR layer: edge bollards & vignette, leaving Pip & text clear
  return (
    <g>
      <g fill="#0D0B18" stroke={OUT} strokeWidth={4} opacity={0.9}>
        <rect x={-80} y={ground + 24} width={150} height={190} rx={8} />
        <rect x={W - 70} y={ground + 24} width={150} height={190} rx={8} />
      </g>
      <LightVeil
        id={`${id}veil`}
        lights={[
          [padX + 42, ground - 160, 480],
          [W * 0.55, ground - 140, 460],
        ]}
        o={dawn ? 0.28 : 0.42}
      />
      <Dust t={t} seed={92} x0={0} y0={200} w={W} h={ground - 120} n={34} o={0.45 + fire * 0.35} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 2. OPS: Mission operations room, UC Berkeley style (no faces)
// ---------------------------------------------------------------------------
export const OpsSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const tension = clamp(Number(sp.tension ?? 0));
  const ok = Number(sp.ok ?? 0) >= 0.5;
  const wallTop = vert ? ground - 640 : 185;

  const screenColor = (idx: number) => {
    if (ok) return PALETTE.green;
    const alertCount = Math.round(tension * 6);
    if (idx < alertCount) {
      const blink = Math.sin(t * 0.45 + idx * 1.4) > -0.2;
      return blink ? PALETTE.orange : PALETTE.red;
    }
    return idx % 2 === 0 ? PALETTE.cyan : PALETTE.cream;
  };

  if (layer === 'far') {
    const numScreens = vert ? 4 : 6;
    const sw = vert ? 210 : 250;
    const sh = vert ? 140 : 165;
    const gap = vert ? 24 : 34;
    const totalW = numScreens * sw + (numScreens - 1) * gap;
    const startX = (vert ? W * 0.46 : W * 0.5) - totalW / 2;
    const screenY = vert ? ground - 510 : 265;
    const okPulse = ok ? 0.78 + 0.22 * Math.sin(t * 0.28) : 0.85;

    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill="#0D1020" />
        {/* Acoustic dark wall panels */}
        <rect x={-600} y={wallTop} width={W + 1200} height={ground - wallTop + 20} fill="#14182D" />
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={-200 + i * 200}
            y1={wallTop}
            x2={-200 + i * 200}
            y2={ground}
            stroke="#1D2340"
            strokeWidth={3}
          />
        ))}
        {/* Ceiling light strips casting soft cones */}
        {[0.25, 0.5, 0.75].map((fx, i) => (
          <g key={i}>
            <rect x={W * fx - 85} y={wallTop - 10} width={170} height={14} rx={4} fill="#D8E5FF" opacity={0.75} />
            <Glow x={W * fx} y={wallTop + 10} r={220} kind="cool" o={0.35} />
            <Cone
              d={`M ${W * fx - 80} ${wallTop + 4} L ${W * fx + 80} ${wallTop + 4} L ${W * fx + 230} ${ground} L ${W * fx - 230} ${ground} Z`}
              o={0.1}
            />
          </g>
        ))}

        {/* Wall of telemetry screens with glowing trajectory curves */}
        {Array.from({ length: numScreens }).map((_, i) => {
          const sx = startX + i * (sw + gap);
          const col = screenColor(i);
          const scanX = sx + 22 + (((t * 2.2 + i * 47) % (sw - 44)));
          return (
            <g key={i} opacity={okPulse}>
              <Glow x={sx + sw / 2} y={screenY + sh / 2} r={140} kind={ok ? 'cool' : col === PALETTE.red ? 'red' : 'warm'} o={0.28} />
              <rect x={sx} y={screenY} width={sw} height={sh} rx={10} fill="#101528" stroke={OUT} strokeWidth={4} />
              <rect x={sx + 8} y={screenY + 8} width={sw - 16} height={sh - 16} rx={6} fill="#0B0F1D" stroke={col} strokeWidth={2} opacity={0.75} />
              {/* Trajectory curves & animated telemetry dot */}
              {i % 2 === 0 ? (
                <g>
                  <path
                    d={`M ${sx + 20} ${screenY + sh - 28} Q ${sx + sw * 0.45} ${screenY + 24} ${sx + sw - 22} ${screenY + 46}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={3}
                  />
                  <path
                    d={`M ${sx + 20} ${screenY + sh - 44} Q ${sx + sw * 0.52} ${screenY + 58} ${sx + sw - 26} ${screenY + sh - 32}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    opacity={0.55}
                  />
                  <circle
                    cx={lerp(sx + 22, sx + sw - 24, ((t * 0.015 + i * 0.2) % 1))}
                    cy={screenY + sh * 0.48 + Math.sin(t * 0.1 + i) * 18}
                    r={5}
                    fill={PALETTE.cream}
                  />
                </g>
              ) : (
                <g>
                  {/* Oscillating wave + status bars */}
                  <path
                    d={`M ${sx + 20} ${screenY + sh * 0.55} Q ${sx + sw * 0.35} ${screenY + 32 + Math.sin(t * 0.18 + i) * 22} ${sx + sw * 0.55} ${screenY + sh * 0.55} T ${sx + sw - 20} ${screenY + sh * 0.52}`}
                    fill="none"
                    stroke={col}
                    strokeWidth={3}
                  />
                  {[0, 1, 2, 3].map((b) => (
                    <rect
                      key={b}
                      x={sx + 22 + b * 24}
                      y={screenY + sh - 24 - (12 + ((i * 7 + b * 9) % 24))}
                      width={14}
                      height={12 + ((i * 7 + b * 9) % 24)}
                      rx={2}
                      fill={col}
                      opacity={0.65}
                    />
                  ))}
                </g>
              )}
              <line x1={scanX} y1={screenY + 12} x2={scanX} y2={screenY + sh - 12} stroke={col} strokeWidth={1.5} opacity={0.32} />
            </g>
          );
        })}
      </g>
    );
  }

  if (layer === 'mid') {
    const deskPositions = vert ? [0.16 * W, 0.78 * W] : [0.15 * W, 0.38 * W, 0.72 * W, 0.9 * W];
    return (
      <g>
        {/* Carpet GroundPlane with pale rim */}
        <GroundPlane y={ground} fill="#1C2036" rim={ok ? '#7CEFB0' : tension > 0.4 ? '#FFC470' : '#96A8DA'} />
        {/* Subtle carpet seam lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={-200 + i * 480}
            y1={ground + 4}
            x2={-420 + i * 480}
            y2={ground + 260}
            stroke="#272D4B"
            strokeWidth={3}
            opacity={0.5}
          />
        ))}

        {/* Two rows of console desks with dark monitors, warm lamp glows, NO faces */}
        {deskPositions.map((dx, i) => {
          const rowBack = i % 2 === 1;
          const dy = rowBack ? ground - 68 : ground;
          const s = rowBack ? 0.85 : 1;
          const col = screenColor(i);
          const blink = Math.sin(t * 0.25 + i * 1.9) > 0 ? 1 : 0.35;
          return (
            <g key={i} transform={`translate(${dx} ${dy}) scale(${s})`}>
              {/* Desk shadow */}
              <ellipse cx={0} cy={6} rx={115} ry={12} fill="#000" opacity={0.4} />
              {/* Desk console chassis */}
              <rect x={-105} y={-68} width={210} height={70} rx={8} fill="#252A44" stroke={OUT} strokeWidth={4} />
              <line x1={-95} y1={-56} x2={95} y2={-56} stroke="#4C5682" strokeWidth={3} opacity={0.55} />
              {/* Dual dark monitors */}
              {[-48, 36].map((mx, m) => (
                <g key={m} transform={`translate(${mx} -68)`}>
                  <rect x={-32} y={-56} width={64} height={46} rx={5} fill="#14182A" stroke={OUT} strokeWidth={4} />
                  <rect x={-26} y={-50} width={52} height={34} rx={3} fill="#0C101E" />
                  <path d="M -20 -26 Q 0 -44 20 -30" fill="none" stroke={col} strokeWidth={2.5} />
                  <rect x={-8} y={-10} width={16} height={10} fill="#1B2036" stroke={OUT} strokeWidth={3} />
                </g>
              ))}
              {/* Tiny warm desk lamp */}
              <g transform="translate(-86 -68)">
                <path d="M 0 0 L -8 -36 L 12 -44" fill="none" stroke={OUT} strokeWidth={6} strokeLinecap="round" />
                <path d="M 0 0 L -8 -36 L 12 -44" fill="none" stroke="#5E6894" strokeWidth={2.5} strokeLinecap="round" />
                <circle cx={14} cy={-43} r={6} fill="#FFE29E" stroke={OUT} strokeWidth={2.5} />
                <Glow x={14} y={-40} r={62} kind="warm" o={0.55} />
              </g>
              {/* Status indicator LEDs */}
              <circle cx={82} cy={-38} r={4} fill={col} opacity={blink} />
              <circle cx={68} cy={-38} r={4} fill={PALETTE.cream} opacity={0.6} />
            </g>
          );
        })}

        {/* Status badge banner on back desk wall */}
        <text
          x={vert ? 0.84 * W : 0.88 * W}
          y={ground - 18}
          textAnchor="end"
          fontFamily={FONTS.ui}
          fontSize={16}
          fill={ok ? PALETTE.green : tension > 0.4 ? PALETTE.orange : PALETTE.cyan}
          opacity={0.65}
          letterSpacing={2}
        >
          {ok ? 'NOMINAL' : tension > 0.6 ? 'HOLD' : 'TRACKING'}
        </text>
      </g>
    );
  }

  // NEAR layer: blurred foreground desk corners at far frame edges + dust + LightVeil
  return (
    <g>
      <g fill="#0A0C18" stroke={OUT} strokeWidth={4} opacity={0.92}>
        <polygon points={`-100,${ground + 160} -100,${ground + 34} ${W * 0.1},${ground + 48} ${W * 0.12},${ground + 160}`} />
        <polygon points={`${W + 100},${ground + 160} ${W + 100},${ground + 34} ${W * 0.9},${ground + 48} ${W * 0.88},${ground + 160}`} />
      </g>
      <LightVeil
        id={`${id}veil`}
        lights={[
          [W * 0.5, vert ? ground - 400 : 380, 560],
          [W * 0.5, ground - 160, 460],
        ]}
        o={0.42}
      />
      <Dust t={t} seed={77} x0={0} y0={wallTop} w={W} h={ground - wallTop} n={32} o={0.4} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 3. VOID: Deep-navy SpaceBackdrop stage with tinted light rays
// ---------------------------------------------------------------------------
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const gName = String(sp.glow ?? 'gold');
  const col = gName === 'cyan' ? PALETTE.cyan : gName === 'red' ? PALETTE.red : PALETTE.gold;
  const kind: 'warm' | 'cool' | 'red' = gName === 'cyan' ? 'cool' : gName === 'red' ? 'red' : 'warm';
  const cx = W * 0.5;
  const cy = vert ? 0.52 * H : 0.46 * H;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={PALETTE.space} />
        <Stars seed={109} x0={-900} y0={-1000} w={W + 1800} h={H + 1400} t={t} n={18} o={0.45} />
        <Glow x={cx} y={cy} r={540} kind={kind} o={0.55} />
        <Rays x={cx} y={cy} t={t} len={1750} n={14} o={0.14} color={col} />
        {/* Subtle rotating reticle rings */}
        <g transform={`translate(${cx} ${cy}) rotate(${t * 0.09})`} opacity={0.18}>
          <circle r={vert ? 260 : 300} fill="none" stroke={col} strokeWidth={2.5} strokeDasharray="18 14" />
        </g>
        <g transform={`translate(${cx} ${cy}) rotate(${-t * 0.06})`} opacity={0.14}>
          <circle r={vert ? 370 : 430} fill="none" stroke={col} strokeWidth={2} strokeDasharray="8 18" />
        </g>
      </g>
    );
  }

  if (layer === 'mid') {
    const pulse = 0.65 + 0.35 * Math.sin(t * 0.08);
    return (
      <g>
        <GroundPlane y={ground} fill="#0E0C1E" rim={col} />
        <ellipse cx={cx} cy={ground + 6} rx={vert ? 320 : 480} ry={18} fill={col} opacity={0.12 * pulse} />
        <Glow x={cx} y={ground} r={260} kind={kind} o={0.22 * pulse} />
      </g>
    );
  }

  return (
    <g>
      <LightVeil id={`${id}veil`} lights={[[cx, cy, 620]]} o={0.44} />
      <Dust t={t} seed={53} x0={0} y0={120} w={W} h={ground - 60} n={26} o={0.45} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 4. FLYBY: Earth close-up from space, glowing burn arc, altitude line
// ---------------------------------------------------------------------------
export const FlybySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const tPos = clamp(Number(sp.t ?? 0.5));
  const burn = clamp(Number(sp.burn ?? 0));
  const showAlt = Number(sp.alt ?? 0) > 0.5;
  const earthR = vert ? 2100 : 2400;
  const earthCy = ground + earthR - 18;
  const earthCx = W * 0.5;

  if (layer === 'far') {
    const flareX = vert ? 0.18 * W : 0.15 * W;
    const flareY = vert ? 0.22 * H : 0.2 * H;
    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={PALETTE.space} />
        <Stars seed={211} x0={-900} y0={-1000} w={W + 1800} h={H + 1000} t={t} n={115} o={0.88} />
        <Glow x={flareX} y={flareY} r={340} kind="cool" o={0.32} />
        <Rays x={flareX} y={flareY} t={t} len={1500} n={10} o={0.07} color="#CFE6FF" />
      </g>
    );
  }

  if (layer === 'mid') {
    // Hyperbolic flyby curve above Earth horizon
    const p0x = vert ? 0.08 * W : 0.08 * W;
    const p0y = vert ? ground - 520 : ground - 440;
    const pcx = 0.5 * W;
    const pcy = vert ? ground - 190 : ground - 170;
    const p1x = vert ? 0.92 * W : 0.92 * W;
    const p1y = vert ? ground - 540 : ground - 450;

    const qPt = (u: number) => {
      const m = 1 - u;
      return {
        x: m * m * p0x + 2 * m * u * pcx + u * u * p1x,
        y: m * m * p0y + 2 * m * u * pcy + u * u * p1y,
        dx: 2 * m * (pcx - p0x) + 2 * u * (p1x - pcx),
        dy: 2 * m * (pcy - p0y) + 2 * u * (p1y - pcy),
      };
    };

    const uNow = clamp(tPos + (p - 0.5) * 0.14);
    const craft = qPt(uNow);
    const craftAng = (Math.atan2(craft.dy, craft.dx) * 180) / Math.PI;
    const horizonYAtCraft = earthCy - Math.sqrt(Math.max(1, earthR * earthR - (craft.x - earthCx) * (craft.x - earthCx)));

    // Build path string for active trail up to uNow
    const trailSteps = 20;
    const trailD = Array.from({ length: trailSteps + 1 })
      .map((_, i) => {
        const pt = qPt((i / trailSteps) * uNow);
        return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ');

    // Build glowing orange burn arc around periapsis
    const burnFrac = burn * easeOut(clamp(p / 0.55));
    const b0 = clamp(0.32);
    const b1 = clamp(0.32 + burnFrac * 0.42);
    const burnD =
      burnFrac > 0.02
        ? Array.from({ length: 16 })
            .map((_, i) => {
              const pt = qPt(lerp(b0, b1, i / 15));
              return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
            })
            .join(' ')
        : '';

    const drift = -(t * 0.35) % 420;

    return (
      <g>
        <defs>
          <clipPath id={`${id}earthClip`}>
            <circle cx={earthCx} cy={earthCy} r={earthR} />
          </clipPath>
          <linearGradient id={`${id}ocean`} x1="0" y1={ground - 40} x2="0" y2={ground + 450} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E5CA8" />
            <stop offset="45%" stopColor="#143B73" />
            <stop offset="100%" stopColor="#0A1836" />
          </linearGradient>
        </defs>

        {/* Cyan atmospheric glow halo */}
        <circle cx={earthCx} cy={earthCy} r={earthR + 42} fill="#4CE8FF" opacity={0.14} />
        <circle cx={earthCx} cy={earthCy} r={earthR + 18} fill="#72F0FF" opacity={0.22} />
        <Glow x={earthCx} y={ground - 10} r={540} kind="cool" o={0.35} />

        {/* Deep blue Earth disc + outlined continents */}
        <circle cx={earthCx} cy={earthCy} r={earthR} fill={`url(#${id}ocean)`} stroke={OUT} strokeWidth={4} />
        <g clipPath={`url(#${id}earthClip)`}>
          <g transform={`translate(${drift} 0)`}>
            {[
              { x: -120, y: ground + 30, w: 340, h: 120 },
              { x: 420, y: ground + 5, w: 420, h: 150 },
              { x: 1080, y: ground + 35, w: 380, h: 140 },
              { x: 1680, y: ground + 15, w: 410, h: 130 },
            ].map((c, i) => (
              <path
                key={i}
                d={`M ${c.x} ${c.y} Q ${c.x + c.w * 0.35} ${c.y - 26} ${c.x + c.w * 0.72} ${c.y + 8} Q ${c.x + c.w} ${c.y + 38} ${c.x + c.w * 0.8} ${c.y + c.h} L ${c.x + 24} ${c.y + c.h} Z`}
                fill="#2E7C5E"
                stroke={OUT}
                strokeWidth={3.5}
                opacity={0.85}
              />
            ))}
            {/* Wispy cloud bands */}
            {[160, 740, 1340, 1890].map((cx, i) => (
              <ellipse key={i} cx={cx} cy={ground + 28 + (i % 2) * 34} rx={150} ry={14} fill="#EAF3FF" opacity={0.32} />
            ))}
          </g>
        </g>
        {/* Crisp pale rim along Earth's curved horizon */}
        <circle cx={earthCx} cy={earthCy} r={earthR} fill="none" stroke="#D5DCF0" strokeWidth={4.5} opacity={0.85} />

        {/* Full orbital trajectory guide */}
        <path
          d={`M ${p0x} ${p0y} Q ${pcx} ${pcy} ${p1x} ${p1y}`}
          fill="none"
          stroke={PALETTE.cyan}
          strokeWidth={3}
          strokeDasharray="10 10"
          opacity={0.42}
        />
        {/* Active teal trail */}
        <path d={trailD} fill="none" stroke={PALETTE.cyan} strokeWidth={4.5} strokeLinecap="round" opacity={0.85} />

        {/* Glowing orange engine burn arc */}
        {burnD ? (
          <g>
            <path d={burnD} fill="none" stroke="#FF6E3D" strokeWidth={13} strokeLinecap="round" opacity={0.45} />
            <path d={burnD} fill="none" stroke="#FF9B42" strokeWidth={6} strokeLinecap="round" />
            <path d={burnD} fill="none" stroke="#FFF4CC" strokeWidth={2.5} strokeLinecap="round" />
          </g>
        ) : null}

        {/* Altitude line from craft down to horizon */}
        {showAlt ? (
          <g>
            <line
              x1={craft.x}
              y1={craft.y + 18}
              x2={craft.x}
              y2={horizonYAtCraft}
              stroke={PALETTE.cream}
              strokeWidth={3}
              strokeDasharray="8 8"
              opacity={0.8}
            />
            <circle cx={craft.x} cy={horizonYAtCraft} r={6} fill={PALETTE.cyan} stroke={OUT} strokeWidth={3} />
            <circle cx={craft.x} cy={horizonYAtCraft} r={14 + 4 * Math.sin(t * 0.25)} fill="none" stroke={PALETTE.cyan} strokeWidth={2} opacity={0.55} />
          </g>
        ) : null}

        {/* Twin spacecraft on trajectory */}
        <TwinCraftDot x={craft.x} y={craft.y} angleDeg={craftAng} scale={0.95} burn={burn} t={t} />
      </g>
    );
  }

  // NEAR layer
  return (
    <g>
      <LightVeil id={`${id}veil`} lights={[[W * 0.5, ground - 260, 620]]} o={0.34} />
      <Dust t={t} seed={143} x0={0} y0={120} w={W} h={ground - 60} n={36} o={0.48} />
    </g>
  );
};
