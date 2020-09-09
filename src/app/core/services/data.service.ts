import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface IDataUpdate {
  type;
  value;
}

export const VALUE_TYPES: any = {
  PARTICIPANTS_COUNT: 'PARTICIPANTS_COUNT',
  MY_POINTS: 'MY_POINTS'
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private subject$: Subject<any> = new Subject();

  update(type, value) {
    this.subject$.next({ type: type, value: value });
  }

  getUpdatesSubject() {
    return this.subject$;
  }
}
