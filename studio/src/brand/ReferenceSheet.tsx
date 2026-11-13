// LOCKED. The Pip reference sheet and the neutral check still.
//   npx remotion still src/index.ts BrandSheet out/brand/pip-reference.png
//   npx remotion still src/index.ts BrandPipCheck out/brand/pip-neutral.png   (check_style.py --visual compares this)

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT } from '../engine/fonts';
import { HEAD } from '../engine/rig';
import { Pip, pipPose, PIP_EXPRESSIONS } from './Pip';
import { BrandDefs, BrandPill, BrandChapter, BrandLabel, BrandChip, BrandTitle, NightBackdrop, SpaceBackdrop } from './kit';
import { PALETTE, PIP_COLORS } from './style';

export const SHEET_W = 2400;
export const SHEET_H = 1500;

const Cap: React.FC<{ x: number; y: number; text: string; size?: number; color?: string }> = ({ x, y, text, size = 26, color = PALETTE.cream }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill={color} letterSpacing={2}>
    {text}
  </text>
);

export const ReferenceSheet: React.FC = () => {
  const groundY = 820;
  const turn: { name: string; o: Parameters<typeof pipPose>[1]; preset: Parameters<typeof pipPose>[0] }[] = [
    { name: 'FRONT', preset: 'front', o: {} },
    { name: 'THREE-QUARTER', preset: 'threeQuarter', o: {} },
    { name: 'SIDE', preset: 'side', o: {} },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
      <svg width={SHEET_W} height={SHEET_H} viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}>
        <BrandDefs />
        {/* turnaround on the Jump night-world backdrop */}
        <svg x={0} y={0} width={1200} height={1000} viewBox="0 0 1200 1000" overflow="hidden">
          <NightBackdrop t={0} id="sheetNight" horizonY={groundY} rays={{ x: 160, y: 140 }} />
          {turn.map((p, i) => (
            <g key={p.name}>
              <Pip pose={pipPose(p.preset, { x: 220 + i * 380, y: groundY - 140, scale: 1, ...p.o })} rim="rimBlue" shadow={0.8} />
              <Cap x={220 + i * 380} y={groundY + 80} text={p.name} />
            </g>
          ))}
          <BrandLabel x={600} y={90} t={20} text="PIP  -  THE ONE CHARACTER" size={40} color={PALETTE.gold} />
        </svg>
        {/* expressions: head close-ups */}
        <text x={1800} y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={PALETTE.gold} letterSpacing={2}>
          EXPRESSIONS
        </text>
        {PIP_EXPRESSIONS.map((e, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cx = 1440 + col * 360;
          const cy = 230 + row * 290;
          return (
            <g key={e}>
              <clipPath id={`cell${i}`}>
                <rect x={cx - 150} y={cy - 125} width={300} height={230} rx={22} />
              </clipPath>
              <rect x={cx - 150} y={cy - 125} width={300} height={230} rx={22} fill="#221C33" />
              <g clipPath={`url(#cell${i})`}>
                <Pip pose={pipPose('stand', { x: cx, y: cy + 10 - HEAD.y * 1.15, scale: 1.15, expr: e, glasses: e === 'cool' ? 1 : 0 })} rim="rimR" shadow={0} />
              </g>
              <Cap x={cx} y={cy + 140} text={e.toUpperCase()} size={24} />
            </g>
          );
        })}
        {/* sample labels and title on the space backdrop */}
        <svg x={0} y={1000} width={1200} height={500} viewBox="0 0 1920 800" overflow="hidden">
          <SpaceBackdrop t={0} sun={{ x: 1700, y: 120 }} groundY={640} />
          <BrandTitle t={30} lines={['WHAT IF YOU JUMPED', 'ON EVERY WORLD?']} accentWords={['EVERY', 'WORLD']} y={170} />
          <BrandPill x={480} y={480} t={20} label="PLUTO JUMP" value="~7 m HIGH" color={PALETTE.green} />
          <BrandPill x={1440} y={480} t={20} label="ROCK TEMPERATURE" value="~465 °C" color={PALETTE.red} />
          <BrandChip x={960} y={470} t={20} text="~7 m HIGH" />
        </svg>
        <g>
          <BrandChapter t={30} title="THE MOON" sub="GRAVITY 0.17 g" x={1260} y={1030} />
          <BrandLabel x={1530} y={1220} t={20} text="EARTH JUMP vs WORLD RECORD" size={30} color={PALETTE.gold} />
          {/* swatches */}
          {(
            [
              ['SKIN', PIP_COLORS.skin],
              ['HOODIE', PIP_COLORS.jacket],
              ['STRINGS', PIP_COLORS.accent],
              ['SHOES', PIP_COLORS.shoe],
              ['LINE', PIP_COLORS.line],
              ['FACE', PIP_COLORS.face],
              ['ORANGE', PALETTE.orange],
              ['GOLD', PALETTE.gold],
              ['SKY', PALETTE.sky],
              ['GREEN', PALETTE.green],
              ['RED', PALETTE.red],
              ['PILL', PALETTE.pill],
            ] as [string, string][]
          ).map(([n, c], i) => {
            const x = 1270 + (i % 6) * 185;
            const y = 1290 + Math.floor(i / 6) * 100;
            return (
              <g key={n}>
                <rect x={x} y={y} width={56} height={56} rx={10} fill={c} stroke="#F6EFE3" strokeWidth={2} />
                <text x={x + 66} y={y + 24} fontFamily={FONT.ui} fontSize={19} fill={PALETTE.cream}>{n}</text>
                <text x={x + 66} y={y + 50} fontFamily={FONT.ui} fontSize={17} fill={PALETTE.pillSub}>{c.toUpperCase()}</text>
              </g>
            );
          })}
          <text x={1830} y={1270} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill={PALETTE.pillSub}>
            OUTLINE 4 PX  ·  LIMBS 12/11 + 7 PX OUTLINE  ·  FACE 5 PX  ·  RIM LIGHT FILTER ON PIP
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Pip neutral, front, on a flat background: the still the gate compares against branding/pip-neutral.png. */
export const PipCheck: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
    <svg width={600} height={700} viewBox="0 0 600 700">
      <BrandDefs />
      <Pip pose={pipPose('front', { x: 300, y: 420, scale: 1 })} rim="rimR" shadow={0.6} />
    </svg>
  </AbsoluteFill>
);
