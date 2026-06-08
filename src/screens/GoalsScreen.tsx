import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { MOCK_GOALS } from '../data/matches';
import { GoalCard } from '../components/GoalCard';

type FilterType = 'todos' | 'normal' | 'falta' | 'penalty';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'normal', label: '⚽ Normal' },
  { key: 'falta', label: '🌀 Falta' },
  { key: 'penalty', label: '🎯 Pênalti' },
];

export function GoalsScreen() {
  const [filter, setFilter] = useState<FilterType>('todos');
  const headerAnim = useRef(new Animated.Value(0)).current;

  const filtered = filter === 'todos'
    ? MOCK_GOALS
    : MOCK_GOALS.filter((g) => g.type === filter);

  const totalGoals = MOCK_GOALS.length;
  const topScorer = [...MOCK_GOALS]
    .reduce<Record<string, number>>((acc, g) => {
      acc[g.player] = (acc[g.player] || 0) + 1;
      return acc;
    }, {});
  const topPlayer = Object.entries(topScorer).sort((a, b) => b[1] - a[1])[0];

  return (
    <LinearGradient colors={['#001133', '#002776']} style={styles.container}>
      {/* Header fixo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚽ Gols da Seleção</Text>
        <Text style={styles.headerSub}>Copa do Mundo 2026</Text>
      </View>

      {/* Placar resumo */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalGoals}</Text>
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
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de gols */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <GoalCard goal={item} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⚽</Text>
            <Text style={styles.emptyText}>Nenhum gol nessa categoria ainda.</Text>
            <Text style={styles.emptySub}>Brasil vai balançar essa rede! 🇧🇷</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.gold, letterSpacing: -0.5 },
  headerSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },

  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  summaryNumber: { fontSize: 32, fontWeight: '900', color: COLORS.gold, lineHeight: 36 },
  summaryLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },

  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  filterBtnActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  filterText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: COLORS.navy },

  list: { paddingHorizontal: 20, paddingTop: 4 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  emptySub: { color: COLORS.textMuted, fontSize: 13 },
});
