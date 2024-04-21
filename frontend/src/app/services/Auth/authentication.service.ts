import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserKey = 'currentUser';
  private accessTokenKey = 'accessToken';
  private tokenKey = 'accessToken';
  
  private apiUrl = 'http://localhost:3000/api/users/login';

  constructor(private http: HttpClient) {
  }

  logout(): void {
    // Elimina el usuario actual y el token del localStorage
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.accessTokenKey);
  }


  getCurrentUser(): any {
    const userString = localStorage.getItem(this.currentUserKey);
    return userString ? JSON.parse(userString) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  isAuthenticated(): boolean {
    // Verifica si el token de acceso está presente y es válido
    return !!this.getAccessToken();
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(this.apiUrl, loginData)
      .pipe(
        map(response => {
          // Process login response (e.g., store JWT token)
          return response;
        })
      );
  }



}
