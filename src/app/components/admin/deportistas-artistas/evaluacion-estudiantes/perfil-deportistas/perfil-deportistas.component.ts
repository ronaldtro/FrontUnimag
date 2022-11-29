import { Component, OnInit, Input } from '@angular/core';
import { EvaluarEstudiantesDeportistasService } from 'src/app/services/evaluar-estudiantes-deportistas.service';
import { Api } from 'src/app/class/api';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';

declare var $:any; 

@Component({
  selector: 'app-perfil-deportistas',
  templateUrl: './perfil-deportistas.component.html',
  styleUrls: ['./perfil-deportistas.component.css']
})
export class PerfilDeportistasComponent implements OnInit {

  @Input() idInscripcion:number;
  inscripcion : any = {};
  rutaArchivo : string;
  api:string = Api.dev;

  constructor( private _evaluarEstudiante : EvaluarEstudiantesDeportistasService) { }
  
  /**
   * Obtiene los datos del estudiante postulado.
   */
  ngOnInit() {
    this._evaluarEstudiante.getInscripcion(this.idInscripcion).subscribe(data => {
      this.inscripcion = data['inscripcion'];
      
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
   * Abre un modal para mostrar los documentos de soporte del estudiante.
   * 
   * @param rutaArchivo 
   */
  abrirModalDocumento(rutaArchivo){
    this.rutaArchivo = rutaArchivo;
    $('#modelId').appendTo("body").modal('show');
  }
}
