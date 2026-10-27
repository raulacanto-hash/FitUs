/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        ux_mode?: 'popup' | 'redirect';
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          theme?: 'outline' | 'filled_blue' | 'filled_black';
          size?: 'large' | 'medium' | 'small';
          shape?: 'rectangular' | 'pill' | 'circle' | 'square';
          text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
          width?: number;
          locale?: string;
        }
      ) => void;
      prompt: () => void;
      disableAutoSelect: () => void;
    };
  };
}

interface Window {
  google?: GoogleIdentityServices;
}
