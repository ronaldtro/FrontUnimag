import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoPlazaService {

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private httpClient: HttpClient) { }

  getDatosTipo() {
    return this.httpClient.get(`${Api.dev}/TipoPlaza/DatosTipoPlaza/`, { headers: this.headers }).map(resp => { return resp });
  }

  estadoDato( dato ){
    let url = `${Api.dev}/TipoPlaza/estado/`
    return this.httpClient.post( url, dato , {headers:this.headers} )
        .map(res=>{
            return res;
        })
  }

  nuevoDato( dato:any){
   let url = `${Api.dev}/TipoPlaza/CrearTipo/`
   return this.httpClient.post( url, dato , {headers:this.headers} )
      .map(res=>{
          return res;
      })
  }

  editarDato(dato: any) {
    let url = `${Api.dev}/TipoPlaza/EditarTipo/`
   return this.httpClient.post( url, dato , {headers:this.headers} )
          .map(res=>{
              return res;
          })
  }


}
