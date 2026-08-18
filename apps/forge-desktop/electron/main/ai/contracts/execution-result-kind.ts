/**
 * execution-result-kind.ts — Tool Output Type Enum
 */

export enum ExecutionResultKind {
  FILE_LIST = 'FILE_LIST',
  WORKSPACE_STATS = 'WORKSPACE_STATS',
  FILE_CONTENT = 'FILE_CONTENT',
  SEARCH_RESULTS = 'SEARCH_RESULTS',
  TERMINAL_OUTPUT = 'TERMINAL_OUTPUT',
  GIT_DIFF = 'GIT_DIFF',
  ERROR_TRACE = 'ERROR_TRACE',
  UNKNOWN = 'UNKNOWN',
}
