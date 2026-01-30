import './mockEnv';
import { init, miniApp, themeParams } from '@tma.js/sdk-react';
import { createRoot } from 'react-dom/client';
import App from './App';

init();

miniApp.mount();
miniApp.bindCssVars();

themeParams.mount();
themeParams.bindCssVars();

miniApp.ready();

createRoot(document.getElementById('root')!).render(<App />);
