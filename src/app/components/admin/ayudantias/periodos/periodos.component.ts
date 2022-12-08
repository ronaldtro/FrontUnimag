import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';

import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Periodo } from 'src/app/interfaces/periodo.interface';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
declare var $: any;
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';


declare var jQuery:any;
declare var Tutorial:any;

//SERVICIOS
import { PeriodoService } from 'src/app/services/periodo.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';



@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.css'],
  providers: [MessageService]
})
export class PeriodosComponent implements OnDestroy, OnInit, AfterViewInit, AfterViewChecked {
  
  periodo: Periodo = {
    id: null,
    anio: null,
    semestre: null,
    tipo_beneficio:null,
    id_beneficio:null,
    valor: null,
    estado: true,
    promedio: null,
    nota_minima: null
  };
  index: number = 0;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  appliedFilters:any[] = [];
  periodos: Periodo[] = [];
  beneficios: any[]=[]; 
  errores: any[] = [];
  error: any[] = [];
  funciones:FuncionesJSService;
  tutorial:any = null;

  constructor(private _periodosService: PeriodoService, 
    private messageService: MessageService, 
    private spinner: NgxSpinnerService, 
    private elementRef: ElementRef, 
    private funcionesP: FuncionesJSService) {this.funciones = funcionesP; }

  ngOnInit() {
    this.spinner.show();
    this._periodosService.getDatos()
      .subscribe(data => {
        this.periodos = data['datosPeriodo'];
        this.beneficios = data['beneficios'];
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

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4,5]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4,5]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4,5]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
        //let idx = 0;
        this.funciones.addFilter(this, 1, "#filter-tipoBeneficio");      
        this.funciones.addFilter(this, 5, "#filter-estado");
        
    }
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
    // Remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  crear() {
    this.periodo = {
      id: null, anio: null, semestre: null, valor: null, estado: true, id_beneficio:null, tipo_beneficio:null
    };
    $('#crearPeriodo').modal('show');
  }

  guardar(forma: NgForm) {
    this.spinner.show();
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this._periodosService.nuevoDato(this.periodo)
        .subscribe(data => {
          if (data['success']) {
            
            this.periodos.push(data['objRetornado']);
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            
            $('#crearPeriodo').modal('hide');
            forma.resetForm(this.periodo);
            this.error = [];
            this.spinner.hide();
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
    }
  }

  editar(obj) {
   // console.log(obj);
    this.index = this.periodos.indexOf(obj);
    let copy = Object.assign({}, obj);
    $('#editarPeriodo').modal('show');
    this.periodo = copy;
  }

  editarGuardar(forma: NgForm) {
    this.spinner.show();
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this._periodosService.editarDato(this.periodo)
        .subscribe(data => {
          if (data['success']) {
            this.periodos[this.index] = data['objRetornado'];
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#editarPeriodo').modal('hide');
            forma.resetForm(this.periodo);
            this.periodo = {
              id: null, anio: null, semestre: null, valor: null, estado: true, id_beneficio:null, tipo_beneficio:null
            };
            this.error = [];
            this.spinner.hide();
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
    }
  }

  estadoDato(obj) {
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
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
        this.spinner.show();
        this._periodosService.estadoDato(obj).subscribe(data => {
          let index = this.periodos.indexOf(obj);
          this.periodos[index] = data['objRetornado'];
          this.rerender();
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha cambiado el estado satisfactoriamente.",
            timer: 2000,
            showConfirmButton: false
          });
          this.spinner.hide();
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });        
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
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de Periodos Académicos</p><p class="container">El sistema permite visualizar y registrar los periodos académicos relacionados con las ayudantías de la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene este módulo y las diferentes acciones y funcionalidades a las cuales puede acceder.</p>'},
        elements:[
          {id:'#btn-crear',text:'El botón "<i class="fa fa-plus" aria-hidden="true"></i> AGREGAR PERIODO" permite agregar un nuevo periodo académico al sistema.'},
          {id:'#btn-filtros',text:'El botón "<span class="fa fa-filter" aria-hidden="true"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podrá realizar una búsqueda entre los registros listados en la tabla.'},
          {id:'#btn-ayuda',text:'El botón "<span class="fa fa-question-circle" aria-hidden="true"></span>" permite visualizar un cuadro de texto con información de ayuda para esta ventana.'},
          {id: '#table', text: 'La tabla muestra todos los periodos académicos que se encuentran actualmente en el sistema. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de los registros listados.'},
          {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la información ingresada en el periodo académico.', count: 1},
          {id: '.btn-activar', text: 'El botón "<span class="fas fa-eye"></span>" permite activar el periodo académico para que este se visualice en otros módulos del sistema. Esto no afecta a los registros que usen este periodo académico actualmente.', count: 1},
          {id: '.btn-desactivar', text: 'El botón "<span class="fas fa-eye-slash"></span>" permite desactivar el periodo académico para que este no se visualice en otros módulos del sistema. Esto no afecta a los registros que usen este periodo académico actualmente.', count: 1},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
          {id: '#table_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo el año del periodo, el tipo de beneficio, el promedio mínimo, la nota mínima o cualquier otra palabra que este relacionada con el periodo académico que desea encontrar.'},
        ]
      });
      this.tutorial.start();
  }

}
