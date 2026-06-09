import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Config global: como mostrar a notificação quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registra o dispositivo para push notifications e retorna o token.
 * Chame no boot do app (App.tsx).
 */
export async function setupNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[Notifications] Push só funciona em dispositivo físico.');
    return null;
  }

  // Pedir permissão
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notifications] Permissão de push negada pelo usuário.');
    return null;
  }

  // Canal Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('gols', {
      name: 'Gols da Seleção 🇧🇷',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFD700',
      sound: 'default',
      description: 'Alertas em tempo real de gols do Brasil',
    });
  }

  // Obter token Expo Push
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.warn('[Notifications] projectId EAS não configurado. Configure em app.json > extra > eas > projectId');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  console.log('[Notifications] Token:', tokenData.data);

  return tokenData.data;
}

/**
 * Dispara uma notificação LOCAL de gol (útil pra testar sem backend).
 */
export async function triggerLocalGoalNotification(player: string, minute: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚽ É GOL DO BRASIL! 🇧🇷',
      body: `${player} balançou as redes no ${minute}' — VAAAAAAMOOOOOOOS!`,
      sound: 'default',
      badge: 1,
      data: { type: 'goal', player, minute },
    },
    trigger: null, // imediato
  });
}

/**
 * Registra listeners de notificação (para tratar cliques no push).
 * Retorna um objeto { remove() } para cancelar quando o componente desmontar.
 */
export function registerNotificationListeners(
  onNotification?: (notification: Notifications.Notification) => void,
  onResponse?: (response: Notifications.NotificationResponse) => void,
) {
  const receivedSub = Notifications.addNotificationReceivedListener((n) => {
    console.log('[Notifications] Recebida:', n);
    onNotification?.(n);
  });

  const responseSub = Notifications.addNotificationResponseReceivedListener((r) => {
    console.log('[Notifications] Resposta:', r);
    onResponse?.(r);
  });

  return {
    remove: () => {
      receivedSub.remove();
      responseSub.remove();
    },
  };
}

/**
 * Limpa o badge de notificação (chamar ao entrar no app).
 */
export async function clearBadge() {
  await Notifications.setBadgeCountAsync(0);
}
