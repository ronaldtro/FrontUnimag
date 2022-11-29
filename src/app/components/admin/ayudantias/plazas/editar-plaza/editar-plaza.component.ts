import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { requisitoInscripcion, PlazaCrear, Asignaturas, Actividad } from 'src/app/interfaces/plaza.interface';
import { PlazaService } from 'src/app/services/plaza.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import {Location} from '@angular/common';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-editar-plaza',
  templateUrl: './editar-plaza.component.html',
  styles: ['.editar-plaza.component.css']
})
export class EditarPlazaComponent implements OnInit {

  errores:any[] = [];
  tiposAyudantias: object[] = [];
  tiposPlazas: object[] = [];
  // supervisores: object[] = [];
  tiposRequisitos: object[] = [];
  convocatorias: object[] = [];
  facultades: object[] = [];
  programas: object[] = [];
  asignaturas: object[] = [];
  convocatoriaSeleccionada:any = null;
  
  indexEditar: number;
  id:number;
  tipoConvocatoria:number;
  
  plaza: PlazaCrear = {
    tipo_ayudantia: null,
    tipo_plaza_id: null,
    cupos_solicitados: null,
    convocatoria_id: null,
    perfil: null,
    competencias_requeridas: null,
    porcentaja_creditos_requeridos: null,
    promedio_minimo: null,
    asignaturas:[],
    facultades:[],
    programas:[],
    actividades: [],
    unidad_id:null
  };

  constructor(private _plazaService: PlazaService, private _location: Location, private route:ActivatedRoute, private router:Router,private _userService:UserService, private cdRef:ChangeDetectorRef, private spinner: NgxSpinnerService) { 
    route.params.subscribe(parametros => {
      
        this.plaza.id = parametros['id'];
        this.tipoConvocatoria = parametros['tipoConvocatoria'];
    
    });
  }

  ngAfterViewChecked() {this.cdRef.detectChanges();}

  ngOnInit() {
    this.plaza.tipo_convocatoria_id = this.tipoConvocatoria;
    this.spinner.show();
    this._plazaService.getDatosSolicitar(this.tipoConvocatoria).subscribe(data => {
      this.tiposAyudantias = data['tiposAyudantias'];
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
      this.facultades = data['facultades'];
      this.programas = data['programas'];
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

    this.spinner.show();
    this._plazaService.getPlazaSolicitada(this.plaza.id).subscribe(data => {
      if(data['plazaSolicitada'] !== undefined){
        this.plaza = data['plazaSolicitada'];
      }
      this.spinner.hide();
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });

    this.spinner.show();
    this._plazaService.getCargarAsignaturas().subscribe(data => {
      this.asignaturas = data["asignaturas"];
      this.spinner.hide();
    }, err => {
      let respuesta: RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    });
    //this.asignaturas = this._plazaService.getCargarAsignaturas();
  }

  limpiarPlaza() {
    this.plaza.tipo_plaza_id = null;
  }

  canjearObjeto(){
    if(this.plaza.convocatoria_id){
      let busqueda = this.convocatorias.filter(x => x['id'] == this.plaza.convocatoria_id)[0];
      if(busqueda){
        this.convocatoriaSeleccionada = busqueda;
      }
    }
  }

  guardar(forma: NgForm) {
    this.errores = [];
    if (this.validarAsignaturas()) {
      swal({
        type: 'error',
        title: 'Error',
        text: 'Verifique que en la tabla de asignaturas cumpla con los siguientes requisitos: seleccionar asignatura, puntaje en un rango mayor que 0 y menor que 500 y que una asignatura no este duplicada.'
      });
      return;
    }
    
    if(this.plaza.actividades.length == 0){
      swal({
        type: 'error',
        title: 'Error',
        text: 'Debe agregar por lo menos una actividad a realizar.'
      });
      return;
    }
    
    if (!forma.valid) {
      return;
    }

    this.spinner.show();
    this._plazaService.postEditarSolicitar(this.plaza).subscribe(resp=>{
      this.spinner.hide();
      if(resp['success']){
        swal({
          type: 'success',
          title: 'Realizado',
          text: 'Se ha editado satisfactoriamente la solicitud.',
          showConfirmButton: false,
          timer: 1500
        });
        this.goBack();
        // this.router.navigate(['/plazas/listarPlazasSolicitadas']);
      }else{
        swal({
          type: 'error',
          title: 'Error',
          text: 'Verifique la información.'
        });
        this.errores = resp['errores'];
      }
    }, err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide()
    });
  }


  agregarAsignatura(){
    
    if(this.validarAsignaturas()){
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

  validarAsignaturas(){
    if(this.plaza.asignaturas.length > 0){
      if(this.plaza.asignaturas.filter(x => x.codigo == null).length > 0){
        return true;
      }
      if(this.plaza.asignaturas.filter(x => x.puntaje == null || x.puntaje == 0 || x.puntaje > 500).length > 0){
        return true;
      }
      for(let i = 0; i < this.plaza.asignaturas.length; i++){
        if(this.plaza.asignaturas.filter(x => x.codigo == this.plaza.asignaturas[i].codigo).length > 1){
          return true;
        }
      }
    }

    return false;
  }

  quitarElemento(index, arreglo){
    arreglo.splice(index,1);
  }

  verificarAsignaturas(item:Asignaturas){
    if(this.plaza.asignaturas.filter(x => x.codigo == item.codigo).length > 1){
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

  completarPerfil(){
    let creditos = this.plaza.porcentaja_creditos_requeridos;
    let promedio_minimo = this.plaza.promedio_minimo;
    let factultadesSeleccionas = this.facultades.filter(x =>  this.plaza.facultades.indexOf(x['id']) > -1 ).map(x => x['nombre']).join(", ");
    let programasSeleccionados = this.programas.filter(x => this.plaza.programas.indexOf(x['id']) > -1 ).map(x => x['nombre']).join(", ");
    let asignaturasSeleccionadas = this.plaza.asignaturas.filter(x => x.nombre != null && x.puntaje != null).map(x => `${x.nombre} aprobada con un puntaje de ${x.puntaje}` ).join(", ");
    
    let mensaje:string = "Estudiante que cumpla con los siguientes requisitos:";

    if(creditos){
      if(mensaje.length > 0){mensaje+=" ";}
      mensaje +=  `Porcentaje de créditos aprobados del ${creditos}%.`;
    }
    if(promedio_minimo){
      if(mensaje.length > 0){mensaje+=" ";}
      mensaje +=  `Promedio mínimo de ${promedio_minimo} puntos.`;
    }
    if(factultadesSeleccionas){
      if(mensaje.length > 0){mensaje+=" ";}
      mensaje += `Pertenciente a la facultad de ${factultadesSeleccionas}.`;
    }
    if(programasSeleccionados){
      if(mensaje.length > 0){mensaje+=" ";}
      mensaje += `Pertenciente al programa de ${programasSeleccionados}.`;
    }
    if(asignaturasSeleccionadas){
      if(mensaje.length > 0){mensaje+=" ";}
      mensaje += `Que haya cursado la(s) asignatura(s) ${asignaturasSeleccionadas}.`;
    }
    
    if(mensaje.length > 0){
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

    let act:Actividad = {
      id: null,
      descripcion:""
    };

    this.plaza.actividades.push(act);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
  goBack():void{
    this._location.back();
  }

}
