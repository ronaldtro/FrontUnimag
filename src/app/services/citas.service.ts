import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CitasService {


  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getEspecialidad(){
    return this.httpClient.get(`${Api.dev}/citas/getEspecialidad`,{headers:this.headers}).map(resp=>{return resp});
  }

  
  getDatosActualizacion(data?:any){
   let id= {
     id:data 
   }
    return this.httpClient.post(`${Api.dev}/Citas/getDatosActualizacion`,id,{headers:this.headers}).map(resp=>{return resp});
  }

  postActualizarDatos(data: any) {
    return this.httpClient.post(`${Api.dev}/Citas/ActualizarInformacion`, data, { headers: this.headers }).map(resp => { return resp })
  }



  getDatosBuscar( dato:any){
    let url = `${Api.dev}/citas/getCitas/`;
    return this.httpClient.post( url, dato , {headers:this.headers} )
         .map(res=>{
             return res;
      }) 
   }
  
   postReservarCita(data: any) {
    return this.httpClient.post(`${Api.dev}/Citas/ReservarCita`, data, { headers: this.headers }).map(resp => { return resp })
  }


  getCitas(){
    return this.httpClient.get(`${Api.dev}/citas/getPersona`,{headers:this.headers}).map(resp=>{return resp});
  }
  
  getAgenda(){
    return this.httpClient.get(`${Api.dev}/citas/getAgenda`,{headers:this.headers}).map(resp=>{return resp});
  }
  
  // getDatosBusqueda( dato:any){
  //   let url = `${Api.dev}/citas/getAgenda/`;
  //   return this.httpClient.post( url, dato , {headers:this.headers}).map(res=>{return res;})
  // }


   cancelarCita( id:any ){
    let data={id:id.id};
    let url = `${Api.dev}/citas/cancelarCita`
   return this.httpClient.post( url, data , {headers:this.headers} )
        .map(res=>{
            return res;
        })
  }

  getInfoPacienteById(id?:number):any{
    return this.httpClient.get(`${Api.dev}/citas/GetInfoPacienteById/${id}`,{headers:this.headers}).map(resp=>{return resp});
  }

  getInfoPacienteByCita(id?:number):any{
    return this.httpClient.get(`${Api.dev}/Atencion/GetInfoPacienteByCita/${id}`,{headers:this.headers}).map(resp=>{return resp});
  }


}
