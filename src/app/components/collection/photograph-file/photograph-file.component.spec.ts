import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographFileComponent } from './photograph-file.component';

describe('PhotographFileComponent', () => {
  let component: PhotographFileComponent;
  let fixture: ComponentFixture<PhotographFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotographFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotographFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
