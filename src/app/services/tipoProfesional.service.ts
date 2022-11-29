import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TiposProfesionalesService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getTiposProfesionales(){
    return this.httpClient.get(`${Api.dev}/TipoProfesionalSalud/GetTiposProfesionales`,{headers:this.headers}).map(resp=>{return resp});
  }
  cambiarEstado(id:number){
    return this.httpClient.post(`${Api.dev}/TipoProfesionalSalud/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }
  guardarTipoProfesional(tipoProfesional){
    return this.httpClient.post(`${Api.dev}/TipoProfesionalSalud/GuardarTipoProfesional`,tipoProfesional,{headers:this.headers}).map(data=>{
      return data;
    });
  }
}