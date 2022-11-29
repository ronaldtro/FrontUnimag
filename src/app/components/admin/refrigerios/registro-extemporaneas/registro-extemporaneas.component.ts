import { Component, AfterViewChecked, OnInit, ViewChild,  } from '@angular/core';
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
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';

@Component({
  selector: 'app-registro-extemporaneas',
  templateUrl: './registro-extemporaneas.component.html',
  styleUrls: ['./registro-extemporaneas.component.css']
})

export class RegistroExtemporaneasComponent implements OnInit,  AfterViewChecked {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  id: any;
  registroExtemporaneas:any = [];
  appliedFilters:any[] = [];

  constructor(
    private _reporteExtemporaneas: ConvocatoriaRefrigerioService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute, 
    private _location: Location,  
    private funcionesP: FuncionesJSService
  ) {this.funciones = funcionesP; }

  
  ngOnInit() {   
    this.spinner.show();
    this.route.params.subscribe(params => {
      
      this._reporteExtemporaneas.getRegistroExtemporaneas().subscribe(data=>{        
        this.registroExtemporaneas = data['registro_extemporaneas'];
         this.initDtOptions();
         this.dtTrigger.next(); 
          
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
    this.dtOptions.order = [[ 0, "desc" ]];
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
          columns: [0,1,2,3,4,]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1,2,3,4,]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
        this.funciones.addFilter(this, 0, "#filter-fecha"); 
        this.funciones.addFilter(this, 1, "#filter-convocatoria"); 
        this.funciones.addFilter(this, 3, "#filter-beneficio"); 
    }; 

  }


  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }
  backClicked() {
    this._location.back();
  }

}
