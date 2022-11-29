import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvocatoriaRefrigerioService } from 'src/app/services/convocatoria-refrigerio.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConvocatoriaRefrigerio } from 'src/app/interfaces/convocatoria-refrigerio.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { Api } from 'src/app/class/api';
import { Tiempo } from 'src/app/class/tiempo';
declare var $:any;

@Component({
  selector: 'app-detalle-convocatorias-refrigerios',
  templateUrl: './detalle-convocatorias-refrigerios.component.html',
  styleUrls: ['./detalle-convocatorias-refrigerios.component.css']
})
export class DetalleConvocatoriasRefrigeriosComponent implements OnInit {
  convocatoria:ConvocatoriaRefrigerio=null;
  id:number;
  bolsas:Objeto[]=[];
  estados:Objeto[]=[];
  api:string = Api.dev;
  tiempo:any[] = Tiempo.tiempo;

  constructor(private router:Router,
              private route:ActivatedRoute,
              private _convocatoriaService:ConvocatoriaRefrigerioService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.id = params.id;
      this._convocatoriaService.getConvocatoria(this.id).subscribe(data=>{   
        let fecha:any[];
        fecha = data['convocatoria'][0].fecha_expedicion.split("-")

        data['convocatoria'][0].fecha_expedicion = new Date(fecha[0], fecha[1]-1, fecha[2] );
        
        this.convocatoria = data['convocatoria'][0];
        this.bolsas = data['bolsas'];
        this.estados = data['estados'];

        for (let j = 0; j < this.convocatoria.beneficios.length; j++) {
          for (let i = 0; i < this.tiempo.length; i++) {
            if (this.tiempo[i].id == this.convocatoria.beneficios[j].hora_inicio) {
              this.convocatoria.beneficios[j].nombre_inicio = this.tiempo[i].nombre;
              break;
            }    
          }
      
          for (let i = 0; i < this.tiempo.length; i++) {
            if (this.tiempo[i].id == this.convocatoria.beneficios[j].hora_fin) {
              this.convocatoria.beneficios[j].nombre_fin = this.tiempo[i].nombre;
              break;
            }    
          }
        }      

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

  viewDoc(){$('#modelId').modal('show');}

  viewDocRe(){$('#modelId2').modal('show');}


}
