import { mockTelegramEnv } from '@tma.js/sdk-react';

if (import.meta.env.DEV) {
  mockTelegramEnv({
    launchParams: {
      tgWebAppVersion: '8.0',
      tgWebAppPlatform: 'tdesktop',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#3390ec',
        button_color: '#3390ec',
        button_text_color: '#ffffff',
        secondary_bg_color: '#f0f0f0',
        header_bg_color: '#ffffff',
        accent_text_color: '#3390ec',
        section_bg_color: '#ffffff',
        section_header_text_color: '#3390ec',
        subtitle_text_color: '#999999',
        destructive_text_color: '#e53935',
      },
    },
  });
}
