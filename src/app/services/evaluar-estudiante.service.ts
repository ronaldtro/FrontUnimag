import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Api } from '../class/api';

@Injectable({
  providedIn: 'root'
})
export class EvaluarEstudianteService {

  url = Api.dev;

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });
  
  constructor(private httpClient:HttpClient) { }

  getDatosEvaluacion( id : number){
    return this.httpClient.get(`${Api.dev}/EvaluarEstudiante/CargarRequisitosEvaluacion/${id}`, {headers:this.headers}).map(resp=>{return resp});
  }

  getDatosEvaluado( id : number){
    return this.httpClient.get(`${Api.dev}/EvaluarEstudiante/CargarEstudianteEvaluado/${id}`, {headers:this.headers}).map(resp=>{return resp});
  }
  
  postEvaluar(data){
    return this.httpClient.post(`${Api.dev}/EvaluarEstudiante/Evaluar`, data, {headers:this.headers}).map(resp => resp);
  }

  postEvalAdmin(data){
    let url = `${this.url}/EvaluarEstudiante/EditarEvaluacionAdmin`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');  
    return this.httpClient.post(url, data, {headers:headers}).map(data=>{
      return data;
    });
  }


}
