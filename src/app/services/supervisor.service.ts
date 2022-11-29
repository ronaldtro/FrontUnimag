import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx'
import { Api } from '../class/api';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {
  
  url = Api.dev; 
  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private httpClient:HttpClient) { }

    getDatos(){
      let url = `${this.url}/Supervisor/DatosSupervisor`
      return this.httpClient.get(url,{headers:this.headers}).map(data=>{
      return data;
      })
    }

    getDatosModuloSupervisor(){
      let url = `${Api.dev}/Dashboard/getDatosSupervisor`;
      return this.httpClient.get(url, { headers: this.headers }).map(data => {
        return data;
      });
    }
  
    getDatosActividades(id:number){
      return this.httpClient.get(`${Api.dev}/Supervisor/DatosActividades/${id}`, {headers:this.headers}).map(resp=>{return resp});
    }

    postEstadoActividad(id:number){
      return this.httpClient.post(`${Api.dev}/Supervisor/EstadoActividad`, {actividad:id}, {headers:this.headers}).map(resp=>{return resp})
    }

    // postRechazarActividad(id:number){
    //   return this.httpClient.post(`${Api.dev}/Supervisor/RechazarActividad`, {actividad:id}, {headers:this.headers}).map(resp=>{return resp})
    // }

    getEstudiantesAuditor(id:number){
      return this.httpClient.get(`${Api.dev}/Supervisor/EstudianteAuditor/${id}`, {headers:this.headers}).map(resp=>{return resp});
    }

    agregarObservacion (data:any){
      return this.httpClient.post(`${Api.dev}/Estudiante/AgregarObservacion`, data, {headers:this.headers}).map(resp=>{return resp});
    }

    agregarObservacionPlaza (data:any){
      return this.httpClient.post(`${Api.dev}/Supervisor/AgregarObservacionPlaza`, data, {headers:this.headers}).map(resp=>{return resp});
    }

    postEvaluarAyudantia (data:any){
      return this.httpClient.post(`${Api.dev}/Supervisor/EvaluarAyudantia`, data, {headers:this.headers}).map(resp=>{return resp});
    }

    postEstadoComite(registroComite:any){
      let url = `${this.url}/Supervisor/EstadoComite`
      let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      let formData = new FormData();
      formData.append('idActividad', ""+registroComite.idActividad);
      formData.append('observacion',""+registroComite.observacion);
      formData.append('soporte', registroComite.soporte)
      return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
        return data;
      });
    }

    getDatosEvaluador(){
      let url = `${this.url}/EvaluarEstudiante/ListadoEstudiantesEvaluador`
      return this.httpClient.get(url,{headers:this.headers}).map(data=>{
      return data;
      })
    }

    getSupervisores():Observable<any>{
      let url = `${this.url}/Supervisor/getSupervisores`
      return this.httpClient.get(url,{headers:this.headers}).map(data=>{
        return data;
      })
    }
  
}
