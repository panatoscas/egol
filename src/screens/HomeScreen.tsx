import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { AppMatch, fetchBrazilMatches } from '../services/copaService';
import { useAuth } from '../context/AuthContext';
import { getFlagEmoji, utcTimeToBRT, formatMatchDate, daysUntil } from '../utils/football';

// ---------------------------------------------------------------------------
// Match Row
// ---------------------------------------------------------------------------

function MatchRow({ match }: { match: AppMatch }) {
  const flag = getFlagEmoji(match.opponentCode, match.opponent);
  const dateStr = formatMatchDate(match.date);
  const timeBRT = utcTimeToBRT(match.time);

  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.stage}>{match.stage}</Text>
      <View style={rowStyles.content}>
        <View style={rowStyles.teams}>
          <Text style={rowStyles.flag}>🇧🇷</Text>
          <View style={rowStyles.scoreBlock}>
            {match.finished ? (
              <Text style={rowStyles.score}>
                {match.brazilScore ?? '-'} × {match.opponentScore ?? '-'}
              </Text>
            ) : match.live ? (
              <Text style={[rowStyles.score, { color: COLORS.green }]}>🔴 AO VIVO</Text>
            ) : (
              <Text style={rowStyles.score}>vs</Text>
            )}
            <Text style={rowStyles.date}>{dateStr}{timeBRT ? ` · ${timeBRT} BRT` : ''}</Text>
          </View>
          <Text style={rowStyles.flag}>{flag}</Text>
        </View>
        <Text style={rowStyles.opponent}>{match.opponent}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
  },
  stage: { color: COLORS.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  content: { alignItems: 'center' },
  teams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  flag: { fontSize: 32 },
  scoreBlock: { alignItems: 'center', flex: 1 },
  score: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  date: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  opponent: { color: COLORS.textMuted, fontSize: 12, marginTop: 6 },
});

// ---------------------------------------------------------------------------
// HomeScreen
// ---------------------------------------------------------------------------

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [matches, setMatches] = useState<AppMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchBrazilMatches();
      setMatches(data);
    } catch (e: any) {
      setError('Não foi possível carregar os jogos. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  const today = new Date().toISOString().split('T')[0];
  const nextMatch = matches.find((m) => !m.finished && !m.live && m.date >= today);
  const completedMatches = matches.filter((m) => m.finished);
  const upcomingMatches = matches.filter((m) => !m.finished && !m.live);
  const liveMatches = matches.filter((m) => m.live);

  const totalGoals = completedMatches.reduce(
    (sum, m) => sum + (m.brazilScore ?? 0), 0
  );
  const wins = completedMatches.filter(
    (m) => (m.brazilScore ?? 0) > (m.opponentScore ?? 0)
  ).length;

  const daysLeft = nextMatch ? daysUntil(nextMatch.date) : null;

  return (
    <LinearGradient colors={['#001133', '#002776']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>🇧🇷 {user?.name ? `Olá, ${user.name}!` : 'Olá, Torcedor!'}</Text>
            <Text style={styles.headerTitle}>É GOL!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Subscribe')} style={styles.premiumBadge}>
            <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.premiumBadgeGradient}>
              <Text style={styles.premiumBadgeText}>⭐ PREMIUM</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.gold} size="large" />
            <Text style={styles.loadingText}>Carregando jogos...</Text>
          </View>
        )}

        {/* Erro */}
        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={() => load()}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorRetry}>Toque para tentar novamente</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && (
          <>
            {/* Jogo ao vivo */}
            {liveMatches.map((m) => (
              <View key={m.id} style={styles.liveCard}>
                <LinearGradient colors={['#cc0000', '#880000']} style={styles.liveGradient}>
                  <Text style={styles.liveBadge}>🔴 AO VIVO</Text>
                  <View style={styles.liveMatchup}>
                    <Text style={styles.liveFlag}>🇧🇷</Text>
                    <Text style={styles.liveScore}>
                      {m.brazilScore ?? 0} × {m.opponentScore ?? 0}
                    </Text>
                    <Text style={styles.liveFlag}>{getFlagEmoji(m.opponentCode, m.opponent)}</Text>
                  </View>
                  <Text style={styles.liveOpponent}>{m.opponent}</Text>
                </LinearGradient>
              </View>
            ))}

            {/* Próximo jogo — countdown */}
            {nextMatch && liveMatches.length === 0 && (
              <View style={styles.countdownCard}>
                <LinearGradient
                  colors={[COLORS.green, COLORS.greenDark]}
                  style={styles.countdownGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.countdownLabel}>🗓 Próximo jogo</Text>
                  <View style={styles.matchup}>
                    <Text style={styles.teamFlag}>🇧🇷</Text>
                    <View style={styles.matchupCenter}>
                      <Text style={styles.vsText}>VS</Text>
                      <Text style={styles.matchDate}>
                        {formatMatchDate(nextMatch.date)}
                        {utcTimeToBRT(nextMatch.time) ? ` · ${utcTimeToBRT(nextMatch.time)} BRT` : ''}
                      </Text>
                    </View>
                    <Text style={styles.teamFlag}>{getFlagEmoji(nextMatch.opponentCode, nextMatch.opponent)}</Text>
                  </View>
                  <Text style={styles.matchOpponent}>{nextMatch.opponent}</Text>
                  {daysLeft !== null && (
                    <View style={styles.countdown}>
                      <Text style={styles.countdownNumber}>
                        {daysLeft <= 0 ? 'HOJE!' : daysLeft.toString()}
                      </Text>
                      {daysLeft > 0 && <Text style={styles.countdownUnit}>dias</Text>}
                    </View>
                  )}
                </LinearGradient>
              </View>
            )}

            {/* Stats */}
            {completedMatches.length > 0 && (
              <View style={styles.statsRow}>
                {[
                  { label: 'Gols', value: String(totalGoals), icon: '⚽' },
                  { label: 'Jogos', value: String(completedMatches.length), icon: '🏟' },
                  { label: 'Vitórias', value: String(wins), icon: '🏆' },
                  { label: 'Fase', value: completedMatches[completedMatches.length - 1]?.phase === 'grupo' ? 'Grupos' : 'Mata-mata', icon: '🌟' },
                ].map((stat) => (
                  <View key={stat.label} style={styles.statCard}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Alertas */}
            <View style={styles.alertBanner}>
              <Text style={styles.alertIcon}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Alertas de gol ATIVOS</Text>
                <Text style={styles.alertSub}>Você será notificado assim que a Seleção marcar!</Text>
              </View>
              <View style={styles.alertDot} />
            </View>

            {/* Resultados */}
            {completedMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resultados</Text>
                {completedMatches.map((m) => <MatchRow key={m.id} match={m} />)}
              </View>
            )}

            {/* Calendário */}
            {upcomingMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Calendário</Text>
                {upcomingMatches.map((m) => <MatchRow key={m.id} match={m} />)}
              </View>
            )}

            {matches.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>⚽</Text>
                <Text style={styles.emptyText}>Nenhum jogo encontrado.</Text>
                <Text style={styles.emptySub}>Puxe para baixo para atualizar.</Text>
              </View>
            )}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24,
  },
  greeting: { color: COLORS.white + '99', fontSize: 13, fontWeight: '600' },
  headerTitle: { fontSize: 36, fontWeight: '900', color: COLORS.gold, letterSpacing: -1 },
  premiumBadge: { borderRadius: 20, overflow: 'hidden', marginTop: 6 },
  premiumBadgeGradient: { paddingHorizontal: 14, paddingVertical: 7 },
  premiumBadgeText: { color: COLORS.navy, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },

  loadingBox: { alignItems: 'center', paddingVertical: 60, gap: 16 },
  loadingText: { color: COLORS.textMuted, fontSize: 14 },

  errorBox: {
    backgroundColor: '#cc000030', borderRadius: 14, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: '#cc000060', marginBottom: 20,
  },
  errorText: { color: '#ff6666', fontWeight: '700', fontSize: 14, textAlign: 'center' },
  errorRetry: { color: COLORS.textMuted, fontSize: 12, marginTop: 6 },

  liveCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 8 },
  liveGradient: { padding: 20, alignItems: 'center' },
  liveBadge: { color: COLORS.white, fontWeight: '900', fontSize: 13, letterSpacing: 1, marginBottom: 12 },
  liveMatchup: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 8 },
  liveFlag: { fontSize: 44 },
  liveScore: { fontSize: 36, fontWeight: '900', color: COLORS.white },
  liveOpponent: { color: COLORS.white + 'AA', fontSize: 13 },

  countdownCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 8 },
  countdownGradient: { padding: 20 },
  countdownLabel: { color: COLORS.white + 'CC', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  matchup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  teamFlag: { fontSize: 48 },
  matchupCenter: { alignItems: 'center', flex: 1 },
  vsText: { fontSize: 22, fontWeight: '900', color: COLORS.white, letterSpacing: 2 },
  matchDate: { color: COLORS.white + 'CC', fontSize: 12, marginTop: 4, textAlign: 'center' },
  matchOpponent: { color: COLORS.white + '99', fontSize: 12, marginBottom: 12 },
  countdown: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  countdownNumber: { fontSize: 40, fontWeight: '900', color: COLORS.gold, letterSpacing: -1 },
  countdownUnit: { fontSize: 16, fontWeight: '700', color: COLORS.gold + 'CC' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.gold + '20',
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '900', color: COLORS.gold },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },

  alertBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.green + '25',
    borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.green + '60', gap: 12,
  },
  alertIcon: { fontSize: 24 },
  alertTitle: { color: COLORS.white, fontWeight: '800', fontSize: 14 },
  alertSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  alertDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: COLORS.gold,
    marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase',
  },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  emptySub: { color: COLORS.textMuted, fontSize: 13 },
});
