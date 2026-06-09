import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { AppGoal, fetchGoals } from '../services/copaService';

type FilterType = 'todos' | 'normal' | 'falta' | 'penalty' | 'contra';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'normal', label: '⚽ Normal' },
  { key: 'falta', label: '🌀 Falta' },
  { key: 'penalty', label: '🎯 Pênalti' },
  { key: 'contra', label: '😬 Contra' },
];

function GoalCard({ goal, index }: { goal: AppGoal; index: number }) {
  const typeLabel: Record<string, string> = {
    normal: '⚽ Gol normal',
    falta: '🌀 Falta direta',
    penalty: '🎯 Pênalti',
    contra: '😬 Gol contra',
  };

  const scoredDate = goal.scoredAt
    ? new Date(goal.scoredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : '';

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.leftBar} />
      <View style={cardStyles.content}>
        <View style={cardStyles.row}>
          <Text style={cardStyles.minute}>{goal.minute}'</Text>
          <Text style={cardStyles.player}>{goal.player}</Text>
          <Text style={cardStyles.type}>{typeLabel[goal.type] ?? goal.type}</Text>
        </View>
        {goal.matchInfo ? (
          <Text style={cardStyles.matchInfo}>{goal.matchInfo}</Text>
        ) : null}
        {scoredDate ? (
          <Text style={cardStyles.date}>{scoredDate}</Text>
        ) : null}
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
  },
  leftBar: { width: 4, backgroundColor: COLORS.gold },
  content: { flex: 1, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  minute: { color: COLORS.gold, fontWeight: '900', fontSize: 16, minWidth: 36 },
  player: { color: COLORS.white, fontWeight: '800', fontSize: 15, flex: 1 },
  type: { color: COLORS.textMuted, fontSize: 11 },
  matchInfo: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  date: { color: COLORS.textMuted + '88', fontSize: 11, marginTop: 2 },
});

// ---------------------------------------------------------------------------
// GoalsScreen
// ---------------------------------------------------------------------------

export function GoalsScreen() {
  const [goals, setGoals] = useState<AppGoal[]>([]);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchGoals();
      setGoals(data);
    } catch {
      setError('Não foi possível carregar os gols.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  const filtered = filter === 'todos' ? goals : goals.filter((g) => g.type === filter);

  const topScorer = goals.reduce<Record<string, number>>((acc, g) => {
    acc[g.player] = (acc[g.player] || 0) + 1;
    return acc;
  }, {});
  const topPlayer = Object.entries(topScorer).sort((a, b) => b[1] - a[1])[0];

  return (
    <LinearGradient colors={['#001133', '#002776']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚽ Gols da Seleção</Text>
        <Text style={styles.headerSub}>Copa do Mundo 2026</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={COLORS.gold} size="large" />
          <Text style={styles.loadingText}>Carregando gols...</Text>
        </View>
      ) : error ? (
        <TouchableOpacity style={styles.errorBox} onPress={() => load()}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorRetry}>Toque para tentar novamente</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* Resumo */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{goals.length}</Text>
              <Text style={styles.summaryLabel}>Gols marcados</Text>
            </View>
            {topPlayer && (
              <View style={[styles.summaryCard, { flex: 2, flexDirection: 'row', gap: 12, alignItems: 'center' }]}>
                <Text style={{ fontSize: 32 }}>🌟</Text>
                <View>
                  <Text style={styles.summaryLabel}>Artilheiro</Text>
                  <Text style={[styles.summaryNumber, { fontSize: 18, lineHeight: 22 }]}>{topPlayer[0]}</Text>
                  <Text style={[styles.summaryLabel, { color: COLORS.gold }]}>{topPlayer[1]} gol{topPlayer[1] > 1 ? 's' : ''}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Filtros */}
          <View style={styles.filtersRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
              >
                <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <GoalCard goal={item} index={index} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>⚽</Text>
                <Text style={styles.emptyText}>
                  {filter === 'todos'
                    ? 'Nenhum gol registrado ainda.'
                    : 'Nenhum gol nessa categoria.'}
                </Text>
                <Text style={styles.emptySub}>Brasil vai balançar essa rede! 🇧🇷</Text>
              </View>
            }
            ListFooterComponent={<View style={{ height: 20 }} />}
          />
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.gold, letterSpacing: -0.5 },
  headerSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: COLORS.textMuted, fontSize: 14 },

  errorBox: {
    margin: 20, backgroundColor: '#cc000030', borderRadius: 14, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: '#cc000060',
  },
  errorText: { color: '#ff6666', fontWeight: '700', fontSize: 14, textAlign: 'center' },
  errorRetry: { color: COLORS.textMuted, fontSize: 12, marginTop: 6 },

  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.gold + '30',
  },
  summaryNumber: { fontSize: 32, fontWeight: '900', color: COLORS.gold, lineHeight: 36 },
  summaryLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },

  filtersRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.white + '20',
  },
  filterBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: COLORS.navy },

  list: { paddingHorizontal: 20, paddingTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  emptySub: { color: COLORS.textMuted, fontSize: 13 },
});
