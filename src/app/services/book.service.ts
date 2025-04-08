import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { catchError, map } from 'rxjs/operators';
import { Book } from '../core/models';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) { }

  // Método para obtener todos los libros
  getAllBooks(): Observable<Book[]> {
    return this.http.get<{ data: Book[], message: string, error: boolean }>(this.baseUrl + "/all").pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message); // Lanza un error si la API responde con error
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al obtener libros: ${err.message}`);
      })
    );
  }

  // Método para buscar libros por título
  searchByTitle(title: string): Observable<Book[]> {
    return this.http.get<{ data: Book[], message: string, error: boolean }>(`${this.baseUrl}/search/title?title=${title}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message); 
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al buscar libros por título: ${err.message}`);
      })
    );
  }
  // Método para obtener un libro por ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<{ data: Book, message: string, error: boolean }>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al obtener libro por ID: ${err.message}`);
      })
    );
  }
  // Método para crear un nuevo libro
  createBook(book: Book): Observable<Book> {
    return this.http.post<{ data: Book, message: string, error: boolean }>(this.baseUrl + "/", book).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al crear libro: ${err.message}`);
      })
    );
  }
  // Método para actualizar un libro
  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<{ data: Book, message: string, error: boolean }>(`${this.baseUrl}/${id}`, book).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al actualizar libro: ${err.message}`);
      })
    );
  }
  // Método para cambiar la disponibilidad de un libro
  changeBookAvailability(id: number): Observable<Book> {
    return this.http.put<{ data: Book, message: string, error: boolean }>(`${this.baseUrl}/${id}/availability`, {}).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al cambiar la disponibilidad del libro: ${err.message}`);
      })
    );
  }// Método para eliminar un libro
  deleteBook(id: number): Observable<string> {
    return this.http.delete<{ data: string, message: string, error: boolean }>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al eliminar libro: ${err.message}`);
      })
    );
  }
  // Método para actualizar el stock de un libro
  updateStock(id: number, stock: number): Observable<void> {
    return this.http.put<{ data: void, message: string, error: boolean }>(`${this.baseUrl}/${id}/stock?stock=${stock}`, {}).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(`Error al actualizar stock del libro: ${err.message}`);
      })
    );
  }
}