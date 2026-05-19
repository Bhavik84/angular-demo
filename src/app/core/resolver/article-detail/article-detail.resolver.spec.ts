import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { articleDetailResolver } from './article-detail.resolver';

describe('articleDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      articleDetailResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
