import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { Http, Headers, RequestOptions, ResponseContentType, ResponseType } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/Rx'
import { Convocatoria } from '../interfaces/convocatorias.interface';
import { Observable } from 'rxjs/Rx';



@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  url = Api.dev; 
  //headers = new Headers({'content-type':'application/json'})
  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    'content-type':'application/json'
  });
  constructor(private http: Http, 
              private httpClient:HttpClient,
              ) { }
  
            
              
  getDatos(id:number){
    let url = `${this.url}/Convocatorias/DatosNuevaConvocatoria/${id}`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  guardarConvocatoria(convocatoria:Convocatoria){
    let url = `${this.url}/Convocatorias/GuardarConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    formData.append('bolsa_presupuestal_id', ""+convocatoria.bolsa_presupuestal_id);
    formData.append('tipo_id', ""+convocatoria.tipo_id);
    formData.append('titulo', convocatoria.titulo);
    formData.append('nota_minima',""+convocatoria.nota_minima);
    formData.append('maximo_horas',""+convocatoria.maximo_horas);
    if(convocatoria.descripcion){
      formData.append('descripcion', convocatoria.descripcion);
    }
    if(convocatoria.file_soporte_resolucion!=null){
      formData.append('file_soporte_resolucion', convocatoria.file_soporte);
    }
    if(convocatoria.file_formato!=null){
      formData.append('file_formato', convocatoria.file_formato);
    }
    formData.append('fecha_expedicion', convocatoria.fecha_expedicion.toDateString());
    formData.append('file_soporte', convocatoria.file_soporte)
    formData.append('etapasString', JSON.stringify(convocatoria.etapas));
    
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
    
  }

  listConvocatorias(id:number){
    let url = `${this.url}/Convocatorias/ListarConvocatorias/${id}`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  listConvocatoriasMonitorias(){
    let url = `${this.url}/Convocatorias/ListarConvocatoriasMonitorias`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }


  historialConvocatorias(id:number = null){
    let url = `${this.url}/Convocatorias/ListarHistorialConvocatorias/${id}`
    return this.httpClient.get(url,  {headers:this.headers}).map(data=>{
      return data;
    });
  }

  getConvocatoria(id: number){
    let url = `${this.url}/Convocatorias/GetConvocatoria/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{return data;});
  }
  
  
  editarConvocatoria(convocatoria:Convocatoria){
    let url = `${this.url}/Convocatorias/EditarConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    formData.append('bolsa_presupuestal_id', ""+convocatoria.bolsa_presupuestal_id);
    formData.append('fecha_expedicion', convocatoria.fecha_expedicion.toDateString());
    formData.append('tipo_id', ""+convocatoria.tipo_id);
    formData.append('titulo', convocatoria.titulo);
    formData.append('nota_minima',""+convocatoria.nota_minima);
    formData.append('maximo_horas',""+convocatoria.maximo_horas);
    if(convocatoria.file_soporte!=null){
      formData.append('file_soporte', convocatoria.file_soporte);
    }
    if(convocatoria.file_soporte_resolucion!=null){
      formData.append('file_soporte_resolucion', convocatoria.file_soporte_resolucion);
    }
    if(convocatoria.file_formato!=null){
      formData.append('file_formato', convocatoria.file_formato);
    }
    if(convocatoria.descripcion){
      formData.append('descripcion', convocatoria.descripcion);
    }
    formData.append('etapasString', JSON.stringify(convocatoria.etapas));
    formData.append("id", ""+convocatoria.id);
    formData.append("estado", ""+convocatoria.estado);
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
    
  }

  actualizarEstado(id: number, estado:boolean){
    let url = `${this.url}/Convocatorias/ActualizarEstado`
    let data = {
      id:id,
      estado:estado
    }
    return this.httpClient.post(url, data, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  // getDatosEst(id){
  //   return this.httpClient.get(`${Api.dev}/Convocatorias/exportarData/${id}`, {headers:this.headers}).map(resp=>{ 
  //     // console.log(resp);
  //     return resp});
  // }

  // geDatosEst(id){
     
  //   //let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
  //   let mediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  //   let options = new RequestOptions();
  //   options.headers = new Headers();
  //   options.headers.append('Authorization',  'Bearer ' + localStorage.getItem('userToken'));
  //   options.headers.append('responseType', 'blob');

  //   return this.http.get(`${Api.dev}/PublicConvocatoria/exportarData/${id}`, options).map(
  //     response => {
  //       return new Blob([ response['_body'] ], { type: mediaType });
  //     });

  // }

  geDatosEst(id):Observable<Blob>{
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
      'content-type':'application/json'
    });
    let options = new RequestOptions({responseType: ResponseContentType.Blob});
    options.headers = headers;
    return this.http.get(`${Api.dev}/Convocatorias/exportarData/${id}`,options)
    .map(res=> res.blob())

  }

  getCuantificacionActividades(id:number) {
    let url = `${Api.dev}/Convocatorias/CuantificacionActividades/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getConvocatoriasInscripcion() {
    let url = `${Api.dev}/Convocatorias/GetConvocatoriasInscripcionAyudantia`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getConvocatoriasInscripcionMonitorias() {
    let url = `${Api.dev}/Convocatorias/GetConvocatoriasInscripcionMonitoria`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }
  /**
   * Obtiene los datos para mostrar un resumen en el panel del modulo de ayudantias
   * en el tablero de usuario
   */
  getDatosModuloAyudantia(){
    let url = `${Api.dev}/Dashboard/DatosModuloAyundatias`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  /**
   * Obtiene los datos para mostrar un resumen en el panel del modulo de monitorias
   * en el tablero de usuario
   */
  getDatosModuloMonitoria(){
    let url = `${Api.dev}/Dashboard/DatosModuloAyundatias/3`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  /**
   * Obtiene los datos para mostrar un resumen en el panel del modulo de monitorias
   * en el tablero de usuario
   */
  getDatosModuloRefrigerios(){
    let url = `${Api.dev}/Dashboard/getDatosModuloRefrigerios`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }
}
