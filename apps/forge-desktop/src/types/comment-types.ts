export interface CommentItem {
  id: string;
  author: string;
  avatarUrl?: string;
  text: string;
  timestamp: number;
}

export interface CommentThreadData {
  id: string;
  targetId: string; // taskId, fileIndex, or hunkIndex
  status: 'open' | 'resolved';
  comments: CommentItem[];
}
