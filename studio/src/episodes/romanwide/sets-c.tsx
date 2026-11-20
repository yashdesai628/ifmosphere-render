import React from 'react';
import { FONTS, PALETTE } from '../../brand';
import { clamp, easeInOut, easeOut, backOut, lerp, rnd } from '../../engine/anim';
import { Glow, Cone } from '../../engine/light';
import { Rays } from '../../engine/kit';
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

/** 5. optics: Side-view three-mirror telescope diagram with gold rays, wide cone & 1/3 focal bracket. */
export const OpticsSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = num(sp, 't', 0.5);
  const wide = num(sp, 'wide', 0);
  const short = num(sp, 'short', 0);

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={501}
        stars={65}
        glow="warm"
        rayColor="#FFE2B0"
        rayO={0.08}
        glowX={cx - 120}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={509} kind="truss" />;
  }

  const rayProg = clamp(lerp(Math.max(0.15, spT - 0.35), Math.min(1, spT + 0.15), easeInOut(p)));
  const tubeW = 700 * s;
  const tubeH = 290 * s;

  const pEnter = { x: 340 * s, y: -72 * s };
  const pM1 = { x: -255 * s, y: -62 * s };
  const pM2 = { x: 185 * s, y: 0 };
  const pM3 = { x: -120 * s, y: 68 * s };
  const pDet = { x: 90 * s, y: 82 * s };
  const rayPath = `M ${pEnter.x} ${pEnter.y} L ${pM1.x} ${pM1.y} L ${pM2.x} ${pM2.y} L ${pM3.x} ${pM3.y} L ${pDet.x} ${pDet.y}`;
  const rayPath2 = `M ${pEnter.x} ${64 * s} L ${-250 * s} ${52 * s} L ${pM2.x} ${pM2.y} L ${pM3.x} ${pM3.y} L ${pDet.x} ${pDet.y}`;

  return (
    <g>
      <Glow x={cx} y={cy - 20 * s} r={360 * s} kind="warm" o={0.34} />

      <g transform={`translate(${cx} ${cy - 24 * s})`}>
        <rect x={-tubeW / 2} y={-tubeH / 2} width={tubeW} height={tubeH} rx={18} fill="#18203D" stroke={DARK_LINE} strokeWidth={4.5} />
        <rect x={-tubeW / 2 + 16} y={-tubeH / 2 + 16} width={tubeW - 32} height={tubeH - 32} rx={12} fill="#0E1328" />
        <rect x={tubeW / 2 - 14} y={-tubeH / 2 + 22} width={22} height={tubeH - 44} fill="#090D1F" />

        {wide > 0 ? (
          <g opacity={0.26 * wide * (0.85 + 0.15 * Math.sin(t / 10))}>
            <polygon points={`${pEnter.x},${-115 * s} ${pM1.x},${-95 * s} ${pM1.x},${85 * s} ${pEnter.x},${110 * s}`} fill={PALETTE.gold} />
            <polygon points={`${pM1.x},${-95 * s} ${pM2.x},${-24 * s} ${pM2.x},${24 * s} ${pM1.x},${85 * s}`} fill={PALETTE.cyan} />
            <polygon points={`${pM2.x},${-16 * s} ${pM3.x},${44 * s} ${pDet.x},${96 * s} ${pDet.x},${66 * s} ${pM3.x},${88 * s} ${pM2.x},${16 * s}`} fill={PALETTE.gold} />
          </g>
        ) : null}

        <path d={`M ${-245 * s} ${-110 * s} Q ${-285 * s} 0 ${-245 * s} ${110 * s}`} fill="none" stroke={DARK_LINE} strokeWidth={18} strokeLinecap="round" />
        <path d={`M ${-245 * s} ${-110 * s} Q ${-285 * s} 0 ${-245 * s} ${110 * s}`} fill="none" stroke="#DCE6FF" strokeWidth={9} strokeLinecap="round" />

        <path d={`M ${182 * s} ${-42 * s} Q ${206 * s} 0 ${182 * s} ${42 * s}`} fill="none" stroke={DARK_LINE} strokeWidth={15} strokeLinecap="round" />
        <path d={`M ${182 * s} ${-42 * s} Q ${206 * s} 0 ${182 * s} ${42 * s}`} fill="none" stroke={PALETTE.cyan} strokeWidth={7} strokeLinecap="round" />

        <path d={`M ${-150 * s} ${52 * s} Q ${-120 * s} ${82 * s} ${-86 * s} ${62 * s}`} fill="none" stroke={DARK_LINE} strokeWidth={14} strokeLinecap="round" />
        <path d={`M ${-150 * s} ${52 * s} Q ${-120 * s} ${82 * s} ${-86 * s} ${62 * s}`} fill="none" stroke={PALETTE.gold} strokeWidth={7} strokeLinecap="round" />

        <rect x={pDet.x - 10} y={pDet.y - 26} width={58 * s} height={52} rx={8} fill="#262E4E" stroke={DARK_LINE} strokeWidth={4} />
        <rect x={pDet.x - 6} y={pDet.y - 18} width={10} height={36} rx={3} fill={PALETTE.cyan} />
        <Glow x={pDet.x} y={pDet.y} r={55} kind="cool" o={0.5} />

        <path d={rayPath} fill="none" stroke={PALETTE.gold} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1800" strokeDashoffset={1800 * (1 - rayProg)} />
        <path d={rayPath2} fill="none" stroke="#FFE394" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1800" strokeDashoffset={1800 * (1 - rayProg)} opacity={0.85} />

        <text x={-256 * s} y={-122 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={17} fill={PALETTE.cream}>
          M1
        </text>
        <text x={188 * s} y={-54 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={17} fill={PALETTE.cyan}>
          M2
        </text>
        <text x={-118 * s} y={108 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={17} fill={PALETTE.gold}>
          M3
        </text>

        {short > 0 ? (
          <g transform={`translate(0 ${tubeH / 2 + 28}) scale(${backOut(clamp((p - 0.1) / 0.35))})`}>
            <line x1={-310 * s} y1={0} x2={310 * s} y2={0} stroke="#6E7FA8" strokeWidth={2.5} strokeDasharray="8 8" />
            <path d={`M ${-105 * s} 18 L ${-105 * s} 32 L ${105 * s} 32 L ${105 * s} 18`} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} />
            <text y={56} textAnchor="middle" fontFamily={FONTS.ui} fontSize={19} fill={PALETTE.cream} letterSpacing={2}>
              1/3 FOCAL LENGTH
            </text>
          </g>
        ) : null}
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={503} lights={[[cx, cy, 520]]} veilO={0.34} />
    </g>
  );
};

/** 11. zoomwide: Short wide-angle lens (cyan) vs long zoom lens (white) with optional linking gold arrow. */
export const ZoomwideSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = num(sp, 't', 0.8);
  const pick = str(sp, 'pick', 'wide');
  const link = num(sp, 'link', 0) > 0;

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={1101}
        stars={70}
        glow="cool"
        rayColor={pick === 'wide' ? '#7CEAFF' : '#DCE6FF'}
        rayO={0.08}
        glowX={cx + (pick === 'wide' ? -220 : 220) * s}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1109} kind="truss" />;
  }

  const lx = cx - 220 * s;
  const rx = cx + 220 * s;
  const ly = cy - 18 * s;
  const beamFrac = clamp(lerp(Math.max(0.2, spT - 0.3), spT, easeOut(p)));
  const wideActive = pick === 'wide';
  const zoomActive = pick === 'zoom';

  return (
    <g>
      <g transform={`translate(${lx} ${ly}) scale(${wideActive ? 1.05 : 0.94})`} opacity={wideActive ? 1 : 0.78}>
        <Glow x={0} y={-20} r={wideActive ? 260 * s : 130 * s} kind="cool" o={wideActive ? 0.58 : 0.2} />
        <Cone
          d={`M ${-34 * s} ${-40 * s} L ${34 * s} ${-40 * s} L ${210 * s * beamFrac} ${-245 * s * beamFrac} L ${-210 * s * beamFrac} ${-245 * s * beamFrac} Z`}
          o={wideActive ? 0.42 : 0.22}
        />
        <rect x={-64 * s} y={-40 * s} width={128 * s} height={130 * s} rx={14} fill="#252C4A" stroke={DARK_LINE} strokeWidth={4.5} />
        <rect x={-72 * s} y={-44 * s} width={144 * s} height={26 * s} rx={8} fill="#36416A" stroke={DARK_LINE} strokeWidth={4} />
        <ellipse cx={0} cy={-46 * s} rx={58 * s} ry={16 * s} fill={PALETTE.cyan} fillOpacity={0.75} stroke={DARK_LINE} strokeWidth={4} />
        <line x1={-56 * s} y1={14 * s} x2={56 * s} y2={14 * s} stroke={PALETTE.cyan} strokeWidth={3} opacity={0.7} />
        <text y={120 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cyan} letterSpacing={2}>
          WIDE LENS
        </text>
      </g>

      <g transform={`translate(${rx} ${ly}) scale(${zoomActive ? 1.05 : 0.94})`} opacity={zoomActive ? 1 : 0.78}>
        <Glow x={0} y={-50} r={zoomActive ? 240 * s : 120 * s} kind="cool" o={zoomActive ? 0.52 : 0.18} />
        <polygon points={`${-22 * s},${-95 * s} ${22 * s},${-95 * s} ${52 * s},${-295 * s * beamFrac} ${-52 * s},${-295 * s * beamFrac}`} fill="#EAF2FF" opacity={zoomActive ? 0.34 : 0.18} />
        <rect x={-48 * s} y={-95 * s} width={96 * s} height={185 * s} rx={12} fill="#2A304E" stroke={DARK_LINE} strokeWidth={4.5} />
        <rect x={-56 * s} y={-98 * s} width={112 * s} height={24 * s} rx={7} fill="#465078" stroke={DARK_LINE} strokeWidth={4} />
        <ellipse cx={0} cy={-98 * s} rx={42 * s} ry={12 * s} fill="#EAF2FF" stroke={DARK_LINE} strokeWidth={4} />
        <rect x={-48 * s} y={-32 * s} width={96 * s} height={14 * s} fill={PALETTE.gold} opacity={0.85} />
        <text y={120 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream} letterSpacing={2}>
          ZOOM LENS
        </text>
      </g>

      {link ? (
        <g transform={`translate(${cx} ${ly - 10 * s})`}>
          <path d={`M ${-95 * s} ${-24 * s} Q 0 ${-92 * s} ${95 * s} ${-24 * s}`} fill="none" stroke={DARK_LINE} strokeWidth={11} strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - easeOut(clamp(p / 0.55)))} />
          <path d={`M ${-95 * s} ${-24 * s} Q 0 ${-92 * s} ${95 * s} ${-24 * s}`} fill="none" stroke={PALETTE.gold} strokeWidth={5.5} strokeLinecap="round" strokeDasharray="400" strokeDashoffset={400 * (1 - easeOut(clamp(p / 0.55)))} />
          <polygon points={`${102 * s},${-20 * s} ${78 * s},${-38 * s} ${82 * s},${-12 * s}`} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={3} opacity={p > 0.3 ? 1 : 0} />
        </g>
      ) : null}

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1104} floorFill="#10152B" lights={[[lx, ly, 360], [rx, ly, 360]]} veilO={0.34} />
    </g>
  );
};

/** 12. lab: Bright astronomers' control room with screen wall, desk, laptops, coffee mug & sticky note. */
export const LabSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const alertVal = clamp(num(sp, 'alert', 0), 0, 1);
  const ok = num(sp, 'ok', 0) >= 1;

  if (layer === 'far') {
    const monY = cy - 110 * s;
    const statusCol = ok ? PALETTE.green : alertVal > 0 ? PALETTE.gold : PALETTE.cyan;
    const alertPulse = alertVal > 0 && !ok ? 0.55 + 0.45 * Math.sin(t / (alertVal > 0.35 ? 4 : 7)) : 1;
    return (
      <g>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill="#181F3A" />
        <rect x={-1200} y={-400} width={W + 2400} height={ground + 400} fill="#20284A" />
        <line x1={-1200} y1={monY + 135 * s} x2={W + 1200} y2={monY + 135 * s} stroke="#364475" strokeWidth={4} />
        <Glow x={cx} y={monY} r={620 * s} kind={ok ? 'cool' : 'warm'} o={0.36} />

        <g transform={`translate(${cx - 320 * s} ${monY})`}>
          <rect x={-135 * s} y={-95 * s} width={270 * s} height={190 * s} rx={12} fill="#0E1429" stroke={DARK_LINE} strokeWidth={4.5} />
          <path d={`M ${-95 * s} ${-20 * s} Q ${-60 * s} ${-48 * s} ${-28 * s} ${-15 * s} L ${-48 * s} ${38 * s} Z`} fill={ok ? '#2C7D68' : '#2C4B85'} />
          <path d={`M ${15 * s} ${-35 * s} Q ${70 * s} ${-42 * s} ${105 * s} ${8 * s} L ${42 * s} ${38 * s} Z`} fill={ok ? '#2C7D68' : '#2C4B85'} />
          <path d={`M ${-120 * s} ${12 * s} Q 0 ${-54 * s} ${120 * s} ${12 * s}`} fill="none" stroke={statusCol} strokeWidth={2.5} strokeDasharray="6 6" />
          <circle cx={Math.sin(t / 24) * 80 * s} cy={-20 * s} r={5} fill={PALETTE.cream} />
        </g>

        <g transform={`translate(${cx} ${monY})`}>
          <rect x={-155 * s} y={-105 * s} width={310 * s} height={210 * s} rx={12} fill="#0E1429" stroke={DARK_LINE} strokeWidth={4.5} />
          <polyline
            points={Array.from({ length: 12 })
              .map((_, i) => `${(-125 + i * 22) * s},${Math.sin(t / 9 + i * 0.7) * 28 * s - 15 * s}`)
              .join(' ')}
            fill="none"
            stroke={ok ? PALETTE.green : PALETTE.cream}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={(-118 + i * 32) * s}
              y={35 * s}
              width={18 * s}
              height={(22 + 24 * Math.abs(Math.sin(t / 12 + i))) * s}
              rx={3}
              fill={ok ? PALETTE.green : PALETTE.cyan}
              opacity={0.75}
            />
          ))}
        </g>

        <g transform={`translate(${cx + 320 * s} ${monY})`}>
          <rect x={-135 * s} y={-95 * s} width={270 * s} height={190 * s} rx={12} fill="#0E1429" stroke={DARK_LINE} strokeWidth={4.5} />
          {ok ? (
            <g>
              <circle cx={0} cy={-10} r={42 * s} fill={PALETTE.green} fillOpacity={0.2} stroke={PALETTE.green} strokeWidth={4} />
              <polyline points="-18,-10 -5,6 22,-24" fill="none" stroke={PALETTE.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              <text y={60 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.green} letterSpacing={2}>
                NOMINAL
              </text>
            </g>
          ) : alertVal > 0 ? (
            <g opacity={alertPulse}>
              <Glow x={0} y={-10} r={110 * s} kind="warm" o={0.5} />
              <polygon points={`0,${-48 * s} ${44 * s},${24 * s} ${-44 * s},${24 * s}`} fill={PALETTE.gold} fillOpacity={0.22} stroke={PALETTE.gold} strokeWidth={4.5} strokeLinejoin="round" />
              <line x1={0} y1={-24 * s} x2={0} y2={2 * s} stroke={PALETTE.gold} strokeWidth={5} strokeLinecap="round" />
              <circle cx={0} cy={13 * s} r={3.5} fill={PALETTE.gold} />
              <text y={60 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.gold} letterSpacing={2}>
                CHECK DATA
              </text>
            </g>
          ) : null}
        </g>
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1209} kind="soft" />;
  }

  const deskX = cx + 190 * s;
  const deskY = ground - 102 * s;

  return (
    <g>
      <g transform={`translate(${deskX} ${deskY})`}>
        <rect x={-230 * s} y={0} width={460 * s} height={24} rx={6} fill="#39446E" stroke={DARK_LINE} strokeWidth={4} />
        <rect x={-205 * s} y={24} width={18} height={102 * s - 24} fill="#252C4D" stroke={DARK_LINE} strokeWidth={4} />
        <rect x={187 * s} y={24} width={18} height={102 * s - 24} fill="#252C4D" stroke={DARK_LINE} strokeWidth={4} />

        <g transform={`translate(${-125 * s} -4)`}>
          <polygon points="-44,0 44,0 38,-48 -38,-48" fill="#182140" stroke={DARK_LINE} strokeWidth={4} />
          <rect x={-30} y={-40} width={60} height={32} rx={3} fill={ok ? '#2E8F72' : '#4074B8'} />
          <rect x={-50} y={-2} width={100} height={8} rx={3} fill="#C6D2F0" stroke={DARK_LINE} strokeWidth={3} />
        </g>

        <g transform={`translate(${35 * s} -4)`}>
          <polygon points="-42,0 42,0 36,-46 -36,-46" fill="#182140" stroke={DARK_LINE} strokeWidth={4} />
          <rect x={-28} y={-38} width={56} height={30} rx={3} fill={ok ? '#2E8F72' : '#4E6FB8'} />
          <rect x={-48} y={-2} width={96} height={8} rx={3} fill="#C6D2F0" stroke={DARK_LINE} strokeWidth={3} />
        </g>

        <g transform={`translate(${148 * s} -4)`}>
          <rect x={-14} y={-28} width={28} height={28} rx={4} fill={PALETTE.cream} stroke={DARK_LINE} strokeWidth={3.5} />
          <path d="M 14 -22 Q 24 -22 24 -14 Q 24 -6 14 -6" fill="none" stroke={DARK_LINE} strokeWidth={3.5} />
          <path
            d={`M -4 -34 Q ${-8 + Math.sin(t / 9) * 5} -46 -2 -58 M 6 -34 Q ${10 + Math.cos(t / 10) * 5} -48 4 -60`}
            fill="none"
            stroke="#DCE6FF"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.55}
          />
        </g>

        <g transform={`translate(${-25 * s} -38) rotate(7)`}>
          <rect x={-16} y={-16} width={32} height={32} rx={3} fill="#FFE066" stroke={DARK_LINE} strokeWidth={3} />
          <line x1={-10} y1={-4} x2={10} y2={-4} stroke={DARK_LINE} strokeWidth={2} />
          <line x1={-10} y1={4} x2={6} y2={4} stroke={DARK_LINE} strokeWidth={2} />
        </g>
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1204} floorFill="#1E2442" rim="#A7B8E8" lights={[[cx, cy - 80 * s, 680]]} veilO={0.22} />
    </g>
  );
};

/** 13. scope: Webb-style space telescope with hexagon gold mirror, silver sunshield, cyan look cone & flash. */
export const ScopeSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = num(sp, 't', 0.5);
  const look = clamp(num(sp, 'look', 0), 0, 1);
  const blink = num(sp, 'blink', 0) > 0;

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={1301}
        stars={145}
        glow="warm"
        rayColor="#FFE2B0"
        rayO={0.09}
        glowX={W * 0.18}
        glowY={H * 0.25}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1309} kind="truss" />;
  }

  const driftX = lerp(-24, 24, spT) + Math.sin(t / 32) * 8;
  const bobY = Math.cos(t / 24) * 10;
  const tx = cx + driftX;
  const ty = cy - 28 * s + bobY;
  const hexOffsets: [number, number][] = [
    [0, 0],
    [0, -40],
    [0, 40],
    [-35, -20],
    [-35, 20],
    [35, -20],
    [35, 20],
  ];
  const coneLen = lerp(120, 480, look) * s;
  const flashO = blink ? Math.max(0, Math.sin(p * Math.PI * 3)) * 0.85 : 0;

  return (
    <g>
      <Glow x={tx} y={ty - 40 * s} r={260 * s} kind="warm" o={0.45} />

      <g transform={`translate(${tx} ${ty}) scale(${s * 1.05})`}>
        {look > 0 ? (
          <g opacity={0.28 * look * (0.85 + 0.15 * Math.sin(t / 10))}>
            <polygon points={`0,-60 ${coneLen * 0.65},${-coneLen} ${coneLen},${-coneLen * 0.45}`} fill={PALETTE.cyan} />
            <line x1={0} y1={-60} x2={coneLen * 0.65} y2={-coneLen} stroke={PALETTE.cyan} strokeWidth={3} strokeDasharray="8 8" />
            <line x1={0} y1={-60} x2={coneLen} y2={-coneLen * 0.45} stroke={PALETTE.cyan} strokeWidth={3} strokeDasharray="8 8" />
          </g>
        ) : null}

        {[4, 3, 2, 1, 0].map((lvl) => {
          const dy = 56 + lvl * 12;
          const shades = ['#E2EAFA', '#BCCAE6', '#94A6CB', '#6E81AB', '#4E5F88'];
          return (
            <polygon
              key={lvl}
              points={`0,${dy - 26} ${175 - lvl * 7},${dy} 0,${dy + 42} ${-175 + lvl * 7},${dy}`}
              fill={shades[lvl]}
              stroke={DARK_LINE}
              strokeWidth={3.8}
              strokeLinejoin="round"
            />
          );
        })}

        <rect x={-34} y={-20} width={68} height={62} rx={8} fill="#252C4A" stroke={DARK_LINE} strokeWidth={4} />

        <g transform="translate(0 -65)">
          {hexOffsets.map(([hx, hy], i) => {
            const rH = 22;
            const pts = Array.from({ length: 6 })
              .map((_, k) => {
                const a = (k * Math.PI) / 3;
                return `${hx + Math.cos(a) * rH},${hy + Math.sin(a) * rH}`;
              })
              .join(' ');
            return <polygon key={i} points={pts} fill={i === 0 ? '#FFE28A' : i % 2 === 0 ? PALETTE.gold : '#E69F2E'} stroke={DARK_LINE} strokeWidth={3.5} />;
          })}
          <line x1={0} y1={-55} x2={75} y2={-18} stroke={DARK_LINE} strokeWidth={6} />
          <line x1={-38} y1={34} x2={75} y2={-18} stroke={DARK_LINE} strokeWidth={6} />
          <line x1={0} y1={-55} x2={75} y2={-18} stroke="#B8C8E8" strokeWidth={2.5} />
          <line x1={-38} y1={34} x2={75} y2={-18} stroke="#B8C8E8" strokeWidth={2.5} />
          <circle cx={75} cy={-18} r={11} fill="#D9E4FC" stroke={DARK_LINE} strokeWidth={3.5} />
        </g>

        {flashO > 0.05 ? (
          <g opacity={flashO}>
            <Glow x={75} y={-83} r={140} kind="cool" o={0.8} />
            <path d="M 75 -125 L 82 -90 L 117 -83 L 82 -76 L 75 -41 L 68 -76 L 33 -83 L 68 -90 Z" fill="#FFFFFF" />
          </g>
        ) : null}
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1304} lights={[[tx, ty - 20, 480]]} veilO={0.34} />
    </g>
  );
};

/** 14. darkweb: Cosmic web of glowing filaments, galaxy nodes & dark voids bending outward. */
export const DarkwebSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = clamp(num(sp, 't', 0.6), 0, 1);
  const warp = clamp(num(sp, 'warp', 0), 0, 1);
  const glowKey = str(sp, 'glow', 'cyan');

  const tint = glowKey === 'gold' ? PALETTE.gold : glowKey === 'violet' ? '#B388FF' : PALETTE.cyan;
  const glowKind = glowKey === 'gold' ? 'warm' : 'cool';

  if (layer === 'far') {
    return <DeepSpaceFar id={id} W={W} H={H} t={t} seed={1401} stars={85} glow={glowKind} rayColor={tint} rayO={0.07} glowX={cx} glowY={cy} />;
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1409} kind="soft" />;
  }

  const warpAmt = 1 + (warp * 0.34 + 0.05 * Math.sin(t / 28)) * (0.75 + 0.25 * easeInOut(p));
  const nodes = Array.from({ length: 16 }).map((_, i) => {
    const baseA = (i / 16) * Math.PI * 2 + rnd(1420, i) * 0.45;
    const baseR = (110 + rnd(1421, i) * 245) * s * warpAmt;
    return {
      x: cx + Math.cos(baseA + warp * 0.14) * baseR,
      y: cy - 20 * s + Math.sin(baseA + warp * 0.14) * baseR * 0.58,
      r: 6 + rnd(1422, i) * 7,
    };
  });

  const drawProg = clamp(lerp(Math.max(0.2, spT - 0.35), spT + 0.15, easeOut(p)));

  return (
    <g>
      {[
        [-140, -60],
        [160, 40],
        [10, 95],
      ].map(([vx, vy], i) => (
        <ellipse key={i} cx={cx + vx * s} cy={cy + vy * s} rx={120 * s} ry={64 * s} fill="#04050D" opacity={0.65} />
      ))}

      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        const opp = nodes[(i + 5) % nodes.length];
        const mx = (n.x + next.x) / 2 + Math.sin(i + t / 40) * 28 * s;
        const my = (n.y + next.y) / 2 + Math.cos(i + t / 40) * 18 * s;
        const ox = (n.x + opp.x) / 2;
        const oy = (n.y + opp.y) / 2 - 24 * s;
        return (
          <g key={`f${i}`} opacity={0.78 * drawProg}>
            <path d={`M ${n.x} ${n.y} Q ${mx} ${my} ${next.x} ${next.y}`} fill="none" stroke={tint} strokeWidth={5} opacity={0.28} />
            <path d={`M ${n.x} ${n.y} Q ${mx} ${my} ${next.x} ${next.y}`} fill="none" stroke={tint} strokeWidth={2.5} />
            {i % 2 === 0 ? <path d={`M ${n.x} ${n.y} Q ${ox} ${oy} ${opp.x} ${opp.y}`} fill="none" stroke={tint} strokeWidth={2} opacity={0.52} /> : null}
          </g>
        );
      })}

      {nodes.map((n, i) => {
        const pulse = 0.8 + 0.25 * Math.sin(t / 10 + i);
        return (
          <g key={`n${i}`} transform={`translate(${n.x} ${n.y}) scale(${pulse})`}>
            <Glow x={0} y={0} r={n.r * 5} kind={glowKind} o={0.42} />
            <circle cx={0} cy={0} r={n.r} fill={i % 3 === 0 ? PALETTE.cream : tint} stroke={DARK_LINE} strokeWidth={2.5} />
          </g>
        );
      })}

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1404} lights={[[cx, cy, 560]]} veilO={0.35} />
    </g>
  );
};

/** 15. planet: Blinding star on left eclipsed by coronagraph mask revealing blue-green planet on right. */
export const PlanetSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const maskTarget = clamp(num(sp, 'mask', 0.5), 0, 1);
  const spT = num(sp, 't', 0.4);

  if (layer === 'far') {
    return <DeepSpaceFar id={id} W={W} H={H} t={t} seed={1501} stars={120} glow="cool" rayColor="#CFE6FF" rayO={0.07} glowX={cx - 180 * s} glowY={cy} />;
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1509} kind="truss" />;
  }

  const maskVal = clamp(lerp(Math.max(0, maskTarget - 0.18), maskTarget, easeInOut(p)));
  const glare = 1 - maskVal * 0.86;
  const starX = cx - 210 * s;
  const planetX = cx + 220 * s;
  const py = cy - 22 * s + Math.sin(t / 28 + spT * 4) * 8;

  return (
    <g>
      <g transform={`translate(${starX} ${py})`}>
        <Glow x={0} y={0} r={340 * s * glare} kind="warm" o={0.85 * glare} />
        <Rays x={0} y={0} t={t} len={520 * s * glare} n={12} o={0.24 * glare} color="#FFFFFF" />
        <g opacity={glare} fill="#FFFFFF">
          <path d={`M ${-260 * s} 0 L 0 ${-16 * s} L ${260 * s} 0 L 0 ${16 * s} Z`} />
          <path d={`M 0 ${-260 * s} L ${16 * s} 0 L 0 ${260 * s} L ${-16 * s} 0 Z`} />
        </g>
        <circle cx={0} cy={0} r={54 * s} fill="#FFFDF5" stroke={DARK_LINE} strokeWidth={4} />

        {maskVal > 0.05 ? (
          <g>
            <line x1={0} y1={0} x2={-180 * s} y2={240 * s} stroke="#232944" strokeWidth={10} />
            <circle cx={0} cy={0} r={66 * s * easeOut(maskVal)} fill="#080712" stroke={PALETTE.cyan} strokeWidth={4} />
          </g>
        ) : null}
      </g>

      <g transform={`translate(${planetX} ${py + 12 * s})`} opacity={0.28 + 0.72 * maskVal}>
        <Glow x={0} y={0} r={115 * s} kind="cool" o={0.55 * maskVal} />
        <circle cx={0} cy={0} r={42 * s} fill="#259E9A" stroke={DARK_LINE} strokeWidth={4} />
        <path d={`M ${-34 * s} ${-10 * s} Q 0 ${-24 * s} ${34 * s} ${-8 * s}`} fill="none" stroke="#9EF5EA" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
        <path d={`M ${-28 * s} ${14 * s} Q ${6 * s} ${22 * s} ${30 * s} ${8 * s}`} fill="none" stroke="#6BD4CE" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
        <path d={`M ${-4 * s} ${-40 * s} A ${40 * s} ${40 * s} 0 0 0 ${-4 * s} ${40 * s} A ${22 * s} ${40 * s} 0 0 1 ${-4 * s} ${-40 * s} Z`} fill="#DFFFFF" opacity={0.4} />
        <circle cx={68 * s * Math.cos(t / 30)} cy={18 * s * Math.sin(t / 30)} r={6 * s} fill="#DCE4F5" stroke={DARK_LINE} strokeWidth={2.5} />
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1504} lights={[[starX, py, 360], [planetX, py, 240]]} veilO={0.34} />
    </g>
  );
};

/** 16. void: Plain deep-navy SpaceBackdrop stage with slow tinted rays and almost no stars. */
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const { cx, cy } = stageLayout(W, H, ground);
  const glowKey = str(sp, 'glow', 'gold');
  const rayColor = glowKey === 'red' ? '#FF7A6A' : glowKey === 'cyan' ? '#70E8FF' : '#FFE2B0';
  const glowKind = glowKey === 'red' ? 'red' : glowKey === 'cyan' ? 'cool' : 'warm';
  const rim = glowKey === 'red' ? '#E87482' : glowKey === 'cyan' ? '#7CE4FF' : '#F2CE8A';

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={1601}
        stars={28}
        glow={glowKind}
        rayColor={rayColor}
        rayO={0.12}
        glowX={cx}
        glowY={cy - 40}
        nebula={false}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1609} kind="soft" />;
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy - 20}
        r={320}
        fill="none"
        stroke={rayColor}
        strokeWidth={2}
        strokeDasharray="10 18"
        opacity={0.14}
        transform={`rotate(${t * 0.08} ${cx} ${cy - 20})`}
      />
      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1604} floorFill="#0C0E20" rim={rim} lights={[[cx, cy, 620]]} veilO={0.38} dustN={30} />
    </g>
  );
};
