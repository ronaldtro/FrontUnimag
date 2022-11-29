import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstudiosRealizadosService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getEstudios(){
    return this.httpClient.get(`${Api.dev}/EstudiosRealizados/GetEstudiosRealizados`,{headers:this.headers}).map(resp=>{return resp});
  }
  cambiarEstado(id:number){
    return this.httpClient.post(`${Api.dev}/EstudiosRealizados/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }
  guardarEstudio(estudio){
    return this.httpClient.post(`${Api.dev}/EstudiosRealizados/GuardarEstudio`,estudio,{headers:this.headers}).map(data=>{
      return data;
    });
  }
}