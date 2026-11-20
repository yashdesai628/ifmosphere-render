import React from 'react';
import { FONTS, PALETTE } from '../../brand';
import { clamp, easeInOut, easeOut, backOut, lerp, rnd } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { NightSky, Stars, Rays } from '../../engine/kit';
import type { SetProps } from './render';
import {
  DARK_LINE,
  num,
  str,
  stageLayout,
  DeepSpaceFar,
  MidAtmosphere,
  NearEdges,
} from './sets-shared';

/** 1. fov: Andromeda spiral galaxy with Hubble tiny square and Roman 100x 2:1 cyan rectangle. */
export const FovSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const hub = num(sp, 'hub', 0);
  const rom = num(sp, 'rom', 0);
  const spT = num(sp, 't', 0.2);
  const label = num(sp, 'label', 0);

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={111}
        stars={140}
        glow={rom > 0.3 ? 'cool' : 'warm'}
        rayColor={rom > 0.3 ? '#8DE8FF' : '#FFE4B8'}
        rayO={0.07}
        glowX={cx}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={115} kind="soft" />;
  }

  const push = 0.94 + spT * 0.14 + easeInOut(p) * 0.05;
  const gRot = -22 + Math.sin(t / 90) * 0.8;
  const gx = cx + 40 * s;
  const gy = cy - 16 * s;

  const hubPop = hub > 0 ? backOut(clamp(p / 0.35)) * hub : 0;
  const romPop = rom > 0 ? easeOut(clamp(p / 0.45)) * rom : 0;
  const hubSide = 28 * s;
  const romW = 392 * s;
  const romH = 196 * s;
  const nudge = spT > 0.85 && rom >= 1;

  return (
    <g>
      <g transform={`translate(${gx} ${gy}) scale(${push}) rotate(${gRot})`}>
        <ellipse cx={-150 * s} cy={-165 * s} rx={42 * s} ry={28 * s} fill="#9DB9F0" opacity={0.38} stroke={DARK_LINE} strokeWidth={3} />
        <ellipse cx={195 * s} cy={175 * s} rx={28 * s} ry={22 * s} fill="#E7D8C2" opacity={0.45} stroke={DARK_LINE} strokeWidth={3} />

        <ellipse cx={0} cy={0} rx={460 * s} ry={175 * s} fill="#1B2E66" opacity={0.55} />
        <ellipse cx={0} cy={0} rx={420 * s} ry={150 * s} fill="#2A468F" stroke={DARK_LINE} strokeWidth={4} opacity={0.88} />
        <path
          d={`M ${-370 * s} ${15 * s} Q ${-220 * s} ${-135 * s} ${40 * s} ${-118 * s} Q ${290 * s} ${-98 * s} ${380 * s} ${10 * s} Q ${240 * s} ${128 * s} ${-30 * s} ${112 * s} Q ${-270 * s} ${96 * s} ${-370 * s} ${15 * s} Z`}
          fill="#5B85DE"
          opacity={0.78}
        />
        <path
          d={`M ${-295 * s} ${-10 * s} Q ${-145 * s} ${-96 * s} ${50 * s} ${-78 * s} Q ${220 * s} ${-62 * s} ${295 * s} ${12 * s} Q ${170 * s} ${88 * s} ${-30 * s} ${74 * s} Q ${-210 * s} ${62 * s} ${-295 * s} ${-10 * s} Z`}
          fill="#A6C5FF"
          opacity={0.82}
        />

        <path
          d={`M ${-310 * s} ${12 * s} Q ${-150 * s} ${-74 * s} ${140 * s} ${-56 * s} M ${-210 * s} ${56 * s} Q ${20 * s} ${82 * s} ${280 * s} ${22 * s}`}
          fill="none"
          stroke="#4E2D24"
          strokeWidth={14 * s}
          strokeLinecap="round"
          opacity={0.78}
        />
        <path
          d={`M ${-240 * s} ${-36 * s} Q ${0} ${-52 * s} ${235 * s} ${-14 * s}`}
          fill="none"
          stroke="#361E19"
          strokeWidth={8 * s}
          strokeLinecap="round"
          opacity={0.72}
        />

        <Glow x={0} y={0} r={190 * s} kind="warm" o={0.72} />
        <ellipse cx={0} cy={0} rx={125 * s} ry={66 * s} fill="#F5DFB6" opacity={0.92} />
        <ellipse cx={0} cy={0} rx={62 * s} ry={34 * s} fill="#FFF7E6" />

        {Array.from({ length: 28 }).map((_, i) => {
          const ang = rnd(21, i) * Math.PI * 2;
          const rad = 0.25 + rnd(22, i) * 0.72;
          const sx = Math.cos(ang) * 370 * s * rad;
          const sy = Math.sin(ang) * 120 * s * rad;
          const tw = 0.4 + 0.6 * Math.sin(t / 10 + i * 1.9);
          return <circle key={i} cx={sx} cy={sy} r={1.8 + rnd(23, i) * 2.5} fill={i % 3 === 0 ? '#FFE6B0' : '#DCEAFF'} opacity={tw} />;
        })}
      </g>

      <g transform={`translate(${gx} ${gy})`}>
        {rom > 0 ? (
          <g opacity={clamp(romPop)}>
            <Glow x={0} y={0} r={240 * s} kind="cool" o={0.28 * romPop} />
            <rect
              x={-romW / 2}
              y={-romH / 2}
              width={romW}
              height={romH}
              rx={6}
              fill="#3EE0FF"
              fillOpacity={0.1}
              stroke={PALETTE.cyan}
              strokeWidth={4.5}
              strokeDasharray={rom < 0.99 ? `${romW * 4 * romPop} 2000` : undefined}
            />
            {nudge ? (
              <rect
                x={-romW / 2 + romW * 0.68}
                y={-romH / 2 - romH * 0.32}
                width={romW}
                height={romH}
                rx={6}
                fill="#3EE0FF"
                fillOpacity={0.05}
                stroke={PALETTE.cyan}
                strokeWidth={3}
                strokeDasharray="10 8"
                opacity={0.45 + 0.35 * Math.sin(t / 7)}
              />
            ) : null}
            {label > 0 ? (
              <g transform={`translate(${romW / 2 - 64} ${-romH / 2 - 14})`}>
                <rect x={-52} y={-18} width={104} height={28} rx={7} fill="#0F1429" stroke={PALETTE.cyan} strokeWidth={2.5} />
                <text y={3} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cyan} letterSpacing={2}>
                  ROMAN
                </text>
              </g>
            ) : null}
          </g>
        ) : null}

        {hub > 0 ? (
          <g transform={`translate(${-36 * s} ${-24 * s}) scale(${hubPop})`}>
            <rect x={-hubSide / 2} y={-hubSide / 2} width={hubSide} height={hubSide} fill="#FFFFFF" fillOpacity={0.18} stroke={DARK_LINE} strokeWidth={7} />
            <rect x={-hubSide / 2} y={-hubSide / 2} width={hubSide} height={hubSide} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} />
            {label > 0 ? (
              <g transform="translate(-56 -34)">
                <line x1={18} y1={14} x2={44} y2={28} stroke={PALETTE.cream} strokeWidth={2.5} />
                <rect x={-50} y={-14} width={96} height={26} rx={7} fill="#0F1429" stroke={PALETTE.cream} strokeWidth={2.5} />
                <text y={5} textAnchor="middle" fontFamily={FONTS.ui} fontSize={17} fill={PALETTE.cream} letterSpacing={2}>
                  HUBBLE
                </text>
              </g>
            ) : null}
          </g>
        ) : null}
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={112} lights={[[gx, gy, 540]]} veilO={0.34} />
    </g>
  );
};

/** 2. grid: 2:1 cyan sensor frame with 10x10 grid of small squares filling gold one by one. */
export const GridSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const fillTarget = clamp(num(sp, 'fill', 100), 0, 100);
  const zoomVal = clamp(num(sp, 'zoom', 1), 0, 1);
  const glowKind = str(sp, 'glow', 'gold') === 'cyan' ? 'cyan' : 'gold';

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={211}
        stars={70}
        glow={glowKind === 'cyan' ? 'cool' : 'warm'}
        rayColor={glowKind === 'cyan' ? '#70E8FF' : '#FFE099'}
        rayO={0.1}
        glowX={cx}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={219} kind="truss" />;
  }

  const litFrac = easeOut(clamp(p / 0.82));
  const startCount = Math.max(0, fillTarget - Math.min(fillTarget, 24));
  const litExact = lerp(startCount, fillTarget, litFrac);
  const litCount = Math.floor(litExact);

  const frameW = 780 * s;
  const frameH = 390 * s;
  const cell = 31 * s;
  const gap = 4.2 * s;
  const gridSpan = cell * 10 + gap * 9;
  const zoomScale = lerp(1.42, 1.0, easeInOut(clamp(zoomVal * 0.8 + p * 0.2)));
  const focusShiftX = lerp(90 * s, 0, zoomVal);
  const focusShiftY = lerp(65 * s, 0, zoomVal);

  return (
    <g>
      <Glow x={cx} y={cy - 10} r={340 * s} kind={glowKind === 'cyan' ? 'cool' : 'warm'} o={0.48} />

      <g transform={`translate(${cx} ${cy - 12 * s}) scale(${zoomScale}) translate(${focusShiftX} ${focusShiftY})`}>
        <rect x={-frameW / 2} y={-frameH / 2} width={frameW} height={frameH} rx={14} fill="#0D132B" fillOpacity={0.92} stroke={DARK_LINE} strokeWidth={10} />
        <rect x={-frameW / 2} y={-frameH / 2} width={frameW} height={frameH} rx={14} fill="none" stroke={PALETTE.cyan} strokeWidth={4.5} />

        {[-1, 1].map((side) => (
          <g key={side} opacity={0.45}>
            <line x1={side * (frameW / 2 - 42 * s)} y1={-frameH * 0.35} x2={side * (frameW / 2 - 42 * s)} y2={frameH * 0.35} stroke={PALETTE.cyan} strokeWidth={2} strokeDasharray="6 8" />
            <circle cx={side * (frameW / 2 - 22 * s)} cy={0} r={5} fill={glowKind === 'cyan' ? PALETTE.cyan : PALETTE.gold} />
          </g>
        ))}

        <g transform={`translate(${-gridSpan / 2} ${-gridSpan / 2})`}>
          {Array.from({ length: 100 }).map((_, idx) => {
            const row = Math.floor(idx / 10);
            const col = idx % 10;
            const x = col * (cell + gap);
            const y = row * (cell + gap);
            const lit = idx < litCount;
            const active = idx === litCount - 1 && litCount > 0;
            const pulse = active ? 1 + 0.14 * Math.sin(t / 4) : 1;
            const cxCell = x + cell / 2;
            const cyCell = y + cell / 2;
            return (
              <g key={idx} transform={`translate(${cxCell} ${cyCell}) scale(${pulse}) translate(${-cxCell} ${-cyCell})`}>
                <rect
                  x={x}
                  y={y}
                  width={cell}
                  height={cell}
                  rx={3}
                  fill={lit ? (glowKind === 'cyan' && fillTarget < 50 ? PALETTE.cyan : PALETTE.gold) : '#192247'}
                  fillOpacity={lit ? 0.92 : 0.72}
                  stroke={lit ? DARK_LINE : '#DFE8FF'}
                  strokeWidth={lit ? 2.8 : 1.6}
                />
                {lit ? <rect x={x + 4} y={y + 4} width={cell - 8} height={4} rx={1} fill="#FFF7D6" opacity={0.55} /> : null}
              </g>
            );
          })}
        </g>

        <text y={frameH / 2 + 28} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cyan} letterSpacing={2.5}>
          {`${litCount} / 100 FRAMES`}
        </text>
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={212} lights={[[cx, cy, 480]]} veilO={0.34} />
    </g>
  );
};

/** 3. moonsky: Pale full Moon disc over night horizon with Hubble square & Roman 2:1 cyan rectangle. */
export const MoonskySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const hub = num(sp, 'hub', 0);
  const rom = num(sp, 'rom', 0);
  const spT = num(sp, 't', 0.2);
  const panX = lerp(-36, 36, spT) + Math.sin(t / 70) * 8;

  if (layer === 'far') {
    return (
      <g>
        <NightSky id={`${id}ns`} x0={-1400} y0={-1400} w={W + 2800} h={H + 2800} horizonY={ground} />
        <Stars seed={307} x0={-900} y0={-900} w={W + 1800} h={ground + 900} t={t} n={135} o={0.88} />
        <Rays x={cx + panX * 0.4} y={cy - 40 * s} t={t} len={1300} o={0.11} color="#D8E6FF" />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={319} kind="soft" />;
  }

  const moonX = cx - (rom > 0 ? 45 * s : 0) + panX;
  const moonY = cy - 45 * s;
  const moonR = 132 * s;
  const hubSide = 26 * s;
  const romW = 418 * s;
  const romH = 209 * s;
  const romPop = easeOut(clamp(p / 0.45)) * rom;
  const hubPop = backOut(clamp(p / 0.35)) * hub;

  return (
    <g>
      <path
        d={`M -1200 ${ground} L -650 ${ground - 78} L -180 ${ground - 46} L 260 ${ground - 96} L 720 ${ground - 52} L 1280 ${ground - 88} L 1850 ${ground - 44} L 2900 ${ground} Z`}
        fill="#131B36"
        stroke={DARK_LINE}
        strokeWidth={4}
      />
      <g transform={`translate(${W * 0.16} ${ground - 78})`}>
        <path d="M -26 24 L -26 6 A 26 26 0 0 1 26 6 L 26 24 Z" fill="#1C284D" stroke={DARK_LINE} strokeWidth={3.5} />
        <circle cx={8} cy={-8} r={4} fill={PALETTE.cyan} opacity={0.7 + 0.3 * Math.sin(t / 8)} />
      </g>

      <Glow x={moonX} y={moonY} r={moonR * 2.2} kind="cool" o={0.48} />
      <g transform={`translate(${moonX} ${moonY})`}>
        <circle cx={0} cy={0} r={moonR} fill="#E7ECF7" stroke={DARK_LINE} strokeWidth={4} />
        <path
          d={`M ${-moonR * 0.15} ${-moonR * 0.98} A ${moonR} ${moonR} 0 0 1 ${-moonR * 0.15} ${moonR * 0.98} A ${moonR * 0.72} ${moonR} 0 0 0 ${-moonR * 0.15} ${-moonR * 0.98} Z`}
          fill="#CBD5EB"
          opacity={0.5}
        />
        <circle cx={-38 * s} cy={-28 * s} r={34 * s} fill="#B9C5DF" opacity={0.7} />
        <circle cx={26 * s} cy={38 * s} r={28 * s} fill="#B9C5DF" opacity={0.62} />
        <circle cx={42 * s} cy={-44 * s} r={18 * s} fill="#C4CFE6" opacity={0.65} />
        <circle cx={-56 * s} cy={46 * s} r={14 * s} fill="#B0BDDA" stroke="#99A8CA" strokeWidth={2} opacity={0.7} />
        <circle cx={0} cy={0} r={moonR} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.5} />

        {hub > 0 ? (
          <g transform={`translate(${18 * s} ${-18 * s}) scale(${hubPop})`}>
            <rect x={-hubSide / 2} y={-hubSide / 2} width={hubSide} height={hubSide} fill="#FFFFFF" fillOpacity={0.25} stroke={DARK_LINE} strokeWidth={6} />
            <rect x={-hubSide / 2} y={-hubSide / 2} width={hubSide} height={hubSide} fill="none" stroke="#FFFFFF" strokeWidth={3} />
          </g>
        ) : null}
      </g>

      {rom > 0 ? (
        <g transform={`translate(${moonX + 115 * s} ${moonY}) scale(${lerp(0.86, 1, romPop)})`} opacity={clamp(romPop)}>
          <Glow x={0} y={0} r={260 * s} kind="cool" o={0.28 * romPop} />
          <rect x={-romW / 2} y={-romH / 2} width={romW} height={romH} rx={8} fill="#3EE0FF" fillOpacity={0.12} stroke={DARK_LINE} strokeWidth={9} />
          <rect x={-romW / 2} y={-romH / 2} width={romW} height={romH} rx={8} fill="none" stroke={PALETTE.cyan} strokeWidth={4.5} />
        </g>
      ) : null}

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={311} floorFill="#141C36" rim="#9FB3E6" lights={[[moonX, moonY, 520]]} veilO={0.32} />
    </g>
  );
};

/** 4. mirror: 2.4m silver mirror with honeycomb cutaway, glint sweep, weight scale & bump callout. */
export const MirrorSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = num(sp, 't', 0.4);
  const weight = num(sp, 'weight', 0);
  const bump = num(sp, 'bump', 0);

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={401}
        stars={60}
        glow="cool"
        rayColor="#C7DCFF"
        rayO={0.09}
        glowX={cx - 180}
        glowY={cy - 180}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={409} kind="truss" />;
  }

  const mx = cx - (weight > 0.3 ? 110 * s : 0);
  const my = cy - 18 * s;
  const mr = 198 * s;
  const glintPhase = (spT * 0.65 + p * 0.5) % 1;
  const glintX = lerp(-mr * 1.4, mr * 1.4, easeInOut(glintPhase));
  const scaleTilt = lerp(-15, 16, clamp(weight) * easeOut(clamp(p / 0.6)));
  const bumpPulse = 1 + 0.16 * Math.sin(t / 6);

  return (
    <g>
      <defs>
        <linearGradient id={`${id}sil`} x1={-mr} y1={-mr} x2={mr} y2={mr} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5F8FF" />
          <stop offset="48%" stopColor="#B8C8E8" />
          <stop offset="100%" stopColor="#6D82AD" />
        </linearGradient>
        <clipPath id={`${id}mclip`}>
          <circle cx={0} cy={0} r={mr - 6} />
        </clipPath>
        <clipPath id={`${id}cut`}>
          <path d={`M ${mr * 0.15} ${-mr} L ${mr} ${-mr} L ${mr} ${mr} L ${mr * 0.15} ${mr} Q ${mr * 0.42} 0 ${mr * 0.15} ${-mr} Z`} />
        </clipPath>
      </defs>

      <Glow x={mx - 80 * s} y={my - 90 * s} r={320 * s} kind="cool" o={0.38} />

      <g transform={`translate(${mx} ${my})`}>
        <circle cx={0} cy={0} r={mr + 18 * s} fill="#252B46" stroke={DARK_LINE} strokeWidth={4.5} />
        <circle cx={0} cy={0} r={mr} fill={`url(#${id}sil)`} stroke={DARK_LINE} strokeWidth={4.5} />

        <g clipPath={`url(#${id}mclip)`}>
          <g clipPath={`url(#${id}cut)`}>
            <rect x={-mr} y={-mr} width={mr * 2} height={mr * 2} fill="#181D34" />
            {Array.from({ length: 7 }).map((_, row) =>
              Array.from({ length: 5 }).map((__, col) => {
                const hx = mr * 0.18 + col * 38 * s + (row % 2) * 19 * s;
                const hy = -mr * 0.85 + row * 48 * s;
                const rHex = 21 * s;
                const pts = Array.from({ length: 6 })
                  .map((___, k) => {
                    const a = (k * Math.PI) / 3 + Math.PI / 6;
                    return `${hx + Math.cos(a) * rHex},${hy + Math.sin(a) * rHex}`;
                  })
                  .join(' ');
                return <polygon key={`${row}-${col}`} points={pts} fill="#273154" stroke="#687EAD" strokeWidth={2.5} />;
              }),
            )}
          </g>
          <path d={`M ${mr * 0.15} ${-mr} Q ${mr * 0.42} 0 ${mr * 0.15} ${mr}`} fill="none" stroke={DARK_LINE} strokeWidth={4} />

          <g transform={`translate(${glintX} 0) rotate(24)`} opacity={0.52}>
            <rect x={-32 * s} y={-mr * 1.4} width={44 * s} height={mr * 2.8} fill="#FFFFFF" />
            <rect x={24 * s} y={-mr * 1.4} width={14 * s} height={mr * 2.8} fill="#FFFFFF" opacity={0.65} />
          </g>
        </g>

        <path
          d={`M ${-mr * 0.88} ${-mr * 0.3} A ${mr * 0.94} ${mr * 0.94} 0 0 1 ${mr * 0.2} ${-mr * 0.92}`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.75}
        />

        <circle cx={0} cy={0} r={38 * s} fill="#15182C" stroke={DARK_LINE} strokeWidth={4} />
        <circle cx={0} cy={0} r={26 * s} fill="#0A0C18" stroke="#536591" strokeWidth={2} />

        {bump > 0 ? (
          <g transform={`translate(${-74 * s} ${-68 * s})`}>
            <Glow x={0} y={0} r={75 * s} kind="cool" o={0.45} />
            <circle cx={0} cy={0} r={18 * s * bumpPulse} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} />
            <circle cx={0} cy={0} r={5 * s} fill={PALETTE.cyan} />
            <path d={`M ${14 * s} ${-14 * s} L ${64 * s} ${-58 * s} L ${142 * s} ${-58 * s}`} fill="none" stroke={PALETTE.cyan} strokeWidth={3} />
            <rect x={142 * s} y={-78 * s} width={120 * s} height={38} rx={9} fill="#0F1429" stroke={PALETTE.cyan} strokeWidth={3} />
            <text x={202 * s} y={-53 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cyan}>
              MICRO BUMP
            </text>
          </g>
        ) : null}
      </g>

      {weight > 0 ? (
        <g transform={`translate(${mx + mr + 165 * s} ${my + 45 * s}) scale(${backOut(clamp(p / 0.35))})`}>
          <path d="M -54 110 L 54 110 L 14 82 L -14 82 Z" fill="#2A3252" stroke={DARK_LINE} strokeWidth={4} />
          <line x1={0} y1={84} x2={0} y2={-42} stroke={DARK_LINE} strokeWidth={8} />
          <line x1={0} y1={84} x2={0} y2={-42} stroke="#9FB2DE" strokeWidth={3} />
          <g transform={`translate(0 -40) rotate(${scaleTilt})`}>
            <line x1={-95 * s} y1={0} x2={95 * s} y2={0} stroke={DARK_LINE} strokeWidth={8} strokeLinecap="round" />
            <line x1={-95 * s} y1={0} x2={95 * s} y2={0} stroke={PALETTE.cream} strokeWidth={3.5} strokeLinecap="round" />
            <g transform={`translate(${-92 * s} 0) rotate(${-scaleTilt})`}>
              <line x1={0} y1={0} x2={0} y2={48} stroke={PALETTE.cream} strokeWidth={2.5} />
              <rect x={-34} y={48} width={68} height={42} rx={6} fill="#363B59" stroke={DARK_LINE} strokeWidth={4} />
              <text y={75} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16} fill={PALETTE.cream}>
                828 KG
              </text>
            </g>
            <g transform={`translate(${92 * s} 0) rotate(${-scaleTilt})`}>
              <line x1={0} y1={0} x2={0} y2={48} stroke={PALETTE.cream} strokeWidth={2.5} />
              <rect x={-32} y={58} width={64} height={26} rx={6} fill={PALETTE.cyan} fillOpacity={0.25} stroke={PALETTE.cyan} strokeWidth={3.5} />
              <text y={77} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16} fill={PALETTE.cyan}>
                186 KG
              </text>
            </g>
          </g>
          <circle cx={0} cy={-40} r={9} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={3} />
        </g>
      ) : null}

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={404} floorFill="#11162C" lights={[[mx, my, 520]]} veilO={0.34} />
    </g>
  );
};
