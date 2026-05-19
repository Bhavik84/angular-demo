import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { exhibition } from '../../../shared/interfaces/exhibition';
import { Image } from '../../../shared/interfaces/image';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-virtual-exhibition',
  standalone: true,
  imports: [
    TranslateModule,
    MatProgressSpinner,
    MatIcon,
    MatCardModule,
    ImageErrorDirective,
    SanitizeHtmlPipe,
  ],
  templateUrl: './virtual-exhibition.component.html',
  styleUrl: './virtual-exhibition.component.scss',
})
export class VirtualExhibitionComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  totalCount!: number;
  imageList: Image[] = [];
  payload = {
    limit: constants.LIMIT.TWENTY_FOUR,
    offset: 0,
    search: '',
    sortBy: constants.SORT_BY.DESC,
  };
  environment = environment;
  private unsubscribe$ = new Subject<void>();
  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;
  constructor(
    private apiService: ApiService,
    public common: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit() {
    this.getAllExhibitions();
    this.scrollTop();
  }

  async getAllExhibitions() {
    this.isLoading = true;

    this.apiService
      .post(`${environment.GET_ALL_EXHIBITION}`, this.payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data.exhibitions.length === 0) {
            this.isLoading = false;
          }
          if (response.data && !response.is_error) {
            this.totalCount = response.data.totalCount;
            response.data.exhibitions.forEach((element: exhibition) => {
              this.imageList.push({
                id: element.id,
                slug: element.slug,
                title: element.name,
                organitzation: element.organitzation,
                description: element.exhibitions_languages
                  ? element.exhibitions_languages[0]?.description
                  : '',
                image: element?.images[0]?.url_imagen,
                initial_date: this.common.formatDateTo(element.initial_date),
                final_date: this.common.formatDateTo(element.final_date),
              });
            });

            this.isLoading = false;
          } else {
            this.common.error(response.message);
          }
        },
      });
  }

  redirectToDetailPage(slug?: string) {
    if (isPlatformBrowser(this.platformId) && slug) {
      window.open(environment.VIRTUAL_EXHIBITION_URL + '/' + slug, '_blank');
    }
  }

  showMore() {
    this.isLoading = true;
    this.payload.offset = this.payload.offset + constants.LIMIT.TWENTY_FOUR;
    this.getAllExhibitions();
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
