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
}