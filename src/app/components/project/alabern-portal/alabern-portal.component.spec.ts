import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlabernPortalComponent } from './alabern-portal.component';

describe('AlabernPortalComponent', () => {
  let component: AlabernPortalComponent;
  let fixture: ComponentFixture<AlabernPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlabernPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlabernPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
