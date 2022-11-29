import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';
import { HttpHeaders, HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ItemService {
  
  headers = new HttpHeaders({
    'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
  });

  constructor(private httpClient:HttpClient) { }

  getItems(){
    return this.httpClient.get(`${Api.dev}/Items/GetItems`,{headers:this.headers}).map(resp=>{return resp});
  }


  cambiarEstado(id:number){
    return this.httpClient.post(`${Api.dev}/Items/CambiarEstado`,{'id':id},{headers:this.headers}).map(resp=>{
      return resp;
    });
  }

  guardarItem(item){
    return this.httpClient.post(`${Api.dev}/Items/GuardarItem`,item,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  guardarItemDisciplina(itemDisciplina){
    return this.httpClient.post(`${Api.dev}/Items/GuardarItemDisciplina`,itemDisciplina,{headers:this.headers}).map(data=>{
      return data;
    });
  }

  existeItem(nombre:string){
    return this.httpClient.get(`${Api.dev}/Items/ExisteItem/${nombre}`,{headers:this.headers}).map(resp=>{return resp});
  }
      
  getItemsPorDisciplina(disciplinaId:number){
    return this.httpClient.get(`${Api.dev}/Items/GetItemsPorDisciplina/${disciplinaId}`,{headers:this.headers}).map(resp=>{return resp});
  }

  quitarItemDisciplina(itemDisciplinaId:number){
    return this.httpClient.post(`${Api.dev}/Items/QuitarItemDisciplina`,{'id':itemDisciplinaId},{headers:this.headers}).map(data=>{
      return data;
    });
  }

  asignarItemsAConvocatoria(items:any){
    return this.httpClient.post(`${Api.dev}/Items/AsignarItemsAConvocatoria`,items,{headers:this.headers}).map(data=>{
      return data;
    });
  }
  
}