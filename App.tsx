import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';

import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { GoalsScreen } from './src/screens/GoalsScreen';
import { SubscribeScreen } from './src/screens/SubscribeScreen';
import {
  setupNotifications,
  registerNotificationListeners,
  clearBadge,
} from './src/services/notificationService';
import { registerPushToken } from './src/services/authService';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { COLORS } from './src/theme/colors';

SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Subscribe: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navy,
          borderTopColor: COLORS.gold,
          borderTopWidth: 2,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.white + '80',
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 11,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarLabel: 'Gols',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>⚽</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Subscribe"
        component={SubscribeScreen}
        options={{
          tabBarLabel: 'Assinar',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size - 4, color }}>⭐</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Componente interno — acessa o AuthContext já montado
function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Registra push token no backend assim que o usuário loga
  useEffect(() => {
    if (!user) return;

    async function setupPush() {
      try {
        const token = await setupNotifications();
        if (token) {
          const platform = Platform.OS === 'ios' ? 'ios' : 'android';
          await registerPushToken(token, platform);
        }
      } catch (e) {
        console.warn('[App] Push setup error:', e);
      }
    }

    setupPush();
    clearBadge();

    const subs = registerNotificationListeners();
    return () => subs.remove();
  }, [user?.id]);

  // Esconde splash quando o estado de auth for resolvido
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Enquanto restaura sessão, mostra splash (tela em branco)
  if (isLoading) {
    return null;
  }

  const isLoggedIn = user != null;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
