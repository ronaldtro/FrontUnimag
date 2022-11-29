import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Api } from 'src/app/class/api';
import { DTConfig } from 'src/app/class/dtconfig';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';

declare var $;
declare var jQuery;

@Component({
  selector: 'app-estado-convocatoria-deportistas',
  templateUrl: './estado-convocatoria-deportistas.component.html',
  styleUrls: ['./estado-convocatoria-deportistas.component.css']
})
export class EstadoConvocatoriaDeportistasComponent implements OnInit {
  
  /**
   * Se guarda la información de los errores
   */
  errores:object[]=[];
  
  /**
   * Contiene los datos de la inscripción de un estudiante.
   * 
   */
  inscripcion : any = {};

  /**
   * Es el token para identificar qué inscripción se debe traer de la base de datos.
   */
  token : string;

  constructor(private _inscripcionService : InscripcionArtistasDeportistasService,
    private spinner: NgxSpinnerService, 
    private elementRef: ElementRef, 
    private route:ActivatedRoute ) { }

  /**
   * Obtiene el estado de inscripción de un estudiante.
   */  
  ngOnInit() {
    this.spinner.show();

    this.route.params.subscribe(params=>{

      if(params != null){
        this.token = params.token;
        this._inscripcionService.getEstadoInscripcion(params.token).subscribe(data => {
       
          if(data['success']){
            this.inscripcion = data['inscripcion'];

          }else{
            this.inscripcion = null;
            swal({
              type: 'error',
              title: 'Error',
              text: 'Enlace inválido'
            });
          }
            this.spinner.hide();
           

        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide();
        });
      }
    });
  }

  /**
   * Permite al estudiante cancelar su inscripción a una convocatoria.
   */
  cancelarInscripcion(){
    swal({
      title: 'Cancelar inscripción',
      text: "¿Está seguro de cancelar la inscripción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-danger m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this._inscripcionService.cancelarInscripcion(this.token).subscribe(data => {
          if(data['success']){
            this.inscripcion = data['inscripcion'];
            swal({
              title: "Realizado",
              text: "Acción realizada satisfactoriamente.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
            });
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'No puede cancelar la inscripción',
            });
          }
          this.spinner.hide();
        }, err =>{
          this.spinner.hide();
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
        });
      }
    });
  }
}