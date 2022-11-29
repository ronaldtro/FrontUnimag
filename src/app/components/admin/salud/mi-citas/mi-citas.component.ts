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
import { PROFILE_BY } from 'src/app/class/api';
import { PerfilSaludComponent } from "src/app/components/admin/salud/perfil-salud/perfil-salud.component";

declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-mi-citas',
  templateUrl: './mi-citas.component.html',
  styleUrls: ['./mi-citas.component.css']
})


export class MiCitasComponent implements OnInit {

@ViewChild(DataTableDirective)
dtElement: DataTableDirective;
dtOptions: any = DTConfig.dtConf;
dtTrigger: Subject<string> = new Subject();
error: any[] = [];
index: number = 0;
id: number = 0;
cita:any[]=[];
appliedFilters:any[] = [];

profile_by = PROFILE_BY.Session

misCitas:any={
  id:null,
  nombre :null,
  correo :null,
  documento :null,
  sexo :null,
  estado_civil :null,
  sangre :null,
  ocupacion :null,
  eps :null,
  nacimiento :null,
  dir :null,
  antecedentes_medicos :null,
  citas:[],
};


citas:any={ 
  medico:null,
  especialidad:null, 
  fecha_atencion:null,    
  hora_atencion:null,
  hora_atencion_fin:null,        
  estado:null,
  estadoAtencion:null, 
  nombre_consultorio:null,
  lugar_consultorio:null,
};

funciones:FuncionesJSService;
constructor( 
  private _miCitas: CitasService, 
  private spinner: NgxSpinnerService,
 // private elementRef: ElementRef, 
  private funcionesP: FuncionesJSService,  
  ) 
  {this.funciones = funcionesP;}

  ngOnInit() {
    this.spinner.show();
    this._miCitas.getCitas().subscribe(data=>{  
      this.misCitas=data['personas'];
      // console.log(this.misCitas);
      this.cita==data['personas'].citas;
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
    })

    this.dtOptions.order = [[4, "desc"]];

  }

  detalleCita(obj) {
    console.log(obj);
     this.index = this.cita.indexOf(obj);
     let copy = Object.assign({}, obj);
     $('#detalleCita').modal('show');
     this.citas = copy;
  }

  citaCancelar(id: any) {
    swal({
      title: 'Cancelar cita',
      text: "¿Está seguro de cancelar su cita?",
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
        this._miCitas.cancelarCita(id).subscribe(data => {
          if (data['success']) {
            let index = this.misCitas.citas.indexOf(id);
            this.misCitas.citas[index] = data['objRetornado'];
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha cancelado su cita satisfactoriamente",
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
        this.funciones.addFilter(this, 1, "#filter-servicio"); 
        this.funciones.addFilter(this, 4, "#filter-estado"); 
    }; 

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
    $('[data-toggle="tooltip"]').tooltip();
  }

}
