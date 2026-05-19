import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { photographDetailResolver } from './photograph-detail.resolver';

describe('photographDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      photographDetailResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
