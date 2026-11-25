import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { Glow } from '../../engine/light';
import { clamp, lerp, easeInOut, easeOut, backOut } from '../../engine/anim';
import type { PropProps } from './render';

const DARK_OUTLINE = '#121019';

export const propColor = (c: unknown, fallback = PALETTE.gold): string => {
  if (c === 'red') return PALETTE.red;
  if (c === 'cyan') return PALETTE.cyan;
  if (c === 'gold') return PALETTE.gold;
  if (c === 'white') return PALETTE.cream;
  return fallback;
};

export const propNum = (pp: Record<string, unknown>, k: string, def = 0): number => {
  const v = pp[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : def;
};

export const popScale = (t: number, pp: Record<string, unknown>): number =>
  backOut(clamp(t / 7)) * propNum(pp, 's', 1);

/** 1. COUNTER: Dark #1E1B2E flip-digit panel counting ease-out with thousands separators. */
export const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const from = propNum(pp, 'from', 0);
  const to = propNum(pp, 'to', 100);
  const label = String(pp.label ?? '');
  const col = propColor(pp.color, PALETTE.gold);
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.84))));
  const formatted = val.toLocaleString('en-US');
  const w = Math.max(300, Math.max(formatted.length * 38, label.length * 15) + 74);

  return (
    <g transform={`scale(${s})`}>
      <rect x={-w / 2} y={-68} width={w} height={136} rx={16} fill="#1E1B2E" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={-w / 2 + 8} y={-60} width={w - 16} height={84} rx={10} fill="#131020" stroke={col} strokeWidth={2.5} opacity={0.9} />
      <line x1={-w / 2 + 12} y1={-18} x2={w / 2 - 12} y2={-18} stroke={DARK_OUTLINE} strokeWidth={2.5} opacity={0.75} />
      <text y={3} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={56} fill={PALETTE.cream} letterSpacing={1.5}>
        {formatted}
      </text>
      {label ? (
        <text y={52} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={col} letterSpacing={2.2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 2. CLOCK: Cream analogue clock disc with sweeping single hand. */
export const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const from = propNum(pp, 'from', 0);
  const to = propNum(pp, 'to', 12);
  const ang = lerp(from, to, easeInOut(clamp(p / 0.85))) * 30 + Math.sin(t * 0.25) * 1.5;

  return (
    <g transform={`scale(${s})`}>
      {pp.glow ? <Glow x={0} y={0} r={120} kind="warm" o={0.55} /> : null}
      <circle cx={0} cy={0} r={68} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle cx={0} cy={0} r={58} fill="none" stroke="#D5C8B4" strokeWidth={2} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={-56}
          x2={0}
          y2={i % 3 === 0 ? -44 : -49}
          transform={`rotate(${i * 30})`}
          stroke={DARK_OUTLINE}
          strokeWidth={i % 3 === 0 ? 4 : 2.5}
          strokeLinecap="round"
        />
      ))}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={10} x2={0} y2={-42} stroke={DARK_OUTLINE} strokeWidth={6} strokeLinecap="round" />
        <circle cx={0} cy={-40} r={4} fill={PALETTE.orange} />
      </g>
      <circle cx={0} cy={0} r={7} fill={PALETTE.gold} stroke={DARK_OUTLINE} strokeWidth={3} />
    </g>
  );
};

/** 3. BAR: Outlined horizontal progress bar filling smoothly to pp.frac. */
export const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const frac = clamp(propNum(pp, 'frac', 0.5));
  const label = String(pp.label ?? '');
  const col = propColor(pp.color, PALETTE.gold);
  const w = 320;
  const h = 38;
  const fillW = Math.max(10, (w - 8) * frac * easeOut(clamp(p / 0.78)));

  return (
    <g transform={`scale(${s})`}>
      {label ? (
        <text y={-34} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#181526" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={fillW} height={h - 8} rx={8} fill={col} stroke={DARK_OUTLINE} strokeWidth={3} />
      <rect x={-w / 2 + 8} y={-h / 2 + 7} width={Math.max(4, fillW - 8)} height={6} rx={3} fill="#FFFFFF" opacity={0.35} />
    </g>
  );
};

/** 4. ARROW: Thick outlined curved arrow that draws on across the shot. */
export const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const col = propColor(pp.color, PALETTE.gold);
  const draw = easeOut(clamp(p / 0.62));
  const headPop = backOut(clamp((p - 0.35) / 0.28));
  const d = 'M -86 38 Q -12 -52 76 -22';

  return (
    <g transform={`scale(${s})`}>
      <Glow x={10} y={-10} r={85} kind={pp.color === 'cyan' ? 'cool' : pp.color === 'red' ? 'red' : 'warm'} o={0.35} />
      <path d={d} fill="none" stroke={DARK_OUTLINE} strokeWidth={13} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - draw)} />
      <path d={d} fill="none" stroke={col} strokeWidth={6.5} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - draw)} />
      {headPop > 0.02 ? (
        <g transform={`translate(78 -22) rotate(18) scale(${headPop})`}>
          <polygon points="-22,-18 18,0 -22,18 -12,0" fill={col} stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

/** 5. FLAG: Round outlined cream disc with green check mark + sparkle (or red cross when pp.bad). */
export const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const bad = Boolean(pp.bad);
  const ringCol = bad ? PALETTE.red : PALETTE.green;
  const wig = bad ? Math.sin(t * 0.45) * 3 : 0;
  const spk = 0.7 + 0.3 * Math.sin(t * 0.25);

  return (
    <g transform={`scale(${s}) rotate(${wig})`}>
      <Glow x={0} y={0} r={82} kind={bad ? 'red' : 'cool'} o={0.4} />
      <circle cx={0} cy={0} r={50} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle cx={0} cy={0} r={42} fill="none" stroke={ringCol} strokeWidth={3.5} opacity={0.75} />
      {bad ? (
        <g stroke={PALETTE.red} strokeWidth={10} strokeLinecap="round">
          <line x1={-19} y1={-19} x2={19} y2={19} />
          <line x1={19} y1={-19} x2={-19} y2={19} />
        </g>
      ) : (
        <g>
          <polyline points="-22,3 -6,19 23,-15" fill="none" stroke={PALETTE.green} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <path
            transform={`translate(38 -36) scale(${spk})`}
            d="M 0 -14 L 3.5 -3.5 L 14 0 L 3.5 3.5 L 0 14 L -3.5 3.5 L -14 0 L -3.5 -3.5 Z"
            fill={PALETTE.gold}
            stroke={DARK_OUTLINE}
            strokeWidth={2.5}
          />
        </g>
      )}
    </g>
  );
};

/** 6. CALENDAR: Wall calendar page with red top strip and pp.text in FONTS.title. */
export const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const text = String(pp.text ?? '').slice(0, 8);
  const sway = Math.sin(t * 0.06) * 2.2;

  return (
    <g transform={`scale(${s}) rotate(${sway})`}>
      <rect x={-64} y={-68} width={128} height={136} rx={12} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <path d="M -64 -56 Q -64 -68 -52 -68 L 52 -68 Q 64 -68 64 -56 L 64 -32 L -64 -32 Z" fill={PALETTE.red} stroke={DARK_OUTLINE} strokeWidth={4} />
      {[-30, 30].map((rx, i) => (
        <rect key={i} x={rx - 6} y={-78} width={12} height={22} rx={6} fill="#9BA6BC" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      ))}
      <text y={30} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={text.length > 5 ? 28 : 36} fill={PALETTE.pill}>
        {text}
      </text>
    </g>
  );
};

/** 7. MAGNIFIER: Outlined magnifying glass with cream handle, pale lens and optional cyan bloom. */
export const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const bobX = Math.sin(t * 0.08) * 5;
  const bobY = Math.cos(t * 0.06) * 4;

  return (
    <g transform={`translate(${bobX} ${bobY}) scale(${s})`}>
      {pp.glow ? <Glow x={0} y={0} r={105} kind="cool" o={0.58} /> : null}
      <g transform="rotate(-38)">
        <rect x={-9} y={54} width={18} height={22} rx={4} fill="#8D98B0" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        <rect x={-12} y={70} width={24} height={62} rx={12} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>
      <circle cx={0} cy={0} r={54} fill="#BFE9FF" fillOpacity={0.26} stroke={DARK_OUTLINE} strokeWidth={12} />
      <circle cx={0} cy={0} r={54} fill="none" stroke="#DCE5F5" strokeWidth={5.5} />
      <path d="M -30 -24 A 38 38 0 0 1 12 -36" fill="none" stroke="#FFFFFF" strokeWidth={4.5} strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

/** 8. RING: Pulsing cyan outline that expands and fades each second. */
export const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const cycles = [(t % 30) / 30, ((t + 15) % 30) / 30];

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={88} kind="cool" o={0.42} />
      {cycles.map((c, i) => (
        <circle key={i} cx={0} cy={0} r={lerp(16, 94, easeOut(c))} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={0.9 * (1 - c)} />
      ))}
    </g>
  );
};

/** 9. SCALE: Cream balance scale icon with one pan tipped low. */
export const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const label = String(pp.label ?? '');
  const tilt = -13 + Math.sin(t * 0.08) * 2.5;
  const rad = (tilt * Math.PI) / 180;
  const bx = 66 * Math.cos(rad);
  const by = -42 + 66 * Math.sin(rad);
  const lx = -66 * Math.cos(rad);
  const ly = -42 - 66 * Math.sin(rad);

  return (
    <g transform={`scale(${s})`}>
      {/* Pillar & base */}
      <rect x={-6} y={-48} width={12} height={96} rx={5} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <path d="M -42 56 L 42 56 L 28 42 L -28 42 Z" fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      {/* Tilted beam */}
      <line x1={lx} y1={ly} x2={bx} y2={by} stroke={DARK_OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={bx} y2={by} stroke={PALETTE.cream} strokeWidth={5} strokeLinecap="round" />
      <circle cx={0} cy={-42} r={8} fill={PALETTE.gold} stroke={DARK_OUTLINE} strokeWidth={3.5} />
      {/* Hanging pans */}
      {[
        { px: lx, py: ly },
        { px: bx, py: by },
      ].map((pan, i) => (
        <g key={i} transform={`translate(${pan.px} ${pan.py})`}>
          <line x1={0} y1={0} x2={-22} y2={42} stroke={DARK_OUTLINE} strokeWidth={3} />
          <line x1={0} y1={0} x2={22} y2={42} stroke={DARK_OUTLINE} strokeWidth={3} />
          <path d="M -26 42 Q 0 60 26 42 Z" fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ))}
      {label ? (
        <text y={92} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.gold} letterSpacing={1.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 10. _PROBE_OLD: Icon of the BepiColombo spacecraft stack. */
export const ProbeOldProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const bob = Math.sin(t * 0.08) * 3.5;

  return (
    <g transform={`translate(0 ${bob}) scale(${s})`}>
      {/* Ion thruster flame when glow */}
      {pp.glow ? (
        <g transform="translate(0 38)">
          <Glow x={0} y={14} r={54} kind="warm" o={0.65} />
          <path
            d={`M -11 0 L 0 ${28 + Math.sin(t * 0.6) * 6} L 11 0 Z`}
            fill={PALETTE.orange}
            stroke={DARK_OUTLINE}
            strokeWidth={3}
          />
          <path d="M -5 0 L 0 16 L 5 0 Z" fill="#FFE2B0" />
        </g>
      ) : null}
      {/* Two solar-panel wings */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={d < 0 ? -98 : 30} y={-12} width={68} height={26} rx={4} fill="#1B3568" stroke={DARK_OUTLINE} strokeWidth={4} />
          <line x1={d < 0 ? -64 : 64} y1={-12} x2={d < 0 ? -64 : 64} y2={14} stroke="#4A7BD0" strokeWidth={2.5} />
        </g>
      ))}
      {/* Gold-foil bus body */}
      <rect x={-30} y={-24} width={60} height={60} rx={6} fill="#E6A532" stroke={DARK_OUTLINE} strokeWidth={4} />
      {/* Round grey antenna dish */}
      <ellipse cx={-34} cy={12} rx={14} ry={18} fill="#9AA4B8" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      {/* Silver conical sunshield cap on top */}
      <polygon points="-36,-24 36,-24 22,-54 -22,-54" fill="#DCE4F2" stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

/** 11. THERMO: Tall outlined thermometer with rising red or cyan fluid. */
export const ThermoProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const frac = clamp(propNum(pp, 'frac', 0.8));
  const label = String(pp.label ?? '');
  const col = pp.color === 'cyan' ? PALETTE.cyan : PALETTE.red;
  const fillLevel = clamp(frac * easeOut(clamp(p / 0.72)) + Math.sin(t * 0.22) * 0.015);
  const tubeTop = -78;
  const tubeBot = 36;
  const fy = lerp(tubeBot, tubeTop + 12, fillLevel);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={24} r={82} kind={pp.color === 'cyan' ? 'cool' : 'red'} o={0.4} />
      <rect x={-16} y={tubeTop} width={32} height={134} rx={16} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle cx={0} cy={52} r={26} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      {/* Fluid column & bulb */}
      <rect x={-9} y={fy} width={18} height={52 - fy} rx={9} fill={col} />
      <circle cx={0} cy={52} r={19} fill={col} />
      <circle cx={-6} cy={46} r={5} fill="#FFFFFF" opacity={0.45} />
      {/* Tick marks */}
      {[-56, -34, -12, 10].map((ty, i) => (
        <line key={i} x1={9} y1={ty} x2={16} y2={ty} stroke={DARK_OUTLINE} strokeWidth={3} strokeLinecap="round" />
      ))}
      {label ? (
        <text y={108} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={19} fill={col} letterSpacing={1.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};
