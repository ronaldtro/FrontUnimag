import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import {Location, DatePipe} from '@angular/common';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgForm } from '@angular/forms';
import { DisciplinasService } from 'src/app/services/disciplina.service';
import { DomSanitizer} from '@angular/platform-browser';
import { FileUpload } from 'primeng/primeng';

declare var $;
declare var JQuery;

@Component({
  selector: 'app-crear-disciplina',
  templateUrl: './crear-disciplina.component.html',
  styleUrls: ['./crear-disciplina.component.css'],
  providers: [obtenerFechaPipe, DatePipe, MessageService]
})
export class CrearDisciplinaComponent implements OnInit {

  @ViewChild('imagen') imagenGaleriaFileUpload:FileUpload;
  
  imagenesCargadas: any[] = [];
  fileUpload:any;
  
  /**
   * Almacena los datos de la disciplina que se usarán para ser guardados
   * en la base de datos.
   */
  disciplina : any = {galeriaImagenes : [], modalidad_id:null};
  
  /**
   * Contiene las modalidades que se mostrarán en el formulario de creación para
   * que el administrador escoja a que modalidad pertenece la disciplina.
   */
  listaModalidades : any[] = [];
  
  /**
   * Contiene la imagen que el usuario seleccionó.
   */
  imagenGaleria : any = {};
  
  /**
   * Contiene los tipos de identificación para que el administrador escoja el tipo de identificación
   * que tiene cada encargado.
   */
  tiposIdentificacion : any[] = [];

  /**
   * Se usa para colocar el calendario en español.
   */
  es:any;

  srcImagenGrande : string;
  
  /**
   * Se usa para realizar la paginación en la galeria de imagenes.
   */
  p : number = 1;

  /**
   * Contiene los datos del encargado que se guardarán en el atributo 'disciplina'.
   */
  encargado : any = {tipoIdentificacion:null,
                    sexo:true};
 
   /**
   * Se usa para habilitar o inhabilitar los campos básicos de la persona en el formulario 
   * de asignación de encargado.
   */
  camposPersonaDeshabilitados : boolean = true;
  
  /**
   * Se usa para habilitar o inhabilitar los campos específicos del encargado en el formulario 
   * de asignación de encargado.
   */
  camposEncargadoDeshabilitados : boolean = true;

  constructor(private datePipe : DatePipe,
    private sanitizer: DomSanitizer,
    private pipe: obtenerFechaPipe,
    private _disciplinaService:DisciplinasService, 
    private messageService: MessageService,
    private router:Router,
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location) {
    }
    
    /**
     * Se cargan los tipos de identificación y las modalidades.
     */
    ngOnInit() {
      this.spinner.show();
      this._disciplinaService.getTiposIdentificacion().subscribe(data => {
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
      
      this._disciplinaService.getModalidades().subscribe(data => {
        this.listaModalidades = data['modalidades'];
      }, err =>{
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide();
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
   * Permite buscar a una persona por medio del documento de identificación en la base de datos 
   * para validar si ya se encuentra registrada en la tabla 'personas'. Si es así, se traen sus datos
   * y se asignan al atributo 'encargado'.
   * 
   * @param e 
   */
  buscarEncargado(e){
    e.stopPropagation();
    this._disciplinaService.buscarEncargado(this.encargado.identificacion).subscribe(data=>{
      if(data['success']){
        this.camposEncargadoDeshabilitados = true;
        this.camposPersonaDeshabilitados = true;
        this.encargado.nombre = data["datosEncargado"].nombre;
        this.encargado.sexo = data["datosEncargado"].sexo;
        this.encargado.email = data["datosEncargado"].email;
        this.encargado.celular = data["datosEncargado"].celular;
        this.encargado.direccion = data["datosEncargado"].direccion;
        this.encargado.fecha_nacimiento = this.pipe.transform(data["datosEncargado"].fecha_nacimiento);
        this.encargado.fecha_nacimiento = this.datePipe.transform(this.encargado.fecha_nacimiento,"dd/MM/yyyy");
        
        if(data["datosEncargado"].email == null || data["datosEncargado"].celular == null){
          this.camposEncargadoDeshabilitados = false;
        }

      }else{
        this.camposEncargadoDeshabilitados = false;
        this.camposPersonaDeshabilitados = false;
        this.encargado.nombre = "";
        this.encargado.sexo = true;
        this.encargado.direccion = "";
        this.encargado.fecha_nacimiento = "";
        this.encargado.email = "";
        this.encargado.celular = "";
      }
    });
    return false;
  }
  
  /**
   *  Agrega los datos del encargado en el atributo 'disciplina' el cual será enviado al
   *  back-end para realizar la creación de la disciplina.
   * 
   * @param formulario 
   */
  agregarEncargado(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.disciplina.encargado = this.encargado;
    this.encargado = {tipoIdentificacion:null,
                      sexo:true};
    
    formulario.resetForm();
    $('#agregarEncargadoModal').modal('hide');
  }
  
  /**
   * Elimina los datos del encargado del atributo 'disciplina'.
   */
  eliminarEncargado(){
    swal({
      title: 'Eliminar encargado',
      text: "¿Está seguro de eliminar el encargado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        delete this.disciplina.encargado;
      }
    });
  }

  // clearModal(){
  //   this.send=false;
  //   this.mostrar=false;
  //   this.etapa.estado_id=null
  //   this.etapa.fecha_inicio=null
  //   this.etapa.fecha_fin=null
  // }
  

  /**
   * Envía los datos de la disciplina al back-end para guardarlos en la base de datos.
   * 
   * @param formulario Se usa para validar que todos los campos estén correctos.
   * 
   */
  guardarDisciplina(formulario:NgForm){
    if(!formulario.valid){
      return
    }

    if(this.disciplina.encargado == null){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Debe asignar un encargado a esta disciplina'});
      return
    }

    this.spinner.show();
    
    this._disciplinaService.guardarDisciplina(this.disciplina).subscribe(data => {
      if(data['success']){
       
        formulario.resetForm();

        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          this.router.navigate(['/disciplinas']);
        }, 2000);

      }else{
        //this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
    }), err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    };
    this.spinner.hide();
  }

  /**
   * Agrega cada imagen seleccionada en el atributo 'disciplina' para guardar la galeria de 
   * imagenes.
   * 
   * @param formulario Se usa para validar que todos los campos estén correctos.
   */
  agregarImagen(formulario : NgForm){
    if(!formulario.valid){
      return
    }
    this.disciplina.galeriaImagenes.push(...Object.assign([], this.imagenesCargadas));
    $("#agregarImagenGaleriaModal").modal('hide');

    this.imagenesCargadas.splice(0,this.imagenesCargadas.length);
    this.imagenGaleriaFileUpload.clear();
  }

  /**
   * Elimina la imagen seleccionada del atributo 'disciplina'.
   * 
   * @param imagen Contiene los datos de la imagen seleccionada.
   * @param index Es la posición de la imagen en la lista de imagenes.
   */
  quitarImagen(imagen:any, index:number){
    if(this.p > 1){
      index = ((this.p-1)*6)+(index);
    }
    this.disciplina.galeriaImagenes.splice(index, 1);
  }

  /**
   * Obtiene la url de la imagen que el usuario acaba de seleccionar. 
   * 
   * @param imagen Contiene los datos de la imagen que se seleccionó.
   */
  getImagePath(imagen:any){
    return this.sanitizer.sanitize(SecurityContext.URL,this.sanitizer.bypassSecurityTrustUrl(imagen.objectURL));
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.disciplina.file_imagen=file;
    }
  }

  onClearFile(){
    this.disciplina.file_imagen=null;
  }

  uploadFile(event,fileUpload){
    fileUpload.clear();
  }

  onUploadImagenGaleria(event){
    
    for(let file of event.files) {
      
      if(file.size <= 3500000){
        this.imagenesCargadas.push(file);
      }
    }
  }
  
  onClearImagenGaleria(event){

    const index = this.imagenesCargadas.indexOf(event.file, 0);
    if (index > -1) {
      this.imagenesCargadas.splice(index, 1);
    }
  }

  verImagenGrande(imagen){
   this.srcImagenGrande = this.getImagePath(imagen)
   
   $('#imagenGrandeModal').modal('show');
  }

  goBack():void{
    this._location.back();
  }
}
