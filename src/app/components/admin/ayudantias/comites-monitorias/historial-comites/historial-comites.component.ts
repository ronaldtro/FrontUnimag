import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy, DoCheck, AfterContentInit } from '@angular/core';
import { ComiteMonitoriasService } from 'src/app/services/comite-monitorias.service';
import { Api } from '../../../../../class/api';
import { Subject } from 'rxjs/Subject';
import { DTConfig } from '../../../../../class/dtconfig';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

declare var $:any;
declare var jQuery:any;
// declare var Tutorial:any;

@Component({
  selector: 'app-historial-comites',
  templateUrl: './historial-comites.component.html',
  styleUrls: ['./historial-comites.component.css']
})
export class HistorialComitesComponent implements OnInit {

  errores:object[] = [];
  historialComites:any[] = [];
  historialComite:any = {};
  api:string = Api.dev;
  index:any;
  // tutorial:any = null;
  appliedFilters:any[] = [];
  @ViewChild(DataTableDirective)
  dtElement:DataTableDirective;
  dtOptions:any = Object.assign({}, DTConfig.dtConf);
  dtTrigger:Subject<string> = new Subject();
  userService:UserService;
  funciones:FuncionesJSService;
  sw = true;

  constructor(private _comiteMonitoriaService:ComiteMonitoriasService, 
              private router:Router, private spinner: NgxSpinnerService, 
              private route:ActivatedRoute,
              private _userService:UserService, private elementRef: ElementRef,
              private funcionesP: FuncionesJSService, private _location: Location)
  { this.userService = _userService; this.funciones= funcionesP; }

  ngOnInit() {

    this.spinner.show();
    this._comiteMonitoriaService.listarHistorialComites().subscribe(data=>{
        this.historialComites = data['historialComites'];
        console.log(this.historialComites);
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
      
      if (this.sw){
        this.funciones.addFilter(this, 0, "#filter-fecha_modificacion");      
        this.funciones.addFilter(this, 3, "#filter-comite");
        this.funciones.addFilter(this, 4, "#filter-rol");
        this.funciones.addFilter(this, 5, "#filter-estado");
        this.sw = false;
      }
    }
  }

  backClicked() {
    this._location.back();
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
    // remueve el tutorial si se cambia de página
    // if(this.tutorial) this.tutorial.close();
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}
