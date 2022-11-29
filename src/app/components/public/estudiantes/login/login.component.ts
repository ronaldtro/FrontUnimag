import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:any = {
    codigo:null,
    password:null
  };
  redirect:string;

  constructor(private _userService:UserService, private router:Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) { }
  

  ngOnInit() {
    if(this._userService.isLogin()){
     
      this.route.queryParams.subscribe(params => {
        if(params['redirect']){
          this.redirect=params['redirect'];
        }else{
          //this.router.navigate(['/estudiantes/perfil']);
          this.router.navigate(['/estudiantes/dashboard']);
        }
      });
    }

    this.route.queryParams.subscribe(params => {
      if(params['redirect']){
        this.redirect=params['redirect'];
      }
    });
  }

  enviar(forma:NgForm){
    if(!forma.valid){
      return;
    }
    this.spinner.show();
    this._userService.userAuthentication(this.user.codigo, this.user.password).subscribe((data:any) => {
      localStorage.setItem('userToken',data.access_token);
      let role = JSON.parse(data.role);
      localStorage.setItem('userRoles',JSON.stringify(role.userRoles));
      localStorage.setItem('userTipos',JSON.stringify(role.tipos));
      let actualDate = new Date();
      actualDate.setSeconds(actualDate.getSeconds() + data.expires_in );
      localStorage.setItem('expires_in', (actualDate.getTime()).toString());
     if(this.redirect){
        this.router.navigate([this.redirect]);
      }else{
        //this.router.navigate(['/estudiantes/perfil']);
        this.router.navigate(['/estudiantes/dashboard']);
      }
      this.spinner.hide();
    },(err : HttpErrorResponse)=>{
      this.spinner.hide();
      swal({
        type: 'error',
        title: 'Error',
        text: 'Verifique la información y vuelva a intentarlo.'
      })
    });

  }

}
