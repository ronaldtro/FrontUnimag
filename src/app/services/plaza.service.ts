import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class PlazaService {
  url = Api.dev;
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private http: Http, private httpClient: HttpClient) { }

  getDatosSolicitar(id:number = null) {
    return this.httpClient.get(`${Api.dev}/Plaza/DatosSolicitarPlaza/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  postSolicitar(data) {
    return this.httpClient.post(`${Api.dev}/Plaza/Solicitar`, data, { headers: this.headers }).map(resp => resp);
  }

  getPlazaSolicitada(id: number) {
    return this.httpClient.get(`${Api.dev}/Plaza/GetPlazaSolicitada/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  postEditarSolicitar(data) {
    return this.httpClient.post(`${Api.dev}/Plaza/EditarSolicitudPlaza`, data, { headers: this.headers }).map(resp => resp);
  }

  getSolicitudesPlazas(id:number = undefined, tipoConvocatoria:number = undefined) {
    return this.httpClient.get(`${Api.dev}/Plaza/CargarSolicitudesPlazas?id=${id}&codigo=${tipoConvocatoria}`, { headers: this.headers }).map(
      resp => {
        // for(let i= 0; i < resp['solicitudesPlaza'].length; i++){
        //   resp['solicitudesPlaza'][i]['fechaSolicitud'] = new Date(resp['solicitudesPlaza'][i]['fechaSolicitud']);
        // }

        return resp
      });
  }

  postAprobarPlaza(data) {
    return this.httpClient.post(`${Api.dev}/Plaza/AprobarPlaza`, data, { headers: this.headers }).map(resp => resp);
  }

  getCriterios(id: number) {
    return this.httpClient.get(`${Api.dev}/Plaza/CargarRequisitosEvaluacionConvocatoria/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  postCriterios(data) {
    return this.httpClient.post(`${Api.dev}/Plaza/GuardarCriteriosEvaluacion`, data, { headers: this.headers }).map(resp => { return resp })
  }

  getCargarAsignaturas()  {
    return this.httpClient.get(`${Api.dev}/Plaza/Asignaturas`, { headers: this.headers }).map(resp => { return resp });
  }


  getEstudiantes(id: number) {
    return this.httpClient.get(`${Api.dev}/DependenciaPlaza/Plazas/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  getEstudiantesEval(id: number) {
    return this.httpClient.get(`${Api.dev}/DependenciaPlaza/PlazasEvaluadas/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  postAprobarEst(data) {

    return this.httpClient.post(`${Api.dev}/DependenciaPlaza/AprobarPostulacion`, data, { headers: this.headers }).map(resp => { return resp })
  }

  getPlazasAprobadas(id?:number, tipoConvocatoria?:number) {
    return this.httpClient.get(`${Api.dev}/Plaza/CargarPlazasAprobadas?id=${id}&codigo=${tipoConvocatoria}`, { headers: this.headers }).map(resp => { return resp });
  }

  getDetallePlazaSolicitada(id: number) {
    return this.httpClient.get(`${Api.dev}/Plaza/CargarDetallePlaza/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  postAsignarSup(data: any) {
    return this.httpClient.post(`${Api.dev}/DependenciaPlaza/AsignarSupervisor`, data, { headers: this.headers }).map(resp => { return resp })
  }

  estudianteConvocatoria(data: any) {
    let url = `${this.url}/Plaza/EstudianteConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log ("Lo que se manda: ", data.forEach(x => {let i = 0; console.log("["+(i+1)+"]:",x)}));
    return this.httpClient.post(url, data, {headers:headers}).map(data=>{
      return data;
    });
    //return this.httpClient.post(`${Api.dev}/Plaza/EstudianteConvocatoria`, data, { headers: this.headers }).map(resp => { return resp })
  }

  cambiarEstadoPlaza(data:any){
    return this.httpClient.post(`${Api.dev}/Plaza/CambiarEstadoPlaza`, data, { headers: this.headers }).map(resp => { return resp })
  }

  getHistorialPlazas() {
    return this.httpClient.get(`${Api.dev}/Plaza/HistorialPlazas`, { headers: this.headers }).map(resp => { return resp });
  }

  postAsignarEntrevista(data: any) {
    return this.httpClient.post(`${Api.dev}/Plaza/EntrevistaEstudiante`, data, { headers: this.headers }).map(resp => { return resp })
  }
  getCuantificacionPlazas(id:number) {
    let url = `${Api.dev}/Plaza/CuantificacionPlazas/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }
  guardarSupervisor(supervisor){
    return this.httpClient.post(`${Api.dev}/DependenciaPlaza/AgregarSupervisor`,supervisor,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  guardarEvaluador(evaluador){
    return this.httpClient.post(`${Api.dev}/DependenciaPlaza/AgregarEvaluador`,evaluador,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  cambiarEstadoEstudiante(data,file_soporte){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    for (let nombre in data) {
      if (data[nombre] != null && data[nombre] != "") {
        formData.append(nombre, data[nombre]);
      }
    }
    
    if (file_soporte != null) {
      formData.append("file_soporte", file_soporte);
    }
    
    return this.httpClient.post(`${Api.dev}/DependenciaPlaza/CambiarEstadoEstudiante`,formData,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  postCriteriosAdmin(data) {
    let url = `${this.url}/Plaza/guardarObservacion`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');  
    return this.httpClient.post(url, data, {headers:headers}).map(data=>{
      return data;
    });
  }
  consultarPlaza(id: number){
  return this.httpClient.get(`${Api.dev}/Plaza/consultarPlaza/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  getPropuestasPlaza(id):Observable<Blob>{
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
      'content-type':'application/json'
    });
    let options = new RequestOptions({responseType: ResponseContentType.Blob});
    options.headers = headers;
    return this.http.get(`${Api.dev}/Plaza/DescargarPropuestas/${id}`,options)
    .map(res=> res.blob())

  }

  /**
   * Metodo para obtener a los estudiantes que cumplan con la evaluación mínima para ser considerados para ratificación
   * @param plaza_id id de la plaza en la cual se consultaran los estudiantes que cumplan con la condición para ratificación
   */
  getMonitoresParaRatificar(plaza_id:number):Observable<any>{
    return this.httpClient.get(`${Api.dev}/Plaza/estudiantesParaRatificar/${plaza_id}`,{headers:this.headers}).map(data=>{
      return data;
    });
  }
  /**
   * Metodo para obtener los monitores de la plaza anterior a la indicada en el id dado.
   * @param plaza_id id de la plaza en la cual se consultaran los estudiantes que cumplan con la condición para ratificación
   */
  getMonitoresParaRatificarDePlazaAnterior(plaza_id:number):Observable<any>{
    console.log(plaza_id);
    return this.httpClient.get(`${Api.dev}/Plaza/estudiantesParaRatificarDePlazaAnterior/${plaza_id}`,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  /**
   * Permite obtener los estudiantes ratificados de la plaza indicada
   * @param plaza_id id de plaza
   */
  getEstudiantesRatificados(plaza_id:number):Observable<any>{
    return this.httpClient.get(`${Api.dev}/Plaza/getEstudiantesRatificados/${plaza_id}`,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo que permite guardar los estudiantes seleccionados para ratificación.
   * @param data se envia el id de la plaza y los códigos a ratificar
   */
  ratificarEstudiantesSeleccionados(data:any):Observable<any> {
    return this.httpClient.post(`${Api.dev}/Plaza/ratificarEstudiante`, data, { headers: this.headers }).map(resp => resp);
  }

}
