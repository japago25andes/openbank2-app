import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirmaService } from './firma.service';
import { CapturaInformacionService } from '../captura-informacion/captura-informacion.service';
import { DatosFormularioCaptura } from '../captura-informacion/captura-informacion.interface';
import { PDFDocument } from 'pdf-lib';

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
    private sanitizer: DomSanitizer,
    private capturaInformacionService: CapturaInformacionService
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
      next: async (pdfBlob) => {
        try {
          // Cargar el PDF con pdf-lib
          const arrayBuffer = await pdfBlob.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);

          // Obtener el formulario del PDF
          const form = pdfDoc.getForm();
          const fields = form.getFields();

          console.log('📄 Campos disponibles en el PDF:', fields.length);
          console.log('📋 Nombres de campos:', fields.map(f => f.getName()));

          // Obtener datos mapeados
          const datosMapeados = this.mapearDatosParaPDF();

          // Rellenar los campos del PDF
          let camposRellenados = 0;
          Object.keys(datosMapeados).forEach(nombreCampo => {
            try {
              const field = form.getTextField(nombreCampo);
              if (field && datosMapeados[nombreCampo]) {
                field.setText(datosMapeados[nombreCampo]);
                camposRellenados++;
              }
            } catch (error) {
              // El campo no existe o no es un campo de texto, ignorar
              console.debug(`Campo '${nombreCampo}' no encontrado en el PDF`);
            }
          });

          console.log(`✅ ${camposRellenados} campos rellenados en el PDF`);

          // Aplanar el formulario para que los campos no sean editables
          // form.flatten();

          // Guardar el PDF modificado
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.cargandoPDF = false;
          console.log('✅ PDF cargado y rellenado correctamente');
        } catch (error) {
          console.error('❌ Error al procesar el PDF:', error);
          // Si falla el procesamiento, mostrar el PDF original
          const url = URL.createObjectURL(pdfBlob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.cargandoPDF = false;
        }
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

  /**
   * Mapea los datos del formulario capturado a los campos del PDF
   */
  private mapearDatosParaPDF(): { [key: string]: string } {
    const datosFormulario = this.capturaInformacionService.datosFormulario();

    if (!datosFormulario) {
      console.warn('⚠️ No hay datos del formulario para mapear al PDF');
      return {};
    }

    console.log('📄 Mapeando datos para el PDF:', datosFormulario);

    // Formatear fechas de YYYY-MM-DD a DD/MM/YY
    const formatearFecha = (fecha: string): string => {
      if (!fecha) return '';
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year.slice(2)}`;
    };

    // Mapeo de campos del formulario a campos del PDF
    const camposPDF: { [key: string]: string } = {
      // Información Personal
      'txtidentificacion': datosFormulario.identificacion || '',
      'txtprimernombre_cliente': datosFormulario.primerNombre || '',
      'txtsegundonombre_cliente': datosFormulario.segundoNombre || '',
      'txtprimerapellido_cliente': datosFormulario.primerApellido || '',
      'txtsegundoapellido_cliente': datosFormulario.segundoApellido || '',
      'txtfechaexpediciondd': formatearFecha(datosFormulario.fechaExpedicion),
      'txtlugarexpedicion': datosFormulario.ciudadExpedicion?.ciudad || '',
      'txtfechanacimientodd': formatearFecha(datosFormulario.fechaNacimiento),
      'txtmunicipionacimiento': datosFormulario.ciudadNacimiento?.ciudad || '',
      'txtdepartamentonacimiento': datosFormulario.ciudadNacimiento?.departamento || '',
      'txtdirecciondeudor': datosFormulario.direccionResidencia || '',
      'txtmunicipio': datosFormulario.ciudadResidencia?.ciudad || '',
      'txtdepartamentoresidencia': datosFormulario.ciudadResidencia?.departamento || '',
      'txtfijodeudor': datosFormulario.telefonoResidencia || '',
      'txtmovildeudor': datosFormulario.movil || '',

      // Información Laboral
      'txtempresa': datosFormulario.sitioTrabajo || '',
      'txtcargo': datosFormulario.cargo || '',
      'txtdirecciontrabajo': datosFormulario.direccionTrabajo || '',
      'txtciudadtrabajo': datosFormulario.ciudadTrabajo?.ciudad || '',
      'txtdepartamentotrabajo': datosFormulario.ciudadTrabajo?.departamento || '',
      'txtingreso': datosFormulario.salario || '',

      // Información Financiera
      'txtaportemensual': datosFormulario.valorAporte || ''
    };

    // Agregar campos dinámicos si existen
    if (datosFormulario.camposDinamicos) {
      Object.keys(datosFormulario.camposDinamicos).forEach(key => {
        camposPDF[key] = datosFormulario.camposDinamicos[key]?.toString() || '';
      });
    }

    console.log('✅ Campos mapeados para el PDF:', Object.keys(camposPDF).length);
    return camposPDF;
  }

  ngOnDestroy() {
    console.log('🔄 FirmaComponent destruido');
  }
}
