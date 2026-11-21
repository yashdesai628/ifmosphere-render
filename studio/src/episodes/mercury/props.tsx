import React from 'react';
import { clamp, lerp, easeOut, easeInOut, backOut, settle } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { PALETTE, FONTS } from '../../brand';
import type { PropProps, Registry } from './render';
import { INK, BepiStackArt } from './sets-common';

const PROP_COLOR: Record<string, string> = {
  gold: PALETTE.gold,
  red: PALETTE.red,
  cyan: PALETTE.cyan,
  green: PALETTE.green,
  cream: PALETTE.cream,
};

const popScale = (t: number, d = 7) => backOut(clamp((t + 2) / d));

const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 0);
  const label = String(pp.label ?? '');
  const col = PROP_COLOR[String(pp.color ?? 'gold')] ?? PALETTE.gold;
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.85))));
  const str = val.toLocaleString('en-US');
  const w = Math.max(250, Math.max(str.length * 44, label.length * 15) + 56);
  const sc = popScale(t, 8);

  return (
    <g transform={`scale(${sc})`}>
      <Glow x={0} y={0} r={w * 0.65} kind={col === PALETTE.red ? 'red' : col === PALETTE.cyan ? 'cool' : 'warm'} o={0.35} />
      <rect x={-w / 2} y={-68} width={w} height={136} rx={16} fill="#1E1B2E" stroke={INK} strokeWidth={4} />
      <rect x={-w / 2 + 12} y={-54} width={w - 24} height={74} rx={10} fill="#131021" stroke={col} strokeWidth={3} />
      {/* Split-flap horizontal seam */}
      <line x1={-w / 2 + 14} y1={-17} x2={w / 2 - 14} y2={-17} stroke={INK} strokeWidth={2.5} />
      <text y={4} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={54} fill={PALETTE.cream}>
        {str}
      </text>
      <text y={48} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={col} letterSpacing={2}>
        {label}
      </text>
    </g>
  );
};

const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 12);
  const glow = Boolean(pp.glow);
  const cur = lerp(from, to, easeInOut(clamp(p / 0.85)));
  // Sub-hour values (<1 h, like 0.14 h = 8.3 min) sweep on the 60-min circle; >=1 h sweep on the 12-hour dial
  const scaleDeg = to < 1 ? 360 : 30;
  const a0 = (from * scaleDeg - 90) * (Math.PI / 180);
  const a1 = (cur * scaleDeg - 90) * (Math.PI / 180);
  const r = 74;
  const sweepRad = a1 - a0;
  const sc = popScale(t, 7);

  return (
    <g transform={`scale(${sc})`}>
      {glow ? <Glow x={0} y={0} r={120} kind="warm" o={0.65} /> : null}
      <circle r={r} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      {/* Swept wedge */}
      {Math.abs(sweepRad) > 0.03 ? (
        <path
          d={`M 0 0 L ${Math.cos(a0) * (r - 12)} ${Math.sin(a0) * (r - 12)} A ${r - 12} ${r - 12} 0 ${sweepRad > Math.PI ? 1 : 0} 1 ${Math.cos(a1) * (r - 12)} ${Math.sin(a1) * (r - 12)} Z`}
          fill={PALETTE.gold}
          opacity={0.38}
        />
      ) : null}
      {/* 12 dial ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.cos(ang) * (r - 14)}
            y1={Math.sin(ang) * (r - 14)}
            x2={Math.cos(ang) * (r - 5)}
            y2={Math.sin(ang) * (r - 5)}
            stroke={INK}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Single sweeping hand */}
      <line x1={0} y1={0} x2={Math.cos(a1) * (r - 18)} y2={Math.sin(a1) * (r - 18)} stroke={PALETTE.orange} strokeWidth={5.5} strokeLinecap="round" />
      <circle r={7} fill={INK} />
    </g>
  );
};

const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(Number(pp.frac ?? 0.5));
  const col = PROP_COLOR[String(pp.color ?? 'gold')] ?? PALETTE.gold;
  const label = String(pp.label ?? '');
  const fillW = 300 * frac * easeOut(clamp(p / 0.8));
  const sc = popScale(t, 7);

  return (
    <g transform={`scale(${sc})`}>
      <text y={-28} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream} letterSpacing={1.5}>
        {label}
      </text>
      <rect x={-158} y={-14} width={316} height={36} rx={10} fill="#1B1E33" stroke={INK} strokeWidth={4} />
      {fillW > 4 ? (
        <g>
          <Glow x={-150 + fillW * 0.5} y={4} r={75} kind={col === PALETTE.red ? 'red' : col === PALETTE.cyan ? 'cool' : 'warm'} o={0.35} />
          <rect x={-150} y={-7} width={fillW} height={22} rx={6} fill={col} />
          <line x1={-146} y1={-3} x2={-154 + fillW} y2={-3} stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.5} />
        </g>
      ) : null}
      <rect x={-158} y={-14} width={316} height={36} rx={10} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
};

const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = PROP_COLOR[String(pp.color ?? 'gold')] ?? PALETTE.gold;
  const prog = easeOut(clamp(p / 0.75));
  const len = 180;
  const sc = popScale(t, 6);

  return (
    <g transform={`scale(${sc})`}>
      <path
        d="M -70 30 Q -15 -45 65 -20"
        fill="none"
        stroke={INK}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - prog)}
      />
      <path
        d="M -70 30 Q -15 -45 65 -20"
        fill="none"
        stroke={col}
        strokeWidth={6.5}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - prog)}
      />
      {prog > 0.7 ? (
        <polygon
          points="56,-34 84,-16 54,-4"
          fill={col}
          stroke={INK}
          strokeWidth={3.5}
          strokeLinejoin="round"
          transform={`scale(${backOut(clamp((prog - 0.7) / 0.3))})`}
        />
      ) : null}
    </g>
  );
};

const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = Boolean(pp.bad);
  const sc = popScale(t, 7);
  const tw = 0.65 + 0.35 * Math.sin(t / 6);

  return (
    <g transform={`scale(${sc})`}>
      <Glow x={0} y={0} r={80} kind={bad ? 'red' : 'cool'} o={0.45} />
      <circle r={46} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      {bad ? (
        <g stroke={PALETTE.red} strokeWidth={8} strokeLinecap="round">
          <line x1={-16} y1={-16} x2={16} y2={16} />
          <line x1={16} y1={-16} x2={-16} y2={16} />
        </g>
      ) : (
        <g>
          <path d="M -18 2 L -5 16 L 20 -15" fill="none" stroke={PALETTE.green} strokeWidth={8.5} strokeLinecap="round" strokeLinejoin="round" />
          {/* Tiny 4-point sparkle */}
          <path
            d="M 44 -36 L 47 -26 L 57 -23 L 47 -20 L 44 -10 L 41 -20 L 31 -23 L 41 -26 Z"
            fill={PALETTE.gold}
            opacity={tw}
          />
        </g>
      )}
    </g>
  );
};

const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = String(pp.text ?? '').slice(0, 8);
  const sc = popScale(t, 7);

  return (
    <g transform={`scale(${sc})`}>
      <rect x={-72} y={-62} width={144} height={124} rx={12} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <path d="M -72 -32 L -72 -50 Q -72 -62 -60 -62 L 60 -62 Q 72 -62 72 -50 L 72 -32 Z" fill={PALETTE.red} stroke={INK} strokeWidth={4} />
      {[-34, 34].map((rx) => (
        <rect key={rx} x={rx - 6} y={-74} width={12} height={22} rx={5} fill="#A9B4CA" stroke={INK} strokeWidth={3.5} />
      ))}
      <text y={26} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={text.length > 6 ? 26 : 32} fill={PALETTE.pill}>
        {text}
      </text>
    </g>
  );
};

const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = Number(pp.s ?? 1);
  const glow = Boolean(pp.glow);
  const sc = popScale(t, 7) * s;

  return (
    <g transform={`scale(${sc}) rotate(${Math.sin(t / 16) * 4})`}>
      {glow ? <Glow x={-10} y={-10} r={75} kind="cool" o={0.6} /> : null}
      <line x1={22} y1={22} x2={68} y2={68} stroke={INK} strokeWidth={18} strokeLinecap="round" />
      <line x1={22} y1={22} x2={68} y2={68} stroke={PALETTE.cream} strokeWidth={10} strokeLinecap="round" />
      <circle cx={-10} cy={-10} r={44} fill="#88E6FF" fillOpacity={0.22} stroke={INK} strokeWidth={10} />
      <circle cx={-10} cy={-10} r={44} fill="none" stroke="#B6C2DA" strokeWidth={4} />
      <path d="M -32 -22 A 26 26 0 0 1 -6 -38" fill="none" stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
    </g>
  );
};

const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = Number(pp.s ?? 1);
  return (
    <g transform={`scale(${s})`}>
      {[0, 0.5].map((off, idx) => {
        const cyc = ((t / 26) + off) % 1;
        const r = lerp(20, 88, easeOut(cyc));
        const op = 1 - cyc;
        return (
          <g key={idx}>
            <Glow x={0} y={0} r={r * 1.4} kind="cool" o={op * 0.45} />
            <circle r={r} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={op} />
          </g>
        );
      })}
    </g>
  );
};

const ScaleProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = Number(pp.s ?? 1);
  const label = String(pp.label ?? '');
  const sc = popScale(t, 7) * s;
  const tilt = 16 * backOut(clamp(p / 0.4)) + settle(t - 8, 5);

  return (
    <g transform={`scale(${sc})`}>
      <rect x={-38} y={34} width={76} height={14} rx={5} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <line x1={0} y1={34} x2={0} y2={-32} stroke={PALETTE.cream} strokeWidth={6} />
      <line x1={0} y1={34} x2={0} y2={-32} stroke={INK} strokeWidth={2.5} opacity={0.25} />
      <g transform={`translate(0 -32) rotate(${tilt})`}>
        <line x1={-66} y1={0} x2={66} y2={0} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <line x1={-66} y1={0} x2={66} y2={0} stroke={PALETTE.cream} strokeWidth={4.5} strokeLinecap="round" />
        {[-66, 66].map((px, i) => (
          <g key={i} transform={`translate(${px} 0) rotate(${-tilt})`}>
            <line x1={0} y1={0} x2={-16} y2={34} stroke={PALETTE.cream} strokeWidth={2.5} />
            <line x1={0} y1={0} x2={16} y2={34} stroke={PALETTE.cream} strokeWidth={2.5} />
            <path d="M -22 34 Q 0 46 22 34 Z" fill={PALETTE.cream} stroke={INK} strokeWidth={3.5} />
            {i === 1 ? <circle cx={0} cy={27} r={9} fill={PALETTE.gold} stroke={INK} strokeWidth={3} /> : null}
          </g>
        ))}
      </g>
      <circle cx={0} cy={-32} r={7} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />
      {label ? (
        <text y={74} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.cream}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

const ProbeProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const s = Number(pp.s ?? 1);
  const glow = Boolean(pp.glow);
  const sc = popScale(t, 7) * s * 0.42;

  return (
    <g transform={`translate(0 ${Math.sin(t / 14) * 4}) scale(${sc})`}>
      <BepiStackArt id={`${id}pr`} t={t} fire={glow ? 1 : 0} wingSpan={140} />
    </g>
  );
};

const ThermoProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(Number(pp.frac ?? 0.5));
  const col = String(pp.color ?? 'red') === 'cyan' ? PALETTE.cyan : PALETTE.red;
  const label = String(pp.label ?? '');
  const sc = popScale(t, 7);
  const colH = 114 * frac * easeOut(clamp(p / 0.8));

  return (
    <g transform={`scale(${sc})`}>
      <Glow x={0} y={48} r={70} kind={col === PALETTE.red ? 'red' : 'cool'} o={0.55} />
      {/* Cream outer glass tube & bulb */}
      <rect x={-18} y={-88} width={36} height={134} rx={18} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={52} r={28} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      {/* Dark interior */}
      <rect x={-9} y={-76} width={18} height={118} rx={9} fill="#1B1E33" />
      {/* Fluid */}
      <rect x={-9} y={40 - colH} width={18} height={colH + 10} rx={7} fill={col} />
      <circle cx={0} cy={52} r={19} fill={col} />
      {/* Ticks */}
      {[-55, -30, -5, 20].map((ty, i) => (
        <line key={i} x1={12} y1={ty} x2={22} y2={ty} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      ))}
      <text y={108} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={22} fill={col}>
        {label}
      </text>
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
};
