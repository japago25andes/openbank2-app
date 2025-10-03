// Interfaz para la autenticación
export interface Autentica {
  token: string;
  resultado: boolean;
  mensaje: string;
}

// Interfaz para los colores dinámicos
export interface Color {
  llave: string;
  valor: string;
}

// Interfaz para los parámetros de configuración
export interface Parametrizacion {
  cod_parametro: number;
  nombre: string;
  detalle: string;
  cuenta: number;
  fecha: string;
  nombre_usuario: string;
  tipo_Parametro: number;
}

// Interfaz para la entidad
export interface Entidad {
  id_Cliente: string;
  nit: string;
  razon_social: string;
  cod_entidad: string;
  colores: Color[];
  nombre_comercial: string;
  bloqueado: boolean;
  mensaje: string;
  parametrizacion: Parametrizacion[];
}

// Interfaces para las peticiones
export interface LoginRequest {
  user: string;
  password: string;
}

export interface BuscarEntidadRequest {
  codigoEntidad: string;
}
