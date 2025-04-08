import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { AlertService } from '../../services/alert.service';
import { Student } from '../../core/models';
import { StudentFormComponent } from '../../shared/components/students/student-form.component';
import { AlertContainerComponent } from '../../shared/alert.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentFormComponent, AlertContainerComponent],
  template: `
    <div class="container-fluid p-0">
      <div class="row m-0">
        <div class="col-12 px-3 py-3">
          <!-- Encabezado con título y acciones -->
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
            <div>
              <h2 class="mb-1 text-primary">Gestión de Estudiantes</h2>
              <p class="text-muted mb-0">Administra el registro de estudiantes de la biblioteca</p>
            </div>
            <div>
              <button class="btn btn-primary d-flex align-items-center shadow-sm" (click)="openForm(null)">
                <i class="bi bi-plus-lg me-2"></i> Agregar Estudiante
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
  type="email" 
  class="form-control border-start-0" 
  placeholder="Buscar por correo electrónico..." 
  #searchInput
  (keyup.enter)="searchStudentsByEmail(searchInput.value)"
   (input)="onSearchInputChange(searchInput.value)"
>
<button 
  class="btn btn-primary" 
  type="button"
  (click)="searchStudentsByEmail(searchInput.value)"
>
  Buscar
</button>
                  </div>
                </div>
                <div class="col-md-5 col-lg-4 d-flex justify-content-md-end align-items-center flex-wrap gap-2">
                </div>
              </div>
            </div>
          </div>

          <!-- Estado de carga -->
          <div *ngIf="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando estudiantes...</p>
          </div>

          <!-- Mensaje de no resultados -->
          <div *ngIf="!loading && filteredStudents.length === 0" class="alert alert-info d-flex align-items-center">
            <i class="bi bi-info-circle me-2 fs-4"></i>
            <div>
              <strong>No se encontraron resultados.</strong>
              <p class="mb-0">No hay estudiantes disponibles en el registro con los filtros seleccionados.</p>
              <button class="btn btn-sm btn-link ps-0 pt-1" (click)="resetFilters(searchInput)">Mostrar todos los estudiantes</button>
            </div>
          </div>

          <!-- Vista de tabla para pantallas grandes -->
          <div *ngIf="!loading && filteredStudents.length > 0" class="card shadow-sm d-none d-md-block">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th class="ps-3">Nombre</th>
                      <th>Email</th>
                      <th class="text-center">Matrícula</th>
                      <th class="text-center">Telefono</th>
                      
                      <th class="text-center pe-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let student of filteredStudents; let i = index" [ngClass]="{'bg-light': i % 2 === 0}">
                      <td class="ps-3">
                        <div class="d-flex align-items-center">
                          <div class="student-icon rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center">
                            <i class="bi bi-person"></i>
                          </div>
                          <div>{{ student.nombre }} {{ student.apellidos }}</div>
                        </div>
                      </td>
                      <td>{{ student.email || '--' }}</td>
                      <td class="text-center">
                        <span class="badge text-dark">
                          {{ student.matricula || '--' }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span class="badge text-dark">
                          {{ student.telefono || '--' }}
                        </span>
                      </td>
                      <td class="text-center pe-3">
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="openForm(student)" title="Editar estudiante">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(student)" title="Eliminar estudiante">
                            <i class="bi bi-trash"></i>
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
                <span class="text-muted small">Mostrando {{ filteredStudents.length }} de {{ students.length }} estudiantes</span>
              </div>
            </div>
          </div>
          
          <!-- Vista de tarjetas para móviles -->
          <div *ngIf="!loading && filteredStudents.length > 0" class="d-md-none">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">Estudiantes registrados</h6>
              <span class="badge bg-primary rounded-pill">{{ filteredStudents.length }} estudiantes</span>
            </div>
            
            <div class="row g-2">
              <div class="col-12" *ngFor="let student of filteredStudents">
                <div class="card mb-2">
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div class="d-flex align-items-center">
                        <div class="student-icon rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center">
                          <i class="bi bi-person"></i>
                        </div>
                        <h6 class="card-title mb-0 text-primary">{{ student.nombre }} {{ student.apellidos }}</h6>
                      </div>
                      <span class="badge text-dark">
                        {{ student.matricula || 'Sin matrícula' }}
                      </span>
                    </div>
                    
                    <div class="row mb-2">
                      <div class="col-12">
                        <small class="text-muted d-block">Email</small>
                        <span>{{ student.email || '--' }}</span>
                      </div>
                     
                    </div>
                    <div class="row mb-2">
                      <div class="col-12">
                        <small class="text-muted d-block">Telefono</small>
                        <span>{{ student.telefono || '--' }}</span>
                      </div>
                     
                    </div>
                    
                    <div class="d-flex justify-content-end align-items-center mt-2">
                      <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" (click)="openForm(student)" title="Editar estudiante">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(student)" title="Eliminar estudiante">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-muted small mt-2 text-center">
              Mostrando {{ filteredStudents.length }} de {{ students.length }} estudiantes
            </div>
          </div>

          <!-- Modal para formulario -->
          <div class="modal fade" [ngClass]="{ 'show d-block': showForm }" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <app-student-form 
                  *ngIf="showForm" 
                  [student]="selectedStudent"
                  (save)="saveStudent($event)"
                  (cancel)="closeForm()">
                </app-student-form>
              </div>
            </div>
          </div>
          <div *ngIf="showForm" class="modal-backdrop fade show"></div>

          <!-- Modal para confirmar eliminación -->
          <div class="modal fade" [ngClass]="{ 'show d-block': showDeleteConfirm }" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmar eliminación</h5>
                  <button type="button" class="btn-close" (click)="closeDeleteConfirm()"></button>
                </div>
                <div class="modal-body">
                  <p>¿Estás seguro de que deseas eliminar a este estudiante?</p>
                  <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Esta acción no se puede deshacer.
                  </div>
                  <div class="card bg-light">
                    <div class="card-body">
                      <p class="mb-1"><strong>Nombre:</strong> {{ selectedStudent?.nombre }} {{ selectedStudent?.apellidos }}</p>
                      <p class="mb-1"><strong>Matrícula:</strong> {{ selectedStudent?.matricula || '--' }}</p>
                      <p class="mb-0"><strong>Email:</strong> {{ selectedStudent?.email || '--' }}</p>
                      <p class="mb-0"><strong>Telefono:</strong> {{ selectedStudent?.telefono || '--' }}</p>
                      
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" (click)="closeDeleteConfirm()">Cancelar</button>
                  <button type="button" class="btn btn-danger" (click)="deleteStudent()">
                    <i class="bi bi-trash me-1"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="showDeleteConfirm" class="modal-backdrop fade show"></div>
          
          <!-- Contenedor de alertas -->
          <app-alert-container></app-alert-container>
        </div>
      </div>
    </div>
  `,

})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  loading = true;
  showForm = false;
  showDeleteConfirm = false;
  selectedStudent: Student | null = null;
  searchTerm = '';

  constructor(
    private studentService: StudentService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = [...this.students];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener estudiantes', err);
        this.loading = false;
        this.alertService.error('Error al cargar los estudiantes. Por favor, intente nuevamente más tarde.');
      }
    });
  }
  onSearchInputChange(term: string): void {
    if (!term.trim()) {
      // Si el término de búsqueda está vacío, carga todos los libros
      this.loadStudents();
    }
  }
  searchStudentsByEmail(email: string): void {
    this.searchTerm = email.trim();
    if (this.searchTerm) {
      this.loading = true;
      this.studentService.getStudentsByEmailLike(this.searchTerm).subscribe({
        next: (students) => {
          this.students = students;
          this.filteredStudents = [...students];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al buscar estudiante por email', err);
          this.loading = false;
          if (err.message && err.message.includes('404')) {
            this.students = [];
            this.filteredStudents = [];
            this.alertService.info(`No se encontró ningún estudiante con el correo "${this.searchTerm}"`);
          } else {
            this.alertService.error(err.message || 'No se pudo realizar la búsqueda. Por favor, intente nuevamente.');
          }
        }
      });
    } else {
      this.loadStudents();
    }
  }
  resetFilters(searchInput: HTMLInputElement): void {
    this.searchTerm = '';
    searchInput.value = '';
    this.loadStudents();
  }

  openForm(student: Student | null): void {
    this.selectedStudent = student;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedStudent = null;
  }

  saveStudent(student: Student): void {
    if (student.id) {
      this.studentService.updateStudent(student.id, student).subscribe({
        next: (updatedStudent) => {
          const index = this.students.findIndex(s => s.id === updatedStudent.id);
          if (index !== -1) {
            this.students[index] = updatedStudent;
            this.filteredStudents = [...this.students];
          }
          this.closeForm();
          this.alertService.success('Estudiante actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar estudiante', err);
          this.alertService.error( err.message || 'Error al actualizar estudiante. Por favor, intente nuevamente.');
        }
      });
    } else {
      // Crear nuevo estudiante
      this.studentService.registerStudent(student).subscribe({
        next: (newStudent) => {
          this.students.push(newStudent);
          this.filteredStudents = [...this.students];
          this.closeForm();
          this.alertService.success('Estudiante creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear estudiante', err);
          this.alertService.error(err.message);
        }
      });
    }
  }

  confirmDelete(student: Student): void {
    this.selectedStudent = student;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.selectedStudent = null;
  }

  deleteStudent(): void {
    if (this.selectedStudent && this.selectedStudent.id) {
      this.studentService.deleteStudent(this.selectedStudent.id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== this.selectedStudent?.id);
          this.filteredStudents = [...this.students];
          this.closeDeleteConfirm();
          this.alertService.success('Estudiante eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar estudiante', err);
          this.closeDeleteConfirm();
          this.alertService.error(err.message || 'Error al eliminar estudiante. Por favor, intente nuevamente.');
        }
      });
    }
  }
}