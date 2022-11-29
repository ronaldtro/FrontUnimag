import { Component, OnInit } from '@angular/core';
import { PlazasPService } from 'src/app/services/plazas-p.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Location } from '@angular/common';

@Component({
  selector: 'app-public-evaluado',
  templateUrl: './public-evaluado.component.html',
  styleUrls: ['./public-evaluado.component.css'],
  providers:[MessageService]
})
export class PublicEvaluadoComponent implements OnInit {

  estudiante:any={
    id:null,
    codigo:null,
    nombre:null
  };

  plaza:any={
    idConvocatoria: null,
    plaza: null,
    tipoPlaza: null,
    competencias_requeridas: null,
    perfil:null, 
    unidad:null
  };

  resultado: any [] =[];
  convocatoria: any;


  constructor(private _requisitos : PlazasPService  ,
     private messageService: MessageService , 
     private activatedroute : ActivatedRoute, 
     private router:Router,
     private spinner: NgxSpinnerService,
     private _location: Location  ) 
   { 
    activatedroute.params.subscribe(parametros => {
      if(parametros['id'] !== undefined){
        this.evaluado = parametros['id'];
      }
    });
   }


   puntaje(){
    if(this.resultado != null){
    let total = 0;
    this.resultado .forEach(element => {
        total += ((element.puntaje != undefined ?element.puntaje : 0) * element.porcentaje ) / element.valor_maximo ;
      });
      return total;
    }
    return 0;
  }

  ngOnInit() {
    this.spinner.show();
    this._requisitos.getDatosEvaluado(this.evaluado).subscribe(data => {
      this.estudiante = data['datosEstudiante'];
      this.plaza = data ['datosPlaza'];
      this.resultado = data ['datosEvaluados'];
      this.convocatoria = data ['datosPlaza'].idConvocatoria;

      this.plaza.competencias_requeridas = this.sentenceCase(this.plaza.competencias_requeridas.toLowerCase());
      this.plaza.perfil = this.sentenceCase(this.plaza.perfil.toLowerCase());
      this.plaza.plaza = this.sentenceCase(this.plaza.plaza.toLowerCase());
      for(let i = 0; i < this.resultado.length; i++){
        this.resultado[i].descripcion = this.sentenceCase(this.resultado[i].descripcion.toLowerCase());
      }
      this.spinner.hide();
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.messageService.add({severity:'error', summary: 'Error', detail: respuesta.msg });
      this.spinner.hide();  
    });
  }

  sentenceCase(input) {
    input = ( input === undefined || input === null ) ? '' : input;
    //if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace( /(^|\. * |\- *)([a-z])/g, function(match, separator, char) {
        // return separator + char.toUpperCase();
    return match.toUpperCase();
    });
   }

  evaluado(evaluado: any): any {
    throw new Error("Method not implemented.");
  }
  backClicked() {
    this._location.back();
  }

}
