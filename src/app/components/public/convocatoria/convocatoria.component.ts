import { Component, OnInit } from '@angular/core';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import { Api, TiposConvocatorias as TipoConvocatoria } from 'src/app/class/api';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { ActivatedRoute } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-convocatoria',
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css']
})
export class ConvocatoriaComponent implements OnInit {

  convocatorias:any=[];
  etapaActual:any = {};
  api=Api.dev;
  urlDoc: string;
  tipoConvocatoria:TipoConvocatoria | undefined;
  tiposConvocatoria = TipoConvocatoria;

  constructor( private _convocatoriaP :ConvocatoriaPService, private spinner: NgxSpinnerService, private activatedRoute:ActivatedRoute) { 
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params =>{
      
      if(params['tipo_convocatoria'] == 1 || params['tipo_convocatoria'] == 'ayudantias'){
        this.tipoConvocatoria = TipoConvocatoria.AYUDANTIA;
      }else if(params['tipo_convocatoria'] == 3 || params['tipo_convocatoria'] == 'monitorias'){
        this.tipoConvocatoria = TipoConvocatoria.MONITORIA;
      }

      // if(params['tipo_convocatoria'] == 3 || params['tipo_convocatoria'] == 'monitorias' ){
      //   this.tipoConvocatoria = TipoConvocatoria.MONITORIA;
      // }

        this.spinner.show();
      
        this._convocatoriaP.getDatos(this.tipoConvocatoria).subscribe(data => {
          this.convocatorias = data['datosConvocatoria'];
          this.etapaActual = data['etapaActual'];
      
          let today = Date.now();
  
          for(let j = 0; j < this.convocatorias.length; j++){
            let convocatoria = this.convocatorias[j];
            let etapaConvocatoria:any = {};
  
              if(convocatoria.estadoActual == null || convocatoria.estadoActual == ""){
               let peso_etapa_inscripcion = (this.tipoConvocatoria == TipoConvocatoria.AYUDANTIA) ? 3 : 4;
              // let peso_etapa_inscripcion = 4;
                convocatoria.etapas = convocatoria.etapas.filter(function(a) {
                  return a.peso > peso_etapa_inscripcion;
                });
                // let testDates = [{fechaFin:"2019-02-07"}, {fechaFin:"2019-02-13"}, {fechaFin:"2019-02-14"},{fechaFin:"2019-02-18"},{fechaFin:"2019-02-19"}, {fechaFin:"2019-06-07"}, {fechaFin:"2019-06-10"}, {fechaFin:"2019-06-17"}]
      
                convocatoria.etapas.sort(function(a, b) {
                  return new Date(b.fechaFin + "T00:00:00Z").getTime() - new Date(a.fechaFin + "T00:00:00Z").getTime();
                });
                
                etapaConvocatoria = convocatoria.etapas.filter(function(a) {
                  return (today - new Date(a.fechaFin + "T00:00:00Z").getTime()) > 0;
                })[0];
                if(etapaConvocatoria == undefined){
                 let peso_etapa_entrevista = (this.tipoConvocatoria == TipoConvocatoria.AYUDANTIA) ? 4 : 6;
                // let peso_etapa_entrevista = 6;
                  etapaConvocatoria = convocatoria.etapas.filter(function(a) {
                    return a.peso == peso_etapa_entrevista;
                  })[0];
                } else {
                  convocatoria.estadoActual = etapaConvocatoria.nombre;
                  convocatoria.fechaInicio = etapaConvocatoria.fechaInicio;
                  convocatoria.fechaFin = etapaConvocatoria.fechaFin;
                }
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

      
    
    });
    
  }

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
