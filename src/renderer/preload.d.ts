import { Channels } from 'main/preload';

declare global {
  interface TimerConfiguration {
    start: number,
    initiate_send: number,
    check_error: number,
    send_message: number,
    finalize_send: number,
  }
  interface Window {
    electron: {
      checkFilePath(path: string): boolean;
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
