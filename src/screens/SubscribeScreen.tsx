import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Torcedor',
    price: 'Grátis',
    period: '',
    features: [
      '⚽ Ver calendário de jogos',
      '📊 Estatísticas básicas',
      '🔔 1 alerta por jogo',
    ],
    highlight: false,
  },
  {
    id: 'copa',
    name: 'Copa 2026',
    price: 'R$ 9,90',
    period: '/mês',
    badge: '⭐ MAIS POPULAR',
    features: [
      '⚽ Alertas de gol em tempo real',
      '🔔 Push ilimitados por jogo',
      '📊 Estatísticas completas',
      '🎯 Artilheiros e assistências',
      '📺 Notificações de escalação',
      '🏟 Alertas de resultado final',
    ],
    highlight: true,
  },
  {
    id: 'hexa',
    name: 'Hexa',
    price: 'R$ 59,90',
    period: '/copa',
    badge: '🏆 MELHOR CUSTO',
    features: [
      '✅ Tudo do plano Copa 2026',
      '🎁 Acesso vitalício à copa',
      '📱 Histórico de todos os gols',
      '🔴 Alertas de substituições',
      '⚡ Notificações VIP antecipadas',
      '🎊 Animação especial de gol',
    ],
    highlight: false,
  },
];

export function SubscribeScreen() {
  const [selected, setSelected] = useState<string>('copa');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: integrar com Stripe / Google Pay / Apple Pay
      Alert.alert(
        '🎉 É Gol!',
        'Assinatura ativada com sucesso!\nAgora você vai receber alertas de cada gol da Seleção!',
        [{ text: 'VAMOOOOO BRASIL! 🇧🇷', style: 'default' }]
      );
    }, 1500);
  };

  return (
    <LinearGradient colors={['#001133', '#002776']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.headerTitle}>Seja Premium</Text>
          <Text style={styles.headerSub}>
            Não perca nenhum gol da{'\n'}🇧🇷 Seleção Brasileira 🇧🇷
          </Text>
        </View>

        {/* Planos */}
        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            onPress={() => setSelected(plan.id)}
            activeOpacity={0.85}
            style={[styles.planCard, selected === plan.id && styles.planCardSelected]}
          >
            {plan.highlight && selected === plan.id && (
              <LinearGradient
                colors={[COLORS.gold + '20', COLORS.gold + '05']}
                style={StyleSheet.absoluteFill}
              />
            )}

            {/* Badge */}
            {plan.badge && (
              <View style={styles.badge}>
                <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.badgeGradient}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </LinearGradient>
              </View>
            )}

            {/* Cabeçalho do plano */}
            <View style={styles.planHeader}>
              <View style={styles.planCheck}>
                {selected === plan.id
                  ? <Text style={styles.checkOn}>✓</Text>
                  : <View style={styles.checkOff} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  {plan.period ? <Text style={styles.planPeriod}>{plan.period}</Text> : null}
                </View>
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresList}>
              {plan.features.map((f, i) => (
                <Text key={i} style={styles.feature}>{f}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* CTA */}
        {selected !== 'free' && (
          <TouchableOpacity
            style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
            onPress={() => handleSubscribe(selected)}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.gold, COLORS.goldDark]}
              style={styles.ctaBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaBtnText}>
                {loading
                  ? '🔄 Processando...'
                  : `⚽ ASSINAR — ${PLANS.find((p) => p.id === selected)?.price}${PLANS.find((p) => p.id === selected)?.period}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Garantia */}
        <View style={styles.guarantee}>
          <Text style={styles.guaranteeText}>🛡 Garantia de 7 dias. Cancele quando quiser.</Text>
        </View>

        {/* Depoimentos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que os torcedores dizem</Text>
          {[
            { name: 'Carlos M.', text: '"Recebi o push quando o Vini Jr. fez o gol na final de 2022... ah, ia ter sido épico!" 😂', stars: 5 },
            { name: 'Juliana P.', text: '"Melhor app da Copa. Recebo antes de ver no TV!"', stars: 5 },
            { name: 'Rafael S.', text: '"Valeu cada centavo. Brasil hexacampeão! 🇧🇷🏆"', stars: 5 },
          ].map((r) => (
            <View key={r.name} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Text style={styles.stars}>{'⭐'.repeat(r.stars)}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 28 },
  trophy: { fontSize: 56, marginBottom: 8 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.gold, letterSpacing: -0.5 },
  headerSub: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: COLORS.white + '10',
    overflow: 'hidden',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeGradient: { paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: COLORS.navy, fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  planCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  checkOn: { color: COLORS.gold, fontWeight: '900', fontSize: 14 },
  checkOff: { width: 12, height: 12, borderRadius: 6 },

  planName: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3, marginTop: 2 },
  planPrice: { fontSize: 26, fontWeight: '900', color: COLORS.gold },
  planPeriod: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },

  featuresList: { gap: 6 },
  feature: { color: COLORS.white + 'CC', fontSize: 13, lineHeight: 18 },

  ctaBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  ctaBtnText: { color: COLORS.navy, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  guarantee: { alignItems: 'center', marginBottom: 28 },
  guaranteeText: { color: COLORS.textMuted, fontSize: 12 },

  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.gold, marginBottom: 4, letterSpacing: 0.5 },

  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gold + '20',
    gap: 6,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewName: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  stars: { fontSize: 12 },
  reviewText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18 },
});
