import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../core/service/common/common.service';
import { Acquisitions } from '../../interfaces/acquisitions';
import { Authors } from '../../interfaces/authors';

@Component({
  selector: 'app-year-selection',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    TranslateModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './year-selection.component.html',
  styleUrl: './year-selection.component.scss',
})
export class YearSelectionComponent {
  yearRange = 10;
  lowerLimitYear = 1966;
  date = new Date();
  currentStartIndex = 0;
  itemsPerPage = 10;
  currentYear: number = new Date().getFullYear();
  initialCurrentyear: number = this.currentYear;
  displayedYears: number[] = this.getLastYears(this.currentYear);
  years: number[] = [];
  page = 0;
  selectedYear: number = 0;
  @Output() yearChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() authors: EventEmitter<Authors[]> = new EventEmitter<Authors[]>();
  @Input() yearSelectionItemData!: Acquisitions[];
  @Input() displayedDecades!: number[];

  constructor(public common: CommonService) {}

  changeYear(event: { selectedIndex: number }) {
    this.selectedYear = event.selectedIndex;
    this.yearChange.emit(this.displayedDecades[this.page + this.selectedYear]);
  }

  getDisplayedItems(): number[] {
    return this.displayedDecades.slice(
      this.currentStartIndex,
      this.currentStartIndex + this.itemsPerPage,
    );
  }

  getLastYears(year: number): number[] {
    const startYear = Math.max(year - this.yearRange, this.lowerLimitYear);
    const lastYears: number[] = [];
    for (let i = year; i >= startYear; i--) {
      lastYears.push(i);
    }
    return lastYears;
  }

  showPreviousYears() {
    this.page = this.page - this.yearRange;
    this.yearChange.emit(this.displayedDecades[this.page + this.selectedYear]);
    this.currentStartIndex -= this.itemsPerPage;
    this.updateDisplayedYears();
  }

  showNextYears() {
    this.page = this.page + this.yearRange;
    this.yearChange.emit(this.displayedDecades[this.page + this.selectedYear]);
    this.currentStartIndex += this.itemsPerPage;
    this.updateDisplayedYears();
  }

  updateDisplayedYears() {
    this.displayedYears = this.getLastYears(this.currentYear);
  }

  yearSelectionChanges(year: number) {
    this.yearChange.emit(year);
  }
}
