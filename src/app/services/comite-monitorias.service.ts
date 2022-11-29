import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api, EnviarCorreoEncuestas } from '../class/api';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ComiteMonitoriasService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });

  httpHeaders = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private http:Http,
              private httpClient:HttpClient) { }

  listarComites(){
    return this.http.get(`${Api.dev}/ComiteMonitorias/ListarComites`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }
  
  cambiarEstado(id:number){
    return this.http.post(`${Api.dev}/ComiteMonitorias/CambiarEstadoComite`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }
  
  crearComite(comite){
    return this.http.post(`${Api.dev}/ComiteMonitorias/CrearComite`,comite,{headers:this.headers}).map(data=>{
      return data;
    });
  }
  
  listarRolesComite(){
    return this.http.get(`${Api.dev}/ComiteMonitorias/ListarRolesComite`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }
  
  crearRolComite(rol){
    return this.http.post(`${Api.dev}/ComiteMonitorias/CrearRolComite`,rol,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  cambiarEstadoRolComite(id:number){
    return this.http.post(`${Api.dev}/ComiteMonitorias/CambiarEstadoRolComite`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  agregarMiembro(miembroComite: any){

    return this.http.post(`${Api.dev}/ComiteMonitorias/AgregarMiembro`,miembroComite,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  eliminarMiembro(miembroComite: any){

    return this.http.post(`${Api.dev}/ComiteMonitorias/EliminarMiembro`,miembroComite,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  listarHistorialComites(){
    
    return this.http.get(`${Api.dev}/ComiteMonitorias/ListarHistorialComites`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }

  crearPersona(usuario: any){

    return this.http.post(`${Api.dev}/ComiteMonitorias/CrearPersona`,usuario,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  getEstudiantesAtendidos(id:number){
    return this.http.get(`${Api.dev}/ComiteMonitorias/GetEstudiantesAtendidos/${id}`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }

  /**
   * Metodo para obtener el listado de estudiantes atendidos en una convocatoria
   * @param id id de la convocatoria
   */
  getEstudiantesAtendidosPorConvocatoria(id:number):Observable<any>{
    return this.httpClient.get<any>(`${Api.dev}/ComiteMonitorias/getEstudiantesAtendidosPorConvocatoria/${id}`,{headers:this.httpHeaders});
  }

  getDatosEncuesta(id:number){
    return this.http.get(`${Api.dev}/ComiteMonitorias/GetDatosEncuesta/${id}`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }

  getDatosEncuestaByToken(token:string){
    return this.http.get(`${Api.dev}/ComiteMonitorias/GetDatosEncuestaByToken?id=1&codigo=${token}`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }

  guardarEncuesta(encuesta: any) {
    return this.http.post(`${Api.dev}/ComiteMonitorias/GuardarEncuesta`,encuesta,{headers:this.headers}).map(data=>{
      return data;
    });
  }
  
  guardarEncuestaDocenteTutor(encuesta: any) {
    return this.http.post(`${Api.dev}/ComiteMonitorias/GuardarEncuestaDocenteTutor`,encuesta,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  enviarCorreoEncuestas(obj : EnviarCorreoEncuestas){
    return this.http.post(`${Api.dev}/ComiteMonitorias/enviarEncuestas`,obj,{headers:this.headers}).map(data=>{
      return data.json();
    });
  }

  getResultadosEncuestasEstudiante(id?:number, tipoConvocatoria?:number) {
    return this.http.get(`${Api.dev}/ComiteMonitorias/GetResultadosEncuestasEstudiante?id=${id}&tipoConvocatoria=${tipoConvocatoria}`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }

  getResultadosEncuestasTutor(id?:number, tipoConvocatoria?:number) {
    return this.http.get(`${Api.dev}/ComiteMonitorias/GetResultadosEncuestasTutor?id=${id}&tipoConvocatoria=${tipoConvocatoria}`,{headers:this.headers}).map(resp=>{
      return resp.json();
    });
  }
}
