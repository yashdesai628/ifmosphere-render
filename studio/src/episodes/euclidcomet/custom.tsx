import type { ActionArgs, Registry } from './render';
import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import type { Pose } from '../../brand';

/** Pip tilts head back to gaze skyward with loose gently swaying arms; eyes lift at p 0.2. */
const lookup = ({ from, t, len, p }: ActionArgs): Pose => {
  const anti = clamp(p / 0.18);
  const m = clamp((p - 0.18) / 0.28);
  const e = backOut(m);
  const eyeUp = easeOut(clamp((p - 0.2) / 0.14));
  const armSway = Math.sin(t / 13) * 5;
  const head = lerp(from.headTilt + 4 * Math.sin(Math.PI * anti), -20, e) + settle(t - 0.46 * len, 3);
  return {
    ...from,
    headTilt: head,
    look: lerp(from.look, 0.62, eyeUp),
    tilt: lerp(from.tilt, -3, e),
    squash: from.squash + 0.05 * Math.sin(Math.PI * anti) * (1 - m),
    armL: { a: lerp(from.armL.a, 14 + armSway, e), b: lerp(from.armL.b, -12, e) },
    armR: { a: lerp(from.armR.a, 14 - armSway, e), b: lerp(from.armR.b, -10, e) },
  };
};

/** Pip drops into a crouch with both arms raised shielding the head at p 0.15 and trembles. */
const duck = ({ from, t, len, p }: ActionArgs): Pose => {
  const anti = clamp(p / 0.1);
  const m = clamp((p - 0.1) / 0.18);
  const e = backOut(m);
  const trem = p > 0.28 ? Math.sin(t * 1.9) * 2.2 : 0;
  return {
    ...from,
    x: from.x + trem * 0.7,
    squash: lerp(from.squash - 0.04 * Math.sin(Math.PI * anti), 0.23, e) + settle(t - 0.28 * len, 0.03),
    headTilt: lerp(from.headTilt, 14, e) + trem,
    tilt: lerp(from.tilt, 4, e) + trem * 0.5,
    armL: { a: lerp(from.armL.a, 148 + trem, e), b: lerp(from.armL.b, 56, e) },
    armR: { a: lerp(from.armR.a, 148 - trem, e), b: lerp(from.armR.b, 56, e) },
    legL: { a: lerp(from.legL.a, 30, e), b: lerp(from.legL.b, -60, e) },
    legR: { a: lerp(from.legR.a, -30, e), b: lerp(from.legR.b, -60, e) },
  };
};

/** Pip turns one slow full rotation across the shot while looking up. */
const spin = ({ from, p }: ActionArgs): Pose => {
  const e = easeInOut(p);
  const ang = e * Math.PI * 2;
  const flipped = e > 0.25 && e < 0.75;
  return {
    ...from,
    y: from.y - 18 * Math.sin(Math.PI * e),
    facing: flipped ? ((-from.facing) as 1 | -1) : from.facing,
    yaw: Math.sin(ang),
    spin: 8 * Math.sin(ang),
    headTilt: -16,
    look: 0.45,
    armL: { a: 42, b: -16 },
    armR: { a: 42, b: -16 },
  };
};

/** Quick squash and lean away at p 0.2 with arms up, settling cleanly back by p 0.7. */
const flinch = ({ from, t, len, p }: ActionArgs): Pose => {
  const rise = easeOut(clamp((p - 0.08) / 0.14));
  const fall = easeInOut(clamp((p - 0.22) / 0.48));
  const f = rise * (1 - fall);
  const s = settle(t - 0.7 * len, 3.5);
  return {
    ...from,
    x: from.x - 16 * from.facing * f,
    squash: from.squash + 0.19 * f,
    tilt: from.tilt - 13 * from.facing * f + s * 0.3,
    headTilt: from.headTilt - 10 * f + s,
    armL: { a: lerp(from.armL.a, 128, f), b: lerp(from.armL.b, 44, f) },
    armR: { a: lerp(from.armR.a, 132, f), b: lerp(from.armR.b, 44, f) },
  };
};

/** Pip's arm swings up to point at the sky at p 0.2 with anticipation, overshoot, and settle. */
const pointup = ({ from, t, len, p }: ActionArgs): Pose => {
  const anti = clamp(p / 0.18);
  const m = clamp((p - 0.18) / 0.28);
  const e = backOut(m);
  const s = settle(t - 0.46 * len, 4.5);
  return {
    ...from,
    ...(m > 0.45 ? { handR: 'point' as const } : {}),
    squash: from.squash + 0.05 * Math.sin(Math.PI * anti) * (1 - m),
    headTilt: lerp(from.headTilt, -16, e) + s * 0.4,
    look: lerp(from.look, 0.55, easeOut(m)),
    armR: { a: lerp(from.armR.a - 14 * Math.sin(Math.PI * anti), 168, e) + s, b: lerp(from.armR.b, 0, e) },
    armL: { a: lerp(from.armL.a, 14, e), b: lerp(from.armL.b, -12, e) },
  };
};

export const ACTIONS: Registry['actions'] = {
  lookup,
  duck,
  spin,
  flinch,
  pointup,
};

export const CUSTOM: Registry['custom'] = {};
