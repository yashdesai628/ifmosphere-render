import React from 'react';
import { ShotMap, ShotProps, clamp } from '../../engine';
import { LightdaySceneShot, LightdayDiagramShot, LightdaySceneConfig, LightdayDiagramConfig } from './stage';

type ShortSpecEntry = { kind: 'scene'; cfg: LightdaySceneConfig } | { kind: 'diagram'; cfg: LightdayDiagramConfig };

const FRAME0_CFG: LightdaySceneConfig = {
  "id": "S1",
  "set": "bedroom",
  "cam": {
    "x": 810,
    "y": 540,
    "z": 0.95
  },
  "camEnd": {
    "x": 810,
    "y": 525,
    "z": 1.01
  },
  "pip": {
    "x": 670,
    "pose": "phoneHoldHigh",
    "scale": 0.98,
    "holdPhone": true
  },
  "phone": {
    "x": 610,
    "y": 1150,
    "scale": 0.88,
    "tilt": -2,
    "header": "BO \u00b7 1 LIGHT-DAY",
    "timerLabel": "COUNTDOWN TO REPLY",
    "timerValue": "REPLY IN 48:00:00",
    "themeColor": "#7FD4FF",
    "messages": [
      {
        "from": "pip",
        "text": "hey \ud83d\udc4b",
        "status": "SENT \u00b7 24h ONE WAY"
      }
    ],
    "instant": true
  },
  "banner": {
    "text": "REPLY IN 2 DAYS",
    "sub": "MESSAGE: hey \ud83d\udc4b \u00b7 SENT",
    "color": "#FFE27A",
    "x": 540,
    "y": 210,
    "instant": true
  },
  "vertical": true
};

const SHORT_SPECS: Record<string, ShortSpecEntry> = {
  "S1": {
    "kind": "scene",
    "cfg": {
      "id": "S1",
      "set": "bedroom",
      "cam": {
        "x": 810,
        "y": 540,
        "z": 0.95
      },
      "camEnd": {
        "x": 810,
        "y": 525,
        "z": 1.01
      },
      "pip": {
        "x": 670,
        "pose": "phoneHoldHigh",
        "scale": 0.98,
        "holdPhone": true
      },
      "phone": {
        "x": 610,
        "y": 1150,
        "scale": 0.88,
        "tilt": -2,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "timerLabel": "COUNTDOWN TO REPLY",
        "timerValue": "REPLY IN 48:00:00",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "hey \ud83d\udc4b",
            "status": "SENT \u00b7 24h ONE WAY"
          }
        ],
        "instant": true
      },
      "banner": {
        "text": "REPLY IN 2 DAYS",
        "sub": "MESSAGE: hey \ud83d\udc4b \u00b7 SENT",
        "color": "#FFE27A",
        "x": 540,
        "y": 210,
        "instant": true
      },
      "vertical": true
    }
  },
  "S2": {
    "kind": "scene",
    "cfg": {
      "id": "S2",
      "set": "bedroom",
      "cam": {
        "x": 720,
        "y": 545,
        "z": 1.32
      },
      "camEnd": {
        "x": 720,
        "y": 525,
        "z": 1.42
      },
      "pip": {
        "x": 720,
        "pose": "phoneShrug",
        "scale": 1.14,
        "holdPhone": true
      },
      "banner": {
        "text": "NOT IGNORING YOU",
        "sub": "48-HOUR SPEED OF LIGHT DELAY",
        "color": "#5BE08A"
      },
      "vertical": true
    }
  },
  "S3": {
    "kind": "scene",
    "cfg": {
      "id": "S3",
      "set": "lightday_ring",
      "cam": {
        "x": 1180,
        "y": 520,
        "z": 1.02
      },
      "camEnd": {
        "x": 1180,
        "y": 500,
        "z": 1.12
      },
      "bo": {
        "x": 1220,
        "y": 640,
        "pose": "waveHi",
        "scale": 0.98,
        "flip": -1,
        "helmet": true,
        "label": "BO \u00b7 1 LIGHT-DAY"
      },
      "shortBigNum": {
        "place": "FRIEND DISTANCE",
        "bigValue": "1 LIGHT-DAY",
        "subText": "24 HOURS OUT \u00b7 24 HOURS BACK",
        "color": "#7FD4FF",
        "y": 310
      },
      "vertical": true
    }
  },
  "S4": {
    "kind": "scene",
    "cfg": {
      "id": "S4",
      "set": "voyager_space",
      "cam": {
        "x": 960,
        "y": 510,
        "z": 1.1
      },
      "camEnd": {
        "x": 990,
        "y": 490,
        "z": 1.22
      },
      "voyagerProp": {
        "x": 960,
        "y": 640,
        "scale": 1.12,
        "rot": -16,
        "label": "VOYAGER 1 \u00b7 18 NOV 2026",
        "pulseColor": "#FFE27A"
      },
      "shortBigNum": {
        "place": "VOYAGER 1 MILESTONE",
        "bigValue": "18 NOV 2026",
        "subText": "REAL SPACECRAFT AT 1 LIGHT-DAY",
        "color": "#FFE27A",
        "y": 310
      },
      "vertical": true
    }
  },
  "S5": {
    "kind": "scene",
    "cfg": {
      "id": "S5",
      "set": "moon",
      "cam": {
        "x": 1160,
        "y": 555,
        "z": 1.18
      },
      "camEnd": {
        "x": 1160,
        "y": 535,
        "z": 1.28
      },
      "bo": {
        "x": 1160,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "banner": {
        "text": "STOP 1: THE MOON",
        "sub": "384,400 KM FROM EARTH",
        "color": "#7FD4FF"
      },
      "vertical": true
    }
  },
  "S6": {
    "kind": "diagram",
    "cfg": {
      "id": "S6",
      "mode": "light_speed_186k",
      "variant": 0,
      "title": "LIGHT SPEED: ~186,000 MI/S",
      "subtitle": "RADIO WAVES RACE ACROSS SPACE",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.02
      },
      "camEnd": {
        "x": 960,
        "y": 525,
        "z": 1.1
      },
      "shortBigNum": {
        "place": "SPEED OF LIGHT",
        "bigValue": "186,000 MI/S",
        "subText": "COSMIC SPEED LIMIT",
        "color": "#FFE27A",
        "y": 1560
      },
      "vertical": true
    }
  },
  "S7": {
    "kind": "scene",
    "cfg": {
      "id": "S7",
      "set": "moon",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.06
      },
      "camEnd": {
        "x": 940,
        "y": 520,
        "z": 1.15
      },
      "phone": {
        "x": 540,
        "y": 1180,
        "scale": 0.88,
        "tilt": 2,
        "header": "BO \u00b7 THE MOON",
        "timerLabel": "MOON ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#5BE08A",
        "videoCallBo": true,
        "messages": [
          {
            "from": "bo",
            "text": "hey from the Moon! \ud83c\udf15",
            "status": "1.3s ONE WAY"
          }
        ]
      },
      "shortBigNum": {
        "place": "THE MOON (384,400 KM)",
        "bigValue": "1.3 SEC",
        "subText": "ONE-WAY MESSAGE DELAY",
        "color": "#5BE08A",
        "y": 310
      },
      "vertical": true
    }
  },
  "S8": {
    "kind": "scene",
    "cfg": {
      "id": "S8",
      "set": "mars",
      "cam": {
        "x": 1080,
        "y": 560,
        "z": 1.18
      },
      "camEnd": {
        "x": 1080,
        "y": 540,
        "z": 1.28
      },
      "bo": {
        "x": 1080,
        "y": 805,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "banner": {
        "text": "STOP 2: MARS",
        "sub": "THE RED PLANET",
        "color": "#FF8A3D"
      },
      "vertical": true
    }
  },
  "S9": {
    "kind": "diagram",
    "cfg": {
      "id": "S9",
      "mode": "mars_orbit_3_to_22m",
      "variant": 1,
      "title": "MARS: UP TO 22 MINUTES",
      "subtitle": "3 TO 22 MINUTES DEPENDING ON ORBIT",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.04
      },
      "camEnd": {
        "x": 960,
        "y": 525,
        "z": 1.12
      },
      "shortBigNum": {
        "place": "MARS ORBIT RANGE",
        "bigValue": "3\u201322 MIN",
        "subText": "ONE-WAY RADIO DELAY",
        "color": "#FF8A3D",
        "y": 1560
      },
      "vertical": true
    }
  },
  "S10": {
    "kind": "scene",
    "cfg": {
      "id": "S10",
      "set": "kitchen",
      "setVariant": "tall",
      "cam": {
        "x": 800,
        "y": 540,
        "z": 1.12
      },
      "camEnd": {
        "x": 815,
        "y": 525,
        "z": 1.2
      },
      "pip": {
        "x": 755,
        "pose": "makeSandwich",
        "scale": 1.06
      },
      "shortBigNum": {
        "place": "MARS MAX DELAY",
        "bigValue": "22 MIN",
        "subText": "MAKE A WHOLE SANDWICH FIRST \ud83e\udd6a",
        "color": "#FF8A3D",
        "y": 310
      },
      "vertical": true
    }
  },
  "S11": {
    "kind": "scene",
    "cfg": {
      "id": "S11",
      "set": "neptune",
      "setVariant": "space",
      "cam": {
        "x": 960,
        "y": 500,
        "z": 1.12
      },
      "camEnd": {
        "x": 990,
        "y": 485,
        "z": 1.22
      },
      "banner": {
        "text": "STOP 3: NEPTUNE",
        "sub": "WINDY ICE GIANT",
        "color": "#7FD4FF"
      },
      "vertical": true
    }
  },
  "S12": {
    "kind": "scene",
    "cfg": {
      "id": "S12",
      "set": "neptune",
      "setVariant": "lunch",
      "cam": {
        "x": 670,
        "y": 555,
        "z": 1.14
      },
      "camEnd": {
        "x": 685,
        "y": 540,
        "z": 1.22
      },
      "pip": {
        "x": 650,
        "y": 760,
        "pose": "eatMeal",
        "scale": 1.06,
        "holdPhone": true
      },
      "shortBigNum": {
        "place": "NEPTUNE ONE-WAY",
        "bigValue": "4H 10M",
        "subText": "MORNING TEXT LANDS AT LUNCH",
        "color": "#7FD4FF",
        "y": 310
      },
      "vertical": true
    }
  },
  "S13": {
    "kind": "scene",
    "cfg": {
      "id": "S13",
      "set": "voyager2_twist",
      "cam": {
        "x": 1180,
        "y": 480,
        "z": 1.12
      },
      "camEnd": {
        "x": 1220,
        "y": 465,
        "z": 1.22
      },
      "banner": {
        "text": "STOP 4: ONE LIGHT-DAY",
        "sub": "THE 24-HOUR FRONTIER",
        "color": "#FFE27A"
      },
      "vertical": true
    }
  },
  "S14": {
    "kind": "diagram",
    "cfg": {
      "id": "S14",
      "mode": "lightday_scale_16b",
      "variant": 3,
      "title": "~16 BILLION MILES OUT",
      "subtitle": "ABOUT 26 BILLION KILOMETRES FROM EARTH",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.02
      },
      "camEnd": {
        "x": 960,
        "y": 525,
        "z": 1.1
      },
      "shortBigNum": {
        "place": "1 LIGHT-DAY DISTANCE",
        "bigValue": "16B MILES",
        "subText": "~26 BILLION KILOMETRES",
        "color": "#5BE08A",
        "y": 1560
      },
      "vertical": true
    }
  },
  "S15": {
    "kind": "scene",
    "cfg": {
      "id": "S15",
      "set": "dsn_desk",
      "cam": {
        "x": 960,
        "y": 520,
        "z": 1.08
      },
      "camEnd": {
        "x": 960,
        "y": 500,
        "z": 1.18
      },
      "extraChar": {
        "x": 960,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof"
      },
      "shortBigNum": {
        "place": "ONE LIGHT-DAY (~16B MI)",
        "bigValue": "24 HOURS",
        "subText": "24H EACH WAY \u00b7 48H ROUND TRIP",
        "color": "#FFE27A",
        "y": 310
      },
      "vertical": true
    }
  },
  "S16": {
    "kind": "scene",
    "cfg": {
      "id": "S16",
      "set": "voyager_space",
      "cam": {
        "x": 960,
        "y": 520,
        "z": 1.18
      },
      "camEnd": {
        "x": 990,
        "y": 500,
        "z": 1.3
      },
      "voyagerProp": {
        "x": 960,
        "y": 590,
        "scale": 1.22,
        "rot": -14,
        "highlightRecord": true,
        "label": "THE GOLDEN RECORD",
        "pulseColor": "#FFE27A"
      },
      "banner": {
        "text": "THE GOLDEN RECORD",
        "sub": "BOLTED TO VOYAGER 1",
        "color": "#FFE27A"
      },
      "vertical": true
    }
  },
  "S17": {
    "kind": "scene",
    "cfg": {
      "id": "S17",
      "set": "golden_record",
      "setVariant": "quote",
      "cam": {
        "x": 960,
        "y": 510,
        "z": 1.04
      },
      "camEnd": {
        "x": 960,
        "y": 495,
        "z": 1.12
      },
      "shortBigNum": {
        "place": "GOLDEN RECORD GREETINGS",
        "bigValue": "55 LANGUAGES",
        "subText": "\u201cHELLO FROM THE CHILDREN OF PLANET EARTH\u201d",
        "color": "#FFE27A",
        "y": 310
      },
      "vertical": true
    }
  },
  "S18": {
    "kind": "scene",
    "cfg": {
      "id": "S18",
      "set": "rooftop",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 900,
        "y": 555,
        "z": 0.98
      },
      "camEnd": {
        "x": 900,
        "y": 540,
        "z": 1.05
      },
      "pip": {
        "x": 790,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.04,
        "holdPhone": true
      },
      "bo": {
        "x": 1010,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.02,
        "flip": -1,
        "holdPhone": true
      },
      "banner": {
        "text": "WHO WOULD YOU TEXT FIRST?",
        "sub": "IF THE REPLY TOOK 2 DAYS",
        "color": "#FFE27A"
      },
      "vertical": true
    }
  },
  "S19": {
    "kind": "scene",
    "cfg": {
      "id": "S19",
      "set": "rooftop",
      "setVariant": "mars_jupiter_15_16nov",
      "cam": {
        "x": 900,
        "y": 520,
        "z": 1.08
      },
      "camEnd": {
        "x": 900,
        "y": 505,
        "z": 1.16
      },
      "pip": {
        "x": 780,
        "y": 790,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "celebrate",
        "scale": 1.04,
        "flip": -1
      },
      "banner": {
        "text": "FULL FILM ON THE CHANNEL",
        "sub": "IFMOSPHERE \u00b7 STEP INTO THE WHAT IF",
        "color": "#7FD4FF"
      },
      "vertical": true
    }
  }
};

function makeShortShot(id: string): React.FC<ShotProps> {
  const spec = SHORT_SPECS[id];
  const fn: React.FC<ShotProps> = ({ t, len }) => {
    if (spec.kind === 'diagram') {
      return <LightdayDiagramShot t={t} len={len} cfg={spec.cfg} />;
    }
    return <LightdaySceneShot t={t} len={len} cfg={spec.cfg} />;
  };
  return fn;
}

/** S20: Shows the 9:16 End Card for the first ~75% of the shot (including Board keyframe t=22),
 *  then transitions cleanly to the exact S1 Frame-0 phone state so the last frame loops seamlessly to frame 0!
 */
const S20Shot: React.FC<ShotProps> = ({ t, len }) => {
  const loopStart = Math.max(40, len - 18);
  const loopP = clamp((t - loopStart) / 12);
  const endCardCfg: LightdaySceneConfig = {
    id: 'S20_end',
    set: 'bedroom',
    vertical: true,
    cam: { x: 810, y: 540, z: 0.95 },
    pip: { x: 670, pose: 'phoneHoldHigh', scale: 0.98, holdPhone: true },
    phone: {
      x: 610, y: 1150, scale: 0.88, tilt: -2,
      header: 'BO · 1 LIGHT-DAY',
      timerLabel: 'COUNTDOWN TO REPLY',
      timerValue: 'REPLY IN 48:00:00',
      themeColor: '#7FD4FF',
      messages: [{ from: 'pip', text: 'hey 👋', status: 'SENT · 24h ONE WAY' }],
      instant: true,
    },
    endCard: '9x16',
  };
  if (loopP <= 0) {
    return <LightdaySceneShot t={t} len={len} cfg={endCardCfg} />;
  }
  if (loopP >= 1) {
    return <LightdaySceneShot t={0} len={94} cfg={FRAME0_CFG} />;
  }
  return (
    <g>
      <g opacity={1 - loopP}>
        <LightdaySceneShot t={t} len={len} cfg={endCardCfg} />
      </g>
      <g opacity={loopP}>
        <LightdaySceneShot t={0} len={94} cfg={FRAME0_CFG} />
      </g>
    </g>
  );
};

export const SHORT_SHOTS: ShotMap = {
  ...Object.fromEntries(Object.keys(SHORT_SPECS).map((k) => [k, makeShortShot(k)])),
  S20: S20Shot,
};
