import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { Glow } from '../../engine/light';
import { clamp, lerp, easeInOut, backOut, rnd } from '../../engine/anim';
import type { SetProps } from './render';
import { FarSpaceBackdrop, MidStageFloor, NearFrame, GLOW_CFG, glowOf, INK } from './sets-shared';

const CLUMP_PALETTES = {
  silica: { body: '#ECC0C4', lobe: '#F9DFE2', rim: '#FFEFF1', facet: '#FFF6F6', deep: '#B87B87' },
  carbon: { body: '#3A3B4C', lobe: '#53566E', rim: '#8C93B8', facet: '#A5C9EC', deep: '#242532' },
  mag:    { body: '#409E6D', lobe: '#65C993', rim: '#A2F0C2', facet: '#C6FFE0', deep: '#246644' },
};

/** 5. ClumpsSet: smoky dust clumps with faceted grains inside & optional solar-system scale comparison. */
export const ClumpsSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const st = (sp.t as number | undefined) ?? 0.5;
  const size = (sp.size as number | undefined) ?? 0;
  const typeKey = (sp.type === 'carbon' || sp.type === 'mag' || sp.type === 'silica' ? sp.type : 'silica');
  const pal = CLUMP_PALETTES[typeKey];

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={501}
        rayOpacity={0.13}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={502} />;
  }

  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.47;
  const clumps = [
    { x: cx - W * 0.16, y: cy - 40, s: 1.05, seed: 11 },
    { x: cx + W * 0.14, y: cy + 12, s: 0.92, seed: 22 },
    { x: cx - W * 0.02, y: cy - 125, s: 0.72, seed: 33 },
  ];
  const ssScale = size > 0.1 ? backOut(clamp((t - 4) / 8)) * (1 + 0.04 * Math.sin(t / 10)) : 0;

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={503}
        veilLights={[[cx, cy, Math.min(W, H) * 0.65]]}
        veilOpacity={0.32}
        dustCount={40}
      />

      {clumps.map((cl, idx) => {
        const dx = Math.sin(t / 32 + st * 5 + idx * 1.7) * 14;
        const dy = Math.cos(t / 38 + idx * 2.1) * 10;
        const sc = cl.s * (vert ? 0.85 : 1);

        return (
          <g key={idx} transform={`translate(${cl.x + dx} ${cl.y + dy}) scale(${sc})`}>
            <Glow x={0} y={0} r={190} kind={cfg.kind} o={0.32} />
            {/* Soft smoky clump lobes */}
            <path
              d="M -120 15 Q -138 -48 -78 -72 Q -36 -110 24 -88 Q 92 -98 118 -40 Q 145 16 105 64 Q 54 96 -14 82 Q -88 94 -120 15 Z"
              fill={pal.body}
              stroke={INK}
              strokeWidth={4}
            />
            <ellipse cx={-35} cy={-26} rx={58} ry={38} fill={pal.lobe} opacity={0.78} />
            <ellipse cx={46} cy={14} rx={52} ry={34} fill={pal.deep} opacity={0.55} />
            <path
              d="M -88 -34 Q -36 -74 28 -68"
              fill="none"
              stroke={pal.rim}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.75}
            />
            {/* Sparkling faceted grains inside */}
            {Array.from({ length: 10 }).map((_, gi) => {
              const gx = (rnd(cl.seed, gi) - 0.5) * 160;
              const gy = (rnd(cl.seed + 1, gi) - 0.5) * 110;
              const gr = 5 + rnd(cl.seed + 2, gi) * 6;
              const tw = 0.55 + 0.45 * Math.sin(t / 7 + gi + idx);
              return (
                <polygon
                  key={gi}
                  transform={`translate(${gx} ${gy}) rotate(${t * 0.6 + gi * 40})`}
                  points={`0,${-gr} ${gr * 0.75},0 0,${gr} ${-gr * 0.75},0`}
                  fill={pal.facet}
                  stroke={INK}
                  strokeWidth={2.5}
                  opacity={tw}
                />
              );
            })}
          </g>
        );
      })}

      {/* Solar system scale comparison & bracket when setp.size > 0 */}
      {ssScale > 0.01 ? (
        <g transform={`translate(${cx + (vert ? 160 : 280)} ${cy - 40}) scale(${ssScale})`}>
          <Glow x={0} y={0} r={120} kind="warm" o={0.45} />
          {/* Orbit rings */}
          {[28, 48, 70, 94].map((or, oi) => (
            <ellipse
              key={oi}
              cx={0}
              cy={0}
              rx={or}
              ry={or * 0.52}
              fill="none"
              stroke={PALETTE.cream}
              strokeWidth={2}
              strokeDasharray="4 4"
              opacity={0.7}
            />
          ))}
          <circle cx={0} cy={0} r={12} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />
          {/* Tiny orbiting planets */}
          <circle cx={Math.cos(t / 20) * 48} cy={Math.sin(t / 20) * 25} r={4.5} fill={PALETTE.cyan} />
          <g transform={`translate(${Math.cos(t / 35 + 2) * 70} ${Math.sin(t / 35 + 2) * 36})`}>
            <circle cx={0} cy={0} r={6} fill={PALETTE.orange} stroke={INK} strokeWidth={2} />
            <ellipse cx={0} cy={0} rx={12} ry={3.5} fill="none" stroke={PALETTE.cream} strokeWidth={2} />
          </g>
          {/* Cream dimension bracket */}
          <g transform="translate(0 78)">
            <path d="M -110 -12 L -110 0 L 110 0 L 110 -12" fill="none" stroke={PALETTE.cream} strokeWidth={3} />
            <rect x={-172} y={8} width={344} height={30} rx={8} fill={PALETTE.pill} stroke={PALETTE.cream} strokeWidth={2.5} />
            <text y={28} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={14} fill={PALETTE.cream}>
              AS BIG AS OUR SOLAR SYSTEM
            </text>
          </g>
        </g>
      ) : null}
    </g>
  );
};

/** 6. ClockSet: huge countdown clock with 12 ticks, shrinking red arc for setp.h hours left, and sweeping hand. */
export const ClockSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const h = clamp((sp.h as number | undefined) ?? 12, 0.2, 12);
  const st = (sp.t as number | undefined) ?? 0.3;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={601}
        rayOpacity={0.14}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={602} />;
  }

  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.47;
  const R = Math.min(W, H) * 0.245;

  // Arc spanning h/12 of the clock ending at 12 o'clock (-90 deg)
  const sweepDeg = (h / 12) * 360;
  const startDeg = -90 - sweepDeg;
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (-90 * Math.PI) / 180;
  const arcR = R * 0.76;
  const x1 = Math.cos(startRad) * arcR;
  const y1 = Math.sin(startRad) * arcR;
  const x2 = Math.cos(endRad) * arcR;
  const y2 = Math.sin(endRad) * arcR;
  const largeArc = sweepDeg > 180 ? 1 : 0;
  const arcPath =
    h >= 11.99
      ? `M 0 ${-arcR} A ${arcR} ${arcR} 0 1 1 -0.1 ${-arcR} Z`
      : `M 0 0 L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${arcR} ${arcR} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
  const rimArcPath =
    h >= 11.99
      ? `M 0 ${-arcR} A ${arcR} ${arcR} 0 1 1 -0.1 ${-arcR}`
      : `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${arcR} ${arcR} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;

  const hourDeg = -90 - sweepDeg;
  const sweepHandDeg = -90 + (st * 360 + t * 2.4) % 360;
  const pulse = 1 + 0.015 * Math.sin(t / 9);

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={603}
        veilLights={[[cx, cy, R * 2.1]]}
        veilOpacity={0.35}
        dustCount={30}
      />

      <g transform={`translate(${cx} ${cy}) scale(${pulse})`}>
        <Glow x={0} y={0} r={R * 1.65} kind={cfg.kind} o={0.5 + 0.2 * Math.sin(t / 8)} />

        {/* Outer metallic bezel */}
        <circle cx={0} cy={0} r={R + 18} fill="#282340" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={0} r={R} fill="#18152A" stroke={INK} strokeWidth={4} />

        {/* Remaining time red wedge & glowing arc */}
        <path d={arcPath} fill={PALETTE.red} opacity={0.26 + 0.08 * Math.sin(t / 7)} />
        <path d={rimArcPath} fill="none" stroke={PALETTE.red} strokeWidth={12} strokeLinecap="round" />

        {/* 12 hour ticks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = i * 30;
          const major = i % 3 === 0;
          return (
            <line
              key={i}
              x1={0}
              y1={-R + 14}
              x2={0}
              y2={-R + (major ? 34 : 24)}
              transform={`rotate(${deg})`}
              stroke={PALETTE.cream}
              strokeWidth={major ? 5 : 3}
              strokeLinecap="round"
            />
          );
        })}

        {/* Remaining-hour marker hand */}
        <g transform={`rotate(${hourDeg + 90})`}>
          <line x1={0} y1={14} x2={0} y2={-R * 0.56} stroke={INK} strokeWidth={12} strokeLinecap="round" />
          <line x1={0} y1={14} x2={0} y2={-R * 0.56} stroke={PALETTE.cream} strokeWidth={6} strokeLinecap="round" />
        </g>

        {/* Fast red sweeping hand */}
        <g transform={`rotate(${sweepHandDeg + 90})`}>
          <line x1={0} y1={20} x2={0} y2={-R * 0.8} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <line x1={0} y1={20} x2={0} y2={-R * 0.8} stroke={PALETTE.red} strokeWidth={5} strokeLinecap="round" />
        </g>

        {/* Center cap */}
        <circle cx={0} cy={0} r={14} fill={PALETTE.red} stroke={INK} strokeWidth={4} />

        {/* Lower dial readout */}
        <rect x={-64} y={R * 0.34} width={128} height={34} rx={8} fill={PALETTE.pill} stroke={PALETTE.red} strokeWidth={2.5} />
        <text y={R * 0.34 + 23} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.red}>
          {`${h.toFixed(h % 1 === 0 ? 0 : 1)}H LEFT`}
        </text>
      </g>
    </g>
  );
};

/** 7. CycleSet: 4-station cosmic recycling loop (star -> cloud -> new star + planet -> Earth) with pulsing gold orbit. */
export const CycleSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const st = (sp.t as number | undefined) ?? 0.5;
  const stage = (sp.stage as number | undefined) ?? 4;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={701}
        rayOpacity={0.13}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={702} />;
  }

  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.47;
  const rx = vert ? 260 : 370;
  const ry = vert ? 205 : 195;

  // Station coordinates: Top (1), Right (2), Bottom (3), Left (4)
  const nodes = [
    { x: 0, y: -ry, label: 'BLAST', idx: 1 },
    { x: rx, y: 0, label: 'DUST CLOUD', idx: 2 },
    { x: 0, y: ry, label: 'NEW STAR', idx: 3 },
    { x: -rx, y: 0, label: 'EARTH', idx: 4 },
  ];

  // Travelling gold energy pulse along the ellipse
  const pulseAngle = -Math.PI / 2 + ((st + t / 180) % 1) * Math.PI * 2;
  const px = Math.cos(pulseAngle) * rx;
  const py = Math.sin(pulseAngle) * ry;

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={703}
        veilLights={[[cx, cy, rx * 1.45]]}
        veilOpacity={0.34}
      />

      <g transform={`translate(${cx} ${cy})`}>
        {/* Gold loop track */}
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={12} />
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={PALETTE.gold} strokeWidth={5} strokeDasharray="18 10" />

        {/* Quadrant directional arrows */}
        {[Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75].map((a, i) => {
          const ax = Math.cos(a) * rx;
          const ay = Math.sin(a) * ry;
          const deg = (Math.atan2(rx * Math.cos(a), -ry * Math.sin(a)) * 180) / Math.PI;
          return (
            <polygon
              key={i}
              transform={`translate(${ax} ${ay}) rotate(${deg})`}
              points="14,0 -10,-10 -6,0 -10,10"
              fill={PALETTE.gold}
              stroke={INK}
              strokeWidth={3}
            />
          );
        })}

        {/* Travelling pulse orb */}
        <Glow x={px} y={py} r={54} kind="warm" o={0.85} />
        <circle cx={px} cy={py} r={10} fill="#FFF4C2" stroke={PALETTE.gold} strokeWidth={3} />

        {/* Four outlined stations */}
        {nodes.map((nd) => {
          const lit = stage >= nd.idx;
          const sc = lit ? 1 + 0.04 * Math.sin(t / 12 + nd.idx) : 0.88;
          return (
            <g key={nd.idx} transform={`translate(${nd.x} ${nd.y}) scale(${sc})`} opacity={lit ? 1 : 0.42}>
              {lit ? <Glow x={0} y={0} r={92} kind={cfg.kind} o={0.55} /> : null}
              <circle cx={0} cy={0} r={58} fill="#1B1830" stroke={lit ? PALETTE.gold : '#3C375C'} strokeWidth={4} />

              {/* Station 1: Exploding Star */}
              {nd.idx === 1 ? (
                <g>
                  <polygon
                    points="0,-36 10,-12 36,-10 15,8 24,34 0,18 -24,34 -15,8 -36,-10 -10,-12"
                    fill={PALETTE.orange}
                    stroke={INK}
                    strokeWidth={3.5}
                  />
                  <circle cx={0} cy={0} r={11} fill="#FFF7D6" />
                </g>
              ) : null}

              {/* Station 2: Drifting Cloud */}
              {nd.idx === 2 ? (
                <g>
                  <path
                    d="M -28 8 Q -32 -14 -12 -18 Q 2 -28 18 -14 Q 34 -10 30 12 Q 16 24 -8 20 Q -26 22 -28 8 Z"
                    fill="#ECC0C4"
                    stroke={INK}
                    strokeWidth={3.5}
                  />
                  <circle cx={-6} cy={0} r={3.5} fill={PALETTE.cream} />
                  <circle cx={12} cy={4} r={3.5} fill={PALETTE.green} />
                </g>
              ) : null}

              {/* Station 3: Glowing New Star + Tiny Planet */}
              {nd.idx === 3 ? (
                <g>
                  <ellipse cx={0} cy={0} rx={42} ry={14} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.7} />
                  <circle cx={0} cy={0} r={18} fill={PALETTE.gold} stroke={INK} strokeWidth={3.5} />
                  <circle cx={Math.cos(t / 16) * 34} cy={Math.sin(t / 16) * 11} r={7} fill={PALETTE.cyan} stroke={INK} strokeWidth={2.5} />
                </g>
              ) : null}

              {/* Station 4: Earth-like Ball */}
              {nd.idx === 4 ? (
                <g>
                  <circle cx={0} cy={0} r={28} fill="#3696E0" stroke={INK} strokeWidth={3.5} />
                  <path d="M -14 -14 Q 0 -6 -4 10 Q -16 14 -20 0 Z" fill="#52C47C" />
                  <path d="M 8 -18 Q 22 -10 18 8 Q 6 12 6 -4 Z" fill="#52C47C" />
                  <path d="M -18 -4 Q 0 -10 18 -4" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
                </g>
              ) : null}

              <text y={82} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={15} fill={lit ? PALETTE.cream : '#8F8AAD'}>
                {nd.label}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

/** 8. TimelineSet: horizontal gold timeline with milestone calendar tags and gliding cyan marker. */
export const TimelineSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const now = (sp.now as number | undefined) ?? 0.8;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={801}
        rayOpacity={0.12}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={802} />;
  }

  const vert = H > W;
  const lineY = vert ? H * 0.49 : H * 0.48;
  const xStart = -120;
  const xEnd = W + 120;
  const milestones = [
    { frac: 0.14, yr: 'BLAST', sub: '11,000 LY' },
    { frac: 0.34, yr: '~1667', sub: 'LIGHT ARRIVES' },
    { frac: 0.56, yr: '2004', sub: 'SPITZER' },
    { frac: 0.78, yr: '2026', sub: 'WEBB + XRISM' },
  ];

  const glide = clamp(lerp(Math.max(0.14, now - 0.14), now, easeInOut(clamp(t / 40))));
  const markerX = lerp(W * 0.14, W * 0.86, glide);
  const hoverY = Math.sin(t / 12) * 5;

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={803}
        veilLights={[[markerX, lineY, 460], [W * 0.5, lineY, 620]]}
        veilOpacity={0.34}
      />

      {/* Long horizontal gold rail */}
      <line x1={xStart} y1={lineY} x2={xEnd} y2={lineY} stroke={INK} strokeWidth={16} />
      <line x1={xStart} y1={lineY} x2={xEnd} y2={lineY} stroke={PALETTE.gold} strokeWidth={7} />

      {/* Tick marks */}
      {Array.from({ length: 28 }).map((_, i) => {
        const tx = lerp(W * 0.05, W * 0.95, i / 27);
        return <line key={i} x1={tx} y1={lineY - 12} x2={tx} y2={lineY + 12} stroke={PALETTE.gold} strokeWidth={2.5} opacity={0.5} />;
      })}

      {/* Milestone dots & cream calendar tags */}
      {milestones.map((m, i) => {
        const mx = W * m.frac;
        const up = i % 2 === 0;
        const tagY = up ? -96 : 62;
        return (
          <g key={i} transform={`translate(${mx} ${lineY})`}>
            <line x1={0} y1={0} x2={0} y2={tagY} stroke={PALETTE.cream} strokeWidth={3} opacity={0.75} />
            <circle cx={0} cy={0} r={14} fill={PALETTE.gold} stroke={INK} strokeWidth={4} />
            <g transform={`translate(0 ${tagY})`}>
              <rect x={-74} y={-28} width={148} height={58} rx={10} fill={PALETTE.cream} stroke={INK} strokeWidth={4} />
              <rect x={-74} y={-28} width={148} height={14} rx={6} fill={PALETTE.red} stroke={INK} strokeWidth={3} />
              <text y={6} textAnchor="middle" fontFamily={FONTS.title} fontWeight={800} fontSize={20} fill={PALETTE.pill}>
                {m.yr}
              </text>
              <text y={23} textAnchor="middle" fontFamily={FONTS.ui} fontSize={11} fill={PALETTE.pill}>
                {m.sub}
              </text>
            </g>
          </g>
        );
      })}

      {/* Gliding cyan marker */}
      <g transform={`translate(${markerX} ${lineY + hoverY})`}>
        <Glow x={0} y={-30} r={120} kind="cool" o={0.78} />
        <line x1={0} y1={-90} x2={0} y2={65} stroke={PALETTE.cyan} strokeWidth={3} strokeDasharray="6 6" />
        <polygon points="0,-46 18,-22 0,4 -18,-22" fill={PALETTE.cyan} stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={0} r={10 + Math.sin(t / 7) * 2} fill="#E6FCFF" stroke={PALETTE.cyan} strokeWidth={3} />
      </g>
    </g>
  );
};

/** 9. VoidSet: clean SpaceBackdrop stage with slow glow-tinted light rays and calm subtle horizon. */
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={901}
        stars={32}
        starOpacity={0.42}
        rayOpacity={0.18}
        nebula={false}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={902} />;
  }

  return (
    <g>
      <Glow x={W * 0.5} y={H * 0.36} r={Math.min(W, H) * 0.48} kind={cfg.kind} o={0.34 + 0.08 * Math.sin(t / 18)} />
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={903}
        veilOpacity={0.42}
        dustCount={22}
        showRocks={false}
      />
    </g>
  );
};
