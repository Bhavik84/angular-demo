import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import {
  Glossary,
  GlossaryDetailListRes,
  IDecadeList,
  IGlossary,
  IGlossaryList,
  IWorkTechniques,
} from '../../../shared/interfaces/glossary';
import { IWorkImage } from '../../../shared/interfaces/image';

@Component({
  selector: 'app-glossari',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCheckboxModule,
    TranslateModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CustomMasonryLayoutComponent,
  ],
  templateUrl: './glossari.component.html',
  styleUrl: './glossari.component.scss',
})
export class GlossariComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  glossaryList: IGlossaryList[] = [];
  totalCount: number = 0;
  isLoading: boolean = true;
  selectedDecade: number = 0;
  workList: IWorkImage[] = [];
  selectedGlossaryDetail: IGlossaryList = {
    description: '',
    id_technique: 0,
    isEnable: false,
    name: '',
  };

  decadeData: any[] = [];
  selectedTechniqueId: number = 0;
  glossaryPayload: { glosaaryActivePage: number; pageSize: number } = {
    glosaaryActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };

  selectedDecadeIndex = -1;
  @ViewChild('sliderContainer', { static: false }) sliderContainer!: ElementRef;
  showPrev: boolean = false;
  showNext: boolean = false;
  touchStartX: number = 0;
  touchEndX: number = 0;
  scrollStep: number = 200; // Adjust swipe sensitivity
  showTechniqueDescEllipsis: boolean = true;
  isDecadeSearch: boolean = false;
  constructor(
    private apiService: ApiService,
    public commonService: CommonService,
    private router: Router,
    private dataStore: DataStoreService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (this.dataStore.glossaryPageData) {
      this.isDecadeSearch = this.dataStore.glossaryPageData.isDecadeSearch;
      if (this.dataStore.glossaryPageData.selectedGlossary) {
        this.selectedDecade = this.dataStore.glossaryPageData.selectedGlossary;
        this.selectedDecadeIndex =
          this.dataStore.glossaryPageData.decadesData.findIndex(
            (f: { value: number }) => f.value == this.selectedDecade,
          );
      }
      if (this.dataStore.glossaryPageData.selectedTechnique) {
        this.selectedTechniqueId =
          this.dataStore.glossaryPageData.selectedTechnique;
        this.selectedGlossaryDetail =
          this.dataStore.glossaryPageData.techniquesData.find(
            (f: { id_technique: number }) =>
              f.id_technique == this.selectedTechniqueId,
          );
      }
      const targetId = this.dataStore.glossaryPageData.glossaryPageScrollId;
      this.commonService.scrollToElementById(targetId);
      this.dataStore.glossaryPageData.glossaryPageScrollId = '';

      if (
        this.dataStore.glossaryPageData.activePage &&
        this.dataStore.glossaryPageData.activePage > 1
      ) {
        this.glossaryPayload.glosaaryActivePage =
          this.dataStore.glossaryPageData.activePage;
      }
    }
    this.initializeData();
  }

  private initializeData() {
    if (
      this.dataStore.glossaryPageData.decadesData &&
      this.dataStore.glossaryPageData.decadesData.length > 0
    ) {
      this.decadeData = [...this.dataStore.glossaryPageData.decadesData];
    } else {
      this.getDecadeData();
    }

    if (
      this.dataStore.glossaryPageData.worksData &&
      this.dataStore.glossaryPageData.worksData.length > 0
    ) {
      this.glossaryList = [...this.dataStore.glossaryPageData.techniquesData];
      this.checkFilter();
    } else {
      this.getAllGlossaryData();
    }
  }

  onSearchTypeToggle() {
    this.selectedDecade = 0;
    this.selectedTechniqueId = 0;
    this.selectedGlossaryDetail = {
      description: '',
      id_technique: 0,
      isEnable: false,
      name: '',
    };
    this.dataStore.glossaryPageData.selectedGlossary = this.selectedDecade;
    this.dataStore.glossaryPageData.selectedTechnique =
      this.selectedTechniqueId;
    this.dataStore.glossaryPageData.isDecadeSearch = this.isDecadeSearch;
    this.selectedDecadeIndex = -1;
    this.isLoading = true;
    this.workList = [];
    this.showTechniqueDescEllipsis = true;
    this.glossaryPayload.glosaaryActivePage = 1;
    this.resetFilterAndDecadeData();
    this.checkFilter(!this.isDecadeSearch, this.isDecadeSearch);
  }

  resetFilterAndDecadeData() {
    this.glossaryList.forEach((element) => (element.isEnable = true));
    this.decadeData.forEach((element) => (element.isSelect = true));
  }

  toggleDecadeSelection(index: number, isSelectable: boolean, value: number) {
    if (!isSelectable) return;
    if (isSelectable) {
      if (this.isDecadeSearch) {
        this.selectedTechniqueId = 0;
        this.selectedGlossaryDetail = {
          description: '',
          id_technique: 0,
          isEnable: false,
          name: '',
        };
        this.dataStore.glossaryPageData.selectedTechnique =
          this.selectedTechniqueId;
      }
      if (this.selectedDecadeIndex === index) {
        this.selectedDecadeIndex = -1;
        this.selectedDecade = 0;
        this.glossaryPayload.glosaaryActivePage = 1;
        this.workList = [];
        this.isLoading = true;
        this.checkFilter(false, true);
      } else {
        this.selectedDecadeIndex = index;
        this.selectedDecade = value;
        this.workList = [];
        this.glossaryPayload.glosaaryActivePage = 1;
        this.isLoading = true;
        this.checkFilter(false, true);
      }
    }
    this.dataStore.glossaryPageData.selectedGlossary = this.selectedDecade;
  }

  redirectToDetailPage(item: string) {
    this.dataStore.glossaryPageData.glossaryPageScrollId = item;
    this.router.navigate([
      `${this.commonService.getRoute('PHOTO_SEARCHER')}/${item}`,
    ]);
  }

  getAllGlossaryData() {
    this.isLoading = true;
    const bodyData = {
      decade: '',
    };
    this.apiService
      .post(`${environment.GET_ALL_GLOSSARY}`, bodyData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: GlossaryDetailListRes) => {
          this.isLoading = false;
          if (response.data && !response.is_error) {
            this.dataStore.glossaryPageData.worksData = [
              ...response.data.works,
            ];
            this.checkFilter();
            if (response.data.technique) {
              response.data.technique.forEach((element: Glossary) => {
                this.glossaryList.push({
                  id_technique: element.id_technique,
                  name: element.worksTechniquesLanguages.name,
                  description: element.worksTechniquesLanguages.description,
                  isEnable: true,
                });
              });
              this.glossaryList = this.commonService.sorAsendingFilterData(
                this.glossaryList,
              );
              this.dataStore.glossaryPageData.techniquesData = [
                ...this.glossaryList,
              ];
            }
          } else {
            this.commonService.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
          this.workList = [];
        },
      });
  }

  golssarySelectionChange(glossary: IGlossaryList) {
    if (glossary.id_technique !== this.selectedTechniqueId) {
      this.selectedTechniqueId = glossary.id_technique;
      this.selectedGlossaryDetail = glossary;
    } else {
      this.selectedTechniqueId = 0;
      this.selectedGlossaryDetail = {
        description: '',
        id_technique: 0,
        isEnable: false,
        name: '',
      };
    }

    if (!this.isDecadeSearch) {
      this.selectedDecade = 0;
      this.dataStore.glossaryPageData.selectedGlossary = this.selectedDecade;
      this.selectedDecadeIndex = -1;
    }

    this.showTechniqueDescEllipsis = true;
    this.glossaryPayload.glosaaryActivePage = 1;
    this.dataStore.glossaryPageData.selectedTechnique =
      this.selectedTechniqueId;
    this.workList = [];
    this.isLoading = true;
    this.checkFilter(true);
  }

  checkFilter(
    isResetDecade: boolean = false,
    isResetTechnique: boolean = false,
  ) {
    const allFilteredWorksData = this.returnFiltered();
    const showWorksDataList = allFilteredWorksData.slice(
      0,
      this.glossaryPayload.glosaaryActivePage * this.glossaryPayload.pageSize,
    );
    this.workList = [];

    if (isResetDecade && !this.isDecadeSearch) {
      this.decadeData.forEach((element) => (element.isSelect = false));
      allFilteredWorksData.forEach((element: IGlossary) => {
        this.setDecadeDataStatus(element);
      });
    }
    if (isResetTechnique && this.isDecadeSearch) {
      this.glossaryList.forEach((element) => (element.isEnable = false));
      allFilteredWorksData.forEach((element: IGlossary) => {
        this.setTechniqueDataStatus(element);
      });
    }

    showWorksDataList.forEach((element: IGlossary) => {
      this.workList.push({
        id: element.id,
        slug: element.slug,
        image: element?.works_images[0],
        title: element.name,
        author: this.commonService.checkAuthorName(element.author),
        description:
          element?.institution?.id === 5
            ? this.translate.instant(
                'PHOTO_SEARCH_ENGINE.OTHER_INSTITUTION_LABEL',
              )
            : element.institution?.name,
        date: this.commonService.checkWorkDate(element.date),
      });
    });
    this.totalCount = allFilteredWorksData.length;
    this.isLoading = false;
  }

  returnFiltered() {
    return this.dataStore.glossaryPageData.worksData.filter(
      (data: IGlossary) => {
        const isTechniqueMatch = this.selectedTechniqueId
          ? data.works_techniques &&
            data.works_techniques.length > 0 &&
            data.works_techniques.some(
              (technique: IWorkTechniques) =>
                technique.id_technique === this.selectedTechniqueId,
            )
          : true;

        const isDecadeMatch = this.selectedDecade
          ? data.decades &&
            (data.decades == this.selectedDecade.toString() ||
              this.isWithinDecadeRange(data.decades, this.selectedDecade))
          : true;

        return isTechniqueMatch && isDecadeMatch;
      },
    );
  }

  private isWithinDecadeRange(decades: string, year: number): boolean {
    if (decades.includes('-')) {
      const [start, end] = decades.split('-').map(Number);
      return year >= start && year <= end;
    }
    return decades == year.toString(); // Direct match for cases like "2010"
  }

  getDecadeData() {
    this.apiService
      .get(`${environment.GET_ALL_GLOSSARY_DECADE}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: IDecadeList) => {
          if (response.data && !response.is_error) {
            this.decadeData = [];
            response.data.decades.forEach(
              (element: { decade: string; decade_to_show: string }) => {
                this.decadeData.push({ value: element.decade, isSelect: true });
                this.decadeData.sort(
                  (a, b) => parseInt(a.value) - parseInt(b.value),
                );
              },
            );
            this.dataStore.glossaryPageData.decadesData = [...this.decadeData];
            setTimeout(() => this.checkOverflow(), 300);
          }
        },
      });
  }

  setDecadeDataStatus(element: IGlossary) {
    if (!element.decades) return;
    const selectDecade = (value: string) => {
      const index = this.decadeData.findIndex(
        (f: { value: string }) => f.value === value,
      );
      if (index >= 0) this.decadeData[index].isSelect = true;
    };
    const decades = element.decades.split('-').map((d: string) => d.trim());
    decades.forEach((decade: string) => {
      if (!isNaN(Number(decade))) {
        selectDecade(decade);
      }
    });
  }

  setTechniqueDataStatus(element: IGlossary) {
    if (element.works_techniques && element.works_techniques.length) {
      element.works_techniques.forEach(
        (technique: { id_technique: number }) => {
          const techniqueIndex = this.glossaryList.findIndex(
            (f: { id_technique: number }) =>
              f.id_technique == technique.id_technique,
          );
          if (techniqueIndex >= 0) {
            this.glossaryList[techniqueIndex].isEnable = true;
          }
        },
      );
    }
  }

  showMore() {
    this.glossaryPayload.glosaaryActivePage++;
    this.dataStore.glossaryPageData.activePage =
      this.glossaryPayload.glosaaryActivePage;
    this.checkFilter();
  }

  prevDecadesSlide() {
    const container = this.sliderContainer.nativeElement;
    const scrollAmount = this.scrollStep;

    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.checkOverflow(), 300); // Ensure UI updates after scrolling
  }

  nextDecadeSlide() {
    const container = this.sliderContainer.nativeElement;
    const scrollAmount = this.scrollStep;

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => this.checkOverflow(), 300); // Ensure UI updates after scrolling
  }

  checkOverflow() {
    const container = this.sliderContainer.nativeElement;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showPrev = Math.round(container.scrollLeft) > 2;
    this.showNext =
      Math.round(container.scrollLeft) + 2 < Math.round(maxScrollLeft);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkOverflow();
  }

  // Touch start event
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  // Touch end event
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleDecadeSwipe();
  }

  // Detect swipe direction and prevent overflow swiping
  handleDecadeSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    // Prevent swiping beyond boundaries
    if (diff > 50 && this.showNext) {
      this.nextDecadeSlide(); // Swipe left → Next (only if not at the end)
    } else if (diff < -50 && this.showPrev) {
      this.prevDecadesSlide(); // Swipe right → Prev (only if not at the start)
    }
  }
  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  decadeSelectionChanges(event: number) {
    if (this.isDecadeSearch) {
      this.selectedTechniqueId = 0;
      this.selectedGlossaryDetail = {
        description: '',
        id_technique: 0,
        isEnable: false,
        name: '',
      };
      this.dataStore.glossaryPageData.selectedTechnique =
        this.selectedTechniqueId;
    }
    this.selectedDecade = event;
    this.dataStore.glossaryPageData.selectedGlossary = this.selectedDecade;
    this.glossaryPayload.glosaaryActivePage = 1;
    this.isLoading = true;
    this.checkFilter(false, true);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
  }
}
