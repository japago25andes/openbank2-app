import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ValidacionIdentidadService } from '../validacion-identidad/validacion-identidad.service';

@Component({
  selector: 'app-validacion-otp',
  templateUrl: './validacion-otp.component.html',
  styleUrls: ['./validacion-otp.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ]
})
export class ValidacionOtpComponent implements AfterViewInit {
  @Output() continuar = new EventEmitter<void>();
  @Output() error = new EventEmitter<any>();
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  otpCode = '';
  displayDigits: string[] = Array(6).fill('');
  isValidating = false;

  constructor(
    private validacionIdentidadService: ValidacionIdentidadService
  ) { }

  ngOnInit() {
    // Aquí puedes acceder a la respuesta de validación si es necesario
    const validacionResponse = this.validacionIdentidadService.validacionResponse();
    console.log('Respuesta de validación de identidad:', validacionResponse);
  }

  ngAfterViewInit() {
    // Enfocar el input oculto tan pronto como el componente esté listo
    this.focusInput();
  }

  onCodeChanged(newCode: string) {
    // Limpiar cualquier caracter no numérico
    this.otpCode = newCode.replace(/\D/g, '');
    this.updateDisplayDigits();
  }

  updateDisplayDigits() {
    for (let i = 0; i < 6; i++) {
      this.displayDigits[i] = this.otpCode[i] || '';
    }
  }

  focusInput() {
    // Pequeño retraso para asegurar que el input esté disponible en todos los casos
    setTimeout(() => this.hiddenInput.nativeElement.focus(), 0);
  }

  validateOtp() {
    if (this.otpCode.length !== 6) return;

    this.isValidating = true;
    console.log('Validando código:', this.otpCode);

    setTimeout(() => {
      this.isValidating = false;
      if (this.otpCode === '123456') {
        this.continuar.emit();
      } else {
        this.error.emit('Código OTP incorrecto');
        this.clearOtp();
      }
    }, 1200);
  }

  clearOtp() {
    this.otpCode = '';
    this.updateDisplayDigits();
    this.focusInput();
  }

  onVolver() {
    // Lógica para volver si es necesario
  }
}
