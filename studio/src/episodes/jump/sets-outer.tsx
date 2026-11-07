import React from 'react';
import {
  makeRoom,
  RoomShell,
  rnd,
  clamp,
  lerp,
  Stars,
  Rays,
  Glow,
  Cone,
  LightVeil,
  Dust,
  S3,
  FONT,
  UI,
  Pose,
  joints,
  toWorld,
} from '../../engine';

export const TITAN_Y = 840;
export const JUPITER_BOARD_Y = 675;
export const BATH_DECK_Y = 855;
export const BOWL_FLOOR_Y = 845;
export const PLUTO_Y = 845;
export const DIMORPHOS_Y = 815;
export const SUN_DECK_Y = 840;

/** Titan Set (Ch 9: golden haze, ringed Saturn dimly glowing overhead, dark liquid-methane lake, icy shoreline boulders). */
export const TitanSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
}> = ({ t, id = 'titan', veil = 0.28 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="-900" x2="0" y2="850" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#382510" />
        <stop offset="55%" stopColor="#8A5E22" />
        <stop offset="100%" stopColor="#D69F42" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1500} width={4800} height={4200} fill={`url(#${id}sky)`} />
    {/* Giant ringed Saturn faintly glowing through Titan's golden nitrogen haze */}
    <g transform="translate(1420 285) rotate(-16)" opacity={0.44}>
      <Glow x={0} y={0} r={340} o={0.7} />
      <ellipse cx={0} cy={0} rx={295} ry={56} fill="none" stroke="#FFE29A" strokeWidth={24} opacity={0.65} />
      <circle r={118} fill="#E6B65C" />
      <path d="M -295 8 A 295 56 0 0 0 295 8" fill="none" stroke="#FFF2C6" strokeWidth={18} />
    </g>

    {/* Distant hydrocarbon hills */}
    <path
      d="M -1100 735 Q -420 610 120 715 Q 640 635 1180 725 Q 1680 610 2450 735 Z"
      fill="#4D3518"
    />

    {/* Dark glassy liquid-methane lake across middle-right */}
    <rect x={-1200} y={730} width={4400} height={190} fill="#171E2C" />
    {Array.from({ length: 12 }).map((_, i) => {
      const rx = 520 + i * 115 + Math.sin(t * 0.08 + i) * 12;
      const ry = 755 + (i % 4) * 26;
      return <line key={i} x1={rx - 45} y1={ry} x2={rx + 45} y2={ry} stroke="#F5C36C" strokeWidth={3} opacity={0.42} strokeLinecap="round" />;
    })}

    {/* Foreground icy hydrocarbon boulder shore & launch ledge on left */}
    <path
      d="M -1200 760 L 680 785 L 980 845 L 2500 865 L 2500 2400 L -1200 2400 Z"
      fill="#2C2522"
      stroke="#141110"
      strokeWidth={5}
    />
    <path d="M -1200 760 L 680 785 L 980 845 L 2500 865" stroke="#F5C36C" strokeWidth={3.5} fill="none" opacity={0.6} />
    {[220, 510, 820, 1460].map((bx, i) => (
      <g key={`tb${i}`} transform={`translate(${bx} ${815 + (i > 1 ? 55 : -10)})`}>
        <ellipse cx={0} cy={18} rx={48} ry={10} fill="#000" opacity={0.45} />
        <polygon points="-42,16 -26,-26 18,-22 44,16" fill="#463D38" stroke="#181412" strokeWidth={3.5} />
        <line x1={-26} y1={-26} x2={18} y2={-22} stroke="#FFE29A" strokeWidth={2.5} opacity={0.65} />
      </g>
    ))}
    {/* Duct-tape roll & spare cardboard box on shore */}
    <g transform="translate(340 818)">
      <rect x={-38} y={-32} width={76} height={36} rx={3} fill="#A87948" stroke="#1A1410" strokeWidth={3} />
      <circle cx={64} cy={-8} r={16} fill="none" stroke="#AEB6C4" strokeWidth={9} />
    </g>

    <LightVeil
      id={`${id}veil`}
      lights={[
        [1380, 310, 620],
        [680, 680, 640],
      ]}
      o={veil}
    />
    <Dust t={t} seed={191} x0={80} y0={220} w={1760} h={640} n={48} o={0.55} />
  </g>
);

/** Corrugated Cardboard Wings strapped to Pip's arms with silver duct tape (Ch 9!). */
export const CardboardWingsOverlay: React.FC<{ pose: Pose; flapDeg?: number }> = ({ pose, flapDeg = 0 }) => {
  const j = joints(pose);
  const shL = toWorld(pose, j.armL.root);
  const shR = toWorld(pose, j.armR.root);
  const sc = pose.scale;
  return (
    <g>
      {/* Left cardboard wing */}
      <g transform={`translate(${shL.x} ${shL.y}) rotate(${-pose.armL.a * 0.75 + flapDeg}) scale(${sc})`}>
        <polygon
          points="0,-16 -175,-52 -192,28 -18,22"
          fill="#B6834C"
          stroke="#1C1510"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <line x1={-32} y1={-18} x2={-168} y2={-38} stroke="#8C5F32" strokeWidth={3} />
        <line x1={-36} y1={4} x2={-174} y2={12} stroke="#8C5F32" strokeWidth={3} />
        {/* Silver duct-tape strips */}
        <rect x={-64} y={-28} width={20} height={52} rx={2} fill="#C4CCD9" stroke="#1C1510" strokeWidth={2.5} />
        <rect x={-122} y={-38} width={20} height={58} rx={2} fill="#C4CCD9" stroke="#1C1510" strokeWidth={2.5} />
      </g>
      {/* Right cardboard wing */}
      <g transform={`translate(${shR.x} ${shR.y}) rotate(${pose.armR.a * 0.75 - flapDeg}) scale(${sc})`}>
        <polygon
          points="0,-16 175,-52 192,28 18,22"
          fill="#C28E56"
          stroke="#1C1510"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <line x1={32} y1={-18} x2={168} y2={-38} stroke="#8C5F32" strokeWidth={3} />
        <line x1={36} y1={4} x2={174} y2={12} stroke="#8C5F32" strokeWidth={3} />
        <rect x={44} y={-28} width={20} height={52} rx={2} fill="#C4CCD9" stroke="#1C1510" strokeWidth={2.5} />
        <rect x={102} y={-38} width={20} height={58} rx={2} fill="#C4CCD9" stroke="#1C1510" strokeWidth={2.5} />
      </g>
    </g>
  );
};

/** Jupiter Diving Board Set (Ch 10: swirling striped clouds + Great Red Spot, no solid ground, high springboard). */
export const JupiterDiveSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  boardBend?: number;
  cloudForegroundCover?: boolean; // draw puffy cloud bank over sinking Pip!
}> = ({ t, id = 'jup', veil = 0.24, boardBend = 0, cloudForegroundCover = false }) => {
  if (cloudForegroundCover) {
    return (
      <g>
        {[680, 860, 1060, 1240].map((cx, i) => (
          <ellipse
            key={i}
            cx={cx + Math.sin(t * 0.1 + i) * 14}
            cy={815 + (i % 2) * 24}
            rx={220}
            ry={82}
            fill={i % 2 === 0 ? '#D9945A' : '#E8C594'}
            stroke="#5E311E"
            strokeWidth={4}
          />
        ))}
      </g>
    );
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="-900" x2="0" y2="1400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D162E" />
          <stop offset="35%" stopColor="#7A442E" />
          <stop offset="70%" stopColor="#C97B44" />
          <stop offset="100%" stopColor="#8C3D24" />
        </linearGradient>
      </defs>
      <rect x={-1400} y={-1500} width={4800} height={4200} fill={`url(#${id}sky)`} />
      <Glow x={1560} y={190} r={540} o={0.65} />

      {/* Jupiter's colossal horizontal cloud belts & zones */}
      {[
        [340, 95, '#D9A978'],
        [465, 85, '#9E4B2E'],
        [585, 95, '#E8C89E'],
        [710, 110, '#B55B36'],
        [845, 120, '#D99862'],
        [980, 140, '#7D3522'],
      ].map(([cy, h, col], i) => (
        <path
          key={`jb${i}`}
          d={`M -1200 ${Number(cy)} Q ${480 + Math.sin(t * 0.05 + i) * 60} ${Number(cy) - 24} 960 ${Number(cy)} T 3000 ${Number(cy)} L 3000 ${Number(cy) + Number(h)} L -1200 ${Number(cy) + Number(h)} Z`}
          fill={String(col)}
          opacity={0.86}
        />
      ))}
      {/* Great Red Spot swirling in lower right clouds */}
      <g transform={`translate(1420 845) rotate(${Math.sin(t * 0.04) * 4})`}>
        <ellipse rx={235} ry={96} fill="#B83B2A" stroke="#7A2118" strokeWidth={6} />
        <ellipse rx={155} ry={58} fill="#D9583B" />
        <path d="M -95 0 Q 0 -38 95 0 Q 0 38 -65 12" stroke="#FFAD85" strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>

      {/* High Diving Tower & Springboard bolted on left */}
      <g transform="translate(340 675)">
        {/* Steel support struts */}
        <path d="M -220 450 L -110 0 M -40 450 L -20 0 M -165 220 L -28 220" stroke="#2D3242" strokeWidth={18} strokeLinecap="round" />
        {/* Ladder rungs */}
        {[-60, 20, 100, 180, 260].map((ly, k) => (
          <line key={k} x1={-165} y1={ly} x2={-95} y2={ly} stroke="#8C96A8" strokeWidth={7} />
        ))}
        {/* Handrail */}
        <path d="M -140 0 L -140 -82 L 75 -82 L 75 0" stroke="#CBD4E6" strokeWidth={8} fill="none" strokeLinejoin="round" />
        {/* Flexible white/blue fiberglass diving board extending to x = 340 + 440 = 780 */}
        <path
          d={`M -160 0 L 220 0 Q 340 ${boardBend * 0.45} 450 ${boardBend}`}
          stroke="#181A24"
          strokeWidth={28}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M -160 0 L 220 0 Q 340 ${boardBend * 0.45} 450 ${boardBend}`}
          stroke="#EAEFF8"
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
        />
        <rect x={-160} y={-22} width={190} height={14} rx={4} fill="#3A7BD5" />
      </g>

      <LightVeil
        id={`${id}veil`}
        lights={[
          [1480, 240, 620],
          [780, 580, 580],
        ]}
        o={veil}
      />
      <Dust t={t} seed={211} x0={120} y0={220} w={1680} h={700} n={36} o={0.42} />
    </g>
  );
};

/** Saturn in a Giant Cosmic Bathtub Set (Ch 11: Saturn density 687 kg/m³ < water 1,000 kg/m³!). */
export const SaturnBathSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  saturnDropY?: number;
  splashP?: number;
}> = ({ t, id = 'sbath', veil = 0.26, saturnDropY = 0, splashP = 0 }) => {
  const bob = Math.sin(t * 0.14) * 10 + saturnDropY;
  const duckBob = Math.cos(t * 0.18 + 1) * 8;
  return (
    <g>
      <rect x={-1400} y={-1500} width={4800} height={4200} fill="#0A0D20" />
      <Stars seed={223} x0={-900} y0={-1100} w={3720} h={2100} t={t} n={110} o={0.85} />
      <Glow x={960} y={240} r={620} o={0.55} />
      {/* Warm cosmic chandelier / lamp globes above the tub */}
      {[420, 960, 1500].map((lx, i) => (
        <g key={`bl${i}`}>
          <line x1={lx} y1={-120} x2={lx} y2={135} stroke="#2B2F42" strokeWidth={5} />
          <circle cx={lx} cy={150} r={24} fill="#FFE7B3" />
          <Glow x={lx} y={150} r={210} o={0.65} />
        </g>
      ))}

      {/* Checkered starry bathroom deck */}
      <rect x={-1200} y={845} width={4400} height={1700} fill="#1E2438" />
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={i} x1={-300 + i * 165} y1={845} x2={960 + (-300 + i * 165 - 960) * 1.9} y2={1350} stroke="#141826" strokeWidth={3} />
      ))}

      {/* Giant Clawfoot Porcelain Bathtub (x = 420..1580, rim at y = 585, base at y = 845) */}
      <g>
        <ellipse cx={1000} cy={858} rx={590} ry={34} fill="#000" opacity={0.52} />
        {/* Water surface & bubbles inside rim */}
        <ellipse cx={1000} cy={595} rx={535} ry={58} fill="#2FA8CC" />
        <ellipse cx={1000} cy={595} rx={485} ry={42} fill="#5BE0FA" opacity={0.45} />

        {/* Giant Ringed Saturn bobbing buoyantly in the bathwater! */}
        <g transform={`translate(970 ${525 + bob}) rotate(-14)`}>
          <ellipse cx={0} cy={0} rx={315} ry={66} fill="none" stroke="#D9B26F" strokeWidth={32} />
          <ellipse cx={0} cy={0} rx={265} ry={52} fill="none" stroke="#181B28" strokeWidth={5} />
          <circle r={138} fill="#E5BE75" stroke="#181B28" strokeWidth={6} />
          {/* Saturn subtle bands */}
          <path d="M -132 -32 Q 0 -18 132 -32 M -136 12 Q 0 26 136 12" stroke="#C99A4E" strokeWidth={14} fill="none" />
          {/* Front half of rings */}
          <path d="M -315 6 A 315 66 0 0 0 315 6" fill="none" stroke="#F6DF9E" strokeWidth={24} />
        </g>

        {/* Giant Yellow Rubber Duck floating on right side of tub */}
        <g transform={`translate(1365 ${558 + duckBob})`}>
          <ellipse cx={0} cy={16} rx={58} ry={38} fill="#FFD43B" stroke="#181520" strokeWidth={4.5} />
          <circle cx={-26} cy={-26} r={30} fill="#FFD43B" stroke="#181520" strokeWidth={4.5} />
          <polygon points="-52,-28 -74,-20 -52,-12" fill="#FF7A2B" stroke="#181520" strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={-34} cy={-32} r={5} fill="#181520" />
          <path d="M 42 4 Q 64 -16 54 22" fill="#FFD43B" stroke="#181520" strokeWidth={4} />
        </g>

        {/* Splash droplets & foam bubbles */}
        {[580, 650, 740, 1220, 1450].map((bx, k) => (
          <circle key={`fb${k}`} cx={bx} cy={596 + (k % 2) * 12} r={14 + (k % 3) * 6} fill="#FFFDF8" stroke="#8AD8EE" strokeWidth={2.5} />
        ))}
        {splashP > 0 ? (
          <g opacity={clamp(1 - splashP)}>
            {[-260, -140, 140, 260].map((sx, k) => (
              <path
                key={k}
                d={`M ${970 + sx * 0.5} 585 Q ${970 + sx} ${460 - splashP * 120} ${970 + sx * 1.35} ${560 + splashP * 40}`}
                stroke="#8EEBFF"
                strokeWidth={8}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </g>
        ) : null}

        {/* Front porcelain tub body + rolled lip + golden clawfeet */}
        <path
          d="M 455 595 L 1545 595 Q 1520 825 1380 832 L 620 832 Q 480 825 455 595 Z"
          fill="#EAE5DC"
          stroke="#181520"
          strokeWidth={6}
        />
        <path d="M 480 650 Q 1000 685 1520 650 L 1480 818 L 520 818 Z" fill="#D5CEC2" opacity={0.55} />
        <rect x={432} y={574} width={1136} height={34} rx={17} fill="#FFF9F0" stroke="#181520" strokeWidth={5} />
        {[570, 1430].map((fx, i) => (
          <path
            key={i}
            d={`M ${fx - 28} 826 L ${fx - 42} 855 L ${fx + 42} 855 L ${fx + 28} 826 Z`}
            fill="#E6B44C"
            stroke="#181520"
            strokeWidth={4}
          />
        ))}
        {/* Brass faucet on left end of tub */}
        <path d="M 465 574 L 465 512 Q 465 485 498 492 L 508 518" stroke="#E6B44C" strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>

      <LightVeil
        id={`${id}veil`}
        lights={[
          [980, 480, 680],
          [420, 760, 420],
        ]}
        o={veil}
      />
      <Dust t={t} seed={229} x0={240} y0={160} w={1460} h={660} n={32} o={0.45} />
    </g>
  );
};

export const BOWL_ROOM = makeRoom({ x: 960, y: 470 }, { x0: 420, x1: 1500, y0: 210, y1: 720 }, 3.4);

/** Ice-Giant Cosmic Bowling Alley Set (Ch 12: Uranus rolling sideways at ~98°, heavy Neptune ball!). */
export const CosmicBowlingSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  uranusRollP?: number; // 0..1 rolls Uranus down left lane toward pins!
  neptuneX?: number;
  neptuneY?: number;
  pinsScatter?: number; // 0..1
}> = ({
  t,
  id = 'bowl',
  veil = 0.3,
  uranusRollP = 0.35,
  neptuneX = 1280,
  neptuneY = 825,
  pinsScatter = 0,
}) => {
  const R = BOWL_ROOM;
  const ux = lerp(740, 810, uranusRollP);
  const uy = lerp(835, 675, uranusRollP);
  const ur = lerp(74, 38, uranusRollP);
  return (
    <g>
      <rect x={-1400} y={-1500} width={4800} height={4200} fill="#120E22" />
      <RoomShell
        r={R}
        id={`${id}sh`}
        floor="boards"
        wall="#211A36"
        side="#19132A"
        floorC="#6A4834"
        ceiling="#130E22"
        lines="#4D3324"
      />
      {/* Starry mural & neon planet stripes on back wall above pin decks */}
      <Stars seed={241} x0={430} y0={220} w={1060} h={250} t={t} n={55} o={0.85} />
      <line x1={430} y1={465} x2={1490} y2={465} stroke="#7FD4FF" strokeWidth={5} />
      <line x1={430} y1={477} x2={1490} y2={477} stroke="#FF8A3D" strokeWidth={4} />

      {/* Overhead Bowling Scoreboard Screens */}
      {[
        [690, 'LANE 1 · URANUS', '98° AXIAL TILT', '#7FD4FF'],
        [1230, 'LANE 2 · NEPTUNE', 'HEAVIER PULL', '#5B8CFF'],
      ].map(([sx, l1, l2, col], i) => (
        <g key={`sc${i}`} transform={`translate(${Number(sx)} 310)`}>
          <line x1={0} y1={-100} x2={0} y2={-52} stroke="#2C2640" strokeWidth={8} />
          <rect x={-195} y={-52} width={390} height={104} rx={16} fill="#0B0816" stroke={String(col)} strokeWidth={4} />
          <text y={-12} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill={String(col)} letterSpacing={2}>
            {String(l1)}
          </text>
          <text y={28} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#F6EFE3">
            {String(l2)}
          </text>
        </g>
      ))}

      {/* Two perspective hardwood bowling lanes + dark gutters */}
      {[0.28, 0.72].map((uMid, idx) => (
        <g key={`ln${idx}`}>
          <polygon
            points={R.Q([
              [uMid - 0.14, 1, 0.04],
              [uMid + 0.14, 1, 0.04],
              [uMid + 0.16, 1, 0.96],
              [uMid - 0.16, 1, 0.96],
            ])}
            fill="#8E6243"
            stroke="#1A1326"
            strokeWidth={5}
          />
          {/* Pin deck dark recess at back wall */}
          <rect x={420 + (uMid - 0.13) * 1080} y={565} width={280} height={155} rx={8} fill="#100C1C" stroke="#2E2544" strokeWidth={4} />
          {/* Bowling pins */}
          {[-68, -24, 24, 68].map((px, pi) => {
            const scatterX = idx === 0 ? pinsScatter * (pi - 1.5) * 65 : 0;
            const scatterY = idx === 0 ? -pinsScatter * 48 : 0;
            const rot = idx === 0 ? pinsScatter * (pi % 2 ? 55 : -55) : 0;
            return (
              <g
                key={pi}
                transform={`translate(${420 + uMid * 1080 + px + scatterX} ${695 + scatterY}) rotate(${rot})`}
              >
                <ellipse cx={0} cy={-18} rx={11} ry={24} fill="#F6EFE3" stroke="#181520" strokeWidth={2.5} />
                <circle cx={0} cy={-48} r={8} fill="#F6EFE3" stroke="#181520" strokeWidth={2.5} />
                <line x1={-9} y1={-32} x2={9} y2={-32} stroke="#E0483E" strokeWidth={4} />
              </g>
            );
          })}
        </g>
      ))}

      {/* Pale-cyan Uranus rolling tipped onto its side (~98°) down Lane 1! */}
      <g transform={`translate(${ux} ${uy})`}>
        <ellipse cx={0} cy={ur + 6} rx={ur * 0.95} ry={12} fill="#000" opacity={0.45} />
        {/* 98-degree vertical ring spinning like a barrel */}
        <g transform="rotate(8)">
          <ellipse cx={0} cy={0} rx={ur * 0.34} ry={ur * 1.48} fill="none" stroke="#BCEFFF" strokeWidth={8} />
          <circle r={ur} fill="#7AD7F0" stroke="#162330" strokeWidth={4.5} />
          <path d={`M ${-ur * 0.3} ${-ur * 0.85} Q ${-ur * 0.55} 0 ${-ur * 0.3} ${ur * 0.85}`} stroke="#A8ECFF" strokeWidth={6} fill="none" opacity={0.65} />
          <path d={`M 0 ${-ur * 1.48} A ${ur * 0.34} ${ur * 1.48} 0 0 1 0 ${ur * 1.48}`} fill="none" stroke="#E6FAFF" strokeWidth={6} />
        </g>
      </g>

      {/* Deep cobalt-blue heavy Neptune ball on Lane 2 (with floor crack gag under its weight!) */}
      <g transform={`translate(${neptuneX} ${neptuneY})`}>
        <ellipse cx={0} cy={66} rx={78} ry={16} fill="#000" opacity={0.55} />
        <path d="M -88 68 L -34 62 L 0 74 L 46 60 L 92 70" stroke="#18121E" strokeWidth={4} fill="none" />
        <circle r={62} fill="#2554C7" stroke="#101830" strokeWidth={5} />
        <path d="M -54 -14 Q 0 -28 54 -10 M -48 18 Q 12 30 48 14" stroke="#4D82F5" strokeWidth={8} fill="none" strokeLinecap="round" />
        {/* Bowling-ball finger holes */}
        <circle cx={-14} cy={-24} r={6} fill="#0E152B" />
        <circle cx={8} cy={-26} r={6} fill="#0E152B" />
        <circle cx={-2} cy={-8} r={7} fill="#0E152B" />
      </g>

      {/* Warm retro pendant lamps over the lanes */}
      {[690, 1230].map((lx, i) => (
        <g key={`lp${i}`}>
          <Cone d={`M ${lx - 35} 420 L ${lx + 35} 420 L ${lx + 260} 920 L ${lx - 260} 920 Z`} o={0.22} />
          <Glow x={lx} y={420} r={250} o={0.55} />
        </g>
      ))}

      <LightVeil
        id={`${id}veil`}
        lights={[
          [690, 620, 480],
          [1230, 620, 480],
        ]}
        o={veil}
      />
      <Dust t={t} seed={251} x0={360} y0={280} w={1200} h={620} n={32} o={0.48} />
    </g>
  );
};

/** Pluto Set (Ch 13 & JumpShort: 0.62 m/s², pinpoint Sun, Tombaugh Regio heart glacier, 2-storey house scale prop for ~7 m jump!). */
export const PlutoSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  showHouse?: boolean;
  houseX?: number;
}> = ({ t, id = 'pluto', veil = 0.26, showHouse = true, houseX = 1360 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="-1300" x2="0" y2="900" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#040613" />
        <stop offset="65%" stopColor="#0D1633" />
        <stop offset="100%" stopColor="#1D2B52" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1600} width={4800} height={4400} fill={`url(#${id}sky)`} />
    <Stars seed={263} x0={-900} y0={-1300} w={3720} h={2200} t={t} n={135} o={0.95} />

    {/* Tiny brilliant pinpoint distant Sun in Pluto's sky */}
    <Glow x={360} y={180} r={220} kind="cool" o={0.85} />
    <Rays x={360} y={180} t={t} len={720} n={12} o={0.22} color="#E6F2FF" />
    <circle cx={360} cy={180} r={14} fill="#FFFFFF" />

    {/* Heart-shaped Tombaugh Regio glacier glowing softly on distant horizon */}
    <path
      d="M 860 770 C 720 675 650 565 745 505 C 815 460 860 525 860 555 C 860 525 905 460 975 505 C 1070 565 1000 675 860 770 Z"
      fill="#C9D8EE"
      opacity={0.35}
    />

    {/* Jagged water-ice mountain peaks */}
    <path
      d="M -1100 810 L -580 610 L -220 775 L 140 595 L 490 790 L 1180 785 L 1560 615 L 1940 770 L 2500 810 Z"
      fill="#263659"
      stroke="#121B30"
      strokeWidth={4}
    />
    <path d="M -580 610 L -410 688 M 140 595 L 310 688 M 1560 615 L 1730 688" stroke="#AED2FF" strokeWidth={4} opacity={0.65} />

    {/* Pale icy nitrogen plain */}
    <rect x={-1400} y={790} width={4800} height={1900} fill="#394B70" />
    <path d="M -1400 790 L 3400 790" stroke="#CFE5FF" strokeWidth={3.5} opacity={0.75} />
    {/* Polygonal nitrogen-ice convection cells */}
    {[180, 560, 960, 1420].map((px, i) => (
      <polygon
        key={`ic${i}`}
        points={`${px - 140},865 ${px},835 ${px + 150},870 ${px + 90},935 ${px - 95},930`}
        fill="none"
        stroke="#5A729E"
        strokeWidth={3}
        opacity={0.65}
      />
    ))}

    {/* 2-Storey Suburban Scale House (~6.5 m tall) with warm lit windows so 7 m jump clears the roof! */}
    {showHouse ? (
      <g transform={`translate(${houseX} ${PLUTO_Y})`}>
        <ellipse cx={0} cy={12} rx={210} ry={18} fill="#000" opacity={0.48} />
        {/* House walls (height ~380 px; pitched roof peak at -510 px ≈ 6.5 m, so -560 px = 7 m clears it!) */}
        <rect x={-165} y={-360} width={330} height={364} fill="#2C354D" stroke="#121726" strokeWidth={5} />
        <polygon points="-195,-360 0,-505 195,-360" fill="#462C3A" stroke="#121726" strokeWidth={5} strokeLinejoin="round" />
        <line x1={-195} y1={-360} x2={0} y2={-505} stroke="#CFE5FF" strokeWidth={3.5} opacity={0.7} />
        {/* Chimney */}
        <rect x={78} y={-485} width={42} height={95} fill="#3B2832" stroke="#121726" strokeWidth={4} />
        {/* Lit warm upstairs & downstairs windows + front door */}
        {[-95, 45].map((wx, c) =>
          [-305, -155].map((wy, r) => (
            <g key={`${c}-${r}`}>
              <rect x={wx} y={wy} width={54} height={68} rx={4} fill="#FFD38A" stroke="#121726" strokeWidth={4} />
              <Glow x={wx + 27} y={wy + 34} r={65} o={0.45} />
            </g>
          )),
        )}
        <rect x={-26} y={-108} width={52} height={112} rx={4} fill="#5E3C34" stroke="#121726" strokeWidth={4} />
      </g>
    ) : null}

    <LightVeil
      id={`${id}veil`}
      lights={[
        [360, 220, 560],
        [860, 620, 680],
        [houseX, 640, 420],
      ]}
      o={veil}
    />
    <Dust t={t} seed={271} x0={80} y0={180} w={1760} h={680} n={34} o={0.45} />
  </g>
);

/** Dimorphos Asteroid Set (Ch 14: 151 m rubble pile, curved horizon, Didymos in sky, 2022 DART impact crater & -33 min orbit). */
export const DimorphosSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  showDartImpact?: boolean;
}> = ({ t, id = 'dim', veil = 0.26, showDartImpact = true }) => (
  <g>
    <rect x={-1400} y={-1500} width={4800} height={4200} fill="#050610" />
    <Stars seed={283} x0={-900} y0={-1200} w={3720} h={2200} t={t} n={125} o={0.92} />
    <Glow x={240} y={180} r={440} o={0.55} />
    <Rays x={240} y={180} t={t} len={1100} n={12} o={0.14} />
    <circle cx={240} cy={180} r={36} fill="#FFF5D6" />

    {/* Larger companion asteroid Didymos looming in background sky with dotted -33 min orbital arc */}
    <g transform="translate(1480 275)">
      <path d="M -380 85 Q 0 -145 360 95" fill="none" stroke="#7FD4FF" strokeWidth={4} strokeDasharray="12 10" opacity={0.65} />
      <ellipse rx={135} ry={108} fill="#3E3B46" stroke="#181620" strokeWidth={5} />
      <path d="M -120 -45 A 135 108 0 0 1 85 -85" stroke="#FFE2B0" strokeWidth={4} fill="none" opacity={0.65} />
      <ellipse cx={-35} cy={18} rx={34} ry={22} fill="#2A2832" />
    </g>

    {/* Strongly curved 151 m rubble-pile horizon of Dimorphos! */}
    <g>
      <ellipse cx={960} cy={1560} rx={1320} ry={765} fill="#36343F" stroke="#14131A" strokeWidth={6} />
      <path d="M -180 1180 A 1320 765 0 0 1 2100 1180" stroke="#FFE2B0" strokeWidth={4} fill="none" opacity={0.62} />
      {/* Cluttered rubble-pile boulders covering Dimorphos */}
      {[
        [360, 865, 58],
        [520, 825, 42],
        [690, 808, 34],
        [1190, 815, 48],
        [1390, 845, 64],
        [1580, 895, 52],
        [780, 910, 44],
        [1080, 925, 55],
      ].map(([bx, by, br], i) => (
        <g key={`rb${i}`} transform={`translate(${bx} ${by})`}>
          <ellipse cx={6} cy={br * 0.55} rx={br * 1.15} ry={br * 0.35} fill="#000" opacity={0.48} />
          <polygon
            points={`${-br},${br * 0.4} ${-br * 0.7},${-br * 0.65} ${br * 0.35},${-br * 0.72} ${br},${br * 0.35}`}
            fill="#4B4857"
            stroke="#17161F"
            strokeWidth={3.5}
          />
          <line x1={-br * 0.7} y1={-br * 0.65} x2={br * 0.35} y2={-br * 0.72} stroke="#FFE2B0" strokeWidth={2.5} opacity={0.65} />
        </g>
      ))}

      {/* Fresh 2022 NASA DART impact dent & crumpled solar-array debris */}
      {showDartImpact ? (
        <g transform="translate(1240 835)">
          <ellipse cx={0} cy={0} rx={125} ry={34} fill="#1E1C26" stroke="#FF8A3D" strokeWidth={4} />
          {/* Bent blue DART solar panel sticking out of rubble */}
          <g transform="translate(36 -18) rotate(26)">
            <rect x={-12} y={-68} width={54} height={72} rx={3} fill="#28559A" stroke="#121622" strokeWidth={3.5} />
            <line x1={15} y1={-65} x2={15} y2={0} stroke="#6FA3F7" strokeWidth={2.5} />
            <line x1={-10} y1={-34} x2={40} y2={-34} stroke="#6FA3F7" strokeWidth={2.5} />
          </g>
        </g>
      ) : null}
    </g>

    <LightVeil
      id={`${id}veil`}
      lights={[
        [280, 220, 560],
        [960, 780, 640],
      ]}
      o={veil}
    />
    <Dust t={t} seed={293} x0={140} y0={220} w={1640} h={660} n={36} o={0.48} />
  </g>
);

/** The Sun Set (Ch 16: ~28x Earth's gravity, roiling solar plasma & magnetic loops, imaginary heat-proof platform!). */
export const SunSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
}> = ({ t, id = 'sunset', veil = 0.18 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="-900" x2="0" y2="1100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B0B0A" />
        <stop offset="45%" stopColor="#A62B14" />
        <stop offset="85%" stopColor="#FF7A1F" />
        <stop offset="100%" stopColor="#FFD24C" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1500} width={4800} height={4200} fill={`url(#${id}sky)`} />
    <Glow x={960} y={760} r={880} o={0.85} />

    {/* Giant glowing magnetic prominence loops arcing across solar sky */}
    <path
      d={`M 180 820 Q 420 ${260 + Math.sin(t * 0.08) * 24} 720 820`}
      fill="none"
      stroke="#FFB84D"
      strokeWidth={26}
      opacity={0.45}
    />
    <path
      d={`M 1180 820 Q 1480 ${210 + Math.cos(t * 0.08) * 24} 1780 820`}
      fill="none"
      stroke="#FFD97D"
      strokeWidth={22}
      opacity={0.45}
    />

    {/* Roiling golden photosphere plasma sea */}
    <rect x={-1400} y={795} width={4800} height={1800} fill="#FF9E2C" />
    {Array.from({ length: 14 }).map((_, i) => (
      <ellipse
        key={`gr${i}`}
        cx={-100 + i * 165 + Math.sin(t * 0.12 + i) * 18}
        cy={865 + (i % 3) * 44}
        rx={95}
        ry={24}
        fill="#FFE27A"
        opacity={0.65}
      />
    ))}

    {/* Imaginary dark-titanium "Heat-Proof Test Platform" floating at y = SUN_DECK_Y (840) */}
    <g transform={`translate(960 ${SUN_DECK_Y})`}>
      <ellipse cx={0} cy={38} rx={480} ry={28} fill="#591208" opacity={0.65} />
      <polygon
        points="-440,0 440,0 485,48 -485,48"
        fill="#262A38"
        stroke="#10121A"
        strokeWidth={6}
        strokeLinejoin="round"
      />
      {/* Hazard warning stripes along platform front edge */}
      {Array.from({ length: 12 }).map((_, i) => {
        const sx = -420 + i * 74;
        return (
          <polygon
            key={i}
            points={`${sx},10 ${sx + 36},10 ${sx + 20},40 ${sx - 16},40`}
            fill="#FFB833"
          />
        );
      })}
      <line x1={-440} y1={0} x2={440} y2={0} stroke="#FFF3C4" strokeWidth={4} />
    </g>

    <LightVeil id={`${id}veil`} lights={[[960, 680, 820]]} o={veil} />
    <Dust t={t} seed={307} x0={140} y0={180} w={1640} h={680} n={45} o={0.6} />
  </g>
);
