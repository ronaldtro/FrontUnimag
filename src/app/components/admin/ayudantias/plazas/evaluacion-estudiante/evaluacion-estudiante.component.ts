import { Component, OnInit } from '@angular/core';
import { EvaluarEstudianteService } from 'src/app/services/evaluar-estudiante.service';
import { NgForm } from '@angular/forms';
import { Evaluacion } from 'src/app/interfaces/evaluacion';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import swal from 'sweetalert2';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {Location} from '@angular/common';

declare var $:any;

@Component({
  selector: 'app-evaluacion-estudiante',
  templateUrl: './evaluacion-estudiante.component.html',
  styleUrls: ['./evaluacion-estudiante.component.css'],
  providers: [MessageService]
})
export class EvaluacionEstudianteComponent implements OnInit {
  
  postulado : number  ;
  convocatoria : number;
  errores:Message[]=[];
 
  estudiante:any={
    id:null,
    codigo:null,
    nombre:null
  };


  plaza:any={
    idConvocatoria: null,
    plaza: "a",
    tipoPlaza: null,
    competencias_requeridas: null,
    perfil:null, 
    unidad:null
  };

  solicitud:any={
    id:null,
    criteriosEvaluacion:[] =[]
  } 


  evaluacion: Evaluacion [] =[];


  constructor(private _requisitos : EvaluarEstudianteService ,
     private messageService: MessageService , 
     private activatedroute : ActivatedRoute, 
     private _location: Location, 
     private router:Router,
     private spinner: NgxSpinnerService  ) 
   { 
    
   }

  ngOnInit() {
    this.spinner.show();
    this.activatedroute.params.subscribe(parametros => {
      if(parametros['id'] != undefined){
        this.postulado = parametros['id'];
        this._requisitos.getDatosEvaluacion(this.postulado).subscribe(data => {
          
          this.estudiante = data['datosEstudiante'];
          this.plaza = data['datosPlaza'];
          this.evaluacion = data['requisitos_evaluacion_plaza'];
          this.convocatoria = data['datosPlaza'].idConvocatoria;
          this.spinner.hide();
          });
      }
    });
    
  }


   puntaje(){
    if(this.evaluacion != null){
    let total = 0;
    this.evaluacion .forEach(element => {
        total += ((element.puntaje != undefined && element.puntaje  <= element.valor_maximo && element.puntaje >= 0 ?element.puntaje : 0) * element.porcentaje ) / element.valor_maximo ;
      });
      return total;
    }
    return 0;
  }

  guardar(forma: NgForm) {

    if (!forma.valid) {
      this.messageService.add({severity:'warn', summary: 'Alerta', detail: "Complete los campos del formulario" });
    } else {

      swal({
        title: 'Evaluar al estudiante',
        text: "¿Está seguro de realizar esta acción?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#green',
        // cancelButtonColor: '#d33',
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
      }).then((res) => {
        if (res.value) {
          this.solicitud.id = this.estudiante.id;
          this.solicitud.criteriosEvaluacion = this.evaluacion; 
          this.spinner.show();
          this._requisitos.postEvaluar(this.solicitud).subscribe(data =>{       
          if (data['success']) {
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha realizado la acción satisfactoriamente.",
              timer: 2000,
              showConfirmButton: false
              });
              this._location.back();
            }
            this.spinner.hide();
          });           
        }else if (res.dismiss === swal.DismissReason.cancel){
          // swal({
          //   type: "error",
          //   title: "Cancelado",
          //   text: "Se ha cancelado la acción.",
          //   timer: 2000,
          //   showConfirmButton: false
          //    });
          }
      });   
    }
  }

  goBack():void{
    this._location.back();
  }

}
