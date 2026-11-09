import React from 'react';
import {
  FONT,
  Glow as EngineGlow,
  Stars as EngineStars,
  NightSky as EngineNightSky,
  Kitchen,
  KitchenIsland,
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

const NightSky: React.FC<{ id: string }> = ({ id }) => <EngineNightSky id={id} horizonY={880} />;

const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 85 }) => (
  <EngineStars seed={23} x0={-200} y0={-200} w={2320} h={1180} t={t} n={n} />
);
import {
  LightdayTitleCard,
  DistanceChapterCard,
  HookBannerCard,
  TelemetryPill,
  ShortBigNumber,
  PhoneChatUI,
  PhoneUIConfig,
  LightdayEndCard16x9,
  LightdayShortEndCard9x16,
} from './cards';
import {
  WORLD_FLOOR_Y,
  VoyagerProbeProp,
  GoldenRecordDiscProp,
  LightdayBedroomSet,
  MoonBaseSet,
  MarsColonySet,
  NeptuneDiningSet,
  MissionControlDeskSet,
  DeepCosmosSet,
  RooftopNov2026Set,
} from './sets';

export type PosePreset =
  | 'phoneLook'
  | 'phoneHoldHigh'
  | 'phoneTapFast'
  | 'phonePanic'
  | 'phoneShrug'
  | 'phoneSleep'
  | 'waveHi'
  | 'pointSky'
  | 'sunglassesCool'
  | 'makeSandwich'
  | 'eatMeal'
  | 'engineerDesk'
  | 'ageKid'
  | 'ageAdult'
  | 'celebrate'
  | 'talkOver';

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
  const fast = Math.sin(t * 0.42 + phase);
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
    case 'phoneLook':
      p.tilt = 4 * facing;
      p.headTilt = 8;
      p.armL = { a: 22, b: -45 };
      p.armR = { a: 36, b: -68 + sw * 4 };
      p.expr = 'neutral';
      break;
    case 'phoneHoldHigh':
      p.tilt = -2 * facing;
      p.headTilt = -6;
      p.armL = { a: 18, b: -20 };
      p.armR = { a: -58 + sw * 5, b: -38 };
      p.handR = 'point';
      p.expr = 'shock';
      break;
    case 'phoneTapFast':
      p.tilt = 6 * facing;
      p.headTilt = 6;
      p.armL = { a: 34 + fast * 10, b: -62 - fast * 12 };
      p.armR = { a: 38 - fast * 10, b: -66 + fast * 12 };
      p.expr = 'happy';
      break;
    case 'phonePanic':
      p.y -= Math.abs(fast) * 14;
      p.tilt = sw * 10;
      p.headTilt = -sw * 12;
      p.armL = { a: -125 + fast * 22, b: -25 };
      p.armR = { a: -125 - fast * 22, b: -25 };
      p.legL = { a: 18 * fast, b: -20 };
      p.legR = { a: -18 * fast, b: -20 };
      p.expr = 'shock';
      break;
    case 'phoneShrug':
      p.tilt = -3 * facing;
      p.headTilt = 10;
      p.armL = { a: -48 + sw * 5, b: -42 };
      p.armR = { a: -48 - sw * 5, b: -42 };
      p.expr = 'oops';
      break;
    case 'phoneSleep':
      p.tilt = 14 * facing;
      p.headTilt = 20;
      p.armL = { a: 12, b: -10 };
      p.armR = { a: 28, b: -50 };
      p.expr = 'tired';
      p.blink = 1;
      break;
    case 'waveHi':
      p.tilt = -2 * facing;
      p.headTilt = -4;
      p.armL = { a: 16, b: -14 };
      p.armR = { a: -118 + fast * 18, b: -22 + fast * 14 };
      p.expr = 'happy';
      break;
    case 'pointSky':
      p.tilt = -5 * facing;
      p.headTilt = -16;
      p.armL = { a: 18, b: -16 };
      p.armR = { a: -138, b: -8 };
      p.handR = 'point';
      p.expr = 'shock';
      break;
    case 'sunglassesCool':
      p.tilt = -7 * facing;
      p.headTilt = -4;
      p.armL = { a: 28, b: -65 };
      p.armR = { a: 28, b: -65 };
      p.expr = 'cool';
      p.glasses = 1;
      break;
    case 'makeSandwich':
      p.tilt = 7 * facing;
      p.headTilt = 10;
      p.armL = { a: 42 + fast * 10, b: -54 };
      p.armR = { a: 42 - fast * 10, b: -54 };
      p.expr = 'happy';
      break;
    case 'eatMeal':
      p.tilt = 5 * facing;
      p.headTilt = 6;
      p.armL = { a: 28, b: -44 };
      p.armR = { a: 48 + sw * 14, b: -74 + sw * 12 };
      p.expr = 'happy';
      break;
    case 'engineerDesk':
      p.tilt = 4 * facing;
      p.headTilt = sw * 14;
      p.armL = { a: 38, b: -58 + sw * 8 };
      p.armR = { a: 38, b: -58 - sw * 8 };
      p.expr = 'smug';
      break;
    case 'ageKid':
      p.tilt = 2 * facing;
      p.headTilt = -6;
      p.armL = { a: 24, b: -32 };
      p.armR = { a: -54, b: -38 };
      p.expr = 'happy';
      break;
    case 'ageAdult':
      p.tilt = 6 * facing;
      p.headTilt = 4;
      p.armL = { a: 16, b: -24 };
      p.armR = { a: 34, b: -58 };
      p.expr = 'tired';
      break;
    case 'celebrate':
      p.y -= Math.abs(sw) * 12;
      p.tilt = -4 * facing;
      p.headTilt = -8;
      p.armL = { a: -135 + sw * 14, b: -16 };
      p.armR = { a: -135 - sw * 14, b: -16 };
      p.expr = 'happy';
      break;
    case 'talkOver':
      p.tilt = 8 * facing;
      p.headTilt = -4;
      p.armL = { a: -52 + fast * 14, b: -36 };
      p.armR = { a: -64 - fast * 14, b: -38 };
      p.expr = Math.abs(fast) > 0.4 ? 'shock' : 'oops';
      break;
  }
  return p;
}

export type SetKind =
  | 'bedroom'
  | 'bedroom_sunrise'
  | 'moon'
  | 'mars'
  | 'kitchen'
  | 'conjunction'
  | 'neptune'
  | 'lightday_ring'
  | 'voyager_space'
  | 'dsn_desk'
  | 'golden_record'
  | 'star_ac79'
  | 'proxima'
  | 'andromeda'
  | 'crab_future'
  | 'voyager2_twist'
  | 'rooftop';

export type CharSpec = {
  x: number;
  y?: number;
  pose: PosePreset;
  scale?: number;
  flip?: 1 | -1;
  look?: 'pip' | 'pipHood' | 'bo' | 'kid' | 'prof';
  helmet?: boolean;
  holdPhone?: boolean;
  sunglasses?: boolean;
  label?: string;
};

export type LightdaySceneConfig = {
  id: string;
  set: SetKind;
  setVariant?: string;
  vertical?: boolean;
  cam: { x: number; y: number; z: number };
  camEnd?: { x: number; y: number; z: number };
  pip?: CharSpec;
  bo?: CharSpec;
  extraChar?: CharSpec;
  phone?: PhoneUIConfig;
  banner?: { text: string; sub?: string; color?: string; x?: number; y?: number; scale?: number; instant?: boolean };
  chapterCard?: { place: string; sub: string; color?: string; mode?: 'hero' | 'corner' };
  pill?: { label: string; value: string; color?: string; x?: number; y?: number };
  pill2?: { label: string; value: string; color?: string; x?: number; y?: number };
  shortBigNum?: { place: string; bigValue: string; subText: string; color?: string; y?: number };
  titleCard?: { x?: number; y?: number; size?: number };
  endCard?: '16x9' | '9x16';
  voyagerProp?: {
    x: number;
    y: number;
    scale?: number;
    rot?: number;
    highlightRecord?: boolean;
    label?: string;
    pulseColor?: string;
  };
  signalBeam?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color?: string;
    label?: string;
    blocked?: boolean;
  };
  fgSilhouettes?: 'none' | 'desk_left' | 'rocks_low' | 'railing_low' | 'console_low';
};

function mapLookKey(raw: CharSpec['look'], fallback: CastName): CastName {
  if (!raw) return fallback;
  if (raw === 'kid') return 'sis';
  if (raw === 'prof') return 'suit';
  return raw;
}

const RenderCharacter: React.FC<{ spec: CharSpec; t: number; defaultLook: CastName; phase?: number }> = ({
  spec,
  t,
  defaultLook,
  phase = 0,
}) => {
  const floorY = spec.y ?? WORLD_FLOOR_Y;
  const sc = spec.scale ?? 0.92;
  const facing = spec.flip ?? 1;
  const lookKey = mapLookKey(spec.look, defaultLook);
  const pose = buildPose(spec.pose, spec.x, floorY, sc, facing, t, phase, spec.sunglasses);

  return (
    <g>
      <Hero look={LOOKS[lookKey]} pose={pose} rimId="rimR" shadow={0.85} />
      {/* Space helmet bubble for Moon / Mars / Neptune */}
      {spec.helmet ? (
        <g transform={`translate(${spec.x} ${pose.y - 176 * sc})`}>
          <circle cx={0} cy={0} r={76 * sc} fill="#7FD4FF" opacity={0.18} />
          <circle cx={0} cy={0} r={76 * sc} fill="none" stroke="#9ED4FF" strokeWidth={4.5} />
          <path
            d={`M ${-46 * sc} ${-30 * sc} Q ${-12 * sc} ${-56 * sc} ${28 * sc} ${-36 * sc}`}
            stroke="#FFFFFF"
            strokeWidth={3.5}
            fill="none"
            opacity={0.75}
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {/* Mini glowing phone in character's hand */}
      {spec.holdPhone ? (
        <g transform={`translate(${spec.x + facing * 64 * sc} ${pose.y - 78 * sc}) rotate(${facing * -15})`}>
          <Glow x={0} y={0} r={55} color="#7FD4FF" o={0.45} />
          <rect x={-14} y={-24} width={28} height={48} rx={6} fill="#141024" stroke="#7FD4FF" strokeWidth={3} />
          <rect x={-10} y={-18} width={20} height={34} rx={3} fill="#7FD4FF" opacity={0.85} />
        </g>
      ) : null}
      {spec.label ? (
        <g transform={`translate(${spec.x} ${pose.y - 265 * sc})`}>
          <rect x={-105} y={-22} width={210} height={36} rx={12} fill="#0D091C" opacity={0.92} stroke="#FFE27A" strokeWidth={2.2} />
          <text y={3} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={18} fill="#FFE27A" letterSpacing={1.5}>
            {spec.label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

export const LightdaySceneShot: React.FC<{ t: number; len: number; cfg: LightdaySceneConfig }> = ({ t, len, cfg }) => {
  const p = easeInOut(clamp(t / Math.max(1, len)));
  const shotNum = parseInt(cfg.id.replace(/\D/g, ''), 10) || 1;
  const cx = cfg.camEnd ? lerp(cfg.cam.x, cfg.camEnd.x, p) : cfg.cam.x;
  const cy = cfg.camEnd ? lerp(cfg.cam.y, cfg.camEnd.y, p) : cfg.cam.y;
  const cz = cfg.camEnd ? lerp(cfg.cam.z, cfg.camEnd.z, p) : cfg.cam.z;

  const isVert = Boolean(cfg.vertical);
  // Keep S1 and S20_end unrotated so the Short loop frame is 100% identical to Frame 0
  const isLoopFrame = cfg.id === 'S1' || cfg.id === 'S20_end';
  const subtleRot = isLoopFrame ? 0 : ((shotNum * 7) % 9 - 4) * 0.65;
  const baseCam = isVert ? camTV(cx, cy, cz * 1.78) : camT(cx, cy, cz);
  const camTransform = subtleRot !== 0 ? `${baseCam} rotate(${subtleRot} ${cx} ${cy})` : baseCam;

  // Per-shot atmospheric color wash & light shaft angle so every revisit of a set has a distinct lighting mood
  const moodColors = ['#7FD4FF', '#FFE27A', '#FF8A3D', '#5BE08A', '#A68CFF', '#FF5A4A'];
  const moodCol = moodColors[shotNum % moodColors.length];
  const shaftX = 220 + ((shotNum * 293) % 1480);
  const shaftY = 140 + ((shotNum * 173) % 620);

  // Adjust Phone & Banner coordinates when in 9:16 vertical mode (1080x1920)
  const phoneCfg: PhoneUIConfig | undefined = cfg.phone
    ? isVert
      ? { ...cfg.phone, x: cfg.phone.x ?? 600, y: cfg.phone.y ?? 1160, scale: (cfg.phone.scale ?? 1) * 1.12 }
      : cfg.phone
    : undefined;

  return (
    <g>
      <g transform={camTransform}>
        {/* World Set Background */}
        {cfg.set === 'bedroom' ? (
          <LightdayBedroomSet
            t={t}
            id={cfg.id}
            sunrise={false}
            blackoutAlert={cfg.setVariant === 'blackout'}
            clockText={cfg.setVariant === 'instant' ? '00:00' : '48:00'}
            suitcase={cfg.setVariant === 'suitcase'}
          />
        ) : null}

        {cfg.set === 'bedroom_sunrise' ? (
          <LightdayBedroomSet
            t={t}
            id={cfg.id}
            sunrise={true}
            sunShades={cfg.setVariant === 'shades'}
            suitcase={cfg.setVariant === 'suitcase'}
            clockText="08:20"
          />
        ) : null}

        {cfg.set === 'moon' ? (
          <MoonBaseSet t={t} id={cfg.id} signalPulse={cfg.setVariant !== 'nopulse'} />
        ) : null}

        {cfg.set === 'mars' ? (
          <MarsColonySet t={t} id={cfg.id} conjunctionBlackout={false} />
        ) : null}

        {cfg.set === 'conjunction' ? (
          <MarsColonySet t={t} id={cfg.id} conjunctionBlackout={true} />
        ) : null}

        {cfg.set === 'kitchen' ? (
          <g>
            <Kitchen t={t} id={cfg.id} />
            {/* Pip stands behind the island */}
            {cfg.pip ? <RenderCharacter spec={cfg.pip} t={t} defaultLook="pipHood" /> : null}
            <KitchenIsland />
            {/* Giant multi-decker Mars-delay sandwich on the kitchen counter */}
            <g transform="translate(860 555)">
              <ellipse cx={0} cy={12} rx={95} ry={16} fill="#F6EFE3" stroke="#1D2033" strokeWidth={4} />
              {Array.from({ length: cfg.setVariant === 'tall' ? 7 : 4 }).map((_, k) => (
                <g key={k} transform={`translate(0 ${-k * 16})`}>
                  <rect
                    x={-58}
                    y={-12}
                    width={116}
                    height={14}
                    rx={5}
                    fill={k % 2 === 0 ? '#E5A948' : '#5BE08A'}
                    stroke="#1D2033"
                    strokeWidth={2.5}
                  />
                </g>
              ))}
              {/* Olive on toothpick */}
              <line x1={0} y1={-120} x2={0} y2={-60} stroke="#FFE27A" strokeWidth={3} />
              <circle cx={0} cy={-122} r={9} fill="#5BE08A" stroke="#1D2033" strokeWidth={2.5} />
            </g>
          </g>
        ) : null}

        {cfg.set === 'neptune' ? (
          <NeptuneDiningSet
            t={t}
            id={cfg.id}
            meal={(cfg.setVariant as 'space' | 'breakfast' | 'lunch' | 'dinner') || 'space'}
          />
        ) : null}

        {cfg.set === 'dsn_desk' ? (
          <MissionControlDeskSet t={t} id={cfg.id} ackReceived={cfg.setVariant === 'ack'} />
        ) : null}

        {cfg.set === 'voyager_space' ? (
          <g>
            <NightSky id={`vs_${cfg.id}`} />
            <Stars t={t} n={115} />
            {/* Distant pale Sun on left */}
            <Glow x={240} y={320} r={140} color="#FFE27A" o={0.35} />
            <circle cx={240} cy={320} r={22} fill="#FFF2B2" />
            <text x={240} y={368} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#FFE27A">
              SUN · 1 LIGHT-DAY
            </text>
          </g>
        ) : null}

        {cfg.set === 'lightday_ring' ||
        cfg.set === 'golden_record' ||
        cfg.set === 'star_ac79' ||
        cfg.set === 'proxima' ||
        cfg.set === 'andromeda' ||
        cfg.set === 'crab_future' ||
        cfg.set === 'voyager2_twist' ? (
          <DeepCosmosSet t={t} id={cfg.id} mode={cfg.set} gag={cfg.setVariant} />
        ) : null}

        {cfg.set === 'rooftop' ? (
          <RooftopNov2026Set
            t={t}
            id={cfg.id}
            skyHighlight={
              (cfg.setVariant as 'none' | 'voyager_17nov' | 'leonids_17_18nov' | 'mars_jupiter_15_16nov') || 'none'
            }
          />
        ) : null}

        {/* Optional Signal Beam in World Space */}
        {cfg.signalBeam ? (
          <g>
            <line
              x1={cfg.signalBeam.x1}
              y1={cfg.signalBeam.y1}
              x2={cfg.signalBeam.x2}
              y2={cfg.signalBeam.y2}
              stroke={cfg.signalBeam.color ?? '#7FD4FF'}
              strokeWidth={5}
              strokeDasharray="18 12"
            />
            {(() => {
              const bp = (t * 0.04) % 1;
              const bx = lerp(cfg.signalBeam.x1, cfg.signalBeam.x2, bp);
              const by = lerp(cfg.signalBeam.y1, cfg.signalBeam.y2, bp);
              return (
                <g transform={`translate(${bx} ${by})`}>
                  <Glow x={0} y={0} r={65} color={cfg.signalBeam.color ?? '#FFE27A'} o={0.6} />
                  <circle cx={0} cy={0} r={14} fill="#FFE27A" stroke="#FFFFFF" strokeWidth={3} />
                  {cfg.signalBeam.label ? (
                    <text y={-24} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#FFE27A">
                      {cfg.signalBeam.label}
                    </text>
                  ) : null}
                </g>
              );
            })()}
          </g>
        ) : null}

        {/* Optional Voyager Probe Prop in World Space */}
        {cfg.voyagerProp ? (
          <VoyagerProbeProp
            x={cfg.voyagerProp.x}
            y={cfg.voyagerProp.y}
            scale={cfg.voyagerProp.scale}
            rot={cfg.voyagerProp.rot}
            t={t}
            highlightRecord={cfg.voyagerProp.highlightRecord}
            label={cfg.voyagerProp.label}
            pulseColor={cfg.voyagerProp.pulseColor}
          />
        ) : null}

        {/* Per-shot atmospheric rim & cosmic light pool (skipped on S1/S20_end for exact loop lock) */}
        {!isLoopFrame ? (
          <g pointerEvents="none">
            <Glow x={shaftX} y={shaftY} r={420} color={moodCol} o={0.24} />
            <polygon
              points={`${shaftX - 180},0 ${shaftX + 180},0 ${shaftX + 420},1080 ${shaftX - 420},1080`}
              fill={moodCol}
              opacity={0.055}
            />
          </g>
        ) : null}

        {/* Characters (except kitchen where Pip is behind the island) */}
        {cfg.set !== 'kitchen' && cfg.pip ? (
          <RenderCharacter spec={cfg.pip} t={t} defaultLook="pipHood" phase={0} />
        ) : null}
        {cfg.bo ? <RenderCharacter spec={cfg.bo} t={t} defaultLook="bo" phase={1.7} /> : null}
        {cfg.extraChar ? <RenderCharacter spec={cfg.extraChar} t={t} defaultLook="suit" phase={3.1} /> : null}

        {/* Foreground parallax silhouettes for depth */}
        {!isVert && cfg.fgSilhouettes === 'rocks_low' ? (
          <g fill="#0A0814" opacity={0.85}>
            <ellipse cx={160} cy={1060} rx={240} ry={75} />
            <ellipse cx={1760} cy={1065} rx={260} ry={80} />
          </g>
        ) : null}
        {!isVert && cfg.fgSilhouettes === 'console_low' ? (
          <g fill="#080B14" opacity={0.9}>
            <rect x={-60} y={985} width={480} height={140} rx={24} />
            <rect x={1500} y={985} width={480} height={140} rx={24} />
          </g>
        ) : null}
      </g>

      {/* Screen-space UI Overlays (Phone, Chapter Cards, Banners, Telemetry Pills, Title/End Cards) */}
      {phoneCfg ? <PhoneChatUI t={t} cfg={phoneCfg} /> : null}

      {cfg.chapterCard ? (
        <DistanceChapterCard
          t={t}
          place={cfg.chapterCard.place}
          sub={cfg.chapterCard.sub}
          color={cfg.chapterCard.color}
          mode={cfg.chapterCard.mode}
        />
      ) : null}

      {cfg.banner ? (
        <HookBannerCard
          t={t}
          text={cfg.banner.text}
          sub={cfg.banner.sub}
          color={cfg.banner.color}
          x={isVert ? 540 : cfg.banner.x}
          y={isVert ? 210 : cfg.banner.y}
          scale={isVert ? 1.05 : cfg.banner.scale}
          instant={cfg.banner.instant}
        />
      ) : null}

      {cfg.pill ? (
        <TelemetryPill
          t={t}
          label={cfg.pill.label}
          value={cfg.pill.value}
          color={cfg.pill.color}
          x={cfg.pill.x}
          y={cfg.pill.y}
        />
      ) : null}

      {cfg.pill2 ? (
        <TelemetryPill
          t={t}
          label={cfg.pill2.label}
          value={cfg.pill2.value}
          color={cfg.pill2.color}
          x={cfg.pill2.x ?? 90}
          y={cfg.pill2.y ?? 92}
        />
      ) : null}

      {cfg.shortBigNum ? (
        <ShortBigNumber
          t={t}
          place={cfg.shortBigNum.place}
          bigValue={cfg.shortBigNum.bigValue}
          subText={cfg.shortBigNum.subText}
          color={cfg.shortBigNum.color}
          y={cfg.shortBigNum.y}
        />
      ) : null}

      {cfg.titleCard ? (
        <LightdayTitleCard
          t={t}
          x={isVert ? 540 : cfg.titleCard.x}
          y={isVert ? 320 : cfg.titleCard.y}
          size={isVert ? 82 : cfg.titleCard.size}
        />
      ) : null}

      {cfg.endCard === '16x9' ? <LightdayEndCard16x9 t={t} /> : null}
      {cfg.endCard === '9x16' ? <LightdayShortEndCard9x16 t={t} /> : null}
    </g>
  );
};

export type DiagramMode =
  | 'light_speed_186k'
  | 'distance_equals_delay'
  | 'moon_vs_artemis'
  | 'sun_8m20s'
  | 'mars_orbit_3_to_22m'
  | 'mars_conjunction_26mo'
  | 'neptune_4h10m'
  | 'lightday_scale_16b'
  | 'voyager1_timeline_49y'
  | 'golden_record_55lang'
  | 'star_ac79_40000y'
  | 'proxima_vs_andromeda'
  | 'voyager2_2035'
  | 'nov2026_sky_calendar';

export type LightdayDiagramConfig = {
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
  phone?: PhoneUIConfig;
};

/**
 * Animated Cosmic Blueprint / Schematic Diagram Renderer for Science & Comparison Beats.
 */
export const LightdayDiagramShot: React.FC<{ t: number; len: number; cfg: LightdayDiagramConfig }> = ({
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
      {isVert ? <rect width={1080} height={1920} fill={bgCol} /> : null}
      <g transform={diagTransform}>
        {/* Deep blueprint space grid background */}
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
          <rect x={-560} y={-52} width={1120} height={104} rx={26} fill="#0E1428" stroke={col} strokeWidth={4} />
          <text
            y={cfg.subtitle ? -6 : 12}
            textAnchor="middle"
            fontFamily={FONT.title}
            fontWeight={800}
            fontSize={40}
            fill="#F6EFE3"
            letterSpacing={2.5}
          >
            {cfg.title}
          </text>
          {cfg.subtitle ? (
            <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={21} fill={col} letterSpacing={2}>
              {cfg.subtitle}
            </text>
          ) : null}
        </g>

        {/* MODE 1: Light speed 186,000 miles per second */}
        {cfg.mode === 'light_speed_186k' ? (
          <g transform="translate(960 565)">
            <Glow x={0} y={0} r={360} color={col} o={0.32} />
            <circle cx={0} cy={0} r={185} fill="#1B4D8E" stroke="#7FD4FF" strokeWidth={5} />
            <path d="M -90 -80 Q -20 -110 50 -40 Q 95 25 20 110 Q -65 75 -90 -80 Z" fill="#48B872" opacity={0.85} />
            <ellipse
              cx={0}
              cy={0}
              rx={285}
              ry={115}
              transform={`rotate(${v === 1 ? 18 : -16})`}
              fill="none"
              stroke="#FFE27A"
              strokeWidth={7}
              strokeDasharray="180 60"
              strokeDashoffset={-t * 28}
            />
            <rect x={-420} y={225} width={840} height={92} rx={24} fill="#12182E" stroke="#FFE27A" strokeWidth={3.5} />
            <text y={282} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFE27A" letterSpacing={2}>
              SPEED OF LIGHT: ~186,000 MILES / SEC
            </text>
          </g>
        ) : null}

        {/* MODE 2: Rule Card: Distance = Delay */}
        {cfg.mode === 'distance_equals_delay' ? (
          <g transform="translate(960 560)">
            <rect x={-680} y={-260} width={1360} height={520} rx={36} fill="#12172E" stroke={col} strokeWidth={4} />
            <text y={-165} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={68} fill="#FFE27A" letterSpacing={4}>
              RULE: DISTANCE = DELAY
            </text>
            {[
              { name: 'EARTH ROOM', dist: 'NEXT DOOR', delay: 'INSTANT', w: 140, c: '#5BE08A' },
              { name: 'THE MOON', dist: '384,400 KM', delay: '1.3 SECONDS', w: 340, c: '#7FD4FF' },
              { name: 'MARS ORBIT', dist: 'VARIABLE ORBIT', delay: '3 TO 22 MINUTES', w: 620, c: '#FF8A3D' },
              { name: 'ONE LIGHT-DAY', dist: '~16 BILLION MILES', delay: '24 HOURS ONE WAY', w: 980, c: '#FFE27A' },
            ].map((row, idx) => {
              const ry = -65 + idx * 78;
              const barW = row.w * clamp((t + 6 - idx * 2) / 14);
              return (
                <g key={idx} transform={`translate(0 ${ry})`}>
                  <text x={-610} y={8} fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#F6EFE3">
                    {row.name}
                  </text>
                  <rect x={-320} y={-20} width={barW} height={38} rx={19} fill={row.c} />
                  <text x={-300 + barW + 18} y={8} fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill={row.c}>
                    {row.dist} → {row.delay}
                  </text>
                </g>
              );
            })}
          </g>
        ) : null}

        {/* MODE 3: Moon 1.3s vs Artemis II 3 days */}
        {cfg.mode === 'moon_vs_artemis' ? (
          <g transform="translate(960 560)">
            <circle cx={-620} cy={0} r={88} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <text x={-620} y={132} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#9ED4FF">
              EARTH
            </text>
            <circle cx={620} cy={0} r={62} fill="#8C96AC" stroke="#DCE4F2" strokeWidth={4} />
            <text x={620} y={112} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#DCE4F2">
              MOON (384,400 KM)
            </text>

            <path d="M -510 -45 Q 0 -220 535 -45" fill="none" stroke="#FF8A3D" strokeWidth={5} strokeDasharray="16 10" />
            <g transform={`translate(${lerp(-420, 120, p)} -125)`}>
              <rect x={-38} y={-20} width={76} height={40} rx={12} fill="#F6EFE3" stroke="#FF8A3D" strokeWidth={4} />
              <text y={-34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FF8A3D">
                ARTEMIS II CREW: ~3 DAYS
              </text>
            </g>

            <line x1={-510} y1={55} x2={535} y2={55} stroke="#5BE08A" strokeWidth={7} />
            <circle cx={lerp(-500, 520, clamp((t % 30) / 22))} cy={55} r={18} fill="#FFE27A" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={118} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#5BE08A">
              YOUR TEXT MESSAGE: 1.3 SECONDS ONE WAY
            </text>
          </g>
        ) : null}

        {/* MODE 4: Sun 8 minutes 20 seconds */}
        {cfg.mode === 'sun_8m20s' ? (
          <g transform="translate(960 560)">
            <Glow x={-580} y={0} r={320} color="#FFB84D" o={0.55} />
            <circle cx={-580} cy={0} r={135} fill="#FFE27A" stroke="#FF8A3D" strokeWidth={6} />
            <text x={-580} y={185} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFE27A">
              THE SUN (T - 8m 20s)
            </text>

            <circle cx={580} cy={0} r={74} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <text x={580} y={125} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#9ED4FF">
              PIP’S WINDOW (NOW)
            </text>

            <line x1={-420} y1={0} x2={485} y2={0} stroke="#FFE27A" strokeWidth={8} strokeDasharray="24 14" strokeDashoffset={-t * 16} />
            <rect x={-310} y={-145} width={620} height={86} rx={22} fill="#141930" stroke="#FFE27A" strokeWidth={3.5} />
            <text x={0} y={-90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFE27A">
              SUNLIGHT TRAVEL TIME: 8 MIN 20 SEC
            </text>
          </g>
        ) : null}

        {/* MODE 5: Mars Orbit 3 to 22 minutes */}
        {cfg.mode === 'mars_orbit_3_to_22m' ? (
          <g transform="translate(960 565)">
            <circle cx={0} cy={0} r={54} fill="#FFE27A" stroke="#FF8A3D" strokeWidth={4} />
            <circle cx={0} cy={0} r={175} fill="none" stroke="#7FD4FF" strokeWidth={3} strokeDasharray="10 8" />
            <circle cx={0} cy={0} r={310} fill="none" stroke="#FF6A4D" strokeWidth={3.5} strokeDasharray="14 10" />

            <circle cx={-175} cy={0} r={24} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={3} />
            <text x={-175} y={48} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill="#9ED4FF">
              EARTH
            </text>

            <circle cx={-310} cy={0} r={22} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={3} />
            <line x1={-199} y1={0} x2={-288} y2={0} stroke="#5BE08A" strokeWidth={5} />
            <text x={-465} y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#5BE08A">
              CLOSEST: 3 MIN
            </text>

            <circle cx={310} cy={-45} r={22} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={3} />
            <line x1={-155} y1={-12} x2={288} y2={-42} stroke="#FF8A3D" strokeWidth={5} strokeDasharray="14 8" />
            <text x={515} y={-35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FF8A3D">
              FAR SIDE: 22 MIN
            </text>
          </g>
        ) : null}

        {/* MODE 6: Mars Solar Conjunction every 26 months */}
        {cfg.mode === 'mars_conjunction_26mo' ? (
          <g transform="translate(960 565)">
            <circle cx={-560} cy={0} r={58} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <text x={-560} y={102} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#9ED4FF">
              EARTH
            </text>

            <Glow x={0} y={0} r={260} color="#FF4A2B" o={0.55} />
            <circle cx={0} cy={0} r={118} fill="#FFE27A" stroke="#FF3B2F" strokeWidth={6} />
            <text x={0} y={168} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FF5A4A">
              SUN BLOCKS SIGNAL (EVERY ~26 MONTHS)
            </text>

            <circle cx={560} cy={0} r={52} fill="#D9534F" stroke="#FFE27A" strokeWidth={4} />
            <text x={560} y={102} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FF9A8A">
              MARS (BLACKOUT: WEEKS)
            </text>

            <line x1={-490} y1={0} x2={-135} y2={0} stroke="#FF5A4A" strokeWidth={7} strokeDasharray="16 10" />
            <text x={-310} y={-28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FFE27A">
              NO SIGNAL ❌
            </text>
          </g>
        ) : null}

        {/* MODE 7: Neptune 4 hours 10 minutes & Voyager 2 12 years */}
        {cfg.mode === 'neptune_4h10m' ? (
          <g transform="translate(960 565)">
            <circle cx={-610} cy={0} r={52} fill="#2B72C8" stroke="#9ED4FF" strokeWidth={4} />
            <circle cx={580} cy={0} r={112} fill="#1D56C9" stroke="#7FD4FF" strokeWidth={5} />
            <ellipse cx={580} cy={0} rx={165} ry={28} transform="rotate(-15 580 0)" fill="none" stroke="#9ED4FF" strokeWidth={3} />

            <line x1={-545} y1={-35} x2={450} y2={-35} stroke="#FFE27A" strokeWidth={6} />
            <text x={-45} y={-62} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#FFE27A">
              LIGHT / TEXT DELAY: 4 HOURS 10 MINUTES ONE WAY
            </text>

            <line x1={-545} y1={65} x2={450} y2={65} stroke="#7FD4FF" strokeWidth={5} strokeDasharray="16 10" />
            <text x={-45} y={115} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#7FD4FF">
              VOYAGER 2 SPACECRAFT FLIGHT: 12 YEARS
            </text>
          </g>
        ) : null}

        {/* MODE 8: One Light-Day ~16 Billion Miles / ~26 Billion KM */}
        {cfg.mode === 'lightday_scale_16b' ? (
          <g transform="translate(960 565)">
            <Glow x={0} y={0} r={420} color="#7FD4FF" o={0.22} />
            <ellipse cx={0} cy={0} rx={480} ry={235} fill="none" stroke="#FFE27A" strokeWidth={6} strokeDasharray="24 14" />
            <circle cx={0} cy={0} r={34} fill="#FFE27A" />
            <line x1={0} y1={0} x2={480} y2={0} stroke="#7FD4FF" strokeWidth={5} />
            <circle cx={480} cy={0} r={18} fill="#5BE08A" stroke="#FFFFFF" strokeWidth={4} />

            <rect x={-490} y={-155} width={980} height={115} rx={26} fill="#0E152B" stroke="#FFE27A" strokeWidth={4} />
            <text x={0} y={-102} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFE27A">
              1 LIGHT-DAY = ~16 BILLION MILES (~26 BILLION KM)
            </text>
            <text x={0} y={-58} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#7FD4FF">
              24 HOURS ONE WAY · 48 HOURS FOR A REPLY
            </text>
          </g>
        ) : null}

        {/* MODE 9: Voyager 1 Timeline (5 Sep 1977 -> 18 Nov 2026, 49y 2m 11d) */}
        {cfg.mode === 'voyager1_timeline_49y' ? (
          <g transform="translate(960 565)">
            <line x1={-660} y1={20} x2={660} y2={20} stroke="#7FD4FF" strokeWidth={8} />
            <circle cx={-620} cy={20} r={24} fill="#FF8A3D" stroke="#FFE27A" strokeWidth={4} />
            <text x={-620} y={85} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FFE27A">
              LAUNCH: 5 SEP 1977
            </text>

            <circle cx={620} cy={20} r={28} fill="#5BE08A" stroke="#FFFFFF" strokeWidth={5} />
            <text x={620} y={85} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#5BE08A">
              18 NOV 2026 · 5:16 A.M. EST
            </text>

            <VoyagerProbeProp x={lerp(-350, 480, p)} y={-95} scale={0.78} rot={-12} t={t} label="VOYAGER 1" />

            <rect x={-480} y={145} width={960} height={95} rx={24} fill="#121A30" stroke="#FFE27A" strokeWidth={3.5} />
            <text x={0} y={204} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFE27A">
              TRAVEL TIME: 49 YEARS, 2 MONTHS & 11 DAYS
            </text>
          </g>
        ) : null}

        {/* MODE 10: Golden Record 55 Languages */}
        {cfg.mode === 'golden_record_55lang' ? (
          <g transform="translate(960 540)">
            <GoldenRecordDiscProp x={-340} y={20} scale={0.95} t={t} showQuote={false} />
            <g transform="translate(275 -95)">
              <rect x={-340} y={-85} width={680} height={390} rx={30} fill="#12182D" stroke="#FFE27A" strokeWidth={4} />
              <text x={0} y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#FFE27A">
                THE GOLDEN RECORD
              </text>
              <text x={0} y={45} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={36} fill="#7FD4FF">
                GREETINGS IN 55 LANGUAGES + MUSIC
              </text>
              <text x={0} y={125} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#F6EFE3">
                “Hello from the children
              </text>
              <text x={0} y={168} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#F6EFE3">
                of planet Earth.”
              </text>
              <text x={0} y={245} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#5BE08A" letterSpacing={2}>
                THE SLOWEST TEXT EVER SENT
              </text>
            </g>
          </g>
        ) : null}

        {/* MODE 11: Star AC +79 3888 (17+ ly, within ~1.7 ly in 40,000 years) */}
        {cfg.mode === 'star_ac79_40000y' ? (
          <g transform="translate(960 565)">
            <circle cx={-620} cy={120} r={32} fill="#FFE27A" />
            <text x={-620} y={178} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#FFE27A">
              SOLAR SYSTEM
            </text>

            <Glow x={540} y={-40} r={240} color="#FF5A4A" o={0.5} />
            <circle cx={540} cy={-40} r={82} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={5} />
            <text x={540} y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFE27A">
              STAR AC +79 3888 (17+ LY)
            </text>

            <path d="M -580 115 Q 0 20 510 -195" fill="none" stroke="#7FD4FF" strokeWidth={6} strokeDasharray="18 12" />
            <line x1={540} y1={-40} x2={455} y2={-172} stroke="#5BE08A" strokeWidth={5} />
            <text x={180} y={-185} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#5BE08A">
              PASSES WITHIN ~1.7 LIGHT-YEARS IN 40,000 YEARS
            </text>
          </g>
        ) : null}

        {/* MODE 12: Proxima Centauri (~4.24 ly, ~8.5 yr reply) vs Andromeda (~2.5M ly) */}
        {cfg.mode === 'proxima_vs_andromeda' ? (
          <g transform="translate(960 565)">
            <g transform="translate(-360 0)">
              <rect x={-310} y={-210} width={620} height={420} rx={30} fill="#131930" stroke="#7FD4FF" strokeWidth={4} />
              <circle cx={0} cy={-75} r={58} fill="#FF6A4D" stroke="#FFE27A" strokeWidth={4} />
              <text y={35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#F6EFE3">
                PROXIMA CENTAURI
              </text>
              <text y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#7FD4FF">
                ~4.24 LIGHT-YEARS
              </text>
              <text y={150} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill="#FFE27A">
                REPLY TIME: ~8.5 YEARS
              </text>
            </g>

            <g transform="translate(360 0)">
              <rect x={-310} y={-210} width={620} height={420} rx={30} fill="#191330" stroke="#FFE27A" strokeWidth={4} />
              <ellipse cx={0} cy={-75} rx={110} ry={45} transform="rotate(-18 0 -75)" fill="#9E7BFF" stroke="#FFE27A" strokeWidth={4} />
              <text y={35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#F6EFE3">
                ANDROMEDA GALAXY
              </text>
              <text y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFE27A">
                ~2.5 MILLION LIGHT-YEARS
              </text>
              <text y={150} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#5BE08A">
                CRAB-HUMAN ERA DELIVERY 🦀
              </text>
            </g>
          </g>
        ) : null}

        {/* MODE 13: Voyager 2 reaches 1 Light-Day in November 2035 */}
        {cfg.mode === 'voyager2_2035' ? (
          <g transform="translate(960 565)">
            <rect x={-640} y={-210} width={1280} height={420} rx={32} fill="#10182E" stroke="#5BE08A" strokeWidth={4} />
            <VoyagerProbeProp x={-340} y={-10} scale={0.72} rot={-14} t={t} label="VOYAGER 1 · 18 NOV 2026" pulseColor="#7FD4FF" />
            <VoyagerProbeProp x={340} y={-10} scale={0.78} rot={14} t={t} label="VOYAGER 2 · NOV 2035" pulseColor="#5BE08A" />
            <text x={0} y={162} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#FFE27A">
              NEXT LIGHT-DAY MILESTONE: VOYAGER 2 IN NOVEMBER 2035
            </text>
          </g>
        ) : null}

        {/* MODE 14: November 2026 Skywatching Almanac */}
        {cfg.mode === 'nov2026_sky_calendar' ? (
          <g transform="translate(960 565)">
            {[
              { date: '15–16 NOV', title: 'MARS & JUPITER', sub: 'CLOSE BEFORE SUNRISE', c: '#FF8A3D', x: -450 },
              { date: '17–18 NOV', title: 'LEONID METEORS', sub: 'NASA CELEBRATES ON 17 NOV', c: '#7FD4FF', x: 0 },
              { date: '18 NOV 2026', title: 'VOYAGER 1: 1 LIGHT-DAY', sub: '5:16 A.M. EST MILESTONE', c: '#5BE08A', x: 450 },
            ].map((card, i) => (
              <g key={i} transform={`translate(${card.x} 0)`}>
                <rect x={-205} y={-195} width={410} height={380} rx={28} fill="#12182E" stroke={card.c} strokeWidth={4} />
                <rect x={-175} y={-160} width={350} height={64} rx={18} fill={card.c} />
                <text y={-116} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#0D0A1A">
                  {card.date}
                </text>
                <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#F6EFE3">
                  {card.title}
                </text>
                <text y={72} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={21} fill={card.c}>
                  {card.sub}
                </text>
              </g>
            ))}
          </g>
        ) : null}
      </g>

      {cfg.phone ? <PhoneChatUI t={t} cfg={cfg.phone} /> : null}
      {cfg.shortBigNum ? (
        <ShortBigNumber
          t={t}
          place={cfg.shortBigNum.place}
          bigValue={cfg.shortBigNum.bigValue}
          subText={cfg.shortBigNum.subText}
          color={cfg.shortBigNum.color}
          y={cfg.shortBigNum.y}
        />
      ) : null}
      {cfg.pill ? (
        <TelemetryPill
          t={t}
          label={cfg.pill.label}
          value={cfg.pill.value}
          color={cfg.pill.color}
          x={cfg.pill.x}
          y={cfg.pill.y}
        />
      ) : null}
    </g>
  );
};
