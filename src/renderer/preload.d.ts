declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, args: unknown[]): void;
        sendSync(channel: string, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        removeListener(
          channel: string,
          func: (...args: unknown[]) => void
        ): void;
        removeAllListeners(channel: string): void;
      };
    };
  }
}

export {};
