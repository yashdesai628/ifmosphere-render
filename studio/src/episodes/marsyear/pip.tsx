import React from 'react';
import { Hero, Look, Pose, basePose, joints, toWorld, FONT } from '../../engine';
import { PipSpec, CrewSpec, PropSpec, tw, rnd, clamp, lerp, sm } from './lib';

// Pip in a small orange crew jumpsuit, three-plus crewmates with their own hats, a white Marswalk suit, and every
// prop the story needs. Original characters; plain shapes.

const INK = '#1D2033';
export const JUMP: Look = {
  skin: '#F6EFE3', skinShade: '#E2D3BE', hand: '#F6EFE3', jacket: '#FF7A2E', jacketShade: '#D9601C', accent: '#FFD27A',
  limb: '#F26B21', line: INK, shoe: '#4A2E26', face: INK, hair: INK,
};
export const SUIT: Look = {
  skin: '#F6EFE3', skinShade: '#E2D3BE', hand: '#FF8A3D', jacket: '#F1F4FA', jacketShade: '#C5CFE2', accent: '#FF7A2E',
  limb: '#E4EAF5', line: INK, shoe: '#FF7A2E', face: INK, hair: INK,
};
export const CREW: Record<string, Look & { hat: string }> = {
  elder: { skin: '#C98E68', skinShade: '#B07A58', hand: '#C98E68', jacket: '#2F4F8A', jacketShade: '#243C6A', accent: '#E9C46A', limb: '#2A4478', line: INK, shoe: '#2A2A34', face: INK, hair: '#2A1C18', hat: 'aviator' },
  ellis: { skin: '#E9C9A4', skinShade: '#D2B088', hand: '#E9C9A4', jacket: '#2FA39A', jacketShade: '#238078', accent: '#FFFFFF', limb: '#2A8E86', line: INK, shoe: '#F5F0E6', face: INK, hair: '#4A2E20', hat: 'scrub' },
  spicer: { skin: '#EBD2B3', skinShade: '#D2B994', hand: '#EBD2B3', jacket: '#D9A12B', jacketShade: '#B58419', accent: '#3A3A44', limb: '#C48F22', line: INK, shoe: '#3A2A22', face: INK, hair: '#6A3C20', hat: 'hard' },
  monty: { skin: '#B67B58', skinShade: '#9C6644', hand: '#B67B58', jacket: '#5E8C4A', jacketShade: '#486E38', accent: '#F2E3B0', limb: '#4E7A3C', line: INK, shoe: '#3A2E22', face: INK, hair: '#2A1C18', hat: 'bucket' },
};

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
    case 'type': return { armL: { a: 34, b: -74 }, armR: { a: 30, b: -78 }, legL: { a: -4, b: 0 }, legR: { a: 4, b: 0 }, headTilt: 4, expr: 'neutral' };
    case 'pedal': return { tilt: 9, armL: { a: 52, b: -34 }, armR: { a: 52, b: -34 }, legL: { a: 44 + Math.sin(t * 0.5 + ph) * 28, b: -78 + Math.sin(t * 0.5 + ph) * 10 }, legR: { a: 44 - Math.sin(t * 0.5 + ph) * 28, b: -78 - Math.sin(t * 0.5 + ph) * 10 }, expr: 'tired' };
    case 'wait': return { armL: { a: 28, b: -108 }, armR: { a: 28, b: -108 }, legL: { a: -6, b: 0 }, legR: { a: 8 + Math.max(0, Math.sin(t * 0.45 + ph)) * 16, b: -6 }, headTilt: -8, expr: 'neutral' };
    case 'sip': return { armR: { a: 40, b: -122 }, armL: { a: 16, b: -12 }, legL: { a: -6, b: -8 }, legR: { a: 6, b: -8 }, headTilt: -6, expr: 'smug' };
    case 'think': return { armR: { a: 36, b: -138 }, armL: { a: 30, b: -100 }, headTilt: 10, expr: 'worried' };
    case 'carry': return { armL: { a: 50, b: -66 }, armR: { a: 50, b: -66 }, legL: { a: -6, b: -8 }, legR: { a: 6, b: -8 }, expr: 'neutral' };
    case 'trudge': return { yaw: 1, tilt: 10, armR: { a: 40 + Math.sin(t * 0.5 + ph) * 26, b: -24 }, armL: { a: 20 - Math.sin(t * 0.5 + ph) * 26, b: -20 }, legL: { a: 26 + Math.sin(t * 0.5 + ph) * 30, b: -30 }, legR: { a: -4 - Math.sin(t * 0.5 + ph) * 30, b: -4 }, expr: 'tired' };
    case 'hug': return { armL: { a: 104, b: -34 }, armR: { a: 104, b: -34 }, legL: { a: -8, b: -8 }, legR: { a: 8, b: -8 }, expr: 'happy' };
    case 'squint': return { armR: { a: 36, b: -150 }, armL: { a: 14, b: -10 }, headTilt: -8, expr: 'worried' };
    case 'collapse': return { tilt: 6, armL: { a: 18, b: -6 }, armR: { a: 18, b: -6 }, legL: { a: 6, b: -6 }, legR: { a: -6, b: -6 }, headTilt: 12, expr: 'tired' };
    case 'peer': return { yaw: 0.5, tilt: 14, armR: { a: 48, b: -50 }, armL: { a: 20, b: -20 }, legL: { a: 12, b: -12 }, legR: { a: -8, b: 0 }, headTilt: 8, expr: 'neutral' };
    case 'drive': return { armL: { a: 52, b: -64 }, armR: { a: 52, b: -64 }, legL: { a: -4, b: -6 }, legR: { a: 4, b: -6 }, headTilt: 6 + Math.sin(t * 0.3 + ph) * 3, expr: 'smug' };
    default: return {};
  }
};


export const headLocal = (pose: Pose) => {
  const h = rot2(0, -176, pose.headTilt, 0, -136);
  return rot2(h.x, h.y, pose.tilt);
};

const Hat: React.FC<{ k: string }> = ({ k }) => {
  switch (k) {
    case 'aviator':
      return (
        <g>
          <path d="M -66 -4 Q -72 -74 0 -80 Q 72 -74 66 -4 Q 40 -26 0 -24 Q -40 -26 -66 -4 Z" fill="#8A5A34" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d="M -60 -34 Q 0 -52 60 -34" fill="none" stroke="#3A2A1E" strokeWidth={9} />
          <circle cx={-22} cy={-44} r={16} fill="#9ED8E8" stroke={INK} strokeWidth={4} />
          <circle cx={22} cy={-44} r={16} fill="#9ED8E8" stroke={INK} strokeWidth={4} />
          <path d="M -8 -44 L 8 -44" stroke={INK} strokeWidth={4} />
          <path d="M -66 -4 L -76 28 M 66 -4 L 76 28" stroke="#8A5A34" strokeWidth={14} strokeLinecap="round" />
        </g>
      );
    case 'scrub':
      return (
        <g>
          <path d="M -66 -2 Q -74 -80 0 -84 Q 74 -80 66 -2 Q 40 -20 0 -20 Q -40 -20 -66 -2 Z" fill="#8FD3EA" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {[[-30, -56], [0, -66], [30, -54], [-12, -38], [20, -34], [-44, -30]].map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r={6} fill="#FFFFFF" />)}
          <circle cx={-62} cy={-10} r={11} fill="#8FD3EA" stroke={INK} strokeWidth={4} />
          <path d="M -9 -60 L 9 -60 M 0 -69 L 0 -51" stroke="#E5484D" strokeWidth={5} />
        </g>
      );
    case 'hard':
      return (
        <g>
          <path d="M -60 -12 Q -64 -80 0 -84 Q 64 -80 60 -12 Z" fill="#FFD23F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <rect x={-10} y={-84} width={20} height={64} fill="#F0B81E" stroke={INK} strokeWidth={3} />
          <path d="M -80 -10 L 80 -10 L 74 4 L -74 4 Z" fill="#FFD23F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={0} cy={-40} r={9} fill="#FFFBD0" stroke={INK} strokeWidth={3} />
        </g>
      );
    case 'bucket':
      return (
        <g>
          <path d="M -52 -22 L -44 -72 Q 0 -88 44 -72 L 52 -22 Z" fill="#CDB07A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <ellipse cx={0} cy={-22} rx={86} ry={17} fill="#B99A60" stroke={INK} strokeWidth={4} />
          <path d="M 0 -84 Q 2 -108 -2 -118 M 0 -100 q 22 -6 30 -26 q -26 0 -30 26 M 0 -108 q -20 -4 -26 -22 q 24 0 26 22" fill="#5BBF5B" stroke="#2E7A34" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

const rig = (look: Look, spec: PipSpec, W: number, H: number, t: number, p: number, hat?: string) => {
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
  const j = joints(pose);
  const head = toWorld(pose, headLocal(pose));
  const hw = (loc: { x: number; y: number }) => toWorld(pose, loc);
  const hands = { L: hw(j.armL.end), R: hw(j.armR.end) };
  const gT = `translate(${pose.x} ${pose.y}) scale(${s}) rotate(${pose.spin} 0 -90)`;
  const suit = !!spec.suit;
  const packOff = -facing * 44 * Math.min(1, Math.abs(pose.yaw));
  const holds = (spec.hold ?? '').split('+').filter(Boolean);
  return (
    <g>
      {suit ? (
        <g transform={gT}>
          <g transform={`rotate(${pose.tilt})`}>
            <rect x={-56 + packOff} y={-120} width={112} height={112} rx={20} fill="#9BA7BE" stroke={INK} strokeWidth={4} />
            <rect x={-72 + packOff} y={-110} width={22} height={74} rx={10} fill="#C3CCDD" stroke={INK} strokeWidth={4} />
            <rect x={50 + packOff} y={-110} width={22} height={74} rx={10} fill="#C3CCDD" stroke={INK} strokeWidth={4} />
          </g>
        </g>
      ) : null}
      <Hero pose={pose} look={look} rimId="rimBlue" shadow={0.5} />
      {suit ? (
        <g transform={gT}>
          <g transform={`rotate(${pose.tilt})`}>
            <path d="M -56 -114 Q 0 -86 56 -114" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
            <path d="M -56 -114 Q 0 -86 56 -114" fill="none" stroke="#FF7A2E" strokeWidth={7} strokeLinecap="round" />
            <rect x={-18} y={-80} width={36} height={22} rx={5} fill="#FF7A2E" stroke={INK} strokeWidth={3.5} />
            <circle cx={-7} cy={-69} r={3.6} fill="#5BE08A" />
            <circle cx={7} cy={-69} r={3.6} fill="#FFE27A" />
          </g>
        </g>
      ) : (
        !hat && (
          <g transform={gT}>
            <g transform={`rotate(${pose.tilt})`}>
              <rect x={14} y={-96} width={20} height={14} rx={3} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
              <path d="M 18 -89 L 30 -89" stroke="#FF7A2E" strokeWidth={3} />
            </g>
          </g>
        )
      )}
      {hat ? (
        <g transform={`translate(${head.x} ${head.y}) rotate(${pose.tilt + pose.headTilt}) scale(${s * (facing === -1 ? 1 : 1)})`}>
          <Hat k={hat} />
        </g>
      ) : null}
      {suit ? (
        <g transform={`translate(${head.x} ${head.y})`}>
          <circle r={86 * s} fill="#BFE6FF" opacity={0.13} />
          <circle r={86 * s} fill="none" stroke="#E8F4FF" strokeWidth={6 * s} opacity={0.9} />
          <path d={`M ${-60 * s} ${-44 * s} A ${74 * s} ${74 * s} 0 0 1 ${-14 * s} ${-74 * s}`} fill="none" stroke="#fff" strokeWidth={8 * s} strokeLinecap="round" opacity={0.7} />
        </g>
      ) : null}
      {holds.map((h) => (
        <Held key={h} k={h} hands={hands} head={head} s={s} t={t} facing={facing} v={spec.hv} hx={spec.hx ?? 0} />
      ))}
    </g>
  );
};

export const PipFig: React.FC<{ spec: PipSpec; W: number; H: number; t: number; p: number }> = ({ spec, W, H, t, p }) => rig(spec.suit ? SUIT : JUMP, spec, W, H, t, p);
export const CrewFig: React.FC<{ spec: CrewSpec; W: number; H: number; t: number; p: number }> = ({ spec, W, H, t, p }) => {
  const c = CREW[spec.who];
  const look: Look = spec.suit ? { ...SUIT, skin: c.skin, skinShade: c.skinShade } : c;
  return rig(look, spec, W, H, t, p, spec.suit ? undefined : c.hat);
};

// ---------- things in the hands ----------
const Held: React.FC<{ k: string; hands: { L: { x: number; y: number }; R: { x: number; y: number } }; head: { x: number; y: number }; s: number; t: number; facing: number; v?: string; hx: number }> = ({ k, hands, head, s, t, facing, v, hx }) => {
  const mid = { x: (hands.L.x + hands.R.x) / 2, y: (hands.L.y + hands.R.y) / 2 };
  const R = hands.R;
  const L = hands.L;
  switch (k) {
    case 'phone':
      return (
        <g transform={`translate(${R.x} ${R.y - 40 * s}) scale(${s})`}>
          <rect x={-22} y={-40} width={44} height={80} rx={8} fill="#1D2033" stroke="#F6EFE3" strokeWidth={3} />
          <rect x={-17} y={-32} width={34} height={60} rx={3} fill={v ?? '#0B1A3A'} />
          <circle cx={0} cy={-8} r={9} fill="#FFE27A" />
        </g>
      );
    case 'tablet':
      return (
        <g transform={`translate(${mid.x} ${mid.y - 30 * s}) scale(${s})`}>
          <rect x={-56} y={-40} width={112} height={78} rx={8} fill="#1D2033" stroke="#E8E0D0" strokeWidth={3} />
          <rect x={-49} y={-33} width={98} height={64} rx={3} fill="#12304A" />
          <path d="M -40 14 L -22 -4 L -6 8 L 12 -16 L 40 2" stroke="#7FE8FF" strokeWidth={4} fill="none" />
        </g>
      );
    case 'clip':
      return (
        <g transform={`translate(${mid.x} ${mid.y - 34 * s}) scale(${s})`}>
          <rect x={-40} y={-56} width={80} height={104} rx={6} fill="#C99A5E" stroke={INK} strokeWidth={4} />
          <rect x={-32} y={-44} width={64} height={88} fill="#FFFDF4" />
          <rect x={-14} y={-62} width={28} height={14} rx={4} fill="#8E8E9A" stroke={INK} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M -24 ${-24 + i * 18} l 5 6 l 9 -11`} stroke="#2F9E5A" strokeWidth={3.5} fill="none" />
              <path d={`M -4 ${-20 + i * 18} L 24 ${-20 + i * 18}`} stroke="#9AA" strokeWidth={3} />
            </g>
          ))}
        </g>
      );
    case 'ctrl':
      return (
        <g transform={`translate(${mid.x} ${mid.y - 24 * s}) scale(${s})`}>
          <rect x={-58} y={-24} width={116} height={52} rx={22} fill="#3A3F58" stroke={INK} strokeWidth={4} />
          <circle cx={-30} cy={0} r={13} fill="#14172A" stroke="#8C94B8" strokeWidth={3} />
          <circle cx={30} cy={0} r={13} fill="#14172A" stroke="#8C94B8" strokeWidth={3} />
          <circle cx={-12} cy={-12} r={5} fill="#FF7A2E" />
          <circle cx={12} cy={-12} r={5} fill="#5BE08A" />
        </g>
      );
    case 'mug':
      return (
        <g transform={`translate(${R.x} ${R.y - 26 * s}) scale(${s})`}>
          <rect x={-18} y={-24} width={36} height={40} rx={6} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
          <path d="M 18 -14 q 18 2 0 22" fill="none" stroke={INK} strokeWidth={4} />
          <path d={`M -6 -32 q 6 -10 0 -18 M 6 -32 q 6 -10 0 -18`} stroke="#fff" strokeWidth={3} opacity={0.7} fill="none" />
        </g>
      );
    case 'tube':
      return (
        <g transform={`translate(${R.x} ${R.y - 30 * s}) scale(${s}) rotate(${hx})`}>
          <rect x={-9} y={-36} width={18} height={62} rx={9} fill="#F6EFE3" fillOpacity={0.5} stroke={INK} strokeWidth={3.5} />
          <rect x={-7} y={-8} width={14} height={32} rx={7} fill={v ?? '#E5484D'} />
          <rect x={-11} y={-42} width={22} height={10} rx={3} fill="#2B6CB0" stroke={INK} strokeWidth={3} />
        </g>
      );
    case 'veg':
      return (
        <g transform={`translate(${R.x} ${R.y - 18 * s}) scale(${s})`}>
          <circle r={15} fill={v ?? '#E5484D'} stroke={INK} strokeWidth={3.5} />
          <path d="M -6 -14 q 6 -12 12 0 M 0 -14 q 0 -10 -6 -14" stroke="#2E7A34" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      );
    case 'wrench':
      return (
        <g transform={`translate(${R.x} ${R.y - 30 * s}) scale(${s}) rotate(${-30 + hx})`}>
          <rect x={-6} y={-52} width={12} height={90} rx={5} fill="#B9C0D0" stroke={INK} strokeWidth={4} />
          <path d="M -18 -52 L -18 -78 L -6 -66 L 6 -66 L 18 -78 L 18 -52 Z" fill="#B9C0D0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
      );
    case 'soap':
      return (
        <g transform={`translate(${R.x} ${R.y - 30 * s}) scale(${s})`}>
          <rect x={-16} y={-34} width={32} height={58} rx={9} fill="#6EE0C8" stroke={INK} strokeWidth={4} />
          <rect x={-5} y={-50} width={10} height={18} rx={3} fill="#F6EFE3" stroke={INK} strokeWidth={3} />
          <circle cx={0} cy={-6} r={8} fill="#fff" opacity={0.8} />
        </g>
      );
    case 'helmet':
      return (
        <g transform={`translate(${R.x} ${R.y - 36 * s}) scale(${s})`}>
          <circle r={44} fill="#BFE6FF" fillOpacity={0.35} stroke="#E8F4FF" strokeWidth={6} />
          <path d="M -26 -18 A 34 34 0 0 1 -6 -34" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
        </g>
      );
    case 'bar':
      return (
        <g transform={`translate(${R.x} ${R.y - 10 * s}) scale(${s})`}>
          <rect x={-64} y={-8} width={128} height={14} rx={7} fill="#6C7794" stroke={INK} strokeWidth={3.5} />
          <rect x={-78} y={-24} width={20} height={46} rx={6} fill="#3A4260" stroke={INK} strokeWidth={3.5} />
          <rect x={58} y={-24} width={20} height={46} rx={6} fill="#3A4260" stroke={INK} strokeWidth={3.5} />
        </g>
      );
    case 'flagS':
      return (
        <g transform={`translate(${R.x} ${R.y}) scale(${s})`}>
          <path d="M 0 8 L 6 -110" stroke="#E8E0D0" strokeWidth={5} strokeLinecap="round" />
          <path d={`M 6 -108 q 30 ${-14 + Math.sin(t * 0.4) * 8} 60 0 q -6 20 6 40 q -30 ${-14 + Math.sin(t * 0.4) * 8} -60 0 Z`} fill="#FF7A2E" stroke={INK} strokeWidth={3} />
        </g>
      );
    default:
      return null;
  }
};

// ---------- free props in the scene ----------
const Wob = (t: number, a = 4, f = 0.3) => Math.sin(t * f) * a;
export const PropFig: React.FC<{ pr: PropSpec; W: number; H: number; t: number; p: number }> = ({ pr, W, H, t, p }) => {
  const x = tw(pr.x, p, 0.5) * W;
  const y = tw(pr.y, p, 0.5) * H;
  const sc = tw(pr.s, p, 1);
  const r = tw(pr.r, p, 0);
  const a = tw(pr.a, p, 0);
  const o = tw(pr.o, p, 1);
  const f = pr.flip ?? 1;
  const T = `translate(${x} ${y}) rotate(${r}) scale(${sc * f} ${sc})`;
  const c = pr.c;
  switch (pr.k) {
    case 'bubble': {
      const txt = String(pr.v ?? '...');
      const w = Math.max(90, txt.length * 20 + 50);
      return (
        <g transform={T} opacity={o}>
          <rect x={-w / 2} y={-40} width={w} height={74} rx={30} fill={c ?? '#FFF8E8'} stroke={INK} strokeWidth={5} />
          <path d="M -18 32 L -34 62 L 8 33 Z" fill={c ?? '#FFF8E8'} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-22} y={28} width={36} height={10} fill={c ?? '#FFF8E8'} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={36} fill={INK}>{txt}</text>
        </g>
      );
    }
    case 'msg':
      // an envelope flying along: a is its progress 0..1 along a 300px run
      return (
        <g transform={T} opacity={o}>
          <path d="M -140 6 L -70 6 M -170 -14 L -90 -14 M -150 26 L -84 26" stroke="#FFF1D0" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          <rect x={-48} y={-32} width={96} height={64} rx={8} fill="#FFF8E8" stroke={INK} strokeWidth={5} />
          <path d="M -48 -30 L 0 6 L 48 -30" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={36} cy={22} r={9} fill="#FF7A2E" />
        </g>
      );
    case 'phone':
      return (
        <g transform={T} opacity={o}>
          <rect x={-46} y={-84} width={92} height={168} rx={14} fill="#1D2033" stroke="#E8E0D0" strokeWidth={5} />
          <rect x={-38} y={-68} width={76} height={128} rx={6} fill="#0B1A3A" />
          <rect x={-30} y={-52} width={44} height={22} rx={8} fill="#2F7BE0" />
          <rect x={-14} y={-22} width={44} height={22} rx={8} fill="#E8E0D0" />
          <rect x={-30} y={8} width={34} height={20} rx={8} fill="#2F7BE0" opacity={pr.v === 'wait' ? 0.25 : 1} />
        </g>
      );
    case 'dots':
      return (
        <g transform={T} opacity={o}>
          <rect x={-60} y={-30} width={120} height={60} rx={30} fill="#E8E0D0" stroke={INK} strokeWidth={4} />
          {[-26, 0, 26].map((d, i) => <circle key={i} cx={d} cy={Math.sin(t * 0.4 + i * 1.3) * 7} r={9} fill={INK} />)}
        </g>
      );
    case 'hourglass': {
      const k = clamp(a);
      return (
        <g transform={T} opacity={o}>
          <rect x={-46} y={-84} width={92} height={14} rx={5} fill="#7A4A2A" stroke={INK} strokeWidth={4} />
          <rect x={-46} y={70} width={92} height={14} rx={5} fill="#7A4A2A" stroke={INK} strokeWidth={4} />
          <path d="M -38 -70 L 38 -70 L 6 0 L 38 70 L -38 70 L -6 0 Z" fill="#FFF1D0" fillOpacity={0.3} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M -${34 * (1 - k)} -${66 - 54 * k} L ${34 * (1 - k)} -${66 - 54 * k} L 0 -4 Z`} fill="#FFB347" />
          <path d={`M -${6 + 30 * k} 66 L ${6 + 30 * k} 66 L 0 ${66 - 56 * k} Z`} fill="#FFB347" />
        </g>
      );
    }
    case 'drone': {
      const bob = Math.sin(t * 0.25) * 5;
      const sp = Math.sin(t * 2.4);
      return (
        <g transform={T} opacity={o}>
          <g transform={`translate(0 ${bob})`}>
            <path d="M -70 -20 L -26 0 M 70 -20 L 26 0" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={-70} cy={-24} rx={34 * Math.abs(sp) + 8} ry={7} fill="#E8E0D0" stroke={INK} strokeWidth={3} />
            <ellipse cx={70} cy={-24} rx={34 * Math.abs(Math.cos(t * 2.4)) + 8} ry={7} fill="#E8E0D0" stroke={INK} strokeWidth={3} />
            <rect x={-34} y={-12} width={68} height={34} rx={14} fill="#D8DDE8" stroke={INK} strokeWidth={5} />
            <circle cx={0} cy={6} r={10} fill="#1D2033" stroke="#7FE8FF" strokeWidth={3} />
            <circle cx={24} cy={-2} r={4} fill="#FF4D4D" />
          </g>
        </g>
      );
    }
    case 'rover':
      return (
        <g transform={T} opacity={o}>
          <rect x={-70} y={-34} width={140} height={44} rx={10} fill="#E8DFCF" stroke={INK} strokeWidth={5} />
          <rect x={30} y={-66} width={34} height={34} rx={6} fill="#B9C0D0" stroke={INK} strokeWidth={4} />
          <circle cx={46} cy={-50} r={9} fill="#1D2033" stroke="#7FE8FF" strokeWidth={3} />
          <path d="M -40 -34 L -40 -66 L -10 -66" stroke={INK} strokeWidth={5} fill="none" />
          <rect x={-24} y={-62} width={36} height={22} fill="#3A66C4" stroke={INK} strokeWidth={4} />
          {[-52, 0, 52].map((d, i) => <g key={i} transform={`translate(${d} 24) rotate(${t * 6 * (a || 1)})`}><circle r={22} fill="#3A3A46" stroke={INK} strokeWidth={4} /><path d="M -14 0 L 14 0 M 0 -14 L 0 14" stroke="#9AA2B8" strokeWidth={4} /></g>)}
        </g>
      );
    case 'rock': {
      const col = c ?? '#B5654A';
      return (
        <g transform={T} opacity={o}>
          <path d="M -50 18 L -40 -22 L -8 -40 L 28 -30 L 52 4 L 40 24 Z" fill={col} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M -8 -40 L 0 -6 L 28 -30 M 0 -6 L -22 12" stroke={INK} strokeWidth={3} opacity={0.4} fill="none" />
          {pr.v === 'face' ? <g><circle cx={-8} cy={-2} r={5} fill={INK} /><circle cx={16} cy={-2} r={5} fill={INK} /><path d="M -6 12 Q 4 20 14 12" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /></g> : null}
        </g>
      );
    }
    case 'veg': {
      const col = c ?? '#E5484D';
      return (
        <g transform={T} opacity={o}>
          <circle r={34} fill={col} stroke={INK} strokeWidth={5} />
          <circle cx={-11} cy={-12} r={8} fill="#fff" opacity={0.5} />
          <path d="M -12 -32 q 12 -22 24 0 M 0 -32 q -2 -16 -12 -22" stroke="#2E7A34" strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      );
    }
    case 'leaf':
      return (
        <g transform={T} opacity={o}>
          <path d="M 0 40 Q -50 0 0 -50 Q 50 0 0 40 Z" fill={c ?? '#5BBF5B'} stroke="#2E7A34" strokeWidth={5} />
          <path d="M 0 36 L 0 -34" stroke="#2E7A34" strokeWidth={4} />
        </g>
      );
    case 'sprout':
      return (
        <g transform={T} opacity={o}>
          <path d="M 0 40 Q 2 10 0 -8" stroke="#2E7A34" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 0 -4 q -34 -2 -34 -32 q 32 2 34 32 M 0 4 q 30 0 34 -26 q -30 0 -34 26" fill="#6FD36F" stroke="#2E7A34" strokeWidth={4} />
        </g>
      );
    case 'pot': {
      const k = clamp(a);
      return (
        <g transform={T} opacity={o}>
          <path d="M -34 0 L 34 0 L 26 56 L -26 56 Z" fill={pr.v === 'mars' ? '#B5503A' : '#8A5A3A'} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-38} y={-8} width={76} height={14} rx={5} fill={pr.v === 'mars' ? '#C9654A' : '#A06C48'} stroke={INK} strokeWidth={4} />
          <g transform={`translate(0 -8) scale(${0.25 + 0.75 * k})`}>
            <path d="M 0 0 Q 2 -30 0 -50" stroke="#2E7A34" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M 0 -44 q -34 -2 -34 -34 q 32 2 34 34 M 0 -34 q 30 0 34 -26 q -30 0 -34 26" fill="#6FD36F" stroke="#2E7A34" strokeWidth={4} />
          </g>
          {pr.v === 'mars' || pr.v === 'ctrl' ? <g><rect x={-22} y={18} width={44} height={22} rx={3} fill="#FFFDF4" stroke={INK} strokeWidth={3} /><text x={0} y={35} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={19} fill={INK}>{pr.v === 'mars' ? 'MARS' : 'CTRL'}</text></g> : null}
        </g>
      );
    }
    case 'clip':
      return (
        <g transform={T} opacity={o}>
          <rect x={-60} y={-84} width={120} height={160} rx={9} fill="#C99A5E" stroke={INK} strokeWidth={5} />
          <rect x={-48} y={-66} width={96} height={132} fill="#FFFDF4" />
          <rect x={-20} y={-94} width={40} height={20} rx={5} fill="#8E8E9A" stroke={INK} strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} opacity={i < (a || 4) ? 1 : 0.2}>
              <path d={`M -36 ${-40 + i * 25} l 7 9 l 13 -16`} stroke="#2F9E5A" strokeWidth={5} fill="none" />
              <path d={`M -8 ${-34 + i * 25} L 36 ${-34 + i * 25}`} stroke="#9AA" strokeWidth={4} />
            </g>
          ))}
        </g>
      );
    case 'soap':
      return (
        <g transform={T} opacity={o}>
          <rect x={-30} y={-60} width={60} height={110} rx={16} fill="#6EE0C8" stroke={INK} strokeWidth={5} />
          <rect x={-10} y={-92} width={20} height={34} rx={5} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={-6} r={16} fill="#fff" opacity={0.8} />
          <path d="M -12 -6 q 12 -16 24 0" stroke="#2AA89A" strokeWidth={4} fill="none" />
        </g>
      );
    case 'filter':
      return (
        <g transform={T} opacity={o}>
          <rect x={-44} y={-44} width={88} height={88} rx={44} fill="#CDD5E3" stroke={INK} strokeWidth={5} />
          <circle r={26} fill="#8E9AB4" stroke={INK} strokeWidth={4} />
          {[0, 60, 120].map((d) => <path key={d} d="M -22 0 L 22 0" stroke={INK} strokeWidth={4} transform={`rotate(${d})`} />)}
        </g>
      );
    case 'tube':
      return (
        <g transform={T} opacity={o}>
          <rect x={-16} y={-60} width={32} height={112} rx={16} fill="#F6EFE3" fillOpacity={0.5} stroke={INK} strokeWidth={5} />
          <rect x={-12} y={-6} width={24} height={54} rx={12} fill={c ?? '#E5484D'} />
          <rect x={-20} y={-72} width={40} height={16} rx={5} fill="#2B6CB0" stroke={INK} strokeWidth={4} />
        </g>
      );
    case 'ctrl':
      return (
        <g transform={T} opacity={o}>
          <rect x={-90} y={-36} width={180} height={78} rx={34} fill="#3A3F58" stroke={INK} strokeWidth={6} />
          <circle cx={-46} cy={0} r={20} fill="#14172A" stroke="#8C94B8" strokeWidth={4} />
          <circle cx={46} cy={0} r={20} fill="#14172A" stroke="#8C94B8" strokeWidth={4} />
          <circle cx={-18} cy={-18} r={7} fill="#FF7A2E" />
          <circle cx={18} cy={-18} r={7} fill="#5BE08A" />
        </g>
      );
    case 'dog':
      return (
        <g transform={T} opacity={o}>
          <ellipse cx={0} cy={0} rx={52} ry={30} fill="#D9A066" stroke={INK} strokeWidth={5} />
          <circle cx={52} cy={-22} r={26} fill="#D9A066" stroke={INK} strokeWidth={5} />
          <path d="M 42 -42 L 36 -64 L 56 -48 Z" fill="#8A5A3A" stroke={INK} strokeWidth={4} />
          <circle cx={58} cy={-26} r={4} fill={INK} />
          <ellipse cx={74} cy={-20} rx={8} ry={6} fill={INK} />
          <path d={`M -52 -6 q -30 ${-20 + Math.sin(t * 0.8) * 14} -26 -44`} stroke="#D9A066" strokeWidth={10} strokeLinecap="round" fill="none" />
          {[-34, -10, 22, 40].map((d, i) => <rect key={i} x={d - 6} y={18} width={12} height={34} rx={6} fill="#D9A066" stroke={INK} strokeWidth={4} />)}
        </g>
      );
    case 'sun': {
      return (
        <g transform={T} opacity={o}>
          {Array.from({ length: 16 }).map((_, i) => <path key={i} d="M 0 -120 L 0 -190" stroke="#FFF3B0" strokeWidth={10} strokeLinecap="round" transform={`rotate(${i * 22.5 + t * 0.4})`} opacity={0.8} />)}
          <circle r={96} fill="#FFF7C4" opacity={0.5} />
          <circle r={70} fill="#FFF3B0" stroke="#FFFFFF" strokeWidth={8} />
        </g>
      );
    }
    case 'cloud':
      return (
        <g transform={T} opacity={o}>
          <path d="M -80 20 Q -100 -20 -50 -24 Q -40 -64 10 -54 Q 60 -70 76 -22 Q 110 -14 94 20 Z" fill={c ?? '#FFFFFF'} opacity={0.92} />
        </g>
      );
    case 'moon':
      return <g transform={T} opacity={o}><circle r={60} fill="#F0EAD8" stroke="#8A8470" strokeWidth={5} /><circle cx={-18} cy={-12} r={12} fill="#CFC8B0" /><circle cx={20} cy={16} r={9} fill="#CFC8B0" /><circle cx={14} cy={-26} r={6} fill="#CFC8B0" /></g>;
    case 'earth':
      return (
        <g transform={T} opacity={o}>
          <circle r={60} fill="#2C7AD0" stroke="#0E2A55" strokeWidth={5} />
          <path d="M -34 -14 q 14 -28 32 -8 q 8 16 2 30 q -22 10 -34 -22 Z M 14 14 q 22 -10 30 12 q -4 18 -24 18 Z" fill="#58B05A" />
          <ellipse cx={-6} cy={-34} rx={36} ry={8} fill="#fff" opacity={0.7} />
        </g>
      );
    case 'mars':
      return <g transform={T} opacity={o}><circle r={50} fill="#D8582E" stroke="#7A2A18" strokeWidth={5} /><circle cx={-12} cy={-8} r={11} fill="#B03E20" /><circle cx={14} cy={16} r={8} fill="#B03E20" /><path d="M -40 -20 Q 0 -34 40 -20" stroke="#F0A070" strokeWidth={5} fill="none" opacity={0.6} /></g>;
    case 'iss':
      return (
        <g transform={T} opacity={o}>
          <rect x={-130} y={-18} width={72} height={36} fill="#3A66C4" stroke={INK} strokeWidth={4} />
          <rect x={58} y={-18} width={72} height={36} fill="#3A66C4" stroke={INK} strokeWidth={4} />
          <rect x={-58} y={-8} width={116} height={16} fill="#B9C0D0" stroke={INK} strokeWidth={4} />
          <rect x={-22} y={-30} width={44} height={60} rx={8} fill="#E8E0D0" stroke={INK} strokeWidth={5} />
          <path d="M -130 0 L -58 0 M 58 0 L 130 0" stroke={INK} strokeWidth={3} />
        </g>
      );
    case 'ship':
      return (
        <g transform={T} opacity={o}>
          <path d="M 0 -80 Q 34 -30 30 40 L -30 40 Q -34 -30 0 -80 Z" fill="#F1F4FA" stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-18} r={13} fill="#7FD0FF" stroke={INK} strokeWidth={4} />
          <path d="M -30 20 L -54 56 L -30 40 Z M 30 20 L 54 56 L 30 40 Z" fill="#FF7A2E" stroke={INK} strokeWidth={4} />
          <path d="M -14 44 Q 0 86 14 44 Z" fill="#FFB347" />
        </g>
      );
    case 'heart':
      return <g transform={T} opacity={o}><path d="M 0 36 C -70 -8 -40 -60 0 -26 C 40 -60 70 -8 0 36 Z" fill={c ?? '#FF5A7A'} stroke={INK} strokeWidth={5} strokeLinejoin="round" /></g>;
    case 'star':
      return <g transform={T} opacity={o}><path d="M 0 -50 L 14 -16 L 50 -14 L 22 8 L 32 44 L 0 24 L -32 44 L -22 8 L -50 -14 L -14 -16 Z" fill={c ?? '#FFE27A'} stroke={INK} strokeWidth={4} strokeLinejoin="round" /></g>;
    case 'check':
      return <g transform={T} opacity={o}><circle r={48} fill="#2F9E5A" stroke={INK} strokeWidth={5} /><path d="M -22 2 L -6 20 L 26 -18" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
    case 'x':
      return <g transform={T} opacity={o}><path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke={c ?? '#FF5A4A'} strokeWidth={18} strokeLinecap="round" /></g>;
    case 'qm':
      return <g transform={T} opacity={o}><text textAnchor="middle" y={34} fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={c ?? '#FFE27A'} stroke={INK} strokeWidth={12} paintOrder="stroke">?</text></g>;
    case 'zzz':
      return <g transform={T} opacity={o}>{[0, 1, 2].map((i) => <text key={i} x={i * 30} y={-i * 34 + Wob(t, 4, 0.2 + i * 0.1)} fontFamily={FONT.title} fontWeight={800} fontSize={44 + i * 14} fill="#FFF1D0" stroke={INK} strokeWidth={5} paintOrder="stroke">Z</text>)}</g>;
    case 'sweat':
      return <g transform={T} opacity={o}><path d="M 0 -40 Q 26 4 0 26 Q -26 4 0 -40 Z" fill="#8FD8FF" stroke={INK} strokeWidth={4} /></g>;
    case 'steam':
      return <g transform={T} opacity={o}>{[-18, 0, 18].map((d, i) => <path key={i} d={`M ${d} 20 q 12 -22 0 -40 q -12 -20 0 -40`} stroke="#FFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} transform={`translate(0 ${Math.sin(t * 0.2 + i) * 6})`} />)}</g>;
    case 'plate':
      return <g transform={T} opacity={o}><ellipse rx={60} ry={14} fill="#F6EFE3" stroke={INK} strokeWidth={4} /><ellipse rx={36} ry={7} fill="#E9DDC6" />{pr.v === 'veg' ? <circle cy={-16} r={14} fill="#E5484D" stroke={INK} strokeWidth={3.5} /> : null}</g>;
    case 'arrow':
      return <g transform={T} opacity={o}><path d="M -110 0 L 90 0 M 90 0 L 46 -40 M 90 0 L 46 40" stroke={c ?? '#FFF6E2'} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>;
    case 'ring':
      return <g transform={T} opacity={o}><circle r={90} fill="none" stroke={c ?? '#FF8A3D'} strokeWidth={10} strokeDasharray="24 16" /></g>;
    case 'figure': {
      // a tiny background person: v = hat kind
      return (
        <g transform={T} opacity={o}>
          <circle cy={-60} r={18} fill="#F6EFE3" stroke={INK} strokeWidth={4} />
          <path d="M 0 -42 L 0 14 M -22 -24 L 0 -34 L 22 -24 M 0 14 L -16 52 M 0 14 L 16 52" stroke={c ?? '#FFB347'} strokeWidth={9} strokeLinecap="round" fill="none" />
          {pr.v === 'cheer' ? <path d="M -22 -24 L -34 -52 M 22 -24 L 34 -52" stroke={c ?? '#FFB347'} strokeWidth={9} strokeLinecap="round" /> : null}
        </g>
      );
    }
    case 'lawnmower':
      return (
        <g transform={T} opacity={o}>
          <rect x={-50} y={-20} width={100} height={40} rx={8} fill="#E5484D" stroke={INK} strokeWidth={5} />
          <path d="M 50 -10 L 96 -70 L 114 -70" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          {[-30, 30].map((d, i) => <circle key={i} cx={d} cy={26} r={16} fill="#3A3A46" stroke={INK} strokeWidth={4} />)}
        </g>
      );
    case 'badge':
      return (
        <g transform={T} opacity={o}>
          <rect x={-120} y={-34} width={240} height={68} rx={34} fill={c ?? '#FFF8E8'} stroke={INK} strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(40, 440 / Math.max(6, String(pr.v ?? '').length))} fill={INK}>{String(pr.v ?? '')}</text>
        </g>
      );
    case 'visor':
      return <g transform={T} opacity={o}><rect x={-120} y={-80} width={240} height={160} rx={60} fill="#BFE6FF" fillOpacity={0.12} stroke="#E8F4FF" strokeWidth={8} /><path d="M -90 -40 Q -60 -66 -30 -62" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} /></g>;
    default:
      return null;
  }
};
export { rnd, sm, lerp };
