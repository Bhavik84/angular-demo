import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { CommonService } from '../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../directives/imge-error/image-error.directive';
import { ScrollDirective } from '../../directives/scroll/scroll.directive';
import { AlabernPortalData } from '../../interfaces/alabern-portal';
import { IImageData } from '../../interfaces/image';

@Component({
  selector: 'app-images-with-scroll',
  standalone: true,
  imports: [CommonModule, MatIconModule, ScrollDirective],
  templateUrl: './images-with-scroll.component.html',
  styleUrl: './images-with-scroll.component.scss',
})
export class ImagesWithScrollComponent implements OnInit {
  @Input() imageList: AlabernPortalData[] = [];
  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;
  browserName: string = 'Unknown';
  icons = ESvgIcon;
  environments = environment;

  constructor(
    public common: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getBrowserName();
      this.ScrollSync();
    }
  }

  getBrowserName(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userAgent = navigator.userAgent;

      if (userAgent.indexOf('Firefox') > -1) {
        this.browserName = 'Firefox';
      } else if (userAgent.indexOf('SamsungBrowser') > -1) {
        this.browserName = 'Samsung Internet';
      } else if (
        userAgent.indexOf('Opera') > -1 ||
        userAgent.indexOf('OPR') > -1
      ) {
        this.browserName = 'Opera';
      } else if (userAgent.indexOf('Trident') > -1) {
        this.browserName = 'Internet Explorer';
      } else if (userAgent.indexOf('Edge') > -1) {
        this.browserName = 'Microsoft Edge';
      } else if (userAgent.indexOf('Chrome') > -1) {
        this.browserName = 'Chrome';
      } else if (userAgent.indexOf('Safari') > -1) {
        this.browserName = 'Safari';
      }
    }
  }

  ScrollSync(): void {
    if (isPlatformBrowser(this.platformId)) {
      const imagesDiv = document.getElementById('images-div') as HTMLElement;
      const scrollDiv = document.getElementById('scroll-div') as HTMLElement;
      const placeholder = document.createElement('div');

      // Set the width of the placeholder to match the scroll width of the images div
      placeholder.style.width = imagesDiv.scrollWidth + 'px';
      placeholder.className = 'placeholder';
      scrollDiv.appendChild(placeholder);

      // Handle scroll synchronization
      let isScrolling = false;

      scrollDiv.addEventListener('scroll', () => {
        if (!isScrolling) {
          isScrolling = true;
          const scrollPercentage =
            scrollDiv.scrollLeft /
            (scrollDiv.scrollWidth - scrollDiv.clientWidth);
          const scrollPosition =
            scrollPercentage * (imagesDiv.scrollWidth - imagesDiv.clientWidth);
          imagesDiv.scrollLeft = Math.round(scrollPosition);
          isScrolling = false;
        }
      });

      imagesDiv.addEventListener('scroll', () => {
        if (!isScrolling) {
          isScrolling = true;
          const scrollPercentage =
            imagesDiv.scrollLeft /
            (imagesDiv.scrollWidth - imagesDiv.clientWidth);
          const scrollPosition =
            scrollPercentage * (scrollDiv.scrollWidth - scrollDiv.clientWidth);
          scrollDiv.scrollLeft = Math.round(scrollPosition);
          isScrolling = false;
        }
      });
    }
  }

  getImageUrl(image: IImageData, size: string): string {
    if (
      image &&
      image?.filename &&
      image.filename.length > 0 &&
      image.filename !== undefined &&
      image.filename !== null
    ) {
      return image?.extra_folder && image.extra_folder.length > 0
        ? `${environment.IMAGE_URL}${this.common.environment.WORKS}${image.extra_folder}/${size}/${image.filename}`
        : `${environment.IMAGE_URL}${this.common.environment.WORKS}${size}/${image.filename}`;
    } else {
      return environment.DEFAULT_IMAGE_PATH;
    }
  }

  getSizes(img: IImageData): string {
    if (
      img?.width_big === null &&
      img?.width_box === null &&
      img?.width_list === null &&
      img?.width_thumb === null
    ) {
      return '';
    }
    return `
      (min-width: 1400px) ${img?.width_big}px,
      (min-width: 1200px) ${img?.width_box}px,
      (min-width: 900px) ${img?.width_list}px,
      ${img?.width_thumb}px
    `.trim();
  }

  getSrcSet(img: IImageData): string {
    if (
      img?.width_big === null &&
      img?.width_box === null &&
      img?.width_list === null &&
      img?.width_thumb === null
    ) {
      return `
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.BIG)}
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.BOX)}
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.LIST)}
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.THUMB)}
    `.trim();
    }
    return `
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.BIG)} ${img?.width_big}w,
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.BOX)} ${img?.width_box}w,
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.LIST)} ${img?.width_list}w,
      ${this.getImageUrl(img, this.common.constantsData.IMAGE_SIZES.THUMB)} ${img?.width_thumb}w
    `.trim();
  }


  getImageDimensions(image: IImageData, size:string) {
    switch (size) {
      case this.common.constantsData.IMAGE_SIZES.BIG:
        return {
          width: image.width_big,
          height: image.height_big,
        };
      case this.common.constantsData.IMAGE_SIZES.LIST:
        return {
          width: image.width_list,
          height: image.height_list,
        };
      case this.common.constantsData.IMAGE_SIZES.BOX:
        return {
          width: image.width_box,
          height: image.height_box,
        };
      case this.common.constantsData.IMAGE_SIZES.THUMB:
        return {
          width: image.width_thumb,
          height: image.height_thumb,
        };
      default:
        return {
          width: image.width_big,
          height: image.height_big,
        };
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    const picture = img.parentElement as HTMLPictureElement;
    if (picture) {
      const sources = picture.getElementsByTagName('source');
      for (let i = 0; i < sources.length; i++) {
        sources[i].srcset = environment.DEFAULT_IMAGE_PATH;
      }
    }

    img.src = environment.DEFAULT_IMAGE_PATH;
    img.srcset = environment.DEFAULT_IMAGE_PATH;
  }
}
