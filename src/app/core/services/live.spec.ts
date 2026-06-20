import { TestBed } from '@angular/core/testing';

import { Live } from './live';

describe('Live', () => {
  let service: Live;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Live);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
