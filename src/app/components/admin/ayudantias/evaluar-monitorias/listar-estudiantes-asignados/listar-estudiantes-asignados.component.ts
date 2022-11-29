import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { SupervisorService } from 'src/app/services/supervisor.service';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'src/app/class/api';
import { UserService } from 'src/app/services/user.service';
declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-listar-estudiantes-asignados',
  templateUrl: './listar-estudiantes-asignados.component.html',
  styleUrls: ['./listar-estudiantes-asignados.component.css']
})
export class ListarEstudiantesAsignadosComponent implements OnInit, AfterViewChecked {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  
  api:string = Api.dev;
  estudiantes: any = [];
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  urlDoc: string;

  constructor(private _supervisorService: SupervisorService, private userService: UserService, private spinner: NgxSpinnerService, private elementRef: ElementRef, private funciones: FuncionesJSService) { }

  ngOnInit() {
    this.spinner.show();
    this._supervisorService.getDatosEvaluador().subscribe(data => {
      
      this.estudiantes = data['estudiantes'];
      this.initDtOptions();
      this.dtTrigger.next();
      this.spinner.hide();
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });
  }
  initDtOptions(){
    this.dtOptions.order = [[ 0, "asc" ]];
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
          columns: [1, 2, 3, 4, 5, 6, 7]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7]
        }
      }
    ];
    
  }

  viewDoc( doc:string ){
    this.urlDoc = doc;
    $('#modelId').modal('show');
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
    
  }

  ngAfterViewInit(){
    
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

}
