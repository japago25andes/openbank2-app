import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class FirmaComponent implements OnInit {
  @Input() datosCliente: any = {};
  @Output() procesarFinalizado = new EventEmitter<any>();

  firmaForm: FormGroup;
  procesoCompletado = false;

  constructor(private fb: FormBuilder) {
    this.firmaForm = this.fb.group({
      aceptaTerminos: [false, Validators.requiredTrue],
      aceptaAutorizacion: [false, Validators.requiredTrue],
      firmaDigital: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('🚀 FirmaComponent cargado - Solo cuando llega al paso 5');
    console.log('Datos del cliente para firma:', this.datosCliente);
  }

  onFirmar() {
    if (this.firmaForm.valid) {
      console.log('Procesando firma digital...');

      // Simular proceso de firma
      setTimeout(() => {
        this.procesoCompletado = true;
        console.log('✅ Proceso de crédito completado exitosamente');

        this.procesarFinalizado.emit({
          estado: 'completado',
          fecha: new Date(),
          datosFinales: this.firmaForm.value
        });
      }, 2000);
    }
  }

  ngOnDestroy() {
    console.log('🔄 FirmaComponent destruido');
  }
}
