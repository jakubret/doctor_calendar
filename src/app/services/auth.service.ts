import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users'; // API URL
  private currentUserSubject: BehaviorSubject<any | null>; // Przechowywanie aktualnego użytkownika
  public currentUser$: Observable<any | null>; // Strumień dla komponentów

  constructor(private http: HttpClient) {
    // Inicjalizacja aktualnego użytkownika z localStorage
    const userData = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any | null>(
      userData ? JSON.parse(userData) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Logowanie użytkownika
   * @param credentials {username, password}
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap({
        next: (user: any) => {
          if (user && user.token) {
            // Przechowywanie użytkownika w localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      })
    );
  }

  /**
   * Rejestracja nowego użytkownika
   * @param data Obiekt z danymi do rejestracji (username, password, role)
   */
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap({
        error: (error) => {
          console.error('Registration failed:', error);
        },
      })
    );
  }

  /**
   * Wylogowanie użytkownika
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Pobieranie roli zalogowanego użytkownika
   * @returns Rola użytkownika (doctor/patient) lub pusty string
   */
  getUserRole(): string {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role || '';
  }

  /**
   * Pobieranie ID zalogowanego użytkownika
   * @returns ID użytkownika lub null
   */
/**
   * Pobieranie roleId zalogowanego użytkownika
   * @returns Role ID użytkownika lub null
   */
  getRoleId(): number | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.roleId || null;
  }

  /**
   * Pobieranie ID użytkownika (dla kompatybilności)
   * @returns Role ID użytkownika (zamienione na getRoleId)
   */
 getUserId(): number | null {
    return this.getRoleId();
  }

  /**
   * Sprawdzanie, czy użytkownik jest zalogowany
   * @returns true, jeśli zalogowany; false w przeciwnym razie
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Pobieranie tokena autoryzacyjnego
   * @returns Token JWT lub null
   */
  getToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.token || null;
  }

  /**
   * Aktualizacja danych użytkownika w localStorage i BehaviorSubject
   * @param updatedData Zaktualizowane dane użytkownika
   */
  updateCurrentUser(updatedData: any): void {
    const currentUser = { ...this.currentUserSubject.value, ...updatedData };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUserSubject.next(currentUser);
  }
}
