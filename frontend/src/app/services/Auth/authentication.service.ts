import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserKey = 'currentUser';
  private apiUrl = 'http://localhost:3000/api/users/login';

  constructor(private http: HttpClient) {
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
  // Método para cerrar sesión
  logout(): void {
    // Elimina el usuario actual del localStorage
    localStorage.removeItem(this.currentUserKey);
  }

  // Método para obtener el usuario actual del localStorage
  getCurrentUser(): any {
    const userString = localStorage.getItem(this.currentUserKey);
    return userString ? JSON.parse(userString) : null;
  }
}
