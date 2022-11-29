import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy, DoCheck, AfterContentInit } from '@angular/core';
import { ComiteMonitoriasService } from 'src/app/services/comite-monitorias.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Api } from '../../../../../class/api';
import { Subject } from 'rxjs/Subject';
import { DTConfig } from '../../../../../class/dtconfig';
import { Router, ActivatedRoute } from '@angular/router';
import { Comite } from 'src/app/interfaces/comite.interface';
import { MiembroComite } from 'src/app/interfaces/miembro-comite.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

declare var $:any;
declare var jQuery:any;
// declare var Tutorial:any;

@Component({
  selector: 'app-listar-comites',
  templateUrl: './listar-comites.component.html',
  styleUrls: ['./listar-comites.component.css']
})

export class ListarComitesComponent implements OnInit {

  errores:object[] = [];
  comites:any[] = [];
  comite:Comite = {};
  miembrosComites:MiembroComite[] = [];
  miembroComite:MiembroComite = {};
  editarMiembro:boolean = false;
  facultades:any[] = [];
  facultad:any = null;
  unidades:any[] = [];
  personas:any[] = [];
  usuariosSelect:any[] = [];
  persona:any = {};
  tipoUsuarios:any[] = [];
  tipoUsuario:any = {};
  rolesComites:any[] = [];
  api:string = Api.dev;
  index:any = null;
  indexMiembro:any = null;
  // tutorial:any = null;
  appliedFilters:any[] = [];
  @ViewChild(DataTableDirective)
  dtElement:DataTableDirective;
  dtOptions:any = Object.assign({}, DTConfig.dtConf);
  dtTrigger:Subject<string> = new Subject();
  userService:UserService;
  funciones:FuncionesJSService;
  sw:boolean = true;
  
  constructor(private _comiteMonitoriaService:ComiteMonitoriasService,
              private _usuarioService:UsuarioService,
              private router:Router, private spinner: NgxSpinnerService, 
              private route:ActivatedRoute,
              private _userService:UserService, private elementRef: ElementRef,
              private funcionesP: FuncionesJSService, private _location: Location)
  { this.userService = _userService; this.funciones= funcionesP; }
  
  ngOnInit() {
    this.spinner.show();
    this._comiteMonitoriaService.listarComites().subscribe(data=>{
        this.comites = data['comites'];
        this.miembrosComites = data['miembrosComites'];
        this.facultades = data['facultades'];
        this.unidades = data['unidades'];
        this.rolesComites = data['roles'];
        this.personas = data['personas'];
        this.tipoUsuarios = data['tipoUsuarios'];
        this.initDtOptions();
        this.dtTrigger.next();
        this.spinner.hide();
      }, err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide();
    });    
  }

  initDtOptions(){
    this.dtOptions.order = [[ 0, "desc" ]];
    this.dtOptions.dom = "Bfrtip";
    this.dtOptions.retrieve = true;
    this.dtOptions.buttons = [
      {
        extend: 'copy',
        text: 'Copiar',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'print',
        text: 'Imprimir',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      },
      {
        extend: 'excel',
        text: 'Excel',
        exportOptions: {
          columns: [ 0, 1, 2, 3]
        }
      }
    ];
    this.dtOptions.stateSave = false;
    this.dtOptions.initComplete = () => {
      
      if (this.sw){
        this.funciones.addFilter(this, 0, "#filter-fecha_creacion");      
        this.funciones.addFilter(this, 2, "#filter-facultad");
        this.funciones.addFilter(this, 3, "#filter-estado");
        this.sw = false;
      }
    }
  }

  backClicked() {
    this._location.back();
  }

  cambiarEstadoComite(comite: Comite){
    this.index = this.comites.indexOf(comite);
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: 'btn btn-success m-1',
      cancelButtonClass: 'btn m-1',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._comiteMonitoriaService.cambiarEstado(comite.id).subscribe(data => {
          if(data.json().success){
          this.comites[this.index].estado = !this.comites[this.index].estado;
          this.rerender();
            swal({
              title: 'Acción realizada',
              text: 'Acción realizada satisfactoriamente.',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }else{
            swal({
              type: 'error',
              title: 'Error',
              text: 'El comité no se encuentra registrado en la base de datos.',
            });
          }
          this.spinner.hide();
        });
      }
    })
  }

  rerender(): void {
    if(this.dtElement){
      if(this.dtElement.dtInstance){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      }
    }
  }

  ngAfterViewChecked(): void {
    this.funciones.reemplazarBotonesDatatable();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
    $('#crearComiteModal').modal('hide');
    // remueve el tutorial si se cambia de página
    // if(this.tutorial) this.tutorial.close();
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  llenarUsuarios(rolId: number){

    if (rolId == 3) this.miembroComite.agregarRolComite = false;

    if (this.usuariosSelect.length > 0){

      this.usuariosSelect = [];
      if (!this.editarMiembro) this.miembroComite.persona_id = null;
    }
    
    for (let i = 0; i < this.personas.length; i++){
      
      if (rolId == 3) { // 3 = Representante Estudiantil ante el Consejo de Facultad

        if (this.personas[i].codFacultad == this.comite.facultad_cod)
          this.usuariosSelect.push(this.personas[i]);
      } else {
        if (this.personas[i].codFacultad == null)
          this.usuariosSelect.push(this.personas[i]);
      }
    }
  }

  modalAgregarComite(){

    this.errores = [];
    this.comite = {};
    $('#crearComiteModal').modal('show');
    if(this.facultad == 0) this.facultad = null;
  }

  crearComite(formulario:NgForm){
    
    if(!formulario.valid){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this.spinner.show();
      this._comiteMonitoriaService.crearComite(this.comite).subscribe(data => {
        if(data.json().success){
          
          if(this.comite.id == null){
            this.comites.push(data.json().objRetornado);
            this.rerender();
          }else{
            this.comites[this.index] = data.json().objRetornado;
            this.rerender();
          }

          this.facultad = null;
          formulario.resetForm;
          
          setTimeout(() => {
            $('#crearComiteModal').modal('hide');
            this.spinner.hide();
          }, 100);

          swal({
              title: "Realizado",
              text: "Acción realizada satisfactoriamente.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
          });
        }else{
          this.errores = data.json().errores;
          swal({
            type: 'error',
            title: 'Error',
            text: this.errores[0]['errores'][0]['ErrorMessage'],
          });
        }
        
      }), err=> {
        let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
        swal({
          type: 'error',
          title: 'Error',
          text: respuesta.msg,
        });
        this.spinner.hide()
      }
    }
  }

  modalEditarComite(comite:any){

    let copy = Object.assign({}, comite);
    this.index = this.comites.indexOf(comite);
    this.errores = [];
    this.comite = copy;
    
    for (var i = 0; i < this.facultades.length ; i++){
      
      if (this.facultades[i].nombre == copy.facultad){
        
        this.comite.facultad_id = this.facultades[i].id;
        this.comite.facultad_cod = this.facultades[i].codigo;
        break;
      }
    }
    $('#crearComiteModal').modal('show');
  }

  modalGestionarMiembros(comite:any){

    this.index = this.comites.indexOf(comite);
    let copy = Object.assign({}, comite);
    this.comite = copy;
    this.editarMiembro = false;
    
    for (let i = 0; i < this.facultades.length; i++) {
      
      if (this.facultades[i].nombre == this.comite.facultad) {
        
        this.comite.facultad_id = this.facultades[i].id;
        this.comite.facultad_cod = this.facultades[i].codigo;
        break;
      }
    }

    for (let i = 0; i < this.miembrosComites.length; i++) {
      for (let j = 0; j < this.comite.miembros.length; j++) {

        if (this.miembrosComites[i].id == this.comite.miembros[j].id) {

         this.comite.miembros[j].nombre = this.miembrosComites[i].nombre;
         this.comite.miembros[j].rol_id = this.miembrosComites[i].rol_id;
         this.comite.miembros[j].email = this.miembrosComites[i].email;
        }
      }
    }

    $('#gestionarMiembrosModal').modal('show');
  }

  modalAgregarMiembro(){

    this.editarMiembro = false;
    this.miembroComite = {};
    this.miembroComite.agregarRolComite = false;
    this.errores = [];
    $('#gestionarMiembrosModal').modal('hide');
    $('#agregarMiembroModal').modal('show');
  }

  modalEditarMiembro(miembro:any){

    this.indexMiembro = this.comite.miembros.indexOf(miembro);
    let copy = Object.assign({}, miembro);
    this.miembroComite = copy;
    this.editarMiembro = true;
    this.llenarUsuarios(this.miembroComite.rol_id);
    this.errores = [];

    $('#gestionarMiembrosModal').modal('hide');
    $('#agregarMiembroModal').modal('show');
  }

  cancelarAgregarMiembro(agregarMiembroComite:NgForm){
    
    agregarMiembroComite.resetForm();
    this.errores = [];
    $('#agregarMiembroModal').modal('hide');
    $('#gestionarMiembrosModal').modal('show');
  }

  agregarMiembro(formulario:NgForm){

    if(!formulario.valid){
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario",
        timer: 2000,
        showConfirmButton: false
      });
    } else {

      this.spinner.show();
      this.miembroComite.comite_id = this.comite.id;

      if (!this.editarMiembro) {
        //Agregar
        this._comiteMonitoriaService.agregarMiembro(this.miembroComite).subscribe(data => {
          if(data.json().success){

            this.comite.miembros.push(data.json().objRetornado);
            this.miembrosComites.push(data.json().objRetornado);
            this.miembroComite = {};
            formulario.resetForm();
            this.errores = [];
            this.rerender();
            
            setTimeout(() => {
              $('#agregarMiembroModal').modal('hide');
              $('#gestionarMiembrosModal').modal('show');
              this.spinner.hide();
            }, 100);
    
            swal({
                title: "Realizado",
                text: "Acción realizada satisfactoriamente.",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
          }else{
            this.errores = [];
            for (let i = 0; i < data.json().errores.length; i++) {
              if (data.json().errores[i].errores.length > 0) {
                for (let j = 0; j < data.json().errores[i].errores.length; j++)
                  this.errores.push(data.json().errores[i].errores[j]);
              }
            }
            swal({
              type: 'error',
              title: 'Error',
              text: this.errores[0]['ErrorMessage'],
            });
            this.spinner.hide();
          }
        }), err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide();
        }
      } else {
        //Editar
        this._comiteMonitoriaService.agregarMiembro(this.miembroComite).subscribe(data => {
          if(data.json().success){
            this.comite.miembros[this.indexMiembro] = data.json().objRetornado;
            this.miembrosComites[this.indexMiembro] = data.json().objRetornado;
            this.miembroComite = {};
            formulario.resetForm();
            this.errores = [];
            this.rerender();
            
            setTimeout(() => {
              $('#agregarMiembroModal').modal('hide');
              $('#gestionarMiembrosModal').modal('show');
              this.spinner.hide();
            }, 100);
    
            swal({
                title: "Realizado",
                text: "Acción realizada satisfactoriamente.",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
          }else{
            this.errores = [];
            for (let i = 0; i < data.json().errores.length; i++) {
              if (data.json().errores[i].errores.length > 0) {
                for (let j = 0; j < data.json().errores[i].errores.length; j++)
                  this.errores.push(data.json().errores[i].errores[j]);
              }
            }
            swal({
              type: 'error',
              title: 'Error',
              text: this.errores[0]['ErrorMessage'],
            });
            this.spinner.hide();
          }
        }), err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        }
      }
    }
  }

  eliminarMiembro(miembro:any){
    swal({
      title: 'Eliminar miembro',
      text: '¿Está seguro de realizar esta acción?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      reverseButtons:true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then((res) => {
      if (res.value) {
        this.spinner.show();
        this._comiteMonitoriaService.eliminarMiembro(miembro).subscribe(data => {
          if(data.json().success){
            
            for (let i = 0; i < this.comite.miembros.length; i++) {
              if (this.comite.miembros[i].id == data.json().objRetornado.id)
                this.comite.miembros.splice(i, 1);
            }
            this.errores = [];
            this.rerender();
            
            setTimeout(() => {
              this.spinner.hide();
            }, 100);

            swal({
                title: "Realizado",
                text: "Acción realizada satisfactoriamente.",
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
          }else{
            this.errores = [];
            for (let i = 0; i < data.json().errores.length; i++) {
              if (data.json().errores[i].errores.length > 0) {
                for (let j = 0; j < data.json().errores[i].errores.length; j++)
                  this.errores.push(data.json().errores[i].errores[j]);
              }
            }
            swal({
              type: 'error',
              title: 'Error',
              text: this.errores[0]['ErrorMessage'],
            });
            this.spinner.hide();
          }
        }), err=> {
          let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
          swal({
            type: 'error',
            title: 'Error',
            text: respuesta.msg,
          });
          this.spinner.hide()
        }
      } else if (res.dismiss === swal.DismissReason.cancel) {
        return ;
      }
    });
  }

  nuevoUsuarioModal(usuarioForm:NgForm) {
    
    this.miembroComite.agregarRolComite = null;
    usuarioForm.resetForm();
    this.errores = [];
    this.persona = {};
    $('#agregarMiembroModal').modal('hide');
    $('#nuevoUsuarioM').modal('show');
  }

  cancelarGuardarUsuario(usuarioForm:NgForm) {
    
    let agregarRolComite = this.miembroComite.agregarRolComite;
    usuarioForm.resetForm();
    this.miembroComite.agregarRolComite = agregarRolComite;
    this.errores = [];
    $('#nuevoUsuarioM').modal('hide');
    $('#agregarMiembroModal').modal('show');
  }
 
  guardarUsuario(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    
    this.spinner.show();
    this._comiteMonitoriaService.crearPersona(this.persona).subscribe(data => {
      if(data.json().success){
        this.personas.push(data.json().persona);
        this.llenarUsuarios(this.miembroComite.rol_id);
        this.miembroComite.persona_id = data.json().persona.id;
        this.miembroComite.user_id = data.json().persona.user_id;
        this.miembroComite.agregarRolComite = data.json().persona.agregarRolComite;
        this.miembroComite.email = data.json().persona.email;
        formulario.resetForm();
        this.errores = [];
        this.rerender();
        this.spinner.hide();

        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });

        $('#nuevoUsuarioM').modal('hide');
        $('#agregarMiembroModal').modal('show');
      }else{
        this.errores = [];
        for (let i = 0; i < data.json().errores.length; i++) {
          if (data.json().errores[i].errores.length > 0) {
            for (let j = 0; j < data.json().errores[i].errores.length; j++)
              this.errores.push(data.json().errores[i].errores[j]);
          }
        }
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
        this.spinner.hide();
      }
    }),error=>swal({
      type: 'error',
      title: 'Error',
      text: 'No se pudo efectuar la operación. Intente más tarde.',
    });
    this.spinner.hide();
  }

  // initTutorial(){
  //   this.tutorial = new Tutorial(
  //     {
  //       intro:{text:'<p class="h2 text-white text-uppercase font-weight-bold container">Módulo de administración de convocatorias</p><p class="container">El sistema permite visualizar y registrar las convocatorias relacionadas con el periodo vigente en la Universidad del Magdalena. A continuación, podrá conocer los elementos que contiene esta ventana que le permitirán administrar las convocatorias en el sistema.</p>'},
  //       elements:[
  //         {id: '#btn-crear', text: 'El botón "<span class="fas fa-plus"></span> AGREGAR CONVOCATORIA" permite añadir una nueva convocatoria al sistema.'},
  //         {id: '#btn-filtros', text: 'El botón "<span class="fa fa-filter"></span> Filtrar registros" permite visualizar u ocultar los filtros disponibles que posee el sistema para esta ventana con los cuales podrá realizar una búsqueda entre los registros listados en la tabla.'},
  //         {id: '#btn-informacion', text: 'El botón "<span class="fa fa-question-circle"></span>" permite visualizar un cuadro de texto con información de ayuda para esta ventana.'},
  //         {id: '#table-convocatorias', text: 'Esta tabla contiene las convocatorias que se han registrado en el sistema. En la columna "Acciones" podrá encontrar botones que le permitirán administrar la información de los registros listados.'},
  //         {id: '.btn-detalle', text: 'El botón "<span class="fas fa-info-circle"></span>" permite ver el detalle completo de la convocatoria.', count: 1},
  //         {id: '.btn-editar', text: 'El botón "<span class="fas fa-pen"></span>" permite modificar la información ingresada en la convocatoria.', count: 1},
  //         {id: '.btn-activar', text: 'El botón "<span class="fas fa-eye"></span>" permite activar la convocatoria para que esta se visualice en otros módulos del sistema. Esto no afecta a los registros que usen esta convocatoria actualmente.', count: 1},
  //         {id: '.btn-desactivar', text: 'El botón "<span class="fas fa-eye-slash"></span>" permite desactivar la convocatoria para que no se visualice en los demás módulos del sistema. Esto no afecta a los registros que usen esta convocatoria actualmente.', count: 1},
  //         {id: '.btn-verEstudiantes', text: 'El botón "<span class="fas fa-users"></span>" permite ver los estudiantes que se encuentran seleccionados en la convocatoria.', count: 1},
  //         {id: '.btn-masAcciones', text: 'El botón "<span class="fas fa-ellipsis-v"></span>" permite acceder a más acciones como: ver soporte, ver plazas, exportar estudiantes postulados, ver el reporte de cantidad de estudiantes por plaza y ver el reporte de horas realizadas por estudiante, tenga en cuenta que algunas de estas acciones puede estar disponible o no dependiendo de la etapa en la que se encuentre la convocatoria y del rol del usuario.', count: 1},
  //         {id: '#historialConvocatorias', text: 'El link "<a style="pointer-events: none; cursor: default;" href="">Ver el historial completo de convocatorias</a>" permite visualizar el listado completo de convocatorias que han existido a lo largo del tiempo.'},
  //         {id: '.dt-buttons', text: 'Los botones "<span class="far fa-copy"></span> <span class="fas fa-print"></span> <span class="far fa-file-excel"></span>" permiten copiar los datos visualizados en la tabla, generar un vista de impresión o exportarlos en formato Excel.'},
  //         {id: '#table-convocatorias_filter', text: 'La barra de búsqueda permite buscar un registro especifico escribiendo el nombre, el estado de control o cualquier otra palabra que este relacionada con la convocatoria que desea encontrar.'},
  //       ]
  //     });
  //     this.tutorial.start();
  // }

}
