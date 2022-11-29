import { Component, OnInit, ViewChild } from '@angular/core';
import { BeneficiosService } from 'src/app/services/beneficios.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Message } from 'primeng/components/common/api';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import swal from 'sweetalert2';
declare var $: any;
import { NgxSpinnerService } from 'ngx-spinner';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css'],
  providers: [MessageService]
})
export class BeneficiosComponent implements OnInit {

  beneficio: any = {
    id: null,
    nombre: null,
    estado: null,
    tipo:null
  }

  index: number = 0;

  beneficios: any = [];
  tipoConvocatorias: any = [];

  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;

  errores: Message[] = [];

  constructor(private _beneficiosService: BeneficiosService, private messageService: MessageService, private spinner: NgxSpinnerService, private funciones: FuncionesJSService) { }

  ngOnInit() {
    this.spinner.show();
    this._beneficiosService.getDatosBeneficios().subscribe(data => {
      this.beneficios = data['datosBeneficios'];
      this.tipoConvocatorias = data['tipoConvocatorias'];
      this.initDtOptions();
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  crear() {
    this.errores = [];
    this.beneficio = {nombre: null, tipo:null, estado: true};
    $('#crearBeneficio').modal('show');
  }

  guardar(forma: NgForm) {
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this._beneficiosService.postCrearBeneficio(this.beneficio)
        .subscribe(data => {
          if (data['success']) {
            if (this.beneficio.id == null) {
              this.beneficios.push(data['objRetornado']);
            } else {
              for (let i = 0; i < this.beneficios.length; i++) {
                if (this.beneficios[i].id == this.beneficio.id) {
                  this.beneficios[i] = data['objRetornado'];
                }             
              }
              // let index = this.beneficios.indexOf(this.beneficio);
              // this.beneficios[index] = data['objRetornado'];
            }           
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 1500,
              showConfirmButton: false
            });
            this.rerender();
            $('#crearBeneficio').modal('hide');
            forma.resetForm(this.beneficio);
          } else {
            for (let i = 0; i < data['errores'].length; i++) {
              if (data['errores'][i].errores.length > 0) {
                swal({
                  type: "error",
                  title: "Error",
                  text: data['errores'][i].errores[0]['ErrorMessage'],
                  timer: 2000,
                  showConfirmButton: false
                });
              }
            }
          }
        });
    }
  }

  editar(obj) {
    this.errores = [];
    this.index = this.beneficios.indexOf(obj);
    let copy = Object.assign({}, obj);
    this.beneficio = copy;
    $('#crearBeneficio').modal('show');
  }

  estadoDato(obj) {
    swal({
      title: 'Cambiar estado',
      text: '¿Está seguro de cambiar el estado?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    }).then((res) => {
      if (res.value) {
        this._beneficiosService.postEstadoBeneficio(obj.id).subscribe(data => {
          let index = this.beneficios.indexOf(obj);
          this.beneficios[index] = data['objRetornado'];;
        });
        this.rerender();
        swal({
          type: "success",
          title: "Realizado",
          text: "Se ha cambiado el estado satisfactoriamente.",
          timer: 2000,
          showConfirmButton: false
        });
      } else if (res.dismiss === swal.DismissReason.cancel) {
        swal({
          type: "error",
          title: "Cancelado",
          text: "Se ha cancelado la acción.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2]
        }
      }
    ];
  }

}
