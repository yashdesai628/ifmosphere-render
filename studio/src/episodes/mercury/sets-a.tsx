import React from 'react';
import { clamp, lerp, easeOut, backOut, settle, rnd } from '../../engine/anim';
import { Glow, Cone } from '../../engine/light';
import { Rays, Stars } from '../../engine/kit';
import { BrandChip, BrandLabel, PALETTE, FONTS } from '../../brand';
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
  MercurySphere,
  SimplePlanet,
} from './sets-common';

const ApproachSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const fire = Number(sp.fire ?? 0);
  const glowKey = String(sp.glow ?? 'gold');
  const rimCol = glowKey === 'red' ? PALETTE.red : PALETTE.gold;

  if (layer === 'far') {
    return (
      <DeepCosmos
        id={id}
        t={t}
        W={W}
        H={H}
        seed={211}
        starCount={120}
        rayX={W * 0.92}
        rayY={H * 0.28}
        rayColor={rimCol}
        rayOpacity={0.11}
        glowKind={glowKey === 'red' ? 'red' : 'warm'}
        glowOpacity={0.38}
      />
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="rock" />;

  // mid: huge dark Mercury disc filling lower right, sunlit upper-right edge, approaching stack
  const discR = (vert ? 560 : 620) * u;
  const discX = vert ? W * 0.9 : W * 0.84;
  const discY = vert ? ground - 80 : H * 0.86;
  const stackX = lerp(W * 0.19, W * 0.44, prog) + Math.sin(t / 24) * 5;
  const stackY = (vert ? ground - 490 : H * 0.39) + Math.cos(t / 20) * 6;

  return (
    <g>
      <defs>
        <clipPath id={`${id}mclip`}>
          <circle cx={discX} cy={discY} r={discR} />
        </clipPath>
      </defs>

      {/* Plane 1: Huge dark Mercury disc with faint night-side craters & glowing sunlit edge */}
      <Glow x={discX - discR * 0.55} y={discY - discR * 0.65} r={discR * 0.72} kind={glowKey === 'red' ? 'red' : 'warm'} o={0.5} />
      <circle cx={discX} cy={discY} r={discR} fill="#141726" />
      <g clipPath={`url(#${id}mclip)`}>
        {[
          [-0.45, -0.38, 0.15],
          [-0.22, -0.58, 0.1],
          [-0.58, -0.1, 0.13],
          [-0.18, -0.22, 0.2],
          [-0.36, 0.14, 0.17],
        ].map(([fx, fy, fr], i) => (
          <g key={i} transform={`translate(${discX + fx * discR} ${discY + fy * discR})`}>
            <circle r={fr * discR} fill="#1A1E31" stroke="#2C3350" strokeWidth={2.5} />
            <path
              d={`M ${-fr * discR * 0.65} ${-fr * discR * 0.4} A ${fr * discR * 0.8} ${fr * discR * 0.8} 0 0 1 ${fr * discR * 0.55} ${-fr * discR * 0.5}`}
              fill="none"
              stroke={rimCol}
              strokeWidth={2}
              opacity={0.3}
            />
          </g>
        ))}
      </g>
      {/* Thin glowing sunlit rim on upper-left/top arc facing the sun */}
      <path
        d={`M ${discX - discR * 0.94} ${discY - discR * 0.34} A ${discR} ${discR} 0 0 1 ${discX + discR * 0.25} ${discY - discR * 0.96}`}
        fill="none"
        stroke={rimCol}
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.9}
      />
      <circle cx={discX} cy={discY} r={discR} fill="none" stroke={INK} strokeWidth={4} />

      {/* Plane 2: Approaching BepiColombo stack */}
      <g transform={`translate(${stackX} ${stackY}) rotate(${lerp(-18, -28, prog)})`}>
        <BepiStackArt id={`${id}st`} t={t} scale={(vert ? 0.54 : 0.62) * u} fire={fire} wingSpan={140} />
      </g>

      {/* Plane 3: Translucent cosmic deck */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101224" rim={rimCol} translucent />
      <MidAtmosphere
        id={id}
        t={t}
        W={W}
        H={H}
        seed={14}
        lights={[
          [stackX, stackY, 360 * u],
          [discX - discR * 0.45, discY - discR * 0.55, 520 * u],
        ]}
        veilOpacity={0.34}
      />
    </g>
  );
};

const StackviewSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.14);
  const fire = Number(sp.fire ?? 0);
  const showLabels = Number(sp.label ?? 0) > 0.5;

  if (layer === 'far') {
    return (
      <g>
        <DeepCosmos id={id} t={t} W={W} H={H} seed={307} starCount={95} rayX={W * 0.5} rayY={H * 0.35} rayOpacity={0.09} glowOpacity={0.35} />
        <g stroke="#24315B" strokeWidth={2} opacity={0.28}>
          {[-240, 0, 240].map((dy, i) => (
            <line key={i} x1={-W * 0.4} y1={H * 0.46 + dy} x2={W * 1.4} y2={H * 0.46 + dy} strokeDasharray="10 14" />
          ))}
        </g>
      </g>
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const cx = W * 0.5;
  const cy = vert ? ground - 455 : H * 0.46;
  const sc = (vert ? 0.85 : 1.05) * u;
  const tilt = lerp(-5, 6, prog) + Math.sin(t / 26) * 2;
  const driftY = Math.sin(t / 20) * 7;
  const sepMTM = prog > 0.82 ? clamp((prog - 0.82) / 0.18) : 0;

  return (
    <g>
      {/* Plane 1: Subtle circular telemetry rings behind the stack */}
      <circle cx={cx} cy={cy} r={260 * sc} fill="none" stroke="#2D3E72" strokeWidth={2.5} strokeDasharray="12 12" opacity={0.45} />
      <circle cx={cx} cy={cy} r={195 * sc} fill="none" stroke="#2D3E72" strokeWidth={2} opacity={0.35} />
      <Glow x={cx} y={cy} r={300 * sc} kind="cool" o={0.28} />

      {/* Plane 2: Cutaway BepiColombo stack */}
      <g transform={`translate(${cx} ${cy + driftY}) rotate(${tilt})`}>
        <BepiStackArt
          id={`${id}st`}
          t={t}
          scale={sc}
          fire={fire}
          cutaway
          separateMTM={sepMTM}
          wingSpan={vert ? 135 : 165}
        />
      </g>

      {showLabels ? (
        <g>
          <line x1={cx - 42 * sc} y1={cy - 10 * sc} x2={cx - 175 * sc} y2={cy - 75 * sc} stroke={PALETTE.gold} strokeWidth={3} />
          <circle cx={cx - 42 * sc} cy={cy - 10 * sc} r={5} fill={PALETTE.gold} />
          <BrandChip x={cx - 225 * sc} y={cy - 82 * sc} t={t + 4} text="MPO" color={PALETTE.gold} />

          <line x1={cx + 16 * sc} y1={cy - 82 * sc} x2={cx + 160 * sc} y2={cy - 122 * sc} stroke={PALETTE.cyan} strokeWidth={3} />
          <circle cx={cx + 16 * sc} cy={cy - 82 * sc} r={5} fill={PALETTE.cyan} />
          <BrandChip x={cx + 210 * sc} y={cy - 125 * sc} t={t + 6} text="MIO" color={PALETTE.cyan} />
        </g>
      ) : null}

      {/* Plane 3: Ground deck */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#10142A" rim={PALETTE.cyan} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={23} lights={[[cx, cy, 460 * sc]]} veilOpacity={0.34} />
    </g>
  );
};

const RouteSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.14);
  const marks = Math.round(Number(sp.marks ?? 0));
  const glowKey = String(sp.glow ?? 'gold');
  const accent = glowKey === 'cyan' ? PALETTE.cyan : PALETTE.gold;

  if (layer === 'far') {
    return (
      <DeepCosmos
        id={id}
        t={t}
        W={W}
        H={H}
        seed={401}
        starCount={100}
        rayX={W * 0.5}
        rayY={vert ? ground - 455 : H * 0.45}
        rayColor={accent}
        rayOpacity={0.1}
        glowKind={GLOW_KIND[glowKey]}
        glowOpacity={0.36}
      />
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const cx = W * 0.5;
  const cy = vert ? ground - 455 : H * 0.45;
  const sc = (vert ? 0.8 : 1.0) * u;

  // Orbits: Mercury r=95, Venus r=175, Earth r=265
  const rMerc = 95 * sc;
  const rVen = 175 * sc;
  const rEarth = 265 * sc;

  // 9 flyby marker nodes winding inward from Earth (1) -> Venus (2-3) -> Mercury (4-9)
  const nodes: [number, number][] = [
    [cx + rEarth * 0.88, cy - rEarth * 0.46], // 1 Earth
    [cx + rVen * 0.22, cy + rVen * 0.96],    // 2 Venus 1
    [cx - rVen * 0.92, cy + rVen * 0.34],    // 3 Venus 2
    [cx - rMerc * 0.95, cy - rMerc * 0.3],   // 4 Merc 1
    [cx - rMerc * 0.2, cy - rMerc * 0.98],   // 5 Merc 2
    [cx + rMerc * 0.85, cy - rMerc * 0.52],  // 6 Merc 3
    [cx + rMerc * 0.72, cy + rMerc * 0.68],  // 7 Merc 4
    [cx - rMerc * 0.42, cy + rMerc * 0.88],  // 8 Merc 5
    [cx - rMerc * 0.78, cy - rMerc * 0.12],  // 9 Merc 6
  ];

  const spiralD = `M ${nodes[0][0]} ${nodes[0][1]} Q ${cx + 260 * sc} ${cy + 150 * sc} ${nodes[1][0]} ${nodes[1][1]} Q ${cx - 110 * sc} ${cy + 210 * sc} ${nodes[2][0]} ${nodes[2][1]} Q ${cx - 190 * sc} ${cy - 40 * sc} ${nodes[3][0]} ${nodes[3][1]} Q ${cx - 80 * sc} ${cy - 130 * sc} ${nodes[4][0]} ${nodes[4][1]} Q ${cx + 75 * sc} ${cy - 120 * sc} ${nodes[5][0]} ${nodes[5][1]} Q ${cx + 125 * sc} ${cy + 15 * sc} ${nodes[6][0]} ${nodes[6][1]} Q ${cx + 20 * sc} ${cy + 115 * sc} ${nodes[7][0]} ${nodes[7][1]} Q ${cx - 95 * sc} ${cy + 55 * sc} ${nodes[8][0]} ${nodes[8][1]}`;
  const pathLen = 1900 * sc;
  const activeIdx = Math.min(8, Math.floor(prog * 8));
  const sub = prog * 8 - activeIdx;
  const probePt = nodes[activeIdx] && nodes[activeIdx + 1]
    ? [lerp(nodes[activeIdx][0], nodes[activeIdx + 1][0], sub), lerp(nodes[activeIdx][1], nodes[activeIdx + 1][1], sub)]
    : nodes[8];

  return (
    <g>
      {/* Plane 1: Orbit rings */}
      <circle cx={cx} cy={cy} r={rEarth} fill="none" stroke="#364C84" strokeWidth={2.5} opacity={0.75} />
      <circle cx={cx} cy={cy} r={rVen} fill="none" stroke="#42598C" strokeWidth={2.5} opacity={0.75} />
      <circle cx={cx} cy={cy} r={rMerc} fill="none" stroke="#536CA6" strokeWidth={3} opacity={0.85} />

      {/* Central Sun */}
      <Glow x={cx} y={cy} r={115 * sc} kind="warm" o={0.72} />
      <circle cx={cx} cy={cy} r={34 * sc} fill="#FFD15C" stroke={INK} strokeWidth={4} />
      <circle cx={cx - 8 * sc} cy={cy - 8 * sc} r={10 * sc} fill="#FFF2B8" opacity={0.85} />

      {/* Planet Markers on Orbits */}
      <circle cx={cx + rEarth * 0.92} cy={cy - rEarth * 0.39} r={13 * sc} fill="#3FA9FF" stroke={INK} strokeWidth={3.5} />
      <circle cx={cx - rVen * 0.96} cy={cy + rVen * 0.28} r={11 * sc} fill="#F2B880" stroke={INK} strokeWidth={3.5} />
      <circle cx={cx - rMerc * 0.85} cy={cy - rMerc * 0.52} r={9 * sc} fill="#9BA2B8" stroke={INK} strokeWidth={3} />

      {/* Plane 2: Gold spiral trajectory + 9 flyby markers */}
      <defs>
        <mask id={`${id}rmask`} maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
          <path
            d={spiralD}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen * (1 - prog)}
          />
        </mask>
      </defs>
      <path d={spiralD} fill="none" stroke={accent} strokeWidth={2.5} strokeDasharray="8 12" opacity={0.22} />
      <path
        d={spiralD}
        fill="none"
        stroke={accent}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeDasharray="10 10"
        mask={`url(#${id}rmask)`}
        opacity={0.95}
      />

      {nodes.map(([nx, ny], idx) => {
        const lit = idx < marks;
        const pulse = lit ? 1 + 0.25 * Math.sin(t / 7 + idx) : 1;
        return (
          <g key={idx} transform={`translate(${nx} ${ny})`}>
            {lit ? <circle r={16 * sc * pulse} fill={accent} opacity={0.28} /> : null}
            <circle r={(lit ? 11 : 7) * sc} fill={lit ? accent : '#1C223B'} stroke={INK} strokeWidth={3} />
            {lit ? (
              <text y={4.5} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={13 * sc} fill={PALETTE.pill}>
                {idx + 1}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Travelling Probe Dot */}
      <g transform={`translate(${probePt[0]} ${probePt[1]})`}>
        <Glow x={0} y={0} r={34 * sc} kind={GLOW_KIND[glowKey]} o={0.75} />
        <circle r={7 * sc} fill={PALETTE.cream} stroke={INK} strokeWidth={2.5} />
      </g>

      {/* Plane 3: Translucent orbital floor */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#0F1326" rim={accent} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={31} lights={[[cx, cy, 460 * sc]]} veilOpacity={0.35} />
    </g>
  );
};

const SunfallSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const brake = Number(sp.brake ?? 0);
  const speed = clamp(Number(sp.speed ?? 0.5) * (0.85 + 0.15 * easeOut(p)));

  const sunX = W * 0.94;
  const sunY = vert ? ground - 450 : H * 0.46;

  if (layer === 'far') {
    return (
      <DeepCosmos
        id={id}
        t={t}
        W={W}
        H={H}
        seed={509}
        starCount={80}
        topColor="#090717"
        bottomColor="#241322"
        rayX={sunX}
        rayY={sunY}
        rayColor="#FFB463"
        rayOpacity={0.18}
        glowKind="warm"
        glowOpacity={0.65}
      />
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const sunR = (vert ? 260 : 320) * u;
  const probeX = lerp(W * 0.18, W * 0.62, prog);
  const probeY = lerp(sunY - 40 * u, sunY + 12 * u, prog) + Math.sin(t / 14) * 5;
  const trailLen = lerp(120, 440, speed) * (1 - brake * 0.65) * u;

  // Cyan Speedometer Arc Dial in lower-left/mid-left
  const dialX = vert ? W * 0.25 : W * 0.22;
  const dialY = vert ? ground - 260 : ground - 160;
  const dialR = 62 * u;
  const sweep = speed * Math.PI * 1.4;
  const arcA0 = -Math.PI * 1.2;
  const arcA1 = arcA0 + sweep;

  return (
    <g>
      {/* Plane 1: Giant glowing orange Sun on right + gravity funnel curves */}
      <g stroke="#4B2838" strokeWidth={2.5} fill="none" opacity={0.55}>
        {[-120, -60, 0, 60, 120].map((dy, i) => (
          <path key={i} d={`M ${-W * 0.1} ${sunY + dy * 1.5} Q ${W * 0.55} ${sunY + dy * 0.8} ${sunX} ${sunY + dy * 0.2}`} />
        ))}
      </g>

      <Glow x={sunX} y={sunY} r={sunR * 2.1} kind="warm" o={0.85} />
      <Rays x={sunX} y={sunY} t={t} len={sunR * 3.5} n={16} o={0.15} color="#FFD488" />
      <circle cx={sunX} cy={sunY} r={sunR * 1.1} fill="#FF6E2E" opacity={0.4} />
      <circle cx={sunX} cy={sunY} r={sunR} fill="#FF9E3D" stroke={INK} strokeWidth={4} />
      <circle cx={sunX - sunR * 0.2} cy={sunY} r={sunR * 0.72} fill="#FFD97D" opacity={0.55} />

      {/* Plane 2: Probe diving sunward + gold speed trail / brake flames */}
      <g transform={`translate(${probeX} ${probeY})`}>
        <defs>
          <linearGradient id={`${id}tr`} x1={-trailLen} y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={PALETTE.gold} stopOpacity={0} />
            <stop offset="100%" stopColor={PALETTE.gold} stopOpacity={0.95} />
          </linearGradient>
        </defs>
        <path d={`M ${-trailLen} -16 L -12 -5 L -12 5 L ${-trailLen} 16 Z`} fill={`url(#${id}tr)`} />
        <line x1={-trailLen * 0.8} y1={-12} x2={-16} y2={-7} stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.7} />
        <line x1={-trailLen * 0.65} y1={12} x2={-16} y2={7} stroke={PALETTE.gold} strokeWidth={2.5} opacity={0.75} />

        {/* Braking forward flames when brake = 1 */}
        {brake > 0.5 ? (
          <g>
            <Glow x={42} y={0} r={65} kind="warm" o={0.8} />
            <path d="M 18 -14 Q 68 -24 102 0 Q 68 24 18 14 Z" fill="#FF6A2B" stroke={INK} strokeWidth={3} />
            <path d="M 18 -7 Q 48 -11 72 0 Q 48 11 18 7 Z" fill="#FFE89C" />
          </g>
        ) : null}

        {/* Tiny Probe Icon */}
        <g transform="rotate(90) scale(0.32)">
          <BepiStackArt id={`${id}pr`} t={t} wingSpan={140} />
        </g>
      </g>

      {/* Cyan Speedometer Arc */}
      <g transform={`translate(${dialX} ${dialY})`}>
        <circle r={dialR + 12} fill="#101326" opacity={0.85} stroke={INK} strokeWidth={4} />
        <path
          d={`M ${Math.cos(arcA0) * dialR} ${Math.sin(arcA0) * dialR} A ${dialR} ${dialR} 0 1 1 ${Math.cos(arcA0 + Math.PI * 1.4) * dialR} ${Math.sin(arcA0 + Math.PI * 1.4) * dialR}`}
          fill="none"
          stroke="#263154"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {speed > 0.02 ? (
          <path
            d={`M ${Math.cos(arcA0) * dialR} ${Math.sin(arcA0) * dialR} A ${dialR} ${dialR} 0 ${sweep > Math.PI ? 1 : 0} 1 ${Math.cos(arcA1) * dialR} ${Math.sin(arcA1) * dialR}`}
            fill="none"
            stroke={PALETTE.cyan}
            strokeWidth={10}
            strokeLinecap="round"
          />
        ) : null}
        <line x1={0} y1={0} x2={Math.cos(arcA1) * (dialR - 12)} y2={Math.sin(arcA1) * (dialR - 12)} stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" />
        <circle r={6} fill={PALETTE.cyan} stroke={INK} strokeWidth={2.5} />
        <text y={36 * u} textAnchor="middle" fontFamily={FONTS.ui} fontSize={14 * u} fill={PALETTE.cyan}>
          SPEED
        </text>
      </g>

      {/* Plane 3: Ground deck */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#171124" rim="#FFB163" translucent />
      <MidAtmosphere
        id={id}
        t={t}
        W={W}
        H={H}
        seed={47}
        lights={[
          [sunX - sunR * 0.4, sunY, 640 * u],
          [probeX, probeY, 340 * u],
        ]}
        veilOpacity={0.34}
      />
    </g>
  );
};

const EnergySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const plutoFill = clamp(Number(sp.pluto ?? 0.4)) * easeOut(clamp(p / 0.72));
  const mercFill = clamp(Number(sp.merc ?? 0.8)) * easeOut(clamp(p / 0.78));
  const glowKey = String(sp.glow ?? 'gold');
  const mercCol = glowKey === 'red' ? PALETTE.red : PALETTE.gold;

  if (layer === 'far') {
    return (
      <g>
        <DeepCosmos
          id={id}
          t={t}
          W={W}
          H={H}
          seed={607}
          starCount={75}
          rayX={W * 0.52}
          rayY={H * 0.25}
          rayColor={GLOW_HEX[glowKey]}
          rayOpacity={0.11}
          glowKind={GLOW_KIND[glowKey]}
          glowOpacity={0.35}
        />
      </g>
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const cx = W * 0.5;
  const baseY = vert ? ground - 160 : ground - 80;
  const colW = (vert ? 110 : 128) * u;
  const gap = (vert ? 170 : 240) * u;
  const hPluto = (vert ? 270 : 320) * u;
  const hMerc = (vert ? 390 : 450) * u;
  const leftX = cx - gap * 0.5;
  const rightX = cx + gap * 0.5;

  const drawTank = (x: number, maxH: number, frac: number, col: string, label: string, isMerc: boolean) => {
    const fillH = maxH * clamp(frac);
    const wave = Math.sin(t / 8) * 4;
    return (
      <g transform={`translate(${x} ${baseY})`}>
        {/* Pedestal */}
        <rect x={-colW * 0.65} y={0} width={colW * 1.3} height={24} rx={6} fill="#252B47" stroke={INK} strokeWidth={4} />
        {/* Glass Tank */}
        <rect x={-colW / 2} y={-maxH} width={colW} height={maxH} rx={16} fill="#14182D" stroke={INK} strokeWidth={4} />
        {fillH > 6 ? (
          <g>
            <Glow x={0} y={-fillH * 0.5} r={colW * 1.1} kind={col === PALETTE.red ? 'red' : 'warm'} o={0.4} />
            <rect x={-colW / 2 + 5} y={-fillH} width={colW - 10} height={fillH - 4} rx={10} fill={col} />
            <ellipse cx={0} cy={-fillH} rx={colW / 2 - 7} ry={6 + wave * 0.2} fill="#FFF2B8" opacity={0.6} />
          </g>
        ) : null}
        {/* Tick marks */}
        {[0.25, 0.5, 0.75].map((f, idx) => (
          <line key={idx} x1={-colW / 2 + 8} y1={-maxH * f} x2={-colW / 2 + 24} y2={-maxH * f} stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.55} />
        ))}
        {/* Tank outline on top */}
        <rect x={-colW / 2} y={-maxH} width={colW} height={maxH} rx={16} fill="none" stroke={INK} strokeWidth={4} />
        {/* Tiny world icon badge above tank */}
        {isMerc ? (
          <SimplePlanet x={0} y={-maxH - 42 * u} r={24 * u} fill="#878D9E" rim={PALETTE.gold} />
        ) : (
          <SimplePlanet x={0} y={-maxH - 42 * u} r={20 * u} fill="#B8C9E8" rim={PALETTE.cream} />
        )}
        <BrandLabel x={0} y={54 * u} t={t + 4} text={label} size={24 * u} color={PALETTE.cream} />
      </g>
    );
  };

  return (
    <g>
      {/* Plane 1: Calibration backdrop bars */}
      {[-360, -240, -120].map((dy, i) => (
        <line key={i} x1={cx - 320 * u} y1={baseY + dy * u} x2={cx + 320 * u} y2={baseY + dy * u} stroke="#283159" strokeWidth={2} strokeDasharray="8 10" opacity={0.5} />
      ))}
      {/* Plane 2: Fuel tank columns */}
      {drawTank(leftX, hPluto, plutoFill, PALETTE.gold, 'PLUTO', false)}
      {drawTank(rightX, hMerc, mercFill, mercCol, 'MERCURY', true)}
      {/* Plane 3: Floor */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#12162B" rim={mercCol} />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={53} lights={[[cx, baseY - 200, 480 * u]]} veilOpacity={0.35} />
    </g>
  );
};

const MercurySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const showCore = Number(sp.core ?? 0) > 0.5;
  const sunAmt = clamp(Number(sp.sun ?? 0.2));

  const cx = W * 0.5;
  const cy = vert ? ground - 455 : H * 0.45;
  const r = (vert ? 185 : 225) * u;

  if (layer === 'far') {
    return (
      <DeepCosmos
        id={id}
        t={t}
        W={W}
        H={H}
        seed={701}
        starCount={110}
        rayX={cx + r * 0.5}
        rayY={cy - r * 0.3}
        rayColor="#FFC86E"
        rayOpacity={0.08 + sunAmt * 0.16}
        glowKind="warm"
        glowOpacity={0.22 + sunAmt * 0.55}
      />
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="rock" />;

  return (
    <g>
      {/* Plane 1: Giant Sun glow behind Mercury when sp.sun grows */}
      {sunAmt > 0.05 ? (
        <g>
          <Glow x={cx + r * 0.45} y={cy - r * 0.2} r={r * (1.8 + sunAmt * 1.4)} kind="warm" o={0.35 + sunAmt * 0.55} />
          <Rays x={cx + r * 0.45} y={cy - r * 0.2} t={t} len={r * 3.8} n={14} o={sunAmt * 0.16} color="#FFD480" />
        </g>
      ) : null}

      {/* Plane 2: Big Mercury globe + optional huge glowing iron core cutaway */}
      <MercurySphere
        id={`${id}merc`}
        cx={cx}
        cy={cy}
        r={r}
        spinOffset={prog * 0.35 + t * 0.0012}
        terminatorShift={lerp(-0.4, 0.45, prog)}
        rimColor="#FFD98A"
        rimOpacity={0.55 + sunAmt * 0.45}
      />

      {showCore ? (
        <g>
          {/* Cutaway wedge revealing giant iron core (~82% radius!) */}
          <defs>
            <clipPath id={`${id}coreclip`}>
              <path d={`M ${cx} ${cy} L ${cx + r * 0.99} ${cy - r * 0.22} A ${r} ${r} 0 0 1 ${cx + r * 0.12} ${cy + r * 0.99} Z`} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}coreclip)`}>
            {/* Silicate crust & thin mantle */}
            <circle cx={cx} cy={cy} r={r} fill="#464A5E" />
            {/* Massive iron core */}
            <circle cx={cx} cy={cy} r={r * 0.84} fill="#FF732E" stroke={INK} strokeWidth={4} />
            <circle cx={cx} cy={cy} r={r * 0.56} fill="#FFB647" />
            <circle cx={cx} cy={cy} r={r * (0.3 + 0.03 * Math.sin(t / 7))} fill="#FFF1B0" />
          </g>
          <Glow x={cx + r * 0.3} y={cy + r * 0.25} r={r * 1.1} kind="warm" o={0.55} />
          <path
            d={`M ${cx} ${cy} L ${cx + r * 0.97} ${cy - r * 0.22} M ${cx} ${cy} L ${cx + r * 0.12} ${cy + r * 0.98}`}
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      ) : null}

      {/* Plane 3: Ground deck */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101326" rim="#FFD480" translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={61} lights={[[cx, cy, r * 2.2]]} veilOpacity={0.35} />
    </g>
  );
};

const CompareSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.2);
  const showMass = Number(sp.mass ?? 0) > 0.5;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={811} starCount={95} rayX={W * 0.25} rayY={H * 0.2} rayOpacity={0.09} glowOpacity={0.3} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="console" />;

  const cy = vert ? ground - 455 : H * 0.45;
  const rMoon = 34 * u;
  const rMerc = 51 * u; // Exact 1.5x Moon
  const rEarth = (vert ? 115 : 138) * u;

  const slide = easeOut(clamp(prog));
  const xMoon = lerp(W * 0.1, vert ? W * 0.2 : W * 0.24, slide);
  const xMerc = lerp(W * 0.35, vert ? W * 0.45 : W * 0.45, slide);
  const xEarth = lerp(W * 0.92, vert ? W * 0.76 : W * 0.74, slide);
  const caliperY = cy - rMerc - 42 * u;

  const tip = showMass ? backOut(clamp(p / 0.35)) * 16 + settle(t - 10, 4) : 0;

  return (
    <g>
      {/* Plane 1: Faint calibration baseline */}
      <line x1={W * 0.1} y1={cy} x2={W * 0.9} y2={cy} stroke="#28355E" strokeWidth={2} strokeDasharray="8 10" />

      {/* Plane 2: Moon, Mercury (1.5x), Earth */}
      <SimplePlanet x={xMoon} y={cy} r={rMoon} fill="#C5CBD8" rim={PALETTE.cream}>
        <circle cx={-8 * u} cy={-6 * u} r={6 * u} fill="#9BA2B4" />
        <circle cx={10 * u} cy={8 * u} r={5 * u} fill="#9BA2B4" />
      </SimplePlanet>
      <SimplePlanet x={xMerc} y={cy} r={rMerc} fill="#7A8094" rim={PALETTE.gold}>
        <circle cx={-14 * u} cy={-10 * u} r={10 * u} fill="#5C6173" />
        <circle cx={16 * u} cy={12 * u} r={8 * u} fill="#5C6173" />
      </SimplePlanet>
      <SimplePlanet x={xEarth} y={cy} r={rEarth} fill="#2A7CE2" rim={PALETTE.cyan}>
        <path d={`M ${-55 * u} ${-45 * u} Q ${-10 * u} ${-65 * u} ${25 * u} ${-20 * u} T ${-10 * u} ${55 * u} Z`} fill="#48B87A" />
        <path d={`M ${35 * u} ${-5 * u} Q ${70 * u} ${-25 * u} ${85 * u} ${20 * u} T ${40 * u} ${45 * u} Z`} fill="#48B87A" />
        <path d={`M ${-75 * u} ${-15 * u} L ${25 * u} ${-15 * u}`} stroke="#EAF4FF" strokeWidth={8 * u} strokeLinecap="round" opacity={0.65} />
      </SimplePlanet>

      {/* Thin cream width lines */}
      <g stroke={PALETTE.cream} strokeWidth={2.5} opacity={clamp(prog * 1.4)}>
        <line x1={xMoon - rMoon} y1={caliperY} x2={xMoon + rMoon} y2={caliperY} />
        <line x1={xMoon - rMoon} y1={caliperY - 8} x2={xMoon - rMoon} y2={caliperY + 8} />
        <line x1={xMoon + rMoon} y1={caliperY - 8} x2={xMoon + rMoon} y2={caliperY + 8} />

        <line x1={xMerc - rMerc} y1={caliperY} x2={xMerc + rMerc} y2={caliperY} stroke={PALETTE.gold} />
        <line x1={xMerc - rMerc} y1={caliperY - 8} x2={xMerc - rMerc} y2={caliperY + 8} stroke={PALETTE.gold} />
        <line x1={xMerc + rMerc} y1={caliperY - 8} x2={xMerc + rMerc} y2={caliperY + 8} stroke={PALETTE.gold} />
      </g>

      <BrandLabel x={xMoon} y={cy + rMoon + 36 * u} t={t + 4} text="MOON" size={20 * u} color={PALETTE.cream} />
      <BrandLabel x={xMerc} y={cy + rMerc + 36 * u} t={t + 5} text="MERCURY" size={20 * u} color={PALETTE.gold} />
      <BrandLabel x={xEarth} y={cy + rEarth + 36 * u} t={t + 6} text="EARTH" size={20 * u} color={PALETTE.cyan} />

      {/* Mass balance beam when sp.mass = 1 */}
      {showMass ? (
        <g transform={`translate(${(xMoon + xMerc) * 0.5} ${cy + 145 * u})`}>
          <polygon points="-14,42 14,42 0,0" fill="#7D88A6" stroke={INK} strokeWidth={3.5} />
          <g transform={`rotate(${tip})`}>
            <line x1={-110 * u} y1={0} x2={110 * u} y2={0} stroke={PALETTE.cream} strokeWidth={5} strokeLinecap="round" />
            <circle cx={-110 * u} cy={-16 * u} r={14 * u} fill="#C5CBD8" stroke={INK} strokeWidth={3} />
            <circle cx={110 * u} cy={-22 * u} r={22 * u} fill="#7A8094" stroke={INK} strokeWidth={3.5} />
          </g>
        </g>
      ) : null}

      {/* Plane 3: Stage floor */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#11152A" rim="#C5D2F2" />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={71} lights={[[W * 0.5, cy, 560 * u]]} veilOpacity={0.32} />
    </g>
  );
};

const ThermoSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const hot = clamp(Number(sp.hot ?? 0.5));
  const cold = clamp(Number(sp.cold ?? 0.5));
  const splitX = W * (0.5 + (prog - 0.5) * 0.14);

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <clipPath id={`${id}hotc`}>
            <rect x={-W} y={-H} width={splitX + W} height={H * 3} />
          </clipPath>
          <clipPath id={`${id}coldc`}>
            <rect x={splitX} y={-H} width={W * 2} height={H * 3} />
          </clipPath>
          <linearGradient id={`${id}hsky`} x1="0" y1="0" x2="0" y2={ground} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={hot > 0.65 ? '#A83219' : '#3B1822'} />
            <stop offset="65%" stopColor={hot > 0.65 ? '#FF9038' : '#A64628'} />
            <stop offset="100%" stopColor={hot > 0.75 ? '#FFEFC8' : '#E89B54'} />
          </linearGradient>
          <linearGradient id={`${id}csky`} x1="0" y1="0" x2="0" y2={ground} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#040714" />
            <stop offset="100%" stopColor={cold > 0.65 ? '#102A54' : '#0B1633'} />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${id}hotc)`}>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}hsky)`} />
          <Rays x={W * 0.22} y={H * 0.28} t={t} len={H * 1.4} n={12} o={0.14 + hot * 0.14} color="#FFF0C4" />
        </g>
        <g clipPath={`url(#${id}coldc)`}>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}csky)`} />
          <Stars seed={91} x0={splitX - 100} y0={-H * 0.4} w={W * 1.6} h={ground + H * 0.4} t={t} n={85} o={0.9} />
        </g>
      </g>
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="rock" />;

  const sunX = W * 0.24;
  const sunY = vert ? ground - 520 : H * 0.36;
  const sunR = (vert ? 120 : 145) * u;

  return (
    <g>
      <defs>
        <clipPath id={`${id}mhot`}>
          <rect x={-W} y={-H} width={splitX + W} height={H * 3} />
        </clipPath>
        <clipPath id={`${id}mcold`}>
          <rect x={splitX} y={-H} width={W * 2} height={H * 3} />
        </clipPath>
      </defs>

      {/* Left Hot Side */}
      <g clipPath={`url(#${id}mhot)`}>
        <Glow x={sunX} y={sunY} r={sunR * (2.2 + hot)} kind="warm" o={0.6 + hot * 0.35} />
        <circle cx={sunX} cy={sunY} r={sunR} fill={hot > 0.7 ? '#FFF7DC' : '#FFC45E'} stroke={INK} strokeWidth={4} />
        <rect x={-W} y={ground} width={W * 3} height={H * 2} fill={hot > 0.7 ? '#FFE099' : '#B84A24'} />
        <line x1={-W} y1={ground} x2={W * 2} y2={ground} stroke="#FFF8DE" strokeWidth={4} opacity={0.8} />
        {/* Wavy heat shimmer lines */}
        {Array.from({ length: 7 }).map((_, i) => {
          const hx = W * 0.08 + i * 75 * u;
          const phase = t / 6 + i;
          return (
            <path
              key={i}
              d={`M ${hx} ${ground - 12} Q ${hx + Math.sin(phase) * 14} ${ground - 70} ${hx - Math.sin(phase) * 10} ${ground - 140}`}
              fill="none"
              stroke="#FFE7A8"
              strokeWidth={3}
              opacity={0.25 + hot * 0.4}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Right Cold Side */}
      <g clipPath={`url(#${id}mcold)`}>
        <rect x={-W} y={ground} width={W * 3} height={H * 2} fill="#0F172D" />
        <line x1={-W} y1={ground} x2={W * 2} y2={ground} stroke="#90EAFF" strokeWidth={4} opacity={0.85} />
        <Glow x={W * 0.78} y={ground - 40} r={280 * u} kind="cool" o={0.25 + cold * 0.45} />
        {/* Frost crystal spikes rising along the icy ground */}
        {[0.58, 0.67, 0.76, 0.86, 0.94].map((fx, i) => {
          const fh = (38 + (i % 3) * 24) * (0.4 + cold * 0.75) * u;
          return (
            <polygon
              key={i}
              points={`${W * fx - 18},${ground} ${W * fx},${ground - fh} ${W * fx + 18},${ground}`}
              fill="#7BE4FF"
              stroke={INK}
              strokeWidth={3.5}
              opacity={0.82}
            />
          );
        })}
      </g>

      {/* Vertical Split Divider Line */}
      <line x1={splitX} y1={-H * 0.2} x2={splitX} y2={H * 1.2} stroke={PALETTE.cream} strokeWidth={4} />
      <circle cx={splitX} cy={vert ? ground - 460 : H * 0.48} r={9} fill={PALETTE.cream} stroke={INK} strokeWidth={3.5} />

      <MidAtmosphere
        id={id}
        t={t}
        W={W}
        H={H}
        seed={83}
        lights={[
          [sunX, sunY, 440 * u],
          [W * 0.76, ground - 100, 360 * u],
        ]}
        veilOpacity={0.26}
      />
    </g>
  );
};

const SpinSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const day = clamp(Number(sp.day ?? 0.5));
  const cx = W * 0.5;
  const cy = vert ? ground - 455 : H * 0.45;
  const sunX = W * 0.11;

  if (layer === 'far') {
    return <DeepCosmos id={id} t={t} W={W} H={H} seed={907} starCount={100} rayX={sunX} rayY={cy} rayColor="#FFE49E" rayOpacity={0.13} glowKind="warm" glowOpacity={0.42} />;
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const ringR = (vert ? 168 : 205) * u;
  const ballR = (vert ? 84 : 100) * u;
  const activeSegs = Math.round(prog * 58);
  const dotAngle = (prog * 2 * Math.PI) + t * 0.015;
  const dotX = cx + Math.cos(dotAngle) * (ballR * 0.68);
  const dotY = cy + Math.sin(dotAngle) * (ballR * 0.28);

  return (
    <g>
      {/* Tiny Sun far left */}
      <Glow x={sunX} y={cy} r={120 * u} kind="warm" o={0.75} />
      <circle cx={sunX} cy={cy} r={24 * u} fill="#FFE288" stroke={INK} strokeWidth={3.5} />

      {/* Plane 1: Big cream 58-day clock-face ring around Mercury */}
      <circle cx={cx} cy={cy} r={ringR + 18 * u} fill="none" stroke="#2D365A" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={ringR - 18 * u} fill="none" stroke="#2D365A" strokeWidth={2.5} />
      {Array.from({ length: 58 }).map((_, i) => {
        const ang = (i / 58) * Math.PI * 2 - Math.PI / 2;
        const lit = i < activeSegs;
        return (
          <line
            key={i}
            x1={cx + Math.cos(ang) * (ringR - 12 * u)}
            y1={cy + Math.sin(ang) * (ringR - 12 * u)}
            x2={cx + Math.cos(ang) * (ringR + 12 * u)}
            y2={cy + Math.sin(ang) * (ringR + 12 * u)}
            stroke={lit ? PALETTE.gold : PALETTE.cream}
            strokeWidth={lit ? 5 : 2.5}
            strokeLinecap="round"
            opacity={lit ? 0.98 : 0.25}
          />
        );
      })}

      {/* Plane 2: Slowly rotating Mercury ball + gold surface marker dot */}
      <MercurySphere
        id={`${id}sp`}
        cx={cx}
        cy={cy}
        r={ballR}
        spinOffset={prog + t * 0.002}
        terminatorShift={lerp(-0.15, 0.12, day)}
        baseColor={day > 0.6 ? '#ADB3C4' : '#7E8496'}
        shadowColor={day > 0.6 ? '#0C0E18' : '#171A2B'}
        rimColor="#FFE29E"
        rimOpacity={0.55 + day * 0.45}
        sunOnLeft
      />
      <circle cx={dotX} cy={dotY} r={10 * u} fill={PALETTE.gold} stroke={INK} strokeWidth={3} />

      {/* Plane 3: Ground deck */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#111428" rim={PALETTE.gold} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={97} lights={[[cx, cy, ringR * 1.9], [sunX, cy, 240 * u]]} veilOpacity={0.34} />
    </g>
  );
};

const CraterSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.16);
  const ice = clamp(Number(sp.ice ?? 0.8));

  if (layer === 'far') {
    return (
      <g>
        <DeepCosmos id={id} t={t} W={W} H={H} seed={1009} starCount={115} topColor="#050610" bottomColor="#0C1124" rayX={W * 0.08} rayY={H * 0.16} rayColor="#FFF0C4" rayOpacity={0.12} glowKind="cool" glowOpacity={0.25} />
      </g>
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="rock" />;

  const rimY = vert ? ground - 520 : H * 0.42;
  const floorY = ground - 16;
  const cx = W * 0.5;
  const beamEndX = lerp(W * 0.36, W * 0.62, prog);

  return (
    <g>
      {/* Plane 1: Far sunlit mountain rim */}
      <path
        d={`M ${-W * 0.3} ${rimY + 40} L ${W * 0.15} ${rimY - 12} L ${W * 0.32} ${rimY + 28} L ${W * 0.68} ${rimY + 25} L ${W * 0.86} ${rimY - 16} L ${W * 1.3} ${rimY + 40} L ${W * 1.3} ${ground} L ${-W * 0.3} ${ground} Z`}
        fill="#1F2438"
        stroke={INK}
        strokeWidth={4}
      />

      {/* Grazing low-angle sunbeam along the top rim (never reaching the crater floor) */}
      <Cone d={`M -160 ${rimY - 110} L ${beamEndX} ${rimY - 6} L ${beamEndX} ${rimY + 32} L -160 ${rimY - 18} Z`} o={0.34} />
      <path d={`M ${W * 0.05} ${rimY} L ${W * 0.25} ${rimY - 10} M ${W * 0.72} ${rimY + 20} L ${W * 0.92} ${rimY - 12}`} stroke="#FFE8B0" strokeWidth={4.5} strokeLinecap="round" opacity={0.85} />

      {/* Plane 2: Deep pitch-black terraced crater walls & glowing cyan polar ice crystals on floor */}
      <path
        d={`M ${-W * 0.25} ${rimY + 10} L ${W * 0.18} ${rimY + 22} L ${W * 0.32} ${floorY} L ${W * 0.68} ${floorY} L ${W * 0.82} ${rimY + 20} L ${W * 1.25} ${rimY + 10} L ${W * 1.25} ${ground + 40} L ${-W * 0.25} ${ground + 40} Z`}
        fill="#0D0F1C"
        stroke={INK}
        strokeWidth={4}
      />

      {/* Cyan Ice Crystals on the dark crater floor */}
      <Glow x={cx} y={floorY - 18} r={240 * u} kind="cool" o={0.3 + ice * 0.55} />
      {[-120, -68, -20, 32, 85, 130].map((dx, i) => {
        const ch = (26 + (i % 3) * 14) * u;
        const cw = (12 + (i % 2) * 5) * u;
        const tw = 0.6 + 0.4 * Math.sin(t / 8 + i * 1.9);
        return (
          <g key={i} transform={`translate(${cx + dx * u} ${floorY})`}>
            <polygon
              points={`${-cw},4 0,${-ch} ${cw},4`}
              fill={i % 2 ? '#8AF0FF' : '#4AD8FF'}
              stroke={INK}
              strokeWidth={3.5}
              opacity={0.45 + ice * 0.55}
            />
            <circle cx={0} cy={-ch * 0.6} r={3.5 * u} fill="#FFFFFF" opacity={ice * tw} />
          </g>
        );
      })}

      {/* Plane 3: Dark crater floor */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#080912" rim="#6EEBFF" />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={109} lights={[[cx, floorY - 30, 340 * u], [W * 0.25, rimY, 320 * u]]} veilOpacity={0.44} />
    </g>
  );
};

const FaultSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const prog = shotProg(sp.t, p, 0.14);
  const spark = clamp(Number(sp.spark ?? 0));
  const dim = Number(sp.dim ?? 0) > 0.5;
  const cx = W * 0.5;
  const cy = vert ? ground - 455 : H * 0.45;
  const sc = (vert ? 0.85 : 1.05) * u;

  if (layer === 'far') {
    return (
      <DeepCosmos
        id={id}
        t={t}
        W={W}
        H={H}
        seed={1103}
        starCount={90}
        rayX={cx}
        rayY={cy}
        rayColor={spark > 0.3 ? PALETTE.orange : PALETTE.cyan}
        rayOpacity={0.09}
        glowKind={spark > 0.3 ? 'warm' : 'cool'}
        glowOpacity={0.34}
      />
    );
  }
  if (layer === 'near') return <EdgeSilhouettes W={W} H={H} ground={ground} kind="tech" />;

  const driftX = (prog - 0.5) * 40 * u + Math.sin(t / 22) * 6;
  const driftY = Math.cos(t / 19) * 5;
  const nozzlePower = dim ? 0.12 : clamp(1 - spark * 0.65);

  // Flickering spark vertices between right solar wing root and body power box
  const jx = (k: number) => (rnd(Math.floor(t / 2), k) - 0.5) * 18;
  const jy = (k: number) => (rnd(Math.floor(t / 2) + 7, k) - 0.5) * 18;
  const boltD = `M ${58 * sc} ${-8 * sc} L ${42 * sc + jx(1)} ${-20 * sc + jy(1)} L ${30 * sc + jx(2)} ${-4 * sc + jy(2)} L ${16 * sc} ${-16 * sc}`;

  return (
    <g>
      {/* Plane 1: Faint power telemetry grid */}
      <circle cx={cx} cy={cy} r={240 * sc} fill="none" stroke="#28325A" strokeWidth={2} strokeDasharray="8 12" />

      {/* Plane 2: Big boxy Transfer Module with 2 dark wings & 4 ion nozzles */}
      <g transform={`translate(${cx + driftX} ${cy + driftY}) rotate(${lerp(-3, 5, prog)})`}>
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${side * 64 * sc} 0) scale(${side} 1)`}>
            <rect x={0} y={-8 * sc} width={16 * sc} height={16 * sc} fill="#9AA6C0" stroke={INK} strokeWidth={3.5} />
            <rect x={14 * sc} y={-34 * sc} width={185 * sc} height={68 * sc} rx={5} fill="#1A223D" stroke={INK} strokeWidth={4} />
            {[0.25, 0.5, 0.75].map((f, idx) => (
              <line key={idx} x1={14 * sc + 185 * sc * f} y1={-32 * sc} x2={14 * sc + 185 * sc * f} y2={32 * sc} stroke="#3B5694" strokeWidth={2.5} />
            ))}
            <line x1={16 * sc} y1={0} x2={196 * sc} y2={0} stroke="#3B5694" strokeWidth={2.5} />
          </g>
        ))}

        {/* Big Boxy Gold Body */}
        <rect x={-64 * sc} y={-58 * sc} width={128 * sc} height={116 * sc} rx={8} fill="#DF9C30" stroke={INK} strokeWidth={4} />
        <rect x={-48 * sc} y={-42 * sc} width={96 * sc} height={84 * sc} rx={4} fill="#F2BE54" stroke={INK} strokeWidth={2.5} />
        {/* Small Power Unit Box on the body */}
        <rect x={12 * sc} y={-32 * sc} width={38 * sc} height={32 * sc} rx={4} fill="#46516E" stroke={INK} strokeWidth={3.5} />
        <circle cx={31 * sc} cy={-16 * sc} r={5 * sc} fill={spark > 0.2 ? PALETTE.red : PALETTE.cyan} />

        {/* Four Round Ion-Thruster Nozzles + xenon / dimmed ember glow */}
        {[-42, -14, 14, 42].map((nx, idx) => (
          <g key={idx} transform={`translate(${nx * sc} ${62 * sc})`}>
            <Glow x={0} y={12 * sc} r={34 * sc} kind={dim ? 'red' : 'cool'} o={dim ? 0.25 : 0.7 * nozzlePower} />
            <circle cx={0} cy={0} r={12 * sc} fill="#36405A" stroke={INK} strokeWidth={3.5} />
            <circle cx={0} cy={0} r={6 * sc} fill={dim ? '#8F3629' : '#5EF0FF'} opacity={dim ? 0.55 : nozzlePower} />
          </g>
        ))}

        {/* Crackling Amber Electric Spark */}
        {spark > 0.05 ? (
          <g>
            <Glow x={38 * sc} y={-12 * sc} r={90 * sc} kind="warm" o={0.85 * spark} />
            <path d={boltD} fill="none" stroke="#FF8C2E" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={spark} />
            <path d={boltD} fill="none" stroke="#FFF4AE" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={spark} />
          </g>
        ) : null}
      </g>

      {/* Plane 3: Ground deck */}
      <StageDeck id={id} ground={ground} W={W} H={H} fill="#101326" rim={spark > 0.3 ? PALETTE.orange : PALETTE.cyan} translucent />
      <MidAtmosphere id={id} t={t} W={W} H={H} seed={117} lights={[[cx, cy, 460 * sc]]} veilOpacity={0.36} />
    </g>
  );
};

export const SETS_A: Registry['sets'] = {
  approach: ApproachSet,
  stackview: StackviewSet,
  route: RouteSet,
  sunfall: SunfallSet,
  energy: EnergySet,
  mercury: MercurySet,
  compare: CompareSet,
  thermo: ThermoSet,
  spin: SpinSet,
  crater: CraterSet,
  fault: FaultSet,
};
