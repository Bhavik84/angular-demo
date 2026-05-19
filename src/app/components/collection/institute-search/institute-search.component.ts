import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { OrderSelectionComponent } from '../../../shared/component/order-selection/order-selection.component';
import { Image } from '../../../shared/interfaces/image';
import {
  IInstitutionPayload,
  institute,
} from '../../../shared/interfaces/institute';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-institute-search',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CustomSearchComponent,
    OrderSelectionComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
  ],
  templateUrl: './institute-search.component.html',
  styleUrl: './institute-search.component.scss',
})
export class InstituteSearchComponent implements OnInit, OnDestroy {
  sortBy: string = '';
  searchResult: string = '';
  view = constants.VIEWS.GRID;
  imageList: Image[] = [];
  private unsubscribe$ = new Subject<void>();
  totalCount: number = 0;
  isLoading: boolean = true;
  localPayload: IInstitutionPayload = {
    instituteActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  constructor(
    private apiService: ApiService,
    private router: Router,
    public commonService: CommonService,
    private dataStore: DataStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.dataStore.institutePageData.institutionDetailView =
      this.commonService.constantsData.VIEWS.GRID;
    this.dataStore.institutePageData.institutionDetailSearchTerm = '';
    this.commonService
      .isComingFromDetailsPage(this.router.url)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: boolean) => {
        if (!res) {
          this.dataStore.institutePageData.institutionData =
            this.dataStore.institutePageData.institutionData.sort(
              () => Math.random() - 0.5,
            );
          this.scrollTop();
        } else {
          const targetId =
            this.dataStore.institutePageData.institutionPageScrollId;
          this.commonService.scrollToElementById(targetId);
          this.dataStore.institutePageData.institutionPageScrollId = '';
        }
      });

    if (this.dataStore.institutePageData) {
      if (this.dataStore.institutePageData.searchData) {
        this.searchResult = this.dataStore.institutePageData.searchData;
      }
      if (this.dataStore.institutePageData.sortingOrder) {
        this.sortBy = this.dataStore.institutePageData.sortingOrder;
        this.sortItems(this.sortBy);
      }
      if (
        this.dataStore.institutePageData.activePage &&
        this.dataStore.institutePageData.activePage > 0
      ) {
        this.localPayload.instituteActivePage =
          this.dataStore.institutePageData.activePage;
      }
      if (this.dataStore.institutePageData.institutionPageView) {
        this.view = this.dataStore.institutePageData.institutionPageView;
        if (this.view === this.commonService.constantsData.VIEWS.LIST) {
          const targetId =
            this.dataStore.institutePageData.institutionPageScrollId;
          this.commonService.scrollToElementById(targetId);
          this.dataStore.institutePageData.institutionPageScrollId = '';
        }
      }
    }

    if (
      this.dataStore.institutePageData.institutionData &&
      this.dataStore.institutePageData.institutionData.length > 0
    ) {
      this.imageList = [];
      setTimeout(() => {
        this.isLoading = false;
        this.checkFilterData();
      }, 200);
    } else {
      this.getAllInstitutes();
    }
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.institutePageData.institutionPageView = this.view;
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  getAllInstitutes() {
    this.isLoading = true;
    const institutePayload = {
      search: '',
    };

    this.apiService
      .post(`${environment.GET_ALLINSTITUTE}`, institutePayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.dataStore.institutePageData.institutionData = [
              ...response.data.institutions.sort(() => Math.random() - 0.5),
            ];
            this.checkFilterData();

            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.commonService.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  checkFilterData() {
    const filteredInstitutionData = this.returnFilterData();
    const splitInstituteData = filteredInstitutionData.slice(
      0,
      this.localPayload.instituteActivePage * this.localPayload.pageSize,
    );
    this.imageList = [];
    splitInstituteData.forEach((element: institute) => {
      this.imageList.push({
        id: element.id,
        slug: element.slug,
        title: element.name,
        description: element.description,
        image: element.institutions_images[0]?.url,
        date: '',
      });
    });

    this.totalCount = filteredInstitutionData.length;
  }

  returnFilterData() {
    return this.dataStore.institutePageData.institutionData.filter(
      (data: institute) => {
        // Search filter
        const isSearchMatched =
          this.searchResult && this.searchResult.length > 0
            ? (() => {
                const name: string = data.name
                  ? this.commonService.normalizeName(data.name)
                  : '';

                return name
                  ?.toLowerCase()
                  .includes(
                    this.commonService
                      .normalizeName(this.searchResult.trim())
                      .toLowerCase(),
                  );
              })()
            : true;

        return isSearchMatched;
      },
    );
  }

  searchResultEvent(value: string) {
    if (value.trim() !== this.dataStore.institutePageData.searchData) {
      this.searchResult = value;
      this.imageList = [];
      this.dataStore.institutePageData.searchData = value.trim();
      this.localPayload.instituteActivePage = 1;
      this.checkFilterData();
    }
  }

  changeOrder(value: string) {
    this.sortBy = value;
    this.dataStore.institutePageData.sortingOrder = value;
    this.sortItems(this.sortBy);
  }

  sortItems(value: string) {
    if (value === constants.SORT_BY.ASC) {
      this.dataStore.institutePageData.institutionData.sort((a, b) =>
        (a.name || '')
          .trim()
          .toLowerCase()
          .localeCompare((b.name || '').trim().toLowerCase()),
      );
    } else if (value === constants.SORT_BY.DESC) {
      this.dataStore.institutePageData.institutionData.sort((a, b) =>
        (b.name || '')
          .trim()
          .toLowerCase()
          .localeCompare((a.name || '').trim().toLowerCase()),
      );
    } else {
      this.dataStore.institutePageData.institutionData.sort(
        () => Math.random() - 0.5,
      );
    }
    this.checkFilterData();
  }

  redirectToDetailPage(item: string) {
    this.dataStore.institutePageData.institutionPageScrollId = item;
    this.router.navigate([
      `${this.commonService.getRoute('INSTITUTION_SEARCHER')}/${item}`,
    ]);
  }

  showMore() {
    this.localPayload.instituteActivePage++;
    this.dataStore.institutePageData.activePage =
      this.localPayload.instituteActivePage;
    this.checkFilterData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
    this.commonService.previousPageUrl.next('');
  }
}
