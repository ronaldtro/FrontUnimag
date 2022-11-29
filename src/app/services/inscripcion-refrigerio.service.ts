import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InscripcionRService {
    url = Api.dev; 
    headers = new HttpHeaders({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    });
    constructor(private httpClient:HttpClient) { }

    getDatos(id: number){
        return this.httpClient.get(`${Api.dev}/InscripcionBeneficios/DatosInscripcion/${id}`, { headers: this.headers }).map(resp => { return resp });
    }
        
    guardarIncripcion( dato:any){ 
        let url = `${this.url}/InscripcionBeneficios/InscripcionRefrigerio/`;
        return this.httpClient.post( url, dato , {headers:this.headers} )
            .map(res=>{
                return res;
        })
    }

    getInfoEstudiante(){
      return this.httpClient.get(`${Api.dev}/InscripcionBeneficios/DatosEstudiante`, {headers:this.headers}).map(resp=>{return resp});                                    
    }

    consultarDias(data){
      let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json'); 
      return this.httpClient.post(`${Api.dev}/ConvocatoriaRefrigerios/ConsultarDias`,data,{headers:this.headers}).map(data=>{
        return data;
      });
      
    }

    cancelarInscripcion(dato:any){
      let url = `${this.url}/InscripcionBeneficios/CancelarInscripcion/`;
        return this.httpClient.post( url, dato , {headers:this.headers} )
            .map(res=>{
                return res;
        })
    }

    cancelarSeleccion(data:any){
      let url = `${this.url}/InscripcionBeneficios/CancelarSeleccion`
      let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');  
      return this.httpClient.post(url, data, {headers:headers}).map(data=>{
        return data;
      });
    }

    getDatosEditar(id:number, beneficioId:number) {
      let url = `${this.url}/InscripcionBeneficios/DatosInscripcionEditar/${id}/${beneficioId}`
      return this.httpClient.get(url, { headers: this.headers }).map(data => {
        return data;
      })
    }

    getDatosComplementariosEstudiante(id:number) {
      let url = `${this.url}/InscripcionBeneficios/DatosComplementariosEstudiante/${id}`
      return this.httpClient.get(url, { headers: this.headers }).map(data => {
        return data;
      })
    }

    editarIncripcion( dato:any){ 
      let url = `${this.url}/InscripcionBeneficios/EditarInscripcionRefrigerio/`;
      return this.httpClient.post( url, dato , {headers:this.headers} )
          .map(res=>{
              return res;
      })
  }

}