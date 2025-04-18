import { User } from './user.model';
import { Message } from './message.model';

export interface Group {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  creator?: User;
  users?: User[];
  messages?: Message[];
  
  // Helper properties for UI
  unread_count?: number;
  last_message?: Message;
}