import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeOut, backOut } from '../../engine/anim';
import { Glow, Dust, LightVeil } from '../../engine/light';
import type { SetProps } from './render';
import {
  OUT,
  numParam,
  glowTone,
  toneColor,
  glowKind,
  SpaceGridBg,
  StageFloor,
  EdgeSilhouettes,
  OrbiterGraphic,
  ReactionWheelGraphic,
  MarsDisc,
} from './sets-shared';

/** Reaction wheels diagram: orbiter in left-mid with 2x2 grid of wheels 1-4 and 'AT LEAST 3' bracket. */
export const WheelsSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const dead = clamp(numParam(sp.dead, 0), 0, 2);
  const need = clamp(numParam(sp.need, 0));
  const gTone = glowTone(sp.glow, dead >= 2 ? 'red' : 'cyan');
  const vert = H > W;

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={24} raysO={0.14} />;
  }

  if (layer === 'mid') {
    const ox = vert ? W * 0.24 : W * 0.24;
    const oy = vert ? H * 0.50 : H * 0.46;
    const gx = vert ? W * 0.66 : W * 0.61;
    const gy = vert ? H * 0.50 : H * 0.46;
    const dx = vert ? 92 : 128;
    const dy = vert ? 92 : 112;
    const wr = vert ? 36 : 48;

    const wheelConfigs = [
      { n: '1', sub: dead >= 0.8 ? '2013' : '', cx: gx - dx * 0.55, cy: gy - dy * 0.55, d: clamp(dead) },
      { n: '2', sub: dead > 1.05 ? '2026' : '', cx: gx + dx * 0.55, cy: gy - dy * 0.55, d: clamp(dead - 1) },
      { n: '3', sub: '', cx: gx - dx * 0.55, cy: gy + dy * 0.55, d: 0 },
      { n: '4', sub: '', cx: gx + dx * 0.55, cy: gy + dy * 0.55, d: 0 },
    ];
    const bracketPop = need > 0.05 ? backOut(clamp(p / 0.45)) * need : 0;

    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#0F1224" rim={toneColor(gTone)} rimOpacity={0.55} />

        {/* Schematic harness lines from orbiter to 2x2 grid */}
        <g stroke="#3E507D" strokeWidth={3} fill="none" opacity={0.7}>
          {wheelConfigs.map((w) => (
            <path key={w.n} d={`M ${ox + 35} ${oy} Q ${(ox + w.cx) * 0.5} ${oy} ${w.cx} ${w.cy}`} />
          ))}
        </g>

        {/* Orbiter bus */}
        <OrbiterGraphic
          x={ox}
          y={oy}
          scale={vert ? 0.58 : 0.84}
          angle={dead >= 2 ? 12 + Math.sin(t * 0.07) * 5 : Math.sin(t * 0.04) * 3}
          t={t}
          gTone={gTone}
          thruster={dead >= 2 ? 0.65 : 0}
        />

        {/* 2x2 reaction wheel grid labelled 1-4 */}
        {wheelConfigs.map((w) => (
          <g key={w.n} transform={`translate(${w.cx} ${w.cy})`}>
            <ReactionWheelGraphic r={wr} spin={w.d < 0.9} dead={w.d} t={t} label={w.n} />
            <text x={-wr * 0.78} y={-wr * 0.78 + 6} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.cream}>
              {w.n}
            </text>
            {w.sub ? (
              <text x={0} y={wr + 22} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16} fill={PALETTE.red}>
                {w.sub}
              </text>
            ) : null}
          </g>
        ))}

        {/* Cream bracket 'AT LEAST 3' when sp.need > 0 */}
        {bracketPop > 0.02 ? (
          <g transform={`translate(${gx} ${gy + dy * 0.55 + wr + 34}) scale(${bracketPop})`}>
            <path
              d={`M ${-dx * 0.82} -14 L ${-dx * 0.82} 0 L ${dx * 0.82} 0 L ${dx * 0.82} -14`}
              fill="none"
              stroke={PALETTE.cream}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <rect x={-96} y={8} width={192} height={32} rx={8} fill="#1E1B2E" stroke={PALETTE.cream} strokeWidth={2.5} />
            <text x={0} y={30} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cream}>
              AT LEAST 3
            </text>
          </g>
        ) : null}

        <Dust t={t} seed={607} x0={0} y0={H * 0.2} w={W} h={ground - H * 0.2} n={26} o={0.4} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [gx, gy, 380],
            [W * 0.5, ground - 150, W * 0.42],
          ]}
          o={0.25}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};

/** Fuel gauge: round hydrazine tank with sloshing draining liquid and calendar strip with 1-2 months bracket. */
export const FuelSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.5));
  const fracBase = clamp(numParam(sp.frac, 0.35), 0.04, 1);
  const frac = clamp(fracBase - p * 0.06 - st * 0.02, 0.04, 1);
  const range = clamp(numParam(sp.range, 0));
  const gTone = glowTone(sp.glow, frac < 0.2 ? 'red' : 'gold');
  const vert = H > W;

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={22} raysO={0.14} />;
  }

  if (layer === 'mid') {
    const tx = vert ? W * 0.36 : W * 0.38;
    const ty = vert ? H * 0.50 : H * 0.47;
    const tr = vert ? 114 : 148;
    const wr = tr - 22;
    const liqTop = ty + wr - frac * (wr * 2);
    const liqCol = frac < 0.2 ? PALETTE.red : frac < 0.35 ? PALETTE.gold : PALETTE.cyan;
    const waveOffset = Math.sin(t * 0.14) * 5;

    const calX = vert ? W * 0.62 : W * 0.62;
    const calY = ty - 92;
    const months = ['NOV', 'DEC', 'JAN', 'FEB'];
    const rowH = 44;
    const rangeShimmer = range < 0.9 ? 0.5 + 0.5 * Math.sin(t * 0.22) : 1;

    return (
      <g>
        <defs>
          <clipPath id={`${id}tankClip`}>
            <circle cx={tx} cy={ty} r={wr} />
          </clipPath>
        </defs>
        <StageFloor ground={ground} W={W} fill="#0F1224" rim={toneColor(gTone)} rimOpacity={0.55} />

        {/* Tank support cradle to ground */}
        <rect x={tx - tr * 0.58} y={ty + tr * 0.45} width={22} height={ground - (ty + tr * 0.45) + 6} fill="#252C47" stroke={OUT} strokeWidth={4} />
        <rect x={tx + tr * 0.58 - 22} y={ty + tr * 0.45} width={22} height={ground - (ty + tr * 0.45) + 6} fill="#252C47" stroke={OUT} strokeWidth={4} />

        {/* Top valve neck */}
        <rect x={tx - 24} y={ty - tr - 24} width={48} height={30} rx={5} fill="#6F7890" stroke={OUT} strokeWidth={4} />
        <rect x={tx - 34} y={ty - tr - 32} width={68} height={14} rx={4} fill="#8E97AE" stroke={OUT} strokeWidth={3.5} />

        {/* Outer metallic sphere tank */}
        <Glow x={tx} y={ty} r={tr * 1.45} kind={glowKind(gTone)} o={0.28} />
        <circle cx={tx} cy={ty} r={tr} fill="#3B425E" stroke={OUT} strokeWidth={4} />
        <circle cx={tx} cy={ty} r={wr + 4} fill="#0A0E1E" stroke={OUT} strokeWidth={3.5} />

        {/* Clipped hydrazine liquid level with live wave & rising bubbles */}
        <g clipPath={`url(#${id}tankClip)`}>
          <path
            d={`M ${tx - wr - 10} ${liqTop} Q ${tx - wr * 0.5} ${liqTop + waveOffset} ${tx} ${liqTop} T ${tx + wr + 10} ${liqTop} L ${tx + wr + 10} ${ty + wr + 20} L ${tx - wr - 10} ${ty + wr + 20} Z`}
            fill={liqCol}
            opacity={0.86}
          />
          <line x1={tx - wr} y1={liqTop} x2={tx + wr} y2={liqTop} stroke={PALETTE.cream} strokeWidth={3} opacity={0.65} />
          {[0, 1, 2, 3].map((b) => {
            const bx = tx - wr * 0.45 + b * (wr * 0.3);
            const rise = ((t * 1.2 + b * 24) % Math.max(24, ty + wr - liqTop));
            return (
              <circle
                key={b}
                cx={bx + Math.sin(t * 0.1 + b) * 4}
                cy={ty + wr - rise}
                r={3.5 + (b % 2) * 2}
                fill={PALETTE.cream}
                opacity={0.45}
              />
            );
          })}
        </g>

        {/* Glass highlight arc & percentage label */}
        <path
          d={`M ${tx - wr * 0.72} ${ty - wr * 0.35} A ${wr * 0.8} ${wr * 0.8} 0 0 1 ${tx - wr * 0.25} ${ty - wr * 0.76}`}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.45}
        />
        <text x={tx} y={ty - 8} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={32} fill={PALETTE.cream}>
          {`${Math.round(frac * 100)}%`}
        </text>
        <text x={tx} y={ty + 18} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16} fill={PALETTE.cream} opacity={0.8}>
          HYDRAZINE
        </text>

        {/* Calendar strip beside tank */}
        <g>
          {months.map((m, i) => {
            const my = calY + i * (rowH + 8);
            const active = i === 1 || i === 2;
            return (
              <g key={m}>
                <rect
                  x={calX}
                  y={my}
                  width={116}
                  height={rowH}
                  rx={8}
                  fill={active ? '#232742' : '#161A2E'}
                  stroke={OUT}
                  strokeWidth={3.5}
                />
                <rect x={calX + 4} y={my + 4} width={14} height={rowH - 8} rx={4} fill={i === 0 ? PALETTE.cream : active ? toneColor(gTone) : '#424A68'} />
                <text x={calX + 68} y={my + 29} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={20} fill={PALETTE.cream}>
                  {m}
                </text>
              </g>
            );
          })}
        </g>

        {/* Cream bracket marking 1 to 2 months */}
        {range > 0.05 ? (
          <g opacity={range * (0.65 + 0.35 * rangeShimmer)}>
            <path
              d={`M ${calX + 128} ${calY + rowH + 14} L ${calX + 148} ${calY + rowH + 14} L ${calX + 148} ${calY + (rowH + 8) * 2 + rowH - 6} L ${calX + 128} ${calY + (rowH + 8) * 2 + rowH - 6}`}
              fill="none"
              stroke={PALETTE.cream}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <text x={calX + 162} y={calY + (rowH + 8) * 2 + 12} textAnchor="start" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream}>
              1-2 MO
            </text>
          </g>
        ) : null}

        <Dust t={t} seed={719} x0={0} y0={H * 0.2} w={W} h={ground - H * 0.2} n={28} o={0.42} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [tx, ty, tr * 1.9],
            [W * 0.5, ground - 150, W * 0.42],
          ]}
          o={0.26}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};

/** Horizontal timeline: gold ribbon with milestone tags and gliding cyan NOW marker. */
export const TimelineSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.5));
  const nowPos = clamp(numParam(sp.now, 0.5) + p * 0.03);
  const gTone = glowTone(sp.glow, 'gold');
  const vert = H > W;

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={26} raysO={0.14} />;
  }

  if (layer === 'mid') {
    const panShift = (0.5 - st) * (vert ? 60 : 120);
    const x0 = W * 0.11 + panShift;
    const x1 = W * 0.89 + panShift;
    const ty = vert ? H * 0.50 : H * 0.47;
    const nx = lerp(x0, x1, nowPos);
    const pulse = 0.55 + 0.45 * Math.sin(t * 0.18);

    const milestones = [
      { f: 0.05, label: 'APR 2001', up: true },
      { f: 0.24, label: 'OCT 2001', up: false },
      { f: 0.44, label: '2.5 YR', up: true },
      { f: 0.68, label: '2013', up: false },
      { f: 0.95, label: '2026', up: true },
    ];

    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#0F1224" rim={toneColor(gTone)} rimOpacity={0.55} />

        {/* Gold timeline rail */}
        <line x1={x0} y1={ty} x2={x1} y2={ty} stroke={OUT} strokeWidth={12} strokeLinecap="round" />
        <line x1={x0} y1={ty} x2={x1} y2={ty} stroke={PALETTE.gold} strokeWidth={6} strokeLinecap="round" />
        <line x1={x0} y1={ty} x2={nx} y2={ty} stroke={PALETTE.cyan} strokeWidth={4} strokeLinecap="round" opacity={0.85} />

        {/* Milestone dots and cream calendar tags */}
        {milestones.map((m, i) => {
          const mx = lerp(x0, x1, m.f);
          const dir = m.up ? -1 : 1;
          const tagY = ty + dir * (vert ? 54 : 62);
          const reached = nowPos >= m.f - 0.02;
          return (
            <g key={i}>
              <line x1={mx} y1={ty} x2={mx} y2={tagY - dir * 18} stroke={reached ? PALETTE.cyan : PALETTE.gold} strokeWidth={3} />
              <circle cx={mx} cy={ty} r={10} fill={reached ? PALETTE.cyan : PALETTE.gold} stroke={OUT} strokeWidth={3.5} />
              <rect x={mx - 58} y={tagY - 20} width={116} height={40} rx={8} fill={PALETTE.cream} stroke={OUT} strokeWidth={3.5} />
              <text x={mx} y={tagY + 7} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.pill}>
                {m.label}
              </text>
            </g>
          );
        })}

        {/* Gliding cyan NOW marker */}
        <g transform={`translate(${nx} ${ty})`}>
          <Glow x={0} y={0} r={54} kind="cool" o={0.6 * pulse} />
          <circle r={18 + 8 * pulse} fill="none" stroke={PALETTE.cyan} strokeWidth={2.5} opacity={0.45} />
          <polygon points="0,-24 16,0 0,24 -16,0" fill={PALETTE.cyan} stroke={OUT} strokeWidth={3.5} />
        </g>

        <Dust t={t} seed={811} x0={0} y0={H * 0.2} w={W} h={ground - H * 0.2} n={26} o={0.42} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [nx, ty, 320],
            [W * 0.5, ground - 150, W * 0.44],
          ]}
          o={0.26}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};

/** Four landing sites on a Mars globe: Phoenix, Spirit, Opportunity, Curiosity + circling orbiter. */
export const LandersSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const st = clamp(numParam(sp.t, 0.4));
  const send = clamp(numParam(sp.send, 0));
  const gTone = glowTone(sp.glow, 'cyan');
  const vert = H > W;

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={36} raysO={0.14} />;
  }

  if (layer === 'mid') {
    const gx = W * 0.46;
    const gy = vert ? H * 0.52 : H * 0.48;
    const gr = vert ? 175 : 226;
    const orbitRx = gr * 1.45;
    const orbitRy = gr * 0.44;
    const orbitAng = -0.35 + st * 0.8 + t * 0.015;
    const ox = gx + Math.cos(orbitAng) * orbitRx;
    const oy = gy - gr * 0.25 + Math.sin(orbitAng) * orbitRy;

    const sites = [
      { name: 'PHOENIX', dx: -0.22, dy: -0.64, lx: -175, ly: -32 },
      { name: 'SPIRIT', dx: -0.52, dy: 0.14, lx: -185, ly: -18 },
      { name: 'OPPORTUNITY', dx: 0.48, dy: 0.02, lx: 190, ly: -22 },
      { name: 'CURIOSITY', dx: 0.16, dy: 0.42, lx: 185, ly: 32 },
    ];

    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#0D1022" rim={toneColor(gTone)} rimOpacity={0.45} />

        {/* Orbital ellipse track */}
        <ellipse cx={gx} cy={gy - gr * 0.25} rx={orbitRx} ry={orbitRy} fill="none" stroke="#3F558A" strokeWidth={2.5} strokeDasharray="8 8" opacity={0.55} />

        {/* Rotating Mars globe */}
        <MarsDisc cx={gx} cy={gy} r={gr} rot={st + p * 0.05} id={id} />

        {/* Four landing site pins & sequential cyan relay beams */}
        {sites.map((s, i) => {
          const px = gx + s.dx * gr;
          const py = gy + s.dy * gr;
          const active = send > 0 ? clamp(send * 4 - i * 0.85) : 0;
          const beamPulse = (t * 0.03 + i * 0.25) % 1;
          const tagX = px + s.lx;
          const tagY = py + s.ly;
          const tw = s.name.length * 13 + 26;

          return (
            <g key={s.name}>
              {active > 0.05 ? (
                <g opacity={active}>
                  <line x1={px} y1={py} x2={ox} y2={oy} stroke={PALETTE.cyan} strokeWidth={8} opacity={0.22} />
                  <line x1={px} y1={py} x2={ox} y2={oy} stroke={PALETTE.cyan} strokeWidth={3.5} />
                  <circle cx={lerp(px, ox, beamPulse)} cy={lerp(py, oy, beamPulse)} r={5} fill={PALETTE.cream} />
                </g>
              ) : null}
              <line x1={px} y1={py} x2={tagX} y2={tagY} stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.75} />
              <circle cx={px} cy={py} r={9 + (active > 0.2 ? 4 * Math.sin(t * 0.2 + i) : 0)} fill={active > 0.2 ? PALETTE.cyan : PALETTE.gold} stroke={OUT} strokeWidth={3.5} />
              <rect x={tagX - tw * 0.5} y={tagY - 16} width={tw} height={32} rx={8} fill="#181C32" stroke={active > 0.2 ? PALETTE.cyan : PALETTE.cream} strokeWidth={3} />
              <text x={tagX} y={tagY + 6} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16} fill={PALETTE.cream}>
                {s.name}
              </text>
            </g>
          );
        })}

        {/* Tiny circling orbiter */}
        <Glow x={ox} y={oy} r={68} kind="cool" o={0.45} />
        <OrbiterGraphic x={ox} y={oy} scale={vert ? 0.44 : 0.52} angle={-12} t={t} gTone={gTone} />

        <Dust t={t} seed={907} x0={0} y0={H * 0.15} w={W} h={ground - H * 0.15} n={28} o={0.42} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [gx, gy, gr * 1.9],
            [W * 0.5, ground - 150, W * 0.42],
          ]}
          o={0.24}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};

/** Plain deep-navy SpaceBackdrop stage with slow tinted rays and almost no stars. */
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const gTone = glowTone(sp.glow, 'cyan');

  if (layer === 'far') {
    return <SpaceGridBg t={t} id={id} W={W} H={H} gTone={gTone} starsN={14} raysO={0.18} grid={false} />;
  }

  if (layer === 'mid') {
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.08);
    return (
      <g>
        <StageFloor ground={ground} W={W} fill="#0B0C1D" rim={toneColor(gTone)} rimOpacity={0.58} />
        <ellipse cx={W * 0.5} cy={ground + 10} rx={W * 0.34} ry={24} fill={toneColor(gTone)} opacity={0.16 * pulse} />
        <Dust t={t} seed={1013} x0={0} y0={H * 0.15} w={W} h={ground - H * 0.1} n={24} o={0.38} />
        <LightVeil
          id={`${id}veil`}
          lights={[[W * 0.5, H * 0.48, Math.min(W, H) * 0.55]]}
          o={0.32}
        />
      </g>
    );
  }

  return <EdgeSilhouettes W={W} H={H} ground={ground} t={t} />;
};
