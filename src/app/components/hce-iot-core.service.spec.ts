import { TestBed, inject } from '@angular/core/testing';

import { HceIotCoreService } from './hce-iot-core.service';

describe('HceIotCoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HceIotCoreService]
    });
  });

  it('should be created', inject([HceIotCoreService], (service: HceIotCoreService) => {
    expect(service).toBeTruthy();
  }));
});
