import { Component, OnInit } from '@angular/core';
import { InscripcionRService } from 'src/app/services/inscripcion-refrigerio.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import {MessageService} from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { ConvocatoriaInscripcionBeneficio, InscripcionBeneficio } from 'src/app/interfaces/inscripcion-beneficio.interface';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';

declare var $:any;

@Component({
  selector: 'app-inscripcion-administrativa',
  templateUrl: './inscripcion-administrativa.component.html',
  styleUrls: ['./inscripcion-administrativa.component.css'],
  providers: [MessageService]
})
export class InscripcionAdministrativaComponent implements OnInit {
  id:number;
  isValid:string="";
  idx:number;
  errores:Message[]=[];
  dias:number[]=[];
  codigos:string=null;
  arrayCodigos:any[]=[];
  array:string[]=[];
  validacion:boolean = false;
  file_soporte?:File;
  observacion:string= null;
  codigosInvalidos:any[]=[];

  convocatorias:ConvocatoriaInscripcionBeneficio[]=[];

  convocatoria:ConvocatoriaInscripcionBeneficio=null;

  beneficio : InscripcionBeneficio = null;

  constructor(private _inscripcionService:InscripcionRService,
    private _convocatoriaService:ConvocatoriaRefrigerioService,
    private route:ActivatedRoute , 
    private messageService: MessageService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

    ngOnInit() {
      this.spinner.show();
      this._convocatoriaService.getInscripcionAdministrativo().subscribe(data=>{
        if(data['success']==true){
          this.convocatorias = data['convocatorias'];
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

      this.array = this.codigos.split(",");

      for (let i = 0; i < this.array.length; i++) {
        this.arrayCodigos.push(this.array[i].trim())   
      }

      for (let i = 0; i < this.arrayCodigos.length; i++) {
        if (this.arrayCodigos[i].length == 0) {
          this.arrayCodigos.splice(i,1);
        }
      }
  
      this.beneficio.diaSelect = Object.assign([], this.dias);

      if(this.beneficio.diaSelect.length==0){
        swal(
          "Error",
          "Debe seleccionar al menos un día",
          "error",
        );
        this.errores = [];
        return
      }

      let formData = new FormData();

      for (let index = 0; index < this.arrayCodigos.length; index++) {
        formData.append('codigos[]', ""+this.arrayCodigos[index]);   
      }
      
      if (this.validacion == true) {
        formData.append("file_soporte", this.file_soporte);
        formData.append("observacion", ""+this.observacion);
      }

      for (let index = 0; index < this.beneficio.diaSelect.length; index++) {
        formData.append('diaSelect[]', ""+this.beneficio.diaSelect[index]);   
      }

      formData.append("validacion", ""+this.validacion);
      formData.append("idConvocatoria", ""+this.convocatoria.id);
      formData.append('idBeneficio', ""+this.beneficio.id);
  
      this.spinner.show();
  
      this._convocatoriaService.guardarInscripcion(formData).subscribe(data=>{
        if(data['success']==true){
          formulario.resetForm();
          this.arrayCodigos=[];
          this.array=[];
          this.validacion = false;
          this.dias=[];
          this.codigos=null;
          this.file_soporte=null;
          this.observacion=null;
          this.convocatoria=null;
          this.beneficio=null;
          this.spinner.hide();
          swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
          });
          
          if (data['codigosInvalidos']) {
            this.codigosInvalidos = data['codigosInvalidos'];           
          }
          
          this.errores = [];
        }else{
          this.spinner.hide();
          this.arrayCodigos=[];
          this.array=[];
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
        
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.arrayCodigos=[];
        this.array=[];
        this.spinner.hide();
        swal({
          type: 'error',
          title: 'Oops...',
          text: respuesta.msg,
        });
          
      })
    }
  
    selectBene(){
      this.dias = [];
      this.validacion = false;
    }

    selectConvo(){
      this.beneficio = null;
      this.validacion = false;
    }
  
    goBack():void{
      this._location.back();
    }

    onUploadFile(event){
      for(let file of event.files) {
        this.file_soporte=file;
      }
    }
  
    onClearFile(){
      this.file_soporte=null;
    }

    modalCodigosErrores() {
      $('#modalErrores').modal('show');
    }

}
