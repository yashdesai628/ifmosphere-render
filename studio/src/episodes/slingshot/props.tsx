import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import { Glow } from '../../engine/light';
import type { PropProps, Registry } from './render';

const OUT = '#121019';

const pickColor = (name?: unknown) => {
  const s = String(name ?? 'gold');
  if (s === 'red') return PALETTE.red;
  if (s === 'cyan') return PALETTE.cyan;
  return PALETTE.gold;
};

const pickGlowKind = (name?: unknown): 'warm' | 'cool' | 'red' => {
  const s = String(name ?? 'gold');
  if (s === 'red') return 'red';
  if (s === 'cyan') return 'cool';
  return 'warm';
};

/** 1. COUNTER: Big dark flip-digit counter panel with thousands separators and easeOut count-up. */
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 100);
  const label = String(pp.label ?? '');
  const col = pickColor(pp.color);
  const pop = backOut(clamp(t / 8));
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.85))));
  const formatted = val.toLocaleString('en-US');
  const maxStr = Math.max(Math.abs(from), Math.abs(to)).toLocaleString('en-US');
  const w = Math.max(250, maxStr.length * 42 + 76);

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={w * 0.7} kind={pickGlowKind(pp.color)} o={0.32} />
      <rect x={-w / 2} y={-68} width={w} height={136} rx={18} fill={PALETTE.pill} stroke={OUT} strokeWidth={4} />
      <rect x={-w / 2 + 8} y={-60} width={w - 16} height={120} rx={12} fill="none" stroke={col} strokeWidth={2.5} opacity={0.75} />
      {/* Flip-digit split seam */}
      <line x1={-w / 2 + 16} y1={-6} x2={w / 2 - 16} y2={-6} stroke={OUT} strokeWidth={2.5} opacity={0.85} />
      <text y={14} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={58} fill={PALETTE.cream} letterSpacing={2}>
        {formatted}
      </text>
      {label ? (
        <text y={48} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={col} letterSpacing={2.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 2. CLOCK: Round analogue clock face, cream disc, 4px outline, ticks, sweeping hand. */
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 12);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 8));
  const mins = lerp(from, to, easeInOut(clamp(p / 0.88)));
  const ang = (mins / 60) * 360;
  const r = 74;

  return (
    <g transform={`scale(${pop})`}>
      {glow ? <Glow x={0} y={0} r={145} kind="warm" o={0.55} /> : <Glow x={0} y={0} r={110} kind="cool" o={0.22} />}
      <circle r={r} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      <circle r={r - 7} fill="none" stroke="#D8CEBC" strokeWidth={2} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          transform={`rotate(${i * 30})`}
          x1={0}
          y1={-(r - 8)}
          x2={0}
          y2={-(r - (i % 3 === 0 ? 18 : 13))}
          stroke={OUT}
          strokeWidth={i % 3 === 0 ? 4 : 2.5}
          strokeLinecap="round"
        />
      ))}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={10} x2={0} y2={-(r - 22)} stroke={PALETTE.orange} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle r={7} fill={OUT} />
    </g>
  );
};

/** 3. CALENDAR: Wall calendar card, cream page, big text in FONTS.title, page flip at p=0.3. */
const CalendarProp: React.FC<PropProps> = ({ t, len, p, pp }) => {
  const yr = String(pp.year ?? '2026');
  const flip = Boolean(pp.flip);
  const pop = backOut(clamp(t / 8));
  const flipP = flip ? clamp((p - 0.3) / 0.25) : 0;
  const flipFold = flip && p >= 0.3 && p < 0.55 ? Math.cos(flipP * Math.PI) : 1;
  const landWobble = flip ? settle(t - 0.55 * len, 4) : 0;
  const fontSize = yr.length > 7 ? 32 : yr.length > 5 ? 40 : 50;
  const w = 228;
  const h = 186;

  return (
    <g transform={`scale(${pop}) rotate(${landWobble})`}>
      <Glow x={0} y={0} r={160} kind="cool" o={0.2} />
      {/* Stacked page backing */}
      <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} rx={14} fill="#CFC5B4" stroke={OUT} strokeWidth={4} />
      {/* Main cream card */}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      {/* Top header strip */}
      <path
        d={`M ${-w / 2} ${-h / 2 + 44} L ${-w / 2} ${-h / 2 + 14} Q ${-w / 2} ${-h / 2} ${-w / 2 + 14} ${-h / 2} L ${w / 2 - 14} ${-h / 2} Q ${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 14} L ${w / 2} ${-h / 2 + 44} Z`}
        fill={PALETTE.red}
        stroke={OUT}
        strokeWidth={4}
      />
      {/* Binding rings */}
      {[-58, 58].map((rx, i) => (
        <rect key={i} x={rx - 7} y={-h / 2 - 12} width={14} height={26} rx={6} fill="#363B54" stroke={OUT} strokeWidth={3.5} />
      ))}
      {/* Flipping page sheet */}
      <g transform={`translate(0 ${-h / 2 + 44}) scale(1 ${Math.abs(flipFold)}) translate(0 ${h / 2 - 44})`}>
        <text y={28} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={fontSize} fill={PALETTE.pill}>
          {yr}
        </text>
      </g>
    </g>
  );
};

/** 4. PROBE: Twin boxy ESCAPADE spacecraft side by side, gold solar wings, optional orange engine glow. */
const ProbeProp: React.FC<PropProps> = ({ t, pp }) => {
  const glow = Boolean(pp.glow);
  const sc = Number(pp.s ?? 1);
  const pop = backOut(clamp(t / 7));
  const hover = Math.sin(t * 0.12) * 5;
  const pulse = 0.88 + 0.15 * Math.sin(t * 0.8);

  return (
    <g transform={`translate(0 ${hover}) scale(${pop * sc})`}>
      {[-34, 34].map((dy, i) => {
        const dx = i === 0 ? 12 : -12;
        const bodyCol = i === 0 ? PALETTE.cyan : PALETTE.cream;
        return (
          <g key={i} transform={`translate(${dx} ${dy})`}>
            {glow ? (
              <g>
                <Glow x={-38} y={0} r={75 * pulse} kind="warm" o={0.72} />
                <path d={`M -22 -10 Q ${-68 * pulse} 0 -22 10 Z`} fill="#FF6E3D" stroke="#FFE5B4" strokeWidth={2} />
                <path d={`M -20 -5 Q ${-42 * pulse} 0 -20 5 Z`} fill="#FFF6D1" />
              </g>
            ) : (
              <Glow x={0} y={0} r={54} kind="cool" o={0.28} />
            )}
            {/* Gold solar panel wings */}
            <rect x={-12} y={-36} width={22} height={72} rx={4} fill={PALETTE.gold} stroke={OUT} strokeWidth={3.5} />
            <line x1={-1} y1={-34} x2={-1} y2={34} stroke={OUT} strokeWidth={2} opacity={0.45} />
            {/* Boxy craft body */}
            <rect x={-22} y={-14} width={44} height={28} rx={5} fill={bodyCol} stroke={OUT} strokeWidth={4} />
            {/* Dish antenna */}
            <line x1={22} y1={0} x2={34} y2={0} stroke={OUT} strokeWidth={3.5} />
            <path d="M 32 -10 Q 42 0 32 10" fill="none" stroke={PALETTE.cream} strokeWidth={3.5} />
            <circle cx={-6} cy={0} r={3.5} fill={OUT} />
          </g>
        );
      })}
    </g>
  );
};

/** 5. EARTH: Small Earth disc, blue-green with outlined continents, pale rim, atmosphere glow. */
const EarthProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const tilt = Number(pp.tilt ?? 0);
  const pop = backOut(clamp(t / 8));
  const r = 70;
  const drift = Math.sin(t * 0.05) * 8;

  return (
    <g transform={`scale(${pop}) rotate(${tilt})`}>
      <defs>
        <clipPath id={`${id}ec`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <Glow x={0} y={0} r={130} kind="cool" o={0.45} />
      <circle r={r + 8} fill="#4CE8FF" opacity={0.18} />
      <circle r={r} fill="#1B5EA6" stroke={OUT} strokeWidth={4} />
      <g clipPath={`url(#${id}ec)`}>
        <g transform={`translate(${drift} 0)`}>
          <path d="M -42 -26 Q -10 -44 12 -14 Q 6 22 -24 28 Q -50 12 -42 -26 Z" fill="#2FA677" stroke={OUT} strokeWidth={3.5} />
          <path d="M 18 6 Q 46 -10 56 20 Q 42 48 16 38 Z" fill="#2FA677" stroke={OUT} strokeWidth={3.5} />
        </g>
      </g>
      <path d={`M ${-r * 0.78} ${-r * 0.56} A ${r} ${r} 0 0 1 ${r * 0.56} ${-r * 0.78}`} fill="none" stroke="#D5DCF0" strokeWidth={3.5} opacity={0.85} />
    </g>
  );
};

/** 6. MARSDISC: Small Mars disc, red-orange with dark outlined patches, pale rim and bloom. */
const MarsDiscProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const sc = Number(pp.s ?? 1);
  const pop = backOut(clamp(t / 8));
  const r = 64;
  const drift = Math.sin(t * 0.04) * 5;

  return (
    <g transform={`scale(${pop * sc})`}>
      <defs>
        <clipPath id={`${id}mc`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <Glow x={0} y={0} r={120} kind="warm" o={0.48} />
      <circle r={r} fill="#D45230" stroke={OUT} strokeWidth={4} />
      <g clipPath={`url(#${id}mc)`}>
        <g transform={`translate(${drift} 0)`}>
          <path d="M -38 -18 Q -8 -36 18 -10 Q 8 24 -26 16 Z" fill="#8C2C19" stroke={OUT} strokeWidth={3.5} />
          <circle cx={26} cy={24} r={14} fill="#96321D" stroke={OUT} strokeWidth={3} />
          <ellipse cx={-4} cy={-55} rx={22} ry={8} fill={PALETTE.cream} stroke={OUT} strokeWidth={3} />
        </g>
      </g>
      <path d={`M ${-r * 0.78} ${-r * 0.54} A ${r} ${r} 0 0 1 ${r * 0.54} ${-r * 0.78}`} fill="none" stroke="#FFD2B8" strokeWidth={3.5} opacity={0.85} />
    </g>
  );
};

/** 7. BAR: Horizontal progress bar, 4px outline, colored fill animating to pp.frac, label above. */
const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(Number(pp.frac ?? 0.7));
  const label = String(pp.label ?? '');
  const col = pickColor(pp.color);
  const pop = backOut(clamp(t / 8));
  const w = 320;
  const h = 36;
  const fillW = Math.max(0, (w - 12) * frac * easeOut(clamp(p / 0.8)));

  return (
    <g transform={`scale(${pop})`}>
      {label ? (
        <text y={-30} textAnchor="middle" fontFamily={FONTS.ui} fontSize={24} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={PALETTE.pill} stroke={OUT} strokeWidth={4} />
      {fillW > 2 ? (
        <g>
          <Glow x={-w / 2 + fillW} y={0} r={48} kind={pickGlowKind(pp.color)} o={0.4} />
          <rect x={-w / 2 + 6} y={-h / 2 + 6} width={fillW} height={h - 12} rx={8} fill={col} />
        </g>
      ) : null}
    </g>
  );
};

/** 8. STOPWATCH: Cream dial, red top plunger, sweeping minute hand & counting readout. */
const StopwatchProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 9);
  const pop = backOut(clamp(t / 8));
  const val = lerp(from, to, easeInOut(clamp(p / 0.88)));
  const ang = (val / 60) * 360;
  const press = p < 0.15 ? 5 * Math.sin((p / 0.15) * Math.PI) : 0;
  const r = 74;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={130} kind="warm" o={0.34} />
      {/* Plunger neck & red top button */}
      <rect x={-10} y={-r - 16} width={20} height={18} fill="#50587A" stroke={OUT} strokeWidth={3.5} />
      <rect x={-18} y={-r - 28 + press} width={36} height={14} rx={5} fill={PALETTE.red} stroke={OUT} strokeWidth={3.5} />
      {/* Dial */}
      <circle r={r} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          transform={`rotate(${i * 30})`}
          x1={0}
          y1={-(r - 8)}
          x2={0}
          y2={-(r - 16)}
          stroke={OUT}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={8} x2={0} y2={-(r - 18)} stroke={PALETTE.orange} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle r={6} fill={OUT} />
      <rect x={-36} y={18} width={72} height={26} rx={6} fill={PALETTE.pill} stroke={OUT} strokeWidth={2.5} />
      <text y={38} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.gold}>
        {`${Math.round(val)}m`}
      </text>
    </g>
  );
};

/** 9. ARROW: Thick outlined curved arrow that draws on across the shot. */
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = pickColor(pp.color);
  const draw = easeOut(clamp(p / 0.72));
  const headPop = backOut(clamp((p - 0.55) / 0.25));
  const pop = backOut(clamp(t / 7));
  const len = 310;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={40} y={-20} r={120} kind={pickGlowKind(pp.color)} o={0.35 * draw} />
      <path
        d="M -115 62 Q -10 -78 115 -42"
        fill="none"
        stroke={OUT}
        strokeWidth={22}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      <path
        d="M -115 62 Q -10 -78 115 -42"
        fill="none"
        stroke={col}
        strokeWidth={13}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      <g transform={`translate(115 -42) rotate(16) scale(${headPop})`}>
        <polygon points="-14,-24 28,0 -14,24 -4,0" fill={col} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** 10. THERMOS: Mustard thermos flask with dark cap and animated steam curl. */
const ThermosProp: React.FC<PropProps> = ({ t }) => {
  const pop = backOut(clamp(t / 8));
  const wisp = Math.sin(t * 0.14) * 6;
  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={-78} r={68} kind="warm" o={0.35} />
      <rect x={-26} y={-48} width={52} height={106} rx={12} fill={PALETTE.gold} stroke={OUT} strokeWidth={4} />
      <rect x={-26} y={-12} width={52} height={18} fill="#D8E0F0" stroke={OUT} strokeWidth={3.5} />
      <rect x={-22} y={-72} width={44} height={26} rx={6} fill="#2E2B3D" stroke={OUT} strokeWidth={4} />
      {/* Animated steam curls */}
      <path d={`M -6 -84 Q ${-14 + wisp} -106 -4 -126`} fill="none" stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" opacity={0.65} />
      <path d={`M 8 -82 Q ${16 - wisp} -102 6 -120`} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} strokeLinecap="round" opacity={0.5} />
    </g>
  );
};

/** 11. SIGN: Hand-painted cream board on a post, dark outline, pp.text in FONTS.hand (max 12 chars). */
const SignProp: React.FC<PropProps> = ({ t, pp }) => {
  const txt = String(pp.text ?? 'MARS NEXT').slice(0, 12);
  const pop = backOut(clamp(t / 8));
  const sway = Math.sin(t * 0.08) * 1.5;

  return (
    <g transform={`scale(${pop}) rotate(${sway})`}>
      <rect x={-8} y={-20} width={16} height={135} rx={4} fill="#5C4033" stroke={OUT} strokeWidth={4} />
      <g transform="rotate(-2)">
        <rect x={-128} y={-88} width={256} height={82} rx={10} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
        <circle cx={-106} cy={-47} r={4} fill={OUT} />
        <circle cx={106} cy={-47} r={4} fill={OUT} />
        <text y={-34} textAnchor="middle" fontFamily={FONTS.hand} fontWeight={700} fontSize={36} fill={PALETTE.pill}>
          {txt}
        </text>
      </g>
    </g>
  );
};

export const PROPS: Registry['props'] = {
  counter: CounterProp,
  clock: ClockProp,
  calendar: CalendarProp,
  probe: ProbeProp,
  earth: EarthProp,
  marsdisc: MarsDiscProp,
  bar: BarProp,
  stopwatch: StopwatchProp,
  arrow: ArrowProp,
  thermos: ThermosProp,
  sign: SignProp,
};
