import React from 'react';
import { FONTS, PALETTE } from '../../brand';
import { clamp, easeInOut, easeOut, backOut, lerp, rnd } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { Rays, Stars } from '../../engine/kit';
import type { SetProps } from './render';
import {
  DARK_LINE,
  num,
  stageLayout,
  DeepSpaceFar,
  MidAtmosphere,
  NearEdges,
} from './sets-shared';

/** 6. skyspeck: Oval whole-sky map showing Hubble's 0.1% gold patch vs Roman's 50x cyan survey. */
export const SkyspeckSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const cover = num(sp, 'cover', 0);
  const rom = num(sp, 'rom', 0);
  const spT = num(sp, 't', 0.3);

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={601}
        stars={100}
        glow={rom > 0.3 ? 'cool' : 'warm'}
        rayColor={rom > 0.3 ? '#6CE3FF' : '#FFE099'}
        rayO={0.07}
        glowX={cx}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={609} kind="soft" />;
  }

  const pullOut = lerp(1.12, 0.94, clamp(spT * 0.65 + p * 0.35));
  const rx = 430 * s * pullOut;
  const ry = 220 * s * pullOut;
  const romFrac = easeInOut(clamp(p / 0.78)) * rom;
  const hubPop = backOut(clamp(p / 0.3)) * cover;

  return (
    <g>
      <defs>
        <clipPath id={`${id}oval`}>
          <ellipse cx={0} cy={0} rx={rx} ry={ry} />
        </clipPath>
      </defs>

      <Glow x={cx} y={cy - 18 * s} r={340 * s} kind={rom > 0 ? 'cool' : 'warm'} o={0.35} />

      <g transform={`translate(${cx} ${cy - 18 * s})`}>
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#0B1128" stroke={DARK_LINE} strokeWidth={8} />

        <g clipPath={`url(#${id}oval)`}>
          <rect x={-rx} y={-22} width={rx * 2} height={44} fill="#253469" opacity={0.42} />
          <line x1={-rx} y1={0} x2={rx} y2={0} stroke={PALETTE.cream} strokeWidth={1.5} opacity={0.28} />
          <line x1={0} y1={-ry} x2={0} y2={ry} stroke={PALETTE.cream} strokeWidth={1.5} opacity={0.28} />
          {[-0.5, 0.5].map((f, i) => (
            <ellipse key={`lon${i}`} cx={0} cy={0} rx={rx * Math.abs(f)} ry={ry} fill="none" stroke={PALETTE.cream} strokeWidth={1.4} opacity={0.22} />
          ))}
          {[-0.45, 0.45].map((f, i) => (
            <path
              key={`lat${i}`}
              d={`M ${-rx} ${ry * f} Q 0 ${ry * f * 1.25} ${rx} ${ry * f}`}
              fill="none"
              stroke={PALETTE.cream}
              strokeWidth={1.4}
              opacity={0.22}
            />
          ))}
          {Array.from({ length: 85 }).map((_, i) => (
            <circle
              key={i}
              cx={(rnd(620, i) - 0.5) * rx * 1.9}
              cy={(rnd(621, i) - 0.5) * ry * 1.85}
              r={1 + rnd(622, i) * 1.8}
              fill="#E8F0FF"
              opacity={0.35 + 0.45 * Math.sin(t / 12 + i)}
            />
          ))}

          {rom > 0 ? (
            <g opacity={0.68 * romFrac}>
              <path
                d={`M ${-rx * 0.48} ${-ry * 0.58} Q ${-rx * 0.05} ${-ry * 0.65} ${rx * 0.35 * romFrac} ${-ry * 0.42} L ${rx * 0.44 * romFrac} ${-ry * 0.14} Q ${-rx * 0.05} ${-ry * 0.2} ${-rx * 0.52} ${-ry * 0.22} Z`}
                fill={PALETTE.cyan}
                stroke="#9AF2FF"
                strokeWidth={2.5}
              />
              <path
                d={`M ${-rx * 0.28} ${ry * 0.22} Q ${rx * 0.12 * romFrac} ${ry * 0.16} ${rx * 0.52 * romFrac} ${ry * 0.34} L ${rx * 0.34 * romFrac} ${ry * 0.64} Q ${-rx * 0.05} ${ry * 0.58} ${-rx * 0.32} ${ry * 0.46} Z`}
                fill={PALETTE.cyan}
                stroke="#9AF2FF"
                strokeWidth={2.5}
              />
            </g>
          ) : null}
        </g>

        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={PALETTE.cream} strokeWidth={3} opacity={0.78} />

        {cover > 0 ? (
          <g transform={`translate(${-rx * 0.36} ${-ry * 0.36}) scale(${hubPop})`}>
            <circle cx={0} cy={0} r={22 * (1 + 0.18 * Math.sin(t / 8))} fill="none" stroke={PALETTE.gold} strokeWidth={2.5} opacity={0.7} />
            <rect x={-7} y={-7} width={14} height={14} rx={2} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={2} />
            <text x={24} y={-14} fontFamily={FONTS.ui} fontSize={17} fill={PALETTE.gold}>
              0.1%
            </text>
          </g>
        ) : null}
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={604} lights={[[cx, cy, 520]]} veilO={0.34} />
    </g>
  );
};

/** 7. mosaic: Andromeda stitched from up to 600 overlapping square tiles + 10-year calendar bar. */
export const MosaicSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const tilesTarget = clamp(num(sp, 'tiles', 600), 0, 600);
  const cal = clamp(num(sp, 'calendar', 10), 0, 10);
  const glowOn = num(sp, 'glow', 0) > 0;

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={701}
        stars={120}
        glow={glowOn ? 'warm' : 'cool'}
        rayColor={glowOn ? '#FFE6AE' : '#A6C8FF'}
        rayO={glowOn ? 0.13 : 0.06}
        glowX={cx}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={709} kind="soft" />;
  }

  const startTiles = Math.max(0, tilesTarget - 45);
  const shown = Math.floor(lerp(startTiles, tilesTarget, easeOut(clamp(p / 0.85))));
  const rx = 385 * s;
  const ry = 152 * s;
  const barW = 340 * s;

  return (
    <g>
      <g transform={`translate(${cx} ${cy - 34 * s}) rotate(-18)`}>
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#0D142C" fillOpacity={0.6} stroke="#4C649E" strokeWidth={2.5} strokeDasharray="10 8" />

        {Array.from({ length: shown }).map((_, i) => {
          const ang = rnd(731, i) * Math.PI * 2;
          const rad = Math.sqrt(rnd(732, i));
          const tx = Math.cos(ang) * rx * 0.94 * rad;
          const ty = Math.sin(ang) * ry * 0.94 * rad;
          const isNew = i >= shown - 4;
          const fill =
            rad < 0.25 ? '#FFF3D6' : rad < 0.45 ? '#F5CE8B' : rad < 0.72 ? '#7AA6F5' : '#3C5EA8';
          return (
            <rect
              key={i}
              x={tx - 11 * s}
              y={ty - 11 * s}
              width={22 * s}
              height={22 * s}
              rx={2}
              fill={fill}
              fillOpacity={glowOn ? 0.62 : 0.84}
              stroke={isNew ? '#FFFFFF' : '#162044'}
              strokeWidth={isNew ? 2.6 : 1.2}
            />
          );
        })}

        {glowOn ? (
          <g>
            <Glow x={0} y={0} r={270 * s} kind="warm" o={0.55 + 0.12 * Math.sin(t / 12)} />
            <ellipse cx={0} cy={0} rx={92 * s} ry={46 * s} fill="#FFF7DF" opacity={0.75} />
          </g>
        ) : null}
      </g>

      <g transform={`translate(${cx - barW / 2} ${cy + 158 * s})`}>
        <rect x={0} y={0} width={barW} height={22} rx={11} fill="#14182D" stroke={DARK_LINE} strokeWidth={4} />
        <rect
          x={4}
          y={4}
          width={Math.max(8, (barW - 8) * (cal / 10) * easeOut(clamp(p / 0.6)))}
          height={14}
          rx={7}
          fill={cal >= 9.5 ? PALETTE.gold : PALETTE.cyan}
        />
        {Array.from({ length: 9 }).map((_, k) => (
          <line key={k} x1={((k + 1) / 10) * barW} y1={2} x2={((k + 1) / 10) * barW} y2={20} stroke={DARK_LINE} strokeWidth={2} />
        ))}
        <text x={barW / 2} y={44} textAnchor="middle" fontFamily={FONTS.ui} fontSize={19} fill={PALETTE.gold} letterSpacing={2}>
          {`${Math.round(cal)} / 10 YEARS  (${shown} TILES)`}
        </text>
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={704} lights={[[cx, cy - 20, 520]]} veilO={0.34} />
    </g>
  );
};

/** 8. l2: Earth+Moon on left, dotted L2 halo ellipse on right, gold-mirror telescope travelling/orbiting. */
export const L2Set: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = num(sp, 't', 0.5);
  const halo = num(sp, 'halo', 0);
  const sunOn = num(sp, 'sun', 1) > 0;

  if (layer === 'far') {
    return (
      <DeepSpaceFar
        id={id}
        W={W}
        H={H}
        t={t}
        seed={801}
        stars={125}
        glow={sunOn ? 'warm' : 'cool'}
        rayColor={sunOn ? '#FFD48C' : '#65A4D8'}
        rayO={sunOn ? 0.14 : 0.04}
        glowX={sunOn ? -40 : cx + 220}
        glowY={cy}
      />
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={809} kind="soft" />;
  }

  const earthX = cx - 320 * s;
  const l2X = cx + 290 * s;
  const axisY = cy - 28 * s;

  const moonAng = t / 40;
  const moonR = 112 * s;
  const travelProg = clamp(lerp(Math.max(0, spT - 0.18), spT, easeInOut(p)));
  const haloAng = (spT * 2.2 + p * 1.2) * Math.PI * 2;
  const haloRx = 62 * s;
  const haloRy = 114 * s;

  const scopeX = halo > 0.15 ? l2X + Math.cos(haloAng) * haloRx : lerp(earthX + 75 * s, l2X, travelProg);
  const scopeY = halo > 0.15 ? axisY + Math.sin(haloAng) * haloRy : axisY;

  return (
    <g>
      {sunOn ? (
        <g>
          <Glow x={-30} y={axisY} r={440 * s} kind="warm" o={0.72} />
          <Rays x={-40} y={axisY} t={t} len={W * 0.9} n={10} o={0.09} color="#FFE0A3" />
        </g>
      ) : null}

      <line x1={earthX + 60 * s} y1={axisY} x2={l2X} y2={axisY} stroke="#6E82B8" strokeWidth={3} strokeDasharray="12 10" />

      <g transform={`translate(${earthX} ${axisY})`}>
        <circle cx={0} cy={0} r={moonR} fill="none" stroke="#4D5F91" strokeWidth={2} strokeDasharray="5 7" />
        <circle cx={0} cy={0} r={68 * s} fill="none" stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="4 5" opacity={0.6} />
        <circle cx={0} cy={0} r={52 * s} fill="#2A6EDB" stroke={DARK_LINE} strokeWidth={4} />
        <path d={`M ${-24 * s} ${-26 * s} Q ${4 * s} ${-16 * s} ${-6 * s} ${14 * s} Q ${-28 * s} ${10 * s} ${-24 * s} ${-26 * s} Z`} fill="#36B38B" />
        <path d={`M ${12 * s} ${-8 * s} Q ${36 * s} ${2 * s} ${22 * s} ${30 * s} Q ${4 * s} ${20 * s} ${12 * s} ${-8 * s} Z`} fill="#36B38B" />
        {!sunOn ? <circle cx={0} cy={0} r={50 * s} fill="#080B1C" opacity={0.48} /> : null}
        <text y={82 * s} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.sky} letterSpacing={2}>
          EARTH
        </text>
        <circle cx={Math.cos(moonAng) * moonR} cy={Math.sin(moonAng) * moonR} r={13 * s} fill="#DCE3F5" stroke={DARK_LINE} strokeWidth={3} />
      </g>

      <g transform={`translate(${l2X} ${axisY})`}>
        <ellipse cx={0} cy={0} rx={haloRx} ry={haloRy} fill="none" stroke={PALETTE.cyan} strokeWidth={3} strokeDasharray="8 8" opacity={0.8} />
        <polygon points="0,-10 10,0 0,10 -10,0" fill={PALETTE.cyan} stroke={DARK_LINE} strokeWidth={2.5} />
        <Glow x={0} y={0} r={65} kind="cool" o={0.55} />
        <text x={24} y={6} fontFamily={FONTS.ui} fontSize={22} fill={PALETTE.cyan} letterSpacing={2}>
          L2
        </text>
      </g>

      <g transform={`translate(${scopeX} ${scopeY}) scale(${s})`}>
        <Glow x={0} y={0} r={55} kind="warm" o={0.45} />
        <polygon points="-24,10 24,10 16,22 -16,22" fill="#D4DDF2" stroke={DARK_LINE} strokeWidth={3} />
        <polygon points="0,-18 14,-10 14,6 0,12 -14,6 -14,-10" fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={3} />
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={804} lights={[[earthX, axisY, 340], [l2X, axisY, 360]]} veilO={0.34} />
    </g>
  );
};

/** 9. pixelwall: Giant mosaic pixel grid zooming to big square pixels, gold selection & trading card. */
export const PixelwallSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const zoomVal = clamp(num(sp, 'zoom', 0.5), 0, 1);
  const pick = num(sp, 'pick', 0);
  const card = num(sp, 'card', 0);

  if (layer === 'far') {
    return <DeepSpaceFar id={id} W={W} H={H} t={t} seed={901} stars={75} glow="cool" rayColor="#8FE8FF" rayO={0.07} glowX={cx} glowY={cy} />;
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={909} kind="truss" />;
  }

  const cols = 22;
  const rows = 12;
  const pxSize = 36 * s;
  const targetCol = 10;
  const targetRow = 5;
  const wallW = 860 * s;
  const wallH = 440 * s;
  const zScale = lerp(0.92, 2.55, easeInOut(lerp(Math.max(0, zoomVal - 0.12), zoomVal, p)));
  const cardPop = card > 0 ? backOut(clamp((p - 0.18) / 0.35)) : 0;
  const pickDrop = pick > 0 ? lerp(1.75, 1.0, backOut(clamp(p / 0.4))) : 0;

  return (
    <g>
      <defs>
        <clipPath id={`${id}wallclip`}>
          <rect x={-wallW / 2} y={-wallH / 2} width={wallW} height={wallH} rx={16} />
        </clipPath>
      </defs>

      <g transform={`translate(${cx} ${cy - 22 * s})`}>
        <rect x={-wallW / 2} y={-wallH / 2} width={wallW} height={wallH} rx={16} fill="#080B1C" stroke={DARK_LINE} strokeWidth={8} />

        <g clipPath={`url(#${id}wallclip)`}>
          <g transform={`scale(${zScale}) translate(${-(targetCol + 0.5 - cols / 2) * pxSize} ${-(targetRow + 0.5 - rows / 2) * pxSize})`}>
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((__, c) => {
                const idx = r * cols + c;
                const d1 = Math.hypot(c - 6.5, r - 4.2);
                const d2 = Math.hypot(c - 15.2, r - 7.1);
                const d3 = Math.hypot(c - targetCol, r - targetRow);
                let fill = '#101734';
                if (d1 < 2.2) fill = d1 < 0.9 ? '#FFF0C4' : '#5F8FF2';
                else if (d2 < 2.1) fill = d2 < 0.9 ? '#FFD8A8' : '#E36B78';
                else if (d3 < 1.8) fill = d3 < 0.7 ? '#FFE9A3' : '#40BFFF';
                else if (rnd(930, idx) > 0.87) fill = '#324B8E';
                const isTarget = c === targetCol && r === targetRow;
                return (
                  <rect
                    key={idx}
                    x={(c - cols / 2) * pxSize}
                    y={(r - rows / 2) * pxSize}
                    width={pxSize - 1.5}
                    height={pxSize - 1.5}
                    fill={isTarget && pick > 0 ? PALETTE.gold : fill}
                    stroke={isTarget && pick > 0 ? '#FFFFFF' : '#090C1C'}
                    strokeWidth={isTarget && pick > 0 ? 2.5 : 1}
                  />
                );
              }),
            )}
          </g>
        </g>

        <rect x={-wallW / 2} y={-wallH / 2} width={wallW} height={wallH} rx={16} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} opacity={0.6} />

        {pick > 0 ? (
          <g transform={`scale(${pickDrop})`}>
            <Glow x={0} y={0} r={140 * s} kind="warm" o={0.6} />
            <rect
              x={(-pxSize * zScale) / 2 - 4}
              y={(-pxSize * zScale) / 2 - 4}
              width={pxSize * zScale + 8}
              height={pxSize * zScale + 8}
              rx={4}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={4.5}
            />
          </g>
        ) : null}

        {card > 0 ? (
          <g transform={`translate(${185 * s} ${-18 * s}) scale(${cardPop} ${clamp(cardPop + 0.01)})`}>
            <rect x={-88} y={-118} width={176} height={236} rx={16} fill="#18152E" stroke={DARK_LINE} strokeWidth={6} />
            <rect x={-88} y={-118} width={176} height={236} rx={16} fill="none" stroke={PALETTE.gold} strokeWidth={3.5} />
            <rect x={-68} y={-96} width={136} height={110} rx={10} fill="#0F1738" stroke={PALETTE.cyan} strokeWidth={2.5} />
            <circle cx={0} cy={-41} r={24} fill={PALETTE.gold} opacity={0.85} />
            <circle cx={-28} cy={-64} r={5} fill={PALETTE.cyan} />
            <text y={44} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.gold} letterSpacing={2}>
              PIXEL #4092
            </text>
            <text y={74} textAnchor="middle" fontFamily={FONTS.ui} fontSize={15} fill={PALETTE.cyan} letterSpacing={1.5}>
              ROMAN FIRST LIGHT
            </text>
            <rect x={-52} y={90} width={104} height={10} rx={5} fill={PALETTE.cyan} opacity={0.45} />
          </g>
        ) : null}
      </g>

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={904} lights={[[cx, cy, 520]]} veilO={0.34} />
    </g>
  );
};

/** 10. stream: Dark conference auditorium, giant LIVE screen with starry preview & countdown, cheering silhouettes. */
export const StreamSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const { cx, cy, s } = stageLayout(W, H, ground);
  const spT = num(sp, 't', 0.7);
  const count = clamp(num(sp, 'count', 0.2), 0, 1);
  const cheer = num(sp, 'cheer', 0) > 0;

  if (layer === 'far') {
    const scrW = 860 * s;
    const scrH = 400 * s;
    const scrY = cy - 68 * s;
    const bright = 0.45 + 0.55 * clamp(spT);
    const ringR = lerp(24, 62, count);
    return (
      <g>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill="#090816" />
        {[-3, -2, -1, 1, 2, 3].map((k) => (
          <rect key={k} x={cx + k * 250 * s - 90 * s} y={-200} width={180 * s} height={H + 400} fill="#111026" opacity={0.55} />
        ))}
        <Glow x={cx} y={scrY} r={540 * s} kind="cool" o={0.22 + 0.34 * bright} />
        <Rays x={cx} y={scrY} t={t} len={1100} o={0.07 * bright} color="#9CE4FF" />

        <g transform={`translate(${cx} ${scrY})`}>
          <rect x={-scrW / 2} y={-scrH / 2} width={scrW} height={scrH} rx={16} fill="#0F1530" stroke={DARK_LINE} strokeWidth={8} />
          <rect x={-scrW / 2 + 10} y={-scrH / 2 + 10} width={scrW - 20} height={scrH - 20} rx={10} fill="#090E24" opacity={bright} />
          <Stars seed={1010} x0={-scrW / 2 + 20} y0={-scrH / 2 + 20} w={scrW - 40} h={scrH - 40} t={t} n={65} o={0.85 * bright} />
          <ellipse cx={-60 * s} cy={15 * s} rx={155 * s} ry={58 * s} transform="rotate(-14)" fill="#4D7DE0" opacity={0.35 * bright} />

          <g transform={`translate(${-scrW / 2 + 78} ${-scrH / 2 + 46})`}>
            <rect x={-46} y={-16} width={92} height={32} rx={8} fill="#14182D" stroke={PALETTE.cyan} strokeWidth={2.5} />
            <circle cx={-24} cy={0} r={6} fill={PALETTE.cyan} opacity={0.45 + 0.55 * Math.sin(t / 5)} />
            <text x={10} y={6} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cyan} letterSpacing={2}>
              LIVE
            </text>
          </g>

          {count > 0.05 ? (
            <g transform={`translate(${scrW * 0.22} 0)`}>
              <circle cx={0} cy={0} r={ringR * 1.15} fill="none" stroke="#2D3C6B" strokeWidth={5} />
              <circle
                cx={0}
                cy={0}
                r={ringR}
                fill="none"
                stroke={PALETTE.cyan}
                strokeWidth={5}
                strokeDasharray={`${Math.PI * 2 * ringR * count} 600`}
                transform={`rotate(${-90 + t * 1.5})`}
              />
              <text y={8} textAnchor="middle" fontFamily={FONTS.ui} fontSize={24} fill={PALETTE.cream}>
                {`T-${Math.max(1, Math.round(count * 10))}`}
              </text>
            </g>
          ) : (
            <g transform={`translate(${scrW * 0.2} 0)`}>
              <Glow x={0} y={0} r={90} kind="warm" o={0.55} />
              <text y={8} textAnchor="middle" fontFamily={FONTS.title} fontSize={32} fill={PALETTE.gold}>
                ON AIR
              </text>
            </g>
          )}
        </g>
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdges W={W} H={H} t={t} seed={1019} kind="soft" />;
  }

  const rows = [
    { y: ground - 115 * s, n: 10, fill: '#181730' },
    { y: ground - 45 * s, n: 12, fill: '#121126' },
  ];

  return (
    <g>
      {rows.map((row, rIdx) => (
        <g key={rIdx}>
          {Array.from({ length: row.n }).map((_, c) => {
            const sx = cx + (c - (row.n - 1) / 2) * (115 * s) + (rIdx % 2) * 32 * s;
            const bounce = cheer ? Math.abs(Math.sin(t / 6 + c * 1.3 + rIdx)) * 10 : 0;
            return (
              <g key={c} transform={`translate(${sx} ${row.y - bounce})`}>
                {cheer && (c + rIdx) % 2 === 0 ? (
                  <g>
                    <path d="M -16 6 Q -24 -28 -18 -46 M 16 6 Q 24 -28 18 -46" fill="none" stroke={row.fill} strokeWidth={11} strokeLinecap="round" />
                    <circle cx={-18} cy={-50} r={5} fill={c % 3 === 0 ? PALETTE.gold : PALETTE.cyan} opacity={0.85} />
                  </g>
                ) : null}
                <rect x={-32 * s} y={0} width={64 * s} height={58 * s} rx={12} fill={row.fill} stroke={DARK_LINE} strokeWidth={3.5} />
              </g>
            );
          })}
        </g>
      ))}

      <MidAtmosphere id={id} W={W} H={H} ground={ground} t={t} seed={1004} floorFill="#131224" rim="#7A88BA" lights={[[cx, cy - 50 * s, 600]]} veilO={0.38} />
    </g>
  );
};
