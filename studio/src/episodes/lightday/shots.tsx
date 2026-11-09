import React from 'react';
import { ShotMap, ShotProps } from '../../engine';
import { LightdaySceneShot, LightdayDiagramShot, LightdaySceneConfig, LightdayDiagramConfig } from './stage';

type SpecEntry = { kind: 'scene'; cfg: LightdaySceneConfig } | { kind: 'diagram'; cfg: LightdayDiagramConfig };

const SHOT_SPECS: Record<string, SpecEntry> = {
  "S1": {
    "kind": "scene",
    "cfg": {
      "id": "S1",
      "set": "bedroom",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.05
      },
      "camEnd": {
        "x": 985,
        "y": 528,
        "z": 1.12
      },
      "pip": {
        "x": 580,
        "pose": "phoneHoldHigh",
        "scale": 1.12,
        "holdPhone": true
      },
      "phone": {
        "x": 1160,
        "y": 565,
        "scale": 0.96,
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
        "x": 960,
        "y": 112,
        "instant": true
      }
    }
  },
  "S2": {
    "kind": "scene",
    "cfg": {
      "id": "S2",
      "set": "bedroom",
      "cam": {
        "x": 620,
        "y": 540,
        "z": 1.48
      },
      "camEnd": {
        "x": 590,
        "y": 520,
        "z": 1.58
      },
      "pip": {
        "x": 540,
        "pose": "phoneShrug",
        "scale": 1.16,
        "holdPhone": true
      },
      "phone": {
        "x": 1340,
        "y": 545,
        "scale": 0.92,
        "tilt": 4,
        "header": "BO \u00b7 ACTIVE FRIEND",
        "timerLabel": "STATUS CHECK",
        "timerValue": "47:59:58 REMAINING",
        "themeColor": "#5BE08A",
        "messages": [
          {
            "from": "pip",
            "text": "hey \ud83d\udc4b",
            "status": "SENT \u00b7 IN FLIGHT"
          },
          {
            "from": "sys",
            "text": "NOT IGNORING YOU!",
            "status": "SIGNAL IN DEEP SPACE"
          }
        ]
      },
      "pill": {
        "label": "FRIEND STATUS",
        "value": "NOT IGNORING YOU",
        "color": "#5BE08A",
        "x": 86,
        "y": 86
      }
    }
  },
  "S3": {
    "kind": "scene",
    "cfg": {
      "id": "S3",
      "set": "lightday_ring",
      "cam": {
        "x": 960,
        "y": 520,
        "z": 1.02
      },
      "camEnd": {
        "x": 1040,
        "y": 500,
        "z": 1.14
      },
      "bo": {
        "x": 1460,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true,
        "label": "BO \u00b7 1 LIGHT-DAY"
      },
      "signalBeam": {
        "x1": 290,
        "y1": 520,
        "x2": 1420,
        "y2": 520,
        "color": "#FFE27A",
        "label": "1 LIGHT-DAY GAP"
      },
      "banner": {
        "text": "1 LIGHT-DAY AWAY",
        "sub": "~16 BILLION MILES FROM EARTH",
        "color": "#7FD4FF"
      }
    }
  },
  "S4": {
    "kind": "scene",
    "cfg": {
      "id": "S4",
      "set": "voyager_space",
      "cam": {
        "x": 960,
        "y": 500,
        "z": 1.08
      },
      "camEnd": {
        "x": 1020,
        "y": 480,
        "z": 1.22
      },
      "voyagerProp": {
        "x": 1040,
        "y": 540,
        "scale": 1.18,
        "rot": -16,
        "label": "VOYAGER 1 \u00b7 18 NOV 2026",
        "pulseColor": "#FFE27A"
      },
      "banner": {
        "text": "18 NOV 2026",
        "sub": "HISTORIC MILESTONE DATE",
        "color": "#FFE27A"
      }
    }
  },
  "S5": {
    "kind": "diagram",
    "cfg": {
      "id": "S5",
      "mode": "voyager1_timeline_49y",
      "variant": 0,
      "title": "18 NOV 2026 \u00b7 VOYAGER 1 REACHES 1 LIGHT-DAY",
      "subtitle": "A REAL NASA SPACECRAFT CROSSES THE 24-HOUR LIGHT MARK",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 1010,
        "y": 530,
        "z": 1.08
      }
    }
  },
  "S6": {
    "kind": "scene",
    "cfg": {
      "id": "S6",
      "set": "bedroom",
      "cam": {
        "x": 690,
        "y": 535,
        "z": 1.65
      },
      "camEnd": {
        "x": 660,
        "y": 515,
        "z": 1.78
      },
      "pip": {
        "x": 660,
        "pose": "phoneLook",
        "scale": 1.22,
        "holdPhone": true
      },
      "pill": {
        "label": "SCREEN GLOW",
        "value": "WAITING ON EARTH",
        "color": "#7FD4FF",
        "x": 1340,
        "y": 96
      }
    }
  },
  "S7": {
    "kind": "scene",
    "cfg": {
      "id": "S7",
      "set": "bedroom",
      "cam": {
        "x": 1180,
        "y": 540,
        "z": 1.32
      },
      "camEnd": {
        "x": 1220,
        "y": 525,
        "z": 1.44
      },
      "pip": {
        "x": 460,
        "pose": "phoneLook",
        "scale": 1.0,
        "holdPhone": true
      },
      "phone": {
        "x": 960,
        "y": 545,
        "scale": 1.06,
        "tilt": -4,
        "header": "ROUND-TRIP TIMER",
        "timerLabel": "48-HOUR COUNTDOWN",
        "timerValue": "47:59:49",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "hey \ud83d\udc4b",
            "status": "24h OUT + 24h BACK"
          }
        ]
      },
      "pill": {
        "label": "COUNTDOWN",
        "value": "48:00:00 TOTAL",
        "color": "#FFE27A",
        "x": 1410,
        "y": 92
      }
    }
  },
  "S8": {
    "kind": "scene",
    "cfg": {
      "id": "S8",
      "set": "voyager_space",
      "cam": {
        "x": 1120,
        "y": 470,
        "z": 1.35
      },
      "camEnd": {
        "x": 1180,
        "y": 450,
        "z": 1.52
      },
      "voyagerProp": {
        "x": 1160,
        "y": 480,
        "scale": 0.92,
        "rot": -22,
        "label": "COASTING IN THE DARK",
        "pulseColor": "#7FD4FF"
      },
      "signalBeam": {
        "x1": 240,
        "y1": 320,
        "x2": 1080,
        "y2": 480,
        "color": "#7FD4FF",
        "label": "24h RADIO PULSE"
      }
    }
  },
  "S9": {
    "kind": "scene",
    "cfg": {
      "id": "S9",
      "set": "bedroom",
      "cam": {
        "x": 920,
        "y": 485,
        "z": 1.18
      },
      "camEnd": {
        "x": 960,
        "y": 465,
        "z": 1.28
      },
      "pip": {
        "x": 740,
        "pose": "pointSky",
        "scale": 1.12,
        "holdPhone": true
      },
      "banner": {
        "text": "WHAT IF YOUR TEXT TOOK A DAY?",
        "color": "#FF8A3D",
        "y": 118
      }
    }
  },
  "S10": {
    "kind": "scene",
    "cfg": {
      "id": "S10",
      "set": "voyager_space",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 520,
        "z": 1.08
      },
      "voyagerProp": {
        "x": 1340,
        "y": 670,
        "scale": 0.88,
        "rot": -15,
        "pulseColor": "#FFE27A"
      },
      "pip": {
        "x": 520,
        "y": 860,
        "pose": "pointSky",
        "scale": 1.08,
        "holdPhone": true
      },
      "titleCard": {
        "x": 960,
        "y": 195,
        "size": 118
      }
    }
  },
  "S11": {
    "kind": "scene",
    "cfg": {
      "id": "S11",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 1132,
        "y": 419,
        "z": 1.55
      },
      "camEnd": {
        "x": 1194,
        "y": 426,
        "z": 1.75
      },
      "pip": {
        "x": 700,
        "pose": "celebrate",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1140,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "BACK IN YOUR BEDROOM ON EART",
        "color": "#A68CFF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S12": {
    "kind": "scene",
    "cfg": {
      "id": "S12",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 989,
        "y": 492,
        "z": 0.96
      },
      "camEnd": {
        "x": 913,
        "y": 488,
        "z": 1.12
      },
      "pip": {
        "x": 560,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1060,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "phone": {
        "x": 1340,
        "y": 540,
        "scale": 0.92,
        "tilt": -3,
        "header": "BO (EARTH)",
        "timerLabel": "EARTH DELAY",
        "timerValue": "INSTANT (~0.00s)",
        "themeColor": "#5BE08A",
        "messages": [
          {
            "from": "pip",
            "text": "\ud83d\udc4b hey Bo!",
            "status": "SENDING..."
          }
        ]
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "YOU SEND YOUR FRIEND BO A WA",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S13": {
    "kind": "scene",
    "cfg": {
      "id": "S13",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 936,
        "y": 555,
        "z": 1.07
      },
      "camEnd": {
        "x": 992,
        "y": 514,
        "z": 1.06
      },
      "pip": {
        "x": 630,
        "pose": "phoneLook",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1140,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "phone": {
        "x": 960,
        "y": 540,
        "scale": 1.04,
        "tilt": 2,
        "header": "BO (EARTH)",
        "timerLabel": "DELIVERY STATUS",
        "timerValue": "\u2713\u2713 DELIVERED",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "\ud83d\udc4b hey Bo!",
            "status": "DELIVERED IN A BLINK"
          }
        ]
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "THE BUBBLE TURNS DELIVERED,",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S14": {
    "kind": "scene",
    "cfg": {
      "id": "S14",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 853,
        "y": 449,
        "z": 1.3
      },
      "camEnd": {
        "x": 941,
        "y": 445,
        "z": 1.31
      },
      "pip": {
        "x": 700,
        "pose": "phoneShrug",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1060,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "phone": {
        "x": 560,
        "y": 545,
        "scale": 0.94,
        "tilt": -4,
        "header": "BO (EARTH)",
        "timerLabel": "INSTANT REPLY",
        "timerValue": "0.01 SECONDS",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "\ud83d\udc4b hey Bo!",
            "status": "DELIVERED"
          },
          {
            "from": "bo",
            "text": "\ud83d\ude02 hahaha!!",
            "status": "JUST NOW"
          }
        ]
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "AND BO FIRES BACK A LAUGHING",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S15": {
    "kind": "scene",
    "cfg": {
      "id": "S15",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 1370,
        "y": 572,
        "z": 1.49
      },
      "camEnd": {
        "x": 1365,
        "y": 566,
        "z": 1.68
      },
      "pip": {
        "x": 560,
        "pose": "waveHi",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1140,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "signalBeam": {
        "x1": 620,
        "y1": 650,
        "x2": 1080,
        "y2": 650,
        "color": "#5BE08A",
        "label": "RADIO WAVE"
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "THAT IS BECAUSE YOUR MESSAGE",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S16": {
    "kind": "diagram",
    "cfg": {
      "id": "S16",
      "mode": "light_speed_186k",
      "variant": 0,
      "title": "RADIO WAVES = LIGHT SPEED",
      "subtitle": "ABOUT 186,000 MILES EVERY SECOND AROUND EARTH",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1217,
        "y": 520,
        "z": 1.25
      },
      "camEnd": {
        "x": 1129,
        "y": 468,
        "z": 1.43
      }
    }
  },
  "S17": {
    "kind": "diagram",
    "cfg": {
      "id": "S17",
      "mode": "light_speed_186k",
      "variant": 1,
      "title": "186,000 MILES PER SECOND",
      "subtitle": "ABOUT 186,000 MILES EVERY SECOND AROUND EARTH",
      "accentColor": "#7FD4FF",
      "cam": {
        "x": 1244,
        "y": 509,
        "z": 1.38
      },
      "camEnd": {
        "x": 1318,
        "y": 504,
        "z": 1.56
      }
    }
  },
  "S18": {
    "kind": "scene",
    "cfg": {
      "id": "S18",
      "set": "voyager_space",
      "cam": {
        "x": 531,
        "y": 577,
        "z": 1.65
      },
      "camEnd": {
        "x": 542,
        "y": 565,
        "z": 1.7
      },
      "signalBeam": {
        "x1": 240,
        "y1": 520,
        "x2": 1680,
        "y2": 520,
        "color": "#FFE27A",
        "label": "186,000 MI/S LIMIT"
      },
      "banner": {
        "text": "NOTHING TRAVELS FASTER",
        "sub": "UNIVERSAL SPEED LIMIT: ~186,000 MI/S",
        "color": "#FFE27A"
      }
    }
  },
  "S19": {
    "kind": "scene",
    "cfg": {
      "id": "S19",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 768,
        "y": 525,
        "z": 1.36
      },
      "camEnd": {
        "x": 786,
        "y": 511,
        "z": 1.39
      },
      "pip": {
        "x": 630,
        "pose": "celebrate",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1140,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "phone": {
        "x": 1360,
        "y": 555,
        "scale": 0.88,
        "tilt": 5,
        "header": "EARTH NETWORK",
        "timerLabel": "SPEED HIDES GAP",
        "timerValue": "186,000 MI / SEC",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "sys",
            "text": "ZERO NOTICEABLE LAG ON EARTH",
            "status": "LIGHT SPEED"
          }
        ]
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "ON EARTH, THAT SPEED HIDES T",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S20": {
    "kind": "scene",
    "cfg": {
      "id": "S20",
      "set": "bedroom",
      "setVariant": "instant",
      "cam": {
        "x": 665,
        "y": 563,
        "z": 1.36
      },
      "camEnd": {
        "x": 605,
        "y": 508,
        "z": 1.54
      },
      "pip": {
        "x": 700,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1060,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": false,
        "holdPhone": true
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "BUT THE RULE IS SIMPLE:",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S21": {
    "kind": "diagram",
    "cfg": {
      "id": "S21",
      "mode": "distance_equals_delay",
      "variant": 0,
      "title": "THE COSMIC RULE: DISTANCE = DELAY",
      "subtitle": "FARTHER FRIEND = LONGER WAIT FOR EVERY BUBBLE",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 530,
        "z": 1.06
      }
    }
  },
  "S22": {
    "kind": "scene",
    "cfg": {
      "id": "S22",
      "set": "bedroom",
      "setVariant": "suitcase",
      "cam": {
        "x": 949,
        "y": 490,
        "z": 0.96
      },
      "camEnd": {
        "x": 963,
        "y": 510,
        "z": 1.12
      },
      "pip": {
        "x": 630,
        "pose": "phoneShrug",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1060,
        "pose": "celebrate",
        "scale": 1.06,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "CHAPTER 1 \u00b7 EARTH",
        "value": "SO WHAT HAPPENS WHEN BO LEAV",
        "color": "#FF6A5A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S23": {
    "kind": "scene",
    "cfg": {
      "id": "S23",
      "set": "moon",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "THE MOON",
        "sub": "DISTANCE: 384,400 KM \u00b7 ONE-WAY DELAY: 1.3 SECONDS",
        "color": "#7FD4FF",
        "mode": "hero"
      }
    }
  },
  "S24": {
    "kind": "scene",
    "cfg": {
      "id": "S24",
      "set": "moon",
      "cam": {
        "x": 1143,
        "y": 412,
        "z": 1.64
      },
      "camEnd": {
        "x": 1161,
        "y": 393,
        "z": 1.69
      },
      "bo": {
        "x": 1285,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#7FD4FF",
        "x": 1380,
        "y": 88
      }
    }
  },
  "S25": {
    "kind": "scene",
    "cfg": {
      "id": "S25",
      "set": "moon",
      "cam": {
        "x": 380,
        "y": 320,
        "z": 1.65
      },
      "camEnd": {
        "x": 420,
        "y": 300,
        "z": 1.78
      },
      "bo": {
        "x": 1340,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "banner": {
        "text": "384,400 KILOMETRES",
        "sub": "EARTH TO MOON GAP",
        "color": "#7FD4FF"
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#FFE27A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S26": {
    "kind": "scene",
    "cfg": {
      "id": "S26",
      "set": "moon",
      "cam": {
        "x": 947,
        "y": 548,
        "z": 1.01
      },
      "camEnd": {
        "x": 959,
        "y": 525,
        "z": 1.15
      },
      "bo": {
        "x": 1395,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#5BE08A",
        "videoCallBo": false,
        "messages": [
          {
            "from": "sys",
            "text": "MOON DISTANCE: 384,400 KM",
            "status": "LASER / RADIO LINK"
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#5BE08A",
        "x": 1380,
        "y": 88
      }
    }
  },
  "S27": {
    "kind": "diagram",
    "cfg": {
      "id": "S27",
      "mode": "moon_vs_artemis",
      "variant": 1,
      "title": "ARTEMIS II (~3 DAYS) VS YOUR TEXT (1.3 SECONDS)",
      "subtitle": "MOON DISTANCE: 384,400 KM FROM EARTH",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 864,
        "y": 486,
        "z": 1.24
      },
      "camEnd": {
        "x": 908,
        "y": 456,
        "z": 1.4
      }
    }
  },
  "S28": {
    "kind": "diagram",
    "cfg": {
      "id": "S28",
      "mode": "moon_vs_artemis",
      "variant": 0,
      "title": "ARTEMIS II (~3 DAYS) VS YOUR TEXT (1.3 SECONDS)",
      "subtitle": "MOON DISTANCE: 384,400 KM FROM EARTH",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 1381,
        "y": 565,
        "z": 1.58
      },
      "camEnd": {
        "x": 1402,
        "y": 533,
        "z": 1.62
      }
    }
  },
  "S29": {
    "kind": "diagram",
    "cfg": {
      "id": "S29",
      "mode": "moon_vs_artemis",
      "variant": 1,
      "title": "ARTEMIS II (~3 DAYS) VS YOUR TEXT (1.3 SECONDS)",
      "subtitle": "MOON DISTANCE: 384,400 KM FROM EARTH",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 1158,
        "y": 513,
        "z": 1.34
      },
      "camEnd": {
        "x": 1166,
        "y": 479,
        "z": 1.37
      }
    }
  },
  "S30": {
    "kind": "scene",
    "cfg": {
      "id": "S30",
      "set": "moon",
      "cam": {
        "x": 1255,
        "y": 546,
        "z": 1.32
      },
      "camEnd": {
        "x": 1285,
        "y": 515,
        "z": 1.5
      },
      "bo": {
        "x": 1285,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#7FD4FF",
        "videoCallBo": false,
        "messages": [
          {
            "from": "pip",
            "text": "how's the Moon? \ud83c\udf15",
            "status": "1.3s ONE WAY"
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#7FD4FF",
        "x": 1380,
        "y": 88
      }
    }
  },
  "S31": {
    "kind": "scene",
    "cfg": {
      "id": "S31",
      "set": "moon",
      "cam": {
        "x": 542,
        "y": 570,
        "z": 1.59
      },
      "camEnd": {
        "x": 509,
        "y": 576,
        "z": 1.79
      },
      "bo": {
        "x": 1340,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#FFE27A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S32": {
    "kind": "scene",
    "cfg": {
      "id": "S32",
      "set": "moon",
      "cam": {
        "x": 779,
        "y": 518,
        "z": 1.3
      },
      "camEnd": {
        "x": 823,
        "y": 478,
        "z": 1.48
      },
      "bo": {
        "x": 1395,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#5BE08A",
        "videoCallBo": true,
        "messages": [
          {
            "from": "sys",
            "text": "VIDEO CALL CONNECTED",
            "status": "ROUND-TRIP LAG: 2.6s"
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#5BE08A",
        "x": 1380,
        "y": 88
      }
    }
  },
  "S33": {
    "kind": "scene",
    "cfg": {
      "id": "S33",
      "set": "moon",
      "cam": {
        "x": 606,
        "y": 556,
        "z": 1.45
      },
      "camEnd": {
        "x": 642,
        "y": 519,
        "z": 1.48
      },
      "bo": {
        "x": 1285,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pip": {
        "x": 380,
        "y": 790,
        "pose": "talkOver",
        "scale": 0.98,
        "holdPhone": true
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": 3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#FF8A3D",
        "videoCallBo": true,
        "messages": [
          {
            "from": "pip",
            "text": "can you hear me?",
            "status": "TRAVELING 1.3s..."
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#FF8A3D",
        "x": 86,
        "y": 88
      }
    }
  },
  "S34": {
    "kind": "scene",
    "cfg": {
      "id": "S34",
      "set": "moon",
      "cam": {
        "x": 1103,
        "y": 410,
        "z": 1.64
      },
      "camEnd": {
        "x": 1141,
        "y": 415,
        "z": 1.69
      },
      "bo": {
        "x": 1340,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#FF6A5A",
        "videoCallBo": true,
        "messages": [
          {
            "from": "sys",
            "text": "... AWKWARD SILENCE ...",
            "status": "WAITING 2.6 SECONDS"
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#FF6A5A",
        "x": 1380,
        "y": 88
      }
    }
  },
  "S35": {
    "kind": "scene",
    "cfg": {
      "id": "S35",
      "set": "moon",
      "cam": {
        "x": 960,
        "y": 483,
        "z": 0.9
      },
      "camEnd": {
        "x": 930,
        "y": 521,
        "z": 1.06
      },
      "bo": {
        "x": 1395,
        "y": 790,
        "pose": "talkOver",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pip": {
        "x": 380,
        "y": 790,
        "pose": "talkOver",
        "scale": 0.98,
        "holdPhone": true
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": 3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#A68CFF",
        "videoCallBo": true,
        "messages": [
          {
            "from": "pip",
            "text": "Wait so I was\u2014",
            "status": "TALKING OVER!"
          },
          {
            "from": "bo",
            "text": "\u2014Yeah it's great!",
            "status": "COLLISION!"
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#A68CFF",
        "x": 86,
        "y": 88
      }
    }
  },
  "S36": {
    "kind": "scene",
    "cfg": {
      "id": "S36",
      "set": "moon",
      "cam": {
        "x": 977,
        "y": 546,
        "z": 1.01
      },
      "camEnd": {
        "x": 1009,
        "y": 503,
        "z": 1.15
      },
      "bo": {
        "x": 1285,
        "y": 790,
        "pose": "talkOver",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MOON BASE",
        "subHeader": "384,400 KM AWAY",
        "timerLabel": "ONE-WAY DELAY",
        "timerValue": "1.3 SECONDS",
        "themeColor": "#7FD4FF",
        "videoCallBo": true,
        "messages": [
          {
            "from": "pip",
            "text": "Sorry you go! \ud83d\ude05",
            "status": "+1.3s"
          },
          {
            "from": "bo",
            "text": "No sorry YOU go! \ud83d\ude2c",
            "status": "+1.3s"
          }
        ]
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#7FD4FF",
        "x": 1380,
        "y": 88
      }
    }
  },
  "S37": {
    "kind": "scene",
    "cfg": {
      "id": "S37",
      "set": "moon",
      "cam": {
        "x": 894,
        "y": 484,
        "z": 1.24
      },
      "camEnd": {
        "x": 888,
        "y": 434,
        "z": 1.4
      },
      "bo": {
        "x": 1340,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "THE MOON",
        "value": "384,400 KM \u00b7 1.3 SEC",
        "color": "#FFE27A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S38": {
    "kind": "scene",
    "cfg": {
      "id": "S38",
      "set": "bedroom_sunrise",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "THE SUN",
        "sub": "SUNLIGHT TRAVEL TIME: 8 MINUTES 20 SECONDS",
        "color": "#FFE27A",
        "mode": "hero"
      }
    }
  },
  "S39": {
    "kind": "scene",
    "cfg": {
      "id": "S39",
      "set": "bedroom_sunrise",
      "setVariant": "sunrise",
      "cam": {
        "x": 958,
        "y": 541,
        "z": 1.1
      },
      "camEnd": {
        "x": 996,
        "y": 536,
        "z": 1.09
      },
      "pip": {
        "x": 660,
        "pose": "phoneLook",
        "scale": 1.12,
        "sunglasses": false,
        "holdPhone": false
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S40": {
    "kind": "scene",
    "cfg": {
      "id": "S40",
      "set": "bedroom_sunrise",
      "setVariant": "sunrise",
      "cam": {
        "x": 875,
        "y": 479,
        "z": 1.18
      },
      "camEnd": {
        "x": 945,
        "y": 423,
        "z": 1.34
      },
      "pip": {
        "x": 725,
        "pose": "pointSky",
        "scale": 1.12,
        "sunglasses": false,
        "holdPhone": false
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S41": {
    "kind": "diagram",
    "cfg": {
      "id": "S41",
      "mode": "sun_8m20s",
      "variant": 1,
      "title": "SUNLIGHT LEFT THE SUN 8 MIN 20 SEC AGO",
      "subtitle": "MORNING LIGHT ARRIVES FROM THE PAST",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1392,
        "y": 558,
        "z": 1.52
      },
      "camEnd": {
        "x": 1369,
        "y": 544,
        "z": 1.71
      }
    }
  },
  "S42": {
    "kind": "diagram",
    "cfg": {
      "id": "S42",
      "mode": "sun_8m20s",
      "variant": 0,
      "title": "SUNLIGHT LEFT THE SUN 8 MIN 20 SEC AGO",
      "subtitle": "MORNING LIGHT ARRIVES FROM THE PAST",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1169,
        "y": 506,
        "z": 1.28
      },
      "camEnd": {
        "x": 1133,
        "y": 490,
        "z": 1.46
      }
    }
  },
  "S43": {
    "kind": "scene",
    "cfg": {
      "id": "S43",
      "set": "bedroom_sunrise",
      "setVariant": "sunrise",
      "cam": {
        "x": 1266,
        "y": 539,
        "z": 1.41
      },
      "camEnd": {
        "x": 1322,
        "y": 526,
        "z": 1.44
      },
      "pip": {
        "x": 725,
        "pose": "pointSky",
        "scale": 1.12,
        "sunglasses": false,
        "holdPhone": false
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S44": {
    "kind": "scene",
    "cfg": {
      "id": "S44",
      "set": "bedroom_sunrise",
      "setVariant": "shades",
      "cam": {
        "x": 553,
        "y": 563,
        "z": 1.68
      },
      "camEnd": {
        "x": 546,
        "y": 543,
        "z": 1.73
      },
      "pip": {
        "x": 790,
        "pose": "sunglassesCool",
        "scale": 1.12,
        "sunglasses": true,
        "holdPhone": false
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S45": {
    "kind": "scene",
    "cfg": {
      "id": "S45",
      "set": "bedroom_sunrise",
      "setVariant": "shades",
      "cam": {
        "x": 790,
        "y": 511,
        "z": 1.24
      },
      "camEnd": {
        "x": 790,
        "y": 489,
        "z": 1.42
      },
      "pip": {
        "x": 660,
        "pose": "phoneLook",
        "scale": 1.12,
        "sunglasses": true,
        "holdPhone": false
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S46": {
    "kind": "scene",
    "cfg": {
      "id": "S46",
      "set": "bedroom_sunrise",
      "setVariant": "shades",
      "cam": {
        "x": 617,
        "y": 549,
        "z": 1.39
      },
      "camEnd": {
        "x": 609,
        "y": 530,
        "z": 1.57
      },
      "pip": {
        "x": 725,
        "pose": "sunglassesCool",
        "scale": 1.12,
        "sunglasses": true,
        "holdPhone": false
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S47": {
    "kind": "scene",
    "cfg": {
      "id": "S47",
      "set": "bedroom_sunrise",
      "setVariant": "sunrise",
      "cam": {
        "x": 1114,
        "y": 447,
        "z": 1.58
      },
      "camEnd": {
        "x": 1178,
        "y": 426,
        "z": 1.78
      },
      "pip": {
        "x": 790,
        "pose": "phoneLook",
        "scale": 1.12,
        "sunglasses": false,
        "holdPhone": true
      },
      "phone": {
        "x": 1350,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "SOLAR DISTANCE",
        "timerLabel": "ONE-WAY LIGHT TIME",
        "timerValue": "08 MIN 20 SEC",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "sys",
            "text": "8m 20s BREAKS LIVE CHAT",
            "status": "ROUND-TRIP: 16m 40s"
          }
        ]
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S48": {
    "kind": "scene",
    "cfg": {
      "id": "S48",
      "set": "bedroom_sunrise",
      "setVariant": "suitcase",
      "cam": {
        "x": 971,
        "y": 476,
        "z": 0.99
      },
      "camEnd": {
        "x": 897,
        "y": 488,
        "z": 1.0
      },
      "pip": {
        "x": 660,
        "pose": "phoneLook",
        "scale": 1.12,
        "sunglasses": false,
        "holdPhone": false
      },
      "bo": {
        "x": 1080,
        "pose": "waveHi",
        "scale": 1.06,
        "flip": -1,
        "helmet": true,
        "label": "OFF TO MARS!"
      },
      "pill": {
        "label": "SOLAR DELAY",
        "value": "8 MIN 20 SEC AGO",
        "color": "#FFE27A",
        "x": 84,
        "y": 88
      }
    }
  },
  "S49": {
    "kind": "scene",
    "cfg": {
      "id": "S49",
      "set": "mars",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "MARS",
        "sub": "ONE-WAY DELAY: 3 TO 22 MINUTES",
        "color": "#FF8A3D",
        "mode": "hero"
      }
    }
  },
  "S50": {
    "kind": "scene",
    "cfg": {
      "id": "S50",
      "set": "mars",
      "cam": {
        "x": 1220,
        "y": 640,
        "z": 1.55
      },
      "camEnd": {
        "x": 1260,
        "y": 620,
        "z": 1.68
      },
      "bo": {
        "x": 1280,
        "y": 805,
        "pose": "waveHi",
        "scale": 1.1,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "banner": {
        "text": "BO LANDS ON MARS",
        "sub": "THE RED PLANET HABITAT",
        "color": "#FF8A3D"
      },
      "fgSilhouettes": "rocks_low",
      "pill": {
        "label": "MARS ORBIT",
        "value": "3 TO 22 MIN ONE WAY",
        "color": "#FF8A3D",
        "x": 84,
        "y": 88
      }
    }
  },
  "S51": {
    "kind": "scene",
    "cfg": {
      "id": "S51",
      "set": "mars",
      "cam": {
        "x": 952,
        "y": 471,
        "z": 0.93
      },
      "camEnd": {
        "x": 954,
        "y": 521,
        "z": 1.09
      },
      "bo": {
        "x": 1160,
        "y": 805,
        "pose": "phoneHoldHigh",
        "scale": 1.1,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MARS COLONY",
        "timerLabel": "MARS DELAY",
        "timerValue": "3 TO 22 MIN",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "what's up?",
            "status": "MARS LINK"
          },
          {
            "from": "sys",
            "text": "VIDEO CALLS IMPOSSIBLE",
            "status": "USE VOICE NOTES"
          }
        ]
      },
      "fgSilhouettes": "none",
      "pill": {
        "label": "MARS ORBIT",
        "value": "3 TO 22 MIN ONE WAY",
        "color": "#FF8A3D",
        "x": 84,
        "y": 88
      }
    }
  },
  "S52": {
    "kind": "diagram",
    "cfg": {
      "id": "S52",
      "mode": "mars_orbit_3_to_22m",
      "variant": 0,
      "title": "MARS DELAY: 3 TO 22 MINUTES ONE WAY",
      "subtitle": "DEPENDS ON WHERE EARTH AND MARS SIT IN ORBIT",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 969,
        "y": 534,
        "z": 1.04
      },
      "camEnd": {
        "x": 963,
        "y": 503,
        "z": 1.18
      }
    }
  },
  "S53": {
    "kind": "diagram",
    "cfg": {
      "id": "S53",
      "mode": "mars_orbit_3_to_22m",
      "variant": 1,
      "title": "MARS DELAY: 3 TO 22 MINUTES ONE WAY",
      "subtitle": "DEPENDS ON WHERE EARTH AND MARS SIT IN ORBIT",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 886,
        "y": 472,
        "z": 1.27
      },
      "camEnd": {
        "x": 912,
        "y": 434,
        "z": 1.28
      }
    }
  },
  "S54": {
    "kind": "scene",
    "cfg": {
      "id": "S54",
      "set": "mars",
      "cam": {
        "x": 1333,
        "y": 595,
        "z": 1.61
      },
      "camEnd": {
        "x": 1406,
        "y": 555,
        "z": 1.65
      },
      "bo": {
        "x": 1160,
        "y": 805,
        "pose": "phoneHoldHigh",
        "scale": 1.1,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 540,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MARS COLONY",
        "timerLabel": "MARS DELAY",
        "timerValue": "3 TO 22 MIN",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "what's up?",
            "status": "MARS LINK"
          },
          {
            "from": "sys",
            "text": "VIDEO CALLS IMPOSSIBLE",
            "status": "USE VOICE NOTES"
          }
        ]
      },
      "fgSilhouettes": "rocks_low",
      "pill": {
        "label": "MARS ORBIT",
        "value": "3 TO 22 MIN ONE WAY",
        "color": "#FF8A3D",
        "x": 84,
        "y": 88
      }
    }
  },
  "S55": {
    "kind": "scene",
    "cfg": {
      "id": "S55",
      "set": "kitchen",
      "setVariant": "normal",
      "cam": {
        "x": 1180,
        "y": 499,
        "z": 1.22
      },
      "camEnd": {
        "x": 1170,
        "y": 501,
        "z": 1.4
      },
      "pip": {
        "x": 770,
        "pose": "makeSandwich",
        "scale": 1.08
      },
      "pill": {
        "label": "SANDWICH TEST",
        "value": "3 TO 22 MIN WAIT",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S56": {
    "kind": "scene",
    "cfg": {
      "id": "S56",
      "set": "kitchen",
      "setVariant": "tall",
      "cam": {
        "x": 1277,
        "y": 532,
        "z": 1.35
      },
      "camEnd": {
        "x": 1289,
        "y": 493,
        "z": 1.53
      },
      "pip": {
        "x": 820,
        "pose": "makeSandwich",
        "scale": 1.08
      },
      "pill": {
        "label": "SANDWICH TEST",
        "value": "3 TO 22 MIN WAIT",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S57": {
    "kind": "scene",
    "cfg": {
      "id": "S57",
      "set": "kitchen",
      "setVariant": "tall",
      "cam": {
        "x": 564,
        "y": 600,
        "z": 1.62
      },
      "camEnd": {
        "x": 513,
        "y": 554,
        "z": 1.82
      },
      "pip": {
        "x": 720,
        "pose": "eatMeal",
        "scale": 1.08
      },
      "phone": {
        "x": 1410,
        "y": 545,
        "scale": 0.94,
        "tilt": 3,
        "header": "BO \u00b7 MARS BASE",
        "timerLabel": "MARS ONE-WAY DELAY",
        "timerValue": "22:00 MINUTES",
        "themeColor": "#FF8A3D",
        "typing": true,
        "messages": [
          {
            "from": "pip",
            "text": "what's up? \ud83e\udd6a",
            "status": "SENT 22 MIN AGO"
          }
        ]
      },
      "pill": {
        "label": "SANDWICH TEST",
        "value": "3 TO 22 MIN WAIT",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S58": {
    "kind": "scene",
    "cfg": {
      "id": "S58",
      "set": "mars",
      "cam": {
        "x": 731,
        "y": 504,
        "z": 1.33
      },
      "camEnd": {
        "x": 827,
        "y": 500,
        "z": 1.36
      },
      "bo": {
        "x": 1220,
        "y": 805,
        "pose": "phoneHoldHigh",
        "scale": 1.1,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 540,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MARS COLONY",
        "timerLabel": "MARS DELAY",
        "timerValue": "3 TO 22 MIN",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "\ud83c\udfa4 Voice Note (3:42)",
            "status": "MARS LINK"
          },
          {
            "from": "sys",
            "text": "VIDEO CALLS IMPOSSIBLE",
            "status": "USE VOICE NOTES"
          }
        ]
      },
      "fgSilhouettes": "rocks_low",
      "pill": {
        "label": "MARS ORBIT",
        "value": "3 TO 22 MIN ONE WAY",
        "color": "#FF8A3D",
        "x": 84,
        "y": 88
      }
    }
  },
  "S59": {
    "kind": "scene",
    "cfg": {
      "id": "S59",
      "set": "mars",
      "cam": {
        "x": 628,
        "y": 542,
        "z": 1.48
      },
      "camEnd": {
        "x": 576,
        "y": 541,
        "z": 1.51
      },
      "bo": {
        "x": 1280,
        "y": 805,
        "pose": "phoneHoldHigh",
        "scale": 1.1,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 MARS COLONY",
        "timerLabel": "MARS DELAY",
        "timerValue": "3 TO 22 MIN",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "\ud83c\udfa4 Voice Note (3:42)",
            "status": "MARS LINK"
          },
          {
            "from": "bo",
            "text": "\ud83c\udfa4 Voice Note (5:18)",
            "status": "NO LIVE CALLS"
          }
        ]
      },
      "fgSilhouettes": "none",
      "pill": {
        "label": "MARS ORBIT",
        "value": "3 TO 22 MIN ONE WAY",
        "color": "#FF8A3D",
        "x": 84,
        "y": 88
      }
    }
  },
  "S60": {
    "kind": "diagram",
    "cfg": {
      "id": "S60",
      "mode": "mars_orbit_3_to_22m",
      "variant": 0,
      "title": "MARS DELAY: 3 TO 22 MINUTES ONE WAY",
      "subtitle": "DEPENDS ON WHERE EARTH AND MARS SIT IN ORBIT",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 1125,
        "y": 440,
        "z": 1.52
      },
      "camEnd": {
        "x": 1145,
        "y": 393,
        "z": 1.72
      }
    }
  },
  "S61": {
    "kind": "scene",
    "cfg": {
      "id": "S61",
      "set": "conjunction",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "MARS CONJUNCTION",
        "sub": "EVERY ~26 MONTHS \u00b7 SOLAR BLACKOUT: WEEKS",
        "color": "#FF5A4A",
        "mode": "hero"
      }
    }
  },
  "S62": {
    "kind": "diagram",
    "cfg": {
      "id": "S62",
      "mode": "mars_conjunction_26mo",
      "variant": 0,
      "title": "SOLAR CONJUNCTION: EVERY ~26 MONTHS",
      "subtitle": "SUN BLOCKS THE SIGNAL \u00b7 BLACKOUT CAN LAST WEEKS",
      "accentColor": "#FF5A4A",
      "cam": {
        "x": 609,
        "y": 537,
        "z": 1.42
      },
      "camEnd": {
        "x": 633,
        "y": 530,
        "z": 1.6
      }
    }
  },
  "S63": {
    "kind": "diagram",
    "cfg": {
      "id": "S63",
      "mode": "mars_conjunction_26mo",
      "variant": 1,
      "title": "SOLAR CONJUNCTION: EVERY ~26 MONTHS",
      "subtitle": "SUN BLOCKS THE SIGNAL \u00b7 BLACKOUT CAN LAST WEEKS",
      "accentColor": "#FF5A4A",
      "cam": {
        "x": 1106,
        "y": 435,
        "z": 1.61
      },
      "camEnd": {
        "x": 1132,
        "y": 426,
        "z": 1.66
      }
    }
  },
  "S64": {
    "kind": "scene",
    "cfg": {
      "id": "S64",
      "set": "conjunction",
      "cam": {
        "x": 963,
        "y": 508,
        "z": 1.02
      },
      "camEnd": {
        "x": 921,
        "y": 488,
        "z": 1.03
      },
      "bo": {
        "x": 1240,
        "y": 805,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "CONJUNCTION BLACKOUT",
        "value": "EVERY ~26 MONTHS \u00b7 WEEKS",
        "color": "#FF5A4A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S65": {
    "kind": "diagram",
    "cfg": {
      "id": "S65",
      "mode": "mars_conjunction_26mo",
      "variant": 1,
      "title": "SOLAR CONJUNCTION: EVERY ~26 MONTHS",
      "subtitle": "SUN BLOCKS THE SIGNAL \u00b7 BLACKOUT CAN LAST WEEKS",
      "accentColor": "#FF5A4A",
      "cam": {
        "x": 980,
        "y": 527,
        "z": 0.98
      },
      "camEnd": {
        "x": 1000,
        "y": 514,
        "z": 1.12
      }
    }
  },
  "S66": {
    "kind": "diagram",
    "cfg": {
      "id": "S66",
      "mode": "mars_conjunction_26mo",
      "variant": 0,
      "title": "SOLAR CONJUNCTION: EVERY ~26 MONTHS",
      "subtitle": "SUN BLOCKS THE SIGNAL \u00b7 BLACKOUT CAN LAST WEEKS",
      "accentColor": "#FF5A4A",
      "cam": {
        "x": 827,
        "y": 465,
        "z": 1.21
      },
      "camEnd": {
        "x": 949,
        "y": 445,
        "z": 1.37
      }
    }
  },
  "S67": {
    "kind": "scene",
    "cfg": {
      "id": "S67",
      "set": "bedroom",
      "setVariant": "blackout",
      "cam": {
        "x": 1180,
        "y": 480,
        "z": 1.25
      },
      "camEnd": {
        "x": 1220,
        "y": 465,
        "z": 1.36
      },
      "pip": {
        "x": 690,
        "pose": "phoneHoldHigh",
        "scale": 1.14,
        "holdPhone": true
      },
      "phone": {
        "x": 480,
        "y": 545,
        "scale": 1.06,
        "tilt": 6,
        "header": "MARS LINK LOST",
        "timerLabel": "SOLAR CONJUNCTION",
        "timerValue": "NO SIGNAL (SUN IN THE WAY)",
        "themeColor": "#FF5A4A",
        "blackout": true,
        "messages": [
          {
            "from": "sys",
            "text": "NO SIGNAL (SUN IN THE WAY)",
            "status": "BLACKOUT: WEEKS"
          },
          {
            "from": "pip",
            "text": "Bo?? Resend!! \ud83d\ude2d",
            "status": "FAILED \u00b7 EVERY 26 MO"
          }
        ]
      },
      "banner": {
        "text": "RED WARNING: SIGNAL BLOCKED",
        "sub": "EVERY ~26 MONTHS \u00b7 LASTS WEEKS",
        "color": "#FF5A4A"
      }
    }
  },
  "S68": {
    "kind": "scene",
    "cfg": {
      "id": "S68",
      "set": "bedroom",
      "setVariant": "blackout",
      "cam": {
        "x": 740,
        "y": 540,
        "z": 1.15
      },
      "camEnd": {
        "x": 780,
        "y": 525,
        "z": 1.24
      },
      "pip": {
        "x": 800,
        "pose": "phoneHoldHigh",
        "scale": 1.14,
        "holdPhone": true
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.92,
        "tilt": -5,
        "header": "MARS LINK LOST",
        "timerLabel": "SOLAR CONJUNCTION",
        "timerValue": "NO SIGNAL (SUN IN THE WAY)",
        "themeColor": "#FF5A4A",
        "blackout": true,
        "messages": [
          {
            "from": "sys",
            "text": "NO SIGNAL (SUN IN THE WAY)",
            "status": "BLACKOUT: WEEKS"
          },
          {
            "from": "pip",
            "text": "Bo?? Resend!! \ud83d\ude2d",
            "status": "FAILED \u00b7 EVERY 26 MO"
          }
        ]
      },
      "banner": {
        "text": "NO SIGNAL (SUN IN THE WAY)",
        "sub": "EVERY ~26 MONTHS \u00b7 LASTS WEEKS",
        "color": "#FF5A4A"
      }
    }
  },
  "S69": {
    "kind": "scene",
    "cfg": {
      "id": "S69",
      "set": "bedroom",
      "setVariant": "blackout",
      "cam": {
        "x": 540,
        "y": 560,
        "z": 1.72
      },
      "camEnd": {
        "x": 510,
        "y": 540,
        "z": 1.85
      },
      "pip": {
        "x": 580,
        "pose": "phonePanic",
        "scale": 1.14,
        "holdPhone": true
      },
      "phone": {
        "x": 1420,
        "y": 545,
        "scale": 0.92,
        "tilt": 5,
        "header": "MARS LINK LOST",
        "timerLabel": "SOLAR CONJUNCTION",
        "timerValue": "NO SIGNAL (SUN IN THE WAY)",
        "themeColor": "#FF5A4A",
        "blackout": true,
        "messages": [
          {
            "from": "sys",
            "text": "NO SIGNAL (SUN IN THE WAY)",
            "status": "BLACKOUT: WEEKS"
          },
          {
            "from": "pip",
            "text": "Bo?? Resend!! \ud83d\ude2d",
            "status": "FAILED \u00b7 EVERY 26 MO"
          }
        ]
      }
    }
  },
  "S70": {
    "kind": "scene",
    "cfg": {
      "id": "S70",
      "set": "bedroom",
      "setVariant": "blackout",
      "cam": {
        "x": 1160,
        "y": 430,
        "z": 1.65
      },
      "camEnd": {
        "x": 1200,
        "y": 410,
        "z": 1.78
      },
      "pip": {
        "x": 690,
        "pose": "phonePanic",
        "scale": 1.14,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.92,
        "tilt": -5,
        "header": "MARS LINK LOST",
        "timerLabel": "SOLAR CONJUNCTION",
        "timerValue": "NO SIGNAL (SUN IN THE WAY)",
        "themeColor": "#FF5A4A",
        "blackout": true,
        "messages": [
          {
            "from": "sys",
            "text": "NO SIGNAL (SUN IN THE WAY)",
            "status": "BLACKOUT: WEEKS"
          },
          {
            "from": "pip",
            "text": "Bo?? Resend!! \ud83d\ude2d",
            "status": "FAILED \u00b7 EVERY 26 MO"
          }
        ]
      }
    }
  },
  "S71": {
    "kind": "scene",
    "cfg": {
      "id": "S71",
      "set": "conjunction",
      "cam": {
        "x": 742,
        "y": 541,
        "z": 1.27
      },
      "camEnd": {
        "x": 794,
        "y": 511,
        "z": 1.45
      },
      "bo": {
        "x": 1240,
        "y": 805,
        "pose": "phoneShrug",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "CONJUNCTION BLACKOUT",
        "value": "EVERY ~26 MONTHS \u00b7 WEEKS",
        "color": "#FF5A4A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S72": {
    "kind": "scene",
    "cfg": {
      "id": "S72",
      "set": "conjunction",
      "cam": {
        "x": 639,
        "y": 535,
        "z": 1.42
      },
      "camEnd": {
        "x": 613,
        "y": 508,
        "z": 1.6
      },
      "bo": {
        "x": 1240,
        "y": 805,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "CONJUNCTION BLACKOUT",
        "value": "EVERY ~26 MONTHS \u00b7 WEEKS",
        "color": "#FF5A4A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S73": {
    "kind": "scene",
    "cfg": {
      "id": "S73",
      "set": "neptune",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "NEPTUNE",
        "sub": "ONE-WAY DELAY: 4 HOURS 10 MINUTES \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "mode": "hero"
      }
    }
  },
  "S74": {
    "kind": "scene",
    "cfg": {
      "id": "S74",
      "set": "neptune",
      "setVariant": "space",
      "cam": {
        "x": 793,
        "y": 536,
        "z": 1.36
      },
      "camEnd": {
        "x": 781,
        "y": 500,
        "z": 1.39
      },
      "bo": {
        "x": 1280,
        "y": 760,
        "pose": "waveHi",
        "scale": 1.04,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S75": {
    "kind": "diagram",
    "cfg": {
      "id": "S75",
      "mode": "neptune_4h10m",
      "variant": 1,
      "title": "NEPTUNE: 4 HOURS 10 MINUTES ONE WAY",
      "subtitle": "VOYAGER 2 SPACECRAFT TOOK 12 YEARS TO FLY THERE",
      "accentColor": "#7FD4FF",
      "cam": {
        "x": 620,
        "y": 530,
        "z": 1.36
      },
      "camEnd": {
        "x": 600,
        "y": 541,
        "z": 1.54
      }
    }
  },
  "S76": {
    "kind": "diagram",
    "cfg": {
      "id": "S76",
      "mode": "neptune_4h10m",
      "variant": 0,
      "title": "NEPTUNE: 4 HOURS 10 MINUTES ONE WAY",
      "subtitle": "VOYAGER 2 SPACECRAFT TOOK 12 YEARS TO FLY THERE",
      "accentColor": "#7FD4FF",
      "cam": {
        "x": 1117,
        "y": 428,
        "z": 1.55
      },
      "camEnd": {
        "x": 1169,
        "y": 393,
        "z": 1.75
      }
    }
  },
  "S77": {
    "kind": "diagram",
    "cfg": {
      "id": "S77",
      "mode": "neptune_4h10m",
      "variant": 1,
      "title": "NEPTUNE: 4 HOURS 10 MINUTES ONE WAY",
      "subtitle": "VOYAGER 2 SPACECRAFT TOOK 12 YEARS TO FLY THERE",
      "accentColor": "#7FD4FF",
      "cam": {
        "x": 974,
        "y": 501,
        "z": 0.96
      },
      "camEnd": {
        "x": 958,
        "y": 499,
        "z": 1.12
      }
    }
  },
  "S78": {
    "kind": "scene",
    "cfg": {
      "id": "S78",
      "set": "neptune",
      "setVariant": "space",
      "cam": {
        "x": 991,
        "y": 520,
        "z": 1.07
      },
      "camEnd": {
        "x": 967,
        "y": 525,
        "z": 1.06
      },
      "bo": {
        "x": 1280,
        "y": 760,
        "pose": "waveHi",
        "scale": 1.04,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S79": {
    "kind": "scene",
    "cfg": {
      "id": "S79",
      "set": "neptune",
      "setVariant": "breakfast",
      "cam": {
        "x": 838,
        "y": 458,
        "z": 1.3
      },
      "camEnd": {
        "x": 916,
        "y": 456,
        "z": 1.31
      },
      "pip": {
        "x": 520,
        "y": 760,
        "pose": "eatMeal",
        "scale": 1.06,
        "holdPhone": true
      },
      "phone": {
        "x": 490,
        "y": 540,
        "scale": 0.92,
        "tilt": 3,
        "header": "BO \u00b7 NEPTUNE ORBIT",
        "timerLabel": "NEPTUNE ONE-WAY",
        "timerValue": "04 HOURS 10 MIN",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "good morning! \ud83e\udd63\u2600\ufe0f",
            "status": "SENT AT BREAKFAST (08:00)"
          }
        ]
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S80": {
    "kind": "scene",
    "cfg": {
      "id": "S80",
      "set": "neptune",
      "setVariant": "lunch",
      "cam": {
        "x": 1355,
        "y": 581,
        "z": 1.49
      },
      "camEnd": {
        "x": 1410,
        "y": 533,
        "z": 1.68
      },
      "pip": {
        "x": 520,
        "y": 760,
        "pose": "eatMeal",
        "scale": 1.06,
        "holdPhone": true
      },
      "phone": {
        "x": 1420,
        "y": 540,
        "scale": 0.92,
        "tilt": -3,
        "header": "BO \u00b7 NEPTUNE ORBIT",
        "timerLabel": "NEPTUNE ONE-WAY",
        "timerValue": "04 HOURS 10 MIN",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "good morning! \ud83e\udd63\u2600\ufe0f",
            "status": "\u2713\u2713 DELIVERED AT LUNCH (+4h 10m)"
          }
        ]
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S81": {
    "kind": "scene",
    "cfg": {
      "id": "S81",
      "set": "neptune",
      "setVariant": "lunch",
      "cam": {
        "x": 1202,
        "y": 529,
        "z": 1.25
      },
      "camEnd": {
        "x": 1174,
        "y": 479,
        "z": 1.43
      },
      "pip": {
        "x": 520,
        "y": 760,
        "pose": "eatMeal",
        "scale": 1.06,
        "holdPhone": true
      },
      "phone": {
        "x": 490,
        "y": 540,
        "scale": 0.92,
        "tilt": 3,
        "header": "BO \u00b7 NEPTUNE ORBIT",
        "timerLabel": "NEPTUNE ONE-WAY",
        "timerValue": "04 HOURS 10 MIN",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "sys",
            "text": "4h 10m ONE WAY TO NEPTUNE",
            "status": "LUNCHTIME SANDWICH"
          }
        ]
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S82": {
    "kind": "scene",
    "cfg": {
      "id": "S82",
      "set": "neptune",
      "setVariant": "space",
      "cam": {
        "x": 1299,
        "y": 518,
        "z": 1.38
      },
      "camEnd": {
        "x": 1293,
        "y": 515,
        "z": 1.56
      },
      "bo": {
        "x": 1280,
        "y": 760,
        "pose": "waveHi",
        "scale": 1.04,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S83": {
    "kind": "scene",
    "cfg": {
      "id": "S83",
      "set": "neptune",
      "setVariant": "dinner",
      "cam": {
        "x": 516,
        "y": 586,
        "z": 1.65
      },
      "camEnd": {
        "x": 517,
        "y": 576,
        "z": 1.7
      },
      "pip": {
        "x": 520,
        "y": 760,
        "pose": "eatMeal",
        "scale": 1.06,
        "holdPhone": true
      },
      "phone": {
        "x": 490,
        "y": 540,
        "scale": 0.92,
        "tilt": 3,
        "header": "BO \u00b7 NEPTUNE ORBIT",
        "timerLabel": "NEPTUNE ONE-WAY",
        "timerValue": "04 HOURS 10 MIN",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "good morning! \ud83e\udd63\u2600\ufe0f",
            "status": "08:00 BREAKFAST"
          },
          {
            "from": "bo",
            "text": "morning back!! \ud83e\ude90",
            "status": "ARRIVED AT DINNER (+8h 20m)"
          }
        ]
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S84": {
    "kind": "scene",
    "cfg": {
      "id": "S84",
      "set": "neptune",
      "setVariant": "space",
      "cam": {
        "x": 753,
        "y": 534,
        "z": 1.36
      },
      "camEnd": {
        "x": 831,
        "y": 478,
        "z": 1.39
      },
      "bo": {
        "x": 1280,
        "y": 760,
        "pose": "waveHi",
        "scale": 1.04,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S85": {
    "kind": "scene",
    "cfg": {
      "id": "S85",
      "set": "neptune",
      "setVariant": "space",
      "cam": {
        "x": 650,
        "y": 528,
        "z": 1.36
      },
      "camEnd": {
        "x": 580,
        "y": 519,
        "z": 1.54
      },
      "bo": {
        "x": 1280,
        "y": 760,
        "pose": "waveHi",
        "scale": 1.04,
        "flip": -1,
        "helmet": true,
        "holdPhone": true
      },
      "pill": {
        "label": "NEPTUNE DELAY",
        "value": "4H 10M \u00b7 VOYAGER 2: 12 YRS",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S86": {
    "kind": "scene",
    "cfg": {
      "id": "S86",
      "set": "lightday_ring",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "ONE LIGHT-DAY",
        "sub": "~16 BILLION MILES (~26B KM) \u00b7 24H ONE WAY \u00b7 48H REPLY",
        "color": "#FFE27A",
        "mode": "hero"
      }
    }
  },
  "S87": {
    "kind": "scene",
    "cfg": {
      "id": "S87",
      "set": "lightday_ring",
      "setVariant": "none",
      "cam": {
        "x": 734,
        "y": 529,
        "z": 1.3
      },
      "camEnd": {
        "x": 818,
        "y": 511,
        "z": 1.48
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S88": {
    "kind": "diagram",
    "cfg": {
      "id": "S88",
      "mode": "lightday_scale_16b",
      "variant": 0,
      "title": "ONE LIGHT-DAY: ~16 BILLION MILES (~26 BILLION KM)",
      "subtitle": "24 HOURS ONE WAY \u00b7 48 HOURS FOR A REPLY",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 631,
        "y": 523,
        "z": 1.45
      },
      "camEnd": {
        "x": 637,
        "y": 508,
        "z": 1.48
      }
    }
  },
  "S89": {
    "kind": "diagram",
    "cfg": {
      "id": "S89",
      "mode": "lightday_scale_16b",
      "variant": 1,
      "title": "ONE LIGHT-DAY: ~16 BILLION MILES (~26 BILLION KM)",
      "subtitle": "24 HOURS ONE WAY \u00b7 48 HOURS FOR A REPLY",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1128,
        "y": 421,
        "z": 1.64
      },
      "camEnd": {
        "x": 1136,
        "y": 404,
        "z": 1.69
      }
    }
  },
  "S90": {
    "kind": "scene",
    "cfg": {
      "id": "S90",
      "set": "lightday_ring",
      "setVariant": "none",
      "cam": {
        "x": 985,
        "y": 494,
        "z": 0.9
      },
      "camEnd": {
        "x": 925,
        "y": 510,
        "z": 1.06
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 1380,
        "y": 540,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "ping across 16B miles!",
            "status": "24 HOURS ONE WAY"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S91": {
    "kind": "diagram",
    "cfg": {
      "id": "S91",
      "mode": "lightday_scale_16b",
      "variant": 1,
      "title": "ONE LIGHT-DAY: ~16 BILLION MILES (~26 BILLION KM)",
      "subtitle": "24 HOURS ONE WAY \u00b7 48 HOURS FOR A REPLY",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 932,
        "y": 557,
        "z": 1.01
      },
      "camEnd": {
        "x": 1004,
        "y": 536,
        "z": 1.15
      }
    }
  },
  "S92": {
    "kind": "diagram",
    "cfg": {
      "id": "S92",
      "mode": "lightday_scale_16b",
      "variant": 0,
      "title": "ONE LIGHT-DAY: ~16 BILLION MILES (~26 BILLION KM)",
      "subtitle": "24 HOURS ONE WAY \u00b7 48 HOURS FOR A REPLY",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 849,
        "y": 451,
        "z": 1.24
      },
      "camEnd": {
        "x": 953,
        "y": 423,
        "z": 1.4
      }
    }
  },
  "S93": {
    "kind": "scene",
    "cfg": {
      "id": "S93",
      "set": "lightday_ring",
      "setVariant": "none",
      "cam": {
        "x": 1366,
        "y": 574,
        "z": 1.58
      },
      "camEnd": {
        "x": 1377,
        "y": 544,
        "z": 1.62
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 520,
        "y": 540,
        "scale": 0.94,
        "tilt": 3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "1 exchange = 2 days",
            "status": "24h OUT"
          },
          {
            "from": "bo",
            "text": "see you in 48 hours!",
            "status": "24h BACK"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S94": {
    "kind": "scene",
    "cfg": {
      "id": "S94",
      "set": "lightday_ring",
      "setVariant": "birthday",
      "cam": {
        "x": 1213,
        "y": 522,
        "z": 1.34
      },
      "camEnd": {
        "x": 1141,
        "y": 490,
        "z": 1.37
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 1380,
        "y": 540,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Happy Birthday Bo!! \ud83c\udf82",
            "status": "SENT ON BIRTHDAY MORNING"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S95": {
    "kind": "scene",
    "cfg": {
      "id": "S95",
      "set": "lightday_ring",
      "setVariant": "birthday",
      "cam": {
        "x": 1240,
        "y": 511,
        "z": 1.32
      },
      "camEnd": {
        "x": 1330,
        "y": 526,
        "z": 1.5
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 520,
        "y": 540,
        "scale": 0.94,
        "tilt": 3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Happy Birthday Bo!! \ud83c\udf82",
            "status": "DELIVERED 1 DAY LATE (+24h)"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S96": {
    "kind": "scene",
    "cfg": {
      "id": "S96",
      "set": "lightday_ring",
      "setVariant": "birthday",
      "cam": {
        "x": 527,
        "y": 579,
        "z": 1.59
      },
      "camEnd": {
        "x": 484,
        "y": 543,
        "z": 1.79
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 1380,
        "y": 540,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Happy Birthday Bo!! \ud83c\udf82",
            "status": "+24h LATE"
          },
          {
            "from": "bo",
            "text": "Happy birthday back! \ud83c\udf89",
            "status": "LANDS 2 DAYS LATER (+48h)"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S97": {
    "kind": "scene",
    "cfg": {
      "id": "S97",
      "set": "lightday_ring",
      "setVariant": "argument",
      "cam": {
        "x": 764,
        "y": 527,
        "z": 1.3
      },
      "camEnd": {
        "x": 798,
        "y": 489,
        "z": 1.48
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "phoneShrug",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S98": {
    "kind": "scene",
    "cfg": {
      "id": "S98",
      "set": "lightday_ring",
      "setVariant": "argument",
      "cam": {
        "x": 661,
        "y": 565,
        "z": 1.45
      },
      "camEnd": {
        "x": 617,
        "y": 530,
        "z": 1.48
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "phoneShrug",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 1380,
        "y": 540,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "hey that's MY sandwich!! \ud83d\ude20",
            "status": "SENT 2 DAYS AGO"
          },
          {
            "from": "bo",
            "text": "nuh uh!! \ud83d\ude24",
            "status": "ARRIVED 48 HOURS LATER"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S99": {
    "kind": "scene",
    "cfg": {
      "id": "S99",
      "set": "lightday_ring",
      "setVariant": "argument",
      "cam": {
        "x": 1088,
        "y": 419,
        "z": 1.64
      },
      "camEnd": {
        "x": 1186,
        "y": 426,
        "z": 1.69
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "phoneShrug",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "phone": {
        "x": 520,
        "y": 540,
        "scale": 0.94,
        "tilt": 3,
        "header": "BO \u00b7 1 LIGHT-DAY",
        "subHeader": "~16B MILES (~26B KM)",
        "timerLabel": "ROUND-TRIP EXCHANGE",
        "timerValue": "48:00:00 (2 DAYS)",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "wait... what were we mad about?? \ud83e\udd14",
            "status": "48h MEMORY WIPE"
          }
        ]
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S100": {
    "kind": "scene",
    "cfg": {
      "id": "S100",
      "set": "lightday_ring",
      "setVariant": "none",
      "cam": {
        "x": 945,
        "y": 492,
        "z": 0.9
      },
      "camEnd": {
        "x": 905,
        "y": 488,
        "z": 1.06
      },
      "pip": {
        "x": 420,
        "y": 780,
        "pose": "celebrate",
        "scale": 1.06,
        "holdPhone": true
      },
      "bo": {
        "x": 1440,
        "y": 520,
        "pose": "waveHi",
        "scale": 0.96,
        "flip": -1,
        "helmet": true
      },
      "voyagerProp": {
        "x": 1180,
        "y": 380,
        "scale": 0.78,
        "rot": -16,
        "label": "VOYAGER 1 \u00b7 1 LD"
      },
      "pill": {
        "label": "ONE LIGHT-DAY",
        "value": "~16B MI (~26B KM) \u00b7 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S101": {
    "kind": "scene",
    "cfg": {
      "id": "S101",
      "set": "dsn_desk",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "VOYAGER 1",
        "sub": "LAUNCHED 5 SEP 1977 \u00b7 1 LIGHT-DAY: 18 NOV 2026",
        "color": "#5BE08A",
        "mode": "hero"
      }
    }
  },
  "S102": {
    "kind": "diagram",
    "cfg": {
      "id": "S102",
      "mode": "voyager1_timeline_49y",
      "variant": 0,
      "title": "VOYAGER 1: 5 SEP 1977 TO 18 NOV 2026 (5:16 A.M. EST)",
      "subtitle": "49 YEARS, 2 MONTHS AND 11 DAYS OF FLIGHT TO 1 LIGHT-DAY",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 1139,
        "y": 414,
        "z": 1.58
      },
      "camEnd": {
        "x": 1173,
        "y": 415,
        "z": 1.78
      }
    }
  },
  "S103": {
    "kind": "scene",
    "cfg": {
      "id": "S103",
      "set": "lightday_ring",
      "cam": {
        "x": 1180,
        "y": 480,
        "z": 1.38
      },
      "camEnd": {
        "x": 1240,
        "y": 460,
        "z": 1.5
      },
      "voyagerProp": {
        "x": 1360,
        "y": 490,
        "scale": 1.05,
        "rot": -14,
        "highlightRecord": false,
        "label": "CROSSING 1 LIGHT-DAY",
        "pulseColor": "#FFE27A"
      },
      "banner": {
        "text": "CROSSING ONE LIGHT-DAY",
        "sub": "VOYAGER 1 \u00b7 18 NOV 2026",
        "color": "#5BE08A"
      },
      "pill": {
        "label": "VOYAGER 1",
        "value": "49Y 2M 11D IN FLIGHT",
        "color": "#FFE27A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S104": {
    "kind": "diagram",
    "cfg": {
      "id": "S104",
      "mode": "voyager1_timeline_49y",
      "variant": 0,
      "title": "VOYAGER 1: 5 SEP 1977 TO 18 NOV 2026 (5:16 A.M. EST)",
      "subtitle": "49 YEARS, 2 MONTHS AND 11 DAYS OF FLIGHT TO 1 LIGHT-DAY",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 943,
        "y": 550,
        "z": 1.1
      },
      "camEnd": {
        "x": 971,
        "y": 503,
        "z": 1.09
      }
    }
  },
  "S105": {
    "kind": "diagram",
    "cfg": {
      "id": "S105",
      "mode": "voyager1_timeline_49y",
      "variant": 1,
      "title": "VOYAGER 1: 5 SEP 1977 TO 18 NOV 2026 (5:16 A.M. EST)",
      "subtitle": "49 YEARS, 2 MONTHS AND 11 DAYS OF FLIGHT TO 1 LIGHT-DAY",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 860,
        "y": 444,
        "z": 1.18
      },
      "camEnd": {
        "x": 920,
        "y": 434,
        "z": 1.34
      }
    }
  },
  "S106": {
    "kind": "diagram",
    "cfg": {
      "id": "S106",
      "mode": "voyager1_timeline_49y",
      "variant": 0,
      "title": "VOYAGER 1: 5 SEP 1977 TO 18 NOV 2026 (5:16 A.M. EST)",
      "subtitle": "49 YEARS, 2 MONTHS AND 11 DAYS OF FLIGHT TO 1 LIGHT-DAY",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 1377,
        "y": 567,
        "z": 1.52
      },
      "camEnd": {
        "x": 1414,
        "y": 555,
        "z": 1.71
      }
    }
  },
  "S107": {
    "kind": "diagram",
    "cfg": {
      "id": "S107",
      "mode": "voyager1_timeline_49y",
      "variant": 1,
      "title": "VOYAGER 1: 5 SEP 1977 TO 18 NOV 2026 (5:16 A.M. EST)",
      "subtitle": "49 YEARS, 2 MONTHS AND 11 DAYS OF FLIGHT TO 1 LIGHT-DAY",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1224,
        "y": 515,
        "z": 1.28
      },
      "camEnd": {
        "x": 1108,
        "y": 501,
        "z": 1.46
      }
    }
  },
  "S108": {
    "kind": "scene",
    "cfg": {
      "id": "S108",
      "set": "dsn_desk",
      "setVariant": "uplink",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.02
      },
      "camEnd": {
        "x": 960,
        "y": 520,
        "z": 1.1
      },
      "extraChar": {
        "x": 870,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "fgSilhouettes": "console_low",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S109": {
    "kind": "scene",
    "cfg": {
      "id": "S109",
      "set": "dsn_desk",
      "setVariant": "uplink",
      "cam": {
        "x": 960,
        "y": 620,
        "z": 1.48
      },
      "camEnd": {
        "x": 990,
        "y": 600,
        "z": 1.6
      },
      "extraChar": {
        "x": 960,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "fgSilhouettes": "none",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S110": {
    "kind": "scene",
    "cfg": {
      "id": "S110",
      "set": "dsn_desk",
      "setVariant": "uplink",
      "cam": {
        "x": 960,
        "y": 420,
        "z": 0.96
      },
      "camEnd": {
        "x": 960,
        "y": 400,
        "z": 1.04
      },
      "extraChar": {
        "x": 1050,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "banner": {
        "text": "TWO MISSION CLOCKS: 24H + 24H",
        "color": "#FFE27A"
      },
      "fgSilhouettes": "console_low",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S111": {
    "kind": "scene",
    "cfg": {
      "id": "S111",
      "set": "dsn_desk",
      "setVariant": "uplink",
      "cam": {
        "x": 420,
        "y": 410,
        "z": 1.62
      },
      "camEnd": {
        "x": 390,
        "y": 395,
        "z": 1.74
      },
      "extraChar": {
        "x": 870,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "DSN COMMAND LINK",
        "timerLabel": "UPLINK / DOWNLINK",
        "timerValue": "24:00:00 OUT",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "CMD: THRUSTER PING",
            "status": "24 HOURS TO ARRIVE"
          }
        ]
      },
      "fgSilhouettes": "none",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S112": {
    "kind": "scene",
    "cfg": {
      "id": "S112",
      "set": "dsn_desk",
      "setVariant": "uplink",
      "cam": {
        "x": 960,
        "y": 380,
        "z": 1.52
      },
      "camEnd": {
        "x": 960,
        "y": 365,
        "z": 1.64
      },
      "extraChar": {
        "x": 960,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "fgSilhouettes": "console_low",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S113": {
    "kind": "scene",
    "cfg": {
      "id": "S113",
      "set": "dsn_desk",
      "setVariant": "ack",
      "cam": {
        "x": 1500,
        "y": 410,
        "z": 1.62
      },
      "camEnd": {
        "x": 1530,
        "y": 395,
        "z": 1.74
      },
      "extraChar": {
        "x": 1050,
        "y": 760,
        "pose": "engineerDesk",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "fgSilhouettes": "none",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S114": {
    "kind": "scene",
    "cfg": {
      "id": "S114",
      "set": "dsn_desk",
      "setVariant": "ack",
      "cam": {
        "x": 740,
        "y": 540,
        "z": 1.24
      },
      "camEnd": {
        "x": 780,
        "y": 520,
        "z": 1.34
      },
      "extraChar": {
        "x": 870,
        "y": 760,
        "pose": "celebrate",
        "scale": 1.12,
        "look": "prof",
        "label": "NASA DSN ENGINEER"
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.94,
        "tilt": 4,
        "header": "DSN COMMAND LINK",
        "timerLabel": "UPLINK / DOWNLINK",
        "timerValue": "+48:00:00 ACK!",
        "themeColor": "#5BE08A",
        "messages": [
          {
            "from": "pip",
            "text": "CMD: THRUSTER PING",
            "status": "+24h"
          },
          {
            "from": "bo",
            "text": "VOYAGER 1 ACK OK \u2713",
            "status": "48 HOURS TOTAL"
          }
        ]
      },
      "fgSilhouettes": "console_low",
      "pill": {
        "label": "NASA DEEP SPACE NETWORK",
        "value": "24H OUT + 24H BACK = 48H",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S115": {
    "kind": "scene",
    "cfg": {
      "id": "S115",
      "set": "voyager_space",
      "cam": {
        "x": 890,
        "y": 486,
        "z": 1.18
      },
      "camEnd": {
        "x": 900,
        "y": 456,
        "z": 1.34
      },
      "voyagerProp": {
        "x": 980,
        "y": 530,
        "scale": 1.25,
        "rot": -14,
        "highlightRecord": true,
        "label": "GOLDEN RECORD ON BOARD",
        "pulseColor": "#FFE27A"
      },
      "pill": {
        "label": "VOYAGER 1",
        "value": "49Y 2M 11D IN FLIGHT",
        "color": "#FFE27A",
        "x": 86,
        "y": 88
      }
    }
  },
  "S116": {
    "kind": "scene",
    "cfg": {
      "id": "S116",
      "set": "golden_record",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "THE GOLDEN RECORD",
        "sub": "GREETINGS IN 55 LANGUAGES \u00b7 SLOWEST TEXT EVER",
        "color": "#FFE27A",
        "mode": "hero"
      }
    }
  },
  "S117": {
    "kind": "scene",
    "cfg": {
      "id": "S117",
      "set": "golden_record",
      "setVariant": "none",
      "cam": {
        "x": 620,
        "y": 460,
        "z": 1.48
      },
      "camEnd": {
        "x": 660,
        "y": 440,
        "z": 1.6
      },
      "banner": {
        "text": "A GLEAMING COPPER DISC",
        "color": "#FFE27A"
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S118": {
    "kind": "scene",
    "cfg": {
      "id": "S118",
      "set": "golden_record",
      "setVariant": "none",
      "cam": {
        "x": 871,
        "y": 481,
        "z": 1.27
      },
      "camEnd": {
        "x": 887,
        "y": 445,
        "z": 1.28
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S119": {
    "kind": "diagram",
    "cfg": {
      "id": "S119",
      "mode": "golden_record_55lang",
      "variant": 1,
      "title": "THE GOLDEN RECORD: GREETINGS IN 55 LANGUAGES",
      "subtitle": "\u201cHELLO FROM THE CHILDREN OF PLANET EARTH.\u201d",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1388,
        "y": 560,
        "z": 1.61
      },
      "camEnd": {
        "x": 1381,
        "y": 566,
        "z": 1.65
      }
    }
  },
  "S120": {
    "kind": "diagram",
    "cfg": {
      "id": "S120",
      "mode": "golden_record_55lang",
      "variant": 0,
      "title": "THE GOLDEN RECORD: GREETINGS IN 55 LANGUAGES",
      "subtitle": "\u201cHELLO FROM THE CHILDREN OF PLANET EARTH.\u201d",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1165,
        "y": 508,
        "z": 1.22
      },
      "camEnd": {
        "x": 1145,
        "y": 468,
        "z": 1.4
      }
    }
  },
  "S121": {
    "kind": "scene",
    "cfg": {
      "id": "S121",
      "set": "golden_record",
      "setVariant": "quote",
      "cam": {
        "x": 1262,
        "y": 541,
        "z": 1.35
      },
      "camEnd": {
        "x": 1334,
        "y": 504,
        "z": 1.53
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S122": {
    "kind": "scene",
    "cfg": {
      "id": "S122",
      "set": "golden_record",
      "setVariant": "quote",
      "cam": {
        "x": 549,
        "y": 565,
        "z": 1.62
      },
      "camEnd": {
        "x": 488,
        "y": 565,
        "z": 1.82
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S123": {
    "kind": "diagram",
    "cfg": {
      "id": "S123",
      "mode": "golden_record_55lang",
      "variant": 1,
      "title": "THE GOLDEN RECORD: GREETINGS IN 55 LANGUAGES",
      "subtitle": "\u201cHELLO FROM THE CHILDREN OF PLANET EARTH.\u201d",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 786,
        "y": 513,
        "z": 1.33
      },
      "camEnd": {
        "x": 802,
        "y": 511,
        "z": 1.36
      }
    }
  },
  "S124": {
    "kind": "diagram",
    "cfg": {
      "id": "S124",
      "mode": "golden_record_55lang",
      "variant": 0,
      "title": "THE GOLDEN RECORD: GREETINGS IN 55 LANGUAGES",
      "subtitle": "\u201cHELLO FROM THE CHILDREN OF PLANET EARTH.\u201d",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 613,
        "y": 551,
        "z": 1.48
      },
      "camEnd": {
        "x": 621,
        "y": 508,
        "z": 1.51
      }
    }
  },
  "S125": {
    "kind": "scene",
    "cfg": {
      "id": "S125",
      "set": "voyager_space",
      "setVariant": "none",
      "cam": {
        "x": 1110,
        "y": 449,
        "z": 1.52
      },
      "camEnd": {
        "x": 1190,
        "y": 404,
        "z": 1.72
      },
      "voyagerProp": {
        "x": 760,
        "y": 520,
        "scale": 1.15,
        "rot": -18,
        "highlightRecord": true,
        "label": "SLOWEST TEXT EVER SENT"
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S126": {
    "kind": "scene",
    "cfg": {
      "id": "S126",
      "set": "star_ac79",
      "setVariant": "none",
      "cam": {
        "x": 967,
        "y": 478,
        "z": 0.93
      },
      "camEnd": {
        "x": 909,
        "y": 510,
        "z": 1.09
      },
      "phone": {
        "x": 960,
        "y": 540,
        "scale": 0.92,
        "tilt": 4,
        "header": "GOLDEN RECORD",
        "subHeader": "LAUNCHED 5 SEP 1977",
        "timerLabel": "DELIVERY STATUS",
        "timerValue": "BOTTLE IN COSMIC SEA",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Hello from the children of planet Earth \ud83c\udf0d",
            "status": "55 LANGUAGES \u00b7 BOTTLE IN SPACE"
          }
        ]
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S127": {
    "kind": "scene",
    "cfg": {
      "id": "S127",
      "set": "golden_record",
      "setVariant": "none",
      "cam": {
        "x": 984,
        "y": 541,
        "z": 1.04
      },
      "camEnd": {
        "x": 988,
        "y": 536,
        "z": 1.18
      },
      "phone": {
        "x": 1410,
        "y": 540,
        "scale": 0.92,
        "tilt": -3,
        "header": "GOLDEN RECORD",
        "subHeader": "LAUNCHED 5 SEP 1977",
        "timerLabel": "DELIVERY STATUS",
        "timerValue": "NO TICK \u00b7 NO TYPING DOTS",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Hello from the children of planet Earth \ud83c\udf0d",
            "status": "55 LANGUAGES \u00b7 BOTTLE IN SPACE"
          }
        ]
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S128": {
    "kind": "scene",
    "cfg": {
      "id": "S128",
      "set": "golden_record",
      "setVariant": "quote",
      "cam": {
        "x": 831,
        "y": 479,
        "z": 1.27
      },
      "camEnd": {
        "x": 937,
        "y": 423,
        "z": 1.28
      },
      "phone": {
        "x": 510,
        "y": 540,
        "scale": 0.92,
        "tilt": -3,
        "header": "GOLDEN RECORD",
        "subHeader": "LAUNCHED 5 SEP 1977",
        "timerLabel": "DELIVERY STATUS",
        "timerValue": "NO TICK \u00b7 NO TYPING DOTS",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Hello from the children of planet Earth \ud83c\udf0d",
            "status": "55 LANGUAGES \u00b7 BOTTLE IN SPACE"
          }
        ]
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S129": {
    "kind": "scene",
    "cfg": {
      "id": "S129",
      "set": "voyager_space",
      "setVariant": "none",
      "cam": {
        "x": 1348,
        "y": 558,
        "z": 1.61
      },
      "camEnd": {
        "x": 1361,
        "y": 544,
        "z": 1.65
      },
      "voyagerProp": {
        "x": 1280,
        "y": 520,
        "scale": 1.15,
        "rot": 14,
        "highlightRecord": true,
        "label": "SLOWEST TEXT EVER SENT"
      },
      "pill": {
        "label": "GOLDEN RECORD",
        "value": "55 LANGUAGES + MUSIC",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S130": {
    "kind": "scene",
    "cfg": {
      "id": "S130",
      "set": "star_ac79",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "STAR AC +79 3888",
        "sub": "17+ LIGHT-YEARS AWAY \u00b7 ~1.7 LY IN 40,000 YEARS",
        "color": "#FF8A3D",
        "mode": "hero"
      }
    }
  },
  "S131": {
    "kind": "scene",
    "cfg": {
      "id": "S131",
      "set": "star_ac79",
      "cam": {
        "x": 882,
        "y": 474,
        "z": 1.21
      },
      "camEnd": {
        "x": 924,
        "y": 456,
        "z": 1.37
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S132": {
    "kind": "scene",
    "cfg": {
      "id": "S132",
      "set": "star_ac79",
      "cam": {
        "x": 1420,
        "y": 390,
        "z": 1.68
      },
      "camEnd": {
        "x": 1460,
        "y": 375,
        "z": 1.8
      },
      "banner": {
        "text": "COOL RED STAR: 17+ LIGHT-YEARS",
        "color": "#FF8A3D"
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S133": {
    "kind": "diagram",
    "cfg": {
      "id": "S133",
      "mode": "star_ac79_40000y",
      "variant": 1,
      "title": "TARGET STAR: AC +79 3888 (17+ LIGHT-YEARS AWAY)",
      "subtitle": "VOYAGER 1 PASSES WITHIN ~1.7 LIGHT-YEARS IN 40,000 YEARS",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 1176,
        "y": 501,
        "z": 1.31
      },
      "camEnd": {
        "x": 1112,
        "y": 479,
        "z": 1.34
      }
    }
  },
  "S134": {
    "kind": "scene",
    "cfg": {
      "id": "S134",
      "set": "star_ac79",
      "cam": {
        "x": 1273,
        "y": 534,
        "z": 1.44
      },
      "camEnd": {
        "x": 1301,
        "y": 515,
        "z": 1.47
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S135": {
    "kind": "diagram",
    "cfg": {
      "id": "S135",
      "mode": "star_ac79_40000y",
      "variant": 1,
      "title": "TARGET STAR: AC +79 3888 (17+ LIGHT-YEARS AWAY)",
      "subtitle": "VOYAGER 1 PASSES WITHIN ~1.7 LIGHT-YEARS IN 40,000 YEARS",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 560,
        "y": 602,
        "z": 1.56
      },
      "camEnd": {
        "x": 525,
        "y": 576,
        "z": 1.76
      }
    }
  },
  "S136": {
    "kind": "scene",
    "cfg": {
      "id": "S136",
      "set": "star_ac79",
      "cam": {
        "x": 727,
        "y": 506,
        "z": 1.27
      },
      "camEnd": {
        "x": 839,
        "y": 478,
        "z": 1.45
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S137": {
    "kind": "diagram",
    "cfg": {
      "id": "S137",
      "mode": "star_ac79_40000y",
      "variant": 1,
      "title": "TARGET STAR: AC +79 3888 (17+ LIGHT-YEARS AWAY)",
      "subtitle": "VOYAGER 1 PASSES WITHIN ~1.7 LIGHT-YEARS IN 40,000 YEARS",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 624,
        "y": 544,
        "z": 1.42
      },
      "camEnd": {
        "x": 588,
        "y": 519,
        "z": 1.6
      }
    }
  },
  "S138": {
    "kind": "diagram",
    "cfg": {
      "id": "S138",
      "mode": "star_ac79_40000y",
      "variant": 0,
      "title": "TARGET STAR: AC +79 3888 (17+ LIGHT-YEARS AWAY)",
      "subtitle": "VOYAGER 1 PASSES WITHIN ~1.7 LIGHT-YEARS IN 40,000 YEARS",
      "accentColor": "#FF8A3D",
      "cam": {
        "x": 1121,
        "y": 442,
        "z": 1.61
      },
      "camEnd": {
        "x": 1157,
        "y": 415,
        "z": 1.66
      }
    }
  },
  "S139": {
    "kind": "scene",
    "cfg": {
      "id": "S139",
      "set": "star_ac79",
      "cam": {
        "x": 978,
        "y": 471,
        "z": 1.02
      },
      "camEnd": {
        "x": 946,
        "y": 521,
        "z": 1.03
      },
      "bo": {
        "x": 1460,
        "y": 560,
        "pose": "waveHi",
        "scale": 0.94,
        "flip": -1,
        "helmet": true,
        "label": "BO AT AC +79 3888"
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 AC +79 3888",
        "subHeader": "17+ LIGHT-YEARS AWAY",
        "timerLabel": "ONE-WAY TEXT DELAY",
        "timerValue": "17+ YEARS ONE WAY",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "hey across the stars! \u2728",
            "status": "ARRIVES IN 17+ YEARS"
          }
        ]
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S140": {
    "kind": "scene",
    "cfg": {
      "id": "S140",
      "set": "star_ac79",
      "cam": {
        "x": 925,
        "y": 534,
        "z": 0.98
      },
      "camEnd": {
        "x": 955,
        "y": 503,
        "z": 1.12
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 AC +79 3888",
        "subHeader": "17+ LIGHT-YEARS AWAY",
        "timerLabel": "ONE-WAY TEXT DELAY",
        "timerValue": "17+ YEARS ONE WAY",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "hey across the stars! \u2728",
            "status": "ARRIVES IN 17+ YEARS"
          }
        ]
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S141": {
    "kind": "scene",
    "cfg": {
      "id": "S141",
      "set": "star_ac79",
      "cam": {
        "x": 842,
        "y": 472,
        "z": 1.21
      },
      "camEnd": {
        "x": 904,
        "y": 434,
        "z": 1.37
      },
      "bo": {
        "x": 1460,
        "y": 560,
        "pose": "waveHi",
        "scale": 0.94,
        "flip": -1,
        "helmet": true,
        "label": "BO AT AC +79 3888"
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 AC +79 3888",
        "subHeader": "17+ LIGHT-YEARS AWAY",
        "timerLabel": "ONE-WAY TEXT DELAY",
        "timerValue": "17+ YEARS ONE WAY",
        "themeColor": "#FF8A3D",
        "messages": [
          {
            "from": "pip",
            "text": "hey across the stars! \u2728",
            "status": "ARRIVES IN 17+ YEARS"
          }
        ]
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S142": {
    "kind": "scene",
    "cfg": {
      "id": "S142",
      "set": "proxima",
      "cam": {
        "x": 1359,
        "y": 595,
        "z": 1.55
      },
      "camEnd": {
        "x": 1398,
        "y": 555,
        "z": 1.74
      },
      "pip": {
        "x": 580,
        "y": 820,
        "pose": "pointSky",
        "scale": 1.08,
        "holdPhone": true
      },
      "banner": {
        "text": "CLOSEST STAR NEXT DOOR",
        "color": "#7FD4FF"
      },
      "pill": {
        "label": "AC +79 3888",
        "value": "17+ LY \u00b7 ~1.7 LY IN 40,000 YRS",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S143": {
    "kind": "scene",
    "cfg": {
      "id": "S143",
      "set": "proxima",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "DEEP COSMOS",
        "sub": "PROXIMA: ~4.24 LY (~8.5Y REPLY) \u00b7 ANDROMEDA: ~2.5M LY",
        "color": "#A68CFF",
        "mode": "hero"
      }
    }
  },
  "S144": {
    "kind": "scene",
    "cfg": {
      "id": "S144",
      "set": "proxima",
      "cam": {
        "x": 893,
        "y": 467,
        "z": 1.3
      },
      "camEnd": {
        "x": 891,
        "y": 423,
        "z": 1.31
      },
      "pip": {
        "x": 540,
        "y": 820,
        "pose": "ageKid",
        "scale": 0.82,
        "look": "kid",
        "holdPhone": true,
        "label": "KID PIP (T = 0)"
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 PROXIMA CENTAURI",
        "subHeader": "~4.24 LIGHT-YEARS AWAY",
        "timerLabel": "ROUND-TRIP REPLY",
        "timerValue": "ABOUT 8.5 YEARS",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "knock knock! \ud83d\ude04",
            "status": "4.24 LY ONE WAY"
          }
        ]
      },
      "pill": {
        "label": "PROXIMA CENTAURI",
        "value": "~4.24 LY \u00b7 ~8.5 YR REPLY",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S145": {
    "kind": "scene",
    "cfg": {
      "id": "S145",
      "set": "proxima",
      "cam": {
        "x": 1340,
        "y": 590,
        "z": 1.49
      },
      "camEnd": {
        "x": 1385,
        "y": 544,
        "z": 1.68
      },
      "pip": {
        "x": 540,
        "y": 820,
        "pose": "ageKid",
        "scale": 0.82,
        "look": "kid",
        "holdPhone": true,
        "label": "KID PIP (T = 0)"
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 PROXIMA CENTAURI",
        "subHeader": "~4.24 LIGHT-YEARS AWAY",
        "timerLabel": "ROUND-TRIP REPLY",
        "timerValue": "ABOUT 8.5 YEARS",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "knock knock! \ud83d\ude04",
            "status": "4.24 LY ONE WAY"
          }
        ]
      },
      "pill": {
        "label": "PROXIMA CENTAURI",
        "value": "~4.24 LY \u00b7 ~8.5 YR REPLY",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S146": {
    "kind": "diagram",
    "cfg": {
      "id": "S146",
      "mode": "proxima_vs_andromeda",
      "variant": 0,
      "title": "PROXIMA (~4.24 LY \u00b7 ~8.5Y REPLY) VS ANDROMEDA (~2.5M LY)",
      "subtitle": "INTERSTELLAR & INTERGALACTIC MESSAGING DELAYS",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 1187,
        "y": 494,
        "z": 1.25
      },
      "camEnd": {
        "x": 1149,
        "y": 490,
        "z": 1.43
      }
    }
  },
  "S147": {
    "kind": "scene",
    "cfg": {
      "id": "S147",
      "set": "proxima",
      "cam": {
        "x": 1284,
        "y": 527,
        "z": 1.38
      },
      "camEnd": {
        "x": 1338,
        "y": 526,
        "z": 1.56
      },
      "pip": {
        "x": 540,
        "y": 820,
        "pose": "ageKid",
        "scale": 0.82,
        "look": "kid",
        "holdPhone": true,
        "label": "KID PIP (T = 0)"
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 PROXIMA CENTAURI",
        "subHeader": "~4.24 LIGHT-YEARS AWAY",
        "timerLabel": "ROUND-TRIP REPLY",
        "timerValue": "ABOUT 8.5 YEARS",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "knock knock! \ud83d\ude04",
            "status": "4.24 LY ONE WAY"
          }
        ]
      },
      "pill": {
        "label": "PROXIMA CENTAURI",
        "value": "~4.24 LY \u00b7 ~8.5 YR REPLY",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S148": {
    "kind": "scene",
    "cfg": {
      "id": "S148",
      "set": "proxima",
      "cam": {
        "x": 571,
        "y": 595,
        "z": 1.65
      },
      "camEnd": {
        "x": 492,
        "y": 543,
        "z": 1.7
      },
      "pip": {
        "x": 880,
        "y": 820,
        "pose": "ageAdult",
        "scale": 1.18,
        "look": "pipHood",
        "holdPhone": true,
        "label": "ADULT PIP (+8.5 YRS)"
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 PROXIMA CENTAURI",
        "subHeader": "~4.24 LIGHT-YEARS AWAY",
        "timerLabel": "ROUND-TRIP REPLY",
        "timerValue": "ABOUT 8.5 YEARS",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "knock knock! \ud83d\ude04",
            "status": "SENT AS A KID"
          },
          {
            "from": "bo",
            "text": "who's there?? \ud83d\ude02",
            "status": "READ AS AN ADULT (+8.5 YRS)"
          }
        ]
      },
      "pill": {
        "label": "PROXIMA CENTAURI",
        "value": "~4.24 LY \u00b7 ~8.5 YR REPLY",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S149": {
    "kind": "scene",
    "cfg": {
      "id": "S149",
      "set": "proxima",
      "cam": {
        "x": 738,
        "y": 499,
        "z": 1.36
      },
      "camEnd": {
        "x": 806,
        "y": 489,
        "z": 1.39
      },
      "pip": {
        "x": 540,
        "y": 820,
        "pose": "ageKid",
        "scale": 0.82,
        "look": "kid",
        "holdPhone": true,
        "label": "KID PIP (T = 0)"
      },
      "phone": {
        "x": 520,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 PROXIMA CENTAURI",
        "subHeader": "~4.24 LIGHT-YEARS AWAY",
        "timerLabel": "ROUND-TRIP REPLY",
        "timerValue": "ABOUT 8.5 YEARS",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "knock knock! \ud83d\ude04",
            "status": "4.24 LY ONE WAY"
          }
        ]
      },
      "pill": {
        "label": "PROXIMA CENTAURI",
        "value": "~4.24 LY \u00b7 ~8.5 YR REPLY",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S150": {
    "kind": "scene",
    "cfg": {
      "id": "S150",
      "set": "proxima",
      "cam": {
        "x": 635,
        "y": 537,
        "z": 1.36
      },
      "camEnd": {
        "x": 625,
        "y": 530,
        "z": 1.54
      },
      "pip": {
        "x": 880,
        "y": 820,
        "pose": "ageAdult",
        "scale": 1.18,
        "look": "pipHood",
        "holdPhone": true,
        "label": "ADULT PIP (+8.5 YRS)"
      },
      "extraChar": {
        "x": 480,
        "y": 820,
        "pose": "ageKid",
        "scale": 0.78,
        "look": "kid",
        "label": "SENT AS A KID"
      },
      "phone": {
        "x": 1360,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 PROXIMA CENTAURI",
        "subHeader": "~4.24 LIGHT-YEARS AWAY",
        "timerLabel": "ROUND-TRIP REPLY",
        "timerValue": "ABOUT 8.5 YEARS",
        "themeColor": "#7FD4FF",
        "messages": [
          {
            "from": "pip",
            "text": "knock knock! \ud83d\ude04",
            "status": "SENT AS A KID"
          },
          {
            "from": "bo",
            "text": "who's there?? \ud83d\ude02",
            "status": "READ AS AN ADULT (+8.5 YRS)"
          }
        ]
      },
      "pill": {
        "label": "PROXIMA CENTAURI",
        "value": "~4.24 LY \u00b7 ~8.5 YR REPLY",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S151": {
    "kind": "scene",
    "cfg": {
      "id": "S151",
      "set": "andromeda",
      "cam": {
        "x": 1132,
        "y": 435,
        "z": 1.55
      },
      "camEnd": {
        "x": 1194,
        "y": 426,
        "z": 1.75
      },
      "pill": {
        "label": "ANDROMEDA GALAXY",
        "value": "~2.5 MILLION LIGHT-YEARS",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S152": {
    "kind": "diagram",
    "cfg": {
      "id": "S152",
      "mode": "proxima_vs_andromeda",
      "variant": 0,
      "title": "PROXIMA (~4.24 LY \u00b7 ~8.5Y REPLY) VS ANDROMEDA (~2.5M LY)",
      "subtitle": "INTERSTELLAR & INTERGALACTIC MESSAGING DELAYS",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 989,
        "y": 508,
        "z": 0.96
      },
      "camEnd": {
        "x": 913,
        "y": 488,
        "z": 1.12
      }
    }
  },
  "S153": {
    "kind": "scene",
    "cfg": {
      "id": "S153",
      "set": "crab_future",
      "cam": {
        "x": 936,
        "y": 527,
        "z": 1.07
      },
      "camEnd": {
        "x": 992,
        "y": 514,
        "z": 1.06
      },
      "pill": {
        "label": "ANDROMEDA GALAXY",
        "value": "~2.5 MILLION LIGHT-YEARS",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S154": {
    "kind": "scene",
    "cfg": {
      "id": "S154",
      "set": "crab_future",
      "cam": {
        "x": 853,
        "y": 465,
        "z": 1.3
      },
      "camEnd": {
        "x": 941,
        "y": 445,
        "z": 1.31
      },
      "phone": {
        "x": 960,
        "y": 465,
        "scale": 0.92,
        "tilt": 4,
        "header": "ANDROMEDA GALAXY",
        "subHeader": "~2.5 MILLION LIGHT-YEARS",
        "timerLabel": "DELIVERY ERA",
        "timerValue": "+2,500,000 YEARS",
        "themeColor": "#5BE08A",
        "messages": [
          {
            "from": "pip",
            "text": "hey Bo, still up? \ud83c\udf0c",
            "status": "SENT 2.5M YEARS AGO"
          },
          {
            "from": "sys",
            "text": "READ BY GLOWING CRAB-HUMANS \ud83e\udd80",
            "status": "WHO WAS BO??"
          }
        ]
      },
      "pill": {
        "label": "ANDROMEDA GALAXY",
        "value": "~2.5 MILLION LIGHT-YEARS",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S155": {
    "kind": "scene",
    "cfg": {
      "id": "S155",
      "set": "andromeda",
      "cam": {
        "x": 1370,
        "y": 588,
        "z": 1.49
      },
      "camEnd": {
        "x": 1365,
        "y": 566,
        "z": 1.68
      },
      "pill": {
        "label": "ANDROMEDA GALAXY",
        "value": "~2.5 MILLION LIGHT-YEARS",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S156": {
    "kind": "scene",
    "cfg": {
      "id": "S156",
      "set": "voyager2_twist",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "THE TWIST: VOYAGER 2",
        "sub": "REACHES ONE LIGHT-DAY IN NOVEMBER 2035",
        "color": "#5BE08A",
        "mode": "hero"
      }
    }
  },
  "S157": {
    "kind": "scene",
    "cfg": {
      "id": "S157",
      "set": "voyager2_twist",
      "cam": {
        "x": 834,
        "y": 460,
        "z": 1.24
      },
      "camEnd": {
        "x": 928,
        "y": 434,
        "z": 1.4
      },
      "pill": {
        "label": "TWIN PROBES",
        "value": "VOYAGER 2 \u00b7 NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S158": {
    "kind": "scene",
    "cfg": {
      "id": "S158",
      "set": "voyager2_twist",
      "cam": {
        "x": 1351,
        "y": 583,
        "z": 1.58
      },
      "camEnd": {
        "x": 1422,
        "y": 555,
        "z": 1.62
      },
      "pill": {
        "label": "TWIN PROBES",
        "value": "VOYAGER 2 \u00b7 NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S159": {
    "kind": "diagram",
    "cfg": {
      "id": "S159",
      "mode": "voyager2_2035",
      "variant": 1,
      "title": "THE TWIST: VOYAGER 2 REACHES 1 LIGHT-DAY IN NOV 2035",
      "subtitle": "TWIN SPACECRAFT FOLLOWING INTO INTERSTELLAR SPACE",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 1198,
        "y": 531,
        "z": 1.34
      },
      "camEnd": {
        "x": 1116,
        "y": 501,
        "z": 1.37
      }
    }
  },
  "S160": {
    "kind": "scene",
    "cfg": {
      "id": "S160",
      "set": "voyager2_twist",
      "cam": {
        "x": 1295,
        "y": 520,
        "z": 1.32
      },
      "camEnd": {
        "x": 1305,
        "y": 493,
        "z": 1.5
      },
      "pill": {
        "label": "TWIN PROBES",
        "value": "VOYAGER 2 \u00b7 NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S161": {
    "kind": "diagram",
    "cfg": {
      "id": "S161",
      "mode": "voyager2_2035",
      "variant": 1,
      "title": "THE TWIST: VOYAGER 2 REACHES 1 LIGHT-DAY IN NOV 2035",
      "subtitle": "TWIN SPACECRAFT FOLLOWING INTO INTERSTELLAR SPACE",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 512,
        "y": 588,
        "z": 1.59
      },
      "camEnd": {
        "x": 529,
        "y": 554,
        "z": 1.79
      }
    }
  },
  "S162": {
    "kind": "diagram",
    "cfg": {
      "id": "S162",
      "mode": "voyager2_2035",
      "variant": 0,
      "title": "THE TWIST: VOYAGER 2 REACHES 1 LIGHT-DAY IN NOV 2035",
      "subtitle": "TWIN SPACECRAFT FOLLOWING INTO INTERSTELLAR SPACE",
      "accentColor": "#5BE08A",
      "cam": {
        "x": 749,
        "y": 536,
        "z": 1.3
      },
      "camEnd": {
        "x": 843,
        "y": 500,
        "z": 1.48
      }
    }
  },
  "S163": {
    "kind": "scene",
    "cfg": {
      "id": "S163",
      "set": "bedroom",
      "cam": {
        "x": 646,
        "y": 530,
        "z": 1.45
      },
      "camEnd": {
        "x": 592,
        "y": 541,
        "z": 1.48
      },
      "pip": {
        "x": 660,
        "pose": "phoneTapFast",
        "scale": 1.12,
        "holdPhone": true
      },
      "banner": {
        "text": "SET A REMINDER: NOV 2035",
        "color": "#5BE08A"
      },
      "pill": {
        "label": "VOYAGER 2 TWIST",
        "value": "1 LIGHT-DAY: NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S164": {
    "kind": "scene",
    "cfg": {
      "id": "S164",
      "set": "bedroom",
      "cam": {
        "x": 1143,
        "y": 428,
        "z": 1.64
      },
      "camEnd": {
        "x": 1161,
        "y": 393,
        "z": 1.69
      },
      "pip": {
        "x": 740,
        "pose": "phoneTapFast",
        "scale": 1.12,
        "holdPhone": true
      },
      "phone": {
        "x": 520,
        "y": 540,
        "scale": 0.96,
        "tilt": 4,
        "header": "CALENDAR REMINDER",
        "subHeader": "VOYAGER 2 MILESTONE",
        "timerLabel": "TARGET DATE",
        "timerValue": "NOVEMBER 2035",
        "themeColor": "#5BE08A",
        "calendarMode": true,
        "messages": [
          {
            "from": "pip",
            "text": "Set reminder: Nov 2035! \ud83d\udcc5",
            "status": "VOYAGER 2 1-LD"
          }
        ]
      },
      "pill": {
        "label": "VOYAGER 2 TWIST",
        "value": "1 LIGHT-DAY: NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S165": {
    "kind": "scene",
    "cfg": {
      "id": "S165",
      "set": "voyager2_twist",
      "cam": {
        "x": 930,
        "y": 501,
        "z": 0.9
      },
      "camEnd": {
        "x": 950,
        "y": 499,
        "z": 1.06
      },
      "pip": {
        "x": 580,
        "pose": "phoneTapFast",
        "scale": 1.12,
        "holdPhone": true
      },
      "phone": {
        "x": 1360,
        "y": 540,
        "scale": 0.96,
        "tilt": -3,
        "header": "CALENDAR REMINDER",
        "subHeader": "VOYAGER 2 MILESTONE",
        "timerLabel": "TARGET DATE",
        "timerValue": "NOVEMBER 2035",
        "themeColor": "#5BE08A",
        "calendarMode": true,
        "messages": [
          {
            "from": "pip",
            "text": "Set reminder: Nov 2035! \ud83d\udcc5",
            "status": "VOYAGER 2 1-LD"
          }
        ]
      },
      "banner": {
        "text": "SET A REMINDER: NOV 2035",
        "color": "#5BE08A"
      },
      "pill": {
        "label": "VOYAGER 2 TWIST",
        "value": "1 LIGHT-DAY: NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S166": {
    "kind": "scene",
    "cfg": {
      "id": "S166",
      "set": "bedroom_sunrise",
      "cam": {
        "x": 947,
        "y": 520,
        "z": 1.01
      },
      "camEnd": {
        "x": 959,
        "y": 525,
        "z": 1.15
      },
      "pip": {
        "x": 660,
        "pose": "phoneTapFast",
        "scale": 1.12,
        "holdPhone": true
      },
      "phone": {
        "x": 1180,
        "y": 540,
        "scale": 0.96,
        "tilt": -3,
        "header": "CALENDAR REMINDER",
        "subHeader": "VOYAGER 2 MILESTONE",
        "timerLabel": "TARGET DATE",
        "timerValue": "NOVEMBER 2035",
        "themeColor": "#5BE08A",
        "calendarMode": true,
        "messages": [
          {
            "from": "pip",
            "text": "Set reminder: Nov 2035! \ud83d\udcc5",
            "status": "VOYAGER 2 1-LD"
          }
        ]
      },
      "pill": {
        "label": "VOYAGER 2 TWIST",
        "value": "1 LIGHT-DAY: NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S167": {
    "kind": "scene",
    "cfg": {
      "id": "S167",
      "set": "rooftop",
      "cam": {
        "x": 864,
        "y": 458,
        "z": 1.24
      },
      "camEnd": {
        "x": 908,
        "y": 456,
        "z": 1.4
      },
      "pip": {
        "x": 740,
        "pose": "waveHi",
        "scale": 1.12,
        "holdPhone": true
      },
      "pill": {
        "label": "VOYAGER 2 TWIST",
        "value": "1 LIGHT-DAY: NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S168": {
    "kind": "scene",
    "cfg": {
      "id": "S168",
      "set": "rooftop",
      "cam": {
        "x": 1381,
        "y": 581,
        "z": 1.58
      },
      "camEnd": {
        "x": 1402,
        "y": 533,
        "z": 1.62
      },
      "pip": {
        "x": 580,
        "pose": "waveHi",
        "scale": 1.12,
        "holdPhone": true
      },
      "pill": {
        "label": "VOYAGER 2 TWIST",
        "value": "1 LIGHT-DAY: NOV 2035",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S169": {
    "kind": "scene",
    "cfg": {
      "id": "S169",
      "set": "rooftop",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 515,
        "z": 1.1
      },
      "chapterCard": {
        "place": "EARTH ROOFTOP",
        "sub": "DISTANCE: NEXT DOOR \u00b7 NOVEMBER 2026 SKYWATCHING",
        "color": "#FFE27A",
        "mode": "hero"
      }
    }
  },
  "S170": {
    "kind": "scene",
    "cfg": {
      "id": "S170",
      "set": "rooftop",
      "setVariant": "none",
      "cam": {
        "x": 845,
        "y": 453,
        "z": 1.18
      },
      "camEnd": {
        "x": 895,
        "y": 445,
        "z": 1.34
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "BACK ON YOUR ROOFTOP AT DU",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S171": {
    "kind": "scene",
    "cfg": {
      "id": "S171",
      "set": "rooftop",
      "setVariant": "none",
      "cam": {
        "x": 1362,
        "y": 576,
        "z": 1.52
      },
      "camEnd": {
        "x": 1389,
        "y": 566,
        "z": 1.71
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 ROOFTOP",
        "subHeader": "RIGHT NEXT DOOR",
        "timerLabel": "EARTH DELAY",
        "timerValue": "INSTANT (1 SECOND)",
        "themeColor": "#5BE08A",
        "messages": [
          {
            "from": "pip",
            "text": "come outside \ud83c\udf06",
            "status": "DELIVERED INSTANTLY"
          },
          {
            "from": "bo",
            "text": "right behind you! \ud83d\udc4b",
            "status": "1 SECOND"
          }
        ]
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "YOU TEXT BO COME OUTSIDE,",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S172": {
    "kind": "scene",
    "cfg": {
      "id": "S172",
      "set": "rooftop",
      "setVariant": "none",
      "cam": {
        "x": 1209,
        "y": 524,
        "z": 1.28
      },
      "camEnd": {
        "x": 1153,
        "y": 468,
        "z": 1.46
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "waveHi",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "celebrate",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "phone": {
        "x": 1380,
        "y": 545,
        "scale": 0.94,
        "tilt": -3,
        "header": "BO \u00b7 ROOFTOP",
        "subHeader": "RIGHT NEXT DOOR",
        "timerLabel": "EARTH DELAY",
        "timerValue": "INSTANT (1 SECOND)",
        "themeColor": "#5BE08A",
        "messages": [
          {
            "from": "pip",
            "text": "come outside \ud83c\udf06",
            "status": "DELIVERED INSTANTLY"
          },
          {
            "from": "bo",
            "text": "right behind you! \ud83d\udc4b",
            "status": "1 SECOND"
          }
        ]
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "AND BO STEPS THROUGH THE D",
        "color": "#FF6A5A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S173": {
    "kind": "diagram",
    "cfg": {
      "id": "S173",
      "mode": "nov2026_sky_calendar",
      "variant": 0,
      "title": "NOVEMBER 2026 SKYWATCHING & VOYAGER MILESTONE",
      "subtitle": "15-16 NOV MARS/JUPITER \u00b7 17 NOV CELEBRATION \u00b7 17-18 NOV LEONIDS",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 1236,
        "y": 513,
        "z": 1.41
      },
      "camEnd": {
        "x": 1342,
        "y": 504,
        "z": 1.44
      }
    }
  },
  "S174": {
    "kind": "scene",
    "cfg": {
      "id": "S174",
      "set": "rooftop",
      "setVariant": "voyager_17nov",
      "cam": {
        "x": 523,
        "y": 581,
        "z": 1.68
      },
      "camEnd": {
        "x": 496,
        "y": 565,
        "z": 1.73
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "ON THE SEVENTEENTH OF NOVE",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S175": {
    "kind": "scene",
    "cfg": {
      "id": "S175",
      "set": "rooftop",
      "setVariant": "voyager_17nov",
      "cam": {
        "x": 760,
        "y": 529,
        "z": 1.24
      },
      "camEnd": {
        "x": 810,
        "y": 511,
        "z": 1.42
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "celebrate",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "CELEBRATES VOYAGER'S LIGHT",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S176": {
    "kind": "scene",
    "cfg": {
      "id": "S176",
      "set": "rooftop",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 657,
        "y": 523,
        "z": 1.39
      },
      "camEnd": {
        "x": 629,
        "y": 508,
        "z": 1.57
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "WHILE THE LEONID METEORS P",
        "color": "#5BE08A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S177": {
    "kind": "scene",
    "cfg": {
      "id": "S177",
      "set": "rooftop",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 1154,
        "y": 421,
        "z": 1.58
      },
      "camEnd": {
        "x": 1128,
        "y": 404,
        "z": 1.78
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "ON THE SEVENTEENTH AND EIG",
        "color": "#FF8A3D",
        "x": 84,
        "y": 86
      }
    }
  },
  "S178": {
    "kind": "scene",
    "cfg": {
      "id": "S178",
      "set": "rooftop",
      "setVariant": "mars_jupiter_15_16nov",
      "cam": {
        "x": 941,
        "y": 494,
        "z": 0.99
      },
      "camEnd": {
        "x": 917,
        "y": 510,
        "z": 1.0
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "RIGHT AFTER MARS AND JUPIT",
        "color": "#FF6A5A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S179": {
    "kind": "diagram",
    "cfg": {
      "id": "S179",
      "mode": "nov2026_sky_calendar",
      "variant": 1,
      "title": "NOVEMBER 2026 SKYWATCHING & VOYAGER MILESTONE",
      "subtitle": "15-16 NOV MARS/JUPITER \u00b7 17 NOV CELEBRATION \u00b7 17-18 NOV LEONIDS",
      "accentColor": "#FFE27A",
      "cam": {
        "x": 958,
        "y": 557,
        "z": 1.1
      },
      "camEnd": {
        "x": 996,
        "y": 536,
        "z": 1.09
      }
    }
  },
  "S180": {
    "kind": "scene",
    "cfg": {
      "id": "S180",
      "set": "rooftop",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 875,
        "y": 451,
        "z": 1.18
      },
      "camEnd": {
        "x": 945,
        "y": 423,
        "z": 1.34
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "phone": {
        "x": 960,
        "y": 545,
        "scale": 1.0,
        "tilt": -3,
        "header": "BO \u00b7 ROOFTOP",
        "subHeader": "RIGHT NEXT DOOR",
        "timerLabel": "THE QUESTION",
        "timerValue": "REPLY IN 48:00:00",
        "themeColor": "#FFE27A",
        "messages": [
          {
            "from": "pip",
            "text": "Who would you text if the reply took 2 days?",
            "status": "COMMENT BELOW \ud83d\udcac"
          }
        ]
      },
      "banner": {
        "text": "WHO WOULD YOU TEXT?",
        "sub": "IF THE REPLY TOOK 2 DAYS",
        "color": "#FFE27A"
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "WHO WOULD YOU TEXT IF THE ",
        "color": "#7FD4FF",
        "x": 84,
        "y": 86
      }
    }
  },
  "S181": {
    "kind": "scene",
    "cfg": {
      "id": "S181",
      "set": "rooftop",
      "setVariant": "voyager_17nov",
      "cam": {
        "x": 1392,
        "y": 574,
        "z": 1.52
      },
      "camEnd": {
        "x": 1369,
        "y": 544,
        "z": 1.71
      },
      "pip": {
        "x": 640,
        "y": 790,
        "pose": "pointSky",
        "scale": 1.1,
        "holdPhone": true
      },
      "bo": {
        "x": 1020,
        "y": 790,
        "pose": "celebrate",
        "scale": 1.08,
        "flip": -1,
        "holdPhone": true
      },
      "banner": {
        "text": "STEP INTO THE WHAT IF.",
        "color": "#7FD4FF"
      },
      "pill": {
        "label": "NOVEMBER 2026 SKY",
        "value": "STEP INTO THE WHAT IF.",
        "color": "#FFE27A",
        "x": 84,
        "y": 86
      }
    }
  },
  "S182": {
    "kind": "scene",
    "cfg": {
      "id": "S182",
      "set": "rooftop",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 525,
        "z": 1.06
      },
      "endCard": "16x9"
    }
  }
};

function makeShot(id: string): React.FC<ShotProps> {
  const spec = SHOT_SPECS[id];
  const fn: React.FC<ShotProps> = ({ t, len }) => {
    if (spec.kind === 'diagram') {
      return <LightdayDiagramShot t={t} len={len} cfg={spec.cfg} />;
    }
    return <LightdaySceneShot t={t} len={len} cfg={spec.cfg} />;
  };
  return fn;
}

export const FILM_SHOTS: ShotMap = Object.fromEntries(
  Object.keys(SHOT_SPECS).map((k) => [k, makeShot(k)])
);
