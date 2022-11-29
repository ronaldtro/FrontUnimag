import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeritosGruposDeportivosService {

  url = Api.dev; 

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getMeritos(id:number){
    return this.httpClient.get(`${this.url}/MeritosGruposDeportivos/GetMeritos/${id}`, {headers:this.headers}).map(data=>{
      return data
    });
  }

  getMeritosPersona(id:number){
    return this.httpClient.get(`${this.url}/MeritosGruposDeportivos/GetMeritosPersona/${id}`, {headers:this.headers}).map(data=>{
      return data
    });
  }

  guardarMerito(merito:any){
    return this.httpClient.post(`${this.url}/MeritosGruposDeportivos/GuardarMerito`, merito, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  cambiarEstado(merito:any){
    return this.httpClient.post(`${this.url}/MeritosGruposDeportivos/CambiarEstado`,{'idGrupo':merito.idGrupo,'idMerito':merito.idMerito}, {headers:this.headers}).map(data=>{
      return data;
    });
  }
    
}