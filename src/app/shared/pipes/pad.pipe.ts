import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pad' })
export class PadPipe implements PipeTransform {
  transform(input) {
    return input < 10 ? '0' + input : input;
  }
}
