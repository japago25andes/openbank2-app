import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { InicioService } from './inicio.service';
import { Autentica, Entidad } from './inicio.interface';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class InicioComponent implements OnInit {
  public cliente: string = '';
  public requestEntidad: string = '';
  public token: Autentica = {
    token: '',
    resultado: false,
    mensaje: ''
  };

  public entidad: Entidad = {
    id_Cliente: '',
    nit: '',
    razon_social: '',
    cod_entidad: '',
    colores: [],
    nombre_comercial: '',
    bloqueado: false,
    mensaje: '',
    parametrizacion: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inicioService: InicioService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.requestEntidad = params['Entidad'];

      if (this.requestEntidad) {
        // Primero hacer login para obtener el token
        this.inicioService.login().subscribe({
          next: (authResponse) => {
            if (authResponse.resultado) {
              // Ahora buscar la entidad con el token ya guardado
              this.inicioService.getEntidad(this.requestEntidad).subscribe({
                next: (entidad) => {
                  this.entidad = entidad;
                  this.cliente = entidad.razon_social;

                  // Aplicar colores dinámicamente
                  entidad.colores.forEach(color => {
                    document.documentElement.style.setProperty(color.llave, color.valor);
                  });
                },
                error: (error) => {
                  // Error al obtener entidad
                }
              });
            } else {
              // Error en login
            }
          },
          error: (error) => {
            // Error en login
          }
        });
      } else {
        // No se recibió código de entidad
      }
    });
  }

  testUrl() {
    // Redirigir con el parámetro de prueba
    this.router.navigate(['/'], { queryParams: { Entidad: '11001' } });
  }
}
