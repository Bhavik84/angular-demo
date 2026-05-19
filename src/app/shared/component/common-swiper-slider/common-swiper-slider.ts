import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../directives/imge-error/image-error.directive';

@Component({
  selector: 'app-common-swiper-slider',
  imports: [CommonModule,ImageErrorDirective],
  templateUrl: './common-swiper-slider.html',
  styleUrl: './common-swiper-slider.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonSwiperSlider {
  @Input() slides:any;
  @Input() lazyLoad :boolean = false
  @Input() customClass: string = '';
  @Output() detailEvent = new EventEmitter<string>();
  @Output() redirectEvent = new EventEmitter<string>();
  @Input() outerTitle: boolean = false;
  @Input() enableAutoplay: boolean = false;
  @Input() showTitle: boolean = true;
  @Input() outerDescription: boolean = false;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;
  initialized = false;
  swiperInstance: any;
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
      slidesPerView: 4,
      spaceBetween: 0,
      centeredSlides: true,
      loop: this.slides?.length > 5,
      navigation: false,
        breakpoints: {
          0: {
            slidesPerView: 'auto',
          },
          768: {
            slidesPerView: 3.5,
          },
          1200: {
            slidesPerView: 4,
          },
        },
      }

    if (this.enableAutoplay) {
      config.autoplay = {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      };
    }

    Object.assign(swiperEl, config);
    swiperEl.initialize();
    this.swiperInstance = swiperEl.swiper;
    const middleIndex = Math.floor(this.slides.length / 2);
    setTimeout(() => {
      this.swiperInstance.slideToLoop(middleIndex, 0);
      this.swiperInstance.update();
      this.toggleNavigationButtons();
    }, 500);
    this.setupCustomNavigation();
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
      this.detailRedirect(slide?.slug);
    } else if (forwardDistance <= backwardDistance) {
      this.swiperInstance.slideToLoop(index);
    } else {
      this.swiperInstance.slideToLoop(index);
    }
  }
}
