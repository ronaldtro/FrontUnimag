import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    'Content-type': 'aplication/json'
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getInformacion(){
    return this.http.get(`${Api.dev}/ConsultasGenerales/GetInformacion`,{headers:this.headers}).map(resp=>{return resp.json()});
  }

}