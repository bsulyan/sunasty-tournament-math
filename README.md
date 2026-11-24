# @sunasty/tournament-math

Zero-dependency Swiss tournament structure calculator, official TCG round/cut presets (Magic: The Gathering, Pokemon TCG, Yu-Gi-Oh!, Disney Lorcana, One Piece TCG, Flesh & Blood, FIDE Chess, Esports), playoff bracket seed generator, and deterministic Monte-Carlo tiebreaker estimator.

Extracted from the core engine powering [Sunasty Tournament Calculator](https://sunasty.com/tournament-calculator/) and [Sunasty Swiss Tournament Generator](https://sunasty.com/swiss-tournament-generator/).

## Features

- **Audited Game Presets**: Official stepped round tables, top cuts, regional invite rules, points, and bye tiebreaker policies (`getPreset`, `PRESETS`, `SPORT_PRESETS`).
- **Expected Field & Cut Line**: `computeStructure` computes binomial / draw-adjusted win-loss field buckets, exact Top Cut spots, bubble records, and Yu-Gi-Oh! WCQ points (`wcqPointsFirst`).
- **Bracket Pairing Order**: `exportBracketCsv` and `exportBracketText` emit proper standard cross-seeded brackets (1v8, 4v5, 2v7, 3v6) with automatic BYE placement.
- **Monte-Carlo Standing Estimator**: `simulate` pairs a seeded Swiss field using each game's OMW%/OOMW%/loss-round-squares tiebreakers to estimate top-cut odds (`probRankAtMost`).

## Installation

```bash
npm install @sunasty/tournament-math
# or via JSR
npx jsr add @sunasty/tournament-math
```

## Usage

```js
import { getPreset, computeStructure, simulate, probRankAtMost } from '@sunasty/tournament-math';

const mtg = getPreset('mtg');
const structure = computeStructure(mtg, 64);
console.log(structure.rounds, structure.cutSize); // 6, 8

const sim = simulate({
  preset: mtg,
  players: 64,
  doubleLossRate: 0,
  drawRate: 0.05,
  results: ['W', 'W', 'W', 'L', 'W', 'L'],
  iterations: 200,
});
console.log('Top 8 probability:', probRankAtMost(sim, 8));
```

## Related Web Tools

- Swiss rounds, cut odds & tiebreaker simulator: [https://sunasty.com/tournament-calculator/](https://sunasty.com/tournament-calculator/)
- Pairings & standings generator: [https://sunasty.com/swiss-tournament-generator/](https://sunasty.com/swiss-tournament-generator/)

## License

MIT
