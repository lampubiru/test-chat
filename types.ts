
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isWorkflow?: boolean;
}
