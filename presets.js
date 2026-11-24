function log2RoundsTable() {
  const rows = [];
  for (let r = 2; r <= 11; r += 1) {
    rows.push({ maxPlayers: 2 ** r, value: r });
  }
  return rows;
}

const MTG = {
  id: 'mtg',
  labelKey: 'mtg',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 1, loss: 0 },
  drawsAllowed: true,
  roundsTable: log2RoundsTable(),
  cut: {
    kind: 'table',
    table: [
      { maxPlayers: 7, value: 0 },
      { maxPlayers: 16, value: 4 },
      { maxPlayers: Infinity, value: 8 },
    ],
  },
  bye: { points: 3, tiebreakRule: 'win' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: ['mwp', 'omw', 'gwp', 'ogw'],
};

const POKEMON = {
  id: 'pokemon',
  labelKey: 'pokemon',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 1, loss: 0 },
  drawsAllowed: true,
  roundsTable: [
    { maxPlayers: 8, value: 3 },
    { maxPlayers: 12, value: 4 },
    { maxPlayers: 32, value: 5 },
    { maxPlayers: 64, value: 6 },
    { maxPlayers: 128, value: 7 },
    { maxPlayers: 226, value: 8 },
    { maxPlayers: 409, value: 9 },
    { maxPlayers: Infinity, value: 10 },
  ],
  cut: {
    kind: 'table',
    table: [
      { maxPlayers: 8, value: 0 },
      { maxPlayers: 20, value: 4 },
      { maxPlayers: Infinity, value: 8 },
    ],
  },
  bye: { points: 3, tiebreakRule: 'win' },
  mwpFloor: 0.25,
  tiebreakerKeys: ['owp', 'oowp'],
};

const LORCANA = {
  id: 'lorcana',
  labelKey: 'lorcana',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 1, loss: 0 },
  drawsAllowed: true,
  roundsTable: [
    { maxPlayers: 8, value: 3 },
    { maxPlayers: 16, value: 4 },
    { maxPlayers: 32, value: 5 },
    { maxPlayers: 64, value: 6 },
    { maxPlayers: 128, value: 7 },
    { maxPlayers: 226, value: 8 },
    { maxPlayers: Infinity, value: 9 },
  ],
  cut: {
    kind: 'table',
    table: [
      { maxPlayers: 8, value: 0 },
      { maxPlayers: 16, value: 4 },
      { maxPlayers: Infinity, value: 8 },
    ],
  },
  bye: { points: 3, tiebreakRule: 'win' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: ['omw', 'oomw'],
};

const ONE_PIECE = {
  id: 'one-piece',
  labelKey: 'onePiece',
  matchFormat: 'Bo1',
  points: { win: 3, draw: 1, loss: 0 },
  drawsAllowed: true,
  roundsTable: [
    { maxPlayers: 8, value: 3 },
    { maxPlayers: 16, value: 4 },
    { maxPlayers: 32, value: 5 },
    { maxPlayers: 64, value: 6 },
    { maxPlayers: 128, value: 7 },
    { maxPlayers: 256, value: 8 },
    { maxPlayers: 512, value: 9 },
    { maxPlayers: 1024, value: 10 },
    { maxPlayers: 2048, value: 11 },
  ],
  publishedPlayerLimit: 2048,
  cut: {
    kind: 'table',
    table: [
      { maxPlayers: 8, value: 0 },
      { maxPlayers: 16, value: 2 },
      { maxPlayers: 32, value: 4 },
      { maxPlayers: 128, value: 8 },
      { maxPlayers: 512, value: 16 },
      { maxPlayers: 2048, value: 32 },
    ],
  },
  bye: { points: 3, tiebreakRule: 'win' },
  mwpFloor: 0,
  tiebreakerKeys: ['omw', 'oomw'],
};

const FAB = {
  id: 'fab',
  labelKey: 'fab',
  matchFormat: 'Bo1',
  points: { win: 1, draw: 0, loss: 0 },
  drawsAllowed: true,
  roundsTable: [
    { maxPlayers: 8, value: 3 },
    { maxPlayers: 16, value: 5 },
    { maxPlayers: 32, value: 5 },
    { maxPlayers: 64, value: 6 },
    { maxPlayers: 128, value: 7 },
    { maxPlayers: 224, value: 8 },
    { maxPlayers: 384, value: 9 },
    { maxPlayers: 736, value: 10 },
    { maxPlayers: Infinity, value: 11 },
  ],
  cut: {
    kind: 'table',
    table: [
      { maxPlayers: 8, value: 0 },
      { maxPlayers: 16, value: 4 },
      { maxPlayers: Infinity, value: 8 },
    ],
  },
  bye: { points: 1, tiebreakRule: 'worse-than-draw-if-losses' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: ['losspct', 'opponentWinPct'],
};

const YGO_TIER12_ROUNDS = [
  { maxPlayers: 8, value: 3 },
  { maxPlayers: 16, value: 4 },
  { maxPlayers: 32, value: 5 },
  { maxPlayers: 64, value: 6 },
  { maxPlayers: 128, value: 7 },
  { maxPlayers: 256, value: 8 },
  { maxPlayers: 512, value: 9 },
  { maxPlayers: 1024, value: 10 },
  { maxPlayers: 2048, value: 11 },
  { maxPlayers: Infinity, value: 12 },
];

const YGO_REGIONAL_ROUNDS = [
  { maxPlayers: 8, value: 3 },
  { maxPlayers: 16, value: 4 },
  { maxPlayers: 32, value: 5 },
  { maxPlayers: 64, value: 6 },
  { maxPlayers: 128, value: 7 },
  { maxPlayers: 256, value: 8 },
  { maxPlayers: 512, value: 9 },
  { maxPlayers: Infinity, value: 10 },
];

const YGO_NA_OTS_ROUNDS = [
  { maxPlayers: 8, value: 3 },
  { maxPlayers: 16, value: 4 },
  { maxPlayers: 32, value: 5 },
  { maxPlayers: 64, value: 6 },
  { maxPlayers: Infinity, value: 7 },
];

const YGO_NA_OTS_CUT = {
  kind: 'table',
  table: [
    { maxPlayers: 8, value: 0 },
    { maxPlayers: 16, value: 4 },
    { maxPlayers: 128, value: 8 },
    { maxPlayers: Infinity, value: 16 },
  ],
};

const YGO_TIER12_CUT = [
  { maxPlayers: 8, value: 0 },
  { maxPlayers: 32, value: 4 },
  { maxPlayers: Infinity, value: 8 },
];

const YGO_TIER34_ROUNDS = [
  { maxPlayers: 256, value: 11 },
  { maxPlayers: 512, value: 12 },
  { maxPlayers: 1024, value: 13 },
  { maxPlayers: 2048, value: 14 },
  { maxPlayers: Infinity, value: 15 },
];

const YGO_TIEBREAKERS = ['omw', 'oomw', 'lossRoundSquares'];

const YGO_LOCAL = {
  id: 'ygo-local',
  labelKey: 'ygoLocal',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: YGO_TIER12_ROUNDS,
  cut: { kind: 'table', table: YGO_TIER12_CUT },
  bye: { points: 3, tiebreakRule: 'best-result' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: YGO_TIEBREAKERS,
};

const YGO_OTS = {
  id: 'ygo-ots',
  labelKey: 'ygoOts',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: YGO_TIER12_ROUNDS,
  cut: { kind: 'none' },
  bye: { points: 3, tiebreakRule: 'best-result' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: YGO_TIEBREAKERS,
  territories: [
    {
      id: 'europe',
      labelKey: 'europe',
      invites: [{ maxPlayers: Infinity, value: 2 }],
      roundsTable: YGO_TIER12_ROUNDS,
      cut: { kind: 'none' },
    },
    {
      id: 'americas',
      labelKey: 'americas',
      invites: [{ maxPlayers: Infinity, value: 4 }],
      roundsTable: YGO_NA_OTS_ROUNDS,
      cut: YGO_NA_OTS_CUT,
    },
  ],
};

const YGO_AMERICAS_INVITES = [
  { maxPlayers: 49, value: 4 },
  { maxPlayers: 99, value: 8 },
  { maxPlayers: 149, value: 16 },
  { maxPlayers: 199, value: 24 },
  { maxPlayers: 299, value: 32 },
  { maxPlayers: 499, value: 48 },
  { maxPlayers: Infinity, value: 64 },
];

const YGO_REGIONAL = {
  id: 'ygo-regional',
  labelKey: 'ygoRegional',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: YGO_REGIONAL_ROUNDS,
  cut: { kind: 'none' },
  bye: { points: 3, tiebreakRule: 'best-result' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: YGO_TIEBREAKERS,
  territories: [
    { id: 'europe', labelKey: 'europe', dividePer: 8, inviteCap: 64 },
    { id: 'americas', labelKey: 'americas', invites: YGO_AMERICAS_INVITES },
  ],
};

const YGO_YCS = {
  id: 'ygo-ycs',
  labelKey: 'ygoYcs',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: YGO_TIER34_ROUNDS,
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 3, tiebreakRule: 'best-result' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: YGO_TIEBREAKERS,
};

const YGO_TOPCUT_22 = [
  { maxPlayers: 8, value: 0 },
  { maxPlayers: 32, value: 4 },
  { maxPlayers: 128, value: 8 },
  { maxPlayers: 512, value: 16 },
  { maxPlayers: 2048, value: 32 },
  { maxPlayers: Infinity, value: 64 },
];

const YGO_NATIONAL_CUT = [
  { maxPlayers: 128, value: 16 },
  { maxPlayers: 256, value: 32 },
  { maxPlayers: 512, value: 64 },
  { maxPlayers: Infinity, value: 128 },
];

const YGO_NATIONAL = {
  id: 'ygo-national',
  labelKey: 'ygoNational',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: YGO_TIER34_ROUNDS,
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 3, tiebreakRule: 'best-result' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: YGO_TIEBREAKERS,
};

const YGO_CONTINENTAL = {
  id: 'ygo-continental',
  labelKey: 'ygoContinental',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: YGO_TIER34_ROUNDS,
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 3, tiebreakRule: 'best-result' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: YGO_TIEBREAKERS,
};

const GENERIC = {
  id: 'generic',
  labelKey: 'generic',
  matchFormat: 'Bo3',
  points: { win: 3, draw: 1, loss: 0 },
  drawsAllowed: true,
  roundsTable: log2RoundsTable(),
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 3, tiebreakRule: 'win' },
  mwpFloor: 1 / 3,
  tiebreakerKeys: ['omw', 'oomw'],
  editable: true,
};

const CHESS_FIDE = {
  id: 'chess-fide',
  labelKey: 'chessFide',
  matchFormat: '1 Game',
  points: { win: 1, draw: 0.5, loss: 0 },
  drawsAllowed: true,
  roundsTable: [
    { maxPlayers: 10, value: 5 },
    { maxPlayers: 20, value: 6 },
    { maxPlayers: 40, value: 7 },
    { maxPlayers: 80, value: 8 },
    { maxPlayers: 150, value: 9 },
    { maxPlayers: 300, value: 10 },
    { maxPlayers: Infinity, value: 11 },
  ],
  cut: { kind: 'none' },
  bye: { points: 1, tiebreakRule: 'win' },
  mwpFloor: 0,
  tiebreakerKeys: ['omw', 'oomw'],
};

const TABLE_TENNIS = {
  id: 'table-tennis',
  labelKey: 'tableTennis',
  matchFormat: 'Bo5',
  points: { win: 2, draw: 0, loss: 1 },
  drawsAllowed: false,
  roundsTable: log2RoundsTable(),
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 2, tiebreakRule: 'win' },
  mwpFloor: 0,
  tiebreakerKeys: ['mwp', 'omw'],
};

const ESPORTS_SWISS_BO1 = {
  id: 'esports-swiss-bo1',
  labelKey: 'esportsSwissBo1',
  matchFormat: 'Bo1',
  points: { win: 1, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: log2RoundsTable(),
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 1, tiebreakRule: 'win' },
  mwpFloor: 0,
  tiebreakerKeys: ['omw', 'oomw', 'mwp'],
};

const ESPORTS_SWISS_BO3 = {
  id: 'esports-swiss-bo3',
  labelKey: 'esportsSwissBo3',
  matchFormat: 'Bo3',
  points: { win: 1, draw: 0, loss: 0 },
  drawsAllowed: false,
  roundsTable: log2RoundsTable(),
  cut: { kind: 'table', table: [{ maxPlayers: Infinity, value: 8 }] },
  bye: { points: 1, tiebreakRule: 'win' },
  mwpFloor: 0,
  tiebreakerKeys: ['omw', 'oomw', 'mwp'],
};

export const SPORT_PRESETS = [CHESS_FIDE, TABLE_TENNIS, ESPORTS_SWISS_BO1, ESPORTS_SWISS_BO3];
export const PRESETS = [
  MTG,
  POKEMON,
  LORCANA,
  ONE_PIECE,
  FAB,
  YGO_LOCAL,
  YGO_OTS,
  YGO_REGIONAL,
  YGO_YCS,
  YGO_NATIONAL,
  YGO_CONTINENTAL,
  GENERIC,
];
export const ALL_PRESETS = [...PRESETS, ...SPORT_PRESETS];

export function getPreset(id) {
  return ALL_PRESETS.find((p) => p.id === id);
}

export function resolveStep(table, players) {
  if (table.length === 0 || players <= 0) return 0;
  for (const row of table) {
    if (players <= row.maxPlayers) return row.value;
  }
  return table[table.length - 1].value;
}

export function resolveDayTwo(preset, players) {
  const table = preset.dayTwo;
  if (!table || table.length === 0) return null;
  if (players <= 0) return table[0];
  for (const row of table) {
    if (players <= row.maxPlayers) return row;
  }
  return table[table.length - 1];
}

function computeRegionalWcqPoints(p, territory) {
  if (territory?.dividePer) {
    const points = p > 0 ? Math.ceil(p / territory.dividePer) : 0;
    return territory.inviteCap === undefined ? points : Math.min(points, territory.inviteCap);
  }
  if (territory?.invites) return p > 0 ? resolveStep(territory.invites, p) : 0;
  return null;
}

export function wcqPointsFirst(preset, players, territory) {
  const p = Math.max(0, Math.floor(players));
  if (preset.id === 'ygo-regional') return computeRegionalWcqPoints(p, territory);
  if (preset.id === 'ygo-ots') return territory?.id === 'americas' ? 4 : 2;
  if (preset.id === 'ygo-ycs') {
    const cut = resolveStep(YGO_TOPCUT_22, p);
    return cut > 0 ? 32 + cut : null;
  }
  if (preset.id === 'ygo-national') return resolveStep(YGO_NATIONAL_CUT, p);
  return null;
}

const TOURNAMENT_GAME_ALIASES = {
  yugioh: 'yugioh',
  mtg: 'mtg',
  magic: 'mtg',
  pokemon: 'pokemon',
  lorcana: 'lorcana',
  'one-piece': 'one-piece',
  onepiece: 'one-piece',
  fab: 'fab',
  'flesh-and-blood': 'fab',
  chess: 'chess',
  'table-tennis': 'table-tennis',
  esports: 'esports',
  generic: 'generic',
};

export function resolveTournamentGameParam(raw) {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return TOURNAMENT_GAME_ALIASES[key] ?? null;
}

export function parseTournamentLocationGame(search, hash) {
  const hashClean = hash.startsWith('#') ? hash.slice(1) : hash;
  const hashGame = new URLSearchParams(hashClean).get('game');
  const fromHash = resolveTournamentGameParam(hashGame);
  if (fromHash) return fromHash;
  const searchClean = search.startsWith('?') ? search.slice(1) : search;
  const searchGame = new URLSearchParams(searchClean).get('game');
  return resolveTournamentGameParam(searchGame);
}
