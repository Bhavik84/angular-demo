import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { IWorkImage } from '../../../shared/interfaces/image';
import { institute } from '../../../shared/interfaces/institute';
import { PhotoDetails } from '../../../shared/interfaces/photo-details';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-institute-file',
  standalone: true,
  imports: [
    TranslateModule,
    CustomSearchComponent,
    MatChipsModule,
    MatTabsModule,
    MatIconModule,
    ImageErrorDirective,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CommonModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
  ],
  templateUrl: './institute-file.component.html',
  styleUrl: './institute-file.component.scss',
})
export class InstituteFileComponent implements OnInit, OnDestroy {
  id!: string;
  private unsubscribe$ = new Subject<void>();
  photoDetails: PhotoDetails | null = null;
  view = constants.VIEWS.GRID;
  totalCount = 0;
  isLoadingDownload: boolean = false;
  tab = 0;
  isLoading: boolean = false;
  showMoreFlag = false;
  workPayload: { search: string; offset: number } = {
    search: '',
    offset: 0,
  };
  sortBy: string = constants.SORT_BY.ASC;
  searchResult = '';
  imageList: IWorkImage[] = [];
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  isShowViewMore: boolean = false;
  @ViewChild('institutionDetailmansonryRef')
  institutionDetailmansonryRef!: ElementRef;
  localPayload: {relatedWorkActivePage : number; pageSize : number } = {
    relatedWorkActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private translate: TranslateService,
    private dataStore: DataStoreService,
  ) {}

  ngOnInit() {
    if (this.dataStore.institutePageData) {
      if (
        this.dataStore.institutePageData.institutionDetailSearchTerm &&
        this.dataStore.institutePageData.institutionDetailSearchTerm.length > 0
      ) {
        this.searchResult = this.dataStore.institutePageData.institutionDetailSearchTerm;
      }
      if (
        this.dataStore.institutePageData.institutionDetailScrollId &&
        this.dataStore.institutePageData.institutionDetailScrollId.length > 0
      ) {
        if (this.dataStore.institutePageData.institutionDetailPageTabIndex) {
          this.tab =
            this.dataStore.institutePageData.institutionDetailPageTabIndex;
        }
        this.scrollToMasonry();
      }
      if (this.dataStore.institutePageData.institutionDetailView) {
        this.view = this.dataStore.institutePageData.institutionDetailView;
        if (this.view === this.commonService.constantsData.VIEWS.LIST) {
          const targetId =
            this.dataStore.institutePageData.institutionDetailScrollId;
          this.commonService.scrollToElementById(targetId);
          this.dataStore.institutePageData.institutionDetailScrollId = '';
        }
      }
    }
    this.onReloadPage();
  }

  initializeData() {
    this.photoDetails = null;
    this.imageList = [];
  }

  private onReloadPage(): void {
    const id = this.route.snapshot.paramMap.get('id') as string;

    if (!id) {
      this.router.navigate([
        this.commonService.getRoute('INSTITUTION_SEARCHER'),
      ]);
      return;
    }

    this.id = id;

    const instituteDetails = this.route.snapshot.data['instituteDetails'];
    const instituteData = instituteDetails?.data;

    if (!instituteDetails || instituteDetails.is_error || !instituteData) {
      this.router.navigate([
        this.commonService.getRoute('INSTITUTION_SEARCHER'),
      ]);
      return;
    }

    this.photoDetails = instituteData;
    if (
      this.photoDetails?.institutions_images[0]?.url &&
      this.photoDetails?.institutions_images[0]?.url.length > 0
    ) {
      const preloadUrl = this.commonService.getImageUrl(
        environment.INSTITUTIONS,
        this.photoDetails?.institutions_images[0]?.url,
      );
      this.commonService.preloadImage(preloadUrl);
    }
    const shouldReloadInstituteData =
      instituteData.institutions_languages?.[0]?.id_language !==
      this.commonService.language;

    if (shouldReloadInstituteData) {
      this.getInstituteData();
    }

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.isLoading = false;
      if(this.dataStore.institutePageData.institutionDetailWorkData && this.dataStore.institutePageData.institutionDetailWorkData.length > 0 &&  this.dataStore.institutePageData.institutionDetailId == this.id){
        this.localPayload.relatedWorkActivePage = this.dataStore.institutePageData.institutionDetailActivePage
        this.checkFilterData()
      }
      else {
        this.getworksDataByAuthorId();
      }
  }

  getImageUrl(path: string, imageName: string): string {
    const baseUrl = environment.IMAGE_URL + path;
    return `${baseUrl}${imageName}`;
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.institutePageData.institutionDetailView = this.view;
    this.isShowViewMore = false;
  }

  scrollToMasonry() {
    setTimeout(() => {
      this.institutionDetailmansonryRef?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
  }

  getInstituteData() {
    this.apiService
      .get(`${environment.GET_INSTITUTE}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.photoDetails = response.data;
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  getworksDataByAuthorId() {
    this.isLoading = true;
    this.apiService
      .post(
        `${environment.GET_WORK_BY_ID}${environment.INSTITUTIONS}${this.id}`,
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
            this.dataStore.institutePageData.institutionDetailWorkData = [...response.data.works];
            this.dataStore.institutePageData.institutionDetailId = this.id;
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
    workFilterSplitData.forEach((element: institute) => {
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
          author: this.commonService.checkAuthorName(element.author),
          image: element.imagesData[0],
          date: this.commonService.checkWorkDate(element.date),
        });
      });
    this.totalCount = allWorkFilteredData.length;
    this.isLoading = false;
  }

  returnFilterData() {
    return this.dataStore.institutePageData.institutionDetailWorkData.filter(
      (data: institute) => {
        // Search filter
      const isSearchMatched =
        this.searchResult && this.searchResult.length > 0
          ? (() => {
              const authorFullname = this.commonService.normalizeName(data?.author?.name + ' ' + data?.author?.surnames);
              const authorsurNames = this.commonService.normalizeName(data?.author?.surnames ? data?.author?.surnames : '');
              const instituteName = this.commonService.normalizeName(data?.institution?.name ? data?.institution?.name : '');
              const workName = this.commonService.normalizeName( data?.name ? data?.name : '' );
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


  openDynamicImage(title?: string) {
    const items: { title?: string; src: string }[] = [];
    this.photoDetails?.institutions_images.forEach((element) => {
      items.push({ src: environment.INSTITUTIONS + element.url, title: title });
    });
    this.commonService.openImageViewer(items);
  }

  tabchange(tab: MatTabChangeEvent) {
    this.tab = tab.index;
    this.dataStore.institutePageData.institutionDetailPageTabIndex = this.tab;
    if (tab.index == 1) {
      this.checkFilterData()
    }
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

  shareContent(): void {
    const title = `${this.photoDetails?.name}`;
    const text = `${this.photoDetails?.name}`;
    const url = window.location.href;
    this.commonService.openShareModal({ title, text, url });
  }

  redirection(slug: string) {
    this.dataStore.institutePageData.institutionDetailScrollId = slug;
    this.router.navigate([
      `${this.commonService.getRoute('PHOTO_SEARCHER')}/${slug}`,
    ]);
  }

  downloadPdf() {
    this.isLoadingDownload = true;
    this.apiService
      .get(`${environment.DOWNLOAD_INSTITUTE_PDF}/${this.id}`)
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
            } else {
              this.isLoadingDownload = false;
              this.commonService.error(response.message);
            }
          }
        },
        error: (err) => {
          console.error('Error downloading the PDF', err);
        },
      });
  }

  handleSearch(searchTerm: string) {
    if (
      searchTerm !==
        this.dataStore.institutePageData.institutionDetailSearchTerm ||
      !this.imageList.length
    ) {
      this.searchResult = searchTerm;
      if(searchTerm !== this.dataStore.institutePageData.institutionDetailSearchTerm) {
        this.localPayload.relatedWorkActivePage = 1
      }
      this.workPayload.search = searchTerm.trim();
      this.dataStore.institutePageData.institutionDetailSearchTerm = this.searchResult.trim();
      this.imageList = [];
      this.isShowViewMore = false;
      this.checkFilterData();
    }
  }

  resetPaginationWorkPayload() {
    this.workPayload.offset = 0;
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
    this.dataStore.institutePageData.institutionDetailActivePage = this.localPayload.relatedWorkActivePage
    this.checkFilterData();
  }

  loadedMasonaryData(isLoaded: boolean) {
    if (isLoaded && !this.isLoading) {
      this.isShowViewMore = true;
      const targetId =
        this.dataStore.institutePageData.institutionDetailScrollId;
      this.commonService.scrollToElementById(targetId);
      this.dataStore.institutePageData.institutionDetailScrollId = '';
    }
  }

  redirectToLink(url: string | undefined) {
    const updatedUrl = this.commonService.convertLinkURL(url);
    window.open(updatedUrl);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
    this.commonService.previousPageUrl.next(this.router.url);
  }
}
