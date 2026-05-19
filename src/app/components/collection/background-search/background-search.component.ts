import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
import {
  Collection,
  ICollectionPayload,
} from '../../../shared/interfaces/collection';
import { Image } from '../../../shared/interfaces/image';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-background-search',
  standalone: true,
  imports: [
    TranslateModule,
    CustomSearchComponent,
    OrderSelectionComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    CommonModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
  ],
  templateUrl: './background-search.component.html',
  styleUrl: './background-search.component.scss',
})
export class BackgroundSearchComponent implements OnInit, OnDestroy {
  sortBy: string = '';
  view = constants.VIEWS.GRID;
  isLoading: boolean = true;
  private unsubscribe$ = new Subject<void>();
  imageList: Image[] = [];
  totalCount: number = 0;
  searchResult: string = '';
  localPayload: ICollectionPayload = {
    collectionActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  constructor(
    private apiService: ApiService,
    private router: Router,
    public common: CommonService,
    private dataStore: DataStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.dataStore.artWorkFundPageData.fundsDetailView =
      this.common.constantsData.VIEWS.GRID;
    this.dataStore.artWorkFundPageData.detailPageSearchTerm = '';
    this.common
      .isComingFromDetailsPage(this.router.url)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: boolean) => {
        if (!res) {
          this.dataStore.artWorkFundPageData.collectionData =
            this.dataStore.artWorkFundPageData.collectionData.sort(
              () => Math.random() - 0.5,
            );
          this.scrollTop();
        } else {
          const targetId = this.dataStore.artWorkFundPageData.fundsScrollId;
          this.common.scrollToElementById(targetId);
          this.dataStore.artWorkFundPageData.fundsScrollId = '';
        }
      });

    if (this.dataStore.artWorkFundPageData) {
      if (this.dataStore.artWorkFundPageData.searchData) {
        this.searchResult = this.dataStore.artWorkFundPageData.searchData;
      }

      if (this.dataStore.artWorkFundPageData.sortingOrder) {
        this.sortBy = this.dataStore.artWorkFundPageData.sortingOrder;
        this.sortItems(this.sortBy);
      }

      if (
        this.dataStore.artWorkFundPageData.activePage &&
        this.dataStore.artWorkFundPageData.activePage > 1
      ) {
        this.localPayload.collectionActivePage =
          this.dataStore.artWorkFundPageData.activePage;
      }

      if (this.dataStore.artWorkFundPageData.fundsView) {
        this.view = this.dataStore.artWorkFundPageData.fundsView;
        if (this.view === this.common.constantsData.VIEWS.LIST) {
          const targetId = this.dataStore.artWorkFundPageData.fundsScrollId;
          this.common.scrollToElementById(targetId);
          this.dataStore.artWorkFundPageData.fundsScrollId = '';
        }
      }
    }

    this.onReloadPage();
  }

  private onReloadPage() {
    if (
      this.dataStore.artWorkFundPageData.collectionData &&
      this.dataStore.artWorkFundPageData.collectionData.length > 0
    ) {
      this.imageList = [];
      setTimeout(() => {
        this.isLoading = false;
        this.checkFilterData();
      }, 200);
    } else {
      this.getAllCollections();
    }
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.artWorkFundPageData.fundsView = this.view;
  }

  handleSearch(searchTerm: string) {
    if (searchTerm.trim() !== this.dataStore.artWorkFundPageData.searchData) {
      this.imageList = [];
      this.searchResult = searchTerm;
      this.dataStore.artWorkFundPageData.searchData = searchTerm.trim();
      this.localPayload.collectionActivePage = 1;
      this.checkFilterData();
    }
  }

  changeOrder(value: string) {
    this.sortBy = value;
    this.dataStore.artWorkFundPageData.sortingOrder = value;
    this.sortItems(this.sortBy);
  }

  sortItems(value: string) {
    if (value === constants.SORT_BY.ASC) {
      this.dataStore.artWorkFundPageData.collectionData.sort((a, b) =>
        (a.collections_languages[0]?.title_short || '')
          .trim()
          .toLowerCase()
          .localeCompare(
            (b.collections_languages[0]?.title_short || '')
              .trim()
              .toLowerCase(),
          ),
      );
    } else if (value === constants.SORT_BY.DESC) {
      this.dataStore.artWorkFundPageData.collectionData.sort((a, b) =>
        (b.collections_languages[0]?.title_short || '')
          .trim()
          .toLowerCase()
          .localeCompare(
            (a.collections_languages[0]?.title_short || '')
              .trim()
              .toLowerCase(),
          ),
      );
    } else {
      this.dataStore.artWorkFundPageData.collectionData.sort(
        () => Math.random() - 0.5,
      );
    }
    this.checkFilterData();
  }

  redirectToDetailPage(item: string) {
    this.dataStore.artWorkFundPageData.fundsScrollId = item;
    this.router.navigate([
      `${this.common.getRoute('BACKGROUND_SEARCHER')}/${item}`,
    ]);
  }

  showMore() {
    this.localPayload.collectionActivePage++;
    this.dataStore.artWorkFundPageData.activePage =
      this.localPayload.collectionActivePage;
    this.checkFilterData();
  }

  getAllCollections() {
    this.isLoading = true;
    const collectionPayload = {
      search: '',
    };
    this.apiService
      .post(`${environment.GET_ALL_COLLECTION}`, collectionPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.dataStore.artWorkFundPageData.collectionData = [
              ...response.data.collections.sort(() => Math.random() - 0.5),
            ];
            this.checkFilterData();
            this.isLoading = false;
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
    const filteredCollectionData = this.returnFilterData();
    const splitCollectionData = filteredCollectionData.slice(
      0,
      this.localPayload.collectionActivePage * this.localPayload.pageSize,
    );
    this.imageList = [];
    splitCollectionData.forEach((element: Collection) => {
      this.imageList.push({
        id: element.id,
        slug: element.slug,
        title: element.collections_languages[0]?.title_short,
        description: '',
        image: element.collections_images[0]?.url,
        date: '',
      });
    });
    this.totalCount = filteredCollectionData.length;
  }

  returnFilterData() {
    return this.dataStore.artWorkFundPageData.collectionData.filter(
      (data: Collection) => {
        // Search filter
        const isSearchMatched =
          this.searchResult && this.searchResult.length > 0
            ? (() => {
                if (
                  data.collections_languages &&
                  data.collections_languages.length > 0
                ) {
                  const sortTitle = data.collections_languages[0].title_short
                    ? this.common.normalizeName(
                        data?.collections_languages[0]?.title_short,
                      )
                    : '';
                  const longTitle = data.collections_languages[0].title_long
                    ? this.common.normalizeName(
                        data?.collections_languages[0]?.title_long,
                      )
                    : '';

                  return (
                    sortTitle
                      ?.toLowerCase()
                      .includes(
                        this.common
                          .normalizeName(this.searchResult.trim())
                          .toLowerCase(),
                      ) ||
                    longTitle
                      ?.toLowerCase()
                      .includes(
                        this.common
                          .normalizeName(this.searchResult.trim())
                          .toLowerCase(),
                      )
                  );
                }
                return false;
              })()
            : true;

        return isSearchMatched;
      },
    );
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
    this.common.previousPageUrl.next('');
  }
}
