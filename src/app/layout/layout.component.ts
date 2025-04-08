import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../shared/components/sidebar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <!-- Utilizamos las clases de Bootstrap para organizar el layout -->
    <div class="d-flex">
      <app-sidebar></app-sidebar>
      
      <!-- Contenido principal que se adapta automáticamente -->
      <div class="content-wrapper">
        <div class="container-fluid p-3 p-md-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Utilizamos media queries de Bootstrap para ajustar el margen */
    .content-wrapper {
      width: 100%;
      min-height: 100vh;
    }
    
    /* Pantalla mediana y grande - con sidebar */
    @media (min-width: 768px) {
      .content-wrapper {
        margin-left: 280px;
      }
    }
    
    /* Pantalla pequeña - sin sidebar, pero con padding inferior para la navbar */
    @media (max-width: 767.98px) {
      .content-wrapper {
        margin-left: 0;
        padding-bottom: 60px;
      }
    }
  `]
})
export class LayoutComponent {
}