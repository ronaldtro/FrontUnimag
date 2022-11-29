import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter', 
  pure:false
})
export class DataFilterPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {

    if (!items) return [];
    return items.filter(it => it[field] == value);

  }

}
