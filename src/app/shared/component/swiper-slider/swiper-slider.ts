import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../core/service/common/common.service';
import { IImageData } from '../../interfaces/image';

@Component({
  selector: 'app-swiper-slider',
  imports: [CommonModule],
  templateUrl: './swiper-slider.html',
  styleUrl: './swiper-slider.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SwiperSlider {
  @Input() slides:any;
  @Input() lazyLoad :boolean = false
  @Input() defaultSize: string = this.common.constantsData.IMAGE_SIZES.LIST;
  @Input() customClass: string = '';
  @Input() slideToShow: any = 'auto';
  @Output() detailEvent = new EventEmitter<string>();
  @Output() redirectEvent = new EventEmitter<string>();
  @Input() slickConfig :any = false
  @Input() outerTitle: boolean = false;
  @Input() checkMiddleSlide: boolean = true;
  @Input() showTitle: boolean = true;
  @Input() showThumbnail: boolean = false;
  @Input() outerDescription: boolean = false;
  @Input() slidesPerView: boolean = true;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  swiperInstance: any;
  initialized = false;
  constructor(public common:CommonService){}

  ngAfterViewChecked() {
    const swiperEl: any = this.swiperContainer?.nativeElement;
    if (!swiperEl || !this.slides?.length) return;
    const isVisible = swiperEl.offsetParent !== null;
    if (!isVisible) {
      this.initialized = false;
      return;
    }
    if (!this.initialized) {
      this.initializeSwiper();
      this.initialized = true;
    }
  }

  initializeSwiper() {
    const swiperEl: any = this.swiperContainer?.nativeElement;
    if (!swiperEl || !this.slides?.length) return;

    const config: any = {
      slidesPerView: this.slidesPerView ? 4 : 'auto',
      spaceBetween: 0,
      centeredSlides: true,
      loop: this.slides?.length > 5,
      navigation: false,
      breakpoints: {
          0: {
            slidesPerView: this.slidesPerView ? 'auto' : 'auto',
          },
          768: {
            slidesPerView: this.slidesPerView ? 3.5 : 'auto' ,
          },
          1200: {
            slidesPerView: this.slidesPerView ? 4 : 'auto',
          },
        },
    };

    Object.assign(swiperEl, config);
    swiperEl.initialize();
    this.swiperInstance = swiperEl.swiper;
    const middleIndex = Math.floor(this.slides.length / 2);
    setTimeout(() => {
      if(this.checkMiddleSlide){
        this.swiperInstance.slideToLoop(middleIndex, 0);
        this.swiperInstance.update();
      }
      this.toggleNavigationButtons();
    }, 100);
    this.setupCustomNavigation();
  }

  toggleNavigationButtons() {
    if (!this.swiperInstance) return;

    const swiperWidth = this.swiperInstance.width;
    const slidesWidth = this.swiperInstance.virtualSize;

    const showNav = slidesWidth > swiperWidth;
    const prevBtn = document.querySelector('.nav-btn.prev') as HTMLElement;
    const nextBtn = document.querySelector('.nav-btn.next') as HTMLElement;

    if (prevBtn && nextBtn) {
      prevBtn.style.display = showNav ? 'block' : 'none';
      nextBtn.style.display = showNav ? 'block' : 'none';
    }
  }

  setupCustomNavigation() {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    prevBtn?.addEventListener('click', () => {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev();
      }
    });

    nextBtn?.addEventListener('click', () => {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext();
      }
    });
  }

  getImageUrl(image: IImageData, size: string): string {
    if( image && image?.filename && image.filename.length > 0 && image.filename !== undefined && image.filename !== null) {
      return image?.extra_folder && image.extra_folder.length > 0 ? `${environment.IMAGE_URL}${this.common.environment.WORKS}${image.extra_folder}/${size}/${image.filename}` : `${environment.IMAGE_URL}${this.common.environment.WORKS}${size}/${image.filename}`;
    } else{
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
      ${img.width_thumb}px
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

  getImageDimensions(image: IImageData, size: string) {
    switch (size) {
      case this.common.constantsData.IMAGE_SIZES.BIG:
        return {
          width: image?.width_big,
          height: image?.height_big,
        };
      case this.common.constantsData.IMAGE_SIZES.LIST:
        return {
          width: image?.width_list,
          height: image?.height_list,
        };
      case this.common.constantsData.IMAGE_SIZES.BOX:
        return {
          width: image?.width_box,
          height: image?.height_box,
        };
      case this.common.constantsData.IMAGE_SIZES.THUMB:
        return {
          width: image?.width_thumb,
          height: image?.height_thumb,
        };
      default:
        return {
          width: image?.width_big,
          height: image?.height_big,
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

  detailRedirect(id: string | undefined) {
    this.redirectEvent.emit(id);
  }

  onSlideClick(index: number) {
    if (!this.swiperInstance) return;

    const activeIndex = this.swiperInstance.realIndex;
    const totalSlides = this.slides.length;

    const forwardDistance = (index - activeIndex + totalSlides) % totalSlides;
    const backwardDistance = (activeIndex - index + totalSlides) % totalSlides;

    if (index === activeIndex) {
      const slide = this.slides[index];
      this.detailEvent.emit(slide?.slug);
      this.detailRedirect(slide?.slug);
    } else if (forwardDistance <= backwardDistance) {
      this.swiperInstance.slideToLoop(index);
    } else {
      this.swiperInstance.slideToLoop(index);
    }
  }

}
