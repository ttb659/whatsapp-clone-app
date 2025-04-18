import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { Conversation } from '../../models/conversation.model';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';
import { FileAttachment } from '../../models/file.model';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() conversation!: Conversation;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages: Message[] = [];
  loading: boolean = true;
  currentUser: User | null = null;
  
  private subscriptions: Subscription[] = [];
  private shouldScrollToBottom: boolean = true;
  
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private websocketService: WebsocketService
  ) { }
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
    
    this.loadMessages();
    
    // Listen for new messages
    this.subscriptions.push(
      this.websocketService.onMessage().subscribe(message => {
        if (this.isMessageForCurrentConversation(message)) {
          this.messages.push(message);
          this.shouldScrollToBottom = true;
        }
      })
    );
    
    // Listen for deleted messages
    this.subscriptions.push(
      this.websocketService.onMessageDeleted().subscribe(data => {
        const index = this.messages.findIndex(m => m.id === data.message_id);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      })
    );
  }
  
  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadMessages(): void {
    this.loading = true;
    
    if (this.conversation.user) {
      // This is a direct conversation
      this.messageService.getConversationMessages(this.conversation.id).subscribe({
        next: (messages) => {
          this.messages = messages;
          this.loading = false;
          this.shouldScrollToBottom = true;
          
          // Join the conversation room for real-time updates
          this.websocketService.joinConversation(this.conversation.id);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else if (this.conversation.users) {
      // This is a group conversation
      this.messageService.getGroupMessages(this.conversation.id).subscribe({
        next: (messages) => {
          this.messages = messages;
          this.loading = false;
          this.shouldScrollToBottom = true;
          
          // Join the group room for real-time updates
          this.websocketService.joinGroup(this.conversation.id);
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
    return this.currentUser?.id === (message.sender_id || message.user_id);
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
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  
  private isMessageForCurrentConversation(message: Message): boolean {
    if (this.conversation.user) {
      return message.conversation_id === this.conversation.id;
    } else if (this.conversation.users) {
      return message.group_id === this.conversation.id;
    }
    return false;
  }
}
