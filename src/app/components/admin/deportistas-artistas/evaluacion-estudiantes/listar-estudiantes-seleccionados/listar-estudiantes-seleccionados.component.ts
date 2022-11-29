import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Api } from 'src/app/class/api';
import { DTConfig } from 'src/app/class/dtconfig';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';

declare var $;
declare var jQuery;

@Component({
  selector: 'app-listar-estudiantes-seleccionados',
  templateUrl: './listar-estudiantes-seleccionados.component.html',
  styleUrls: ['./listar-estudiantes-seleccionados.component.css']
})
export class ListarEstudiantesSeleccionadosComponent implements OnInit {

   /**
   * Se guarda el id de la convocatoria para listar los estudiantes seleccionados de la misma
   */
  idConvocatoria : number;

  /**
   * Se guardan los estudiantes que han sido seleccionados.
   */
  listaEstudianteSeleccionados : any[] = [];
  
  /**
   * Contiene los datos del estudiante seleccionado.
   */
  datosEstudianteSeleccionado : any = {};

  rutaSoporte : string;

  appliedFilters:any[] = [];

  funciones : FuncionesJSService;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;

  constructor(private funcionesP:FuncionesJSService,
              private _inscripcionService : InscripcionArtistasDeportistasService,
              private route : ActivatedRoute,  private spinner: NgxSpinnerService, 
              private elementRef: ElementRef) { 
                this.funciones = funcionesP;
              }
  
   /**
   * Se cargan y listan los estudiantes seleccionados de una determinada convocatoria
   */
  ngOnInit() {
    
    this.spinner.show();
    this.route.params.subscribe(params => {
    this.idConvocatoria = params.id;

    this._inscripcionService.getEstudiantesSeleccionadosConvocatoria(this.idConvocatoria).subscribe(data => {
      this.listaEstudianteSeleccionados = data['seleccionados'];
      
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
   * Abre modal para ver los datos de un estudiante.
   * 
   * @param estudiantePostulado 
   */
  abrirModalVerEstudiante(estudiantePostulado){
    let copy = Object.assign({}, estudiantePostulado);
    
    this.datosEstudianteSeleccionado = copy;
   
    $('#verEstudianteSeleccionadoModal').modal('show');
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
    this.dtOptions.stateSave = false;
    this.dtOptions.order = [[ 4, "desc" ]];
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

  viewDoc(rutaSoporte){
    this.rutaSoporte = rutaSoporte;
    $('#modelId').modal('show');
  }

}
