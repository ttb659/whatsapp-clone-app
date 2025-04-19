import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private isDemoMode = environment.production && (environment as any).demoMode;
  
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {
    this.loadUserFromStorage();
  }
  
  initAuth(): void {
    this.loadUserFromStorage();
    
    // En mode démo, on connecte automatiquement l'utilisateur
    if (this.isDemoMode && !this.isAuthenticated) {
      this.demoLogin();
    }
  }
  
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  public get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  public get token(): string | null {
    return localStorage.getItem('token');
  }
  
  register(data: RegisterRequest): Observable<AuthResponse> {
    if (this.isDemoMode) {
      return this.demoRegister(data);
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }
  
  login(data: LoginRequest): Observable<AuthResponse> {
    if (this.isDemoMode) {
      return this.demoLogin();
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }
  
  logout(): Observable<any> {
    if (this.isDemoMode) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      return of({ message: 'Déconnecté avec succès' });
    }
    
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        })
      );
  }
  
  refreshUser(): Observable<User> {
    if (this.isDemoMode) {
      const user = this.mockDataService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      return of(user);
    }
    
    return this.http.get<User>(`${this.apiUrl}/user`)
      .pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }
  
  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }
  
  // Méthodes pour le mode démo
  private demoLogin(data?: LoginRequest): Observable<AuthResponse> {
    const user = this.mockDataService.getCurrentUser();
    const response: AuthResponse = {
      token: 'demo-token-123456789',
      user: user
    };
    
    this.handleAuthentication(response);
    return of(response);
  }
  
  private demoRegister(data: RegisterRequest): Observable<AuthResponse> {
    // En mode démo, on utilise toujours le même utilisateur
    return this.demoLogin();
  }
}
