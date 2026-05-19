import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/service/api/api.service';
import { CommonService } from '../../core/service/common/common.service';
import { ImagesWithScrollComponent } from '../../shared/component/images-with-scroll/images-with-scroll.component';
import { AlabernPortalData } from '../../shared/interfaces/alabern-portal';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ImagesWithScrollComponent,
    SanitizeHtmlPipe,
  ],
  templateUrl: './who-we-are.component.html',
  styleUrl: './who-we-are.component.scss',
})
export class WhoWeAreComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  environments = environment;
  imageList: AlabernPortalData[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    public common: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.common.scrollTop();
    this.getAllAuthorsImage();
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
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
  }
}
