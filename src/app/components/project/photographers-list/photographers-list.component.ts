import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { AuthorData } from '../../../shared/interfaces/authors';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-photographers-list',
  standalone: true,
  imports: [TranslateModule, SanitizeHtmlPipe, NgClass, MatProgressSpinner],
  templateUrl: './photographers-list.component.html',
  styleUrl: './photographers-list.component.scss',
})
export class PhotographersListComponent implements OnInit, OnDestroy {
  selectionAlphabetList = [
    { title: 'A', value: 'a' },
    { title: 'B', value: 'b' },
    { title: 'C', value: 'c' },
    { title: 'D', value: 'd' },
    { title: 'E', value: 'e' },
    { title: 'F', value: 'f' },
    { title: 'G', value: 'g' },
    { title: 'H', value: 'h' },
    { title: 'I', value: 'i' },
    { title: 'J', value: 'j' },
    { title: 'K', value: 'k' },
    { title: 'L', value: 'l' },
    { title: 'M', value: 'm' },
    { title: 'N', value: 'n' },
    { title: 'O', value: 'o' },
    { title: 'P', value: 'p' },
    { title: 'Q', value: 'q' },
    { title: 'R', value: 'r' },
    { title: 'S', value: 's' },
    { title: 'T', value: 't' },
    { title: 'U', value: 'u' },
    { title: 'V', value: 'v' },
    { title: 'W', value: 'w' },
    { title: 'X', value: 'x' },
    { title: 'Y', value: 'y' },
    { title: 'Z', value: 'z' },
  ];
  selectedAlphabet: string = 'a';
  authorsData: AuthorData = {};
  isloading: boolean = true;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    private translate : TranslateService
  ) {}

  ngOnInit(): void {
    this.getAuthorlistData();
    this.common.scrollTop();
  }

  getAuthorlistData() {
    this.api
      .get(environment.GET_ALL_AUTHOR_NAME_LIST)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (!res.is_error && res.data) {
          const groupedAuthors = res.data.groupedAuthors as AuthorData;
          this.authorsData = this.processAuthorsForLanguage(groupedAuthors);
          } else {
            this.common.error(res.message);
          }
          this.isloading = false;
        },
        error: () => {
          this.isloading = false;
        },
      });
  }
  getAuthorDetails(slug: string) {
    this.router.navigate([
      `${this.common.getRoute('PHOTOGRAPHER_SEARCHER')}/${slug}`,
    ]);
  }

  processAuthorsForLanguage(groupedAuthors: AuthorData): AuthorData {
    const updatedGrouped: AuthorData = {};
    for (const key in groupedAuthors) {
      if (groupedAuthors[key]) {
        groupedAuthors[key].forEach(author => {
          const displayName = this.checkAuthorName(author);
          const normalizedLetter = this.common.normalizeName(displayName.charAt(0)).toLowerCase();
          if (!updatedGrouped[normalizedLetter]) {
            updatedGrouped[normalizedLetter] = [];
          }
          updatedGrouped[normalizedLetter].push(author);
        });
      }
    }

    return updatedGrouped;
  }

  checkAuthorName(author: { name?: string | null; surnames?: string | null } | null | undefined): string {
    if (!author || (!author.name?.trim() && !author.surnames?.trim())) {
      return this.translate.instant('COMMON.NO_AUTHOR_TEXT');
    }
    const name = author.name?.trim() || '';
    if (name === constants.NO_AUTHOR) {
      return this.translate.instant('COMMON.NO_AUTHOR_TEXT');
    }
    return `${author.surnames ? author.surnames + ', ' : ''}${name}`;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
