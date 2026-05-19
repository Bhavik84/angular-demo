import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographSearchComponent } from './photograph-search.component';

describe('PhotographSearchComponent', () => {
  let component: PhotographSearchComponent;
  let fixture: ComponentFixture<PhotographSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotographSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotographSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
