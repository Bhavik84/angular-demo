import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomFilterComponent } from '../../../shared/component/custom-filter/custom-filter.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { MatChipComponent } from '../../../shared/component/mat-chip/mat-chip.component';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { filter } from '../../../shared/interfaces/alabern-portal';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';
import { blogData, IArticleCategories, IArticleTags, ILanguageImage } from './../../../shared/interfaces/blog';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    RouterModule,
    CustomFilterComponent,
    ImageErrorDirective,
    CustomSearchComponent,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    SanitizeHtmlPipe,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class BlogComponent implements OnInit, OnDestroy {
  icons = ESvgIcon;
  environment = environment;
  dialogRef!: MatDialogRef<null>;
  private unsubscribe$ = new Subject<void>();
  searchResult: string = '';
  selectedItem: filter[] = [];
  selectedtags: filter[] = [];
  selectedAuthor: filter[] = [];
  selectedCategories: filter[] = [];
  authors: { id: number; name: string; count: number }[] = [];
  tags: { id: number; name: string; count: number }[] = [];
  categories: { id: number; name: string; count: number }[] = [];
  dropDownLoader: boolean = false;
  totalCount = 0;
  articlesLoading: boolean = true;
  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;
  blogData: blogData[] = [];
  randomBlogData: blogData | null = null;
  isLoading = false;
  localPayload: { blogActivePage: number; pageSize: number } = {
    blogActivePage: 1,
    pageSize: constants.LIMIT.SIX,
  };
  hasCategories = false;
  hasTags = false;
  expandedIds = new Set<number>();
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    public commonService: CommonService,
    private dataStore: DataStoreService,
  ) {}

  ngOnInit(): void {
    if (this.dataStore.blogPageData) {
      if (this.dataStore.blogPageData.searchData) {
        this.searchResult = this.dataStore.blogPageData.searchData;
      }

      if (
        this.dataStore.blogPageData.offset &&
        this.dataStore.blogPageData.offset > 1
      ) {
        this.localPayload.blogActivePage = this.dataStore.blogPageData.offset;
      }

      if (
        this.dataStore.blogPageData.selectedTags &&
        this.dataStore.blogPageData.selectedTags.length > 0
      ) {
        this.selectedtags = this.dataStore.blogPageData.selectedTags;
      }

      if (
        this.dataStore.blogPageData.selectedAuthors &&
        this.dataStore.blogPageData.selectedAuthors.length > 0
      ) {
        this.selectedAuthor = this.dataStore.blogPageData.selectedAuthors;
      }

      if (
        this.dataStore.blogPageData.selectedCategories &&
        this.dataStore.blogPageData.selectedCategories.length > 0
      ) {
        this.selectedCategories =
          this.dataStore.blogPageData.selectedCategories;
      }
      this.mergeItems();
      if (this.dataStore.blogPageData.blogPageScrollId) {
        const targetId = this.dataStore.blogPageData.blogPageScrollId;
        this.commonService.scrollToElementById(targetId);
        this.dataStore.blogPageData.blogPageScrollId = '';
      } else {
        this.scrollTop();
      }
    }
    this.onReloadPage();
  }

  private onReloadPage() {
    this.getRandomBlog();

    if (
      this.dataStore.blogPageData.blogList &&
      this.dataStore.blogPageData.blogList.length > 0
    ) {
      this.blogData = [];
      setTimeout(() => {
            this.hasCategories = this.dataStore.blogPageData.blogList.some((element: blogData) =>
              Array.isArray(element.articles_articles_categories) &&
              element.articles_articles_categories.some((cat: IArticleCategories) => cat.articles_category?.id)
            );

            this.hasTags = this.dataStore.blogPageData.blogList.some((element: blogData) =>
              Array.isArray(element.articles_tags) &&
              element.articles_tags.some((tag: IArticleTags) => tag.tag?.tags_languages?.[0]?.id_tag)
            );
        this.checkFilterData()
      },0);
    }else{
      this.getAllBlog();
    }
  }

  afterLoadeCheckFilter() {
    if (
      this.dataStore.blogPageData.searchData &&
      this.dataStore.blogPageData.blogData &&
      this.dataStore.blogPageData.blogData.length > 0
    ) {
      this.tags = [];
      this.authors = [];
      this.categories = [];
      this.dataStore.blogPageData.blogData.forEach((element: blogData) => {
        this.setFilterData(element);
      });
    }
  }

  openDialog(template: TemplateRef<null>) {
    this.dialogRef = this.dialog.open(template, {
      autoFocus: false,
    });
  }

  removeItem(event: filter) {
    this.selectedtags = this.selectedtags.filter((item) => item !== event);
    this.selectedAuthor = this.selectedAuthor.filter((item) => item !== event);
    this.selectedCategories = this.selectedCategories.filter(
      (item) => item !== event,
    );
    this.blogData = [];
    this.localPayload.blogActivePage = 1;
    this.checkFilterData();
    this.dataStore.blogPageData.selectedTags = this.selectedtags;
    this.dataStore.blogPageData.selectedAuthors = this.selectedAuthor;
    this.dataStore.blogPageData.selectedCategories = this.selectedCategories;
  }

  getRandomBlog() {
    this.apiService
      .get(`${environment.GET_RECENT_ARTICLE}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.randomBlogData = response.data.articles;
            this.randomBlogData
              ? (this.randomBlogData.article_language_images =
                  this.checkRecentImageData(this.randomBlogData))
              : null;
          } else {
            this.commonService.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  checkRecentImageData(element: blogData | null) {
    const filteredImages: ILanguageImage[] = [];
    if (element?.articles_images && element.articles_images.length > 0) {
      const imagesWithLanguages = element.articles_images?.some(
        (img: ILanguageImage) =>
          img.articles_images_languages &&
          img.articles_images_languages.length > 0,
      );
      if (imagesWithLanguages) {
        const filteredElement = element?.articles_images?.filter(
          (img: ILanguageImage) =>
            img.articles_images_languages?.some(
              (lang) => lang.id_language === this.commonService.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredElement.forEach((imgelement: ILanguageImage) => {
            filteredImages.push(imgelement);
          });
        }
      } else {
        filteredImages.push(element.articles_images[0]);
      }
    }
    return filteredImages;
  }

  getAllBlog() {
    const payload = {
      search: '',
      family: [2],
      sortBy: 'DESC',
    };
    this.isLoading = true;
    this.apiService
      .post(`${environment.GET_ALL_ARTICLE}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.isLoading = false;
            if (!response.is_error) {
              this.dataStore.blogPageData.blogList = [
                ...response.data.articles,
              ];

              this.hasCategories = this.dataStore.blogPageData.blogList.some(
                (element: blogData) =>
                  element.articles_articles_categories &&
                  element.articles_articles_categories.some(
                    (cat: IArticleCategories) => cat.articles_category?.id,
                  ),
              );

              this.hasTags = this.dataStore.blogPageData.blogList.some(
                (element: blogData) =>
                  element.articles_tags &&
                  element.articles_tags.some(
                    (tag: IArticleTags) => tag.tag?.tags_languages?.[0]?.id_tag,
                  ),
              );
              this.checkFilterData();
              this.isLoading = false;
            }
            this.articlesLoading = false;
            this.dropDownLoader = false;
          } else {
            this.articlesLoading = false;
            this.dropDownLoader = false;
            this.commonService.error(response.message);
          }
        },
        error: () => {
          this.isLoading = false;
          this.articlesLoading = false;
        },
      });
  }

  receiveDataFromChild(data: { selectedValues: filter[]; type: string }) {
    switch (data.type) {
      case this.commonService.constantsData.BLOG_FILTER_TYPE.TAGS:
        this.selectedtags = data.selectedValues;
        this.dataStore.blogPageData.selectedTags = data.selectedValues;
        break;
      case this.commonService.constantsData.BLOG_FILTER_TYPE.AUTHORS:
        this.selectedAuthor = data.selectedValues;
        this.dataStore.blogPageData.selectedAuthors = data.selectedValues;
        break;
      case this.commonService.constantsData.BLOG_FILTER_TYPE.CATEGORIES:
        this.selectedCategories = data.selectedValues;
        this.dataStore.blogPageData.selectedCategories = data.selectedValues;
        break;
      default:
        break;
    }

    this.mergeItems();
    this.blogData = [];
    this.checkFilterData();
  }

  setFilterData(element: blogData) {
    if (element.articles_tags && element.articles_tags.length > 0) {
      element.articles_tags.forEach((tagsData: IArticleTags) => {
        if (tagsData?.id_tag) {
          const tagIndex = this.tags.findIndex(
            (f: { id: number }) =>
              f.id === tagsData.tag?.tags_languages[0]?.id_tag,
          );
          if (tagIndex >= 0) {
            this.tags[tagIndex].count++;
          } else if (tagsData?.tag && tagsData?.tag.name) {
            this.tags.push({
              id: tagsData?.tag.tags_languages[0].id_tag,
              name: tagsData?.tag.tags_languages[0].name,
              count: 1,
            });
          }
          this.tags = this.commonService.sorAsendingFilterData(this.tags);
        }
      });
    }

    if (
      element.articles_author &&
      element.articles_author?.name &&
      element.articles_author?.id
    ) {
      const authorIndex = this.authors.findIndex(
        (f: { id: number }) => f.id == element?.articles_author?.id,
      );
      if (authorIndex >= 0) {
        this.authors[authorIndex].count++;
      } else {
        let authorFullName = '';
        if (element.articles_author.surnames) {
          authorFullName = element.articles_author.surnames;
        }
        if (element.articles_author.name) {
          if (element.articles_author.surnames) {
            authorFullName += ', ';
          }
          authorFullName += element.articles_author.name;
        }
        this.authors.push({
          id: element.articles_author?.id,
          name: authorFullName,
          count: 1,
        });
        this.authors = this.commonService.sorAsendingFilterData(this.authors);
      }
    }

    if(element.articles_articles_categories && element.articles_articles_categories.length > 0) {
        element.articles_articles_categories.forEach((element:IArticleCategories) => {
        if(element.articles_category.id){
            const categoryIndex = this.categories.findIndex((f:{ id:number }) => f.id == element?.articles_category?.id);
          if (categoryIndex >= 0) {
            this.categories[categoryIndex].count++;
          } else {
            this.categories.push({
              id: element.articles_category?.id,
              name: element.articles_category?.articles_categories_languages[0]
                ?.name,
              count: 1,
            });
            this.categories = this.commonService.sorAsendingFilterData(
              this.categories,
            );
          }
        }
      });
    }
  }

  handleSearch(searchTerm: string) {
    if (searchTerm.trim() !== this.dataStore.blogPageData.searchData) {
      this.blogData = [];
      this.searchResult = searchTerm;
      this.dataStore.blogPageData.searchData = searchTerm.trim();
      this.localPayload.blogActivePage = 1;
      this.checkFilterData();
    }
  }

  showMore() {
    this.localPayload.blogActivePage++;
    this.dataStore.blogPageData.offset = this.localPayload.blogActivePage;
    this.checkFilterData();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  toggleExapand(id: number): void {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
  }

  mergeItems() {
    this.selectedItem = [
      ...this.selectedtags,
      ...this.selectedAuthor,
      ...this.selectedCategories,
    ];
  }

  checkFilterData() {
    const FilterData = this.returnFilterData();
    this.blogData = FilterData?.slice(
      0,
      this.localPayload.blogActivePage * this.localPayload.pageSize,
    );
    this.tags = [];
    this.authors = [];
    this.categories = [];
    this.returnFilterData()?.forEach((element: blogData) => {
      this.setFilterData(element);
      element.article_language_images = this.checkImageData(element);
    });
    if (FilterData?.length >= 0) {
      this.totalCount = FilterData?.length;
    }
  }

  returnFilterData() {
    return this.dataStore.blogPageData.blogList?.filter((data: blogData) => {
      const isSearchMatched =
        this.searchResult && this.searchResult.length > 0
          ? (() => {
              const authorName = this.commonService.normalizeName(
                data.articles_author.name +
                  ' ' +
                  data.articles_author?.surnames,
              );
              const title = this.commonService.normalizeName(
                data.articles_languages[0].title,
              );
              return (
                authorName
                  .toLowerCase()
                  .includes(
                    this.commonService.normalizeName(
                      this.searchResult.trim().toLowerCase(),
                    ),
                  ) ||
                title
                  .toLowerCase()
                  .includes(
                    this.commonService.normalizeName(
                      this.searchResult.trim().toLowerCase(),
                    ),
                  )
              );
            })()
          : true;

      const isBlogMatch =
        this.selectedtags.length > 0
          ? (() => {
              if (data.articles_tags && data.articles_tags.length > 0) {
                return this.selectedtags.some((selectedTag: filter) =>
                  data.articles_tags.some(
                    (tagData: IArticleTags) =>
                      tagData.tag && tagData.tag.id === selectedTag.id,
                  ),
                );
              }
              return false;
            })()
          : true;

      const isAuthorMatched =
        this.selectedAuthor.length > 0
          ? (() => {
              if (data.articles_author) {
                return this.selectedAuthor.some(
                  (selectedAuthor: { id: number; name: string }) =>
                    data?.articles_author?.id == selectedAuthor.id,
                );
              }
              return false;
            })()
          : true;

      const isCategoryMatch = this.selectedCategories.length > 0 ? (() => {
        if (data.articles_articles_categories && data.articles_articles_categories.length > 0) {
            return this.selectedCategories.some((selectedCategory: filter) =>
                data.articles_articles_categories.some((categoryData: IArticleCategories) =>
                  categoryData.articles_category && categoryData.articles_category.id === selectedCategory.id
                )
            );
        }
        return false;
      })() : true;

      return (
        isSearchMatched && isBlogMatch && isAuthorMatched && isCategoryMatch
      );
    });
  }

  checkImageData(element: blogData) {
    const filteredImages: ILanguageImage[] = [];
    if (element.articles_images && element.articles_images.length > 0) {
      const imagesWithLanguages = element.articles_images?.some(
        (img: ILanguageImage) =>
          img.articles_images_languages &&
          img.articles_images_languages.length > 0,
      );
      if (imagesWithLanguages) {
        const filteredElement = element?.articles_images?.filter(
          (img: ILanguageImage) =>
            img.articles_images_languages?.some(
              (lang) => lang.id_language === this.commonService.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredImages.push(filteredElement[0]);
        }
      } else {
        filteredImages.push(element.articles_images[0]);
      }
    }
    return filteredImages;
  }

  showBlogDetail(blog: blogData) {
    this.dataStore.blogPageData.blogPageScrollId = blog.slug;
    this.router.navigate([
      `/${this.commonService.getRoute('BLOG')}/${blog.slug}`,
    ]);
  }

  doOpenArticleDetail(blog: blogData | null) {
    if (blog) {
      this.router.navigate([
        `/${this.commonService.getRoute('BLOG')}/${blog.slug}`,
      ]);
    }
  }

  openDynamicImage(title?: string) {
    const items: { title?: string; src: string }[] = [];
    this.randomBlogData?.article_language_images.forEach((element) => {
      items.push({ src: environment.ARTICLES + element?.url, title: title });
    });
    this.commonService.openImageViewer(items);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.commonService.switchLanguage.next(false);
  }
}
