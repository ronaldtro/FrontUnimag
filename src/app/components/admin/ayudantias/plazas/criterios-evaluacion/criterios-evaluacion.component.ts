import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plazas } from 'src/app/interfaces/Plazas.interface';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { NgForm } from '@angular/forms';
import { requisitosEvaluacion } from 'src/app/interfaces/requisitos.interface';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
import { Message } from 'primeng/components/common/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import {FileUpload } from 'primeng/primeng';

//Servicios
import { PlazaService } from 'src/app/services/plaza.service';
import { UserService } from 'src/app/services/user.service';

declare var $:any;
declare var Tutorial:any;

@Component({
  selector: 'app-criterios-evaluacion',
  templateUrl: './criterios-evaluacion.component.html',
  styleUrls: ['./criterios-evaluacion.component.css'],
  providers: [MessageService]

})
export class CriteriosEvaluacionComponent implements OnInit, OnDestroy {

  errores:Message[]=[];
  requisitosEvaluacion:requisitosEvaluacion={
    porcentaje:null,
    valor_maximo:null,
    descripcion:null
  }
  id:number;
  index:number = 0;
  tiposAyudantias:Objeto[]=[];
  tiposPlazas:Objeto[]=[];
  tiposRequisitos:Objeto[]=[];
  tipoConvocatoria:number = null;
  vlrCriterios:number=100;
  posEdit:number=null;
  hecho:boolean=false;
  plaza:Plazas = new Plazas();
  registroObservacion :any={
    solicitante:null,
    observacion:null,
    soporte:null
  };

  userService:UserService;
  tutorial:any = null;

  constructor(private _plazaService:PlazaService, 
              private route:ActivatedRoute,
              private messageService: MessageService,
              private cdRef:ChangeDetectorRef,
              private router: Router,
              private spinner: NgxSpinnerService,
              private _userService:UserService) {
              this.userService = _userService;
               }
  
  ngAfterViewChecked() {this.cdRef.detectChanges();}

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id=params.id;
      this.plaza.id=params.id;
      this._plazaService.getCriterios(this.id).subscribe(data=>{
        this.tiposAyudantias=data['tiposAyudantias'];
        this.tiposPlazas=data['tiposPlazas'];
        this.plaza=data['plazaSolicitada'];
        this.tipoConvocatoria = data['plazaSolicitada']['tipo_convocatoria_id'];
        this.tiposRequisitos=data['tiposRequisitos'];
        for(let i=0; i<this.plaza.requisitosEvaluacion.length; i++){
          this.vlrCriterios-=this.plaza.requisitosEvaluacion[i].porcentaje;
        }
        this.spinner.hide();
      }, err => {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide();
      })
    })
  }

  ngOnDestroy() {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  saveRequisitos(form:NgForm, isEdit:boolean = null, idx:number = null ){
    if(!form.valid){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Complete todos los campos del formulario'});
      return;
    }

    let newRequisito:requisitosEvaluacion={};

    newRequisito.descripcion = this.requisitosEvaluacion.descripcion;
    newRequisito.valor_maximo = this.requisitosEvaluacion.valor_maximo;
    newRequisito.porcentaje = this.requisitosEvaluacion.porcentaje;

    this.plaza.requisitosEvaluacion.push(newRequisito);
    this.vlrCriterios-=newRequisito.porcentaje;
    $('#exampleModalCenter').modal('hide')

    form.resetForm();
    
  }

  clearModal(form:NgForm){
    $('#exampleModalCenter').modal('hide')
    form.resetForm();
  }

  deleteRequisito(idx:number){
    // const swalWithBootstrapButtons = swal.mixin({
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   buttonsStyling: false,
    // })
    swal(
      'Realizado',
      'Acción realizada satisfactoriamente.',
      'success'
    )
    this.vlrCriterios+=this.plaza.requisitosEvaluacion[idx].porcentaje;
    this.plaza.requisitosEvaluacion.splice(idx,1);
    // swal({
    //   title: 'Eliminar requisito de esta plaza',
    //   text: "¿Está seguro de realizar esta acción?",
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Aceptar',
    //   cancelButtonText: 'Cancelar',
    //   confirmButtonClass: 'btn btn-danger m-1',
    //   cancelButtonClass: 'btn m-1',
    //   confirmButtonColor: 'green',
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.value) {
    //     swal(
    //       'Estado modificado',
    //       'Acción realizada satisfactoriamente.',
    //       'success'
    //     )
    //     this.vlrCriterios+=this.plaza.requisitosEvaluacion[idx].porcentaje;
    //     this.plaza.requisitosEvaluacion.splice(idx,1);
    //   }
    // })
  }

  editRequisito(idx:number){
    //this.requisitosEvaluacion=this.plaza.requisitosEvaluacion[idx];
    this.requisitosEvaluacion.porcentaje=this.plaza.requisitosEvaluacion[idx].porcentaje;
    this.requisitosEvaluacion.descripcion=this.plaza.requisitosEvaluacion[idx].descripcion;
    this.requisitosEvaluacion.valor_maximo=this.plaza.requisitosEvaluacion[idx].valor_maximo;
    this.posEdit=idx;
    this.vlrCriterios+=this.plaza.requisitosEvaluacion[idx].porcentaje;
    $('#exampleModalCenter2').modal('show')
    
  }

  editarRequisitos(form:NgForm){
    if(!form.valid){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Complete todos los campos del formulario'});
      return;
    }
    this.plaza.requisitosEvaluacion[this.posEdit].porcentaje=this.requisitosEvaluacion.porcentaje;
    this.plaza.requisitosEvaluacion[this.posEdit].descripcion=this.requisitosEvaluacion.descripcion;
    this.plaza.requisitosEvaluacion[this.posEdit].valor_maximo=this.requisitosEvaluacion.valor_maximo;
    this.vlrCriterios-=this.requisitosEvaluacion.porcentaje;
    $('#exampleModalCenter2').modal('hide');
    form.resetForm();

  }

  clearModalEdit(form:NgForm){
    $('#exampleModalCenter2').modal('hide');
    this.vlrCriterios-=this.plaza.requisitosEvaluacion[this.posEdit].porcentaje;
    form.resetForm();
  }

  save(){
    if(this.plaza.requisitosEvaluacion.length==0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'No se han definido criterios de evaluación, debe añadir uno al menos'});
      return;
    }

    if(this.vlrCriterios!=0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'La sumatoria del porcentaje de los criterios debe ser 100%'});
      return;
    }
    this.spinner.show();

    this._plazaService.postCriterios(this.plaza).subscribe( resp => {
      if(resp['success']){
        this.messageService.add({severity:'success', summary: 'Ok', detail:'Se ha guardado correctamente la información de esta plaza. Espere un momento'});
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/plazas/plazasRespondidas/'+this.tipoConvocatoria]);
        }, 1500);      
      }else{
        for(let i=0;i<resp['errores'].length;i++){
          if(resp['errores'][i]['errores'].length>0){
            for(let j=0; j<resp['errores'][i]['errores'].length; j++){
              this.messageService.add({severity:'warn', summary: 'Ok', detail:resp['errores'][i]['errores'][j]['ErrorMessage']});
            }
          }
        }
        this.spinner.hide();
      }
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

  onUploadFile(event){
    for(let file of event.files) {
      this.registroObservacion.soporte=file;
    }
  }

  onClearFile(){
    this.registroObservacion.soporte=null;
  }

  guardarObservacion(forma: NgForm, soporte) {

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
    
        if(!this.registroObservacion.soporte){
          swal({
            type: "error",
            title: "Error",
            text: "Debe adjuntar el soporte.",
            timer: 2000,
            showConfirmButton: false
          });
          return
        }
        
        if(this.plaza.requisitosEvaluacion.length==0){
          this.messageService.add({severity:'warn', summary: 'Alerta', detail:'No se han definido criterios de evaluación, debe añadir uno al menos'});
          return;
        }
      
        if(this.vlrCriterios!=0){
          this.messageService.add({severity:'warn', summary: 'Alerta', detail:'La sumatoria del porcentaje de los criterios debe ser 100%'});
          return;
        }
        this.spinner.show();
    
        let formData = new FormData();
        formData.append('idPlaza', ""+this.plaza.id)
        formData.append('solicitante',""+this.registroObservacion.solicitante);
        formData.append('observacion',""+this.registroObservacion.observacion);
        formData.append('soporte', this.registroObservacion.soporte);
        formData.append('requisitosNuevos', JSON.stringify(this.plaza.requisitosEvaluacion));
          this._plazaService.postCriteriosAdmin(formData).subscribe( resp => {
            if(resp['success']){
              this.registroObservacion.soporte=null;
              this.messageService.add({severity:'success', summary: 'Ok', detail:'Se ha guardado correctamente la información de esta plaza. Espere un momento'});        
              forma.resetForm();
              soporte.clear();       
              this.spinner.hide();
            }else{
              for(let i=0;i<resp['errores'].length;i++){
                if(resp['errores'][i]['errores'].length>0){
                  for(let j=0; j<resp['errores'][i]['errores'].length; j++){
                    this.messageService.add({severity:'warn', summary: 'Error', detail:resp['errores'][i]['errores'][j]['ErrorMessage']});
                  }
                }
              }
              this.spinner.hide();
            }
          }, err=>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
              swal({
                type: 'error',
                title: 'Error',
                text: respuesta.msg,
              });
              this.spinner.hide();
          })

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
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de criterios de evaluación</p><p class="container">El sistema permite asignar o modificar criterios de evaluación de la plaza seleccionada. A continuación, podrá conocer los elementos que contiene este módulo y las diferentes acciones y funcionalidades a las cuales puede acceder.</p>'},
        elements:[
          {id:'#btn-addCriterio',text:'El botón "<span class="fas fa-plus"></span> Agregar criterio de evaluación" permite agregar un nuevo criterio de evaluación a la plaza, este botón despliega un formulario en el cual se encuentran los campos necesarios para registrar el criterio.'},
          {id: '#table_criterios', text: 'Esta tabla muestra todos los criterios de evaluación que tiene asginados la plaza. Desde la columna "Acciones" puede acceder a las diferentes opciones para cada registro de la tabla tales como editar y eliminar el registro. Es pertinente que al menos exista un criterio de evaluación al momento de guardar la información.'},
          {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la información ingresada del criterio de evaluación.', count: 1},
          {id: '.btn-eliminar', text: 'El botón "<span class="fas fa-times"></span>" permite eliminar el registro de la información ingresada del criterio de evaluación.', count: 1},
          {id: '#solicitante', text: 'El campo "Solicitante" permite ingresar el nombre del solicitante o la entidad solicitante del cambio en los criterios de evaluación de la plaza, tenga en cuenta que solamente admite hasta un máximo de 255 caracteres. Este campo es obligatorio.'},
          {id: '#observacion', text: 'El campo "Observación" permite ingresar una observación o motivo por el cual se realiza el cambio en los criterios de evaluación de la plaza, tenga en cuenta que solamente admite hasta un máximo de 455 caracteres. Este campo es obligatorio.'},
          {id: '#soporte', text: 'El campo "Soporte" permite adjuntar un documento de soporte para los cambios realizados en los criterios de evaluación de la plaza, el cual deberá estar en formato PDF y con un peso menor o igual a 2MB. Este campo es obligatorio.'},
          {id: '#volver', text: 'El botón "Volver al listado" permite regresar a la lista de plazas revisadas por Bienestar.'},
          {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida, después de un breve periodo de tiempo será redirigido a la lista de plazas revisadas por Bienestar.'},
        ]
      });
      this.tutorial.start();
  }
}
