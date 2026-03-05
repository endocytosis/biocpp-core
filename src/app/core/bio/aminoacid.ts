export const AA27_CHARS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z','*',
] as const;

export const AA20_CHARS = [
  'A','C','D','E','F','G','H','I','K','L','M',
  'N','P','Q','R','S','T','V','W','Y',
] as const;

export type AminoAcid27 = typeof AA27_CHARS[number];
export type AminoAcid20 = typeof AA20_CHARS[number];

export const AA_NAMES: Record<string, string> = {
  A: 'Alanine', B: 'Aspartate/Asparagine', C: 'Cysteine',
  D: 'Aspartate', E: 'Glutamate', F: 'Phenylalanine',
  G: 'Glycine', H: 'Histidine', I: 'Isoleucine',
  J: 'Leucine/Isoleucine', K: 'Lysine', L: 'Leucine',
  M: 'Methionine', N: 'Asparagine', O: 'Pyrrolysine',
  P: 'Proline', Q: 'Glutamine', R: 'Arginine',
  S: 'Serine', T: 'Threonine', U: 'Selenocysteine',
  V: 'Valine', W: 'Tryptophan', X: 'Unknown',
  Y: 'Tyrosine', Z: 'Glutamate/Glutamine', '*': 'Stop',
};
