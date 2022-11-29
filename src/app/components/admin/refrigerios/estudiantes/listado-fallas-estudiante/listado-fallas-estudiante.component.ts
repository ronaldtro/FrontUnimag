import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Api } from 'src/app/class/api';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { EstudiantesService } from 'src/app/services/estudiantes.service';

declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-listado-fallas-estudiante',
  templateUrl: './listado-fallas-estudiante.component.html',
  styleUrls: ['./listado-fallas-estudiante.component.css']
})
export class ListadoFallasEstudianteComponent implements OnInit {

  id:number;
  index:number;
  api:string = Api.dev;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);

  errores:any[] = [];
  appliedFilters:any[] = [];
  fallas:any[] = [];

  userService: UserService;
  funciones:FuncionesJSService;

  constructor(private _estudiantesService: EstudiantesService,
    private route:ActivatedRoute,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef ) { this.userService = _userService; this.funciones = funcionesP;}

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._estudiantesService.getListadoFallasEstudiante(this.id).subscribe(data=>{
        if(data['success']){
          this.fallas = data['fallas'];
          this.initDtOptions();
          this.dtTrigger.next();
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
    this.dtOptions.order = [[ 0, "asc" ], [ 1, "asc" ], [ 3, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 2, 3]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 2, 3]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 1, "#filter-beneficio");
      this.funciones.addFilter(this, 2, "#filter-dia");
      this.funciones.addFilter(this, 3, "#filter-fecha");      
    }
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}
