import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import {
  CiudadesResponse,
  CiudadesRequest,
  Ciudad,
  DiccionarioCamposResponse,
  DiccionarioCamposRequest,
  CampoDinamico,
  CampoDinamicoProcessado,
  TipoCampoDinamico
} from './captura-informacion.interface';
import { InicioService } from '../inicio/inicio.service';

@Injectable({
  providedIn: 'root'
})
export class CapturaInformacionService {
  // URLs de las APIs
  private readonly CIUDADES_API_URL = 'https://localhost:7124/entidad/Ciudades';
  private readonly DICCIONARIO_API_URL = 'https://localhost:7124/entidad/DiccionarioCamposDinamicos';

  private inicioService = inject(InicioService);

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
      CodEntidad: this.inicioService.codigoEntidad()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<CiudadesResponse>(this.CIUDADES_API_URL, request, { headers })
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

  // ===== MÉTODOS PARA CAMPOS DINÁMICOS =====

  /**
   * Cargar diccionario de campos dinámicos desde la API
   */
  cargarCamposDinamicos(): Observable<CampoDinamicoProcessado[]> {
    const request: DiccionarioCamposRequest = {
      CodEntidad: this.inicioService.codigoEntidad()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<DiccionarioCamposResponse>(this.DICCIONARIO_API_URL, request, { headers })
      .pipe(
        map(response => {
          if (response.codigo === '1' && response.diccionarioCampos) {
            return this.procesarCamposDinamicos(response.diccionarioCampos);
          } else {
            console.error('Error en respuesta de diccionario:', response.mensaje);
            return [];
          }
        }),
        catchError(error => {
          console.error('Error al cargar campos dinámicos:', error);
          return of([]);
        })
      );
  }

  /**
   * Procesar campos dinámicos para determinar su tipo y configuración
   */
  private procesarCamposDinamicos(campos: CampoDinamico[]): CampoDinamicoProcessado[] {
    return campos.map(campo => {
      const tipo = this.determinarTipoCampo(campo);

      return {
        ...campo,
        tipo,
        inputType: this.getInputType(tipo),
        required: true // Todos son obligatorios según requerimientos
      };
    });
  }

  /**
   * Determinar el tipo de campo basado en registrosTablaMaestra y descripción
   */
  private determinarTipoCampo(campo: CampoDinamico): TipoCampoDinamico {
    // Si tiene registros de tabla maestra, es un dropdown
    if (campo.registrosTablaMaestra && campo.registrosTablaMaestra.length > 0) {
      return TipoCampoDinamico.DROPDOWN;
    }

    // Analizar descripción (case-insensitive) para determinar tipo
    const descripcion = campo.descripcion.toLowerCase();

    // Palabras clave para fecha - TODO: Ajustar desde backend si es necesario
    if (descripcion.includes('fecha') ||
        descripcion.includes('ingreso') && descripcion.includes('laboral')) {
      return TipoCampoDinamico.FECHA;
    }

    // Palabras clave para número - TODO: Ajustar desde backend si es necesario
    if (descripcion.includes('numero') ||
        descripcion.includes('valor') ||
        descripcion.includes('ingreso') ||
        descripcion.includes('salario') ||
        descripcion.includes('monto')) {
      return TipoCampoDinamico.NUMERO;
    }

    // Por defecto es texto
    return TipoCampoDinamico.TEXTO;
  }

  /**
   * Obtener el tipo de input HTML según el tipo de campo
   */
  private getInputType(tipo: TipoCampoDinamico): string {
    switch (tipo) {
      case TipoCampoDinamico.FECHA:
        return 'date';
      case TipoCampoDinamico.NUMERO:
        return 'number';
      case TipoCampoDinamico.TEXTO:
      case TipoCampoDinamico.DROPDOWN:
      default:
        return 'text';
    }
  }
}
