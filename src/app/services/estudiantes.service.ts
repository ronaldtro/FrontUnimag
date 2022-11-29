import { Injectable } from '@angular/core';
import { Api, Estudiante } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Actividades } from '../interfaces/actividades.interface';
import 'rxjs/add/operator/catch';
import { Encuesta } from '../components/admin/refrigerios/estudiantes/encuesta/encuesta.component';
import { Observable } from 'rxjs/Rx';
@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  headers = new HttpHeaders({
    
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });
  constructor(private httpClient:HttpClient) { }

  getInfoEstudiante(tipoConvocatoria:number = null){
    return this.httpClient.get(`${Api.dev}/Estudiante/DatosEstudiante/${tipoConvocatoria}`, {headers:this.headers}).map(resp=>{return resp});             
                          
  }

  getListaPlazaEstudiante(tipoConvocatoria:number = null){
    console.log(tipoConvocatoria);
    return this.httpClient.get(`${Api.dev}/Estudiante/getListaPlazasEstudiante/${tipoConvocatoria}`, {headers:this.headers}).map(resp=>{return resp});             
  }

  getFotoEstudiante(codigo:string){
    return this.httpClient.get(`${Api.dev}/Estudiante/getLoggedStudentPhoto/${codigo}`, {headers:this.headers}).map(resp=>{return resp});             
                          
  }

  cancelarPlaza(id:number){
    let data={id:id};
    return this.httpClient.post(`${Api.dev}/Estudiante/EstudienteConvocatoria`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  getEvaluacion(id:number){
    return this.httpClient.get(`${Api.dev}/Estudiante/PlazaEvaluada/${id}`, {headers:this.headers}).map(resp=>{return resp});
  }

  getActividades(id:number){
    return this.httpClient.get(`${Api.dev}/Estudiante/PlazaActividad/${id}`, {headers:this.headers}).map(resp=>{ return resp});
   
  }

  agregarActividad(data:FormData){
    
    return this.httpClient.post(`${Api.dev}/Estudiante/AgregarActividad`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  cambiarEstadoActividad(id:number){
    let data={id:id};
    return this.httpClient.post(`${Api.dev}/Estudiante/CambiarEstadoActividad`,data, {headers:this.headers}).map(resp=>{return resp});
  }

  editarActividad(data:FormData){
    return this.httpClient.post(`${Api.dev}/Estudiante/EditarActividad`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  agregarEstudianteActividad (data:any){
    return this.httpClient.post(`${Api.dev}/Estudiante/AgregarEstudianteActividad`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  agregarObservacion (data:any){
    return this.httpClient.post(`${Api.dev}/Estudiante/AgregarObservacion`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  getObservaciones(id:number){
    return this.httpClient.get(`${Api.dev}/Estudiante/Observaciones/${id}`, {headers:this.headers}).map(resp=>{return resp});
  }

  validarCodigo(id: number) {
    return this.httpClient.post(`${Api.dev}/Estudiante/ValidarCodigo`, {'id': id},  {headers:this.headers}).map(resp=>{return resp});
  }

  retirarPlaza (data:any){
    let url = `${Api.dev}/Estudiante/RetirarPlaza`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');  
    return this.httpClient.post(url, data, {headers:headers}).map(data=>{
      return data;
    });
    //return this.httpClient.post(`${Api.dev}/Estudiante/RetirarPlaza`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  getListadoFallasEstudiante(id: number) {
    return this.httpClient.get(`${Api.dev}/Estudiante/ListadoFallasEstudiante/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  getEncuestas():any{
    return this.httpClient.get(`${Api.dev}/EncuestaBeneficio/GetConsultaEncuestas`, { headers: this.headers }).map(resp => { return resp });
  }

  getDatosEncuestas(id:number):any{
    return this.httpClient.get(`${Api.dev}/EncuestaBeneficio/GetDatosEncuestas/${id}`, { headers: this.headers }).map(resp => { return resp }); 
  }

  guardarEncuesta(encuesta:Encuesta):any{
    return this.httpClient.post(`${Api.dev}/EncuestaBeneficio/GuardarCalificacion`, encuesta, { headers: this.headers }).map(resp => { return resp });
  }

  /**
   * Permite obtener la información del estudiante según el código dado
   * @param codigo codigo del estudiante
   * @returns JSON con información del estudiante
   */
  getEstudianteByCodigo(codigo:string):Observable<Estudiante>{
    return this.httpClient.get<Estudiante>(`${Api.dev}/Estudiante/getEstudianteByCodigo/${codigo}`, { headers: this.headers }).map(resp => { return resp });
  }

  /**
   * Metodo para actualizar el puntaje de sisben de un estudiante
   * @param user_id user_id de estudiante
   * @param puntaje puntaje de sisben
   */
  actualizarSisben(user_id:number, puntaje:number):Observable<any>{
    return this.httpClient.put<any>(`${Api.dev}/Estudiante/actualizarSisben/${user_id}`,{codigo: puntaje}, { headers: this.headers }).map(resp => { return resp });
  }

}
