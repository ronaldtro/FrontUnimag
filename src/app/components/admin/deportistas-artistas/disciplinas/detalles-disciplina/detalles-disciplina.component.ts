import { Component, OnInit } from '@angular/core';
import { DisciplinasService } from 'src/app/services/disciplina.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { Api } from 'src/app/class/api';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';

declare var $;
declare var JQuery;

@Component({
  selector: 'app-detalles-disciplina',
  templateUrl: './detalles-disciplina.component.html',
  styleUrls: ['./detalles-disciplina.component.css']
})
export class DetallesDisciplinaComponent implements OnInit {
  
  api:string = Api.dev;
  
  /**
   * Contiene los datos de la disciplina que se quieren ver.
   */
  disciplina : any = {};
  
  srcImagenGrande : string;

  /**
   * Contiene la imagen que el usuario seleccionó.
   */
  imagenGaleria : any = {};
  
  /**
   * Contienen las modalidades que existen en la base de datos.
   */
  listaModalidades : any = {};
  
  /**
   * Se usa para realizar la paginación de la galeria de imagenes.
   */
  p : number = 1;
          
  constructor(private _disciplinaService:DisciplinasService, 
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location) {
    }
    
    /**
     * Obtiene los datos de la disciplina y la lista de modalidades 
     * que existen en la base de datos.
     */
    ngOnInit() {
      this.spinner.show();

      this.route.params.subscribe(params=>{
      this._disciplinaService.getDisciplina(params.id).subscribe(data => {
        this.disciplina = data['disciplina'];
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

    this._disciplinaService.getModalidades().subscribe(data => {
      this.listaModalidades = data['modalidades'];
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
     * Abre el modal que permite ver la imagen de perfil de la disciplina.
     */
    verImagen(){
      $('#modelId').modal('show');
    }
    
    /**
     * Abre un modal mostrando una imagen de la galeria.
     * @param imagen Recibe la url de la imagen
     */
    verImagenGaleria(imagen){
      this.srcImagenGrande = imagen;
      $('#imagenGrandeModal').modal('show');
    }

    guardarDisciplina(form:NgForm){
      
    }

}