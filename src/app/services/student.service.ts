import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { catchError, map } from 'rxjs/operators';
import { Student } from '../core/models';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient,  private errorHandler: ErrorHandlerService) {}


  // Método para obtener todos los estudiantes
  getAllStudents(): Observable<Student[]> {
    return this.http.get<{ data: Student[], message: string, error: boolean, code: number }>(this.baseUrl + "/all").pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Método para buscar estudiantes por matrícula
  getStudentByMatricula(matricula: string): Observable<Student> {
    return this.http.get<{ data: Student, message: string, error: boolean, code: number }>(`${this.baseUrl}/get-by-matricula/${matricula}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

 // Método para buscar estudiantes por coincidencia en email
getStudentsByEmailLike(email: string): Observable<Student[]> {
  return this.http.get<{ data: Student[], message: string, error: boolean, code: number }>(
    `${this.baseUrl}/get-by-email/${email}`
  ).pipe(
    map(response => {
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    }),
    catchError(err => this.errorHandler.handleError(err))
  );
}

  // Método para registrar un nuevo estudiante
  registerStudent(student: Student): Observable<Student> {
    return this.http.post<{ data: Student, message: string, error: boolean, code: number }>(`${this.baseUrl}/register`, student).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Método para actualizar un estudiante
  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<{ data: Student, message: string, error: boolean, code: number }>(`${this.baseUrl}/update/${id}`, student).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  // Método para eliminar un estudiante
  deleteStudent(id: number): Observable<string> {
    return this.http.delete<{ data: string, message: string, error: boolean, code: number }>(`${this.baseUrl}/delete/${id}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  searchByName(email: string): Observable<Student[]> {
    return this.http.get<{ data: Student[], message: string, error: boolean, code: number }>(`${this.baseUrl}/get-by-email/${encodeURIComponent(email)}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}