import React from 'react';
import { rnd, clamp, lerp } from '../anim';
import { NightSky, Stars, Moon } from '../kit';
import { S3 } from '../room';
import { Glow, Cone, LightVeil, Dust } from '../light';
import { FONT } from '../fonts';

// The Night Park set, composed natively for 1080 x 1920 vertical (9:16) with wide bleed (-600..1680 x -400..2320)
// so camera moves, low angles, and close-ups never clip.
// Features: deep starry sky, Moon, distant city skyline, park hills, wrought-iron fence & gate, perspective stone path,
// two cast-iron Victorian park lamps with warm cones & pools, festoon string lights, trees, wooden park bench,
// brass stargazing telescope on tripod, park noticeboard, thermos & backpack, bushes, pond reflection, and LightVeil.

export const PARK_PATH_Y = 1310; // default standing ground y for characters in the middle safe area (hips ~ 1310 - 140*scale)

/** A glowing shooting star / captured star pebble: warm golden-white core, cyan-gold halo, optional streak tail. */
export const ShootingStar: React.FC<{
  x: number;
  y: number;
  r?: number;
  tailLen?: number;
  angle?: number; // degrees, direction the tail trails behind (e.g. -135 means coming from top-left)
  t?: number;
  red?: number;
  id?: string;
}> = ({ x, y, r = 18, tailLen = 0, angle = -135, t = 0, red = 0, id = 'st' }) => {
  const pulse = 1 + 0.1 * Math.sin(t * 0.45);
  const coreCol = red > 0.5 ? '#FFF0E6' : '#FFFDF4';
  const midCol = red > 0.5 ? '#FF5A3A' : '#FFD86B';
  const outerCol = red > 0.5 ? '#FF2211' : '#7FD4FF';
  const rad = r * pulse;
  return (
    <g transform={`translate(${x} ${y})`}>
      {tailLen > 0 ? (
        <g transform={`rotate(${angle})`}>
          <defs>
            <linearGradient id={`${id}tail`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={midCol} stopOpacity={0.95} />
              <stop offset="35%" stopColor={outerCol} stopOpacity={0.55} />
              <stop offset="100%" stopColor={outerCol} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${-rad * 0.65} L ${tailLen} 0 L 0 ${rad * 0.65} Z`}
            fill={`url(#${id}tail)`}
          />
          <path
            d={`M 0 0 L ${tailLen * 0.82} 0`}
            stroke={coreCol}
            strokeWidth={Math.max(2, rad * 0.42)}
            strokeLinecap="round"
            opacity={0.9}
          />
        </g>
      ) : null}
      <Glow x={0} y={0} r={rad * 4.2} kind={red > 0.5 ? 'red' : 'warm'} o={0.85} />
      <circle cx={0} cy={0} r={rad * 1.55} fill={outerCol} opacity={0.32} />
      <circle cx={0} cy={0} r={rad * 1.1} fill={midCol} opacity={0.85} />
      {/* 4-point star flare */}
      <path
        d={`M 0 ${-rad * 2.1} Q ${rad * 0.22} ${-rad * 0.22} ${rad * 2.1} 0 Q ${rad * 0.22} ${rad * 0.22} 0 ${rad * 2.1} Q ${-rad * 0.22} ${rad * 0.22} ${-rad * 2.1} 0 Q ${-rad * 0.22} ${-rad * 0.22} 0 ${-rad * 2.1} Z`}
        fill={coreCol}
        opacity={0.92}
      />
      <circle cx={0} cy={0} r={rad * 0.62} fill={coreCol} />
    </g>
  );
};

/** A glass mason jar holding captured glowing stars. `crack` (0..1) draws a glowing fracture for the turn. */
export const StarJar: React.FC<{
  x: number;
  y: number; // bottom centre of the jar
  s?: number;
  stars?: number;
  glow?: number;
  red?: number;
  crack?: number;
  lid?: boolean;
  t?: number;
}> = ({ x, y, s = 1, stars = 8, glow = 1, red = 0, crack = 0, lid = true, t = 0 }) => {
  const w = 96;
  const h = 132;
  const starPositions = [
    [-22, -26],
    [18, -22],
    [-4, -44],
    [-24, -62],
    [22, -58],
    [4, -78],
    [-16, -92],
    [18, -94],
    [0, -28],
    [-10, -68],
    [12, -46],
    [-6, -104],
  ];
  const tint = red > 0.5 ? '#FF5A3A' : '#FFE27A';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Contact shadow */}
      <ellipse cx={0} cy={6} rx={w * 0.56} ry={10} fill="#000" opacity={0.4} />
      {/* Outer bloom */}
      {glow > 0 ? (
        <Glow x={0} y={-h * 0.5} r={140 * (0.6 + 0.5 * glow)} kind={red > 0.5 ? 'red' : 'warm'} o={0.75 * Math.min(1, glow)} />
      ) : null}
      {/* Glass body back fill */}
      <rect
        x={-w / 2}
        y={-h}
        width={w}
        height={h}
        rx={18}
        fill={red > 0.5 ? '#3A1218' : '#1A2838'}
        opacity={0.62}
        stroke={red > 0.5 ? '#FF8A6A' : '#A9D4FF'}
        strokeWidth={4}
      />
      {/* Inner warm starlight pool */}
      {stars > 0 ? (
        <rect
          x={-w / 2 + 6}
          y={-h + 14}
          width={w - 12}
          height={h - 20}
          rx={13}
          fill={tint}
          opacity={0.18 + Math.min(0.45, stars * 0.04)}
        />
      ) : null}
      {/* Captured stars floating inside */}
      {starPositions.slice(0, stars).map(([sx, sy], i) => {
        const dx = Math.sin(t * 0.12 + i * 1.7) * 5;
        const dy = Math.cos(t * 0.15 + i * 2.3) * 4;
        const sr = 8 + (i % 3) * 2;
        return (
          <g key={i} transform={`translate(${sx + dx} ${sy + dy})`}>
            <circle r={sr * 1.9} fill={tint} opacity={0.35} />
            <circle r={sr} fill={red > 0.5 ? '#FF7A5A' : '#FFE88A'} />
            <circle r={sr * 0.55} fill="#FFFFFF" />
          </g>
        );
      })}
      {/* Glass specular highlights */}
      <path
        d={`M ${-w / 2 + 12} ${-h + 20} L ${-w / 2 + 12} ${-18}`}
        stroke="#FFFFFF"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.55}
      />
      <path
        d={`M ${w / 2 - 12} ${-h + 26} L ${w / 2 - 12} ${-26}`}
        stroke={tint}
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Neck & threaded rim */}
      <rect x={-w * 0.42} y={-h - 14} width={w * 0.84} height={16} rx={4} fill="#2A394A" stroke="#141824" strokeWidth={3.5} />
      {lid ? (
        <g>
          <rect x={-w * 0.45} y={-h - 24} width={w * 0.9} height={14} rx={5} fill="#8C96A6" stroke="#181520" strokeWidth={3.5} />
          <path d={`M ${-w * 0.38} ${-h - 20} L ${w * 0.38} ${-h - 20}`} stroke="#DCE6F2" strokeWidth={2.5} opacity={0.75} />
        </g>
      ) : null}
      {/* Crack on the glass for the turn */}
      {crack > 0 ? (
        <path
          d={`M 6 ${-h + 18} L -10 ${-h * 0.68} L 14 ${-h * 0.48} L -8 ${-h * 0.25} L 8 -14 M -10 ${-h * 0.68} L -32 ${-h * 0.54}`}
          stroke="#FFF4DC"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={220}
          strokeDashoffset={220 * (1 - crack)}
          style={{ filter: 'drop-shadow(0 0 8px #FF3A2A)' }}
        />
      ) : null}
    </g>
  );
};

/** Wooden park bench with cast-iron frame and contact shadow. */
export const ParkBench: React.FC<{ x: number; y: number; s?: number; red?: number }> = ({ x, y, s = 1, red = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={155} ry={14} fill="#000" opacity={0.42} />
    {/* Back cast-iron legs */}
    <path d="M -125 0 L -118 -115 M 125 0 L 118 -115" stroke="#171622" strokeWidth={10} strokeLinecap="round" />
    {/* Wooden backrest slats */}
    {[-106, -82, -58].map((by, i) => (
      <g key={i}>
        <rect x={-142} y={by} width={284} height={18} rx={4} fill={red > 0.5 ? '#4A2228' : '#5E4032'} stroke="#1A1418" strokeWidth={3} />
        <path d={`M -138 ${by + 2} L 138 ${by + 2}`} stroke={red > 0.5 ? '#FF7A5A' : S3.warm} strokeWidth={2} opacity={0.55} />
      </g>
    ))}
    {/* Seat slats */}
    <polygon points="-148,-34 148,-34 162,-16 -162,-16" fill={red > 0.5 ? '#5A282E' : '#6E4C3B'} stroke="#1A1418" strokeWidth={3} />
    <rect x={-162} y={-16} width={324} height={12} rx={3} fill="#462F24" stroke="#1A1418" strokeWidth={3} />
    {/* Front cast-iron legs and armrests */}
    <path d="M -138 6 L -138 -52 Q -138 -68 -120 -68 L -118 -34 M 138 6 L 138 -52 Q 138 -68 120 -68 L 118 -34" stroke="#171622" strokeWidth={9} fill="none" strokeLinecap="round" />
    <ellipse cx={-138} cy={6} rx={14} ry={4} fill="#000" opacity={0.5} />
    <ellipse cx={138} cy={6} rx={14} ry={4} fill="#000" opacity={0.5} />
  </g>
);

const ParkLamp: React.FC<{ x: number; y: number; s?: number; red?: number }> = ({ x, y, s = 1, red = 0 }) => {
  const topY = y - 470 * s;
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={32 * s} ry={8 * s} fill="#000" opacity={0.45} />
      {/* Base & fluted post */}
      <path d={`M ${x - 18 * s} ${y} L ${x - 10 * s} ${y - 55 * s} L ${x + 10 * s} ${y - 55 * s} L ${x + 18 * s} ${y} Z`} fill="#191B28" stroke="#0E0F18" strokeWidth={3} />
      <path d={`M ${x} ${y - 50 * s} L ${x} ${topY + 45 * s}`} stroke="#191B28" strokeWidth={11 * s} />
      <path d={`M ${x - 3 * s} ${y - 50 * s} L ${x - 3 * s} ${topY + 45 * s}`} stroke={S3.warm} strokeWidth={2 * s} opacity={0.45} />
      {/* Crossbar */}
      <rect x={x - 24 * s} y={topY + 52 * s} width={48 * s} height={7 * s} rx={3} fill="#191B28" />
      {/* Lantern housing */}
      <polygon
        points={`${x - 22 * s},${topY + 45 * s} ${x + 22 * s},${topY + 45 * s} ${x + 30 * s},${topY + 8 * s} ${x - 30 * s},${topY + 8 * s}`}
        fill={red > 0.5 ? '#FF7A5A' : '#FFE7B3'}
        stroke="#191B28"
        strokeWidth={4 * s}
      />
      <polygon
        points={`${x - 34 * s},${topY + 8 * s} ${x},${topY - 16 * s} ${x + 34 * s},${topY + 8 * s}`}
        fill="#191B28"
      />
      <Cone
        d={`M ${x - 24 * s} ${topY + 42 * s} L ${x + 24 * s} ${topY + 42 * s} L ${x + 260 * s} ${y + 90 * s} L ${x - 260 * s} ${y + 90 * s} Z`}
        o={0.34 * (1 - red * 0.35)}
      />
      <Glow x={x} y={topY + 26 * s} r={240 * s} kind={red > 0.5 ? 'red' : 'warm'} o={0.85} />
    </g>
  );
};

export const Park: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  red?: number;
  low?: number;
  bench?: boolean;
  meteors?: number;
  fireball?: number; // 0..1 for the giant approaching bolide in beats 5-7
}> = ({ t, id = 'park', veil = 0.36, red = 0, low = 0, bench = true, meteors = 2, fireball = 0 }) => {
  const hz = 1040 + low;
  const bulbs = Array.from({ length: 11 }).map((_, i) => 155 + i * 77);
  const sag = (x: number) => 695 + 55 * (1 - Math.pow((x - 540) / 420, 2)) + Math.sin(t / 20 + x / 300) * 4;

  return (
    <g>
      {/* Extended Night Sky covering vertical 1080x1920 + camera bleed */}
      <NightSky id={`${id}sky`} x0={-600} y0={-500} w={2280} h={1850 + low} horizonY={hz} />
      {red > 0 ? (
        <rect x={-600} y={-500} width={2280} height={1850 + low} fill="#5A0B18" opacity={0.55 * red} />
      ) : null}

      {/* Twinkling starfield across upper sky */}
      <Stars seed={37} x0={-300} y0={-200} w={1680} h={1150} t={t} n={95} o={0.9} />

      {/* Taurus / Pleiades constellation hint in upper-left sky */}
      <g stroke="#9FC0FF" strokeWidth={1.5} opacity={0.32} fill="none">
        <path d="M 210 260 L 265 295 L 330 280 L 395 315 M 265 295 L 245 355" />
      </g>
      {[[210, 260], [265, 295], [330, 280], [395, 315], [245, 355]].map(([cx, cy], i) => (
        <circle key={`tau${i}`} cx={cx} cy={cy} r={i === 1 ? 4.5 : 3} fill={i === 1 ? '#FFD0A0' : '#EAF0FF'} opacity={0.85} />
      ))}

      {/* Moon in upper right */}
      <Moon x={845} y={285 + low * 0.25} r={68} bloom={1 - red * 0.4} />

      {/* Background Taurid meteor streaks in the sky */}
      {Array.from({ length: meteors }).map((_, i) => {
        const cycle = (t + i * 23) % 55;
        const p = clamp(cycle / 28);
        const mx = lerp(190 + i * 320, 680 + i * 210, p);
        const my = lerp(190 + i * 90, 490 + i * 80, p);
        const op = Math.sin(p * Math.PI);
        return op > 0.05 ? (
          <g key={`bgmet${i}`} opacity={op * 0.8}>
            <ShootingStar x={mx} y={my} r={8} tailLen={130} angle={-148} t={t} red={red} id={`${id}m${i}`} />
          </g>
        ) : null;
      })}

      {/* Giant Taurid fireball bolide for the cliffhanger */}
      {fireball > 0 ? (
        <g>
          <Glow x={540} y={420 + low * 0.4} r={540 * fireball} kind="red" o={0.85} />
          <Glow x={540} y={420 + low * 0.4} r={340 * fireball} kind="warm" o={0.9} />
          <ShootingStar
            x={540}
            y={420 + low * 0.4}
            r={46 * (0.65 + 0.55 * fireball)}
            tailLen={460}
            angle={-112}
            t={t}
            red={0.85}
            id={`${id}fb`}
          />
        </g>
      ) : null}

      {/* Night clouds lit from below by city/moon/fireball */}
      <g filter="url(#blur6)" opacity={0.7}>
        {[
          [240, 460, 260, 22],
          [820, 520, 290, 24],
          [520, 620, 240, 18],
        ].map(([cx, cy, rx, ry], i) => (
          <ellipse
            key={`cl${i}`}
            cx={cx + ((t * 0.18 * (i % 2 ? 1 : -1)) % 50)}
            cy={cy + low * 0.35}
            rx={rx}
            ry={ry}
            fill={red > 0.4 ? '#5A1E2E' : '#1E2448'}
          />
        ))}
      </g>

      <g transform={`translate(0 ${low})`}>
        {/* Distant city skyline along the horizon */}
        <g>
          {Array.from({ length: 22 }).map((_, i) => {
            const bx = -220 + i * 72;
            const bw = 54 + (i % 3) * 18;
            const bh = 65 + rnd(19, i) * 135;
            return (
              <g key={`cb${i}`}>
                <rect x={bx} y={1040 - bh} width={bw} height={bh + 20} fill={red > 0.5 ? '#26101C' : '#141832'} />
                {Array.from({ length: 3 }).map((__, c) =>
                  Array.from({ length: 4 }).map((___, r) =>
                    rnd(23, i * 17 + c * 5 + r) > 0.52 ? (
                      <rect
                        key={`cw${c}-${r}`}
                        x={bx + 8 + c * 15}
                        y={1040 - bh + 12 + r * 24}
                        width={7}
                        height={10}
                        fill="#FFC27A"
                        opacity={0.65}
                      />
                    ) : null,
                  ),
                )}
              </g>
            );
          })}
        </g>

        {/* Rolling park hills and distant treeline */}
        <path d="M -500 1065 Q 180 965 620 1020 Q 980 970 1580 1065 L 1580 1120 L -500 1120 Z" fill="#10182C" />
        <path d="M -500 1085 Q 320 1015 760 1055 Q 1120 1015 1580 1085 L 1580 1140 L -500 1140 Z" fill="#0C1422" />

        {/* Wrought-iron park perimeter fence & stone gate pillars */}
        <rect x={-400} y={1055} width={1880} height={8} fill="#1B2032" />
        <rect x={-400} y={1095} width={1880} height={10} fill="#1B2032" />
        {Array.from({ length: 36 }).map((_, i) => {
          const fx = -340 + i * 48;
          if (fx > 430 && fx < 650) return null; // open gateway in the middle
          return <path key={`picket${i}`} d={`M ${fx} 1045 L ${fx} 1102`} stroke="#1B2032" strokeWidth={4} />;
        })}
        {/* Stone gateway pillars */}
        {[425, 655].map((px, i) => (
          <g key={`pil${i}`}>
            <rect x={px - 22} y={1015} width={44} height={92} fill="#25283A" stroke="#10121C" strokeWidth={3.5} />
            <rect x={px - 26} y={1008} width={52} height={10} rx={3} fill="#32364C" />
            <circle cx={px} cy={996} r={12} fill="#FFE2B0" opacity={0.85} />
            <Glow x={px} y={996} r={55} o={0.45} />
          </g>
        ))}

        {/* Park lawn ground */}
        <rect x={-600} y={1095} width={2280} height={1200} fill={red > 0.5 ? '#180E16' : '#101D24'} />

        {/* Reflective park pond on the right */}
        <ellipse cx={965} cy={1365} rx={195} ry={48} fill="#162844" stroke="#0E1826" strokeWidth={4} />
        <ellipse cx={950} cy={1362} rx={135} ry={26} fill={red > 0.5 ? '#FF5A3A' : '#9FC0FF'} opacity={0.22} />

        {/* Winding stone park pathway in perspective */}
        <path
          d="M 445 1100 Q 465 1250 310 1480 L 180 1950 L 920 1950 L 775 1480 Q 615 1250 635 1100 Z"
          fill={red > 0.5 ? '#261822' : '#232534'}
          stroke="#141622"
          strokeWidth={5}
        />
        {/* Illuminated stone kerb edges */}
        <path
          d="M 445 1100 Q 465 1250 310 1480 L 180 1950 M 635 1100 Q 615 1250 775 1480 L 920 1950"
          stroke={red > 0.5 ? '#FF6A4A' : S3.warm}
          strokeWidth={3}
          fill="none"
          opacity={0.42}
        />
        {/* Paving stones along the path */}
        {[1145, 1205, 1275, 1355, 1445, 1545].map((py, i) => {
          const w = 85 + i * 32;
          const cx = 540 + (i % 2 ? 28 : -28);
          return (
            <ellipse
              key={`st${i}`}
              cx={cx}
              cy={py}
              rx={w}
              ry={10 + i * 2}
              fill="#2D3042"
              opacity={0.55}
            />
          );
        })}

        {/* Framing park trees on left and right */}
        {[
          [-35, 1180, 1.15],
          [1115, 1165, 1.1],
        ].map(([tx, ty, ts], i) => (
          <g key={`tree${i}`} transform={`translate(${tx} ${ty}) scale(${ts})`}>
            <ellipse cx={0} cy={8} rx={75} ry={14} fill="#000" opacity={0.45} />
            <path d="M -22 6 L -14 -280 L 14 -280 L 22 6 Z" fill="#1C1620" />
            <path d="M -8 -180 L -68 -265 M 8 -200 L 72 -275" stroke="#1C1620" strokeWidth={12} strokeLinecap="round" />
            <circle cx={-45} cy={-320} r={115} fill="#0E1826" />
            <circle cx={45} cy={-335} r={120} fill="#132030" />
            <circle cx={0} cy={-395} r={130} fill="#162638" />
            <path
              d="M -95 -280 A 115 115 0 0 0 85 -290"
              stroke={red > 0.5 ? '#FF6A4A' : S3.warm}
              strokeWidth={3}
              fill="none"
              opacity={0.45}
            />
          </g>
        ))}

        {/* Park bushes and grass tufts */}
        {[
          [110, 1125, 55],
          [285, 1110, 44],
          [795, 1115, 48],
          [980, 1130, 58],
        ].map(([bx, by, br], i) => (
          <g key={`bsh${i}`}>
            <ellipse cx={bx} cy={by + br * 0.55} rx={br * 1.3} ry={8} fill="#000" opacity={0.35} />
            <circle cx={bx - br * 0.4} cy={by} r={br * 0.8} fill="#12222C" />
            <circle cx={bx + br * 0.4} cy={by + 4} r={br * 0.75} fill="#162A36" />
            <circle cx={bx} cy={by - br * 0.25} r={br * 0.9} fill="#19303E" />
          </g>
        ))}

        {/* Wooden Park Observation Sign on the left */}
        <g transform="translate(135 1155)">
          <ellipse cx={0} cy={6} rx={42} ry={7} fill="#000" opacity={0.38} />
          <rect x={-28} y={-85} width={8} height={90} fill="#2A1E1C" />
          <rect x={20} y={-85} width={8} height={90} fill="#2A1E1C" />
          <rect x={-44} y={-82} width={88} height={46} rx={5} fill="#3E2C26" stroke="#181214" strokeWidth={3} />
          <rect x={-36} y={-74} width={72} height={30} rx={3} fill="#22283A" />
          <path d="M -28 -64 L 24 -64 M -28 -52 L 12 -52" stroke="#F4EFE6" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
        </g>

        {/* Park litter bin on the right */}
        <g transform="translate(955 1235)">
          <ellipse cx={0} cy={5} rx={28} ry={6} fill="#000" opacity={0.4} />
          <rect x={-22} y={-58} width={44} height={62} rx={6} fill="#1C2C2A" stroke="#101618" strokeWidth={3} />
          <rect x={-25} y={-64} width={50} height={10} rx={4} fill="#283C3A" stroke="#101618" strokeWidth={3} />
          <path d="M -12 -46 L -12 -10 M 0 -46 L 0 -10 M 12 -46 L 12 -10" stroke="#101618" strokeWidth={3} />
        </g>

        {/* Two Victorian cast-iron park lampposts */}
        <ParkLamp x={185} y={1235} s={0.96} red={red} />
        <ParkLamp x={895} y={1210} s={0.92} red={red} />

        {/* Festoon string lights draped between the lampposts */}
        <path
          d={`M 185 785 Q 540 ${785 + 95 + Math.sin(t / 20) * 6} 895 765`}
          stroke="#12101A"
          strokeWidth={3}
          fill="none"
        />
        {bulbs.map((bx, i) => {
          const by = sag(bx);
          return (
            <g key={`fbulb${i}`}>
              <circle cx={bx} cy={by} r={6.5} fill={red > 0.5 ? '#FF6A4A' : '#FFE4B5'} />
              <Glow x={bx} y={by} r={36} kind={red > 0.5 ? 'red' : 'warm'} o={0.65} />
            </g>
          );
        })}

        {/* Wooden park bench on left-centre of path */}
        {bench ? <ParkBench x={320} y={1265} s={0.86} red={red} /> : null}

        {/* Brass amateur telescope on tripod on the right */}
        <g transform="translate(825 1295)">
          <ellipse cx={0} cy={8} rx={52} ry={10} fill="#000" opacity={0.42} />
          <path d="M 0 -88 L -38 6 M 0 -88 L 38 6 M 0 -88 L 4 10" stroke="#4E3629" strokeWidth={6} strokeLinecap="round" />
          <circle cx={0} cy={-90} r={9} fill="#252834" />
          <g transform="translate(0 -96) rotate(-34)">
            <rect x={-48} y={-9} width={96} height={18} rx={4} fill="#D49B4B" stroke="#181520" strokeWidth={3} />
            <rect x={36} y={-12} width={22} height={24} rx={3} fill="#F0C27B" stroke="#181520" strokeWidth={3} />
            <rect x={-62} y={-5} width={16} height={10} rx={2} fill="#252834" />
          </g>
        </g>

        {/* Stargazing backpack & thermos flask near the path */}
        <g transform="translate(735 1370)">
          <ellipse cx={0} cy={6} rx={38} ry={8} fill="#000" opacity={0.4} />
          <path d="M -26 4 Q -28 -38 0 -40 Q 28 -38 26 4 Z" fill="#3B4E6B" stroke="#141824" strokeWidth={3} />
          <rect x={-16} y={-22} width={32} height={18} rx={4} fill="#2C3A52" stroke="#141824" strokeWidth={2.5} />
          {/* Thermos */}
          <rect x={34} y={-34} width={16} height={38} rx={4} fill="#C85A32" stroke="#141824" strokeWidth={2.5} />
          <rect x={33} y={-40} width={18} height={8} rx={3} fill="#DCE6F2" stroke="#141824" strokeWidth={2} />
        </g>
      </g>

      {/* Contrast veil with light pools at lamps, moon, and central path */}
      <LightVeil
        id={`${id}veil`}
        lights={[
          [185, 815 + low, 340],
          [895, 800 + low, 340],
          [540, 1220 + low, 460],
          [845, 285 + low * 0.25, 290],
        ]}
        o={veil}
      />
      <Glow x={540} y={1180 + low} r={440} kind={red > 0.5 ? 'red' : 'warm'} o={0.25} />
      <Dust t={t} seed={63} x0={120} y0={680 + low} w={840} h={680} n={36} o={0.55} />
    </g>
  );
};
