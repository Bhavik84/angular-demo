import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mat-toastr',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './mat-toastr.component.html',
  styleUrl: './mat-toastr.component.scss',
})
export class MatToastrComponent {
  constructor(
    public sbRef: MatSnackBarRef<MatToastrComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; icon: string },
  ) {}
}
