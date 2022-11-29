import { Component, OnInit ,ViewChild, ViewChildren, QueryList} from '@angular/core';
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
import { AtencionService } from 'src/app/services/atencion.service';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers:[MessageService]
})
export class AgendaComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  // dtOptionsMultiple: DataTables.Settings[] = [Object.assign({},DTConfig.dtConf),Object.assign({},DTConfig.dtConf)]
  dtOptions: any = Object.assign({},DTConfig.dtConf) ;
  dtTrigger: Subject<string> = new Subject();

  appliedFilters:any[] = [];
  funciones: FuncionesJSService;
  id: Number = 0;

  Horario:any[]=[];

  atenciones:any[]=[];

  atencionesProgramadas: any[] = [];
  atencionesNoProgramadas: any[] = [];

  estadoTab:number = 0;

  // dateNow:Date;
  // fecha:any = {
  //   fecha_dia:null,  
  // }

  constructor(
    private _agenda : ProfesionalSaludService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,  
    private _location: Location,  
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
    private _atencionService : AtencionService,
 
     ) 
    { 
      this.funciones = funcionesP;
    }

    ngOnInit() {   
      // this.dateNow =  new Date();  
      //this.fecha.fecha_dia = this.dateNow;
      this.spinner.show();
      this.route.params.subscribe(params => {
        this.id = params["id"];
        this._agenda.agenda(this.id).subscribe(data=>{        
          this.atenciones=data['atenciones'];
          this.Horario=data['Horario'];
          this.atencionesProgramadas = Object.assign({},data['Horario']);

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

        this._atencionService.getAtencionesNoProgramadas(this.id).subscribe( resp =>{
          this.atencionesNoProgramadas = []; 
        });

      }) ; 
      
    }

    initDtOptions(){    
      this.dtOptions.order = [[ 1, "desc" ]];
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
            columns: [0,1,2,3]
          }
        },
        { 
          extend: 'excel',
          text: 'Excel',
          exportOptions: {
            columns: [0,1,2,3]
          }
        }
      ];
      this.dtOptions.stateSave = false;
      this.dtOptions.initComplete = () => {    
        this.funciones.addFilter(this,1,"#filter-fecha")
        this.funciones.addFilter(this,3,"#filter-estado")

      }; 
  
    }

    initDtOptions2(){    
      this.dtOptions.order = [[ 1, "desc" ]];
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
            columns: [0,1,2,3]
          }
        },
        { 
          extend: 'excel',
          text: 'Excel',
          exportOptions: {
            columns: [0,1,2,3]
          }
        }
      ];
      this.dtOptions.stateSave = false;
      this.dtOptions.initComplete = () => {    
        this.funciones.addFilter(this,1,"#filter-fecha")

      }; 
  
    }


    rerender( estadoActualTab: number ){
      this.dtElement.dtInstance.then( (dtInstance:DataTables.Api) => {

          dtInstance.destroy();

          if(estadoActualTab == 0){
            this.initDtOptions()
          }
          if(estadoActualTab == 1){
            this.initDtOptions2()
          }

          this.dtTrigger.next();

      });
      
    }
  
    ngAfterViewChecked(): void {
      this.funciones.reemplazarBotonesDatatable();    
    }
      
    backClicked() {
      this._location.back();
    }

    mostrarAtencionesCitas(){
      this.estadoTab = 0;
      this.Horario = [];
      this.Horario = Object.assign([],this.atencionesProgramadas);

      this.rerender(0);
    }

    mostrarAtencionesNoProgramadas(){
      this.estadoTab = 1;
      
      this.Horario = Object.assign([],this.atencionesNoProgramadas);

      this.rerender(1);
    }

}
