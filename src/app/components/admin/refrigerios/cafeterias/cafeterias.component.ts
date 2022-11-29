import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef, AfterViewChecked } from '@angular/core';
import { CafeteriaService } from 'src/app/services/cafeterias.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Cafeteria } from 'src/app/interfaces/cafeterias.interface';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
declare var $: any;
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { Objeto } from '../../../../interfaces/objeto.interfaces';

declare var jQuery:any;

@Component({
  selector: 'app-cafeterias',
  templateUrl: './cafeterias.component.html',
  styleUrls: ['./cafeterias.component.css'],
  providers: [MessageService]
})
export class CafeteriasComponent implements OnDestroy, OnInit, AfterViewInit, AfterViewChecked {

  cafeteria: Cafeteria = {
    id: null,
    nombre: null,
    lugar: null,
    estado: true
  };
  index: number = 0;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = DTConfig.dtConf;
  cafeterias: Cafeteria[] = [];
  errores: any[] = [];
  error: any[] = [];

  constructor(private _cafeteriasService: CafeteriaService, private messageService: MessageService, private spinner: NgxSpinnerService, private elementRef: ElementRef, private funciones: FuncionesJSService) { 

  }

  ngOnInit() {
    this.spinner.show();
    this._cafeteriasService.getDatos()
      .subscribe(data => {
        this.cafeterias = data['cafeterias'];
        //this.initDtOptions();

        this.dtTrigger.next();
        
        this.spinner.hide();
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
    this.cafeteria = {
      id: null, nombre: null, lugar: null, estado: true, beneficiosSelect:[]
    };
    $('#crearCafeteria').modal('show');
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
      this._cafeteriasService.nuevoDato(this.cafeteria)
        .subscribe(data => {
          if (data['success']) {
            if (this.cafeteria.id == null) {
              this.cafeterias.push(data['objRetornado']);
            }else{
              for (let i = 0; i < this.cafeterias.length; i++) {
                if (this.cafeterias[i].id == this.cafeteria.id) {
                  this.cafeterias[i] = data['objRetornado'];
                }               
              }
            }           
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            
            $('#crearCafeteria').modal('hide');
            forma.resetForm(this.cafeteria);
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
        this._cafeteriasService.estadoDato(obj.id).subscribe(data => {
          let index = this.cafeterias.indexOf(obj);
          this.cafeterias[index] = data['objRetornado'];
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
        
      } else if (res.dismiss === swal.DismissReason.cancel) {
        // swal({
        //   type: "error",
        //   title: "Cancelado",
        //   text: "Se ha cancelado la acción.",
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
    });
  }

  editar(obj) {
    // console.log(obj);
     this.index = this.cafeterias.indexOf(obj);
     let copy = Object.assign({}, obj);
     $('#crearCafeteria').modal('show');
     this.cafeteria = copy;
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
