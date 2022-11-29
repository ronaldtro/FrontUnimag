import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Convocatoria } from 'src/app/interfaces/convocatorias.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { ConvocatoriasArtistasDeportistasService } from 'src/app/services/convocatorias-artistas-deportistas.service';
import {Location} from '@angular/common';
import { Api } from 'src/app/class/api';

declare var $:any;
 
@Component({
  selector: 'app-convocatoria-detalle',
  templateUrl: './convocatoria-detalle.component.html',
  styleUrls: ['./convocatoria-detalle.component.css']
})

export class ConvocatoriaDetalleArtistasDeportistasComponent implements OnInit {

  /**
   * Contiene los datos de la convocatoria seleccionada.
   */
  convocatoria: any = {};
  
  documentoConvocatoria:string;

  /**
   * Contiene los estados de la convocatoria. Los estados son los nombres de las 
   * diferentes etapas de una convocatoria.
   */
  estados: Objeto[]=[];

  api:string = Api.dev;

  constructor(private router:Router,
              private route:ActivatedRoute,
              private _convocatoriaService:ConvocatoriasArtistasDeportistasService,
              private spinner: NgxSpinnerService,
              private _location: Location) { }

  /**
   * Se muestran los datos de una convocatoria que el usuario quiera ver.
   */
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{

      this._convocatoriaService.getConvocatoriaPorId(params.id).subscribe(data=>{    
  
        let fecha:any[];
        fecha = data['convocatoria'][0].fecha_expedicion.split("-")

        data['convocatoria'][0].fecha_expedicion = new Date(fecha[0], fecha[1]-1, fecha[2] );
        
        for(let i=0; i < data['convocatoria'][0].etapas.length; i++){
          fecha = data['convocatoria'][0].etapas[i].fecha_inicio.split("-");
          data['convocatoria'][0].etapas[i].fecha_inicio = new Date(fecha[0], fecha[1]-1, fecha[2], fecha[3] , fecha [4]);
          fecha = data['convocatoria'][0].etapas[i].fecha_fin.split("-");
          data['convocatoria'][0].etapas[i].fecha_fin = new Date(fecha[0], fecha[1]-1, fecha[2], fecha[3] , fecha [4]);          
        }

        this.convocatoria = data['convocatoria'][0];
        this.estados = data['estados'];

        for(let i = 0; i < this.convocatoria.etapas.length; i++){
          for(let j = 0; j < data['estados'].length; j++){

            if(this.convocatoria.etapas[i].estado_id == data['estados'][j].id){

              this.convocatoria.etapas[i].peso_etapa = data['estados'][j].peso;
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
      });
    });
  }

  viewDoc(documento:number){
    if(documento === 0){
      this.documentoConvocatoria = this.convocatoria.soporte;
    }

    if(documento === 1){
      this.documentoConvocatoria = this.convocatoria.resolucion;
    }

    if(documento === 2){
      this.documentoConvocatoria = this.convocatoria.listaSeleccionados;
    }
   
    $('#modelId').modal('show');
  }

  goBack(){
    this._location.back();
  }
}