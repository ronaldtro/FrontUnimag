import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FechasAlmuerzoService } from 'src/app/services/fechasAlmuerzos.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-dias-nohabilitados',
  templateUrl: './dias-nohabilitados.component.html',
  styleUrls: ['./dias-nohabilitados.component.css']
})
export class DiasNohabilitadosComponent implements OnInit, AfterViewChecked  {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  funciones:FuncionesJSService;

  es:any = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
    dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
    dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
    monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
    monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
    today: 'Hoy',
    clear: 'Limpiar'
  };

  fechaNoHabil: any ={
    fecha_inicio:null,fecha_fin:null,descripcion:null,estado:null,id_tipo:null,tipo:null,  
  }

  tipos : any [] = [];
  convocatoriasSelect:any[] = [];
  diasNoHabiles: any[] = [];
  error: any[] = [];
  index: any;

  constructor(private _fechaAlmuerzoService:FechasAlmuerzoService , private spinner:NgxSpinnerService ,  private elementRef: ElementRef ,private funcionesP: FuncionesJSService ) { this.funciones = funcionesP; }

  ngOnInit() {
    // this.spinner.show();
    this._fechaAlmuerzoService.getDatos().subscribe(data =>{
      this.diasNoHabiles = data['fechasNoHabiles'];
      this.tipos =  data['tipos'];
      this.convocatoriasSelect = data['convocatorias'];
      this.diasNoHabiles.forEach(element => {
        element.fecha_inicio = new Date(element.fecha_inicio);
        element.fecha_fin = new Date(element.fecha_fin);
        
      });
      // debugger;
      this.initDtOptions();
      this.dtTrigger.next(); 

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
    this.dtOptions.order = [[ 2, "asc" ]];
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


    

    // this.dtOptions.stateSave = false;
    // this.dtOptions.initComplete = () => {
      
    //     this.funciones.addFilter(this, 1, "#filter-lugar");  
    //     this.funciones.addFilter(this, 2, "#filter-descripcion");      
    //     this.funciones.addFilter(this, 3, "#filter-estado");
        
    // }
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  crear() {
    this.fechaNoHabil = {fecha_inicio:null,fecha_fin:null,descripcion:null,estado:null,id_tipo:null,tipo:null, }; 
    $('#crearFechaNoHabil').modal('show');
  }

  guardar(forma : NgForm){
    //  debugger;
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

    if (this.fechaNoHabil.fecha_inicio > this.fechaNoHabil.fecha_fin) {
      swal({
        type: "error",
        title: "Error",
        text: "La fecha inicial no puede ser mayor a la final",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
      return;
    }

    this._fechaAlmuerzoService.postCrearFechaNoHabil(this.fechaNoHabil).subscribe(data=>{
      if (data['success']) {
        this.fechaNoHabil = data['objRetornado'];
        this.fechaNoHabil.fecha_inicio = new Date(this.fechaNoHabil.fecha_inicio);
        this.fechaNoHabil.fecha_fin = new Date(this.fechaNoHabil.fecha_fin);
        this.diasNoHabiles.push(this.fechaNoHabil);
        swal({
          type: "success",
          title: "Realizado",
          text: "Se ha realizado la acción satisfactoriamente.",
          timer: 2000,
          showConfirmButton: false
        });
        this.fechaNoHabil = {fecha_inicio:null,fecha_fin:null,descripcion:null,estado:null,id_tipo:null,tipo:null,};   
        this.spinner.hide();
        forma.resetForm();
        this.error = [];
        this.rerender();

        console.log(data['objRetornado'])
        $('#crearFechaNoHabil').modal('hide');
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
    // console.log(obj);
     this.index = this.diasNoHabiles.indexOf(obj);
     let copy = Object.assign({}, obj);
     $('#editarFechaNoHabil').modal('show');
     this.fechaNoHabil = copy;
    
     
   }

   editarGuardar(forma : NgForm){

    // debugger;

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
    this._fechaAlmuerzoService.postEditarFechaNoHabil(this.fechaNoHabil).subscribe(data=>{

      if (data['success']) {
        this.diasNoHabiles[this.index] = data['objRetornado'];
        this.diasNoHabiles[this.index]['fecha_inicio'] = new Date (this.diasNoHabiles[this.index]['fecha_inicio'] );
        this.diasNoHabiles[this.index]['fecha_fin'] = new Date (this.diasNoHabiles[this.index]['fecha_fin'] );
        swal({
          type: "success",
          title: "Realizado",
          text: "Se ha realizado la acción satisfactoriamente.",
          timer: 2000,
          showConfirmButton: false
        });
        this.fechaNoHabil = {fecha_inicio:null,fecha_fin:null,descripcion:null,estado:null,id_tipo:null,tipo:null,};   
        this.spinner.hide();
        forma.resetForm();
        this.error = [];
        this.rerender();
        $('#editarFechaNoHabil').modal('hide');
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
        this._fechaAlmuerzoService.postEstadoDato(obj).subscribe(data => {
          let index = this.diasNoHabiles.indexOf(obj);
          this.diasNoHabiles[index] = data['objRetornado'];
          this.diasNoHabiles[index]['fecha_inicio'] = new Date (this.diasNoHabiles[index]['fecha_inicio'] );
          this.diasNoHabiles[index]['fecha_fin'] = new Date (this.diasNoHabiles[index]['fecha_fin'] );
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



   rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
