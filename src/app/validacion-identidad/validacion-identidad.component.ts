import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { ValidacionIdentidadService } from './validacion-identidad.service';
import { ClienteResponse } from './validacion-identidad.interface';

// Adaptador personalizado para formato DD/MM/YYYY
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  override parse(value: any): Date | null {
    if (!value || typeof value !== 'string') {
      return null;
    }
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-validacion-identidad',
  templateUrl: './validacion-identidad.component.html',
  styleUrls: ['./validacion-identidad.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ValidacionIdentidadComponent implements OnInit {
  @Input() esActualizacion: boolean = false;
  @Output() continuar = new EventEmitter<void>();

  hoy = new Date();
  opciones = ['Cédula de ciudadania', 'Tarjeta de identidad'];

  constructor(
    private validacionService: ValidacionIdentidadService,
    private dialog: MatDialog
  ) { }

  // El formulario se crea aquí
  beginForm = new FormGroup({
    tipoDocumento: new FormControl('', [Validators.required]),
    identificacion: new FormControl('', [Validators.required, Validators.minLength(4)]),
    primerApellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    primerNombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    correo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    celular: new FormControl('', [Validators.required, Validators.minLength(10)]),
    fechaExpedicion: new FormControl('', [Validators.required]),
    acceptTerminos: new FormControl(false, [Validators.required]),
    acceptConsultas: new FormControl(false, [Validators.required]),
  });

  ngOnInit() {
  }

  soloNumeros(event: Event, campo: 'identificacion' | 'celular'): void {
    const input = event.target as HTMLInputElement;
    const valorOriginal = input.value;
    const valorLimpio = valorOriginal.replace(/[^0-9]/g, '');
    input.value = valorLimpio;
  }

  soloLetras(event: Event, campo: 'primerApellido' | 'primerNombre') {
    const input = event.target as HTMLInputElement;
    const valorOriginal = input.value;
    const valorLimpio = valorOriginal.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    input.value = valorLimpio;
  }

  formatearFecha(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }

    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length >= 5) {
      valor = valor.substring(0, 5) + '/' + valor.substring(5);
    }

    event.target.value = valor;
  }





  onContinuar() {
    if (this.beginForm.valid) {
      // Guardar datos en el servicio
      this.validacionService.datosUsuario.set({
        tipoDocumento: this.beginForm.get('tipoDocumento')?.value || '',
        identificacion: this.beginForm.get('identificacion')?.value || '',
        primerNombre: this.beginForm.get('primerNombre')?.value || '',
        primerApellido: this.beginForm.get('primerApellido')?.value || '',
        fechaExpedicion: this.beginForm.get('fechaExpedicion')?.value || '',
        celular: this.beginForm.get('celular')?.value || '',
        correo: this.beginForm.get('correo')?.value || ''
      });

      // Si NO es actualización (esActualizacion = false), continuar directamente
      if (!this.esActualizacion) {
        console.log('Modo: Nuevo - Continuando directamente');
        this.continuar.emit();
        return;
      }

      // Si es actualización (esActualizacion = true), validar contra backend
      if (this.esActualizacion) {
        console.log('Modo: Actualización - Validando contra backend');
        this.validarContraBackend();
      }
    }
  }

  private validarContraBackend() {
    const datos = this.validacionService.datosUsuario();
    const codTipo = this.validacionService.getCodTipoIdentificacion(datos.tipoDocumento);
    const entidad = this.validacionService.requestEntidad();

    this.validacionService.getCliente(datos.identificacion, codTipo, entidad).subscribe({
      next: (clienteResponse) => {
        if (clienteResponse.codigo === "1") {
          // Cliente encontrado, validar datos
          const datosValidos = this.validarDatosUsuario(clienteResponse);

          if (datosValidos) {
            // Datos válidos, continuar
            console.log('Datos válidos - Continuando');
            this.continuar.emit();
          } else {
            // Datos inválidos
            this.mostrarMensaje("Validar datos", "Los datos ingresados no coinciden con los registrados");
          }
        } else {
          // Cliente no encontrado
          this.mostrarMensaje("Validar datos", "Cliente no registrado");
        }
      },
      error: (error) => {
        console.error('Error al validar cliente:', error);
        this.mostrarMensaje("Error", "Error al validar la información. Intente nuevamente");
      }
    });
  }

  // Método para validar datos del formulario contra la respuesta del backend
  private validarDatosUsuario(clienteResponse: ClienteResponse): boolean {
    if (!clienteResponse.clientes || clienteResponse.clientes.length === 0) {
      return false;
    }

    const datosForm = this.validacionService.datosUsuario();
    const clienteBD = clienteResponse.clientes[0];
    const codTipo = this.validacionService.getCodTipoIdentificacion(datosForm.tipoDocumento);

    return (
      clienteBD.tipoIdentificacion === codTipo &&
      clienteBD.nit === datosForm.identificacion &&
      clienteBD.primerNombre?.toUpperCase() === datosForm.primerNombre.toUpperCase() &&
      clienteBD.primerApellido?.toUpperCase() === datosForm.primerApellido.toUpperCase() &&
      clienteBD.fechaExpedicion === this.formatFechaMMDDYYYY(datosForm.fechaExpedicion) &&
      clienteBD.movil === datosForm.celular &&
      clienteBD.email?.toLowerCase() === datosForm.correo.toLowerCase()
    );
  }

  // Método para formatear fecha
  private formatFechaMMDDYYYY(fechaString: string): string {
    // Si ya está en formato DD/MM/YYYY, devolverla tal como está
    if (fechaString.includes('/') && fechaString.length === 10) {
      return fechaString;
    }

    // Si es un objeto Date string, convertirlo
    const fecha = new Date(fechaString);
    if (!isNaN(fecha.getTime())) {
      const day = String(fecha.getDate()).padStart(2, '0');
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const year = fecha.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Si no se puede procesar, devolver la cadena original
    return fechaString;
  }

  private mostrarMensaje(titulo: string, descripcion: string) {
    this.dialog.open(MensajeComponent, {
      width: '400px',
      disableClose: true,
      data: {
        titulo: titulo,
        descripcion: descripcion,
        boton: 'ACEPTAR'
      }
    });
  }

  ngOnDestroy() {
  }
}
