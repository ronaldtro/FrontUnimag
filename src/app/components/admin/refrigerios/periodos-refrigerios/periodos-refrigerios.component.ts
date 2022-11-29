import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
import { PeriodoRefrigerioService } from 'src/app/services/periodos-refrigerios.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Periodo } from 'src/app/interfaces/periodo.interface';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
declare var $: any;
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var jQuery:any;

@Component({
  selector: 'app-periodos-refrigerios',
  templateUrl: './periodos-refrigerios.component.html',
  styleUrls: ['./periodos-refrigerios.component.css'],
  providers: [MessageService]
})
export class PeriodosRefrigeriosComponent implements OnDestroy, OnInit, AfterViewInit, AfterViewChecked {

  periodo: Periodo = {
    id: null,
    anio: null,
    semestre: null,
    tipo_beneficio:null,
    id_beneficio:null,
    valor: null,
    estado: true
  };
  index: number = 0;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;
  periodos: Periodo[] = [];
  beneficios: any[]=[]; 
  errores: any[] = [];
  error: any[] = [];
  anios:any[] = [];

  constructor(private _periodosService: PeriodoRefrigerioService, private messageService: MessageService, private spinner: NgxSpinnerService, private elementRef: ElementRef, private funciones: FuncionesJSService) {

   }

  ngOnInit() {
    this.spinner.show();
    this._periodosService.getDatos()
      .subscribe(data => {
        this.periodos = data['datosPeriodo'];
        this.beneficios = data['beneficios'];
        this.initDtOptions();
        this.dtTrigger.next();       
        this.spinner.hide();

        let year = new Date().getFullYear();
        this.anios.push(year);
        for (let i = 1; i < 10; i++) {
          this.anios.push(year + i);
        }

      }, err =>{
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide();
      });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
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
        exportOptions: {
          columns: [ 0, 1, 2, 3]
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

  crear() {
    this.periodo = {
      id: null, anio: null, semestre: null, valor: null, estado: true, id_beneficio:null, tipo_beneficio:null
    };
    $('#crearPeriodo').modal('show');
  }

  guardar(forma: NgForm) {
    this.spinner.show();
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this._periodosService.nuevoDato(this.periodo)
        .subscribe(data => {
          if (data['success']) {
            
            this.periodos.push(data['objRetornado']);
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            
            $('#crearPeriodo').modal('hide');
            forma.resetForm(this.periodo);
            this.error = [];
            this.spinner.hide();
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
    }
  }

  editar(obj) {
   // console.log(obj);
    this.index = this.periodos.indexOf(obj);
    let copy = Object.assign({}, obj);
    $('#editarPeriodo').modal('show');
    this.periodo = copy;
  }

  editarGuardar(forma: NgForm) {
    this.spinner.show();
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
    } else {
      this._periodosService.editarDato(this.periodo)
        .subscribe(data => {
          if (data['success']) {
            this.periodos[this.index] = data['objRetornado'];
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#editarPeriodo').modal('hide');
            forma.resetForm(this.periodo);
            this.periodo = {
              id: null, anio: null, semestre: null, valor: null, estado: true, id_beneficio:null, tipo_beneficio:null
            };
            this.error = [];
            this.spinner.hide();
          } else {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
          }
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });
    }
  }

  estadoDato(obj) {
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        this._periodosService.estadoDato(obj).subscribe(data => {
          let index = this.periodos.indexOf(obj);
          this.periodos[index] = data['objRetornado'];
          this.rerender();
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha cambiado el estado satisfactoriamente.",
            timer: 2000,
            showConfirmButton: false
          });
          this.spinner.hide();
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });      
      }
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
