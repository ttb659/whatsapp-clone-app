import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private isDemoMode = environment.production && (environment as any).demoMode;
  
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) { }
  
  getAll(): Observable<User[]> {
    if (this.isDemoMode) {
      return of(this.mockDataService.getUsers());
    }
    return this.http.get<User[]>(this.apiUrl);
  }
  
  get(id: number): Observable<User> {
    if (this.isDemoMode) {
      const users = this.mockDataService.getUsers();
      const user = users.find(u => u.id === id);
      if (user) {
        return of(user);
      }
    }
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  search(query: string): Observable<User[]> {
    if (this.isDemoMode) {
      const users = this.mockDataService.getUsers();
      const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(query.toLowerCase()) || 
        u.email.toLowerCase().includes(query.toLowerCase())
      );
      return of(filteredUsers);
    }
    return this.http.get<User[]>(`${this.apiUrl}/search?q=${query}`);
  }
  
  update(id: number, data: Partial<User>): Observable<User> {
    if (this.isDemoMode) {
      const users = this.mockDataService.getUsers();
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex >= 0) {
        const updatedUser = { ...users[userIndex], ...data };
        users[userIndex] = updatedUser;
        return of(updatedUser);
      }
    }
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }
  
  updateProfile(data: { name?: string, avatar?: File }): Observable<User> {
    if (this.isDemoMode) {
      const currentUser = this.mockDataService.getCurrentUser();
      if (data.name) {
        currentUser.name = data.name;
      }
      // En mode démo, on ne peut pas vraiment changer l'avatar
      return of(currentUser);
    }
    
    const formData = new FormData();
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    return this.http.post<User>(`${this.apiUrl}/profile`, formData);
  }
  
  updateStatus(status: string): Observable<User> {
    if (this.isDemoMode) {
      const currentUser = this.mockDataService.getCurrentUser();
      currentUser.status = status;
      return of(currentUser);
    }
    return this.http.put<User>(`${this.apiUrl}/status`, { status });
  }
  
  getContacts(): Observable<User[]> {
    if (this.isDemoMode) {
      // En mode démo, tous les utilisateurs sont des contacts
      return of(this.mockDataService.getUsers().filter(u => u.id !== this.mockDataService.getCurrentUser().id));
    }
    return this.http.get<User[]>(`${this.apiUrl}/contacts`);
  }
}