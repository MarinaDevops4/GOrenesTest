import { TestBed } from '@angular/core/testing';

import { ShareComponentDataService } from './share-component-data.service';

describe('ShareComponentDataService', () => {
  let service: ShareComponentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareComponentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
