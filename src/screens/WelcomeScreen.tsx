import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../theme/colors';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  // Animações de entrada
  const ballScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Bola entra girando/escalando
    Animated.sequence([
      Animated.spring(ballScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(logoTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Pulso contínuo da bola
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={['#001133', '#002776', '#009C3B']} style={styles.container} locations={[0, 0.5, 1]}>
      {/* Bandeira decorativa de fundo */}
      <View style={styles.stripeTop} />
      <View style={styles.stripeBottom} />

      {/* Bola animada */}
      <Animated.View style={[styles.ballWrapper, { transform: [{ scale: Animated.multiply(ballScale, pulseAnim) }] }]}>
        <Text style={styles.ballEmoji}>⚽</Text>
      </Animated.View>

      {/* Logo e título */}
      <Animated.View style={[styles.logoSection, { opacity: logoOpacity, transform: [{ translateY: logoTranslate }] }]}>
        <Text style={styles.appName}>É GOL!</Text>
        <Text style={styles.subtitle}>🇧🇷 Copa do Mundo 2026 🇧🇷</Text>
        <Text style={styles.tagline}>Receba alertas instantâneos quando{'\n'}a Seleção balançar as redes</Text>
      </Animated.View>

      {/* Botão de entrada */}
      <Animated.View style={[styles.buttonSection, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.primaryButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.primaryButtonText}>⚽ ENTRAR AGORA</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>Copa do Mundo FIFA 2026™ · EUA, Canadá e México</Text>
      </Animated.View>

      {/* Troféu decorativo */}
      <Text style={styles.trophy}>🏆</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stripeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COLORS.gold,
  },
  stripeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COLORS.gold,
  },
  ballWrapper: {
    marginBottom: 24,
  },
  ballEmoji: {
    fontSize: 100,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 56,
  },
  appName: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: -2,
    textShadowColor: COLORS.navy,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
    lineHeight: 76,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerText: {
    color: COLORS.white + '60',
    fontSize: 11,
    textAlign: 'center',
  },
  trophy: {
    position: 'absolute',
    bottom: 48,
    right: 32,
    fontSize: 32,
    opacity: 0.4,
  },
});
