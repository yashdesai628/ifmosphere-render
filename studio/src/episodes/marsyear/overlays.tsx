import React from 'react';
import { FONT } from '../../engine';
import { TextSpec, WidSpec, LabelSpec, CardSpec, textLayout, widBox, labelBox, cardBox, clamp, tw, sm, place, N, lerp } from './lib';
import { CalFace } from './cal';

// Everything printed on top of a shot: text styles, depth-gauge faces, layer labels, chapter cards, title and end cards.
// Layout comes from lib.ts so the overlap checker sees the same boxes the renderer draws.

const INK = '#1D2033';
const CREAM = '#F6EFE3';
const pop = (t: number, at = 0, len = 7) => {
  const q = clamp((t - at) / len);
  return { o: q, k: 0.86 + 0.14 * (1 + 2.2 * Math.pow(q - 1, 3) + 1.7 * Math.pow(q - 1, 2)) };
};
const fixH = (v: string) => v;

export const TextEl: React.FC<{ tx: TextSpec; W: number; H: number; t: number }> = ({ tx, W, H, t }) => {
  const L = textLayout(tx, W, H);
  const { box, size, lh, lines, st } = L;
  const { o, k } = pop(t, tx.at ?? 0);
  if (o <= 0) return null;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const rot = tx.rot ?? (st === 'sticker' ? -2.5 : st === 'stamp' ? -7 : 0);
  const col = tx.c ?? (st === 'sticker' ? INK : st === 'stamp' ? '#FF5A4A' : CREAM);
  const accent = '#FFB347';
  const tspans = (line: string, fill: string) => {
    if (tx.hl && line.includes(tx.hl)) {
      const [a, b] = line.split(tx.hl);
      return (<><tspan>{a}</tspan><tspan fill={accent}>{tx.hl}</tspan><tspan>{b}</tspan></>);
    }
    return <tspan>{line}</tspan>;
  };
  const startY = cy - ((lines.length - 1) * lh) / 2;
  const family = st === 'note' ? FONT.hand : st === 'fact' || st === 'chip' ? FONT.ui : FONT.title;
  const weight = st === 'note' ? 700 : st === 'fact' || st === 'chip' ? 700 : 800;
  const txt = lines.map((line, i) => (
    <text key={i} x={cx} y={startY + i * lh + size * 0.34} textAnchor="middle" fontFamily={family} fontWeight={weight} fontSize={size} fill={col}
      stroke={st === 'big' || st === 'plain' || st === 'num' ? '#1A0E0A' : 'none'} strokeWidth={st === 'big' ? size * 0.16 : st === 'plain' || st === 'num' ? size * 0.1 : 0} paintOrder="stroke" strokeLinejoin="round">
      {tspans(line, col)}
    </text>
  ));
  let bg: React.ReactNode = null;
  if (st === 'sticker') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={18} fill="#FFD84D" stroke={INK} strokeWidth={5} />;
  if (st === 'note') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={22} fill="#1A0E0A" fillOpacity={0.78} stroke="#F6EFE3" strokeOpacity={0.5} strokeWidth={3} />;
  if (st === 'stamp') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={10} fill="#1A0E0A" fillOpacity={0.55} stroke="#FF5A4A" strokeWidth={7} />;
  if (st === 'fact') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={box.h / 2} fill="#1A0E0A" fillOpacity={0.85} stroke="#FFD6A0" strokeWidth={3.5} />;
  if (st === 'chip') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={12} fill="#FF8A3D" stroke={INK} strokeWidth={4} />;
  const chipText = st === 'chip' ? INK : col;
  return (
    <g opacity={o} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${k}) translate(${-cx} ${-cy})`}>
      {bg}
      {st === 'chip' ? React.Children.map(txt, (c: any) => React.cloneElement(c, { fill: chipText })) : txt}
    </g>
  );
};

// ---------- the day counter overlay ----------
export const WidEl: React.FC<{ g: WidSpec; W: number; H: number; t: number; p: number }> = ({ g, W, H, t, p }) => {
  const b = widBox(g, W, H);
  const { o, k } = pop(t, g.at ?? 0);
  if (o <= 0) return null;
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const day = lerp(g.day, g.day2 ?? g.day, sm(clamp(p)));
  return (
    <g opacity={o} transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
      <g transform={`translate(${b.x} ${b.y})`}>
        <CalFace st={g.st} day={day} w={b.w} h={b.h} sub={g.sub} v={g.v} t={t} />
      </g>
    </g>
  );
};

// ---------- the layer label, in six faces ----------
export const LabelEl: React.FC<{ l: LabelSpec; W: number; H: number; t: number }> = ({ l, W, H, t }) => {
  const b = labelBox(l, W, H);
  const { o, k } = pop(t, l.at ?? 3);
  if (o <= 0) return null;
  const col = l.c ?? '#FFB347';
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const fa = Math.min(48, (b.w - 60) / Math.max(6, l.a.length) * 1.6);
  const fb = Math.min(30, (b.w - 60) / Math.max(8, (l.b ?? '').length) * 1.5);
  let body: React.ReactNode = null;
  switch (l.st) {
    case 'tag':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <path d={`M 0 0 L ${b.w - 40} 0 L ${b.w} ${b.h / 2} L ${b.w - 40} ${b.h} L 0 ${b.h} Z`} fill={col} stroke={INK} strokeWidth={5} />
          <circle cx={26} cy={b.h / 2} r={9} fill={INK} />
          <text x={52} y={50} fontFamily={FONT.title} fontWeight={800} fontSize={fa * 0.8} fill={INK}>{l.a}</text>
          <text x={52} y={92} fontFamily={FONT.ui} fontWeight={700} fontSize={fb * 0.85} fill={INK}>{l.b}</text>
        </g>
      );
      break;
    case 'ribbon':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <path d={`M 0 10 L ${b.w} 10 L ${b.w - 28} ${b.h / 2 + 5} L ${b.w} ${b.h - 10} L 0 ${b.h - 10} L 28 ${b.h / 2 + 5} Z`} fill="#1A0E0A" fillOpacity={0.88} stroke={col} strokeWidth={5} />
          <text x={b.w / 2} y={52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fa * 0.82} fill={col}>{l.a}</text>
          <text x={b.w / 2} y={88} textAnchor="middle" fontFamily={FONT.ui} fontSize={fb * 0.8} fill={CREAM}>{l.b}</text>
        </g>
      );
      break;
    case 'stamp':
      body = (
        <g transform={`translate(${cx} ${cy}) rotate(-6) translate(${-b.w / 2} ${-b.h / 2})`}>
          <rect width={b.w} height={b.h} rx={12} fill="#1A0E0A" fillOpacity={0.5} stroke={col} strokeWidth={8} />
          <rect x={10} y={10} width={b.w - 20} height={b.h - 20} rx={6} fill="none" stroke={col} strokeWidth={3} />
          <text x={b.w / 2} y={66} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fa * 0.9} fill={col}>{l.a}</text>
          <text x={b.w / 2} y={112} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={fb * 0.85} fill={col}>{l.b}</text>
        </g>
      );
      break;
    case 'lower':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect x={0} y={0} width={14} height={b.h} fill={col} />
          <rect x={14} y={0} width={b.w - 14} height={b.h} fill="#1A0E0A" fillOpacity={0.82} />
          <text x={36} y={52} fontFamily={FONT.title} fontWeight={800} fontSize={fa * 0.82} fill={CREAM}>{l.a}</text>
          <text x={36} y={96} fontFamily={FONT.ui} fontSize={fb * 0.8} fill={col}>{l.b}</text>
        </g>
      );
      break;
    case 'side':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={26} fill="#1A0E0A" fillOpacity={0.8} stroke={col} strokeWidth={4} />
          <g transform={`translate(${b.w / 2} ${b.h / 2}) rotate(-90)`}>
            <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(46, (b.h - 80) / Math.max(6, l.a.length) * 1.6)} fill={col}>{l.a}</text>
            <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontSize={Math.min(24, (b.h - 80) / Math.max(8, (l.b ?? '').length) * 1.5)} fill={CREAM}>{l.b}</text>
          </g>
        </g>
      );
      break;
    case 'pill':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={b.h / 2} fill={col} stroke={INK} strokeWidth={5} />
          <text x={b.w / 2} y={b.h / 2 + 11} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(36, (b.w - 70) / Math.max(6, (l.a + ' ' + (l.b ?? '')).length) * 1.6)} fill={INK}>{l.a}{l.b ? ' · ' + l.b : ''}</text>
        </g>
      );
      break;
  }
  return (
    <g opacity={o} transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>{body}</g>
  );
};

// ---------- chapter cards, four faces ----------
export const CardEl: React.FC<{ c: CardSpec; W: number; H: number; t: number }> = ({ c, W, H, t }) => {
  const b = cardBox(c, W, H);
  const col = c.c ?? '#FFB347';
  const slide = sm(clamp(t / 9));
  const fade = 1 - clamp((t - 44) / 8);
  const fa = Math.min(70, ((b.w - 90) / Math.max(8, c.a.length)) * 1.55);
  const fb = Math.min(34, ((b.w - 90) / Math.max(8, c.b.length)) * 1.5);
  let body: React.ReactNode;
  if (c.st === 0) {
    body = (
      <g transform={`translate(${(1 - slide) * -W} 0)`}>
        <rect x={0} y={b.y} width={W} height={b.h} fill="#1A0E0A" fillOpacity={0.82} />
        <rect x={0} y={b.y} width={W} height={8} fill={col} />
        <rect x={0} y={b.y + b.h - 8} width={W} height={8} fill={col} />
        <text x={W / 2} y={b.y + 118} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fa * 1.2} fill={CREAM}>{c.a}</text>
        <text x={W / 2} y={b.y + 186} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={fb * 1.15} fill={col}>{c.b}</text>
      </g>
    );
  } else if (c.st === 1) {
    body = (
      <g transform={`translate(${b.x} ${b.y}) translate(${(1 - slide) * -b.w} 0)`}>
        <rect width={b.w} height={b.h} rx={20} fill="#1A0E0A" fillOpacity={0.86} stroke={col} strokeWidth={5} />
        <rect x={0} y={0} width={20} height={b.h} rx={10} fill={col} />
        <text x={44} y={86} fontFamily={FONT.title} fontWeight={800} fontSize={fa} fill={CREAM}>{c.a}</text>
        <text x={44} y={150} fontFamily={FONT.ui} fontWeight={700} fontSize={fb} fill={col}>{c.b}</text>
      </g>
    );
  } else if (c.st === 2) {
    body = (
      <g transform={`translate(0 ${(1 - slide) * 300})`}>
        <rect x={0} y={b.y} width={W} height={b.h} fill={col} />
        <rect x={0} y={b.y + 8} width={W} height={b.h - 16} fill="#1A0E0A" fillOpacity={0.9} />
        <text x={60} y={b.y + 94} fontFamily={FONT.title} fontWeight={800} fontSize={fa} fill={CREAM}>{c.a}</text>
        <text x={60} y={b.y + 156} fontFamily={FONT.ui} fontWeight={700} fontSize={fb} fill={col}>{c.b}</text>
      </g>
    );
  } else {
    body = (
      <g transform={`translate(${b.x} ${b.y}) translate(${(1 - slide) * b.w} 0)`}>
        <rect width={b.w} height={b.h} rx={20} fill={col} stroke={INK} strokeWidth={6} />
        <text x={b.w / 2} y={88} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fa} fill={INK}>{c.a}</text>
        <text x={b.w / 2} y={150} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={fb} fill={INK}>{c.b}</text>
      </g>
    );
  }
  return <g opacity={fade}>{body}</g>;
};

/** Title card after the payoff: two lines, the accent word in colour. */
export const TitleEl: React.FC<{ W: number; H: number; t: number; lines: [string, string]; accent: string }> = ({ W, H, t, lines, accent }) => {
  const v = H > W;
  const q = sm(clamp(t / 12));
  const size = v ? 120 : 150;
  const fit = (s: string) => Math.min(size, (W - 120) / (s.length * 0.62));
  const y = H * (v ? 0.42 : 0.4);
  const line = (s: string, yy: number, key: number) => {
    const sz = fit(s);
    const has = s.includes(accent);
    const [a, b] = has ? s.split(accent) : [s, ''];
    return (
      <text key={key} x={W / 2} y={yy} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={sz} fill={CREAM} stroke="#1A0E0A" strokeWidth={sz * 0.14} paintOrder="stroke" strokeLinejoin="round">
        {has ? (<><tspan>{a}</tspan><tspan fill="#FFB347">{accent}</tspan><tspan>{b}</tspan></>) : s}
      </text>
    );
  };
  return (
    <g opacity={q} transform={`translate(0 ${(1 - q) * 40})`}>
      <rect x={0} y={y - size * 1.05} width={W} height={size * 2.5} fill="#1A0E0A" fillOpacity={0.5} />
      {line(lines[0], y, 0)}
      {line(lines[1], y + size * 1.05, 1)}
      <text x={W / 2} y={y + size * 1.85} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#FFD6A0">IFMOSPHERE · STEP INTO THE WHAT IF</text>
    </g>
  );
};

export const EndEl: React.FC<{ W: number; H: number; t: number; stage: number }> = ({ W, H, t, stage }) => {
  const v = H > W;
  const q = sm(clamp(t / 10));
  const big = v ? 128 : 170;
  return (
    <g opacity={q}>
      <rect x={0} y={0} width={W} height={H} fill="#1A0C08" fillOpacity={0.62} />
      <text x={W / 2} y={H * 0.4} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(big, (W - 100) / 5.6)} fill={CREAM} letterSpacing={6} stroke="#1A0E0A" strokeWidth={big * 0.1} paintOrder="stroke">IFMOSPHERE</text>
      <rect x={W / 2 - 340} y={H * 0.4 + 44} width={680} height={10} rx={5} fill="#FFB347" />
      <text x={W / 2} y={H * 0.4 + 140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#FFB347">Comment what you'd miss</text>
      <text x={W / 2} y={H * 0.4 + 230} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(40, (W - 100) / 24 * 1.6)} fill="#FFD6A0">Tomorrow: a new what if</text>
    </g>
  );
};
export { place, fixH };
