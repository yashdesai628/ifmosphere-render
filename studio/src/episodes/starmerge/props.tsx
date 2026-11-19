import React from 'react';
import { PALETTE, FONTS, BrandLabel } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, settle, rnd } from '../../engine/anim';
import { Glow } from '../../engine/light';
import type { PropProps, Registry } from './render';

const OUTLINE = '#16111F';

const PROP_COLORS = {
  gold: { hex: PALETTE.gold, text: PALETTE.gold, glow: 'warm' as const },
  red: { hex: PALETTE.red, text: PALETTE.red, glow: 'red' as const },
  cyan: { hex: PALETTE.cyan, text: PALETTE.cyan, glow: 'cool' as const },
};

const pickColor = (c?: unknown) => PROP_COLORS[(c as keyof typeof PROP_COLORS) ?? 'gold'] ?? PROP_COLORS.gold;
const popScale = (t: number, d = 7) => backOut(clamp(t / d));

// ---------------------------------------------------------------- starbig
const StarBigProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const label = pp.label as string | undefined;
  const pop = popScale(t);
  const pulse = 1 + 0.028 * Math.sin(t * 0.12);
  const r = 74;
  return (
    <g transform={`scale(${s * pop})`}>
      <Glow x={0} y={0} r={145} kind="red" o={0.7} />
      <g transform={`scale(${pulse})`}>
        <defs>
          <radialGradient id={`${id}sg`} cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FF9E44" />
            <stop offset="65%" stopColor="#E04322" />
            <stop offset="100%" stopColor="#9C2014" />
          </radialGradient>
          <clipPath id={`${id}sc`}><circle cx={0} cy={0} r={r} /></clipPath>
        </defs>
        <circle cx={0} cy={0} r={r} fill={`url(#${id}sg)`} />
        <g clipPath={`url(#${id}sc)`}>
          {[0, 1, 2, 3, 4].map((i) => {
            const dx = ((rnd(5, i) * 140 - 70 + t * 0.45) % 150 + 150) % 150 - 75;
            const dy = (rnd(9, i) * 90 - 45) + Math.sin(t * 0.07 + i) * 6;
            return <ellipse key={i} cx={dx} cy={dy} rx={22 + i * 3} ry={12 + i * 2} fill="#8C1D13" opacity={0.45} />;
          })}
        </g>
        <circle cx={0} cy={0} r={r} fill="none" stroke={OUTLINE} strokeWidth={4} />
        <path d="M -54 -36 A 64 64 0 0 1 42 -52" fill="none" stroke="#FFD0A6" strokeWidth={3.5} strokeLinecap="round" opacity={0.72} />
      </g>
      {label ? <BrandLabel x={0} y={108} t={t} text={label} size={22} color={PALETTE.cream} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- starsmall
const StarSmallProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const label = pp.label as string | undefined;
  const pop = popScale(t);
  const pulse = 1 + 0.04 * Math.sin(t * 0.16);
  return (
    <g transform={`scale(${s * pop})`}>
      <Glow x={0} y={0} r={96} kind="warm" o={0.75 + 0.18 * Math.sin(t * 0.14)} />
      <g transform={`scale(${pulse})`}>
        <circle cx={0} cy={0} r={38} fill="#FFE066" stroke={OUTLINE} strokeWidth={4} />
        <circle cx={-10} cy={-12} r={11} fill="#FFFBE2" opacity={0.85} />
        <path d="M 46 -28 L 49 -20 L 57 -17 L 49 -14 L 46 -6 L 43 -14 L 35 -17 L 43 -20 Z" fill="#FFF7CC" opacity={0.5 + 0.5 * Math.sin(t * 0.22)} />
      </g>
      {label ? <BrandLabel x={0} y={68} t={t} text={label} size={22} color={PALETTE.cream} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- counter
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = (pp.from as number | undefined) ?? 0;
  const to = (pp.to as number | undefined) ?? 100;
  const label = (pp.label as string | undefined) ?? '';
  const col = pickColor(pp.color);
  const pop = popScale(t);
  const prog = easeOut(clamp(p / 0.68));
  const val = Math.round(lerp(from, to, prog));
  const str = val.toLocaleString('en-US');
  const w = Math.max(240, str.length * 42 + 68);
  const h = 114;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={140} kind={col.glow} o={0.42} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={4} />
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w - 8} height={h - 8} rx={12} fill="none" stroke={col.hex} strokeWidth={2.5} opacity={0.75} />
      {/* Split-flap hinge bar */}
      <line x1={-w / 2 + 12} y1={0} x2={w / 2 - 12} y2={0} stroke="#0E0C17" strokeWidth={2.5} opacity={0.7} />
      <text y={21} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={58} fill={PALETTE.cream}>
        {str}
      </text>
      {label ? (
        <text y={86} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={col.text} letterSpacing={2.2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- clock
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const fromH = (pp.from as number | undefined) ?? 0;
  const toH = (pp.to as number | undefined) ?? 12;
  const hasGlow = Boolean(pp.glow);
  const pop = popScale(t);
  const hr = lerp(fromH, toH, easeInOut(clamp(p / 0.85)));
  const ang = hr * 30 + Math.sin(t * 0.4) * 1.2;
  const r = 64;

  return (
    <g transform={`scale(${pop})`}>
      {hasGlow ? <Glow x={0} y={0} r={126} kind="warm" o={0.7 + 0.15 * Math.sin(t * 0.12)} /> : null}
      <circle cx={0} cy={0} r={r} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
      <circle cx={0} cy={0} r={r - 10} fill="none" stroke="#D9CEB8" strokeWidth={2.5} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          transform={`rotate(${i * 30})`}
          x1={0} y1={-r + 8} x2={0} y2={-r + (i % 3 === 0 ? 19 : 14)}
          stroke={OUTLINE} strokeWidth={i % 3 === 0 ? 4 : 2.5} strokeLinecap="round"
        />
      ))}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={10} x2={0} y2={-r + 22} stroke={OUTLINE} strokeWidth={5.5} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={0} r={7} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3} />
    </g>
  );
};

// ---------------------------------------------------------------- bar
const BarProp: React.FC<PropProps> = ({ t, p, pp, id }) => {
  const frac = clamp((pp.frac as number | undefined) ?? 0.5);
  const col = pickColor(pp.color);
  const label = (pp.label as string | undefined) ?? '';
  const pop = popScale(t);
  const w = 340;
  const h = 42;
  const fillW = Math.max(12, w * frac * easeOut(clamp(p / 0.72)));

  return (
    <g transform={`scale(${pop})`}>
      {label ? (
        <text y={-36} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <defs>
        <clipPath id={`${id}bar`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} /></clipPath>
      </defs>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={4} />
      <g clipPath={`url(#${id}bar)`}>
        <rect x={-w / 2} y={-h / 2} width={fillW} height={h} fill={col.hex} />
        <rect x={-w / 2} y={-h / 2 + 4} width={fillW} height={10} fill="#FFFFFF" opacity={0.28} />
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="none" stroke={OUTLINE} strokeWidth={4} />
      <Glow x={-w / 2 + fillW} y={0} r={46} kind={col.glow} o={0.65} />
    </g>
  );
};

// ---------------------------------------------------------------- arrow
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = pickColor(pp.color);
  const pop = popScale(t);
  const draw = easeOut(clamp(p / 0.65));
  const len = 245;
  return (
    <g transform={`scale(${pop})`}>
      <Glow x={78} y={-32} r={60} kind={col.glow} o={0.55 * draw} />
      <path
        d="M -95 45 Q -5 -58 84 -30"
        fill="none" stroke={OUTLINE} strokeWidth={18} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - draw)}
      />
      <path
        d="M -95 45 Q -5 -58 84 -30"
        fill="none" stroke={col.hex} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - draw)}
      />
      {draw > 0.75 ? (
        <g transform={`translate(90 -28) rotate(18) scale(${backOut(clamp((draw - 0.75) / 0.25))})`}>
          <polygon points="24,0 -14,-18 -8,0 -14,18" fill={col.hex} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- flag
const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = Boolean(pp.bad);
  const pop = popScale(t);
  const wob = bad ? settle(t - 8, 7) : 0;
  const tw = 0.55 + 0.45 * Math.sin(t * 0.22);
  return (
    <g transform={`rotate(${wob}) scale(${pop})`}>
      <Glow x={0} y={0} r={85} kind={bad ? 'red' : 'cool'} o={0.45} />
      <circle cx={0} cy={0} r={46} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
      {bad ? (
        <path d="M -18 -18 L 18 18 M 18 -18 L -18 18" fill="none" stroke={PALETTE.red} strokeWidth={9} strokeLinecap="round" />
      ) : (
        <g>
          <path d="M -20 2 L -5 18 L 22 -16" fill="none" stroke={PALETTE.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 40 -42 L 43 -34 L 51 -31 L 43 -28 L 40 -20 L 37 -28 L 29 -31 L 37 -34 Z" fill={PALETTE.gold} opacity={tw} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- calendar
const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const txt = String(pp.text ?? '2025').slice(0, 8);
  const pop = popScale(t);
  return (
    <g transform={`rotate(${settle(t - 6, 4)}) scale(${pop})`}>
      <rect x={-68} y={-72} width={136} height={144} rx={12} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
      <path d="M -68 -40 L -68 -60 Q -68 -72 -56 -72 L 56 -72 Q 68 -72 68 -60 L 68 -40 Z" fill="#E64A42" stroke={OUTLINE} strokeWidth={4} />
      {/* Binder rings */}
      <rect x={-38} y={-84} width={12} height={24} rx={6} fill="#CBD4E6" stroke={OUTLINE} strokeWidth={3.5} />
      <rect x={26} y={-84} width={12} height={24} rx={6} fill="#CBD4E6" stroke={OUTLINE} strokeWidth={3.5} />
      <text y={30} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={txt.length > 5 ? 28 : 34} fill={PALETTE.red}>
        {txt}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------- magnifier
const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const hasGlow = Boolean(pp.glow);
  const pop = popScale(t);
  const hover = Math.sin(t * 0.08) * 5;
  return (
    <g transform={`translate(0 ${hover}) scale(${s * pop}) rotate(-18)`}>
      {hasGlow ? <Glow x={0} y={-10} r={105} kind="cool" o={0.7} /> : null}
      {/* Cream handle */}
      <rect x={-10} y={48} width={20} height={68} rx={9} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
      <rect x={-12} y={42} width={24} height={12} rx={4} fill="#9BA6C2" stroke={OUTLINE} strokeWidth={3.5} />
      {/* Lens rim & translucent glass */}
      <circle cx={0} cy={-10} r={54} fill="#8AE6FF" opacity={0.22} />
      <circle cx={0} cy={-10} r={54} fill="none" stroke="#A6B3CF" strokeWidth={11} />
      <circle cx={0} cy={-10} r={59} fill="none" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={0} cy={-10} r={48} fill="none" stroke={OUTLINE} strokeWidth={3.5} />
      <path d="M -28 -34 A 34 34 0 0 1 18 -40" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.75} />
    </g>
  );
};

// ---------------------------------------------------------------- spoon
const SpoonProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const pop = popScale(t);
  const tilt = -28 + Math.sin(t * 0.09) * 4;
  return (
    <g transform={`rotate(${tilt}) scale(${s * pop})`}>
      <rect x={-7} y={-20} width={14} height={95} rx={7} fill="#BAC6DC" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={0} cy={-44} rx={24} ry={34} fill="#DCE5F5" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={-4} cy={-48} rx={11} ry={18} fill="#FFFFFF" opacity={0.55} />
      <line x1={-2} y1={-4} x2={-2} y2={62} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.65} />
    </g>
  );
};

// ---------------------------------------------------------------- ring
const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const cyc1 = (t % 30) / 30;
  const cyc2 = ((t + 15) % 30) / 30;
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={96} kind="cool" o={0.55} />
      {[cyc1, cyc2].map((u, i) => (
        <circle
          key={i} cx={0} cy={0} r={lerp(22, 86, easeOut(u))}
          fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={1 - u}
        />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- scale
const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const label = pp.label as string | undefined;
  const pop = popScale(t);
  const tilt = 13 + Math.sin(t * 0.08) * 2.5;
  const rad = (tilt * Math.PI) / 180;
  const lx = -66 * Math.cos(rad);
  const ly = -32 - 66 * Math.sin(rad);
  const rx = 66 * Math.cos(rad);
  const ry = -32 + 66 * Math.sin(rad);

  return (
    <g transform={`scale(${s * pop})`}>
      {/* Pedestal */}
      <rect x={-36} y={48} width={72} height={16} rx={6} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
      <line x1={0} y1={-38} x2={0} y2={48} stroke={OUTLINE} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={-38} x2={0} y2={48} stroke={PALETTE.cream} strokeWidth={5} strokeLinecap="round" />
      {/* Tipped beam */}
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={PALETTE.cream} strokeWidth={4.5} strokeLinecap="round" />
      <circle cx={0} cy={-32} r={8} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3.5} />
      {/* Left & right pans */}
      {[[lx, ly], [rx, ry]].map(([px, py], i) => (
        <g key={i} transform={`translate(${px} ${py})`}>
          <line x1={0} y1={0} x2={-18} y2={42} stroke={OUTLINE} strokeWidth={3} />
          <line x1={0} y1={0} x2={18} y2={42} stroke={OUTLINE} strokeWidth={3} />
          <path d="M -24 42 Q 0 60 24 42 Z" fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={4} />
        </g>
      ))}
      {label ? <BrandLabel x={0} y={102} t={t} text={label} size={22} color={PALETTE.cream} /> : null}
    </g>
  );
};

export const PROPS: Registry['props'] = {
  starbig: StarBigProp,
  starsmall: StarSmallProp,
  counter: CounterProp,
  clock: ClockProp,
  bar: BarProp,
  arrow: ArrowProp,
  flag: FlagProp,
  calendar: CalendarProp,
  magnifier: MagnifierProp,
  spoon: SpoonProp,
  ring: RingProp,
  scale: ScaleProp,
};
