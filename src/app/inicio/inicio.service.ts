import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Autentica, Entidad, LoginRequest, BuscarEntidadRequest } from './inicio.interface';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  private readonly baseUrl = '/api';
  private readonly loginCredentials: LoginRequest = {
    user: 'VirtualCredit',
    password: 'FIvuEV9q3BN9Z&@82c8b'
  };

  // Signal para código de entidad
  codigoEntidad = signal<string>('00000040');

  constructor(private http: HttpClient) { }

  /**
   * Realiza el login y guarda el token en sessionStorage
   */
  login(): Observable<Autentica> {
    const url = `${this.baseUrl}/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Autentica>(url, this.loginCredentials, { headers })
      .pipe(
        tap(response => {
          if (response.resultado && response.token) {
            sessionStorage.setItem('auth_token', response.token);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene la información de una entidad específica
   * @param codigoEntidad - Código de la entidad a buscar
   */
  getEntidad(codigoEntidad: string): Observable<Entidad> {
    const url = `${this.baseUrl}/entidad/Buscar`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestBody: BuscarEntidadRequest = {
      codigoEntidad: codigoEntidad
    };

    return this.http.post<Entidad>(url, requestBody, { headers })
      .pipe(
        tap(() => {
          // Actualizar el signal con el código de entidad
          this.codigoEntidad.set(codigoEntidad);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Aplica los colores dinámicos al documento
   * @param colores - Array de colores a aplicar
   */
  aplicarColores(colores: any[]): void {
    colores.forEach(color => {
      document.documentElement.style.setProperty(`${color.llave}`, color.valor);
    });
  }
}
