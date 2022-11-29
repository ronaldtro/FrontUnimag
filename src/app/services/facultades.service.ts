import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class FacultadesService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });


  constructor(private http:Http, private httpClient:HttpClient) { }

  getDatosFacultades(){
    return this.httpClient.get(`${Api.dev}/Facultades/DatosFacultad`, {headers:this.headers}).map(resp=>{return resp});
  }

  postCrearFacultad(data){
    return this.httpClient.post(`${Api.dev}/Facultades/CrearFacultad`, data, {headers:this.headers}).map(resp => resp);
  }

  postEditarFacultad(data){
    return this.httpClient.post(`${Api.dev}/Facultades/EditarFacultad`, data, {headers:this.headers}).map(resp => resp);
  }

  postEstadoFacultad(data){
    return this.httpClient.post(`${Api.dev}/Facultades/EstadoFacultad`, data, {headers:this.headers}).map(resp => resp);
  }


}
