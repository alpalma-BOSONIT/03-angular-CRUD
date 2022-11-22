import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'renderTrue',
})
export class RenderTruePipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? '✔' : '';
  }
}
