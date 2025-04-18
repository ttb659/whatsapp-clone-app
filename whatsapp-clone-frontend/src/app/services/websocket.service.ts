import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | null = null;
  private messageSubject = new Subject<Message>();
  private messageDeletedSubject = new Subject<{ message_id: number }>();
  
  constructor(private authService: AuthService) { }
  
  connect(): void {
    if (this.socket) {
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
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  joinConversation(conversationId: number): void {
    if (this.socket) {
      this.socket.emit('join-conversation', { conversation_id: conversationId });
    }
  }
  
  leaveConversation(conversationId: number): void {
    if (this.socket) {
      this.socket.emit('leave-conversation', { conversation_id: conversationId });
    }
  }
  
  joinGroup(groupId: number): void {
    if (this.socket) {
      this.socket.emit('join-group', { group_id: groupId });
    }
  }
  
  leaveGroup(groupId: number): void {
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
}