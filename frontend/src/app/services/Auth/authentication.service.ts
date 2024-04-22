import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private accessTokenKey = 'accessToken';
  private authenticationChanged = new BehaviorSubject<boolean>(this.isAuthenticated());

  // URL de la API
  private apiURL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Método para cerrar sesión.
   */
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    this.authenticationChanged.next(false);
  }

  /**
   * Método para obtener el token de acceso almacenado en el almacenamiento local.
   * @returns El token de acceso o null si no está presente.
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  /**
   * Método para obtener información de usuario utilizando el token de acceso.
   * @param token El token de acceso del usuario.
   * @returns Un observable que emite la información del usuario.
   */
  getUserByToken(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any>(`${this.apiURL}/${token}`, { headers });
  }

  /**
   * Método para verificar si el usuario está autenticado basado en la existencia y validez del token de acceso.
   * @returns True si el usuario está autenticado, false en caso contrario.
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenPayload.exp * 1000);
    return expirationDate > new Date();
  }

  /**
   * Método para almacenar el token de acceso en el almacenamiento local.
   * @param token El token de acceso a almacenar.
   */
  setToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
    this.authenticationChanged.next(true);
  }

  /**
   * Método para obtener un observable que emite un booleano indicando si el estado de autenticación ha cambiado.
   * @returns Un observable que emite true cuando el estado de autenticación cambia.
   */
  getAuthenticationChanged(): Observable<boolean> {
    return this.authenticationChanged.asObservable();
  }

  /**
   * Método para iniciar sesión utilizando las credenciales proporcionadas.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Un observable que emite la respuesta del servidor.
   */
  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiURL}/login`, loginData);
  }

  /**
   * Método para registrar un nuevo usuario.
   * @param userData Los datos del usuario a registrar.
   * @returns Un observable que emite la respuesta del servidor.
   */
  registerUser(userData: object): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/register`, userData);
  }
}
