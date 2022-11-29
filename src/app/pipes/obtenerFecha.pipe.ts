import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'obtenerFecha'})

export class obtenerFechaPipe implements PipeTransform {    

    transform(time: any): any {
        
      if(time != null){ 
        var tmp = time.split("");
            var map = tmp.map(function(current) {
              if (!isNaN(parseInt(current))) {
                return current;
              }
            });
            var numbers = map.filter(function(value) {
                return value != undefined;
              });
            
        return numbers.join("");
      }else return;
    }           
    
}

