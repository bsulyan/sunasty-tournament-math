export interface StepRow {
  readonly maxPlayers: number;
  readonly value: number;
}
export type ByeTiebreakRule = 'win' | 'best-result' | 'worse-than-draw-if-losses';
export type CutSpec =
  | { readonly kind: 'none' }
  | { readonly kind: 'table'; readonly table: readonly StepRow[] };
export interface DayTwoRow {
  readonly maxPlayers: number;
  readonly day1Rounds: number;
  readonly day2Rounds: number;
  readonly advanceTopN: number;
  readonly advanceMinPoints: number;
}
export type MatchFormat = 'Bo1' | 'Bo3' | '1 Game' | 'Bo5';
export interface Territory {
  readonly id: string;
  readonly labelKey: string;
  readonly invites?: readonly StepRow[];
  readonly dividePer?: number;
  readonly inviteCap?: number;
  readonly roundsTable?: readonly StepRow[];
  readonly cut?: CutSpec;
}
export interface Preset {
  readonly id: string;
  readonly labelKey: string;
  readonly matchFormat: MatchFormat;
  readonly points: { readonly win: number; readonly draw: number; readonly loss: number };
  readonly drawsAllowed: boolean;
  readonly roundsTable: readonly StepRow[];
  readonly publishedPlayerLimit?: number;
  readonly cut: CutSpec;
  readonly invites?: readonly StepRow[];
  readonly bye: { readonly points: number; readonly tiebreakRule: ByeTiebreakRule };
  readonly mwpFloor?: number;
  readonly tiebreakerKeys: readonly string[];
  readonly territories?: readonly Territory[];
  readonly dayTwo?: readonly DayTwoRow[];
  readonly editable?: boolean;
}
export interface FieldBucket {
  readonly wins: number;
  readonly losses: number;
  readonly expected: number;
  readonly madeCut: boolean;
  readonly bubble: boolean;
}
export interface StructureResult {
  readonly players: number;
  readonly rounds: number;
  readonly cutSize: number;
  readonly inviteSpots: number;
  readonly field: readonly FieldBucket[];
  readonly cutLineWins: number | null;
  readonly byInvites: boolean;
  readonly dayTwo: DayTwoRow | null;
}
export type RoundOutcome = 'W' | 'L' | 'D' | 'DL' | 'BYE';
export interface SimInput {
  readonly preset: Preset;
  readonly players: number;
  readonly doubleLossRate: number;
  readonly drawRate?: number;
  readonly results: readonly RoundOutcome[];
  readonly iterations: number;
  readonly seed?: number;
  readonly cut?: {
    readonly afterRound: number;
    readonly advanceTopN: number;
    readonly advanceMinPoints: number;
  };
}
export interface SimOutput {
  readonly iterations: number;
  readonly roundsPlayed: number;
  readonly record: {
    readonly wins: number;
    readonly losses: number;
    readonly draws: number;
    readonly doubleLosses: number;
    readonly points: number;
  };
  readonly fieldSize: number;
  readonly rankMean: number;
  readonly rankBest: number;
  readonly rankWorst: number;
  readonly bracketSizeMean: number;
  readonly bracketRankMean: number;
  readonly bracketPercentile: number;
  readonly omwMean: number;
  readonly ranks: readonly number[];
}

export declare const SPORT_PRESETS: readonly Preset[];
export declare const PRESETS: readonly Preset[];
export declare const ALL_PRESETS: readonly Preset[];
export declare function getPreset(id: string): Preset | undefined;
export declare function resolveStep(table: readonly StepRow[], players: number): number;
export declare function resolveDayTwo(preset: Preset, players: number): DayTwoRow | null;
export declare function wcqPointsFirst(preset: Preset, players: number, territory?: Territory): number | null;
export declare function resolveTournamentGameParam(raw: string | null | undefined): string | null;
export declare function parseTournamentLocationGame(search: string, hash: string): string | null;
export declare function binomial(n: number, k: number): number;
export declare function resolveInviteSpots(preset: Preset, players: number, territory?: Territory): number;
export declare function computeStructure(
  preset: Preset,
  players: number,
  territory?: Territory,
  overrides?: { rounds?: number; cutSize?: number; doubleLossRate?: number; drawRate?: number }
): StructureResult;
export declare function exportScheduleCsv(structure: StructureResult): string;
export declare function exportScheduleText(structure: StructureResult): string;
export declare function exportBracketCsv(cutSize: number): string;
export declare function exportBracketText(cutSize: number): string;
export declare const MAX_SIMULATED_PLAYERS: number;
export declare function recordOf(results: readonly RoundOutcome[], preset: Preset): {
  wins: number;
  losses: number;
  draws: number;
  doubleLosses: number;
  points: number;
  lossRoundSquares: number;
};
export declare function probRankAtMost(out: SimOutput, n: number): number;
export declare function simulate(input: SimInput): SimOutput;
