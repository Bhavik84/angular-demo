import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { SwiperSlider } from "../../../shared/component/swiper-slider/swiper-slider";
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { IRedirectOptionData } from '../../../shared/interfaces/IRedirectOptionData';
import { IRelatedWorkData, IRelatedWorkDetails } from '../../../shared/interfaces/photograph';
import {
  authorTag,
  Work,
  workTechnique,
} from '../../../shared/interfaces/work';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';
@Component({
  selector: 'app-photograph-file',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinner,
    SanitizeHtmlPipe,
    RouterLink,
    SwiperSlider
],
  templateUrl: './photograph-file.component.html',
  styleUrl: './photograph-file.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class PhotographFileComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  icons = ESvgIcon;
  id!: string;
  path: string = environment.WORKS;
  private unsubscribe$ = new Subject<void>();
  photoDetails: Work | null = null;
  environment = environment;
  photographerImage: IRelatedWorkData[] = [];
  workPayload: { search: string; limit: number; offset: number; id: number } = {
    id: 0,
    search: '',
    limit: constants.LIMIT.TEN,
    offset: 0,
  };
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
    private snackBar: MatSnackBar,
    private dataStore: DataStoreService,
  ) {}

  ngOnInit() {
    this.onReloadPage();
  }
  redirection(slug: string | undefined) {
    this.router.navigate([
      `${this.commonService.getRoute('PHOTOGRAPHER_SEARCHER')}/${slug}`,
    ]);
  }
  redirectionToFund(slug: string | undefined) {
    if (slug) {
      this.router.navigate([
        `${this.commonService.getRoute('BACKGROUND_SEARCHER')}/${slug}`,
      ]);
    }
  }
  initializeData() {
    this.photoDetails = null;
    this.workPayload = {
      id: 0,
      search: '',
      limit: constants.LIMIT.TEN,
      offset: 0,
    };
    this.photographerImage = [];
  }

  downloadPdf() {
    this.isLoading = true;
    this.apiService
      .get(`${environment.DOWNLOAD_PHOTODETAIL_PDF}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
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
          this.isLoading = false;
          this.snackBar.open('Error in downloading the PDF', 'Close', {
            duration: 2000,
          });
          throw new Error('Error downloading the PDF', err);
        },
      });
  }

  private onReloadPage() {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (paramMap) => {
        const photoDetailData = this.route.snapshot.data['photoDetails'];
        this.id = paramMap.get('id') as string;
        if (!photoDetailData.is_error && photoDetailData.data) {
          this.photoDetails = photoDetailData.data;
          const activeLanguageId = this.commonService.language;
          const artworkDataId =
            photoDetailData.data?.languageData[0]?.id_language;
          if (
            this.photoDetails?.imagesData[0] &&
            this.photoDetails?.imagesData[0].filename.length > 0
          ) {
            const preloadUrl = this.getImageUrl(
              this.commonService.constantsData.IMAGE_SIZES.BOX,
            );
            this.commonService.preloadImage(preloadUrl);
          }
          if (artworkDataId !== activeLanguageId) {
            this.getImageData();
          }
          if (
            this.photoDetails &&
            this.photoDetails.works_tags &&
            this.photoDetails.works_tags.length > 0
          ) {
            this.photoDetails.works_tags.forEach(
              (tagData: authorTag) =>
                (tagData.tag.tags_languages = tagData.tag.tags_languages.filter(
                  (f: { id_language: number; id_tag: number; name: string }) =>
                    f.id_language == this.commonService.language,
                )),
            );
            this.photoDetails.works_tags.sort((tag1, tag2) => {
              const tagName1 =
                tag1.tag.tags_languages[0]?.name?.toLowerCase() || '';
              const tagName2 =
                tag2.tag.tags_languages[0]?.name?.toLowerCase() || '';

              const typeIdComparison = tag1.tag.id_type - tag2.tag.id_type;
              if (typeIdComparison !== 0) {
                return typeIdComparison;
              }

              return tagName1.localeCompare(tagName2);
            });
          }

          if (this.photoDetails && this.photoDetails.id) {
            this.photographerImage = [];
            this.relatedWork(this.photoDetails.id);
          }

          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
          }
        } else {
          this.router.navigate([this.commonService.getRoute('PHOTO_SEARCHER')]);
        }
      });
  }

  relatedWork(id: number) {
    this.workPayload.id = id;
    this.apiService
      .post(`${environment.GET_RELATED_WORK}`, this.workPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.photographerImage = [];
            response.data.works.forEach((element: IRelatedWorkDetails) => {
              this.photographerImage.push({
                id: element.id,
                slug: element.slug,
                title: element.name,
                description: element?.institution?.name,
                author: this.commonService.checkAuthorName(element.author),
                date: this.commonService.checkWorkDate(element.date),
                image: element.works_images?.[0]
                ? element.works_images[0]
                : environment.DEFAULT_IMAGE_PATH,
              });
            });
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  getImageUrl(size: string): string {
    const img = this.photoDetails?.imagesData[0];
    if (!img) {
      return environment.DEFAULT_IMAGE_PATH;
    }
    const baseUrl = environment.IMAGE_URL + environment.WORKS;
    const folderPath =
      img?.extra_folder && img.extra_folder.length > 0
        ? `${img.extra_folder}/${size}/`
        : `${size}/`;

    return `${baseUrl}${folderPath}${img.filename}`;
  }

  getSizes(): string {
    const img = this.photoDetails?.imagesData[0];
    if (!img) return '';

    return `
      (min-width: 1400px) ${img?.width_big}px,
      (min-width: 1200px) ${img?.width_box}px,
      (min-width: 900px) ${img?.width_list}px,
      ${img?.width_thumb}px
    `.trim();
  }

  getSrcSet(): string {
    const img = this.photoDetails?.imagesData[0];
    if (!img) {
      return '';
    }
    return `
      ${this.getImageUrl(this.commonService.constantsData.IMAGE_SIZES.BIG)} ${img?.width_big}w,
      ${this.getImageUrl(this.commonService.constantsData.IMAGE_SIZES.BOX)} ${img?.width_box}w,
      ${this.getImageUrl(this.commonService.constantsData.IMAGE_SIZES.LIST)} ${img?.width_list}w,
      ${this.getImageUrl(this.commonService.constantsData.IMAGE_SIZES.THUMB)} ${img?.width_thumb}w
    `.trim();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    const picture = img.parentElement as HTMLPictureElement;
    if (picture) {
      const sources = picture.getElementsByTagName('source');
      for (let i = 0; i < sources.length; i++) {
        sources[i].srcset = environment.DEFAULT_IMAGE_PATH;
      }
    }

    img.src = environment.DEFAULT_IMAGE_PATH;
    img.srcset = environment.DEFAULT_IMAGE_PATH;
  }

  openDynamicImage(title?: string) {
    const items: { title?: string; src: string }[] = [];
    this.photoDetails?.imagesData.forEach((element) => {
      const path =
        element.extra_folder && element.extra_folder.length > 0
          ? `${this.commonService.environment.WORKS}${element?.extra_folder}/${this.commonService.constantsData.IMAGE_SIZES.BIG}/${element?.filename}`
          : `${this.commonService.environment.WORKS}/${this.commonService.constantsData.IMAGE_SIZES.BIG}/${element?.filename}`;
      items.push({ src: path, title: title });
    });
    this.commonService.openImageViewer(items);
  }

  copyUrlToClipboard(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(currentUrl)
          .then(() => {
            console.log('URL copied to clipboard: ', currentUrl);
          })
          .catch((err) => {
            console.error('Could not copy URL: ', err);
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
    const text = `${this.photoDetails?.name} `;
    const url = window.location.href;
    this.commonService.openShareModal({ title, text, url });
  }

  openDetail(slug: string | undefined) {
    this.router.navigate([
      `${this.commonService.getRoute('PHOTO_SEARCHER')}/${slug}`,
    ]);
  }

  async getImageData() {
    await this.apiService
      .get(`${environment.GET_WORK_DETAIL}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.is_error) {
            this.router.navigate([
              `${this.commonService.getRoute('PHOTO_SEARCHER')}`,
            ]);
          }
          if (response.data && !response.is_error) {
            this.photoDetails = response.data;
            if (
              this.photoDetails &&
              this.photoDetails.works_tags &&
              this.photoDetails.works_tags.length > 0
            ) {
              this.photoDetails.works_tags.forEach(
                (tagData: authorTag) =>
                  (tagData.tag.tags_languages =
                    tagData.tag.tags_languages.filter(
                      (f: {
                        id_language: number;
                        id_tag: number;
                        name: string;
                      }) => f.id_language == this.commonService.language,
                    )),
              );
              this.photoDetails.works_tags.sort((tag1, tag2) => {
                const tagName1 =
                  tag1.tag.tags_languages[0]?.name?.toLowerCase() || '';
                const tagName2 =
                  tag2.tag.tags_languages[0]?.name?.toLowerCase() || '';

                const typeIdComparison = tag1.tag.id_type - tag2.tag.id_type;
                if (typeIdComparison !== 0) {
                  return typeIdComparison;
                }

                return tagName1.localeCompare(tagName2);
              });
            }

            if (this.photoDetails && this.photoDetails.id) {
              this.relatedWork(this.photoDetails.id);
            }
            window.scrollTo(0, 0);
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  checkTechniqueData(techniqueData: workTechnique[]): boolean {
    if (techniqueData && techniqueData.length > 0) {
      return techniqueData.some(
        (f: workTechnique) =>
          f.worksTechniques &&
          f.worksTechniques.works_techniques_languages.length > 0 &&
          f.worksTechniques.works_techniques_languages[0].name,
      );
    }
    return false;
  }

  redirectPhotoListing(optionData: IRedirectOptionData, filterType: string) {
    switch (filterType) {
      case this.commonService.constantsData.WORK_DETAIL_FILTER_TYPES.TAG:
        if (optionData && optionData.tag) {
          this.resetStoreWorksData();
          this.dataStore.photographPageData.filter.type1SelectedTags = [];
          this.dataStore.photographPageData.filter.type2SelectedTags = [];
          this.dataStore.photographPageData.filter.type3SelectedTags = [];
          if (optionData.tag.id_type == 1) {
            this.dataStore.photographPageData.filter.type1SelectedTags.push({
              id: optionData.tag.id,
              name: optionData.tag.tags_languages[0].name,
            });
          } else if (optionData.tag.id_type == 2) {
            this.dataStore.photographPageData.filter.type2SelectedTags.push({
              id: optionData.tag.id,
              name: optionData.tag.tags_languages[0].name,
            });
          } else if (optionData.tag.id_type == 3) {
            this.dataStore.photographPageData.filter.type3SelectedTags.push({
              id: optionData.tag.id,
              name: optionData.tag.tags_languages[0].name,
            });
          }
          this.goToWorkListingPage();
        }
        break;
      case this.commonService.constantsData.WORK_DETAIL_FILTER_TYPES.TECHINIQUE:
        if (
          optionData &&
          optionData.worksTechniques &&
          optionData.worksTechniques.works_techniques_languages.length > 0
        ) {
          this.resetStoreWorksData();
          this.dataStore.photographPageData.filter.selectedTechnique = [];
          this.dataStore.photographPageData.filter.selectedTechnique.push({
            id: optionData.worksTechniques.id,
            name: optionData.worksTechniques.works_techniques_languages[0].name,
          });
          this.goToWorkListingPage();
        }
        break;
      case this.commonService.constantsData.WORK_DETAIL_FILTER_TYPES.LICENSE:
        if (optionData && optionData.works_rights_languages) {
          this.resetStoreWorksData();
          this.dataStore.photographPageData.filter.selectedRights = [];
          this.dataStore.photographPageData.filter.selectedRights.push({
            id: optionData.id,
            name: optionData.works_rights_languages[0].name,
          });
          this.goToWorkListingPage();
        }
        break;
      default:
        break;
    }
  }

  resetStoreWorksData() {
    this.dataStore.photographPageData.limit = constants.LIMIT.TWENTY_FOUR;
    this.dataStore.photographPageData.offset = 0;
    this.dataStore.photographPageData.imageList = [];
  }

  goToWorkListingPage() {
    this.router.navigate([`${this.commonService.getRoute('PHOTO_SEARCHER')}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
    this.commonService.previousPageUrl.next(this.router.url);
  }
}
