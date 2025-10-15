// Interfaz para una ciudad individual
export interface Ciudad {
  ciudad: string;
  departamento: string;
  codigo_Dane: string;
}

// Interfaz para la respuesta de la API de ciudades
export interface CiudadesResponse {
  codigo: string;
  mensaje: string;
  ciudades: Ciudad[];
}

// Interfaz para la petición a la API de ciudades
export interface CiudadesRequest {
  CodEntidad: string;
}

// ===== INTERFACES PARA CAMPOS DINÁMICOS =====

// Interfaz para un registro individual de tabla maestra (opciones de dropdown)
export interface RegistroTablaMaestra {
  Codigo: string;
  Llave: string;
  Detalle: string;
  Lista: string;
}

// Interfaz para un campo dinámico individual
export interface CampoDinamico {
  campo: string;
  descripcion: string;
  tabla_Almacenamiento: string;
  tabla_Maestra: string;
  filtrar_Lista: string;
  programa: string;
  registrosTablaMaestra: RegistroTablaMaestra[];
}

// Interfaz para la respuesta completa del diccionario de campos dinámicos
export interface DiccionarioCamposResponse {
  codigo: string;
  mensaje: string;
  diccionarioCampos: CampoDinamico[];
}

// Interfaz para la petición del diccionario de campos dinámicos
export interface DiccionarioCamposRequest {
  CodEntidad: string;
}

// Enum para tipos de campos dinámicos (para organización)
export enum TipoCampoDinamico {
  DROPDOWN = 'dropdown',     // Cuando tiene registrosTablaMaestra
  FECHA = 'fecha',          // Cuando descripción contiene palabras clave de fecha
  NUMERO = 'numero',        // Cuando descripción contiene palabras clave de número
  TEXTO = 'texto'           // Por defecto
}

// Interfaz para campo procesado (con tipo determinado)
export interface CampoDinamicoProcessado extends CampoDinamico {
  tipo: TipoCampoDinamico;
  inputType?: string;       // 'text', 'number', 'date'
  required: boolean;        // Todos son obligatorios según requerimientos
}
