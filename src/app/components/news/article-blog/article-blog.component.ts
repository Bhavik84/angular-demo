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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NestedEllipsisDirective } from 'ngx-nested-ellipsis';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { InputRestrictionsDirective } from '../../../shared/directives/input-restrictions/input-restrictions.directive';
import {
  ArticleDetailRes,
  ArticleDetails,
  IArticle,
  ILanguageImage,
  INeighbourArticle
} from '../../../shared/interfaces/article-blog';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-article-blog',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ImageErrorDirective,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    InputRestrictionsDirective,
    SanitizeHtmlPipe,
    NestedEllipsisDirective,
  ],
  templateUrl: './article-blog.component.html',
  styleUrl: './article-blog.component.scss',
})
export class ArticleBlogComponent implements OnInit, OnDestroy {
  environment = environment;
  id!: string;
  articleData!: ArticleDetails;
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean = false;
  icons = ESvgIcon;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  nextArticleData!: IArticle;
  previousArticleData!: IArticle;
  commentForm!: FormGroup;
  articleId!: number;
  isSubmit = false;
  commentBatchSize = 2;
  visibleCommentCount = 2;
  @ViewChild('commentList') commentList!: ElementRef<HTMLDivElement>;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit() {
    this.commonService.addRecaptchaScript();
    this.commentForm = this.fb.group({
      user: ['', [Validators.required, Validators.maxLength(100)]],
      comment: ['', [Validators.required, Validators.maxLength(2000)]],
      id_article: [''],
    });

    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (paramMap) => {
        this.id = paramMap.get('id') as string;
        const articleData = this.route.snapshot.data['articleDetails'];
        if (!articleData.is_error && articleData.data) {
          this.articleData = articleData.data;
          this.articleData.article_language_images = this.checkImageData(
            this.articleData,
          );
          this.articleId = this.articleData.id;
          const activeLanguageId = this.commonService.language;
          const artworkDataId =
            articleData.data.articles_languages &&
            articleData.data.articles_languages.length > 0
              ? articleData.data.articles_languages[0]?.id_language
              : '';
          if (artworkDataId !== activeLanguageId) {
            this.getArticalData();
          }
          this.getNeighbourArticle();
          this.commentForm.controls['id_article'].patchValue(this.articleId);

          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
          }
          this.isLoading = false;
        } else {
          this.router.navigate([this.commonService.getRoute('BLOG')]);
        }
      });
  }

  getArticalData() {
    this.isLoading = true;
    this.apiService
      .get(`${environment.GET_ARTICAL}/${this.id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ArticleDetailRes) => {
          if (response.data && !response.is_error) {
            if (!response.is_error) {
              this.articleData = response.data;
              this.articleData.article_language_images = this.checkImageData(
                this.articleData,
              );
              this.articleId = this.articleData.id;
              this.commentForm.controls['id_article'].patchValue(
                this.articleId,
              );
            } else {
              this.commonService.success(response.message);
              this.router.navigate([this.commonService.getRoute('BLOG')]);
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.commonService.error(response.message);
          }
        },
      });
  }

  getNeighbourArticle() {
    this.isLoading = true;
    this.apiService
    .get(`${environment.GET_NEIGHBOUR_ARTICLE}${this.id}`)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe({
        next: (response: INeighbourArticle) => {
          if (!response.is_error) {
            if (!response.is_error) {
              this.nextArticleData = response.data.nextArticle;
              this.previousArticleData = response.data.previousArticle;
            }
          }

          this.isLoading = false;
        },
      });
  }

  checkImageData(element: ArticleDetails) {
    const filteredImages: ILanguageImage[] = [];
    if (element.articles_images && element.articles_images.length > 0) {
      const imagesWithLanguages = element.articles_images?.some(
        (img: ILanguageImage) =>
          img.articles_images_languages &&
          img.articles_images_languages.length > 0,
      );
      if (imagesWithLanguages) {
        const filteredElement = element?.articles_images?.filter(
          (img: ILanguageImage) =>
            img.articles_images_languages?.some(
              (lang) => lang.id_language === this.commonService.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredElement.forEach((imgelement: ILanguageImage) => {
            filteredImages.push(imgelement);
          });
        }
      } else {
        filteredImages.push(element.articles_images[0]);
      }
    }
    return filteredImages;
  }

  openDynamicImage(title?: string) {
    const items: { title?: string; src: string }[] = [];
    this.articleData.article_language_images.forEach((element:ILanguageImage) => {
      items.push({ src: environment.ARTICLES + element.url, title: title });
    });
    this.commonService.openImageViewer(items);
  }

  doOpenNextArticle(slug: string) {
    this.router.navigate([`/${this.commonService.getRoute('BLOG')}/${slug}`]);
  }

  getLanguagerId(lang: string) {
    const langList = ['ita', 'cat', 'en', 'dut'];
    const langId = langList.indexOf(lang);
    return langId;
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
    const text = `${this.articleData?.category} `;
    const url = window.location.href;
    this.commonService.openShareModal({ title, text, url });
  }

  get visibleComments() {
    return (
      this.articleData?.articles_comments?.slice(0, this.visibleCommentCount) ||
      []
    );
  }

  showMoreComments(): void {
    this.visibleCommentCount += this.commentBatchSize;
  }

  sendComment() {
    grecaptcha
      .execute(environment.RECAPTCHA_V3_KEY, { action: 'submit' })
      .then((token) => {
        this.isSubmit = true;
        if (this.commentForm.valid) {
          this.isLoading = true;
          this.commentForm;
          const payload = {
            ...this.commentForm.value,
            token,
          };
          this.apiService
            .post(`${environment.SEND_FEEDBACK}`, payload)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: () => {
                this.isLoading = false;
                this.isSubmit = false;
                this.commentForm.controls['id_article'].patchValue(
                  this.articleId,
                );
                this.commentForm.reset();
                this.getArticalData();
                setTimeout(() => {
                  if (this.commentList?.nativeElement) {
                    this.commentList.nativeElement.scrollTop = 0;
                  }
                }, 100);
              },
              error: () => {
                this.isLoading = false;
              },
            });
        } else {
          this.commentForm.markAllAsTouched();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
    this.commonService.removeRecaptchScript();
  }
}
