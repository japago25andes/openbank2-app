import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InicioService } from '../inicio/inicio.service';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {
  private readonly API_URL = 'http://localhost:5050/api/v1/formato/obtener';
  private inicioService = inject(InicioService);

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el PDF del formato desde el backend
   */
  obtenerPDF(): Observable<Blob> {
    const codigoEntidad = this.inicioService.codigoEntidad();
    const url = `${this.API_URL}/${codigoEntidad}`;

    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(url, {
      headers,
      responseType: 'blob'
    });
  }
}
