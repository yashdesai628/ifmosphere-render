import type { ActionArgs, CustomProps, Registry } from './render';
import type { Pose } from '../../brand';
import { backOut, clamp, easeInOut, easeOut, lerp, settle } from '../../engine/anim';

export const ACTIONS: NonNullable<Registry['actions']> = {
  lookup: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.16);
    const mv = clamp((p - 0.16) / 0.28);
    const e = backOut(mv);
    const sway = Math.sin(t / 12) * 4;
    return {
      ...from,
      headTilt: lerp(from.headTilt + 4 * Math.sin(Math.PI * ant), -22, e) + settle(t - 0.38 * len, 4),
      tilt: lerp(from.tilt, -5 * f, e),
      look: mv > 0.15 ? 0.65 * f : from.look,
      squash: lerp(0.04 * Math.sin(Math.PI * ant), -0.02, mv),
      armL: { a: lerp(from.armL.a, 14 + sway, e), b: lerp(from.armL.b, -12, e) },
      armR: { a: lerp(from.armR.a, 18 - sway, e), b: lerp(from.armR.b, -14, e) },
    };
  },

  duck: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.12);
    const mv = clamp((p - 0.12) / 0.2);
    const e = backOut(mv);
    const tremble = p > 0.28 ? Math.sin(t * 1.9) * 2.4 : 0;
    return {
      ...from,
      squash: lerp(-0.05 * Math.sin(Math.PI * ant), 0.26, easeOut(mv)) + settle(t - 0.28 * len, 0.04),
      tilt: lerp(from.tilt, 12 * f, e) + tremble * 0.7,
      headTilt: lerp(from.headTilt, 16, e) + tremble,
      legL: { a: lerp(from.legL.a, 36, e), b: lerp(from.legL.b, -68, e) },
      legR: { a: lerp(from.legR.a, -34, e), b: lerp(from.legR.b, -68, e) },
      armL: { a: lerp(from.armL.a, 156 + tremble * 1.3, e), b: lerp(from.armL.b, -72, e) },
      armR: { a: lerp(from.armR.a, 156 - tremble * 1.3, e), b: lerp(from.armR.b, -72, e) },
    };
  },

  spin: ({ from, t, len, p }: ActionArgs): Pose => {
    const ant = clamp(p / 0.12);
    const mv = clamp((p - 0.12) / 0.73);
    const e = easeInOut(mv);
    const airborne = Math.sin(Math.PI * mv);
    const landSettle = settle(t - 0.85 * len, 7);
    return {
      ...from,
      y: from.y - 34 * airborne,
      spin: lerp(0, 360, e),
      yaw: Math.sin(e * Math.PI * 2) * 0.65,
      headTilt: lerp(from.headTilt + 4 * Math.sin(Math.PI * ant), -16, clamp(p / 0.25)) + landSettle * 0.5,
      squash: 0.07 * Math.sin(Math.PI * ant) - 0.04 * airborne + (p > 0.84 ? settle(t - 0.85 * len, 0.08) : 0),
      armL: { a: lerp(from.armL.a, 64, clamp(p / 0.25)), b: -18 },
      armR: { a: lerp(from.armR.a, 64, clamp(p / 0.25)), b: -18 },
      legL: { a: lerp(from.legL.a, 16 * airborne, clamp(p / 0.25)), b: -18 * airborne },
      legR: { a: lerp(from.legR.a, -16 * airborne, clamp(p / 0.25)), b: -18 * airborne },
    };
  },

  flinch: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const hit = easeOut(clamp((p - 0.12) / 0.16));
    const rec = easeInOut(clamp((p - 0.3) / 0.4));
    const k = hit * (1 - rec);
    const wob = settle(t - 0.24 * len, 8);
    return {
      ...from,
      x: from.x - 16 * f * k,
      squash: lerp(from.squash, 0.22, k) + settle(t - 0.24 * len, 0.04),
      tilt: lerp(from.tilt, -16 * f, k) + wob * 0.4,
      headTilt: lerp(from.headTilt, -14, k) + wob * 0.6,
      armL: { a: lerp(from.armL.a, 132, k), b: lerp(from.armL.b, -46, k) },
      armR: { a: lerp(from.armR.a, 126, k), b: lerp(from.armR.b, -50, k) },
    };
  },

  pointup: ({ from, t, len, p }: ActionArgs): Pose => {
    const f = from.facing || 1;
    const ant = clamp(p / 0.16);
    const mv = clamp((p - 0.16) / 0.28);
    const e = backOut(mv);
    const wob = settle(t - 0.42 * len, 5);
    return {
      ...from,
      handR: mv > 0.35 ? 'point' : from.handR,
      armR: { a: lerp(from.armR.a - 24 * Math.sin(Math.PI * ant), 168, e) + wob, b: lerp(from.armR.b, 0, e) },
      armL: { a: lerp(from.armL.a, 14, e), b: lerp(from.armL.b, -12, e) },
      headTilt: lerp(from.headTilt, -16, e) + wob * 0.4,
      look: lerp(from.look, 0.55 * f, e),
      squash: 0.05 * Math.sin(Math.PI * ant) - 0.03 * Math.sin(Math.PI * clamp(mv)),
    };
  },
};

export const CUSTOM: Record<string, React.FC<CustomProps>> = {};
