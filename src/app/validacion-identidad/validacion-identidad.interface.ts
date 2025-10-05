export interface DatosUsuario {
  tipoDocumento: string;
  identificacion: string;
  primerNombre: string;
  primerApellido: string;
  fechaExpedicion: string;
  celular: string;
  correo: string;
}

export interface ClienteResponse {
  codigo: string;
  mensaje: string;
  clientes: Array<{
    tipoIdentificacion: string;
    nit: string;
    primerNombre: string;
    primerApellido: string;
    fechaExpedicion: string;
    movil: string;
    email: string;
  }>;
}
