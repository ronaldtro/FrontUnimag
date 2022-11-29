import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { PlazaService } from 'src/app/services/plaza.service';
import { NgForm } from '@angular/forms';
import { PlazaCrear, requisitoInscripcion, Asignaturas, Actividad, tipoAyudantia } from 'src/app/interfaces/plaza.interface';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { TipoPlazaService } from 'src/app/services/tipo-plaza.service';
import {Location} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MonitorARatificar } from '../../estudiantesRatificados/ratificar/ratificar.component';
import { TipoConvocatoria, TiposConvocatorias } from 'src/app/class/api';
import { SupervisorService } from 'src/app/services/supervisor.service';

declare var jquery: any;
declare var $: any;
declare var Tutorial:any;

@Component({
  selector: 'app-crear-plaza',
  templateUrl: './crear-plaza.component.html',
  styleUrls: ['./crear-plaza.component.css']
})
export class CrearPlazaComponent implements OnInit, OnDestroy {
  errores: any[] = [];
  tiposAyudantias: object[] = [];
  tiposAyudantias_aux: tipoAyudantia[] = [];
  tiposPlazas: object[] = [];
  // supervisores: object[] = [];
  tiposRequisitos: object[] = [];
  convocatorias: object[] = [];
  facultades: object[] = [];
  programas: object[] = [];
  asignaturas: object[] = [];
  convocatoriaSeleccionada: any = null;
  estudiantesSeleccionados:MonitorARatificar[];

  requisito: requisitoInscripcion = {
    tipo_requisito_id: null,
    descripcion: null,
    valor: null
  };
  indexEditar: number;
  id: number;

  plaza: PlazaCrear = {
    tipo_ayudantia: null,
    tipo_plaza_id: null,
    cupos_solicitados: null,
    convocatoria_id: null,
    perfil: null,
    competencias_requeridas: null,
    porcentaja_creditos_requeridos: null,
    promedio_minimo: null,
    asignaturas: [],
    facultades: [],
    programas: [],
    actividades: []
  };
  plazaTipo = {
    id: null,
    nombre: null,
    tipoAyudantia: null,
    codigo: null,
    programa: null
  }
  messageService: any;
  tutorial:any = null;
  tipoConvocatoria: number;
  posiblesRatificados : MonitorARatificar[];
  tutores:any[];

  constructor(private _plazaService: PlazaService,
    private tipoPlazaService: TipoPlazaService ,
    private route: ActivatedRoute, 
    private _location: Location, 
    private router: Router, 
    private cdRef: ChangeDetectorRef, 
    private spinner: NgxSpinnerService,
    private tutorService:SupervisorService) {
    route.params.subscribe(parametros => {
      
      this.plaza.convocatoria_id = parametros['id'];
      this.posiblesRatificados = [];
      this.estudiantesSeleccionados = [];
      
      if (parametros['tipoConvocatoria'] !== undefined) {
        this.tipoConvocatoria = parametros['tipoConvocatoria'];
        
      }
    });
    this.tutores = [];
  }

  ngAfterViewChecked() { this.cdRef.detectChanges(); }

  ngOnInit() {
    this.plaza.tipo_convocatoria_id = this.tipoConvocatoria;
    
    $('[data-toggle="tooltip"]').tooltip();
    this.spinner.show();
    this._plazaService.getDatosSolicitar(this.tipoConvocatoria).subscribe(data => {
      this.tiposAyudantias = data['tiposAyudantias'];  
      this.tiposAyudantias_aux = Object.assign([],this.tiposAyudantias);

      for (let index = 0; index < this.tiposAyudantias_aux.length; index++) {
          if (this.tiposAyudantias_aux[index].id == 1) {
            this.tiposAyudantias_aux.splice(index,1);
          }
        }
      
      this.tiposPlazas = data['tiposPlazas'];
      if(this.tipoConvocatoria == 3){
        this.plaza.tipo_ayudantia = 1;
      }else{
        if(this.tipoConvocatoria == 1){
          this.tiposAyudantias = this.tiposAyudantias.filter((item:any) => {return item.id != 1});
          this.tiposPlazas = this.tiposPlazas.filter((item:any) => {return item.tipo_ayudantia_id != 1});
        }
      }
      // this.supervisores = data['supervisores'];
      this.tiposRequisitos = data['tiposRequisitos'];
      this.convocatorias = data['convocatorias'];
      if(this.convocatorias.length == 1) this.plaza.convocatoria_id = this.convocatorias[0]['id'];
      this.facultades = data['facultades'];
      this.programas = data['programas'];
      this.plaza.unidad_id = data['unidad_id'];
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

    // this.spinner.show();
    //this.asignaturas = this._plazaService.getCargarAsignaturas();
    // this.spinner.hide();

    this._plazaService.getCargarAsignaturas().subscribe(data => {     
      this.asignaturas = data["asignaturas"]
      console.log(this.asignaturas);
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()
    });

    if(this.tipoConvocatoria == TiposConvocatorias.MONITORIA){
      this.tutorService.getSupervisores().subscribe((data:any) => {
        this.tutores = [...data];
  
      });
    }
    


  // for (let index = 0; index < this.tiposAyudantias_aux.length; index++) {
  //   if (this.tiposAyudantias_aux[index].id == 1) {
  //     let aux = Object.assign({},this.tiposAyudantias_aux[index])
  //     let pos = this.tiposAyudantias_aux.indexOf(aux);
  //     this.tiposAyudantias_aux.splice(pos,index);
  //   }
  // }
    

  }

  ngOnDestroy() {
    //remueve el tutorial si se cambia de página
    if(this.tutorial) this.tutorial.close();
  }

  limpiarPlaza() {
    this.plaza.tipo_plaza_id = null;
  }

  canjearObjeto() {
    if (this.plaza.convocatoria_id) {
      let busqueda = this.convocatorias.filter(x => x['id'] == this.plaza.convocatoria_id)[0];
      if (busqueda) {
        this.convocatoriaSeleccionada = busqueda;
      }
    }
  }

  guardar(forma: NgForm) {
    this.errores = [];
    if (!forma.valid) {

      swal({
        type: 'error',
        title: 'Error',
        text: 'Verifique la información ingresada e intente nuevamente'
      });
      return;
    }
    this.spinner.show();
    this._plazaService.postSolicitar(this.plaza).subscribe(resp => {
      this.spinner.hide();
      if (resp['success']) {
        if(this.plaza.tipo_convocatoria_id == TiposConvocatorias.MONITORIA){
          if(this.estudiantesSeleccionados.length){
            this.estudiantesSeleccionados.map(e => e.codigo);
            this.spinner.show();
            this._plazaService.ratificarEstudiantesSeleccionados({
              plaza_id: resp['plaza_id'],
              codigos: this.estudiantesSeleccionados.map(e => e.codigo)
            }).subscribe((data:any) => {
              
              swal({
                type: 'success',
                title: 'Realizado',
                text: 'Se ha registrado satisfactoriamente la solicitud.',
                showConfirmButton: false,
                timer: 1500
              })
              this.spinner.hide();
              this.goBack();
            }, (err:HttpErrorResponse) => {
              console.error(err.error);
            });
          }else{
            swal({
              type: 'success',
              title: 'Realizado',
              text: 'Se ha registrado satisfactoriamente la solicitud.',
              showConfirmButton: false,
              timer: 1500
            })
            this.spinner.hide();
            this.goBack();
          }
        }else{
          swal({
            type: 'success',
            title: 'Realizado',
            text: 'Se ha registrado satisfactoriamente la solicitud.',
            showConfirmButton: false,
            timer: 1500
          })
          this.spinner.hide();
          this.goBack();
        }

        
        // this.router.navigate(['/plazas/listarPlazasSolicitadas']);
      } else {
        swal({
          type: 'error',
          title: 'Error',
          text: 'Verifique la información.'
        });
        this.spinner.hide();
        this.errores = resp['errores'];
      }
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

  agregarAsignatura() {

    if (this.validarAsignaturas()) {
      swal({
        type: 'error',
        title: 'Error',
        text: 'Verifique que en la tabla de asignaturas cumpla con los siguientes requisitos: seleccionar asignatura, puntaje en un rango mayor que 0 y menor que 500 y que una asignatura no este duplicada.'
      });
      return;
    }

    this.plaza.asignaturas.push({
      nombre: null,
      codigo: null,
      puntaje: null
    });
  }

  validarAsignaturas() {
    if (this.plaza.asignaturas.length > 0) {
      if (this.plaza.asignaturas.filter(x => x.codigo == null).length > 0) {
        return true;
      }
      if (this.plaza.asignaturas.filter(x => x.puntaje == null || x.puntaje == 0 || x.puntaje > 500).length > 0) {
        return true;
      }
      for (let i = 0; i < this.plaza.asignaturas.length; i++) {
        if (this.plaza.asignaturas.filter(x => x.codigo == this.plaza.asignaturas[i].codigo).length > 1) {
          return true;
        }
      }
    }

    return false;
  }

  quitarElemento(index, arreglo) {
    arreglo.splice(index, 1);
  }

  verificarAsignaturas(item: Asignaturas) {
    if (this.plaza.asignaturas.filter(x => x.codigo == item.codigo).length > 1) {
      swal({
        type: 'error',
        title: 'Error',
        text: 'Tenga en cuenta que no puede ingresar más de una vez la misma asignatura.'
      });
    }else{
      let nombre = this.asignaturas.filter(x => x['codigo'] == item.codigo).map(x => x['nombre'] )[0];
      item.nombre = nombre;
    }

  }

  completarPerfil() {
    let creditos = this.plaza.porcentaja_creditos_requeridos;
    let promedio_minimo = this.plaza.promedio_minimo;
    let factultadesSeleccionas = this.facultades.filter(x => this.plaza.facultades.indexOf(x['id']) > -1).map(x => x['nombre']).join(", ");
    let programasSeleccionados = this.programas.filter(x => this.plaza.programas.indexOf(x['id']) > -1).map(x => x['nombre']).join(", ");
    let asignaturasSeleccionadas = this.plaza.asignaturas.filter(x => x.nombre != null && x.puntaje != null).map(x => `${x.nombre} aprobada con un puntaje de ${x.puntaje}`).join(", ");

    let mensaje: string = "Estudiante que cumpla con los siguientes requisitos:";

    if (creditos) {
      if (mensaje.length > 0) { mensaje += " "; }
      mensaje += `Porcentaje de créditos aprobados del ${creditos}%.`;
    }
    if (promedio_minimo) {
      if (mensaje.length > 0) { mensaje += " "; }
      mensaje += `Promedio mínimo de ${promedio_minimo} puntos.`;
    }
    if (factultadesSeleccionas) {
      if (mensaje.length > 0) { mensaje += " "; }
      mensaje += `Pertenciente a la facultad de ${factultadesSeleccionas}.`;
    }
    if (programasSeleccionados) {
      if (mensaje.length > 0) { mensaje += " "; }
      mensaje += `Pertenciente al programa de ${programasSeleccionados}.`;
    }
    if (asignaturasSeleccionadas) {
      if (mensaje.length > 0) { mensaje += " "; }
      mensaje += `Que haya cursado la(s) asignatura(s) ${asignaturasSeleccionadas}.`;
    }

    if (mensaje.length > 0) {
      this.plaza.perfil = mensaje;
    }

    return mensaje;
  }

  agregarActividad() {
    if (this.plaza.actividades.length > 0) {
      if (this.plaza.actividades.filter(x => x.descripcion.length == 0).length > 0) {
        swal({
          type: 'error',
          title: 'Error',
          text: 'Tenga en cuenta que no puede ingresar una actividad con una descripción vacia.'
        });
        return;
      }
    }

    let act: Actividad = {
      id: null,
      descripcion: ""
    };

    this.plaza.actividades.push(act);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  abrirModalCrearNombrePlaza() {
    this.plazaTipo = {
      id: null,
      nombre: null,
      tipoAyudantia: null,
      codigo: null,
      programa: null
    }
    $('#crearTipoPlaza').modal('show');
  }

  guardarNombrePlaza(forma: NgForm) {
    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this.spinner.show();
      this.tipoPlazaService.nuevoDato(this.plazaTipo)
        .subscribe(data => {
          this.spinner.hide();
          if (data['success']) {
            this.tiposPlazas.push({
              id:data['objRetornado']['id'],
              nombre:data['objRetornado']['nombre'],
              programa:data['objRetornado']['programa'],
              tipo_ayudantia_id:data['objRetornado']['tipoAyudantia']
            });
            this.plaza.tipo_ayudantia = null;
            this.tiposPlazas = this.tiposPlazas;
            swal({
              type: "success",
              title: "Realizado",
              text: "Se ha guardado satisfactoriamente el item.",
              timer: 2000,
              showConfirmButton: false
            });
            $('#crearTipoPlaza').modal('hide');
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: data['objRetornado'] });
          }
        }, err => {
          this.spinner.hide();
          let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          // this.spinner.hide()
        });
    }
  }

  /**
   * Consulta la última coincidencia de la plaza que fue solicitada por la unidad.
   * Si la plaza es de monitorias se buscan los estudiantes a ratificar de la coincidencia encontrada.
   */
  consultarPlaza(){
    let id_plaza = this.plaza.tipo_plaza_id;
    console.log(id_plaza);
    this._plazaService.consultarPlaza(id_plaza).subscribe((data:any) => {
      console.log(data);
      if(data){
        swal({
          title: "Plaza encontrada",
          text: "Se ha encontrado una plaza registrada en un periodo anterior con el mismo nombre, ¿Desea cargar la información de la plaza almacenada? Los datos ingresados actualmente serán descartados.",
          type: "warning",
          showCancelButton: true,
          cancelButtonText :"Cancelar",
          reverseButtons: true
        })
        .then((willDelete) => {
          if (willDelete.value) {
            let convocatoria_id = this.plaza.convocatoria_id;
            let tipo_convocatoria_id = this.plaza.tipo_convocatoria_id;
            this.plaza = Object.assign({},data);
            this.plaza.convocatoria_id = convocatoria_id;
            this.plaza.tipo_convocatoria_id = tipo_convocatoria_id;
            if(this.plaza.tipo_convocatoria_id == TiposConvocatorias.MONITORIA){
              this._plazaService.getMonitoresParaRatificar(this.plaza.id).subscribe((data:MonitorARatificar[]) => {
                console.log(data);
                this.posiblesRatificados = [...data];
                if(this.posiblesRatificados.length){
                  $("#ratificarModal").modal({
                    show:true,
                    backdrop: 'static',
                    keyboard: false
                  });
                }
              }, (err:HttpErrorResponse) => {
                console.error(err.error);
              })
            }
            
            this.completarPerfil();
          } 
          
        });
        
      }
      
    });
  }

  /**
   * Permite mostrar una advertencia al cerrar el modal de ratificación de estudiantes
   */
  verificarEstudiantesSeleccionados():void{
    if(!this.estudiantesSeleccionados.length){
      swal({
        title: "Selección de ratificados",
        text: "¿Está seguro que no desea elegir estudiantes ratificados? Recuerde que una vez solicitada la plaza no podrá indicar a los estudiantes solicitados.",
        type: "warning",
        showCancelButton: true,
        cancelButtonText :"Cancelar",
        reverseButtons: true
      })
      .then((willDelete) => {
        if (willDelete.value) {
          $("#ratificarModal").modal("hide");
        }
      });
    }else{
      $("#ratificarModal").modal("hide");
    }
  }

  /**
   * Permite volver a seleccionar a los estudiantes ratificados si alguna de las condiciones de plaza cambia en convocatorias tipo monitorias
   */
  reiniciarEstudiantesARatificar():void{
    if(this.plaza.tipo_convocatoria_id == TiposConvocatorias.MONITORIA && this.posiblesRatificados.length){
      this.estudiantesSeleccionados = [];
      $("#ratificarModal").modal({
        show:true,
        backdrop: 'static',
        keyboard: false
      });
    }
    
  }

  initTutorial(){
    this.tutorial = new Tutorial(
      {
        intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de solicitud de plazas</p><p class="container">El sistema permite llenar el formulario de solicitud de plazas para alguna de las convocatorias que actualmente se encuentren en la etapa de solicitud de plazas. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar la solicitud de plazas en el sistema.</p>'},
        elements:[
          {id: '#convocatoria_id', text: 'El campo "Convocatoria" permite seleccionar una convocatoria que actualmente se encuentre en estado de solicitud de plazas en el sistema, en caso de no haber ninguna el sistema no le permitirá seleccionar. Este campo es obligatorio.'},
          {id: '#tipo_ayudantia', text: 'El campo "Tipo de ayudantía" permite seleccionar el tipo de ayudantía que se requiere en la solicitud de la plaza. Este campo es obligatorio.'},
          {id: '#tipo_plaza', text: 'El campo "Nombre de plaza <span class="fas fa-question-circle"></span>" permite seleccionar el nombre de la plaza de la cual se quiere hacer la solicitud, si no es capaz de encontrar el nombre de la plaza deberá ingresar al módulo de nombres de plazas y crearla primero. Este campo es obligatorio.'},
          {id: '#cupos_solicitados', text: 'El campo "Cupos solicitados" permite ingresar el número de cupos que se quieren solicitar para la plaza, tenga en cuenta que solamente podrá ingresar numeros mayores o iguales a 1. Este campo es obligatorio.'},
          {id: '#porcentaja_creditos_requeridos', text: 'El campo "Porcentaje de créditos aprobados" permite ingresar el porcentaje de créditos que debe tener aprobado el estudiante que quiera postularse a la plaza, tenga en cuenta que solo podrá ingresar números entre el 0 y 100, incluidos ambos. Este campo es obligatorio.'},
          {id: '#promedio_minimo', text: 'El campo "Promedio mínimo del estudiante <span class="fas fa-question-circle"></span>" permite ingresar el promedio ponderado mínimo que debe tener el estudiante que quiera postularse a la plaza, tenga en cuenta que sólo podrá ingresar números entre el 0 y 500, incluidos ambos. Este campo es obligatorio.'},
          {id: '#perfil', text: 'El campo "Perfil" permite generar y visualizar el perfil que deberá tener el estudiante que quiera postularse a la plaza, basándose para su construcción en la información ingresada en los demás campos del formulario. Este campo es autocompletado de forma automática por el sistema.'},
          {id: '#competencias_requeridas', text: 'El campo "Competencias requeridas" permite ingresar las competencias que deberá que deberá tener el estudiante que quiera postularse a la plaza, tenga en cuenta que solamente podrá ingresar hasta un máximo de 1000 caracteres. Este campo es obligatorio.'},
          {id: '#facultad', text: 'El campo "Facultad" permite seleccionar la o las facultades a las cuales deben pertenecer los estudiantes que quieran postularse a la plaza, tenga en cuenta que solamente podrá seleccionar aquellas facultades que se encuentren activas en el sistema. Este campo es obligatorio.'},
          {id: '#programa', text: 'El campo "Programa" permite seleccionar el o los programas a los cuales deben pertenecer los estudiantes que quieran postularse a la plaza, tenga en cuenta que solamente podrá seleccionar aquellos programas que se encuentren activos en el sistema. Este campo es obligatorio.'},
          {id: '#agregarActividad', text: 'El botón "<span class="fas fa-plus"></span> Agregar actividad" permite agregar las actividades que deberán realizar los estudiantes durante el periodo de la ayudantía. Al hacer clic en el botón se añadirá un campo para escribir el nombre de la actividad, tenga en cuenta que solamente podrá ingresar hasta un máximo de 500 caracteres. Este campo es obligatorio.'},
          {id: '#agregarAsignatura', text: 'El botón "<span class="fas fa-plus"></span> Agregar asignatura" permite agregar las asignaturas con su respectivos puntajes, estas deberán estar aprobadas por los estudiantes que quieran postularse a la plaza con un puntaje igual o mayor al indicado. Al hacer clic en el botón se añadirá un campo para seleccionar el nombre de la asignatura e indicar el puntaje mínimo que debe tener en la misma el estudiante, tenga en cuenta que solo podrá ingresar números entre 1 y 500, incluidos ambos. Este campo es obligatorio.'},
          {id: '#volver', text: 'El botón "Volver al listado" permite regresar a la lista de plazas solicitadas.'},
          {id: '#guardar', text: 'El botón "Guardar" permite guardar toda la información suministrada en cada uno de los campos anteriomente mencionados si esta es válida, después de un breve periodo de tiempo será redirigido a la lista de plazas solicitadas.'},
        ]
      });
      this.tutorial.start();
  }

  goBack():void{
    this._location.back();
  }

}
