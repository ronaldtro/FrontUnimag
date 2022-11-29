import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef, OnDestroy } from '@angular/core';
import { InscritosService } from 'src/app/services/inscritos-refrigerios.service';
import { ActivatedRoute } from '@angular/router';
import { InscripcionRefrigerio, CriteriosSeleccion } from 'src/app/interfaces/inscripcion-estudiante.interfase';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { MessageService } from 'primeng/api';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-criterios-seleccion',
  templateUrl: './criterios-seleccion.component.html',
  styleUrls: ['./criterios-seleccion.component.css'],
  providers: [MessageService]
})
export class CriteriosSeleccionComponent implements OnInit {
  id:number;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);

  errores:any[] = [];

  appliedFilters:any[] = [];

  convocatoria:InscripcionRefrigerio = {};

  criterios:CriteriosSeleccion[] = [];

userService: UserService;
 funciones:FuncionesJSService;

  constructor(private _convocatoriaService:ConvocatoriaRefrigerioService,
    private route:ActivatedRoute,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef ) { this.userService = _userService; this.funciones = funcionesP;}

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._convocatoriaService.getCriteriosSeleleccion(this.id).subscribe(data=>{
        if(data['success']){
          this.convocatoria = data['convocatoria'];
          this.criterios = data['criterios'];
          
          this.initDtOptions();
          this.dtTrigger.next();
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.column(0).visible(false);
            dtInstance.column(1).visible(false);
            dtInstance.column(2).visible(false);
            dtInstance.column(9).visible(false);
            dtInstance.column(12).visible(false);
            dtInstance.column(13).visible(false);
          }); 
          
        }
        this.spinner.hide();
        },      
        err=>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            this.spinner.hide();  
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            }); 
          })
      });
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
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

  initDtOptions(){
    this.dtOptions.order = [[ 4, "asc" ], [ 3, "asc" ], [ 6, "asc" ], [ 2, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      this.funciones.addFilter(this, 5, "#filter-programa");
      this.funciones.addFilter(this, 6, "#filter-beneficio");
      this.funciones.addFilter(this, 8, "#filter-estado");  
      this.funciones.addFilter(this, 9, "#filter-condicion");    
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}
