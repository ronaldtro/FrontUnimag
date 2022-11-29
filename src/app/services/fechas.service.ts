import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  url = Api.dev;
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
  });
  constructor(private httpClient:HttpClient) { }

  
  getDatos() {
    return this.httpClient.get(`${Api.dev}/Fecha/FechasNoHabiles`, { headers: this.headers }).map(resp => { return resp });
  }

  
  postCrearFechaNoHabil(data: any) {
    return this.httpClient.post(`${Api.dev}/Fecha/CrearFechaNoHabil`, data, { headers: this.headers }).map(resp => { return resp })
  }

  postEditarFechaNoHabil(data: any) {
    return this.httpClient.post(`${Api.dev}/Fecha/EditarFechaNoHabil`, data, { headers: this.headers }).map(resp => { return resp })
  }

  postEstadoDato(data: any) {

    return this.httpClient.post(`${Api.dev}/Fecha/EstadoFecha`, data, { headers: this.headers }).map(resp => { return resp })
  }
  
}
