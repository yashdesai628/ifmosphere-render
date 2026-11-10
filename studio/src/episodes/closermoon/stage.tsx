import React from 'react';
import {
  FONT,
  Glow as EngineGlow,
  Stars as EngineStars,
  Hero,
  LOOKS,
  CastName,
  Pose,
  basePose,
  feetBelowHips,
  camT,
  camTV,
  clamp,
  lerp,
  easeInOut,
  backOut,
} from '../../engine';
import {
  ClosermoonTitleCard,
  LunarChapterCard,
  HookBannerCard,
  TelemetryPill,
  ShortBigNumber,
  MoonDistanceGaugeUI,
  MoonGaugeConfig,
  ClosermoonEndCard16x9,
  ClosermoonShortEndCard9x16,
} from './cards';
import {
  WORLD_FLOOR_Y,
  GiantMoonProp,
  NightBeachSet,
  OvalOrbitSpaceSet,
  ThumbAndWindowSet,
  SupermoonStageSet,
  SilverParkAvenueSet,
  HarbourSeawallSet,
  FloodedCoastStreetSet,
  CurtainBedroomSet,
  EclipseSkySet,
  RooftopNov2026Set,
} from './sets';

const Glow: React.FC<{ x: number; y: number; r: number; color?: string; o?: number }> = ({
  x,
  y,
  r,
  color = '#FFE27A',
  o = 0.35,
}) => {
  const kind =
    color.includes('7F') || color.includes('4D') || color.includes('2E') || color.includes('5B')
      ? 'cool'
      : color.includes('FF5') || color.includes('FF4') || color.includes('FF3')
        ? 'red'
        : 'warm';
  return <EngineGlow x={x} y={y} r={r} kind={kind} o={o} />;
};

const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 85 }) => (
  <EngineStars seed={37} x0={-200} y0={-200} w={2320} h={1180} t={t} n={n} />
);

export type PosePreset =
  | 'beachAwe'
  | 'ankleScramble'
  | 'pointMoon'
  | 'thumbTest'
  | 'windowGaze'
  | 'squintTube'
  | 'stoolTip'
  | 'readBook'
  | 'towelDrag'
  | 'lifeguardPerch'
  | 'rowDinghy'
  | 'sleepMask'
  | 'eclipseWatch'
  | 'rulerWave'
  | 'rooftopCelebrate';

export function buildPose(
  preset: PosePreset,
  x: number,
  floorY: number,
  scale: number,
  facing: 1 | -1,
  t: number,
  phase = 0,
  sunglasses = false
): Pose {
  const sw = Math.sin(t * 0.14 + phase);
  const fast = Math.sin(t * 0.38 + phase);
  const p: Pose = {
    ...basePose,
    x,
    y: floorY - feetBelowHips(scale),
    scale,
    facing,
    glasses: sunglasses ? 1 : 0,
    sway: sw * 4,
  };

  switch (preset) {
    case 'beachAwe':
      p.tilt = -4 * facing;
      p.headTilt = -16;
      p.armL = { a: 18, b: -18 };
      p.armR = { a: -42 + sw * 4, b: -28 };
      p.expr = 'shock';
      break;
    case 'ankleScramble':
      p.y -= Math.abs(fast) * 18;
      p.tilt = -10 * facing;
      p.headTilt = -8;
      p.armL = { a: -115 + fast * 25, b: -24 };
      p.armR = { a: -95 - fast * 25, b: -32 };
      p.legL = { a: 32 * fast, b: -34 };
      p.legR = { a: -32 * fast, b: -34 };
      p.expr = 'shock';
      break;
    case 'pointMoon':
      p.tilt = -5 * facing;
      p.headTilt = -18;
      p.armL = { a: 16, b: -14 };
      p.armR = { a: -136 + sw * 5, b: -10 };
      p.handR = 'point';
      p.expr = 'happy';
      break;
    case 'thumbTest':
      p.tilt = -2 * facing;
      p.headTilt = -12;
      p.armL = { a: 14, b: -16 };
      p.armR = { a: -86, b: -6 };
      p.handR = 'point';
      p.expr = 'smug';
      break;
    case 'windowGaze':
      p.tilt = 4 * facing;
      p.headTilt = -10;
      p.armL = { a: 24, b: -38 };
      p.armR = { a: -54 + sw * 4, b: -42 };
      p.expr = 'shock';
      break;
    case 'squintTube':
      p.tilt = 5 * facing;
      p.headTilt = -12;
      p.armL = { a: -65, b: -55 };
      p.armR = { a: -78, b: -48 };
      p.expr = 'oops';
      break;
    case 'stoolTip':
      p.tilt = -26 * facing;
      p.headTilt = -18;
      p.armL = { a: -135 + fast * 16, b: -18 };
      p.armR = { a: -120 - fast * 16, b: -22 };
      p.legL = { a: -38, b: 18 };
      p.legR = { a: -22, b: 12 };
      p.expr = 'shock';
      break;
    case 'readBook':
      p.tilt = 6 * facing;
      p.headTilt = 10;
      p.armL = { a: 38, b: -58 };
      p.armR = { a: 42 + sw * 6, b: -62 };
      p.expr = 'happy';
      break;
    case 'towelDrag':
      p.y -= Math.abs(fast) * 10;
      p.tilt = 12 * facing;
      p.headTilt = 6;
      p.armL = { a: 48 + fast * 14, b: -34 };
      p.armR = { a: 32 - fast * 14, b: -42 };
      p.legL = { a: 24 * fast, b: -26 };
      p.legR = { a: -24 * fast, b: -26 };
      p.expr = 'worried';
      break;
    case 'lifeguardPerch':
      p.tilt = 8 * facing;
      p.headTilt = 8;
      p.armL = { a: 44, b: -68 };
      p.armR = { a: 48, b: -72 };
      p.legL = { a: 62, b: -78 };
      p.legR = { a: 58, b: -74 };
      p.expr = 'worried';
      break;
    case 'rowDinghy':
      p.tilt = sw * 8;
      p.headTilt = 4;
      p.armL = { a: 42 + sw * 22, b: -48 };
      p.armR = { a: 46 + sw * 22, b: -52 };
      p.expr = 'oops';
      break;
    case 'sleepMask':
      p.tilt = 10 * facing;
      p.headTilt = 14;
      p.armL = { a: 18, b: -24 };
      p.armR = { a: -42 + sw * 6, b: -56 };
      p.expr = 'tired';
      p.blink = 1;
      break;
    case 'eclipseWatch':
      p.tilt = -6 * facing;
      p.headTilt = -18;
      p.armL = { a: 20, b: -26 };
      p.armR = { a: -72, b: -64 };
      p.glasses = 1;
      p.expr = 'cool';
      break;
    case 'rulerWave':
      p.tilt = -3 * facing;
      p.headTilt = -10;
      p.armL = { a: -68, b: -28 };
      p.armR = { a: -124 + Math.sin(t * 0.08) * 18, b: -18 };
      p.expr = 'happy';
      break;
    case 'rooftopCelebrate':
      p.y -= Math.abs(sw) * 10;
      p.tilt = -4 * facing;
      p.headTilt = -12;
      p.armL = { a: -130 + sw * 12, b: -16 };
      p.armR = { a: -134 - sw * 12, b: -16 };
      p.expr = 'happy';
      break;
  }
  return p;
}

export type SetKind =
  | 'night_beach'
  | 'oval_orbit'
  | 'thumb_sky'
  | 'window_room'
  | 'supermoon_stage'
  | 'silver_park'
  | 'harbour_seawall'
  | 'flooded_street'
  | 'curtain_bedroom'
  | 'eclipse_sky'
  | 'rooftop_nov2026';

export type CharSpec = {
  x: number;
  y?: number;
  pose: PosePreset;
  scale?: number;
  flip?: 1 | -1;
  look?: 'pip' | 'pipHood' | 'mo' | 'sis' | 'suit';
  sunglasses?: boolean;
  sleepMask?: boolean;
  eclipseGlasses?: boolean;
  holdBook?: boolean;
  holdRuler?: boolean;
  holdTowel?: boolean;
  label?: string;
};

export type ClosermoonSceneConfig = {
  id: string;
  set: SetKind;
  setVariant?: string;
  vertical?: boolean;
  cam: { x: number; y: number; z: number };
  camEnd?: { x: number; y: number; z: number };
  pip?: CharSpec;
  mo?: CharSpec;
  extraChar?: CharSpec;
  gauge?: MoonGaugeConfig;
  banner?: { text: string; sub?: string; color?: string; x?: number; y?: number; scale?: number; instant?: boolean };
  chapterCard?: { place: string; sub: string; color?: string; mode?: 'hero' | 'corner' };
  pill?: { label: string; value: string; color?: string; x?: number; y?: number };
  pill2?: { label: string; value: string; color?: string; x?: number; y?: number };
  shortBigNum?: { place: string; bigValue: string; subText: string; color?: string; y?: number };
  titleCard?: { x?: number; y?: number; size?: number };
  endCard?: '16x9' | '9x16';
  fgSilhouettes?: 'none' | 'dunes_low' | 'pier_low' | 'rooftop_low';
};

const RenderCharacter: React.FC<{ spec: CharSpec; t: number; defaultLook: CastName; phase?: number }> = ({
  spec,
  t,
  defaultLook,
  phase = 0,
}) => {
  const floorY = spec.y ?? WORLD_FLOOR_Y;
  const sc = spec.scale ?? 0.92;
  const facing = spec.flip ?? 1;
  const lookKey: CastName = spec.look ?? defaultLook;
  const pose = buildPose(
    spec.pose,
    spec.x,
    floorY,
    sc,
    facing,
    t,
    phase,
    Boolean(spec.sunglasses || spec.eclipseGlasses)
  );

  return (
    <g>
      <Hero look={LOOKS[lookKey]} pose={pose} rimId="rimBlue" shadow={0.85} />

      {/* Fluffy Sleep Mask (+ optional sunglasses on top) for Ch 7 */}
      {spec.sleepMask && (
        <g transform={`translate(${spec.x + facing * 8 * sc} ${pose.y - 184 * sc})`}>
          <rect x={-42 * sc} y={-18 * sc} width={84 * sc} height={34 * sc} rx={16 * sc} fill="#9E7BFF" stroke="#FFE27A" strokeWidth={3} />
          <text y={6 * sc} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={14 * sc} fill="#F6EFE3">
            ZZZ
          </text>
        </g>
      )}

      {/* Open Paperback Book in Pip's hands for Ch 4 */}
      {spec.holdBook && (
        <g transform={`translate(${spec.x + facing * 58 * sc} ${pose.y - 72 * sc}) rotate(${facing * -10})`}>
          <rect x={-36} y={-24} width={72} height={48} rx={6} fill="#F6EFE3" stroke="#181426" strokeWidth={3.5} />
          <line x1={0} y1={-24} x2={0} y2={24} stroke="#FF6A4D" strokeWidth={4} />
          <line x1={-26} y1={-10} x2={-8} y2={-10} stroke="#2B3350" strokeWidth={3} />
          <line x1={8} y1={-10} x2={26} y2={-10} stroke="#2B3350" strokeWidth={3} />
        </g>
      )}

      {/* Rolled Beach Towel in Pip's hands for Ch 5 */}
      {spec.holdTowel && (
        <g transform={`translate(${spec.x + facing * 55 * sc} ${pose.y - 68 * sc}) rotate(14)`}>
          <rect x={-48} y={-14} width={96} height={28} rx={12} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={3} />
        </g>
      )}

      {/* Tiny Wooden Ruler in Pip's hand for Ch 9 */}
      {spec.holdRuler && (
        <g transform={`translate(${spec.x - facing * 54 * sc} ${pose.y - 110 * sc}) rotate(-22)`}>
          <rect x={-10} y={-44} width={20} height={88} rx={4} fill="#F2B33D" stroke="#181426" strokeWidth={3} />
        </g>
      )}

      {spec.label && (
        <g transform={`translate(${spec.x} ${pose.y - 265 * sc})`}>
          <rect x={-115} y={-22} width={230} height={36} rx={12} fill="#0D091C" opacity={0.92} stroke="#FFE27A" strokeWidth={2.2} />
          <text y={3} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={18} fill="#FFE27A" letterSpacing={1.5}>
            {spec.label}
          </text>
        </g>
      )}
    </g>
  );
};

export const ClosermoonSceneShot: React.FC<{ t: number; len: number; cfg: ClosermoonSceneConfig }> = ({
  t,
  len,
  cfg,
}) => {
  const p = easeInOut(clamp(t / Math.max(1, len)));
  const shotNum = parseInt(cfg.id.replace(/\D/g, ''), 10) || 1;
  const cx = cfg.camEnd ? lerp(cfg.cam.x, cfg.camEnd.x, p) : cfg.cam.x;
  const cy = cfg.camEnd ? lerp(cfg.cam.y, cfg.camEnd.y, p) : cfg.cam.y;
  const cz = cfg.camEnd ? lerp(cfg.cam.z, cfg.camEnd.z, p) : cfg.cam.z;

  const isVert = Boolean(cfg.vertical);
  const isLoopFrame = cfg.id === 'S1' || cfg.id === 'S20_end';
  const subtleRot = isLoopFrame ? 0 : ((shotNum * 7) % 9 - 4) * 0.55;
  const baseCam = isVert ? camTV(cx, cy, cz * 1.78) : camT(cx, cy, cz);
  const camTransform = subtleRot !== 0 ? `${baseCam} rotate(${subtleRot} ${cx} ${cy})` : baseCam;

  // Per-shot atmospheric color wash & light shaft so every revisit of a set has a distinct lighting mood
  const moodColors = ['#7FD4FF', '#FFE27A', '#FF8A3D', '#5BE08A', '#A68CFF', '#FF5A4A'];
  const moodCol = moodColors[shotNum % moodColors.length];
  const shaftX = 220 + ((shotNum * 293) % 1480);
  const shaftY = 140 + ((shotNum * 173) % 620);

  // Adjust MoonDistanceGaugeUI coordinates so it never overlaps banners, pills, or frame edges
  const gaugeCfg: MoonGaugeConfig | undefined = cfg.gauge
    ? isVert
      ? { ...cfg.gauge, x: cfg.gauge.x ?? 540, y: cfg.gauge.y ?? 1280, scale: (cfg.gauge.scale ?? 1) * 1.04 }
      : {
          ...cfg.gauge,
          x: Math.max(320, Math.min(1600, cfg.gauge.x ?? 1480)),
          y: Math.max(310, Math.min(720, cfg.gauge.y ?? 360)),
        }
    : undefined;

  return (
    <g>
      <g transform={camTransform}>
        {cfg.set === 'night_beach' && (
          <NightBeachSet
            t={t}
            id={cfg.id}
            variant={
              (cfg.setVariant as 'hook' | 'surge' | 'towel_1' | 'towel_2' | 'lifeguard' | 'ruler_goodbye') || 'hook'
            }
          />
        )}

        {cfg.set === 'oval_orbit' && (
          <OvalOrbitSpaceSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'oval_today' | 'perigee_apogee' | 'halved_orbit' | 'laser_retreat') || 'oval_today'}
          />
        )}

        {cfg.set === 'thumb_sky' && (
          <ThumbAndWindowSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'thumb_normal' | 'thumb_giant') || 'thumb_giant'}
          />
        )}

        {cfg.set === 'window_room' && (
          <ThumbAndWindowSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'window_coin' | 'window_lantern') || 'window_lantern'}
          />
        )}

        {cfg.set === 'supermoon_stage' && (
          <SupermoonStageSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'subtle_14' | 'side_by_side' | 'stool_tip') || 'side_by_side'}
          />
        )}

        {cfg.set === 'silver_park' && (
          <SilverParkAvenueSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'bench_book' | 'streetlights_off' | 'birds_and_cat') || 'bench_book'}
          />
        )}

        {cfg.set === 'harbour_seawall' && (
          <HarbourSeawallSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'climbing_stairs' | 'high_boats' | 'low_mud_flats') || 'climbing_stairs'}
          />
        )}

        {cfg.set === 'flooded_street' && (
          <FloodedCoastStreetSet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'dinghy_street' | 'crab_cafe') || 'dinghy_street'}
          />
        )}

        {cfg.set === 'curtain_bedroom' && (
          <CurtainBedroomSet
            t={t}
            id={cfg.id}
            variant={
              (cfg.setVariant as 'curtain_beam' | 'clothespin_glow' | 'cat_windowsill' | 'window_peek') || 'curtain_beam'
            }
          />
        )}

        {cfg.set === 'eclipse_sky' && (
          <EclipseSkySet
            t={t}
            id={cfg.id}
            variant={(cfg.setVariant as 'racing_rim' | 'eclipse_barely' | 'eclipse_giant') || 'eclipse_giant'}
          />
        )}

        {cfg.set === 'rooftop_nov2026' && (
          <RooftopNov2026Set
            t={t}
            id={cfg.id}
            skyHighlight={
              (cfg.setVariant as
                | 'none'
                | 'mars_jupiter_15_16nov'
                | 'leonids_17_18nov'
                | 'supermoon_24nov'
                | 'three_supermoons') || 'supermoon_24nov'
            }
          />
        )}

        {/* Per-shot atmospheric light pool (skipped on S1/S20_end for exact Short loop lock) */}
        {!isLoopFrame && (
          <g pointerEvents="none">
            <Glow x={shaftX} y={shaftY} r={420} color={moodCol} o={0.22} />
            <polygon
              points={`${shaftX - 180},0 ${shaftX + 180},0 ${shaftX + 420},1080 ${shaftX - 420},1080`}
              fill={moodCol}
              opacity={0.05}
            />
          </g>
        )}

        {cfg.pip && <RenderCharacter spec={cfg.pip} t={t} defaultLook="pipHood" phase={0} />}
        {cfg.mo && <RenderCharacter spec={cfg.mo} t={t} defaultLook="mo" phase={1.6} />}
        {cfg.extraChar && <RenderCharacter spec={cfg.extraChar} t={t} defaultLook="suit" phase={3.1} />}

        {!isVert && cfg.fgSilhouettes === 'dunes_low' && (
          <g fill="#0A0814" opacity={0.85}>
            <ellipse cx={160} cy={1060} rx={250} ry={75} />
            <ellipse cx={1760} cy={1065} rx={260} ry={80} />
          </g>
        )}
        {!isVert && cfg.fgSilhouettes === 'pier_low' && (
          <g fill="#080B14" opacity={0.88}>
            <rect x={-40} y={990} width={440} height={130} rx={20} />
            <rect x={1520} y={990} width={440} height={130} rx={20} />
          </g>
        )}
      </g>

      {/* Screen-Space UI Overlays (Non-overlapping zones) */}
      {gaugeCfg && <MoonDistanceGaugeUI t={t} cfg={gaugeCfg} />}

      {cfg.chapterCard && (
        <LunarChapterCard
          t={t}
          place={cfg.chapterCard.place}
          sub={cfg.chapterCard.sub}
          color={cfg.chapterCard.color}
          mode={cfg.chapterCard.mode}
        />
      )}

      {cfg.banner && (
        <HookBannerCard
          t={t}
          text={cfg.banner.text}
          sub={cfg.banner.sub}
          color={cfg.banner.color}
          x={isVert ? 540 : cfg.banner.x ?? 960}
          y={isVert ? 205 : cfg.banner.y ?? 112}
          scale={isVert ? 1.04 : cfg.banner.scale}
          instant={cfg.banner.instant}
        />
      )}

      {cfg.pill && (
        <TelemetryPill
          t={t}
          label={cfg.pill.label}
          value={cfg.pill.value}
          color={cfg.pill.color}
          x={isVert ? 68 : cfg.pill.x ?? 72}
          y={isVert ? 1560 : cfg.pill.y ?? 920}
          maxWidth={isVert ? 1040 : 1860}
        />
      )}

      {cfg.pill2 && (
        <TelemetryPill
          t={t}
          label={cfg.pill2.label}
          value={cfg.pill2.value}
          color={cfg.pill2.color}
          x={isVert ? 68 : cfg.pill2.x ?? 1180}
          y={isVert ? 1680 : cfg.pill2.y ?? 920}
          maxWidth={isVert ? 1040 : 1860}
        />
      )}

      {cfg.shortBigNum && (
        <ShortBigNumber
          t={t}
          place={cfg.shortBigNum.place}
          bigValue={cfg.shortBigNum.bigValue}
          subText={cfg.shortBigNum.subText}
          color={cfg.shortBigNum.color}
          y={cfg.shortBigNum.y}
        />
      )}

      {cfg.titleCard && (
        <ClosermoonTitleCard
          t={t}
          x={isVert ? 540 : cfg.titleCard.x}
          y={isVert ? 320 : cfg.titleCard.y}
          size={isVert ? 82 : cfg.titleCard.size}
        />
      )}

      {cfg.endCard === '16x9' && <ClosermoonEndCard16x9 t={t} />}
      {cfg.endCard === '9x16' && <ClosermoonShortEndCard9x16 t={t} />}
    </g>
  );
};

export type DiagramMode =
  | 'nasa_moon_facts'
  | 'oval_orbit_perigee_apogee'
  | 'halved_192200_area4x'
  | 'supermoon_14_vs_100'
  | 'inverse_cube_tides_8x'
  | 'high_vs_low_tide'
  | 'orbit_27d_eclipse'
  | 'laser_1inch_retreat'
  | 'nov2026_mars_jupiter'
  | 'nov2026_leonids_15hr'
  | 'nov2026_three_supermoons';

export type ClosermoonDiagramConfig = {
  id: string;
  mode: DiagramMode;
  variant?: number;
  vertical?: boolean;
  title: string;
  subtitle?: string;
  accentColor?: string;
  cam?: { x: number; y: number; z: number };
  camEnd?: { x: number; y: number; z: number };
  pill?: { label: string; value: string; color?: string; x?: number; y?: number };
  shortBigNum?: { place: string; bigValue: string; subText: string; color?: string; y?: number };
  gauge?: MoonGaugeConfig;
};

/**
 * Animated Cosmic Blueprint / Schematic Diagram Renderer for Closermoon Science & Comparison Beats.
 */
export const ClosermoonDiagramShot: React.FC<{ t: number; len: number; cfg: ClosermoonDiagramConfig }> = ({
  t,
  len,
  cfg,
}) => {
  const p = easeInOut(clamp(t / Math.max(1, len)));
  const shotNum = parseInt(cfg.id.replace(/\D/g, ''), 10) || 1;
  const cx = cfg.camEnd && cfg.cam ? lerp(cfg.cam.x, cfg.camEnd.x, p) : cfg.cam?.x ?? 960;
  const cy = cfg.camEnd && cfg.cam ? lerp(cfg.cam.y, cfg.camEnd.y, p) : cfg.cam?.y ?? 540;
  const cz = cfg.camEnd && cfg.cam ? lerp(cfg.cam.z, cfg.camEnd.z, p) : cfg.cam?.z ?? 1;
  const col = cfg.accentColor ?? '#7FD4FF';
  const v = cfg.variant ?? 0;
  const pop = lerp(0.9, 1, backOut(clamp((t + 2) / 8)));
  const isVert = Boolean(cfg.vertical);
  const diagTransform = isVert ? camTV(cx, cy, cz * 0.92) : camT(cx, cy, cz);
  const bgPalettes = ['#090D1C', '#140B24', '#081822', '#1C0E18', '#0C1A18', '#16122B'];
  const bgCol = bgPalettes[(shotNum + v) % bgPalettes.length];

  return (
    <g>
      {isVert && <rect width={1080} height={1920} fill={bgCol} />}
      <g transform={diagTransform}>
        <rect x={-400} y={-500} width={2720} height={2080} fill={bgCol} />
        <Glow x={320 + ((shotNum * 310) % 1280)} y={260 + ((shotNum * 190) % 540)} r={460} color={col} o={0.26} />
        <g stroke="#1C2747" strokeWidth={1.5} opacity={0.65}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`gv${i}`} x1={i * 120} y1={-400} x2={i * 120} y2={1480} />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`gh${i}`} x1={-200} y1={i * 108 - 200} x2={2120} y2={i * 108 - 200} />
          ))}
        </g>
        <Stars t={t} n={55} />

        {/* Header title bar */}
        <g transform={`translate(960 112) scale(${pop})`}>
          <rect x={-580} y={-52} width={1160} height={104} rx={26} fill="#0E1428" stroke={col} strokeWidth={4} />
          <text
            y={cfg.subtitle ? -6 : 12}
            textAnchor="middle"
            fontFamily={FONT.title}
            fontWeight={800}
            fontSize={38}
            fill="#F6EFE3"
            letterSpacing={2.2}
          >
            {cfg.title}
          </text>
          {cfg.subtitle && (
            <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill={col} letterSpacing={2}>
              {cfg.subtitle}
            </text>
          )}
        </g>

        {/* MODE 1: NASA Moon Facts (384,400 km / 238,855 mi, radius 1,740 km, 27 days) */}
        {cfg.mode === 'nasa_moon_facts' && (
          <g transform="translate(960 555)">
            <circle cx={-560} cy={-20} r={86} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <text x={-560} y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#9ED4FF">
              EARTH
            </text>
            <line x1={-450} y1={-20} x2={460} y2={-20} stroke="#FFE27A" strokeWidth={6} strokeDasharray="18 10" />
            <text x={0} y={-52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#FFE27A">
              AVERAGE DISTANCE: 384,400 KM (238,855 MI)
            </text>
            <GiantMoonProp x={560} y={-20} r={68} t={t} tint="silver" />
            <rect x={-560} y={155} width={1120} height={96} rx={24} fill="#10182E" stroke={col} strokeWidth={3.5} />
            <text x={0} y={214} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#7FD4FF">
              RADIUS: 1,740 KM · ORBITS EARTH IN 27 DAYS · DRIFTS ~1 INCH/YR
            </text>
          </g>
        )}

        {/* MODE 2: Slightly Oval Orbit (Perigee ~363,300 km vs Apogee ~405,500 km) */}
        {cfg.mode === 'oval_orbit_perigee_apogee' && (
          <g transform="translate(960 555)">
            <ellipse cx={40} cy={-10} rx={520} ry={220} fill="none" stroke="#7FD4FF" strokeWidth={5} strokeDasharray="16 10" />
            <circle cx={-60} cy={-10} r={62} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <circle cx={-480} cy={-10} r={42} fill="#F2EFE6" stroke="#5BE08A" strokeWidth={4} />
            <text x={-480} y={-76} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#5BE08A">
              PERIGEE: ~363,300 KM (226,000 MI)
            </text>
            <circle cx={560} cy={-10} r={34} fill="#C9C4B8" stroke="#FF8A3D" strokeWidth={4} />
            <text x={560} y={-76} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FF8A3D">
              APOGEE: ~405,500 KM (251,000 MI)
            </text>
          </g>
        )}

        {/* MODE 3: Halved Distance (192,200 km -> Width x2, Area x4) */}
        {cfg.mode === 'halved_192200_area4x' && (
          <g transform="translate(960 555)">
            <g transform="translate(-380 -10)">
              <rect x={-280} y={-210} width={560} height={410} rx={30} fill="#11182E" stroke="#7FD4FF" strokeWidth={3.5} />
              <circle cx={0} cy={-35} r={68} fill="#D6DFEE" stroke="#7FD4FF" strokeWidth={4} />
              <text y={88} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#7FD4FF">
                TODAY: 384,400 KM
              </text>
              <text y={138} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#F6EFE3">
                WIDTH x1 · SKY AREA x1
              </text>
            </g>
            <g transform="translate(380 -10)">
              <rect x={-280} y={-210} width={560} height={410} rx={30} fill="#1A1530" stroke="#FFE27A" strokeWidth={4} />
              <circle cx={0} cy={-35} r={136} fill="#FFF2B8" stroke="#FFE27A" strokeWidth={5} />
              <text y={136} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFE27A">
                2X CLOSER: ABOUT 192,200 KM
              </text>
              <text y={176} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#5BE08A">
                WIDTH x2 (100% WIDER) · AREA x4
              </text>
            </g>
          </g>
        )}

        {/* MODE 4: Supermoon Reality Check (+14% bigger / +30% brighter vs +100% wider) */}
        {cfg.mode === 'supermoon_14_vs_100' && (
          <g transform="translate(960 555)">
            {[
              { x: -490, r: 58, t1: 'FAINTEST FULL MOON', t2: 'APOGEE ~405,500 KM', c: '#8E9BB2' },
              { x: -40, r: 66, t1: 'NASA SUPERMOON', t2: 'UP TO 14% BIGGER · 30% BRIGHTER', c: '#7FD4FF' },
              { x: 470, r: 132, t1: '2X CLOSER MOON', t2: 'ABOUT 100% WIDER · AREA x4', c: '#FFE27A' },
            ].map((item, idx) => (
              <g key={idx} transform={`translate(${item.x} 0)`}>
                <rect x={-215} y={-215} width={430} height={420} rx={28} fill="#12172C" stroke={item.c} strokeWidth={4} />
                <circle cx={0} cy={-35} r={item.r} fill={idx === 2 ? '#FFF2B8' : '#DCE4F2'} stroke={item.c} strokeWidth={4.5} />
                <text y={125} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#F6EFE3">
                  {item.t1}
                </text>
                <text y={165} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill={item.c}>
                  {item.t2}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* MODE 5: Inverse-Cube Tides (1/d^3 -> About 8x Pull) */}
        {cfg.mode === 'inverse_cube_tides_8x' && (
          <g transform="translate(960 555)">
            <rect x={-660} y={-225} width={1320} height={450} rx={34} fill="#0E172E" stroke={col} strokeWidth={4} />
            <text y={-135} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FFE27A">
              INVERSE-CUBE TIDAL LAW: PULL ∝ 1 / DISTANCE³
            </text>
            <g transform="translate(-320 35)">
              <rect x={-250} y={-95} width={500} height={190} rx={24} fill="#162342" stroke="#7FD4FF" strokeWidth={3.5} />
              <text y={-22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#7FD4FF">
                TODAY: 384,400 KM
              </text>
              <text y={42} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3">
                TIDAL PULL = 1X
              </text>
            </g>
            <g transform="translate(320 35)">
              <rect x={-250} y={-95} width={500} height={190} rx={24} fill="#241938" stroke="#FF8A3D" strokeWidth={4} />
              <text y={-22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#FFE27A">
                HALF: ABOUT 192,200 KM
              </text>
              <text y={42} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#5BE08A">
                PULL = ABOUT 8X STRONGER
              </text>
            </g>
          </g>
        )}

        {/* MODE 6: High Tide vs Extreme Low Tide Coast Comparison */}
        {cfg.mode === 'high_vs_low_tide' && (
          <g transform="translate(960 555)">
            <g transform="translate(-360 0)">
              <rect x={-310} y={-205} width={620} height={410} rx={28} fill="#10223D" stroke="#7FD4FF" strokeWidth={4} />
              <rect x={-270} y={-30} width={540} height={140} rx={14} fill="#1E5B94" />
              <text y={-95} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFE27A">
                HIGH TIDE (PULL x8)
              </text>
              <text y={155} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#7FD4FF">
                LOW COASTAL STREETS FLOODED
              </text>
            </g>
            <g transform="translate(360 0)">
              <rect x={-310} y={-205} width={620} height={410} rx={28} fill="#241B16" stroke="#FF8A3D" strokeWidth={4} />
              <rect x={-270} y={40} width={540} height={70} rx={14} fill="#5C4332" />
              <text y={-95} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FF8A3D">
                LOW TIDE RETREAT
              </text>
              <text y={155} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#FFE27A">
                HARBOUR BOATS ON MUD FLATS
              </text>
            </g>
          </g>
        )}

        {/* MODE 7: 27-Day Orbit & Giant Solar Eclipse */}
        {cfg.mode === 'orbit_27d_eclipse' && (
          <g transform="translate(960 555)">
            <Glow x={0} y={-25} r={340} color="#FFB84D" o={0.55} />
            <circle cx={0} cy={-25} r={92} fill="#FFF2B2" stroke="#FF8A3D" strokeWidth={6} />
            <circle cx={0} cy={-25} r={184} fill="#0B0918" stroke="#FFE27A" strokeWidth={5} />
            <circle cx={0} cy={-25} r={92} fill="none" stroke="#7FD4FF" strokeWidth={3.5} strokeDasharray="10 8" />
            <text y={215} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#FFE27A">
              27-DAY ORBIT · 2X WIDER MOON COVERS FAR MORE THAN THE SUN
            </text>
          </g>
        )}

        {/* MODE 8: Reality: Moon Drifting ~1 Inch Farther Per Year */}
        {cfg.mode === 'laser_1inch_retreat' && (
          <g transform="translate(960 555)">
            <circle cx={-560} cy={0} r={78} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <line x1={-465} y1={0} x2={465} y2={0} stroke="#5BE08A" strokeWidth={6} strokeDasharray="18 10" />
            <GiantMoonProp x={560} y={0} r={58} t={t} tint="silver" showLaser={true} />
            <rect x={-480} y={-165} width={960} height={96} rx={24} fill="#101A2E" stroke="#5BE08A" strokeWidth={4} />
            <text y={-105} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#5BE08A">
              NASA LASER RANGING: DRIFTS ~1 INCH FARTHER / YEAR
            </text>
            <text y={155} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#FFE27A">
              AVERAGE 384,400 KM · RADIUS 1,740 KM · MOVING AWAY, NOT CLOSER
            </text>
          </g>
        )}

        {/* MODE 9: 15-16 Nov Mars and Jupiter 1.2 Degrees Apart */}
        {cfg.mode === 'nov2026_mars_jupiter' && (
          <g transform="translate(960 555)">
            <rect x={-620} y={-210} width={1240} height={420} rx={32} fill="#12182E" stroke="#FF8A3D" strokeWidth={4} />
            <circle cx={-120} cy={-20} r={34} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={4} />
            <text x={-120} y={55} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FF9A8A">
              MARS
            </text>
            <circle cx={120} cy={-20} r={54} fill="#FFF0C2" stroke="#F2B33D" strokeWidth={4} />
            <text x={120} y={55} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FFE27A">
              JUPITER
            </text>
            <line x1={-75} y1={-20} x2={55} y2={-20} stroke="#7FD4FF" strokeWidth={5} />
            <text x={0} y={-115} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFE27A">
              15–16 NOV 2026 · JUST 1.2 DEGREES APART BEFORE SUNRISE
            </text>
          </g>
        )}

        {/* MODE 10: 17-18 Nov Leonid Meteor Shower (~15 per hour after moonset) */}
        {cfg.mode === 'nov2026_leonids_15hr' && (
          <g transform="translate(960 555)">
            <rect x={-620} y={-210} width={1240} height={420} rx={32} fill="#0E152B" stroke="#7FD4FF" strokeWidth={4} />
            {[-280, 0, 280].map((mx, idx) => (
              <g key={idx}>
                <line x1={mx - 120} y1={-90} x2={mx + 95} y2={25} stroke="#FFE27A" strokeWidth={6} strokeLinecap="round" />
                <circle cx={mx + 95} cy={25} r={9} fill="#FFFFFF" />
              </g>
            ))}
            <text y={115} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#7FD4FF">
              17–18 NOV 2026 · LEONID METEORS AFTER MOONSET
            </text>
            <text y={168} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill="#FFE27A">
              PEAK RATE: UP TO ~15 METEORS PER HOUR (NASA WHAT’S UP)
            </text>
          </g>
        )}

        {/* MODE 11: 24 Nov 2026 Supermoon (14:54 UTC, First of Three in a Row: Nov, Dec, Jan) */}
        {cfg.mode === 'nov2026_three_supermoons' && (
          <g transform="translate(960 555)">
            {[
              { x: -450, date: '24 NOV 2026', sub: '14:54 UTC · SUPERMOON #1', c: '#FFE27A' },
              { x: 0, date: '24 DEC 2026', sub: 'DECEMBER · SUPERMOON #2', c: '#7FD4FF' },
              { x: 450, date: 'JANUARY', sub: 'THIRD IN A ROW · #3', c: '#5BE08A' },
            ].map((card, i) => (
              <g key={i} transform={`translate(${card.x} 0)`}>
                <rect x={-205} y={-195} width={410} height={380} rx={28} fill="#12182E" stroke={card.c} strokeWidth={4} />
                <circle cx={0} cy={-45} r={66} fill="#FFF2B8" stroke={card.c} strokeWidth={4.5} />
                <text y={78} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3">
                  {card.date}
                </text>
                <text y={128} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill={card.c}>
                  {card.sub}
                </text>
              </g>
            ))}
          </g>
        )}
      </g>

      {cfg.gauge && <MoonDistanceGaugeUI t={t} cfg={cfg.gauge} />}
      {cfg.shortBigNum && (
        <ShortBigNumber
          t={t}
          place={cfg.shortBigNum.place}
          bigValue={cfg.shortBigNum.bigValue}
          subText={cfg.shortBigNum.subText}
          color={cfg.shortBigNum.color}
          y={cfg.shortBigNum.y}
        />
      )}
      {cfg.pill && (
        <TelemetryPill
          t={t}
          label={cfg.pill.label}
          value={cfg.pill.value}
          color={cfg.pill.color}
          x={cfg.pill.x ?? 72}
          y={cfg.pill.y ?? 920}
        />
      )}
    </g>
  );
};
