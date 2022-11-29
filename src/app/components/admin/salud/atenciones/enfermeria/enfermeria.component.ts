import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cie10, enfermeria } from 'src/app/interfaces/atencion';
import { ActivatedRoute } from '@angular/router';
import { AtencionService } from 'src/app/services/atencion.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {Location} from '@angular/common';
import { PROFILE_BY } from 'src/app/class/api';

@Component({
  selector: 'app-enfermeria',
  templateUrl: './enfermeria.component.html',
  styleUrls: ['./enfermeria.component.css']
})
export class EnfermeriaComponent implements OnInit {
  datosAtencion: any;
  [x: string]: any;
  tiposAtenciones:any[] = [];
  tiposPacientes: any [] = [];

  tiposAtencionEnfermeria:any [] = [];

  cie_10:any[] = [];
  medicamentos:any[] =[];
  Medicamentos:any[] =[];
  tipos_medicamentos:any[] = [];
  cieValue:Cie10;
  aux_cie10:Cie10[]=[];
  messageService: any;
  errores: any[];
  error: any[] = [];
  dateNow: Date;
  id: any;
  bandera:any;


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

  // medicamento:Medicamento2;
  medicamento:any = {
    nombre_medicamento:null,
    Observacion_medicamento:null,
    procedimientos:null,
    tipoMedicamento:null,
  };

  profile_by = PROFILE_BY.ID_Cita;

  formulario:enfermeria = new enfermeria();

  constructor( 
    private route: ActivatedRoute, 
    private _atencionEnfermeriaService : AtencionService,
    private changeDetector: ChangeDetectorRef ,
    private spinner: NgxSpinnerService,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.dateNow = new Date();
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.bandera = params["bandera"];
      if (this.bandera == 0) {
      this._atencionEnfermeriaService.getDatosAtencion(this.id).subscribe(data=>{     
        this.atencion=data['objRetornado']['cita'];   
        this.datosAtencion = JSON.parse(data['objRetornado']['datosAtencion']);
        this.tiposAtenciones = this.datosAtencion.objRetornado.tipos_atenciones; 
        this.tiposPacientes = this.datosAtencion.objRetornado.tipos_pacientes;
        this.cie_10 = this.datosAtencion.objRetornado.cie_10;       
        this.medicamentos = this.datosAtencion.objRetornado.medicamentos;    
        this.tiposAtencionEnfermeria = this.datosAtencion.objRetornado.tipos_de_atencion_enfermeria;
        this.tipos_medicamentos = this.datosAtencion.objRetornado.tipoMedicamentos;  
        this.formulario.id_paciente = this.atencion.id_paciente;
        this.formulario.fecha_atencion = this.atencion.fecha; 
        this.formulario.id_cita =  params["id"];
        this.formulario.tipos_de_atencion_enfermeria = null;
        this.formulario.tipo_paciente = null;

        console.log(this.atencion);
        // console.log("tipo de pacientes",this.tiposPacientes);
        // console.log("tipo de medicamento",   this.tipos_medicamentos);
  
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
    } else{
      this.profile_by = PROFILE_BY.ID_Paciente;
      this._atencionEnfermeriaService.getDatosAtencionN(this.id).subscribe(data=>{     
        this.atencion=data['objRetornado']['cita'];   
        this.datosAtencion = JSON.parse(data['objRetornado']['datosAtencion']);
        this.tiposAtenciones = this.datosAtencion.objRetornado.tipos_atenciones; 
        this.tiposPacientes = this.datosAtencion.objRetornado.tipos_pacientes;
        this.cie_10 = this.datosAtencion.objRetornado.cie_10;       
        this.medicamentos = this.datosAtencion.objRetornado.medicamentos;    
        this.tiposAtencionEnfermeria = this.datosAtencion.objRetornado.tipos_de_atencion_enfermeria;
        this.tipos_medicamentos = this.datosAtencion.objRetornado.tipoMedicamentos;  
        this.formulario.id_paciente = this.atencion.id_paciente;
        this.formulario.fecha_atencion = this.atencion.fecha; 
        this.formulario.id_cita =  params["id"];
        this.formulario.tipos_de_atencion_enfermeria = null;
        this.formulario.tipo_paciente = null;

        //console.log(this.atencion);
        // console.log("tipo de pacientes",this.tiposPacientes);
        // console.log("tipo de medicamento",   this.tipos_medicamentos);
  
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

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  requiredSexual(){
    let keys = Object.keys(this.formulario.sexual);
    for(let i = 0; i < keys.length; i++){
      if (this.formulario.sexual[keys[i]] != null ) {
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

// funcion de guardar la atencion de enfermería
  AtencionEnfermeria(forma: NgForm) {
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
    //  if (this.Medicamentos.length == 0 || this.Medicamentos == null ) {
    //   swal({
    //     type: "error",
    //     title: "Error",
    //     text: "Debe ingresar al menos un medicamento.",
    //     timer: 2000,
    //     showConfirmButton: false
    //   });
    //   return;
    // }
       
     // cie 10
     let tempCie10 = Object.assign([], this.aux_cie10);
     this.formulario.cie10 = tempCie10;
   
       // medicamentos
     let tempMedicamentos = Object.assign([], this.Medicamentos);
     this.formulario.medicamentos = tempMedicamentos;
      
     this._atencionEnfermeriaService.postRegistrarAtencionEnfermeria(this.formulario).subscribe(data => {
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


// funcion que estrae el nombre de los medicamentos
tipoMed(id: number){
  var resp = '';
  for (var i = 0; i < this.tipos_medicamentos.length; i++) {
      if (this.tipos_medicamentos[i].id == id) {
          resp = this.tipos_medicamentos[i].nombre;
      }   
  }
  return resp;
  console.log(this.tipos_medicamentos[i].nombre);
}; 

disableOption(id):boolean{
  if (id==1 && this.atencion.sexo) {
    return true;
  } 
    return false;
}

}
