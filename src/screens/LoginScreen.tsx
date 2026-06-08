import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login: onLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    // TODO: integrar com Firebase Auth / seu backend
    setTimeout(() => {
      setLoading(false);
      if (onLogin) onLogin();
    }, 1200);
  };

  const handleGoogle = () => {
    // TODO: integrar com Google Sign-In
    Alert.alert('Em breve!', 'Login com Google estará disponível no lançamento.');
  };

  return (
    <LinearGradient colors={['#001133', '#002776']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.appName}>É GOL!</Text>
            <Text style={styles.headerSub}>⚽ Copa 2026</Text>
          </View>

          {/* Card de login */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}</Text>
            <Text style={styles.cardSub}>
              {isLogin
                ? 'Entre para receber alertas de gol da Seleção'
                : 'Junte-se à torcida e não perca nenhum gol'}
            </Text>

            {/* Google */}
            <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} activeOpacity={0.8}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>Continuar com Google</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email */}
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Senha */}
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />

            {isLogin && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            )}

            {/* Botão principal */}
            <TouchableOpacity
              style={[styles.authBtn, loading && { opacity: 0.7 }]}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.gold, COLORS.goldDark]}
                style={styles.authBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.authBtnText}>
                  {loading ? '🔄 Entrando...' : isLogin ? '⚽ ENTRAR' : '⚽ CRIAR CONTA'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle login/cadastro */}
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
              <Text style={styles.toggleText}>
                {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
                <Text style={styles.toggleLink}>{isLogin ? 'Cadastre-se' : 'Entrar'}</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé decorativo */}
          <View style={styles.flags}>
            <Text style={styles.flagRow}>🇧🇷 🏆 ⚽ 🇧🇷 🏆 ⚽ 🇧🇷</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 32 },
  backBtn: { position: 'absolute', left: 0, top: 0, padding: 8 },
  backText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: -1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  headerSub: { color: COLORS.white + '99', fontSize: 13, marginTop: 4 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white, marginBottom: 6 },
  cardSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 24, lineHeight: 18 },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 20,
  },
  googleIcon: { fontSize: 18, fontWeight: '900', color: '#4285F4' },
  googleText: { fontSize: 15, fontWeight: '700', color: '#333' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.white + '20' },
  dividerText: { color: COLORS.textMuted, fontSize: 13 },

  label: { fontSize: 13, fontWeight: '700', color: COLORS.gold, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
  },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  forgotText: { color: COLORS.gold + 'CC', fontSize: 13 },

  authBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  authBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  authBtnText: { color: COLORS.navy, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  toggleBtn: { alignItems: 'center' },
  toggleText: { color: COLORS.textMuted, fontSize: 14 },
  toggleLink: { color: COLORS.gold, fontWeight: '700' },

  flags: { marginTop: 32, alignItems: 'center' },
  flagRow: { fontSize: 22, letterSpacing: 8, opacity: 0.4 },
});
