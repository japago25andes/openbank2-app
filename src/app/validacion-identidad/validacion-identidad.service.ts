import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DatosUsuario, ClienteResponse, ValidacionIdentidadRequest, ValidacionIdentidadResponse } from './validacion-identidad.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidacionIdentidadService {

  // Signal para manejar los datos del usuario
  datosUsuario = signal<DatosUsuario>({
    tipoDocumento: '',
    identificacion: '',
    primerNombre: '',
    primerApellido: '',
    fechaExpedicion: '',
    celular: '',
    correo: ''
  });

  // Signal para manejar la respuesta de validación
  validacionResponse = signal<ValidacionIdentidadResponse | null>(null);

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el código del tipo de identificación
   */
  getCodTipoIdentificacion(tipoDocumento: string): string {
    switch (tipoDocumento) {
      case 'Cédula de ciudadania':
        return '1';
      case 'Tarjeta de identidad':
        return '2';
      default:
        return '1';
    }
  }

  /**
   * Obtiene la entidad de la request (mockeado por ahora)
   */
  requestEntidad(): string {
    return 'ENTIDAD_TEST';
  }

  /**
   * Obtiene información del cliente desde el backend
   * Por ahora está mockeado, después se conectará al API real
   */
  getCliente(identificacion: string, codTipo: string, entidad: string): Observable<ClienteResponse> {
    // Mock de respuesta - después se reemplazará por llamada HTTP real
    const mockResponse: ClienteResponse = {
      codigo: "1",
      mensaje: "Cliente encontrado",
      clientes: [{
        tipoIdentificacion: codTipo,
        nit: identificacion,
        primerNombre: "Usuario",
        primerApellido: "Prueba",
        fechaExpedicion: "01/01/2020",
        movil: "3001234567",
        email: "usuario@prueba.com"
      }]
    };

    // Simular llamada asíncrona
    return of(mockResponse);

    // Cuando esté listo el backend, descomenta esto:
    /*
    const url = `${this.baseUrl}/cliente`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      identificacion,
      tipoIdentificacion: codTipo,
      entidad
    };

    return this.http.post<ClienteResponse>(url, body, { headers });
    */
  }

  /**
   * Convierte una fecha en formato YYYY-MM-DD a timestamp en milisegundos
   */
  private convertirFechaATimestamp(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.getTime().toString();
  }

  /**
   * Valida la identidad del usuario con el backend
   */
  validarIdentidad(datosUsuario: DatosUsuario): Observable<ValidacionIdentidadResponse> {
    const url = this.baseUrl + '/api/v1/identidad/validar';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const request: ValidacionIdentidadRequest = {
      idUsuarioEntidad: "OTAwNzIxOTA3LjE=",
      paramProducto: "3635",
      producto: "011",
      canal: "001",
      datosValidacion: {
        identificacion: {
          numero: datosUsuario.identificacion,
          tipo: this.getCodTipoIdentificacion(datosUsuario.tipoDocumento)
        },
        PrimerApellido: datosUsuario.primerApellido,
        Nombres: datosUsuario.primerNombre,
        FechaExpedicion: {
          timestamp: this.convertirFechaATimestamp(datosUsuario.fechaExpedicion)
        },
        celular: datosUsuario.celular,
        email: datosUsuario.correo
      }
    };

    console.log('Request de validación:', request);

    return this.http.post<ValidacionIdentidadResponse>(url, request, { headers });
  }
}
