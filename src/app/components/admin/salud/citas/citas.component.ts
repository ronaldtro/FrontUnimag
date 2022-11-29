import { Component, OnInit, ViewChild } from '@angular/core';
import { CitasService } from 'src/app/services/citas.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Tiempo } from 'src/app/class/tiempo';
import {Location} from '@angular/common';
import { Router } from '@angular/router';



declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})

export class CitasComponent implements OnInit {
 // [x: string]: any;
  funciones:FuncionesJSService;
  especialidades:any[]=[];
  profesionales:any[]=[];
  profEscogidos:any[]=[];
  agenda:any[]=[];
  sw:any = false;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = DTConfig.dtConf;
  dtTrigger: Subject<string> = new Subject();
  error: any[] = [];
  dateNow:Date;
  dateFinish:Date;
  tiempo:any[] = Tiempo.tiempo;
  error2:any = null;
  reserva:any = {
    especialidad_id:null,
    horario_atencion_id:null,
    nombre_profesional:null,
    especialidad:null,
    consultorio:null,
    lugar:null,
    fecha:null,

  }


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
  busqueda:any = {
    fecha:null,
    especialidad_id:null,
    profesional_id:null
  }

  constructor( 
    private _citasServices: CitasService, 
    private spinner: NgxSpinnerService,
   // private elementRef: ElementRef, 
    private funcionesP: FuncionesJSService,
    private router:Router,
    private _location: Location  
    ) 
    {this.funciones = funcionesP;}

    

  ngOnInit() {
    this.dateNow =  new Date();
    this.dateFinish = new Date();
    this.busqueda.fecha = this.dateNow;
    this.dateFinish.setDate(this.dateFinish.getDate() + 7); 
    this.spinner.show();
    this._citasServices.getEspecialidad().subscribe(data=>{ 
      if (data['success']) {
      this.especialidades=data['listadoTiposrofesionales'];  
      this.profesionales=data['listadoProfesionales'] 
      this.initDtOptions(); 
      this.dtTrigger.next();
      this.spinner.hide();
      } else {
        setTimeout(() => {
          this.router.navigate(['/actualizarDatos']);
        }, 1500);
      }
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

  crearBusqueda(forma: NgForm) {
    this.spinner.show();
    console.log(this.busqueda);

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
      this._citasServices.getDatosBuscar(this.busqueda)
        .subscribe(data => {
          if (data['Success']) {
            this.sw = true;
            this.agenda = data['horarios'];   
            this.error = [];
            this.spinner.hide(); 
            // forma.resetForm();   
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
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
          columns: [0,1,2,3,4]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [0,1,2,3,4]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
        this.funciones.addFilter(this, 1, "#filter-prof"); 
        this.funciones.addFilter(this, 3, "#filter-dia"); 
        this.funciones.addFilter(this, 2, "#filter-consultorio"); 
    }; 

  }
  // ngAfterViewInit(){
  //   jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
  //     trigger: 'focus'
  //   });
  // } 
  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
    $('[data-toggle="tooltip"]').tooltip();
  }

  reservarCita( profesional, horario ){    
    let copy = Object.assign({}, profesional);
    this.reserva = copy;
    this.reserva.fecha = this.reserva.fecha + " " + horario.hora;
    this.reserva.fecha = new Date(this.reserva.fecha);
    $('#ReservarCita').modal({backdrop:"static"});
  }

  guardarReserva(){
    this.spinner.hide();
    this._citasServices.postReservarCita(this.reserva)
        .subscribe(data => {
          if (data['success']) {
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha generado satisfactoriamente la cita.",
              timer: 2000,
              showConfirmButton: false
            });
            this.reserva = {nombre_profesional:null, especialidad:null, consultorio:null, lugar:null, fecha:null, horario_atencion_id:null, especialidad_id:null, };
            $('#ReservarCita').modal("hide");
            this.spinner.hide();
            setTimeout(() => {
              this.router.navigate(['/miCitas']);
            }, 1500);
            
          } else {
            if(data['errores'] != null){
              this.error = data['errores'];              
            } else{
              this.error2 = data['error'];
            }         
            console.log(this.error2);
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

  goBack():void{
    this._location.back();
  }

}
