import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './mensaje.component.html',
  styleUrl: './mensaje.component.css'
})

export class MensajeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string; descripcion: string; boton?: string, url?: string },
    private router: Router, private dialogRef: MatDialogRef<MensajeComponent>
  ) { }

  desvanecer = false;
  mostrandoLoader = false;
  tiempo = 1000;

  irPortal() {
    this.desvanecer = true;
    this.mostrandoLoader = true;
    this.tiempo = 1000;

    setTimeout(() => {
      this.dialogRef.close('aceptar');
    }, this.tiempo);
  }
}
