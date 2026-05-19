import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperSlider } from './swiper-slider';

describe('SwiperSlider', () => {
  let component: SwiperSlider;
  let fixture: ComponentFixture<SwiperSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
