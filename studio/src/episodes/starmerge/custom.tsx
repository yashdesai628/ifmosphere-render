import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import type { Pose } from '../../brand';
import type { ActionArgs, Registry } from './render';

const mixLimb = (a: { a: number; b: number }, b: { a: number; b: number }, u: number) => ({
  a: lerp(a.a, b.a, u),
  b: lerp(a.b, b.b, u),
});

/** Pip tilts head back to look up, arms hang loose with small sway; eyes lift at p 0.2. */
const lookupAction = ({ from, to, t, len, p }: ActionArgs): Pose => {
  const x = lerp(from.x, to.x, easeInOut(p));
  const ant = clamp(p / 0.18);
  const mv = backOut(clamp((p - 0.18) / 0.34));
  const swayArm = Math.sin(t * 0.08) * 5;
  const headTilt = lerp(from.headTilt, -20, mv) + 4 * Math.sin(Math.PI * ant) * (1 - clamp((p - 0.18) / 0.2)) + settle(t - 0.35 * len, 3);
  return {
    ...from,
    x,
    armL: { a: lerp(from.armL.a, 14, mv) + swayArm, b: lerp(from.armL.b, -12, mv) },
    armR: { a: lerp(from.armR.a, 14, mv) - swayArm, b: lerp(from.armR.b, -12, mv) },
    headTilt,
    look: p >= 0.2 ? lerp(from.look, 0.35, easeOut(clamp((p - 0.2) / 0.25))) : from.look,
    yaw: lerp(from.yaw, 0.22 * from.facing, mv),
  };
};

/** Pip drops into a crouch with both arms raised over the head at p 0.15 and holds with a small tremble. */
const duckAction = ({ from, to, t, p }: ActionArgs): Pose => {
  const x = lerp(from.x, to.x, easeInOut(p));
  const ant = clamp(p / 0.15);
  const mv = backOut(clamp((p - 0.15) / 0.22));
  const hold = clamp((p - 0.3) / 0.15);
  const tremble = hold * Math.sin(t * 1.45) * 2.5;
  return {
    ...from,
    x: x + tremble * 1.4,
    squash: lerp(from.squash, 0.24, mv) - 0.05 * Math.sin(Math.PI * ant) * (1 - clamp((p - 0.15) / 0.15)),
    armL: mixLimb(from.armL, { a: 152, b: 68 }, mv),
    armR: mixLimb(from.armR, { a: 152, b: 68 }, mv),
    legL: mixLimb(from.legL, { a: 30, b: -60 }, mv),
    legR: mixLimb(from.legR, { a: -30, b: -60 }, mv),
    headTilt: lerp(from.headTilt, -12, mv) + tremble,
    tilt: lerp(from.tilt, 6 * from.facing, mv) + tremble * 0.5,
  };
};

/** Pip turns one slow full rotation across the shot while looking up. */
const spinAction = ({ from, to, t, p }: ActionArgs): Pose => {
  const x = lerp(from.x, to.x, easeInOut(p));
  const e = easeInOut(p);
  return {
    ...from,
    x,
    spin: lerp(0, 360, e),
    yaw: Math.sin(e * Math.PI * 2) * 0.65,
    headTilt: -16 + Math.sin(t * 0.1) * 3,
    look: 0.3,
    armL: mixLimb(from.armL, { a: 72, b: -20 }, 0.8),
    armR: mixLimb(from.armR, { a: 72, b: -20 }, 0.8),
    legL: mixLimb(from.legL, { a: 14, b: -22 }, 0.8),
    legR: mixLimb(from.legR, { a: -14, b: -22 }, 0.8),
  };
};

/** Quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
const flinchAction = ({ from, to, t, len, p }: ActionArgs): Pose => {
  const x = lerp(from.x, to.x, easeInOut(p));
  const hit = backOut(clamp((p - 0.14) / 0.16));
  const rec = easeOut(clamp((p - 0.32) / 0.38));
  const peak = hit * (1 - rec);
  const w = settle(t - 0.22 * len, 6, 1.3, 9);
  return {
    ...from,
    x: x - peak * 14 * from.facing,
    squash: lerp(from.squash, to.squash, rec) + peak * 0.18,
    tilt: lerp(from.tilt, to.tilt, rec) - peak * 14 * from.facing + w * 0.4,
    headTilt: lerp(from.headTilt, to.headTilt, rec) - peak * 14 + w,
    armL: mixLimb(from.armL, { a: 132, b: 36 }, peak),
    armR: mixLimb(from.armR, { a: 132, b: 36 }, peak),
  };
};

/** Pip's arm swings up to point at the sky at p 0.2 with a small overshoot. */
const pointupAction = ({ from, to, t, len, p }: ActionArgs): Pose => {
  const x = lerp(from.x, to.x, easeInOut(p));
  const ant = clamp(p / 0.2);
  const mv = backOut(clamp((p - 0.2) / 0.28));
  const ov = settle(t - 0.42 * len, 6, 1.3, 10);
  const armR = { a: lerp(from.armR.a, 168, mv) - 10 * Math.sin(Math.PI * ant) * (1 - clamp((p - 0.2) / 0.2)) + ov, b: lerp(from.armR.b, 0, mv) };
  return {
    ...from,
    x,
    armR,
    armL: mixLimb(from.armL, { a: 14, b: -12 }, mv),
    handR: mv > 0.35 ? 'point' : from.handR,
    headTilt: lerp(from.headTilt, -16, mv) + ov * 0.5,
    look: lerp(from.look, 0.45, mv),
    yaw: lerp(from.yaw, 0.28 * from.facing, mv),
    squash: from.squash + 0.05 * Math.sin(Math.PI * ant) * (1 - clamp((p - 0.2) / 0.2)),
  };
};

export const ACTIONS: NonNullable<Registry['actions']> = {
  lookup: lookupAction,
  duck: duckAction,
  spin: spinAction,
  flinch: flinchAction,
  pointup: pointupAction,
};

export const CUSTOM: NonNullable<Registry['custom']> = {};
