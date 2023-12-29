import { Channels } from "main/preload";

declare global {
  interface TimerConfiguration {
    start: number;
    initiate_send: number;
    check_error: number;
    send_message: number;
    finalize_send: number;
    new_whatsapp_send_button: boolean;
  }
  interface Contact {
    name: string;
    phone: string;
    var1: string;
    var2: string;
    var3: string;
  }
  interface Window {
    electron: {
      testInstance: (id: string) => Promise<void>;
      createInstanceOfWhatsApp: (instanceInfo: {
        uid: string;
        name: string;
        createdAt: number;
      }) => Promise<void>;
      createGlobalInstanceOfDriver: () => Promise<void>;
      loginWhatsapp: (config: TimerConfiguration) => Promise<void>;
      closeGlobalInstanceOfDriver: () => Promise<void>;
      sendMessage: (
        contact: Contact,
        message: string,
        images: any[],
        config: TimerConfiguration,
      ) => Promise<{
        status: boolean;
        error: any;
      }>;
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void,
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
