import React from 'react';
import { FONT } from '../../engine';
import { TextSpec, GaugeSpec, LabelSpec, CardSpec, textLayout, gaugeBox, labelBox, cardBox, clamp, tw, sm, place, N } from './lib';

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
      stroke={st === 'big' || st === 'plain' || st === 'num' ? '#0B0816' : 'none'} strokeWidth={st === 'big' ? size * 0.16 : st === 'plain' || st === 'num' ? size * 0.1 : 0} paintOrder="stroke" strokeLinejoin="round">
      {tspans(line, col)}
    </text>
  ));
  let bg: React.ReactNode = null;
  if (st === 'sticker') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={18} fill="#FFD84D" stroke={INK} strokeWidth={5} />;
  if (st === 'note') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={22} fill="#0B0816" fillOpacity={0.78} stroke="#F6EFE3" strokeOpacity={0.5} strokeWidth={3} />;
  if (st === 'stamp') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={10} fill="#0B0816" fillOpacity={0.55} stroke="#FF5A4A" strokeWidth={7} />;
  if (st === 'fact') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={box.h / 2} fill="#0B0816" fillOpacity={0.85} stroke="#7FD0FF" strokeWidth={3.5} />;
  if (st === 'chip') bg = <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={12} fill="#FF8A3D" stroke={INK} strokeWidth={4} />;
  const chipText = st === 'chip' ? INK : col;
  return (
    <g opacity={o} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${k}) translate(${-cx} ${-cy})`}>
      {bg}
      {st === 'chip' ? React.Children.map(txt, (c: any) => React.cloneElement(c, { fill: chipText })) : txt}
    </g>
  );
};

// ---------- the depth gauge, in eight faces ----------
export const GaugeEl: React.FC<{ g: GaugeSpec; W: number; H: number; t: number; p: number }> = ({ g, W, H, t, p }) => {
  const b = gaugeBox(g, W, H);
  const { o, k } = pop(t, g.at ?? 0);
  const fill = clamp(tw(g.fill as N, p, 0));
  const ground = g.ground ?? 'NONE';
  const jx = g.shake ? Math.sin(t * 1.9) * g.shake : 0;
  const jy = g.shake ? Math.cos(t * 2.3) * g.shake * 0.7 : 0;
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const mono = FONT.ui;
  const num = (size: number, col = '#5BE08A') => (
    <text x={0} y={0} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={Math.min(size, ((b.w - 70) / Math.max(4, g.depth.length)) * 1.55)} fill={col}>{g.depth}</text>
  );
  let body: React.ReactNode = null;
  switch (g.st) {
    case 'lcd':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={22} fill="#2C3248" stroke="#1D2033" strokeWidth={6} />
          <rect x={14} y={14} width={b.w - 28} height={b.h - 28} rx={14} fill="#07101E" />
          <text x={34} y={50} fontFamily={mono} fontSize={22} fill="#8FE9FF">DEPTH</text>
          <g transform={`translate(${b.w / 2} 106)`}>{num(62)}</g>
          <text x={34} y={b.h - 28} fontFamily={mono} fontSize={22} fill="#FFB347">GROUND: {ground}</text>
          <rect x={b.w - 150} y={32} width={110} height={10} rx={5} fill="#16263E" />
          <rect x={b.w - 150} y={32} width={110 * fill} height={10} rx={5} fill="#5BE08A" />
        </g>
      );
      break;
    case 'dial': {
      const R = b.w / 2 - 20;
      const a = Math.PI * (0.8 + 1.4 * fill);
      body = (
        <g transform={`translate(${cx} ${cy})`}>
          <circle r={R + 14} fill="#2C3248" stroke="#1D2033" strokeWidth={6} />
          <circle r={R} fill="#07101E" />
          {Array.from({ length: 15 }).map((_, i) => {
            const q = Math.PI * (0.8 + (1.4 * i) / 14);
            return <line key={i} x1={Math.cos(q) * R * 0.78} y1={Math.sin(q) * R * 0.78} x2={Math.cos(q) * R * 0.92} y2={Math.sin(q) * R * 0.92} stroke={i > 11 ? '#FF5A4A' : '#8FE9FF'} strokeWidth={i % 2 ? 3 : 6} />;
          })}
          <line x1={0} y1={0} x2={Math.cos(a) * R * 0.74} y2={Math.sin(a) * R * 0.74} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
          <circle r={9} fill="#FF8A3D" />
          <text y={R * 0.42} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={Math.min(34, (R * 1.3) / Math.max(3, g.depth.length) * 1.5)} fill="#5BE08A">{g.depth}</text>
          <text y={R * 0.7} textAnchor="middle" fontFamily={mono} fontSize={16} fill="#FFB347">GROUND: {ground}</text>
          <text y={-R * 0.3} textAnchor="middle" fontFamily={mono} fontSize={18} fill="#8FE9FF">DEPTH</text>
        </g>
      );
      break;
    }
    case 'bar': {
      const top = b.y + 30;
      const hh = b.h - 60;
      body = (
        <g>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={20} fill="#0B0816" fillOpacity={0.82} stroke="#7FD0FF" strokeWidth={3} />
          <rect x={cx - 22} y={top} width={44} height={hh} rx={12} fill="#16263E" />
          <rect x={cx - 22} y={top} width={44} height={hh * fill} rx={12} fill="#FF8A3D" />
          {[0.33, 0.66, 1].map((q, i) => <line key={i} x1={cx - 40} x2={cx + 40} y1={top + hh * q * 0.9} y2={top + hh * q * 0.9} stroke="#8FE9FF" strokeWidth={3} />)}
          <circle cx={cx} cy={top + hh * fill} r={18} fill="#FFFFFF" stroke="#FF8A3D" strokeWidth={6} />
          <text x={cx} y={b.y + b.h - 8} textAnchor="middle" fontFamily={mono} fontSize={20} fontWeight={700} fill="#5BE08A">{g.depth}</text>
          <text x={cx} y={top - 8} textAnchor="middle" fontFamily={mono} fontSize={16} fill="#8FE9FF">DEPTH</text>
        </g>
      );
      break;
    }
    case 'tape':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={16} fill="#0B0816" fillOpacity={0.86} stroke="#8FE9FF" strokeWidth={3} />
          <text x={26} y={50} fontFamily={mono} fontSize={26} fill="#8FE9FF">DEPTH:</text>
          <text x={150} y={52} fontFamily={mono} fontWeight={700} fontSize={Math.min(46, ((b.w - 400) / Math.max(4, g.depth.length)) * 1.6)} fill="#5BE08A">{g.depth}</text>
          <text x={b.w - 26} y={50} textAnchor="end" fontFamily={mono} fontSize={26} fill="#FFB347">GROUND: {ground}</text>
          <rect x={26} y={74} width={b.w - 52} height={14} rx={7} fill="#16263E" />
          <rect x={26} y={74} width={(b.w - 52) * fill} height={14} rx={7} fill="#FF8A3D" />
          {Array.from({ length: 24 }).map((_, i) => <line key={i} x1={26 + ((b.w - 52) * i) / 23} x2={26 + ((b.w - 52) * i) / 23} y1={96} y2={i % 4 ? 104 : 112} stroke="#8FE9FF" strokeWidth={2} opacity={0.7} />)}
        </g>
      );
      break;
    case 'warn': {
      const blink = 0.55 + 0.45 * Math.sin(t * 0.8);
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={14} fill="#2A0A10" stroke="#FF5A4A" strokeWidth={7} opacity={0.6 + blink * 0.4} />
          <path d={`M 40 24 L 70 80 L 10 80 Z`} transform="translate(8 20)" fill="#FF5A4A" />
          <text x={50} y={118} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={38} fill="#2A0A10">!</text>
          <text x={110} y={58} fontFamily={mono} fontSize={22} fill="#FF9A8C">DEPTH</text>
          <g transform={`translate(${110 + (b.w - 130) / 2} 112)`}>{num(52, '#FF5A4A')}</g>
          <text x={110} y={b.h - 20} fontFamily={mono} fontSize={20} fill="#FFB347">GROUND: {ground}</text>
        </g>
      );
      break;
    }
    case 'hud':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <path d={`M 0 40 Q 0 0 40 0 L ${b.w - 40} 0 Q ${b.w} 0 ${b.w} 40 L ${b.w} ${b.h - 40} Q ${b.w} ${b.h} ${b.w - 40} ${b.h} L 40 ${b.h} Q 0 ${b.h} 0 ${b.h - 40} Z`} fill="#06324A" fillOpacity={0.55} stroke="#8FF0FF" strokeWidth={3.5} />
          <text x={28} y={42} fontFamily={mono} fontSize={20} fill="#8FF0FF">DEPTH ▸</text>
          <text x={28} y={104} fontFamily={mono} fontWeight={700} fontSize={Math.min(60, ((b.w - 250) / Math.max(4, g.depth.length)) * 1.6)} fill="#CFFFE8">{g.depth}</text>
          <text x={b.w - 28} y={b.h - 26} textAnchor="end" fontFamily={mono} fontSize={20} fill="#FFD27A">GROUND ▸ {ground}</text>
          <path d={`M ${b.w - 40} 26 l 14 0 l 0 14`} stroke="#8FF0FF" strokeWidth={3} fill="none" />
        </g>
      );
      break;
    case 'card':
      body = (
        <g transform={`translate(${b.x} ${b.y}) rotate(-2.5 ${b.w / 2} ${b.h / 2})`}>
          <rect width={b.w} height={b.h} rx={18} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
          <rect x={0} y={0} width={b.w} height={52} rx={18} fill="#FF8A3D" stroke={INK} strokeWidth={6} />
          <text x={b.w / 2} y={38} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill={INK}>DEPTH GAUGE</text>
          <text x={b.w / 2} y={138} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(76, ((b.w - 60) / Math.max(4, g.depth.length)) * 1.7)} fill={INK}>{g.depth}</text>
          <text x={b.w / 2} y={b.h - 34} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={34} fill="#C4492C">ground: {ground.toLowerCase()}</text>
          <rect x={30} y={b.h - 22} width={b.w - 60} height={8} rx={4} fill="#D8CDB8" />
          <rect x={30} y={b.h - 22} width={(b.w - 60) * fill} height={8} rx={4} fill="#C4492C" />
        </g>
      );
      break;
    case 'seg':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={26} fill="#10131F" stroke="#5A6A8A" strokeWidth={6} />
          {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={30 + i * 44} y={22} width={34} height={14} rx={4} fill={i / 10 < fill ? '#FF8A3D' : '#2B3550'} />)}
          <text x={34} y={96} fontFamily={mono} fontSize={20} fill="#8FE9FF">DEPTH:</text>
          <text x={150} y={100} fontFamily={mono} fontWeight={700} fontSize={Math.min(58, ((b.w - 190) / Math.max(4, g.depth.length)) * 1.6)} fill="#FFE27A">{g.depth}</text>
          <text x={34} y={b.h - 24} fontFamily={mono} fontSize={22} fill="#FFB347">GROUND: {ground}</text>
        </g>
      );
      break;
  }
  const lay = g.layer ? (
    <text x={cx} y={b.y + b.h + 30} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={22} fill="#FFFFFF" stroke="#0B0816" strokeWidth={5} paintOrder="stroke">{g.layer}</text>
  ) : null;
  return (
    <g opacity={o} transform={`translate(${jx} ${jy}) translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
      {body}
      {lay}
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
          <path d={`M 0 10 L ${b.w} 10 L ${b.w - 28} ${b.h / 2 + 5} L ${b.w} ${b.h - 10} L 0 ${b.h - 10} L 28 ${b.h / 2 + 5} Z`} fill="#0B0816" fillOpacity={0.88} stroke={col} strokeWidth={5} />
          <text x={b.w / 2} y={52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fa * 0.82} fill={col}>{l.a}</text>
          <text x={b.w / 2} y={88} textAnchor="middle" fontFamily={FONT.ui} fontSize={fb * 0.8} fill={CREAM}>{l.b}</text>
        </g>
      );
      break;
    case 'stamp':
      body = (
        <g transform={`translate(${cx} ${cy}) rotate(-6) translate(${-b.w / 2} ${-b.h / 2})`}>
          <rect width={b.w} height={b.h} rx={12} fill="#0B0816" fillOpacity={0.5} stroke={col} strokeWidth={8} />
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
          <rect x={14} y={0} width={b.w - 14} height={b.h} fill="#0B0816" fillOpacity={0.82} />
          <text x={36} y={52} fontFamily={FONT.title} fontWeight={800} fontSize={fa * 0.82} fill={CREAM}>{l.a}</text>
          <text x={36} y={96} fontFamily={FONT.ui} fontSize={fb * 0.8} fill={col}>{l.b}</text>
        </g>
      );
      break;
    case 'side':
      body = (
        <g transform={`translate(${b.x} ${b.y})`}>
          <rect width={b.w} height={b.h} rx={26} fill="#0B0816" fillOpacity={0.8} stroke={col} strokeWidth={4} />
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
        <rect x={0} y={b.y} width={W} height={b.h} fill="#0B0816" fillOpacity={0.82} />
        <rect x={0} y={b.y} width={W} height={8} fill={col} />
        <rect x={0} y={b.y + b.h - 8} width={W} height={8} fill={col} />
        <text x={W / 2} y={b.y + 118} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fa * 1.2} fill={CREAM}>{c.a}</text>
        <text x={W / 2} y={b.y + 186} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={fb * 1.15} fill={col}>{c.b}</text>
      </g>
    );
  } else if (c.st === 1) {
    body = (
      <g transform={`translate(${b.x} ${b.y}) translate(${(1 - slide) * -b.w} 0)`}>
        <rect width={b.w} height={b.h} rx={20} fill="#0B0816" fillOpacity={0.86} stroke={col} strokeWidth={5} />
        <rect x={0} y={0} width={20} height={b.h} rx={10} fill={col} />
        <text x={44} y={86} fontFamily={FONT.title} fontWeight={800} fontSize={fa} fill={CREAM}>{c.a}</text>
        <text x={44} y={150} fontFamily={FONT.ui} fontWeight={700} fontSize={fb} fill={col}>{c.b}</text>
      </g>
    );
  } else if (c.st === 2) {
    body = (
      <g transform={`translate(0 ${(1 - slide) * 300})`}>
        <rect x={0} y={b.y} width={W} height={b.h} fill={col} />
        <rect x={0} y={b.y + 8} width={W} height={b.h - 16} fill="#0B0816" fillOpacity={0.9} />
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
      <text key={key} x={W / 2} y={yy} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={sz} fill={CREAM} stroke="#0B0816" strokeWidth={sz * 0.14} paintOrder="stroke" strokeLinejoin="round">
        {has ? (<><tspan>{a}</tspan><tspan fill="#FFB347">{accent}</tspan><tspan>{b}</tspan></>) : s}
      </text>
    );
  };
  return (
    <g opacity={q} transform={`translate(0 ${(1 - q) * 40})`}>
      <rect x={0} y={y - size * 1.05} width={W} height={size * 2.5} fill="#0B0816" fillOpacity={0.5} />
      {line(lines[0], y, 0)}
      {line(lines[1], y + size * 1.05, 1)}
      <text x={W / 2} y={y + size * 1.85} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#7FD0FF">IFMOSPHERE · STEP INTO THE WHAT IF</text>
    </g>
  );
};

export const EndEl: React.FC<{ W: number; H: number; t: number; stage: number }> = ({ W, H, t, stage }) => {
  const v = H > W;
  const q = sm(clamp(t / 10));
  const big = v ? 128 : 170;
  return (
    <g opacity={q}>
      <rect x={0} y={0} width={W} height={H} fill="#080614" fillOpacity={0.55} />
      <text x={W / 2} y={H * 0.4} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(big, (W - 100) / 5.6)} fill={CREAM} letterSpacing={6} stroke="#0B0816" strokeWidth={big * 0.1} paintOrder="stroke">IFMOSPHERE</text>
      <rect x={W / 2 - 340} y={H * 0.4 + 44} width={680} height={10} rx={5} fill="#FFB347" />
      <text x={W / 2} y={H * 0.4 + 140} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#FFB347">Comment your planet</text>
      <text x={W / 2} y={H * 0.4 + 230} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(40, (W - 100) / 24 * 1.6)} fill="#7FD0FF">Tomorrow: a new what if</text>
    </g>
  );
};
export { place, fixH };
