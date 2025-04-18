import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { WebsocketService } from '../../services/websocket.service';
import { AuthService } from '../../services/auth.service';
import { Conversation } from '../../models/conversation.model';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { FileAttachment } from '../../models/file.model';

@Component({
  selector: 'app-message-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
  standalone: true
})
export class MessageListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() conversation: Conversation | null = null;
  @ViewChild('messageContainer') messageContainer: ElementRef | null = null;
  
  messages: Message[] = [];
  currentUser: User | null = null;
  loading = false;
  private messageSubscription: Subscription | null = null;
  private messageDeletedSubscription: Subscription | null = null;
  
  constructor(
    private messageService: MessageService,
    private websocketService: WebsocketService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.messageSubscription = this.websocketService.onMessage().subscribe(message => {
      if (this.conversation && 
          ((message.conversation_id && message.conversation_id === this.conversation.id) ||
           (message.group_id && message.group_id === this.conversation.id))) {
        this.messages.push(message);
        this.scrollToBottom();
      }
    });
    
    this.messageDeletedSubscription = this.websocketService.onMessageDeleted().subscribe(data => {
      const index = this.messages.findIndex(m => m.id === data.message_id);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && this.conversation) {
      this.loadMessages();
    }
  }
  
  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    
    if (this.messageDeletedSubscription) {
      this.messageDeletedSubscription.unsubscribe();
    }
  }
  
  loadMessages(): void {
    if (!this.conversation) {
      return;
    }
    
    this.loading = true;
    
    if (this.conversation.user) {
      // This is a direct conversation
      this.messageService.getConversationMessages(this.conversation.id)
        .subscribe({
          next: messages => {
            this.messages = messages;
            this.loading = false;
            this.scrollToBottom();
          },
          error: () => {
            this.loading = false;
          }
        });
    } else if (this.conversation.users) {
      // This is a group conversation
      this.messageService.getGroupMessages(this.conversation.id)
        .subscribe({
          next: messages => {
            this.messages = messages;
            this.loading = false;
            this.scrollToBottom();
          },
          error: () => {
            this.loading = false;
          }
        });
    }
  }
  
  deleteMessage(message: Message): void {
    this.messageService.delete(message.id).subscribe(() => {
      const index = this.messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    });
  }
  
  isCurrentUserMessage(message: Message): boolean {
    return this.currentUser?.id === message.user_id;
  }
  
  getFileUrl(file: FileAttachment): string {
    return file.url || '';
  }
  
  isImage(file: FileAttachment): boolean {
    return file.type.startsWith('image/');
  }
  
  isVideo(file: FileAttachment): boolean {
    return file.type.startsWith('video/');
  }
  
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }
}
