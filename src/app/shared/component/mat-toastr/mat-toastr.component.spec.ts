import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatToastrComponent } from './mat-toastr.component';

describe('MatToastrComponent', () => {
  let component: MatToastrComponent;
  let fixture: ComponentFixture<MatToastrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToastrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatToastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
