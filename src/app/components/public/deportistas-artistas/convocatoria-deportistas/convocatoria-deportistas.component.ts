import { Component, OnInit } from '@angular/core';
import { Api } from 'src/app/class/api';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';

declare var $;

@Component({
  selector: 'app-convocatoria-deportistas',
  templateUrl: './convocatoria-deportistas.component.html',
  styleUrls: ['./convocatoria-deportistas.component.css']
})

export class ConvocatoriaDeportistasComponent implements OnInit {

  /**
   * Contiene todas las convocatorias activas.
   */
  convocatorias:any=[];
  
  /**
   * Es la url del documento de soporte.
   */
  urlDoc: string;

  api=Api.dev;

  constructor(private _convocatoriaP :ConvocatoriaPService, 
    private spinner: NgxSpinnerService, 
    private activatedRoute:ActivatedRoute) { }

  /**
   * Obtiene las convocatorias que se encuentran activas.
   * 
   */  
  ngOnInit() {
    this.spinner.show();
      this._convocatoriaP.getDatosDeportistas().subscribe(data => {
        this.convocatorias = data['datosConvocatoria'];
        let today = Date.now();
        
        for(let j = 0; j < this.convocatorias.length; j++){
          let convocatoria = this.convocatorias[j];
          let etapaConvocatoria:any = {};

            if(convocatoria.estadoActual == null || convocatoria.estadoActual == ""){
              
              convocatoria.etapas.sort(function(a, b) {
                return new Date(b.fechaFin + "T00:00:00Z").getTime() - new Date(a.fechaFin + "T00:00:00Z").getTime();
              });
            }
        }
        this.spinner.hide();

      }, err =>{
        this.spinner.hide();
        let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
      });
  }

  /**
   * Abre modal para ver el soporte de la convocatoria.
   * 
   * @param doc 
   */
  viewDoc( doc:string ){
    this.urlDoc = doc;
    $('#modelId').modal('show');
  }

  getHowLongWasPublished(dateStr:string){
    let today = new Date().getTime();
    let publishedDate = new Date(dateStr).getTime();
    let diference = today - publishedDate;
    if(diference === 0){
      return `Se publicó hoy`;
    }
    let mins = Math.floor(diference / 60000);
    let hrs = Math.floor(mins / 60);
    let days = Math.floor(hrs / 24);
    let months = Math.floor(days / 30);
    let yrs = Math.floor(days / 365);
    
    if(mins < 60){
      return `Publicado hace ${mins} minuto(s)`;
    }else if(hrs < 24){
      return `Publicado hace ${hrs} hora(s)`;
    }else if(days < 31){
      return `Publicado hace ${days} día(s)`;
    }else if(months < 13){
      return `Publicado hace ${months} mes(es)`;
    }else{
      return `Publicado hace ${yrs} año(s)`;
    }
  }

  esMayorAHoy(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') >= new Date();
  }

  esIgual(fechaInicio:string, fechaFin:string){
    return new Date(fechaInicio + 'T23:59:59Z').getTime() === new Date(fechaFin + 'T23:59:59Z').getTime();
  }

}
