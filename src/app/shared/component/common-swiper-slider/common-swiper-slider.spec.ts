import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSwiperSlider } from './common-swiper-slider';

describe('CommonSwiperSlider', () => {
  let component: CommonSwiperSlider;
  let fixture: ComponentFixture<CommonSwiperSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonSwiperSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSwiperSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
