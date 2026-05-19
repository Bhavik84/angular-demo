import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { constants } from '../../core/enums/constants';
import { ESvgIcon } from '../../core/enums/svg-icon.enum';
import { CommonService } from '../../core/service/common/common.service';
import { SanitizeHtmlPipe } from '../pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule,
    RouterModule,
    MatIconModule,
    CommonModule,
    SanitizeHtmlPipe,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  icons = ESvgIcon;
  environment = environment;
  constant = constants;

  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    public common: CommonService,
  ) {}

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}
