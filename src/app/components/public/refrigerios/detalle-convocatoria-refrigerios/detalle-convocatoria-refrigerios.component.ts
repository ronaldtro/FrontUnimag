import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvocatoriaPService } from 'src/app/services/convocatoria-p.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConvocatoriaRefrigerio } from 'src/app/interfaces/convocatoria-refrigerio.interface';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Objeto } from 'src/app/interfaces/objeto.interfaces';
import { Api } from 'src/app/class/api';
declare var $:any;

@Component({
  selector: 'app-detalle-convocatoria-refrigerios',
  templateUrl: './detalle-convocatoria-refrigerios.component.html',
  styleUrls: ['./detalle-convocatoria-refrigerios.component.css']
})
export class DetalleConvocatoriaRefrigeriosComponent implements OnInit {
  convocatoria: ConvocatoriaRefrigerio;
  id:number;
  bolsas:Objeto[]=[];
  estados:Objeto[]=[];
  api:string = Api.dev;

  constructor(private router:Router,
    private route:ActivatedRoute,
    private _convocatoriaService:ConvocatoriaPService,
    private spinner: NgxSpinnerService) { }

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
  
    viewDoc(){$('#modelId').modal('show');}

}
