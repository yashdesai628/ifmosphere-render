import React from 'react';
import type { PropProps, Registry } from './render';
import { BrandLabel, FONTS, PALETTE } from '../../brand';
import { Glow } from '../../engine/light';
import { backOut, clamp, easeInOut, easeOut, lerp } from '../../engine/anim';

const DARK_OUTLINE = '#121019';

const propColor = (c: unknown, fallback = PALETTE.gold) => {
  if (c === 'red') return PALETTE.red;
  if (c === 'cyan') return PALETTE.cyan;
  if (c === 'gold') return PALETTE.gold;
  if (c === 'orange') return PALETTE.orange;
  if (c === 'green') return PALETTE.green;
  return fallback;
};

/** 1. DART spacecraft icon */
const DartProp: React.FC<PropProps> = ({ t, pp }) => {
  const pop = backOut(clamp(t / 7));
  const sc = pop * Number(pp.s ?? 1);
  const bob = Math.sin(t / 13) * 5;
  const tilt = Math.sin(t / 21) * 2.5;
  const glint = ((t * 0.03) % 2) - 0.5;
  const flame = Boolean(pp.flame);
  const thrusterFlicker = 0.85 + 0.15 * Math.sin(t * 1.7);

  return (
    <g transform={`translate(0 ${bob}) rotate(${tilt}) scale(${sc})`}>
      {/* Ion thruster plume */}
      {flame ? (
        <g>
          <Glow x={-72} y={0} r={85} kind="cool" o={0.75} />
          <path
            d={`M -34 -12 Q ${-95 * thrusterFlicker} -5 ${-132 * thrusterFlicker} 0 Q ${-95 * thrusterFlicker} 5 -34 12 Z`}
            fill="#4DE8FF"
            opacity={0.78}
          />
          <path d={`M -34 -6 Q ${-70 * thrusterFlicker} 0 ${-92 * thrusterFlicker} 0 Q ${-70 * thrusterFlicker} 0 -34 6 Z`} fill="#E6FCFF" />
        </g>
      ) : null}

      {/* Two long gold solar-array wings */}
      {[-1, 1].map((dir) => (
        <g key={dir} transform={`translate(0 ${dir * 32})`}>
          <rect x={-18} y={dir > 0 ? 0 : -118} width={36} height={118} rx={4} fill="#F2B33D" stroke={DARK_OUTLINE} strokeWidth={4} />
          <rect x={2} y={dir > 0 ? 2 : -116} width={14} height={114} fill="#C6861B" opacity={0.65} />
          {[-90, -60, -30, 30, 60, 90].filter((y) => (dir > 0 ? y > 0 : y < 0)).map((y) => (
            <line key={y} x1={-16} y1={y} x2={16} y2={y} stroke="#7A4F0A" strokeWidth={2.5} opacity={0.75} />
          ))}
          {/* Specular panel glint */}
          {glint >= 0 && glint <= 1 ? (
            <line
              x1={-15}
              y1={dir > 0 ? 12 + glint * 92 : -106 + glint * 92}
              x2={15}
              y2={dir > 0 ? 2 + glint * 92 : -116 + glint * 92}
              stroke="#FFF6C9"
              strokeWidth={4}
              opacity={0.75}
            />
          ) : null}
        </g>
      ))}

      {/* Boxy silver body */}
      <rect x={-36} y={-32} width={72} height={64} rx={8} fill="#C2CCE0" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={-36} y={6} width={72} height={26} rx={6} fill="#8793AF" />
      <line x1={-32} y1={-26} x2={30} y2={-26} stroke="#FFFFFF" strokeWidth={3} opacity={0.75} />

      {/* Dish antenna */}
      <path d="M -26 -30 L -38 -46 M -48 -42 Q -38 -56 -24 -42" fill="none" stroke="#DCE4F4" strokeWidth={4} strokeLinecap="round" />

      {/* Tiny camera eye (DRACO) */}
      <circle cx={26} cy={0} r={12} fill="#1E2338" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      <circle cx={26} cy={0} r={6} fill="#56C2F0" />
      <circle cx={24} cy={-2} r={2} fill="#FFFFFF" />
      <Glow x={26} y={0} r={44} kind="cool" o={0.4} />
    </g>
  );
};

/** 2. ESA Hera spacecraft icon */
const HeraProp: React.FC<PropProps> = ({ t, pp }) => {
  const pop = backOut(clamp(t / 7));
  const sc = pop * Number(pp.s ?? 1);
  const bob = Math.cos(t / 14) * 5;
  const tilt = Math.sin(t / 23) * 2;

  return (
    <g transform={`translate(0 ${bob}) rotate(${tilt}) scale(${sc})`}>
      {/* Two blue-grey solar panels */}
      {[-1, 1].map((dir) => (
        <g key={dir}>
          <rect x={dir > 0 ? 34 : -134} y={-24} width={100} height={48} rx={4} fill="#5073A1" stroke={DARK_OUTLINE} strokeWidth={4} />
          <rect x={dir > 0 ? 36 : -132} y={4} width={96} height={18} fill="#344E73" opacity={0.7} />
          {[0.25, 0.5, 0.75].map((f) => {
            const lx = dir > 0 ? 34 + f * 100 : -134 + f * 100;
            return <line key={f} x1={lx} y1={-22} x2={lx} y2={22} stroke="#88AEDF" strokeWidth={2.5} opacity={0.75} />;
          })}
        </g>
      ))}
      {/* White boxy bus */}
      <rect x={-34} y={-34} width={68} height={68} rx={8} fill="#F2F4FA" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={6} y={-32} width={26} height={64} rx={5} fill="#CFD7E8" />
      {/* Gold foil accent strip */}
      <rect x={-32} y={14} width={64} height={14} fill="#F2B33D" stroke={DARK_OUTLINE} strokeWidth={3} />
      {/* High-gain top dish */}
      <path d="M 0 -34 L 0 -48 M -20 -46 Q 0 -62 20 -46" fill="none" stroke="#DCE4F4" strokeWidth={4} strokeLinecap="round" />
      {/* Camera eye */}
      <circle cx={14} cy={-8} r={11} fill="#1E2338" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      <circle cx={14} cy={-8} r={5.5} fill="#4DE8FF" />
      <circle cx={12} cy={-10} r={2} fill="#FFFFFF" />
      <Glow x={14} y={-8} r={48} kind="cool" o={0.45} />
    </g>
  );
};

/** 3. Asteroid rock icon with optional orbiting moon & label */
const RockProp: React.FC<PropProps> = ({ t, pp }) => {
  const pop = backOut(clamp(t / 7));
  const rot = Math.sin(t / 22) * 4;
  const moon = Boolean(pp.moon);
  const label = pp.label ? String(pp.label) : '';
  const mAng = t * 0.045;

  return (
    <g transform={`scale(${pop})`}>
      {moon ? (
        <ellipse cx={0} cy={0} rx={110} ry={44} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.5} />
      ) : null}
      <g transform={`rotate(${rot})`}>
        <path
          d="M -64 -24 L -32 -60 L 24 -56 L 68 -18 L 62 34 L 16 58 L -44 50 L -70 12 Z"
          fill="#808599"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d="M 10 -52 L 64 -16 L 58 32 L 16 54 Q 24 0 10 -52 Z" fill="#54596D" opacity={0.75} />
        <path d="M -58 8 L -59 -21 L -30 -54" fill="none" stroke="#CFD7ED" strokeWidth={3.5} opacity={0.8} />
        <ellipse cx={-22} cy={-16} rx={15} ry={10} fill="#5C6176" stroke={DARK_OUTLINE} strokeWidth={3} />
        <ellipse cx={22} cy={14} rx={17} ry={11} fill="#44485B" stroke={DARK_OUTLINE} strokeWidth={3} />
        <circle cx={-8} cy={26} r={8} fill="#5C6176" stroke={DARK_OUTLINE} strokeWidth={2.5} />
      </g>
      {moon ? (
        <g transform={`translate(${Math.cos(mAng) * 110} ${Math.sin(mAng) * 44})`}>
          <circle r={15} fill="#A3AAC0" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        </g>
      ) : null}
      {label ? <BrandLabel x={0} y={102} t={t} text={label} size={28} color={PALETTE.cream} /> : null}
    </g>
  );
};

/** 4. Flat flip-digit counter panel */
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const pop = backOut(clamp(t / 7));
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 100);
  const col = propColor(pp.color, PALETTE.gold);
  const glowKind = pp.color === 'red' ? 'red' : pp.color === 'cyan' ? 'cool' : 'warm';
  const label = pp.label ? String(pp.label) : '';
  const hasDec = !Number.isInteger(from) || !Number.isInteger(to);
  const cur = lerp(from, to, easeOut(clamp(p / 0.78)));
  const textVal = hasDec ? cur.toFixed(1) : Math.round(cur).toLocaleString('en-US');

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={220} kind={glowKind} o={0.35} />
      <rect x={-172} y={-76} width={344} height={152} rx={20} fill="#1E1B2E" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={-162} y={-66} width={324} height={132} rx={14} fill="none" stroke={col} strokeWidth={2.5} opacity={0.75} />
      {/* Flip-digit split hairline */}
      <line x1={-152} y1={-4} x2={152} y2={-4} stroke="#0B0914" strokeWidth={3} opacity={0.65} />
      <text
        x={0}
        y={18}
        textAnchor="middle"
        fontFamily={FONTS.title}
        fontWeight={800}
        fontSize={68}
        fill={PALETTE.cream}
        letterSpacing={2}
      >
        {textVal}
      </text>
      {label ? (
        <text
          x={0}
          y={54}
          textAnchor="middle"
          fontFamily={FONTS.ui}
          fontSize={22}
          fill={col}
          letterSpacing={2.5}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 5. Round analogue clock face */
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const pop = backOut(clamp(t / 7));
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 12);
  const glow = Boolean(pp.glow);
  // Treat sub-hour values (like 0.55 = 33 min) as minute-hand sweeps (360 deg/hr) so 33 min reads clearly
  const degPerUnit = Math.abs(to - from) <= 1.2 ? 360 : 30;
  const curVal = lerp(from, to, easeInOut(clamp(p / 0.85)));
  const ang = curVal * degPerUnit;

  return (
    <g transform={`scale(${pop})`}>
      {glow ? <Glow x={0} y={0} r={165} kind="warm" o={0.68} /> : null}
      <circle r={96} fill="#2A2E47" stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle r={82} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      {glow ? <circle r={86} fill="none" stroke={PALETTE.gold} strokeWidth={3.5} opacity={0.8} /> : null}
      {/* 12 dial ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const r0 = i % 3 === 0 ? 60 : 67;
        return (
          <line
            key={i}
            x1={Math.sin(a) * r0}
            y1={-Math.cos(a) * r0}
            x2={Math.sin(a) * 76}
            y2={-Math.cos(a) * 76}
            stroke={DARK_OUTLINE}
            strokeWidth={i % 3 === 0 ? 4.5 : 2.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Sweeping single hand */}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={14} x2={0} y2={-58} stroke={DARK_OUTLINE} strokeWidth={7} strokeLinecap="round" />
        <line x1={0} y1={-36} x2={0} y2={-58} stroke={glow ? PALETTE.orange : PALETTE.cyan} strokeWidth={4} strokeLinecap="round" />
      </g>
      <circle r={8} fill={glow ? PALETTE.orange : DARK_OUTLINE} />
    </g>
  );
};

/** 6. Round outlined stopwatch with red top button & counting digits */
const StopwatchProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const pop = backOut(clamp(t / 7));
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 60);
  const prog = easeInOut(clamp(p / 0.88));
  const curMin = lerp(from, to, prog);
  const ang = curMin * 6;
  const press = p < 0.12 ? 4 * Math.sin((p / 0.12) * Math.PI) : 0;

  return (
    <g transform={`scale(${pop})`}>
      {/* Side & top buttons */}
      <g transform={`translate(56 -68) rotate(38)`}>
        <rect x={-9} y={-14} width={18} height={18} rx={3} fill="#9BA5BE" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      </g>
      <g transform={`translate(0 ${press})`}>
        <rect x={-10} y={-108} width={20} height={18} fill="#A7B1C8" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        <rect x={-22} y={-124} width={44} height={20} rx={6} fill="#E8414E" stroke={DARK_OUTLINE} strokeWidth={4} />
      </g>
      {/* Dial */}
      <circle r={94} fill="#313652" stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle r={80} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={Math.sin(a) * 63}
            y1={-Math.cos(a) * 63}
            x2={Math.sin(a) * 74}
            y2={-Math.cos(a) * 74}
            stroke={DARK_OUTLINE}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
          />
        );
      })}
      {/* Small inset digital readout */}
      <rect x={-36} y={24} width={72} height={30} rx={6} fill="#1E1B2E" stroke={DARK_OUTLINE} strokeWidth={3} />
      <text x={0} y={46} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream}>
        {`${Math.round(curMin)}`.padStart(2, '0')}
      </text>
      {/* Sweeping hand */}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={14} x2={0} y2={-62} stroke="#E8414E" strokeWidth={5.5} strokeLinecap="round" />
      </g>
      <circle r={8} fill={DARK_OUTLINE} />
    </g>
  );
};

/** 7. Horizontal progress bar */
const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const pop = backOut(clamp(t / 7));
  const targetFrac = clamp(Number(pp.frac ?? 1));
  const fillFrac = targetFrac * easeOut(clamp(p / 0.78));
  const col = propColor(pp.color, PALETTE.gold);
  const glowKind = pp.color === 'red' ? 'red' : pp.color === 'cyan' ? 'cool' : 'warm';
  const label = pp.label ? String(pp.label) : '';
  const bw = 430;
  const bh = 52;
  const fillW = Math.max(0, (bw - 8) * fillFrac);

  return (
    <g transform={`scale(${pop})`}>
      {label ? (
        <text x={0} y={-44} textAnchor="middle" fontFamily={FONTS.ui} fontSize={26} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <Glow x={-bw / 2 + fillW} y={0} r={90} kind={glowKind} o={0.45} />
      <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={16} fill="#1E1B2E" stroke={DARK_OUTLINE} strokeWidth={4} />
      {fillW > 2 ? (
        <g>
          <rect x={-bw / 2 + 4} y={-bh / 2 + 4} width={fillW} height={bh - 8} rx={12} fill={col} />
          <rect x={-bw / 2 + 8} y={-bh / 2 + 8} width={Math.max(0, fillW - 10)} height={10} rx={5} fill="#FFFFFF" opacity={0.35} />
        </g>
      ) : null}
      <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={16} fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
    </g>
  );
};

/** 8. Thick outlined curved arrow drawing on across shot */
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const pop = backOut(clamp(t / 6));
  const col = propColor(pp.color, PALETTE.gold);
  const glowKind = pp.color === 'red' ? 'red' : pp.color === 'cyan' ? 'cool' : 'warm';
  const draw = easeOut(clamp(p / 0.72));
  const pathLen = 305;
  const headScale = backOut(clamp((p - 0.45) / 0.3));

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={20} y={-10} r={140} kind={glowKind} o={0.35} />
      <path
        d="M -135 55 Q -25 -55 115 -18"
        fill="none"
        stroke={DARK_OUTLINE}
        strokeWidth={22}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - draw)}
      />
      <path
        d="M -135 55 Q -25 -55 115 -18"
        fill="none"
        stroke={col}
        strokeWidth={13}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - draw)}
      />
      <g transform={`translate(115 -18) rotate(14) scale(${headScale})`}>
        <polygon points="-14,-24 34,0 -14,24 -4,0" fill={col} stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** 9. Green check mark badge (or red cross when pp.bad true) */
const FlagProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const pop = backOut(clamp(t / 7));
  const bad = Boolean(pp.bad);
  const col = bad ? PALETTE.red : PALETTE.green;
  const draw = easeOut(clamp((p - 0.1) / 0.45));
  const tw = 0.6 + 0.4 * Math.sin(t / 6);

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={115} kind={bad ? 'red' : 'cool'} o={0.5} />
      <circle r={58} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle r={46} fill="none" stroke={col} strokeWidth={5} opacity={0.85} />
      {bad ? (
        <path
          d="M -20 -20 L 20 20 M 20 -20 L -20 20"
          fill="none"
          stroke={col}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={120}
          strokeDashoffset={120 * (1 - draw)}
        />
      ) : (
        <path
          d="M -22 2 L -6 19 L 25 -17"
          fill="none"
          stroke={col}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={80}
          strokeDashoffset={80 * (1 - draw)}
        />
      )}
      {/* Tiny sparkle */}
      <g transform={`translate(48 -46) scale(${tw}) rotate(${t * 1.5})`}>
        <path d="M 0 -14 L 3 -3 L 14 0 L 3 3 L 0 14 L -3 3 L -14 0 L -3 -3 Z" fill={PALETTE.gold} stroke={DARK_OUTLINE} strokeWidth={2} />
      </g>
    </g>
  );
};

/** 10. Hand-painted sign on a post */
const SignProp: React.FC<PropProps> = ({ t, pp }) => {
  const pop = backOut(clamp(t / 7));
  const txt = String(pp.text ?? 'SIGN').slice(0, 12);
  const sway = Math.sin(t / 18) * 1.5;

  return (
    <g transform={`scale(${pop}) rotate(${sway})`}>
      <rect x={-10} y={24} width={20} height={96} rx={4} fill="#5C4A3F" stroke={DARK_OUTLINE} strokeWidth={4} />
      <g transform="rotate(-2)">
        <rect x={-125} y={-44} width={250} height={82} rx={12} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
        <circle cx={-105} cy={-26} r={4} fill={DARK_OUTLINE} />
        <circle cx={105} cy={-26} r={4} fill={DARK_OUTLINE} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONTS.hand} fontSize={36} fill={PALETTE.pill}>
          {txt}
        </text>
      </g>
    </g>
  );
};

/** 11. Wall calendar page with red top strip */
const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const pop = backOut(clamp(t / 7));
  const txt = String(pp.text ?? '').slice(0, 8);
  const curl = Math.sin(t / 11) * 4;

  return (
    <g transform={`scale(${pop})`}>
      {/* Stacked backing page */}
      <rect x={-86} y={-88} width={178} height={192} rx={16} fill="#C6BEAE" stroke={DARK_OUTLINE} strokeWidth={4} />
      {/* Front cream page */}
      <rect x={-90} y={-96} width={180} height={196} rx={16} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      {/* Red top strip */}
      <path
        d="M -90 -44 L -90 -80 Q -90 -96 -74 -96 L 74 -96 Q 90 -96 90 -80 L 90 -44 Z"
        fill="#E8414E"
        stroke={DARK_OUTLINE}
        strokeWidth={4}
      />
      {/* Binder rings */}
      {[-44, 44].map((rx) => (
        <rect key={rx} x={rx - 7} y={-112} width={14} height={32} rx={6} fill="#9AA4BD" stroke={DARK_OUTLINE} strokeWidth={3.5} />
      ))}
      {/* Curled corner hint */}
      <path d={`M 58 100 L 90 ${68 + curl} L 90 100 Z`} fill="#DFD5C3" stroke={DARK_OUTLINE} strokeWidth={3} />
      <text x={0} y={40} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={42} fill={PALETTE.pill}>
        {txt}
      </text>
    </g>
  );
};

export const PROPS: Registry['props'] = {
  dart: DartProp,
  hera: HeraProp,
  rock: RockProp,
  counter: CounterProp,
  clock: ClockProp,
  stopwatch: StopwatchProp,
  bar: BarProp,
  arrow: ArrowProp,
  flag: FlagProp,
  sign: SignProp,
  calendar: CalendarProp,
};
