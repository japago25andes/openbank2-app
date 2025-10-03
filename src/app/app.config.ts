import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';

import { routes } from './app.routes';

// Crear el interceptor como función
const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Si la petición es para login, no agregar token
  if (req.url.includes('/login')) {
    return next(req);
  }

  // Para otras peticiones, agregar token si existe
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
