export interface RecoveryEvent {
  readonly type:
    | 'recovery:started'
    | 'recovery:analysis-complete'
    | 'recovery:strategy-selected'
    | 'recovery:attempt'
    | 'recovery:retry'
    | 'recovery:rollback'
    | 'recovery:replanned'
    | 'recovery:completed'
    | 'recovery:failed';
  readonly timestamp: string;
  readonly metadata?: Record<string, any>;
}
