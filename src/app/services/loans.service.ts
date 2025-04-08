import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { catchError, map } from 'rxjs/operators';
import { Loan } from '../core/models';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  // Obtener todos los préstamos
  getAllLoans(): Observable<Loan[]> {
    return this.http.get<{ data: Loan[], message: string, error: boolean, code: number }>(this.baseUrl + "/all").pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Obtener un préstamo por ID
  getLoanById(id: number): Observable<Loan> {
    return this.http.get<{ data: Loan, message: string, error: boolean, code: number }>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Obtener préstamos por nombre de estudiante o título de libro
  getLoansByStudenOrTitle(query: string): Observable<Loan[]> {
    return this.http.get<{ data: Loan[], message: string, error: boolean, code: number }>(`${this.baseUrl}/usuario/${query}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Crear un nuevo préstamo
  createLoan(loan: Loan): Observable<Loan> {
    return this.http.post<{ data: Loan, message: string, error: boolean, code: number }>(`${this.baseUrl}/register`, loan).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Actualizar un préstamo
  updateLoan(id: number, loan: Loan): Observable<Loan> {
    return this.http.put<{ data: Loan, message: string, error: boolean, code: number }>(`${this.baseUrl}/${id}`, loan).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Registrar devolución de un préstamo
  returnBook(id: number): Observable<Loan> {
    return this.http.patch<{ data: Loan, message: string, error: boolean, code: number }>(`${this.baseUrl}/${id}/devolver`, {}).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Cancelar un préstamo
  cancelLoan(id: number): Observable<Loan> {
    return this.http.patch<{ data: Loan, message: string, error: boolean, code: number }>(`${this.baseUrl}/${id}/cancelar`, {}).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Eliminar un préstamo
  deleteLoan(id: number): Observable<string> {
    return this.http.delete<{ data: string, message: string, error: boolean, code: number }>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.message;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}