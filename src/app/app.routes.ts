import { Routes } from '@angular/router';
import { BookListComponent } from './features/books/book-list.component';
import { LayoutComponent } from './layout/layout.component';
import { LoanListComponent } from './features/loans/loans.component';
import { StudentListComponent } from './features/student/student-list.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/libros',
    pathMatch: 'full'
  },
  { 
    path: 'libros', 
    component: LayoutComponent,
    children: [
      { path: '', component: BookListComponent }
    ]
  },
  { 
    path: 'prestamos', 
    component: LayoutComponent,
    children: [
      { path: '', component: LoanListComponent }
    ]
  },
  { 
    path: 'estudiantes', 
    component: LayoutComponent,
    children: [
      { path: '', component: StudentListComponent }
    ]
  },
];