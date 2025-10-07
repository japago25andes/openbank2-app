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
   * Valida la identidad del usuario con el backend
   */
  validarIdentidad(request: ValidacionIdentidadRequest): Observable<ValidacionIdentidadResponse> {
    const url = this.baseUrl + '/api/v1/identidad/validar';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //return this.http.post<ValidacionIdentidadResponse>(url, request, { headers });
    return this.http.post<ValidacionIdentidadResponse>('http://localhost:5050/api/v1/identidad/validar', request, { headers });
  }
}
