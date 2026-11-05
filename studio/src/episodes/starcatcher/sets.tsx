import React from 'react';
import {
  rnd,
  clamp,
  lerp,
  easeOut,
  backOut,
  NightSky,
  DuskSky,
  Stars,
  Moon,
  S3,
  Glow,
  Cone,
  LightVeil,
  Dust,
  Rays,
  FONT,
  UI,
  ShootingStar,
  StarJar,
  ParkBench,
  Hero,
  LOOKS,
  basePose,
  LEG_LEN,
} from '../../engine';

export const PARK_WIDE_Y = 860; // Standing ground y for 1920x1080 16:9 Night Park

/** On-screen Chapter Card for long-form chapters (short, punchy, top-centre or full-frame title). */
export const ChapterCard: React.FC<{
  t: number;
  num: string;
  title: string;
  accentColor?: string;
}> = ({ t, num, title, accentColor = '#FFE27A' }) => {
  const pop1 = backOut(clamp((t - 1) / 8));
  const pop2 = backOut(clamp((t - 4) / 10));
  const fade = t > 68 ? clamp(1 - (t - 68) / 12) : 1;
  if (fade <= 0) return null;
  return (
    <g opacity={fade}>
      <rect x={0} y={0} width={1920} height={1080} fill="#080612" opacity={0.42} />
      <g transform={`translate(960 440) scale(${pop1})`}>
        <rect x={-210} y={-44} width={420} height={64} rx={32} fill={UI.pill} opacity={0.85} stroke={accentColor} strokeWidth={3} />
        <text y={0} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={accentColor} letterSpacing={8}>
          {num}
        </text>
      </g>
      <g transform={`translate(960 565) scale(${pop2})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={104}
          fill="#F6EFE3"
          stroke="#141024"
          strokeWidth={14}
          paintOrder="stroke"
          style={{ filter: 'drop-shadow(0 0 28px rgba(255,177,90,0.45))' }}
        >
          {title}
        </text>
      </g>
      <path
        d={`M ${960 - 280 * pop2} 615 L ${960 + 280 * pop2} 615`}
        stroke={accentColor}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.8}
      />
    </g>
  );
};

/** 16:9 End Card for Ifmosphere: "IFMOSPHERE", "Comment your what-if", and "Subscribe for more what-ifs". */
export const EndCard16x9: React.FC<{ t: number }> = ({ t }) => {
  const p1 = backOut(clamp(t / 10));
  const p2 = backOut(clamp((t - 8) / 10));
  const p3 = backOut(clamp((t - 16) / 10));
  const pulse = 1 + 0.04 * Math.sin(t * 0.22);
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#06050E" opacity={clamp(t / 18) * 0.58} />
      {/* Brand header */}
      <g transform={`translate(960 250) scale(${p1})`}>
        <rect x={-380} y={-95} width={760} height={175} rx={36} fill="#0B0816" opacity={0.88} stroke="#FFE27A" strokeWidth={4} />
        <text
          y={-8}
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={86}
          fill="#F6EFE3"
          letterSpacing={10}
        >
          IFMOSPHERE
        </text>
        <text y={50} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#FFE27A" letterSpacing={5}>
          STEP INTO THE WHAT IF.
        </text>
      </g>

      {/* CTA 1: Comment your what-if */}
      <g transform={`translate(960 515) scale(${p2 * pulse})`}>
        <rect x={-450} y={-64} width={900} height={116} rx={58} fill="#141B2E" opacity={0.92} stroke="#7FD4FF" strokeWidth={4} />
        <circle cx={-370} cy={-6} r={22} fill="#7FD4FF" />
        <path d="M -380 -14 L -360 -14 M -380 -4 L -364 -4" stroke="#0B0816" strokeWidth={4} strokeLinecap="round" />
        <text x={24} y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={54} fill="#F6EFE3" letterSpacing={2}>
          Comment your what-if
        </text>
      </g>

      {/* CTA 2: Subscribe for more what-ifs */}
      <g transform={`translate(960 685) scale(${p3})`}>
        <rect x={-470} y={-58} width={940} height={106} rx={53} fill="#FF8A3D" opacity={0.94} stroke="#FFF3DC" strokeWidth={4} />
        <polygon points="-385,-22 -385,12 -355,-5" fill="#0B0816" />
        <text x={20} y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#0B0816" letterSpacing={3}>
          Subscribe for more what-ifs
        </text>
      </g>
    </g>
  );
};

const WideParkLamp: React.FC<{ x: number; y: number; s?: number; red?: number; on?: boolean }> = ({
  x,
  y,
  s = 1,
  red = 0,
  on = true,
}) => {
  const topY = y - 420 * s;
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={32 * s} ry={8 * s} fill="#000" opacity={0.45} />
      <path d={`M ${x - 18 * s} ${y} L ${x - 10 * s} ${y - 55 * s} L ${x + 10 * s} ${y - 55 * s} L ${x + 18 * s} ${y} Z`} fill="#191B28" stroke="#0E0F18" strokeWidth={3} />
      <path d={`M ${x} ${y - 50 * s} L ${x} ${topY + 45 * s}`} stroke="#191B28" strokeWidth={11 * s} />
      <path d={`M ${x - 3 * s} ${y - 50 * s} L ${x - 3 * s} ${topY + 45 * s}`} stroke={S3.warm} strokeWidth={2 * s} opacity={on ? 0.45 : 0.1} />
      <rect x={x - 24 * s} y={topY + 52 * s} width={48 * s} height={7 * s} rx={3} fill="#191B28" />
      <polygon
        points={`${x - 22 * s},${topY + 45 * s} ${x + 22 * s},${topY + 45 * s} ${x + 30 * s},${topY + 8 * s} ${x - 30 * s},${topY + 8 * s}`}
        fill={!on ? '#2A2C3C' : red > 0.5 ? '#FF7A5A' : '#FFE7B3'}
        stroke="#191B28"
        strokeWidth={4 * s}
      />
      <polygon points={`${x - 34 * s},${topY + 8 * s} ${x},${topY - 16 * s} ${x + 34 * s},${topY + 8 * s}`} fill="#191B28" />
      {on ? (
        <>
          <Cone
            d={`M ${x - 24 * s} ${topY + 42 * s} L ${x + 24 * s} ${topY + 42 * s} L ${x + 280 * s} ${y + 90 * s} L ${x - 280 * s} ${y + 90 * s} Z`}
            o={0.32 * (1 - red * 0.35)}
          />
          <Glow x={x} y={topY + 26 * s} r={240 * s} kind={red > 0.5 ? 'red' : 'warm'} o={0.85} />
        </>
      ) : null}
    </g>
  );
};

/** 1920x1080 16:9 Widescreen Night Park Set. */
export const ParkWide: React.FC<{
  t: number;
  id?: string;
  veil?: number;
  red?: number;
  low?: number;
  bench?: boolean;
  meteors?: number;
  fireball?: number;
  lampsOn?: boolean;
  blackout?: boolean;
  searchlights?: boolean;
}> = ({
  t,
  id = 'pwide',
  veil = 0.36,
  red = 0,
  low = 0,
  bench = true,
  meteors = 2,
  fireball = 0,
  lampsOn = true,
  blackout = false,
  searchlights = false,
}) => {
  const hz = 680 + low;
  const bulbs = Array.from({ length: 15 }).map((_, i) => 360 + i * 85);
  const sag = (x: number) => 415 + 65 * (1 - Math.pow((x - 960) / 620, 2)) + Math.sin(t / 20 + x / 300) * 4;

  return (
    <g>
      <NightSky id={`${id}sky`} x0={-600} y0={-500} w={3120} h={1400 + low} horizonY={hz} />
      {red > 0 ? <rect x={-600} y={-500} width={3120} height={1400 + low} fill="#5A0B18" opacity={0.55 * red} /> : null}

      <Stars seed={41} x0={-300} y0={-200} w={2520} h={850} t={t} n={120} o={0.9} />

      {/* Taurus constellation hint in upper-left sky */}
      <g stroke="#9FC0FF" strokeWidth={1.5} opacity={0.32} fill="none">
        <path d="M 310 150 L 385 185 L 470 170 L 545 205 M 385 185 L 355 245" />
      </g>
      {[
        [310, 150],
        [385, 185],
        [470, 170],
        [545, 205],
        [355, 245],
      ].map(([cx, cy], i) => (
        <circle key={`tau${i}`} cx={cx} cy={cy} r={i === 1 ? 5 : 3.2} fill={i === 1 ? '#FFD0A0' : '#EAF0FF'} opacity={0.85} />
      ))}

      {/* Moon in upper right */}
      <Moon x={1560} y={195 + low * 0.25} r={66} bloom={1 - red * 0.4} />

      {/* Military searchlights sweeping the sky in Chapter 5 */}
      {searchlights ? (
        <g opacity={0.45}>
          {[420, 1480].map((sx, i) => {
            const ang = Math.sin(t * 0.04 + i * 2.1) * 22 + (i === 0 ? 14 : -14);
            return (
              <g key={`sl${i}`} transform={`translate(${sx} ${hz}) rotate(${ang})`}>
                <polygon points="-18,0 18,0 180,-900 -180,-900" fill="url(#kitShaft)" opacity={0.7} />
              </g>
            );
          })}
        </g>
      ) : null}

      {/* Background Taurid meteor streaks */}
      {Array.from({ length: meteors }).map((_, i) => {
        const cycle = (t + i * 23) % 55;
        const p = clamp(cycle / 28);
        const mx = lerp(280 + i * 480, 880 + i * 390, p);
        const my = lerp(110 + i * 60, 360 + i * 50, p);
        const op = Math.sin(p * Math.PI);
        return op > 0.05 ? (
          <g key={`bgmet${i}`} opacity={op * 0.82}>
            <ShootingStar x={mx} y={my} r={8} tailLen={150} angle={-152} t={t} red={red} id={`${id}m${i}`} />
          </g>
        ) : null;
      })}

      {/* Giant fireball bolide when fireball > 0 */}
      {fireball > 0 ? (
        <g>
          <Glow x={960} y={260 + low * 0.4} r={640 * fireball} kind="red" o={0.85} />
          <Glow x={960} y={260 + low * 0.4} r={380 * fireball} kind="warm" o={0.9} />
          <ShootingStar
            x={960}
            y={260 + low * 0.4}
            r={54 * (0.65 + 0.55 * fireball)}
            tailLen={560}
            angle={-148}
            t={t}
            red={0.85}
            id={`${id}fb`}
          />
        </g>
      ) : null}

      {/* Night clouds */}
      <g filter="url(#blur6)" opacity={0.7}>
        {[
          [380, 290, 320, 24],
          [1420, 320, 360, 26],
          [920, 390, 300, 20],
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
          {Array.from({ length: 34 }).map((_, i) => {
            const bx = -260 + i * 74;
            const bw = 56 + (i % 3) * 18;
            const bh = 65 + rnd(19, i) * 145;
            return (
              <g key={`cb${i}`}>
                <rect x={bx} y={680 - bh} width={bw} height={bh + 20} fill={red > 0.5 ? '#26101C' : '#141832'} />
                {!blackout
                  ? Array.from({ length: 3 }).map((__, c) =>
                      Array.from({ length: 4 }).map((___, r) =>
                        rnd(23, i * 17 + c * 5 + r) > 0.52 ? (
                          <rect
                            key={`cw${c}-${r}`}
                            x={bx + 8 + c * 15}
                            y={680 - bh + 12 + r * 24}
                            width={7}
                            height={10}
                            fill="#FFC27A"
                            opacity={0.65}
                          />
                        ) : null,
                      ),
                    )
                  : null}
              </g>
            );
          })}
        </g>

        {/* Rolling park hills */}
        <path d="M -500 705 Q 380 615 960 660 Q 1540 610 2420 705 L 2420 760 L -500 760 Z" fill="#10182C" />
        <path d="M -500 725 Q 520 655 1120 695 Q 1680 655 2420 725 L 2420 780 L -500 780 Z" fill="#0C1422" />

        {/* Wrought-iron perimeter fence & stone gate pillars */}
        <rect x={-400} y={695} width={2720} height={8} fill="#1B2032" />
        <rect x={-400} y={735} width={2720} height={10} fill="#1B2032" />
        {Array.from({ length: 54 }).map((_, i) => {
          const fx = -340 + i * 48;
          if (fx > 790 && fx < 1130) return null; // open gateway in the middle
          return <path key={`picket${i}`} d={`M ${fx} 685 L ${fx} 742`} stroke="#1B2032" strokeWidth={4} />;
        })}
        {[785, 1135].map((px, i) => (
          <g key={`pil${i}`}>
            <rect x={px - 24} y={650} width={48} height={96} fill="#25283A" stroke="#10121C" strokeWidth={3.5} />
            <rect x={px - 28} y={642} width={56} height={10} rx={3} fill="#32364C" />
            <circle cx={px} cy={630} r={12} fill={lampsOn ? '#FFE2B0' : '#3A3E52'} opacity={0.85} />
            {lampsOn ? <Glow x={px} y={630} r={55} o={0.45} /> : null}
          </g>
        ))}

        {/* Park lawn ground */}
        <rect x={-600} y={735} width={3120} height={900} fill={red > 0.5 ? '#180E16' : '#101D24'} />

        {/* Reflective park pond on the right */}
        <ellipse cx={1580} cy={920} rx={260} ry={58} fill="#162844" stroke="#0E1826" strokeWidth={4} />
        <ellipse cx={1560} cy={916} rx={180} ry={30} fill={red > 0.5 ? '#FF5A3A' : '#9FC0FF'} opacity={0.22} />

        {/* Winding stone park pathway in perspective */}
        <path
          d="M 810 740 Q 830 850 620 1020 L 420 1350 L 1500 1350 L 1300 1020 Q 1090 850 1110 740 Z"
          fill={red > 0.5 ? '#261822' : '#232534'}
          stroke="#141622"
          strokeWidth={5}
        />
        <path
          d="M 810 740 Q 830 850 620 1020 L 420 1350 M 1110 740 Q 1090 850 1300 1020 L 1500 1350"
          stroke={red > 0.5 ? '#FF6A4A' : S3.warm}
          strokeWidth={3}
          fill="none"
          opacity={0.42}
        />
        {[775, 825, 880, 945, 1020].map((py, i) => {
          const w = 110 + i * 42;
          const cx = 960 + (i % 2 ? 34 : -34);
          return <ellipse key={`st${i}`} cx={cx} cy={py} rx={w} ry={10 + i * 2} fill="#2D3042" opacity={0.55} />;
        })}

        {/* Framing park trees on left and right */}
        {[
          [90, 810, 1.15],
          [1830, 795, 1.1],
        ].map(([tx, ty, ts], i) => (
          <g key={`tree${i}`} transform={`translate(${tx} ${ty}) scale(${ts})`}>
            <ellipse cx={0} cy={8} rx={85} ry={14} fill="#000" opacity={0.45} />
            <path d="M -24 6 L -15 -280 L 15 -280 L 24 6 Z" fill="#1C1620" />
            <path d="M -8 -180 L -74 -265 M 8 -200 L 78 -275" stroke="#1C1620" strokeWidth={12} strokeLinecap="round" />
            <circle cx={-50} cy={-320} r={125} fill="#0E1826" />
            <circle cx={50} cy={-335} r={130} fill="#132030" />
            <circle cx={0} cy={-395} r={140} fill="#162638" />
          </g>
        ))}

        {/* Park bushes */}
        {[
          [260, 765, 58],
          [520, 750, 46],
          [1390, 755, 50],
          [1690, 770, 62],
        ].map(([bx, by, br], i) => (
          <g key={`bsh${i}`}>
            <ellipse cx={bx} cy={by + br * 0.55} rx={br * 1.3} ry={8} fill="#000" opacity={0.35} />
            <circle cx={bx - br * 0.4} cy={by} r={br * 0.8} fill="#12222C" />
            <circle cx={bx + br * 0.4} cy={by + 4} r={br * 0.75} fill="#162A36" />
            <circle cx={bx} cy={by - br * 0.25} r={br * 0.9} fill="#19303E" />
          </g>
        ))}

        {/* Two Victorian cast-iron park lampposts */}
        <WideParkLamp x={360} y={845} s={0.96} red={red} on={lampsOn} />
        <WideParkLamp x={1560} y={830} s={0.94} red={red} on={lampsOn} />

        {/* Festoon string lights */}
        <path
          d={`M 360 440 Q 960 ${440 + 110 + Math.sin(t / 20) * 6} 1560 425`}
          stroke="#12101A"
          strokeWidth={3}
          fill="none"
        />
        {bulbs.map((bx, i) => {
          const by = sag(bx);
          return (
            <g key={`fbulb${i}`}>
              <circle cx={bx} cy={by} r={6.5} fill={!lampsOn ? '#2A2C3A' : red > 0.5 ? '#FF6A4A' : '#FFE4B5'} />
              {lampsOn ? <Glow x={bx} y={by} r={36} kind={red > 0.5 ? 'red' : 'warm'} o={0.6} /> : null}
            </g>
          );
        })}

        {/* Wooden park bench */}
        {bench ? <ParkBench x={610} y={845} s={0.92} red={red} /> : null}

        {/* Brass amateur telescope on tripod on the right */}
        <g transform="translate(1350 865)">
          <ellipse cx={0} cy={8} rx={52} ry={10} fill="#000" opacity={0.42} />
          <path d="M 0 -88 L -38 6 M 0 -88 L 38 6 M 0 -88 L 4 10" stroke="#4E3629" strokeWidth={6} strokeLinecap="round" />
          <circle cx={0} cy={-90} r={9} fill="#252834" />
          <g transform="translate(0 -96) rotate(-34)">
            <rect x={-48} y={-9} width={96} height={18} rx={4} fill="#D49B4B" stroke="#181520" strokeWidth={3} />
            <rect x={36} y={-12} width={22} height={24} rx={3} fill="#F0C27B" stroke="#181520" strokeWidth={3} />
            <rect x={-62} y={-5} width={16} height={10} rx={2} fill="#252834" />
          </g>
        </g>
      </g>

      <LightVeil
        id={`${id}veil`}
        lights={
          lampsOn
            ? [
                [360, 460 + low, 380],
                [1560, 450 + low, 380],
                [960, 810 + low, 560],
                [1560, 195 + low * 0.25, 310],
              ]
            : [
                [960, 780 + low, 520],
                [1560, 195 + low * 0.25, 310],
              ]
        }
        o={veil}
      />
      <Glow x={960} y={780 + low} r={520} kind={red > 0.5 ? 'red' : 'warm'} o={0.22} />
      <Dust t={t} seed={63} x0={260} y0={380 + low} w={1400} h={580} n={42} o={0.5} />
    </g>
  );
};

/** Mo's "GENUINE SHOOTING STARS — HOLD YOUR OWN WISH" folding stall table for Chapter 2. */
export const WishStallTable: React.FC<{
  x?: number;
  y?: number;
  jars?: number;
  cash?: number;
  red?: number;
  t?: number;
}> = ({ x = 960, y = 865, jars = 4, cash = 1, red = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={12} rx={340} ry={22} fill="#000" opacity={0.48} />
    {/* Folding metal legs */}
    <path d="M -280 8 L -255 -165 M 280 8 L 255 -165 M -240 8 L -215 -165 M 240 8 L 215 -165" stroke="#222534" strokeWidth={10} strokeLinecap="round" />
    {/* Table top */}
    <polygon points="-320,-165 320,-165 345,-142 -345,-142" fill="#5E4234" stroke="#181216" strokeWidth={4} />
    <rect x={-345} y={-142} width={690} height={18} rx={4} fill="#463026" stroke="#181216" strokeWidth={4} />
    {/* Cardboard sign taped to the front */}
    <g transform="translate(0 -72) rotate(-1.2)">
      <rect x={-265} y={-56} width={530} height={112} rx={6} fill="#C89D66" stroke="#1E1612" strokeWidth={4} />
      {/* Masking tape strips at corners */}
      <rect x={-275} y={-62} width={48} height={16} fill="#EEDCB3" transform="rotate(-24 -250 -54)" opacity={0.85} />
      <rect x={225} y={-62} width={48} height={16} fill="#EEDCB3" transform="rotate(24 250 -54)" opacity={0.85} />
      <text y={-10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#1E1410" letterSpacing={2}>
        GENUINE SHOOTING STARS
      </text>
      <text y={32} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#8A241B" letterSpacing={3}>
        ★ HOLD YOUR OWN WISH · £20 ★
      </text>
    </g>
    {/* Glowing StarJars lined up on the table */}
    {Array.from({ length: jars }).map((_, i) => {
      const jx = -230 + i * 115;
      const shakeX = red > 0.3 ? Math.sin(t * 2.4 + i) * 3 * red : 0;
      return (
        <StarJar
          key={i}
          x={jx + shakeX}
          y={-152}
          s={0.72}
          stars={6 + (i % 4)}
          glow={0.9 + red * 0.5}
          red={red}
          crack={red > 0.6 && i === 1 ? 0.8 : 0}
          t={t + i * 15}
        />
      );
    })}
    {/* Cash box / stacks of notes on right side of table */}
    {cash > 0 ? (
      <g transform="translate(215 -156)">
        <rect x={-48} y={-28} width={96} height={28} rx={4} fill="#2B3A4A" stroke="#12161E" strokeWidth={3.5} />
        <rect x={-42} y={-52} width={84} height={24} rx={3} fill="#3E4E62" stroke="#12161E" strokeWidth={3} transform="rotate(18 42 -28)" />
        {Array.from({ length: Math.min(6, Math.ceil(cash * 3)) }).map((_, i) => (
          <rect
            key={i}
            x={-34 + (i % 2) * 14}
            y={-36 - i * 6}
            width={52}
            height={12}
            rx={2}
            fill="#5BE08A"
            stroke="#14281C"
            strokeWidth={2}
            transform={`rotate(${(i - 2) * 7})`}
          />
        ))}
      </g>
    ) : null}
  </g>
);

/** Exterior of Pip's house in the morning/dusk with News Vans, Scientists & Government Suits (Chapter 4.4). */
export const StreetHouseSet: React.FC<{ t: number; id?: string }> = ({ t, id = 'shouse' }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={720} red={0.15} />
    {/* Suburban street background */}
    <rect x={-400} y={700} width={2720} height={500} fill="#1E202C" />
    <rect x={-400} y={780} width={2720} height={8} fill="#3A3E52" />
    {/* Pip's brick house on the right */}
    <g transform="translate(1180 220)">
      <rect x={0} y={0} width={620} height={520} fill="#4A3234" stroke="#181216" strokeWidth={5} />
      <polygon points="-30,0 310,-160 650,0" fill="#2A222E" stroke="#181216" strokeWidth={5} />
      {/* Upstairs bedroom window with a glowing StarJar still on the sill */}
      <rect x={120} y={70} width={150} height={170} fill="#182238" stroke="#F4EFE6" strokeWidth={6} />
      <Glow x={195} y={195} r={110} kind="warm" o={0.75} />
      <StarJar x={195} y={232} s={0.45} stars={6} glow={0.9} t={t} />
      <rect x={360} y={70} width={150} height={170} fill="#182238" stroke="#F4EFE6" strokeWidth={6} />
      {/* Front door with steps */}
      <rect x={230} y={300} width={130} height={220} fill="#2B3244" stroke="#14161E" strokeWidth={5} />
      <circle cx={340} cy={415} r={7} fill="#FFE27A" />
      <rect x={205} y={515} width={180} height={22} fill="#6E7282" stroke="#181620" strokeWidth={4} />
      <rect x={185} y={537} width={220} height={24} fill="#5A5E6E" stroke="#181620" strokeWidth={4} />
    </g>

    {/* TV News Broadcast Van on the left with satellite dish on roof */}
    <g transform="translate(360 645)">
      <ellipse cx={0} cy={115} rx={230} ry={18} fill="#000" opacity={0.45} />
      {/* Satellite dish */}
      <path d="M -40 -60 L -40 -110" stroke="#8C96A6" strokeWidth={8} />
      <path d="M -95 -145 Q -40 -90 15 -145" stroke="#F4EFE6" strokeWidth={10} fill="none" />
      {/* Van body */}
      <rect x={-210} y={-60} width={380} height={155} rx={18} fill="#E8ECEF" stroke="#181A24" strokeWidth={5} />
      <polygon points="170,-60 245,10 245,95 170,95" fill="#DCE2E8" stroke="#181A24" strokeWidth={5} />
      <polygon points="176,-48 234,8 176,8" fill="#24344E" stroke="#181A24" strokeWidth={4} />
      <rect x={-195} y={-12} width={340} height={38} fill="#D94A3D" />
      <text x={-25} y={16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FFF" letterSpacing={4}>
        LIVE NEWS · CH 4
      </text>
      {/* Wheels */}
      <circle cx={-120} cy={98} r={34} fill="#1A1C24" stroke="#8C96A6" strokeWidth={8} />
      <circle cx={145} cy={98} r={34} fill="#1A1C24" stroke="#8C96A6" strokeWidth={8} />
      {/* Flashing beacon on van roof */}
      <circle cx={140} cy={-70} r={10} fill="#FF5A3A" />
      <Glow x={140} y={-70} r={85} kind="red" o={0.5 + 0.4 * Math.sin(t * 0.8)} />
    </g>

    {/* Government Black Sedan parked at the kerb */}
    <g transform="translate(880 735)">
      <ellipse cx={0} cy={55} rx={185} ry={14} fill="#000" opacity={0.5} />
      <path d="M -165 10 L -115 -48 L 65 -48 L 125 10 L 175 18 L 175 48 L -175 48 Z" fill="#141620" stroke="#08090E" strokeWidth={4} />
      <polygon points="-105,-40 -15,-40 -15,6 -145,6" fill="#263248" opacity={0.85} />
      <polygon points="-5,-40 58,-40 108,6 -5,6" fill="#263248" opacity={0.85} />
      <circle cx={-110} cy={48} r={26} fill="#0E1016" stroke="#6E7888" strokeWidth={6} />
      <circle cx={115} cy={48} r={26} fill="#0E1016" stroke="#6E7888" strokeWidth={6} />
    </g>
  </g>
);

/** Government Briefing Room Set with Huge Tactical Wall Radar Screen (Chapter 5.1). */
export const BriefingRoomSet: React.FC<{ t: number; id?: string }> = ({ t, id = 'brief' }) => {
  const blipP = clamp((t % 60) / 60);
  const bx = lerp(640, 960, blipP);
  const by = lerp(220, 445, blipP);
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0D111C" />
      {/* Back wall panels */}
      <rect x={160} y={80} width={1600} height={640} fill="#151C2C" stroke="#243048" strokeWidth={4} />
      {/* Floor */}
      <polygon points="-200,1080 2120,1080 1760,720 160,720" fill="#111622" stroke="#243048" strokeWidth={3} />

      {/* Giant Tactical Radar Wall Display */}
      <g transform="translate(420 125)">
        <rect x={0} y={0} width={1080} height={520} rx={16} fill="#08121E" stroke="#3B5B84" strokeWidth={6} />
        {/* Grid lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={`gv${i}`} d={`M ${i * 108} 0 L ${i * 108} 520`} stroke="#142A42" strokeWidth={2} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <path key={`gh${i}`} d={`M 0 ${i * 104} L 1080 ${i * 104}`} stroke="#142A42" strokeWidth={2} />
        ))}
        {/* Radar circles */}
        {[120, 220, 320].map((r, i) => (
          <circle key={i} cx={540} cy={380} r={r} fill="none" stroke="#1E4468" strokeWidth={2.5} strokeDasharray="10 8" />
        ))}
        {/* Earth / City target at (540, 380) */}
        <path d="M 180 440 Q 540 340 900 440" stroke="#5BE08A" strokeWidth={4} fill="none" />
        <circle cx={540} cy={380} r={12} fill="#FF5A4A" />
        <text x={540} y={425} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FF5A4A" letterSpacing={3}>
          TARGET: CITY CENTRE
        </text>
        {/* Incoming trajectory line & pulsing red threat object */}
        <path d="M 220 95 L 540 380" stroke="#FF5A4A" strokeWidth={4} strokeDasharray="12 8" />
        <circle cx={bx - 420} cy={by - 125} r={18} fill="#FF5A4A" opacity={0.35} />
        <circle cx={bx - 420} cy={by - 125} r={9} fill="#FF5A4A" />
        {/* Telemetry readout box on screen */}
        <rect x={650} y={36} width={390} height={155} rx={10} fill="#0D1E32" stroke="#FF5A4A" strokeWidth={3} />
        <text x={675} y={76} fontFamily={FONT.ui} fontSize={24} fill="#FF5A4A" letterSpacing={2}>
          OBJECT: TAURID-X
        </text>
        <text x={675} y={114} fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">
          SPEED: 27 KM/S
        </text>
        <text x={675} y={150} fontFamily={FONT.ui} fontSize={22} fill="#FFE27A">
          CLASS: HOUSE-SIZED
        </text>
      </g>

      <Glow x={960} y={380} r={620} kind="cool" o={0.45} />
      <Glow x={960} y={380} r={340} kind="red" o={0.28} />
    </g>
  );
};

/** The Geometric Star-Craft / Alien Probe revealed when the plasma clears in Chapter 6. */
export const StarCraft: React.FC<{
  x: number;
  y: number;
  s?: number;
  plasma?: number; // 1 = full red-gold fireball shell, 0 = clean metallic geometric craft with cyan symbols
  hatch?: number; // 0..1 underside hatch opening with light beam
  t?: number;
}> = ({ x, y, s = 1, plasma = 0, hatch = 0, t = 0 }) => {
  const hoverY = Math.sin(t * 0.1) * 8;
  const cyanPulse = 0.65 + 0.35 * Math.sin(t * 0.25);
  return (
    <g transform={`translate(${x} ${y + hoverY}) scale(${s})`}>
      {/* Underside hatch beam when hatch > 0 */}
      {hatch > 0 ? (
        <g opacity={hatch}>
          <Cone d="M -55 75 L 55 75 L 260 680 L -260 680 Z" o={0.55 * hatch} />
          <Glow x={0} y={110} r={340} kind="cool" o={0.85 * hatch} />
        </g>
      ) : null}

      <Glow x={0} y={0} r={380} kind="cool" o={(1 - plasma) * 0.75} />

      {/* Geometric faceted dark-metallic hull (octagonal polyhedron) */}
      <g>
        {/* Upper facets */}
        <polygon points="-240,10 -130,-95 0,-120 0,10" fill="#1E2838" stroke="#0D121C" strokeWidth={4} />
        <polygon points="0,-120 130,-95 240,10 0,10" fill="#283548" stroke="#0D121C" strokeWidth={4} />
        <polygon points="-130,-95 0,-120 130,-95 0,-35" fill="#32425A" stroke="#0D121C" strokeWidth={4} />
        {/* Lower facets */}
        <polygon points="-240,10 0,10 0,95 -150,75" fill="#161E2C" stroke="#0D121C" strokeWidth={4} />
        <polygon points="0,10 240,10 150,75 0,95" fill="#1C2536" stroke="#0D121C" strokeWidth={4} />

        {/* Glowing cyan geometric circuit symbols etched into the facets */}
        <g stroke="#7FD4FF" strokeWidth={3.5} fill="none" opacity={(1 - plasma * 0.8) * cyanPulse} style={{ filter: 'drop-shadow(0 0 8px #7FD4FF)' }}>
          <path d="M -165 -15 L -95 -62 L -35 -62 M -95 -62 L -95 -18" />
          <circle cx={-35} cy={-62} r={6} fill="#7FD4FF" />
          <path d="M 165 -15 L 95 -62 L 35 -62 M 95 -62 L 95 -18" />
          <circle cx={35} cy={-62} r={6} fill="#7FD4FF" />
          {/* Central emblem: nested diamond & circle */}
          <polygon points="0,-82 32,-48 0,-14 -32,-48" />
          <circle cx={0} cy={-48} r={10} fill="#7FD4FF" />
          {/* Equator seam */}
          <path d="M -236 10 L 236 10" strokeWidth={4} />
        </g>

        {/* Underside hatch seam that clicks open */}
        <g transform={`translate(0 ${95 + hatch * 18})`}>
          <polygon
            points="-68,-18 68,-18 48,12 -48,12"
            fill={hatch > 0.1 ? '#7FD4FF' : '#243044'}
            stroke="#0D121C"
            strokeWidth={4}
          />
          {hatch > 0.1 ? (
            <ellipse cx={0} cy={-4} rx={52 * hatch} ry={10 * hatch} fill="#FFFFFF" />
          ) : null}
        </g>
      </g>

      {/* Dissipating plasma shell when plasma > 0 */}
      {plasma > 0 ? (
        <g opacity={plasma}>
          <Glow x={0} y={0} r={460} kind="red" o={0.85 * plasma} />
          <Glow x={0} y={0} r={320} kind="warm" o={0.9 * plasma} />
          <circle cx={0} cy={0} r={245 * (0.85 + 0.25 * plasma)} fill="#FF6A3A" opacity={0.65 * plasma} />
          <circle cx={0} cy={0} r={190 * plasma} fill="#FFF2D6" opacity={0.8 * plasma} />
        </g>
      ) : null}
    </g>
  );
};
