export interface IEditor {
  readonly path: string;
  getValue(): string;
  setValue(value: string): void;
  focus(): void;
  dispose(): void;
}

export interface IEditorService {
  getActiveEditor(): IEditor | null;
}
