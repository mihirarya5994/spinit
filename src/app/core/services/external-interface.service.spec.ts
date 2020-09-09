/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExternalInterfaceService } from './external-interface.service';

describe('Service: ExternalInterface', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalInterfaceService]
    });
  });

  it('should ...', inject([ExternalInterfaceService], (service: ExternalInterfaceService) => {
    expect(service).toBeTruthy();
  }));
});
