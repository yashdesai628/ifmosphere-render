import React from 'react';
import { PropProps } from './render';
import { PALETTE, FONTS } from '../../brand';
import { backOut, clamp, easeInOut, easeOut, lerp, settle } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { DARK_LINE, FreedomShipVector, getGlowTheme, HeliSprite } from './sets-helpers';

const propColor = (c: unknown, fallback = PALETTE.gold): string => {
  if (c === 'red') return PALETTE.red;
  if (c === 'cyan') return PALETTE.cyan;
  if (c === 'gold') return PALETTE.gold;
  return fallback;
};

const popScale = (t: number, pp: Record<string, unknown>) =>
  backOut(clamp(t / 7)) * ((pp.s as number | undefined) ?? 1);

// 1. counter
export const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = (pp.from as number | undefined) ?? 0;
  const to = (pp.to as number | undefined) ?? 100;
  const label = (pp.label as string | undefined) ?? '';
  const col = propColor(pp.color, PALETTE.gold);
  const val = Math.round(lerp(from, to, easeOut(clamp(p * 1.25))));
  const txt = val.toLocaleString('en-US');
  const w = Math.max(320, txt.length * 46 + 90);
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={200} kind={pp.color === 'cyan' ? 'cool' : pp.color === 'red' ? 'red' : 'warm'} o={0.32} />
      <rect x={-w / 2} y={-74} width={w} height={148} rx={18} fill="#1E1B2E" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-w / 2 + 12} y={-62} width={w - 24} height={8} rx={4} fill={col} />
      <line x1={-w / 2 + 16} y1={4} x2={w / 2 - 16} y2={4} stroke="#0E0C18" strokeWidth={3} />
      <text
        y={24}
        textAnchor="middle"
        fontFamily={FONTS.title}
        fontWeight={800}
        fontSize={68}
        fill={PALETTE.cream}
        letterSpacing={2}
      >
        {txt}
      </text>
      {label ? (
        <text y={108} textAnchor="middle" fontFamily={FONTS.ui} fontSize={24} fill={col} letterSpacing={2.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// 2. clock
export const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = (pp.from as number | undefined) ?? 0;
  const to = (pp.to as number | undefined) ?? 12;
  const glowOn = Boolean(pp.glow);
  const hr = lerp(from, to, easeInOut(clamp(p * 1.15)));
  const ang = (hr / 12) * 360 + settle(t - 18, 6);
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      {glowOn ? <Glow x={0} y={0} r={145} kind="warm" o={0.55} /> : null}
      <circle r={92} fill="#2A263D" stroke={DARK_LINE} strokeWidth={4} />
      <circle r={78} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={-68}
          x2={0}
          y2={i % 3 === 0 ? -55 : -61}
          stroke={DARK_LINE}
          strokeWidth={i % 3 === 0 ? 4 : 2.5}
          strokeLinecap="round"
          transform={`rotate(${i * 30})`}
        />
      ))}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={10} x2={0} y2={-54} stroke={PALETTE.orange} strokeWidth={7} strokeLinecap="round" />
      </g>
      <circle r={8} fill={DARK_LINE} />
    </g>
  );
};

// 3. bar
export const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp((pp.frac as number | undefined) ?? 0.5);
  const label = (pp.label as string | undefined) ?? '';
  const col = propColor(pp.color, PALETTE.gold);
  const w = 360;
  const fillW = (w - 16) * frac * easeOut(clamp(p * 1.25));
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      {label ? (
        <text y={-40} textAnchor="middle" fontFamily={FONTS.ui} fontSize={23} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
      <rect x={-w / 2} y={-24} width={w} height={48} rx={12} fill="#181526" stroke={DARK_LINE} strokeWidth={4} />
      {fillW > 2 ? (
        <rect x={-w / 2 + 8} y={-16} width={fillW} height={32} rx={8} fill={col} />
      ) : null}
      <rect x={-w / 2 + 12} y={-13} width={Math.max(0, fillW - 8)} height={8} rx={4} fill="#FFFFFF" opacity={0.28} />
    </g>
  );
};

// 4. arrow
export const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const col = propColor(pp.color, PALETTE.gold);
  const prog = easeOut(clamp(p * 1.35));
  const tipPop = backOut(clamp((p - 0.35) / 0.25));
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={10} y={-10} r={115} kind={pp.color === 'cyan' ? 'cool' : pp.color === 'red' ? 'red' : 'warm'} o={0.35} />
      <path
        d="M -95 45 Q -18 -38 78 -36"
        fill="none"
        stroke={DARK_LINE}
        strokeWidth={22}
        strokeLinecap="round"
        strokeDasharray="240"
        strokeDashoffset={240 * (1 - prog)}
      />
      <path
        d="M -95 45 Q -18 -38 78 -36"
        fill="none"
        stroke={col}
        strokeWidth={13}
        strokeLinecap="round"
        strokeDasharray="240"
        strokeDashoffset={240 * (1 - prog)}
      />
      <g transform={`translate(78 -36) rotate(8) scale(${tipPop})`}>
        <polygon points="-14,-24 32,0 -14,24 -4,0" fill={col} stroke={DARK_LINE} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

// 5. flag
export const FlagProp: React.FC<PropProps> = ({ t, pp }) => {
  const bad = Boolean(pp.bad);
  const s = popScale(t, pp);
  const wob = bad ? settle(t - 8, 6) : 0;

  return (
    <g transform={`scale(${s}) rotate(${wob})`}>
      <Glow x={0} y={0} r={105} kind={bad ? 'red' : 'cool'} o={0.42} />
      <circle r={58} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      {bad ? (
        <path
          d="M -22 -22 L 22 22 M 22 -22 L -22 22"
          stroke={PALETTE.red}
          strokeWidth={12}
          strokeLinecap="round"
        />
      ) : (
        <g>
          <path
            d="M -24 2 L -6 22 L 28 -20"
            fill="none"
            stroke="#2FB7A6"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="44,-48 48,-36 60,-32 48,-28 44,-16 40,-28 28,-32 40,-36"
            fill={PALETTE.gold}
            opacity={0.5 + 0.5 * Math.sin(t / 6)}
          />
        </g>
      )}
    </g>
  );
};

// 6. calendar
export const CalendarProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = ((pp.text as string | undefined) ?? 'DAY 1').slice(0, 8);
  const s = popScale(t, pp);
  const sway = Math.sin(t / 16) * 2.5;

  return (
    <g transform={`scale(${s}) rotate(${sway})`}>
      <rect x={-78} y={-84} width={156} height={168} rx={14} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <path d="M -78 -38 L 78 -38 L 78 -70 Q 78 -84 64 -84 L -64 -84 Q -78 -84 -78 -70 Z" fill="#E8414E" stroke={DARK_LINE} strokeWidth={4} />
      {[-40, 40].map((rx, i) => (
        <rect key={i} x={rx - 7} y={-98} width={14} height={28} rx={7} fill="#96A0B5" stroke={DARK_LINE} strokeWidth={3.5} />
      ))}
      <text y={34} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={36} fill={PALETTE.pill}>
        {text}
      </text>
    </g>
  );
};

// 7. magnifier
export const MagnifierProp: React.FC<PropProps> = ({ t, pp }) => {
  const glowOn = Boolean(pp.glow);
  const s = popScale(t, pp);
  const driftX = Math.sin(t / 18) * 6;
  const driftY = Math.cos(t / 22) * 5;

  return (
    <g transform={`translate(${driftX} ${driftY}) scale(${s}) rotate(-32)`}>
      {glowOn ? <Glow x={0} y={-18} r={110} kind="cool" o={0.55} /> : null}
      <rect x={-12} y={42} width={24} height={86} rx={10} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={0} cy={-18} r={58} fill="#72E9FF" fillOpacity={0.28} stroke="#B8C2D6" strokeWidth={12} />
      <circle cx={0} cy={-18} r={62} fill="none" stroke={DARK_LINE} strokeWidth={4} />
      <path d="M -28 -44 A 40 40 0 0 1 12 -52" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />
    </g>
  );
};

// 8. ring
export const RingProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const cyc = (t % 30) / 30;
  const r = lerp(24, 118, easeOut(cyc));
  const o = 1 - cyc;

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={120} kind="cool" o={0.35 * o} />
      <circle r={r} fill="none" stroke={PALETTE.cyan} strokeWidth={4} opacity={o} />
      <circle r={lerp(18, 92, easeOut((cyc + 0.5) % 1))} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} opacity={1 - ((cyc + 0.5) % 1)} />
    </g>
  );
};

// 9. scale
export const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const label = (pp.label as string | undefined) ?? '';
  const s = popScale(t, pp);
  const tip = -13 + Math.sin(t / 15) * 3;

  return (
    <g transform={`scale(${s})`}>
      <rect x={-48} y={64} width={96} height={18} rx={6} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-8} y={-52} width={16} height={116} rx={4} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <g transform={`translate(0 -46) rotate(${tip})`}>
        <rect x={-88} y={-6} width={176} height={12} rx={6} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
        {[-76, 76].map((px, i) => (
          <g key={i} transform={`translate(${px} 6) rotate(${-tip})`}>
            <line x1={0} y1={0} x2={-22} y2={48} stroke={DARK_LINE} strokeWidth={3} />
            <line x1={0} y1={0} x2={22} y2={48} stroke={DARK_LINE} strokeWidth={3} />
            <path d="M -30 48 Q 0 66 30 48 Z" fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={4} />
          </g>
        ))}
      </g>
      {label ? (
        <text y={114} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// 10. _probe_old (BepiColombo stack icon)
export const ProbeOldProp: React.FC<PropProps> = ({ t, pp }) => {
  const glowOn = Boolean(pp.glow);
  const s = popScale(t, pp);

  return (
    <g transform={`translate(0 ${Math.sin(t / 16) * 4}) scale(${s})`}>
      {glowOn ? (
        <g>
          <Glow x={0} y={88} r={80} kind="warm" o={0.65} />
          <polygon points="-14,62 0,112 14,62" fill="#FF8C3D" />
        </g>
      ) : null}
      {/* Two dark solar wings */}
      <rect x={-124} y={-8} width={86} height={32} rx={4} fill="#253463" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={38} y={-8} width={86} height={32} rx={4} fill="#253463" stroke={DARK_LINE} strokeWidth={4} />
      {/* Gold foil box body */}
      <rect x={-38} y={-24} width={76} height={86} rx={6} fill="#E6A63A" stroke={DARK_LINE} strokeWidth={4} />
      {/* Grey antenna dish */}
      <circle cx={42} cy={-24} r={18} fill="#9CA5B8" stroke={DARK_LINE} strokeWidth={4} />
      {/* Silver conical sunshield on top */}
      <polygon points="-44,-24 0,-86 44,-24" fill="#D8DFEE" stroke={DARK_LINE} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

// 11. thermo
export const ThermoProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp((pp.frac as number | undefined) ?? 0.5);
  const label = (pp.label as string | undefined) ?? '';
  const col = pp.color === 'cyan' ? PALETTE.cyan : PALETTE.red;
  const fillH = 128 * frac * easeOut(clamp(p * 1.25));
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={76} r={75} kind={pp.color === 'cyan' ? 'cool' : 'red'} o={0.45} />
      <rect x={-18} y={-86} width={36} height={154} rx={18} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={0} cy={76} r={32} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-9} y={56 - fillH} width={18} height={fillH + 14} rx={8} fill={col} />
      <circle cx={0} cy={76} r={22} fill={col} />
      {[-56, -24, 8, 40].map((ty, i) => (
        <line key={i} x1={22} y1={ty} x2={34} y2={ty} stroke={PALETTE.cream} strokeWidth={3} strokeLinecap="round" />
      ))}
      {label ? (
        <text y={138} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={col} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// 12. sr1
export const Sr1Prop: React.FC<PropProps> = ({ t, p, pp }) => {
  const glowOn = Boolean(pp.glow);
  const s = popScale(t, pp) * 0.48;
  const gTheme = getGlowTheme(glowOn ? 'gold' : 'cyan');

  return (
    <g transform={`translate(0 ${Math.sin(t / 18) * 4}) scale(${s})`}>
      <FreedomShipVector
        t={t}
        p={p}
        reactor={glowOn ? 0.88 : 0.15}
        thrust={0.5}
        arrays={1}
        glow={gTheme}
        id={`sr1prop${Math.round(t)}`}
      />
    </g>
  );
};

// 13. heli
export const HeliProp: React.FC<PropProps> = ({ t, pp }) => {
  const spin = Boolean(pp.spin);
  const folded = Boolean(pp.folded);
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      <HeliSprite t={t} folded={folded} spin={spin} scale={1.15} />
    </g>
  );
};

// 14. atom
export const AtomProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const split = easeOut(clamp((p - 0.3) / 0.3));
  const sep = split * 32;
  const neutronX = lerp(-120, -18, clamp(p / 0.3));
  const flash = p >= 0.28 ? Math.max(0, 1 - (p - 0.28) * 2.2) : 0;

  return (
    <g transform={`scale(${s})`}>
      {p >= 0.28 ? <Glow x={0} y={0} r={120} kind="warm" o={0.4 + flash * 0.5} /> : null}
      {p < 0.32 ? <circle cx={neutronX} cy={0} r={8} fill={PALETTE.cyan} stroke={DARK_LINE} strokeWidth={3} /> : null}
      {/* Left split cluster */}
      <g transform={`translate(${-sep} ${-sep * 0.2})`}>
        <circle cx={-12} cy={-10} r={16} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={10} cy={8} r={15} fill={PALETTE.orange} stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={-8} cy={14} r={13} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      </g>
      {/* Right split cluster */}
      <g transform={`translate(${sep} ${sep * 0.2})`}>
        <circle cx={10} cy={-12} r={15} fill={PALETTE.orange} stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={-10} cy={6} r={16} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={12} cy={14} r={13} fill={PALETTE.orange} stroke={DARK_LINE} strokeWidth={4} />
      </g>
      {/* Three spark lines on split */}
      {p >= 0.3 ? (
        <g stroke={PALETTE.gold} strokeWidth={4} strokeLinecap="round">
          <line x1={0} y1={-34} x2={0} y2={-62} />
          <line x1={28} y1={-20} x2={52} y2={-38} />
          <line x1={-28} y1={24} x2={-52} y2={42} />
        </g>
      ) : null}
    </g>
  );
};
