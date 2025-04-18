import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = `${environment.apiUrl}/conversations`;
  
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.apiUrl);
  }
  
  get(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/${id}`);
  }
  
  create(userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(this.apiUrl, { user_id: userId });
  }
  
  update(id: number, data: Partial<Conversation>): Observable<Conversation> {
    return this.http.put<Conversation>(`${this.apiUrl}/${id}`, data);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}