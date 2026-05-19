import { isPlatformBrowser, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { environment } from '../environments/environment';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { constants } from './core/enums/constants';
import { ROUTE_PATHS } from './core/enums/routes.enum';
import { ESvgIcon } from './core/enums/svg-icon.enum';
import { CommonService } from './core/service/common/common.service';
import { Cookies } from './core/service/cookies/cookies';
import { IconService } from './core/service/icon/icon.service';
import { LocalStorageService } from './core/service/local-storage/local-storage.service';
import { MetaService } from './core/service/meta/meta.service';
import { VersionCheckService } from './core/service/version-check/version-check.service';
import { CookiesComponent } from './shared/component/cookies/cookies.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SanitizeHtmlPipe } from './shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SplashScreenComponent,
    TranslateModule,
    FooterComponent,
    MatIconModule,
    SanitizeHtmlPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  showsplashScreen = false;
  static isBrowser = new BehaviorSubject<boolean>(false);
  isCookie = false;
  showCookie = true;
  dialogRef: MatDialogRef<CookiesComponent> | null = null;
  environment = environment;
  pageTitle: string = '';
  icons = ESvgIcon;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private storageService: LocalStorageService,
    private iconService: IconService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private common: CommonService,
    private seoService: MetaService,
    private location: Location,
    private dialog: MatDialog,
    private versionCheckService: VersionCheckService,
    private cookieService : Cookies,
    private localStorage : LocalStorageService
  ) {
    this.iconService.registerIcons();
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    this.common.setDefaultLangData();
    const currentPath = this.location.path();
    if (currentPath) {
      const currentLanguagePath =
        currentPath.split('/')[1] || ROUTE_PATHS['ca']['LANGUAGE'];
      if (currentLanguagePath) {
        const numLang = constants.LANGUAGE_LIST[currentLanguagePath]
          ? constants.LANGUAGE_LIST[currentLanguagePath]
          : 2;
       if (isPlatformBrowser(platformId)) {
          this.common.getLanguageWiseMetaData();
        }
        this.common.switchLanguages(numLang);
      }
    } else {
      // not found path then set default ca language
      if (isPlatformBrowser(platformId)) {
        this.common.getLanguageWiseMetaData();
      }
      this.common.switchLanguages(constants.DEFAULT_LANGUAGE);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('contextmenu', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'img') {
          event.preventDefault();
        }
      });
    }
  }

  ngOnInit(): void {
    // this.common.initializeLanguage();
    if (isPlatformBrowser(this.platformId)) {
      this.checkSplashScreen();
      const cookieItem = this.storageService.getItem('cookie');
      this.isCookie = cookieItem ? JSON.parse(cookieItem) : false;

      this.versionCheckService.startVersionCheck();
    }

    this.seoService.init();

    this.seoService.title$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((title) => {
        if (title) this.pageTitle = title;
      });
  }

  checkSplashScreen() {
    // all conditions for splash screen
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;
        if (currentRoute == '/' || currentRoute.split('/').length <= 2) {
          const splashScreen =
            await this.storageService.shouldShowSplashScreen();
          if (splashScreen) {
            this.showsplashScreen = true;
            this.loading = false;
          } else {
            this.stoploading();
          }
        } else {
          this.stoploading();
        }
      } else {
        this.stoploading();
      }
    });
  }

  openCookiePopup() {
    if (this.dialogRef) {
      return;
    }
    this.dialogRef = this.dialog.open(CookiesComponent, {
      maxWidth: '850px',
      width: '90%',
      panelClass: ['preferences_cookie_dialog'],
    });
    this.showCookie = false;
    this.dialogRef.afterClosed().subscribe((r: boolean) => {
      this.dialogRef = null;
      if (r) {
        this.isCookie = true;
      } else {
        this.showCookie = true;
      }
    });
  }

  stoploading() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  splasHideEvent(event: boolean) {
    this.storageService.setShowSplashScreen(false);
    this.showsplashScreen = event;
  }

  acceptAll() {
    this.cookieService.updatePreferences({
      analytics: true,
      multimedia: true,
    });
    this.localStorage.setItem('cookie', JSON.stringify(true));
    this.showCookie = false;
    this.isCookie = true;
  }

  rejectAll() {
    this.cookieService.updatePreferences({
      analytics: false,
      multimedia: false,
    });
    this.localStorage.setItem('cookie', JSON.stringify(true));
    this.showCookie = false;
    this.isCookie = true;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
