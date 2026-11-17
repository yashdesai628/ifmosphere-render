import React from 'react';
import type { SetProps } from './render';
import { GroundPlane, PALETTE } from '../../brand';
import { Cone, Dust, Glow, LightVeil } from '../../engine/light';
import { Foreground, Rays, Stars } from '../../engine/kit';
import { clamp, easeInOut, easeOut, lerp } from '../../engine/anim';
import { asteroidPath } from './sets-a';

const DARK_OUTLINE = '#121019';

/** 6. HERA SURVEYING DIDYMOS */
export const HeraSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const scale = Math.min(W, H) / 1080;
  const baseT = clamp(Number(sp.t ?? 0.5));
  const seqT = clamp(baseT + lerp(-0.04, 0.05, easeInOut(p)));
  const newSide = Number(sp.side ?? 0) >= 0.5;
  const scanVal = clamp(Number(sp.scan ?? 0));

  const rockX = W * (vert ? 0.65 : 0.67);
  const rockY = H * (vert ? 0.52 : 0.47);
  const rockR = (vert ? 320 : 390) * scale;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill={PALETTE.space} />
        <Stars seed={701} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={2.4 * H} t={t} n={115} o={0.82} />
        <Glow x={0.14 * W} y={0.2 * H} r={340 * scale} kind="cool" o={0.32} />
        <Rays x={0.14 * W} y={0.2 * H} t={t} len={1850} n={12} o={0.1} color="#CDE4FF" />
      </g>
    );
  }

  if (layer === 'near') {
    // Small ESA Hera spacecraft on the left foreground, drifting closer with setp.t
    const hx = W * lerp(0.08, 0.14, seqT);
    const hy = H * (vert ? 0.62 : 0.6) + Math.sin(t / 16) * 8 * scale;
    const hs = (0.72 + 0.14 * seqT) * scale;
    return (
      <g>
        <g transform={`translate(${hx} ${hy}) scale(${hs}) rotate(-8)`}>
          {/* Blue-grey solar panels */}
          <rect x={-110} y={-22} width={84} height={44} rx={4} fill="#4D6E99" stroke={DARK_OUTLINE} strokeWidth={4} />
          <rect x={26} y={-22} width={84} height={44} rx={4} fill="#4D6E99" stroke={DARK_OUTLINE} strokeWidth={4} />
          <path d="M -88 -20 L -88 20 M -62 -20 L -62 20 M 54 -20 L 54 20 M 80 -20 L 80 20" stroke="#7EA4D4" strokeWidth={2.5} opacity={0.7} />
          {/* White boxy bus */}
          <rect x={-26} y={-28} width={52} height={56} rx={6} fill="#EEF1F8" stroke={DARK_OUTLINE} strokeWidth={4} />
          <rect x={4} y={-28} width={21} height={56} rx={4} fill="#C6CEDF" />
          {/* Small cyan camera eye */}
          <circle cx={14} cy={0} r={10} fill="#1E2338" stroke={DARK_OUTLINE} strokeWidth={3.5} />
          <circle cx={14} cy={0} r={5} fill="#56C2F0" />
          <Glow x={14} y={0} r={42} kind="cool" o={0.55} />
        </g>
        <Foreground blur={6}>
          <rect x={-0.1 * W} y={ground + 60 * scale} width={1.2 * W} height={240} fill="#090B18" opacity={0.7} />
        </Foreground>
      </g>
    );
  }

  // mid: Huge Didymos asteroid filling right two thirds
  const scanPhase = ((scanVal + (p * 0.18 - 0.09)) % 1 + 1) % 1;
  const scanX = rockX - rockR * 0.85 + scanPhase * rockR * 1.65;
  const ridgeSway = Math.sin(t / 38) * 8 * scale;

  return (
    <g>
      <GroundPlane y={ground} fill="#101328" rim="#7289C4" />
      <defs>
        <clipPath id={`${id}rockClip`}>
          <path
            d={`M ${rockX - rockR * 0.08} ${rockY - rockR * 0.88} L ${rockX + rockR * 0.56} ${rockY - rockR * 0.52} L ${rockX + rockR * 0.98} ${rockY - rockR * 0.08} L ${rockX + rockR * 0.94} ${rockY + rockR * 0.18} L ${rockX + rockR * 0.52} ${rockY + rockR * 0.62} L ${rockX - rockR * 0.08} ${rockY + rockR * 0.88} L ${rockX - rockR * 0.64} ${rockY + rockR * 0.54} L ${rockX - rockR * 0.96} ${rockY + rockR * 0.1} L ${rockX - rockR * 0.9} ${rockY - rockR * 0.18} L ${rockX - rockR * 0.54} ${rockY - rockR * 0.56} Z`}
          />
        </clipPath>
      </defs>

      <g>
        {/* Main lumpy asteroid silhouette */}
        <path
          d={`M ${rockX - rockR * 0.08} ${rockY - rockR * 0.88} L ${rockX + rockR * 0.56} ${rockY - rockR * 0.52} L ${rockX + rockR * 0.98} ${rockY - rockR * 0.08} L ${rockX + rockR * 0.94} ${rockY + rockR * 0.18} L ${rockX + rockR * 0.52} ${rockY + rockR * 0.62} L ${rockX - rockR * 0.08} ${rockY + rockR * 0.88} L ${rockX - rockR * 0.64} ${rockY + rockR * 0.54} L ${rockX - rockR * 0.96} ${rockY + rockR * 0.1} L ${rockX - rockR * 0.9} ${rockY - rockR * 0.18} L ${rockX - rockR * 0.54} ${rockY - rockR * 0.56} Z`}
          fill={newSide ? '#6C7187' : '#7B8096'}
          stroke={DARK_OUTLINE}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        <g clipPath={`url(#${id}rockClip)`}>
          {/* Dark shaded right side */}
          <path
            d={`M ${rockX + rockR * 0.12} ${rockY - rockR} L ${rockX + rockR * 1.1} ${rockY - rockR} L ${rockX + rockR * 1.1} ${rockY + rockR} L ${rockX + rockR * 0.05} ${rockY + rockR} Q ${rockX + rockR * 0.35} ${rockY} ${rockX + rockR * 0.12} ${rockY - rockR} Z`}
            fill="#474B5F"
            opacity={0.78}
          />

          {/* Side 0 (DART saw): smoother regolith vs Side 1 (New side): boulders, craters, strange grooves */}
          {!newSide ? (
            <g opacity={0.55}>
              <ellipse cx={rockX - rockR * 0.35} cy={rockY - rockR * 0.32} rx={rockR * 0.14} ry={rockR * 0.09} fill="#62677D" stroke={DARK_OUTLINE} strokeWidth={3} />
              <ellipse cx={rockX + rockR * 0.2} cy={rockY + rockR * 0.36} rx={rockR * 0.18} ry={rockR * 0.1} fill="#505469" stroke={DARK_OUTLINE} strokeWidth={3} />
            </g>
          ) : (
            <g>
              {/* Strange parallel grooves & channels */}
              {[-0.36, -0.22, 0.24, 0.38, 0.52].map((gy, k) => (
                <path
                  key={k}
                  d={`M ${rockX - rockR * 0.72} ${rockY + gy * rockR} Q ${rockX - rockR * 0.1} ${rockY + (gy + 0.08) * rockR + ridgeSway * 0.4} ${rockX + rockR * 0.65} ${rockY + (gy - 0.04) * rockR}`}
                  fill="none"
                  stroke="#393D4F"
                  strokeWidth={7 * scale}
                  strokeLinecap="round"
                  opacity={0.72}
                />
              ))}
              {/* Deep impact craters & potential ejecta scars */}
              {[
                [-0.38, -0.34, 0.16],
                [0.08, -0.42, 0.13],
                [-0.25, 0.34, 0.19],
                [0.28, 0.28, 0.15],
                [-0.56, 0.22, 0.11],
              ].map(([cx0, cy0, cr], k) => (
                <g key={k}>
                  <ellipse cx={rockX + cx0 * rockR} cy={rockY + cy0 * rockR} rx={cr * rockR} ry={cr * 0.68 * rockR} fill="#44495C" stroke={DARK_OUTLINE} strokeWidth={3.5} />
                  <path
                    d={`M ${rockX + (cx0 - cr * 0.75) * rockR} ${rockY + cy0 * rockR} A ${cr * rockR} ${cr * 0.65 * rockR} 0 0 1 ${rockX + (cx0 + cr * 0.4) * rockR} ${rockY + (cy0 - cr * 0.55) * rockR}`}
                    fill="none"
                    stroke="#B4BED8"
                    strokeWidth={3}
                    opacity={0.7}
                  />
                </g>
              ))}
              {/* Clustered sharp boulders */}
              {[
                [-0.55, -0.14, 0.08],
                [-0.18, -0.16, 0.1],
                [0.14, 0.08, 0.09],
                [-0.4, 0.5, 0.07],
                [0.36, -0.22, 0.08],
                [-0.02, 0.48, 0.08],
              ].map(([bx, by, bs], k) => {
                const x = rockX + bx * rockR;
                const y = rockY + by * rockR;
                const s = bs * rockR;
                return (
                  <polygon
                    key={k}
                    points={`${x - s},${y + s * 0.6} ${x - s * 0.3},${y - s * 0.8} ${x + s * 0.7},${y - s * 0.3} ${x + s},${y + s * 0.6}`}
                    fill="#959CB3"
                    stroke={DARK_OUTLINE}
                    strokeWidth={3.5}
                  />
                );
              })}
            </g>
          )}

          {/* Shared equatorial ridge across both sides */}
          <path
            d={`M ${rockX - rockR * 0.94} ${rockY - rockR * 0.04} Q ${rockX} ${rockY + rockR * 0.15 + ridgeSway} ${rockX + rockR * 0.94} ${rockY + rockR * 0.02}`}
            fill="none"
            stroke="#C7D0E8"
            strokeWidth={11 * scale}
            strokeLinecap="round"
            opacity={0.68}
          />
          <path
            d={`M ${rockX - rockR * 0.94} ${rockY + rockR * 0.02} Q ${rockX} ${rockY + rockR * 0.21 + ridgeSway} ${rockX + rockR * 0.94} ${rockY + rockR * 0.08}`}
            fill="none"
            stroke={DARK_OUTLINE}
            strokeWidth={4}
            opacity={0.7}
          />

          {/* Cyan scan beam sweeping across asteroid */}
          {scanVal > 0.02 ? (
            <g>
              <rect x={scanX - 28 * scale} y={rockY - rockR} width={56 * scale} height={rockR * 2} fill="#4DE8FF" opacity={0.16} />
              <line x1={scanX} y1={rockY - rockR} x2={scanX} y2={rockY + rockR} stroke="#6CE5FF" strokeWidth={4.5} opacity={0.9} />
              <Glow x={scanX} y={rockY} r={140 * scale} kind="cool" o={0.52} />
            </g>
          ) : null}
        </g>

        {/* Pale rim light along left side */}
        <path
          d={`M ${rockX - rockR * 0.52} ${rockY - rockR * 0.54} L ${rockX - rockR * 0.88} ${rockY - rockR * 0.17} L ${rockX - rockR * 0.93} ${rockY + rockR * 0.09} L ${rockX - rockR * 0.62} ${rockY + rockR * 0.51}`}
          fill="none"
          stroke="#D7E2FF"
          strokeWidth={4}
          opacity={0.78}
        />
      </g>

      <LightVeil id={`${id}veil`} lights={[[rockX - rockR * 0.3, rockY, 540 * scale]]} o={0.32} />
      <Dust t={t} seed={718} x0={0} y0={0.14 * H} w={W} h={0.68 * H} n={30} o={0.45} />
    </g>
  );
};

/** 7. MISSION OPERATIONS ROOM */
export const OpsSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const scale = Math.min(W, H) / 1080;
  const isOk = Number(sp.ok ?? 0) >= 0.5;
  const tension = clamp(Number(sp.tension ?? 0.3));
  const amberCount = Math.round(tension * 6);
  const okPulse = 0.65 + 0.35 * Math.sin(t / 8);

  if (layer === 'far') {
    const wallTop = H * (vert ? 0.36 : 0.16);
    const cols = vert ? 3 : 6;
    const screenW = (vert ? 220 : 210) * scale;
    const screenH = (vert ? 120 : 128) * scale;
    const gap = (vert ? 26 : 36) * scale;
    const totalW = cols * screenW + (cols - 1) * gap;
    const startX = (W - totalW) * 0.5;

    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill="#111428" />
        {/* Architectural wall panels */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={-0.3 * W + i * 0.25 * W}
            y={-0.4 * H}
            width={0.23 * W}
            height={1.6 * H}
            fill={i % 2 ? '#161A32' : '#13172C'}
          />
        ))}
        {/* Bank of dark screens with glowing trajectory curves */}
        {Array.from({ length: cols }).map((_, i) => {
          const sx = startX + i * (screenW + gap);
          const sy = wallTop + (i % 2) * 18 * scale;
          const isAmber = !isOk && i < amberCount;
          const flash = isAmber && Math.sin(t / 5 + i * 1.3) > -0.2;
          const scrStroke = isOk ? '#2FB7A6' : flash ? '#FFB84D' : '#4E5C8A';
          const curveColor = isOk ? '#52E09D' : flash ? '#FF9D3D' : PALETTE.cream;
          const dotFrac = ((t * 0.015 + i * 0.19) % 1);
          return (
            <g key={i} transform={`translate(${sx} ${sy})`}>
              <rect width={screenW} height={screenH} rx={10} fill="#0A0D1B" stroke={DARK_OUTLINE} strokeWidth={4} />
              <rect x={6} y={6} width={screenW - 12} height={screenH - 12} rx={6} fill="none" stroke={scrStroke} strokeWidth={2.5} opacity={isOk ? okPulse : 0.72} />
              <path
                d={`M ${18 * scale} ${screenH * 0.72} Q ${screenW * 0.45} ${screenH * 0.22} ${screenW - 18 * scale} ${screenH * 0.48}`}
                fill="none"
                stroke={curveColor}
                strokeWidth={3.5}
                opacity={0.9}
              />
              <circle
                cx={lerp(18 * scale, screenW - 18 * scale, dotFrac)}
                cy={lerp(screenH * 0.72, screenH * 0.48, dotFrac) - Math.sin(Math.PI * dotFrac) * screenH * 0.28}
                r={5 * scale}
                fill={curveColor}
              />
              {isOk || flash ? <Glow x={screenW * 0.5} y={screenH * 0.5} r={115 * scale} kind={isOk ? 'cool' : 'warm'} o={0.34} /> : null}
            </g>
          );
        })}
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <GroundPlane y={ground + 42 * scale} fill="#14182B" rim="#6A7CB4" />
        <Foreground blur={7}>
          <rect x={-0.1 * W} y={ground - 45 * scale} width={0.16 * W} height={240} rx={14} fill="#0D1020" />
          <rect x={0.93 * W} y={ground - 55 * scale} width={0.18 * W} height={240} rx={14} fill="#0D1020" />
        </Foreground>
      </g>
    );
  }

  // mid: Rows of desks, desk monitors, headset lamps (strictly no faces/characters)
  const deskY = ground - 115 * scale;
  const deskColor = isOk ? '#43E6A8' : tension > 0.7 ? '#FFB84D' : '#8FD8FF';
  return (
    <g>
      <GroundPlane y={ground} fill="#1B2038" rim={isOk ? '#6DE8C4' : '#8A9FD6'} />
      {/* Back row consoles */}
      {[0.14, 0.36, 0.64, 0.86].map((dx, i) => {
        const x = dx * W;
        return (
          <g key={i} transform={`translate(${x} ${deskY - 40 * scale})`}>
            <rect x={-110 * scale} y={0} width={220 * scale} height={95 * scale} rx={8} fill="#232842" stroke={DARK_OUTLINE} strokeWidth={4} />
            {/* Desk monitor */}
            <rect x={-52 * scale} y={-44 * scale} width={104 * scale} height={54 * scale} rx={6} fill="#14192E" stroke={DARK_OUTLINE} strokeWidth={3.5} />
            <line x1={-36 * scale} y1={-16 * scale} x2={36 * scale} y2={-22 * scale} stroke={deskColor} strokeWidth={3} opacity={0.75} />
            {/* Headset resting on desk & curved lamp */}
            <path d={`M ${68 * scale} 0 Q ${78 * scale} ${-48 * scale} ${44 * scale} ${-52 * scale}`} fill="none" stroke="#363D60" strokeWidth={5 * scale} strokeLinecap="round" />
            <circle cx={42 * scale} cy={-50 * scale} r={7 * scale} fill="#FFE6A8" />
            <Cone d={`M ${38 * scale} ${-46 * scale} L ${50 * scale} ${-46 * scale} L ${84 * scale} 10 L ${-8 * scale} 10 Z`} o={0.18} />
            <Glow x={42 * scale} y={-50 * scale} r={72 * scale} kind={isOk ? 'cool' : 'warm'} o={0.45} />
          </g>
        );
      })}
      {/* Mid row desks */}
      {[0.22, 0.5, 0.78].map((dx, i) => {
        const x = dx * W;
        return (
          <g key={i} transform={`translate(${x} ${ground - 90 * scale})`}>
            <rect x={-125 * scale} y={0} width={250 * scale} height={92 * scale} rx={8} fill="#2D3354" stroke={DARK_OUTLINE} strokeWidth={4} />
            <line x1={-115 * scale} y1={6 * scale} x2={115 * scale} y2={6 * scale} stroke="#6E7EB0" strokeWidth={3} opacity={0.45} />
            <rect x={-58 * scale} y={-36 * scale} width={116 * scale} height={42 * scale} rx={5} fill="#13172B" stroke={DARK_OUTLINE} strokeWidth={3.5} />
            <path d={`M ${-42 * scale} -12 Q 0 -24 ${42 * scale} -14`} fill="none" stroke={deskColor} strokeWidth={3} opacity={0.8} />
          </g>
        );
      })}

      <LightVeil
        id={`${id}veil`}
        lights={[
          [0.5 * W, H * (vert ? 0.45 : 0.3), 580 * scale],
          [0.5 * W, ground - 100 * scale, 480 * scale],
        ]}
        o={tension > 0.75 && !isOk ? 0.48 : 0.3}
      />
      <Dust t={t} seed={812} x0={0} y0={0.16 * H} w={W} h={0.68 * H} n={28} o={0.42} />
    </g>
  );
};

/** 8. EARTH AND DANGER ROCK */
export const EarthViewSet: React.FC<SetProps> = ({ t, p, W, H, ground, layer, sp, id }) => {
  const vert = H > W;
  const scale = Math.min(W, H) / 1080;
  const baseT = clamp(Number(sp.t ?? 0.5));
  const distT = clamp(baseT + lerp(-0.03, 0.04, easeInOut(p)));
  const nudgeVal = clamp(Number(sp.nudge ?? 0));

  const earthX = W * (vert ? 0.22 : 0.19);
  const earthY = H * (vert ? 0.49 : 0.44);
  const earthR = (vert ? 136 : 168) * scale;

  const startX = W * (vert ? 0.86 : 0.88);
  const startY = H * (vert ? 0.45 : 0.38);
  const endX = earthX + earthR + 48 * scale;
  const endY = earthY - 10 * scale;

  const nudgeAnim = nudgeVal > 0 ? clamp(nudgeVal * easeOut(clamp(0.4 + p * 0.6))) : 0;
  const rockX = lerp(startX, endX, distT);
  const rockY = lerp(startY, endY, distT) - nudgeAnim * 95 * scale;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill="#080A1E" />
        <Stars seed={901} x0={-0.7 * W} y0={-0.7 * H} w={2.4 * W} h={2.4 * H} t={t} n={125} o={0.85} />
        <Rays x={earthX} y={earthY} t={t} len={1800} n={12} o={0.11} color="#9FD4FF" />
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Foreground blur={7}>
          <circle cx={0.04 * W} cy={ground + 55 * scale} r={18 * scale} fill="#141830" opacity={0.6} />
          <circle cx={0.95 * W} cy={0.16 * H} r={14 * scale} fill="#141830" opacity={0.6} />
        </Foreground>
      </g>
    );
  }

  const dangerAlarm = nudgeVal === 0 && distT >= 0.78;
  const cloudShift = Math.sin(t / 28) * 14 * scale;

  return (
    <g>
      <GroundPlane y={ground} fill="#0F1228" rim="#6E86C6" />
      <defs>
        <clipPath id={`${id}earthClip`}>
          <circle cx={earthX} cy={earthY} r={earthR} />
        </clipPath>
      </defs>

      {/* Blue Earth with pale rim on left */}
      <Glow x={earthX} y={earthY} r={earthR * 1.95} kind={dangerAlarm ? 'red' : 'cool'} o={dangerAlarm ? 0.55 + 0.15 * Math.sin(t / 6) : 0.45} />
      <circle cx={earthX} cy={earthY} r={earthR} fill="#2B6DD8" stroke={DARK_OUTLINE} strokeWidth={4} />
      <g clipPath={`url(#${id}earthClip)`}>
        {/* Stylized green continents */}
        <path
          d={`M ${earthX - earthR * 0.65} ${earthY - earthR * 0.45} Q ${earthX - earthR * 0.15} ${earthY - earthR * 0.55} ${earthX - earthR * 0.1} ${earthY - earthR * 0.08} Q ${earthX - earthR * 0.35} ${earthY + earthR * 0.35} ${earthX - earthR * 0.68} ${earthY + earthR * 0.25} Z`}
          fill="#2FB7A6"
          stroke={DARK_OUTLINE}
          strokeWidth={3}
        />
        <path
          d={`M ${earthX + earthR * 0.12} ${earthY - earthR * 0.15} Q ${earthX + earthR * 0.58} ${earthY - earthR * 0.32} ${earthX + earthR * 0.65} ${earthY + earthR * 0.24} Q ${earthX + earthR * 0.22} ${earthY + earthR * 0.45} ${earthX + earthR * 0.1} ${earthY + earthR * 0.12} Z`}
          fill="#349E7A"
          stroke={DARK_OUTLINE}
          strokeWidth={3}
        />
        {/* Drifting cloud bands */}
        <ellipse cx={earthX + cloudShift - 18 * scale} cy={earthY - earthR * 0.38} rx={earthR * 0.42} ry={earthR * 0.11} fill="#EAF4FF" opacity={0.62} />
        <ellipse cx={earthX - cloudShift + 22 * scale} cy={earthY + earthR * 0.34} rx={earthR * 0.36} ry={earthR * 0.09} fill="#EAF4FF" opacity={0.55} />
        {/* Night shadow crescent */}
        <path
          d={`M ${earthX + earthR * 0.25} ${earthY - earthR} A ${earthR} ${earthR} 0 0 1 ${earthX + earthR * 0.25} ${earthY + earthR} Q ${earthX + earthR * 0.48} ${earthY} ${earthX + earthR * 0.25} ${earthY - earthR} Z`}
          fill="#0B132B"
          opacity={0.45}
        />
      </g>
      <path
        d={`M ${earthX - earthR * 0.72} ${earthY - earthR * 0.62} A ${earthR * 0.96} ${earthR * 0.96} 0 0 0 ${earthX - earthR * 0.7} ${earthY + earthR * 0.62}`}
        fill="none"
        stroke="#CFE8FF"
        strokeWidth={4.5}
        opacity={0.8}
      />

      {/* Original danger trajectory toward Earth */}
      <path
        d={`M ${startX + 40 * scale} ${startY} Q ${W * 0.54} ${startY - 25 * scale} ${earthX + earthR * 0.4} ${earthY}`}
        fill="none"
        stroke={dangerAlarm ? '#FF7566' : PALETTE.cream}
        strokeWidth={3.5}
        strokeDasharray="10 14"
        strokeDashoffset={t * 1.6}
        opacity={nudgeAnim > 0.1 ? 0.26 : 0.72}
      />

      {/* Deflected safe path when nudged */}
      {nudgeAnim > 0.05 ? (
        <g>
          <path
            d={`M ${rockX} ${rockY} Q ${lerp(rockX, earthX, 0.55)} ${rockY - 125 * scale * nudgeAnim} ${earthX - 20 * scale} ${earthY - earthR - 145 * scale * nudgeAnim}`}
            fill="none"
            stroke={PALETTE.gold}
            strokeWidth={4.5}
            strokeDasharray="12 12"
            strokeDashoffset={t * 2}
            opacity={0.92}
          />
          {/* Small spacecraft impact flash */}
          <Glow x={rockX + 26 * scale} y={rockY + 24 * scale} r={75 * scale} kind="warm" o={0.75} />
          <g transform={`translate(${rockX + 34 * scale} ${rockY + 32 * scale}) rotate(-140)`}>
            <rect x={-8 * scale} y={-24 * scale} width={6 * scale} height={48 * scale} rx={2} fill="#F2B33D" stroke={DARK_OUTLINE} strokeWidth={3} />
            <rect x={-10 * scale} y={-9 * scale} width={18 * scale} height={18 * scale} rx={3} fill="#C6CFE3" stroke={DARK_OUTLINE} strokeWidth={3} />
          </g>
        </g>
      ) : null}

      {/* Approaching grey asteroid */}
      <g transform={`translate(${rockX} ${rockY}) rotate(${t * 0.4})`}>
        <path
          d={asteroidPath(911, 52 * scale, 43 * scale, 16, 0.14)}
          fill="#80859B"
          stroke={DARK_OUTLINE}
          strokeWidth={4}
        />
        <ellipse cx={-12 * scale} cy={-8 * scale} rx={11 * scale} ry={8 * scale} fill="#595D70" stroke={DARK_OUTLINE} strokeWidth={2.5} />
        <ellipse cx={14 * scale} cy={10 * scale} rx={12 * scale} ry={9 * scale} fill="#464B5E" stroke={DARK_OUTLINE} strokeWidth={2.5} />
      </g>

      <LightVeil id={`${id}veil`} lights={[[earthX, earthY, 440 * scale], [rockX, rockY, 320 * scale]]} o={0.3} />
      <Dust t={t} seed={925} x0={0} y0={0.14 * H} w={W} h={0.68 * H} n={32} o={0.44} />
    </g>
  );
};

/** 9. PLAIN DEEP-NAVY VOID STAGE WITH TINTED RAYS */
export const VoidSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const scale = Math.min(W, H) / 1080;
  const glowName = String(sp.glow ?? 'gold');
  const rayColor = glowName === 'red' ? '#FF7575' : glowName === 'cyan' ? '#6CE5FF' : '#FFD26A';
  const rimColor = glowName === 'red' ? '#FF8787' : glowName === 'cyan' ? '#7AE8FF' : '#F2C66D';
  const glowKind = glowName === 'red' ? 'red' : glowName === 'cyan' ? 'cool' : 'warm';
  const cx = W * 0.5;
  const cy = H * 0.42;

  if (layer === 'far') {
    return (
      <g>
        <rect x={-0.8 * W} y={-0.8 * H} width={2.6 * W} height={2.6 * H} fill="#080A1D" />
        {/* Almost no stars: very sparse subtle points */}
        <Stars seed={961} x0={-0.6 * W} y0={-0.6 * H} w={2.2 * W} h={2.2 * H} t={t} n={22} o={0.42} />
        <Glow x={cx} y={cy} r={520 * scale} kind={glowKind} o={0.28 + 0.06 * Math.sin(t / 14)} />
        <Rays x={cx} y={cy} t={t} len={1800} n={14} o={0.15} color={rayColor} />
        {/* Faint concentric schematic orbital rings */}
        {[280, 440].map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r * scale}
            fill="none"
            stroke={rayColor}
            strokeWidth={2}
            strokeDasharray="8 20"
            strokeDashoffset={t * (i === 0 ? 0.5 : -0.4)}
            opacity={0.1}
          />
        ))}
      </g>
    );
  }

  if (layer === 'near') {
    return (
      <g>
        <Foreground blur={8}>
          <circle cx={0.04 * W} cy={0.16 * H} r={22 * scale} fill={rayColor} opacity={0.14} />
          <circle cx={0.96 * W} cy={ground + 65 * scale} r={26 * scale} fill={rayColor} opacity={0.12} />
        </Foreground>
      </g>
    );
  }

  return (
    <g>
      <GroundPlane y={ground} fill="#101329" rim={rimColor} />
      <Glow x={cx} y={ground} r={340 * scale} kind={glowKind} o={0.22} />
      <LightVeil id={`${id}veil`} lights={[[cx, cy, 620 * scale], [cx, ground - 90 * scale, 520 * scale]]} o={0.34} />
      <Dust t={t} seed={977} x0={0} y0={0.12 * H} w={W} h={0.72 * H} n={26} o={0.4} />
    </g>
  );
};
