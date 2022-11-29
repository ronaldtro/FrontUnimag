import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DisciplinasService {
  
  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getDisciplinas(){
    return this.httpClient.get(`${Api.dev}/Disciplinas/GetDisciplinas`,{headers:this.headers}).map(resp=>{return resp});
  }

  getDisciplina(id : number){
    return this.httpClient.get(`${Api.dev}/Disciplinas/GetDisciplina/${id}`,{headers:this.headers}).map(resp=>{return resp});
  }

  getDisciplinasPorModalidad(idModalidad : number){
    return this.httpClient.get(`${Api.dev}/Disciplinas/GetDisciplinasPorModalidad/1`,{headers:this.headers}).map(resp=>{return resp});

  }

  getModalidades(){
      return this.httpClient.get(`${Api.dev}/Disciplinas/GetModalidades`,{headers:this.headers}).map(resp=>{return resp});
  }

  getTiposIdentificacion(){
    return this.httpClient.get(`${Api.dev}/Disciplinas/GetTiposIdentificacion`,{headers:this.headers}).map(resp=>{return resp});
  }

  cambiarEstado(id:number){
   
    return this.httpClient.post(`${Api.dev}/Disciplinas/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarDisciplina(disciplina:any){
    
    let url = `${Api.dev}/Disciplinas/GuardarDisciplina`
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('userToken')});
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let formData = new FormData();
    
    if(disciplina.id != null){
      formData.append('id', disciplina.id);
    }
    
    formData.append('imagenDisciplina', disciplina.file_imagen);
    formData.append('nombre', disciplina.nombre);
    formData.append('modalidad_id', disciplina.modalidad_id);
    formData.append('descripcion', disciplina.descripcion);

    if(disciplina.encargado != undefined){
      if(disciplina.encargado.fecha_nacimiento != undefined){
      
        if((typeof disciplina.encargado.fecha_nacimiento) != 'string'){
          disciplina.encargado.fecha_nacimiento = disciplina.encargado.fecha_nacimiento.toDateString()
        }else{
          delete disciplina.encargado.fecha_nacimiento;
        }
      }
    }

    formData.append('encargadoString',JSON.stringify(disciplina.encargado));

    let index = 0;
    for(let imagen of disciplina.galeriaImagenes){
        formData.append("galeria[" + index + "]", imagen);
        index++;
    }
    if(disciplina.listaImagenesEliminar != undefined){
      index = 0;

      for(let imagen of disciplina.listaImagenesEliminar){
          formData.append("listaImagenesEliminar[" + index + "]", imagen);
          index++;
      }
    }
    return this.httpClient.post(url, formData, {headers:headers}).map(data=>{
      return data;
    });
  }
  
  buscarEncargado(identificacion:string){
    return this.httpClient.get(`${Api.dev}/Disciplinas/GetEncargado/${identificacion}`,{headers:this.headers}).map(data=>{
      return data
    });
  }

  // agregarEncargado(disciplina){
  //   return this.httpClient.post(`${Api.dev}/Disciplinas/AsignarEncargadoDisciplina`,disciplina,{headers:this.headers}).map(data=>{
  //     return data;
  //   });
  // }

}