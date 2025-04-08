import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Sidebar para pantallas medianas y grandes -->
    <div class="d-none d-md-flex flex-column flex-shrink-0 sidebar" style="background-color: #050f2a;">
      <a href="/" class="d-flex align-items-center p-3 link-dark text-decoration-none border-bottom">
        <img src="/images/logo.jpeg" alt="Logo" class="me-2" style="width: 24px; height: 24px;">
        <span class="fs-5 text-white">Prueba Rocket Code</span>
      </a>
      <ul class="nav nav-pills flex-column p-3 mb-auto">
        <li class="nav-item mb-1">
          <a routerLink="/libros" routerLinkActive="active" class="nav-link text-white">
            <i class="bi bi-book me-2"></i>
            Libros
          </a>
        </li>
        <li class="nav-item mb-1">
          <a routerLink="/prestamos" routerLinkActive="active" class="nav-link text-white">
            <i class="bi bi-arrow-left-right me-2"></i>
            Préstamos
          </a>
        </li>
        <li class="nav-item mb-1">
          <a routerLink="/estudiantes" routerLinkActive="active" class="nav-link text-white">
            <i class="bi bi-people me-2"></i>
            Estudiantes
          </a>
        </li>
      </ul>
    </div>
    
    <!-- Navbar móvil en la parte inferior -->
    <div class="d-md-none fixed-bottom mobile-navbar" style="background-color: #050f2a;">
      <div class="row g-0">
        <div class="col-4 py-2">
          <a routerLink="/libros" routerLinkActive="active" class="d-flex flex-column align-items-center text-decoration-none">
            <i class="bi bi-book fs-5 text-white"></i>
            <span class="small text-white">Libros</span>
          </a>
        </div>
        <div class="col-4 py-2">
          <a routerLink="/prestamos" routerLinkActive="active" class="d-flex flex-column align-items-center text-decoration-none">
            <i class="bi bi-arrow-left-right fs-5 text-white"></i>
            <span class="small text-white">Préstamos</span>
          </a>
        </div>
        <div class="col-4 py-2">
          <a routerLink="/estudiantes" routerLinkActive="active" class="d-flex flex-column align-items-center text-decoration-none">
            <i class="bi bi-people fs-5 text-white"></i>
            <span class="small text-white">Estudiantes</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      z-index: 1030;
    }
    
    .nav-link {
      border-radius: 5px;
      transition: all 0.3s ease;
    }
    
    .nav-link:hover, .mobile-navbar a:not(.active):hover {
      background-color: rgba(166, 246, 115, 0.2);
    }
    
    .nav-link.active, .mobile-navbar a.active {
      background-color: #050f2a;
      color: #a6f673 !important;
    }
    
    .mobile-navbar a.active i,
    .mobile-navbar a.active span {
      color: #a6f673 !important; 
    }
    
    .mobile-navbar {
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1030;
    }
    
    .mobile-navbar a {
      padding: 0.5rem;
      transition: all 0.3s ease;
    }
  `]
})
export class SidebarComponent {
}