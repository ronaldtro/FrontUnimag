import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import { ConsultasService } from 'src/app/services/consultas.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-generales',
  templateUrl: './generales.component.html',
  styleUrls: ['./generales.component.css']
})
export class GeneralesComponent implements OnInit {
  index: number = 0;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;
  constructor(private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService, 
    private _consultasService:ConsultasService,
    private router: Router,
    private elementRef: ElementRef, private funciones: FuncionesJSService) { }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(parametros => {
      
      this._consultasService.getInformacion().subscribe(data=>{
        if(data['success']){

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
