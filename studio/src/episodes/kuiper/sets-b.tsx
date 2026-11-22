import React from 'react';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import { Glow, LightVeil, Dust, Cone } from '../../engine/light';
import { Stars } from '../../engine/kit';
import { GroundPlane, PALETTE, FONTS } from '../../brand';
import type { SetProps } from './render';
import { num, str, glowKind, glowCol, WorldTag as Tag, SpaceFar } from './sets-a';

// ============================================================================ 8. ARROKOTH
export const ArrokothSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.5);
  const spLabel = num(sp, 'label', 0);
  const gMode = str(sp, 'glow', 'gold');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = vert ? H * 0.5 : H * 0.41;
  const rot = -18 + Math.sin(t / 40) * 6 + lerp(spT - 0.15, spT, easeInOut(p)) * 16;

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={311} n={120} o={0.88} gx={cx + 90 * u} gy={cy - 40 * u} gr={280 * u} gMode={gMode} rayLen={780 * u} />;
  }

  if (layer === 'mid') {
    const lblPop = spLabel > 0.5 ? backOut(clamp((p - 0.12) / 0.25)) : 0;
    return (
      <g>
        <GroundPlane y={ground} fill="#141122" rim="#B87A68" />

        {/* Contact binary Arrokoth: two touching reddish-brown snowman lobes */}
        <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${u})`}>
          <Glow x={85} y={-20} r={190} kind="warm" o={0.35} />
          {/* Large lobe (left/bottom) + Small lobe (right/top) unified silhouette */}
          <path
            d="M -145 -8 C -148 -80 -85 -124 -12 -118 C 32 -114 54 -84 62 -60 C 86 -78 136 -74 162 -40 C 186 -6 178 46 142 68 C 108 88 64 74 52 54 C 34 88 -12 114 -64 106 C -118 98 -143 52 -145 -8 Z"
            fill="#8D3B2C"
            stroke="#121019"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {/* Warm sunlit rim on upper-right edge */}
          <path
            d="M -98 -96 C -48 -118 12 -106 48 -68 C 78 -72 132 -66 154 -36 C 172 -12 170 22 152 44"
            fill="none"
            stroke="#E08B6C"
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.75}
          />
          {/* Dark shaded underside */}
          <path
            d="M -132 16 C -118 76 -48 102 18 78 C 44 68 56 46 66 56 C 94 74 134 68 152 44 C 122 86 64 76 52 54 C 30 92 -28 112 -74 100 C -118 88 -136 48 -132 16 Z"
            fill="#572017"
            opacity={0.7}
          />
          {/* Bright frosty neck collar */}
          <path d="M 52 -54 Q 68 0 48 48" fill="none" stroke="#EBC9B7" strokeWidth={6} strokeLinecap="round" opacity={0.65} />
          {/* Faint craters & surface ridges */}
          <ellipse cx={-56} cy={-38} rx={22} ry={15} fill="#6E2B1F" stroke="#451811" strokeWidth={2.5} opacity={0.75} />
          <ellipse cx={-28} cy={38} rx={15} ry={11} fill="#6E2B1F" stroke="#451811" strokeWidth={2.5} opacity={0.7} />
          <ellipse cx={116} cy={-16} rx={14} ry={10} fill="#6E2B1F" stroke="#451811" strokeWidth={2.5} opacity={0.7} />
          <circle cx={-88} cy={14} r={9} fill="#6E2B1F" stroke="#451811" strokeWidth={2} opacity={0.65} />
        </g>

        {/* Optional chips naming the two lobes */}
        {lblPop > 0.01 ? (
          <g opacity={lblPop}>
            <line x1={cx - 80 * u} y1={cy - 105 * u} x2={cx - 125 * u} y2={cy - 148 * u} stroke={PALETTE.gold} strokeWidth={2.5} />
            <Tag x={cx - 140 * u} y={cy - 165 * u} text="BIGGER LOBE" color={PALETTE.gold} s={0.9 * lblPop} />
            <line x1={cx + 125 * u} y1={cy - 55 * u} x2={cx + 160 * u} y2={cy - 115 * u} stroke={PALETTE.cream} strokeWidth={2.5} />
            <Tag x={cx + 170 * u} y={cy - 135 * u} text="SMALLER LOBE" color={PALETTE.cream} s={0.9 * lblPop} />
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[cx, cy, 430 * u]]} o={0.38} />
        <Dust t={t} seed={317} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={26} o={0.35} />
      </g>
    );
  }

  return (
    <g>
      <polygon points={`-160,${H + 100} -160,${ground - 10 * u} 135,${ground + 50 * u} 230,${H + 100}`} fill="#0A0712" stroke="#040308" strokeWidth={4} />
      <Dust t={t * 1.4} seed={321} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={14} o={0.42} />
    </g>
  );
};

// ============================================================================ 9. DUST
export const DustSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.6);
  const spZoom = num(sp, 'zoom', 0.3);
  const gMode = str(sp, 'glow', 'cyan');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cy = vert ? H * 0.48 : H * 0.39;
  const z = lerp(Math.max(0, spZoom - 0.15), spZoom, easeInOut(p));
  const planeProg = lerp(Math.max(0.1, spT - 0.3), spT, easeInOut(p));

  if (layer === 'far') {
    return (
      <g>
        <defs>
          <linearGradient id={`${id}strat`} x1="0" y1={-H * 0.5} x2="0" y2={ground} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#070816" />
            <stop offset="45%" stopColor="#122752" />
            <stop offset="82%" stopColor="#3B7DC2" />
            <stop offset="100%" stopColor="#84C6F2" />
          </linearGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}strat)`} />
        <Stars seed={349} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 1.1} t={t} n={75} o={0.68} />
        {/* Curved luminous Earth limb */}
        <ellipse cx={W * 0.5} cy={ground + 680 * u} rx={1700 * u} ry={790 * u} fill="#183666" stroke="#7AE0FF" strokeWidth={5} opacity={0.85} />
        <Glow x={W * 0.5} y={ground - 80 * u} r={420 * u} kind={glowKind(gMode)} o={0.28} />
      </g>
    );
  }

  if (layer === 'mid') {
    const planeX = lerp(W * 0.18, W * 0.72, planeProg) + Math.sin(t / 35) * 14 * u;
    const planeY = cy - 45 * u + Math.cos(t / 28) * 8 * u;
    const lensScale = z > 0.35 ? backOut(clamp((z - 0.35) / 0.35)) : 0;
    const grainCx = W * 0.5;
    const grainCy = vert ? H * 0.5 : H * 0.42;

    return (
      <g>
        <GroundPlane y={ground} fill="#131F3A" rim="#7ACFFF" />

        {/* ER-2 Twin-tail Spy Plane Silhouette + Wing Collector Plate */}
        <g transform={`translate(${planeX} ${planeY}) scale(${(1 + z * 0.5) * u})`} opacity={Math.max(0.25, 1 - z * 0.75)}>
          {/* Contrail */}
          <line x1={-520} y1={6} x2={-75} y2={6} stroke="#E4F4FF" strokeWidth={4} opacity={0.3} strokeLinecap="round" />
          {/* Sleek ER-2 body + long glider wings + twin tail */}
          <path
            d="M -120 4 L -70 2 L -52 -18 L -38 -18 L -28 2 L 62 -4 L 118 4 L 62 12 L -32 10 L -110 10 Z"
            fill="#1D2538"
            stroke="#0A0D18"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {/* Long narrow wing */}
          <polygon points="-24,4 -8,-58 14,-58 8,4" fill="#2A354F" stroke="#0A0D18" strokeWidth={3.5} />
          <polygon points="-16,10 -2,52 16,52 10,10" fill="#2A354F" stroke="#0A0D18" strokeWidth={3.5} />
          {/* Twin tail boom */}
          <path d="M -88 2 L -98 -24 L -82 -24 L -72 2 Z" fill="#2A354F" stroke="#0A0D18" strokeWidth={3.5} />
          {/* Collector plate under wing */}
          <rect x={-4} y={14} width={28} height={14} rx={3} fill={PALETTE.cyan} stroke="#0A0D18" strokeWidth={3} />
          <Glow x={10} y={21} r={34} kind="cool" o={0.55} />
          {/* NASA stripe */}
          <line x1={-32} y1={4} x2={68} y2={4} stroke="#EAEFF8" strokeWidth={2.5} />
        </g>

        {/* Drifting dust specks that stream toward collector */}
        {Array.from({ length: 42 }).map((_, i) => {
          const sx = ((rnd(361, i) * W + t * (1.2 + rnd(362, i))) % (W + 120)) - 60;
          const sy = cy - 170 * u + rnd(363, i) * 320 * u + Math.sin(t / 15 + i) * 10 * u;
          return <circle key={i} cx={sx} cy={sy} r={(1.8 + rnd(364, i) * 2.5) * u} fill={i % 3 ? '#DCE2F0' : glowCol(gMode)} opacity={0.78} />;
        })}

        {/* Zoom-in glowing dust grain with solar energetic particle tracks */}
        {lensScale > 0.01 ? (
          <g transform={`translate(${grainCx} ${grainCy}) scale(${lensScale * (0.75 + 0.45 * z) * u})`}>
            <Glow x={0} y={0} r={210} kind={glowKind(gMode)} o={0.65} />
            <circle cx={0} cy={0} r={118} fill="#10182E" opacity={0.92} stroke={PALETTE.cyan} strokeWidth={4} />
            {/* Faceted dust grain */}
            <polygon
              points="-58,-18 -26,-56 32,-48 64,-8 44,48 -14,58 -54,28"
              fill="#6D615B"
              stroke="#EAEFF8"
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <polygon points="-26,-56 32,-48 12,-4 -40,-14" fill="#998A82" opacity={0.8} />
            <polygon points="12,-4 64,-8 44,48 -14,58" fill="#4D423E" opacity={0.75} />
            {/* Solar energetic particle tracks glowing inside grain */}
            {z > 0.65 ? (
              <g stroke={gMode === 'gold' ? PALETTE.gold : PALETTE.cyan} strokeWidth={3} strokeLinecap="round" opacity={0.6 + 0.35 * Math.sin(t / 5)}>
                <line x1={-38} y1={-22} x2={26} y2={34} />
                <line x1={-12} y1={-40} x2={38} y2={12} />
                <line x1={-32} y1={14} x2={16} y2={-36} />
                <line x1={-4} y1={42} x2={46} y2={-16} />
              </g>
            ) : null}
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[z > 0.5 ? grainCx : planeX, z > 0.5 ? grainCy : planeY, 450 * u]]} o={0.34} />
        <Dust t={t} seed={373} x0={-100} y0={cy - 200 * u} w={W + 200} h={420 * u} n={24} o={0.4} />
      </g>
    );
  }

  return (
    <g>
      <ellipse cx={W * 0.08} cy={ground + 50 * u} rx={160 * u} ry={40 * u} fill="#0B1328" opacity={0.7} filter="url(#blur10)" />
      <ellipse cx={W * 0.92} cy={ground + 55 * u} rx={180 * u} ry={44 * u} fill="#0B1328" opacity={0.7} filter="url(#blur10)" />
      <Dust t={t * 1.4} seed={379} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.45} />
    </g>
  );
};

// ============================================================================ 10. ISOTOPE
export const IsotopeSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.8);
  const spHeavy = num(sp, 'heavy', 0.8);
  const spRef = num(sp, 'ref', 0);
  const gMode = str(sp, 'glow', 'gold');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = vert ? H * 0.51 : H * 0.42;
  const R = 215 * u;

  const heavyFill = lerp(Math.max(0.1, spHeavy - 0.25), spHeavy, easeOut(p));
  const fallAnim = easeOut(clamp(p / 0.65));

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={401} n={80} o={0.75} gx={cx} gy={cy} gr={280 * u} gMode={gMode} />;
  }

  if (layer === 'mid') {
    const lightCount = 6;
    const heavyCount = Math.max(2, Math.round(heavyFill * 11));
    const normY = cy + 32 * u;
    const refPop = spRef > 0.5 ? backOut(clamp((p - 0.15) / 0.28)) : 0;

    return (
      <g>
        <defs>
          <clipPath id={`${id}scrClip`}>
            <circle cx={cx} cy={cy} r={R - 10 * u} />
          </clipPath>
        </defs>
        <GroundPlane y={ground} fill="#12162A" rim="#6A84B8" />

        {/* Big round detector screen */}
        <Glow x={cx} y={cy} r={R + 70 * u} kind={glowKind(gMode)} o={0.32} />
        <circle cx={cx} cy={cy} r={R + 14 * u} fill="#252B42" stroke="#10121C" strokeWidth={4} />
        <circle cx={cx} cy={cy} r={R} fill="#111526" stroke="#10121C" strokeWidth={4} />

        <g clipPath={`url(#${id}scrClip)`}>
          {/* Grid lines inside screen */}
          {[-100, -50, 0, 50, 100].map((d, i) => (
            <line key={i} x1={cx - R} y1={cy + d * u} x2={cx + R} y2={cy + d * u} stroke="#232D4D" strokeWidth={2} />
          ))}

          {/* Dashed NORMAL threshold line */}
          <line x1={cx - R + 22 * u} y1={normY} x2={cx + R - 22 * u} y2={normY} stroke={spHeavy < 0.5 ? PALETTE.red : PALETTE.cream} strokeWidth={3} strokeDasharray="8 6" opacity={0.85} />
          <text x={cx - R + 34 * u} y={normY - 10 * u} fontFamily={FONTS.ui} fontSize={16 * u} fontWeight={700} fill={PALETTE.cream} opacity={0.8}>
            NORMAL
          </text>

          {/* Left Column: Light Oxygen (small pale balls) */}
          {Array.from({ length: lightCount }).map((_, i) => {
            const targetY = cy + 140 * u - i * 24 * u;
            const drop = Math.max(0, 1 - clamp((fallAnim * 1.4 - i * 0.08)));
            const by = targetY - drop * 180 * u + Math.sin(t / 12 + i) * 1.5 * u;
            return <circle key={i} cx={cx - 64 * u} cy={by} r={10 * u} fill="#D5E4FF" stroke="#121019" strokeWidth={3} />;
          })}

          {/* Right Column: Heavy Oxygen (bigger gold balls) */}
          {Array.from({ length: heavyCount }).map((_, i) => {
            const targetY = cy + 138 * u - i * 29 * u;
            const drop = Math.max(0, 1 - clamp((fallAnim * 1.3 - i * 0.06 + (1 - spT) * 0.1)));
            const by = targetY - drop * 210 * u + Math.sin(t / 11 + i * 1.3) * 1.5 * u;
            return (
              <g key={i}>
                <circle cx={cx + 26 * u} cy={by} r={14.5 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={3.5} />
                <circle cx={cx + 21 * u} cy={by - 5 * u} r={4 * u} fill="#FFF4C8" opacity={0.85} />
              </g>
            );
          })}

          {/* GENESIS reference bar when sp.ref == 1 */}
          {refPop > 0.01 ? (
            <g transform={`translate(${cx + 114 * u} ${cy + 146 * u}) scale(${refPop})`}>
              <rect x={-18} y={-114 * u} width={36} height={114 * u} rx={6} fill={PALETTE.cyan} stroke="#121019" strokeWidth={3.5} opacity={0.9} />
              <text x={0} y={24 * u} textAnchor="middle" fontFamily={FONTS.ui} fontSize={15 * u} fontWeight={700} fill={PALETTE.cyan}>
                GENESIS
              </text>
            </g>
          ) : null}
        </g>

        <Tag x={cx - 64 * u} y={cy + R - 26 * u} text="LIGHT O" color={PALETTE.cream} s={0.78} />
        <Tag x={cx + 42 * u} y={cy + R - 26 * u} text="HEAVY O" color={PALETTE.gold} s={0.78} />

        <LightVeil id={`${id}veil`} lights={[[cx, cy, 360 * u]]} o={0.38} />
        <Dust t={t} seed={409} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={22} o={0.32} />
      </g>
    );
  }

  return (
    <g>
      <circle cx={W * 0.05} cy={ground + 34 * u} r={44 * u} fill="#0A0D1C" opacity={0.7} filter="url(#blur6)" />
      <Dust t={t * 1.4} seed={415} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.4} />
    </g>
  );
};

// ============================================================================ 11. MASS
export const MassSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.8);
  const spNow = num(sp, 'now', 1);
  const spThen = num(sp, 'then', 0);
  const gMode = str(sp, 'glow', 'cyan');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cxL = W * (vert ? 0.31 : 0.34);
  const cxR = W * (vert ? 0.67 : 0.65);
  const cy = vert ? H * 0.51 : H * 0.42;

  const thenPop = spThen > 0.5 ? backOut(clamp((p - 0.12) / 0.25)) : 0;
  const nowPop = spNow > 0.5 ? backOut(clamp((p - 0.05) / 0.22)) : 0;
  const thin = lerp(0.5, 1.0, spT * easeInOut(p));

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <Stars seed={433} x0={-W * 0.7} y0={-H * 0.7} w={W * 2.4} h={H * 2.2} t={t} n={110} o={0.85} />
        <Glow x={cxL} y={cy} r={220 * u} kind="cool" o={0.35} />
        <Glow x={cxR} y={cy} r={240 * u} kind={glowKind(gMode)} o={0.32} />
      </g>
    );
  }

  if (layer === 'mid') {
    return (
      <g>
        <GroundPlane y={ground} fill="#10162B" rim="#6280B8" />

        {/* Left: Big blue-green Earth ball */}
        <g transform={`translate(${cxL} ${cy}) scale(${u})`}>
          <Glow x={0} y={0} r={160} kind="cool" o={0.55} />
          <circle cx={0} cy={0} r={104} fill="#2A7AC4" stroke="#121019" strokeWidth={4} />
          <path d="M -52 -46 Q -18 -20 -38 24 Q -6 56 38 18 Q 68 -16 26 -62 Z" fill="#46B87F" />
          <path d="M -78 24 Q -48 44 -58 70" fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.5} />
          <Tag x={0} y={136} text="1 x EARTH" color={PALETTE.cyan} s={0.95} />
        </g>

        {/* Ghost massive ancient Kuiper Belt ring (7-10 Earth masses) */}
        {thenPop > 0.01 ? (
          <g transform={`translate(${cxR} ${cy}) scale(${thenPop})`} opacity={0.85}>
            <ellipse cx={0} cy={0} rx={215 * u} ry={130 * u} fill="none" stroke={PALETTE.gold} strokeWidth={24 * u} opacity={0.14} />
            <ellipse cx={0} cy={0} rx={215 * u} ry={130 * u} fill="none" stroke={PALETTE.gold} strokeWidth={3.5} strokeDasharray="10 8" />
            {Array.from({ length: 68 }).map((_, i) => {
              const a = rnd(441, i) * Math.PI * 2 + t * 0.005;
              const rr = 195 + rnd(442, i) * 42;
              return <circle key={i} cx={Math.cos(a) * rr * u} cy={Math.sin(a) * rr * 0.6 * u} r={2.8 * u} fill={PALETTE.gold} opacity={0.45} />;
            })}
            <Tag x={0} y={-155 * u} text="ONCE: 7-10 x EARTH" color={PALETTE.gold} s={0.9 * thenPop} />
          </g>
        ) : null}

        {/* Thin present-day ring of icy dots */}
        <g transform={`translate(${cxR} ${cy})`}>
          <ellipse cx={0} cy={0} rx={125 * u} ry={75 * u} fill="none" stroke={PALETTE.cream} strokeWidth={2.5} opacity={0.4} />
          {Array.from({ length: Math.round(72 - 22 * thin) }).map((_, i) => {
            const a = rnd(451, i) * Math.PI * 2 + t * 0.009;
            const rr = (114 + rnd(452, i) * 24) * u;
            return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr * 0.6} r={2.2 * u} fill="#DCE8FF" opacity={0.85} />;
          })}
          {nowPop > 0.01 ? (
            <g opacity={nowPop}>
              <path d={`M ${-95 * u} ${95 * u} L ${-95 * u} ${110 * u} L ${95 * u} ${110 * u} L ${95 * u} ${95 * u}`} fill="none" stroke={PALETTE.cream} strokeWidth={3} />
              <Tag x={0} y={136 * u} text="TODAY: <= 10% EARTH" color={PALETTE.cream} s={0.88 * nowPop} />
            </g>
          ) : null}
        </g>

        <LightVeil id={`${id}veil`} lights={[[cxL, cy, 340 * u], [cxR, cy, 420 * u]]} o={0.36} />
        <Dust t={t} seed={461} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={24} o={0.32} />
      </g>
    );
  }

  return <Dust t={t * 1.4} seed={467} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.42} />;
};

// ============================================================================ 12. SCATTERED
export const ScatteredSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.8);
  const spTicks = num(sp, 'ticks', 1);
  const gMode = str(sp, 'glow', 'gold');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const sunX = W * 0.16;
  const cy = vert ? H * 0.5 : H * 0.41;
  const rx = W * 0.34;
  const ry = 95 * u;
  const ellCx = sunX + rx - 22 * u;

  const ang = lerp(Math.max(0.2, spT - 0.35), spT, easeInOut(p)) * Math.PI * 1.2 + Math.sin(t / 38) * 0.18;
  const sedX = ellCx + Math.cos(ang) * rx;
  const sedY = cy + Math.sin(ang) * ry;
  const tickPop = spTicks > 0.5 ? backOut(clamp((p - 0.1) / 0.25)) : 0;

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={491} n={115} o={0.86} gx={sunX} gy={cy} gr={190 * u} gMode={gMode} rayLen={780 * u} />;
  }

  if (layer === 'mid') {
    return (
      <g>
        <GroundPlane y={ground} fill="#101529" rim="#6A84B8" />

        {/* Tiny Sun + Neptune ring on far left */}
        <Glow x={sunX} y={cy} r={60 * u} kind="warm" o={0.75} />
        <circle cx={sunX} cy={cy} r={13 * u} fill={PALETTE.gold} stroke="#121019" strokeWidth={3.5} />
        <ellipse cx={sunX} cy={cy} rx={48 * u} ry={30 * u} fill="none" stroke="#4AA8FF" strokeWidth={3} opacity={0.85} />

        {/* Sedna's ultra-long oval orbit */}
        <ellipse cx={ellCx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#E08C74" strokeWidth={3.5} strokeDasharray="10 6" opacity={0.85} />

        {/* Sedna reddish dot */}
        <Glow x={sedX} y={sedY} r={44 * u} kind={glowKind(gMode)} o={0.75} />
        <circle cx={sedX} cy={sedY} r={12 * u} fill="#E6694E" stroke="#121019" strokeWidth={4} />
        <Tag x={sedX} y={sedY - 30 * u} text="SEDNA" color={PALETTE.orange} s={0.82} />

        {/* Cream AU tick marks (76 AU & 1,200 AU) */}
        {tickPop > 0.01 ? (
          <g opacity={tickPop}>
            <line x1={ellCx - rx} y1={cy - 22 * u} x2={ellCx - rx} y2={cy + 75 * u} stroke={PALETTE.cream} strokeWidth={2.5} />
            <Tag x={ellCx - rx} y={cy + 94 * u} text="76 AU" color={PALETTE.cream} s={0.82 * tickPop} />
            <line x1={ellCx + rx} y1={cy - 22 * u} x2={ellCx + rx} y2={cy + 75 * u} stroke={PALETTE.gold} strokeWidth={2.5} />
            <Tag x={ellCx + rx} y={cy + 94 * u} text="1,200 AU" color={PALETTE.gold} s={0.82 * tickPop} />
          </g>
        ) : null}

        <LightVeil id={`${id}veil`} lights={[[sunX, cy, 260 * u], [sedX, sedY, 260 * u]]} o={0.36} />
        <Dust t={t} seed={499} x0={-100} y0={cy - 220 * u} w={W + 200} h={460 * u} n={24} o={0.34} />
      </g>
    );
  }

  return <Dust t={t * 1.4} seed={503} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.44} />;
};

// ============================================================================ 13. LAB
export const LabSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const spAlert = num(sp, 'alert', 0);
  const spOk = num(sp, 'ok', 0);
  const u = Math.min(W, H) / 1080;
  const vert = H > W;
  const wallTop = ground - (vert ? 560 : 480) * u;
  const scrY = ground - (vert ? 430 : 370) * u;
  const isOk = spOk >= 1;
  const isAlert = spAlert > 0 && !isOk;
  const blink = 0.55 + 0.45 * Math.sin(t / 4);
  const statusCol = isOk ? PALETTE.green : isAlert ? PALETTE.gold : PALETTE.cyan;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#141A2E" />
        {/* Lab back wall paneling */}
        <rect x={-W} y={wallTop} width={W * 3} height={ground - wallTop + 40} fill="#1E2742" stroke="#0C0F1D" strokeWidth={4} />
        {[-0.3, 0, 0.3, 0.6, 0.9, 1.2].map((fx, i) => (
          <line key={i} x1={W * fx} y1={wallTop} x2={W * fx} y2={ground} stroke="#141B30" strokeWidth={4} />
        ))}
        {/* Ceiling light strips */}
        {[0.25, 0.5, 0.75].map((fx, i) => (
          <g key={i}>
            <rect x={W * fx - 90 * u} y={wallTop + 14 * u} width={180 * u} height={14 * u} rx={6} fill="#DCE8FF" stroke="#0C0F1D" strokeWidth={3.5} />
            <Glow x={W * fx} y={wallTop + 20 * u} r={190 * u} kind="cool" o={0.35} />
            <Cone d={`M ${W * fx - 80 * u} ${wallTop + 28 * u} L ${W * fx + 80 * u} ${wallTop + 28 * u} L ${W * fx + 220 * u} ${ground} L ${W * fx - 220 * u} ${ground} Z`} o={0.14} />
          </g>
        ))}

        {/* Wall screen 1: Soft Chart / Isotope Spectrum */}
        <g transform={`translate(${W * 0.25} ${scrY}) scale(${u})`}>
          <rect x={-135} y={-78} width={270} height={156} rx={12} fill="#111526" stroke="#0B0D18" strokeWidth={4} />
          <polyline
            points="-110,36 -75,18 -40,28 -10,-38 25,14 60,-22 105,24"
            fill="none"
            stroke={statusCol}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {isAlert ? (
            <g opacity={blink}>
              <circle cx={88} cy={-44} r={16} fill={PALETTE.gold} stroke="#0B0D18" strokeWidth={3} />
              <line x1={99} y1={-33} x2={112} y2={-20} stroke={PALETTE.cream} strokeWidth={5} strokeLinecap="round" />
            </g>
          ) : null}
          {isOk ? <circle cx={96} cy={-48} r={9} fill={PALETTE.green} /> : null}
        </g>

        {/* Wall screen 2: Electron-Microscope Grain Image */}
        <g transform={`translate(${W * 0.75} ${scrY}) scale(${u})`}>
          <rect x={-135} y={-78} width={270} height={156} rx={12} fill="#111526" stroke="#0B0D18" strokeWidth={4} />
          <circle cx={0} cy={0} r={54} fill="#18223D" stroke={statusCol} strokeWidth={3} />
          <polygon points="-28,-12 -8,-30 24,-22 34,8 14,32 -20,24" fill="#6D615B" stroke="#DCE8FF" strokeWidth={3} />
          <line x1={-18} y1={-8} x2={14} y2={18} stroke={statusCol} strokeWidth={2.5} />
          <line x1={-6} y1={-22} x2={22} y2={4} stroke={statusCol} strokeWidth={2.5} />
        </g>
      </g>
    );
  }

  if (layer === 'mid') {
    const deskY = ground - 150 * u;
    const deskW = vert ? 760 * u : 1040 * u;
    const steam = Math.sin(t / 9) * 6;

    return (
      <g>
        {/* Carpet GroundPlane with pale rim */}
        <GroundPlane y={ground} fill="#252E47" rim="#96B2DF" />

        {/* Desk / planetary-science workbench (plane 2) */}
        <g transform={`translate(${W * 0.5} ${deskY})`}>
          <rect x={-deskW * 0.44} y={14 * u} width={22 * u} height={ground - deskY - 14 * u} fill="#192036" stroke="#0B0D18" strokeWidth={4} />
          <rect x={deskW * 0.44 - 22 * u} y={14 * u} width={22 * u} height={ground - deskY - 14 * u} fill="#192036" stroke="#0B0D18" strokeWidth={4} />
          <rect x={-deskW * 0.5} y={0} width={deskW} height={22 * u} rx={6} fill="#364263" stroke="#0B0D18" strokeWidth={4} />

          {/* Microscope on left */}
          <g transform={`translate(${-deskW * 0.34} 0) scale(${u})`}>
            <rect x={-32} y={-12} width={64} height={12} rx={3} fill="#DCE4F5" stroke="#0B0D18" strokeWidth={3.5} />
            <path d="M 16 -12 L 22 -72 L -6 -84" fill="none" stroke="#B6C3DC" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={-12} y1={-96} x2={-2} y2={-48} stroke="#232A40" strokeWidth={14} strokeLinecap="round" />
            <rect x={-24} y={-34} width={34} height={6} fill={PALETTE.cyan} stroke="#0B0D18" strokeWidth={2.5} />
            <Glow x={-6} y={-38} r={34} kind="cool" o={0.55} />
          </g>

          {/* Two laptops */}
          <g transform={`translate(${-deskW * 0.12} 0) scale(${u})`}>
            <polygon points="-44,0 -36,-54 38,-54 44,0" fill="#232C44" stroke="#0B0D18" strokeWidth={3.5} />
            <rect x={-32} y={-48} width={64} height={40} rx={3} fill={statusCol} opacity={0.8} />
          </g>
          <g transform={`translate(${deskW * 0.16} 0) scale(${u})`}>
            <polygon points="-42,0 -34,-50 36,-50 42,0" fill="#232C44" stroke="#0B0D18" strokeWidth={3.5} />
            <rect x={-30} y={-44} width={60} height={36} rx={3} fill="#4AA8FF" opacity={0.75} />
          </g>

          {/* Sticky note & Coffee mug on right */}
          <rect x={deskW * 0.28} y={-30 * u} width={34 * u} height={30 * u} rx={3} fill={PALETTE.gold} stroke="#0B0D18" strokeWidth={3} />
          <g transform={`translate(${deskW * 0.37} 0) scale(${u})`}>
            <rect x={-16} y={-34} width={32} height={34} rx={5} fill={PALETTE.cream} stroke="#0B0D18" strokeWidth={3.5} />
            <path d="M 16 -26 Q 28 -26 28 -16 Q 28 -6 16 -6" fill="none" stroke={PALETTE.cream} strokeWidth={5} />
            <path d={`M -6 -42 Q ${-10 + steam} -56 -2 -68`} fill="none" stroke="#DCE8FF" strokeWidth={2.5} opacity={0.55} strokeLinecap="round" />
            <path d={`M 6 -44 Q ${10 - steam} -58 4 -72`} fill="none" stroke="#DCE8FF" strokeWidth={2.5} opacity={0.45} strokeLinecap="round" />
          </g>
        </g>

        <LightVeil id={`${id}veil`} lights={[[W * 0.5, ground - 160 * u, 520 * u], [W * 0.25, scrY, 260 * u], [W * 0.75, scrY, 260 * u]]} o={0.3} />
        <Dust t={t} seed={521} x0={-100} y0={wallTop} w={W + 200} h={ground - wallTop} n={22} o={0.32} />
      </g>
    );
  }

  // near: carpet border edge + blurred foreground lab corner
  return (
    <g>
      <polygon points={`-160,${H + 100} -160,${ground + 24 * u} 180,${ground + 48 * u} 240,${H + 100}`} fill="#0C1020" stroke="#05070E" strokeWidth={4} />
      <polygon points={`${W + 160},${H + 100} ${W + 160},${ground + 24 * u} ${W - 180},${ground + 48 * u} ${W - 240},${H + 100}`} fill="#0C1020" stroke="#05070E" strokeWidth={4} />
      <Dust t={t * 1.3} seed={527} x0={0} y0={ground - 120 * u} w={W} h={220 * u} n={10} o={0.35} />
    </g>
  );
};

// ============================================================================ 14. TIMELINE
export const TimelineSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const spT = num(sp, 't', 0.5);
  const spNow = num(sp, 'now', 0.5);
  const gMode = str(sp, 'glow', 'gold');
  const vert = H > W;
  const u = Math.min(W, H) / 1080;
  const cy = vert ? H * 0.51 : H * 0.42;

  const panOffset = (0.5 - lerp(Math.max(0.1, spT - 0.12), spT, easeInOut(p))) * 150 * u;
  const x0 = W * 0.1 + panOffset;
  const x1 = W * 0.9 + panOffset;
  const nowPos = lerp(Math.max(0.08, spNow - 0.16), spNow, easeInOut(p));
  const curX = lerp(x0, x1, nowPos);

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={541} n={100} o={0.82} gx={curX} gy={cy} gr={240 * u} gMode={gMode} rayLen={720 * u} />;
  }

  if (layer === 'mid') {
    const milestones = [
      { f: 0.14, yr: '4.5 BYA', up: true },
      { f: 0.3, yr: '1930', up: false },
      { f: 0.48, yr: '1951', up: true },
      { f: 0.66, yr: '1977', up: false },
      { f: 0.8, yr: '2019', up: true },
      { f: 0.93, yr: '2026', up: false },
    ];
    const pulse = (t % 28) / 28;

    return (
      <g>
        <GroundPlane y={ground} fill="#10152B" rim="#6A85BC" />

        {/* Gold horizontal timeline axis */}
        <line x1={x0 - 40 * u} y1={cy} x2={x1 + 40 * u} y2={cy} stroke={PALETTE.gold} strokeWidth={5} strokeLinecap="round" />

        {milestones.map((m, i) => {
          const mx = lerp(x0, x1, m.f);
          const active = Math.abs(m.f - nowPos) < 0.11;
          const dy = m.up ? -56 * u : 56 * u;
          return (
            <g key={i}>
              <line x1={mx} y1={cy} x2={mx} y2={cy + dy * 0.72} stroke={active ? PALETTE.cyan : PALETTE.cream} strokeWidth={2.5} opacity={0.85} />
              <circle cx={mx} cy={cy} r={(active ? 13 : 9.5) * u} fill={active ? PALETTE.cyan : PALETTE.gold} stroke="#121019" strokeWidth={3.5} />
              <Tag x={mx} y={cy + dy} text={m.yr} color={active ? PALETTE.cyan : PALETTE.cream} s={0.84} />
            </g>
          );
        })}

        {/* Gliding bright cyan marker + pulse */}
        <Glow x={curX} y={cy} r={62 * u} kind="cool" o={0.75} />
        <circle cx={curX} cy={cy} r={(16 + pulse * 26) * u} fill="none" stroke={PALETTE.cyan} strokeWidth={3} opacity={1 - pulse} />
        <polygon points={`${curX},${cy - 22 * u} ${curX + 12 * u},${cy} ${curX},${cy + 22 * u} ${curX - 12 * u},${cy}`} fill={PALETTE.cyan} stroke="#121019" strokeWidth={3.5} />

        <LightVeil id={`${id}veil`} lights={[[curX, cy, 420 * u]]} o={0.36} />
        <Dust t={t} seed={557} x0={-100} y0={cy - 200 * u} w={W + 200} h={420 * u} n={22} o={0.34} />
      </g>
    );
  }

  return <Dust t={t * 1.4} seed={563} x0={0} y0={cy - 180 * u} w={W} h={380 * u} n={12} o={0.42} />;
};

// ============================================================================ 15. VOID
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const gMode = str(sp, 'glow', 'gold');
  const u = Math.min(W, H) / 1080;
  const cx = W * 0.5;
  const cy = H * 0.42;
  const col = glowCol(gMode);

  if (layer === 'far') {
    return <SpaceFar W={W} H={H} t={t} seed={601} n={24} o={0.52} gx={cx} gy={cy - 40 * u} gr={340 * u} gMode={gMode} rayLen={1050 * u} rayO={0.11} />;
  }

  if (layer === 'mid') {
    return (
      <g>
        <GroundPlane y={ground} fill="#0D0F21" rim={col} />
        <ellipse cx={cx} cy={ground + 8 * u} rx={260 * u} ry={22 * u} fill={col} opacity={0.12} filter="url(#blur6)" />
        <LightVeil id={`${id}veil`} lights={[[cx, ground - 160 * u, 540 * u]]} o={0.42} />
        <Dust t={t} seed={607} x0={-100} y0={cy - 240 * u} w={W + 200} h={ground - cy + 200 * u} n={20} o={0.34} />
      </g>
    );
  }

  return <Dust t={t * 1.4} seed={613} x0={0} y0={cy - 200 * u} w={W} h={420 * u} n={10} o={0.38} />;
};

export const SETS_B = {
  arrokoth: ArrokothSet,
  dust: DustSet,
  isotope: IsotopeSet,
  mass: MassSet,
  scattered: ScatteredSet,
  lab: LabSet,
  timeline: TimelineSet,
  void: VoidSet,
};
