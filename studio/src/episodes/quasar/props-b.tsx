import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { Glow } from '../../engine/light';
import { clamp, lerp, easeInOut } from '../../engine/anim';
import type { PropProps } from './render';
import { propColor, propNum, popScale } from './props-a';

const DARK_OUTLINE = '#121019';

/** 12. EUCLID: Icon of ESA's Euclid space telescope. */
export const EuclidProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const bob = Math.sin(t * 0.08) * 3.5;

  return (
    <g transform={`translate(0 ${bob}) scale(${s}) rotate(-12)`}>
      {pp.glow ? <Glow x={-48} y={-8} r={85} kind="cool" o={0.62} /> : null}
      {/* Gold service module below */}
      <polygon points="4,22 50,22 56,50 -2,50" fill="#E6A532" stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      {/* White-silver cylindrical body */}
      <rect x={-48} y={-32} width={104} height={54} rx={8} fill="#EAEFF8" stroke={DARK_OUTLINE} strokeWidth={4} />
      <rect x={-48} y={2} width={104} height={20} rx={4} fill="#BCC7DC" opacity={0.7} />
      {/* Dark open aperture */}
      <ellipse cx={-48} cy={-5} rx={10} ry={26} fill="#0B0914" stroke={DARK_OUTLINE} strokeWidth={4} />
      {/* Dark-blue solar-panel sunshield */}
      <polygon points="-32,-56 58,-64 66,54 -22,62" fill="#1B3568" stroke={DARK_OUTLINE} strokeWidth={4} opacity={0.94} />
      <line x1={12} y1={-60} x2={20} y2={58} stroke="#3E6FC7" strokeWidth={2.5} />
    </g>
  );
};

/** 13. WEBB: Icon of the James Webb Space Telescope (gold hex mirror + silver diamond sunshield). */
export const WebbProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const bob = Math.sin(t * 0.07) * 3.5;
  const hex = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 })
      .map((_, i) => {
        const a = (i * Math.PI) / 3;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      })
      .join(' ');
  const r = 13.5;
  const centers: [number, number][] = [
    [0, -24],
    [0, -24 - r * 1.73],
    [0, -24 + r * 1.73],
    [r * 1.5, -24 - r * 0.86],
    [r * 1.5, -24 + r * 0.86],
    [-r * 1.5, -24 - r * 0.86],
    [-r * 1.5, -24 + r * 0.86],
  ];

  return (
    <g transform={`translate(0 ${bob}) scale(${s})`}>
      {pp.glow ? <Glow x={0} y={-22} r={98} kind="warm" o={0.58} /> : null}
      {/* 5-layer silver diamond sunshield */}
      <polygon points="-76,30 0,6 76,30 0,60" fill="#9DA7C2" stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <polygon points="-68,24 0,2 68,24 0,48" fill="#DCE2F2" stroke={DARK_OUTLINE} strokeWidth={3.5} strokeLinejoin="round" />
      {/* Gold segmented mirror */}
      {centers.map(([cx, cy], i) => (
        <polygon key={i} points={hex(cx, cy, r - 0.5)} fill="#F2B33D" stroke={DARK_OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      ))}
      {/* Secondary mirror tripod boom */}
      <polyline points="-18,-36 0,-64 18,-36" fill="none" stroke={DARK_OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <circle cx={0} cy={-64} r={5} fill="#2A2638" stroke={DARK_OUTLINE} strokeWidth={3} />
    </g>
  );
};

/** 14. BH: Small black-hole icon with photon ring, tilted orange disc, optional glow & cyan jets. */
export const BhProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const s = popScale(t, pp);
  const wob = Math.sin(t * 0.1) * 2;

  return (
    <g transform={`scale(${s}) rotate(${-12 + wob})`}>
      {pp.glow ? <Glow x={0} y={0} r={108} kind="warm" o={0.62} /> : null}
      <defs>
        <clipPath id={`${id}_b`}>
          <rect x={-110} y={-50} width={220} height={50} />
        </clipPath>
        <clipPath id={`${id}_f`}>
          <rect x={-110} y={0} width={220} height={50} />
        </clipPath>
      </defs>

      {pp.jets ? (
        <g>
          {[-1, 1].map((d) => (
            <path key={d} d={`M -6 ${d * 18} L -14 ${d * 96} L 14 ${d * 96} L 6 ${d * 18} Z`} fill="#64D2FF" stroke={DARK_OUTLINE} strokeWidth={3} opacity={0.85} />
          ))}
        </g>
      ) : null}

      <g clipPath={`url(#${id}_b)`}>
        <ellipse cx={0} cy={0} rx={84} ry={24} fill="#FF6E38" stroke={DARK_OUTLINE} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={58} ry={16} fill="#F2B33D" />
      </g>

      <circle cx={0} cy={0} r={24} fill="#05040A" stroke="#FFF4D6" strokeWidth={4} />

      <g clipPath={`url(#${id}_f)`}>
        <ellipse cx={0} cy={0} rx={84} ry={24} fill="#FF6E38" stroke={DARK_OUTLINE} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={58} ry={16} fill="#F2B33D" />
      </g>
      <ellipse cx={0} cy={0} rx={84} ry={24} fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
    </g>
  );
};

/** 15. SUN: Smile-free face-less outlined yellow Sun disc with rotating short rays. */
export const SunProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const label = String(pp.label ?? '');

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={110} kind="warm" o={0.55} />
      <g transform={`rotate(${t * 0.45})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <polygon key={i} points="-6,-50 0,-68 6,-50" transform={`rotate(${i * 30})`} fill="#FFD447" stroke={DARK_OUTLINE} strokeWidth={3} strokeLinejoin="round" />
        ))}
      </g>
      <circle cx={0} cy={0} r={44} fill="#FFD447" stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle cx={-10} cy={-10} r={24} fill="#FFE99A" opacity={0.65} />
      {label ? (
        <text y={92} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={19} fill={PALETTE.gold} letterSpacing={1.5}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** 16. GALAXY: Outlined spiral galaxy icon, cream core + two lilac (or red) spirals. */
export const GalaxyProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const isRed = Boolean(pp.red);
  const spiralCol = isRed ? '#E65C50' : '#B792EB';
  const spiralHi = isRed ? '#FF9A8A' : '#E2CCFF';

  return (
    <g transform={`scale(${s}) rotate(${t * 0.45})`}>
      <Glow x={0} y={0} r={90} kind={isRed ? 'red' : 'cool'} o={0.45} />
      <path d="M -68 6 Q -42 -48 0 -8 Q 42 -48 70 -8" fill="none" stroke={DARK_OUTLINE} strokeWidth={15} strokeLinecap="round" />
      <path d="M 68 -6 Q 42 48 0 8 Q -42 48 -70 8" fill="none" stroke={DARK_OUTLINE} strokeWidth={15} strokeLinecap="round" />
      <path d="M -68 6 Q -42 -48 0 -8 Q 42 -48 70 -8" fill="none" stroke={spiralCol} strokeWidth={8.5} strokeLinecap="round" />
      <path d="M 68 -6 Q 42 48 0 8 Q -42 48 -70 8" fill="none" stroke={spiralHi} strokeWidth={8.5} strokeLinecap="round" />
      <circle cx={0} cy={0} r={18} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <circle cx={-48} cy={-22} r={3.5} fill={PALETTE.cream} />
      <circle cx={46} cy={24} r={3.5} fill={PALETTE.cream} />
    </g>
  );
};

/** 17. WAVE: Horizontal light wave squiggle stretching longer and shifting blue -> red -> infrared maroon. */
export const WaveProp: React.FC<PropProps> = ({ t, p, pp }) => {
  const s = popScale(t, pp);
  const target = clamp(propNum(pp, 'stretch', 0.5));
  const label = String(pp.label ?? '');
  const cur = lerp(Math.max(0.08, target * 0.45), target, easeInOut(clamp(p / 0.85)));

  const w = 240;
  const wl = lerp(34, 150, cur);
  const amp = 24;
  let d = '';
  for (let x = -w / 2; x <= w / 2; x += 6) {
    const y = Math.sin(((x - t * 3.5) / wl) * Math.PI * 2) * amp;
    d += `${x === -w / 2 ? 'M' : ' L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  const strokeCol = cur < 0.35 ? '#3A86FF' : cur < 0.72 ? '#E8414E' : '#6A1429';
  return (
    <g transform={`scale(${s})`}>
      {label ? (
        <text y={-48} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={19} fill={PALETTE.cream} letterSpacing={1.8}>
          {label}
        </text>
      ) : null}
      <path d={d} fill="none" stroke={DARK_OUTLINE} strokeWidth={12} strokeLinecap="round" />
      <path d={d} fill="none" stroke={strokeCol} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/** 18. PHOTON: Glowing light spark with comet tail behind it. */
export const PhotonProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const isRed = pp.color === 'red';
  const coreCol = isRed ? '#FF4B4B' : '#FFF9EB';
  const tailCol = isRed ? '#FF7A7A' : '#FFE8B8';
  const bob = Math.sin(t * 0.22) * 3.5;

  return (
    <g transform={`translate(0 ${bob}) scale(${s})`}>
      <Glow x={0} y={0} r={76} kind={isRed ? 'red' : 'warm'} o={0.72} />
      <path d="M -92 -4 L -12 -10 L -12 10 L -92 4 Z" fill={tailCol} opacity={0.55} />
      <line x1={-66} y1={0} x2={-12} y2={0} stroke={coreCol} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      <path d="M 0 -24 L 5 -5 L 24 0 L 5 5 L 0 24 L -5 5 L -24 0 L -5 -5 Z" fill={tailCol} stroke={DARK_OUTLINE} strokeWidth={2.5} />
      <circle cx={0} cy={0} r={13} fill={coreCol} stroke={DARK_OUTLINE} strokeWidth={4} />
    </g>
  );
};

/** 19. PLATE: Outlined cream dinner plate, fork beside it, and one tiny glowing crumb in the middle. */
export const PlateProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const tw = 0.65 + 0.35 * Math.sin(t * 0.2);

  return (
    <g transform={`scale(${s})`}>
      {/* Fork */}
      <g transform="translate(-108 0)">
        <rect x={-5} y={-4} width={10} height={46} rx={4} fill="#DCE2EF" stroke={DARK_OUTLINE} strokeWidth={3.5} />
        <path d="M -11 -4 L -11 -34 M 0 -4 L 0 -36 M 11 -4 L 11 -34 M -11 -4 L 11 -4" fill="none" stroke={DARK_OUTLINE} strokeWidth={4} strokeLinecap="round" />
      </g>
      {/* Perspective plate */}
      <ellipse cx={0} cy={4} rx={84} ry={38} fill="#D8CFC0" stroke={DARK_OUTLINE} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={84} ry={36} fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={54} ry={22} fill="none" stroke="#CEC2AE" strokeWidth={3} />
      {/* Tiny glowing crumb */}
      <Glow x={0} y={0} r={34} kind="warm" o={0.68 * tw} />
      <circle cx={0} cy={0} r={5.5} fill={PALETTE.gold} stroke={DARK_OUTLINE} strokeWidth={2.5} />
    </g>
  );
};

/** 20. TAG: Swaying cream tag on a string with pp.text and coloured underline. */
export const TagProp: React.FC<PropProps> = ({ t, pp }) => {
  const s = popScale(t, pp);
  const text = String(pp.text ?? '').slice(0, 12);
  const col = propColor(pp.color, PALETTE.gold);
  const sway = Math.sin(t * 0.075) * 3.5;

  return (
    <g transform={`scale(${s}) rotate(${sway})`}>
      <path d="M -86 -16 Q -108 -34 -126 -14" fill="none" stroke={col} strokeWidth={4} strokeLinecap="round" />
      <polygon points="-86,-20 -66,-32 82,-32 82,32 -66,32 -86,20" fill={PALETTE.cream} stroke={DARK_OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={-68} cy={0} r={6} fill="#181526" stroke={DARK_OUTLINE} strokeWidth={3} />
      <text x={8} y={6} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.pill} letterSpacing={1}>
        {text}
      </text>
      <line x1={-46} y1={17} x2={64} y2={17} stroke={col} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** 21. EARTH: Outlined blue-green Earth with clouds, or glowing molten ball when pp.young is true. */
export const EarthProp: React.FC<PropProps> = ({ t, pp, id }) => {
  const s = popScale(t, pp);
  const young = Boolean(pp.young);
  const drift = ((t * 0.6) % 44) - 22;

  return (
    <g transform={`scale(${s})`}>
      <Glow x={0} y={0} r={96} kind={young ? 'red' : 'cool'} o={young ? 0.62 : 0.4} />
      <defs>
        <clipPath id={`${id}_ec`}>
          <circle cx={0} cy={0} r={48} />
        </clipPath>
      </defs>
      <circle cx={0} cy={0} r={50} fill={young ? '#9C211B' : '#2C7AD6'} stroke={DARK_OUTLINE} strokeWidth={4} />
      <g clipPath={`url(#${id}_ec)`}>
        {young ? (
          <g>
            <path d="M -45 -18 Q -10 -4 12 -28 Q 34 -12 46 14" fill="none" stroke="#FF7B29" strokeWidth={7} strokeLinecap="round" />
            <path d="M -38 22 Q 0 6 36 28" fill="none" stroke="#FFD24D" strokeWidth={5} strokeLinecap="round" />
            <circle cx={-12} cy={-8} r={10} fill="#FF8E3C" />
          </g>
        ) : (
          <g transform={`translate(${drift * 0.35} 0)`}>
            <path d="M -28 -26 Q -4 -30 6 -12 Q 16 8 -6 22 Q -28 12 -28 -26 Z" fill="#39B87A" />
            <path d="M 14 -6 Q 36 -16 44 10 Q 28 32 10 18 Z" fill="#39B87A" />
            <path d="M -36 -8 Q -10 -16 14 -6" fill="none" stroke="#FFFFFF" strokeWidth={5.5} strokeLinecap="round" opacity={0.85} />
            <path d="M -8 22 Q 18 14 38 24" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          </g>
        )}
      </g>
      <circle cx={0} cy={0} r={50} fill="none" stroke={DARK_OUTLINE} strokeWidth={4} />
    </g>
  );
};
