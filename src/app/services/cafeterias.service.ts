import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx'


@Injectable({
    providedIn: 'root'
})
export class CafeteriaService {
    url = Api.dev; 
    headers = new HttpHeaders({
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    });
constructor(private httpClient:HttpClient) { }

    getDatos(){
    let url = `${this.url}/Cafeterias/DatosCafeterias`
        return this.httpClient.get(url,{headers:this.headers}).map(data=>{
        return data;
    })
    }

    nuevoDato( dato:any){
        let url = `${this.url}/Cafeterias/CrearCafeteria/`;
        return this.httpClient.post( url, dato , {headers:this.headers} )
                .map(res=>{
                    return res;
                })
        }

     estadoDato( id:number ){
        let url = `${this.url}/Cafeterias/EstadoCafeteria/`
            return this.httpClient.post( url, {'id':id} , {headers:this.headers} )
            .map(res=>{
                return res;
            })
    }


    // getReporte(){
    //     let url = `${this.url}/Cafeterias/GetReportes`
    //     return this.httpClient.get(url,{headers:this.headers}).map(data=>{
    //     return data;
    // })

    // }

    // getReporteEstudiantes(){
    //     let url = `${this.url}/Cafeterias/GetReportes`
    //     return this.httpClient.get(url,{headers:this.headers}).map(data=>{
    //     return data;
    // })

    // }

   

    getReporte(id?: number){
        let url = `${Api.dev}/Cafeterias/GetReportes/${id}`    
        return this.httpClient.get(url, {headers: this.headers}).map(data=>{
          return data;
        });
      }

    getReporteEstudiantes(id?: number){
        let url = `${Api.dev}/Cafeterias/GetReportesEstudiantes/${id}`    
        return this.httpClient.get(url, {headers: this.headers}).map(data=>{
          return data;
        });
      }
    /**
     * Función para obtener el listado de entregas de beneficios alimenticios realizados en todas las convocatorias
     * 
     * @returns Listado de entregas realizadas.
     */  
    getReporteEntregasConvocatorias():any{
        return this.httpClient.get(`${Api.dev}/Cafeterias/GetReportesEntregasConvocatorias/`, {headers: this.headers}).map(data=>{
            return data;
          });
    }


}


