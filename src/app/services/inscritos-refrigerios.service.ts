import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InscritosService {
  url = Api.dev;
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private http: Http, private httpClient: HttpClient) { }

  getEstudiantes(id: number) {
    return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/Inscritos/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  cambiarEstadoEstudiante(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/CambiarEstadoEstudiante`,data,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  consultarDias(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/ConsultarDias`,data,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  cambiarEstadoDiaEstudiante(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/CambiarEstadoDias`,data,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  getSolicitudes(id:number) {
    return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/SolicitudCancelaciones/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  respuesta(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/RespuestaSolicitud`,data,{headers:this.headers}).map(data=>{
      return data;
    }); 
  }

  cambiarEstadoMultiple(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/CambiarEstadoMultiple`,data,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  cambiarEstadoEstudianteCheck(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/CambiarEstadoEstudianteCheck`,data,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  getListarFallas(id: number) {
    return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/ListarFallas/${id}`, { headers: this.headers }).map(resp => { return resp });
  }
  getListarEntregasEstados(id: number,prueba:number) {
    return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/ListarEntregas/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  cambiarEstadoFalla(data){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/CambiarEstadoFalla`,data,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

}