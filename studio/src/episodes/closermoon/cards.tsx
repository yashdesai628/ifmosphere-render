import React from 'react';
import { clamp, backOut, lerp, FONT, UI, C } from '../../engine';

/**
 * Custom TitleCard for Closermoon: ["WHAT IF THE MOON", "CAME 2X CLOSER?"], accent "2X CLOSER".
 */
export const ClosermoonTitleCard: React.FC<{
  t: number;
  lines?: [string, string];
  accentWords?: string[];
  accentT?: number;
  x?: number;
  y?: number;
  size?: number;
}> = ({
  t,
  lines = ['WHAT IF THE MOON', 'CAME 2X CLOSER?'],
  accentWords = ['2X', 'CLOSER'],
  accentT = 14,
  x = 960,
  y = 185,
  size = 112,
}) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= accentT && t < accentT + 18 ? 1 + 0.14 * Math.sin(((t - accentT) / 18) * Math.PI) : 1;
  const words = lines[1].split(' ');
  const accSet = new Set(accentWords.map((w) => w.toUpperCase()));
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${pop(2)})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={700}
          fontSize={size * 0.52}
          letterSpacing={5}
          fill="#F6EFE3"
          stroke="#140E26"
          strokeWidth={9}
          paintOrder="stroke"
        >
          {lines[0]}
        </text>
      </g>
      <g transform={`translate(${x} ${y + size * 0.98}) scale(${pop(5)})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={size}
          fill={C.orange}
          stroke="#140E26"
          strokeWidth={13}
          paintOrder="stroke"
          style={{ filter: 'drop-shadow(0 0 24px rgba(255,138,61,0.55))' }}
        >
          {words.map((w, i) => {
            const clean = w.replace(/[^\w]/g, '').toUpperCase();
            const isAcc = accSet.has(clean);
            return (
              <tspan
                key={i}
                style={isAcc ? { fontSize: size * pulse } : undefined}
                fill={isAcc ? '#FFE27A' : undefined}
              >
                {(i ? ' ' : '') + w}
              </tspan>
            );
          })}
        </text>
      </g>
    </g>
  );
};

/**
 * Chapter Card with chapter title and lunar distance / metric.
 */
export const LunarChapterCard: React.FC<{
  t: number;
  place: string;
  sub: string;
  color?: string;
  mode?: 'hero' | 'corner';
}> = ({ t, place, sub, color = '#7FD4FF', mode = 'hero' }) => {
  const p1 = backOut(clamp((t - 1) / 8));
  const p2 = backOut(clamp((t - 4) / 9));
  if (mode === 'corner') {
    const w = Math.min(920, Math.max(440, Math.max(place.length * 30, sub.length * 20) + 90));
    return (
      <g transform={`translate(76 80) scale(${p1})`}>
        <rect x={0} y={0} width={w} height={116} rx={24} fill="#0B0816" opacity={0.88} stroke={color} strokeWidth={3.5} />
        <circle cx={38} cy={38} r={10} fill={color} />
        <text x={62} y={48} fontFamily={FONT.title} fontWeight={800} fontSize={33} fill="#F6EFE3" letterSpacing={2.5}>
          {place}
        </text>
        <text x={30} y={92} fontFamily={FONT.ui} fontSize={23} fill={color} letterSpacing={2}>
          {sub}
        </text>
      </g>
    );
  }
  const pillW = Math.min(1560, Math.max(500, sub.length * 24 + 96));
  return (
    <g>
      <g transform={`translate(960 126) scale(${p1})`}>
        <rect
          x={-pillW / 2}
          y={-36}
          width={pillW}
          height={58}
          rx={29}
          fill={UI.pill}
          opacity={0.9}
          stroke={color}
          strokeWidth={3}
        />
        <text y={2} textAnchor="middle" fontFamily={FONT.ui} fontSize={25} fill={color} letterSpacing={3.5}>
          {sub}
        </text>
      </g>
      <g transform={`translate(960 228) scale(${p2})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={80}
          letterSpacing={3.5}
          fill="#F6EFE3"
          stroke="#100B20"
          strokeWidth={12}
          paintOrder="stroke"
          style={{ filter: 'drop-shadow(0 6px 22px rgba(0,0,0,0.65))' }}
        >
          {place}
        </text>
      </g>
    </g>
  );
};

/**
 * Bold top/center banner for Hook Gate ("MOON 2X CLOSER"), Payoff ("PULL x8"), etc.
 */
export const HookBannerCard: React.FC<{
  t: number;
  text: string;
  sub?: string;
  color?: string;
  x?: number;
  y?: number;
  scale?: number;
  instant?: boolean;
}> = ({ t, text, sub, color = '#FFE27A', x = 960, y = 114, scale = 1, instant = false }) => {
  const pop = instant ? 1 : lerp(0.88, 1, backOut(clamp(t / 7)));
  const textW = text.length * 36 + 90;
  const subW = sub ? sub.length * 19 + 80 : 0;
  const w = Math.min(1680, Math.max(440, Math.max(textW, subW)));
  const h = sub ? 118 : 78;
  return (
    <g transform={`translate(${x} ${y}) scale(${pop * scale})`}>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={26}
        fill="#0D091C"
        opacity={0.93}
        stroke={color}
        strokeWidth={4.5}
      />
      <text
        y={sub ? -6 : 14}
        textAnchor="middle"
        fontFamily={FONT.title}
        fontWeight={800}
        fontSize={44}
        fill={color}
        letterSpacing={3}
      >
        {text}
      </text>
      {sub ? (
        <text
          y={36}
          textAnchor="middle"
          fontFamily={FONT.ui}
          fontSize={22}
          fill="#F6EFE3"
          letterSpacing={2.2}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/**
 * Telemetry / stat pill for on-screen numbers and distances (auto-clamped to stay inside frame margins).
 */
export const TelemetryPill: React.FC<{
  t: number;
  x?: number;
  y?: number;
  label: string;
  value: string;
  color?: string;
  maxWidth?: number;
}> = ({ t, x = 86, y = 86, label, value, color = C.orange, maxWidth = 1840 }) => {
  const pop = backOut(clamp((t - 2) / 8));
  const w = Math.min(720, Math.max(330, Math.max(label.length * 18, value.length * 24) + 70));
  const safeX = Math.max(48, Math.min(maxWidth - w - 48, x));
  const safeY = Math.max(48, Math.min(940, y));
  return (
    <g transform={`translate(${safeX} ${safeY}) scale(${pop})`}>
      <rect x={0} y={0} width={w} height={96} rx={22} fill={UI.pill} opacity={0.91} stroke={color} strokeWidth={3} />
      <text x={26} y={36} fontFamily={FONT.ui} fontSize={19} fill="#B8B0C8" letterSpacing={2.2}>
        {label}
      </text>
      <text x={26} y={76} fontFamily={FONT.ui} fontWeight={700} fontSize={31} fill={color} letterSpacing={1.3}>
        {value}
      </text>
    </g>
  );
};

/**
 * Big vertical-friendly number readout for ClosermoonShort (9:16).
 */
export const ShortBigNumber: React.FC<{
  t: number;
  place: string;
  bigValue: string;
  subText: string;
  color?: string;
  y?: number;
}> = ({ t, place, bigValue, subText, color = '#FFE27A', y = 310 }) => {
  const p = lerp(0.88, 1, backOut(clamp((t + 2) / 7)));
  return (
    <g transform={`translate(540 ${y}) scale(${p})`}>
      <rect x={-450} y={-110} width={900} height={246} rx={36} fill="#0D091A" opacity={0.92} stroke={color} strokeWidth={4.5} />
      <text y={-48} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#D4CBE5" letterSpacing={3.5}>
        {place}
      </text>
      <text
        y={50}
        textAnchor="middle"
        fontFamily={FONT.title}
        fontWeight={800}
        fontSize={86}
        fill={color}
        stroke="#080612"
        strokeWidth={10}
        paintOrder="stroke"
      >
        {bigValue}
      </text>
      <text y={110} textAnchor="middle" fontFamily={FONT.ui} fontSize={25} fill="#F6EFE3" letterSpacing={1.8}>
        {subText}
      </text>
    </g>
  );
};

export type GaugeVariant =
  | 'digital_bar'
  | 'orbital_arc'
  | 'split_disc'
  | 'tidal_dial'
  | 'laser_ruler'
  | 'supermoon_vs'
  | 'sky_caliper'
  | 'almanac_radar';

export type MoonGaugeConfig = {
  variant: GaugeVariant;
  x?: number;
  y?: number;
  scale?: number;
  tilt?: number;
  header: string;
  distFrom?: string;
  distTo: string;
  sizeLabel: string;
  subMetric?: string;
  progress?: number; // 0..1 interpolation or comparison ratio
  themeColor?: string;
  instant?: boolean;
};

/**
 * Recurring Device: Big Distance Readout ("MOON: 384,400 km" -> "192,200 km") and Moon-size Gauge.
 * Supports 8 distinct visual layouts so every appearance looks genuinely different.
 */
export const MoonDistanceGaugeUI: React.FC<{ t: number; cfg: MoonGaugeConfig }> = ({ t, cfg }) => {
  const {
    variant,
    x = 1360,
    y = 330,
    scale = 1,
    tilt = 0,
    header,
    distFrom = '384,400 KM',
    distTo,
    sizeLabel,
    subMetric = 'WIDTH x2 · AREA x4',
    progress = 0.5,
    themeColor = '#7FD4FF',
    instant = false,
  } = cfg;

  const pop = instant ? 1 : lerp(0.88, 1, backOut(clamp(t / 7)));
  const animP = clamp(lerp(0.2, progress, clamp(t / 24)));
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.2);

  return (
    <g transform={`translate(${x} ${y}) scale(${pop * scale}) rotate(${tilt})`}>
      {variant === 'digital_bar' && (
        <g>
          <rect x={-260} y={-145} width={520} height={290} rx={30} fill="#0E0B1D" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-98} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#B8B0C8" letterSpacing={3}>
            {header}
          </text>
          <text x={-220} y={-54} fontFamily={FONT.ui} fontSize={22} fill="#8E84A8" textDecoration="line-through">
            {distFrom}
          </text>
          <text x={220} y={-50} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#FFE27A">
            {distTo}
          </text>
          {/* Distance track bar */}
          <rect x={-220} y={-24} width={440} height={22} rx={11} fill="#1E1836" stroke="#3E3560" strokeWidth={2} />
          <rect x={-220} y={-24} width={440 * animP} height={22} rx={11} fill={themeColor} />
          <circle cx={-220 + 440 * animP} cy={-13} r={15} fill="#FFE27A" stroke="#0E0B1D" strokeWidth={3} />
          {/* Moon size gauge circles */}
          <circle cx={-105} cy={58} r={24} fill="#9BA8C0" opacity={0.55} stroke="#D6E0F2" strokeWidth={2} />
          <text x={-105} y={102} textAnchor="middle" fontFamily={FONT.ui} fontSize={15} fill="#B8B0C8">
            1X DISC
          </text>
          <circle cx={65} cy={54} r={48} fill="#FFF2C2" opacity={0.88} stroke="#FFE27A" strokeWidth={3.5} />
          <circle cx={52} cy={42} r={9} fill="#D8C58E" opacity={0.55} />
          <circle cx={80} cy={64} r={12} fill="#D8C58E" opacity={0.55} />
          <text x={175} y={48} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill={themeColor}>
            {sizeLabel}
          </text>
          <text x={175} y={80} textAnchor="middle" fontFamily={FONT.ui} fontSize={17} fill="#F6EFE3">
            {subMetric}
          </text>
        </g>
      )}

      {variant === 'orbital_arc' && (
        <g>
          <rect x={-270} y={-160} width={540} height={320} rx={34} fill="#0B1022" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-116} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={25} fill="#F6EFE3" letterSpacing={2.5}>
            {header}
          </text>
          {/* Oval orbit diagram inside gauge */}
          <ellipse cx={-35} cy={-12} rx={170} ry={78} fill="none" stroke="#4D6B99" strokeWidth={3} strokeDasharray="10 7" />
          <ellipse cx={-35} cy={-12} rx={92} ry={44} fill="none" stroke="#FFE27A" strokeWidth={3.5} />
          {/* Earth center */}
          <circle cx={-60} cy={-12} r={22} fill="#2E7BE6" stroke="#7FD4FF" strokeWidth={3} />
          {/* Outer Moon vs Inner Moon */}
          <circle cx={135} cy={-12} r={14} fill="#8FA0B8" />
          <circle cx={57} cy={-12} r={26} fill="#FFF0B8" stroke="#FFE27A" strokeWidth={3} />
          <text x={0} y={102} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFE27A">
            {distTo}
          </text>
          <text x={0} y={134} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill={themeColor} letterSpacing={2}>
            {sizeLabel} · {subMetric}
          </text>
        </g>
      )}

      {variant === 'split_disc' && (
        <g>
          <rect x={-265} y={-165} width={530} height={330} rx={32} fill="#120C24" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-122} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill={themeColor} letterSpacing={3}>
            {header}
          </text>
          {/* Left: Today's Moon */}
          <g transform="translate(-125 -10)">
            <circle cx={0} cy={0} r={34} fill="#CBD6E8" stroke="#7FD4FF" strokeWidth={3} />
            <circle cx={-10} cy={-8} r={7} fill="#9AA9C2" />
            <text x={0} y={62} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#B8B0C8">
              {distFrom}
            </text>
          </g>
          {/* Right: 2X Closer Moon (2x width = 4x area) */}
          <g transform="translate(95 -10)">
            <circle cx={0} cy={0} r={68} fill="#FFF2BD" stroke="#FFE27A" strokeWidth={4.5} />
            <circle cx={-20} cy={-16} r={14} fill="#DEC98A" />
            <circle cx={22} cy={14} r={18} fill="#DEC98A" />
            <text x={0} y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={23} fill="#FFE27A">
              {distTo}
            </text>
          </g>
          <rect x={-225} y={104} width={450} height={42} rx={14} fill="#1F1638" stroke={themeColor} strokeWidth={2} />
          <text x={0} y={131} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#F6EFE3" letterSpacing={2}>
            {sizeLabel} · {subMetric}
          </text>
        </g>
      )}

      {variant === 'tidal_dial' && (
        <g>
          <rect x={-260} y={-160} width={520} height={320} rx={32} fill="#081526" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-118} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#7FD4FF" letterSpacing={2.5}>
            {header}
          </text>
          {/* Semi-circular tidal force gauge */}
          <path d="M -165 40 A 165 165 0 0 1 165 40" fill="none" stroke="#1C3454" strokeWidth={26} strokeLinecap="round" />
          <path d="M -165 40 A 165 165 0 0 1 142 -42" fill="none" stroke={themeColor} strokeWidth={26} strokeLinecap="round" />
          {/* Pointer needle */}
          <g transform={`translate(0 40) rotate(${lerp(-70, 68, animP)})`}>
            <polygon points="-8,0 0,-148 8,0" fill="#FFE27A" />
            <circle cx={0} cy={0} r={16} fill="#F6EFE3" stroke="#081526" strokeWidth={4} />
          </g>
          <text x={0} y={88} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFE27A">
            {sizeLabel}
          </text>
          <text x={0} y={124} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#F6EFE3" letterSpacing={2}>
            {distTo} · {subMetric}
          </text>
        </g>
      )}

      {variant === 'laser_ruler' && (
        <g>
          <rect x={-275} y={-140} width={550} height={280} rx={28} fill="#0D111F" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-96} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill={themeColor} letterSpacing={3}>
            {header}
          </text>
          {/* Earth to Moon laser ranging beam */}
          <circle cx={-195} cy={-16} r={28} fill="#2B74E4" stroke="#7FD4FF" strokeWidth={3} />
          <line
            x1={-165}
            y1={-16}
            x2={155}
            y2={-16}
            stroke="#FF5A4A"
            strokeWidth={4}
            strokeDasharray="14 8"
          />
          {/* Ruler ticks */}
          {Array.from({ length: 9 }).map((_, idx) => {
            const tx = -140 + idx * 35;
            return <line key={idx} x1={tx} y1={-30} x2={tx} y2={-2} stroke="#FFE27A" strokeWidth={2.5} />;
          })}
          <circle cx={185} cy={-16} r={34} fill="#EDE4C8" stroke="#FFE27A" strokeWidth={3.5} />
          <text x={0} y={54} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#FFE27A">
            {distTo}
          </text>
          <text x={0} y={94} textAnchor="middle" fontFamily={FONT.ui} fontSize={21} fill="#F6EFE3" letterSpacing={2}>
            {sizeLabel} · {subMetric}
          </text>
        </g>
      )}

      {variant === 'supermoon_vs' && (
        <g>
          <rect x={-275} y={-165} width={550} height={330} rx={32} fill="#140D26" opacity={0.95} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-122} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#FFE27A" letterSpacing={2.5}>
            {header}
          </text>
          {/* 3-way bar/disc comparison: Apogee vs Supermoon (+14%) vs 2X Closer (+100%) */}
          <g transform="translate(-165 5)">
            <circle cx={0} cy={0} r={26} fill="#8E9BB2" />
            <text x={0} y={55} textAnchor="middle" fontFamily={FONT.ui} fontSize={16} fill="#B8B0C8">
              FAINTEST
            </text>
            <text x={0} y={76} textAnchor="middle" fontFamily={FONT.ui} fontSize={15} fill="#8E9BB2">
              405,500 KM
            </text>
          </g>
          <g transform="translate(-25 5)">
            <circle cx={0} cy={0} r={30} fill="#D8E2F2" stroke="#7FD4FF" strokeWidth={3} />
            <text x={0} y={55} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={16} fill="#7FD4FF">
              +14% BIGGER
            </text>
            <text x={0} y={76} textAnchor="middle" fontFamily={FONT.ui} fontSize={15} fill="#D8E2F2">
              363,300 KM
            </text>
          </g>
          <g transform="translate(145 -8)">
            <circle cx={0} cy={0} r={60} fill="#FFF2B8" stroke="#FF8A3D" strokeWidth={4.5} />
            <text x={0} y={72} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={20} fill="#FFE27A">
              +100% WIDER
            </text>
            <text x={0} y={94} textAnchor="middle" fontFamily={FONT.ui} fontSize={16} fill="#FF8A3D">
              {distTo}
            </text>
          </g>
          <text x={0} y={132} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill="#F6EFE3" letterSpacing={2}>
            {sizeLabel} · {subMetric}
          </text>
        </g>
      )}

      {variant === 'sky_caliper' && (
        <g>
          <rect x={-250} y={-155} width={500} height={310} rx={30} fill="#0C1324" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-112} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#7FD4FF" letterSpacing={3}>
            {header}
          </text>
          {/* Caliper brackets around giant Moon */}
          <circle cx={0} cy={-12} r={62} fill="#FFF1BA" opacity={0.9} stroke="#FFE27A" strokeWidth={3.5} />
          <circle cx={0} cy={-12} r={31} fill="none" stroke="#18243E" strokeWidth={2.5} strokeDasharray="6 5" />
          <path d="M -85 -74 L -68 -74 L -68 50 L -85 50" fill="none" stroke={themeColor} strokeWidth={4} />
          <path d="M 85 -74 L 68 -74 L 68 50 L 85 50" fill="none" stroke={themeColor} strokeWidth={4} />
          <text x={0} y={84} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FFE27A">
            {distTo}
          </text>
          <text x={0} y={118} textAnchor="middle" fontFamily={FONT.ui} fontSize={19} fill="#F6EFE3" letterSpacing={2}>
            {sizeLabel} · {subMetric}
          </text>
        </g>
      )}

      {variant === 'almanac_radar' && (
        <g>
          <rect x={-265} y={-155} width={530} height={310} rx={30} fill="#100D22" opacity={0.94} stroke={themeColor} strokeWidth={4} />
          <text x={0} y={-112} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#FFE27A" letterSpacing={2.5}>
            {header}
          </text>
          <circle cx={-125} cy={-8} r={54} fill="#191536" stroke={themeColor} strokeWidth={2.5} />
          <circle cx={-125} cy={-8} r={32} fill="none" stroke={themeColor} strokeWidth={1.5} strokeDasharray="6 6" />
          <circle cx={-125} cy={-8} r={22 + 4 * pulse} fill="#FFF1B8" />
          <text x={55} y={-34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill={themeColor}>
            {distTo}
          </text>
          <text x={55} y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={26} fill="#F6EFE3">
            {sizeLabel}
          </text>
          <text x={55} y={44} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#FFE27A" letterSpacing={1.8}>
            {subMetric}
          </text>
          <rect x={-220} y={82} width={440} height={44} rx={14} fill="#1B1638" stroke="#FFE27A" strokeWidth={2} />
          <text x={0} y={111} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill="#FFE27A" letterSpacing={2}>
            NASA SKYWATCHING · NOV 2026
          </text>
        </g>
      )}
    </g>
  );
};

/**
 * 16:9 End Card for Closermoon Film:
 * "IFMOSPHERE", "Comment your answer", "Subscribe for more what-ifs"
 */
export const ClosermoonEndCard16x9: React.FC<{ t: number }> = ({ t }) => {
  const p1 = backOut(clamp((t - 2) / 9));
  const p2 = backOut(clamp((t - 7) / 10));
  const p3 = backOut(clamp((t - 12) / 10));
  return (
    <g>
      <rect x={260} y={135} width={1400} height={630} rx={42} fill="#0B0818" opacity={0.93} stroke="#FFE27A" strokeWidth={4} />
      <g transform={`translate(960 265) scale(${p1})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={92}
          letterSpacing={8}
          fill="#FFE27A"
          stroke="#140E26"
          strokeWidth={12}
          paintOrder="stroke"
        >
          IFMOSPHERE
        </text>
        <text y={54} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#D6CEE8" letterSpacing={5}>
          STEP INTO THE WHAT IF.
        </text>
      </g>

      <g transform={`translate(960 465) scale(${p2})`}>
        <rect x={-480} y={-55} width={960} height={98} rx={26} fill="#1A1530" stroke="#7FD4FF" strokeWidth={3.5} />
        <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#F6EFE3" letterSpacing={2.5}>
          COMMENT YOUR ANSWER
        </text>
      </g>

      <g transform={`translate(960 620) scale(${p3})`}>
        <rect x={-410} y={-48} width={820} height={86} rx={43} fill={C.orange} stroke="#FFE27A" strokeWidth={3} />
        <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#120E20" letterSpacing={3}>
          SUBSCRIBE FOR MORE WHAT-IFS
        </text>
      </g>
    </g>
  );
};

/**
 * 9:16 Vertical End Card for ClosermoonShort:
 * "SUPERMOON 24 NOV · FULL FILM ON THE CHANNEL"
 */
export const ClosermoonShortEndCard9x16: React.FC<{ t: number }> = ({ t }) => {
  const p1 = lerp(0.88, 1, backOut(clamp((t + 2) / 8)));
  const p2 = lerp(0.88, 1, backOut(clamp((t + 1) / 9)));
  return (
    <g>
      <g transform={`translate(540 310) scale(${p1})`}>
        <rect x={-450} y={-105} width={900} height={225} rx={36} fill="#0B0818" opacity={0.95} stroke="#FFE27A" strokeWidth={4.5} />
        <text y={-18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#FFE27A" letterSpacing={3}>
          SUPERMOON 24 NOV
        </text>
        <text y={56} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#7FD4FF" letterSpacing={3}>
          FULL FILM ON THE CHANNEL · IFMOSPHERE
        </text>
      </g>
      <g transform={`translate(540 1650) scale(${p2})`}>
        <rect x={-380} y={-48} width={760} height={92} rx={46} fill={C.orange} stroke="#FFE27A" strokeWidth={3.5} />
        <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#120E20" letterSpacing={2.5}>
          STEP INTO THE WHAT IF
        </text>
      </g>
    </g>
  );
};
