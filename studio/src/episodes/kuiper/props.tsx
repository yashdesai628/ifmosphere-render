import React from 'react';
import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { PALETTE, FONTS } from '../../brand';
import type { PropProps, Registry } from './render';

const num = (o: Record<string, unknown>, k: string, d = 0) => (typeof o[k] === 'number' ? (o[k] as number) : d);
const str = (o: Record<string, unknown>, k: string, d = '') => (typeof o[k] === 'string' ? (o[k] as string) : d);
const bool = (o: Record<string, unknown>, k: string, d = false) => (typeof o[k] === 'boolean' ? (o[k] as boolean) : d);

const colOf = (name: string) =>
  name === 'red' ? PALETTE.red : name === 'cyan' ? PALETTE.cyan : name === 'green' ? PALETTE.green : PALETTE.gold;

/** 1. counter: big flat panel, 4 px dark outline, #1E1B2E face, cream flip digits, label beneath. */
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = num(pp, 'from', 0);
  const to = num(pp, 'to', 100);
  const label = str(pp, 'label', '');
  const col = colOf(str(pp, 'color', 'gold'));
  const pop = backOut(clamp(t / 8));
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.8))));
  const txt = val.toLocaleString('en-US');
  const w = Math.max(250, Math.max(txt.length * 42, label.length * 16) + 72);

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={-8} r={140} kind={col === PALETTE.cyan ? 'cool' : col === PALETTE.red ? 'red' : 'warm'} o={0.35} />
      <rect x={-w / 2} y={-68} width={w} height={132} rx={18} fill="#1E1B2E" stroke="#121019" strokeWidth={4} />
      <rect x={-w / 2 + 8} y={-60} width={w - 16} height={116} rx={12} fill="none" stroke={col} strokeWidth={2.5} opacity={0.85} />
      <line x1={-w / 2 + 22} y1={-12} x2={w / 2 - 22} y2={-12} stroke="#121019" strokeWidth={3} opacity={0.6} />
      <text y={10} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={62} fill={PALETTE.cream}>
        {txt}
      </text>
      {label ? (
        <text y={44} textAnchor="middle" fontFamily={FONTS.ui} fontSize={19} fontWeight={700} fill={col} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 2. clock: round analogue face, cream disc, 4 px outline, ticks, sweeping hand. */
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = num(pp, 'from', 0);
  const to = num(pp, 'to', 6);
  const hasGlow = bool(pp, 'glow', false);
  const pop = backOut(clamp(t / 8));
  const hrs = lerp(from, to, easeInOut(clamp(p / 0.85)));
  const ang = (hrs / 12) * 360;

  return (
    <g transform={`scale(${pop})`}>
      {hasGlow ? <Glow x={0} y={0} r={140} kind="warm" o={0.6} /> : null}
      <rect x={-14} y={-92} width={28} height={16} rx={5} fill="#363954" stroke="#121019" strokeWidth={4} />
      <circle cx={0} cy={0} r={74} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
      <circle cx={0} cy={0} r={65} fill="none" stroke="#D2C6B2" strokeWidth={2.5} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 52}
            y1={Math.sin(a) * 52}
            x2={Math.cos(a) * 62}
            y2={Math.sin(a) * 62}
            stroke="#121019"
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
          />
        );
      })}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={10} x2={0} y2={-48} stroke={PALETTE.orange} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={0} r={7} fill="#121019" />
    </g>
  );
};

/** 3. bar: horizontal progress bar with 4 px outline, colored fill to pp.frac, label above. */
const BarProp: React.FC<PropProps> = ({ t, p, pp, id }) => {
  const frac = clamp(num(pp, 'frac', 0.5));
  const col = colOf(str(pp, 'color', 'gold'));
  const label = str(pp, 'label', '');
  const pop = backOut(clamp(t / 8));
  const fillFrac = lerp(0, frac, easeOut(clamp(p / 0.85)));
  const w = 320;
  const h = 40;
  const fillW = fillFrac > 0 ? Math.max(12, w * fillFrac) : 0;

  return (
    <g transform={`scale(${pop})`}>
      <defs>
        <clipPath id={`${id}barClip`}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} />
        </clipPath>
      </defs>
      {label ? (
        <text y={-34} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fontWeight={700} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#1E1B2E" stroke="#121019" strokeWidth={4} />
      <g clipPath={`url(#${id}barClip)`}>
        <rect x={-w / 2} y={-h / 2} width={fillW} height={h} fill={col} />
      </g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="none" stroke="#121019" strokeWidth={4} />
    </g>
  );
};

/** 4. arrow: thick outlined curved arrow drawing on across the shot. */
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = colOf(str(pp, 'color', 'cyan'));
  const pop = backOut(clamp(t / 7));
  const prog = easeInOut(clamp(p / 0.78));
  const headPop = backOut(clamp((p - 0.55) / 0.25));
  const pathD = 'M -105 34 Q -10 -58 96 -14';

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={40} y={-20} r={110} kind={col === PALETTE.cyan ? 'cool' : col === PALETTE.red ? 'red' : 'warm'} o={0.4} />
      <path d={pathD} fill="none" stroke="#121019" strokeWidth={18} strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - prog)} />
      <path d={pathD} fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - prog)} />
      {headPop > 0.01 ? (
        <g transform={`translate(96 -14) rotate(14) scale(${headPop})`}>
          <polygon points="24,0 -14,-18 -8,0 -14,18" fill={col} stroke="#121019" strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </g>
  );
};

/** 5. flag: green check badge in round outlined cream disc with sparkle, or red X when pp.bad true. */
const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = bool(pp, 'bad', false);
  const pop = backOut(clamp(t / 7));
  const tw = 0.6 + 0.4 * Math.sin(t / 6);

  return (
    <g transform={`scale(${pop})`}>
      <circle cx={0} cy={0} r={48} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
      <circle cx={0} cy={0} r={39} fill="none" stroke={bad ? PALETTE.red : PALETTE.green} strokeWidth={3} opacity={0.45} />
      {bad ? (
        <g stroke={PALETTE.red} strokeWidth={9} strokeLinecap="round">
          <line x1={-17} y1={-17} x2={17} y2={17} />
          <line x1={17} y1={-17} x2={-17} y2={17} />
        </g>
      ) : (
        <g>
          <polyline points="-19,2 -5,17 21,-15" fill="none" stroke={PALETTE.green} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          <g transform={`translate(34 -34) scale(${tw})`}>
            <path d="M -10 0 L -2 -2 L 0 -10 L 2 -2 L 10 0 L 2 2 L 0 10 L -2 2 Z" fill={PALETTE.gold} stroke="#121019" strokeWidth={2} />
          </g>
        </g>
      )}
    </g>
  );
};

/** 6. calendar: small wall calendar page, cream with red top strip, 4 px outline, pp.text date. */
const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const txt = str(pp, 'text', '1930').slice(0, 8);
  const pop = backOut(clamp(t / 8));
  const swing = settle(t - 4, 5, 1.1, 10);

  return (
    <g transform={`scale(${pop}) rotate(${swing})`}>
      <rect x={-72} y={-74} width={144} height={148} rx={16} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
      <path d="M -72 -32 L 72 -32 L 72 -58 Q 72 -74 56 -74 L -56 -74 Q -72 -74 -72 -58 Z" fill={PALETTE.red} stroke="#121019" strokeWidth={4} />
      <rect x={-42} y={-88} width={14} height={24} rx={5} fill="#444861" stroke="#121019" strokeWidth={3.5} />
      <rect x={28} y={-88} width={14} height={24} rx={5} fill="#444861" stroke="#121019" strokeWidth={3.5} />
      <text y={26} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={txt.length > 5 ? 36 : 44} fill={PALETTE.pill}>
        {txt}
      </text>
    </g>
  );
};

/** 7. magnifier: outlined magnifying glass, cream handle, pale glass, optional cyan bloom. */
const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp, 's', 1);
  const hasGlow = bool(pp, 'glow', false);
  const pop = backOut(clamp(t / 8)) * s;
  const bob = Math.sin(t / 13) * 4;

  return (
    <g transform={`translate(0 ${bob}) scale(${pop})`}>
      {hasGlow ? <Glow x={-12} y={-12} r={120} kind="cool" o={0.65} /> : null}
      <line x1={26} y1={26} x2={78} y2={78} stroke="#121019" strokeWidth={24} strokeLinecap="round" />
      <line x1={26} y1={26} x2={78} y2={78} stroke={PALETTE.cream} strokeWidth={15} strokeLinecap="round" />
      <circle cx={-12} cy={-12} r={54} fill="#8AE6FF" opacity={0.28} />
      <circle cx={-12} cy={-12} r={54} fill="none" stroke="#2E3247" strokeWidth={12} />
      <circle cx={-12} cy={-12} r={58} fill="none" stroke="#121019" strokeWidth={4} />
      <path d="M -42 -26 A 36 36 0 0 1 -6 -48" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
    </g>
  );
};

/** 8. ring: pulsing cyan circle outline, 4 px, soft bloom, expanding and fading each second. */
const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp, 's', 1);
  const ph1 = (t % 30) / 30;
  const ph2 = ((t + 15) % 30) / 30;

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={105} kind="cool" o={0.45 * (1 - ph1 * 0.5)} />
      <circle cx={0} cy={0} r={22 + ph1 * 68} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={1 - easeOut(ph1)} />
      <circle cx={0} cy={0} r={22 + ph2 * 68} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={(1 - easeOut(ph2)) * 0.75} />
    </g>
  );
};

/** 9. scale: balance scale icon, cream, 4 px outline, one pan tipped low, pp.label beneath. */
const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp, 's', 1);
  const label = str(pp, 'label', '');
  const pop = backOut(clamp(t / 8)) * s;
  const tilt = 14 + Math.sin(t / 15) * 3;
  const rad = (tilt * Math.PI) / 180;
  const lx = -Math.cos(rad) * 58;
  const ly = -38 - Math.sin(rad) * 58;
  const rx = Math.cos(rad) * 58;
  const ry = -38 + Math.sin(rad) * 58;

  return (
    <g transform={`scale(${pop})`}>
      <rect x={-42} y={42} width={84} height={14} rx={6} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
      <line x1={0} y1={42} x2={0} y2={-48} stroke="#121019" strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={42} x2={0} y2={-48} stroke={PALETTE.cream} strokeWidth={5} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#121019" strokeWidth={10} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" />
      <circle cx={0} cy={-38} r={7} fill={PALETTE.gold} stroke="#121019" strokeWidth={3} />
      {[{ x: lx, y: ly }, { x: rx, y: ry }].map((pt, i) => (
        <g key={i} transform={`translate(${pt.x} ${pt.y})`}>
          <line x1={0} y1={0} x2={-16} y2={38} stroke={PALETTE.cream} strokeWidth={2.5} />
          <line x1={0} y1={0} x2={16} y2={38} stroke={PALETTE.cream} strokeWidth={2.5} />
          <path d="M -22 38 Q 0 54 22 38 Z" fill={PALETTE.cream} stroke="#121019" strokeWidth={3.5} />
        </g>
      ))}
      {label ? (
        <text y={86} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fontWeight={700} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 10. probe: BepiColombo stack icon, gold-foil body, solar wings, grey dish, silver sunshield, optional thruster flame. */
const ProbeProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp, 's', 1);
  const hasGlow = bool(pp, 'glow', false);
  const pop = backOut(clamp(t / 8)) * s;
  const bob = Math.sin(t / 15) * 4;
  const flick = 0.85 + 0.2 * Math.sin(t * 1.4);

  return (
    <g transform={`translate(0 ${bob}) scale(${pop})`}>
      {hasGlow ? (
        <g>
          <Glow x={0} y={56} r={90} kind="warm" o={0.65} />
          <polygon points={`-10,36 10,36 0,${64 * flick + 20}`} fill={PALETTE.orange} stroke="#121019" strokeWidth={3} />
          <polygon points={`-5,36 5,36 0,${44 * flick + 18}`} fill={PALETTE.gold} />
        </g>
      ) : null}
      {/* Two dark solar-panel wings */}
      <rect x={-110} y={-16} width={66} height={32} rx={4} fill="#1E2B4E" stroke="#121019" strokeWidth={4} />
      <rect x={44} y={-16} width={66} height={32} rx={4} fill="#1E2B4E" stroke="#121019" strokeWidth={4} />
      {/* Gold-foil box body */}
      <rect x={-32} y={-24} width={64} height={60} rx={6} fill={PALETTE.gold} stroke="#121019" strokeWidth={4} />
      <line x1={-32} y1={6} x2={32} y2={6} stroke="#C2881E" strokeWidth={3} />
      {/* Silver conical sunshield on top */}
      <polygon points="-38,-24 38,-24 22,-54 -22,-54" fill="#C7D0E0" stroke="#121019" strokeWidth={4} strokeLinejoin="round" />
      {/* Round grey antenna dish */}
      <ellipse cx={36} cy={-44} rx={20} ry={12} transform="rotate(24 36 -44)" fill="#8F98AD" stroke="#121019" strokeWidth={4} />
    </g>
  );
};

/** 11. thermo: tall outlined thermometer, cream glass tube, red or blue fluid to pp.frac, label beneath. */
const ThermoProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(num(pp, 'frac', 0.5));
  const col = str(pp, 'color', 'red') === 'cyan' ? PALETTE.cyan : PALETTE.red;
  const label = str(pp, 'label', '');
  const pop = backOut(clamp(t / 8));
  const f = lerp(0, frac, easeOut(clamp(p / 0.8)));
  const stemH = 128 * f;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={56} r={75} kind={col === PALETTE.cyan ? 'cool' : 'red'} o={0.45} />
      <rect x={-16} y={-88} width={32} height={140} rx={16} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
      <circle cx={0} cy={58} r={28} fill={PALETTE.cream} stroke="#121019" strokeWidth={4} />
      <rect x={-9} y={48 - stemH} width={18} height={stemH + 12} rx={9} fill={col} />
      <circle cx={0} cy={58} r={20} fill={col} />
      {[-60, -30, 0, 30].map((ty, i) => (
        <line key={i} x1={18} y1={ty} x2={28} y2={ty} stroke={PALETTE.cream} strokeWidth={3} strokeLinecap="round" />
      ))}
      {label ? (
        <text y={114} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fontWeight={700} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 12. grain: rough grey-brown speck with sparkling facets and thin pale outline 4 px, cyan glow. */
const GrainProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = num(pp, 's', 1);
  const hasGlow = bool(pp, 'glow', false);
  const pop = backOut(clamp(t / 8)) * s;
  const pulse = hasGlow ? 0.55 + 0.3 * Math.sin(t / 6) : 0.45;
  const tw = 0.5 + 0.5 * Math.sin(t / 5);

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={120} kind="cool" o={pulse} />
      {hasGlow ? (
        <circle cx={0} cy={0} r={66 + 10 * Math.sin(t / 7)} fill="none" stroke={PALETTE.cyan} strokeWidth={3} opacity={0.45} />
      ) : null}
      <polygon
        points="-46,-14 -20,-48 26,-42 52,-6 36,40 -12,48 -44,22"
        fill="#6D615B"
        stroke="#DCE8FF"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <polygon points="-20,-48 26,-42 10,-4 -34,-12" fill="#9A8B82" opacity={0.8} />
      <polygon points="10,-4 52,-6 36,40 -12,48" fill="#4E433F" opacity={0.75} />
      <g transform={`translate(-14 -22) scale(${0.6 + 0.4 * tw})`}>
        <path d="M -8 0 L -2 -2 L 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 Z" fill="#FFFFFF" />
      </g>
      <g transform={`translate(22 14) scale(${0.5 + 0.5 * (1 - tw)})`}>
        <path d="M -7 0 L -1.5 -1.5 L 0 -7 L 1.5 -1.5 L 7 0 L 1.5 1.5 L 0 7 L -1.5 1.5 Z" fill={PALETTE.cyan} />
      </g>
    </g>
  );
};

export const PROPS: Registry['props'] = {
  counter: CounterProp,
  clock: ClockProp,
  bar: BarProp,
  arrow: ArrowProp,
  flag: FlagProp,
  calendar: CalendarProp,
  magnifier: MagnifierProp,
  ring: RingProp,
  scale: ScaleProp,
  probe: ProbeProp,
  thermo: ThermoProp,
  grain: GrainProp,
};
