// ── Auth / Sesión ────────────────────────────────────────────────────────────
export type Rol = 'ADMIN' | 'USER';

export interface SesionUsuario {
  id: number;
  username: string;
  correo: string;
  rol: Rol;
  token: string;
}

// ── Entidades ────────────────────────────────────────────────────────────────
export interface Dinosaurio {
  id: number;
  nombre: string;
  tipo: string;
  epoca: string;
  categoria?: string;
  imagen?: string;
  habitat?: string;
  alimentacion?: string;
  tamanio?: string;
  curiosidades?: string;
  descripcion?: string;
  publicado: boolean;
}

// ── Contribuciones ───────────────────────────────────────────────────────────
export type EstadoContribucion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Contribucion {
  id: number;
  tipo: string;
  epoca: string;
  titulo: string;
  contenido: string;
  estado: EstadoContribucion;
  observacionAdmin?: string;
  fechaCreacion: string;
  usuario?: { id: number; username?: string };
}

export interface ContribucionRequest {
  tipo: string;
  epoca: string;
  categoria: string;
  titulo: string;
  habitat: string;
  alimentacion: string;
  tamanio: string;
  curiosidades: string;
  imagen: string;
  contenido: string;
}

// ── Mensajes globales ────────────────────────────────────────────────────────
export interface MensajeGlobal {
  tipo: 'success' | 'danger';
  texto: string;
}
