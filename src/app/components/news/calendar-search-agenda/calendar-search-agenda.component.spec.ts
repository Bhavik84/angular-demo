import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSearchAgendaComponent } from './calendar-search-agenda.component';

describe('CalendarSearchAgendaComponent', () => {
  let component: CalendarSearchAgendaComponent;
  let fixture: ComponentFixture<CalendarSearchAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSearchAgendaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarSearchAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
