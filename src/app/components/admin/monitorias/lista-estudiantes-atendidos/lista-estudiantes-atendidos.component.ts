import { Component, OnInit, ViewChild } from '@angular/core';
import { ComiteMonitoriasService } from 'src/app/services/comite-monitorias.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Convocatoria } from 'src/app/interfaces/Convocatorias.interface';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { EnviarCorreoEncuestas } from 'src/app/class/api';

const IdxCamposExportacion = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
const filtros = [
  {idx: 3, id: "#filter-programa"},
  {idx: 5, id: "#filter-monitor"},
  {idx: 6, id: "#filter-plaza"},
  
];

@Component({
  selector: 'app-lista-estudiantes-atendidos',
  templateUrl: './lista-estudiantes-atendidos.component.html',
  styleUrls: ['./lista-estudiantes-atendidos.component.css']
})
export class ListaEstudiantesAtendidosComponent implements OnInit {
  id:number;
  convocatoria:Convocatoria;
  estudiantes:any[];

  funciones:FuncionesJSService;
  appliedFilters:any[] = [];
  codigosSeleccionados:any[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private monitoriasService:ComiteMonitoriasService, private _userService: UserService, private _comiteMonitoriaService:ComiteMonitoriasService, private _funciones: FuncionesJSService, private route:ActivatedRoute, private spinner: NgxSpinnerService) {
    this.funciones = _funciones;
    this.codigosSeleccionados = [];
    route.params.subscribe(parametros => {
      
      this.id = parametros['id'];
      this.estudiantes = [];
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.monitoriasService.getEstudiantesAtendidosPorConvocatoria(this.id).subscribe((resp:any) => {
      console.log(resp.success);
      if(resp.success){
        this.convocatoria = resp.data.convocatoria;
        this.estudiantes = resp.data.estudiantes;
        this.dtTrigger.next(); 

        this.initDtOptions(this.dtElement, this.dtOptions, IdxCamposExportacion, filtros);

      }else{
        swal("Error", resp.message, "error");
      }
      this.spinner.hide();
    }, (err:HttpErrorResponse) => {
      console.log(err);
      swal("Error de servidor", err.error, "error");
      this.spinner.hide();
    })
  }

  initDtOptions(dtElement:any, dtOptions:any, IdxCamposExportacion:number[], filtros:any[]){
    this.dtOptions.order = [[ 10, "desc" ]];

    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                     
      dtInstance.column(3).visible(false);
      dtInstance.column(4).visible(false);
      dtInstance.column(9).visible(false);
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

  /**
   * Método para enviar encuestas a estudiantes seleccionados
   */
  enviarEncuesta() {
    if(!this.codigosSeleccionados.length){
      
      return;
    }
    
    for(let i = 0; i < this.codigosSeleccionados.length; i++){
      let enviarCorreoEncuestas:EnviarCorreoEncuestas = new EnviarCorreoEncuestas(this.codigosSeleccionados[i].plaza_convocatoria_estudiante_id, [this.codigosSeleccionados[i].codigo_estudiante]);
      this.spinner.show();
      this._comiteMonitoriaService.enviarCorreoEncuestas(enviarCorreoEncuestas).subscribe((data:any) => {
        
        //this.estudiantes[this.estudiantes.findIndex(e => e.plaza_convocatoria_estudiante_id == this.codigosSeleccionados[i].plaza_convocatoria_estudiante_id && e.codigo_estudiante == this.codigosSeleccionados[i].codigo_estudiante)].ultimo_token = data.tokens[data.tokens.findIndex(t => t.plaza_convocatoria_estudiante_id == this.codigosSeleccionados[i].plaza_convocatoria_estudiante_id && t.codigo == this.codigosSeleccionados[i].codigo_estudiante)].token;
        if(data["success"]){
          this.estudiantes[this.estudiantes.findIndex(e => e.plaza_convocatoria_estudiante_id == this.codigosSeleccionados[i].plaza_convocatoria_estudiante_id && e.codigo_estudiante == this.codigosSeleccionados[i].codigo_estudiante)].tiene_token = 1;
          if(i == this.codigosSeleccionados.length - 1){
            swal({
              title: "Realizado",
              text: "Se ha enviado la encuesta a los correos electrónicos de los estudiantes seleccionados.",
              type: "success",
              timer: 1500,
              showConfirmButton: false
            });  
            this.codigosSeleccionados = [];
          }
          
        }else{
          
        }
        this.spinner.hide();
      }, (err:HttpErrorResponse) => {
        swal("Error", err.error, "error");
        this.spinner.hide();
      })
    }

    
    
  }

}
