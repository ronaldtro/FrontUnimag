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
import { DetalleSolicitudAyudaComponent } from '../detalle-solicitud-ayuda/detalle-solicitud-ayuda.component';
import { TiposSolicitud } from 'src/app/class/api';

const IdxCamposExportacion = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]; 
const filtros = [
  {idx: 2, id: "#filter-sexo"},
  {idx: 3, id: "#filter-tipoDoc"},
  {idx: 5, id: "#filter-estrato"},
  {idx: 6, id: "#filter-departamento"},
  {idx: 7, id: "#filter-municipio"},
  {idx: 13, id: "#filter-facultad"},
  {idx: 14, id: "#filter-programa"},
  {idx: 15, id: "#filter-colegio"},
  {idx: 21, id: "#filter-rapimercar"}
];

@Component({
  selector: 'app-listado-rechazadas',
  templateUrl: './listado-rechazadas.component.html',
  styleUrls: ['./listado-rechazadas.component.css']
})
export class ListadoRechazadasComponent implements OnInit {

  estudiantes:any[];
  solicitudesAprobadas:any[];
  estudianteSeleccionado:any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<any>;

  @ViewChild(DetalleSolicitudAyudaComponent) detalleSolicitudReference : DetalleSolicitudAyudaComponent;

  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  dtOptionsAprobadas: any = Object.assign({}, DTConfig.dtConf);
  dtTrigger: Subject<string> = new Subject();
  dtTriggerAprobadas: Subject<string> = new Subject();
  funciones:FuncionesJSService;

  appliedFilters:any[] = [];
  componente:any;

  constructor(private condicionesService:CondicionService, private spinner: NgxSpinnerService, private _funciones: FuncionesJSService, private _userService: UserService) { 
    this.estudiantes = [];
    this.solicitudesAprobadas = [];
    this.funciones = _funciones;
    this.componente = this;
  }

  ngOnInit() {
    this.spinner.show();
    this.condicionesService.getEstudiantesConAyudas(TiposSolicitud.RECHAZADO).subscribe((data:any[]) => {
      this.estudiantes = [...data.filter((item) => item.verificado == false)];
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
    this.funciones.reemplazarBotonesDatatable();
  }

  initDtOptions(dtElement:any, dtOptions:any, IdxCamposExportacion:number[], filtros:any[]){
    //this.dtOptions.order = [[ 0, "desc" ]];
    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(2).visible(false);
      dtInstance.column(3).visible(false);
      dtInstance.column(4).visible(false);
      dtInstance.column(6).visible(false);
      dtInstance.column(7).visible(false);
      dtInstance.column(9).visible(false);
      dtInstance.column(10).visible(false);
      
      for(let i = 12; i <= 20; i++){
        dtInstance.column(i).visible(false);
      }

      if(this._userService.roleMatch(['Unidad'])){
        dtInstance.column(22).visible(false);
        dtInstance.column(23).visible(false);
        dtInstance.column(24).visible(false);
      }   

    });

    dtOptions.dom = "Bfrtip";
    dtOptions.retrieve = true;
    dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: IdxCamposExportacion
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: IdxCamposExportacion
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
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


  modalDetalles(estudiante:any){
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
