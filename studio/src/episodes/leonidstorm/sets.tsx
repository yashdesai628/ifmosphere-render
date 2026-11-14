import type { Registry } from './render';
import { HillSet, SummitSet, Town1833Set, GardenSet } from './sets-a';
import { SpaceSet, AtmosSet, CitySet, VoidSet } from './sets-b';

export const SETS: Registry['sets'] = {
  hill: HillSet,
  summit: SummitSet,
  town1833: Town1833Set,
  space: SpaceSet,
  atmos: AtmosSet,
  city: CitySet,
  garden: GardenSet,
  void: VoidSet,
};
