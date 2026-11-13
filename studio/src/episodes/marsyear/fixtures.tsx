import React from 'react';
import { FONT } from '../../engine';
import { rnd } from './lib';
import { CalFace } from './cal';

// Habitat fixtures, drawn in stage units (1080 high, the floor line at y = 740). Each takes its own params so one
// fixture can be pictured many ways (variant v, size, day number, open/closed).
export const YF = 740;
const INK = '#2A1A14';
export type Fix = { k: string; x: number; y?: number; w?: number; h?: number; v?: any; day?: number; st?: string; r?: number; open?: number; n?: number; seed?: number; grow?: number; txt?: string; sub?: string; spd?: number; a?: number; s?: number };

const Plant: React.FC<{ kind: string; x: number; y: number; sc: number; seed: number }> = ({ kind, x, y, sc, seed }) => {
  if (kind === 'tomato')
    return (
      <g transform={`translate(${x} ${y}) scale(${sc})`}>
        <path d="M 0 0 L 0 -90" stroke="#2E7A34" strokeWidth={6} />
        <path d="M 0 -50 q -36 -10 -40 -36 M 0 -70 q 34 -8 40 -34 M 0 -90 q -10 -26 -2 -40" stroke="#2E7A34" strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={-26} cy={-34} r={13} fill="#E5484D" stroke={INK} strokeWidth={3} />
        <circle cx={22} cy={-52} r={11} fill="#E5484D" stroke={INK} strokeWidth={3} />
        <circle cx={-6} cy={-8} r={10} fill="#F08A4A" stroke={INK} strokeWidth={3} />
      </g>
    );
  if (kind === 'pepper')
    return (
      <g transform={`translate(${x} ${y}) scale(${sc})`}>
        <path d="M 0 0 L 0 -80" stroke="#2E7A34" strokeWidth={6} />
        <path d="M 0 -60 q -30 -10 -36 -30 M 0 -76 q 30 -8 36 -30" stroke="#2E7A34" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M -16 -50 q -10 36 10 44 q 14 -20 6 -44 Z" fill="#FFB43A" stroke={INK} strokeWidth={3} />
        <path d="M 14 -40 q 8 30 -4 38 q -12 -14 -2 -38 Z" fill="#E5484D" stroke={INK} strokeWidth={3} />
      </g>
    );
  if (kind === 'sprout')
    return (
      <g transform={`translate(${x} ${y}) scale(${sc})`}>
        <path d="M 0 0 Q 2 -24 0 -36" stroke="#2E7A34" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M 0 -32 q -24 0 -24 -22 q 24 2 24 22 M 0 -26 q 22 0 24 -20 q -22 0 -24 20" fill="#7BDD7B" stroke="#2E7A34" strokeWidth={3} />
      </g>
    );
  // lettuce / herb: leafy clusters
  const col = kind === 'herb' ? '#5AA14E' : '#78D07A';
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`}>
      {[-34, -14, 8, 30].map((d, i) => (
        <path key={i} d={`M ${d} 0 Q ${d - 24 + rnd(seed, i) * 8} ${-40 - rnd(seed + 1, i) * 20} ${d + 4} ${-56 - rnd(seed + 2, i) * 18} Q ${d + 30} ${-36} ${d + 18} 0 Z`} fill={col} stroke="#2E7A34" strokeWidth={3} />
      ))}
    </g>
  );
};

const Suit: React.FC<{ x: number; y: number; sc?: number }> = ({ x, y, sc = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${sc})`}>
    <path d="M 0 -150 L 0 -130" stroke={INK} strokeWidth={5} />
    <rect x={-48} y={-130} width={96} height={116} rx={28} fill="#F1F4FA" stroke={INK} strokeWidth={5} />
    <rect x={-20} y={-100} width={40} height={30} rx={6} fill="#FF7A2E" stroke={INK} strokeWidth={4} />
    <path d="M -48 -110 L -78 -40 L -58 -34 L -40 -86 M 48 -110 L 78 -40 L 58 -34 L 40 -86" fill="#E4EAF5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -34 -14 L -40 90 L -12 90 L -6 -14 M 34 -14 L 40 90 L 12 90 L 6 -14" fill="#E4EAF5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-46} y={88} width={36} height={16} rx={6} fill="#FF7A2E" stroke={INK} strokeWidth={4} />
    <rect x={10} y={88} width={36} height={16} rx={6} fill="#FF7A2E" stroke={INK} strokeWidth={4} />
  </g>
);

const Terrain: React.FC<{ x: number; y: number; w: number; h: number; seed: number; hue?: number }> = ({ x, y, w, h, seed, hue = 0 }) => {
  let d = `M ${x} ${y + h}`;
  for (let i = 0; i <= 8; i++) d += ` L ${x + (w * i) / 8} ${y + h * (0.5 + rnd(seed, i) * 0.3)}`;
  d += ` L ${x + w} ${y + h} Z`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h * 0.62} fill={hue ? '#E8A872' : '#F0B07A'} />
      <rect x={x} y={y + h * 0.5} width={w} height={h * 0.5} fill="#C9683E" />
      <path d={d} fill="#B5532E" />
      <circle cx={x + w * (0.2 + rnd(seed, 40) * 0.5)} cy={y + h * 0.22} r={h * 0.07} fill="#FFE6B0" />
    </g>
  );
};

const Wheel: React.FC<{ r: number; rot: number }> = ({ r, rot }) => (
  <g transform={`rotate(${rot})`}>
    <circle r={r} fill="none" stroke={INK} strokeWidth={r * 0.12} />
    <circle r={r * 0.82} fill="none" stroke="#B9C0D0" strokeWidth={r * 0.07} />
    {[0, 60, 120].map((d) => <path key={d} d={`M ${-r} 0 L ${r} 0`} stroke={INK} strokeWidth={r * 0.1} transform={`rotate(${d})`} />)}
    <circle r={r * 0.16} fill="#FF7A2E" stroke={INK} strokeWidth={4} />
  </g>
);

export const Fixture: React.FC<{ f: Fix; t: number; pal: any }> = ({ f, t, pal }) => {
  const x = f.x;
  const seed = f.seed ?? Math.floor(x) % 97;
  switch (f.k) {
    case 'hatch': {
      const r = f.r ?? 190;
      const y = f.y ?? 420;
      const open = f.open ?? 0;
      const lamp = f.v === 'green' ? '#5BE08A' : f.v === 'amber' ? '#FFB347' : '#FF5A4A';
      return (
        <g transform={`translate(${x} ${y})`}>
          <rect x={-r - 44} y={-r - 44} width={2 * r + 88} height={2 * r + 88} rx={36} fill={pal.trim} stroke={INK} strokeWidth={6} />
          <circle r={r + 22} fill="#8E98AE" stroke={INK} strokeWidth={7} />
          <circle r={r} fill="#0E0A0C" stroke={INK} strokeWidth={6} />
          {open > 0 ? <rect x={-r * 0.8} y={-r * 0.8} width={r * 1.6} height={r * 1.6} rx={r * 0.4} fill="#FFF3C8" opacity={open} /> : null}
          <g transform={`scale(${1 - open * 0.78} 1)`} style={{ transformOrigin: `${-r}px 0px` }}>
            <g transform={`translate(${open * -r * 0.0} 0)`}>
              <circle r={r - 8} fill="#C9D0DE" stroke={INK} strokeWidth={6} />
              <circle r={r - 38} fill="#B6BED0" stroke={INK} strokeWidth={4} />
              {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={Math.cos((i / 12) * 6.283) * (r - 22)} cy={Math.sin((i / 12) * 6.283) * (r - 22)} r={5} fill="#6C778F" />)}
              <g transform={`rotate(${(f.a ?? 0) + (f.spd ?? 0) * t})`}>
                <Wheel r={r * 0.46} rot={0} />
              </g>
              {f.txt ? <text y={r * 0.78} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={r * 0.16} fill="#8A3A22" letterSpacing={4}>{f.txt}</text> : null}
            </g>
          </g>
          <circle cx={r + 26} cy={-r - 12} r={14} fill={lamp} stroke={INK} strokeWidth={4} />
          <circle cx={r + 26} cy={-r - 12} r={30} fill={lamp} opacity={0.25 + 0.15 * Math.sin(t * 0.3)} />
        </g>
      );
    }
    case 'cal': {
      const w = f.w ?? 300;
      const h = f.h ?? 260;
      return (
        <g transform={`translate(${x - w / 2} ${f.y ?? 330})`}>
          <CalFace st={f.st ?? 'cal'} day={f.day ?? 1} w={w} h={h} sub={f.sub} v={f.v} t={t} />
        </g>
      );
    }
    case 'nowin': {
      const y = f.y ?? 300;
      const v = f.v ?? 0;
      const w = f.w ?? 360;
      if (v === 0)
        return (
          <g transform={`translate(${x - w / 2} ${y})`}>
            <rect width={w} height={w * 0.62} rx={14} fill="#E8E0D0" stroke={INK} strokeWidth={6} />
            <rect x={14} y={14} width={w - 28} height={w * 0.62 - 28} rx={8} fill="none" stroke="#E5484D" strokeWidth={6} />
            <rect x={w * 0.1} y={w * 0.12} width={w * 0.22} height={w * 0.22} fill="#BFE6FF" stroke={INK} strokeWidth={4} />
            <path d={`M ${w * 0.06} ${w * 0.38} L ${w * 0.36} ${w * 0.08}`} stroke="#E5484D" strokeWidth={9} strokeLinecap="round" />
            <text x={w * 0.64} y={w * 0.25} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.082} fill={INK}>NO</text>
            <text x={w * 0.64} y={w * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.082} fill={INK}>WINDOWS</text>
          </g>
        );
      if (v === 1)
        return (
          <g transform={`translate(${x} ${y}) rotate(-4)`}>
            <rect x={-w * 0.4} y={0} width={w * 0.8} height={w * 0.55} fill="#FFFDF4" stroke="#C9BFA8" strokeWidth={3} />
            <rect x={-w * 0.46} y={-10} width={90} height={26} fill="#F2D88A" opacity={0.85} transform="rotate(-8)" />
            <rect x={w * 0.34} y={w * 0.5} width={90} height={26} fill="#F2D88A" opacity={0.85} transform="rotate(-6)" />
            <text y={w * 0.22} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={w * 0.16} fill="#C4281F">no windows</text>
            <text y={w * 0.4} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={w * 0.1} fill={INK}>(please stop looking)</text>
          </g>
        );
      if (v === 2)
        return (
          <g transform={`translate(${x} ${y})`}>
            <text y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.3} fill="#FFD6A0" stroke="#7A3A22" strokeWidth={w * 0.03} paintOrder="stroke" letterSpacing={6}>NO</text>
            <text y={w * 0.32} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.3} fill="#FFD6A0" stroke="#7A3A22" strokeWidth={w * 0.03} paintOrder="stroke" letterSpacing={6}>WINDOWS</text>
          </g>
        );
      if (v === 3) {
        const on = Math.sin(t * 0.5) > -0.6;
        return (
          <g transform={`translate(${x} ${y + 60})`}>
            <rect x={-w * 0.46} y={-w * 0.16} width={w * 0.92} height={w * 0.32} rx={16} fill="#1A0E10" stroke="#5A4A4A" strokeWidth={5} />
            <text textAnchor="middle" y={w * 0.07} fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.17} fill={on ? '#FF5A8A' : '#7A2A44'} style={{ filter: on ? 'drop-shadow(0 0 12px #FF3A7A)' : 'none' }}>NO WINDOWS</text>
          </g>
        );
      }
      if (v === 4)
        return (
          <g transform={`translate(${x - w * 0.3} ${y})`}>
            <rect width={w * 0.6} height={w * 0.5} fill={pal.wall2} stroke={INK} strokeWidth={6} />
            <rect x={10} y={10} width={w * 0.6 - 20} height={w * 0.5 - 20} fill={pal.wall} stroke={INK} strokeWidth={3} strokeDasharray="12 8" />
            <path d={`M ${w * 0.3} 10 L ${w * 0.3} ${w * 0.5 - 10} M 10 ${w * 0.25} L ${w * 0.6 - 10} ${w * 0.25}`} stroke={INK} strokeWidth={3} opacity={0.35} />
            <circle cx={w * 0.2} cy={w * 0.16} r={w * 0.03} fill={INK} /><circle cx={w * 0.4} cy={w * 0.16} r={w * 0.03} fill={INK} />
            <path d={`M ${w * 0.2} ${w * 0.37} q ${w * 0.1} ${-w * 0.08} ${w * 0.2} 0`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
            <text x={w * 0.3} y={w * 0.62} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={w * 0.1} fill={INK}>NO WINDOWS :(</text>
          </g>
        );
      return (
        <g transform={`translate(${x - w * 0.28} ${y})`}>
          <rect width={w * 0.56} height={w * 0.2} rx={6} fill="#D9B35A" stroke={INK} strokeWidth={5} />
          <text x={w * 0.28} y={w * 0.13} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.075} fill="#4A2E10" letterSpacing={2}>NO WINDOWS (SORRY)</text>
          {[10, w * 0.56 - 10].map((d, i) => <circle key={i} cx={d} cy={w * 0.1} r={4} fill="#7A5A1E" />)}
        </g>
      );
    }
    case 'poster': {
      const w = f.w ?? 300;
      const h = f.h ?? 220;
      const y = f.y ?? 280;
      const v = f.v ?? 'sunset';
      return (
        <g transform={`translate(${x - w / 2} ${y})`}>
          <rect x={-10} y={-10} width={w + 20} height={h + 20} rx={6} fill="#F6EFE3" stroke={INK} strokeWidth={5} />
          <rect width={w} height={h} fill={v === 'sunset' ? '#FF9A5A' : v === 'beach' ? '#7FD0FF' : v === 'earth' ? '#0B1230' : '#9ED8A0'} />
          {v === 'sunset' ? <g><circle cx={w * 0.5} cy={h * 0.62} r={h * 0.2} fill="#FFE27A" /><rect y={h * 0.64} width={w} height={h * 0.36} fill="#B8453A" /></g> : null}
          {v === 'beach' ? <g><rect y={h * 0.6} width={w} height={h * 0.4} fill="#F0DDA0" /><rect y={h * 0.5} width={w} height={h * 0.12} fill="#3A8AD8" /><circle cx={w * 0.8} cy={h * 0.25} r={h * 0.12} fill="#FFE27A" /></g> : null}
          {v === 'earth' ? <circle cx={w * 0.5} cy={h * 0.55} r={h * 0.34} fill="#2C7AD0" /> : null}
          {v === 'forest' ? <g>{[0.2, 0.5, 0.78].map((q, i) => <path key={i} d={`M ${w * q} ${h * 0.85} L ${w * q - 34} ${h * 0.85} L ${w * q} ${h * 0.25} L ${w * q + 34} ${h * 0.85} Z`} fill="#2E7A34" />)}</g> : null}
          <path d={`M ${w / 2} 0 L ${w / 2} ${h} M 0 ${h / 2} L ${w} ${h / 2}`} stroke={INK} strokeWidth={6} opacity={0.5} />
          <text x={w / 2} y={h + 42} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={26} fill={INK}>{f.txt ?? 'window (poster)'}</text>
        </g>
      );
    }
    case 'table': {
      const w = f.w ?? 640;
      const v = f.v ?? 'plates';
      return (
        <g transform={`translate(${x} 0)`}>
          <ellipse cx={0} cy={YF + 150} rx={w * 0.56} ry={26} fill="#000" opacity={0.22} />
          {[-w * 0.42, w * 0.42].map((d, i) => <rect key={i} x={d - 16} y={620} width={32} height={YF + 120 - 620} fill="#8A6244" stroke={INK} strokeWidth={5} />)}
          {[-w * 0.62, w * 0.62].map((d, i) => (
            <g key={i}>
              <rect x={d - 50} y={YF + 10} width={100} height={30} rx={10} fill="#C46A3A" stroke={INK} strokeWidth={5} />
              <rect x={d - 10} y={YF + 40} width={20} height={100} fill="#8A6244" stroke={INK} strokeWidth={4} />
            </g>
          ))}
          <rect x={-w / 2} y={600} width={w} height={34} rx={8} fill="#D9A874" stroke={INK} strokeWidth={6} />
          {v === 'plates' ? [-0.34, -0.12, 0.12, 0.34].map((q, i) => <g key={i}><ellipse cx={w * q} cy={598} rx={44} ry={11} fill="#F6EFE3" stroke={INK} strokeWidth={4} /><circle cx={w * q} cy={586} r={10} fill={['#E5484D', '#78D07A', '#FFB43A', '#E5484D'][i]} stroke={INK} strokeWidth={3} /></g>) : null}
          {v === 'cards' ? [-0.2, 0, 0.2].map((q, i) => <rect key={i} x={w * q - 20} y={576} width={40} height={24} rx={3} fill="#FFFDF4" stroke={INK} strokeWidth={3} transform={`rotate(${(i - 1) * 14} ${w * q} 590)`} />) : null}
          {v === 'bowl' ? <g><path d={`M ${-60} 596 Q 0 650 60 596 Z`} fill="#6EC8C0" stroke={INK} strokeWidth={5} /><circle cx={-18} cy={586} r={12} fill="#E5484D" stroke={INK} strokeWidth={3} /><circle cx={14} cy={582} r={12} fill="#FFB43A" stroke={INK} strokeWidth={3} /></g> : null}
          {v === 'tablet' ? <g><rect x={-60} y={570} width={120} height={28} rx={4} fill="#1D2033" /><rect x={-54} y={573} width={108} height={20} fill="#12304A" /></g> : null}
          {v === 'cups' ? [-0.3, -0.1, 0.1, 0.3].map((q, i) => <g key={i}><rect x={w * q - 14} y={566} width={28} height={32} rx={6} fill="#F6EFE3" stroke={INK} strokeWidth={4} /><path d={`M ${w * q - 4} 556 q 6 -10 0 -18`} stroke="#fff" strokeWidth={3} opacity={0.7} fill="none" /></g>) : null}
        </g>
      );
    }
    case 'counter': {
      const w = f.w ?? 600;
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={150} width={w} height={150} rx={8} fill={pal.cab} stroke={INK} strokeWidth={6} />
          {[0, 1, 2].map((i) => <g key={i}><rect x={-w / 2 + 10 + i * (w / 3)} y={160} width={w / 3 - 20} height={130} rx={6} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} /><circle cx={-w / 2 + 40 + i * (w / 3)} cy={230} r={6} fill={INK} /></g>)}
          <rect x={-w / 2} y={560} width={w} height={YF + 100 - 560} fill={pal.cab} stroke={INK} strokeWidth={6} />
          {[0, 1, 2].map((i) => <g key={i}><rect x={-w / 2 + 12 + i * (w / 3)} y={600} width={w / 3 - 24} height={140} rx={6} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} /><circle cx={-w / 2 + 40 + i * (w / 3)} cy={650} r={6} fill={INK} /></g>)}
          <rect x={-w / 2 - 12} y={540} width={w + 24} height={30} rx={8} fill="#E8E0D0" stroke={INK} strokeWidth={6} />
          <g transform={`translate(${-w * 0.28} 540)`}>
            <rect x={-34} y={-70} width={68} height={70} rx={14} fill="#B9C0D0" stroke={INK} strokeWidth={5} />
            <path d="M 34 -48 q 28 -2 22 24" fill="none" stroke={INK} strokeWidth={6} />
            <path d="M -34 -60 L -54 -80" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <path d={`M -10 -90 q 8 -12 0 -22 M 6 -90 q 8 -12 0 -22`} stroke="#fff" strokeWidth={4} opacity={0.65} fill="none" transform={`translate(0 ${Math.sin(t * 0.2) * 4})`} />
          </g>
          <g transform={`translate(${w * 0.18} 540)`}>
            <rect x={-60} y={-44} width={120} height={44} rx={6} fill="#8E98AE" stroke={INK} strokeWidth={5} />
            <rect x={-48} y={-36} width={70} height={28} fill="#1D2033" />
            <circle cx={42} cy={-22} r={8} fill="#FFB347" />
          </g>
        </g>
      );
    }
    case 'shelf': {
      const w = f.w ?? 560;
      const v = f.v ?? 'food';
      const rows = f.n ?? 3;
      return (
        <g transform={`translate(${x} 0)`}>
          {Array.from({ length: rows }).map((_, r) => {
            const y = 200 + r * 150;
            return (
              <g key={r}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const bx = -w / 2 + 30 + i * (w - 60) / 7;
                  const cc = ['#E5484D', '#FFB43A', '#6EC8C0', '#F6EFE3', '#78D07A', '#C46A3A', '#8FD3EA'][Math.floor(rnd(seed + r, i) * 7)];
                  const hh = 50 + rnd(seed + 5, r * 7 + i) * 40;
                  if (v === 'supplies') return <g key={i}><rect x={bx} y={y - hh} width={44} height={hh} rx={8} fill={cc} stroke={INK} strokeWidth={4} /><rect x={bx + 12} y={y - hh - 12} width={20} height={12} rx={3} fill="#F6EFE3" stroke={INK} strokeWidth={3} /></g>;
                  if (v === 'books') return <rect key={i} x={bx} y={y - hh - 20} width={30 + rnd(seed, i) * 14} height={hh + 20} fill={cc} stroke={INK} strokeWidth={4} />;
                  return rnd(seed + 9, r * 7 + i) > 0.5 ? <g key={i}><rect x={bx} y={y - hh} width={40} height={hh} rx={6} fill={cc} stroke={INK} strokeWidth={4} /><rect x={bx + 4} y={y - hh * 0.65} width={32} height={hh * 0.3} fill="#FFFDF4" opacity={0.85} /></g> : <g key={i}><rect x={bx - 4} y={y - hh * 0.8} width={52} height={hh * 0.8} rx={4} fill={cc} stroke={INK} strokeWidth={4} /><path d={`M ${bx - 4} ${y - hh * 0.8} l 8 -10 l 36 0 l 8 10`} fill={cc} stroke={INK} strokeWidth={3} /></g>;
                })}
                <rect x={-w / 2} y={y} width={w} height={16} rx={4} fill="#A87850" stroke={INK} strokeWidth={5} />
              </g>
            );
          })}
        </g>
      );
    }
    case 'bunk': {
      const col = f.v ?? '#3A8AD8';
      const w = f.w ?? 420;
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={300} width={w} height={YF + 70 - 300} rx={24} fill="#E8DCC8" stroke={INK} strokeWidth={7} />
          <rect x={-w / 2 + 24} y={340} width={w - 48} height={150} rx={14} fill="#2A1E1A" />
          <rect x={-w / 2 + 24} y={520} width={w - 48} height={34} rx={8} fill="#8A6244" stroke={INK} strokeWidth={4} />
          <rect x={-w / 2 + 34} y={470} width={w - 68} height={52} rx={18} fill={col} stroke={INK} strokeWidth={5} />
          <ellipse cx={-w / 2 + 84} cy={466} rx={46} ry={22} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
          <rect x={-w / 2 + 34} y={640} width={w - 68} height={50} rx={18} fill={col} stroke={INK} strokeWidth={5} opacity={0.9} />
          <path d={`M ${w / 2 - 60} 350 q 40 60 0 140`} fill="none" stroke={INK} strokeWidth={4} />
          <rect x={w / 2 - 70} y={340} width={50} height={150} fill="#D86A3E" opacity={0.7} stroke={INK} strokeWidth={4} />
          <circle cx={-w / 2 + 50} cy={380} r={10} fill="#FFE27A" />
        </g>
      );
    }
    case 'desk': {
      const w = f.w ?? 460;
      const v = f.v ?? 'graph';
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={620} width={w} height={26} rx={6} fill="#C99A5E" stroke={INK} strokeWidth={6} />
          {[-w / 2 + 30, w / 2 - 30].map((d, i) => <rect key={i} x={d - 12} y={646} width={24} height={YF + 100 - 646} fill="#8A6244" stroke={INK} strokeWidth={5} />)}
          <rect x={-w * 0.3} y={452} width={w * 0.6} height={150} rx={10} fill="#1D2033" stroke={INK} strokeWidth={6} />
          <rect x={-w * 0.3 + 10} y={462} width={w * 0.6 - 20} height={130} fill={v === 'mail' ? '#F6EFE3' : '#0E2A3C'} />
          {v === 'graph' ? <path d={`M ${-w * 0.26} 570 L ${-w * 0.14} 530 L ${-w * 0.04} 550 L ${w * 0.08} 500 L ${w * 0.24} 520`} stroke="#7FE8FF" strokeWidth={6} fill="none" /> : null}
          {v === 'mail' ? <g><rect x={-w * 0.24} y={480} width={w * 0.3} height={24} rx={6} fill="#2F7BE0" /><rect x={-w * 0.1} y={514} width={w * 0.3} height={24} rx={6} fill="#CFC8B4" /><circle cx={w * 0.2} cy={560} r={14} fill="none" stroke="#C4281F" strokeWidth={5} /></g> : null}
          {v === 'video' ? <g><rect x={-w * 0.26} y={474} width={w * 0.52} height={100} fill="#E8A872" /><circle cx={0} cy={520} r={16} fill="#B5532E" /></g> : null}
          <rect x={-8} y={602} width={16} height={18} fill="#6C7794" />
          <rect x={-w * 0.2} y={608} width={w * 0.4} height={12} rx={4} fill="#3A4260" />
          <g transform={`translate(${w * 0.36} 620)`}><rect x={-14} y={-30} width={28} height={30} rx={6} fill="#F6EFE3" stroke={INK} strokeWidth={4} /></g>
          <rect x={-w * 0.68} y={YF - 20} width={100} height={26} rx={10} fill="#C46A3A" stroke={INK} strokeWidth={5} />
          <rect x={-w * 0.68 + 8} y={YF - 130} width={84} height={110} rx={14} fill="#C46A3A" stroke={INK} strokeWidth={5} />
        </g>
      );
    }
    case 'console': {
      const w = f.w ?? 900;
      const cols = Math.max(2, Math.round(w / 220));
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={180} width={w} height={420} rx={14} fill="#2A2530" stroke={INK} strokeWidth={7} />
          {Array.from({ length: cols * 2 }).map((_, i) => {
            const sw = (w - 40) / cols - 16;
            const sx = -w / 2 + 24 + (i % cols) * (sw + 16);
            const sy = 204 + Math.floor(i / cols) * 190;
            const kind = (i + seed) % 4;
            return (
              <g key={i}>
                <rect x={sx} y={sy} width={sw} height={170} rx={8} fill="#0B1A22" stroke="#5A8A9A" strokeWidth={4} />
                {kind === 0 ? <path d={`M ${sx + 14} ${sy + 130} L ${sx + sw * 0.3} ${sy + 80} L ${sx + sw * 0.5} ${sy + 110} L ${sx + sw * 0.7} ${sy + 50} L ${sx + sw - 14} ${sy + 70}`} stroke="#7FE8FF" strokeWidth={5} fill="none" /> : null}
                {kind === 1 ? Array.from({ length: 5 }).map((_, j) => <rect key={j} x={sx + 16 + j * (sw / 5.5)} y={sy + 150 - 20 - ((j * 37 + seed * 11) % 90)} width={sw / 8} height={20 + ((j * 37 + seed * 11) % 90)} fill="#FFB347" />) : null}
                {kind === 2 ? <circle cx={sx + sw / 2} cy={sy + 85} r={48} fill="none" stroke="#5BE08A" strokeWidth={5} strokeDasharray="14 8" /> : null}
                {kind === 3 ? Array.from({ length: 6 }).map((_, j) => <path key={j} d={`M ${sx + 14} ${sy + 24 + j * 22} L ${sx + 14 + ((j * 53 + 40) % (sw - 40))} ${sy + 24 + j * 22}`} stroke="#CFFFE8" strokeWidth={5} opacity={0.8} />) : null}
              </g>
            );
          })}
          <rect x={-w / 2 - 14} y={600} width={w + 28} height={50} rx={8} fill="#3A3F58" stroke={INK} strokeWidth={6} />
          {Array.from({ length: Math.floor(w / 60) }).map((_, i) => <circle key={i} cx={-w / 2 + 40 + i * 60} cy={625} r={8} fill={['#5BE08A', '#FFB347', '#FF5A4A', '#7FE8FF'][(i + seed) % 4]} opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 0.1 + i))} />)}
        </g>
      );
    }
    case 'feed': {
      const w = f.w ?? 420;
      const h = f.h ?? 280;
      const y = f.y ?? 280;
      const dr = f.v === 'drone';
      return (
        <g transform={`translate(${x - w / 2} ${y})`}>
          <rect x={-12} y={-12} width={w + 24} height={h + 24} rx={14} fill="#1D2033" stroke="#5A8A9A" strokeWidth={6} />
          <svg x={0} y={0} width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="hidden">
            <Terrain x={0} y={dr ? 0 : 20} w={w} h={dr ? h * 0.9 : h * 0.8} seed={seed + (dr ? 3 : 8)} hue={dr ? 1 : 0} />
            <g transform={`translate(${w / 2} ${h / 2})`} stroke="#7FE8FF" strokeWidth={3} fill="none">
              <circle r={40} /><path d="M -64 0 L -22 0 M 22 0 L 64 0 M 0 -64 L 0 -22 M 0 22 L 0 64" />
            </g>
            <text x={14} y={30} fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#CFFFE8">{dr ? 'DRONE CAM' : 'ROVER CAM'}</text>
            <circle cx={w - 24} cy={24} r={8} fill={Math.sin(t * 0.3) > 0 ? '#FF4A3A' : '#5A1E18'} />
          </svg>
        </g>
      );
    }
    case 'rack': {
      const w = f.w ?? 520;
      const kind = f.v ?? 'lettuce';
      const gr = f.grow ?? 1;
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={230} width={14} height={YF + 40 - 230} fill="#B9C0D0" stroke={INK} strokeWidth={4} />
          <rect x={w / 2 - 14} y={230} width={14} height={YF + 40 - 230} fill="#B9C0D0" stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((r) => {
            const y = 330 + r * 160;
            return (
              <g key={r}>
                <rect x={-w / 2} y={y - 78} width={w} height={14} rx={7} fill="#FF5ABF" opacity={0.9} stroke={INK} strokeWidth={3} />
                <path d={`M ${-w / 2 + 12} ${y - 66} L ${-w / 2 - 20} ${y + 0} L ${w / 2 + 20} ${y + 0} L ${w / 2 - 12} ${y - 66} Z`} fill="#FF5ABF" opacity={0.13} />
                {Array.from({ length: 5 }).map((_, i) => <Plant key={i} kind={kind} x={-w / 2 + 50 + i * (w - 100) / 4} y={y} sc={(0.55 + 0.45 * (0.6 + rnd(seed, i + r * 5) * 0.4)) * (0.35 + 0.65 * gr)} seed={seed + r * 7 + i} />)}
                <rect x={-w / 2} y={y} width={w} height={30} rx={8} fill="#F6EFE3" stroke={INK} strokeWidth={5} />
                <rect x={-w / 2 + 10} y={y + 8} width={w - 20} height={10} rx={5} fill="#6EC8F0" />
              </g>
            );
          })}
          <path d={`M ${w / 2 - 6} 300 q 40 100 0 300`} stroke="#3A8AD8" strokeWidth={8} fill="none" />
        </g>
      );
    }
    case 'bike': {
      const sp = (f.spd ?? 0.4) * t * 57;
      return (
        <g transform={`translate(${x} 0)`}>
          <ellipse cx={0} cy={YF + 60} rx={150} ry={20} fill="#000" opacity={0.2} />
          <g transform={`translate(-30 ${YF - 80})`}>
            <circle r={78} fill="#3A3F58" stroke={INK} strokeWidth={7} />
            <circle r={52} fill="#8E98AE" stroke={INK} strokeWidth={5} />
            <g transform={`rotate(${sp})`}><path d="M -48 0 L 48 0 M 0 -48 L 0 48" stroke={INK} strokeWidth={5} /></g>
            <path d="M 0 0 L -60 -150 L -60 -230" stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
            <path d="M 0 0 L -60 -150 L -60 -230" stroke="#E5484D" strokeWidth={8} strokeLinecap="round" fill="none" />
            <rect x={-96} y={-246} width={74} height={22} rx={10} fill="#3A3F58" stroke={INK} strokeWidth={5} />
            <path d="M 0 0 L 90 -150 L 120 -170" stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
            <path d="M 0 0 L 90 -150 L 120 -170" stroke="#E5484D" strokeWidth={8} strokeLinecap="round" fill="none" />
            <rect x={96} y={-210} width={66} height={44} rx={8} fill="#0E2A3C" stroke={INK} strokeWidth={5} />
            <text x={129} y={-180} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={18} fill="#7FE8FF">km</text>
            <g transform={`rotate(${sp * 0.5})`}><rect x={-8} y={-8} width={70} height={14} rx={6} fill="#1D2033" /></g>
          </g>
          <rect x={-170} y={YF + 50} width={300} height={22} rx={8} fill="#3A3F58" stroke={INK} strokeWidth={5} />
        </g>
      );
    }
    case 'mat':
      return (
        <g transform={`translate(${x} 0)`}>
          <path d={`M -200 ${YF + 70} L 200 ${YF + 70} L 240 ${YF + 150} L -240 ${YF + 150} Z`} fill="#4EC1B0" stroke={INK} strokeWidth={5} />
          <path d={`M -170 ${YF + 90} L 170 ${YF + 90}`} stroke="#fff" strokeWidth={3} opacity={0.4} />
          {[-80, 80].map((d, i) => <g key={i}><rect x={d - 36} y={YF + 40} width={72} height={20} rx={8} fill="#3A4260" stroke={INK} strokeWidth={4} /><rect x={d - 50} y={YF + 30} width={20} height={40} rx={6} fill="#6C7794" stroke={INK} strokeWidth={4} /><rect x={d + 30} y={YF + 30} width={20} height={40} rx={6} fill="#6C7794" stroke={INK} strokeWidth={4} /></g>)}
        </g>
      );
    case 'suits': {
      const w = f.w ?? 520;
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={170} width={w} height={YF + 60 - 170} rx={10} fill={pal.wall2} stroke={INK} strokeWidth={6} opacity={0.9} />
          <rect x={-w / 2 + 20} y={226} width={w - 40} height={12} fill="#8E98AE" stroke={INK} strokeWidth={3} />
          {[-0.28, 0, 0.28].map((q, i) => <g key={i}><circle cx={w * q} cy={206} r={30} fill="#BFE6FF" fillOpacity={0.35} stroke="#E8F4FF" strokeWidth={6} /></g>)}
          {[-0.3, 0, 0.3].slice(0, f.n ?? 3).map((q, i) => <Suit key={i} x={w * q} y={430} sc={0.85} />)}
        </g>
      );
    }
    case 'bench':
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-220} y={YF - 40} width={440} height={36} rx={8} fill="#C99A5E" stroke={INK} strokeWidth={6} />
          {[-190, 190].map((d, i) => <rect key={i} x={d - 12} y={YF - 4} width={24} height={110} fill="#8A6244" stroke={INK} strokeWidth={5} />)}
          {[-120, -40, 60, 140].map((d, i) => <g key={i} transform={`translate(${d} ${YF - 40})`}><path d="M -22 0 L -22 -50 L 14 -50 L 14 -22 L 42 -22 L 42 0 Z" fill="#FF7A2E" stroke={INK} strokeWidth={4} strokeLinejoin="round" /></g>)}
        </g>
      );
    case 'medcab':
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-150} y={190} width={300} height={420} rx={14} fill="#F4F1EA" stroke={INK} strokeWidth={7} />
          <rect x={-134} y={206} width={130} height={388} rx={8} fill="#BFE6FF" fillOpacity={0.4} stroke={INK} strokeWidth={4} />
          <rect x={4} y={206} width={130} height={388} rx={8} fill="#BFE6FF" fillOpacity={0.4} stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((i) => <g key={i}><rect x={-134} y={300 + i * 110} width={268} height={8} fill="#A8B0C0" />{Array.from({ length: 6 }).map((_, j) => <rect key={j} x={-120 + j * 44} y={252 + i * 110} width={22} height={46} rx={8} fill={['#E5484D', '#FFB43A', '#78D07A', '#7FB8F0'][(i + j) % 4]} stroke={INK} strokeWidth={3} />)}</g>)}
          <rect x={-26} y={130} width={52} height={52} rx={8} fill="#E5484D" stroke={INK} strokeWidth={5} />
          <path d="M -14 156 L 14 156 M 0 142 L 0 170" stroke="#fff" strokeWidth={10} />
        </g>
      );
    case 'cot':
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-200} y={YF - 100} width={400} height={50} rx={14} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
          <rect x={-200} y={YF - 130} width={110} height={36} rx={16} fill="#8FD3EA" stroke={INK} strokeWidth={5} />
          {[-170, 170].map((d, i) => <rect key={i} x={d - 8} y={YF - 50} width={16} height={130} fill="#8E98AE" stroke={INK} strokeWidth={4} />)}
          <rect x={-60} y={YF - 150} width={260} height={56} rx={14} fill="#2FA39A" stroke={INK} strokeWidth={5} />
        </g>
      );
    case 'fridge':
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-110} y={280} width={220} height={YF + 80 - 280} rx={14} fill="#DDE6EE" stroke={INK} strokeWidth={7} />
          <rect x={-90} y={300} width={180} height={230} rx={8} fill="#BFE6FF" fillOpacity={0.45} stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((i) => <g key={i}><rect x={-90} y={350 + i * 62} width={180} height={6} fill="#A8B0C0" />{Array.from({ length: 5 }).map((_, j) => <rect key={j} x={-76 + j * 34} y={316 + i * 62} width={16} height={32} rx={6} fill={['#E5484D', '#FFB43A', '#78D07A'][(i + j) % 3]} stroke={INK} strokeWidth={2.5} />)}</g>)}
          <rect x={-90} y={560} width={180} height={150} rx={8} fill="#CBD6E0" stroke={INK} strokeWidth={4} />
          <text x={0} y={262} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill={INK}>SAMPLES</text>
        </g>
      );
    case 'pipes': {
      const w = f.w ?? 700;
      return (
        <g transform={`translate(${x} 0)`}>
          {[260, 330, 400].map((y, i) => <g key={i}><rect x={-w / 2} y={y} width={w} height={26} rx={13} fill={['#C46A3A', '#8E98AE', '#B9C0D0'][i]} stroke={INK} strokeWidth={5} />{[-0.35, 0.05, 0.4].map((q, j) => <rect key={j} x={w * q - 8} y={y - 6} width={16} height={38} fill="#6C7794" stroke={INK} strokeWidth={3} />)}</g>)}
          {[-0.3, 0.1, 0.32].map((q, i) => <g key={i} transform={`translate(${w * q} ${520 + (i % 2) * 40})`}><Wheel r={40} rot={i * 30 + t * 0.2 * (f.a ?? 0)} /><rect x={-8} y={-120} width={16} height={80} fill="#8E98AE" stroke={INK} strokeWidth={4} /></g>)}
          {[-0.42, 0.22].map((q, i) => <g key={i} transform={`translate(${w * q} 460)`}><circle r={44} fill="#F6EFE3" stroke={INK} strokeWidth={6} /><path d={`M 0 0 L ${Math.cos(t * 0.08 + i) * 30} ${Math.sin(t * 0.08 + i) * 30 - 10}`} stroke="#E5484D" strokeWidth={5} /><path d="M -30 20 A 36 36 0 0 0 30 20" fill="none" stroke="#5BE08A" strokeWidth={6} /></g>)}
          <path d={`M ${-w / 2} 600 L ${w / 2} 600`} stroke="#B5503A" strokeWidth={12} />
        </g>
      );
    }
    case 'toolboard': {
      const w = f.w ?? 420;
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2} y={220} width={w} height={340} rx={10} fill="#C99A5E" stroke={INK} strokeWidth={6} />
          {Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={-w / 2 + 30 + (i % 5) * (w - 60) / 4} cy={250 + Math.floor(i / 5) * 80} r={3} fill={INK} opacity={0.4} />)}
          <rect x={-w / 2 + 40} y={250} width={14} height={120} rx={5} fill="#B9C0D0" stroke={INK} strokeWidth={4} />
          <path d={`M ${-w / 2 + 110} 250 l 0 120 M ${-w / 2 + 90} 250 l 40 0`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <circle cx={0} cy={300} r={42} fill="none" stroke="#B9C0D0" strokeWidth={14} />
          <rect x={w / 2 - 110} y={250} width={50} height={120} rx={8} fill="#E5484D" stroke={INK} strokeWidth={4} />
          <rect x={-w / 2 + 40} y={420} width={w - 80} height={14} rx={6} fill="#8A6244" stroke={INK} strokeWidth={3} />
          <path d={`M ${-w / 2 + 60} 440 L ${-w / 2 + 60} 520 M ${-w / 2 + 120} 440 L ${-w / 2 + 120} 520 M ${-w / 2 + 180} 440 L ${-w / 2 + 180} 520`} stroke="#8E98AE" strokeWidth={12} strokeLinecap="round" />
        </g>
      );
    }
    case 'door': {
      const w = f.w ?? 230;
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-w / 2 - 16} y={230} width={w + 32} height={YF - 230 + 6} rx={10} fill={pal.trim} stroke={INK} strokeWidth={6} />
          <rect x={-w / 2} y={246} width={w} height={YF - 246} fill={f.v === 'lit' ? '#FFE8B8' : '#2A1E22'} />
          <path d={`M ${-w / 2} 246 L ${-w / 2 + w * 0.3} 300 L ${-w / 2 + w * 0.3} ${YF - 20} L ${-w / 2} ${YF}`} fill="#000" opacity={0.18} />
          {f.txt ? <text x={0} y={216} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill={INK} letterSpacing={3}>{f.txt}</text> : null}
        </g>
      );
    }
    case 'planmap': {
      const w = f.w ?? 300;
      const h = f.h ?? 200;
      return (
        <g transform={`translate(${x - w / 2} ${f.y ?? 300})`}>
          <rect width={w} height={h} rx={8} fill="#F4E6CB" stroke={INK} strokeWidth={5} />
          {[[16, 16, 110, 70], [136, 16, 70, 70], [216, 16, 70, 70], [16, 100, 70, 80], [96, 100, 110, 80], [216, 100, 70, 80]].map((r, i) => <rect key={i} x={r[0] * w / 300} y={r[1] * h / 200} width={r[2] * w / 300} height={r[3] * h / 200} fill="none" stroke="#B5503A" strokeWidth={3} />)}
          <circle cx={w * 0.62} cy={h * 0.64} r={8} fill="#E5484D" />
          <text x={w * 0.62 + 14} y={h * 0.64 + 6} fontFamily={FONT.hand} fontWeight={700} fontSize={20} fill="#C4281F">you</text>
        </g>
      );
    }
    case 'board': {
      const w = f.w ?? 420;
      const h = f.h ?? 280;
      return (
        <g transform={`translate(${x - w / 2} ${f.y ?? 260})`}>
          <rect width={w} height={h} rx={8} fill="#FBFAF4" stroke="#8E98AE" strokeWidth={10} />
          {f.txt ? <text x={w / 2} y={h * 0.2} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(46, (w - 40) / Math.max(6, f.txt.length) * 1.7)} fill="#2F6EC0">{f.txt}</text> : null}
          {Array.from({ length: 4 }).map((_, i) => <path key={i} d={`M 30 ${h * 0.34 + i * (h * 0.15)} q ${(w - 60) * 0.3} ${(i % 2 ? -8 : 8)} ${(w - 60) * (0.5 + rnd(seed, i) * 0.4)} 0`} stroke={['#E5484D', '#2F6EC0', '#2F9E5A', '#2F6EC0'][i]} strokeWidth={5} fill="none" strokeLinecap="round" />)}
        </g>
      );
    }
    case 'dronepad':
      return (
        <g transform={`translate(${x} 0)`}>
          <ellipse cx={0} cy={YF + 80} rx={150} ry={26} fill="#3A3F58" stroke={INK} strokeWidth={5} />
          <ellipse cx={0} cy={YF + 80} rx={96} ry={16} fill="none" stroke="#FFB347" strokeWidth={5} strokeDasharray="16 10" />
          <g transform={`translate(0 ${YF + 34 - (f.open ?? 0) * 160})`}>
            <path d="M -66 -16 L -22 2 M 66 -16 L 22 2" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={-66} cy={-20} rx={34} ry={7} fill="#E8E0D0" stroke={INK} strokeWidth={3} />
            <ellipse cx={66} cy={-20} rx={34} ry={7} fill="#E8E0D0" stroke={INK} strokeWidth={3} />
            <rect x={-32} y={-8} width={64} height={30} rx={12} fill="#D8DDE8" stroke={INK} strokeWidth={5} />
            <circle cx={0} cy={8} r={9} fill="#1D2033" stroke="#7FE8FF" strokeWidth={3} />
          </g>
        </g>
      );
    case 'crates':
      return (
        <g transform={`translate(${x} 0)`}>
          {[[-90, 0, 160, 110], [80, 20, 130, 90], [-20, -110, 130, 100]].map((c, i) => (
            <g key={i}>
              <rect x={c[0]} y={YF + 50 + c[1] - c[3] + 40} width={c[2]} height={c[3]} fill={['#C99A5E', '#B88850', '#D9A874'][i]} stroke={INK} strokeWidth={5} />
              <path d={`M ${c[0]} ${YF + 90 + c[1] - c[3]} L ${c[0] + c[2]} ${YF + 90 + c[1]}`} stroke={INK} strokeWidth={3} opacity={0.4} />
              <rect x={c[0] + 10} y={YF + 60 + c[1] - c[3] + 40} width={c[2] * 0.5} height={22} fill="#FFFDF4" />
            </g>
          ))}
        </g>
      );
    case 'ribs': {
      const n = f.n ?? 6;
      return (
        <g>
          {Array.from({ length: n }).map((_, i) => <rect key={i} x={x + i * (f.w ?? 520) - 14} y={0} width={28} height={YF + 6} fill={pal.trim} opacity={0.55} />)}
        </g>
      );
    }
    case 'couch':
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-190} y={YF - 190} width={380} height={120} rx={30} fill="#C46A3A" stroke={INK} strokeWidth={6} />
          <rect x={-220} y={YF - 110} width={440} height={90} rx={26} fill="#D9824A" stroke={INK} strokeWidth={6} />
          <rect x={-232} y={YF - 150} width={50} height={130} rx={22} fill="#C46A3A" stroke={INK} strokeWidth={6} />
          <rect x={182} y={YF - 150} width={50} height={130} rx={22} fill="#C46A3A" stroke={INK} strokeWidth={6} />
          <rect x={-70} y={YF - 130} width={70} height={60} rx={14} fill="#FFD27A" stroke={INK} strokeWidth={4} transform="rotate(-8 -35 -100)" />
        </g>
      );
    case 'plant':
      return (
        <g transform={`translate(${x} ${YF})`}>
          <path d="M -26 0 L 26 0 L 20 60 L -20 60 Z" fill="#B5503A" stroke={INK} strokeWidth={5} />
          {[-30, -10, 12, 32].map((d, i) => <path key={i} d={`M 0 0 Q ${d * 1.6} -60 ${d * 2} ${-110 - i * 10}`} stroke="#2E7A34" strokeWidth={9} fill="none" strokeLinecap="round" />)}
          {[-30, -10, 12, 32].map((d, i) => <ellipse key={i} cx={d * 2} cy={-110 - i * 10} rx={20} ry={10} fill="#5BBF5B" stroke="#2E7A34" strokeWidth={3} transform={`rotate(${d * 2} ${d * 2} ${-110 - i * 10})`} />)}
        </g>
      );
    case 'clock':
      return (
        <g transform={`translate(${x} ${f.y ?? 200})`}>
          <circle r={f.r ?? 46} fill="#FFFDF4" stroke={INK} strokeWidth={6} />
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M 0 ${-(f.r ?? 46) + 6} L 0 ${-(f.r ?? 46) + 14}`} stroke={INK} strokeWidth={3} transform={`rotate(${i * 30})`} />)}
          <path d="M 0 0 L 0 -26" stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${(f.a ?? 0) * 0.08 + t * 0.3})`} />
          <path d="M 0 0 L 0 -34" stroke="#E5484D" strokeWidth={3} strokeLinecap="round" transform={`rotate(${t * 3.6})`} />
        </g>
      );
    case 'sink':
      return (
        <g transform={`translate(${x} 0)`}>
          <rect x={-110} y={560} width={220} height={YF + 60 - 560} fill={pal.cab} stroke={INK} strokeWidth={6} />
          <rect x={-120} y={530} width={240} height={32} rx={8} fill="#E8E0D0" stroke={INK} strokeWidth={6} />
          <path d="M -60 530 Q 0 560 60 530" fill="#8FD3EA" stroke={INK} strokeWidth={4} />
          <path d="M 30 530 L 30 470 Q 30 440 0 440 L -10 440" stroke="#B9C0D0" strokeWidth={14} fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};
