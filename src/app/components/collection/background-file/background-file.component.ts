import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatTabChangeEvent,
  MatTabGroup,
  MatTabsModule,
} from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NestedEllipsisDirective } from 'ngx-nested-ellipsis';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { Collection } from '../../../shared/interfaces/collection';
import { IWorkImage } from '../../../shared/interfaces/image';
import { Work } from '../../../shared/interfaces/work';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-background-file',
  standalone: true,
  imports: [
    MatTabsModule,
    CustomSearchComponent,
    TranslateModule,
    ImageErrorDirective,
    RouterModule,
    CommonModule,
    MatIconModule,
    MatIconModule,
    ImageErrorDirective,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
    NestedEllipsisDirective,
    MatTabGroup,
  ],
  templateUrl: './background-file.component.html',
  styleUrl: './background-file.component.scss',
})
export class BackgroundFileComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  id!: string;
  private unsubscribe$ = new Subject<void>();
  isLoadingDownload: boolean = false;
  photographerDetail: Collection | null = null;
  view = constants.VIEWS.GRID;
  tab = 0;
  isLoading: boolean = false;
  sortBy: string = constants.SORT_BY.ASC;
  imageList: IWorkImage[] = [];
  totalCount = 0;
  workPayload: {
    search: string;
    offset: number;
    sortBy: string;
  } = {
    sortBy: this.sortBy,
    search: '',
    offset: 0,
  };
  showMoreFlag = false;
  isShowViewMore: boolean = false;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  showSummaryEllipsis: boolean = true;
  imageHeight: number = 0;
  @ViewChild('photoDetailsLeft') photoDetailsLeft!: ElementRef;
  @ViewChild('photoDetailsRight') photoDetailsRight!: ElementRef;
  @ViewChild('titleSection') titleSection!: ElementRef;
  timeInterval: number | undefined;
  searchResult: string = '';
  @ViewChild('collectionDetailsmansonryRef')
  collectionDetailsmansonryRef!: ElementRef;
  localPayload: {relatedWorkActivePage : number; pageSize : number } = {
    relatedWorkActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  private searchInput$ = new Subject<string>();
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
    private translate: TranslateService,
    private dataStore: DataStoreService,
  ) {}

  ngOnInit() {
    if (this.dataStore.artWorkFundPageData) {
      if (
        this.dataStore.artWorkFundPageData.detailPageSearchTerm &&
        this.dataStore.artWorkFundPageData.detailPageSearchTerm.length > 0
      ) {
        this.searchResult =
          this.dataStore.artWorkFundPageData.detailPageSearchTerm;
      }
      if (
        this.dataStore.artWorkFundPageData.fundsDetailScrollId &&
        this.dataStore.artWorkFundPageData.fundsDetailScrollId.length > 0
      ) {
        this.scrollToMasonry();
      }
      if (this.dataStore.artWorkFundPageData.fundsDetailView) {
        this.view = this.dataStore.artWorkFundPageData.fundsDetailView;
        if (this.view === this.commonService.constantsData.VIEWS.LIST) {
          const targetId =
            this.dataStore.artWorkFundPageData.fundsDetailScrollId;
          this.commonService.scrollToElementById(targetId);
          this.dataStore.artWorkFundPageData.fundsDetailScrollId = '';
        }
      }
    }
    this.onReloadPage();
  }

  scrollToMasonry() {
    setTimeout(() => {
      this.collectionDetailsmansonryRef?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
  }

  private onReloadPage() {
    const id = this.route.snapshot.paramMap.get('id') as string;
    if (!id) {
      this.router.navigate([
        this.commonService.getRoute('BACKGROUND_SEARCHER'),
      ]);
      return;
    }

    this.id = id;
    const artworkData = this.route.snapshot.data['artworkDetails'];
    const isValidData =
      artworkData && !artworkData.is_error && artworkData.data;
    if (!isValidData) {
      this.router.navigate([
        this.commonService.getRoute('BACKGROUND_SEARCHER'),
      ]);
      return;
    }

    this.photographerDetail = artworkData.data;
    if (
      this.photographerDetail?.collections_images?.[0]?.url &&
      this.photographerDetail?.collections_images?.[0]?.url.length > 0
    ) {
      const preloadUrl = this.commonService.getImageUrl(
        environment.COLLECTIONS,
        this.photographerDetail?.collections_images?.[0]?.url,
      );
      this.commonService.preloadImage(preloadUrl);
    }
    const languageMismatch =
      artworkData.data.collections_languages?.[0]?.id_language !==
      this.commonService.language;
    if (languageMismatch) {
      this.getFundData();
    }

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.timeInterval = window.setInterval(() => {
        this.adjustAboutContentVisibility();
      }, 1000);
    }
    if(this.dataStore.artWorkFundPageData.detailPageCollectionId == this.id && this.dataStore.artWorkFundPageData.detailPageWorkData && this.dataStore.artWorkFundPageData.detailPageWorkData.length > 0){
      this.localPayload.relatedWorkActivePage = this.dataStore.artWorkFundPageData.detailPageWorkActivepage
      this.imageList =[];
        setTimeout(() => {
        this.isLoading = false;
        this.checkFilterData();
      }, 200);
    } else {
      this.getWorksImage();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener(
        'resize',
        this.debounce(() => this.adjustAboutContentVisibility(), 100),
      );
    }
  }

  adjustAboutContentVisibility(): void {
    this.isLoading = true;
    if (this.photoDetailsLeft && this.photoDetailsRight) {
      const leftHeight = this.photoDetailsLeft.nativeElement.offsetHeight;
      const titleHeight =
        this.titleSection.nativeElement.offsetHeight -
        0.05 * this.titleSection.nativeElement.offsetHeight;
      if (leftHeight > 0) {
        clearInterval(this.timeInterval);
      }
      this.imageHeight = leftHeight - titleHeight;
      if (leftHeight > 200 && this.timeInterval !== undefined) {
        clearInterval(this.timeInterval);
      }
    }
    this.isLoading = false;
  }

  debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  getFundData() {
    this.apiService
      .get(`${environment.GET_COLLECTION_DETAIL}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.photographerDetail = response.data;
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.artWorkFundPageData.fundsDetailView = this.view;
    this.isShowViewMore = false;
  }

  tabchange(tab: MatTabChangeEvent) {
    this.tab = tab.index;
    if (tab.index == 0 && this.imageList.length == 0) {
      this.checkFilterData()
    }
  }

  openDynamicImage(title?: string) {
    const items: { title?: string; src: string }[] = [];
    this.photographerDetail?.collections_images.forEach((element) => {
      items.push({ src: environment.COLLECTIONS + element.url, title: title });
    });
    this.commonService.openImageViewer(items);
  }

  handleSearch(searchTerm: string) {
    if (
      searchTerm !== this.dataStore.artWorkFundPageData.detailPageSearchTerm ||
      !this.imageList.length
    ) {
      this.searchResult = searchTerm;
      if(searchTerm !== this.dataStore.artWorkFundPageData.detailPageSearchTerm){
       this.localPayload.relatedWorkActivePage = 1
      }
      this.dataStore.artWorkFundPageData.detailPageSearchTerm = searchTerm.trim();
      this.imageList = [];
      this.isShowViewMore = false;
      this.checkFilterData()
    }
  }

  slideShow() {
    this.imageList = this.commonService.sortItems(
      this.imageList,
      this.workPayload.sortBy,
    );
    const images: {
      title?: string;
      src: string;
      description?: string;
      date?: string;
      author?: string;
    }[] = [];
    this.imageList.forEach((element: IWorkImage) => {
      images.push({
        title: element.title,
        src:
          environment.WORKS +
          (element.extra_folder ? element.extra_folder + '/' : '') +
          this.commonService.constantsData.IMAGE_SIZES.BIG +
          '/' +
          element.image?.filename,
        description: element.description,
        date: element.date,
        author: element.author,
      });
    });
    this.commonService.openImageViewer(images);
  }

  downloadPdf() {
    this.isLoadingDownload = true;
    this.apiService
      .get(`${environment.DOWNLOAD_BACKGROUNFDETAIL_PDF}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.isLoadingDownload = false;
            const url = `${environment.IMAGE_URL}${environment.PDF}${response.data}`;
            if (isPlatformBrowser(this.platformId)) {
              window.open(url, '_blank');
              const link = document.createElement('a');
              link.download = response.data;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          } else {
            this.commonService.error(response.message);
          }
        },
        error: (err) => {
          console.error('Error downloading the PDF', err);
        },
      });
  }

  shareContent(): void {
    const title = `${this.photographerDetail?.collections_languages[0].title_short}`;
    const text = `${this.photographerDetail?.collections_languages[0].title_long}`;
    const url = window.location.href;
    this.commonService.openShareModal({ title, text, url });
  }

  getWorksImage() {
    this.isLoading = true;
    this.apiService
      .post(
        `${environment.GET_WORK_BY_ID}${environment.COLLECTIONS}${this.id}`,
        this.workPayload,
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            if (response.data.works.length === 0) {
              this.isLoading = false;
            }
            this.totalCount = response.data.totalCount;
            if (!this.showMoreFlag) {
              this.imageList = [];
              this.showMoreFlag = false;
            }
            this.dataStore.artWorkFundPageData.detailPageWorkData = [...response.data.works];
            this.dataStore.artWorkFundPageData.detailPageCollectionId = this.id
            this.checkFilterData()
            this.isLoading = false;
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }


  checkFilterData() {
    const allWorkFilteredData = this.returnFilterData();
    const workFilterSplitData = allWorkFilteredData.slice(0, this.localPayload.relatedWorkActivePage * this.localPayload.pageSize);
    this.imageList = [];
    workFilterSplitData.forEach((element: Work) => {
      const existingItemIndex = this.imageList.findIndex((item) => item.id === element.id);
        if (existingItemIndex === -1) {
          this.imageList.push({
            id: element.id,
            slug: element.slug,
            title: element.name,
            description:
              element?.institution?.id === 5
                ? this.translate.instant(
                    'PHOTO_SEARCH_ENGINE.OTHER_INSTITUTION_LABEL',
                  )
                : element.institution?.name,
            author:this.commonService.checkAuthorName(element.author),
            image: element.imagesData[0],
            date: this.commonService.checkWorkDate(element.date),
          });
        }
      });
    this.totalCount = allWorkFilteredData.length;
    this.isLoading = false;
  }

  returnFilterData() {
    return this.dataStore.artWorkFundPageData.detailPageWorkData.filter(
      (data: Work) => {
        // Search filter
      const isSearchMatched =
        this.searchResult && this.searchResult.length > 0
          ? (() => {
              const authorFullname = this.commonService.normalizeName(data?.author?.name + ' ' + data?.author?.surnames);
              const authorsurNames = this.commonService.normalizeName(data?.author?.surnames);
              const instituteName = this.commonService.normalizeName(data?.institution?.name);
              const workName = this.commonService.normalizeName( data?.name );
              return (
                  authorFullname
                    .toLowerCase()
                    .includes(
                      this.commonService
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    ) ||
                  authorsurNames
                    .toLowerCase()
                    .includes(
                      this.commonService
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    ) ||
                  instituteName
                    .toLowerCase()
                    .includes(
                      this.commonService
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    ) ||
                  workName
                    .toLowerCase()
                    .includes(
                      this.commonService
                        .normalizeName(this.searchResult.trim())
                        .toLowerCase(),
                    )
                );
            })()
          : true;
      return  isSearchMatched
      },
    );
  }

  redirection(slug: string) {
    this.dataStore.artWorkFundPageData.fundsDetailScrollId = slug;
    this.router.navigate([
      `${this.commonService.getRoute('PHOTO_SEARCHER')}/${slug}`,
    ]);
  }


  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  showMore() {
    this.isLoading = true;
    this.isShowViewMore = false;
    this.showMoreFlag = true;
    this.localPayload.relatedWorkActivePage++;
    this.dataStore.artWorkFundPageData.detailPageWorkActivepage = this.localPayload.relatedWorkActivePage
    this.checkFilterData()
  }

  loadedMasonaryData(isLoaded: boolean) {
    if (isLoaded && !this.isLoading) {
      this.isShowViewMore = true;
      const targetId = this.dataStore.artWorkFundPageData.fundsDetailScrollId;
      this.commonService.scrollToElementById(targetId);
      this.dataStore.artWorkFundPageData.fundsDetailScrollId = '';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
    this.commonService.previousPageUrl.next(this.router.url);
  }
}
