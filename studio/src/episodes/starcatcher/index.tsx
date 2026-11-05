import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import { shots } from './shots';
import raw from './timeline.json';

const catchLook: LookDef = {
  grade: (lv) => `contrast(${1 + 0.14 * lv}) saturate(${1 + 0.25 * lv}) brightness(${1 + 0.08 * lv})`,
  Overlay: ({ f, p }) => (
    <g>
      {/* Golden-cyan starlight border glow during a catch */}
      <rect
        x={14}
        y={14}
        width={1892}
        height={1052}
        rx={24}
        fill="none"
        stroke="#FFE27A"
        strokeWidth={6}
        opacity={0.45 * Math.sin(p * Math.PI)}
      />
      <HudChip x={96} y={112} f={f} label="STAR CATCH" icon="pause" />
    </g>
  ),
};

export const starcatcher = defineEpisode('Starcatcher', {
  width: 1920,
  height: 1080,
  timeline: raw as Timeline,
  shots,
  looks: { catch: catchLook },
});
