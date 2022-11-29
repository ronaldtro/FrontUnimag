
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';
import { AtencionService } from 'src/app/services/atencion.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-no-programada',
  templateUrl: './no-programada.component.html',
  styleUrls: ['./no-programada.component.css']
})
export class NoProgramadaComponent{


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

  paciente:any;
  error: any[] = [];
  
  busqueda:any = {
     paciente_id:null,
     tipo_paciente:null
  }
  atencion_id: any;


  constructor( private _atencionService : AtencionService, 
               private _location: Location,
               private spinner: NgxSpinnerService, ) { }


  crearBusqueda(forma:NgForm){
  this.spinner.show();
  this.error =  [];
    if (!forma.valid) {
       swal({
        type: 'error',
        title: 'Error',
        text: 'Complete los campos del formulario'
      });   
      this.spinner.hide();
      return;
    }
    this._atencionService.getDatosPaciente(this.busqueda).subscribe(data=>{        
        if (data['success']) {
          this.paciente = data['objRetornado']['paciente'];
          console.log(this.paciente);

          this.atencion_id = data['objRetornado']['atencion'];
          // console.log(this.atencion_id);

        } else{
          this.error = data['errores'];
          this.paciente = null;
          swal({
            type: "error",
            title: "Error",
            text: "Corrige los errores",
            timer: 2000,
            showConfirmButton: false
          });
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
    
    this.spinner.hide();
    

  }


  goBack():void{
    this._location.back();
  }

}
