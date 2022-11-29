import { Component, OnInit } from '@angular/core';
import { PROFILE_BY } from 'src/app/class/api';
import { ActivatedRoute } from '@angular/router';
import { AtencionService } from 'src/app/services/atencion.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { FormularioIncapacidad } from 'src/app/interfaces/atencion';
import { LetrasPipe } from 'src/app/pipes/letras.pipe';
import { DiferenciaFechasPipe } from 'src/app/pipes/diferencia-fechas.pipe';
import { CapitalizePipePipe } from 'src/app/pipes/capitalize-pipe.pipe';
import {Location} from '@angular/common';

@Component({
  selector: 'app-registro-incapacidad',
  templateUrl: './registro-incapacidad.component.html',
  styleUrls: ['./registro-incapacidad.component.css']
})
export class RegistroIncapacidadComponent implements OnInit {
  capitaliza:CapitalizePipePipe = new CapitalizePipePipe();
  letras:LetrasPipe = new LetrasPipe();
  diferenciaFechas:DiferenciaFechasPipe = new DiferenciaFechasPipe();
  profile_by = PROFILE_BY.ID_Paciente;
  id:number;
  error:any = [];
  atencion: any;
  aux_cita: any;
  formulario: FormularioIncapacidad = new FormularioIncapacidad();
  tipos_entidades: any =[];
  contingencias: any =[];
  tiposPacientes: any = [];
  DateNow:Date;
  minDate:Date;

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




  constructor( private route: ActivatedRoute, 
               private _atencionService : AtencionService,
               private spinner: NgxSpinnerService,
               private _location: Location) { }

  ngOnInit() {
    this.DateNow = new Date();
    this.minDate = new Date();
    //this.minDate.setDate(this.DateNow.getDate() - 1 );
    this.route.params.subscribe(params => {
      this.spinner.show();
      this.id = params['id'];

      this._atencionService.getDatosAtencionN(this.id).subscribe(data=>{        
        this.atencion = data['objRetornado']['cita'];
        this.aux_cita = JSON.parse(data['objRetornado']['datosAtencion']);
        this.formulario.id_paciente = this.atencion.id_paciente;
        this.formulario.fecha_atencion = this.atencion.fecha; 
        this.formulario.fecha_inicio = this.DateNow;
        
        
        this.tipos_entidades = this.aux_cita.objRetornado.tipos_entidades;
        this.tiposPacientes = this.aux_cita.objRetornado.tipos_pacientes; 
        this.contingencias = this.aux_cita.objRetornado.contingencias;
        // this.formulario.id_cita = params["id"];    
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

    });

  }
  
  calcularDias( inicio, fin){
    this.formulario.dias= this.diferenciaFechas.transform(inicio,fin,"d") + 1;
    this.formulario.letras = this.capitaliza.transform( this.letras.transform(this.formulario.dias) + " días");
    return this.formulario.dias
  }

  AtencionPaciente(forma:NgForm){
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
      return
    }

    this._atencionService.postRegistrarIncapacidad(this.formulario).subscribe(data => {
      if (data['success']) {
        swal({type: "success", title: "Realizado" ,text: "Se ha registrado la atención satisfactoriamente.",timer: 2000, showConfirmButton: false});
        setTimeout(() => {
          this._location.back(); 
        }, 1500);
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
