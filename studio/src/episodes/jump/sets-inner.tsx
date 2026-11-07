import React from 'react';
import {
  rnd,
  clamp,
  lerp,
  Stars,
  Sun,
  Rays,
  Glow,
  Cone,
  LightVeil,
  Dust,
  S3,
  FONT,
  UI,
  Hero,
  Pose,
  LOOKS,
} from '../../engine';

export const COMET_Y = 840;
export const MOON_Y = 840;
export const MARS_Y = 840;
export const MERCURY_Y = 840;
export const VENUS_Y = 845;

/** Comet 67P Set (Ch 0, Ch 15 & JumpShort): starry cosmos, distant sunlit gas jets, dark craggy bilobed rock terrain. */
export const CometSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  groundOffsetY?: number; // push comet down as Pip floats higher and higher!
  cometScale?: number; // shrink comet into a tiny pebble in deep space!
}> = ({ t, id = 'comet', veil = 0.28, groundOffsetY = 0, cometScale = 1 }) => {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="-1200" x2="0" y2="2400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#04050E" />
          <stop offset="55%" stopColor="#0B1026" />
          <stop offset="100%" stopColor="#171630" />
        </linearGradient>
      </defs>
      <rect x={-1400} y={-1600} width={4800} height={4400} fill={`url(#${id}sky)`} />
      {/* Faint diagonal Milky Way dust band */}
      <g transform="rotate(-18 960 440)" opacity={0.22} filter="url(#blur16)">
        <ellipse cx={960} cy={360} rx={1550} ry={170} fill="#4D5B9E" />
        <ellipse cx={880} cy={340} rx={1100} ry={85} fill="#8FA8FF" />
      </g>
      <Stars seed={71} x0={-900} y0={-1200} w={3720} h={3200} t={t} n={130} o={0.9} />

      {/* Distant bright Sun upper-left casting crisp rim rays and comet coma jets */}
      <Sun x={175} y={165} r={46} t={t} />
      <Glow x={175} y={165} r={380} o={0.55} />

      {/* Sublimating ice-and-dust gas jets streaming from the comet toward the right */}
      <g
        transform={`translate(960 ${COMET_Y + groundOffsetY}) scale(${cometScale}) translate(-960 ${-COMET_Y})`}
      >
        {[
          [560, 770, 260, -68],
          [1140, 750, 310, -62],
          [1450, 790, 220, -58],
        ].map(([jx, jy, len, ang], i) => (
          <g key={`jet${i}`} transform={`translate(${jx} ${jy}) rotate(${ang})`} opacity={0.32}>
            <Cone d={`M -16 0 L 16 0 L 110 ${len} L -110 ${len} Z`} o={0.65} />
          </g>
        ))}

        {/* Back lobe of bilobed duck-shaped comet 67P */}
        <path
          d="M 1180 820 Q 1260 560 1510 540 Q 1760 530 1830 760 L 1880 960 L 1120 960 Z"
          fill="#222534"
          stroke="#10121B"
          strokeWidth={5}
        />
        <path d="M 1220 680 Q 1340 555 1525 548" stroke="#9FB6E8" strokeWidth={4} fill="none" opacity={0.55} />

        {/* Main foreground craggy comet ridge & ground */}
        <path
          d="M -900 940 L -420 825 L -60 790 L 320 825 L 680 805 L 1040 832 L 1420 808 L 1880 845 L 2500 940 L 2500 2400 L -900 2400 Z"
          fill="#1B1D2A"
          stroke="#0D0E16"
          strokeWidth={6}
        />
        {/* Sunlit upper rim edge along comet rock */}
        <path
          d="M -420 825 L -60 790 L 320 825 L 680 805 L 1040 832 L 1420 808 L 1880 845"
          stroke="#FFE2B0"
          strokeWidth={4}
          fill="none"
          opacity={0.62}
        />
        {/* Craters and scattered angular boulders */}
        {[
          [260, 885, 95, 22],
          [740, 910, 130, 26],
          [1290, 895, 110, 24],
          [1640, 925, 85, 18],
        ].map(([cx, cy, rx, ry], i) => (
          <g key={`cr${i}`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#12141F" stroke="#34384E" strokeWidth={3} />
            <path
              d={`M ${cx - rx * 0.85} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx * 0.85} ${cy}`}
              stroke="#FFE2B0"
              strokeWidth={2.5}
              fill="none"
              opacity={0.35}
            />
          </g>
        ))}
        {Array.from({ length: 18 }).map((_, i) => {
          const bx = -220 + i * 128 + rnd(81, i) * 35;
          const by = 835 + rnd(82, i) * 140;
          const br = 12 + rnd(83, i) * 24;
          return (
            <g key={`rk${i}`} transform={`translate(${bx} ${by})`}>
              <ellipse cx={4} cy={br * 0.55} rx={br * 1.1} ry={br * 0.35} fill="#000" opacity={0.45} />
              <polygon
                points={`${-br},${br * 0.4} ${-br * 0.6},${-br * 0.7} ${br * 0.4},${-br * 0.55} ${br},${br * 0.45}`}
                fill="#2D3145"
                stroke="#10121C"
                strokeWidth={3}
              />
              <line x1={-br * 0.6} y1={-br * 0.7} x2={br * 0.4} y2={-br * 0.55} stroke="#FFE2B0" strokeWidth={2} opacity={0.6} />
            </g>
          );
        })}
      </g>

      <LightVeil
        id={`${id}veil`}
        lights={[
          [220, 210, 520],
          [960, 680, 620],
        ]}
        o={veil}
      />
      <Dust t={t} seed={77} x0={-200} y0={120} w={2320} h={920} n={44} o={0.55} />
    </g>
  );
};

/** ESA's Philae Lander prop (boxy blue-solar + gold thermal body on 3 spindly landing legs) for Ch 15 & Short! */
export const PhilaeLanderProp: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  harpoonFail?: boolean;
}> = ({ x, y, s = 1, rot = 0, harpoonFail = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    {/* 3 spindly tripod landing legs + ice-screw feet */}
    <path
      d="M -28 -26 L -82 32 M 28 -26 L 82 32 M 0 -22 L 0 38"
      stroke="#9BA6BA"
      strokeWidth={6}
      strokeLinecap="round"
    />
    {[-82, 0, 82].map((fx, i) => (
      <rect key={i} x={fx - 14} y={i === 1 ? 34 : 28} width={28} height={8} rx={3} fill="#D9A441" stroke="#141620" strokeWidth={2.5} />
    ))}
    {/* Gold thermal baseplate + dark blue solar-panel hood */}
    <rect x={-48} y={-44} width={96} height={24} rx={4} fill="#D99B38" stroke="#141620" strokeWidth={4} />
    <rect x={-52} y={-98} width={104} height={58} rx={6} fill="#253E6B" stroke="#141620" strokeWidth={4} />
    {[-30, 0, 30].map((gx, i) => (
      <line key={i} x1={gx} y1={-94} x2={gx} y2={-44} stroke="#4C74B8" strokeWidth={2.5} />
    ))}
    <line x1={-48} y1={-96} x2={48} y2={-96} stroke="#FFE2B0" strokeWidth={3} opacity={0.75} />
    {/* Top antenna mast */}
    <line x1={18} y1={-98} x2={18} y2={-124} stroke="#CBD4E6" strokeWidth={4} />
    <circle cx={18} cy={-126} r={6} fill="#FF8A3D" />
    {harpoonFail ? (
      <g transform="translate(0 -12)">
        <path d="M -12 0 Q -26 22 -8 34 Q 10 44 -4 58" stroke="#FF5A4A" strokeWidth={3.5} fill="none" strokeDasharray="6 4" />
        <text x={32} y={24} fontFamily={FONT.ui} fontSize={20} fill="#FF5A4A">
          CLANK!
        </text>
      </g>
    ) : null}
  </g>
);

/** Earth Globe hanging in the Moon's sky. */
export const EarthInSky: React.FC<{ x?: number; y?: number; r?: number }> = ({ x = 1480, y = 225, r = 92 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Glow x={0} y={0} r={r * 2.8} kind="cool" o={0.65} />
    <circle r={r} fill="#2668B8" stroke="#8EC5FF" strokeWidth={3} />
    {/* Stylized continents + white cloud swirls */}
    <path
      d={`M ${-r * 0.45} ${-r * 0.45} Q ${-r * 0.1} ${-r * 0.6} ${r * 0.25} ${-r * 0.25} Q ${r * 0.15} ${r * 0.15} ${-r * 0.3} ${r * 0.1} Z`}
      fill="#49A86A"
    />
    <path
      d={`M ${r * 0.1} ${r * 0.18} Q ${r * 0.55} ${r * 0.12} ${r * 0.42} ${r * 0.62} Q ${r * 0.08} ${r * 0.68} ${r * 0.02} ${r * 0.35} Z`}
      fill="#49A86A"
    />
    <path
      d={`M ${-r * 0.65} ${-r * 0.1} Q ${-r * 0.1} ${-r * 0.25} ${r * 0.55} ${-r * 0.05}`}
      stroke="#FFFFFF"
      strokeWidth={r * 0.11}
      strokeLinecap="round"
      fill="none"
      opacity={0.7}
    />
    {/* Crescent shadow on right edge */}
    <path
      d={`M ${r * 0.25} ${-r * 0.96} A ${r} ${r} 0 0 1 ${r * 0.25} ${r * 0.96} A ${r * 0.65} ${r} 0 0 0 ${r * 0.25} ${-r * 0.96} Z`}
      fill="#060A1C"
      opacity={0.58}
    />
  </g>
);

/** Moon Set (Ch 3, Ch 4 & JumpShort): starry black sky, Earth overhead, sunlit grey regolith craters, Apollo LM option. */
export const MoonSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  showLander?: boolean;
  earthX?: number;
  earthY?: number;
}> = ({ t, id = 'moon', veil = 0.26, showLander = false, earthX = 1480, earthY = 220 }) => {
  return (
    <g>
      <rect x={-1400} y={-1600} width={4800} height={4400} fill="#050712" />
      <Stars seed={103} x0={-900} y0={-1200} w={3720} h={2100} t={t} n={120} o={0.92} />
      <Sun x={220} y={175} r={54} t={t} />
      <EarthInSky x={earthX} y={earthY} r={88} />

      {/* Distant sunlit lunar mountain range */}
      <path
        d="M -900 790 L -420 640 L -80 725 L 280 590 L 660 735 L 1060 620 L 1460 720 L 1840 605 L 2450 790 Z"
        fill="#3B3E4D"
        stroke="#1C1E28"
        strokeWidth={4}
      />
      <path
        d="M -420 640 L -260 682 M 280 590 L 450 658 M 1060 620 L 1220 672 M 1840 605 L 2020 668"
        stroke="#C8CEE0"
        strokeWidth={4}
        opacity={0.55}
      />

      {/* Grey lunar regolith plain */}
      <path
        d="M -1200 785 Q 480 755 960 778 Q 1520 795 2800 770 L 2800 2500 L -1200 2500 Z"
        fill="#565A6B"
      />
      <path d="M -1200 785 Q 480 755 960 778 Q 1520 795 2800 770" stroke="#D5DCF0" strokeWidth={3.5} fill="none" opacity={0.65} />

      {/* Rim-lit lunar craters & bootprints */}
      {[
        [290, 875, 130, 26],
        [780, 920, 95, 20],
        [1340, 880, 150, 30],
        [1710, 945, 85, 18],
      ].map(([cx, cy, rx, ry], i) => (
        <g key={`mc${i}`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#3E4252" stroke="#282B38" strokeWidth={4} />
          <path
            d={`M ${cx - rx * 0.9} ${cy + 2} A ${rx} ${ry} 0 0 0 ${cx + rx * 0.9} ${cy + 2}`}
            stroke="#DCE3F5"
            strokeWidth={3}
            fill="none"
            opacity={0.5}
          />
        </g>
      ))}
      {/* Bootprint trail in dust */}
      {[520, 575, 630, 685].map((bx, i) => (
        <ellipse key={`bp${i}`} cx={bx} cy={856 + (i % 2) * 10} rx={12} ry={5} fill="#343846" opacity={0.75} />
      ))}

      {/* Optional Apollo Lunar Module & Planted Flag in mid-ground (Ch 4) */}
      {showLander ? (
        <g transform="translate(1410 795)">
          <ellipse cx={0} cy={22} rx={155} ry={18} fill="#000" opacity={0.5} />
          {/* Spindly landing gear legs + round footpads */}
          <path d="M -68 -36 L -128 18 M 68 -36 L 128 18 M -24 -32 L -42 22 M 24 -32 L 42 22" stroke="#D9A441" strokeWidth={6} />
          {[-128, -42, 42, 128].map((px, k) => (
            <ellipse key={k} cx={px} cy={20} rx={20} ry={6} fill="#E6B44C" stroke="#181A24" strokeWidth={2.5} />
          ))}
          {/* Gold-foil octagonal descent stage */}
          <rect x={-78} y={-92} width={156} height={60} rx={6} fill="#D99B38" stroke="#181A24" strokeWidth={4} />
          <line x1={-78} y1={-62} x2={78} y2={-62} stroke="#A87020" strokeWidth={3} />
          {/* Grey ascent module with triangular windows & dish */}
          <polygon points="-64,-92 64,-92 50,-168 -50,-168" fill="#8C93A4" stroke="#181A24" strokeWidth={4} />
          <polygon points="-38,-122 -12,-122 -22,-146" fill="#181E2C" />
          <polygon points="38,-122 12,-122 22,-146" fill="#181E2C" />
          <circle cx={0} cy={-184} r={18} fill="#DCE2F0" stroke="#181A24" strokeWidth={3} />
          {/* Stiff wire-held mission flag beside lander */}
          <g transform="translate(-210 15)">
            <line x1={0} y1={4} x2={0} y2={-135} stroke="#DCE2F0" strokeWidth={4} />
            <rect x={0} y={-135} width={76} height={46} fill="#D9534F" stroke="#181A24" strokeWidth={2.5} />
            <rect x={0} y={-135} width={32} height={24} fill="#2B528C" />
            <line x1={32} y1={-122} x2={76} y2={-122} stroke="#F6EFE3" strokeWidth={5} />
            <line x1={0} y1={-102} x2={76} y2={-102} stroke="#F6EFE3" strokeWidth={5} />
          </g>
        </g>
      ) : null}

      <LightVeil
        id={`${id}veil`}
        lights={[
          [260, 220, 560],
          [880, 740, 660],
          [earthX, earthY, 320],
        ]}
        o={veil}
      />
      <Dust t={t} seed={109} x0={120} y0={260} w={1680} h={640} n={30} o={0.42} />
    </g>
  );
};

/** Bulky Apollo Spacesuit + Heavy PLSS Backpack Character Wrapper (for Ch 4 Charlie Duke / Astronaut!). */
export const BulkySuitHero: React.FC<{
  pose: Pose;
  rimId?: 'rimR' | 'rimL' | 'rimBlue';
  shadow?: number;
}> = ({ pose, rimId = 'rimL', shadow = 0.45 }) => {
  const sc = pose.scale;
  return (
    <g>
      {/* Heavy PLSS Life-Support Backpack drawn behind/beside torso */}
      <g
        transform={`translate(${pose.x} ${pose.y}) rotate(${pose.spin + pose.tilt}) scale(${sc})`}
      >
        <rect
          x={pose.yaw >= 0 ? -92 : 18}
          y={-155}
          width={74}
          height={128}
          rx={12}
          fill="#DCE2EE"
          stroke="#181A26"
          strokeWidth={5}
        />
        <rect
          x={pose.yaw >= 0 ? -82 : 28}
          y={-138}
          width={54}
          height={32}
          rx={6}
          fill="#8C96A8"
        />
        <line
          x1={pose.yaw >= 0 ? -72 : 72}
          y1={-155}
          x2={pose.yaw >= 0 ? -72 : 72}
          y2={-192}
          stroke="#DCE2EE"
          strokeWidth={6}
        />
        <circle cx={pose.yaw >= 0 ? -72 : 72} cy={-196} r={7} fill="#FF8A3D" />
      </g>
      <Hero
        look={{
          ...LOOKS.pip,
          jacket: '#EAEFF8',
          jacketShade: '#C8D1E2',
          accent: '#D9534F',
          limb: '#E4EAF5',
          shoe: '#6E778A',
        }}
        pose={pose}
        rimId={rimId}
        shadow={shadow}
      />
      {/* Gold-tinted fishbowl helmet visor ring over head */}
      <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.spin + pose.tilt}) scale(${sc})`}>
        <circle cx={pose.yaw * 10} cy={-196} r={62} fill="#FFB84D" opacity={0.22} stroke="#EAEFF8" strokeWidth={9} />
        <path d={`M ${pose.yaw * 10 - 38} -224 A 52 52 0 0 1 ${pose.yaw * 10 + 26} -236`} stroke="#FFF8E6" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
        {/* Chest control box */}
        <rect x={-26 + pose.yaw * 12} y={-118} width={52} height={38} rx={6} fill="#CFD7E6" stroke="#181A26" strokeWidth={3.5} />
        <circle cx={-10 + pose.yaw * 12} cy={-99} r={6} fill="#3A7BD5" />
        <circle cx={10 + pose.yaw * 12} cy={-99} r={6} fill="#D9534F" />
      </g>
    </g>
  );
};

/** Mars Streetball Court Set (Ch 5: gravity 3.71 m/s², 2.6x higher basketball dunk!). */
export const MarsCourtSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  hoopX?: number;
}> = ({ t, id = 'mars', veil = 0.28, hoopX = 1380 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="-900" x2="0" y2="850" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B1E26" />
        <stop offset="55%" stopColor="#8C4332" />
        <stop offset="100%" stopColor="#E08B58" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1500} width={4800} height={4200} fill={`url(#${id}sky)`} />
    {/* Small pale bluish-white Martian dusk Sun */}
    <Glow x={420} y={320} r={280} kind="cool" o={0.55} />
    <Rays x={420} y={320} t={t} color="#DCEBFF" o={0.11} />
    <circle cx={420} cy={320} r={42} fill="#F2F7FF" />

    {/* Layered rust-red Martian mesas & canyon rims */}
    <path
      d="M -900 790 L -520 620 L -210 620 L -90 755 L 220 755 L 360 585 L 680 585 L 810 760 L 1220 740 L 1460 610 L 1780 610 L 1940 775 L 2500 790 Z"
      fill="#6A2B22"
    />
    <path
      d="M -520 620 L -210 620 M 360 585 L 680 585 M 1460 610 L 1780 610"
      stroke="#F5A872"
      strokeWidth={4}
      opacity={0.55}
    />

    {/* Rusty red regolith court ground */}
    <rect x={-1400} y={775} width={4800} height={1900} fill="#8A3828" />
    <path d="M -1400 775 L 3400 775" stroke="#F5A872" strokeWidth={3} opacity={0.5} />
    {/* Chalked streetball key & 3-point arc in the red dust */}
    <g stroke="#F6EFE3" strokeWidth={5} opacity={0.62} fill="none">
      <polygon points={`${hoopX - 580},810 ${hoopX + 120},810 ${hoopX + 220},945 ${hoopX - 720},945`} />
      <path d={`M ${hoopX - 580} 810 Q ${hoopX - 960} 878 ${hoopX - 720} 945`} />
    </g>

    {/* Solar court floodlight pole */}
    <g transform={`translate(${hoopX + 240} 790)`}>
      <line x1={0} y1={0} x2={0} y2={-460} stroke="#2A1E24" strokeWidth={10} />
      <rect x={-52} y={-486} width={76} height={32} rx={6} fill="#2A1E24" />
      <circle cx={-22} cy={-470} r={12} fill="#FFE7B3" />
      <Cone d="M -45 -462 L 5 -462 L -160 60 L -560 60 Z" o={0.22} />
      <Glow x={-22} y={-470} r={220} o={0.65} />
    </g>

    {/* Tall Martian Basketball Hoop */}
    <g transform={`translate(${hoopX} ${MARS_Y})`}>
      <ellipse cx={0} cy={8} rx={68} ry={12} fill="#000" opacity={0.45} />
      <path d="M 48 4 L 48 -420 L -36 -455" stroke="#2D2530" strokeWidth={16} fill="none" strokeLinejoin="round" />
      <path d="M 44 4 L 44 -420 L -36 -455" stroke="#5A4B5E" strokeWidth={6} fill="none" strokeLinejoin="round" />
      {/* Backboard */}
      <rect x={-48} y={-545} width={22} height={150} rx={4} fill="#F4EFE6" stroke="#1C1622" strokeWidth={4} />
      <rect x={-50} y={-480} width={6} height={46} fill="#FF5A4A" />
      {/* Orange Rim + Chain Net */}
      <ellipse cx={-92} cy={-434} rx={44} ry={9} fill="none" stroke="#FF6A3D" strokeWidth={8} />
      <path
        d="M -132 -432 L -116 -372 M -52 -432 L -68 -372 M -108 -430 L -102 -372 M -76 -430 L -82 -372 M -124 -402 L -60 -402 M -118 -382 L -66 -382"
        stroke="#DCE2EE"
        strokeWidth={3}
        opacity={0.82}
      />
    </g>

    {/* Scattered rusty rocks */}
    {[160, 480, 920, 1690].map((rx, i) => (
      <g key={`mr${i}`} transform={`translate(${rx} ${865 + (i % 2) * 45})`}>
        <ellipse cx={4} cy={12} rx={26} ry={7} fill="#000" opacity={0.4} />
        <polygon points="-24,10 -14,-14 12,-10 24,10" fill="#5E231B" stroke="#28100E" strokeWidth={3} />
      </g>
    ))}

    <LightVeil
      id={`${id}veil`}
      lights={[
        [420, 340, 520],
        [hoopX - 180, 560, 580],
      ]}
      o={veil}
    />
    <Dust t={t} seed={131} x0={80} y0={260} w={1720} h={640} n={42} o={0.55} />
  </g>
);

export const BasketballProp: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({
  x,
  y,
  r = 30,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill="#E86F32" stroke="#18131C" strokeWidth={3.5} />
    <path
      d={`M ${-r} 0 L ${r} 0 M 0 ${-r} L 0 ${r} M ${-r * 0.68} ${-r * 0.68} Q 0 0 ${-r * 0.68} ${r * 0.68} M ${r * 0.68} ${-r * 0.68} Q 0 0 ${r * 0.68} ${r * 0.68}`}
      stroke="#18131C"
      strokeWidth={2.5}
      fill="none"
    />
    <path d={`M ${-r * 0.65} ${-r * 0.4} A ${r * 0.8} ${r * 0.8} 0 0 1 ${r * 0.25} ${-r * 0.78}`} stroke="#FFE2B0" strokeWidth={2.5} fill="none" opacity={0.7} />
  </g>
);

/** Mercury Set (Ch 6: same pull as Mars, 4,222-hour solar day, giant crawling Sun!). */
export const MercurySet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  sunCrawlP?: number; // 0..1 tiny crawl of the giant Sun
  showChair?: boolean;
  hourCount?: number;
}> = ({ t, id = 'merc', veil = 0.28, sunCrawlP = 0, showChair = false, hourCount }) => {
  const sunX = 980 + sunCrawlP * 32;
  const sunY = 740 - sunCrawlP * 28;
  return (
    <g>
      <rect x={-1400} y={-1500} width={4800} height={4200} fill="#07060F" />
      <Stars seed={149} x0={-900} y0={-1100} w={3720} h={1850} t={t} n={95} o={0.8} />
      {/* Enormous close-up blazing Sun barely creeping above the horizon */}
      <Glow x={sunX} y={sunY} r={760} o={0.85} />
      <Rays x={sunX} y={sunY} t={t * 0.15} len={1800} n={18} o={0.18} />
      <circle cx={sunX} cy={sunY} r={310} fill="#FFF3CC" />
      <circle cx={sunX} cy={sunY} r={275} fill="#FFFDF2" />

      {/* Jagged scorched silver-grey scarps & cliffs */}
      <path
        d="M -1200 790 L -540 650 L -120 745 L 260 675 L 620 770 L 1320 775 L 1660 660 L 2040 735 L 2600 790 L 2600 2400 L -1200 2400 Z"
        fill="#3E3B46"
        stroke="#18161E"
        strokeWidth={5}
      />
      <path
        d="M -540 650 L -120 745 L 260 675 L 620 770 L 1320 775 L 1660 660 L 2040 735"
        stroke="#FFF0C2"
        strokeWidth={4}
        fill="none"
        opacity={0.75}
      />
      {/* Heat-cracked foreground rock deck */}
      <rect x={-1200} y={785} width={4400} height={1700} fill="#2F2D38" />
      {[310, 680, 1140, 1540].map((cx, i) => (
        <path
          key={`crk${i}`}
          d={`M ${cx} 820 L ${cx - 38} 865 L ${cx + 16} 910 L ${cx - 22} 960`}
          stroke="#18161E"
          strokeWidth={4}
          fill="none"
        />
      ))}

      {showChair ? (
        <g transform="translate(640 835)">
          <ellipse cx={0} cy={12} rx={95} ry={14} fill="#000" opacity={0.5} />
          {/* Folding striped lawn chair */}
          <path d="M -56 8 L 28 -78 M 52 8 L -34 -78 M -42 -42 L 46 -38" stroke="#CBD4E2" strokeWidth={7} strokeLinecap="round" />
          <path d="M -52 -84 L -24 -40 L 46 -38" stroke="#FF8A3D" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Snack box & drink cup beside chair */}
          <rect x={76} y={-34} width={42} height={44} rx={5} fill="#E9C46A" stroke="#181520" strokeWidth={3} />
          <text x={97} y={-6} textAnchor="middle" fontFamily={FONT.ui} fontSize={14} fill="#181520">
            CHIPS
          </text>
        </g>
      ) : null}

      {hourCount !== undefined ? (
        <g transform="translate(1430 620)">
          {/* Post-mounted solar-day hour counter / flip calendar */}
          <line x1={0} y1={40} x2={0} y2={225} stroke="#8C93A4" strokeWidth={8} />
          <ellipse cx={0} cy={226} rx={36} ry={8} fill="#000" opacity={0.45} />
          <rect x={-155} y={-78} width={310} height={132} rx={18} fill="#0B0816" stroke="#FFE27A" strokeWidth={4} />
          <text x={0} y={-36} textAnchor="middle" fontFamily={FONT.ui} fontSize={21} fill="#CFC8DC" letterSpacing={2}>
            SOLAR DAY WAIT
          </text>
          <text x={0} y={24} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#FFE27A">
            {`${hourCount.toLocaleString()} h`}
          </text>
        </g>
      ) : null}

      <LightVeil
        id={`${id}veil`}
        lights={[
          [sunX, sunY - 60, 740],
          [680, 760, 480],
        ]}
        o={veil}
      />
      <Dust t={t} seed={157} x0={180} y0={320} w={1560} h={560} n={34} o={0.5} />
    </g>
  );
};

/** Venus Set (Ch 7 & Ch 8): oppressive yellow-amber clouds, 93x crushing pressure, 465 °C glowing basalt, Venera lander option. */
export const VenusSet: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  showPressureArrows?: boolean;
  showVenera?: boolean;
  veneraTimer?: string;
  veneraFried?: boolean;
}> = ({
  t,
  id = 'venus',
  veil = 0.26,
  showPressureArrows = false,
  showVenera = false,
  veneraTimer = '~2 HOURS',
  veneraFried = false,
}) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="-900" x2="0" y2="900" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4A2810" />
        <stop offset="48%" stopColor="#9E5B1B" />
        <stop offset="100%" stopColor="#E69A38" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-1500} width={4800} height={4200} fill={`url(#${id}sky)`} />
    {/* Thick rolling sulfuric cloud bands */}
    <g filter="url(#blur10)" opacity={0.62}>
      {[180, 310, 440, 570].map((cy, i) => (
        <ellipse
          key={i}
          cx={960 + Math.sin(t * 0.04 + i) * 65}
          cy={cy}
          rx={1350}
          ry={62}
          fill={i % 2 === 0 ? '#6E3B14' : '#C87A28'}
        />
      ))}
    </g>
    <Glow x={960} y={380} r={680} o={0.55} />

    {/* Distant volcanic cones */}
    <path
      d="M -900 810 L -320 610 L 120 800 L 580 650 L 980 805 L 1460 585 L 1940 810 Z"
      fill="#4D2418"
    />

    {/* Cracked basalt slab ground glowing orange-red with 465 °C heat */}
    <rect x={-1400} y={795} width={4800} height={1800} fill="#2B1614" />
    <path d="M -1400 795 L 3400 795" stroke="#FFB85C" strokeWidth={3.5} opacity={0.65} />
    {[220, 640, 1060, 1520].map((lx, i) => (
      <path
        key={`lv${i}`}
        d={`M ${lx} 815 L ${lx + 85} 855 L ${lx + 24} 910 L ${lx + 120} 965`}
        stroke="#FF6A2B"
        strokeWidth={6}
        fill="none"
        opacity={0.78}
      />
    ))}
    {/* Rising heat-shimmer waves */}
    {Array.from({ length: 9 }).map((_, i) => {
      const hx = 220 + i * 185;
      const shift = Math.sin(t * 0.25 + i) * 10;
      return (
        <path
          key={`hw${i}`}
          d={`M ${hx + shift} 780 Q ${hx - 14 + shift} 720 ${hx + shift} 660 Q ${hx + 14 + shift} 600 ${hx + shift} 540`}
          stroke="#FFE29A"
          strokeWidth={3}
          fill="none"
          opacity={0.32}
        />
      );
    })}

    {showPressureArrows ? (
      <g opacity={0.85}>
        {[460, 720, 1200, 1460].map((ax, i) => {
          const bob = (t * 3 + i * 7) % 28;
          return (
            <g key={`pa${i}`} transform={`translate(${ax} ${280 + bob})`}>
              <line x1={0} y1={0} x2={0} y2={130} stroke="#FF5A4A" strokeWidth={12} strokeLinecap="round" />
              <polygon points="-26,118 26,118 0,162" fill="#FF5A4A" />
            </g>
          );
        })}
      </g>
    ) : null}

    {showVenera ? (
      <g transform="translate(960 835)">
        <ellipse cx={0} cy={14} rx={170} ry={22} fill="#000" opacity={0.55} />
        {/* Soviet Venera-style ring landing cushion + spherical titanium pressure hull + aerobrake disc + camera arm */}
        <rect x={-135} y={-12} width={270} height={22} rx={10} fill="#6E7482" stroke="#18141A" strokeWidth={4} />
        <path d="M -98 -12 L -68 -68 M 98 -12 L 68 -68 M -40 -12 L -30 -68 M 40 -12 L 30 -68" stroke="#8C93A4" strokeWidth={7} />
        <circle cx={0} cy={-112} r={68} fill={veneraFried ? '#3B2C2E' : '#9AA2B2'} stroke="#18141A" strokeWidth={5} />
        {/* Wide aerodynamic brake collar */}
        <rect x={-124} y={-168} width={248} height={20} rx={6} fill="#7B8292" stroke="#18141A" strokeWidth={4} />
        {/* Cylindrical top antenna mast */}
        <rect x={-34} y={-246} width={68} height={78} rx={8} fill="#8C93A4" stroke="#18141A" strokeWidth={4} />
        <path d="M -28 -232 L 28 -216 M -28 -208 L 28 -192" stroke="#D9A441" strokeWidth={4} />
        {/* Camera quartz window arm */}
        <path d="M 64 -105 L 118 -78 L 118 -58" stroke="#CBD3E2" strokeWidth={8} fill="none" />
        {/* Big Countdown Clock mounted right above/beside lander */}
        <g transform="translate(0 -345)">
          <rect
            x={-185}
            y={-58}
            width={370}
            height={112}
            rx={22}
            fill="#0B0816"
            stroke={veneraFried ? '#FF5A4A' : '#FFE27A'}
            strokeWidth={4}
          />
          <text x={0} y={-18} textAnchor="middle" fontFamily={FONT.ui} fontSize={21} fill="#CFC8DC" letterSpacing={3}>
            VENERA SURFACE CLOCK
          </text>
          <text
            x={0}
            y={34}
            textAnchor="middle"
            fontFamily={FONT.ui}
            fontWeight={700}
            fontSize={48}
            fill={veneraFried ? '#FF5A4A' : '#FFE27A'}
          >
            {veneraTimer}
          </text>
        </g>
        {veneraFried ? (
          <g>
            <path d="M -42 -152 L -68 -188 L -34 -195 L -55 -232" stroke="#FFE27A" strokeWidth={5} fill="none" />
            <path d="M 48 -138 L 86 -166 L 62 -182 L 96 -212" stroke="#FF5A4A" strokeWidth={5} fill="none" />
          </g>
        ) : null}
      </g>
    ) : null}

    <LightVeil
      id={`${id}veil`}
      lights={[
        [960, 420, 640],
        [960, 820, 560],
      ]}
      o={veil}
    />
    <Dust t={t} seed={173} x0={140} y0={280} w={1640} h={620} n={46} o={0.55} />
  </g>
);
