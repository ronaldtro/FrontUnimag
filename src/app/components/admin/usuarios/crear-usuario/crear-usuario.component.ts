import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuarios } from 'src/app/interfaces/usuarios.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';

declare var $:any;

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  errores:object[]=[];
  usuario:Usuarios;
  usuarios: Usuarios[];
  rolesSelect:any[] = [];

  constructor(private _usuarioService:UsuarioService, private spinner: NgxSpinnerService) { 
    this.usuario= {};
    this.usuarios = [];
  }

  ngOnInit() {
    this._usuarioService.getDatos().subscribe(data => {
      //this.usuarios = data.usuarios;
      this.rolesSelect = data.roles;
    });
  }

  /**
   * Permite mostrar el modal desde otra ventana
   */
  show():void{
    $("#crearUsuarioModal").modal("show");
  }

  /**
   * Permite guardar el usuario ingresado
   * @param formulario formulario para guardar la información del usuario
   */
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

}
