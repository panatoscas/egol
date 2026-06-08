export interface Match {
  id: string;
  phase: 'grupo' | 'oitavas' | 'quartas' | 'semi' | 'final';
  opponent: string;
  opponentFlag: string;
  date: string;         // ISO date
  time: string;         // horário de Brasília
  stadium: string;
  city: string;
  country: string;      // País sede do jogo
  result?: {
    brazilScore: number;
    opponentScore: number;
    goals: Goal[];
  };
}

export interface Goal {
  id: string;
  player: string;
  minute: number;
  type: 'normal' | 'penalty' | 'contra' | 'falta';
}

/**
 * Jogos do Brasil — Copa do Mundo FIFA 2026
 * Fase de grupos: Grupo C
 */
export const BRAZIL_MATCHES: Match[] = [
  {
    id: 'g1',
    phase: 'grupo',
    opponent: 'México',
    opponentFlag: '🇲🇽',
    date: '2026-06-13',
    time: '18:00',
    stadium: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'EUA',
  },
  {
    id: 'g2',
    phase: 'grupo',
    opponent: 'Camarões',
    opponentFlag: '🇨🇲',
    date: '2026-06-19',
    time: '15:00',
    stadium: 'MetLife Stadium',
    city: 'Nova York',
    country: 'EUA',
  },
  {
    id: 'g3',
    phase: 'grupo',
    opponent: 'Austrália',
    opponentFlag: '🇦🇺',
    date: '2026-06-24',
    time: '21:00',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    country: 'EUA',
  },
  {
    id: 'r16',
    phase: 'oitavas',
    opponent: 'A definir',
    opponentFlag: '🏳️',
    date: '2026-07-01',
    time: 'A definir',
    stadium: 'A definir',
    city: 'A definir',
    country: 'A definir',
  },
  {
    id: 'qf',
    phase: 'quartas',
    opponent: 'A definir',
    opponentFlag: '🏳️',
    date: '2026-07-08',
    time: 'A definir',
    stadium: 'A definir',
    city: 'A definir',
    country: 'A definir',
  },
  {
    id: 'sf',
    phase: 'semi',
    opponent: 'A definir',
    opponentFlag: '🏳️',
    date: '2026-07-14',
    time: 'A definir',
    stadium: 'A definir',
    city: 'A definir',
    country: 'A definir',
  },
  {
    id: 'final',
    phase: 'final',
    opponent: 'A definir',
    opponentFlag: '🏳️',
    date: '2026-07-19',
    time: '17:00',
    stadium: 'MetLife Stadium',
    city: 'Nova York',
    country: 'EUA',
  },
];

// Gols de exemplo para demonstração (feed de gols)
export const MOCK_GOALS: (Goal & { matchId: string; matchInfo: string; timestamp: string })[] = [
  {
    id: 'goal-1',
    matchId: 'g1',
    matchInfo: 'Brasil 🇧🇷 × 🇲🇽 México',
    player: 'Vinicius Jr.',
    minute: 23,
    type: 'normal',
    timestamp: '2026-06-13T21:23:00Z',
  },
  {
    id: 'goal-2',
    matchId: 'g1',
    matchInfo: 'Brasil 🇧🇷 × 🇲🇽 México',
    player: 'Rodrygo',
    minute: 67,
    type: 'normal',
    timestamp: '2026-06-13T23:07:00Z',
  },
  {
    id: 'goal-3',
    matchId: 'g2',
    matchInfo: 'Brasil 🇧🇷 × 🇨🇲 Camarões',
    player: 'Vinicius Jr.',
    minute: 11,
    type: 'normal',
    timestamp: '2026-06-19T18:11:00Z',
  },
  {
    id: 'goal-4',
    matchId: 'g2',
    matchInfo: 'Brasil 🇧🇷 × 🇨🇲 Camarões',
    player: 'Raphinha',
    minute: 34,
    type: 'falta',
    timestamp: '2026-06-19T18:34:00Z',
  },
  {
    id: 'goal-5',
    matchId: 'g2',
    matchInfo: 'Brasil 🇧🇷 × 🇨🇲 Camarões',
    player: 'Endrick',
    minute: 88,
    type: 'normal',
    timestamp: '2026-06-19T20:28:00Z',
  },
];

export const PHASE_LABELS: Record<Match['phase'], string> = {
  grupo: 'Fase de Grupos',
  oitavas: 'Oitavas de Final',
  quartas: 'Quartas de Final',
  semi: 'Semifinal',
  final: 'FINAL',
};
