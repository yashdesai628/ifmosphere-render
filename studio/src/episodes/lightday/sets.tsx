import React from 'react';
import {
  FONT,
  Glow as EngineGlow,
  Cone,
  Stars as EngineStars,
  NightSky as EngineNightSky,
  Rooftop,
  Bedroom,
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
  <EngineStars seed={17} x0={-200} y0={-200} w={2320} h={1180} t={t} n={n} />
);

export const WORLD_FLOOR_Y = 835;

/**
 * Iconic Voyager 1 / 2 Spacecraft SVG prop:
 * 3.7m white parabolic high-gain dish, 10-sided bus, magnetometer boom, RTG boom,
 * Golden Record cover in gleaming gold on the bus, and optional radio pulse rings.
 */
export const VoyagerProbeProp: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  t: number;
  highlightRecord?: boolean;
  label?: string;
  pulseColor?: string;
}> = ({ x, y, scale = 1, rot = -18, t, highlightRecord = false, label, pulseColor = '#7FD4FF' }) => {
  const bob = Math.sin(t * 0.08) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale}) rotate(${rot})`}>
      {/* Radio pulse rings radiating from high-gain dish */}
      {[0, 1, 2].map((i) => {
        const p = ((t * 0.025 + i * 0.33) % 1);
        const r = 60 + p * 220;
        return (
          <ellipse
            key={i}
            cx={-95 - p * 90}
            cy={0}
            rx={r * 0.38}
            ry={r}
            fill="none"
            stroke={pulseColor}
            strokeWidth={3}
            opacity={(1 - p) * 0.65}
            strokeDasharray="10 8"
          />
        );
      })}

      {/* Long lattice magnetometer boom extending upper-right */}
      <line x1={30} y1={-10} x2={280} y2={-95} stroke="#9BA8B8" strokeWidth={5} />
      <line x1={30} y1={2} x2={280} y2={-85} stroke="#6C7888" strokeWidth={3} />
      {Array.from({ length: 8 }).map((_, k) => {
        const bx = 55 + k * 28;
        const by = -18 - k * 9.5;
        return <line key={k} x1={bx} y1={by - 6} x2={bx + 12} y2={by + 8} stroke="#B8C4D4" strokeWidth={2} />;
      })}
      <circle cx={284} cy={-90} r={8} fill="#FFE27A" />

      {/* RTG nuclear power boom extending lower-right */}
      <line x1={25} y1={22} x2={155} y2={115} stroke="#7A8494" strokeWidth={7} />
      <rect x={140} y={102} width={46} height={24} rx={6} transform="rotate(35 163 114)" fill="#383F4D" stroke="#B8C4D4" strokeWidth={2.5} />
      {/* Warm RTG glow */}
      <circle cx={165} cy={115} r={22} fill="#FF8A3D" opacity={0.25} />

      {/* Plasma wave whip antennas */}
      <line x1={40} y1={0} x2={260} y2={42} stroke="#D6DCE8" strokeWidth={2.2} opacity={0.8} />
      <line x1={40} y1={8} x2={235} y2={135} stroke="#D6DCE8" strokeWidth={2.2} opacity={0.8} />

      {/* Decagonal Spacecraft Bus */}
      <rect x={-18} y={-48} width={68} height={96} rx={12} fill="#2A3040" stroke="#A6B4C8" strokeWidth={3.5} />
      <rect x={-8} y={-36} width={48} height={72} rx={6} fill="#1C202B" />

      {/* The Golden Record mounted on the bus! */}
      <g transform={`translate(18 0) scale(${highlightRecord ? 1.45 : 1})`}>
        {highlightRecord ? <circle cx={0} cy={0} r={42} fill="#FFE27A" opacity={0.35 + 0.15 * Math.sin(t * 0.2)} /> : null}
        <circle cx={0} cy={0} r={22} fill="#F2B33D" stroke="#FFF2B2" strokeWidth={3} />
        <circle cx={0} cy={0} r={14} fill="none" stroke="#B87A14" strokeWidth={1.8} />
        <circle cx={0} cy={0} r={4} fill="#1D2033" />
      </g>

      {/* High-Gain Parabolic Dish (facing left toward Earth) */}
      <path
        d="M -22 -118 Q -88 0 -22 118 L -8 108 Q -64 0 -8 -108 Z"
        fill="#EEF2F8"
        stroke="#252B3B"
        strokeWidth={4}
      />
      <ellipse cx={-22} cy={0} rx={22} ry={116} fill="#DCE4F0" stroke="#8C9BB0" strokeWidth={3} />
      {/* Feed horn struts */}
      <line x1={-22} y1={-85} x2={-86} y2={0} stroke="#7C8B9E" strokeWidth={3.5} />
      <line x1={-22} y1={85} x2={-86} y2={0} stroke="#7C8B9E" strokeWidth={3.5} />
      <line x1={-22} y1={0} x2={-86} y2={0} stroke="#7C8B9E" strokeWidth={4} />
      <circle cx={-88} cy={0} r={11} fill="#3B4559" stroke="#7FD4FF" strokeWidth={3} />

      {label ? (
        <g transform={`rotate(${-rot}) translate(0 -155)`}>
          <rect x={-140} y={-24} width={280} height={42} rx={14} fill="#0D0A1A" opacity={0.9} stroke={pulseColor} strokeWidth={2.5} />
          <text y={4} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill={pulseColor} letterSpacing={2}>
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Large Golden Record close-up prop with etched pulsar map, grooves, and sound waves.
 */
export const GoldenRecordDiscProp: React.FC<{
  x: number;
  y: number;
  scale?: number;
  t: number;
  showQuote?: boolean;
}> = ({ x, y, scale = 1, t, showQuote = false }) => {
  const spin = t * 1.4;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Glow x={0} y={0} r={340} color="#FFB84D" o={0.32} />
      <g transform={`rotate(${spin})`}>
        {/* Outer copper-gold record */}
        <circle cx={0} cy={0} r={230} fill="#D99426" stroke="#FFE27A" strokeWidth={6} />
        <circle cx={0} cy={0} r={212} fill="#E8A938" />
        {/* Concentric audio grooves */}
        {[195, 175, 155, 135, 115, 95].map((r, i) => (
          <circle
            key={i}
            cx={0}
            cy={0}
            r={r}
            fill="none"
            stroke={i % 2 === 0 ? '#B57412' : '#FAD27A'}
            strokeWidth={2.2}
            strokeDasharray={i % 2 === 0 ? '28 10' : '45 14'}
          />
        ))}
        {/* Etched NASA Pulsar Map & Hydrogen Atom diagram on cover */}
        <g stroke="#5A3604" strokeWidth={3} opacity={0.85}>
          {/* Pulsar rays */}
          {Array.from({ length: 14 }).map((_, k) => {
            const ang = (k * 25.7 * Math.PI) / 180;
            const len = 45 + (k % 3) * 22;
            return <line key={k} x1={-55} y1={25} x2={-55 + Math.cos(ang) * len} y2={25 + Math.sin(ang) * len} />;
          })}
          {/* Stylus diagram upper-left */}
          <rect x={-95} y={-95} width={65} height={36} rx={6} fill="none" />
          {/* Binary hydrogen circles lower-right */}
          <circle cx={65} cy={70} r={18} fill="none" />
          <circle cx={108} cy={70} r={18} fill="none" />
          <line x1={83} y1={70} x2={90} y2={70} />
        </g>
        {/* Center spindle label */}
        <circle cx={0} cy={0} r={44} fill="#3B2308" stroke="#FFE27A" strokeWidth={4} />
        <circle cx={0} cy={0} r={10} fill="#0B0816" />
      </g>

      {/* Greeting soundwaves & 55 languages badge */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * 285} 0)`}>
          {[0, 1, 2, 3, 4].map((bar) => {
            const bh = 28 + 52 * Math.abs(Math.sin(t * 0.2 + bar * 0.8 + side));
            return (
              <rect
                key={bar}
                x={side * bar * 22 - 6}
                y={-bh / 2}
                width={12}
                height={bh}
                rx={6}
                fill="#FFE27A"
                opacity={0.85 - bar * 0.12}
              />
            );
          })}
        </g>
      ))}

      {showQuote ? (
        <g transform="translate(0 285)">
          <rect x={-470} y={-44} width={940} height={84} rx={24} fill="#0D091C" opacity={0.94} stroke="#FFE27A" strokeWidth={3.5} />
          <text y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={34} fill="#FFE27A" letterSpacing={1.5}>
            “Hello from the children of planet Earth.”
          </text>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Set 1: Bedroom Set (dusk or sunrise, with desk, phone dock, window onto Voyager dot or Sun).
 */
export const LightdayBedroomSet: React.FC<{
  t: number;
  id: string;
  sunrise?: boolean;
  sunShades?: boolean;
  blackoutAlert?: boolean;
  clockText?: string;
  suitcase?: boolean;
}> = ({ t, id, sunrise = false, sunShades = false, blackoutAlert = false, clockText = '48:00', suitcase = false }) => {
  return (
    <g>
      <Bedroom t={t} id={id} clock={clockText} lamp={blackoutAlert ? 0.35 : 0.9} veil={sunrise ? 0.22 : 0.36} />
      {/* Custom window overlay for Sunrise or Voyager 1 deep-space dot */}
      {sunrise ? (
        <g>
          <rect x={1074} y={378} width={252} height={218} fill="#FF9E44" opacity={0.78} />
          <circle cx={1200} cy={490} r={66} fill="#FFF0A8" />
          <Glow x={1200} y={490} r={340} color="#FFB84D" o={0.55} />
          {/* Warm morning light shaft across desk */}
          <polygon points="1074,378 1326,378 1580,860 720,860" fill="#FFE27A" opacity={0.18} />
          {sunShades ? (
            <g transform={`translate(1200 ${482 + Math.min(0, (t - 8) * 4)})`}>
              <rect x={-52} y={-16} width={44} height={28} rx={6} fill="#0D0B18" stroke="#FFE27A" strokeWidth={3} />
              <rect x={8} y={-16} width={44} height={28} rx={6} fill="#0D0B18" stroke="#FFE27A" strokeWidth={3} />
              <line x1={-60} y1={-10} x2={60} y2={-10} stroke="#141020" strokeWidth={5} />
              <line x1={-38} y1={-10} x2={-22} y2={4} stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
              <line x1={22} y1={-10} x2={38} y2={4} stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
            </g>
          ) : null}
        </g>
      ) : (
        <g>
          {/* Distant glinting Voyager 1 dot in the night window */}
          <circle cx={1155} cy={432} r={4 + 1.5 * Math.sin(t * 0.2)} fill="#7FD4FF" />
          <circle cx={1155} cy={432} r={14} fill="none" stroke="#7FD4FF" strokeWidth={1.5} opacity={0.65} />
          <text x={1176} y={437} fontFamily={FONT.ui} fontSize={14} fill="#7FD4FF">
            VOYAGER 1 · 1 LD
          </text>
        </g>
      )}

      {/* Red blackout warning pulse when Mars conjunction hits */}
      {blackoutAlert ? (
        <rect x={0} y={0} width={1920} height={1080} fill="#FF3B2F" opacity={0.12 + 0.08 * Math.sin(t * 0.35)} />
      ) : null}

      {/* Packed space suitcase on floor for Ch 3 cliffhanger */}
      {suitcase ? (
        <g transform="translate(1190 790)">
          <ellipse cx={0} cy={48} rx={68} ry={14} fill="#000" opacity={0.35} />
          <rect x={-52} y={-34} width={104} height={78} rx={14} fill="#D9534F" stroke="#151824" strokeWidth={4} />
          <rect x={-22} y={-52} width={44} height={20} rx={6} fill="none" stroke="#151824" strokeWidth={5} />
          <rect x={-36} y={-14} width={42} height={24} rx={4} fill="#FFE27A" />
          <text x={-15} y={3} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={13} fill="#151824">
            MARS
          </text>
        </g>
      ) : null}
    </g>
  );
};

/**
 * Set 2: Moon Base Set (384,400 km away, 1.3s one-way delay, Artemis II 3 days).
 */
export const MoonBaseSet: React.FC<{ t: number; id: string; signalPulse?: boolean }> = ({ t, id, signalPulse = true }) => {
  const pulseP = (t * 0.035) % 1;
  return (
    <g>
      <NightSky id={`mb_${id}`} />
      <Stars t={t} n={85} />
      {/* Blue Earth in the lunar sky */}
      <g transform="translate(340 235)">
        <Glow x={0} y={0} r={190} color="#4DA6FF" o={0.35} />
        <circle cx={0} cy={0} r={74} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={3} />
        <path d="M -38 -28 Q -10 -42 18 -14 Q 38 10 12 38 Q -22 28 -38 -28 Z" fill="#52B87A" opacity={0.85} />
        <path d="M -50 12 Q 0 -8 48 22" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.55} />
        <text x={0} y={108} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#9ED4FF" letterSpacing={2}>
          EARTH · 384,400 KM
        </text>
      </g>

      {/* Radio wave beam between Earth (340,235) and Moon Base dish (1220,520) */}
      {signalPulse ? (
        <g>
          <line x1={410} y1={260} x2={1210} y2={515} stroke="#7FD4FF" strokeWidth={3} strokeDasharray="14 12" opacity={0.65} />
          <circle
            cx={lerp(410, 1210, pulseP)}
            cy={lerp(260, 515, pulseP)}
            r={14}
            fill="#FFE27A"
            stroke="#FFFFFF"
            strokeWidth={3}
          />
          <text
            x={lerp(410, 1210, pulseP)}
            y={lerp(260, 515, pulseP) - 24}
            textAnchor="middle"
            fontFamily={FONT.ui}
            fontWeight={700}
            fontSize={20}
            fill="#FFE27A"
          >
            1.3 s
          </text>
        </g>
      ) : null}

      {/* Distant lunar mountain ridge */}
      <path d="M -100 720 L 220 575 L 540 675 L 890 545 L 1280 660 L 1620 560 L 2020 710 L 2020 1080 L -100 1080 Z" fill="#2A2D3D" />
      {/* Foreground lunar regolith ground */}
      <path d="M -100 785 Q 480 745 980 780 Q 1480 810 2020 770 L 2020 1120 L -100 1120 Z" fill="#464B62" stroke="#68708E" strokeWidth={4} />
      {/* Craters */}
      <ellipse cx={280} cy={865} rx={115} ry={26} fill="#34384B" stroke="#5A617D" strokeWidth={3} />
      <ellipse cx={740} cy={910} rx={85} ry={20} fill="#34384B" stroke="#5A617D" strokeWidth={3} />
      <ellipse cx={1660} cy={880} rx={125} ry={28} fill="#34384B" stroke="#5A617D" strokeWidth={3} />

      {/* Artemis II Crewed Spacecraft / Rover silhouette on left ridge */}
      <g transform="translate(560 725)">
        <ellipse cx={0} cy={32} rx={65} ry={12} fill="#000" opacity={0.35} />
        <rect x={-38} y={-28} width={76} height={42} rx={10} fill="#DCE4F2" stroke="#232838" strokeWidth={3.5} />
        <polygon points="-26,-28 0,-56 26,-28" fill="#F2B33D" stroke="#232838" strokeWidth={3.5} />
        <circle cx={-26} cy={22} r={14} fill="#232838" stroke="#9BA8B8" strokeWidth={3} />
        <circle cx={26} cy={22} r={14} fill="#232838" stroke="#9BA8B8" strokeWidth={3} />
      </g>

      {/* Geodesic Glass Moon Base Dome on right */}
      <g transform="translate(1360 795)">
        <Glow x={0} y={-110} r={290} color="#7FD4FF" o={0.32} />
        <ellipse cx={0} cy={18} rx={255} ry={34} fill="#000" opacity={0.4} />
        {/* Warm interior habitat floor */}
        <ellipse cx={0} cy={6} rx={235} ry={26} fill="#2C354D" stroke="#7FD4FF" strokeWidth={3} />
        {/* Glass dome arch */}
        <path d="M -235 6 A 235 215 0 0 1 235 6 Z" fill="#1D3B58" opacity={0.55} stroke="#9ED4FF" strokeWidth={5} />
        {/* Geodesic struts */}
        <path d="M -175 -135 L 0 -210 L 175 -135 M -215 -65 L 0 -135 L 215 -65 M 0 -210 L 0 6" stroke="#9ED4FF" strokeWidth={2.5} opacity={0.5} fill="none" />
        {/* High-gain comms dish on roof */}
        <line x1={-140} y1={-165} x2={-140} y2={-255} stroke="#DCE4F2" strokeWidth={6} />
        <path d="M -175 -290 Q -120 -255 -155 -220" fill="none" stroke="#FFE27A" strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  );
};

/**
 * Set 3: Mars Colony & Mars Conjunction Set.
 */
export const MarsColonySet: React.FC<{ t: number; id: string; conjunctionBlackout?: boolean }> = ({ t, id, conjunctionBlackout = false }) => {
  return (
    <g>
      {/* Rusty butterscotch-crimson Martian sky */}
      <defs>
        <linearGradient id={`marsSky_${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={conjunctionBlackout ? '#1A080C' : '#2D121E'} />
          <stop offset="55%" stopColor={conjunctionBlackout ? '#4A1418' : '#7A2E26'} />
          <stop offset="100%" stopColor="#C85A38" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#marsSky_${id})`} />
      <Stars t={t} n={45} />

      {/* Sun in the Martian sky (huge & blocking signal during conjunction) */}
      <g transform={`translate(${conjunctionBlackout ? 960 : 420} ${conjunctionBlackout ? 360 : 260})`}>
        <Glow x={0} y={0} r={conjunctionBlackout ? 420 : 220} color={conjunctionBlackout ? '#FF4A2B' : '#FFB84D'} o={0.55} />
        <circle cx={0} cy={0} r={conjunctionBlackout ? 135 : 54} fill="#FFE27A" stroke="#FF6A3D" strokeWidth={6} />
        {conjunctionBlackout ? (
          <g>
            {/* Blocked signal X over the Sun */}
            <circle cx={0} cy={0} r={168} fill="none" stroke="#FF3B2F" strokeWidth={5} strokeDasharray="18 12" />
            <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1A080C">
              SUN IN WAY
            </text>
          </g>
        ) : null}
      </g>

      {/* Martian mesas & canyon walls */}
      <path d="M -100 735 L 180 580 L 420 580 L 610 710 L 1050 610 L 1340 610 L 1580 720 L 2020 595 L 2020 1080 L -100 1080 Z" fill="#6E2820" />
      <path d="M -100 800 Q 520 765 1040 795 Q 1520 825 2020 785 L 2020 1120 L -100 1120 Z" fill="#9E3E2B" stroke="#C85A38" strokeWidth={4} />

      {/* Mars Habitat Pod & Comms Tower */}
      <g transform="translate(1420 790)">
        <ellipse cx={0} cy={22} rx={210} ry={28} fill="#000" opacity={0.4} />
        <path d="M -185 10 Q -185 -150 0 -150 Q 185 -150 185 10 Z" fill="#E8DED2" stroke="#38221E" strokeWidth={5} />
        <rect x={-75} y={-85} width={150} height={68} rx={16} fill="#1E2B3C" stroke="#7FD4FF" strokeWidth={3.5} />
        <line x1={120} y1={-125} x2={120} y2={-235} stroke="#DCE4F2" strokeWidth={6} />
        <circle cx={120} cy={-242} r={12} fill={conjunctionBlackout ? '#FF3B2F' : '#5BE08A'} />
      </g>

      {/* Red rocks */}
      <ellipse cx={260} cy={875} rx={75} ry={32} fill="#5C2018" />
      <ellipse cx={780} cy={895} rx={55} ry={22} fill="#5C2018" />
    </g>
  );
};

/**
 * Set 4: Neptune Orbit & Breakfast/Lunch/Dinner Table Set (4h 10m one way, Voyager 2: 12 years).
 */
export const NeptuneDiningSet: React.FC<{
  t: number;
  id: string;
  meal?: 'space' | 'breakfast' | 'lunch' | 'dinner';
}> = ({ t, id, meal = 'space' }) => {
  return (
    <g>
      <NightSky id={`nep_${id}`} />
      <Stars t={t} n={90} />

      {/* Giant Ice Giant Neptune glowing in the window / sky */}
      <g transform={`translate(${meal === 'space' ? 960 : 1320} ${meal === 'space' ? 470 : 360}) scale(${meal === 'space' ? 1.25 : 0.92})`}>
        <Glow x={0} y={0} r={340} color="#2E7BFF" o={0.45} />
        <circle cx={0} cy={0} r={175} fill="#1D56C9" stroke="#7FD4FF" strokeWidth={4} />
        {/* Supersonic wind bands */}
        <path d="M -165 -55 Q 0 -75 165 -45" stroke="#5CA8FF" strokeWidth={14} fill="none" opacity={0.55} strokeLinecap="round" />
        <path d="M -172 10 Q 0 -12 172 18" stroke="#8AD0FF" strokeWidth={10} fill="none" opacity={0.65} strokeLinecap="round" />
        <path d="M -150 75 Q 0 58 150 82" stroke="#12388A" strokeWidth={16} fill="none" opacity={0.65} strokeLinecap="round" />
        {/* Faint icy ring arc */}
        <ellipse cx={0} cy={0} rx={265} ry={42} transform="rotate(-14)" fill="none" stroke="#9ED4FF" strokeWidth={3.5} opacity={0.55} />
      </g>

      {meal === 'space' ? (
        <VoyagerProbeProp x={460} y={360} scale={0.78} rot={12} t={t} label="VOYAGER 2 · 12 YRS" pulseColor="#FFE27A" />
      ) : (
        /* Dining room table foreground for Breakfast (08:00), Lunch (12:10), Dinner (16:20) */
        <g>
          {/* Warm pendant light above table */}
          <line x1={680} y1={0} x2={680} y2={190} stroke="#2A2438" strokeWidth={6} />
          <path d="M 610 220 Q 680 155 750 220 Z" fill="#F2B33D" stroke="#181424" strokeWidth={4} />
          <Cone d="M 610 220 L 750 220 L 1060 880 L 300 880 Z" o={0.22} />

          {/* Tabletop surface */}
          <rect x={180} y={760} width={1120} height={38} rx={12} fill="#6E4730" stroke="#24160E" strokeWidth={4} />
          <rect x={260} y={798} width={32} height={280} fill="#4A2E1E" />
          <rect x={1180} y={798} width={32} height={280} fill="#4A2E1E" />

          {/* Meal props on table */}
          {meal === 'breakfast' ? (
            <g transform="translate(680 755)">
              {/* Cereal bowl & milk box */}
              <path d="M -65 -42 L 65 -42 Q 55 4 0 4 Q -55 4 -65 -42 Z" fill="#F6EFE3" stroke="#1D2033" strokeWidth={4} />
              <line x1={22} y1={-38} x2={48} y2={-72} stroke="#9BA8B8" strokeWidth={5} strokeLinecap="round" />
              <rect x={95} y={-98} width={58} height={98} rx={8} fill="#7FD4FF" stroke="#1D2033" strokeWidth={3.5} />
              <text x={0} y={32} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FFE27A">
                BREAKFAST · SENT 08:00
              </text>
            </g>
          ) : null}

          {meal === 'lunch' ? (
            <g transform="translate(680 755)">
              {/* Tall lunchtime sandwich on plate */}
              <ellipse cx={0} cy={-4} rx={85} ry={14} fill="#F6EFE3" stroke="#1D2033" strokeWidth={3.5} />
              <rect x={-52} y={-56} width={104} height={18} rx={6} fill="#E5A948" stroke="#1D2033" strokeWidth={3} />
              <rect x={-56} y={-38} width={112} height={12} rx={4} fill="#5BE08A" />
              <rect x={-50} y={-26} width={100} height={10} rx={3} fill="#FF5A4A" />
              <rect x={-52} y={-16} width={104} height={16} rx={6} fill="#E5A948" stroke="#1D2033" strokeWidth={3} />
              <text x={0} y={32} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#5BE08A">
                LUNCH · DELIVERED (+4h 10m)
              </text>
            </g>
          ) : null}

          {meal === 'dinner' ? (
            <g transform="translate(680 755)">
              {/* Steaming dinner plate & glowing evening candle */}
              <ellipse cx={0} cy={-6} rx={92} ry={16} fill="#F6EFE3" stroke="#1D2033" strokeWidth={3.5} />
              <ellipse cx={0} cy={-18} rx={58} ry={22} fill="#D9534F" stroke="#1D2033" strokeWidth={3} />
              {/* Candle */}
              <rect x={125} y={-78} width={22} height={74} rx={4} fill="#F6EFE3" stroke="#1D2033" strokeWidth={3} />
              <circle cx={136} cy={-92} r={10 + 2 * Math.sin(t * 0.3)} fill="#FFE27A" />
              <Glow x={136} y={-92} r={90} color="#FF9A3D" o={0.45} />
              <text x={0} y={32} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FF9A3D">
                DINNER · REPLY ARRIVES (+8h 20m)
              </text>
            </g>
          ) : null}
        </g>
      )}
    </g>
  );
};

/**
 * Set 5: NASA Deep Space Network Mission Control Desk with Two Clocks (Ch 8).
 */
export const MissionControlDeskSet: React.FC<{ t: number; id: string; ackReceived?: boolean }> = ({ t, id, ackReceived = false }) => {
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0E1A" />
      {/* Subtle control room grid on back wall */}
      <g stroke="#19233B" strokeWidth={1.5} opacity={0.65}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 160} y1={0} x2={i * 160} y2={780} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 130} x2={1920} y2={i * 130} />
        ))}
      </g>

      {/* Center Deep Space Network tracking screen */}
      <g transform="translate(960 365)">
        <rect x={-320} y={-185} width={640} height={330} rx={22} fill="#0F1A2E" stroke="#7FD4FF" strokeWidth={4} />
        <text y={-138} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#7FD4FF" letterSpacing={3}>
          NASA DEEP SPACE NETWORK · VOYAGER 1 LINK
        </text>
        {/* Sine wave carrier signal */}
        <path
          d={`M -270 0 Q -135 ${-70 * Math.sin(t * 0.18)} 0 0 T 270 0`}
          fill="none"
          stroke={ackReceived ? '#5BE08A' : '#FFE27A'}
          strokeWidth={4.5}
        />
        <text y={108} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill={ackReceived ? '#5BE08A' : '#FFE27A'}>
          {ackReceived ? 'DOWNLINK ACK: +48 HOURS TOTAL' : 'UPLINK COMMAND: 24 HOURS ONE WAY'}
        </text>
      </g>

      {/* TWO BIG MISSION CLOCKS on the wall (Left: TX +24h, Right: RX +24h) */}
      {[
        { x: 360, label: 'CLOCK 1 · UPLINK', sub: '24:00:00 TO ARRIVE', col: '#FFE27A', handAng: t * 3 },
        { x: 1560, label: 'CLOCK 2 · DOWNLINK', sub: '+24:00:00 FOR ANSWER', col: '#5BE08A', handAng: t * 3 + 180 },
      ].map((ck, idx) => (
        <g key={idx} transform={`translate(${ck.x} 345)`}>
          <Glow x={0} y={0} r={190} color={ck.col} o={0.22} />
          <circle cx={0} cy={0} r={118} fill="#11182B" stroke={ck.col} strokeWidth={5} />
          <line
            x1={0}
            y1={0}
            x2={Math.cos((ck.handAng * Math.PI) / 180) * 76}
            y2={Math.sin((ck.handAng * Math.PI) / 180) * 76}
            stroke={ck.col}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <circle cx={0} cy={0} r={9} fill="#F6EFE3" />
          <text y={158} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#F6EFE3" letterSpacing={2}>
            {ck.label}
          </text>
          <text y={192} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill={ck.col} letterSpacing={1.5}>
            {ck.sub}
          </text>
        </g>
      ))}

      {/* Mission Control Console Desk */}
      <rect x={140} y={760} width={1640} height={42} rx={12} fill="#252E42" stroke="#5A6B8C" strokeWidth={4} />
      <rect x={220} y={802} width={1480} height={278} fill="#161C2B" />
    </g>
  );
};

/**
 * Set 6: Deep Cosmos Set (One Light-Day Ring, Star AC +79 3888, Proxima Centauri, Andromeda + Crab Future, Voyager 2).
 */
export const DeepCosmosSet: React.FC<{
  t: number;
  id: string;
  mode: 'lightday_ring' | 'golden_record' | 'star_ac79' | 'proxima' | 'andromeda' | 'crab_future' | 'voyager2_twist';
  gag?: string;
}> = ({ t, id, mode, gag }) => {
  return (
    <g>
      <NightSky id={`cos_${id}`} />
      <Stars t={t} n={110} />

      {mode === 'lightday_ring' ? (
        <g>
          {/* Pale tiny Sun on left, 1-Light-Day glowing ring on right */}
          <Glow x={260} y={520} r={140} color="#FFE27A" o={0.35} />
          <circle cx={260} cy={520} r={26} fill="#FFF2B2" />
          <text x={260} y={575} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#FFE27A">
            EARTH / SUN
          </text>
          <ellipse cx={260} cy={520} rx={1180} ry={480} fill="none" stroke="#7FD4FF" strokeWidth={4} strokeDasharray="18 12" />
          <line x1={286} y1={520} x2={1440} y2={520} stroke="#FFE27A" strokeWidth={3} strokeDasharray="10 8" />

          {gag === 'birthday' ? (
            <g transform="translate(960 660)">
              {/* Birthday cake with "+24h LATE" and "+48h REPLY" */}
              <rect x={-110} y={-40} width={220} height={85} rx={16} fill="#F28C6A" stroke="#1D2033" strokeWidth={4} />
              <path d="M -110 -20 Q -55 10 0 -20 Q 55 10 110 -20" fill="none" stroke="#FFF2E2" strokeWidth={8} />
              <rect x={-10} y={-88} width={20} height={48} fill="#FFE27A" stroke="#1D2033" strokeWidth={3} />
              <circle cx={0} cy={-102} r={12} fill="#FF8A3D" />
              <text y={82} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FFE27A">
                BIRTHDAY WISH: +24h LATE · REPLY: +48h!
              </text>
            </g>
          ) : null}

          {gag === 'argument' ? (
            <g transform="translate(960 620)">
              <rect x={-360} y={-55} width={720} height={110} rx={28} fill="#1B1630" stroke="#7FD4FF" strokeWidth={3.5} />
              <text y={-4} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#F6EFE3">
                48 HOURS LATER: “WAIT... WHAT WERE WE MAD ABOUT??”
              </text>
              <text y={36} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FFE27A">
                ARGUMENTS EXPIRE IN TRANSIT
              </text>
            </g>
          ) : null}
        </g>
      ) : null}

      {mode === 'golden_record' ? (
        <GoldenRecordDiscProp x={960} y={480} scale={1.02} t={t} showQuote={gag === 'quote'} />
      ) : null}

      {mode === 'star_ac79' ? (
        <g>
          {/* Red dwarf star AC +79 3888 (17+ light-years away) */}
          <g transform="translate(1480 390)">
            <Glow x={0} y={0} r={320} color="#FF5A4A" o={0.5} />
            <circle cx={0} cy={0} r={96} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={5} />
            <text y={145} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFE27A">
              STAR AC +79 3888
            </text>
            <text y={182} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FF9A8A">
              17+ LIGHT-YEARS AWAY
            </text>
          </g>
          {/* Trajectory arc passing within ~1.7 ly in 40,000 years */}
          <path d="M 220 720 Q 860 560 1420 210" fill="none" stroke="#7FD4FF" strokeWidth={4} strokeDasharray="16 10" />
          <line x1={1480} y1={390} x2={1365} y2={245} stroke="#5BE08A" strokeWidth={3.5} strokeDasharray="8 6" />
          <text x={1250} y={230} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#5BE08A">
            ~1.7 LY FLYBY · 40,000 YEARS
          </text>
          <VoyagerProbeProp x={640} y={600} scale={0.78} rot={-22} t={t} label="VOYAGER 1" />
        </g>
      ) : null}

      {mode === 'proxima' ? (
        <g>
          {/* Proxima Centauri (~4.24 ly, reply ~8.5 years) */}
          <g transform="translate(1460 330)">
            <Glow x={0} y={0} r={280} color="#FF6A4D" o={0.45} />
            <circle cx={0} cy={0} r={78} fill="#FF5A4A" stroke="#FFE27A" strokeWidth={4} />
            <text y={124} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FFE27A">
              PROXIMA CENTAURI · ~4.24 LY
            </text>
            <text y={160} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#7FD4FF">
              ROUND-TRIP REPLY: ~8.5 YEARS
            </text>
          </g>
          {/* Floor for Kid -> Adult Pip aging comparison */}
          <rect x={0} y={820} width={1920} height={260} fill="#18142B" stroke="#3E3759" strokeWidth={4} />
        </g>
      ) : null}

      {mode === 'andromeda' ? (
        <g transform="translate(960 490)">
          <Glow x={0} y={0} r={480} color="#A66BFF" o={0.42} />
          <g transform={`rotate(${-22 + t * 0.08}) scale(1 0.44)`}>
            <circle cx={0} cy={0} r={340} fill="none" stroke="#9E7BFF" strokeWidth={28} opacity={0.45} strokeDasharray="220 90" />
            <circle cx={0} cy={0} r={220} fill="none" stroke="#7FD4FF" strokeWidth={24} opacity={0.65} strokeDasharray="160 70" />
            <circle cx={0} cy={0} r={95} fill="#FFF2C2" />
          </g>
          <text y={265} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFE27A" letterSpacing={3}>
            ANDROMEDA GALAXY · ~2.5 MILLION LIGHT-YEARS
          </text>
        </g>
      ) : null}

      {mode === 'crab_future' ? (
        <g>
          {/* Futuristic Earth +2.5 Million Years: Glowing Crab-Humans */}
          <rect x={0} y={795} width={1920} height={285} fill="#162836" stroke="#5BE08A" strokeWidth={4} />
          {/* Crystalline spires */}
          <polygon points="220,795 280,460 340,795" fill="#23485E" stroke="#7FD4FF" strokeWidth={3} />
          <polygon points="1540,795 1610,420 1680,795" fill="#23485E" stroke="#7FD4FF" strokeWidth={3} />
          {/* Two funny glowing futuristic crab-humans inspecting Pip's phone */}
          {[680, 1240].map((cx, idx) => {
            const pinch = 12 * Math.sin(t * 0.25 + idx);
            return (
              <g key={idx} transform={`translate(${cx} 730)`}>
                <Glow x={0} y={-40} r={150} color="#5BE08A" o={0.28} />
                {/* Crab legs */}
                {[-1, 1].map((sd) => (
                  <g key={sd} stroke="#FF6A4D" strokeWidth={8} strokeLinecap="round">
                    <line x1={sd * 40} y1={10} x2={sd * 95} y2={58} />
                    <line x1={sd * 30} y1={22} x2={sd * 75} y2={64} />
                  </g>
                ))}
                {/* Futuristic shell torso */}
                <ellipse cx={0} cy={-15} rx={78} ry={52} fill="#FF5A4A" stroke="#FFE27A" strokeWidth={4} />
                {/* Glowing cyan cyber-visor */}
                <rect x={-48} y={-42} width={96} height={24} rx={12} fill="#7FD4FF" stroke="#120E20" strokeWidth={3} />
                {/* Eyestalk antennas */}
                <line x1={-24} y1={-64} x2={-32} y2={-98} stroke="#FFE27A" strokeWidth={4} />
                <circle cx={-32} cy={-102} r={8} fill="#5BE08A" />
                <line x1={24} y1={-64} x2={32} y2={-98} stroke="#FFE27A" strokeWidth={4} />
                <circle cx={32} cy={-102} r={8} fill="#5BE08A" />
                {/* Big pincer claws */}
                <path d={`M -75 -25 Q -130 ${-75 + pinch} -95 -105 Q -70 -80 -65 -45`} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={3.5} />
                <path d={`M 75 -25 Q 130 ${-75 - pinch} 95 -105 Q 70 -80 65 -45`} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={3.5} />
                <text y={-124} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FFE27A">
                  {idx === 0 ? '“WHO IS BO??” 🦀' : '“+2.5M YEARS LATE!” 🦀'}
                </text>
              </g>
            );
          })}
        </g>
      ) : null}

      {mode === 'voyager2_twist' ? (
        <g>
          {/* Twin paths of Voyager 1 (18 Nov 2026) and Voyager 2 (Nov 2035) */}
          <circle cx={240} cy={540} r={28} fill="#FFE27A" />
          <ellipse cx={240} cy={540} rx={1150} ry={460} fill="none" stroke="#7FD4FF" strokeWidth={3.5} strokeDasharray="16 10" />
          <path d="M 268 530 L 1365 340" stroke="#7FD4FF" strokeWidth={4} />
          <path d="M 268 550 L 1180 735" stroke="#5BE08A" strokeWidth={4} strokeDasharray="12 8" />
          <VoyagerProbeProp x={1365} y={335} scale={0.62} rot={-14} t={t} label="VOYAGER 1 · 18 NOV 2026" pulseColor="#7FD4FF" />
          <VoyagerProbeProp x={1120} y={720} scale={0.68} rot={16} t={t} label="VOYAGER 2 · NOV 2035" pulseColor="#5BE08A" />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Set 7: Earth Rooftop at Dusk with November 2026 Skywatching Highlights
 * (17 Nov Voyager Light-Day, 17-18 Nov Leonid Meteors, 15-16 Nov Mars-Jupiter Conjunction).
 */
export const RooftopNov2026Set: React.FC<{
  t: number;
  id: string;
  skyHighlight?: 'none' | 'voyager_17nov' | 'leonids_17_18nov' | 'mars_jupiter_15_16nov';
}> = ({ t, id, skyHighlight = 'none' }) => {
  return (
    <g>
      <Rooftop t={t} cityLit={1.8} />
      {skyHighlight === 'voyager_17nov' ? (
        <g transform="translate(1360 220)">
          <Glow x={0} y={0} r={180} color="#7FD4FF" o={0.45} />
          <circle cx={0} cy={0} r={10} fill="#FFFFFF" />
          <circle cx={0} cy={0} r={34 + 8 * Math.sin(t * 0.2)} fill="none" stroke="#7FD4FF" strokeWidth={3} />
          <text y={64} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FFE27A">
            17 NOV · VOYAGER LIGHT-DAY CELEBRATION
          </text>
        </g>
      ) : null}

      {skyHighlight === 'leonids_17_18nov' ? (
        <g>
          {/* Streaking Leonid meteors across dusk sky */}
          {[
            { x0: 420, y0: 140, dx: 260, dy: 110, off: 0 },
            { x0: 880, y0: 95, dx: 310, dy: 130, off: 7 },
            { x0: 1320, y0: 165, dx: 280, dy: 120, off: 14 },
          ].map((m, i) => {
            const p = clamp((t - m.off) / 24);
            return (
              <g key={i} opacity={p > 0 ? 0.92 : 0}>
                <line
                  x1={m.x0}
                  y1={m.y0}
                  x2={m.x0 + m.dx * p}
                  y2={m.y0 + m.dy * p}
                  stroke="#FFE27A"
                  strokeWidth={5}
                  strokeLinecap="round"
                />
                <circle cx={m.x0 + m.dx * p} cy={m.y0 + m.dy * p} r={7} fill="#FFFFFF" />
              </g>
            );
          })}
        </g>
      ) : null}

      {skyHighlight === 'mars_jupiter_15_16nov' ? (
        <g transform="translate(1320 235)">
          <Glow x={0} y={0} r={210} color="#FFE27A" o={0.38} />
          {/* Close pair: Mars (amber-red) and Jupiter (bright cream) */}
          <circle cx={-38} cy={12} r={16} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={2.5} />
          <text x={-38} y={48} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FF9A8A">
            MARS
          </text>
          <circle cx={42} cy={-10} r={26} fill="#FFF0C2" stroke="#F2B33D" strokeWidth={3} />
          <text x={42} y={48} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#FFE27A">
            JUPITER
          </text>
          <circle cx={0} cy={0} r={96} fill="none" stroke="#7FD4FF" strokeWidth={2.5} strokeDasharray="10 8" />
        </g>
      ) : null}
    </g>
  );
};
