import type { Registry } from './render';
import {
  CounterProp,
  ClockProp,
  BarProp,
  ArrowProp,
  FlagProp,
  CalendarProp,
  MagnifierProp,
  RingProp,
} from './props-a';
import {
  ScaleProp,
  ProbeOldProp,
  ThermoProp,
  RoverProp,
  RadioProp,
  HeartProp,
  DishProp,
  WheelProp,
} from './props-b';

export const PROPS: Registry['props'] = {
  counter: CounterProp,
  clock: ClockProp,
  bar: BarProp,
  arrow: ArrowProp,
  flag: FlagProp,
  calendar: CalendarProp,
  magnifier: MagnifierProp,
  ring: RingProp,
  scale: ScaleProp,
  _probe_old: ProbeOldProp,
  thermo: ThermoProp,
  rover: RoverProp,
  radio: RadioProp,
  heart: HeartProp,
  dish: DishProp,
  wheel: WheelProp,
};
