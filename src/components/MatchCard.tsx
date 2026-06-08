import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { Match, PHASE_LABELS } from '../data/matches';

interface Props {
  match: Match;
}

export function MatchCard({ match }: Props) {
  const isCompleted = !!match.result;
  const isFinal = match.phase === 'final';

  const formattedDate = new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  });

  return (
    <View style={[styles.card, isFinal && styles.cardFinal]}>
      {/* Fase */}
      <View style={styles.phaseRow}>
        <Text style={styles.phase}>{PHASE_LABELS[match.phase]}</Text>
        {isCompleted && (
          <View style={styles.resultBadge}>
            <Text style={styles.resultBadgeText}>FIM DE JOGO</Text>
          </View>
        )}
      </View>

      {/* Placar */}
      <View style={styles.matchRow}>
        {/* Brasil */}
        <View style={styles.teamBlock}>
          <Text style={styles.teamFlag}>🇧🇷</Text>
          <Text style={styles.teamName}>Brasil</Text>
        </View>

        {/* Placar central */}
        <View style={styles.scoreBlock}>
          {isCompleted && match.result ? (
            <>
              <View style={styles.scoreRow}>
                <Text style={styles.score}>{match.result.brazilScore}</Text>
                <Text style={styles.scoreSep}>×</Text>
                <Text style={styles.score}>{match.result.opponentScore}</Text>
              </View>
              <Text style={styles.scoreLabel}>
                {match.result.brazilScore > match.result.opponentScore
                  ? '🟢 Vitória'
                  : match.result.brazilScore === match.result.opponentScore
                  ? '🟡 Empate'
                  : '🔴 Derrota'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.vs}>VS</Text>
              <Text style={styles.matchTime}>{match.time !== 'A definir' ? match.time + ' BRT' : '—'}</Text>
            </>
          )}
        </View>

        {/* Adversário */}
        <View style={styles.teamBlock}>
          <Text style={styles.teamFlag}>{match.opponentFlag}</Text>
          <Text style={styles.teamName}>{match.opponent}</Text>
        </View>
      </View>

      {/* Rodapé com data/local */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>📅 {formattedDate}</Text>
        {match.city !== 'A definir' && (
          <Text style={styles.footerText}>📍 {match.city}, {match.country}</Text>
        )}
      </View>

      {/* Gols marcados (se resultado disponível) */}
      {isCompleted && match.result && match.result.goals.length > 0 && (
        <View style={styles.goalsList}>
          {match.result.goals.map((g) => (
            <Text key={g.id} style={styles.goalItem}>
              ⚽ {g.player} {g.minute}'
              {g.type !== 'normal' ? ` (${g.type})` : ''}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
  },
  cardFinal: {
    borderColor: COLORS.gold,
    borderWidth: 2,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  phaseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  phase: { fontSize: 11, fontWeight: '800', color: COLORS.gold, letterSpacing: 1, textTransform: 'uppercase' },
  resultBadge: { backgroundColor: COLORS.green + '30', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  resultBadgeText: { color: COLORS.green, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  matchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  teamBlock: { alignItems: 'center', flex: 1, gap: 4 },
  teamFlag: { fontSize: 36 },
  teamName: { fontSize: 12, fontWeight: '700', color: COLORS.white, textAlign: 'center' },

  scoreBlock: { alignItems: 'center', flex: 1.2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  score: { fontSize: 36, fontWeight: '900', color: COLORS.gold },
  scoreSep: { fontSize: 20, color: COLORS.textMuted, fontWeight: '300' },
  scoreLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontWeight: '600' },
  vs: { fontSize: 22, fontWeight: '900', color: COLORS.white + '60', letterSpacing: 2 },
  matchTime: { fontSize: 12, color: COLORS.gold + 'CC', marginTop: 4, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 },
  footerText: { fontSize: 11, color: COLORS.textMuted },

  goalsList: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.white + '10', paddingTop: 10, gap: 4 },
  goalItem: { fontSize: 12, color: COLORS.white + 'CC' },
});
