import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent implements OnInit {

  

  changePass:any ={
    actualPassword:null,
    newPassword:null,
    confirmPassword:null
  }

  buildObject: any ={
    actualPassword:null,
    newPassword:null,
    confirmPassword:null
  }
  error: any [] = []; 


  constructor( private _userservice : UserService , private spinner: NgxSpinnerService,   private router:Router, ) { }

  ngOnInit() {
    
  }

  changePasswords(forma:NgForm){
  console.log(forma);
    this.spinner.show();

    if (!forma.valid) {
      swal({
        type: "error",
        title: "Error",
        text: "Complete los campos del formulario.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
      return;
    }

      if (this.buildObject.newPassword != this.buildObject.confirmPassword) {
      swal({
        type: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        timer: 2000,
        showConfirmButton: false
      });
      this.spinner.hide();
      return;
    }

      this.changePass.actualPassword =  encodeURIComponent(this.buildObject.actualPassword);
      this.changePass.newPassword =  encodeURIComponent(this.buildObject.newPassword);
      this.changePass.confirmPassword =  encodeURIComponent(this.buildObject.confirmPassword);

    this._userservice.changePassword(this.changePass).subscribe(data =>{
      if (data['success']) {
        swal({
          type:"success",
          title:"Realizado",
          text: "Acción realizada satisfactoriamente",
          timer: 2000,
          showConfirmButton:false
        });
        this.error = [];
        this.spinner.hide();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1800);
      } else{
        if (data['errores'] != null) {
            this.error = data['errores'];
            swal({
              type: "error",
              title: "Error",
              text: "Corrige los errores",
              timer: 2000,
              showConfirmButton: false
            });
            this.spinner.hide();
        } else{

          swal({
            type: "error",
            title: "Error",
            text: data['Error'],
            confirmButtonText: "Aceptar",
            showConfirmButton: true
          });
          this.spinner.hide();
        }
      
      }
    });
  }


}
