function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tiebreakValue(p, key) {
  if (key === 'mwp' || key === 'gwp') return p.mwp;
  if (key === 'oomw' || key === 'oowp' || key === 'ogw') return p.oomw;
  if (key === 'lossRoundSquares') return p.lossRoundSquares;
  return p.omw;
}

function compare(a, b, keys, byeRule) {
  if (b.points !== a.points) return b.points - a.points;
  if (byeRule === 'worse-than-draw-if-losses') {
    const penA = a.losses > 0 ? a.byes : 0;
    const penB = b.losses > 0 ? b.byes : 0;
    if (penA !== penB) return penA - penB;
  }
  for (const key of keys) {
    const d = tiebreakValue(b, key) - tiebreakValue(a, key);
    if (Math.abs(d) > 1e-12) return d;
  }
  return 0;
}

function initField(count) {
  const field = [];
  for (let i = 0; i < count; i += 1) {
    field.push({
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      byes: 0,
      opp: [],
      mwp: 0,
      omw: 0,
      oomw: 0,
      lossRoundSquares: 0,
      isUser: i === 0,
    });
  }
  return field;
}

function recordWin(p, preset) { p.wins += 1; p.points += preset.points.win; }
function recordBye(p, preset) { p.wins += 1; p.byes += 1; p.points += preset.bye.points; }
function recordLoss(p, preset, round) {
  p.losses += 1;
  p.points += preset.points.loss;
  p.lossRoundSquares += round * round;
}
function recordDraw(p, preset) { p.draws += 1; p.points += preset.points.draw; }

function playFieldMatch(a, b, ai, bi, round, preset, drawRate, doubleLossRate, rng) {
  a.opp.push(bi);
  b.opp.push(ai);
  if (drawRate > 0 && rng() < drawRate) {
    recordDraw(a, preset);
    recordDraw(b, preset);
    return;
  }
  if (doubleLossRate > 0 && rng() < doubleLossRate) {
    recordLoss(a, preset, round);
    recordLoss(b, preset, round);
    return;
  }
  if (rng() < 0.5) {
    recordWin(a, preset);
    recordLoss(b, preset, round);
  } else {
    recordLoss(a, preset, round);
    recordWin(b, preset);
  }
}

function computeMwp(field, winPoints) {
  for (const p of field) {
    const played = p.wins + p.losses + p.draws;
    p.mwp = played > 0 ? p.points / (winPoints * played) : 0;
  }
}

function computeOmw(field, floor) {
  for (const p of field) {
    if (p.opp.length === 0) {
      p.omw = floor;
    } else {
      let s = 0;
      for (const oi of p.opp) s += Math.max(field[oi].mwp, floor);
      p.omw = s / p.opp.length;
    }
  }
}

function computeOomw(field, floor) {
  for (const p of field) {
    if (p.opp.length === 0) {
      p.oomw = floor;
    } else {
      let s = 0;
      for (const oi of p.opp) s += field[oi].omw;
      p.oomw = s / p.opp.length;
    }
  }
}

function recomputeTiebreakers(field, preset) {
  const floor = preset.mwpFloor ?? 0;
  computeMwp(field, preset.points.win);
  computeOmw(field, floor);
  computeOomw(field, floor);
}

function applyDay2Cut(field, active, cut, preset) {
  recomputeTiebreakers(field, preset);
  const standing = field
    .map((_, i) => i)
    .sort((x, y) => compare(field[x], field[y], preset.tiebreakerKeys, preset.bye.tiebreakRule));
  active.fill(false);
  for (let pos = 0; pos < standing.length; pos += 1) {
    const idx = standing[pos];
    if (pos < cut.advanceTopN || field[idx].points >= cut.advanceMinPoints) active[idx] = true;
  }
}

function findOpponentForUser(field, order, used) {
  const uPts = field[0].points;
  let opp = -1;
  let fallback = -1;
  let bestDelta = Infinity;
  for (const idx of order) {
    if (idx === 0 || used[idx]) continue;
    if (fallback === -1) fallback = idx;
    if (field[0].opp.includes(idx)) continue;
    const delta = Math.abs(field[idx].points - uPts);
    if (delta < bestDelta) {
      bestDelta = delta;
      opp = idx;
    }
  }
  return opp !== -1 ? opp : fallback;
}

function applyUserOutcome(field, opp, res, round, preset) {
  field[0].opp.push(opp);
  field[opp].opp.push(0);
  if (res === 'W') { recordWin(field[0], preset); recordLoss(field[opp], preset, round); }
  else if (res === 'L') { recordLoss(field[0], preset, round); recordWin(field[opp], preset); }
  else if (res === 'D') { recordDraw(field[0], preset); recordDraw(field[opp], preset); }
  else { recordLoss(field[0], preset, round); recordLoss(field[opp], preset, round); }
}

function resolveUserMatch(field, used, order, res, round, preset) {
  if (res === 'BYE') {
    recordBye(field[0], preset);
    used[0] = true;
    return;
  }
  const opp = findOpponentForUser(field, order, used);
  if (opp === -1) {
    recordBye(field[0], preset);
    used[0] = true;
    return;
  }
  used[0] = true;
  used[opp] = true;
  applyUserOutcome(field, opp, res, round, preset);
}

function findNextOpponent(field, used, rest, startIndex) {
  const a = rest[startIndex];
  let b = -1;
  for (let j = startIndex + 1; j < rest.length; j += 1) {
    const cand = rest[j];
    if (used[cand]) continue;
    if (!field[a].opp.includes(cand)) return cand;
    if (b === -1) b = cand;
  }
  return b;
}

function pairRemainingField(field, used, order, round, preset, drawRate, doubleLossRate, rng) {
  const rest = order.filter((i) => !used[i]);
  let i = 0;
  while (i < rest.length) {
    const a = rest[i];
    if (used[a]) { i += 1; continue; }
    const b = findNextOpponent(field, used, rest, i);
    if (b === -1) {
      recordBye(field[a], preset);
      used[a] = true;
      i += 1;
      continue;
    }
    used[a] = true;
    used[b] = true;
    playFieldMatch(field[a], field[b], a, b, round, preset, drawRate, doubleLossRate, rng);
    i += 1;
  }
}

function computeFinalRankings(field, active, preset) {
  const keys = preset.tiebreakerKeys;
  const byeRule = preset.bye.tiebreakRule;
  const ranked = field
    .map((_, i) => i)
    .sort((x, y) => {
      if (active[x] !== active[y]) return active[x] ? -1 : 1;
      return compare(field[x], field[y], keys, byeRule);
    });
  const rank = ranked.indexOf(0) + 1;

  const u = field[0];
  let bracketSize = 0;
  let bracketRank = 1;
  for (let i = 0; i < field.length; i += 1) {
    const p = field[i];
    if (p.wins === u.wins && p.losses === u.losses) {
      bracketSize += 1;
      if (i !== 0 && compare(p, u, keys, byeRule) < 0) bracketRank += 1;
    }
  }
  return { rank, bracketRank, bracketSize, omw: u.omw };
}

export const MAX_SIMULATED_PLAYERS = 4096;

function simulateOnce(input, rng) {
  const { preset, players, doubleLossRate, results, cut } = input;
  const drawRate = input.drawRate ?? 0;
  const P = Math.min(MAX_SIMULATED_PLAYERS, Math.max(1, Math.floor(players)));
  const field = initField(P);
  const active = new Array(P).fill(true);

  for (let r = 0; r < results.length; r += 1) {
    const round = r + 1;
    if (cut && r === cut.afterRound) applyDay2Cut(field, active, cut, preset);

    const order = [];
    for (let i = 0; i < P; i += 1) if (active[i]) order.push(i);
    order.sort((x, y) => (field[y].points - field[x].points) || (rng() - 0.5));
    const used = active.map((a) => !a);

    if (active[0]) resolveUserMatch(field, used, order, results[r], round, preset);
    pairRemainingField(field, used, order, round, preset, drawRate, doubleLossRate, rng);
  }

  recomputeTiebreakers(field, preset);
  return computeFinalRankings(field, active, preset);
}

export function recordOf(results, preset) {
  let wins = 0, losses = 0, draws = 0, doubleLosses = 0, points = 0, lossRoundSquares = 0;
  for (let index = 0; index < results.length; index += 1) {
    const r = results[index];
    if (r === 'W' || r === 'BYE') {
      wins += 1;
      points += r === 'BYE' ? preset.bye.points : preset.points.win;
    } else if (r === 'D') {
      draws += 1;
      points += preset.points.draw;
    } else if (r === 'DL') {
      doubleLosses += 1;
      losses += 1;
      points += preset.points.loss;
      lossRoundSquares += (index + 1) ** 2;
    } else {
      losses += 1;
      points += preset.points.loss;
      lossRoundSquares += (index + 1) ** 2;
    }
  }
  return { wins, losses, draws, doubleLosses, points, lossRoundSquares };
}

export function probRankAtMost(out, n) {
  if (out.ranks.length === 0 || n <= 0) return 0;
  let c = 0;
  for (const r of out.ranks) if (r <= n) c += 1;
  return c / out.ranks.length;
}

export function simulate(input) {
  const iterations = Math.max(1, Math.floor(input.iterations));
  const rounds = input.results.length;
  const rng = mulberry32(input.seed ?? 0x9e3779b9);
  const fieldSize = Math.min(MAX_SIMULATED_PLAYERS, Math.max(1, Math.floor(input.players)));

  const ranks = [];
  let rankSum = 0, rankBest = Infinity, rankWorst = 0;
  let bracketRankSum = 0, bracketSizeSum = 0, omwSum = 0, pctSum = 0;
  for (let it = 0; it < iterations; it += 1) {
    const o = simulateOnce(input, rng);
    ranks.push(o.rank);
    rankSum += o.rank;
    if (o.rank < rankBest) rankBest = o.rank;
    if (o.rank > rankWorst) rankWorst = o.rank;
    bracketRankSum += o.bracketRank;
    bracketSizeSum += o.bracketSize;
    omwSum += o.omw;
    pctSum += o.bracketSize > 1 ? 1 - (o.bracketRank - 1) / (o.bracketSize - 1) : 1;
  }
  ranks.sort((a, b) => a - b);

  return {
    iterations,
    roundsPlayed: rounds,
    record: recordOf(input.results, input.preset),
    fieldSize,
    rankMean: rankSum / iterations,
    rankBest,
    rankWorst,
    bracketSizeMean: bracketSizeSum / iterations,
    bracketRankMean: bracketRankSum / iterations,
    bracketPercentile: pctSum / iterations,
    omwMean: omwSum / iterations,
    ranks,
  };
}
