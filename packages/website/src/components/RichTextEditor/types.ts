export const alignments = ['left', 'center', 'right', 'justify'] as const;
export type Alignment = (typeof alignments)[number];

export const headerLevels = [1, 2, 3, 4, 5, 6] as const;
export type HeaderLevel = (typeof headerLevels)[number];
