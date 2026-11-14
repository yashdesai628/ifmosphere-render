import React from 'react';
import { GroundPlane, PALETTE } from '../../brand';
import { clamp, easeOut, lerp, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust } from '../../engine/light';
import { Stars, Rays } from '../../engine/kit';
import type { SetProps } from './render';
import { MeteorStream } from './sets-a';

const OUTLINE = '#121019';

export const SpaceSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const view = (sp.view as 'comet' | 'trail' | 'orbits' | 'far' | undefined) ?? 'comet';
  const paramT = Number(sp.t ?? 0.5);
  const k = Math.min(W, H) / 1080;

  if (layer === 'far') {
    const rayCol = view === 'far' ? '#7BB6FF' : view === 'trail' ? '#FFD98E' : '#FFE2B0';
    return (
      <g>
        <defs>
          <radialGradient id={`${id}neb`} cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={view === 'far' ? '#131736' : '#18143B'} />
            <stop offset="100%" stopColor={PALETTE.space} />
          </radialGradient>
        </defs>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}neb)`} />
        <Stars seed={907} x0={-1000} y0={-1000} w={W + 2000} h={H + 2000} t={t} n={170} o={0.92} />
        <Rays x={view === 'orbits' ? 0.34 * W : 0.1 * W} y={0.42 * H} t={t} len={2000} n={12} o={0.09} color={rayCol} />
      </g>
    );
  }

  if (layer === 'mid') {
    const u = clamp(paramT + p * 0.06);
    const cyMid = (H > W ? 0.42 : 0.42) * H;

    return (
      <g>
        {view === 'comet' ? (
          <g>
            {/* Sun glow far left */}
            <Glow x={0.05 * W} y={cyMid} r={340 * k} kind="warm" o={0.78} />
            <circle cx={0.05 * W} cy={cyMid} r={54 * k} fill="#FFE29E" stroke={OUTLINE} strokeWidth={4} />

            {/* Moving comet along curved path */}
            {(() => {
              const cx = lerp(0.28 * W, 0.78 * W, u);
              const cy = cyMid - Math.sin(u * Math.PI) * 55 * k;
              const ionAng = -8 + Math.sin(t / 15) * 1.5;
              return (
                <g transform={`translate(${cx} ${cy}) scale(${k})`}>
                  {/* Straight white-blue ion tail */}
                  <g transform={`rotate(${ionAng})`}>
                    <polygon points="0,-10 380,-38 380,38 0,10" fill="#70D6FF" opacity={0.22} />
                    <polygon points="0,-4 340,-14 340,14 0,4" fill="#C4F1FF" opacity={0.48} />
                  </g>
                  {/* Curved pale-yellow dust tail */}
                  <path
                    d="M -4 8 Q 160 12 365 88 L 350 132 Q 145 48 -8 18 Z"
                    fill="#FFE2A0"
                    opacity={0.32}
                  />
                  {/* Shedding grit specks along dust tail */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const prog = ((t * 0.012 + rnd(41, i)) % 1);
                    const gx = prog * 340;
                    const gy = 16 + prog * prog * 88 + (rnd(42, i) - 0.5) * 26 * prog;
                    return <circle key={i} cx={gx} cy={gy} r={1.8 + rnd(43, i) * 2.2} fill="#FFF2CE" opacity={0.85 * (1 - prog * 0.6)} />;
                  })}
                  {/* Bright coma glow & dark irregular rocky nucleus */}
                  <Glow x={0} y={0} r={95} kind="cool" o={0.62} />
                  <Glow x={0} y={0} r={48} kind="warm" o={0.48} />
                  <polygon
                    points="-22,-6 -10,-20 12,-16 24,2 14,19 -12,17"
                    fill="#2B2840"
                    stroke={OUTLINE}
                    strokeWidth={4}
                    strokeLinejoin="round"
                  />
                  <path d="M -22 -6 L -10 -20 L 12 -16" fill="none" stroke="#D8F4FF" strokeWidth={3} opacity={0.85} strokeLinecap="round" />
                </g>
              );
            })()}
          </g>
        ) : null}

        {view === 'trail' ? (
          <g>
            {/* Curved wide translucent river of rubble */}
            {(() => {
              const x0 = -0.08 * W;
              const y0 = 0.72 * H;
              const cx1 = 0.45 * W;
              const cy1 = 0.46 * H;
              const x1 = 1.08 * W;
              const y1 = 0.22 * H;
              const dense = paramT >= 0.85 ? 1 : paramT <= 0.62 && paramT >= 0.35 ? 0.55 : 0.78;
              const earthX = lerp(0.54 * W, 0.74 * W, u);
              const earthY = lerp(0.56 * H, 0.28 * H, u);
              return (
                <g>
                  <path
                    d={`M ${x0} ${y0} Q ${cx1} ${cy1} ${x1} ${y1}`}
                    fill="none"
                    stroke="#485B9E"
                    strokeWidth={135 * k}
                    opacity={0.18 * dense}
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${x0} ${y0} Q ${cx1} ${cy1} ${x1} ${y1}`}
                    fill="none"
                    stroke="#FFE2B0"
                    strokeWidth={62 * k}
                    strokeDasharray={`${14 * k} ${20 * k}`}
                    opacity={0.28 * dense}
                    strokeLinecap="round"
                  />
                  {/* Streaming rubble particles along Bezier curve */}
                  {Array.from({ length: Math.round(78 * dense) }).map((_, i) => {
                    const b = ((i / (78 * dense)) + t * 0.0022 * (0.7 + rnd(51, i) * 0.5)) % 1;
                    const inv = 1 - b;
                    const px = inv * inv * x0 + 2 * inv * b * cx1 + b * b * x1;
                    const py = inv * inv * y0 + 2 * inv * b * cy1 + b * b * y1 + (rnd(52, i) - 0.5) * 92 * k;
                    const r = (2 + rnd(53, i) * 3.5) * k;
                    return (
                      <circle
                        key={i}
                        cx={px}
                        cy={py}
                        r={r}
                        fill={i % 4 === 0 ? '#9CEBFF' : '#FFE3A8'}
                        opacity={0.45 + 0.45 * Math.sin(t / 8 + i)}
                      />
                    );
                  })}
                  {/* Clump hotspot when direct hit (t>=0.9) */}
                  {paramT >= 0.9 ? <Glow x={0.62 * W} y={0.4 * H} r={210 * k} kind="warm" o={0.48} /> : null}
                  {/* Earth disc crossing the dust band */}
                  <g transform={`translate(${earthX} ${earthY}) scale(${k})`}>
                    <Glow x={0} y={0} r={88} kind="cool" o={0.5} />
                    <circle r={34} fill="#2568B5" stroke={OUTLINE} strokeWidth={4} />
                    <path d="M -16 -12 Q -2 -22 10 -8 Q 4 10 -12 6 Z M 8 6 Q 20 2 22 18 Q 10 24 4 16 Z" fill="#3CC28E" stroke={OUTLINE} strokeWidth={2.5} />
                    <circle r={34} fill="none" stroke="#9CEBFF" strokeWidth={2.5} opacity={0.7} />
                    {/* Directional orbit arrow showing head-on path */}
                    <path d="M -52 30 L 42 -26" fill="none" stroke="#78E4FF" strokeWidth={3} strokeDasharray="6 6" opacity={0.7} />
                  </g>
                </g>
              );
            })()}
          </g>
        ) : null}

        {view === 'orbits' ? (
          <g>
            {(() => {
              const sunX = 0.34 * W;
              const sunY = 0.46 * H;
              const earthRx = 135 * k;
              const earthRy = 86 * k;
              const earthAng = -0.7 + t * 0.015;
              const ex = sunX + Math.cos(earthAng) * earthRx;
              const ey = sunY + Math.sin(earthAng) * earthRy;
              // Comet long oval ellipse stretching right
              const comCx = sunX + 240 * k;
              const comCy = sunY - 22 * k;
              const comRx = 335 * k;
              const comRy = 148 * k;
              const comAng = Math.PI - u * Math.PI * 1.45;
              const kx = comCx + Math.cos(comAng) * comRx;
              const ky = comCy + Math.sin(comAng) * comRy;
              // Jupiter on wide outer arc
              const jupX = 0.78 * W;
              const jupY = 0.31 * H + Math.sin(t / 28) * 10 * k;
              return (
                <g>
                  {/* Jupiter wide outer orbit arc */}
                  <ellipse
                    cx={sunX + 80 * k}
                    cy={sunY}
                    rx={520 * k}
                    ry={285 * k}
                    fill="none"
                    stroke="#F2B33D"
                    strokeWidth={2.5}
                    strokeDasharray="10 12"
                    opacity={0.35}
                  />
                  {/* Comet eccentric 33.3-yr ellipse */}
                  <g transform={`translate(${comCx} ${comCy}) rotate(-8)`}>
                    <ellipse
                      cx={0}
                      cy={0}
                      rx={comRx}
                      ry={comRy}
                      fill="none"
                      stroke="#70D6FF"
                      strokeWidth={3}
                      strokeDasharray="8 8"
                      opacity={0.65}
                    />
                  </g>
                  {/* Earth inner orbit ellipse */}
                  <ellipse
                    cx={sunX}
                    cy={sunY}
                    rx={earthRx}
                    ry={earthRy}
                    fill="none"
                    stroke={PALETTE.cream}
                    strokeWidth={3}
                    strokeDasharray="7 7"
                    opacity={0.7}
                  />
                  {/* Central Sun */}
                  <Glow x={sunX} y={sunY} r={145 * k} kind="warm" o={0.7} />
                  <circle cx={sunX} cy={sunY} r={34 * k} fill="#FFE082" stroke={OUTLINE} strokeWidth={4} />
                  {/* Earth dot */}
                  <circle cx={ex} cy={ey} r={14 * k} fill="#2FB7A6" stroke={OUTLINE} strokeWidth={3.5} />
                  {/* Comet dot with small tail */}
                  <Glow x={kx} y={ky} r={45 * k} kind="cool" o={0.55} />
                  <circle cx={kx} cy={ky} r={10 * k} fill="#C4F1FF" stroke={OUTLINE} strokeWidth={3} />
                  {/* Jupiter on outer ring */}
                  <Glow x={jupX} y={jupY} r={95 * k} kind="warm" o={0.48} />
                  <circle cx={jupX} cy={jupY} r={28 * k} fill="#E6A95C" stroke={OUTLINE} strokeWidth={4} />
                  <line x1={jupX - 24 * k} y1={jupY - 6 * k} x2={jupX + 24 * k} y2={jupY - 6 * k} stroke="#FFF0D4" strokeWidth={4 * k} opacity={0.75} />
                  <line x1={jupX - 23 * k} y1={jupY + 8 * k} x2={jupX + 23 * k} y2={jupY + 8 * k} stroke="#BA6738" strokeWidth={4 * k} opacity={0.8} />
                </g>
              );
            })()}
          </g>
        ) : null}

        {view === 'far' ? (
          <g>
            {(() => {
              const sunX = 0.13 * W;
              const sunY = 0.44 * H;
              const satX = 0.55 * W;
              const satY = 0.43 * H;
              const comX = lerp(0.75 * W, 0.87 * W, u);
              const comY = 0.37 * H;
              const ringPulse = 1 + 0.16 * Math.sin(t / 10);
              return (
                <g>
                  {/* Distance tether line */}
                  <line x1={sunX} y1={sunY} x2={comX} y2={comY} stroke="#6E82BD" strokeWidth={2.5} strokeDasharray="6 10" opacity={0.45} />
                  {/* Tiny Sun + inner orbit hint */}
                  <circle cx={sunX} cy={sunY} r={46 * k} fill="none" stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="4 6" opacity={0.35} />
                  <Glow x={sunX} y={sunY} r={80 * k} kind="warm" o={0.62} />
                  <circle cx={sunX} cy={sunY} r={14 * k} fill="#FFE294" stroke={OUTLINE} strokeWidth={3} />
                  {/* Saturn with rings */}
                  <g transform={`translate(${satX} ${satY}) scale(${k})`}>
                    <Glow x={0} y={0} r={90} kind="warm" o={0.32} />
                    <ellipse cx={0} cy={0} rx={68} ry={18} transform="rotate(-18)" fill="none" stroke="#F0D090" strokeWidth={8} opacity={0.8} />
                    <circle r={28} fill="#DFB66E" stroke={OUTLINE} strokeWidth={4} />
                    <path d="M -64 21 A 68 18 -18 0 0 64 -21" fill="none" stroke="#F7DFAC" strokeWidth={6} strokeLinecap="round" />
                  </g>
                  {/* Tiny pin-prick comet past Saturn */}
                  <g transform={`translate(${comX} ${comY}) scale(${k})`}>
                    <circle r={24 * ringPulse} fill="none" stroke="#78E4FF" strokeWidth={2.5} opacity={0.55} />
                    <Glow x={0} y={0} r={34} kind="cool" o={0.55} />
                    <circle r={5} fill="#E6FAFF" stroke={OUTLINE} strokeWidth={2} />
                  </g>
                </g>
              );
            })()}
          </g>
        ) : null}

        {/* Subtle space stage baseline at ground so standing Pip in S36 looks anchored */}
        <line x1={-1200} y1={ground} x2={W + 1200} y2={ground} stroke="#6D83B8" strokeWidth={2} strokeDasharray="8 12" opacity={0.18} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [0.5 * W, 0.44 * H, Math.max(W, H) * 0.48],
          ]}
          o={0.28}
        />
        <Dust t={t} seed={933} x0={-100} y0={0} w={W + 200} h={H} n={34} o={0.42} />
      </g>
    );
  }

  // near: faint cosmic specks & silhouettes at outer horizontal edges
  return (
    <g>
      {[0.05, 0.94].map((fx, i) => (
        <polygon
          key={i}
          points="-12,-6 4,-14 14,4 -4,12"
          transform={`translate(${fx * W} ${0.28 * H + i * 260 + Math.sin(t / 22 + i) * 18}) scale(${1.3 * k})`}
          fill="#0B0917"
          stroke={OUTLINE}
          strokeWidth={3}
          opacity={0.75}
        />
      ))}
    </g>
  );
};

export const AtmosSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const rate = Number(sp.rate ?? 0.6);
  const speed = Number(sp.speed ?? 0.8);
  const k = Math.min(W, H) / 1080;

  // Curved Earth edge anchored so its top crest touches near `ground - 25*k`
  const edgeR = Math.max(W, H) * 1.45;
  const edgeCx = W * 0.5;
  const edgeCy = ground + edgeR - 26 * k;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={PALETTE.space} />
        <Stars seed={419} x0={-1000} y0={-1000} w={W + 2000} h={ground + 800} t={t} n={160} o={0.9} />
        <Rays x={W * 0.85} y={0.08 * H} t={t} len={1700} n={12} o={0.08} color="#7CEBFF" />
      </g>
    );
  }

  if (layer === 'mid') {
    const count = Math.max(2, Math.round(clamp(rate) * 34));
    const bandR = edgeR + 46 * k;
    return (
      <g>
        <defs>
          <radialGradient id={`${id}earth`} cx="50%" cy="22%" r="75%">
            <stop offset="0%" stopColor="#245B9E" />
            <stop offset="45%" stopColor="#143266" />
            <stop offset="100%" stopColor="#09132B" />
          </radialGradient>
        </defs>
        {/* Outer cyan atmosphere glow band */}
        <circle cx={edgeCx} cy={edgeCy} r={bandR} fill="none" stroke="#2ED4E8" strokeWidth={46 * k} opacity={0.22} filter="url(#blur10)" />
        <circle cx={edgeCx} cy={edgeCy} r={bandR - 8 * k} fill="none" stroke="#8CF2FF" strokeWidth={5 * k} opacity={0.52} />

        {/* Meteors entering steeply from upper right & flaring in the cyan atmosphere band */}
        {Array.from({ length: count }).map((_, i) => {
          const dur = 20 + rnd(61, i) * 24;
          const phase = rnd(62, i) * 400;
          const total = t + phase;
          const cycle = Math.floor(total / dur);
          const prog = (total % dur) / dur;
          const sSeed = 600 + i * 31 + cycle * 149;

          const hitX = W * (0.08 + rnd(sSeed + 1, i) * 0.84);
          // Exact y on the upper atmosphere band arc
          const dxFromC = hitX - edgeCx;
          const hitY = edgeCy - Math.sqrt(Math.max(100, (bandR - 6 * k) * (bandR - 6 * k) - dxFromC * dxFromC));

          const vx = -0.78;
          const vy = 0.62;
          const startDist = (320 + rnd(sSeed + 2, i) * 320) * k;
          const move = easeOut(clamp(prog / 0.72));
          const headDist = startDist * (1 - move);
          const streakLen = (65 + clamp(speed) * 165) * k;

          const hx = hitX - vx * headDist;
          const hy = hitY - vy * headDist;
          const tx = hx - vx * streakLen;
          const ty = hy - vy * streakLen;

          const flare = prog > 0.65 && prog < 0.92 ? Math.sin(((prog - 0.65) / 0.27) * Math.PI) : 0;
          const alpha = prog < 0.12 ? prog / 0.12 : prog > 0.78 ? 1 - (prog - 0.78) / 0.22 : 1;

          return (
            <g key={`${i}-${cycle}`}>
              <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#6CE4FF" strokeWidth={7 * k} strokeLinecap="round" opacity={0.28 * alpha} />
              <line x1={lerp(tx, hx, 0.2)} y1={lerp(ty, hy, 0.2)} x2={hx} y2={hy} stroke="#FFF5D6" strokeWidth={3 * k} strokeLinecap="round" opacity={alpha} />
              <circle cx={hx} cy={hy} r={4 * k} fill="#FFFFFF" opacity={alpha} />
              {flare > 0.01 ? (
                <g transform={`translate(${hitX} ${hitY})`}>
                  <Glow x={0} y={0} r={44 * k * flare} kind="warm" o={0.85 * flare} />
                  <circle r={8 * k * flare} fill="#FFFFFF" opacity={flare} />
                </g>
              ) : null}
            </g>
          );
        })}

        {/* Curved Earth body */}
        <circle cx={edgeCx} cy={edgeCy} r={edgeR} fill={`url(#${id}earth)`} stroke={OUTLINE} strokeWidth={4} />
        <circle cx={edgeCx} cy={edgeCy} r={edgeR} fill="none" stroke="#9FEFFF" strokeWidth={4} opacity={0.75} />

        <LightVeil
          id={`${id}veil`}
          lights={[
            [0.5 * W, ground - 160 * k, 680 * k],
          ]}
          o={0.26}
        />
        <Dust t={t} seed={633} x0={0} y0={ground - 260 * k} w={W} h={240 * k} n={32} o={0.45} />
      </g>
    );
  }

  // near: high-energy spark motes at bottom margins
  return (
    <g>
      <circle cx={0.07 * W} cy={0.85 * H} r={34 * k} fill="#081229" opacity={0.6} filter="url(#blur10)" />
      <circle cx={0.93 * W} cy={0.86 * H} r={38 * k} fill="#081229" opacity={0.6} filter="url(#blur10)" />
    </g>
  );
};

export const CitySet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const clouds = clamp(Number(sp.clouds ?? 0));
  const k = Math.min(W, H) / 1080;

  if (layer === 'far') {
    const s = W / 1920;
    const buildings = [
      { x: -160, w: 180, h: 310, spire: false },
      { x: 10, w: 155, h: 420, spire: true },
      { x: 155, w: 170, h: 270, spire: false },
      { x: 315, w: 140, h: 340, spire: false },
      { x: 450, w: 165, h: 230, spire: false },
      { x: 610, w: 150, h: 205, spire: false },
      { x: 755, w: 175, h: 240, spire: false },
      { x: 925, w: 160, h: 220, spire: false },
      { x: 1080, w: 165, h: 290, spire: false },
      { x: 1240, w: 170, h: 380, spire: true },
      { x: 1405, w: 160, h: 260, spire: false },
      { x: 1560, w: 185, h: 350, spire: false },
      { x: 1740, w: 175, h: 430, spire: false },
      { x: 1910, w: 200, h: 295, spire: false },
    ];
    const cloudCount = clouds <= 0.01 ? 0 : Math.max(3, Math.round(clouds * 14));

    return (
      <g>
        <defs>
          <linearGradient id={`${id}sky`} x1="0" y1={-H * 0.4} x2="0" y2={ground} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={clouds > 0.7 ? '#161724' : '#080614'} />
            <stop offset="65%" stopColor={clouds > 0.7 ? '#242638' : '#12162E'} />
            <stop offset="100%" stopColor={clouds > 0.7 ? '#33364D' : '#26294B'} />
          </linearGradient>
        </defs>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}sky)`} />
        <Stars seed={1966} x0={-1000} y0={-1000} w={W + 2000} h={ground + 800} t={t} n={140} o={0.85 * (1 - clouds * 0.92)} />
        {clouds < 0.7 ? <MeteorStream t={t} W={W} H={H} rate={0.22 * (1 - clouds)} seed={66} /> : null}

        {/* NYC 1966 Skyline with warm lit windows */}
        <g>
          {buildings.map((b, bi) => {
            const bx = b.x * s;
            const bw = b.w * s;
            const bh = b.h * k * 0.85;
            return (
              <g key={bi}>
                <rect x={bx} y={ground - bh} width={bw} height={bh + 40} fill={bi % 2 === 0 ? '#18162C' : '#201D38'} stroke={OUTLINE} strokeWidth={3.5} />
                <line x1={bx} y1={ground - bh} x2={bx + bw} y2={ground - bh} stroke="#8395C4" strokeWidth={2.5} opacity={0.45} />
                {b.spire ? (
                  <g>
                    <polygon points={`${bx + bw * 0.25},${ground - bh} ${bx + bw * 0.5},${ground - bh - 75 * k} ${bx + bw * 0.75},${ground - bh}`} fill="#24203D" stroke={OUTLINE} strokeWidth={3.5} />
                    <line x1={bx + bw * 0.5} y1={ground - bh - 75 * k} x2={bx + bw * 0.5} y2={ground - bh - 115 * k} stroke="#98A9D6" strokeWidth={3} />
                  </g>
                ) : null}
                {/* Warm lit skyscraper windows */}
                {Array.from({ length: 18 }).map((_, wi) => {
                  const wx = bx + 12 * s + ((wi % 4) * (bw - 24 * s)) / 4;
                  const wy = ground - bh + 22 * k + Math.floor(wi / 4) * 34 * k;
                  if (wy > ground - 18 * k || rnd(bi * 17 + 3, wi) < 0.28) return null;
                  const tw = 0.72 + 0.28 * Math.sin(t / 14 + bi + wi);
                  return <rect key={wi} x={wx} y={wy} width={10 * s} height={14 * k} rx={1.5} fill="#FFE090" opacity={0.78 * tw} />;
                })}
              </g>
            );
          })}
        </g>

        {/* Sliding flat dark-grey outlined cloud banks */}
        {cloudCount > 0 ? (
          <g>
            {Array.from({ length: cloudCount }).map((_, ci) => {
              const spanW = W + 900;
              const speed = (1.1 + rnd(71, ci) * 0.9) * (ci % 2 === 0 ? 1 : 0.7);
              const rawX = (rnd(72, ci) * spanW + t * speed) % spanW;
              const cx = rawX - 450;
              const cy = lerp(0.06 * H, ground - 120 * k, rnd(73, ci));
              const cw = (240 + rnd(74, ci) * 260) * k * (0.7 + 0.5 * clouds);
              const ch = (72 + rnd(75, ci) * 44) * k;
              const fill = ci % 2 === 0 ? '#2D3044' : '#242638';
              return (
                <g key={ci} transform={`translate(${cx} ${cy})`} opacity={0.78 + 0.22 * clouds}>
                  <path
                    d={`M ${-cw * 0.5} ${ch * 0.35} C ${-cw * 0.55} ${-ch * 0.2} ${-cw * 0.2} ${-ch * 0.55} ${-cw * 0.02} ${-ch * 0.35} C ${cw * 0.12} ${-ch * 0.72} ${cw * 0.48} ${-ch * 0.45} ${cw * 0.5} ${ch * 0.25} Z`}
                    fill={fill}
                    stroke={OUTLINE}
                    strokeWidth={4}
                    strokeLinejoin="round"
                  />
                  <line x1={-cw * 0.42} y1={ch * 0.32} x2={cw * 0.44} y2={ch * 0.24} stroke="#5F6686" strokeWidth={3} opacity={0.5} strokeLinecap="round" />
                </g>
              );
            })}
            {clouds >= 0.95 ? (
              <rect x={-1600} y={-1600} width={W + 3200} height={ground + 1480} fill="#2A2D3E" opacity={0.45} />
            ) : null}
          </g>
        ) : null}
      </g>
    );
  }

  if (layer === 'mid') {
    const sway = Math.sin(t / 14) * 5;
    const trees = [0.06 * W, 0.14 * W, 0.87 * W, 0.94 * W];
    return (
      <g>
        {/* Bare November Central Park tree silhouettes flanking the Great Lawn */}
        {trees.map((tx, i) => (
          <g key={i} transform={`translate(${tx} ${ground}) scale(${k * (0.9 + (i % 2) * 0.22)})`}>
            <path
              d={`M -9 6 L -6 -130 Q ${-42 + sway * 0.5} -180 ${-68 + sway} -215 M -6 -130 Q ${36 + sway * 0.6} -175 ${64 + sway} -210 M -2 -105 Q ${-22 + sway} -155 ${-18 + sway} -235 M 4 -105 Q ${28 + sway} -160 ${24 + sway} -230`}
              fill="none"
              stroke={OUTLINE}
              strokeWidth={11}
              strokeLinecap="round"
            />
            <path
              d={`M -9 6 L -6 -130 Q ${-42 + sway * 0.5} -180 ${-68 + sway} -215 M -6 -130 Q ${36 + sway * 0.6} -175 ${64 + sway} -210`}
              fill="none"
              stroke="#2C2947"
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Great Lawn with hundreds of tiny warm lantern/flashlight dots (no figures) */}
        <GroundPlane y={ground} fill="#1C2436" rim="#8EA2CC" />
        <g style={{ mixBlendMode: 'screen' }}>
          {Array.from({ length: 145 }).map((_, i) => {
            const dx = -220 + rnd(661, i) * (W + 440);
            const dy = ground + 8 * k + rnd(662, i) * 145 * k;
            const tw = 0.55 + 0.45 * Math.sin(t / (6 + rnd(663, i) * 6) + i * 1.9);
            const col = i % 3 === 0 ? '#FFB84D' : '#FFE49E';
            return <circle key={i} cx={dx} cy={dy} r={(2.1 + rnd(664, i) * 2.2) * k} fill={col} opacity={0.78 * tw} />;
          })}
        </g>

        <LightVeil
          id={`${id}veil`}
          lights={[
            [0.5 * W, ground - 140 * k, 600 * k],
          ]}
          o={0.3 + clouds * 0.14}
        />
        <Dust t={t} seed={671} x0={-100} y0={ground - 360 * k} w={W + 200} h={400 * k} n={30} o={0.42} />
      </g>
    );
  }

  // near: park bench edge & bare branch tip at frame corners
  return (
    <g>
      <path d={`M -300 ${H + 200} L -300 ${ground + 30} L ${0.09 * W} ${ground + 30} L ${0.11 * W} ${H + 200} Z`} fill="#0A0814" stroke={OUTLINE} strokeWidth={4} />
      <path d={`M ${W + 200} ${ground + 26} L ${0.91 * W} ${ground + 26} L ${0.89 * W} ${H + 200} L ${W + 200} ${H + 200} Z`} fill="#0A0814" stroke={OUTLINE} strokeWidth={4} />
    </g>
  );
};

export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glowKey = (sp.glow as 'gold' | 'cyan' | 'red' | undefined) ?? 'gold';
  const accent = glowKey === 'red' ? PALETTE.red : glowKey === 'cyan' ? PALETTE.cyan : PALETTE.gold;
  const glowKind = glowKey === 'red' ? 'red' : glowKey === 'cyan' ? 'cool' : 'warm';
  const k = Math.min(W, H) / 1080;

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <radialGradient id={`${id}bg`} cx="50%" cy="46%" r="65%">
            <stop offset="0%" stopColor={glowKey === 'red' ? '#1A0B1B' : glowKey === 'cyan' ? '#0C162E' : '#151029'} />
            <stop offset="100%" stopColor={PALETTE.space} />
          </radialGradient>
        </defs>
        <rect x={-1600} y={-1600} width={W + 3200} height={H + 3200} fill={`url(#${id}bg)`} />
        <Stars seed={809} x0={-1000} y0={-1000} w={W + 2000} h={H + 2000} t={t} n={26} o={0.35} />
        <Rays x={0.5 * W} y={0.44 * H} t={t} len={1900} n={12} o={0.11} color={accent} />
      </g>
    );
  }

  if (layer === 'mid') {
    const rot = t * 0.16;
    return (
      <g>
        <Glow x={0.5 * W} y={0.44 * H} r={Math.min(W, H) * 0.44} kind={glowKind} o={0.42} />
        {/* Clean concentric radar arcs for subtle data-stage depth */}
        <g transform={`translate(${0.5 * W} ${0.44 * H}) rotate(${rot})`} opacity={0.13}>
          <circle r={240 * k} fill="none" stroke={accent} strokeWidth={2.5} strokeDasharray="18 24" />
          <circle r={390 * k} fill="none" stroke={accent} strokeWidth={2} strokeDasharray="8 28" />
        </g>
        <GroundPlane y={ground} fill="#0F0C20" rim={accent} />
        <LightVeil
          id={`${id}veil`}
          lights={[
            [0.5 * W, 0.48 * H, 650 * k],
          ]}
          o={0.34}
        />
        <Dust t={t} seed={851} x0={-100} y0={0} w={W + 200} h={H} n={24} o={0.35} />
      </g>
    );
  }

  // near: subtle soft edge bokeh specks
  return (
    <g opacity={0.28}>
      <circle cx={0.06 * W} cy={0.34 * H + Math.sin(t / 24) * 18} r={18 * k} fill={accent} filter="url(#blur6)" />
      <circle cx={0.94 * W} cy={0.62 * H + Math.cos(t / 20) * 16} r={22 * k} fill={accent} filter="url(#blur6)" />
    </g>
  );
};
