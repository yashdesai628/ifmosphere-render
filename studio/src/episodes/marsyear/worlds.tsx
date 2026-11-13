import React from 'react';
import { FONT } from '../../engine';
import { BgSpec, tw, rnd, clamp, lerp } from './lib';
import { Fixture, Fix, YF } from './fixtures';

// The worlds: the habitat rooms (one panorama per room, the camera picks the crop), the sandy Marswalk yard, the
// outside, Houston, space, and the graphics (plan, delay, day grid, timeline, chat).
const INK = '#2A1A14';
const OVX = (W: number, H: number) => ({ x: -W * 0.7, y: -H * 0.7, width: W * 2.4, height: H * 2.4 });

export const PALS = [
  { wall: '#E2A87C', wall2: '#C98A62', floor: '#8A4F36', floor2: '#6E3A2A', trim: '#7A4630', cab: '#B7714A', light: '#FFE3B0', ceil: '#6E3F2E' },
  { wall: '#EED8BC', wall2: '#D8BC98', floor: '#B9714B', floor2: '#98583A', trim: '#9A6A48', cab: '#C98A62', light: '#FFF0CC', ceil: '#8A5A40' },
  { wall: '#C97B56', wall2: '#A9603E', floor: '#6E3A2A', floor2: '#552B20', trim: '#5A3020', cab: '#8E4E34', light: '#FFD9A0', ceil: '#4E281C' },
  { wall: '#EDBB92', wall2: '#D69C72', floor: '#9A5A3E', floor2: '#7E4630', trim: '#7E5038', cab: '#C4784E', light: '#FFE9C0', ceil: '#74402E' },
  { wall: '#B96C50', wall2: '#9A5640', floor: '#5A2F24', floor2: '#44231B', trim: '#4A2A1E', cab: '#7E4630', light: '#FFD0A0', ceil: '#3E2018' },
  { wall: '#F0DFC6', wall2: '#DCC6A4', floor: '#C98660', floor2: '#A86A46', trim: '#A87A56', cab: '#D09A6C', light: '#FFF3D4', ceil: '#9A6A4C' },
];

const PRESETS: Record<string, Fix[]> = {
  kitchen: [
    { k: 'counter', x: 330, w: 600 }, { k: 'shelf', x: 1020, v: 'food', n: 3 }, { k: 'cal', x: 1500, y: 150, w: 260, h: 220, st: 'cal', day: 40 },
    { k: 'table', x: 1750, w: 640, v: 'plates' }, { k: 'door', x: 2350, txt: 'GARDEN' }, { k: 'poster', x: 2750, v: 'beach' },
  ],
  bunk: [
    { k: 'bunk', x: 300, v: '#3A8AD8' }, { k: 'bunk', x: 820, v: '#E5484D' }, { k: 'desk', x: 1500, w: 440, v: 'mail' },
    { k: 'shelf', x: 2100, v: 'books', n: 2 }, { k: 'door', x: 2550, v: 'lit', txt: 'HALL' }, { k: 'plant', x: 2850 },
  ],
  ops: [
    { k: 'console', x: 620, w: 900 }, { k: 'feed', x: 1450, y: 250, w: 420, h: 280, v: 'drone' }, { k: 'feed', x: 1960, y: 250, w: 420, h: 280, v: 'rover' },
    { k: 'desk', x: 1700, w: 460, v: 'graph' }, { k: 'dronepad', x: 2500 }, { k: 'board', x: 2850, txt: 'FLIGHT PLAN' },
  ],
  garden: [
    { k: 'rack', x: 300, v: 'lettuce', n: 1 }, { k: 'rack', x: 900, v: 'tomato' }, { k: 'rack', x: 1500, v: 'pepper' },
    { k: 'table', x: 2150, w: 560, v: 'bowl' }, { k: 'rack', x: 2750, v: 'sprout', grow: 0.45 },
  ],
  gym: [
    { k: 'bike', x: 520 }, { k: 'mat', x: 1150 }, { k: 'poster', x: 1650, v: 'forest', txt: 'a forest (poster)' },
    { k: 'clock', x: 2050, y: 220 }, { k: 'bike', x: 2500 }, { k: 'plant', x: 2900 },
  ],
  airlock: [
    { k: 'hatch', x: 700, r: 190, v: 'amber', txt: 'AIRLOCK' }, { k: 'suits', x: 1550, w: 560 }, { k: 'bench', x: 2250 },
    { k: 'hatch', x: 2800, r: 120, v: 'red' },
  ],
  med: [
    { k: 'medcab', x: 420 }, { k: 'cot', x: 1100 }, { k: 'fridge', x: 1750 }, { k: 'desk', x: 2400, w: 440, v: 'graph' }, { k: 'plant', x: 2850 },
  ],
  work: [
    { k: 'pipes', x: 520, w: 760 }, { k: 'toolboard', x: 1400 }, { k: 'shelf', x: 2050, v: 'supplies', n: 3 }, { k: 'crates', x: 2650 },
  ],
  hall: [
    { k: 'ribs', x: 100, n: 6, w: 520 }, { k: 'door', x: 420, txt: 'KITCHEN' }, { k: 'door', x: 1000, v: 'lit', txt: 'BUNKS' }, { k: 'planmap', x: 1550, y: 300 },
    { k: 'door', x: 2100, txt: 'GYM' }, { k: 'door', x: 2650, v: 'lit', txt: 'GARDEN' },
  ],
  hook: [
    { k: 'ribs', x: 100, n: 6, w: 520 }, { k: 'hatch', x: 1500, y: 430, r: 230, v: 'red', txt: 'SEALED' }, { k: 'door', x: 600, txt: 'KITCHEN' }, { k: 'door', x: 2400, txt: 'BUNKS' },
  ],
  lounge: [
    { k: 'couch', x: 500 }, { k: 'poster', x: 1150, v: 'sunset' }, { k: 'table', x: 1750, w: 640, v: 'cards' }, { k: 'shelf', x: 2400, v: 'books', n: 2 }, { k: 'plant', x: 2850 },
  ],
  empty: [],
};

export const Room: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const k = H / 1080;
  const px = tw(s.px, p, 0);
  const pi = (s.pal ?? 0) % PALS.length;
  const pal = PALS[pi];
  const mir = !!s.mir;
  const base: Fix[] = (PRESETS[s.r ?? 'kitchen'] ?? []).filter((f) => !(s.hide ?? []).includes(f.k)).map((f) => (mir ? { ...f, x: 3000 - f.x } : f));
  const tf = (f: any): Fix => ({ ...f, open: f.open === undefined ? undefined : tw(f.open, p), day: f.day === undefined ? undefined : tw(f.day, p), grow: f.grow === undefined ? undefined : tw(f.grow, p) });
  const list: Fix[] = [...base, ...(s.add ?? [])].map(tf);
  const id = `rm${pi}`;
  const x0 = -W / k - 400;
  const x1 = 3400 + W / k;
  const night = tw(s.dark, p, 0);
  const warm = tw(s.glow, p, 0.5);
  const lampX = (s.lamps ?? [0.2, 0.5, 0.8]) as number[];
  return (
    <g>
      <defs>
        <pattern id={`${id}w`} width={20} height={16} patternUnits="userSpaceOnUse">
          <rect width={20} height={16} fill={pal.wall} />
          <rect y={13} width={20} height={3} fill={pal.wall2} opacity={0.55} />
        </pattern>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.floor} />
          <stop offset="100%" stopColor={pal.floor2} />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="0.5" cy="0" r="0.9">
          <stop offset="0%" stopColor={pal.light} stopOpacity={0.55} />
          <stop offset="100%" stopColor={pal.light} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`scale(${k}) translate(${-px} 0)`}>
        <rect x={x0} y={-600} width={x1 - x0} height={600 + YF} fill={`url(#${id}w)`} />
        <rect x={x0} y={-600} width={x1 - x0} height={670} fill={pal.ceil} />
        <rect x={x0} y={60} width={x1 - x0} height={10} fill={pal.trim} />
        {Array.from({ length: 12 }).map((_, i) => {
          const lx = -200 + i * 380;
          return <rect key={i} x={lx} y={14} width={190} height={26} rx={10} fill={pal.light} opacity={0.55 + warm * 0.4} />;
        })}
        <rect x={x0} y={YF - 190} width={x1 - x0} height={190} fill={pal.wall2} opacity={0.35} />
        <rect x={x0} y={YF - 12} width={x1 - x0} height={22} fill={pal.trim} />
        <rect x={x0} y={YF + 10} width={x1 - x0} height={1080 - YF + 600} fill={`url(#${id}f)`} />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${x0} ${YF + 30 + i * i * 2.4 + i * 12} L ${x1} ${YF + 30 + i * i * 2.4 + i * 12}`} stroke={pal.floor2} strokeWidth={3} opacity={0.5} />)}
        {Array.from({ length: 20 }).map((_, i) => <path key={i} d={`M ${-300 + i * 220} ${YF + 10} L ${-900 + i * 340} 1200`} stroke={pal.floor2} strokeWidth={3} opacity={0.35} />)}
        {list.map((f, i) => <Fixture key={i} f={f} t={t} pal={pal} />)}
        {lampX.map((q, i) => <rect key={i} x={px + q * (W / k) - 160} y={30} width={320} height={YF - 40} fill={`url(#${id}g)`} opacity={0.35 + warm * 0.3} />)}
      </g>
      {s.red ? <rect {...OVX(W, H)} fill="#FF2A2A" opacity={0.12 + 0.1 * Math.sin(t * 0.5)} /> : null}
      {night > 0 ? <rect {...OVX(W, H)} fill="#0E0608" opacity={night} /> : null}
    </g>
  );
};

// ---------- the sandy yard (the simulated Marswalk ground) ----------
const SKY = [['#F7C98C', '#E89A62'], ['#F4B8A0', '#D9806A'], ['#E8A27A', '#B8604A']];
export const Yard: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const k = H / 1080;
  const sk = SKY[(s.pal ?? 0) % SKY.length];
  const hz = tw(s.hz, p, 0.5) * H;
  const px = tw(s.px, p, 0) * k;
  const seed = s.seed ?? 5;
  const trail = Math.floor(tw(s.trail, p, 0));
  return (
    <g>
      <defs>
        <linearGradient id="yd_s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={sk[0]} /><stop offset="100%" stopColor={sk[1]} /></linearGradient>
        <linearGradient id="yd_g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9683E" /><stop offset="100%" stopColor="#8A3A22" /></linearGradient>
      </defs>
      <rect {...OVX(W, H)} y={-H} height={hz + H} fill="url(#yd_s)" />
      {s.sun !== false ? <circle cx={(s.sun?.[0] ?? 0.72) * W} cy={hz - (s.sun?.[1] ?? 0.22) * H} r={46 * k + 20} fill="#FFF0C8" opacity={0.85} /> : null}
      <g transform={`translate(${-px * 0.3} 0)`}>
        {Array.from({ length: 9 }).map((_, i) => {
          const mx = -W * 0.2 + i * W * 0.22 + rnd(seed, i) * 100;
          const mw = 160 + rnd(seed + 1, i) * 260;
          const mh = 40 + rnd(seed + 2, i) * 130;
          return <path key={i} d={`M ${mx} ${hz} L ${mx + mw * 0.2} ${hz - mh} L ${mx + mw * 0.8} ${hz - mh} L ${mx + mw} ${hz} Z`} fill="#C97C54" opacity={0.7} />;
        })}
      </g>
      <rect {...OVX(W, H)} y={hz} height={H * 2} fill="url(#yd_g)" />
      <g transform={`translate(${-px} 0)`}>
        {Array.from({ length: 9 }).map((_, i) => {
          const y = hz + 20 + (i * i * 6 + i * 22) * k;
          return <path key={i} d={`M ${-W} ${y} Q ${W * 0.3} ${y - 20 * k} ${W * 0.7} ${y + 4 * k} T ${W * 2.4} ${y - 6 * k}`} stroke="#E8A070" strokeWidth={(3 + i) * k} fill="none" opacity={0.5} />;
        })}
        {Array.from({ length: s.rocks ?? 9 }).map((_, i) => {
          const rx = rnd(seed + 3, i) * W * 1.6 - W * 0.2;
          const q = rnd(seed + 4, i);
          const ry = hz + 60 * k + q * (H - hz) * 0.9;
          const rs = (14 + q * 52) * k;
          return <path key={i} d={`M ${rx - rs} ${ry} L ${rx - rs * 0.6} ${ry - rs * 0.8} L ${rx + rs * 0.3} ${ry - rs} L ${rx + rs} ${ry - rs * 0.2} L ${rx + rs * 0.8} ${ry} Z`} fill={i % 3 ? '#9A4A30' : '#7A3A28'} stroke={INK} strokeWidth={2.5 * k} />;
        })}
        {Array.from({ length: trail }).map((_, i) => {
          const fx = W * (0.12 + i * 0.075);
          const fy = hz + (H - hz) * (0.62 - 0.15 * Math.sin(i * 0.8)) ;
          return <g key={i} transform={`translate(${fx} ${fy}) scale(${k})`}><ellipse rx={18} ry={9} fill="#6E2E1C" opacity={0.6} /><ellipse cx={0} cy={-18} rx={14} ry={8} fill="#6E2E1C" opacity={0.45} transform={`translate(${i % 2 ? 14 : -14} 0)`} /></g>;
        })}
        {s.flag ? <g transform={`translate(${s.flag[0] * W} ${s.flag[1] * H}) scale(${k})`}><path d="M 0 0 L 0 -200" stroke="#E8E0D0" strokeWidth={8} /><path d={`M 0 -196 q 50 ${-20 + Math.sin(t * 0.3) * 10} 100 0 l 0 70 q -50 ${-20 + Math.sin(t * 0.3) * 10} -100 0 Z`} fill="#FF7A2E" stroke={INK} strokeWidth={4} /></g> : null}
      </g>
      {s.rig !== false ? (
        <g opacity={0.9}>
          <rect x={-W} y={0} width={W * 3} height={36 * k + 6} fill="#3A2218" />
          {Array.from({ length: 6 }).map((_, i) => <g key={i}><rect x={W * (0.06 + i * 0.18) - 28 * k} y={30 * k} width={56 * k} height={30 * k} rx={6 * k} fill="#1A1A22" stroke="#FFE3B0" strokeWidth={3} /><path d={`M ${W * (0.06 + i * 0.18) - 24 * k} ${60 * k} L ${W * (0.06 + i * 0.18) - 120 * k} ${300 * k} L ${W * (0.06 + i * 0.18) + 120 * k} ${300 * k} L ${W * (0.06 + i * 0.18) + 24 * k} ${60 * k} Z`} fill="#FFE3B0" opacity={0.1} /></g>)}
        </g>
      ) : null}
      {s.dust ? <rect {...OVX(W, H)} fill="#E8A070" opacity={s.dust} /> : null}
    </g>
  );
};

// ---------- the outside ----------
export const Outside: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const k = H / 1080;
  const hz = tw(s.hz, p, 0.6) * H;
  const glare = tw(s.glare, p, 0);
  const bx = tw(s.bld, p, 0.15) * W;
  const open = tw(s.hatch, p, 0);
  const sunx = tw(s.sx, p, 0.74) * W;
  const suny = tw(s.sy, p, 0.2) * H;
  return (
    <g>
      <defs>
        <linearGradient id="ot_s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.sky1 ?? '#4FA8F0'} /><stop offset="100%" stopColor={s.sky2 ?? '#CFEBFF'} /></linearGradient>
        <linearGradient id="ot_g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.g1 ?? '#6FBF58'} /><stop offset="100%" stopColor={s.g2 ?? '#3F8A3A'} /></linearGradient>
        <radialGradient id="ot_sun"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="40%" stopColor="#FFF3B0" stopOpacity={0.8} /><stop offset="100%" stopColor="#FFF3B0" stopOpacity={0} /></radialGradient>
      </defs>
      <rect {...OVX(W, H)} y={-H} height={hz + H} fill="url(#ot_s)" />
      <circle cx={sunx} cy={suny} r={260 * k + glare * 700} fill="url(#ot_sun)" />
      <circle cx={sunx} cy={suny} r={54 * k} fill="#FFFFFF" />
      {(s.clouds ?? [[0.2, 0.18, 1], [0.55, 0.1, 0.8], [0.88, 0.26, 1.2]]).map((c: number[], i: number) => <g key={i} transform={`translate(${c[0] * W + Math.sin(t * 0.01 + i) * 10} ${c[1] * H}) scale(${c[2] * k})`}><path d="M -80 20 Q -100 -20 -50 -24 Q -40 -64 10 -54 Q 60 -70 76 -22 Q 110 -14 94 20 Z" fill="#fff" opacity={0.92} /></g>)}
      <rect {...OVX(W, H)} y={hz} height={H * 2} fill="url(#ot_g)" />
      {s.road ? <path d={`M ${W * 0.3} ${H} L ${W * 0.46} ${hz} L ${W * 0.56} ${hz} L ${W * 0.9} ${H} Z`} fill="#D8D2C6" /> : null}
      {s.bld !== undefined ? (
        <g transform={`translate(${bx} ${hz}) scale(${k})`}>
          <path d="M -380 0 L -380 -250 Q -380 -330 -300 -330 L 300 -330 Q 380 -330 380 -250 L 380 0 Z" fill="#E2A87C" stroke={INK} strokeWidth={7} />
          {Array.from({ length: 18 }).map((_, i) => <path key={i} d={`M -380 ${-i * 18} L 380 ${-i * 18}`} stroke="#C98A62" strokeWidth={3} opacity={0.6} />)}
          <circle cx={0} cy={-130} r={110} fill="#0E0A0C" stroke={INK} strokeWidth={8} />
          <rect x={-70} y={-200} width={140} height={140} fill="#FFF3C8" opacity={Math.min(1, 0.2 + open)} />
          <g transform={`translate(${-110 + 0} -130) scale(${Math.max(0.12, 1 - open * 0.88)} 1)`}><circle cx={110} r={104} fill="#C9D0DE" stroke={INK} strokeWidth={7} /><circle cx={110} r={44} fill="none" stroke={INK} strokeWidth={9} /></g>
          <rect x={-100} y={-6} width={200} height={16} fill="#C8C0B2" />
        </g>
      ) : null}
      {s.trees ? [0.62, 0.8, 0.94].map((q, i) => <g key={i} transform={`translate(${q * W} ${hz + 20 * k}) scale(${k * (1 + i * 0.1)})`}><rect x={-12} y={-120} width={24} height={120} fill="#8A5A3A" stroke={INK} strokeWidth={4} /><circle cy={-170} r={78} fill="#4F9F44" stroke={INK} strokeWidth={5} /></g>) : null}
      {s.banner ? <g transform={`translate(${W * 0.5} ${hz - 340 * k})`}><rect x={-300 * k} y={-40 * k} width={600 * k} height={80 * k} rx={10 * k} fill="#FFF8E8" stroke={INK} strokeWidth={5} /><text textAnchor="middle" y={14 * k} fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(44 * k, 420 / Math.max(8, String(s.banner).length) * 2 * k)} fill="#C4281F">{s.banner}</text></g> : null}
      {Array.from({ length: s.crowd ?? 0 }).map((_, i) => {
        const q = (i + 0.5) / (s.crowd as number);
        const fx = W * (0.3 + q * 0.62);
        const fy = hz + (H - hz) * (0.28 + 0.4 * rnd(11, i));
        const sc = k * (0.8 + 0.5 * (fy - hz) / (H - hz));
        const hop = Math.abs(Math.sin(t * 0.3 + i * 1.7)) * 16;
        return (
          <g key={i} transform={`translate(${fx} ${fy - hop}) scale(${sc})`}>
            <circle cy={-80} r={20} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
            <path d="M 0 -60 L 0 4 M -26 -28 L 0 -48 L 26 -28 M 0 4 L -18 52 M 0 4 L 18 52 M -26 -28 L -38 -66 M 26 -28 L 38 -66" stroke={['#FFB347', '#7FD0FF', '#FF6A8A', '#9BE070', '#C9A0FF'][i % 5]} strokeWidth={10} strokeLinecap="round" fill="none" />
          </g>
        );
      })}
      {glare > 0 ? <rect {...OVX(W, H)} fill="#FFFFFF" opacity={glare * 0.85} /> : null}
    </g>
  );
};

// ---------- Houston: campus, the habitat cutaway, a map ----------
const TEXAS: [number, number][] = [[0.3, 0.04], [0.52, 0.04], [0.52, 0.22], [0.75, 0.22], [0.84, 0.46], [0.8, 0.7], [0.64, 0.94], [0.52, 0.8], [0.42, 0.64], [0.24, 0.58], [0.1, 0.46], [0.13, 0.38], [0.3, 0.36]];
export const Houston: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const k = H / 1080;
  const v = s.v ?? 0;
  if (v === 2) {
    const sc = Math.min(W, H) * 0.8;
    const cx = W / 2 - sc * 0.46;
    const cy = H / 2 - sc * 0.5;
    const pts = TEXAS.map((q) => `${cx + q[0] * sc * 1.0 + sc * 0.2},${cy + q[1] * sc}`).join(' ');
    const pin = tw(s.pin, p, 1);
    return (
      <g>
        <rect {...OVX(W, H)} fill="#F4E6CB" />
        {Array.from({ length: 24 }).map((_, i) => <line key={i} x1={-W} x2={W * 2} y1={i * 80 - 160} y2={i * 80 - 160} stroke="#E0CFAE" strokeWidth={2} />)}
        <polygon points={pts} fill="#E2A87C" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <g transform={`translate(${cx + 0.74 * sc + sc * 0.2} ${cy + 0.62 * sc - (1 - pin) * 200}) scale(${k * 1.3 + 0.0})`} opacity={pin}>
          <path d="M 0 0 L -26 -60 A 30 30 0 1 1 26 -60 Z" fill="#E5484D" stroke="#fff" strokeWidth={5} />
          <circle cx={0} cy={-70} r={11} fill="#fff" />
        </g>
        <circle cx={cx + 0.74 * sc + sc * 0.2} cy={cy + 0.62 * sc} r={22 + 16 * Math.sin(t * 0.2)} fill="none" stroke="#E5484D" strokeWidth={4} opacity={0.5} />
      </g>
    );
  }
  if (v === 1) {
    // cutaway: a long low printed habitat with its rooms
    const names = ['KITCHEN', 'BUNKS', 'MED', 'GARDEN', 'GYM', 'WORK', 'AIRLOCK'];
    const vert = H > W;
    const bw = vert ? W * 0.84 : W * 0.86;
    const bh = vert ? H * 0.3 : H * 0.4;
    const x0 = (W - bw) / 2;
    const y0 = H * 0.42 - bh / 2;
    const hi = s.hi ?? -1;
    return (
      <g>
        <rect {...OVX(W, H)} fill="#F1D9B4" />
        <rect {...OVX(W, H)} y={y0 + bh + 20} height={H * 2} fill="#D9A874" />
        <path d={`M ${x0} ${y0 + bh} L ${x0} ${y0 + bh * 0.3} Q ${x0} ${y0} ${x0 + bh * 0.3} ${y0} L ${x0 + bw - bh * 0.3} ${y0} Q ${x0 + bw} ${y0} ${x0 + bw} ${y0 + bh * 0.3} L ${x0 + bw} ${y0 + bh} Z`} fill="#E2A87C" stroke={INK} strokeWidth={8} />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${x0 + 6} ${y0 + bh - i * bh / 14} L ${x0 + bw - 6} ${y0 + bh - i * bh / 14}`} stroke="#C98A62" strokeWidth={2} opacity={0.6} />)}
        {names.map((n, i) => {
          const cw = (bw - 40) / names.length;
          const rx = x0 + 20 + i * cw;
          const on = hi === i;
          return (
            <g key={n}>
              <rect x={rx + 4} y={y0 + bh * 0.28} width={cw - 8} height={bh * 0.64} rx={8} fill={on ? '#FFF3C8' : '#FFFDF4'} fillOpacity={on ? 0.95 : 0.7} stroke={on ? '#E5484D' : INK} strokeWidth={on ? 6 : 3} />
              <text x={rx + cw / 2} y={y0 + bh * 0.62} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(30 * k, cw * 0.16)} fill={INK} transform={vert ? `rotate(-90 ${rx + cw / 2} ${y0 + bh * 0.62})` : undefined}>{n}</text>
            </g>
          );
        })}
        <text x={W / 2} y={y0 + bh + 66 * k} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={Math.min(46 * k, W / 18)} fill="#7A3A22">windows: 0</text>
      </g>
    );
  }
  // campus
  return (
    <g>
      <defs><linearGradient id="hx_s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5FB0F0" /><stop offset="100%" stopColor="#DDF1FF" /></linearGradient></defs>
      <rect {...OVX(W, H)} y={-H} height={H * 0.62 + H} fill="url(#hx_s)" />
      <circle cx={W * 0.78} cy={H * 0.16} r={64 * k} fill="#FFF3B0" />
      <rect {...OVX(W, H)} y={H * 0.62} height={H * 2} fill="#8FC070" />
      <rect {...OVX(W, H)} y={H * 0.76} height={H * 2} fill="#B8B2A6" />
      {[[0.1, 0.5, 340, 150], [0.46, 0.5, 520, 200], [0.86, 0.5, 280, 120]].map((b, i) => <g key={i} transform={`translate(${b[0] * W} ${H * 0.62}) scale(${k})`}><rect x={-(b[2] as number) / 2} y={-(b[3] as number)} width={b[2] as number} height={b[3] as number} fill={['#E8E0D0', '#F4EEDF', '#DCD2BE'][i]} stroke={INK} strokeWidth={5} />{Array.from({ length: 6 }).map((_, j) => <rect key={j} x={-(b[2] as number) / 2 + 20 + j * ((b[2] as number) - 40) / 6} y={-(b[3] as number) + 24} width={((b[2] as number) - 40) / 6 - 14} height={30} fill="#7FB8E0" stroke={INK} strokeWidth={3} />)}</g>)}
      <g transform={`translate(${W * 0.46} ${H * 0.62}) scale(${k})`}><path d="M -140 0 L -140 -70 Q -140 -110 -100 -110 L 100 -110 Q 140 -110 140 -70 L 140 0 Z" fill="#E2A87C" stroke={INK} strokeWidth={6} transform="translate(0 -204)" /></g>
      {s.sign !== false ? <g transform={`translate(${W / 2} ${H * 0.78})`}><rect x={-Math.min(W * 0.4, 440)} y={-34 * k} width={Math.min(W * 0.8, 880)} height={68 * k} rx={10} fill="#1F2A44" stroke="#fff" strokeWidth={4} /><text textAnchor="middle" y={12 * k} fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(30 * k, W / 28)} fill="#fff" letterSpacing={2}>JOHNSON SPACE CENTER · HOUSTON</text></g> : null}
    </g>
  );
};

// ---------- space (the Moon trip and the station) ----------
export const Space: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const k = H / 1080;
  const e = (s.e ?? [0.22, 0.6, 0.3]) as number[];
  const m = (s.m ?? [0.8, 0.34, 0.1]) as number[];
  const ER = e[2] * Math.min(W, H) * 1.4;
  const MR = m[2] * Math.min(W, H) * 1.4;
  const ex = tw(e[0] as any, p) * W;
  const ey = tw(e[1] as any, p) * H;
  const mx = tw(m[0] as any, p) * W;
  const my = tw(m[1] as any, p) * H;
  const prog = tw(s.prog, p, 0);
  return (
    <g>
      <rect {...OVX(W, H)} fill="#0C0C22" />
      {Array.from({ length: 80 }).map((_, i) => <circle key={i} cx={rnd(3, i) * W * 1.4 - W * 0.2} cy={rnd(4, i) * H} r={1 + rnd(5, i) * 2.4} fill="#FFF1D8" opacity={0.3 + 0.7 * rnd(6, i)} />)}
      <circle cx={ex} cy={ey} r={ER * 1.1} fill="#6FC8FF" opacity={0.18} />
      <circle cx={ex} cy={ey} r={ER} fill="#2C7AD0" stroke="#0E2A55" strokeWidth={5} />
      <path d={`M ${ex - ER * 0.5} ${ey - ER * 0.2} q ${ER * 0.2} ${-ER * 0.4} ${ER * 0.5} ${-ER * 0.1} q ${ER * 0.2} ${ER * 0.3} ${ER * 0.05} ${ER * 0.5} q ${-ER * 0.4} ${ER * 0.2} ${-ER * 0.55} ${-ER * 0.4} Z`} fill="#58B05A" />
      <ellipse cx={ex + ER * 0.1} cy={ey - ER * 0.45} rx={ER * 0.5} ry={ER * 0.1} fill="#fff" opacity={0.7} />
      <circle cx={mx} cy={my} r={MR} fill="#F0EAD8" stroke="#8A8470" strokeWidth={5} />
      <circle cx={mx - MR * 0.3} cy={my - MR * 0.2} r={MR * 0.2} fill="#CFC8B0" /><circle cx={mx + MR * 0.34} cy={my + MR * 0.28} r={MR * 0.15} fill="#CFC8B0" />
      {s.iss ? (
        <g>
          <ellipse cx={ex} cy={ey} rx={ER * 1.35} ry={ER * 0.42} fill="none" stroke="#FFD27A" strokeWidth={3} strokeDasharray="10 10" transform={`rotate(-18 ${ex} ${ey})`} />
          <g transform={`translate(${ex + Math.cos(t * 0.03) * ER * 1.35 * Math.cos(-0.314) - Math.sin(t * 0.03) * ER * 0.42 * Math.sin(-0.314)} ${ey + Math.cos(t * 0.03) * ER * 1.35 * Math.sin(-0.314) + Math.sin(t * 0.03) * ER * 0.42 * Math.cos(-0.314)}) scale(${k * 0.5})`}>
            <rect x={-130} y={-18} width={72} height={36} fill="#3A66C4" stroke={INK} strokeWidth={4} /><rect x={58} y={-18} width={72} height={36} fill="#3A66C4" stroke={INK} strokeWidth={4} />
            <rect x={-58} y={-8} width={116} height={16} fill="#B9C0D0" stroke={INK} strokeWidth={4} /><rect x={-22} y={-30} width={44} height={60} rx={8} fill="#E8E0D0" stroke={INK} strokeWidth={5} />
          </g>
        </g>
      ) : null}
      {s.loop ? (
        <g>
          <path d={`M ${ex + ER} ${ey - ER * 0.2} C ${(ex + mx) / 2} ${ey - H * 0.3} ${mx - MR * 2.6} ${my - MR * 2.2} ${mx - MR * 1.4} ${my - MR * 1.4} C ${mx + MR * 0.2} ${my - MR * 2.2} ${mx + MR * 2.2} ${my - MR * 0.6} ${mx + MR * 1.0} ${my + MR * 1.2} C ${mx - MR * 0.6} ${my + MR * 2.4} ${(ex + mx) / 2} ${ey + H * 0.2} ${ex + ER * 0.6} ${ey + ER * 0.8}`} fill="none" stroke="#FFD27A" strokeWidth={5} strokeDasharray="16 12" />
          {prog > 0 ? <g transform={`translate(${lerp(ex + ER, mx - MR * 1.4, clamp(prog))} ${lerp(ey - ER * 0.2, my - MR * 1.4, clamp(prog)) - Math.sin(clamp(prog) * 3.14) * H * 0.18}) scale(${k * 0.55}) rotate(60)`}><path d="M 0 -80 Q 34 -30 30 40 L -30 40 Q -34 -30 0 -80 Z" fill="#F1F4FA" stroke={INK} strokeWidth={5} /><circle cx={0} cy={-18} r={13} fill="#7FD0FF" stroke={INK} strokeWidth={4} /></g> : null}
        </g>
      ) : null}
    </g>
  );
};

// ---------- graphics ----------
const Chat: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const u = Math.min(W, H) / 1080;
  const msgs = (s.msgs ?? []) as { f: string; t: string }[];
  const n = Math.floor(tw(s.n, p, msgs.length) + 0.001);
  const pw = Math.min(W * 0.84, 900 * u + 200);
  const ph = H * 0.84;
  const x0 = (W - pw) / 2;
  const y0 = H * 0.08;
  return (
    <g>
      <rect {...OVX(W, H)} fill={s.bg ?? '#2A1810'} />
      <rect x={x0} y={y0} width={pw} height={ph} rx={36 * u + 8} fill="#FFF8EE" stroke={INK} strokeWidth={8} />
      <rect x={x0} y={y0} width={pw} height={120 * u + 20} rx={36 * u + 8} fill="#FF7A2E" stroke={INK} strokeWidth={8} />
      <circle cx={x0 + 70 * u + 10} cy={y0 + 60 * u + 10} r={34 * u + 4} fill="#FFE2B8" stroke={INK} strokeWidth={4} />
      <text x={x0 + 130 * u + 24} y={y0 + 76 * u + 10} fontFamily={FONT.title} fontWeight={800} fontSize={44 * u + 4} fill="#fff">{s.to ?? 'MUM'}</text>
      {msgs.slice(0, n).map((m, i) => {
        const me = m.f === 'me';
        const bw = Math.min(pw * 0.78, m.t.length * 26 * u + 80);
        const bh = 78 * u + 10;
        const y = y0 + 150 * u + 30 + i * (bh + 26 * u);
        return (
          <g key={i}>
            <rect x={me ? x0 + pw - bw - 30 : x0 + 30} y={y} width={bw} height={bh} rx={bh / 2} fill={me ? '#FF7A2E' : '#E8DCC8'} stroke={INK} strokeWidth={4} />
            <text x={(me ? x0 + pw - bw - 30 : x0 + 30) + bw / 2} y={y + bh / 2 + 13 * u} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={Math.min(40 * u + 4, (bw - 40) / Math.max(4, m.t.length) * 1.7)} fill={me ? '#fff' : INK}>{m.t}</text>
          </g>
        );
      })}
      {s.typing ? (
        <g transform={`translate(${x0 + 30} ${y0 + 150 * u + 30 + n * (78 * u + 10 + 26 * u)})`}>
          <rect width={130 * u + 30} height={78 * u + 10} rx={(78 * u + 10) / 2} fill="#E8DCC8" stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((i) => <circle key={i} cx={(130 * u + 30) * (0.28 + i * 0.22)} cy={(78 * u + 10) / 2 + Math.sin(t * 0.4 + i * 1.2) * 8} r={10 * u + 2} fill={INK} />)}
        </g>
      ) : null}
    </g>
  );
};

const Info: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const viz = s.viz as string;
  const u = Math.min(W, H) / 1080;
  const vert = H > W;
  const bgc = s.bg ?? '#3A1E16';
  const base = <rect {...OVX(W, H)} fill={bgc} />;
  if (viz === 'chat') return <Chat s={s} W={W} H={H} t={t} p={p} />;
  if (viz === 'plan') {
    const names = ['KITCHEN', 'BUNKS', 'MED', 'GARDEN', 'GYM', 'WORK', 'AIRLOCK', 'SANDY YARD'];
    const cols = vert ? 2 : 4;
    const rows = vert ? 4 : 2;
    const bw = vert ? W * 0.86 : W * 0.88;
    const bh = vert ? H * 0.6 : H * 0.62;
    const x0 = (W - bw) / 2;
    const y0 = vert ? H * 0.2 : H * 0.2;
    const cw = bw / cols;
    const ch = bh / rows;
    const dotP = tw(s.dot, p, 0);
    const order = [0, 1, 2, 3, 7, 6, 5, 4];
    const cell = (i: number) => (vert ? { c: i % 2, r: Math.floor(i / 2) } : { c: i % 4, r: Math.floor(i / 4) });
    const centers = order.map((i) => { const q = cell(i); return { x: x0 + (q.c + 0.5) * cw, y: y0 + (q.r + 0.5) * ch }; });
    const seg = clamp(dotP) * (centers.length - 1);
    const a = Math.floor(seg);
    const b = Math.min(centers.length - 1, a + 1);
    const dx = lerp(centers[a].x, centers[b].x, seg - a);
    const dy = lerp(centers[a].y, centers[b].y, seg - a);
    const hi = s.hi ?? -1;
    return (
      <g>
        {base}
        {Array.from({ length: 30 }).map((_, i) => <line key={i} x1={-W} x2={W * 2} y1={i * 70 - 100} y2={i * 70 - 100} stroke="#5A3228" strokeWidth={1.5} opacity={0.6} />)}
        {names.map((n, i) => {
          const q = cell(i);
          const yard = i === 7;
          const on = hi === i;
          return (
            <g key={n}>
              <rect x={x0 + q.c * cw + 6} y={y0 + q.r * ch + 6} width={cw - 12} height={ch - 12} rx={10} fill={on ? '#FFB347' : '#FFF1D0'} fillOpacity={on ? 0.3 : 0.08} stroke={yard ? '#FF7A2E' : '#FFD6A0'} strokeWidth={on ? 7 : 4} strokeDasharray={yard ? '16 10' : undefined} />
              <text x={x0 + (q.c + 0.5) * cw} y={y0 + (q.r + 0.5) * ch + 10 * u} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(30 * u + 6, cw / 9)} fill={on ? '#FFE9C0' : '#FFD6A0'}>{n}</text>
            </g>
          );
        })}
        {s.win !== false ? names.slice(0, 7).map((n, i) => { const q = cell(i); const wx = x0 + (q.c + 0.5) * cw; const wy = y0 + q.r * ch - (q.r === 0 ? 24 : -ch + 24); return null; }) : null}
        {s.dot !== undefined ? <g><circle cx={dx} cy={dy} r={26 * u + 6} fill="#FF7A2E" stroke="#fff" strokeWidth={5} /><circle cx={dx} cy={dy} r={46 * u + 10} fill="none" stroke="#FF7A2E" strokeWidth={4} opacity={0.5 + 0.3 * Math.sin(t * 0.3)} /></g> : null}
      </g>
    );
  }
  if (viz === 'delay') {
    const m = tw(s.m, p, 0);
    const m2 = tw(s.m2, p, -1);
    const ex = vert ? W * 0.5 : W * 0.16;
    const ey = vert ? H * 0.26 : H * 0.5;
    const mx = vert ? W * 0.5 : W * 0.84;
    const my = vert ? H * 0.74 : H * 0.5;
    const R = Math.min(W, H) * 0.13;
    const at = (q: number) => ({ x: lerp(ex, mx, q), y: lerp(ey, my, q) - Math.sin(q * 3.14) * R * 0.6 * (vert ? 0 : 1) });
    const E = at(clamp(m));
    return (
      <g>
        {base}
        {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={rnd(3, i) * W} cy={rnd(4, i) * H} r={1 + rnd(5, i) * 2} fill="#FFF1D8" opacity={0.5} />)}
        <path d={`M ${ex} ${ey} L ${mx} ${my}`} stroke="#FFD6A0" strokeWidth={5} strokeDasharray="14 14" opacity={0.7} />
        <circle cx={ex} cy={ey} r={R} fill="#2C7AD0" stroke="#0E2A55" strokeWidth={5} />
        <path d={`M ${ex - R * 0.5} ${ey - R * 0.2} q ${R * 0.2} ${-R * 0.4} ${R * 0.5} ${-R * 0.1} q ${R * 0.2} ${R * 0.3} ${R * 0.05} ${R * 0.5} q ${-R * 0.4} ${R * 0.2} ${-R * 0.55} ${-R * 0.4} Z`} fill="#58B05A" />
        <circle cx={mx} cy={my} r={R * 0.8} fill="#D8582E" stroke="#7A2A18" strokeWidth={5} />
        <circle cx={mx - R * 0.2} cy={my - R * 0.1} r={R * 0.18} fill="#B03E20" /><circle cx={mx + R * 0.25} cy={my + R * 0.25} r={R * 0.12} fill="#B03E20" />
        {m > 0 && m < 1.01 ? <g transform={`translate(${E.x} ${E.y}) scale(${u * 0.9 + 0.1})`}><rect x={-34} y={-22} width={68} height={44} rx={6} fill="#FFF8E8" stroke={INK} strokeWidth={4} /><path d="M -34 -20 L 0 4 L 34 -20" fill="none" stroke={INK} strokeWidth={4} /></g> : null}
        {m2 >= 0 ? (() => { const B = at(1 - clamp(m2)); return <g transform={`translate(${B.x} ${B.y}) scale(${u * 0.9 + 0.1})`}><rect x={-34} y={-22} width={68} height={44} rx={6} fill="#FFD6A0" stroke={INK} strokeWidth={4} /><path d="M -34 -20 L 0 4 L 34 -20" fill="none" stroke={INK} strokeWidth={4} /></g>; })() : null}
      </g>
    );
  }
  if (viz === 'dots') {
    const cols = vert ? 14 : 27;
    const rows = 378 / cols;
    const gw = vert ? W * 0.86 : W * 0.86;
    const gh = vert ? H * 0.5 : H * 0.62;
    const gx = (W - gw) / 2;
    const gy = vert ? H * 0.26 : H * 0.2;
    const fill = Math.floor(clamp(tw(s.fill, p, 0)) * 378);
    const sp = Math.min(gw / cols, gh / rows);
    return (
      <g>
        {base}
        {Array.from({ length: 378 }).map((_, i) => {
          const x = gx + (i % cols + 0.5) * sp + (gw - cols * sp) / 2;
          const y = gy + (Math.floor(i / cols) + 0.5) * sp;
          const on = i < fill;
          return <circle key={i} cx={x} cy={y} r={sp * 0.34} fill={on ? (i === fill - 1 ? '#FFE27A' : '#FF7A2E') : '#5A3228'} opacity={on ? 1 : 0.8} />;
        })}
      </g>
    );
  }
  if (viz === 'timeline') {
    const m = clamp(tw(s.m, p, 0));
    const x0 = W * 0.1;
    const x1 = W * 0.9;
    const y = H * (vert ? 0.5 : 0.52);
    return (
      <g>
        {base}
        {s.first ? <g><path d={`M ${x0 - (vert ? 0 : 0)} ${y} L ${x0} ${y}`} /><circle cx={x0 - 0} cy={y - 150 * u} r={14} fill="#8A6A58" /><text x={x0} y={y - 190 * u} fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(30 * u + 4, W / 30)} fill="#C9A890">6 JUL 2024</text><text x={x0} y={y - 156 * u} fontFamily={FONT.ui} fontSize={Math.min(24 * u + 4, W / 38)} fill="#C9A890">FIRST MISSION ENDED</text><path d={`M ${x0} ${y - 140 * u} L ${x0} ${y}`} stroke="#8A6A58" strokeWidth={4} strokeDasharray="8 8" /></g> : null}
        <rect x={x0} y={y - 10} width={x1 - x0} height={20} rx={10} fill="#5A3228" />
        <rect x={x0} y={y - 10} width={(x1 - x0) * m} height={20} rx={10} fill="#FF7A2E" />
        <circle cx={x0} cy={y} r={22} fill="#FFE27A" stroke="#fff" strokeWidth={4} />
        <circle cx={x1} cy={y} r={22} fill={m >= 0.99 ? '#5BE08A' : '#5A3228'} stroke="#fff" strokeWidth={4} />
        <circle cx={x0 + (x1 - x0) * m} cy={y} r={16} fill="#FF7A2E" stroke="#fff" strokeWidth={5} />
        <text x={x0} y={y + 80 * u} fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(30 * u + 4, W / 30)} fill="#FFD6A0">19 OCT 2025</text>
        <text x={x1} y={y + 80 * u} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(30 * u + 4, W / 30)} fill="#FFD6A0">31 OCT 2026</text>
        <text x={(x0 + x1) / 2} y={y + 150 * u} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(64 * u + 4, W / 14)} fill="#FFF1D0">378 DAYS</text>
      </g>
    );
  }
  if (viz === 'burst') {
    const cx = tw(s.cx, p, 0.5) * W;
    const cy = tw(s.cy, p, 0.5) * H;
    return (
      <g>
        {base}
        {Array.from({ length: 24 }).map((_, i) => <path key={i} d={`M ${cx} ${cy} L ${cx + Math.cos((i / 24) * 6.283 + t * 0.004) * W * 2} ${cy + Math.sin((i / 24) * 6.283 + t * 0.004) * W * 2} L ${cx + Math.cos(((i + 0.5) / 24) * 6.283 + t * 0.004) * W * 2} ${cy + Math.sin(((i + 0.5) / 24) * 6.283 + t * 0.004) * W * 2} Z`} fill={i % 2 ? '#4A2418' : '#5A2C1C'} />)}
        <circle cx={cx} cy={cy} r={Math.min(W, H) * 0.28} fill="#FF7A2E" opacity={0.18} />
      </g>
    );
  }
  return <g>{base}</g>;
};

export const Wash: React.FC<{ s: BgSpec; W: number; H: number }> = ({ s, W, H }) => (
  <g>
    <defs>
      <radialGradient id="wsh" cx={s.cx ?? 0.5} cy={s.cy ?? 0.5} r={0.8}>
        <stop offset="0%" stopColor={s.c1 ?? '#8A3A22'} />
        <stop offset="100%" stopColor={s.c2 ?? '#1A0C08'} />
      </radialGradient>
    </defs>
    <rect {...OVX(W, H)} fill="url(#wsh)" />
  </g>
);

export const World: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  switch (s.k) {
    case 'room': return <Room s={s} W={W} H={H} t={t} p={p} />;
    case 'yard': return <Yard s={s} W={W} H={H} t={t} p={p} />;
    case 'out': return <Outside s={s} W={W} H={H} t={t} p={p} />;
    case 'houston': return <Houston s={s} W={W} H={H} t={t} p={p} />;
    case 'space': return <Space s={s} W={W} H={H} t={t} p={p} />;
    case 'info': return <Info s={s} W={W} H={H} t={t} p={p} />;
    case 'split': {
      const v = H > W;
      const w2 = v ? W : W / 2;
      const h2 = v ? H / 2 : H;
      return (
        <g>
          <defs>
            <clipPath id="spA"><rect x={0} y={0} width={w2} height={h2} /></clipPath>
            <clipPath id="spB"><rect x={0} y={0} width={w2} height={h2} /></clipPath>
          </defs>
          <g clipPath="url(#spA)"><World s={s.a} W={w2} H={h2} t={t} p={p} /></g>
          <g transform={`translate(${v ? 0 : W / 2} ${v ? H / 2 : 0})`}><g clipPath="url(#spB)"><World s={s.b} W={w2} H={h2} t={t} p={p} /></g></g>
          <rect x={v ? 0 : W / 2 - 6} y={v ? H / 2 - 6 : 0} width={v ? W : 12} height={v ? 12 : H} fill="#FFF1D0" />
        </g>
      );
    }
    default: return <Wash s={s} W={W} H={H} />;
  }
};
export { lerp };
