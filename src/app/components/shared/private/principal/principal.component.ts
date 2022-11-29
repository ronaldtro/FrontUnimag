import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioCafeteriaService } from 'src/app/services/usuario-cafeteria.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';
import {saveAs as importedSaveAs} from "file-saver";
import { SupervisorService } from 'src/app/services/supervisor.service';
import { TiposConvocatorias, EtapasAyudantias, EtapasMonitorias } from 'src/app/class/api';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit{
  
  userService:UserService;
  beneficios:any[]=[];
  datosModuloAyudantia:DatosModulo[];
  datosModuloMonitoria:DatosModulo[];
  datosModuloRefrigerios:DatosModuloRefrigerios[];
  datosModuloSupervisor:any;
  usuarioLogueado:any;
  tiposConvocatoria = TiposConvocatorias;
  etapasAyundatias = EtapasAyudantias;
  etapasMonitorias = EtapasMonitorias;

  constructor(private _userService:UserService, 
    private spinner: NgxSpinnerService,
    private _usuarioService:UsuarioCafeteriaService,
    private _convocatoriaService:ConvocatoriaService,
    private _convocatoriaRefrigerioService:ConvocatoriaRefrigerioService,
    private _supervisorService:SupervisorService,
    private _reportesService:ReportesService) {
    this.userService = _userService;
    // this.datosModuloAyudantia = [];
    // this.datosModuloMonitoria = [];
  }

  ngOnInit() {
    this.spinner.show();
    if (this.userService.roleMatch(['AdminCafeteria'])  || this.userService.roleMatch(['AsistenteCafeteria']) || this.userService.roleMatch(['AdminRefrigerios'])) {
      this._usuarioService.getEntrega().subscribe(data => {
        if (data['Succes']) {
          this.beneficios = data["beneficios"];   
        }  
        this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Oops...',
          text: respuesta.msg,
        });
        this.spinner.hide(); 
      });
    }

    this._userService.getLoggedUser().subscribe((data:any) => {
      this.usuarioLogueado = (data.email.split("@")[1].indexOf('unimagdalena') != -1) ? data.email.split("@")[0] : data.email;
    }, (err:any) => {
      console.error(err);
    });

    if(this.userService.roleMatch(['Admin', 'Unidad'])){
      this._convocatoriaService.getDatosModuloAyudantia().subscribe((data:DatosModulo) => {
        this.datosModuloAyudantia = Object.assign(data);
      }, (err:any) => {
        console.error(err);
      });
    }
    
    if(this.userService.roleMatch(['AdminMonitorias', 'UnidadMonitorias', 'ComiteMonitorias'])){
      this._convocatoriaService.getDatosModuloMonitoria().subscribe((data:DatosModulo) => {
        this.datosModuloMonitoria = Object.assign(data);
      }, (err:any) => {
        console.error(err);
      });
    }
    
    if(this.userService.roleMatch(['SupervisorAyudante'])){
      this._supervisorService.getDatosModuloSupervisor().subscribe((data:any) => {
        this.datosModuloSupervisor = data;
      }, (err:any) => {
        console.error(err);
      });
    }

    if(this.userService.tipoMatch(['Almuerzos y refrigerios'])){
      this._convocatoriaService.getDatosModuloRefrigerios().subscribe((data:any) => {
        this.datosModuloRefrigerios = data;
      }, (err:any) => {
        console.error(err);
      });
    }
  }

  /**
   * Obtiene el listado de estudiantes postulados en la convocatoria indicada
   * @param convocatoria id de la convocatoria
   */
  getlista(convocatoria:DatosModulo){
    
    this.spinner.show();
    this._convocatoriaService.geDatosEst(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Estudiantes postulados " + convocatoria.titulo.replace(/[.]/g, "_")); this.spinner.hide(); });
    
  }

  /**
   * Obtiene el listado de estudiantes postulados en la convocatoria de refrigerios indicada
   * @param convocatoria id de la convocatoria
   */
  getlistaRefrigerios(convocatoria:DatosModulo){
  
    this.spinner.show();
    this._convocatoriaRefrigerioService.geDatosEst(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Estudiantes postulados " + convocatoria.titulo); this.spinner.hide(); });
    
  }


  getEtapa(convocatoria:DatosModulo, idEtapaActual:number = null):EtapaConvocatoria{
    let today = convocatoria.fecha_actual || Date.now(); 
    return Object.assign([],convocatoria.etapas_convocatorias).filter((item:EtapaConvocatoria) => {return new Date(item.fecha_inicio).getTime() <= today && new Date(item.fecha_fin).getTime() >= today}).shift();
    
  }

  /**
   * Permite saber si una convocatoria se encuentra en una determinada etapa
   * @param dato convocatoria en ejecución
   * @param estado_id estado de la etapa que se quiere verificar
   */
  isEtapa(dato:DatosModulo, estado_id:number, comparacion:string = "="):boolean{
    if(comparacion == "="){
      return dato.etapa_actual.filter(e => e.estado_id == estado_id).length > 0;
    }else if(comparacion == ">="){
      return dato.etapa_actual.filter(e => e.estado_id >= estado_id).length > 0;
    }else if(comparacion == "<"){
      return dato.etapa_actual.filter(e => e.estado_id < estado_id).length > 0;
    }
    
  }

  /**
   * Metodo para generar un excel con el reporte de horas de monitores para los usuarios de comite
   * @param convocatoria 
   */
  reporteHorasEstudianteComite(convocatoria:any){
    this._reportesService.getReporteHorasMonitoresParaComiteEnExcel(convocatoria.id).subscribe(blob=>{ importedSaveAs ( blob, "Reporte de horas de monitores " + convocatoria.titulo+ ".xlsx"); this.spinner.hide(); });
  }



}

class DatosModulo{
  id:number;
  titulo:string;
  puntaje_minino_requerido:number;
  maximo_horas:number;
  estado_control:EstadoControl;
  estado:boolean;
  fecha_expedicion:Date;
  etapas_convocatorias:EtapaConvocatoria[];
  etapa_actual:EtapaConvocatoria[];
  cant_plazas_solicitadas:number;
  cant_plazas_aprobadas:number;
  cant_plazas_preaprobadas:number;
  fecha_actual:Date;
  estaEnEtapaSolicitudDePlazas:boolean;
  // estaEnEtapaSolicitudDePlazas():boolean{
  //   console.log(this.etapa_actual.filter(e => e.estado_id == EtapasAyudantias.SOLICITUD_PLAZAS || e.estado_id == EtapasMonitorias.SOLICITUD_PLAZAS).length > 0);
  //   return this.etapa_actual.filter(e => e.estado_id == EtapasAyudantias.SOLICITUD_PLAZAS || e.estado_id == EtapasMonitorias.SOLICITUD_PLAZAS).length > 0;
  // }
  estaEnEtapaInscripcion():boolean{
    return this.etapa_actual.filter(e => e.estado_id == EtapasAyudantias.INSCRIPCIONES && new Date(e.fecha_inicio).getTime() <= new Date().getTime() && new Date(e.fecha_fin).getTime() >= new Date().getTime()).length > 0;
  }
  estaEnEtapa(estado_id:number):boolean{
    return this.etapa_actual.filter(e => e.estado_id == estado_id).length > 0;
  }

  constructor(){
    this.estado_control = new EstadoControl();
    this.etapas_convocatorias = [];
    this.etapa_actual = [];
    this.estaEnEtapaSolicitudDePlazas = this.etapa_actual.filter(e => e.estado_id == EtapasAyudantias.SOLICITUD_PLAZAS || e.estado_id == EtapasMonitorias.SOLICITUD_PLAZAS).length > 0;
  }

  
}

class EstadoControl{
  id:number;
  nombre:string;
}

class EtapaConvocatoria{
  id:number;
  nombre:string;
  estado_id:number;
  peso:number;
  fecha_inicio:Date;
  fecha_fin:Date;
}

class DatosModuloRefrigerios extends DatosModulo{
  inscritos:number;
  seleccionados:number;
}