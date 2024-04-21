import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users/register';

  constructor(private http: HttpClient) { }

  registerUser(userData: object): Observable<any> {
    console.log('API URL:', this.apiUrl);
    
    console.log(userData);
    return this.http.post<any>(this.apiUrl, userData);
  }
}
