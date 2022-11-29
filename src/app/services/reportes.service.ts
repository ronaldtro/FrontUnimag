import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  });

  constructor(private httpClient:HttpClient) { }

  /**
   * Metodo para generar un archivo excel con el reporte de horas de los monitores. Creado para el uso de los usuarios de comite
   * @param convocatoria_id id de la convocatoria a consultar
   */
  getReporteHorasMonitoresParaComiteEnExcel(convocatoria_id:number):Observable<Blob>{
    //this.headers.append('responseType', 'blob');
    return this.httpClient.get(`${Api.dev}/ReportesMonitorias/ReporteHorasEstudianteComiteExcel/${convocatoria_id}`, { headers: this.headers, responseType: 'blob' }).map(res=> new Blob([res]));
  }

}
