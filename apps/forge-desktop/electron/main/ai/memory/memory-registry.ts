export interface IMemoryRecord {
  id: string;
  type: 'conversation' | 'workspace' | 'decision' | 'pattern' | 'tool' | 'error' | 'preference' | 'session';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IMemoryPolicy {
  retention: number;
  priority: 'high' | 'normal' | 'low';
  persistence: boolean;
}

export class MemoryRegistry {
  private readonly records = new Map<string, IMemoryRecord[]>();
  private readonly policies = new Map<string, IMemoryPolicy>();

  constructor() {
    this.policies.set('conversation', { retention: 100, priority: 'normal', persistence: false });
    this.policies.set('workspace', { retention: 1000, priority: 'high', persistence: true });
    this.policies.set('decision', { retention: 500, priority: 'high', persistence: true });
    this.policies.set('pattern', { retention: 200, priority: 'normal', persistence: true });
    this.policies.set('tool', { retention: 100, priority: 'low', persistence: false });
    this.policies.set('error', { retention: 300, priority: 'normal', persistence: false });
    this.policies.set('preference', { retention: 50, priority: 'high', persistence: true });
    this.policies.set('session', { retention: 10, priority: 'low', persistence: false });
  }

  addRecord(record: IMemoryRecord): void {
    if (!this.records.has(record.type)) {
      this.records.set(record.type, []);
    }
    const list = this.records.get(record.type)!;
    list.push(record);

    const policy = this.policies.get(record.type);
    if (policy && list.length > policy.retention) {
      list.shift();
    }
  }

  getRecords(type: IMemoryRecord['type']): IMemoryRecord[] {
    return this.records.get(type) || [];
  }

  clear(type?: IMemoryRecord['type']): void {
    if (type) {
      this.records.delete(type);
    } else {
      this.records.clear();
    }
  }
}
