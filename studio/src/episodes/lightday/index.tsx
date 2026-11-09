import { defineEpisode, Timeline } from '../../engine';
import filmTimeline from './timeline.json';
import shortTimeline from './short-timeline.json';
import { FILM_SHOTS } from './shots';
import { SHORT_SHOTS } from './short-shots';

export const lightday = defineEpisode('Lightday', {
  timeline: filmTimeline as Timeline,
  shots: FILM_SHOTS,
  width: 1920,
  height: 1080,
  bg: '#080614',
});

export const lightdayShort = defineEpisode('LightdayShort', {
  timeline: shortTimeline as Timeline,
  shots: SHORT_SHOTS,
  width: 1080,
  height: 1920,
  bg: '#080614',
});
