import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, AfterViewChecked, ViewEncapsulation } from '@angular/core';

import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { BolsaPresupuestal } from 'src/app/interfaces/bolsaPresupuestal.interface';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var $:any;
declare var jQuery:any;
declare var Tutorial:any;

//SERVICIOS
import { BolsaPresupuestalService } from 'src/app/services/bolsa-presupuestal.service';


@Component({
  selector: 'app-listar-bolsas',
  templateUrl: './listar-bolsas.component.html',
  styleUrls: ['./listar-bolsas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListarBolsasComponent implements OnInit, OnDestroy, AfterViewChecked {
  bolsas:object[]=[];
  errores:object[]=[];
  bolsa:BolsaPresupuestal;
  rutaPdf:string;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  tutorial:any = null;
  appliedFilters:any[] = [];
  funciones:FuncionesJSService;
  constructor(private _bolsaPresupuestalService:BolsaPresupuestalService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef, private funcionesP: FuncionesJSService) { this.funciones = funcionesP;
    this.spinner.show();

    this._bolsaPresupuestalService.getListados().subscribe(data => {
      this.bolsas = data.bolsas;
      this.initDtOptions();
      this.dtTrigger.next();
      this.spinner.hide();
    });
    this.route.params.subscribe(parametros=>{
      this.bolsa = parametros['bolsa'];
    })
  }

  ngOnInit() {
    
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 2, "desc" ]];
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
    this.dtOptions.initComplete = () => {
      
        //let idx = 0;
        this.funciones.addFilter(this, 2, "#filter-periodo");      
        this.funciones.addFilter(this, 4, "#filter-estado");
        
    }
   }
    ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');

    //remueve el tutorial si se cambia de p??gina
    if(this.tutorial) this.tutorial.close();
  }
  
  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });

  }

  verSoporte(soporte){
    this.rutaPdf = soporte;
    $('#pdfSoporte').modal('show');
  }
  cambiarEstado(bolsa){
    swal({
      title: 'Cambiar estado',
      text: "??Est?? seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this._bolsaPresupuestalService.cambiarEstado(bolsa.id).subscribe(data => {
          if(data['success']){
            bolsa.estado = !bolsa.estado;
            swal(
              'Estado modificado',
              'Acci??n realizada satisfactoriamente.',
              'success'
            )
            this.spinner.hide();
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'La bolsa presupuestal no se encuentra registrada en la base de datos',
            });
            this.spinner.hide();
          }
        });
      }
    })
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">M??dulo de administraci??n de bolsas presupuestales</p><p class="container">El sistema permite visualizar y registrar las bolsas presupuestales relacionadas con los programas de est??mulos de la Universidad del Magdalena. A continuaci??n, podr?? conocer los elementos que contiene esta ventana que le permitir??n administrar las bolsas presupuestales en el sistema.</p>'},
        elements:[
          {id: '#btn-crear', text: 'El bot??n "<span class="fas fa-plus"></span> AGREGAR BOLSA PRESUPUESTAL" permite a??adir una nueva bolsa presupuestal al sistema.'},
          {id: '#btn-filtros', text: 'El bot??n "<span class="fa fa-filter" aria-hidden="true"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podr?? realizar una b??squeda entre los registros listados en la tabla.'},
          {id: '#btn-ayuda', text: 'El bot??n "<span class="fa fa-question-circle" aria-hidden="true"></span>" permite visualizar un cuadro de texto con informaci??n de ayuda para esta ventana.'},
          {id: '#table-bolsas', text: 'Esta tabla contiene las bolsas presupuestales que se han registrado en el sistema. En la columna "Acciones" podr?? encontrar botones que le permitir??n administrar la informaci??n de los registros listados.'},
          {id: '.btn-editar', text: 'El bot??n "<span class="fas fa-pen"></span>" permite modificar la informaci??n ingresada en la bolsa presupuestal.', count: 1},
          {id: '.btn-activar', text: 'El bot??n "<span class="fas fa-eye"></span>" permite activar la bolsa presupuestal para que esta se visualice en otros m??dulos del sistema. Esto no afecta a los registros que usen esta bolsa presupuestal actualmente.', count: 1},
          {id: '.btn-desactivar', text: 'El bot??n "<span class="fas fa-eye-slash"></span>" permite desactivar la bolsa presupuestal para que no se visualice en los dem??s m??dulos del sistema. Esto no afecta a los registros que usen esta bolsa presupuestal actualmente.', count: 1},
          {id: '.btn-reporte', text: 'El bot??n "<span class="far fa-file"></span>" permite visualizar el documento de soporte subido al momento de registrar la bolsa presupuestal en el sistema.', count: 1},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresi??n o exportarlos en formato Excel.'},
          {id: '#table-bolsas_filter', text: 'La barra de b??squeda permite buscar un registro especifico escribiendo el nombre, la fuente o cualquier otra palabra que este relacionada con la bolsa presupuestal que desea encontrar.'},
        ]
      });
      this.tutorial.start();
  }
}
