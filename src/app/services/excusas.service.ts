import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExcusaService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getDatos(){
    return this.httpClient.get(`${Api.dev}/Excusa/GetExcusas`,{headers:this.headers}).map(resp=>{return resp});
  }
  
  guardarExcusa(excusa,soporte){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    for (let nombre in excusa) {
      if (excusa[nombre] != null && excusa[nombre] != "") {
          formData.append(nombre, excusa[nombre]);
      }
    }
    
    if (soporte != null) {
      formData.append("soporte", soporte);
    }
    return this.httpClient.post(`${Api.dev}/Excusa/GuardarExcusa`,formData,{headers:headers}).map(resp=>{
      return resp;
    });
  }

}
