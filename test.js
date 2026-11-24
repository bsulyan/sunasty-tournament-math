import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getPreset,
  computeStructure,
  exportBracketCsv,
  simulate,
  probRankAtMost,
  wcqPointsFirst,
} from './index.js';

test('MTG 64-player structure resolves 6 Swiss rounds and Top 8', () => {
  const mtg = getPreset('mtg');
  assert.ok(mtg);
  const res = computeStructure(mtg, 64);
  assert.equal(res.rounds, 6);
  assert.equal(res.cutSize, 8);
  assert.equal(res.cutLineWins, 4);
});

test('Yu-Gi-Oh Regional Europe vs Americas invites and WCQ points', () => {
  const ygo = getPreset('ygo-regional');
  assert.ok(ygo && ygo.territories);
  const eu = ygo.territories.find((t) => t.id === 'europe');
  const res = computeStructure(ygo, 128, eu);
  assert.equal(res.byInvites, true);
  assert.equal(res.inviteSpots, 16);
  assert.equal(wcqPointsFirst(ygo, 128, eu), 16);
});

test('Monte-Carlo simulation is deterministic with fixed seed and exports bracket', () => {
  const mtg = getPreset('mtg');
  const out = simulate({
    preset: mtg,
    players: 32,
    doubleLossRate: 0,
    drawRate: 0.05,
    results: ['W', 'W', 'L', 'W', 'W'],
    iterations: 40,
    seed: 12345,
  });
  assert.equal(out.record.points, 12);
  assert.ok(probRankAtMost(out, 8) > 0.5);
  assert.match(exportBracketCsv(8), /Seed 1,Seed 8/);
});
