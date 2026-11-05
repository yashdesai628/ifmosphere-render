import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 } from './shots';

// The power's look ("catch"): time slows as a streak of starlight freezes in your palm, with a warm golden-cyan
// border inside the vertical safe area, a CATCH chip at top-left, and a starlight dial at top-right.
const catchLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.18 * lv}) contrast(${1 + 0.08 * lv}) brightness(${1 + 0.06 * lv})`,
  Overlay: ({ f, p }) => (
    <g>
      <rect
        x={28}
        y={215}
        width={1024}
        height={1310}
        rx={32}
        fill="none"
        stroke="#FFE27A"
        strokeWidth={4}
        opacity={0.45}
      />
      <HudChip x={96} y={295} f={f} label="CATCH" icon="pause" />
      <Dial x={925} y={305} r={76} p={0.2 + 0.8 * p} readout="0.0s" size={32} />
    </g>
  ),
};

export const meteor = defineEpisode('Meteor', {
  width: 1080,
  height: 1920,
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 },
  looks: { catch: catchLook },
});
