import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlazasPService {

  url = Api.dev;
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });


  constructor(private httpClient: HttpClient) { }

  getDatos(id: any, codigo?:string) {
    codigo = (codigo == undefined) ? "": "/"+codigo;
    let url = `${this.url}/PublicPlaza/DatosPlazas/${id}${codigo}`
    console.log(codigo);
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    })
  }

  getDatosAprobados(id: any) {
    let url = `${this.url}/PublicPlaza/Evaluados/${id}`
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    })
  }

  getDatosEvaluado(id: any) {
    let url = `${this.url}/PublicPlaza/CargarEvaluado/${id}`
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    })
  }




}