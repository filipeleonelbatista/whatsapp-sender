import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      initiateSendProcess(rows: any[], message: string, attachments: any[], isNewLineReturnCharacter: boolean): any;
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
