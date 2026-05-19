import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomFilterComponent } from '../../../shared/component/custom-filter/custom-filter.component';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { MatChipComponent } from '../../../shared/component/mat-chip/mat-chip.component';
import { OrderSelectionComponent } from '../../../shared/component/order-selection/order-selection.component';
import { filter } from '../../../shared/interfaces/alabern-portal';
import { Image } from '../../../shared/interfaces/image';
import {
  authorTag,
  IDecades,
  Photographer,
} from '../../../shared/interfaces/photographer';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-photographers',
  standalone: true,
  imports: [
    CustomSearchComponent,
    OrderSelectionComponent,
    MatChipsModule,
    TranslateModule,
    CustomFilterComponent,
    MatChipComponent,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
    MatCheckboxModule,
  ],
  templateUrl: './photographers.component.html',
  styleUrl: './photographers.component.scss',
})
export class PhotographersComponent implements OnInit, OnDestroy {
  decadeList: { id: any; name: string; count: number }[] = [];
  decadeListBackup: { id: any; name: string; count: number }[] = [];
  selectedItem: filter[] = [];
  type1Tags: { id: number; name: string; count: number }[] = [];
  dropDownLoader: boolean = false;
  type1SelectedTags: filter[] = [];
  decadeSelected: filter[] = [];
  searchResult: string = '';
  sortBy: string = '';
  isLoading: boolean = true;
  isLivingAuthor: boolean = false;
  isWomenPhotographer: boolean = false;
  imageList: Image[] = [];
  dialogRef!: MatDialogRef<null>;
  private unsubscribe$ = new Subject<void>();
  view = constants.VIEWS.GRID;
  totalCount = 0;
  isShowViewMore: boolean = false;
  comparisonResult = false;
  localPayload: { authorActivePage: number; pageSize: number } = {
    authorActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router,
    public common: CommonService,
    private dataStore: DataStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.dataStore.photographersPageData.photographerDetailPageView =
      this.common.constantsData.VIEWS.GRID;
    this.dataStore.photographersPageData.searchDataDetails = '';

    this.common
      .isComingFromDetailsPage(this.router.url)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: boolean) => (this.comparisonResult = res));

    if (this.comparisonResult === false) {
      this.dataStore.photographersPageData.authorData =
        this.dataStore.photographersPageData.authorData.sort(
          () => Math.random() - 0.5,
        );
      this.scrollTop();
    }
    this.generateDecades();

    if (this.dataStore.photographersPageData) {
      // Check and assign search data
      if (this.dataStore.photographersPageData.searchData) {
        this.searchResult = this.dataStore.photographersPageData.searchData;
      }
      // Check and assign sorting order
      if (this.dataStore.photographersPageData.sortingOrder) {
        this.sortBy = this.dataStore.photographersPageData.sortingOrder;
        this.sortItems(this.sortBy);
      }

      // Check and assign year filter data
      if (
        this.dataStore.photographersPageData.filter.selectedYears &&
        this.dataStore.photographersPageData.filter.selectedYears.length > 0
      ) {
        this.decadeSelected =
          this.dataStore.photographersPageData.filter.selectedYears;
      }

      if (
        this.dataStore.photographersPageData.filter.type1SelectedTags &&
        this.dataStore.photographersPageData.filter.type1SelectedTags.length > 0
      ) {
        this.type1SelectedTags =
          this.dataStore.photographersPageData.filter.type1SelectedTags;
      }

      if (this.dataStore.photographersPageData.filter.isLivingAuthor) {
        this.isLivingAuthor =
          this.dataStore.photographersPageData.filter.isLivingAuthor;
      }
      if (this.dataStore.photographersPageData.filter.isWomenPhotographer) {
        this.isWomenPhotographer =
          this.dataStore.photographersPageData.filter.isWomenPhotographer;
      }

      if (
        this.dataStore.photographersPageData.offset &&
        this.dataStore.photographersPageData.offset > 1
      ) {
        this.localPayload.authorActivePage =
          this.dataStore.photographersPageData.offset;
      }

      if (this.dataStore.photographersPageData.photographersPageView) {
        this.view = this.dataStore.photographersPageData.photographersPageView;
        if (
          this.view === this.common.constantsData.VIEWS.LIST &&
          this.comparisonResult === true
        ) {
          const targetId =
            this.dataStore.photographersPageData.photographerPageScrollId;
          this.common.scrollToElementById(targetId);
          this.dataStore.photographersPageData.photographerPageScrollId = '';
        }
      }
    }
    this.onReloadPage();
    this.mergeItems();
  }

  private onReloadPage() {
    if (
      this.dataStore.photographersPageData.authorData &&
      this.dataStore.photographersPageData.authorData.length > 0
    ) {
      this.imageList = [];
      setTimeout(() => {
        this.isLoading = false;
        this.checkFilterData();
      }, 200);
    } else {
      this.getAllAuthorsImage();
    }
  }

  handleSearch(searchTerm: string) {
    if (
      searchTerm.trim() !== this.dataStore.photographersPageData.searchData ||
      !this.imageList.length
    ) {
      this.searchResult = searchTerm;
      this.isShowViewMore = false;
      this.imageList = [];
      this.dataStore.photographersPageData.searchData = searchTerm.trim();
      this.localPayload.authorActivePage = 1;
      this.checkFilterData();
    }
  }

  receiveDataFromChild(data: { selectedValues: filter[]; type: string }) {
    switch (data.type) {
      case this.common.constantsData.AUTHOR_FILTER_TYPE.TYPE_1_TAG:
        this.type1SelectedTags = data.selectedValues;
        this.dataStore.photographersPageData.filter.type1SelectedTags =
          data.selectedValues;
        break;
      case this.common.constantsData.AUTHOR_FILTER_TYPE.DECADE:
        this.decadeSelected = data.selectedValues;
        this.dataStore.photographersPageData.filter.selectedYears =
          data.selectedValues;
        break;
      default:
        // Handle unknown type
        break;
    }
    this.isShowViewMore = false;
    this.imageList = [];
    this.mergeItems();
  }

  mergeItems() {
    this.selectedItem = [...this.type1SelectedTags, ...this.decadeSelected];
    this.checkFilterData();
  }

  private generateDecades() {
    this.decadeListBackup = [];
    this.apiService
      .get(`${environment.GET_AUTHOR_DECADES}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (!response.is_error && response.data) {
            response.data.forEach((element: IDecades) => {
              this.decadeListBackup.push({
                id: element.decade,
                name: element.decade,
                count: element.authorCount,
              });
            });
            this.decadeList = [...this.decadeListBackup];
            this.afterLoadeCheckFilter();
          }
        },
      });
  }

  removeItem(event: filter) {
    this.type1SelectedTags = this.type1SelectedTags.filter(
      (item) => item !== event,
    );
    this.decadeSelected = this.decadeSelected.filter((item) => item !== event);
    this.dataStore.photographersPageData.filter.type1SelectedTags =
      this.type1SelectedTags;
    this.dataStore.photographersPageData.filter.selectedYears =
      this.decadeSelected;
    this.isShowViewMore = false;
    this.imageList = [];
    this.localPayload.authorActivePage = 1;
    this.checkFilterData();
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.photographersPageData.photographersPageView = this.view;
    this.isShowViewMore = false;
  }

  openDialog(template: TemplateRef<null>) {
    this.dialogRef = this.dialog.open(template, {
      autoFocus: false,
    });
  }

  changeOrder(value: string) {
    this.sortBy = value;
    this.dataStore.photographersPageData.sortingOrder = value;
    this.sortItems(value);
  }

  sortItems(value: string) {
    if (value === this.common.constantsData.SORT_BY.ASC) {
      this.dataStore.photographersPageData.authorData.sort((a, b) =>
        (a.name || '')
          .trim()
          .toLowerCase()
          .localeCompare((b.name || '').trim().toLowerCase()),
      );
    } else if (value === this.common.constantsData.SORT_BY.DESC) {
      this.dataStore.photographersPageData.authorData.sort((a, b) =>
        (b.name || '')
          .trim()
          .toLowerCase()
          .localeCompare((a.name || '').trim().toLowerCase()),
      );
    } else {
      this.dataStore.photographersPageData.authorData.sort(
        () => Math.random() - 0.5,
      );
    }
    this.checkFilterData();
  }

  updateLivingAuthors(event: boolean) {
    this.imageList = [];
    this.dataStore.photographersPageData.filter.isLivingAuthor = event;
    this.isLivingAuthor = event;
    this.localPayload.authorActivePage = 1;
    this.checkFilterData();
  }

  updateWomenAuthors(event: boolean) {
    this.imageList = [];
    this.dataStore.photographersPageData.filter.isWomenPhotographer = event;
    this.isWomenPhotographer = event;
    this.localPayload.authorActivePage = 1;
    this.checkFilterData();
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  getAllAuthorsImage() {
    this.isLoading = true;
    const payload = {
      search: '',
    };
    this.apiService
      .post(`${environment.GET_ALL_AUTHORS}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data.authors.length === 0) {
            this.isLoading = false;
          }
          if (response.data && !response.is_error) {
            this.dataStore.photographersPageData.authorData = [
              ...response.data.authors.sort(() => Math.random() - 0.5),
            ];
            this.checkFilterData();
            this.isLoading = false;
          } else {
            this.common.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  checkFilterData() {
    const authorsData = this.returnFilterData().slice(
      0,
      this.localPayload.authorActivePage * this.localPayload.pageSize,
    );
    this.imageList = [];
    this.type1Tags = [];
    this.decadeList = [];
    this.returnFilterData().forEach((element: Photographer) => {
      this.setFilterData(element);
    });
    authorsData.forEach((element: Photographer) => {
      const authorTitle = this.common.checkAuthorName({
        name: element?.name,
        surnames: element?.surnames,
      });
      this.imageList.push({
        id: element.id,
        slug: element.slug,
        title: authorTitle,
        description: element.alias,
        image: element?.authors_images[0]?.url,
        born_date: this.common.extractYear(element?.born_date).trim(),
        death_date: this.common.extractYear(element?.death_date).trim(),
      });
    });

    this.totalCount = this.returnFilterData().length;
  }

  returnFilterData() {
    return this.dataStore.photographersPageData.authorData.filter(
      (data: Photographer) => {
        // Search filter

        const displayName = this.common.checkAuthorName({
          name: data.name,
          surnames: data.surnames,
        });
        const normalizedDisplayName = this.common
          .normalizeName(displayName)
          .toLowerCase();
        const isSearchMatched =
          this.searchResult && this.searchResult.length > 0
           ? (() => {
              const isUnknownAuthor = (!data.name?.trim() && !data.surnames?.trim()) || data.name === constants.NO_AUTHOR;
              if (isUnknownAuthor) {
                return normalizedDisplayName.includes(this.searchResult?.trim().toLowerCase());
              }
                const fullname = this.common.normalizeName(
                  data.name + ' ' + data.surnames,
                );
                const name = this.common.normalizeName(data.name);
                const surNames = this.common.normalizeName(data.surnames);
                return (
                  name
                    .toLowerCase()
                    .includes(
                      this.common
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    ) ||
                  surNames
                    .toLowerCase()
                    .includes(
                      this.common
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    ) ||
                  fullname
                    .toLowerCase()
                    .includes(
                      this.common
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    )
                );
              })()
            : true;

        const isDecadeMatch =
          this.decadeSelected.length > 0
            ? (() => {
                if (
                  data.born_date &&
                  this.common.extractYear(data?.born_date).trim()
                ) {
                  const bornYear = parseInt(
                    this.common.extractYear(data?.born_date).trim(),
                    10,
                  );

                  return this.decadeSelected.some((decadeRange: filter) => {
                    if (decadeRange.name) {
                      const splitYearData = decadeRange.name.split('-');
                      if (splitYearData.length > 1) {
                        const startYear = parseInt(splitYearData[0], 10);
                        const endYear = parseInt(splitYearData[1], 10);
                        return bornYear >= startYear && bornYear <= endYear;
                      }
                    }
                    return false;
                  });
                }
                return false;
              })()
            : true;

        const isTagsMatch =
          this.type1SelectedTags.length > 0
            ? (() => {
                if (data.authors_tags && data.authors_tags.length > 0) {
                  return this.type1SelectedTags.some((selectedTag: filter) =>
                    data.authors_tags.some(
                      (tagData: authorTag) =>
                        tagData.tag &&
                        tagData.tag.id_type == 1 &&
                        tagData.tag.id === selectedTag.id,
                    ),
                  );
                }
                return false;
              })()
            : true;

        const isLivingAuthors = this.isLivingAuthor ? !data.death_date : true;

        const isWomenAuthors = this.isWomenPhotographer
          ? data.dones_fotografes && data.dones_fotografes === 1
          : true;

        return (
          isSearchMatched &&
          isDecadeMatch &&
          isTagsMatch &&
          isLivingAuthors &&
          isWomenAuthors
        );
      },
    );
  }

  setFilterData(element: Photographer) {
    if (element.authors_tags && element.authors_tags.length > 0) {
      element.authors_tags.forEach((tagData: authorTag) => {
        if (tagData.tag) {
          if (tagData.tag.id_type == 1) {
            const tagType1Index = this.type1Tags.findIndex(
              (f: { id: number }) => f.id == tagData.tag.id,
            );
            if (tagType1Index >= 0) {
              this.type1Tags[tagType1Index].count++;
            } else if (
              tagData.tag.tags_languages &&
              tagData.tag.tags_languages.length > 0 &&
              tagData.tag.tags_languages[0].name
            ) {
              this.type1Tags.push({
                id: tagData.tag.id,
                name: tagData.tag.tags_languages[0].name,
                count: 1,
              });
            }
          }
        }
      });
    }

    this.type1Tags.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
    );

    if (
      element.born_date &&
      this.common.extractYear(element?.born_date).trim()
    ) {
      const bornYear = parseInt(
        this.common.extractYear(element?.born_date).trim(),
      );
      this.decadeListBackup.forEach(
        (decadeRange: { id: string; name: string; count: number }) => {
          if (decadeRange.name) {
            const splitYearData = decadeRange.name.split('-');
            if (splitYearData.length > 1) {
              const startYear = parseInt(splitYearData[0], 10);
              const endYear = parseInt(splitYearData[1], 10);
              if (bornYear >= startYear && bornYear <= endYear) {
                const decadeIndex = this.decadeList.findIndex(
                  (f: { id: string }) => f.id == decadeRange.name,
                );
                if (decadeIndex >= 0) {
                  this.decadeList[decadeIndex].count++;
                } else {
                  this.decadeList.push({
                    id: decadeRange.name,
                    name: decadeRange.name,
                    count: 1,
                  });
                }
              }
            }
          }
        },
      );
    }

    this.decadeList.sort((a: { id: string }, b: { id: string }) => {
      const startYearA = parseInt(a.id.split('-')[0]);
      const startYearB = parseInt(b.id.split('-')[0]);
      return startYearB - startYearA;
    });
  }

  afterLoadeCheckFilter() {
    this.type1Tags = [];
    this.decadeList = [];
    this.returnFilterData().forEach((element: Photographer) => {
      this.setFilterData(element);
    });
  }

  redirectToDetailPage(item: string) {
    this.dataStore.photographersPageData.photographerPageScrollId = item;
    this.router.navigate([
      `${this.common.getRoute('PHOTOGRAPHER_SEARCHER')}/${item}`,
    ]);
  }

  showMore() {
    this.localPayload.authorActivePage++;
    this.dataStore.photographersPageData.offset =
      this.localPayload.authorActivePage;
    this.checkFilterData();
  }

  loadedMasonaryData(isLoaded: boolean) {
    if (isLoaded && !this.isLoading) {
      this.isShowViewMore = true;
      if (this.comparisonResult === true) {
        const targetId =
          this.dataStore.photographersPageData.photographerPageScrollId;
        this.common.scrollToElementById(targetId);
        this.dataStore.photographersPageData.photographerPageScrollId = '';
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
    this.common.previousPageUrl.next('');
  }
}
