import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert-container.component';
import { AlertConfig, AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  template: `
    <div class="alert-container">
      <app-alert
        *ngFor="let alert of alerts"
        [message]="alert.message"
        [type]="alert.type"
        [title]="alert.title || ''"
        [autoClose]="alert.duration !== 0"
        [duration]="alert.duration || 5000"
        (closed)="onAlertClosed(alert.id!)"
      ></app-alert>
    </div>
  `,
  styles: [`
    .alert-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      width: 350px;
      max-width: 90vw;
    }
  `]
})
export class AlertContainerComponent implements OnInit {
  alerts: AlertConfig[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  onAlertClosed(id: string): void {
    this.alertService.dismiss(id);
  }
}