import type { Registry } from './render';
import { FovSet, GridSet, MoonskySet, MirrorSet } from './sets-a';
import { SkyspeckSet, MosaicSet, L2Set, PixelwallSet, StreamSet } from './sets-b';
import { OpticsSet, ZoomwideSet, LabSet, ScopeSet, DarkwebSet, PlanetSet, VoidSet } from './sets-c';

export const SETS: Registry['sets'] = {
  fov: FovSet,
  grid: GridSet,
  moonsky: MoonskySet,
  mirror: MirrorSet,
  optics: OpticsSet,
  skyspeck: SkyspeckSet,
  mosaic: MosaicSet,
  l2: L2Set,
  pixelwall: PixelwallSet,
  stream: StreamSet,
  zoomwide: ZoomwideSet,
  lab: LabSet,
  scope: ScopeSet,
  darkweb: DarkwebSet,
  planet: PlanetSet,
  void: VoidSet,
};
