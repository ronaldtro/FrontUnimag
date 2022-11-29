import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { Location, DatePipe } from '@angular/common';
import { InscripcionArtistasDeportistasService } from 'src/app/services/inscripcion-artistas-deportistas.service';
import { NgForm } from '@angular/forms';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';
import { FileUpload } from 'primeng/primeng';
import { Api } from 'src/app/class/api';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-lista-disciplinas',
  templateUrl: './lista-disciplinas.component.html',
  styleUrls: ['./lista-disciplinas.component.css'],
  providers: [MessageService, obtenerFechaPipe, DatePipe]
})

export class ListaDisciplinasComponent implements OnInit {

  @ViewChild('carta') cartaInput:FileUpload;
  @ViewChild('hojaDeVida') hojaDeVidaInput:FileUpload;
  @ViewChild('certificado') certificadoInput:FileUpload;

  idConvocatoria:number;
 
  /**
   * Contiene los datos de una disciplina de una convocatoria.
   */
  disciplina : any = {};
  
  /**
   * Se usa para hacer el filtro de disciplinas por modalidad.
   */
  idModalidad:number = 0;
  
  /**
   * Contiene el correo electrónico y el número de documento del estudiante para 
   * obtener el token cuando se haya perdido las credenciales del correo a donde se envío el 
   * token cuando se inscribió a la convocatoria.
   */
  recuperacionToken : any = {};

  /**
   * Contiene las modalidades existentes en la base de datos.
   */
  listaModalidades : any[] = [];

  /**
   * Contiene los tipos de identificación existentes en la base de datos.
   */
  tiposIdentificacion : any [] = [];

  /**
   * Contiene las formatos de los soportes que deben adjuntar los estudiantes.
   */
  listaPlantillas : any[] = [];

  /**
   * Contiene las etapas de la convocatoria.
   */
  etapas: any [] = [];

  /**
   * Contiene la etapa actual de la convocatoria.
   */
  etapaActual = {
    id:null,
    nombre:null,
    fechaInicio:null,
    fechaFin:null,
    peso:null
  };

  /**
   * Contiene los datos de la convocatoria seleccionada.
   */
  convocatoria:any={
    disciplinas:[]
  };
  
  /**
   * Contiene los datos de la inscripción del estudiante a una disciplina de una convocatoria.
   */
  inscripcion : any = {tipoIdentificacion:null, 
    sexo : true};

  /**
   * Se usa para realizar la paginación de las disciplinas. 
   */  
  p : number = 1;
   
  /**
   * Se usa para habilitar los campos en el formulario de inscripción del estudiante
   * cuando no se encuentren registrados sus datos básicos.
   */
  camposDeshabilitados : boolean = true;

  /**
   * Se usa para la traducción del calendario.
   */
  es : any;
  errores:Message[]=[];
  error:any;
  api:string = Api.dev;

  constructor(private datePipe : DatePipe,
    private pipe: obtenerFechaPipe,
    private elementRef:ElementRef,
    private _inscripcionArtistasDeportistasService:InscripcionArtistasDeportistasService,
    private route:ActivatedRoute, 
    private messageService: MessageService,
    private router:Router,
    private spinner: NgxSpinnerService,
    private _location: Location) {}

  /**
   * Obtiene las disciplinas de una convocatoria, las modalidades, los formatos de los soportes,
   * los tipos de identificación, las etapas y la etapa actual.
   * 
   */  
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(parametros => {
    this.idConvocatoria = parametros['id'];

    this._inscripcionArtistasDeportistasService.getDatosInscripcion(this.idConvocatoria).subscribe(data=>{
      
      this.listaModalidades = data['modalidades'];
      this.listaModalidades.push({id:0,nombre:'Mostrar todo'});

      this.listaPlantillas = data['plantillas'];
      this.convocatoria.disciplinas = data['disciplinas_convocatoria'];
      this.tiposIdentificacion = data['tiposIdentificacion'];
      this.etapas = data['etapas'];
      if (data['etapaActual'] != null) {
        this.etapaActual = data['etapaActual'];
      } else {
        this.etapaActual.id = 0;
      }

      this.spinner.hide();
       
    }, err=> {
      this.spinner.hide();
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Oops...',
        text: respuesta.msg,
      });
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
   * Abre modal para realizar la inscripción a la disciplina de una convocatoria.
   * 
   * @param disciplinaConvocatoria 
   */
  abrirModalInscribirse(disciplinaConvocatoria){
    this.inscripcion = {tipoIdentificacion:null, sexo : true};
    this.quitarArchivos();
    this.errores = [];
    this.inscripcion.idConvocatoriaDisciplina = disciplinaConvocatoria.id;
    $('#inscribirseModal').modal('show');
  }

 /**
   * Busca a un estudiante en la base datos para validar si ya se encuentran registrados sus datos 
   * básicos, si es así, se traen los mismos y se asignan al atributo 'estudiante'.
   * 
   * @param e 
   */
  buscarEstudiante(e){
    e.stopPropagation();
    this._inscripcionArtistasDeportistasService.buscarEstudiante(this.inscripcion.identificacion).subscribe(data=>{
        
      if(data['success']){
        this.camposDeshabilitados = true;
        this.inscripcion.nombre = data["datosEstudiante"].nombre;
        this.inscripcion.sexo = data["datosEstudiante"].sexo;
        this.inscripcion.direccion = data["datosEstudiante"].direccion;
        this.inscripcion.fecha_nacimiento = this.pipe.transform(data["datosEstudiante"].fecha_nacimiento);
        this.inscripcion.fecha_nacimiento = this.datePipe.transform(this.inscripcion.fecha_nacimiento,"dd/MM/yyyy");
      }else{
        this.camposDeshabilitados = false;
        this.inscripcion.nombre = "";
        this.inscripcion.sexo = true;
        this.inscripcion.direccion = "";
        this.inscripcion.fecha_nacimiento = "";
      }
    });
    return false;
  }
  
  /**
   * Se envía el objeto inscripción al Backend a través del servicio 'InscripcionArtistasDeportistasService'
   * para registrar al estudiante en la disciplina de la convocatoria que haya seleccionado.
   * 
   * @param inscripcionForm 
   */
  guardarInscripcion(inscripcionForm : NgForm){
    if(!inscripcionForm.valid){
      return
    }

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

        this.spinner.show();
        this._inscripcionArtistasDeportistasService.guardarInscripcion(this.inscripcion).subscribe(data=>{

          if(data["success"]){
            inscripcionForm.resetForm();
            this.spinner.hide();
            swal({
              title: "Realizado",
              text: "Se ha inscrito correctamente",
              type: "success",
              timer: 1500,
              showConfirmButton: false
            });        
            this.errores = [];
            inscripcionForm.resetForm();
            this.quitarArchivos();

            setTimeout(() => {
              $('#inscribirseModal').modal('hide');
            }, 1000);

          }else{
            this.spinner.hide();
            this.errores = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
          }
    
        }, err=> {
          this.spinner.hide();
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Oops...',
            text: respuesta.msg,
          });
        });
      }
    });
  }
  
  /**
   * Quita los archivos de soporte del formulario de inscripción.
   */
  quitarArchivos(){
    this.cartaInput.clear();
    this.hojaDeVidaInput.clear();
    this.certificadoInput.clear();
  }

  /**
   * Envía el correo y el número de documento de identidad al back-end para buscar la inscripción
   * del estudiante y enviarle al correo el token que tiene asociado.
   * 
   * @param formulario 
   */
  enviarToken(formulario : NgForm){
    if(!formulario.valid){
      return
    }

    this.spinner.show();

    this._inscripcionArtistasDeportistasService.enviarToken(this.recuperacionToken, this.idConvocatoria).subscribe(data=>{
      if(data['success']){
        swal({
          title: "Realizado",
          text: "Se ha enviado un enlace a su correo",
          type: "success",
          timer: 1500,
          showConfirmButton: false
        }); 
        formulario.resetForm();
        setTimeout(() => {
          $('#modalEnviarToken').modal('hide');
        }, 2000);
      }else{
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo envíar el enlace a su correo, verifique los datos ingresados',
        });
      }
      this.spinner.hide();
    });
  }

  /**
   * Filtra las disciplinas por modalidad.
   * 
   * @param event 
   */
  filtrarDisciplinas(event){
    this.idModalidad = event.target.value;
  }

  /**
   * Abre modal para ver los criterios de evaluación que tiene la disciplina seleccionada.
   * 
   * @param disciplina 
   */
  abrirModalCriteriosEvaluacion(disciplina){
      this.disciplina = disciplina;
      $('#modelId').modal('show');
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

  onUploadFileCertificado(event){
    for(let file of event.files) {
      this.inscripcion.file_certificado=file;
    }
  }
  
  onClearFileCertificado(){
    this.inscripcion.file_certificado=null;
  }

  onUploadFileCarta(event){
    for(let file of event.files) {
      this.inscripcion.file_carta=file;
    }
  }
  
  onClearFileCarta(){
    this.inscripcion.file_carta=null;
  }

  onUploadFileHojaDeVida(event){
    for(let file of event.files) {
      this.inscripcion.file_hojaDeVida=file;
    }
  }
  
  onClearFileHojaDeVida(){
    this.inscripcion.file_hojaDeVida=null;
  }

  ngOnDestroy(): void {
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}