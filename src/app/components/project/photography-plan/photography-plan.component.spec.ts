import { ComponentFixture, TestBed } from '@angular/core/testing';

import { photographyPlanComponent } from './photography-plan.component';

describe('photographyPlanComponent', () => {
  let component: photographyPlanComponent;
  let fixture: ComponentFixture<photographyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [photographyPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(photographyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
