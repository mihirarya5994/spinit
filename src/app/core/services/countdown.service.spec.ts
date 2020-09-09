/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CountdownService } from './countdown.service';

describe('Service: Countdown', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountdownService]
    });
  });

  it('should ...', inject([CountdownService], (service: CountdownService) => {
    expect(service).toBeTruthy();
  }));
});
