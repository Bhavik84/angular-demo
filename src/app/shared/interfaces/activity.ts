export interface Activity {
  id: number;
  organizer: string;
  address: string;
  contact: number;
  inscription: string;
  public: string;
  url: string;
  initial_date: string;
  final_date: string;
  dates: string;
  hourly: string;
  duration: string;
  subtype: string;
  id_segment: number;
  id_type: number;
  date_insert: string;
  slug: string;
  date_update: string;
  active: boolean;
  activities_segment: ActivitiesSegment;
  activities_type: {
    id: number;
    name: string;
    activities_types_languages: {
      id_activity_type: number;
      id_language: number;
      name: string;
    }[];
  };
  activities_images: ILanguageImages[];
  activities_languages: {
    description: string;
    id_activity: string;
    id_language: string;
    price: string;
    when: string;
    name: string;
  }[];
  languageData: [];
  activities_activities_segments: IActivitySegment[];
  activities_language_images: ILanguageImages[];
}

export interface ActivitiesSegmentsLanguage {
  id_activity_segment: number;
  id_language: number;
  name: string;
}

export interface ActivitiesSegment {
  id: number;
  name: string;
  activities_segments_languages: ActivitiesSegmentsLanguage[];
}

export interface ActivityApiResponse {
  data: Activity[];
  is_error: boolean;
  message: string;
}

export interface IActivitySegment {
  id_activity: number;
  id_segment: number;
  activities_segment: {
    id: number;
    name: string;
    activities_segments_languages?: {
      id_activity_segment: number;
      id_language: number;
      name: string;
    }[];
  };
}

export interface image {
  id: number;
  url: string;
  id_activity: number;
}

export interface activitySegment {
  id: number;
  activitiySegmentCount: number;
  activities_segments_languages: languages[];
}

export interface languages {
  id?: number;
  name: string;
}
export interface IActivity {
  id: number;
  organizer: string;
  address: string;
  contact: string;
  inscription: string;
  public: string;
  url: string;
  initial_date: string;
  final_date: string;
  dates: string;
  hourly: string;
  duration: string;
  subtype: string;
  id_segment: number;
  id_type: number;
  date_insert: string;
  date_update: string;
  active: boolean;
  activities_segment: {
    id: number;
    name: string;
  };
  activities_type: {
    id: number;
    name: string;
  };
  responseLangData: [
    {
      id_activity: number;
      id_language: number;
      description: string;
      name: string;
      activitieImgData: [
        {
          id: number;
          url: string;
          id_activity: number;
          id_image: number;
          id_language: number;
          title: string;
          description: string;
          alt: string;
        },
      ];
    },
  ];
}

export interface IActivityData {
  data : ActivityDetails;
  is_error : boolean;
  message : string
}
export interface ActivityDetails {
  id: number;
  organizer: string;
  address: string;
  contact: string;
  inscription: string;
  url: string;
  initial_date: string;
  final_date: string;
  dates: string;
  hourly: string;
  duration: string;
  subtype: string;
  id_segment: number;
  id_type: number;
  date_insert: string;
  date_update: string;
  active: boolean;
  activities_segment: {
    id: number;
    name: string;
  };
  activities_activities_segments: {
    id: number;
    name: string;
    activities_segments_languages: {
      id_activity_segment: number;
      id_language: number;
      name: string;
    };
  };
  activities_images: ILanguageImages[];
  activities_languages: {
    description: string;
    id_activity: number;
    id_language: number;
    name: string;
  }[];
  activities_tags: {
    id_activity: number;
    id_tag: number;
    tag: string;
  };
  activities_type: {
    id: number;
    name: string;
    activities_types_languages: {
      id_activity_type: number;
      id_language: number;
      name: string;
    };
  };
  activities_language_images: ILanguageImages[];
}

export interface ICalendarSearchPageData {
  selectedTab: number | string;
  selectedFromDate: string;
  selectedToDate: string;
  selectedType: { id: number; name: string }[];
  selectedSegement: { id: number; name: string }[];
  allActivityData: Activity[];
  onGoingActivityScrollId: string;
  pastActivityScrollId: string;
  activePage: number;
  currentMonth:Date;
}

export interface ILanguageImages {
  id: number;
  url: string;
  id_resource: number;
  activities_images_languages: IImageLanguages[];
}
export interface IImageLanguages {
  alt: string;
  description: string;
  id_image: number;
  id_language: number;
  titl: number;
}
