import React from 'react';
import { clamp, backOut, easeOut, lerp, FONT, UI, C } from '../../engine';

/**
 * Custom TitleCard for Lightday: ["WHAT IF YOUR TEXT", "TOOK A DAY?"], accent "A DAY".
 * Works cleanly in both 16:9 (1920x1080) and 9:16 (1080x1920).
 */
export const LightdayTitleCard: React.FC<{
  t: number;
  lines?: [string, string];
  accentWords?: string[];
  accentT?: number;
  x?: number;
  y?: number;
  size?: number;
}> = ({
  t,
  lines = ['WHAT IF YOUR TEXT', 'TOOK A DAY?'],
  accentWords = ['A', 'DAY'],
  accentT = 14,
  x = 960,
  y = 185,
  size = 116,
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
 * On-screen Chapter Card with location, distance, and delay.
 */
export const DistanceChapterCard: React.FC<{
  t: number;
  place: string;
  sub: string;
  color?: string;
  mode?: 'hero' | 'corner';
}> = ({ t, place, sub, color = '#7FD4FF', mode = 'hero' }) => {
  const p1 = backOut(clamp((t - 1) / 8));
  const p2 = backOut(clamp((t - 4) / 9));
  if (mode === 'corner') {
    const w = Math.max(440, Math.max(place.length * 32, sub.length * 21) + 90);
    return (
      <g transform={`translate(76 80) scale(${p1})`}>
        <rect x={0} y={0} width={w} height={116} rx={24} fill="#0B0816" opacity={0.86} stroke={color} strokeWidth={3.5} />
        <circle cx={38} cy={38} r={10} fill={color} />
        <text x={62} y={48} fontFamily={FONT.title} fontWeight={800} fontSize={35} fill="#F6EFE3" letterSpacing={3}>
          {place}
        </text>
        <text x={30} y={92} fontFamily={FONT.ui} fontSize={25} fill={color} letterSpacing={2.2}>
          {sub}
        </text>
      </g>
    );
  }
  const pillW = Math.max(480, sub.length * 24 + 96);
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
          opacity={0.88}
          stroke={color}
          strokeWidth={3}
        />
        <text
          y={2}
          textAnchor="middle"
          fontFamily={FONT.ui}
          fontSize={26}
          fill={color}
          letterSpacing={4}
        >
          {sub}
        </text>
      </g>
      <g transform={`translate(960 228) scale(${p2})`}>
        <text
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={86}
          letterSpacing={4}
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
 * Bold top/center banner for Hook Gate ("REPLY IN 2 DAYS"), Payoff ("18 NOV 2026"), or Rule Card ("DISTANCE = DELAY").
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
}> = ({ t, text, sub, color = '#FFE27A', x = 960, y = 118, scale = 1, instant = false }) => {
  const pop = instant ? 1 : lerp(0.88, 1, backOut(clamp(t / 7)));
  const w = Math.max(460, text.length * 38 + 90);
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
        fontSize={46}
        fill={color}
        letterSpacing={3.5}
      >
        {text}
      </text>
      {sub ? (
        <text
          y={36}
          textAnchor="middle"
          fontFamily={FONT.ui}
          fontSize={23}
          fill="#F6EFE3"
          letterSpacing={2.5}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/**
 * Telemetry / stat pill for on-screen numbers and distances.
 */
export const TelemetryPill: React.FC<{
  t: number;
  x?: number;
  y?: number;
  label: string;
  value: string;
  color?: string;
}> = ({ t, x = 1490, y = 92, label, value, color = C.orange }) => {
  const pop = backOut(clamp((t - 2) / 8));
  const w = Math.max(340, Math.max(label.length * 18, value.length * 26) + 74);
  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`}>
      <rect x={0} y={0} width={w} height={96} rx={22} fill={UI.pill} opacity={0.9} stroke={color} strokeWidth={3} />
      <text x={26} y={36} fontFamily={FONT.ui} fontSize={20} fill="#B8B0C8" letterSpacing={2.5}>
        {label}
      </text>
      <text x={26} y={76} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={color} letterSpacing={1.5}>
        {value}
      </text>
    </g>
  );
};

/**
 * Big vertical-friendly number readout for LightdayShort (9:16).
 */
export const ShortBigNumber: React.FC<{
  t: number;
  place: string;
  bigValue: string;
  subText: string;
  color?: string;
  y?: number;
}> = ({ t, place, bigValue, subText, color = '#FFE27A', y = 320 }) => {
  const p = lerp(0.88, 1, backOut(clamp((t + 2) / 7)));
  return (
    <g transform={`translate(540 ${y}) scale(${p})`}>
      <rect x={-440} y={-110} width={880} height={250} rx={36} fill="#0D091A" opacity={0.92} stroke={color} strokeWidth={4.5} />
      <text y={-48} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#D4CBE5" letterSpacing={4}>
        {place}
      </text>
      <text
        y={54}
        textAnchor="middle"
        fontFamily={FONT.title}
        fontWeight={800}
        fontSize={96}
        fill={color}
        stroke="#080612"
        strokeWidth={11}
        paintOrder="stroke"
      >
        {bigValue}
      </text>
      <text y={112} textAnchor="middle" fontFamily={FONT.ui} fontSize={27} fill="#F6EFE3" letterSpacing={2}>
        {subText}
      </text>
    </g>
  );
};

export type ChatBubbleSpec = {
  from: 'pip' | 'bo' | 'sys';
  text: string;
  status?: string;
};

export type PhoneUIConfig = {
  x?: number;
  y?: number;
  scale?: number;
  tilt?: number;
  header: string;
  subHeader?: string;
  timerLabel: string;
  timerValue: string;
  themeColor?: string;
  messages: ChatBubbleSpec[];
  typing?: boolean;
  blackout?: boolean;
  calendarMode?: boolean;
  videoCallBo?: boolean;
  instant?: boolean;
};

/**
 * Recurring Phone UI device: chat bubbles, "SENT" / "DELIVERED", animated "typing...",
 * live countdown/delay timer, blackout warning mode, or calendar reminder mode.
 */
export const PhoneChatUI: React.FC<{ t: number; cfg: PhoneUIConfig }> = ({ t, cfg }) => {
  const {
    x = 960,
    y = 540,
    scale = 1,
    tilt = 0,
    header,
    subHeader = 'LIGHT-SPEED MESSENGER',
    timerLabel,
    timerValue,
    themeColor = '#7FD4FF',
    messages,
    typing = false,
    blackout = false,
    calendarMode = false,
    videoCallBo = false,
    instant = false,
  } = cfg;

  const pop = instant ? 1 : lerp(0.88, 1, backOut(clamp(t / 7)));
  const W = 500;
  const H = 740;
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.25);

  return (
    <g transform={`translate(${x} ${y}) scale(${pop * scale}) rotate(${tilt})`}>
      {/* Soft screen glow behind phone */}
      <ellipse cx={0} cy={0} rx={W * 0.68} ry={H * 0.58} fill={blackout ? '#FF4A3D' : themeColor} opacity={0.18 + 0.05 * pulse} />
      {/* Drop shadow */}
      <rect x={-W / 2 + 14} y={-H / 2 + 18} width={W} height={H} rx={48} fill="#04030A" opacity={0.65} />
      {/* Phone chassis */}
      <rect
        x={-W / 2}
        y={-H / 2}
        width={W}
        height={H}
        rx={46}
        fill="#161326"
        stroke={blackout ? '#FF5A4A' : '#3E3759'}
        strokeWidth={6}
      />
      {/* Lit rim on left/top edge */}
      <rect
        x={-W / 2 + 4}
        y={-H / 2 + 4}
        width={W - 8}
        height={H - 8}
        rx={42}
        fill="#0D0B18"
        stroke={blackout ? '#FF5A4A' : themeColor}
        strokeWidth={2}
        opacity={0.95}
      />
      {/* Top speaker notch */}
      <rect x={-64} y={-H / 2 + 16} width={128} height={12} rx={6} fill="#252038" />
      <circle cx={84} cy={-H / 2 + 22} r={5} fill="#2D4A6A" />

      {/* Top Contact Header Bar */}
      <rect x={-W / 2 + 20} y={-H / 2 + 42} width={W - 40} height={82} rx={20} fill="#1B1730" stroke={themeColor} strokeWidth={1.8} />
      <circle cx={-W / 2 + 60} cy={-H / 2 + 83} r={22} fill={blackout ? '#FF5A4A' : themeColor} opacity={0.25} />
      <circle cx={-W / 2 + 60} cy={-H / 2 + 83} r={10} fill={blackout ? '#FF5A4A' : themeColor} />
      <text x={-W / 2 + 96} y={-H / 2 + 78} fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#F6EFE3" letterSpacing={1.5}>
        {header}
      </text>
      <text x={-W / 2 + 96} y={-H / 2 + 106} fontFamily={FONT.ui} fontSize={16} fill={themeColor} letterSpacing={2}>
        {subHeader}
      </text>

      {/* Delay / Reply Timer Banner inside Phone */}
      <rect
        x={-W / 2 + 20}
        y={-H / 2 + 136}
        width={W - 40}
        height={88}
        rx={18}
        fill={blackout ? '#321018' : '#121829'}
        stroke={blackout ? '#FF5A4A' : '#FFE27A'}
        strokeWidth={2.8}
      />
      <text x={0} y={-H / 2 + 166} textAnchor="middle" fontFamily={FONT.ui} fontSize={17} fill="#C6BED9" letterSpacing={3}>
        {timerLabel}
      </text>
      <text
        x={0}
        y={-H / 2 + 208}
        textAnchor="middle"
        fontFamily={FONT.ui}
        fontWeight={700}
        fontSize={33}
        fill={blackout ? '#FF6A5A' : '#FFE27A'}
        letterSpacing={2}
      >
        {timerValue}
      </text>

      {/* Optional Video Call inset of Bo */}
      {videoCallBo ? (
        <g transform={`translate(0 ${-H / 2 + 305})`}>
          <rect x={-W / 2 + 28} y={-65} width={W - 56} height={135} rx={18} fill="#142238" stroke="#7FD4FF" strokeWidth={2.5} />
          {/* Moon surface / dome behind Bo */}
          <circle cx={-120} cy={-25} r={22} fill="#7FD4FF" opacity={0.25} />
          {/* Bo mini avatar head */}
          <circle cx={0} cy={-4} r={34} fill="#EADBC8" stroke="#151824" strokeWidth={3.5} />
          <path d="M -30 -24 Q 0 -52 30 -26" fill="#231A24" />
          <circle cx={-11} cy={-6} r={4} fill="#151824" />
          <circle cx={11} cy={-6} r={4} fill="#151824" />
          <path d={t % 24 < 12 ? 'M -10 10 Q 0 18 10 10' : 'M -8 12 L 8 12'} stroke="#151824" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <rect x={-95} y={38} width={190} height={24} rx={12} fill="#0B0816" opacity={0.85} />
          <text x={0} y={55} textAnchor="middle" fontFamily={FONT.ui} fontSize={15} fill="#FFE27A" letterSpacing={1.5}>
            LIVE CALL · +1.3s LAG
          </text>
        </g>
      ) : null}

      {/* Calendar Reminder Mode for Ch 12 (Nov 2035) */}
      {calendarMode ? (
        <g transform={`translate(0 ${-H / 2 + 410})`}>
          <rect x={-W / 2 + 28} y={-150} width={W - 56} height={280} rx={22} fill="#18142C" stroke="#FFE27A" strokeWidth={3} />
          <rect x={-W / 2 + 28} y={-150} width={W - 56} height={64} rx={22} fill="#D9534F" />
          <text x={0} y={-106} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#F6EFE3" letterSpacing={4}>
            NOVEMBER 2035
          </text>
          {/* Calendar grid cells */}
          {Array.from({ length: 15 }).map((_, idx) => {
            const col = idx % 5;
            const row = Math.floor(idx / 5);
            const cx = -148 + col * 74;
            const cy = -48 + row * 54;
            const active = idx === 11;
            return (
              <g key={idx}>
                <rect
                  x={cx - 28}
                  y={cy - 20}
                  width={56}
                  height={40}
                  rx={10}
                  fill={active ? '#FFE27A' : '#262040'}
                  stroke={active ? '#FF8A3D' : 'none'}
                  strokeWidth={3}
                />
                <text
                  x={cx}
                  y={cy + 7}
                  textAnchor="middle"
                  fontFamily={FONT.ui}
                  fontWeight={700}
                  fontSize={19}
                  fill={active ? '#120E24' : '#9B92B2'}
                >
                  {active ? 'V2!' : '·'}
                </text>
              </g>
            );
          })}
          <text x={0} y={108} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#5BE08A" letterSpacing={2}>
            ✓ REMINDER SAVED: VOYAGER 2
          </text>
        </g>
      ) : null}

      {/* Chat Bubbles Stream */}
      {!calendarMode ? (
        <g transform={`translate(0 ${videoCallBo ? -H / 2 + 400 : -H / 2 + 250})`}>
          {messages.map((m, idx) => {
            const delayF = idx * 4;
            const bPop = instant && idx === 0 ? 1 : lerp(0.85, 1, backOut(clamp((t - delayF + 3) / 7)));
            const by = idx * 116;
            if (m.from === 'sys') {
              return (
                <g key={idx} transform={`translate(0 ${by + 36}) scale(${bPop})`}>
                  <rect x={-W / 2 + 30} y={-34} width={W - 60} height={74} rx={16} fill="#3A121C" stroke="#FF5A4A" strokeWidth={3} />
                  <text x={0} y={-2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={23} fill="#FFE27A" letterSpacing={1.5}>
                    {m.text}
                  </text>
                  {m.status ? (
                    <text x={0} y={26} textAnchor="middle" fontFamily={FONT.ui} fontSize={16} fill="#FF9A8A" letterSpacing={2}>
                      {m.status}
                    </text>
                  ) : null}
                </g>
              );
            }
            const isPip = m.from === 'pip';
            const bx = isPip ? 24 : -24;
            const fill = isPip ? '#2B5B84' : '#263832';
            const stroke = isPip ? '#7FD4FF' : '#5BE08A';
            return (
              <g key={idx} transform={`translate(${bx} ${by + 38}) scale(${bPop})`}>
                <rect
                  x={-188}
                  y={-36}
                  width={376}
                  height={76}
                  rx={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                />
                <text
                  x={isPip ? 168 : -168}
                  y={-2}
                  textAnchor={isPip ? 'end' : 'start'}
                  fontFamily={FONT.title}
                  fontWeight={700}
                  fontSize={27}
                  fill="#F6EFE3"
                >
                  {m.text}
                </text>
                {m.status ? (
                  <text
                    x={isPip ? 168 : -168}
                    y={26}
                    textAnchor={isPip ? 'end' : 'start'}
                    fontFamily={FONT.ui}
                    fontSize={16}
                    fill="#FFE27A"
                    letterSpacing={1.8}
                  >
                    {m.status}
                  </text>
                ) : null}
              </g>
            );
          })}

          {/* Typing indicator bubble ("typing...") */}
          {typing ? (
            <g transform={`translate(-95 ${messages.length * 116 + 34})`}>
              <rect x={-90} y={-26} width={180} height={52} rx={24} fill="#232038" stroke="#7FD4FF" strokeWidth={2} />
              {[0, 1, 2].map((d) => {
                const dy = -5 * Math.abs(Math.sin(t * 0.25 + d * 0.9));
                return <circle key={d} cx={-48 + d * 22} cy={dy} r={6.5} fill="#7FD4FF" />;
              })}
              <text x={36} y={6} textAnchor="middle" fontFamily={FONT.ui} fontSize={16} fill="#C6BED9">
                typing...
              </text>
            </g>
          ) : null}
        </g>
      ) : null}

      {/* Bottom Message Input Bar + SEND button */}
      <rect x={-W / 2 + 24} y={H / 2 - 76} width={W - 140} height={50} rx={25} fill="#1D1930" stroke="#3E3759" strokeWidth={2} />
      <text x={-W / 2 + 48} y={H / 2 - 44} fontFamily={FONT.ui} fontSize={18} fill="#8E84A8">
        {blackout ? 'Signal blocked by Sun...' : 'Message Bo...'}
      </text>
      <rect x={W / 2 - 104} y={H / 2 - 76} width={80} height={50} rx={25} fill={blackout ? '#FF5A4A' : C.orange} />
      <text x={W / 2 - 64} y={H / 2 - 44} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={20} fill="#120E20">
        SEND
      </text>
    </g>
  );
};

/**
 * 16:9 End Card for Lightday Film:
 * "IFMOSPHERE", "Comment your 2-day text", "Subscribe for more what-ifs"
 */
export const LightdayEndCard16x9: React.FC<{ t: number }> = ({ t }) => {
  const p1 = backOut(clamp((t - 2) / 9));
  const p2 = backOut(clamp((t - 7) / 10));
  const p3 = backOut(clamp((t - 12) / 10));
  return (
    <g>
      <rect x={280} y={135} width={1360} height={630} rx={42} fill="#0B0818" opacity={0.92} stroke="#FFE27A" strokeWidth={4} />
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
        <text y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#F6EFE3" letterSpacing={2}>
          COMMENT YOUR 2-DAY TEXT 💬
        </text>
      </g>

      <g transform={`translate(960 620) scale(${p3})`}>
        <rect x={-390} y={-48} width={780} height={86} rx={43} fill={C.orange} stroke="#FFE27A" strokeWidth={3} />
        <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#120E20" letterSpacing={3}>
          SUBSCRIBE FOR MORE WHAT-IFS
        </text>
      </g>
    </g>
  );
};

/**
 * 9:16 Vertical End Card for LightdayShort:
 * "WHO WOULD YOU TEXT FIRST? FULL FILM ON THE CHANNEL."
 */
export const LightdayShortEndCard9x16: React.FC<{ t: number }> = ({ t }) => {
  const p1 = lerp(0.88, 1, backOut(clamp((t + 2) / 8)));
  const p2 = lerp(0.88, 1, backOut(clamp((t + 1) / 9)));
  return (
    <g>
      <g transform={`translate(540 310) scale(${p1})`}>
        <rect x={-450} y={-105} width={900} height={220} rx={36} fill="#0B0818" opacity={0.95} stroke="#FFE27A" strokeWidth={4.5} />
        <text y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFE27A" letterSpacing={3}>
          WHO WOULD YOU TEXT FIRST?
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
