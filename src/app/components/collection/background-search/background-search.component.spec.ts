import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSearchComponent } from './background-search.component';

describe('BackgroundSearchComponent', () => {
  let component: BackgroundSearchComponent;
  let fixture: ComponentFixture<BackgroundSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
