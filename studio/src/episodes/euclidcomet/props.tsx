import React from 'react';
import type { PropProps, Registry } from './render';
import { BrandLabel, PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut } from '../../engine/anim';
import { Stars } from '../../engine/kit';
import { Glow } from '../../engine/light';
import { DARK_INK, num, str, CometArt, EuclidArt } from './sets-common';

const accentFor = (color: string) =>
  color === 'red' ? PALETTE.red : color === 'cyan' ? PALETTE.cyan : PALETTE.gold;

const glowKindFor = (color: string): 'warm' | 'cool' | 'red' =>
  color === 'red' ? 'red' : color === 'cyan' ? 'cool' : 'warm';

/** 1. comet: Small comet icon with lumpy nucleus, cyan coma, two-colour tail, optional label. */
const CometProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const s = num(pp.s, 1);
  const label = str(pp.label, '');
  const pop = backOut(clamp(t / 9));
  return (
    <g transform={`scale(${s * pop}) translate(0 ${Math.sin(t / 15) * 4})`}>
      <CometArt id={`${id}c`} t={t} glow="cyan" jets={0.45} tailLen={165} scale={0.62} />
      {label ? <BrandLabel x={0} y={84} t={t - 4} text={label} size={24} color={PALETTE.cream} /> : null}
    </g>
  );
};

/** 2. euclid: Small ESA Euclid spacecraft icon. */
const EuclidProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp.s, 1);
  const pop = backOut(clamp(t / 9));
  return (
    <g transform={`scale(${s * pop}) translate(0 ${Math.sin(t / 16) * 5})`}>
      <Glow x={0} y={0} r={105} kind="cool" o={0.38} />
      <EuclidArt t={t} stare={0.25} blink={0} scale={0.78} showBeam={false} />
    </g>
  );
};

/** 3. frame: Small black square image frame with cream 4px border, stars, optional streak/fuzz/label. */
const FrameProp: React.FC<PropProps> = ({ t, pp }) => {
  const streak = Boolean(pp.streak);
  const fuzz = Boolean(pp.fuzz);
  const label = str(pp.label, '');
  const pop = backOut(clamp(t / 9));
  const half = 62;
  return (
    <g transform={`scale(${pop})`}>
      <rect x={-half} y={-half} width={half * 2} height={half * 2} rx={8} fill="#060711" stroke={PALETTE.cream} strokeWidth={4} />
      <Stars seed={607} x0={-half + 8} y0={-half + 8} w={half * 2 - 16} h={half * 2 - 16} t={t} n={14} o={0.85} />
      {streak && !fuzz && (
        <g transform="rotate(-28)">
          <line x1={-22} y1={0} x2={22} y2={0} stroke="#5CE1E6" strokeWidth={7} strokeLinecap="round" opacity={0.55} />
          <line x1={-17} y1={0} x2={17} y2={0} stroke={PALETTE.cream} strokeWidth={3.5} strokeLinecap="round" />
        </g>
      )}
      {fuzz && (
        <g>
          <Glow x={0} y={0} r={34} kind="cool" o={0.85} />
          <circle cx={0} cy={0} r={13 + Math.sin(t / 8) * 1.5} fill="#7CE8FF" opacity={0.42} />
          <circle cx={0} cy={0} r={4.5} fill={PALETTE.cream} />
        </g>
      )}
      {label ? <BrandLabel x={0} y={96} t={t - 4} text={label} size={22} color={PALETTE.cream} /> : null}
    </g>
  );
};

/** 4. counter: Dark #1E1B2E flip counter panel with thousands separators and easeOut count-up. */
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = num(pp.from, 0);
  const to = num(pp.to, 100);
  const label = str(pp.label, '');
  const colorName = str(pp.color, 'gold');
  const accent = accentFor(colorName);
  const pop = backOut(clamp(t / 9));
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.72))));
  const display = val.toLocaleString('en-US');
  const maxLen = Math.max(Math.round(to).toLocaleString('en-US').length, label.length * 0.55);
  const w = Math.max(250, maxLen * 44 + 78);
  const h = 148;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={w * 0.72} kind={glowKindFor(colorName)} o={0.42} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#1E1B2E" stroke={DARK_INK} strokeWidth={4} />
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w - 10} height={h - 10} rx={12} fill="none" stroke={accent} strokeWidth={2.5} opacity={0.75} />
      {/* Flip hinge line */}
      <line x1={-w / 2 + 16} y1={-6} x2={w / 2 - 16} y2={-6} stroke="#0E0C18" strokeWidth={2.5} opacity={0.7} />
      <text y={14} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={64} fill={PALETTE.cream}>
        {display}
      </text>
      {label ? (
        <text y={54} textAnchor="middle" fontFamily={FONTS.ui} fontSize={21} fill={accent} letterSpacing={2.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 5. clock: Cream analogue clock face with 4px dark outline, ticks, and sweeping hand. */
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = num(pp.from, 0);
  const to = num(pp.to, 6);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 9));
  const r = 68;
  const deg = lerp(from, to, easeInOut(p)) * 30;

  return (
    <g transform={`scale(${pop})`}>
      {glow && <Glow x={0} y={0} r={120} kind="warm" o={0.62} />}
      <circle cx={0} cy={0} r={r} fill={PALETTE.cream} stroke={DARK_INK} strokeWidth={4} />
      <circle cx={0} cy={0} r={r - 8} fill="none" stroke="#D5C8B0" strokeWidth={2} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          transform={`rotate(${i * 30})`}
          x1={0}
          y1={-(r - 12)}
          x2={0}
          y2={-(r - 4)}
          stroke={DARK_INK}
          strokeWidth={i % 3 === 0 ? 4 : 2.5}
          strokeLinecap="round"
        />
      ))}
      <line
        transform={`rotate(${deg})`}
        x1={0}
        y1={8}
        x2={0}
        y2={-(r - 18)}
        stroke={DARK_INK}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle cx={0} cy={0} r={6.5} fill={PALETTE.orange} stroke={DARK_INK} strokeWidth={2.5} />
    </g>
  );
};

/** 6. bar: Outlined horizontal progress bar filling smoothly to pp.frac with label above. */
const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const colorName = str(pp.color, 'gold');
  const frac = clamp(num(pp.frac, 0.75));
  const label = str(pp.label, '');
  const accent = accentFor(colorName);
  const pop = backOut(clamp(t / 9));
  const w = 360;
  const h = 36;
  const fillW = Math.max(12, (w - 10) * frac * easeOut(clamp(p / 0.75)));

  return (
    <g transform={`scale(${pop})`}>
      {label ? (
        <text y={-30} textAnchor="middle" fontFamily={FONTS.ui} fontSize={24} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <Glow x={-w / 2 + fillW * 0.6} y={0} r={115} kind={glowKindFor(colorName)} o={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#1E1B2E" stroke={DARK_INK} strokeWidth={4} />
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={fillW} height={h - 10} rx={8} fill={accent} />
      <rect x={-w / 2 + 8} y={-h / 2 + 7} width={Math.max(0, fillW - 6)} height={6} rx={3} fill="#FFFFFF" opacity={0.32} />
    </g>
  );
};

/** 7. arrow: Thick outlined curved arrow that draws on smoothly across the shot. */
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const colorName = str(pp.color, 'cyan');
  const accent = accentFor(colorName);
  const draw = easeOut(clamp(p / 0.65));
  const len = 185;
  const tipScale = backOut(clamp((p - 0.35) / 0.25));
  const sway = Math.sin(t / 15) * 3;

  return (
    <g transform={`translate(0 ${sway})`}>
      <Glow x={10} y={-20} r={115} kind={glowKindFor(colorName)} o={0.42 * draw} />
      <path
        d="M -42 74 Q -14 -8 24 -68"
        fill="none"
        stroke={DARK_INK}
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      <path
        d="M -42 74 Q -14 -8 24 -68"
        fill="none"
        stroke={accent}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      <g transform={`translate(24 -68) rotate(30) scale(${tipScale})`}>
        <polygon points="0,-24 -18,12 18,12" fill={accent} stroke={DARK_INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** 8. flag: Round cream badge with green check + sparkle, or red cross when pp.bad is true. */
const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = Boolean(pp.bad);
  const pop = backOut(clamp(t / 9));
  const col = bad ? PALETTE.red : PALETTE.green;
  const rot = t * 0.7;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={105} kind={bad ? 'red' : 'cool'} o={0.55} />
      <circle cx={0} cy={0} r={54} fill={PALETTE.cream} stroke={DARK_INK} strokeWidth={4} />
      {bad ? (
        <path d="M -20 -20 L 20 20 M 20 -20 L -20 20" fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" />
      ) : (
        <path d="M -22 2 L -6 18 L 24 -18" fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      )}
      <g transform={`translate(46 -44) rotate(${rot})`}>
        <path d="M 0 -14 L 3.5 -3.5 L 14 0 L 3.5 3.5 L 0 14 L -3.5 3.5 L -14 0 L -3.5 -3.5 Z" fill={PALETTE.gold} stroke={DARK_INK} strokeWidth={2} />
      </g>
    </g>
  );
};

/** 9. calendar: Cream wall calendar page with red top strip, 4px outline, and FONTS.title date. */
const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = str(pp.text, '8 OCT').slice(0, 8);
  const pop = backOut(clamp(t / 9));
  const sway = Math.sin(t / 18) * 1.8;

  return (
    <g transform={`rotate(${sway}) scale(${pop})`}>
      <Glow x={0} y={0} r={120} kind="warm" o={0.28} />
      <rect x={-76} y={-78} width={152} height={156} rx={14} fill={PALETTE.cream} stroke={DARK_INK} strokeWidth={4} />
      <path d="M -76 -40 L -76 -64 A 14 14 0 0 1 -62 -78 L 62 -78 A 14 14 0 0 1 76 -64 L 76 -40 Z" fill="#E5484D" stroke={DARK_INK} strokeWidth={4} />
      {[-38, 38].map((rx, i) => (
        <rect key={i} x={rx - 7} y={-90} width={14} height={24} rx={5} fill={PALETTE.cream} stroke={DARK_INK} strokeWidth={3.5} />
      ))}
      <text
        y={32}
        textAnchor="middle"
        fontFamily={FONTS.title}
        fontWeight={800}
        fontSize={text.length > 5 ? 36 : 44}
        fill={PALETTE.pill}
      >
        {text}
      </text>
    </g>
  );
};

/** 10. magnifier: Outlined magnifying glass with cream handle, pale glass, optional cyan bloom. */
const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp.s, 1);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 9));
  const sweepX = Math.sin(t / 15) * 9;
  const sweepY = Math.cos(t / 19) * 7;

  return (
    <g transform={`translate(${sweepX} ${sweepY}) scale(${s * pop})`}>
      {glow && <Glow x={0} y={0} r={115} kind="cool" o={0.62} />}
      <line x1={34} y1={34} x2={82} y2={82} stroke={DARK_INK} strokeWidth={18} strokeLinecap="round" />
      <line x1={34} y1={34} x2={82} y2={82} stroke={PALETTE.cream} strokeWidth={10} strokeLinecap="round" />
      <circle cx={0} cy={0} r={52} fill="#8AE8FF" opacity={0.26} stroke={DARK_INK} strokeWidth={4} />
      <circle cx={0} cy={0} r={52} fill="none" stroke="#CBD5E1" strokeWidth={7} />
      <circle cx={0} cy={0} r={56} fill="none" stroke={DARK_INK} strokeWidth={4} />
      <path d="M -28 -22 A 34 34 0 0 1 12 -32" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.65} />
    </g>
  );
};

/** 11. snowball: White-blue snowball with 4px outline, sparkles, and optional dark dust specks. */
const SnowballProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp.s, 1);
  const dirty = Boolean(pp.dirty);
  const pop = backOut(clamp(t / 9));
  const hover = Math.sin(t / 14) * 5;
  const specks: [number, number, number][] = [
    [-26, -12, 5.5],
    [14, -24, 4.5],
    [24, 14, 6.5],
    [-12, 26, 5],
    [4, 4, 4],
    [-34, 12, 3.8],
  ];

  return (
    <g transform={`translate(0 ${hover}) scale(${s * pop})`}>
      <Glow x={0} y={0} r={110} kind="cool" o={0.48} />
      <path
        d="M -52 -6 C -54 -36, -24 -56, 6 -52 C 36 -50, 56 -24, 52 8 C 48 38, 22 56, -10 52 C -38 50, -56 24, -52 -6 Z"
        fill="#DCEFFF"
        stroke={DARK_INK}
        strokeWidth={4}
      />
      <path
        d="M 10 -50 C 34 -44, 52 -20, 48 10 C 44 36, 18 52, -6 48 C 18 32, 26 -14, 10 -50 Z"
        fill="#96BEE2"
        opacity={0.7}
      />
      <path d="M -36 -18 A 28 28 0 0 1 6 -36" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />

      {dirty &&
        specks.map(([sx, sy, sr], i) => (
          <circle key={i} cx={sx} cy={sy} r={sr} fill="#463E42" stroke={DARK_INK} strokeWidth={2} />
        ))}

      {[
        [-62, -44],
        [58, -36],
        [54, 44],
      ].map(([kx, ky], i) => (
        <g key={i} transform={`translate(${kx} ${ky}) scale(${0.6 + 0.35 * Math.sin(t / 8 + i * 2)})`}>
          <path d="M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z" fill="#EAF8FF" />
        </g>
      ))}
    </g>
  );
};

/** 12. ring: Pulsing cyan circle outline with soft bloom expanding and fading each second. */
const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp.s, 1);
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={96} kind="cool" o={0.45} />
      <circle cx={0} cy={0} r={44} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={0.88} />
      {[0, 0.5].map((off, i) => {
        const ph = (t / 30 + off) % 1;
        const r = lerp(36, 98, easeOut(ph));
        const op = (1 - easeOut(ph)) * 0.9;
        return <circle key={i} cx={0} cy={0} r={r} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={op} />;
      })}
    </g>
  );
};

export const PROPS: Registry['props'] = {
  comet: CometProp,
  euclid: EuclidProp,
  frame: FrameProp,
  counter: CounterProp,
  clock: ClockProp,
  bar: BarProp,
  arrow: ArrowProp,
  flag: FlagProp,
  calendar: CalendarProp,
  magnifier: MagnifierProp,
  snowball: SnowballProp,
  ring: RingProp,
};
