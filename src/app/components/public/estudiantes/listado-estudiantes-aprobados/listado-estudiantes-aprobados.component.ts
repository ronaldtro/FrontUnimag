import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Location } from '@angular/common';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-listado-estudiantes-aprobados',
  templateUrl: './listado-estudiantes-aprobados.component.html',
  styleUrls: ['./listado-estudiantes-aprobados.component.css']
})
export class ListadoEstudiantesAprobadosComponent implements OnInit, OnDestroy, AfterViewChecked {
  estudiantes:object[]= [];
  index: number = 0;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;
  
  constructor(
    private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService, 
    private _convocatoriaPService:ConvocatoriaPService,
    private router: Router,
    private _location: Location,
    private elementRef: ElementRef, private funciones: FuncionesJSService) { }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(parametros => {
      
      this._convocatoriaPService.getEstudiantesAprobados(parametros.id).subscribe(data=>{
        if(data['success']){
          this.estudiantes = data['estudiantes'];
          //this.estudiantes.sort( this.sortDevicesByStatusAndPower );
          this.initDtOptions();
          this.dtTrigger.next();
        }else{
          swal({
            type: 'error',
            title: 'Error',
            text: data['respuesta'],
          });
        }
        
        this.spinner.hide();  
          
      }, err=> {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()    
      });

    });
    
  }
  sortDevicesByStatusAndPower(a, b) {
    var aStatus = a.plaza,
        bStatus = b.plaza;
    if( aStatus != b.plaza )
      return aStatus < bStatus ? -1 : 1;
    else
     return b.puntaje - a.puntaje;   
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "asc" ],[ 1, "asc" ],[ 2, "asc" ], [ 4, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.destroy = true;
    this.dtOptions.stateSave = false;
    //this.dtOptions.ordering= false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4],
          format: {
              body: function(data, row, column, node) {
                  data = $('<p>' + data + '</p>').text();
                  return $.isNumeric(data.replace(',', '.')) ? data.replace(',', '.') : data;
              }
          }
        }
      }
    ];
  }
  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  backClicked() {
    this._location.back();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
    });
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
