import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookiePreferences } from '../../../shared/interfaces/common';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class Cookies {
    private defaultPrefs: CookiePreferences = {
    necessary: true,
    analytics: false,
    multimedia: false,
  };
  private preferencesSubject!: BehaviorSubject<CookiePreferences>;
  private gaTrackingId = 'G-0000000000';
  private analyticsEnabled = false;
  preferences$ = this.preferencesSubject?.asObservable();

  constructor(private localStorage:LocalStorageService,  @Inject(PLATFORM_ID) private platformId: object,) {
    setTimeout(() => {
      const prefs = this.loadPreferences();
      this.preferencesSubject = new BehaviorSubject<CookiePreferences>(prefs);
      this.preferences$ = this.preferencesSubject.asObservable();
      // if(environment.production){
        this.handleAnalytics(prefs);
        this.preferences$.subscribe((updated: CookiePreferences) => {
          this.handleAnalytics(updated);
        });
    // }
    }, 0);
  }

  private loadPreferences(): any {
    const saved = this.localStorage?.getItem('cookiePreferences');
    return saved ? JSON.parse(saved) : this.defaultPrefs;
  }

  getPreferences(): CookiePreferences {
    return this.preferencesSubject.value;
  }

  updatePreferences(prefs: Partial<CookiePreferences>) {
    const updated = { ...this.getPreferences(), ...prefs };
    this.localStorage.setItem('cookiePreferences', JSON.stringify(updated));
    this.preferencesSubject.next(updated);
  }

  // For Google analytics

  private handleAnalytics(prefs: CookiePreferences) {
    if (isPlatformBrowser(this.platformId)) {
      if (prefs.analytics) {
        this.loadGoogleAnalytics();
      } else {
        this.disableGoogleAnalytics()
      }
    }
  }

  private loadGoogleAnalytics() {
    if(isPlatformBrowser(this.platformId)){
      if ((window as any).gtag && this.analyticsEnabled) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
        return;
      }
      this.analyticsEnabled = true;
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () {
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag('js', new Date());
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaTrackingId}`;
      script.onload = () => {
        (window as any).gtag('config', this.gaTrackingId, { anonymize_ip: true });
      };
      document.head.appendChild(script);
    }
  }

  private disableGoogleAnalytics() {
    if(isPlatformBrowser(this.platformId)){
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
       const script = document.querySelector(
        `script[src="https://www.googletagmanager.com/gtag/js?id=${this.gaTrackingId}"]`
      );
      if (script) script.remove();

      if ((window as any).dataLayer) {
        (window as any).dataLayer = [];
      }
      this.analyticsEnabled = false;
    }
  }
}
