import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { AuthService } from '../../services/auth.service';
import { WebsocketService } from '../../services/websocket.service';
import { User } from '../../models/user.model';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-chat-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ConversationListComponent,
    MessageListComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-layout.component.html',
  styleUrl: './chat-layout.component.scss',
  standalone: true
})
export class ChatLayoutComponent implements OnInit {
  currentUser: User | null = null;
  selectedConversation: Conversation | null = null;
  isMobile = false;
  
  constructor(
    private authService: AuthService,
    private websocketService: WebsocketService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      if (user) {
        this.websocketService.connect();
      }
    });
    
    // Check if mobile view
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }
  
  onConversationSelected(conversation: Conversation): void {
    this.selectedConversation = conversation;
    
    if (this.selectedConversation) {
      // Join the conversation channel
      this.websocketService.joinConversation(this.selectedConversation.id);
    }
  }
  
  logout(): void {
    this.websocketService.disconnect();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
