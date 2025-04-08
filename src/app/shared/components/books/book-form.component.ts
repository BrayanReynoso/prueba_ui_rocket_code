import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../../core/models';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
       <div class="modal-header text-white" style="background-color: #050f2a;">
      <h5 class="modal-title">{{ book?.id ? 'Editar' : 'Agregar' }} Libro</h5>
      <button type="button" class="btn-close" (click)="onCancel()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="titulo" class="form-label">Título *</label>
          <input type="text" class="form-control" id="titulo" formControlName="titulo">
          <div *ngIf="bookForm.controls['titulo'].invalid && bookForm.controls['titulo'].touched" class="text-danger">
            Título es requerido
          </div>
        </div>
        
        <div class="mb-3">
          <label for="autor" class="form-label">Autor</label>
          <input type="text" class="form-control" id="autor" formControlName="autor">
        </div>
        
        <div class="mb-3">
          <label for="editorial" class="form-label">Editorial</label>
          <input type="text" class="form-control" id="editorial" formControlName="editorial">
        </div>
        
        <div class="mb-3">
          <label for="stock" class="form-label">Stock *</label>
          <input type="number" class="form-control" id="stock" formControlName="stock" min="0">
          <div *ngIf="bookForm.controls['stock'].invalid && bookForm.controls['stock'].touched" class="text-danger">
            Stock debe ser un número positivo
          </div>
        </div>
        
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="disponible" formControlName="disponible">
          <label class="form-check-label" for="disponible">Disponible</label>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="bookForm.invalid">
            {{ book?.id ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() save = new EventEmitter<Book>();
  @Output() cancel = new EventEmitter<void>();
  
  bookForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      autor: [''],
      editorial: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      disponible: [true]
    });
  }
  
  ngOnInit(): void {
    if (this.book) {
      this.bookForm.patchValue(this.book);
    }
  }
  
  onSubmit(): void {
    if (this.bookForm.valid) {
      this.save.emit(this.bookForm.value);
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}