import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { photographerDetailResolver } from './photographer-detail.resolver';

describe('photographerDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      photographerDetailResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
