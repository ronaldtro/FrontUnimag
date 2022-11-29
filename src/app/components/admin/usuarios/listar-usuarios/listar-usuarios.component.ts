import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DTConfig } from 'src/app/class/dtconfig';
import { Api } from 'src/app/class/api';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuarios } from 'src/app/interfaces/usuarios.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
declare var $:any; 
declare var jQuery:any;

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuarios[] = [];
  rolesSelect:any[] = [];
  errores:object[]=[];
  usuario:Usuarios = {};
  dtTrigger: Subject<string> = new Subject();
  dtOptions: any = Object.assign({}, DTConfig.dtConf);
  api:string = Api.dev;
  
  constructor(private _usuarioService:UsuarioService,private router:Router,
    private route:ActivatedRoute, private spinner: NgxSpinnerService, private elementRef: ElementRef) { 
      this.spinner.show();
    this._usuarioService.getDatos().subscribe(data => {
      this.usuarios = data.usuarios;
      this.rolesSelect = data.roles;
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover('hide');
  }

  ngAfterViewInit(){
    jQuery(this.elementRef.nativeElement).find('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }

  modalCrearUsuario(){
    this.errores = [];
    this.usuario = {};
    $('#crearUsuarioModal').modal('show');
  }
  guardarUsuario(formulario:NgForm){
    if(!formulario.valid || this.usuario.roles.length == 0){
      return
    }
    this.spinner.show();
    this._usuarioService.guardarUsuario(this.usuario).subscribe(data => {
      if(data.json().success){
        if(this.usuario.id == null){
          this.usuarios.push(data.json().usuario);
        }else{
          for (let index = 0; index < this.usuarios.length; index++) {
            if (this.usuarios[index].id == this.usuario.id) {
              this.usuarios[index] = data.json().usuario;
            }
          }
        }
        
        swal({
            title: "Realizado",
            text: "Acción realizada satisfactoriamente.",
            type: "success",
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
          $('#crearUsuarioModal').modal('hide');
          //this.router.navigate(['/unidades']);
        }, 2000);
      }else{
        this.errores = data.json().errores;
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
  modalEditarUsuario(usuario){
    let copy = Object.assign({}, usuario);
    this.errores = [];
    this.usuario = copy;
    $('#crearUsuarioModal').modal('show');
  }
  cambiarEstado(usuario){
    swal({
      title: 'Cambiar estado',
      text: "¿Está seguro de cambiar el estado?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show()
        this._usuarioService.cambiarEstado(usuario.id).subscribe(data => {
          if(data.json().success){
            for (let index = 0; index < this.usuarios.length; index++) {
              if (this.usuarios[index].id == usuario.id) {
                this.usuarios[index].estado = !this.usuarios[index].estado;
              }
            }
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
              text: 'El usuario no se encuentra registrada en la base de datos',
            });
          }
          this.spinner.hide();
        });
      }
    })
  }
}
