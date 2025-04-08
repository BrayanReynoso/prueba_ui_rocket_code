import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../../core/models';

@Component({
  selector: 'app-stock-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
      <div class="modal-header text-white" style="background-color: #050f2a;">
      <h5 class="modal-title">Actualizar Stock</h5>
      <button type="button" class="btn-close" (click)="onCancel()"></button>
    </div>
    <div class="modal-body">
      <div class="card mb-3 bg-light">
        <div class="card-body">
          <h6 class="card-subtitle text-muted mb-2">Información del libro</h6>
          <p class="mb-1"><strong>Título:</strong> {{ book?.titulo }}</p>
          <p class="mb-0"><strong>Stock actual:</strong> <span class="badge bg-primary">{{ book?.stock }}</span></p>
        </div>
      </div>

      <form [formGroup]="stockForm" (ngSubmit)="onSubmit()">
        <div class="form-group mb-3">
          <label for="stock" class="form-label">Cantidad a agregar al stock</label>
          <div class="input-group">
            <input 
              type="number" 
              class="form-control" 
              id="stock" 
              formControlName="stock"
              min="1"
              placeholder="Ingrese la cantidad a agregar">
            <span class="input-group-text">unidades</span>
          </div>
          <div *ngIf="stockForm.controls['stock'].invalid && stockForm.controls['stock'].touched" class="text-danger small mt-1">
            La cantidad debe ser un número positivo mayor a cero
          </div>
        </div>
        
        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="stockForm.invalid">
            Agregar al Stock
          </button>
        </div>
      </form>
    </div>
  `
})
export class StockModalComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() update = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();
  
  stockForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      stock: [1, [Validators.required, Validators.min(1)]]
    });
  }
  
  ngOnInit(): void {
    // Inicializamos con un valor por defecto de 1 para agregar
    this.stockForm.patchValue({
      stock: 1
    });
  }
  onSubmit(): void {
    if (this.stockForm.valid) {
      this.update.emit(this.stockForm.value.stock);
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}