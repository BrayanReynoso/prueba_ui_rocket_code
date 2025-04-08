export interface Student {
    id: number;
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    password: string;
    rolId: number;
    matricula: string | null;
  }
  
  export interface Book {
    id: number;
    titulo: string;
    autor: string;
    stock: number;
    editorial: string;
    disponible: boolean;
    fechaRegistro: string;
  }
  
  export interface Loan {
    id: number;
    usuarioId: number;
    libroId: number;
    fechaPrestamo: string;
    fechaDevolucion: string;
    estado: string;
    usuario: Student;
    libro: Book;
    vencido: boolean;
  }