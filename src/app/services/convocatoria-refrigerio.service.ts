import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { Http, Headers, RequestOptions, ResponseContentType, ResponseType } from '@angular/http';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import 'rxjs/Rx'
import { Convocatoria } from '../interfaces/Convocatorias.interface';
import { Observable } from 'rxjs/Rx';



@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaRefrigerioService {
  url = Api.dev; 
  //headers = new Headers({'content-type':'application/json'})
  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    'content-type':'application/json'
  });
  constructor(private http: Http, 
              private httpClient:HttpClient,
              ) { }
  
              
  getDatos(){
    let url = `${this.url}/ConvocatoriaRefrigerios/DatosNuevaConvocatoria`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }
  
  getConvocatoriasInscripcion() {
    let url = `${Api.dev}/ConvocatoriaRefrigerios/GetConvocatoriasInscripcionAlmuerzos`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  guardarConvocatoria(formData){
    let url = `${this.url}/ConvocatoriaRefrigerios/GuardarConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json'); 
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
    
  }

  listConvocatorias(){
    let url = `${this.url}/ConvocatoriaRefrigerios/ListarConvocatorias`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  historialConvocatorias(){
    let url = `${this.url}/ConvocatoriaRefrigerios/ListarHistorialConvocatorias`
    return this.httpClient.get(url,  {headers:this.headers}).map(data=>{
      return data;
    });
  }

  getConvocatoria(id: number){
    let url = `${this.url}/ConvocatoriaRefrigerios/GetConvocatoria/${id}`
    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      for(let i=0; i < data['convocatoria'][0].etapas.length; i++){
        data['convocatoria'][0].etapas[i].fecha_inicio = new Date(data['convocatoria'][0].etapas[i].fecha_inicio);
        data['convocatoria'][0].etapas[i].fecha_fin = new Date(data['convocatoria'][0].etapas[i].fecha_fin);          
      } 

      return data;
    });
  }

  editarConvocatoria(formData){
    let url = `${this.url}/ConvocatoriaRefrigerios/EditarConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
    
  }

  actualizarEstado(id: number, estado:boolean){
    let url = `${this.url}/ConvocatoriaRefrigerios/ActualizarEstado`
    let data = {
      id:id,
      estado:estado
    }
    return this.httpClient.post(url, data, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  geDatosEst(id):Observable<Blob>{
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
      'content-type':'application/json'
    });
    let options = new RequestOptions({responseType: ResponseContentType.Blob});
    options.headers = headers;
    return this.http.get(`${Api.dev}/ConvocatoriaRefrigerios/exportarData/${id}`,options)
    .map(res=> res.blob())

  }

  seleccionDirecta(id:number){
    let url = `${Api.dev}/ConvocatoriaRefrigerios/SeleccionDirecta/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  preseleccion(id:number){
    let url = `${Api.dev}/ConvocatoriaRefrigerios/Preseleccion/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  seleccion(seleccion:any){
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    });
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/Seleccion`, seleccion, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  crearTablaBeneficio(seleccion:any){
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    });
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/CrearTablasCupo`, seleccion, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  seleccionSegundaLista(seleccion:any){
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    });
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/SeleccionSegundaLista`, seleccion, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  getInscripcionAdministrativo() {
    let url = `${Api.dev}/ConvocatoriaRefrigerios/InscripcionAdministrativo`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  guardarInscripcion(formData){
    let url = `${this.url}/ConvocatoriaRefrigerios/GuardarInscripcion`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
  }

  getDatosEntregaExtemporanea() {
    let url = `${Api.dev}/ConvocatoriaRefrigerios/DatosEntregaExtemporanea`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  entregaExtemporanea(entrega:any){
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    });
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/EntregaExtemporanea`, entrega, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  getAsistente(id: number) {
    return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/GetAsistente/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  getCriteriosSeleleccion(id: number) {
    return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/GetCriteriosSeleleccion/${id}`, { headers: this.headers }).map(resp => { return resp });
  }

  getRegistroExtemporaneas() {
     return this.httpClient.get(`${Api.dev}/ConvocatoriaRefrigerios/GetRegistroExtemporanea/`, { headers: this.headers }).map(resp => { return resp });
  }

  getTablaSeleleccion(seleccion:any) {
    let headers = new Headers({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    });
    return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/GetTablaSeleleccion`, seleccion, {headers:this.headers}).map(data=>{
      return data;
    });
  }

}
