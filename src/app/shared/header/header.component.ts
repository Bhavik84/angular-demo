import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { constants } from '../../core/enums/constants';
import { ROUTE_PATHS } from '../../core/enums/routes.enum';
import { ESvgIcon } from '../../core/enums/svg-icon.enum';
import { ApiService } from '../../core/service/api/api.service';
import { CommonService } from '../../core/service/common/common.service';
import { DataStoreService } from '../../core/service/DataStore/data-store.service';
import { LocalStorageService } from '../../core/service/local-storage/local-storage.service';

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() showmenu = true;
  private unsubscribe$ = new Subject<void>();
  // language: number = constants.DEFAULT_LANGUAGE;
  showVerticleMenu = false;
  environment = environment;
  activeItem: string | null = null;
  increased: boolean = false;
  increment: number = 0;
  incrementFont: number = 3;
  decrementFont: number = -3;
  icons = ESvgIcon;
  selectLanguage: number;
  langArray: {
    alias: string;
    id_language: number;
    name: string;
  }[] = [];
  mode: 'dark' | 'light' = 'light';
  darkMode$!: Observable<boolean>;
  constructor(
    public commonService: CommonService,
    private localStorage: LocalStorageService,
    @Inject(DOCUMENT) public document: Document,
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object, // Detects SSR vs. browser
    private breakpointObserver: BreakpointObserver,
    private dataStoreService: DataStoreService,
  ) {
    this.selectLanguage = this.commonService.language;
  }

  ngOnInit(): void {
    this.getAllLanguages();
    this.initializeTheme();
  }

  changeFontSize(size: number) {
    this.increment = size;
    this.updateFontSizes();
  }
  onLanguageChange() {
    this.commonService.switchLanguages(this.selectLanguage);
  }

  updateFontSizes() {
    if (isPlatformBrowser(this.platformId)) {
      this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe((result) => {
          const sizesToUpdate = result.matches
            ? constants.SIZE_OF_MOBILE
            : constants.SIZE_OF_WEB;
          sizesToUpdate.forEach((size: { key: number; value: number }) => {
            document.documentElement.style.setProperty(
              `--base-font-${size.key}`,
              `${this.calculateSize(size.value)}px`,
            );
          });
        });
    }
  }

  toggleMode2(): void {
    this.mode =
      this.mode === this.commonService.constantsData.WEB_MODE.DARK
        ? this.commonService.constantsData.WEB_MODE.LIGHT
        : this.commonService.constantsData.WEB_MODE.DARK;
    this.updateBodyClass();
  }

  private updateBodyClass(): void {
    const body = this.document.body;
    body.classList.toggle(
      'dark-mode',
      this.mode === this.commonService.constantsData.WEB_MODE.DARK,
    );
    this.localStorage.setItem('theme', this.mode);
  }

  private initializeTheme(): void {
    const savedTheme = this.localStorage.getItem('theme') as 'dark' | 'light';
    this.mode = savedTheme || 'light';
    this.updateBodyClass();
  }

  calculateSize(size: number): number {
    const increment = this.increment;
    return size + increment;
  }

  hideVerticalMenu() {
    this.showVerticleMenu = false;
  }

  setActive(item: string) {
    this.showVerticleMenu = false;
    this.activeItem = item;
    const route = ROUTE_PATHS[this.commonService.activeLanguage][item];
    const currentUrlSegment = this.router.url.split('/').pop();
    if (route != currentUrlSegment) {
      this.dataStoreService.resetScrollIdByPage(item);
    }
  }

  getAllLanguages() {
    this.apiService
      .get(`${environment.GET_ALL_LANGUAGES}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response && !response.is_error && response.data) {
            this.langArray = this.commonService.sortLanguages(response.data);
            this.localStorage.setItem('langArr', JSON.stringify(response.data));
            this.selectLanguage = this.commonService.language;
          }
        },
        error: (error) => {
          console.log('error: ', error);
        },
      });
  }

  isActiveProjectMenu(): boolean {
    const url = this.router.url;
    return (
      url.includes(this.commonService.getRoute('PROJECT')) ||
      url.includes(this.commonService.getRoute('NEW_ACQUISITIONS')) ||
      url.includes(this.commonService.getRoute('PHOTOGRAPHY_PLAN')) ||
      url.includes(this.commonService.getRoute('PHOTOGRAPHER_LIST'))
    );
  }

  isActiveCollectionMenu(): boolean {
    const url = this.router.url;
    return (
      url.includes(this.commonService.getRoute('PHOTO_SEARCHER')) ||
      url.includes(this.commonService.getRoute('PHOTOGRAPHER_SEARCHER')) ||
      url.includes(this.commonService.getRoute('BACKGROUND_SEARCHER')) ||
      url.includes(this.commonService.getRoute('INSTITUTION_SEARCHER'))
    );
  }

  isActiveResearchMenu() {
    const url = this.router.url;
    return (
      url.includes(this.commonService.getRoute('RESEARCH')) ||
      url.includes(this.commonService.getRoute('GLOSSARI'))
    );
  }

  isActiveNewsMenu() {
    const url = this.router.url;
    return (
      url.includes(this.commonService.getRoute('CALENDAR_SEARCH_ENGINE')) ||
      url.includes(this.commonService.getRoute('BLOG')) ||
      url.includes(this.commonService.getRoute('BEHIND_THE_CAMERA'))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
