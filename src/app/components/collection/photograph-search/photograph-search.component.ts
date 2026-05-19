import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ESvgIcon } from '../../../core/enums/svg-icon.enum';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomFilterComponent } from '../../../shared/component/custom-filter/custom-filter.component';
import { CustomMasonryLayoutComponent } from '../../../shared/component/custom-masonry-layout/custom-masonry-layout/custom-masonry-layout.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { MatChipComponent } from '../../../shared/component/mat-chip/mat-chip.component';
import { OrderSelectionComponent } from '../../../shared/component/order-selection/order-selection.component';
import { filter } from '../../../shared/interfaces/alabern-portal';
import {
  IDecade,
  IFilterItem,
  ITechnique,
} from '../../../shared/interfaces/common';
import {
  ITags,
  SortableData,
} from '../../../shared/interfaces/IGeneralInterface';
import {
  ILocalPayload,
  ITagData,
  IWorkImage,
  Tag,
} from '../../../shared/interfaces/image';
import {
  IAllTags,
  rightRes,
  rights,
  workTechnique,
} from '../../../shared/interfaces/photographer';
import {
  DropDownFilter,
  DropDownFilterCount,
  Work,
} from '../../../shared/interfaces/work';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-photograph-search',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatChipComponent,
    CustomFilterComponent,
    CustomSearchComponent,
    OrderSelectionComponent,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    MatDatepickerModule,
    SanitizeHtmlPipe,
    CustomMasonryLayoutComponent,
    MatSelectModule,
  ],
  templateUrl: './photograph-search.component.html',
  styleUrl: './photograph-search.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class PhotographSearchComponent implements OnInit, OnDestroy {
  icons = ESvgIcon;
  selectedItem: filter[] = [];
  path: string = environment.WORKS;

  authors: DropDownFilterCount[] = [];
  institutions: DropDownFilterCount[] = [];
  type1TagsData: DropDownFilterCount[] = [];
  type2TagsData: DropDownFilterCount[] = [];
  type3TagsData: DropDownFilterCount[] = [];
  techniques: DropDownFilterCount[] = [];
  techniquesBackup: DropDownFilterCount[] = [];
  rights: DropDownFilterCount[] = [];
  rightsBackupData: DropDownFilterCount[] = [];
  decades: { id: any; name: string; count: number }[] = [];
  decadesBackup: { id: any; name: string; count: number }[] = [];
  selectedAuthors: DropDownFilter[] = [];
  selectedDecades: DropDownFilter[] = [];
  selectedInstitutions: DropDownFilter[] = [];
  selectedCollections: DropDownFilter[] = [];
  selectedTags: DropDownFilter[] = [];
  type1SelectedTags: DropDownFilter[] = [];
  type2SelectedTags: DropDownFilter[] = [];
  type3SelectedTags: DropDownFilter[] = [];
  selectedTechnique: DropDownFilter[] = [];
  selectedRights: DropDownFilter[] = [];

  dropDownLoader = false;
  searchResult: string = '';
  sortBy: string = '';
  totalCount = 0;
  dialogRef!: MatDialogRef<null>;
  view = constants.VIEWS.GRID;
  constants = constants;
  isLoading: boolean = true;
  dateForm: FormGroup = this.fb.group({
    date: ['', Validators.required],
  });
  imageList: IWorkImage[] = [];
  private unsubscribe$ = new Subject<void>();
  isShowViewMore: boolean = false;
  localPayload: ILocalPayload = {
    authorActivePage: 1,
    pageSize: constants.LIMIT.TWENTY_FOUR,
  };
  allTagsData: IAllTags[] = [];
  private searchDateSubject$ = new Subject<string>();
  comparisonResult: boolean = false;
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    public common: CommonService,
    private dataStore: DataStoreService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.common
      .isComingFromDetailsPage(this.router.url)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: boolean) => (this.comparisonResult = res));

    if (this.comparisonResult === false) {
      this.dataStore.photographPageData.allWorksData =
        this.dataStore.photographPageData.allWorksData.sort(
          () => Math.random() - 0.5,
        );
      this.scrollTop();
    }

    if (this.dataStore.photographPageData) {
      if (this.dataStore.photographPageData.searchData) {
        this.searchResult = this.dataStore.photographPageData.searchData;
      }

      if (this.dataStore.photographPageData.filter) {
        if (
          this.dataStore.photographPageData.filter.selectedAuthors &&
          this.dataStore.photographPageData.filter.selectedAuthors.length > 0
        ) {
          this.selectedAuthors =
            this.dataStore.photographPageData.filter.selectedAuthors;
        }

        if (
          this.dataStore.photographPageData.filter.selectedDecades &&
          this.dataStore.photographPageData.filter.selectedDecades.length > 0
        ) {
          this.selectedDecades =
            this.dataStore.photographPageData.filter.selectedDecades;
        }

        if (
          this.dataStore.photographPageData.filter.selectedTechnique &&
          this.dataStore.photographPageData.filter.selectedTechnique.length > 0
        ) {
          this.selectedTechnique =
            this.dataStore.photographPageData.filter.selectedTechnique;
        }

        if (
          this.dataStore.photographPageData.filter.selectedInstitutions &&
          this.dataStore.photographPageData.filter.selectedInstitutions.length >
            0
        ) {
          this.selectedInstitutions =
            this.dataStore.photographPageData.filter.selectedInstitutions;
        }

        if (
          this.dataStore.photographPageData.filter.selectedRights &&
          this.dataStore.photographPageData.filter.selectedRights.length > 0
        ) {
          this.selectedRights =
            this.dataStore.photographPageData.filter.selectedRights;
        }

        if (
          this.dataStore.photographPageData.filter.type1SelectedTags &&
          this.dataStore.photographPageData.filter.type1SelectedTags.length > 0
        ) {
          this.type1SelectedTags =
            this.dataStore.photographPageData.filter.type1SelectedTags;
        }

        if (
          this.dataStore.photographPageData.filter.type2SelectedTags &&
          this.dataStore.photographPageData.filter.type2SelectedTags.length > 0
        ) {
          this.type2SelectedTags =
            this.dataStore.photographPageData.filter.type2SelectedTags;
        }

        if (
          this.dataStore.photographPageData.filter.type3SelectedTags &&
          this.dataStore.photographPageData.filter.type3SelectedTags.length > 0
        ) {
          this.type3SelectedTags =
            this.dataStore.photographPageData.filter.type3SelectedTags;
        }

        if (
          this.dataStore.photographPageData.filter.selectedCollections &&
          this.dataStore.photographPageData.filter.selectedCollections.length >
            0
        ) {
          this.selectedCollections =
            this.dataStore.photographPageData.filter.selectedCollections;
        }

        if (this.dataStore.photographPageData.filter.searchDate) {
          this.dateForm
            .get('date')
            ?.patchValue(this.dataStore.photographPageData.filter.searchDate);
        }

        if (this.dataStore.photographPageData.sortingOrder) {
          this.sortBy = this.dataStore.photographPageData.sortingOrder;
          this.sortItems(this.sortBy);
        }

        this.mergeItems();
      }

      if (
        this.dataStore.photographPageData.activePage &&
        this.dataStore.photographPageData.activePage > 1
      ) {
        this.localPayload.authorActivePage =
          this.dataStore.photographPageData.activePage;
      }
      if (this.dataStore.photographPageData.photographPageView) {
        this.view = this.dataStore.photographPageData.photographPageView;
        if (
          this.view === this.constants.VIEWS.LIST &&
          this.comparisonResult === true
        ) {
          const targetId =
            this.dataStore.photographPageData.photographPageScrollId;
          this.common.scrollToElementById(targetId);
          this.dataStore.photographPageData.photographPageScrollId = '';
        }
      }
    }
    this.setupDebouncedSearch()
    this.onReloadPage();
  }

  private onReloadPage() {
    this.generateDecades(
      this.common.constantsData.WORK_DECADE_VALUE.START,
      this.common.constantsData.WORK_DECADE_VALUE.END,
      this.common.constantsData.WORK_DECADE_VALUE.INCREAMENT,
    );

    this.getAlltechniqueById();
    this.getALLRights();
    this.getAllTypesTags();

    if (
      this.dataStore.photographPageData.allWorksData &&
      this.dataStore.photographPageData.allWorksData.length > 0
    ) {
      this.imageList = [];
      setTimeout(() => {
        this.isLoading = false;
        this.checkFilterData();
      }, 200);
    } else {
      this.getAllWorkData();
    }
  }

  generateDecades(start: number, end: number, gap: number) {
    this.decadesBackup = [];
    for (let year = start; year <= end; year += gap) {
      const decadeData = `${year}-${year + gap - 1}`;
      this.decadesBackup.push({
        id: decadeData,
        name: decadeData,
        count: 0,
      });
    }
  }

  handleSearch(searchTerm: string) {
    if (searchTerm.trim() !== this.dataStore.photographPageData.searchData) {
      this.searchResult = searchTerm;
      this.isShowViewMore = false;
      this.dataStore.photographPageData.searchData = searchTerm.trim();
      this.imageList = [];
      this.localPayload.authorActivePage = 1;
      this.checkFilterData();
    }
  }

  getAllWorkData() {
    this.apiService
      .get(environment.GET_ALL_WORKS)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            if (response.data.works.length === 0) {
              this.isLoading = false;
            }
            this.dataStore.photographPageData.allWorksData = [
              ...response.data.works.sort(() => Math.random() - 0.5),
            ];
            this.checkFilterData();

            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.common.error(response.message);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log('err', err);
        },
      });
  }

  checkFilterData() {
    const allWorkFilteredData = this.returnFilterData();
    const workFilterSplitData = allWorkFilteredData.slice(
      0,
      this.localPayload.authorActivePage * this.localPayload.pageSize,
    );
    this.imageList = [];
    this.authors = [];
    this.institutions = [];
    this.type1TagsData = [];
    this.type2TagsData = [];
    this.type3TagsData = [];
    this.decades = [];
    this.rights = [];
    this.techniques = [];
    allWorkFilteredData.forEach((element: Work) => {
      this.setFilterData(element);
    });

    workFilterSplitData.forEach((element: Work) => {
      this.imageList.push({
        id: element.id,
        slug: element.slug,
        author: this.common.checkAuthorName(element.author),
        title: element?.name,
        description:
          element?.institution?.id ===
          this.common.constantsData.PRIVATE_INSTITUTION_ID
            ? this.translate.instant(
                'PHOTO_SEARCH_ENGINE.OTHER_INSTITUTION_LABEL',
              )
            : element.institution?.name,
        image: element?.imagesData.sort(
          (a: { id: number }, b: { id: number }) => a.id - b.id,
        )[0],
        extra_folder: element?.imagesData.sort(
          (a: { id: number }, b: { id: number }) => a.id - b.id,
        )[0]?.extra_folder,
        date: this.common.checkWorkDate(element.date),
        born_date: element?.author?.born_date,
        death_date: element?.author?.death_date,
        date_copy: element.date_copy,
      });
    });

    this.totalCount = allWorkFilteredData.length;
    this.isLoading = false;
  }

  returnFilterData() {
    return this.dataStore.photographPageData.allWorksData.filter(
      (data: Work) => {
        // Search filter
        const isSearchMatched =
          this.searchResult && this.searchResult.length > 0
            ? (() => {
                const name = this.common.normalizeName(
                  data.name ? data.name : '',
                );
                return name
                  .toLowerCase()
                  .includes(
                    this.common.normalizeName(
                      this.searchResult.trim().toLowerCase(),
                    ),
                  );
              })()
            : true;

        const isDateMatched =
          this.dateForm.get('date')?.value &&
          this.dateForm.get('date')?.value.length > 0
            ? (() => {
                return data?.date?.includes(this.dateForm.get('date')?.value);
              })()
            : true;

        const isAuthorMatch =
          this.selectedAuthors.length > 0
            ? data.id_author &&
              data.author &&
              this.selectedAuthors.some(
                (author: IFilterItem) => author.id === data.id_author,
              )
            : true;

        const isInstitutionMatch =
          this.selectedInstitutions.length > 0
            ? data.id_institution &&
              data.institution &&
              this.selectedInstitutions.some(
                (institution: IFilterItem) =>
                  institution.id === data.id_institution,
              )
            : true;

        const isRightMatch =
          this.selectedRights.length > 0
            ? data.id_rights &&
              this.selectedRights.some(
                (right: IFilterItem) => right.id === data.id_rights,
              )
            : true;

        const isTechniqueMatch =
          this.selectedTechnique.length > 0
            ? (() => {
                if (data.techniqueData && data.techniqueData.length > 0) {
                  return this.selectedTechnique.some(
                    (selectedTech: IFilterItem) =>
                      data.techniqueData?.some(
                        (techData: ITechnique) =>
                          techData.id_technique &&
                          techData.id_technique === selectedTech.id,
                      ),
                  );
                }
                return false;
              })()
            : true;

        const isDecadeMatch =
          this.selectedDecades.length > 0
            ? (() => {
                if (data.decades) {
                  const splitDecadeData = data.decades.split('-');
                  const workDecade = parseInt(
                    this.common.extractYear(splitDecadeData[0]).trim(),
                  );
                  return this.selectedDecades.some((decadeRange: IDecade) => {
                    if (decadeRange.name) {
                      const splitYearData = decadeRange.name.split('-');
                      if (splitYearData.length > 1) {
                        const startYear = parseInt(splitYearData[0]);
                        const endYear = parseInt(splitYearData[1]);
                        return workDecade >= startYear && workDecade <= endYear;
                      }
                    }
                    return false;
                  });
                }
                return false;
              })()
            : true;

        const isType1TagsMatch =
          this.type1SelectedTags.length > 0
            ? (() => {
                if (data.tagsData && data.tagsData.length > 0) {
                  return this.type1SelectedTags.some(
                    (selectedTag: IFilterItem) =>
                      data.tagsData?.some(
                        (tagData: ITagData) =>
                          tagData.id_tag && tagData.id_tag === selectedTag.id,
                      ),
                  );
                }
                return false;
              })()
            : true;

        const isType2TagsMatch =
          this.type2SelectedTags.length > 0
            ? (() => {
                if (data.tagsData && data.tagsData.length > 0) {
                  return this.type2SelectedTags.some(
                    (selectedTag: IFilterItem) =>
                      data.tagsData?.some(
                        (tagData: ITagData) =>
                          tagData.id_tag && tagData.id_tag === selectedTag.id,
                      ),
                  );
                }
                return false;
              })()
            : true;

        const isType3TagsMatch =
          this.type3SelectedTags.length > 0
            ? (() => {
                if (data.tagsData && data.tagsData.length > 0) {
                  return this.type3SelectedTags.some(
                    (selectedTag: IFilterItem) =>
                      data.tagsData?.some(
                        (tagData: ITagData) =>
                          tagData.id_tag && tagData.id_tag === selectedTag.id,
                      ),
                  );
                }
                return false;
              })()
            : true;

        return (
          isSearchMatched &&
          isDateMatched &&
          isAuthorMatch &&
          isTechniqueMatch &&
          isInstitutionMatch &&
          isRightMatch &&
          isDecadeMatch &&
          isType1TagsMatch &&
          isType2TagsMatch &&
          isType3TagsMatch
        );
      },
    );
  }

  searchDate(search: string) {
	  this.searchDateSubject$.next(search)
  }


  private setupDebouncedSearch(): void {
    this.searchDateSubject$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((search: string) => {
          this.dataStore.photographPageData.filter.searchDate = search.trim();
          this.localPayload.authorActivePage = 1;
          this.imageList = [];
          this.checkFilterData();
      });
  }

  receiveDataFromChild(data: { selectedValues: filter[]; type: string }) {
    switch (data.type) {
      case this.common.constantsData.WORK_FILTER_TYPE.AUTHORS:
        this.selectedAuthors = data.selectedValues;
        this.dataStore.photographPageData.filter.selectedAuthors =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.INSTITUTION:
        this.selectedInstitutions = data.selectedValues;
        this.dataStore.photographPageData.filter.selectedInstitutions =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.TECHNIQUES:
        this.selectedTechnique = data.selectedValues;
        this.dataStore.photographPageData.filter.selectedTechnique =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.RIGHTS:
        this.selectedRights = data.selectedValues;
        this.dataStore.photographPageData.filter.selectedRights =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.TYPE_1_TAG:
        this.type1SelectedTags = data.selectedValues;
        this.dataStore.photographPageData.filter.type1SelectedTags =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.TYPE_2_TAG:
        this.type2SelectedTags = data.selectedValues;
        this.dataStore.photographPageData.filter.type2SelectedTags =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.TYPE_3_TAG:
        this.type3SelectedTags = data.selectedValues;
        this.dataStore.photographPageData.filter.type3SelectedTags =
          data.selectedValues;
        break;
      case this.common.constantsData.WORK_FILTER_TYPE.DECADE:
        this.selectedDecades = data.selectedValues;
        this.dataStore.photographPageData.filter.selectedDecades =
          data.selectedValues;
        break;
      default:
        break;
    }
    this.isShowViewMore = false;
    this.imageList = [];
    this.mergeItems();
    this.localPayload.authorActivePage = 1;
    this.checkFilterData();
  }

  mergeItems() {
    this.selectedItem = [
      ...this.selectedAuthors,
      ...this.selectedInstitutions,
      ...this.selectedCollections,
      ...this.selectedTechnique,
      ...this.selectedRights,
      ...this.selectedDecades,
      ...this.type1SelectedTags,
      ...this.type2SelectedTags,
      ...this.type3SelectedTags,
    ];
  }

  removeItem(event: filter) {
    const indexAuthors = this.selectedAuthors.indexOf(event);
    if (indexAuthors >= 0) {
      this.selectedAuthors.splice(indexAuthors, 1);
      this.dataStore.photographPageData.filter.selectedAuthors =
        this.selectedAuthors;
    }
    const indexInstitution = this.selectedInstitutions.indexOf(event);
    if (indexInstitution >= 0) {
      this.selectedInstitutions.splice(indexInstitution, 1);
      this.dataStore.photographPageData.filter.selectedInstitutions =
        this.selectedInstitutions;
    }
    const indexCollections = this.selectedCollections.indexOf(event);
    if (indexCollections >= 0) {
      this.selectedCollections.splice(indexCollections, 1);
      this.dataStore.photographPageData.filter.selectedCollections =
        this.selectedCollections;
    }
    const indexTechnique = this.selectedTechnique.indexOf(event);
    if (indexTechnique >= 0) {
      this.selectedTechnique.splice(indexTechnique, 1);
      this.dataStore.photographPageData.filter.selectedTechnique =
        this.selectedTechnique;
    }
    const indexRights = this.selectedRights.indexOf(event);
    if (indexRights >= 0) {
      this.selectedRights.splice(indexRights, 1);
      this.dataStore.photographPageData.filter.selectedRights =
        this.selectedRights;
    }

    const type1TagIndex = this.type1SelectedTags.indexOf(event);
    if (type1TagIndex >= 0) {
      this.type1SelectedTags.splice(type1TagIndex, 1);
      this.dataStore.photographPageData.filter.type1SelectedTags =
        this.type1SelectedTags;
    }

    const type2TagIndex = this.type2SelectedTags.indexOf(event);
    if (type2TagIndex >= 0) {
      this.type2SelectedTags.splice(type2TagIndex, 1);
      this.dataStore.photographPageData.filter.type2SelectedTags =
        this.type2SelectedTags;
    }

    const type3TagIndex = this.type3SelectedTags.indexOf(event);
    if (type3TagIndex >= 0) {
      this.type3SelectedTags.splice(type3TagIndex, 1);
      this.dataStore.photographPageData.filter.type3SelectedTags =
        this.type3SelectedTags;
    }

    const indexDecade = this.selectedDecades.indexOf(event);
    if (indexDecade >= 0) {
      this.selectedDecades.splice(indexDecade, 1);
      this.dataStore.photographPageData.filter.selectedDecades =
        this.selectedDecades;
    }

    this.isShowViewMore = false;
    this.isLoading = true;
    this.imageList = [];
    this.localPayload.authorActivePage = 1;
    this.checkFilterData();
  }

  changeOrder(value: string) {
    this.sortBy = value;
    this.dataStore.photographPageData.sortingOrder = value;
    this.sortItems(this.sortBy);
  }

  sortItems(value: string) {
    if (value === this.common.constantsData.SORT_BY.ASC) {
      this.dataStore.photographPageData.allWorksData.sort((a, b) =>
        (a.name || '')
          .trim()
          .toLowerCase()
          .localeCompare((b.name || '').trim().toLowerCase()),
      );
    } else if (value === this.common.constantsData.SORT_BY.DESC) {
      this.dataStore.photographPageData.allWorksData.sort((a, b) =>
        (b.name || '')
          .trim()
          .toLowerCase()
          .localeCompare((a.name || '').trim().toLowerCase()),
      );
    } else {
      this.dataStore.photographPageData.allWorksData.sort(
        () => Math.random() - 0.5,
      );
    }
    this.checkFilterData();
  }

  getALLRights() {
    const payload = {
      search: '',
      sortBy: this.common.constantsData.SORT_BY.ASC,
    };
    this.dropDownLoader = true;
    this.apiService
      .post(`${environment.GET_WORK_RIGHTS}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: rights) => {
          this.dropDownLoader = false;
          if (response.data && !response.is_error) {
            if (response.data.rights.length > 0) {
              response.data.rights.forEach((element: rightRes) => {
                if (
                  element.worksRightsCount &&
                  element.worksRightsCount > 0 &&
                  element.works_rights_languages &&
                  element.works_rights_languages.length > 0 &&
                  element.works_rights_languages[0].name
                ) {
                  this.rightsBackupData.push({
                    name: element.works_rights_languages[0].name,
                    id: element.id,
                    count: element.worksRightsCount,
                  });
                }
              });
              this.rights = [...this.rightsBackupData];
              this.afterLoadeCheckFilter();
            }
          }
        },
      });
  }

  getAlltechniqueById() {
    const payload = {
      search: '',
      sortBy: this.common.constantsData.SORT_BY.ASC,
    };
    this.dropDownLoader = true;
    this.apiService
      .post(`${environment.GLOSSARY_LIST}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.dropDownLoader = false;
          if (response.data && !response.is_error) {
            response.data.glossary.forEach((element: workTechnique) => {
              if (
                element.works_techniques_languages &&
                element.works_techniques_languages.length > 0 &&
                element.worksTechniqueCount &&
                element.worksTechniqueCount > 0
              ) {
                this.techniquesBackup.push({
                  id: element.works_techniques_languages[0]?.id_technique,
                  name: element.works_techniques_languages[0]?.name,
                  count: element.worksTechniqueCount,
                });
              }
            });

            this.techniques = [...this.techniquesBackup];
            this.afterLoadeCheckFilter();
          }
        },
      });
  }

  afterLoadeCheckFilter() {
    if (
      ((this.searchResult && this.searchResult.length > 0) ||
        (this.dateForm.get('date')?.value &&
          this.dateForm.get('date')?.value.length > 0) ||
        this.selectedAuthors.length > 0 ||
        this.selectedDecades.length > 0 ||
        this.selectedTechnique.length > 0 ||
        this.selectedInstitutions.length > 0 ||
        this.selectedRights.length > 0 ||
        this.type1SelectedTags.length > 0 ||
        this.type2SelectedTags.length > 0 ||
        this.type3SelectedTags.length > 0) &&
      this.dataStore.photographPageData.allWorksData.length > 0 &&
      this.dataStore.photographPageData.allWorksData.length > 0
    ) {
      this.authors = [];
      this.decades = [];
      this.techniques = [];
      this.institutions = [];
      this.rights = [];
      this.type1TagsData = [];
      this.type2TagsData = [];
      this.type3TagsData = [];

      this.returnFilterData().forEach((element: Work) => {
        this.setFilterData(element);
      });
    }
  }

  getAllTypesTags() {
    const payload = {
      search: '',
      sortBy: this.common.constantsData.SORT_BY.ASC,
      for_works: true,
      types: [1, 2, 3],
    };

    this.dropDownLoader = true;

    this.apiService
      .post(`${environment.GET_WORK_TAGS}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.dropDownLoader = false;
          if (response.data && !response.is_error) {
            this.allTagsData = [...response.data.tags];
            this.allTagsData.forEach((element: ITags) => {
              if (
                element &&
                element.worksTagCount > 0 &&
                element.tags_languages &&
                element.tags_languages.length > 0 &&
                element.tags_languages[0].name
              ) {
                switch (element.id_type) {
                  case 1:
                    this.type1TagsData.push({
                      id: element.id,
                      name: element.tags_languages[0].name,
                      count: element.worksTagCount,
                    });
                    break;

                  case 2:
                    this.type2TagsData.push({
                      id: element.id,
                      name: element.tags_languages[0].name,
                      count: element.worksTagCount,
                    });
                    break;

                  case 3:
                    this.type3TagsData.push({
                      id: element.id,
                      name: element.tags_languages[0].name,
                      count: element.worksTagCount,
                    });
                    break;

                  default:
                    break;
                }
              }
            });
            this.afterLoadeCheckFilter();
          }
        },
        error: () => {
          this.dropDownLoader = false;
        },
      });
  }

  viewChange(type: string) {
    this.view = type;
    this.dataStore.photographPageData.photographPageView = this.view;
    this.isShowViewMore = false;
  }

  setFilterData(element: Work) {
    if (element.id_author && element.author) {
      const authorIndex = this.authors.findIndex(
        (f: { id: number }) => f.id == element.id_author,
      );
      if (authorIndex >= 0) {
        this.authors[authorIndex].count++;
      } else {
        let authorFullName = '';
        if (element.author.surnames) {
          authorFullName = element.author.surnames;
        }
        if (element.author.name) {
          if (element.author.surnames) {
            authorFullName += ', ';
          }
          authorFullName += element.author.name;
        }
        if(element.author.name === constants.NO_AUTHOR){
          this.authors.push({
          id: element.id_author,
          name: this.common.checkAuthorName(element.author),
          count: 1,
          })
        } else{
          this.authors.push({
          id: element.id_author,
          name: authorFullName,
          count: 1,
        });
        }
        this.authors = this.sortAsendingData(this.authors);
      }
    }

    if (element.id_institution && element.institution) {
      const institutionIndex = this.institutions.findIndex(
        (f: { id: number }) => f.id == element.id_institution,
      );
      if (institutionIndex >= 0) {
        this.institutions[institutionIndex].count++;
      } else {
        let institutionName = '';
        if (
          element.institution.id ===
          this.common.constantsData.PRIVATE_INSTITUTION_ID
        ) {
          institutionName = this.translate.instant(
            'PHOTO_SEARCH_ENGINE.OTHER_INSTITUTION_LABEL',
          );
        } else {
          institutionName = element.institution.name;
        }
        this.institutions.push({
          id: element.id_institution,
          name: institutionName,
          count: 1,
        });
        this.institutions = this.sortAsendingData(this.institutions);
      }
    }

    if (element.tagsData && element.tagsData.length > 0) {
      element.tagsData.forEach((tagData: ITagData) => {
        if (tagData.id_tag) {
          const findedTag = this.allTagsData.find(
            (f: Tag) => f.id == tagData.id_tag,
          );
          if (findedTag) {
            switch (findedTag.id_type) {
              case 1: {
                const tagType1Index = this.type1TagsData.findIndex(
                  (f: { id: number }) => f.id == tagData.id_tag,
                );
                if (tagType1Index >= 0) {
                  this.type1TagsData[tagType1Index].count++;
                } else {
                  this.type1TagsData.push({
                    id: findedTag.id,
                    name: findedTag.tags_languages[0].name,
                    count: 1,
                  });
                  this.type1TagsData = this.sortAsendingData(
                    this.type1TagsData,
                  );
                }
                break;
              }
              case 2: {
                const tagType2Index = this.type2TagsData.findIndex(
                  (f: { id: number }) => f.id == tagData.id_tag,
                );
                if (tagType2Index >= 0) {
                  this.type2TagsData[tagType2Index].count++;
                } else {
                  this.type2TagsData.push({
                    id: findedTag.id,
                    name: findedTag.tags_languages[0].name,
                    count: 1,
                  });
                  this.type2TagsData = this.sortAsendingData(
                    this.type2TagsData,
                  );
                }
                break;
              }
              case 3: {
                const tagType3Index = this.type3TagsData.findIndex(
                  (f: { id: number }) => f.id == tagData.id_tag,
                );
                if (tagType3Index >= 0) {
                  this.type3TagsData[tagType3Index].count++;
                } else {
                  this.type3TagsData.push({
                    id: findedTag.id,
                    name: findedTag.tags_languages[0].name,
                    count: 1,
                  });
                  this.type3TagsData = this.sortAsendingData(
                    this.type3TagsData,
                  );
                }
                break;
              }
              default:
                break;
            }
          }
        }
      });
    }

    if (element.decades) {
      const splitDecadeData = element.decades.split('-');
      const workDecade = parseInt(
        this.common.extractYear(splitDecadeData[0]).trim(),
      );

      this.decadesBackup.forEach((decadeRange: { name: string }) => {
        if (decadeRange.name) {
          const splitYearData = decadeRange.name.split('-');
          if (splitYearData.length > 1) {
            const startYear = parseInt(splitYearData[0], 10);
            const endYear = parseInt(splitYearData[1], 10);
            if (workDecade >= startYear && workDecade <= endYear) {
              const decadeIndex = this.decades.findIndex(
                (f: { id: string }) => f.id == decadeRange.name,
              );
              if (decadeIndex >= 0) {
                this.decades[decadeIndex].count++;
              } else {
                this.decades.push({
                  id: decadeRange.name,
                  name: decadeRange.name,
                  count: 1,
                });

                this.decades = this.common.sortRangeDecade(this.decades);
              }
            }
          }
        }
      });
    }

    if (element.id_rights) {
      const rightIndex = this.rights.findIndex(
        (f: { id: number }) => f.id == element.id_rights,
      );
      if (rightIndex >= 0) {
        this.rights[rightIndex].count++;
      } else {
        const findRightsData = this.rightsBackupData.find(
          (f: { id: number }) => f.id == element.id_rights,
        );
        if (findRightsData) {
          this.rights.push({
            id: findRightsData.id,
            name: findRightsData.name,
            count: 1,
          });
          this.rights = this.sortAsendingData(this.rights);
        }
      }
    }

    if (element.techniqueData && element.techniqueData.length > 0) {
      element.techniqueData.forEach(
        (technData: { id_technique: number; id_work: number }) => {
          if (technData && technData.id_technique) {
            const techniqueIndex = this.techniques.findIndex(
              (f: { id: number }) => f.id == technData.id_technique,
            );
            if (techniqueIndex >= 0) {
              this.techniques[techniqueIndex].count++;
            } else {
              const findTechnData = this.techniquesBackup.find(
                (f: { id: number }) => f.id == technData.id_technique,
              );
              if (findTechnData) {
                this.techniques.push({
                  id: findTechnData.id,
                  name: findTechnData.name,
                  count: 1,
                });
                this.techniques = this.sortAsendingData(this.techniques);
              }
            }
          }
        },
      );
    }
  }

  sortAsendingData(data: SortableData[]) {
    return data.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
    );
  }

  openDialog(template: TemplateRef<null>) {
    this.dialogRef = this.dialog.open(template, {
      autoFocus: false,
    });
  }

  redirectToDetailPage(item: string) {
    this.dataStore.photographPageData.photographPageScrollId = item;
    this.router.navigate([`${this.common.getRoute('PHOTO_SEARCHER')}/${item}`]);
  }

  loadedMasonaryData(isLoaded: boolean) {
    if (isLoaded && !this.isLoading) {
      this.isShowViewMore = true;
      if (this.comparisonResult === true) {
        const targetId =
          this.dataStore.photographPageData.photographPageScrollId;
        this.common.scrollToElementById(targetId);
        this.dataStore.photographPageData.photographPageScrollId = '';
      }
    }
  }

  showMore() {
    this.localPayload.authorActivePage++;
    this.dataStore.photographPageData.activePage =
      this.localPayload.authorActivePage;
    this.checkFilterData();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
    this.common.previousPageUrl.next('');
  }
}
