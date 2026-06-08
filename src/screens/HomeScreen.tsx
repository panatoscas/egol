import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { BRAZIL_MATCHES, PHASE_LABELS, Match } from '../data/matches';
import { MatchCard } from '../components/MatchCard';

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getNextMatch(): Match | undefined {
  const today = new Date().toISOString().split('T')[0];
  return BRAZIL_MATCHES.find((m) => m.date >= today && !m.result);
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const nextMatch = getNextMatch();
  const daysLeft = nextMatch ? daysUntil(nextMatch.date) : null;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const completedMatches = BRAZIL_MATCHES.filter((m) => m.result);
  const upcomingMatches = BRAZIL_MATCHES.filter((m) => !m.result);

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
            <Text style={styles.greeting}>🇧🇷 Olá, Torcedor!</Text>
            <Text style={styles.headerTitle}>É GOL!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Subscribe')} style={styles.premiumBadge}>
            <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.premiumBadgeGradient}>
              <Text style={styles.premiumBadgeText}>⭐ PREMIUM</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Próximo jogo — countdown card */}
        {nextMatch && (
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
                    {new Date(nextMatch.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                    {' · '}
                    {nextMatch.time} BRT
                  </Text>
                </View>
                <Text style={styles.teamFlag}>{nextMatch.opponentFlag}</Text>
              </View>
              <Text style={styles.matchVenue}>
                📍 {nextMatch.stadium} · {nextMatch.city}
              </Text>
              {daysLeft !== null && (
                <View style={styles.countdown}>
                  <Text style={styles.countdownNumber}>{daysLeft < 0 ? '🔴 AO VIVO' : daysLeft === 0 ? 'HOJE!' : `${daysLeft}`}</Text>
                  {daysLeft > 0 && <Text style={styles.countdownUnit}>dias</Text>}
                </View>
              )}
            </LinearGradient>
          </View>
        )}

        {/* Stats rápidos */}
        <View style={styles.statsRow}>
          {[
            { label: 'Gols', value: '5', icon: '⚽' },
            { label: 'Jogos', value: '2', icon: '🏟' },
            { label: 'Vitórias', value: '2', icon: '🏆' },
            { label: 'Ranking', value: '#1', icon: '🌟' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Alertas de gol ativados */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>🔔</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Alertas de gol ATIVOS</Text>
            <Text style={styles.alertSub}>Você será notificado assim que a Seleção marcar!</Text>
          </View>
          <View style={styles.alertDot} />
        </View>

        {/* Jogos já realizados */}
        {completedMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultados</Text>
            {completedMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </View>
        )}

        {/* Próximos jogos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendário</Text>
          {upcomingMatches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: { color: COLORS.white + '99', fontSize: 13, fontWeight: '600' },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: -1,
  },
  premiumBadge: { borderRadius: 20, overflow: 'hidden', marginTop: 6 },
  premiumBadgeGradient: { paddingHorizontal: 14, paddingVertical: 7 },
  premiumBadgeText: { color: COLORS.navy, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },

  countdownCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  countdownGradient: { padding: 20 },
  countdownLabel: { color: COLORS.white + 'CC', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  matchup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  teamFlag: { fontSize: 48 },
  matchupCenter: { alignItems: 'center', flex: 1 },
  vsText: { fontSize: 22, fontWeight: '900', color: COLORS.white, letterSpacing: 2 },
  matchDate: { color: COLORS.white + 'CC', fontSize: 12, marginTop: 4, textAlign: 'center' },
  matchVenue: { color: COLORS.white + '99', fontSize: 12, marginBottom: 12 },
  countdown: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  countdownNumber: { fontSize: 40, fontWeight: '900', color: COLORS.gold, letterSpacing: -1 },
  countdownUnit: { fontSize: 16, fontWeight: '700', color: COLORS.gold + 'CC' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '900', color: COLORS.gold },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green + '25',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.green + '60',
    gap: 12,
  },
  alertIcon: { fontSize: 24 },
  alertTitle: { color: COLORS.white, fontWeight: '800', fontSize: 14 },
  alertSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  alertDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gold,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
