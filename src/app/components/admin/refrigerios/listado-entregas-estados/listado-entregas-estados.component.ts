import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { InscritosService } from 'src/app/services/inscritos-refrigerios.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
declare var $: any;
declare var jQuery:any;
@Component({
  selector: 'app-listado-entregas-estados',
  templateUrl: './listado-entregas-estados.component.html',
  styleUrls: ['./listado-entregas-estados.component.css']
})
export class ListadoEntregasEstadosComponent implements OnInit {
  id:number;
  userService: UserService;
 funciones:FuncionesJSService;
 @ViewChild(DataTableDirective)
 dtElement: DataTableDirective;
 dtTrigger: Subject<any> = new Subject();
 dtOptions: any = Object.assign({},DTConfig.dtConf);

 entregas:any[] = [];
 appliedFilters:any[] = [];
 convocatoria:any = {};

  constructor(private _inscritosServices:InscritosService,
    private route:ActivatedRoute,
    private _userService:UserService,
    private spinner: NgxSpinnerService,
    private funcionesP: FuncionesJSService,
    private elementRef: ElementRef ) { this.userService = _userService; this.funciones = funcionesP;}

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id']; 
      this._inscritosServices.getListarEntregasEstados(this.id,2).subscribe(data=>{
        console.log(data);
        if(data['success']){
          this.convocatoria = data['convocatoria'];
          this.entregas = data['entregas'];
          console.log(this.entregas);          
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
    let parent = this;
    $('#filter-beneficio select').on('change', function(){
      parent.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
         console.log(dtInstance.rows( { filter : 'applied'} ).data());
        });
    })
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
    this.dtOptions.order = [[ 0, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.select = true;
    // this.dtOptions.fnDrawCallback = function(){
    //   alert( 'DataTables has redrawn the table' );
    // }
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5, 6]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5, 6]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0, 1, 3, 2, 3, 4, 5, 6]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 3, "#filter-beneficio");
      this.funciones.addFilter(this, 5, "#filter-estado");
      this.funciones.addFilter(this, 4, "#filter-dia");
      this.funciones.addFilter(this, 6, "#filter-fecha");      
    }

  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}
