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
export declare class MemoryRegistry {
    private readonly records;
    private readonly policies;
    constructor();
    addRecord(record: IMemoryRecord): void;
    getRecords(type: IMemoryRecord['type']): IMemoryRecord[];
    clear(type?: IMemoryRecord['type']): void;
}
