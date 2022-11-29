import { Component, OnInit, ViewChild,  AfterViewChecked } from '@angular/core';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { DataTableDirective } from 'angular-datatables';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs-compat/Subject';
import { NgxSpinnerService } from 'ngx-spinner';
import { CafeteriaService } from 'src/app/services/cafeterias.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

const COLUMNAS_A_EXPORTAR = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];


@Component({
  selector: 'app-reporte-entregas-estudiantes',
  templateUrl: './reporte-entregas-estudiantes.component.html',
  styleUrls: ['./reporte-entregas-estudiantes.component.css']
})
export class ReporteEntregasEstudiantesComponent implements OnInit,  AfterViewChecked {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  id: any;
  reportesEstudiantes:any = [];
  appliedFilters:any[] = [];
  constructor(
    private _reporteEntregasEstudiantes: CafeteriaService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute, 
    private _location: Location,  
    private funcionesP: FuncionesJSService
  ) {this.funciones = funcionesP; }

  
  ngOnInit() {   
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._reporteEntregasEstudiantes.getReporteEstudiantes(this.id).subscribe(data=>{        
        this.reportesEstudiantes = data['reportes_estudiantes'];
         
         this.dtTrigger.next(); 
         this.initDtOptions();
          
     this.spinner.hide()
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });    
      });

    })   
  }


  initDtOptions(){   
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
     
      dtInstance.column(1).visible(false);
      
      dtInstance.column(2).visible(false);
      dtInstance.column(4).visible(false);
      dtInstance.column(5).visible(false);
      dtInstance.column(7).visible(false);
      dtInstance.column(8).visible(false);
      dtInstance.column(9).visible(false);
      dtInstance.column(10).visible(false);
      

    });
    
    this.dtOptions.order = [[ 4, "desc" ], [ 2, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: COLUMNAS_A_EXPORTAR
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: COLUMNAS_A_EXPORTAR
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: COLUMNAS_A_EXPORTAR
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 1, "#filter-programa"); 
      this.funciones.addFilter(this, 4, "#filter-facultad");
      this.funciones.addFilter(this, 6, "#filter-beneficio");  
      this.funciones.addFilter(this, 9, "#filter-seleccion"); 
      this.funciones.addFilter(this, 10, "#filter-condicion"); 
      
    
    }; 

  }


  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }
  backClicked() {
    this._location.back();
  }

}
