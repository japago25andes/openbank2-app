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
