import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { instituteDetailResolver } from './institute-detail.resolver';

describe('instituteDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      instituteDetailResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
