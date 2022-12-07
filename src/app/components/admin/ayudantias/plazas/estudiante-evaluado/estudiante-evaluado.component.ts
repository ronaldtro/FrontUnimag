import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { Evaluacion } from 'src/app/interfaces/evaluacion';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';

import { RespuestaServidor } from 'src/app/class/respuesta-servidor';


declare var $: any;
declare var Tutorial:any;

//servicios
import { EvaluarEstudianteService } from 'src/app/services/evaluar-estudiante.service';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';


@Component({
  selector: 'app-estudiante-evaluado',
  templateUrl: './estudiante-evaluado.component.html',
  styleUrls: ['./estudiante-evaluado.component.css'],
  providers:  [MessageService]
})
export class EstudianteEvaluadoComponent implements OnInit, OnDestroy {
  evaluacion:Evaluacion [] =[];
  copy : any;
  bandera = false;
  evaluado : number  ;
  convocatoria : number;
  errores:Message[]=[];
  evalEdit : any = {
    eval:[],
    solicitante:null,
    observacion:null,
    soporte:null,
    objeto:null,
    objeto_actualizado:null
  };

  // evalEdit:any ={
  //   idRequisito : null,
  //   idEstudiante : null,
  //   descripcion :  null,
  //   valor_maximo : null,
  //   porcentaje : null,
  //   fecha_eval : null,
  //   puntaje : null,
  // }
 
  estudiante:any={
    id:null,
    codigo:null,
    nombre:null
  };

  plaza:any={
    idConvocatoria: null,
    plaza: null,
    tipoPlaza: null,
    competencias_requeridas: null,
    perfil:null, 
    unidad:null
  };

  resultado: Evaluacion [] =[];
  userService: UserService;
  funciones:FuncionesJSService;
  tutorial:any = null;

  constructor(private _requisitos : EvaluarEstudianteService ,
     private messageService: MessageService , 
     private activatedroute : ActivatedRoute,
     private _userService :UserService, 
     private router:Router,
     private _location: Location, 
     private spinner: NgxSpinnerService,
     private f:FuncionesJSService  ) 
   { 
    this.userService = _userService;
    this.funciones = f;
    activatedroute.params.subscribe(parametros => {
      if(parametros['id'] !== undefined){
        this.evaluado = parametros['id'];
      }
    });
   }


   puntaje(){
    if(this.evalEdit.eval != null){
    let total = 0;
    this.evalEdit.eval.forEach(element => {
        total += ((element.puntaje != undefined ?element.puntaje : 0) * element.porcentaje ) / element.valor_maximo ;
      });
      return total;
    }
    return 0;
  }

  ngOnInit() {
    this.spinner.show();
    this._requisitos.getDatosEvaluado(this.evaluado).subscribe(data => {
     
      this.estudiante = data['datosEstudiante'];
      this.plaza = data ['datosPlaza'];
      this.resultado = data ['datosEvaluados'];
      this.evalEdit.eval = data ['datosEvaluados'];
      this.copy=  JSON.stringify(this.resultado);
      this.convocatoria = data ['datosPlaza'].idConvocatoria;
      this.spinner.hide();
      });
  }

  ngOnDestroy() {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  backClicked() {
    this._location.back();
  }

  openEdit(obj){
    
    // console.log(this.copy);
    if(obj == true){
      
      this.bandera = true;
      this.evalEdit.objeto = JSON.stringify(this.resultado) ;
    }else{
      this.evalEdit.eval =  JSON.parse(this.copy);
      this.bandera = false;
      this.evalEdit.solicitante = null;
      this.evalEdit.observacion = null;
      this.evalEdit.soporte = null;
    }

  
   
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.evalEdit.soporte=file;
    }
  }

  onClearFile(){
    this.evalEdit.soporte=null;
  }

  editarEvaluacion(forma : NgForm){
    
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    }
    if(!this.evalEdit.soporte){
      swal({
        type: "error",
        title: "Error",
        text: "Debe adjuntar el soporte.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    }
    
    swal({
      title: 'Editar información',
      text: "¿Está seguro de editar la información?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
    }).then((res) => {
      if (res.value) {
      this.spinner.show();
    this.evalEdit.objeto_actualizado = JSON.stringify(this.evalEdit.eval);
    if (this._userService.roleMatch(['Admin','AdminMonitorias'])) {
      let formData = new FormData();
      formData.append('idPlaza', ""+this.plaza.id)
      formData.append('solicitante',""+this.evalEdit.solicitante);
      formData.append('observacion',""+this.evalEdit.observacion);
      formData.append('objeto_actualizado',""+this.evalEdit.objeto_actualizado);
      formData.append('soporte', this.evalEdit.soporte);
      formData.append('resultadosNuevos', JSON.stringify(this.evalEdit.eval));
      this._requisitos.postEvalAdmin(formData).subscribe( resp => {
       
        if(resp['success']){
            this.evalEdit.eval = resp["datosEvaluados"];
            this.bandera = false;
            this.evalEdit.solicitante = null;
            this.evalEdit.observacion = null;
            this.evalEdit.soporte = null; 
            this.copy =  this.evalEdit.objeto_actualizado;
            swal({
              type: "success",
              title: "Realizado",
              text: "Acción realizada satisfactoriamente.",
              timer: 2000,
              showConfirmButton: false
            });
            
          }else{
            for(let i=0;i<resp['errores'].length;i++){
              if(resp['errores'][i]['errores'].length>0){
                for(let j=0; j<resp['errores'][i]['errores'].length; j++){
                  this.messageService.add({severity:'warn', summary: 'Ok', detail:resp['errores'][i]['errores'][j]['ErrorMessage']});
                }
              }
            }
          }
          this.spinner.hide();
        }, err=>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });
            this.spinner.hide();
        }) 
    }

    } else if (res.dismiss === swal.DismissReason.cancel) {
      // swal({
      //   type: "error",
      //   title: "Cancelado",
      //   text: "Se ha cancelado la acción.",
      //   timer: 2000,
      //   showConfirmButton: false
      // });
    }
  });
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de evaluación del estudiante</p><p class="container">El sistema permite visualizar y modificar el puntaje obtenido en la evaluación del estudiante. A continuación, podrá conocer los elementos que contiene este módulo y las diferentes acciones y funcionalidades a las cuales puede acceder.</p>'},
        elements:[
          {id: '#table_evaluacionEst', text: 'Esta tabla muestra todos los criterios de evaluación que tiene asginados la plaza con el respectivo puntaje que obtuvo el estudiante. Para modificar el valor del puntaje obtenido debe dirigirse a la columna "Puntaje obtenido" y cambiar el valor que aparece, tenga en cuenta que no podrá ingresar un valor mayor al valor máximo permitido por el criterio.'},
          {id: '#solicitante', text: 'El campo "Solicitante" permite ingresar el nombre del solicitante o la entidad solicitante del cambio en el puntaje de evaluación del estudiante, tenga en cuenta que solamente admite hasta un máximo de 255 caracteres. Este campo es obligatorio.'},
          {id: '#observacion', text: 'El campo "Observación" permite ingresar una observación o motivo por el cual se realiza el cambio en el puntaje de evaluación del estudiante, tenga en cuenta que solamente admite hasta un máximo de 455 caracteres. Este campo es obligatorio.'},
          {id: '#soporte', text: 'El campo "Soporte" permite adjuntar un documento de soporte para los cambios realizados en el puntaje de evaluación del estudiante, el cual deberá estar en formato PDF y con un peso menor o igual a 2MB. Este campo es obligatorio.'},
          {id: '#cancelar', text: 'El botón "Cancelar" permite regresar a la vista de evaluación del estudiante sin guardar los cambios.'},
          {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida.'},
        ]
      });
      this.tutorial.start();
  }
}
