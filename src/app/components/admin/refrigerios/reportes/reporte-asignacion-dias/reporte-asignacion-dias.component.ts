import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-reporte-asignacion-dias',
  templateUrl: './reporte-asignacion-dias.component.html',
  styleUrls: ['./reporte-asignacion-dias.component.css']
})
export class ReporteAsignacionDiasComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;

  constructor( private _location: Location, private elementRef: ElementRef, private funciones: FuncionesJSService) { }

  ngOnInit() {

    this.initDtOptions();
    this.dtTrigger.next();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 1, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,]
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

  backClicked() {
    this._location.back();
  }

}
