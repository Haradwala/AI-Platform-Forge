# @forge/core-runtime

This package contains the core-runtime and bootstrap engine for ForgeOS.

---

## Installation

This is an internal workspace package. Declared inside `package.json`:

```json
"dependencies": {
  "@forge/core-runtime": "workspace:*"
}
```

---

## Usage Example

To boot the system, register modules, and start the runtime execution:

```typescript
import { BootstrapEngine, IForgeModule } from '@forge/core-runtime';

// 1. Instantiate the Bootstrap Engine
const engine = new BootstrapEngine();

// 2. Define and register your modules
const databaseModule: IForgeModule = {
  name: 'database',
  version: '1.0.0',
  dependencies: [],
  initialize: async (context) => {
    context.logger.info('Initializing database connections...');
  }
};

const indexingModule: IForgeModule = {
  name: 'indexer',
  version: '1.0.0',
  dependencies: ['database'],
  start: async (context) => {
    context.logger.info('Starting incremental repository file scanning...');
  }
};

engine.registerModule(databaseModule);
engine.registerModule(indexingModule);

// 3. Trigger bootstrap
const context = await engine.bootstrap({
  WORKSPACE_ROOT: '/path/to/project'
});

// Access core subsystems
context.logger.info('Forge OS booted successfully!');
const isHealthy = context.health.getAggregateHealth();

// 4. Graceful Shutdown
await engine.shutdown(context);
```
