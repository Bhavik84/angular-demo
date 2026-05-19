export interface Slider {
  slidesToShow?: number;
  slidesToScroll?: number;
  centerMode?: boolean;
  centerPadding?: string;
  responsive?: object;
  arrows?: boolean;
  focusOnSelect?: boolean;
  infinite?: boolean;
}

export interface slick {
  slideConfig: Slider;
  showThumbnail: boolean;
  slickItemClass: string;
  slickClass: string;
  showTitle: boolean;
}
