import React from 'react';
import { ShotMap, ShotProps } from '../../engine';
import { ClosermoonSceneShot, ClosermoonDiagramShot, ClosermoonSceneConfig, ClosermoonDiagramConfig } from './stage';

type SpecEntry = { kind: 'scene'; cfg: ClosermoonSceneConfig } | { kind: 'diagram'; cfg: ClosermoonDiagramConfig };

const SHOT_SPECS: Record<string, SpecEntry> = {
  "S1": {
    "kind": "scene",
    "cfg": {
      "id": "S1",
      "set": "night_beach",
      "setVariant": "hook",
      "cam": {
        "x": 960,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 522,
        "z": 1.08
      },
      "pip": {
        "x": 640,
        "pose": "beachAwe",
        "scale": 0.84,
        "flip": 1
      },
      "banner": {
        "text": "MOON 2X CLOSER",
        "sub": "384,400 KM \u2192 ABOUT 192,200 KM",
        "color": "#FFE27A",
        "x": 960,
        "y": 108,
        "instant": true
      },
      "gauge": {
        "variant": "digital_bar",
        "x": 1520,
        "y": 355,
        "scale": 0.92,
        "tilt": -2,
        "header": "LUNAR DISTANCE READOUT",
        "distFrom": "384,400 KM",
        "distTo": "192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "SKY AREA x4",
        "themeColor": "#7FD4FF",
        "instant": true
      },
      "pill": {
        "label": "AVERAGE ORBIT HALVED",
        "value": "MOON: 192,200 KM",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S2": {
    "kind": "scene",
    "cfg": {
      "id": "S2",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 740,
        "y": 600,
        "z": 1.46
      },
      "camEnd": {
        "x": 780,
        "y": 580,
        "z": 1.58
      },
      "pip": {
        "x": 610,
        "pose": "pointMoon",
        "scale": 1.02,
        "flip": 1
      },
      "banner": {
        "text": "MOON 2X CLOSER",
        "sub": "WATCH THE OCEAN FIRST",
        "color": "#7FD4FF",
        "x": 960,
        "y": 108,
        "instant": true
      },
      "pill": {
        "label": "FIRST CONSEQUENCE",
        "value": "TIDAL SURGE RISING",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S3": {
    "kind": "scene",
    "cfg": {
      "id": "S3",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 716,
        "y": 589,
        "z": 1.54
      },
      "camEnd": {
        "x": 707,
        "y": 621,
        "z": 1.64
      },
      "pip": {
        "x": 690,
        "pose": "ankleScramble",
        "scale": 1.04,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDES \u00b7 ABOUT 8X STRONGER",
        "color": "#5BE08A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL FORCE (1/D\u00b3)",
        "value": "PULL x8 (TWICE AS CLOSE)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S4": {
    "kind": "scene",
    "cfg": {
      "id": "S4",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 809,
        "y": 586,
        "z": 1.88
      },
      "camEnd": {
        "x": 856,
        "y": 557,
        "z": 2.14
      },
      "pip": {
        "x": 755,
        "pose": "ankleScramble",
        "scale": 0.88,
        "flip": -1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDES \u00b7 ABOUT 8X STRONGER",
        "color": "#5BE08A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL FORCE (1/D\u00b3)",
        "value": "PULL x8 (TWICE AS CLOSE)",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S5": {
    "kind": "scene",
    "cfg": {
      "id": "S5",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 1082,
        "y": 493,
        "z": 1.29
      },
      "camEnd": {
        "x": 1019,
        "y": 519,
        "z": 1.34
      },
      "pip": {
        "x": 820,
        "pose": "beachAwe",
        "scale": 0.96,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDES \u00b7 ABOUT 8X STRONGER",
        "color": "#5BE08A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL FORCE (1/D\u00b3)",
        "value": "PULL x8 (TWICE AS CLOSE)",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1490,
        "y": 375,
        "scale": 0.88,
        "tilt": 3.0,
        "header": "COLD OPEN \u00b7 TIDE & DISTANCE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "WIDTH x2 \u00b7 AREA x4",
        "themeColor": "#A68CFF"
      }
    }
  },
  "S6": {
    "kind": "scene",
    "cfg": {
      "id": "S6",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 815,
        "y": 500,
        "z": 1.78
      },
      "camEnd": {
        "x": 783,
        "y": 470,
        "z": 1.84
      },
      "pip": {
        "x": 885,
        "pose": "beachAwe",
        "scale": 1.04,
        "flip": -1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDES \u00b7 ABOUT 8X STRONGER",
        "color": "#5BE08A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL FORCE (1/D\u00b3)",
        "value": "PULL x8 (TWICE AS CLOSE)",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S7": {
    "kind": "scene",
    "cfg": {
      "id": "S7",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 1208,
        "y": 567,
        "z": 1.38
      },
      "camEnd": {
        "x": 1206,
        "y": 587,
        "z": 1.56
      },
      "pip": {
        "x": 950,
        "pose": "ankleScramble",
        "scale": 0.88,
        "flip": 1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S8": {
    "kind": "scene",
    "cfg": {
      "id": "S8",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 641,
        "y": 654,
        "z": 2.15
      },
      "camEnd": {
        "x": 640,
        "y": 618,
        "z": 2.36
      },
      "pip": {
        "x": 595,
        "pose": "ankleScramble",
        "scale": 0.96,
        "flip": -1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S9": {
    "kind": "scene",
    "cfg": {
      "id": "S9",
      "set": "night_beach",
      "setVariant": "surge",
      "cam": {
        "x": 894,
        "y": 511,
        "z": 1.06
      },
      "camEnd": {
        "x": 1038,
        "y": 525,
        "z": 1.04
      },
      "pip": {
        "x": 660,
        "pose": "beachAwe",
        "scale": 1.04,
        "flip": 1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "digital_bar",
        "x": 1490,
        "y": 375,
        "scale": 0.88,
        "tilt": 1.5,
        "header": "COLD OPEN \u00b7 TIDE & DISTANCE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "WIDTH x2 \u00b7 AREA x4",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S10": {
    "kind": "scene",
    "cfg": {
      "id": "S10",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 1167,
        "y": 478,
        "z": 1.52
      },
      "camEnd": {
        "x": 1147,
        "y": 436,
        "z": 1.68
      },
      "pip": {
        "x": 725,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": -1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S11": {
    "kind": "scene",
    "cfg": {
      "id": "S11",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 720,
        "y": 605,
        "z": 1.49
      },
      "camEnd": {
        "x": 705,
        "y": 613,
        "z": 1.64
      },
      "pip": {
        "x": 790,
        "pose": "pointMoon",
        "scale": 0.96,
        "flip": 1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S12": {
    "kind": "scene",
    "cfg": {
      "id": "S12",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 813,
        "y": 602,
        "z": 1.98
      },
      "camEnd": {
        "x": 854,
        "y": 549,
        "z": 2.14
      },
      "pip": {
        "x": 855,
        "pose": "pointMoon",
        "scale": 1.04,
        "flip": -1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 430,
        "y": 375,
        "scale": 0.88,
        "tilt": -1.5,
        "header": "COLD OPEN \u00b7 TIDE & DISTANCE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "WIDTH x2 \u00b7 AREA x4",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S13": {
    "kind": "scene",
    "cfg": {
      "id": "S13",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 1086,
        "y": 509,
        "z": 1.24
      },
      "camEnd": {
        "x": 1017,
        "y": 511,
        "z": 1.34
      },
      "pip": {
        "x": 920,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDES \u00b7 ABOUT 8X STRONGER",
        "color": "#5BE08A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL FORCE (1/D\u00b3)",
        "value": "PULL x8 (TWICE AS CLOSE)",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S14": {
    "kind": "scene",
    "cfg": {
      "id": "S14",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 819,
        "y": 516,
        "z": 1.73
      },
      "camEnd": {
        "x": 781,
        "y": 462,
        "z": 1.84
      },
      "pip": {
        "x": 565,
        "pose": "pointMoon",
        "scale": 0.96,
        "flip": -1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 430,
        "y": 375,
        "scale": 0.88,
        "tilt": 1.5,
        "header": "COLD OPEN \u00b7 TIDE & DISTANCE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "WIDTH x2 \u00b7 AREA x4",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S15": {
    "kind": "scene",
    "cfg": {
      "id": "S15",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 1212,
        "y": 583,
        "z": 1.48
      },
      "camEnd": {
        "x": 1204,
        "y": 579,
        "z": 1.56
      },
      "pip": {
        "x": 630,
        "pose": "beachAwe",
        "scale": 1.04,
        "flip": 1
      },
      "banner": {
        "text": "ABOUT 192,200 KM",
        "sub": "USUAL AVERAGE: 384,400 KM (NASA)",
        "color": "#FFE27A",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "LUNAR DISTANCE",
        "value": "384,400 KM \u2192 192,200 KM",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S16": {
    "kind": "scene",
    "cfg": {
      "id": "S16",
      "set": "night_beach",
      "setVariant": "hook",
      "cam": {
        "x": 960,
        "y": 515,
        "z": 0.95
      },
      "camEnd": {
        "x": 960,
        "y": 495,
        "z": 1.04
      },
      "pip": {
        "x": 520,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "titleCard": {
        "x": 960,
        "y": 180,
        "size": 112
      },
      "pill": {
        "label": "IFMOSPHERE \u00b7 STEP INTO THE WHAT IF",
        "value": "384,400 KM \u2192 ABOUT 192,200 KM",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S17": {
    "kind": "diagram",
    "cfg": {
      "id": "S17",
      "mode": "nasa_moon_facts",
      "variant": 1,
      "title": "NASA MOON FACTS: 384,400 KM AVERAGE",
      "subtitle": "238,855 MILES \u00b7 RADIUS 1,740 KM \u00b7 27-DAY ORBIT",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 934,
        "y": 528,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 1 SCIENCE FACT",
        "value": "238,855 MILES",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S18": {
    "kind": "scene",
    "cfg": {
      "id": "S18",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 1171,
        "y": 494,
        "z": 1.62
      },
      "camEnd": {
        "x": 1145,
        "y": 428,
        "z": 1.68
      },
      "pip": {
        "x": 535,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S19": {
    "kind": "scene",
    "cfg": {
      "id": "S19",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 724,
        "y": 621,
        "z": 1.44
      },
      "camEnd": {
        "x": 703,
        "y": 605,
        "z": 1.64
      },
      "pip": {
        "x": 610,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "384,400 KM",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S20": {
    "kind": "scene",
    "cfg": {
      "id": "S20",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 817,
        "y": 548,
        "z": 1.93
      },
      "camEnd": {
        "x": 852,
        "y": 576,
        "z": 2.14
      },
      "pip": {
        "x": 685,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S21": {
    "kind": "scene",
    "cfg": {
      "id": "S21",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 1090,
        "y": 525,
        "z": 1.34
      },
      "camEnd": {
        "x": 1015,
        "y": 503,
        "z": 1.34
      },
      "pip": {
        "x": 400,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S22": {
    "kind": "scene",
    "cfg": {
      "id": "S22",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 823,
        "y": 462,
        "z": 1.68
      },
      "camEnd": {
        "x": 779,
        "y": 489,
        "z": 1.84
      },
      "pip": {
        "x": 475,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "384,400 KM",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S23": {
    "kind": "diagram",
    "cfg": {
      "id": "S23",
      "mode": "nasa_moon_facts",
      "variant": 2,
      "title": "NASA MOON FACTS: 384,400 KM AVERAGE",
      "subtitle": "238,855 MILES \u00b7 RADIUS 1,740 KM \u00b7 27-DAY ORBIT",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 988,
        "y": 526,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 1 SCIENCE FACT",
        "value": "238,855 MILES",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S24": {
    "kind": "scene",
    "cfg": {
      "id": "S24",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 649,
        "y": 616,
        "z": 2.2
      },
      "camEnd": {
        "x": 636,
        "y": 637,
        "z": 2.36
      },
      "pip": {
        "x": 625,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S25": {
    "kind": "scene",
    "cfg": {
      "id": "S25",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 902,
        "y": 543,
        "z": 0.96
      },
      "camEnd": {
        "x": 1034,
        "y": 509,
        "z": 1.04
      },
      "pip": {
        "x": 340,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "LUNAR RADIUS & ORBIT",
        "value": "1,740 KM \u00b7 27 DAYS",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "digital_bar",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "1,740 KM \u00b7 27 DAYS",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S26": {
    "kind": "scene",
    "cfg": {
      "id": "S26",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 1175,
        "y": 440,
        "z": 1.57
      },
      "camEnd": {
        "x": 1143,
        "y": 455,
        "z": 1.68
      },
      "pip": {
        "x": 415,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S27": {
    "kind": "scene",
    "cfg": {
      "id": "S27",
      "set": "oval_orbit",
      "setVariant": "perigee_apogee",
      "cam": {
        "x": 728,
        "y": 637,
        "z": 1.54
      },
      "camEnd": {
        "x": 701,
        "y": 597,
        "z": 1.64
      },
      "pip": {
        "x": 490,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "CLOSEST POINT (PERIGEE)",
        "value": "~363,300 KM (226,000 MI)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S28": {
    "kind": "scene",
    "cfg": {
      "id": "S28",
      "set": "oval_orbit",
      "setVariant": "perigee_apogee",
      "cam": {
        "x": 821,
        "y": 564,
        "z": 1.88
      },
      "camEnd": {
        "x": 850,
        "y": 568,
        "z": 2.14
      },
      "pip": {
        "x": 565,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "CLOSEST POINT (PERIGEE)",
        "value": "~363,300 KM (226,000 MI)",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "~363,300 KM",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S29": {
    "kind": "diagram",
    "cfg": {
      "id": "S29",
      "mode": "nasa_moon_facts",
      "variant": 3,
      "title": "NASA MOON FACTS: 384,400 KM AVERAGE",
      "subtitle": "238,855 MILES \u00b7 RADIUS 1,740 KM \u00b7 27-DAY ORBIT",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 982,
        "y": 524,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 1 SCIENCE FACT",
        "value": "238,855 MILES",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S30": {
    "kind": "scene",
    "cfg": {
      "id": "S30",
      "set": "oval_orbit",
      "setVariant": "perigee_apogee",
      "cam": {
        "x": 827,
        "y": 478,
        "z": 1.78
      },
      "camEnd": {
        "x": 777,
        "y": 481,
        "z": 1.84
      },
      "pip": {
        "x": 355,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "LUNAR RADIUS & ORBIT",
        "value": "1,740 KM \u00b7 27 DAYS",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S31": {
    "kind": "scene",
    "cfg": {
      "id": "S31",
      "set": "oval_orbit",
      "setVariant": "perigee_apogee",
      "cam": {
        "x": 1220,
        "y": 615,
        "z": 1.38
      },
      "camEnd": {
        "x": 1200,
        "y": 563,
        "z": 1.56
      },
      "pip": {
        "x": 430,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "FARTHEST POINT (APOGEE)",
        "value": "~405,500 KM (251,000 MI)",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "~405,500 KM",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S32": {
    "kind": "scene",
    "cfg": {
      "id": "S32",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 653,
        "y": 632,
        "z": 2.15
      },
      "camEnd": {
        "x": 634,
        "y": 629,
        "z": 2.36
      },
      "pip": {
        "x": 505,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S33": {
    "kind": "scene",
    "cfg": {
      "id": "S33",
      "set": "oval_orbit",
      "setVariant": "oval_today",
      "cam": {
        "x": 906,
        "y": 559,
        "z": 1.06
      },
      "camEnd": {
        "x": 1032,
        "y": 501,
        "z": 1.04
      },
      "pip": {
        "x": 580,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "FARTHEST POINT (APOGEE)",
        "value": "~405,500 KM (251,000 MI)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S34": {
    "kind": "scene",
    "cfg": {
      "id": "S34",
      "set": "oval_orbit",
      "setVariant": "perigee_apogee",
      "cam": {
        "x": 1179,
        "y": 456,
        "z": 1.52
      },
      "camEnd": {
        "x": 1141,
        "y": 447,
        "z": 1.68
      },
      "pip": {
        "x": 655,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "384,400 KM",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S35": {
    "kind": "diagram",
    "cfg": {
      "id": "S35",
      "mode": "nasa_moon_facts",
      "variant": 4,
      "title": "NASA MOON FACTS: 384,400 KM AVERAGE",
      "subtitle": "238,855 MILES \u00b7 RADIUS 1,740 KM \u00b7 27-DAY ORBIT",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 976,
        "y": 522,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 1 SCIENCE FACT",
        "value": "238,855 MILES",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S36": {
    "kind": "scene",
    "cfg": {
      "id": "S36",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 825,
        "y": 580,
        "z": 1.98
      },
      "camEnd": {
        "x": 848,
        "y": 560,
        "z": 2.14
      },
      "pip": {
        "x": 445,
        "pose": "beachAwe",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "LUNAR RETREAT RATE",
        "value": "~1 INCH FARTHER / YEAR",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S37": {
    "kind": "scene",
    "cfg": {
      "id": "S37",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 1098,
        "y": 487,
        "z": 1.24
      },
      "camEnd": {
        "x": 1011,
        "y": 522,
        "z": 1.34
      },
      "pip": {
        "x": 520,
        "pose": "pointMoon",
        "scale": 0.88,
        "flip": 1
      },
      "pill": {
        "label": "NASA AVERAGE DISTANCE",
        "value": "384,400 KM (238,855 MI)",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1500,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "NASA LUNAR ORBIT DATA",
        "distFrom": "PERIGEE ~363,300 KM",
        "distTo": "384,400 KM",
        "sizeLabel": "27-DAY ORBIT",
        "subMetric": "RADIUS 1,740 KM",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S38": {
    "kind": "scene",
    "cfg": {
      "id": "S38",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "HALF THE DISTANCE",
        "sub": "384,400 KM \u2192 ABOUT 192,200 KM",
        "color": "#7FD4FF",
        "mode": "hero"
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 440,
        "y": 590,
        "scale": 0.88,
        "tilt": 2,
        "header": "CHAPTER 2 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "384,400 KM \u2192 ABOUT 192,200",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S39": {
    "kind": "scene",
    "cfg": {
      "id": "S39",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 1224,
        "y": 561,
        "z": 1.48
      },
      "camEnd": {
        "x": 1198,
        "y": 590,
        "z": 1.56
      },
      "pip": {
        "x": 520,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S40": {
    "kind": "scene",
    "cfg": {
      "id": "S40",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 657,
        "y": 648,
        "z": 2.1
      },
      "camEnd": {
        "x": 632,
        "y": 621,
        "z": 2.36
      },
      "pip": {
        "x": 580,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S41": {
    "kind": "diagram",
    "cfg": {
      "id": "S41",
      "mode": "halved_192200_area4x",
      "variant": 0,
      "title": "HALF THE DISTANCE = ABOUT 192,200 KM",
      "subtitle": "APPARENT WIDTH x2 \u00b7 SKY AREA x4",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 970,
        "y": 520,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 2 SCIENCE FACT",
        "value": "APPARENT WIDTH x2",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S42": {
    "kind": "scene",
    "cfg": {
      "id": "S42",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 1183,
        "y": 472,
        "z": 1.62
      },
      "camEnd": {
        "x": 1139,
        "y": 439,
        "z": 1.68
      },
      "pip": {
        "x": 700,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S43": {
    "kind": "scene",
    "cfg": {
      "id": "S43",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 736,
        "y": 599,
        "z": 1.44
      },
      "camEnd": {
        "x": 697,
        "y": 616,
        "z": 1.64
      },
      "pip": {
        "x": 760,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S44": {
    "kind": "scene",
    "cfg": {
      "id": "S44",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 829,
        "y": 596,
        "z": 1.93
      },
      "camEnd": {
        "x": 846,
        "y": 552,
        "z": 2.14
      },
      "pip": {
        "x": 820,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S45": {
    "kind": "scene",
    "cfg": {
      "id": "S45",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 1102,
        "y": 503,
        "z": 1.34
      },
      "camEnd": {
        "x": 1009,
        "y": 514,
        "z": 1.34
      },
      "pip": {
        "x": 880,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S46": {
    "kind": "scene",
    "cfg": {
      "id": "S46",
      "set": "oval_orbit",
      "setVariant": "halved_orbit",
      "cam": {
        "x": 695,
        "y": 510,
        "z": 1.68
      },
      "camEnd": {
        "x": 843,
        "y": 465,
        "z": 1.84
      },
      "pip": {
        "x": 560,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S47": {
    "kind": "diagram",
    "cfg": {
      "id": "S47",
      "mode": "halved_192200_area4x",
      "variant": 1,
      "title": "HALF THE DISTANCE = ABOUT 192,200 KM",
      "subtitle": "APPARENT WIDTH x2 \u00b7 SKY AREA x4",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 964,
        "y": 558,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 2 SCIENCE FACT",
        "value": "APPARENT WIDTH x2",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S48": {
    "kind": "scene",
    "cfg": {
      "id": "S48",
      "set": "thumb_sky",
      "setVariant": "thumb_normal",
      "cam": {
        "x": 661,
        "y": 664,
        "z": 2.2
      },
      "camEnd": {
        "x": 630,
        "y": 613,
        "z": 2.36
      },
      "pip": {
        "x": 680,
        "pose": "thumbTest",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S49": {
    "kind": "scene",
    "cfg": {
      "id": "S49",
      "set": "thumb_sky",
      "setVariant": "thumb_giant",
      "cam": {
        "x": 914,
        "y": 521,
        "z": 0.96
      },
      "camEnd": {
        "x": 1028,
        "y": 520,
        "z": 1.04
      },
      "pip": {
        "x": 740,
        "pose": "thumbTest",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S50": {
    "kind": "scene",
    "cfg": {
      "id": "S50",
      "set": "thumb_sky",
      "setVariant": "thumb_giant",
      "cam": {
        "x": 1187,
        "y": 488,
        "z": 1.57
      },
      "camEnd": {
        "x": 1137,
        "y": 431,
        "z": 1.68
      },
      "pip": {
        "x": 800,
        "pose": "thumbTest",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S51": {
    "kind": "scene",
    "cfg": {
      "id": "S51",
      "set": "window_room",
      "setVariant": "window_lantern",
      "cam": {
        "x": 740,
        "y": 615,
        "z": 1.54
      },
      "camEnd": {
        "x": 695,
        "y": 608,
        "z": 1.64
      },
      "pip": {
        "x": 860,
        "pose": "windowGaze",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S52": {
    "kind": "scene",
    "cfg": {
      "id": "S52",
      "set": "window_room",
      "setVariant": "window_coin",
      "cam": {
        "x": 833,
        "y": 612,
        "z": 1.88
      },
      "camEnd": {
        "x": 844,
        "y": 544,
        "z": 2.14
      },
      "pip": {
        "x": 540,
        "pose": "windowGaze",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 430,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S53": {
    "kind": "diagram",
    "cfg": {
      "id": "S53",
      "mode": "halved_192200_area4x",
      "variant": 2,
      "title": "HALF THE DISTANCE = ABOUT 192,200 KM",
      "subtitle": "APPARENT WIDTH x2 \u00b7 SKY AREA x4",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 958,
        "y": 556,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 2 SCIENCE FACT",
        "value": "APPARENT WIDTH x2",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S54": {
    "kind": "scene",
    "cfg": {
      "id": "S54",
      "set": "window_room",
      "setVariant": "window_lantern",
      "cam": {
        "x": 699,
        "y": 456,
        "z": 1.78
      },
      "camEnd": {
        "x": 841,
        "y": 492,
        "z": 1.84
      },
      "pip": {
        "x": 660,
        "pose": "windowGaze",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "TWICE AS CLOSE (COMPUTED)",
        "value": "ABOUT 192,200 KM \u00b7 WIDTH x2 \u00b7 AREA x4",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 430,
        "y": 355,
        "scale": 0.88,
        "tilt": -2,
        "header": "APPARENT SKY SIZE",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "FOUR TIMES THE AREA (x4)",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S55": {
    "kind": "scene",
    "cfg": {
      "id": "S55",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "SUPERMOON REALITY CHECK",
        "sub": "14% BIGGER VS 100% WIDER",
        "color": "#FFE27A",
        "mode": "hero"
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 1480,
        "y": 590,
        "scale": 0.88,
        "tilt": -2,
        "header": "CHAPTER 3 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "14% BIGGER VS 100% WIDER",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S56": {
    "kind": "scene",
    "cfg": {
      "id": "S56",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 665,
        "y": 610,
        "z": 2.15
      },
      "camEnd": {
        "x": 628,
        "y": 640,
        "z": 2.36
      },
      "pip": {
        "x": 775,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S57": {
    "kind": "scene",
    "cfg": {
      "id": "S57",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 918,
        "y": 537,
        "z": 1.06
      },
      "camEnd": {
        "x": 1026,
        "y": 512,
        "z": 1.04
      },
      "pip": {
        "x": 820,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": 1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 355,
        "scale": 0.86,
        "tilt": 2,
        "header": "SUPERMOON REALITY CHECK",
        "distFrom": "~363,300 KM (+14%)",
        "distTo": "192,200 KM (+100%)",
        "sizeLabel": "100% WIDER",
        "subMetric": "AREA x4 VS +14% SUPERMOON",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S58": {
    "kind": "scene",
    "cfg": {
      "id": "S58",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 1191,
        "y": 434,
        "z": 1.52
      },
      "camEnd": {
        "x": 1135,
        "y": 458,
        "z": 1.68
      },
      "pip": {
        "x": 865,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S59": {
    "kind": "diagram",
    "cfg": {
      "id": "S59",
      "mode": "supermoon_14_vs_100",
      "variant": 3,
      "title": "SUPERMOON (+14% BIGGER) VS 2X CLOSER (+100% WIDER)",
      "subtitle": "NASA: UP TO 14% BIGGER & 30% BRIGHTER AT PERIGEE",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 952,
        "y": 554,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 3 SCIENCE FACT",
        "value": "NASA: UP TO 14% BIGGER & 30% BRIGHTER AT PERIGEE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S60": {
    "kind": "scene",
    "cfg": {
      "id": "S60",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 837,
        "y": 558,
        "z": 1.98
      },
      "camEnd": {
        "x": 842,
        "y": 571,
        "z": 2.14
      },
      "pip": {
        "x": 715,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S61": {
    "kind": "scene",
    "cfg": {
      "id": "S61",
      "set": "supermoon_stage",
      "setVariant": "subtle_14",
      "cam": {
        "x": 1110,
        "y": 535,
        "z": 1.24
      },
      "camEnd": {
        "x": 1005,
        "y": 498,
        "z": 1.34
      },
      "pip": {
        "x": 760,
        "pose": "squintTube",
        "scale": 0.95,
        "flip": 1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 355,
        "scale": 0.86,
        "tilt": 2,
        "header": "SUPERMOON REALITY CHECK",
        "distFrom": "~363,300 KM (+14%)",
        "distTo": "192,200 KM (+100%)",
        "sizeLabel": "100% WIDER",
        "subMetric": "AREA x4 VS +14% SUPERMOON",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S62": {
    "kind": "scene",
    "cfg": {
      "id": "S62",
      "set": "supermoon_stage",
      "setVariant": "subtle_14",
      "cam": {
        "x": 703,
        "y": 472,
        "z": 1.73
      },
      "camEnd": {
        "x": 839,
        "y": 484,
        "z": 1.84
      },
      "pip": {
        "x": 805,
        "pose": "squintTube",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S63": {
    "kind": "scene",
    "cfg": {
      "id": "S63",
      "set": "supermoon_stage",
      "setVariant": "subtle_14",
      "cam": {
        "x": 1236,
        "y": 609,
        "z": 1.48
      },
      "camEnd": {
        "x": 1192,
        "y": 566,
        "z": 1.56
      },
      "pip": {
        "x": 850,
        "pose": "squintTube",
        "scale": 0.95,
        "flip": 1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 420,
        "y": 355,
        "scale": 0.86,
        "tilt": 2,
        "header": "SUPERMOON REALITY CHECK",
        "distFrom": "~363,300 KM (+14%)",
        "distTo": "192,200 KM (+100%)",
        "sizeLabel": "100% WIDER",
        "subMetric": "AREA x4 VS +14% SUPERMOON",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S64": {
    "kind": "scene",
    "cfg": {
      "id": "S64",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 669,
        "y": 626,
        "z": 2.1
      },
      "camEnd": {
        "x": 626,
        "y": 632,
        "z": 2.36
      },
      "pip": {
        "x": 895,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S65": {
    "kind": "diagram",
    "cfg": {
      "id": "S65",
      "mode": "supermoon_14_vs_100",
      "variant": 4,
      "title": "SUPERMOON (+14% BIGGER) VS 2X CLOSER (+100% WIDER)",
      "subtitle": "NASA: UP TO 14% BIGGER & 30% BRIGHTER AT PERIGEE",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 946,
        "y": 552,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 3 SCIENCE FACT",
        "value": "NASA: UP TO 14% BIGGER & 30% BRIGHTER AT PERIGEE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S66": {
    "kind": "scene",
    "cfg": {
      "id": "S66",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 1195,
        "y": 450,
        "z": 1.62
      },
      "camEnd": {
        "x": 1133,
        "y": 450,
        "z": 1.68
      },
      "pip": {
        "x": 745,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S67": {
    "kind": "scene",
    "cfg": {
      "id": "S67",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 748,
        "y": 647,
        "z": 1.44
      },
      "camEnd": {
        "x": 691,
        "y": 592,
        "z": 1.64
      },
      "pip": {
        "x": 790,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": 1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 420,
        "y": 355,
        "scale": 0.86,
        "tilt": 2,
        "header": "SUPERMOON REALITY CHECK",
        "distFrom": "~363,300 KM (+14%)",
        "distTo": "192,200 KM (+100%)",
        "sizeLabel": "100% WIDER",
        "subMetric": "AREA x4 VS +14% SUPERMOON",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S68": {
    "kind": "scene",
    "cfg": {
      "id": "S68",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 841,
        "y": 574,
        "z": 1.93
      },
      "camEnd": {
        "x": 840,
        "y": 563,
        "z": 2.14
      },
      "pip": {
        "x": 835,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S69": {
    "kind": "scene",
    "cfg": {
      "id": "S69",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 1114,
        "y": 551,
        "z": 1.34
      },
      "camEnd": {
        "x": 1003,
        "y": 490,
        "z": 1.34
      },
      "pip": {
        "x": 880,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": 1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 355,
        "scale": 0.86,
        "tilt": 2,
        "header": "SUPERMOON REALITY CHECK",
        "distFrom": "~363,300 KM (+14%)",
        "distTo": "192,200 KM (+100%)",
        "sizeLabel": "100% WIDER",
        "subMetric": "AREA x4 VS +14% SUPERMOON",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S70": {
    "kind": "scene",
    "cfg": {
      "id": "S70",
      "set": "supermoon_stage",
      "setVariant": "side_by_side",
      "cam": {
        "x": 707,
        "y": 488,
        "z": 1.68
      },
      "camEnd": {
        "x": 837,
        "y": 476,
        "z": 1.84
      },
      "pip": {
        "x": 925,
        "pose": "pointMoon",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S71": {
    "kind": "diagram",
    "cfg": {
      "id": "S71",
      "mode": "supermoon_14_vs_100",
      "variant": 0,
      "title": "SUPERMOON (+14% BIGGER) VS 2X CLOSER (+100% WIDER)",
      "subtitle": "NASA: UP TO 14% BIGGER & 30% BRIGHTER AT PERIGEE",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 940,
        "y": 550,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 3 SCIENCE FACT",
        "value": "NASA: UP TO 14% BIGGER & 30% BRIGHTER AT PERIGEE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S72": {
    "kind": "scene",
    "cfg": {
      "id": "S72",
      "set": "supermoon_stage",
      "setVariant": "stool_tip",
      "cam": {
        "x": 673,
        "y": 642,
        "z": 2.2
      },
      "camEnd": {
        "x": 624,
        "y": 624,
        "z": 2.36
      },
      "pip": {
        "x": 775,
        "pose": "stoolTip",
        "scale": 0.95,
        "flip": -1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S73": {
    "kind": "scene",
    "cfg": {
      "id": "S73",
      "set": "supermoon_stage",
      "setVariant": "stool_tip",
      "cam": {
        "x": 926,
        "y": 499,
        "z": 0.96
      },
      "camEnd": {
        "x": 1022,
        "y": 531,
        "z": 1.04
      },
      "pip": {
        "x": 820,
        "pose": "stoolTip",
        "scale": 0.95,
        "flip": 1
      },
      "pill": {
        "label": "NASA SUPERMOON VS 2X CLOSER",
        "value": "+14% BIGGER (+30% BRIGHTER) VS +100% WIDER",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 355,
        "scale": 0.86,
        "tilt": 2,
        "header": "SUPERMOON REALITY CHECK",
        "distFrom": "~363,300 KM (+14%)",
        "distTo": "192,200 KM (+100%)",
        "sizeLabel": "100% WIDER",
        "subMetric": "AREA x4 VS +14% SUPERMOON",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S74": {
    "kind": "scene",
    "cfg": {
      "id": "S74",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "SILVER NIGHTS",
        "sub": "ABOUT 192,200 KM \u00b7 FOUR TIMES THE AREA",
        "color": "#7FD4FF",
        "mode": "hero"
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 440,
        "y": 590,
        "scale": 0.88,
        "tilt": 2,
        "header": "CHAPTER 4 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "ABOUT 192,200 KM \u00b7 FOUR TI",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S75": {
    "kind": "scene",
    "cfg": {
      "id": "S75",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 612,
        "y": 593,
        "z": 1.54
      },
      "camEnd": {
        "x": 759,
        "y": 619,
        "z": 1.64
      },
      "pip": {
        "x": 620,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S76": {
    "kind": "scene",
    "cfg": {
      "id": "S76",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 845,
        "y": 590,
        "z": 1.88
      },
      "camEnd": {
        "x": 838,
        "y": 555,
        "z": 2.14
      },
      "pip": {
        "x": 670,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 420,
        "y": 350,
        "scale": 0.86,
        "tilt": -2,
        "header": "NIGHT SKY DISC AREA",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "WIDTH x2 IN NIGHT SKY",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S77": {
    "kind": "scene",
    "cfg": {
      "id": "S77",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 1118,
        "y": 497,
        "z": 1.29
      },
      "camEnd": {
        "x": 1001,
        "y": 517,
        "z": 1.34
      },
      "pip": {
        "x": 720,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S78": {
    "kind": "scene",
    "cfg": {
      "id": "S78",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 711,
        "y": 504,
        "z": 1.78
      },
      "camEnd": {
        "x": 835,
        "y": 468,
        "z": 1.84
      },
      "pip": {
        "x": 770,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S79": {
    "kind": "scene",
    "cfg": {
      "id": "S79",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 1244,
        "y": 571,
        "z": 1.38
      },
      "camEnd": {
        "x": 1188,
        "y": 585,
        "z": 1.56
      },
      "pip": {
        "x": 560,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 420,
        "y": 350,
        "scale": 0.86,
        "tilt": -2,
        "header": "NIGHT SKY DISC AREA",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "WIDTH x2 IN NIGHT SKY",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S80": {
    "kind": "scene",
    "cfg": {
      "id": "S80",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 677,
        "y": 658,
        "z": 2.15
      },
      "camEnd": {
        "x": 622,
        "y": 616,
        "z": 2.36
      },
      "pip": {
        "x": 610,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S81": {
    "kind": "scene",
    "cfg": {
      "id": "S81",
      "set": "silver_park",
      "setVariant": "streetlights_off",
      "cam": {
        "x": 930,
        "y": 515,
        "z": 1.06
      },
      "camEnd": {
        "x": 1020,
        "y": 523,
        "z": 1.04
      },
      "pip": {
        "x": 660,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S82": {
    "kind": "scene",
    "cfg": {
      "id": "S82",
      "set": "silver_park",
      "setVariant": "streetlights_off",
      "cam": {
        "x": 1203,
        "y": 482,
        "z": 1.52
      },
      "camEnd": {
        "x": 1129,
        "y": 434,
        "z": 1.68
      },
      "pip": {
        "x": 710,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 420,
        "y": 350,
        "scale": 0.86,
        "tilt": -2,
        "header": "NIGHT SKY DISC AREA",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "WIDTH x2 IN NIGHT SKY",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S83": {
    "kind": "scene",
    "cfg": {
      "id": "S83",
      "set": "silver_park",
      "setVariant": "streetlights_off",
      "cam": {
        "x": 616,
        "y": 609,
        "z": 1.49
      },
      "camEnd": {
        "x": 757,
        "y": 611,
        "z": 1.64
      },
      "pip": {
        "x": 760,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S84": {
    "kind": "scene",
    "cfg": {
      "id": "S84",
      "set": "silver_park",
      "setVariant": "birds_and_cat",
      "cam": {
        "x": 849,
        "y": 606,
        "z": 1.98
      },
      "camEnd": {
        "x": 836,
        "y": 547,
        "z": 2.14
      },
      "pip": {
        "x": 810,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S85": {
    "kind": "scene",
    "cfg": {
      "id": "S85",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 1122,
        "y": 513,
        "z": 1.24
      },
      "camEnd": {
        "x": 999,
        "y": 509,
        "z": 1.34
      },
      "pip": {
        "x": 600,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 420,
        "y": 350,
        "scale": 0.86,
        "tilt": -2,
        "header": "NIGHT SKY DISC AREA",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "WIDTH x2 IN NIGHT SKY",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S86": {
    "kind": "scene",
    "cfg": {
      "id": "S86",
      "set": "silver_park",
      "setVariant": "birds_and_cat",
      "cam": {
        "x": 715,
        "y": 520,
        "z": 1.73
      },
      "camEnd": {
        "x": 833,
        "y": 460,
        "z": 1.84
      },
      "pip": {
        "x": 650,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S87": {
    "kind": "scene",
    "cfg": {
      "id": "S87",
      "set": "silver_park",
      "setVariant": "birds_and_cat",
      "cam": {
        "x": 1248,
        "y": 587,
        "z": 1.48
      },
      "camEnd": {
        "x": 1186,
        "y": 577,
        "z": 1.56
      },
      "pip": {
        "x": 700,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S88": {
    "kind": "scene",
    "cfg": {
      "id": "S88",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 681,
        "y": 674,
        "z": 2.1
      },
      "camEnd": {
        "x": 620,
        "y": 608,
        "z": 2.36
      },
      "pip": {
        "x": 750,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 420,
        "y": 350,
        "scale": 0.86,
        "tilt": -2,
        "header": "NIGHT SKY DISC AREA",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "WIDTH x2 IN NIGHT SKY",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S89": {
    "kind": "scene",
    "cfg": {
      "id": "S89",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 934,
        "y": 531,
        "z": 1.01
      },
      "camEnd": {
        "x": 1018,
        "y": 515,
        "z": 1.04
      },
      "pip": {
        "x": 800,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S90": {
    "kind": "scene",
    "cfg": {
      "id": "S90",
      "set": "silver_park",
      "setVariant": "bench_book",
      "cam": {
        "x": 1207,
        "y": 428,
        "z": 1.62
      },
      "camEnd": {
        "x": 1127,
        "y": 461,
        "z": 1.68
      },
      "pip": {
        "x": 590,
        "pose": "readBook",
        "scale": 0.94,
        "flip": 1,
        "holdBook": true
      },
      "pill": {
        "label": "SILVER TWILIGHT NIGHTS",
        "value": "READ OUTDOORS \u00b7 STREETLIGHTS CLICK OFF",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S91": {
    "kind": "scene",
    "cfg": {
      "id": "S91",
      "set": "harbour_seawall",
      "setVariant": "climbing_stairs",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "THE OCEAN AWAKENS",
        "sub": "192,200 KM \u00b7 TIDAL PULL ABOUT X8",
        "color": "#FFE27A",
        "mode": "hero"
      },
      "gauge": {
        "variant": "split_disc",
        "x": 1480,
        "y": 590,
        "scale": 0.88,
        "tilt": -2,
        "header": "CHAPTER 5 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "192,200 KM \u00b7 TIDAL PULL AB",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S92": {
    "kind": "scene",
    "cfg": {
      "id": "S92",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 853,
        "y": 552,
        "z": 1.93
      },
      "camEnd": {
        "x": 834,
        "y": 574,
        "z": 2.14
      },
      "pip": {
        "x": 805,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 1480,
        "y": 360,
        "scale": 0.88,
        "tilt": 2,
        "header": "TIDAL FORCE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (X8)",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE CUBE OF DISTANCE",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S93": {
    "kind": "scene",
    "cfg": {
      "id": "S93",
      "set": "night_beach",
      "setVariant": "towel_2",
      "cam": {
        "x": 1126,
        "y": 529,
        "z": 1.34
      },
      "camEnd": {
        "x": 997,
        "y": 501,
        "z": 1.34
      },
      "pip": {
        "x": 440,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S94": {
    "kind": "scene",
    "cfg": {
      "id": "S94",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 719,
        "y": 466,
        "z": 1.68
      },
      "camEnd": {
        "x": 831,
        "y": 487,
        "z": 1.84
      },
      "pip": {
        "x": 495,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDAL FORCE \u00b7 ABOUT 192,200 KM",
        "color": "#7FD4FF",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S95": {
    "kind": "diagram",
    "cfg": {
      "id": "S95",
      "mode": "inverse_cube_tides_8x",
      "variant": 4,
      "title": "INVERSE-CUBE TIDES: PULL ABOUT 8X STRONGER",
      "subtitle": "HALF THE DISTANCE (192,200 KM) \u2192 2\u00b3 = 8X TIDAL PULL",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 976,
        "y": 542,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 5 SCIENCE FACT",
        "value": "HALF THE DISTANCE (192,200 KM) \u2192 2\u00b3 = 8X TIDAL PULL",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S96": {
    "kind": "scene",
    "cfg": {
      "id": "S96",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 685,
        "y": 620,
        "z": 2.2
      },
      "camEnd": {
        "x": 618,
        "y": 635,
        "z": 2.36
      },
      "pip": {
        "x": 605,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S97": {
    "kind": "scene",
    "cfg": {
      "id": "S97",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 938,
        "y": 547,
        "z": 0.96
      },
      "camEnd": {
        "x": 1016,
        "y": 507,
        "z": 1.04
      },
      "pip": {
        "x": 660,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDAL FORCE \u00b7 ABOUT 192,200 KM",
        "color": "#7FD4FF",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S98": {
    "kind": "scene",
    "cfg": {
      "id": "S98",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 1211,
        "y": 444,
        "z": 1.57
      },
      "camEnd": {
        "x": 1125,
        "y": 453,
        "z": 1.68
      },
      "pip": {
        "x": 715,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1480,
        "y": 360,
        "scale": 0.88,
        "tilt": 2,
        "header": "TIDAL FORCE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (X8)",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE CUBE OF DISTANCE",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S99": {
    "kind": "scene",
    "cfg": {
      "id": "S99",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 624,
        "y": 641,
        "z": 1.54
      },
      "camEnd": {
        "x": 753,
        "y": 595,
        "z": 1.64
      },
      "pip": {
        "x": 770,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S100": {
    "kind": "scene",
    "cfg": {
      "id": "S100",
      "set": "night_beach",
      "setVariant": "towel_1",
      "cam": {
        "x": 857,
        "y": 568,
        "z": 1.88
      },
      "camEnd": {
        "x": 832,
        "y": 566,
        "z": 2.14
      },
      "pip": {
        "x": 825,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDAL FORCE \u00b7 ABOUT 192,200 KM",
        "color": "#7FD4FF",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S101": {
    "kind": "diagram",
    "cfg": {
      "id": "S101",
      "mode": "inverse_cube_tides_8x",
      "variant": 0,
      "title": "INVERSE-CUBE TIDES: PULL ABOUT 8X STRONGER",
      "subtitle": "HALF THE DISTANCE (192,200 KM) \u2192 2\u00b3 = 8X TIDAL PULL",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 970,
        "y": 540,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 5 SCIENCE FACT",
        "value": "HALF THE DISTANCE (192,200 KM) \u2192 2\u00b3 = 8X TIDAL PULL",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S102": {
    "kind": "scene",
    "cfg": {
      "id": "S102",
      "set": "night_beach",
      "setVariant": "towel_2",
      "cam": {
        "x": 723,
        "y": 482,
        "z": 1.78
      },
      "camEnd": {
        "x": 829,
        "y": 479,
        "z": 1.84
      },
      "pip": {
        "x": 515,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S103": {
    "kind": "scene",
    "cfg": {
      "id": "S103",
      "set": "night_beach",
      "setVariant": "towel_2",
      "cam": {
        "x": 1256,
        "y": 619,
        "z": 1.38
      },
      "camEnd": {
        "x": 1182,
        "y": 561,
        "z": 1.56
      },
      "pip": {
        "x": 570,
        "y": 835,
        "pose": "towelDrag",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": true
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDAL FORCE \u00b7 ABOUT 192,200 KM",
        "color": "#7FD4FF",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S104": {
    "kind": "scene",
    "cfg": {
      "id": "S104",
      "set": "night_beach",
      "setVariant": "lifeguard",
      "cam": {
        "x": 689,
        "y": 636,
        "z": 2.15
      },
      "camEnd": {
        "x": 616,
        "y": 627,
        "z": 2.36
      },
      "pip": {
        "x": 1520,
        "y": 585,
        "pose": "lifeguardPerch",
        "scale": 0.88,
        "flip": -1,
        "holdTowel": false
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 420,
        "y": 360,
        "scale": 0.88,
        "tilt": 2,
        "header": "TIDAL FORCE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (X8)",
        "sizeLabel": "PULL x8",
        "subMetric": "INVERSE CUBE OF DISTANCE",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S105": {
    "kind": "scene",
    "cfg": {
      "id": "S105",
      "set": "harbour_seawall",
      "setVariant": "climbing_stairs",
      "cam": {
        "x": 942,
        "y": 563,
        "z": 1.06
      },
      "camEnd": {
        "x": 1014,
        "y": 499,
        "z": 1.04
      },
      "pip": {
        "x": 680,
        "y": 835,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": false
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S106": {
    "kind": "scene",
    "cfg": {
      "id": "S106",
      "set": "harbour_seawall",
      "setVariant": "climbing_stairs",
      "cam": {
        "x": 1215,
        "y": 460,
        "z": 1.52
      },
      "camEnd": {
        "x": 1123,
        "y": 445,
        "z": 1.68
      },
      "pip": {
        "x": 735,
        "y": 835,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": false
      },
      "banner": {
        "text": "PULL x8",
        "sub": "INVERSE-CUBE TIDAL FORCE \u00b7 ABOUT 192,200 KM",
        "color": "#7FD4FF",
        "x": 960,
        "y": 108
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S107": {
    "kind": "diagram",
    "cfg": {
      "id": "S107",
      "mode": "inverse_cube_tides_8x",
      "variant": 1,
      "title": "INVERSE-CUBE TIDES: PULL ABOUT 8X STRONGER",
      "subtitle": "HALF THE DISTANCE (192,200 KM) \u2192 2\u00b3 = 8X TIDAL PULL",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 964,
        "y": 538,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 5 SCIENCE FACT",
        "value": "HALF THE DISTANCE (192,200 KM) \u2192 2\u00b3 = 8X TIDAL PULL",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S108": {
    "kind": "scene",
    "cfg": {
      "id": "S108",
      "set": "harbour_seawall",
      "setVariant": "climbing_stairs",
      "cam": {
        "x": 861,
        "y": 584,
        "z": 1.98
      },
      "camEnd": {
        "x": 830,
        "y": 558,
        "z": 2.14
      },
      "pip": {
        "x": 425,
        "y": 835,
        "pose": "beachAwe",
        "scale": 0.94,
        "flip": 1,
        "holdTowel": false
      },
      "pill": {
        "label": "TIDAL PULL (1/D\u00b3)",
        "value": "ABOUT 8X STRONGER AT 192,200 KM",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S109": {
    "kind": "scene",
    "cfg": {
      "id": "S109",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "HOURS LATER: THE COAST",
        "sub": "ABOUT 192,200 KM \u00b7 COASTAL FLOODING",
        "color": "#FFE27A",
        "mode": "hero"
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1480,
        "y": 590,
        "scale": 0.88,
        "tilt": -2,
        "header": "CHAPTER 6 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "ABOUT 192,200 KM \u00b7 COASTAL",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S110": {
    "kind": "scene",
    "cfg": {
      "id": "S110",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 727,
        "y": 498,
        "z": 1.73
      },
      "camEnd": {
        "x": 827,
        "y": 471,
        "z": 1.84
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S111": {
    "kind": "scene",
    "cfg": {
      "id": "S111",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 1260,
        "y": 565,
        "z": 1.48
      },
      "camEnd": {
        "x": 1180,
        "y": 588,
        "z": 1.56
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 420,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "COASTAL TIDE SWING",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "HIGH FLOOD \u2194 MUD FLATS",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S112": {
    "kind": "scene",
    "cfg": {
      "id": "S112",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 553,
        "y": 652,
        "z": 2.1
      },
      "camEnd": {
        "x": 684,
        "y": 619,
        "z": 2.36
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S113": {
    "kind": "diagram",
    "cfg": {
      "id": "S113",
      "mode": "high_vs_low_tide",
      "variant": 2,
      "title": "EXTREME HIGH TIDE VS MUD-FLAT LOW TIDE",
      "subtitle": "ABOUT 8X TIDAL PULL RESHAPES EVERY COASTLINE",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 958,
        "y": 536,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 6 SCIENCE FACT",
        "value": "ABOUT 8X TIDAL PULL RESHAPES EVERY COASTLINE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S114": {
    "kind": "scene",
    "cfg": {
      "id": "S114",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 1219,
        "y": 476,
        "z": 1.62
      },
      "camEnd": {
        "x": 1121,
        "y": 437,
        "z": 1.68
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S115": {
    "kind": "scene",
    "cfg": {
      "id": "S115",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 632,
        "y": 603,
        "z": 1.44
      },
      "camEnd": {
        "x": 749,
        "y": 614,
        "z": 1.64
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 420,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "COASTAL TIDE SWING",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "HIGH FLOOD \u2194 MUD FLATS",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S116": {
    "kind": "scene",
    "cfg": {
      "id": "S116",
      "set": "flooded_street",
      "setVariant": "crab_cafe",
      "cam": {
        "x": 865,
        "y": 600,
        "z": 1.93
      },
      "camEnd": {
        "x": 828,
        "y": 550,
        "z": 2.14
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S117": {
    "kind": "scene",
    "cfg": {
      "id": "S117",
      "set": "flooded_street",
      "setVariant": "crab_cafe",
      "cam": {
        "x": 1138,
        "y": 507,
        "z": 1.34
      },
      "camEnd": {
        "x": 991,
        "y": 512,
        "z": 1.34
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 420,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "COASTAL TIDE SWING",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "HIGH FLOOD \u2194 MUD FLATS",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S118": {
    "kind": "scene",
    "cfg": {
      "id": "S118",
      "set": "harbour_seawall",
      "setVariant": "low_mud_flats",
      "cam": {
        "x": 731,
        "y": 514,
        "z": 1.68
      },
      "camEnd": {
        "x": 825,
        "y": 463,
        "z": 1.84
      },
      "pip": {
        "x": 520,
        "y": 510,
        "pose": "beachAwe",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "EXTREME LOW TIDE FLATS",
        "value": "BOATS HIGH AND DRY ON MUD",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S119": {
    "kind": "diagram",
    "cfg": {
      "id": "S119",
      "mode": "high_vs_low_tide",
      "variant": 3,
      "title": "EXTREME HIGH TIDE VS MUD-FLAT LOW TIDE",
      "subtitle": "ABOUT 8X TIDAL PULL RESHAPES EVERY COASTLINE",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 952,
        "y": 534,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 6 SCIENCE FACT",
        "value": "ABOUT 8X TIDAL PULL RESHAPES EVERY COASTLINE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S120": {
    "kind": "scene",
    "cfg": {
      "id": "S120",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 557,
        "y": 668,
        "z": 2.2
      },
      "camEnd": {
        "x": 682,
        "y": 611,
        "z": 2.36
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S121": {
    "kind": "scene",
    "cfg": {
      "id": "S121",
      "set": "harbour_seawall",
      "setVariant": "low_mud_flats",
      "cam": {
        "x": 950,
        "y": 525,
        "z": 0.96
      },
      "camEnd": {
        "x": 1010,
        "y": 518,
        "z": 1.04
      },
      "pip": {
        "x": 520,
        "y": 510,
        "pose": "beachAwe",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "EXTREME LOW TIDE FLATS",
        "value": "BOATS HIGH AND DRY ON MUD",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "digital_bar",
        "x": 1480,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "COASTAL TIDE SWING",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "HIGH FLOOD \u2194 MUD FLATS",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S122": {
    "kind": "scene",
    "cfg": {
      "id": "S122",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 1223,
        "y": 492,
        "z": 1.57
      },
      "camEnd": {
        "x": 1119,
        "y": 429,
        "z": 1.68
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S123": {
    "kind": "scene",
    "cfg": {
      "id": "S123",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 636,
        "y": 619,
        "z": 1.54
      },
      "camEnd": {
        "x": 747,
        "y": 606,
        "z": 1.64
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 420,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "COASTAL TIDE SWING",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "PULL x8",
        "subMetric": "HIGH FLOOD \u2194 MUD FLATS",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S124": {
    "kind": "scene",
    "cfg": {
      "id": "S124",
      "set": "flooded_street",
      "setVariant": "dinghy_street",
      "cam": {
        "x": 869,
        "y": 546,
        "z": 1.88
      },
      "camEnd": {
        "x": 826,
        "y": 577,
        "z": 2.14
      },
      "pip": {
        "x": 1020,
        "y": 750,
        "pose": "rowDinghy",
        "scale": 0.9,
        "flip": 1
      },
      "pill": {
        "label": "HOURS LATER: HIGH TIDE COAST",
        "value": "DINGHY DOWN COASTAL PROMENADE",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S125": {
    "kind": "scene",
    "cfg": {
      "id": "S125",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "TRYING TO SLEEP",
        "sub": "ABOUT 192,200 KM \u00b7 CURTAIN FLOODLIGHT",
        "color": "#A68CFF",
        "mode": "hero"
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1480,
        "y": 590,
        "scale": 0.88,
        "tilt": -2,
        "header": "CHAPTER 7 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "ABOUT 192,200 KM \u00b7 CURTAIN",
        "themeColor": "#A68CFF"
      }
    }
  },
  "S126": {
    "kind": "scene",
    "cfg": {
      "id": "S126",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 735,
        "y": 460,
        "z": 1.78
      },
      "camEnd": {
        "x": 823,
        "y": 490,
        "z": 1.84
      },
      "pip": {
        "x": 640,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S127": {
    "kind": "scene",
    "cfg": {
      "id": "S127",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 1268,
        "y": 597,
        "z": 1.38
      },
      "camEnd": {
        "x": 1176,
        "y": 572,
        "z": 1.56
      },
      "pip": {
        "x": 680,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "CURTAIN FLOODLIGHT",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "SILVER BEAM AT MIDNIGHT",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S128": {
    "kind": "scene",
    "cfg": {
      "id": "S128",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 561,
        "y": 614,
        "z": 2.15
      },
      "camEnd": {
        "x": 680,
        "y": 638,
        "z": 2.36
      },
      "pip": {
        "x": 500,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S129": {
    "kind": "scene",
    "cfg": {
      "id": "S129",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 954,
        "y": 541,
        "z": 1.06
      },
      "camEnd": {
        "x": 1008,
        "y": 510,
        "z": 1.04
      },
      "pip": {
        "x": 540,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S130": {
    "kind": "scene",
    "cfg": {
      "id": "S130",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 1227,
        "y": 438,
        "z": 1.52
      },
      "camEnd": {
        "x": 1117,
        "y": 456,
        "z": 1.68
      },
      "pip": {
        "x": 580,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "CURTAIN FLOODLIGHT",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "SILVER BEAM AT MIDNIGHT",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S131": {
    "kind": "scene",
    "cfg": {
      "id": "S131",
      "set": "curtain_bedroom",
      "setVariant": "clothespin_glow",
      "cam": {
        "x": 640,
        "y": 635,
        "z": 1.49
      },
      "camEnd": {
        "x": 745,
        "y": 598,
        "z": 1.64
      },
      "pip": {
        "x": 620,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S132": {
    "kind": "scene",
    "cfg": {
      "id": "S132",
      "set": "curtain_bedroom",
      "setVariant": "clothespin_glow",
      "cam": {
        "x": 873,
        "y": 562,
        "z": 1.98
      },
      "camEnd": {
        "x": 824,
        "y": 569,
        "z": 2.14
      },
      "pip": {
        "x": 660,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S133": {
    "kind": "scene",
    "cfg": {
      "id": "S133",
      "set": "curtain_bedroom",
      "setVariant": "window_peek",
      "cam": {
        "x": 1146,
        "y": 539,
        "z": 1.24
      },
      "camEnd": {
        "x": 987,
        "y": 496,
        "z": 1.34
      },
      "pip": {
        "x": 940,
        "pose": "windowGaze",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": false,
        "sunglasses": true
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "CURTAIN FLOODLIGHT",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "SILVER BEAM AT MIDNIGHT",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S134": {
    "kind": "scene",
    "cfg": {
      "id": "S134",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 739,
        "y": 476,
        "z": 1.73
      },
      "camEnd": {
        "x": 821,
        "y": 482,
        "z": 1.84
      },
      "pip": {
        "x": 520,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S135": {
    "kind": "scene",
    "cfg": {
      "id": "S135",
      "set": "curtain_bedroom",
      "setVariant": "cat_windowsill",
      "cam": {
        "x": 1272,
        "y": 613,
        "z": 1.48
      },
      "camEnd": {
        "x": 1174,
        "y": 564,
        "z": 1.56
      },
      "pip": {
        "x": 560,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": true
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S136": {
    "kind": "scene",
    "cfg": {
      "id": "S136",
      "set": "curtain_bedroom",
      "setVariant": "curtain_beam",
      "cam": {
        "x": 565,
        "y": 630,
        "z": 2.1
      },
      "camEnd": {
        "x": 678,
        "y": 630,
        "z": 2.36
      },
      "pip": {
        "x": 600,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "CURTAIN FLOODLIGHT",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "SILVER BEAM AT MIDNIGHT",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S137": {
    "kind": "scene",
    "cfg": {
      "id": "S137",
      "set": "curtain_bedroom",
      "setVariant": "cat_windowsill",
      "cam": {
        "x": 958,
        "y": 557,
        "z": 1.01
      },
      "camEnd": {
        "x": 1006,
        "y": 502,
        "z": 1.04
      },
      "pip": {
        "x": 640,
        "pose": "sleepMask",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": true,
        "sunglasses": true
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S138": {
    "kind": "scene",
    "cfg": {
      "id": "S138",
      "set": "curtain_bedroom",
      "setVariant": "window_peek",
      "cam": {
        "x": 1231,
        "y": 454,
        "z": 1.62
      },
      "camEnd": {
        "x": 1115,
        "y": 448,
        "z": 1.68
      },
      "pip": {
        "x": 940,
        "pose": "windowGaze",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": false,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S139": {
    "kind": "scene",
    "cfg": {
      "id": "S139",
      "set": "curtain_bedroom",
      "setVariant": "window_peek",
      "cam": {
        "x": 644,
        "y": 651,
        "z": 1.44
      },
      "camEnd": {
        "x": 743,
        "y": 590,
        "z": 1.64
      },
      "pip": {
        "x": 940,
        "pose": "windowGaze",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": false,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": 2,
        "header": "CURTAIN FLOODLIGHT",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "AREA x4",
        "subMetric": "SILVER BEAM AT MIDNIGHT",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S140": {
    "kind": "scene",
    "cfg": {
      "id": "S140",
      "set": "curtain_bedroom",
      "setVariant": "window_peek",
      "cam": {
        "x": 877,
        "y": 578,
        "z": 1.93
      },
      "camEnd": {
        "x": 822,
        "y": 561,
        "z": 2.14
      },
      "pip": {
        "x": 940,
        "pose": "windowGaze",
        "scale": 0.95,
        "flip": 1,
        "sleepMask": false,
        "sunglasses": false
      },
      "pill": {
        "label": "BEDROOM UNDER 4X-AREA MOON",
        "value": "SLEEP MASK + SUNGLASSES NEEDED",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S141": {
    "kind": "scene",
    "cfg": {
      "id": "S141",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "ORBIT AND ECLIPSES",
        "sub": "27-DAY ORBIT \u00b7 GIANT SOLAR ECLIPSE",
        "color": "#5BE08A",
        "mode": "hero"
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1480,
        "y": 590,
        "scale": 0.88,
        "tilt": -2,
        "header": "CHAPTER 8 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "ABOUT 192,200 KM",
        "sizeLabel": "WIDTH x2",
        "subMetric": "27-DAY ORBIT \u00b7 GIANT SOLAR",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S142": {
    "kind": "scene",
    "cfg": {
      "id": "S142",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 743,
        "y": 492,
        "z": 1.68
      },
      "camEnd": {
        "x": 819,
        "y": 474,
        "z": 1.84
      },
      "pip": {
        "x": 775,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S143": {
    "kind": "diagram",
    "cfg": {
      "id": "S143",
      "mode": "orbit_27d_eclipse",
      "variant": 2,
      "title": "27-DAY ORBIT & GIANT SOLAR ECLIPSE",
      "subtitle": "TWICE-AS-WIDE MOON COVERS FAR MORE THAN THE SUN",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 988,
        "y": 526,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 8 SCIENCE FACT",
        "value": "TWICE-AS-WIDE MOON COVERS FAR MORE THAN THE SUN",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S144": {
    "kind": "scene",
    "cfg": {
      "id": "S144",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 569,
        "y": 646,
        "z": 2.2
      },
      "camEnd": {
        "x": 676,
        "y": 622,
        "z": 2.36
      },
      "pip": {
        "x": 885,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S145": {
    "kind": "scene",
    "cfg": {
      "id": "S145",
      "set": "eclipse_sky",
      "setVariant": "racing_rim",
      "cam": {
        "x": 962,
        "y": 503,
        "z": 0.96
      },
      "camEnd": {
        "x": 1004,
        "y": 529,
        "z": 1.04
      },
      "pip": {
        "x": 940,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": false
      },
      "pill": {
        "label": "27-DAY ORBIT ILLUSION",
        "value": "2X WIDER RIM APPEARS TO RACE",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S146": {
    "kind": "scene",
    "cfg": {
      "id": "S146",
      "set": "eclipse_sky",
      "setVariant": "racing_rim",
      "cam": {
        "x": 1235,
        "y": 470,
        "z": 1.57
      },
      "camEnd": {
        "x": 1113,
        "y": 440,
        "z": 1.68
      },
      "pip": {
        "x": 995,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": false
      },
      "pill": {
        "label": "27-DAY ORBIT ILLUSION",
        "value": "2X WIDER RIM APPEARS TO RACE",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S147": {
    "kind": "scene",
    "cfg": {
      "id": "S147",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 648,
        "y": 597,
        "z": 1.54
      },
      "camEnd": {
        "x": 741,
        "y": 617,
        "z": 1.64
      },
      "pip": {
        "x": 630,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S148": {
    "kind": "scene",
    "cfg": {
      "id": "S148",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 881,
        "y": 594,
        "z": 1.88
      },
      "camEnd": {
        "x": 820,
        "y": 553,
        "z": 2.14
      },
      "pip": {
        "x": 685,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S149": {
    "kind": "diagram",
    "cfg": {
      "id": "S149",
      "mode": "orbit_27d_eclipse",
      "variant": 3,
      "title": "27-DAY ORBIT & GIANT SOLAR ECLIPSE",
      "subtitle": "TWICE-AS-WIDE MOON COVERS FAR MORE THAN THE SUN",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 982,
        "y": 524,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 8 SCIENCE FACT",
        "value": "TWICE-AS-WIDE MOON COVERS FAR MORE THAN THE SUN",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S150": {
    "kind": "scene",
    "cfg": {
      "id": "S150",
      "set": "eclipse_sky",
      "setVariant": "eclipse_barely",
      "cam": {
        "x": 747,
        "y": 508,
        "z": 1.78
      },
      "camEnd": {
        "x": 817,
        "y": 466,
        "z": 1.84
      },
      "pip": {
        "x": 795,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S151": {
    "kind": "scene",
    "cfg": {
      "id": "S151",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 1280,
        "y": 575,
        "z": 1.38
      },
      "camEnd": {
        "x": 1170,
        "y": 583,
        "z": 1.56
      },
      "pip": {
        "x": 850,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S152": {
    "kind": "scene",
    "cfg": {
      "id": "S152",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 573,
        "y": 662,
        "z": 2.15
      },
      "camEnd": {
        "x": 674,
        "y": 614,
        "z": 2.36
      },
      "pip": {
        "x": 905,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S153": {
    "kind": "scene",
    "cfg": {
      "id": "S153",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 966,
        "y": 519,
        "z": 1.06
      },
      "camEnd": {
        "x": 1002,
        "y": 521,
        "z": 1.04
      },
      "pip": {
        "x": 960,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S154": {
    "kind": "scene",
    "cfg": {
      "id": "S154",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 1239,
        "y": 486,
        "z": 1.52
      },
      "camEnd": {
        "x": 1111,
        "y": 432,
        "z": 1.68
      },
      "pip": {
        "x": 595,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S155": {
    "kind": "diagram",
    "cfg": {
      "id": "S155",
      "mode": "orbit_27d_eclipse",
      "variant": 4,
      "title": "27-DAY ORBIT & GIANT SOLAR ECLIPSE",
      "subtitle": "TWICE-AS-WIDE MOON COVERS FAR MORE THAN THE SUN",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 976,
        "y": 522,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 8 SCIENCE FACT",
        "value": "TWICE-AS-WIDE MOON COVERS FAR MORE THAN THE SUN",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S156": {
    "kind": "scene",
    "cfg": {
      "id": "S156",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 885,
        "y": 610,
        "z": 1.98
      },
      "camEnd": {
        "x": 818,
        "y": 545,
        "z": 2.14
      },
      "pip": {
        "x": 705,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "tidal_dial",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#FF6A4D"
      }
    }
  },
  "S157": {
    "kind": "scene",
    "cfg": {
      "id": "S157",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 1018,
        "y": 517,
        "z": 1.24
      },
      "camEnd": {
        "x": 1051,
        "y": 507,
        "z": 1.34
      },
      "pip": {
        "x": 760,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S158": {
    "kind": "scene",
    "cfg": {
      "id": "S158",
      "set": "eclipse_sky",
      "setVariant": "eclipse_giant",
      "cam": {
        "x": 751,
        "y": 524,
        "z": 1.73
      },
      "camEnd": {
        "x": 815,
        "y": 458,
        "z": 1.84
      },
      "pip": {
        "x": 815,
        "pose": "eclipseWatch",
        "scale": 0.94,
        "flip": 1,
        "eclipseGlasses": true
      },
      "pill": {
        "label": "TOTAL SOLAR ECLIPSE",
        "value": "2X WIDER MOON COVERS FAR MORE THAN SUN",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 1490,
        "y": 360,
        "scale": 0.86,
        "tilt": -2,
        "header": "ECLIPSE COVERAGE GAUGE",
        "distFrom": "384,400 KM (1X)",
        "distTo": "192,200 KM (2X)",
        "sizeLabel": "WIDTH x2",
        "subMetric": "COVERS FAR MORE THAN SUN",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S159": {
    "kind": "scene",
    "cfg": {
      "id": "S159",
      "set": "night_beach",
      "setVariant": "ruler_goodbye",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "THE REAL VERDICT",
        "sub": "384,400 KM \u00b7 +1 INCH FARTHER PER YEAR",
        "color": "#5BE08A",
        "mode": "hero"
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 1480,
        "y": 590,
        "scale": 0.88,
        "tilt": -2,
        "header": "CHAPTER 9 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "384,400 KM",
        "sizeLabel": "+1 INCH / YR",
        "subMetric": "384,400 KM \u00b7 +1 INCH FARTH",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S160": {
    "kind": "scene",
    "cfg": {
      "id": "S160",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 577,
        "y": 608,
        "z": 2.1
      },
      "camEnd": {
        "x": 672,
        "y": 641,
        "z": 2.36
      },
      "pip": {
        "x": 910,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S161": {
    "kind": "diagram",
    "cfg": {
      "id": "S161",
      "mode": "laser_1inch_retreat",
      "variant": 0,
      "title": "REALITY: DRIFTING ~1 INCH FARTHER PER YEAR",
      "subtitle": "384,400 KM AVERAGE \u00b7 MEASURED BY LUNAR LASER RANGING",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 970,
        "y": 520,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 9 SCIENCE FACT",
        "value": "384,400 KM AVERAGE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S162": {
    "kind": "scene",
    "cfg": {
      "id": "S162",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 1243,
        "y": 432,
        "z": 1.62
      },
      "camEnd": {
        "x": 1109,
        "y": 459,
        "z": 1.68
      },
      "pip": {
        "x": 690,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S163": {
    "kind": "scene",
    "cfg": {
      "id": "S163",
      "set": "night_beach",
      "setVariant": "ruler_goodbye",
      "cam": {
        "x": 656,
        "y": 629,
        "z": 1.44
      },
      "camEnd": {
        "x": 737,
        "y": 601,
        "z": 1.64
      },
      "pip": {
        "x": 740,
        "pose": "rulerWave",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": true
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 430,
        "y": 355,
        "scale": 0.88,
        "tilt": 2,
        "header": "REAL LUNAR DRIFT",
        "distFrom": "384,400 KM",
        "distTo": "+1 INCH / YEAR",
        "sizeLabel": "RADIUS 1,740 KM",
        "subMetric": "MOVING SLOWLY FARTHER AWAY",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S164": {
    "kind": "scene",
    "cfg": {
      "id": "S164",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 889,
        "y": 556,
        "z": 1.93
      },
      "camEnd": {
        "x": 816,
        "y": 572,
        "z": 2.14
      },
      "pip": {
        "x": 790,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S165": {
    "kind": "scene",
    "cfg": {
      "id": "S165",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 1022,
        "y": 533,
        "z": 1.34
      },
      "camEnd": {
        "x": 1049,
        "y": 499,
        "z": 1.34
      },
      "pip": {
        "x": 840,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": 2,
        "header": "REAL LUNAR DRIFT",
        "distFrom": "384,400 KM",
        "distTo": "+1 INCH / YEAR",
        "sizeLabel": "RADIUS 1,740 KM",
        "subMetric": "MOVING SLOWLY FARTHER AWAY",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S166": {
    "kind": "scene",
    "cfg": {
      "id": "S166",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 755,
        "y": 470,
        "z": 1.68
      },
      "camEnd": {
        "x": 813,
        "y": 485,
        "z": 1.84
      },
      "pip": {
        "x": 890,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S167": {
    "kind": "diagram",
    "cfg": {
      "id": "S167",
      "mode": "laser_1inch_retreat",
      "variant": 1,
      "title": "REALITY: DRIFTING ~1 INCH FARTHER PER YEAR",
      "subtitle": "384,400 KM AVERAGE \u00b7 MEASURED BY LUNAR LASER RANGING",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 964,
        "y": 558,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 9 SCIENCE FACT",
        "value": "384,400 KM AVERAGE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S168": {
    "kind": "scene",
    "cfg": {
      "id": "S168",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 581,
        "y": 624,
        "z": 2.2
      },
      "camEnd": {
        "x": 670,
        "y": 633,
        "z": 2.36
      },
      "pip": {
        "x": 670,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S169": {
    "kind": "scene",
    "cfg": {
      "id": "S169",
      "set": "night_beach",
      "setVariant": "ruler_goodbye",
      "cam": {
        "x": 974,
        "y": 551,
        "z": 0.96
      },
      "camEnd": {
        "x": 998,
        "y": 505,
        "z": 1.04
      },
      "pip": {
        "x": 720,
        "pose": "rulerWave",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": true
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "laser_ruler",
        "x": 430,
        "y": 355,
        "scale": 0.88,
        "tilt": 2,
        "header": "REAL LUNAR DRIFT",
        "distFrom": "384,400 KM",
        "distTo": "+1 INCH / YEAR",
        "sizeLabel": "RADIUS 1,740 KM",
        "subMetric": "MOVING SLOWLY FARTHER AWAY",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S170": {
    "kind": "scene",
    "cfg": {
      "id": "S170",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 1247,
        "y": 448,
        "z": 1.57
      },
      "camEnd": {
        "x": 1107,
        "y": 451,
        "z": 1.68
      },
      "pip": {
        "x": 770,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S171": {
    "kind": "scene",
    "cfg": {
      "id": "S171",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 660,
        "y": 645,
        "z": 1.54
      },
      "camEnd": {
        "x": 735,
        "y": 593,
        "z": 1.64
      },
      "pip": {
        "x": 820,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "split_disc",
        "x": 1490,
        "y": 355,
        "scale": 0.88,
        "tilt": 2,
        "header": "REAL LUNAR DRIFT",
        "distFrom": "384,400 KM",
        "distTo": "+1 INCH / YEAR",
        "sizeLabel": "RADIUS 1,740 KM",
        "subMetric": "MOVING SLOWLY FARTHER AWAY",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S172": {
    "kind": "scene",
    "cfg": {
      "id": "S172",
      "set": "night_beach",
      "setVariant": "ruler_goodbye",
      "cam": {
        "x": 893,
        "y": 572,
        "z": 1.88
      },
      "camEnd": {
        "x": 814,
        "y": 564,
        "z": 2.14
      },
      "pip": {
        "x": 870,
        "pose": "rulerWave",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": true
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S173": {
    "kind": "diagram",
    "cfg": {
      "id": "S173",
      "mode": "laser_1inch_retreat",
      "variant": 2,
      "title": "REALITY: DRIFTING ~1 INCH FARTHER PER YEAR",
      "subtitle": "384,400 KM AVERAGE \u00b7 MEASURED BY LUNAR LASER RANGING",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 958,
        "y": 556,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 9 SCIENCE FACT",
        "value": "384,400 KM AVERAGE",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S174": {
    "kind": "scene",
    "cfg": {
      "id": "S174",
      "set": "oval_orbit",
      "setVariant": "laser_retreat",
      "cam": {
        "x": 759,
        "y": 486,
        "z": 1.78
      },
      "camEnd": {
        "x": 811,
        "y": 477,
        "z": 1.84
      },
      "pip": {
        "x": 650,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": false
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S175": {
    "kind": "scene",
    "cfg": {
      "id": "S175",
      "set": "night_beach",
      "setVariant": "ruler_goodbye",
      "cam": {
        "x": 1292,
        "y": 623,
        "z": 1.38
      },
      "camEnd": {
        "x": 1164,
        "y": 559,
        "z": 1.56
      },
      "pip": {
        "x": 700,
        "pose": "rulerWave",
        "scale": 0.94,
        "flip": 1,
        "holdRuler": true
      },
      "pill": {
        "label": "NASA LASER RANGING FACT",
        "value": "384,400 KM \u00b7 DRIFTS ~1 INCH/YEAR",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "sky_caliper",
        "x": 430,
        "y": 355,
        "scale": 0.88,
        "tilt": 2,
        "header": "REAL LUNAR DRIFT",
        "distFrom": "384,400 KM",
        "distTo": "+1 INCH / YEAR",
        "sizeLabel": "RADIUS 1,740 KM",
        "subMetric": "MOVING SLOWLY FARTHER AWAY",
        "themeColor": "#5BE08A"
      }
    }
  },
  "S176": {
    "kind": "scene",
    "cfg": {
      "id": "S176",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 960,
        "y": 535,
        "z": 0.96
      },
      "camEnd": {
        "x": 985,
        "y": 515,
        "z": 1.05
      },
      "chapterCard": {
        "place": "NOVEMBER 2026 SKYWATCHING",
        "sub": "15\u201316 NOV \u00b7 17\u201318 NOV \u00b7 24 NOV SUPERMOON",
        "color": "#7FD4FF",
        "mode": "hero"
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 440,
        "y": 590,
        "scale": 0.88,
        "tilt": 2,
        "header": "CHAPTER 10 \u00b7 LUNAR METRIC",
        "distFrom": "384,400 KM",
        "distTo": "24 NOV 2026",
        "sizeLabel": "SUPERMOON #1",
        "subMetric": "15\u201316 NOV \u00b7 17\u201318 NOV \u00b7 24",
        "themeColor": "#7FD4FF"
      }
    }
  },
  "S177": {
    "kind": "scene",
    "cfg": {
      "id": "S177",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 978,
        "y": 497,
        "z": 1.06
      },
      "camEnd": {
        "x": 996,
        "y": 532,
        "z": 1.04
      },
      "pip": {
        "x": 620,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S178": {
    "kind": "scene",
    "cfg": {
      "id": "S178",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 1111,
        "y": 464,
        "z": 1.52
      },
      "camEnd": {
        "x": 1175,
        "y": 443,
        "z": 1.68
      },
      "pip": {
        "x": 680,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 1075,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "orbital_arc",
        "x": 430,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "NASA WHAT\u2019S UP \u00b7 NOV 2026",
        "distFrom": "15\u201316 NOV \u00b7 1.2\u00b0",
        "distTo": "24 NOV SUPERMOON",
        "sizeLabel": "14:54 UTC",
        "subMetric": "NEXT: 24 DEC 2026 & JAN",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S179": {
    "kind": "diagram",
    "cfg": {
      "id": "S179",
      "mode": "nov2026_three_supermoons",
      "variant": 3,
      "title": "NOVEMBER 2026 NASA SKYWATCHING GUIDE",
      "subtitle": "15\u201316 NOV MARS/JUPITER 1.2\u00b0 \u00b7 17\u201318 NOV LEONIDS \u00b7 24 NOV SUPERMOON",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 952,
        "y": 554,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 10 SCIENCE FACT",
        "value": "15\u201316 NOV MARS/JUPITER 1.2\u00b0",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S180": {
    "kind": "scene",
    "cfg": {
      "id": "S180",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 897,
        "y": 588,
        "z": 1.98
      },
      "camEnd": {
        "x": 812,
        "y": 556,
        "z": 2.14
      },
      "pip": {
        "x": 800,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 985,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S181": {
    "kind": "scene",
    "cfg": {
      "id": "S181",
      "set": "rooftop_nov2026",
      "setVariant": "mars_jupiter_15_16nov",
      "cam": {
        "x": 1030,
        "y": 495,
        "z": 1.24
      },
      "camEnd": {
        "x": 1045,
        "y": 518,
        "z": 1.34
      },
      "pip": {
        "x": 860,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "15\u201316 NOV BEFORE SUNRISE",
        "value": "MARS & JUPITER 1.2\u00b0 APART",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 430,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "NASA WHAT\u2019S UP \u00b7 NOV 2026",
        "distFrom": "15\u201316 NOV \u00b7 1.2\u00b0",
        "distTo": "24 NOV SUPERMOON",
        "sizeLabel": "14:54 UTC",
        "subMetric": "NEXT: 24 DEC 2026 & JAN",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S182": {
    "kind": "scene",
    "cfg": {
      "id": "S182",
      "set": "rooftop_nov2026",
      "setVariant": "mars_jupiter_15_16nov",
      "cam": {
        "x": 763,
        "y": 502,
        "z": 1.73
      },
      "camEnd": {
        "x": 809,
        "y": 469,
        "z": 1.84
      },
      "pip": {
        "x": 920,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 895,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "15\u201316 NOV BEFORE SUNRISE",
        "value": "MARS & JUPITER 1.2\u00b0 APART",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S183": {
    "kind": "scene",
    "cfg": {
      "id": "S183",
      "set": "rooftop_nov2026",
      "setVariant": "mars_jupiter_15_16nov",
      "cam": {
        "x": 1296,
        "y": 569,
        "z": 1.48
      },
      "camEnd": {
        "x": 1162,
        "y": 586,
        "z": 1.56
      },
      "pip": {
        "x": 560,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "15\u201316 NOV BEFORE SUNRISE",
        "value": "MARS & JUPITER 1.2\u00b0 APART",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S184": {
    "kind": "scene",
    "cfg": {
      "id": "S184",
      "set": "rooftop_nov2026",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 589,
        "y": 656,
        "z": 2.1
      },
      "camEnd": {
        "x": 666,
        "y": 617,
        "z": 2.36
      },
      "pip": {
        "x": 620,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 1045,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "17\u201318 NOV AFTER MOONSET",
        "value": "LEONIDS: UP TO ~15 PER HOUR",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 430,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "NASA WHAT\u2019S UP \u00b7 NOV 2026",
        "distFrom": "15\u201316 NOV \u00b7 1.2\u00b0",
        "distTo": "24 NOV SUPERMOON",
        "sizeLabel": "14:54 UTC",
        "subMetric": "NEXT: 24 DEC 2026 & JAN",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S185": {
    "kind": "diagram",
    "cfg": {
      "id": "S185",
      "mode": "nov2026_leonids_15hr",
      "variant": 4,
      "title": "NOVEMBER 2026 NASA SKYWATCHING GUIDE",
      "subtitle": "15\u201316 NOV MARS/JUPITER 1.2\u00b0 \u00b7 17\u201318 NOV LEONIDS \u00b7 24 NOV SUPERMOON",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 946,
        "y": 552,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 10 SCIENCE FACT",
        "value": "15\u201316 NOV MARS/JUPITER 1.2\u00b0",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S186": {
    "kind": "scene",
    "cfg": {
      "id": "S186",
      "set": "rooftop_nov2026",
      "setVariant": "leonids_17_18nov",
      "cam": {
        "x": 1115,
        "y": 480,
        "z": 1.62
      },
      "camEnd": {
        "x": 1173,
        "y": 435,
        "z": 1.68
      },
      "pip": {
        "x": 740,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 955,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "17\u201318 NOV AFTER MOONSET",
        "value": "LEONIDS: UP TO ~15 PER HOUR",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S187": {
    "kind": "scene",
    "cfg": {
      "id": "S187",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 668,
        "y": 607,
        "z": 1.44
      },
      "camEnd": {
        "x": 731,
        "y": 612,
        "z": 1.64
      },
      "pip": {
        "x": 800,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 430,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "NASA WHAT\u2019S UP \u00b7 NOV 2026",
        "distFrom": "15\u201316 NOV \u00b7 1.2\u00b0",
        "distTo": "24 NOV SUPERMOON",
        "sizeLabel": "14:54 UTC",
        "subMetric": "NEXT: 24 DEC 2026 & JAN",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S188": {
    "kind": "scene",
    "cfg": {
      "id": "S188",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 901,
        "y": 604,
        "z": 1.93
      },
      "camEnd": {
        "x": 810,
        "y": 548,
        "z": 2.14
      },
      "pip": {
        "x": 860,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 1105,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S189": {
    "kind": "scene",
    "cfg": {
      "id": "S189",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 1034,
        "y": 511,
        "z": 1.34
      },
      "camEnd": {
        "x": 1043,
        "y": 510,
        "z": 1.34
      },
      "pip": {
        "x": 920,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S190": {
    "kind": "scene",
    "cfg": {
      "id": "S190",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 767,
        "y": 518,
        "z": 1.68
      },
      "camEnd": {
        "x": 807,
        "y": 461,
        "z": 1.84
      },
      "pip": {
        "x": 560,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 1015,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#FF8A3D",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "supermoon_vs",
        "x": 430,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "NASA WHAT\u2019S UP \u00b7 NOV 2026",
        "distFrom": "15\u201316 NOV \u00b7 1.2\u00b0",
        "distTo": "24 NOV SUPERMOON",
        "sizeLabel": "14:54 UTC",
        "subMetric": "NEXT: 24 DEC 2026 & JAN",
        "themeColor": "#FF8A3D"
      }
    }
  },
  "S191": {
    "kind": "diagram",
    "cfg": {
      "id": "S191",
      "mode": "nov2026_three_supermoons",
      "variant": 0,
      "title": "NOVEMBER 2026 NASA SKYWATCHING GUIDE",
      "subtitle": "15\u201316 NOV MARS/JUPITER 1.2\u00b0 \u00b7 17\u201318 NOV LEONIDS \u00b7 24 NOV SUPERMOON",
      "accentColor": "#A68CFF",
      "cam": {
        "x": 940,
        "y": 550,
        "z": 1.0
      },
      "camEnd": {
        "x": 960,
        "y": 540,
        "z": 1.03
      },
      "pill": {
        "label": "CHAPTER 10 SCIENCE FACT",
        "value": "15\u201316 NOV MARS/JUPITER 1.2\u00b0",
        "color": "#A68CFF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S192": {
    "kind": "scene",
    "cfg": {
      "id": "S192",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 593,
        "y": 672,
        "z": 2.2
      },
      "camEnd": {
        "x": 664,
        "y": 609,
        "z": 2.36
      },
      "pip": {
        "x": 680,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 925,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#FF6A4D",
        "x": 72,
        "y": 920
      }
    }
  },
  "S193": {
    "kind": "scene",
    "cfg": {
      "id": "S193",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 986,
        "y": 529,
        "z": 0.96
      },
      "camEnd": {
        "x": 992,
        "y": 516,
        "z": 1.04
      },
      "pip": {
        "x": 740,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#FFE27A",
        "x": 72,
        "y": 920
      },
      "gauge": {
        "variant": "almanac_radar",
        "x": 430,
        "y": 355,
        "scale": 0.86,
        "tilt": -2,
        "header": "NASA WHAT\u2019S UP \u00b7 NOV 2026",
        "distFrom": "15\u201316 NOV \u00b7 1.2\u00b0",
        "distTo": "24 NOV SUPERMOON",
        "sizeLabel": "14:54 UTC",
        "subMetric": "NEXT: 24 DEC 2026 & JAN",
        "themeColor": "#FFE27A"
      }
    }
  },
  "S194": {
    "kind": "scene",
    "cfg": {
      "id": "S194",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 1119,
        "y": 426,
        "z": 1.57
      },
      "camEnd": {
        "x": 1171,
        "y": 462,
        "z": 1.68
      },
      "pip": {
        "x": 800,
        "pose": "pointMoon",
        "scale": 0.94,
        "flip": 1
      },
      "mo": {
        "x": 1075,
        "pose": "pointMoon",
        "scale": 0.92,
        "flip": -1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#7FD4FF",
        "x": 72,
        "y": 920
      }
    }
  },
  "S195": {
    "kind": "scene",
    "cfg": {
      "id": "S195",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
      "cam": {
        "x": 672,
        "y": 623,
        "z": 1.54
      },
      "camEnd": {
        "x": 729,
        "y": 604,
        "z": 1.64
      },
      "pip": {
        "x": 860,
        "pose": "rooftopCelebrate",
        "scale": 0.94,
        "flip": 1
      },
      "pill": {
        "label": "24 NOV 2026 \u00b7 14:54 UTC",
        "value": "FIRST OF 3 SUPERMOONS (NOV \u00b7 DEC \u00b7 JAN)",
        "color": "#5BE08A",
        "x": 72,
        "y": 920
      }
    }
  },
  "S196": {
    "kind": "scene",
    "cfg": {
      "id": "S196",
      "set": "rooftop_nov2026",
      "setVariant": "supermoon_24nov",
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

export const FILM_SHOTS: ShotMap = Object.fromEntries(
  Object.entries(SHOT_SPECS).map(([id, spec]) => [
    id,
    (({ t, len }: ShotProps) =>
      spec.kind === 'scene' ? (
        <ClosermoonSceneShot t={t} len={len} cfg={spec.cfg} />
      ) : (
        <ClosermoonDiagramShot t={t} len={len} cfg={spec.cfg} />
      )) as React.FC<ShotProps>,
  ])
);
