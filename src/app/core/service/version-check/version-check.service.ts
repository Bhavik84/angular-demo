import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, interval } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  private versionUrl = environment.API_END_POINT + 'api/common/getVersionFile'; // Path to version file
  private checkInterval = 10000;

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
    private localStorage: LocalStorageService,
  ) {}

  async checkVersion() {
    // Ensure this runs only in the browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      const timestamp = new Date().getTime();
      const response = await firstValueFrom(
        this.http.get<{ version: string }>(`${this.versionUrl}?t=${timestamp}`),
      );
      const currentVersion = this.localStorage.getItem('app_version');
      if (currentVersion && currentVersion !== response.version) {
        this.promptUserToReload(response.version);
      }

      if (!currentVersion) {
        this.localStorage.setItem('app_version', response.version);
      }
    } catch (error) {
      console.error('Version check failed', error);
    }
  }

  startVersionCheck() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkVersion(); // Initial check
      interval(this.checkInterval).subscribe(() => this.checkVersion());
    }
  }

  promptUserToReload(newVersion: string) {
    if (confirm(this.translate.instant('COMMON.VERSION_UPDATE_MESSAGE'))) {
      this.localStorage.setItem('app_version', newVersion);
      window.location.reload();
    }
  }
}
