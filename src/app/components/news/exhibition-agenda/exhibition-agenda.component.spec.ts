import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitionAgendaComponent } from './exhibition-agenda.component';

describe('ExhibitionAgendaComponent', () => {
  let component: ExhibitionAgendaComponent;
  let fixture: ComponentFixture<ExhibitionAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitionAgendaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExhibitionAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
