import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossariComponent } from './glossari.component';

describe('GlossariComponent', () => {
  let component: GlossariComponent;
  let fixture: ComponentFixture<GlossariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossariComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlossariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
