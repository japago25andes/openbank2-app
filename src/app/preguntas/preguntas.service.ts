import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GenerarCuestionarioRequest,
  GenerarCuestionarioResponse,
  VerificarCuestionarioRequest,
  VerificarCuestionarioResponse
} from './preguntas.interface';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) { }

  generarCuestionario(request: GenerarCuestionarioRequest): Observable<GenerarCuestionarioResponse> {
    const url = this.baseUrl + '/api/v1/identidad/generarCuestionario';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //return this.http.post<GenerarCuestionarioResponse>(url, request, { headers });
    return this.http.post<GenerarCuestionarioResponse>('http://localhost:5050/api/v1/identidad/generarCuestionario', request, { headers });
  }

  verificarCuestionario(request: VerificarCuestionarioRequest): Observable<VerificarCuestionarioResponse> {
    const url = this.baseUrl + '/api/v1/identidad/verificarCuestionario';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //return this.http.post<VerificarCuestionarioResponse>(url, request, { headers });
    return this.http.post<VerificarCuestionarioResponse>('http://localhost:5050/api/v1/identidad/verificarCuestionario', request, { headers });
  }
}
