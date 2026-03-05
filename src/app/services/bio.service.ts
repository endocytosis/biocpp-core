import { Injectable } from '@angular/core';
import {
  parseSequence,
  complementSequence,
  reverseComplementSequence,
  AlphabetType,
  getAlphabet,
} from '../core/bio/nucleotide';
import {
  translate,
  translateSingleFrame,
  TranslationFrame,
  TranslationResult,
  SIX_FRAME,
  FWD_FRAMES,
  REV_FRAMES,
  FRAME_LABELS,
  getSelectedFrames,
} from '../core/bio/translation';
import { getCodonTable } from '../core/bio/codon-table';
import { AA_NAMES } from '../core/bio/aminoacid';

export interface CommandResult {
  output: string;
  isError: boolean;
}

@Injectable({ providedIn: 'root' })
export class BioService {
  parseSequence(input: string, type: AlphabetType = 'dna4'): string[] {
    return parseSequence(input, type);
  }

  complement(seq: string[], type: AlphabetType = 'dna4'): string[] {
    return complementSequence(seq, type);
  }

  reverseComplement(seq: string[], type: AlphabetType = 'dna4'): string[] {
    return reverseComplementSequence(seq, type);
  }

  translate(sequence: string, frameMask: number = SIX_FRAME): TranslationResult {
    return translate(sequence, frameMask);
  }

  translateSingle(seq: string[], frame: TranslationFrame): string[] {
    return translateSingleFrame(seq, frame);
  }

  getCodonTable(): Record<string, string> {
    return getCodonTable();
  }

  getAminoAcidName(code: string): string {
    return AA_NAMES[code.toUpperCase()] ?? 'Unknown';
  }

  getAlphabetInfo(type: AlphabetType) {
    const alpha = getAlphabet(type);
    return { type: alpha.type, size: alpha.size, chars: alpha.chars };
  }

  getFrameLabels() {
    return FRAME_LABELS;
  }

  resolveFrameMask(frameStr: string): number {
    const lower = frameStr.toLowerCase().trim();
    if (lower === 'six' || lower === 'all' || lower === '6') return SIX_FRAME;
    if (lower === 'fwd' || lower === 'forward') return FWD_FRAMES;
    if (lower === 'rev' || lower === 'reverse') return REV_FRAMES;
    if (lower === 'fwd0' || lower === 'f0') return TranslationFrame.FWD_FRAME_0;
    if (lower === 'fwd1' || lower === 'f1') return TranslationFrame.FWD_FRAME_1;
    if (lower === 'fwd2' || lower === 'f2') return TranslationFrame.FWD_FRAME_2;
    if (lower === 'rev0' || lower === 'r0') return TranslationFrame.REV_FRAME_0;
    if (lower === 'rev1' || lower === 'r1') return TranslationFrame.REV_FRAME_1;
    if (lower === 'rev2' || lower === 'r2') return TranslationFrame.REV_FRAME_2;
    return SIX_FRAME;
  }

  getSelectedFrames(mask: number): TranslationFrame[] {
    return getSelectedFrames(mask);
  }
}
