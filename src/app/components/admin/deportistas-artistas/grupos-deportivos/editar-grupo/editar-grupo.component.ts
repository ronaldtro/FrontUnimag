import { Component, OnInit } from '@angular/core';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {Location, DatePipe} from '@angular/common';
import { obtenerFechaPipe } from 'src/app/pipes/obtenerFecha.pipe';
import { Api } from 'src/app/class/api';

declare var $;

@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.component.html',
  styleUrls: ['./editar-grupo.component.css'],
  providers: [MessageService, obtenerFechaPipe, DatePipe]
})

export class EditarGrupoComponent implements OnInit {

  grupo : any = {tipoIdentificacion:null, sexo:true};
  encargado : any = {tipoIdentificacion:null,
    sexo:true};
  camposPersonaDeshabilitados : boolean = true;
  camposEncargadoDeshabilitados : boolean = true;
  api:string = Api.dev;

  rol : any = {id :null};
  diaHorario : any = {idDia:null};
  listaDias : any[] = [];
  listaNivelesFormativos : any[] = [];
  listaDisciplinas : any[] = [];
  tiposIdentificacion : any[] = [];
  listaDiasEliminar : any[] = [];
  listaRolesEliminar : any[] = [];
  es : any;
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
    
    ngOnInit() {
      this.spinner.show();

      this.route.params.subscribe(params=>{
      
        this._gruposService.getGrupo(params.id).subscribe(data => {
        
          this.grupo = data['grupo'];
          this.grupo.encargado.fecha_nacimiento = this.pipe.transform(this.grupo.encargado.fecha_nacimiento);
          this.grupo.encargado.fecha_nacimiento = this.datePipe.transform(this.grupo.encargado.fecha_nacimiento,"dd/MM/yyyy");
          
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
        delete this.grupo.encargado;
      }
    });
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

  /**
   * Se agregan los días al horario del grupo
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
    
    if(this.diaHorario.id == null){
      
      this.diaHorario.horaInicio = this.formatDate(this.diaHorario.horaInicio);
      this.diaHorario.horaFin = this.formatDate(this.diaHorario.horaFin);

      this.grupo.dias.push(this.diaHorario);
    }else{

      this.grupo.dias.filter(dia => {
        if(dia.id === this.diaHorario.id){
          
          dia.idDia = this.diaHorario.idDia;
          dia.nombre = this.diaHorario.nombre;

          if((typeof this.diaHorario.horaInicio) == 'string'){
            dia.horaInicio = this.diaHorario.horaInicio;
          }

          if((typeof this.diaHorario.horaFin) == 'string'){
            dia.horaFin = this.diaHorario.horaFin;
          }
         
          if((typeof this.diaHorario.horaInicio) != 'string'){
            dia.horaInicio = this.formatDate(this.diaHorario.horaInicio);
          }

          if((typeof this.diaHorario.horaFin) != 'string'){
            dia.horaFin = this.formatDate(this.diaHorario.horaFin);
          }
        }
      });
    }

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
        this.encargado.direccion = data["datosEncargado"].direccion;
        this.encargado.celular = data["datosEncargado"].celular;
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
  
  /**
   * Este método elimina el dia que el usuario seleccione
   * 
   * @param idx Es la posición del dia que el usuario seleccionó en la tabla
   */
  eliminarDia(idx:number){
    swal({
      title: 'Eliminar dia',
      text: "¿Esta seguro de eliminar el registro seleccionado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.listaDiasEliminar.push(this.grupo.dias[idx]);
        this.grupo.dias.splice(idx,1);
      }
    });
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
        this.listaRolesEliminar.push(this.grupo.listaRoles[idx]);
        this.grupo.listaRoles.splice(idx,1);
      }
    });
  }

  abrirModalCrearRol(){
    
    $('#agregarRolModal').modal('show');
  }

  /**
   * Abre un modal para modificar los días.
   * 
   * @param diaHorario 
   */
  abrirModalEditarDia(diaHorario : any){
    let copy = Object.assign({}, diaHorario);
    
    this.diaHorario = copy;
    $('#agregarDiasModal').modal('show');
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
    
    this.grupo.listaDiasEliminar = this.listaDiasEliminar;
    this.grupo.listaRolesEliminar = this.listaRolesEliminar;

    this._gruposService.guardarGrupo(this.grupo).subscribe(data => {
      if(data['success']){
        this.spinner.hide();
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
        this.spinner.hide();
        //this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }), err =>{
      this.spinner.hide();
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
    };
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

  verImagen(){
    $('#modelId').modal('show');
  }
  clearModal(){
  }

}
