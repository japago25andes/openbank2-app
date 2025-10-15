import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, map, startWith, Subject, takeUntil } from 'rxjs';
import { CapturaInformacionService } from './captura-informacion.service';
import {
  Ciudad,
  CampoDinamicoProcessado,
  TipoCampoDinamico
} from './captura-informacion.interface';

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
    MatAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class CapturaInformacionComponent implements OnInit, OnDestroy {
  @Input() tituloProceso: string = 'Captura de Información';
  @Output() continuar = new EventEmitter<any>();

  documentosForm: FormGroup;


  // Controles de autocomplete para ciudades
  ciudadExpedicionControl = new FormControl();
  ciudadNacimientoControl = new FormControl();
  ciudadResidenciaControl = new FormControl();
  ciudadTrabajoControl = new FormControl();

  // Observables para filtrado de ciudades
  ciudadesFiltradas!: Observable<Ciudad[]>;
  ciudadesExpedicion!: Observable<Ciudad[]>;
  ciudadesNacimiento!: Observable<Ciudad[]>;
  ciudadesResidencia!: Observable<Ciudad[]>;
  ciudadesTrabajo!: Observable<Ciudad[]>;

  // Estado de carga
  cargandoCiudades = false;
  cargandoCamposDinamicos = false;

  // ===== CAMPOS DINÁMICOS =====
  camposDinamicos: CampoDinamicoProcessado[] = [];
  camposDinamicosForm: FormGroup = new FormGroup({});

  // Enum expuesto para usar en template
  TipoCampoDinamico = TipoCampoDinamico;

  private destroy$ = new Subject<void>();  constructor(
    private fb: FormBuilder,
    private capturaInformacionService: CapturaInformacionService
  ) {
    this.documentosForm = this.fb.group({
      cedulaCopia: ['', Validators.required],
      comprobanteIngresos: ['', Validators.required],
      referencias: ['', Validators.required]
    });

    // Inicializar observables de autocomplete - todos usan la misma fuente
    this.initializeAutocompletes();
  }

  private initializeAutocompletes(): void {
    // Cada control filtra independientemente usando el cache del servicio
    this.ciudadesExpedicion = this.createFilteredObservable(this.ciudadExpedicionControl);
    this.ciudadesNacimiento = this.createFilteredObservable(this.ciudadNacimientoControl);
    this.ciudadesResidencia = this.createFilteredObservable(this.ciudadResidenciaControl);
    this.ciudadesTrabajo = this.createFilteredObservable(this.ciudadTrabajoControl);

    // Alias para compatibilidad
    this.ciudadesFiltradas = this.ciudadesExpedicion;
  }

  private createFilteredObservable(control: FormControl): Observable<Ciudad[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchText = typeof value === 'string' ? value : value?.ciudad || '';
        return this.filterCities(searchText);
      })
    );
  }

  private filterCities(searchText: string): Ciudad[] {
    if (!searchText || searchText.length < 2) {
      return [];
    }

    const cities = this.capturaInformacionService.ciudadesCache;
    const filterValue = searchText.toLowerCase().trim();

    return cities.filter(ciudad =>
      ciudad.ciudad.toLowerCase().includes(filterValue) ||
      ciudad.departamento.toLowerCase().includes(filterValue)
    ).slice(0, 50);
  }

  ngOnInit() {
    console.log('🚀 CapturaInformacionComponent cargado - Solo cuando llega al paso 4');
    console.log('Título del proceso:', this.tituloProceso);

    // Cargar datos al inicializar el componente
    this.cargarCiudades();
    this.cargarCamposDinamicos();
  }  /**
   * Cargar ciudades (delegado al servicio)
   */
  private cargarCiudades(): void {
    this.cargandoCiudades = true;

    this.capturaInformacionService.cargarCiudades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ciudades: Ciudad[]) => {
          this.cargandoCiudades = false;
          console.log('Ciudades cargadas:', ciudades.length);
        },
        error: (error: any) => {
          console.error('Error al cargar ciudades:', error);
          this.cargandoCiudades = false;
        }
      });
  }

  /**
   * Mostrar el texto de la ciudad en el autocomplete
   */
  displayCiudad(ciudad: Ciudad): string {
    return ciudad ? ciudad.ciudad : '';
  }

  /**
   * Manejar selección de ciudad
   */
  onCiudadSeleccionada(ciudad: Ciudad, campo: string): void {
    console.log(`Ciudad seleccionada para ${campo}:`, ciudad);

    // Aquí puedes agregar lógica adicional según el campo
    switch (campo) {
      case 'expedicion':
        // Lógica específica para expedición
        break;
      case 'nacimiento':
        // Lógica específica para nacimiento
        break;
      case 'residencia':
        // Lógica específica para residencia
        break;
      case 'trabajo':
        // Lógica específica para trabajo
        break;
    }
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
    console.log('Documentos capturados:');
    this.continuar.emit();
  }

  // ===== MÉTODOS PARA CAMPOS DINÁMICOS =====

  /**
   * Cargar campos dinámicos desde el servicio
   */
  private cargarCamposDinamicos(): void {
    this.cargandoCamposDinamicos = true;

    this.capturaInformacionService.cargarCamposDinamicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (campos: CampoDinamicoProcessado[]) => {
          this.camposDinamicos = campos;
          this.crearFormularioDinamico(campos);
          this.cargandoCamposDinamicos = false;
          console.log('Campos dinámicos cargados:', campos.length);
        },
        error: (error: any) => {
          console.error('Error al cargar campos dinámicos:', error);
          this.cargandoCamposDinamicos = false;
        }
      });
  }

  /**
   * Crear formulario dinámico basado en los campos obtenidos
   */
  private crearFormularioDinamico(campos: CampoDinamicoProcessado[]): void {
    const formControls: { [key: string]: FormControl } = {};

    campos.forEach(campo => {
      // Todos los campos son obligatorios según requerimientos
      const validators = campo.required ? [Validators.required] : [];
      formControls[campo.campo] = new FormControl('', validators);
    });

    this.camposDinamicosForm = new FormGroup(formControls);
  }

  /**
   * Manejar selección en dropdowns dinámicos
   */
  onCampoDinamicoSeleccionado(campo: CampoDinamicoProcessado, valor: string): void {
    console.log(`Campo dinámico ${campo.campo} seleccionado:`, valor);

    // El valor es el 'Codigo' según requerimientos
    this.camposDinamicosForm.get(campo.campo)?.setValue(valor);
  }

  /**
   * Obtener el valor actual de un campo dinámico
   */
  getCampoDinamicoValue(nombreCampo: string): any {
    return this.camposDinamicosForm.get(nombreCampo)?.value;
  }

  /**
   * Verificar si un campo dinámico tiene errores
   */
  hasCampoDinamicoError(nombreCampo: string): boolean {
    const campo = this.camposDinamicosForm.get(nombreCampo);
    return !!(campo?.invalid && (campo?.dirty || campo?.touched));
  }

  ngOnDestroy() {
    console.log('🔄 CapturaInformacionComponent destruido');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
