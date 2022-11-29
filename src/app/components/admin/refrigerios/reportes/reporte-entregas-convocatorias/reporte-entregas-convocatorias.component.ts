import { Component, OnInit, ViewChild } from '@angular/core';
import { CafeteriaService } from 'src/app/services/cafeterias.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-reporte-entregas-convocatorias',
  templateUrl: './reporte-entregas-convocatorias.component.html',
  styleUrls: ['./reporte-entregas-convocatorias.component.css']
})
export class ReporteEntregasConvocatoriasComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  funciones:FuncionesJSService;

  entregas:Entrega[] = [];

  appliedFilters:any[] = [];

  constructor(
    private _cafeteriaService:CafeteriaService,
    private spinner: NgxSpinnerService,
    private _funciones: FuncionesJSService,
    private _location: Location
  ) { this.funciones = _funciones; }

  ngOnInit() {
    this.spinner.show();
    this._cafeteriaService.getReporteEntregasConvocatorias().subscribe((data:any) => {
      this.entregas = data.reportes;

      this.initDtOptions();
      this.dtTrigger.next();

      this.spinner.hide();
    }, (err:any) => {
      alert(err.toString());
    });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "asc" ],[ 1, "asc" ],[ 2, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8,]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8,]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8,]
        }
      }
    ];
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      this.funciones.addFilter(this, 0, "#filter-convocatoria"); 
      this.funciones.addFilter(this, 1, "#filter-beneficio"); 
    
    }; 
  }

  backClicked():void {
    this._location.back();
  }

}

class Entrega{
  beneficio: string;
  convocatoria: string;
  entregas_excusadas: number;
  entregas_extemporaneas: number;
  entregas_por_sistema: number;
  entregas_totales: number;
  fallas: number;
  fallas_por_sistema: number;
  fecha_entrega:string;
}
