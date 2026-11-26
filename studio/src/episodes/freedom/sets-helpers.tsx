import React from 'react';
import { PALETTE } from '../../brand';
import { clamp, easeInOut, lerp } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { Stars } from '../../engine/kit';

export const DARK_LINE = '#14111E';

export type GlowTheme = {
  color: string;
  warm: string;
  kind: 'warm' | 'cool' | 'red';
  ray: string;
};

export const getGlowTheme = (g: unknown): GlowTheme => {
  if (g === 'cyan') return { color: PALETTE.cyan, warm: '#5BE5FF', kind: 'cool', ray: '#B8F2FF' };
  if (g === 'red') return { color: PALETTE.red, warm: '#FF6B78', kind: 'red', ray: '#FF989E' };
  return { color: PALETTE.gold, warm: '#FFB84D', kind: 'warm', ray: '#FFE2B0' };
};

export const FullStars: React.FC<{
  t: number;
  W: number;
  H: number;
  seed?: number;
  n?: number;
  o?: number;
}> = ({ t, W, H, seed = 107, n = 130, o = 0.88 }) => (
  <Stars seed={seed} x0={-W * 0.8} y0={-H * 0.6} w={W * 2.6} h={H * 2.2} t={t} n={n} o={o} />
);

type ShipVectorProps = {
  t: number;
  p: number;
  reactor: number;
  thrust: number;
  arrays: number;
  boomFactor?: number;
  glow: GlowTheme;
  id: string;
  showCapsule?: boolean;
};

/**
 * NASA SR-1 Freedom spacecraft vector (left = front reactor/shield, right = PPE/arrays/Hall thruster).
 * Supports animated wing unrolling, reactor thermal bloom, radiator heat shimmer, and Hall thruster plume.
 */
export const FreedomShipVector: React.FC<ShipVectorProps> = ({
  t,
  p,
  reactor,
  thrust,
  arrays,
  boomFactor = 1,
  glow,
  id,
  showCapsule = true,
}) => {
  const ext =
    arrays < 0.99
      ? clamp(lerp(Math.max(0.08, arrays - 0.38), arrays, easeInOut(clamp(p * 1.2))))
      : 1;
  const pulse = 0.85 + 0.15 * Math.sin(t / 7);
  const rGlow = clamp(reactor) * pulse;
  const tGlow = clamp(thrust) * (0.88 + 0.12 * Math.sin(t / 4));
  const boomShift = lerp(-150, 0, clamp(boomFactor));
  const wingLen = 240 * ext;
  const glintPos = ((t * 4.5) % 340) - 90;

  const renderSolarWing = (dir: -1 | 1, keyId: string) => {
    const h = wingLen;
    const w = 88;
    const rows = 6;
    const cols = 4;
    const y0 = dir * 56;
    const skew = dir * 18;
    return (
      <g key={keyId}>
        <defs>
          <clipPath id={`${id}${keyId}clip`}>
            <polygon
              points={`${-w / 2},${y0} ${w / 2},${y0} ${w / 2 + skew},${y0 + dir * h} ${-w / 2 + skew},${y0 + dir * h}`}
            />
          </clipPath>
        </defs>
        {/* Support strut */}
        <line x1={0} y1={dir * 38} x2={skew * 0.95} y2={y0 + dir * h} stroke="#8B95AA" strokeWidth={8} />
        <g clipPath={`url(#${id}${keyId}clip)`}>
          <rect
            x={-w}
            y={dir < 0 ? y0 - h - 10 : y0 - 10}
            width={w * 2}
            height={h + 20}
            fill="#4B2C7A"
          />
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const cellH = h / rows;
              const cellW = w / cols;
              const cy = dir > 0 ? y0 + r * cellH : y0 - (r + 1) * cellH;
              const cx = -w / 2 + c * cellW + (skew * (r + 0.5)) / rows;
              const isWhite = (r + c) % 2 === 0;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={cx - 4}
                  y={cy}
                  width={cellW + 4}
                  height={cellH}
                  fill={isWhite ? '#ECEFF8' : '#6A3FB0'}
                  stroke="#2B1B4A"
                  strokeWidth={1.6}
                />
              );
            }),
          )}
          {/* Gold sun-glint sweep */}
          {ext > 0.35 ? (
            <rect
              x={-w}
              y={dir > 0 ? y0 + glintPos : y0 - glintPos - 36}
              width={w * 2}
              height={32}
              fill="#FFE29A"
              opacity={0.34}
              transform={`skewY(${dir * 12})`}
            />
          ) : null}
        </g>
        <polygon
          points={`${-w / 2},${y0} ${w / 2},${y0} ${w / 2 + skew},${y0 + dir * h} ${-w / 2 + skew},${y0 + dir * h}`}
          fill="none"
          stroke={DARK_LINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {/* Roll-out canister drum */}
        <rect
          x={-w / 2 - 6 + skew}
          y={y0 + dir * h - 9}
          width={w + 12}
          height={18}
          rx={9}
          fill="#D9A043"
          stroke={DARK_LINE}
          strokeWidth={3.5}
        />
      </g>
    );
  };

  return (
    <g>
      {/* Back plane: Upper solar wing + upper radiator */}
      <g transform="translate(88 0)">{renderSolarWing(-1, 'wingTop')}</g>
      <g transform="translate(-44 -56)">
        <rect x={-38} y={-118} width={76} height={114} rx={5} fill="#565F74" stroke={DARK_LINE} strokeWidth={4} />
        {[-24, -8, 8, 24].map((rx, i) => (
          <line key={i} x1={rx} y1={-112} x2={rx} y2={-8} stroke="#363D4E" strokeWidth={3} />
        ))}
        {rGlow > 0.08 ? (
          <rect x={-34} y={-114} width={68} height={106} fill="#FF5D47" opacity={rGlow * 0.32} />
        ) : null}
      </g>

      {/* Heat shimmer waves off radiators when reactor runs */}
      {rGlow > 0.12 ? (
        <g opacity={rGlow * 0.65} stroke="#FF8A5C" strokeWidth={2.5} fill="none" strokeLinecap="round">
          {[-68, -44, -20].map((hx, i) => {
            const dy = ((t * 1.4 + i * 18) % 52);
            return (
              <path
                key={i}
                d={`M ${hx} ${-182 - dy} Q ${hx + 8} ${-196 - dy} ${hx} ${-210 - dy}`}
              />
            );
          })}
        </g>
      ) : null}

      {/* Short metal truss boom connecting PPE to reactor */}
      <g>
        <rect
          x={-172 + boomShift}
          y={-18}
          width={142 - boomShift}
          height={36}
          fill="#22263A"
          stroke={DARK_LINE}
          strokeWidth={4}
        />
        {Array.from({ length: 5 }).map((_, i) => {
          const sx = -164 + boomShift + i * ((128 - boomShift) / 5);
          const step = (128 - boomShift) / 5;
          return (
            <path
              key={i}
              d={`M ${sx} -16 L ${sx + step} 16 M ${sx} 16 L ${sx + step} -16`}
              stroke="#8C97AE"
              strokeWidth={4}
            />
          );
        })}
        <line
          x1={-170 + boomShift}
          y1={-15}
          x2={-30}
          y2={-15}
          stroke="#E8A944"
          strokeWidth={3}
        />
      </g>

      {/* Reactor module + dark radiation shadow shield at front (left) */}
      <g transform={`translate(${-212 + boomShift} 0)`}>
        {rGlow > 0.04 ? (
          <Glow x={-16} y={0} r={115 + rGlow * 55} kind={glow.kind === 'red' ? 'red' : 'warm'} o={0.38 + rGlow * 0.52} />
        ) : null}
        {/* Reactor cylinder */}
        <rect x={-58} y={-44} width={76} height={88} rx={12} fill="#8D97AC" stroke={DARK_LINE} strokeWidth={4} />
        <rect x={-54} y={-40} width={68} height={16} rx={6} fill="#B8C2D6" />
        {/* Core glow slits */}
        {[-16, 0, 16].map((cy, i) => (
          <rect
            key={i}
            x={-44}
            y={cy - 4}
            width={48}
            height={8}
            rx={4}
            fill={rGlow > 0.06 ? (glow.kind === 'red' ? '#FF5E4D' : '#FFB042') : '#292E3F'}
            opacity={rGlow > 0.06 ? 0.45 + 0.55 * rGlow : 1}
          />
        ))}
        {/* Dark round radiation shield disc */}
        <ellipse cx={28} cy={0} rx={16} ry={58} fill="#262336" stroke={DARK_LINE} strokeWidth={4} />
        <path d="M 24 -52 A 14 52 0 0 0 24 52" stroke="#625E7D" strokeWidth={3} fill="none" />
        {/* Orange rim highlight on reactor front */}
        <path d="M -54 -30 L -54 28" stroke="#FF9B52" strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />
      </g>

      {/* Main Power & Propulsion Element (PPE) silver box body */}
      <g>
        <rect x={-36} y={-62} width={246} height={124} rx={10} fill="#B7C1D4" stroke={DARK_LINE} strokeWidth={4} />
        {/* Shaded lower plane */}
        <rect x={-32} y={24} width={238} height={34} rx={4} fill="#7B859B" />
        {/* Top orange rim light */}
        <line x1={-30} y1={-56} x2={204} y2={-56} stroke="#FFA357" strokeWidth={4} opacity={0.82} />
        {/* Gold MLI foil stripe + panel seams */}
        <rect x={6} y={-42} width={52} height={66} rx={4} fill="#D89A3A" stroke={DARK_LINE} strokeWidth={3} />
        <rect x={76} y={-42} width={96} height={66} rx={4} fill="#96A1B8" stroke={DARK_LINE} strokeWidth={3} />
        <circle cx={154} cy={-24} r={5} fill={glow.color} />
        {/* SkyFall payload capsule tucked under PPE belly */}
        {showCapsule ? (
          <g transform="translate(36 74)">
            <path d="M -38 -12 L 38 -12 L 22 18 L -22 18 Z" fill="#8A94A8" stroke={DARK_LINE} strokeWidth={4} />
            <path d="M -42 -12 Q 0 -22 42 -12" stroke="#D16B3E" strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M -42 -12 Q 0 -22 42 -12" stroke={DARK_LINE} strokeWidth={2.5} fill="none" />
          </g>
        ) : null}
      </g>

      {/* Lower radiator panel */}
      <g transform="translate(-44 56)">
        <rect x={-38} y={4} width={76} height={114} rx={5} fill="#5C657A" stroke={DARK_LINE} strokeWidth={4} />
        {[-24, -8, 8, 24].map((rx, i) => (
          <line key={i} x1={rx} y1={10} x2={rx} y2={112} stroke="#363D4E" strokeWidth={3} />
        ))}
        {rGlow > 0.08 ? (
          <rect x={-34} y={8} width={68} height={106} fill="#FF5D47" opacity={rGlow * 0.32} />
        ) : null}
      </g>

      {/* X-band communications dish */}
      <g transform="translate(152 -74) rotate(-14)">
        <line x1={0} y1={14} x2={0} y2={0} stroke="#7A8499" strokeWidth={6} />
        <path d="M -36 -8 Q 0 22 36 -8 Z" fill="#EDF1FA" stroke={DARK_LINE} strokeWidth={4} />
        <line x1={0} y1={-4} x2={0} y2={-24} stroke={DARK_LINE} strokeWidth={3} />
        <circle cx={0} cy={-25} r={4.5} fill={PALETTE.cyan} />
      </g>

      {/* Hall thruster nozzle & soft blue ion plume at back (right) */}
      <g transform="translate(210 0)">
        {tGlow > 0.05 ? (
          <g>
            <Glow x={44} y={0} r={85 + tGlow * 80} kind="cool" o={0.35 + tGlow * 0.45} />
            <path
              d={`M 26 -24 L ${150 + tGlow * 230} ${-48 - tGlow * 28} L ${150 + tGlow * 230} ${48 + tGlow * 28} L 26 24 Z`}
              fill="#46DFFF"
              opacity={0.28 + tGlow * 0.25}
            />
            <path
              d={`M 26 -14 L ${110 + tGlow * 170} ${-18 - tGlow * 10} L ${110 + tGlow * 170} ${18 + tGlow * 10} L 26 14 Z`}
              fill="#D4FAFF"
              opacity={0.45 + tGlow * 0.4}
            />
            {[0, 1, 2].map((k) => {
              const rx = 44 + ((t * 5 + k * 42) % (80 + tGlow * 110));
              return (
                <ellipse
                  key={k}
                  cx={rx}
                  cy={0}
                  rx={5}
                  ry={14 + rx * 0.08}
                  fill="none"
                  stroke="#A8F5FF"
                  strokeWidth={2.5}
                  opacity={Math.max(0, 0.7 - rx / 260)}
                />
              );
            })}
          </g>
        ) : null}
        <path d="M 0 -30 L 28 -24 L 28 24 L 0 30 Z" fill="#4C5368" stroke={DARK_LINE} strokeWidth={4} />
        <ellipse cx={28} cy={0} rx={7} ry={22} fill={tGlow > 0.05 ? '#7BF0FF' : '#24293B'} stroke={DARK_LINE} strokeWidth={3.5} />
      </g>

      {/* Front plane: Lower purple-and-white solar wing */}
      <g transform="translate(88 0)">{renderSolarWing(1, 'wingBot')}</g>
    </g>
  );
};

export const HeliSprite: React.FC<{
  t: number;
  folded?: boolean;
  spin?: boolean;
  scale?: number;
  phase?: number;
}> = ({ t, folded = false, spin = false, scale = 1, phase = 0 }) => {
  const bob = folded ? 0 : Math.sin(t / 10 + phase) * 5;
  const bladeSpread = folded ? 10 : 74;
  return (
    <g transform={`translate(0 ${bob}) scale(${scale})`}>
      {/* Four thin splayed legs */}
      {[-1, 1].map((side) => (
        <g key={side} stroke={DARK_LINE} strokeWidth={4} strokeLinecap="round">
          <line x1={side * 14} y1={14} x2={side * (folded ? 15 : 42)} y2={folded ? 52 : 52} />
          <line x1={side * 8} y1={14} x2={side * (folded ? 10 : 28)} y2={folded ? 52 : 46} />
        </g>
      ))}
      {/* Grey cube body */}
      <rect x={-20} y={-14} width={40} height={32} rx={5} fill="#96A0B5" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-12} y={-6} width={24} height={16} rx={3} fill="#D89B3B" stroke={DARK_LINE} strokeWidth={2.5} />
      {/* Mast */}
      <line x1={0} y1={-14} x2={0} y2={-54} stroke={DARK_LINE} strokeWidth={5} />
      {/* Coaxial rotor blades */}
      {spin && !folded ? (
        <g>
          <ellipse cx={0} cy={-38} rx={78} ry={8} fill="#DCE7FA" opacity={0.28} stroke="#9AB0D4" strokeWidth={2} />
          <ellipse cx={0} cy={-48} rx={74} ry={7} fill="#DCE7FA" opacity={0.25} stroke="#9AB0D4" strokeWidth={2} />
          <path
            d={`M -66 -43 A 66 9 0 0 1 ${Math.cos(t * 0.9 + phase) * 66} -43`}
            stroke={PALETTE.cyan}
            strokeWidth={3}
            fill="none"
            opacity={0.75}
          />
        </g>
      ) : (
        <g>
          <rect
            x={-bladeSpread}
            y={-41}
            width={bladeSpread * 2}
            height={7}
            rx={3}
            fill="#2E3245"
            stroke={DARK_LINE}
            strokeWidth={3}
          />
          <rect
            x={-bladeSpread * 0.92}
            y={-51}
            width={bladeSpread * 1.84}
            height={7}
            rx={3}
            fill="#444A64"
            stroke={DARK_LINE}
            strokeWidth={3}
          />
        </g>
      )}
      {/* Top solar panel cap */}
      <rect x={-22} y={-64} width={44} height={11} rx={3} fill="#354A8A" stroke={DARK_LINE} strokeWidth={3.5} />
    </g>
  );
};
