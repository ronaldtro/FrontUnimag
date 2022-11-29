import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Convocatoria } from 'src/app/interfaces/convocatorias.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { Api } from 'src/app/class/api';
import {Location} from '@angular/common';
declare var $:any;


@Component({
  selector: 'app-convocatoria-detalle',
  templateUrl: './convocatoria-detalle.component.html',
  styleUrls: ['./convocatoria-detalle.component.css']
})
export class ConvocatoriaDetalleComponent implements OnInit {
  convocatoria: Convocatoria;
  id:number;
  bolsas:Objeto[]=[];
  estados:Objeto[]=[];
  api:string = Api.dev;

  constructor(private router:Router,
              private route:ActivatedRoute,
              private _convocatoriaService:ConvocatoriaService,
              private spinner: NgxSpinnerService,
              private _location: Location) { }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id = params.id;
      this._convocatoriaService.getConvocatoria(this.id).subscribe(data=>{    
        
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
        this.bolsas = data['bolsas'];
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
      })
    })
  }

    
  goBack():void{
    this._location.back();
  }

  viewDoc(){$('#modelId').modal('show');}

}
