import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../services/conversation.service';
import { WebsocketService } from '../../services/websocket.service';
import { Conversation } from '../../models/conversation.model';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-conversation-list',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss',
  standalone: true
})
export class ConversationListComponent implements OnInit {
  @Output() conversationSelected = new EventEmitter<Conversation>();
  
  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  searchTerm = '';
  selectedConversationId: number | null = null;
  
  constructor(
    private conversationService: ConversationService,
    private websocketService: WebsocketService
  ) {}
  
  ngOnInit(): void {
    this.loadConversations();
    
    // Listen for new messages
    this.websocketService.onMessage().subscribe((message: Message) => {
      this.updateConversationWithMessage(message);
    });
  }
  
  loadConversations(): void {
    this.conversationService.getAll().subscribe(conversations => {
      this.conversations = conversations;
      this.filteredConversations = [...this.conversations];
      this.sortConversations();
    });
  }
  
  selectConversation(conversation: Conversation): void {
    this.selectedConversationId = conversation.id;
    this.conversationSelected.emit(conversation);
  }
  
  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredConversations = [...this.conversations];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredConversations = this.conversations.filter(conv => 
      conv.user?.name.toLowerCase().includes(term) || 
      conv.last_message?.content.toLowerCase().includes(term)
    );
  }
  
  private updateConversationWithMessage(message: Message): void {
    // Find the conversation this message belongs to
    const conversationIndex = this.conversations.findIndex(c => 
      c.id === message.conversation_id
    );
    
    if (conversationIndex > -1) {
      // Update the conversation with the new message
      const conversation = { ...this.conversations[conversationIndex] };
      conversation.last_message = message;
      
      // If this is not the selected conversation, increment unread count
      if (this.selectedConversationId !== conversation.id) {
        conversation.unread_count = (conversation.unread_count || 0) + 1;
      }
      
      // Update the conversations array
      this.conversations[conversationIndex] = conversation;
      
      // Re-sort conversations to move this one to the top
      this.sortConversations();
      
      // Update filtered conversations
      this.search();
    }
  }
  
  private sortConversations(): void {
    // Sort by most recent message
    this.conversations.sort((a, b) => {
      const dateA = a.last_message?.created_at ? new Date(a.last_message.created_at) : new Date(0);
      const dateB = b.last_message?.created_at ? new Date(b.last_message.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }
}
