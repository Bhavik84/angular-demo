import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from '../../../../../environments/environment';
import { constants } from '../../../../core/enums/constants';
import { CommonService } from '../../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../../directives/imge-error/image-error.directive';
import { IImageData } from '../../../interfaces/image';

@Component({
  selector: 'app-custom-masonry-layout',
  standalone: true,
  imports: [
    CommonModule,
    ImageErrorDirective,
    MatProgressSpinner,
    MatCardModule,
  ],
  templateUrl: './custom-masonry-layout.component.html',
  styleUrl: './custom-masonry-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMasonryLayoutComponent
  implements OnInit, OnChanges, OnDestroy
{
  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;
  @ViewChild('masonryGrid', { static: false }) masonryGrid!: ElementRef;

  @Input() isLoading: boolean = true;
  @Input() view!: string;
  @Input() showskeleton?: boolean = false;
  @Input() showTitle?: boolean = true;
  @Input() showMoreButton?: boolean = true;
  @Input() allImageItem!: any[];
  @Input() showDescription: boolean = true;
  @Input() showDate? = true;
  @Input() showBornDeathDate?: boolean = false;
  @Input() path!: string;
  @Input() orderBy: string = constants.SORT_BY.ASC;
  @Input() showAuthor?: boolean;
  @Input() defaultSize: string = this.common.constantsData.IMAGE_SIZES.LIST;
  @Output() showDetailEvent = new EventEmitter<string>();
  @Output() loadedMasonary = new EventEmitter<boolean>();

  imageWidth = 500;

  isInitial: boolean = true;
  showLoader: boolean = true;
  isBrowser: boolean;
  private hasLoadedMasonry: boolean = false;
  private observer!: IntersectionObserver;

  constant = constants;
  environments = environment;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    public common: CommonService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      window.addEventListener(
        'resize',
        this.debounce(() => this.arrangeMasonryLayout(), 200),
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['allImageItem'] || changes['orderBy'] || changes['isLoading']) &&
      this.isBrowser
    ) {
      this.showLoader = true;
      this.hasLoadedMasonry = false;
      this.sortItems();
    } else if (
      changes['view'] &&
      changes['view'].currentValue == this.constant.VIEWS.GRID &&
      this.isBrowser &&
      this.allImageItem.length > 0
    ) {
      this.isInitial = true;
      this.showLoader = true;
      setTimeout(() => {
        this.hasLoadedMasonry = false;
        this.arrangeMasonryLayout();
      }, 0);
    }
  }

  sortItems() {
    if (this.view == this.constant.VIEWS.GRID) {
      setTimeout(() => this.arrangeMasonryLayout());
    }
  }

  arrangeMasonryLayout() {
    if (this.masonryGrid) {
      const grid = this.masonryGrid.nativeElement;
      const items = Array.from(grid.children) as HTMLElement[];
      if (items && items.length == 0) {
        this.isInitial = true;
        this.showLoader = false;
        this.renderer.setStyle(grid, 'height', `0px`);
        this.cd.detectChanges();
      }
      this.observeImages(grid, items);
    }
  }

  private arrangeItems(grid: HTMLElement, items: HTMLElement[]) {
    const divWidth = grid.offsetWidth;

    let columns: number;
    let imageWidth: number;

    if (divWidth < 430) {
      columns = 1;
      imageWidth = divWidth;
    } else if (divWidth < 700) {
      columns = 2;
      imageWidth = divWidth / 2 - 10;
    } else {
      columns = Math.floor(divWidth / 350);
      columns = columns < 2 ? 2 : columns;
      const totalGutter = columns * 10;
      imageWidth = (divWidth - totalGutter) / columns;
    }

    this.imageWidth = imageWidth;
    const columnHeights = new Array(columns).fill(0);

    requestAnimationFrame(() => {
      const updates: { item: HTMLElement; x: number; y: number }[] = [];

      items.forEach((item) => {
        item.style.width = `${imageWidth}px`;
        item.style.height = 'auto'; // Maintain aspect ratio
        item.style.position = 'absolute'; // Prevent breaking the layout

        const img = item.querySelector('img') as HTMLImageElement;
        if (img) {
          img.style.width = '100%';
          img.style.height = 'auto'; // Maintain aspect ratio
        }

        // Find the shortest column
        const minColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights),
        );
        const x = minColumnIndex * (imageWidth + 16);
        const y = columnHeights[minColumnIndex];

        updates.push({ item, x, y });

        columnHeights[minColumnIndex] += item.offsetHeight + 16; // Adjust for the gutter
      });

      // Apply all updates in a single batch
      updates.forEach(({ item, x, y }) => {
        this.renderer.setStyle(item, 'transform', `translate(${x}px, ${y}px)`);
      });

      // Set grid height after layout is applied
      setTimeout(() => {
        const gridHeight = Math.max(...columnHeights);
        this.renderer.setStyle(grid, 'height', `${gridHeight}px`);
        this.arrangeMasonryLayout();
        this.isInitial = false;
        this.showLoader = false;
        if (!this.hasLoadedMasonry) {
          this.loadedMasonary.emit(true);
          this.hasLoadedMasonry = true;
        }

        this.cd.detectChanges();
      }, 0);
    });
  }

  private observeImages(grid: HTMLElement, items: HTMLElement[]) {
    if (this.observer) this.observer.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.arrangeItems(grid, items);
          this.observer.unobserve(entry.target);
        }
      });
    });

    items.forEach((item) => {
      const img = item.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'lazy'); // Lazy loading optimization
        this.observer.observe(img);
      }
    });
  }

  debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
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

  getWorkImageUrl(image: IImageData, size: string): string {
    const baseUrl = environment.IMAGE_URL + environment.WORKS;
    const folderPath =
      image?.extra_folder && image.extra_folder.length > 0
        ? `${image.extra_folder}/${size}/`
        : `${size}/`;

    return `${baseUrl}${folderPath}${image?.filename}`;
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
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.BIG)}
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.BOX)}
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.LIST)}
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.THUMB)}
    `.trim();
    }
    return `
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.BIG)} ${img?.width_big}w,
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.BOX)} ${img?.width_box}w,
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.LIST)} ${img?.width_list}w,
      ${this.getWorkImageUrl(img, this.common.constantsData.IMAGE_SIZES.THUMB)} ${img?.width_thumb}w
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

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
  }
}
