import type { Registry } from './render';
import { QuasarSet, BeamSet, DawnSet, TimelineSet, EuclidSet } from './sets-a';
import { FieldSet, SpectrumSet, EarthNightSet, GrowthSet, FortSet, VoidSet } from './sets-b';

export const SETS: Registry['sets'] = {
  quasar: QuasarSet,
  beam: BeamSet,
  dawn: DawnSet,
  timeline: TimelineSet,
  euclid: EuclidSet,
  field: FieldSet,
  spectrum: SpectrumSet,
  earthnight: EarthNightSet,
  growth: GrowthSet,
  fort: FortSet,
  void: VoidSet,
};
