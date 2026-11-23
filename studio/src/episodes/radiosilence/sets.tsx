import type { Registry } from './render';
import { MarsfieldSet, MccSet, HeartbeatSet, RelaySet, OrbiterSet } from './sets-a';
import { WheelsSet, FuelSet, TimelineSet, LandersSet, VoidSet } from './sets-b';

export const SETS: Registry['sets'] = {
  marsfield: MarsfieldSet,
  mcc: MccSet,
  heartbeat: HeartbeatSet,
  relay: RelaySet,
  wheels: WheelsSet,
  fuel: FuelSet,
  orbiter: OrbiterSet,
  timeline: TimelineSet,
  landers: LandersSet,
  void: VoidSet,
};
