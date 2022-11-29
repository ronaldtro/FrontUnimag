import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enviosSinEntrega'
})
export class EnviosSinEntregaPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
    
    return value.filter(item => item.fecha == null);
  }

}
