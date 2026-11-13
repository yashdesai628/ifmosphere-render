// THE ONE PIP: LOCKED (read-only on the VM; sha256 in src/brand/manifest.json, checked by check_style.py).
// Pip is the engine rig (engine/rig.tsx Hero) in the pipHood costume, exactly as drawn in Film 2 "Jump".
// Episodes animate Pip only through this API: a pose (numbers), an expression, a rim light, a shadow, and overlay
// props drawn on top via <PipLocal>. Nothing here lets an episode change Pip's body, face, line or colours.

import React from 'react';
import { Hero, Actor, LOOKS, Pose, Expr, HandKind, basePose, poseAt, faceAt, walkPose, joints, toWorld, reachAngle, feetBelowHips, LEG_LEN, HEAD, CastName } from '../engine/rig';
import { PIP_LOOK, RimId } from './style';

export type { Pose, Expr, HandKind };
export { basePose, poseAt, faceAt, walkPose, joints, toWorld, reachAngle, feetBelowHips, LEG_LEN, HEAD };

/** Every expression Pip has. Use these names only. */
export const PIP_EXPRESSIONS: readonly Expr[] = ['neutral', 'happy', 'smug', 'shock', 'worried', 'oops', 'cool', 'dizzy', 'tired'];

/** Named body poses (limb angles only). Combine with x/y/scale/facing/expr; override any number freely. */
export const PIP_POSES = {
  stand: {},
  front: { yaw: 0 },
  threeQuarter: { yaw: 0.45, look: 0.4 },
  threeQuarterL: { yaw: -0.45, look: -0.4 },
  side: { yaw: 1, facing: 1 as const },
  sideL: { yaw: -1, facing: -1 as const },
  wave: { armR: { a: 150, b: -12 }, armL: { a: 16, b: -10 } },
  point: { armR: { a: 95, b: -5 }, armL: { a: 10, b: -8 }, handR: 'point' as HandKind, look: 1, yaw: 0.35 },
  pointUp: { armR: { a: 168, b: 0 }, handR: 'point' as HandKind, armL: { a: 14, b: -12 } },
  cheer: { armL: { a: 135, b: 20 }, armR: { a: 135, b: 20 }, squash: -0.05 },
  shrug: { armL: { a: 40, b: 80 }, armR: { a: 40, b: 80 }, headTilt: -10 },
  think: { armR: { a: 120, b: 110 }, armL: { a: -10, b: -70 }, headTilt: 8, yaw: 0.2 },
  crouch: { squash: 0.22, armL: { a: 40, b: -30 }, armR: { a: 40, b: -30 }, legL: { a: 30, b: -60 }, legR: { a: -30, b: -60 } },
  jump: { squash: -0.08, armL: { a: -140, b: -15 }, armR: { a: -150, b: -15 }, legL: { a: 28, b: -35 } },
  float: { armL: { a: 70, b: -20 }, armR: { a: 70, b: -20 }, legL: { a: 12, b: -20 }, legR: { a: -12, b: -20 } },
  hold: { armL: { a: 22, b: -118 }, armR: { a: 22, b: -118 } },
};
export type PipPoseName = keyof typeof PIP_POSES;

/** Build a full pose: a named preset, then your numbers on top. */
export const pipPose = (preset: PipPoseName = 'stand', o: Partial<Pose> = {}): Pose => ({ ...basePose, ...PIP_POSES[preset], ...o });

/** A pose standing on a floor line: feet on groundY. */
export const pipOnGround = (x: number, groundY: number, scale = 0.9, preset: PipPoseName = 'stand', o: Partial<Pose> = {}): Pose =>
  pipPose(preset, { x, y: groundY - feetBelowHips(scale), scale, ...o });

/** Pip. Props: pose (from pipPose/poseAt/walkPose), rim light id, shadow strength. No look, no colours. */
export const Pip: React.FC<{ pose: Pose; rim?: RimId; shadow?: number }> = ({ pose, rim = 'rimR', shadow = 0.9 }) => (
  <Hero pose={pose} look={PIP_LOOK} rimId={rim} shadow={shadow} />
);

/**
 * Overlay props in Pip's own space (hips at 0,0, y down, head centre at HEAD), drawn ON TOP of Pip: a helmet ring,
 * a backpack, a hat, a held object. The only way to give Pip a costume. Keep overlays partly transparent or small so
 * Pip's head, face, hoodie and shoes stay visible; never cover the face.
 */
export const PipLocal: React.FC<{ pose: Pose; children: React.ReactNode }> = ({ pose, children }) => (
  <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90) translate(0 ${LEG_LEN}) scale(${1 + 0.6 * pose.squash} ${1 - pose.squash}) translate(0 ${-LEG_LEN}) rotate(${pose.tilt})`}>
    {children}
  </g>
);

/** The supporting cast, each in their own fixed costume from the engine. Pip is never one of these. */
export type CastMemberName = Exclude<CastName, 'pip' | 'pipHood' | 'pipInk'>;
export const CastMember: React.FC<{ name: CastMemberName; pose: Pose; rim?: RimId; shadow?: number }> = ({ name, pose, rim = 'rimR', shadow = 0.9 }) => (
  <Actor pose={pose} look={LOOKS[name]} rimId={rim} shadow={shadow} />
);
