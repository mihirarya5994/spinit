/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EventResolver } from './event.resolver';

describe('Service: EventResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventResolver]
    });
  });

  it('should ...', inject([EventResolver], (service: EventResolver) => {
    expect(service).toBeTruthy();
  }));
});
