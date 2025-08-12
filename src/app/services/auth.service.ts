import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap, mapTo } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, RegistroRequest, Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  get currentUserValue(): Usuario | null { return this.currentUserSubject.value; }
  get tokenValue(): string | null { return this.tokenSubject.value; }

  get isAuthenticated(): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    return !!this.tokenValue && !!expiry && new Date(expiry) > new Date();
  }
  get isAdmin(): boolean { return this.currentUserValue?.rol === 'Administrador'; }
  get isRecolector(): boolean { return this.currentUserValue?.rol === 'Recolector'; }

  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/Usuarios/login`, credentials).pipe(
      tap(({ token }) => this.setTokenOnly(token)),
      switchMap(() => this.refreshUserData()),
      mapTo(void 0)
    );
  }

  register(userData: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Usuarios/registro`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  refreshUserData(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/Usuarios/perfil`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  private setTokenOnly(token: string) {
    localStorage.setItem('token', token);
    const exp = this.getJwtExp(token);
    if (exp) localStorage.setItem('tokenExpiry', new Date(exp * 1000).toISOString());
    this.tokenSubject.next(token);
  }

  private getJwtExp(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' ? payload.exp : null;
    } catch { return null; }
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const expiry = localStorage.getItem('tokenExpiry');

    if (token && expiry && new Date(expiry) > new Date()) {
      this.tokenSubject.next(token);
      if (userStr) {
        this.currentUserSubject.next(JSON.parse(userStr) as Usuario);
      }
    } else {
      this.logout();
    }
  }
}
