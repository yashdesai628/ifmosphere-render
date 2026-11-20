import React from 'react';
import { FONTS, PALETTE } from '../../brand';
import { backOut, clamp, easeInOut, easeOut, lerp, settle } from '../../engine/anim';
import { Glow } from '../../engine/light';
import type { PropProps, Registry } from './render';
import { DARK_LINE, bool, num, str } from './sets-shared';

const accentFor = (k: string) => {
  if (k === 'red') return { fill: PALETTE.red, text: PALETTE.red, glow: 'red' as const };
  if (k === 'cyan') return { fill: PALETTE.cyan, text: PALETTE.cyan, glow: 'cool' as const };
  return { fill: PALETTE.gold, text: PALETTE.gold, glow: 'warm' as const };
};

const popScale = (t: number, pp: Record<string, unknown>) => backOut(clamp(t / 7)) * num(pp, 's', 1);

/** 1. starbig: Giant red-orange star disc with darker blotches, soft glow, 4 px outline & label. */
const StarBigProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const label = str(pp, 'label', '');
  const pulse = 1 + 0.03 * Math.sin(t / 12);
  return (
    <g transform={`scale(${s * pulse})`}>
      <Glow x={0} y={0} r={145} kind="red" o={0.62} />
      <circle cx={0} cy={0} r={68} fill="#E85A34" stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={-22} cy={-18} r={18} fill="#B8361E" opacity={0.75} />
      <circle cx={24} cy={14} r={14} fill="#C74224" opacity={0.7} />
      <circle cx={-8} cy={28} r={11} fill="#B8361E" opacity={0.65} />
      <path d="M -50 -28 A 58 58 0 0 1 20 -55" fill="none" stroke="#FFC299" strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      {label ? (
        <text y={96} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 2. starsmall: Small bright yellow star disc with soft glow, 4 px outline & label. */
const StarSmallProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const label = str(pp, 'label', '');
  const pulse = 1 + 0.04 * Math.sin(t / 9);
  return (
    <g transform={`scale(${s * pulse})`}>
      <Glow x={0} y={0} r={90} kind="warm" o={0.65} />
      <circle cx={0} cy={0} r={36} fill="#FFD859" stroke={DARK_LINE} strokeWidth={4} />
      <path d="M -22 -16 A 28 28 0 0 1 12 -26" fill="none" stroke="#FFF8D6" strokeWidth={3.5} strokeLinecap="round" opacity={0.85} />
      {label ? (
        <text y={64} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 3. counter: Flat flip-digit panel counting from->to with easeOut and thousands separators. */
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const from = num(pp, 'from', 0);
  const to = num(pp, 'to', 100);
  const label = str(pp, 'label', '');
  const acc = accentFor(str(pp, 'color', 'gold'));
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.85))));
  const formatted = val.toLocaleString('en-US');
  const w = Math.max(250, formatted.length * 36 + 76);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={160} kind={acc.glow} o={0.28} />
      <rect x={-w / 2} y={-58} width={w} height={116} rx={18} fill="#1E1B2E" stroke={DARK_LINE} strokeWidth={8} />
      <rect x={-w / 2} y={-58} width={w} height={116} rx={18} fill="none" stroke={acc.fill} strokeWidth={3.5} />
      <line x1={-w / 2 + 12} y1={0} x2={w / 2 - 12} y2={0} stroke="#0F0D1A" strokeWidth={2.5} opacity={0.7} />
      <text y={18} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={54} fill={PALETTE.cream}>
        {formatted}
      </text>
      {label ? (
        <text y={86} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={acc.text} letterSpacing={2.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 4. clock: Round analogue cream clock face with sweeping hour hand & optional gold glow. */
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const from = num(pp, 'from', 0);
  const to = num(pp, 'to', 10);
  const glow = bool(pp, 'glow', false);
  const hrs = lerp(from, to, easeInOut(clamp(p / 0.85)));
  const ang = (hrs / 12) * 360 - 90;

  return (
    <g transform={`scale(${s})`}>
      {glow ? <Glow x={0} y={0} r={130} kind="warm" o={0.55} /> : null}
      <circle cx={0} cy={0} r={70} fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={4.5} />
      <circle cx={0} cy={0} r={58} fill="none" stroke="#D5CBB8" strokeWidth={2} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 50}
            y1={Math.sin(a) * 50}
            x2={Math.cos(a) * 60}
            y2={Math.sin(a) * 60}
            stroke={DARK_LINE}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
          />
        );
      })}
      <g transform={`rotate(${ang})`}>
        <line x1={-6} y1={0} x2={42} y2={0} stroke={DARK_LINE} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={0} r={7} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={3} />
    </g>
  );
};

/** 5. bar: Horizontal outlined progress bar filling over the shot with label above. */
const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const frac = clamp(num(pp, 'frac', 1), 0, 1);
  const label = str(pp, 'label', '');
  const acc = accentFor(str(pp, 'color', 'gold'));
  const fillW = 320 * frac * easeOut(clamp(p / 0.85));

  return (
    <g transform={`scale(${s})`}>
      {label ? (
        <text y={-28} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream} letterSpacing={2.5}>
          {label}
        </text>
      ) : null}
      <rect x={-166} y={-16} width={332} height={32} rx={16} fill="#181529" stroke={DARK_LINE} strokeWidth={4} />
      {fillW > 2 ? <rect x={-160} y={-10} width={Math.max(12, fillW)} height={20} rx={10} fill={acc.fill} /> : null}
      {fillW > 18 ? <rect x={-154} y={-7} width={Math.max(8, fillW - 12)} height={5} rx={2.5} fill="#FFFFFF" opacity={0.4} /> : null}
    </g>
  );
};

/** 6. arrow: Thick outlined curved arrow drawing smoothly across the shot. */
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const acc = accentFor(str(pp, 'color', 'gold'));
  const draw = easeOut(clamp(p / 0.7));
  const d = 'M -110 30 Q 0 -65 105 -8';

  return (
    <g transform={`scale(${s})`}>
      <path d={d} fill="none" stroke={DARK_LINE} strokeWidth={15} strokeLinecap="round" strokeDasharray="340" strokeDashoffset={340 * (1 - draw)} />
      <path d={d} fill="none" stroke={acc.fill} strokeWidth={8} strokeLinecap="round" strokeDasharray="340" strokeDashoffset={340 * (1 - draw)} />
      <g transform="translate(108 -6) rotate(28)" opacity={draw > 0.55 ? 1 : 0}>
        <polygon points="16,0 -16,-15 -10,0 -16,15" fill={acc.fill} stroke={DARK_LINE} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** 7. flag: Round outlined cream badge with green checkmark + sparkle (or red cross when pp.bad). */
const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const bad = bool(pp, 'bad', false);
  const spin = t * 2.5;
  return (
    <g transform={`scale(${s})`}>
      <circle cx={0} cy={0} r={34} fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={4} />
      {bad ? (
        <path d="M -13 -13 L 13 13 M 13 -13 L -13 13" fill="none" stroke={PALETTE.red} strokeWidth={7} strokeLinecap="round" />
      ) : (
        <g>
          <polyline points="-14,1 -3,12 16,-11" fill="none" stroke={PALETTE.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          <g transform={`translate(28 -26) rotate(${spin})`}>
            <path d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z" fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={2} />
          </g>
        </g>
      )}
    </g>
  );
};

/** 8. calendar: Small wall calendar page with red top strip and date text in FONTS.title. */
const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const text = str(pp, 'text', '7 DEC').slice(0, 8);
  const sway = settle(t - 4, 4, 1.1, 14);

  return (
    <g transform={`scale(${s}) rotate(${sway})`}>
      <rect x={-58} y={-64} width={116} height={128} rx={12} fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={4} />
      <path d="M -58 -28 L 58 -28 L 58 -52 Q 58 -64 46 -64 L -46 -64 Q -58 -64 -58 -52 Z" fill={PALETTE.red} stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={-26} cy={-46} r={5} fill="#1E1B2E" />
      <circle cx={26} cy={-46} r={5} fill="#1E1B2E" />
      <text y={26} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={32} fill={PALETTE.red}>
        {text}
      </text>
    </g>
  );
};

/** 9. magnifier: Outlined magnifying glass with cream handle, pale lens and optional cyan bloom. */
const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const glow = bool(pp, 'glow', false);
  const bob = Math.sin(t / 16) * 4;

  return (
    <g transform={`translate(0 ${bob}) scale(${s}) rotate(-32)`}>
      {glow ? <Glow x={0} y={-22} r={85} kind="cool" o={0.62} /> : null}
      <rect x={-8} y={24} width={16} height={66} rx={8} fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={0} cy={-22} r={42} fill="#CBEBFF" fillOpacity={0.34} stroke={DARK_LINE} strokeWidth={9} />
      <circle cx={0} cy={-22} r={42} fill="none" stroke="#9DB2DE" strokeWidth={4} />
      <path d="M -22 -42 A 28 28 0 0 1 8 -48" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
    </g>
  );
};

/** 10. spoon: Tilted silver spoon with 4 px dark outline. */
const SpoonProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const sway = Math.sin(t / 18) * 4;

  return (
    <g transform={`scale(${s}) rotate(${-28 + sway})`}>
      <rect x={-6} y={4} width={12} height={82} rx={6} fill="#CBD6ED" stroke={DARK_LINE} strokeWidth={4} />
      <ellipse cx={0} cy={-24} rx={24} ry={34} fill="#E2EAF8" stroke={DARK_LINE} strokeWidth={4} />
      <ellipse cx={5} cy={-24} rx={12} ry={21} fill="#A3B4D9" opacity={0.65} />
      <path d="M -12 -40 A 16 24 0 0 1 -4 -50" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** 11. ring: Pulsing cyan outline expanding and fading every second. */
const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp, 's', 1);
  const phase = (t % 24) / 24;
  const phase2 = ((t + 12) % 24) / 24;

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={90} kind="cool" o={0.35 * (1 - phase)} />
      <circle cx={0} cy={0} r={lerp(24, 82, easeOut(phase))} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={1 - phase} />
      <circle cx={0} cy={0} r={lerp(24, 82, easeOut(phase2))} fill="none" stroke={PALETTE.cyan} strokeWidth={3} opacity={0.6 * (1 - phase2)} />
    </g>
  );
};

/** 12. scale: Small balance scale icon with cream pans, one side tipped low, and optional label. */
const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const label = str(pp, 'label', '');
  const tilt = -14 + settle(t - 4, 5, 1.3, 12);

  return (
    <g transform={`scale(${s})`}>
      <path d="M -36 52 L 36 52 L 10 34 L -10 34 Z" fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={4} />
      <line x1={0} y1={34} x2={0} y2={-38} stroke={DARK_LINE} strokeWidth={8} />
      <line x1={0} y1={34} x2={0} y2={-38} stroke={PALETTE.cream} strokeWidth={3.5} />
      <g transform={`translate(0 -34) rotate(${tilt})`}>
        <line x1={-56} y1={0} x2={56} y2={0} stroke={DARK_LINE} strokeWidth={7} strokeLinecap="round" />
        <line x1={-56} y1={0} x2={56} y2={0} stroke={PALETTE.cream} strokeWidth={3} strokeLinecap="round" />
        <g transform={`translate(-52 0) rotate(${-tilt})`}>
          <line x1={0} y1={0} x2={0} y2={32} stroke={PALETTE.cream} strokeWidth={2.5} />
          <path d="M -22 32 Q 0 48 22 32 Z" fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={3.5} />
        </g>
        <g transform={`translate(52 0) rotate(${-tilt})`}>
          <line x1={0} y1={0} x2={0} y2={32} stroke={PALETTE.cream} strokeWidth={2.5} />
          <path d="M -22 32 Q 0 48 22 32 Z" fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={3.5} />
        </g>
      </g>
      <circle cx={0} cy={-34} r={7} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={3} />
      {label ? (
        <text y={82} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 13. camera: Chunky outlined black digital camera held at Pip's hand origin (0,0). */
const CameraProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const recOn = Math.sin(t / 6) > 0;
  return (
    <g transform={`translate(0 -14) scale(${s})`}>
      <rect x={-34} y={-24} width={68} height={46} rx={9} fill="#232036" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-16} y={-33} width={28} height={11} rx={4} fill="#312D4A" stroke={DARK_LINE} strokeWidth={3.5} />
      <rect x={16} y={-30} width={12} height={7} rx={3} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={2.5} />
      <circle cx={0} cy={-1} r={17} fill="#464E75" stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={0} cy={-1} r={10} fill="#14182E" stroke={PALETTE.cyan} strokeWidth={2.5} />
      <circle cx={-3} cy={-4} r={3} fill="#FFFFFF" opacity={0.85} />
      <circle cx={23} cy={-14} r={3} fill={recOn ? PALETTE.red : '#52222A'} />
    </g>
  );
};

/** 14. shades: Translucent dark rounded sunglasses in PipLocal space over eyes (head center 0,-176, r 62). */
const ShadesProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  return (
    <g transform={`translate(0 -182) scale(${s})`}>
      <line x1={-46} y1={-4} x2={-34} y2={-4} stroke={DARK_LINE} strokeWidth={4.5} strokeLinecap="round" />
      <line x1={34} y1={-4} x2={46} y2={-4} stroke={DARK_LINE} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M -6 -5 Q 0 -9 6 -5" fill="none" stroke={DARK_LINE} strokeWidth={4.5} strokeLinecap="round" />
      <rect x={-35} y={-11} width={29} height={20} rx={7} fill="#141222" fillOpacity={0.6} stroke={DARK_LINE} strokeWidth={4} />
      <rect x={6} y={-11} width={29} height={20} rx={7} fill="#141222" fillOpacity={0.6} stroke={DARK_LINE} strokeWidth={4} />
      <line x1={-28} y1={-6} x2={-20} y2={2} stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      <line x1={13} y1={-6} x2={21} y2={2} stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
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
  camera: CameraProp,
  shades: ShadesProp,
};
