import { Registry } from './render';
import { ShipSet, CutawaySet, OrbitSet, RouteSet, MarsSet, VoidSet } from './sets-a';
import { ControlSet, CoreSet, PadSet, SkySet, GroundSet, MoonbaseSet, RailSet } from './sets-b';

export const SETS: Registry['sets'] = {
  ship: ShipSet,
  cutaway: CutawaySet,
  control: ControlSet,
  core: CoreSet,
  pad: PadSet,
  orbit: OrbitSet,
  route: RouteSet,
  mars: MarsSet,
  sky: SkySet,
  ground: GroundSet,
  moonbase: MoonbaseSet,
  rail: RailSet,
  void: VoidSet,
};
