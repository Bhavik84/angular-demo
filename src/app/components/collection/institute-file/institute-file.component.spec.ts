import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteFileComponent } from './institute-file.component';

describe('InstituteFileComponent', () => {
  let component: InstituteFileComponent;
  let fixture: ComponentFixture<InstituteFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstituteFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
