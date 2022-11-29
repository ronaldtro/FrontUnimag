import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'letras'
})
export class LetrasPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let data:any = {
      numero: value,
      enteros: Math.floor(value)
    };

    if(data.enteros == 0)
        return "CERO";
    if (data.enteros == 1)
        return this.Millones(data.enteros);
    else
        return this.Millones(data.enteros);

    return "";
  }

   Unidades(num:number):string{

      switch(num)
      {
          case 1: return "UN";
          case 2: return "DOS";
          case 3: return "TRES";
          case 4: return "CUATRO";
          case 5: return "CINCO";
          case 6: return "SEIS";
          case 7: return "SIETE";
          case 8: return "OCHO";
          case 9: return "NUEVE";
      }

      return "";
  }

  Decenas(num:number):string{

      let decena:number = Math.floor(num/10);
      let unidad:number = num - (decena * 10);

      switch(decena)
      {
          case 1:
              switch(unidad)
              {
                  case 0: return "DIEZ";
                  case 1: return "ONCE";
                  case 2: return "DOCE";
                  case 3: return "TRECE";
                  case 4: return "CATORCE";
                  case 5: return "QUINCE";
                  default: return "DIECI" + this.Unidades(unidad);
              }
          case 2:
              switch(unidad)
              {
                  case 0: return "VEINTE";
                  default: return "VEINTI" + this.Unidades(unidad);
              }
          case 3: return this.DecenasY("TREINTA", unidad);
          case 4: return this.DecenasY("CUARENTA", unidad);
          case 5: return this.DecenasY("CINCUENTA", unidad);
          case 6: return this.DecenasY("SESENTA", unidad);
          case 7: return this.DecenasY("SETENTA", unidad);
          case 8: return this.DecenasY("OCHENTA", unidad);
          case 9: return this.DecenasY("NOVENTA", unidad);
          case 0: return this.Unidades(unidad);
      }

      
  }

  DecenasY(strSin:string, numUnidades:number):string {
      if (numUnidades > 0)
      return strSin + " Y " + this.Unidades(numUnidades)

      return strSin;
  }

  Centenas(num:number):string {
      let centenas:number = Math.floor(num / 100);
      let decenas:number = num - (centenas * 100);

      switch(centenas)
      {
          case 1:
              if (decenas > 0)
                  return "CIENTO " + this.Decenas(decenas);
              return "CIEN";
          case 2: return "DOSCIENTOS " + this.Decenas(decenas);
          case 3: return "TRESCIENTOS " + this.Decenas(decenas);
          case 4: return "CUATROCIENTOS " + this.Decenas(decenas);
          case 5: return "QUINIENTOS " + this.Decenas(decenas);
          case 6: return "SEISCIENTOS " + this.Decenas(decenas);
          case 7: return "SETECIENTOS " + this.Decenas(decenas);
          case 8: return "OCHOCIENTOS " + this.Decenas(decenas);
          case 9: return "NOVECIENTOS " + this.Decenas(decenas);
      }

      return this.Decenas(decenas);
  }

  Seccion(num, divisor, strSingular, strPlural):string {
      let cientos:number = Math.floor(num / divisor);
      let resto:number = num - (cientos * divisor);

      let letras:string = "";

      if (cientos > 0)
          if (cientos > 1)
              letras = this.Centenas(cientos) + " " + strPlural;
          else
              letras = strSingular;

      if (resto > 0)
          letras += "";

      return letras;
  }//Seccion()

  Miles(num:number):string {
      let divisor:number = 1000;
      let cientos:number = Math.floor(num / divisor);
      let resto = num - (cientos * divisor);

      let strMiles = this.Seccion(num, divisor, "MIL", "MIL");
      let strCentenas = this.Centenas(resto);

      if(strMiles == "")
          return strCentenas;

      return strMiles + " " + strCentenas;
  }

  Millones(num:number):string {
      let divisor:number = 1000000;
      let cientos:number = Math.floor(num / divisor)
      let resto:number = num - (cientos * divisor)

      let strMillones = this.Seccion(num, divisor, "UN MILLON", "MILLONES");
      let strMiles = this.Miles(resto);

      if(strMillones == "")
          return strMiles;

      return strMillones + " " + strMiles;
  }//Millones()

}
