import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';

interface GoalData {
  id: string;
  matchId: string;
  matchInfo: string;
  player: string;
  minute: number;
  type: 'normal' | 'penalty' | 'contra' | 'falta';
  timestamp: string;
}

interface Props {
  goal: GoalData;
  index: number;
}

const TYPE_CONFIG = {
  normal: { icon: '⚽', label: 'Gol', color: COLORS.green },
  penalty: { icon: '🎯', label: 'Pênalti', color: COLORS.gold },
  falta: { icon: '🌀', label: 'Falta', color: COLORS.navyLight },
  contra: { icon: '😬', label: 'Contra', color: COLORS.goalRed },
};

export function GoalCard({ goal, index }: Props) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const cfg = TYPE_CONFIG[goal.type] ?? TYPE_CONFIG.normal;

  const goalTime = new Date(goal.timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }], opacity: opacityAnim }]}>
      {/* Barra lateral colorida */}
      <View style={[styles.sideBar, { backgroundColor: cfg.color }]} />

      {/* Ícone do minuto */}
      <View style={styles.minuteBox}>
        <Text style={styles.minuteIcon}>{cfg.icon}</Text>
        <Text style={styles.minute}>{goal.minute}'</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.playerName}>{goal.player}</Text>
          <View style={[styles.typeBadge, { backgroundColor: cfg.color + '30', borderColor: cfg.color + '60' }]}>
            <Text style={[styles.typeLabel, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        <Text style={styles.matchInfo}>{goal.matchInfo}</Text>
        <Text style={styles.time}>{goalTime} BRT</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
  },
  sideBar: { width: 4 },
  minuteBox: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.navy,
  },
  minuteIcon: { fontSize: 20 },
  minute: { color: COLORS.gold, fontSize: 14, fontWeight: '900', marginTop: 2 },
  content: { flex: 1, padding: 14, gap: 4 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playerName: { fontSize: 16, fontWeight: '800', color: COLORS.white, flex: 1 },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    marginLeft: 8,
  },
  typeLabel: { fontSize: 11, fontWeight: '800' },
  matchInfo: { fontSize: 12, color: COLORS.textMuted },
  time: { fontSize: 11, color: COLORS.gold + '80' },
});
