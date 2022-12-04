import { Component, OnInit } from '@angular/core';
import { Estudiante } from 'src/app/interfaces/estudiantes.interface';
import { EstudiantePlazas } from 'src/app/interfaces/convocatorias_estudiante.interface';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgForm } from '@angular/forms';
import { TiposConvocatorias, TipoConvocatoria } from 'src/app/class/api';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../../../class/api';
declare var $:any;

//Servicios
import { EstudiantesService } from 'src/app/services/estudiantes.service';


@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.css'],
  providers: [MessageService]
})

export class PerfilEstudianteComponent implements OnInit {
  estudiante:Estudiante;
  plazas:EstudiantePlazas[]=[];
  datos:any;
  evaluado:any={};
  api:string = Api.dev;

  tipoConvocatoria:number;

  tiposConvocatorias = TiposConvocatorias;

  registroObservacion :any={
    idPlaza:null,
    observacion:null,
    soporte:null
  };

  info_entrevista:InfoEntrevista;

  constructor( private _estudianteService: EstudiantesService, 
               private spinner: NgxSpinnerService, 
               private messageService: MessageService,
               private route:ActivatedRoute) {

                this.info_entrevista = new InfoEntrevista();
                }

  ngOnInit() {

    this.route.params.subscribe(parametros => {
      this.tipoConvocatoria = parametros['tipo-convocatoria']; 
    });
    this.spinner.show();

    this._estudianteService.getInfoEstudiante(this.tipoConvocatoria).subscribe(data=>{
      
      this._estudianteService.getListaPlazaEstudiante(this.tipoConvocatoria).subscribe((data:any) => {
        this.plazas=data['listaPlazas'];
      })
      
      this.estudiante=data['datosEstudiante'];
      this._estudianteService.getFotoEstudiante(this.estudiante.codigo + "").subscribe((data:string) => {
        this.estudiante.foto = data;
      });
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });    
    })
  }

  cancelarPostulacion(idPlaza:number, index:number){
    // const swalWithBootstrapButtons = swal.mixin({
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   buttonsStyling: false,
    // })

    swal({
      title: 'Cancelar postulación a plaza',
      text: "¿Está seguro de realizar esta acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-danger m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        
        this._estudianteService.cancelarPlaza(idPlaza).subscribe(data => {
          this.plazas[index].estadoPostulacionId=2;
          this.plazas[index].estadoPostulacion='Cancelado';
          this.spinner.hide();
          if(data['success']){
            this.messageService.add({severity:'success', summary: 'Ok', detail:'Se ha cancelado correctamente la postulación'});
            swal(
              'Cancelación Exitosa',
              'Se ha cancelado correctamente la postulación',
              'success'
            )
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'No se pudo efectuar la operación. Intente más tarde',
            });
          }
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          this.spinner.hide();  
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });    
        });
      }
    })
  }

  datosEvaluacion(idPlaza:number){
    this.spinner.show();
    this._estudianteService.getEvaluacion(idPlaza).subscribe(data=>{
      this.spinner.hide();
      if(data['success']){
        this.evaluado=data['plaza'];
        $('#exampleModal').modal('show');
      }else{
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde',
        });
      }
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });  
    });
  }

  openModalObservacion( idPlaza: number){

    swal({
      title: 'Retirarse de la plaza',
      text: "¿Está seguro de realizar esta acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-danger m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.registroObservacion.idPlaza = idPlaza;
        $('#observacionM').modal('show');
      }
    })
  }

  closeFormObserbacion(form:NgForm,soporte){
    $('#observacionM').modal('hide');
    form.resetForm();
    soporte.clear();
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.registroObservacion.soporte=file;
    }
  }

  onClearFile(){
    this.registroObservacion.soporte=null;
  }

  enviarObservacion(form:NgForm){

    swal({
      title: 'Retirarse de la plaza',
      text: "¿Está seguro de realizar esta acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-danger m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if(!form.valid){
          swal(
            'Error',
            'Revise el formulario y vuelva a intentarlo',
            'success'
          )
          return;
        }
        this.spinner.show();

        let formData = new FormData();
        formData.append('idPlaza', ""+this.registroObservacion.idPlaza)
        formData.append('observacion',""+this.registroObservacion.observacion);
        formData.append('soporte', this.registroObservacion.soporte);
        
        this._estudianteService.retirarPlaza(formData).subscribe(data => {          
          if(data['success']){
            for (let i = 0; i < this.plazas.length; i++) {
              if (this.plazas[i].idPlaza == this.registroObservacion.idPlaza) {
                this.plazas[i].estadoPostulacionId=8;
                this.plazas[i].estadoPostulacion='Retirado';
                break;
              }              
            }                
            swal(
              'Acción Exitosa',
              'Se ha realizado exitosamente la acción',
              'success'
            );
            $('#observacionM').modal('hide');
            form.resetForm();
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'No se pudo efectuar la operación. Intente más tarde',
            });
          }
          this.spinner.hide();
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          this.spinner.hide();  
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });    
        });
      }
    })
  }
/**
 * Muestra la información de la entrevista asignada a un estudiante en un modal
 * @param info_entrevista informacion de la entrevista a mostrar
 */
  verInformacionEntrevista(info_entrevista:InfoEntrevista):void{
    this.info_entrevista = info_entrevista;
    $("#infoEntrevistaModal").modal("show");
  }

  /**
   * Permite determinar si una plaza se encuentra en una etapa indicada por un id
   * @param etapas etapas de la plaza
   * @param etapa_id etapa a verificar
   */
  isEtapa(etapas:any[], etapa_id:number):boolean{
    return etapas.filter(e => e.id == etapa_id).length > 0;
  }

}

class InfoEntrevista{
  id:number;
  hora:string;
  lugar:string;
  observacion:string;

}
