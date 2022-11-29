import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstudianteCondicionService {
  url = Api.dev; 
  headers = new HttpHeaders({
    
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });
  constructor(private httpClient:HttpClient) { }

  getCondicionEstudiante(){
    return this.httpClient.get(`${Api.dev}/CondicionesEstudiantes/CondicionesEstudiante`, {headers:this.headers}).map(resp=>{return resp});             
                          
  }

  asignarCondicion(dato:any){
    return this.httpClient.post(`${Api.dev}/CondicionesEstudiantes/asignarCondiciones_estudiantes`,dato,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  asignarCondicion2(dato:any){
    return this.httpClient.post(`${Api.dev}/CondicionesEstudiantes/CambiarCondicionMultiple`,dato,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  
  postEstudianteNuevo( dato:any){
    let url = `${this.url}/CondicionesEstudiantes/AgregarEstudiantes/`;
    return this.httpClient.post( url, dato , {headers:this.headers} )
         .map(res=>{
             return res;
      }) 
   }

}
