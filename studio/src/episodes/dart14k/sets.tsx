import type { Registry } from './render';
import { BinarySet, CruiseSet, ImpactSet, LaunchSet, OrbitDiagSet } from './sets-a';
import { EarthViewSet, HeraSet, OpsSet, VoidSet } from './sets-b';

export const SETS: Registry['sets'] = {
  launch: LaunchSet,
  cruise: CruiseSet,
  binary: BinarySet,
  impact: ImpactSet,
  orbitdiag: OrbitDiagSet,
  hera: HeraSet,
  ops: OpsSet,
  earthview: EarthViewSet,
  void: VoidSet,
};
