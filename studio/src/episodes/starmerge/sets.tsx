import type { Registry } from './render';
import { BigStarSet, BinarySet, InsideSet, ScaleSet, AndromedaSet, CurveSet, ScopeSet } from './sets-a';
import { LabSet, TimelineSet, BowlSet, BlastSet, CoreSet, VoidSet, RomanSet } from './sets-b';

export const SETS: Registry['sets'] = {
  bigstar: BigStarSet,
  binary: BinarySet,
  inside: InsideSet,
  scale: ScaleSet,
  andromeda: AndromedaSet,
  curve: CurveSet,
  scope: ScopeSet,
  lab: LabSet,
  timeline: TimelineSet,
  bowl: BowlSet,
  blast: BlastSet,
  core: CoreSet,
  void: VoidSet,
  roman: RomanSet,
};
