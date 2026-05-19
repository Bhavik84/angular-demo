import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
} from '@angular/core';
import { environment } from '../../../../environments/environment';

@Directive({
  selector: '[appImageError]',
  standalone: true,
})
export class ImageErrorDirective implements OnChanges {
  @Input() imageName?: string;
  @Input() path!: string;
  @Input() isThumbnail: boolean = false;
  base64 = 'data:';

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnChanges() {
    if (this.imageName && this.imageName.startsWith(this.base64))
      this.el.nativeElement.src = this.imageName;
    else if (this.imageName) {
      let imageUrl = '';
      if (this.imageName == null || this.imageName == '') {
        imageUrl = '../assets/images/No-Image-Placeholder.png';
      } else if (this.path == undefined && this.imageName) {
        imageUrl = environment.IMAGE_URL + this.imageName;
      } else {
        imageUrl =
          environment.IMAGE_URL +
          (this.path ? this.path : environment.AUTHORS) +
          this.imageName;
      }

      if (this.isThumbnail) {
        const PROXY_URL =
          environment.IMAGE_URL_PROXY + `${encodeURIComponent(imageUrl)}`;
        this.optimizeImage(PROXY_URL)
          .then((optimizedUrl) => {
            this.el.nativeElement.src = optimizedUrl;
          })
          .catch(() => {
            this.el.nativeElement.src =
              '../assets/images/No-Image-Placeholder.png';
          });
      } else {
        this.el.nativeElement.src = imageUrl;
      }
    } else this.el.nativeElement.src = environment.DEFAULT_IMAGE_PATH;
  }

  errorHandle(event: Event) {
    (event.target as HTMLImageElement).src =
      '../assets/images/No-Image-Placeholder.png';
  }

  async optimizeImage(url: string): Promise<string> {
    const img = await this.loadImage(url);
    const dataUrl = await this.generateThumbnail(img, 500); // Generate thumbnail with a max width of 500px
    return dataUrl;
  }

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  }

  generateThumbnail(img: HTMLImageElement, maxWidth: number): Promise<string> {
    return new Promise((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const aspectRatio = img.width / img.height;
        const width = Math.min(maxWidth, img.width);
        const height = width / aspectRatio;

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // Compress to JPEG format, quality 0.8 (80%)
        } else {
          resolve('');
        }
      } else {
        resolve('');
      }
    });
  }
}
