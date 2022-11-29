import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ModalidadesService {
  
  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getModalidades(){
    return this.httpClient.get(`${Api.dev}/Modalidades/GetModalidades`,{headers:this.headers}).map(resp=>{return resp});
  }

  cambiarEstado(id:number){
   
    return this.httpClient.post(`${Api.dev}/Modalidades/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarModalidad(modalidad){
      
    return this.httpClient.post(`${Api.dev}/Modalidades/GuardarModalidad`,modalidad,{headers:this.headers}).map(data=>{
      return data;
    });
  }


}