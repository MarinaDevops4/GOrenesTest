import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import usersData from './../../../assets/storageData/users.json'; // Importación de datos de usuarios (asumo que está bien)
import { User } from './../../models/user'; // Importación del modelo de usuario

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>; // Sujeto para el usuario actual
  public currentUser: Observable<User | null>; // Observable para el usuario actual

  private currentUserKey = 'currentUser'; // Clave para el usuario actual en el almacenamiento local

  constructor() {
    // Inicialización del sujeto del usuario actual con los datos almacenados en el localStorage
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    // Asignación del observable a partir del sujeto del usuario actual
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter para obtener el valor actual del usuario
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<User | null> {
    // Simulación de verificación de credenciales
    const user = usersData.users.find(u => u.email === email && u.password === password); // Buscar usuario por email y contraseña

    if (user) {
      // Si se encuentra el usuario, se guarda en el localStorage y se emite en el sujeto del usuario actual
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user); // Se devuelve un observable con el usuario
    } else {
      return of(null); // Si no se encuentra el usuario, se devuelve un observable nulo
    }
  }

  // Método para cerrar sesión
  logout(): void {
    // Elimina el usuario actual del localStorage y emite un valor nulo en el sujeto del usuario actual
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Método para obtener el usuario actual del localStorage
  getCurrentUser(): User | null {
    const userString = localStorage.getItem(this.currentUserKey); // Obtener el usuario en formato string desde el localStorage
    return userString ? JSON.parse(userString) : null; // Convertir el string a objeto JSON si existe, de lo contrario, devolver nulo
  }
}
