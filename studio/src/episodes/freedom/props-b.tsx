import React from 'react';
import { PropProps } from './render';
import { PALETTE, FONTS } from '../../brand';
import { backOut, clamp, easeOut, lerp } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { DARK_LINE } from './sets-helpers';

const popScale = (t: number, pp: Record<string, unknown>) =>
  backOut(clamp(t / 7)) * ((pp.s as number | undefined) ?? 1);

const colorChoice = (c: unknown, fallback = PALETTE.gold) => {
  if (c === 'cyan') return PALETTE.cyan;
  if (c === 'red') return PALETTE.red;
  if (c === 'gold') return PALETTE.gold;
  return fallback;
};

// 15. dish
export const DishProp: React.FC<PropProps> = ({ t, pp }) => {
  const big = Boolean(pp.big);
  const s = popScale(t, pp) * (big ? 1.32 : 1);
  const pulse = (t % 36) / 36;

  return (
    <g transform={`scale(${s})`}>
      <polygon points="-24,62 -8,14 8,14 24,62" fill="#636C82" stroke={DARK_LINE} strokeWidth={4} />
      <g transform="rotate(-28)">
        <path
          d="M -62 -10 Q 0 38 62 -10 Z"
          fill="#EEF2FA"
          stroke={big ? PALETTE.gold : DARK_LINE}
          strokeWidth={4}
        />
        <path d="M -62 -10 Q 0 38 62 -10" fill="none" stroke={DARK_LINE} strokeWidth={4} />
        <line x1={0} y1={4} x2={0} y2={-42} stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={0} cy={-44} r={7} fill={PALETTE.cyan} stroke={DARK_LINE} strokeWidth={3} />
        {[0, 1, 2].map((w) => {
          const ph = (pulse + w * 0.33) % 1;
          const r = 18 + ph * 56;
          return (
            <path
              key={w}
              d={`M ${-r * 0.7} ${-48 - r * 0.45} Q 0 ${-64 - r * 0.65} ${r * 0.7} ${-48 - r * 0.45}`}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={3.5}
              opacity={1 - ph}
            />
          );
        })}
      </g>
    </g>
  );
};

// 16. radiator
export const RadiatorProp: React.FC<PropProps> = ({ t, pp }) => {
  const hot = clamp((pp.hot as number | undefined) ?? 0.4);
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      {hot > 0.15 ? <Glow x={0} y={0} r={140} kind="red" o={hot * 0.55} /> : null}
      <rect x={-48} y={-92} width={96} height={184} rx={8} fill="#666E84" stroke={DARK_LINE} strokeWidth={4} />
      {hot > 0.05 ? (
        <rect x={-44} y={-88} width={88} height={176} rx={6} fill="#E84E4E" opacity={hot * 0.68} />
      ) : null}
      {[-28, -10, 10, 28].map((rx, i) => (
        <line key={i} x1={rx} y1={-84} x2={rx} y2={84} stroke="#2E3446" strokeWidth={4} />
      ))}
      {hot > 0.1
        ? [-26, 0, 26].map((hx, i) => {
            const dy = (t * 1.6 + i * 16) % 44;
            return (
              <path
                key={i}
                d={`M ${hx} ${-100 - dy} Q ${hx + 9} ${-114 - dy} ${hx} ${-128 - dy}`}
                stroke="#FF856B"
                strokeWidth={3.5}
                fill="none"
                opacity={hot * 0.85}
                strokeLinecap="round"
              />
            );
          })
        : null}
    </g>
  );
};

// 17. badge
export const BadgeProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = ((pp.text as string | undefined) ?? 'NASA').slice(0, 6);
  const col = pp.color === 'cyan' ? PALETTE.cyan : PALETTE.gold;
  const s = popScale(t, pp);
  const sway = Math.sin(t / 15) * 3;

  return (
    <g transform={`scale(${s}) rotate(${sway})`}>
      {/* Lanyard strap */}
      <path d="M -26 -140 L -10 -78 L 10 -78 L 26 -140" fill="none" stroke={DARK_LINE} strokeWidth={12} />
      <path d="M -26 -140 L -10 -78 L 10 -78 L 26 -140" fill="none" stroke={col} strokeWidth={6} />
      <rect x={-64} y={-78} width={128} height={164} rx={14} fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-18} y={-88} width={36} height={14} rx={5} fill="#8D97AC" stroke={DARK_LINE} strokeWidth={3} />
      {/* Faceless geometric ID avatar square */}
      <rect x={-34} y={-50} width={68} height={64} rx={8} fill="#363D57" stroke={DARK_LINE} strokeWidth={3.5} />
      <line x1={-40} y1={28} x2={40} y2={28} stroke={col} strokeWidth={5} strokeLinecap="round" />
      <text y={62} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={26} fill={PALETTE.pill}>
        {text}
      </text>
    </g>
  );
};

// 18. switch
export const SwitchProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const flip = backOut(clamp((p - 0.36) / 0.14));
  const isOn = p >= 0.4;
  const leverY = lerp(32, -32, flip);

  return (
    <g transform={`scale(${s})`}>
      <rect x={-56} y={-86} width={112} height={172} rx={16} fill="#1E1B2E" stroke={DARK_LINE} strokeWidth={4} />
      {isOn ? <Glow x={0} y={-56} r={52} kind="cool" o={0.7} /> : null}
      <circle cx={0} cy={-58} r={10} fill={isOn ? PALETTE.green : PALETTE.red} stroke={DARK_LINE} strokeWidth={3} />
      <rect x={-16} y={-34} width={32} height={74} rx={8} fill="#100E1B" stroke={DARK_LINE} strokeWidth={3} />
      <line x1={0} y1={4} x2={0} y2={leverY} stroke="#F6EFE3" strokeWidth={12} strokeLinecap="round" />
      <circle cx={0} cy={leverY} r={14} fill={PALETTE.red} stroke={DARK_LINE} strokeWidth={4} />
      <text y={66} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={isOn ? PALETTE.green : PALETTE.cream}>
        {isOn ? 'ON' : 'OFF'}
      </text>
    </g>
  );
};

// 19. bolt
export const BoltProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const flicker = (p > 0.25 && p < 0.35) || (p > 0.65 && p < 0.75) ? 0.55 : 1;

  return (
    <g transform={`scale(${s})`} opacity={flicker}>
      <Glow x={0} y={0} r={110} kind="cool" o={0.62 * flicker} />
      <polygon
        points="16,-78 -36,6 4,6 -18,78 40,-10 0,-10"
        fill={PALETTE.cyan}
        stroke={DARK_LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </g>
  );
};

// 20. bulb
export const BulbProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const on = Boolean(pp.on);
  const n = (pp.n as number | undefined) ?? 1;
  const s = popScale(t, pp);

  const singleBulb = (x: number, y: number, sc: number, lit: boolean, key?: number) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${sc})`}>
      {lit ? <Glow x={0} y={-14} r={74} kind="warm" o={0.6} /> : null}
      <path
        d="M -28 -16 A 30 30 0 1 1 28 -16 Q 28 8 16 20 L -16 20 Q -28 8 -28 -16 Z"
        fill={lit ? '#FFE17D' : '#E6E0D6'}
        stroke={DARK_LINE}
        strokeWidth={4}
      />
      <rect x={-14} y={20} width={28} height={20} rx={5} fill="#7B8499" stroke={DARK_LINE} strokeWidth={4} />
    </g>
  );

  if (n > 1) {
    const count = clamp(Math.round(n), 2, 12);
    const cols = 4;
    return (
      <g transform={`scale(${s})`}>
        {Array.from({ length: count }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const lit = on && p * 1.4 >= i / count;
          return singleBulb((c - 1.5) * 66, (r - 1) * 86, 0.56, lit, i);
        })}
      </g>
    );
  }

  return <g transform={`scale(${s})`}>{singleBulb(0, 0, 1.15, on)}</g>;
};

// 21. snack
export const SnackProp: React.FC<PropProps> = ({ t, pp }) => {
  const fl = Boolean(pp.float);
  const s = popScale(t, pp);
  const dy = fl ? Math.sin(t / 14) * 14 : 0;
  const rot = fl ? Math.sin(t / 19) * 8 : 0;

  return (
    <g transform={`translate(0 ${dy}) scale(${s}) rotate(${rot})`}>
      <rect x={-78} y={28} width={156} height={22} rx={8} fill="#7C859C" stroke={DARK_LINE} strokeWidth={4} />
      <polygon points="-58,28 0,-42 58,28" fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -42 18 Q -22 6 0 18 Q 22 6 42 18" fill="none" stroke="#3DC97A" strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

// 22. elephant
export const ElephantProp: React.FC<PropProps> = ({ t, pp }) => {
  const n = (pp.n as number | undefined) ?? 1;
  const s = popScale(t, pp);

  const drawOne = (x: number, k: number) => (
    <g key={k} transform={`translate(${x} ${Math.sin(t / 15 + k) * 3})`}>
      {/* Body + legs + trunk */}
      <path
        d="M -52 10 Q -54 -44 6 -44 Q 48 -44 58 -12 L 66 24 Q 70 36 82 28"
        fill="#8E97AD"
        stroke={DARK_LINE}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x={-48} y={-28} width={96} height={64} rx={26} fill="#8E97AD" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={-40} y={28} width={22} height={36} rx={6} fill="#8E97AD" stroke={DARK_LINE} strokeWidth={4} />
      <rect x={12} y={28} width={22} height={36} rx={6} fill="#8E97AD" stroke={DARK_LINE} strokeWidth={4} />
      {/* Ear & tusk */}
      <ellipse cx={16} cy={-12} rx={18} ry={24} fill="#757E94" stroke={DARK_LINE} strokeWidth={4} />
      <path d="M 48 6 Q 64 14 68 4" fill="none" stroke="#F6EFE3" strokeWidth={6} strokeLinecap="round" />
      <circle cx={40} cy={-22} r={3.5} fill={DARK_LINE} />
    </g>
  );

  return (
    <g transform={`scale(${s})`}>
      {n === 2 ? (
        <>
          {drawOne(-84, 0)}
          {drawOne(84, 1)}
        </>
      ) : (
        drawOne(0, 0)
      )}
    </g>
  );
};

// 23. mars
export const MarsProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={110} kind="red" o={0.36} />
      <circle r={68} fill="#C44D34" stroke={DARK_LINE} strokeWidth={4} />
      <ellipse cx={-20} cy={-10} rx={22} ry={14} fill="#8F2E1E" />
      <ellipse cx={22} cy={18} rx={18} ry={12} fill="#8F2E1E" />
      <ellipse cx={-4} cy={-56} rx={22} ry={8} fill="#F6EFE3" />
    </g>
  );
};

// 24. moon
export const MoonProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const half = Boolean(pp.half);
  const s = popScale(t, pp);
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <clipPath id={`${id}mclip`}>
          <circle r={66} />
        </clipPath>
      </defs>
      <circle r={68} fill="#B8C1D6" stroke={DARK_LINE} strokeWidth={4} />
      <circle cx={-22} cy={-18} r={14} fill="#8C95AD" />
      <circle cx={18} cy={22} r={18} fill="#8C95AD" />
      <circle cx={20} cy={-24} r={9} fill="#8C95AD" />
      {half ? (
        <rect x={0} y={-70} width={72} height={140} fill="#141828" opacity={0.86} clipPath={`url(#${id}mclip)`} />
      ) : null}
      <circle r={68} fill="none" stroke={DARK_LINE} strokeWidth={4} />
    </g>
  );
};

// 25. earth
export const EarthProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={115} kind="cool" o={0.4} />
      <circle r={68} fill="#2576D6" stroke={DARK_LINE} strokeWidth={4} />
      <path d="M -32 -28 Q -6 -40 16 -12 Q 22 18 -14 32 Q -36 10 -32 -28 Z" fill="#36AE76" />
      <path d="M 18 4 Q 44 -4 48 22 Q 24 38 14 22 Z" fill="#36AE76" />
      <path
        d={`M ${-42 + Math.sin(t / 28) * 6} -10 Q 0 -22 44 -4`}
        stroke="#F6EFE3"
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
        opacity={0.72}
      />
    </g>
  );
};

// 26. sun
export const SunProp: React.FC<PropProps> = ({ t, pp }) => {
  const dim = Boolean(pp.dim);
  const s = popScale(t, pp) * (dim ? 0.58 : 1);
  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={130} kind="warm" o={dim ? 0.25 : 0.72} />
      <g transform={`rotate(${t * 0.4})`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={-76}
            x2={0}
            y2={-96}
            stroke={dim ? '#B8A87C' : PALETTE.gold}
            strokeWidth={6}
            strokeLinecap="round"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
      <circle r={60} fill={dim ? '#C9B888' : '#FFD24C'} stroke={DARK_LINE} strokeWidth={4} />
    </g>
  );
};

// 27. tag
export const TagProp: React.FC<PropProps> = ({ t, pp }) => {
  const text = ((pp.text as string | undefined) ?? 'LABEL').slice(0, 12);
  const col = colorChoice(pp.color, PALETTE.gold);
  const s = popScale(t, pp);
  const sway = Math.sin(t / 15) * 4;

  return (
    <g transform={`scale(${s}) rotate(${sway})`}>
      <path d="M -92 0 Q -120 -18 -134 -44" fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" />
      <polygon
        points="-98,-26 -72,-44 98,-44 98,44 -72,44 -98,26"
        fill="#F6EFE3"
        stroke={DARK_LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <circle cx={-74} cy={0} r={8} fill="#181422" stroke={col} strokeWidth={3} />
      <text x={14} y={6} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={26} fill={PALETTE.pill}>
        {text}
      </text>
      <line x1={-46} y1={22} x2={74} y2={22} stroke={col} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

// 28. capsule
export const CapsuleProp: React.FC<PropProps> = ({ t, pp }) => {
  const hot = Boolean(pp.hot);
  const s = popScale(t, pp);

  return (
    <g transform={`scale(${s})`}>
      {hot ? (
        <g>
          <Glow x={0} y={24} r={120} kind="red" o={0.78} />
          <path d="M -78 24 Q 0 110 78 24" fill="#FF6E3A" opacity={0.48 + 0.2 * Math.sin(t / 4)} />
        </g>
      ) : null}
      <polygon points="-58,14 -30,-48 30,-48 58,14" fill="#8C96AC" stroke={DARK_LINE} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -66 16 Q 0 46 66 16" stroke={hot ? '#FFF1B8' : '#C9633B'} strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d="M -66 16 Q 0 46 66 16" stroke={DARK_LINE} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};
