import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { LugaresService } from 'src/app/services/lugares.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { lugar } from 'src/app/interfaces/lugares.interface';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent implements  OnDestroy, OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  appliedFilters:any[] = [];
  funciones:FuncionesJSService;
  error: any[] = [];

  espacio:lugar ={
    id:null,
    nombre:null,
    lugar: null,
    descripcion:null,
    estado:null,
    tiempo_atencion:null,
    cupos_atencion:null,

  }

  tiempo:any[] = [
    {id: 5, nombre: "5 minutos"},
    {id: 10, nombre: "10 minutos"},
    {id: 15, nombre: "15 minutos"},
    {id: 20, nombre: "20 minutos"},
    {id: 25, nombre: "25 minutos"},
    {id: 30, nombre: "30 minutos"},
    {id: 35, nombre: "35 minutos"},
    {id: 40, nombre: "40 minutos"},
    {id: 45, nombre: "45 minutos"},
    {id: 50, nombre: "50 minutos"},
    {id: 55, nombre: "55 minutos"},
    {id: 60, nombre: "60 minutos"},
  ]


  lugares:any []=[];
  index: any;
 
  constructor ( private _lugaresService : LugaresService, private elementRef: ElementRef, private funcionesP: FuncionesJSService, private spinner: NgxSpinnerService) { this.funciones = funcionesP;}

  ngOnInit() {
    this.spinner.show();
    this._lugaresService.getDatosLugares().subscribe(data =>{
      this.lugares = data['datosConsultorio'];
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


    // //this.initDtOptions();
    // this.dtTrigger.next();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3,]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3,]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3,]
        }
      }
     
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
        this.funciones.addFilter(this, 1, "#filter-lugar");  
        this.funciones.addFilter(this, 4, "#filter-estado");
        
    }
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
    this.espacio = {
      nombre:null, lugar: null, descripcion:null,  tiempo_atencion:null,
      cupos_atencion:null,
    };
    $('#crearEspacio').modal('show');
  }

  guardarEspacio(forma:NgForm){
    //console.log(forma);
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
      return;
    }
    this._lugaresService.postCrearEsp(this.espacio).subscribe(data=>{
      if (data['success']) {
        this.lugares.push(data['objRetornado']);
        this.rerender();
        swal({
          type: "success",
          title: "Realizado",
          text: "Se ha realizado la acción satisfactoriamente.",
          timer: 2000,
          showConfirmButton: false
        });
        this.espacio = { id:null , nombre:null, lugar: null, descripcion:null, estado:null};      
        this.spinner.hide();
        forma.resetForm();
        this.error = [];
        $('#crearEspacio').modal('hide');
      }else{
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
      this.spinner.hide();
    });

  }

  editar(obj) {
     this.index = this.lugares.indexOf(obj);
     let copy = Object.assign({}, obj);
     $('#editarEspacio').modal('show');
     this.espacio = copy;
   }

   guardarEditarEspacio(formaEditar){
    this.spinner.show();
    if (!formaEditar.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
      return;
    } else {
      this._lugaresService.postEditarEsp(this.espacio)
        .subscribe(data => {
          if (data['success']) {
            this.lugares[this.index] = data['objRetornado'];
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha editado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#editarEspacio').modal('hide');
            formaEditar.resetForm(this.espacio);
            this.espacio = { id:null , nombre:null, lugar: null, descripcion:null, estado:null};  
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
        this._lugaresService.postEstadoDato(obj).subscribe(data => {
          let index = this.lugares.indexOf(obj);
          this.lugares[index] = data['objRetornado'];
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

  verDetalle(obj) {
    
    let copy = Object.assign({}, obj);
    $('#VerDetalle').modal('show');
    this.espacio = copy;
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
