import { IContextItem } from './context-package';

export class ContextRankingService {
  rankItems(items: IContextItem[], activeFile?: string): IContextItem[] {
    return items.map((item) => {
      let score = item.score;
      if (activeFile && item.content.includes(activeFile)) {
        score += 20;
      }
      return { ...item, score };
    }).sort((a, b) => b.score - a.score);
  }
}
