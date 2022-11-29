import { Pipe, PipeTransform } from '@angular/core';
import { Objeto } from '../interfaces/objeto.interfaces';

@Pipe({
  name: 'iDToName'
})
export class IDToNamePipe implements PipeTransform {

  transform(id: number, obj:Objeto[]): string {
    let len:number=obj.length;
    for(let i=0; i<len; i++){
     if(id==obj[i].id){
      return obj[i].nombre || obj[i].descripcion;
     } 
    }
    
  }

}
