import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../core/service/common/common.service';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    TranslateModule,
    SanitizeHtmlPipe,
    CommonModule,
  ],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
})
export class SplashScreenComponent implements OnInit {
  @Output() splasHideEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public translate: TranslateService,
    public common: CommonService,
  ) {}
  hideSplash() {
    this.splasHideEvent.emit(false);
    this.animateHide(); // Call the animation function
  }
  animateHide() {
    const splashScreen = document.querySelector('.welcome-page-data');
    if (splashScreen) {
      splashScreen.classList.add('fade-out-zoom-out');
    }
  }
  ngOnInit(): void {
    this.translate.setDefaultLang(this.common.languageAlias);
    this.translate.use(this.common.activeLanguage);
    this.animateText();
  }

  animateText() {
    this.document.addEventListener('DOMContentLoaded', () => {
      const titles = this.document.querySelectorAll('.welcome-title');
      let delay = 0;
      titles.forEach((title) => {
        if (title instanceof HTMLElement && title.textContent !== null) {
          const text = title.textContent.trim();
          title.textContent = '';
          for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const span = this.document.createElement('span');
            span.style.animationDelay = `${delay}s`;
            delay += 2;
            span.textContent = char;
            title.appendChild(span);
          }
        }
      });
    });
  }
}
