import React from 'react';
import { PALETTE } from '../../brand';
import { clamp, lerp, rnd } from '../../engine/anim';
import { Rays, Stars, Foreground } from '../../engine/kit';
import { Glow, LightVeil, Dust } from '../../engine/light';

export const DARK_INK = '#121019';

export const num = (v: unknown, def: number): number => (typeof v === 'number' && Number.isFinite(v) ? v : def);
export const str = (v: unknown, def: string): string => (typeof v === 'string' ? v : def);

/** Full-bleed deep space backdrop sized generously for both 16:9 and 9:16 with camera pan/zoom. */
export const DeepSpaceBase: React.FC<{
  id: string;
  t: number;
  seed?: number;
  starCount?: number;
  bg?: string;
  rayColor?: string;
  rayOpacity?: number;
  rayX?: number;
  rayY?: number;
  W: number;
  H: number;
}> = ({
  id,
  t,
  seed = 107,
  starCount = 95,
  bg = '#0A0A1E',
  rayColor = '#DCE8FF',
  rayOpacity = 0.11,
  rayX,
  rayY,
  W,
  H,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}deep`} x1="0" y1={-400} x2="0" y2={H + 400} gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#070716" />
        <stop offset="55%" stopColor={bg} />
        <stop offset="100%" stopColor="#121430" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1600} width={4800} height={4400} fill={`url(#${id}deep)`} />
    <Stars seed={seed} x0={-900} y0={-1000} w={W + 1800} h={H + 2000} t={t} n={starCount} o={0.9} />
    <Rays x={rayX ?? W * 0.28} y={rayY ?? H * 0.22} t={t} len={2200} n={12} o={rayOpacity} color={rayColor} />
  </g>
);

/** Seeded soft elliptical smudges representing distant background galaxies. */
export const TinyGalaxies: React.FC<{ seed: number; W: number; H: number; n?: number; o?: number }> = ({
  seed,
  W,
  H,
  n = 18,
  o = 0.42,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const gx = -120 + rnd(seed, i) * (W + 240);
      const gy = -80 + rnd(seed + 1, i) * (H + 160);
      const rx = 12 + rnd(seed + 2, i) * 26;
      const ry = 4 + rnd(seed + 3, i) * 9;
      const rot = rnd(seed + 4, i) * 180;
      const col = i % 3 === 0 ? '#FFE2B0' : i % 3 === 1 ? '#B8D4FF' : '#D5B8FF';
      return (
        <g key={i} transform={`translate(${gx} ${gy}) rotate(${rot})`} opacity={o * (0.6 + rnd(seed + 5, i) * 0.4)}>
          <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={col} opacity={0.22} />
          <ellipse cx={0} cy={0} rx={rx * 0.55} ry={ry * 0.55} fill={col} opacity={0.42} />
          <circle cx={0} cy={0} r={Math.max(1.8, ry * 0.28)} fill="#FFF7E6" opacity={0.85} />
        </g>
      );
    })}
  </g>
);

/** Ground plane at props.ground with subtle tonal horizon bands and crisp pale rim line. */
export const StageFloor: React.FC<{
  y: number;
  fill: string;
  subFill?: string;
  rim?: string;
  W: number;
  rimOpacity?: number;
}> = ({ y, fill, subFill = '#0B0D1D', rim = '#D5DCF0', W, rimOpacity = 0.65 }) => (
  <g>
    <rect x={-1400} y={y} width={4800} height={2600} fill={fill} />
    <rect x={-1400} y={y + 85} width={4800} height={2500} fill={subFill} opacity={0.45} />
    <line x1={-1400} y1={y} x2={W + 1400} y2={y} stroke={rim} strokeWidth={3.5} opacity={rimOpacity} />
  </g>
);

/** Blurred corner silhouettes placed strictly at outer screen corners away from Pip and text slots. */
export const NearEdgeBlurs: React.FC<{ W: number; H: number; ground: number; color?: string }> = ({
  W,
  H,
  ground,
  color = '#060712',
}) => (
  <Foreground blur={10}>
    <path
      d={`M -260 ${ground + 45} Q ${W * 0.04} ${ground - 35} ${W * 0.12} ${ground + 110} L ${W * 0.15} ${H + 300} L -260 ${H + 300} Z`}
      fill={color}
      opacity={0.78}
    />
    <path
      d={`M ${W + 260} ${ground + 40} Q ${W * 0.96} ${ground - 40} ${W * 0.88} ${ground + 115} L ${W * 0.85} ${H + 300} L ${W + 260} ${H + 300} Z`}
      fill={color}
      opacity={0.78}
    />
  </Foreground>
);

/** Soft gradient band replacing kit Haze with unique per-shot SVG gradient ID. */
export const SoftBand: React.FC<{ id: string; y: number; h?: number; color?: string; o?: number }> = ({
  id,
  y,
  h = 220,
  color = '#88B4FF',
  o = 0.2,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}band`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0} />
        <stop offset="50%" stopColor={color} stopOpacity={o} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={-1400} y={y - h / 2} width={4800} height={h} fill={`url(#${id}band)`} />
  </g>
);

/** Shared flat-vector comet nucleus, coma, two-colour tails, and animated outgassing jets. */
export const CometArt: React.FC<{
  id: string;
  t: number;
  glow?: 'cyan' | 'gold';
  jets?: number;
  tailLen?: number;
  scale?: number;
}> = ({ id, t, glow = 'cyan', jets = 0.5, tailLen = 580, scale = 1 }) => {
  const isGold = glow === 'gold';
  const comaTint = isGold ? '#FFD166' : '#5EEAD4';
  const ionColor = isGold ? '#7CCBFF' : '#38BDF8';
  const dustColor = isGold ? '#FFE5B4' : '#F6EFE3';
  const pulse = 1 + 0.045 * Math.sin(t / 12);
  const jetStrength = clamp(jets);

  return (
    <g transform={`scale(${scale})`}>
      <defs>
        <linearGradient id={`${id}ion`} x1="0" y1="0" x2={tailLen} y2={-tailLen * 0.24} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={ionColor} stopOpacity={0.78} />
          <stop offset="55%" stopColor={ionColor} stopOpacity={0.28} />
          <stop offset="100%" stopColor={ionColor} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}dust`} x1="0" y1="0" x2={tailLen * 0.94} y2={tailLen * 0.14} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={dustColor} stopOpacity={0.74} />
          <stop offset="55%" stopColor="#E6CE9E" stopOpacity={0.24} />
          <stop offset="100%" stopColor="#E6CE9E" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Straight blue/cyan ion gas tail */}
      <path
        d={`M 10 -16 L ${tailLen} ${-tailLen * 0.29} L ${tailLen * 0.96} ${-tailLen * 0.15} L 14 14 Z`}
        fill={`url(#${id}ion)`}
      />
      {[0, 1, 2].map((k) => {
        const wave = Math.sin(t / 15 + k * 1.4) * 5;
        return (
          <line
            key={k}
            x1={24}
            y1={-6 + k * 7}
            x2={tailLen * (0.65 + k * 0.1)}
            y2={-tailLen * (0.21 - k * 0.025) + wave}
            stroke="#B8F2FF"
            strokeWidth={2.2}
            strokeDasharray="16 14"
            strokeDashoffset={-t * (3.2 + k * 0.6)}
            opacity={0.42}
          />
        );
      })}

      {/* Curved cream dust tail */}
      <path
        d={`M 4 -22 Q ${tailLen * 0.45} ${-tailLen * 0.09 + Math.sin(t / 18) * 8} ${tailLen * 0.94} ${tailLen * 0.02} L ${tailLen * 0.88} ${tailLen * 0.2} Q ${tailLen * 0.42} ${tailLen * 0.08} 8 24 Z`}
        fill={`url(#${id}dust)`}
      />

      {/* Fuzzy coma halo */}
      <Glow x={0} y={0} r={145 * pulse} kind={isGold ? 'warm' : 'cool'} o={0.58 + jetStrength * 0.22} />
      <circle cx={0} cy={0} r={84 * pulse} fill={comaTint} opacity={0.18 + jetStrength * 0.08} />
      <circle cx={-4} cy={0} r={58 * pulse} fill={isGold ? '#FFF1CC' : '#CCFBFF'} opacity={0.24 + jetStrength * 0.1} />

      {/* Outgassing dust & gas jets */}
      {jetStrength > 0.02 &&
        [
          { sx: -34, sy: -26, ang: -145, len: 92 },
          { sx: -42, sy: 6, ang: -175, len: 108 },
          { sx: -26, sy: 30, ang: 145, len: 84 },
          { sx: 6, sy: -36, ang: -95, len: 76 },
        ].map((j, idx) => {
          const jLen = j.len * (0.45 + 0.75 * jetStrength);
          const flow = (t * 0.055 + idx * 0.25) % 1;
          const rad = (j.ang * Math.PI) / 180;
          return (
            <g key={idx}>
              <path
                d={`M ${j.sx} ${j.sy} Q ${j.sx + Math.cos(rad) * jLen * 0.55} ${j.sy + Math.sin(rad) * jLen * 0.55} ${j.sx + Math.cos(rad) * jLen * 0.7 + jLen * 0.45} ${j.sy + Math.sin(rad) * jLen * 0.65 - 12}`}
                fill="none"
                stroke={idx % 2 === 0 ? '#A5F3FC' : '#FDE68A'}
                strokeWidth={5 * jetStrength + 1.5}
                strokeLinecap="round"
                opacity={0.35 + jetStrength * 0.4}
              />
              <circle
                cx={j.sx + Math.cos(rad) * jLen * flow + flow * 28}
                cy={j.sy + Math.sin(rad) * jLen * flow - flow * 8}
                r={2.8 + jetStrength * 2}
                fill="#F6EFE3"
                opacity={(1 - flow) * 0.85}
              />
            </g>
          );
        })}

      {/* Lumpy grey-brown nucleus with pale ice patches and 4px outline */}
      <g>
        <path
          d="M -46 -12 C -48 -34, -22 -44, 6 -38 C 30 -34, 50 -16, 48 6 C 46 28, 22 42, -6 40 C -34 38, -50 18, -46 -12 Z"
          fill="#564C54"
          stroke={DARK_INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {/* Sunlit left rim & dark right shadow */}
        <path
          d="M 8 -37 C 31 -32, 48 -14, 46 6 C 44 26, 20 40, -4 38 C 16 25, 22 -8, 8 -37 Z"
          fill="#352E36"
          opacity={0.78}
        />
        <path
          d="M -42 -10 C -42 -28, -20 -38, 2 -34"
          fill="none"
          stroke="#9CA8C2"
          strokeWidth={3.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Craters */}
        <ellipse cx={12} cy={10} rx={11} ry={8} fill="#2B242B" stroke={DARK_INK} strokeWidth={2.5} />
        <ellipse cx={-12} cy={22} rx={8} ry={5.5} fill="#3B333C" stroke={DARK_INK} strokeWidth={2} />
        {/* Pale ice patches */}
        <path
          d="M -30 -16 Q -18 -26 -6 -16 Q -14 -4 -28 -8 Z"
          fill="#DDF6FF"
          stroke={DARK_INK}
          strokeWidth={2.5}
        />
        <path
          d="M -24 6 Q -12 2 -8 12 Q -20 16 -28 10 Z"
          fill="#BFEFFF"
          stroke={DARK_INK}
          strokeWidth={2}
        />
        <circle cx={14} cy={-16} r={5} fill="#EAF9FF" stroke={DARK_INK} strokeWidth={2} />
      </g>
    </g>
  );
};

/** Shared flat-vector ESA Euclid telescope with mirror barrel, dark-blue sunshield, and golden antenna. */
export const EuclidArt: React.FC<{
  t: number;
  stare?: number;
  blink?: number;
  scale?: number;
  showBeam?: boolean;
}> = ({ t, stare = 0, blink = 0, scale = 1, showBeam = true }) => {
  const beamW = lerp(45, 210, clamp(stare));
  const beamLen = 580;
  const flashPulse = blink > 0.5 ? Math.pow(Math.max(0, Math.sin(t * 0.14)), 6) : 0;

  return (
    <g transform={`scale(${scale})`}>
      {/* Stare viewing cone */}
      {showBeam && stare > 0.02 && (
        <g transform="translate(88 -12) rotate(-14)">
          <path
            d={`M 0 -28 L ${beamLen} ${-beamW} L ${beamLen} ${beamW} L 0 28 Z`}
            fill="#4CE0FF"
            opacity={0.07 + stare * 0.11}
          />
          <line x1={0} y1={-28} x2={beamLen} y2={-beamW} stroke="#7CE8FF" strokeWidth={2} strokeDasharray="10 10" opacity={0.45} />
          <line x1={0} y1={28} x2={beamLen} y2={beamW} stroke="#7CE8FF" strokeWidth={2} strokeDasharray="10 10" opacity={0.45} />
          {[0.35, 0.68].map((f, i) => {
            const xPos = beamLen * f;
            const halfH = lerp(28, beamW, f);
            return (
              <path
                key={i}
                d={`M ${xPos} ${-halfH * 0.85} Q ${xPos + 14} 0 ${xPos} ${halfH * 0.85}`}
                fill="none"
                stroke="#A5F3FC"
                strokeWidth={2.5}
                opacity={0.32 + 0.15 * Math.sin(t / 12 - i)}
              />
            );
          })}
        </g>
      )}

      <g transform="rotate(-14)">
        {/* Flat dark-blue sunshield */}
        <polygon
          points="-92,-96 -30,-96 -18,108 -86,108"
          fill="#1D3557"
          stroke={DARK_INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <polygon points="-84,-86 -38,-86 -28,96 -78,96" fill="#274775" />
        {[-52, -14, 24, 62].map((sy, i) => (
          <line key={i} x1={-82} y1={sy} x2={-28} y2={sy} stroke="#4C73AD" strokeWidth={2} opacity={0.55} />
        ))}
        <line x1={-90} y1={-94} x2={-84} y2={104} stroke="#8AC6FF" strokeWidth={3} opacity={0.65} />

        {/* Boxy service module */}
        <rect
          x={-34}
          y={-52}
          width={68}
          height={104}
          rx={6}
          fill="#8A96B0"
          stroke={DARK_INK}
          strokeWidth={4}
        />
        <rect x={-24} y={-40} width={48} height={36} rx={3} fill="#64708A" stroke={DARK_INK} strokeWidth={2.5} />
        {/* Thermal gold foil band */}
        <rect x={-30} y={14} width={60} height={24} rx={3} fill={PALETTE.gold} stroke={DARK_INK} strokeWidth={2.5} />
        {/* Blinking status LED */}
        <circle
          cx={-10}
          cy={-22}
          r={4.5}
          fill={Math.sin(t / 7) > 0 ? '#34D399' : '#1E3A2F'}
          stroke={DARK_INK}
          strokeWidth={1.8}
        />

        {/* Cylindrical telescope barrel */}
        <rect
          x={26}
          y={-42}
          width={72}
          height={84}
          rx={8}
          fill="#C9D2E3"
          stroke={DARK_INK}
          strokeWidth={4}
        />
        <rect x={28} y={4} width={68} height={36} rx={4} fill="#8F9CB5" />
        <line x1={32} y1={-36} x2={92} y2={-36} stroke="#FFFFFF" strokeWidth={3} opacity={0.6} />

        {/* Aperture & primary mirror glint */}
        <ellipse cx={96} cy={0} rx={16} ry={38} fill="#090D1D" stroke={DARK_INK} strokeWidth={4} />
        <ellipse cx={94} cy={0} rx={10} ry={28} fill="#1E3A5F" />
        <ellipse cx={92} cy={-8} rx={4} ry={14} fill="#7CE8FF" opacity={0.75} />

        {/* Small golden antenna */}
        <line x1={-8} y1={-52} x2={-8} y2={-82} stroke={DARK_INK} strokeWidth={4} />
        <path
          d="M -30 -82 Q -8 -66 14 -82"
          fill={PALETTE.gold}
          stroke={DARK_INK}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <line x1={-8} y1={-76} x2={-8} y2={-98} stroke={DARK_INK} strokeWidth={3} />
        <circle cx={-8} cy={-100} r={4.5} fill="#FFE9A3" stroke={DARK_INK} strokeWidth={2.5} />

        {/* Camera flash bloom */}
        {flashPulse > 0.05 && (
          <g>
            <Glow x={96} y={0} r={110 * flashPulse} kind="cool" o={0.9 * flashPulse} />
            <circle cx={96} cy={0} r={24 + 52 * (1 - flashPulse)} fill="none" stroke="#F6EFE3" strokeWidth={4} opacity={flashPulse} />
          </g>
        )}
      </g>
    </g>
  );
};

export const FullLightVeil: React.FC<{
  id: string;
  lights: [number, number, number][];
  o?: number;
}> = ({ id, lights, o = 0.34 }) => <LightVeil id={id} lights={lights} o={o} />;

export const SceneDust: React.FC<{ t: number; seed: number; W: number; H: number; n?: number; o?: number }> = ({
  t,
  seed,
  W,
  H,
  n = 34,
  o = 0.45,
}) => <Dust t={t} seed={seed} x0={-120} y0={-80} w={W + 240} h={H + 160} n={n} o={o} />;
