import { Injectable, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';

export class EventData {
  type: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  public emitter: EventEmitter<EventData> = new EventEmitter<EventData>();

  emit(event: EventData) {
    this.emitter.emit(event);
  }

  subscribe(listener: (event: EventData) => void): Subscription {
    return this.emitter.subscribe(listener);
  }

}
