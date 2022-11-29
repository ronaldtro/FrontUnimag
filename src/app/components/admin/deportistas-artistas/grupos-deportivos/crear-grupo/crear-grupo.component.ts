import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgForm } from '@angular/forms';
import {Location, DatePipe} from '@angular/common';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';

declare var $;

@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.css'],
  providers: [MessageService, obtenerFechaPipe, DatePipe]
})

export class CrearGrupoComponent implements OnInit {

  /**
   * Contiene los datos de un grupo para guardarlos.
   */
  grupo : any = {idDisciplina:null, 
    idNivelFormativo:null,
    dias:[],
    listaRoles:[]};
  
  /**
   * Contiene el día seleccionado en el modal para guardarlo en el horario del grupo.
   */
  diaHorario : any = {idDia:null};

  /**
   * Contiene el rol que se va a guardar o editar.
   */
  rol : any = {id:null};
  
  /**
   * Contiene los días que se pueden asignar al grupo.
   */
  listaDias : any[] = [];

  /**
   * Contiene los niveles formativos que se pueden asignar al grupo.
   */
  listaNivelesFormativos : any[] = [];

  /**
   * Contiene las disciplinas que se pueden asignar al grupo.
   */
  listaDisciplinas : any[] = [];
  
  /**
   * Contiene los tipos de identificación que se pueden asignar al grupo.
   */
  tiposIdentificacion : any[] = [];

  es:any;

  /**
   * Contiene los datos del encargado que se va a asignar al grupo.
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

  mostrar:boolean;
                    
  constructor(private datePipe : DatePipe,
    private pipe: obtenerFechaPipe,
    private _gruposService:GruposDeportivosService, 
    private messageService: MessageService,
    private router:Router,
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location) {
    }

    /**
     * Obtiene los niveles formativos, disciplinas, tipos de identificación y días
     * para la correcta creación de los grupos.
     */
    ngOnInit() {
      this.spinner.show();
      
      this._gruposService.getDatosGrupo().subscribe(data => {
        
        this.listaNivelesFormativos = data['nivelesFormativos'];
        this.listaDisciplinas = data['disciplinas'];
        this.listaDias = data['dias'];
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
    this._gruposService.buscarEncargado(this.encargado.identificacion).subscribe(data=>{
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
    this.grupo.encargado = this.encargado;
    this.encargado = {tipoIdentificacion:null,
                      sexo:true};
    
    formulario.resetForm();
    $('#agregarEncargadoModal').modal('hide');
  }

  abrirModalCrearDia(){
    this.diaHorario = {idDia:null};
    $('#agregarDiasModal').modal('show');
  }

  abrirModalCrearRol(){
    
    $('#agregarRolModal').modal('show');
  }

  /**
   * Agrega un rol a la lista de roles en el grupo que se va a
   * crear.
   * 
   * @param formulario 
   */
  agregarRol(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.grupo.listaRoles.push(this.rol);
    this.rol = {id:null};
    formulario.resetForm();
    $('#agregarRolModal').modal('hide');
  }

  eliminarRol(idx:number){
    swal({
      title: 'Eliminar rol',
      text: "¿Está seguro de eliminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.grupo.listaRoles.splice(idx,1);
      }
    });
  }

  /**
   * Agrega un día al horario del grupo.
   * 
   * @param formulario 
   */
  agregarDia(formulario:NgForm){
    
    if(!formulario.valid){
      return
    }

    this.listaDias.filter(dia => {
      if(dia.idDia === this.diaHorario.idDia){
        this.diaHorario.nombre = dia.nombre;
      }
    });
    
    this.diaHorario.horaInicio = this.formatDate(this.diaHorario.horaInicio);
    this.diaHorario.horaFin = this.formatDate(this.diaHorario.horaFin);

    this.grupo.dias.push(this.diaHorario);

    this.diaHorario = {idDia:null};

    formulario.resetForm();
    $('#agregarDiasModal').modal('hide');
  }

  /**
   * Cambia el formato de hora de 24 horas al formato de 12 horas.
   * 
   * @param date 
   */
  formatDate(date) {
    let hh = date.getHours();
    let m = date.getMinutes();
    let dd = "AM";
    let h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = date.getMinutes() < 10 ? "0" + m : m;
    let hora = h + ":" + m+" " + dd;
    return hora;
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
        delete this.grupo.encargado;
      }
    });
  }

  /**
   * Este método elimina el día que el usuario seleccione
   * 
   * @param idx Es la posición del dia que el usuario seleccionó en la tabla
   */
  eliminarDia(idx:number){
    swal({
      title: 'Eliminar día',
      text: "¿Está seguro de eliminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.grupo.dias.splice(idx,1);
      }
    });
  }

  // editarDia(idx:number){
  //   this.etapa.estado_id=this.convocatoria.etapas[idx].estado_id
  //   this.etapa.estado_nombre = this.convocatoria.etapas[idx].estado_nombre
  //   this.etapa.fecha_inicio=this.convocatoria.etapas[idx].fecha_inicio
  //   this.etapa.fecha_fin=this.convocatoria.etapas[idx].fecha_fin
  //   this.etapa.peso_etapa=this.convocatoria.etapas[idx].peso_etapa
  // }

  clearModal(){
  }

  /**
   * Envía los datos del grupo al back-end para guardarlos.
   * 
   * @param formulario 
   */
  guardarGrupo(formulario:NgForm){
    if(!formulario.valid){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Complete todos los campos del formulario'});
      return
    }

    if(this.grupo.encargado == null){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Se debe asignar un encargado a este grupo'});
      return;
    }

    if(this.grupo.listaRoles.length == 0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Debe haber al menos un rol en el grupo'});
      return;
    }

    if(this.grupo.dias.length == 0){
      this.messageService.add({severity:'warn', summary: 'Alerta', detail:'Se debe asignar un horario al grupo'});
      return;
    }

    this.spinner.show();
    
    this._gruposService.guardarGrupo(this.grupo).subscribe(data => {
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
          this.router.navigate(['/listar-grupos']);
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

  goBack():void{
    this._location.back();
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.grupo.file_imagen=file;
    }
  }

  onClearFile(){
    this.grupo.file_imagen=null;
  }
}