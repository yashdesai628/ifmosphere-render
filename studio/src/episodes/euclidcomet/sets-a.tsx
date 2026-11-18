import React from 'react';
import type { SetProps } from './render';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import { Stars, Sun, Rays, Foreground } from '../../engine/kit';
import { Glow, WallTexture, RoomCorners } from '../../engine/light';
import {
  DARK_INK,
  num,
  str,
  DeepSpaceBase,
  TinyGalaxies,
  StageFloor,
  NearEdgeBlurs,
  SoftBand,
  CometArt,
  EuclidArt,
  FullLightVeil,
  SceneDust,
} from './sets-common';

/** 1. comet: Deep-space comet with cyan/gold coma, gas/dust tails, and outgassing jets. */
export const CometSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const glow = str(sp.glow, 'cyan') === 'gold' ? 'gold' : 'cyan';
  const jets = num(sp.jets, 0.5);
  const vert = H > W;
  const drift = clamp(lerp(st - 0.08, st + 0.08, easeInOut(p)));
  const cx = lerp(W * 0.32, W * 0.62, drift);
  const cy = (vert ? H * 0.47 : H * 0.42) + Math.sin(t / 24) * 6;
  const isGold = glow === 'gold';

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase
          id={id}
          t={t}
          seed={113}
          starCount={80}
          bg={isGold ? '#130E24' : '#0A0A1E'}
          rayColor={isGold ? '#FFD98E' : '#7CE8FF'}
          rayOpacity={isGold ? 0.14 : 0.11}
          rayX={W * 0.14}
          rayY={H * 0.16}
          W={W}
          H={H}
        />
        <Sun x={W * 0.12} y={H * 0.15} r={isGold ? 34 : 22} t={t} rays={false} />
        <SoftBand id={id} y={H * 0.44} h={340} color={isGold ? '#F2B33D' : '#38BDF8'} o={0.09} />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#050610" />;
  }
  return (
    <g>
      <Glow x={cx} y={cy} r={vert ? 320 : 380} kind={isGold ? 'warm' : 'cool'} o={0.34} />
      {/* Distant icy horizon plane */}
      <path
        d={`M -400 ${ground} Q ${W * 0.25} ${ground - 36} ${W * 0.55} ${ground - 18} T ${W + 400} ${ground} L ${W + 400} ${H + 600} L -400 ${H + 600} Z`}
        fill="#151930"
        stroke={DARK_INK}
        strokeWidth={3.5}
      />
      <g transform={`translate(${cx} ${cy})`}>
        <CometArt id={id} t={t} glow={glow} jets={jets} tailLen={vert ? 540 : 760} scale={vert ? 1.1 : 1.35} />
      </g>
      <StageFloor
        y={ground}
        fill="#19203A"
        subFill="#0B0F1F"
        rim={isGold ? '#F8C977' : '#8ADCF5'}
        W={W}
        rimOpacity={0.72}
      />
      <FullLightVeil id={`${id}v`} lights={[[cx, cy, 460], [W * 0.5, ground - 120, 460]]} o={0.3} />
      <SceneDust t={t} seed={211} W={W} H={H} n={34} o={0.5} />
    </g>
  );
};

/** 2. surface: Standing on the comet's icy ground with overhead arching tail and venting gas jets. */
export const SurfaceSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const bright = str(sp.tint, 'dim') === 'bright';
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase
          id={id}
          t={t}
          seed={137}
          starCount={135}
          bg={bright ? '#121B38' : '#060814'}
          rayColor={bright ? '#D4ECFF' : '#7AA5E8'}
          rayOpacity={bright ? 0.14 : 0.08}
          rayX={W * 0.14}
          rayY={H * 0.15}
          W={W}
          H={H}
        />
        <Sun x={W * 0.14} y={H * 0.16} r={bright ? 30 : 20} t={t} rays={false} />
        {/* Arching dust tail sweeping across the overhead sky */}
        <defs>
          <linearGradient id={`${id}arch`} x1="0" y1={H * 0.28} x2={W} y2={H * 0.2} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A5F3FC" stopOpacity={0.05} />
            <stop offset="45%" stopColor="#F6EFE3" stopOpacity={bright ? 0.34 : 0.22} />
            <stop offset="100%" stopColor="#E6CE9E" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <path
          d={`M -200 ${H * 0.42} Q ${W * 0.48} ${H * 0.05} ${W + 240} ${H * 0.28} L ${W + 240} ${H * 0.44} Q ${W * 0.48} ${H * 0.18} -200 ${H * 0.56} Z`}
          fill={`url(#${id}arch)`}
        />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#090D1C" />;
  }

  const ventSpots = [0.22 * W, 0.54 * W, 0.8 * W];
  return (
    <g>
      {/* Distant jagged icy crater ridges */}
      <path
        d={`M -400 ${ground} L -180 ${ground - 95} L ${W * 0.12} ${ground - 52} L ${W * 0.28} ${ground - 115} L ${W * 0.48} ${ground - 40} L ${W * 0.68} ${ground - 108} L ${W * 0.88} ${ground - 55} L ${W + 300} ${ground - 85} L ${W + 300} ${ground + 100} L -400 ${ground + 100} Z`}
        fill={bright ? '#28365A' : '#181E34'}
        stroke={DARK_INK}
        strokeWidth={4}
      />
      {/* Ice boulders at outer edges (keeping center clear for Pip) */}
      <polygon
        points={`${W * 0.06},${ground + 6} ${W * 0.1},${ground - 90} ${W * 0.16},${ground - 45} ${W * 0.19},${ground + 6}`}
        fill={bright ? '#49638E' : '#26314D'}
        stroke={DARK_INK}
        strokeWidth={4}
      />
      <polygon
        points={`${W * 0.83},${ground + 6} ${W * 0.88},${ground - 105} ${W * 0.94},${ground - 55} ${W * 0.97},${ground + 6}`}
        fill={bright ? '#49638E' : '#26314D'}
        stroke={DARK_INK}
        strokeWidth={4}
      />

      {/* Ground plane with pale ice rim */}
      <StageFloor
        y={ground}
        fill={bright ? '#2C3A5E' : '#1B2238'}
        subFill="#0F1426"
        rim={bright ? '#E0F2FE' : '#9CC4E8'}
        W={W}
        rimOpacity={0.78}
      />
      {/* Cream-white surface ice patches */}
      {[0.18, 0.38, 0.64, 0.82].map((fx, i) => (
        <ellipse
          key={i}
          cx={fx * W}
          cy={ground + 28 + (i % 2) * 32}
          rx={vert ? 54 : 78}
          ry={14}
          fill={bright ? '#EBF7FF' : '#C5D8EC'}
          stroke={DARK_INK}
          strokeWidth={3.5}
          opacity={0.88}
        />
      ))}

      {/* Venting gas jets puffing up from cracks */}
      {ventSpots.map((vx, i) => {
        const phase = (st * 0.7 + p * 0.6 + t / 55 + i * 0.33) % 1;
        const puffH = lerp(25, 220, easeOut(phase));
        const puffW = lerp(16, 62, easeOut(phase));
        const op = (1 - phase) * (bright ? 0.68 : 0.48);
        return (
          <g key={i} transform={`translate(${vx} ${ground})`}>
            <path d="M -18 4 L 0 -6 L 18 4" stroke={DARK_INK} strokeWidth={4} fill="#080B16" />
            <path
              d={`M 0 0 Q ${-puffW * 0.35} ${-puffH * 0.55} ${-puffW * 0.5} ${-puffH} L ${puffW * 0.5} ${-puffH} Q ${puffW * 0.35} ${-puffH * 0.55} 0 0 Z`}
              fill="#A5F3FC"
              opacity={op}
            />
            <circle cx={-puffW * 0.18} cy={-puffH * 0.75} r={14 + phase * 22} fill="#E0F7FF" opacity={op * 0.75} />
            <Glow x={0} y={-20} r={65} kind="cool" o={0.35} />
          </g>
        );
      })}

      <FullLightVeil id={`${id}v`} lights={[[W * 0.5, ground - 160, 560]]} o={bright ? 0.2 : 0.36} />
      <SceneDust t={t} seed={229} W={W} H={H} n={40} o={0.55} />
    </g>
  );
};

/** 3. euclid: ESA Euclid telescope in deep galaxy field with widening stare cone & shutter flash. */
export const EuclidSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const stare = num(sp.stare, 0.5);
  const blink = num(sp.blink, 0);
  const vert = H > W;
  const sx = (vert ? 0.42 : 0.36) * W + (st - 0.5) * 40 + Math.sin(t / 28) * 10;
  const sy = (vert ? 0.45 : 0.43) * H + Math.cos(t / 32) * 8 + (p - 0.5) * 12;

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase id={id} t={t} seed={151} starCount={115} bg="#08081B" rayColor="#84D4FF" rayOpacity={0.11} W={W} H={H} />
        <TinyGalaxies seed={173} W={W} H={H} n={22} o={0.48} />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060814" />;
  }
  return (
    <g>
      <Glow x={sx + 95} y={sy - 15} r={340} kind="cool" o={0.28 + stare * 0.2} />
      {/* Deep sky faint grid horizon */}
      <g opacity={0.14} stroke="#7CE8FF" strokeWidth={1.5}>
        <line x1={-200} y1={ground - 120} x2={W + 200} y2={ground - 120} strokeDasharray="8 14" />
        <circle cx={sx + 290} cy={sy - 70} r={140} fill="none" strokeDasharray="6 10" />
      </g>
      <g transform={`translate(${sx} ${sy})`}>
        <EuclidArt t={t} stare={stare} blink={blink} scale={vert ? 1.05 : 1.25} showBeam />
      </g>
      <StageFloor y={ground} fill="#11162B" subFill="#090C19" rim="#7CE8FF" W={W} rimOpacity={0.62} />
      <FullLightVeil id={`${id}v`} lights={[[sx + 100, sy, 480], [W * 0.55, ground - 100, 440]]} o={0.32} />
      <SceneDust t={t} seed={241} W={W} H={H} n={32} o={0.45} />
    </g>
  );
};

/** 4. frames: Five sequential telescope image frames revealing a moving streak / fuzzy dot. */
export const FramesSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const streak = num(sp.streak, 0);
  const fuzz = num(sp.fuzz, 0);
  const vert = H > W;
  const revealed = clamp(st + easeOut(p) * 0.2) * 5;
  const boxSize = vert ? 185 : 210;

  const coords: [number, number][] = vert
    ? [
        [0.24 * W, 0.37 * H],
        [0.5 * W, 0.37 * H],
        [0.76 * W, 0.37 * H],
        [0.37 * W, 0.51 * H],
        [0.63 * W, 0.51 * H],
      ]
    : [0.16, 0.33, 0.5, 0.67, 0.84].map((fx) => [fx * W, 0.45 * H]);

  const pathDots = coords.map(([cx, cy], i) => {
    const ox = lerp(-boxSize * 0.28, boxSize * 0.28, i / 4);
    const oy = lerp(-boxSize * 0.16, boxSize * 0.18, i / 4);
    return [cx + ox, cy + oy] as [number, number];
  });

  if (layer === 'far') {
    return (
      <g>
        <DeepSpaceBase id={id} t={t} seed={181} starCount={65} bg="#0A0D22" rayColor="#7CE8FF" rayOpacity={0.1} W={W} H={H} />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#060713" />;
  }
  return (
    <g>
      {/* Back display wall panel */}
      <rect
        x={vert ? W * 0.08 : W * 0.06}
        y={vert ? H * 0.27 : H * 0.27}
        width={vert ? W * 0.84 : W * 0.88}
        height={vert ? H * 0.34 : H * 0.38}
        rx={18}
        fill="#12162E"
        stroke={DARK_INK}
        strokeWidth={4}
      />

      {/* Five frames in sequence */}
      {coords.map(([cx, cy], i) => {
        const rev = clamp((revealed - i) * 1.4);
        const pop = rev > 0 ? backOut(rev) : 0;
        const active = Math.floor((t / 22) % 5) === i && rev > 0.5;
        const [px, py] = pathDots[i];
        const dx = px - cx;
        const dy = py - cy;
        return (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            {/* Dim placeholder when unrevealed */}
            <rect
              x={-boxSize / 2}
              y={-boxSize / 2}
              width={boxSize}
              height={boxSize}
              rx={8}
              fill="#0B0E1D"
              stroke="#2C3558"
              strokeWidth={3}
              strokeDasharray="10 8"
              opacity={0.65}
            />
            {rev > 0.02 && (
              <g transform={`scale(${pop})`}>
                <rect
                  x={-boxSize / 2}
                  y={-boxSize / 2}
                  width={boxSize}
                  height={boxSize}
                  rx={8}
                  fill="#060711"
                  stroke={active ? PALETTE.cyan : PALETTE.cream}
                  strokeWidth={4}
                />
                <Stars seed={300 + i * 19} x0={-boxSize / 2 + 10} y0={-boxSize / 2 + 10} w={boxSize - 20} h={boxSize - 20} t={t} n={16} o={0.75} />
                <text
                  x={-boxSize / 2 + 12}
                  y={boxSize / 2 - 12}
                  fontFamily={FONTS.ui}
                  fontSize={16}
                  fill={PALETTE.cream}
                  opacity={0.7}
                >
                  {`SET ${i + 1}`}
                </text>
                {streak > 0.05 && fuzz < 0.5 && (
                  <g transform={`translate(${dx} ${dy}) rotate(-26)`}>
                    <line
                      x1={-16 * streak}
                      y1={0}
                      x2={16 * streak}
                      y2={0}
                      stroke="#5CE1E6"
                      strokeWidth={7}
                      strokeLinecap="round"
                      opacity={0.55 * streak}
                    />
                    <line
                      x1={-12 * streak}
                      y1={0}
                      x2={12 * streak}
                      y2={0}
                      stroke="#F6EFE3"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                    />
                  </g>
                )}
                {fuzz >= 0.5 && (
                  <g transform={`translate(${dx} ${dy})`}>
                    <Glow x={0} y={0} r={34} kind="cool" o={0.85} />
                    <circle cx={0} cy={0} r={14 + 2 * Math.sin(t / 8 + i)} fill="#6EE7FF" opacity={0.35} />
                    <circle cx={0} cy={0} r={5} fill="#F6EFE3" />
                  </g>
                )}
              </g>
            )}
          </g>
        );
      })}

      {/* Shifting dotted cream path connecting streaks */}
      {streak > 0.1 && (
        <polyline
          points={pathDots.slice(0, Math.max(2, Math.min(5, Math.ceil(revealed)))).map(([x, y]) => `${x},${y}`).join(' ')}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={3}
          strokeDasharray="8 10"
          strokeDashoffset={-t * 0.8}
          opacity={0.7 * streak}
        />
      )}

      <StageFloor y={ground} fill="#141830" subFill="#0A0D1E" rim="#9CC4E8" W={W} rimOpacity={0.65} />
      <FullLightVeil id={`${id}v`} lights={[[W * 0.5, H * 0.45, 760]]} o={0.28} />
      <SceneDust t={t} seed={257} W={W} H={H} n={28} o={0.42} />
    </g>
  );
};

/** 5. zoomframe: Giant deep-field plate with thousands of stars & boxed zoomed-in streak/fuzz/ring. */
export const ZoomFrameSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = num(sp.t, 0.5);
  const streak = num(sp.streak, 0);
  const fuzz = num(sp.fuzz, 0);
  const ring = num(sp.ring, 0);
  const vert = H > W;
  const bx = W * 0.5;
  const by = H * 0.45;
  const zoomBoxScale = lerp(0.55, 1, easeOut(clamp(st + p * 0.25)));
  const boxHalf = vert ? 130 : 145;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1600} width={4800} height={4400} fill="#060712" />
        <Stars seed={263} x0={-600} y0={-600} w={W + 1200} h={H + 1200} t={t} n={165} o={0.92} />
        <TinyGalaxies seed={269} W={W} H={H} n={26} o={0.44} />
        <Rays x={bx} y={by} t={t} len={1800} n={10} o={0.07} color="#7CE8FF" />
      </g>
    );
  }
  if (layer === 'near') {
    return (
      <Foreground blur={8}>
        <path d={`M 30 30 L 140 30 M 30 30 L 30 140 M ${W - 30} ${H - 30} L ${W - 140} ${H - 30} M ${W - 30} ${H - 30} L ${W - 30} ${H - 140}`} stroke="#1E2B48" strokeWidth={12} fill="none" />
      </Foreground>
    );
  }
  return (
    <g>
      {/* Sensor coordinate grid */}
      <g stroke="#223052" strokeWidth={1.5} opacity={0.42}>
        {[0.25, 0.5, 0.75].map((fx, i) => (
          <line key={`vx${i}`} x1={fx * W} y1={0} x2={fx * W} y2={ground} />
        ))}
        {[0.25, 0.5].map((fy, i) => (
          <line key={`hy${i}`} x1={0} y1={fy * H} x2={W} y2={fy * H} />
        ))}
      </g>
      {/* Dense crisp star specks */}
      <Stars seed={277} x0={40} y0={40} w={W - 80} h={ground - 80} t={t} n={180} o={0.88} />

      {/* Target miniature region & leader lines into zoom inset */}
      <rect
        x={bx - 210}
        y={by + 75}
        width={42}
        height={42}
        fill="none"
        stroke={PALETTE.cyan}
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.75}
      />
      <line x1={bx - 168} y1={by + 75} x2={bx - boxHalf * zoomBoxScale} y2={by - boxHalf * zoomBoxScale} stroke={PALETTE.cyan} strokeWidth={1.8} opacity={0.45} />
      <line x1={bx - 168} y1={by + 117} x2={bx - boxHalf * zoomBoxScale} y2={by + boxHalf * zoomBoxScale} stroke={PALETTE.cyan} strokeWidth={1.8} opacity={0.45} />

      {/* Zoomed inset inspection box */}
      <g transform={`translate(${bx} ${by}) scale(${zoomBoxScale})`}>
        <Glow x={0} y={0} r={boxHalf * 1.6} kind="cool" o={0.25} />
        <rect
          x={-boxHalf}
          y={-boxHalf}
          width={boxHalf * 2}
          height={boxHalf * 2}
          rx={10}
          fill="#050711"
          stroke={PALETTE.cream}
          strokeWidth={4}
        />
        <Stars seed={283} x0={-boxHalf + 14} y0={-boxHalf + 14} w={boxHalf * 2 - 28} h={boxHalf * 2 - 28} t={t} n={28} o={0.85} />

        {/* Smeared streak */}
        {streak > 0.05 && fuzz < 0.5 && (
          <g transform="rotate(-24)">
            <Glow x={0} y={0} r={85 * streak} kind="cool" o={0.65} />
            <line
              x1={-56 * streak}
              y1={0}
              x2={56 * streak}
              y2={0}
              stroke="#4CE0FF"
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.5}
            />
            <line
              x1={-46 * streak}
              y1={0}
              x2={46 * streak}
              y2={0}
              stroke="#F6EFE3"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Fuzzy coma dot */}
        {fuzz >= 0.5 && (
          <g>
            <Glow x={0} y={0} r={115} kind="cool" o={0.85} />
            {streak > 0.5 && (
              <line x1={-36} y1={16} x2={0} y2={0} stroke="#4CE0FF" strokeWidth={8} strokeLinecap="round" opacity={0.32} />
            )}
            <circle cx={0} cy={0} r={42 + 4 * Math.sin(t / 10)} fill="#5EEAD4" opacity={0.24} />
            <circle cx={0} cy={0} r={24 + 2 * Math.sin(t / 10)} fill="#A5F3FC" opacity={0.45} />
            <circle cx={0} cy={0} r={8.5} fill="#FFFDF5" stroke={DARK_INK} strokeWidth={2.5} />
          </g>
        )}

        {/* Cream highlight circle + crosshair */}
        {ring > 0.5 && (
          <g transform={`rotate(${t * 0.45})`}>
            <circle cx={0} cy={0} r={74} fill="none" stroke={PALETTE.cream} strokeWidth={4} strokeDasharray="34 14" />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} transform={`rotate(${a})`} x1={80} y1={0} x2={94} y2={0} stroke={PALETTE.cream} strokeWidth={3.5} />
            ))}
          </g>
        )}
      </g>

      <StageFloor y={ground} fill="#0F1326" subFill="#080A17" rim="#9CC4E8" W={W} rimOpacity={0.58} />
      <FullLightVeil id={`${id}v`} lights={[[bx, by, 420], [W * 0.5, ground - 100, 440]]} o={0.3} />
      <SceneDust t={t} seed={293} W={W} H={H} n={26} o={0.4} />
    </g>
  );
};

/** 6. ops: Quiet office with glowing wall monitors, desk with laptop & steaming coffee mug. */
export const OpsSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const alert = num(sp.alert, 0);
  const ok = num(sp.ok, 0) >= 0.5;
  const vert = H > W;
  const isAlert = !ok && alert > 0.05;
  const flash = isAlert ? 0.55 + 0.45 * Math.sin(t * 0.35) : 0;
  const screenCol = ok ? '#34D399' : isAlert ? '#FF9F43' : '#5EEAD4';

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1600} width={4800} height={4400} fill="#141226" />
        <WallTexture rect={[-1400, -1600, 4800, 4400]} />
        <RoomCorners x0={0} x1={W} y0={0} y1={ground} />
        <Rays x={W * 0.25} y={H * 0.25} t={t} len={1700} n={9} o={0.08} color={ok ? '#86EFAC' : isAlert ? '#FFB870' : '#99E6FF'} />
      </g>
    );
  }
  if (layer === 'near') {
    return <NearEdgeBlurs W={W} H={H} ground={ground} color="#090814" />;
  }

  const wallY = vert ? H * 0.34 : H * 0.24;
  const monW = vert ? 245 : 320;
  const monH = vert ? 150 : 185;
  const monXs = vert ? [0.22 * W, 0.52 * W, 0.8 * W] : [0.23 * W, 0.5 * W, 0.77 * W];
  const deskY = ground - 115;

  return (
    <g>
      {/* Wall of dark monitors with soft cream charts */}
      {monXs.map((mx, i) => (
        <g key={i} transform={`translate(${mx} ${wallY})`}>
          <rect x={-monW / 2} y={0} width={monW} height={monH} rx={10} fill="#1E1B30" stroke={DARK_INK} strokeWidth={4} />
          <rect x={-monW / 2 + 12} y={12} width={monW - 24} height={monH - 24} rx={5} fill="#0F1121" />
          {/* Chart trace */}
          <path
            d={`M ${-monW / 2 + 24} ${monH * 0.65} Q ${-monW * 0.12} ${monH * (0.3 + 0.1 * Math.sin(t / 16 + i))} ${monW * 0.15} ${monH * 0.55} T ${monW / 2 - 24} ${monH * 0.42}`}
            fill="none"
            stroke={i === 1 ? screenCol : PALETTE.cream}
            strokeWidth={3}
            opacity={0.78}
          />
          {[0, 1, 2, 3].map((b) => (
            <rect
              key={b}
              x={-monW / 2 + 26 + b * 24}
              y={monH - 36 - rnd(311 + i, b) * 24}
              width={14}
              height={22}
              rx={2}
              fill={screenCol}
              opacity={0.45}
            />
          ))}
          <circle
            cx={monW / 2 - 22}
            cy={24}
            r={4.5}
            fill={isAlert ? '#FF5A4A' : ok ? '#34D399' : '#4CE0FF'}
            opacity={isAlert ? flash : 0.85}
          />
        </g>
      ))}

      {/* Desk spanning quietly behind Pip */}
      <rect x={W * 0.12} y={deskY} width={W * 0.76} height={24} rx={6} fill="#312945" stroke={DARK_INK} strokeWidth={4} />
      <rect x={W * 0.16} y={deskY + 24} width={22} height={115} fill="#231D34" stroke={DARK_INK} strokeWidth={4} />
      <rect x={W * 0.82 - 22} y={deskY + 24} width={22} height={115} fill="#231D34" stroke={DARK_INK} strokeWidth={4} />

      {/* Glowing Laptop on left of desk */}
      <g transform={`translate(${W * 0.27} ${deskY})`}>
        <Glow x={0} y={-60} r={190} kind={isAlert ? 'red' : 'cool'} o={0.45 + flash * 0.35} />
        <rect x={-72} y={-92} width={144} height={90} rx={8} fill="#262338" stroke={DARK_INK} strokeWidth={4} />
        <rect
          x={-62}
          y={-82}
          width={124}
          height={70}
          rx={4}
          fill={ok ? '#134E3A' : isAlert ? '#4D2216' : '#14243B'}
        />
        {isAlert && (
          <g opacity={0.45 + 0.55 * flash}>
            <polygon points="0,-68 -24,-24 24,-24" fill="#FFB020" stroke={DARK_INK} strokeWidth={3} />
            <text y={-31} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={26} fill={PALETTE.pill}>
              !
            </text>
          </g>
        )}
        {ok && (
          <path d="M -18 -46 L -4 -32 L 22 -62" fill="none" stroke="#34D399" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {!isAlert && !ok && (
          <g stroke="#7CE8FF" strokeWidth={2.5} opacity={0.75}>
            <line x1={-46} y1={-62} x2={34} y2={-62} />
            <line x1={-46} y1={-46} x2={12} y2={-46} />
            <line x1={-46} y1={-30} x2={42} y2={-30} />
          </g>
        )}
        <polygon points="-84,0 84,0 96,12 -96,12" fill="#413D58" stroke={DARK_INK} strokeWidth={4} strokeLinejoin="round" />
      </g>

      {/* Coffee mug with curling steam on right of desk */}
      <g transform={`translate(${W * 0.74} ${deskY})`}>
        <rect x={-22} y={-44} width={44} height={44} rx={6} fill={PALETTE.cream} stroke={DARK_INK} strokeWidth={4} />
        <path d="M 22 -34 C 36 -34, 36 -12, 22 -12" fill="none" stroke={DARK_INK} strokeWidth={4} />
        {[0, 1].map((s) => (
          <path
            key={s}
            d={`M ${-8 + s * 14} -50 Q ${-14 + s * 16 + Math.sin(t / 10 + s) * 6} -72 ${-4 + s * 14} -94`}
            fill="none"
            stroke={PALETTE.cream}
            strokeWidth={2.5}
            opacity={0.45}
            strokeLinecap="round"
          />
        ))}
      </g>

      <StageFloor y={ground} fill="#25203A" subFill="#151224" rim="#B4A9D6" W={W} rimOpacity={0.62} />
      <FullLightVeil id={`${id}v`} lights={[[W * 0.27, deskY - 60, 420], [W * 0.5, wallY + 90, 560]]} o={0.34} />
      <SceneDust t={t} seed={317} W={W} H={H} n={30} o={0.42} />
    </g>
  );
};
