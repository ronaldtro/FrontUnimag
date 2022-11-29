import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api, DatosEstudiante, CambiosAsignacionAyuda, EstudianteBeneficio } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class CondicionService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  headersHttp = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
              private httpClient:HttpClient) { }

  getDatos(){
    return this.http.get(`${Api.dev}/Condicion/DatosCondiciones`,{headers:this.headers}).map(resp=>{return resp.json()});
  }
  
  cambiarEstado(id:number){
    return this.http.post(`${Api.dev}/Condicion/EstadoCondicion`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarCondicion(condicion){
    return this.http.post(`${Api.dev}/Condicion/CrearCondicion`,condicion,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  /**
   * Método para obtener la información de los estudiantes
   * @param codigo codigo del estudiante
   */
  getDatosEstudiante(codigo:string):Observable<DatosEstudiante>{
    return this.httpClient.get<DatosEstudiante>(`${Api.dev}/CondicionesEstudiantes/getDatosEstudiante/${codigo}`,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Método para obtener el listado de los estudiantes que tienen ayudas asignadas
   */
  getEstudiantesConAyudas(tipoSolicitud?:number):Observable<DatosEstudiante[]>{
    return this.httpClient.get<DatosEstudiante[]>(`${Api.dev}/CondicionesEstudiantes/EstudiantesAyudas/${tipoSolicitud}`,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Método para obtener los almacenes que permiten realizar entregas de ayudas
   */
  getAlmacenesEntrega():Observable<any>{
    return this.httpClient.get<any>(`${Api.dev}/CondicionesEstudiantes/getAlmacenesEntrega/`,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo para obtener los beneficios de ayuda
   */
  getBeneficiosDeAyuda():Observable<any>{
    return this.httpClient.get<any>(`${Api.dev}/CondicionesEstudiantes/getBeneficiosDeAyuda/`,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Registrar la asignación del beneficio con el estudainte
   * @param estudiante datos del beneficio asignado al estudiante
   */
  registrarAsignacionDeAyuda(estudiante:EstudianteBeneficio):Observable<any>{
    return this.httpClient.post<any>(`${Api.dev}/CondicionesEstudiantes/registrarAsignacionBeneficio/`, estudiante,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo para verificar el registro del beneficio relacionado con el estudiante
   * @param id id del beneficio relacionado con el estudiante
   */
  verificarRegistroAyuda(id:number, cambioAyuda:CambiosAsignacionAyuda):Observable<any>{
    return this.httpClient.put<any>(`${Api.dev}/CondicionesEstudiantes/verificarRegistroAyuda/${id}`, cambioAyuda, {headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo para verificar el registro del beneficio relacionado con el estudiante
   */
  verificarRegistroMultipleAyuda(cambioAyuda:CambiosAsignacionAyuda):Observable<any>{
    return this.httpClient.post<any>(`${Api.dev}/CondicionesEstudiantes/verificarRegistroMultipleAyuda/`, cambioAyuda, {headers:this.headersHttp}).map(data=>{
      return data;
    });
  }
  
  /**
   * Metodo para registrar envios a las solicitudes aprobadas
   */
  registrarEnvioMultipleAyuda(cambioAyuda:CambiosAsignacionAyuda):Observable<any>{
    return this.httpClient.post<any>(`${Api.dev}/CondicionesEstudiantes/registrarEnvioMultipleAyuda/`, cambioAyuda, {headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo para registrar la entrega de la ayuda
   * @param id id del beneficio relacionado con el estudiante
   */
  registrarEntregaAyuda(id:number, cambioAyuda:CambiosAsignacionAyuda):Observable<any>{
    return this.httpClient.put<any>(`${Api.dev}/CondicionesEstudiantes/registrarEntregaAyuda/${id}`, cambioAyuda,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo para eliminar el registro de la ayuda
   * @param id id del beneficio relacionado con el estudiante
   */
  eliminarRegistroAyuda(id:number):Observable<any>{
    return this.httpClient.delete<any>(`${Api.dev}/CondicionesEstudiantes/eliminarRegistroAyuda/${id}`,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }

  /**
   * Metodo para eliminar un envio registrado a una solicitud dado su id
   * @param id id del envio registrado para el beneficio relacionado con el estudiante
   */
  eliminarEnvioAyuda(id:number):Observable<any>{
    return this.httpClient.delete<any>(`${Api.dev}/CondicionesEstudiantes/eliminarEnvioAyuda/${id}`,{headers:this.headersHttp}).map(data=>{
      return data;
    });
  }
}
