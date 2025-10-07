import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuario, ValidacionIdentidadRequest, ValidacionIdentidadResponse } from './validacion-identidad.interface';

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
   * Convierte una fecha a timestamp en milisegundos UTC
   */
  private convertirFechaATimestamp(fecha: string | Date): string {
    let fechaObj: Date;

    if (typeof fecha === 'string' && fecha.includes('/')) {
      // Formato DD/MM/YYYY
      const [dia, mes, anio] = fecha.split('/');
      fechaObj = new Date(Date.UTC(parseInt(anio), parseInt(mes) - 1, parseInt(dia)));
    } else {
      // Cualquier otro formato (Date object o string ISO)
      fechaObj = new Date(fecha);
      fechaObj = new Date(Date.UTC(fechaObj.getFullYear(), fechaObj.getMonth(), fechaObj.getDate()));
    }

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
        PrimerApellido: datosUsuario.primerApellido.toUpperCase(),
        Nombres: datosUsuario.primerNombre.toUpperCase(),
        FechaExpedicion: {
          timestamp: this.convertirFechaATimestamp(datosUsuario.fechaExpedicion)
        },
        celular: datosUsuario.celular,
        email: datosUsuario.correo.toLowerCase()
      }
    };

    console.log('Request de validación:', request);

    //return this.http.post<ValidacionIdentidadResponse>(url, request, { headers });
    return this.http.post<ValidacionIdentidadResponse>('http://localhost:5050/api/v1/identidad/validar', request, { headers });
  }

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
}
