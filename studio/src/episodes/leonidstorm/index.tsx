// Episode entry (template; Hark copies it to src/episodes/<slug>/index.tsx and replaces Leonidstorm/leonidstorm/__BG__).
import { defineEpisode, Timeline } from '../../engine';
import { makeShots, Registry, SegSpec } from './render';
import { SETS } from './sets';
import { PROPS } from './props';
import { ACTIONS, CUSTOM } from './custom';
import spec from './shots.json';
import filmTimeline from './timeline.json';
import shortTimeline from './short-timeline.json';

const REG: Registry = { sets: SETS, props: PROPS, actions: ACTIONS, custom: CUSTOM };
const S = spec as unknown as { film: SegSpec[]; short: SegSpec[] };

export const leonidstorm = defineEpisode('Leonidstorm', {
  timeline: filmTimeline as unknown as Timeline,
  shots: makeShots(S.film, 1920, 1080, REG),
  width: 1920,
  height: 1080,
  bg: '#080614',
});

export const leonidstormShort = defineEpisode('LeonidstormShort', {
  timeline: shortTimeline as unknown as Timeline,
  shots: makeShots(S.short, 1080, 1920, REG),
  width: 1080,
  height: 1920,
  bg: '#080614',
});
