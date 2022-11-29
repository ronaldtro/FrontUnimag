import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { PlazaService } from 'src/app/services/plaza.service';
import { Location } from '@angular/common';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-cuantificacion-plazas',
  templateUrl: './cuantificacion-plazas.component.html',
  styleUrls: ['./cuantificacion-plazas.component.css']
})
export class CuantificacionPlazasComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  plazas:object[]= [];

  //datos de filtro
  unidades:object[]= [];
  plazasFiltro:object[]= [];
  tiposAyudantia:object[]= [];
  
  index: number = 0;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;
  
  constructor(
    private activatedRoute:ActivatedRoute,
    private spinner: NgxSpinnerService, 
    private _plazaService: PlazaService,
    private router: Router,
    private _location: Location,
    private elementRef: ElementRef, private funciones: FuncionesJSService) { }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(parametros => {
      
      this._plazaService.getCuantificacionPlazas(parametros.id).subscribe(data=>{
        this.plazas = data['plazas'];

        //datos de filtro
        this.unidades = data['unidades'];
        this.plazasFiltro = data['plazasFiltro'];
        this.tiposAyudantia = data['tiposAyudantia'];

        this.initDtOptions();
        this.dtTrigger.next();
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
    this.dtOptions.order = [[ 1, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
