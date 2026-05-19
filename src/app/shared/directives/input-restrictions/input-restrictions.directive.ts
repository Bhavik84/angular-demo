import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]',
  standalone: true,
})
export class InputRestrictionsDirective {
  regexStr = '^[a-zA-Z0-9_]*$';
  @Input() isAlphaNumeric!: boolean;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const cursorPos: number = this.el.nativeElement.selectionStart;

    // Prevent space at the start
    if (cursorPos === 0 && event.key === ' ') {
      event.preventDefault();
      return;
    }

    // Check if the key pressed matches the allowed characters
    if (!RegExp(this.regexStr).test(event.key) && event.key !== ' ') {
      event.preventDefault();
      return;
    }
  }
}
