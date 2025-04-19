import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Group } from '../models/group.model';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/groups`;
  private isDemoMode = environment.production && (environment as any).demoMode;
  
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }
  
  getAll(): Observable<Group[]> {
    if (this.isDemoMode) {
      return of(this.mockDataService.getGroups());
    }
    return this.http.get<Group[]>(this.apiUrl);
  }
  
  get(id: number): Observable<Group> {
    if (this.isDemoMode) {
      const groups = this.mockDataService.getGroups();
      const group = groups.find(g => g.id === id);
      if (group) {
        return of(group);
      }
    }
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }
  
  create(data: { name: string, description?: string, user_ids: number[] }): Observable<Group> {
    if (this.isDemoMode) {
      const newGroup = this.mockDataService.addGroup({
        name: data.name,
        description: data.description || '',
        user_ids: data.user_ids
      });
      return of(newGroup);
    }
    return this.http.post<Group>(this.apiUrl, data);
  }
  
  update(id: number, data: { name?: string, description?: string }): Observable<Group> {
    if (this.isDemoMode) {
      const groups = this.mockDataService.getGroups();
      const groupIndex = groups.findIndex(g => g.id === id);
      if (groupIndex >= 0) {
        const updatedGroup = { ...groups[groupIndex], ...data };
        groups[groupIndex] = updatedGroup;
        return of(updatedGroup);
      }
    }
    return this.http.put<Group>(`${this.apiUrl}/${id}`, data);
  }
  
  delete(id: number): Observable<any> {
    if (this.isDemoMode) {
      return of({ message: 'Groupe supprime avec succes' });
    }
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  addUser(groupId: number, userId: number): Observable<any> {
    if (this.isDemoMode) {
      const groups = this.mockDataService.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex >= 0) {
        const group = groups[groupIndex];
        if (!group.members.some(m => m.id === userId)) {
          const users = this.mockDataService.getUsers();
          const user = users.find(u => u.id === userId);
          if (user) {
            group.members.push(user);
          }
        }
        return of({ message: 'Utilisateur ajoute avec succes' });
      }
    }
    return this.http.post(`${this.apiUrl}/${groupId}/users`, { user_id: userId });
  }
  
  removeUser(groupId: number, userId: number): Observable<any> {
    if (this.isDemoMode) {
      const groups = this.mockDataService.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex >= 0) {
        const group = groups[groupIndex];
        group.members = group.members.filter(m => m.id !== userId);
        return of({ message: 'Utilisateur supprime avec succes' });
      }
    }
    return this.http.delete(`${this.apiUrl}/${groupId}/users/${userId}`);
  }
}