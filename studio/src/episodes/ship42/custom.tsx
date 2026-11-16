import type { Pose } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import type { ActionArgs, Registry } from './render';

type Limb = { a: number; b: number };
const mixLimb = (u: Limb, v: Limb, k: number): Limb => ({ a: lerp(u.a, v.a, k), b: lerp(u.b, v.b, k) });

export const ACTIONS: NonNullable<Registry['actions']> = {
  /** Pip tilts head back to gaze up at the sky, claws hanging loose with a gentle sway. */
  lookup: ({ from, t, len, p }: ActionArgs): Pose => {
    const anti = clamp(p / 0.16);
    const lift = easeOut(clamp((p - 0.14) / 0.26));
    const eyeLift = easeOut(clamp((p - 0.2) / 0.2));
    return {
      ...from,
      armL: mixLimb(from.armL, { a: 8 + Math.sin(t / 13) * 3, b: -12 }, lift),
      armR: mixLimb(from.armR, { a: 12 - Math.sin(t / 13) * 3, b: -14 }, lift),
      headTilt: lerp(from.headTilt, -24, lift) + settle(t - 0.32 * len, 3.5),
      look: lerp(from.look, 0.38, eyeLift),
      yaw: lerp(from.yaw, 0.22, lift),
      tilt: Math.sin(t / 14) * 1.6,
      squash: 0.04 * Math.sin(Math.PI * anti) * (1 - lift),
      sway: Math.sin(t / 10) * 5,
    };
  },

  /** Pip drops into a protective crouch with both claws raised over the head at p 0.15 and trembles. */
  duck: ({ from, t, p }: ActionArgs): Pose => {
    const anti = clamp(p / 0.15);
    const drop = backOut(clamp((p - 0.15) / 0.18));
    const hold = clamp((p - 0.28) / 0.12);
    const tremble = hold * Math.sin(t * 2.1);
    return {
      ...from,
      armL: mixLimb(from.armL, { a: 148, b: -102 }, drop),
      armR: mixLimb(from.armR, { a: 148, b: -102 }, drop),
      legL: mixLimb(from.legL, { a: 34, b: -68 }, drop),
      legR: mixLimb(from.legR, { a: -34, b: -68 }, drop),
      headTilt: lerp(from.headTilt, 15, drop) + tremble * 1.8,
      tilt: tremble * 2.2,
      squash: lerp(-0.05 * Math.sin(Math.PI * anti), 0.25, drop),
    };
  },

  /** Pip performs one slow full rotation across the shot while looking upward. */
  spin: ({ from, t, p }: ActionArgs): Pose => {
    const e = easeInOut(p);
    return {
      ...from,
      spin: lerp(0, 360, e),
      yaw: Math.sin(e * Math.PI * 2) * 0.55,
      headTilt: -18 + Math.sin(t / 11) * 2,
      look: 0.25,
      armL: { a: 62, b: -22 },
      armR: { a: 62, b: -22 },
      squash: -0.04 * Math.sin(Math.PI * p),
    };
  },

  /** Quick defensive squash and lean away at p 0.2 with claws up, settling back by p 0.7. */
  flinch: ({ from, t, len, p, spec }: ActionArgs): Pose => {
    const hit = easeOut(clamp(p / 0.2));
    const recover = easeInOut(clamp((p - 0.22) / 0.48));
    const k = hit * (1 - recover);
    const dir = spec.facing ?? from.facing ?? 1;
    return {
      ...from,
      armL: mixLimb(from.armL, { a: 112, b: -54 }, k),
      armR: mixLimb(from.armR, { a: 118, b: -48 }, k),
      headTilt: lerp(from.headTilt, -14, k) + settle(t - 0.24 * len, 4),
      tilt: lerp(from.tilt, -13 * dir, k) + settle(t - 0.24 * len, 3),
      squash: lerp(0, 0.21, k),
    };
  },

  /** Pip's claw swings up to point at the sky at p 0.2 with overshoot and settle. */
  pointup: ({ from, t, len, p }: ActionArgs): Pose => {
    const anti = clamp(p / 0.18);
    const swing = backOut(clamp((p - 0.18) / 0.24));
    const antiPull = Math.sin(Math.PI * anti) * (1 - clamp((p - 0.18) / 0.1));
    return {
      ...from,
      armL: mixLimb(from.armL, { a: 14, b: -12 }, swing),
      armR: mixLimb({ a: lerp(from.armR.a, -18, antiPull), b: -18 }, { a: 168, b: 0 }, swing),
      handR: swing > 0.4 ? 'point' : from.handR,
      headTilt: lerp(from.headTilt, -16, swing) + settle(t - 0.36 * len, 3.5),
      yaw: lerp(from.yaw, 0.25, swing),
      look: lerp(from.look, 0.4, swing),
      squash: 0.06 * antiPull,
    };
  },
};

export const CUSTOM: Registry['custom'] = {};
