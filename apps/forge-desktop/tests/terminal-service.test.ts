import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock node-pty so we don't spawn real OS shell processes during unit tests
// This avoids platform-specific issues and asynchronous EBADF socket errors in vitest
vi.mock('node-pty', () => {
  return {
    spawn: vi.fn().mockImplementation((shell, args, options) => {
      let dataListener: ((data: string) => void) | null = null;
      let exitListener: ((pc: { exitCode: number; signal?: number }) => void) | null = null;

      const ptyProcess = {
        pid: 12345,
        cols: options.cols || 80,
        rows: options.rows || 24,
        process: shell,
        onData: vi.fn().mockImplementation((listener) => {
          dataListener = listener;
          // Emit initial mock welcome prompt
          setTimeout(() => {
            if (dataListener) dataListener('Forge Terminal welcome text');
          }, 5);
          return { dispose: () => {} };
        }),
        onExit: vi.fn().mockImplementation((listener) => {
          exitListener = listener;
          return { dispose: () => {} };
        }),
        write: vi.fn().mockImplementation((data) => {
          // Echo input back to simulate shell echoing
          if (dataListener) {
            dataListener(data);
          }
        }),
        resize: vi.fn().mockImplementation((c, r) => {
          ptyProcess.cols = c;
          ptyProcess.rows = r;
        }),
        kill: vi.fn().mockImplementation(() => {
          if (exitListener) {
            exitListener({ exitCode: 0 });
          }
        }),
      };
      return ptyProcess;
    }),
  };
});

import { DesktopContainer } from '../electron/main/container/desktop-container';
import { CoreModule } from '../electron/main/modules/core.module';
import { TerminalModule } from '../electron/main/modules/terminal.module';
import { T } from '../electron/main/container/tokens';
import { ITerminalService, IDesktopEventBus } from '../electron/main/container/service-interfaces';

describe('TerminalService', () => {
  let container: DesktopContainer;
  let service: ITerminalService;
  let eventBus: IDesktopEventBus;

  beforeEach(async () => {
    container = new DesktopContainer({ environment: 'test' });
    container.loadModule(new CoreModule());
    container.loadModule(new TerminalModule());
    await container.initializeAll();

    service = container.resolve<ITerminalService>(T.ITerminalService);
    eventBus = container.resolve<IDesktopEventBus>(T.IDesktopEventBus);
  });

  it('creates terminal session and triggers shell output', async () => {
    const listener = vi.fn();
    eventBus.on('terminal:data:t1', listener);

    await service.create('t1');

    // Wait for the mock shell process to start and emit initial data
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(listener).toHaveBeenCalled();
    const firstOutput = listener.mock.calls[0][0];
    expect(firstOutput).toContain('Forge Terminal welcome text');

    // Clean up
    await service.kill('t1');
  });

  it('echoes inputs back via shell stream', async () => {
    await service.create('t1');
    const listener = vi.fn();
    eventBus.on('terminal:data:t1', listener);

    // Write input to the mock pty
    service.write('t1', 'echo test\r');

    // Wait for mock pty to echo
    await new Promise((resolve) => setTimeout(resolve, 50));

    // It should have received the echoed data
    expect(listener).toHaveBeenCalledWith('echo test\r');

    // Clean up
    await service.kill('t1');
  });

  it('allows resizes and kills sessions cleanly', async () => {
    await service.create('t1');
    expect(() => service.resize('t1', 100, 30)).not.toThrow();
    await expect(service.kill('t1')).resolves.not.toThrow();
  });
});
