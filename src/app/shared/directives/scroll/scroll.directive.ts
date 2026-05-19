import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScroll]',
  standalone: true,
})
export class ScrollDirective {
  @Input() scrollAmount: number = 150;

  constructor(private elementRef: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    let target =
      this.elementRef.nativeElement.parentElement.querySelector(
        '.custom-scrollbar',
      );

    if (!target) {
      target = this.elementRef.nativeElement.parentElement.querySelector(
        '.masory-flex-wrapper',
      );
      if (!target) {
        return;
      }
    }

    const direction = (event.currentTarget as HTMLElement).getAttribute(
      'data-direction',
    );
    if (!direction) return;

    if (direction === 'up') {
      target.scrollTop -= this.scrollAmount;
    } else if (direction === 'down') {
      target.scrollTop += this.scrollAmount;
    } else if (direction === 'left') {
      target.scrollLeft -= this.scrollAmount;
    } else if (direction === 'right') {
      target.scrollLeft += this.scrollAmount;
    }
  }
}
