import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { tipoPlaza, tipoAyudantia, programas, asignaturas } from "../../../../../interfaces/plaza.interface";
import { TipoPlazaService } from 'src/app/services/tipo-plaza.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Subject } from "rxjs/Subject";
import { DTConfig } from 'src/app/class/dtconfig';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var $: any;
declare var jQuery:any;

@Component({
  selector: 'app-tipos-plazas',
  templateUrl: './tipos-plazas.component.html',
  styleUrls: ['./tipos-plazas.component.css'],
  providers: [MessageService]
})
export class TiposPlazasComponent implements OnInit, OnDestroy {

  index: number = 0;
  errores: Message[] = [];
  filtro: number = 0;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = Object.assign({}, DTConfig.dtConf);

  appliedFilters:any[] = [];
  plazaTipo: tipoPlaza = {
    id: null,
    nombre: "",
    tipoAyudantia: null,
    codigo: null
  }

  plazaT: tipoPlaza = {
    id: null,
    nombre: "",
    tipoAyudantia: null,
    codigo: null,
    idAsignatura : null
  }

  tiposPlazas: tipoPlaza[] = [];
  tipoAyudantias: tipoAyudantia[] = [];
  programas: programas [] = [];
  asignaturas : asignaturas [] = [];
  funciones:FuncionesJSService;
  error: any[] = [];
  constructor(private funcionesP:FuncionesJSService, private tipoPlazaService: TipoPlazaService, private messageService: MessageService, private spinner: NgxSpinnerService, private elementRef: ElementRef) {this.funciones = funcionesP }

  ngOnInit() {
    this.spinner.show();
    this.tipoPlazaService.getDatosTipo().subscribe(data => {
      this.tiposPlazas = data['tiposPlazas'];
      this.tipoAyudantias = data['tipoAyudantia'];
      this.programas= data['programas'];
      this.asignaturas = data [ 'asignaturas'];
      this.dtOptions.order = [[ 1, "asc" ]];
      this.initDtOptions();
      this.dtTrigger.next();
      this.spinner.hide();
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      //  this.spinner.hide()
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  initDtOptions(){
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
        this.funciones.addFilter(this, 0, "#filter-nombre");      
        this.funciones.addFilter(this, 2, "#filter-tipoAyudantia");
        this.funciones.addFilter(this, 3, "#filter-estado");
    }
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  estadoDato(obj) {
    swal({
      title: 'Cambiar estado',
      text: '¿Está seguro de realizar esta acción?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        this.tipoPlazaService.estadoDato(obj)
          .subscribe(data => {
            let index = this.tiposPlazas.indexOf(obj);
            this.tiposPlazas[index] = data['objRetornado'];

            if (data['success']) {
              swal({
                type: "success",
                title: "Realizado",
                text: "Se ha cambiado el estado satisfactoriamente.",
                timer: 2000,
                showConfirmButton: false
              });
            }
            this.spinner.hide();
          }, err => {
            let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });
            // this.spinner.hide()
          });

      } else if (res.dismiss === swal.DismissReason.cancel) {
        // swal({
        //   type: "error",
        //   title: "Cancelado",
        //   text: "Se ha cancelado la acción.",
        //   timer: 2000,
        //   showConfirmButton: false
        //    });
      }
    });
  }


  crear() {
    this.plazaTipo = {
      id: null,
      nombre: null,
      tipoAyudantia: null,
      codigo: null
    }
    this.error = [];
    $('#crearTipoPlaza').modal({backdrop: "static"});
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

      
      for (let i = 0; i < this.asignaturas.length; i++) {
        if (this.asignaturas[i].codigo == this.plazaTipo.codigo) {
          this.plazaTipo.nombre = this.asignaturas[i].nombre;
          this.plazaTipo.programa = this.asignaturas[i].dependencia;
          break;
        }
      }

      this.tipoPlazaService.nuevoDato(this.plazaTipo)
        .subscribe(data => {
          if (data['success']) {
            this.tiposPlazas.push(data['objRetornado']);
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            this.error = [];
            this.spinner.hide();
            $('#crearTipoPlaza').modal('hide');
          } else {
            this.error = data['errores'];
            this.spinner.hide();
            // this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: data['errores'] });
          }
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
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
    this.index = this.tiposPlazas.indexOf(obj);
    let copy = Object.assign({}, obj)
    $('#editarTipo').modal('show');
    this.plazaTipo = copy;
  }

  editarGuardar(forma: NgForm) {
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this.tipoPlazaService.editarDato(this.plazaTipo)
        .subscribe(data => {
          if (data['success']) {
            this.tiposPlazas[this.index] = data['objRetornado'];
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            forma.resetForm(this.plazaTipo);
            this.rerender();
            $('#editarTipo').modal('hide');
            
          } else {
            swal({
              type: "error",
              title: "Error",
              text: data['objRetornado'],
              timer: 2000,
              showConfirmButton: false
            });
          }
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          // this.spinner.hide()
        });
    }
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
