import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getDatos(){
    return this.http.get(`${Api.dev}/Usuario/Datos`,{headers:this.headers}).map(resp=>{return resp.json()});
  }
  
  cambiarEstado(id:number){
    return this.http.post(`${Api.dev}/Usuario/CambiarEstado`,{'user_id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarUsuario(usuario){
    return this.http.post(`${Api.dev}/Usuario/GuardarUsuario`,usuario,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  infoUsuario(){
    return this.http.get(`${Api.dev}/Estudiante/getPersonUser` ,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

}
