import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographersListComponent } from './photographers-list.component';

describe('PhotographersListComponent', () => {
  let component: PhotographersListComponent;
  let fixture: ComponentFixture<PhotographersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotographersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotographersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
