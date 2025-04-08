import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Loan } from "../../core/models";
import { AlertService } from "../../services/alert.service";
import { AlertContainerComponent } from "../../shared/alert.component";
import { LoanService } from "../../services/loans.service";
import { LoanFormComponent } from "../../shared/components/loan/loan-form.component";

@Component({
  selector: "app-loan-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoanFormComponent,
    AlertContainerComponent,
  ],
  template: `
    <div class="container-fluid p-0">
      <div class="row m-0">
        <div class="col-12 px-3 py-3">
          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2"
          >
            <div>
              <h2 class="mb-1 text-primary">Gestión de Préstamos de Libros</h2>
              <p class="text-muted mb-0">
                Administra los préstamos de libros de la biblioteca
              </p>
            </div>
            <div>
              <button
                class="btn btn-primary d-flex align-items-center shadow-sm"
                (click)="openForm(null)"
              >
                <i class="bi bi-plus-lg me-2"></i> Registrar Préstamo
              </button>
            </div>
          </div>

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
                      placeholder="Buscar prestamos Estudiante..."
                      #searchInput
                      [(ngModel)]="searchTerm"
                      (keyup.enter)="searchLoans(searchInput.value)"
                      (input)="onSearchInputChange(searchInput.value)"
                    />
                    <button
                      class="btn btn-primary"
                      type="button"
                      (click)="searchLoans(searchInput.value)"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
                <div
                  class="col-md-5 col-lg-4 d-flex justify-content-md-end align-items-center flex-wrap gap-2"
                >
                  <div class="form-check form-switch me-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="showActiveOnly"
                      [(ngModel)]="showActiveOnly"
                      (change)="applyFilters()"
                    />
                    <label class="form-check-label" for="showActiveOnly"
                      >Solo activos</label
                    >
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
            <p class="mt-2">Cargando préstamos...</p>
          </div>

          <!-- Mensaje de no resultados -->
          <div
            *ngIf="!loading && filteredLoans.length === 0"
            class="alert alert-info d-flex align-items-center"
          >
            <i class="bi bi-info-circle me-2 fs-4"></i>
            <div>
              <strong>No hay préstamos registrados en el sistema.</strong>
              <p class="mb-0">
                Actualmente no hay préstamos disponibles o los filtros aplicados
                no arrojan resultados.
              </p>
              <button
                class="btn btn-sm btn-link ps-0 pt-1"
                (click)="resetFilters(searchInput)"
              >
                Mostrar todos los préstamos
              </button>
            </div>
          </div>

          <!-- Vista de tabla para pantallas grandes -->
          <div
            *ngIf="!loading && filteredLoans.length > 0"
            class="card shadow-sm d-none d-md-block"
          >
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th class="ps-3">Libro</th>
                      <th>Estudiante</th>
                      <th>Fecha de Préstamo</th>
                      <th>Fecha de Devolución</th>
                      <th class="text-center">Vencido</th>
                      <th class="text-center">Estado</th>
                      <th class="text-center pe-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      *ngFor="let loan of filteredLoans; let i = index"
                      [ngClass]="{ 'bg-light': i % 2 === 0 }"
                    >
                      <td class="ps-3">
                        <div class="d-flex align-items-center">
                          <div
                            class="loan-icon rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center"
                          >
                            <i class="bi bi-book"></i>
                          </div>
                          <div>{{ loan.libro.titulo }}</div>
                        </div>
                      </td>
                      <td>
                        {{ loan.usuario.nombre }} {{ loan.usuario.apellidos }}
                      </td>
                      <td>{{ loan.fechaPrestamo | date : "dd/MM/yyyy" }}</td>
                      <td>{{ loan.fechaDevolucion | date : "dd/MM/yyyy" }}</td>
                      <td class="text-center">
                        <span
                          class="badge"
                          [ngClass]="loan.vencido ? 'bg-danger' : 'bg-success'"
                        >
                          {{ loan.vencido ? "Sí" : "No" }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span
                          class="badge"
                          [ngClass]="getStatusBadgeClass(loan.estado)"
                        >
                          {{ loan.estado }}
                        </span>
                      </td>
                      <td class="text-center pe-3">
                        <div class="btn-group">
                          <button
                            class="btn btn-sm"
                            [ngClass]="
                              loan.estado !== 'ACTIVO'
                                ? 'btn-outline-secondary'
                                : 'btn-outline-primary'
                            "
                            (click)="openForm(loan)"
                            title="Editar préstamo"
                            [disabled]="loan.estado !== 'ACTIVO'"
                          >
                            <i class="bi bi-pencil"></i>
                          </button>

                          <button
                            class="btn btn-sm"
                            [ngClass]="
                              loan.estado !== 'ACTIVO'
                                ? 'btn-outline-secondary'
                                : 'btn-outline-success'
                            "
                            (click)="returnBook(loan)"
                            title="Registrar devolución"
                            [disabled]="loan.estado !== 'ACTIVO'"
                          >
                            <i class="bi bi-check-circle"></i>
                          </button>

                          <button
                            class="btn btn-sm"
                            [ngClass]="
                              loan.estado !== 'ACTIVO'
                                ? 'btn-outline-secondary'
                                : 'btn-outline-danger'
                            "
                            (click)="cancelLoan(loan)"
                            title="Cancelar préstamo"
                            [disabled]="loan.estado !== 'ACTIVO'"
                          >
                            <i class="bi bi-x-circle"></i>
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
                <span class="text-muted small"
                  >Mostrando {{ filteredLoans.length }} de
                  {{ loans.length }} préstamos</span
                >
              </div>
            </div>
          </div>

          <!-- Vista de tarjetas para móviles -->
          <div *ngIf="!loading && filteredLoans.length > 0" class="d-md-none">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">Préstamos registrados</h6>
              <span class="badge bg-primary rounded-pill"
                >{{ filteredLoans.length }} préstamos</span
              >
            </div>

            <div class="row g-2">
              <div class="col-12" *ngFor="let loan of filteredLoans">
                <div class="card mb-2">
                  <div class="card-body p-3">
                    <div
                      class="d-flex justify-content-between align-items-start mb-2"
                    >
                      <div class="d-flex align-items-center">
                        <div
                          class="loan-icon rounded-circle bg-light text-primary me-2 d-flex align-items-center justify-content-center"
                        >
                          <i class="bi bi-book"></i>
                        </div>
                        <h6 class="card-title mb-0 text-primary">
                          {{ loan.libro.titulo }}
                        </h6>
                      </div>
                      <span
                        class="badge"
                        [ngClass]="getStatusBadgeClass(loan.estado)"
                      >
                        {{ loan.estado }}
                      </span>
                    </div>

                    <div class="row mb-2">
                      <div class="col-12">
                        <small class="text-muted d-block">Estudiante</small>
                        <span
                          >{{ loan.usuario.nombre }}
                          {{ loan.usuario.apellidos }}</span
                        >
                      </div>
                    </div>

                    <div class="row mb-2">
                      <div class="col-6">
                        <small class="text-muted d-block">Fecha préstamo</small>
                        <span>{{
                          loan.fechaPrestamo | date : "dd/MM/yyyy"
                        }}</span>
                      </div>
                      <div class="col-6">
                        <small class="text-muted d-block"
                          >Fecha devolución</small
                        >
                        <span>{{
                          loan.fechaDevolucion | date : "dd/MM/yyyy"
                        }}</span>
                      </div>
                    </div>

                    <div class="row mb-2">
                      <div class="col-12">
                        <small class="text-muted d-block">Vencido</small>
                        <span
                          class="badge"
                          [ngClass]="loan.vencido ? 'bg-danger' : 'bg-success'"
                        >
                          {{ loan.vencido ? "Sí" : "No" }}
                        </span>
                      </div>
                    </div>

                    <div
                      class="d-flex justify-content-end align-items-center mt-2"
                    >
                      <div class="btn-group">
                        <button
                          class="btn btn-sm"
                          [ngClass]="
                            loan.estado !== 'ACTIVO'
                              ? 'btn-outline-secondary'
                              : 'btn-outline-primary'
                          "
                          (click)="openForm(loan)"
                          title="Editar préstamo"
                          [disabled]="loan.estado !== 'ACTIVO'"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>

                        <button
                          class="btn btn-sm"
                          [ngClass]="
                            loan.estado !== 'ACTIVO'
                              ? 'btn-outline-secondary'
                              : 'btn-outline-success'
                          "
                          (click)="returnBook(loan)"
                          title="Registrar devolución"
                          [disabled]="loan.estado !== 'ACTIVO'"
                        >
                          <i class="bi bi-check-circle"></i>
                        </button>

                        <button
                          class="btn btn-sm"
                          [ngClass]="
                            loan.estado !== 'ACTIVO'
                              ? 'btn-outline-secondary'
                              : 'btn-outline-danger'
                          "
                          (click)="cancelLoan(loan)"
                          title="Cancelar préstamo"
                          [disabled]="loan.estado !== 'ACTIVO'"
                        >
                          <i class="bi bi-x-circle"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-muted small mt-2 text-center">
              Mostrando {{ filteredLoans.length }} de
              {{ loans.length }} préstamos
            </div>
          </div>

          <!-- Modal para formulario -->
          <div
            class="modal fade"
            [ngClass]="{ 'show d-block': showForm }"
            tabindex="-1"
            role="dialog"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <app-loan-form
                  *ngIf="showForm"
                  [loan]="selectedLoan"
                  (save)="saveLoan($event)"
                  (cancel)="closeForm()"
                >
                </app-loan-form>
              </div>
            </div>
          </div>
          <div *ngIf="showForm" class="modal-backdrop fade show"></div>

          <!-- Modal para confirmar devolución -->
          <div
            class="modal fade"
            [ngClass]="{ 'show d-block': showReturnConfirm }"
            tabindex="-1"
            role="dialog"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmar devolución</h5>
                  <button
                    type="button"
                    class="btn-close"
                    (click)="closeReturnConfirm()"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>¿Confirmar la devolución del siguiente libro?</p>
                  <div class="card bg-light mb-3">
                    <div class="card-body">
                      <p class="mb-1">
                        <strong>Libro:</strong>
                        {{ selectedLoan?.libro?.titulo }}
                      </p>
                      <p class="mb-1">
                        <strong>Estudiante:</strong>
                        {{ selectedLoan?.usuario?.nombre }}
                        {{ selectedLoan?.usuario?.apellidos }}
                      </p>
                      <p class="mb-0">
                        <strong>Fecha de préstamo:</strong>
                        {{ selectedLoan?.fechaPrestamo | date : "dd/MM/yyyy" }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="closeReturnConfirm()"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    class="btn btn-success"
                    (click)="confirmReturn()"
                  >
                    <i class="bi bi-check-circle me-1"></i> Confirmar devolución
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="showReturnConfirm" class="modal-backdrop fade show"></div>

          <!-- Modal para confirmar cancelación -->
          <div
            class="modal fade"
            [ngClass]="{ 'show d-block': showCancelConfirm }"
            tabindex="-1"
            role="dialog"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmar cancelación</h5>
                  <button
                    type="button"
                    class="btn-close"
                    (click)="closeCancelConfirm()"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>¿Estás seguro de que deseas cancelar este préstamo?</p>
                  <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Esta acción no se puede deshacer.
                  </div>
                  <div class="card bg-light">
                    <div class="card-body">
                      <p class="mb-1">
                        <strong>Libro:</strong>
                        {{ selectedLoan?.libro?.titulo }}
                      </p>
                      <p class="mb-1">
                        <strong>Estudiante:</strong>
                        {{ selectedLoan?.usuario?.nombre }}
                        {{ selectedLoan?.usuario?.apellidos }}
                      </p>
                      <p class="mb-0">
                        <strong>Fecha de préstamo:</strong>
                        {{ selectedLoan?.fechaPrestamo | date : "dd/MM/yyyy" }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="closeCancelConfirm()"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    (click)="confirmCancel()"
                  >
                    <i class="bi bi-x-circle me-1"></i> Cancelar préstamo
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="showCancelConfirm" class="modal-backdrop fade show"></div>

          <!-- Contenedor de alertas -->
          <app-alert-container></app-alert-container>
        </div>
      </div>
    </div>
  `,
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  loading = true;
  showForm = false;
  showReturnConfirm = false;
  showCancelConfirm = false;
  selectedLoan: Loan | null = null;
  showActiveOnly = false;
  searchTerm = "";

  constructor(
    private loanService: LoanService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getAllLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.filteredLoans = [...this.loans];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error("Error al obtener préstamos", err);
        this.loading = false;
        this.alertService.error(
          err.message ||
            "Error al cargar los préstamos. Por favor, intente nuevamente más tarde."
        );
      },
    });
  }

  applyFilters(): void {
    let result = [...this.loans];

    // Aplicar filtro de activos
    if (this.showActiveOnly) {
      result = result.filter((loan) => loan.estado === "ACTIVO");
    }

    this.filteredLoans = result;
  }

  resetFilters(searchInput: HTMLInputElement): void {
    this.searchTerm = "";
    this.showActiveOnly = false;
    searchInput.value = "";
    this.loadLoans();
  }

  searchLoans(term: string): void {
    this.searchTerm = term.trim();

    if (!this.searchTerm) {
      this.loadLoans();
      return;
    }

    this.loading = true;

    this.loanService.getLoansByStudenOrTitle(this.searchTerm).subscribe({
      next: (data) => {
        this.loans = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.message && err.message.includes("404")) {
          this.loans = [];
          this.filteredLoans = [];
          this.alertService.info(
            `No se encontraron préstamos que coincidan con "${this.searchTerm}"`
          );
        } else {
          this.alertService.error(
            err.message ||
              "Error al buscar préstamos. Por favor, intente nuevamente."
          );
        }
      },
    });
  }
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "ACTIVO":
        return "bg-primary";
      case "DEVUELTO":
        return "bg-success";
      case "VENCIDO":
        return "bg-warning text-dark";
      case "PERDIDO":
        return "bg-danger";
      case "CANCELADO":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  }

  openForm(loan: Loan | null): void {
    this.selectedLoan = loan;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedLoan = null;
  }

  saveLoan(loan: Loan): void {
    if (loan.id) {
      this.loanService.updateLoan(loan.id, loan).subscribe({
        next: (updatedLoan) => {
          const index = this.loans.findIndex((l) => l.id === updatedLoan.id);
          if (index !== -1) {
            this.loans[index] = updatedLoan;
            this.applyFilters();
          }
          this.closeForm();
          this.alertService.success("Préstamo actualizado correctamente");
        },
        error: (err) => {
          console.error("Error al actualizar préstamo", err);
          this.alertService.error(
            err.message ||
              "Error al actualizar préstamo. Por favor, intente nuevamente."
          );
        },
      });
    } else {
      this.loanService.createLoan(loan).subscribe({
        next: (newLoan) => {
          this.loans.push(newLoan);
          this.applyFilters();
          this.closeForm();
          this.alertService.success("Préstamo registrado correctamente");
        },
        error: (err) => {
          console.error("Error al crear préstamo", err);
          this.alertService.error(
            err.message ||
              "Error al registrar préstamo. Por favor, verifique los datos e intente nuevamente."
          );
        },
      });
    }
  }

  returnBook(loan: Loan): void {
    this.selectedLoan = loan;
    this.showReturnConfirm = true;
  }

  closeReturnConfirm(): void {
    this.showReturnConfirm = false;
    this.selectedLoan = null;
  }

  confirmReturn(): void {
    if (!this.selectedLoan || !this.selectedLoan.id) return;

    this.loanService.returnBook(this.selectedLoan.id).subscribe({
      next: (updatedLoan) => {
        const index = this.loans.findIndex((l) => l.id === updatedLoan.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
          this.applyFilters();
        }
        this.closeReturnConfirm();
        this.alertService.success("Devolución registrada correctamente");
      },
      error: (err) => {
        console.error("Error al registrar devolución", err);
        this.closeReturnConfirm();
        this.alertService.error(
          err.message ||
            "Error al registrar devolución. Por favor, intente nuevamente."
        );
      },
    });
  }

  cancelLoan(loan: Loan): void {
    this.selectedLoan = loan;
    this.showCancelConfirm = true;
  }

  closeCancelConfirm(): void {
    this.showCancelConfirm = false;
    this.selectedLoan = null;
  }

  confirmCancel(): void {
    if (!this.selectedLoan || !this.selectedLoan.id) return;

    this.loanService.cancelLoan(this.selectedLoan.id).subscribe({
      next: (updatedLoan) => {
        const index = this.loans.findIndex((l) => l.id === updatedLoan.id);
        if (index !== -1) {
          this.loans[index] = updatedLoan;
          this.applyFilters();
        }
        this.closeCancelConfirm();
        this.alertService.success("Préstamo cancelado correctamente");
      },
      error: (err) => {
        console.error("Error al cancelar préstamo", err);
        this.closeCancelConfirm();
        this.alertService.error(
          err.message ||
            "Error al cancelar préstamo. Por favor, intente nuevamente."
        );
      },
    });
  }
  onSearchInputChange(term: string): void {
    if (!term.trim()) {
      // Si el término de búsqueda está vacío, carga todos los libros
      this.loadLoans();
    }
  }
}
