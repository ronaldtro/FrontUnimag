import { Component, OnInit, ViewChild } from '@angular/core';
import { InscripcionRService } from 'src/app/services/inscripcion-refrigerio.service';
import { NgForm, FormControl } from '@angular/forms';
import { Objeto } from '../../../../../interfaces/objeto.interfaces';
import { InscripcionBeneficio, ConvocatoriaInscripcionBeneficio } from '../../../../../interfaces/inscripcion-beneficio.interface';
import swal from 'sweetalert2';
import {MessageService} from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { InformacionComplementariaEstudianteComponent } from '../../../informacion-complementaria-estudiante/informacion-complementaria-estudiante.component';

@Component({
  selector: 'app-inscripcion-estudiantes',
  templateUrl: './inscripcion-estudiantes.component.html',
  styleUrls: ['./inscripcion-estudiantes.component.css'],
  providers: [MessageService]
})
export class InscripcionEstudiantesComponent implements OnInit {
  @ViewChild(InformacionComplementariaEstudianteComponent) informacionComplementariaEstudiantes!: InformacionComplementariaEstudianteComponent;
  id:number;
  isValid:string="";
  idx:number;
  fallas:number;
  errores:Message[]=[];
  dias:number[]=[];
  etapas: any [] = [];
  eps: any [];
  etapaActual = {
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };

  error:any;

  convocatoria:ConvocatoriaInscripcionBeneficio={
    beneficios:[]
  };

  beneficio : InscripcionBeneficio = null;
    
  estudiante:{
    nombre:"",
    codigo:"",
    identificacion:"";
    email:"";
  }

  constructor(private _inscripcionService:InscripcionRService,
    private route:ActivatedRoute , 
    private messageService: MessageService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(parametros => {
    this.id = parametros['id'];
    this._inscripcionService.getDatos(this.id).subscribe(data=>{

      if(data['success']==true){
        this.convocatoria = data['convocatoria'];
        this.estudiante = data['datosEstudiante'];
        this.etapas = data['etapas'];
        this.fallas = data['fallas'];
        this.eps = data['eps'];
        if (data['etapaActual'] != null) {
          this.etapaActual = data['etapaActual'];
        } else {
          this.etapaActual.id = 0;
        }
        this.spinner.hide();
      }else{
          if(data['errores']){
            this.errores.push(data['errores']);
          }else{
            this.error = data['error'];
          }

        this.spinner.hide();
      }    
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
    })
  });
  }

  save(formulario:NgForm){
    if(!formulario.valid){
      // this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Complete todos los campos del formulario'});
      swal(
        "Error",
        "Complete todos los campos del formulario",
        "error",
      );
      this.errores = [];
      return
    }
    if(this.informacionComplementariaEstudiantes.datosComplementarios.eps == null){
      // this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Debe haber registrada una etapa al menos'});
      swal(
        "Error",
        "Debe seleccionar su EPS",
        "error",
      );
      this.errores = [];
      return
    }

    this.beneficio.codigo = this.estudiante.codigo;

    this.beneficio.diaSelect = Object.assign([], this.dias);

    this.beneficio.idConvocatoria = this.convocatoria.id;

    this.beneficio.datosComplementarios = this.informacionComplementariaEstudiantes.datosComplementarios;

    if(this.beneficio.diaSelect.length==0){
      // this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Debe haber registrada una etapa al menos'});
      swal(
        "Error",
        "Debe seleccionar al menos un día",
        "error",
      );
      this.errores = [];
      return
    }

    this.spinner.show();

    this._inscripcionService.guardarIncripcion(this.beneficio).subscribe(data=>{
      this.errores = [];
      if(data['success']==true){
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });        
        this.errores = [];
        setTimeout(() => {
          this.router.navigate(['/estudiantes', 'dashboard']);
        }, 1500);

      }else{
        for(let i=0; i<data['errores'].length; i++){
          if(data['errores'][i].errores.length>0){
            swal({
              type: 'error',
              title: 'Error',
              text: data['errores'][i].errores[0]['ErrorMessage'],
            });
          }
        }
      }
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
      this.spinner.hide();  
    })
  }

  selectBene(){
    this.dias = [];
  }

  esMenorAEtapaActual(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') < new Date(this.etapaActual.fechaFin + 'T23:59:59Z');
  }

  esMayorAHoy(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') >= new Date();
  }

  esIgual(fechaInicio:string, fechaFin:string){
    return new Date(fechaInicio + 'T23:59:59Z').getTime() === new Date(fechaFin + 'T23:59:59Z').getTime();
  }

  goBack():void{
    this._location.back();
  }

}
