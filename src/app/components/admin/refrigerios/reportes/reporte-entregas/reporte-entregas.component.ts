import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
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

@Component({
  selector: 'app-reporte-entregas',
  templateUrl: './reporte-entregas.component.html',
  styleUrls: ['./reporte-entregas.component.css']
})
export class ReporteEntregasComponent implements OnInit,  AfterViewChecked {
 

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  appliedFilters:any[] = [];
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  id: any;
  reportes:any = [];
  constructor(
    private _reporteEntregas: CafeteriaService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,  
    private _location: Location,  
    private funcionesP: FuncionesJSService
  ) {this.funciones = funcionesP; }

  
  ngOnInit() {   

    
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._reporteEntregas.getReporte(this.id).subscribe(data=>{        
        this.reportes = data['reportes'];
         this.initDtOptions();
         this.dtTrigger.next(); 
          
     this.spinner.hide()
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
     
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        }); 
        this.spinner.hide();   
      });

    })   
  }




  initDtOptions(){    
    this.dtOptions.order = [[ 2, "desc" ], [ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar'
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0,1,2,3,4,5,6,7,8]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1,2,3,4,5,6,7,8]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 0, "#filter-tipoBeneficio"); 
      this.funciones.addFilter(this, 2, "#filter-fecha"); 
    
    }; 

  }


  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  backClicked() {
    this._location.back();
  }


}
