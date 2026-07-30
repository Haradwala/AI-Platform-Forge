export interface OutcomeEvent {
  readonly type: 'outcome:created' | 'outcome:failed';
  readonly timestamp: string;
  readonly metadata?: Record<string, any>;
}
