import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlazasPService } from 'src/app/services/plazas-p.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { MessageService } from 'primeng/api';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
declare var $:any;
declare var jQuery:any;
@Component({
  selector: 'app-public-aprobados',
  templateUrl: './public-aprobados.component.html',
  styleUrls: ['./public-aprobados.component.css'],
  providers: [MessageService]

})

export class PublicAprobadosComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;

  aprobados:any={
    convocatoria : 0,
    cupos : null,
    estado : null,
    evaluados:[]
  };

  id:number;
  //elementRef: any;
  constructor( private route:ActivatedRoute, 
               private _listaService : PlazasPService, 
               private activatedRoute:ActivatedRoute, 
               private spinner: NgxSpinnerService,
               private messageService: MessageService,
               private elementRef: ElementRef, private funciones: FuncionesJSService ) {
    this.route.params.subscribe(params=>{
      this.id=params.id});
   }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params =>{
      this._listaService.getDatosAprobados(params['id']).subscribe(data=>{
        this.aprobados = data['getEvaluados'];
        this.initDtOptions();
        this.dtTrigger.next();
        this.spinner.hide();    
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.messageService.add({severity:'error', summary: 'Error', detail: respuesta.msg });
        this.spinner.hide();  
      });
    });
  }
  initDtOptions(){
    this.dtOptions.order = [[ 3, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.stateSave = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        title: "Resultados estudiantes postulados " + this.aprobados.nombre,
        exportOptions: {
          columns: [ 0, 1, 2, 3],
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
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}
