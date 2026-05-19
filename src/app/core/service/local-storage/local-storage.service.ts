import { Injectable } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { constants } from '../../enums/constants';

class LocalStorage implements Storage {
  [name: string]: unknown;
  readonly length: number = 0; // Initialize length
  clear(): void {}
  getItem(): string | null {
    return null;
  }
  key(): string | null {
    return null;
  }
  removeItem(): void {}
  setItem(): void {}
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storage: Storage;

  [name: string]: unknown;

  length: number | undefined;

  private showKey = constants.SHOW_SPLASH_SCREEN;
  private expiryKey = constants.SPLASH_SCREEN_EXPIRY;

  constructor() {
    this.storage = new LocalStorage();
    AppComponent.isBrowser.subscribe((isBrowser) => {
      if (isBrowser) {
        this.storage = localStorage;
      }
    });
  }

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }

  setShowSplashScreen(value: boolean): void {
    this.storage.setItem(this.showKey, JSON.stringify(value));
    const expirationTime = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    this.storage.setItem(this.expiryKey, expirationTime.toString());
  }

  async shouldShowSplashScreen() {
    const showSplashScreen = await this.storage.getItem(this.showKey);
    const expiryTime = await this.storage.getItem(this.expiryKey);

    if (
      !showSplashScreen ||
      !expiryTime ||
      this.hasExpired(parseInt(expiryTime))
    ) {
      this.setShowSplashScreen(true);
      return true;
    }
    return JSON.parse(showSplashScreen);
  }

  private hasExpired(expiryTime: number): boolean {
    return new Date().getTime() > expiryTime;
  }
}
