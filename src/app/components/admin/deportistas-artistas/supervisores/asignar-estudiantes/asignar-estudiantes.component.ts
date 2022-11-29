import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import {Location} from '@angular/common';
import { ClasesArtistasDeportistasService } from 'src/app/services/clases-artistas-deportistas.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { NgForm } from '@angular/forms';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-asignar-estudiantes',
  templateUrl: './asignar-estudiantes.component.html',
  styleUrls: ['./asignar-estudiantes.component.css']
})

export class AsignarEstudiantesDeportistasComponent implements OnInit, OnDestroy, AfterViewChecked {

  listaEstudiantesClase : any[] = [];

  idClase : number;

  estudiante : any = {};
  errores:object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private _clasesService: ClasesArtistasDeportistasService,
    private spinner: NgxSpinnerService, private elementRef: ElementRef, private route:ActivatedRoute,
     private _location: Location, private funciones: FuncionesJSService) {}

  ngOnInit() {
    this.spinner.show();

    this.route.params.subscribe(params=>{
     this.idClase = params.id;
      
       this._clasesService.getEstudiantesClase(this.idClase).subscribe(data => {
         
         this.listaEstudiantesClase = data['estudiantesClase'];
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
     });
  }

  asignarEstudianteAClase(formulario : NgForm){
    if(!formulario.valid){
      return
    }

    this.estudiante.idClase = this.idClase;
    
    this._clasesService.asignarEstudianteAClase(this.estudiante)
    .subscribe(data => {
 
      if(data["success"]){

        if(this.estudiante.id == null){
          
          this.listaEstudiantesClase.push(data['estudiante']);
        
        }else{
          for (let index = 0; index < this.listaEstudiantesClase.length; index++) {
            if (this.listaEstudiantesClase[index].id == this.estudiante.id) {
              this.listaEstudiantesClase[index] = data['estudiante'];
            }
          }
        }
        this.rerender();
        formulario.resetForm();

        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 2000,
          showConfirmButton: false
      });

      setTimeout(() => {
        $('#insertarEstudianteModal').modal('hide');
     
      }, 2000);

      }else{
        swal({
          type: 'error',
          title: 'Error',
          text: 'Número de identificación incorrecto'
        });
      }
    });

  }

   /**
   * Elimina a un estudiante de una clase
   * 
   * @param estudianteClase Contiene los datos de un estudiante asignado a una clase
   * 
   * @param index Es la posición del estudiante que el administrador seleccionó en la tabla
   */
  quitarEstudianteClase(estudianteClase, index){
   
    swal({
      title: 'Quitar estudiante',
      text: "¿Está seguro de quitar el estudiante?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        
        this._clasesService.eliminarEstudianteClase(estudianteClase.numeroIdentificacion).subscribe(data => {
             
             this.listaEstudiantesClase.splice(index, 1);
             this.rerender();
             this.spinner.hide();
        });
       
      }
    });
  }

  abrirModalInsertarEstudiante(){
    this.estudiante = {}
    $('#insertarEstudianteModal').modal('show');
  }

  abrirModalEditarEstudiante(clase:any){
    this.errores = [];
    
    let copy = Object.assign({}, clase);
    this.estudiante = copy;
    
    $('#insertarEstudianteModal').modal('show');
  }

  goBack():void{
    this._location.back();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 1, "asc" ],[ 0, "asc" ]];

    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1]
        }
      }
    ];

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
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

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }
}