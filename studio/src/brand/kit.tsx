// IFMOSPHERE BRAND KIT: LOCKED. Labels, cards, titles and background helpers in the Film 2 "Jump" style.
// Episodes use these for every on-screen word; a set may add its own scenery, but text goes through these.

import React from 'react';
import { clamp, backOut } from '../engine/anim';
import { KitDefs, Stars, Sun, NightSky, DuskSky, Rays } from '../engine/kit';
import { SetDefs } from '../engine/light';
import { FONT } from '../engine/fonts';
import { PALETTE, STROKE, TYPE, CARD } from './style';

/** Put once inside every shot's <svg>: rim-light filters, blurs, set gradients. */
export const BrandDefs: React.FC = () => (
  <>
    <KitDefs />
    <SetDefs />
  </>
);

/** A floating mono label (diagram titles, "0 m"), popping in from t = 0. */
export const BrandLabel: React.FC<{ x: number; y: number; t: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end' }> = ({
  x, y, t, text, size = TYPE.schLabelSize, color = PALETTE.cream, anchor = 'middle',
}) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 6));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <text textAnchor={anchor} fontFamily={FONT.ui} fontSize={size} fill={color} letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/** The fact pill: a dark rounded card, a small caps label and a big coloured value ("PLUTO JUMP / ~7 m HIGH"). */
export const BrandPill: React.FC<{ x: number; y: number; t: number; label: string; value: string; color?: string; scale?: number }> = ({
  x, y, t, label, value, color = PALETTE.orange, scale = 1,
}) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7)) * scale;
  const w = Math.max(290, Math.max(label.length * 19, value.length * 34) + 74);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-54} width={w} height={108} rx={CARD.pillRadius} fill={PALETTE.pill} opacity={CARD.pillOpacity} stroke={color} strokeWidth={STROKE.labelBorder} />
      <text y={-14} textAnchor="middle" fontFamily={FONT.ui} fontSize={TYPE.labelSize} fill={PALETTE.pillSub} letterSpacing={3}>
        {label}
      </text>
      <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={TYPE.valueSize} fill={color}>
        {value}
      </text>
    </g>
  );
};

/** A small chip tag in world space (the "~7 m HIGH" marker on a scale bar). */
export const BrandChip: React.FC<{ x: number; y: number; t: number; text: string; color?: string }> = ({ x, y, t, text, color = PALETTE.green }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 6));
  const w = text.length * 15 + 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-20} width={w} height={40} rx={10} fill={PALETTE.pill} opacity={CARD.pillOpacity} stroke={color} strokeWidth={2.5} />
      <text y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** The chapter card in the top-left corner: a dot, the place in the title face, the fact in mono. */
export const BrandChapter: React.FC<{ t: number; title: string; sub: string; color?: string; x?: number; y?: number }> = ({
  t, title, sub, color = PALETTE.gold, x = 76, y = 82,
}) => {
  const p = backOut(clamp((t - 1) / 8));
  const w = Math.max(420, Math.max(title.length * 34, sub.length * 22) + 90);
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <rect x={0} y={0} width={w} height={116} rx={CARD.chapterRadius} fill={PALETTE.pill} opacity={CARD.pillOpacity} stroke={color} strokeWidth={STROKE.labelBorder} />
      <circle cx={38} cy={38} r={10} fill={color} />
      <text x={62} y={48} fontFamily={FONT.title} fontWeight={800} fontSize={TYPE.chapterSize} fill={PALETTE.cream} letterSpacing={3}>
        {title}
      </text>
      <text x={30} y={92} fontFamily={FONT.ui} fontSize={26} fill={color} letterSpacing={2.5}>
        {sub}
      </text>
    </g>
  );
};

/** The two-line title: a cream first line, an orange second line with gold accent words, dark stroke, orange glow. */
export const BrandTitle: React.FC<{ t: number; lines: [string, string]; accentWords?: string[]; x?: number; y?: number; size?: number }> = ({
  t, lines, accentWords = [], x = 960, y = 185, size = 112,
}) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const acc = new Set(accentWords.map((w) => w.toUpperCase()));
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${pop(2)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size * 0.52} letterSpacing={5} fill={PALETTE.cream} stroke={PALETTE.titleStroke} strokeWidth={9} paintOrder="stroke">
          {lines[0]}
        </text>
      </g>
      <g transform={`translate(${x} ${y + size * 0.98}) scale(${pop(5)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={PALETTE.orange} stroke={PALETTE.titleStroke} strokeWidth={STROKE.titleStroke} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 24px rgba(255,138,61,0.55))' }}>
          {lines[1].split(' ').map((w, i) => (
            <tspan key={i} fill={acc.has(w.replace(/[^\w]/g, '').toUpperCase()) ? PALETTE.gold : undefined}>
              {(i ? ' ' : '') + w}
            </tspan>
          ))}
        </text>
      </g>
    </g>
  );
};

/** A flat ground plane with a pale rim line along its top edge (the Jump treatment for every world). */
export const GroundPlane: React.FC<{ y: number; fill: string; rim?: string }> = ({ y, fill, rim = '#D5DCF0' }) => (
  <g>
    <rect x={-1200} y={y} width={4400} height={2400} fill={fill} />
    <line x1={-1200} y1={y} x2={3200} y2={y} stroke={rim} strokeWidth={3.5} opacity={0.65} />
  </g>
);

/** Deep space: near-black fill, twinkling stars, optional sun with slow rays. groundY/groundFill add a world surface. */
export const SpaceBackdrop: React.FC<{ t: number; seed?: number; sun?: { x: number; y: number; r?: number }; groundY?: number; groundFill?: string }> = ({
  t, seed = 103, sun, groundY, groundFill = '#565A6B',
}) => (
  <g>
    <rect x={-1400} y={-1600} width={4800} height={4400} fill={PALETTE.space} />
    <Stars seed={seed} x0={-900} y0={-1200} w={3720} h={2100} t={t} n={120} o={0.92} />
    {sun ? <Sun x={sun.x} y={sun.y} r={sun.r ?? 54} t={t} /> : null}
    {groundY !== undefined ? <GroundPlane y={groundY} fill={groundFill} /> : null}
  </g>
);

/** A blue night over a world (the Pluto/house look): night gradient, stars, optional light rays, ground. */
export const NightBackdrop: React.FC<{ t: number; id: string; horizonY: number; seed?: number; rays?: { x: number; y: number }; groundFill?: string }> = ({
  t, id, horizonY, seed = 71, rays, groundFill = '#3A4560',
}) => (
  <g>
    <NightSky id={id} horizonY={horizonY} />
    <Stars seed={seed} x0={-900} y0={-1200} w={3720} h={horizonY + 1200} t={t} n={110} o={0.85} />
    {rays ? <Rays x={rays.x} y={rays.y} t={t} o={0.18} color="#DCE6FF" /> : null}
    <GroundPlane y={horizonY} fill={groundFill} />
  </g>
);

/** A dusk sky for Earth scenes. */
export const DuskBackdrop: React.FC<{ t: number; id: string; horizonY: number; sun?: { x: number; y: number }; groundFill?: string }> = ({
  t, id, horizonY, sun, groundFill = '#2A1B45',
}) => (
  <g>
    <DuskSky id={id} horizonY={horizonY} />
    {sun ? <Sun x={sun.x} y={sun.y} r={60} t={t} /> : null}
    <GroundPlane y={horizonY} fill={groundFill} rim="#FFB15A" />
  </g>
);
