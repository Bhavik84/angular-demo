import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [TranslateModule, SanitizeHtmlPipe],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss',
})
export class LegalNoticeComponent {}
