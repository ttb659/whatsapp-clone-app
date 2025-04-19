import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;
  private isDemoMode = environment.production && (environment as any).demoMode;
  
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }
  
  getConversationMessages(conversationId: number): Observable<Message[]> {
    if (this.isDemoMode) {
      return of(this.mockDataService.getConversationMessages(conversationId));
    }
    return this.http.get<Message[]>(`${environment.apiUrl}/conversations/${conversationId}/messages`);
  }
  
  getGroupMessages(groupId: number): Observable<Message[]> {
    if (this.isDemoMode) {
      return of(this.mockDataService.getGroupMessages(groupId));
    }
    return this.http.get<Message[]>(`${environment.apiUrl}/groups/${groupId}/messages`);
  }
  
  get(id: number): Observable<Message> {
    if (this.isDemoMode) {
      // Rechercher dans toutes les conversations et groupes
      for (const conversationId of [1, 2, 3]) {
        const messages = this.mockDataService.getConversationMessages(conversationId);
        const message = messages.find(m => m.id === id);
        if (message) {
          return of(message);
        }
      }
      
      for (const groupId of [1, 2]) {
        const messages = this.mockDataService.getGroupMessages(groupId);
        const message = messages.find(m => m.id === id);
        if (message) {
          return of(message);
        }
      }
    }
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }
  
  send(data: { conversation_id?: number, group_id?: number, content: string, files?: File[] }): Observable<Message> {
    if (this.isDemoMode) {
      const newMessage: Partial<Message> = {
        content: data.content,
        conversation_id: data.conversation_id,
        group_id: data.group_id
      };
      
      return of(this.mockDataService.addMessage(newMessage));
    }
    
    const formData = new FormData();
    
    if (data.conversation_id) {
      formData.append('conversation_id', data.conversation_id.toString());
    }
    
    if (data.group_id) {
      formData.append('group_id', data.group_id.toString());
    }
    
    formData.append('content', data.content);
    
    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    }
    
    return this.http.post<Message>(this.apiUrl, formData);
  }
  
  // Alias methods for component compatibility
  sendToConversation(formData: FormData): Observable<Message> {
    if (this.isDemoMode) {
      const conversationId = Number(formData.get('conversation_id'));
      const content = formData.get('content') as string;
      
      const newMessage: Partial<Message> = {
        content: content,
        conversation_id: conversationId
      };
      
      return of(this.mockDataService.addMessage(newMessage));
    }
    return this.http.post<Message>(this.apiUrl, formData);
  }
  
  sendToGroup(formData: FormData): Observable<Message> {
    if (this.isDemoMode) {
      const groupId = Number(formData.get('group_id'));
      const content = formData.get('content') as string;
      
      const newMessage: Partial<Message> = {
        content: content,
        group_id: groupId
      };
      
      return of(this.mockDataService.addMessage(newMessage));
    }
    return this.http.post<Message>(this.apiUrl, formData);
  }
  
  update(id: number, content: string): Observable<Message> {
    if (this.isDemoMode) {
      // Rechercher le message dans toutes les conversations et groupes
      for (const conversationId of [1, 2, 3]) {
        const messages = this.mockDataService.getConversationMessages(conversationId);
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex >= 0) {
          const updatedMessage = { ...messages[messageIndex], content, is_edited: true };
          messages[messageIndex] = updatedMessage;
          return of(updatedMessage);
        }
      }
      
      for (const groupId of [1, 2]) {
        const messages = this.mockDataService.getGroupMessages(groupId);
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex >= 0) {
          const updatedMessage = { ...messages[messageIndex], content, is_edited: true };
          messages[messageIndex] = updatedMessage;
          return of(updatedMessage);
        }
      }
    }
    return this.http.put<Message>(`${this.apiUrl}/${id}`, { content });
  }
  
  delete(id: number): Observable<any> {
    if (this.isDemoMode) {
      return of({ message: 'Message supprime avec succes' });
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  markAsRead(id: number): Observable<Message> {
    if (this.isDemoMode) {
      // Rechercher le message dans toutes les conversations et groupes
      for (const conversationId of [1, 2, 3]) {
        const messages = this.mockDataService.getConversationMessages(conversationId);
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex >= 0) {
          const updatedMessage = { ...messages[messageIndex], is_read: true };
          messages[messageIndex] = updatedMessage;
          return of(updatedMessage);
        }
      }
      
      for (const groupId of [1, 2]) {
        const messages = this.mockDataService.getGroupMessages(groupId);
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex >= 0) {
          const updatedMessage = { ...messages[messageIndex], is_read: true };
          messages[messageIndex] = updatedMessage;
          return of(updatedMessage);
        }
      }
    }
    return this.http.put<Message>(`${this.apiUrl}/${id}/read`, {});
  }
}
