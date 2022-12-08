import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import {Actividades} from 'src/app/interfaces/actividades.interface' 
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { Api } from 'src/app/class/api';
import { MessageService } from 'primeng/api';
import { EtapaMonitoria } from '../../comites-monitorias/estudiantes-atendidos/estudiantes-atendidos.component';
declare var $: any;
declare var Tutorial:any;

//Servicios
import { SupervisorService } from 'src/app/services/supervisor.service';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';


@Component({
  selector: 'app-actividades-supervisor',
  templateUrl: './actividades-supervisor.component.html',
  styleUrls: ['./actividades-supervisor.component.css'],
  providers: [MessageService]
})

export class ActividadesSupervisorComponent implements OnInit, OnDestroy {
  api = Api.dev;
  recomendado = false;
  estudiante: any;
  horas: number = 0; 
  horasRev : number = 0;
  horas_cargadas: number = 0;
  horas_eliminadas : number = 0;
  horas_rechazadas : number = 0; 
  index:number = 0;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: DataTables.Settings = Object.assign({}, DTConfig.dtConf);
  observacion_plaza: string = null;
  etapa = EtapaMonitoria;
  recomendaciones : any[] = [];

  agregarRecomendacion:any={
    idPlazaEstudiante:null,
    observacion:null,
    estado_id:null,
    etapa:null
  }

  registroComite :any={
    idActividad:null,
    observacion:null,
    soporte:null,
  };

  detalle: any = {
    estudiantes_atendidos: [],
    fecha_inicio: null,
    fecha_fin: null,
    estado_nombre: null,
    descripcion: null,
    soporte: null,
  };
  plaza: any = {
    codigo: null,
    estado_convocatoria:null,
    Nombre: null,
    tipo: { id: null, nombre: null },
    estudiante: null,
    unidad: null,
    plaza_id:null
  };

  actividades:Actividades [] = [];
  actividad:Actividades = null;
  userService:UserService;
  funciones:FuncionesJSService;
  tutorial:any = null;
  error: any;

  constructor(private activatedroute: ActivatedRoute, private _supervisorService: SupervisorService , private spinner: NgxSpinnerService ,private _userService:UserService, private messageService: MessageService,
    private f:FuncionesJSService) {
    this.userService = _userService;
    this.funciones = f;
    activatedroute.params.subscribe(parametros => {
      if (parametros['id'] != undefined) {
        this.estudiante = parametros['id'];
      }
    });
  }

  ngOnInit() {
    this.spinner.show()
    this._supervisorService.getDatosActividades(this.estudiante).subscribe(data => {
      if(data['success']){
      
        this.plaza = data['plaza'];
        this.actividades = [...data['plaza']['actividades']];
        this.recomendaciones = data['recomendaciones'];
        this.recomendado = data['plaza']['recomendacion'];
        //this.horas = data['horas'];
        this.horas_cargadas = data['horas_cargadas'];
        // this.horas_eliminadas = data ['horas_eliminadas'];
        // this.horasRev = data['horas_revisadas'];
        
        for (let i = 0; i < this.actividades.length; i++) {
          
          this.actividades[i].fecha_fin = new Date(
            this.actividades[i].fecha_fin
          );
          this.actividades[i].fecha_inicio = new Date(
            this.actividades[i].fecha_inicio
          );
          this.horas += this.actividades[i].tiempo;
        }

        this.dtOptions.order = [[0, "desc"]];
        // this.horasRevisadas();
        this.getTotalHorasRevisadas();
        this.getTotalHorasCanceladas();
        this.getTotalHorasRechazadas();
        this.dtTrigger.next();
        this.spinner.hide();
      }
      this.spinner.hide();
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()
    });
  }

  ngOnDestroy() {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  aprobarActividad(obj) {

    let no_hay_estudiantes:string = (this.plaza.tipo.id == 1 && obj["estudiantes_atendidos"].length == 0) ? "Esta actividad NO ha registrado estudiantes atendidos." : "";

    swal({
      title: 'Aprobar actividad',
      text: no_hay_estudiantes + "¿Está seguro de realizar la acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1'
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        obj.accion =  true;
        this._supervisorService.postEstadoActividad(obj).subscribe(data => {

          if (data['success']) {
            let index = this.actividades.indexOf(obj);
            this.actividades[index] = data['objRetornado'];
            this.actividades[index].fecha_inicio = new Date(data['objRetornado']['fecha_inicio']); 
            this.actividades[index].fecha_fin = new Date(data['objRetornado']['fecha_fin']);
            this.getTotalHorasRevisadas();
            this.rerender();
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha realizado la acción satisfactoriamente.",
              timer: 2000,
              showConfirmButton: false
            });
          
          } else {
            if(data["error"] != undefined){
              swal({
                type: "error",
                title: "Error",
                text: data['error']
              });
            }else{
              this.error = data ['errores'];
              swal({
                type: "error",
                title: "Error",
                text: data['objRetornado'],
                timer: 2000,
                showConfirmButton: false
              });
            }
            
          }

          this.spinner.hide();
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });

      } else if (res.dismiss === swal.DismissReason.cancel) {
   
      }
    });
  }

  rechazarActividad(obj) {

    swal({
      title: 'Rechazar actividad',
      text: "¿Está seguro de realizar la acción?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1'
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        obj.accion =  false;
        this._supervisorService.postEstadoActividad(obj).subscribe(data => {

          if (data['success']) {
          let index = this.actividades.indexOf(obj);
          this.actividades[index] = data['objRetornado'];
          this.actividades[index].fecha_inicio = new Date(data['objRetornado']['fecha_inicio']); 
          this.actividades[index].fecha_fin = new Date(data['objRetornado']['fecha_fin']);
          this.getTotalHorasRevisadas();
          this.rerender();
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha realizado la acción satisfactoriamente.",
            timer: 2000,
            showConfirmButton: false
          });
           
          } else {
            //this.error = data ['errores'];
            swal({
              type: "error",
              title: "Error",
              text: data['objRetornado'],
              timer: 2000,
              showConfirmButton: false
            });
          }
          this.spinner.hide();
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });

      } else if (res.dismiss === swal.DismissReason.cancel) {
        // swal({
        //   type: "error",
        //   title: "Cancelado",
        //   text: "Se ha cancelado la acción.",
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
    });
  }

  verDetalle(obj) {
    let copy = Object.assign({}, obj);
    $('#verDetalle').modal('show');
    this.detalle = copy;
  }

  getTotalHoras() {
    this.horas = 0;
    for (let i = 0; i < this.actividades.length; i++) {
      this.horas += this.diferenciaHoras(
        this.actividades[i].fecha_inicio,
        this.actividades[i].fecha_fin
      );
    }
    this.getTotalHorasRevisadas();
  }

  getTotalHorasRevisadas() {
    this.horasRev = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estado_actividad_id'] == 3 || item['estado_id'] == 3;
    });
    for (let i = 0; i < actividades.length; i++) {
      this.horasRev += actividades[i]['horas_revisadas'];
      /*
      this.horasRev += this.diferenciaHoras(
        actividades[i].fecha_inicio,
        actividades[i].fecha_fin
      );*/
    }
  }

  getTotalHorasCanceladas() {
    this.horas_eliminadas = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estado_actividad_id'] == 2;
    });
    for (let i = 0; i < actividades.length; i++) {
      this.horasRev += actividades[i]['horas_eliminadas'];
      // this.horas_eliminadas += this.diferenciaHoras(
      //   actividades[i].fecha_inicio,
      //   actividades[i].fecha_fin
      // );
    }
  }

  getTotalHorasRechazadas() {
    this.horas_rechazadas = 0;
    let actividades = Object.assign([], this.actividades).filter((item) => {
      return item['estado_actividad_id'] == 4;
    });
    for (let i = 0; i < actividades.length; i++) {
      //this.horasRev += actividades[i]['horas_revisadas'];
      this.horas_rechazadas += this.diferenciaHoras(
        actividades[i].fecha_inicio,
        actividades[i].fecha_fin
      );
    }
  }

  verEstudiantes(obj) {
    let copy = Object.assign({}, obj);
    $('#verEstAtendidos').modal('show');
    this.detalle = copy;
  }

  openModalComite(obj) {
    let copy = Object.assign({}, obj);
    $('#formularioComite').modal('show');
    this.index = this.plaza.actividades.indexOf(obj);
    this.registroComite.idActividad = copy.id;
  }

  onUploadFile(event){
    for(let file of event.files) {
      this.registroComite.soporte=file;
    }
  }

  onClearFile(){
    this.registroComite.soporte=null;
  }
 
  estadoComite(forma: NgForm) {

    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    } 

    if(!this.registroComite.soporte){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    }

    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1'
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        this._supervisorService.postEstadoComite(this.registroComite).subscribe(data => {
          //let index = this.plaza.actividades.indexOf(obj);
          this.plaza.actividades[this.index] = data['objRetornado'];
          //console.log(data['objRetornado']);
          //this.horasRev += data['objRetornado'].tiempo;
          this.getTotalHorasCanceladas();
          this.rerender();
          swal({
            type: "success",
            title: "Realizado",
            text: "Se ha cambiado el estado satisfactoriamente.",
            timer: 2000,
            showConfirmButton: false
          });
          $('#formularioComite').modal('hide');
           this.spinner.hide();
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });

      } else if (res.dismiss === swal.DismissReason.cancel) {
        // swal({
        //   type: "error",
        //   title: "Cancelado",
        //   text: "Se ha cancelado la acción.",
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
    });
  }


  openModalSupervisor(){
    $('#formularioSup').modal({backdrop: "static"});
    this.agregarRecomendacion.idPlazaEstudiante = this.estudiante;
    this.agregarRecomendacion.etapa = this.plaza.peso_convocatoria; 
  }

  evaluarAyudantia(forma:NgForm){

    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      return
    } 

    swal({
      title: 'Evaluar ayudantía',
      titleText:'¿Está seguro de evaluar al estudiante?',
      text: "No podrá deshacer esta opción.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1'
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        this._supervisorService.postEvaluarAyudantia(this.agregarRecomendacion).subscribe(data => {
          if (data['success']) {
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha cambiado el estado satisfactoriamente.",
              timer: 2000,
              showConfirmButton: false
            });
            this.recomendado = data['objRetornado']
            $('#formularioSup').modal('hide');
           
          }
           this.spinner.hide();
        }, err => {
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        });

      } else if (res.dismiss === swal.DismissReason.cancel) {
        // swal({
        //   type: "error",
        //   title: "Cancelado",
        //   text: "Se ha cancelado la acción.",
        //   timer: 2000,
        //   showConfirmButton: false
        // });
      }
    });

  }


//  horasRevisadas(){
//   this.actividades.forEach(actividad => {
//     if(actividad.estado_id == 3){
//       this.horasRev = this.horasRev + actividad.tiempo;
//     }
//   });

//  }


// getTotalHoras() {
//   this.totalHoras = 0;
//   for (let i = 0; i < this.actividades.length; i++) {
//     this.totalHoras += this.diferenciaHoras(
//       this.actividades[i].fecha_inicio,
//       this.actividades[i].fecha_fin
//     );
//   }
// }

diferenciaHoras(fecha_inicio: Date, fecha_fin: Date){
  if(fecha_inicio == null || fecha_fin == null){
    return 0;
  }
  let diference = fecha_fin.getTime() - fecha_inicio.getTime();

  if (diference === 0) {
    return 0;
  }
  let mins = diference / 60000;
  let hrs = mins / 60;
  // console.log((Math.round(hrs * 100) / 100) % 1);
  return Math.round(hrs * 100) / 100;
}

 rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}

  openModalObservacion( acti: Actividades){
    this.actividad = Object.assign({}, acti);
    $('#observacionM').modal('show');
  }

  closeFormObserbacion(form:NgForm){
    $('#observacionM').modal('hide');
    form.resetForm();
  }

  enviarObservacion(form:NgForm){

    if(!form.valid){
      return;
    }
    this.spinner.show();
    let data:any={
      id:this.actividad.id,
      id_plaza:this.estudiante,
      observacion:this.observacion_plaza
    }

    this._supervisorService.agregarObservacionPlaza(data).subscribe(data=>{
        if(data['success']==true){
          swal(
            'Acción realizada',
            'Se ha guardado correctamente la observación',
            'success'
          )
          $('#observacionM').modal('hide');
          form.resetForm();

        }else{
          //this.messageService.add({severity:'error', summary: 'Error', detail:'Tiene errores en el formulario'});
          if (data['errores']) {
            for(let i=0; i<data['errores'].length; i++){
              if(data['errores'][i].errores.length>0){
                this.messageService.add({severity:'error', summary:'Error', detail:data['errores'][i].errores[0]['ErrorMessage']});
              }
            }
          }
          if (data['error']) {
            this.messageService.add({severity:'error', summary:'Error', detail:data['error']});
            console.log(data['error']);
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

  getInteger(number : number){
    return Math.floor(number);
  }

  getDecimals(number: number) {
    return (Math.round(number * 100) / 100) % 1;
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de actividades del estudiante</p><p class="container">El sistema permite visualizar, revisar o rechazar las actividades del estudiante que el supervisor tiene asignado. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar las actividades del estudiante en el sistema.</p>'},
        elements:[
          {id: '#perfil', text: 'Este es el perfil del ayudante, en el se pueden visualizar datos de interés sobre el estudiante como el nombre, código, su estado en la plaza, la plaza en la que se inscribió, la convocatoria a la que pertenece la plaza, la etapa en la que se encuentra la ayudantía, el tipo de ayudantía, la unidad encargada y el total de horas realizadas y revisadas de las actividades del estudiante.'},
          {id: '#table_actividadesEst', text: 'Esta tabla muestra todas las actividades que han sido ingresadas al sistema por el estudiante. Desde la columna "Acciones" puede acceder a las diferentes opciones para cada registro de la tabla tales como revisar, rechazar y ver el detalle de la actividad. Las opciones varian según el rol que tenga el usuario o el estado en el que se encuentre la ayudantía.'},
          {id: '.btn-revisar', text: 'El botón "<span class="fas fa-check"></span>" permite revisar la actividad ingresada por el estudiante, tenga en cuenta que esta acción es irreversible.', count: 1},
          {id: '.btn-rechazar', text: 'El botón "<span class="fas fa-times"></span>" permite rechazar la actividad ingresada por el estudiante, tenga en cuenta que esta acción es irreversible.', count: 1},
          {id: '.btn-detalle', text: 'El botón "<span class="fa fa-info"></span>" permite ver el detalle completo de la actividad ingresada por el estudiante.', count: 1},
          {id: '.btn-cancelar', text: 'El botón "<span class="fa fa-calendar-times"></span>" permite al comité rechazar la actividad ingresada por el estudiante, tenga en cuenta que esta debe estar acompañada de una observación y un soporte que respalde la acción.', count: 1},
          {id: '.btn-nuevaObservacion', text: 'El botón "<span class="fas fa-folder-plus"></span>" permite agregar una nueva observación a la actividad ingresada por el estudiante.', count: 1},
          {id: '.btn-estudiantesAtendidos', text: 'El botón "<span class="fa fa-users mr-1"></span>" permite visualizar la lista de estudiantes atendidos por el ayudante durante la realización de la actividad ingresada.', count: 1},
          {id: '#table_actividadesEst_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo la fecha de inicio, la fecha de fin, el tiempo (horas), descripción, el estado o cualquier otra palabra que esté relacionada con la actividad que desea encontrar.'},
          {id: '#evaluar', text: 'El botón "Evaluar ayudantía" permite realizar la evaluación de la ayudantía del estudiante, al hacer click en el botón podrá llenar un formulario en el que dará la valoración del estudiante. Después de un breve periodo de tiempo será redirigido a la lista de estudiantes que tiene a cargo.'},
          {id: '#volverSupervisor', text: 'El botón "Volver" permite regresar a la lista de estudiantes que tiene a cargo.'},
          {id: '#volver', text: 'El botón "Volver" permite regresar a la lista de estudiantes que tiene inscritos la plaza.'},
        ]
      });
      this.tutorial.start();
  }

}
