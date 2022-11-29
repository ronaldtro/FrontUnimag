import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diferenciaFechas'
})
export class DiferenciaFechasPipe implements PipeTransform {
  /**
   * Pipe para definir diferencia entre dos fechas
   * 
   * @param fecha_inicio Fecha inicio a comparar
   * @param fecha_fin Fecha fin a comparar
   * @param args Tipo 
   * @returns La diferencia entre las fechas dadas.
   */
  transform(fecha_inicio: any,fecha_fin: any, args?: string): any {

    if(fecha_inicio == null || fecha_fin == null){
      return 0;
    }
    let difference = Math.abs(fecha_fin.getTime() - fecha_inicio.getTime());
  
    if (difference === 0) {
      return 0;
    }
    let result = 0;
    switch (args) {
      case 's':
        //Minutos
        result = difference / 60;
        break;
      case 'm':
        //Minutos
        result = difference / 60000;
        break;
      case 'h':
        //Horas
        result = (difference / 60000) / 60;
        break;
      case 'd':
        //Días
        result = difference / (1000 * 3600 * 24);
        break;
    
      default:
        result = difference;
        break;
    }
    // console.log(result);
    return Math.ceil(result);
  }

}
