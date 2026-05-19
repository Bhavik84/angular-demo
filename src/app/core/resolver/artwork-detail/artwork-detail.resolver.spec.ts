import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { artworkDetailResolver } from './artwork-detail.resolver';

describe('artworkDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      artworkDetailResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
