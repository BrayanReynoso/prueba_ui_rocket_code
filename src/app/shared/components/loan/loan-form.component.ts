import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loan, Book, Student } from '../../../core/models';
import { BookService } from '../../../services/book.service';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-header text-white" style="background-color: #050f2a;">
      <h5 class="modal-title">{{ loan ? 'Editar Préstamo' : 'Registrar Préstamo' }}</h5>
      <button type="button" class="btn-close" (click)="onCancel()"></button>
    </div>
    <div class="modal-body">
      <div *ngIf="loading" class="text-center my-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando datos...</p>
      </div>

      <form *ngIf="!loading" [formGroup]="loanForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="book" class="form-label">Libro</label>
          <select class="form-select" id="book" formControlName="libroId" [attr.disabled]="loan ? true : null">
            <option value="">Seleccionar libro</option>
            <option *ngFor="let book of availableBooks" [value]="book.id">
              {{ book.titulo }}
            </option>
          </select>
          <div *ngIf="loanForm.get('libroId')?.invalid && loanForm.get('libroId')?.touched" class="text-danger small mt-1">
            El libro es obligatorio
          </div>
        </div>

        <div class="mb-3">
          <label for="student" class="form-label">Estudiante</label>
          <select class="form-select" id="student" formControlName="usuarioId" [attr.disabled]="loan ? true : null">
            <option value="">Seleccionar estudiante</option>
            <option *ngFor="let student of students" [value]="student.id">
              {{ student.nombre }} {{ student.apellidos }}
            </option>
          </select>
          <div *ngIf="loanForm.get('usuarioId')?.invalid && loanForm.get('usuarioId')?.touched" class="text-danger small mt-1">
            El estudiante es obligatorio
          </div>
        </div>

        <div class="mb-3">
          <label for="loanDate" class="form-label">Fecha de préstamo</label>
          <input type="date" class="form-control" id="loanDate" formControlName="fechaPrestamo">
          <div *ngIf="loanForm.get('fechaPrestamo')?.invalid && loanForm.get('fechaPrestamo')?.touched" class="text-danger small mt-1">
            La fecha de préstamo es obligatoria
          </div>
        </div>

        <div class="mb-3">
          <label for="returnDate" class="form-label">Fecha de devolución esperada</label>
          <input type="date" class="form-control" id="returnDate" formControlName="fechaDevolucion">
          <div *ngIf="loanForm.get('fechaDevolucion')?.invalid && loanForm.get('fechaDevolucion')?.touched" class="text-danger small mt-1">
            La fecha de devolución es obligatoria
          </div>
          <div *ngIf="isReturnDateBeforeLoanDate()" class="text-danger small mt-1">
            La fecha de devolución debe ser posterior a la fecha de préstamo
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="loanForm.invalid || isReturnDateBeforeLoanDate()">
            {{ loan ? 'Actualizar' : 'Registrar' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class LoanFormComponent implements OnInit {
  @Input() loan: Loan | null = null;
  @Output() save = new EventEmitter<Loan>();
  @Output() cancel = new EventEmitter<void>();

  loanForm: FormGroup;
  availableBooks: Book[] = [];
  students: Student[] = [];
  loading = true;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private studentService: StudentService
  ) {
    this.loanForm = this.fb.group({
      id: [null],
      libroId: ['', Validators.required],
      usuarioId: ['', Validators.required],
      fechaPrestamo: [this.formatDateForInput(new Date()), Validators.required],
      fechaDevolucion: [this.formatDateForInput(this.getDefaultReturnDate()), Validators.required],
      estado: ['ACTIVO']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    
    // Cargar libros y estudiantes simultáneamente
    Promise.all([
      this.loadBooks(),
      this.loadStudents()
    ]).then(() => {
      // Una vez cargados, inicializar el formulario
      this.initializeForm();
      this.loading = false;
    }).catch(error => {
      console.error('Error al cargar datos para el formulario', error);
      this.loading = false;
    });
  }

  loadBooks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bookService.getAllBooks().subscribe({
        next: (books) => {
          // Filtrar solo libros disponibles (para nuevos préstamos)
          this.availableBooks = books.filter(book => book.disponible && book.stock > 0);
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar libros', err);
          reject(err);
        }
      });
    });
  }

  loadStudents(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.studentService.getAllStudents().subscribe({
        next: (students) => {
          this.students = students;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar estudiantes', err);
          reject(err);
        }
      });
    });
  }

  initializeForm(): void {
    if (this.loan) {
      // Si estamos editando un préstamo existente
      this.loanForm.patchValue({
        id: this.loan.id,
        libroId: this.loan.libroId, // Usar libroId directamente
        usuarioId: this.loan.usuarioId, // Usar usuarioId directamente
        fechaPrestamo: this.formatDateForInput(new Date(this.loan.fechaPrestamo)),
        fechaDevolucion: this.formatDateForInput(new Date(this.loan.fechaDevolucion)),
        estado: this.loan.estado
      });
    } else {
      // Si es un nuevo préstamo
      this.loanForm.patchValue({
        id: null,
        libroId: '',
        usuarioId: '',
        fechaPrestamo: this.formatDateForInput(new Date()),
        fechaDevolucion: this.formatDateForInput(this.getDefaultReturnDate()),
        estado: 'ACTIVO'
      });
    }
  }

  formatDateForInput(date: Date): string {
    // Formato YYYY-MM-DD para inputs type="date"
    return date.toISOString().split('T')[0];
  }

  getDefaultReturnDate(): Date {
    // Por defecto, 7 días después de la fecha actual
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  }

  isReturnDateBeforeLoanDate(): boolean {
    const loanDate = this.loanForm.get('fechaPrestamo')?.value;
    const returnDate = this.loanForm.get('fechaDevolucion')?.value;
    
    if (!loanDate || !returnDate) return false;
    
    return new Date(returnDate) <= new Date(loanDate);
  }

  onSubmit(): void {
    if (this.loanForm.invalid || this.isReturnDateBeforeLoanDate()) return;

    const formData = this.loanForm.value;
    
    // Crear el objeto de préstamo según la estructura correcta
    const loan: Partial<Loan> = {
      id: formData.id,
      libroId: formData.libroId,
      usuarioId: formData.usuarioId,
      fechaPrestamo: formData.fechaPrestamo,
      fechaDevolucion: formData.fechaDevolucion,
      estado: formData.estado,
      // Estos campos son necesarios para la API pero no se envían al usuario
      // Los establecemos como null/undefined ya que serán llenados por el backend
      vencido: false
    };

    // Si tenemos el libro y usuario completos disponibles, los incluimos
    if (this.loan) {
      loan.libro = this.loan.libro;
      loan.usuario = this.loan.usuario;
    }

    // Emitir el evento con el préstamo a guardar
    this.save.emit(loan as Loan);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}