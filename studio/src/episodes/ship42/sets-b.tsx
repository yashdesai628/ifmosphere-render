import React from 'react';
import { PALETTE, GroundPlane } from '../../brand';
import { clamp, lerp, backOut, easeInOut, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Stars, Rays, Sun, Bokeh, Foreground } from '../../engine/kit';
import type { SetProps } from './render';
import {
  OUTLINE,
  SW,
  SkyBackdrop,
  StarshipVehicle,
  EarthCurvedLimb,
} from './sets-shared';

// ---------------------------------------------------------------------------
// 6. orbit — Earth from low orbit (275 km), curved limb, lights, sunrise
// ---------------------------------------------------------------------------
export const OrbitSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const prog = clamp(Number(sp.t ?? 0.3));
  const lights = clamp(Number(sp.lights ?? 0.3));
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;
  const sunrise = prog >= 0.72 && lights <= 0.35;

  if (layer === 'far') {
    return (
      <g>
        <SkyBackdrop
          id={`${id}sky`}
          W={W}
          H={H}
          yTop={-500}
          yBot={H + 200}
          stops={[[0, '#050510'], [0.65, '#090D22'], [1, '#13244A']]}
        />
        <Stars seed={911} x0={-900} y0={-900} w={W + 1800} h={ground + 900} t={t} n={130} o={0.92} />
        {sunrise ? (
          <Sun x={W * 0.80} y={ground - 36 * sc} r={46 * sc} t={t} />
        ) : (
          <Rays x={W * 0.2} y={H * 0.18} t={t} color="#9FD4FF" o={0.07} />
        )}
      </g>
    );
  }

  if (layer === 'mid') {
    const R = Math.max(W, H) * 1.9;
    const cx = W * 0.5;
    const cy = ground + R - 22 * sc;
    const shipX = lerp(0.18 * W, 0.82 * W, prog);
    const shipY = (vert ? 0.35 : 0.27) * H - Math.sin(prog * Math.PI) * 34 * sc + Math.sin(t / 14) * 3;
    const burning = (prog >= 0.08 && prog <= 0.17) || prog >= 0.93;

    return (
      <g>
        {/* Giant curved Earth limb anchoring ground */}
        <EarthCurvedLimb id={`${id}earth`} cx={cx} cy={cy} R={R} t={t} lights={lights} shift={prog} />

        {/* Subtle orbital trajectory arc & trailing path */}
        <path
          d={`M ${W * 0.06} ${(vert ? 0.37 : 0.29) * H} Q ${W * 0.5} ${(vert ? 0.27 : 0.19) * H} ${W * 0.94} ${(vert ? 0.37 : 0.29) * H}`}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={2.5}
          strokeDasharray="10 12"
          opacity={0.34}
        />

        {/* Small Ship 42 gliding along low Earth orbit */}
        <StarshipVehicle
          x={shipX}
          y={shipY}
          t={t}
          scale={sc * 0.36}
          angle={78}
          flame={burning ? 0.85 : 0}
          coolCore
        />

        <LightVeil
          id={`${id}veil`}
          lights={[
            [shipX, shipY, 340 * sc],
            [W * 0.5, ground - 40, 680 * sc],
          ]}
          o={0.22}
        />
        <Dust t={t} seed={923} x0={40} y0={60} w={W - 80} h={ground - 80} n={24} o={0.36} />
      </g>
    );
  }

  // layer === 'near' — dark corner viewport framing & orbital dust specks
  return (
    <g>
      <Foreground blur={5}>
        <circle cx={-W * 0.04} cy={H * 0.94} r={110 * sc} fill="#050610" />
        <circle cx={W * 1.04} cy={H * 0.94} r={110 * sc} fill="#050610" />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 7. deploy — Close view of Ship 42's Pez-dispenser payload bay over Earth
// ---------------------------------------------------------------------------
export const DeploySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const nDeployed = clamp(Math.round(Number(sp.n ?? 0)), 0, 26);
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <SkyBackdrop
          id={`${id}sky`}
          W={W}
          H={H}
          yTop={-500}
          yBot={H + 200}
          stops={[[0, '#050512'], [0.65, '#091029'], [1, '#16386E']]}
        />
        <Stars seed={1009} x0={-900} y0={-900} w={W + 1800} h={ground + 900} t={t} n={120} o={0.9} />
        <Glow x={W * 0.65} y={ground - 20} r={480 * sc} kind="cool" o={0.32} />
      </g>
    );
  }

  if (layer === 'mid') {
    const R = Math.max(W, H) * 1.95;
    const bayX = (vert ? 0.25 : 0.24) * W;
    const bayY = (vert ? 0.56 : 0.54) * H;
    const remaining = Math.max(0, 26 - nDeployed);
    const visibleStream = Math.min(nDeployed, 9);
    const latestPop = backOut(clamp(p / 0.45));

    return (
      <g>
        <EarthCurvedLimb id={`${id}earth`} cx={W * 0.55} cy={ground + R - 18 * sc} R={R} t={t} lights={0.25} />

        {/* Close-up Ship 42 payload bay section tilted upward-right */}
        <g transform={`translate(${bayX} ${bayY}) rotate(22) scale(${sc * (vert ? 1.55 : 1.75)})`}>
          {/* Ship forward aero flap */}
          <polygon
            points="-58,-126 -90,-82 -58,-64"
            fill="#272538"
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          {/* Stainless steel upper nose & hull */}
          <path
            d="M 0 -220 C 48 -182, 58 -142, 58 -110 L 58 140 L -58 140 L -58 -110 C -58 -142, -48 -182, 0 -220 Z"
            fill="#CBD3E4"
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          {/* Dark heat-shield tile underside */}
          <path
            d="M 0 -220 C -48 -182, -58 -142, -58 -110 L -58 140 L -14 140 L -14 -216 Z"
            fill="#222031"
          />
          {/* Open Pez-dispenser payload slot */}
          <rect x={4} y={-92} width={44} height={116} rx={5} fill="#0D1122" stroke={OUTLINE} strokeWidth={3.5} />
          <Glow x={26} y={-34} r={70} kind="cool" o={0.5} />

          {/* Stacked Starlink slabs remaining inside the Pez dispenser */}
          {Array.from({ length: Math.min(10, Math.ceil(remaining / 2.6)) }).map((_, i) => (
            <rect
              key={i}
              x={8}
              y={10 - i * 10}
              width={36}
              height={7}
              rx={2}
              fill="#2B324B"
              stroke="#8CB6E8"
              strokeWidth={1.6}
            />
          ))}

          {/* Hinged open payload door */}
          <path
            d="M 48 -92 L 96 -118 L 96 -2 L 48 24 Z"
            fill="#9BA8C2"
            stroke={OUTLINE}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          <path
            d="M 0 -220 C 48 -182, 58 -142, 58 -110 L 58 140 L -58 140 L -58 -110 C -58 -142, -48 -182, 0 -220 Z"
            fill="none"
            stroke={OUTLINE}
            strokeWidth={SW}
          />
        </g>

        {/* Deployed Starlink satellites floating away in a curved stream */}
        {Array.from({ length: visibleStream }).map((_, i) => {
          const frac = (i + 1) / (visibleStream + 0.6);
          const pop = i === 0 ? latestPop : 1;
          const sx = bayX + (95 + frac * (vert ? 460 : 680) * pop) * sc;
          const sy = bayY - (75 + Math.sin(frac * 1.4) * 185) * sc + Math.sin(t / 12 + i * 1.4) * 6;
          const sRot = -18 + i * 9 + Math.sin(t / 16 + i) * 6;
          const sScale = sc * (0.95 - frac * 0.35);
          const glint = 0.5 + 0.5 * Math.sin(t / 8 + i * 2.1);
          return (
            <g key={i} transform={`translate(${sx} ${sy}) rotate(${sRot}) scale(${sScale})`}>
              {/* Flat dark satellite body */}
              <rect x={-32} y={-14} width={64} height={28} rx={4} fill="#1C2136" stroke={OUTLINE} strokeWidth={3.5} />
              <rect x={-28} y={-10} width={56} height={20} rx={2} fill="none" stroke="#9BB6DF" strokeWidth={2} />
              {/* Gold solar-array panel & glint */}
              <rect x={16} y={-12} width={30} height={24} rx={3} fill={PALETTE.gold} stroke={OUTLINE} strokeWidth={3} />
              <line x1={22} y1={-8} x2={40} y2={8} stroke="#FFF6D6" strokeWidth={3} opacity={glint} strokeLinecap="round" />
            </g>
          );
        })}

        <LightVeil
          id={`${id}veil`}
          lights={[
            [bayX + 90 * sc, bayY - 40 * sc, 460 * sc],
            [W * 0.65, H * 0.45, 420 * sc],
          ]}
          o={0.22}
        />
        <Dust t={t} seed={1031} x0={60} y0={80} w={W - 120} h={ground - 100} n={28} o={0.42} />
      </g>
    );
  }

  // layer === 'near' — drifting corner Starlink panel edge
  return (
    <g>
      <Foreground blur={5}>
        <polygon
          points={`${W + 200},${H * 0.14} ${W * 0.91},${H * 0.19} ${W * 0.94},${H * 0.32} ${W + 200},${H * 0.28}`}
          fill="#0B0E1A"
        />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 8. loop — Top-down orbit diagram around Earth (14 laps at 260 km)
// ---------------------------------------------------------------------------
export const LoopSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const laps = clamp(Number(sp.laps ?? 1), 0, 14);
  const glow = Number(sp.glow ?? 0) >= 0.5;
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  const cx = W * 0.5;
  const cy = (vert ? 0.46 : 0.49) * H;
  const rEarth = (vert ? 144 : 150) * sc;
  const rOrbit = (vert ? 226 : 236) * sc;

  if (layer === 'far') {
    return (
      <g>
        <SkyBackdrop
          id={`${id}sky`}
          W={W}
          H={H}
          yTop={-500}
          yBot={H + 200}
          stops={[[0, '#070614'], [0.6, '#0B0B20'], [1, '#121533']]}
        />
        <Stars seed={1103} x0={-900} y0={-900} w={W + 1800} h={H + 1800} t={t} n={110} o={0.85} />
        <Rays x={cx} y={cy} t={t} color={glow ? '#FFD470' : '#85E2FF'} o={glow ? 0.13 : 0.08} />
        {/* Faint coordinate rings */}
        {[rOrbit * 1.4, rOrbit * 1.9].map((rr, i) => (
          <circle key={i} cx={cx} cy={cy} r={rr} fill="none" stroke="#4D6699" strokeWidth={1.5} opacity={0.14} />
        ))}
      </g>
    );
  }

  if (layer === 'mid') {
    const curAngleDeg = ((laps + easeInOut(p) * 0.35) / 14) * 360 - 90;
    const curRad = (curAngleDeg * Math.PI) / 180;
    const shipX = cx + Math.cos(curRad) * rOrbit;
    const shipY = cy + Math.sin(curRad) * rOrbit;
    const spinEarth = t * 0.22;

    return (
      <g>
        {/* Clean dark telemetry floor plane at ground */}
        <GroundPlane y={ground} fill="#0C0D1D" rim={glow ? PALETTE.gold : PALETTE.cyan} />
        <Glow x={cx} y={ground} r={260 * sc} kind={glow ? 'warm' : 'cool'} o={0.22} />

        {/* Atmospheric Earth disc glow */}
        <Glow x={cx} y={cy} r={rEarth * 1.65} kind="cool" o={0.42} />
        {glow ? <Glow x={cx} y={cy} r={rOrbit * 1.38} kind="warm" o={0.34} /> : null}

        {/* Earth disc */}
        <defs>
          <clipPath id={`${id}disc`}>
            <circle cx={cx} cy={cy} r={rEarth} />
          </clipPath>
        </defs>
        <circle cx={cx} cy={cy} r={rEarth} fill="#14487E" stroke="#A6ECFF" strokeWidth={SW} />
        <g clipPath={`url(#${id}disc)`}>
          <g transform={`translate(${cx} ${cy}) rotate(${spinEarth})`} fill="#2E8B78">
            <path d={`M ${-95 * sc} ${-45 * sc} Q ${-40 * sc} ${-88 * sc} ${25 * sc} ${-52 * sc} L ${10 * sc} ${12 * sc} Q ${-60 * sc} ${25 * sc} ${-95 * sc} ${-45 * sc} Z`} />
            <path d={`M ${28 * sc} ${18 * sc} Q ${85 * sc} ${-15 * sc} ${115 * sc} ${42 * sc} Q ${70 * sc} ${95 * sc} ${18 * sc} ${75 * sc} Z`} />
            <path d={`M ${-65 * sc} ${42 * sc} Q ${-10 * sc} ${32 * sc} ${-22 * sc} ${95 * sc} Q ${-78 * sc} ${105 * sc} ${-92 * sc} ${58 * sc} Z`} />
          </g>
          {/* Polar cap highlight */}
          <ellipse cx={cx} cy={cy - rEarth * 0.78} rx={rEarth * 0.42} ry={rEarth * 0.16} fill="#E8F6FF" opacity={0.55} />
        </g>
        <circle cx={cx} cy={cy} r={rEarth} fill="none" stroke="#B6EEFF" strokeWidth={3.5} opacity={0.85} />

        {/* Thin cream circular 260 km orbit ring */}
        <circle
          cx={cx}
          cy={cy}
          r={rOrbit}
          fill="none"
          stroke={glow ? PALETTE.gold : PALETTE.cream}
          strokeWidth={glow ? 4.5 : 3}
          strokeDasharray={glow ? undefined : '12 8'}
          opacity={glow ? 0.9 : 0.72}
        />

        {/* 14 lap tick marks */}
        {Array.from({ length: 14 }).map((_, i) => {
          const ang = ((i / 14) * 360 - 90) * (Math.PI / 180);
          const done = i < Math.round(laps);
          const tx1 = cx + Math.cos(ang) * (rOrbit - 11 * sc);
          const ty1 = cy + Math.sin(ang) * (rOrbit - 11 * sc);
          const tx2 = cx + Math.cos(ang) * (rOrbit + 11 * sc);
          const ty2 = cy + Math.sin(ang) * (rOrbit + 11 * sc);
          return (
            <g key={i}>
              <line
                x1={tx1}
                y1={ty1}
                x2={tx2}
                y2={ty2}
                stroke={done ? (glow ? PALETTE.gold : PALETTE.cyan) : '#5C6B94'}
                strokeWidth={done ? 4.5 : 2.5}
                strokeLinecap="round"
              />
              {done ? (
                <circle
                  cx={cx + Math.cos(ang) * rOrbit}
                  cy={cy + Math.sin(ang) * rOrbit}
                  r={5.5 * sc}
                  fill={glow ? PALETTE.gold : PALETTE.cyan}
                />
              ) : null}
            </g>
          );
        })}

        {/* Small ship dot/chevron riding the orbit ring */}
        <g transform={`translate(${shipX} ${shipY}) rotate(${curAngleDeg + 90})`}>
          <Glow x={0} y={0} r={34 * sc} kind="warm" o={0.65} />
          <polygon
            points={`0,${-12 * sc} ${9 * sc},${10 * sc} 0,${5 * sc} ${-9 * sc},${10 * sc}`}
            fill={PALETTE.cream}
            stroke={OUTLINE}
            strokeWidth={3}
          />
        </g>

        <LightVeil id={`${id}veil`} lights={[[cx, cy, rOrbit * 1.9]]} o={0.28} />
        <Dust t={t} seed={1151} x0={60} y0={60} w={W - 120} h={ground - 80} n={22} o={0.35} />
      </g>
    );
  }

  // layer === 'near' — outer radar framing corner ticks
  return (
    <g opacity={0.35} stroke="#5F75AD" strokeWidth={3} fill="none">
      <path d={`M ${W * 0.04} ${H * 0.12} L ${W * 0.04} ${H * 0.06} L ${W * 0.09} ${H * 0.06}`} />
      <path d={`M ${W * 0.96} ${H * 0.12} L ${W * 0.96} ${H * 0.06} L ${W * 0.91} ${H * 0.06}`} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 9. reentry — Belly-first hypersonic reentry with orange/pink/white plasma
// ---------------------------------------------------------------------------
export const ReentrySet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const heat = clamp(Number(sp.heat ?? 0.5));
  const alt = clamp(Number(sp.alt ?? 0.5));
  const vert = H > W;
  const sc = Math.min(W, H) / 1080;

  if (layer === 'far') {
    const stops: [number, string][] =
      alt > 0.65
        ? [[0, '#050510'], [0.6, '#12193A'], [1, '#1E3C74']]
        : alt > 0.3
          ? [[0, '#09071A'], [0.5, '#29173B'], [1, '#1C4480']]
          : [[0, '#0B1736'], [0.55, '#193C73'], [1, '#2E66A8']];
    return (
      <g>
        <SkyBackdrop id={`${id}sky`} W={W} H={H} yTop={-400} yBot={ground + 80} stops={stops} />
        {alt > 0.35 ? (
          <Stars seed={1201} x0={-900} y0={-900} w={W + 1800} h={ground + 800} t={t} n={80} o={clamp((alt - 0.3) * 1.4)} />
        ) : null}
        {heat > 0.15 ? (
          <Glow x={W * 0.48} y={H * 0.48} r={520 * sc} kind="warm" o={0.42 * heat} />
        ) : null}
      </g>
    );
  }

  if (layer === 'mid') {
    const sx = (vert ? 0.50 : 0.45) * W;
    const sy = (vert ? 0.46 : 0.44) * H + Math.sin(t * 0.38) * (3 + 4 * heat);
    const shipSc = sc * (vert ? 1.15 : 1.32);
    const wave = Math.sin(t * 0.55) * 4;

    return (
      <g>
        {/* Atmospheric cloud-deck shelf at ground */}
        <GroundPlane
          y={ground}
          fill="#152B4D"
          rim={heat > 0.5 ? '#FFAC75' : '#8AD0FA'}
        />
        {[-0.1, 0.25, 0.6, 0.95].map((cx, i) => (
          <ellipse
            key={i}
            cx={cx * W + ((t * 1.2 + i * 70) % 140)}
            cy={ground - 6 + (i % 2) * 8}
            rx={170 * sc}
            ry={20 * sc}
            fill={heat > 0.55 ? '#F5A67E' : '#8FC3EB'}
            opacity={0.22}
          />
        ))}

        {/* Horizontal belly-first falling ship + multi-layer plasma sheath */}
        <g transform={`translate(${sx} ${sy}) rotate(${66 + Math.sin(t * 0.35) * 2})`}>
          {/* Multi-layer plasma bow shock wrapping belly (right side in local ship coords) */}
          {heat > 0.04 ? (
            <g opacity={clamp(heat * 1.15)}>
              <Glow x={42 * shipSc} y={0} r={220 * shipSc * heat} kind="warm" o={0.75 * heat} />
              {/* Outer fiery orange plasma layer */}
              <path
                d={`M -6 ${-156 * shipSc} Q ${82 * shipSc + wave} ${-70 * shipSc} ${84 * shipSc} ${25 * shipSc} Q ${76 * shipSc - wave} ${135 * shipSc} ${12 * shipSc} ${170 * shipSc} L ${40 * shipSc} ${176 * shipSc} Q ${110 * shipSc} ${90 * shipSc} ${108 * shipSc + wave} 0 Q ${104 * shipSc} ${-110 * shipSc} ${10 * shipSc} ${-175 * shipSc} Z`}
                fill="#FF6624"
                opacity={0.78 * heat}
              />
              {/* Mid hot pink / magenta ionized layer */}
              <path
                d={`M 0 ${-144 * shipSc} Q ${64 * shipSc} ${-60 * shipSc} ${66 * shipSc + wave * 0.5} ${22 * shipSc} Q ${58 * shipSc} ${120 * shipSc} ${18 * shipSc} ${152 * shipSc} L ${34 * shipSc} ${155 * shipSc} Q ${86 * shipSc} ${80 * shipSc} ${84 * shipSc} 0 Q ${82 * shipSc} ${-96 * shipSc} ${12 * shipSc} ${-156 * shipSc} Z`}
                fill="#FF54A8"
                opacity={0.76 * heat}
              />
              {/* Inner blinding white-cream shock core */}
              <path
                d={`M 4 ${-132 * shipSc} Q ${46 * shipSc} ${-50 * shipSc} ${48 * shipSc} ${20 * shipSc} Q ${42 * shipSc} ${108 * shipSc} ${22 * shipSc} ${134 * shipSc}`}
                fill="none"
                stroke="#FFF6E8"
                strokeWidth={(5 + 6 * heat) * shipSc}
                strokeLinecap="round"
                opacity={0.92 * heat}
              />
            </g>
          ) : null}

          <StarshipVehicle
            x={0}
            y={0}
            t={t}
            scale={shipSc}
            tileSide="right"
            heatGlow={heat}
          />
        </g>

        {/* Streaming plasma sparks whipping diagonally up-left */}
        {heat > 0.1 ? (
          <g>
            {Array.from({ length: Math.round(10 + heat * 18) }).map((_, i) => {
              const spSpeed = 14 + rnd(41, i) * 14;
              const phase = ((t * spSpeed + rnd(42, i) * 600) % 600) / 600;
              const px = sx + (rnd(43, i) - 0.3) * 320 * sc - phase * 480 * sc;
              const py = sy + (rnd(44, i) - 0.3) * 180 * sc - phase * 340 * sc;
              const col = i % 3 === 0 ? '#FFF2D6' : i % 3 === 1 ? '#FF68B4' : '#FF7832';
              return (
                <line
                  key={i}
                  x1={px}
                  y1={py}
                  x2={px + 26 * sc}
                  y2={py + 18 * sc}
                  stroke={col}
                  strokeWidth={2.5 + (i % 2)}
                  strokeLinecap="round"
                  opacity={(1 - phase) * heat}
                />
              );
            })}
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[sx, sy, 520 * sc]]} o={0.28} />
        <Dust t={t} seed={1247} x0={40} y0={60} w={W - 80} h={ground - 60} n={30} o={0.45 * Math.max(0.3, heat)} />
      </g>
    );
  }

  // layer === 'near' — fast corner plasma streaks at frame edges
  return (
    <g opacity={0.55 * heat}>
      <Foreground blur={4}>
        <line x1={W * 0.08} y1={H * 0.18} x2={W * 0.02} y2={H * 0.12} stroke="#FF8242" strokeWidth={6} strokeLinecap="round" />
        <line x1={W * 0.96} y1={H * 0.78} x2={W * 0.89} y2={H * 0.71} stroke="#FF66B3" strokeWidth={6} strokeLinecap="round" />
      </Foreground>
    </g>
  );
};

// ---------------------------------------------------------------------------
// 10. void — Clean Jump-style deep-navy stage with tinted slow light rays
// ---------------------------------------------------------------------------
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glowName = String(sp.glow ?? 'gold');
  const tint = glowName === 'cyan' ? PALETTE.cyan : glowName === 'red' ? PALETTE.red : PALETTE.gold;
  const glowKind = glowName === 'cyan' ? 'cool' : glowName === 'red' ? 'red' : 'warm';
  const sc = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <SkyBackdrop
          id={`${id}sky`}
          W={W}
          H={H}
          yTop={-500}
          yBot={H + 200}
          stops={[[0, '#070614'], [0.65, '#0B0B1E'], [1, '#13142E']]}
        />
        <Stars seed={1307} x0={-900} y0={-900} w={W + 1800} h={ground + 900} t={t} n={28} o={0.52} />
        <Glow x={W * 0.5} y={H * 0.42} r={540 * sc} kind={glowKind} o={0.34} />
        <Rays x={W * 0.5} y={H * 0.42} t={t} color={tint} o={0.14} />
      </g>
    );
  }

  if (layer === 'mid') {
    return (
      <g>
        <GroundPlane y={ground} fill="#0E0D20" rim={tint} />
        {/* Soft spotlight pool and subtle stage rings under Pip */}
        <Glow x={W * 0.5} y={ground} r={340 * sc} kind={glowKind} o={0.25} />
        <ellipse cx={W * 0.5} cy={ground + 40 * sc} rx={360 * sc} ry={26 * sc} fill="none" stroke={tint} strokeWidth={2} opacity={0.2} />
        <Dust t={t} seed={1361} x0={80} y0={100} w={W - 160} h={ground - 120} n={22} o={0.35} />
      </g>
    );
  }

  // layer === 'near' — dark vignette + subtle atmospheric bokeh at edges
  return (
    <g>
      <LightVeil id={`${id}veil`} lights={[[W * 0.5, H * 0.48, Math.max(W, H) * 0.58]]} o={0.28} />
      <Bokeh seed={1399} n={6} x0={0} y0={0} w={W} h={H} t={t} o={0.1} />
    </g>
  );
};
