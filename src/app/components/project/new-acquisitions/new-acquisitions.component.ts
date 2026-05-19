import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { YearSelectionComponent } from '../../../shared/component/year-selection/year-selection.component';
import { Acquisitions } from '../../../shared/interfaces/acquisitions';
import { AuthorName } from '../../../shared/interfaces/authors';
import { IWorkImage } from '../../../shared/interfaces/image';
import { Work } from '../../../shared/interfaces/work';
import { SanitizeHtmlPipe } from './../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-new-acquisitions',
  standalone: true,
  imports: [
    YearSelectionComponent,
    FormsModule,
    CommonModule,
    MatCheckboxModule,
    TranslateModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIcon,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
  ],
  templateUrl: './new-acquisitions.component.html',
  styleUrl: './new-acquisitions.component.scss',
})
export class NewAcquisitionsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  authors: AuthorName[] = [];
  limit: number = constants.LIMIT.TWENTY_FOUR;
  totalAuthors: number = 0;
  offset: number = 0;
  view = constants.VIEWS.GRID;
  totalCount!: number;
  currentYear: string = '';
  customImageList: IWorkImage[] = [];
  showMoreFlag = false;
  authorPayload: { id: string[]; year: string; limit: number; offset: number } =
    {
      id: [],
      year: String(this.currentYear),
      limit: constants.LIMIT.TWENTY_FOUR,
      offset: this.offset,
    };
  listPayload = {
    limit: constants.LIMIT.TWENTY_FOUR,
    offset: 0,
    year: this.authorPayload.year,
    new_adquisition: 1,
  };
  isLoading: boolean = false;
  authorLoading: boolean = true;
  years: number[] = [];
  isShowViewMore: boolean = false;
  constructor(
    private apiService: ApiService,
    private router: Router,
    public common: CommonService,
    private dataStore: DataStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (this.dataStore.acquisitionsPageData) {
      if (
        this.dataStore.acquisitionsPageData.selectedAuthors &&
        this.dataStore.acquisitionsPageData.selectedAuthors.length > 0
      ) {
        this.authorPayload.id =
          this.dataStore.acquisitionsPageData.selectedAuthors;
      }
    }
    this.onReloadPage();
  }

  initializeData() {
    this.authors = [];
    this.limit = constants.LIMIT.TWENTY_FOUR;
    this.offset = 0;
    this.authorPayload = {
      id: [],
      year: String(this.currentYear),
      limit: constants.LIMIT.TWENTY_FOUR,
      offset: this.offset,
    };
  }

  private onReloadPage() {
    this.getAuthors();
    this.common.scrollTop();
    this.getAllAuthorById();
  }

  getAllAuthorById() {
    this.authorPayload.limit = this.limit;
    this.authorPayload.offset = this.offset;
    this.isLoading = true;
    this.apiService
      .post(`${environment.GET_ACQUISITION}`, this.authorPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        if (response.data && !response.is_error) {
          this.totalCount = response.data.totalCount;
          this.years = (response.data.decades || []).sort(
            (a: number, b: number) => {
              return a - b;
            },
          );
          if (!this.showMoreFlag) {
            this.customImageList = [];
            this.showMoreFlag = false;
          }
          response.data.works.forEach((element: Acquisitions) => {
            this.customImageList.push({
              id: element.id,
              slug: element.slug,
              image: element.works_images[0],
              title: element?.name,
              author: this.common.checkAuthorName(element.author),
              description: element?.institution?.name,
              date: this.common.checkWorkDate(element.date),
            });
          });
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.common.error(response.message);
        }
      });
  }
  getAuthors() {
    this.listPayload.year = this.authorPayload.year;
    this.authorLoading = true;
    this.apiService
      .post(`${environment.GET_ALL_AUTHOR_LISTING}`, this.listPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.authorLoading = false;
            response.data.works.forEach((element: Work) => {
              if (this.authorPayload.id && this.authorPayload.id.length > 0) {
                const authorIndex = this.authorPayload.id.findIndex(
                  (data: string) => data === String(element.author.id),
                );
                element.author.selected = authorIndex !== -1 ? true : false;
              } else {
                element.author.selected = false;
              }
              this.authors.push(element.author);
            });
          } else {
            this.authorLoading = false;
            this.common.error(response.message);
          }
        },
      });
  }

  showMoreAuthor() {
    this.listPayload.limit = constants.LIMIT.TWENTY_FOUR;
    this.listPayload.offset =
      this.listPayload.offset + constants.LIMIT.TWENTY_FOUR;
    this.getAuthors();
  }
  redirectToDetailPage(item: string) {
    this.router.navigate([`${this.common.getRoute('PHOTO_SEARCHER')}/${item}`]);
  }

  toggleAuthorSelection(author: AuthorName) {
    author.selected = !author.selected;
    if (author.selected) {
      this.authorPayload.id.push(String(author.id));
    } else {
      const authorIndex = this.authorPayload.id.findIndex(
        (data: string) => data === String(author.id),
      );
      if (authorIndex !== -1) {
        this.authorPayload.id.splice(authorIndex, 1);
      }
    }
    this.dataStore.acquisitionsPageData.selectedAuthors = this.authorPayload.id;
    this.resetPagination();
    this.getAllAuthorById();
  }

  yearChange(event: number) {
    this.authors = [];
    this.authorPayload.year = event?.toString();
    this.dataStore.acquisitionsPageData.selectedAuthors = [];
    this.authorPayload.id = [];
    this.getAuthors();
    this.resetPagination();
    this.getAllAuthorById();
  }

  showMore() {
    this.isLoading = true;
    this.isShowViewMore = false;
    this.limit = constants.LIMIT.TWENTY_FOUR;
    this.offset = this.offset + constants.LIMIT.TWENTY_FOUR;
    this.showMoreFlag = true;
    this.getAllAuthorById();
  }

  loadedMasonaryData(isLoaded: boolean) {
    if (isLoaded && !this.isLoading) {
      this.isShowViewMore = true;
    }
  }

  resetPagination() {
    this.limit = constants.LIMIT.TWENTY_FOUR;
    this.offset = 0;
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
  }
}
