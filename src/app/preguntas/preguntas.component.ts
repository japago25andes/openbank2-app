import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule
  ]
})
export class PreguntasComponent implements OnInit {
  @Output() continuar = new EventEmitter<any>();

  cuestionarioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cuestionarioForm = this.fb.group({
      ingresoMensual: ['', [Validators.required, Validators.min(1)]],
      tieneOtrosCreditos: ['', Validators.required],
      montoSolicitado: ['', [Validators.required, Validators.min(100000)]]
    });
  }

  ngOnInit() {
    console.log('🚀 PreguntasComponent cargado - Solo cuando llega al paso 3');
  }

  onContinuar() {
    if (this.cuestionarioForm.valid) {
      console.log('Cuestionario completado:', this.cuestionarioForm.value);
      this.continuar.emit(this.cuestionarioForm.value);
    }
  }

  ngOnDestroy() {
    console.log('🔄 PreguntasComponent destruido');
  }
}
