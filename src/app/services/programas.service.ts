import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Api } from '../class/api';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });


  constructor(private http:Http, private httpClient:HttpClient) { }

  getDatosProgramas(){
    return this.httpClient.get(`${Api.dev}/Programas/DatosPrograma`, {headers:this.headers}).map(resp=>{return resp});
  }

  postCrearPrograma(data){
    return this.httpClient.post(`${Api.dev}/Programas/CrearPrograma`, data, {headers:this.headers}).map(resp => resp);
  }

  postEditarPrograma(data){
    return this.httpClient.post(`${Api.dev}/Programas/EditarPrograma`, data, {headers:this.headers}).map(resp => resp);
  }

  postEstadoPrograma(data){
    return this.httpClient.post(`${Api.dev}/Programas/EstadoPrograma`, data, {headers:this.headers}).map(resp => resp);
  }

}
