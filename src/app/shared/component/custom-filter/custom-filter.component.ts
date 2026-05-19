import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  DoCheck,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  IterableDiffers,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatNativeDateModule,
  MatOptgroup,
  MatOptionModule,
  MatOptionSelectionChange,
  MatRippleModule,
} from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatSelect,
  MatSelectModule,
  MatSelectTrigger,
} from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { constants } from '../../../core/enums/constants';
import { CommonService } from '../../../core/service/common/common.service';
import { MatSelectScrollBottomDirective } from '../../directives/custome-scroll/scroll-directive.directive';
import { filter } from '../../interfaces/alabern-portal';
import { DropDownFilter } from '../../interfaces/work';
import { SearchFilterDataPipe } from '../../pipes/search-filter-data.pipe';

@Component({
  selector: 'app-custom-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSelectModule,
    MatOptionModule,
    MatOptgroup,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectTrigger,
    TranslateModule,
    MatSelectScrollBottomDirective,
    MatProgressSpinner,
    SearchFilterDataPipe,
  ],
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss'],
})
export class CustomFilterComponent implements OnInit, DoCheck, AfterViewInit {
  @Input() allItems: filter[] = [];
  @Input() isLoading: boolean = false;
  @Input() selectedItems: filter[] = [];
  @Input() type!: string;
  @Input() selectPlaceholder!: string;
  @Input() isLoadOnSearch: boolean = true;
  @Input() isLocalSearch: boolean = false;
  @Output() selectedItemsChange = new EventEmitter<{
    selectedValues: filter[];
    type: string;
  }>();
  limit: number = constants.LIMIT.TEN;
  offset: number = constants.LIMIT.ZERO;
  search: string = '';
  @Output() loadAndSearch = new EventEmitter<{
    limit: number;
    offset: number;
    search: string;
    sortBy: 'ASC';
  }>();

  @ViewChild('search') searchTextBox!: ElementRef<HTMLInputElement>;
  @ViewChild(MatSelect) matSelect!: MatSelect;

  selectFormControl = new FormControl<filter[]>([]);
  searchTextboxControl = new FormControl<string>('');
  selectedValues: filter[] = [];
  filteredOptions!: Observable<filter[]>;
  private destroyRef = inject(DestroyRef);
  private _differ;

  constructor(
    private _differs: IterableDiffers,
    @Inject(PLATFORM_ID) private platformId: object,
    public common: CommonService,
  ) {
    this._differ = this._differs.find([]).create();
    this.searchTextboxControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.limit = constants.LIMIT.TEN;
        this.offset = constants.LIMIT.ZERO;
        this.search = this.searchTextboxControl.value as string;
        this.loadAndSearch.emit({
          limit: this.limit,
          offset: this.offset,
          search: this.searchTextboxControl.value as string,
          sortBy: this.common.constantsData.SORT_BY.ASC,
        });
      });
  }

  ngDoCheck() {
    const changes = this._differ.diff(this.selectedItems);
    if (changes) {
      this.selectedValues = [...this.selectedItems];
      this.selectFormControl.setValue(this.selectedItems);
    }
  }

  ngOnInit() {
    this.filteredOptions = this.searchTextboxControl.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._filter(value ?? '')),
    );
    this.setSelectedValues();
  }

  ngAfterViewInit() {
    this.matSelect.openedChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((opened) => {
        if (opened) {
          const panel = this.matSelect.panel?.nativeElement;
          panel?.addEventListener('scroll', this.onScroll.bind(this));
        }
      });
    }

  private _filter(name: string): filter[] {
    const filterValue = name.toLowerCase();
    return this.allItems.filter((option) =>
      option.name.toLowerCase().includes(filterValue),
    );
  }

  compareFn(t1: DropDownFilter | null, t2: DropDownFilter | null): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (
      element.scrollHeight - element.scrollTop <= element.clientHeight &&
      !this.isLoading
    ) {
      this.offset = this.offset + constants.LIMIT.TEN;
      if (this.isLoadOnSearch) {
        this.loadAndSearch.emit({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          sortBy: this.common.constantsData.SORT_BY.ASC,
        });
      }
    }
  }

  selectionChange(event: MatOptionSelectionChange, option: filter): void {
    if (event.isUserInput) {
      if (event.source.selected) {
        this.selectedValues.push(option);
      } else {
        const index = this.selectedValues.findIndex(
          (item) => item.id === option.id,
        );
        if (index !== -1) {
          this.selectedValues.splice(index, 1);
        }
      }
      this.selectedItemsChange.emit({
        selectedValues: this.selectedValues,
        type: this.type,
      });
    }
  }

  openedChange(e: boolean): void {
    if (e === true) {
      this.searchTextBox.nativeElement.focus();
    }
    if (isPlatformBrowser(this.platformId)) {
      const selectPanelElements = document.getElementsByClassName(
        'my-select-panel-class',
      );
      if (selectPanelElements.length > 0) {
        (selectPanelElements[0] as HTMLElement).parentElement?.classList.add(
          'my-select-panel-class-parent',
        );
      }
    }
  }

  searchInServer() {
    this.limit = constants.LIMIT.TEN;
    this.offset = constants.LIMIT.ZERO;
    this.search = this.searchTextboxControl.value as string;
    this.loadAndSearch.emit({
      limit: this.limit,
      offset: this.offset,
      search: this.search,
      sortBy: this.common.constantsData.SORT_BY.ASC,
    });
  }

  clearSearch(): void {
    this.searchTextboxControl.patchValue('');
  }

  setSelectedValues(): void {
    this.selectedValues = [...this.selectedItems];
  }
  closeButton() {
    if (isPlatformBrowser(this.platformId)) {
      const selectPanelElements = document.getElementsByClassName(
        'my-select-panel-class',
      );
      if (selectPanelElements.length > 0) {
        (selectPanelElements[0] as HTMLElement).parentElement?.classList.remove(
          'my-select-panel-class-parent',
        );
      }
    }
  }

  remove(item: filter): void {
    const index = this.selectedValues.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.selectedValues.splice(index, 1);
      this.selectedItemsChange.emit({
        selectedValues: this.selectedValues,
        type: this.type,
      });
    }
  }
}
