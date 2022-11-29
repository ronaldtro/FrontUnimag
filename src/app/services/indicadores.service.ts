import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { element } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresServie {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getDatos(){
    return this.httpClient.get(`${Api.dev}/Indicador/getInformacionIndicadores`,{headers:this.headers}).map((resp:any)=>{
      let datos = {...resp};
      for(let i = 0; i < datos.sexo.length; i++){
        datos.sexo[i].sexo = (datos.sexo[i].sexo == true ? "Hombres" : "Mujeres");
        datos.sexo[i].valor = datos.sexo[i].count;
      }
      datos.estratos = datos.estratos.map(elem =>  {
        elem.beneficiarios = elem.count;
        delete elem.count;
        return elem;
      }).sort(function (a, b) {
        if (a.estrato > b.estrato) {
          return 1;
        }
        if (a.estrato < b.estrato) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })

      return datos
    });
  }


}

