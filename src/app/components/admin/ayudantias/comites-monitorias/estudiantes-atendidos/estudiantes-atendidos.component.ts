import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy, DoCheck, AfterContentInit } from '@angular/core';
import { ComiteMonitoriasService } from 'src/app/services/comite-monitorias.service';
import { Api, EnviarCorreoEncuestas } from '../../../../../class/api';
import { Subject } from 'rxjs/Subject';
import { DTConfig } from '../../../../../class/dtconfig';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Actividades } from 'src/app/interfaces/actividades.interface';
import swal from 'sweetalert2';

declare var $:any;
declare var jQuery:any;
// declare var Tutorial:any;

@Component({
  selector: 'app-estudiantes-atendidos',
  templateUrl: './estudiantes-atendidos.component.html',
  styleUrls: ['./estudiantes-atendidos.component.css']
})
export class EstudiantesAtendidosComponent implements OnInit, AfterViewChecked {

  idEstudiante:number = null;
  errores:object[] = [];
  monitor:any = {};
  asistentes:any[] = [];
  asistente:any = {};
  asistenteEncuesta:any[] = [];
  horas: number = 0;
  horasAsistentes: number = 0;
  plaza: any = {
    codigo: null,
    estado_convocatoria:null,
    Nombre: null,
    tipo: { id: null, nombre: null },
    estudiante: null,
    unidad: null,
    plaza_id:null
  };
  actividades:Actividades [] = [];
  api:string = Api.dev;
  index:any = null;
  // tutorial:any = null;
  appliedFilters:any[] = [];
  @ViewChild(DataTableDirective)
  dtElement:DataTableDirective;
  dtOptions:any = Object.assign({}, DTConfig.dtConf);
  dtTrigger:Subject<string> = new Subject();
  userService:UserService;
  funciones:FuncionesJSService;
  etapa = EtapaMonitoria;
  
  constructor(private _comiteMonitoriaService:ComiteMonitoriasService,
              private activatedroute: ActivatedRoute, private spinner: NgxSpinnerService,
              private route:ActivatedRoute, private _userService:UserService,
              private funcionesP: FuncionesJSService)
    { 
      this.userService = _userService; 
      this.funciones= funcionesP; 
      activatedroute.params.subscribe(parametros => {
      if (parametros['id'] != undefined) {
        this.idEstudiante = parametros['id'];
      }
    });}
  ngOnInit() {
    
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.idEstudiante = parametros['id'];
      this._comiteMonitoriaService.getEstudiantesAtendidos(this.idEstudiante).subscribe(data=>{
        if(data['success']){
          this.plaza = data['plaza'];
          this.actividades = data['plaza']['actividades'];
          this.monitor = data['plaza']['monitor'];
          
          for (let i = 0; i < this.actividades.length; i++) {
            for (let j = 0; j < this.actividades[i].estudiantes_atendidos.length; j++) {
              if (this.asistentes.length > 0 ) {
                let asistente = this.asistentes.filter(x => x.codigo == this.actividades[i].estudiantes_atendidos[j].codigo)[0];
                if (asistente != undefined)
                  this.asistentes.find(x => x.codigo == asistente.codigo).horas_asistidas += this.actividades[i].estudiantes_atendidos[j].horas_asistidas;
                else
                  this.asistentes.push(this.actividades[i].estudiantes_atendidos[j]);
              }
              else
                this.asistentes.push(this.actividades[i].estudiantes_atendidos[j]);
            }
          }
          
          for (let i = 0; i < this.actividades.length; i++) {
          
            this.actividades[i].fecha_fin = new Date(
              this.actividades[i].fecha_fin
            );
            this.actividades[i].fecha_inicio = new Date(
              this.actividades[i].fecha_inicio
            );
            this.horas += this.actividades[i].tiempo;          
          }

          this.getTotalHorasAsistente();
          if (this.plaza.estado_convocatoria_id >= this.etapa.Inicio_de_actividades || this.plaza.estado_convocatoria_id == 0) this.seleccionarAsistentes();
          this.initDtOptions();
          this.dtTrigger.next();
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

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 5, "desc" ],[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.retrieve = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      this.funciones.addFilter(this, 2, "#filter-programa");
    }
  }

  getInteger(number : number){
    return Math.floor(number);
  }

  getDecimals(number: number) {
    return (Math.round(number * 100) / 100) % 1;
  }

  diferenciaHoras(fecha_inicio: Date, fecha_fin: Date){
    if(fecha_inicio == null || fecha_fin == null){
      return 0;
    }
    let diference = fecha_fin.getTime() - fecha_inicio.getTime();
  
    if (diference === 0) {
      return 0;
    }
    let mins = diference / 60000;
    let hrs = mins / 60;
    // console.log((Math.round(hrs * 100) / 100) % 1);
    return Math.round(hrs * 100) / 100;
  }

  getTotalHorasAsistente() {
    this.horasAsistentes = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estudiantes_atendidos'].length > 0;
    });
    for (let i = 0; i < actividades.length; i++) {
      this.horasAsistentes += this.diferenciaHoras(
        actividades[i].fecha_inicio,
        actividades[i].fecha_fin
      );
    }
  }

  seleccionarAsistentes() {
    
    let promedioHoras = 0.0;

    for (let i = 0; i < this.asistentes.length; i++) {
      
      promedioHoras = (this.asistentes[i].horas_asistidas / this.horasAsistentes) * 100;
      
      if (promedioHoras >= 50.0)
        this.asistenteEncuesta.push(this.asistentes[i].codigo);
    }
  }
  /**
   * Método para enviar encuestas a estudiantes seleccionados
   */
  enviarEncuesta() {
    if(!this.asistenteEncuesta.length){
      
      return;
    }
    let enviarCorreoEncuestas:EnviarCorreoEncuestas = new EnviarCorreoEncuestas(this.idEstudiante, this.asistenteEncuesta);
    this.spinner.show();
    this._comiteMonitoriaService.enviarCorreoEncuestas(enviarCorreoEncuestas).subscribe((data:any) => {
      
      if(data["success"]){
        swal({
          title: "Realizado",
          text: "Se ha enviado la encuesta a los correos electrónicos de los estudiantes seleccionados.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });  
      }
      this.spinner.hide();
    }, (err:any) => {
      console.log(err);
      this.spinner.hide();
    })
    
  }

}

export enum EtapaMonitoria {
  Solicitud_de_plazas = 17,
  Preaprobacion_de_plazas = 18,
  Revision_de_plazas = 19,
  Inscripciones = 20,
  Verificacion_de_requisitos = 21,
  Pruebas_de_seleccion = 22,
  Publicacion_de_lista_preliminar = 23,
  Publicacion_de_lista_definitiva = 24,
  Reunion_de_estudiantes_seleccionados = 25,
  Inicio_de_actividades = 26,
  Reporte_de_dependencia_a_bienestar = 27,
  Fecha_maxima_de_resolución_de_pago = 28
}


