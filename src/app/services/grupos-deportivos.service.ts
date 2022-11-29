import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GruposDeportivosService {
  
  url = Api.dev; 

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getGrupos(){
    return this.httpClient.get(`${this.url}/GruposDeportivos/GetGrupos`,{headers:this.headers}).map(data=>{
        return data
    });
  }

  getGrupo(id:number){
    return this.httpClient.get(`${this.url}/GruposDeportivos/GetGrupo/${id}`,{headers:this.headers}).map(data=>{
      return data
    });
  }

  getDatosGrupo(){
    return this.httpClient.get(`${this.url}/GruposDeportivos/GetDatosGrupo`,{headers:this.headers}).map(data=>{
      return data
    });
  }


  guardarGrupo(grupo:any){
 
    let url = `${this.url}/GruposDeportivos/GuardarGrupo`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();

    if(grupo.id != null){
      formData.append('id', grupo.id);
    }
    
    formData.append('nombre', grupo.nombre);
    formData.append('descripcion', grupo.descripcion);
    formData.append('idDisciplina', grupo.idDisciplina);
    formData.append('idNivelFormativo', grupo.idNivelFormativo);
    formData.append('diasString', JSON.stringify(grupo.dias));
    formData.append('rolesString', JSON.stringify(grupo.listaRoles));
    
    if(grupo.listaRolesEliminar != null){
      formData.append('listaRolesEliminarString', JSON.stringify(grupo.listaRolesEliminar));
    }
    
    if(grupo.listaDiasEliminar != null){
      formData.append('listaDiasEliminarString', JSON.stringify(grupo.listaDiasEliminar));
    }

    if(grupo.encargado != undefined){
      if(grupo.encargado.fecha_nacimiento != undefined){
      
        if((typeof grupo.encargado.fecha_nacimiento) != 'string'){
          grupo.encargado.fecha_nacimiento = grupo.encargado.fecha_nacimiento.toDateString()
        }else{
          delete grupo.encargado.fecha_nacimiento;
        }
      }
   }

    formData.append('encargadoString', JSON.stringify(grupo.encargado));
    if(grupo.file_imagen != null){
      formData.append('file_imagen', grupo.file_imagen);
    }

    return this.httpClient.post(url, formData, {headers:this.headers}).map(data=>{
        return data;
      });
  }
  
  getEstudiantesInscritos(idPeriodo : number, idGrupo : number){
    return this.httpClient.post(`${this.url}/GruposDeportivos/GetEstudiantesInscritos`, {'idPeriodo': idPeriodo, 'idGrupo' : idGrupo}, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  buscarEncargado(identificacion:number){
    return this.httpClient.get(`${this.url}/GruposDeportivos/GetEncargado/${identificacion}`,{headers:this.headers}).map(data=>{
      return data
    });
  }

  cambiarEstado(id:number){
    return this.httpClient.post(`${this.url}/GruposDeportivos/CambiarEstado`, {'id': id}, {headers:this.headers}).map(data=>{
      return data;
    });
  }


}