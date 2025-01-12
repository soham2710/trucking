// src/types/globals.d.ts

export {};

declare global {
  interface GtagEventParams {
    send_to: string;
    value: number;
    currency: string;
    event_callback?: () => void;
  }

  interface GtagConfigParams {
    [key: string]: unknown;
  }

  type GtagCommand = 'js' | 'config' | 'event';

  interface Window {
    gtag: (command: GtagCommand, action: string, params?: GtagEventParams | GtagConfigParams) => void;
  }
}
