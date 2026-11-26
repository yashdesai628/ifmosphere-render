import React from 'react';
import { SetProps } from './render';
import { PALETTE, FONTS, GroundPlane } from '../../brand';
import { clamp, easeIn, easeInOut, easeOut, lerp } from '../../engine/anim';
import { Glow, LightVeil, Dust, Cone } from '../../engine/light';
import { DuskSky, Rays, Sun } from '../../engine/kit';
import { DARK_LINE, FreedomShipVector, FullStars, getGlowTheme, HeliSprite } from './sets-helpers';

// ---------------------------------------------------------------- SET 7: control
export const ControlSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const power = clamp(((sp.power as number | undefined) ?? 0.3) + p * 0.08);
  const alarm = clamp((sp.alarm as number | undefined) ?? 0);
  const vert = H > W;

  if (layer === 'far') {
    const sw = vert ? W * 0.84 : W * 0.62;
    const sh = vert ? 260 : 320;
    const sx = W * 0.5 - sw / 2;
    const sy = vert ? H * 0.38 : H * 0.24;
    const alarmPulse = alarm > 0 ? alarm * (0.22 + 0.15 * Math.sin(t / 5)) : 0;

    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#0F1324" />
        {/* Acoustic dark wall panels */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={i}
            x={-200 + i * 190}
            y={-200}
            width={176}
            height={H + 400}
            fill="#151B32"
            stroke="#0A0D1A"
            strokeWidth={4}
          />
        ))}
        {/* Main Mission Control Wall Screen */}
        <Glow x={W * 0.5} y={sy + sh / 2} r={sw * 0.7} kind={alarm > 0.4 ? 'red' : g.kind} o={0.42} />
        <Rays x={W * 0.5} y={sy + sh * 0.45} t={t} len={Math.max(W, H) * 1.1} o={0.08} color={g.ray} />
        <rect x={sx} y={sy} width={sw} height={sh} rx={12} fill="#0B1429" stroke={DARK_LINE} strokeWidth={5} />
        <rect x={sx + 10} y={sy + 10} width={sw - 20} height={sh - 20} rx={6} fill="#0E1B36" stroke="#2D4A7C" strokeWidth={2.5} />

        {/* Left panel on wall screen: SR-1 outline schematic */}
        <g transform={`translate(${sx + sw * 0.26} ${sy + sh * 0.5}) scale(${vert ? 0.36 : 0.48})`}>
          <rect x={-160} y={-32} width={52} height={64} rx={8} fill="none" stroke={PALETTE.cyan} strokeWidth={4} />
          <line x1={-108} y1={0} x2={-42} y2={0} stroke={PALETTE.cyan} strokeWidth={5} />
          <rect x={-42} y={-40} width={140} height={80} rx={6} fill="none" stroke={PALETTE.cyan} strokeWidth={4} />
          <line x1={30} y1={-125} x2={30} y2={125} stroke={PALETTE.gold} strokeWidth={6} />
          <circle cx={-134} cy={0} r={10} fill={alarm > 0.3 ? PALETTE.red : PALETTE.gold} opacity={0.6 + 0.4 * Math.sin(t / 6)} />
        </g>

        {/* Center: Stepped rising power line graph */}
        <g transform={`translate(${sx + sw * 0.46} ${sy + sh * 0.24})`}>
          <rect x={0} y={0} width={sw * 0.28} height={sh * 0.56} fill="#091122" stroke="#28426E" strokeWidth={2} />
          <polyline
            points={`8,${sh * 0.5} ${sw * 0.08},${sh * 0.42} ${sw * 0.14},${lerp(sh * 0.42, sh * 0.24, power)} ${sw * 0.2},${lerp(sh * 0.42, sh * 0.16, power)} ${sw * 0.26},${lerp(sh * 0.42, sh * 0.08, power)}`}
            fill="none"
            stroke={alarm > 0.4 ? PALETTE.red : PALETTE.cyan}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        </g>

        {/* Right: Big round power gauge */}
        <g transform={`translate(${sx + sw * 0.85} ${sy + sh * 0.52})`}>
          <circle r={sh * 0.25} fill="#081020" stroke="#2D4A7C" strokeWidth={4} />
          <circle
            r={sh * 0.25}
            fill="none"
            stroke={alarm > 0.4 ? PALETTE.red : g.color}
            strokeWidth={7}
            strokeDasharray={`${Math.PI * sh * 0.5 * power} 400`}
            transform="rotate(-90)"
          />
          <text y={8} textAnchor="middle" fontFamily={FONTS.ui} fontSize={22} fill={PALETTE.cream}>
            {`${Math.round(power * 100)}%`}
          </text>
        </g>

        {alarm > 0 ? (
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#D82538" opacity={alarmPulse} />
        ) : null}
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        {/* Out-of-focus bottom-left foreground console edge + coffee mug */}
        <g transform={`translate(${W * 0.06} ${H * 0.94})`}>
          <polygon points="-240,180 -180,-35 210,-15 240,180" fill="#090812" />
          <rect x={-18} y={-78} width={44} height={46} rx={6} fill="#0B0A16" />
          <path d="M 24 -68 C 44 -68 44 -42 24 -42" fill="none" stroke="#0B0A16" strokeWidth={7} />
        </g>
      </g>
    );
  }

  const rowX = W * 0.5;
  return (
    <g>
      <GroundPlane y={ground} fill="#1B2138" rim={alarm > 0.4 ? PALETTE.red : PALETTE.cyan} />
      {/* Back row consoles */}
      <g transform={`translate(${rowX} ${ground - 90}) scale(${vert ? 0.62 : 1})`}>
        <rect x={-520} y={-42} width={1040} height={84} rx={8} fill="#252C48" stroke={DARK_LINE} strokeWidth={4} />
        {[-380, -140, 100, 340].map((mx, i) => (
          <g key={i} transform={`translate(${mx} -64)`}>
            <rect x={-72} y={-44} width={144} height={74} rx={6} fill="#13223D" stroke={DARK_LINE} strokeWidth={4} />
            <rect x={-60} y={-32} width={120} height={10} rx={3} fill={i % 2 ? PALETTE.cream : PALETTE.cyan} opacity={0.85} />
            <rect
              x={-60}
              y={-12}
              width={40 + ((t * 3 + i * 27) % 75)}
              height={12}
              rx={3}
              fill={alarm > 0.4 ? PALETTE.red : g.color}
            />
          </g>
        ))}
      </g>

      {/* Front row console + two empty NASA & DOE chairs side by side */}
      <g transform={`translate(${rowX} ${ground}) scale(${vert ? 0.66 : 1})`}>
        <rect x={-460} y={-78} width={920} height={78} rx={8} fill="#2E3758" stroke={DARK_LINE} strokeWidth={4} />
        {[-220, 140].map((cx, i) => (
          <g key={i}>
            {/* Glowing desk monitor */}
            <rect x={cx - 88} y={-130} width={176} height={68} rx={6} fill="#12213B" stroke={DARK_LINE} strokeWidth={4} />
            <rect x={cx - 72} y={-114} width={144} height={14} rx={4} fill={i === 0 ? PALETTE.cyan : PALETTE.gold} opacity={0.85} />
            <circle cx={cx + 58} cy={-80} r={5} fill={alarm > 0.4 ? PALETTE.red : PALETTE.green} opacity={0.5 + 0.5 * Math.sin(t / 4 + i)} />
            {/* Empty operator chair */}
            <g transform={`translate(${cx} -10)`}>
              <rect x={-8} y={-12} width={16} height={24} fill="#181D2F" stroke={DARK_LINE} strokeWidth={3.5} />
              <rect x={-46} y={-92} width={92} height={82} rx={18} fill="#3F4B73" stroke={DARK_LINE} strokeWidth={4} />
              <rect x={-32} y={-78} width={64} height={20} rx={8} fill="#536292" />
            </g>
          </g>
        ))}
      </g>
      <Dust t={t} seed={271} x0={0} y0={120} w={W} h={H - 240} n={24} o={0.35} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [W * 0.5, H * 0.38, 620],
          [W * 0.5, ground - 100, 560],
        ]}
        o={0.36}
      />
    </g>
  );
};

// ---------------------------------------------------------------- SET 8: core
export const CoreSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const power = clamp((sp.power as number | undefined) ?? 0.4);
  const heat = clamp((sp.heat as number | undefined) ?? 0.2);
  const elec = clamp((sp.elec as number | undefined) ?? 0.3);
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#0A0E22" />
        <FullStars t={t} W={W} H={H} seed={179} n={24} o={0.28} />
        <Rays x={W * 0.35} y={H * 0.45} t={t} len={Math.max(W, H) * 1.2} o={0.11} color={g.ray} />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g fill="#0A0916">
        <rect x={-100} y={ground - 120} width={140} height={420} rx={8} />
        <rect x={W - 40} y={ground - 120} width={140} height={420} rx={8} />
      </g>
    );
  }

  const cx = W * 0.5;
  const cy = H * (vert ? 0.48 : 0.47);
  const sc = vert ? 0.58 : 0.96;
  const arrowSlide = (t * (0.6 + power * 3.2)) % 120;
  const spinDeg = t * (1.2 + power * 14);

  return (
    <g>
      <GroundPlane y={ground} fill="#141932" rim={g.color} />
      <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
        {/* Closed Brayton gas loop pipe */}
        <rect x={-210} y={-95} width={310} height={190} rx={36} fill="none" stroke={DARK_LINE} strokeWidth={34} />
        <rect x={-210} y={-95} width={310} height={190} rx={36} fill="none" stroke="#364160" strokeWidth={24} />

        {/* Clockwise heat arrows moving inside the loop */}
        {power > 0.04 ? (
          <g fill="#FF9A42">
            {[-140, -20, 60].map((ax, i) => (
              <polygon
                key={`t${i}`}
                points={`${ax + arrowSlide - 40},-103 ${ax + arrowSlide - 22},-95 ${ax + arrowSlide - 40},-87`}
              />
            ))}
            {[-140, -20, 60].map((ax, i) => (
              <polygon
                key={`b${i}`}
                points={`${-ax - arrowSlide + 40},87 ${-ax - arrowSlide + 22},95 ${-ax - arrowSlide + 40},103`}
              />
            ))}
          </g>
        ) : null}

        {/* Top grey radiator fins dumping heat */}
        <g transform="translate(-55 -135)">
          <rect x={-110} y={-78} width={220} height={68} rx={8} fill="#5C647A" stroke={DARK_LINE} strokeWidth={4} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={-88 + i * 22} y1={-72} x2={-88 + i * 22} y2={-16} stroke="#363D50" strokeWidth={4} />
          ))}
          {heat > 0.05 ? (
            <g>
              <Glow x={0} y={-44} r={140} kind="red" o={heat * 0.55} />
              <rect x={-106} y={-74} width={212} height={60} rx={6} fill="#E84E4E" opacity={heat * 0.58} />
              {[-64, -20, 24, 68].map((hx, i) => {
                const dy = (t * 1.5 + i * 16) % 44;
                return (
                  <path
                    key={i}
                    d={`M ${hx} ${-86 - dy} Q ${hx + 10} ${-102 - dy} ${hx} ${-118 - dy}`}
                    stroke="#FF7D6B"
                    strokeWidth={3.5}
                    fill="none"
                    opacity={heat * 0.85}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          ) : null}
        </g>

        {/* Left: Squat outlined reactor vessel with glowing orange core */}
        <g transform="translate(-250 0)">
          {power > 0.04 ? <Glow x={0} y={0} r={150 + power * 70} kind="warm" o={0.3 + power * 0.6} /> : null}
          <rect x={-82} y={-108} width={164} height={216} rx={24} fill="#6F7991" stroke={DARK_LINE} strokeWidth={4} />
          <rect x={-52} y={-74} width={104} height={148} rx={14} fill="#1E2033" stroke={DARK_LINE} strokeWidth={4} />
          {[-26, 0, 26].map((rx, i) => (
            <rect
              key={i}
              x={rx - 7}
              y={-52}
              width={14}
              height={104}
              rx={6}
              fill={power > 0.04 ? '#FFA23D' : '#3C4259'}
              opacity={power > 0.04 ? 0.5 + 0.5 * power * (0.85 + 0.15 * Math.sin(t / 5 + i)) : 1}
            />
          ))}
          <text y={138} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.gold}>
            REACTOR
          </text>
        </g>

        {/* Center-right: Round outlined turbine wheel */}
        <g transform="translate(105 0)">
          <circle r={68} fill="#7B86A0" stroke={DARK_LINE} strokeWidth={4} />
          <circle r={50} fill="#1A2036" stroke={DARK_LINE} strokeWidth={3.5} />
          <g transform={`rotate(${spinDeg})`}>
            {[0, 45, 90, 135].map((a) => (
              <rect
                key={a}
                x={-6}
                y={-44}
                width={12}
                height={88}
                rx={4}
                fill="#D4DCF0"
                stroke={DARK_LINE}
                strokeWidth={2.5}
                transform={`rotate(${a})`}
              />
            ))}
            <circle r={14} fill={PALETTE.gold} stroke={DARK_LINE} strokeWidth={3} />
          </g>
          <text y={96} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cream}>
            TURBINE
          </text>
        </g>

        {/* Shaft to Generator */}
        <line x1={173} y1={0} x2={220} y2={0} stroke="#A8B3CC" strokeWidth={12} />

        {/* Right: Generator box + cyan electricity bolts along cable */}
        <g transform="translate(278 0)">
          <rect x={-58} y={-68} width={116} height={136} rx={12} fill="#3B4B6E" stroke={DARK_LINE} strokeWidth={4} />
          <rect x={-36} y={-40} width={72} height={80} rx={8} fill="#13223D" stroke={DARK_LINE} strokeWidth={3} />
          <circle cx={0} cy={0} r={18} fill={elec > 0.1 ? PALETTE.cyan : '#2D3A58'} opacity={0.85} />
          <line x1={58} y1={0} x2={210} y2={0} stroke={DARK_LINE} strokeWidth={10} />
          <line x1={58} y1={0} x2={210} y2={0} stroke={elec > 0.05 ? PALETTE.cyan : '#364463'} strokeWidth={4} />
          {elec > 0.05
            ? Array.from({ length: Math.max(1, Math.round(elec * 3)) }).map((_, i) => {
                const bx = 76 + ((t * 5 + i * 48) % 124);
                return (
                  <g key={i} transform={`translate(${bx} -22)`}>
                    <Glow x={0} y={14} r={34} kind="cool" o={0.65} />
                    <polygon
                      points="4,-12 -8,6 2,6 -4,24 12,2 2,2"
                      fill="#62EDFF"
                      stroke={DARK_LINE}
                      strokeWidth={2.5}
                    />
                  </g>
                );
              })
            : null}
          <text y={96} textAnchor="middle" fontFamily={FONTS.ui} fontSize={20} fill={PALETTE.cyan}>
            GENERATOR
          </text>
        </g>
      </g>
      <Dust t={t} seed={283} x0={0} y0={120} w={W} h={H - 220} n={26} o={0.38} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [cx - 250 * sc, cy, 420],
          [cx + 120 * sc, cy, 420],
        ]}
        o={0.32}
      />
    </g>
  );
};

// ---------------------------------------------------------------- SET 9: pad
export const PadSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const lift = clamp((sp.lift as number | undefined) ?? 0);
  const shakeAmt = clamp((sp.shake as number | undefined) ?? 0);
  const vert = H > W;

  if (layer === 'far') {
    const seaY = ground - 150;
    return (
      <g>
        <DuskSky id={`${id}sky`} x0={-W * 0.8} y0={-H * 0.6} w={W * 2.6} h={H * 2.2} horizonY={seaY} />
        <Sun x={W * 0.8} y={seaY - 50} r={52} t={t} />
        <Rays x={W * 0.8} y={seaY - 50} t={t} len={Math.max(W, H) * 1.1} o={0.14} color={g.ray} />
        {/* Dawn ocean band */}
        <rect x={-W} y={seaY} width={W * 3} height={260} fill="#1E2749" />
        <path d={`M ${W * 0.55} ${seaY + 28} L ${W * 0.9} ${seaY + 28}`} stroke="#FFBC7A" strokeWidth={5} opacity={0.45} />
        {/* Distant coastal ridge */}
        <path
          d={`M ${-W * 0.4} ${seaY + 20} L ${W * 0.25} ${seaY - 12} L ${W * 0.62} ${seaY + 14} L ${W * 1.4} ${seaY + 20} Z`}
          fill="#261D3D"
        />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g fill="#120E1E">
        {/* Dark Florida palm fronds & perimeter fence on outer bottom edges */}
        <path d={`M -40 ${ground + 240} L 20 ${ground - 20} L 42 ${ground - 20} L 6 ${ground + 240} Z`} />
        <g transform={`translate(30 ${ground - 20}) rotate(${Math.sin(t / 12) * 3})`}>
          {[-140, -100, -55, -10].map((a, i) => (
            <path key={i} d="M 0 0 Q 55 -28 96 14 Q 44 -4 0 0" transform={`rotate(${a})`} />
          ))}
        </g>
        <path d={`M ${W - 35} ${ground + 240} L ${W - 5} ${ground + 10} L ${W + 25} ${ground + 10} L ${W + 15} ${ground + 240} Z`} />
        <line x1={-200} y1={ground + 95} x2={W + 200} y2={ground + 95} stroke="#120E1E" strokeWidth={6} />
      </g>
    );
  }

  const rocketX = W * (vert ? 0.62 : 0.6);
  const climb = lift > 0.1 ? lerp(0, lift > 0.7 ? -H * 0.92 : -H * 0.48, easeIn(p)) : 0;
  const vibX = Math.sin(t * 2.7) * shakeAmt * 4.5;
  const igniting = lift >= 0.2;

  return (
    <g>
      <GroundPlane y={ground} fill="#2A233E" rim="#FFB15A" />
      {/* Launch pad concrete mound */}
      <polygon
        points={`${rocketX - 240},${ground} ${rocketX - 180},${ground - 36} ${rocketX + 180},${ground - 36} ${rocketX + 240},${ground}`}
        fill="#393252"
        stroke={DARK_LINE}
        strokeWidth={4}
      />

      {/* Grey launch tower */}
      <g transform={`translate(${rocketX - 108} ${ground - 36}) scale(${vert ? 0.82 : 1})`}>
        <rect x={-34} y={-460} width={68} height={460} fill="#50586E" stroke={DARK_LINE} strokeWidth={4} />
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M -32 ${-i * 56} L 32 ${-(i + 1) * 56} M 32 ${-i * 56} L -32 ${-(i + 1) * 56}`}
            stroke="#2B3042"
            strokeWidth={4}
          />
        ))}
        {/* Umbilical swing arms */}
        <line
          x1={32}
          y1={-340}
          x2={igniting ? 14 : 92}
          y2={igniting ? -395 : -340}
          stroke="#7A849D"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle cx={0} cy={-472} r={8} fill={PALETTE.red} opacity={0.4 + 0.6 * Math.sin(t / 5)} />
      </g>

      {/* Steam / smoke billows at base */}
      <g opacity={igniting ? 0.92 : 0.45}>
        {[-120, -60, 0, 75, 140].map((sx, i) => {
          const drift = (t * (igniting ? 2.2 : 0.6) + i * 24) % 130;
          const dir = sx < 0 ? -1 : 1;
          return (
            <circle
              key={i}
              cx={rocketX + sx + dir * drift * 0.7}
              cy={ground - 26 - Math.sin(i + t / 14) * 10}
              r={(igniting ? 46 : 26) + (i % 3) * 14}
              fill="#EAE4DC"
              opacity={0.7 - drift / 260}
            />
          );
        })}
      </g>

      {/* Tall white rocket */}
      <g transform={`translate(${rocketX + vibX} ${ground - 40 + climb}) scale(${vert ? 0.82 : 1})`}>
        {igniting ? (
          <g>
            <Glow x={0} y={85} r={220} kind="warm" o={0.85} />
            <path
              d={`M -34 10 L -56 ${180 + (t % 7) * 8} L 0 ${260 + (t % 5) * 10} L 56 ${180 + (t % 6) * 8} L 34 10 Z`}
              fill="#FF8636"
            />
            <path d="M -20 10 L -28 140 L 0 195 L 28 140 L 20 10 Z" fill="#FFF7D4" />
          </g>
        ) : (
          <Cone d="M -180 -350 L -110 -350 L 30 35 L -65 35 Z" o={0.16} />
        )}
        {/* Side boosters */}
        {[-32, 32].map((bx, i) => (
          <g key={i} transform={`translate(${bx} -120)`}>
            <rect x={-12} y={-90} width={24} height={200} rx={6} fill="#DCE2F0" stroke={DARK_LINE} strokeWidth={4} />
            <polygon points="-12,-90 0,-118 12,-90" fill="#F2F5FC" stroke={DARK_LINE} strokeWidth={4} />
          </g>
        ))}
        {/* Core stage & fairing */}
        <rect x={-22} y={-340} width={44} height={340} fill="#F2F5FC" stroke={DARK_LINE} strokeWidth={4} />
        <rect x={-22} y={-230} width={44} height={24} fill="#2B3042" />
        <path d="M -26 -340 L -26 -396 Q 0 -454 26 -396 L 26 -340 Z" fill="#F6EFE3" stroke={DARK_LINE} strokeWidth={4} />
      </g>

      <Dust t={t} seed={307} x0={0} y0={120} w={W} h={H - 200} n={26} o={0.36} />
      <LightVeil
        id={`${id}veil`}
        lights={[[rocketX, ground - 160 + climb * 0.4, 580]]}
        o={0.28}
      />
    </g>
  );
};

// ---------------------------------------------------------------- SET 10: sky
export const SkySet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const deploy = clamp(((sp.deploy as number | undefined) ?? 0.5) + p * 0.14);
  const vert = H > W;

  if (layer === 'far') {
    const horizon = ground - 90;
    return (
      <g>
        <defs>
          <linearGradient id={`${id}marsSky`} x1="0" y1={-H * 0.5} x2="0" y2={horizon} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#48212C" />
            <stop offset="55%" stopColor="#A24F42" />
            <stop offset="100%" stopColor="#E6966C" />
          </linearGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}marsSky)`} />
        <Glow x={W * 0.22} y={H * 0.25} r={240} kind="cool" o={0.48} />
        <Rays x={W * 0.22} y={H * 0.25} t={t} len={Math.max(W, H) * 1.1} o={0.11} color="#E0ECFF" />
        <circle cx={W * 0.22} cy={H * 0.25} r={34} fill="#F2F7FF" />
        {/* Hazy layered Martian cliffs */}
        <path
          d={`M ${-W * 0.4} ${horizon + 40} L ${W * 0.15} ${horizon - 130} L ${W * 0.34} ${horizon - 130} L ${W * 0.48} ${horizon - 20} L ${W * 0.72} ${horizon - 160} L ${W * 0.94} ${horizon - 160} L ${W * 1.4} ${horizon + 40} Z`}
          fill="#6C2D23"
        />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g stroke="#FFB88A" strokeWidth={3} opacity={0.28} strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = ((t * 14 + i * 210) % (W + 400)) - 200;
          const y = (i * 145) % H;
          return <line key={i} x1={x} y1={y} x2={x + 120} y2={y - 16} />;
        })}
      </g>
    );
  }

  const folded = deploy < 0.55;
  const spin = deploy >= 0.75;
  const spread = easeOut(clamp((deploy - 0.2) / 0.6));
  const capY = H * (vert ? 0.33 : 0.22);

  return (
    <g>
      <GroundPlane y={ground} fill="#883728" rim="#F5A872" />
      {/* Open capsule descending above */}
      <g transform={`translate(${W * 0.58} ${capY + Math.sin(t / 14) * 5})`}>
        <path d="M -62 0 L -38 -46 L 38 -46 L 62 0 Z" fill="#8B94A8" stroke={DARK_LINE} strokeWidth={4} />
        {deploy >= 0.22 ? (
          <path d="M -56 18 Q 0 38 56 18" stroke="#C9643B" strokeWidth={10} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M -66 4 Q 0 22 66 4" stroke="#C9643B" strokeWidth={11} fill="none" strokeLinecap="round" />
        )}
      </g>

      {/* Three Ingenuity helicopters dropping, unfolding, spinning */}
      {deploy >= 0.22
        ? [-1, 0, 1].map((slot, i) => {
            const hx = W * (vert ? 0.58 : 0.58) + slot * (vert ? 150 : 210) * spread;
            const hy = lerp(capY + 42, H * (vert ? 0.5 : 0.48) + Math.abs(slot) * 32, spread);
            return (
              <g key={i} transform={`translate(${hx} ${hy})`}>
                <HeliSprite t={t} folded={folded} spin={spin} scale={vert ? 0.84 : 1.04} phase={i * 1.9} />
              </g>
            );
          })
        : null}

      <Dust t={t} seed={331} x0={0} y0={120} w={W} h={H - 180} n={38} o={0.52} />
      <LightVeil id={`${id}veil`} lights={[[W * 0.58, H * 0.45, 620], [W * 0.25, ground - 150, 420]]} o={0.28} />
    </g>
  );
};

// ---------------------------------------------------------------- SET 11: ground
export const GroundSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const radar = clamp((sp.radar as number | undefined) ?? 0);
  const ice = clamp((sp.ice as number | undefined) ?? 0);
  const wind = clamp((sp.wind as number | undefined) ?? 0.2);
  const vert = H > W;

  if (layer === 'far') {
    const skyH = ground - 160;
    return (
      <g>
        <defs>
          <linearGradient id={`${id}gSky`} x1="0" y1={-H * 0.5} x2="0" y2={skyH} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B1D26" />
            <stop offset="60%" stopColor="#8F4334" />
            <stop offset="100%" stopColor="#E08E5C" />
          </linearGradient>
        </defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#${id}gSky)`} />
        <Rays x={W * 0.22} y={H * 0.22} t={t} len={Math.max(W, H) * 1.1} o={0.11} color={g.ray} />
        <circle cx={W * 0.22} cy={H * 0.22} r={34} fill="#F2F7FF" />
        <path
          d={`M ${-W * 0.4} ${skyH + 40} L ${W * 0.25} ${skyH - 85} L ${W * 0.52} ${skyH - 85} L ${W * 0.85} ${skyH - 110} L ${W * 1.4} ${skyH + 40} Z`}
          fill="#63281F"
        />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        {/* Edge rusty rock silhouettes & wind dust */}
        <polygon points={`-40,${ground + 260} -20,${ground + 20} 110,${ground + 45} 150,${ground + 260}`} fill="#2E110E" />
        <polygon points={`${W - 90},${ground + 260} ${W - 35},${ground + 30} ${W + 40},${ground + 260}`} fill="#2E110E" />
        {wind > 0.2 ? (
          <g stroke="#FFB88A" strokeWidth={3} opacity={wind * 0.38} strokeLinecap="round">
            {Array.from({ length: 8 }).map((_, i) => {
              const wx = ((t * (8 + wind * 14) + i * 260) % (W + 300)) - 150;
              const wy = 240 + (i * 120) % (H - 340);
              return <line key={i} x1={wx} y1={wy} x2={wx + 95} y2={wy} />;
            })}
          </g>
        ) : null}
      </g>
    );
  }

  const cutLeft = W * 0.36;
  const strataTop = H * (vert ? 0.55 : 0.5);
  const heliY = strataTop - (vert ? 135 : 135);
  const iceY = strataTop + (vert ? 230 : 165);
  const helis = [W * 0.48, W * 0.65, W * 0.82];
  const sockAngle = lerp(70, 4, wind) + Math.sin(t / (9 - wind * 5)) * (4 + wind * 8);

  return (
    <g>
      {/* Left plain floor for Pip */}
      <GroundPlane y={ground} fill="#7A3124" rim="#F5A872" />

      {/* Small wind sock pole on plain */}
      <g transform={`translate(${W * 0.33} ${ground})`}>
        <line x1={0} y1={0} x2={0} y2={-130} stroke="#2B2430" strokeWidth={7} />
        <g transform={`translate(4 -124) rotate(${sockAngle})`}>
          <polygon points="0,-10 56,-4 56,5 0,10" fill={PALETTE.orange} stroke={DARK_LINE} strokeWidth={3} />
          <rect x={18} y={-8} width={14} height={16} fill={PALETTE.cream} />
        </g>
      </g>

      {/* Raised Martian plateau & geological cross-section cutaway (center-right) */}
      <g>
        <path
          d={`M ${cutLeft - 45} ${ground} L ${cutLeft} ${strataTop} L ${W + 500} ${strataTop} L ${W + 500} ${ground + 600} L ${cutLeft - 45} ${ground + 600} Z`}
          fill="#4A1A14"
          stroke={DARK_LINE}
          strokeWidth={4}
        />
        <rect x={cutLeft} y={strataTop} width={W + 460} height={68} fill="#8C3929" />
        <rect x={cutLeft} y={strataTop + 68} width={W + 460} height={74} fill="#6F2A1E" />
        <rect x={cutLeft} y={strataTop + 142} width={W + 460} height={95} fill="#531D15" />
        <line x1={cutLeft} y1={strataTop} x2={W + 460} y2={strataTop} stroke="#F5A872" strokeWidth={4} />

        {/* Buried pale-blue ice layer */}
        {ice > 0.05 ? (
          <g opacity={ice}>
            <Glow x={W * 0.65} y={iceY} r={220} kind="cool" o={0.55} />
            <path
              d={`M ${cutLeft + 24} ${iceY} Q ${W * 0.56} ${iceY - 14} ${W * 0.68} ${iceY + 6} T ${W * 0.94} ${iceY - 6} L ${W * 0.94} ${iceY + 42} Q ${W * 0.68} ${iceY + 52} ${W * 0.55} ${iceY + 38} T ${cutLeft + 24} ${iceY + 42} Z`}
              fill="#72E9FF"
              stroke="#D8FCFF"
              strokeWidth={3.5}
            />
            {/* Depth bracket */}
            <path
              d={`M ${W * 0.91} ${strataTop + 4} L ${W * 0.93} ${strataTop + 4} L ${W * 0.93} ${iceY + 40} L ${W * 0.91} ${iceY + 40}`}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={3.5}
            />
          </g>
        ) : null}

        {/* Three hovering helicopters & pulsing cyan radar arcs */}
        {helis.map((hx, i) => (
          <g key={i}>
            {radar > 0.05
              ? [0, 1, 2].map((w) => {
                  const prog = ((t / 28 + w * 0.33 + i * 0.1) % 1);
                  const ry = lerp(heliY + 45, iceY + 30, prog);
                  const rad = 24 + prog * 72;
                  return (
                    <path
                      key={w}
                      d={`M ${hx - rad} ${ry} Q ${hx} ${ry + 28} ${hx + rad} ${ry}`}
                      fill="none"
                      stroke={PALETTE.cyan}
                      strokeWidth={4}
                      opacity={radar * (1 - prog) * 0.9}
                    />
                  );
                })
              : null}
            <g transform={`translate(${hx} ${heliY})`}>
              <HeliSprite t={t} spin scale={vert ? 0.78 : 0.95} phase={i * 1.6} />
            </g>
          </g>
        ))}
      </g>

      <Dust t={t} seed={349} x0={0} y0={120} w={W} h={H - 180} n={34} o={0.45} />
      <LightVeil id={`${id}veil`} lights={[[W * 0.65, strataTop, 620], [W * 0.22, ground - 150, 420]]} o={0.3} />
    </g>
  );
};

// ---------------------------------------------------------------- SET 12: moonbase
export const MoonbaseSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const night = clamp((sp.night as number | undefined) ?? 0.9);
  const lights = clamp((sp.lights as number | undefined) ?? 1);
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={night > 0.5 ? '#070612' : '#192038'} />
        <FullStars t={t} W={W} H={H} seed={193} n={140} o={0.35 + night * 0.55} />
        <Rays x={W * 0.75} y={H * 0.22} t={t} len={Math.max(W, H) * 1.1} o={0.09} color={g.ray} />
        {/* Small blue Earth in upper sky */}
        <g transform={`translate(${W * 0.76} ${H * (vert ? 0.24 : 0.2)})`}>
          <Glow x={0} y={0} r={85} kind="cool" o={0.45} />
          <circle r={42} fill="#256AD4" stroke="#62E3FF" strokeWidth={3.5} />
          <path d="M -16 -12 Q 8 -18 14 4 Q -6 14 -18 4 Z" fill="#36A972" />
        </g>
        {/* Distant lunar crater hills */}
        <path
          d={`M ${-W * 0.4} ${ground} L ${W * 0.1} ${ground - 90} L ${W * 0.35} ${ground - 40} L ${W * 0.65} ${ground - 115} L ${W * 0.95} ${ground - 55} L ${W * 1.4} ${ground} Z`}
          fill={night > 0.5 ? '#1B1F30' : '#3A4157'}
        />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g fill={night > 0.5 ? '#141724' : '#2C3144'}>
        <polygon points={`-40,${ground + 260} 20,${ground + 28} 135,${ground + 56} 180,${ground + 260}`} />
        <polygon points={`${W - 140},${ground + 260} ${W - 40},${ground + 34} ${W + 40},${ground + 260}`} />
      </g>
    );
  }

  const baseX = W * (vert ? 0.58 : 0.56);
  const sc = vert ? 0.68 : 1;

  return (
    <g>
      <GroundPlane y={ground} fill={night > 0.5 ? '#24293A' : '#4E5569'} rim="#C8D0E3" />
      <g transform={`translate(${baseX} ${ground}) scale(${sc})`}>
        {/* Floodlight pole */}
        <line x1={-250} y1={0} x2={-250} y2={-250} stroke="#282E42" strokeWidth={9} />
        {lights > 0.1 ? <Cone d="M -250 -248 L -225 -248 L -60 0 L -360 0 Z" o={0.22 * lights} /> : null}

        {/* Power cables from reactor to domes */}
        <path d="M -20 -6 Q 100 18 220 -6" fill="none" stroke={DARK_LINE} strokeWidth={8} />
        <path d="M -20 -6 Q 100 18 220 -6" fill="none" stroke={lights > 0.1 ? PALETTE.gold : '#525A73'} strokeWidth={3.5} />

        {/* Two white habitat domes */}
        {[-120, 40].map((dx, i) => {
          const r = i === 0 ? 86 : 68;
          return (
            <g key={i} transform={`translate(${dx} 0)`}>
              <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`} fill="#DDE3F0" stroke={DARK_LINE} strokeWidth={4} />
              <rect x={-32} y={-r * 0.45} width={64} height={24} rx={8} fill={lights > 0.1 ? '#FFCB5C' : '#353C52'} stroke={DARK_LINE} strokeWidth={3.5} />
              {lights > 0.1 ? <Glow x={0} y={-r * 0.35} r={90} kind="warm" o={0.55 * lights} /> : null}
            </g>
          );
        })}

        {/* Compact Lunar Fission Reactor on a stand */}
        <g transform="translate(230 0)">
          {lights > 0.1 ? <Glow x={0} y={-88} r={140} kind={g.kind} o={0.62 * lights} /> : null}
          <line x1={-32} y1={0} x2={-20} y2={-62} stroke={DARK_LINE} strokeWidth={8} />
          <line x1={32} y1={0} x2={20} y2={-62} stroke={DARK_LINE} strokeWidth={8} />
          <rect x={-72} y={-110} width={144} height={22} rx={4} fill="#666E85" stroke={DARK_LINE} strokeWidth={4} />
          <rect x={-26} y={-124} width={52} height={74} rx={10} fill="#9AA4BA" stroke={DARK_LINE} strokeWidth={4} />
          <rect x={-16} y={-100} width={32} height={26} rx={5} fill={lights > 0.1 ? '#FFB444' : '#32384D'} opacity={0.8 + 0.2 * Math.sin(t / 6)} />
        </g>
      </g>
      <Dust t={t} seed={367} x0={0} y0={120} w={W} h={H - 180} n={24} o={0.34} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [baseX - 60 * sc, ground - 60, 480],
          [baseX + 230 * sc, ground - 90, 380],
          [W * 0.25, ground - 140, 420],
        ]}
        o={0.18 + night * 0.36}
      />
    </g>
  );
};

// ---------------------------------------------------------------- SET 13: rail
export const RailSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const g = getGlowTheme(sp.glow);
  const lay = clamp((sp.lay as number | undefined) ?? 0.6);
  const spt = clamp((sp.t as number | undefined) ?? 0.4);
  const vert = H > W;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={PALETTE.space} />
        <FullStars t={t} W={W} H={H} seed={199} n={140} o={0.9} />
        <Rays x={W * 0.14} y={H * 0.26} t={t} len={Math.max(W, H) * 1.3} o={0.1} color={g.ray} />
      </g>
    );
  }

  if (layer === 'near') {
    return <Dust t={t} seed={373} x0={0} y0={60} w={W} h={H - 120} n={22} o={0.36} />;
  }

  const p0 = { x: W * 0.12, y: H * (vert ? 0.56 : 0.62) };
  const pc = { x: W * 0.52, y: H * (vert ? 0.48 : 0.46) };
  const p1 = { x: W * 0.9, y: H * (vert ? 0.4 : 0.34) };
  const layNow = clamp(lerp(Math.max(0.15, lay - 0.18), lay, easeOut(p)));
  const totalSleepers = 26;
  const shownSleepers = Math.round(totalSleepers * layNow);
  const shipPosU = clamp(lerp(0.12, Math.min(0.62, layNow * 0.85), spt) + p * 0.08);
  const ptAt = (u: number) => ({
    x: (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * pc.x + u * u * p1.x,
    y: (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * pc.y + u * u * p1.y,
  });
  const shipPt = ptAt(shipPosU);

  return (
    <g>
      <GroundPlane y={ground} fill="#0D0B1D" rim={g.color} />
      <rect x={-1200} y={ground} width={4400} height={2400} fill="#080614" opacity={0.62} />

      {/* Ringed Saturn at far end */}
      <g transform={`translate(${p1.x} ${p1.y}) scale(${vert ? 0.72 : 1})`}>
        <ellipse rx={92} ry={22} fill="none" stroke="#E5C078" strokeWidth={11} transform="rotate(-16)" />
        <circle r={42} fill="#E4BA73" stroke={DARK_LINE} strokeWidth={4} />
        <path d="M -86 14 Q 0 38 86 -14" fill="none" stroke="#F7DFAC" strokeWidth={7} transform="rotate(-16)" />
      </g>

      {/* Railway sleepers & cream rails */}
      {Array.from({ length: shownSleepers }).map((_, i) => {
        const u = i / totalSleepers;
        const pt = ptAt(u);
        return (
          <rect
            key={i}
            x={pt.x - 5}
            y={pt.y - 16}
            width={10}
            height={32}
            rx={3}
            fill="#2E2942"
            stroke={DARK_LINE}
            strokeWidth={3}
            transform={`rotate(-14 ${pt.x} ${pt.y})`}
          />
        );
      })}
      <path
        d={`M ${p0.x} ${p0.y - 9} Q ${pc.x} ${pc.y - 9} ${p1.x} ${p1.y - 9}`}
        fill="none"
        stroke={PALETTE.cream}
        strokeWidth={4.5}
        strokeDasharray="1600"
        strokeDashoffset={1600 * (1 - layNow)}
      />
      <path
        d={`M ${p0.x} ${p0.y + 9} Q ${pc.x} ${pc.y + 9} ${p1.x} ${p1.y + 9}`}
        fill="none"
        stroke={PALETTE.cream}
        strokeWidth={4.5}
        strokeDasharray="1600"
        strokeDashoffset={1600 * (1 - layNow)}
      />

      {/* Earth & Moon at start, Mars mid-track */}
      <g transform={`translate(${p0.x} ${p0.y}) scale(${vert ? 0.75 : 1})`}>
        <circle r={44} fill="#2575D8" stroke={DARK_LINE} strokeWidth={4} />
        <path d="M -16 -14 Q 8 -18 16 8 Q -8 18 -20 4 Z" fill="#35A972" />
      </g>
      <g transform={`translate(${ptAt(0.24).x} ${ptAt(0.24).y - 52})`}>
        <circle r={16} fill="#B8C0D4" stroke={DARK_LINE} strokeWidth={3.5} />
      </g>
      <g transform={`translate(${ptAt(0.62).x} ${ptAt(0.62).y}) scale(${vert ? 0.75 : 1})`}>
        <circle r={30} fill="#D45038" stroke={DARK_LINE} strokeWidth={4} />
        <ellipse cx={-4} cy={-22} rx={10} ry={4} fill="#F4EFE6" />
      </g>

      {/* Small SR-1 Freedom riding the first stretch */}
      <g transform={`translate(${shipPt.x} ${shipPt.y - 16}) rotate(-14) scale(${vert ? 0.28 : 0.34})`}>
        <FreedomShipVector t={t} p={p} reactor={0.7} thrust={0.8} arrays={1} glow={g} id={id} />
      </g>

      <LightVeil id={`${id}veil`} lights={[[shipPt.x, shipPt.y, 520], [W * 0.5, H * 0.5, 620]]} o={0.3} />
    </g>
  );
};
