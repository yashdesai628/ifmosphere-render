import type { Registry } from './render';
import { CometSet, SurfaceSet, EuclidSet, FramesSet, ZoomFrameSet, OpsSet } from './sets-a';
import { CatalogSet, MpcSet, OrbitSet, SideSet, VoidSet, SkySet } from './sets-b';

export const SETS: Registry['sets'] = {
  comet: CometSet,
  surface: SurfaceSet,
  euclid: EuclidSet,
  frames: FramesSet,
  zoomframe: ZoomFrameSet,
  ops: OpsSet,
  catalog: CatalogSet,
  mpc: MpcSet,
  orbit: OrbitSet,
  side: SideSet,
  void: VoidSet,
  sky: SkySet,
};
