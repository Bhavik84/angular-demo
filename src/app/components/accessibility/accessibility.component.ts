import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SanitizeHtmlPipe } from '../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [TranslateModule, SanitizeHtmlPipe],
  templateUrl: './accessibility.component.html',
  styleUrl: './accessibility.component.scss',
})
export class AccessibilityComponent {}
