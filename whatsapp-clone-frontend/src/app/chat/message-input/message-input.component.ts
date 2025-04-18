import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Conversation } from '../../models/conversation.model';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent implements OnInit {
  @Input() conversation!: Conversation;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  messageText: string = '';
  selectedFiles: File[] = [];
  sending: boolean = false;
  
  constructor(private messageService: MessageService) { }
  
  ngOnInit(): void {
  }
  
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }
  
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
      }
    }
  }
  
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  
  sendMessage(): void {
    if ((!this.messageText || !this.messageText.trim()) && this.selectedFiles.length === 0) {
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
      
      this.messageService.send({
        conversation_id: this.conversation.id,
        content: this.messageText.trim(),
        files: this.selectedFiles
      }).subscribe({
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
      
      this.messageService.send({
        group_id: this.conversation.id,
        content: this.messageText.trim(),
        files: this.selectedFiles
      }).subscribe({
        next: () => {
          this.resetForm();
        },
        error: () => {
          this.sending = false;
        }
      });
    }
  }
  
  private resetForm(): void {
    this.messageText = '';
    this.selectedFiles = [];
    this.sending = false;
  }
}
