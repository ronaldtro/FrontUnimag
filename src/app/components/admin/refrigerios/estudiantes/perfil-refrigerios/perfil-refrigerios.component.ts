import { Component, OnInit } from '@angular/core';
import { Estudiante } from 'src/app/interfaces/estudiantes.interface';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgForm } from '@angular/forms';
import { EstudianteRefrigerios } from 'src/app/interfaces/estudiante-refrigerio.interfase';
import { InscripcionRService } from 'src/app/services/inscripcion-refrigerio.service';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
import { Router } from '@angular/router';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
declare var $:any;

@Component({
  selector: 'app-perfil-refrigerios',
  templateUrl: './perfil-refrigerios.component.html',
  styleUrls: ['./perfil-refrigerios.component.css'],
  providers: [MessageService]
})
export class PerfilRefrigeriosComponent implements OnInit {

  estudiante:Estudiante = {
    beneficios:[]
  };
  auxInscritoDia:any = {};
  file_soporte?:File;
  errores:any[] = [];
  convocatoriasRefrigerio:any[] = [];
  convocatoria:any = {
    ayudantia : null,
    refrigerio : null,
  }

  constructor( private _inscripcionService:InscripcionRService, 
    private _estudianteService: EstudiantesService,
    private spinner: NgxSpinnerService, 
    private messageService: MessageService,
    private convocatoriaRefrigerios : ConvocatoriaRefrigerioService, private router:Router) { }

  ngOnInit() {
    this.spinner.show();

    this._inscripcionService.getInfoEstudiante().subscribe(data=>{   
      this.estudiante=data['datosEstudiante'];
      this.estudiante.beneficios = data['beneficios'];
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
    this.convocatoriaRefrigerios.getConvocatoriasInscripcion().subscribe((data:any)=>{
      this.convocatoriasRefrigerio = data;
      this.spinner.hide();
    });
  }

  estadosInscripcion(beneficio){
    this.auxInscritoDia.codigo = this.estudiante.codigo;
    this.auxInscritoDia.convocatoria_id = beneficio.idConvocatoria;
    this.auxInscritoDia.beneficio = beneficio.idBeneficio;
    this.errores = [];
    this.spinner.show();
    this._inscripcionService.consultarDias(this.auxInscritoDia).subscribe(data => {
      if(data['success']){
        this.auxInscritoDia.dias = data['dias'];
        for (let index = 0; index < this.auxInscritoDia.dias.length; index++) {
          this.auxInscritoDia.dias[index].nuevoEstado = null;
        }
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }    
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
    $('#estadoDiaModal').modal('show');
  }

  cancelarInscripcion(beneficio){
    this.auxInscritoDia.codigo = this.estudiante.codigo;
    this.auxInscritoDia.convocatoria_id = beneficio.idConvocatoria;
    this.auxInscritoDia.beneficio = beneficio.idBeneficio;
    this.errores = [];
    if(beneficio.estadoPostulacionId == 2 || beneficio.estadoPostulacionId == 3){
      $('#cancelarSeleccion').modal('show');
    }else{
      if (beneficio.estadoPostulacionId == 1) {      
        swal({
          title: 'Cancelar inscripción',
          text: "¿Está seguro de cancelar la inscripción?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'green',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            this.spinner.show()
            this._inscripcionService.cancelarInscripcion(this.auxInscritoDia).subscribe(data => {
              if(data['success']){
                for (let i = 0; i < this.estudiante.beneficios.length; i++) {
                  if (this.estudiante.beneficios[i].idBeneficio == this.auxInscritoDia.beneficio  && this.estudiante.beneficios[i].idConvocatoria == this.auxInscritoDia.convocatoria_id) {
                    this.estudiante.beneficios.splice(i,1);
                    break;
                  }
                }              
                swal({
                  title: 'Acción realizada',
                  text: 'Acción realizada satisfactoriamente.',
                  type: 'success',
                  timer: 2000,
                  showConfirmButton: false
                });
              }else{
                swal({
                  type: 'error',
                  title: 'Error',
                  text: 'El usuario no se encuentra registrado en la base de datos',
                });
              }
              this.spinner.hide();
            });
          }
        })
      }
    }
  }

  cancelar(forma:NgForm, soporte){
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

    if(!this.file_soporte){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    }

    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cancelar la inscripción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1'
    }).then((res) => {
      if (res.value) {

        this.spinner.show();
        let formData = new FormData();
        formData.append('codigo', ""+this.auxInscritoDia.codigo)
        formData.append('convocatoria_id',""+this.auxInscritoDia.convocatoria_id);
        formData.append('beneficio',""+this.auxInscritoDia.beneficio);
        formData.append('soporte', this.file_soporte);
        formData.append('observacion', this.auxInscritoDia.observacion);
       
        this._inscripcionService.cancelarSeleccion(formData).subscribe(data => {
          for (let i = 0; i < this.estudiante.beneficios.length; i++) {
            if (this.estudiante.beneficios[i].idBeneficio == this.auxInscritoDia.beneficio  && this.estudiante.beneficios[i].idConvocatoria == this.auxInscritoDia.convocatoria_id) {
              this.estudiante.beneficios[i].estadoPostulacionId = data['estadoNuevo']['id'];
              this.estudiante.beneficios[i].estadoPostulacion = data['estadoNuevo']['nombre'];
            }
          }
          soporte.clear(); 
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha cambiado el estado satisfactoriamente.",
            timer: 2000,
            showConfirmButton: false
          });
          this.file_soporte = null;
          forma.resetForm();
          $('#cancelarSeleccion').modal('hide');
           this.spinner.hide();
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
      }
    });
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.file_soporte=file;
    }
  }

  onClearFile(soporte:any = undefined){
    this.file_soporte=null;
    if(soporte) soporte.clear();
  }

  enviarFormularioRefrigerio(){
    $('#modalConvocatoriaRefrigerios').modal('hide');
    this.router.navigate(['/inscripcion',this.convocatoria.refrigerio.id]);
  }

}
