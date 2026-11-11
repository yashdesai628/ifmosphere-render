import React from 'react';
import { BgSpec, N, tw, rnd, clamp, lerp } from './lib';

// The worlds: every place the story visits, drawn in code. Each is a function of the shot's clock t and progress p,
// with parameters (palette, seed, camera-ish placement), so the same world can be pictured many different ways.

export const PAL: Record<string, string[]> = {
  jup: ['#EAD6B4', '#C98F5E', '#F4E6CB', '#A9653F', '#DDB98E', '#8E4D34', '#F0DDB9', '#B97D52', '#D8A26E'],
  cool: ['#D6DEE8', '#98AABF', '#EEF2F7', '#6F86A3', '#C3CFDD', '#5A7090', '#E3E9F1', '#8396B0'],
  amber: ['#D49A48', '#8F5A26', '#E6B66C', '#6E4119', '#C98438', '#9D6A30', '#F0C47C', '#7A4A1E'],
  dusk: ['#6E4A5E', '#3C2A3E', '#8A5A60', '#2C2036', '#7A5068', '#4A3046', '#8E6466', '#352A44'],
  rust: ['#E0794A', '#B24A2C', '#F2A070', '#8A2F22', '#D1603A', '#6E2418', '#F5B07E', '#A33C26'],
};
const FALL: Record<string, { top: string; bot: string; wisp: string; part: string }> = {
  amm: { top: '#F4F7FB', bot: '#BCCBE0', wisp: '#FFFFFF', part: '#FFFFFF' },
  hs: { top: '#C58A42', bot: '#4E2D14', wisp: '#F0C27C', part: '#FFCF8A' },
  water: { top: '#6C8CB4', bot: '#16233C', wisp: '#B8D0EA', part: '#D8ECFF' },
  dark: { top: '#3A2230', bot: '#07040C', wisp: '#7A4545', part: '#FF7A55' },
  deep: { top: '#22306A', bot: '#04061A', wisp: '#5A6CC0', part: '#8FB0FF' },
  top: { top: '#1B1740', bot: '#E7B982', wisp: '#FFE2B8', part: '#FFFFFF' },
};

const OVX = (W: number, H: number) => ({ x: -W * 0.7, y: -H * 0.7, w: W * 2.4, h: H * 2.4, width: W * 2.4, height: H * 2.4 });
const Stars: React.FC<{ W: number; H: number; seed: number; n?: number; o?: number }> = ({ W, H, seed, n = 90, o = 0.85 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={-W * 0.5 + rnd(seed, i) * W * 2} cy={-H * 0.5 + rnd(seed + 1, i) * H * 2} r={0.9 + rnd(seed + 2, i) * 2.1} fill="#EAF0FF" opacity={o * (0.4 + 0.6 * rnd(seed + 3, i))} />
    ))}
  </g>
);

/** Wavy stripes between y0 and y1: the belts and zones. flow shifts each stripe's wave the other way to its neighbour. */
const Stripes: React.FC<{ x0: number; x1: number; y0: number; y1: number; pal: string[]; seed: number; amp?: number; wl?: number; flow?: number; minH?: number; maxH?: number; eddies?: number }> = ({ x0, x1, y0, y1, pal, seed, amp = 10, wl = 260, flow = 0, minH = 40, maxH = 130, eddies = 0 }) => {
  const out: React.ReactNode[] = [];
  let y = y0;
  let i = 0;
  const steps = 34;
  while (y < y1 && i < 60) {
    const col = pal[Math.floor(rnd(seed + 7, i) * pal.length)];
    const dir = i % 2 ? 1 : -1;
    const ph = flow * dir * (0.6 + rnd(seed + 3, i)) + rnd(seed + 5, i) * 6;
    const a = amp * (0.5 + rnd(seed + 9, i));
    let d = '';
    for (let k = 0; k <= steps; k++) {
      const x = x0 + ((x1 - x0) * k) / steps;
      const yy = y + Math.sin(x / wl * 6.283 + ph) * a + Math.sin(x / (wl * 0.43) + ph * 1.7) * a * 0.35;
      d += `${k ? 'L' : 'M'} ${x.toFixed(1)} ${yy.toFixed(1)} `;
    }
    d += `L ${x1} ${y1 + 50} L ${x0} ${y1 + 50} Z`;
    out.push(<path key={`s${i}`} d={d} fill={col} />);
    for (let e = 0; e < eddies; e++) {
      const ex = x0 + (((rnd(seed + 11, i * 13 + e) * (x1 - x0) + flow * dir * 38 * (0.5 + rnd(seed + 12, i))) % (x1 - x0)) + (x1 - x0)) % (x1 - x0);
      out.push(<ellipse key={`e${i}_${e}`} cx={ex} cy={y + a * 1.2 + 6} rx={26 + rnd(seed + 13, i * 7 + e) * 70} ry={7 + rnd(seed + 14, i * 5 + e) * 12} fill={pal[(i + e + 2) % pal.length]} opacity={0.55} />);
    }
    y += minH + rnd(seed, i) * (maxH - minH);
    i++;
  }
  return <g>{out}</g>;
};

// ---- the planet seen from orbit: a big banded disc, any size, any angle ----
const Disc: React.FC<{ id: string; cx: number; cy: number; R: number; rot: number; pal: string[]; seed: number; flow: number; spot?: { u: number; v: number; s: number }; light?: number; glow?: string; amp?: number; eddies?: number; minH?: number; maxH?: number }> = ({ id, cx, cy, R, rot, pal, seed, flow, spot, light = -0.35, glow = '#FFC98A', amp, eddies = 3, minH, maxH }) => (
  <g>
    <defs>
      <clipPath id={`${id}c`}><circle cx={cx} cy={cy} r={R} /></clipPath>
      <radialGradient id={`${id}s`} cx={0.5 + light * 0.5} cy={0.45} r={0.62}>
        <stop offset="0%" stopColor="#000" stopOpacity={0} />
        <stop offset="62%" stopColor="#000" stopOpacity={0.05} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.78} />
      </radialGradient>
      <radialGradient id={`${id}g`}>
        <stop offset="90%" stopColor={glow} stopOpacity={0.55} />
        <stop offset="100%" stopColor={glow} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={R * 1.09} fill={`url(#${id}g)`} />
    <g clipPath={`url(#${id}c)`}>
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <Stripes x0={cx - R * 1.3} x1={cx + R * 1.3} y0={cy - R * 1.2} y1={cy + R * 1.2} pal={pal} seed={seed} amp={amp ?? R * 0.012} wl={R * 0.9} flow={flow} minH={minH ?? R * 0.07} maxH={maxH ?? R * 0.2} eddies={eddies} />
        {spot ? (
          <g transform={`translate(${cx + spot.u * R} ${cy + spot.v * R})`}>
            <ellipse rx={R * 0.36 * spot.s} ry={R * 0.21 * spot.s} fill="#C4492C" stroke="#8C2B1C" strokeWidth={R * 0.012} />
            <ellipse rx={R * 0.24 * spot.s} ry={R * 0.13 * spot.s} fill="#D86A3E" />
            <ellipse rx={R * 0.1 * spot.s} ry={R * 0.055 * spot.s} fill="#EE9A6A" />
          </g>
        ) : null}
      </g>
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id}s)`} />
    </g>
  </g>
);

const Limb: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const R = tw(s.R, p, 1.6) * W;
  const cx = tw(s.cx, p, 0.5) * W;
  const cy = tw(s.cy, p, 1.35) * H;
  const o = OVX(W, H);
  return (
    <g>
      <rect {...o} fill={s.sky ?? '#05040E'} />
      {s.stars !== false ? <Stars W={W} H={H} seed={s.seed ?? 3} n={s.sn ?? 110} /> : null}
      {s.haze ? <rect x={o.x} y={cy - R - 40} width={o.w} height={160} fill={s.haze} opacity={0.18} /> : null}
      <Disc id="jf_lb" cx={cx} cy={cy} R={R} rot={tw(s.rot, p, 0)} pal={PAL[s.pal ?? 'jup']} seed={s.seed ?? 3} flow={t * (s.flow ?? 0.05)} spot={s.spot} light={s.light} glow={s.glow} eddies={s.eddies ?? 3} minH={s.minH} maxH={s.maxH} amp={s.amp} />
    </g>
  );
};

/** Flat side-on belts and zones, each flowing its own way (arrows say which). */
const Bands: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const n = s.n ?? 7;
  const o = OVX(W, H);
  const ymin = tw(s.y0, p, 0) * H;
  const bh = (H * (s.span ?? 1.2)) / n;
  const pal = PAL[s.pal ?? 'jup'];
  const rows = Array.from({ length: n }).map((_, i) => ({ y: ymin - H * 0.1 + i * bh, dark: i % 2 === 0, dir: i % 2 ? 1 : -1 }));
  const sp = s.sp ?? 1;
  return (
    <g transform={`rotate(${tw(s.rot, p, 0)} ${W / 2} ${H / 2})`}>
      <rect {...o} fill="#2A1A18" />
      {rows.map((r, i) => {
        const col = r.dark ? pal[(i * 3 + 1) % pal.length] : pal[(i * 2) % pal.length];
        const dim = r.dark ? 0.62 : 1;
        const hi = s.hi === undefined ? true : s.hi === i;
        return (
          <g key={i} opacity={hi ? 1 : 0.55}>
            <rect x={o.x} y={r.y} width={o.w} height={bh + 2} fill={col} />
            <rect x={o.x} y={r.y} width={o.w} height={bh + 2} fill="#000" opacity={1 - dim} />
            {Array.from({ length: 9 }).map((_, e) => {
              const span = W * 1.6;
              const ex = ((((rnd(s.seed ?? 5, i * 9 + e) * span + r.dir * t * (7 + i * 1.3) * sp) % span) + span) % span) - W * 0.3;
              return <ellipse key={e} cx={ex} cy={r.y + bh * (0.25 + rnd(8, i * 9 + e) * 0.5)} rx={50 + rnd(2, i * 9 + e) * 150} ry={bh * 0.09 + rnd(3, i * 9 + e) * 8} fill={pal[(i + e) % pal.length]} opacity={0.65} />;
            })}
            {s.arrows !== false ? (
              <g transform={`translate(${W * (0.5 + r.dir * 0.12 * Math.sin(1))} ${r.y + bh / 2}) scale(${r.dir} 1)`} opacity={hi ? 0.95 : 0.4}>
                <path d={`M -150 0 L 120 0 M 120 0 L 78 -34 M 120 0 L 78 34`} stroke="#FFF6E2" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d={`M -150 0 L 120 0 M 120 0 L 78 -34 M 120 0 L 78 34`} stroke={r.dark ? '#6A2E22' : '#FF8A3D'} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** Falling inside the clouds: wisps rush upward past you, tinted for the layer you are in. */
const Fall: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const F = FALL[s.pal ?? 'amm'];
  const o = OVX(W, H);
  const n = s.n ?? 34;
  const sp = (s.sp ?? 1) * 5;
  const dir = s.dir ?? -1; // -1 upward flow (falling), 1 downward
  const span = H * 1.9;
  const rot = tw(s.rot, p, 0);
  const part = s.part as string | undefined;
  return (
    <g transform={`rotate(${rot} ${W / 2} ${H / 2})`}>
      <defs>
        <linearGradient id="jf_fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={F.top} />
          <stop offset="100%" stopColor={F.bot} />
        </linearGradient>
        <radialGradient id="jf_fw">
          <stop offset="0%" stopColor={F.wisp} stopOpacity={0.9} />
          <stop offset="100%" stopColor={F.wisp} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect {...o} fill="url(#jf_fg)" />
      {Array.from({ length: n }).map((_, i) => {
        const z = 0.25 + rnd(s.seed ?? 4, i) * 0.9;
        const y = ((((rnd((s.seed ?? 4) + 1, i) * span + dir * t * sp * z * 6) % span) + span) % span) - H * 0.45;
        const x = -W * 0.3 + rnd((s.seed ?? 4) + 2, i) * W * 1.6;
        const rx = (s.wide ?? 1) * (120 + rnd((s.seed ?? 4) + 4, i) * 360) * z;
        const ry = (s.thick ?? 1) * (14 + rnd((s.seed ?? 4) + 5, i) * 40) * z;
        return <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="url(#jf_fw)" opacity={(s.dens ?? 0.5) * (0.35 + 0.65 * z)} />;
      })}
      {part ? (
        <g>
          {Array.from({ length: s.pn ?? 26 }).map((_, i) => {
            const z = 0.4 + rnd(21, i) * 1.1;
            const y = ((((rnd(22, i) * span + dir * t * sp * z * 9) % span) + span) % span) - H * 0.45;
            const x = -W * 0.2 + rnd(23, i) * W * 1.4 + Math.sin(t * 0.05 + i) * 12;
            const r = (part === 'drop' ? 9 : part === 'shard' ? 10 : 12) * z * (s.ps ?? 1);
            const a = rnd(24, i) * 360 + t * 3 * (rnd(25, i) - 0.5);
            if (part === 'flake')
              return (
                <path key={i} transform={`translate(${x} ${y}) rotate(${a})`} d={`M 0 ${-r * 2} L ${r * 1.7} ${-r} L ${r * 1.7} ${r} L 0 ${r * 2} L ${-r * 1.7} ${r} L ${-r * 1.7} ${-r} Z`} fill="none" stroke={F.part} strokeWidth={2.4 * z} opacity={0.9} />
              );
            if (part === 'crystal') return <rect key={i} transform={`translate(${x} ${y}) rotate(${a})`} x={-r} y={-r * 1.5} width={r * 2} height={r * 3} fill={F.part} stroke="#7A4A1E" strokeWidth={2} opacity={0.9} />;
            if (part === 'drop') return <path key={i} transform={`translate(${x} ${y})`} d={`M 0 ${-r * 2.2} Q ${r * 1.4} ${r * 0.3} 0 ${r * 1.1} Q ${-r * 1.4} ${r * 0.3} 0 ${-r * 2.2} Z`} fill={F.part} opacity={0.85} />;
            if (part === 'shard') return <path key={i} transform={`translate(${x} ${y}) rotate(${a})`} d={`M 0 ${-r * 2.4} L ${r * 0.7} ${r * 1.3} L ${-r * 0.7} ${r} Z`} fill={F.part} opacity={0.8} />;
            return <circle key={i} cx={x} cy={y} r={r * 0.6} fill={F.part} opacity={0.7} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** The hydrogen ocean: seen from its surface (a horizon with no shore) or from beneath (rays, bubbles). */
const Ocean: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const view = s.view ?? 'surface';
  if (view === 'surface') {
    const hz = tw(s.hz, p, 0.45) * H;
    const rows = 17;
    return (
      <g transform={`rotate(${tw(s.rot, p, 0)} ${W / 2} ${H / 2})`}>
        <defs>
          <linearGradient id="jf_osk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.sky1 ?? '#2A2250'} />
            <stop offset="100%" stopColor={s.sky2 ?? '#F0A060'} />
          </linearGradient>
          <linearGradient id="jf_osea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.sea1 ?? '#6FB8D8'} />
            <stop offset="100%" stopColor={s.sea2 ?? '#0B2450'} />
          </linearGradient>
        </defs>
        <rect x={o.x} y={o.y} width={o.w} height={hz - o.y} fill="url(#jf_osk)" />
        <rect x={o.x} y={hz} width={o.w} height={o.y + o.h - hz} fill="url(#jf_osea)" />
        {s.sun ? <circle cx={s.sun[0] * W} cy={hz - 10} r={s.sun[1]} fill="#FFE9B8" opacity={0.85} /> : null}
        {Array.from({ length: rows }).map((_, i) => {
          const q = (i + 1) / rows;
          const y = hz + (H * 1.3 - hz) * q * q;
          const amp = 3 + q * 26;
          let d = '';
          for (let k = 0; k <= 40; k++) {
            const x = -W * 0.5 + (W * 2 * k) / 40;
            d += `${k ? 'L' : 'M'} ${x} ${y + Math.sin(x / (110 + q * 160) + t * 0.06 * (1 + q) + i) * amp} `;
          }
          return <path key={i} d={d} fill="none" stroke={s.line ?? '#CFF4FF'} strokeWidth={1.5 + q * 4} opacity={0.18 + q * 0.4} />;
        })}
        {Array.from({ length: 24 }).map((_, i) => {
          const q = rnd(31, i);
          return <circle key={i} cx={rnd(32, i) * W} cy={hz + 8 + q * q * (H - hz)} r={2 + q * 7} fill="#EFFFFF" opacity={0.15 + 0.5 * Math.abs(Math.sin(t * 0.07 + i * 1.7))} />;
        })}
        <rect x={o.x} y={hz - 70} width={o.w} height={110} fill={s.sky2 ?? '#F0A060'} opacity={0.18} />
      </g>
    );
  }
  // beneath the surface
  const top = s.deep ? '#0A3A66' : '#2F9CC8';
  return (
    <g transform={`rotate(${tw(s.rot, p, 0)} ${W / 2} ${H / 2})`}>
      <defs>
        <linearGradient id="jf_ou" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.c1 ?? top} />
          <stop offset="55%" stopColor={s.c2 ?? '#0E3C74'} />
          <stop offset="100%" stopColor={s.c3 ?? '#050B24'} />
        </linearGradient>
        <linearGradient id="jf_oray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFF8FF" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#CFF8FF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect {...o} fill="url(#jf_ou)" />
      {Array.from({ length: s.rays ?? 7 }).map((_, i) => {
        const x = W * (0.05 + rnd(41 + (s.seed ?? 0), i) * 0.9);
        const w = 40 + rnd(42, i) * 120;
        return <path key={i} d={`M ${x - w * 0.3} ${-H * 0.1} L ${x + w * 0.3} ${-H * 0.1} L ${x + w * 2 + Math.sin(t * 0.03 + i) * 30} ${H * 1.1} L ${x - w * 2} ${H * 1.1} Z`} fill="url(#jf_oray)" opacity={0.45} />;
      })}
      {Array.from({ length: s.bn ?? 30 }).map((_, i) => {
        const z = 0.4 + rnd(51 + (s.seed ?? 0), i) * 1.1;
        const y = H * 1.15 - ((((rnd(52, i) * H * 1.3 + t * 2.4 * z * (s.up ?? 1)) % (H * 1.3)) + H * 1.3) % (H * 1.3));
        const x = rnd(53, i) * W + Math.sin(t * 0.04 + i) * 18;
        const r = 10 + rnd(54, i) * 34 * z;
        return (
          <g key={i} opacity={0.75}>
            <circle cx={x} cy={y} r={r} fill={s.bub ?? '#9FFAFF'} opacity={0.22} stroke="#E8FFFF" strokeWidth={2.4} />
            <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#fff" opacity={0.9} />
          </g>
        );
      })}
    </g>
  );
};

/** Metallic hydrogen: liquid metal sheen, lightning, magnetic field lines. */
const Metal: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const ang = tw(s.rot, p, -18);
  const seed = Math.floor(t / 3) + (s.seed ?? 0);
  const cx = tw(s.fx, p, 0.5) * W;
  const cy = tw(s.fy, p, 0.5) * H;
  return (
    <g>
      <defs>
        <linearGradient id="jf_mt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={s.m1 ?? '#2A3342'} />
          <stop offset="35%" stopColor={s.m2 ?? '#B9C4D4'} />
          <stop offset="52%" stopColor="#F4F8FF" />
          <stop offset="70%" stopColor={s.m3 ?? '#8A6A58'} />
          <stop offset="100%" stopColor={s.m4 ?? '#1C202C'} />
        </linearGradient>
      </defs>
      <rect {...o} fill="url(#jf_mt)" />
      <g transform={`rotate(${ang} ${W / 2} ${H / 2})`}>
        {Array.from({ length: 12 }).map((_, i) => {
          const y = -H * 0.5 + (i / 12) * H * 2 + Math.sin(t * 0.03 + i) * 12;
          return <path key={i} d={`M ${-W} ${y} Q ${W * 0.3} ${y - 80 - rnd(61, i) * 70} ${W * 0.7} ${y + 30} T ${W * 2} ${y - 20}`} stroke={i % 2 ? '#FFFFFF' : '#2A3342'} strokeWidth={4 + rnd(62, i) * 16} fill="none" opacity={0.28} />;
        })}
      </g>
      {s.field !== false
        ? Array.from({ length: 5 }).map((_, i) => {
            const rx = 150 + i * 150;
            return (
              <ellipse key={i} cx={cx} cy={cy} rx={rx * 1.25} ry={rx * 0.62} fill="none" stroke="#7FE8FF" strokeWidth={5} strokeDasharray="30 22" strokeDashoffset={-t * (3 + i)} opacity={0.55} />
            );
          })
        : null}
      {Array.from({ length: s.arcs ?? 4 }).map((_, i) => {
        const x0 = rnd(seed, i) * W;
        const y0 = rnd(seed + 1, i) * H;
        let x = x0;
        let y = y0;
        let d = `M ${x} ${y}`;
        const a = rnd(seed + 2, i) * 6.28;
        for (let k = 0; k < 9; k++) {
          x += Math.cos(a + (rnd(seed + 3, i * 9 + k) - 0.5) * 2.2) * 70;
          y += Math.sin(a + (rnd(seed + 4, i * 9 + k) - 0.5) * 2.2) * 70;
          d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        return (
          <g key={i}>
            <path d={d} stroke="#9FF4FF" strokeWidth={14} opacity={0.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
};

/** The fuzzy core: a glow with no edge; a floor that dissolves as you reach it. */
const Core: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const glow = tw(s.glow, p, 0.6);
  const floor = tw(s.floor, p, 0);
  const gx = tw(s.gx, p, 0.5) * W;
  const gy = tw(s.gy, p, 0.62) * H;
  return (
    <g>
      <defs>
        <radialGradient id="jf_cg" cx={gx / W} cy={gy / H} r={0.75}>
          <stop offset="0%" stopColor={s.c0 ?? '#FFF1C8'} stopOpacity={1} />
          <stop offset="25%" stopColor={s.c1 ?? '#FFB866'} stopOpacity={0.95} />
          <stop offset="60%" stopColor={s.c2 ?? '#B44A5A'} stopOpacity={0.8} />
          <stop offset="100%" stopColor="#120820" stopOpacity={1} />
        </radialGradient>
        <linearGradient id="jf_cfl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6A5A78" />
          <stop offset="100%" stopColor="#2A2038" />
        </linearGradient>
      </defs>
      <rect {...o} fill="#120820" />
      <rect {...o} fill="url(#jf_cg)" opacity={0.35 + glow * 0.65} />
      {Array.from({ length: 44 }).map((_, i) => {
        const a = rnd(71, i) * 6.28;
        const r = 40 + ((rnd(72, i) * 700 + t * (1 + rnd(73, i) * 2.4)) % 700);
        return <circle key={i} cx={gx + Math.cos(a) * r * 1.3} cy={gy + Math.sin(a) * r * 0.8} r={3 + rnd(74, i) * 9} fill="#FFE2A8" opacity={clamp(1 - r / 740) * 0.7} />;
      })}
      {floor > 0.02 ? (
        <g opacity={floor}>
          <path d={`M ${-W * 0.2} ${H * 0.82} Q ${W * 0.3} ${H * 0.76} ${W * 0.55} ${H * 0.82} T ${W * 1.2} ${H * 0.8} L ${W * 1.2} ${H * 1.3} L ${-W * 0.2} ${H * 1.3} Z`} fill="url(#jf_cfl)" stroke="#CDB8E8" strokeWidth={5} />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M ${rnd(75, i) * W} ${H * 0.86 + rnd(76, i) * 120} l 60 -12 l 50 8`} stroke="#CDB8E8" strokeWidth={3} fill="none" opacity={0.6} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Open space with the planet as a disc (and optionally Earth) for size and scale shots. */
const Space: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const jr = tw(s.jr, p, 0.45) * H;
  const jx = tw(s.jx, p, 0.5) * W;
  const jy = tw(s.jy, p, 0.5) * H;
  const E = s.earth as { x: N; y: N; r: N } | undefined;
  return (
    <g>
      <rect {...o} fill={s.sky ?? '#05040E'} />
      <Stars W={W} H={H} seed={s.seed ?? 8} n={s.sn ?? 120} />
      {s.nebula ? <ellipse cx={W * 0.3} cy={H * 0.3} rx={W * 0.5} ry={H * 0.25} fill={s.nebula} opacity={0.12} transform="rotate(-20 0 0)" /> : null}
      {s.jr !== null && s.jr !== undefined ? <Disc id="jf_sp" cx={jx} cy={jy} R={jr} rot={tw(s.rot, p, 0)} pal={PAL[s.pal ?? 'jup']} seed={s.seed ?? 8} flow={t * 0.05} spot={s.spot} light={s.light ?? -0.4} eddies={2} /> : null}
      {E ? <EarthDisc x={tw(E.x, p) * W} y={tw(E.y, p) * H} r={tw(E.r, p) * H} /> : null}
      {s.moons
        ? (s.moons as number[][]).map((m, i) => <circle key={i} cx={m[0] * W} cy={m[1] * H} r={m[2]} fill={['#E8E0C8', '#D8A858', '#C7C2D2', '#9AA7B8'][i % 4]} />)
        : null}
    </g>
  );
};

export const EarthDisc: React.FC<{ x: number; y: number; r: number; sil?: boolean }> = ({ x, y, r, sil }) => {
  if (sil) return <circle cx={x} cy={y} r={r} fill="#0C1226" stroke="#7FD0FF" strokeWidth={Math.max(3, r * 0.04)} strokeDasharray={`${r * 0.2} ${r * 0.12}`} />;
  return (
    <g>
      <defs>
        <clipPath id={`ec${Math.round(r)}`}><circle cx={x} cy={y} r={r} /></clipPath>
      </defs>
      <circle cx={x} cy={y} r={r * 1.12} fill="#6FC8FF" opacity={0.25} />
      <circle cx={x} cy={y} r={r} fill="#2C7AD0" />
      <g clipPath={`url(#ec${Math.round(r)})`}>
        <path d={`M ${x - r * 0.6} ${y - r * 0.2} q ${r * 0.3} ${-r * 0.5} ${r * 0.6} ${-r * 0.1} q ${r * 0.2} ${r * 0.3} ${r * 0.1} ${r * 0.6} q ${-r * 0.4} ${r * 0.2} ${-r * 0.7} ${-r * 0.5} Z`} fill="#58B05A" />
        <path d={`M ${x + r * 0.2} ${y + r * 0.3} q ${r * 0.4} ${-r * 0.2} ${r * 0.5} ${r * 0.2} q ${-r * 0.1} ${r * 0.4} ${-r * 0.4} ${r * 0.4} Z`} fill="#58B05A" />
        <ellipse cx={x - r * 0.1} cy={y - r * 0.55} rx={r * 0.7} ry={r * 0.12} fill="#fff" opacity={0.7} />
        <circle cx={x} cy={y} r={r} fill="none" stroke="#071230" strokeWidth={r * 0.5} opacity={0.35} transform={`translate(${r * 0.18} ${r * 0.12})`} />
      </g>
    </g>
  );
};

/** The Great Red Spot close up: the storm, streamlines wrapping it, optionally Earth beside it for scale. */
const Grs: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const cx = tw(s.cx, p, 0.5) * W;
  const cy = tw(s.cy, p, 0.5) * H;
  const sc = tw(s.sc, p, 1) * H * 0.34;
  const rot = tw(s.rot, p, 0);
  const pal = PAL[s.pal ?? 'jup'];
  return (
    <g>
      <rect {...o} fill="#3A1E18" />
      <g transform={`rotate(${tw(s.brot, p, 0)} ${W / 2} ${H / 2})`}>
        <Stripes x0={-W} x1={W * 2} y0={-H * 0.8} y1={H * 1.8} pal={pal} seed={s.seed ?? 6} amp={26} wl={420} flow={t * 0.05} minH={80} maxH={200} eddies={2} />
      </g>
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={sc * 2.3} ry={sc * 1.4} fill="#7A2C20" opacity={0.28} />
        <ellipse cx={cx} cy={cy} rx={sc * 1.9} ry={sc * 1.2} fill="#C4492C" stroke="#8C2B1C" strokeWidth={sc * 0.04} />
        <ellipse cx={cx} cy={cy} rx={sc * 1.3} ry={sc * 0.82} fill="#D86A3E" />
        {Array.from({ length: 6 }).map((_, i) => {
          let d = '';
          for (let k = 0; k < 70; k++) {
            const a = k * 0.22 + i * 1.05 + t * 0.012 * (i % 2 ? 1 : -1);
            const r = 0.12 + (k / 70) * 1.05;
            d += `${k ? 'L' : 'M'} ${cx + Math.cos(a) * sc * 1.9 * r} ${cy + Math.sin(a) * sc * 1.2 * r} `;
          }
          return <path key={i} d={d} fill="none" stroke={i % 2 ? '#F7C9A0' : '#8C2B1C'} strokeWidth={sc * 0.04} opacity={0.75} strokeLinecap="round" />;
        })}
        <ellipse cx={cx} cy={cy} rx={sc * 0.28} ry={sc * 0.18} fill="#F2A878" />
      </g>
      {s.earth ? <EarthDisc x={tw(s.earth.x, p) * W} y={tw(s.earth.y, p) * H} r={tw(s.earth.r, p) * H} sil={s.earth.sil} /> : null}
      {s.earth2 ? <EarthDisc x={tw(s.earth2.x, p) * W} y={tw(s.earth2.y, p) * H} r={tw(s.earth2.r, p) * H} sil={s.earth2.sil} /> : null}
    </g>
  );
};

/** A cutaway of the planet: thin cloud skin, hydrogen ocean, metal, fuzzy core. A marker rides the fall. */
const Diagram: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const R = tw(s.R, p, 0.42) * H;
  const cx = tw(s.cx, p, 0.5) * W;
  const cy = tw(s.cy, p, 0.5) * H;
  const depth = tw(s.depth, p, 0); // 0 surface .. 1 centre
  const ang = (s.ang ?? -40) * (Math.PI / 180);
  const mx = cx + Math.cos(ang) * R * (1 - depth);
  const my = cy + Math.sin(ang) * R * (1 - depth);
  const hi = s.hi as string | undefined;
  const ring = (r: number, fill: string, key: string, strokeC = '#0A0614') => <circle key={key} cx={cx} cy={cy} r={R * r} fill={fill} stroke={hi === key ? '#FFFFFF' : strokeC} strokeWidth={hi === key ? 8 : 3} />;
  return (
    <g>
      <rect {...o} fill={s.bg ?? '#0B0A1E'} />
      {s.grid !== false
        ? Array.from({ length: 20 }).map((_, i) => <line key={i} x1={-W} x2={W * 2} y1={i * 80 - 200} y2={i * 80 - 200} stroke="#2A2A5A" strokeWidth={1.4} opacity={0.5} />)
        : null}
      <defs>
        <radialGradient id="jf_dgc">
          <stop offset="0%" stopColor="#FFF4CF" />
          <stop offset="60%" stopColor="#FFC58A" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#FF8A5A" stopOpacity={0} />
        </radialGradient>
      </defs>
      {ring(1, '#E7CFA6', 'clouds')}
      {ring(0.93, '#2F77B8', 'ocean')}
      {ring(0.5, '#B9C4D6', 'metal')}
      <circle cx={cx} cy={cy} r={R * 0.2} fill="url(#jf_dgc)" stroke={hi === 'core' ? '#fff' : 'none'} strokeWidth={8} />
      {[0.5, 0.2].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={R * r} fill="none" stroke="#fff" strokeOpacity={0.3} strokeDasharray="14 14" strokeWidth={3} />
      ))}
      {s.ray !== false ? <line x1={cx + Math.cos(ang) * R} y1={cy + Math.sin(ang) * R} x2={mx} y2={my} stroke="#FF8A3D" strokeWidth={6} strokeDasharray="14 10" /> : null}
      <circle cx={mx} cy={my} r={R * 0.05 + 8} fill="#FF8A3D" stroke="#fff" strokeWidth={5} />
      <circle cx={mx} cy={my} r={R * 0.1 + 14} fill="none" stroke="#FF8A3D" strokeWidth={3} opacity={0.5 + 0.4 * Math.sin(t * 0.3)} />
    </g>
  );
};

/** Pre-dawn rooftop: a skyline, a brightening southeast, Jupiter and Mars as two points. */
const Roof: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const dawn = tw(s.dawn, p, 0.4);
  const hz = tw(s.hz, p, 0.72) * H;
  const jx = tw(s.jx, p, 0.62) * W;
  const jy = tw(s.jy, p, 0.34) * H;
  const gap = tw(s.gap, p, 70);
  const jb = s.jb ?? 1;
  const skyline: React.ReactNode[] = [];
  let x = -W * 0.3;
  let i = 0;
  while (x < W * 1.4) {
    const bw = 70 + rnd(81 + (s.seed ?? 0), i) * 150;
    const bh = (s.bh ?? 1) * (60 + rnd(82 + (s.seed ?? 0), i) * 220);
    skyline.push(<rect key={`b${i}`} x={x} y={hz - bh} width={bw + 2} height={bh + H} fill={i % 2 ? '#0D0B1A' : '#14102A'} />);
    if (rnd(83, i) > 0.55) skyline.push(<rect key={`w${i}`} x={x + bw * 0.3} y={hz - bh + 24} width={14} height={20} fill="#FFD27A" opacity={0.8} />);
    x += bw;
    i++;
  }
  return (
    <g>
      <defs>
        <linearGradient id="jf_rsk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070818" />
          <stop offset="55%" stopColor={dawn > 0.6 ? '#2A2250' : '#10123A'} />
          <stop offset="100%" stopColor={dawn > 0.6 ? '#F08E6A' : '#6A3A5A'} />
        </linearGradient>
        <radialGradient id="jf_rgl">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect {...o} fill="url(#jf_rsk)" />
      <Stars W={W} H={H} seed={9} n={80} o={0.9 - dawn * 0.5} />
      <circle cx={jx} cy={jy} r={46 * jb} fill="url(#jf_rgl)" />
      <circle cx={jx} cy={jy} r={10 * jb} fill="#FFF8E6" />
      <circle cx={jx + gap} cy={jy + gap * 0.18} r={4.5} fill="#FF7B5A" />
      <circle cx={jx + gap} cy={jy + gap * 0.18} r={16} fill="url(#jf_rgl)" opacity={0.35} />
      {s.moons ? (
        <g>
          {[0, 1].map((m) => (
            <circle key={m} cx={jx + gap * 0.5 + (m ? 1 : -1) * (s.mr ?? 40) * 1} cy={jy + gap * 0.09 + 78} r={s.mr ?? 40} fill="none" stroke="#FFE9B8" strokeWidth={4} strokeDasharray="12 9" />
          ))}
        </g>
      ) : null}
      {skyline}
      {s.parapet ? <rect x={-W} y={H * 0.86} width={W * 3} height={H} fill="#07060F" /> : null}
    </g>
  );
};

/** Plain graphic grounds for numbers and diagrams. viz picks the picture. */
const Info: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  const o = OVX(W, H);
  const viz = s.viz as string;
  const bgc = s.bg ?? '#0B0A1E';
  const base = (
    <>
      <rect {...o} fill={bgc} />
      {s.grid !== false
        ? Array.from({ length: 26 }).map((_, i) => <line key={i} x1={-W} x2={W * 2} y1={i * 70 - 200} y2={i * 70 - 200} stroke="#26265A" strokeWidth={1.4} opacity={0.45} />)
        : null}
    </>
  );
  if (viz === 'sizes') {
    const r0 = tw(s.er, p, 0.045) * H;
    const R = r0 * 11;
    const jx = tw(s.jx, p, 0.36) * W;
    const jy = H * 0.52;
    const ex = tw(s.ex, p, 0.82) * W;
    return (
      <g>
        {base}
        <Disc id="jf_si" cx={jx} cy={jy} R={R} rot={-8} pal={PAL.jup} seed={5} flow={t * 0.03} light={-0.3} eddies={2} />
        <EarthDisc x={ex} y={jy + R * 0.2} r={r0} />
        <path d={`M ${jx - R} ${jy + R + 40} L ${jx + R} ${jy + R + 40}`} stroke="#FFE27A" strokeWidth={5} />
        <path d={`M ${ex - r0} ${jy + R * 0.2 + r0 + 40} L ${ex + r0} ${jy + R * 0.2 + r0 + 40}`} stroke="#FFE27A" strokeWidth={5} />
      </g>
    );
  }
  if (viz === 'grid') {
    const R = tw(s.R, p, 0.4) * H;
    const cx = tw(s.cx, p, 0.5) * W;
    const cy = tw(s.cy, p, 0.5) * H;
    const sp = R * 0.0605 * 2;
    const dots: { x: number; y: number }[] = [];
    for (let row = -30; row <= 30; row++) {
      for (let col = -30; col <= 30; col++) {
        const x = cx + col * sp + (row % 2 ? sp / 2 : 0);
        const y = cy + row * sp * 0.866;
        if ((x - cx) ** 2 + (y - cy) ** 2 < (R * 0.97) ** 2) dots.push({ x, y });
      }
    }
    dots.sort((a, b) => a.y - b.y || a.x - b.x);
    const nShow = Math.floor(dots.length * clamp(tw(s.fill, p, 1)));
    return (
      <g>
        {base}
        <circle cx={cx} cy={cy} r={R} fill="#3A2318" stroke="#E7B982" strokeWidth={8} />
        {dots.slice(0, nShow).map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={sp * 0.38} fill={i % 3 ? '#3E8CE0' : '#58B05A'} />
        ))}
      </g>
    );
  }
  if (viz === 'dial') {
    const cx = tw(s.cx, p, 0.5) * W;
    const cy = tw(s.cy, p, 0.62) * H;
    const R = tw(s.R, p, 0.36) * H;
    const needle = tw(s.needle, p, 0.9);
    const a = Math.PI * (1 + needle);
    return (
      <g>
        {base}
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="#2D2D66" strokeWidth={R * 0.2} strokeLinecap="round" />
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a - Math.PI) * -1 * -1 - 0} ${cy}`} fill="none" stroke="none" />
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + Math.cos(a) * R} ${cy + Math.sin(a) * R}`} fill="none" stroke={s.arc ?? '#FF5A4A'} strokeWidth={R * 0.2} strokeLinecap="round" />
        {Array.from({ length: 19 }).map((_, i) => {
          const q = Math.PI * (1 + i / 18);
          return <line key={i} x1={cx + Math.cos(q) * R * 0.78} y1={cy + Math.sin(q) * R * 0.78} x2={cx + Math.cos(q) * R * (i % 3 ? 0.86 : 0.92)} y2={cy + Math.sin(q) * R * (i % 3 ? 0.86 : 0.92)} stroke="#F6EFE3" strokeWidth={i % 3 ? 3 : 6} />;
        })}
        <line x1={cx} y1={cy} x2={cx + Math.cos(a) * R * 0.74} y2={cy + Math.sin(a) * R * 0.74} stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={R * 0.08} fill="#FF8A3D" stroke="#fff" strokeWidth={4} />
      </g>
    );
  }
  if (viz === 'clock') {
    const cx = tw(s.cx, p, 0.5) * W;
    const cy = tw(s.cy, p, 0.5) * H;
    const R = tw(s.R, p, 0.34) * H;
    const turns = tw(s.turns, p, 0);
    const sec = Math.min(0.99, tw(s.sector, p, 0.4)) * Math.PI * 2;
    return (
      <g>
        {base}
        <circle cx={cx} cy={cy} r={R} fill="#14123A" stroke="#F6EFE3" strokeWidth={10} />
        <path d={`M ${cx} ${cy} L ${cx} ${cy - R * 0.92} A ${R * 0.92} ${R * 0.92} 0 ${sec > Math.PI ? 1 : 0} 1 ${cx + Math.sin(sec) * R * 0.92} ${cy - Math.cos(sec) * R * 0.92} Z`} fill="#FF8A3D" opacity={0.55} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={cx + Math.sin(a) * R * 0.84} y1={cy - Math.cos(a) * R * 0.84} x2={cx + Math.sin(a) * R * 0.94} y2={cy - Math.cos(a) * R * 0.94} stroke="#F6EFE3" strokeWidth={8} />;
        })}
        <line x1={cx} y1={cy} x2={cx + Math.sin(turns * 6.283) * R * 0.8} y2={cy - Math.cos(turns * 6.283) * R * 0.8} stroke="#FFE27A" strokeWidth={12} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={14} fill="#FFE27A" />
      </g>
    );
  }
  if (viz === 'compare') {
    const cx = tw(s.cx, p, 0.5) * W;
    const cy = H * 0.5;
    const er = tw(s.er, p, 0.16) * H;
    return (
      <g>
        {base}
        <ellipse cx={cx} cy={cy} rx={er * 2} ry={er * 1.25} fill="#C4492C" stroke="#8C2B1C" strokeWidth={8} />
        <ellipse cx={cx} cy={cy} rx={er * 1.3} ry={er * 0.8} fill="#D86A3E" />
        <EarthDisc x={cx - er} y={cy} r={er} sil={s.sil} />
        {s.two ? <EarthDisc x={cx + er} y={cy} r={er} sil={s.sil} /> : null}
      </g>
    );
  }
  if (viz === 'depthbars') {
    const fill1 = clamp(tw(s.f1, p, 1));
    const fill2 = clamp(tw(s.f2, p, 1));
    const bx = W * 0.5;
    const top = H * 0.2;
    const sc = H * 0.0014 * 0.9;
    return (
      <g>
        {base}
        <rect x={bx - 380} y={top} width={160} height={71 * sc * 10 * fill1} fill="#E7CFA6" stroke="#fff" strokeWidth={4} />
        <rect x={bx + 220} y={top} width={160} height={500 * sc * 10 * 0.2 * fill2 * 1.0 * 4} fill="#C4492C" stroke="#fff" strokeWidth={4} />
        <path d={`M ${bx - 460} ${top} L ${bx + 460} ${top}`} stroke="#7FD0FF" strokeWidth={5} strokeDasharray="16 12" />
      </g>
    );
  }
  return <g>{base}</g>;
};

/** A plain gradient ground (for inserts that need only a tint). */
const Wash: React.FC<{ s: BgSpec; W: number; H: number }> = ({ s, W, H }) => {
  const o = OVX(W, H);
  return (
    <g>
      <defs>
        <radialGradient id="jf_wsh" cx={s.cx ?? 0.5} cy={s.cy ?? 0.5} r={0.8}>
          <stop offset="0%" stopColor={s.c1 ?? '#4A2A6A'} />
          <stop offset="100%" stopColor={s.c2 ?? '#0A0614'} />
        </radialGradient>
      </defs>
      <rect {...o} fill="url(#jf_wsh)" />
    </g>
  );
};

export const World: React.FC<{ s: BgSpec; W: number; H: number; t: number; p: number }> = ({ s, W, H, t, p }) => {
  switch (s.k) {
    case 'limb': return <Limb s={s} W={W} H={H} t={t} p={p} />;
    case 'bands': return <Bands s={s} W={W} H={H} t={t} p={p} />;
    case 'fall': return <Fall s={s} W={W} H={H} t={t} p={p} />;
    case 'ocean': return <Ocean s={s} W={W} H={H} t={t} p={p} />;
    case 'metal': return <Metal s={s} W={W} H={H} t={t} p={p} />;
    case 'core': return <Core s={s} W={W} H={H} t={t} p={p} />;
    case 'space': return <Space s={s} W={W} H={H} t={t} p={p} />;
    case 'grs': return <Grs s={s} W={W} H={H} t={t} p={p} />;
    case 'diagram': return <Diagram s={s} W={W} H={H} t={t} p={p} />;
    case 'roof': return <Roof s={s} W={W} H={H} t={t} p={p} />;
    case 'info': return <Info s={s} W={W} H={H} t={t} p={p} />;
    default: return <Wash s={s} W={W} H={H} />;
  }
};
export { lerp };
