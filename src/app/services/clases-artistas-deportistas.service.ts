import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ClasesArtistasDeportistasService {
  
  url = Api.dev; 

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getClases(idSupervidor : number){
    return this.httpClient.get(`${this.url}/ClasesDeportistasArtistas/GetClases/${idSupervidor}`,{headers:this.headers}).map(data=>{
        return data
    });
  }

  guardarClase(clase:any){
    return this.httpClient.post(`${this.url}/ClasesDeportistasArtistas/GuardarClase`, clase, {headers:this.headers}).map(data=>{
        return data;
      });
  }

  getEstudiantesClase(idClase:number){
    return this.httpClient.get(`${this.url}/ClasesDeportistasArtistas/GetEstudiantesClase/${idClase}`,{headers:this.headers}).map(data=>{
      return data
    });
  }

  asignarEstudianteAClase(estudianteClase:any){
    return this.httpClient.post(`${this.url}/ClasesDeportistasArtistas/AsignarEstudianteAClase`, estudianteClase, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  eliminarEstudianteClase(identificacionEstudiante:string){
    return this.httpClient.post(`${this.url}/ClasesDeportistasArtistas/EliminarEstudianteClase`,{'id':identificacionEstudiante},{headers:this.headers}).map(data=>{
      return data
    });
  }

  getSupervisores(){
    return this.httpClient.get(`${this.url}/ClasesDeportistasArtistas/GetSupervisores`, {headers:this.headers}).map(data=>{
      return data
    });
  }

  cambiarEstado(id:number){
    return this.httpClient.post(`${this.url}/ClasesDeportistasArtistas/CambiarEstado`,{'id':id},{headers:this.headers}).map(data=>{
      return data;
    });
  }

  getGrupos(){
    return this.httpClient.get(`${this.url}/ClasesDeportistasArtistas/GetGrupos`, {headers:this.headers}).map(data=>{
      return data
    });
  }

}