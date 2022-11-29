import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilProfesionalService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

 
    getProfesional(){
      return this.httpClient.get(`${Api.dev}/HorarioProfesionalSalud/GetProfesional`,{headers:this.headers}).map(resp=>{return resp});
    }

}
