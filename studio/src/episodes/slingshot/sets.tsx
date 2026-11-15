import type { Registry } from './render';
import { PadSet, OpsSet, VoidSet, FlybySet } from './sets-a';
import { SunsideSet, LoiterSet, CruiseSet, MarsSet } from './sets-b';

export const SETS: Registry['sets'] = {
  pad: PadSet,
  sunside: SunsideSet,
  loiter: LoiterSet,
  flyby: FlybySet,
  ops: OpsSet,
  mars: MarsSet,
  cruise: CruiseSet,
  void: VoidSet,
};
