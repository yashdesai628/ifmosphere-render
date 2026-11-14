import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeOut, easeInOut, backOut, rnd, settle } from '../../engine/anim';
import { Glow, Cone } from '../../engine/light';
import type { PropProps, Registry } from './render';

const OUTLINE = '#121019';

const ACCENT_MAP = {
  gold: { text: PALETTE.gold, hex: PALETTE.gold, glow: 'warm' as const },
  red: { text: PALETTE.red, hex: PALETTE.red, glow: 'red' as const },
  cyan: { text: PALETTE.cyan, hex: PALETTE.cyan, glow: 'cool' as const },
};

const popIn = (t: number, d = 7) => backOut(clamp(t / d));

const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 0);
  const label = String(pp.label ?? '');
  const colorKey = (pp.color as 'gold' | 'red' | 'cyan' | undefined) ?? 'gold';
  const acc = ACCENT_MAP[colorKey] ?? ACCENT_MAP.gold;

  const s = popIn(t, 8);
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.85))));
  const formatted = val.toLocaleString('en-US');
  const pulse = 0.65 + 0.35 * Math.sin(t / 5);
  const w = Math.max(390, formatted.length * 46 + 96);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={-8} r={220} kind={acc.glow} o={0.34} />
      <rect x={-w / 2} y={-82} width={w} height={164} rx={22} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={4} />
      <rect x={-w / 2 + 12} y={-68} width={w - 24} height={94} rx={12} fill="#12101D" stroke={acc.hex} strokeWidth={2.5} opacity={0.95} />
      {/* Flip-card center split line */}
      <line x1={-w / 2 + 16} y1={-21} x2={w / 2 - 16} y2={-21} stroke={OUTLINE} strokeWidth={2.5} opacity={0.75} />
      <circle cx={-w / 2 + 28} cy={52} r={5.5} fill={acc.hex} opacity={pulse} />
      <text
        x={0}
        y={-2}
        textAnchor="middle"
        fontFamily={FONTS.title}
        fontWeight={800}
        fontSize={68}
        letterSpacing={2}
        fill={PALETTE.cream}
      >
        {formatted}
      </text>
      <text
        x={0}
        y={60}
        textAnchor="middle"
        fontFamily={FONTS.ui}
        fontWeight={700}
        fontSize={24}
        letterSpacing={3}
        fill={acc.text}
      >
        {label}
      </text>
    </g>
  );
};

const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 60);
  const glow = Boolean(pp.glow);

  const s = popIn(t, 7);
  const mins = lerp(from, to, easeInOut(clamp(p / 0.9)));
  const ang = (mins / 60) * 360;
  const r = 102;
  const rad = ((ang - 90) * Math.PI) / 180;
  const arcR = r - 20;
  const ax = Math.cos(rad) * arcR;
  const ay = Math.sin(rad) * arcR;
  const sweepDeg = Math.abs(ang - (from / 60) * 360);
  const largeArc = sweepDeg >= 180 ? 1 : 0;

  return (
    <g transform={`scale(${s})`}>
      {glow ? <Glow x={0} y={0} r={195} kind="warm" o={0.55 + 0.12 * Math.sin(t / 7)} /> : null}
      <circle r={r + 12} fill="#2A263D" stroke={OUTLINE} strokeWidth={4} />
      <circle r={r} fill="#F6EFE3" stroke={OUTLINE} strokeWidth={3.5} />
      <path d={`M ${-r * 0.72} ${-r * 0.62} A ${r} ${r} 0 0 1 ${r * 0.65} ${-r * 0.72}`} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.55} strokeLinecap="round" />

      {/* Elapsed minute wedge */}
      {sweepDeg > 2 ? (
        <path
          d={`M 0 0 L 0 ${-arcR} A ${arcR} ${arcR} 0 ${largeArc} 1 ${ax} ${ay} Z`}
          fill={glow ? PALETTE.gold : PALETTE.cyan}
          opacity={0.26}
        />
      ) : null}

      {/* Hour & minute ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.sin(a) * (r - 16)}
            y1={-Math.cos(a) * (r - 16)}
            x2={Math.sin(a) * (r - 6)}
            y2={-Math.cos(a) * (r - 6)}
            stroke={OUTLINE}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Sweeping minute hand */}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={16} x2={0} y2={-(r - 22)} stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
        <line x1={0} y1={16} x2={0} y2={-(r - 22)} stroke={PALETTE.red} strokeWidth={3.5} strokeLinecap="round" />
      </g>
      <circle r={9} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3} />
    </g>
  );
};

const UmbrellaProp: React.FC<PropProps> = ({ t, pp }) => {
  const hit = Boolean(pp.hit);
  const sway = Math.sin(t / 11) * 2.5;
  return (
    <g transform={`rotate(${sway})`}>
      {/* Shaft & curved mustard handle centered with grip around (0,0) */}
      <line x1={0} y1={2} x2={0} y2={-114} stroke={OUTLINE} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={2} x2={0} y2={-114} stroke="#4C4666" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M 0 0 L 0 22 A 14 14 0 0 0 28 22" fill="none" stroke={OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <path d="M 0 0 L 0 22 A 14 14 0 0 0 28 22" fill="none" stroke={PALETTE.gold} strokeWidth={6} strokeLinecap="round" />

      {/* Hood-teal canopy */}
      <path
        d="M -118 -86 Q -95 -162 0 -164 Q 95 -162 118 -86 Q 82 -96 58 -84 Q 30 -96 0 -84 Q -30 -96 -58 -84 Q -82 -96 -118 -86 Z"
        fill="#2FB7A6"
        stroke={OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* Darker inner canopy panels */}
      <path d="M -58 -84 Q -34 -146 0 -164 Q 34 -146 58 -84 Q 30 -96 0 -84 Q -30 -96 -58 -84 Z" fill="#239486" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <path d="M -92 -118 Q -42 -160 44 -154" fill="none" stroke="#B7F4EB" strokeWidth={3} opacity={0.65} strokeLinecap="round" />
      {/* Mustard finial spike */}
      <line x1={0} y1={-164} x2={0} y2={-180} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <circle cx={0} cy={-181} r={4.5} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={2.5} />

      {/* Meteor sparks bouncing off canopy when hit=true */}
      {hit ? (
        <g>
          {[-72, -26, 22, 68].map((sx, i) => {
            const cyc = (t + i * 7) % 18;
            const u = cyc / 18;
            const hitY = -148 + Math.abs(sx) * 0.34;
            const bounceX = sx + (sx >= 0 ? 1 : -1) * u * 34;
            const bounceY = hitY - Math.sin(u * Math.PI) * 32;
            const fade = 1 - u;
            return (
              <g key={i}>
                <Glow x={sx} y={hitY} r={24 * (1 - u * 0.6)} kind="warm" o={0.75 * fade} />
                <line x1={sx + 16 * (1 - u)} y1={hitY - 26 * (1 - u)} x2={sx} y2={hitY} stroke="#FFE29A" strokeWidth={2.5} opacity={fade} strokeLinecap="round" />
                <circle cx={bounceX} cy={bounceY} r={3.5 * fade + 1} fill="#FFF2BA" opacity={fade} />
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

const TelescopeProp: React.FC<PropProps> = ({ t }) => {
  const s = popIn(t, 8);
  const nod = Math.sin(t / 24) * 1.6;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={202} rx={78} ry={12} fill="#000" opacity={0.42} />
      {/* Three sturdy tripod legs */}
      <line x1={-8} y1={-6} x2={-66} y2={198} stroke={OUTLINE} strokeWidth={13} strokeLinecap="round" />
      <line x1={-8} y1={-6} x2={-66} y2={198} stroke="#2E2B3D" strokeWidth={6} strokeLinecap="round" />
      <line x1={8} y1={-6} x2={66} y2={198} stroke={OUTLINE} strokeWidth={13} strokeLinecap="round" />
      <line x1={8} y1={-6} x2={66} y2={198} stroke="#2E2B3D" strokeWidth={6} strokeLinecap="round" />
      <line x1={0} y1={-6} x2={0} y2={204} stroke={OUTLINE} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={-6} x2={0} y2={204} stroke="#3B3750" strokeWidth={5.5} strokeLinecap="round" />
      <line x1={-34} y1={96} x2={34} y2={96} stroke={PALETTE.gold} strokeWidth={4} strokeLinecap="round" />

      {/* Equatorial mount hub */}
      <rect x={-16} y={-22} width={32} height={26} rx={6} fill="#3E3954" stroke={OUTLINE} strokeWidth={4} />

      {/* Optical tube tilted upward */}
      <g transform={`translate(0 -24) rotate(${-34 + nod})`}>
        <rect x={-96} y={-18} width={196} height={36} rx={6} fill="#2E2B3D" stroke={OUTLINE} strokeWidth={4} />
        <line x1={-84} y1={-12} x2={82} y2={-12} stroke="#8B9BC8" strokeWidth={2.5} opacity={0.55} strokeLinecap="round" />
        {/* Mustard brass trim rings & objective dew shield */}
        <rect x={18} y={-20} width={16} height={40} rx={3} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3.5} />
        <rect x={92} y={-23} width={22} height={46} rx={4} fill="#3E3954" stroke={OUTLINE} strokeWidth={4} />
        <ellipse cx={114} cy={0} rx={6} ry={19} fill="#89E2FF" stroke={OUTLINE} strokeWidth={3} />
        {/* Eyepiece */}
        <path d="M -96 -6 L -116 -6 L -116 -22 L -104 -22" fill="none" stroke={OUTLINE} strokeWidth={10} strokeLinejoin="round" />
        <path d="M -96 -6 L -116 -6 L -116 -22" fill="none" stroke={PALETTE.gold} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </g>
  );
};

const ThermosProp: React.FC<PropProps> = ({ t }) => {
  const s = popIn(t, 7);
  const w1 = Math.sin(t / 7) * 5;
  const w2 = Math.cos(t / 8) * 5;
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={-68} r={64} kind="warm" o={0.38 + 0.1 * Math.sin(t / 6)} />
      {/* Animated rising steam curls */}
      <path d={`M -6 -58 Q ${-12 + w1} -78 ${-4 - w1} -96`} fill="none" stroke={PALETTE.cream} strokeWidth={3} opacity={0.55} strokeLinecap="round" />
      <path d={`M 8 -60 Q ${14 + w2} -82 ${6 - w2} -104`} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.42} strokeLinecap="round" />
      {/* Folding side handle */}
      <path d="M 20 -20 L 34 -20 L 34 22 L 20 22" fill="none" stroke={OUTLINE} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 20 -20 L 34 -20 L 34 22 L 20 22" fill="none" stroke="#3E3954" strokeWidth={3.5} strokeLinejoin="round" />
      {/* Mustard insulated flask body */}
      <rect x={-22} y={-34} width={44} height={78} rx={10} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={4} />
      <rect x={6} y={-30} width={12} height={70} rx={4} fill="#D18E22" opacity={0.7} />
      <rect x={-22} y={-8} width={44} height={18} fill="#2E2B3D" stroke={OUTLINE} strokeWidth={3.5} />
      {/* Dark cap cup */}
      <rect x={-16} y={-52} width={32} height={20} rx={5} fill="#2E2B3D" stroke={OUTLINE} strokeWidth={4} />
      <line x1={-15} y1={-28} x2={-15} y2={36} stroke="#FFF0C4" strokeWidth={2.5} opacity={0.65} strokeLinecap="round" />
    </g>
  );
};

const BlanketProp: React.FC<PropProps> = ({ t, id }) => {
  const sway = Math.sin(t / 7) * 2.5;
  const d = `M -36 -110 Q 0 -100 36 -110 Q 56 -88 54 -14 Q 30 20 ${12 + sway * 0.5} 24 L 4 -42 L -4 -42 L ${-12 + sway * 0.5} 24 Q -32 20 -54 -14 Q -56 -88 -36 -110 Z`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}blanket`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={PALETTE.gold} />
      <g clipPath={`url(#${id}blanket)`}>
        {/* Checked mustard-and-dark plaid weave */}
        {[-45, -15, 15, 45].map((x, i) => (
          <rect key={`v${i}`} x={x - 6} y={-120} width={12} height={160} fill="#2E2B3D" opacity={0.55} />
        ))}
        {[-95, -62, -29, 4].map((y, i) => (
          <rect key={`h${i}`} x={-65} y={y - 5} width={130} height={10} fill="#B86B22" opacity={0.48} />
        ))}
        <path d="M -36 -110 Q 0 -100 36 -110" fill="none" stroke="#FFF0C4" strokeWidth={3} opacity={0.65} />
      </g>
      <path d={d} fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

const ClipboardProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const marks = Math.max(0, Math.round(Number(pp.marks ?? 10)));
  const s = popIn(t, 7);
  const progress = clamp((p - 0.08) / 0.8);
  const shown = progress * marks;

  return (
    <g transform={`scale(${s}) rotate(-4)`}>
      {/* Backing board */}
      <rect x={-78} y={-104} width={156} height={208} rx={14} fill="#4D362B" stroke={OUTLINE} strokeWidth={4} />
      {/* Cream paper sheet */}
      <rect x={-64} y={-84} width={128} height={174} rx={4} fill="#F6EFE3" stroke={OUTLINE} strokeWidth={3.5} />
      {/* Metal spring clip at top */}
      <rect x={-32} y={-114} width={64} height={26} rx={7} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3.5} />
      <circle cx={0} cy={-106} r={4} fill={OUTLINE} />

      <text x={0} y={-56} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} letterSpacing={2} fill={PALETTE.red}>
        COUNT
      </text>
      <line x1={-50} y1={-46} x2={50} y2={-46} stroke="#C7BEB0" strokeWidth={2} />

      {/* Tally strokes drawn sequentially in 5-bar gates */}
      {Array.from({ length: marks }).map((_, idx) => {
        const amt = clamp(shown - idx);
        if (amt <= 0.01) return null;
        const gate = Math.floor(idx / 5);
        const pos = idx % 5;
        const gx = -38 + (gate % 2) * 52;
        const gy = -22 + Math.floor(gate / 2) * 44;
        if (pos < 4) {
          const lx = gx + pos * 9;
          return (
            <line
              key={idx}
              x1={lx}
              y1={gy}
              x2={lx}
              y2={gy + 26 * easeOut(amt)}
              stroke={OUTLINE}
              strokeWidth={3.2}
              strokeLinecap="round"
            />
          );
        }
        return (
          <line
            key={idx}
            x1={gx - 4}
            y1={gy + 22}
            x2={lerp(gx - 4, gx + 31, easeOut(amt))}
            y2={lerp(gy + 22, gy + 4, easeOut(amt))}
            stroke={PALETTE.red}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(Number(pp.frac ?? 1));
  const colorKey = (pp.color as 'gold' | 'red' | 'cyan' | undefined) ?? 'gold';
  const label = String(pp.label ?? '');
  const acc = ACCENT_MAP[colorKey] ?? ACCENT_MAP.gold;

  const s = popIn(t, 7);
  const w = 520;
  const h = 44;
  const animFrac = frac * easeOut(clamp(p / 0.78));
  const fillW = frac > 0 ? Math.max(10, (w - 8) * animFrac) : 0;

  return (
    <g transform={`scale(${s})`}>
      <text x={-w / 2 + 4} y={-36} textAnchor="start" fontFamily={FONTS.ui} fontWeight={700} fontSize={24} letterSpacing={2.5} fill={PALETTE.cream}>
        {label}
      </text>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={4} />
      {fillW > 0 ? (
        <g>
          <Glow x={-w / 2 + 4 + fillW} y={0} r={54} kind={acc.glow} o={0.55} />
          <rect x={-w / 2 + 4} y={-h / 2 + 4} width={fillW} height={h - 8} rx={8} fill={acc.hex} />
          <line x1={-w / 2 + 10} y1={-h / 2 + 9} x2={-w / 2 + fillW - 2} y2={-h / 2 + 9} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.45} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

const ChairProp: React.FC<PropProps> = ({ t }) => {
  const s = popIn(t, 8);
  const flutter = Math.sin(t / 15) * 1.2;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={126} rx={68} ry={11} fill="#000" opacity={0.42} />
      {/* Fold-out X-legs down to +124 */}
      <line x1={-46} y1={18} x2={44} y2={122} stroke={OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <line x1={-46} y1={18} x2={44} y2={122} stroke="#36324B" strokeWidth={5} strokeLinecap="round" />
      <line x1={46} y1={18} x2={-44} y2={122} stroke={OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <line x1={46} y1={18} x2={-44} y2={122} stroke="#36324B" strokeWidth={5} strokeLinecap="round" />
      {/* Reclining backrest frame */}
      <line x1={-44} y1={18} x2={-62} y2={-110} stroke={OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <line x1={-44} y1={18} x2={-62} y2={-110} stroke="#36324B" strokeWidth={5} strokeLinecap="round" />
      {/* Teal canvas backrest & seat */}
      <polygon points={`-60,-104 -32,-104 ${-20 + flutter},16 -46,16`} fill="#2FB7A6" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <polygon points="-46,12 52,12 56,28 -48,28" fill="#239486" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      {/* Armrests */}
      <line x1={-48} y1={-32} x2={34} y2={-32} stroke={OUTLINE} strokeWidth={10} strokeLinecap="round" />
      <line x1={-48} y1={-32} x2={34} y2={-32} stroke="#2FB7A6" strokeWidth={4.5} strokeLinecap="round" />
      <line x1={-60} y1={-104} x2={-32} y2={-104} stroke="#B7F4EB" strokeWidth={3} opacity={0.7} strokeLinecap="round" />
    </g>
  );
};

const SignProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = String(pp.text ?? 'SIGN').slice(0, 12);
  const s = popIn(t, 8);
  const wobble = settle(t - 6, 4, 1.2, 10) + Math.sin(t / 16) * 1.2;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={272} rx={36} ry={9} fill="#000" opacity={0.42} />
      {/* Wooden post reaching down to ground */}
      <rect x={-11} y={-26} width={22} height={298} rx={4} fill="#4D362B" stroke={OUTLINE} strokeWidth={4} />
      <g transform={`rotate(${-3 + wobble})`}>
        <rect x={-132} y={-50} width={264} height={96} rx={10} fill="#F6EFE3" stroke={OUTLINE} strokeWidth={4} />
        <line x1={-122} y1={-44} x2={122} y2={-44} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.7} strokeLinecap="round" />
        <circle cx={-108} cy={0} r={4.5} fill="#36324B" stroke={OUTLINE} strokeWidth={2} />
        <circle cx={108} cy={0} r={4.5} fill="#36324B" stroke={OUTLINE} strokeWidth={2} />
        <text
          x={0}
          y={15}
          textAnchor="middle"
          fontFamily={FONTS.hand}
          fontWeight={700}
          fontSize={44}
          fill={PALETTE.red}
          stroke={PALETTE.titleStroke}
          strokeWidth={3}
          paintOrder="stroke"
        >
          {text}
        </text>
      </g>
    </g>
  );
};

const EarthProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const tilt = Number(pp.tilt ?? 23);
  const s = popIn(t, 8);
  const r = 76;
  const drift = ((t * 1.2) % 160) - 80;
  return (
    <g transform={`scale(${s}) rotate(${tilt})`}>
      <defs>
        <clipPath id={`${id}earthClip`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <Glow x={0} y={0} r={142} kind="cool" o={0.55} />
      <circle r={r} fill="#2268B8" />
      <g clipPath={`url(#${id}earthClip)`}>
        {[0, 160].map((off, i) => (
          <g key={i} transform={`translate(${drift + off - 80} 0)`}>
            <path d="M -38 -42 Q -8 -54 14 -30 Q 28 -10 8 8 Q -18 14 -34 -8 Z" fill="#38B889" stroke={OUTLINE} strokeWidth={3} />
            <path d="M 16 14 Q 44 6 54 34 Q 32 58 8 44 Q 2 26 16 14 Z" fill="#38B889" stroke={OUTLINE} strokeWidth={3} />
            <rect x={-52} y={-24} width={68} height={11} rx={5.5} fill="#F6EFE3" opacity={0.58} />
            <rect x={-12} y={24} width={76} height={10} rx={5} fill="#F6EFE3" opacity={0.5} />
          </g>
        ))}
        {/* Dark night-side terminator */}
        <path d={`M ${r * 0.28} ${-r} A ${r} ${r} 0 0 1 ${r * 0.28} ${r} A ${r * 0.65} ${r} 0 0 0 ${r * 0.28} ${-r} Z`} fill="#0A1229" opacity={0.45} />
      </g>
      <circle r={r} fill="none" stroke={OUTLINE} strokeWidth={4} />
      <path d={`M ${-r * 0.78} ${-r * 0.56} A ${r} ${r} 0 0 1 ${r * 0.52} ${-r * 0.82}`} fill="none" stroke="#9CEBFF" strokeWidth={3.5} opacity={0.78} strokeLinecap="round" />
    </g>
  );
};

const DustProp: React.FC<PropProps> = ({ t, pp }) => {
  const density = clamp(Number(pp.density ?? 0.5));
  const count = Math.max(5, Math.round(density * 42));
  const s = popIn(t, 8);
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={240} kind="warm" o={0.18 + 0.14 * density} />
      {Array.from({ length: count }).map((_, i) => {
        const sp = 0.5 + rnd(301, i);
        const rawX = ((rnd(302, i) * 560 + t * 1.1 * sp) % 560) - 280;
        const y = (rnd(303, i) - 0.5) * 200 + Math.sin(t / 18 + i) * 14;
        const r = 2 + rnd(304, i) * 3.8;
        const tw = 0.45 + 0.55 * Math.sin(t / 8 + i * 1.4);
        return (
          <circle
            key={i}
            cx={rawX}
            cy={y}
            r={r}
            fill={i % 3 === 0 ? '#FFE2A0' : PALETTE.cream}
            opacity={0.82 * tw}
          />
        );
      })}
    </g>
  );
};

const StopwatchProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 30);
  const s = popIn(t, 7);
  const secs = lerp(from, to, easeOut(clamp(p / 0.88)));
  const ang = (secs / 60) * 360;
  const press = p < 0.14 ? Math.sin((p / 0.14) * Math.PI) * 7 : 0;
  const r = 90;

  return (
    <g transform={`scale(${s})`}>
      {/* Top stem & red button */}
      <g transform={`translate(0 ${press})`}>
        <rect x={-9} y={-r - 22} width={18} height={18} rx={3} fill="#3A354E" stroke={OUTLINE} strokeWidth={3.5} />
        <rect x={-18} y={-r - 36} width={36} height={16} rx={6} fill={PALETTE.red} stroke={OUTLINE} strokeWidth={4} />
      </g>
      <circle r={r + 10} fill="#2E2B3D" stroke={OUTLINE} strokeWidth={4} />
      <circle r={r} fill="#F6EFE3" stroke={OUTLINE} strokeWidth={3.5} />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.sin(a) * (r - 12)}
            y1={-Math.cos(a) * (r - 12)}
            x2={Math.sin(a) * (r - 4)}
            y2={-Math.cos(a) * (r - 4)}
            stroke={OUTLINE}
            strokeWidth={i % 2 === 0 ? 3 : 1.5}
          />
        );
      })}
      {/* Digital inset counter inside lower dial */}
      <rect x={-44} y={24} width={88} height={32} rx={8} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={3} />
      <text x={0} y={47} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream}>
        {`${Math.round(secs).toString().padStart(2, '0')}s`}
      </text>
      {/* Sweeping second hand */}
      <g transform={`rotate(${ang})`}>
        <line x1={0} y1={14} x2={0} y2={-(r - 16)} stroke={PALETTE.red} strokeWidth={4.5} strokeLinecap="round" />
      </g>
      <circle r={7.5} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3} />
    </g>
  );
};

const StrapLampProp: React.FC<PropProps> = ({ t }) => {
  const pulse = 0.25 * (0.9 + 0.1 * Math.sin(t / 6));
  return (
    <g>
      {/* Elastic strap hugging upper hood well above eyes */}
      <path d="M -58 -210 Q 0 -224 58 -210" fill="none" stroke={OUTLINE} strokeWidth={11} strokeLinecap="round" />
      <path d="M -58 -210 Q 0 -224 58 -210" fill="none" stroke="#2E2B3D" strokeWidth={5} strokeLinecap="round" />
      <g transform="translate(26 -222) rotate(-22)">
        <Cone d="M 10 -8 L 10 8 L 280 95 L 280 -95 Z" o={pulse} />
        <Glow x={12} y={0} r={54} kind="warm" o={pulse} />
        <rect x={-10} y={-9} width={22} height={18} rx={4} fill="#2E2B3D" stroke={OUTLINE} strokeWidth={3.5} />
        <rect x={7} y={-7} width={7} height={14} rx={2} fill="#FFE29A" stroke={OUTLINE} strokeWidth={2.5} />
      </g>
    </g>
  );
};

const JupiterProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const sScale = Number(pp.s ?? 1);
  const s = popIn(t, 8) * sScale;
  const r = 104;
  const drift = ((t * 0.9) % 210) - 105;
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <clipPath id={`${id}jup`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <Glow x={0} y={0} r={195} kind="warm" o={0.52} />
      <circle r={r} fill="#E6AC60" />
      <g clipPath={`url(#${id}jup)`}>
        <rect x={-r} y={-78} width={r * 2} height={22} fill="#F6EFE3" opacity={0.75} />
        <rect x={-r} y={-44} width={r * 2} height={20} fill="#BA693C" opacity={0.85} />
        <rect x={-r} y={-10} width={r * 2} height={24} fill="#FFE2AE" opacity={0.8} />
        <rect x={-r} y={24} width={r * 2} height={22} fill="#C67442" opacity={0.85} />
        <rect x={-r} y={56} width={r * 2} height={20} fill="#F6EFE3" opacity={0.65} />
        {/* Drifting Great Red Spot */}
        <ellipse cx={drift} cy={32} rx={24} ry={13} fill="#D94E3E" stroke={OUTLINE} strokeWidth={2.5} />
        {/* Crescent shade */}
        <path d={`M ${r * 0.35} ${-r} A ${r} ${r} 0 0 1 ${r * 0.35} ${r} A ${r * 0.68} ${r} 0 0 0 ${r * 0.35} ${-r} Z`} fill="#170E24" opacity={0.42} />
      </g>
      <circle r={r} fill="none" stroke={OUTLINE} strokeWidth={4} />
      <path d={`M ${-r * 0.78} ${-r * 0.56} A ${r} ${r} 0 0 1 ${r * 0.48} ${-r * 0.84}`} fill="none" stroke="#FFF2D6" strokeWidth={3.5} opacity={0.72} strokeLinecap="round" />
    </g>
  );
};

const CalendarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const year = Number(pp.year ?? 2026);
  const flip = Boolean(pp.flip);
  const s = popIn(t, 8);
  const w = 216;
  const h = 228;

  const flipProg = flip ? clamp((p - 0.3) / 0.32) : 1;
  const flipSettle = flip && p >= 0.3 ? settle((p - 0.3) * 45, 3.5, 1.1, 7) : 0;
  const oldScaleY = flip ? Math.max(0, 1 - easeOut(flipProg)) : 0;
  const oldText = String(year - 1);
  const newText = String(year);

  return (
    <g transform={`scale(${s}) rotate(${flipSettle})`}>
      {/* Card base */}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#F6EFE3" stroke={OUTLINE} strokeWidth={4} />
      {/* Dark top header band */}
      <path d={`M ${-w / 2} ${-h / 2 + 16} A 16 16 0 0 1 ${-w / 2 + 16} ${-h / 2} L ${w / 2 - 16} ${-h / 2} A 16 16 0 0 1 ${w / 2} ${-h / 2 + 16} L ${w / 2} ${-h / 2 + 54} L ${-w / 2} ${-h / 2 + 54} Z`} fill="#24212F" stroke={OUTLINE} strokeWidth={4} />
      {/* Spiral binding rings */}
      {[-64, 0, 64].map((rx, i) => (
        <rect key={i} x={rx - 6} y={-h / 2 - 14} width={12} height={24} rx={5} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3} />
      ))}
      <text x={0} y={-h / 2 + 39} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={22} letterSpacing={4} fill={PALETTE.gold}>
        NOV
      </text>

      {/* Revealed target year */}
      <text
        x={0}
        y={42}
        textAnchor="middle"
        fontFamily={FONTS.title}
        fontWeight={800}
        fontSize={68}
        fill={PALETTE.red}
        stroke={PALETTE.titleStroke}
        strokeWidth={4}
        paintOrder="stroke"
      >
        {newText}
      </text>

      {/* Flipping previous-year sheet */}
      {flip && oldScaleY > 0.02 ? (
        <g transform={`translate(0 ${-h / 2 + 54}) scale(1 ${oldScaleY}) translate(0 ${h / 2 - 54})`}>
          <rect x={-w / 2 + 4} y={-h / 2 + 54} width={w - 8} height={h - 58} rx={12} fill="#EDE4D4" stroke={OUTLINE} strokeWidth={3.5} />
          <text
            x={0}
            y={42}
            textAnchor="middle"
            fontFamily={FONTS.title}
            fontWeight={800}
            fontSize={68}
            fill={PALETTE.orange}
            stroke={PALETTE.titleStroke}
            strokeWidth={4}
            paintOrder="stroke"
          >
            {oldText}
          </text>
        </g>
      ) : null}
    </g>
  );
};

export const PROPS: Registry['props'] = {
  counter: CounterProp,
  clock: ClockProp,
  umbrella: UmbrellaProp,
  telescope: TelescopeProp,
  thermos: ThermosProp,
  blanket: BlanketProp,
  clipboard: ClipboardProp,
  bar: BarProp,
  chair: ChairProp,
  sign: SignProp,
  earth: EarthProp,
  dust: DustProp,
  stopwatch: StopwatchProp,
  headlamp: StrapLampProp,
  jupiter: JupiterProp,
  calendar: CalendarProp,
};
