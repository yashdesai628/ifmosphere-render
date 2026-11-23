import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeOut, backOut } from '../../engine/anim';
import { Glow } from '../../engine/light';
import type { PropProps } from './render';
import { OUT, numParam, ReactionWheelGraphic } from './sets-shared';

/** Cream balance scale with one pan tipped low and label beneath. */
export const ScaleProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const label = typeof pp.label === 'string' ? pp.label : '';
  const pop = backOut(clamp(t / 8)) * sc;
  const tilt = -14 + Math.sin(t * 0.07) * 2.5;
  const rad = (tilt * Math.PI) / 180;
  const lx = -58 * Math.cos(rad);
  const ly = -38 - 58 * Math.sin(rad);
  const rx = 58 * Math.cos(rad);
  const ry = -38 + 58 * Math.sin(rad);

  return (
    <g transform={`scale(${pop})`}>
      {/* Base & pillar */}
      <rect x={-48} y={42} width={96} height={16} rx={6} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      <rect x={-8} y={-44} width={16} height={88} rx={4} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      {/* Tilted crossbar */}
      <g transform={`translate(0 -38) rotate(${tilt})`}>
        <rect x={-64} y={-5} width={128} height={10} rx={5} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      </g>
      <circle cx={0} cy={-38} r={9} fill={PALETTE.gold} stroke={OUT} strokeWidth={3.5} />
      {/* Hanging pans */}
      {[
        { x: lx, y: ly, heavy: true },
        { x: rx, y: ry, heavy: false },
      ].map((pan, i) => (
        <g key={i} transform={`translate(${pan.x} ${pan.y})`}>
          <line x1={0} y1={0} x2={-22} y2={38} stroke={PALETTE.cream} strokeWidth={3} />
          <line x1={0} y1={0} x2={22} y2={38} stroke={PALETTE.cream} strokeWidth={3} />
          {pan.heavy ? <rect x={-12} y={24} width={24} height={14} rx={3} fill={PALETTE.red} stroke={OUT} strokeWidth={3} /> : null}
          <path d="M -26 38 Q 0 54 26 38 Z" fill={PALETTE.cream} stroke={OUT} strokeWidth={3.5} />
        </g>
      ))}
      {label ? (
        <text x={0} y={84} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** BepiColombo spacecraft stack icon with gold box, solar wings, dish, sunshield and optional flame. */
export const ProbeOldProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 8)) * sc;
  const bob = Math.sin(t * 0.06) * 5;
  const fl = 0.8 + 0.2 * Math.sin(t * 0.8);

  return (
    <g transform={`translate(0 ${bob}) scale(${pop})`}>
      {glow ? (
        <g transform={`scale(1 ${fl})`}>
          <Glow x={0} y={56} r={75} kind="warm" o={0.55} />
          <polygon points="-14,34 0,78 14,34" fill={PALETTE.orange} stroke={OUT} strokeWidth={3} />
        </g>
      ) : null}
      {[-1, 1].map((side) => (
        <rect key={side} x={side > 0 ? 28 : -110} y={-14} width={82} height={28} rx={4} fill="#1E305C" stroke={OUT} strokeWidth={4} />
      ))}
      <rect x={-28} y={-24} width={56} height={58} rx={6} fill="#E4A938" stroke={OUT} strokeWidth={4} />
      <polygon points="-38,-24 38,-24 0,-64" fill="#D4DBE8" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={-34} cy={-8} r={14} fill="#9BA4B5" stroke={OUT} strokeWidth={3.5} />
    </g>
  );
};

/** Tall outlined thermometer with animated fluid level and label beneath. */
export const ThermoProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const frac = clamp(numParam(pp.frac, 0.5));
  const col = pp.color === 'cyan' ? PALETTE.cyan : PALETTE.red;
  const label = typeof pp.label === 'string' ? pp.label : '';
  const pop = backOut(clamp(t / 8));
  const level = lerp(0.05, frac, easeOut(clamp(p / 0.8)));
  const stemH = 120 * level;

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={0} y={30} r={80} kind={pp.color === 'cyan' ? 'cool' : 'red'} o={0.28 + 0.08 * Math.sin(t * 0.14)} />
      <rect x={-18} y={-90} width={36} height={134} rx={18} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      <circle cx={0} cy={46} r={30} fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
      <rect x={-9} y={40 - stemH} width={18} height={stemH + 10} rx={8} fill={col} />
      <circle cx={0} cy={46} r={20} fill={col} />
      {[-60, -30, 0, 30].map((ty) => (
        <line key={ty} x1={18} y1={ty} x2={28} y2={ty} stroke={OUT} strokeWidth={3} strokeLinecap="round" />
      ))}
      {label ? (
        <text x={0} y={102} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** Perseverance rover icon: boxy body, six wheels, camera mast, high-gain dish, optional cyan bloom or dim state. */
export const RoverProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const glow = Boolean(pp.glow);
  const dim = Boolean(pp.dim);
  const pop = backOut(clamp(t / 8)) * sc;
  const bodyCol = dim ? '#6C6C78' : '#E2DDD2';
  const shadeCol = dim ? '#52525E' : '#B5B0A4';
  const goldCol = dim ? '#70654A' : '#E5A93B';
  const scanRot = dim ? 10 : Math.sin(t * 0.05) * 4;
  const pulse = 0.55 + 0.45 * Math.sin(t * 0.18);

  return (
    <g transform={`scale(${pop})`}>
      <ellipse cx={0} cy={62} rx={118} ry={16} fill="#000" opacity={0.38} />
      {glow && !dim ? <Glow x={-48} y={-54} r={96} kind="cool" o={0.45 * pulse} /> : null}

      {/* Rear RTG power fin pack */}
      <polygon points="-98,-12 -128,-22 -120,16 -92,16" fill={dim ? '#454552' : '#4C5266'} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      {/* Rocker-bogie suspension struts */}
      <path d="M -82 42 L -46 12 L 0 42 M -46 12 L 32 8 L 80 42" fill="none" stroke="#4D5264" strokeWidth={8} strokeLinejoin="round" />
      <path d="M -82 42 L -46 12 L 0 42 M -46 12 L 32 8 L 80 42" fill="none" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />

      {/* Main chassis */}
      <rect x={-96} y={-26} width={168} height={46} rx={8} fill={bodyCol} stroke={OUT} strokeWidth={4} />
      <rect x={-92} y={2} width={160} height={14} rx={4} fill={shadeCol} />
      <rect x={-56} y={-18} width={64} height={14} rx={3} fill={goldCol} stroke={OUT} strokeWidth={2.5} />

      {/* High-gain white dish on rear deck */}
      <g transform="translate(-52 -36) rotate(-18)">
        <line x1={0} y1={14} x2={0} y2={0} stroke="#6E758A" strokeWidth={6} />
        <path d="M -26 -8 Q 0 6 26 -8 Q 0 -22 -26 -8 Z" fill={dim ? '#7A7B86' : PALETTE.cream} stroke={OUT} strokeWidth={3.5} />
        {glow && !dim ? (
          <path d="M -16 -24 Q 0 -36 16 -24" fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} strokeLinecap="round" opacity={pulse} />
        ) : null}
      </g>

      {/* Thin mast & camera sensor box */}
      <rect x={36} y={-84} width={10} height={60} rx={3} fill={shadeCol} stroke={OUT} strokeWidth={3.5} />
      <g transform={`translate(44 -86) rotate(${scanRot})`}>
        <rect x={-22} y={-16} width={44} height={28} rx={6} fill={bodyCol} stroke={OUT} strokeWidth={4} />
        <circle cx={6} cy={-2} r={6} fill={dim ? '#353844' : PALETTE.cyan} stroke={OUT} strokeWidth={2.5} />
      </g>

      {/* Six dark wheels */}
      {[-82, -26, 26, 80].map((wx, i) => (
        <g key={i} transform={`translate(${wx} 44)`}>
          <circle r={19} fill="#252333" stroke={OUT} strokeWidth={4} />
          <circle r={7} fill={shadeCol} stroke={OUT} strokeWidth={2.5} />
        </g>
      ))}
    </g>
  );
};

/** Outlined radio box with antenna, LED (green/red/amber) and optional half-power signal meter. */
export const RadioProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const half = Boolean(pp.half);
  const led = pp.led === 'red' ? PALETTE.red : pp.led === 'amber' ? PALETTE.gold : PALETTE.green;
  const pop = backOut(clamp(t / 8)) * sc;
  const blink = pp.led === 'red' ? (Math.sin(t * 0.45) > 0 ? 1 : 0.25) : 0.65 + 0.35 * Math.sin(t * 0.2);

  return (
    <g transform={`scale(${pop})`}>
      <Glow x={-38} y={-82} r={54} kind={pp.led === 'red' ? 'red' : pp.led === 'amber' ? 'warm' : 'cool'} o={0.35 * blink} />
      {/* Antenna */}
      <line x1={-40} y1={-46} x2={-40} y2={-96} stroke={OUT} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-40} cy={-98} r={6} fill={led} stroke={OUT} strokeWidth={3} />
      {/* Housing & cream faceplate */}
      <rect x={-72} y={-46} width={144} height={96} rx={14} fill="#1E1B2E" stroke={OUT} strokeWidth={4} />
      <rect x={-60} y={-34} width={120} height={72} rx={8} fill={PALETTE.cream} stroke={OUT} strokeWidth={3.5} />
      {/* Grille & LED */}
      {[-20, -8, 4].map((gy) => (
        <line key={gy} x1={-46} y1={gy} x2={-8} y2={gy} stroke={OUT} strokeWidth={4} strokeLinecap="round" />
      ))}
      <circle cx={34} cy={-14} r={10} fill={led} stroke={OUT} strokeWidth={3} opacity={blink} />
      {/* 4-bar signal strength meter (half=true fills only 2 of 4 bars) */}
      {Array.from({ length: 4 }).map((_, i) => {
        const lit = pp.led === 'red' ? false : half ? i < 2 : true;
        const bh = 8 + i * 5;
        return (
          <rect
            key={i}
            x={8 + i * 11}
            y={26 - bh}
            width={7}
            height={bh}
            rx={2}
            fill={lit ? led : '#C4BEB4'}
            stroke={OUT}
            strokeWidth={2}
          />
        );
      })}
    </g>
  );
};

/** Round badge with beating cream heart & cyan pulse ring, or flat grey line when pp.flat. */
export const HeartProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const flat = Boolean(pp.flat);
  const pop = backOut(clamp(t / 8)) * sc;
  const beatPhase = (t % 30) / 30;
  const beatScale = flat ? 1 : 1 + 0.14 * Math.exp(-beatPhase * 5);

  return (
    <g transform={`scale(${pop})`}>
      <circle r={66} fill="#181B2E" stroke={OUT} strokeWidth={4} />
      {flat ? (
        <g>
          <path
            d="M 0 24 C -36 2 -38 -26 -16 -26 C -6 -26 0 -16 0 -12 C 0 -16 6 -26 16 -26 C 38 -26 36 2 0 24 Z"
            fill="#4F556B"
            stroke={OUT}
            strokeWidth={3.5}
          />
          <line x1={-44} y1={0} x2={44} y2={0} stroke="#A7AEBE" strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <Glow x={0} y={0} r={96} kind="cool" o={0.35 * (1 - beatPhase)} />
          <circle r={24 + beatPhase * 36} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} opacity={(1 - beatPhase) * 0.85} />
          <g transform={`scale(${beatScale})`}>
            <path
              d="M 0 26 C -38 2 -40 -28 -17 -28 C -6 -28 0 -17 0 -12 C 0 -17 6 -28 17 -28 C 40 -28 38 2 0 26 Z"
              fill={PALETTE.cream}
              stroke={OUT}
              strokeWidth={4}
            />
          </g>
        </g>
      )}
    </g>
  );
};

/** Deep Space Network dish on short pedestal with cream bowl & cyan signal arcs. */
export const DishProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const glow = Boolean(pp.glow);
  const pop = backOut(clamp(t / 8)) * sc;
  const pulse = (t % 36) / 36;

  return (
    <g transform={`scale(${pop})`}>
      <ellipse cx={0} cy={66} rx={48} ry={10} fill="#000" opacity={0.38} />
      <rect x={-34} y={50} width={68} height={16} rx={5} fill="#464E66" stroke={OUT} strokeWidth={4} />
      <polygon points="-18,50 18,50 10,8 -10,8" fill="#636C87" stroke={OUT} strokeWidth={4} />
      <g transform="translate(0 -12) rotate(-28)">
        {glow ? <Glow x={0} y={-44} r={96} kind="cool" o={0.44} /> : null}
        <path d="M -56 -10 Q 0 36 56 -10 Q 0 -32 -56 -10 Z" fill={PALETTE.cream} stroke={OUT} strokeWidth={4} />
        <line x1={-28} y1={-12} x2={0} y2={-48} stroke={OUT} strokeWidth={3.5} />
        <line x1={28} y1={-12} x2={0} y2={-48} stroke={OUT} strokeWidth={3.5} />
        <circle cx={0} cy={-50} r={6} fill={PALETTE.cyan} stroke={OUT} strokeWidth={3} />
        {[0, 1, 2].map((i) => {
          const ph = (pulse + i * 0.33) % 1;
          const rArc = 16 + ph * 34;
          return (
            <path
              key={i}
              d={`M ${-rArc * 0.7} ${-54 - rArc * 0.4} Q 0 ${-68 - rArc * 0.7} ${rArc * 0.7} ${-54 - rArc * 0.4}`}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={3.5}
              strokeLinecap="round"
              opacity={glow ? (1 - ph) * 0.9 : 0.4}
            />
          );
        })}
      </g>
    </g>
  );
};

/** Reaction wheel prop wrapper around ReactionWheelGraphic. */
export const WheelProp: React.FC<PropProps> = ({ t, pp }) => {
  const sc = numParam(pp.s, 1);
  const spin = Boolean(pp.spin);
  const dead = Boolean(pp.dead);
  const pop = backOut(clamp(t / 8)) * sc;

  return (
    <g transform={`scale(${pop})`}>
      {!dead && spin ? <Glow x={0} y={0} r={108} kind="cool" o={0.28} /> : null}
      <ReactionWheelGraphic r={66} spin={spin} dead={dead ? 1 : 0} t={t} />
    </g>
  );
};
