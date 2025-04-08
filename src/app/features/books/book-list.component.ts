import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { AlertService } from '../../services/alert.service';
import { Book } from '../../core/models';
import { BookFormComponent } from '../../shared/components/books/book-form.component';
import { StockModalComponent } from '../../shared/components/books/stock-modal.component';
import { AlertContainerComponent } from '../../shared/alert.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, BookFormComponent, StockModalComponent, AlertContainerComponent, FormsModule], 
  template: `
    <div class="container-fluid p-0">
      <div class="row m-0">
        <div class="col-12 px-3 py-3">
          <!-- Encabezado con título y acciones -->
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
            <div>
              <h2 class="mb-1 text-primary">Gestión de Libros</h2>
              <p class="text-muted mb-0">Administra el catálogo de libros de la biblioteca</p>
            </div>
            <div>
              <button class="btn btn-primary d-flex align-items-center shadow-sm" (click)="openForm(null)">
                <i class="bi bi-plus-lg me-2"></i> Agregar Libro
              </button>
            </div>
          </div>
          
          <!-- Barra de búsqueda y filtros -->
          <div class="card shadow-sm mb-4">
            <div class="card-body py-2">
              <div class="row g-2">
                <div class="col-md-7 col-lg-8">
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                      <i class="bi bi-search"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control border-start-0" 
                      placeholder="Buscar por título..." 
                      #searchInput
                      (keyup.enter)="searchBooks(searchInput.value)"
                      (input)="onSearchInputChange(searchInput.value)"
                    >
                    <button 
                      class="btn btn-primary" 
                      type="button"
                      (click)="searchBooks(searchInput.value)"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
                <div class="col-md-5 col-lg-4 d-flex justify-content-md-end align-items-center flex-wrap gap-2">
                  <div class="form-check form-switch me-3">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="showAvailable"
                      [(ngModel)]="showOnlyAvailable"
                      (change)="applyFilters()"
                    >
                    <label class="form-check-label" for="showAvailable">Solo disponibles</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado de carga -->
          <div *ngIf="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando libros...</p>
          </div>

          <!-- Mensaje de no resultados -->
          <div *ngIf="!loading && filteredBooks.length === 0" class="alert alert-info d-flex align-items-center">
            <i class="bi bi-info-circle me-2 fs-4"></i>
            <div>
              <strong>No se encontraron resultados.</strong>
              <p class="mb-0">No hay libros disponibles en el catálogo con los filtros seleccionados.</p>
              <button class="btn btn-sm btn-link ps-0 pt-1" (click)="resetFilters(searchInput)">Mostrar todos los libros</button>
            </div>
          </div>

          <!-- Vista de libros para pantallas grandes -->
          <div *ngIf="!loading && filteredBooks.length > 0" class="card shadow-sm d-none d-md-block">
          
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th class="ps-3">Título</th>
                      <th>Autor</th>
                      <th class="text-center">Stock</th>
                      <th>Editorial</th>
                      <th class="text-center">Disponible</th>
                      <th class="text-center pe-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let book of filteredBooks; let i = index" [ngClass]="{'bg-light': i % 2 === 0}">
                      <td class="ps-3">
                        <div class="d-flex align-items-center">
                          <div class="book-icon rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center">
                            <i class="bi bi-book"></i>
                          </div>
                          <div>{{ book.titulo }}</div>
                        </div>
                      </td>
                      <td>{{ book.autor || '--' }}</td>
                      <td class="text-center">
                        <span class="badge rounded-pill" [ngClass]="getStockBadgeClass(book.stock)">
                          {{ book.stock }}
                        </span>
                      </td>
                      <td>{{ book.editorial || '--' }}</td>
                      <td class="text-center">
                        <div class="form-check form-switch d-flex justify-content-center">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            [checked]="book.disponible"
                            (change)="toggleAvailability(book)"
                            style="cursor: pointer;"
                          >
                        </div>
                      </td>
                      <td class="text-center pe-3">
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="openForm(book)" title="Editar libro">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" (click)="openStockModal(book)" title="Actualizar stock">
                            <i class="bi bi-boxes"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card-footer bg-white py-2">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">Mostrando {{ filteredBooks.length }} de {{ books.length }} libros</span>
              </div>
            </div>
          </div>
          
          <!-- Vista de tarjetas para móviles -->
          <div *ngIf="!loading && filteredBooks.length > 0" class="d-md-none">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">Libros en catálogsso</h6>
              <span class="badge bg-primary rounded-pill">{{ filteredBooks.length }} libros</span>
            </div>
            
            <div class="row g-2">
              <div class="col-12" *ngFor="let book of filteredBooks">
                <div class="card mb-2">
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div class="d-flex align-items-center">
                        <div class="book-icon rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center">
                          <i class="bi bi-book"></i>
                        </div>
                        <h6 class="card-title mb-0 text-primary">{{ book.titulo }}</h6>
                      </div>
                      <span class="badge rounded-pill" [ngClass]="getStockBadgeClass(book.stock)">
                        {{ book.stock }} unid.
                      </span>
                    </div>
                    
                    <div class="row mb-2">
                      <div class="col-6">
                        <small class="text-muted d-block">Autor</small>
                        <span>{{ book.autor || '--' }}</span>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block">Editorial</small>
                        <span>{{ book.editorial || '--' }}</span>
                      </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          [checked]="book.disponible"
                          (change)="toggleAvailability(book)"
                          style="cursor: pointer;"
                        >
                        <label class="form-check-label small">
                          {{ book.disponible ? 'Disponible' : 'No disponible' }}
                        </label>
                      </div>
                      
                      <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" (click)="openForm(book)" title="Editar libro">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" (click)="openStockModal(book)" title="Actualizar stock">
                          <i class="bi bi-boxes"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-muted small mt-2 text-center">
              Mostrando {{ filteredBooks.length }} de {{ books.length }} libros
            </div>
          </div>

          <!-- Modal para formulario -->
          <div class="modal fade" [ngClass]="{ 'show d-block': showForm }" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <app-book-form 
                  *ngIf="showForm" 
                  [book]="selectedBook"
                  (save)="saveBook($event)"
                  (cancel)="closeForm()">
                </app-book-form>
              </div>
            </div>
          </div>
          <div *ngIf="showForm" class="modal-backdrop fade show"></div>

          <!-- Modal para actualizar stock -->
          <div class="modal fade" [ngClass]="{ 'show d-block': showStockModal }" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
              <div class="modal-content">
                <app-stock-modal
                  *ngIf="showStockModal"
                  [book]="selectedBook"
                  (update)="updateBookStock($event)"
                  (cancel)="closeStockModal()">
                </app-stock-modal>
              </div>
            </div>
          </div>
          <div *ngIf="showStockModal" class="modal-backdrop fade show"></div>
          
          <!-- Contenedor de alertas -->
          <app-alert-container></app-alert-container>
        </div>
      </div>
    </div>
  `,
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading = true;
  showForm = false;
  showStockModal = false;
  selectedBook: Book | null = null;
  showOnlyAvailable = false;
  searchTerm = '';

  constructor(
    private bookService: BookService, 
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.alertService.error(err.message || 'Error al cargar los libros. Por favor, intente nuevamente más tarde.');
      }
    });
  }
  onSearchInputChange(term: string): void {
    if (!term.trim()) {
      this.loadBooks();
    }
  }
  searchBooks(term: string): void {
    this.searchTerm = term.trim();
    if (this.searchTerm) {
      this.loading = true;
      this.bookService.searchByTitle(this.searchTerm).subscribe({
        next: (data) => {
          this.books = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (err.message.includes('404')) {
            this.books = [];
            this.applyFilters();
            this.alertService.info(`No se encontraron libros con el título "${this.searchTerm}"`);
          } else {
            this.alertService.error( 'No se pudo realizar la búsqueda. Por favor, intente nuevamente.');
          }
        }
      });
    } else {
      this.loadBooks();
    }
  }

  applyFilters(): void {
    this.filteredBooks = this.books.filter(book => {
      // Filtro de disponibilidad
      if (this.showOnlyAvailable && !book.disponible) {
        return false;
      }
      return true;
    });
  }

  resetFilters(searchInput: HTMLInputElement): void {
    this.searchTerm = '';
    this.showOnlyAvailable = false;
    searchInput.value = '';
    this.loadBooks();
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'bg-danger';
    if (stock < 5) return 'bg-warning';
    if (stock < 10) return 'bg-success';
    return 'bg-success';
  }

  openForm(book: Book | null): void {
    this.selectedBook = book;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedBook = null;
  }

  openStockModal(book: Book): void {
    this.selectedBook = book;
    this.showStockModal = true;
  }

  closeStockModal(): void {
    this.showStockModal = false;
    this.selectedBook = null;
  }

  saveBook(book: Book): void {
    if (book.id) {
      // Actualizar libro existente
      this.bookService.updateBook(book.id, book).subscribe({
        next: (updatedBook) => {
          const index = this.books.findIndex(b => b.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
            this.applyFilters();
          }
          this.closeForm();
          this.alertService.success( 'Libro actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar libro', err);
          this.alertService.error( err.message || 'Error al actualizar libro. Por favor, intente nuevamente.');
        }
      });
    } else {
      // Crear nuevo libro
      this.bookService.createBook(book).subscribe({
        next: (newBook) => {
          this.books.push(newBook);
          this.applyFilters();
          this.closeForm();
          this.alertService.success('Libro creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear libro', err);
          this.alertService.error(err.message || 'Error al crear libro. Por favor, intente nuevamente.');
        }
      });
    }
  }

  updateBookStock(stockToAdd: number): void {
    if (!this.selectedBook) return;
    
    this.bookService.updateStock(this.selectedBook.id, stockToAdd).subscribe({
      next: () => {
        const newTotalStock = (this.selectedBook?.stock || 0) + stockToAdd;
        
        const index = this.books.findIndex(b => b.id === this.selectedBook?.id);
        if (index !== -1) {
          this.books[index].stock = newTotalStock;
          this.applyFilters();
        }
        
        this.closeStockModal();
        this.alertService.success(`Se agregaron ${stockToAdd} unidades. Nuevo stock: ${newTotalStock} unidades`);
      },
      error: (err) => {
        console.error('Error al actualizar stock', err);
        this.alertService.error(err.message || 'Error al actualizar stock. Por favor, intente nuevamente.');
      }
    });
  }

  toggleAvailability(book: Book): void {
    this.bookService.changeBookAvailability(book.id).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
          this.applyFilters();
        }
        
        const status = updatedBook.disponible ? 'habilitado' : 'deshabilitado';
        this.alertService.success(`Libro "${book.titulo}" ${status} correctamente`);
      },
      error: (err) => {
        console.error('Error al cambiar disponibilidad', err);
        this.alertService.error('Error al cambiar disponibilidad. Por favor, intente nuevamente.');
      }
    });
  }
}