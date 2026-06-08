# É GOL! ⚽🇧🇷 — App Copa do Mundo 2026

App de alertas de gols da Seleção Brasileira para a Copa do Mundo 2026.

## Stack

- **Expo** ~51 (React Native)
- **React Navigation** v6 (Stack + Bottom Tabs)
- **Expo Notifications** — push tokens e alertas de gol
- **Expo Linear Gradient** — visual temático
- **TypeScript**

## Estrutura

```
egol/
├── App.tsx                          # Entry point, navegação root
├── app.json                         # Config Expo
├── src/
│   ├── theme/
│   │   └── colors.ts                # Paleta Brasil (verde, amarelo, azul)
│   ├── data/
│   │   └── matches.ts               # Jogos do Brasil na Copa 2026
│   ├── screens/
│   │   ├── WelcomeScreen.tsx        # Splash animada
│   │   ├── LoginScreen.tsx          # Login/cadastro (email + Google)
│   │   ├── HomeScreen.tsx           # Hub: próximo jogo, stats, calendário
│   │   ├── GoalsScreen.tsx          # Feed de gols com filtros
│   │   └── SubscribeScreen.tsx      # Planos: Grátis / Copa 2026 / Hexa
│   ├── components/
│   │   ├── GoalCard.tsx             # Card de gol individual
│   │   └── MatchCard.tsx            # Card de partida
│   └── services/
│       └── notificationService.ts   # Expo Push — setup, trigger, listeners
```

## Rodando

```bash
cd egol
npm install
npx expo start
```

Escaneie o QR no Expo Go (iOS/Android) para ver o app.

## Integrações pendentes (backend)

| Funcionalidade | Serviço sugerido |
|---|---|
| Autenticação | Firebase Auth / Supabase |
| Banco de dados de gols | Firestore / Supabase Postgres |
| Push server-side | Expo Push API + API de futebol (API-Football, ESPN) |
| Pagamentos | Stripe (web) + RevenueCat (mobile) |

## Paleta de cores

| Cor | Hex |
|---|---|
| Verde bandeira | `#009C3B` |
| Amarelo canário | `#FFD700` |
| Azul marinho | `#002776` |
| Background escuro | `#001133` |

---

**Copa do Mundo FIFA 2026** · EUA, Canadá e México · 11 Jun — 19 Jul 2026
