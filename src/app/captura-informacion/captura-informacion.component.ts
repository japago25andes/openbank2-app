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

  onFileSelected(event: any, tipo: string) {
    const file = event.target.files[0];
    if (file) {
      this.archivosSubidos.push({
        tipo: tipo,
        nombre: file.name,
        tamanio: file.size
      });
      console.log('Archivo seleccionado:', file.name);
    }
  }

  onContinuar() {
    console.log('Documentos capturados:', this.archivosSubidos);
    this.continuar.emit({
      formulario: this.documentosForm.value,
      archivos: this.archivosSubidos
    });
  }

  ngOnDestroy() {
    console.log('🔄 CapturaInformacionComponent destruido');
  }
}
