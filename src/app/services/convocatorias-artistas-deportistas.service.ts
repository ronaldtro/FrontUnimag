import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { Convocatoria } from '../interfaces/Convocatorias.interface';

@Injectable({
  providedIn: 'root'
})

export class ConvocatoriasArtistasDeportistasService {
  
  url = Api.dev; 

  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getConvocatorias(){
    return this.httpClient.get(`${this.url}/ConvocatoriasDeportistasArtistas/ListarConvocatorias`,{headers:this.headers}).map(data=>{return data});
  }

  getConvocatoriaPorId(id:number){
   return this.httpClient.get(`${this.url}/ConvocatoriasDeportistasArtistas/GetConvocatoria/${id}`,{headers:this.headers}).map(data=>{return data});
  }

  getConvocatoriasInscripcion() {
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GetConvocatoriasInscripcion`;
    return this.httpClient.get(url, { headers: this.headers }).map(data => {
      return data;
    });
  }

  cambiarEstado(id:number){
   
    return this.httpClient.post(`${this.url}/ConvocatoriasDeportistasArtistas/CambiarEstado`,{'id':id},{headers:this.headers}).map(data=>{
      return data;
    });
  }

  guardarConvocatoria(convocatoria){
    
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GuardarConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
   
    formData.append('titulo', convocatoria.titulo);
    if(convocatoria.descripcion){
      formData.append('descripcion', convocatoria.descripcion);
    }
    if(convocatoria.file_soporte_resolucion!=null){
      formData.append('file_soporte_resolucion', convocatoria.file_soporte_resolucion);
    }
    formData.append('fecha_expedicion', convocatoria.fecha_expedicion.toDateString());
    formData.append('file_soporte', convocatoria.file_soporte);
    
    formData.append('etapasString', JSON.stringify(convocatoria.etapas));


    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
  }

  getEstadosNuevaCovocatoria(){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GetEstadosNuevaCovocatoria`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  editarConvocatoria(convocatoria:any){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/EditarConvocatoria`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
   
    formData.append('fecha_expedicion', convocatoria.fecha_expedicion.toDateString());
    formData.append('titulo', convocatoria.titulo);
    
    if(convocatoria.file_soporte!=null){
      formData.append('file_soporte', convocatoria.file_soporte);
    }

    if(convocatoria.file_lista_seleccionados != null){
      formData.append('file_lista_seleccionados', convocatoria.file_lista_seleccionados)
    }
    
    if(convocatoria.file_soporte_resolucion!=null){
      formData.append('file_soporte_resolucion', convocatoria.file_soporte_resolucion);
    }
    if(convocatoria.descripcion){
      formData.append('descripcion', convocatoria.descripcion);
    }
    formData.append('etapasString', JSON.stringify(convocatoria.etapas));
    formData.append("id", ""+convocatoria.id);
    formData.append("estado", ""+convocatoria.estado);
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
  }

  getHistorialConvocatorias(){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/ListarHistorialConvocatorias`
    return this.httpClient.get(url,  {headers:this.headers}).map(data=>{
      return data;
    });
  }

  getDisciplinasPorConvocatoria(id:number){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GetDisciplinasPorConvocatoria/${id}`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  asignarDisciplinaAConvocatoria(disciplina:any){
  
    return this.httpClient.post(`${this.url}/ConvocatoriasDeportistasArtistas/AsignarDisciplinaAConvocatoria`,disciplina, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  getItemsConvocatoria(idConvocatoriaDisciplina){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GetItemsConvocatoria/${idConvocatoriaDisciplina}`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  guardarEtapa(etapa){
    return this.httpClient.post(`${this.url}/ConvocatoriasDeportistasArtistas/GuardarEtapa`, etapa, {headers:this.headers}).map(data=>{
      return data;
    });
  }

  eliminarDisciplinaConvocatoria(idDisciplinaConvocatoria : number){
    return this.httpClient.post(`${this.url}/ConvocatoriasDeportistasArtistas/EliminarDisciplinaConvocatoria`, {'id': idDisciplinaConvocatoria} , {headers:this.headers}).map(data=>{
      return data;
    });
  }

  guardarPlantillas(plantillas:any){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GuardarPlantillas`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    
    formData.append('hoja_de_vida', plantillas.hoja_de_vida);
    formData.append('carta', plantillas.carta);
 
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
  }

  getPlantillas(){
    let url = `${this.url}/ConvocatoriasDeportistasArtistas/GetPlantillas`
    return this.httpClient.get(url, {headers:this.headers}).map(data=>{
      return data;
    });
  }
}

