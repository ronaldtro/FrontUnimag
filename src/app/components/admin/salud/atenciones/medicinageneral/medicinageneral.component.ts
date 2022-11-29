import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { AtencionService } from 'src/app/services/atencion.service';
import { NgForm } from '@angular/forms';
import { Antecedentes, Formulario, Cie10, Medicamento} from 'src/app/interfaces/atencion';
import { from } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import {Location} from '@angular/common';
import { PROFILE_BY } from 'src/app/class/api';


@Component({
  selector: 'app-medicinageneral',
  templateUrl: './medicinageneral.component.html',
  styleUrls: ['./medicinageneral.component.css']
})
export class MedicinageneralComponent implements OnInit, AfterContentChecked {
  
  id: any;
  bandera:any;
  dateNow: Date;

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
  };

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

 

  formulario:Formulario = new Formulario();
 

  //antecedentesForm:Antecedentes [] = [];
  tipoExamenes:any[] = [];
  antecedentes:any[] = [];
  examen_Fisico:any[] = [];
  tiposAtenciones:any[] = [];
  tiposPacientes: any [] = [];
  cie_10:any[] = [];

  medicamentos:any[] =[];

  // medicamento:Medicamento;
  medicamento:any ={
    nombre_medicamento:null,
    Observacion_medicamento:null
  };

  Medicamentos:any[] = [];
  profile_by = PROFILE_BY.ID_Cita;
  cieValue:Cie10;
  aux_cie10:Cie10[]=[];
  messageService: any;
  errores: any[];
  error: any[] = [];
  aux_cita: any;

  constructor( private route: ActivatedRoute, 
               private _atencionService : AtencionService,
               private changeDetector: ChangeDetectorRef ,
               private spinner: NgxSpinnerService,
               private _location: Location ) { }

               
  ngOnInit() {
    this.spinner.show();
    this.dateNow = new Date();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.bandera = params["bandera"];
      if (this.bandera == 0) {
          this._atencionService.getDatosAtencion(this.id).subscribe(data=>{    
          this.atencion=data['objRetornado']['cita'];
          this.aux_cita = JSON.parse(data['objRetornado']['datosAtencion']);
          this.formulario.id = this.atencion.id_paciente;
          this.formulario.fecha_atencion = this.atencion.fecha; 
          this.antecedentes = this.aux_cita.objRetornado.antecedentes; 
          this.tiposAtenciones = this.aux_cita.objRetornado.tipos_atenciones;
          this.tiposPacientes = this.aux_cita.objRetornado.tipos_pacientes;
          this.examen_Fisico = this.aux_cita.objRetornado.fisico;    
          this.tipoExamenes = this.aux_cita.objRetornado.tipo_examenes; 
          this.cie_10 = this.aux_cita.objRetornado.cie_10 
          this.medicamentos = this.aux_cita.objRetornado.medicamentos; 
          this.formulario.examen_fisico_item =  this.examen_Fisico;   
          this.formulario.examenesClinico = this.tipoExamenes; 
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
        this._atencionService.getDatosAtencionN(this.id).subscribe(data=>{        
          this.atencion=data['objRetornado']['cita'];
          this.aux_cita = JSON.parse(data['objRetornado']['datosAtencion']);
          this.formulario.id = this.atencion.id_paciente;
          this.formulario.fecha_atencion = this.atencion.fecha; 
          this.formulario.examen_fisico_item =  this.examen_Fisico;   
          this.formulario.examenesClinico = this.tipoExamenes; 

          this.antecedentes = this.aux_cita.objRetornado.antecedentes; 
          this.tiposAtenciones = this.aux_cita.objRetornado.tipos_atenciones;
          this.tiposPacientes = this.aux_cita.objRetornado.tipos_pacientes;
          this.examen_Fisico = this.aux_cita.objRetornado.fisico;    
          this.tipoExamenes = this.aux_cita.objRetornado.tipo_examenes; 
          this.cie_10 = this.aux_cita.objRetornado.cie_10 
          this.medicamentos = this.aux_cita.objRetornado.medicamentos; 
    
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

        
  }

  

  requiredGineco(){
    let keys = Object.keys(this.formulario.examen_gineco);
    for(let i = 0; i < keys.length; i++){
      if (this.formulario.examen_gineco[keys[i]] != null ) {
        return true;
        break;
      }
    }
    return false;
  }

  ingresarCodigos(obj){
    let copy = Object.assign({}, obj);
    for (let i = 0; i < this.aux_cie10.length; i++) {
      if (this.aux_cie10[i].codigo == copy.codigo) {
        swal({
          type: 'error',
          title: 'Error',
          text:  'El código ya ha sido ingresado',
        });
        return;
      }
    }
    if (copy.codigo != null) {
      // console.log(copy);
      this.aux_cie10.push(copy);
    }else{
      swal({
        type: 'error',
        title: 'Error',
        text:  'Seleccione una opción',
      });
      return;
    }
  }

  ingresarMedicamento(obj){
    let copy = Object.assign({}, obj);
    
    if (copy.nombre_medicamento.nombre != null && copy.Observacion_medicamento != null) {
      copy.nombre_medicamento = obj.nombre_medicamento.nombre;
    }
      // debugger;
    for (let i = 0; i < this.Medicamentos.length; i++) {
      if (this.Medicamentos[i].nombre_medicamento == copy.nombre_medicamento) {
        swal({
          type: 'error',
          title: 'Error',
          text:  'El medicamento ya se encuentra registrado',
        });
        return;
      }
    }
    if (copy.nombre_medicamento != null) {

      this.Medicamentos.push(copy);
    }else{
      swal({
        type: 'error',
        title: 'Error',
        text:  'Ingrese todos los campos',
      });
      return;
    }
   this.medicamento = {};
  }



  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  AtencionPaciente(forma: NgForm) {
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
      this.spinner.hide();
      return
    } else {

      if (this.aux_cie10.length == 0 || this.aux_cie10 == null ) {
        swal({
          type: "error",
          title: "Error",
          text: "Debe ingresar al menos un código cie 10.",
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      if (this.Medicamentos.length == 0 || this.Medicamentos == null ) {
        swal({
          type: "error",
          title: "Error",
          text: "Debe ingresar al menos un medicamento.",
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      // debugger;
      // filtro de los examenes fisicos
      let tempExamen = Object.assign([], this.formulario.examen_fisico_item);      
      this.formulario.examen_fisico_item = this.formulario.examen_fisico_item.filter((item:any) => {return item.estado != undefined});

      // filtro examens clinicos
      let tempClinico = Object.assign([], this.formulario.examenesClinico);      
      this.formulario.examenesClinico = this.formulario.examenesClinico.filter((item:any) => {return item.observacion != undefined});
      
      // cie 10
      let tempCie10 = Object.assign([], this.aux_cie10);
      this.formulario.cie10 = tempCie10;

        // medicamentos
      let tempMedicamentos = Object.assign([], this.Medicamentos);
      this.formulario.medicamentos = tempMedicamentos;

      this._atencionService.postRegistrarAtencion(this.formulario).subscribe(data => {
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

}

