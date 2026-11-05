import React from 'react';
import { rnd } from '../anim';
import { DuskSky, Sun } from '../kit';
import { S3 } from '../room';
import { Glow, Cone, LightVeil, Dust } from '../light';
import { FONT } from '../fonts';

// The stadium at dusk: floodlight towers with bright lamp banks, tiered stands under a canopy roof, lit entrance
// tunnels, advertising boards (geometric, no brands), and either a football pitch with a goal (`mode="pitch"`) or an
// athletics sprint track with lanes, starting blocks and start-sensor beacons (`mode="track"`).

export const SoccerBall: React.FC<{ x: number; y: number; r?: number; rot?: number; shadow?: number }> = ({
  x,
  y,
  r = 34,
  rot = 0,
  shadow = 0.35,
}) => (
  <g transform={`translate(${x} ${y})`}>
    {shadow > 0 ? <ellipse cx={4} cy={r + 4} rx={r * 0.9} ry={r * 0.25} fill="#000" opacity={shadow} /> : null}
    <g transform={`rotate(${rot})`}>
      <circle cx={0} cy={0} r={r} fill="#F4EFE6" stroke="#181520" strokeWidth={Math.max(2.5, r * 0.08)} />
      {/* Shading on lower-right */}
      <path
        d={`M ${-r * 0.6} ${r * 0.75} A ${r} ${r} 0 0 0 ${r * 0.85} ${-r * 0.45} A ${r * 0.95} ${r * 0.95} 0 0 1 ${-r * 0.6} ${r * 0.75} Z`}
        fill="#CFC6B8"
      />
      {/* Pentagon patches and seam lines */}
      <polygon
        points={`0,${-r * 0.32} ${r * 0.3},${-r * 0.1} ${r * 0.19},${r * 0.26} ${-r * 0.19},${r * 0.26} ${-r * 0.3},${-r * 0.1}`}
        fill="#1E1B26"
      />
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <g key={i} transform={`rotate(${deg})`}>
          <path d={`M 0 ${-r * 0.3} L 0 ${-r * 0.72}`} stroke="#1E1B26" strokeWidth={Math.max(2, r * 0.055)} />
          <polygon
            points={`0,${-r * 0.7} ${r * 0.22},${-r * 0.86} ${r * 0.14},${-r * 0.98} ${-r * 0.14},${-r * 0.98} ${-r * 0.22},${-r * 0.86}`}
            fill="#1E1B26"
          />
        </g>
      ))}
      {/* Warm rim highlight on top-left */}
      <path
        d={`M ${-r * 0.72} ${-r * 0.45} A ${r * 0.88} ${r * 0.88} 0 0 1 ${r * 0.25} ${-r * 0.82}`}
        stroke="#FFF6E0"
        strokeWidth={Math.max(2, r * 0.07)}
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />
    </g>
  </g>
);

const FloodlightTower: React.FC<{ x: number; y: number; s?: number; flip?: 1 | -1; red?: number }> = ({
  x,
  y,
  s = 1,
  flip = 1,
  red = 0,
}) => {
  const headX = x + flip * 28 * s;
  const headY = y - 340 * s;
  return (
    <g>
      {/* Lattice pylon */}
      <path
        d={`M ${x - 18 * s} ${y} L ${headX - 8 * s} ${headY + 30 * s} M ${x + 18 * s} ${y} L ${headX + 8 * s} ${headY + 30 * s}`}
        stroke="#1C1826"
        strokeWidth={6 * s}
      />
      {[0.2, 0.4, 0.6, 0.8].map((k, i) => {
        const py = y - 310 * s * k;
        const px = x + flip * 28 * s * k;
        const w = (18 - 10 * k) * s;
        return (
          <path
            key={i}
            d={`M ${px - w} ${py} L ${px + w} ${py} L ${px - w * 0.8} ${py - 45 * s}`}
            stroke="#1C1826"
            strokeWidth={3.5 * s}
            fill="none"
          />
        );
      })}
      {/* Lamp bank frame */}
      <g transform={`translate(${headX} ${headY}) rotate(${flip * 14}) scale(${s})`}>
        <rect x={-72} y={-44} width={144} height={74} rx={8} fill="#14111C" stroke="#2D2638" strokeWidth={4} />
        {[-46, 0, 46].map((lx, c) =>
          [-18, 12].map((ly, r) => (
            <circle key={`${c}-${r}`} cx={lx} cy={ly} r={12} fill={red > 0.5 ? '#FF6A5A' : '#FFF4DC'} />
          )),
        )}
      </g>
      <Cone
        d={`M ${headX - 55 * s} ${headY + 10 * s} L ${headX + 55 * s} ${headY + 10 * s} L ${headX + flip * 520 * s} ${y + 220 * s} L ${headX - flip * 240 * s} ${y + 220 * s} Z`}
        o={0.28 * (1 - red * 0.4)}
      />
      <Glow x={headX} y={headY} r={260 * s} kind={red > 0.5 ? 'red' : 'warm'} o={0.75} />
    </g>
  );
};

export const StadiumGoal: React.FC<{ x?: number; y?: number; w?: number; h?: number }> = ({
  x = 960,
  y = 660,
  w = 780,
  h = 270,
}) => {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const y0 = y - h;
  const d = 95;
  const bx0 = x0 + 48;
  const bx1 = x1 - 48;
  const by0 = y0 + 28;
  const by1 = y - 28;
  return (
    <g>
      {/* Contact shadow under goal frame */}
      <ellipse cx={x} cy={y + 6} rx={w * 0.54} ry={14} fill="#000" opacity={0.38} />
      {/* Back ground frame & side stanchions */}
      <path
        d={`M ${x0} ${y} L ${bx0} ${by1} L ${bx1} ${by1} L ${x1} ${y} M ${x0} ${y0} L ${bx0} ${by0} L ${bx0} ${by1} M ${x1} ${y0} L ${bx1} ${by0} L ${bx1} ${by1} M ${bx0} ${by0} L ${bx1} ${by0}`}
        stroke="#8C96A6"
        strokeWidth={6}
        fill="none"
        strokeLinejoin="round"
      />
      {/* Net mesh */}
      <g stroke="#CBD4E0" strokeWidth={1.8} opacity={0.34}>
        {Array.from({ length: 24 }).map((_, i) => {
          const k = i / 23;
          const fx = x0 + w * k;
          const bx = bx0 + (bx1 - bx0) * k;
          return <path key={`nv${i}`} d={`M ${fx} ${y0} L ${bx} ${by0} L ${bx} ${by1}`} fill="none" />;
        })}
        {Array.from({ length: 10 }).map((_, i) => {
          const k = (i + 1) / 10;
          const ly = by0 + (by1 - by0) * k;
          const fy = y0 + h * k;
          return (
            <path
              key={`nh${i}`}
              d={`M ${x0} ${fy} L ${bx0} ${ly} L ${bx1} ${ly} L ${x1} ${fy}`}
              fill="none"
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const k = (i + 1) / 9;
          return (
            <path
              key={`ns${i}`}
              d={`M ${x0 + (bx0 - x0) * k} ${y0 + (by0 - y0) * k} L ${x0 + (bx0 - x0) * k} ${y + (by1 - y) * k} M ${x1 + (bx1 - x1) * k} ${y0 + (by0 - y0) * k} L ${x1 + (bx1 - x1) * k} ${y + (by1 - y) * k}`}
              fill="none"
            />
          );
        })}
      </g>
      {/* Front posts and crossbar */}
      <path
        d={`M ${x0} ${y} L ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y}`}
        stroke="#181520"
        strokeWidth={22}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${x0} ${y} L ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y}`}
        stroke="#F4F1EA"
        strokeWidth={15}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={`M ${x0 - 4} ${y0 - 4} L ${x1 + 4} ${y0 - 4}`} stroke={S3.warm} strokeWidth={3} opacity={0.7} />
      {/* Post base shadows */}
      <ellipse cx={x0} cy={y + 4} rx={18} ry={6} fill="#000" opacity={0.45} />
      <ellipse cx={x1} cy={y + 4} rx={18} ry={6} fill="#000" opacity={0.45} />
      {/* Keeper's water bottle & towel by left post */}
      <g transform={`translate(${x0 - 52} ${y - 6})`}>
        <ellipse cx={0} cy={4} rx={22} ry={6} fill="#000" opacity={0.35} />
        <path d="M -28 2 L 6 -4 L 18 4 L -16 8 Z" fill="#3E5A8A" />
        <rect x={14} y={-28} width={16} height={32} rx={4} fill="#5BE08A" stroke="#181520" strokeWidth={2.5} />
        <rect x={17} y={-34} width={10} height={6} rx={2} fill="#F4EFE6" />
      </g>
    </g>
  );
};

export const StartingBlocks: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={-28} cy={8} rx={72} ry={10} fill="#000" opacity={0.4} />
    {/* Central rail */}
    <rect x={-96} y={-4} width={116} height={10} rx={3} fill="#8C96A6" stroke="#181520" strokeWidth={3} />
    {/* Sensor box at back of rail */}
    <rect x={-106} y={-18} width={28} height={22} rx={4} fill="#252834" stroke="#181520" strokeWidth={3} />
    <circle cx={-92} cy={-7} r={4} fill="#FF5A4A" />
    {/* Two angled foot pedals */}
    {[-62, -18].map((px, i) => (
      <g key={i} transform={`translate(${px} 0)`}>
        <polygon points="-18,4 8,4 16,-36 -4,-36" fill="#2B2F3A" stroke="#181520" strokeWidth={3} strokeLinejoin="round" />
        <polygon points="-4,-36 16,-36 10,2 -8,2" fill="#D9534F" />
      </g>
    ))}
  </g>
);

export const TrackBeacon: React.FC<{ x: number; y: number; s?: number; red?: boolean; t?: number }> = ({
  x,
  y,
  s = 1,
  red = false,
  t = 0,
}) => {
  const pulse = red ? 0.65 + 0.35 * Math.sin(t * 0.9) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={38} ry={9} fill="#000" opacity={0.4} />
      <polygon points="-28,0 28,0 20,-74 -20,-74" fill="#252834" stroke="#14121C" strokeWidth={3.5} />
      <rect x={-24} y={-24} width={48} height={10} fill="#D9534F" />
      <circle cx={0} cy={-50} r={12} fill="#14121C" />
      {/* Top beacon dome */}
      <path d="M -16 -74 Q -16 -104 0 -104 Q 16 -104 16 -74 Z" fill={red ? '#FF3A3A' : '#4A2428'} stroke="#14121C" strokeWidth={3} />
      {red ? <Glow x={0} y={-88} r={140} kind="red" o={0.85 * pulse} /> : null}
    </g>
  );
};

export const Stadium: React.FC<{
  t: number;
  id?: string;
  mode?: 'pitch' | 'track';
  goal?: boolean;
  veil?: number;
  red?: number;
  low?: number;
}> = ({ t, id = 'stad', mode = 'pitch', goal = true, veil = 0.36, red = 0, low = 0 }) => {
  const hz = 590 + low;
  return (
    <g>
      <DuskSky id={`${id}sky`} horizonY={hz} red={red} />
      <Sun x={960} y={hz - 30} r={150} t={t} red={red} />
      {/* Dusk clouds */}
      <g filter="url(#blur6)" opacity={0.75 * (1 - red * 0.5)}>
        {[
          [320, 210, 320, 22],
          [1480, 190, 360, 26],
          [880, 270, 260, 18],
        ].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx + ((t * 0.15) % 40)} cy={cy} rx={rx} ry={ry} fill="#6A3E6E" opacity={0.65} />
        ))}
      </g>

      <g transform={`translate(0 ${low})`}>
        {/* Four stadium floodlight towers */}
        <FloodlightTower x={210} y={540} s={0.95} flip={1} red={red} />
        <FloodlightTower x={620} y={520} s={0.82} flip={1} red={red} />
        <FloodlightTower x={1300} y={520} s={0.82} flip={-1} red={red} />
        <FloodlightTower x={1710} y={540} s={0.95} flip={-1} red={red} />

        {/* Stadium bowl and canopy roof */}
        <path d="M -300 410 Q 960 365 2220 410 L 2220 620 L -300 620 Z" fill="#1C1628" />
        <path d="M -300 392 Q 960 345 2220 392 L 2180 426 Q 960 382 -260 426 Z" fill="#2A2238" stroke="#120E1A" strokeWidth={4} />
        <path d="M -260 426 Q 960 382 2180 426" stroke={S3.warm} strokeWidth={2.5} opacity={0.5} fill="none" />

        {/* Tiered seating rows */}
        {Array.from({ length: 7 }).map((_, r) => {
          const ry = 440 + r * 22;
          return <path key={`tier${r}`} d={`M -260 ${ry} L 2180 ${ry}`} stroke="#282036" strokeWidth={8} />;
        })}
        {/* Crowd silhouettes and warm stadium lights in the stands */}
        {Array.from({ length: 48 }).map((_, i) => {
          const cx = -120 + i * 45 + (i % 3) * 5;
          const cy = 445 + ((i * 7) % 6) * 20;
          const isLight = i % 9 === 0;
          return isLight ? (
            <circle key={`cl${i}`} cx={cx} cy={cy} r={4} fill="#FFD7A0" opacity={0.75} />
          ) : (
            <circle key={`cr${i}`} cx={cx} cy={cy} r={8 + (i % 3) * 2} fill="#120E1A" opacity={0.8} />
          );
        })}

        {/* Lit entrance tunnels (vomitories) */}
        {[280, 740, 1180, 1640].map((vx, i) => (
          <g key={`vom${i}`}>
            <rect x={vx - 34} y={515} width={68} height={66} rx={6} fill="#120E1A" />
            <rect x={vx - 26} y={523} width={52} height={58} rx={4} fill="#FF9A4A" opacity={0.55} />
            <Glow x={vx} y={550} r={85} o={0.35} />
          </g>
        ))}

        {/* Perimeter advertising boards (clean geometric bands, no brands) */}
        <rect x={-300} y={580} width={2520} height={38} fill="#231D30" stroke="#120E1A" strokeWidth={3} />
        {Array.from({ length: 14 }).map((_, i) => {
          const bx = -240 + i * 175;
          const col = ['#3A506B', '#C85A32', '#2B7A68', '#8A5A44'][i % 4];
          return (
            <g key={`ad${i}`}>
              <rect x={bx} y={586} width={155} height={26} rx={4} fill={col} opacity={0.75} />
              <rect x={bx + 18} y={595} width={80} height={8} rx={4} fill="#F4EFE6" opacity={0.55} />
              <circle cx={bx + 126} cy={599} r={7} fill="#F4EFE6" opacity={0.65} />
            </g>
          );
        })}
        <path d="M -300 580 L 2220 580" stroke={S3.warm} strokeWidth={2} opacity={0.45} />

        {mode === 'pitch' ? (
          <g>
            {/* Pitch turf with mown stripes */}
            <rect x={-400} y={618} width={2720} height={700} fill="#1E3B2B" />
            {Array.from({ length: 12 }).map((_, i) => {
              const x0 = -300 + i * 210;
              const x1 = x0 + 105;
              const bx0 = 960 + (x0 - 960) * 2.2;
              const bx1 = 960 + (x1 - 960) * 2.2;
              return (
                <polygon
                  key={`mow${i}`}
                  points={`${x0},618 ${x1},618 ${bx1},1300 ${bx0},1300`}
                  fill="#244633"
                  opacity={0.75}
                />
              );
            })}
            {/* Pitch lines: goal line, 6-yard box, penalty box, penalty spot */}
            <g stroke="#E6EFEA" strokeWidth={5} opacity={0.65} fill="none">
              <path d="M -300 660 L 2220 660" />
              <path d="M 480 660 L 340 770 L 1580 770 L 1440 660" />
              <path d="M 160 660 L -140 940 L 2060 940 L 1760 660" />
            </g>
            <ellipse cx={960} cy={835} rx={14} ry={5} fill="#E6EFEA" opacity={0.8} />
            {/* Corner flag on the left */}
            <g transform="translate(80 660)">
              <path d="M 0 0 L 0 -68" stroke="#F4EFE6" strokeWidth={4} />
              <path d="M 0 -68 L 28 -56 L 0 -44 Z" fill="#FF8A3D" />
            </g>
            {/* Training cones on the right */}
            {[1690, 1745, 1800].map((cx, i) => (
              <polygon
                key={`cn${i}`}
                points={`${cx - 14},${688 + i * 14} ${cx + 14},${688 + i * 14} ${cx},${666 + i * 14}`}
                fill="#FF8A3D"
                stroke="#181520"
                strokeWidth={2}
              />
            ))}
            {goal ? <StadiumGoal x={960} y={660} w={780} h={270} /> : null}
          </g>
        ) : (
          <g>
            {/* Infield turf behind the track */}
            <rect x={-400} y={618} width={2720} height={75} fill="#1E3B2B" />
            {/* Stacked hurdles on the infield */}
            {[360, 1520].map((hx, i) => (
              <g key={`hd${i}`} transform={`translate(${hx} 668)`}>
                <rect x={-36} y={-38} width={72} height={8} fill="#F4EFE6" stroke="#181520" strokeWidth={2} />
                <path d="M -30 -30 L -30 0 L -16 0 M 30 -30 L 30 0 L 44 0" stroke="#252834" strokeWidth={4} fill="none" />
              </g>
            ))}
            {/* Running track surface (terracotta) */}
            <rect x={-400} y={688} width={2720} height={620} fill="#7A342E" />
            {[0, 1, 2, 3, 4, 5].map((lane) => {
              const ly0 = 688 + lane * 68;
              const ly1 = ly0 + 68;
              return (
                <g key={`ln${lane}`}>
                  {lane % 2 === 1 ? <rect x={-400} y={ly0} width={2720} height={68} fill="#6B2B26" /> : null}
                  <path d={`M -400 ${ly0} L 2320 ${ly0}`} stroke="#F4EFE6" strokeWidth={4} opacity={0.8} />
                  {/* Start line across the lane */}
                  <path
                    d={`M ${640 - lane * 48} ${ly0} L ${640 - (lane + 1) * 48} ${ly1}`}
                    stroke="#F4EFE6"
                    strokeWidth={7}
                    opacity={0.9}
                  />
                  <text
                    x={685 - lane * 48}
                    y={ly0 + 46}
                    fontFamily={FONT.ui}
                    fontSize={34}
                    fill="#F4EFE6"
                    opacity={0.75}
                  >
                    {lane + 1}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </g>

      <LightVeil
        id={`${id}veil`}
        lights={[
          [260, 260 + low, 520],
          [640, 260 + low, 480],
          [1280, 260 + low, 480],
          [1660, 260 + low, 520],
          [960, 740 + low, 680],
        ]}
        o={veil}
      />
      <Glow x={960} y={560 + low} r={540} kind={red > 0.5 ? 'red' : 'warm'} o={0.28} />
      <Dust t={t} seed={49} x0={220} y0={260 + low} w={1480} h={560} n={42} o={0.55} />
      {red > 0 ? (
        <rect
          x={-1500}
          y={-1500}
          width={5000}
          height={4500}
          fill="#3A0010"
          opacity={0.35 * red}
          style={{ mixBlendMode: 'multiply' }}
        />
      ) : null}
    </g>
  );
};
