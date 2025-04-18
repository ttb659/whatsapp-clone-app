import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { Conversation } from '../../models/conversation.model';
import { User } from '../../models/user.model';
import { ConversationService } from '../../services/conversation.service';
import { AuthService } from '../../services/auth.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule
  ],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent implements OnInit, OnDestroy {
  @Output() conversationSelected = new EventEmitter<Conversation>();
  
  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  selectedConversationId: number | null = null;
  searchTerm: string = '';
  currentUser: User | null = null;
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private conversationService: ConversationService,
    private authService: AuthService,
    private websocketService: WebsocketService
  ) { }
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadConversations();
        }
      })
    );
    
    // Listen for new messages to update conversation list
    this.subscriptions.push(
      this.websocketService.onMessage().subscribe(() => {
        this.loadConversations();
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredConversations = [...this.conversations];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredConversations = this.conversations.filter(conv => 
      (conv.user?.name?.toLowerCase().includes(term) || false) || 
      (conv.last_message?.content.toLowerCase().includes(term) || false)
    );
  }
  
  selectConversation(conversation: Conversation): void {
    this.selectedConversationId = conversation.id;
    
    // Process the conversation to set the user property
    if (!conversation.is_group) {
      // For direct conversations, set the user to the other person
      if (this.currentUser) {
        if (conversation.user_one_id === this.currentUser.id) {
          conversation.user = conversation.user_two;
        } else {
          conversation.user = conversation.user_one;
        }
      }
    }
    
    this.conversationSelected.emit(conversation);
  }
  
  private loadConversations(): void {
    this.conversationService.getAll().subscribe(conversations => {
      // Process conversations to set the user property
      this.conversations = conversations.map(conv => {
        if (!conv.is_group && this.currentUser) {
          if (conv.user_one_id === this.currentUser.id) {
            conv.user = conv.user_two;
          } else {
            conv.user = conv.user_one;
          }
        }
        return conv;
      });
      
      this.filteredConversations = [...this.conversations];
    });
  }
}
