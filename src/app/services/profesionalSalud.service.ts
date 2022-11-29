import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalSaludService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getDatos(){
    return this.httpClient.get(`${Api.dev}/ProfesionalSalud/Datos`,{headers:this.headers}).map(resp=>{return resp});
  }
  getDatosCrear(){
    return this.httpClient.get(`${Api.dev}/ProfesionalSalud/DatosCrear`,{headers:this.headers}).map(resp=>{return resp});
  }
  getProfesional(id:number){
    return this.httpClient.get(`${Api.dev}/ProfesionalSalud/getProfesional/${id}`,{headers:this.headers}).map(resp=>{return resp});
  }
  cambiarEstado(id:number){
    return this.httpClient.post(`${Api.dev}/ProfesionalSalud/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }
  guardarProfesional(profesional){
    return this.httpClient.post(`${Api.dev}/ProfesionalSalud/GuardarProfesional`,profesional,{headers:this.headers}).map(data=>{
      return data;
    });    
  }

  

  // getProfesionales_dias_consultorios(){
  //   return this.httpClient.get(`${Api.dev}/Consultorios/Datos_consultorios_dias`,{headers:this.headers}).map(resp=>{return resp});
  // }


  getProfesionales_dias_consultorios(id?: number){
    let url = `${Api.dev}/Consultorios/Datos_consultorios_dias/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }

  getHorario(id?: number){
    let url = `${Api.dev}/Consultorios/GetHorario/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }
  agendaDiaraia(id?: number){
    let url = `${Api.dev}/HorarioProfesionalSalud/HorarioDiarioAsignado/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }
  agenda(id?: Number){
    let url = `${Api.dev}/HorarioProfesionalSalud/AtencionesDiarias/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }
  nuevoEstudio(estudio){
    return this.httpClient.post(`${Api.dev}/EstudiosRealizados/GuardarEstudio`,estudio,{headers:this.headers}).map(data=>{
        return data;
    });
  }
  agregarEstudio(id,estudio_id,nivelProfesional_id){
    return this.httpClient.post(`${Api.dev}/ProfesionalSalud/AgregarEstudio`
    ,{'id':id,'nivelProfesional_id':nivelProfesional_id,'estudio_realizado_id':estudio_id},{headers:this.headers}).map(data=>{
        return data;
    });
  }
  eliminarEstudio(id,estudio_id){
    return this.httpClient.post(`${Api.dev}/ProfesionalSalud/EliminarEstudio`
    ,{'id':id,'estudio_realizado_id':estudio_id},{headers:this.headers}).map(data=>{
        return data;
    });
  }

  crearProfesionales_dias_consultorios( dato:any){
    let url = `${Api.dev}/Consultorios/CrearHorarioProfesional/`
    return this.httpClient.post( url, dato , {headers:this.headers} )
        .map(res=>{
            return res;
    });        
  }

  editarProfesionales_dias_consultorios( dato:any){
    console.log(dato)
    let url = `${Api.dev}/Consultorios/EditarHorarioProfesional/`
    return this.httpClient.post( url, dato , {headers:this.headers} )
        .map(res=>{
            return res;
    });        
  }


}

