import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAcquisitionsComponent } from './new-acquisitions.component';

describe('NewAcquisitionsComponent', () => {
  let component: NewAcquisitionsComponent;
  let fixture: ComponentFixture<NewAcquisitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAcquisitionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAcquisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
