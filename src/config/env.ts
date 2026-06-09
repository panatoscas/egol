/**
 * Configuração de ambiente — URLs de backend
 *
 * Para desenvolvimento local, defina EXPO_PUBLIC_API_URL no arquivo .env
 * (na raiz do projeto egol). Essa variável é lida automaticamente pelo Expo.
 *
 * Para produção, configure EXPO_PUBLIC_API_URL na dashboard EAS (eas.json /
 * Expo website) antes de gerar o build.
 *
 * Exemplo .env (dev local):
 *   EXPO_PUBLIC_API_URL=http://192.168.1.10:8000
 *
 * Exemplo em produção (Railway, Render, etc.):
 *   EXPO_PUBLIC_API_URL=https://seu-backend.up.railway.app
 */

/** URL base do backend Copa (FastAPI). Sem barra final. */
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
