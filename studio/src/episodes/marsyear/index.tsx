import { defineEpisode, Timeline } from '../../engine';
import { Spec } from './lib';
import { makeShots } from './scene';
import filmTimeline from './timeline.json';
import shortTimeline from './short-timeline.json';
import filmSpecs from './specs.json';
import shortSpecs from './short-specs.json';

export const marsyear = defineEpisode('Marsyear', {
  timeline: filmTimeline as unknown as Timeline,
  shots: makeShots(filmSpecs as unknown as Record<string, Spec>, 1920, 1080),
  width: 1920,
  height: 1080,
  bg: '#1A0C08',
});

export const marsyearShort = defineEpisode('MarsyearShort', {
  timeline: shortTimeline as unknown as Timeline,
  shots: makeShots(shortSpecs as unknown as Record<string, Spec>, 1080, 1920),
  width: 1080,
  height: 1920,
  bg: '#1A0C08',
});
