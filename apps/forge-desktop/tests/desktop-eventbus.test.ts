import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DesktopEventBus } from '../src/eventbus/desktop-eventbus';

describe('DesktopEventBus', () => {
  let bus: DesktopEventBus;

  beforeEach(() => {
    // Clean up window mock
    if (typeof global !== 'undefined') {
      (global as any).window = {};
    }
    bus = new DesktopEventBus();
  });

  it('subscribes and receives emitted events', () => {
    const callback = vi.fn();
    bus.on('workspace:opened', callback);

    const payload = { rootPath: '/root', tree: { name: 'root', path: '/root', isDirectory: true } };
    bus.emit('workspace:opened', payload);

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it('unsubscribes correctly when calling returned function', () => {
    const callback = vi.fn();
    const unsubscribe = bus.on('workspace:closed', callback);

    unsubscribe();
    bus.emit('workspace:closed', undefined);

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not propagate listener errors to emit caller', () => {
    const callback = vi.fn().mockImplementation(() => {
      throw new Error('listener crash');
    });
    bus.on('workspace:closed', callback);

    expect(() => bus.emit('workspace:closed', undefined)).not.toThrow();
    expect(callback).toHaveBeenCalled();
  });

  it('bridges electron events when window.forge exists', () => {
    const mockOn = vi.fn();
    (global as any).window = {
      forge: {
        on: mockOn,
      },
    };

    const newBus = new DesktopEventBus();
    expect(mockOn).toHaveBeenCalledWith('workspace:file-created', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('workspace:file-changed', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('workspace:file-deleted', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('window:state-changed', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('startup:stage-changed', expect.any(Function));
  });
});
