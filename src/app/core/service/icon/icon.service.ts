import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ESvgIcon } from '../../enums/svg-icon.enum';

export const ICONS = 'assets/svg-icons';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {}

  public icons: Set<ESvgIcon> = new Set([
    ESvgIcon.TWITTER,
    ESvgIcon.FACEBOOK,
    ESvgIcon.INSTAGRAM,
    ESvgIcon.WHATSAPP,
    ESvgIcon.FONT_ICON,
    ESvgIcon.SCROLL_LEFT,
    ESvgIcon.SCROLL_RIGHT,
    ESvgIcon.FILTER,
    ESvgIcon.SEARCH,
    ESvgIcon.SORTICON,
    ESvgIcon.SORT,
    ESvgIcon.DOWNLOAD,
    ESvgIcon.SHARE,
    ESvgIcon.SHARE_BLACK,
    ESvgIcon.ATTATCHMENT,
    ESvgIcon.ATTATCHMENT_BLACK,
    ESvgIcon.CAMERA,
    ESvgIcon.GALLERY,
    ESvgIcon.PEOPLE,
    ESvgIcon.PHONE_NUMBER,
    ESvgIcon.LOCATION,
    ESvgIcon.WEB,
    ESvgIcon.WORK_OF_AUTHOR,
    ESvgIcon.ONGOING_ACTIVITIES,
    ESvgIcon.PAST_ACTIVITIES,
    ESvgIcon.PREVIOUS_ARROW,
    ESvgIcon.NEXT_ARROW,
    ESvgIcon.ADDRESS,
    ESvgIcon.PHONE,
    ESvgIcon.AUTHOR_LINK,
    ESvgIcon.MAIL,
    ESvgIcon.DARK_MODE,
    ESvgIcon.LANGUAGE,
    ESvgIcon.EARTH,
    ESvgIcon.FACEBOOK_SHARE,
    ESvgIcon.WHATSAPP_SHARE,
    ESvgIcon.TWITTER_SHARE,
    ESvgIcon.EMAIL_SHARE,
    ESvgIcon.INSTGRAM_SHARE,
    ESvgIcon.COOKIES,
    ESvgIcon.FONT_SIZE,
    ESvgIcon.COOKIE_BTN,
    ESvgIcon.CLOSE_BTN,
  ]);

  public registerIcons(): void {
    this.icons.forEach((key) => {
      this.matIconRegistry.addSvgIcon(
        key,
        this.sanitizer.bypassSecurityTrustResourceUrl(`${ICONS}/${key}.svg`),
      );
    });
  }
}
