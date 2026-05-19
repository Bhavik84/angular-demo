import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonService } from '../../../core/service/common/common.service';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-photography-plan',
  standalone: true,
  imports: [TranslateModule, SanitizeHtmlPipe],
  templateUrl: './photography-plan.component.html',
  styleUrl: './photography-plan.component.scss',
})
export class photographyPlanComponent implements OnInit {
  constructor(public common: CommonService) {}
  ngOnInit(): void {
    this.common.scrollTop();
  }
}
