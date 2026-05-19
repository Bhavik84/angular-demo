import { Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appMatSelectScrollBottom]',
  standalone: true,
})
export class MatSelectScrollBottomDirective implements OnDestroy {
  private readonly BOTTOM_SCROLL_OFFSET = 25;
  @Output('appMatSelectScrollBottom') reachedBottom = new EventEmitter<void>();
  unsubscribeAll = new Subject<boolean>();

  constructor(private matSelect: MatSelect) {
    this.matSelect.openedChange.subscribe((isOpened: boolean) => {
      if (isOpened && this.matSelect.panel) {
        const panelElement = this.matSelect.panel.nativeElement as HTMLElement;
        panelElement.addEventListener('scroll', () => {
          if (
            panelElement.scrollTop >=
            panelElement.scrollHeight -
              panelElement.offsetHeight -
              this.BOTTOM_SCROLL_OFFSET
          ) {
            this.reachedBottom.emit();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
