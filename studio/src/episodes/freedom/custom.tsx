import { Registry } from './render';
import { backOut, clamp, easeInOut, easeOut, lerp, settle } from '../../engine/anim';

export const ACTIONS: NonNullable<Registry['actions']> = {
  // Pip tilts head back, arms loose, small sway; eyes lift at p 0.2.
  lookup: ({ from, t, len, p }) => {
    const a = clamp(p / 0.15);
    const m = clamp((p - 0.15) / 0.25);
    const e = backOut(m);
    const eye = easeOut(clamp((p - 0.2) / 0.18));
    const ant = Math.sin(Math.PI * a) * (1 - m);
    return {
      ...from,
      headTilt: lerp(from.headTilt, -18, e) + ant * 5 + settle(t - 0.4 * len, 3),
      look: lerp(from.look, 0.55, eye),
      tilt: lerp(from.tilt, -3, e),
      squash: from.squash + ant * 0.04,
      armL: { a: 14 + Math.sin(t / 11) * 5, b: -12 },
      armR: { a: 18 - Math.sin(t / 11) * 5, b: -14 },
    };
  },

  // Pip drops into a crouch with both arms over the head at p 0.15 and holds with a small tremble.
  duck: ({ from, t, len, p }) => {
    const a = clamp(p / 0.12);
    const m = clamp((p - 0.12) / 0.18);
    const e = backOut(m);
    const ant = Math.sin(Math.PI * a) * (1 - m);
    const tremble = p > 0.3 ? Math.sin(t * 2.1) * 1.8 : 0;
    return {
      ...from,
      squash: lerp(from.squash, 0.24, e) - ant * 0.04 + settle(t - 0.3 * len, 0.03),
      tilt: tremble,
      headTilt: lerp(from.headTilt, 16, e),
      armL: { a: lerp(from.armL.a, 152, e), b: lerp(from.armL.b, 84, e) },
      armR: { a: lerp(from.armR.a, 152, e), b: lerp(from.armR.b, 84, e) },
      legL: { a: lerp(from.legL.a, 30, e), b: lerp(from.legL.b, -60, e) },
      legR: { a: lerp(from.legR.a, -30, e), b: lerp(from.legR.b, -60, e) },
    };
  },

  // Pip turns one slow full rotation across the shot while looking around.
  spin: ({ from, p }) => ({
    ...from,
    y: from.y - Math.sin(Math.PI * p) * 32,
    spin: lerp(0, 360, easeInOut(p)),
    look: Math.sin(p * Math.PI * 4) * 0.75,
    headTilt: Math.sin(p * Math.PI * 2) * 10,
    armL: { a: 72, b: -18 },
    armR: { a: 72, b: -18 },
  }),

  // A quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7.
  flinch: ({ from, to, t, len, p }) => {
    const inF = clamp((p - 0.1) / 0.14);
    const outF = clamp((p - 0.32) / 0.38);
    const k = easeOut(inF) * (1 - easeInOut(outF));
    const endMix = easeInOut(outF);
    return {
      ...from,
      squash: lerp(from.squash, to.squash, endMix) + 0.22 * k,
      tilt: lerp(from.tilt, to.tilt, endMix) - 13 * k + settle(t - 0.65 * len, 3),
      headTilt: lerp(from.headTilt, to.headTilt, endMix) - 10 * k,
      yaw: lerp(from.yaw, to.yaw, endMix) - 0.35 * k,
      armL: { a: lerp(from.armL.a, 122, k), b: lerp(from.armL.b, 58, k) },
      armR: { a: lerp(from.armR.a, 128, k), b: lerp(from.armR.b, 52, k) },
    };
  },

  // Pip's arm swings up to point up at p 0.2 with a small overshoot.
  pointup: ({ from, t, len, p }) => {
    const a = clamp(p / 0.14);
    const m = clamp((p - 0.14) / 0.22);
    const e = backOut(m);
    const ant = Math.sin(Math.PI * a) * (1 - m);
    return {
      ...from,
      armR: {
        a: lerp(from.armR.a, 168, e) - ant * 18 + settle(t - 0.38 * len, 6),
        b: lerp(from.armR.b, 0, e),
      },
      handR: m > 0.35 ? 'point' : from.handR,
      headTilt: lerp(from.headTilt, -10, e),
      look: lerp(from.look, 0.45, e),
      squash: from.squash - 0.04 * e + 0.05 * ant,
    };
  },
};

export const CUSTOM: NonNullable<Registry['custom']> = {};
