import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Api } from 'src/app/class/api';

declare var jQuery:any;

@Component({
  selector: 'app-lista-inscripciones',
  templateUrl: './lista-inscripciones.component.html',
  styleUrls: ['./lista-inscripciones.component.css']
})
export class ListaInscripcionesComponent implements OnInit, OnDestroy {

  postulaciones : any = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);
  api:string = Api.dev;
  
  constructor(private _inscripcionArtistasDeportistasService:InscripcionArtistasDeportistasService,
    private spinner: NgxSpinnerService, private elementRef: ElementRef) { }
 
  /**
   * Al inicializar este componente, se cargan y se listan todas las inscripciones que
   * ha realizado cada estudiante.
   */
  ngOnInit() {

    this.spinner.show();

    this._inscripcionArtistasDeportistasService.getInscripcionesEstudiante().subscribe(data=>{
      this.postulaciones = data['inscripciones'];
      this.initDtOptions();
      this.dtTrigger.next();
      
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

  /**
   * Los estudiantes pueden cancelar la inscripción a cualquier convocatoria en 
   * la que se hayan inscrito por medio de este método.
   * 
   * @param {any} inscripcion  Objeto que contiene toda la información de 
   * la inscripción
   * 
   */
  cancelarInscripcion(inscripcion){

      swal({
        title: 'Cancelar inscripción',
        text: "¿Está seguro de realizar esta acción?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if(result.value){
          this._inscripcionArtistasDeportistasService.cancelarInscripcion(inscripcion.idInscripcion).subscribe(data=>{
            if(data['success']){
                this.postulaciones.filter(postulacion => {
                  if(postulacion.idInscripcion === inscripcion.idInscripcion){
                    postulacion.estadoPostulacion = data['nombreEstado'];
                  }
                });
                swal({
                  title: "Realizado",
                  text: "Ha cancelado la inscripción",
                  type: "success",
                  timer: 1500,
                  showConfirmButton: false
                });   
              }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }
  
  initDtOptions(){
    this.dtOptions.order = [[ 3, "desc" ]];
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}