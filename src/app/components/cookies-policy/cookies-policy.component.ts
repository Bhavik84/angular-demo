import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../core/service/common/common.service';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-cookies-policy',
  standalone: true,
  imports: [SanitizeHtmlPipe, TranslateModule],
  templateUrl: './cookies-policy.component.html',
  styleUrl: './cookies-policy.component.scss',
})
export class CookiesPolicyComponent {
  constructor(public common: CommonService) {}
}
