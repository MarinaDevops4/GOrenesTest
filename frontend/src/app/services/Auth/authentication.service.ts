import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import usersData from './../../../assets/storageData/users.json';
import { User } from './../../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private currentUserKey = 'currentUser';

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User | null> {
    // Simula la verificación de las credenciales
    // solicitud HTTP real a tu servidor de backend
    const user = usersData.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    } else {
      return of(null);
    }
  }

  logout(): void {
    // Limpiamos el usuario actual almacenado en el almacenamiento local
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    // Obtener datos de usuario del LocalStorage al cargar la aplicación
    const userString = localStorage.getItem(this.currentUserKey);
    return userString ? JSON.parse(userString) : null;
  }
}
