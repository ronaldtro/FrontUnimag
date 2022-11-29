import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy, DoCheck, AfterContentInit } from '@angular/core';
import { ConvocatoriaService } from '../../../../../services/convocatoria.service';
import { Api } from '../../../../../class/api';
declare var $:any;
import { Subject } from 'rxjs/Subject';
import { DTConfig } from '../../../../../class/dtconfig';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Convocatoria } from 'src/app/interfaces/convocatorias.interface';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import {MessageService} from 'primeng/components/common/messageservice';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import {saveAs as importedSaveAs} from "file-saver";
import { ReportesService } from 'src/app/services/reportes.service';


declare var jQuery:any;
declare var Tutorial:any;

@Component({
  selector: 'app-listar-convocatorias',
  templateUrl: './listar-convocatorias.component.html',
  styleUrls: ['./listar-convocatorias.component.css'],
  providers: [MessageService]

})

export class ListarConvocatoriasComponent implements OnInit, OnDestroy, AfterViewChecked {
  
  
  convocatorias:any[]=[];
  api:string = Api.dev;
  urlDoc: string;
  estados:Objeto[];
  tutorial:any = null;
  appliedFilters:any[] = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  dtTrigger: Subject<string> = new Subject();
  userService: UserService;
  funciones:FuncionesJSService;
  id: any;
  tipoConvocatoria:number;
  constructor(private _convocatoriaService:ConvocatoriaService, 
              private router:Router, private spinner: NgxSpinnerService, 
              private route:ActivatedRoute,
              private messageService: MessageService
              , private _userService:UserService, 
              private elementRef: ElementRef, 
              private funcionesP: FuncionesJSService,
              private _reportesService:ReportesService) { this.userService = _userService; this.funciones= funcionesP; }
  
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id = params.id;
      
    this._convocatoriaService.listConvocatorias(this.id).subscribe(data=>{
        this.convocatorias=data['convocatorias'];
        this.estados=data['estados'];
        this.initDtOptions();
        this.dtTrigger.next();
        this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()
      });
    })
    
  }
  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.retrieve = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      }
    ];
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
        this.funciones.addFilter(this, 2, "#filter-control");      
        this.funciones.addFilter(this, 3, "#filter-estado"); 
      //  this.funciones.addFilter(this, 3, "#filter-estado");
        
    }
  }

  viewDoc( doc:string ){
    this.urlDoc = doc;
    $('#modelId').modal('show');
  }

  updateConvocatoria(convocatoria: Convocatoria){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        convocatoria.estado=!convocatoria.estado;
        this.spinner.show();
        this._convocatoriaService.actualizarEstado(convocatoria.id, convocatoria.estado).subscribe(data=>{         
        //  this.rerender();
          if(data['success']){
            swal(
              'Estado modificado',
              'Acción realizada satisfactoriamente.',
              'success'
            )
          }
          this.spinner.hide();
        }, err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        })
      }
    });

  }

  rerender(): void {
    if(this.dtElement){
      if(this.dtElement.dtInstance){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      }
      
    }
    
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');

    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  // getlista(convocatoria:any){
   
  //   this.spinner.show();
  //   this._convocatoriaService.geDatosEst(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Estudiantes postulados " + convocatoria.titulo); this.spinner.hide(); });
  // }

  getlista(convocatoria:any){
    this.spinner.show();
    this._convocatoriaService.geDatosEst(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Estudiantes postulados " + convocatoria.titulo); this.spinner.hide(); });
  }

  /**
   * Metodo para generar un excel con el reporte de horas de monitores para los usuarios de comite
   * @param convocatoria 
   */
  reporteHorasEstudianteComite(convocatoria:any){
    this._reportesService.getReporteHorasMonitoresParaComiteEnExcel(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Reporte de horas de monitores " + convocatoria.titulo+ ".xlsx"); this.spinner.hide(); });
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de convocatorias</p><p class="container">El sistema permite visualizar y registrar las convocatorias relacionadas con el periodo vigente en la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar las convocatorias en el sistema.</p>'},
        elements:[
          {id: '#btn-crear', text: 'El botón "<span class="fas fa-plus"></span> AGREGAR CONVOCATORIA" permite añadir una nueva convocatoria al sistema.'},
          {id: '#btn-filtros', text: 'El botón "<span class="fa fa-filter"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podrá realizar una búsqueda entre los registros listados en la tabla.'},
          {id: '#btn-informacion', text: 'El botón "<span class="fa fa-question-circle"></span>" permite visualizar un cuadro de texto con información de ayuda para esta ventana.'},
          {id: '#table-convocatorias', text: 'Esta tabla contiene las convocatorias que se han registrado en el sistema. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de los registros listados.'},
          {id: '.btn-detalle', text: 'El botón "<span class="fas fa-info-circle"></span>" permite ver el detalle completo de la convocatoria.', count: 1},
          {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la información ingresada en la convocatoria.', count: 1},
          {id: '.btn-activar', text: 'El botón "<span class="fas fa-eye"></span>" permite activar la convocatoria para que esta se visualice en otros módulos del sistema. Esto no afecta a los registros que usen esta convocatoria actualmente.', count: 1},
          {id: '.btn-desactivar', text: 'El botón "<span class="fas fa-eye-slash"></span>" permite desactivar la convocatoria para que no se visualice en los demás módulos del sistema. Esto no afecta a los registros que usen esta convocatoria actualmente.', count: 1},
          {id: '.btn-verEstudiantes', text: 'El botón "<span class="fas fa-users"></span>" permite ver los estudiantes que se encuentran seleccionados en la convocatoria.', count: 1},
          {id: '.btn-masAcciones', text: 'El botón "<span class="fas fa-ellipsis-v"></span>" permite acceder a más acciones como: ver soporte, ver plazas, exportar estudiantes postulados, ver el reporte de cantidad de estudiantes por plaza y ver el reporte de horas realizadas por estudiante, tenga en cuenta que algunas de estas acciones puede estar disponible o no dependiendo de la etapa en la que se encuentre la convocatoria y del rol del usuario.', count: 1},
          {id: '#historialConvocatorias', text: 'El link "<a style="pointer-events: none; cursor: default;" href="">Ver el historial completo de convocatorias</a>" permite visualizar el listado completo de convocatorias que han existido a lo largo del tiempo.'},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
          {id: '#table-convocatorias_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo el nombre, el estado de control o cualquier otra palabra que este relacionada con la convocatoria que desea encontrar.'},
        ]
      });
      this.tutorial.start();
  }

}
