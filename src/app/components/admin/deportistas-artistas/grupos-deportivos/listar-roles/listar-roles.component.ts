import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { GruposDeportivosService } from 'src/app/services/grupos-deportivos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaServidor } from 'src/app/class/respuesta-servidor';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { RolesArtistasDeportistasService } from 'src/app/services/roles-artistas-deportistas.service';

declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-roles',
  templateUrl: './listar-roles.component.html',
  styleUrls: ['./listar-roles.component.css']
})
export class ListarRolesComponent implements OnInit, OnDestroy {
  
  /**
   * Se guardan todos los roles que vienen del Backend
   */
  listaRoles : any[] = [];
  
  /** 
   * Se guardan los datos de un rol que se va a crear o editar
   */
  rol : any = {};

  idGrupo : number;

  errores:object[]=[];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);

  constructor(private _rolesService: RolesArtistasDeportistasService ,private router:Router,private route:ActivatedRoute, 
    private spinner: NgxSpinnerService, private elementRef: ElementRef) {
    }
    
  /**
   * Obtiene los roles que han sido creados anteriormente.
   */
  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(params=>{
      this.idGrupo = params.idGrupo;
      this._rolesService.getRoles(this.idGrupo).subscribe(data => {
        
        this.listaRoles = data['roles'];
        this.initDtOptions();
        this.dtTrigger.next();
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
  }

  /**
   * Abre el modal para crear roles.
   */
  modalCrearRol(){
    this.errores = [];
    this.rol = {};
    $('#crearRolModal').modal('show');
  }

  /**
   * Envía los datos del rol para guardarlo en la base de datos.
   * 
   * @param formulario 
   */
  guardarRol(formulario:NgForm){
    if(!formulario.valid){
      return
    }
    
    this.spinner.show();
    this.rol.idGrupo = this.idGrupo;
    this._rolesService.guardarRol(this.rol).subscribe(data => {
      if(data['success']){
        if(this.rol.id == null){
          this.listaRoles.push(data['rol']);
        }else{
          for (let index = 0; index < this.listaRoles.length; index++) {
            if (this.listaRoles[index].id == this.rol.id) {
              this.listaRoles[index] = data['rol'];
            }
          }
        }
        formulario.resetForm();
        this.rerender();
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#crearRolModal').modal('hide');
        }, 2000);

      }else{
        this.errores = data['errores'];
        swal({
          type: 'error',
          title: 'Error',
          text: 'No se pudo efectuar la operación. Intente más tarde.',
        });
      }
      this.spinner.hide();
    }), err =>{
      let respuesta:RespuestaServidor = new RespuestaServidor(err.status);
      swal({
        type: 'error',
        title: 'Error',
        text: respuesta.msg,
      });
      this.spinner.hide();
    };
  }
  
  /**
   * Abre modal para editar los datos de un rol.
   * 
   * @param rol Contiene los datos de un rol.
   */
  modalEditarRol(rol){
    let copy = Object.assign({}, rol);
    this.errores = [];
    this.rol = copy;
    $('#crearRolModal').modal('show');
  }

  /**
   * Habilita o inhabilita el rol que se haya seleccionado.
   * 
   * @param rol Contiene los datos de un rol.
   */
  cambiarEstado(rol){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._rolesService.cambiarEstado(rol.id).subscribe(data => {
          if(data['success']){
            for (let index = 0; index < this.listaRoles.length; index++) {
              if (this.listaRoles[index].id == rol.id) {
                this.listaRoles[index].estado = !this.listaRoles[index].estado;
                break;
              }
            }
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
              text: 'El rol no se encuentra registrada en la base de datos',
            });
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
      }
    })
  }

  initDtOptions(){
    this.dtOptions.order = [[ 1, "asc" ],[ 0, "asc" ]];
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

}