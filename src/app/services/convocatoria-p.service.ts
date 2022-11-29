import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx'
import { Api, TiposConvocatorias, Convocatoria } from '../class/api';
import { postulacion } from '../interfaces/plaza.interface';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaPService {

  url = Api.dev;
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });


  constructor(private httpClient: HttpClient) { }

  getDatos(tipo_convocatoria:TiposConvocatorias = null) {
    let url = `${this.url}/PublicConvocatoria/DatosConvocatoria/${tipo_convocatoria}`
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }
  getDatosMonitoria() {
    let url = `${this.url}/PublicConvocatoria/DatosConvocatoriaMonitoria`
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getDatosDeportistas(){
    let url = `${this.url}/InscripcionDeportistasArtistas/DatosConvocatoriaDeportistas`
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getPlaza(id: number) {
    let url = `${this.url}/PublicConvocatoria/CargarRequisitosEvaluacionConvocatoria/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  postular(data: any) {
    let url = `${this.url}/PublicConvocatoria/EstudianteConvocatoria`;
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
    });
    return this.httpClient.post(url, data, { headers: headers }).map(data => {
      return data;
    });
  }

  postularEstudiante(data:postulacion){
    let url = `${this.url}/PublicConvocatoria/EstudianteConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();

    for(var nombre in data){
      if(data[nombre]){ formData.append( nombre, data[nombre] ); }
    }
    
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
    
  }

  getConvocatoriaActiva() {
    let url = `${this.url}/PublicConvocatoria/DatosConvocatoriaActual`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  /**
   * Permite obtener las convocatorias que se encuentren en etapa de inscripción o posterior según el tipo de convocatoria dado.
   * @param tipo_id tipo de convocatoria
   * @returns Observable<Convocatoria[]> listado de convocatoria
   */
  getConvocatoriasPorTipo(tipo_id:number):Observable<Convocatoria[]>{
    let url = `${this.url}/PublicConvocatoria/getConvocatoriasPorTipo/${tipo_id}`;
    return this.httpClient.get<Convocatoria[]>(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getEntrevistasEstudiantes(id:number) {
    let url = `${this.url}/PublicConvocatoria/EntrevistasEstudiantes/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }
  getEstudiantesEvaluados(id:number) {
    let url = `${this.url}/PublicConvocatoria/EstudiantesEvaluados/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }
  getEstudiantesAprobados(id:number) {
    let url = `${this.url}/PublicConvocatoria/EstudiantesAprobados/${id}`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getConvocatoriaRefrigerios() {
    let url = `${this.url}/PublicConvocatoria/DatosConvocatoriaRefrigerios`
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  getConvocatoria(id: number){
    let url = `${this.url}/ConvocatoriaRefrigerios/GetConvocatoria/${id}`   
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }

}