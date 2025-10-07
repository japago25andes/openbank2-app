import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ValidacionIdentidadService } from '../validacion-identidad/validacion-identidad.service';
import { ValidacionOtpService } from './validacion-otp.service';
import { VerificarOtpRequest } from './validacion-otp.interface';

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
    private validacionIdentidadService: ValidacionIdentidadService,
    private validacionOtpService: ValidacionOtpService
  ) { }

  ngOnInit() {

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

    const validacionResponse = this.validacionIdentidadService.validacionResponse();
    const datosUsuario = this.validacionIdentidadService.datosUsuario();

    if (!validacionResponse || !datosUsuario) {
      this.error.emit('No se encontraron los datos de validación');
      return;
    }

    this.isValidating = true;

    // Armar la request de verificación OTP
    const request: VerificarOtpRequest = {
      Identificacion: {
        numero: datosUsuario.identificacion,
        tipo: validacionResponse.identificacion.tipo
      },
      regValidacion: validacionResponse.regValidacion,
      idTransaccionOTP: validacionResponse.solicitarDatos.resultadoGeneracion.idTransaccionOTP,
      requiereCuestionario: validacionResponse.solicitarDatos.resultadoGeneracion.requiereCuestionario,
      Otp: this.otpCode
    };

    // Realizar verificación de OTP
    this.validacionOtpService.verificarOtp(request).subscribe({
      next: (response) => {
        this.isValidating = false;

        if (response.requiereCuestionario === "true") {
          this.continuar.emit();
        } else {
          this.error.emit(response.mensajeValidacion || 'Código OTP incorrecto');
          this.clearOtp();
        }
      },
      error: (error) => {
        this.isValidating = false;
        console.error('Error al verificar OTP:', error);
        this.error.emit('Error de conexión. Intente nuevamente');
        this.clearOtp();
      }
    });
  }

  clearOtp() {
    this.otpCode = '';
    this.updateDisplayDigits();
    this.focusInput();
  }

  getCelularMask(): string {
    const datosUsuario = this.validacionIdentidadService.datosUsuario();
    if (!datosUsuario || !datosUsuario.celular) {
      return '***-***-****';
    }

    const celular = datosUsuario.celular;

    // Si el celular tiene 10 dígitos (ej: 3188895177)
    if (celular.length === 10) {
      return `***-***-${celular.slice(-4)}`;
    }

    // Para otros formatos, mostrar solo los últimos 4 dígitos
    return `***-***-${celular.slice(-4)}`;
  }

}
