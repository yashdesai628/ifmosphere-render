import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { Glow } from '../../engine/light';
import { clamp, lerp, easeInOut, easeOut, backOut } from '../../engine/anim';
import type { PropProps, Registry } from './render';
import { INK, propColor } from './sets-shared';

const popScale = (t: number, s = 1) => backOut(clamp(t / 7)) * s;

const glowKindOf = (col: string): 'warm' | 'cool' | 'red' =>
  col === PALETTE.red ? 'red' : col === PALETTE.cyan || col === PALETTE.sky ? 'cool' : 'warm';

/** 1. counter: digital flip panel counting from->to with ease-out and label underneath. */
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = (pp.from as number | undefined) ?? 0;
  const to = (pp.to as number | undefined) ?? 1000;
  const label = (pp.label as string | undefined) ?? 'COUNT';
  const col = propColor(pp.color);
  const val = Math.round(lerp(from, to, easeOut(p))).toLocaleString();

  return (
    <g transform={`scale(${popScale(t)})`}>
      <Glow x={0} y={0} r={140} kind={glowKindOf(col)} o={0.32} />
      <rect x={-136} y={-56} width={272} height={112} rx={16} fill="#1E1B2E" stroke={INK} strokeWidth={4} />
      <rect x={-124} y={-44} width={248} height={64} rx={10} fill="#131020" stroke={col} strokeWidth={2.5} />
      <line x1={-120} y1={-12} x2={120} y2={-12} stroke="#282342" strokeWidth={2} />
      <text y={2} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={40} fill={PALETTE.cream}>
        {val}
      </text>
      <text y={44} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={16} fill={col}>
        {label}
      </text>
    </g>
  );
};

/** 2. clock: round cream analogue clock face with ticks, hour sweep from..to, and optional gold glow. */
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = (pp.from as number | undefined) ?? 0;
  const to = (pp.to as number | undefined) ?? 12;
  const hrs = lerp(from, to, easeInOut(p));
  const handDeg = (hrs / 12) * 360;
  const minDeg = ((hrs * 12) % 12) * 30 + t * 2;
  const glow = Boolean(pp.glow);

  return (
    <g transform={`scale(${popScale(t)})`}>
      {glow ? <Glow x={0} y={0} r={115} kind="warm" o={0.55 + 0.15 * Math.sin(t / 10)} /> : null}
      <circle cx={0} cy={0} r={66} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={0} r={56} fill="none" stroke="#CBBFA8" strokeWidth={2} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={-56}
          x2={0}
          y2={i % 3 === 0 ? -44 : -49}
          transform={`rotate(${i * 30})`}
          stroke={INK}
          strokeWidth={i % 3 === 0 ? 4 : 2.5}
          strokeLinecap="round"
        />
      ))}
      <line
        x1={0}
        y1={8}
        x2={0}
        y2={-46}
        transform={`rotate(${minDeg})`}
        stroke={PALETTE.red}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1={0}
        y1={8}
        x2={0}
        y2={-34}
        transform={`rotate(${handDeg})`}
        stroke={INK}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
      <circle cx={0} cy={0} r={6} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** 3. bar: horizontal progress bar with 4 px outline filling to pp.frac and label above. */
const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp((pp.frac as number | undefined) ?? 0.7);
  const col = propColor(pp.color);
  const label = (pp.label as string | undefined) ?? 'PROGRESS';
  const fillW = 228 * frac * easeOut(p);

  return (
    <g transform={`scale(${popScale(t)})`}>
      <text x={0} y={-24} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.cream}>
        {label}
      </text>
      <rect x={-120} y={-12} width={240} height={32} rx={10} fill="#1A172B" stroke={INK} strokeWidth={4} />
      {fillW > 2 ? (
        <rect x={-114} y={-6} width={fillW} height={20} rx={6} fill={col} stroke={INK} strokeWidth={2.5} />
      ) : null}
    </g>
  );
};

/** 4. arrow: thick outlined curved arrow drawing across the shot. */
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = propColor(pp.color);
  const draw = easeOut(clamp(p * 1.4));
  const headScale = draw > 0.72 ? backOut(clamp((draw - 0.72) / 0.28)) : 0;

  return (
    <g transform={`scale(${popScale(t)})`}>
      <path
        d="M -72 34 Q -10 -46 64 -26"
        fill="none"
        stroke={INK}
        strokeWidth={17}
        strokeLinecap="round"
        strokeDasharray="180"
        strokeDashoffset={180 * (1 - draw)}
      />
      <path
        d="M -72 34 Q -10 -46 64 -26"
        fill="none"
        stroke={col}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray="180"
        strokeDashoffset={180 * (1 - draw)}
      />
      {headScale > 0.01 ? (
        <polygon
          transform={`translate(68 -24) rotate(16) scale(${headScale})`}
          points="18,0 -12,-14 -6,0 -12,14"
          fill={col}
          stroke={INK}
          strokeWidth={4}
        />
      ) : null}
    </g>
  );
};

/** 5. flag: round cream check badge (green check) or red cross (pp.bad). */
const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = Boolean(pp.bad);
  const spk = 0.7 + 0.3 * Math.sin(t / 7);

  return (
    <g transform={`scale(${popScale(t)})`}>
      <Glow x={0} y={0} r={90} kind={bad ? 'red' : 'cool'} o={0.45} />
      <circle cx={0} cy={0} r={46} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      {bad ? (
        <path d="M -18 -18 L 18 18 M 18 -18 L -18 18" stroke={PALETTE.red} strokeWidth={10} strokeLinecap="round" />
      ) : (
        <path d="M -20 2 L -6 16 L 22 -16" fill="none" stroke={PALETTE.green} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      )}
      <path
        transform={`translate(42 -42) scale(${spk})`}
        d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z"
        fill={PALETTE.gold}
        stroke={INK}
        strokeWidth={2}
      />
    </g>
  );
};

/** 6. calendar: small wall calendar page, cream with red top strip and title date. */
const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = ((pp.text as string | undefined) ?? '~1667').slice(0, 8);
  const swing = Math.sin(t / 15) * 2.5;

  return (
    <g transform={`rotate(${swing}) scale(${popScale(t)})`}>
      <rect x={-64} y={-68} width={128} height={136} rx={12} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <path d="M -64 -56 Q -64 -68 -52 -68 L 52 -68 Q 64 -68 64 -56 L 64 -28 L -64 -28 Z" fill={PALETTE.red} stroke={INK} strokeWidth={4} />
      <circle cx={-34} cy={-50} r={5} fill="#252136" />
      <circle cx={34} cy={-50} r={5} fill="#252136" />
      <text y={26} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={32} fill={PALETTE.pill}>
        {text}
      </text>
    </g>
  );
};

/** 7. magnifier: cream handle & pale glass with optional cyan lens bloom. */
const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const glow = Boolean(pp.glow);
  const tilt = Math.sin(t / 18) * 4;

  return (
    <g transform={`rotate(${tilt - 20}) scale(${popScale(t, s)})`}>
      {glow ? <Glow x={0} y={-20} r={105} kind="cool" o={0.62 + 0.15 * Math.sin(t / 9)} /> : null}
      <rect x={-10} y={32} width={20} height={74} rx={9} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <rect x={-12} y={24} width={24} height={14} rx={4} fill={PALETTE.gold} stroke={INK} strokeWidth={3.5} />
      <circle cx={0} cy={-20} r={48} fill="#7FD8FF" fillOpacity={0.28} stroke="#2E2948" strokeWidth={12} />
      <circle cx={0} cy={-20} r={54} fill="none" stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={-20} r={42} fill="none" stroke={INK} strokeWidth={3.5} />
      <path d="M -24 -36 A 30 30 0 0 1 12 -46" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
    </g>
  );
};

/** 8. ring: pulsing cyan circle outline that expands and fades each second. */
const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const c1 = (t % 30) / 30;
  const c2 = ((t + 15) % 30) / 30;

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={95} kind="cool" o={0.45 * (1 - c1)} />
      {[c1, c2].map((c, i) => (
        <circle
          key={i}
          cx={0}
          cy={0}
          r={lerp(24, 92, easeOut(c))}
          fill="none"
          stroke={PALETTE.cyan}
          strokeWidth={4}
          opacity={1 - c}
        />
      ))}
    </g>
  );
};

/** 9. scale: cream balance scale with tipped pan and label underneath. */
const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const label = (pp.label as string | undefined) ?? '';
  const beamDeg = -11 + Math.sin(t / 20) * 3;
  const rad = (beamDeg * Math.PI) / 180;
  const lx = -56 * Math.cos(rad);
  const ly = -32 - 56 * Math.sin(rad);
  const rx = 56 * Math.cos(rad);
  const ry = -32 + 56 * Math.sin(rad);

  return (
    <g transform={`scale(${popScale(t, s)})`}>
      <rect x={-36} y={34} width={72} height={14} rx={6} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <line x1={0} y1={34} x2={0} y2={-42} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <line x1={0} y1={34} x2={0} y2={-42} stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" />
      {/* Tilted crossbar */}
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" />
      {/* Left & right hanging pans */}
      {[
        { x: lx, y: ly },
        { x: rx, y: ry },
      ].map((pan, i) => (
        <g key={i} transform={`translate(${pan.x} ${pan.y})`}>
          <path d="M 0 0 L -18 36 M 0 0 L 18 36" stroke={PALETTE.cream} strokeWidth={2.5} />
          <path d="M -22 36 Q 0 52 22 36 Z" fill={PALETTE.cream} stroke={INK} strokeWidth={3.5} />
        </g>
      ))}
      <circle cx={0} cy={-32} r={7} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />
      {label ? (
        <text y={76} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={16} fill={PALETTE.cream}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 10. _probe_old: BepiColombo stack with gold-foil box, solar wings, dish, sunshield, and thruster glow. */
const ProbeOldProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const glow = Boolean(pp.glow);
  const bob = Math.sin(t / 16) * 4;

  return (
    <g transform={`translate(0 ${bob}) scale(${popScale(t, s)})`}>
      {glow ? (
        <g>
          <Glow x={0} y={56} r={75} kind="warm" o={0.65} />
          <polygon points="-12,38 0,68 12,38" fill={PALETTE.orange} stroke={INK} strokeWidth={3} />
          <polygon points="-6,38 0,56 6,38" fill="#FFF2B0" />
        </g>
      ) : null}
      {/* Solar wings */}
      <rect x={-96} y={-8} width={66} height={24} rx={4} fill="#253D73" stroke={INK} strokeWidth={4} />
      <rect x={30} y={-8} width={66} height={24} rx={4} fill="#253D73" stroke={INK} strokeWidth={4} />
      {/* Gold-foil body */}
      <rect x={-30} y={-24} width={60} height={62} rx={6} fill="#E6AE32" stroke={INK} strokeWidth={4} />
      {/* Silver conical sunshield on top */}
      <polygon points="-38,-24 38,-24 22,-54 -22,-54" fill="#D5DDEB" stroke={INK} strokeWidth={4} />
      {/* Antenna dish */}
      <circle cx={0} cy={4} r={16} fill="#9AA3B8" stroke={INK} strokeWidth={3.5} />
    </g>
  );
};

/** 11. thermo: tall outlined thermometer with animated fluid column and label underneath. */
const ThermoProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp((pp.frac as number | undefined) ?? 0.7);
  const label = (pp.label as string | undefined) ?? '';
  const col = pp.color === 'cyan' ? PALETTE.cyan : PALETTE.red;
  const fillH = 92 * frac * easeOut(p) + Math.sin(t / 9) * 2;

  return (
    <g transform={`scale(${popScale(t)})`}>
      <Glow x={0} y={36} r={80} kind={col === PALETTE.cyan ? 'cool' : 'red'} o={0.35} />
      <rect x={-16} y={-68} width={32} height={110} rx={16} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={44} r={24} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <rect x={-8} y={40 - fillH} width={16} height={fillH + 4} rx={8} fill={col} />
      <circle cx={0} cy={44} r={15} fill={col} />
      {[-44, -22, 0, 22].map((ty, i) => (
        <line key={i} x1={12} y1={ty} x2={22} y2={ty} stroke={PALETTE.cream} strokeWidth={3} strokeLinecap="round" />
      ))}
      {label ? (
        <text y={92} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={16} fill={PALETTE.cream}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

const HEX_OFFSETS: [number, number][] = [
  [0, -24], [-21, -12], [21, -12], [-21, 12], [21, 12], [0, 24],
];

/** 12. webb: JWST gold hexagon-segment mirror on dark boom with silver diamond sunshield below. */
const WebbProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const glow = Boolean(pp.glow);
  const bob = Math.sin(t / 20) * 5;

  return (
    <g transform={`translate(0 ${bob}) scale(${popScale(t, s)})`}>
      {glow ? <Glow x={0} y={-16} r={130} kind="warm" o={0.5 + 0.14 * Math.sin(t / 11)} /> : null}
      {/* Layered silver diamond sunshield */}
      <polygon points="0,60 88,36 0,14 -88,36" fill="#9AA7C7" stroke={INK} strokeWidth={4} />
      <polygon points="0,50 82,29 0,9 -82,29" fill="#DCE4F5" stroke={INK} strokeWidth={3.5} />
      {/* Boom & secondary tripod */}
      <rect x={-6} y={-10} width={12} height={36} fill="#2B2642" stroke={INK} strokeWidth={3.5} />
      <path d="M 0 -52 L 34 -18 M -24 6 L 34 -18 M 24 6 L 34 -18" stroke={INK} strokeWidth={4} fill="none" />
      {/* Gold hexagonal primary mirror */}
      <g transform="translate(0 -24)">
        {HEX_OFFSETS.map(([hx, hy], i) => (
          <polygon
            key={i}
            transform={`translate(${hx} ${hy})`}
            points="0,-13 11,-6 11,6 0,13 -11,6 -11,-6"
            fill="#F4BA3F"
            stroke={INK}
            strokeWidth={3.5}
          />
        ))}
        <polygon points="0,-13 11,-6 11,6 0,13 -11,6 -11,-6" fill="#231F36" stroke={INK} strokeWidth={3.5} />
      </g>
    </g>
  );
};

/** 13. grain: faceted dust crystal (silica cream-pink | carbon charcoal | mag green) with sparkle. */
const GrainProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const glow = Boolean(pp.glow);
  const type = pp.type === 'carbon' || pp.type === 'mag' || pp.type === 'silica' ? pp.type : 'silica';
  const pal =
    type === 'carbon'
      ? { a: '#353747', b: '#5A5F78', hi: '#93B4E0', glow: 'cool' as const }
      : type === 'mag'
        ? { a: '#3FB376', b: '#7CE8AB', hi: '#C9FFE2', glow: 'cool' as const }
        : { a: '#EEBEC4', b: '#FADEE2', hi: '#FFF6F7', glow: 'warm' as const };
  const rot = Math.sin(t / 22) * 8;
  const spk = 0.65 + 0.35 * Math.sin(t / 7);

  return (
    <g transform={`rotate(${rot}) scale(${popScale(t, s)})`}>
      {glow ? <Glow x={0} y={0} r={115} kind={pal.glow} o={0.58 + 0.16 * Math.sin(t / 8)} /> : null}
      <polygon points="0,-52 38,-14 26,42 -28,44 -42,-10" fill={pal.a} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <polygon points="0,-52 38,-14 2,6 -42,-10" fill={pal.b} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <polyline points="0,-52 2,6 26,42" fill="none" stroke={pal.hi} strokeWidth={3} strokeLinecap="round" />
      {glow ? (
        <path
          transform={`translate(36 -38) scale(${spk})`}
          d="M 0 -14 L 3.5 -3.5 L 14 0 L 3.5 3.5 L 0 14 L -3.5 3.5 L -14 0 L -3.5 -3.5 Z"
          fill="#FFFFFF"
        />
      ) : null}
    </g>
  );
};

/** 14. ironball: dull-grey iron sphere with faint rust sheen, Fe mark, and optional heat bloom. */
const IronballProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = (pp.s as number | undefined) ?? 1;
  const glow = Boolean(pp.glow);
  const pulse = 1 + (glow ? 0.03 * Math.sin(t / 7) : 0);

  return (
    <g transform={`scale(${popScale(t, s * pulse)})`}>
      {glow ? <Glow x={0} y={0} r={118} kind="red" o={0.62 + 0.2 * Math.sin(t / 8)} /> : null}
      <circle cx={0} cy={0} r={48} fill="#666978" stroke={INK} strokeWidth={4} />
      <path d="M 16 -44 A 46 46 0 0 1 18 44 A 34 44 0 0 0 16 -44 Z" fill="#464854" />
      <ellipse cx={-16} cy={-16} rx={20} ry={12} fill="#9C5E49" opacity={0.45} />
      <path d="M -28 -26 A 36 36 0 0 1 8 -36" fill="none" stroke="#C5C9D6" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <text y={10} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={28} fill={PALETTE.cream}>
        Fe
      </text>
    </g>
  );
};

/** 15. tag: outlined cream tag on a colored string with underline and FONTS.ui label. */
const TagProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = ((pp.text as string | undefined) ?? 'LABEL').slice(0, 12);
  const col = propColor(pp.color);
  const w = Math.max(128, text.length * 14 + 42);
  const swing = Math.sin(t / 15) * 4;

  return (
    <g transform={`rotate(${swing}) scale(${popScale(t)})`}>
      <line x1={0} y1={-66} x2={0} y2={-24} stroke={col} strokeWidth={4} strokeLinecap="round" />
      <rect x={-w / 2} y={-28} width={w} height={58} rx={12} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={-16} r={5} fill="#252136" stroke={col} strokeWidth={2.5} />
      <text y={14} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.pill}>
        {text}
      </text>
      <line x1={-w / 2 + 16} y1={21} x2={w / 2 - 16} y2={21} stroke={col} strokeWidth={3.5} strokeLinecap="round" />
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
  _probe_old: ProbeOldProp,
  thermo: ThermoProp,
  webb: WebbProp,
  grain: GrainProp,
  ironball: IronballProp,
  tag: TagProp,
};
