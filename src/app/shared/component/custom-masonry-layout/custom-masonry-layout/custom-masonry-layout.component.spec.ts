import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMasonryLayoutComponent } from './custom-masonry-layout.component';

describe('CustomMasonryLayoutComponent', () => {
  let component: CustomMasonryLayoutComponent;
  let fixture: ComponentFixture<CustomMasonryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMasonryLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomMasonryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
