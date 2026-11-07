import React from 'react';
import {
  makeRoom,
  RoomShell,
  Box,
  S3,
  Glow,
  Cone,
  LightVeil,
  Dust,
  SkyView,
  FONT,
  UI,
  rnd,
  clamp,
  lerp,
  ShootingStar,
} from '../../engine';

export const GYM_ROOM = makeRoom({ x: 960, y: 490 }, { x0: 360, x1: 1560, y0: 210, y1: 735 }, 3.4);
export const GYM_FLOOR_Y = 835;

/** School Gym Set (Ch 1 & JumpShort): sunlit clerestory windows, gym pendant cages, hardwood court, wall chalk height board, bleachers, ball rack, gym mats. */
export const SchoolGymSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  chalkMarkM?: number;
}> = ({ t, id = 'gym', veil = 0.32, chalkMarkM }) => {
  const R = GYM_ROOM;
  return (
    <g>
      <rect x={-1200} y={-1200} width={4400} height={4000} fill="#1C1624" />
      <RoomShell
        r={R}
        id={`${id}sh`}
        floor="boards"
        wall="#3E3648"
        side="#312A3B"
        floorC="#5D4132"
        ceiling="#1E1826"
        lines="#432D22"
      />
      {/* Painted basketball court lines on perspective floor */}
      <polygon
        points={R.Q([
          [0.08, 1, 0.08],
          [0.92, 1, 0.08],
          [0.92, 1, 0.92],
          [0.08, 1, 0.92],
        ])}
        fill="none"
        stroke="#F6EFE3"
        strokeWidth={4}
        opacity={0.5}
      />
      <ellipse cx={960} cy={835} rx={220} ry={48} fill="none" stroke="#FF8A3D" strokeWidth={4} opacity={0.55} />

      {/* Three high clerestory gym windows on back wall streaming warm dusk sunlight */}
      {[420, 810, 1200].map((wx, i) => (
        <g key={`gw${i}`}>
          <SkyView
            id={`${id}w${i}`}
            clip={`M ${wx} 245 L ${wx + 300} 245 L ${wx + 300} 375 L ${wx} 375 Z`}
            box={{ x: wx, y: 245, w: 300, h: 130 }}
            t={t}
            sun={i === 1 ? { x: wx + 180, y: 340 } : undefined}
            sunR={34}
          />
          <rect x={wx - 8} y={239} width={316} height={144} fill="none" stroke="#1E1826" strokeWidth={12} />
          <line x1={wx + 100} y1={245} x2={wx + 100} y2={375} stroke="#1E1826" strokeWidth={7} />
          <line x1={wx + 200} y1={245} x2={wx + 200} y2={375} stroke="#1E1826" strokeWidth={7} />
          <Cone
            d={`M ${wx + 10} 375 L ${wx + 290} 375 L ${wx + 420} 920 L ${wx - 60} 920 Z`}
            o={0.22}
          />
        </g>
      ))}

      {/* Padded safety mats along lower back wall */}
      {Array.from({ length: 10 }).map((_, i) => {
        const px = 374 + i * 118;
        return (
          <rect
            key={`pad${i}`}
            x={px}
            y={565}
            width={112}
            height={156}
            rx={6}
            fill={i % 2 === 0 ? '#2A435E' : '#243A52'}
            stroke="#162333"
            strokeWidth={3}
          />
        );
      })}

      {/* Wooden bleachers on left side */}
      {[0, 1, 2].map((step) => (
        <Box
          key={`bl${step}`}
          r={R}
          u={[0.01, 0.16 - step * 0.04]}
          v={[0.88 - step * 0.09, 1]}
          w={[0.15, 0.72]}
          front="#6E4B38"
          top="#8A614A"
          side="#4A3124"
          rim
        />
      ))}

      {/* Jump-and-reach Chalk Measurement Board mounted on back wall (x=660..830, y=405..735) */}
      <g>
        <rect x={650} y={398} width={186} height={336} rx={8} fill="#1D332D" stroke="#121A18" strokeWidth={7} />
        <rect x={658} y={406} width={170} height={320} rx={4} fill="none" stroke={S3.warm} strokeWidth={2} opacity={0.45} />
        <text x={743} y={434} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill="#CBE5DC" letterSpacing={2}>
          JUMP REACH
        </text>
        {[0, 0.5, 1.0, 1.5, 2.0].map((m, idx) => {
          const my = 710 - m * 125;
          const label = m === 0 ? '0 m' : m === 0.5 ? '~0.5 m' : null;
          return (
            <g key={idx}>
              <line x1={666} y1={my} x2={label ? 706 : 692} y2={my} stroke="#EAF4F0" strokeWidth={3} opacity={0.82} />
              {label ? (
                <text x={714} y={my + 7} fontFamily={FONT.ui} fontSize={20} fill={m === 0.5 ? '#FFE27A' : '#EAF4F0'} opacity={0.92}>
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}
        {chalkMarkM !== undefined ? (
          <g transform={`translate(785 ${710 - chalkMarkM * 125})`}>
            <circle r={18} fill="#FFE27A" opacity={0.28} />
            <path d="M -14 4 L 14 -4 M -10 -8 L 12 8" stroke="#FFF8E6" strokeWidth={5} strokeLinecap="round" />
          </g>
        ) : null}
      </g>

      {/* Wall-mounted practice hoop on right back wall */}
      <g transform="translate(1310 450)">
        <rect x={-72} y={-52} width={144} height={96} rx={6} fill="#EAE5DC" opacity={0.82} stroke="#221D2A" strokeWidth={5} />
        <rect x={-28} y={-14} width={56} height={42} fill="none" stroke="#D9534F" strokeWidth={4} />
        <ellipse cx={0} cy={34} rx={30} ry={7} fill="none" stroke="#FF6A3D" strokeWidth={6} />
        <path d="M -26 36 L -18 72 M 26 36 L 18 72 M -10 38 L -8 72 M 10 38 L 8 72 M -22 54 L 22 54" stroke="#E6E1D6" strokeWidth={2.5} opacity={0.75} />
      </g>

      {/* Ball rack & gym mats on floor right */}
      <g transform="translate(1515 760)">
        <ellipse cx={0} cy={34} rx={78} ry={12} fill="#000" opacity={0.4} />
        <path d="M -62 30 L -62 -56 M 62 30 L 62 -56 M -62 -16 L 62 -16 M -62 -46 L 62 -46" stroke="#4D5466" strokeWidth={6} />
        {[-38, 0, 38].map((bx, k) => (
          <g key={k} transform={`translate(${bx} -32)`}>
            <circle r={17} fill="#D96B38" stroke="#1C1624" strokeWidth={3} />
            <path d="M -15 0 Q 0 -8 15 0 M 0 -16 L 0 16" stroke="#1C1624" strokeWidth={2} fill="none" />
          </g>
        ))}
      </g>
      {/* Folded blue crash mat on floor left */}
      <g transform="translate(470 790)">
        <ellipse cx={0} cy={22} rx={96} ry={14} fill="#000" opacity={0.4} />
        <rect x={-88} y={-8} width={176} height={26} rx={6} fill="#2E6B7E" stroke="#18222B" strokeWidth={3.5} />
        <line x1={-82} y1={-6} x2={82} y2={-6} stroke={S3.warm} strokeWidth={2} opacity={0.5} />
      </g>

      {/* Industrial gym pendant lamps hanging from ceiling */}
      {[560, 960, 1360].map((lx, i) => (
        <g key={`pl${i}`}>
          <line x1={lx} y1={60} x2={lx} y2={190} stroke="#191522" strokeWidth={5} />
          <polygon points={`${lx - 34},215 ${lx + 34},215 ${lx + 18},186 ${lx - 18},186`} fill="#2C2738" stroke="#14111C" strokeWidth={3} />
          <ellipse cx={lx} cy={216} rx={22} ry={6} fill="#FFE7B3" />
          <Cone d={`M ${lx - 30} 216 L ${lx + 30} 216 L ${lx + 240} 900 L ${lx - 240} 900 Z`} o={0.22} />
          <Glow x={lx} y={222} r={220} o={0.65} />
        </g>
      ))}

      <LightVeil
        id={`${id}veil`}
        lights={[
          [560, 520, 440],
          [960, 540, 520],
          [1360, 520, 440],
        ]}
        o={veil}
      />
      <Glow x={960} y={360} r={440} o={0.26} />
      <Dust t={t} seed={17} x0={340} y0={220} w={1240} h={640} n={38} o={0.55} />
    </g>
  );
};

/** High-Jump Pit, Uprights & 2.45 m World Record Crossbar for the Stadium (Ch 1). */
export const HighJumpPit: React.FC<{
  x?: number;
  groundY?: number;
  barDrop?: number;
  showRecordTag?: boolean;
}> = ({ x = 980, groundY = 855, barDrop = 0, showRecordTag = true }) => {
  // 2.45 m crossbar sits high above a scale-1 Hero (Hero height = 378 px ≈ 1.75 m -> 2.45 m ≈ 528 px above groundY!)
  const barY = groundY - 525 + barDrop;
  const matW = 540;
  const matH = 112;
  return (
    <g>
      {/* Contact shadow */}
      <ellipse cx={x} cy={groundY + 10} rx={matW * 0.56} ry={22} fill="#000" opacity={0.48} />
      {/* Thick landing crash mat */}
      <rect
        x={x - matW / 2}
        y={groundY - matH}
        width={matW}
        height={matH}
        rx={18}
        fill="#245C73"
        stroke="#131924"
        strokeWidth={5}
      />
      <rect x={x - matW / 2 + 8} y={groundY - matH + 6} width={matW - 16} height={18} rx={8} fill="#367C96" />
      <line x1={x - matW / 2 + 16} y1={groundY - matH + 6} x2={x + matW / 2 - 16} y2={groundY - matH + 6} stroke={S3.warm} strokeWidth={3} opacity={0.6} />

      {/* Left and Right aluminium upright standards */}
      {[-235, 235].map((dx, i) => (
        <g key={i} transform={`translate(${x + dx} 0)`}>
          <ellipse cx={0} cy={groundY + 4} rx={26} ry={8} fill="#000" opacity={0.45} />
          <rect x={-22} y={groundY - 12} width={44} height={14} rx={4} fill="#343A4A" stroke="#14161E" strokeWidth={3} />
          <rect x={-6} y={barY - 60} width={12} height={groundY - (barY - 60)} fill="#CBD3E0" stroke="#181C26" strokeWidth={3} />
          <rect x={dx < 0 ? 4 : -18} y={barY - 4} width={16} height={10} rx={2} fill="#FF8A3D" />
        </g>
      ))}

      {/* Crossbar at 2.45 m */}
      <line x1={x - 245} y1={barY} x2={x + 245} y2={barY} stroke="#14121C" strokeWidth={13} strokeLinecap="round" />
      <line x1={x - 245} y1={barY} x2={x + 245} y2={barY} stroke="#FFF6E5" strokeWidth={8} strokeLinecap="round" />
      {[-180, -90, 0, 90, 180].map((sx, k) => (
        <line key={k} x1={x + sx - 16} y1={barY} x2={x + sx + 16} y2={barY} stroke="#E0483E" strokeWidth={8} />
      ))}

      {showRecordTag ? (
        <g transform={`translate(${x + 335} ${barY + 6})`}>
          <line x1={-82} y1={-6} x2={-18} y2={-6} stroke="#FFE27A" strokeWidth={4} strokeDasharray="8 6" />
          <rect x={-14} y={-44} width={286} height={78} rx={16} fill="#0B0816" opacity={0.9} stroke="#FFE27A" strokeWidth={3} />
          <text x={129} y={-12} textAnchor="middle" fontFamily={FONT.ui} fontSize={21} fill="#FFE27A" letterSpacing={2}>
            WORLD RECORD (1993)
          </text>
          <text x={129} y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={31} fill="#F6EFE3">
            2.45 m · SOTOMAYOR
          </text>
        </g>
      ) : null}
    </g>
  );
};

export const BATH_ROOM = makeRoom({ x: 960, y: 500 }, { x0: 470, x1: 1450, y0: 250, y1: 745 }, 3.4);
export const BATH_FLOOR_Y = 850;

/** Tiled Bathroom Set (Ch 2: Bathroom Scale & "The One Rule"). */
export const BathroomSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  nightWindow?: boolean;
}> = ({ t, id = 'bath', veil = 0.34, nightWindow = true }) => {
  const R = BATH_ROOM;
  return (
    <g>
      <rect x={-1200} y={-1200} width={4400} height={4000} fill="#161422" />
      <RoomShell
        r={R}
        id={`${id}sh`}
        floor="tiles"
        wall="#343D4E"
        side="#283040"
        floorC="#2A3342"
        ceiling="#1A1D28"
        lines="#1E2532"
      />
      {/* Subtle wall tile wainscoting on back wall */}
      <rect x={470} y={515} width={980} height={216} fill="#2D3748" opacity={0.85} />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`wtv${i}`} x1={470 + i * 70} y1={515} x2={470 + i * 70} y2={731} stroke="#202836" strokeWidth={2} />
      ))}
      {[515, 570, 625, 680].map((wy, i) => (
        <line key={`wth${i}`} x1={470} y1={wy} x2={1450} y2={wy} stroke="#202836" strokeWidth={2} />
      ))}

      {/* Frosted/starry bathroom window on right of back wall */}
      <SkyView
        id={`${id}win`}
        clip="M 1165 320 L 1395 320 L 1395 525 L 1165 525 Z"
        box={{ x: 1165, y: 320, w: 230, h: 205 }}
        t={t}
        sun={{ x: 1295, y: 390 }}
        sunR={28}
        night={nightWindow}
      />
      <rect x={1157} y={312} width={246} height={221} fill="none" stroke="#1A1D28" strokeWidth={12} />
      <line x1={1280} y1={320} x2={1280} y2={525} stroke="#1A1D28" strokeWidth={8} />
      <line x1={1165} y1={422} x2={1395} y2={422} stroke="#1A1D28" strokeWidth={8} />

      {/* Backlit Vanity Mirror + Warm Sconce Bar above sink (left-center) */}
      <g transform="translate(760 405)">
        <Glow x={0} y={0} r={240} o={0.7} />
        <rect x={-135} y={-105} width={270} height={190} rx={22} fill="#465872" stroke="#F6EFE3" strokeWidth={6} />
        <path d="M -95 60 L 35 -85 M -45 68 L 75 -68" stroke="#9FC0FF" strokeWidth={5} opacity={0.32} strokeLinecap="round" />
        {/* Warm vanity light bar above mirror */}
        <rect x={-110} y={-132} width={220} height={16} rx={8} fill="#FFE7B3" stroke="#1E1826" strokeWidth={3} />
        <Cone d="M -105 -118 L 105 -118 L 240 430 L -240 430 Z" o={0.26} />
      </g>

      {/* Vanity sink cabinet with legs & contact shadow */}
      <Box r={R} u={[0.14, 0.44]} v={[0.66, 0.96]} w={[0.04, 0.22]} front="#4B3B38" top="#E6DFD5" side="#362927" rim />
      <ellipse cx={760} cy={755} rx={155} ry={12} fill="#000" opacity={0.42} />
      {/* Toothbrush mug & soap pump on sink */}
      <rect x={680} y={488} width={22} height={30} rx={4} fill="#5BE08A" stroke="#181520" strokeWidth={2.5} />
      <path d="M 686 488 L 680 470 M 695 488 L 702 472" stroke="#FF8A3D" strokeWidth={3} strokeLinecap="round" />
      <rect x={820} y={486} width={24} height={32} rx={5} fill="#E9C46A" stroke="#181520" strokeWidth={2.5} />

      {/* Towel rail on left wall & potted fern on right */}
      <g transform="translate(530 530)">
        <line x1={-36} y1={0} x2={48} y2={0} stroke="#8C96A6" strokeWidth={6} strokeLinecap="round" />
        <path d="M -28 0 L 38 0 L 34 96 L -32 96 Z" fill="#D96B52" stroke="#181520" strokeWidth={3} />
        <line x1={-30} y1={82} x2={34} y2={82} stroke="#FFE2B0" strokeWidth={4} />
      </g>
      <g transform="translate(1355 735)">
        <ellipse cx={0} cy={22} rx={36} ry={9} fill="#000" opacity={0.42} />
        <polygon points="-26,20 26,20 34,-26 -34,-26" fill="#9E5844" stroke="#181520" strokeWidth={3} />
        <path d="M 0 -26 Q -38 -68 -14 -92 Q 2 -54 0 -26 M 0 -26 Q 36 -64 44 -42 Q 18 -28 0 -26 M 0 -26 Q -8 -78 18 -84 Q 14 -48 0 -26" fill="#487A5C" stroke="#18261E" strokeWidth={2.5} />
      </g>

      {/* Soft teal bathmat in mid-room */}
      <polygon
        points={R.Q([
          [0.34, 1, 0.34],
          [0.66, 1, 0.34],
          [0.68, 1, 0.58],
          [0.32, 1, 0.58],
        ])}
        fill="#2E6B78"
        stroke="#18222B"
        strokeWidth={3}
      />

      <LightVeil
        id={`${id}veil`}
        lights={[
          [760, 440, 440],
          [960, 780, 460],
          [1280, 430, 320],
        ]}
        o={veil}
      />
      <Glow x={760} y={320} r={260} o={0.45} />
      <Dust t={t} seed={29} x0={520} y0={260} w={880} h={580} n={28} o={0.48} />
    </g>
  );
};

/** Floor Bathroom Scale prop (side/three-quarter view) for Pip to stand on. */
export const BathroomScaleProp: React.FC<{ x: number; y: number; s?: number; needleDeg?: number }> = ({
  x,
  y,
  s = 1,
  needleDeg = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={12} rx={98} ry={18} fill="#000" opacity={0.48} />
    <path
      d="M -86 8 L 86 8 L 74 -22 L -74 -22 Z"
      fill="#D8D2C5"
      stroke="#181520"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M -86 8 L 86 8 L 82 16 L -82 16 Z" fill="#8C867A" stroke="#181520" strokeWidth={3} />
    {/* Dial window at front */}
    <ellipse cx={0} cy={-9} rx={28} ry={9} fill="#141824" stroke="#181520" strokeWidth={3} />
    <line
      x1={0}
      y1={-4}
      x2={Math.sin((needleDeg * Math.PI) / 180) * 18}
      y2={-4 - Math.cos((needleDeg * Math.PI) / 180) * 8}
      stroke="#FF5A4A"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </g>
);

/** Macro top-down Bathroom Scale Dial turning into a GRAVITY vs JUMP dial (for Ch 2 inserts!). */
export const ScaleDialMacro: React.FC<{
  x?: number;
  y?: number;
  gravityP: number; // 0 = low gravity, 0.5 = Earth, 1 = high gravity
  label?: string;
  readout?: string;
}> = ({ x = 960, y = 560, gravityP, label = 'GRAVITY RULE', readout = 'LESS g = HIGHER JUMP' }) => {
  const ang = lerp(-72, 72, clamp(gravityP));
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={28} rx={360} ry={64} fill="#000" opacity={0.5} />
      <rect x={-340} y={-290} width={680} height={580} rx={58} fill="#CFC8BA" stroke="#181520" strokeWidth={10} />
      <rect x={-312} y={-262} width={624} height={524} rx={44} fill="#343B4C" stroke="#181520" strokeWidth={6} />
      {/* Grip pads left & right */}
      {[-185, 185].map((gx, k) => (
        <g key={k}>
          {Array.from({ length: 7 }).map((_, r) => (
            <rect key={r} x={gx - 70} y={-80 + r * 42} width={140} height={18} rx={9} fill="#222734" />
          ))}
        </g>
      ))}
      {/* Big circular dial window */}
      <circle cx={0} cy={-95} r={148} fill="#10131E" stroke="#F6EFE3" strokeWidth={8} />
      {Array.from({ length: 13 }).map((_, i) => {
        const a = (-78 + i * 13) * (Math.PI / 180);
        const col = i < 5 ? '#5BE08A' : i < 8 ? '#FFE27A' : '#FF5A4A';
        return (
          <line
            key={i}
            x1={Math.sin(a) * 114}
            y1={-95 - Math.cos(a) * 114}
            x2={Math.sin(a) * 136}
            y2={-95 - Math.cos(a) * 136}
            stroke={col}
            strokeWidth={5}
            strokeLinecap="round"
          />
        );
      })}
      <text x={-86} y={-40} fontFamily={FONT.ui} fontSize={20} fill="#5BE08A">
        LOW g
      </text>
      <text x={32} y={-40} fontFamily={FONT.ui} fontSize={20} fill="#FF5A4A">
        HIGH g
      </text>
      <g transform={`translate(0 -50) rotate(${ang})`}>
        <polygon points="-8,0 8,0 0,-102" fill="#FF6A3D" />
        <circle r={14} fill="#F6EFE3" stroke="#181520" strokeWidth={4} />
      </g>
      <rect x={-210} y={96} width={420} height={96} rx={22} fill="#0B0816" stroke="#FFE27A" strokeWidth={3.5} />
      <text x={0} y={132} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#CFC8DC" letterSpacing={3}>
        {label}
      </text>
      <text x={0} y={174} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#FFE27A">
        {readout}
      </text>
    </g>
  );
};

/** Pre-dawn Sky Overlay for Chapter 17 Rooftop: Mars + Jupiter close conjunction (mid-Nov) & Leonid meteors (17-18 Nov). */
export const DawnConjunctionOverlay: React.FC<{
  t: number;
  showConjunction?: boolean;
  showLeonids?: boolean;
}> = ({ t, showConjunction = true, showLeonids = false }) => {
  return (
    <g>
      {showConjunction ? (
        <g transform="translate(1320 235)">
          {/* Dotted binocular/skywatcher ring around close Mars & Jupiter pair */}
          <circle cx={0} cy={0} r={88} fill="none" stroke="#7FD4FF" strokeWidth={3} strokeDasharray="10 8" opacity={0.75} />
          {/* Jupiter: bright cream-gold */}
          <Glow x={-22} y={-10} r={58} o={0.9} />
          <circle cx={-22} cy={-10} r={11} fill="#FFF3D1" />
          {/* Mars: warm rust-orange very close beside Jupiter */}
          <Glow x={24} y={12} r={44} kind="red" o={0.75} />
          <circle cx={24} cy={12} r={7.5} fill="#FF7B54" />
          <g transform="translate(0 128)">
            <rect x={-215} y={-30} width={430} height={60} rx={30} fill="#0B0816" opacity={0.86} stroke="#FFE27A" strokeWidth={2.5} />
            <text y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#FFE27A" letterSpacing={2}>
              MARS + JUPITER · MID-NOV
            </text>
          </g>
        </g>
      ) : null}
      {showLeonids ? (
        <g>
          {[
            [320, 160, 720, 310, 0],
            [620, 110, 1080, 270, 9],
            [920, 150, 1420, 330, 18],
          ].map(([x0, y0, x1, y1, off], i) => {
            const p = clamp(((t + off) % 38) / 28);
            const sx = lerp(x0, x1, p);
            const sy = lerp(y0, y1, p);
            return <ShootingStar key={i} x={sx} y={sy} r={11} tailLen={210} angle={-158} t={t + i * 5} id={`leo${i}`} />;
          })}
          <g transform="translate(520 125)">
            <rect x={-235} y={-30} width={470} height={60} rx={30} fill="#0B0816" opacity={0.86} stroke="#7FD4FF" strokeWidth={2.5} />
            <text y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#7FD4FF" letterSpacing={2}>
              LEONID METEORS · 17–18 NOV
            </text>
          </g>
        </g>
      ) : null}
    </g>
  );
};
