import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { ActivatedRoute } from '@angular/router';
import { Convocatoria, TiposConvocatorias } from 'src/app/class/api';
import { MonitorARatificar } from '../../estudiantesRatificados/ratificar/ratificar.component';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;
declare var jQuery:any;
declare var Tutorial:any;

//Servicios
import { PlazaService } from 'src/app/services/plaza.service';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

@Component({
  selector: 'app-listar-plazas',
  templateUrl: './listar-plazas.component.html',
  styleUrls: ['./listar-plazas.component.css'],
  providers: [MessageService, FuncionesJSService]
})
export class ListarPlazasComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  convocatoria:Convocatoria;
  solicitudesPlazas: any[] = [];
  plazasPreAprobadas:any[] = [];
  solicitudPlaza: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  errores: Message[] = [];
  appliedFilters:any[] = [];
  userService:UserService;
  funciones:FuncionesJSService;
  tutorial:any = null;
  tipoConvocatoria:number;
  idConvocatoria:number;

  posiblesRatificados:MonitorARatificar[];
  estudiantesSeleccionados:MonitorARatificar[];

  constructor(private _plazaService: PlazaService, private messageService: MessageService, private _userService: UserService, private spinner: NgxSpinnerService,
    private funcionesP: FuncionesJSService ,  private elementRef: ElementRef, private route:ActivatedRoute ) { 
      this.userService = _userService; this.funciones = funcionesP; 
      this.posiblesRatificados = [];
      this.estudiantesSeleccionados = [];
      this.convocatoria = new Convocatoria();
    }

  ngOnInit() {
    
    this.route.params.subscribe(parametros => {
      this.tipoConvocatoria = parametros['tipoConvocatoria']; 
      this.idConvocatoria = parametros['id']; 
    });
    this.spinner.show();
    this._plazaService.getSolicitudesPlazas(this.idConvocatoria, this.tipoConvocatoria).subscribe(data => {
      if(data['convocatoria'] != null) this.convocatoria = Object.assign(this.convocatoria, data['convocatoria']);
      
      if(data['solicitudesPlaza']) this.solicitudesPlazas = data['solicitudesPlaza'];

      if(data['error']){
        swal({
          type: 'error',
          title: 'Error',
          text: "La convocatoria indicada no existe",
        });
      }

      for(let i = 0; i < this.solicitudesPlazas.length; i++){
        this.solicitudesPlazas[i].tipoPlazaNombre = this.sentenceCase(this.solicitudesPlazas[i].tipoPlazaNombre.toLowerCase());
        this.solicitudesPlazas[i].perfil = this.solicitudesPlazas[i].perfil;
        this.solicitudesPlazas[i].competenciasRequeridas = this.solicitudesPlazas[i].competenciasRequeridas != null ? this.sentenceCase(this.solicitudesPlazas[i].competenciasRequeridas.toLowerCase()) : '';
        this.solicitudesPlazas[i].cuposPreaprobados = this.solicitudesPlazas[i].cuposAprobados;
      }

      this.initDtOptions();      
      this.dtTrigger.next(); 
      
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        if(this.convocatoria.id != null){
          dtInstance.column(0).visible(false);
        }
        if(!this._userService.roleMatch(['Admin','AdminMonitorias'])){
          dtInstance.column(1).visible(false);
        }
        if(!this._userService.roleMatch(['Unidad', 'UnidadMonitorias'])){
          dtInstance.column(3).visible(false);
        }      
        
        dtInstance.column(6).visible(false);
        dtInstance.column(7).visible(false);
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
  }
  
  initDtOptions(){
    if( this._userService.roleMatch(['Admin'])){
      this.dtOptions.order = [[5, "desc"]];
    }else{
      this.dtOptions.order = [[5, "desc"]];
    }
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.retrieve = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar'
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
        }
      }
    ];
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      //let idx = 0;
      this.funciones.addFilter(this, 0, "#filter-convocatoria");
      this.funciones.addFilter(this, 1, "#filter-solicitante");
      this.funciones.addFilter(this, 2, "#filter-plaza");
           
    }    
  }

  sentenceCase(input) {
    input = ( input === undefined || input === null ) ? '' : input;
    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
    return match.toUpperCase();
    });
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

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  solicitudP(obj) {
    let copy = Object.assign({}, obj);
    $('#solicitud').modal('show');
    if(this.tipoConvocatoria == TiposConvocatorias.MONITORIA){
      console.log(obj.id);
        this._plazaService.getMonitoresParaRatificarDePlazaAnterior(obj.id).subscribe((data:MonitorARatificar[]) => {
          console.log(data);
          this.posiblesRatificados = [...data].filter(p => p.es_ratificado).sort(function(a, b){return Number(a.es_ratificado) - Number(b.es_ratificado)});
          this.estudiantesSeleccionados = [...this.posiblesRatificados].filter(p => p.es_ratificado).sort(function(a, b){return Number(a.es_ratificado) - Number(b.es_ratificado)});
        
        }, (err:HttpErrorResponse) => {
          console.error(err.error);
        })
      
    }
    this.solicitudPlaza = copy;
    if (this.solicitudPlaza.cuposAprobados != null) this.solicitudPlaza.cuposAprobados = null;
  }

  editarSolicitud(forma: NgForm) {
    if (!forma.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "Complete los campos del formulario" });
    }
    else {
      swal({
        title: 'Responder solicitud',
        text: '¿Está seguro de realizar esta acción?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        reverseButtons:true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then((res) => {
        if (res.value) {
          this.spinner.show();
          this._plazaService.postAprobarPlaza(this.solicitudPlaza).subscribe(data => {
            if(data['success']){
              let index = this.solicitudesPlazas.indexOf(Object.assign([],this.solicitudesPlazas).filter((item:any) => {return item.id == this.solicitudPlaza.id}).shift());
              this.solicitudesPlazas.splice(index, 1);
              this.rerender();
              forma.resetForm(this.solicitudPlaza);
              this.spinner.hide();
              $('#solicitud').modal('hide');
              swal({
                type: "success",
                title: "Realizado",
                text: "Se ha cambiado el estado de solicitud a " + data['objRetornado'].estadoNombre,
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              this.errores = [];
              for (let i = 0; i < data['errores'].length; i++) {
                if (data['errores'][i].errores.length > 0) {
                  for (let j = 0; j < data['errores'][i].errores.length; j++)
                    this.errores.push(data['errores'][i].errores[j]);
                }
              }
              swal({
                type: 'error',
                title: 'Error',
                text: this.errores[0]['ErrorMessage'],
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
        } else if (res.dismiss === swal.DismissReason.cancel) {
          forma.resetForm(this.solicitudPlaza);
        }
      });
    }
  }

  cambiarEstado(obj){   
    swal({
        title: 'Cancelar solicitud',
        text: '¿Está seguro de realizar esta acción?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        // cancelButtonColor: '#d33',
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
      }).then((res) => {
        if (res.value) {
          this._plazaService.cambiarEstadoPlaza(obj)
           .subscribe(data=>{
             let index = this.solicitudesPlazas.indexOf(obj);
             this.solicitudesPlazas.splice(index,1);
             this.rerender();
             if (data['success']) {
               swal({
                type: "success",
                title: "Realizado",
                text: "Se ha cancelado satisfactoriamente la solicitud.",
                timer: 2000,
                showConfirmButton: false
              }); 
             }
           }, err =>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });
           // this.spinner.hide()
          });
          
        }else if (res.dismiss === swal.DismissReason.cancel){}
      });     
  }

  /**
   * Permite saber si una solicitud se encuentra en una etapa indicada por el id
   * @param etapas etapas actuales de la solicitud
   * @param estado_etapa_id id de estado de la plaza a verificar
   * @return verdadero si existe, falso si no
   */
  esEtapa(etapas:any[], estado_etapa_id:number, operacion:string = "="):boolean{
    let result:boolean = false;
    switch (operacion) {
      case "=":
        result = etapas.filter(_ => _.estado_id == estado_etapa_id).length > 0;
        break;
      case ">":
        result = etapas.filter(_ => _.estado_id > estado_etapa_id).length > 0;
        break;
      case "<":
        result = etapas.filter(_ => _.estado_id < estado_etapa_id).length > 0;
        break;
      case ">=":
        result = etapas.filter(_ => _.estado_id >= estado_etapa_id).length > 0;
        break;
      case "<=":
        result = etapas.filter(_ => _.estado_id <= estado_etapa_id).length > 0;
        break;
      default:
        result = etapas.filter(_ => _.estado_id == estado_etapa_id).length > 0;
    }
    return result;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      if(this.solicitudesPlazas.length > 0){
        if(!this._userService.roleMatch(['Admin'])){
          dtInstance.column(1).visible(false);
        }
        if(!this._userService.roleMatch(['Unidad'])){
          dtInstance.column(3).visible(false);
        }
        
        dtInstance.column(6).visible(false);
        dtInstance.column(7).visible(false);
      }
      
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de plazas solicitadas</p><p class="container">El sistema permite visualizar las plazas solicitadas por las unidades registradas en el sistema. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar las convocatorias en el sistema.</p>'},
        elements:[
          {id: '#btn-solicitar', text: 'El botón "<span class="fas fa-plus"></span> SOLICITAR PLAZA" permite a una unidad solicitar una nueva plaza para una convocatoria que se encuentre activa en el sistema.'},
          {id: '#btn-filtros', text: 'El botón "<span class="fa fa-filter"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podrá realizar una búsqueda entre los registros listados en la tabla.'},
          {id: '#btn-informacion', text: 'El botón "<span class="fa fa-question-circle"></span>" permite visualizar un cuadro de texto con información de ayuda para esta ventana.'},
          {id: '#table-plazas', text: 'Esta tabla contiene las plazas que se han solicitado a las convocatorias que se encuentran activas en el sistema. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de los registros listados.'},
          {id: '.btn-detalle', text: 'El botón "<span class="fas fa-info-circle"></span>" permite ver el detalle completo de la plaza solicitada por una unidad registrada en el sistema.', count: 1},
          {id: '.btn-eliminar', text: 'El botón "<span class="far fa-trash-alt"></span>" permite eliminar el registro de la plaza solicitada por una unidad registrada en el sistema.', count: 1},
          {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la información ingresada de la plaza solicitada.', count: 1},
          {id: '.btn-responder', text: 'El botón "<span class="fas fa-reply"></span>" permite responder a una solicitud de plaza hecha por una unidad registrada en el sistema.', count: 1},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
          {id: '#table-plazas_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo el nombre de la convocatoria, la unidad solicitante, el nombre de la plaza, la cantidad de cupos solicitados o cualquier otra palabra que este relacionada con la solicitud de plaza que desea encontrar.'},
        ]
      });
      this.tutorial.start();
  }
}
