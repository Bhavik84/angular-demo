import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ESvgIcon } from '../../core/enums/svg-icon.enum';
import { ISocialShare } from '../interfaces/common';

@Component({
  selector: 'app-social-share',
  standalone: true,
  imports: [MatIconModule, TranslateModule, MatDialogClose],
  templateUrl: './social-share.component.html',
  styleUrl: './social-share.component.scss',
})
export class SocialShareComponent {
  icons = ESvgIcon;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ISocialShare) {}

  shareData(type: string) {
    let url: string = '';
    switch (type) {
      case 'Facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${this.data.url}`;
        break;
      case 'Whatsapp':
        url = `https://wa.me/?text=${this.data.url}`;
        break;
      case 'Twitter':
        url = `https://twitter.com/intent/tweet?text=${this.data.url}`;
        break;
      case 'Email':
        url = `mailto:?subject=${this.data.title}&body=${this.data.title} ${this.data.text}link:${this.data.url}`;
        break;
      // case 'Instgram':
      //   const instaMessage = `Check this out: ${this.data.url}`;
      // const encodedMessage = encodeURIComponent(instaMessage);
      //   url = `https://www.instagram.com/create/story/?caption=${encodedMessage}`;
      //   break;
      default:
        break;
    }
    window.open(url);
  }
}
