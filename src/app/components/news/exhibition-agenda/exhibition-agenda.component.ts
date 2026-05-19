import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import {
  ActivityDetails,
  ILanguageImages,
} from '../../../shared/interfaces/activity';

@Component({
  selector: 'app-exhibition-agenda',
  standalone: true,
  imports: [
    MatIconModule,
    TranslateModule,
    CommonModule,
    TranslateModule,
    MatButtonModule,
    ImageErrorDirective,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinner,
  ],
  templateUrl: './exhibition-agenda.component.html',
  styleUrl: './exhibition-agenda.component.scss',
})
export class ExhibitionAgendaComponent implements OnInit, OnDestroy {
  icons = ESvgIcon;
  private unsubscribe$ = new Subject<void>();
  activityDetails!: ActivityDetails;
  id!: string;
  environment = environment;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public commonService: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit() {
    this.onReloadPage();
  }

  private onReloadPage() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    }
    const activityDetails =
      this.activatedRoute.snapshot.data['activityDetails'];
    if (!activityDetails.is_error && activityDetails.data) {
      this.activityDetails = activityDetails.data;
      this.activityDetails.activities_language_images = this.checkImageData(
        this.activityDetails,
      );
      const activeLanguageId = this.commonService.language;
      const activityDataID =
        activityDetails.data.activities_languages[0].id_language;
      if (activityDataID !== activeLanguageId) {
        this.getActivityData();
      }
      this.activityDetails.activities_language_images = this.checkImageData(
        this.activityDetails,
      );
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    } else {
      this.router.navigate([
        this.commonService.getRoute('CALENDAR_SEARCH_ENGINE'),
      ]);
    }
  }

  openDynamicImage(title?: string) {
    const items: { title?: string; src: string }[] = [];
    this.activityDetails.activities_language_images.forEach(
      (element: { url: string }) => {
        items.push({ src: environment.ACTIVITIES + element.url, title: title });
      },
    );
    this.commonService.openImageViewer(items);
  }

  redirectToSearch() {
    this.router.navigate([
      `${this.commonService.getRoute('CALENDAR_SEARCH_ENGINE')}`,
    ]);
  }

  getActivityData() {
    this.apiService
      .get(`${environment.GET_ACTIVITY_DETAILS}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.activityDetails = response.data;
            this.activityDetails.activities_language_images =
              this.checkImageData(this.activityDetails);
          } else {
            this.commonService.error(response.message);
          }
        },
      });
  }

  checkImageData(element: ActivityDetails) {
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
              (lang) => lang.id_language === this.commonService.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredElement.forEach((imgelement: ILanguageImages) => {
            filteredImages.push(imgelement);
          });
        }
      } else {
        filteredImages.push(element.activities_images[0]);
      }
    }
    return filteredImages;
  }

  downloadPdf() {
    this.isLoading = true;
    this.apiService
      .get(`${environment.DOWNLOAD_EXHIBITIONS}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.data && !response.is_error) {
            const url = `${environment.IMAGE_URL}${environment.PDF}${response.data}`;
            if (isPlatformBrowser(this.platformId)) {
              window.open(url, '_blank');
              const link = document.createElement('a');
              link.download = response.data;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        },
        error: (err) => {
          console.error('Error downloading the PDF', err);
        },
      });
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
    if (isPlatformBrowser(this.platformId)) {
      const title = 'Your Page Title';
      const text = `${this.activityDetails?.organizer} `;
      const url = window.location.href;

      this.commonService.openShareModal({ title, text, url });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
  }
}
