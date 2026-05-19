import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NestedEllipsisDirective } from 'ngx-nested-ellipsis';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CommonSwiperSlider } from "../../../shared/component/common-swiper-slider/common-swiper-slider";
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { Image, ITagData, IWorkImage } from '../../../shared/interfaces/image';
import {
  Institute,
  Photographer,
  PhotographerData
} from '../../../shared/interfaces/photographer';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-phorographer-details',
  standalone: true,
  imports: [
    MatTabsModule,
    CustomSearchComponent,
    TranslateModule,
    ImageErrorDirective,
    RouterModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
    MatSlideToggleModule,
    FormsModule,
    NestedEllipsisDirective,
    CommonSwiperSlider
],
  templateUrl: './photographer-details.component.html',
  styleUrl: './photographer-details.component.scss',
})
export class PhotographerDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  showAboutMobile: boolean = false;
  showAboutTextDeskTop: boolean = false;
  showAboutDeskTop: boolean = false;
  showFullBiblographyText: boolean = false;
  icons = ESvgIcon;
  id!: string;
  path: string = environment.WORKS;
  private unsubscribe$ = new Subject<void>();
  photographerDetail: Institute | null = null;
  environment = environment;
  searchResult: string = '';
  view = constants.VIEWS.GRID;
  constants = constants;
  totalCount = 0;
  isLoading: boolean = false;
  isLoadingDownload: boolean = false;
  relatedAuthorID!: string;
  workPayload: { id: string[]; search: string; offset: number } =
    {
      id: [],
      search: '',
      offset: 0,
    };
  authorPayload: {
    id: string;
    search: string;
    limit: number;
    offset: number;
  } = {
    id: '',
    search: '',
    limit: constants.LIMIT.TEN,
    offset: 0,
  };
  localPayload: {relatedWorkActivePage : number; pageSize : number } = {
    relatedWorkActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  sortBy: string = this.commonService.constantsData.SORT_BY.ASC;
  currentUrl!: string;
  imageList: IWorkImage[] = [];
  showMoreFlag = false;
  tab = 0;
  photographerImage: Image[] = [];
  showRelatedPhotographer: boolean = false;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  @ViewChild('photoDetailsLeft')
  photoDetailsLeft!: ElementRef;
  @ViewChild('photoDetailsRight')
  photoDetailsRight!: ElementRef;
  @ViewChild('titleSection') titleSection!: ElementRef;
  isShowViewMore: boolean = false;
  isShowExposicions: boolean = false;
  showExhibitionEllipsis: boolean = true;
  showBibliographyEllipsis: boolean = true;
  showAboutEllipsis: boolean = true;
  timeInterval: number | undefined;
  imageHeight: number = 0;
  @ViewChild('photographerDetailmasonryRef')
  photographerDetailmasonryRef!: ElementRef;
  private searchInput$ = new Subject<string>();
  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private dataStore: DataStoreService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    if (this.dataStore.photographersPageData) {
      // Check and assign search data
      if (this.dataStore.photographersPageData.searchDataDetails) {
        this.searchResult =
          this.dataStore.photographersPageData.searchDataDetails;
      }
      if (
        this.dataStore.photographersPageData.photographerDetailPageScrollId &&
        this.dataStore.photographersPageData.photographerDetailPageScrollId
          .length > 0
      ) {
        this.scrollToMasonry();
      }
      if (this.dataStore.photographersPageData.photographerDetailPageView) {
        this.view =
          this.dataStore.photographersPageData.photographerDetailPageView;
        if (this.view === constants.VIEWS.LIST) {
          const targetId = this.dataStore.photographersPageData.photographerDetailPageScrollId;
          this.commonService.scrollToElementById(targetId);
          this.dataStore.photographersPageData.photographerDetailPageScrollId =
            '';
        }
      }
    }
    this.onReloadPage();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener(
        'resize',
        this.debounce(() => this.adjustAboutContentVisibility(), 100),
      );
    }
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

  adjustAboutContentVisibility(): void {
    this.isLoading = true;
    if (this.photoDetailsLeft && this.photoDetailsRight) {
      const leftHeight = this.photoDetailsLeft.nativeElement.offsetHeight;
      const titleHeight =
        this.titleSection.nativeElement.offsetHeight -
        0.05 * this.titleSection.nativeElement.offsetHeight;
      this.imageHeight = leftHeight - titleHeight;
      if (leftHeight > 200 && this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      const rightHeight = this.photoDetailsRight.nativeElement.offsetHeight;
      if (leftHeight < rightHeight) {
        this.showAboutTextDeskTop = true;
      }
    }
    this.isLoading = false;
  }

  scrollToMasonry() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.photographerDetailmasonryRef?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 1000);
    }
  }

  initializeData() {
    this.photographerDetail = null;
    this.workPayload = {
      id: [],
      search: '',
      offset: 0,
    };
    this.imageList = [];
  }

  toggleBiblographyText() {
    this.showFullBiblographyText = !this.showFullBiblographyText;
  }

  private onReloadPage() {
    this.route.paramMap.subscribe(async (paramMap) => {
      this.id = paramMap.get('id') as string;
      this.getAuthorData(this.tab === 1 ? true : false);
      this.workPayload.id.push(this.id);
      this.isShowExposicions = false;
      this.showExhibitionEllipsis = true;
      this.showBibliographyEllipsis = true;
      this.showAboutEllipsis = true;
      this.isLoading = true;
      this.isShowViewMore = false;
      this.imageList = [];
      if(this.dataStore.photographersPageData.photographerDetailPageData && this.dataStore.photographersPageData.photographerDetailPageData.length > 0 && this.dataStore.photographersPageData.photographerDetailPageId == this.id){
        this.localPayload.relatedWorkActivePage = this.dataStore.photographersPageData.photographerDetailPageActivePage
         this.imageList = [];
        setTimeout(() => {
          this.isLoading = false;
          this.checkFilterData();
        }, 200);
      } else {
        this.getworksDataByAuthorId();
      }
      this.tab = 0;
      this.timeInterval = window.setInterval(() => {
        this.adjustAboutContentVisibility();
      }, 1000);
    });
  }

  openDynamicImage(author?: { name?: string | null; surnames?: string | null }) {
    const items: { title?: string; src: string }[] = [];
    this.photographerDetail?.authors_images.forEach((element) => {
      const imageTitle = this.commonService.checkAuthorName(author);
      items.push({ src: environment.AUTHORS + element.url, title: imageTitle });
    });
    this.commonService.openImageViewer(items);
  }

  copyUrlToClipboard(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = window.location.href;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(currentUrl)
          .then(() => {})
          .catch(() => {
            this.fallbackCopyTextToClipboard(currentUrl);
          });
      } else {
        this.fallbackCopyTextToClipboard(currentUrl);
      }
    }
  }

  fallbackCopyTextToClipboard(text: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('Fallback: URL copied to clipboard');
      } catch (err) {
        console.error('Fallback: Could not copy text', err);
      }
      document.body.removeChild(textArea);
    }
  }

  shareContent(): void {
    const title = 'Your Page Title';
    const text = `${this.photographerDetail?.name} ${this.photographerDetail?.surnames}`;
    const url = window.location.href;
    this.commonService.openShareModal({ title, text, url });
  }

  downloadPdf() {
    this.isLoadingDownload = true;
    this.apiService
      .get(`${environment.DOWNLOAD_PHOTOGRAPHERFETAIL_PDF}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
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
        },
        error: (err) => {
          this.isLoadingDownload = false;
          console.error('Error downloading the PDF', err);
        },
      });
  }

  getAuthorData(isShowRelatedPhotographer: boolean = false) {
    this.apiService
      .get(`${environment.PHOTOGRAPHER_DATA}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.is_error) {
            this.router.navigate([
              `${this.commonService.getRoute('PHOTOGRAPHER_SEARCHER')}`,
            ]);
          }
          if (response.data && !response.is_error) {
            this.photographerDetail = response.data;
            if (
              this.photographerDetail?.authors_images?.[0]?.url &&
              this.photographerDetail?.authors_images?.[0]?.url.length > 0
            ) {
              const preloadUrl = this.commonService.getImageUrl(
                environment.AUTHORS,
                this.photographerDetail?.authors_images?.[0]?.url,
              );
              this.commonService.preloadImage(preloadUrl);
            }
            this.relatedAuthorID = response.data.id;
            if (this.photographerDetail && this.photographerDetail.id) {
              this.checkRelatedPhotoGraph();
            }
            if (isShowRelatedPhotographer) {
              this.getAuthorsImageById();
            }
            window.scrollTo(0, 0);
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.photographersPageData.photographerDetailPageView = this.view;
    this.isShowViewMore = false;
  }

  handleSearch(searchTerm: string) {
    if (
      searchTerm !== this.dataStore.photographersPageData.searchDataDetails ||
      !this.imageList.length
    ) {
      this.searchResult = searchTerm;
      if(searchTerm !== this.dataStore.photographersPageData.searchDataDetails){
        this.localPayload.relatedWorkActivePage = 1;
      }
      this.imageList = [];
      this.isShowViewMore = false;
      this.dataStore.photographersPageData.searchDataDetails = searchTerm.trim();
      this.checkFilterData()
    }
  }

  tabchange(tab: MatTabChangeEvent) {
    this.tab = tab.index;
    if (tab.index == 0) {
      this.checkFilterData();
    } else if (tab.index == 1) {
      this.getAuthorsImageById();
    }
  }

  checkRelatedPhotoGraph() {
    this.authorPayload.id = this.relatedAuthorID;
    this.apiService
      .post(`${environment.RELATED_AUTHOR}`, this.authorPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (
            response.data &&
            response.data.authors &&
            response.data.authors.length > 0
          ) {
            this.showRelatedPhotographer = true;
          }
        },
      });
  }

  getAuthorsImageById() {
    this.isLoading = true;
    this.authorPayload.id = this.relatedAuthorID;
    this.photographerImage = [];
    this.apiService
      .post(`${environment.RELATED_AUTHOR}`, this.authorPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data.authors.length === 0) {
            this.isLoading = false;
          }
          if (response.data && !response.is_error) {
            response.data.authors.forEach((element: Photographer) => {
              const authorTitle = this.commonService.checkAuthorName({
                name: element?.name,
                surnames: element?.surnames,
              });
              this.photographerImage.push({
                id: element?.id,
                slug: element?.slug,
                title: authorTitle,
                description: element?.alias,
                image: element?.authors_images?.[0]?.url
                  ? environment.IMAGE_URL +
                    environment.AUTHORS +
                    element?.authors_images[0]?.url
                  : environment.DEFAULT_IMAGE_PATH,
                date: '',
              });
            });
            this.isLoading = false;
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  redirectToDetailPage(item: string) {
    this.dataStore.photographersPageData.photographerDetailPageScrollId = item;
    this.router.navigate([
      `${this.commonService.getRoute('PHOTOGRAPHER_SEARCHER')}/${item}`,
    ]);
  }

  slideShow() {
    this.imageList = this.commonService.sortItems(this.imageList, this.sortBy);
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
          this.path +
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

  showMore() {
    this.isLoading = true;
    this.isShowViewMore = false;
    this.localPayload.relatedWorkActivePage++
    this.dataStore.photographersPageData.photographerDetailPageActivePage = this.localPayload.relatedWorkActivePage
    this.checkFilterData()
    this.showMoreFlag = true;
  }

  loadedMasonaryData(isLoaded: boolean) {
    if (isLoaded && !this.isLoading) {
      this.isShowViewMore = true;
      const targetId = this.dataStore.photographersPageData.photographerDetailPageScrollId;
      this.commonService.scrollToElementById(targetId);
      this.dataStore.photographersPageData.photographerDetailPageScrollId = '';
    }
  }

  redirection(slug: string) {
    this.dataStore.photographersPageData.photographerDetailPageScrollId = slug;
    this.router.navigate([
      `${this.commonService.getRoute('PHOTO_SEARCHER')}/${slug}`,
    ]);
  }

  getworksDataByAuthorId() {
    this.isLoading = true;
    this.apiService
      .post(
        `${environment.GET_WORK_BY_ID}${environment.AUTHORS}${this.id}`,
        this.workPayload,
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data.works.length === 0) {
            this.isLoading = false;
          }
          if (response.data && !response.is_error) {
            this.totalCount = response.data.totalCount;
            if (!this.showMoreFlag) {
              this.imageList = [];
              this.showMoreFlag = false;
            }
            this.dataStore.photographersPageData.photographerDetailPageData = [...response.data.works];
            this.dataStore.photographersPageData.photographerDetailPageId = this.id
            this.checkFilterData()
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.commonService.error(response.message);
          }
        },
      });
  }

  checkFilterData() {
    const allWorkFilteredData = this.returnFilterData();
    const workFilterSplitData = allWorkFilteredData.slice(0, this.localPayload.relatedWorkActivePage * this.localPayload.pageSize);
    this.imageList = [];
    workFilterSplitData.forEach((element: PhotographerData) => {
      this.imageList.push({
        id: element.id,
        slug: element.slug,
        title: element?.name,
        description:
          element?.institution?.id ===
          this.commonService.constantsData.PRIVATE_INSTITUTION_ID
            ? this.translate.instant(
                'PHOTO_SEARCH_ENGINE.OTHER_INSTITUTION_LABEL',
              )
            : element.institution?.name,
        image: element.imagesData[0],
        date: this.commonService.checkWorkDate(element.date),
        author: this.commonService.checkAuthorName(element.author)
      });
    });
    this.totalCount = allWorkFilteredData.length;
    this.isLoading = false;
    }

  returnFilterData() {
    return this.dataStore.photographersPageData.photographerDetailPageData.filter(
      (data: PhotographerData) => {
        // Search filter
      const isSearchMatched =
        this.searchResult && this.searchResult.length > 0
          ? (() => {
              const instituteName = this.commonService.normalizeName(data?.institution?.name);
              const workName = this.commonService.normalizeName( data?.name );
              return (
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

  redirectPgotographerListing(tagData: ITagData) {
    if (tagData && tagData.tag) {
      this.dataStore.photographersPageData.limit = constants.LIMIT.TWENTY_FOUR;
      this.dataStore.photographersPageData.offset = 0;
      this.dataStore.photographersPageData.imageList = [];
      if (tagData.tag.id_type == 1) {
        this.dataStore.photographersPageData.filter.type1SelectedTags = [];
        this.dataStore.photographersPageData.filter.type1SelectedTags.push({
          id: tagData.tag.id,
          name: tagData.tag.tags_languages[0].name,
        });
      }
      this.router.navigate([
        `${this.commonService.getRoute('PHOTOGRAPHER_SEARCHER')}`,
      ]);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
    this.commonService.previousPageUrl.next(this.router.url);
  }
}
