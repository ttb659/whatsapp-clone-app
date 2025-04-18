import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessageService } from '../../services/message.service';
import { Conversation } from '../../models/conversation.model';
import { FileAttachment } from '../../models/file.model';

@Component({
  selector: 'app-message-input',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
  standalone: true
})
export class MessageInputComponent {
  @Input() conversation: Conversation | null = null;
  @ViewChild('fileInput') fileInput: ElementRef | null = null;
  
  messageText = '';
  selectedFiles: File[] = [];
  sending = false;
  
  constructor(private messageService: MessageService) {}
  
  sendMessage(): void {
    if ((!this.messageText || this.messageText.trim() === '') && this.selectedFiles.length === 0) {
      return;
    }
    
    if (!this.conversation) {
      return;
    }
    
    this.sending = true;
    
    const formData = new FormData();
    formData.append('content', this.messageText.trim());
    
    // Add files if any
    this.selectedFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    if (this.conversation.user) {
      // This is a direct conversation
      formData.append('conversation_id', this.conversation.id.toString());
      
      this.messageService.sendToConversation(formData).subscribe({
        next: () => {
          this.resetForm();
        },
        error: () => {
          this.sending = false;
        }
      });
    } else if (this.conversation.users) {
      // This is a group conversation
      formData.append('group_id', this.conversation.id.toString());
      
      this.messageService.sendToGroup(formData).subscribe({
        next: () => {
          this.resetForm();
        },
        error: () => {
          this.sending = false;
        }
      });
    }
  }
  
  openFileSelector(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }
  
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...files];
    }
  }
  
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  
  private resetForm(): void {
    this.messageText = '';
    this.selectedFiles = [];
    this.sending = false;
  }
}
