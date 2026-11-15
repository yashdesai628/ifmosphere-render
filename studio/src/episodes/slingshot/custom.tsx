import { clamp, lerp, easeInOut, easeOut, backOut, settle } from '../../engine/anim';
import type { ActionArgs, Registry } from './render';

export const ACTIONS: Registry['actions'] = {
  /** Pip tilts head back (headTilt up), arms hang loose, small sway; eyes lift at p 0.2. */
  lookup: ({ from, t, len, p }: ActionArgs) => {
    const dip = clamp(p / 0.16);
    const lift = backOut(clamp((p - 0.12) / 0.32));
    const eyeShift = easeOut(clamp((p - 0.2) / 0.22));
    const sway = Math.sin(t * 0.12) * 3;
    return {
      ...from,
      headTilt: lerp(from.headTilt, -22, lift) + settle(t - 0.44 * len, 3),
      look: lerp(from.look, 0.35 * from.facing, eyeShift),
      tilt: lerp(from.tilt, -3 * from.facing, easeOut(clamp(p / 0.4))),
      squash: from.squash + 0.05 * Math.sin(Math.PI * dip) * (1 - lift),
      armL: { a: 12 + sway, b: -8 },
      armR: { a: 18 - sway, b: -10 },
    };
  },

  /** Pip drops into a crouch with both arms raised over the head at p 0.15 and holds with a small tremble. */
  duck: ({ from, t, len, p }: ActionArgs) => {
    const ant = clamp(p / 0.12);
    const drop = backOut(clamp((p - 0.12) / 0.22));
    const tremble = p > 0.22 ? Math.sin(t * 2.1) * 2.6 : 0;
    return {
      ...from,
      x: from.x + tremble * 0.9,
      squash: lerp(from.squash, 0.28, drop) - 0.05 * Math.sin(Math.PI * ant) * (1 - drop),
      tilt: lerp(from.tilt, 6 * from.facing, drop) + tremble * 0.6,
      headTilt: lerp(from.headTilt, 16, drop) + settle(t - 0.34 * len, 3),
      armL: { a: lerp(from.armL.a, 152, drop) + tremble, b: lerp(from.armL.b, 48, drop) },
      armR: { a: lerp(from.armR.a, 154, drop) - tremble, b: lerp(from.armR.b, 46, drop) },
      legL: { a: lerp(from.legL.a, 34, drop), b: lerp(from.legL.b, -66, drop) },
      legR: { a: lerp(from.legR.a, -34, drop), b: lerp(from.legR.b, -66, drop) },
    };
  },

  /** Pip turns one slow full rotation (yaw/spin) across the shot while looking up. */
  spin: ({ from, p, spec }: ActionArgs) => {
    const e = easeInOut(clamp(p));
    const floating = spec.pose === 'float';
    const turn = Math.sin(e * Math.PI * 2);
    return {
      ...from,
      facing: floating ? from.facing : ((e > 0.25 && e < 0.75 ? -from.facing : from.facing) as 1 | -1),
      yaw: floating ? turn * 0.5 : turn,
      spin: floating ? lerp(0, 360 * from.facing, e) : Math.sin(e * Math.PI * 2) * 10,
      headTilt: -18,
      armL: { a: lerp(from.armL.a, 46, clamp(p / 0.2)), b: -16 },
      armR: { a: lerp(from.armR.a, 54, clamp(p / 0.2)), b: -16 },
    };
  },

  /** A quick squash and lean away at p 0.2 with arms up, then settles back by p 0.7. */
  flinch: ({ from, to, t, len, p }: ActionArgs) => {
    const hit = easeOut(clamp((p - 0.1) / 0.16));
    const rec = easeInOut(clamp((p - 0.32) / 0.38));
    const amt = hit * (1 - rec);
    const wob = settle(t - 0.7 * len, 4);
    return {
      ...from,
      x: lerp(from.x, to.x, rec) - 18 * from.facing * amt,
      squash: lerp(from.squash, to.squash, rec) + 0.2 * amt,
      tilt: lerp(from.tilt, to.tilt, rec) - 16 * from.facing * amt + wob * 0.4,
      headTilt: lerp(from.headTilt, to.headTilt, rec) - 14 * amt + wob,
      armL: { a: lerp(from.armL.a, 128, amt), b: lerp(from.armL.b, 38, amt) },
      armR: { a: lerp(from.armR.a, 138, amt), b: lerp(from.armR.b, 34, amt) },
    };
  },

  /** Pip's arm swings up to point at the sky at p 0.2 with a small overshoot. */
  pointup: ({ from, t, len, p }: ActionArgs) => {
    const ant = clamp(p / 0.2);
    const m = backOut(clamp((p - 0.18) / 0.28));
    const wob = settle(t - 0.46 * len, 6);
    return {
      ...from,
      handR: m > 0.45 ? 'point' : from.handR,
      armR: { a: lerp(from.armR.a, 170, m) + wob, b: lerp(from.armR.b, 4, m) },
      armL: { a: lerp(from.armL.a, 16, m), b: lerp(from.armL.b, -12, m) },
      headTilt: lerp(from.headTilt, -18, m) + wob * 0.4,
      yaw: lerp(from.yaw, 0.22, m),
      squash: from.squash + 0.07 * Math.sin(Math.PI * ant) * (1 - clamp(m)),
    };
  },
};

export const CUSTOM: Registry['custom'] = {};
