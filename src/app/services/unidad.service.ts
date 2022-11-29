import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getListado(){
    return this.http.get(`${Api.dev}/Unidad/GetListado`,{headers:this.headers}).map(resp=>{return resp.json()});
  }
  getUnidades(){
    return this.http.get(`https://www.unimagdalena.edu.co/Shared/getAllUnits`).map(resp=>{return resp.json()});
  }
  getUnidad(id:number){
    return this.http.get(`${Api.dev}/Unidad/GetUnidad/${id}`,{headers:this.headers}).map(resp=>{ 
      return resp.json();
    });
  }
  cambiarEstado(id:number){
    return this.http.post(`${Api.dev}/Unidad/CambiarEstado`,{'unidad_id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarUnidad(unidad){
    return this.http.post(`${Api.dev}/Unidad/CrearUnidad`,unidad,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

  editarUnidad(unidad){
    return this.http.post(`${Api.dev}/Unidad/EditarUnidad`,unidad,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }
  agregarRol(unidad){
    return this.http.post(`${Api.dev}/Unidad/AgregarRol`,unidad,{headers:this.headers}).map(data=>{
      return data;
    });
    
  }

}
