import type { Registry } from './render';
import { TowerSet, HoverSet, AscentSet, BoosterSet, OpsSet } from './sets-a';
import { OrbitSet, DeploySet, LoopSet, ReentrySet, VoidSet } from './sets-b';

export const SETS: Registry['sets'] = {
  tower: TowerSet,
  hover: HoverSet,
  ascent: AscentSet,
  booster: BoosterSet,
  ops: OpsSet,
  orbit: OrbitSet,
  deploy: DeploySet,
  loop: LoopSet,
  reentry: ReentrySet,
  void: VoidSet,
};
