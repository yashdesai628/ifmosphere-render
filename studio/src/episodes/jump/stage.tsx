import React from 'react';
import {
  camT,
  camTV,
  clamp,
  lerp,
  easeOut,
  easeIn,
  easeInOut,
  backOut,
  settle,
  Hero,
  Actor,
  LOOKS,
  Pose,
  Expr,
  basePose,
  poseAt,
  walkPose,
  feetBelowHips,
  joints,
  toWorld,
  Foreground,
  Sparkle,
  FocusRings,
  DizzyStars,
  Dial,
  Gauge,
  Marquee,
  Tag,
  FloatLabel,
  FONT,
  UI,
  C,
  Glow,
  Stadium,
  Rooftop,
  Schematic,
  DrawOn,
  Arrow,
  SchLabel,
} from '../../engine';
import {
  JumpTitleCard,
  WorldChapterCard,
  TelemetryPill,
  HeightScaleBar,
  ShortBigNumber,
  JumpEndCard16x9,
  JumpShortEndCard9x16,
  SchoolGymSet,
  GYM_FLOOR_Y,
  HighJumpPit,
  BathroomSet,
  BATH_FLOOR_Y,
  BathroomScaleProp,
  ScaleDialMacro,
  DawnConjunctionOverlay,
  CometSet,
  COMET_Y,
  PhilaeLanderProp,
  MoonSet,
  MOON_Y,
  BulkySuitHero,
  MarsCourtSet,
  MARS_Y,
  BasketballProp,
  MercurySet,
  MERCURY_Y,
  VenusSet,
  VENUS_Y,
  TitanSet,
  TITAN_Y,
  CardboardWingsOverlay,
  JupiterDiveSet,
  JUPITER_BOARD_Y,
  SaturnBathSet,
  BATH_DECK_Y,
  CosmicBowlingSet,
  BOWL_FLOOR_Y,
  PlutoSet,
  PLUTO_Y,
  DimorphosSet,
  DIMORPHOS_Y,
  SunSet,
  SUN_DECK_Y,
} from './sets';

export type WorldId =
  | 'comet'
  | 'gym'
  | 'stadium'
  | 'bathroom'
  | 'moon'
  | 'moon_apollo'
  | 'mars'
  | 'mercury'
  | 'venus'
  | 'venus_venera'
  | 'titan'
  | 'jupiter'
  | 'saturn_bath'
  | 'bowling'
  | 'pluto'
  | 'dimorphos'
  | 'sun'
  | 'rooftop';

export const WORLD_GROUND: Record<WorldId, number> = {
  comet: COMET_Y,
  gym: GYM_FLOOR_Y,
  stadium: 855,
  bathroom: BATH_FLOOR_Y,
  moon: MOON_Y,
  moon_apollo: MOON_Y,
  mars: MARS_Y,
  mercury: MERCURY_Y,
  venus: VENUS_Y,
  venus_venera: VENUS_Y,
  titan: TITAN_Y,
  jupiter: JUPITER_BOARD_Y,
  saturn_bath: BATH_DECK_Y,
  bowling: BOWL_FLOOR_Y,
  pluto: PLUTO_Y,
  dimorphos: DIMORPHOS_Y,
  sun: SUN_DECK_Y,
  rooftop: 860,
};

export type ActionKind =
  | 'none'
  | 'stand'
  | 'point_up'
  | 'walk'
  | 'crouch'
  | 'launch'
  | 'soar_arc'
  | 'drift_up'
  | 'float_spin'
  | 'wave_escape'
  | 'chalk_slap'
  | 'soft_land'
  | 'record_gaze'
  | 'scale_step'
  | 'suit_stand'
  | 'suit_wrestle'
  | 'duke_jump'
  | 'duke_tip'
  | 'duke_fall_flat'
  | 'dribble'
  | 'slam_dunk'
  | 'unfold_chair'
  | 'chair_wait'
  | 'snack_hold'
  | 'panini_squish'
  | 'tape_wings'
  | 'flap_launch'
  | 'flap_soar'
  | 'heavy_groan'
  | 'tiny_hop'
  | 'cloud_sink'
  | 'tub_drop'
  | 'bowl_uranus'
  | 'bowl_neptune'
  | 'tiptoe'
  | 'flinch_float'
  | 'magic_boots'
  | 'sun_buckle'
  | 'sun_pancake'
  | 'thumb_wiggle';

export type PropGag =
  | 'none'
  | 'sneaker_dust'
  | 'doorway_frame'
  | 'window_moon_glow'
  | 'mattress_icon'
  | 'bball_floor'
  | 'panini_press'
  | 'robot_question'
  | 'venera_parachute'
  | 'cool_fan'
  | 'bowling_ball_rack'
  | 'dart_spacecraft'
  | 'philae_touch'
  | 'philae_harpoon_fail'
  | 'philae_bounce_arc'
  | 'earth_thought_bubble'
  | 'conjunction_sky'
  | 'leonids_sky';

export type FgKind = 'none' | 'boulderL' | 'boulderR' | 'ots_mo' | 'ots_sis' | 'rail' | 'cloud';

export interface WorldShotConfig {
  world: WorldId;
  idSeed: string;
  // Camera start -> end over shot len
  cam: [number, number, number]; // [cx, cy, scale]
  camEnd?: [number, number, number];
  camRot?: number;
  vertical?: boolean;
  // Character placement & action
  action?: ActionKind;
  pipX?: number;
  pipXEnd?: number;
  pipScale?: number;
  facing?: 1 | -1;
  yaw?: number;
  expr?: Expr;
  exprEnd?: Expr;
  jumpPx?: number; // peak jump height in pixels for launch / soar_arc / drift_up
  extraCast?: 'mo' | 'sis' | 'suit';
  extraX?: number;
  // World-specific overrides
  cometOffsetY?: number;
  cometScale?: number;
  chalkMarkM?: number;
  veneraTimer?: string;
  veneraFried?: boolean;
  pressureArrows?: boolean;
  mercuryChair?: boolean;
  mercuryHours?: number;
  sunCrawlP?: number;
  uranusRollP?: number;
  pinsScatter?: number;
  saturnDropY?: number;
  saturnSplash?: boolean;
  plutoHouse?: boolean;
  dartCrater?: boolean;
  // Props, foreground & UI overlays
  gag?: PropGag;
  fg?: FgKind;
  scaleBar?: { x: number; pxPerM: number; maxM: number; stepM?: number; curM?: number; hiM?: number; hiLabel?: string; color?: string };
  chapterCard?: { world: string; sub: string; color?: string; mode?: 'hero' | 'corner' };
  pill?: { x?: number; y?: number; label: string; value: string; color?: string; delay?: number };
  pill2?: { x?: number; y?: number; label: string; value: string; color?: string; delay?: number };
  dial?: { x?: number; y?: number; p: number; readout: string };
  gauge?: { x: number; y: number; p: number; label: string; danger?: number };
  tag?: { x: number; y: number; text: string; mark?: 'x' | 'check' };
  marquee?: { x: number; y: number; w: number; h: number; label?: string; color?: string };
  shortStat?: { world: string; bigValue: string; subText: string; color?: string; y?: number };
  titleCard?: boolean;
  endCard?: boolean;
}

/** Compute Pip's animated Pose at local clock t (out of len) for any ActionKind. */
function computePose(cfg: WorldShotConfig, t: number, len: number, groundY: number): Pose {
  const sc = cfg.pipScale ?? 0.92;
  const foot = feetBelowHips(sc);
  const baseY = groundY - foot;
  const p = clamp(t / Math.max(1, len));
  const x0 = cfg.pipX ?? 760;
  const x1 = cfg.pipXEnd ?? x0;
  const x = lerp(x0, x1, easeInOut(p));
  const fc = cfg.facing ?? 1;
  const yw = cfg.yaw ?? 0.35 * fc;
  const ex0 = cfg.expr ?? 'neutral';
  const ex1 = cfg.exprEnd ?? ex0;
  const curExpr = p < 0.48 ? ex0 : ex1;
  const blink = Math.abs(t - Math.floor(len * 0.48)) <= 1.5 ? 1 : 0;
  const jPx = cfg.jumpPx ?? 180;
  const act = cfg.action ?? 'stand';

  const base: Pose = {
    ...basePose,
    x,
    y: baseY,
    scale: sc,
    facing: fc,
    yaw: yw,
    expr: curExpr,
    blink,
    sway: Math.sin(t * 0.18) * 4,
  };

  switch (act) {
    case 'walk':
      return walkPose(x, t * 0.52, groundY, sc, { expr: curExpr, blink }, fc);

    case 'point_up':
      return poseAt(
        t,
        [
          { f: 0, p: { ...base, headTilt: -8, armR: { a: -35, b: -20 }, handR: 'point', look: 0.4 * fc } },
          { f: 14, p: { ...base, headTilt: -22, armR: { a: -142, b: -12 }, armL: { a: 18, b: -10 }, handR: 'point', expr: ex1 } },
        ],
        base,
      );

    case 'crouch': {
      const dip = easeInOut(clamp(t / Math.min(22, len * 0.6)));
      return {
        ...base,
        y: baseY + dip * 34 * sc,
        squash: dip * 0.17,
        tilt: fc * 11 * dip,
        headTilt: -8 * dip,
        armL: { a: -42 * dip, b: -28 * dip },
        armR: { a: -42 * dip, b: -28 * dip },
        legL: { a: 32 * dip, b: -58 * dip },
        legR: { a: 18 * dip, b: -54 * dip },
      };
    }

    case 'launch': {
      // Quick crouch (0..9f) then explosive upward launch!
      if (t < 9) {
        const k = t / 9;
        return {
          ...base,
          y: baseY + k * 32 * sc,
          squash: 0.18 * k,
          tilt: fc * 10 * k,
          armL: { a: -45 * k, b: -25 },
          armR: { a: -45 * k, b: -25 },
          legL: { a: 30 * k, b: -55 * k },
          legR: { a: 20 * k, b: -50 * k },
        };
      }
      const u = easeOut(clamp((t - 9) / Math.max(10, len - 9)));
      return {
        ...base,
        y: baseY - u * jPx,
        squash: -0.16 * (1 - u * 0.5),
        tilt: fc * 6,
        headTilt: -14,
        sway: -14,
        armL: { a: -150, b: -14 },
        armR: { a: -155, b: -12 },
        legL: { a: -18, b: 12 },
        legR: { a: 14, b: -22 },
      };
    }

    case 'soar_arc': {
      // Full parabolic jump arc across the shot!
      const arc = Math.sin(p * Math.PI);
      const vy = Math.cos(p * Math.PI);
      return {
        ...base,
        y: baseY - arc * jPx,
        squash: -0.1 * Math.abs(vy),
        tilt: fc * (8 * vy),
        headTilt: -10 * arc,
        sway: -12 * vy,
        armL: { a: -135 * arc + 15, b: -18 },
        armR: { a: -145 * arc + 15, b: -16 },
        legL: { a: 24 * arc, b: -34 * arc },
        legR: { a: -18 * arc, b: -26 * arc },
      };
    }

    case 'drift_up': {
      // Continuous upward zero-g / micro-g rise!
      const u = p;
      return {
        ...base,
        y: baseY - lerp(jPx * 0.25, jPx, u),
        spin: lerp(-4, 14, u) * fc,
        headTilt: 10,
        sway: 14 * Math.sin(t * 0.15),
        armL: { a: -115 + Math.sin(t * 0.2) * 14, b: -22 },
        armR: { a: -125 + Math.cos(t * 0.2) * 14, b: -18 },
        legL: { a: 20, b: -28 },
        legR: { a: -22, b: -18 },
      };
    }

    case 'float_spin': {
      return {
        ...base,
        y: baseY - jPx + Math.sin(t * 0.12) * 18,
        spin: -18 + p * 48 * fc,
        yaw: 0.15,
        sway: 16 * Math.sin(t * 0.18),
        armL: { a: -118, b: -24 },
        armR: { a: -112, b: -28 },
        legL: { a: 26, b: -32 },
        legR: { a: -24, b: -26 },
      };
    }

    case 'wave_escape': {
      const wave = Math.sin(t * 0.55) * 28;
      return {
        ...base,
        y: baseY - lerp(jPx * 0.35, jPx, p),
        spin: lerp(0, -18, p),
        yaw: 0,
        armL: { a: -95, b: -20 },
        armR: { a: -148 + wave * 0.4, b: wave },
        legL: { a: 18, b: -24 },
        legR: { a: -16, b: -20 },
      };
    }

    case 'chalk_slap': {
      const arc = Math.sin(clamp(p * 1.15) * Math.PI);
      return {
        ...base,
        y: baseY - arc * jPx,
        squash: p > 0.85 ? 0.14 : -0.1 * arc,
        yaw: -0.25,
        facing: -1,
        headTilt: -16 * arc,
        armL: { a: -168 * arc + 12, b: -8 },
        armR: { a: 28, b: -24 },
        legL: { a: 20 * arc, b: -30 * arc },
        legR: { a: -16 * arc, b: -22 * arc },
      };
    }

    case 'soft_land': {
      const fall = easeOut(clamp(p * 1.35));
      const landT = Math.max(0, t - len * 0.62);
      const sq = settle(landT, 0.16, 0.9, 9);
      return {
        ...base,
        y: baseY - (1 - fall) * jPx,
        squash: Math.max(-0.08, sq),
        armL: { a: lerp(-115, 22, fall), b: -18 },
        armR: { a: lerp(-115, 22, fall), b: -18 },
        legL: { a: 14, b: -24 * Math.max(0, sq * 3) },
        legR: { a: -12, b: -24 * Math.max(0, sq * 3) },
      };
    }

    case 'record_gaze':
      return {
        ...base,
        headTilt: -26,
        tilt: -5 * fc,
        look: 0.6 * fc,
        armL: { a: 24, b: -45 },
        armR: { a: -128, b: -18 },
        handR: 'point',
      };

    case 'scale_step': {
      const stepP = easeOut(clamp(t / 16));
      const needleWobble = settle(t - 14, 0.09, 1.3, 10);
      return {
        ...base,
        x: lerp(x0 - 75, x0, stepP),
        y: baseY - 20 - Math.sin(stepP * Math.PI) * 26,
        squash: needleWobble,
        headTilt: 18,
        armL: { a: 18, b: -16 },
        armR: { a: 18, b: -16 },
      };
    }

    case 'suit_stand':
      return {
        ...base,
        yaw: 0.15,
        armL: { a: 36, b: -12 },
        armR: { a: 36, b: -12 },
        legL: { a: 12, b: 0 },
        legR: { a: -12, b: 0 },
      };

    case 'suit_wrestle': {
      const strain = Math.sin(t * 0.45) * 8;
      return {
        ...base,
        y: baseY + 12,
        squash: 0.08,
        tilt: 8 + strain * 0.4,
        headTilt: 8,
        armL: { a: 48 + strain, b: -35 },
        armR: { a: 48 - strain, b: -35 },
        legL: { a: 22, b: -24 },
        legR: { a: -14, b: -20 },
      };
    }

    case 'duke_jump': {
      const arc = easeOut(p);
      return {
        ...base,
        y: baseY - arc * jPx,
        tilt: -14 * arc,
        armL: { a: -110 * arc + 30, b: -18 },
        armR: { a: -115 * arc + 30, b: -18 },
        legL: { a: 18, b: -26 },
        legR: { a: -12, b: -22 },
      };
    }

    case 'duke_tip': {
      return {
        ...base,
        y: baseY - lerp(jPx, jPx * 0.45, p),
        spin: lerp(-16, -68, easeInOut(p)),
        armL: { a: -135, b: -25 },
        armR: { a: -145, b: -20 },
        legL: { a: 36, b: -28 },
        legR: { a: -22, b: -18 },
      };
    }

    case 'duke_fall_flat': {
      const hit = easeOut(clamp(t / 14));
      const bounce = settle(t - 14, 12, 1.2, 8);
      return {
        ...base,
        y: lerp(baseY - 70, groundY - 46 - bounce, hit),
        spin: lerp(-68, -92, hit),
        armL: { a: -125, b: -30 },
        armR: { a: -95, b: -25 },
        legL: { a: 28, b: -36 },
        legR: { a: 8, b: -22 },
      };
    }

    case 'dribble': {
      const w = walkPose(x, t * 0.65, groundY, sc, { expr: curExpr }, fc);
      return {
        ...w,
        tilt: 12 * fc,
        armR: { a: 45 + Math.sin(t * 0.8) * 28, b: -38 },
      };
    }

    case 'slam_dunk': {
      const u = easeOut(clamp(p * 1.15));
      return {
        ...base,
        y: baseY - Math.sin(clamp(p * 1.05) * Math.PI * 0.82) * jPx,
        tilt: 14 * fc,
        headTilt: -12,
        armR: { a: lerp(-95, -162, u), b: -14 },
        armL: { a: -65, b: -32 },
        legL: { a: 34, b: -46 },
        legR: { a: -26, b: -32 },
      };
    }

    case 'unfold_chair':
      return {
        ...base,
        tilt: 16 * fc,
        headTilt: 12,
        armL: { a: 48, b: -34 },
        armR: { a: 62, b: -28 },
        legL: { a: 18, b: -22 },
        legR: { a: -12, b: -14 },
      };

    case 'chair_wait':
      return {
        ...base,
        x: 642,
        y: groundY - 92 * sc,
        yaw: 0.75,
        facing: 1,
        tilt: -24,
        headTilt: 10,
        armL: { a: 32, b: -48 },
        armR: { a: 45 + Math.sin(t * 0.12) * 6, b: -55 },
        legL: { a: 68, b: -55 },
        legR: { a: 58, b: -48 },
      };

    case 'snack_hold':
      return {
        ...base,
        yaw: 0.25,
        armL: { a: 42, b: -68 },
        armR: { a: 55, b: -85 },
      };

    case 'panini_squish': {
      const sq = easeOut(clamp(t / 13));
      return {
        ...base,
        y: baseY + sq * 46 * sc,
        squash: lerp(0.08, 0.48, sq),
        yaw: 0,
        armL: { a: -82, b: -18 },
        armR: { a: -82, b: -18 },
        legL: { a: 36, b: -42 },
        legR: { a: -36, b: -42 },
      };
    }

    case 'tape_wings':
      return {
        ...base,
        yaw: 0,
        headTilt: 10,
        armL: { a: -78, b: -12 },
        armR: { a: -65 + Math.sin(t * 0.4) * 14, b: -28 },
      };

    case 'flap_launch':
    case 'flap_soar': {
      const flap = Math.sin(t * 0.65) * 42;
      const lift = act === 'flap_launch' ? easeOut(p) * jPx : jPx * (0.72 + 0.28 * Math.sin(p * Math.PI));
      return {
        ...base,
        y: baseY - lift,
        yaw: 0.2 * fc,
        tilt: 12 * fc,
        armL: { a: -88 + flap, b: -10 },
        armR: { a: -88 + flap, b: -10 },
        legL: { a: -18, b: -26 },
        legR: { a: -28, b: -32 },
      };
    }

    case 'heavy_groan': {
      const tremble = Math.sin(t * 1.6) * 2.5;
      return {
        ...base,
        x: x + tremble,
        y: baseY + 28 * sc,
        squash: 0.22,
        tilt: 18 * fc,
        headTilt: 16,
        armL: { a: 34, b: -42 },
        armR: { a: 38, b: -46 },
        legL: { a: 34, b: -58 },
        legR: { a: 18, b: -54 },
      };
    }

    case 'tiny_hop': {
      // Straining crouch then tiny 20 cm (~42 px) hop!
      const hopPhase = clamp((p - 0.28) / 0.45);
      const hopArc = hopPhase > 0 && hopPhase < 1 ? Math.sin(hopPhase * Math.PI) : 0;
      return {
        ...base,
        y: baseY + (hopArc > 0 ? -hopArc * 44 : 22 * sc),
        squash: hopArc > 0 ? -0.05 : 0.2,
        tilt: 14 * fc,
        armL: { a: hopArc > 0 ? -65 : 32, b: -35 },
        armR: { a: hopArc > 0 ? -65 : 32, b: -35 },
        legL: { a: 28, b: hopArc > 0 ? -18 : -52 },
        legR: { a: 12, b: hopArc > 0 ? -18 : -48 },
      };
    }

    case 'cloud_sink': {
      const sink = easeIn(p);
      return {
        ...base,
        y: baseY + sink * 260,
        yaw: 0,
        headTilt: -18,
        armL: { a: -152, b: -14 },
        armR: { a: -158, b: -12 },
      };
    }

    case 'tub_drop':
      return {
        ...base,
        armL: { a: -125, b: -20 },
        armR: { a: -135, b: -18 },
        headTilt: -10,
      };

    case 'bowl_uranus': {
      const swing = easeOut(clamp(t / 18));
      return {
        ...base,
        tilt: 22 * swing,
        yaw: 0.85,
        facing: 1,
        armR: { a: lerp(-55, 78, swing), b: -14 },
        armL: { a: -42, b: -22 },
        legL: { a: 38 * swing, b: -48 * swing },
        legR: { a: -34 * swing, b: -18 },
      };
    }

    case 'bowl_neptune': {
      const tremble = Math.sin(t * 1.8) * 3;
      return {
        ...base,
        x: x + tremble,
        y: baseY + 24 * sc,
        squash: 0.19,
        tilt: 24,
        yaw: 0.65,
        armL: { a: 54, b: -36 },
        armR: { a: 58, b: -38 },
        legL: { a: 32, b: -54 },
        legR: { a: -14, b: -46 },
      };
    }

    case 'tiptoe': {
      const bob = Math.abs(Math.sin(t * 0.25)) * 10;
      return {
        ...base,
        y: baseY - 12 - bob,
        tilt: 8 * fc,
        armL: { a: -72, b: -28 },
        armR: { a: -68, b: -28 },
        legL: { a: 14 * Math.sin(t * 0.25), b: -18 },
        legR: { a: -14 * Math.sin(t * 0.25), b: -18 },
      };
    }

    case 'flinch_float': {
      const fl = easeOut(clamp((t - 6) / Math.max(12, len - 6)));
      return {
        ...base,
        y: baseY - fl * jPx,
        spin: -14 * fl,
        armL: { a: -125 * fl + 20, b: -22 },
        armR: { a: -130 * fl + 20, b: -22 },
        legL: { a: 22 * fl, b: -30 * fl },
        legR: { a: -18 * fl, b: -24 * fl },
      };
    }

    case 'magic_boots':
      return {
        ...base,
        yaw: 0.25,
        headTilt: 16,
        armL: { a: -48, b: -25 },
        armR: { a: 52, b: -20 },
        handR: 'point',
      };

    case 'sun_buckle': {
      const k = easeOut(clamp(t / 16));
      return {
        ...base,
        y: baseY + k * 54 * sc,
        squash: lerp(0.1, 0.42, k),
        tilt: 26 * k,
        headTilt: 22 * k,
        armL: { a: 45, b: -58 },
        armR: { a: 48, b: -58 },
        legL: { a: 44, b: -74 },
        legR: { a: 26, b: -70 },
      };
    }

    case 'sun_pancake':
    case 'thumb_wiggle': {
      return {
        ...base,
        y: groundY + 56 * sc,
        spin: 88,
        squash: 0,
        yaw: 0.85,
        facing: 1,
        armL: { a: 78, b: -15 },
        armR: { a: 96, b: act === 'thumb_wiggle' ? -24 + Math.sin(t * 0.9) * 18 : -12 },
        handR: act === 'thumb_wiggle' ? 'point' : 'open',
        legL: { a: -6, b: 6 },
        legR: { a: 6, b: -6 },
      };
    }

    default:
      return base;
  }
}

/** Render the world background set for `cfg.world`. */
const WorldBackdrop: React.FC<{ cfg: WorldShotConfig; t: number }> = ({ cfg, t }) => {
  const id = cfg.idSeed;
  switch (cfg.world) {
    case 'comet':
      return (
        <CometSet
          t={t}
          id={id}
          groundOffsetY={cfg.cometOffsetY ?? 0}
          cometScale={cfg.cometScale ?? 1}
        />
      );
    case 'gym':
      return <SchoolGymSet t={t} id={id} chalkMarkM={cfg.chalkMarkM} />;
    case 'stadium':
      return (
        <g>
          <Stadium t={t} id={id} mode="track" goal={false} />
          <HighJumpPit x={1060} groundY={855} showRecordTag />
        </g>
      );
    case 'bathroom':
      return <BathroomSet t={t} id={id} />;
    case 'moon':
      return <MoonSet t={t} id={id} showLander={false} />;
    case 'moon_apollo':
      return <MoonSet t={t} id={id} showLander />;
    case 'mars':
      return <MarsCourtSet t={t} id={id} />;
    case 'mercury':
      return (
        <MercurySet
          t={t}
          id={id}
          sunCrawlP={cfg.sunCrawlP ?? clamp(t / 120) * 0.25}
          showChair={cfg.mercuryChair ?? false}
          hourCount={cfg.mercuryHours}
        />
      );
    case 'venus':
      return <VenusSet t={t} id={id} showPressureArrows={cfg.pressureArrows ?? false} showVenera={false} />;
    case 'venus_venera':
      return (
        <VenusSet
          t={t}
          id={id}
          showVenera
          veneraTimer={cfg.veneraTimer ?? '~2 HOURS'}
          veneraFried={cfg.veneraFried ?? false}
        />
      );
    case 'titan':
      return <TitanSet t={t} id={id} />;
    case 'jupiter':
      return (
        <JupiterDiveSet
          t={t}
          id={id}
          boardBend={cfg.action === 'heavy_groan' || cfg.action === 'tiny_hop' ? 28 + Math.sin(t * 0.4) * 5 : 8}
        />
      );
    case 'saturn_bath':
      return (
        <SaturnBathSet
          t={t}
          id={id}
          saturnDropY={cfg.saturnDropY ?? 0}
          splashP={cfg.saturnSplash ? clamp((t - 6) / 26) : 0}
        />
      );
    case 'bowling':
      return (
        <CosmicBowlingSet
          t={t}
          id={id}
          uranusRollP={cfg.uranusRollP ?? clamp(t / 65)}
          pinsScatter={cfg.pinsScatter ?? 0}
        />
      );
    case 'pluto':
      return <PlutoSet t={t} id={id} showHouse={cfg.plutoHouse ?? true} />;
    case 'dimorphos':
      return <DimorphosSet t={t} id={id} showDartImpact={cfg.dartCrater ?? true} />;
    case 'sun':
      return <SunSet t={t} id={id} />;
    case 'rooftop':
      return (
        <g>
          <Rooftop t={t} sunX={920} sunY={715} cityLit={1.4} />
          {cfg.gag === 'conjunction_sky' ? <DawnConjunctionOverlay t={t} showConjunction showLeonids={false} /> : null}
          {cfg.gag === 'leonids_sky' ? <DawnConjunctionOverlay t={t} showConjunction showLeonids /> : null}
        </g>
      );
  }
};

/** Optional story-specific props drawn in world space so each segment illustrates its exact line! */
const WorldGags: React.FC<{ cfg: WorldShotConfig; pose: Pose; t: number; len: number; groundY: number }> = ({
  cfg,
  pose,
  t,
  len,
  groundY,
}) => {
  const p = clamp(t / Math.max(1, len));
  const j = joints(pose);
  const handR = toWorld(pose, j.armR.end);

  return (
    <g>
      {/* Bathroom scale prop whenever in bathroom */}
      {cfg.world === 'bathroom' ? (
        <BathroomScaleProp x={cfg.pipX ?? 920} y={groundY} s={1.15} needleDeg={lerp(-25, 34, clamp(t / 18))} />
      ) : null}

      {/* Sneaker dust puff on comet / moon / gym launch */}
      {cfg.gag === 'sneaker_dust' || cfg.action === 'launch' ? (
        <FocusRings x={pose.x} y={groundY - 6} t={t - 6} r0={24} color="#FFE27A" />
      ) : null}

      {/* Chalk slap sparkle in gym */}
      {cfg.action === 'chalk_slap' ? <Sparkle x={785} y={710 - 0.5 * 125} t={t - 14} s={1.25} /> : null}

      {/* Doorway comparison frame next to 2.45 m high-jump bar! */}
      {cfg.gag === 'doorway_frame' ? (
        <g transform={`translate(620 ${groundY})`}>
          <rect x={-95} y={-435} width={190} height={435} fill="#241E32" opacity={0.82} stroke="#FFE27A" strokeWidth={5} />
          <circle cx={68} cy={-210} r={9} fill="#FFE27A" />
          <text x={0} y={-452} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#FFE27A">
            STANDARD DOORWAY
          </text>
        </g>
      ) : null}

      {/* Glowing Moon outside bathroom window (S31) */}
      {cfg.gag === 'window_moon_glow' ? (
        <g transform="translate(1295 390)">
          <Glow x={0} y={0} r={180} kind="cool" o={0.85} />
          <circle r={34} fill="#F1F3FF" />
        </g>
      ) : null}

      {/* Wrestling a giant mattress visual gag (Ch 4 S46) */}
      {cfg.gag === 'mattress_icon' ? (
        <g transform={`translate(${pose.x + 210} ${groundY - 165}) rotate(${Math.sin(t * 0.35) * 6})`}>
          <rect x={-82} y={-135} width={164} height={265} rx={26} fill="#DCE6F7" stroke="#1A1E2E" strokeWidth={5} />
          {[-75, 0, 75].map((by, i) => (
            <g key={i}>
              <circle cx={-36} cy={by} r={6} fill="#6C7C9C" />
              <circle cx={36} cy={by} r={6} fill="#6C7C9C" />
            </g>
          ))}
          <text y={168} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FFE27A">
            STIFF SUIT = MATTRESS!
          </text>
        </g>
      ) : null}

      {/* Charlie Duke dizzy stars on backpack fall */}
      {cfg.action === 'duke_fall_flat' ? <DizzyStars x={pose.x - 110} y={groundY - 120} t={t - 12} rx={75} ry={32} /> : null}

      {/* Basketball on floor / dribbling / slam dunk! */}
      {cfg.gag === 'bball_floor' ? <BasketballProp x={(cfg.pipX ?? 760) + 135} y={groundY - 28} r={28} rot={t * 4} /> : null}
      {cfg.action === 'dribble' ? (
        <BasketballProp
          x={pose.x + 68 * pose.facing}
          y={groundY - 28 - Math.abs(Math.sin(t * 0.8)) * 92}
          r={28}
          rot={t * 14}
        />
      ) : null}
      {cfg.action === 'slam_dunk' ? (
        <g>
          <BasketballProp x={handR.x + 12} y={handR.y - 8} r={30} rot={t * 10} />
          <Sparkle x={1288} y={406} t={t - 18} s={1.5} />
        </g>
      ) : null}

      {/* Snack bag in Pip's hands on Mercury */}
      {cfg.action === 'snack_hold' ? (
        <g transform={`translate(${handR.x} ${handR.y - 18}) rotate(-8)`}>
          <rect x={-32} y={-44} width={64} height={76} rx={8} fill="#FF8A3D" stroke="#181520" strokeWidth={4} />
          <text y={0} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={18} fill="#0B0816">
            SNACKS
          </text>
        </g>
      ) : null}

      {/* Giant Panini Press gag on Venus (S84) */}
      {cfg.gag === 'panini_press' ? (
        <g transform={`translate(${pose.x} ${pose.y - 75})`}>
          <rect x={-165} y={-46} width={330} height={36} rx={10} fill="#5C6274" stroke="#18141C" strokeWidth={5} />
          {[-120, -60, 0, 60, 120].map((gx, i) => (
            <line key={i} x1={gx} y1={-10} x2={gx} y2={0} stroke="#FF6A3D" strokeWidth={8} />
          ))}
        </g>
      ) : null}

      {/* Robot question mark hologram on Venus (S85) */}
      {cfg.gag === 'robot_question' ? (
        <g transform="translate(960 545)">
          <circle r={120} fill="#0B0816" opacity={0.78} stroke="#FFE27A" strokeWidth={4} strokeDasharray="14 8" />
          <rect x={-48} y={-52} width={96} height={78} rx={16} fill="#8C96A8" stroke="#181520" strokeWidth={4} />
          <circle cx={-20} cy={-16} r={9} fill="#5BE08A" />
          <circle cx={20} cy={-16} r={9} fill="#5BE08A" />
          <line x1={0} y1={-52} x2={0} y2={-82} stroke="#CBD4E6" strokeWidth={5} />
          <circle cx={0} cy={-86} r={8} fill="#FF8A3D" />
          <text y={68} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFE27A">
            ROBOT?
          </text>
        </g>
      ) : null}

      {/* Venera parachute descent through yellow clouds (S88/S89) */}
      {cfg.gag === 'venera_parachute' ? (
        <g transform={`translate(960 ${lerp(290, 560, p)})`}>
          <path d="M -130 -150 Q 0 -275 130 -150 Z" fill="#F4EFE6" stroke="#18141C" strokeWidth={5} />
          <path d="M -120 -150 L -34 -38 M 120 -150 L 34 -38 M 0 -155 L 0 -45" stroke="#EAE5DC" strokeWidth={3.5} />
          <circle cx={0} cy={0} r={54} fill="#9AA2B2" stroke="#18141C" strokeWidth={5} />
        </g>
      ) : null}

      {/* Cardboard wings attached to Pip on Titan */}
      {cfg.world === 'titan' && (cfg.action === 'tape_wings' || cfg.action === 'flap_launch' || cfg.action === 'flap_soar') ? (
        <CardboardWingsOverlay
          pose={pose}
          flapDeg={cfg.action === 'tape_wings' ? 0 : Math.sin(t * 0.65) * 26}
        />
      ) : null}

      {/* Bowling ball rack pickup gag (S130) */}
      {cfg.gag === 'bowling_ball_rack' ? (
        <g transform={`translate(${pose.x + 150} ${groundY})`}>
          <ellipse cx={0} cy={8} rx={72} ry={12} fill="#000" opacity={0.45} />
          <circle cx={0} cy={-44} r={48} fill="#2554C7" stroke="#101830" strokeWidth={5} />
          <circle cx={-12} cy={-56} r={5} fill="#0E152B" />
          <circle cx={8} cy={-58} r={5} fill="#0E152B" />
          <circle cx={-2} cy={-42} r={6} fill="#0E152B" />
        </g>
      ) : null}

      {/* NASA DART spacecraft slamming into Dimorphos (S161) */}
      {cfg.gag === 'dart_spacecraft' ? (
        <g transform={`translate(${lerp(360, 1210, easeIn(clamp(p * 1.25)))} ${lerp(240, 805, easeIn(clamp(p * 1.25)))}) rotate(32)`}>
          <rect x={-160} y={-14} width={120} height={28} fill="#28559A" stroke="#101522" strokeWidth={3.5} />
          <rect x={40} y={-14} width={120} height={28} fill="#28559A" stroke="#101522" strokeWidth={3.5} />
          <rect x={-32} y={-28} width={64} height={56} rx={6} fill="#D9A441" stroke="#101522" strokeWidth={4} />
          {p > 0.72 ? <FocusRings x={0} y={0} t={(p - 0.72) * 55} r0={40} color="#FFE27A" /> : null}
        </g>
      ) : null}

      {/* ESA Philae Lander props on Comet 67P (Ch 15 & Short) */}
      {cfg.gag === 'philae_touch' ? (
        <PhilaeLanderProp x={1120} y={lerp(560, groundY - 38, easeOut(p))} s={1.25} rot={lerp(-6, 0, p)} />
      ) : null}
      {cfg.gag === 'philae_harpoon_fail' ? (
        <PhilaeLanderProp x={1020} y={groundY - 38} s={1.45} rot={4} harpoonFail />
      ) : null}
      {cfg.gag === 'philae_bounce_arc' ? (
        <g>
          <path d={`M 580 ${groundY - 10} Q 980 320 1440 ${groundY - 120}`} fill="none" stroke="#7FD4FF" strokeWidth={5} strokeDasharray="14 10" />
          <PhilaeLanderProp
            x={lerp(580, 1340, p)}
            y={lerp(groundY - 38, 420, Math.sin(p * Math.PI * 0.85))}
            s={1.1}
            rot={p * 28}
          />
        </g>
      ) : null}

      {/* Magic glowing heat-proof boots on Sun deck (S180 / S186) */}
      {cfg.action === 'magic_boots' ? (
        <g>
          <Glow x={pose.x - 18} y={groundY - 12} r={72} kind="cool" o={0.85} />
          <Glow x={pose.x + 22} y={groundY - 12} r={72} kind="cool" o={0.85} />
        </g>
      ) : null}

      {/* Heroic thumb wiggle sparkle on Sun deck (S186) */}
      {cfg.action === 'thumb_wiggle' ? <Sparkle x={pose.x + 165} y={groundY - 58} t={(t % 18) + 1} s={0.95} /> : null}

      {/* Dream bubble of cool green Earth while flattened on the Sun (S187) */}
      {cfg.gag === 'earth_thought_bubble' ? (
        <g transform="translate(1310 385)">
          <circle cx={-160} cy={185} r={14} fill="#FFF9F0" opacity={0.85} />
          <circle cx={-110} cy={135} r={24} fill="#FFF9F0" opacity={0.88} />
          <ellipse cx={0} cy={0} rx={210} ry={135} fill="#0E172E" stroke="#FFF9F0" strokeWidth={6} />
          <circle cx={0} cy={0} r={74} fill="#2668B8" stroke="#8EC5FF" strokeWidth={3} />
          <path d="M -32 -32 Q 0 -48 28 -16 Q 14 22 -28 14 Z M 8 18 Q 42 12 32 48 Q 4 52 2 28 Z" fill="#49A86A" />
        </g>
      ) : null}
    </g>
  );
};

/** Blurred foreground depth shapes so repeated sets get distinct foreground framing! */
const ForegroundLayer: React.FC<{ fg?: FgKind }> = ({ fg = 'none' }) => {
  if (fg === 'none') return null;
  if (fg === 'boulderL') {
    return (
      <Foreground blur={10}>
        <polygon points="-80,1120 -80,760 220,835 340,1120" fill="#0B0914" opacity={0.88} />
      </Foreground>
    );
  }
  if (fg === 'boulderR') {
    return (
      <Foreground blur={10}>
        <polygon points="1580,1120 1710,810 2020,740 2020,1120" fill="#0B0914" opacity={0.88} />
      </Foreground>
    );
  }
  if (fg === 'rail') {
    return (
      <Foreground blur={6}>
        <rect x={-60} y={965} width={2040} height={36} fill="#0D0A18" opacity={0.85} />
      </Foreground>
    );
  }
  if (fg === 'cloud') {
    return (
      <Foreground blur={10}>
        <ellipse cx={260} cy={980} rx={420} ry={130} fill="#2B1810" opacity={0.72} />
        <ellipse cx={1690} cy={990} rx={420} ry={130} fill="#2B1810" opacity={0.72} />
      </Foreground>
    );
  }
  if (fg === 'ots_mo' || fg === 'ots_sis') {
    const cx = fg === 'ots_mo' ? 235 : 1685;
    return (
      <Foreground blur={10}>
        <circle cx={cx} cy={790} r={135} fill="#0C0A16" />
        <path d={`M ${cx - 220} 1120 Q ${cx} 900 ${cx + 220} 1120 Z`} fill="#0C0A16" />
      </Foreground>
    );
  }
  return null;
};

/** Main Live-Action World Shot Component (works for both 16:9 Film and 9:16 JumpShort!). */
export const WorldSceneShot: React.FC<{ cfg: WorldShotConfig; t: number; len: number }> = ({ cfg, t, len }) => {
  const p = clamp(t / Math.max(1, len));
  const [cx0, cy0, s0] = cfg.cam;
  const [cx1, cy1, s1] = cfg.camEnd ?? [cx0, cy0 + 4, s0 * 1.035];
  const cx = lerp(cx0, cx1, easeInOut(p));
  const cy = lerp(cy0, cy1, easeInOut(p));
  const sc = lerp(s0, s1, easeInOut(p));
  const groundY = WORLD_GROUND[cfg.world];
  const pose = computePose(cfg, t, len, groundY);
  const camStr = cfg.vertical ? camTV(cx, cy, sc) : camT(cx, cy, sc);
  const rotWrap = cfg.camRot ? `rotate(${cfg.camRot} ${cfg.vertical ? 540 : 960} ${cfg.vertical ? 960 : 540})` : undefined;

  const rimId =
    cfg.world === 'venus' || cfg.world === 'venus_venera' || cfg.world === 'sun'
      ? 'rimRed'
      : cfg.world === 'moon' || cfg.world === 'moon_apollo' || cfg.world === 'pluto' || cfg.world === 'dimorphos' || cfg.world === 'comet'
        ? 'rimBlue'
        : 'rimR';

  const airborne =
    cfg.action === 'soar_arc' ||
    cfg.action === 'drift_up' ||
    cfg.action === 'float_spin' ||
    cfg.action === 'wave_escape' ||
    cfg.action === 'flap_soar' ||
    cfg.action === 'flinch_float';

  const isApolloSuit =
    cfg.action === 'suit_stand' ||
    cfg.action === 'suit_wrestle' ||
    cfg.action === 'duke_jump' ||
    cfg.action === 'duke_tip' ||
    cfg.action === 'duke_fall_flat';

  return (
    <g>
      <g transform={rotWrap}>
        <g transform={camStr}>
          <WorldBackdrop cfg={cfg} t={t} />

          {/* Optional world-space vertical height scale bar */}
          {cfg.scaleBar ? (
            <HeightScaleBar
              x={cfg.scaleBar.x}
              groundY={groundY}
              pxPerMetre={cfg.scaleBar.pxPerM}
              maxM={cfg.scaleBar.maxM}
              stepM={cfg.scaleBar.stepM}
              curM={cfg.scaleBar.curM}
              highlightM={cfg.scaleBar.hiM}
              highlightLabel={cfg.scaleBar.hiLabel}
              color={cfg.scaleBar.color}
            />
          ) : null}

          {/* Optional secondary recurring cast member (Mo / Sis / Suit official) */}
          {cfg.extraCast ? (
            <Actor
              look={LOOKS[cfg.extraCast]}
              pose={{
                ...basePose,
                x: cfg.extraX ?? 1220,
                y: groundY - feetBelowHips(cfg.extraCast === 'sis' ? 0.68 : 0.88),
                scale: cfg.extraCast === 'sis' ? 0.68 : 0.88,
                facing: -1,
                yaw: -0.45,
                expr: 'happy',
                headTilt: -10,
                armL: { a: 22, b: -18 },
                armR: { a: -45, b: -24 },
              }}
              rimId={rimId}
              shadow={0.9}
            />
          ) : null}

          <WorldGags cfg={cfg} pose={pose} t={t} len={len} groundY={groundY} />

          {/* Hero Character (Pip or Bulky Apollo Astronaut) */}
          {cfg.action !== 'none' ? (
            isApolloSuit ? (
              <BulkySuitHero pose={pose} rimId="rimBlue" shadow={airborne ? 0.15 : 0.65} />
            ) : (
              <Hero
                look={LOOKS.pipHood}
                pose={pose}
                rimId={rimId}
                shadow={airborne || cfg.action === 'cloud_sink' ? 0.12 : 0.9}
              />
            )
          ) : null}

          {/* Foreground cloud bank swallowing sinking Pip on Jupiter! */}
          {cfg.world === 'jupiter' && cfg.action === 'cloud_sink' ? (
            <JupiterDiveSet t={t} id={`${cfg.idSeed}fg`} cloudForegroundCover />
          ) : null}

          {/* Selection Marquee in world space */}
          {cfg.marquee ? (
            <Marquee
              x={cfg.marquee.x}
              y={cfg.marquee.y}
              w={cfg.marquee.w}
              h={cfg.marquee.h}
              t={t - 3}
              label={cfg.marquee.label}
              color={cfg.marquee.color}
            />
          ) : null}
        </g>
      </g>

      {!cfg.vertical ? <ForegroundLayer fg={cfg.fg} /> : null}

      {/* Screen-space UI Overlays (never scaled out of bounds!) */}
      {cfg.chapterCard ? (
        <WorldChapterCard
          t={t}
          world={cfg.chapterCard.world}
          sub={cfg.chapterCard.sub}
          color={cfg.chapterCard.color}
          mode={cfg.chapterCard.mode ?? 'hero'}
        />
      ) : null}

      {cfg.pill ? (
        <TelemetryPill
          x={cfg.pill.x ?? (cfg.vertical ? 540 : 1545)}
          y={cfg.pill.y ?? (cfg.vertical ? 1390 : 145)}
          t={t - (cfg.pill.delay ?? 2)}
          label={cfg.pill.label}
          value={cfg.pill.value}
          color={cfg.pill.color}
        />
      ) : null}

      {cfg.pill2 ? (
        <TelemetryPill
          x={cfg.pill2.x ?? (cfg.vertical ? 540 : 1545)}
          y={cfg.pill2.y ?? (cfg.vertical ? 1515 : 278)}
          t={t - (cfg.pill2.delay ?? 6)}
          label={cfg.pill2.label}
          value={cfg.pill2.value}
          color={cfg.pill2.color ?? '#7FD4FF'}
        />
      ) : null}

      {cfg.dial ? <Dial x={cfg.dial.x ?? 1720} y={cfg.dial.y ?? 165} p={cfg.dial.p} readout={cfg.dial.readout} /> : null}
      {cfg.gauge ? (
        <Gauge x={cfg.gauge.x} y={cfg.gauge.y} p={cfg.gauge.p} label={cfg.gauge.label} danger={cfg.gauge.danger} />
      ) : null}
      {cfg.tag ? <Tag x={cfg.tag.x} y={cfg.tag.y} t={t - 3} text={cfg.tag.text} mark={cfg.tag.mark} w={230} /> : null}

      {cfg.shortStat ? (
        <ShortBigNumber
          t={t}
          world={cfg.shortStat.world}
          bigValue={cfg.shortStat.bigValue}
          subText={cfg.shortStat.subText}
          color={cfg.shortStat.color}
          y={cfg.shortStat.y}
        />
      ) : null}

      {cfg.titleCard ? (
        <JumpTitleCard
          t={t}
          x={cfg.vertical ? 540 : 960}
          y={cfg.vertical ? 340 : 185}
          size={cfg.vertical ? 78 : 112}
          accentT={14}
        />
      ) : null}

      {cfg.endCard ? cfg.vertical ? <JumpShortEndCard9x16 t={t} /> : <JumpEndCard16x9 t={t} /> : null}
    </g>
  );
};

export type DiagramKind =
  | 'montage_houses'
  | 'montage_flatten'
  | 'earth_vs_record'
  | 'muscle_push_constant'
  | 'gravity_slider_low'
  | 'gravity_slider_high'
  | 'lunar_pull_162'
  | 'mars_pull_371'
  | 'mercury_dense_core'
  | 'mercury_4222_day'
  | 'venus_93x_900m'
  | 'venus_465c_oven'
  | 'titan_flight_formula'
  | 'jupiter_165kg_scale'
  | 'saturn_687_density'
  | 'uranus_98_tilt'
  | 'pluto_4_5kg_scale'
  | 'dimorphos_151m_size'
  | 'dart_33min_orbit'
  | 'philae_38cms_1km_2h'
  | 'sun_28x_arrows'
  | 'short_philae_38cms';

/** Bespoke Blueprint / Schematic Science Diagrams (each DiagramKind has a completely unique layout & illustration!). */
export const SchematicDiagramShot: React.FC<{ kind: DiagramKind; t: number; len: number; vertical?: boolean }> = ({
  kind,
  t,
  len,
  vertical = false,
}) => {
  const p = easeOut(clamp(t / Math.max(12, len * 0.65)));
  return (
    <g>
      <Schematic t={t} id={`sch_${kind}`} vertical={vertical} />

      {kind === 'montage_houses' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#143B4D" opacity={0.28} />
          <SchLabel x={960} y={155} t={t - 1} text="LOW-GRAVITY WORLDS" size={44} color="#7FD4FF" />
          {/* Suburban house silhouette on blueprint */}
          <DrawOn d="M 520 820 L 520 560 L 720 420 L 920 560 L 920 820 Z" t={t - 2} dur={10} color="#F6EFE3" width={6} />
          <DrawOn d="M 320 820 L 1620 820" t={t} dur={8} color="#7E8DA6" width={5} />
          {/* Huge glowing parabolic jump arc clearing the house! */}
          <DrawOn d="M 380 815 Q 720 110 1180 815" t={t - 4} dur={14} color="#5BE08A" width={8} />
          <Hero
            look={LOOKS.pipHood}
            pose={{ ...basePose, x: 740, y: 290, scale: 0.66, tilt: 16, armL: { a: -140, b: -15 }, armR: { a: -150, b: -15 }, legL: { a: 28, b: -35 }, expr: 'happy' }}
            rimId="rimBlue"
            shadow={0}
          />
          <TelemetryPill x={1390} y={460} t={t - 6} label="PLUTO JUMP" value="~7 m HIGH" color="#5BE08A" />
        </g>
      ) : null}

      {kind === 'montage_flatten' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#5C1814" opacity={0.34} />
          <SchLabel x={960} y={155} t={t - 1} text="EXTREME-GRAVITY WORLDS" size={44} color="#FF5A4A" />
          <DrawOn d="M 320 830 L 1600 830" t={t} dur={8} color="#F6EFE3" width={6} />
          {[560, 760, 960, 1160, 1360].map((ax, i) => (
            <Arrow key={i} x0={ax} y0={250} x1={ax} y1={620} t={t - i * 2} dur={9} color="#FF5A4A" bend={0} />
          ))}
          <Hero
            look={LOOKS.pipHood}
            pose={{ ...basePose, x: 960, y: 882, scale: 0.88, squash: 0, spin: 88, yaw: 0.8, expr: 'dizzy' }}
            rimId="rimRed"
            shadow={0.5}
          />
          <TelemetryPill x={960} y={950} t={t - 6} label="SOLAR SURFACE" value="~28x GRAVITY" color="#FF5A4A" />
        </g>
      ) : null}

      {kind === 'earth_vs_record' ? (
        <g>
          <SchLabel x={960} y={135} t={t - 1} text="EARTH JUMP vs WORLD RECORD" size={44} color="#FFE27A" />
          <DrawOn d="M 280 860 L 1640 860" t={t} dur={8} color="#F6EFE3" width={6} />
          {/* Left bar: 0.5 m standing jump */}
          <rect x={470} y={860 - 110 * p} width={180} height={110 * p} rx={12} fill="#7FD4FF" opacity={0.85} />
          <SchLabel x={560} y={715} t={t - 4} text="~0.5 m" size={48} color="#7FD4FF" />
          <SchLabel x={560} y={915} t={t - 4} text="YOUR HOP" size={28} color="#F6EFE3" />
          {/* Right bar: 2.45 m Sotomayor 1993 */}
          <rect x={1150} y={860 - 540 * p} width={210} height={540 * p} rx={12} fill="#FF8A3D" opacity={0.9} />
          <SchLabel x={1255} y={285} t={t - 6} text="2.45 m" size={62} color="#FFE27A" />
          <SchLabel x={1255} y={915} t={t - 6} text="SOTOMAYOR (1993)" size={28} color="#FFE27A" />
        </g>
      ) : null}

      {kind === 'muscle_push_constant' ? (
        <g>
          <SchLabel x={960} y={145} t={t - 1} text="SAME LEG PUSH EVERYWHERE" size={46} color="#FFE27A" />
          {[480, 960, 1440].map((cx, i) => {
            const labels = ['EARTH', 'MOON', 'PLUTO'];
            const cols = ['#FFE27A', '#7FD4FF', '#5BE08A'];
            return (
              <g key={i} transform={`translate(${cx} 680)`}>
                <circle r={135} fill="#0B0816" opacity={0.7} stroke={cols[i]} strokeWidth={4} />
                {/* Identical glowing coiled leg-spring icon */}
                <path
                  d="M -38 55 L 38 35 L -38 15 L 38 -5 L -38 -25 L 38 -45 L 0 -65"
                  fill="none"
                  stroke="#FF8A3D"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Arrow x0={0} y0={-70} x1={0} y1={-195} t={t - 3 - i * 2} dur={8} color="#5BE08A" bend={0} />
                <text y={195} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={cols[i]}>
                  {labels[i]}
                </text>
              </g>
            );
          })}
          <SchLabel x={960} y={955} t={t - 8} text="SAME MUSCLE FORCE · DIFFERENT GRAVITY" size={30} color="#F6EFE3" />
        </g>
      ) : null}

      {kind === 'gravity_slider_low' ? (
        <g>
          <ScaleDialMacro x={580} y={560} gravityP={lerp(0.5, 0.08, p)} label="LESS GRAVITY" readout="HIGHER + LONGER" />
          <DrawOn d="M 1020 820 L 1760 820" t={t} dur={8} color="#F6EFE3" width={5} />
          <DrawOn d="M 1080 815 Q 1390 190 1700 815" t={t - 3} dur={12} color="#5BE08A" width={9} />
          <TelemetryPill x={1390} y={240} t={t - 5} label="HANG TIME & HEIGHT" value="SOARS UP!" color="#5BE08A" />
        </g>
      ) : null}

      {kind === 'gravity_slider_high' ? (
        <g>
          <ScaleDialMacro x={580} y={560} gravityP={lerp(0.5, 0.95, p)} label="MORE GRAVITY" readout="DRAGS STRAIGHT DOWN" />
          <DrawOn d="M 1020 820 L 1760 820" t={t} dur={8} color="#F6EFE3" width={5} />
          <DrawOn d="M 1160 815 Q 1390 740 1620 815" t={t - 3} dur={10} color="#FF5A4A" width={9} />
          {[1240, 1390, 1540].map((ax, i) => (
            <Arrow key={i} x0={ax} y0={380} x1={ax} y1={690} t={t - 2 - i * 2} dur={8} color="#FF5A4A" bend={0} />
          ))}
          <TelemetryPill x={1390} y={280} t={t - 5} label="HEAVY PULL" value="PINNED DOWN" color="#FF5A4A" />
        </g>
      ) : null}

      {kind === 'lunar_pull_162' ? (
        <g>
          <SchLabel x={960} y={140} t={t - 1} text="LUNAR SURFACE GRAVITY" size={44} color="#7FD4FF" />
          <circle cx={640} cy={560} r={210} fill="#464B5E" stroke="#DCE3F5" strokeWidth={6} />
          <circle cx={570} cy={490} r={38} fill="#323646" />
          <circle cx={710} cy={610} r={52} fill="#323646" />
          <Arrow x0={640} y0={220} x1={640} y1={335} t={t - 3} dur={8} color="#7FD4FF" bend={0} />
          <TelemetryPill x={1320} y={440} t={t - 3} label="MOON GRAVITY" value="~1.62 m/s²" color="#7FD4FF" scale={1.2} />
          <TelemetryPill x={1320} y={650} t={t - 7} label="YOUR GYM HOP" value="~3 m · ~4 s" color="#FFE27A" scale={1.15} />
        </g>
      ) : null}

      {kind === 'mars_pull_371' ? (
        <g>
          <SchLabel x={960} y={140} t={t - 1} text="MARTIAN SURFACE GRAVITY" size={44} color="#FF8A3D" />
          <circle cx={620} cy={560} r={215} fill="#A8442E" stroke="#FFB88C" strokeWidth={6} />
          <path d="M 480 480 Q 620 530 760 470 M 460 620 Q 630 660 770 590" stroke="#7A2B1C" strokeWidth={16} fill="none" strokeLinecap="round" />
          <TelemetryPill x={1330} y={435} t={t - 3} label="MARS GRAVITY" value="~3.71 m/s²" color="#FF8A3D" scale={1.2} />
          <TelemetryPill x={1330} y={655} t={t - 7} label="JUMP MULTIPLIER" value="~2.6x HIGHER" color="#FFE27A" scale={1.15} />
        </g>
      ) : null}

      {kind === 'mercury_dense_core' ? (
        <g>
          <SchLabel x={960} y={140} t={t - 1} text="WHY TINY MERCURY PULLS LIKE MARS" size={42} color="#FFE27A" />
          {/* Left: Cutaway Mercury showing huge dense iron core */}
          <g transform="translate(580 565)">
            <circle r={175} fill="#5C5868" stroke="#F6EFE3" strokeWidth={5} />
            <circle r={138 * p} fill="#FF8A3D" stroke="#FFE27A" strokeWidth={5} />
            <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#0B0816">
              HUGE IRON CORE
            </text>
            <text y={235} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">
              MERCURY
            </text>
          </g>
          <text x={960} y={580} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFE27A">
            ≈
          </text>
          {/* Right: Larger Mars */}
          <g transform="translate(1340 565)">
            <circle r={225} fill="#9E3F2B" stroke="#FFB88C" strokeWidth={5} />
            <text y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill="#FFF3E0">
              SAME PULL!
            </text>
            <text y={275} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#FFB88C">
              MARS (3.71 m/s²)
            </text>
          </g>
        </g>
      ) : null}

      {kind === 'mercury_4222_day' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#4D3614" opacity={0.28} />
          <SchLabel x={960} y={150} t={t - 1} text="ONE MERCURY SOLAR DAY" size={46} color="#FFE27A" />
          <rect x={420} y={300} width={1080} height={330} rx={36} fill="#0B0816" stroke="#FFE27A" strokeWidth={6} />
          <text x={960} y={505} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill="#FFE27A">
            ~4,222 h
          </text>
          {/* Sunrise-to-sunrise progress bar inside card */}
          <rect x={510} y={555} width={900} height={28} rx={14} fill="#1E1B2E" stroke="#7E8DA6" strokeWidth={2.5} />
          <rect x={514} y={559} width={Math.max(24, 892 * p)} height={20} rx={10} fill="#FF8A3D" />
          <SchLabel x={960} y={760} t={t - 6} text="ABOUT 4,222 HOURS FROM SUNRISE TO SUNRISE" size={34} color="#7FD4FF" />
        </g>
      ) : null}

      {kind === 'venus_93x_900m' ? (
        <g>
          <SchLabel x={960} y={135} t={t - 1} text="VENUS SURFACE PRESSURE (~93x EARTH)" size={42} color="#FF8A3D" />
          {/* Deep ocean water column diagram */}
          <rect x={420} y={230} width={1080} height={660} rx={24} fill="#0D2847" stroke="#7FD4FF" strokeWidth={5} />
          <line x1={420} y1={280} x2={1500} y2={280} stroke="#8EEBFF" strokeWidth={6} />
          <text x={560} y={265} fontFamily={FONT.ui} fontSize={26} fill="#8EEBFF">
            SEA SURFACE
          </text>
          <Arrow x0={620} y0={305} x1={620} y1={795} t={t - 2} dur={12} color="#FFE27A" bend={0} />
          <Hero
            look={LOOKS.pipHood}
            pose={{ ...basePose, x: 980, y: 745, scale: 0.68, squash: 0.25, expr: 'oops', armL: { a: -120, b: -20 }, armR: { a: -120, b: -20 } }}
            rimId="rimBlue"
            shadow={0}
          />
          <TelemetryPill x={1220} y={555} t={t - 5} label="HYDROSTATIC EQUIVALENT" value="~900 m DEEP" color="#7FD4FF" scale={1.15} />
        </g>
      ) : null}

      {kind === 'venus_465c_oven' ? (
        <g>
          <SchLabel x={960} y={140} t={t - 1} text="VENUS SURFACE TEMPERATURE" size={44} color="#FF5A4A" />
          {/* Giant glowing mercury thermometer spiking to 465 °C */}
          <rect x={620} y={240} width={96} height={520} rx={48} fill="#0B0816" stroke="#F6EFE3" strokeWidth={6} />
          <circle cx={668} cy={780} r={86} fill="#FF4A3A" stroke="#F6EFE3" strokeWidth={6} />
          <rect x={644} y={740 - 440 * p} width={48} height={440 * p + 40} rx={24} fill="#FF4A3A" />
          <TelemetryPill x={1210} y={480} t={t - 4} label="ROCK TEMPERATURE" value="~465 °C" color="#FF5A4A" scale={1.35} />
          <SchLabel x={1210} y={675} t={t - 8} text="HOTTER THAN A PIZZA OVEN!" size={32} color="#FFE27A" />
        </g>
      ) : null}

      {kind === 'titan_flight_formula' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#6E4A14" opacity={0.34} />
          <SchLabel x={960} y={145} t={t - 1} text="WHY HUMAN FLIGHT WORKS ON TITAN" size={44} color="#FFE27A" />
          {/* Big golden cardboard wing silhouettes flanking center */}
          <polygon points="180,360 470,410 440,560 150,490" fill="#C48F54" stroke="#F6EFE3" strokeWidth={5} opacity={0.85} />
          <polygon points="1740,360 1450,410 1480,560 1770,490" fill="#C48F54" stroke="#F6EFE3" strokeWidth={5} opacity={0.85} />
          <TelemetryPill x={650} y={470} t={t - 2} label="SURFACE GRAVITY" value="~1/7 EARTH" color="#5BE08A" scale={1.15} />
          <text x={960} y={485} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={88} fill="#F6EFE3">
            +
          </text>
          <TelemetryPill x={1270} y={470} t={t - 5} label="SURFACE AIR DENSITY" value="~4x EARTH" color="#FFE27A" scale={1.15} />
          <DrawOn d="M 480 680 L 1440 680" t={t - 7} dur={10} color="#7FD4FF" width={6} />
          <SchLabel x={960} y={795} t={t - 9} text="= CARDBOARD WINGS CAN LIFT YOU!" size={46} color="#7FD4FF" />
        </g>
      ) : null}

      {kind === 'jupiter_165kg_scale' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#6E2E18" opacity={0.38} />
          {/* Striped gas-giant band behind beam */}
          <rect x={0} y={360} width={1920} height={120} fill="#C86438" opacity={0.22} />
          <rect x={0} y={560} width={1920} height={90} fill="#E69A58" opacity={0.18} />
          <SchLabel x={960} y={140} t={t - 1} text="YOUR WEIGHT AT JUPITER (~2.5x GRAVITY)" size={42} color="#FF8A3D" />
          {/* Heavy balance beam slamming down on the right! */}
          <polygon points="960,650 905,765 1015,765" fill="#F6EFE3" />
          <g transform="translate(960 650) rotate(14)">
            <line x1={-520} y1={0} x2={520} y2={0} stroke="#FFE27A" strokeWidth={12} strokeLinecap="round" />
            {/* Left pan: 70 kg */}
            <rect x={-520} y={-125} width={220} height={115} rx={16} fill="#1E3554" stroke="#7FD4FF" strokeWidth={5} />
            <text x={-410} y={-52} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill="#7FD4FF">
              70 kg
            </text>
            {/* Right pan: massive ~165 kg anvil block! */}
            <rect x={260} y={-215} width={310} height={205} rx={20} fill="#8C261E" stroke="#FF5A4A" strokeWidth={6} />
            <text x={415} y={-130} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFE27A">
              ON JUPITER
            </text>
            <text x={415} y={-68} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={62} fill="#FFF3E0">
              ~165 kg
            </text>
          </g>
          <SchLabel x={960} y={885} t={t - 9} text="JUMP SHRINKS TO ABOUT 20 cm!" size={38} color="#FFE27A" />
        </g>
      ) : null}

      {kind === 'saturn_687_density' ? (
        <g>
          <SchLabel x={960} y={140} t={t - 1} text="SATURN AVERAGE BULK DENSITY" size={44} color="#FFE27A" />
          {/* Water tank cross-section */}
          <rect x={440} y={450} width={1040} height={420} rx={22} fill="#175B7D" opacity={0.8} stroke="#7FD4FF" strokeWidth={5} />
          <line x1={440} y1={520} x2={1480} y2={520} stroke="#9EEFFF" strokeWidth={6} />
          {/* Floating ringed Saturn above waterline */}
          <g transform={`translate(760 ${490 + Math.sin(t * 0.15) * 10}) rotate(-14)`}>
            <ellipse rx={210} ry={44} fill="none" stroke="#F6DF9E" strokeWidth={20} />
            <circle r={92} fill="#E5BE75" stroke="#181B28" strokeWidth={5} />
          </g>
          <TelemetryPill x={1255} y={350} t={t - 4} label="SATURN DENSITY" value="687 kg/m³" color="#FFE27A" scale={1.2} />
          <SchLabel x={1255} y={690} t={t - 7} text="LESS DENSE THAN WATER!" size={30} color="#9EEFFF" />
        </g>
      ) : null}

      {kind === 'uranus_98_tilt' ? (
        <g>
          <SchLabel x={960} y={140} t={t - 1} text="URANUS AXIAL TILT: ~98 DEGREES" size={44} color="#7FD4FF" />
          {/* Vertical normal reference axis + 98° tipped axis */}
          <line x1={760} y1={260} x2={760} y2={860} stroke="#7E8DA6" strokeWidth={4} strokeDasharray="12 10" />
          <line x1={420} y1={520} x2={1100} y2={615} stroke="#FFE27A" strokeWidth={6} />
          <g transform="translate(760 568) rotate(8)">
            <ellipse rx={58} ry={220} fill="none" stroke="#BCEFFF" strokeWidth={14} />
            <circle r={128} fill="#7AD7F0" stroke="#162330" strokeWidth={6} />
          </g>
          <DrawOn d="M 760 360 A 208 208 0 0 1 962 595" t={t - 3} dur={12} color="#FF8A3D" width={7} />
          <TelemetryPill x={1380} y={520} t={t - 5} label="SPIN AXIS" value="~98° TILT" color="#7FD4FF" scale={1.25} />
        </g>
      ) : null}

      {kind === 'pluto_4_5kg_scale' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#103848" opacity={0.42} />
          {/* Icy Pluto heart silhouette in background */}
          <circle cx={380} cy={470} r={190} fill="#2A4D69" opacity={0.55} stroke="#7FD4FF" strokeWidth={4} />
          <SchLabel x={960} y={140} t={t - 1} text="YOUR WEIGHT ON PLUTO (0.62 m/s²)" size={44} color="#7FD4FF" />
          {/* Feather-light balance beam tipping HIGH up on the right! */}
          <polygon points="960,670 905,785 1015,785" fill="#7FD4FF" />
          <g transform="translate(960 670) rotate(-16)">
            <line x1={-480} y1={0} x2={480} y2={0} stroke="#9EEFFF" strokeWidth={10} strokeLinecap="round" />
            <rect x={-470} y={-145} width={230} height={135} rx={18} fill="#362A48" stroke="#FFE27A" strokeWidth={5} />
            <text x={-355} y={-62} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill="#FFE27A">
              70 kg
            </text>
            {/* Tiny floating ~4-5 kg Pluto badge */}
            <circle cx={365} cy={-80} r={72} fill="#154D3E" stroke="#5BE08A" strokeWidth={5} />
            <text x={365} y={-66} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#5BE08A">
              ~4–5 kg
            </text>
          </g>
          <TelemetryPill x={1440} y={340} t={t - 5} label="FEELS ON PLUTO" value="~4–5 kg" color="#5BE08A" scale={1.2} />
          <SchLabel x={960} y={895} t={t - 8} text="LIGHT AS A HOUSE CAT!" size={38} color="#F6EFE3" />
        </g>
      ) : null}

      {kind === 'dimorphos_151m_size' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#261E38" opacity={0.38} />
          <SchLabel x={960} y={140} t={t - 1} text="ASTEROID DIMORPHOS DIAMETER" size={44} color="#FFE27A" />
          <ellipse cx={960} cy={520} rx={360 * p} ry={245 * p} fill="#5B5668" stroke="#F6EFE3" strokeWidth={6} />
          <circle cx={810} cy={460} r={42 * p} fill="#433F4F" />
          <circle cx={1090} cy={565} r={54 * p} fill="#433F4F" />
          <Arrow x0={600} y0={825} x1={1320} y1={825} t={t - 4} dur={10} color="#FFE27A" bend={0} />
          <Arrow x0={1320} y0={825} x1={600} y1={825} t={t - 4} dur={10} color="#FFE27A" bend={0} />
          <TelemetryPill x={960} y={520} t={t - 5} label="RUBBLE MOONLET" value="~151 m WIDE" color="#FFE27A" scale={1.3} />
        </g>
      ) : null}

      {kind === 'dart_33min_orbit' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#182E26" opacity={0.34} />
          <SchLabel x={960} y={135} t={t - 1} text="2022 NASA DART ORBIT CHANGE" size={44} color="#FF8A3D" />
          {/* Central Didymos + outer old orbit + inner new shortened orbit */}
          <circle cx={720} cy={565} r={108} fill="#666173" stroke="#F6EFE3" strokeWidth={5} />
          <ellipse cx={720} cy={565} rx={460} ry={275} fill="none" stroke="#7E8DA6" strokeWidth={4} strokeDasharray="14 12" />
          <ellipse cx={720} cy={565} rx={365} ry={215} fill="none" stroke="#5BE08A" strokeWidth={7} />
          <circle cx={1085} cy={565} r={32} fill="#FF8A3D" stroke="#F6EFE3" strokeWidth={4} />
          <TelemetryPill x={1515} y={450} t={t - 4} label="ORBIT SHORTENED" value="~33 MIN" color="#5BE08A" scale={1.25} />
          <TelemetryPill x={1515} y={670} t={t - 7} label="NASA DART" value="2022 IMPACT" color="#FF8A3D" />
        </g>
      ) : null}

      {kind === 'philae_38cms_1km_2h' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#14243D" opacity={0.38} />
          <SchLabel x={960} y={135} t={t - 1} text="ESA PHILAE BOUNCE ON COMET 67P" size={44} color="#7FD4FF" />
          <path d="M 180 860 Q 560 770 960 835 Q 1380 790 1740 860 L 1740 960 L 180 960 Z" fill="#2C2A3A" stroke="#7E8DA6" strokeWidth={5} />
          <DrawOn d="M 340 825 Q 960 190 1580 825" t={t - 2} dur={14} color="#FFE27A" width={9} />
          <PhilaeLanderProp x={lerp(360, 960, p)} y={lerp(790, 475, p)} s={1.15} rot={16} />
          <TelemetryPill x={460} y={320} t={t - 4} label="REBOUND SPEED" value="~38 cm/s" color="#7FD4FF" />
          <TelemetryPill x={960} y={235} t={t - 6} label="FLIGHT DISTANCE" value="~1 km" color="#FFE27A" />
          <TelemetryPill x={1460} y={320} t={t - 8} label="HANG TIME" value="~2 HOURS" color="#FF8A3D" />
        </g>
      ) : null}

      {kind === 'sun_28x_arrows' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#7A1C0E" opacity={0.48} />
          {/* Blazing solar limb at bottom of diagram */}
          <ellipse cx={960} cy={1040} rx={980} ry={250} fill="#FF8A2B" opacity={0.85} stroke="#FFE27A" strokeWidth={8} />
          <SchLabel x={960} y={145} t={t - 1} text="SOLAR SURFACE GRAVITY" size={46} color="#FFE27A" />
          {[360, 600, 840, 1080, 1320, 1560].map((ax, i) => (
            <Arrow key={i} x0={ax} y0={250} x1={ax} y1={760} t={t - i * 1.5} dur={9} color="#FF5A4A" bend={0} />
          ))}
          <TelemetryPill x={960} y={515} t={t - 4} label="SURFACE PULL" value="~28x EARTH" color="#FF5A4A" scale={1.45} />
        </g>
      ) : null}

      {kind === 'short_philae_38cms' ? (
        <g>
          <ShortBigNumber
            t={t}
            world="COMET 67P · PHILAE"
            bigValue="38 cm/s"
            subText="BOUNCED ~1 km OVER ~2 HOURS"
            color="#7FD4FF"
            y={380}
          />
          <DrawOn d="M 120 1360 L 960 1360" t={t} dur={8} color="#7E8DA6" width={6} />
          <DrawOn d="M 180 1355 Q 540 760 900 1355" t={t - 3} dur={12} color="#FFE27A" width={8} />
          <PhilaeLanderProp x={540} y={1030} s={1.35} rot={14} />
        </g>
      ) : null}
    </g>
  );
};
