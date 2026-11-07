import React from 'react';
import { ShotMap, ShotProps } from '../../engine';
import { WorldSceneShot, WorldShotConfig, SchematicDiagramShot, DiagramKind } from './stage';

type ShortEntry =
  | { kind: 'world'; cfg: Omit<WorldShotConfig, 'idSeed' | 'vertical'> }
  | { kind: 'diagram'; diagram: DiagramKind };

const vw = (cfg: Omit<WorldShotConfig, 'idSeed' | 'vertical'>): ShortEntry => ({ kind: 'world', cfg });
const vd = (diagram: DiagramKind): ShortEntry => ({ kind: 'diagram', diagram });

const SHORT_DEFS: Record<string, ShortEntry> = {
  // S1 (0..79): "Jump here and you never come back down."
  S1: vw({
    world: 'comet',
    cam: [960, 520, 1.24],
    camEnd: [960, 450, 1.12],
    pipX: 960,
    action: 'float_spin',
    jumpPx: 290,
    cometOffsetY: 240,
    cometScale: 0.42,
    expr: 'shock',
    shortStat: {
      world: 'COMET COLD OPEN',
      bigValue: 'NO RETURN',
      subText: 'NEVER COMES BACK DOWN!',
      color: '#FF5A4A',
    },
  }),
  // S2 (79..177): "Watch how high your normal jump goes across space."
  S2: vw({
    world: 'comet',
    cam: [780, 580, 1.18],
    pipX: 780,
    action: 'launch',
    jumpPx: 280,
    expr: 'happy',
    titleCard: true,
  }),
  // S3 (177..249): "On Earth, hop beside a gym wall:"
  S3: vw({
    world: 'gym',
    cam: [785, 635, 1.38],
    pipX: 835,
    facing: -1,
    action: 'crouch',
    expr: 'smug',
  }),
  // S4 (249..336): "about half a metre before gravity pulls you down."
  S4: vw({
    world: 'gym',
    cam: [790, 575, 1.72],
    pipX: 835,
    facing: -1,
    action: 'chalk_slap',
    jumpPx: 120,
    chalkMarkM: 0.5,
    expr: 'happy',
    shortStat: {
      world: 'EARTH',
      bigValue: '~0.5 m',
      subText: 'STANDING GYM JUMP',
      color: '#FFE27A',
    },
  }),
  // S5 (336..424): "On the Moon, at about one point six two metres"
  S5: vw({
    world: 'moon',
    cam: [1080, 560, 1.15],
    pipX: 840,
    action: 'crouch',
    pill: { label: 'MOON GRAVITY', value: '~1.62 m/s²', color: '#7FD4FF' },
  }),
  // S6 (424..501): "per second squared, you soar about three metres"
  S6: vw({
    world: 'moon',
    cam: [750, 495, 1.22],
    pipX: 820,
    action: 'soar_arc',
    jumpPx: 390,
    scaleBar: { x: 560, pxPerM: 130, maxM: 3, stepM: 1, hiM: 3, hiLabel: '~3 m', color: '#FFE27A' },
    shortStat: {
      world: 'THE MOON',
      bigValue: '~3 m',
      subText: 'GRAVITY: ~1.62 m/s²',
      color: '#7FD4FF',
    },
  }),
  // S7 (501..553): "high for nearly four seconds!"
  S7: vw({
    world: 'moon',
    cam: [820, 395, 2.08],
    pipX: 820,
    action: 'float_spin',
    jumpPx: 380,
    expr: 'happy',
    pill: { label: 'MOON AIRTIME', value: 'NEARLY 4 s!', color: '#FFE27A' },
  }),
  // S8 (553..601): "Out on icy Pluto,"
  S8: vw({
    world: 'pluto',
    cam: [760, 540, 1.18],
    pipX: 640,
    action: 'point_up',
    plutoHouse: false,
  }),
  // S9 (601..655): "at about zero point six two,"
  S9: vw({
    world: 'pluto',
    cam: [880, 680, 1.56],
    pipX: 740,
    action: 'crouch',
    plutoHouse: true,
    pill: { label: 'PLUTO GRAVITY', value: '~0.62 m/s²', color: '#5BE08A' },
  }),
  // S10 (655..705): "you launch about seven metres up"
  S10: vw({
    world: 'pluto',
    cam: [1080, 435, 0.96],
    pipX: 880,
    pipXEnd: 1180,
    action: 'launch',
    jumpPx: 565,
    plutoHouse: true,
    shortStat: {
      world: 'PLUTO',
      bigValue: '~7 m',
      subText: 'CLEARS A HOUSE!',
      color: '#5BE08A',
    },
  }),
  // S11 (705..764): "with roughly nine seconds of airtime!"
  S11: vw({
    world: 'pluto',
    cam: [1320, 345, 1.52],
    pipX: 1280,
    action: 'soar_arc',
    jumpPx: 575,
    expr: 'happy',
    pill: { label: 'PLUTO AIRTIME', value: '~9 SECONDS!', color: '#FFE27A' },
  }),
  // S12 (764..835): "Then try comet sixty seven P."
  S12: vw({
    world: 'comet',
    cam: [1120, 620, 1.22],
    pipX: 860,
    action: 'stand',
    pill: { label: 'FINAL STEP', value: 'COMET 67P', color: '#7FD4FF' },
  }),
  // S13 (835..900): "Europe's Philae lander bounced off"
  S13: vw({
    world: 'comet',
    cam: [1020, 745, 1.98],
    action: 'none',
    gag: 'philae_harpoon_fail',
  }),
  // S14 (900..966): "it at about thirty eight centimetres per second"
  S14: vd('short_philae_38cms'),
  // S15 (966..1055): "and flew about one kilometre over nearly two hours."
  S15: vw({
    world: 'comet',
    cam: [980, 560, 1.16],
    action: 'none',
    gag: 'philae_bounce_arc',
    pill: { label: 'PHILAE BOUNCE', value: '~1 km · ~2 h', color: '#FFE27A' },
  }),
  // S16 (1055..1150): "You jump much faster, so you drift into space forever!"
  S16: vw({
    world: 'comet',
    cam: [960, 470, 1.14],
    cometOffsetY: 520,
    cometScale: 0.16,
    pipX: 960,
    action: 'wave_escape',
    jumpPx: 340,
    expr: 'happy',
    shortStat: {
      world: 'COMET 67P',
      bigValue: 'FOREVER!',
      subText: 'FASTER THAN ESCAPE SPEED',
      color: '#FF8A3D',
    },
  }),
  // S17 (1150..1234): "Which world next? Full film on the channel."
  S17: vw({
    world: 'rooftop',
    cam: [960, 635, 1.52],
    pipX: 840,
    yaw: 0,
    action: 'point_up',
    expr: 'happy',
    extraCast: 'mo',
    extraX: 1080,
  }),
  // S18 (1234..1332): Short End Card
  S18: vw({
    world: 'rooftop',
    cam: [960, 580, 1.12],
    pipX: 580,
    action: 'stand',
    endCard: true,
  }),
};

export const SHORT_SHOTS: ShotMap = Object.fromEntries(
  Object.entries(SHORT_DEFS).map(([id, def]) => {
    const Comp: React.FC<ShotProps> = ({ t, len }) =>
      def.kind === 'diagram' ? (
        <SchematicDiagramShot kind={def.diagram} t={t} len={len} vertical />
      ) : (
        <WorldSceneShot cfg={{ ...def.cfg, idSeed: `s_${id}`, vertical: true }} t={t} len={len} />
      );
    return [id, Comp];
  }),
);
