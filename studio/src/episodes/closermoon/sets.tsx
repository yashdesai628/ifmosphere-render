import React from 'react';
import {
  FONT,
  Glow as EngineGlow,
  Cone,
  Stars as EngineStars,
  NightSky as EngineNightSky,
  Rooftop,
  Bedroom,
  Cat,
  clamp,
  lerp,
} from '../../engine';

const Glow: React.FC<{ x: number; y: number; r: number; color?: string; o?: number }> = ({
  x,
  y,
  r,
  color = '#FFE27A',
  o = 0.35,
}) => {
  const kind =
    color.includes('7F') || color.includes('4D') || color.includes('2E') || color.includes('5B')
      ? 'cool'
      : color.includes('FF5') || color.includes('FF4') || color.includes('FF3')
        ? 'red'
        : 'warm';
  return <EngineGlow x={x} y={y} r={r} kind={kind} o={o} />;
};

const NightSky: React.FC<{ id: string }> = ({ id }) => <EngineNightSky id={id} horizonY={880} />;

const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 85 }) => (
  <EngineStars seed={31} x0={-200} y0={-200} w={2320} h={1180} t={t} n={n} />
);

export const WORLD_FLOOR_Y = 835;

/**
 * Detailed Cratered Moon Prop: scales from normal (r=68) to supermoon (r=78) to 2x closer (r=180..280).
 */
export const GiantMoonProp: React.FC<{
  x: number;
  y: number;
  r: number;
  t: number;
  tint?: 'silver' | 'gold' | 'eclipse';
  label?: string;
  subLabel?: string;
  showLaser?: boolean;
}> = ({ x, y, r, t, tint = 'silver', label, subLabel, showLaser = false }) => {
  const fillCol = tint === 'gold' ? '#FFE8A3' : tint === 'eclipse' ? '#0B0918' : '#F2EFE6';
  const rimCol = tint === 'gold' ? '#FFB84D' : tint === 'eclipse' ? '#FFE27A' : '#9ED4FF';
  const mareCol = tint === 'gold' ? '#D6B46C' : '#C9C4B8';
  const pulse = Math.sin(t * 0.08) * 4;

  return (
    <g transform={`translate(${x} ${y})`}>
      <Glow x={0} y={0} r={r * 2.1 + pulse} color={tint === 'gold' ? '#FFB84D' : '#7FD4FF'} o={0.45} />
      {tint === 'eclipse' && (
        <g>
          {/* Blazing solar corona streamers behind dark Moon */}
          {Array.from({ length: 16 }).map((_, i) => {
            const ang = (i * 22.5 * Math.PI) / 180 + t * 0.003;
            const len = r * (1.35 + (i % 3) * 0.22);
            return (
              <line
                key={i}
                x1={Math.cos(ang) * (r * 0.92)}
                y1={Math.sin(ang) * (r * 0.92)}
                x2={Math.cos(ang) * len}
                y2={Math.sin(ang) * len}
                stroke="#FFE27A"
                strokeWidth={8}
                opacity={0.55}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={0} cy={0} r={r * 0.56} fill="none" stroke="#FF8A3D" strokeWidth={4} strokeDasharray="10 8" />
        </g>
      )}

      <circle cx={0} cy={0} r={r} fill={fillCol} stroke={rimCol} strokeWidth={Math.max(3, r * 0.03)} />

      {tint !== 'eclipse' && (
        <g opacity={0.68}>
          {/* Lunar Maria (Sea of Tranquility, Sea of Rains, Ocean of Storms) */}
          <ellipse cx={-r * 0.28} cy={-r * 0.22} rx={r * 0.26} ry={r * 0.19} transform="rotate(-18)" fill={mareCol} />
          <ellipse cx={r * 0.18} cy={-r * 0.12} rx={r * 0.22} ry={r * 0.16} transform="rotate(14)" fill={mareCol} />
          <ellipse cx={r * 0.25} cy={r * 0.18} rx={r * 0.18} ry={r * 0.14} fill={mareCol} />
          <ellipse cx={-r * 0.34} cy={r * 0.16} rx={r * 0.2} ry={r * 0.24} transform="rotate(12)" fill={mareCol} />
          {/* Tycho crater + bright ejecta rays */}
          <circle cx={-r * 0.08} cy={r * 0.48} r={r * 0.08} fill="#FFFDF7" stroke={mareCol} strokeWidth={2} />
          {[-42, -18, 12, 36].map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={idx}
                x1={-r * 0.08}
                y1={r * 0.48}
                x2={-r * 0.08 + Math.sin(rad) * r * 0.55}
                y2={r * 0.48 - Math.cos(rad) * r * 0.55}
                stroke="#FFFDF7"
                strokeWidth={Math.max(1.5, r * 0.015)}
                opacity={0.55}
              />
            );
          })}
        </g>
      )}

      {showLaser && (
        <g>
          {/* Apollo retroreflector mirror glint on Moon */}
          <rect x={r * 0.1 - 10} y={r * 0.05 - 10} width={20} height={20} rx={4} fill="#5BE08A" stroke="#FFFFFF" strokeWidth={2.5} />
          <circle cx={r * 0.1} cy={r * 0.05} r={24 + pulse * 2} fill="none" stroke="#5BE08A" strokeWidth={2.5} />
        </g>
      )}

      {label && (
        <g transform={`translate(0 ${r + 44})`}>
          <rect x={-190} y={-28} width={380} height={subLabel ? 72 : 46} rx={16} fill="#0B0919" opacity={0.92} stroke={rimCol} strokeWidth={2.5} />
          <text y={4} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={23} fill="#FFE27A" letterSpacing={2}>
            {label}
          </text>
          {subLabel && (
            <text y={32} textAnchor="middle" fontFamily={FONT.ui} fontSize={17} fill="#9ED4FF" letterSpacing={1.8}>
              {subLabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
};

/**
 * Set 1: NightBeachSet (Ch 0 Hook/Payoff, Ch 5 Beach Towel Gag & Lifeguard Stand, Ch 9 1-Inch Ruler Goodbye, Short Frame 0).
 */
export const NightBeachSet: React.FC<{
  t: number;
  id: string;
  variant?: 'hook' | 'surge' | 'towel_1' | 'towel_2' | 'lifeguard' | 'ruler_goodbye';
}> = ({ t, id, variant = 'hook' }) => {
  const waveShift = Math.sin(t * 0.11) * 14;
  const isNormalMoon = variant === 'ruler_goodbye';
  const moonR = isNormalMoon ? 76 : 235;
  const moonX = isNormalMoon ? 1320 : 960;
  const moonY = isNormalMoon ? 245 : 310;

  // Water line Y position based on tide progression
  const waterY =
    variant === 'hook'
      ? 690
      : variant === 'surge'
        ? 635 - Math.min(45, t * 0.9)
        : variant === 'towel_1'
          ? 650
          : variant === 'towel_2'
            ? 595
            : variant === 'lifeguard'
              ? 545
              : 705;

  return (
    <g>
      <NightSky id={`nb_${id}`} />
      <Stars t={t} n={95} />

      {/* Giant Moon (or normal Moon in Ch 9) over the ocean horizon */}
      <GiantMoonProp
        x={moonX}
        y={moonY}
        r={moonR}
        t={t}
        tint={variant === 'surge' ? 'gold' : 'silver'}
        showLaser={variant === 'ruler_goodbye'}
      />

      {/* Distant dark headland silhouettes */}
      <path d="M -120 620 Q 180 565 430 620 L -120 620 Z" fill="#12182B" />
      <path d="M 1510 620 Q 1760 555 2040 620 L 1510 620 Z" fill="#12182B" />

      {/* Deep Ocean & Moonlit Shimmer Path */}
      <rect x={-160} y={590} width={2240} height={320} fill="#0E2442" />
      {Array.from({ length: 7 }).map((_, i) => {
        const ry = 605 + i * 22;
        const rw = (isNormalMoon ? 90 : 280) - i * 16 + Math.sin(t * 0.15 + i) * 18;
        return (
          <rect
            key={i}
            x={moonX - rw / 2}
            y={ry}
            width={rw}
            height={6}
            rx={3}
            fill="#FFE8A3"
            opacity={0.55 - i * 0.05}
          />
        );
      })}

      {/* Sloping Sandy Beach */}
      <path d="M -160 720 Q 640 695 1980 655 L 2080 1120 L -160 1120 Z" fill="#3D354B" />
      <path d="M -160 775 Q 720 740 2040 700 L 2080 1120 L -160 1120 Z" fill="#52465E" />

      {/* Animated Climbing Tidal Surf & Foam */}
      <g transform={`translate(0 ${waterY + waveShift * 0.5})`}>
        <path
          d="M -160 -40 Q 320 -65 780 -35 Q 1240 -5 1680 -45 Q 1920 -60 2080 -35 L 2080 165 Q 1520 195 960 170 Q 420 145 -160 185 Z"
          fill="#1B4F82"
          opacity={0.92}
        />
        <path
          d="M -160 160 Q 420 135 960 165 Q 1520 190 2080 155"
          fill="none"
          stroke="#D6F0FF"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d="M -160 130 Q 460 105 980 135 Q 1500 160 2080 125"
          fill="none"
          stroke="#7FD4FF"
          strokeWidth={6}
          strokeDasharray="28 16"
        />
      </g>

      {/* Striped Beach Towel & Cocoa Mug moving up the beach in Ch 5 */}
      {(variant === 'towel_1' || variant === 'towel_2' || variant === 'surge') && (
        <g
          transform={`translate(${variant === 'towel_2' ? 1140 : 820} ${
            variant === 'towel_2' ? 790 : 855
          }) rotate(-6)`}
        >
          <polygon points="-95,-18 95,-18 115,24 -115,24" fill="#FF6A4D" stroke="#181426" strokeWidth={3.5} />
          <polygon points="-55,-18 -15,-18 -5,24 -65,24" fill="#FFE27A" />
          <polygon points="25,-18 65,-18 75,24 15,24" fill="#FFE27A" />
          {/* Flip-flops & mug */}
          <ellipse cx={-135} cy={12} rx={18} ry={9} fill="#5BE08A" stroke="#181426" strokeWidth={2.5} />
          <ellipse cx={-108} cy={20} rx={18} ry={9} fill="#5BE08A" stroke="#181426" strokeWidth={2.5} />
          <rect x={125} y={-22} width={28} height={32} rx={5} fill="#F6EFE3" stroke="#181426" strokeWidth={3} />
        </g>
      )}

      {/* Wooden Lifeguard Stand on right side of beach */}
      <g transform="translate(1520 755)">
        <ellipse cx={0} cy={85} rx={115} ry={22} fill="#000" opacity={0.38} />
        {/* Support legs */}
        <line x1={-65} y1={80} x2={-38} y2={-145} stroke="#8C6239" strokeWidth={12} />
        <line x1={65} y1={80} x2={38} y2={-145} stroke="#8C6239" strokeWidth={12} />
        {/* Ladder rungs */}
        {[-95, -50, -5, 40].map((ry, idx) => (
          <line key={idx} x1={-55} y1={ry} x2={55} y2={ry} stroke="#A6784B" strokeWidth={7} />
        ))}
        {/* Platform & Chair */}
        <rect x={-78} y={-162} width={156} height={22} rx={6} fill="#D9A86C" stroke="#24180E" strokeWidth={4} />
        <rect x={-48} y={-245} width={96} height={83} rx={8} fill="#F6EFE3" stroke="#24180E" strokeWidth={4} />
        <path d="M -72 -245 L 0 -290 L 72 -245 Z" fill="#FF5A4A" stroke="#24180E" strokeWidth={4} />
        {/* Lifebuoy ring */}
        <circle cx={62} cy={-195} r={24} fill="none" stroke="#FF5A4A" strokeWidth={10} />
        <circle cx={62} cy={-195} r={24} fill="none" stroke="#F6EFE3" strokeWidth={10} strokeDasharray="16 22" />
        {variant === 'lifeguard' && (
          /* Towel draped on top of lifeguard roof */
          <rect x={-55} y={-155} width={110} height={16} rx={4} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={2.5} />
        )}
      </g>

      {/* Tiny Wooden Ruler Prop & Laser Beam for Ch 9 ("1 inch farther per year") */}
      {variant === 'ruler_goodbye' && (
        <g>
          <line x1={740} y1={680} x2={1320} y2={245} stroke="#5BE08A" strokeWidth={3.5} strokeDasharray="14 10" opacity={0.75} />
          <g transform="translate(880 610) rotate(-18)">
            <rect x={-26} y={-85} width={52} height={170} rx={8} fill="#F2B33D" stroke="#1E140A" strokeWidth={4} />
            {Array.from({ length: 7 }).map((_, k) => (
              <line key={k} x1={-26} y1={-65 + k * 22} x2={k % 2 === 0 ? 4 : -8} y2={-65 + k * 22} stroke="#1E140A" strokeWidth={3} />
            ))}
            <text x={38} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#FFE27A">
              +1 INCH / YR
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/**
 * Set 2: OvalOrbitSpaceSet (Ch 1 Oval Orbit 384,400 km / Perigee 363,300 km / Apogee 405,500 km, Ch 2 Halved Orbit 192,200 km, Ch 9 Tidal Bulge + Laser Ranging).
 */
export const OvalOrbitSpaceSet: React.FC<{
  t: number;
  id: string;
  variant?: 'oval_today' | 'perigee_apogee' | 'halved_orbit' | 'laser_retreat';
}> = ({ t, id, variant = 'oval_today' }) => {
  const ang = t * 0.025;
  const rx = variant === 'halved_orbit' ? 290 : 540;
  const ry = variant === 'halved_orbit' ? 165 : 275;
  const earthX = 890;
  const earthY = 540;
  const orbitCx = 960;
  const orbitCy = 540;
  const mx = orbitCx + Math.cos(ang) * rx;
  const my = orbitCy + Math.sin(ang) * ry;

  return (
    <g>
      <NightSky id={`oo_${id}`} />
      <Stars t={t} n={110} />

      {/* Outer Today's Oval Orbit (384,400 km average) */}
      <ellipse
        cx={orbitCx}
        cy={orbitCy}
        rx={540}
        ry={275}
        fill="none"
        stroke={variant === 'halved_orbit' ? '#4A5B7A' : '#7FD4FF'}
        strokeWidth={4}
        strokeDasharray="16 10"
      />

      {/* Inner Halved Orbit (about 192,200 km) */}
      {variant === 'halved_orbit' && (
        <ellipse cx={orbitCx} cy={orbitCy} rx={290} ry={165} fill="none" stroke="#FFE27A" strokeWidth={5} />
      )}

      {/* Earth at focus of oval orbit */}
      <g transform={`translate(${earthX} ${earthY})`}>
        <Glow x={0} y={0} r={210} color="#4DA6FF" o={0.38} />
        {/* Ocean tidal bulge ellipse */}
        <ellipse
          cx={0}
          cy={0}
          rx={variant === 'halved_orbit' ? 138 : 108}
          ry={86}
          transform={`rotate(${(ang * 180) / Math.PI + 12})`}
          fill="#2E8AE6"
          opacity={0.38}
          stroke="#7FD4FF"
          strokeWidth={2.5}
        />
        <circle cx={0} cy={0} r={78} fill="#1E62B8" stroke="#9ED4FF" strokeWidth={4} />
        <path d="M -42 -32 Q -10 -48 24 -18 Q 45 14 14 42 Q -26 30 -42 -32 Z" fill="#52B87A" opacity={0.88} />
        <text y={122} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#9ED4FF" letterSpacing={2}>
          EARTH
        </text>
      </g>

      {/* Perigee (~363,300 km) & Apogee (~405,500 km) markers */}
      {(variant === 'oval_today' || variant === 'perigee_apogee') && (
        <g>
          {/* Left: Perigee */}
          <line x1={420} y1={540} x2={earthX - 78} y2={540} stroke="#5BE08A" strokeWidth={3.5} strokeDasharray="10 7" />
          <circle cx={420} cy={540} r={44} fill="#E8E4D8" stroke="#5BE08A" strokeWidth={4} />
          <text x={420} y={468} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={25} fill="#5BE08A">
            PERIGEE · ~363,300 KM
          </text>
          <text x={420} y={615} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill="#D6E4F0">
            (~226,000 MILES)
          </text>

          {/* Right: Apogee */}
          <line x1={earthX + 78} y1={540} x2={1500} y2={540} stroke="#FF8A3D" strokeWidth={3.5} strokeDasharray="10 7" />
          <circle cx={1500} cy={540} r={36} fill="#C8C4B8" stroke="#FF8A3D" strokeWidth={4} />
          <text x={1500} y={468} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={25} fill="#FF8A3D">
            APOGEE · ~405,500 KM
          </text>
          <text x={1500} y={615} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill="#D6E4F0">
            (~251,000 MILES)
          </text>
        </g>
      )}

      {/* Laser ranging pulse in Ch 9 */}
      {variant === 'laser_retreat' && (
        <g>
          <line x1={earthX + 60} y1={earthY - 35} x2={mx} y2={my} stroke="#5BE08A" strokeWidth={5} strokeDasharray="18 10" />
          <text x={(earthX + mx) / 2} y={(earthY + my) / 2 - 28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#5BE08A">
            LASER RANGING: +1 INCH / YEAR
          </text>
        </g>
      )}

      {/* Orbiting Moon */}
      <GiantMoonProp
        x={mx}
        y={my}
        r={variant === 'halved_orbit' ? 68 : 42}
        t={t}
        tint={variant === 'halved_orbit' ? 'gold' : 'silver'}
        label={variant === 'halved_orbit' ? 'ABOUT 192,200 KM' : 'RADIUS 1,740 KM · 27 DAYS'}
        showLaser={variant === 'laser_retreat'}
      />
    </g>
  );
};

/**
 * Set 3: ThumbAndWindowSet (Ch 2: Hand at arm's length thumb test + Bedroom/Study window coin vs giant lantern).
 */
export const ThumbAndWindowSet: React.FC<{
  t: number;
  id: string;
  variant?: 'thumb_normal' | 'thumb_giant' | 'window_coin' | 'window_lantern';
}> = ({ t, id, variant = 'thumb_giant' }) => {
  if (variant === 'thumb_normal' || variant === 'thumb_giant') {
    const isGiant = variant === 'thumb_giant';
    const moonR = isGiant ? 235 : 58;
    const sway = Math.sin(t * 0.1) * 6;
    return (
      <g>
        <NightSky id={`tw_${id}`} />
        <Stars t={t} n={90} />
        {/* Distant tree & roof horizon */}
        <path d="M -100 840 L 320 790 L 680 830 L 1280 785 L 2020 835 L 2020 1080 L -100 1080 Z" fill="#141829" />

        {/* Moon in the sky */}
        <GiantMoonProp
          x={1060}
          y={430}
          r={moonR}
          t={t}
          tint={isGiant ? 'gold' : 'silver'}
          label={isGiant ? 'WIDTH x2 · AREA x4 (192,200 KM)' : 'TODAY: 384,400 KM (HIDDEN BY THUMB)'}
        />

        {/* Outstretched Foreground Arm & Thumb at Arm's Length */}
        <g transform={`translate(${1040 + sway} 650) rotate(-14)`}>
          {/* Hoodie sleeve extending from bottom-left */}
          <path d="M -420 480 L -85 45 L 45 95 L -260 520 Z" fill="#232038" stroke="#FFE27A" strokeWidth={5} />
          {/* Hand / Mitten + Upright Thumb */}
          <ellipse cx={-12} cy={35} rx={68} ry={54} fill="#EADBC8" stroke="#181426" strokeWidth={5} />
          {/* Upright thumb right over the Moon center (1060, 430) */}
          <rect x={-34} y={-235} width={68} height={225} rx={34} fill="#EADBC8" stroke="#181426" strokeWidth={5} />
          <rect x={-22} y={-222} width={44} height={42} rx={16} fill="#F7EDE0" opacity={0.75} />
        </g>
      </g>
    );
  }

  const isLantern = variant === 'window_lantern';
  return (
    <g>
      <Bedroom t={t} id={`bw_${id}`} clock="22:15" lamp={isLantern ? 0.3 : 0.85} veil={isLantern ? 0.18 : 0.38} />
      {/* Window pane (1070..1330 x 374..600) */}
      <g>
        <clipPath id={`winClip_${id}`}>
          <rect x={1072} y={376} width={256} height={222} rx={8} />
        </clipPath>
        <g clipPath={`url(#winClip_${id})`}>
          <rect x={1072} y={376} width={256} height={222} fill="#0E1730" />
          {isLantern ? (
            <GiantMoonProp x={1200} y={488} r={148} t={t} tint="gold" />
          ) : (
            <GiantMoonProp x={1255} y={425} r={26} t={t} tint="silver" />
          )}
        </g>
        {/* Window muntin crossbars */}
        <line x1={1200} y1={376} x2={1200} y2={598} stroke="#241E38" strokeWidth={6} />
        <line x1={1072} y1={487} x2={1328} y2={487} stroke="#241E38" strokeWidth={6} />
      </g>
      {isLantern && (
        <polygon points="1072,376 1328,376 1640,920 680,920" fill="#FFE8A3" opacity={0.22} pointerEvents="none" />
      )}
    </g>
  );
};

/**
 * Set 4: SupermoonStageSet (Ch 3: Supermoon +14% bigger / +30% brighter vs 2x Closer +100% wider / Area x4; Pip on stool gag).
 */
export const SupermoonStageSet: React.FC<{
  t: number;
  id: string;
  variant?: 'subtle_14' | 'side_by_side' | 'stool_tip';
}> = ({ t, id, variant = 'side_by_side' }) => {
  return (
    <g>
      <NightSky id={`sm_${id}`} />
      <Stars t={t} n={85} />
      {/* Observatory terrace floor */}
      <rect x={-120} y={795} width={2160} height={310} fill="#1A162B" stroke="#3E355E" strokeWidth={4} />

      {/* Left: NASA Supermoon at Perigee (~363,300 km: up to 14% bigger, 30% brighter than apogee ~405,500 km) */}
      <g transform="translate(520 410)">
        {/* Faintest full Moon dashed reference ring */}
        <circle cx={0} cy={0} r={68} fill="none" stroke="#6E7B99" strokeWidth={3} strokeDasharray="8 6" />
        <GiantMoonProp
          x={0}
          y={0}
          r={78}
          t={t}
          tint="silver"
          label="REAL SUPERMOON (+14% BIGGER)"
          subLabel="PERIGEE ~363,300 KM · +30% BRIGHTER"
        />
      </g>

      {/* Right: Twice-as-Close Moon (about 192,200 km: +100% wider, 2x width, 4x area) */}
      {variant !== 'subtle_14' && (
        <g transform="translate(1360 390)">
          <GiantMoonProp
            x={0}
            y={0}
            r={195}
            t={t}
            tint="gold"
            label="2X CLOSER MOON (+100% WIDER)"
            subLabel="ABOUT 192,200 KM · AREA x4"
          />
        </g>
      )}

      {/* Wooden Stool & Cardboard Tube / Teacup Saucer Props */}
      <g transform={`translate(920 815) rotate(${variant === 'stool_tip' ? 28 : 0})`}>
        <ellipse cx={0} cy={22} rx={65} ry={14} fill="#000" opacity={0.4} />
        <line x1={-34} y1={-55} x2={-48} y2={20} stroke="#8C6239" strokeWidth={10} strokeLinecap="round" />
        <line x1={34} y1={-55} x2={48} y2={20} stroke="#8C6239" strokeWidth={10} strokeLinecap="round" />
        <line x1={-40} y1={-15} x2={40} y2={-15} stroke="#6E4B2A" strokeWidth={7} />
        <rect x={-52} y={-72} width={104} height={20} rx={10} fill="#D9A86C" stroke="#24180E" strokeWidth={4} />
      </g>
    </g>
  );
};

/**
 * Set 5: SilverParkAvenueSet (Ch 4: Reading a book outdoors at night, crisp shadows, streetlights clicking off, birds awake, cat on fence).
 */
export const SilverParkAvenueSet: React.FC<{
  t: number;
  id: string;
  variant?: 'bench_book' | 'streetlights_off' | 'birds_and_cat';
}> = ({ t, id, variant = 'bench_book' }) => {
  const lightsOff = variant === 'streetlights_off' || t > 18;
  return (
    <g>
      <NightSky id={`sp_${id}`} />
      {/* Silver twilight wash from 4x-area Moon */}
      <rect x={-120} y={-120} width={2160} height={1200} fill="#7FD4FF" opacity={0.14} />
      <Stars t={t} n={60} />

      <GiantMoonProp x={1420} y={255} r={210} t={t} tint="silver" />

      {/* Park trees & wooden garden fence */}
      <rect x={-120} y={675} width={2160} height={115} fill="#1F263D" />
      {Array.from({ length: 18 }).map((_, i) => (
        <rect key={i} x={-80 + i * 115} y={650} width={26} height={140} rx={6} fill="#2B3350" stroke="#141829" strokeWidth={3} />
      ))}

      {/* Paved avenue & park path */}
      <rect x={-120} y={785} width={2160} height={310} fill="#2E364F" stroke="#526082" strokeWidth={4} />

      {/* Crisp sharp shadows cast by the giant Moon toward the left */}
      <polygon points="580,825 220,965 440,985 740,825" fill="#0B0E1A" opacity={0.62} />
      <polygon points="1160,810 790,955 920,975 1240,810" fill="#0B0E1A" opacity={0.62} />

      {/* Tree with awake songbirds & musical notes */}
      <g transform="translate(360 560)">
        <rect x={-28} y={0} width={56} height={240} fill="#3B2A22" stroke="#181210" strokeWidth={4} />
        <circle cx={0} cy={-75} r={145} fill="#1F3B34" stroke="#52B87A" strokeWidth={3.5} />
        <circle cx={-85} cy={-25} r={95} fill="#26473E" />
        <circle cx={85} cy={-35} r={105} fill="#26473E" />
        {/* Awake chirping birds */}
        {[
          { bx: -45, by: -95 },
          { bx: 55, by: -65 },
        ].map((b, idx) => (
          <g key={idx} transform={`translate(${b.bx} ${b.by})`}>
            <ellipse cx={0} cy={0} rx={18} ry={13} fill="#5CC4FF" stroke="#121829" strokeWidth={3} />
            <polygon points="16,-4 30,0 16,6" fill="#FFE27A" />
            <circle cx={8} cy={-4} r={3} fill="#121829" />
            <text x={28} y={-14 - (t % 16)} fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#FFE27A">
              ♪ ♫
            </text>
          </g>
        ))}
      </g>

      {/* Automatic Streetlights with Photocell Sensors clicking OFF */}
      {[780, 1220].map((lx, idx) => (
        <g key={idx} transform={`translate(${lx} 790)`}>
          <rect x={-10} y={-370} width={20} height={370} fill="#38415C" stroke="#151926" strokeWidth={3.5} />
          <path d="M 0 -370 Q 0 -420 55 -420" fill="none" stroke="#38415C" strokeWidth={12} />
          <ellipse cx={65} cy={-412} rx={34} ry={16} fill={lightsOff ? '#2B3248' : '#FFE27A'} stroke="#151926" strokeWidth={3.5} />
          {!lightsOff && <Cone d="M 45 -405 L 85 -405 L 210 0 L -80 0 Z" o={0.28} />}
          <rect x={-72} y={-285} width={144} height={38} rx={10} fill="#0D1020" stroke={lightsOff ? '#FF6A4D' : '#5BE08A'} strokeWidth={2.5} />
          <text x={0} y={-260} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={16} fill={lightsOff ? '#FF6A4D' : '#5BE08A'}>
            {lightsOff ? 'SENSOR: OFF' : 'SENSOR: ON'}
          </text>
        </g>
      ))}

      {/* Park Bench for reading outdoors */}
      <g transform="translate(640 810)">
        <rect x={-115} y={-55} width={230} height={24} rx={6} fill="#8C583A" stroke="#1E140E" strokeWidth={3.5} />
        <rect x={-125} y={-25} width={250} height={20} rx={6} fill="#A66B48" stroke="#1E140E" strokeWidth={3.5} />
        <rect x={-95} y={-5} width={18} height={38} fill="#252B3D" />
        <rect x={77} y={-5} width={18} height={38} fill="#252B3D" />
      </g>

      {/* Wide-eyed Neighbourhood Cat on the fence */}
      <Cat x={1520} y={650} f={t} mood="alert" />
    </g>
  );
};

/**
 * Set 6: HarbourSeawallSet (Ch 5: Harbour boats bucking & tide marching up stone stairs; Ch 6: Extreme low tide mud flats).
 */
export const HarbourSeawallSet: React.FC<{
  t: number;
  id: string;
  variant?: 'climbing_stairs' | 'high_boats' | 'low_mud_flats';
}> = ({ t, id, variant = 'climbing_stairs' }) => {
  const isMud = variant === 'low_mud_flats';
  const waterY = isMud ? 935 : variant === 'high_boats' ? 565 : 645 - Math.min(60, t * 1.1);
  const rock = Math.sin(t * 0.16) * (isMud ? 1 : 9);

  return (
    <g>
      <NightSky id={`hs_${id}`} />
      <Stars t={t} n={80} />
      <GiantMoonProp x={1380} y={265} r={220} t={t} tint="gold" />

      {/* Left Stone Pier & Stepped Seawall Stairs */}
      <path d="M -120 490 L 640 490 L 640 960 L -120 960 Z" fill="#32394F" stroke="#566285" strokeWidth={4} />
      {/* 6 Stone Harbour Steps leading down to the right */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const sx = 520 + idx * 78;
        const sy = 520 + idx * 58;
        return (
          <rect
            key={idx}
            x={sx}
            y={sy}
            width={82}
            height={420}
            fill={idx % 2 === 0 ? '#3E4763' : '#2C3347'}
            stroke="#637096"
            strokeWidth={3}
          />
        );
      })}
      {/* Iron Bollard on Pier */}
      <rect x={435} y={442} width={44} height={48} rx={10} fill="#1C202E" stroke="#7FD4FF" strokeWidth={3} />

      {/* Mud Flats exposed at extreme low tide (Ch 6) */}
      {isMud && (
        <g>
          <path d="M 620 845 Q 1180 815 2040 855 L 2040 1080 L 620 1080 Z" fill="#4A382B" stroke="#6E533E" strokeWidth={4} />
          {/* Stranded anchor & seashells on mud */}
          <circle cx={1060} cy={915} r={16} fill="none" stroke="#9BA8B8" strokeWidth={6} />
          <line x1={1060} y1={931} x2={1060} y2={980} stroke="#9BA8B8" strokeWidth={8} />
          <path d="M 1025 960 Q 1060 995 1095 960" fill="none" stroke="#9BA8B8" strokeWidth={8} />
          <ellipse cx={1240} cy={945} rx={20} ry={12} fill="#FFE27A" />
        </g>
      )}

      {/* Harbour Fishing Boat */}
      <g transform={`translate(1280 ${isMud ? 835 : waterY - 12}) rotate(${isMud ? -14 : rock})`}>
        {/* Mast & cabin */}
        <line x1={-20} y1={-40} x2={-20} y2={-215} stroke="#D9A86C" strokeWidth={10} />
        <polygon points="-20,-205 95,-145 -20,-125" fill="#FF6A4D" stroke="#181426" strokeWidth={3.5} />
        <rect x={-95} y={-110} width={135} height={68} rx={10} fill="#F6EFE3" stroke="#181426" strokeWidth={4} />
        <rect x={-72} y={-92} width={42} height={30} rx={6} fill="#7FD4FF" />
        {/* Boat hull */}
        <polygon points="-185,-42 195,-42 145,38 -145,38" fill="#D9534F" stroke="#181426" strokeWidth={4.5} />
        <line x1={-170} y1={-18} x2={175} y2={-18} stroke="#FFE27A" strokeWidth={6} />
        {/* Rope ladder hanging down when stranded on mud */}
        {isMud && (
          <g stroke="#F6EFE3" strokeWidth={3.5}>
            <line x1={-40} y1={20} x2={-40} y2={115} />
            <line x1={-10} y1={20} x2={-10} y2={115} />
            {[40, 65, 90].map((ly, k) => (
              <line key={k} x1={-40} y1={ly} x2={-10} y2={ly} />
            ))}
          </g>
        )}
      </g>

      {/* Mooring rope from pier bollard to boat */}
      <line
        x1={465}
        y1={458}
        x2={1110}
        y2={isMud ? 810 : waterY - 45}
        stroke="#E5B869"
        strokeWidth={5}
        strokeDasharray="12 6"
      />

      {/* Rising Harbour Water */}
      {!isMud && (
        <g transform={`translate(0 ${waterY})`}>
          <rect x={480} y={0} width={1560} height={560} fill="#143D66" opacity={0.9} />
          <path d="M 480 0 Q 860 -22 1240 0 Q 1620 22 2040 0" fill="none" stroke="#9ED4FF" strokeWidth={10} />
        </g>
      )}
    </g>
  );
};

/**
 * Set 7: FloodedCoastStreetSet (Ch 6: Coastal street canal, Pip in yellow rubber dinghy, crabs on café table).
 */
export const FloodedCoastStreetSet: React.FC<{
  t: number;
  id: string;
  variant?: 'dinghy_street' | 'crab_cafe';
}> = ({ t, id, variant = 'dinghy_street' }) => {
  const bob = Math.sin(t * 0.14) * 7;
  return (
    <g>
      <NightSky id={`fc_${id}`} />
      <Stars t={t} n={75} />
      <GiantMoonProp x={1420} y={250} r={215} t={t} tint="gold" />

      {/* Coastal promenade buildings & striped café awning on left */}
      <rect x={-80} y={320} width={740} height={520} fill="#25223B" stroke="#47416B" strokeWidth={4} />
      <path d="M -80 510 L 680 510 L 720 585 L -80 585 Z" fill="#D9534F" stroke="#FFE27A" strokeWidth={4} />
      {/* Awning stripes */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={-40 + i * 105} y={510} width={48} height={75} fill="#F6EFE3" />
      ))}

      {/* Flooded Street Water */}
      <rect x={-120} y={725} width={2160} height={380} fill="#184775" opacity={0.93} />
      <path d="M -120 725 Q 480 702 980 725 Q 1480 748 2040 725" fill="none" stroke="#9ED4FF" strokeWidth={8} />

      {/* Submerged Street Sign & Lamppost */}
      <g transform="translate(1540 725)">
        <line x1={0} y1={120} x2={0} y2={-240} stroke="#9BA8B8" strokeWidth={10} />
        <rect x={-135} y={-225} width={270} height={58} rx={12} fill="#2B72C8" stroke="#F6EFE3" strokeWidth={4} />
        <text y={-188} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#FFE27A">
          HIGH TIDE CANAL
        </text>
      </g>

      {/* Café Table above the floodwater with Two Cheerful Crabs */}
      <g transform={`translate(420 ${715 + bob * 0.4})`}>
        <line x1={0} y1={-85} x2={0} y2={65} stroke="#232838" strokeWidth={12} />
        <ellipse cx={0} cy={-85} rx={155} ry={28} fill="#F6EFE3" stroke="#232838" strokeWidth={4.5} />
        {[-65, 65].map((cx, idx) => (
          <g key={idx} transform={`translate(${cx} -112)`}>
            <ellipse cx={0} cy={0} rx={32} ry={20} fill="#FF5A4A" stroke="#181224" strokeWidth={3.5} />
            <circle cx={-10} cy={-22} r={5} fill="#181224" />
            <circle cx={10} cy={-22} r={5} fill="#181224" />
            <path d="M -28 -8 Q -48 -32 -30 -42" fill="none" stroke="#FF5A4A" strokeWidth={6} strokeLinecap="round" />
            <path d="M 28 -8 Q 48 -32 30 -42" fill="none" stroke="#FF5A4A" strokeWidth={6} strokeLinecap="round" />
          </g>
        ))}
      </g>

      {/* Yellow Inflatable Rubber Dinghy for Pip */}
      <g transform={`translate(1020 ${755 + bob})`}>
        <ellipse cx={0} cy={14} rx={195} ry={48} fill="#F2B33D" stroke="#1D160B" strokeWidth={5} />
        <ellipse cx={0} cy={6} rx={145} ry={26} fill="#C88A22" stroke="#1D160B" strokeWidth={3.5} />
        {/* Wooden oar */}
        <line x1={-40} y1={-10} x2={125} y2={68} stroke="#8C583A" strokeWidth={9} strokeLinecap="round" />
      </g>
    </g>
  );
};

/**
 * Set 8: CurtainBedroomSet (Ch 7: Blazing moonlight through curtains, clothespin, sleep mask + sunglasses, awake cat).
 */
export const CurtainBedroomSet: React.FC<{
  t: number;
  id: string;
  variant?: 'curtain_beam' | 'clothespin_glow' | 'cat_windowsill' | 'window_peek';
}> = ({ t, id, variant = 'curtain_beam' }) => {
  return (
    <g>
      <Bedroom t={t} id={`cb_${id}`} clock="03:00" lamp={0.2} veil={0.18} />
      {/* Window at 1070..1330 x 374..600 with giant Moon outside */}
      <g>
        <rect x={1070} y={374} width={260} height={226} fill="#101C38" />
        <GiantMoonProp x={1200} y={485} r={142} t={t} tint="silver" />
        {/* Curtains left & right */}
        {variant === 'clothespin_glow' ? (
          <g>
            <rect x={1065} y={368} width={135} height={238} rx={8} fill="#4D3E6B" opacity={0.82} stroke="#9ED4FF" strokeWidth={3} />
            <rect x={1200} y={368} width={135} height={238} rx={8} fill="#4D3E6B" opacity={0.82} stroke="#9ED4FF" strokeWidth={3} />
            {/* Wooden clothespin pinching curtains shut */}
            <rect x={1188} y={470} width={24} height={46} rx={5} fill="#F2B33D" stroke="#181224" strokeWidth={3} />
          </g>
        ) : (
          <g>
            <rect x={1065} y={368} width={78} height={238} rx={8} fill="#362B4D" />
            <rect x={1257} y={368} width={78} height={238} rx={8} fill="#362B4D" />
          </g>
        )}
      </g>

      {/* Blazing silver moonlight beam cutting across bedroom to the bed */}
      <polygon
        points="1145,374 1255,374 420,860 120,760"
        fill="#CFE8FF"
        opacity={variant === 'clothespin_glow' ? 0.18 : 0.34}
        pointerEvents="none"
      />

      {/* Awake Cat on the windowsill batting at moonbeams */}
      <Cat x={1195} y={602} f={t} mood="alert" />
    </g>
  );
};

/**
 * Set 9: EclipseSkySet (Ch 8: 27-day orbit racing rim past chimneys/clouds + Giant Total Solar Eclipse).
 */
export const EclipseSkySet: React.FC<{
  t: number;
  id: string;
  variant?: 'racing_rim' | 'eclipse_barely' | 'eclipse_giant';
}> = ({ t, id, variant = 'eclipse_giant' }) => {
  if (variant === 'racing_rim') {
    const shift = (t * 3.8) % 240;
    return (
      <g>
        <NightSky id={`es_${id}`} />
        <Stars t={t} n={80} />
        <GiantMoonProp
          x={820 + shift}
          y={360}
          r={245}
          t={t}
          tint="gold"
          label="27-DAY ORBIT · APPARENT WIDTH x2"
        />
        {/* Motion speed lines behind Moon */}
        {[-90, 0, 90].map((dy, i) => (
          <line
            key={i}
            x1={420 + shift}
            y1={360 + dy}
            x2={540 + shift}
            y2={360 + dy}
            stroke="#7FD4FF"
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        {/* Foreground rooftop chimneys & silhouettes */}
        <rect x={-100} y={760} width={2120} height={340} fill="#141124" />
        <rect x={340} y={590} width={95} height={180} fill="#1E1932" stroke="#3E355E" strokeWidth={3} />
        <rect x={1420} y={560} width={110} height={210} fill="#1E1932" stroke="#3E355E" strokeWidth={3} />
      </g>
    );
  }

  const isGiant = variant === 'eclipse_giant';
  return (
    <g>
      {/* Deep twilight eclipse sky */}
      <rect x={-120} y={-120} width={2160} height={1240} fill={isGiant ? '#080716' : '#141B34'} />
      <Stars t={t} n={isGiant ? 95 : 40} />

      {/* Sun + Eclipse Moon */}
      <g transform="translate(960 385)">
        <Glow x={0} y={0} r={isGiant ? 460 : 260} color="#FFB84D" o={0.62} />
        {/* Solar disc (r=95) */}
        <circle cx={0} cy={0} r={95} fill="#FFF2B2" stroke="#FF8A3D" strokeWidth={8} />
        {/* Moon silhouette covering Sun: today r=96 (barely covers) vs 2x closer r=192 (covers far more than Sun!) */}
        <GiantMoonProp
          x={0}
          y={0}
          r={isGiant ? 192 : 96}
          t={t}
          tint="eclipse"
          label={isGiant ? '2X CLOSER MOON: COVERS FAR MORE THAN THE SUN' : 'TODAY: MOON BARELY COVERS THE SUN'}
        />
      </g>

      {/* Twilight hill horizon */}
      <path d="M -120 820 Q 520 765 1040 810 Q 1540 845 2040 790 L 2040 1120 L -120 1120 Z" fill="#121024" stroke="#3E355E" strokeWidth={4} />
    </g>
  );
};

/**
 * Set 10: RooftopNov2026Set (Ch 10: Dusk rooftop with Mars & Jupiter 1.2° apart 15-16 Nov, Leonids 17-18 Nov ~15/hr, 24 Nov 2026 14:54 UTC Supermoon first of three).
 */
export const RooftopNov2026Set: React.FC<{
  t: number;
  id: string;
  skyHighlight?: 'none' | 'mars_jupiter_15_16nov' | 'leonids_17_18nov' | 'supermoon_24nov' | 'three_supermoons';
}> = ({ t, id, skyHighlight = 'supermoon_24nov' }) => {
  return (
    <g>
      <Rooftop t={t} cityLit={1.9} />

      {skyHighlight === 'mars_jupiter_15_16nov' && (
        <g transform="translate(1320 235)">
          <Glow x={0} y={0} r={220} color="#FFE27A" o={0.42} />
          <circle cx={-34} cy={10} r={16} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={3} />
          <text x={-34} y={48} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FF9A8A">
            MARS
          </text>
          <circle cx={36} cy={-10} r={26} fill="#FFF0C2" stroke="#F2B33D" strokeWidth={3} />
          <text x={36} y={48} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FFE27A">
            JUPITER
          </text>
          <circle cx={0} cy={0} r={92} fill="none" stroke="#7FD4FF" strokeWidth={3} strokeDasharray="10 8" />
          <text x={0} y={-108} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#7FD4FF">
            15–16 NOV · 1.2° APART BEFORE SUNRISE
          </text>
        </g>
      )}

      {skyHighlight === 'leonids_17_18nov' && (
        <g>
          {[
            { x0: 380, y0: 130, dx: 270, dy: 115, off: 0 },
            { x0: 840, y0: 90, dx: 310, dy: 130, off: 6 },
            { x0: 1290, y0: 155, dx: 280, dy: 120, off: 12 },
          ].map((m, i) => {
            const p = clamp((t - m.off) / 22);
            return (
              <g key={i} opacity={p > 0 ? 0.94 : 0}>
                <line
                  x1={m.x0}
                  y1={m.y0}
                  x2={m.x0 + m.dx * p}
                  y2={m.y0 + m.dy * p}
                  stroke="#FFE27A"
                  strokeWidth={5.5}
                  strokeLinecap="round"
                />
                <circle cx={m.x0 + m.dx * p} cy={m.y0 + m.dy * p} r={7.5} fill="#FFFFFF" />
              </g>
            );
          })}
        </g>
      )}

      {(skyHighlight === 'supermoon_24nov' || skyHighlight === 'three_supermoons') && (
        <g transform="translate(1380 285)">
          <GiantMoonProp
            x={0}
            y={0}
            r={108}
            t={t}
            tint="gold"
            label="24 NOV 2026 · 14:54 UTC"
            subLabel="FIRST OF THREE SUPERMOONS (NOV · DEC · JAN)"
          />
        </g>
      )}
    </g>
  );
};
