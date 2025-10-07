// Request para generar cuestionario
export interface GenerarCuestionarioRequest {
  identificacion: {
    numero: string;
    tipo: string;
  };
  regValidacion: string;
}

// Response de generar cuestionario
export interface GenerarCuestionarioResponse {
  generado: string;
  idCuestionario: string;
  regCuestionario: string;
  resultadoPreguntas: number;
  preguntas: Preguntas;
  mensaje: string;
}

export interface Preguntas {
  id: string;
  resultado: string;
  registro: string;
  excluirCliente: string;
  alertas: string;
  respuestaAlerta: string;
  codigoAlerta: string;
  pregunta: Pregunta[];
}

export interface Pregunta {
  id: string;
  texto: string;
  orden: string;
  idRespuestaCorrecta: string;
  peso: string;
  respuesta: Respuesta[];
}

export interface Respuesta {
  id: string;
  texto: string;
}

// Request para verificar cuestionario
export interface VerificarCuestionarioRequest {
  identificacion: {
    numero: string;
    tipo: string;
  };
  idCuestionario: string;
  regCuestionario: string;
  respuestas: RespuestaUsuario[];
}

export interface RespuestaUsuario {
  idPregunta: string;
  idRespuesta: string;
}

// Response de verificar cuestionario
export interface VerificarCuestionarioResponse {
  resultado: string;
  aprobacion: string;
  preguntasCompletas: string;
  score: string;
  codigoSeguridad: string;
  idCuestionario: string;
  regCuestionario: string;
  aprobado100PorCientoOK: string;
}
