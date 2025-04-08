import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertType } from '../shared/components/alert-container.component';

export interface AlertConfig {
  type: AlertType;
  message: string;
  title?: string;
  duration?: number;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<AlertConfig[]>([]);
  public alerts$: Observable<AlertConfig[]> = this.alertsSubject.asObservable();

  constructor() {}

  /**
   * Muestra una alerta
   */
  show(config: AlertConfig): string {
    const id = config.id || this.generateId();
    const alerts = this.alertsSubject.value;
    
    const newAlert = {
      ...config,
      id
    };
    
    this.alertsSubject.next([...alerts, newAlert]);
    
    // Auto-eliminar después de 3s
    if (config.duration !== 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, config.duration || 3000);
    }
    
    return id;
  }

  /**
   * Muestra una alerta de éxito
   */
  success(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'success',
      message,
      title,
      duration
    });
  }

  /**
   * Muestra una alerta de información
   */
  info(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'info',
      message,
      title,
      duration
    });
  }

  /**
   * Muestra una alerta de advertencia
   */
  warning(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'warning',
      message,
      title,
      duration
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(message: string, title?: string, duration?: number): string {
    return this.show({
      type: 'danger',
      message,
      title,
      duration
    });
  }

  /**
   * Elimina una alerta por su ID
   */
  dismiss(id: string): void {
    const alerts = this.alertsSubject.value;
    this.alertsSubject.next(alerts.filter(alert => alert.id !== id));
  }

  /**
   * Elimina todas las alertas
   */
  clear(): void {
    this.alertsSubject.next([]);
  }

  /**
   * Genera un ID único para las alertas
   */
  private generateId(): string {
    return 'alert-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
  }
}