import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BioService } from '../services/bio.service';
import { AA_NAMES } from '../core/bio/aminoacid';

interface CodonEntry {
  codon: string;
  aminoAcid: string;
  name: string;
  firstBase: string;
  secondBase: string;
  thirdBase: string;
}

@Component({
  selector: 'app-codon-table-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './codon-table-page.component.html',
  styleUrl: './codon-table-page.component.css',
})
export class CodonTablePageComponent implements OnInit {
  bases = ['T', 'C', 'A', 'G'];
  codonGrid: CodonEntry[][][] = [];
  selectedAa: string | null = null;

  constructor(public bio: BioService) {}

  ngOnInit() {
    const table = this.bio.getCodonTable();
    this.codonGrid = this.bases.map((first) =>
      this.bases.map((second) =>
        this.bases.map((third) => {
          const codon = `${first}${second}${third}`;
          const aa = table[codon] ?? 'X';
          return {
            codon,
            aminoAcid: aa,
            name: AA_NAMES[aa] ?? 'Unknown',
            firstBase: first,
            secondBase: second,
            thirdBase: third,
          };
        }),
      ),
    );
  }

  toggleAaFilter(aa: string) {
    this.selectedAa = this.selectedAa === aa ? null : aa;
  }

  isHighlighted(entry: CodonEntry): boolean {
    return this.selectedAa !== null && entry.aminoAcid === this.selectedAa;
  }

  isDimmed(entry: CodonEntry): boolean {
    return this.selectedAa !== null && entry.aminoAcid !== this.selectedAa;
  }

  getAaColor(aa: string): string {
    const colors: Record<string, string> = {
      F: '#e06c75', L: '#d19a66', I: '#e5c07b', M: '#56b6c2',
      V: '#98c379', S: '#61afef', P: '#c678dd', T: '#be5046',
      A: '#3fb950', Y: '#e06c75', '*': '#f85149', H: '#d19a66',
      Q: '#e5c07b', N: '#56b6c2', K: '#98c379', D: '#61afef',
      E: '#c678dd', C: '#be5046', W: '#3fb950', R: '#58a6ff',
      G: '#7ee787', X: '#8b949e',
    };
    return colors[aa] ?? '#8b949e';
  }
}
