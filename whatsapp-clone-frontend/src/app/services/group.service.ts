import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/groups`;
  
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }
  
  get(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }
  
  create(data: { name: string, description?: string, user_ids: number[] }): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, data);
  }
  
  update(id: number, data: { name?: string, description?: string }): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, data);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  addUser(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/users`, { user_id: userId });
  }
  
  removeUser(groupId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${groupId}/users/${userId}`);
  }
}