import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Obtener el token de acceso de donde sea que esté almacenado en tu aplicación
    const accessToken = localStorage.getItem('accessToken');

    // Clonar la solicitud para no modificar la original
    let modifiedRequest = request.clone();

    // Agregar el token de acceso al encabezado de autorización si está disponible
    if (accessToken) {
      modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // Continuar con la solicitud modificada
    return next.handle(modifiedRequest);
  }
}
