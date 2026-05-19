import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { constants } from '../../../core/enums/constants';
import { ApiService } from '../../../core/service/api/api.service';
import { CommonService } from '../../../core/service/common/common.service';
import { DataStoreService } from '../../../core/service/DataStore/data-store.service';
import { CustomFilterComponent } from '../../../shared/component/custom-filter/custom-filter.component';
import { CustomSearchComponent } from '../../../shared/component/custom-search/custom-search.component';
import { MatChipComponent } from '../../../shared/component/mat-chip/mat-chip.component';
import { ImageErrorDirective } from '../../../shared/directives/imge-error/image-error.directive';
import { filter } from '../../../shared/interfaces/alabern-portal';
import { ILocalPayload } from '../../../shared/interfaces/image';
import {
  ILanguageImages,
  resources,
} from '../../../shared/interfaces/resources';
import { SafeUrlPipe } from '../../../shared/pipes/safeUrl/safe-url.pipe';
import { SanitizeHtmlPipe } from '../../../shared/pipes/sanitizeHtml/sanitize-html.pipe';

@Component({
  selector: 'app-resource-search',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    MatIconModule,
    ImageErrorDirective,
    CustomSearchComponent,
    CustomFilterComponent,
    MatButtonModule,
    ImageErrorDirective,
    FormsModule,
    MatChipComponent,
    MatProgressSpinnerModule,
    SanitizeHtmlPipe,
    SafeUrlPipe,
  ],
  templateUrl: './resource-search.component.html',
  styleUrl: './resource-search.component.scss',
})
export class ResourceSearchComponent implements OnInit, OnDestroy {
  dialogRef!: MatDialogRef<null>;
  searchResult: string = '';
  selectedItem: { id: number; name: string }[] = [];
  selectedResourceType: { id: number; name: string }[] = [];
  selectedFormats: { id: number; name: string }[] = [];
  resourceType: { id: number; name: string; count: number }[] = [];
  formats: { id: number; name: string; count: number }[] = [];
  dropDownLoader: boolean = false;
  isLoading: boolean = true;
  private unsubscribe$ = new Subject<void>();
  path: string = environment.RESOURCES;
  totalCount: number = 0;

  @ViewChild(ImageErrorDirective) directive!: ImageErrorDirective;
  displayResourceList: resources[] = [];
  localPayload: ILocalPayload = {
    authorActivePage: 1,
    pageSize: constants.LIMIT.SIX,
  };
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    public common: CommonService,
    private dataStore: DataStoreService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    if (this.dataStore.researchPageData) {
      if (this.dataStore.researchPageData.searchData) {
        this.searchResult = this.dataStore.researchPageData.searchData;
      }

      if (
        this.dataStore.researchPageData.selectedResourceType &&
        this.dataStore.researchPageData.selectedResourceType.length > 0
      ) {
        this.selectedResourceType =
          this.dataStore.researchPageData.selectedResourceType;
      }

      if (
        this.dataStore.researchPageData.selectedFormats &&
        this.dataStore.researchPageData.selectedFormats.length > 0
      ) {
        this.selectedFormats = this.dataStore.researchPageData.selectedFormats;
      }

      this.mergeItems();
    }
    this.common.scrollTop();
    this.onReloadPage();
  }

  private onReloadPage() {
    if (
      this.dataStore.researchPageData.resourceData &&
      this.dataStore.researchPageData.resourceData.length > 0
    ) {
      this.displayResourceList = [];
      setTimeout(() => {
        this.isLoading = false;
        this.localPayload.authorActivePage = 1;
        this.checkFilterData();
      }, 0);
    } else {
      this.getAllResources();
    }
  }

  openDialog(template: TemplateRef<null>) {
    this.dialogRef = this.dialog.open(template, {
      autoFocus: false,
    });
  }

  receiveDataFromChild(data: {
    selectedValues: { id: number; name: string }[];
    type: string;
  }) {
    switch (data.type) {
      case this.common.constantsData.RESOURCE_FILTER_TYPE.RESOURCES:
        this.selectedResourceType = data.selectedValues;
        this.dataStore.researchPageData.selectedResourceType =
          data.selectedValues;
        break;
      case this.common.constantsData.RESOURCE_FILTER_TYPE.FORMATS:
        this.selectedFormats = data.selectedValues;
        this.dataStore.researchPageData.selectedFormats = data.selectedValues;
        break;
      default:
        break;
    }

    this.mergeItems();
    this.checkFilterData();
  }

  mergeItems() {
    this.selectedItem = [...this.selectedResourceType, ...this.selectedFormats];
  }

  removeItem(event: filter) {
    this.selectedFormats = this.selectedFormats.filter(
      (item) => item !== event,
    );
    this.selectedResourceType = this.selectedResourceType.filter(
      (item) => item !== event,
    );
    this.displayResourceList = [];
    this.localPayload.authorActivePage = 1;
    this.checkFilterData();
    this.dataStore.researchPageData.selectedFormats = this.selectedFormats;
    this.dataStore.researchPageData.selectedResourceType =
      this.selectedResourceType;
  }

  viewMore() {
    this.localPayload.authorActivePage++;
    this.checkFilterData();
  }

  search(value: string) {
    if (value.trim() !== this.dataStore.researchPageData.searchData) {
      this.searchResult = value;
      this.displayResourceList = [];
      this.dataStore.researchPageData.searchData = value.trim();
      this.localPayload.authorActivePage = 1;
      this.checkFilterData();
    }
  }

  async getAllResources() {
    this.isLoading = true;
    const payload = {
      search: '',
    };
    this.apiService
      .post(`${environment.GET_RESOURCES}`, payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (response.data && !response.is_error) {
            this.dataStore.researchPageData.resourceData = [
              ...response.data.resources,
            ];
            this.checkFilterData();
            this.isLoading = false;
          } else {
            this.common.error(response.message);
            this.dropDownLoader = false;
            this.isLoading = false;
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  checkFilterData() {
    const filterData = this.returnFilterData();
    this.displayResourceList = filterData?.slice(
      0,
      this.localPayload.authorActivePage * this.localPayload.pageSize,
    );
    this.resourceType = [];
    this.formats = [];
    filterData.forEach((element: resources) => {
      this.setFilterData(element);
      element.resource_language_images = this.checkImageData(element);
    });
    if (filterData?.length >= 0) {
      this.totalCount = filterData?.length;
    }
  }

  returnFilterData() {
    return this.dataStore.researchPageData.resourceData?.filter(
      (data: resources) => {
        const isSearchMatched =
          this.searchResult && this.searchResult.length > 0
            ? (() => {
                const creatorName = this.common.normalizeName(
                  data.creator_name,
                );
                const title = this.common.normalizeName(data.title);
                const year = this.common.normalizeName(data.year);
                return (
                  creatorName
                    .toLowerCase()
                    .includes(this.searchResult.trim()) ||
                  title
                    .toLowerCase()
                    .includes(
                      this.common.normalizeName(
                        this.searchResult.trim().toLowerCase(),
                      ),
                    ) ||
                  year
                    .toLowerCase()
                    .includes(
                      this.common.normalizeName(
                        this.searchResult.trim().toLowerCase(),
                      ),
                    )
                );
              })()
            : true;

        const isResourceFormatMatch =
          this.selectedFormats.length > 0
            ? (() => {
                if (data.resources_format) {
                  return this.selectedFormats.some(
                    (selectedFormat: { id: number; name: string }) =>
                      data.resources_format.id == selectedFormat.id,
                  );
                }
                return false;
              })()
            : true;

        const isResourceTypeMatch =
          this.selectedResourceType.length > 0
            ? (() => {
                if (data.resources_type) {
                  return this.selectedResourceType.some(
                    (selectedType: { id: number; name: string }) =>
                      data?.resources_type?.id == selectedType.id,
                  );
                }
                return false;
              })()
            : true;

        return isSearchMatched && isResourceFormatMatch && isResourceTypeMatch;
      },
    );
  }

  setFilterData(element: resources) {
    if (
      element.resources_type &&
      element.resources_type.resources_types_languages
    ) {
      const resourceTypeIndex = this.resourceType.findIndex(
        (f: { id: number }) => f.id == element?.resources_type?.id,
      );
      if (resourceTypeIndex >= 0) {
        this.resourceType[resourceTypeIndex].count++;
      } else {
        this.resourceType.push({
          id: element.resources_type.id,
          name: element.resources_type.resources_types_languages[0]?.name,
          count: 1,
        });
        this.resourceType = this.common.sorAsendingFilterData(
          this.resourceType,
        );
      }
    }
    if (
      element.resources_format &&
      element.resources_format.resources_formats_languages
    ) {
      const resourceFormatIndex = this.formats.findIndex(
        (f: { id: number }) => f.id == element.resources_format.id,
      );
      if (resourceFormatIndex >= 0) {
        this.formats[resourceFormatIndex].count++;
      } else {
        this.formats.push({
          id: element.resources_format.id,
          name: element.resources_format.resources_formats_languages[0]?.name,
          count: 1,
        });
        this.formats = this.common.sorAsendingFilterData(this.formats);
      }
    }
  }

  checkImageData(element: resources) {
    const filteredImages: ILanguageImages[] = [];
    if (element.resources_images && element.resources_images.length > 0) {
      const imagesWithLanguages = element.resources_images?.some(
        (img: ILanguageImages) =>
          img.resources_images_languages &&
          img.resources_images_languages.length > 0,
      );
      if (imagesWithLanguages) {
        const filteredElement = element?.resources_images?.filter(
          (img: ILanguageImages) =>
            img.resources_images_languages?.some(
              (lang) => lang.id_language === this.common.language,
            ),
        );
        if (filteredElement && filteredElement.length > 0) {
          filteredImages.push(filteredElement[0]);
        }
      } else {
        filteredImages.push(element.resources_images[0]);
      }
    }
    return filteredImages;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.common.switchLanguage.next(false);
  }
}
