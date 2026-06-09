/**
 * Serviço que consulta o backend Copa (FastAPI/Sofascore proxy + goals DB).
 * Todas as funções lêem dados reais — sem mock.
 */

import { api } from './api';

// ---------------------------------------------------------------------------
// Types (espelham o que o backend retorna)
// ---------------------------------------------------------------------------

export interface BackendEvent {
  match_id: string;
  sofascore_slug: string;
  home_team: string;
  home_team_code: string;
  home_team_id: number | null;
  away_team: string;
  away_team_code: string;
  away_team_id: number | null;
  home_score: number | null;
  away_score: number | null;
  match_date: string | null;   // "2026-06-13"
  match_time: string | null;   // "18:00"
  stage: string;
  group_name: string;
  round: number | null;
  status: string;              // "notstarted" | "inprogress" | "finished"
  venue: string | null;
}

export interface BackendGoal {
  id: number;
  match_id: string | null;
  match_info: string | null;
  player: string;
  minute: number;
  goal_type: string;   // "normal" | "penalty" | "falta" | "contra"
  scored_at: string;
}

// Formato normalizado para o front
export interface AppMatch {
  id: string;
  phase: 'grupo' | 'oitavas' | 'quartas' | 'semi' | 'final' | 'outro';
  isBrazilHome: boolean;
  opponent: string;
  opponentCode: string;
  date: string;
  time: string;
  stage: string;
  status: string;
  brazilScore: number | null;
  opponentScore: number | null;
  finished: boolean;
  live: boolean;
}

export interface AppGoal {
  id: string;
  matchId: string | null;
  matchInfo: string;
  player: string;
  minute: number;
  type: 'normal' | 'penalty' | 'falta' | 'contra';
  scoredAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BRAZIL_NAMES = ['Brazil', 'Brasil'];

function isBrazil(name: string) {
  return BRAZIL_NAMES.some((n) => name.toLowerCase().includes(n.toLowerCase()));
}

function slugToPhase(stage: string, slug: string): AppMatch['phase'] {
  const s = (stage + slug).toLowerCase();
  if (s.includes('final') && !s.includes('semi') && !s.includes('quarter') && !s.includes('round-of')) return 'final';
  if (s.includes('semi')) return 'semi';
  if (s.includes('quarter')) return 'quartas';
  if (s.includes('round-of-16') || s.includes('oitavas')) return 'oitavas';
  if (s.includes('round-of-32') || s.includes('round of 32')) return 'oitavas';
  if (s.includes('group') || s.includes('grupo')) return 'grupo';
  return 'outro';
}

function normaliseEvent(e: BackendEvent): AppMatch | null {
  const brazilHome = isBrazil(e.home_team);
  const brazilAway = isBrazil(e.away_team);
  if (!brazilHome && !brazilAway) return null;

  const phase = slugToPhase(e.stage, e.sofascore_slug ?? '');
  const opponent = brazilHome ? e.away_team : e.home_team;
  const opponentCode = brazilHome ? e.away_team_code : e.home_team_code;
  const brazilScore = brazilHome ? e.home_score : e.away_score;
  const opponentScore = brazilHome ? e.away_score : e.home_score;

  return {
    id: e.match_id,
    phase,
    isBrazilHome: brazilHome,
    opponent,
    opponentCode,
    date: e.match_date ?? '',
    time: e.match_time ?? '',
    stage: e.stage,
    status: e.status,
    brazilScore: brazilScore ?? null,
    opponentScore: opponentScore ?? null,
    finished: e.status === 'finished',
    live: e.status === 'inprogress',
  };
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/** Retorna todos os jogos do Brasil via Sofascore (proxy residencial). */
export async function fetchBrazilMatches(): Promise<AppMatch[]> {
  const data = await api.get<{ count: number; rounds_fetched: number; events: Record<string, BackendEvent> }>('/events/all');
  const events = Object.values(data.events);
  return events.map((e) => normaliseEvent(e)).filter((m): m is AppMatch => m !== null);
}

/** Retorna os gols registrados (banco de dados do backend). */
export async function fetchGoals(limit = 50): Promise<AppGoal[]> {
  const goals = await api.get<BackendGoal[]>(`/goals?limit=${limit}`);
  return goals.map((g) => ({
    id: String(g.id),
    matchId: g.match_id,
    matchInfo: g.match_info ?? '',
    player: g.player,
    minute: g.minute,
    type: g.goal_type as AppGoal['type'],
    scoredAt: g.scored_at,
  }));
}
