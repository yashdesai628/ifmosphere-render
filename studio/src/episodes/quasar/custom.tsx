import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import type { ActionArgs, Registry } from './render';
import type { Pose } from '../../brand';

const mixLimb = (a: { a: number; b: number }, b: { a: number; b: number }, k: number) => ({
  a: lerp(a.a, b.a, k),
  b: lerp(a.b, b.b, k),
});

/** Pip tilts head back, arms loose, small sway; eyes lift at p 0.2. */
const lookup = ({ from, t, len, p }: ActionArgs): Pose => {
  const ant = clamp(p / 0.2);
  const m = clamp((p - 0.2) / 0.35);
  const k = backOut(m);
  const sw = Math.sin(t / 11) * 3;

  return {
    ...from,
    headTilt: lerp(from.headTilt, -24, k) + 3 * Math.sin(Math.PI * ant) * (1 - m) + settle(t - 0.55 * len, 3.5),
    tilt: lerp(from.tilt, -5, k) + 2 * Math.sin(Math.PI * ant) * (1 - m) + sw * 0.4,
    look: lerp(from.look, 0.72, easeOut(m)),
    yaw: lerp(from.yaw, 0.25, k),
    armL: mixLimb(from.armL, { a: 18 + sw, b: -14 }, k),
    armR: mixLimb(from.armR, { a: 22 - sw, b: -14 }, k),
    squash: from.squash + 0.055 * Math.sin(Math.PI * ant) * (1 - m),
  };
};

/** Pip drops into a crouch with both arms over the head at p 0.15 and holds with a small tremble. */
const duck = ({ from, t, len, p }: ActionArgs): Pose => {
  const ant = clamp(p / 0.15);
  const m = clamp((p - 0.15) / 0.22);
  const k = backOut(m);
  const hold = clamp((p - 0.32) / 0.15);
  const tremble = hold * Math.sin(t * 2.1) * 2.6;

  return {
    ...from,
    x: from.x + tremble,
    squash: lerp(from.squash, 0.25, k) - 0.045 * Math.sin(Math.PI * ant) * (1 - m),
    tilt: lerp(from.tilt, 8, k) + tremble * 0.8 + settle(t - 0.37 * len, 3),
    headTilt: lerp(from.headTilt, 16, k) + hold * Math.cos(t * 2.4) * 2,
    armL: mixLimb(from.armL, { a: 152, b: 74 }, k),
    armR: mixLimb(from.armR, { a: 152, b: 74 }, k),
    legL: mixLimb(from.legL, { a: 32, b: -64 }, k),
    legR: mixLimb(from.legR, { a: -32, b: -64 }, k),
  };
};

/** Pip turns one slow full rotation across the shot while looking around. */
const spin = ({ from, t, len, p }: ActionArgs): Pose => {
  const rot = lerp(0, 360, easeInOut(p));
  const m = clamp(p / 0.2);

  return {
    ...from,
    spin: from.spin + rot,
    yaw: Math.sin(p * Math.PI * 2) * 0.65,
    look: Math.sin(p * Math.PI * 4) * 0.85,
    headTilt: Math.cos(p * Math.PI * 3) * 9 + settle(t - 0.9 * len, 3),
    armL: mixLimb(from.armL, { a: 62, b: -18 }, backOut(m)),
    armR: mixLimb(from.armR, { a: 62, b: -18 }, backOut(m)),
    squash: from.squash - 0.04 * Math.sin(Math.PI * p),
  };
};

/** Quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
const flinch = ({ from, to, t, len, p }: ActionArgs): Pose => {
  const rise = easeOut(clamp((p - 0.1) / 0.14));
  const recov = easeInOut(clamp((p - 0.28) / 0.42));
  const k = rise * (1 - recov);
  const dir = from.facing || 1;
  const wob = settle(t - 0.32 * len, 5);

  return {
    ...from,
    squash: lerp(from.squash, 0.21, k),
    tilt: lerp(from.tilt, -17 * dir, k) + wob * 0.5,
    headTilt: lerp(from.headTilt, -13, k) + wob,
    yaw: lerp(from.yaw, -0.45 * dir, k),
    armL: mixLimb(mixLimb(from.armL, to.armL, recov), { a: 118, b: 54 }, k),
    armR: mixLimb(mixLimb(from.armR, to.armR, recov), { a: 114, b: 50 }, k),
  };
};

/** Pip's arm swings up to point up at p 0.2 with a small overshoot. */
const pointup = ({ from, t, len, p }: ActionArgs): Pose => {
  const ant = clamp(p / 0.2);
  const m = clamp((p - 0.2) / 0.3);
  const k = backOut(m);

  return {
    ...from,
    handR: m > 0.35 ? 'point' : from.handR,
    armR: mixLimb(from.armR, { a: 168, b: 0 }, k),
    armL: mixLimb(from.armL, { a: 16, b: -12 }, k),
    headTilt: lerp(from.headTilt, -12, k) + settle(t - 0.5 * len, 3),
    tilt: lerp(from.tilt, -4, k),
    look: lerp(from.look, 0.45, easeOut(m)),
    squash: from.squash + 0.06 * Math.sin(Math.PI * ant) * (1 - m),
  };
};

export const ACTIONS: NonNullable<Registry['actions']> = {
  lookup,
  duck,
  spin,
  flinch,
  pointup,
};

export const CUSTOM: NonNullable<Registry['custom']> = {};
