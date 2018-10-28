import { TestBed } from '@angular/core/testing';

import { FirebaseserviceService } from './firebaseservice.service';

describe('FirebaseserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseserviceService = TestBed.get(FirebaseserviceService);
    expect(service).toBeTruthy();
  });
});
