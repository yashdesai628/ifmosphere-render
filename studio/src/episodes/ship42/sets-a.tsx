import React from 'react';
import { PALETTE, GroundPlane, BrandChip } from '../../brand';
import { clamp, lerp, easeInOut } from '../../engine/anim';
import { Glow, LightVeil, Dust, Cone, RoomCorners } from '../../engine/light';
import { Stars, Rays, Foreground } from '../../engine/kit';
import type { SetProps } from './render';
import {
  OUTLINE,
  SW,
  SkyBackdrop,
  FlamePlume,
  StarshipVehicle,
  BoosterVehicle,
  LaunchTower,
} from './sets-shared';

// ---------------------------------------------------------------------------
// 1. tower — Starbase launch tower & Mechazilla chopsticks at dusk / night
// ---------------------------------------------------------------------------
export const TowerSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const claws = Number(sp.arms ?? 0);
  const ship = Number(sp.ship ?? 0);
  const fire = Number(sp.fire ?? 0);
  const night = String(sp.tint ?? 'dusk') === 'night';
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  const towerX = (vert ? 0.32 : 0.39) * W;
  const cradleX = (vert ? 0.54 : 0.51) * W;
  const towerH = (vert ? 0.48 : 0.64) * H;

  if (layer === 'far') {
    const stops: [number, string][] = night
      ? [[0, '#060715'], [0.62, '#101B3C'], [1, '#1F2F5B']]
      : [[0, '#100C24'], [0.55, '#3B214A'], [0.88, '#A94F42'], [1, '#E08252']];
    return (
      <g>
        <SkyBackdrop id={`${id}sky`} W={W} H={H} yTop={-400} yBot={ground + 60} stops={stops} />
        <Stars seed={42} x0={-900} y0={-900} w={W + 1800} h={ground + 900} t={t} n={night ? 125 : 65} o={night ? 0.9 : 0.6} />
        <Glow x={W * 0.22} y={ground - 60} r={vert ? 320 : 420} kind={night ? 'cool' : 'warm'} o={night ? 0.28 : 0.52} />
        <Rays x={W * 0.22} y={ground - 60} t={t} color={night ? '#B8D4FF' : '#FFE0B0'} o={night ? 0.08 : 0.13} />
        {/* Distant Texas barrier dunes & Gulf horizon ridge */}
        <path
          d={`M -1200 ${ground} Q ${W * 0.18} ${ground - 46} ${W * 0.44} ${ground - 12} T ${W * 0.85} ${ground - 34} L ${W + 1200} ${ground} Z`}
          fill={night ? '#0C1228' : '#261730'}
        />
      </g>
    );
  }

  if (layer === 'mid') {
    const shipScale = sc * (vert ? 0.82 : 0.9);
    const stackedMode = ship <= 0.25;
    const catchMode = ship > 0.25 && ship < 0.85;
    const stackLift = ship * H * 1.4;
    const boosterBaseY = ground - 58 - stackLift;
    const boosterY = boosterBaseY - 148 * shipScale;
    const shipStackedY = boosterY - (148 + 115) * shipScale;
    const catchY = ground - towerH * 0.68 + Math.sin(t / 14) * (1 - claws) * 3;
    const exhaustSmoke = fire > 0.05 && stackedMode;

    return (
      <g>
        {/* Distant propellant tank farm silhouettes */}
        {[0.08, 0.12, 0.86, 0.90].map((fx, i) => {
          const tx = fx * W;
          const th = (95 + (i % 2) * 38) * sc;
          return (
            <g key={i} transform={`translate(${tx} ${ground})`}>
              <rect x={-22 * sc} y={-th} width={44 * sc} height={th} rx={18 * sc} fill="#18192C" stroke={OUTLINE} strokeWidth={3.5} />
              <line x1={-16 * sc} y1={-th + 16 * sc} x2={-16 * sc} y2={-8} stroke="#6A789D" strokeWidth={2} opacity={0.45} />
            </g>
          );
        })}

        {/* Dark concrete launch complex ground */}
        <GroundPlane y={ground} fill={night ? '#161829' : '#211F33'} rim={night ? '#7B94C4' : '#D9A489'} />
        {/* Pad markings */}
        <g opacity={0.45} stroke="#9FB0D8" strokeWidth={3} strokeDasharray="18 14">
          <line x1={-200} y1={ground + 28} x2={W + 200} y2={ground + 28} />
        </g>

        {/* Pad floodlights left & right */}
        {[0.17, 0.78].map((px, i) => (
          <g key={i} transform={`translate(${px * W} ${ground})`}>
            <line x1={0} y1={0} x2={0} y2={-220 * sc} stroke="#232538" strokeWidth={8 * sc} />
            <rect x={-16 * sc} y={-232 * sc} width={32 * sc} height={18 * sc} rx={4} fill="#2D314B" stroke={OUTLINE} strokeWidth={3} />
            <circle cx={0} cy={-223 * sc} r={6 * sc} fill="#FFE9BD" />
            <Glow x={0} y={-223 * sc} r={140 * sc} kind="warm" o={0.55} />
            <Cone
              d={
                i === 0
                  ? `M ${-10 * sc} ${-216 * sc} L ${14 * sc} ${-216 * sc} L ${260 * sc} 0 L ${40 * sc} 0 Z`
                  : `M ${-14 * sc} ${-216 * sc} L ${10 * sc} ${-216 * sc} L ${-40 * sc} 0 L ${-260 * sc} 0 Z`
              }
              o={0.16}
            />
          </g>
        ))}

        {/* Launch tower + chopsticks */}
        <LaunchTower
          x={towerX}
          cradleX={cradleX}
          ground={ground}
          height={towerH}
          clawsOpen={claws}
          t={t}
          showOlm
        />

        {/* Stacked Starship + Booster 22 on pad / lifting off */}
        {stackedMode ? (
          <g>
            <BoosterVehicle x={cradleX} y={boosterY} t={t} scale={shipScale} flame={fire} />
            <StarshipVehicle x={cradleX} y={shipStackedY} t={t} scale={shipScale} />
          </g>
        ) : null}

        {/* Ship 42 hovering/caught between chopstick claws */}
        {catchMode ? (
          <StarshipVehicle
            x={cradleX}
            y={catchY}
            t={t}
            scale={shipScale}
            flame={fire}
          />
        ) : null}

        {/* Pad exhaust steam / smoke plumes when engines fire */}
        {exhaustSmoke ? (
          <g opacity={clamp(fire)}>
            <Glow x={cradleX} y={ground - 12} r={220 * sc * fire} kind="warm" o={0.65} />
            {[-2.2, -1.3, -0.5, 0.5, 1.3, 2.2].map((dir, i) => {
              const drift = ((t * 2.4 + i * 35) % 160) * Math.sign(dir);
              const rx = (54 + i * 12) * sc * (0.6 + 0.5 * fire);
              return (
                <ellipse
                  key={i}
                  cx={cradleX + dir * 75 * sc + drift}
                  cy={ground - 10 + Math.sin(t / 7 + i) * 6}
                  rx={rx}
                  ry={22 * sc * fire}
                  fill="#FFE3BE"
                  opacity={0.42 * fire}
                />
              );
            })}
          </g>
        ) : null}

        <LightVeil
          id={`${id}veil`}
          lights={[
            [cradleX, stackedMode ? boosterBaseY - 80 : catchY, 440 * sc],
            [towerX, ground - towerH * 0.55, 380 * sc],
          ]}
          o={night ? 0.36 : 0.24}
        />
        <Dust t={t} seed={211} x0={40} y0={ground - 540 * sc} w={W - 80} h={520 * sc} n={34} o={0.48} />
      </g>
    );
  }

  // layer === 'near' — edge concrete blast barriers & subtle corner gantry framing
  return (
    <g>
      <Foreground blur={4}>
        <polygon
          points={`-300,${H + 200} -300,${ground - 20} ${W * 0.06},${ground + 18} ${W * 0.09},${H + 200}`}
          fill="#090814"
        />
        <polygon
          points={`${W + 300},${H + 200} ${W + 300},${ground - 20} ${W * 0.94},${ground + 18} ${W * 0.91},${H + 200}`}
          fill="#090814"
        />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 2. hover — Ship returning tail-first into the open chopstick claws
// ---------------------------------------------------------------------------
export const HoverSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const prog = Number(sp.t ?? 0.5);
  const claws = Number(sp.arms ?? 0.3);
  const dust = Number(sp.dust ?? 0.5);
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  const towerX = (vert ? 0.22 : 0.30) * W;
  const cradleX = (vert ? 0.48 : 0.42) * W;
  const towerH = (vert ? 0.55 : 0.72) * H;

  if (layer === 'far') {
    return (
      <g>
        <SkyBackdrop
          id={`${id}sky`}
          W={W}
          H={H}
          yTop={-400}
          yBot={ground + 60}
          stops={[[0, '#130D28'], [0.54, '#4B2449'], [0.85, '#B65544'], [1, '#E38454']]}
        />
        <Stars seed={83} x0={-900} y0={-900} w={W + 1800} h={ground + 700} t={t} n={55} o={0.55} />
        <Glow x={W * 0.16} y={ground - 90} r={360 * sc} kind="warm" o={0.48} />
        <Rays x={W * 0.16} y={ground - 90} t={t} color="#FFD8A8" o={0.14} />
        <path
          d={`M -1200 ${ground} Q ${W * 0.35} ${ground - 38} ${W * 0.72} ${ground - 16} L ${W + 1200} ${ground} Z`}
          fill="#26152D"
        />
      </g>
    );
  }

  if (layer === 'mid') {
    const catchY = ground - towerH * 0.68;
    const highY = ground - towerH * 1.12;
    const shipY = lerp(highY, catchY, easeInOut(clamp(prog))) + (1 - claws) * Math.sin(t / 11) * 3.5;
    const tiltAngle = (1 - clamp(prog / 0.42)) * 22;
    const flamePower =
      prog >= 0.98
        ? 0
        : lerp(0.55, 0.95, clamp(prog / 0.5)) * (1 - clamp((prog - 0.94) / 0.06));
    const shipScale = sc * (vert ? 0.96 : 1.05);

    return (
      <g>
        <GroundPlane y={ground} fill="#232035" rim="#E8B892" />

        {/* Close-in tower & articulated chopsticks */}
        <LaunchTower
          x={towerX}
          cradleX={cradleX}
          ground={ground}
          height={towerH}
          clawsOpen={claws}
          t={t}
          showOlm={false}
        />

        {/* Returning Starship descending tail-first */}
        <StarshipVehicle
          x={cradleX}
          y={shipY}
          t={t}
          scale={shipScale}
          angle={tiltAngle}
          flame={flamePower}
        />

        {/* Residual venting vapor puffs once engines shut off at catch */}
        {prog >= 0.96 ? (
          <g opacity={0.45}>
            {[-1, 1].map((side, i) => {
              const drift = ((t * 1.8 + i * 24) % 90) * side;
              return (
                <ellipse
                  key={i}
                  cx={cradleX + drift}
                  cy={shipY + 132 * shipScale + Math.sin(t / 8 + i) * 5}
                  rx={(28 + i * 8) * sc}
                  ry={12 * sc}
                  fill="#DCE6F5"
                  opacity={0.35}
                />
              );
            })}
          </g>
        ) : null}

        {/* Swirling dust clouds rolling outward across the pad */}
        {dust > 0.04 ? (
          <g opacity={clamp(dust)}>
            {Array.from({ length: 10 }).map((_, i) => {
              const side = i % 2 === 0 ? -1 : 1;
              const lane = Math.floor(i / 2);
              const travel = ((t * (2.6 + lane * 0.4) + lane * 95) % (W * 0.58)) * side;
              const dx = cradleX + travel;
              const dy = ground - (8 + lane * 12) * sc + Math.sin(t / 9 + i) * 5;
              const rx = (70 + lane * 28) * sc * (0.65 + 0.5 * dust);
              const ry = (18 + lane * 7) * sc * (0.65 + 0.45 * dust);
              return (
                <ellipse
                  key={i}
                  cx={dx}
                  cy={dy}
                  rx={rx}
                  ry={ry}
                  fill={i % 3 === 0 ? '#E8B388' : '#9B6F5E'}
                  opacity={0.32 * dust}
                />
              );
            })}
          </g>
        ) : null}

        <LightVeil
          id={`${id}veil`}
          lights={[
            [cradleX, shipY + 60, 460 * sc],
            [towerX, ground - towerH * 0.65, 340 * sc],
          ]}
          o={0.26}
        />
        <Dust t={t} seed={307} x0={40} y0={ground - 520 * sc} w={W - 80} h={520 * sc} n={38 + Math.round(dust * 24)} o={0.52} />
      </g>
    );
  }

  // layer === 'near' — steel guardrail / floodlight silhouette at frame edges
  return (
    <g>
      <Foreground blur={4}>
        <rect x={-260} y={ground - 60 * sc} width={260 + W * 0.055} height={H - ground + 300} fill="#090814" />
        <rect x={W * 0.945} y={ground - 60 * sc} width={260 + W * 0.055} height={H - ground + 300} fill="#090814" />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 3. ascent — Side view of Starship stack climbing from sky to black space
// ---------------------------------------------------------------------------
export const AscentSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const alt = clamp(Number(sp.t ?? 0.3));
  const stage = Number(sp.stage ?? 0) >= 0.5;
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  if (layer === 'far') {
    const lowMode = alt < 0.35;
    const midMode = alt >= 0.35 && alt < 0.65;
    const stops: [number, string][] = lowMode
      ? [[0, '#123A78'], [0.55, '#2969AD'], [1, '#6BAAD9']]
      : midMode
        ? [[0, '#091234'], [0.55, '#173169'], [1, '#34639C']]
        : [[0, '#050610'], [0.6, '#0A122E'], [1, '#1A3A70']];
    const starVis = clamp((alt - 0.18) / 0.42);
    return (
      <g>
        <SkyBackdrop id={`${id}sky`} W={W} H={H} yTop={-400} yBot={ground + 80} stops={stops} />
        {starVis > 0.02 ? (
          <Stars seed={519} x0={-900} y0={-900} w={W + 1800} h={ground + 900} t={t} n={115} o={0.9 * starVis} />
        ) : null}
        <Glow x={W * 0.18} y={H * 0.22} r={300 * sc} kind="warm" o={0.38} />
        <Rays x={W * 0.18} y={H * 0.22} t={t} color="#FFE4BD" o={0.1} />
        {/* Tiny Gulf coastline sliver visible at low altitude */}
        {alt < 0.45 ? (
          <path
            d={`M -1200 ${ground} Q ${W * 0.25} ${ground - 32 * (1 - alt)} ${W * 0.55} ${ground - 12} T ${W + 1200} ${ground} Z`}
            fill="#1D4D68"
            opacity={1 - alt * 1.8}
          />
        ) : null}
      </g>
    );
  }

  if (layer === 'mid') {
    const rx = (vert ? 0.50 : 0.48) * W;
    const ry = (vert ? 0.46 : 0.45) * H;
    const rocketSc = sc * (vert ? 0.88 : 0.94);
    const pitch = lerp(6, 26, alt);
    const driftY = Math.sin(t / 12) * 3;

    return (
      <g>
        {/* Horizon cloud-deck / curved atmosphere floor at ground */}
        <GroundPlane
          y={ground}
          fill={alt < 0.45 ? '#1B3A5C' : '#0B1633'}
          rim={alt < 0.45 ? '#9ED6FA' : '#4DD2FF'}
        />
        {/* Sunlit clouds along the horizon when inside atmosphere */}
        {alt < 0.65 ? (
          <g opacity={0.55 * (1 - alt)}>
            {[-0.3, -0.08, 0.16, 0.42, 0.72, 0.96].map((cx, i) => (
              <ellipse
                key={i}
                cx={cx * W + ((t * 0.9 + i * 40) % 120)}
                cy={ground - 6 + (i % 2) * 10}
                rx={(140 + (i % 3) * 40) * sc}
                ry={24 * sc}
                fill="#D4EBFB"
                opacity={0.42}
              />
            ))}
          </g>
        ) : null}

        {!stage ? (
          /* Stacked ascent with sweeping contrail */
          <g transform={`translate(${rx} ${ry + driftY}) rotate(${pitch})`}>
            {/* Long luminous exhaust trail */}
            <path
              d={`M -18 ${255 * rocketSc} Q -34 ${460 * rocketSc} -64 ${760 * rocketSc} L 54 ${760 * rocketSc} Q 24 ${460 * rocketSc} 18 ${255 * rocketSc} Z`}
              fill="#FBE4C8"
              opacity={0.28}
            />
            <BoosterVehicle x={0} y={115 * rocketSc} t={t} scale={rocketSc} flame={1.0} />
            <StarshipVehicle x={0} y={-148 * rocketSc} t={t} scale={rocketSc} />
          </g>
        ) : (
          /* Hot-stage separation: Ship climbs upper-right, Booster tumbles lower-left */
          <g>
            {/* Hot-staging ring glow & spark puffs */}
            <Glow x={rx - 12 * sc} y={ry + 18 * sc} r={160 * sc} kind="warm" o={0.55} />
            <StarshipVehicle
              x={rx + 42 * sc}
              y={ry - 95 * sc + driftY}
              t={t}
              scale={rocketSc}
              angle={24}
              flame={0.85}
              coolCore
            />
            <BoosterVehicle
              x={rx - 74 * sc}
              y={ry + 115 * sc - driftY * 0.6}
              t={t}
              scale={rocketSc * 0.92}
              angle={-26 - Math.sin(t / 18) * 5}
              flame={0.4}
              sputter={alt >= 0.72}
            />
          </g>
        )}

        <LightVeil
          id={`${id}veil`}
          lights={[[rx, ry, 520 * sc]]}
          o={alt > 0.5 ? 0.3 : 0.16}
        />
        <Dust t={t} seed={601} x0={40} y0={80} w={W - 80} h={ground - 100} n={32} o={0.45} />
      </g>
    );
  }

  // layer === 'near' — blurred fast-moving cloud/star wisps at extreme edges
  return (
    <g>
      <Foreground blur={6}>
        <ellipse cx={W * 0.03} cy={H * 0.28} rx={120 * sc} ry={40 * sc} fill={alt < 0.5 ? '#B8DDF6' : '#19294F'} opacity={0.22} />
        <ellipse cx={W * 0.97} cy={H * 0.62} rx={140 * sc} ry={46 * sc} fill={alt < 0.5 ? '#B8DDF6' : '#19294F'} opacity={0.22} />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 4. booster — Super Heavy returning over the Gulf, aborting & splashing
// ---------------------------------------------------------------------------
export const BoosterSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const prog = clamp(Number(sp.t ?? 0.3));
  const abort = clamp(Number(sp.abort ?? 0));
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  const splashDown = prog >= 0.88 && abort >= 0.85;
  const bx = lerp(0.36 * W, 0.54 * W, easeInOut(abort));
  const by = lerp(0.24 * H, ground - 70 * sc, clamp(prog / 0.92));

  if (layer === 'far') {
    return (
      <g>
        <SkyBackdrop
          id={`${id}sky`}
          W={W}
          H={H}
          yTop={-400}
          yBot={ground + 80}
          stops={[[0, '#080B1C'], [0.58, '#142347'], [1, '#294570']]}
        />
        <Stars seed={709} x0={-900} y0={-900} w={W + 1800} h={ground + 800} t={t} n={85} o={0.78} />
        {abort > 0.15 ? (
          <Glow
            x={bx}
            y={by}
            r={420 * sc}
            kind="red"
            o={0.35 * abort * (0.6 + 0.4 * Math.sin(t * 0.65))}
          />
        ) : null}
        {/* Distant coastal strip on left */}
        <path d={`M -1200 ${ground} L ${W * 0.16} ${ground - 22} L ${W * 0.24} ${ground} Z`} fill="#111C33" />
      </g>
    );
  }

  if (layer === 'mid') {
    const waveOffset = (t * 1.4) % 160;
    const boosterAngle = lerp(4, 24, abort) + Math.sin(t / 12) * 2;
    const alertOn = abort >= 0.2 && Math.sin(t * 0.6) > -0.2;

    return (
      <g>
        {/* Dark Gulf of Mexico surface */}
        <GroundPlane y={ground} fill="#0D223D" rim="#74B0DE" />
        {/* Animated water shimmer stripes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const wy = ground + 24 + i * 18 * sc;
          const wx = ((i * 210 + waveOffset * (i % 2 === 0 ? 1 : -1)) % (W + 300)) - 150;
          return (
            <line
              key={i}
              x1={wx}
              y1={wy}
              x2={wx + (65 + (i % 3) * 35) * sc}
              y2={wy}
              stroke="#538AC0"
              strokeWidth={2.5}
              opacity={0.32}
              strokeLinecap="round"
            />
          );
        })}

        {/* Red off-target abort arc */}
        {abort >= 0.2 && !splashDown ? (
          <g>
            <path
              d={`M ${W * 0.34} ${H * 0.2} Q ${bx} ${by + 30} ${0.56 * W} ${ground}`}
              fill="none"
              stroke={PALETTE.red}
              strokeWidth={3.5}
              strokeDasharray="14 12"
              opacity={0.65 * abort}
            />
            {alertOn ? (
              <g>
                <Glow x={bx} y={by - 120 * sc} r={140 * sc} kind="red" o={0.5} />
                <BrandChip x={bx + 120 * sc} y={by - 105 * sc} t={t} text="ABORT" color={PALETTE.red} />
              </g>
            ) : null}
          </g>
        ) : null}

        {/* Descending / swerving Super Heavy Booster */}
        {!splashDown ? (
          <BoosterVehicle
            x={bx}
            y={by}
            t={t}
            scale={sc * (vert ? 0.78 : 0.88)}
            angle={boosterAngle}
            flame={0.75 * (1 - 0.3 * abort)}
            sputter={abort > 0.3}
          />
        ) : (
          /* Splashdown ocean geyser & expanding orange fireball */
          <g transform={`translate(${bx} ${ground})`}>
            <Glow x={0} y={-80 * sc} r={360 * sc} kind="warm" o={0.8} />
            {/* Ocean ripple rings */}
            {[0, 1, 2].map((i) => {
              const r = (95 + i * 75 + Math.sin(t / 9 + i) * 14) * sc;
              return (
                <ellipse
                  key={i}
                  cx={0}
                  cy={8}
                  rx={r}
                  ry={14 * sc}
                  fill="none"
                  stroke="#A8DCFF"
                  strokeWidth={3.5}
                  opacity={0.65 - i * 0.18}
                />
              );
            })}
            {/* Water splash plumes */}
            <path
              d={`M ${-110 * sc} 4 Q ${-85 * sc} ${-110 * sc} ${-52 * sc} ${-155 * sc} Q ${-25 * sc} ${-50 * sc} 0 4 Z`}
              fill="#CFE8FA"
              stroke={OUTLINE}
              strokeWidth={3.5}
            />
            <path
              d={`M ${110 * sc} 4 Q ${85 * sc} ${-110 * sc} ${52 * sc} ${-155 * sc} Q ${25 * sc} ${-50 * sc} 0 4 Z`}
              fill="#CFE8FA"
              stroke={OUTLINE}
              strokeWidth={3.5}
            />
            {/* Layered stylized orange/gold fireball */}
            {[
              { dx: 0, dy: -85, r: 92, c: '#FF5428' },
              { dx: -52, dy: -55, r: 64, c: '#FF6B2B' },
              { dx: 54, dy: -52, r: 62, c: '#FF6B2B' },
              { dx: 0, dy: -75, r: 62, c: '#FFA93A' },
              { dx: -16, dy: -68, r: 36, c: '#FFE79A' },
            ].map((lobe, i) => (
              <circle
                key={i}
                cx={lobe.dx * sc}
                cy={lobe.dy * sc + Math.sin(t / 6 + i) * 6}
                r={lobe.r * sc * (0.94 + 0.06 * Math.sin(t / 5 + i))}
                fill={lobe.c}
                stroke={i < 3 ? OUTLINE : 'none'}
                strokeWidth={3.5}
              />
            ))}
          </g>
        )}

        <LightVeil id={`${id}veil`} lights={[[bx, splashDown ? ground - 80 : by, 480 * sc]]} o={0.28} />
        <Dust t={t} seed={733} x0={40} y0={ground - 480 * sc} w={W - 80} h={480 * sc} n={36} o={0.5} />
      </g>
    );
  }

  // layer === 'near' — dark foreground ocean wave crests at bottom edge
  return (
    <g>
      <Foreground blur={4}>
        <path
          d={`M -600 ${H + 200} L -600 ${ground + 95 * sc} Q ${W * 0.25} ${ground + 68 * sc} ${W * 0.52} ${ground + 95 * sc} T ${W + 600} ${ground + 85 * sc} L ${W + 600} ${H + 200} Z`}
          fill="#060D1A"
        />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 5. ops — SpaceX Starbase launch control room (screens, desks, no faces)
// ---------------------------------------------------------------------------
export const OpsSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const tension = clamp(Number(sp.tension ?? 0));
  const ok = Number(sp.ok ?? 0) >= 0.5;
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  const okPulse = 0.78 + 0.22 * Math.sin(t / 9);
  const statusCol = (idx: number): string => {
    if (ok) return idx % 2 === 0 ? PALETTE.green : PALETTE.cyan;
    const nAmber = Math.round(tension * 8);
    if (idx < nAmber) {
      return Math.sin(t * 0.55 + idx * 1.1) > 0 ? PALETTE.orange : PALETTE.red;
    }
    return PALETTE.cyan;
  };

  if (layer === 'far') {
    const wallTop = vert ? H * 0.28 : H * 0.21;
    const screenY = wallTop + 34 * sc;
    const screenH = (vert ? 0.20 : 0.28) * H;
    const centerW = (vert ? 0.42 : 0.36) * W;
    const sideW = (vert ? 0.20 : 0.19) * W;
    const cx = W * 0.5;
    const dotP = (t * 0.008) % 1;

    return (
      <g>
        <rect x={-1200} y={-1200} width={W + 2400} height={H + 2400} fill="#0D0F1D" />
        {/* Architectural wall panel seams */}
        {[-0.2, 0.1, 0.4, 0.7, 1.0].map((fx, i) => (
          <line key={i} x1={fx * W} y1={-400} x2={fx * W} y2={ground} stroke="#191C32" strokeWidth={3} />
        ))}
        <RoomCorners x0={-200} x1={W + 200} y0={0} y1={ground} />

        {/* Center panoramic telemetry display */}
        <g transform={`translate(${cx - centerW / 2} ${screenY})`}>
          <rect
            width={centerW}
            height={screenH}
            rx={10}
            fill="#10172B"
            stroke={ok ? PALETTE.green : tension > 0.3 ? PALETTE.orange : '#3E4C73'}
            strokeWidth={SW}
          />
          {/* Curved Earth arc + cream orbital trajectory */}
          <path
            d={`M ${centerW * 0.08} ${screenH * 0.85} Q ${centerW * 0.5} ${screenH * 0.52} ${centerW * 0.92} ${screenH * 0.85}`}
            fill="none"
            stroke="#3B79A8"
            strokeWidth={3}
          />
          <path
            d={`M ${centerW * 0.12} ${screenH * 0.75} Q ${centerW * 0.48} ${screenH * 0.18} ${centerW * 0.88} ${screenH * 0.45}`}
            fill="none"
            stroke={PALETTE.cream}
            strokeWidth={3.5}
            opacity={0.9}
          />
          {/* Traveling telemetry dot */}
          <circle
            cx={lerp(centerW * 0.12, centerW * 0.88, dotP)}
            cy={lerp(screenH * 0.75, screenH * 0.45, dotP) - Math.sin(dotP * Math.PI) * screenH * 0.34}
            r={6 * sc}
            fill={ok ? PALETTE.green : PALETTE.gold}
          />
          <Glow x={centerW * 0.5} y={screenH * 0.5} r={centerW * 0.65} kind={ok ? 'cool' : 'warm'} o={0.22 * okPulse} />
        </g>

        {/* Flanking left & right 4-tile telemetry walls */}
        {[-1, 1].map((side, si) => {
          const sx = side < 0 ? cx - centerW / 2 - sideW - 22 * sc : cx + centerW / 2 + 22 * sc;
          const tileW = (sideW - 18 * sc) / 2;
          const tileH = (screenH - 18 * sc) / 2;
          return (
            <g key={si} transform={`translate(${sx} ${screenY})`}>
              <rect width={sideW} height={screenH} rx={8} fill="#0C1120" stroke={OUTLINE} strokeWidth={SW} />
              {[0, 1, 2, 3].map((ti) => {
                const col = statusCol(si * 4 + ti);
                const tx = 6 * sc + (ti % 2) * (tileW + 6 * sc);
                const ty = 6 * sc + Math.floor(ti / 2) * (tileH + 6 * sc);
                return (
                  <g key={ti} transform={`translate(${tx} ${ty})`}>
                    <rect
                      width={tileW}
                      height={tileH}
                      rx={4}
                      fill="#151E36"
                      stroke={col}
                      strokeWidth={2.5}
                      opacity={ok ? okPulse : 0.92}
                    />
                    {/* Telemetry waveform bar inside tile */}
                    <path
                      d={`M 10 ${tileH * 0.62} L ${tileW * 0.32} ${tileH * 0.42} L ${tileW * 0.6} ${tileH * 0.72} L ${tileW - 10} ${tileH * 0.34}`}
                      fill="none"
                      stroke={col}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Overhead downlight cones */}
        {[0.25, 0.5, 0.75].map((lx, i) => (
          <Cone
            key={i}
            d={`M ${lx * W - 30} ${wallTop - 40} L ${lx * W + 30} ${wallTop - 40} L ${lx * W + 190} ${ground} L ${lx * W - 190} ${ground} Z`}
            o={0.14}
          />
        ))}
      </g>
    );
  }

  if (layer === 'mid') {
    const deskY = ground - 94 * sc;
    return (
      <g>
        <GroundPlane y={ground} fill="#151424" rim="#7C8AB8" />

        {/* Two rows of console desks & high-back chairs (strictly no faces/heads) */}
        {[0.14, 0.34, 0.66, 0.86].map((dx, i) => {
          const x = dx * W;
          const col = statusCol(i);
          return (
            <g key={i} transform={`translate(${x} ${deskY})`}>
              {/* High-back chair silhouette behind console */}
              <rect x={-26 * sc} y={-24 * sc} width={52 * sc} height={80 * sc} rx={12 * sc} fill="#171628" stroke={OUTLINE} strokeWidth={3.5} />
              {/* Console desk */}
              <rect x={-72 * sc} y={14 * sc} width={144 * sc} height={80 * sc} rx={6} fill="#212038" stroke={OUTLINE} strokeWidth={SW} />
              {/* Angled monitor back & glowing strip */}
              <rect x={-48 * sc} y={-28 * sc} width={96 * sc} height={44 * sc} rx={4} fill="#14182D" stroke={OUTLINE} strokeWidth={3.5} />
              <line x1={-36 * sc} y1={-6 * sc} x2={36 * sc} y2={-6 * sc} stroke={col} strokeWidth={3.5} opacity={0.85} />
              {/* Gooseneck desk lamp */}
              <path d={`M ${50 * sc} ${14 * sc} Q ${54 * sc} ${-26 * sc} ${34 * sc} ${-28 * sc}`} fill="none" stroke="#4D5578" strokeWidth={3.5} />
              <circle cx={32 * sc} cy={-27 * sc} r={5 * sc} fill="#FFE2A8" />
              <Glow x={32 * sc} y={-26 * sc} r={65 * sc} kind="warm" o={0.42} />
            </g>
          );
        })}

        <LightVeil
          id={`${id}veil`}
          lights={[
            [W * 0.5, H * 0.38, 560 * sc],
            [W * 0.25, deskY, 260 * sc],
            [W * 0.75, deskY, 260 * sc],
          ]}
          o={0.28}
        />
        <Dust t={t} seed={811} x0={60} y0={H * 0.22} w={W - 120} h={ground - H * 0.22} n={26} o={0.38} />
      </g>
    );
  }

  // layer === 'near' — corner console frame silhouettes at bottom edges
  return (
    <g>
      <Foreground blur={5}>
        <polygon
          points={`-300,${H + 200} -300,${ground - 120 * sc} ${W * 0.08},${ground - 40 * sc} ${W * 0.12},${H + 200}`}
          fill="#070712"
        />
        <polygon
          points={`${W + 300},${H + 200} ${W + 300},${ground - 120 * sc} ${W * 0.92},${ground - 40 * sc} ${W * 0.88},${H + 200}`}
          fill="#070712"
        />
      </Foreground>
    </g>
  );
};
