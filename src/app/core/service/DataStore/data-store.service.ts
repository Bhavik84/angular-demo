import { Injectable } from '@angular/core';
import { ICalendarSearchPageData } from '../../../shared/interfaces/activity';
import { IBehindCameraPageData } from '../../../shared/interfaces/blog';
import {
  IAcquisitionsPageData,
  IBlogPageData,
  IGlossaryPageData,
  IPhotographPageData,
  IResearchPageData,
} from '../../../shared/interfaces/common';
import {
  IArtWorkFundPageData,
  IInstitute,
} from '../../../shared/interfaces/institute';
import { PhotographersPageData } from '../../../shared/interfaces/photographer';
import { constants } from '../../enums/constants';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
  // Photographers page data store
  public photographersPageData: PhotographersPageData = {
    searchData: '',
    searchDataDetails: '',
    sortingOrder: '',
    limit: constants.LIMIT.TWENTY_FOUR,
    offset: 0,
    totalCount: 0,
    imageList: [],
    authorData: [],
    photographersPageView: constants.VIEWS.GRID,
    filter: {
      selectedYears: [],
      type1SelectedTags: [],
      type3SelectedTags: [],
      isLivingAuthor: false,
      isWomenPhotographer: false,
    },
    photographerPageScrollId: '',
    photographerDetailPageScrollId: '',
    photographerDetailPageView: constants.VIEWS.GRID,
    photographerDetailPageData:[],
    photographerDetailPageId:'',
    photographerDetailPageActivePage:1
  };

  // Institute page data store
  public institutePageData: IInstitute = {
    searchData: '',
    sortingOrder: '',
    institutionData: [],
    imageList: [],
    institutionPageScrollId: '',
    institutionPageView: constants.VIEWS.GRID,
    activePage: 1,
    institutionDetailPageTabIndex: 0,
    institutionDetailSearchTerm: '',
    institutionDetailScrollId: '',
    institutionDetailView: constants.VIEWS.GRID,
    institutionDetailWorkData:[],
    institutionDetailId:'',
    institutionDetailActivePage:1
  };

  // Artwork page data store
  public artWorkFundPageData: IArtWorkFundPageData = {
    searchData: '',
    sortingOrder: '',
    collectionData: [],
    imageList: [],
    fundsScrollId: '',
    fundsView: constants.VIEWS.GRID,
    fundsDetailScrollId: '',
    fundsDetailView: constants.VIEWS.GRID,
    activePage: 1,
    detailPagelimit: constants.LIMIT.TWENTY_FOUR,
    detailPageoffset: 0,
    detailPageSearchTerm: '',
    detailPageWorkData:[],
    detailPageCollectionId:'',
    detailPageWorkActivepage:1
  };

  // Photograph page data store
  public photographPageData: IPhotographPageData = {
    searchData: '',
    sortingOrder: '',
    limit: constants.LIMIT.TWENTY_FOUR,
    offset: 0,
    totalCount: 0,
    allWorksData: [],
    imageList: [],
    photographPageView: constants.VIEWS.GRID,
    filter: {
      selectedAuthors: [],
      selectedDecades: [],
      selectedTechnique: [],
      selectedInstitutions: [],
      selectedRights: [],
      selectedTags: [],
      selectedCollections: [],
      searchDate: '',
      type1SelectedTags: [],
      type2SelectedTags: [],
      type3SelectedTags: [],
    },
    photographPageScrollId: '',
    activePage: 1,
  };

  // Acquisitions page data store
  public acquisitionsPageData: IAcquisitionsPageData = {
    selectedYear: '',
    selectedAuthors: [],
    auquisitionsPageScrollId: '',
  };

  // Research page data store
  public researchPageData: IResearchPageData = {
    searchData: '',
    selectedResourceType: [],
    selectedFormats: [],
    resourceData: [],
    researchPageScrollId: '',
  };

  // Glossary page data store
  public glossaryPageData: IGlossaryPageData = {
    selectedGlossary: 0,
    selectedTechnique: 0,
    isDecadeSearch: false,
    decadesData: [],
    techniquesData: [],
    worksData: [],
    glossaryPageScrollId: '',
    activePage: 1,
  };

  // Blog page data store
  public blogPageData: IBlogPageData = {
    searchData: '',
    searchDate: '',
    selectedTags: [],
    selectedAuthors: [],
    selectedCategories: [],
    limit: 10,
    offset: 1,
    totalCount: 0,
    blogData: [],
    blogList: [],
    blogPageScrollId: '',
  };

  // Behind camare page data store
  public behindCameraPageData: IBehindCameraPageData = {
    searchData: '',
    blogsData: [],
    imageList: [],
    behindTheCameraScrollId: '',
    activePage: 1,
  };

  // Calendar search data
  public calendarSearchPageData: ICalendarSearchPageData = {
    selectedTab: '',
    selectedFromDate: '',
    selectedToDate: '',
    selectedType: [],
    selectedSegement: [],
    allActivityData: [],
    onGoingActivityScrollId: '',
    pastActivityScrollId: '',
    activePage: 1,
    currentMonth :new Date()
  };

  constructor() {}

  resetPhotographPageData() {
    this.photographPageData = {
      searchData: '',
      sortingOrder: '',
      limit: constants.LIMIT.TWENTY_FOUR,
      offset: 0,
      totalCount: 0,
      allWorksData: [],
      imageList: [],
      photographPageView: constants.VIEWS.GRID,
      filter: {
        selectedAuthors: [],
        selectedDecades: [],
        selectedTechnique: [],
        selectedInstitutions: [],
        selectedRights: [],
        selectedTags: [],
        selectedCollections: [],
        searchDate: '',
        type1SelectedTags: [],
        type2SelectedTags: [],
        type3SelectedTags: [],
      },
      photographPageScrollId: '',
      activePage: 1,
    };
  }

  resetArtWorkFundPageData() {
    this.artWorkFundPageData = {
      searchData: '',
      sortingOrder: '',
      collectionData: [],
      imageList: [],
      fundsScrollId: '',
      fundsView: constants.VIEWS.GRID,
      fundsDetailScrollId: '',
      activePage: 1,
      detailPagelimit: constants.LIMIT.TWENTY_FOUR,
      detailPageoffset: 0,
      detailPageSearchTerm: '',
      fundsDetailView: constants.VIEWS.GRID,
      detailPageWorkData:[],
      detailPageCollectionId:'',
      detailPageWorkActivepage:1
    };
  }

  resetPhotographersPageData() {
    this.photographersPageData = {
      searchData: '',
      sortingOrder: '',
      limit: constants.LIMIT.TWENTY_FOUR,
      offset: 0,
      totalCount: 0,
      imageList: [],
      authorData: [],
      photographersPageView: constants.VIEWS.GRID,
      filter: {
        selectedYears: [],
        type1SelectedTags: [],
        type3SelectedTags: [],
        isLivingAuthor: false,
        isWomenPhotographer: false,
      },
      photographerPageScrollId: '',
      photographerDetailPageScrollId: '',
      photographerDetailPageView: constants.VIEWS.GRID,
      photographerDetailPageData:[],
      photographerDetailPageId:'',
      photographerDetailPageActivePage:1,
    };
  }

  resetInstitutePageData() {
    this.institutePageData = {
      searchData: '',
      sortingOrder: '',
      institutionData: [],
      imageList: [],
      institutionPageScrollId: '',
      institutionPageView: constants.VIEWS.GRID,
      activePage: 1,
      institutionDetailPageTabIndex: 0,
      institutionDetailSearchTerm: '',
      institutionDetailScrollId: '',
      institutionDetailView: constants.VIEWS.GRID,
      institutionDetailWorkData:[],
      institutionDetailId:'',
      institutionDetailActivePage:1
    };
  }

  resetResearchPageData() {
    this.researchPageData = {
      searchData: '',
      selectedResourceType: [],
      selectedFormats: [],
      resourceData: [],
      researchPageScrollId: '',
    };
  }

  resetBehindCameraPageData() {
    this.behindCameraPageData = {
      searchData: '',
      blogsData: [],
      imageList: [],
      behindTheCameraScrollId: '',
      activePage: 1,
    };
  }

  resetBlogPageData() {
    this.blogPageData = {
      searchData: '',
      searchDate: '',
      selectedTags: [],
      selectedAuthors: [],
      selectedCategories: [],
      limit: 10,
      offset: 0,
      totalCount: 0,
      blogList: [],
      blogData: [],
      blogPageScrollId: '',
    };
  }

  resetCalendarPageData() {
    this.calendarSearchPageData = {
      selectedTab: 0,
      selectedFromDate: '',
      selectedToDate: '',
      selectedType: [],
      selectedSegement: [],
      allActivityData: [],
      onGoingActivityScrollId: '',
      pastActivityScrollId: '',
      activePage: 1,
      currentMonth :new Date()
    };
  }

  resetGlossaryPageData() {
    this.glossaryPageData = {
      selectedGlossary: 0,
      selectedTechnique: 0,
      isDecadeSearch: false,
      decadesData: [],
      techniquesData: [],
      worksData: [],
      glossaryPageScrollId: '',
      activePage: 1,
    };
  }

  // Reseting the filter on the menu click

  resetPhotographFilters(){
      this.photographPageData.searchData = '';
      this.photographPageData.sortingOrder = '';
      this.photographPageData.limit = constants.LIMIT.TWENTY_FOUR;
      this.photographPageData.offset = 0;
      this.photographPageData.totalCount = 0;
      this.photographPageData.photographPageView = constants.VIEWS.GRID;
      this.photographPageData.filter = {
        selectedAuthors: [],
        selectedDecades: [],
        selectedTechnique: [],
        selectedInstitutions: [],
        selectedRights: [],
        selectedTags: [],
        selectedCollections: [],
        searchDate: '',
        type1SelectedTags: [],
        type2SelectedTags: [],
        type3SelectedTags: [],
      }
  }

  resetPhotographerFilters(){
    this.photographersPageData.searchData = '';
    this.photographersPageData.sortingOrder = '';
    this.photographersPageData.limit = constants.LIMIT.TWENTY_FOUR;
    this.photographersPageData.offset = 0;
    this.photographersPageData.totalCount = 0;
    this.photographersPageData.photographersPageView = constants.VIEWS.GRID;
    this.photographersPageData.filter = {
      selectedYears: [],
      type1SelectedTags: [],
      type3SelectedTags: [],
      isLivingAuthor: false,
      isWomenPhotographer: false,
      }
  }

  resetInstituteFilters(){
    this.institutePageData.searchData = '';
    this.institutePageData.sortingOrder = '';
    this.institutePageData.institutionPageScrollId = '';
    this.institutePageData.institutionPageView = constants.VIEWS.GRID;
    this.institutePageData.activePage = 1;
  }

  resetFundsFilters(){
    this.artWorkFundPageData.searchData = '';
    this.artWorkFundPageData.sortingOrder = '';
    this.artWorkFundPageData.fundsScrollId = '';
    this.artWorkFundPageData.fundsView = constants.VIEWS.GRID;
    this.artWorkFundPageData.activePage = 1;
  }

  resetCalendarFilters(){
    this.calendarSearchPageData.selectedFromDate = '';
    this.calendarSearchPageData.selectedToDate = '';
    this.calendarSearchPageData.selectedType = [];
    this.calendarSearchPageData.selectedSegement = [];
    this.calendarSearchPageData.onGoingActivityScrollId = '';
    this.calendarSearchPageData.pastActivityScrollId = '';
    this.calendarSearchPageData.activePage = 1;
    this.calendarSearchPageData.currentMonth = new Date();
  }

  resetGlossaryFilters(){
    this.glossaryPageData.selectedGlossary = 0;
    this.glossaryPageData.selectedTechnique = 0;
    this.glossaryPageData.isDecadeSearch = false;
    this.glossaryPageData.glossaryPageScrollId = '';
    this.glossaryPageData.activePage = 1;
  }

  resetBlogFilters(){
    this.blogPageData.searchData = '';
    this.blogPageData.searchDate = '';
    this.blogPageData.selectedTags = [];
    this.blogPageData.selectedAuthors = [];
    this.blogPageData.selectedCategories = [];
    this.blogPageData.limit = 10;
    this.blogPageData.offset = 0;
    this.blogPageData.totalCount = 0;
    this.blogPageData.blogPageScrollId = '';
  }

  resetBehindCameraFilters(){
    this.behindCameraPageData.searchData = '';
    this.behindCameraPageData.behindTheCameraScrollId = '';
    this.behindCameraPageData.activePage = 1;
  }

  resetNewAcquisitionsFilters(){
    this.acquisitionsPageData.selectedYear = '';
    this.acquisitionsPageData.selectedAuthors = [];
  }

  resetResearchFilters(){
    this.researchPageData.researchPageScrollId =''
    this.researchPageData.searchData =''
    this.researchPageData.selectedFormats = []
    this.researchPageData.selectedResourceType = []
  }

  resetScrollIdByPage(pageKey: string): void {
    switch (pageKey) {
      case constants.PAGE_KEYS.FUNDS:
        this.resetFundsFilters();
        break;
      case constants.PAGE_KEYS.PHOTO_SEARCHER:
      case constants.PAGE_KEYS.COLLECTIONS:
        this.resetPhotographFilters();
        break;
      case constants.PAGE_KEYS.PHOTOGRAPHER:
        this.resetPhotographerFilters();
        break;
      case constants.PAGE_KEYS.INSTITUTION:
        this.resetInstituteFilters();
        break;
      case constants.PAGE_KEYS.BEHIND_THE_CAMERA:
        this.resetBehindCameraFilters();
        break;
      case constants.PAGE_KEYS.BLOG:
        this.resetBlogFilters();
        break;
      case constants.PAGE_KEYS.GLOSSARY:
          this.resetGlossaryFilters()
        break;
      case constants.PAGE_KEYS.AGENDA:
      case constants.PAGE_KEYS.NEWS:
          this.resetCalendarFilters()
        break;
      case constants.PAGE_KEYS.NEW_ACQUISITIONS:
          this.resetNewAcquisitionsFilters()
        break
      case constants.PAGE_KEYS.RESEARCH:
          this.resetResearchFilters();
        break
      default:
        break;
    }
  }
}
