import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { InicioService } from './inicio.service';
import { Autentica, Entidad } from './inicio.interface';
import { ValidacionIdentidadComponent } from '../validacion-identidad/validacion-identidad.component';
import { ValidacionOtpComponent } from '../validacion-otp/validacion-otp.component';
import { PreguntasComponent } from '../preguntas/preguntas.component';
import { CapturaInformacionComponent } from '../captura-informacion/captura-informacion.component';
import { FirmaComponent } from '../firma/firma.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    ValidacionIdentidadComponent,
    ValidacionOtpComponent,
    PreguntasComponent,
    CapturaInformacionComponent,
    FirmaComponent
  ]
})
export class InicioComponent implements OnInit {
  public cliente: string = '';
  public requestEntidad: string = '';
  public currentStepIndex: number = 0;
  public esActualizacion: boolean = false;

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
      const processParam = params['Process']?.toLowerCase();
      this.esActualizacion = processParam === 'update';

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

  // Métodos del stepper (MOCK)
  onValidacionIdentidadContinuar() {
    this.currentStepIndex = 1;
    console.log('Avanzar a Validación de Canales');
  }

  onValidacionOtpContinuar() {
    this.currentStepIndex = 2;
    console.log('Avanzar a Cuestionario');
  }

  onValidacionOtpError(error: any) {
    console.log('Error en validación OTP:', error);
  }

  onPreguntasContinuar(datosFormulario?: any) {
    console.log('Datos del cuestionario recibidos:', datosFormulario);
    this.currentStepIndex = 3;
    console.log('Avanzar a Captura de Información');
  }

  onCapturaInformacionContinuar(datosCaptura?: any) {
    console.log('Datos de captura recibidos:', datosCaptura);
    this.currentStepIndex = 4;
    console.log('Avanzar a Firma');
  }

  onFirmaProcesoFinalizado(datosFirma?: any) {
    console.log('Proceso finalizado con datos:', datosFirma);
    alert('¡Proceso de crédito completado exitosamente!');
  }

  tituloProceso(): string {
    return 'Captura Información';
  }
}
