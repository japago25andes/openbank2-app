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
        console.log('Código de entidad recibido:', this.requestEntidad);

        this.inicioService.getEntidad(this.requestEntidad).subscribe({
          next: (entidad) => {
            console.log('Datos de entidad recibidos:', entidad);
            this.entidad = entidad;
            this.cliente = entidad.razon_social;

            // Aplicar colores dinámicamente
            console.log('Aplicando colores:', entidad.colores);
            entidad.colores.forEach(color => {
              document.documentElement.style.setProperty(color.llave, color.valor);
              console.log(`Aplicado: ${color.llave} = ${color.valor}`);
            });
          },
          error: (error) => {
            console.error('Error al obtener entidad:', error);
          }
        });
      } else {
        console.log('No se recibió código de entidad en los parámetros de la URL');
      }
    });
  }

  testUrl() {
    // Redirigir con el parámetro de prueba
    this.router.navigate(['/'], { queryParams: { Entidad: '11001' } });
  }
}
