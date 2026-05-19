import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { DateRange, MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { LocalStorageService } from '../../../core/service/local-storage/local-storage.service';
import { CustomFilterComponent } from '../../../shared/component/custom-filter/custom-filter.component';
import { CustomDateAdapter } from '../../../shared/date-adapter/custom-date-adapter';
import { ExpandableCursorDirective } from '../../../shared/directives/cursor-directive/expandable-cursor-directive';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import {
  Activity,
  ILanguageImages
} from '../../../shared/interfaces/activity';
import { LANG_ARRAY } from '../../../shared/interfaces/common';
import { constants } from './../../../core/enums/constants';
import { SanitizeHtmlPipe } from './../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

export const APP_DATE_FORMATS = {
  display: {
    dateInput: 'inputFormat',
    monthYearLabel: 'calendarHeader',
  },
};
@Component({
  selector: 'app-calendar-search-agenda',
  standalone: true,
  imports: [
    TranslateModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    ImageErrorDirective,
    MatFormFieldModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomFilterComponent,
    MatProgressSpinnerModule,
    SanitizeHtmlPipe,
    ExpandableCursorDirective
  ],
  templateUrl: './calendar-search-agenda.component.html',
  styleUrl: './calendar-search-agenda.component.scss',
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe,
  ],
})
export class CalendarSearchAgendaComponent implements OnInit, OnDestroy {
  icons = ESvgIcon;
  panelOpenState = false;
  activityList: Activity[] = [];
  dateForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();
  selectedDateRange!: DateRange<Date>;
  isLoading = false;
  payload: {
    from_date: string;
    to_date: string;
    initial_date: string;

  } = {
    from_date: '',
    to_date: '',
    initial_date: '',
  };
  types: { id: number; name: string; count: number }[] = [];
  selectedType: { id: number; name: string }[] = [];
  segment: { id: number; name: string; count: number }[] = [];
  selectedSegement: { id: number; name: string }[] = [];
  typesTotalCount: number = 0;
  segmentTotalCount: number = 0;
  dropDownLoader: boolean = false;
  activityTotalCount: number = 0;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  activeTabIndex: number = 0;
  range!: FormGroup;
  localPayload: { agendaActivePage: number; pageSize: number } = {
    agendaActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  startDate!: Date;
  @ViewChild('scrollContainerRef', { static: false })
  scrollContainerRef!: ElementRef;
  @ViewChild('tabScrollContainer', { static: false })
  tabScrollContainer!: ElementRef;
  @ViewChild('scrollRefTab1', { static: false }) scrollRefTab1!: ElementRef;
  @ViewChild('calendar') calendar!: MatCalendar<Date>;
  @ViewChildren('textElement') textElements!: QueryList<HTMLElement>;
  expandedIds = new Set<number>();
  expandableIds = new Set<number>();
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public common: CommonService,
    private dateAdapter: DateAdapter<Date>,
    private dataStore: DataStoreService,
    private localStorage: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {}


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupNavigationBtn()
    } ,100)
  }

  setupNavigationBtn(){
    if (isPlatformBrowser(this.platformId)) {
      this.startDate = this.dataStore.calendarSearchPageData.currentMonth;
      setTimeout(() => {
        const calendarElement = document.querySelector('mat-calendar');
        if (calendarElement) {
          const prevButton = calendarElement.querySelector(
            '.mat-calendar-previous-button',
          );
          if (prevButton) {
            prevButton.addEventListener(
              'click',
              this.handlePreviousAndNextMonth.bind(this),
            );
          }

          const nextButton = calendarElement.querySelector(
            '.mat-calendar-next-button',
          );
          if (nextButton) {
            nextButton.addEventListener(
              'click',
              this.handlePreviousAndNextMonth.bind(this),
            );
          }
        }
        this.intializeCalenderData();
      }, 300);
    }
  }

  intializeCalenderData() {
    this.activityList = [];
    if (this.calendar && this.calendar?.activeDate) {
      this.dataStore.calendarSearchPageData.currentMonth = this.calendar?.activeDate;
    }
    const year = this.dataStore.calendarSearchPageData.currentMonth?.getFullYear();
    const month = this.dataStore.calendarSearchPageData.currentMonth?.getMonth();
    const fromDate = this.dataStore.calendarSearchPageData.selectedFromDate;
    const toDate = this.dataStore.calendarSearchPageData.selectedToDate;
    if (fromDate && fromDate !== '' && toDate && toDate !== '') {
      this.payload.from_date = fromDate;
      this.payload.to_date = toDate;
      this.checkFilterData();
    } else {
      const firstDayUTC = new Date(Date.UTC(year, month, 1));
      const lastDayUTC = new Date(Date.UTC(year, month + 1, 0));
      this.payload.from_date = this.datePipe.transform(firstDayUTC, 'yyyy-MM-dd') || '';
      this.payload.to_date = this.datePipe.transform(lastDayUTC, 'yyyy-MM-dd') || '';
      this.checkFilterData();
    }
  }

  handlePreviousAndNextMonth() {
    this.activityList = [];
    this.selectedDateRange = new DateRange<Date>(null, null);
    if (this.calendar && this.calendar?.activeDate) {
      this.dataStore.calendarSearchPageData.currentMonth = this.calendar?.activeDate;
    }
    const year = this.dataStore.calendarSearchPageData.currentMonth?.getFullYear();
    const month = this.dataStore.calendarSearchPageData.currentMonth?.getMonth();
    const firstDayUTC = new Date(Date.UTC(year, month, 1));
    const lastDayUTC = new Date(Date.UTC(year, month + 1, 0));
    this.payload.from_date = this.datePipe.transform(firstDayUTC, 'yyyy-MM-dd') || '';
    this.payload.to_date = this.datePipe.transform(lastDayUTC, 'yyyy-MM-dd') || '';
    this.checkFilterData();
  }

  ngOnInit() {
    this.common.scrollTop()
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    this.dateForm = this.fb.group(
      {
        from_date: ['', Validators.required],
        to_date: [''],
      },
      { validators: this.dateRangeValidator },
    );

    if (this.dataStore.calendarSearchPageData) {
      if (
        this.dataStore.calendarSearchPageData.selectedType &&
        this.dataStore.calendarSearchPageData.selectedType.length > 0
      ) {
        this.selectedType = this.dataStore.calendarSearchPageData.selectedType;
      }

      if (
        this.dataStore.calendarSearchPageData.selectedSegement &&
        this.dataStore.calendarSearchPageData.selectedSegement.length > 0
      ) {
        this.selectedSegement =
          this.dataStore.calendarSearchPageData.selectedSegement;
      }
        if (
          this.dataStore.calendarSearchPageData.pastActivityScrollId &&
          this.dataStore.calendarSearchPageData.pastActivityScrollId.length > 0
        ) {
          this.scrollToTab();
          const targetId =
            this.dataStore.calendarSearchPageData.pastActivityScrollId;
          this.scrollToPastActivity(targetId);
          this.dataStore.calendarSearchPageData.pastActivityScrollId = '';
        }
      if (
        this.dataStore.calendarSearchPageData.onGoingActivityScrollId &&
        this.dataStore.calendarSearchPageData.onGoingActivityScrollId.length > 0
      ) {
        this.scrollToTab();
        const targetId =
          this.dataStore.calendarSearchPageData.onGoingActivityScrollId;
        this.scrollToOnGoingActivity(targetId);
        this.dataStore.calendarSearchPageData.onGoingActivityScrollId = '';
      }

      if (this.dataStore.calendarSearchPageData.selectedFromDate) {
        this.payload.from_date = this.dataStore.calendarSearchPageData.selectedFromDate;
        this.dateForm.get('from_date')?.patchValue(new Date(this.payload.from_date));
      }

      if (this.dataStore.calendarSearchPageData.selectedToDate) {
        this.payload.to_date =
        this.dataStore.calendarSearchPageData.selectedToDate;
        this.dateForm
          .get('to_date')
          ?.patchValue(new Date(this.payload.to_date));
      }

      if (this.dataStore.calendarSearchPageData.activePage) {
        this.localPayload.agendaActivePage =
          this.dataStore.calendarSearchPageData.activePage;
      }

      if (
        this.dataStore.calendarSearchPageData.selectedFromDate &&
        this.dataStore.calendarSearchPageData.selectedToDate
      ) {
        this.updateselectedDateRange(
          new Date(this.dataStore.calendarSearchPageData.selectedFromDate),
          new Date(this.dataStore.calendarSearchPageData.selectedToDate),
        );
      }
    }

    this.onReloadPage();
  }

  initializeData() {
    this.payload = {
      from_date: '',
      to_date: '',
      initial_date: '',
    };
    this.activityList = [];
    this.selectedType = [];
    this.segment = [];
    this.selectedSegement = [];
    this.types = [];
  }

  private onReloadPage() {
    const currentLang = this.localStorage.getItem('language');
    const langArr = JSON.parse(this.localStorage.getItem('langArr') as string);
    if (langArr && langArr.length > 0) {
      langArr.forEach((element: LANG_ARRAY) => {
        if (element.id_language == currentLang) {
          this.dateAdapter.setLocale(element.alias.toLowerCase());
        }
      });
    }

    this.range = this.fb.group({
      start: [''],
      end: [''],
    });

    if (
      this.dataStore.calendarSearchPageData.allActivityData &&
      this.dataStore.calendarSearchPageData.allActivityData.length > 0
    ) {
      this.activityList = [];
      this.checkFilterData();
    } else {
      this.getActivities();
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.payload.from_date = '';
    this.payload.to_date = '';
    this.dateForm.reset();
    this.selectedDateRange = new DateRange(new Date(), new Date());
    this.activityList = [];
    this.initializeData();
    this.segment = [];
    this.types = [];
    this.localPayload.agendaActivePage = 1;
    this.checkFilterData();
  }

  receiveDataFromChild(data: {
    selectedValues: { id: number; name: string }[];
    type: string;
  }) {
    switch (data.type) {
      case this.common.constantsData.CALENDAR_FILTER_TYPE.TYPE:
        this.selectedType = data.selectedValues;
        this.dataStore.calendarSearchPageData.selectedType =
          data.selectedValues;
        break;
      case this.common.constantsData.CALENDAR_FILTER_TYPE.SEGMENT:
        this.selectedSegement = data.selectedValues;
        this.dataStore.calendarSearchPageData.selectedSegement =
          data.selectedValues;
        break;
      default:
        break;
    }
    this.activityList = [];
    this.localPayload.agendaActivePage = 1;
    this.checkFilterData();
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup.get('from_date')?.value;
    const toDate = formGroup.get('to_date')?.value;
    if (fromDate && toDate && fromDate > toDate) {
      return { dateRangeError: true };
    }
    return null;
  }

  scrollToTab() {
    setTimeout(() => {
      this.tabScrollContainer?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  scrollToPastActivity(targetId: string): void {
    if(isPlatformBrowser(this.platformId)){
      setTimeout(() => {
        const container = this.scrollContainerRef.nativeElement;
        const targetElement = document.getElementById(targetId);

        if (container && targetElement) {
          const containerTop = container.getBoundingClientRect().top;
          const elementTop = targetElement.getBoundingClientRect().top;
          const scrollOffset = elementTop - containerTop + container.scrollTop;

          container.scrollTo({
            top: scrollOffset,
            behavior: 'smooth',
          });
        }
      }, 1000);
    }
  }

  scrollToOnGoingActivity(targetId: string): void {
  if(isPlatformBrowser(this.platformId)){
      setTimeout(() => {
        const container = this.scrollRefTab1.nativeElement;
        const targetElement = document.getElementById(targetId);

        if (container && targetElement) {
          const containerTop = container.getBoundingClientRect().top;
          const elementTop = targetElement.getBoundingClientRect().top;
          const scrollOffset = elementTop - containerTop + container.scrollTop;

          container.scrollTo({
            top: scrollOffset,
            behavior: 'smooth',
          });
          }
      }, 1000);
    }
  }


  onSubmit() {
    const hasFromDate = this.dateForm.value.from_date || this.payload.from_date;
    const hasToDate = this.dateForm.value.to_date;
    if (hasFromDate) {
      if (this.dateForm.value.from_date) {
        const utcDate_from = new Date(
          Date.UTC(
            this.dateForm.value.from_date.getFullYear(),
            this.dateForm.value.from_date.getMonth(),
            this.dateForm.value.from_date.getDate(),
          ),
        );
        this.payload.from_date = this.datePipe.transform(utcDate_from, 'yyyy-MM-dd') || '';
      }
      if (hasToDate) {
        const utcDate_to_date = new Date(
          Date.UTC(
            this.dateForm.value.to_date.getFullYear(),
            this.dateForm.value.to_date.getMonth(),
            this.dateForm.value.to_date.getDate(),
          ),
        );
        this.payload.to_date = this.datePipe.transform(utcDate_to_date, 'yyyy-MM-dd') || '';
      }
      this.updateselectedDateRange(
        this.dateForm.value.from_date || new Date(this.payload.from_date),
        hasToDate ? this.dateForm.value.to_date : null,
      );

      this.dataStore.calendarSearchPageData.selectedFromDate = this.payload.from_date;
      this.dataStore.calendarSearchPageData.selectedToDate = this.payload.to_date;

      this.activityList = [];
      this.localPayload.agendaActivePage = 1;
      this.checkFilterData();
    } else {
      this.payload.from_date = '';
      this.payload.to_date = '';
      this.dataStore.calendarSearchPageData.selectedFromDate = '';
      this.dataStore.calendarSearchPageData.selectedToDate = '';
      this.localPayload.agendaActivePage = 1;
      this.checkFilterData();
    }
  }

  updateselectedDateRange(fromDate: Date, toDate: Date): void {
    this.selectedDateRange = new DateRange(fromDate, toDate);
    this.startDate = new Date(fromDate);
  }

  getPath(event: Activity) {
    if (
      event.activities_type.activities_types_languages[0].id_activity_type ==
      this.common.constantsData.EXPOSISION_ARTICLE
    ) {
      this.dataStore.calendarSearchPageData.onGoingActivityScrollId =
        event.slug;
      this.router.navigate([
        `/${this.common.getRoute('CALENDAR_SEARCH_ENGINE')}/${event.slug}`,
      ]);
    }
  }

  getPathPastActivity(event: Activity) {
    if (
      event.activities_type.activities_types_languages[0].id_activity_type ==
      this.common.constantsData.EXPOSISION_ARTICLE
    ) {
      this.dataStore.calendarSearchPageData.pastActivityScrollId = event.slug;
      this.router.navigate([
        `/${this.common.getRoute('CALENDAR_SEARCH_ENGINE')}/${event.slug}`,
      ]);
    }
  }

  async getActivities() {
    this.isLoading = true;

    this.apiService
      .post(`${environment.GET_ALL_ACTIVITY}`, {})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.isLoading = false;

            this.dataStore.calendarSearchPageData.allActivityData = [
              ...response.data,
            ];
            this.checkFilterData();
          } else {
            this.isLoading = false;
            this.common.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  checkFilterData() {
    const filterAllActivityData = this.returnFilterData();
    this.types = [];
    this.segment = [];
    filterAllActivityData.forEach((element: Activity) => {
      this.setFilterData(element);
      element.activities_language_images = this.checkImageData(element);
    });

    this.activityList = filterAllActivityData.slice(
      0,
      this.localPayload.agendaActivePage * this.localPayload.pageSize,
    );

    this.activityTotalCount = filterAllActivityData.length;
  }

  returnFilterData() {
    return this.dataStore.calendarSearchPageData.allActivityData.filter(
      (data: Activity) => {
        const isDateRangeMatch =
          this.payload.from_date && this.payload.to_date
            ? (() => {
                const startDate = new Date(this.payload.from_date).setHours(
                  0,
                  0,
                  0,
                  0,
                );
                const endDate = new Date(this.payload.to_date).setHours(
                  23,
                  59,
                  59,
                  999,
                );
                const initialDate = new Date(data.initial_date).setHours(
                  0,
                  0,
                  0,
                  0,
                );
                const finalDate = new Date(data.final_date).setHours(
                  0,
                  0,
                  0,
                  0,
                );
                return (
                  (initialDate >= startDate && finalDate <= endDate) ||
                  (initialDate <= startDate && finalDate >= endDate) ||
                  (initialDate >= startDate && initialDate <= endDate) ||
                  (finalDate >= startDate && finalDate <= endDate)
                );
              })()
            : true;

        const isTypeMatch =
          this.selectedType.length > 0
            ? data.id_type &&
              data.activities_type &&
              this.selectedType.some(
                (type: { id: number }) => type.id === data.id_type,
              )
            : true;
        const isSegmentMatch =
          this.selectedSegement.length > 0
            ? data.id_segment &&
              data.activities_segment &&
              this.selectedSegement.some(
                (segment: { id: number }) => segment.id === data.id_segment,
              )
            : true;

        return (
          isDateRangeMatch && isTypeMatch && isSegmentMatch
        );
      },
    );
  }

  onSelectedChange(date: Date): void {
      this.reversibleAssignment(date);
  }

  reversibleAssignment(date: Date) {
    if (!this.selectedDateRange) {
      this.selectedDateRange = new DateRange(date, null);
      this.updateFormAndSubmit();
      return;
    }
    const { start, end } = this.selectedDateRange;
    if (start && end) {
      this.selectedDateRange = new DateRange(date, null);
    }
    else if (start && !end) {
      if (date >= start) {
        this.selectedDateRange = new DateRange(start, date);
      } else {
        this.selectedDateRange = new DateRange(date, start);
      }
    }
    else {
      this.selectedDateRange = new DateRange(date, null);
    }
    this.updateFormAndSubmit();
  }

  updateFormAndSubmit() {
    this.dateForm.reset();
    if (this.selectedDateRange?.start && this.selectedDateRange?.end) {
      this.dateForm.controls['from_date'].patchValue(this.selectedDateRange.start);
      this.dateForm.controls['to_date'].patchValue(this.selectedDateRange.end);
      this.payload.from_date = this.datePipe.transform(this.selectedDateRange.start, 'yyyy-MM-dd') || '';
      this.payload.to_date = this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') || '';
    } else if (this.selectedDateRange?.start) {
      this.dateForm.controls['from_date'].patchValue(this.selectedDateRange.start);
      this.payload.from_date = this.datePipe.transform(this.selectedDateRange.start, 'yyyy-MM-dd') || '';
    } else {
      this.payload.from_date = '';
      this.payload.to_date = '';
    }
    this.onSubmit();
  }

  setFilterData(element: Activity) {
    if (
      element.id_type &&
      element.activities_type &&
      element.activities_type.activities_types_languages &&
      element.activities_type.activities_types_languages.length > 0 &&
      element.activities_type.activities_types_languages[0].name
    ) {
      const typeIndex = this.types.findIndex(
        (f: { id: number }) => f.id == element.id_type,
      );
      if (typeIndex >= 0) {
        this.types[typeIndex].count++;
      } else {
        this.types.push({
          id: element.activities_type.id,
          name: element.activities_type.activities_types_languages[0].name,
          count: 1,
        });
        this.types = this.common.sorAsendingFilterData(this.types);
      }
    }
    if (
      element.activities_segment &&
      element.activities_segment.activities_segments_languages &&
      element.activities_segment.activities_segments_languages.length >
        0 &&
      element.activities_segment.activities_segments_languages[0].name
    ) {
      const segmentIndex = this.segment.findIndex(
        (f: { id: number }) => f.id == element.activities_segment.id,
      );
      if (segmentIndex >= 0) {
        this.segment[segmentIndex].count++;
      } else {
        this.segment.push({
          id: element.activities_segment.id,
          name: element.activities_segment
            .activities_segments_languages[0].name,
          count: 1,
        });
        this.segment = this.common.sorAsendingFilterData(this.segment);
      }
    }
  }

  checkImageData(element: Activity) {
    const filteredImages: ILanguageImages[] = [];
    if (element.activities_images && element.activities_images.length > 0) {
      const imagesWithLanguages = element.activities_images?.some(
        (img: ILanguageImages) =>
          img.activities_images_languages &&
          img.activities_images_languages.length > 0,
      );
      if (imagesWithLanguages) {
        const filteredElement = element?.activities_images?.filter(
          (img: ILanguageImages) =>
            img.activities_images_languages?.some(
              (lang) => lang.id_language === this.common.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredImages.push(filteredElement[0]);
        }
      } else {
        filteredImages.push(element.activities_images[0]);
      }
    }
    return filteredImages;
  }



  showMoreActivity() {
    this.localPayload.agendaActivePage++;
    this.dataStore.calendarSearchPageData.activePage =
      this.localPayload.agendaActivePage;
    this.checkFilterData();
  }

  resetFilters(){
    this.startDate = new Date()
    this.selectedDateRange = new DateRange<Date>(null, null);
    if(this.calendar && this.calendar?.activeDate){
      this.dataStore.calendarSearchPageData.currentMonth = this.calendar?.activeDate;
    }
    const year = this.dataStore.calendarSearchPageData.currentMonth?.getFullYear();
    const month = this.dataStore.calendarSearchPageData.currentMonth?.getMonth();
    const firstDayUTC = new Date(Date.UTC(year, month, 1));
    const lastDayUTC = new Date(Date.UTC(year, month + 1, 0));
    this.payload.from_date = this.datePipe.transform(firstDayUTC, 'yyyy-MM-dd') || '';
    this.payload.to_date = this.datePipe.transform(lastDayUTC, 'yyyy-MM-dd') || '';
    this.dataStore.calendarSearchPageData.selectedFromDate = ''
    this.dataStore.calendarSearchPageData.selectedToDate = ''
    this.checkFilterData();
  }

   toggleExpand(id: number): void {
      if (this.expandedIds.has(id)) {
        this.expandedIds.delete(id);
      } else {
        this.expandedIds.add(id);
      }
    }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
  }
}
