import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-captura-informacion',
  templateUrl: './captura-informacion.component.html',
  styleUrls: ['./captura-informacion.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ]
})
export class CapturaInformacionComponent implements OnInit {
  @Input() tituloProceso: string = 'Captura de Información';
  @Output() continuar = new EventEmitter<any>();

  documentosForm: FormGroup;
  archivosSubidos: any[] = [];

  constructor(private fb: FormBuilder) {
    this.documentosForm = this.fb.group({
      cedulaCopia: ['', Validators.required],
      comprobanteIngresos: ['', Validators.required],
      referencias: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('🚀 CapturaInformacionComponent cargado - Solo cuando llega al paso 4');
    console.log('Título del proceso:', this.tituloProceso);
  }


  // Formatear moneda mientras se escribe
  formatCurrency(event: any, fieldName: string) {
    let value = event.target.value;

    // Remover caracteres no numéricos excepto punto
    value = value.replace(/[^\d.]/g, '');

    // Limitar a solo un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limitar decimales a 2 dígitos
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // Formatear con comas para miles (solo la parte entera)
    if (parts.length >= 1 && parts[0].length > 3) {
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      value = parts.length === 2 ? integerPart + '.' + parts[1] : integerPart;
    }

    event.target.value = value;
  }

  // Formatear moneda al salir del campo (blur)
  formatCurrencyOnBlur(event: any, fieldName: string) {
    let value = event.target.value;

    if (value && !value.includes('.')) {
      // Agregar .00 si no tiene decimales
      event.target.value = value + '.00';
    } else if (value && value.endsWith('.')) {
      // Agregar 00 si termina solo con punto
      event.target.value = value + '00';
    } else if (value && value.includes('.')) {
      // Asegurar que tenga 2 decimales
      const parts = value.split('.');
      if (parts[1].length === 1) {
        event.target.value = value + '0';
      }
    }
  }

  // Obtener valor numérico limpio (sin comas ni formato)
  getNumericValue(formattedValue: string): number {
    return parseFloat(formattedValue.replace(/,/g, '')) || 0;
  }

  onContinuar() {
    console.log('Documentos capturados:', this.archivosSubidos);
    this.continuar.emit({
      formulario: this.documentosForm.value,
      archivos: this.archivosSubidos
    });
  }

}
