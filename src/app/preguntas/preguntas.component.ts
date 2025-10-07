import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ValidacionIdentidadService } from '../validacion-identidad/validacion-identidad.service';
import { PreguntasService } from './preguntas.service';
import {
  GenerarCuestionarioRequest,
  GenerarCuestionarioResponse,
  VerificarCuestionarioRequest,
  Pregunta,
  RespuestaUsuario
} from './preguntas.interface';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class PreguntasComponent implements OnInit {
  @Output() continuar = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();

  cuestionarioForm: FormGroup;
  preguntas: Pregunta[] = [];
  isLoading = false;
  isValidating = false;
  cuestionarioData: GenerarCuestionarioResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private validacionIdentidadService: ValidacionIdentidadService,
    private preguntasService: PreguntasService
  ) {
    this.cuestionarioForm = this.fb.group({});
  }

  ngOnInit() {
    this.generarCuestionario();
  }

  generarCuestionario() {
    const validacionResponse = this.validacionIdentidadService.validacionResponse();
    const datosUsuario = this.validacionIdentidadService.datosUsuario();

    if (!validacionResponse || !datosUsuario) {
      this.error.emit('No se encontraron los datos de validación');
      return;
    }

    this.isLoading = true;

    const request: GenerarCuestionarioRequest = {
      identificacion: {
        numero: datosUsuario.identificacion,
        tipo: validacionResponse.identificacion.tipo
      },
      regValidacion: validacionResponse.regValidacion
    };

    this.preguntasService.generarCuestionario(request).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.generado === "True") {
          this.cuestionarioData = response;
          this.preguntas = response.preguntas.pregunta;
          this.construirFormulario();
        } else {
          this.error.emit('No se pudo generar el cuestionario');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error.emit('Error de conexión al generar cuestionario');
      }
    });
  }

  construirFormulario() {
    const formControls: any = {};

    if (this.preguntas && this.preguntas.length > 0) {
      this.preguntas.forEach(pregunta => {
        const controlName = `pregunta_${pregunta.id}`;
        formControls[controlName] = ['', [Validators.required]];
      });
    }

    this.cuestionarioForm = this.fb.group(formControls);
  }

  get todasLasRespuestasCompletas(): boolean {
    if (!this.preguntas || this.preguntas.length === 0) return false;

    return this.preguntas.every(pregunta => {
      const valor = this.cuestionarioForm.get(`pregunta_${pregunta.id}`)?.value;
      return valor && valor !== '';
    });
  }

  onVerificarRespuestas() {
    if (!this.cuestionarioData || !this.todasLasRespuestasCompletas) return;

    const datosUsuario = this.validacionIdentidadService.datosUsuario();
    if (!datosUsuario) return;

    this.isValidating = true;

    // Construir array de respuestas
    // NOTA: idPregunta debe ser el campo 'orden', pero el control del formulario usa 'id'
    const respuestas: RespuestaUsuario[] = this.preguntas.map(pregunta => ({
      idPregunta: pregunta.orden, // Usamos 'orden' para el API
      idRespuesta: this.cuestionarioForm.get(`pregunta_${pregunta.id}`)?.value // Pero el control usa 'id'
    }));

    const validacionResponse = this.validacionIdentidadService.validacionResponse();

    const request: VerificarCuestionarioRequest = {
      identificacion: {
        numero: datosUsuario.identificacion,
        tipo: validacionResponse?.identificacion.tipo || 'CC'
      },
      idCuestionario: this.cuestionarioData.idCuestionario,
      regCuestionario: this.cuestionarioData.regCuestionario,
      respuestas: respuestas
    };

    this.preguntasService.verificarCuestionario(request).subscribe({
      next: (response) => {
        this.isValidating = false;

        if (response.resultado === "true") {
          this.continuar.emit();
        } else {
          this.error.emit('Las respuestas no son correctas. Intente nuevamente');
        }
      },
      error: (error) => {
        this.isValidating = false;
        this.error.emit('Error de conexión al verificar respuestas');
      }
    });
  }
}
