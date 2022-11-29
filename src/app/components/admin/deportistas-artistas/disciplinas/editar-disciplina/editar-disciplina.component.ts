import { Component, OnInit, ViewChild, SecurityContext } from '@angular/core';
import { Api } from 'src/app/class/api';
import { DisciplinasService } from 'src/app/services/disciplina.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {Location, DatePipe} from '@angular/common';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgForm } from '@angular/forms';
import { FileUpload, MessageService } from 'primeng/primeng';
import { DomSanitizer } from '@angular/platform-browser';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';

declare var $;
declare var JQuery;

@Component({
  selector: 'app-editar-disciplina',
  templateUrl: './editar-disciplina.component.html',
  styleUrls: ['./editar-disciplina.component.css'],
  providers: [obtenerFechaPipe, DatePipe, MessageService]
})

export class EditarDisciplinaComponent implements OnInit {

  @ViewChild('imagen') imagenGaleriaFileUpload:FileUpload;

  api:string = Api.dev;
  
  imagenesCargadas: any[] = [];

  /**
   * Almacena los datos de la disciplina que se usarán para ser guardados
   * en la base de datos.
   */
  disciplina : any = {};

  /**
   * Contiene la imagen que el usuario seleccionó.
   */
  imagenGaleria : any = {};
  
  /**
   * Contiene la lista de modalidades.
   */
  listaModalidades : any[] =[];

  /**
   * Contiene la lista de imágenes que se va a enviar al servidor para guardar.
   */
  imagenesGaleria : any[] = [];

  /**
   * Contiene los id de los imágenes que se van a eliminar.
   */
  listaImagenesEliminar : number[] = [];
  
  /**
   * Contiene los tipos de identificación para que el administrador escoja el tipo de identificación
   * que tiene cada encargado.
   */
  tiposIdentificacion : any[] = [];

  es:any;
  p : number = 1;
  mostrar:boolean;

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

  constructor(private _disciplinaService:DisciplinasService, 
    private datePipe : DatePipe,
    private sanitizer: DomSanitizer,
    private pipe: obtenerFechaPipe,
    private router:Router,
    private messageService: MessageService,
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location) {
    }

  /**
   * Obtiene la disciplina a editar, las modalidades y los tipos de identificación.
   */  
  ngOnInit() {
      this.spinner.show();

      this.route.params.subscribe(params=>{
      this._disciplinaService.getDisciplina(params.id).subscribe(data => {
        this.disciplina = data['disciplina'];
        if(this.disciplina.galeriaImagenes != undefined){
          this.imagenesGaleria = Object.assign([], this.disciplina.galeriaImagenes);
          this.disciplina.galeriaImagenes.splice(0,this.disciplina.galeriaImagenes.length)
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
   * Elimina los datos del encargado del atributo 'disciplina'.
   */
  eliminarEncargado(){
    swal({
      title: 'Eliminar encargado',
      text: "¿Esta seguro de eliminar el encargado?",
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

 /**
   *  Agrega los datos del encargado en el atributo 'disciplina' el cual será enviado al
   *  back-end para realizar la edición de la disciplina.
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
   * Agrega cada imagen seleccionada en el atributo 'disciplina' para guardar la galeria de 
   * imagenes.
   * 
   * @param formulario Se usa para validar que todos los campos estén correctos.
   */
  agregarImagen(formulario : NgForm){
    if(!formulario.valid){
      return
    }

    this.imagenesGaleria.push(...Object.assign([], this.imagenesCargadas));
    this.disciplina.galeriaImagenes.push(...Object.assign([], this.imagenesCargadas));
    $("#agregarImagenGaleriaModal").modal('hide');
    this.imagenesCargadas.splice(0,this.imagenesCargadas.length);
    this.imagenGaleriaFileUpload.clear();
  }

  /**
   * Elimina la imagen seleccionada del atributo 'disciplina' y se guarda el id de la imagen en 
   * una lista para eliminar la imagen, siempre y cuando, exista en el servidor.
   * 
   * @param imagen Contiene los datos de la imagen seleccionada.
   * @param index Es la posición de la imagen en la lista de imagenes.
   */
  quitarImagen(imagen:any, index:number, e){
    e.stopPropagation();
    if(imagen.id != null){
      this.listaImagenesEliminar.push(imagen.id);
    }
    
    if(this.p > 1){
      index = ((this.p-1)*6)+(index);
    }
    
    this.imagenesGaleria.splice(index, 1);
    if(imagen.id == null){
      for(let i = 0; i<this.disciplina.galeriaImagenes.length;i++){
        if(this.getImagePath(this.disciplina.galeriaImagenes[i]) == this.getImagePath(imagen)){
          this.disciplina.galeriaImagenes.splice(i, 1);
        }
      }
    }
    
    return false;
  }

  /**
   * Obtiene la url de la imagen que el usuario acaba de seleccionar. 
   * 
   * @param imagen Contiene los datos de la imagen que se seleccionó.
   */
  getImagePath(imagen:any){
    return this.sanitizer.sanitize(SecurityContext.URL,this.sanitizer.bypassSecurityTrustUrl(imagen.objectURL));
  }

  /**
   * Se envian los datos editados de la disciplina al back-end para guardarlos en la base de datos
   * 
   * @param formulario 
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
    
    this.disciplina.listaImagenesEliminar = this.listaImagenesEliminar;

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

  onUploadFile(event){
    for(let file of event.files) {
      this.disciplina.file_imagen=file;
    }
  }

  onClearFile(){
    this.disciplina.file_imagen=null;
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
   * Abre un modal para ver una imagen de la galeria.
   * 
   * @param imagen Contiene la url de una imagen y otros campos
   */
  verImagenGaleria(imagen){
    this.imagenGaleria = imagen;
    $('#imagenGrandeModal').modal('show');
  }
  
  clearModal(){

  }

}
