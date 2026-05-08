// ── Auth / Sesión ────────────────────────────────────────────────────────────
export type Rol = 'ADMIN' | 'USER';

export interface SesionUsuario {
  id: number;
  username: string;
  rol: Rol;
  token: string;
}

// ── Entidades ────────────────────────────────────────────────────────────────
export interface Personaje {
  id: number;
  nombre: string;
  contenidoHtml: string;
  imagenUrl?: string;
  publicado: boolean;
  [key: string]: unknown;
}

export interface Saga {
  id: number;
  nombre: string;
  contenidoHtml: string;
  publicado: boolean;
  [key: string]: unknown;
}

export interface Raza {
  id: number;
  nombre: string;
  contenidoHtml: string;
  publicado: boolean;
  [key: string]: unknown;
}

// ── Contribuciones ───────────────────────────────────────────────────────────
export type EstadoContribucion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Contribucion {
  id: number;
  tipo: string;
  titulo: string;
  contenidoHtml: string;
  estado: EstadoContribucion;
  observacionAdmin?: string;
  fechaCreacion: string;
  usuario?: { id: number; username?: string };
}

export interface ContribucionRequest {
  tipo: string;
  titulo: string;
  contenidoHtml: string;
}

// ── Mensajes globales ────────────────────────────────────────────────────────
export interface MensajeGlobal {
  tipo: 'success' | 'danger';
  texto: string;
}
