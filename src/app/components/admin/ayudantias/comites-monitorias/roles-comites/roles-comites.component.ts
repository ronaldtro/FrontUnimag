import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy, DoCheck, AfterContentInit } from '@angular/core';
import { ComiteMonitoriasService } from 'src/app/services/comite-monitorias.service';
import { RolComite } from 'src/app/interfaces/rol-comite.interface';
import { Api } from '../../../../../class/api';
import { Subject } from 'rxjs/Subject';
import { DTConfig } from '../../../../../class/dtconfig';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import { UserService } from 'src/app/services/user.service';
import { FuncionesJSService } from 'src/app/services/funciones-js.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-roles-comites',
  templateUrl: './roles-comites.component.html',
  styleUrls: ['./roles-comites.component.css']
})
export class RolesComitesComponent implements OnInit {

  errores:object[] = [];
  roles:any[] = [];
  rol:RolComite = {};
  api:string = Api.dev;
  index:any;
  // tutorial:any = null;
  appliedFilters:any[] = [];
  @ViewChild(DataTableDirective)
  dtElement:DataTableDirective;
  dtOptions:any = Object.assign({}, DTConfig.dtConf);
  dtTrigger:Subject<string> = new Subject();
  userService:UserService;
  funciones:FuncionesJSService;
  sw = true;

  constructor(private _comiteMonitoriaService:ComiteMonitoriasService, 
              private router:Router, private spinner: NgxSpinnerService, 
              private route:ActivatedRoute,
              private _userService:UserService, private elementRef: ElementRef, 
              private funcionesP: FuncionesJSService, private _location: Location)
  { this.userService = _userService; this.funciones= funcionesP; }

  ngOnInit() {

    this.spinner.show();
    this._comiteMonitoriaService.listarRolesComite().subscribe(data=>{
        this.roles = data['roles'];
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
        this.spinner.hide()
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
      
      if(this.sw){
        this.funciones.addFilter(this, 1, "#filter-estado");
        //this.sw = false;
      }
    }
  }

  backClicked() {
    this._location.back();
  }

  modalAgregarRol(){
    this.errores = [];
    this.rol = {};
    $('#crearRolModal').modal('show');
  }

  crearRol(formulario:NgForm){
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
      this._comiteMonitoriaService.crearRolComite(this.rol).subscribe(data => {
        if(data.json().success){
          
          if(this.rol.id == null){
            this.roles.push(data.json().objRetornado);
            this.rerender();
          }else{
            this.roles[this.index] = data.json().objRetornado;
            this.rerender();
          }

          formulario.resetForm;
          
          setTimeout(() => {
            $('#crearRolModal').modal('hide');
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
            text: this.errores['errores'].errores,
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

  modalEditarRol(rol:any){
    let copy = Object.assign({}, rol);
    this.index = this.roles.indexOf(rol);
    this.errores = [];
    this.rol = copy;
    $('#crearRolModal').modal('show');
  }
  
  cambiarEstadoRol(rol: RolComite){
    this.index = this.roles.indexOf(rol);
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
        this._comiteMonitoriaService.cambiarEstadoRolComite(rol.id).subscribe(data => {
          if(data.json().success){
          this.roles[this.index].estado = !this.roles[this.index].estado;
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
    $('#crearRolModal').modal('hide');
    // remueve el tutorial si se cambia de página
    // if(this.tutorial) this.tutorial.close();
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}
