"use strict";
/**
 * schema.ts — SQLite DDL Schemas & Migrations for Engineering Intelligence
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDL_STATEMENTS = exports.INTELLIGENCE_SCHEMA_VERSION = void 0;
exports.INTELLIGENCE_SCHEMA_VERSION = '1.0.0';
exports.DDL_STATEMENTS = [
    // 1. Schema Version Metadata
    `CREATE TABLE IF NOT EXISTS schema_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,
    // 2. Index Job Progress & Run Logs
    `CREATE TABLE IF NOT EXISTS index_jobs (
    id TEXT PRIMARY KEY,
    workspace_root TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    finished_at INTEGER,
    duration_ms INTEGER,
    files_scanned INTEGER DEFAULT 0,
    files_indexed INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    details_json TEXT
  );`,
    // 3. File Metadata & Hashing Index
    `CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL,
    language TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    last_indexed_at INTEGER NOT NULL
  );`,
    // 4. Symbol Table
    `CREATE TABLE IF NOT EXISTS symbols (
    id TEXT PRIMARY KEY,
    file_id TEXT NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL,
    container_name TEXT,
    start_line INTEGER NOT NULL,
    end_line INTEGER NOT NULL,
    signature TEXT,
    docstring TEXT,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
  );`,
    `CREATE INDEX IF NOT EXISTS idx_symbols_name ON symbols(name);`,
    `CREATE INDEX IF NOT EXISTS idx_symbols_file ON symbols(file_id);`,
    // 5. Knowledge Graph Relationship Edges
    `CREATE TABLE IF NOT EXISTS knowledge_edges (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relationship TEXT NOT NULL,
    confidence REAL DEFAULT 1.0,
    FOREIGN KEY (source_id) REFERENCES symbols(id) ON DELETE CASCADE
  );`,
    `CREATE INDEX IF NOT EXISTS idx_edges_source ON knowledge_edges(source_id);`,
    `CREATE INDEX IF NOT EXISTS idx_edges_target ON knowledge_edges(target_id);`,
    // 6. Architectural Decision Records (ADRs)
    `CREATE TABLE IF NOT EXISTS architectural_decisions (
    id TEXT PRIMARY KEY,
    workspace_root TEXT NOT NULL,
    title TEXT NOT NULL,
    decision TEXT NOT NULL,
    rationale TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    tags_json TEXT
  );`,
    // 7. Workspace & Project Memories
    `CREATE TABLE IF NOT EXISTS workspace_memories (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value_json TEXT NOT NULL,
    tags_json TEXT,
    updated_at INTEGER NOT NULL
  );`
];
//# sourceMappingURL=schema.js.map