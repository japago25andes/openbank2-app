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

// Interfaces para la validación de identidad
export interface ValidacionIdentidadRequest {
  idUsuarioEntidad: string;
  paramProducto: string;
  producto: string;
  canal: string;
  datosValidacion: DatosValidacionRequest;
}

export interface DatosValidacionRequest {
  identificacion: IdentificacionRequest;
  PrimerApellido: string;
  Nombres: string;
  FechaExpedicion: FechaTimestamp;
  celular: string;
  email: string;
}

export interface IdentificacionRequest {
  numero: string;
  tipo: string;
}

export interface FechaTimestamp {
  timestamp: string;
}

// Interfaces para la respuesta de validación
export interface ValidacionIdentidadResponse {
  valApellido: string;
  valNombre: string;
  valFechaExp: string;
  excluirCliente: string;
  alertas: string;
  respuestaAlerta: string;
  codigoAlerta: string;
  resultado: string;
  regValidacion: string;
  resultadoProceso: string;
  consultasDisponibles: string;
  identificacion: IdentificacionResponse;
  nombre: string;
  fechaExpedicion: FechaTimestamp;
  solicitarDatos: SolicitarDatos;
}

export interface IdentificacionResponse {
  numero: string;
  tipo: string;
}

export interface SolicitarDatos {
  codParametrizacion: string;
  resultadoValidacion: ResultadoValidacion;
  resultadoGeneracion: ResultadoGeneracion;
  datosCuestionario: DatosCuestionario;
}

export interface ResultadoValidacion {
  enviadoOtpCorreo: string;
  enviadoOtpCelular: string;
  riesgoCorreo: string;
  riesgoCelular: string;
  rankingReconocer: string;
  numeroValido: string;
}

export interface ResultadoGeneracion {
  requiereCuestionario: string;
  timestampOTP: string;
  codResultadoOTP: string;
  idTransaccionOTP: string;
  resultadoOTP: string;
}

export interface DatosCuestionario {
  regValidacion: string;
  procesoEvidente: string;
}
