import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-validacion-identidad',
  templateUrl: './validacion-identidad.component.html',
  styleUrls: ['./validacion-identidad.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ValidacionIdentidadComponent implements OnInit {
  @Input() entidad: any = {};
  @Output() continuar = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    console.log('🚀 ValidacionIdentidadComponent cargado - Solo cuando llega al paso 1');
    console.log('Entidad recibida:', this.entidad);
  }

  onContinuar() {
    console.log('Validación de identidad completada');
    this.continuar.emit();
  }

  ngOnDestroy() {
    console.log('🔄 ValidacionIdentidadComponent destruido');
  }
}
