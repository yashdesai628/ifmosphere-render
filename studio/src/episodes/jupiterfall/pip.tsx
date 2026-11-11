import React from 'react';
import { Hero, Look, Pose, basePose, joints, toWorld, FONT } from '../../engine';
import { PipSpec, PropSpec, N, tw, rnd, clamp, lerp, sm } from './lib';
import { EarthDisc } from './worlds';

// Pip in a small spacesuit: the rig in a white suit, plus a helmet, backpack, collar and a wrist device, and the
// poses a person has in free fall. Original character; no resemblance to any existing suit design.

export const SUIT: Look = {
  skin: '#F6EFE3', skinShade: '#E2D3BE', hand: '#FF8A3D', jacket: '#F1F4FA', jacketShade: '#C5CFE2', accent: '#FF8A3D',
  limb: '#E4EAF5', line: '#1D2033', shoe: '#FF8A3D', face: '#1D2033', hair: '#1D2033',
};
export const SUIT_DARK: Look = { ...SUIT, jacket: '#CBD3E4', jacketShade: '#9AA6C0', limb: '#B8C2D8' };

const rot2 = (x: number, y: number, deg: number, cx = 0, cy = 0) => {
  const r = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };
};

/** Pose presets: Partial<Pose> by name, animated by the shot clock t where the action calls for it. */
export const presetPose = (name: string, t: number, ph = 0): Partial<Pose> => {
  const w = Math.sin(t * 0.3 + ph);
  const w2 = Math.sin(t * 0.52 + ph);
  switch (name) {
    case 'stand': return { expr: 'neutral' };
    case 'step': return { yaw: 1, tilt: 7, armR: { a: 70, b: -26 }, armL: { a: 18, b: -20 }, legL: { a: 54, b: -62 }, legR: { a: -8, b: 4 }, expr: 'worried' };
    case 'peek': return { yaw: 0.6, tilt: 10, headTilt: 12, armR: { a: 40, b: -30 }, armL: { a: 22, b: -20 }, legL: { a: 20, b: -20 }, legR: { a: -10, b: 0 }, expr: 'shock' };
    case 'spread': return { armL: { a: 112 + w * 6, b: -8 }, armR: { a: 112 - w * 6, b: -8 }, legL: { a: -32, b: 0 }, legR: { a: 32, b: 0 }, expr: 'shock' };
    case 'streamline': return { armL: { a: 172, b: 0 }, armR: { a: 172, b: 0 }, legL: { a: -4, b: 0 }, legR: { a: 4, b: 0 }, expr: 'happy' };
    case 'tumble': return { armL: { a: 100 + w * 55, b: -20 }, armR: { a: 100 - w2 * 55, b: -20 }, legL: { a: -30 + w2 * 30, b: -28 }, legR: { a: 30 + w * 30, b: -28 }, expr: 'dizzy' };
    case 'flail': return { armL: { a: 140 + w * 30, b: -30 }, armR: { a: 120 - w2 * 30, b: -30 }, legL: { a: -20 + w2 * 20, b: -50 }, legR: { a: 24 + w * 20, b: -40 }, expr: 'shock' };
    case 'hold': return { armL: { a: 22, b: -118 }, armR: { a: 22, b: -118 }, legL: { a: -6, b: -12 }, legR: { a: 6, b: -12 }, expr: 'neutral' };
    case 'hold2': return { armL: { a: 70, b: -105 }, armR: { a: 70, b: -105 }, legL: { a: -14, b: -20 }, legR: { a: 14, b: -20 }, expr: 'worried' };
    case 'weigh': return { armL: { a: 86, b: -26 + w * 6 }, armR: { a: 74, b: -12 - w * 6 }, handR: 'open', legL: { a: -8, b: -10 }, legR: { a: 8, b: -10 }, expr: 'smug' };
    case 'wave': return { armR: { a: 150 + w2 * 18, b: -12 }, armL: { a: 16, b: -10 }, legL: { a: -8, b: -10 }, legR: { a: 8, b: -10 }, expr: 'happy' };
    case 'wave2': return { armL: { a: 150 + w2 * 18, b: -12 }, armR: { a: 150 - w2 * 18, b: -12 }, legL: { a: -12, b: -16 }, legR: { a: 12, b: -16 }, expr: 'happy' };
    case 'point': return { armR: { a: 98, b: -2 }, handR: 'point', armL: { a: 14, b: -12 }, legL: { a: -6, b: -8 }, legR: { a: 6, b: -8 }, expr: 'happy' };
    case 'pointUp': return { armR: { a: 168, b: 0 }, handR: 'point', armL: { a: 14, b: -12 }, expr: 'happy' };
    case 'shrug': return { armL: { a: 64, b: -72 }, armR: { a: 64, b: -72 }, legL: { a: -8, b: -12 }, legR: { a: 8, b: -12 }, expr: 'oops' };
    case 'brace': return { armL: { a: 20, b: -140 }, armR: { a: 20, b: -140 }, legL: { a: -10, b: -50 }, legR: { a: 10, b: -50 }, expr: 'shock', headTilt: -6 };
    case 'reach': return { armR: { a: 168, b: -4 }, armL: { a: 30, b: -20 }, legL: { a: -14, b: -26 }, legR: { a: 14, b: -10 }, tilt: -6, headTilt: -8, expr: 'worried' };
    case 'reachDown': return { armR: { a: 12, b: -4 }, armL: { a: 30, b: -12 }, legL: { a: 38, b: -20 }, legR: { a: 6, b: 0 }, tilt: 14, headTilt: 10, expr: 'worried' };
    case 'stomp': return { legL: { a: 30 + w * 14, b: -10 }, legR: { a: -4, b: 0 }, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 }, tilt: 4, expr: 'oops' };
    case 'swim': return { armL: { a: 90 + w * 50, b: -40 }, armR: { a: 90 + w * 50, b: -40 }, legL: { a: -24 + w2 * 18, b: -48 + w2 * 22 }, legR: { a: 24 - w2 * 18, b: -48 + w2 * 22 }, expr: 'happy' };
    case 'float': return { armL: { a: 56 + w * 10, b: -14 }, armR: { a: 48 - w * 10, b: -14 }, legL: { a: -12, b: -26 }, legR: { a: 16, b: -18 }, expr: 'neutral' };
    case 'curl': return { armL: { a: 28, b: -108 }, armR: { a: 28, b: -108 }, legL: { a: -62, b: -112 }, legR: { a: 62, b: -112 }, headTilt: 12, expr: 'worried' };
    case 'cheer': return { armL: { a: 164 + w * 8, b: -6 }, armR: { a: 164 - w * 8, b: -6 }, legL: { a: -22, b: -6 }, legR: { a: 22, b: -6 }, expr: 'happy' };
    case 'salute': return { armR: { a: 118, b: -130 }, armL: { a: 14, b: -10 }, expr: 'smug' };
    case 'cringe': return { armL: { a: 52, b: -88 }, armR: { a: 52, b: -88 }, legL: { a: -6, b: -30 }, legR: { a: 6, b: -30 }, headTilt: -10, expr: 'worried' };
    case 'tap': return { armR: { a: 66, b: -92 }, handR: 'point', armL: { a: 16, b: -10 }, headTilt: 8, expr: 'neutral' };
    case 'cling': return { armL: { a: 160, b: -8 }, armR: { a: 160, b: -8 }, legL: { a: -26, b: -42 }, legR: { a: 26, b: -42 }, expr: 'worried' };
    case 'sit': return { armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 }, legL: { a: 84, b: -84 }, legR: { a: 78, b: -90 }, expr: 'tired' };
    case 'lean': return { tilt: 12, armR: { a: 48, b: -22 }, armL: { a: 20, b: -24 }, legL: { a: 14, b: -14 }, legR: { a: -10, b: 0 }, expr: 'neutral' };
    case 'cool': return { armL: { a: 20, b: -20 }, armR: { a: 110, b: -100 }, legL: { a: -8, b: -10 }, legR: { a: 8, b: -10 }, expr: 'cool' };
    default: return {};
  }
};

export const headLocal = (pose: Pose) => {
  const h = rot2(0, -176, pose.headTilt, 0, -136);
  return rot2(h.x, h.y, pose.tilt);
};

const WristDevice: React.FC<{ g: any; side: 'L' | 'R'; pose: Pose; t: number }> = ({ g, side, pose, t }) => {
  const j = joints(pose);
  const arm = side === 'L' ? j.armL : j.armR;
  const px = lerp(arm.mid.x, arm.end.x, 0.62);
  const py = lerp(arm.mid.y, arm.end.y, 0.62);
  const st = g.st as string;
  const warn = st === 'warn';
  const col = warn ? '#FF5A4A' : '#5BE08A';
  const fillv = clamp(typeof g.fill === 'number' ? g.fill : Array.isArray(g.fill) ? g.fill[1] : 0);
  return (
    <g transform={`translate(${px} ${py})`}>
      <rect x={-34} y={-24} width={68} height={48} rx={9} fill="#2C3248" stroke="#1D2033" strokeWidth={4} />
      <rect x={-29} y={-19} width={58} height={38} rx={6} fill="#0B1020" />
      <text x={0} y={-6} textAnchor="middle" fontFamily={FONT.ui} fontSize={9.5} fill="#8FE9FF">DEPTH</text>
      <text x={0} y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={g.depth.length > 6 ? 11 : 14} fill={col}>{g.depth}</text>
      <rect x={-24} y={13} width={48} height={3.2} rx={1.5} fill="#26304A" />
      <rect x={-24} y={13} width={48 * fillv} height={3.2} rx={1.5} fill={col} />
      {warn ? <circle cx={26} cy={-17} r={4} fill="#FF5A4A" opacity={0.5 + 0.5 * Math.sin(t * 0.7)} /> : null}
    </g>
  );
};

export const PipFig: React.FC<{ spec: PipSpec; W: number; H: number; t: number; p: number; gauge?: any }> = ({ spec, W, H, t, p, gauge }) => {
  const s = tw(spec.s, p, 1);
  const cx = tw(spec.x, p, 0.5) * W;
  const cy = tw(spec.y, p, 0.5) * H;
  const facing = spec.flip ?? 1;
  const base: Pose = { ...basePose, x: cx, y: cy + 50 * s, scale: s, facing, yaw: spec.yaw ?? 0 };
  const pr = presetPose(spec.pose, t, spec.ph ?? 0);
  const pose: Pose = { ...base, ...pr, x: cx, y: cy + 50 * s, scale: s, facing, yaw: spec.yaw !== undefined ? spec.yaw : (pr.yaw ?? 0) * facing };
  pose.spin = tw(spec.spin, p, 0);
  if (spec.tilt !== undefined) pose.tilt = tw(spec.tilt, p, 0);
  if (spec.ex) pose.expr = spec.ex as any;
  if (spec.arms) {
    pose.armL = { a: spec.arms[0], b: pose.armL.b };
    pose.armR = { a: spec.arms[1], b: pose.armR.b };
  }
  if (facing === -1 && pr.yaw === undefined) pose.yaw = spec.yaw ?? 0;
  const pl = spec.look === 'dark' ? SUIT_DARK : SUIT;
  const j = joints(pose);
  const hl = headLocal(pose);
  const head = toWorld(pose, hl);
  const hw = (loc: { x: number; y: number }) => toWorld(pose, loc);
  const hands = { L: hw(j.armL.end), R: hw(j.armR.end) };
  const holds = (spec.hold ?? '').split('+').filter(Boolean);
  const wr = spec.wrist ?? null;
  const gT = `translate(${pose.x} ${pose.y}) scale(${s}) rotate(${pose.spin} 0 -90)`;
  const packOff = -facing * 44 * Math.min(1, Math.abs(pose.yaw));
  const helmet = spec.helmet ?? 1;
  return (
    <g>
      {(spec.pack ?? 1) ? (
        <g transform={gT}>
          <g transform={`rotate(${pose.tilt})`}>
            <rect x={-56 + packOff} y={-120} width={112} height={112} rx={20} fill="#9BA7BE" stroke="#1D2033" strokeWidth={4} />
            <rect x={-72 + packOff} y={-110} width={22} height={74} rx={10} fill="#C3CCDD" stroke="#1D2033" strokeWidth={4} />
            <rect x={50 + packOff} y={-110} width={22} height={74} rx={10} fill="#C3CCDD" stroke="#1D2033" strokeWidth={4} />
          </g>
        </g>
      ) : null}
      <Hero pose={pose} look={pl} rimId="rimBlue" shadow={0} />
      <g transform={gT}>
        <g transform={`rotate(${pose.tilt})`}>
          <path d="M -56 -114 Q 0 -86 56 -114" fill="none" stroke="#1D2033" strokeWidth={13} strokeLinecap="round" />
          <path d="M -56 -114 Q 0 -86 56 -114" fill="none" stroke="#FF8A3D" strokeWidth={7} strokeLinecap="round" />
          <rect x={-18} y={-80} width={36} height={22} rx={5} fill="#FF8A3D" stroke="#1D2033" strokeWidth={3.5} />
          <circle cx={-7} cy={-69} r={3.6} fill="#5BE08A" />
          <circle cx={7} cy={-69} r={3.6} fill="#FFE27A" />
        </g>
      </g>
      {wr ? (
        <g transform={gT}>
          <WristDevice g={gauge ?? { st: 'lcd', depth: '0 km', fill: 0 }} side={wr} pose={pose} t={t} />
        </g>
      ) : null}
      {helmet ? (
        <g transform={`translate(${head.x} ${head.y})`}>
          <circle r={86 * s} fill="#BFE6FF" opacity={0.13} />
          <circle r={86 * s} fill="none" stroke="#E8F4FF" strokeWidth={6 * s} opacity={0.9} />
          <path d={`M ${-60 * s} ${-44 * s} A ${74 * s} ${74 * s} 0 0 1 ${-14 * s} ${-74 * s}`} fill="none" stroke="#fff" strokeWidth={8 * s} strokeLinecap="round" opacity={0.7} />
          <path d={`M ${-68 * s} ${-14 * s} L ${-62 * s} ${-26 * s}`} stroke="#fff" strokeWidth={6 * s} strokeLinecap="round" opacity={0.6} />
        </g>
      ) : null}
      {holds.map((h) => (
        <Held key={h} k={h} hands={hands} head={head} s={s} t={t} pose={pose} facing={facing} hx={spec.hx ?? 0} />
      ))}
    </g>
  );
};

const Grape: React.FC<{ r: number }> = ({ r }) => (
  <g>
    <circle r={r} fill="#7A4FB8" stroke="#2A1748" strokeWidth={r * 0.1} />
    <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.22} fill="#D2B8F2" opacity={0.85} />
    <path d={`M 0 ${-r} q ${r * 0.1} ${-r * 0.6} ${r * 0.5} ${-r * 0.7}`} stroke="#4C8A3C" strokeWidth={r * 0.16} fill="none" strokeLinecap="round" />
  </g>
);
const Ball: React.FC<{ r: number }> = ({ r }) => (
  <g>
    <circle r={r} fill="#E8742A" stroke="#2A1408" strokeWidth={r * 0.05} />
    <path d={`M ${-r} 0 L ${r} 0 M 0 ${-r} L 0 ${r}`} stroke="#2A1408" strokeWidth={r * 0.045} />
    <path d={`M ${-r * 0.7} ${-r * 0.7} Q ${-r * 0.2} 0 ${-r * 0.7} ${r * 0.7} M ${r * 0.7} ${-r * 0.7} Q ${r * 0.2} 0 ${r * 0.7} ${r * 0.7}`} stroke="#2A1408" strokeWidth={r * 0.045} fill="none" />
    <circle cx={-r * 0.35} cy={-r * 0.4} r={r * 0.2} fill="#FFC28A" opacity={0.5} />
  </g>
);

export const Probe: React.FC<{ r: number; st: number }> = ({ r, st }) => {
  // st 0 intact .. 1 squashed flat .. 2 melting puddle .. 3 gone
  const sq = clamp(st);
  const melt = clamp(st - 1);
  const gone = clamp(st - 2);
  const sy = 1 - 0.72 * sq - 0.2 * melt;
  const sx = 1 + 0.5 * sq + 0.5 * melt;
  return (
    <g opacity={1 - gone} transform={`scale(${sx} ${sy})`}>
      <rect x={-r * 0.5} y={-r * 0.5} width={r} height={r} rx={r * 0.12} fill="#D8DDE8" stroke="#1D2033" strokeWidth={r * 0.06} />
      <circle cx={0} cy={-r * 0.1} r={r * 0.2} fill="#FF8A3D" stroke="#1D2033" strokeWidth={r * 0.05} />
      <path d={`M ${-r * 0.5} 0 L ${-r * 1.1} 0 M ${r * 0.5} 0 L ${r * 1.1} 0`} stroke="#1D2033" strokeWidth={r * 0.06} />
      <rect x={-r * 1.4} y={-r * 0.2} width={r * 0.55} height={r * 0.4} fill="#3A66C4" stroke="#1D2033" strokeWidth={r * 0.04} />
      <rect x={r * 0.85} y={-r * 0.2} width={r * 0.55} height={r * 0.4} fill="#3A66C4" stroke="#1D2033" strokeWidth={r * 0.04} />
      <path d={`M 0 ${-r * 0.5} L 0 ${-r * 0.9}`} stroke="#1D2033" strokeWidth={r * 0.05} />
      <circle cx={0} cy={-r * 0.95} r={r * 0.08} fill="#FF5A4A" />
      {melt > 0 ? <ellipse cx={0} cy={r * 0.45} rx={r * (0.6 + melt * 0.8)} ry={r * 0.12} fill="#FF8A3D" opacity={0.8} /> : null}
    </g>
  );
};

const Held: React.FC<{ k: string; hands: { L: { x: number; y: number }; R: { x: number; y: number } }; head: { x: number; y: number }; s: number; t: number; pose: Pose; facing: number; hx: number }> = ({ k, hands, head, s, t, pose, facing, hx }) => {
  const mid = { x: (hands.L.x + hands.R.x) / 2, y: (hands.L.y + hands.R.y) / 2 };
  const w = Math.sin(t * 0.35);
  switch (k) {
    case 'ball': return <g transform={`translate(${mid.x} ${mid.y - 50 * s})`}><Ball r={62 * s} /></g>;
    case 'ballR': return <g transform={`translate(${hands.R.x} ${hands.R.y - 46 * s})`}><Ball r={52 * s} /></g>;
    case 'grape': return <g transform={`translate(${hands.L.x} ${hands.L.y - 14 * s})`}><Grape r={22 * s} /></g>;
    case 'grapeR': return <g transform={`translate(${hands.R.x} ${hands.R.y - 16 * s})`}><Grape r={24 * s} /></g>;
    case 'probe': return <g transform={`translate(${hands.R.x} ${hands.R.y - 30 * s})`}><Probe r={34 * s} st={0} /></g>;
    case 'flag':
      return (
        <g transform={`translate(${hands.R.x} ${hands.R.y})`}>
          <path d={`M 0 8 L ${6 * s} ${-110 * s}`} stroke="#E8E0D0" strokeWidth={5 * s} strokeLinecap="round" />
          <path d={`M ${6 * s} ${-108 * s} q ${30 * s} ${-14 * s + w * 10 * s} ${60 * s} 0 q ${-6 * s} ${20 * s} ${6 * s} ${40 * s} q ${-30 * s} ${-14 * s + w * 10 * s} ${-60 * s} 0 Z`} fill="#FF4D6A" stroke="#1D2033" strokeWidth={3 * s} />
          <circle cx={30 * s} cy={-96 * s} r={7 * s} fill="#FFE27A" />
        </g>
      );
    case 'compass':
      return (
        <g transform={`translate(${hands.L.x} ${hands.L.y - 30 * s})`}>
          <circle r={34 * s} fill="#10162A" stroke="#E8E0D0" strokeWidth={6 * s} />
          <g transform={`rotate(${hx + t * 24})`}>
            <path d={`M 0 ${-27 * s} L ${7 * s} 0 L ${-7 * s} 0 Z`} fill="#FF4D4D" />
            <path d={`M 0 ${27 * s} L ${7 * s} 0 L ${-7 * s} 0 Z`} fill="#F6EFE3" />
          </g>
          <circle r={3.4 * s} fill="#FFE27A" />
        </g>
      );
    case 'scarf': {
      const a = ((hx || 180) * Math.PI) / 180;
      const bx = head.x;
      const by = head.y + 74 * s;
      let d = `M ${bx - 42 * s} ${by} `;
      let top = '';
      const pts: [number, number][] = [];
      for (let i = 0; i <= 14; i++) {
        const q = i / 14;
        const dist = q * 260 * s;
        const wob = Math.sin(t * 0.45 - q * 6) * 30 * s * q;
        pts.push([bx + Math.cos(a) * dist - Math.sin(a) * wob, by + Math.sin(a) * dist + Math.cos(a) * wob + 10 * s]);
      }
      d += pts.map((q) => `L ${q[0]} ${q[1]}`).join(' ');
      top = pts.map((q, i) => `${i ? 'L' : 'M'} ${q[0] + 0} ${q[1] + 34 * s * (1 - i / 16)}`).join(' ');
      return (
        <g>
          <path d={top} stroke="#FF4D6A" strokeWidth={26 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={top} stroke="#FFB0BC" strokeWidth={6 * s} fill="none" strokeLinecap="round" strokeDasharray={`${14 * s} ${22 * s}`} />
          <path d={`M ${bx - 52 * s} ${by + 6 * s} Q ${bx} ${by + 34 * s} ${bx + 52 * s} ${by + 6 * s}`} stroke="#FF4D6A" strokeWidth={22 * s} fill="none" strokeLinecap="round" />
        </g>
      );
    }
    default: return null;
  }
};

// ---------- free props in the scene ----------
export const PropFig: React.FC<{ pr: PropSpec; W: number; H: number; t: number; p: number }> = ({ pr, W, H, t, p }) => {
  const x = tw(pr.x, p, 0.5) * W;
  const y = tw(pr.y, p, 0.5) * H;
  const sc = tw(pr.s, p, 1);
  const r = tw(pr.r, p, 0);
  const a = tw(pr.a, p, 0);
  const o = tw(pr.o, p, 1);
  const f = pr.flip ?? 1;
  const T = `translate(${x} ${y}) rotate(${r}) scale(${sc * f} ${sc})`;
  switch (pr.k) {
    case 'grape': return <g transform={T} opacity={o}><Grape r={40} /></g>;
    case 'ball': return <g transform={T} opacity={o}><Ball r={100} /></g>;
    case 'earth': return <g opacity={o}><EarthDisc x={x} y={y} r={sc * 50} sil={pr.v === 'sil'} /></g>;
    case 'probe': return <g transform={T} opacity={o}><Probe r={60} st={a} /></g>;
    case 'flag':
      return (
        <g transform={T} opacity={o}>
          <path d="M 0 0 L 0 -150" stroke="#E8E0D0" strokeWidth={6} />
          <path d={`M 0 -148 q ${40} ${-18 + Math.sin(t * 0.5) * 14} ${80} 0 q ${-8} ${26} 8 ${52} q ${-40} ${-18 + Math.sin(t * 0.5) * 14} ${-80} 0 Z`} fill="#FF4D6A" stroke="#1D2033" strokeWidth={4} />
        </g>
      );
    case 'scarfBit':
      return (
        <g transform={T} opacity={o}>
          <path d={`M 0 0 q 60 ${-30 + Math.sin(t * 0.5) * 20} 120 ${Math.sin(t * 0.4) * 24} t 120 0`} stroke="#FF4D6A" strokeWidth={30} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'compass':
      return (
        <g transform={T} opacity={o}>
          <circle r={70} fill="#10162A" stroke="#E8E0D0" strokeWidth={10} />
          {['N', 'E', 'S', 'W'].map((c, i) => <text key={c} x={Math.sin((i * Math.PI) / 2) * 52} y={-Math.cos((i * Math.PI) / 2) * 52 + 7} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#8FE9FF">{c}</text>)}
          <g transform={`rotate(${a + (pr.v === 'spin' ? t * 33 : 0)})`}>
            <path d="M 0 -54 L 11 0 L -11 0 Z" fill="#FF4D4D" />
            <path d="M 0 54 L 11 0 L -11 0 Z" fill="#F6EFE3" />
          </g>
          <circle r={6} fill="#FFE27A" />
        </g>
      );
    case 'hull': {
      // a piece of the ship: plating, rivets and the hatch. v: 'out' (hatch open, seen from outside), 'rim' (rim only)
      const open = clamp(a);
      return (
        <g transform={T} opacity={o}>
          <rect x={-420} y={-40} width={840} height={220} rx={26} fill="#AEB8CC" stroke="#1D2033" strokeWidth={7} />
          {Array.from({ length: 13 }).map((_, i) => <circle key={i} cx={-390 + i * 65} cy={-14} r={7} fill="#6C778F" />)}
          <path d="M -420 120 L 420 120" stroke="#6C778F" strokeWidth={6} />
          <ellipse cx={0} cy={-52} rx={150} ry={46} fill="#2A3148" stroke="#1D2033" strokeWidth={7} />
          <ellipse cx={0} cy={-48} rx={128} ry={34} fill="#0B1020" />
          <g transform={`translate(-150 -52) rotate(${-open * 100}) `}>
            <path d="M 0 0 L 300 0 L 300 -16 L 0 -16 Z" fill="#C9D2E3" stroke="#1D2033" strokeWidth={6} transform={`scale(${open ? 1 : 1} 1)`} />
          </g>
          <rect x={-70} y={96} width={140} height={44} rx={8} fill="#FF8A3D" stroke="#1D2033" strokeWidth={5} />
          <text x={0} y={128} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#1D2033">AIRLOCK</text>
        </g>
      );
    }
    case 'crystal': return <g transform={T} opacity={o}><path d="M 0 -50 L 32 -16 L 22 44 L -22 44 L -32 -16 Z" fill={pr.c ?? '#F3D9A0'} stroke="#7A4A1E" strokeWidth={5} /><path d="M 0 -50 L 0 44 M -32 -16 L 32 -16" stroke="#7A4A1E" strokeWidth={3} opacity={0.5} /></g>;
    case 'flake': return <g transform={T} opacity={o}><path d="M 0 -60 L 52 -30 L 52 30 L 0 60 L -52 30 L -52 -30 Z" fill="#fff" fillOpacity={0.3} stroke="#fff" strokeWidth={5} /><path d="M 0 -60 L 0 60 M -52 -30 L 52 30 M -52 30 L 52 -30" stroke="#fff" strokeWidth={3} opacity={0.8} /></g>;
    case 'eyes': return <g transform={T} opacity={o}><ellipse cx={-26} cy={0} rx={18} ry={22} fill="#fff" stroke="#1D2033" strokeWidth={4} /><ellipse cx={26} cy={0} rx={18} ry={22} fill="#fff" stroke="#1D2033" strokeWidth={4} /><circle cx={-20} cy={4} r={8} fill="#1D2033" /><circle cx={32} cy={4} r={8} fill="#1D2033" /><path d="M -50 -34 L -8 -26 M 8 -26 L 50 -34" stroke="#1D2033" strokeWidth={5} strokeLinecap="round" /></g>;
    case 'bub': return <g transform={T} opacity={o}><circle r={50} fill="#9FFAFF" fillOpacity={0.2} stroke="#E8FFFF" strokeWidth={5} /><circle cx={-18} cy={-18} r={11} fill="#fff" /><circle cx={0} cy={4} r={5} fill="#1D2033" opacity={0.0} />{pr.v === 'face' ? <g><circle cx={-12} cy={-2} r={5} fill="#1D2033" /><circle cx={14} cy={-2} r={5} fill="#1D2033" /><path d="M -12 16 Q 0 26 14 16" stroke="#1D2033" strokeWidth={4} fill="none" strokeLinecap="round" /></g> : null}</g>;
    case 'bolt': return <g transform={T} opacity={o}><path d="M 10 -70 L -30 6 L -2 6 L -14 70 L 34 -12 L 4 -12 Z" fill="#FFE27A" stroke="#7A4A1E" strokeWidth={5} strokeLinejoin="round" /></g>;
    case 'arrow': return <g transform={T} opacity={o}><path d="M -110 0 L 90 0 M 90 0 L 46 -40 M 90 0 L 46 40" stroke={pr.c ?? '#FFF6E2'} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>;
    case 'alarm': return <g transform={T} opacity={o}><circle r={70} fill="#FF4D6A" stroke="#1D2033" strokeWidth={8} /><circle r={52} fill="#F6EFE3" /><path d="M 0 0 L 0 -38 M 0 0 L 26 14" stroke="#1D2033" strokeWidth={7} strokeLinecap="round" /><circle cx={-52} cy={-70} r={22} fill="#FFE27A" stroke="#1D2033" strokeWidth={5} /><circle cx={52} cy={-70} r={22} fill="#FFE27A" stroke="#1D2033" strokeWidth={5} /></g>;
    case 'phone': return <g transform={T} opacity={o}><rect x={-46} y={-84} width={92} height={168} rx={14} fill="#1D2033" stroke="#E8E0D0" strokeWidth={5} /><rect x={-38} y={-68} width={76} height={128} rx={6} fill="#0B1A3A" /><circle cx={0} cy={-6} r={18} fill="#FFE27A" /><circle cx={30} cy={-24} r={6} fill="#FF7B5A" /></g>;
    case 'jup': return <g transform={T} opacity={o}><circle r={60} fill="#C98F5E" stroke="#8E4D34" strokeWidth={5} /><path d="M -58 -14 Q 0 -26 58 -14 M -60 16 Q 0 28 60 16" stroke="#F0DDB9" strokeWidth={10} fill="none" /><path d="M -50 -34 Q 0 -44 50 -34" stroke="#8E4D34" strokeWidth={8} fill="none" /></g>;
    case 'mars': return <g transform={T} opacity={o}><circle r={34} fill="#D8582E" stroke="#7A2A18" strokeWidth={5} /><circle cx={-8} cy={-6} r={8} fill="#B03E20" /><circle cx={10} cy={12} r={6} fill="#B03E20" /></g>;
    case 'moon': return <g transform={T} opacity={o}><circle r={60} fill="#F0EAD8" stroke="#8A8470" strokeWidth={5} /><circle cx={-18} cy={-12} r={12} fill="#CFC8B0" /><circle cx={20} cy={16} r={9} fill="#CFC8B0" /><circle cx={14} cy={-26} r={6} fill="#CFC8B0" /></g>;
    case 'ring': return <g transform={T} opacity={o}><circle r={90} fill="none" stroke={pr.c ?? '#FF8A3D'} strokeWidth={10} strokeDasharray="24 16" /></g>;
    case 'x': return <g transform={T} opacity={o}><path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke={pr.c ?? '#FF5A4A'} strokeWidth={18} strokeLinecap="round" /></g>;
    case 'pin': return <g transform={T} opacity={o}><path d="M 0 0 L -26 -60 A 30 30 0 1 1 26 -60 Z" fill="#FF8A3D" stroke="#fff" strokeWidth={5} /><circle cx={0} cy={-70} r={11} fill="#fff" /></g>;
    case 'puddle': return <g transform={T} opacity={o}><ellipse rx={90} ry={16} fill="#FF8A3D" opacity={0.85} /><ellipse rx={50} ry={8} fill="#FFD08A" /></g>;
    case 'visor': return <g transform={T} opacity={o}><rect x={-120} y={-80} width={240} height={160} rx={60} fill="#BFE6FF" fillOpacity={0.12} stroke="#E8F4FF" strokeWidth={8} /><path d="M -90 -40 Q -60 -66 -30 -62" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} /></g>;
    default: return null;
  }
};
export { rnd, sm };
