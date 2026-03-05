export type Dna4Char = 'A' | 'C' | 'G' | 'T';
export type Dna5Char = 'A' | 'C' | 'G' | 'N' | 'T';
export type Rna4Char = 'A' | 'C' | 'G' | 'U';
export type Rna5Char = 'A' | 'C' | 'G' | 'N' | 'U';

const DNA4_CHARS: Dna4Char[] = ['A', 'C', 'G', 'T'];
const DNA5_CHARS: Dna5Char[] = ['A', 'C', 'G', 'N', 'T'];
const RNA4_CHARS: Rna4Char[] = ['A', 'C', 'G', 'U'];
const RNA5_CHARS: Rna5Char[] = ['A', 'C', 'G', 'N', 'U'];

const DNA4_COMPLEMENT: Record<Dna4Char, Dna4Char> = { A: 'T', C: 'G', G: 'C', T: 'A' };
const DNA5_COMPLEMENT: Record<Dna5Char, Dna5Char> = { A: 'T', C: 'G', G: 'C', N: 'N', T: 'A' };
const RNA4_COMPLEMENT: Record<Rna4Char, Rna4Char> = { A: 'U', C: 'G', G: 'C', U: 'A' };
const RNA5_COMPLEMENT: Record<Rna5Char, Rna5Char> = { A: 'U', C: 'G', G: 'C', N: 'N', U: 'A' };

const IUPAC_TO_DNA4: Record<string, Dna4Char> = {
  A: 'A', C: 'C', G: 'G', T: 'T', U: 'T',
  R: 'A', Y: 'C', S: 'C', W: 'A', K: 'G', M: 'A',
  B: 'C', D: 'A', H: 'A', V: 'A', N: 'A',
};

export type AlphabetType = 'dna4' | 'dna5' | 'rna4' | 'rna5';

export interface NucleotideAlphabet {
  type: AlphabetType;
  size: number;
  chars: string[];
  validate(c: string): boolean;
  normalize(c: string): string;
  complement(c: string): string;
}

function createDna4Alphabet(): NucleotideAlphabet {
  return {
    type: 'dna4',
    size: 4,
    chars: [...DNA4_CHARS],
    validate(c: string) {
      return IUPAC_TO_DNA4[c.toUpperCase()] !== undefined;
    },
    normalize(c: string) {
      return IUPAC_TO_DNA4[c.toUpperCase()] ?? 'A';
    },
    complement(c: string) {
      const norm = this.normalize(c) as Dna4Char;
      return DNA4_COMPLEMENT[norm];
    },
  };
}

function createDna5Alphabet(): NucleotideAlphabet {
  return {
    type: 'dna5',
    size: 5,
    chars: [...DNA5_CHARS],
    validate(c: string) {
      const upper = c.toUpperCase();
      return DNA5_CHARS.includes(upper as Dna5Char) || upper === 'U';
    },
    normalize(c: string) {
      const upper = c.toUpperCase();
      if (upper === 'U') return 'T';
      if (DNA5_CHARS.includes(upper as Dna5Char)) return upper;
      return 'N';
    },
    complement(c: string) {
      const norm = this.normalize(c) as Dna5Char;
      return DNA5_COMPLEMENT[norm];
    },
  };
}

function createRna4Alphabet(): NucleotideAlphabet {
  return {
    type: 'rna4',
    size: 4,
    chars: [...RNA4_CHARS],
    validate(c: string) {
      const upper = c.toUpperCase();
      return RNA4_CHARS.includes(upper as Rna4Char) || upper === 'T';
    },
    normalize(c: string) {
      const upper = c.toUpperCase();
      if (upper === 'T') return 'U';
      if (RNA4_CHARS.includes(upper as Rna4Char)) return upper;
      return 'A';
    },
    complement(c: string) {
      const norm = this.normalize(c) as Rna4Char;
      return RNA4_COMPLEMENT[norm];
    },
  };
}

function createRna5Alphabet(): NucleotideAlphabet {
  return {
    type: 'rna5',
    size: 5,
    chars: [...RNA5_CHARS],
    validate(c: string) {
      const upper = c.toUpperCase();
      return RNA5_CHARS.includes(upper as Rna5Char) || upper === 'T';
    },
    normalize(c: string) {
      const upper = c.toUpperCase();
      if (upper === 'T') return 'U';
      if (RNA5_CHARS.includes(upper as Rna5Char)) return upper;
      return 'N';
    },
    complement(c: string) {
      const norm = this.normalize(c) as Rna5Char;
      return RNA5_COMPLEMENT[norm];
    },
  };
}

export function getAlphabet(type: AlphabetType): NucleotideAlphabet {
  switch (type) {
    case 'dna4': return createDna4Alphabet();
    case 'dna5': return createDna5Alphabet();
    case 'rna4': return createRna4Alphabet();
    case 'rna5': return createRna5Alphabet();
  }
}

export function parseSequence(input: string, type: AlphabetType = 'dna4'): string[] {
  const alphabet = getAlphabet(type);
  return input
    .toUpperCase()
    .split('')
    .filter((c) => /[A-Z]/.test(c))
    .map((c) => alphabet.normalize(c));
}

export function complementSequence(seq: string[], type: AlphabetType = 'dna4'): string[] {
  const alphabet = getAlphabet(type);
  return seq.map((c) => alphabet.complement(c));
}

export function reverseComplementSequence(seq: string[], type: AlphabetType = 'dna4'): string[] {
  return complementSequence(seq, type).reverse();
}
