import { clamp, lerp, easeInOut, easeOut, backOut, kf, settle } from '../../engine/anim';
import { pipPose } from '../../brand';
import type { ActionArgs, Registry } from './render';

export const ACTIONS: Registry['actions'] = {
  /** Pip tilts head back, arms hang loose, small sway; eyes lift at p 0.2. */
  lookup: ({ from, t, len, p }: ActionArgs) => {
    const ant = clamp(p / 0.18);
    const e = backOut(clamp((p - 0.16) / 0.28));
    const eyeUp = easeOut(clamp((p - 0.2) / 0.16));
    const sway = Math.sin(t / 14) * 3;
    return {
      ...from,
      headTilt: lerp(from.headTilt + 4 * Math.sin(Math.PI * ant), -22, e) + settle(t - 0.44 * len, 3.5),
      look: lerp(from.look, 0.75, eyeUp),
      tilt: lerp(from.tilt, -3 * from.facing, e) + sway * 0.3,
      squash: lerp(0.04 * Math.sin(Math.PI * ant), -0.02, e),
      armL: { a: 12 + sway, b: -10 },
      armR: { a: 14 - sway, b: -10 },
    };
  },

  /** Pip drops into a crouch with both arms raised over the head at p 0.15 and holds with a small tremble. */
  duck: ({ from, t, len, p }: ActionArgs) => {
    const crouchPose = pipPose('crouch');
    const ant = clamp(p / 0.15);
    const drop = backOut(clamp((p - 0.14) / 0.2));
    const tremble = p > 0.3 ? Math.sin(t * 1.9) * 1.8 : 0;
    const armMix = (a: number, b: number) => lerp(a, b, drop);
    return {
      ...from,
      squash: lerp(-0.05 * Math.sin(Math.PI * ant), crouchPose.squash, drop) + settle(t - 0.34 * len, 0.03),
      headTilt: lerp(from.headTilt, 16, drop) + tremble,
      tilt: lerp(from.tilt, 6 * from.facing, drop) + tremble * 0.7,
      armL: { a: armMix(from.armL.a, 156), b: armMix(from.armL.b, 32) },
      armR: { a: armMix(from.armR.a, 156), b: armMix(from.armR.b, 32) },
      legL: { a: armMix(from.legL.a, crouchPose.legL.a), b: armMix(from.legL.b, crouchPose.legL.b) },
      legR: { a: armMix(from.legR.a, crouchPose.legR.a), b: armMix(from.legR.b, crouchPose.legR.b) },
    };
  },

  /** Pip turns one slow full rotation across the shot while looking up. */
  spin: ({ from, t, p }: ActionArgs) => {
    const turn = easeInOut(p);
    const yawAngle = turn * Math.PI * 2;
    const yaw = Math.sin(yawAngle);
    const facing: 1 | -1 = Math.cos(yawAngle) >= 0 ? from.facing : (from.facing === 1 ? -1 : 1);
    const lookUp = easeOut(clamp(p / 0.22));
    return {
      ...from,
      facing,
      yaw,
      headTilt: lerp(from.headTilt, -18, lookUp),
      look: lerp(from.look, 0.6, lookUp),
      tilt: Math.sin(yawAngle) * 4,
      armL: { a: 26 + Math.sin(t / 10) * 6, b: -16 },
      armR: { a: 26 - Math.sin(t / 10) * 6, b: -16 },
    };
  },

  /** Quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
  flinch: ({ from, t, len, p }: ActionArgs) => {
    const fl = kf(p, [[0, 0], [0.14, -0.15], [0.22, 1], [0.45, 0.85], [0.7, 0], [1, 0]], easeOut);
    const setl = settle(t - 0.22 * len, 5);
    return {
      ...from,
      squash: 0.18 * clamp(fl, -0.2, 1),
      tilt: -14 * from.facing * fl + setl * 0.5,
      headTilt: -10 * fl + setl,
      armL: { a: lerp(from.armL.a, 128, clamp(fl, 0, 1)), b: lerp(from.armL.b, 32, clamp(fl, 0, 1)) },
      armR: { a: lerp(from.armR.a, 134, clamp(fl, 0, 1)), b: lerp(from.armR.b, 36, clamp(fl, 0, 1)) },
    };
  },

  /** Pip's arm swings up to point at the sky at p 0.2 with a small overshoot. */
  pointup: ({ from, t, len, p }: ActionArgs) => {
    const target = pipPose('pointUp');
    const ant = clamp(p / 0.18);
    const m = clamp((p - 0.18) / 0.26);
    const k = backOut(m);
    return {
      ...from,
      handR: m > 0.45 ? target.handR : from.handR,
      armR: {
        a: lerp(from.armR.a - 12 * Math.sin(Math.PI * ant), target.armR.a, k),
        b: lerp(from.armR.b, target.armR.b, k),
      },
      armL: {
        a: lerp(from.armL.a, target.armL.a, k),
        b: lerp(from.armL.b, target.armL.b, k),
      },
      headTilt: lerp(from.headTilt, -16, k) + settle(t - 0.44 * len, 4),
      look: lerp(from.look, 0.7, k),
      squash: lerp(0.06 * Math.sin(Math.PI * ant), -0.02, k),
    };
  },
};

export const CUSTOM: Registry['custom'] = {};
