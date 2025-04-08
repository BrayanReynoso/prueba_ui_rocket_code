import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
       <div class="modal-header text-white" style="background-color: #050f2a;">
      <h5 class="modal-title">{{ student ? 'Editar' : 'Nuevo' }} Estudiante</h5>
      <button type="button" class="btn-close" (click)="onCancel()"></button>
    </div>
    <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
      <div class="modal-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              id="nombre" 
              formControlName="nombre"
              placeholder="Nombre del estudiante"
            >
            <div *ngIf="studentForm.controls['nombre'].invalid && studentForm.controls['nombre'].touched" 
                 class="text-danger small mt-1">
              El nombre es obligatorio
            </div>
          </div>
          
          <div class="col-md-6">
            <label for="apellidos" class="form-label">Apellidos <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              id="apellidos" 
              formControlName="apellidos"
              placeholder="Apellidos del estudiante"
            >
            <div *ngIf="studentForm.controls['apellidos'].invalid && studentForm.controls['apellidos'].touched" 
                 class="text-danger small mt-1">
              Los apellidos son obligatorios
            </div>
          </div>
        </div>
        
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="matricula" class="form-label">Matrícula <span class="text-danger">*</span></label>
            <input 
              type="text" 
              class="form-control" 
              id="matricula" 
              formControlName="matricula"
              placeholder="Ej. A12345678"
            >
            <div *ngIf="studentForm.controls['matricula'].invalid && studentForm.controls['matricula'].touched" 
                 class="text-danger small mt-1">
              La matrícula es obligatoria
            </div>
          </div>
          
          <div class="col-md-6">
            <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              formControlName="email"
              placeholder="correo@ejemplo.com"
            >
            <div *ngIf="studentForm.controls['email'].invalid && studentForm.controls['email'].touched" 
                 class="text-danger small mt-1">
              <span *ngIf="studentForm.controls['email'].errors?.['required']">
                El email es obligatorio
              </span>
              <span *ngIf="studentForm.controls['email'].errors?.['email']">
                Formato de email inválido
              </span>
            </div>
          </div>
        </div>
        
        
        <div class="mb-3">
          <label for="telefono" class="form-label">Teléfono</label>
          <input 
            type="tel" 
            class="form-control" 
            id="telefono" 
            formControlName="telefono"
            placeholder="Número de teléfono"
          >
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">Cancelar</button>
        <button type="submit" class="btn btn-primary" [disabled]="studentForm.invalid">
          {{ student ? 'Actualizar' : 'Crear' }} Estudiante
        </button>
      </div>
    </form>
  `
})
export class StudentFormComponent implements OnInit {
  @Input() student: Student | null = null;
  @Output() save = new EventEmitter<Student>();
  @Output() cancel = new EventEmitter<void>();
  
  studentForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      matricula: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
    });
  }
  
  ngOnInit(): void {
    if (this.student) {
      this.studentForm.patchValue({
        id: this.student.id,
        nombre: this.student.nombre,
        apellidos: this.student.apellidos,
        matricula: this.student.matricula,
        email: this.student.email,
        telefono: this.student.telefono,
      });
    }
  }
  
  onSubmit(): void {
    if (this.studentForm.valid) {
      this.save.emit(this.studentForm.value);
    } else {
      Object.keys(this.studentForm.controls).forEach(key => {
        const control = this.studentForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}