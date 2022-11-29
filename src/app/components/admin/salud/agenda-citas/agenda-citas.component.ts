import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { CitasService } from 'src/app/services/citas.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import {Location} from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';



declare var $:any;
declare var jQuery:any;


@Component({
  selector: 'app-agenda-citas',
  templateUrl: './agenda-citas.component.html',
  styleUrls: ['./agenda-citas.component.css']
})
export class AgendaCitasComponent implements OnInit {


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  funciones:FuncionesJSService;
  especialidades:any[]=[];
  profesionales:any[]=[];
  profEscogidos:any[]=[];
  dateNow:Date;
  dateFinish:Date;

  appliedFilters:any[] = [];

  busqueda:any = {
    fecha_inicio:null,
    fecha_fin:null,
    especialidad_id:null,
    profesional_id:null,
    paciente_id:null
  }

  agenda:any = [];
  cita:any ={
    paciente:null
  }

  // fecha 
  // hora 
  // duracion 
  // lugar 
  // consultorio
  // especialista 
  // especialidad 
  // paciente 
  // id_paciente 

  
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
  error: any[];
  sw: boolean;

  constructor( private spinner: NgxSpinnerService, 
    private _citasServices: CitasService,  
    private _location: Location,  
    private funcionesP: FuncionesJSService,  ) 
  { 
    this.funciones = funcionesP;
  }

  ngOnInit() {

    // this.dateNow =  new Date();
    // // this.dateFinish = new Date();
    // // this.busqueda.fecha = this.dateNow;
    // this.dateFinish.setDate(this.dateFinish.getDate() + 7);
    this.spinner.show() ;
    this._citasServices.getAgenda().subscribe(data=>{        
          this.agenda = data['resultado'];   
          this.initDtOptions();
          this.dtTrigger.next(); 
           
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });    
    });

  }


  initDtOptions(){    
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar'
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [0,1,2,3,4,5,6]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1,2,3,4,5,6]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
        this.funciones.addFilter(this, 4, "#filter-profesional"); 
        this.funciones.addFilter(this, 5, "#filter-servicio"); 
        this.funciones.addFilter(this, 6, "#filter-estado"); 
    }; 

  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
    // $('[data-toggle="tooltip"]').tooltip();
  }

 
  detalleCita(obj){
     let copy = Object.assign({}, obj);
     $('#detalleCita').modal('show');
     this.cita = copy;
  }

  citaCancelar(obj: any) {
    swal({
      title: 'Cancelar cita',
      text: "¿Está seguro de cancelar la cita?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
    }).then((res) => {
      if (res.value){
        this.spinner.show();    
        this._citasServices.cancelarCita(obj).subscribe(data => {
          if (data['success']) {
            let index = this.agenda.indexOf(obj);
            this.agenda[index].estado = "Cancelada";
            this.agenda[index].estado_id = 3;
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha cancelado la cita satisfactoriamente",
              timer: 2000,
              showConfirmButton: false
            });
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
    });
  }




  onSelect(id:any){
    this.busqueda.profesional_id=null;
    this.profEscogidos = this.getProfesional().filter((item)=>
    item.tipoProfesional_id == id );
  }

  getProfesional(){  
      let prof:any[] =[]
       this.profesionales.forEach(element => {
        prof.push(element);      
       })
       return prof
  }

  goBack():void{
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
