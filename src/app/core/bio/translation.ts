import { translateCodon } from './codon-table';

export enum TranslationFrame {
  FWD_FRAME_0 = 1,
  FWD_FRAME_1 = 2,
  FWD_FRAME_2 = 4,
  REV_FRAME_0 = 8,
  REV_FRAME_1 = 16,
  REV_FRAME_2 = 32,
}

export const FRAME_LABELS: Record<TranslationFrame, string> = {
  [TranslationFrame.FWD_FRAME_0]: 'Forward Frame 0',
  [TranslationFrame.FWD_FRAME_1]: 'Forward Frame 1',
  [TranslationFrame.FWD_FRAME_2]: 'Forward Frame 2',
  [TranslationFrame.REV_FRAME_0]: 'Reverse Frame 0',
  [TranslationFrame.REV_FRAME_1]: 'Reverse Frame 1',
  [TranslationFrame.REV_FRAME_2]: 'Reverse Frame 2',
};

export const SIX_FRAME = TranslationFrame.FWD_FRAME_0 | TranslationFrame.FWD_FRAME_1 |
  TranslationFrame.FWD_FRAME_2 | TranslationFrame.REV_FRAME_0 |
  TranslationFrame.REV_FRAME_1 | TranslationFrame.REV_FRAME_2;

export const FWD_FRAMES = TranslationFrame.FWD_FRAME_0 | TranslationFrame.FWD_FRAME_1 |
  TranslationFrame.FWD_FRAME_2;

export const REV_FRAMES = TranslationFrame.REV_FRAME_0 | TranslationFrame.REV_FRAME_1 |
  TranslationFrame.REV_FRAME_2;

const DNA_COMPLEMENT: Record<string, string> = {
  A: 'T', T: 'A', C: 'G', G: 'C', U: 'A', N: 'N',
};

function complementBase(c: string): string {
  return DNA_COMPLEMENT[c.toUpperCase()] ?? 'N';
}

function computeFrameSize(seqLen: number, frame: TranslationFrame): number {
  switch (frame) {
    case TranslationFrame.FWD_FRAME_0:
    case TranslationFrame.REV_FRAME_0:
      return Math.floor(seqLen / 3);
    case TranslationFrame.FWD_FRAME_1:
    case TranslationFrame.REV_FRAME_1:
      return Math.floor((Math.max(seqLen, 1) - 1) / 3);
    case TranslationFrame.FWD_FRAME_2:
    case TranslationFrame.REV_FRAME_2:
      return Math.floor((Math.max(seqLen, 2) - 2) / 3);
    default:
      return 0;
  }
}

export function translateSingleFrame(seq: string[], frame: TranslationFrame): string[] {
  const oldSize = seq.length;
  const newSize = computeFrameSize(oldSize, frame);
  const result: string[] = [];

  for (let n = 0; n < newSize; n++) {
    let n1: string, n2: string, n3: string;
    switch (frame) {
      case TranslationFrame.FWD_FRAME_0:
        n1 = seq[n * 3]; n2 = seq[n * 3 + 1]; n3 = seq[n * 3 + 2];
        break;
      case TranslationFrame.REV_FRAME_0:
        n1 = complementBase(seq[oldSize - n * 3 - 1]);
        n2 = complementBase(seq[oldSize - n * 3 - 2]);
        n3 = complementBase(seq[oldSize - n * 3 - 3]);
        break;
      case TranslationFrame.FWD_FRAME_1:
        n1 = seq[n * 3 + 1]; n2 = seq[n * 3 + 2]; n3 = seq[n * 3 + 3];
        break;
      case TranslationFrame.REV_FRAME_1:
        n1 = complementBase(seq[oldSize - n * 3 - 2]);
        n2 = complementBase(seq[oldSize - n * 3 - 3]);
        n3 = complementBase(seq[oldSize - n * 3 - 4]);
        break;
      case TranslationFrame.FWD_FRAME_2:
        n1 = seq[n * 3 + 2]; n2 = seq[n * 3 + 3]; n3 = seq[n * 3 + 4];
        break;
      case TranslationFrame.REV_FRAME_2:
        n1 = complementBase(seq[oldSize - n * 3 - 3]);
        n2 = complementBase(seq[oldSize - n * 3 - 4]);
        n3 = complementBase(seq[oldSize - n * 3 - 5]);
        break;
      default:
        n1 = 'N'; n2 = 'N'; n3 = 'N';
    }
    result.push(translateCodon(n1, n2, n3));
  }

  return result;
}

export function getSelectedFrames(frameMask: number): TranslationFrame[] {
  const frames: TranslationFrame[] = [];
  const allFrames = [
    TranslationFrame.FWD_FRAME_0, TranslationFrame.FWD_FRAME_1, TranslationFrame.FWD_FRAME_2,
    TranslationFrame.REV_FRAME_0, TranslationFrame.REV_FRAME_1, TranslationFrame.REV_FRAME_2,
  ];
  for (const f of allFrames) {
    if ((frameMask & f) === f) {
      frames.push(f);
    }
  }
  return frames;
}

export function translateAllFrames(seq: string[], frameMask: number = SIX_FRAME): string[][] {
  const frames = getSelectedFrames(frameMask);
  return frames.map((f) => translateSingleFrame(seq, f));
}

export interface TranslationResult {
  sequence: string;
  frames: {
    frame: TranslationFrame;
    label: string;
    aminoAcids: string[];
  }[];
}

export function translate(sequenceStr: string, frameMask: number = SIX_FRAME): TranslationResult {
  const seq = sequenceStr.toUpperCase().split('').filter((c) => /[ACGTU]/.test(c));
  const normalizedSeq = seq.map((c) => (c === 'U' ? 'T' : c));
  const frames = getSelectedFrames(frameMask);

  return {
    sequence: normalizedSeq.join(''),
    frames: frames.map((f) => ({
      frame: f,
      label: FRAME_LABELS[f],
      aminoAcids: translateSingleFrame(normalizedSeq, f),
    })),
  };
}
