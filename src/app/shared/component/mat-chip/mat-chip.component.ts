import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from '../../interfaces/alabern-portal';

@Component({
  selector: 'app-mat-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, CommonModule, TranslateModule],
  templateUrl: './mat-chip.component.html',
  styleUrl: './mat-chip.component.scss',
})
export class MatChipComponent {
  @Input() items: filter[] = [];
  @Output() dataEvent: EventEmitter<filter> = new EventEmitter<filter>();

  remove(item: filter): void {
    const index = this.items.findIndex((i) => i.id === item.id);

    if (index >= 0) {
      this.items.splice(index, 1);
    }
    this.dataEvent.emit(item);
  }

  trackById(index: number, item: filter): number {
    return Number(item.id);
  }
}
