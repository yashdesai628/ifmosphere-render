import type { Pose } from '../../brand';
import { PIP_POSES } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, kf, settle } from '../../engine/anim';
import type { ActionArgs, Registry } from './render';

const mixLimb = (u: { a: number; b: number }, v: { a: number; b: number }, k: number) => ({
  a: lerp(u.a, v.a, k),
  b: lerp(u.b, v.b, k),
});

/** Pip tilts head back, arms loose, small sway; eyes lift at p 0.2. */
const lookupAction = ({ from, t, len, p }: ActionArgs): Pose => {
  const anti = Math.sin(Math.PI * clamp(p / 0.18));
  const m = backOut(clamp((p - 0.16) / 0.28));
  const eyeLift = easeOut(clamp((p - 0.2) / 0.22));
  const swayArm = Math.sin(t * 0.08) * 5;
  return {
    ...from,
    headTilt: lerp(from.headTilt, -16, m) + settle(t - 0.44 * len, 3),
    look: lerp(from.look, 0.35, eyeLift),
    yaw: lerp(from.yaw, 0.22, m),
    tilt: Math.sin(t * 0.07) * 2.4,
    squash: from.squash + 0.05 * anti * (1 - clamp((p - 0.16) / 0.18)),
    armL: { a: from.armL.a + swayArm, b: -14 },
    armR: { a: from.armR.a - swayArm, b: -14 },
  };
};

/** Pip drops into a crouch with both arms over the head at p 0.15 and holds with a small tremble. */
const duckAction = ({ from, t, len, p }: ActionArgs): Pose => {
  const anti = Math.sin(Math.PI * clamp(p / 0.12));
  const m = backOut(clamp((p - 0.12) / 0.2));
  const holdAmt = clamp((p - 0.3) / 0.15);
  const tremble = Math.sin(t * 1.15) * 1.9 * holdAmt;
  const crouchPose = PIP_POSES.crouch;
  return {
    ...from,
    squash: lerp(from.squash, crouchPose.squash, m) - 0.04 * anti * (1 - m),
    legL: mixLimb(from.legL, crouchPose.legL, m),
    legR: mixLimb(from.legR, crouchPose.legR, m),
    armL: mixLimb(from.armL, { a: 148, b: 86 }, m),
    armR: mixLimb(from.armR, { a: 148, b: 86 }, m),
    headTilt: lerp(from.headTilt, 16, m) + settle(t - 0.32 * len, 3),
    tilt: tremble,
  };
};

/** Pip turns one slow full rotation across the shot while looking around. */
const spinAction = ({ from, t, p }: ActionArgs): Pose => {
  const u = easeInOut(p);
  const yaw = kf(u, [
    [0, 0],
    [0.25, 1],
    [0.5, 0],
    [0.75, -1],
    [1, 0],
  ]);
  const scan = Math.sin(u * Math.PI * 4) * 0.65;
  const step = Math.sin(u * Math.PI * 4) * 14;
  return {
    ...from,
    facing: u > 0.25 && u < 0.75 ? -1 : 1,
    yaw,
    look: scan,
    headTilt: Math.sin(t * 0.12) * 5,
    armL: { a: 26 + step * 0.6, b: -18 },
    armR: { a: 26 - step * 0.6, b: -18 },
    legL: { a: step, b: -Math.abs(step) * 0.7 },
    legR: { a: -step, b: -Math.abs(step) * 0.7 },
  };
};

/** Quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
const flinchAction = ({ from, t, len, p }: ActionArgs): Pose => {
  const inF = easeOut(clamp((p - 0.12) / 0.14));
  const outF = easeInOut(clamp((p - 0.28) / 0.42));
  const env = inF * (1 - outF);
  return {
    ...from,
    squash: lerp(from.squash, 0.2, env),
    tilt: lerp(from.tilt, -14 * from.facing, env) + settle(t - 0.55 * len, 2.5) * outF,
    headTilt: lerp(from.headTilt, -12, env),
    armL: mixLimb(from.armL, { a: 118, b: 64 }, env),
    armR: mixLimb(from.armR, { a: 128, b: 68 }, env),
  };
};

/** Pip's arm swings up to point up at p 0.2 with a small overshoot. */
const pointupAction = ({ from, t, len, p }: ActionArgs): Pose => {
  const anti = Math.sin(Math.PI * clamp(p / 0.16));
  const m = backOut(clamp((p - 0.16) / 0.26));
  const up = PIP_POSES.pointUp;
  return {
    ...from,
    ...(m > 0.4 ? { handR: up.handR } : {}),
    armR: {
      a: lerp(from.armR.a - 12 * anti, up.armR.a, m) + settle(t - 0.42 * len, 4),
      b: lerp(from.armR.b, up.armR.b, m),
    },
    armL: mixLimb(from.armL, up.armL, m),
    headTilt: lerp(from.headTilt, -10, m) + settle(t - 0.42 * len, 3),
    look: lerp(from.look, 0.3, m),
    squash: from.squash + 0.05 * anti * (1 - m) - 0.03 * m,
  };
};

export const ACTIONS: Registry['actions'] = {
  lookup: lookupAction,
  duck: duckAction,
  spin: spinAction,
  flinch: flinchAction,
  pointup: pointupAction,
};

export const CUSTOM: Registry['custom'] = {};
