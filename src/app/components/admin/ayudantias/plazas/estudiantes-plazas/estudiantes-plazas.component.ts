import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { EstudiantePlaza } from 'src/app/interfaces/estudiantesPlazas.Interfaces';
import { DTConfig } from 'src/app/class/dtconfig';
import { Subject } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';

import { MessageService } from 'primeng/api';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';

import { Entrevista } from 'src/app/interfaces/entrevista';
import { Usuarios } from 'src/app/interfaces/usuarios.interface';
import { Api } from 'src/app/class/api';

declare var $: any;
declare var Tutorial:any;

//servicios
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { PlazaService } from 'src/app/services/plaza.service';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';



@Component({
  selector: 'app-estudiantes-plazas',
  templateUrl: './estudiantes-plazas.component.html',
  styleUrls: ['./estudiantes-plazas.component.css'],
  providers: [MessageService]
 
})
export class EstudiantesPlazasComponent implements OnInit, AfterViewChecked, OnDestroy {
  id:number;
  id_convocatoria:number;
  tipoConvocatoria:number;
  index:number;
  rutaPdf:string;
  api:string = Api.dev;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = Object.assign({},DTConfig.dtConf);
  supervisores:any[] = [];
  supervisor:number = null;
  evaluadores:any[] = [];
  evaluador:number = null;
  evaluadorEntrevista:any = {
    id: null,
    nombre: null,
    identificacion: null,
    sexo: null,
    email: null
  }
  errores:any[] = [];
  historialEstados:any[] = [];
  error: any[] = [];
  idx_postulado:number = null;
  observacion:string=null;
  dateNow: Date;
  estudianteEntrevista: any [] = [];
  usuario:Usuarios = {};
  estadosEstudiante: any [] = [];

  appliedFilters:any[] = [];
  
  estadoEstudiante:number = null;
  auxPostulado:any ={};
  file_soporte?:File;
  registroCambioEstado:any = {
    'estado_id':null,
    'observacion':null,
    'solicitante':null
  };
  entrevista:Entrevista={
    plazas_id:[],
    lugar:null,
    hora:null,
    observacion:null,
    plaza_id:null,
    responsable:null,
    evaluador_id: null
  };

  estudiante:any={
    supervisor:null
  };

  plazaEstudiantes:EstudiantePlaza={
    convocatoria:"",
    convocatoria_id:0,
    tipo_convocatoria_id:null,
    plaza_id:0,
    cupos:0,
    estado:"",
    plaza:"",
    postulados:[],

  }

  detalle: any = {
    hora : null,
    lugar: null,
    observacion:null,
    responsable: null 
  };
  
  es:any = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
    dayNamesShort: ["D", "L", "M", "Mi", "J", "V", "S"],
    dayNamesMin: ["D", "L", "M", "Mi", "J", "V", "S"],
    monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
    monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
    today: 'Hoy',
    clear: 'Limpiar'
};

  userService: UserService;
  funciones:FuncionesJSService;
  tutorial:any = null;

  constructor(private _plazasSerices:PlazaService,
              private route:ActivatedRoute ,
              private _userService:UserService,
              private spinner: NgxSpinnerService,
              private _estudianteService:EstudiantesService,
              private messageService: MessageService,
              private funcionesP: FuncionesJSService ) { this.userService = _userService; this.funciones = funcionesP;}
  
  ngOnInit() {
    this.dateNow = new Date();
    this.spinner.show();
    this.route.params.subscribe(parametros => {
      this.id = parametros['id'];
      this.id_convocatoria = parametros['id_C'];
      this._plazasSerices.getEstudiantes(this.id).subscribe(data=>{
        if(data['success']){
          this.plazaEstudiantes = data['plaza'];
          this.tipoConvocatoria = data['plaza']['tipo_convocatoria_id'];
          this.supervisores = data['supervisores'];
          this.evaluadores = data['evaluadores'];
          this.estadosEstudiante = data['estadosEstudiantes'];
          this.initDtOptions();
          this.dtTrigger.next();
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

            dtInstance.column(3).visible(false);
            dtInstance.column(7).visible(false);
            dtInstance.column(8).visible(false);
            dtInstance.column(9).visible(false);
          }); 
          
        }
        this.spinner.hide();
        },      
        err=>{
            let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
            this.spinner.hide();  
            swal({
              type: 'error',
              title: 'Error',
              text: respuesta.msg,
            }); 
          })
      });
  }

  

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  initDtOptions(){
    this.dtOptions.order = [[ 6, "asc" ],[ 10, "asc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.autoWidth = false;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      }
    ];

    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      this.funciones.addFilter(this, 4, "#filter-programa");
      this.funciones.addFilter(this, 6, "#filter-estado");  
        
    }

  }
 
  supervisorModal(obj){
    this.index = this.plazaEstudiantes.postulados.indexOf(obj);
    let copy = Object.assign({}, obj);
    $('#supervisorM').modal('show');
    this.estudiante = copy;
    if(this.estudiante.supervisor == 0){this.estudiante.supervisor = null};
  }

  guardar(forma:NgForm){
    if(!forma.valid){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
    }else{
      swal({
        title: 'Asignar/editar supervisor',
        text: "¿Está seguro de guardar los cambios?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'btn btn-success m-1',
        cancelButtonClass: 'btn m-1',
        reverseButtons: true
      }).then((res) => {
        if (res.value) {
          this.spinner.show();
          this._plazasSerices.postAsignarSup(this.estudiante).subscribe(data=>{
            if(data['success']){
             
              this.plazaEstudiantes.postulados[this.index].supervisor= data['objRetornado']['supervisor'];
              //console.log(this.plazaEstudiantes.postulados[this.index]);
              this.rerender();             
              this.estudiante.supervisor = null;
              forma.resetForm;
              swal({
                type: "success",
                title: "Realizado",
                text: "Se ha asignado el supervisor satisfactoriamente.",
                timer: 2000,
                showConfirmButton: false
              });
              $('#supervisorM').modal('hide');
            } else{
                swal({
                  type: 'error',
                  title: 'Error',
                  text: 'Verifique la información.'
                });
                this.spinner.hide();
                this.errores = data['errores'];
            }
          });
            this.spinner.hide();  
           
        } else if (res.dismiss === swal.DismissReason.cancel) {
          swal({
            type: "error",
            title: "Cancelado",
            text: "Se ha cancelado la acción.",
            timer: 2000,
            showConfirmButton: false
          });
        }});
    }
  }

  nuevoSupervisorModal(usuarioForm:NgForm){
    usuarioForm.resetForm();
    this.errores = [];
    this.usuario = {};
    $('#supervisorM').modal('hide');
    $('#nuevoSupervisorM').modal('show');
  }

  cancelarGuardarSupervisor(){
    this.errores = [];
    $('#nuevoSupervisorM').modal('hide');
    $('#supervisorM').modal('show');
  }
 
  guardarSupervisor(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._plazasSerices.guardarSupervisor(this.usuario).subscribe(data => {
      if(data['success']){
        this.supervisores = data['supervisores'];
        
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        $('#nuevoSupervisorM').modal('hide');
        $('#supervisorM').modal('show');
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
  }
   
  nuevoEvaluadorModal(usuarioForm:NgForm){
    usuarioForm.resetForm();
    this.errores = [];
    this.usuario = {};
    $('#asignarEntrevista').modal('hide');
    $('#nuevoEvaluadorM').modal('show');
  }
  
  cancelarGuardarEvaluador(){
    this.errores = [];
    $('#nuevoEvaluadorM').modal('hide');
    $('#asignarEntrevista').modal('show');
  }

  guardarEvaluador(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    this.spinner.show();
    this._plazasSerices.guardarEvaluador(this.usuario).subscribe(data => {
      if(data['success']){
        this.evaluadores = data['evaluadores'];
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        $('#nuevoEvaluadorM').modal('hide');
        $('#asignarEntrevista').modal('show');
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
  }

  cambiarEstadoModal(postulado){

    this.auxPostulado.id = postulado.id;
    this.auxPostulado.convocatoria_id = this.plazaEstudiantes.convocatoria_id;
    this.auxPostulado.plaza_id = this.plazaEstudiantes.plaza_id;
    this.auxPostulado.estado = postulado.estado;
    this.errores = [];
    this.file_soporte = null;
    $('#estadoModal').modal('show');
  }
  cambiarEstado(formulario:NgForm , soporte){
    if(!formulario.valid || this.file_soporte == null || this.file_soporte.size == 0){
      return
    }
    this.auxPostulado.estado_id = this.registroCambioEstado.estado_id;
    this.auxPostulado.observacion = this.registroCambioEstado.observacion;
    this.auxPostulado.solicitante = this.registroCambioEstado.solicitante;
    this.spinner.show();
    this._plazasSerices.cambiarEstadoEstudiante(this.auxPostulado,this.file_soporte).subscribe(data => {
      if(data['success']){
        for(let i=0;i<this.plazaEstudiantes.postulados.length;i++){
          if(this.plazaEstudiantes.postulados[i].id == this.auxPostulado.id){
            this.plazaEstudiantes.postulados[i]['estado'] = data['estado'].nombre;
            this.plazaEstudiantes.postulados[i].estado_plaza= data['estado'].id;
            this.plazaEstudiantes.postulados[i]['estadoId']= data['estado'].id;
            break;
          }
        }
        soporte.clear();
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        this.file_soporte = null;
        formulario.resetForm();
        $('#estadoModal').modal('hide');
      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
    
  }
  verHistorialEstado(postulado){

    this.historialEstados = postulado.historialEstado;
    $('#historialEstadosModal').modal('show');
  }
  verSoporteEstado(estado){
    this.rutaPdf = estado.soporte;
    $('#historialEstadosModal').modal('hide');
    $('#pdfSoporte').modal('show');
  }
  verPropuesta(propuesta){
    this.rutaPdf = propuesta;
    $('#pdfPropuesta').modal('show');
  }
  closeSoporte(){
    $('#pdfSoporte').modal('hide');
    $('#historialEstadosModal').modal('show'); 
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      
      dtInstance.column(3).visible(false);
      dtInstance.column(7).visible(false);
      dtInstance.column(8).visible(false);
      dtInstance.column(9).visible(false);
      
    });
  }


  openModalObservacion( idx:number){
    this.idx_postulado=idx;
    this.plazaEstudiantes.postulados[idx].nombre
    $('#observacionM').modal('show');

  }

  closeFormObserbacion(form:NgForm){
    $('#observacionM').modal('hide');
    form.resetForm();
  }

  enviarObservacion(form:NgForm){

    if(!form.valid){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    this.spinner.show();
    let data:any={
      id:this.plazaEstudiantes.postulados[this.idx_postulado].id,
      observacion:this.observacion
    }

    this._estudianteService.agregarObservacion(data).subscribe(data=>{
      
      if(data['success']==true){
          swal(
            'Acción realizada',
            'Se ha guardado correctamente la observación',
            'success'
          )
          $('#observacionM').modal('hide');
          form.resetForm();

        }else{
          this.messageService.add({severity:'error', summary: 'Error', detail:'Tiene errores en el formulario'});
          
          if (data['error']) {
            this.messageService.add({severity:'error', summary:'Error', detail:data['error']});
          }
          else {
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                this.messageService.add({severity:'error', summary:'Error', detail:data['errores'][i].errores[0]['ErrorMessage']});
              }
            }
          }
        }
        this.spinner.hide();
      }, err=>{

        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        this.spinner.hide();  
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        }); 
      })
  }

  openModalEntrevista(){
    $('#asignarEntrevista').modal({backdrop: "static"});
  }

  enviarEntrevista(form:NgForm){

    if(!form.valid){
      swal({
        type: 'error',
        title: 'Error',
        text: "Formulario inválido"      
      }); 
      return;
    }

    this.entrevista.plazas_id = this.estudianteEntrevista;
    this.entrevista.plaza_id = this.id;
    console.log(this.entrevista);
    this._plazasSerices.postAsignarEntrevista(this.entrevista).subscribe(data=>{
      if (data['success']) {
        swal({
          type: 'success',
          title: 'Acción realizada',
          text: "Se ha guardado satisfactoriamente.",
          timer: 2000,
          showConfirmButton: false
          
        }); 
        this.plazaEstudiantes.postulados.forEach(element => {

          if(this.entrevista.plazas_id.indexOf(element.id) >= 0){
            element.entrevista = new Object;
            element.entrevista.hora = this.entrevista.hora;
            element.entrevista.lugar = this.entrevista.lugar;
            element.entrevista.observacion = this.entrevista.observacion;
            element.entrevista.responsable = this.entrevista.responsable;
            element.entrevista.evaluador_id = this.entrevista.evaluador_id;
            if( this.entrevista.evaluador_id != null ){
              
              for (const responsable of this.evaluadores) {
                
                if ( responsable.id == this.entrevista.evaluador_id ){
                  
                  element.entrevista.responsable = responsable.nombre;
                }
              }
            }
          }
        });
        form.resetForm(this.entrevista);
        this.estudianteEntrevista = [];
        $('#asignarEntrevista').modal('hide');
      } else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: "Corrige los errores"
        });
      }
    }, err=>{

      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      this.spinner.hide();  
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      }); 
    });

  }

  openEntrevistaInformacion(obj){
      let copy = Object.assign({}, obj);
      console.log("Objeto:",copy);
      $('#verDetalleEntrevista').modal('show');
      this.detalle = copy;
  }
  onUploadFile(event){
    for(let file of event.files) {
      this.file_soporte=file;
    }
  }

  onClearFile(){
    this.file_soporte=null;
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de estudiantes inscritos en la plaza</p><p class="container">El sistema permite visualizar y modificar el estado de los estudiantes inscritos en la plaza. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar los estudiantes en el sistema.</p>'},
        elements:[
          {id: '#btn-filtros', text: 'El botón "<span class="fa fa-filter"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podrá realizar una búsqueda entre los registros listados en la tabla.'},
          {id: '#table_estudiantes', text: 'Esta tabla contiene los estudiantes que se postularon en la plaza con su estado actual en el sistema, dependiendo del estado del estudiante podrá visualizar diferentes acciones. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de los registros listados.'},
          {id: '.btn-cancelo', text: 'El botón "<span class="fas fa-info-circle"></span>" permite visualizar el motivo por el cual el estudiante canceló la postulación a la plaza.', count: 1},
          {id: '.btn-verEvaluacion', text: 'El botón "<span class="fas fa-eye"></span>" permite visualizar el puntaje que obtuvo el estudiante en cada criterio durante su proceso de evaluación.', count: 1},
          {id: '.btn-evaluar', text: 'El botón "<span class="fas fa-clipboard-list"></span>" permite ingresar la puntuación que obtuvo el estudiante en cada criterio durante su proceso de evaluación.', count: 1},
          {id: '.btn-masAcciones', text: 'El botón "<span class="fas fa-ellipsis-v"></span>" permite acceder a más acciones como: Agregar / editar supervisor, Nueva observación, Libreta de observaciones, Ver listado de actividades, Ver información de entrevista, Cambiar estado e Historial estados, tenga en cuenta que algunas de estas acciones puede estar disponible o no dependiendo de la etapa en la que se encuentre la convocatoria y del rol del usuario.', count: 1},
          {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
          {id: '#table_estudiantes_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo el código, nombre, programa, estado o cualquier otra palabra que este relacionada con el estudiante que desea encontrar.'},
          {id: '#volver', text: 'El botón "Volver" permite regresar a la lista de plazas revisadas por Bienestar.'},
          {id: '#verResultados', text: 'El botón "Ver resultados" permite visualizar de manera general los resultados obtenidos por los estudiantes postulados en la plaza durante su proceso de evaluación. Si aún hay cupos disponibles le permitirá seleccionar a aquellos estudiantes que cumplan con los requisitos para ser aprobados.'},
        ]
      });
      this.tutorial.start();
  }

}
