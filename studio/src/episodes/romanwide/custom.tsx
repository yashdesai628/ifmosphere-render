import { backOut, clamp, easeInOut, easeOut, kf, lerp, settle } from '../../engine/anim';
import type { ActionArgs, Registry } from './render';

const mixPose = (a: ActionArgs['from'], b: ActionArgs['to'], m: number) => ({
  armL: { a: lerp(a.armL.a, b.armL.a, m), b: lerp(a.armL.b, b.armL.b, m) },
  armR: { a: lerp(a.armR.a, b.armR.a, m), b: lerp(a.armR.b, b.armR.b, m) },
  legL: { a: lerp(a.legL.a, b.legL.a, m), b: lerp(a.legL.b, b.legL.b, m) },
  legR: { a: lerp(a.legR.a, b.legR.a, m), b: lerp(a.legR.b, b.legR.b, m) },
});

/** 1. lookup: Pip tilts head back to gaze skyward, loose hanging arms, eyes lift at p 0.2. */
const lookupAction = ({ from, to, t, len, p }: ActionArgs) => {
  const ant = Math.sin(Math.PI * clamp(p / 0.18));
  const move = backOut(clamp((p - 0.16) / 0.34));
  const eyeLift = easeOut(clamp((p - 0.2) / 0.22));
  const swayArm = Math.sin(t / 13) * 3.5;

  return {
    ...from,
    headTilt: lerp(from.headTilt, -20, move) + settle(t - 0.5 * len, 3.2),
    look: lerp(from.look, 0.55 * from.facing, eyeLift),
    tilt: lerp(from.tilt, -4 * from.facing, easeInOut(clamp(p / 0.4))),
    squash: lerp(0, -0.025, move) + 0.045 * ant,
    armL: { a: lerp(from.armL.a, 14, move) + swayArm, b: lerp(from.armL.b, -12, move) },
    armR: { a: lerp(from.armR.a, 16, move) - swayArm, b: lerp(from.armR.b, -10, move) },
    yaw: lerp(from.yaw, to.yaw, move),
  };
};

/** 2. duck: Anticipation rise then drop into crouch with arms over head at p 0.15 and small tremble. */
const duckAction = ({ from, t, len, p }: ActionArgs) => {
  const ant = Math.sin(Math.PI * clamp(p / 0.12));
  const drop = backOut(clamp((p - 0.12) / 0.2));
  const tremble = p > 0.22 ? Math.sin(t * 2.1) * 1.5 : 0;

  return {
    ...from,
    x: from.x + tremble * 1.4,
    squash: lerp(0, 0.25, drop) - 0.05 * ant,
    tilt: tremble,
    headTilt: lerp(from.headTilt, 15, drop) + settle(t - 0.32 * len, 3),
    armL: { a: lerp(from.armL.a, -142, drop), b: lerp(from.armL.b, -72, drop) },
    armR: { a: lerp(from.armR.a, -142, drop), b: lerp(from.armR.b, -72, drop) },
    legL: { a: lerp(from.legL.a, 34, drop), b: lerp(from.legL.b, -66, drop) },
    legR: { a: lerp(from.legR.a, -34, drop), b: lerp(from.legR.b, -66, drop) },
  };
};

/** 3. spin: Full smooth rotation across the shot while looking upward. */
const spinAction = ({ from, p }: ActionArgs) => {
  const e = easeInOut(p);
  return {
    ...from,
    spin: lerp(0, 360 * from.facing, e),
    yaw: Math.sin(e * Math.PI * 2) * 0.85,
    headTilt: -14,
    squash: -0.04 * Math.sin(p * Math.PI),
    armL: { a: lerp(from.armL.a, 58, Math.sin(p * Math.PI)), b: -16 },
    armR: { a: lerp(from.armR.a, 58, Math.sin(p * Math.PI)), b: -16 },
  };
};

/** 4. flinch: Quick squash & lean away at p 0.2 with arms up, then settles back by p 0.7. */
const flinchAction = ({ from, to, t, len, p }: ActionArgs) => {
  const f = kf(p, [
    [0, 0],
    [0.12, -0.1],
    [0.22, 1],
    [0.45, 0.65],
    [0.7, 0],
    [1, 0],
  ]);
  const res = clamp((p - 0.5) / 0.35);
  const limbs = mixPose(from, to, easeOut(res));

  return {
    ...from,
    ...limbs,
    squash: 0.18 * Math.max(0, f) + 0.04 * Math.min(0, f),
    tilt: -13 * from.facing * f + settle(t - 0.25 * len, 3.5),
    headTilt: lerp(from.headTilt, -12, clamp(f)) + settle(t - 0.65 * len, 2.5),
    armL: { a: lerp(limbs.armL.a, -112, Math.max(0, f)), b: lerp(limbs.armL.b, -55, Math.max(0, f)) },
    armR: { a: lerp(limbs.armR.a, -112, Math.max(0, f)), b: lerp(limbs.armR.b, -55, Math.max(0, f)) },
  };
};

/** 5. pointup: Anticipation dip then arm swings up to point at the sky at p 0.2 with overshoot & settle. */
const pointupAction = ({ from, to, t, len, p }: ActionArgs) => {
  const ant = Math.sin(Math.PI * clamp(p / 0.18));
  const m = clamp((p - 0.18) / 0.28);
  const bo = backOut(m);

  return {
    ...from,
    handR: m > 0.45 ? ('point' as const) : from.handR,
    armR: {
      a: lerp(from.armR.a, 168, bo) + settle(t - 0.46 * len, 5),
      b: lerp(from.armR.b, 0, bo),
    },
    armL: { a: lerp(from.armL.a, 16, bo), b: lerp(from.armL.b, -12, bo) },
    headTilt: lerp(from.headTilt, -14, easeOut(m)) + settle(t - 0.46 * len, 2.5),
    look: lerp(from.look, 0.4 * from.facing, easeOut(m)),
    squash: -0.04 * easeOut(m) + 0.06 * ant,
    yaw: lerp(from.yaw, to.yaw, easeOut(m)),
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
