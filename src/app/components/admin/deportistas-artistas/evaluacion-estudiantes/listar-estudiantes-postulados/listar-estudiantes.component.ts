import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { EvaluarEstudiantesDeportistasService } from 'src/app/services/evaluar-estudiantes-deportistas.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-estudiantes',
  templateUrl: './listar-estudiantes.component.html',
  styleUrls: ['./listar-estudiantes.component.css']
})

export class ListarEstudiantesDeportistasComponent implements OnInit {
  
  /**
   * Se guarda el id de la convocatoria para listar los estudiantes que se inscribieron
   * en la misma
   */
  idConvocatoria : number;

  /**
   * Se guardan los estudiantes que se han postulado a una convocatoria
   */
  listaEstudiantePostulados : any[] = [];

  /**
   * Contiene los datos de un estudiante de la lista de los que se han postulado. 
   */
  datosEstudiantePostulado : any = {};

  /**
   * Contiene ruta del soporte que se va a ver en el modal. 
   */
  rutaSoporte : string;

  appliedFilters:any[] = [];

  funciones:FuncionesJSService;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  api:string = Api.dev;
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  
  constructor(private funcionesP:FuncionesJSService,
              private _evaluarEstudiante : EvaluarEstudiantesDeportistasService,
              private _inscripcionService : InscripcionArtistasDeportistasService,
              private route : ActivatedRoute,  private spinner: NgxSpinnerService, 
              private elementRef: ElementRef) { 
                this.funciones = funcionesP;
              }
  
   /**
   * Se cargan y listan los estudiantes de una determinada convocatoria
   */
  ngOnInit() {
    
    this.spinner.show();
    this.route.params.subscribe(params => {
    this.idConvocatoria = params.id;

    this._evaluarEstudiante.getEstudiantesPostulados(this.idConvocatoria).subscribe(data => {
      this.listaEstudiantePostulados = data['estudiantesPostulados'];
      
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

  /**
   * Permite seleccionar los estudiantes que tendrán la beca.
   *  
   */
  seleccionarEstudiante(idInscripcion : number, fueSeleccionado:boolean){
    let titulo = "";
    if(fueSeleccionado){
      titulo = "Quitar selección a estudiante";
    }else{
      titulo = "Seleccionar estudiante para la beca";
    }
    
    swal({
      title: titulo,
      text: "¿Está seguro de realizar esta acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
      
        this._evaluarEstudiante.seleccionarEstudiante(idInscripcion).subscribe(data => {
          if(data['success']){

            this.listaEstudiantePostulados.filter(estudiante => {
              if(estudiante.idInscripcion == idInscripcion){
                  estudiante.fueSeleccionado = data['inscripcion'].fueSeleccionado;
              }
            });
        
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
              text: 'No se pudo realizar esta acción',
            });
          }
        });
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
        });
  }

  /**
   * Se abre modal para ver los datos del estudiante postulado.
   * 
   * @param estudiantePostulado 
   */
  abrirModalVerEstudiante(estudiantePostulado){
    let copy = Object.assign({}, estudiantePostulado);
    
    this.datosEstudiantePostulado = copy;
   
    $('#verEstudiantePostuladoModal').modal('show');
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

  initDtOptions(){
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4]
        }
      }
    ];
    this.dtOptions.order = [[ 4, "desc" ]];
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 3, "#filter-disciplina");      
    }
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  /**
   * Abre modal para ver el documento de un estudiante.
   * 
   * @param rutaSoporte 
   */
  viewDoc(rutaSoporte){
    this.rutaSoporte = rutaSoporte;
    $('#modelId').modal('show');
  }
}