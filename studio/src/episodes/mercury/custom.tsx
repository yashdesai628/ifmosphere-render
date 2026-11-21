import { clamp, lerp, easeInOut, backOut, settle } from '../../engine/anim';
import type { Pose } from '../../brand';
import type { ActionArgs, Registry } from './render';

export const ACTIONS: Registry['actions'] = {
  /** Pip tilts head back to gaze up at the sky/target, arms loose with slight sway; eyes lift at p 0.2. */
  lookup: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.2);
    const lift = backOut(clamp((p - 0.2) / 0.28));
    const headBase = lerp(5 * f * Math.sin(Math.PI * ant), -16 * f, lift);
    const sway = Math.sin(t / 15) * 4;
    return {
      ...from,
      headTilt: headBase + settle(t - 0.2 * len, 3.5),
      look: lerp(0, 0.75 * f, clamp((p - 0.2) / 0.18)),
      armL: { a: 14 + sway, b: -8 },
      armR: { a: 14 - sway, b: -10 },
      squash: (from.squash ?? 0) + 0.05 * Math.sin(Math.PI * ant) * (1 - lift),
      tilt: lerp(0, -3 * f, lift),
    };
  },

  /** Pip drops into a crouch with both arms raised over the head at p 0.15 and holds with a small tremble. */
  duck: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.15);
    const drop = backOut(clamp((p - 0.15) / 0.22));
    const tremble = drop > 0.7 ? Math.sin(t * 2.2) * 2.2 : 0;
    return {
      ...from,
      x: from.x + tremble * 1.4,
      squash: lerp(-0.04 * Math.sin(Math.PI * ant), 0.24, drop),
      legL: { a: lerp(from.legL.a, 32, drop), b: lerp(from.legL.b, -64, drop) },
      legR: { a: lerp(from.legR.a, -32, drop), b: lerp(from.legR.b, -64, drop) },
      armL: { a: lerp(from.armL.a, 146, drop) + tremble, b: lerp(from.armL.b, 72, drop) },
      armR: { a: lerp(from.armR.a, 146, drop) - tremble, b: lerp(from.armR.b, 72, drop) },
      headTilt: lerp(0, 12 * f, drop) + settle(t - 0.15 * len, 4),
      tilt: lerp(0, -6 * f, drop),
    };
  },

  /** Pip hops lightly and turns one slow full rotation across the shot while looking up. */
  spin: ({ from, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.12);
    const rotP = easeInOut(clamp((p - 0.1) / 0.76));
    const air = Math.sin(Math.PI * clamp((p - 0.1) / 0.76));
    const land = clamp((p - 0.86) / 0.14);
    return {
      ...from,
      y: from.y - air * 52 * from.scale,
      spin: rotP * 360 * f,
      yaw: Math.sin(rotP * Math.PI * 2),
      headTilt: -12 * f,
      look: 0.4 * f,
      armL: { a: lerp(from.armL.a, 58, clamp(rotP * 4)), b: -16 },
      armR: { a: lerp(from.armR.a, 58, clamp(rotP * 4)), b: -16 },
      squash: 0.08 * Math.sin(Math.PI * ant) + 0.1 * Math.sin(Math.PI * land),
    };
  },

  /** Quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
  flinch: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const hit = clamp((p - 0.15) / 0.15);
    const rec = easeInOut(clamp((p - 0.3) / 0.4));
    const k = hit * (1 - rec);
    const vib = p > 0.2 ? settle(t - 0.2 * len, 6) : 0;
    return {
      ...from,
      x: from.x - 18 * from.scale * f * k,
      tilt: -14 * f * k + vib * 0.5,
      headTilt: -10 * f * k + vib,
      squash: (from.squash ?? 0) + 0.19 * k,
      armL: { a: lerp(from.armL.a, 110, k), b: lerp(from.armL.b, 38, k) },
      armR: { a: lerp(from.armR.a, 122, k), b: lerp(from.armR.b, 42, k) },
    };
  },

  /** Pip's arm swings up to point at the sky at p 0.2 with anticipation and small overshoot. */
  pointup: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.2);
    const swing = backOut(clamp((p - 0.2) / 0.28));
    const antAng = 8 - 18 * Math.sin(Math.PI * ant);
    return {
      ...from,
      handR: swing > 0.35 ? 'point' : from.handR,
      armR: {
        a: lerp(antAng, 168, swing) + settle(t - 0.2 * len, 5),
        b: lerp(-18, 0, swing),
      },
      armL: { a: 14, b: -12 },
      headTilt: lerp(4 * f * Math.sin(Math.PI * ant), -11 * f, swing),
      squash: (from.squash ?? 0) + 0.06 * Math.sin(Math.PI * ant) * (1 - swing),
    };
  },
};

export const CUSTOM: Registry['custom'] = {};
