import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
import { ProfesionalSaludService } from 'src/app/services/profesionalSalud.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs-compat';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Location } from '@angular/common';



declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-agenda-citas-diarias',
  templateUrl: './agenda-citas-diarias.component.html',
  styleUrls: ['./agenda-citas-diarias.component.css'],
  providers:[MessageService]

})
export class AgendaCitasDiariasComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;

  id: number = 0;
  citas:any[]=[];
  dateNow:Date;
  fecha:any = {
    fecha_dia:null,  
  }

  constructor(
    private _agendaDiaria : ProfesionalSaludService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,  
    private _location: Location,  
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
 
     ) 
    { 
      this.funciones = funcionesP;
    }

  ngOnInit() {   
    this.dateNow =  new Date();  
    this.fecha.fecha_dia = this.dateNow;
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this._agendaDiaria.agendaDiaraia(this.id).subscribe(data=>{        
        this.citas=data['Horario_profesional'];
   
   
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



    // this.dtOptions.order = [[ 0, "desc" ]];

  initDtOptions(){    
    this.dtOptions.order = [[ 4, "desc" ], [ 2, "desc" ]];
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
          columns: [0,1,2,3,4]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1,2,3,4]
        }
      }
    ];

    // this.dtOptions.stateSave = false;
    // this.dtOptions.initComplete = () => {
    //     this.funciones.addFilter(this, 4, "#filter-profesional"); 
    //     this.funciones.addFilter(this, 5, "#filter-servicio"); 
    //     this.funciones.addFilter(this, 6, "#filter-estado"); 
    // }; 

  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
    // $('[data-toggle="tooltip"]').tooltip();
  }

  
backClicked() {
  this._location.back();
}


}
