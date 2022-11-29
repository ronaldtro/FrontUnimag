import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform( lista: any[], key: string, value :any, operator: string = "="): any[] {
    if (value === '' || value===null){
      return lista
    }else{
      if(typeof value == "number"){
        switch(operator){
          case "<":
          return lista.filter(x => x[key] <  value);
          break;
          case ">":
          return lista.filter(x => x[key] > value);
          break;
          case "<=":
          return lista.filter(x => x[key] <=  value);
          break;
          case ">=":
          return lista.filter(x => x[key] >=  value);
          break;
          default:
          return lista.filter(x => x[key] ==  value);
        }
      }else{
        return lista.filter(x => x[key] == value);
      }
      
    }
  }
}
