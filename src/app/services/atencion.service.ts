import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AtencionService {


  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  //   getDatosAtencion(id){
  //     let data={id:id.id};
  //     let url = `${Api.dev}/Atencion/getDatosAtencion/`
  //  return this.httpClient.post( url, data , {headers:this.headers}).map(res=>{ return res; });
  // }

  getDatosAtencion(id?: number){
    let url = `${Api.dev}/Atencion/getDatosAtencion/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }

  getDatosAtencionN(id?: number){
    let url = `${Api.dev}/Atencion/getDatosAtencionN/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }


  
  /**
   * Metodo para traer los datos de la ventana atencion deportologo
   * http://localhost:4200/atenciones/deportologia/{bandera}/{id}
   * @param id 
   */
  getDatosAtencionDeportologo(id?:number){
    let url = ` ${Api.dev}/Atencion/getDatosAtencionDeportologia/${id}` 
    return this.httpClient.get(url, {headers:this.headers}).map( data=>{
      return data;
    } );
  }

  getDatosAtencionNoProgramada(id?: number){
    let url = `${Api.dev}/Atencion/getDatosAtencionDeportologiaNoProgramada/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }


  getAtencion(id?: number){
    let url = `${Api.dev}/Atencion/getAtencion/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }

  getAtencionEnfermeria(id?: number){
    let url = `${Api.dev}/Atencion/getAtencionEnfermeria/${id}`    
    return this.httpClient.get(url, {headers: this.headers}).map(data=>{
      return data;
    });
  }

  // getAtencionDeportiva(id?: number){
  //   let url = `${Api.dev}/Atencion/getAtencionDeportiva/${id}`    
  //   return this.httpClient.get(url, {headers: this.headers}).map(data=>{
  //     return data;
  //   });
  // }

  postRegistrarAtencion(data: any) {
      return this.httpClient.post(`${Api.dev}/Atencion/RegistrarAtencion`, data, { headers: this.headers }).map(resp => { return resp })
  }

  postRegistrarIncapacidad(data: any) {
    return this.httpClient.post(`${Api.dev}/Atencion/RegistrarAtencionIncapacidad`, data, { headers: this.headers }).map(resp => { return resp })
}

  postRegistrarAtencionEnfermeria(data: any) {
    return this.httpClient.post(`${Api.dev}/Atencion/RegistrarAtencionEnfermeria`, data, { headers: this.headers }).map(resp => { return resp })
  }

  postRegistrarAtencionPsicologia(data, consentimiento_informado) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    for (let nombre in data) {
      if (data[nombre] != null && data[nombre] != "") {
          formData.append(nombre, data[nombre]);
      }
    }
    
    if (consentimiento_informado != null) {
      formData.append("consentimiento_informado", consentimiento_informado);
      console.log("consentimiento agregado al formData");
    }


    console.log("Mensaje desde atencion service: "+data+" "+consentimiento_informado);
    return this.httpClient.post(`${Api.dev}/Atencion/RegistrarAtencionPsicologia`, formData,{headers:headers}).map(resp => { return resp })
  }

  postRegistrarAtencionDeportiva(data: any) {
    return this.httpClient.post(`${Api.dev}/Atencion/RegistrarAtencionMedDeporte`, data, { headers: this.headers }).map(resp => { return resp })
  }
  getDatosPaciente(data:any) {
    return this.httpClient.post(`${Api.dev}/Atencion/GetDatosPaciente`, data, { headers: this.headers }).map(resp => { return resp })
  } 

  // getDatosPaciente(data){
  //   let form = JSON.stringify(data);
  //   let url = `${Api.dev}/Atencion/GetDatosPacientes/${form}`    
  //   return this.httpClient.get(url, {headers: this.headers}).map(data=>{
  //     return data;
  //   });
  // }


  addEvolucion(data: any) {
    return this.httpClient.post(`${Api.dev}/Atencion/guardarEvolucion`, data, { headers: this.headers }).map(resp => { return resp })
  }
  
  // getDatosActualizacion(){
  //   return this.httpClient.get(`${Api.dev}/Citas/getDatosActualizacion`,{headers:this.headers}).map(resp=>{return resp});
  // }

  // postActualizarDatos(data: any) {
  //   return this.httpClient.post(`${Api.dev}/Citas/ActualizarInformacion`, data, { headers: this.headers }).map(resp => { return resp })
  // }



  // getDatosBuscar( dato:any){
  //   let url = `${Api.dev}/citas/getCitas/`;
  //   return this.httpClient.post( url, dato , {headers:this.headers} )
  //        .map(res=>{
  //            return res;
  //     }) 
  //  }
  
  //  postReservarCita(data: any) {
  //   return this.httpClient.post(`${Api.dev}/Citas/ReservarCita`, data, { headers: this.headers }).map(resp => { return resp })
  // }


  // getCitas(){
  //   return this.httpClient.get(`${Api.dev}/citas/getPersona`,{headers:this.headers}).map(resp=>{return resp});
  // }
  
  // getAgenda(){
  //   return this.httpClient.get(`${Api.dev}/citas/getAgenda`,{headers:this.headers}).map(resp=>{return resp});
  // }
  
  // // getDatosBusqueda( dato:any){
  // //   let url = `${Api.dev}/citas/getAgenda/`;
  // //   return this.httpClient.post( url, dato , {headers:this.headers}).map(res=>{return res;})
  // // }


  //  cancelarCita( id:any ){
  //   let data={id:id.id};
  //   let url = `${Api.dev}/citas/cancelarCita`
  //  return this.httpClient.post( url, data , {headers:this.headers} )
  //       .map(res=>{
  //           return res;
  //       })
  // }

  getAtencionesNoProgramadas(idTipoProfesional:Number){
    return this.httpClient.get(`${Api.dev}/Atencion/getAtencionesNoProgramadas/${idTipoProfesional}`,{headers:this.headers});
  }

}
