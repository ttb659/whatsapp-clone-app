import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;
  
  constructor(private http: HttpClient) { }
  
  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/conversations/${conversationId}/messages`);
  }
  
  getGroupMessages(groupId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/groups/${groupId}/messages`);
  }
  
  get(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }
  
  send(data: { conversation_id?: number, group_id?: number, content: string, files?: File[] }): Observable<Message> {
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
    return this.http.post<Message>(this.apiUrl, formData);
  }
  
  sendToGroup(formData: FormData): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, formData);
  }
  
  update(id: number, content: string): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, { content });
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  markAsRead(id: number): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}/read`, {});
  }
}
