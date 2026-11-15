import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { clamp, lerp, easeOut, backOut, rnd } from '../../engine/anim';
import { Stars, Rays, Sun } from '../../engine/kit';
import { Glow, LightVeil, Dust } from '../../engine/light';
import type { SetProps } from './render';
import { StageDeck, TwinCraftDot } from './sets-a';

const OUT = '#121019';

/** Outlined Earth or Mars planet disc for orbital diagrams. */
const PlanetDot: React.FC<{
  x: number;
  y: number;
  r: number;
  kind: 'earth' | 'mars';
  t: number;
  label?: string;
}> = ({ x, y, r, kind, t, label }) => {
  const isEarth = kind === 'earth';
  const fill = isEarth ? '#1F6CA8' : '#D45230';
  const patchFill = isEarth ? '#32A87A' : '#8E2D1A';
  const rim = isEarth ? '#D5DCF0' : '#FFD0B2';
  const drift = Math.sin(t * 0.04) * (r * 0.12);
  return (
    <g transform={`translate(${x} ${y})`}>
      <Glow x={0} y={0} r={r * 2.4} kind={isEarth ? 'cool' : 'warm'} o={0.45} />
      <circle r={r} fill={fill} stroke={OUT} strokeWidth={3.5} />
      <path
        d={`M ${-r * 0.45 + drift} ${-r * 0.25} Q ${drift} ${-r * 0.55} ${r * 0.35 + drift} ${-r * 0.1} Q ${r * 0.2} ${r * 0.35} ${-r * 0.3 + drift} ${r * 0.25} Z`}
        fill={patchFill}
        stroke={OUT}
        strokeWidth={2.5}
        opacity={0.9}
      />
      <path d={`M ${-r * 0.72} ${-r * 0.65} A ${r} ${r} 0 0 1 ${r * 0.65} ${-r * 0.72}`} fill="none" stroke={rim} strokeWidth={3} opacity={0.8} />
      {label ? (
        <text y={r + 24} textAnchor="middle" fontFamily={FONTS.ui} fontSize={18} fill={PALETTE.cream} letterSpacing={2}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// 5. SUNSIDE: Solar-system diagram, top view (opposite | aligned | flight)
// ---------------------------------------------------------------------------
export const SunsideSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const view = String(sp.view ?? 'opposite');
  const tPhase = clamp(Number(sp.t ?? 0.5));
  const cx = 0.5 * W;
  const cy = vert ? 0.53 * H : 0.45 * H;
  const earthR = vert ? 185 : 195;
  const marsR = vert ? 310 : 340;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={PALETTE.space} />
        <Stars seed={307} x0={-900} y0={-1000} w={W + 1800} h={H + 1400} t={t} n={100} o={0.86} />
        <Glow x={cx} y={cy} r={380} kind="warm" o={0.45} />
        <Rays x={cx} y={cy} t={t} len={1600} n={12} o={0.11} color="#FFE2B0" />
      </g>
    );
  }

  if (layer === 'mid') {
    const u = clamp(tPhase + (p - 0.5) * 0.16);
    const pop = backOut(clamp(p / 0.35));

    // Angles in degrees (0 = right, 90 = down)
    let earthDeg = -140;
    let marsDeg = 20;
    if (view === 'opposite') {
      earthDeg = lerp(172, 194, u);
      marsDeg = lerp(-8, 14, u);
    } else if (view === 'aligned') {
      earthDeg = lerp(-48, -28, u);
      marsDeg = lerp(-32, -16, u);
    } else {
      earthDeg = -145;
      marsDeg = 18;
    }

    const toXY = (r: number, deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };
    const ePos = toXY(earthR, earthDeg);
    const mPos = toXY(marsR, marsDeg);

    // Flight Bezier control point sweeping clockwise around Sun
    const fCtrl = toXY((earthR + marsR) * 0.62, -62);
    const fPt = (s: number) => {
      const m = 1 - s;
      return {
        x: m * m * ePos.x + 2 * m * s * fCtrl.x + s * s * mPos.x,
        y: m * m * ePos.y + 2 * m * s * fCtrl.y + s * s * mPos.y,
        dx: 2 * m * (fCtrl.x - ePos.x) + 2 * s * (mPos.x - fCtrl.x),
        dy: 2 * m * (fCtrl.y - ePos.y) + 2 * s * (mPos.y - fCtrl.y),
      };
    };
    const craft = fPt(u);
    const craftAng = (Math.atan2(craft.dy, craft.dx) * 180) / Math.PI;

    return (
      <g>
        <StageDeck ground={ground} rim={view === 'opposite' ? '#FF8F80' : '#96E8D8'} o={0.5} />

        {/* Dashed cream orbit rings */}
        <circle
          cx={cx}
          cy={cy}
          r={earthR}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={3}
          strokeDasharray="12 10"
          strokeDashoffset={-t * 0.35}
          opacity={0.44}
        />
        <circle
          cx={cx}
          cy={cy}
          r={marsR}
          fill="none"
          stroke={PALETTE.cream}
          strokeWidth={3}
          strokeDasharray="12 10"
          strokeDashoffset={-t * 0.22}
          opacity={0.4}
        />

        {/* Sun at centre */}
        <Sun x={cx} y={cy} r={38} t={t} rays={false} />
        <circle cx={cx} cy={cy} r={38} fill="none" stroke={OUT} strokeWidth={3.5} />

        {/* Variant overlays */}
        {view === 'opposite' ? (
          <g>
            <line
              x1={ePos.x}
              y1={ePos.y}
              x2={mPos.x}
              y2={mPos.y}
              stroke={PALETTE.red}
              strokeWidth={4}
              strokeDasharray="10 8"
              opacity={0.85}
            />
            <g transform={`translate(${cx} ${cy - 76}) scale(${pop})`}>
              <Glow x={0} y={0} r={65} kind="red" o={0.55} />
              <circle r={30} fill="#1E1B2E" stroke={OUT} strokeWidth={4} />
              <path d="M -13 -13 L 13 13 M 13 -13 L -13 13" stroke={PALETTE.red} strokeWidth={6} strokeLinecap="round" />
            </g>
          </g>
        ) : null}

        {view === 'aligned' ? (
          <g>
            <line x1={ePos.x} y1={ePos.y} x2={mPos.x} y2={mPos.y} stroke={PALETTE.green} strokeWidth={4} opacity={0.85} />
            <g transform={`translate(${(ePos.x + mPos.x) / 2 + 56} ${(ePos.y + mPos.y) / 2 - 44}) scale(${pop})`}>
              <Glow x={0} y={0} r={65} kind="cool" o={0.45} />
              <circle r={30} fill="#1E1B2E" stroke={OUT} strokeWidth={4} />
              <path d="M -13 1 L -4 11 L 14 -10" fill="none" stroke={PALETTE.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        ) : null}

        {view === 'flight' ? (
          <g>
            <path
              d={`M ${ePos.x} ${ePos.y} Q ${fCtrl.x} ${fCtrl.y} ${mPos.x} ${mPos.y}`}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={4.5}
              strokeDasharray="10 8"
              opacity={0.78}
            />
            <TwinCraftDot x={craft.x} y={craft.y} angleDeg={craftAng} scale={0.85} burn={0} t={t} />
          </g>
        ) : null}

        <PlanetDot x={ePos.x} y={ePos.y} r={24} kind="earth" t={t} label="EARTH" />
        <PlanetDot x={mPos.x} y={mPos.y} r={20} kind="mars" t={t} label="MARS" />
      </g>
    );
  }

  return (
    <g>
      <LightVeil id={`${id}veil`} lights={[[cx, cy, 560]]} o={0.36} />
      <Dust t={t} seed={319} x0={0} y0={120} w={W} h={ground - 60} n={28} o={0.42} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 6. LOITER: Earth + L2 kidney-bean loop + magnetotail windsock
// ---------------------------------------------------------------------------
export const LoiterSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const tLoop = clamp(Number(sp.t ?? 0.5));
  const zoomAmt = clamp(Number(sp.zoom ?? 0));
  const cy = vert ? 0.54 * H : 0.46 * H;
  const earthX = vert ? 0.22 * W : 0.26 * W;
  const l2X = vert ? 0.63 * W : 0.64 * W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={PALETTE.space} />
        <Stars seed={401} x0={-900} y0={-1000} w={W + 1800} h={H + 1400} t={t} n={105} o={0.88} />
        {/* Sun far off-left as a faint golden glow */}
        <Glow x={-90} y={cy} r={460} kind="warm" o={0.48} />
        <Rays x={-90} y={cy} t={t} len={1700} n={12} o={0.08} color="#FFE2B0" />
      </g>
    );
  }

  if (layer === 'mid') {
    const zScale = 1 + zoomAmt * 0.45 * (0.94 + 0.06 * easeOut(p));
    const rx = vert ? 150 : 185;
    const ry = vert ? 132 : 148;

    // Parametric kidney-bean loop around L2: u=0 near Earth (left), u=0.5 far side (right), u=1 back at Earth
    const beanPt = (u: number) => {
      const a = u * Math.PI * 2 + Math.PI;
      return {
        x: l2X + rx * Math.cos(a) - 42 * Math.cos(2 * a),
        y: cy + ry * Math.sin(a) + 18 * Math.sin(2 * a),
      };
    };

    const beanD = Array.from({ length: 65 })
      .map((_, i) => {
        const pt = beanPt(i / 64);
        return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ') + ' Z';

    const uNow = (tLoop + p * 0.08) % 1;
    const craft = beanPt(uNow);
    const next = beanPt((uNow + 0.015) % 1);
    const craftAng = (Math.atan2(next.y - craft.y, next.x - craft.x) * 180) / Math.PI;

    // Active breadcrumb trail along the kidney-bean loop
    const trailSteps = 28;
    const trailD = Array.from({ length: trailSteps + 1 })
      .map((_, i) => {
        const pt = beanPt((i / trailSteps) * Math.max(0.02, uNow));
        return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <g>
        <StageDeck ground={ground} rim="#8AD8EC" o={0.48} />
        <g transform={`translate(${l2X} ${cy}) scale(${zScale}) translate(${-l2X} ${-cy})`}>
          {/* Earth's stretched magnetotail "windsock" streaming rightward */}
          <g opacity={0.34}>
            <path
              d={`M ${earthX} ${cy - 68} C ${earthX + 260} ${cy - 125}, ${l2X + 120} ${cy - 175}, ${W + 400} ${cy - 210} L ${W + 400} ${cy + 210} C ${l2X + 120} ${cy + 175}, ${earthX + 260} ${cy + 125}, ${earthX} ${cy + 68} Z`}
              fill="#23487A"
            />
            {[-1, 0, 1].map((k) => {
              const wave = Math.sin(t * 0.08 + k * 1.4) * 14;
              return (
                <path
                  key={k}
                  d={`M ${earthX + 40} ${cy + k * 34} Q ${l2X} ${cy + k * 95 + wave} ${W + 300} ${cy + k * 125 - wave}`}
                  fill="none"
                  stroke="#68E8FF"
                  strokeWidth={2}
                  strokeDasharray="14 12"
                  strokeDashoffset={-t * 1.4}
                  opacity={0.55}
                />
              );
            })}
          </g>

          {/* Earth-to-L2 axis */}
          <line x1={earthX + 68} y1={cy} x2={l2X} y2={cy} stroke={PALETTE.gold} strokeWidth={2.5} strokeDasharray="6 8" opacity={0.62} />

          {/* Gold-dotted L2 marker */}
          <g transform={`translate(${l2X} ${cy})`}>
            <Glow x={0} y={0} r={75} kind="warm" o={0.35} />
            <circle r={16 + 3 * Math.sin(t * 0.14)} fill="none" stroke={PALETTE.gold} strokeWidth={3} strokeDasharray="4 5" />
            <circle r={5} fill={PALETTE.gold} />
            <text y={38} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.gold} letterSpacing={2}>
              L2
            </text>
          </g>

          {/* Kidney-bean loop */}
          <path d={beanD} fill="none" stroke="#2FB7A6" strokeWidth={4} strokeDasharray="10 8" opacity={0.55} />
          <path d={trailD} fill="none" stroke={PALETTE.cyan} strokeWidth={4.5} strokeLinecap="round" opacity={0.9} />

          {/* Twin spacecraft travelling the kidney-bean loop */}
          <TwinCraftDot x={craft.x} y={craft.y} angleDeg={craftAng} scale={0.82} burn={0} t={t} />

          {/* Earth disc at left */}
          <PlanetDot x={earthX} y={cy} r={62} kind="earth" t={t} label="EARTH" />
        </g>
      </g>
    );
  }

  return (
    <g>
      <LightVeil
        id={`${id}veil`}
        lights={[
          [earthX, cy, 420],
          [l2X, cy, 480],
        ]}
        o={0.36}
      />
      <Dust t={t} seed={409} x0={0} y0={120} w={W} h={ground - 60} n={30} o={0.44} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 7. CRUISE: Transfer-orbit diagram from Earth to Mars
// ---------------------------------------------------------------------------
export const CruiseSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const tArc = clamp(Number(sp.t ?? 0.5));
  const hasMonths = sp.months !== undefined;
  const monthsTarget = Number(sp.months ?? 0);
  const sunX = vert ? 0.18 * W : 0.24 * W;
  const sunY = vert ? 0.55 * H : 0.52 * H;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={PALETTE.space} />
        <Stars seed={503} x0={-900} y0={-1000} w={W + 1800} h={H + 1400} t={t} n={95} o={0.85} />
        <Glow x={sunX} y={sunY} r={420} kind="warm" o={0.5} />
        <Rays x={sunX} y={sunY} t={t} len={1750} n={14} o={0.12} color="#FFE2B0" />
        {/* Faint radial solar wind particles streaming out from the Sun */}
        {Array.from({ length: 22 }).map((_, i) => {
          const ang = lerp(-0.55, 0.5, rnd(511, i));
          const dist = 120 + (((t * 3.8 + rnd(512, i) * 900) % 1200));
          const px = sunX + Math.cos(ang) * dist;
          const py = sunY + Math.sin(ang) * dist;
          return (
            <line
              key={i}
              x1={px}
              y1={py}
              x2={px + Math.cos(ang) * 26}
              y2={py + Math.sin(ang) * 26}
              stroke="#FFE48F"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.42 * (1 - dist / 1400)}
            />
          );
        })}
      </g>
    );
  }

  if (layer === 'mid') {
    const rEarth = vert ? 240 : 340;
    const rMars = vert ? 590 : 880;
    const eAng = -0.62;
    const mAng = -0.05;
    const ePos = { x: sunX + rEarth * Math.cos(eAng), y: sunY + rEarth * Math.sin(eAng) };
    const mPos = { x: sunX + rMars * Math.cos(mAng), y: sunY + rMars * Math.sin(mAng) };
    const ctrl = { x: sunX + (rEarth + rMars) * 0.56, y: sunY - (vert ? 260 : 350) };

    const arcPt = (u: number) => {
      const m = 1 - u;
      return {
        x: m * m * ePos.x + 2 * m * u * ctrl.x + u * u * mPos.x,
        y: m * m * ePos.y + 2 * m * u * ctrl.y + u * u * mPos.y,
        dx: 2 * m * (ctrl.x - ePos.x) + 2 * u * (mPos.x - ctrl.x),
        dy: 2 * m * (ctrl.y - ePos.y) + 2 * u * (mPos.y - ctrl.y),
      };
    };

    const uNow = clamp(tArc + (p - 0.5) * 0.12);
    const craft = arcPt(uNow);
    const craftAng = (Math.atan2(craft.dy, craft.dx) * 180) / Math.PI;
    const trailD = Array.from({ length: 21 })
      .map((_, i) => {
        const pt = arcPt((i / 20) * uNow);
        return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ');
    const shownMonth = Math.round(lerp(Math.max(0, monthsTarget - 1), monthsTarget, easeOut(p)));

    return (
      <g>
        <StageDeck ground={ground} rim="#9FD8EA" o={0.48} />
        <Sun x={sunX} y={sunY} r={44} t={t} rays={false} />
        <circle cx={sunX} cy={sunY} r={44} fill="none" stroke={OUT} strokeWidth={3.5} />

        {/* Earth & Mars orbital rings */}
        <circle cx={sunX} cy={sunY} r={rEarth} fill="none" stroke={PALETTE.cream} strokeWidth={3} strokeDasharray="12 10" opacity={0.42} />
        <circle cx={sunX} cy={sunY} r={rMars} fill="none" stroke={PALETTE.cream} strokeWidth={3} strokeDasharray="12 10" opacity={0.4} />

        {/* Full curved transfer arc + month milestone dots */}
        <path d={`M ${ePos.x} ${ePos.y} Q ${ctrl.x} ${ctrl.y} ${mPos.x} ${mPos.y}`} fill="none" stroke="#2FB7A6" strokeWidth={4} strokeDasharray="10 8" opacity={0.5} />
        {Array.from({ length: 9 }).map((_, k) => {
          const mp = arcPt((k + 1) / 10);
          return <circle key={k} cx={mp.x} cy={mp.y} r={3.5} fill={PALETTE.cream} opacity={0.55} />;
        })}
        <path d={trailD} fill="none" stroke={PALETTE.cyan} strokeWidth={5} strokeLinecap="round" opacity={0.92} />

        {/* Twin spacecraft on arc */}
        <TwinCraftDot x={craft.x} y={craft.y} angleDeg={craftAng} scale={0.9} burn={0} t={t} />

        {/* Month ticker badge on the arc */}
        {hasMonths ? (
          <g transform={`translate(${craft.x} ${craft.y - 46})`}>
            <rect x={-72} y={-20} width={144} height={36} rx={10} fill={PALETTE.pill} opacity={0.9} stroke={PALETTE.cyan} strokeWidth={2.5} />
            <text y={6} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cyan} letterSpacing={1.5}>
              {`MO ${shownMonth}/10`}
            </text>
          </g>
        ) : null}

        <PlanetDot x={ePos.x} y={ePos.y} r={24} kind="earth" t={t} label="EARTH" />
        <PlanetDot x={mPos.x} y={mPos.y} r={22} kind="mars" t={t} label="MARS" />
      </g>
    );
  }

  return (
    <g>
      <LightVeil id={`${id}veil`} lights={[[sunX + 260, sunY - 80, 650]]} o={0.36} />
      <Dust t={t} seed={523} x0={0} y0={120} w={W} h={ground - 60} n={28} o={0.44} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// 8. MARS: Mars close-up + orbit rings + solar wind stripping
// ---------------------------------------------------------------------------
export const MarsSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const orbit = clamp(Number(sp.orbit ?? 0));
  const wind = clamp(Number(sp.wind ?? 0));
  const mx = vert ? 0.56 * W : 0.54 * W;
  const my = vert ? 0.55 * H : 0.46 * H;
  const mr = vert ? 185 : 210;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1400} y={-1400} width={4800} height={4400} fill={PALETTE.space} />
        <Stars seed={607} x0={-900} y0={-1000} w={W + 1800} h={H + 1400} t={t} n={110} o={0.88} />
        {/* Faint distant sun glare from the left */}
        <Glow x={-40} y={my - 80} r={340} kind="warm" o={0.28 + wind * 0.22} />
      </g>
    );
  }

  if (layer === 'mid') {
    const orbitCraftPt = (rx: number, ry: number, tiltDeg: number, phase: number) => {
      const th = phase * Math.PI * 2;
      const lx = rx * Math.cos(th);
      const ly = ry * Math.sin(th);
      const tr = (tiltDeg * Math.PI) / 180;
      return {
        x: mx + lx * Math.cos(tr) - ly * Math.sin(tr),
        y: my + lx * Math.sin(tr) + ly * Math.cos(tr),
      };
    };

    const innerAng = -16;
    const outerAng = 14;
    const innerPhase = orbit + t * 0.008;
    const outerPhase = orbit * 0.8 + 0.4 + t * 0.005;
    const c1 = orbitCraftPt(mr * 1.48, mr * 0.62, innerAng, innerPhase);
    const c2 = orbitCraftPt(mr * 1.98, mr * 0.88, outerAng, outerPhase);
    const windCount = Math.round(wind * 28);
    const stripCount = Math.round(wind * 12);

    return (
      <g>
        <defs>
          <clipPath id={`${id}marsClip`}>
            <circle cx={mx} cy={my} r={mr} />
          </clipPath>
        </defs>
        <StageDeck ground={ground} rim="#F4A882" o={0.48} />

        {/* Back halves of orbit ellipses */}
        {orbit > 0.02 ? (
          <g opacity={easeOut(clamp(orbit * 2))}>
            <ellipse
              cx={mx}
              cy={my}
              rx={mr * 1.48}
              ry={mr * 0.62}
              transform={`rotate(${innerAng} ${mx} ${my})`}
              fill="none"
              stroke="#2FB7A6"
              strokeWidth={3.5}
              strokeDasharray="10 8"
              strokeDashoffset={-t * 0.6}
              opacity={0.75}
            />
            {orbit >= 0.45 ? (
              <ellipse
                cx={mx}
                cy={my}
                rx={mr * 1.98}
                ry={mr * 0.88}
                transform={`rotate(${outerAng} ${mx} ${my})`}
                fill="none"
                stroke={PALETTE.cyan}
                strokeWidth={3}
                strokeDasharray="12 10"
                strokeDashoffset={t * 0.45}
                opacity={0.58}
              />
            ) : null}
          </g>
        ) : null}

        {/* Thin atmosphere glow */}
        <Glow x={mx} y={my} r={mr * 1.55} kind="warm" o={0.42} />
        <circle cx={mx} cy={my} r={mr + 14} fill="none" stroke="#FFA97A" strokeWidth={6} opacity={0.22 + (1 - wind) * 0.16} />

        {/* Mars disc */}
        <circle cx={mx} cy={my} r={mr} fill="#D45230" stroke={OUT} strokeWidth={4} />
        <g clipPath={`url(#${id}marsClip)`}>
          {/* Basaltic dark outlined regions */}
          <path
            d={`M ${mx - mr * 0.55} ${my - mr * 0.25} Q ${mx - mr * 0.1} ${my - mr * 0.5} ${mx + mr * 0.25} ${my - mr * 0.15} Q ${mx + mr * 0.1} ${my + mr * 0.25} ${mx - mr * 0.42} ${my + mr * 0.12} Z`}
            fill="#922E1A"
            stroke={OUT}
            strokeWidth={3.5}
          />
          <circle cx={mx + mr * 0.28} cy={my + mr * 0.32} r={mr * 0.22} fill="#9C341E" stroke={OUT} strokeWidth={3.5} />
          <circle cx={mx - mr * 0.38} cy={my + mr * 0.45} r={mr * 0.14} fill="#A33B22" stroke={OUT} strokeWidth={3} />
          {/* Tiny cream north polar cap */}
          <ellipse cx={mx - mr * 0.08} cy={my - mr * 0.86} rx={mr * 0.34} ry={mr * 0.12} fill={PALETTE.cream} stroke={OUT} strokeWidth={3} />
          {/* Night-side shadow crescent */}
          <path
            d={`M ${mx + mr * 0.25} ${my - mr} A ${mr} ${mr} 0 0 1 ${mx + mr * 0.25} ${my + mr} A ${mr * 0.85} ${mr} 0 0 0 ${mx + mr * 0.25} ${my - mr} Z`}
            fill="#3B100A"
            opacity={0.45}
          />
        </g>
        {/* Pale rim highlight */}
        <path
          d={`M ${mx - mr * 0.82} ${my - mr * 0.56} A ${mr} ${mr} 0 0 1 ${mx + mr * 0.25} ${my - mr * 0.96}`}
          fill="none"
          stroke="#FFD4BA"
          strokeWidth={4}
          opacity={0.85}
        />

        {/* Solar wind bow shock & particles bending around Mars */}
        {wind > 0.02 ? (
          <g>
            <path
              d={`M ${mx - mr * 0.2} ${my - mr * 1.48} Q ${mx - mr * 1.65} ${my} ${mx - mr * 0.2} ${my + mr * 1.48}`}
              fill="none"
              stroke="#FFE48F"
              strokeWidth={3}
              strokeDasharray="10 10"
              opacity={0.38 * wind}
            />
            {Array.from({ length: windCount }).map((_, i) => {
              const frac = ((t * 0.028 + rnd(611, i)) % 1);
              const px = lerp(mx - mr * 2.5, mx + mr * 2.3, frac);
              const baseY = my + (rnd(612, i) - 0.5) * mr * 2.5;
              const dx = px - mx;
              const dy = baseY - my;
              const dist = Math.hypot(dx, dy);
              const deflect = dist < mr * 1.65 ? (mr * 1.65 - dist) * (dy >= 0 ? 0.65 : -0.65) : 0;
              const py = baseY + deflect;
              return (
                <line
                  key={i}
                  x1={px - 22}
                  y1={py}
                  x2={px}
                  y2={py + (dy >= 0 ? 3 : -3) * (deflect !== 0 ? 1 : 0)}
                  stroke="#FFE696"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  opacity={Math.sin(frac * Math.PI) * 0.85}
                />
              );
            })}
            {/* Stripped atmospheric ghost tail peeling away from top/wake */}
            {Array.from({ length: stripCount }).map((_, i) => {
              const age = ((t * 0.022 + rnd(620, i)) % 1);
              const sx = mx + age * mr * 2.3;
              const sy = my - mr * (0.85 + 0.3 * rnd(621, i)) - age * 55 + Math.sin(t * 0.1 + i) * 10;
              return (
                <path
                  key={i}
                  d={`M ${sx - 28} ${sy + 4} Q ${sx} ${sy - 6} ${sx + 28} ${sy + 2}`}
                  fill="none"
                  stroke={i % 2 ? '#98E8FF' : '#FFC49C'}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={(1 - age) * 0.55 * wind}
                />
              );
            })}
          </g>
        ) : null}

        {/* Orbiting spacecraft dots */}
        {orbit > 0.02 ? <TwinCraftDot x={c1.x} y={c1.y} angleDeg={innerAng} scale={0.78} burn={0} t={t} /> : null}
        {orbit >= 0.45 ? <TwinCraftDot x={c2.x} y={c2.y} angleDeg={outerAng} scale={0.72} burn={0} t={t} /> : null}
      </g>
    );
  }

  return (
    <g>
      <LightVeil id={`${id}veil`} lights={[[mx, my, 580]]} o={0.34} />
      <Dust t={t} seed={631} x0={0} y0={120} w={W} h={ground - 60} n={32} o={0.42 + wind * 0.25} />
    </g>
  );
};
