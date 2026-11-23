import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeOut, easeInOut, backOut } from '../../engine/anim';
import { Glow } from '../../engine/light';
import type { PropProps } from './render';
import { OUT, numParam } from './sets-shared';

const accentColor = (c: unknown, fallback = PALETTE.gold): string =>
  c === 'red' ? PALETTE.red : c === 'cyan' ? PALETTE.cyan : c === 'gold' ? PALETTE.gold : fallback;

/** Big flat flip-counter panel with thousands separators and label underneath. */
export const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = numParam(pp.from, 0);
  const to = numParam(pp.to, 0);
  const col = accentColor(pp.color, PALETTE.gold);
  const label = typeof pp.label === 'string' ? pp.label : '';
  const pop = backOut(clamp(t / 8));
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.85))));
  const str = val.toLocaleString('en-US');
  const w = Math.max(240, str.length * 46 + 96);
  const led = 0.55 + 0.45 * Math.sin(t * 0.2);

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={0} r={140} kind={pp.color === 'red' ? 'red' : pp.color === 'cyan' ? 'cool' : 'warm'} o={0.28} />
      <rect x={-w / 2} y={-68} width={w} height={136} rx={16} fill="#1E1B2E" stroke={OUT} strokeWidth={4} />
      <rect x={-w / 2 + 12} y={-56} width={w - 24} height={82} rx={10} fill="#12101F" stroke={col} strokeWidth={3} />
      <line x1={-w / 2 + 16} y1={-15} x2={w / 2 - 16} y2={-15} stroke="#28233C" strokeWidth={2.5} />
      <text x={0} y={8} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={58} fill={PALETTE.cream}>
        {str}
      </text>
      <circle cx={w / 2 - 22} cy={46} r={5} fill={col} opacity={led} />
      {label ? (
        <text x={0} y={52} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={col}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** Round analogue clock face with sweeping single hand and optional gold bloom. */
export const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = numParam(pp.from, 0);
  const to = numParam(pp.to, 12);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 8));
  const hours = lerp(from, to, easeInOut(clamp(p / 0.88)));
  const deg = (hours / 12) * 360 + Math.sin(t * 0.12) * 1.2;

  return (
    <g transform={`scale(${pop})`}>
      {glow ? <Glow x={0} y={0} r={150} kind="warm" o={0.42 + 0.14 * Math.sin(t * 0.15)} /> : null}
      <circle r={76} fill="#2A273D" stroke={OUT} strokeWidth={4} />
      <circle r={66} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.sin(a) * 50}
            y1={-Math.cos(a) * 50}
            x2={Math.sin(a) * 58}
            y2={-Math.cos(a) * 58}
            stroke={OUT}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
          />
        );
      })}
      <g transform={`rotate(${deg})`}>
        <line x1={0} y1={10} x2={0} y2={-44} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={-32} x2={0} y2={-46} stroke={PALETTE.red} strokeWidth={4} strokeLinecap="round" />
      </g>
      <circle r={7} fill={PALETTE.gold} stroke={OUT} strokeWidth={3} />
    </g>
  );
};

/** Horizontal progress bar with 4 px outline, animated fill to pp.frac, and label above. */
export const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(numParam(pp.frac, 0.5));
  const col = accentColor(pp.color, PALETTE.gold);
  const label = typeof pp.label === 'string' ? pp.label : '';
  const pop = backOut(clamp(t / 8));
  const w = 320;
  const h = 42;
  const fillW = Math.max(8, (w - 12) * lerp(0, frac, easeOut(clamp(p / 0.78))));
  const sheen = 0.75 + 0.25 * Math.sin(t * 0.18);

  return (
    <g transform={`scale(${pop})`}>
      {label ? (
        <text x={0} y={-34} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={22} fill={PALETTE.cream}>
          {label}
        </text>
      ) : null}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#1E1B2E" stroke={OUT} strokeWidth={4} />
      <rect x={-w / 2 + 6} y={-h / 2 + 6} width={fillW} height={h - 12} rx={8} fill={col} opacity={sheen} />
      {[0.25, 0.5, 0.75].map((tick) => (
        <line key={tick} x1={-w / 2 + w * tick} y1={-h / 2 + 4} x2={-w / 2 + w * tick} y2={h / 2 - 4} stroke={OUT} strokeWidth={2.5} opacity={0.45} />
      ))}
    </g>
  );
};

/** Thick outlined curved arrow that draws on across the shot. */
export const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = accentColor(pp.color, PALETTE.gold);
  const draw = easeOut(clamp(p / 0.75));
  const lenPath = 230;
  const bob = Math.sin(t * 0.1) * 3;
  const headS = backOut(clamp((p - 0.55) / 0.25));

  return (
    <g transform={`translate(0 ${bob})`}>
      <path
        d="M -95 40 Q -5 -58 88 -12"
        fill="none"
        stroke={OUT}
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={lenPath}
        strokeDashoffset={lenPath * (1 - draw)}
      />
      <path
        d="M -95 40 Q -5 -58 88 -12"
        fill="none"
        stroke={col}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={lenPath}
        strokeDashoffset={lenPath * (1 - draw)}
      />
      <g transform={`translate(90 -11) rotate(26) scale(${headS})`}>
        <polygon points="18,0 -16,-16 -10,0 -16,16" fill={col} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** Round outlined cream badge with green check mark + sparkle, or red cross if pp.bad. */
export const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = Boolean(pp.bad);
  const pop = backOut(clamp(t / 8));
  const bob = Math.sin(t * 0.09) * 3;
  const spS = 0.7 + 0.3 * Math.sin(t * 0.24);

  return (
    <g transform={`translate(0 ${bob}) scale(${pop})`}>
      <Glow x={0} y={0} r={110} kind={bad ? 'red' : 'cool'} o={0.34} />
      <circle r={56} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      {bad ? (
        <path d="M -22 -22 L 22 22 M 22 -22 L -22 22" fill="none" stroke={PALETTE.red} strokeWidth={11} strokeLinecap="round" />
      ) : (
        <path d="M -24 2 L -6 20 L 26 -18" fill="none" stroke={PALETTE.green} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      )}
      <g transform={`translate(50 -46) scale(${spS})`}>
        <path d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill={PALETTE.gold} stroke={OUT} strokeWidth={2.5} />
      </g>
    </g>
  );
};

/** Small wall calendar page, cream with red top strip and date in FONTS.title. */
export const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const txt = typeof pp.text === 'string' ? pp.text.slice(0, 8) : '';
  const pop = backOut(clamp(t / 8));
  const sway = Math.sin(t * 0.08) * 2.5;
  const fs = txt.length > 6 ? 32 : txt.length > 4 ? 38 : 46;

  return (
    <g transform={`rotate(${sway}) scale(${pop})`}>
      <ellipse cx={6} cy={84} rx={70} ry={10} fill="#000" opacity={0.3} />
      <rect x={-88} y={-74} width={176} height={152} rx={14} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      <path d="M -88 -60 A 14 14 0 0 1 -74 -74 L 74 -74 A 14 14 0 0 1 88 -60 L 88 -34 L -88 -34 Z" fill={PALETTE.red} stroke={OUT} strokeWidth={4} />
      {/* Ring clips */}
      {[-44, 44].map((rx) => (
        <rect key={rx} x={rx - 6} y={-88} width={12} height={24} rx={5} fill="#8E97AE" stroke={OUT} strokeWidth={3.5} />
      ))}
      <text x={0} y={32} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={fs} fill={PALETTE.pill}>
        {txt}
      </text>
    </g>
  );
};

/** Outlined magnifying glass with cream handle, pale lens and optional cyan bloom. */
export const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 8)) * sc;
  const sx = Math.sin(t * 0.06) * 5;
  const sy = Math.cos(t * 0.05) * 4;

  return (
    <g transform={`translate(${sx} ${sy}) scale(${pop})`}>
      <g transform="rotate(42)">
        <rect x={-12} y={48} width={24} height={74} rx={10} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      </g>
      {glow ? <Glow x={0} y={0} r={115} kind="cool" o={0.52 + 0.14 * Math.sin(t * 0.18)} /> : null}
      <circle r={54} fill="#8ADFFF" opacity={0.28} />
      <circle r={54} fill="none" stroke="#6E7892" strokeWidth={12} />
      <circle r={60} fill="none" stroke={OUT} strokeWidth={4} />
      <circle r={48} fill="none" stroke={OUT} strokeWidth={3.5} />
      <path d="M -26 -24 A 34 34 0 0 1 12 -36" fill="none" stroke={PALETTE.cream} strokeWidth={5} strokeLinecap="round" opacity={0.75} />
    </g>
  );
};

/** Pulsing cyan circle outline with soft bloom that expands and fades each second. */
export const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const u1 = (t % 30) / 30;
  const u2 = ((t + 15) % 30) / 30;

  return (
    <g transform={`scale(${sc})`}>
      <Glow x={0} y={0} r={96} kind="cool" o={0.32} />
      {[u1, u2].map((u, i) => (
        <circle
          key={i}
          r={22 + u * 64}
          fill="none"
          stroke={PALETTE.cyan}
          strokeWidth={4}
          opacity={(1 - u) * 0.85}
        />
      ))}
    </g>
  );
};
