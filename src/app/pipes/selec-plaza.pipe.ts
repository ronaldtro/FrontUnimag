import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selecPlaza'
})
export class SelecPlazaPipe implements PipeTransform {

  transform(lista:any[] , idTipoAyudantia:number): any[] {
    if(idTipoAyudantia==null){
      return lista;
    }
    else{
      return lista.filter(x => x['tipo_ayudantia_id'] ==  idTipoAyudantia);
    }
  }

}
