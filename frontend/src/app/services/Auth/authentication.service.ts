import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessTokenKey = 'accessToken';
  private authenticationChanged = new BehaviorSubject<boolean>(this.isAuthenticated());

  private registerURL = 'http://localhost:3000/api/users/register';
  private loginURL = 'http://localhost:3000/api/users/login';

  private userURL = 'http://localhost:3000/api/users'; 
  constructor(private http: HttpClient) {}

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    this.authenticationChanged.next(false);
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  getUserByToken(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` }; 
    return this.http.get<any>(`${this.userURL}/${token}`, { headers });
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
    return this.http.post<any>(this.loginURL, loginData);
  }


  registerUser(userData: object): Observable<any> {
    console.log('API URL:', this.registerURL);
    
    console.log(userData);
    return this.http.post<any>(this.registerURL, userData);
  }

}
