import './mockEnv';
import { init, miniApp, themeParams } from '@tma.js/sdk-react';
import { createRoot } from 'react-dom/client';
import App from './App';

init();

miniApp.mount();
miniApp.bindCssVars();

themeParams.mount();
themeParams.bindCssVars();

// Request fullscreen / expand the mini app via Telegram WebApp API
try {
  const tgWebApp = (window as any).Telegram?.WebApp;
  if (tgWebApp?.requestFullscreen) {
    tgWebApp.requestFullscreen();
  } else if (tgWebApp?.expand) {
    tgWebApp.expand();
  }
} catch { /* not in Telegram or not supported */ }

miniApp.ready();

createRoot(document.getElementById('root')!).render(<App />);
