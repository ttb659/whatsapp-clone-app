export interface FileAttachment {
  id: number;
  message_id: number;
  path: string;
  type: string;
  name: string;
  size: number;
  created_at?: string;
  updated_at?: string;
  
  // Helper properties for UI
  url?: string;
  isImage?: boolean;
  isVideo?: boolean;
  isDocument?: boolean;
}