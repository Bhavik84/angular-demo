import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteSearchComponent } from './institute-search.component';

describe('InstituteSearchComponent', () => {
  let component: InstituteSearchComponent;
  let fixture: ComponentFixture<InstituteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstituteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
