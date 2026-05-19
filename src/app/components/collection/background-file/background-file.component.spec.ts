import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundFileComponent } from './background-file.component';

describe('BackgroundFileComponent', () => {
  let component: BackgroundFileComponent;
  let fixture: ComponentFixture<BackgroundFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackgroundFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
