# @forge/workspace

The **Workspace Engine** package is a pluggable kernel module (`WorkspaceModule`) for ForgeOS. It abstracts a directory path into a logical workspace session, walks directory structures asynchronously to build a files index, checks Git-style ignore filters, and monitors for files additions, updates, and removals.

---

## 1. Architectural Purpose

This package is responsible solely for filesystem traversal and file change notifications. To preserve loose coupling and clear service boundaries:
*   It does **not** read file text contents.
*   It does **not** generate checksum hashes.
*   It does **not** parse syntax or extract ASTs.

These operations are delegated to downstream consumer modules that subscribe to the event streams published by this engine.

---

## 2. Public API Interface

The module exports several core components:

*   **`WorkspaceManager`**: The top-level manager responsible for opening and closing workspaces, maintaining session contexts in an internal map.
*   **`WorkspaceSession`**: Tracks the runtime state of a specific open workspace. It coordinates scanning and watching while exposing the cached list of indexed files (`getFilesList()`).
*   **`IgnoreRuleManager`**: A pure service utility compiling `.gitignore` and default patterns into regular expressions to evaluate whether a path is excluded.
*   **`WorkspaceScanner`**: Traverser crawling directory trees recursively and yielding `IWorkspaceFile` objects using an `AsyncGenerator` stream.
*   **`FileWatcher`**: Thin adapter wrapping Chokidar that normalizes OS file changes and debounces duplicates at the JS memory level.
*   **`WorkspaceModule`**: Conforms to `IForgeModule` to bootstrap workspace services into the Forge kernel lifecycle.

---

## 3. Consumed & Published Events

All communications are decoupled using standard dot-notation event topics dispatched over the core Event Bus:

### Published Events
*   `workspace.opening`: Emitted when a session begins opening.
*   `workspace.opened`: Emitted when a session directory is established and ready to scan.
*   `workspace.scan.started`: Emitted when files scanning begins.
*   `workspace.scan.completed`: Emitted when files scanning finishes.
*   `workspace.ready`: Emitted when scanning is done, watcher is active, and session is fully operational.
*   `workspace.file.created`: Emitted when a new file metadata object is added.
*   `workspace.file.modified`: Emitted when an existing file metadata object changes.
*   `workspace.file.deleted`: Emitted when a file is removed.
*   `workspace.closing`: Emitted when a session begins closing.
*   `workspace.closed`: Emitted when a session is stopped.
*   `workspace.error`: Emitted when a filesystem watch or scan error is encountered.

### Consumed Events
*   `workspace.file.created`
*   `workspace.file.modified`
*   `workspace.file.deleted`
    *   *Note*: The `WorkspaceSession` itself subscribes to these topics to keep its internal memory index updated reactively.
