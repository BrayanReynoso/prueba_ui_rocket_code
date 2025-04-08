import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="alert alert-dismissible fade show" 
         [ngClass]="'alert-' + type" 
         role="alert">
      <div class="d-flex align-items-center">
        <!-- Icono según el tipo de alerta -->
        <i *ngIf="type === 'success'" class="bi bi-check-circle-fill me-2 fs-5"></i>
        <i *ngIf="type === 'info'" class="bi bi-info-circle-fill me-2 fs-5"></i>
        <i *ngIf="type === 'warning'" class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
        <i *ngIf="type === 'danger'" class="bi bi-x-circle-fill me-2 fs-5"></i>
        
        <!-- Contenido del mensaje -->
        <div>
          <strong *ngIf="title">{{ title }}</strong>
          <span [innerHTML]="message"></span>
        </div>
      </div>
      
      <button type="button" class="btn-close" (click)="close()"></button>
    </div>
  `,
  styles: [`
    .alert {
      margin-bottom: 1rem;
      border-left: 5px solid;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .alert-success {
      border-left-color: #198754;
    }
    
    .alert-info {
      border-left-color: #0dcaf0;
    }
    
    .alert-warning {
      border-left-color: #ffc107;
    }
    
    .alert-danger {
      border-left-color: #dc3545;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Input() type: AlertType = 'info';
  @Input() title: string = '';
  @Input() autoClose: boolean = true;
  @Input() duration: number = 5000; // milisegundos
  @Output() closed = new EventEmitter<void>();

  visible: boolean = true;
  private timeoutId?: number;

  ngOnInit(): void {
    if (this.autoClose) {
      this.setupAutoClose();
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  setupAutoClose(): void {
    this.timeoutId = window.setTimeout(() => {
      this.close();
    }, this.duration);
  }

  close(): void {
    this.visible = false;
    this.closed.emit();
  }
}