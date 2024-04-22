import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessTokenKey = 'accessToken';
  private authenticationChanged = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    this.authenticationChanged.next(false);
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenPayload.exp * 1000);
    return expirationDate > new Date();
  }

  setToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
    this.authenticationChanged.next(true);
  }

  getAuthenticationChanged(): Observable<boolean> {
    return this.authenticationChanged.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>('http://localhost:3000/api/users/login', loginData);
  }
}
