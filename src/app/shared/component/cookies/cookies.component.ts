import { Component } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { Cookies } from '../../../core/service/cookies/cookies';
import { LocalStorageService } from '../../../core/service/local-storage/local-storage.service';
import { CookiePreferences } from '../../interfaces/common';
import { SanitizeHtmlPipe } from '../../pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatDialogClose,
    SanitizeHtmlPipe,
    TranslateModule,
  ],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
})
export class CookiesComponent {
  panelOpenState: boolean = false;
  icons = ESvgIcon;
  prefs!: CookiePreferences;
  constructor(
    private storageService: LocalStorageService,
    private dialogRef: MatDialogRef<CookiesComponent>,
    private cookieService : Cookies
  ) {
    this.prefs = this.cookieService.getPreferences();
  }

  acceptCookies() {
    this.storageService.setItem('cookie', JSON.stringify(true));
    this.dialogRef.close(true);
  }


  onToggle(type: keyof CookiePreferences, value: boolean) {
    this.prefs = { ...this.prefs, [type]: value };
  }

  acceptAll() {
    this.cookieService.updatePreferences({
      analytics: true,
      multimedia: true,
    });
    this.storageService.setItem('cookie', JSON.stringify(true));
    this.dialogRef.close(true);
  }

  rejectAll(){
    this.cookieService.updatePreferences({
      analytics: false,
      multimedia: false,
    });
    this.storageService.setItem('cookie', JSON.stringify(true));
    this.dialogRef.close(true);
  }

  savePreferences() {
    this.cookieService.updatePreferences(this.prefs);
    this.storageService.setItem('cookie', JSON.stringify(true));
    this.dialogRef.close(true);
  }
}
