import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesWithScrollComponent } from './images-with-scroll.component';

describe('ImagesWithScrollComponent', () => {
  let component: ImagesWithScrollComponent;
  let fixture: ComponentFixture<ImagesWithScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesWithScrollComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagesWithScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
