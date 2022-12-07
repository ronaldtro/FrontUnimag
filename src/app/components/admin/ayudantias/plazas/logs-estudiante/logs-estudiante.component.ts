import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';

import { Estudiante } from 'src/app/interfaces/estudiantes.interface';
import { Observacion } from 'src/app/interfaces/observacion.interface';
import { Location } from '@angular/common';

declare var $: any;

//Servicios
import { UserService } from 'src/app/services/user.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';



@Component({
  selector: 'app-logs-estudiante',
  templateUrl: './logs-estudiante.component.html',
  styleUrls: ['./logs-estudiante.component.css'],
  providers: [MessageService]

})
export class LogsEstudianteComponent implements OnInit {
  id:number;
  convocatoria:string;
  nombre:string;
  tipo:any;
  estudiante:Estudiante={
    codigo:null,
    nombre:null
  };
  observaciones:Observacion[]=[];
  observacion:Observacion = {
    fecha:null,
    id:null,
    observacion:null,
    user_create:null

  };
  id_plaza:number

  userService: UserService;
  constructor(private _estudianteService:EstudiantesService,
              private spinner: NgxSpinnerService,
              private route:ActivatedRoute,
              private _userService :UserService,
              private messageService: MessageService, private _location: Location) { 
                this.userService = _userService;

              }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._estudianteService.getObservaciones(this.id).subscribe(data=>{
        if(data['success']){
          this.nombre = data['data']['Nombre'];
          this.convocatoria = data['data']['convocatoria'];
          this.estudiante = data['data']['estudiante'];
          this.tipo = data['data']['tipo'];
          this.observaciones = data['data']['observaciones'];
          this.id_plaza = data['data']['id_plaza'];
        }else{
          if(data['error']){
            swal({
              type: 'error',
              title: 'Error',
              text: data['error']
            });
          }
          if(data['errores']){
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                swal({
                  type: 'warning',
                  title: 'Error',
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                });
              }
            }
          }
        }
        this.spinner.hide()
        
      },err=>{
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        }); 
      })
    })

  }

  backClicked() {
    this._location.back();
  }

  verObservacion(idx:number){
    this.observacion = this.observaciones[idx];
    $('#modalInfo').modal('show');

  }

}
