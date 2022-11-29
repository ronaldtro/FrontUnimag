import { Component, OnInit, ViewChild } from '@angular/core';
import { InscripcionRService } from 'src/app/services/inscripcion-refrigerio.service';
import { Api } from 'src/app/class/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {Location} from '@angular/common';
import { ConvocatoriaInscripcionBeneficio, InscripcionBeneficio } from 'src/app/interfaces/inscripcion-beneficio.interface';
import { InformacionComplementariaEstudianteComponent } from '../../../informacion-complementaria-estudiante/informacion-complementaria-estudiante.component';
declare var $:any;

@Component({
  selector: 'app-editar-inscripcion',
  templateUrl: './editar-inscripcion.component.html',
  styleUrls: ['./editar-inscripcion.component.css'],
  providers: [MessageService]
})
export class EditarInscripcionComponent implements OnInit {
  convocatoria:ConvocatoriaInscripcionBeneficio={
    beneficios:[]
  };
  estudiante:{
    nombre:"",
    codigo:"",
    identificacion:"";
    email:"";
  };
  etapas:any[]=[];
  convocatoriaId:number;
  beneficioId:number;
  fallas:number;
  etapaActual={
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };
  errores:Message[]=[];
  beneficio : InscripcionBeneficio = null;
  dias:number[]=[];
  auxDias:number[]=[];
  error:any;
  @ViewChild(InformacionComplementariaEstudianteComponent) informacionComplementariaEstudiantes!: InformacionComplementariaEstudianteComponent;

  constructor(private _inscripcionService:InscripcionRService,
    private route:ActivatedRoute , 
    private messageService: MessageService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params =>{
      this.beneficioId = params['beneficio'];
      this.convocatoriaId = params['id'];
      this._inscripcionService.getDatosEditar(params['id'], params['beneficio']).subscribe(data=>{

        if(data['success']==true){
          this.convocatoria = data['convocatoria'];
          this.estudiante = data['datosEstudiante'];
          this.etapas = data['etapas'];
          this.fallas = data['fallas'];
          //this.beneficio = data['beneficio'];
          this.dias = data['dias'];
          this.auxDias = data['dias'];
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
        for (let i = 0; i < this.convocatoria.beneficios.length; i++) {
          if (this.convocatoria.beneficios[i].id == this.beneficioId) {
            this.beneficio = this.convocatoria.beneficios[i];
            break;     
          }
        }  
          
      }, err=> {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()    
      });
    });
    this.spinner.show();
    this.route.params.subscribe(params =>{
      this.beneficioId = params['beneficio'];
      this.convocatoriaId = params['id'];
      this._inscripcionService.getDatosComplementariosEstudiante(params['id']).subscribe(data=>{

        if(data['success']==true){
          this.informacionComplementariaEstudiantes.datosComplementarios = data['datosComplementarios'];
          if(data['datosComplementarios']['eps'] < 1){
            this.informacionComplementariaEstudiantes.datosComplementarios.eps = null;
          }
        }else{
            if(data['errores']){
              this.errores.push(data['errores']);
            }else{
              this.error = data['error'];
            }
  
          this.spinner.hide();
        }          
      }, err=> {
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()    
      });
    });
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

  selectBene(){
    if (this.beneficio.id == this.beneficioId) {
      this.dias = this.auxDias;
    } else {
      this.dias = []; 
    } 
  }

  save(formulario:NgForm){
    if(!formulario.valid){
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
      swal(
        "Error",
        "Debe seleccionar al menos un día",
        "error",
      );
      this.errores = [];
      return
    }

    this.spinner.show();

    this._inscripcionService.editarIncripcion(this.beneficio).subscribe(data=>{
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

}
