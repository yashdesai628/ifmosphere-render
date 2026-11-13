import React from 'react';
import { FONT } from '../../engine';
import { rnd } from './lib';

// The day counter, in eight faces. Each draws in a local box (0,0)-(w,h); the same faces hang on walls in the worlds and
// pop up as overlays, so "DAY n" never looks the same twice.
const INK = '#1D2033';
const pad3 = (n: number) => String(n).padStart(3, '0');

export const CalFace: React.FC<{ st: string; day: number; w: number; h: number; sub?: string; v?: number; t?: number }> = ({ st, day, w, h, sub, v = 0, t = 0 }) => {
  const n = Math.round(day);
  const sf = Math.min(w / 380, h / 330);
  switch (st) {
    case 'cal': {
      const cols = 7;
      const rows = 5;
      const cw = (w - 40) / cols;
      const ch = (h * 0.5 - 14) / rows;
      return (
        <g>
          <rect width={w} height={h} rx={14} fill="#FFFDF4" stroke={INK} strokeWidth={6} />
          <rect width={w} height={h * 0.34} rx={14} fill="#E5484D" stroke={INK} strokeWidth={6} />
          <text x={w / 2} y={h * 0.105} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={18 * sf} fill="#FFF1D0" letterSpacing={3}>{sub ?? 'MARS YEAR'}</text>
          <text x={w / 2} y={h * 0.295} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(72 * sf, h * 0.18, (w - 40) / (String(n).length + 4) * 1.45)} fill="#FFFFFF">DAY {n}</text>
          {Array.from({ length: cols * rows }).map((_, i) => {
            const x = 20 + (i % cols) * cw;
            const y = h * 0.4 + Math.floor(i / cols) * ch;
            const done = i < n % 36;
            return (
              <g key={i}>
                <rect x={x + 3} y={y + 3} width={cw - 6} height={ch - 6} rx={3} fill="none" stroke="#C9BFA8" strokeWidth={2} />
                {done ? <path d={`M ${x + 8} ${y + 8} L ${x + cw - 8} ${y + ch - 8} M ${x + cw - 8} ${y + 8} L ${x + 8} ${y + ch - 8}`} stroke="#E5484D" strokeWidth={4} strokeLinecap="round" /> : null}
              </g>
            );
          })}
        </g>
      );
    }
    case 'flip': {
      const digits = pad3(n).split('');
      const dw = (w - 60) / 3;
      return (
        <g>
          <rect width={w} height={h} rx={20} fill="#2A2530" stroke={INK} strokeWidth={6} />
          <text x={w / 2} y={h * 0.2} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26 * sf} fill="#FFB347" letterSpacing={6}>DAY</text>
          {digits.map((d, i) => {
            const x = 20 + i * (dw + 10);
            return (
              <g key={i} transform={`translate(${x} ${h * 0.3})`}>
                <rect width={dw} height={h * 0.6} rx={12} fill="#F4EEDF" stroke={INK} strokeWidth={4} />
                <rect y={h * 0.3 - 3} width={dw} height={6} fill="#2A2530" />
                <text x={dw / 2} y={h * 0.44} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(h * 0.5, dw * 1.15)} fill={INK}>{d}</text>
              </g>
            );
          })}
        </g>
      );
    }
    case 'led':
      return (
        <g>
          <rect width={w} height={h} rx={16} fill="#150C0C" stroke="#5A4A4A" strokeWidth={8} />
          <text x={w / 2} y={h * 0.3} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(34 * sf, h * 0.2)} fill="#8A2A22" letterSpacing={8}>MISSION DAY</text>
          <text x={w / 2} y={h * 0.78} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(h * 0.5, w / 3.2)} fill="#FF4A3A" letterSpacing={10} style={{ filter: 'drop-shadow(0 0 14px #FF3A2A)' }}>{pad3(n)}</text>
          <circle cx={w - 30} cy={28} r={7} fill={Math.sin(t * 0.3) > 0 ? '#FF4A3A' : '#5A1E18'} />
        </g>
      );
    case 'chalk': {
      const groups = Math.min(12, Math.ceil((n % 60 || 1) / 5));
      return (
        <g>
          <rect width={w} height={h} rx={10} fill="#27403A" stroke="#8A6A44" strokeWidth={12} />
          <text x={22} y={h * 0.2} fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(60 * sf, h * 0.2)} fill="#F4F1E6">Day {n}</text>
          {Array.from({ length: groups }).map((_, g) => {
            const gx = 26 + (g % 4) * (w - 40) / 4;
            const gy = h * 0.4 + Math.floor(g / 4) * h * 0.2;
            const full = g < groups - 1 || (n % 5 === 0);
            const k = full ? 4 : (n % 5) - 1;
            return (
              <g key={g} stroke="#F4F1E6" strokeWidth={4} strokeLinecap="round" opacity={0.92}>
                {Array.from({ length: Math.max(0, k) }).map((_, i) => <path key={i} d={`M ${gx + i * 14} ${gy} L ${gx + i * 14 + rnd(g, i) * 4} ${gy + h * 0.14}`} />)}
                {full ? <path d={`M ${gx - 8} ${gy + h * 0.1} L ${gx + 54} ${gy + h * 0.03}`} /> : null}
              </g>
            );
          })}
        </g>
      );
    }
    case 'sticky':
      return (
        <g>
          <rect x={14} y={22} width={w - 24} height={h - 24} fill="#E8C934" stroke={INK} strokeWidth={4} transform="rotate(3 10 10)" />
          <rect x={6} y={10} width={w - 24} height={h - 24} fill="#FFE766" stroke={INK} strokeWidth={5} transform="rotate(-2 10 10)" />
          <text x={w / 2 - 6} y={h * 0.4} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(60 * sf, h * 0.2)} fill={INK} transform="rotate(-2 10 10)">DAY</text>
          <text x={w / 2 - 6} y={h * 0.76} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(130 * sf, h * 0.42)} fill="#C4281F" transform="rotate(-2 10 10)">{n}</text>
        </g>
      );
    case 'bar': {
      const q = Math.min(1, n / 378);
      return (
        <g>
          <rect width={w} height={h} rx={26} fill="#2A1A18" fillOpacity={0.9} stroke="#FFB347" strokeWidth={5} />
          <text x={30} y={h * 0.4} fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(60, h * 0.4)} fill="#FFF1D0">DAY {n}</text>
          <text x={w - 30} y={h * 0.4} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(34, h * 0.24)} fill="#FFB347">OF 378</text>
          <rect x={30} y={h * 0.58} width={w - 60} height={h * 0.2} rx={h * 0.1} fill="#4A302A" />
          <rect x={30} y={h * 0.58} width={Math.max(h * 0.2, (w - 60) * q)} height={h * 0.2} rx={h * 0.1} fill="#FF7A2E" />
        </g>
      );
    }
    case 'chain': {
      const links = 9;
      return (
        <g>
          {Array.from({ length: links }).map((_, i) => (
            <g key={i} transform={`translate(${w / 2 + (i % 2 ? 8 : -8)} ${i * (h * 0.075) + 12})`}>
              <ellipse rx={22} ry={13} fill="none" stroke={['#FF7A2E', '#FFD27A', '#E5484D'][i % 3]} strokeWidth={7} />
            </g>
          ))}
          <rect x={w / 2 - 110} y={h * 0.74} width={220} height={h * 0.24} rx={14} fill="#FFFDF4" stroke={INK} strokeWidth={5} />
          <text x={w / 2} y={h * 0.74 + h * 0.17} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(56 * sf, h * 0.17)} fill={INK}>day {n}</text>
        </g>
      );
    }
    case 'screen':
      return (
        <g>
          <rect width={w} height={h} rx={16} fill="#0B1A22" stroke="#5A8A9A" strokeWidth={6} />
          <text x={24} y={h * 0.2} fontFamily={FONT.ui} fontSize={Math.min(24 * sf, h * 0.1)} fill="#7FE8FF">&gt; MISSION CLOCK</text>
          <text x={w / 2} y={h * 0.62} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(96 * sf, h * 0.34)} fill="#CFFFE8">DAY {n}</text>
          <text x={24} y={h * 0.88} fontFamily={FONT.ui} fontSize={Math.min(22 * sf, h * 0.09)} fill="#FFB347">{sub ?? 'STATUS: SEALED'}</text>
        </g>
      );
    default:
      return null;
  }
};
