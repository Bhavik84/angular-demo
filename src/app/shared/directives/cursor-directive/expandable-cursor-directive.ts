import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appExpandableCursor]'
})
export class ExpandableCursorDirective implements AfterViewInit, OnDestroy {
  @Input() isExpanded: boolean = false;

  private resizeObserver!: ResizeObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    // Observe size changes to handle dynamic content/images
    this.resizeObserver = new ResizeObserver(() => {
      this.updateCursor();
    });

    this.resizeObserver.observe(this.el.nativeElement);
  }

  private updateCursor() {
    const element = this.el.nativeElement;
    const computedStyle = window.getComputedStyle(element);
    const lineClamp = computedStyle.webkitLineClamp;

    const isExpandable = !!(lineClamp && lineClamp !== 'none' && element.scrollHeight > element.clientHeight);

    element.style.cursor = isExpandable || this.isExpanded ? 'pointer' : 'default';
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
