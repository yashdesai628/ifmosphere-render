import type { Pose } from '../../brand';
import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import type { ActionArgs, Registry } from './render';

export const ACTIONS: Registry['actions'] = {
  lookup: ({ from, t, len, p }: ActionArgs): Pose => {
    const ant = clamp(p / 0.16);
    const m = clamp((p - 0.16) / 0.34);
    const bo = backOut(m);
    const gaze = easeInOut(clamp((p - 0.2) / 0.24));
    const sway = Math.sin(t / 14) * 1.4;
    const armSway = Math.sin(t / 11) * 4;
    return {
      ...from,
      yaw: lerp(from.yaw, 0.18, easeInOut(m)),
      look: lerp(from.look, 0.38, gaze),
      headTilt: lerp(from.headTilt, -19, bo) + 4 * Math.sin(Math.PI * ant) * (1 - m) + settle(t - 0.5 * len, 2.5),
      tilt: lerp(from.tilt, -3, easeOut(m)) + sway,
      squash: from.squash + 0.045 * Math.sin(Math.PI * ant) * (1 - m),
      armL: { a: 12 + armSway, b: -12 + Math.cos(t / 13) * 3 },
      armR: { a: 14 - armSway, b: -10 + Math.sin(t / 13) * 3 },
    };
  },

  duck: ({ from, t, len, p }: ActionArgs): Pose => {
    const ant = clamp(p / 0.14);
    const m = clamp((p - 0.14) / 0.2);
    const bo = backOut(m);
    const tremble = p > 0.28 ? Math.sin(t * 2.1) * 1.6 : 0;
    return {
      ...from,
      squash: lerp(from.squash, 0.24, bo) - 0.05 * Math.sin(Math.PI * ant) * (1 - m),
      legL: { a: lerp(from.legL.a, 32, bo), b: lerp(from.legL.b, -64, bo) },
      legR: { a: lerp(from.legR.a, -32, bo), b: lerp(from.legR.b, -64, bo) },
      armL: { a: lerp(from.armL.a, 148, bo), b: lerp(from.armL.b, 86, bo) },
      armR: { a: lerp(from.armR.a, 152, bo), b: lerp(from.armR.b, 84, bo) },
      headTilt: lerp(from.headTilt, 14, easeOut(m)) + tremble + settle(t - 0.34 * len, 3.5),
      tilt: tremble * 0.8,
      look: lerp(from.look, 0.25, easeOut(m)),
    };
  },

  spin: ({ from, t, p }: ActionArgs): Pose => {
    const phase = easeInOut(clamp((p - 0.06) / 0.88));
    const theta = phase * Math.PI * 2;
    const yaw = Math.sin(theta) * 0.95;
    return {
      ...from,
      yaw,
      look: Math.sin(theta) * 0.55,
      headTilt: -18 + Math.sin(theta * 2) * 3,
      tilt: Math.sin(theta) * 3.5,
      armL: { a: 28 + Math.sin(theta) * 14, b: -14 },
      armR: { a: 28 - Math.sin(theta) * 14, b: -14 },
      squash: from.squash - 0.015 * Math.sin(t / 10),
    };
  },

  flinch: ({ from, to, t, len, p }: ActionArgs): Pose => {
    const hitIn = easeOut(clamp((p - 0.14) / 0.12));
    const recover = easeInOut(clamp((p - 0.34) / 0.36));
    const k = hitIn * (1 - recover);
    const base = p > 0.55 ? to : from;
    return {
      ...base,
      squash: base.squash + 0.18 * k + settle(t - 0.24 * len, 0.035, 1.8, 6),
      tilt: base.tilt - 14 * k + settle(t - 0.24 * len, 3.8, 1.5, 7),
      headTilt: base.headTilt - 12 * k,
      yaw: lerp(base.yaw, -0.35, k),
      armL: { a: lerp(base.armL.a, 128, k), b: lerp(base.armL.b, 85, k) },
      armR: { a: lerp(base.armR.a, 138, k), b: lerp(base.armR.b, 75, k) },
      legL: { a: lerp(base.legL.a, 18, k), b: lerp(base.legL.b, -32, k) },
      legR: { a: lerp(base.legR.a, -18, k), b: lerp(base.legR.b, -32, k) },
    };
  },

  pointup: ({ from, t, len, p }: ActionArgs): Pose => {
    const ant = clamp(p / 0.18);
    const m = clamp((p - 0.18) / 0.28);
    const bo = backOut(m);
    const antDip = Math.sin(Math.PI * ant) * (1 - m);
    return {
      ...from,
      squash: from.squash + 0.06 * antDip,
      armR: {
        a: lerp(from.armR.a, 168, bo) - 14 * antDip + settle(t - 0.45 * len, 5),
        b: lerp(from.armR.b, 0, bo),
      },
      handR: m > 0.35 ? 'point' : from.handR,
      armL: { a: lerp(from.armL.a, 14, easeOut(m)), b: lerp(from.armL.b, -12, easeOut(m)) },
      headTilt: lerp(from.headTilt, -14, easeInOut(m)) + settle(t - 0.45 * len, 2.5),
      look: lerp(from.look, 0.35, easeInOut(m)),
      tilt: lerp(from.tilt, -2.5, easeOut(m)),
    };
  },
};

export const CUSTOM: Registry['custom'] = {};
