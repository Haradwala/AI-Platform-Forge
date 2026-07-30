/**
 * SessionClient — provides a typed frontend interface to call session IPC handlers.
 */
export class SessionClient {
  static async save(state: any): Promise<void> {
    if (typeof window !== 'undefined' && window.forge) {
      await window.forge.invoke('session:save', state);
    }
  }

  static async restore(): Promise<any> {
    if (typeof window !== 'undefined' && window.forge) {
      return window.forge.invoke('session:restore');
    }
    return null;
  }

  static async clear(): Promise<void> {
    if (typeof window !== 'undefined' && window.forge) {
      await window.forge.invoke('session:clear');
    }
  }
}
export default SessionClient;
