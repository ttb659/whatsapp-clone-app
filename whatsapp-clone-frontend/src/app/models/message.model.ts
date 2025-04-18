import { User } from './user.model';
import { FileAttachment } from './file.model';

export interface Message {
  id: number;
  sender_id: number;
  conversation_id?: number;
  group_id?: number;
  content: string;
  is_read: boolean;
  is_edited: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  sender?: User;
  files?: FileAttachment[];
  
  // Virtual properties for component usage
  user?: User; // Alias for sender
  user_id?: number; // Alias for sender_id
  read_at?: string; // For read status display
}
