import type { Registry } from './render';
import { StarSet, BlastSet, RemnantSet, WebbViewSet } from './sets-a';
import { ClumpsSet, ClockSet, CycleSet, TimelineSet, VoidSet } from './sets-b';

export const SETS: Registry['sets'] = {
  star: StarSet,
  blast: BlastSet,
  remnant: RemnantSet,
  webbview: WebbViewSet,
  clumps: ClumpsSet,
  clock: ClockSet,
  cycle: CycleSet,
  timeline: TimelineSet,
  void: VoidSet,
};
