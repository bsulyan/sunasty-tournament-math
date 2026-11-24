import { resolveStep, resolveDayTwo } from './presets.js';

export function binomial(n, k) {
  if (k < 0 || k > n || n < 0) return 0;
  if (k === 0 || k === n) return 1;
  const limit = Math.min(k, n - k);
  let total = 1;
  let step = 1;
  while (step <= limit) {
    total = (total * (n - step + 1)) / step;
    step += 1;
  }
  return Math.round(total);
}

export function resolveInviteSpots(preset, players, territory) {
  if (territory) {
    if (territory.dividePer && territory.dividePer > 0) {
      const spots = players > 0 ? Math.ceil(players / territory.dividePer) : 0;
      return territory.inviteCap === undefined ? spots : Math.min(spots, territory.inviteCap);
    }
    if (territory.invites) return resolveStep(territory.invites, players);
  }
  if (preset.invites) return resolveStep(preset.invites, players);
  return 0;
}

function expectedField(players, rounds, winProb) {
  const p = Math.min(1, Math.max(0, winProb));
  const out = [];
  for (let wins = rounds; wins >= 0; wins -= 1) {
    out.push(players * binomial(rounds, wins) * Math.pow(p, wins) * Math.pow(1 - p, rounds - wins));
  }
  return out;
}

function determineRounds(preset, safePlayers, territory, overrideRounds) {
  return overrideRounds !== undefined && overrideRounds >= 0
    ? Math.floor(overrideRounds)
    : resolveStep(territory?.roundsTable ?? preset.roundsTable, safePlayers);
}

function determineCutSize(effectiveCut, safePlayers, overrideCutSize) {
  if (overrideCutSize !== undefined && overrideCutSize >= 0) {
    return Math.floor(overrideCutSize);
  }
  return effectiveCut.kind === 'table' ? resolveStep(effectiveCut.table, safePlayers) : 0;
}

function buildFieldBuckets(expected, rounds, spots) {
  const field = [];
  let cutLineWins = null;
  let acc = 0;
  for (let i = 0; i < expected.length; i += 1) {
    const wins = rounds - i;
    const exp = expected[i];
    const before = acc;
    acc += exp;
    let madeCut = false;
    let bubble = false;
    if (spots > 0) {
      if (acc <= spots + 1e-9) madeCut = true;
      else if (before < spots - 1e-9) bubble = true;
    }
    if (madeCut || bubble) cutLineWins = wins;
    field.push({ wins, losses: i, expected: exp, madeCut, bubble });
  }
  return { field, cutLineWins };
}

function computeMatchRates(doubleLossRate, drawRate) {
  const pD = Math.min(1, Math.max(0, drawRate ?? 0));
  const pDL = Math.min(1 - pD, Math.max(0, doubleLossRate ?? 0));
  const pW = (1 - pD - pDL) / 2;
  return { pW, pD };
}

function expectedFieldWithDraws(players, rounds, pW, pD, winPoints, drawPoints) {
  const pL = Math.max(0, 1 - pW - pD);
  const unit = Math.max(1, winPoints);
  const buckets = new Array(rounds + 1).fill(0);
  for (let w = 0; w <= rounds; w += 1) {
    for (let d = 0; d <= rounds - w; d += 1) {
      const l = rounds - w - d;
      const coeff = binomial(rounds, w) * binomial(rounds - w, d);
      const prob = coeff * Math.pow(pW, w) * Math.pow(pD, d) * Math.pow(pL, l);
      const pts = w * winPoints + d * drawPoints;
      const effWins = Math.min(rounds, Math.max(0, Math.floor(pts / unit)));
      buckets[rounds - effWins] += players * prob;
    }
  }
  return buckets;
}

export function computeStructure(preset, players, territory, overrides) {
  const safePlayers = Math.max(0, Math.floor(players));
  const rounds = determineRounds(preset, safePlayers, territory, overrides?.rounds);
  const { pW, pD } = computeMatchRates(overrides?.doubleLossRate, overrides?.drawRate);

  const effectiveCut = territory?.cut ?? preset.cut;
  const byInvites = effectiveCut.kind === 'none';
  const inviteSpots = resolveInviteSpots(preset, safePlayers, territory);
  const cutSize = determineCutSize(effectiveCut, safePlayers, overrides?.cutSize);

  const spots = byInvites ? inviteSpots : cutSize;
  const expected =
    pD > 0
      ? expectedFieldWithDraws(safePlayers, rounds, pW, pD, preset.points.win, preset.points.draw)
      : expectedField(safePlayers, rounds, pW);
  const { field, cutLineWins } = buildFieldBuckets(expected, rounds, spots);

  return {
    players: safePlayers,
    rounds,
    cutSize,
    inviteSpots,
    field,
    cutLineWins,
    byInvites,
    dayTwo: resolveDayTwo(preset, safePlayers),
  };
}

export function exportScheduleCsv(structure) {
  const lines = ['Wins,Losses,Expected Players,Status'];
  for (const b of structure.field) {
    const status = b.madeCut ? 'Qualified' : b.bubble ? 'Bubble' : 'Eliminated';
    lines.push(`${b.wins},${b.losses},${b.expected.toFixed(2)},${status}`);
  }
  return lines.join('\n');
}

export function exportScheduleText(structure) {
  const lines = [
    `Tournament Structure: ${structure.players} Players, ${structure.rounds} Swiss Rounds`,
    structure.cutSize > 0
      ? `Top Cut: Top ${structure.cutSize} Single Elimination`
      : 'Swiss-Only (No Top Cut)',
    '--------------------------------------------------',
    'Record | Expected Players | Status',
    '--------------------------------------------------',
  ];
  for (const b of structure.field) {
    const status = b.madeCut ? 'In' : b.bubble ? 'Bubble' : 'Out';
    lines.push(`${b.wins}-${b.losses} | ${b.expected.toFixed(1).padStart(5, ' ')} | ${status}`);
  }
  return lines.join('\n');
}

function buildCrossSeedOrder(bracketSize) {
  let seeds = [1, 2];
  while (seeds.length < bracketSize) {
    const sum = seeds.length * 2 + 1;
    seeds = seeds.flatMap((s) => [s, sum - s]);
  }
  return seeds;
}

function buildBracketRounds(cutSize) {
  const roundsCount = Math.ceil(Math.log2(cutSize));
  const bracketSize = Math.pow(2, roundsCount);
  const seedOrder = buildCrossSeedOrder(bracketSize);
  const result = [];
  let nextMatchId = 1;

  const r1Matches = [];
  for (let m = 1; m <= bracketSize / 2; m += 1) {
    const sA = seedOrder[2 * m - 2];
    const sB = seedOrder[2 * m - 1];
    r1Matches.push({
      round: 1,
      match: m,
      matchId: nextMatchId++,
      slotA: `Seed ${sA}`,
      slotB: sB <= cutSize ? `Seed ${sB}` : 'BYE',
    });
  }
  result.push({ round: 1, matchCount: r1Matches.length, matches: r1Matches });

  let prevMatches = r1Matches;
  for (let r = 2; r <= roundsCount; r += 1) {
    const count = prevMatches.length / 2;
    const matches = [];
    for (let m = 1; m <= count; m += 1) {
      const feederA = prevMatches[2 * m - 2];
      const feederB = prevMatches[2 * m - 1];
      matches.push({
        round: r,
        match: m,
        matchId: nextMatchId++,
        slotA: `Winner M${feederA.matchId}`,
        slotB: `Winner M${feederB.matchId}`,
      });
    }
    result.push({ round: r, matchCount: count, matches });
    prevMatches = matches;
  }
  return result;
}

export function exportBracketCsv(cutSize) {
  if (cutSize < 2) return 'Round,Match,SeedA,SeedB';
  const matchRows = buildBracketRounds(cutSize).flatMap((info) =>
    info.matches.map((m) => `Round ${m.round},Match ${m.match},${m.slotA},${m.slotB}`),
  );
  return ['Round,Match,SeedA,SeedB', ...matchRows].join('\n');
}

export function exportBracketText(cutSize) {
  if (cutSize < 2) return 'No playoff bracket for this tournament size.';
  const rows = [`Playoff Bracket (Top ${cutSize})`];
  for (const info of buildBracketRounds(cutSize)) {
    rows.push(`--- Round ${info.round} (${info.matchCount} Match${info.matchCount > 1 ? 'es' : ''}) ---`);
    for (const m of info.matches) {
      rows.push(`  Match ${m.match}: ${m.slotA} vs ${m.slotB}`);
    }
  }
  return rows.join('\n');
}
