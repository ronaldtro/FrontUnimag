import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders ,HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  url = Api.dev;
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('userToken')
  });
  constructor(private httpClient:HttpClient) { }

  
  getDatosLugares() {
    return this.httpClient.get(`${Api.dev}/Consultorios/DatosConsultorio`, { headers: this.headers }).map(resp => { return resp });
  }

  postCrearEsp(data: any) {
    return this.httpClient.post(`${Api.dev}/Consultorios/CrearConsultorio`, data, { headers: this.headers }).map(resp => { return resp })
  }

  postEditarEsp(data: any) {
    return this.httpClient.post(`${Api.dev}/Consultorios/EditarConsultorio`, data, { headers: this.headers }).map(resp => { return resp })
  }

  postEstadoDato(data: any) {
    return this.httpClient.post(`${Api.dev}/Consultorios/EstadoConsultorio`, data, { headers: this.headers }).map(resp => { return resp })
  }

 
}
