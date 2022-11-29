import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BolsaPresupuestalService {

  headers = new Headers({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    'Content-type': 'aplication/json'
  });

  constructor(private http:Http,
    private httpClient:HttpClient) { }

  getDatosSolicitar(){
    return this.http.get(`${Api.dev}/BolsaPresupuestal/EnlacesBolsa`,{headers:this.headers}).map(resp=>{return resp.json()});
  }

  getListados(){
    return this.http.get(`${Api.dev}/BolsaPresupuestal/getListados`,{headers:this.headers}).map(resp=>{return resp.json()});
  }

  getBolsa(id:number){
    return this.http.get(`${Api.dev}/BolsaPresupuestal/getBolsa/${id}`,{headers:this.headers}).map(resp=>{ 
      let respuesta: any = resp.json();
      respuesta['bolsas']['fecha_expedicion'] = new Date(respuesta['bolsas']['fecha_expedicion']);
      return respuesta;
    });
  }

  cambiarEstado(id:number){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post(`${Api.dev}/BolsaPresupuestal/CambiarEstado`,{'bolsa_id':id},{headers:headers}).map(resp=>{
      return resp;
    });
  }

  guardarBolsa(bolsa,file_soporte){
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    for (let nombre in bolsa) {
      if (bolsa[nombre] != null && bolsa[nombre] != "") {

        if(nombre == 'fecha_expedicion'){ 
          formData.append(nombre,  bolsa[nombre].toDateString());
        }else{
          formData.append(nombre, bolsa[nombre]);
        }
      }
    }
    
    if (file_soporte != null) {
      formData.append("file_soporte", file_soporte);
    }

  
    if(bolsa.id == null){
      return this.httpClient.post(`${Api.dev}/BolsaPresupuestal/CrearBolsaPresupuestal`,formData,{headers:headers}).map(data=>{
        return data;
      });
    }else{
      return this.httpClient.post(`${Api.dev}/BolsaPresupuestal/EditarBolsaPresupuestal`,formData,{headers:headers}).map(data=>{
        return data;
      });
    }
    
  }

}
