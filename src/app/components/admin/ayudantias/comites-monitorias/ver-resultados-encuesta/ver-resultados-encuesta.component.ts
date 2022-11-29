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
import { EtapaMonitoria } from '../estudiantes-atendidos/estudiantes-atendidos.component';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

declare var $:any;
declare var jQuery:any;
// declare var Tutorial:any;

@Component({
  selector: 'app-ver-resultados-encuesta',
  templateUrl: './ver-resultados-encuesta.component.html',
  styleUrls: ['./ver-resultados-encuesta.component.css']
})
export class VerResultadosEncuestasComponent implements OnInit, AfterViewChecked {

  idConvocatoria:number = null;
  tipoConvocatoria:number = null;
  tipoEncuesta:number = null;
  errores:object[] = [];
  monitores:any[] = [];
  monitor:any = {};
  etapa = EtapaMonitoria;
  api:string = Api.dev;
  index:any = null;
  // tutorial:any = null;
  appliedFilters:any[] = [];
  @ViewChild(DataTableDirective) dtElement:DataTableDirective;
  
  dtOptions:any = Object.assign({}, DTConfig.dtConf);
  dtTrigger:Subject<string> = new Subject();
  userService:UserService;
  funciones:FuncionesJSService;
  
  constructor(private _comiteMonitoriaService:ComiteMonitoriasService,
              private activatedroute: ActivatedRoute, private spinner: NgxSpinnerService,
              private route:ActivatedRoute, private _userService:UserService,
              private funcionesP: FuncionesJSService, private _location: Location)
    { 
      this.userService = _userService; 
      this.funciones= funcionesP;
      activatedroute.params.subscribe(parametros => {
        if (parametros['id'] != undefined)
          this.idConvocatoria = parametros['id'];
        
        if (parametros['tipoConvocatoria'] != undefined)
          this.tipoConvocatoria = parametros['tipoConvocatoria'];
      });
    }
  
  ngOnInit() {
    
    let parent = this;

    $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
      if (e.target.id == 'pills-estudiantes-tab')
        parent.cargarEncuestasEstudiantes();

      if (e.target.id == 'pills-tutores-tab')
        parent.cargarEncuestasTutores();
    })
    //this.cargarEncuestasTutores();
    this.cargarEncuestasEstudiantes(true);
  }

  backClicked() {
    this._location.back();
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 7, "desc" ],[ 6, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.retrieve = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      this.funciones.addFilter(this, 2, "#filter-monitor");
      this.funciones.addFilter(this, 3, "#filter-plaza");
      if(this.idConvocatoria == null) this.funciones.addFilter(this, 4, "#filter-convocatoria");
      this.funciones.addFilter(this, 5, "#filter-solicitante");
    }
  }

  rerender(): void {
    if(this.dtElement){
      if(this.dtElement.dtInstance){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          this.initDtOptions();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
          this.funciones.reemplazarBotonesDatatable();
        });
        
      }

    }
  }

  cargarEncuestasEstudiantes(primeraVez:boolean = false) {

    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.idConvocatoria = parametros['id'];
      this.tipoConvocatoria = parametros['tipoConvocatoria'];
      this.tipoEncuesta = 1;
      this._comiteMonitoriaService.getResultadosEncuestasEstudiante(this.idConvocatoria, this.tipoConvocatoria).subscribe(data=>{
        if(data['success']){
          this.monitores = data['resultadosEncuestas'];
          this.initDtOptions();
          if (primeraVez) {
            this.dtTrigger.next();
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              
              dtInstance.column(0).visible(false);
              dtInstance.column(5).visible(false);
            }); 
          }
          else {this.rerender();}
          
        }
        this.spinner.hide();
      },      
      err=>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          this.spinner.hide();  
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          }); 
        })
    });
  }
  
  cargarEncuestasTutores() {

    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.idConvocatoria = parametros['id'];
      this.tipoConvocatoria = parametros['tipoConvocatoria'];
      this.tipoEncuesta = 2;
      this._comiteMonitoriaService.getResultadosEncuestasTutor(this.idConvocatoria, this.tipoConvocatoria).subscribe(data=>{
        if(data['success']){
          this.monitores = data['resultadosEncuestas'];
          this.monitores = this.monitores.map(m => {
            let monitor = m;
            monitor.nro_encuestas = (m.calificacion_tutor != null) ? 1 : 0;
            monitor.nro_maximo_encuestas = 1;
            monitor.calificacion = m.calificacion_tutor
            return monitor;
          });
          this.rerender();
          //this.dtTrigger.next();
        }
        this.spinner.hide();
      },      
      err=>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          this.spinner.hide();  
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          }); 
        })
    });
  }
}