export interface VerificarOtpRequest {
  Identificacion: {
    numero: string;
    tipo: string;
  };
  regValidacion: string;
  idTransaccionOTP: string;
  requiereCuestionario: string;
  Otp: string;
}

export interface VerificarOtpResponse {
  validacionExitosa: string;
  mensajeValidacion: string;
  requiereCuestionario: string;
}
