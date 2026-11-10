import React from 'react';
import { ShotMap, ShotProps } from '../../engine';
import { ClosermoonSceneShot, ClosermoonDiagramShot, ClosermoonSceneConfig, ClosermoonDiagramConfig } from './stage';

type ShortSpecEntry = { kind: 'scene'; cfg: ClosermoonSceneConfig } | { kind: 'diagram'; cfg: ClosermoonDiagramConfig };

const FRAME0_CFG: ClosermoonSceneConfig = {
  "id": "S1",
  "set": "night_beach",
  "setVariant": "hook",
  "vertical": true,
  "cam": {
    "x": 960,
    "y": 540,
    "z": 0.94
  },
  "camEnd": {
    "x": 960,
    "y": 524,
    "z": 1.0
  },
  "pip": {
    "x": 780,
    "pose": "beachAwe",
    "scale": 0.94,
    "flip": 1
  },
  "banner": {
    "text": "MOON 2X CLOSER",
    "sub": "384,400 KM \u2192 ABOUT 192,200 KM",
    "color": "#FFE27A",
    "x": 540,
    "y": 205,
    "instant": true
  },
  "gauge": {
    "variant": "digital_bar",
    "x": 540,
    "y": 1290,
    "scale": 0.94,
    "tilt": 0,
    "header": "LUNAR DISTANCE READOUT",
    "distFrom": "384,400 KM",
    "distTo": "192,200 KM",
    "sizeLabel": "WIDTH x2",
    "subMetric": "SKY AREA x4",
    "themeColor": "#7FD4FF",
    "instant": true
  }
};

const SHORT_SPECS: Record<string, ShortSpecEntry> = {
  "S1": {
    "kind": "scene",
    "cfg": {
      "id": "S1",
      "set": "night_beach",
      "setVariant": "hook",
      "vertical": true,
      "cam": {
        "x": 960,
        "y": 540,
        "z": 0.94
      },
      "camEnd": {
        "x": 960,
        "y": 524,
        "z": 1.0
      },
      "pip": {
        "x": 780,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1
      },
      "banner": {
        "text": "MOON 2X CLOSER",
        "sub": "384,400 KM \u2192 ABOUT 192,200 KM",
        "color": "#FFE27A",
        "x": 540,
        "y": 205,
        "instant": true
      },
      "gauge": {
        "variant": "digital_bar",
        "x": 540,
        "y": 1290,
        "scale": 0.94,
        "tilt": 0,
        "header": "LUNAR DISTANCE READOUT",
        "distFrom": "384,400 KM",
        "distTo": "192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "SKY AREA x4",
        "themeColor": "#7FD4FF",
        "instant": true
      }
    }
  },
  "S2": {
    "kind": "scene",
    "cfg": {
      "id": "S2",
      "set": "night_beach",
      "setVariant": "surge",
      "vertical": true,
      "cam": {
        "x": 820,
        "y": 585,
        "z": 1.24
      },
      "camEnd": {
        "x": 845,
        "y": 565,
        "z": 1.34
      },
      "pip": {
        "x": 760,
        "pose": "pointMoon",
        "scale": 1.02,
        "flip": 1
      },
      "banner": {
        "text": "MOON 2X CLOSER",
        "sub": "WATCH WHAT THE OCEAN DOES FIRST",
        "color": "#7FD4FF",
        "x": 540,
        "y": 205,
        "instant": true
      },
      "shortBigNum": {
        "place": "FIRST REACTION: THE OCEAN",
        "bigValue": "TIDE SURGE",
        "subText": "WAVES CLIMB PAST YOUR ANKLES",
        "color": "#FFE27A",
        "y": 1420
      }
    }
  },
  "S3": {
    "kind": "scene",
    "cfg": {
      "id": "S3",
      "set": "night_beach",
      "setVariant": "surge",
      "vertical": true,
      "cam": {
        "x": 850,
        "y": 536,
        "z": 1.18
      },
      "camEnd": {
        "x": 870,
        "y": 521,
        "z": 1.26
      },
      "pip": {
        "x": 810,
        "pose": "ankleScramble",
        "scale": 0.98,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "ABOUT 8X STRONGER TIDAL PULL",
        "color": "#5BE08A",
        "x": 540,
        "y": 205
      },
      "gauge": {
        "variant": "split_disc",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": -4,
        "header": "HALVED LUNAR ORBIT",
        "distFrom": "384,400 KM",
        "distTo": "192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE-CUBE TIDES",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S4": {
    "kind": "scene",
    "cfg": {
      "id": "S4",
      "set": "night_beach",
      "setVariant": "surge",
      "vertical": true,
      "cam": {
        "x": 905,
        "y": 524,
        "z": 1.26
      },
      "camEnd": {
        "x": 925,
        "y": 509,
        "z": 1.34
      },
      "pip": {
        "x": 845,
        "pose": "beachAwe",
        "scale": 0.98,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "ABOUT 8X STRONGER TIDAL PULL",
        "color": "#5BE08A",
        "x": 540,
        "y": 205
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": -2,
        "header": "HALVED LUNAR ORBIT",
        "distFrom": "384,400 KM",
        "distTo": "192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE-CUBE TIDES",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S5": {
    "kind": "diagram",
    "cfg": {
      "id": "S5",
      "mode": "inverse_cube_tides_8x",
      "variant": 1,
      "vertical": true,
      "title": "HALF THE DISTANCE = PULL x8",
      "subtitle": "384,400 KM \u2192 ABOUT 192,200 KM",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 0.88
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 0.95
      },
      "shortBigNum": {
        "place": "INVERSE-CUBE TIDES (1/D\u00b3)",
        "bigValue": "PULL x8",
        "subText": "ABOUT EIGHT TIMES STRONGER",
        "color": "#5BE08A",
        "y": 1440
      }
    }
  },
  "S6": {
    "kind": "scene",
    "cfg": {
      "id": "S6",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "vertical": true,
      "cam": {
        "x": 1015,
        "y": 500,
        "z": 1.42
      },
      "camEnd": {
        "x": 1035,
        "y": 485,
        "z": 1.5
      },
      "pip": {
        "x": 915,
        "pose": "beachAwe",
        "scale": 0.98,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "ABOUT 8X STRONGER TIDAL PULL",
        "color": "#5BE08A",
        "x": 540,
        "y": 205
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": 2,
        "header": "HALVED LUNAR ORBIT",
        "distFrom": "384,400 KM",
        "distTo": "192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE-CUBE TIDES",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S7": {
    "kind": "scene",
    "cfg": {
      "id": "S7",
      "set": "night_beach",
      "setVariant": "surge",
      "vertical": true,
      "cam": {
        "x": 1070,
        "y": 488,
        "z": 1.5
      },
      "camEnd": {
        "x": 1090,
        "y": 473,
        "z": 1.58
      },
      "pip": {
        "x": 950,
        "pose": "ankleScramble",
        "scale": 0.98,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "ABOUT 8X STRONGER TIDAL PULL",
        "color": "#5BE08A",
        "x": 540,
        "y": 205
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": 4,
        "header": "HALVED LUNAR ORBIT",
        "distFrom": "384,400 KM",
        "distTo": "192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE-CUBE TIDES",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S8": {
    "kind": "scene",
    "cfg": {
      "id": "S8",
      "set": "thumb_sky",
      "setVariant": "thumb_giant",
      "vertical": true,
      "cam": {
        "x": 1020,
        "y": 510,
        "z": 1.05
      },
      "camEnd": {
        "x": 1040,
        "y": 490,
        "z": 1.14
      },
      "pip": {
        "x": 840,
        "pose": "thumbTest",
        "scale": 0.96,
        "flip": 1
      },
      "shortBigNum": {
        "place": "SKY SIZE AT 192,200 KM",
        "bigValue": "WIDTH x2 \u00b7 AREA x4",
        "subText": "TWICE AS WIDE \u00b7 FOUR TIMES THE AREA",
        "color": "#FFE27A",
        "y": 290
      }
    }
  },
  "S9": {
    "kind": "scene",
    "cfg": {
      "id": "S9",
      "set": "window_room",
      "setVariant": "window_lantern",
      "vertical": true,
      "cam": {
        "x": 1120,
        "y": 510,
        "z": 1.22
      },
      "camEnd": {
        "x": 1140,
        "y": 490,
        "z": 1.32
      },
      "pip": {
        "x": 840,
        "pose": "windowGaze",
        "scale": 0.96,
        "flip": 1
      },
      "shortBigNum": {
        "place": "SKY SIZE AT 192,200 KM",
        "bigValue": "WIDTH x2 \u00b7 AREA x4",
        "subText": "TWICE AS WIDE \u00b7 FOUR TIMES THE AREA",
        "color": "#FFE27A",
        "y": 290
      }
    }
  },
  "S10": {
    "kind": "scene",
    "cfg": {
      "id": "S10",
      "set": "supermoon_stage",
      "setVariant": "subtle_14",
      "vertical": true,
      "cam": {
        "x": 560,
        "y": 520,
        "z": 1.08
      },
      "camEnd": {
        "x": 580,
        "y": 500,
        "z": 1.16
      },
      "pip": {
        "x": 880,
        "pose": "squintTube",
        "scale": 0.96,
        "flip": 1
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": -2,
        "header": "NASA SUPERMOON CHECK",
        "distFrom": "SUPERMOON: +14%",
        "distTo": "OURS: +100% WIDER",
        "sizeLabel": "100% WIDER",
        "subMetric": "NASA: UP TO 14% BIGGER \u00b7 30% BRIGHTER",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S11": {
    "kind": "scene",
    "cfg": {
      "id": "S11",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "vertical": true,
      "cam": {
        "x": 960,
        "y": 520,
        "z": 1.1800000000000002
      },
      "camEnd": {
        "x": 980,
        "y": 500,
        "z": 1.26
      },
      "pip": {
        "x": 880,
        "pose": "pointMoon",
        "scale": 0.96,
        "flip": 1
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": 0,
        "header": "NASA SUPERMOON CHECK",
        "distFrom": "SUPERMOON: +14%",
        "distTo": "OURS: +100% WIDER",
        "sizeLabel": "100% WIDER",
        "subMetric": "NASA: UP TO 14% BIGGER \u00b7 30% BRIGHTER",
        "themeColor": "#A68CFF"
      }
    }
  },
  "S12": {
    "kind": "diagram",
    "cfg": {
      "id": "S12",
      "mode": "supermoon_14_vs_100",
      "variant": 2,
      "vertical": true,
      "title": "SUPERMOON (+14%) VS 2X CLOSER (+100%)",
      "subtitle": "NASA: UP TO 14% BIGGER & 30% BRIGHTER",
      "accentColor": "#7FD4FF",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 0.86
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 0.93
      },
      "shortBigNum": {
        "place": "NASA SUPERMOON CHECK",
        "bigValue": "+14% VS +100%",
        "subText": "30% BRIGHTER VS TWICE AS WIDE",
        "color": "#7FD4FF",
        "y": 1450
      }
    }
  },
  "S13": {
    "kind": "scene",
    "cfg": {
      "id": "S13",
      "set": "supermoon_stage",
      "setVariant": "stool_tip",
      "vertical": true,
      "cam": {
        "x": 1240,
        "y": 520,
        "z": 1.3800000000000001
      },
      "camEnd": {
        "x": 1220,
        "y": 500,
        "z": 1.46
      },
      "pip": {
        "x": 880,
        "pose": "stoolTip",
        "scale": 0.96,
        "flip": 1
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 540,
        "y": 1320,
        "scale": 0.92,
        "tilt": 4,
        "header": "NASA SUPERMOON CHECK",
        "distFrom": "SUPERMOON: +14%",
        "distTo": "OURS: +100% WIDER",
        "sizeLabel": "100% WIDER",
        "subMetric": "NASA: UP TO 14% BIGGER \u00b7 30% BRIGHTER",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S14": {
    "kind": "scene",
    "cfg": {
      "id": "S14",
      "set": "silver_park",
      "setVariant": "bench_book",
      "vertical": true,
      "cam": {
        "x": 720,
        "y": 540,
        "z": 1.15
      },
      "camEnd": {
        "x": 740,
        "y": 520,
        "z": 1.24
      },
      "pip": {
        "x": 640,
        "y": 835,
        "pose": "readBook",
        "scale": 0.95,
        "flip": 1,
        "holdBook": true,
        "holdTowel": false
      },
      "shortBigNum": {
        "place": "SILVER NIGHTS & TIDES",
        "bigValue": "READ OUTDOORS",
        "subText": "AREA x4 BRIGHTNESS \u00b7 PULL x8 TIDES",
        "color": "#7FD4FF",
        "y": 290
      }
    }
  },
  "S15": {
    "kind": "scene",
    "cfg": {
      "id": "S15",
      "set": "harbour_seawall",
      "setVariant": "climbing_stairs",
      "vertical": true,
      "cam": {
        "x": 880,
        "y": 540,
        "z": 1.15
      },
      "camEnd": {
        "x": 910,
        "y": 520,
        "z": 1.24
      },
      "pip": {
        "x": 560,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.95,
        "flip": 1,
        "holdBook": false,
        "holdTowel": true
      },
      "shortBigNum": {
        "place": "SILVER NIGHTS & TIDES",
        "bigValue": "TOWEL UP STAIRS",
        "subText": "AREA x4 BRIGHTNESS \u00b7 PULL x8 TIDES",
        "color": "#5BE08A",
        "y": 290
      }
    }
  },
  "S16": {
    "kind": "scene",
    "cfg": {
      "id": "S16",
      "set": "night_beach",
      "setVariant": "lifeguard",
      "vertical": true,
      "cam": {
        "x": 1420,
        "y": 480,
        "z": 1.28
      },
      "camEnd": {
        "x": 1400,
        "y": 460,
        "z": 1.38
      },
      "pip": {
        "x": 1520,
        "y": 585,
        "pose": "lifeguardPerch",
        "scale": 0.95,
        "flip": -1,
        "holdBook": false,
        "holdTowel": false
      },
      "shortBigNum": {
        "place": "SILVER NIGHTS & TIDES",
        "bigValue": "TOWEL UP STAIRS",
        "subText": "AREA x4 BRIGHTNESS \u00b7 PULL x8 TIDES",
        "color": "#FF8A3D",
        "y": 290
      }
    }
  },
  "S17": {
    "kind": "scene",
    "cfg": {
      "id": "S17",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "vertical": true,
      "cam": {
        "x": 940,
        "y": 535,
        "z": 1.02
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "pip": {
        "x": 820,
        "pose": "pointMoon",
        "scale": 0.96,
        "flip": 1,
        "holdRuler": false
      },
      "shortBigNum": {
        "place": "NASA REALITY CHECK",
        "bigValue": "+1 INCH / YEAR",
        "subText": "DRIFTING FARTHER AWAY FROM EARTH",
        "color": "#5BE08A",
        "y": 290
      }
    }
  },
  "S18": {
    "kind": "scene",
    "cfg": {
      "id": "S18",
      "set": "night_beach",
      "setVariant": "ruler_goodbye",
      "vertical": true,
      "cam": {
        "x": 1020,
        "y": 535,
        "z": 1.18
      },
      "camEnd": {
        "x": 1040,
        "y": 515,
        "z": 1.28
      },
      "pip": {
        "x": 820,
        "pose": "rulerWave",
        "scale": 0.96,
        "flip": 1,
        "holdRuler": true
      },
      "shortBigNum": {
        "place": "NASA REALITY CHECK",
        "bigValue": "+1 INCH / YEAR",
        "subText": "DRIFTING FARTHER AWAY FROM EARTH",
        "color": "#5BE08A",
        "y": 290
      }
    }
  },
  "S19": {
    "kind": "scene",
    "cfg": {
      "id": "S19",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "vertical": true,
      "cam": {
        "x": 1060,
        "y": 510,
        "z": 1.12
      },
      "camEnd": {
        "x": 1020,
        "y": 495,
        "z": 1.2
      },
      "pip": {
        "x": 840,
        "pose": "rooftopCelebrate",
        "scale": 0.96,
        "flip": 1
      },
      "endCard": "9x16"
    }
  },
  "S20": {
    "kind": "scene",
    "cfg": {
      "id": "S20",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "vertical": true,
      "cam": {
        "x": 960,
        "y": 510,
        "z": 0.98
      },
      "camEnd": {
        "x": 960,
        "y": 495,
        "z": 1.04
      },
      "pip": {
        "x": 840,
        "pose": "rooftopCelebrate",
        "scale": 0.96,
        "flip": 1
      },
      "endCard": "9x16"
    }
  }
};

export const SHORT_SHOTS: ShotMap = Object.fromEntries(
  Object.entries(SHORT_SPECS).map(([id, spec]) => [
    id,
    (({ t, len }: ShotProps) => {
      // Last shot S20 returns cleanly to Frame 0 on its final frames so the vertical Short loops seamlessly
      if (id === 'S20' && t >= len - 14) {
        return <ClosermoonSceneShot t={0} len={65} cfg={FRAME0_CFG} />;
      }
      return spec.kind === 'scene' ? (
        <ClosermoonSceneShot t={t} len={len} cfg={spec.cfg} />
      ) : (
        <ClosermoonDiagramShot t={t} len={len} cfg={spec.cfg} />
      );
    }) as React.FC<ShotProps>,
  ])
);
