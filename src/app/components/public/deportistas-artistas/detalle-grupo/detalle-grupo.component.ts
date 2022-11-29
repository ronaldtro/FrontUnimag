import { Component, OnInit } from '@angular/core';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location, DatePipe } from '@angular/common';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Api } from 'src/app/class/api';

declare var $:any;

@Component({
  selector: 'app-detalle-grupo',
  templateUrl: './detalle-grupo.component.html',
  styleUrls: ['./detalle-grupo.component.css'],
  providers: [obtenerFechaPipe, DatePipe]
})
 
export class DetalleGrupoComponent implements OnInit {

  /**
   * Contiene los grupos que tiene una disciplina.
   * 
   */
  listaGrupos : any[] = [];
  
  /**
   * Contiene los tipos de identificación para que los estudiantes puedan seleccionar el 
   * correspondiente cuando vayan a inscribirse en un grupo.
   * 
   */
  tiposIdentificacion : any [] = [];
  
  /**
   * Contiene los datos de un grupo que se haya seleccionado.
   * 
   */
  grupo : any = {integrantes:[], meritos:[]};
  
  /**
   * Contiene los datos de un estudiante que se va a inscribir en un grupo.
   * 
   */
  estudiante : any = {tipoIdentificacion:null, sexo : true, idRol:null};
  
  /**
   * Contiene los datos de una disciplina para mostrar la imagen de perfil, la descripción, 
   * galeria de imagenes y encargado.
   * 
   */
  disciplina : any = {};
  
  /**
   * Se usa para habilitar los campos en el formulario de inscripción del estudiante
   * cuando no se encuentren registrados sus datos básicos.
   */
  camposDeshabilitados : boolean = true;
  
  idGrupo : number;
  idDisciplina : number;
  
  isDataAvailable:boolean = false;
  errores:Message[]=[];
  api:string = Api.dev;
  es:any;
  
  constructor(private route:ActivatedRoute,
    private _inscripcionArtistasDeportistasService:InscripcionArtistasDeportistasService, 
    private router:Router,
    private datePipe : DatePipe,
    private pipe: obtenerFechaPipe,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  /**
   * Obtiene los grupos asociados a una disciplina y también los tipos de identificación para que
   * el estudiante pueda seleccionar el correspondiente cuando vaya a realizar la inscripción a
   * un grupo.
   * 
   */  
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.idDisciplina = params['idDisciplina'];
      this._inscripcionArtistasDeportistasService.getGruposPorDisciplina(this.idDisciplina).subscribe(data => {
        this.listaGrupos = data['grupos'];
        this.disciplina = data['disciplina'];
        this.isDataAvailable = true;
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

      this._inscripcionArtistasDeportistasService.getTiposIdentificacion().subscribe(data => {
        this.tiposIdentificacion = data['tiposIdentificacion'];
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

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
      dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  /**
   * Busca a un estudiante en la base datos para validar si ya se encuentran registrados sus datos 
   * básicos, si es así, se traen los mismos y se asignan al atributo 'estudiante'.
   * 
   * 
   * @param e 
   */
  buscarEstudiante(e){
    e.stopPropagation();
    this._inscripcionArtistasDeportistasService.buscarEstudiante(this.estudiante.identificacion).subscribe(data=>{
        
      if(data['success']){
        this.camposDeshabilitados = true;
        this.estudiante.nombre = data["datosEstudiante"].nombre;
        this.estudiante.sexo = data["datosEstudiante"].sexo;
        this.estudiante.direccion = data["datosEstudiante"].direccion;
        this.estudiante.fecha_nacimiento = this.pipe.transform(data["datosEstudiante"].fecha_nacimiento);
        this.estudiante.fecha_nacimiento = this.datePipe.transform(this.estudiante.fecha_nacimiento,"dd/MM/yyyy");
      }else{
        this.camposDeshabilitados = false;
        this.estudiante.nombre = "";
        this.estudiante.sexo = true;
        this.estudiante.direccion = "";
        this.estudiante.fecha_nacimiento = "";
      }
    });
    return false;
  }

  /**
   * Se guarda la inscripción del estudiante en la base de datos.
   * 
   * @param formulario 
   */
  guardarInscripcionEstudiante(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();

    this.estudiante.idGrupo = this.grupo.id;
    this._inscripcionArtistasDeportistasService.guardarInscripcionGrupo(this.estudiante).subscribe(data => {
        if(data['success']){
          formulario.resetForm();
          swal({
              title: "Realizado",
              text: "Se ha registrado exitosamente",
              type: "success",
              timer: 2000,
              showConfirmButton: false
          });
          
          setTimeout(() => {
            $('#inscribirEstudianteModal').modal('hide');
          }, 2000);
        }else{
          this.errores = data['errores'];
          swal({
            type: "error",
            title: "Error",
            text: "Corrige los errores",
            timer: 2000
          });
        }
        this.spinner.hide();
    }, err =>{
      this.spinner.hide();
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    });
  }

  /**
   * Abre un modal para realizar la inscripción del estudiante en un grupo.
   * 
   * @param grupo Contiene los datos de un grupo que se haya seleccionado.
   */
  abrirModalInscripcion(grupo:any){
    this.errores = [];
    let copy = Object.assign({}, grupo);
    this.grupo = copy;
    $('#inscribirEstudianteModal').modal('show');
  }

  /**
   * Abre modal para mostrar los integrantes que tiene un grupo.
   * 
   * @param grupoAbre modal para mostrar los integrantes que tiene un grupo.
   */
  abrirModalIntegrantes(grupo:any){
    this.errores = [];
    let copy = Object.assign({}, grupo);
    this.grupo = copy;
    $('#verIntegrantesModal').modal('show');
  }

  /**
   * Abre modal para mostrar el horario que tiene un grupo.
   * 
   * @param grupo Abre modal para mostrar los integrantes que tiene un grupo.
   */
  abrirModalHorario(grupo:any){
    this.errores = [];
    let copy = Object.assign({}, grupo);
    this.grupo = copy;
    $('#verHorarioModal').modal('show');
  }
  
  /**
   * Abre modal para mostrar los premios que tiene un grupo.
   * 
   * @param grupo Abre modal para mostrar los integrantes que tiene un grupo.
   */
  abrirModalPremios(grupo){
    this.errores = [];
    let copy = Object.assign({}, grupo);
    this.grupo = copy;
    $('#verPremiosModal').modal('show');
  }

  goBack():void{
    this._location.back();
  }

  clearModal(){
    
  }

}