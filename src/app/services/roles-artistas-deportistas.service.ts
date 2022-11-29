import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class RolesArtistasDeportistasService {
    
    url = Api.dev; 
    headers = new HttpHeaders({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    });

    constructor(private httpClient:HttpClient) { }

    getRoles(idGrupo : number){
        return this.httpClient.get(`${Api.dev}/RolesGruposDeportistas/GetRoles/${idGrupo}`, { headers: this.headers }).map(resp => { return resp });
    }

    guardarRol(rol : any){
        let url = `${this.url}/RolesGruposDeportistas/GuardarRol/`;
        return this.httpClient.post( url, rol , {headers:this.headers} )
            .map(res=>{
                return res;
        })
    }
    
    cambiarEstado(id : number){
        let url = `${this.url}/RolesGruposDeportistas/CambiarEstado/`;
        return this.httpClient.post( url, {'id' : id} , {headers:this.headers} )
            .map(res=>{
                return res;
        })
    }
}