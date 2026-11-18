import React from 'react';
import type { SetProps } from './render';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import { NightSky, Stars, Rays, Foreground } from '../../engine/kit';
import { Glow } from '../../engine/light';
import {
  DARK_INK,
  num,
  str,
  DeepSpaceBase,
  StageFloor,
  NearEdgeBlurs,
  SoftBand,
  FullLightVeil,
  SceneDust,
} from './sets-common';

const CATALOG_ROWS = [
  '1P / HALLEY',
  '2P / ENCKE',
  '29P / SCHWASSMANN',
  '46P / WIRTANEN',
  '67P / CHURYUMOV',
  '81P / WILD',
  '103P / HARTLEY',
  'C/2014 UN271',
  'C/2020 F3 NEOWISE',
  'C/2023 A3 TSUCHIN',
  'C/2025 K1 ATLAS',
  '2024 YR4 ASTEROID',
];

/** 7. catalog: Scrolling catalogue rows, sweeping magnifier, and NO MATCH / MATCH verdict stamp. */
export const CatalogSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const match = num(sp.match, 0) >= 0.5;
  const scroll = num(sp.scroll, 0.5);
  const vert = H > W;
  const stopped = scroll < 0.08 && st >= 0.9;

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase
          id={id}
          t={t}
          seed={331}
          starCount={55}
          bg="#0A0D20"
          rayColor={stopped ? (match ? '#34D399' : '#FF7A70') : '#7CE8FF'}
          rayOpacity={0.11}
          W={W}
          H={H}
        />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060814" />;
  }

  const scrW = vert ? W * 0.78 : W * 0.62;
  const scrH = vert ? H * 0.34 : H * 0.48;
  const scrX = (W - scrW) / 2;
  const scrY = vert ? H * 0.31 : H * 0.23;
  const rowH = 44;
  const offset = (t * (0.4 + scroll * 3.2)) % (CATALOG_ROWS.length * rowH);
  const magY = scrY + 75 + lerp(0, scrH - 130, clamp(st * 0.75 + 0.15 * Math.sin(t / 18)));
  const stampPop = stopped ? backOut(clamp(t / 10)) : 0;

  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={scrX + 12} y={scrY + 52} width={scrW - 24} height={scrH - 64} rx={6} />
        </clipPath>
      </defs>

      {/* Monitor cabinet */}
      <rect x={scrX} y={scrY} width={scrW} height={scrH} rx={16} fill="#141832" stroke={DARK_INK} strokeWidth={4} />
      <rect x={scrX + 12} y={scrY + 12} width={scrW - 24} height={36} rx={6} fill="#1F264A" />
      <text x={scrX + 28} y={scrY + 37} fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cyan} letterSpacing={2}>
        KNOWN COMETS + ASTEROIDS
      </text>

      {/* Scrolling rows */}
      <g clipPath={`url(#${id}clip)`}>
        <rect x={scrX + 12} y={scrY + 52} width={scrW - 24} height={scrH - 64} fill="#090B18" />
        {[...CATALOG_ROWS, ...CATALOG_ROWS].map((row, idx) => {
          const ry = scrY + 64 + idx * rowH - offset;
          if (ry < scrY + 30 || ry > scrY + scrH + 20) return null;
          return (
            <g key={idx} transform={`translate(${scrX + 34} ${ry})`}>
              <circle cx={6} cy={12} r={4} fill={idx % 3 === 0 ? PALETTE.gold : PALETTE.cyan} opacity={0.75} />
              <text x={24} y={18} fontFamily={FONTS.ui} fontSize={22} fill={PALETTE.cream} opacity={0.86}>
                {row}
              </text>
              <line x1={0} y1={32} x2={scrW - 68} y2={32} stroke="#1D2342" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* Active magnifier scan beam when scrolling */}
        {!stopped && (
          <g transform={`translate(${scrX + scrW * 0.72} ${magY})`}>
            <Glow x={0} y={0} r={85} kind="cool" o={0.55} />
            <circle cx={0} cy={0} r={34} fill="#7CE8FF" opacity={0.2} stroke={PALETTE.cream} strokeWidth={4} />
            <line x1={24} y1={24} x2={48} y2={48} stroke={PALETTE.cream} strokeWidth={8} strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Verdict stamp when scan completes */}
      {stopped && (
        <g transform={`translate(${W * 0.5} ${scrY + scrH * 0.56}) rotate(-6) scale(${stampPop})`}>
          <Glow x={0} y={0} r={175} kind={match ? 'cool' : 'red'} o={0.62} />
          <rect
            x={-175}
            y={-48}
            width={350}
            height={96}
            rx={14}
            fill={PALETTE.pill}
            stroke={match ? PALETTE.green : PALETTE.red}
            strokeWidth={5}
          />
          <text
            y={12}
            textAnchor="middle"
            fontFamily={FONTS.title}
            fontWeight={800}
            fontSize={42}
            fill={match ? PALETTE.green : PALETTE.red}
            letterSpacing={3}
          >
            {match ? 'CONFIRMED NEW' : 'NO MATCH'}
          </text>
        </g>
      )}

      <StageFloor y={ground} fill="#151932" subFill="#0A0D1E" rim="#8CA8D8" W={W} rimOpacity={0.65} />
      <FullLightVeil id={`${id}v`} lights={[[W * 0.5, scrY + scrH * 0.5, 520]]} o={0.28} />
      <SceneDust t={t} seed={347} W={W} H={H} n={26} o={0.4} />
    </g>
  );
};

/** 8. mpc: Minor Planet Center Earth globe at left with cream alert arcs flying between pins. */
export const MpcSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const isGold = str(sp.glow, 'cyan') === 'gold';
  const accent = isGold ? PALETTE.gold : PALETTE.cyan;
  const vert = H > W;
  const gx = (vert ? 0.36 : 0.33) * W;
  const gy = (vert ? 0.45 : 0.46) * H;
  const gr = vert ? 185 : 215;

  const pins: [number, number][] = [
    [0.14, -0.45], // origin: Helsinki-ish north
    [-0.48, -0.18],
    [-0.25, 0.35],
    [0.02, -0.25],
    [0.35, -0.12],
    [0.52, 0.25],
    [-0.12, 0.08],
    [0.24, 0.42],
  ];
  const progress = clamp(st + easeOut(p) * 0.22);
  const activeCount = Math.max(2, Math.round(lerp(2, pins.length, progress)));

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase
          id={id}
          t={t}
          seed={359}
          starCount={85}
          bg="#090B1C"
          rayColor={isGold ? '#FFD166' : '#7CE8FF'}
          rayOpacity={0.12}
          rayX={gx}
          rayY={gy}
          W={W}
          H={H}
        />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060714" />;
  }

  return (
    <g>
      <Glow x={gx} y={gy} r={gr * 1.65} kind={isGold ? 'warm' : 'cool'} o={0.44} />
      {/* Subtle comms radar rings behind Earth */}
      {[1.3, 1.75].map((rMul, i) => (
        <circle
          key={i}
          cx={gx}
          cy={gy}
          r={gr * rMul + Math.sin(t / 18 + i) * 6}
          fill="none"
          stroke={accent}
          strokeWidth={1.8}
          strokeDasharray="10 14"
          opacity={0.28}
        />
      ))}

      {/* Globe */}
      <g transform={`translate(${gx} ${gy})`}>
        <defs>
          <clipPath id={`${id}globe`}>
            <circle cx={0} cy={0} r={gr} />
          </clipPath>
        </defs>
        <circle cx={0} cy={0} r={gr} fill="#1C3D7A" stroke={DARK_INK} strokeWidth={4} />
        <g clipPath={`url(#${id}globe)`}>
          {/* Stylized flat continents */}
          <path d="M -160 -90 Q -90 -120 -55 -60 Q -85 -5 -120 55 Q -150 90 -175 20 Z" fill="#2D7069" stroke={DARK_INK} strokeWidth={2.5} />
          <path d="M -25 -135 Q 50 -145 95 -95 Q 130 -35 110 25 Q 65 95 15 110 Q -30 40 -25 -135 Z" fill="#358278" stroke={DARK_INK} strokeWidth={2.5} />
          <path d="M 95 25 Q 155 15 170 65 Q 140 110 95 85 Z" fill="#2D7069" stroke={DARK_INK} strokeWidth={2.5} />
          {/* Night shadow crescent */}
          <path d={`M 0 ${-gr} A ${gr} ${gr} 0 0 1 0 ${gr} A ${gr * 0.65} ${gr} 0 0 0 0 ${-gr} Z`} fill="#0D1838" opacity={0.45} />
        </g>
        <circle cx={0} cy={0} r={gr} fill="none" stroke={accent} strokeWidth={3} opacity={0.55} />

        {/* Flying cream alert arcs from origin pin 0 */}
        {pins.slice(1, activeCount).map(([px, py], idx) => {
          const [ox, oy] = pins[0];
          const x0 = ox * gr;
          const y0 = oy * gr;
          const x1 = px * gr;
          const y1 = py * gr;
          const mx = (x0 + x1) * 0.5;
          const my = (y0 + y1) * 0.5 - 55;
          const sig = (t / 26 + idx * 0.19) % 1;
          const sx = (1 - sig) * (1 - sig) * x0 + 2 * (1 - sig) * sig * mx + sig * sig * x1;
          const sy = (1 - sig) * (1 - sig) * y0 + 2 * (1 - sig) * sig * my + sig * sig * y1;
          return (
            <g key={idx}>
              <path d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} fill="none" stroke={PALETTE.cream} strokeWidth={2.6} opacity={0.82} />
              <circle cx={sx} cy={sy} r={4.5} fill={accent} />
            </g>
          );
        })}

        {/* Observatory pins */}
        {pins.slice(0, activeCount).map(([px, py], idx) => {
          const isOrig = idx === 0;
          const x = px * gr;
          const y = py * gr;
          return (
            <g key={idx} transform={`translate(${x} ${y})`}>
              <circle
                cx={0}
                cy={0}
                r={(isOrig ? 15 : 10) + Math.sin(t / 8 + idx) * 2.5}
                fill="none"
                stroke={accent}
                strokeWidth={2.5}
                opacity={0.6}
              />
              <circle cx={0} cy={0} r={isOrig ? 7 : 5} fill={PALETTE.cream} stroke={DARK_INK} strokeWidth={2.5} />
            </g>
          );
        })}
      </g>

      <StageFloor y={ground} fill="#141932" subFill="#0A0E1E" rim={accent} W={W} rimOpacity={0.62} />
      <FullLightVeil id={`${id}v`} lights={[[gx, gy, 460], [W * 0.5, ground - 100, 420]]} o={0.32} />
      <SceneDust t={t} seed={373} W={W} H={H} n={32} o={0.46} />
    </g>
  );
};

/** 9. orbit: Top-down Solar System with Jupiter & Saturn rings and giant gold comet ellipse. */
export const OrbitSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const zoom = num(sp.zoom, 1.0);
  const mark = num(sp.mark, 1.0) >= 0.5;
  const vert = H > W;

  if (layer === 'far') {
    return <DeepSpaceBase id={id} t={t} seed={389} starCount={90} bg="#080A1C" rayColor="#FFE2A0" rayOpacity={0.11} W={W} H={H} />;
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060713" />;
  }

  const sunX = vert ? W * 0.36 : W * 0.37;
  const sunY = vert ? H * 0.46 : H * 0.45;
  const zScale = lerp(1.42, vert ? 0.72 : 0.85, clamp(zoom));

  const planets = [
    { name: 'EARTH', r: 64, size: 7, col: '#38BDF8', spd: 0.045, ang0: 0.9 },
    { name: 'MARS', r: 94, size: 6, col: '#E06D53', spd: 0.032, ang0: 2.3 },
    { name: 'JUPITER', r: 165, size: 15, col: '#E8A87C', spd: 0.014, ang0: 4.1 },
    { name: 'SATURN', r: 265, size: 13, col: '#F3D08B', spd: 0.009, ang0: 5.5, ring: true },
  ];

  // Giant gold comet ellipse: focus at (0,0) -> Sun; center offset right by c=210, semi-major a=290, semi-minor b=198
  const a = 290;
  const b = 198;
  const c = 210;
  const phase = clamp(st + (p - 0.5) * 0.05);
  // Parametric angle so phase=0.1 is near far edge (aphelion) and phase=0.5 sits cleanly between Jupiter & Saturn
  const theta = lerp(0.18, 2.02, phase);
  const cometX = c + a * Math.cos(theta);
  const cometY = -b * Math.sin(theta);

  return (
    <g>
      <g transform={`translate(${sunX} ${sunY}) scale(${zScale})`}>
        <Glow x={0} y={0} r={140} kind="warm" o={0.65} />

        {/* Planet rings & dots */}
        {planets.map((pl, idx) => {
          const ang = pl.ang0 + t * pl.spd;
          const px = pl.r * Math.cos(ang);
          const py = pl.r * Math.sin(ang);
          return (
            <g key={idx}>
              <circle cx={0} cy={0} r={pl.r} fill="none" stroke={PALETTE.cream} strokeWidth={1.8} opacity={0.34} />
              <g transform={`translate(${px} ${py})`}>
                {pl.ring && <ellipse cx={0} cy={0} rx={24} ry={8} transform="rotate(-18)" fill="none" stroke="#F6EFE3" strokeWidth={3} />}
                <circle cx={0} cy={0} r={pl.size} fill={pl.col} stroke={DARK_INK} strokeWidth={3} />
              </g>
            </g>
          );
        })}

        {/* Sun */}
        <circle cx={0} cy={0} r={20} fill={PALETTE.gold} stroke={DARK_INK} strokeWidth={3.5} />

        {/* Giant gold comet orbit ellipse */}
        <ellipse cx={c} cy={0} rx={a} ry={b} fill="none" stroke={PALETTE.gold} strokeWidth={3.5} opacity={0.9} />

        {/* Bright comet dot & tail */}
        <g transform={`translate(${cometX} ${cometY})`}>
          <Glow x={0} y={0} r={55} kind="cool" o={0.75} />
          <line x1={0} y1={0} x2={cometX * 0.14} y2={cometY * 0.14} stroke="#7CE8FF" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          <circle cx={0} cy={0} r={10} fill="#E0FCFF" stroke={DARK_INK} strokeWidth={3} />
          {mark && (
            <circle
              cx={0}
              cy={0}
              r={20 + (t % 30) * 0.9}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={3.5}
              opacity={1 - (t % 30) / 30}
            />
          )}
        </g>
      </g>

      <StageFloor y={ground} fill="#12162C" subFill="#090B1A" rim="#E6CF9B" W={W} rimOpacity={0.62} />
      <FullLightVeil id={`${id}v`} lights={[[sunX + 90, sunY, 540]]} o={0.28} />
      <SceneDust t={t} seed={401} W={W} H={H} n={30} o={0.44} />
    </g>
  );
};

/** 10. side: Edge-on Solar System lane with high arching dotted gold comet path straight up from Sun. */
export const SideSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const up = num(sp.up, 0) >= 0.5;
  const vert = H > W;
  const planeY = vert ? H * 0.56 : H * 0.6;
  const sunX = W * 0.22;
  const archX = W * 0.44;
  const peakY = vert ? H * 0.26 : H * 0.23;

  if (layer === 'far') {
    return <DeepSpaceBase id={id} t={t} seed={419} starCount={92} bg="#080B1D" rayColor="#99E6FF" rayOpacity={0.11} rayX={sunX} rayY={planeY} W={W} H={H} />;
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060814" />;
  }

  const prog = clamp(st + easeOut(p) * 0.16);
  const cometPos = {
    x: lerp(sunX + 40, archX, prog),
    y: lerp(planeY - 30, peakY, Math.sin(prog * Math.PI * 0.65)),
  };

  return (
    <g>
      {/* Flat horizontal ecliptic planet lane */}
      <SoftBand id={id} y={planeY} h={52} color="#FFE29E" o={up ? 0.16 : 0.34} />
      <rect x={W * 0.14} y={planeY - 12} width={W * 0.72} height={24} rx={12} fill="#F6EFE3" opacity={0.16} />
      <line x1={W * 0.14} y1={planeY} x2={W * 0.86} y2={planeY} stroke={PALETTE.cream} strokeWidth={3} opacity={0.72} />

      {/* Yellow Sun at left & planet marbles along lane */}
      <Glow x={sunX} y={planeY} r={115} kind="warm" o={0.7} />
      <circle cx={sunX} cy={planeY} r={24} fill={PALETTE.gold} stroke={DARK_INK} strokeWidth={4} />
      {[0.34, 0.44, 0.55, 0.68, 0.79].map((fx, i) => (
        <g key={i} transform={`translate(${fx * W} ${planeY + Math.sin(t / 16 + i) * 3})`}>
          {i === 4 && <ellipse cx={0} cy={0} rx={22} ry={6} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} />}
          <circle
            cx={0}
            cy={0}
            r={i === 3 ? 13 : i === 4 ? 11 : 7}
            fill={['#94A3B8', '#38BDF8', '#E06D53', '#E8A87C', '#F3D08B'][i]}
            stroke={DARK_INK}
            strokeWidth={3}
          />
        </g>
      ))}

      {/* Dotted gold comet path arching high above the lane */}
      <path
        d={`M ${sunX + 18} ${planeY - 10} Q ${sunX + 45} ${peakY - 25} ${archX} ${peakY} T ${W * 0.76} ${planeY - 16}`}
        fill="none"
        stroke={PALETTE.gold}
        strokeWidth={4}
        strokeDasharray="10 12"
        strokeDashoffset={-t * 0.8}
        opacity={0.35 + prog * 0.6}
      />

      {/* Comet high above the plane */}
      <g transform={`translate(${cometPos.x} ${cometPos.y})`}>
        <Glow x={0} y={0} r={75} kind="cool" o={0.8} />
        <circle cx={0} cy={0} r={12} fill="#CCFBFF" stroke={DARK_INK} strokeWidth={3.5} />
      </g>

      {/* Straight-up cyan indicator arrow when up=1 */}
      {up && (
        <g transform={`translate(${sunX} ${planeY - 38})`}>
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-(planeY - peakY - 45)}
            stroke={PALETTE.cyan}
            strokeWidth={5}
            strokeDasharray="14 8"
            strokeDashoffset={-t * 1.4}
          />
          <polygon
            points={`0,${-(planeY - peakY - 26)} -14,${-(planeY - peakY - 52)} 14,${-(planeY - peakY - 52)}`}
            fill={PALETTE.cyan}
            stroke={DARK_INK}
            strokeWidth={3}
          />
        </g>
      )}

      <StageFloor y={ground} fill="#12162C" subFill="#0A0D1C" rim="#E6D6B0" W={W} rimOpacity={0.62} />
      <FullLightVeil id={`${id}v`} lights={[[W * 0.45, H * 0.45, 620]]} o={0.28} />
      <SceneDust t={t} seed={431} W={W} H={H} n={32} o={0.48} />
    </g>
  );
};

/** 11. void: Minimalist deep-navy stage with sparse stars and color-tinted slow light rays. */
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = str(sp.glow, 'gold');
  const tint = glow === 'cyan' ? '#5CE1E6' : glow === 'red' ? '#FF5A4A' : PALETTE.gold;
  const kind = glow === 'cyan' ? 'cool' : glow === 'red' ? 'red' : 'warm';

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase id={id} t={t} seed={449} starCount={24} bg="#0A0818" rayColor={tint} rayOpacity={0.18} rayX={W * 0.5} rayY={H * 0.34} W={W} H={H} />
      </g>
    );
  }
  if (layer === 'near') {
    return (
      <Foreground blur={12}>
        <circle cx={W * 0.06} cy={ground + 80} r={85} fill={tint} opacity={0.18} />
        <circle cx={W * 0.94} cy={ground + 95} r={95} fill={tint} opacity={0.16} />
      </Foreground>
    );
  }
  return (
    <g>
      <Glow x={W * 0.5} y={H * 0.42} r={440} kind={kind} o={0.42} />
      {/* Slow rotating subtle orbital reference circles */}
      <g transform={`translate(${W * 0.5} ${H * 0.45}) rotate(${t * 0.08})`} opacity={0.12} stroke={tint} strokeWidth={2} fill="none">
        <circle r={240} strokeDasharray="16 20" />
        <circle r={390} strokeDasharray="8 24" />
      </g>
      <StageFloor y={ground} fill="#121024" subFill="#090714" rim={tint} W={W} rimOpacity={0.68} />
      <FullLightVeil id={`${id}v`} lights={[[W * 0.5, H * 0.45, 580]]} o={0.34} />
      <SceneDust t={t} seed={461} W={W} H={H} n={30} o={0.5} />
    </g>
  );
};

/** 12. sky: Looking up at Milky Way night sky with slowly rising faint fuzzy comet. */
export const SkySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.3);
  const glow = num(sp.glow, 0.5);
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <NightSky id={`${id}nsky`} x0={-1400} y0={-1600} w={4800} h={4400} horizonY={ground} />
        {/* Luminous Milky Way diagonal ribbon */}
        <g opacity={0.3 + glow * 0.55}>
          <path
            d={`M -300 ${H * 0.55} Q ${W * 0.45} ${H * 0.25} ${W + 300} ${-80}`}
            fill="none"
            stroke="#8BA4E8"
            strokeWidth={vert ? 220 : 280}
            opacity={0.16}
          />
          <path
            d={`M -300 ${H * 0.55} Q ${W * 0.45} ${H * 0.25} ${W + 300} ${-80}`}
            fill="none"
            stroke="#E5E9FF"
            strokeWidth={95}
            opacity={0.13}
          />
        </g>
        <Stars seed={479} x0={-600} y0={-600} w={W + 1200} h={ground + 600} t={t} n={165} o={0.65 + glow * 0.35} />
        <Rays x={W * 0.5} y={H * 0.15} t={t} len={1900} n={10} o={0.08 + glow * 0.06} color="#C7D8FF" />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060814" />;
  }

  const rise = clamp(st + (p - 0.5) * 0.14);
  const cx = lerp(W * 0.34, W * 0.56, rise);
  const cy = lerp(ground - H * 0.14, vert ? H * 0.36 : H * 0.3, easeInOut(rise));

  return (
    <g>
      {/* Distant dark hill silhouettes */}
      <path
        d={`M -400 ${ground} L -100 ${ground - 70} Q ${W * 0.2} ${ground - 125} ${W * 0.45} ${ground - 45} T ${W + 400} ${ground - 65} L ${W + 400} ${ground + 60} L -400 ${ground + 60} Z`}
        fill="#131932"
        stroke={DARK_INK}
        strokeWidth={3.5}
      />

      {/* Rising fuzzy comet */}
      <g transform={`translate(${cx} ${cy})`}>
        <Glow x={0} y={0} r={95 + glow * 65} kind="cool" o={0.35 + glow * 0.5} />
        <path d="M 0 0 L -72 34 L -62 46 Z" fill="#A5F3FC" opacity={0.22 + glow * 0.35} />
        <circle cx={0} cy={0} r={16 + glow * 8} fill="#99F6FF" opacity={0.28 + glow * 0.25} />
        <circle cx={0} cy={0} r={5.5} fill="#FFFDF5" />
      </g>

      <StageFloor y={ground} fill="#0F1429" subFill="#080B17" rim="#B8C8EB" W={W} rimOpacity={0.58} />
      <FullLightVeil id={`${id}v`} lights={[[cx, cy, 420], [W * 0.5, ground - 100, 440]]} o={0.34 - glow * 0.1} />
      <SceneDust t={t} seed={499} W={W} H={H} n={30} o={0.42} />
    </g>
  );
};
