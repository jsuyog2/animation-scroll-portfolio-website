import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { enableLoaderGuard } from './enable-loader.guard';

describe('enableLoaderGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => enableLoaderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
