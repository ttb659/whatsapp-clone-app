import { User } from './user.model';
import { Message } from './message.model';

export interface Conversation {
  id: number;
  user_one_id: number;
  user_two_id: number;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  user_one?: User;
  user_two?: User;
  messages?: Message[];
  
  // Helper properties for UI
  unread_count?: number;
  last_message?: Message;
}