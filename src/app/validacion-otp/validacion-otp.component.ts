import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-validacion-otp',
  templateUrl: './validacion-otp.component.html',
  styleUrls: ['./validacion-otp.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class ValidacionOtpComponent implements OnInit {
  @Output() continuar = new EventEmitter<void>();
  @Output() error = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('🚀 ValidacionOtpComponent cargado - Solo cuando llega al paso 2');
  }

  onContinuar() {
    console.log('Validación OTP completada');
    this.continuar.emit();
  }

  ngOnDestroy() {
    console.log('🔄 ValidacionOtpComponent destruido');
  }
}
