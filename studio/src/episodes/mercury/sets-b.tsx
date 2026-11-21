import React from 'react';
import { clamp, lerp, rnd } from '../../engine/anim';
import { Glow } from '../../engine/light';
import { Rays, Stars, Bokeh } from '../../engine/kit';
import { BrandLabel, PALETTE, FONTS } from '../../brand';
import type { SetProps, Registry } from './render';
import {
  INK,
  GLOW_HEX,
  GLOW_KIND,
  shotProg,
  DeepCosmos,
  StageDeck,
  MidAtmosphere,
  EdgeSilhouettes,
  BepiStackArt,
  SimplePlanet,
} from './sets-common';

const DelaySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const backAmt = clamp(Number(sp.back ?? 0));
  const showClock = Number(sp.clock ?? 0) > 0.5;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={1201} starCount={95} rayX={W * 0.2} rayY={H * 0.35} rayColor={PALETTE.cyan} rayOpacity={0.09} glowKind="cool" glowOpacity={0.34} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const cy = vert ? ground - 455 : H * 0.46;
  const earthX = W * 0.17;
  const probeX = W * 0.83;
  const pulseX = lerp(earthX + 75 * u, probeX - 40 * u, clamp(prog + 0.08 * Math.sin(t / 18)));
  const returnX = lerp(probeX - 40 * u, earthX + 75 * u, clamp(backAmt));

  return (
    <g>
      {/* Plane 1: Faint signal distance ticks */}
      {[0.3, 0.45, 0.6, 0.75].map((fx, i) => (
        <line key={i} x1={W * fx} y1={cy - 18} x2={W * fx} y2={cy + 18} stroke="#283868" strokeWidth={2.5} />
      ))}

      {/* Plane 2: Cyan outbound line & Gold return beam */}
      <line x1={earthX + 68 * u} y1={cy} x2={probeX - 36 * u} y2={cy} stroke={PALETTE.cyan} strokeWidth={3.5} opacity={0.78} />
      {backAmt > 0.05 ? (
        <line x1={earthX + 68 * u} y1={cy + 22 * u} x2={probeX - 36 * u} y2={cy + 22 * u} stroke={PALETTE.gold} strokeWidth={3} strokeDasharray="8 8" opacity={0.78} />
      ) : null}

      {/* Outbound cyan pulse */}
      <Glow x={pulseX} y={cy} r={48 * u} kind="cool" o={0.85} />
      <circle cx={pulseX} cy={cy} r={10 * u} fill={PALETTE.cyan} stroke={INK} strokeWidth={2.5} />

      {/* Return gold pulse */}
      {backAmt > 0.05 ? (
        <g>
          <Glow x={returnX} y={cy + 22 * u} r={44 * u} kind="warm" o={0.8} />
          <circle cx={returnX} cy={cy + 22 * u} r={9 * u} fill={PALETTE.gold} stroke={INK} strokeWidth={2.5} />
        </g>
      ) : null}

      {/* Small blue Earth + Radio Dish on left */}
      <SimplePlanet x={earthX} y={cy} r={54 * u} fill="#2A7CE2" rim={PALETTE.cyan}>
        <path d={`M ${-22 * u} ${-18 * u} Q 0 ${-26 * u} ${12 * u} ${-6 * u} T ${-4 * u} ${22 * u} Z`} fill="#48B87A" />
      </SimplePlanet>
      <g transform={`translate(${earthX + 54 * u} ${cy})`}>
        <path d={`M 0 ${-22 * u} A ${22 * u} ${22 * u} 0 0 1 0 ${22 * u} Z`} fill="#DDE4F4" stroke={INK} strokeWidth={3.5} />
        <line x1={0} y1={0} x2={16 * u} y2={0} stroke={INK} strokeWidth={3} />
      </g>

      {/* Tiny Probe on right */}
      <g transform={`translate(${probeX} ${cy}) rotate(-90) scale(${0.36 * u})`}>
        <BepiStackArt id={`${id}dp`} t={t} wingSpan={140} />
      </g>

      {/* Stopwatch in the middle when clock = 1 */}
      {showClock ? (
        <g transform={`translate(${W * 0.5} ${cy - 95 * u})`}>
          <Glow x={0} y={0} r={64 * u} kind="warm" o={0.35} />
          <circle r={42 * u} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
          <rect x={-9 * u} y={-52 * u} width={18 * u} height={10 * u} rx={3} fill="#9BA6C0" stroke={INK} strokeWidth={3} />
          <line x1={0} y1={0} x2={Math.sin(t / 12) * 26 * u} y2={-Math.cos(t / 12) * 26 * u} stroke={PALETTE.orange} strokeWidth={4} strokeLinecap="round" />
          <circle r={4.5 * u} fill={INK} />
        </g>
      ) : null}

      <StageDeck id={id} ground={ground} W={W} H={H} fill="#10142A" rim={PALETTE.cyan} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={127} lights={[[earthX, cy, 320 * u], [pulseX, cy, 260 * u]]} veilOpacity={0.34} />
    </g>
  );
};

const TimelineSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.14);
  const now = clamp(Number(sp.now ?? 0.5));
  const glowKey = String(sp.glow ?? 'gold');
  const accent = glowKey === 'cyan' ? PALETTE.cyan : PALETTE.gold;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={1303} starCount={85} rayX={W * 0.5} rayY={H * 0.3} rayColor={accent} rayOpacity={0.1} glowKind={GLOW_KIND[glowKey]} glowOpacity={0.34} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const cy = vert ? ground - 455 : H * 0.48;
  const panOffset = (0.5 - prog) * 140 * u;
  const x0 = W * 0.12 + panOffset;
  const x1 = W * 0.88 + panOffset;
  const milestones: [number, string][] = [
    [0.05, '2018'],
    [0.28, '2024'],
    [0.48, 'DEC 25'],
    [0.72, 'NOV 26'],
    [0.92, 'APR 27'],
  ];
  const nowX = lerp(x0, x1, now);
  const pulseR = 14 + 10 * ((t % 24) / 24);

  return (
    <g>
      {/* Plane 1: Faint vertical grid behind milestones */}
      {milestones.map(([mf], idx) => {
        const mx = lerp(x0, x1, mf);
        return <line key={idx} x1={mx} y1={cy - 150 * u} x2={mx} y2={cy + 140 * u} stroke="#232D54" strokeWidth={2} strokeDasharray="6 10" />;
      })}

      {/* Plane 2: Gold timeline line + milestone dots + cream tags + cyan marker */}
      <line x1={x0} y1={cy} x2={x1} y2={cy} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <line x1={x0} y1={cy} x2={x1} y2={cy} stroke={PALETTE.gold} strokeWidth={5} strokeLinecap="round" />

      {milestones.map(([mf, lbl], idx) => {
        const mx = lerp(x0, x1, mf);
        const passed = mf <= now + 0.03;
        return (
          <g key={idx} transform={`translate(${mx} ${cy})`}>
            <circle r={12 * u} fill={passed ? accent : '#1C223B'} stroke={INK} strokeWidth={3.5} />
            <rect x={-44 * u} y={24 * u} width={88 * u} height={30 * u} rx={7} fill={PALETTE.cream} stroke={INK} strokeWidth={3} />
            <text y={44 * u} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={15 * u} fill={PALETTE.pill}>
              {lbl}
            </text>
          </g>
        );
      })}

      {/* Active gliding cyan marker */}
      <g transform={`translate(${nowX} ${cy})`}>
        <Glow x={0} y={0} r={55 * u} kind="cool" o={0.7} />
        <circle r={pulseR * u} fill="none" stroke={PALETTE.cyan} strokeWidth={3} opacity={1 - (t % 24) / 24} />
        <polygon points={`0,${-24 * u} ${14 * u},0 0,${24 * u} ${-14 * u},0`} fill={PALETTE.cyan} stroke={INK} strokeWidth={3.5} />
      </g>

      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101326" rim={accent} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={137} lights={[[nowX, cy, 420 * u]]} veilOpacity={0.34} />
    </g>
  );
};

const OrbitsSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.14);
  const showMPO = Number(sp.mpo ?? 0) > 0.2;
  const showMio = Number(sp.mio ?? 0) > 0.2;
  const split = Number(sp.split ?? 0) > 0.5;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={1409} starCount={110} rayX={W * 0.42} rayY={H * 0.44} rayColor={PALETTE.cyan} rayOpacity={0.09} glowKind="cool" glowOpacity={0.35} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const pull = lerp(1.06, 0.92, prog);
  const sc = (vert ? 0.78 : 1.0) * u * pull;
  const mercX = W * 0.4;
  const mercY = vert ? ground - 455 : H * 0.46;

  // Tight MPO cyan ellipse centered on Mercury
  const mpoRx = 110 * sc;
  const mpoRy = 76 * sc;
  const mpoAngle = t * 0.045;
  const mpoDotX = mercX + Math.cos(mpoAngle) * mpoRx;
  const mpoDotY = mercY + Math.sin(mpoAngle) * mpoRy;

  // Wide eccentric Mio gold ellipse with Mercury near left focus
  const mioRx = 310 * sc;
  const mioRy = 155 * sc;
  const mioCx = mercX + 190 * sc;
  const mioAngle = t * 0.018;
  const mioDotX = mioCx + Math.cos(mioAngle) * mioRx;
  const mioDotY = mercY + Math.sin(mioAngle) * mioRy;

  return (
    <g>
      {/* Plane 1: Faint polar coordinate rings */}
      <circle cx={mercX} cy={mercY} r={160 * sc} fill="none" stroke="#25325B" strokeWidth={2} strokeDasharray="6 10" />
      <circle cx={mercX} cy={mercY} r={340 * sc} fill="none" stroke="#25325B" strokeWidth={2} strokeDasharray="6 10" />

      {/* Plane 2: Mio Gold Ellipse & MPO Cyan Ellipse */}
      {showMio ? (
        <g>
          <ellipse cx={mioCx} cy={mercY} rx={mioRx} ry={mioRy} fill="none" stroke={INK} strokeWidth={8} />
          <ellipse cx={mioCx} cy={mercY} rx={mioRx} ry={mioRy} fill="none" stroke={PALETTE.gold} strokeWidth={4} />
          <Glow x={mioDotX} y={mioDotY} r={38 * sc} kind="warm" o={0.75} />
          <circle cx={mioDotX} cy={mioDotY} r={10 * sc} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />
        </g>
      ) : null}

      {showMPO ? (
        <g>
          <ellipse cx={mercX} cy={mercY} rx={mpoRx} ry={mpoRy} fill="none" stroke={INK} strokeWidth={8} />
          <ellipse cx={mercX} cy={mercY} rx={mpoRx} ry={mpoRy} fill="none" stroke={PALETTE.cyan} strokeWidth={4} />
          {split ? (
            <g>
              <Glow x={mpoDotX} y={mpoDotY} r={34 * sc} kind="cool" o={0.75} />
              <circle cx={mpoDotX} cy={mpoDotY} r={9 * sc} fill={PALETTE.cyan} stroke={INK} strokeWidth={3} />
            </g>
          ) : null}
        </g>
      ) : null}

      {/* Stacked pre-split indicator when split=0 */}
      {!split && showMio ? (
        <circle cx={mioDotX} cy={mioDotY} r={5 * sc} fill={PALETTE.cyan} />
      ) : null}

      {/* Central Polar Mercury */}
      <SimplePlanet x={mercX} y={mercY} r={44 * sc} fill="#878D9E" rim={PALETTE.cream}>
        <circle cx={-10 * sc} cy={-8 * sc} r={8 * sc} fill="#62687A" />
        <circle cx={12 * sc} cy={10 * sc} r={6 * sc} fill="#62687A" />
      </SimplePlanet>

      <StageDeck id={id} ground={ground} W={W} H={H} fill="#0F1326" rim={PALETTE.cyan} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={149} lights={[[mercX + 80 * sc, mercY, 520 * sc]]} veilOpacity={0.34} />
    </g>
  );
};

const XraySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.14);
  const slew = clamp(Number(sp.slew ?? 0));
  const count = Math.round(Number(sp.count ?? 0) * lerp(0.85, 1, p));

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={1511} starCount={85} rayX={W * 0.5} rayY={H * 0.45} rayColor="#A87EFF" rayOpacity={0.1} glowKind="cool" glowOpacity={0.34} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const step = Math.floor(p * 6);
  const jerkX = slew > 0.05 ? (rnd(44, step) - 0.5) * 32 * slew * u : 0;
  const jerkY = slew > 0.05 ? (rnd(55, step) - 0.5) * 26 * slew * u : 0;
  const cx = W * 0.5 + jerkX;
  const cy = (vert ? ground - 455 : H * 0.45) + jerkY;
  const R = (vert ? 168 : 198) * u;
  const dots = Math.floor(lerp(45, 185, prog));

  return (
    <g>
      <defs>
        <clipPath id={`${id}xclip`}>
          <circle cx={cx} cy={cy} r={R - 6} />
        </clipPath>
      </defs>

      {/* Plane 1: Instrument mounting bezel */}
      <circle cx={cx} cy={cy} r={R + 22 * u} fill="#1A1D33" stroke={INK} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={R} fill="#090717" stroke={INK} strokeWidth={4} />

      {/* Plane 2: Grainy X-ray Crab Nebula photon dots */}
      <g clipPath={`url(#${id}xclip)`}>
        <Glow x={cx} y={cy} r={R * (0.45 + prog * 0.25)} kind="cool" o={0.55} />
        {Array.from({ length: dots }).map((_, i) => {
          const spread = lerp(1.0, 0.52, prog);
          const angle = rnd(12, i) * Math.PI * 2;
          const dist = Math.pow(rnd(19, i), 1.4) * R * 0.78 * spread;
          const dx = cx + Math.cos(angle) * dist * 1.15;
          const dy = cy + Math.sin(angle) * dist * 0.85;
          const tw = 0.65 + 0.35 * Math.sin(t / 7 + i);
          return (
            <circle
              key={i}
              cx={dx}
              cy={dy}
              r={(1.8 + rnd(27, i) * 2.8) * u}
              fill={i % 4 === 0 ? '#FFFFFF' : i % 2 === 0 ? '#C9A8FF' : '#7D58FF'}
              opacity={tw}
            />
          );
        })}
        {/* Crosshair reticle */}
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#4C3E7A" strokeWidth={1.5} opacity={0.55} />
        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="#4C3E7A" strokeWidth={1.5} opacity={0.55} />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth={4} />

      {/* Slew tick counter pill integrated on bottom of detector rim */}
      <g transform={`translate(${cx} ${cy + R + 32 * u})`}>
        <rect x={-72 * u} y={-18 * u} width={144 * u} height={36 * u} rx={8} fill="#14182D" stroke={PALETTE.cyan} strokeWidth={3} />
        <text y={7 * u} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18 * u} fill={PALETTE.cyan}>
          {`SLEW ${count}`}
        </text>
      </g>

      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101224" rim="#B48EFF" translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={151} lights={[[cx, cy, R * 2.1]]} veilOpacity={0.34} />
    </g>
  );
};

const LabSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const alert = clamp(Number(sp.alert ?? 0));
  const ok = Number(sp.ok ?? 0) >= 0.5;

  const scrCol = ok ? PALETTE.green : alert > 0.1 ? PALETTE.orange : PALETTE.cyan;
  const blink = alert > 0.1 && !ok ? Math.sin(t / 5) > 0 : false;

  if (layer === 'far') {
    const wallY = vert ? ground - 640 : 180;
    const scrW = (vert ? 260 : 340) * u;
    const scrH = (vert ? 160 : 190) * u;
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#181D34" />
        {/* Wall of dark screens */}
        {[-1, 0, 1].map((slot) => {
          const sx = W * 0.5 + slot * (scrW + 32 * u);
          const isCenter = slot === 0;
          const border = isCenter && alert > 0.1 && !ok ? (blink ? PALETTE.red : PALETTE.orange) : scrCol;
          return (
            <g key={slot} transform={`translate(${sx} ${wallY + scrH * 0.5})`}>
              <rect x={-scrW / 2} y={-scrH / 2} width={scrW} height={scrH} rx={10} fill="#101424" stroke={INK} strokeWidth={4} />
              <rect x={-scrW / 2 + 8} y={-scrH / 2 + 8} width={scrW - 16} height={scrH - 16} rx={6} fill="#141C33" stroke={border} strokeWidth={2.5} />
              {isCenter ? (
                <g>
                  {/* World tracking map wave */}
                  <path d={`M ${-scrW * 0.4} 0 Q ${-scrW * 0.2} ${-40 * u} 0 0 T ${scrW * 0.4} 0`} fill="none" stroke={border} strokeWidth={3} />
                  <circle cx={Math.sin(t / 20) * scrW * 0.3} cy={Math.cos(t / 20) * 18 * u} r={6 * u} fill={PALETTE.cream} />
                  {alert > 0.1 && !ok ? (
                    <polygon points={`0,${-32 * u} ${26 * u},${18 * u} ${-26 * u},${18 * u}`} fill={blink ? PALETTE.orange : PALETTE.gold} stroke={INK} strokeWidth={3} />
                  ) : null}
                </g>
              ) : (
                <g>
                  {/* Cream charts */}
                  {[-32, -8, 16, 40].map((bx, k) => (
                    <rect key={k} x={bx * u - 8} y={(12 - ((k * 17 + Math.floor(t / 15)) % 45)) * u} width={14 * u} height={34 * u} fill={ok ? PALETTE.green : PALETTE.cream} opacity={0.75} />
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="console" />;

  // mid: Desk with two laptops, coffee mug, sticky note, and carpet GroundPlane at ground
  const deskX = W * 0.5;
  const deskW = (vert ? 560 : 720) * u;
  const deskTopY = ground - 140 * u;

  return (
    <g>
      {/* Plane 1: Lower wall bulkhead */}
      <rect x={-W} y={deskTopY - 40} width={W * 3} height={ground - deskTopY + 50} fill="#1D233D" />

      {/* Plane 2: Mission control desk + 2 laptops + coffee mug + sticky note */}
      <g transform={`translate(${deskX} ${deskTopY})`}>
        <rect x={-deskW * 0.44} y={14 * u} width={22 * u} height={ground - deskTopY - 12 * u} fill="#2A314F" stroke={INK} strokeWidth={4} />
        <rect x={deskW * 0.44 - 22 * u} y={14 * u} width={22 * u} height={ground - deskTopY - 12 * u} fill="#2A314F" stroke={INK} strokeWidth={4} />
        <rect x={-deskW / 2} y={0} width={deskW} height={24 * u} rx={5} fill="#505C82" stroke={INK} strokeWidth={4} />

        {/* Two Laptops */}
        {[-150, 80].map((lx, idx) => (
          <g key={idx} transform={`translate(${lx * u} 0)`}>
            <polygon points={`${-58 * u},0 ${58 * u},0 ${48 * u},${-68 * u} ${-48 * u},${-68 * u}`} fill="#27304D" stroke={INK} strokeWidth={4} />
            <rect x={-42 * u} y={-60 * u} width={84 * u} height={50 * u} rx={3} fill={ok ? '#1A3E36' : '#16203C'} stroke={scrCol} strokeWidth={2} />
            <line x1={-32 * u} y1={-40 * u} x2={26 * u} y2={-40 * u} stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.75} />
            <line x1={-32 * u} y1={-26 * u} x2={14 * u} y2={-26 * u} stroke={scrCol} strokeWidth={2.5} />
          </g>
        ))}

        {/* Cream Coffee Mug with rising steam */}
        <g transform={`translate(${215 * u} 0)`}>
          <rect x={-16 * u} y={-34 * u} width={32 * u} height={34 * u} rx={4} fill={PALETTE.cream} stroke={INK} strokeWidth={3.5} />
          <path d={`M ${16 * u} ${-26 * u} A ${9 * u} ${10 * u} 0 0 1 ${16 * u} ${-10 * u}`} fill="none" stroke={INK} strokeWidth={3.5} />
          <path d={`M -4 ${-42 * u} Q ${Math.sin(t / 9) * 6} ${-56 * u} 0 ${-70 * u}`} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.45} strokeLinecap="round" />
        </g>

        {/* Yellow Sticky Note */}
        <polygon points={`${-255 * u},10 ${-215 * u},10 ${-212 * u},${44 * u} ${-252 * u},${44 * u}`} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />
      </g>

      {/* Plane 3: Carpet GroundPlane with pale rim */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#232A45" rim="#A9BEEA" />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={163} lights={[[deskX, deskTopY - 120, 620 * u]]} veilOpacity={0.28} />
    </g>
  );
};

const DawnSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const showMark = Number(sp.mark ?? 0) > 0.5;
  const showVenus = Number(sp.venus ?? 0) > 0.5;

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <linearGradient id={`${id}dsky`} x1="0" y1={-H * 0.2} x2="0" y2={ground} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#090D24" />
            <stop offset="52%" stopColor={prog > 0.65 ? '#2B366B' : '#1E254D'} />
            <stop offset="82%" stopColor={prog > 0.65 ? '#D46E59' : '#A14E4E'} />
            <stop offset="100%" stopColor={prog > 0.65 ? '#FFD294' : '#E89B6E'} />
          </linearGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}dsky)`} />
        <Stars seed={1701} x0={-W * 0.5} y0={-H * 0.4} w={W * 2} h={ground * 0.72} t={t} n={70} o={0.55 - prog * 0.2} />
        <Glow x={W * 0.48} y={ground - 20} r={420 * u} kind="warm" o={0.35 + prog * 0.35} />
        <Rays x={W * 0.48} y={ground + 40} t={t} len={H * 1.1} n={12} o={0.09 + prog * 0.08} color="#FFE0A6" />
      </g>
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="rock" />;

  const mercX = W * 0.42;
  const mercY = vert ? ground - 360 : ground - 260;
  const venX = W * 0.68;
  const venY = vert ? ground - 580 : ground - 460;

  return (
    <g>
      {/* Plane 1: Dark distant hill ridge */}
      <path
        d={`M ${-W * 0.3} ${ground} L ${W * 0.18} ${ground - 90 * u} L ${W * 0.52} ${ground - 45 * u} L ${W * 0.85} ${ground - 105 * u} L ${W * 1.3} ${ground} Z`}
        fill="#191D33"
        stroke={INK}
        strokeWidth={3.5}
      />

      {/* Mercury low in the east + Cyan target ring */}
      <Glow x={mercX} y={mercY} r={34 * u} kind="warm" o={0.75} />
      <circle cx={mercX} cy={mercY} r={5.5 * u} fill="#FFF3D1" />
      {showMark ? (
        <g>
          <circle cx={mercX} cy={mercY} r={(19 + 4 * Math.sin(t / 8)) * u} fill="none" stroke={PALETTE.cyan} strokeWidth={3.5} />
          <line x1={mercX + 20 * u} y1={mercY - 14 * u} x2={mercX + 64 * u} y2={mercY - 40 * u} stroke={PALETTE.cyan} strokeWidth={2.5} />
          <BrandLabel x={mercX + 110 * u} y={mercY - 46 * u} t={t + 4} text="MERCURY" size={20 * u} color={PALETTE.cyan} />
        </g>
      ) : null}

      {/* Venus higher up and brighter */}
      <g>
        {showVenus ? <Glow x={venX} y={venY} r={95 * u} kind="warm" o={0.85} /> : null}
        <circle cx={venX} cy={venY} r={(showVenus ? 10 : 7) * u} fill="#FFF8E3" />
        {showVenus ? (
          <g stroke="#FFF8E3" strokeWidth={2.5} opacity={0.85}>
            <line x1={venX - 22 * u} y1={venY} x2={venX + 22 * u} y2={venY} />
            <line x1={venX} y1={venY - 22 * u} x2={venX} y2={venY + 22 * u} />
          </g>
        ) : null}
      </g>

      {/* Plane 2: Silhouetted small houses along the eastern hills */}
      {[0.24, 0.3, 0.74].map((hx, i) => {
        const px = W * hx;
        const hy = ground - (i === 1 ? 52 : 66) * u;
        return (
          <g key={i} transform={`translate(${px} ${hy})`}>
            <polygon points={`${-24 * u},${40 * u} ${-24 * u},0 0,${-20 * u} ${24 * u},0 ${24 * u},${40 * u}`} fill="#0C0E1C" stroke={INK} strokeWidth={3.5} />
            <rect x={-7 * u} y={8 * u} width={10 * u} height={10 * u} fill={PALETTE.gold} opacity={0.8} />
          </g>
        );
      })}

      {/* Plane 3: Dawn ground plane */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#121426" rim="#FFB87A" />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={173} lights={[[mercX, mercY, 360 * u], [W * 0.5, ground - 40, 520 * u]]} veilOpacity={0.25} />
    </g>
  );
};

const CrashSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const fuelRaw = clamp(Number(sp.fuel ?? 0.5));
  const empty = fuelRaw >= 0.95;
  const fuelLevel = empty ? Math.max(0, 0.08 * (1 - p * 1.4)) : clamp(fuelRaw - 0.12 * p);
  const blinkRed = empty && Math.sin(t / 4) > 0;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={1801} starCount={110} rayX={W * 0.75} rayY={ground - 60} rayColor="#FFE0A6" rayOpacity={0.11} glowKind="warm" glowOpacity={0.34} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="rock" />;

  const startX = W * 0.24;
  const startY = vert ? ground - 640 : H * 0.26;
  const endX = W * 0.78;
  const endY = vert ? ground - 260 : ground - 155 * u;
  const px = lerp(startX, endX, prog);
  const py = lerp(startY, endY, prog);

  const gaugeX = vert ? 105 : 140;
  const gaugeY = vert ? 425 : 275;

  return (
    <g>
      {/* Plane 1: Cratered Mercury horizon ridge */}
      <path
        d={`M ${-W * 0.3} ${ground} L ${W * 0.15} ${ground - 36 * u} L ${W * 0.38} ${ground - 14 * u} L ${W * 0.65} ${ground - 46 * u} L ${W * 0.88} ${ground - 18 * u} L ${W * 1.3} ${ground} Z`}
        fill="#393D4C"
        stroke={INK}
        strokeWidth={4}
      />
      <path
        d={`M ${W * 0.15} ${ground - 36 * u} L ${W * 0.38} ${ground - 14 * u} M ${W * 0.65} ${ground - 46 * u} L ${W * 0.88} ${ground - 18 * u}`}
        stroke="#FFE5A8"
        strokeWidth={3.5}
        opacity={0.78}
      />

      {/* Plane 2: Descending probe with lengthening gold trail */}
      <line x1={startX - 40 * u} y1={startY - 30 * u} x2={px} y2={py} stroke={PALETTE.gold} strokeWidth={5 * u} strokeLinecap="round" opacity={0.85} />
      <line x1={startX - 20 * u} y1={startY - 15 * u} x2={px} y2={py} stroke={PALETTE.cream} strokeWidth={2.5 * u} strokeLinecap="round" opacity={0.75} />
      <g transform={`translate(${px} ${py}) rotate(145) scale(${0.36 * u})`}>
        <BepiStackArt id={`${id}cr`} t={t} wingSpan={140} />
      </g>

      {/* Corner Fuel Gauge */}
      <g transform={`translate(${gaugeX} ${gaugeY})`}>
        {empty ? <Glow x={0} y={0} r={80 * u} kind="red" o={blinkRed ? 0.7 : 0.25} /> : null}
        <rect x={-54 * u} y={-24 * u} width={108 * u} height={48 * u} rx={9} fill="#14182D" stroke={blinkRed ? PALETTE.red : INK} strokeWidth={4} />
        <rect x={-44 * u} y={-12 * u} width={88 * u} height={16 * u} rx={4} fill="#090B17" stroke={INK} strokeWidth={2} />
        {fuelLevel > 0.01 ? (
          <rect x={-42 * u} y={-10 * u} width={84 * u * fuelLevel} height={12 * u} rx={3} fill={empty ? PALETTE.red : PALETTE.gold} />
        ) : null}
        <text y={18 * u} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={12 * u} fill={empty ? PALETTE.red : PALETTE.cream}>
          {empty ? 'FUEL EMPTY' : 'FUEL'}
        </text>
      </g>

      {/* Plane 3: Grey cratered Mercury floor */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#4D5263" rim="#FFE5A8" />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={181} lights={[[px, py, 360 * u], [W * 0.5, ground, 540 * u]]} veilOpacity={0.34} />
    </g>
  );
};

const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const u = Math.min(W, H) / 1080;
  const glowKey = String(sp.glow ?? 'gold');
  const col = GLOW_HEX[glowKey] ?? PALETTE.gold;
  const kind = GLOW_KIND[glowKey] ?? 'warm';
  const cx = W * 0.5;
  const cy = H > W ? ground - 455 : H * 0.45;

  if (layer === 'far') {
    return (
      <DeepCosmos
        id={id}
        t={t}
        W={W}
        H={H}
        seed={1907}
        starCount={24}
        rayX={cx}
        rayY={cy}
        rayColor={col}
        rayOpacity={0.14}
        glowKind={kind}
        glowOpacity={0.44}
      />
    );
  }
  if (layer === 'near') {
    return (
      <g>
        <Bokeh seed={19} n={8} x0={-80} y0={ground - 60} w={W + 160} h={340} t={t} o={0.14} />
        <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />
      </g>
    );
  }

  return (
    <g>
      {/* Plane 1: Faint slowly turning astrometry rings */}
      <g transform={`translate(${cx} ${cy}) rotate(${t * 0.08})`} opacity={0.22}>
        <circle r={240 * u} fill="none" stroke={col} strokeWidth={2.5} strokeDasharray="16 14" />
        <circle r={340 * u} fill="none" stroke={PALETTE.cream} strokeWidth={1.5} />
      </g>
      {/* Plane 2: Subtle perspective floor grid */}
      <g stroke={col} strokeWidth={2} opacity={0.18}>
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <line key={k} x1={cx + k * 140 * u} y1={ground} x2={cx + k * 280 * u} y2={ground + 260} />
        ))}
      </g>
      {/* Plane 3: GroundPlane */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101324" rim={col} />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={191} lights={[[cx, cy, 560 * u]]} veilOpacity={0.32} />
    </g>
  );
};

const InstrumentsSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const laser = clamp(Number(sp.laser ?? 0));
  const glowKey = String(sp.glow ?? 'gold');
  const col = glowKey === 'cyan' ? PALETTE.cyan : PALETTE.gold;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={2003} starCount={85} rayX={W * 0.35} rayY={H * 0.35} rayColor={col} rayOpacity={0.11} glowKind={GLOW_KIND[glowKey]} glowOpacity={0.36} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="console" />;

  const cy = vert ? ground - 455 : H * 0.45;
  const panelX = vert ? W * 0.34 : W * 0.36;
  const globeX = vert ? W * 0.72 : W * 0.74;
  const globeR = (vert ? 95 : 122) * u;
  const litCount = Math.round(prog * 11);

  const drawIcon = (idx: number, strokeCol: string) => {
    if (idx % 4 === 0) return <circle r={11 * u} fill="none" stroke={strokeCol} strokeWidth={2.8} />; // camera / xray
    if (idx % 4 === 1) return <line x1={-12 * u} y1={10 * u} x2={12 * u} y2={-10 * u} stroke={PALETTE.red} strokeWidth={3} />; // laser
    if (idx % 4 === 2) return <path d={`M ${-9 * u} ${-10 * u} L ${-9 * u} ${4 * u} A ${9 * u} ${9 * u} 0 0 0 ${9 * u} ${4 * u} L ${9 * u} ${-10 * u}`} fill="none" stroke={strokeCol} strokeWidth={3} />; // magnet
    return <polygon points={`0,${-12 * u} ${10 * u},${8 * u} ${-10 * u},${8 * u}`} fill="none" stroke={strokeCol} strokeWidth={2.8} />; // prism / spectrometer
  };

  const scanY = cy - globeR * 0.7 + ((t * 3.5) % (globeR * 1.4));

  return (
    <g>
      {/* Plane 1: Dark instrument bulkhead */}
      <rect
        x={panelX - (vert ? 165 : 235) * u}
        y={cy - (vert ? 145 : 130) * u}
        width={(vert ? 330 : 470) * u}
        height={(vert ? 290 : 260) * u}
        rx={16}
        fill="#151930"
        stroke={INK}
        strokeWidth={4}
      />

      {/* Plane 2: 11 outlined instrument tiles lighting up sequentially */}
      {Array.from({ length: 11 }).map((_, idx) => {
        const row = idx < 6 ? 0 : 1;
        const colIdx = idx < 6 ? idx - 2.5 : idx - 8;
        const stepX = (vert ? 50 : 72) * u;
        const tx = panelX + colIdx * stepX;
        const ty = cy + (row === 0 ? -48 : 48) * u;
        const tw = (vert ? 42 : 58) * u;
        const lit = idx < litCount;
        return (
          <g key={idx} transform={`translate(${tx} ${ty})`}>
            <rect x={-tw / 2} y={-tw / 2} width={tw} height={tw} rx={9} fill={lit ? col : '#202642'} stroke={INK} strokeWidth={3.5} />
            {drawIcon(idx, lit ? PALETTE.pill : PALETTE.cream)}
          </g>
        );
      })}

      {/* Grey Mercury globe scanned by thin red laser */}
      <SimplePlanet x={globeX} y={cy} r={globeR} fill="#7B8194" rim={col}>
        <circle cx={-25 * u} cy={-22 * u} r={18 * u} fill="#5C6275" />
        <circle cx={28 * u} cy={24 * u} r={14 * u} fill="#5C6275" />
      </SimplePlanet>

      {laser > 0.05 ? (
        <g>
          <Glow x={globeX} y={scanY} r={52 * u} kind="red" o={0.75 * laser} />
          <line x1={panelX + 165 * u} y1={cy - 48 * u} x2={globeX + globeR * 0.65} y2={scanY} stroke={PALETTE.red} strokeWidth={3.5} opacity={laser} />
          <line x1={globeX - globeR * 0.72} y1={scanY} x2={globeX + globeR * 0.72} y2={scanY} stroke="#FF8090" strokeWidth={4} opacity={laser} />
        </g>
      ) : null}

      <StageDeck id={id} ground={ground} W={W} H={H} fill="#11152A" rim={col} />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={209} lights={[[panelX, cy, 420 * u], [globeX, cy, 320 * u]]} veilOpacity={0.34} />
    </g>
  );
};

const MagfieldSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const sodium = clamp(Number(sp.sodium ?? 0.4));
  const glowKey = String(sp.glow ?? 'violet');
  const rayCol = glowKey === 'gold' ? PALETTE.gold : '#A478FF';

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={2101} starCount={100} rayX={W * 0.48} rayY={H * 0.44} rayColor={rayCol} rayOpacity={0.1} glowKind={glowKey === 'gold' ? 'warm' : 'cool'} glowOpacity={0.35} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const cx = W * 0.46;
  const cy = vert ? ground - 455 : H * 0.46;
  const r = (vert ? 72 : 86) * u;
  const bend = (18 + 14 * prog + 6 * Math.sin(t / 12)) * u;

  return (
    <g>
      {/* Plane 1: Pale-yellow Sodium Exosphere Haze trailing to the right */}
      {sodium > 0.05 ? (
        <g opacity={0.22 + sodium * 0.58}>
          <defs>
            <linearGradient id={`${id}sod`} x1={cx} y1={cy} x2={cx + 520 * u} y2={cy} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF09A" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#FFE066" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`M ${cx} ${cy - r * 0.9} Q ${cx + 260 * u} ${cy - r * (1.2 + sodium * 0.5)} ${cx + (340 + sodium * 220) * u} ${cy - r * 1.4} L ${cx + (340 + sodium * 220) * u} ${cy + r * 1.4} Q ${cx + 260 * u} ${cy + r * (1.2 + sodium * 0.5)} ${cx} ${cy + r * 0.9} Z`} fill={`url(#${id}sod)`} />
        </g>
      ) : null}

      {/* Plane 2: Looping violet magnetic field lines around Mercury */}
      {[-1, 1].map((sy) =>
        [1, 1.55, 2.2].map((mult, idx) => (
          <path
            key={`${sy}${idx}`}
            d={`M ${cx} ${cy + sy * r * 0.55} C ${cx - r * mult * 0.95} ${cy + sy * r * mult * 1.15}, ${cx + r * mult * 1.2 + bend * mult} ${cy + sy * r * mult * 1.35}, ${cx + bend * 0.5} ${cy + sy * r * 0.72}`}
            fill="none"
            stroke="#A678FF"
            strokeWidth={3.2}
            opacity={0.75 - idx * 0.14}
          />
        )),
      )}

      {/* Stream of yellow solar-wind dots hitting from the left */}
      {Array.from({ length: 30 }).map((_, i) => {
        const speed = 4.2 + rnd(3, i) * 3;
        const sx = ((t * speed + rnd(7, i) * W) % (W * 0.9)) + W * 0.02;
        const lane = (rnd(11, i) - 0.5) * 380 * u;
        const distC = sx - cx;
        const deflect = distC > -180 * u && distC < 160 * u ? Math.sign(lane || 1) * (1 - Math.abs(distC) / (180 * u)) * 85 * u : 0;
        const sy = cy + lane + deflect;
        return <circle key={i} cx={sx} cy={sy} r={(2.5 + rnd(13, i) * 2) * u} fill="#FFE27A" opacity={0.82} />;
      })}

      {/* Central Mercury */}
      <SimplePlanet x={cx} y={cy} r={r} fill="#7E8496" rim={PALETTE.gold}>
        <circle cx={-18 * u} cy={-14 * u} r={14 * u} fill="#5C6275" />
        <circle cx={20 * u} cy={18 * u} r={11 * u} fill="#5C6275" />
      </SimplePlanet>

      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101326" rim={rayCol} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={219} lights={[[cx, cy, 480 * u]]} veilOpacity={0.34} />
    </g>
  );
};

export const SETS_B: Registry['sets'] = {
  delay: DelaySet,
  timeline: TimelineSet,
  orbits: OrbitsSet,
  xray: XraySet,
  lab: LabSet,
  dawn: DawnSet,
  crash: CrashSet,
  void: VoidSet,
  instruments: InstrumentsSet,
  magfield: MagfieldSet,
};
