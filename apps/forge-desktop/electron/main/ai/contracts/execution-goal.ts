/**
 * execution-goal.ts — Planner Intent Enum
 */

export enum ExecutionGoal {
  FILE_CONTENT = 'FILE_CONTENT',
  FILE_LIST = 'FILE_LIST',
  WORKSPACE_STATISTICS = 'WORKSPACE_STATISTICS',
  SEARCH = 'SEARCH',
  RUN_TESTS = 'RUN_TESTS',
  RUN_TERMINAL = 'RUN_TERMINAL',
  GIT_DIFF = 'GIT_DIFF',
  UNKNOWN = 'UNKNOWN',
}
