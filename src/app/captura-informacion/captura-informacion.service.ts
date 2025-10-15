import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { CiudadesResponse, CiudadesRequest, Ciudad } from './captura-informacion.interface';

@Injectable({
  providedIn: 'root'
})
export class CapturaInformacionService {
  private readonly API_URL = 'https://localhost:7124/entidad/Ciudades';
  private readonly COD_ENTIDAD = '00000040'; // Valor fijo por ahora

  // Cache de ciudades para evitar múltiples llamadas
  private ciudadesCache$ = new BehaviorSubject<Ciudad[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Cargar todas las ciudades desde la API
   */
  cargarCiudades(): Observable<Ciudad[]> {
    // Si ya tenemos ciudades en cache, las devolvemos
    if (this.ciudadesCache$.value.length > 0) {
      return this.ciudadesCache$.asObservable();
    }

    const request: CiudadesRequest = {
      CodEntidad: this.COD_ENTIDAD
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<CiudadesResponse>(this.API_URL, request, { headers })
      .pipe(
        map(response => {
          if (response.codigo === '1' && response.ciudades) {
            // Ordenar ciudades alfabéticamente por ciudad
            const ciudadesOrdenadas = response.ciudades.sort((a, b) =>
              a.ciudad.localeCompare(b.ciudad)
            );

            // Guardar en cache
            this.ciudadesCache$.next(ciudadesOrdenadas);
            return ciudadesOrdenadas;
          } else {
            console.error('Error en respuesta de API:', response.mensaje);
            return [];
          }
        }),
        catchError(error => {
          console.error('Error al cargar ciudades:', error);
          return of([]);
        })
      );
  }

  /**
   * Obtener una ciudad por código DANE
   */
  obtenerCiudadPorCodigo(codigoDane: string): Observable<Ciudad | undefined> {
    return this.ciudadesCache$.pipe(
      map(ciudades => ciudades.find(ciudad => ciudad.codigo_Dane === codigoDane))
    );
  }

  /**
   * Obtener ciudades desde cache (para uso directo en filtros)
   */
  get ciudadesCache(): Ciudad[] {
    return this.ciudadesCache$.value;
  }
}
