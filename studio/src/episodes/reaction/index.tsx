import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19 } from './shots';

// The power's look ("snap"): time slows, the world desaturates and cools, a SNAP chip blinks in the top-left,
// and a stopwatch in the top-right reads 0.025 s.
const snapLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.52 * lv}) contrast(${1 + 0.1 * lv}) hue-rotate(${-14 * lv}deg) brightness(${1 + 0.04 * lv})`,
  Overlay: ({ f, p }) => (
    <g>
      <rect
        x={18}
        y={18}
        width={1884}
        height={1044}
        rx={28}
        fill="none"
        stroke="#7FD4FF"
        strokeWidth={4}
        opacity={0.35}
      />
      <HudChip f={f} label="SNAP" icon="pause" />
      <Dial p={0.15 + 0.85 * p} readout="0.025s" size={34} />
    </g>
  ),
};

export const reaction = defineEpisode('Reaction', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19 },
  looks: { snap: snapLook },
});
