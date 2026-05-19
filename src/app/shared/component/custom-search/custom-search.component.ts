import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
@Component({
  selector: 'app-custom-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './custom-search.component.html',
  styleUrl: './custom-search.component.scss',
})
export class CustomSearchComponent implements OnInit, OnChanges {
  @Input() showRecords?: boolean = true;
  @Input() placeHolder: string = 'SEARCH_INPUT';
  @Input() totalCountData: string = '';
  @Input() totalCount: number = 0;
  @Input() initialSearch?: string;
  @Input() isReadOnly: boolean = false;

  @Output() searchResults: EventEmitter<string> = new EventEmitter<string>();
  searchInput = new FormControl();
  icons = ESvgIcon;

  constructor() {
    this.searchInput.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.searchResults.emit(this.searchInput.value);
      });
  }
  searchinput(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.search();
    }
  }

  ngOnInit(): void {
    if (this.initialSearch) {
      this.searchInput.patchValue(this.initialSearch);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['initialSearch']) {
      this.searchInput.patchValue(changes['initialSearch'].currentValue ?? '');
    }
  }

  search() {
    this.searchResults.emit(this.searchInput.value);
  }
}
