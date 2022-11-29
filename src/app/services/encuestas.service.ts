import { Injectable } from '@angular/core';

import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private httpClient:HttpClient) { }

  getEncuestas(){
    return this.httpClient.get(`${Api.dev}/EncuestaBeneficio/GetEncuestasAdmin`,{headers:this.headers}).map(resp=>{return resp});
  }
  
}
