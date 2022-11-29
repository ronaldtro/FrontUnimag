import { Injectable } from '@angular/core';
import { Api, DatosEmergencia } from '../class/api';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });


  constructor(private http:Http, private httpClient:HttpClient) { }

  getDatosBeneficios(){
    return this.httpClient.get(`${Api.dev}/Beneficios/DatosBeneficios`, {headers:this.headers}).map(resp=>{return resp});
  }

  postCrearBeneficio(data){
    return this.httpClient.post(`${Api.dev}/Beneficios/CrearBeneficio`, data, {headers:this.headers}).map(resp=>{return resp});
  }

  postEstadoBeneficio(id:number){
    return this.httpClient.post(`${Api.dev}/Beneficios/EstadoBeneficio`, {'id':id}, {headers:this.headers}).map(resp=>{return resp});
  }

  /**
   * Metodo para obtener el listado de EPS registradas en el sistema
   */
  getEPS():Observable<any>{
    return this.httpClient.get<any>(`${Api.dev}/Ayudas/getEPS`, {headers:this.headers});
  }

  /**
   * Metodo para almacenar la información de la solicitud de ruta humanitaria
   * @param solicitud información ingresada por el estudiante
   */
  guardarSolicitudRutaHumanitaria(solicitud:DatosEmergencia):Observable<any>{
    return this.httpClient.post<any>(`${Api.dev}/Ayudas/guardarSolicitudAyuda`, solicitud, {headers:this.headers});
  }

  /**
   * Metodo para verificar si un estudiante ha realizado una solicitud de ruta humanitaria
   * @param id_estudiante id del usuario del estudiante
   */
  vertificarSolicitudRutaHumanitaria(id_estudiante:number):Observable<any>{
    return this.httpClient.get<any>(`${Api.dev}/Ayudas/verificarSolicitudAyuda/${id_estudiante}`, {headers:this.headers});
  }

  /**
   * Metodo para obtener el listado de departamentos y los municipios que contiene desde un json en el proyecto
  */
  getMunicipios():Observable<any>{
    return this.httpClient.get<any>(`/assets/municipios.json`).map(resp=>{
      let departamentos = resp.reduce((r, a) => {
        r[a.departamento] = [...r[a.departamento] || [], a];
        return r;
       }, {});
       var resultArray = Object.keys(departamentos).map(function(name){
            return {departamento: name, municipios: departamentos[name]};
        }).sort((a, b) => a["departamento"] > b["departamento"] ? 1 : a["departamento"] === b["departamento"] ? 0 : -1);
      return resultArray;
    });
  }

}