import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  // Método para manejar errores de API de manera consistente
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error en la operación';
    
    // Si es una respuesta de error del servidor con nuestro formato
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      errorMessage = error.error.message;
    } else if (error.status) {
      // Errores HTTP comunes
      switch (error.status) {
        case 404:
          errorMessage = 'No se encontró el recurso solicitado';
          break;
        case 400:
          errorMessage = 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso prohibido';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    const enhancedError = new Error(errorMessage);
    return throwError(() => enhancedError);
  }
}