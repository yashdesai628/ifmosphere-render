import React from 'react';
import { ShotMap, ShotProps, defineEpisode, Timeline } from '../../engine';
import { Spec, FxSpec, tw, rnd, clamp } from './lib';
import { World } from './worlds';
import { PipFig, PropFig } from './pip';
import { TextEl, GaugeEl, LabelEl, CardEl, TitleEl, EndEl } from './overlays';

const Fx: React.FC<{ f: FxSpec; W: number; H: number; t: number; p: number; cx: number; cy: number }> = ({ f, W, H, t, p, cx, cy }) => {
  const n = f.n ?? 14;
  const sp = f.sp ?? 1;
  const c = f.c ?? '#FFFFFF';
  const o = f.o ?? 0.6;
  const seed = f.seed ?? 1;
  const a = ((tw(f.a, p, -90) as number) * Math.PI) / 180;
  switch (f.k) {
    case 'streaks':
      return (
        <g>
          {Array.from({ length: n }).map((_, i) => {
            const len = 120 + rnd(seed, i) * 380;
            const lane = rnd(seed + 1, i) * (W + H) * 1.4 - (W + H) * 0.2;
            const travel = (W + H) * 1.5;
            const d = (((rnd(seed + 2, i) * travel + t * 22 * sp * (0.6 + rnd(seed + 3, i))) % travel) + travel) % travel - travel * 0.25;
            const px = -Math.sin(a) * lane + Math.cos(a) * d;
            const py = Math.cos(a) * lane + Math.sin(a) * d;
            return <line key={i} x1={px} y1={py} x2={px + Math.cos(a) * len} y2={py + Math.sin(a) * len} stroke={c} strokeWidth={2 + rnd(seed + 4, i) * 4} strokeLinecap="round" opacity={o * (0.3 + rnd(seed + 5, i) * 0.7)} />;
          })}
        </g>
      );
    case 'sparks': {
      const k = Math.floor(t / 2);
      return (
        <g>
          {Array.from({ length: n }).map((_, i) => {
            const ang = rnd(seed + k, i) * 6.283;
            const r0 = (f.x ?? 150) * (0.6 + rnd(seed + k + 1, i) * 0.6);
            const r1 = r0 + 30 + rnd(seed + k + 2, i) * 70;
            return <g key={i}><line x1={cx + Math.cos(ang) * r0} y1={cy + Math.sin(ang) * r0} x2={cx + Math.cos(ang) * r1} y2={cy + Math.sin(ang) * r1} stroke={c} strokeWidth={5} strokeLinecap="round" /><circle cx={cx + Math.cos(ang) * r1} cy={cy + Math.sin(ang) * r1} r={5} fill="#FFFFFF" /></g>;
          })}
        </g>
      );
    }
    case 'rings': {
      return (
        <g>
          {Array.from({ length: n }).map((_, i) => {
            const q = ((t * 0.03 * sp + i / n) % 1 + 1) % 1;
            const r = (f.x ?? 700) * (1 - q) + 60;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={3 + (1 - q) * 9} opacity={o * q} />;
          })}
        </g>
      );
    }
    case 'embers':
    case 'dust':
    case 'flakes':
    case 'bubbles':
      return (
        <g>
          {Array.from({ length: n }).map((_, i) => {
            const x = ((rnd(seed, i) * W * 1.3 + t * 2 * sp * (rnd(seed + 1, i) - 0.5) * 3) % (W * 1.3) + W * 1.3) % (W * 1.3) - W * 0.15;
            const y = ((rnd(seed + 2, i) * H * 1.3 - t * 3.5 * sp * (0.4 + rnd(seed + 3, i)) * (f.k === 'flakes' ? -1 : 1)) % (H * 1.3) + H * 1.3) % (H * 1.3) - H * 0.15;
            return <circle key={i} cx={x} cy={y} r={f.k === 'dust' ? 3 : 4 + rnd(seed + 4, i) * 7} fill={c} opacity={o * (0.4 + rnd(seed + 5, i) * 0.6)} />;
          })}
        </g>
      );
    default:
      return null;
  }
};

export const Scene: React.FC<{ spec: Spec; W: number; H: number; t: number; len: number }> = ({ spec, W, H, t, len }) => {
  const p = clamp(t / Math.max(1, len));
  const cam = spec.cam ?? {};
  const z = tw(cam.z, p, 1);
  const cx = tw(cam.x, p, 0) * W;
  const cy = tw(cam.y, p, 0) * H;
  const r = tw(cam.r, p, 0);
  const pip = spec.pip;
  const pcx = pip ? tw(pip.x, p, 0.5) * W : W / 2;
  const pcy = pip ? tw(pip.y, p, 0.5) * H : H / 2;
  const jx = spec.dim ? Math.sin(t * 1.7) * 3 : 0;
  return (
    <g>
      <g transform={`translate(${W / 2} ${H / 2}) rotate(${r}) scale(${z}) translate(${-W / 2 - cx} ${-H / 2 - cy})`}>
        <World s={spec.bg} W={W} H={H} t={t} p={p} />
        {spec.props?.filter((q) => q.o !== -1 && q.k !== 'front').map((q, i) => <PropFig key={`p${i}`} pr={q} W={W} H={H} t={t} p={p} />)}
        {spec.fx?.map((f, i) => <Fx key={`f${i}`} f={f} W={W} H={H} t={t} p={p} cx={pcx} cy={pcy} />)}
        {pip ? <g transform={`translate(${jx} 0)`}><PipFig spec={pip} W={W} H={H} t={t} p={p} gauge={spec.gauge} /></g> : null}
      </g>
      {spec.label ? <LabelEl l={spec.label} W={W} H={H} t={t} /> : null}
      {spec.gauge && spec.gauge.slot !== (undefined as any) ? <GaugeEl g={spec.gauge} W={W} H={H} t={t} p={p} /> : null}
      {spec.texts?.map((tx, i) => <TextEl key={i} tx={tx} W={W} H={H} t={t} />)}
      {spec.card ? <CardEl c={spec.card} W={W} H={H} t={t} /> : null}
      {spec.title ? <TitleEl W={W} H={H} t={t} lines={['WHAT IF YOU', 'FELL INTO JUPITER?']} accent="JUPITER" /> : null}
      {spec.end ? <EndEl W={W} H={H} t={t} stage={spec.end} /> : null}
    </g>
  );
};

export const makeShots = (specs: Record<string, Spec>, W: number, H: number): ShotMap => {
  const m: ShotMap = {};
  for (const id of Object.keys(specs)) {
    const spec = specs[id];
    m[id] = ({ t, len }: ShotProps) => <Scene spec={spec} W={W} H={H} t={t} len={len} />;
  }
  return m;
};
export { defineEpisode };
export type { Timeline };
