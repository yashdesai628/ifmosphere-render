import React from 'react';
import { PALETTE, FONTS } from '../../brand';
import { Glow } from '../../engine/light';
import { clamp, lerp, easeInOut, easeOut, backOut, rnd } from '../../engine/anim';
import type { SetProps } from './render';
import { FarSpaceBackdrop, MidStageFloor, NearFrame, GLOW_CFG, glowOf, INK } from './sets-shared';

const STAR_SHELLS = [
  { name: 'H', rFrac: 1.0, fill: '#79BAFF', hi: '#AED7FF' },
  { name: 'He', rFrac: 0.83, fill: '#F3E9D4', hi: '#FFF8EB' },
  { name: 'C', rFrac: 0.67, fill: '#7B778D', hi: '#9C97B2' },
  { name: 'O', rFrac: 0.51, fill: '#FF8638', hi: '#FFB169' },
  { name: 'Si', rFrac: 0.34, fill: '#8B5AD0', hi: '#B085EE' },
];

/** Generate a wobbly closed ring path around (cx, cy) for churning shell layers. */
const churnRingPath = (
  cx: number,
  cy: number,
  r: number,
  lobes: number,
  amp: number,
  phase: number,
): string => {
  const pts = 36;
  let d = '';
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const dr =
      amp *
      (0.65 * Math.sin(a * lobes + phase) + 0.35 * Math.cos(a * (lobes - 3) - phase * 1.4));
    const px = cx + (r + dr) * Math.cos(a);
    const py = cy + (r + dr) * Math.sin(a);
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return d + 'Z';
};

/** 1. StarSet: massive onion-shell star cross-section with shell reveal, churning, merger, and core collapse. */
export const StarSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const st = (sp.t as number | undefined) ?? 0.4;
  const shells = (sp.shells as number | undefined) ?? 1;
  const churn = (sp.churn as number | undefined) ?? 0;
  const merge = (sp.merge as number | undefined) ?? 0;
  const collapse = (sp.collapse as number | undefined) ?? 0;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={101}
        rayOpacity={0.16}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={102} />;
  }

  const vert = H > W;
  const cx = W * 0.5 + Math.sin(t / 46 + st * 4) * 8;
  const cy = vert ? H * 0.49 : H * 0.47;
  const R = Math.min(W, H) * (vert ? 0.25 : 0.27);
  const phase = t * 0.08 + st * 6;
  const pulse = 1 + 0.015 * Math.sin(t / 12);

  // Exterior-only look when shells <= 0.35 (e.g., S23 "cannot see any of this from outside")
  const exteriorOnly = shells <= 0.35;
  const rCoreBase = R * 0.16;
  const rCore = lerp(rCoreBase, 4, easeInOut(clamp(collapse)));
  const flashWave = collapse >= 0.85 ? (t % 36) / 36 : 0;

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={103}
        veilLights={[[cx, cy, R * 2.1]]}
        veilOpacity={0.32}
      />

      <g transform={`translate(${cx} ${cy}) scale(${pulse}) translate(${-cx} ${-cy})`}>
        {/* Outer atmospheric corona bloom */}
        <Glow x={cx} y={cy} r={R * 1.65} kind={cfg.kind} o={0.48 + 0.12 * Math.sin(t / 14)} />

        {exteriorOnly ? (
          <g>
            {/* Glowing unbroken outer photosphere */}
            <circle cx={cx} cy={cy} r={R} fill="#5C9EEB" stroke={INK} strokeWidth={4} />
            <circle cx={cx} cy={cy} r={R * 0.92} fill="#84C5FF" opacity={0.65} />
            {Array.from({ length: 10 }).map((_, i) => {
              const ang = (i / 10) * Math.PI * 2 + t * 0.012;
              const rr = R * (0.45 + 0.25 * rnd(19, i));
              return (
                <ellipse
                  key={i}
                  cx={cx + Math.cos(ang) * rr}
                  cy={cy + Math.sin(ang) * rr}
                  rx={32 + rnd(20, i) * 26}
                  ry={18 + rnd(21, i) * 14}
                  fill="#CBE8FF"
                  opacity={0.28 + 0.14 * Math.sin(t / 10 + i)}
                />
              );
            })}
            {/* Subtle dotted hint of hidden onion rings inside */}
            <circle
              cx={cx}
              cy={cy}
              r={R * 0.62}
              fill="none"
              stroke={PALETTE.cream}
              strokeWidth={2}
              strokeDasharray="6 10"
              opacity={0.22}
            />
          </g>
        ) : (
          <g>
            {/* Concentric shells from outside in */}
            {STAR_SHELLS.map((sh, i) => {
              const appear = backOut(clamp((shells - i * 0.12) / 0.28));
              if (appear <= 0.01) return null;
              const r = R * sh.rFrac * appear;

              // Carbon (i=2) and Oxygen (i=3) churn & merge behaviors
              const isC = i === 2;
              const isO = i === 3;
              const wAmp = isC ? churn * 10 : isO ? churn * 12 : churn * 2.5;
              const fillCol = isC && merge > 0 ? '#9D7B73' : isO && merge > 0 ? '#E38849' : sh.fill;
              const hideBoundary = isO && merge > 0.35;

              const pathD =
                wAmp > 0.6
                  ? churnRingPath(cx, cy, r, isO ? 9 : 7, wAmp, phase * (isO ? -1.3 : 1))
                  : undefined;

              return (
                <g key={sh.name}>
                  {pathD ? (
                    <path
                      d={pathD}
                      fill={fillCol}
                      stroke={hideBoundary ? '#E89B5A' : INK}
                      strokeWidth={hideBoundary ? 2 : 4}
                      opacity={hideBoundary ? 1 - merge * 0.25 : 1}
                    />
                  ) : (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={fillCol}
                      stroke={hideBoundary ? '#E89B5A' : INK}
                      strokeWidth={hideBoundary ? 2 : 4}
                    />
                  )}
                  {/* Inner crescent highlight for depth */}
                  <path
                    d={`M ${cx - r * 0.78} ${cy - r * 0.38} A ${r * 0.88} ${r * 0.88} 0 0 1 ${cx + r * 0.56} ${cy - r * 0.66}`}
                    fill="none"
                    stroke={sh.hi}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    opacity={0.55}
                  />
                </g>
              );
            })}

            {/* Swirl eddies & marbling when churn > 0 or merge > 0 */}
            {churn > 0.05 || merge > 0.05 ? (
              <g>
                {Array.from({ length: 12 }).map((_, k) => {
                  const baseAng = (k / 12) * Math.PI * 2 + t * 0.025 * (k % 2 ? 1 : -1.2);
                  const rad = R * lerp(0.54, 0.63, (k % 3) / 2);
                  const ex = cx + Math.cos(baseAng) * rad;
                  const ey = cy + Math.sin(baseAng) * rad;
                  const col = k % 2 === 0 ? '#FFB86B' : '#9691A8';
                  return (
                    <g key={k} transform={`translate(${ex} ${ey}) rotate(${(baseAng * 180) / Math.PI})`}>
                      <path
                        d="M -18 -6 Q 0 -18 18 0 Q 4 14 -14 6"
                        fill="none"
                        stroke={col}
                        strokeWidth={5}
                        strokeLinecap="round"
                        opacity={clamp(Math.max(churn, merge)) * 0.85}
                      />
                    </g>
                  );
                })}
                {/* Cracking wall sparks as C/O boundary breaks */}
                {merge > 0.2 && merge < 0.8 ? (
                  <g stroke="#FFF1C2" strokeWidth={3} opacity={0.85}>
                    {[0.4, 1.8, 3.1, 4.7].map((a, idx) => {
                      const rr = R * 0.51;
                      const x1 = cx + Math.cos(a + t * 0.01) * (rr - 12);
                      const y1 = cy + Math.sin(a + t * 0.01) * (rr - 12);
                      const x2 = cx + Math.cos(a + t * 0.01) * (rr + 14);
                      const y2 = cy + Math.sin(a + t * 0.01) * (rr + 14);
                      return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} />;
                    })}
                  </g>
                ) : null}
              </g>
            ) : null}

            {/* Small dark-grey iron core (draws when shells >= 0.85) */}
            {shells >= 0.82 ? (
              <g>
                {collapse > 0.05 ? (
                  <g>
                    <Glow x={cx} y={cy} r={R * 0.45} kind="red" o={0.45 + 0.35 * collapse} />
                    {/* Inward gravitational squeeze rings */}
                    {[0, 1, 2].map((ri) => {
                      const inf = ((t * 0.03 + ri * 0.33) % 1);
                      const rr = lerp(R * 0.32, rCore + 4, inf);
                      return (
                        <circle
                          key={ri}
                          cx={cx}
                          cy={cy}
                          r={rr}
                          fill="none"
                          stroke={PALETTE.red}
                          strokeWidth={2.5}
                          opacity={(1 - inf) * collapse * 0.7}
                        />
                      );
                    })}
                  </g>
                ) : null}
                <circle
                  cx={cx}
                  cy={cy}
                  r={rCore}
                  fill="#444755"
                  stroke={INK}
                  strokeWidth={4}
                />
                {rCore > 12 ? (
                  <text
                    x={cx}
                    y={cy + 6}
                    textAnchor="middle"
                    fontFamily={FONTS.ui}
                    fontWeight={700}
                    fontSize={16}
                    fill={PALETTE.cream}
                  >
                    Fe
                  </text>
                ) : null}
              </g>
            ) : null}

            {/* Subtle shell symbols on right side when shells fully revealed */}
            {shells >= 0.95 && merge < 0.5 && collapse < 0.5 ? (
              <g opacity={0.85}>
                {STAR_SHELLS.map((sh, i) => (
                  <text
                    key={sh.name}
                    x={cx + R * (sh.rFrac - 0.08)}
                    y={cy + 5}
                    textAnchor="middle"
                    fontFamily={FONTS.ui}
                    fontWeight={700}
                    fontSize={14}
                    fill={i === 1 ? PALETTE.pill : PALETTE.cream}
                  >
                    {sh.name}
                  </text>
                ))}
              </g>
            ) : null}
          </g>
        )}

        {/* Core collapse white rebound flash at collapse ~ 1 */}
        {collapse >= 0.85 ? (
          <g>
            <Glow x={cx} y={cy} r={R * 1.4} kind="warm" o={0.85} />
            <circle
              cx={cx}
              cy={cy}
              r={lerp(14, R * 0.92, easeOut(flashWave))}
              fill="none"
              stroke="#FFF9E6"
              strokeWidth={lerp(12, 2, flashWave)}
              opacity={1 - flashWave}
            />
            <circle cx={cx} cy={cy} r={22 + Math.sin(t / 4) * 5} fill="#FFFFFF" />
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** 2. BlastSet: supernova explosion with expanding shock ring, orange/green filaments, and cooling dust grains. */
export const BlastSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const st = (sp.t as number | undefined) ?? 0.6;
  const dust = (sp.dust as number | undefined) ?? 0;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={201}
        rayOpacity={0.2}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={202} />;
  }

  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.47;
  const maxR = Math.min(W, H) * (vert ? 0.39 : 0.41);
  const breathe = Math.sin(t / 14) * 8;
  const shockR = lerp(88, maxR, easeOut(clamp(st))) + breathe;
  const nFil = 18;

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={203}
        veilLights={[[cx, cy, shockR * 1.65]]}
        veilOpacity={0.34}
        dustCount={44}
      />

      {/* Intense central blast glow */}
      <Glow x={cx} y={cy} r={shockR * 1.4} kind={cfg.kind} o={0.62 + 0.12 * Math.sin(t / 9)} />

      {/* Orange & green filaments streaking outward */}
      <g>
        {Array.from({ length: nFil }).map((_, i) => {
          const ang = (i / nFil) * Math.PI * 2 + rnd(41, i) * 0.25 + t * 0.002;
          const len = shockR * (0.72 + rnd(42, i) * 0.42);
          const bend = (rnd(43, i) - 0.5) * 44;
          const ex = cx + Math.cos(ang) * len;
          const ey = cy + Math.sin(ang) * len;
          const mx = cx + Math.cos(ang) * len * 0.52 - Math.sin(ang) * bend;
          const my = cy + Math.sin(ang) * len * 0.52 + Math.cos(ang) * bend;
          const isGreen = i % 3 === 1;
          const col = isGreen ? '#4AD68A' : i % 3 === 2 ? '#FFAA4D' : '#FF6C36';
          const pulseDot = ((t * 0.025 + rnd(44, i)) % 1);
          const dx = lerp(cx, ex, pulseDot);
          const dy = lerp(cy, ey, pulseDot);

          return (
            <g key={i}>
              <path
                d={`M ${cx} ${cy} Q ${mx} ${my} ${ex} ${ey}`}
                fill="none"
                stroke={INK}
                strokeWidth={15}
                strokeLinecap="round"
              />
              <path
                d={`M ${cx} ${cy} Q ${mx} ${my} ${ex} ${ey}`}
                fill="none"
                stroke={col}
                strokeWidth={8}
                strokeLinecap="round"
              />
              <circle cx={dx} cy={dy} r={4.5} fill="#FFF5D6" />
            </g>
          );
        })}
      </g>

      {/* Main expanding white-gold shockwave rings */}
      <circle
        cx={cx}
        cy={cy}
        r={shockR}
        fill="none"
        stroke={INK}
        strokeWidth={20}
        opacity={0.85}
      />
      <circle
        cx={cx}
        cy={cy}
        r={shockR}
        fill="none"
        stroke="#FFE8A6"
        strokeWidth={12}
        opacity={0.92}
      />
      <circle
        cx={cx}
        cy={cy}
        r={shockR * 0.86}
        fill="none"
        stroke="#FFFDF2"
        strokeWidth={4}
        strokeDasharray="24 18"
        opacity={0.65}
      />

      {/* Secondary pulsing ripple */}
      {(() => {
        const w = (t % 45) / 45;
        return (
          <circle
            cx={cx}
            cy={cy}
            r={lerp(shockR * 0.35, shockR * 1.12, easeOut(w))}
            fill="none"
            stroke={cfg.accent}
            strokeWidth={3.5}
            opacity={(1 - w) * 0.55}
          />
        );
      })()}

      {/* Central white-hot remnant flash */}
      <circle cx={cx} cy={cy} r={24 + Math.sin(t / 7) * 4} fill="#FFFDF5" stroke={PALETTE.gold} strokeWidth={4} />

      {/* Cooling debris faceted grains appearing as setp.dust rises */}
      {dust > 0.05 ? (
        <g>
          {Array.from({ length: Math.round(36 * clamp(dust)) }).map((_, i) => {
            const ang = rnd(51, i) * Math.PI * 2 + t * 0.004 * (i % 2 ? 1 : -1);
            const dist = shockR * (0.45 + rnd(52, i) * 0.55);
            const gx = cx + Math.cos(ang) * dist;
            const gy = cy + Math.sin(ang) * dist;
            const sz = 6 + rnd(53, i) * 9;
            const gCol = i % 3 === 0 ? '#F4C6C8' : i % 3 === 1 ? '#57CE8C' : '#65D5FF';
            const tw = 0.65 + 0.35 * Math.sin(t / 8 + i * 1.4);
            return (
              <g key={i} transform={`translate(${gx} ${gy}) rotate(${t * 0.9 + i * 35})`} opacity={tw}>
                <polygon
                  points={`0,${-sz} ${sz * 0.78},0 0,${sz} ${-sz * 0.78},0`}
                  fill={gCol}
                  stroke={INK}
                  strokeWidth={3}
                />
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

const CAS_WISPS = [
  { a: 0.2, r: 0.72, rx: 95, ry: 42, col: '#EB6D32' },
  { a: 1.0, r: 0.68, rx: 88, ry: 38, col: '#F59842' },
  { a: 1.9, r: 0.74, rx: 102, ry: 44, col: '#E35E2A' },
  { a: 2.8, r: 0.69, rx: 92, ry: 40, col: '#FF9F4A' },
  { a: 3.7, r: 0.73, rx: 98, ry: 42, col: '#E86A31' },
  { a: 4.6, r: 0.7, rx: 90, ry: 36, col: '#F0883D' },
  { a: 5.5, r: 0.71, rx: 94, ry: 40, col: '#EB6D32' },
];

/** 3. RemnantSet: Cassiopeia A supernova remnant with orange/green filaments, light-blue pockets, zoom & P1/P2/P3 boxes. */
export const RemnantSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const st = (sp.t as number | undefined) ?? 0.5;
  const zoom = (sp.zoom as number | undefined) ?? 0;
  const regions = (sp.regions as number | undefined) ?? 0;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={301}
        rayOpacity={0.12}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={302} />;
  }

  const vert = H > W;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.47;
  const R = Math.min(W, H) * (vert ? 0.25 : 0.265);
  const zScale = 1 + clamp(zoom) * 0.68;
  const drift = Math.sin(t / 30 + st * 4) * 5;
  const rot = t * 0.05;

  // Box reveal helper for P1, P2 (Green Monster), P3
  const boxScale = (idx: number) => backOut(clamp((t - 5 - idx * 8) / 8));

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={303}
        veilLights={[[cx, cy, R * 1.9 * zScale]]}
        veilOpacity={0.36}
        dustCount={36}
      />

      <g transform={`translate(${cx} ${cy + drift}) scale(${zScale})`}>
        <Glow x={0} y={0} r={R * 1.75} kind={cfg.kind} o={0.5} />

        {/* Outer faint blue-teal blast halo */}
        <circle
          cx={0}
          cy={0}
          r={R * 1.04}
          fill="#172A45"
          stroke="#4AA8DB"
          strokeWidth={3.5}
          strokeDasharray="16 12"
          opacity={0.72}
        />

        {/* Rotating smoky cloud core & dense orange ring */}
        <g transform={`rotate(${rot})`}>
          {/* Green smoky interior wisps (incl. upper-right Green Monster patch) */}
          <path
            d={`M ${-R * 0.5} ${-R * 0.2} Q ${-R * 0.1} ${-R * 0.72} ${R * 0.52} ${-R * 0.34} Q ${R * 0.65} ${R * 0.1} ${R * 0.14} ${R * 0.28} Q ${-R * 0.35} ${R * 0.22} ${-R * 0.5} ${-R * 0.2} Z`}
            fill="#379E6C"
            stroke={INK}
            strokeWidth={4}
            opacity={0.82}
          />
          <ellipse cx={R * 0.18} cy={-R * 0.32} rx={R * 0.36} ry={R * 0.22} fill="#66DF9A" opacity={0.48} />

          {/* Light-blue interior pockets */}
          <ellipse cx={-R * 0.26} cy={R * 0.16} rx={R * 0.25} ry={R * 0.18} fill="#68C8F5" opacity={0.65} />
          <ellipse cx={R * 0.26} cy={R * 0.24} rx={R * 0.2} ry={R * 0.15} fill="#82DBFF" opacity={0.58} />

          {/* Dense orange filament ring between centre and edge */}
          {CAS_WISPS.map((w, i) => {
            const wx = Math.cos(w.a) * R * w.r;
            const wy = Math.sin(w.a) * R * w.r;
            const deg = (w.a * 180) / Math.PI + 90;
            const breathe = 1 + 0.04 * Math.sin(t / 16 + i);
            return (
              <g key={i} transform={`translate(${wx} ${wy}) rotate(${deg}) scale(${breathe})`}>
                <ellipse
                  cx={0}
                  cy={0}
                  rx={w.rx * (R / 260)}
                  ry={w.ry * (R / 260)}
                  fill={w.col}
                  stroke={INK}
                  strokeWidth={4}
                />
                <ellipse
                  cx={0}
                  cy={-6}
                  rx={w.rx * 0.58 * (R / 260)}
                  ry={w.ry * 0.42 * (R / 260)}
                  fill="#FFD28A"
                  opacity={0.62}
                />
              </g>
            );
          })}

          {/* Sparkling ejecta knots */}
          {Array.from({ length: 18 }).map((_, i) => {
            const a = rnd(61, i) * Math.PI * 2;
            const rr = R * (0.28 + rnd(62, i) * 0.65);
            const tw = 0.55 + 0.45 * Math.sin(t / 8 + i * 1.9);
            return (
              <circle
                key={i}
                cx={Math.cos(a) * rr}
                cy={Math.sin(a) * rr}
                r={3 + rnd(63, i) * 3.5}
                fill={i % 2 === 0 ? '#FFE8AA' : '#8EF2FF'}
                opacity={tw}
              />
            );
          })}
        </g>

        {/* Central glowing neutron star pinpoint */}
        <Glow x={0} y={0} r={52} kind="cool" o={0.75} />
        <circle cx={0} cy={0} r={6} fill="#E8FAFF" />

        {/* Region boxes: P1, P2 (GREEN MONSTER), P3 */}
        {regions >= 1 ? (
          <g transform={`translate(${-R * 0.58} ${-R * 0.48}) scale(${boxScale(0)})`}>
            <rect x={-46} y={-40} width={92} height={80} rx={8} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} />
            <rect x={-26} y={-68} width={52} height={24} rx={6} fill={PALETTE.pill} stroke={PALETTE.cream} strokeWidth={2.5} />
            <text y={-51} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={15} fill={PALETTE.cream}>
              P1
            </text>
          </g>
        ) : null}

        {regions >= 2 ? (
          <g transform={`translate(${R * 0.16} ${-R * 0.34}) scale(${boxScale(1)})`}>
            <rect x={-56} y={-42} width={112} height={84} rx={8} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} />
            <rect x={-96} y={-72} width={192} height={26} rx={6} fill={PALETTE.pill} stroke={PALETTE.green} strokeWidth={2.5} />
            <text y={-54} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={14} fill={PALETTE.green}>
              P2 · GREEN MONSTER
            </text>
          </g>
        ) : null}

        {regions >= 3 ? (
          <g transform={`translate(${R * 0.54} ${R * 0.42}) scale(${boxScale(2)})`}>
            <rect x={-46} y={-40} width={92} height={80} rx={8} fill="none" stroke={PALETTE.cream} strokeWidth={3.5} />
            <rect x={-26} y={44} width={52} height={24} rx={6} fill={PALETTE.pill} stroke={PALETTE.cream} strokeWidth={2.5} />
            <text y={61} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={15} fill={PALETTE.cream}>
              P3
            </text>
          </g>
        ) : null}
      </g>
    </g>
  );
};

const SPEC_POINTS: [number, number][] = [
  [0, 18], [0.08, 22], [0.16, 30], [0.22, 68], [0.26, 128], [0.31, 48],
  [0.39, 36], [0.46, 56], [0.52, 146], [0.58, 52], [0.66, 34], [0.73, 72],
  [0.79, 134], [0.85, 46], [0.92, 28], [1.0, 22],
];

const PEAK_META = [
  { idx: 1, xFrac: 0.26, yVal: 128, label: 'SILICA', col: PALETTE.cyan },
  { idx: 2, xFrac: 0.52, yVal: 146, label: 'MAGNESIUM SILICATE', col: PALETTE.green },
  { idx: 3, xFrac: 0.79, yVal: 134, label: 'CARBON', col: PALETTE.gold },
];

/** 4. WebbViewSet: JWST observing console with Cas A image (left) and drawing IR spectrum (right). */
export const WebbViewSet: React.FC<SetProps> = ({ t, W, H, ground, layer, sp, id }) => {
  const glow = glowOf(sp.glow);
  const cfg = GLOW_CFG[glow];
  const st = (sp.t as number | undefined) ?? 0.5;
  const spec = (sp.spec as number | undefined) ?? 0;
  const pick = (sp.pick as number | undefined) ?? 0;

  if (layer === 'far') {
    return (
      <FarSpaceBackdrop
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={401}
        rayOpacity={0.12}
      />
    );
  }
  if (layer === 'near') {
    return <NearFrame t={t} W={W} H={H} ground={ground} glow={glow} seed={402} />;
  }

  const vert = H > W;
  const monW = vert ? 860 : 1080;
  const monH = vert ? 480 : 480;
  const cx = W * 0.5;
  const cy = vert ? H * 0.49 : H * 0.48;
  const x0 = cx - monW / 2;
  const y0 = cy - monH / 2;
  const push = 1 + st * 0.04 + 0.01 * Math.sin(t / 26);

  // Spectrum drawing progress (animates gently on shot entry when spec > 0)
  const specAnim = spec > 0 ? clamp(spec * lerp(0.55, 1, easeOut(clamp(t / 22)))) : 0;
  const plotX = x0 + monW * 0.47;
  const plotY = y0 + 82;
  const plotW = monW * 0.47;
  const plotH = monH - 150;
  const baseLineY = plotY + plotH;

  // Build SVG polyline path up to specAnim
  const curveD = SPEC_POINTS.map(([xf, yv], i) => {
    const ripple = Math.sin(t / 12 + i * 0.9) * 3;
    const px = plotX + xf * plotW;
    const py = baseLineY - yv * (plotH / 170) + ripple;
    return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join(' ');

  const scanX = Math.sin(t / 20) * 65;
  const scanY = Math.cos(t / 27) * 45;

  return (
    <g>
      <MidStageFloor
        id={id}
        t={t}
        W={W}
        H={H}
        ground={ground}
        glow={glow}
        seed={403}
        veilLights={[[cx, cy, monW * 0.72]]}
        veilOpacity={0.35}
        dustCount={28}
      />

      <g transform={`translate(${cx} ${cy}) scale(${push}) translate(${-cx} ${-cy})`}>
        <Glow x={cx} y={cy} r={monW * 0.55} kind={cfg.kind} o={0.35} />

        {/* Monitor stand reaching floor */}
        <rect x={cx - 32} y={y0 + monH} width={64} height={Math.max(20, ground - (y0 + monH))} fill="#211D36" stroke={INK} strokeWidth={4} />
        <rect x={cx - 140} y={ground - 18} width={280} height={22} rx={8} fill="#2A2544" stroke={INK} strokeWidth={4} />

        {/* Outer Monitor Frame */}
        <rect x={x0} y={y0} width={monW} height={monH} rx={22} fill="#221E38" stroke={INK} strokeWidth={4} />
        <rect x={x0 + 18} y={y0 + 18} width={monW - 36} height={monH - 36} rx={14} fill="#0F1124" stroke="#3E3963" strokeWidth={3} />

        {/* Top status header bar */}
        <circle cx={x0 + 48} cy={y0 + 44} r={7} fill={cfg.accent} opacity={0.6 + 0.4 * Math.sin(t / 8)} />
        <circle cx={x0 + 72} cy={y0 + 44} r={7} fill={PALETTE.green} />
        <text x={x0 + 96} y={y0 + 50} fontFamily={FONTS.ui} fontWeight={700} fontSize={18} fill={PALETTE.cream}>
          JWST · MIRI SPECTROGRAPH
        </text>

        {/* LEFT HALF: Remnant View */}
        <g transform={`translate(${x0 + monW * 0.23} ${y0 + monH * 0.54})`}>
          <rect x={-168} y={-150} width={336} height={300} rx={12} fill="#090814" stroke="#323557" strokeWidth={3} />
          <Glow x={0} y={0} r={140} kind={cfg.kind} o={0.42} />
          <circle cx={0} cy={0} r={96} fill="none" stroke="#E86C31" strokeWidth={18} opacity={0.75} />
          <circle cx={14} cy={-26} r={44} fill="#46B87A" opacity={0.65} />
          <circle cx={-34} cy={22} r={34} fill="#6CCDF5" opacity={0.58} />
          <circle cx={0} cy={0} r={96} fill="none" stroke={INK} strokeWidth={3.5} />
          {/* Moving scanning crosshair */}
          <g transform={`translate(${scanX} ${scanY})`} stroke={PALETTE.cyan} strokeWidth={2.5}>
            <circle cx={0} cy={0} r={22} fill="none" />
            <line x1={-34} y1={0} x2={-12} y2={0} />
            <line x1={12} y1={0} x2={34} y2={0} />
            <line x1={0} y1={-34} x2={0} y2={-12} />
            <line x1={0} y1={12} x2={0} y2={34} />
          </g>
        </g>

        {/* RIGHT HALF: Spectrum Graph */}
        <g>
          {/* Axes & grid */}
          <g stroke="#283052" strokeWidth={1.5}>
            {[0.25, 0.5, 0.75].map((f, i) => (
              <line key={i} x1={plotX} y1={plotY + plotH * f} x2={plotX + plotW} y2={plotY + plotH * f} />
            ))}
          </g>
          <line x1={plotX} y1={plotY} x2={plotX} y2={baseLineY} stroke={PALETTE.cream} strokeWidth={2.5} />
          <line x1={plotX} y1={baseLineY} x2={plotX + plotW} y2={baseLineY} stroke={PALETTE.cream} strokeWidth={2.5} />
          <text x={plotX + plotW * 0.5} y={baseLineY + 34} textAnchor="middle" fontFamily={FONTS.ui} fontSize={16} fill={PALETTE.cream}>
            WAVELENGTH (µm)
          </text>
          <text
            x={plotX - 18}
            y={plotY + plotH * 0.5}
            textAnchor="middle"
            transform={`rotate(-90 ${plotX - 18} ${plotY + plotH * 0.5})`}
            fontFamily={FONTS.ui}
            fontSize={16}
            fill={PALETTE.cream}
          >
            INTENSITY
          </text>

          {/* Clipped drawing spectrum curve */}
          <defs>
            <clipPath id={`${id}specClip`}>
              <rect x={plotX} y={plotY - 20} width={plotW * specAnim} height={plotH + 30} />
            </clipPath>
          </defs>
          {specAnim > 0.01 ? (
            <g clipPath={`url(#${id}specClip)`}>
              <path d={curveD} fill="none" stroke={cfg.accent} strokeWidth={9} opacity={0.28} />
              <path d={curveD} fill="none" stroke={PALETTE.cream} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : (
            /* Live idle trace before spectrum is captured */
            <path
              d={`M ${plotX} ${baseLineY - 20} Q ${plotX + plotW * 0.5} ${baseLineY - 20 + Math.sin(t / 9) * 10} ${plotX + plotW} ${baseLineY - 20}`}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={3}
              opacity={0.7}
            />
          )}

          {/* Peak markers for pick 1, 2, 3 */}
          {PEAK_META.map((pk) => {
            if (pick < pk.idx) return null;
            const active = Math.round(pick) === pk.idx;
            const px = plotX + pk.xFrac * plotW;
            const py = baseLineY - pk.yVal * (plotH / 170);
            const pop = backOut(clamp((t - 6) / 7));
            const labelY = pk.idx === 2 ? py - 58 : py - 34;

            return (
              <g key={pk.idx} transform={`translate(${px} ${py}) scale(${pop})`}>
                <line x1={0} y1={0} x2={0} y2={baseLineY - py} stroke={PALETTE.cream} strokeWidth={2} strokeDasharray="5 5" opacity={0.6} />
                {active ? <Glow x={0} y={0} r={46} kind={cfg.kind} o={0.7} /> : null}
                <circle cx={0} cy={0} r={active ? 10 + Math.sin(t / 6) * 2 : 7} fill={pk.col} stroke={PALETTE.cream} strokeWidth={3} />
                <g transform={`translate(0 ${labelY - py})`}>
                  <rect
                    x={-pk.label.length * 6 - 14}
                    y={-15}
                    width={pk.label.length * 12 + 28}
                    height={30}
                    rx={8}
                    fill={PALETTE.pill}
                    stroke={PALETTE.cream}
                    strokeWidth={2.5}
                  />
                  <text y={6} textAnchor="middle" fontFamily={FONTS.ui} fontWeight={700} fontSize={14} fill={pk.col}>
                    {pk.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </g>
    </g>
  );
};
