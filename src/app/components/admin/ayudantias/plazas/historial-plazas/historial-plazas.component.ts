import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, Message } from 'primeng/api';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';


//Servicios
import { PlazaService } from 'src/app/services/plaza.service';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

@Component({
  selector: 'app-historial-plazas',
  templateUrl: './historial-plazas.component.html',
  styleUrls: ['./historial-plazas.component.css'],
  providers :[MessageService, FuncionesJSService]
})
export class HistorialPlazasComponent implements OnInit, AfterViewChecked {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  plazas:any[] = [];
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  errores:Message[]=[];

  userService:UserService;
  constructor(private _plazaService:PlazaService, private messageService: MessageService, private _userService:UserService, private spinner: NgxSpinnerService, private funciones: FuncionesJSService) { this.userService = _userService; }

  ngOnInit() {
    this.spinner.show();
    this._plazaService.getHistorialPlazas().subscribe(data => {
      this.plazas = data['plazas'];
      
      this.initDtOptions();

      this.dtTrigger.next();

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        if(this._userService.roleMatch(['Admin', 'AdminMonitorias'])){
          dtInstance.column(0).visible(false);
        }
        if(this._userService.roleMatch(['Unidad','UnidadMonitorias'])){
          dtInstance.column(0).visible(false);
          dtInstance.column(2).visible(false);
        }
        
        
        //dtInstance.column(6).visible(false);
        //dtInstance.column(7).visible(false);
      }); 


      this.spinner.hide();
    }, err => {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  initDtOptions(){
    if( this._userService.roleMatch(['Admin', 'AdminMonitorias'])){
      this.dtOptions.order = [[5, "desc"], [4, "desc"]];
    }else{
      this.dtOptions.order = [[5, "desc"], [4, "desc"]];
    }
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5]
        }
      }
    ];
    
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }


}
