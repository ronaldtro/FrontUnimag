import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {
  url = Api.dev;
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private http: Http, private httpClient: HttpClient) { }

  getBeneficio(id: number) {
    return this.httpClient.get(`${Api.dev}/RecepcionBeneficio/GetBeneficio/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  consulta(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/RecepcionBeneficio/ConsultaRecepcion`,data,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

}