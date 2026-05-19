import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { activityDetailResolver } from './activity-detail.resolver';

describe('activityDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      activityDetailResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
