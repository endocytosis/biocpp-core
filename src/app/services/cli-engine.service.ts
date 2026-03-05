import { Injectable } from '@angular/core';
import { BioService } from './bio.service';
import { SequenceHistoryService } from './sequence-history.service';
import { TranslationFrame, FRAME_LABELS, SIX_FRAME } from '../core/bio/translation';
import { AlphabetType } from '../core/bio/nucleotide';
import { AA_NAMES } from '../core/bio/aminoacid';

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'table' | 'divider';
  text: string;
  timestamp?: Date;
}

@Injectable({ providedIn: 'root' })
export class CliEngineService {
  private currentSequence: string[] = [];
  private currentAlphabet: AlphabetType = 'dna4';
  private history: string[] = [];

  constructor(
    private bio: BioService,
    private historyService: SequenceHistoryService,
  ) {}

  getCommandHistory(): string[] {
    return [...this.history];
  }

  async execute(input: string): Promise<TerminalLine[]> {
    this.history.push(input);
    const trimmed = input.trim();
    if (!trimmed) return [];

    const parts = this.parseCommand(trimmed);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      switch (cmd) {
        case 'help': return this.cmdHelp(args);
        case 'seq': return await this.cmdSeq(args);
        case 'translate': return await this.cmdTranslate(args);
        case 'complement': return await this.cmdComplement(args);
        case 'revcomp': return await this.cmdRevComp(args);
        case 'alphabet': return this.cmdAlphabet(args);
        case 'codons': return this.cmdCodons(args);
        case 'info': return this.cmdInfo(args);
        case 'clear': return [{ type: 'info', text: '__CLEAR__' }];
        case 'example': return await this.cmdExample();
        case 'frames': return this.cmdFrames();
        case 'aa': return this.cmdAa(args);
        default:
          return [{ type: 'error', text: `Unknown command: '${cmd}'. Type 'help' for available commands.` }];
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return [{ type: 'error', text: `Error: ${msg}` }];
    }
  }

  private parseCommand(input: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (const c of input) {
      if (inQuote) {
        if (c === quoteChar) {
          inQuote = false;
        } else {
          current += c;
        }
      } else if (c === '"' || c === "'") {
        inQuote = true;
        quoteChar = c;
      } else if (c === ' ') {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += c;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  private cmdHelp(args: string[]): TerminalLine[] {
    if (args.length > 0) {
      return this.cmdHelpDetail(args[0]);
    }
    return [
      { type: 'info', text: 'BioCPP Angular CLI - Available Commands:' },
      { type: 'divider', text: '' },
      { type: 'output', text: '  seq <sequence> [alphabet]    Set/display a DNA/RNA sequence' },
      { type: 'output', text: '  translate [sequence] [frame] Translate nucleotide to amino acid' },
      { type: 'output', text: '  complement [sequence]        Get complement of sequence' },
      { type: 'output', text: '  revcomp [sequence]           Get reverse complement' },
      { type: 'output', text: '  alphabet [type]              Show alphabet information' },
      { type: 'output', text: '  codons                       Show the codon table' },
      { type: 'output', text: '  frames                       Show available translation frames' },
      { type: 'output', text: '  aa [code]                    Show amino acid info' },
      { type: 'output', text: '  info                         Show current sequence info' },
      { type: 'output', text: '  example                      Run the example from documentation' },
      { type: 'output', text: '  clear                        Clear the terminal' },
      { type: 'output', text: '  help [command]               Show help for a command' },
      { type: 'divider', text: '' },
      { type: 'info', text: "Type 'help <command>' for detailed usage." },
    ];
  }

  private cmdHelpDetail(cmd: string): TerminalLine[] {
    const docs: Record<string, string[]> = {
      seq: [
        'Usage: seq <sequence> [alphabet]',
        '',
        'Set the current working sequence and optionally specify the alphabet type.',
        'Supported alphabets: dna4 (default), dna5, rna4, rna5',
        '',
        'Examples:',
        '  seq GATTACATATA',
        '  seq GATTACA dna4',
        '  seq GAUUACA rna4',
        '',
        'The sequence is normalized to the selected alphabet.',
      ],
      translate: [
        'Usage: translate [sequence] [frame]',
        '',
        'Translate a nucleotide sequence into amino acids.',
        'If no sequence is given, uses the current working sequence.',
        '',
        'Frame options:',
        '  six/all/6  - All 6 frames (default)',
        '  fwd        - All 3 forward frames',
        '  rev        - All 3 reverse frames',
        '  f0/fwd0    - Forward frame 0',
        '  f1/fwd1    - Forward frame 1',
        '  f2/fwd2    - Forward frame 2',
        '  r0/rev0    - Reverse frame 0',
        '  r1/rev1    - Reverse frame 1',
        '  r2/rev2    - Reverse frame 2',
        '',
        'Examples:',
        '  translate GATTACATATA',
        '  translate GATTACATATA fwd',
        '  translate f0',
        '',
        'Access specific amino acid: translated[frame][position]',
        'Example from C++ docs:',
        '  seq GATTACATATA',
        '  translate',
        '  Result: [DYI, ITY, LHI, YM*, ICN, YVI]',
        '  Frame 2, position 1 = H',
      ],
      complement: [
        'Usage: complement [sequence]',
        '',
        'Get the complement of a DNA/RNA sequence.',
        'A<->T (or A<->U for RNA), C<->G',
        '',
        'Examples:',
        '  complement GATTACA',
        '  complement',
      ],
      revcomp: [
        'Usage: revcomp [sequence]',
        '',
        'Get the reverse complement of a DNA/RNA sequence.',
        'The sequence is complemented and then reversed.',
        '',
        'Examples:',
        '  revcomp GATTACA',
        '  revcomp',
      ],
      alphabet: [
        'Usage: alphabet [type]',
        '',
        'Show information about a nucleotide alphabet.',
        'Types: dna4, dna5, rna4, rna5',
        '',
        'Examples:',
        '  alphabet dna4',
        '  alphabet rna5',
      ],
      codons: [
        'Usage: codons [amino_acid]',
        '',
        'Show the standard genetic code codon table.',
        'Optionally filter by a specific amino acid.',
        '',
        'Examples:',
        '  codons',
        '  codons M',
      ],
      frames: [
        'Usage: frames',
        '',
        'Display information about the 6 translation reading frames.',
      ],
      aa: [
        'Usage: aa [code]',
        '',
        'Show amino acid information.',
        'Without arguments, lists all 27 amino acid codes.',
        'With a code, shows details for that amino acid.',
        '',
        'Examples:',
        '  aa',
        '  aa M',
        '  aa *',
      ],
      example: [
        'Usage: example',
        '',
        'Runs the example from the BioCPP documentation:',
        '',
        '  std::vector seq = "GATTACATATA"_dna4;',
        '  auto translated = seq | bio::views::translate;',
        '  // Result: [DYI, ITY, LHI, YM*, ICN, YVI]',
        '  // Frame 2, position 1 = H',
      ],
      info: [
        'Usage: info',
        '',
        'Show information about the current working sequence,',
        'including length, alphabet, and GC content.',
      ],
    };

    const lines = docs[cmd.toLowerCase()];
    if (!lines) {
      return [{ type: 'error', text: `No help available for '${cmd}'.` }];
    }
    return lines.map((text) => ({ type: 'output' as const, text }));
  }

  private async cmdSeq(args: string[]): Promise<TerminalLine[]> {
    if (args.length === 0) {
      if (this.currentSequence.length === 0) {
        return [{ type: 'info', text: 'No sequence set. Usage: seq <sequence> [alphabet]' }];
      }
      return [
        { type: 'output', text: `Sequence: ${this.currentSequence.join('')}` },
        { type: 'output', text: `Alphabet: ${this.currentAlphabet}` },
        { type: 'output', text: `Length:   ${this.currentSequence.length}` },
      ];
    }

    const seqStr = args[0];
    if (args.length > 1) {
      const alpha = args[1].toLowerCase() as AlphabetType;
      if (['dna4', 'dna5', 'rna4', 'rna5'].includes(alpha)) {
        this.currentAlphabet = alpha;
      }
    }

    this.currentSequence = this.bio.parseSequence(seqStr, this.currentAlphabet);

    await this.historyService.saveEntry({
      command: `seq ${args.join(' ')}`,
      input_sequence: seqStr,
      operation: 'set_sequence',
      result: this.currentSequence.join(''),
    });

    return [
      { type: 'output', text: `Sequence set: ${this.currentSequence.join('')}` },
      { type: 'output', text: `Alphabet: ${this.currentAlphabet} | Length: ${this.currentSequence.length}` },
    ];
  }

  private async cmdTranslate(args: string[]): Promise<TerminalLine[]> {
    let seq: string[];
    let frameMaskStr = 'six';

    if (args.length === 0) {
      if (this.currentSequence.length === 0) {
        return [{ type: 'error', text: 'No sequence set. Usage: translate <sequence> [frame]' }];
      }
      seq = [...this.currentSequence];
    } else {
      const possibleFrames = ['six', 'all', '6', 'fwd', 'forward', 'rev', 'reverse', 'f0', 'f1', 'f2', 'r0', 'r1', 'r2', 'fwd0', 'fwd1', 'fwd2', 'rev0', 'rev1', 'rev2'];
      if (possibleFrames.includes(args[0].toLowerCase())) {
        if (this.currentSequence.length === 0) {
          return [{ type: 'error', text: 'No sequence set. Provide sequence or use "seq" first.' }];
        }
        seq = [...this.currentSequence];
        frameMaskStr = args[0];
      } else {
        seq = this.bio.parseSequence(args[0], this.currentAlphabet);
        this.currentSequence = seq;
        if (args.length > 1) frameMaskStr = args[1];
      }
    }

    const frameMask = this.bio.resolveFrameMask(frameMaskStr);
    const result = this.bio.translate(seq.join(''), frameMask);
    const lines: TerminalLine[] = [];

    lines.push({ type: 'info', text: `Translating '${seq.join('')}':` });

    const frameStrs = result.frames.map((f) => f.aminoAcids.join(''));
    lines.push({ type: 'output', text: `[${frameStrs.join(', ')}]` });
    lines.push({ type: 'divider', text: '' });

    for (const f of result.frames) {
      lines.push({
        type: 'output',
        text: `  ${f.label}: ${f.aminoAcids.join('')}`,
      });
    }

    await this.historyService.saveEntry({
      command: `translate ${args.join(' ')}`,
      input_sequence: seq.join(''),
      operation: 'translate',
      result: `[${frameStrs.join(', ')}]`,
    });

    return lines;
  }

  private async cmdComplement(args: string[]): Promise<TerminalLine[]> {
    let seq: string[];
    if (args.length > 0) {
      seq = this.bio.parseSequence(args[0], this.currentAlphabet);
    } else if (this.currentSequence.length > 0) {
      seq = [...this.currentSequence];
    } else {
      return [{ type: 'error', text: 'No sequence. Usage: complement <sequence>' }];
    }

    const comp = this.bio.complement(seq, this.currentAlphabet);

    await this.historyService.saveEntry({
      command: `complement ${args.join(' ')}`,
      input_sequence: seq.join(''),
      operation: 'complement',
      result: comp.join(''),
    });

    return [
      { type: 'output', text: `Input:      ${seq.join('')}` },
      { type: 'output', text: `Complement: ${comp.join('')}` },
    ];
  }

  private async cmdRevComp(args: string[]): Promise<TerminalLine[]> {
    let seq: string[];
    if (args.length > 0) {
      seq = this.bio.parseSequence(args[0], this.currentAlphabet);
    } else if (this.currentSequence.length > 0) {
      seq = [...this.currentSequence];
    } else {
      return [{ type: 'error', text: 'No sequence. Usage: revcomp <sequence>' }];
    }

    const rc = this.bio.reverseComplement(seq, this.currentAlphabet);

    await this.historyService.saveEntry({
      command: `revcomp ${args.join(' ')}`,
      input_sequence: seq.join(''),
      operation: 'reverse_complement',
      result: rc.join(''),
    });

    return [
      { type: 'output', text: `Input:     ${seq.join('')}` },
      { type: 'output', text: `Rev Comp:  ${rc.join('')}` },
    ];
  }

  private cmdAlphabet(args: string[]): TerminalLine[] {
    const type = (args[0]?.toLowerCase() ?? this.currentAlphabet) as AlphabetType;
    if (!['dna4', 'dna5', 'rna4', 'rna5'].includes(type)) {
      return [{ type: 'error', text: 'Unknown alphabet. Options: dna4, dna5, rna4, rna5' }];
    }
    const info = this.bio.getAlphabetInfo(type);
    return [
      { type: 'info', text: `Alphabet: ${info.type}` },
      { type: 'output', text: `Size: ${info.size}` },
      { type: 'output', text: `Characters: ${info.chars.join(', ')}` },
    ];
  }

  private cmdCodons(args: string[]): TerminalLine[] {
    const table = this.bio.getCodonTable();
    const lines: TerminalLine[] = [];

    if (args.length > 0) {
      const targetAa = args[0].toUpperCase();
      lines.push({ type: 'info', text: `Codons encoding '${targetAa}' (${AA_NAMES[targetAa] ?? 'Unknown'}):` });
      const matching = Object.entries(table).filter(([, aa]) => aa === targetAa);
      if (matching.length === 0) {
        lines.push({ type: 'output', text: 'No codons found.' });
      } else {
        lines.push({ type: 'output', text: matching.map(([codon]) => codon).join(', ') });
      }
      return lines;
    }

    lines.push({ type: 'info', text: 'Standard Genetic Code (Codon Table):' });
    lines.push({ type: 'divider', text: '' });

    const grouped: Record<string, string[]> = {};
    for (const [codon, aa] of Object.entries(table)) {
      if (!grouped[aa]) grouped[aa] = [];
      grouped[aa].push(codon);
    }

    const sorted = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    for (const [aa, codons] of sorted) {
      const name = AA_NAMES[aa] ?? 'Unknown';
      lines.push({ type: 'output', text: `  ${aa} (${name}): ${codons.join(', ')}` });
    }

    return lines;
  }

  private cmdInfo(args: string[]): TerminalLine[] {
    if (this.currentSequence.length === 0) {
      return [{ type: 'info', text: 'No sequence set. Use "seq <sequence>" to set one.' }];
    }

    const seq = this.currentSequence;
    const gcCount = seq.filter((c) => c === 'G' || c === 'C').length;
    const gcContent = ((gcCount / seq.length) * 100).toFixed(1);

    return [
      { type: 'info', text: 'Current Sequence Info:' },
      { type: 'output', text: `  Sequence:   ${seq.join('')}` },
      { type: 'output', text: `  Alphabet:   ${this.currentAlphabet}` },
      { type: 'output', text: `  Length:     ${seq.length} nt` },
      { type: 'output', text: `  GC Content: ${gcContent}%` },
    ];
  }

  private async cmdExample(): Promise<TerminalLine[]> {
    const seq = this.bio.parseSequence('GATTACATATA', 'dna4');
    this.currentSequence = seq;
    this.currentAlphabet = 'dna4';

    const result = this.bio.translate(seq.join(''), SIX_FRAME);
    const frameStrs = result.frames.map((f) => f.aminoAcids.join(''));
    const thirdFrame = result.frames[2];
    const secondAa = thirdFrame?.aminoAcids[1] ?? '?';

    const lines: TerminalLine[] = [
      { type: 'info', text: "Reproducing the BioCPP documentation example:" },
      { type: 'divider', text: '' },
      { type: 'output', text: '  std::vector seq = "GATTACATATA"_dna4;' },
      { type: 'output', text: '  auto translated = seq | bio::views::translate;' },
      { type: 'divider', text: '' },
      { type: 'output', text: `  The six protein frames of '${seq.join('')}' are:` },
      { type: 'output', text: `  [${frameStrs.join(', ')}]` },
      { type: 'divider', text: '' },
      { type: 'output', text: `  The third frame's second amino acid is: ${secondAa}` },
      { type: 'divider', text: '' },
    ];

    for (const f of result.frames) {
      lines.push({ type: 'output', text: `  ${f.label}: ${f.aminoAcids.join('')}` });
    }

    await this.historyService.saveEntry({
      command: 'example',
      input_sequence: 'GATTACATATA',
      operation: 'translate_six_frame',
      result: `[${frameStrs.join(', ')}]`,
    });

    return lines;
  }

  private cmdFrames(): TerminalLine[] {
    const allFrames = [
      TranslationFrame.FWD_FRAME_0,
      TranslationFrame.FWD_FRAME_1,
      TranslationFrame.FWD_FRAME_2,
      TranslationFrame.REV_FRAME_0,
      TranslationFrame.REV_FRAME_1,
      TranslationFrame.REV_FRAME_2,
    ];

    const lines: TerminalLine[] = [
      { type: 'info', text: 'Translation Reading Frames:' },
      { type: 'divider', text: '' },
    ];

    for (const f of allFrames) {
      const isReverse = f >= TranslationFrame.REV_FRAME_0;
      const offset = isReverse
        ? Math.log2(f / TranslationFrame.REV_FRAME_0)
        : Math.log2(f);
      lines.push({
        type: 'output',
        text: `  ${FRAME_LABELS[f]} (offset ${offset}, ${isReverse ? 'reverse complement' : 'forward'})`,
      });
    }

    lines.push({ type: 'divider', text: '' });
    lines.push({ type: 'info', text: 'Frame shortcuts: six, fwd, rev, f0, f1, f2, r0, r1, r2' });

    return lines;
  }

  private cmdAa(args: string[]): TerminalLine[] {
    if (args.length > 0) {
      const code = args[0].toUpperCase();
      const name = AA_NAMES[code];
      if (!name) {
        return [{ type: 'error', text: `Unknown amino acid code: '${code}'` }];
      }
      const table = this.bio.getCodonTable();
      const codons = Object.entries(table)
        .filter(([, aa]) => aa === code)
        .map(([codon]) => codon);

      return [
        { type: 'info', text: `${code} - ${name}` },
        { type: 'output', text: `Codons: ${codons.length > 0 ? codons.join(', ') : 'N/A'}` },
      ];
    }

    const lines: TerminalLine[] = [
      { type: 'info', text: 'Amino Acid Codes (AA27):' },
      { type: 'divider', text: '' },
    ];

    for (const [code, name] of Object.entries(AA_NAMES)) {
      lines.push({ type: 'output', text: `  ${code} - ${name}` });
    }

    return lines;
  }
}
