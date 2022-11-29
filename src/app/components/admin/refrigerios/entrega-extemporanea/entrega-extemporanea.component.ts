import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from 'primeng/api';
import { ConvocatoriaInscripcionBeneficio, InscripcionBeneficio } from 'src/app/interfaces/inscripcion-beneficio.interface';
import { InscripcionRService } from 'src/app/services/inscripcion-refrigerio.service';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm, FormControl } from '@angular/forms';
import {Location} from '@angular/common';
import { Entrega } from '../../../../interfaces/convocatoria-refrigerio.interface';


declare var $:any;

@Component({
  selector: 'app-entrega-extemporanea',
  templateUrl: './entrega-extemporanea.component.html',
  styleUrls: ['./entrega-extemporanea.component.css'],
  providers: [MessageService]
})
export class EntregaExtemporaneaComponent implements OnInit {
  id:number;
  isValid:string="";
  fecha_entrega:string="";
  idx:number;
  errores:Message[]=[];
  error:string=null;
  codigos:string=null;
  arrayCodigos:any[]=[];
  array:string[]=[];
  observacion:string= null;
  codigosInvalidos:any[]=[];
  es: any;

  entrega:Entrega = new Entrega();

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
      this._convocatoriaService.getDatosEntregaExtemporanea().subscribe(data=>{
        if(data['success']==true){
          this.convocatorias = data['convocatorias'];
        }else{
          this.error = data['error'];
        }
        this.spinner.hide();   
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Oops...',
          text: respuesta.msg,
        });
      })

      this.es = {
        firstDayOfWeek: 1,
        dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
        dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
        monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
        monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
        today: 'Hoy',
        clear: 'Limpiar'
    };

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

      this.entrega.codigos = this.arrayCodigos;
      this.entrega.observacion = this.observacion;
      this.entrega.fecha = this.fecha_entrega;
      this.entrega.idConvocatoria = this.convocatoria.id;
      this.entrega.idBeneficio = this.beneficio.id;
      this.entrega.accion = true;
  
      this.spinner.show();
  
      this._convocatoriaService.entregaExtemporanea(this.entrega).subscribe(data=>{
        if(data['success']==true){
          formulario.resetForm();
          this.entrega = new Entrega();
          this.arrayCodigos=[];
          this.array=[];
          this.observacion=null;
          this.convocatoria=null;
          this.beneficio=null;
          this.fecha_entrega=null;
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
          if (data['codigosInvalidos']) {
            this.codigosInvalidos = data['codigosInvalidos']; 
            this.spinner.hide();
            this.saveLog(formulario);
            return;          
          }
          this.arrayCodigos=[];
          this.array=[];
          this.spinner.hide();
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
  
    saveLog(formulario:NgForm){
      swal({
        title:'Guardar Registros',
        text: "Todos los códigos son erróneos, ¿desea guardar los registros fallidos?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'btn btn-success m-1',
        cancelButtonClass: 'btn m-1',
      }).then((res) => {
        if (res.value) {
          this.spinner.show();
          this.entrega.accion = false;
          this.entrega.codigosInvalidos = this.codigosInvalidos;
          this._convocatoriaService.entregaExtemporanea(this.entrega).subscribe(data => {
            if (data['success']) { 
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha realizado la acción satisfactoriamente.",
              timer: 2000,
              showConfirmButton: false
            });
            }
            this.spinner.hide();
          }, err =>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            this.arrayCodigos=[];
            this.array=[];
            this.spinner.hide()
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            });
           
          });        
        } else if (res.dismiss === swal.DismissReason.cancel) {
          // swal({
          //   type: "error",
          //   title: "Cancelado",
          //   text: "Se ha cancelado la acción.",
          //   timer: 2000,
          //   showConfirmButton: false
          // });
        }
      });
      formulario.resetForm();
      this.entrega = new Entrega();
      this.arrayCodigos=[];
      this.array=[];
      this.observacion=null;
      this.convocatoria=null;
      this.beneficio=null;
      this.fecha_entrega=null;
    }


    selectConvo(){
      this.beneficio = null;
    }

    // validation(control:FormControl){
    //   if(control.valid==false){
    //     this.isValid="is-invalid";
    //   }else{
    //     this.isValid="";
    //   }
    // }
  
    goBack():void{
      this._location.back();
    }

    modalCodigosErrores() {
      $('#modalErrores').modal('show');
    }
}
