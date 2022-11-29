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
import { NgForm } from '@angular/forms';
import { DetalleSolicitudAyudaComponent } from '../detalle-solicitud-ayuda/detalle-solicitud-ayuda.component';

declare var $:any;

const IdxCamposExportacion = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]; 
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

@Component({
  selector: 'app-listado-aprobadas',
  templateUrl: './listado-aprobadas.component.html',
  styleUrls: ['./listado-aprobadas.component.css']
})
export class ListadoAprobadasComponent implements OnInit {

  estudiantes:any[];
  solicitudesAprobadas:any[];
  estudianteSeleccionado:any;
  cambioSeleccionado:CambiosAsignacionAyuda;
  envio:CambiosAsignacionAyuda;
  codigosSeleccionados:string[];
  codigosInvalidos:string[];
  codigosSinEntrega:string[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<any>;

  @ViewChild(DetalleSolicitudAyudaComponent) detalleSolicitudReference : DetalleSolicitudAyudaComponent;

  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  userService:UserService;

  appliedFilters:any[] = [];
  componente:any;

  constructor(private condicionesService:CondicionService, private spinner: NgxSpinnerService, private _funciones: FuncionesJSService, private _userService: UserService) { 
    this.estudiantes = [];
    this.solicitudesAprobadas = [];
    this.funciones = _funciones;
    this.componente = this;
    this.userService = _userService;
    this.cambioSeleccionado = new CambiosAsignacionAyuda();
    this.envio = new CambiosAsignacionAyuda();
    this.codigosSeleccionados = [];
    this.codigosInvalidos = [];
    this.codigosSinEntrega = [];
  }

  ngOnInit() {
    this.spinner.show();
    this.condicionesService.getEstudiantesConAyudas(TiposSolicitud.APROBADO).subscribe((data:any[]) => {
      this.estudiantes = [...data.filter((item) => item.verificado == true)];
      this.dtTrigger.next();

      this.initDtOptions(this.dtElement, this.dtOptions, IdxCamposExportacion, filtros);

      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
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
      },
      {
        extend: 'excel',
        text: '<span class="far fa-file-excel"></span> <span class="small">Rapimercar</span>',
        exportOptions: {
          columns: [4, 5, 2, 22]
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

  modalDetalles(estudiante:any):void{
    this.estudianteSeleccionado = {...estudiante};
  }

  /**
   * Metodo para abrir modal de envios
   */
  abrirModalEnvio(){
    this.envio = new CambiosAsignacionAyuda();
    this.envio.fecha = new Date();
    this.envio.seleccion = this.codigosSeleccionados.length > 0;
    this.codigosInvalidos = [];
    //this.codigosSinEntrega = this.estudiantes.filter(est => this.codigosSeleccionados.includes(est.codigo) && (est.envios.fecha_envio == this.envio.fecha && est.envios.fecha == null)).map(est => est.codigo);
    //console.log(this.codigosSinEntrega);
    if(this.codigosSeleccionados.length > 0) this.envio.codigo = this.codigosSeleccionados.join(",");
    $("#envioModal").modal("show");
  }

  registrarEnvio(form:NgForm):void{
    if(!form.valid){
      return;
    }
    if(this.envio.codigo != undefined){
      let codigosValidos:string[] = this.envio.codigo.match(/\d{10,12}/g);
      if(codigosValidos.length == 0){
        swal("Error","Debe ingresar al menos un código válido para realizar la consulta", "error");
        return;
      }
      this.codigosInvalidos = [];
      for(let i = 0; i < codigosValidos.length; i++){
        if(this.estudiantes.findIndex(e => e.codigo == codigosValidos[i]) == -1){
          this.codigosInvalidos.push(codigosValidos[i]);
        }
        
      }
      if(this.codigosInvalidos.length > 0) return;
      this.envio.codigos = codigosValidos;
      this.envio.codigo = null;
    }
    this.spinner.show();
    console.log(this.envio.fecha);
    this.condicionesService.registrarEnvioMultipleAyuda(this.envio).subscribe((data:any) => {
      if(data["success"]){
        for(let i = 0; i < data.envios.length; i++){
          this.estudiantes[this.estudiantes.findIndex(e => e.id == data.envios[i].id)].envios = [...data.envios[i].envios];
        }
        $("#envioModal").modal("hide");
        this.codigosSeleccionados = [];
        swal("Acción exitosa", "Se registrado el envío del listado de las solicitudes aprobadas en el sistema", "success");
      }else{
        swal("Error", data.message, "error");
      }
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    })
  }

  /**
   * Metodo que permite visualizar el modal para registrar entregas
   * @param estudiante estudiante a registrar entrega
   */
  abrirModalEntrega(estudiante?:any){
    
    
    this.cambioSeleccionado = new CambiosAsignacionAyuda();
    this.cambioSeleccionado.estudiante_beneficio_id = estudiante.id_estudiante_beneficio;
    this.cambioSeleccionado.fecha = new Date();

    if(estudiante){
      this.estudianteSeleccionado = estudiante;
      if(this.estudianteSeleccionado.envios.length == 1) this.cambioSeleccionado.id_entrega_beneficio = this.estudianteSeleccionado.envios[0].id;
    }
    $("#exampleModal").modal("show");
  }

  registrarEntrega(form:NgForm){
    if(!form.valid){
      return;
    }
    this.spinner.show();
    this.condicionesService.registrarEntregaAyuda(this.cambioSeleccionado.id_entrega_beneficio, this.cambioSeleccionado).subscribe((data:any) => {
      if(data["success"]){
        $("#exampleModal").modal("hide");
        this.estudianteSeleccionado.envios[this.estudianteSeleccionado.envios.findIndex(env => env.id == this.cambioSeleccionado.id_entrega_beneficio)] = Object.assign(data.envio);
        this.estudianteSeleccionado.entregas.push(data.envio);
        swal("Entrega registrada", "Se ha registrado correctamente la entrega.", "success");
      }else{
        swal("Error", data.message, "error");
      }
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    });
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

  abrirModalDetalles(estudiante){
    this.detalleSolicitudReference.show(estudiante);
  }

  /**
   * Metodo para cambiar el estado de una solicitud de ayuda de un estudiante.
   * @param estudiante estudiante a modificar el estado
   * @param estado estado a asignar al estudiante
   */
  retirarAyuda(estudiante:any){
    
    let cambio = new CambiosAsignacionAyuda();
    
    swal({
      title: 'Excluir estudiante',
      text: 'El registro podrá visualizarse en el listado solicitudes realizadas',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons:true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((res) => {
      if (res.value) {
        
        cambio.estado = null;
        this.spinner.show();
        this.condicionesService.verificarRegistroAyuda(estudiante.id_estudiante_beneficio, cambio).subscribe((data:any) => {
          if(data["success"]){
            estudiante.verificado = cambio.estado;
            this.estudiantes = [...this.estudiantes.filter((item) => item.verificado == true)];
            //this.rerender();
            swal("Acción realizada","Se ha retirado la ayuda correctamente.","success");
          }else{
            swal("Error", data["message"], "error");
          }

          this.spinner.hide();
        }, (err:HttpErrorResponse) => {
          swal("Error de servidor", err.error, "error");
          this.spinner.hide();
        })
      }
    });
  }

}
