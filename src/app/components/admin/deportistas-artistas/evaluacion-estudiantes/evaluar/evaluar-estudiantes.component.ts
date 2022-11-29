import { Component, OnInit, ElementRef } from '@angular/core';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { EvaluarEstudiantesDeportistasService } from 'src/app/services/evaluar-estudiantes-deportistas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-evaluar-estudiantes',
  templateUrl: './evaluar-estudiantes.component.html',
  styleUrls: ['./evaluar-estudiantes.component.css']
})

export class EvaluarEstudiantesDeportistasComponent implements OnInit {

  idDisciplinaConvocatoria : number;
  idInscripcion : number;
  listaItemsDisciplina : any[] = [];
  fechaActual: Date;
  fechaUltimaEtapa : Date;

  constructor(private _evaluarEstudiante : EvaluarEstudiantesDeportistasService,
    private route : ActivatedRoute,  private spinner: NgxSpinnerService, private elementRef: ElementRef,
    private _location: Location,
    private router:Router) { }

  /**
   * Se cargan los items de una disciplina que pertenece a una convocatoria en 
   * la que se hayan inscrito los estudiantes 
   * 
   */  
  ngOnInit() {
    this.spinner.show();
    this.fechaActual = new Date();
    this.route.params.subscribe(params => {
    this.idDisciplinaConvocatoria = params.idDisciplinaConvocatoria;
    this.idInscripcion = params.idInscripcion;
    
    this._evaluarEstudiante.getItemsDisciplinaConvocatoria(this.idDisciplinaConvocatoria, this.idInscripcion).subscribe(data => {
      
      if(data['success']){
        this.listaItemsDisciplina = data['items'];
        this.fechaUltimaEtapa = new Date(data['fechaUltimaEtapa']);
      }else{
          this.router.navigate(['/convocatorias-artistas-deportistas']);
      }

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
  }

  /**
   * Se calcula el puntaje porcentual total de la nota
   */
  getPuntajePorcentual(){

    if(this.listaItemsDisciplina != null){
    let total = 0;
    this.listaItemsDisciplina.forEach(element => {
        total += ((element.puntaje != undefined && element.puntaje  <= element.valorMaximo && element.puntaje >= 0 ?element.puntaje : 0) * element.porcentaje ) / element.valorMaximo ;
      });
      return total;
    }
    return 0;
  }

  /**
   * Se guarda la evaluación que hace el administrador a los estudiantes
   * 
   */
  guardarEvaluacion(formulario : NgForm){

    if(!formulario.valid){
      return
    }
    
    this.spinner.show();
    let evaluacion = {idInscripcionEstudiante : this.idInscripcion,
                      listaItems : this.listaItemsDisciplina};
    
    this._evaluarEstudiante.guardarEvaluacionEstudiante(evaluacion).subscribe(data =>{
    
    if(data['success']){
      this.spinner.hide();
      swal({
        title: "Realizado",
        text: "Acción realizada satisfactoriamente.",
        type: "success",
        timer: 2000,
        showConfirmButton: false
      });
    }else{
      this.spinner.hide();
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'El puntaje debe ser menor o igual al valor máximo',
      });
    }
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

}