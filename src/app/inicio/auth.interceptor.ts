import { Injectable } from '@angular/core';

/**
 * Utilidad para manejo de tokens de autenticación en sessionStorage
 */
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  /**
   * Obtiene el token de sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  /**
   * Guarda el token en sessionStorage
   */
  setToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
  }

  /**
   * Elimina el token de sessionStorage
   */
  clearToken(): void {
    sessionStorage.removeItem('auth_token');
  }

  /**
   * Verifica si hay un token válido
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}
