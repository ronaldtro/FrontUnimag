import { Component, OnInit } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Location } from '@angular/common';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';

@Component({
  selector: 'app-inscripcion-estudiantes',
  templateUrl: './inscripcion-estudiantes.component.html',
  styleUrls: ['./inscripcion-estudiantes.component.css'],
  providers: [MessageService]
})
export class InscripcionEstudiantesDeportistasComponent implements OnInit {

  idConvocatoria:number;

  errores:Message[]=[];

  etapas: any [] = [];
  etapaActual = {
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };

  error:any;

  convocatoria:any={
    disciplinas:[]
  };

  constructor(private _inscripcionArtistasDeportistasService:InscripcionArtistasDeportistasService,
    private route:ActivatedRoute, 
    private messageService: MessageService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.spinner.show();

    this.route.params.subscribe(parametros => {
    this.idConvocatoria = parametros['id'];

    this._inscripcionArtistasDeportistasService.getDatosInscripcion(this.idConvocatoria).subscribe(data=>{
     
      this.convocatoria.disciplinas = data['disciplinas_convocatoria'];
    
      this.etapas = data['etapas'];
      if (data['etapaActual'] != null) {
        this.etapaActual = data['etapaActual'];
      } else {
        this.etapaActual.id = 0;
      }

      this.spinner.hide();
       
    }, err=> {
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
    });
  });
  }


  /**
   * Se envía el objeto inscripción al Backend a través del servicio 'InscripcionArtistasDeportistasService'
   * para registrar al estudiante en la disciplina de la convocatoria que haya seleccionado.
   * 
   * @param {any} inscripcion  Objeto que contiene toda la información de 
   * la inscripción
   * 
   */
  guardarInscripcion(inscripcion){
    
    swal({
      title: 'Postularse a la convocatoria',
      text: "¿Está seguro de realizar esta acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if(result.value){
        
        this._inscripcionArtistasDeportistasService.guardarInscripcion(inscripcion).subscribe(data=>{

          if(data["success"]){
            swal({
              title: "Realizado",
              text: "Se ha inscrito correctamente",
              type: "success",
              timer: 1500,
              showConfirmButton: false
            });        
            this.errores = [];
            setTimeout(() => {
              this.router.navigate(['/estudiantes', 'dashboard']);
            }, 1500);
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'Ya se había registrado anteriormente en esta disciplina',
            });
          }
    
        });
      }
    });
  }

  esMenorAEtapaActual(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') < new Date(this.etapaActual.fechaFin + 'T23:59:59Z');
  }

  esMayorAHoy(fechaFin:string){
    return new Date(fechaFin + 'T23:59:59Z') >= new Date();
  }

  esIgual(fechaInicio:string, fechaFin:string){
    return new Date(fechaInicio + 'T23:59:59Z').getTime() === new Date(fechaFin + 'T23:59:59Z').getTime();
  }

  goBack():void{
    this._location.back();
  }
}