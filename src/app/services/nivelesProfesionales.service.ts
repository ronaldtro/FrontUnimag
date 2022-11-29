import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NivelesProfesionalesService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getNiveles(){
    return this.httpClient.get(`${Api.dev}/NivelesProfesionales/GetNivelesProfesionales`,{headers:this.headers}).map(resp=>{return resp});
  }
  cambiarEstado(id:number){
    return this.httpClient.post(`${Api.dev}/NivelesProfesionales/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }
  guardarNivel(nivel){
    return this.httpClient.post(`${Api.dev}/NivelesProfesionales/GuardarNivel`,nivel,{headers:this.headers}).map(data=>{
      return data;
    });
  }
}