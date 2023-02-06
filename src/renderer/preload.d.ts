import { Channels } from 'main/preload';

declare global {
  interface TimerConfiguration {
    start: number,
    initiate_send: number,
    check_error: number,
    send_message: number,
    finalize_send: number,
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
      checkFilePath(path: string): boolean;
      createGlobalInstanceOfDriver: () => Promise<void>;
      loginWhatsapp: (config: TimerConfiguration) => Promise<void>;
      closeGlobalInstanceOfDriver: () => Promise<void>;
      sendMessage: (contact: Contact, message: string, images: any[], config: TimerConfiguration) => Promise<{
        status: boolean;
        error: any;
      }>

      extractContacts(group_name: string, config: TimerConfiguration): any[];
      initiateSendProcess(rows: any[], message: string, attachments: any[], isNewLineReturnCharacter: boolean, config: TimerConfiguration): any;
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export { };
