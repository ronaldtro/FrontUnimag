import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class  EvaluarEstudiantesDeportistasService {
    url = Api.dev; 
    headers = new HttpHeaders({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    });

    constructor(private httpClient:HttpClient) { }

    getEstudiantesPostulados(idConvocatoria : number){
        return this.httpClient.get(`${Api.dev}/ConvocatoriasDeportistasArtistas/GetEstudiantesPostulados/${idConvocatoria}`, { headers: this.headers }).map(resp => { return resp });
    }

    getItemsDisciplinaConvocatoria(idDisciplinaConvocatoria : number, idInscripcion : number){
      return this.httpClient.post(`${this.url}/EvaluacionEstudiantesDeportistas/GetItemsDisciplinaConvocatoria`, {'idDisciplinaConvocatoria' : idDisciplinaConvocatoria, 'idInscripcion' : idInscripcion} , {headers:this.headers} )
          .map(res=>{
              return res;
      })
    }

    guardarEvaluacionEstudiante(evaluacion:any){
      let url = `${this.url}/EvaluacionEstudiantesDeportistas/GuardarEvaluacionEstudiante`;
      return this.httpClient.post( url, evaluacion , {headers:this.headers} )
          .map(res=>{
              return res;
      })
    }

    getInscripcion(id : number){
      return this.httpClient.get(`${Api.dev}/EvaluacionEstudiantesDeportistas/GetDatosEstudianteInscrito/${id}`, { headers: this.headers }).map(resp => { return resp });
    }

    seleccionarEstudiante(idInscripcion : number){
      let url = `${this.url}/EvaluacionEstudiantesDeportistas/SeleccionarEstudiante`;
      return this.httpClient.post( url, {'idInscripcion':idInscripcion} , {headers:this.headers} )
          .map(res=>{
              return res;
      })
    }
    
}