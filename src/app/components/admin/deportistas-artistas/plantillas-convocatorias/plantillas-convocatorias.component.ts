import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Location} from '@angular/common';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Api } from 'src/app/class/api';
import { FileUpload } from 'primeng/primeng';


declare var $:any;

@Component({
  selector: 'app-plantillas-convocatorias',
  templateUrl: './plantillas-convocatorias.component.html',
  styleUrls: ['./plantillas-convocatorias.component.css']
})
export class PlantillasConvocatoriasComponent implements OnInit {

  @ViewChild('carta') cartaInput:FileUpload;
  @ViewChild('hoja_de_vida') hojaDeVidaInput:FileUpload;

  plantilla : any = {};

  listaPlantillas : any[] = [];

  errores:object[] = [];

  ruta_plantilla:any;

  api:string = Api.dev;

  constructor(private _convocatoriaService : ConvocatoriasArtistasDeportistasService,
     private spinner: NgxSpinnerService,
     private _location: Location) { }

  /**
   * Obtiene los formatos de soporte que deben adjuntar los estudiantes al momento de realizar
   * la inscripción a la convocatoria para becas.
   */   
  ngOnInit() {
    this._convocatoriaService.getPlantillas().subscribe(data => {
      this.listaPlantillas = data['plantillas'];
     
    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    });
  }

  /**
   * Se guardan las plantillas que el administrador cargue.
   * 
   * @param formulario 
   */
  guardarPlantilla(formulario : NgForm){
    if(!formulario.valid){
      return
    }

    this.spinner.show();
    this._convocatoriaService.guardarPlantillas(this.plantilla).subscribe(data=>{
      
      this.errores = [];
      if(data['success']){
        swal({
          title: "Realizado",
          text: "Acción realizada satisfactoriamente.",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        });
        
        this.cartaInput.clear();
        this.hojaDeVidaInput.clear();

        this.listaPlantillas = [];
        this.listaPlantillas = data['plantillas'];
        
      }else{
        this.errores = data['errores'];
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

  goBack():void{
    this._location.back();
  }

  onUploadFileCarta(event){
    for(let file of event.files) {
      this.plantilla.carta=file;
    }
  }
  
  onClearFileCarta(){
    this.plantilla.carta=null;
  }

  onUploadFileHojaDeVida(event){
    for(let file of event.files) {
      this.plantilla.hoja_de_vida=file;
    }
  }
  
  onClearFileHojaDeVida(){
    this.plantilla.hoja_de_vida=null;
  }

}