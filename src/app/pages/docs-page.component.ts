import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocSection {
  title: string;
  commands: {
    syntax: string;
    description: string;
    examples: string[];
    notes?: string[];
  }[];
}

@Component({
  selector: 'app-docs-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docs-page.component.html',
  styleUrl: './docs-page.component.css',
})
export class DocsPageComponent {
  sections: DocSection[] = [
    {
      title: 'Sequence Management',
      commands: [
        {
          syntax: 'seq <sequence> [alphabet]',
          description: 'Set or display the current working DNA/RNA sequence. The sequence is normalized to the selected alphabet.',
          examples: [
            'seq GATTACATATA',
            'seq GATTACA dna4',
            'seq GAUUACA rna4',
            'seq  (displays current sequence)',
          ],
          notes: [
            'Supported alphabets: dna4 (default), dna5, rna4, rna5',
            'Invalid characters are normalized to the closest valid base',
            'U is treated as T for DNA alphabets and vice versa for RNA',
          ],
        },
        {
          syntax: 'info',
          description: 'Display information about the current working sequence, including length, alphabet type, and GC content.',
          examples: ['info'],
        },
      ],
    },
    {
      title: 'Translation',
      commands: [
        {
          syntax: 'translate [sequence] [frame]',
          description: 'Translate a nucleotide sequence into amino acid sequences using the standard genetic code. Supports all 6 reading frames.',
          examples: [
            'translate GATTACATATA',
            'translate GATTACATATA fwd',
            'translate f0',
            'translate  (uses current sequence, all 6 frames)',
          ],
          notes: [
            'Frame options: six/all/6, fwd/forward, rev/reverse',
            'Single frames: f0, f1, f2 (forward), r0, r1, r2 (reverse)',
            'Output matches BioCPP: seq | bio::views::translate',
            'Forward frames read 5\'->3\', reverse frames read the reverse complement',
          ],
        },
        {
          syntax: 'frames',
          description: 'Display information about all 6 translation reading frames and their frame shortcuts.',
          examples: ['frames'],
        },
      ],
    },
    {
      title: 'Sequence Operations',
      commands: [
        {
          syntax: 'complement [sequence]',
          description: 'Compute the complement of a DNA/RNA sequence. A pairs with T (or U), C pairs with G.',
          examples: [
            'complement GATTACA',
            'complement  (uses current sequence)',
          ],
        },
        {
          syntax: 'revcomp [sequence]',
          description: 'Compute the reverse complement. The sequence is complemented and then reversed.',
          examples: [
            'revcomp GATTACA',
            'revcomp  (uses current sequence)',
          ],
        },
      ],
    },
    {
      title: 'Reference Data',
      commands: [
        {
          syntax: 'codons [amino_acid]',
          description: 'Display the standard genetic code codon table. Optionally filter codons that encode a specific amino acid.',
          examples: [
            'codons',
            'codons M',
            'codons *  (stop codons)',
          ],
        },
        {
          syntax: 'alphabet [type]',
          description: 'Show information about a nucleotide alphabet including its size and valid characters.',
          examples: [
            'alphabet dna4',
            'alphabet rna5',
          ],
          notes: [
            'dna4: A, C, G, T (4 bases)',
            'dna5: A, C, G, N, T (5 bases, N = unknown)',
            'rna4: A, C, G, U (4 bases)',
            'rna5: A, C, G, N, U (5 bases, N = unknown)',
          ],
        },
        {
          syntax: 'aa [code]',
          description: 'Show amino acid information. Without arguments, lists all 27 amino acid codes with names. With a code, shows details including encoding codons.',
          examples: [
            'aa',
            'aa M',
            'aa *  (stop codon)',
          ],
        },
      ],
    },
    {
      title: 'Utilities',
      commands: [
        {
          syntax: 'example',
          description: 'Run the example from the BioCPP documentation, translating "GATTACATATA" across all 6 reading frames.',
          examples: ['example'],
          notes: [
            'Equivalent to the C++ code:',
            '  std::vector seq = "GATTACATATA"_dna4;',
            '  auto translated = seq | bio::views::translate;',
            '  // Result: [DYI, ITY, LHI, YM*, ICN, YVI]',
          ],
        },
        {
          syntax: 'clear',
          description: 'Clear all terminal output.',
          examples: ['clear'],
        },
        {
          syntax: 'help [command]',
          description: 'Show general help or detailed help for a specific command.',
          examples: ['help', 'help translate'],
        },
      ],
    },
  ];
}
