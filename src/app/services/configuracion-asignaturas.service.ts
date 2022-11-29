import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionAsignaturasService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getAsignaturas(){
    return this.httpClient.get(`${Api.dev}/ConfiguracionAsignatura/GetAsignaturas`,{headers:this.headers}).map(resp=>{return resp});
  }
  
  guardarAsignaturas(asigPadres,asigHijas){
    return this.httpClient.post(`${Api.dev}/ConfiguracionAsignatura/GuardarAsignaturas`,{'asigPadre':asigPadres,'asigHijas':asigHijas},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  quitarAsignatura(asignatura_id){
    return this.httpClient.post(`${Api.dev}/ConfiguracionAsignatura/QuitarAsignaturas`,{'id':asignatura_id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  actualizarAsignaturas(){
    return this.httpClient.get(`${Api.dev}/ConfiguracionAsignatura/ActualizarAsignaturas`,{headers:this.headers}).map(resp=>{
      return resp;
    });
  }
  
}