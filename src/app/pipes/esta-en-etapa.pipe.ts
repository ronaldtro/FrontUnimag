import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estaEnEtapa'
})
export class EstaEnEtapaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
