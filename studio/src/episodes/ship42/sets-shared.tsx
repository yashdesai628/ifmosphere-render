import React from 'react';
import { PALETTE } from '../../brand';
import { clamp, lerp } from '../../engine/anim';
import { Glow } from '../../engine/light';

export const OUTLINE = '#121019';
export const SW = 4;

/** Full-overscan vertical gradient sky covering all possible camera pans and zooms. */
export const SkyBackdrop: React.FC<{
  id: string;
  W: number;
  H: number;
  yTop?: number;
  yBot?: number;
  stops: [number, string][];
}> = ({ id, W, H, yTop = -400, yBot = H + 200, stops }) => (
  <g>
    <defs>
      <linearGradient id={id} x1="0" y1={yTop} x2="0" y2={yBot} gradientUnits="userSpaceOnUse">
        {stops.map(([off, col], i) => (
          <stop key={i} offset={`${off * 100}%`} stopColor={col} />
        ))}
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1400} width={W + 2800} height={H + 2800} fill={`url(#${id})`} />
  </g>
);

/** Animated multi-layered rocket engine flame pointing downward from (x, y). */
export const FlamePlume: React.FC<{
  x: number;
  y: number;
  t: number;
  power: number;
  scale?: number;
  angle?: number;
  coolCore?: boolean;
}> = ({ x, y, t, power, scale = 1, angle = 0, coolCore = false }) => {
  if (power <= 0.01) return null;
  const flicker = 1 + 0.08 * Math.sin(t * 0.72) + 0.05 * Math.cos(t * 1.17);
  const sway = 3.5 * Math.sin(t * 0.55) * scale;
  const h = (140 + 180 * power) * scale * flicker;
  const w = (36 + 34 * power) * scale;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <Glow x={0} y={h * 0.35} r={Math.max(80, h * 0.9)} kind="warm" o={0.55 * power} />
      <path
        d={`M ${-w} 0 Q ${-w * 1.18} ${h * 0.42} ${sway} ${h} Q ${w * 1.18} ${h * 0.42} ${w} 0 Z`}
        fill="#FF6624"
        opacity={0.92}
      />
      <path
        d={`M ${-w * 0.68} 0 Q ${-w * 0.76} ${h * 0.36} ${sway * 0.6} ${h * 0.78} Q ${w * 0.76} ${h * 0.36} ${w * 0.68} 0 Z`}
        fill="#FFAE3D"
      />
      <path
        d={`M ${-w * 0.36} 0 Q ${-w * 0.32} ${h * 0.28} ${sway * 0.3} ${h * 0.48} Q ${w * 0.32} ${h * 0.28} ${w * 0.36} 0 Z`}
        fill={coolCore ? '#DFF8FF' : '#FFF4D8'}
      />
      {/* Mach shock diamonds */}
      {[0.24, 0.46, 0.66].map((f, i) => (
        <ellipse
          key={i}
          cx={sway * f}
          cy={h * f}
          rx={w * (0.28 - i * 0.06)}
          ry={h * 0.045}
          fill={coolCore ? '#E8FCFF' : '#FFF7E6'}
          opacity={0.75 * power}
        />
      ))}
    </g>
  );
};

/**
 * Ship 42 upper stage drawn around its vertical center (0, 0), height ~240 at scale=1.
 * Base is at y=+120, nose tip at y=-120.
 */
export const StarshipVehicle: React.FC<{
  x: number;
  y: number;
  t: number;
  scale?: number;
  angle?: number;
  flame?: number;
  heatGlow?: number;
  tileSide?: 'left' | 'right' | 'split';
  payloadOpen?: number;
  coolCore?: boolean;
}> = ({
  x,
  y,
  t,
  scale = 1,
  angle = 0,
  flame = 0,
  heatGlow = 0,
  tileSide = 'split',
  payloadOpen = 0,
  coolCore = false,
}) => {
  const hw = 28;
  const bodyTop = -55;
  const bodyBot = 115;
  const noseTip = -125;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${angle})`}>
      <FlamePlume x={0} y={bodyBot + 4} t={t} power={flame} scale={0.75} coolCore={coolCore} />

      {/* Forward & aft aero flaps */}
      <polygon
        points={`${-hw + 2},${bodyTop - 16} ${-hw - 20},${bodyTop + 12} ${-hw + 2},${bodyTop + 26}`}
        fill="#2A283C"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <polygon
        points={`${hw - 2},${bodyTop - 16} ${hw + 20},${bodyTop + 12} ${hw - 2},${bodyTop + 26}`}
        fill="#2A283C"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <polygon
        points={`${-hw + 2},${bodyBot - 44} ${-hw - 26},${bodyBot - 8} ${-hw - 22},${bodyBot + 4} ${-hw + 2},${bodyBot - 2}`}
        fill="#242234"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <polygon
        points={`${hw - 2},${bodyBot - 44} ${hw + 26},${bodyBot - 8} ${hw + 22},${bodyBot + 4} ${hw - 2},${bodyBot - 2}`}
        fill="#242234"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />

      {/* Main hull silhouette */}
      <path
        d={`M 0 ${noseTip} C ${hw * 0.72} ${bodyTop - 42}, ${hw} ${bodyTop - 14}, ${hw} ${bodyTop} L ${hw} ${bodyBot} L ${-hw} ${bodyBot} L ${-hw} ${bodyTop} C ${-hw} ${bodyTop - 14}, ${-hw * 0.72} ${bodyTop - 42}, 0 ${noseTip} Z`}
        fill="#CFD7E6"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />

      {/* Shaded steel band & black thermal tile face */}
      {tileSide === 'left' ? (
        <path
          d={`M 0 ${noseTip} C ${-hw * 0.72} ${bodyTop - 42}, ${-hw} ${bodyTop - 14}, ${-hw} ${bodyTop} L ${-hw} ${bodyBot} L 2 ${bodyBot} L 2 ${noseTip} Z`}
          fill="#222031"
        />
      ) : tileSide === 'right' ? (
        <path
          d={`M 0 ${noseTip} C ${hw * 0.72} ${bodyTop - 42}, ${hw} ${bodyTop - 14}, ${hw} ${bodyTop} L ${hw} ${bodyBot} L -2 ${bodyBot} L -2 ${noseTip} Z`}
          fill="#222031"
        />
      ) : (
        <>
          <path
            d={`M 0 ${noseTip} C ${hw * 0.72} ${bodyTop - 42}, ${hw} ${bodyTop - 14}, ${hw} ${bodyTop} L ${hw} ${bodyBot} L 4 ${bodyBot} L 4 ${noseTip} Z`}
            fill="#242234"
          />
          <rect x={-12} y={bodyTop} width={16} height={bodyBot - bodyTop} fill="#98A4BE" opacity={0.55} />
        </>
      )}

      {/* Optional open Starlink Pez dispenser slot */}
      {payloadOpen > 0.05 ? (
        <g>
          <rect
            x={-hw + 8}
            y={bodyTop - 4}
            width={18}
            height={44 * payloadOpen}
            rx={3}
            fill="#0D1020"
            stroke="#7CE0FF"
            strokeWidth={2.5}
          />
          <rect
            x={-hw + 11}
            y={bodyTop - 1}
            width={12}
            height={38 * payloadOpen}
            rx={2}
            fill="#254C6E"
            opacity={0.7}
          />
        </g>
      ) : null}

      {/* Steel ring seams & catch pins */}
      {[-30, 8, 46, 84].map((ry, i) => (
        <line key={i} x1={-hw + 3} y1={ry} x2={hw - 3} y2={ry} stroke="#636E8A" strokeWidth={2} opacity={0.5} />
      ))}
      <rect x={-hw - 5} y={bodyTop + 6} width={7} height={10} rx={2} fill="#EAEFF8" stroke={OUTLINE} strokeWidth={2.5} />
      <rect x={hw - 2} y={bodyTop + 6} width={7} height={10} rx={2} fill="#EAEFF8" stroke={OUTLINE} strokeWidth={2.5} />

      {/* Outer stroke re-trace + pale steel rim highlight */}
      <path
        d={`M 0 ${noseTip} C ${hw * 0.72} ${bodyTop - 42}, ${hw} ${bodyTop - 14}, ${hw} ${bodyTop} L ${hw} ${bodyBot} L ${-hw} ${bodyBot} L ${-hw} ${bodyTop} C ${-hw} ${bodyTop - 14}, ${-hw * 0.72} ${bodyTop - 42}, 0 ${noseTip} Z`}
        fill="none"
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path
        d={`M ${-hw + 6} ${bodyBot - 10} L ${-hw + 6} ${bodyTop + 4} C ${-hw + 6} ${bodyTop - 14}, ${-hw * 0.55} ${bodyTop - 36}, -3 ${noseTip + 14}`}
        fill="none"
        stroke="#F6EFE3"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.72}
      />

      {/* Engine skirt nozzles */}
      <rect x={-hw + 5} y={bodyBot - 4} width={hw * 2 - 10} height={8} rx={2} fill="#1C1A29" stroke={OUTLINE} strokeWidth={3} />

      {/* Reentry edge heat glow */}
      {heatGlow > 0.05 ? (
        <path
          d={`M ${hw - 2} ${noseTip + 18} C ${hw + 4} ${bodyTop - 12}, ${hw + 4} ${bodyTop}, ${hw + 4} ${bodyBot + 2}`}
          fill="none"
          stroke="#FF8C42"
          strokeWidth={5 * heatGlow}
          opacity={0.8 * heatGlow}
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
};

/**
 * Super Heavy Booster 22 drawn around (0, 0), height ~300 at scale=1 (top=-150, bottom=+150).
 */
export const BoosterVehicle: React.FC<{
  x: number;
  y: number;
  t: number;
  scale?: number;
  angle?: number;
  flame?: number;
  sputter?: boolean;
}> = ({ x, y, t, scale = 1, angle = 0, flame = 0, sputter = false }) => {
  const hw = 30;
  const top = -148;
  const bot = 148;
  const flickerFlame = sputter ? flame * (0.45 + 0.35 * Math.sin(t * 1.4)) : flame;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${angle})`}>
      <FlamePlume x={0} y={bot + 6} t={t} power={flickerFlame} scale={1.05} />
      {sputter ? (
        <g transform={`translate(${hw - 8} ${bot + 4})`}>
          <Glow x={0} y={8} r={45} kind="red" o={0.55 * (0.5 + 0.5 * Math.sin(t * 1.6))} />
          <circle cx={0} cy={6} r={7 + 3 * Math.sin(t * 2.1)} fill="#FF5A36" />
        </g>
      ) : null}

      {/* Grid fins at top */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * hw} ${top + 32})`}>
          <rect
            x={side < 0 ? -24 : 0}
            y={-12}
            width={24}
            height={24}
            rx={3}
            fill="#32384F"
            stroke={OUTLINE}
            strokeWidth={SW}
          />
          <line x1={side < 0 ? -16 : 8} y1={-10} x2={side < 0 ? -16 : 8} y2={10} stroke="#8B96B2" strokeWidth={2} />
          <line x1={side < 0 ? -8 : 16} y1={-10} x2={side < 0 ? -8 : 16} y2={10} stroke="#8B96B2" strokeWidth={2} />
          <line x1={side < 0 ? -22 : 2} y1={0} x2={side < 0 ? -2 : 22} y2={0} stroke="#8B96B2" strokeWidth={2} />
        </g>
      ))}

      {/* Main stainless booster tank */}
      <rect x={-hw} y={top} width={hw * 2} height={bot - top} rx={4} fill="#BCC6DA" stroke={OUTLINE} strokeWidth={SW} />
      {/* Shaded right flank */}
      <rect x={4} y={top + 2} width={hw - 6} height={bot - top - 4} fill="#76819B" />
      {/* Hot-staging interstage collar */}
      <rect x={-hw} y={top} width={hw * 2} height={24} fill="#252336" stroke={OUTLINE} strokeWidth={SW} />
      {[-18, -6, 6, 18].map((vx, i) => (
        <rect key={i} x={vx - 3} y={top + 5} width={6} height={14} rx={1.5} fill="#0E0D18" />
      ))}
      {/* Tank weld seams & frost stripe */}
      {[-90, -45, 0, 45, 90].map((sy, i) => (
        <line key={i} x1={-hw + 3} y1={sy} x2={hw - 3} y2={sy} stroke="#5B6580" strokeWidth={2} opacity={0.55} />
      ))}
      <rect x={-hw + 3} y={-20} width={hw * 2 - 6} height={58} fill="#E8F2FF" opacity={0.22} />

      {/* Left highlight rim */}
      <line x1={-hw + 7} y1={top + 28} x2={-hw + 7} y2={bot - 12} stroke="#F6EFE3" strokeWidth={3} strokeLinecap="round" opacity={0.72} />

      {/* Engine skirt + Raptor ring */}
      <rect x={-hw - 2} y={bot - 14} width={hw * 2 + 4} height={18} rx={3} fill="#1E1C2B" stroke={OUTLINE} strokeWidth={SW} />
      {[-20, -10, 0, 10, 20].map((ex, i) => (
        <path
          key={i}
          d={`M ${ex - 4} ${bot + 4} L ${ex - 6} ${bot + 14} L ${ex + 6} ${bot + 14} L ${ex + 4} ${bot + 4} Z`}
          fill="#2D3146"
          stroke={OUTLINE}
          strokeWidth={2.5}
        />
      ))}
    </g>
  );
};

/**
 * Starbase Mechazilla launch & catch tower with articulated chopstick claws.
 * Tower mast is centered at x; claws extend rightward toward cradleX.
 */
export const LaunchTower: React.FC<{
  x: number;
  cradleX: number;
  ground: number;
  height: number;
  clawsOpen: number; // 0 = open, 1 = closed
  t: number;
  clawFrac?: number;
  showOlm?: boolean;
}> = ({ x, cradleX, ground, height, clawsOpen, t, clawFrac = 0.68, showOlm = true }) => {
  const towerW = Math.max(46, height * 0.085);
  const topY = ground - height;
  const carriageY = ground - height * clawFrac;
  const reach = Math.max(60, cradleX - x);
  const clawLen = reach + 34;
  // Open angle = ±22 deg; closed = ±3 deg clamped around ship radius
  const spread = lerp(22, 3.5, clamp(clawsOpen));
  const beaconPulse = 0.45 + 0.55 * Math.sin(t / 8);

  return (
    <g>
      {/* Concrete tower base pedestal */}
      <rect
        x={x - towerW * 0.85}
        y={ground - 34}
        width={towerW * 1.7}
        height={34}
        rx={3}
        fill="#2C2E42"
        stroke={OUTLINE}
        strokeWidth={SW}
      />

      {/* Tall steel lattice tower */}
      <rect
        x={x - towerW / 2}
        y={topY}
        width={towerW}
        height={height - 32}
        fill="#1D1F30"
        stroke={OUTLINE}
        strokeWidth={SW}
      />
      {/* Steel cross-bracing bays */}
      {Array.from({ length: 10 }).map((_, i) => {
        const y0 = topY + (i / 10) * (height - 32);
        const y1 = topY + ((i + 1) / 10) * (height - 32);
        const lx = x - towerW / 2 + 4;
        const rx = x + towerW / 2 - 4;
        return (
          <g key={i} stroke="#3B415C" strokeWidth={3}>
            <line x1={lx} y1={y0} x2={rx} y2={y1} />
            <line x1={rx} y1={y0} x2={lx} y2={y1} />
            <line x1={lx} y1={y0} x2={rx} y2={y0} />
          </g>
        );
      })}
      {/* Pale rim highlight along tower edge */}
      <line
        x1={x + towerW / 2 - 4}
        y1={topY + 6}
        x2={x + towerW / 2 - 4}
        y2={ground - 36}
        stroke="#B8C7E8"
        strokeWidth={3}
        opacity={0.5}
      />

      {/* Lightning mast & pulsing aviation strobe */}
      <line x1={x} y1={topY} x2={x} y2={topY - 46} stroke="#7A86A8" strokeWidth={4} />
      <Glow x={x} y={topY - 48} r={42} kind="red" o={0.65 * beaconPulse} />
      <circle cx={x} cy={topY - 48} r={5} fill="#FF6B5A" opacity={0.5 + 0.5 * beaconPulse} />

      {/* Orbital Launch Mount (OLM) pedestal beside tower */}
      {showOlm ? (
        <g transform={`translate(${cradleX} ${ground})`}>
          <path
            d="M -52 0 L -40 -48 L 40 -48 L 52 0 Z"
            fill="#27293D"
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <rect x={-46} y={-58} width={92} height={14} rx={3} fill="#383C57" stroke={OUTLINE} strokeWidth={SW} />
          <line x1={-36} y1={-54} x2={36} y2={-54} stroke="#9EB0D6" strokeWidth={2.5} opacity={0.65} />
        </g>
      ) : null}

      {/* Moving chopstick carriage & two steel catching claws */}
      <g transform={`translate(${x + towerW * 0.25} ${carriageY})`}>
        <rect x={-towerW * 0.65} y={-22} width={towerW * 0.95} height={44} rx={4} fill="#2F334B" stroke={OUTLINE} strokeWidth={SW} />
        {/* Upper/far claw */}
        <g transform={`translate(10 -10) rotate(${-spread})`}>
          <path
            d={`M 0 -8 L ${clawLen} -5 L ${clawLen} 5 L 0 8 Z`}
            fill="#3C425E"
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <line x1={12} y1={-4} x2={clawLen - 8} y2={-2} stroke="#D5DCF0" strokeWidth={2.5} opacity={0.65} />
        </g>
        {/* Lower/near claw */}
        <g transform={`translate(10 10) rotate(${spread})`}>
          <path
            d={`M 0 -8 L ${clawLen} -5 L ${clawLen} 5 L 0 8 Z`}
            fill="#474E6E"
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <line x1={12} y1={-4} x2={clawLen - 8} y2={-2} stroke="#EAEFF8" strokeWidth={3} opacity={0.75} />
        </g>
        {/* Catch latch indicator light */}
        <circle
          cx={6}
          cy={0}
          r={5}
          fill={clawsOpen > 0.75 ? PALETTE.green : PALETTE.gold}
        />
        <Glow x={6} y={0} r={32} kind={clawsOpen > 0.75 ? 'cool' : 'warm'} o={0.45} />
      </g>
    </g>
  );
};

/** Large curved Earth limb drawn around a far-below center (cx, cy) with radius R. */
export const EarthCurvedLimb: React.FC<{
  id: string;
  cx: number;
  cy: number;
  R: number;
  t: number;
  lights: number;
  shift?: number;
}> = ({ id, cx, cy, R, t, lights, shift = 0 }) => {
  const drift = (shift * 260 + t * 0.45) % 420;
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
        <radialGradient id={`${id}atmo`} cx="50%" cy="50%" r="50%">
          <stop offset="91%" stopColor="#38D9E8" stopOpacity={0} />
          <stop offset="97.5%" stopColor="#5BE6FF" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#B8F3FF" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}night`} x1="0.2" y1="0" x2="0.85" y2="0.5">
          <stop offset="0%" stopColor="#070914" stopOpacity={0} />
          <stop offset="55%" stopColor="#070914" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#050712" stopOpacity={0.88} />
        </linearGradient>
      </defs>

      {/* Cyan atmospheric halo around the limb */}
      <circle cx={cx} cy={cy} r={R + 54} fill={`url(#${id}atmo)`} />

      {/* Ocean disc */}
      <circle cx={cx} cy={cy} r={R} fill="#123C73" stroke="#9EEAFF" strokeWidth={4} />

      <g clipPath={`url(#${id}clip)`}>
        {/* Stylized continental landmasses drifting with orbit */}
        <g transform={`translate(${-drift} 0)`} fill="#256E63" opacity={0.88}>
          <path d={`M ${cx - 640} ${cy - R + 160} Q ${cx - 480} ${cy - R + 30} ${cx - 320} ${cy - R + 110} T ${cx - 120} ${cy - R + 180} L ${cx - 220} ${cy - R + 380} Z`} />
          <path d={`M ${cx - 40} ${cy - R + 85} Q ${cx + 120} ${cy - R + 10} ${cx + 280} ${cy - R + 90} T ${cx + 460} ${cy - R + 140} L ${cx + 380} ${cy - R + 320} L ${cx + 60} ${cy - R + 280} Z`} />
          <path d={`M ${cx + 540} ${cy - R + 120} Q ${cx + 710} ${cy - R + 55} ${cx + 890} ${cy - R + 160} L ${cx + 780} ${cy - R + 340} Z`} />
        </g>

        {/* Cloud swirls */}
        <g transform={`translate(${-drift * 1.15} 0)`} fill="#E6F4FF" opacity={0.32}>
          <ellipse cx={cx - 310} cy={cy - R + 125} rx={165} ry={22} />
          <ellipse cx={cx + 180} cy={cy - R + 75} rx={210} ry={26} />
          <ellipse cx={cx + 580} cy={cy - R + 160} rx={180} ry={20} />
        </g>

        {/* Night terminator shading */}
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}night)`} />

        {/* Night-side city lights */}
        {lights > 0.04 ? (
          <g opacity={clamp(lights)}>
            {[
              [220, 95], [248, 108], [268, 92], [315, 130], [342, 118], [390, 145],
              [420, 128], [455, 165], [488, 152], [535, 190], [560, 178], [180, 125],
            ].map(([dx, dy], i) => {
              const tw = 0.65 + 0.35 * Math.sin(t / 7 + i * 1.9);
              return (
                <circle
                  key={i}
                  cx={cx + dx - drift * 0.25}
                  cy={cy - R + dy}
                  r={3 + (i % 3)}
                  fill="#FFD56B"
                  opacity={tw}
                />
              );
            })}
          </g>
        ) : null}
      </g>

      {/* Pale atmospheric rim line */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#BCEEFF" strokeWidth={3.5} opacity={0.82} />
    </g>
  );
};
