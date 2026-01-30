# Project Notes

## Overview

- **Repo:** https://github.com/ohld/tic-tac-tma
- **Deploy:** Vercel (auto-deploy from `main`), Vite preset
- **Domains:** `tic-tac-tma.vercel.app`
- **Stack:** React 19 + TypeScript + Vite + `@tma.js/sdk-react`
- **Built using:** [tma-llms-txt](https://github.com/ohld/tma-llms-txt) — LLM-friendly docs for Telegram Mini Apps SDK

## Gotchas

### mockTelegramEnv — не привязывать к DEV mode

`@tma.js/sdk-react` падает с `LaunchParamsRetrieveError` если открыть приложение вне Telegram (обычный браузер, Vercel preview).

**Неправильно** — мок только в DEV:
```ts
if (import.meta.env.DEV) {
  mockTelegramEnv({ ... });
}
```

**Правильно** — мок когда нет реальных launch params:
```ts
import { mockTelegramEnv, retrieveLaunchParams } from '@tma.js/sdk-react';

try {
  retrieveLaunchParams();
} catch {
  mockTelegramEnv({ ... });
}
```

Так приложение работает и в Telegram (реальные параметры), и в браузере (мок).

### Инициализация TMA SDK

Порядок в `main.tsx`:
1. `import './mockEnv'` — сначала мок (если нужен)
2. `init()` — инициализация SDK
3. `miniApp.mount()` + `bindCssVars()` — привязка CSS-переменных темы
4. `themeParams.mount()` + `bindCssVars()` — параметры темы
5. `miniApp.ready()` — сигнал Telegram что приложение загружено
6. `createRoot(...)` — рендер React
