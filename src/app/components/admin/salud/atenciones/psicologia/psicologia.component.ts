import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { AtencionService } from 'src/app/services/atencion.service';
import { NgForm } from '@angular/forms';
import { Psicologia } from 'src/app/interfaces/atencion';
import { from } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {Location} from '@angular/common';
import { PROFILE_BY } from 'src/app/class/api';

@Component({
  selector: 'app-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['./psicologia.component.css']
})
export class PsicologiaComponent implements OnInit {

   
  id: any;
  bandera:any;
  aux_cita: any;
  dateNow: Date;
  tiposPacientes: any [] = [];
  consentimiento_informado?:File;
  

  atencion: any = {
    id_cita:null, 
    id_servicio:null, 
    duracion:null, 
    servicio:null, 
    paciente:null, 
    identificacion:null, 
    email:null, 
    fecha_nacimiento:null, 
    sexo:null, 
    tipo_sangre:null, 
    residencia:null, 
    estado_civil:null, 
    ocupacion:null, 
    eps:null,
    consentimiento_informado:null,
    antecedentes_psicologicos:null
  };

  profile_by = PROFILE_BY.ID_Cita;

 
  messageService: any;
  errores: any[];
  error: any[] = [];

  formulario:Psicologia = new Psicologia();


  constructor( private route: ActivatedRoute, 
    private _atencionPsicologiaService : AtencionService,
    private changeDetector: ChangeDetectorRef ,
    private spinner: NgxSpinnerService,
    private _location: Location ) { }

  ngOnInit() {
    this.spinner.show();
    this.dateNow = new Date();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.bandera = params["bandera"];
      this.formulario.bandera = this.bandera;
      console.log(this.bandera+ " "+this.id);
      if (this.bandera == 0) {
          this._atencionPsicologiaService.getDatosAtencion(this.id).subscribe(data=>{
          this.atencion = data['objRetornado']['cita'];
          this.aux_cita = JSON.parse(data['objRetornado']['datosAtencion']);
          this.formulario.id_paciente = this.atencion.id_paciente;
          this.formulario.fecha_atencion = this.atencion.fecha;
          this.formulario.tipo_paciente = null;
          this.formulario.antecedentes_psicologicos = this.atencion.antecedentes_psicologicos;
          this.tiposPacientes = this.aux_cita.objRetornado.tipos_pacientes;
          this.formulario.id_cita = params["id"];
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
      } else {
        this.profile_by = PROFILE_BY.ID_Paciente;
        this._atencionPsicologiaService.getDatosAtencionN(this.id).subscribe(data=>{
          console.log(data['objRetornado']);
          this.atencion=data['objRetornado']['cita'];
          this.aux_cita = JSON.parse(data['objRetornado']['datosAtencion']);
          this.formulario.id_paciente = this.atencion.id_paciente;
          this.formulario.fecha_atencion = this.atencion.fecha;
          this.formulario.tipo_paciente = null;
          this.formulario.antecedentes_psicologicos = this.atencion.antecedentes_psicologicos;
          this.tiposPacientes = this.aux_cita.objRetornado.tipos_pacientes;
          console.log("ANTECEDENTES PSICOLOGICOS: "+this.atencion.antecedentes_psicologicos);
          /*this.formulario.examen_fisico_item =  this.examen_Fisico;   
          this.formulario.examenesClinico = this.tipoExamenes; 

          this.tiposAtenciones = this.aux_cita.objRetornado.tipos_atenciones;
          this.examen_Fisico = this.aux_cita.objRetornado.fisico;    
          this.tipoExamenes = this.aux_cita.objRetornado.tipo_examenes; 
          this.cie_10 = this.aux_cita.objRetornado.cie_10 
          this.medicamentos = this.aux_cita.objRetornado.medicamentos;*/
    
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
      }
    });
    
    this.spinner.hide(); 
  }

  //Save function...
  AtencionPsicologia(forma: NgForm) {
    this.spinner.show();
    console.log(forma);

   if (!forma.valid) {
     swal({
       type: "error",
       title: "Error",
       text: "Complete los campos del formulario.",
       timer: 2000,
       showConfirmButton: false
     });
   } else {
     this._atencionPsicologiaService.postRegistrarAtencionPsicologia(this.formulario, this.consentimiento_informado).subscribe(data => {
         if (data['success']) {
           swal({type: "success", title: "Realizado" ,text: "Se ha registrado la atención satisfactoriamente.",timer: 2000, showConfirmButton: false});
           setTimeout(() => {
             this._location.back(); 
           }, 1500);
         } else {
           this.error = data['errores'];
           swal({
             type: "error",
             title: "Error",
             text: "Corrige los errores",
             timer: 2000,
             showConfirmButton: false
           });
         }
       }, err =>{
         let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
         swal({
           type: 'error',
           title: 'Error',
           text: respuesta.msg,
         });
       });
   }
   this.spinner.hide();
 }

 
 onUploadFile(event){
    for(let file of event.files) {
      this.consentimiento_informado = file;
    }
  }

  onClearFile(){
    this.consentimiento_informado=null;
  }
  AtencionEnfermeria(form:NgForm):void{
    
  }

}
