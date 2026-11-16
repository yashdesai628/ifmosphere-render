import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeOut, easeInOut, backOut } from '../../engine/anim';
import { Glow } from '../../engine/light';
import type { PropProps, Registry } from './render';
import { OUTLINE, SW, StarshipVehicle, BoosterVehicle } from './sets-shared';

const popScale = (t: number, d = 7) => Math.max(0.001, backOut(clamp(t / d)));

const propColor = (name: unknown): string => {
  const c = String(name ?? 'gold');
  if (c === 'red') return PALETTE.red;
  if (c === 'cyan') return PALETTE.cyan;
  if (c === 'orange') return PALETTE.orange;
  if (c === 'green') return PALETTE.green;
  return PALETTE.gold;
};

// ---------------------------------------------------------------------------
// 1. ship — Small Starship icon with optional flame & scale
// ---------------------------------------------------------------------------
const ShipProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = Number(pp.s ?? 1) * popScale(t);
  const flame = pp.flame ? 0.92 : 0;
  const bob = Math.sin(t / 12) * 5;
  return (
    <g transform={`translate(0 ${bob}) scale(${s})`}>
      <StarshipVehicle x={0} y={0} t={t} scale={0.62} flame={flame} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 2. booster — Small Super Heavy booster icon with grid fins & optional flame
// ---------------------------------------------------------------------------
const BoosterProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = Number(pp.s ?? 1) * popScale(t);
  const flame = pp.flame ? 0.9 : 0;
  const bob = Math.sin(t / 11) * 5;
  return (
    <g transform={`translate(0 ${bob}) scale(${s})`}>
      <BoosterVehicle x={0} y={0} t={t} scale={0.55} flame={flame} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 3. starlink — Flat Starlink V3 panel with pale trim & animated gold glint
// ---------------------------------------------------------------------------
const StarlinkProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = Number(pp.s ?? 1) * popScale(t);
  const bob = Math.sin(t / 14) * 6;
  const rot = -10 + Math.sin(t / 18) * 4;
  const glint = 0.45 + 0.55 * Math.sin(t / 7);
  return (
    <g transform={`translate(0 ${bob}) rotate(${rot}) scale(${s})`}>
      <Glow x={16} y={0} r={85} kind="warm" o={0.28 * glint} />
      {/* Solar array panel */}
      <rect x={-52} y={-24} width={66} height={48} rx={5} fill="#1E2338" stroke={OUTLINE} strokeWidth={SW} />
      <rect x={-46} y={-18} width={54} height={36} rx={3} fill="none" stroke="#9DB6E2" strokeWidth={2.5} />
      {/* Gold solar wing */}
      <rect x={14} y={-22} width={44} height={44} rx={4} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={SW} />
      <line x1={22} y1={-15} x2={50} y2={15} stroke="#FFF6D6" strokeWidth={4} opacity={glint} strokeLinecap="round" />
      <line x1={34} y1={-16} x2={52} y2={4} stroke="#FFF6D6" strokeWidth={2.5} opacity={glint * 0.8} strokeLinecap="round" />
      {/* Star-tracker lens & status dot */}
      <circle cx={-28} cy={0} r={7} fill="#364366" stroke={OUTLINE} strokeWidth={2.5} />
      <circle cx={-6} cy={-8} r={3.5} fill={PALETTE.cyan} opacity={0.6 + 0.4 * Math.sin(t / 6)} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 4. tile — Single black TPS heat-shield tile with signature & optional glow
// ---------------------------------------------------------------------------
const TileProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, 6);
  const glowing = Boolean(pp.glow);
  const pulse = 0.72 + 0.28 * Math.sin(t / 8);
  return (
    <g transform={`scale(${s})`}>
      {glowing ? <Glow x={0} y={0} r={96} kind="warm" o={0.68 * pulse} /> : null}
      <rect
        x={-44}
        y={-44}
        width={88}
        height={88}
        rx={12}
        fill="#242233"
        stroke={OUTLINE}
        strokeWidth={SW}
      />
      {/* Beveled ceramic face & pale edge rim */}
      <rect
        x={-36}
        y={-36}
        width={72}
        height={72}
        rx={8}
        fill="#2F2C42"
        stroke={glowing ? PALETTE.orange : '#524F70'}
        strokeWidth={2.5}
      />
      <path
        d="M -32 24 L -32 -30 Q -32 -33 -28 -33 L 24 -33"
        fill="none"
        stroke={glowing ? '#FFB37A' : '#B8C2DC'}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.75}
      />
      {/* Tiny pencil/chalk signature */}
      <path
        d="M -22 14 C -18 2, -14 2, -10 13 C -7 3, -3 3, 1 13 C 6 10, 12 6, 22 12"
        fill="none"
        stroke="#ECE4D6"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
      <line x1={-20} y1={21} x2={20} y2={19} stroke="#ECE4D6" strokeWidth={1.6} opacity={0.65} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 5. counter — Split-flap telemetry counter with thousands separators
// ---------------------------------------------------------------------------
const CounterProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t);
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 0);
  const label = String(pp.label ?? '');
  const col = propColor(pp.color);
  const val = Math.round(lerp(from, to, easeOut(clamp(p / 0.82))));
  const str = val.toLocaleString('en-US');
  const w = Math.max(210, str.length * 46 + 68);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={-8} r={w * 0.68} kind={pp.color === 'cyan' ? 'cool' : pp.color === 'red' ? 'red' : 'warm'} o={0.28} />
      {/* Outer dark frame */}
      <rect x={-w / 2} y={-68} width={w} height={136} rx={16} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={SW} />
      <rect x={-w / 2 + 6} y={-62} width={w - 12} height={124} rx={12} fill="none" stroke={col} strokeWidth={3} opacity={0.85} />
      {/* Split-flap digit window & seam */}
      <rect x={-w / 2 + 16} y={-50} width={w - 32} height={68} rx={8} fill="#12101D" stroke={OUTLINE} strokeWidth={2.5} />
      <line x1={-w / 2 + 18} y1={-16} x2={w / 2 - 18} y2={-16} stroke="#2B2740" strokeWidth={2} />
      <text
        y={2}
        textAnchor="middle"
        fontFamily={FONTS.title}
        fontWeight={800}
        fontSize={54}
        fill={PALETTE.cream}
        letterSpacing={2}
      >
        {str}
      </text>
      <text
        y={46}
        textAnchor="middle"
        fontFamily={FONTS.ui}
        fontWeight={700}
        fontSize={22}
        fill={col}
        letterSpacing={2.5}
      >
        {label}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 6. clock — Round cream analogue clock sweeping pp.from..pp.to hours
// ---------------------------------------------------------------------------
const ClockProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t);
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 12);
  const hrs = lerp(from, to, easeInOut(clamp(p / 0.86)));
  const angle = hrs * 30;
  const glow = Boolean(pp.glow);
  const r = 74;

  return (
    <g transform={`scale(${s})`}>
      {glow ? <Glow x={0} y={0} r={145} kind="warm" o={0.52} /> : <Glow x={0} y={0} r={115} kind="cool" o={0.2} />}
      <circle cx={0} cy={0} r={r + 8} fill="#363B54" stroke={OUTLINE} strokeWidth={SW} />
      <circle cx={0} cy={0} r={r} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={SW} />
      {/* 12 hour tick marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const rIn = i % 3 === 0 ? r - 18 : r - 12;
        return (
          <line
            key={i}
            x1={Math.sin(a) * rIn}
            y1={-Math.cos(a) * rIn}
            x2={Math.sin(a) * (r - 5)}
            y2={-Math.cos(a) * (r - 5)}
            stroke={OUTLINE}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Sweeping hour hand */}
      <g transform={`rotate(${angle})`}>
        <line x1={0} y1={10} x2={0} y2={-r + 22} stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
        <line x1={0} y1={10} x2={0} y2={-r + 22} stroke={PALETTE.orange} strokeWidth={3} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={0} r={7} fill={PALETTE.orange} stroke={OUTLINE} strokeWidth={3} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 7. stopwatch — Round stopwatch with red top button & counting readout
// ---------------------------------------------------------------------------
const StopwatchProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t);
  const from = Number(pp.from ?? 0);
  const to = Number(pp.to ?? 60);
  const val = lerp(from, to, easeOut(clamp(p / 0.85)));
  const angle = (val / 60) * 360;
  const btnPress = t < 6 ? Math.sin(clamp(t / 6) * Math.PI) * 5 : 0;
  const r = 78;

  return (
    <g transform={`scale(${s})`}>
      {/* Top crown & red button */}
      <rect x={-10} y={-r - 20} width={20} height={16} rx={3} fill="#6F7999" stroke={OUTLINE} strokeWidth={3.5} />
      <rect
        x={-16}
        y={-r - 32 + btnPress}
        width={32}
        height={14}
        rx={5}
        fill={PALETTE.red}
        stroke={OUTLINE}
        strokeWidth={3.5}
      />

      {/* Watch body & cream dial */}
      <circle cx={0} cy={0} r={r + 8} fill="#464E6B" stroke={OUTLINE} strokeWidth={SW} />
      <circle cx={0} cy={0} r={r} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={SW} />

      {/* Dial ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={Math.sin(a) * (r - 14)}
            y1={-Math.cos(a) * (r - 14)}
            x2={Math.sin(a) * (r - 5)}
            y2={-Math.cos(a) * (r - 5)}
            stroke={OUTLINE}
            strokeWidth={i % 3 === 0 ? 3.5 : 2}
            strokeLinecap="round"
          />
        );
      })}

      {/* Digital inset readout */}
      <rect x={-34} y={20} width={68} height={28} rx={6} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={2.5} />
      <text x={0} y={41} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream}>
        {Math.round(val)}
      </text>

      {/* Sweeping second needle */}
      <g transform={`rotate(${angle})`}>
        <line x1={0} y1={14} x2={0} y2={-r + 16} stroke={PALETTE.red} strokeWidth={4.5} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={0} r={6} fill={OUTLINE} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 8. bar — Outlined horizontal progress bar filling to pp.frac
// ---------------------------------------------------------------------------
const BarProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t);
  const frac = clamp(Number(pp.frac ?? 0.5));
  const col = propColor(pp.color);
  const label = String(pp.label ?? '');
  const fillFrac = lerp(0, frac, easeOut(clamp(p / 0.8)));
  const bw = 320;
  const bh = 34;

  return (
    <g transform={`scale(${s})`}>
      <text
        x={0}
        y={-32}
        textAnchor="middle"
        fontFamily={FONTS.ui}
        fontWeight={700}
        fontSize={24}
        fill={PALETTE.cream}
        letterSpacing={2.5}
      >
        {label}
      </text>
      <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={12} fill="#1E1B2E" stroke={OUTLINE} strokeWidth={SW} />
      {fillFrac > 0.01 ? (
        <g>
          <rect
            x={-bw / 2 + 5}
            y={-bh / 2 + 5}
            width={Math.max(12, (bw - 10) * fillFrac)}
            height={bh - 10}
            rx={8}
            fill={col}
          />
          <line
            x1={-bw / 2 + 12}
            y1={-bh / 2 + 10}
            x2={-bw / 2 + Math.max(18, (bw - 16) * fillFrac)}
            y2={-bh / 2 + 10}
            stroke="#FFF8EA"
            strokeWidth={2.5}
            opacity={0.55}
            strokeLinecap="round"
          />
          <Glow
            x={-bw / 2 + 5 + (bw - 10) * fillFrac}
            y={0}
            r={44}
            kind={pp.color === 'cyan' ? 'cool' : pp.color === 'red' ? 'red' : 'warm'}
            o={0.45}
          />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// 9. arrow — Thick outlined curved arrow drawing on across the shot
// ---------------------------------------------------------------------------
const ArrowProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t);
  const col = propColor(pp.color);
  const drawP = easeOut(clamp(p / 0.72));
  const pathLen = 250;
  const headPop = clamp((drawP - 0.55) / 0.45);
  return (
    <g transform={`scale(${s})`}>
      <Glow x={88} y={-10} r={70} kind={pp.color === 'cyan' ? 'cool' : pp.color === 'red' ? 'red' : 'warm'} o={0.35 * headPop} />
      {/* Outer dark outline stroke */}
      <path
        d="M -100 44 Q -10 -60 92 -12"
        fill="none"
        stroke={OUTLINE}
        strokeWidth={20}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - drawP)}
      />
      {/* Colored inner stroke */}
      <path
        d="M -100 44 Q -10 -60 92 -12"
        fill="none"
        stroke={col}
        strokeWidth={11}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - drawP)}
      />
      {/* Arrowhead popping in at end of curve */}
      <g transform={`translate(94 -12) rotate(18) scale(${headPop})`}>
        <polygon points="26,0 -12,-20 -6,0 -12,20" fill={col} stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 10. flag — Green check disc with sparkle, or red cross when pp.bad true
// ---------------------------------------------------------------------------
const FlagProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t);
  const bad = Boolean(pp.bad);
  const col = bad ? PALETTE.red : PALETTE.green;
  const draw = easeOut(clamp(p / 0.45));
  const twinkle = 0.5 + 0.5 * Math.sin(t / 5);

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={96} kind={bad ? 'red' : 'cool'} o={0.38} />
      <circle cx={0} cy={0} r={54} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={SW} />
      <circle cx={0} cy={0} r={44} fill="none" stroke={col} strokeWidth={4} />
      {!bad ? (
        <>
          <path
            d="M -22 2 L -6 18 L 24 -16"
            fill="none"
            stroke={col}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={80}
            strokeDashoffset={80 * (1 - draw)}
          />
          {/* Tiny animated sparkle */}
          <g transform={`translate(42 -42) scale(${0.7 + 0.35 * twinkle})`}>
            <path d="M 0 -14 L 3 -3 L 14 0 L 3 3 L 0 14 L -3 3 L -14 0 L -3 -3 Z" fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={2} />
          </g>
        </>
      ) : (
        <g stroke={col} strokeWidth={10} strokeLinecap="round">
          <line x1={-18} y1={-18} x2={18} y2={18} strokeDasharray={60} strokeDashoffset={60 * (1 - draw)} />
          <line x1={18} y1={-18} x2={-18} y2={18} strokeDasharray={60} strokeDashoffset={60 * (1 - draw)} />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// 11. sign — Hand-painted cream sign on a post, pp.text in FONTS.hand (<=12 ch)
// ---------------------------------------------------------------------------
const SignProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t);
  const raw = String(pp.text ?? 'STARBASE');
  const txt = raw.slice(0, 12);
  const sway = Math.sin(t / 15) * 1.6;

  return (
    <g transform={`rotate(${sway}) scale(${s})`}>
      {/* Wooden/steel post */}
      <rect x={-9} y={10} width={18} height={95} rx={4} fill="#5E4D42" stroke={OUTLINE} strokeWidth={SW} />
      {/* Hand-painted cream board */}
      <g transform="rotate(-2)">
        <rect x={-112} y={-44} width={224} height={74} rx={10} fill={PALETTE.cream} stroke={OUTLINE} strokeWidth={SW} />
        <circle cx={-94} cy={-26} r={4} fill="#6F748C" />
        <circle cx={94} cy={-26} r={4} fill="#6F748C" />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fontFamily={FONTS.hand}
          fontWeight={700}
          fontSize={34}
          fill={PALETTE.pill}
        >
          {txt}
        </text>
      </g>
    </g>
  );
};

export const PROPS: Registry['props'] = {
  ship: ShipProp,
  booster: BoosterProp,
  starlink: StarlinkProp,
  tile: TileProp,
  counter: CounterProp,
  clock: ClockProp,
  stopwatch: StopwatchProp,
  bar: BarProp,
  arrow: ArrowProp,
  flag: FlagProp,
  sign: SignProp,
};
