import { useEffect, useContext, createContext } from 'react';
import { DesktopEventBus } from '../eventbus/desktop-eventbus';
import { DesktopEventMap } from '../eventbus/desktop-events';

export const DesktopEventBusContext = createContext<DesktopEventBus | null>(null);

/**
 * useDesktopEvent — React hook to safely subscribe to DesktopEventBus events.
 *
 * Automatically unsubscribes on component unmount to prevent listener leaks.
 */
export function useDesktopEvent<K extends keyof DesktopEventMap>(
  event: K,
  callback: (payload: DesktopEventMap[K]) => void,
  deps: React.DependencyList = [],
): void {
  const bus = useContext(DesktopEventBusContext);

  useEffect(() => {
    if (!bus) {
      console.warn('[useDesktopEvent] DesktopEventBusContext not found. Skipping subscription.');
      return;
    }

    const unsubscribe = bus.on(event, callback);
    return () => unsubscribe();
  }, [bus, event, ...deps]);
}
