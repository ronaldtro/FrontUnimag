import { Component, OnInit } from '@angular/core';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import {Location} from '@angular/common';
import { Api } from 'src/app/class/api';
import { NgForm } from '@angular/forms';

declare var $;

@Component({
  selector: 'app-detalles-grupo',
  templateUrl: './detalles-grupo.component.html',
  styleUrls: ['./detalles-grupo.component.css']
})
export class DetallesGrupoComponent implements OnInit {

  /**
   * Contiene los datos de un grupo seleccionado.
   */
  grupo : any = {};
 
  diaHorario : any = {idDia:null};
  listaDias : any[] = [];
  listaNivelesFormativos : any[] = [];
  listaDisciplinas : any[] = [];

  api:string = Api.dev;

  constructor(private _gruposService:GruposDeportivosService, 
    private router:Router,
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location) {
    }

    /**
     * Obtiene los datos de un grupo seleccionado.
     */
    ngOnInit() {
      this.spinner.show();

      this.route.params.subscribe(params=>{
      
        this._gruposService.getGrupo(params.id).subscribe(data => {
          this.grupo = data['grupo'];
     
          this.spinner.hide();
  
        }, err =>{
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide();
        });
    });

    this._gruposService.getDatosGrupo().subscribe(data => {
        
      this.listaNivelesFormativos = data['nivelesFormativos'];
      this.listaDisciplinas = data['disciplinas'];
      this.listaDias = data['dias'];
      this.spinner.hide();

    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });

    }

  goBack():void{
    this._location.back();
  }

  /**
   * Abre un modal para mostrar la imagen del grupo.
   */
  verImagen(){
    $('#modelId').modal('show');
  }

  guardarGrupo(form:NgForm){
    
  }

}
