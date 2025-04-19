import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = `${environment.apiUrl}/conversations`;
  private isDemoMode = environment.production && (environment as any).demoMode;
  
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }
  
  getAll(): Observable<Conversation[]> {
    if (this.isDemoMode) {
      return of(this.mockDataService.getConversations());
    }
    return this.http.get<Conversation[]>(this.apiUrl);
  }
  
  get(id: number): Observable<Conversation> {
    if (this.isDemoMode) {
      const conversations = this.mockDataService.getConversations();
      const conversation = conversations.find(c => c.id === id);
      if (conversation) {
        return of(conversation);
      }
    }
    return this.http.get<Conversation>(`${this.apiUrl}/${id}`);
  }
  
  create(userId: number): Observable<Conversation> {
    if (this.isDemoMode) {
      // En mode demo, on retourne une conversation existante
      const conversations = this.mockDataService.getConversations();
      const conversation = conversations.find(c => 
        c.user_one_id === userId || c.user_two_id === userId
      );
      if (conversation) {
        return of(conversation);
      }
      // Si aucune conversation n'existe avec cet utilisateur, on retourne la premiere
      return of(conversations[0]);
    }
    return this.http.post<Conversation>(this.apiUrl, { user_id: userId });
  }
  
  update(id: number, data: Partial<Conversation>): Observable<Conversation> {
    if (this.isDemoMode) {
      const conversations = this.mockDataService.getConversations();
      const conversation = conversations.find(c => c.id === id);
      if (conversation) {
        // Simuler une mise a jour
        const updatedConversation = { ...conversation, ...data };
        return of(updatedConversation);
      }
    }
    return this.http.put<Conversation>(`${this.apiUrl}/${id}`, data);
  }
  
  delete(id: number): Observable<any> {
    if (this.isDemoMode) {
      return of({ message: 'Conversation supprimee avec succes' });
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
