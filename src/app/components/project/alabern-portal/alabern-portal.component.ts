import { isPlatformBrowser } from '@angular/common';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { ImagesWithScrollComponent } from '../../../shared/component/images-with-scroll/images-with-scroll.component';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { AlabernPortalData } from '../../../shared/interfaces/alabern-portal';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-alabern-portal',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ImagesWithScrollComponent,
    SanitizeHtmlPipe,
  ],
  templateUrl: './alabern-portal.component.html',
  styleUrl: './alabern-portal.component.scss',
})
export class AlabernPortalComponent implements OnInit, OnDestroy {
  imageList: AlabernPortalData[] = [];
  private unsubscribe$ = new Subject<void>();
  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;

  constructor(
    private apiService: ApiService,
    public common: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.getAllAuthorsImage();
    this.common.scrollTop();
  }

  initializeData() {
    this.imageList = [];
  }

  getAllAuthorsImage() {
    this.apiService
      .get(`${environment.GET_RANDOM_WORK}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.imageList = response.data;
          } else {
            this.common.error(response.message);
          }
        },
      });
  }
  openInNewTab() {
    if (isPlatformBrowser(this.platformId)) {
      const url = '/' + this.common.getRoute('PHOTOGRAPHER_LIST');
      window.open(url);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
  }
}
