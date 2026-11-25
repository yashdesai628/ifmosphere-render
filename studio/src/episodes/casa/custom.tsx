import { clamp, lerp, easeInOut, backOut, kf, settle } from '../../engine/anim';
import type { Pose } from '../../brand';
import type { ActionArgs, Registry } from './render';

export const ACTIONS: NonNullable<Registry['actions']> = {
  /** Pip tilts head back, arms loose, small sway; eyes lift at p 0.2. */
  lookup: ({ from, t, len, p }: ActionArgs): Pose => {
    const a = clamp(p / 0.2);
    const m = backOut(clamp((p - 0.2) / 0.3));
    const sway = Math.sin(t / 13) * 4;
    return {
      ...from,
      armL: { a: lerp(from.armL.a, 14, m) + sway, b: lerp(from.armL.b, -14, m) },
      armR: { a: lerp(from.armR.a, 16, m) - sway, b: lerp(from.armR.b, -16, m) },
      headTilt: lerp(from.headTilt, -18 * from.facing, m) + settle(t - 0.5 * len, 3.5),
      tilt: lerp(from.tilt, -4 * from.facing, m) + Math.sin(t / 19) * 1.4,
      look: lerp(from.look, 0.55 * from.facing, clamp((p - 0.2) / 0.25)),
      squash: from.squash + 0.04 * Math.sin(Math.PI * a) * (1 - m),
    };
  },

  /** Pip drops into a crouch with both arms over the head at p 0.15 and holds with a small tremble. */
  duck: ({ from, t, p }: ActionArgs): Pose => {
    const a = clamp(p / 0.15);
    const m = backOut(clamp((p - 0.15) / 0.22));
    const tremble = p > 0.3 ? Math.sin(t * 1.9) * 2.2 : 0;
    return {
      ...from,
      x: from.x + tremble,
      squash: lerp(from.squash, 0.26, m) - 0.05 * Math.sin(Math.PI * a) * (1 - m),
      armL: { a: lerp(from.armL.a, 142, m), b: lerp(from.armL.b, 84, m) },
      armR: { a: lerp(from.armR.a, 142, m), b: lerp(from.armR.b, 84, m) },
      legL: { a: lerp(from.legL.a, 34, m), b: lerp(from.legL.b, -68, m) },
      legR: { a: lerp(from.legR.a, -34, m), b: lerp(from.legR.b, -68, m) },
      headTilt: lerp(from.headTilt, 16, m) + tremble * 0.8,
      tilt: tremble * 0.7,
    };
  },

  /** Pip turns one slow full rotation across the shot while looking around. */
  spin: ({ from, p }: ActionArgs): Pose => {
    const e = easeInOut(p);
    const lift = 68 * Math.sin(Math.PI * e);
    return {
      ...from,
      y: from.y - lift,
      spin: 360 * e,
      yaw: 0.45 * Math.sin(p * Math.PI * 2),
      look: Math.sin(p * Math.PI * 4),
      headTilt: 10 * Math.sin(p * Math.PI * 2),
      armL: { a: 62 + 12 * Math.sin(p * Math.PI * 2), b: -16 },
      armR: { a: 62 - 12 * Math.sin(p * Math.PI * 2), b: -16 },
      legL: { a: 14, b: -22 },
      legR: { a: -14, b: -22 },
    };
  },

  /** A quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
  flinch: ({ from, t, len, p }: ActionArgs): Pose => {
    const hit = kf(p, [
      [0, 0],
      [0.14, -0.15],
      [0.22, 1],
      [0.44, 0.72],
      [0.7, 0],
      [1, 0],
    ]);
    return {
      ...from,
      x: from.x - 16 * hit * from.facing,
      squash: from.squash + 0.17 * hit,
      tilt: from.tilt - 13 * hit * from.facing,
      armL: { a: lerp(from.armL.a, 118, hit), b: lerp(from.armL.b, 48, hit) },
      armR: { a: lerp(from.armR.a, 128, hit), b: lerp(from.armR.b, 56, hit) },
      headTilt: from.headTilt - 12 * hit + settle(t - 0.22 * len, 4),
    };
  },

  /** Pip's arm swings up to point up at p 0.2 with a small overshoot. */
  pointup: ({ from, t, len, p }: ActionArgs): Pose => {
    const a = clamp(p / 0.2);
    const m = backOut(clamp((p - 0.2) / 0.28));
    const dip = Math.sin(Math.PI * a) * (1 - m);
    return {
      ...from,
      armR: { a: lerp(from.armR.a, 168, m) - 18 * dip, b: lerp(from.armR.b, 0, m) },
      armL: { a: lerp(from.armL.a, 14, m), b: lerp(from.armL.b, -12, m) },
      handR: m > 0.35 ? 'point' : from.handR,
      headTilt: lerp(from.headTilt, -12 * from.facing, m) + settle(t - 0.48 * len, 3),
      look: lerp(from.look, 0.55 * from.facing, m),
      tilt: lerp(from.tilt, -4 * from.facing, m),
      squash: from.squash + 0.05 * dip,
    };
  },
};

export const CUSTOM: NonNullable<Registry['custom']> = {};
