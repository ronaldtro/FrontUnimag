import { Injectable } from '@angular/core';
import { Api } from '../class/api';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class InscripcionArtistasDeportistasService {
    url = Api.dev; 
    headers = new HttpHeaders({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    });
    constructor(private httpClient:HttpClient) { }

    getDatosInscripcion(id: number){
        return this.httpClient.get(`${Api.dev}/InscripcionDeportistasArtistas/GetDatosInscripcionDeportistas/${id}`, { headers: this.headers }).map(resp => { return resp });
    }

    enviarToken(recuperacionToken:any, idConvocatoria:number){
      let url = `${this.url}/InscripcionDeportistasArtistas/RecuperarTokenDeportistas/`;
      return this.httpClient.post( url, {'correo':recuperacionToken.correo,'idConvocatoria':idConvocatoria,'identificacion':recuperacionToken.identificacion} , {headers:this.headers} ).map(res=>{return res;})
    }

    getInscripcionesEstudiante(){
      return this.httpClient.get(`${Api.dev}/InscripcionDeportistasArtistas/GetInscripcionesEstudiante`, { headers: this.headers }).map(resp => { return resp });
    }
    
    guardarInscripcion(inscripcion : any){ 
        let url = `${this.url}/InscripcionDeportistasArtistas/GuardarInscripcionDeportistas/`;

        let formData = new FormData();
      
        formData.append('nombre', inscripcion.nombre);
        formData.append('direccion', inscripcion.direccion);
        formData.append('identificacion', inscripcion.identificacion);
        formData.append('sexo', inscripcion.sexo);
        formData.append('tipoIdentificacion', inscripcion.tipoIdentificacion);
        formData.append('idConvocatoriaDisciplina', inscripcion.idConvocatoriaDisciplina);
        formData.append('email',inscripcion.email);

        if(typeof inscripcion.fecha_nacimiento != "string"){
          formData.append('fecha_nacimiento', inscripcion.fecha_nacimiento.toDateString());
        }else{
          formData.append('fecha_nacimiento', inscripcion.fecha_nacimiento);
        }
        
        formData.append('file_certificado', inscripcion.file_certificado);
        formData.append('file_carta', inscripcion.file_carta);
        formData.append('file_hojaDeVida', inscripcion.file_hojaDeVida);
        
      
        return this.httpClient.post( url, formData , {headers:this.headers} )
            .map(res=>{
                return res;
        });
    }

    cancelarInscripcion(token:string){
  
      let url = `${this.url}/InscripcionDeportistasArtistas/CancelarInscripcion/`;
        return this.httpClient.post( url, {'token': token}  , {headers:this.headers} )
            .map(res=>{
                return res;
        });
    }

    getEstadoInscripcion(token:any){
      let url = `${this.url}/InscripcionDeportistasArtistas/GetEstadoInscripcion/${token}`
      return this.httpClient.get(url, {headers:this.headers}).map(data=>{
        return data;
      });
    }
  
    getEstudiantesSeleccionados(idDisciplinaConvocatoria : number){
      let url = `${this.url}/InscripcionDeportistasArtistas/GetSeleccionadosDisciplina/${idDisciplinaConvocatoria}`
      return this.httpClient.get(url, {headers:this.headers}).map(data=>{
        return data;
      });
    }

    getEstudiantesSeleccionadosConvocatoria(idConvocatoria : number){
      let url = `${this.url}/InscripcionDeportistasArtistas/GetSeleccionadosConvocatoria/${idConvocatoria}`
      return this.httpClient.get(url, {headers:this.headers}).map(data=>{
        return data;
      });
    }

    getDatosEditar(id:number, beneficioId:number) {
      let url = `${this.url}/InscripcionDeportistasArtistas/DatosInscripcionEditar/${id}/${beneficioId}`
      return this.httpClient.get(url, { headers: this.headers }).map(data => {
        return data;
      });
    }

    editarIncripcion(dato:any){ 
      let url = `${this.url}/InscripcionDeportistasArtistas/EditarInscripcionRefrigerio/`;
      return this.httpClient.post( url, dato , {headers:this.headers} )
          .map(res=>{
              return res;
      })
    }

    getDatosInscripcionGrupos(){
      return this.httpClient.get(`${this.url}/InscripcionDeportistasArtistas/GetDatosInscripcionGrupos`, { headers: this.headers }).map(resp => { return resp });
    }

    getRolesGrupo(id : number){
      return this.httpClient.get(`${this.url}/InscripcionDeportistasArtistas/GetRolesGrupo/${id}`, { headers: this.headers }).map(resp => { return resp });
    } 

    guardarInscripcionGrupo(inscripcion : any){
      let url = `${this.url}/InscripcionDeportistasArtistas/GuardarInscripcionGrupo`;
      return this.httpClient.post( url, inscripcion , {headers:this.headers} )
          .map(res=>{
              return res;
      });
    }

    buscarEstudiante(id : number){
      return this.httpClient.get(`${this.url}/InscripcionDeportistasArtistas/GetDatosEstudiante/${id}`, { headers: this.headers }).map(resp => { return resp });
    }
  
    getDisciplinasPorModalidad(idModalidad : number){
      return this.httpClient.get(`${Api.dev}/InscripcionDeportistasArtistas/GetDisciplinasPorModalidad/${idModalidad}`,{headers:this.headers}).map(resp=>{return resp});
    }
  
    getGruposPorDisciplina(idDisciplina:number){
      return this.httpClient.get(`${Api.dev}/InscripcionDeportistasArtistas/GetGruposPorDisciplina/${idDisciplina}`,{headers:this.headers}).map(resp=>{return resp});
    }

    getTiposIdentificacion(){
      return this.httpClient.get(`${Api.dev}/InscripcionDeportistasArtistas/GetTiposIdentificacion`,{headers:this.headers}).map(resp=>{return resp});
    }

}