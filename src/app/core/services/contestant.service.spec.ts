/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContestantService } from './contestant.service';

describe('Service: Contestant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContestantService]
    });
  });

  it('should ...', inject([ContestantService], (service: ContestantService) => {
    expect(service).toBeTruthy();
  }));
});
