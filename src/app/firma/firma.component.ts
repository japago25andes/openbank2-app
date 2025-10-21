import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirmaService } from './firma.service';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class FirmaComponent implements OnInit, AfterViewInit {
  @Input() datosCliente: any = {};
  @Output() procesarFinalizado = new EventEmitter<any>();
  @ViewChild('hiddenInput') hiddenInput!: ElementRef<HTMLInputElement>;

  pdfUrl: SafeResourceUrl | null = null;
  cargandoPDF = false;
  errorCargaPDF = false;

  // Variables OTP
  otpCode = '';
  displayDigits: string[] = Array(6).fill('');
  isValidating = false;

  constructor(
    private firmaService: FirmaService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    console.log('🚀 FirmaComponent cargado - Solo cuando llega al paso 5');
    console.log('Datos del cliente para firma:', this.datosCliente);
    this.cargarPDF();
    this.enviarOTP();
  }

  ngAfterViewInit() {
    // Enfocar el input oculto después de que la vista esté lista
    setTimeout(() => this.focusInput(), 100);
  }

  cargarPDF() {
    this.cargandoPDF = true;
    this.errorCargaPDF = false;

    this.firmaService.obtenerPDF().subscribe({
      next: (pdfBlob) => {
        const url = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.cargandoPDF = false;
        console.log('✅ PDF cargado correctamente');
      },
      error: (error) => {
        console.error('❌ Error al cargar el PDF:', error);
        this.errorCargaPDF = true;
        this.cargandoPDF = false;
      }
    });
  }

  // ===== FUNCIONES OTP =====
  enviarOTP() {
    console.log('📨 Enviando OTP para firma...');
    // TODO: Mockear el envío de OTP
    // Simulando el envío
    setTimeout(() => {
      console.log('✅ OTP enviado correctamente (mock)');
    }, 1000);
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
    if (this.hiddenInput) {
      setTimeout(() => this.hiddenInput.nativeElement.focus(), 0);
    }
  }

  validateOtp() {
    if (this.otpCode.length !== 6) return;

    this.isValidating = true;
    console.log('🔐 Validando OTP:', this.otpCode);

    // TODO: Mockear la validación de OTP
    setTimeout(() => {
      this.isValidating = false;
      console.log('✅ OTP validado correctamente (mock)');
      
      // Redirigir a la página de Canapro después de validación exitosa
      window.location.href = 'https://www.canapro.com.co/';
    }, 1500);
  }

  clearOtp() {
    this.otpCode = '';
    this.updateDisplayDigits();
    this.focusInput();
  }

  getCelularMask(): string {
    // TODO: Obtener el celular real del usuario
    return '***-***-1234';
  }

  ngOnDestroy() {
    console.log('🔄 FirmaComponent destruido');
  }
}
