import React from 'react';
import { clamp, backOut, easeOut, lerp, FONT, UI, C } from '../../engine';

/**
 * Custom TitleCard for Jump that supports multi-word accents (e.g. "EVERY WORLD" in "ON EVERY WORLD?"),
 * working cleanly for both 16:9 (1920x1080) and 9:16 (1080x1920).
 */
export const JumpTitleCard: React.FC<{
  t: number;
  lines?: [string, string];
  accentWords?: string[];
  accentT?: number;
  x?: number;
  y?: number;
  size?: number;
}> = ({
  t,
  lines = ['WHAT IF YOU JUMPED', 'ON EVERY WORLD?'],
  accentWords = ['EVERY', 'WORLD'],
  accentT = 16,
  x = 960,
  y = 185,
  size = 112,
}) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= accentT && t < accentT + 16 ? 1 + 0.12 * Math.sin(((t - accentT) / 16) * Math.PI) : 1;
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
 * On-screen Chapter Card with the world's name and gravity/property.
 * `mode="hero"` draws a bold upper-center chapter banner over establishing wides;
 * `mode="corner"` draws a sleek top-left telemetry badge.
 */
export const WorldChapterCard: React.FC<{
  t: number;
  world: string;
  sub: string;
  color?: string;
  mode?: 'hero' | 'corner';
}> = ({ t, world, sub, color = '#FFE27A', mode = 'hero' }) => {
  const p1 = backOut(clamp((t - 1) / 8));
  const p2 = backOut(clamp((t - 4) / 9));
  if (mode === 'corner') {
    const w = Math.max(420, Math.max(world.length * 34, sub.length * 22) + 90);
    return (
      <g transform={`translate(76 82) scale(${p1})`}>
        <rect x={0} y={0} width={w} height={116} rx={24} fill="#0B0816" opacity={0.84} stroke={color} strokeWidth={3.5} />
        <circle cx={38} cy={38} r={10} fill={color} />
        <text x={62} y={48} fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3" letterSpacing={3}>
          {world}
        </text>
        <text x={30} y={92} fontFamily={FONT.ui} fontSize={26} fill={color} letterSpacing={2.5}>
          {sub}
        </text>
      </g>
    );
  }
  const pillW = Math.max(440, sub.length * 24 + 90);
  return (
    <g>
      <g transform={`translate(960 128) scale(${p1})`}>
        <rect
          x={-pillW / 2}
          y={-36}
          width={pillW}
          height={58}
          rx={29}
          fill={UI.pill}
          opacity={0.86}
          stroke={color}
          strokeWidth={3}
        />
        <text y={2} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={color} letterSpacing={5}>
          {sub}
        </text>
      </g>
      <g transform={`translate(960 232) scale(${p2})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={92}
          fill="#F6EFE3"
          stroke="#120D22"
          strokeWidth={13}
          paintOrder="stroke"
          style={{ filter: 'drop-shadow(0 0 24px rgba(15,10,30,0.75))' }}
        >
          {world}
        </text>
      </g>
    </g>
  );
};

/**
 * Clean telemetry readout pill (screen-space or world-space) for height, gravity, hang time, pressure, etc.
 */
export const TelemetryPill: React.FC<{
  x: number;
  y: number;
  t: number;
  label: string;
  value: string;
  color?: string;
  scale?: number;
}> = ({ x, y, t, label, value, color = '#FF8A3D', scale = 1 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7)) * scale;
  const w = Math.max(290, Math.max(label.length * 19, value.length * 34) + 74);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-54} width={w} height={108} rx={24} fill="#0B0816" opacity={0.84} stroke={color} strokeWidth={3.5} />
      <text y={-14} textAnchor="middle" fontFamily={FONT.ui} fontSize={23} fill="#CFC8DC" letterSpacing={3}>
        {label}
      </text>
      <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={color}>
        {value}
      </text>
    </g>
  );
};

/**
 * Vertical height scale bar placed in world coordinates next to a jump!
 * Draws ground baseline at `groundY`, tick marks up to `maxM`, and a live peak marker at `curM`.
 */
export const HeightScaleBar: React.FC<{
  x: number;
  groundY: number;
  pxPerMetre: number;
  maxM: number;
  stepM?: number;
  curM?: number;
  highlightM?: number;
  highlightLabel?: string;
  color?: string;
}> = ({
  x,
  groundY,
  pxPerMetre,
  maxM,
  stepM = 1,
  curM,
  highlightM,
  highlightLabel,
  color = '#FFE27A',
}) => {
  const topY = groundY - maxM * pxPerMetre;
  const ticks: number[] = [];
  for (let m = 0; m <= maxM + 0.001; m += stepM) {
    ticks.push(Number(m.toFixed(2)));
  }
  return (
    <g>
      <line x1={x} y1={groundY} x2={x} y2={topY - 24} stroke="#F6EFE3" strokeWidth={5} opacity={0.8} />
      {ticks.map((m, i) => {
        const ty = groundY - m * pxPerMetre;
        const isZero = Math.abs(m) < 0.001;
        return (
          <g key={i}>
            <line x1={x - (isZero ? 24 : 15)} y1={ty} x2={x + (isZero ? 24 : 15)} y2={ty} stroke="#F6EFE3" strokeWidth={4} opacity={0.85} />
            {isZero ? (
              <text x={x - 32} y={ty + 9} textAnchor="end" fontFamily={FONT.ui} fontSize={26} fill="#F6EFE3" opacity={0.85}>
                0 m
              </text>
            ) : null}
          </g>
        );
      })}
      {highlightM !== undefined ? (
        <g transform={`translate(${x} ${groundY - highlightM * pxPerMetre})`}>
          <line x1={-36} y1={0} x2={220} y2={0} stroke={color} strokeWidth={5} strokeDasharray="14 10" />
          <rect x={24} y={-44} width={220} height={40} rx={10} fill="#0B0816" opacity={0.88} stroke={color} strokeWidth={2.5} />
          <text x={134} y={-16} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={color}>
            {highlightLabel ?? `~${highlightM} m`}
          </text>
        </g>
      ) : null}
      {curM !== undefined ? (
        <g transform={`translate(${x} ${groundY - curM * pxPerMetre})`}>
          <polygon points="0,0 24,-12 24,12" fill={UI.live} />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Big bold vertical stat banner for JumpShort (9:16, 1080x1920, inside safe zone y=220..1520).
 */
export const ShortBigNumber: React.FC<{
  t: number;
  world: string;
  bigValue: string;
  subText: string;
  color?: string;
  y?: number;
}> = ({ t, world, bigValue, subText, color = '#FFE27A', y = 355 }) => {
  const p1 = backOut(clamp(t / 7));
  const p2 = backOut(clamp((t - 3) / 8));
  return (
    <g transform={`translate(540 ${y})`}>
      <g transform={`scale(${p1})`}>
        <rect x={-320} y={-92} width={640} height={66} rx={33} fill="#0B0816" opacity={0.86} stroke={color} strokeWidth={3.5} />
        <text y={-48} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={color} letterSpacing={6}>
          {world}
        </text>
      </g>
      <g transform={`translate(0 78) scale(${p2})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={148}
          fill="#F6EFE3"
          stroke="#120D22"
          strokeWidth={18}
          paintOrder="stroke"
          style={{ filter: `drop-shadow(0 0 28px ${color}88)` }}
        >
          {bigValue}
        </text>
      </g>
      {subText ? (
        <g transform={`translate(0 142) scale(${p2})`}>
          <rect x={-360} y={-28} width={720} height={54} rx={27} fill="#0B0816" opacity={0.82} />
          <text y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFB15A" letterSpacing={2}>
            {subText}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/**
 * 16:9 End Card for Film: "IFMOSPHERE", "Comment your world", "Subscribe for more what-ifs".
 */
export const JumpEndCard16x9: React.FC<{ t: number }> = ({ t }) => {
  const p1 = backOut(clamp(t / 9));
  const p2 = backOut(clamp((t - 6) / 9));
  const p3 = backOut(clamp((t - 12) / 9));
  const pulse = 1 + 0.035 * Math.sin(t * 0.22);
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#070510" opacity={clamp(t / 14) * 0.62} />
      <g transform={`translate(960 255) scale(${p1})`}>
        <rect x={-390} y={-96} width={780} height={178} rx={36} fill="#0B0816" opacity={0.9} stroke="#FFE27A" strokeWidth={4} />
        <text y={-8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F6EFE3" letterSpacing={10}>
          IFMOSPHERE
        </text>
        <text y={50} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#FFE27A" letterSpacing={5}>
          STEP INTO THE WHAT IF.
        </text>
      </g>
      <g transform={`translate(960 515) scale(${p2 * pulse})`}>
        <rect x={-440} y={-62} width={880} height={116} rx={58} fill="#141B2E" opacity={0.93} stroke="#7FD4FF" strokeWidth={4} />
        <circle cx={-355} cy={-4} r={22} fill="#7FD4FF" />
        <path d="M -365 -12 L -345 -12 M -365 -2 L -349 -2" stroke="#0B0816" strokeWidth={4} strokeLinecap="round" />
        <text x={24} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={54} fill="#F6EFE3" letterSpacing={2}>
          Comment your world
        </text>
      </g>
      <g transform={`translate(960 685) scale(${p3})`}>
        <rect x={-470} y={-58} width={940} height={108} rx={54} fill="#FF8A3D" opacity={0.95} stroke="#FFF3DC" strokeWidth={4} />
        <polygon points="-385,-20 -385,14 -355,-3" fill="#0B0816" />
        <text x={22} y={13} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#0B0816" letterSpacing={3}>
          Subscribe for more what-ifs
        </text>
      </g>
    </g>
  );
};

/**
 * 9:16 Vertical End Card for JumpShort: "WHICH WORLD NEXT?", "Full film on the channel", "IFMOSPHERE".
 */
export const JumpShortEndCard9x16: React.FC<{ t: number }> = ({ t }) => {
  const p1 = backOut(clamp(t / 8));
  const p2 = backOut(clamp((t - 5) / 8));
  const p3 = backOut(clamp((t - 10) / 8));
  const pulse = 1 + 0.04 * Math.sin(t * 0.24);
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#070510" opacity={clamp(t / 12) * 0.65} />
      <g transform={`translate(540 560) scale(${p1})`}>
        <rect x={-410} y={-88} width={820} height={164} rx={34} fill="#0B0816" opacity={0.92} stroke="#FFE27A" strokeWidth={4} />
        <text y={-8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#F6EFE3" letterSpacing={8}>
          IFMOSPHERE
        </text>
        <text y={46} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFE27A" letterSpacing={4}>
          STEP INTO THE WHAT IF.
        </text>
      </g>
      <g transform={`translate(540 860) scale(${p2 * pulse})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={88}
          fill="#FFE27A"
          stroke="#120D22"
          strokeWidth={14}
          paintOrder="stroke"
        >
          WHICH WORLD
        </text>
        <text
          y={95}
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={96}
          fill="#FF8A3D"
          stroke="#120D22"
          strokeWidth={14}
          paintOrder="stroke"
        >
          NEXT?
        </text>
      </g>
      <g transform={`translate(540 1160) scale(${p3})`}>
        <rect x={-430} y={-62} width={860} height={116} rx={58} fill="#FF8A3D" opacity={0.96} stroke="#FFF3DC" strokeWidth={4} />
        <polygon points="-355,-20 -355,14 -323,-3" fill="#0B0816" />
        <text x={24} y={13} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#0B0816" letterSpacing={2}>
          Full film on the channel
        </text>
      </g>
    </g>
  );
};
