import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

  constructor(private http: HttpClient) { }

  /**
   * Realiza el login y obtiene el token de autenticación
   */
  private login(): Observable<Autentica> {
    const url = `${this.baseUrl}/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Autentica>(url, this.loginCredentials, { headers })
      .pipe(
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene la información de una entidad específica
   * @param codigoEntidad - Código de la entidad a buscar
   */
  getEntidad(codigoEntidad: string): Observable<Entidad> {
    return this.login().pipe(
      switchMap(authResponse => {
        if (!authResponse.resultado) {
          return throwError(() => new Error('Error en autenticación: ' + authResponse.mensaje));
        }

        const url = `${this.baseUrl}/entidad/Buscar`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResponse.token}`
        });

        const requestBody: BuscarEntidadRequest = {
          codigoEntidad: codigoEntidad
        };

        return this.http.post<Entidad>(url, requestBody, { headers });
      }),
      catchError(error => {
        console.error('Error al obtener entidad:', error);
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
      document.documentElement.style.setProperty(color.llave, color.valor);
    });
  }
}
