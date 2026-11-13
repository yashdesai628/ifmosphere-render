// Pure helpers for the Marsyear scene engine: types, tweening, text/slot layout (no React, so the overlap checker can import it).
export type N = number | [number, number];
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sm = (t: number) => t * t * (3 - 2 * t);
/** A number, or a [from, to] pair tweened over the shot (p in 0..1). */
export const tw = (n: N | undefined, p: number, d = 0): number => (n === undefined ? d : typeof n === 'number' ? n : lerp(n[0], n[1], sm(clamp(p))));
export const rnd = (seed: number, i: number) => Math.abs(Math.sin(seed * 31.7 + i * 12.9898) * 43758.5453) % 1;

export type Slot = 't' | 'b' | 'c' | 'tl' | 'tr' | 'bl' | 'br' | 'ml' | 'mr' | 't2' | 'b2' | 'tc' | 'bc';
export type Box = { x: number; y: number; w: number; h: number };

export type TextSpec = { t: string; st?: 'big' | 'sticker' | 'note' | 'stamp' | 'fact' | 'num' | 'plain' | 'chip'; slot?: Slot; c?: string; at?: number; size?: number; rot?: number; hl?: string };
export type WidSpec = { st: 'cal' | 'flip' | 'led' | 'chalk' | 'sticky' | 'bar' | 'chain' | 'screen'; day: number; day2?: number; slot?: Slot; at?: number; sub?: string; v?: number };
export type LabelSpec = { st: 'tag' | 'ribbon' | 'stamp' | 'lower' | 'side' | 'pill'; a: string; b?: string; slot?: Slot; c?: string; at?: number };
export type CardSpec = { a: string; b: string; st: 0 | 1 | 2 | 3; c?: string };
export type PropSpec = { k: string; x?: N; y?: N; s?: N; r?: N; a?: N; c?: string; v?: any; o?: N; flip?: number };
export type FxSpec = { k: 'streaks' | 'sparks' | 'flakes' | 'rings' | 'bubbles' | 'embers' | 'dust'; a?: N; n?: number; c?: string; sp?: number; o?: number; x?: number; y?: number; seed?: number };
export type PipSpec = {
  x: N; y: N; s: N; pose: string; yaw?: number; flip?: 1 | -1; spin?: N; tilt?: N; ex?: string; hold?: string; suit?: number; ph?: number; arms?: [number, number]; hx?: number; hv?: string; look?: string;
};
export type CrewSpec = PipSpec & { who: 'elder' | 'ellis' | 'spicer' | 'monty' };
export type BgSpec = { k: string; [key: string]: any };
export type Spec = {
  bg: BgSpec;
  cam?: { x?: N; y?: N; z?: N; r?: N };
  pip?: PipSpec | null;
  props?: PropSpec[];
  fx?: FxSpec[];
  wid?: WidSpec;
  crew?: CrewSpec[];
  label?: LabelSpec;
  texts?: TextSpec[];
  card?: CardSpec;
  title?: number;
  end?: number;
  dim?: number;
};

export const isVert = (W: number, H: number) => H > W;

/** Anchor and alignment of a slot. */
export const slotAnchor = (slot: Slot, W: number, H: number) => {
  const v = isVert(W, H);
  const mx = v ? 56 : 84;
  const myT = v ? 150 : 56;
  const myB = v ? 300 : 56;
  const A: Record<Slot, { x: number; y: number; ax: 'l' | 'c' | 'r'; ay: 't' | 'm' | 'b' }> = {
    t: { x: W / 2, y: myT, ax: 'c', ay: 't' },
    t2: { x: W / 2, y: myT + (v ? 170 : 130), ax: 'c', ay: 't' },
    tc: { x: W / 2, y: H * 0.26, ax: 'c', ay: 'm' },
    b: { x: W / 2, y: H - myB, ax: 'c', ay: 'b' },
    b2: { x: W / 2, y: H - myB - (v ? 190 : 150), ax: 'c', ay: 'b' },
    bc: { x: W / 2, y: H * 0.76, ax: 'c', ay: 'm' },
    c: { x: W / 2, y: H / 2, ax: 'c', ay: 'm' },
    tl: { x: mx, y: myT, ax: 'l', ay: 't' },
    tr: { x: W - mx, y: myT, ax: 'r', ay: 't' },
    bl: { x: mx, y: H - myB, ax: 'l', ay: 'b' },
    br: { x: W - mx, y: H - myB, ax: 'r', ay: 'b' },
    ml: { x: mx, y: H / 2, ax: 'l', ay: 'm' },
    mr: { x: W - mx, y: H / 2, ax: 'r', ay: 'm' },
  };
  return A[slot];
};
export const maxWidthFor = (slot: Slot, W: number, H: number) => {
  const v = isVert(W, H);
  const mx = v ? 56 : 84;
  if (['t', 't2', 'b', 'b2', 'c', 'tc', 'bc'].includes(slot)) return W - 2 * mx;
  return v ? W - 2 * mx : W * 0.45;
};
export const place = (slot: Slot, w: number, h: number, W: number, H: number): Box => {
  const a = slotAnchor(slot, W, H);
  const x = a.ax === 'c' ? a.x - w / 2 : a.ax === 'l' ? a.x : a.x - w;
  const y = a.ay === 't' ? a.y : a.ay === 'm' ? a.y - h / 2 : a.y - h;
  return { x, y, w, h };
};
export const FK: Record<string, number> = { big: 0.64, sticker: 0.62, note: 0.5, stamp: 0.66, fact: 0.62, num: 0.62, plain: 0.6, chip: 0.62 };
const baseSize = (st: string, W: number, H: number) => {
  const v = isVert(W, H);
  const k = v ? 1.12 : 1;
  const m: Record<string, number> = { big: 88, sticker: 56, note: 48, stamp: 60, fact: 34, num: 190, plain: 52, chip: 34 };
  return (m[st] ?? 56) * k;
};
/** Size + box of a text element after fitting it to its slot (lines split on \n). */
export const textLayout = (tx: TextSpec, W: number, H: number) => {
  const st = tx.st ?? 'big';
  const slot = tx.slot ?? 't';
  const lines = tx.t.split('\n');
  const longest = Math.max(...lines.map((l) => l.length));
  const pad = st === 'big' || st === 'num' || st === 'plain' ? 0 : st === 'chip' || st === 'fact' ? 36 : 56;
  const maxW = maxWidthFor(slot, W, H) - pad;
  let size = (tx.size ?? baseSize(st, W, H));
  const k = FK[st] ?? 0.6;
  if (longest * size * k > maxW) size = maxW / (longest * k);
  const lh = size * 1.12;
  const w = longest * size * k + pad;
  const h = lines.length * lh + (pad ? 34 : 6) + (st === 'num' ? size * 0.3 : 0);
  return { size, lh, w, h, box: place(slot, w, h, W, H), lines, st };
};
export const widBox = (g: WidSpec, W: number, H: number): Box => {
  const slot = g.slot ?? 'tr';
  const v = isVert(W, H);
  const dims: Record<string, [number, number]> = { cal: [380, 330], flip: [460, 250], led: [520, 220], chalk: [460, 300], sticky: [330, 330], bar: [900, 150], chain: [420, 320], screen: [520, 340] };
  let [w, h] = dims[g.st];
  if (v) {
    w = Math.min(w, W - 112);
    if (g.st === 'bar') w = W - 112;
  }
  return place(slot, w, h, W, H);
};
export const labelBox = (l: LabelSpec, W: number, H: number): Box => {
  const slot = l.slot ?? 'tl';
  const v = isVert(W, H);
  const dims: Record<string, [number, number]> = { tag: [500, 130], ribbon: [640, 120], stamp: [480, 160], lower: [760, 130], side: [150, 520], pill: [560, 90] };
  let [w, h] = dims[l.st];
  if (v) w = Math.min(w, W - 112);
  return place(slot, w, h, W, H);
};
export const hit = (a: Box, b: Box, pad = 6) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
export const outOfFrame = (b: Box, W: number, H: number, m = 14) => b.x < m || b.y < m || b.x + b.w > W - m || b.y + b.h > H - m;
export const cardBox = (c: CardSpec, W: number, H: number): Box => {
  const v = isVert(W, H);
  if (c.st === 0) return { x: 0, y: H * 0.5 - 130, w: W, h: 260 };
  if (c.st === 1) return place('tl', v ? W - 112 : 760, 210, W, H);
  if (c.st === 2) return { x: 0, y: H - (v ? 560 : 330), w: W, h: 210 };
  return place('tr', v ? W - 112 : 760, 210, W, H);
};
