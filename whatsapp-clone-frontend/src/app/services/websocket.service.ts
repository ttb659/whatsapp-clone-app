import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<Message>();
  private messageDeletedSubject = new Subject<{ message_id: number }>();
  private isDemoMode = environment.production && (environment as any).demoMode;
  private demoIntervalSubscription: any;
  private activeConversationId: number | null = null;
  private activeGroupId: number | null = null;
  
  constructor(
    private authService: AuthService,
    private mockDataService: MockDataService
  ) { }
  
  connect(): void {
    if (this.socket && !this.isDemoMode) {
      return;
    }
    
    if (this.isDemoMode) {
      // En mode demo, on simule des messages periodiques
      this.setupDemoMode();
      return;
    }
    
    this.socket = io(environment.wsUrl, {
      auth: {
        token: this.authService.token
      }
    });
    
    this.setupListeners();
  }
  
  disconnect(): void {
    if (this.isDemoMode) {
      if (this.demoIntervalSubscription) {
        this.demoIntervalSubscription.unsubscribe();
        this.demoIntervalSubscription = null;
      }
      return;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  joinConversation(conversationId: number): void {
    if (this.isDemoMode) {
      this.activeConversationId = conversationId;
      this.activeGroupId = null;
      return;
    }
    
    if (this.socket) {
      this.socket.emit('join-conversation', { conversation_id: conversationId });
    }
  }
  
  leaveConversation(conversationId: number): void {
    if (this.isDemoMode) {
      this.activeConversationId = null;
      return;
    }
    
    if (this.socket) {
      this.socket.emit('leave-conversation', { conversation_id: conversationId });
    }
  }
  
  joinGroup(groupId: number): void {
    if (this.isDemoMode) {
      this.activeGroupId = groupId;
      this.activeConversationId = null;
      return;
    }
    
    if (this.socket) {
      this.socket.emit('join-group', { group_id: groupId });
    }
  }
  
  leaveGroup(groupId: number): void {
    if (this.isDemoMode) {
      this.activeGroupId = null;
      return;
    }
    
    if (this.socket) {
      this.socket.emit('leave-group', { group_id: groupId });
    }
  }
  
  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }
  
  onMessageDeleted(): Observable<{ message_id: number }> {
    return this.messageDeletedSubject.asObservable();
  }
  
  private setupListeners(): void {
    if (!this.socket) {
      return;
    }
    
    this.socket.on('message', (message: Message) => {
      this.messageSubject.next(message);
    });
    
    this.socket.on('message-deleted', (data: { message_id: number }) => {
      this.messageDeletedSubject.next(data);
    });
  }
  
  private setupDemoMode(): void {
    // Simuler des messages toutes les 30 secondes
    this.demoIntervalSubscription = interval(30000).subscribe(() => {
      if (this.activeConversationId) {
        // Simuler un message dans la conversation active
        const conversation = this.mockDataService.getConversations().find(c => c.id === this.activeConversationId);
        if (conversation) {
          const otherUserId = this.authService.currentUserValue?.id === conversation.user_one_id 
            ? conversation.user_two_id 
            : conversation.user_one_id;
          
          const newMessage = this.mockDataService.addMessage({
            conversation_id: this.activeConversationId,
            content: 'Ceci est un message automatique en mode demo',
            user_id: otherUserId
          });
          
          this.messageSubject.next(newMessage);
        }
      } else if (this.activeGroupId) {
        // Simuler un message dans le groupe actif
        const group = this.mockDataService.getGroups().find(g => g.id === this.activeGroupId);
        if (group && group.members && group.members.length > 0) {
          // Choisir un membre aleatoire different de l'utilisateur courant
          const otherMembers = group.members?.filter((m: User) => m.id !== this.authService.currentUserValue?.id) || [];
          if (otherMembers.length > 0) {
            const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
            
            const newMessage = this.mockDataService.addMessage({
              group_id: this.activeGroupId,
              content: 'Ceci est un message de groupe automatique en mode demo',
              user_id: randomMember.id
            });
            
            this.messageSubject.next(newMessage);
          }
        }
      }
    });
  }
}
