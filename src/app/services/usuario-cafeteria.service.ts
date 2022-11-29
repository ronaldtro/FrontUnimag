import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioCafeteriaService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getDatos(){
    return this.http.get(`${Api.dev}/UsuarioCafeteria/Datos`,{headers:this.headers}).map(resp=>{return resp.json()});
  }
  
  cambiarEstado(id:number){
    return this.http.post(`${Api.dev}/UsuarioCafeteria/CambiarEstado`,{'user_id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarUsuario(usuario){
    return this.http.post(`${Api.dev}/UsuarioCafeteria/GuardarUsuario`,usuario,{headers:this.headers}).map(data=>{
      return data;
    });   
  }

  getEntrega(){
    return this.http.get(`${Api.dev}/UsuarioCafeteria/BeneficioEntrega`,{headers:this.headers}).map(resp=>{return resp.json()});
  }

}