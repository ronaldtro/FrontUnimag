import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx'


@Injectable({
    providedIn: 'root'
})
export class PeriodoRefrigerioService {
    url = Api.dev; 
    headers = new HttpHeaders({
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    });
constructor(private httpClient:HttpClient) { }

getDatos(){
    let url = `${this.url}/PeriodosRefrigerios/DatosPeriodo`
        return this.httpClient.get(url,{headers:this.headers}).map(data=>{
        return data;
    })
}

nuevoDato( dato:any){

   let url = `${this.url}/PeriodosRefrigerios/CrearPeriodo/`;
   return this.httpClient.post( url, dato , {headers:this.headers} )
        .map(res=>{
            return res;
        })

  }


  editarDato( dato:any){

    let url = `${this.url}/PeriodosRefrigerios/EditarPeriodo/`
    return this.httpClient.post( url, dato , {headers:this.headers} )
        .map(res=>{
            return res;
        })

  }

  estadoDato( dato ){
    let url = `${this.url}/PeriodosRefrigerios/estadoPeriodo/`
   return this.httpClient.post( url, dato , {headers:this.headers} )
        .map(res=>{
            return res;
        })
  }


}
