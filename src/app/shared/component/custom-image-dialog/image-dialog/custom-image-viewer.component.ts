import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ESvgIcon } from '../../../../core/enums/svg-icon.enum';
import { CommonService } from '../../../../core/service/common/common.service';
import { ImageErrorDirective } from '../../../directives/imge-error/image-error.directive';
import {
  FullscreenDocument,
  FullscreenHTMLElement,
} from '../../../interfaces/ICustomImageViewer';
import { ImageItem } from '../../../interfaces/image';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './custom-image-viewer.component.html',
  standalone: true,
  styleUrls: ['./custom-image-viewer.component.scss'],
  imports: [MatIconModule, CommonModule, CdkDrag, ImageErrorDirective],
})
export class ImageViewerComponent implements OnInit {
  icons = ESvgIcon;
  @Input() imageSrc: string = '';
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;
  zoomLevel: number = 1;
  isDragging: boolean = false;
  startX: number = 0;
  startY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  currentX: number = 0;
  currentY: number = 0;
  currentIndex: number = 0;
  data: ImageItem[] = [];
  item!: ImageItem;
  iphone = false;
  @ViewChild(ImageErrorDirective)
  directive!: ImageErrorDirective;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public injectedData: ImageItem[],
    public common: CommonService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    this.data = Array.isArray(injectedData) ? injectedData : [];
    this.item =
      this.data.length > 0
        ? this.data[this.currentIndex]
        : { src: '', title: '' };
  }

  ngOnInit(): void {
    if (/iPhone/.test(navigator.userAgent)) {
      this.iphone = true;
    }
  }
  get imageTransform(): string {
    return `translate(${this.currentX}px, ${this.currentY}px) scale(${this.zoomLevel})`;
  }

  @HostListener('window:mouseup', ['$event'])
  onWindowMouseUp(): void {
    this.isDragging = false;
  }

  zoomIn(): void {
    if (this.zoomLevel < 5) {
      this.zoomLevel += 0.2;
    }
    this.resetDragging();
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.3) {
      this.zoomLevel -= 0.2;
      this.resetDragging();
    }
  }

  next() {
    if (this.currentIndex == this.data.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = this.currentIndex + 1;
    }
    this.item = this.data[this.currentIndex];
    this.resetView();
  }

  prev() {
    if (this.currentIndex == 0) {
      this.currentIndex = this.data.length - 1;
    } else {
      this.currentIndex = this.currentIndex - 1;
    }
    this.item = this.data[this.currentIndex];
    this.resetView();
  }

  resetView(): void {
    this.zoomLevel = 1;
    this.currentX = 0;
    this.currentY = 0;
    this.resetDragging();
  }

  resetDragging(): void {
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  toggleFullScreen() {
    if (isPlatformBrowser(this.platformId)) {
      const documentEle = document as FullscreenDocument;
      const elem = documentEle.documentElement as FullscreenHTMLElement; // Use document.documentElement for full document fullscreen
      if (
        !documentEle.fullscreenElement &&
        !documentEle.webkitFullscreenElement &&
        !documentEle.mozFullScreenElement &&
        !documentEle.msFullscreenElement
      ) {
        // If no element is in full-screen mode, enter full-screen
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem['mozRequestFullScreen']) {
          elem['mozRequestFullScreen']();
        } else if (elem['msRequestFullscreen']) {
          elem['msRequestFullscreen']();
        }
      } else {
        // Exit full-screen mode
        if (documentEle.exitFullscreen) {
          documentEle.exitFullscreen();
        } else if (documentEle.webkitExitFullscreen) {
          documentEle.webkitExitFullscreen();
        } else if (documentEle['mozCancelFullScreen']) {
          documentEle['mozCancelFullScreen']();
        } else if (documentEle['msExitFullscreen']) {
          documentEle.msExitFullscreen();
        }
      }
    }
  }

  closeDialog(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentEle = document as FullscreenDocument;
      if (
        !(
          !documentEle.fullscreenElement &&
          !documentEle.webkitFullscreenElement &&
          !documentEle.mozFullScreenElement &&
          !documentEle.msFullscreenElement
        )
      ) {
        this.common.toggleFullScreen();
      }
    }
    this.dialog.closeAll();
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY > 0) {
      this.zoomOut();
    } else {
      this.zoomIn();
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX - this.offsetX;
    this.startY = event.clientY - this.offsetY;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.offsetX = event.clientX - this.startX;
      this.offsetY = event.clientY - this.startY;
      this.currentX = this.offsetX;
      this.currentY = this.offsetY;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(event: MouseEvent): void {
    this.onMouseMove(event);
  }
}
