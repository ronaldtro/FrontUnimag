import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { CondicionService } from 'src/app/services/condicion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { CambiosAsignacionAyuda, TiposSolicitud } from 'src/app/class/api';
import { DetalleSolicitudAyudaComponent } from '../detalle-solicitud-ayuda/detalle-solicitud-ayuda.component';
import { NgForm } from '@angular/forms';

declare var $:any;

const IdxCamposExportacion = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const filtros = [
  {idx: 3, id: "#filter-sexo"},
  {idx: 4, id: "#filter-tipoDoc"},
  {idx: 6, id: "#filter-estrato"},
  {idx: 7, id: "#filter-departamento"},
  {idx: 8, id: "#filter-municipio"},
  {idx: 14, id: "#filter-facultad"},
  {idx: 15, id: "#filter-programa"},
  {idx: 16, id: "#filter-colegio"},
  {idx: 22, id: "#filter-rapimercar"}
];
const maxCantCodigos = 50;

@Component({
  selector: 'app-listado-pendientes',
  templateUrl: './listado-pendientes.component.html',
  styleUrls: ['./listado-pendientes.component.css']
})
export class ListadoPendientesComponent implements OnInit {

  estudiantes:any[];
  solicitudesAprobadas:any[];
  estudianteSeleccionado:any;
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<any>;

  @ViewChild(DetalleSolicitudAyudaComponent) detalleSolicitudReference : DetalleSolicitudAyudaComponent;

  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  userService:UserService;
  cambio:CambiosAsignacionAyuda;
  codigosSeleccionados:string[];

  appliedFilters:any[] = [];
  componente:any;
  codigoDataForm:CambiosAsignacionAyuda;
  codigosInvalidos:string[];

  constructor(private condicionesService:CondicionService, private spinner: NgxSpinnerService, private _funciones: FuncionesJSService, private _userService: UserService) { 
    this.estudiantes = [];
    this.solicitudesAprobadas = [];
    this.funciones = _funciones;
    this.componente = this;
    this.userService = _userService;
    this.cambio = new CambiosAsignacionAyuda();
    this.codigosInvalidos = [];
    this.codigosSeleccionados = [];
  }

  ngOnInit() {
    this.spinner.show();
    this.condicionesService.getEstudiantesConAyudas(TiposSolicitud.SOLICITADO).subscribe((data:any[]) => {
      this.estudiantes = [...data.filter((item) => item.verificado == null)];
      this.dtTrigger.next();
            
      this.initDtOptions(this.dtElement, this.dtOptions, IdxCamposExportacion, filtros);


      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    });
  }
  
  /**
   * Metodo para cambiar el estado de una solicitud de ayuda de un estudiante.
   * @param estudiante estudiante a modificar el estado
   * @param estado estado a asignar al estudiante
   */
  cambiarEstado(estudiante:any, estado:boolean){
    if( estado){
      
      this.cambio = new CambiosAsignacionAyuda();
    } 
    let title = estado ? 'Aprobar' : 'Rechazar';
    swal({
      title: title + ' solicitud de ayuda',
      text: '¿Está seguro de realizar esta acción?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons:true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((res) => {
      if (res.value) {
        
        this.cambio.estado = estado;
        this.enviarCambioEstado(estudiante, this.cambio);
      }
    });
  }

  /**
   * Metodo para enviar la información a almacenar del cambio de estado de la asignación del estudiante
   * @param estudiante estudiante al que se le cambiara el estado
   * @param cambio datos de cambio de asignación de ayuda
   */
  enviarCambioEstado(estudiante:any, cambio:CambiosAsignacionAyuda):void{
    this.spinner.show();
    this.condicionesService.verificarRegistroAyuda(estudiante.id_estudiante_beneficio, cambio).subscribe((data:any) => {
      if(data["success"]){
        estudiante.verificado = cambio.estado;
        this.estudiantes = [...this.estudiantes.filter((item) => item.verificado == null)];
        this.rerender();
        swal("Acción realizada","Se ha cambiado el estado correctamente.","success");
      }else{
        swal("Error", data["message"], "error");
      }
      this.spinner.hide();
      if(!cambio.estado) $("#observacionModal").modal("hide");
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    })
  }

  /***
   * Abrir modal para agregar observación
   * @param estudiante estudiante a rechazar
   */
  abrirModalObservacion(estudiante:any):void{
    this.cambio = new CambiosAsignacionAyuda();
    this.estudianteSeleccionado = estudiante;
    $("#observacionModal").modal("show");
  }

  /**
   * Metodo para guardar la observación al momento de rechazar una solicitud
   * @param form formulario para envio de observación
   */
  guardarObservacionDeRechazo(form:NgForm):void{
    if(!form.valid){
      return;
    }
    this.cambiarEstado(this.estudianteSeleccionado, false);
  }

  /**
   * Permite abrir el modal para cambiar el estado por códigos
   */
  abrirModalCodigosMultiples():void{
    this.codigoDataForm = new CambiosAsignacionAyuda();
    if(this.codigosSeleccionados.length > 0) this.codigoDataForm.codigo = this.codigosSeleccionados.join(",");
    this.codigosInvalidos = [];
    $("#codigosModal").modal("show");
  }

  /**
   * Metodo que permite realizar el cambio de estado por codigos de estudiante
   * @param form formulario para cambio de estado
   */
  cambiarEstadoPorCodigos(form:NgForm):void{
    if(!form.valid) return;
    let codigosValidos:string[] = this.codigoDataForm.codigo.match(/\d{10,12}/g);
    if(codigosValidos.length == 0){
      swal("Error","Debe ingresar al menos un código válido para realizar la consulta", "error");
      return;
    }
    if(codigosValidos.length > maxCantCodigos){
      swal("Error","Ha insertado más de " + maxCantCodigos + " códigos", "warning");
      return;
    }
    this.codigosInvalidos = [];
    for(let i = 0; i < codigosValidos.length; i++){
      if(this.estudiantes.findIndex(e => e.codigo == codigosValidos[i]) == -1){
        this.codigosInvalidos.push(codigosValidos[i]);
      }
      
    }
    if(this.codigosInvalidos.length > 0) return;

    let estudiantesBeneficio:CambiosAsignacionAyuda = new CambiosAsignacionAyuda();
    estudiantesBeneficio.codigos = codigosValidos;
    estudiantesBeneficio.fecha = this.codigoDataForm.fecha;
    estudiantesBeneficio.observacion = this.codigoDataForm.observacion;
    estudiantesBeneficio.estado = this.codigoDataForm.estado;
    this.spinner.show();
    this.condicionesService.verificarRegistroMultipleAyuda(estudiantesBeneficio).subscribe((data:any) => {
      if(data["success"]){
        for(let i = 0; i < this.estudiantes.length; i++){
          this.estudiantes[i].verificado = true;
        }
        $("#codigosModal").modal("hide");
        swal("Acción exitosa", "Se ha registrado el cambio de estado de las solicitudes correspondientes a los códigos ingresados", "success");
        for(let i = 0; i < codigosValidos.length; i++){
          this.estudiantes.splice(this.estudiantes.findIndex(elem => elem.codigo == codigosValidos[i]),1);
        }
        this.codigosSeleccionados = [];
        this.rerender();
      }else{
        swal("Error", data.message, "error");
      }
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    })
  }

  

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

      this.initDtOptions(this.dtElement, this.dtOptions, IdxCamposExportacion, filtros);

      dtInstance.columns.adjust().draw();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewChecked(): void {
    //this.funciones.reemplazarBotonesDatatable();
  }

  initDtOptions(dtElement:any, dtOptions:any, IdxCamposExportacion:number[], filtros:any[]){
    //this.dtOptions.order = [[ 0, "desc" ]];

    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      if(this._userService.roleMatch(['Unidad', 'RegistroAyudas'])){
        dtInstance.column(0).visible(false);
      }
      
      dtInstance.column(3).visible(false);
      dtInstance.column(4).visible(false);
      dtInstance.column(5).visible(false);
      dtInstance.column(6).visible(false);
      dtInstance.column(7).visible(false);
      dtInstance.column(8).visible(false);
      dtInstance.column(10).visible(false);
      dtInstance.column(11).visible(false);
      dtInstance.column(12).visible(false);
      
      for(let i = 13; i <= 21; i++){
        dtInstance.column(i).visible(false);
      }

      if(this._userService.roleMatch(['Unidad', 'RegistroAyudas'])){
        dtInstance.column(23).visible(false);
      }   

    });

    dtOptions.dom = "Bfrtip";
    dtOptions.retrieve = true;
    dtOptions.buttons = [
      {
        extend: 'copy',
        text: '<span class="far fa-copy"></span><span class="sr-only">Copiar</span>',
        exportOptions: {
          columns: IdxCamposExportacion
        }
      },
      {
        extend: 'print',
        text: '<span class="fas fa-print"></span><span class="sr-only">Imprimir</span>',
        exportOptions: {
          columns: IdxCamposExportacion
        }
      },
      {
        extend: 'excel',
        text: '<span class="far fa-file-excel"></span><span class="sr-only">Excel</span>',
        exportOptions: {
          columns: IdxCamposExportacion
        }
      }
    ];
    dtOptions.stateSave = false;
    if(filtros != null){
      dtOptions.initComplete = () => {
      
        //let idx = 0;
        for(let i = 0; i < filtros.length; i++){
          this.funciones.addFilterSpecific(this, dtElement, filtros[i].idx, filtros[i].id);
        }
             
      } 
    }
    
  }


  modalDetalles(estudiante){
    this.detalleSolicitudReference.show(estudiante);
  }

  verificarRegistro(estudiante:any):void{
    swal({
      title: 'Validar solicitud de ayuda',
      text: '¿Está seguro de realizar esta acción?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons:true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((res) => {
      if (res.value) {

      }else{
        estudiante.verificado != estudiante.verificado;
      }
    });
  }

}

/**
 * Interfaz para manipular el cambio de estado por codigos
 */
class CodigosMultiples{
  codigos:string;
  estado:boolean;
  observacion:string;
}
