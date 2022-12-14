import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure:false
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], valor: string): any[] {

    array.sort((a: any, b: any) => {
      if (a[valor] < b[valor]) {
        return -1;
      } else if (a[valor] > b[valor]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;

    
  }

}
