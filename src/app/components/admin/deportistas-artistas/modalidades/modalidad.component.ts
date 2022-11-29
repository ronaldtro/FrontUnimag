import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { ModalidadesService } from 'src/app/services/modalidad.service';
import { Modalidad } from 'src/app/interfaces/modalidad.interface';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-modalidad',
  templateUrl: './modalidad.component.html',
  styleUrls: ['./modalidad.component.css']
})
export class ModalidadComponent implements OnInit,OnDestroy {
  
  /**
   * Se guardan todas las modalidades que vienen del Backend
   */
  modalidades : Modalidad[] = [];
  
  /** 
   * Se guardan los datos de una modalidad que se va a crear o editar
   */
  modalidad : Modalidad = {};

  errores:object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;

  constructor(private _modalidadService: ModalidadesService ,private router:Router,private route:ActivatedRoute, 
    private spinner: NgxSpinnerService, private elementRef: ElementRef) {

    }
    
  /**
   * Obtiene las modalidades que han sido creadas anteriormente.
   */
  ngOnInit() {
    this.spinner.show();

      this._modalidadService.getModalidades().subscribe(data => {
        
        this.modalidades = data['modalidades'];
        this.initDtOptions();
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

  /**
   * Se abre el modal para crear modalidades 
   *  
   */
  modalCrearModalidad(){
    this.errores = [];
    this.modalidad = {};
    $('#crearModalidadModal').modal('show');
  }

  /**
   * Se guarda la modalidad mediante el método 'guardarModalidad()' del servicio 
   * 'ModalidadesService' el cual recibe el objeto 'modalidad' que contiene los datos
   * de la modalidad que se va a guardar
   * 
   * @param formulario 
   */
  guardarModalidad(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    
    this.spinner.show();
    
    this._modalidadService.guardarModalidad(this.modalidad).subscribe(data => {
      if(data['success']){
        if(this.modalidad.id == null){
          this.modalidades.push(data['modalidad']);
        }else{
          for (let index = 0; index < this.modalidades.length; index++) {
            if (this.modalidades[index].id == this.modalidad.id) {
              this.modalidades[index] = data['modalidad'];
            }
          }
        }
        formulario.resetForm();
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#crearModalidadModal').modal('hide');
        
        }, 2000);
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }), err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    };

    this.spinner.hide();
  }

  /**
   * Se abre el modal editar para modificar los datos de una modalidad
   * 
   * @param modalidad es el objeto que contiene los datos de una modalidad
   */
  modalEditarModalidad(modalidad){
    let copy = Object.assign({}, modalidad);
    this.errores = [];
    this.modalidad = copy;
    $('#crearModalidadModal').modal('show');
  }

  /**
   * Se usa para habilitar o deshabilitar la modalidad que se haya seleccionado
   * 
   * @param modalidad es el objeto que contiene los datos de una modalidad
   */
  cambiarEstado(modalidad){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._modalidadService.cambiarEstado(modalidad.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.modalidades.length; index++) {
              if (this.modalidades[index].id == modalidad.id) {
                this.modalidades[index].estado = !this.modalidades[index].estado;
                break;
              }
            }
            this.rerender();
            swal({
              title: 'Acción realizada',
              text: 'Acción realizada satisfactoriamente.',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'La modalidad no se encuentra registrada en la base de datos',
            });
          }
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
    })
  }

  initDtOptions(){
    this.dtOptions.order = [[ 1, "asc" ],[ 0, "asc" ]];
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}