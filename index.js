/* @ts-self-types="./index.d.ts" */
/**
 * sunasty-tournament-math
 *
 * Pure Swiss tournament rounds/top-cut calculator, audited TCG rule presets,
 * bracket seed order builder, and Monte-Carlo tiebreaker estimator.
 * Extracted from https://sunasty.com/tournament-calculator/
 */

export {
  SPORT_PRESETS,
  PRESETS,
  ALL_PRESETS,
  getPreset,
  resolveStep,
  resolveDayTwo,
  wcqPointsFirst,
  resolveTournamentGameParam,
  parseTournamentLocationGame,
} from './presets.js';

export {
  binomial,
  resolveInviteSpots,
  computeStructure,
  exportScheduleCsv,
  exportScheduleText,
  exportBracketCsv,
  exportBracketText,
} from './engine.js';

export {
  MAX_SIMULATED_PLAYERS,
  recordOf,
  probRankAtMost,
  simulate,
} from './simulate.js';
