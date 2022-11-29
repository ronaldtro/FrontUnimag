import { Injectable } from '@angular/core';
import {HttpClient,  HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Http, Headers, QueryEncoder, URLSearchParams  } from '@angular/http';
import { Api } from '../class/api';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:Http, private httpClient:HttpClient) { }

  userAuthentication(userName, password) {
    let data = "username=" + userName + "&password=" + encodeURIComponent(password) + "&grant_type=password";
    
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/x-www-urlencoded');
    headers.append('No-Auth', 'True');
    return this.httpClient.post(`${Api.dev}/token`, data, {headers} ).map(resp => {
      return resp;
    });
  }

  getRoleTipos( user:any  ){
    let headers = new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('userToken')});
    return  this.httpClient.get(`${Api.dev}/Usuario/GetRoleTipos/${user}`,{headers: headers}).map(data=>{return data;});
  }

  getUserClaims(){
    let headers = new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('userToken')});
    return  this.httpClient.get(`${Api.dev}/Account/GetUserClaims`,{headers: headers});
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    let userRoles: string[] = [] ;
    if(localStorage.getItem('userRoles')!=null){
      userRoles=JSON.parse(localStorage.getItem('userRoles'));
    }
    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }

  tipoMatch(allowedRoles): boolean {
    let isMatch = false;

    let userTipos: string[] = [] ;
    if(localStorage.getItem('userTipos')!=null){
      userTipos=JSON.parse(localStorage.getItem('userTipos'));
    }
    allowedRoles.forEach(element => {
      if (userTipos.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }


  isLogin(){
    if (localStorage.getItem('userToken') != null && new Date().getTime() <= Number(localStorage.getItem('expires_in'))) {
      return true;
    }else{
      return false;
    }
  }

  changePassword(data:any){
 
   let  headers = new HttpHeaders({
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken'),
    });
  
    return this.httpClient.post(`${Api.dev}/Account/CambiarPassword`, data, { headers: headers }).map(resp => { return resp })
  }

  /**
   * Retorna el email y el username del usuario con sesión iniciada
   */
  getLoggedUser(){
    let headers = new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('userToken')});
    return  this.httpClient.get(`${Api.dev}/Dashboard/getStringLoggedUser/`,{headers: headers}).map(data=>{return data;});
  }

}

